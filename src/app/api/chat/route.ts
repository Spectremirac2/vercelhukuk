// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { WebSearchEvidenceProvider } from "@/rag/web-search";
import { FileSearchEvidenceProvider } from "@/rag/file-search";
import { EvidenceProvider } from "@/rag/evidence";
import { addCitations } from "@/utils/citation";
import { isAllowedDomain, DEFAULT_ALLOWED_DOMAINS } from "@/utils/domains";
import { validateChatRequest } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limit";
import { withTimeout, deduplicateSources, formatUserError } from "@/lib/utils";
import OpenAI from "openai";
import { enrichPromptWithFullLegalContext, getDatabaseStats } from "@/lib/legal-knowledge-service";

// Configuration
// Varsayılan Gemini API Key (demo amaçlı - production'da env'den alınmalı)
const DEFAULT_DEMO_GEMINI_KEY = "AIzaSyBTe1pKngLSJyV3lJdrHstpRRkPDeNqztU";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || DEFAULT_DEMO_GEMINI_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DEFAULT_EVIDENCE_PROVIDER = process.env.EVIDENCE_PROVIDER || "web_search";
const ALLOWED_SOURCE_DOMAINS = process.env.ALLOWED_SOURCE_DOMAINS
  ? process.env.ALLOWED_SOURCE_DOMAINS.split(",").map((d) => d.trim())
  : DEFAULT_ALLOWED_DOMAINS;
const DEBUG = process.env.DEBUG === "true" || process.env.NODE_ENV === "development";
const REQUEST_TIMEOUT_MS = 60000; // 60 seconds

// Default models for each provider
const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash-exp";
const DEFAULT_OPENAI_MODEL = "gpt-4o";

// System instruction for legal research
const SYSTEM_INSTRUCTION = `
Sen Türk Hukuku için uzmanlaşmış bir Hukuk Araştırma Asistanısın.
Görevin: Türk hukuk kaynaklarını kullanarak hukuki sorulara doğru ve kanıtlara dayalı yanıtlar vermek.

BİLGİ TABANIM:
- ${getDatabaseStats().totalLaws} temel kanun ve ${getDatabaseStats().totalArticles} kritik madde
- ${getDatabaseStats().totalPrecedents} güncel Yargıtay/Danıştay emsal kararı  
- ${getDatabaseStats().totalConcepts} hukuki kavram tanımı
- Kapsamlı Türk hukuk mevzuatı ve içtihat bilgisi

KURALLAR:
1. DAYANAK: Her iddia sağlanan kaynaklarla (Web, Dosya veya Veritabanı) desteklenmelidir.
2. ALINTI: Spesifik Kanun Adı, Madde Numarası ve Fıkrayı belirt. Örn: TBK m.49, İK m.24/II
3. EMSAL: İlgili Yargıtay/Danıştay kararlarına atıf yap. Örn: Y. 9. HD 2020/1234 K.
4. UYDURMA YASAK: Kaynak bulamıyorsan, "Mevcut kaynaklarla bunu doğrulayamıyorum" de.
5. EKSİK BİLGİ: Bilgiler eksikse, kullanıcıdan iste.
6. METODOLOJİ (IRAC):
   - **Mesele (Issue):** Hukuki soruyu açıkça belirt.
   - **Kural (Rule):** Uygulanabilir kanun/yönetmelikleri listele (alıntılarla).
   - **Emsal (Precedent):** İlgili içtihatları belirt.
   - **Analiz (Analysis):** Kuralı olaylara uygula.
   - **Sonuç (Conclusion):** Özet cevap ver.
7. FORMAT:
   - **Özet:** Kısa cevap.
   - **Uygulanabilir Hukuki Dayanak:** Alıntılı madde işaretleri.
   - **İlgili Emsal Kararlar:** (varsa)
   - **Analiz ve Değerlendirme:** Detaylı açıklama.
   - **Pratik Öneriler:** Uygulanabilir adımlar.
   - **Eksik Bilgiler:** (varsa).
   - **Uyarı:** "Bu bilgi hukuki tavsiye niteliği taşımaz."
8. DİL: Türkçe.
`;

export async function POST(req: NextRequest) {
  // Check rate limit
  const rateLimitResult = checkRateLimit(req, "chat");
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: "Çok fazla istek gönderildi. Lütfen bir dakika bekleyin.",
        code: "RATE_LIMIT_EXCEEDED",
      },
      {
        status: 429,
        headers: rateLimitResult.headers,
      }
    );
  }

  try {
    const body = await req.json();
    
    // DEBUG: Log incoming request
    console.log("[API] Incoming request body:", JSON.stringify(body, null, 2));
    
    // Pre-filter messages to handle null/empty content before validation
    if (body.messages && Array.isArray(body.messages)) {
      body.messages = body.messages.filter(
        (m: { content?: string }) => m.content && typeof m.content === 'string' && m.content.trim().length > 0
      );
      console.log("[API] Filtered messages count:", body.messages.length);
    }

    // Validate request with Zod
    const validation = validateChatRequest(body);
    if (!validation.success) {
      console.error("[API] Validation failed:", validation.error, validation.issues);
      return NextResponse.json(
        {
          error: `Geçersiz istek: ${validation.error}`,
          code: "VALIDATION_ERROR",
          details: validation.issues,
        },
        { status: 400, headers: rateLimitResult.headers }
      );
    }

    const { 
      conversationId, 
      messages, 
      strictMode, 
      storeId, 
      useFiles,
      provider: clientProvider,
      apiKey: clientApiKey,
      model: clientModel,
    } = validation.data;

    // Determine which provider and API key to use
    const useOpenAI = clientProvider === "openai" && clientApiKey;
    const effectiveApiKey = clientApiKey || (useOpenAI ? OPENAI_API_KEY : GEMINI_API_KEY);
    const effectiveProvider = useOpenAI ? "openai" : "gemini";
    const effectiveModel = clientModel || (useOpenAI ? DEFAULT_OPENAI_MODEL : DEFAULT_GEMINI_MODEL);

    // Check API key
    if (!effectiveApiKey) {
      console.error(`Missing ${effectiveProvider} API Key`);
      return NextResponse.json(
        {
          error: "API anahtarı bulunamadı. Lütfen Ayarlar'dan API anahtarınızı girin.",
          code: "MISSING_API_KEY",
        },
        { status: 400, headers: rateLimitResult.headers }
      );
    }

    // If using OpenAI, use direct OpenAI API without RAG grounding
    if (useOpenAI) {
      return await handleOpenAIChat(
        effectiveApiKey,
        effectiveModel,
        messages,
        rateLimitResult.headers
      );
    }

    // Initialize provider based on client request or default (Gemini with RAG)
    let provider: EvidenceProvider;
    let usingFileSearch = false;

    if (useFiles && storeId) {
      provider = new FileSearchEvidenceProvider(effectiveApiKey, storeId);
      usingFileSearch = true;
    } else if (DEFAULT_EVIDENCE_PROVIDER === "file_search" && storeId) {
      provider = new FileSearchEvidenceProvider(effectiveApiKey, storeId);
      usingFileSearch = true;
    } else {
      provider = new WebSearchEvidenceProvider(effectiveApiKey);
    }

    // Format messages for Gemini
    const geminiMessages = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Prepend system instruction and legal context to first user message
    if (geminiMessages.length > 0 && geminiMessages[0].role === "user") {
      const userQuery = geminiMessages[0].parts[0].text;
      
      // Enrich with legal knowledge context from internal database (full version with FAQ, updates, etc.)
      const legalContext = enrichPromptWithFullLegalContext(userQuery);
      
      geminiMessages[0].parts[0].text =
        SYSTEM_INSTRUCTION +
        (legalContext ? `\n\n### Dahili Bilgi Tabanı Referansları:${legalContext}` : "") +
        "\n\nKullanıcı Sorgusu: " +
        userQuery;
    }

    // Call provider with timeout
    const result = await withTimeout(
      provider.getEvidenceAndAnswer(conversationId || "default", geminiMessages),
      REQUEST_TIMEOUT_MS,
      "İstek zaman aşımına uğradı. Lütfen tekrar deneyin."
    );

    const { answerText, sources, groundingMetadata } = result;

    // Check if we have any sources from web grounding (used for strict mode validation)
    const hasGroundingSources =
      (groundingMetadata?.groundingSupports && groundingMetadata.groundingSupports.length > 0) ||
      (groundingMetadata?.groundingChunks && groundingMetadata.groundingChunks.length > 0);

    // Note: We no longer refuse when there are no web sources.
    // The AI can answer based on internal knowledge base and general legal knowledge.
    // Only strictMode enforces strict source requirements.
    void hasGroundingSources; // Used below for strict mode validation

    // Process citations
    const processedText = addCitations(answerText, groundingMetadata);

    // Deduplicate sources using normalized URLs
    const uniqueSources = deduplicateSources(sources);

    // Mark sources as trusted or secondary
    const enrichedSources = uniqueSources.map((s) => ({
      ...s,
      isTrusted: isAllowedDomain(s.uri, ALLOWED_SOURCE_DOMAINS),
    }));

    // Strict Mode validation
    if (strictMode && !usingFileSearch) {
      const trustedSources = enrichedSources.filter((s) => s.isTrusted);

      if (uniqueSources.length < 2 || trustedSources.length < 1) {
        return NextResponse.json(
          {
            assistantText: `## Strict Mode: Yetersiz Güvenilir Kaynak

Bu sorgu için yeterli güvenilir kaynak bulunamadı.

**Gereksinimler:**
- En az 2 kaynak gerekli (mevcut: ${uniqueSources.length})
- En az 1 resmi kaynak gerekli (mevcut: ${trustedSources.length})

**Resmi Kaynaklar:**
mevzuat.gov.tr, resmigazete.gov.tr, anayasa.gov.tr, yargitay.gov.tr, danistay.gov.tr, barobirlik.org.tr

**Öneriler:**
- Sorgunuzu daha spesifik hale getirin
- Belirli bir kanun veya mahkeme kararı hakkında soru sorun
- Strict Mode'u kapatarak ikincil kaynaklarla devam edebilirsiniz`,
            sources: enrichedSources,
            ...(DEBUG && {
              debug: {
                groundingMetadata,
                webSearchQueries: groundingMetadata?.webSearchQueries,
                strictModeRejection: true,
              },
            }),
          },
          { headers: rateLimitResult.headers }
        );
      }
    }

    return NextResponse.json(
      {
        assistantText: processedText,
        sources: enrichedSources,
        ...(DEBUG && {
          debug: {
            groundingMetadata,
            webSearchQueries: groundingMetadata?.webSearchQueries,
          },
        }),
      },
      { headers: rateLimitResult.headers }
    );
  } catch (error: unknown) {
    console.error("API Error:", error);

    // Format error for user (hide internal details)
    const userMessage = formatUserError(error);

    return NextResponse.json(
      {
        error: userMessage,
        code: "INTERNAL_ERROR",
        ...(DEBUG && {
          debug: {
            originalError:
              error instanceof Error ? error.message : String(error),
          },
        }),
      },
      { status: 500, headers: rateLimitResult.headers }
    );
  }
}

/**
 * Handle chat with OpenAI API
 * Note: OpenAI doesn't have built-in web search grounding like Gemini,
 * so responses won't include automatic source citations.
 */
async function handleOpenAIChat(
  apiKey: string,
  model: string,
  messages: Array<{ role: string; content: string }>,
  headers: HeadersInit
): Promise<NextResponse> {
  const openai = new OpenAI({ apiKey });

  // Get the last user message for context enrichment
  const lastUserMessage = messages.filter(m => m.role === "user").pop();
  const legalContext = lastUserMessage 
    ? enrichPromptWithLegalContext(lastUserMessage.content)
    : "";

  const systemMessage = `${SYSTEM_INSTRUCTION}
${legalContext ? `\n### Dahili Bilgi Tabanı Referansları:${legalContext}` : ""}

NOT: Bu yanıt OpenAI modeli tarafından oluşturulmaktadır. Web araması yapılmamıştır.
Dahili bilgi tabanımızdaki referansları kullan ve mümkünse resmi kaynaklardan doğrulama öner.`;

  const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: systemMessage },
    ...messages.map((msg) => ({
      role: msg.role === "assistant" ? "assistant" as const : "user" as const,
      content: msg.content,
    })),
  ];

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 4096,
    });

    const assistantText = completion.choices[0]?.message?.content || "";

    // Add disclaimer for OpenAI responses (no automatic source grounding)
    const responseWithDisclaimer = `${assistantText}

---
*Bu yanıt ${model} modeli tarafından oluşturulmuştur. Otomatik kaynak doğrulaması yapılmamıştır.*`;

    return NextResponse.json(
      {
        assistantText: responseWithDisclaimer,
        sources: [], // OpenAI doesn't provide automatic source grounding
        provider: "openai",
        model,
        ...(DEBUG && {
          debug: {
            usage: completion.usage,
            finishReason: completion.choices[0]?.finish_reason,
          },
        }),
      },
      { headers }
    );
  } catch (error) {
    console.error("OpenAI API Error:", error);

    const errorMessage = error instanceof Error ? error.message : "OpenAI API hatası";
    
    // Check for common OpenAI errors
    if (errorMessage.includes("401") || errorMessage.includes("invalid_api_key")) {
      return NextResponse.json(
        { error: "Geçersiz OpenAI API anahtarı. Lütfen Ayarlar'dan kontrol edin.", code: "INVALID_API_KEY" },
        { status: 401, headers }
      );
    }
    
    if (errorMessage.includes("429") || errorMessage.includes("rate_limit")) {
      return NextResponse.json(
        { error: "OpenAI rate limit aşıldı. Lütfen biraz bekleyin.", code: "RATE_LIMIT" },
        { status: 429, headers }
      );
    }

    if (errorMessage.includes("insufficient_quota")) {
      return NextResponse.json(
        { error: "OpenAI hesabınızda yeterli kredi yok.", code: "INSUFFICIENT_QUOTA" },
        { status: 402, headers }
      );
    }

    return NextResponse.json(
      { error: "OpenAI ile iletişimde hata oluştu.", code: "OPENAI_ERROR" },
      { status: 500, headers }
    );
  }
}
