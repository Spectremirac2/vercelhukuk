// src/app/api/chat/stream/route.ts - Streaming chat endpoint using SSE
import { NextRequest } from "next/server";
import { WebSearchEvidenceProvider } from "@/rag/web-search";
import { FileSearchEvidenceProvider } from "@/rag/file-search";
import { EvidenceProvider } from "@/rag/evidence";
import { addCitations } from "@/utils/citation";
import { isAllowedDomain, DEFAULT_ALLOWED_DOMAINS } from "@/utils/domains";
import { validateChatRequest } from "@/lib/schemas";
import { checkRateLimit } from "@/lib/rate-limit";
import { deduplicateSources } from "@/lib/utils";

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const DEFAULT_EVIDENCE_PROVIDER = process.env.EVIDENCE_PROVIDER || "web_search";
const ALLOWED_SOURCE_DOMAINS = process.env.ALLOWED_SOURCE_DOMAINS
  ? process.env.ALLOWED_SOURCE_DOMAINS.split(",").map((d) => d.trim())
  : DEFAULT_ALLOWED_DOMAINS;

// System instruction for legal research
const SYSTEM_INSTRUCTION = `
Sen Türk Hukuku için uzmanlaşmış bir Hukuk Araştırma Asistanısın.
Görevin: Türk hukuk kaynaklarını kullanarak hukuki sorulara doğru ve kanıtlara dayalı yanıtlar vermek.

KURALLAR:
1. DAYANAK: Her iddia sağlanan kaynaklarla (Web veya Dosya) desteklenmelidir.
2. ALINTI: Mümkün olduğunda spesifik Kanun Adı, Madde Numarası ve Fıkrayı belirt.
3. UYDURMA YASAK: Bir iddiayı destekleyecek kaynak bulamıyorsan, UYDURMA. "Mevcut kaynaklarla bunu doğrulayamıyorum" de.
4. EKSİK BİLGİ: Bilgiler eksikse, kullanıcıdan iste.
5. METODOLOJİ (IRAC):
   - **Mesele (Issue):** Hukuki soruyu açıkça belirt.
   - **Kural (Rule):** Uygulanabilir kanun/yönetmelikleri listele (alıntılarla).
   - **Analiz (Analysis):** Kuralı olaylara uygula.
   - **Sonuç (Conclusion):** Özet cevap ver.
6. FORMAT:
   - **Özet:** Kısa cevap.
   - **Uygulanabilir Hukuki Dayanak:** Alıntılı madde işaretleri.
   - **Analiz ve Değerlendirme:** Detaylı açıklama.
   - **Eksik Bilgiler:** (varsa).
   - **Uyarı:** "Bu bilgi hukuki tavsiye niteliği taşımaz."
7. DİL: Türkçe.
`;

// SSE helpers
function createSSEMessage(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(req: NextRequest) {
  // Check rate limit
  const rateLimitResult = checkRateLimit(req, "chat");
  if (!rateLimitResult.allowed) {
    return new Response(
      createSSEMessage("error", {
        error: "Çok fazla istek gönderildi. Lütfen bir dakika bekleyin.",
        code: "RATE_LIMIT_EXCEEDED",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          ...rateLimitResult.headers,
        },
      }
    );
  }

  // Check API key
  if (!GEMINI_API_KEY) {
    return new Response(
      createSSEMessage("error", {
        error: "Sistem yapılandırma hatası.",
        code: "MISSING_API_KEY",
      }),
      {
        status: 500,
        headers: { "Content-Type": "text/event-stream" },
      }
    );
  }

  try {
    const body = await req.json();

    // Validate request
    const validation = validateChatRequest(body);
    if (!validation.success) {
      return new Response(
        createSSEMessage("error", {
          error: `Geçersiz istek: ${validation.error}`,
          code: "VALIDATION_ERROR",
        }),
        {
          status: 400,
          headers: { "Content-Type": "text/event-stream" },
        }
      );
    }

    const { conversationId, messages, strictMode, storeId, useFiles } =
      validation.data;

    // Create readable stream for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send start event
          controller.enqueue(
            encoder.encode(createSSEMessage("start", { status: "processing" }))
          );

          // Initialize provider
          let provider: EvidenceProvider;
          let usingFileSearch = false;

          if (useFiles && storeId) {
            provider = new FileSearchEvidenceProvider(GEMINI_API_KEY!, storeId);
            usingFileSearch = true;
          } else if (DEFAULT_EVIDENCE_PROVIDER === "file_search" && storeId) {
            provider = new FileSearchEvidenceProvider(GEMINI_API_KEY!, storeId);
            usingFileSearch = true;
          } else {
            provider = new WebSearchEvidenceProvider(GEMINI_API_KEY!);
          }

          // Send searching event
          controller.enqueue(
            encoder.encode(
              createSSEMessage("status", { message: "Kaynaklar aranıyor..." })
            )
          );

          // Format messages for Gemini
          const geminiMessages = messages.map((msg) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
          }));

          // Prepend system instruction
          if (geminiMessages.length > 0 && geminiMessages[0].role === "user") {
            geminiMessages[0].parts[0].text =
              SYSTEM_INSTRUCTION +
              "\n\nKullanıcı Sorgusu: " +
              geminiMessages[0].parts[0].text;
          }

          // Get response
          const result = await provider.getEvidenceAndAnswer(
            conversationId || "default",
            geminiMessages
          );

          const { answerText, sources, groundingMetadata } = result;

          // Send grounding event
          controller.enqueue(
            encoder.encode(
              createSSEMessage("status", { message: "Kaynaklar doğrulanıyor..." })
            )
          );

          // Check sources
          const hasGroundingSupports =
            groundingMetadata?.groundingSupports &&
            groundingMetadata.groundingSupports.length > 0;
          const hasGroundingChunks =
            groundingMetadata?.groundingChunks &&
            groundingMetadata.groundingChunks.length > 0;

          if (
            !hasGroundingChunks &&
            !hasGroundingSupports &&
            sources.length === 0
          ) {
            controller.enqueue(
              encoder.encode(
                createSSEMessage("complete", {
                  assistantText: `## Yetersiz Kaynak\n\nYeterli doğrulanabilir kaynak bulunamadı.`,
                  sources: [],
                })
              )
            );
            controller.close();
            return;
          }

          // Process citations
          const processedText = addCitations(answerText, groundingMetadata);

          // Deduplicate and enrich sources
          const uniqueSources = deduplicateSources(sources);
          const enrichedSources = uniqueSources.map((s) => ({
            ...s,
            isTrusted: isAllowedDomain(s.uri, ALLOWED_SOURCE_DOMAINS),
          }));

          // Strict mode check
          if (strictMode && !usingFileSearch) {
            const trustedSources = enrichedSources.filter((s) => s.isTrusted);
            if (uniqueSources.length < 2 || trustedSources.length < 1) {
              controller.enqueue(
                encoder.encode(
                  createSSEMessage("complete", {
                    assistantText: `## Strict Mode: Yetersiz Güvenilir Kaynak\n\nBu sorgu için yeterli güvenilir kaynak bulunamadı.`,
                    sources: enrichedSources,
                    strictModeRejection: true,
                  })
                )
              );
              controller.close();
              return;
            }
          }

          // Stream the response in chunks for better UX
          const chunks = chunkText(processedText, 50);
          for (let i = 0; i < chunks.length; i++) {
            controller.enqueue(
              encoder.encode(
                createSSEMessage("chunk", {
                  text: chunks[i],
                  index: i,
                  total: chunks.length,
                })
              )
            );
            // Small delay between chunks for streaming effect
            await new Promise((r) => setTimeout(r, 20));
          }

          // Send complete event with sources
          controller.enqueue(
            encoder.encode(
              createSSEMessage("complete", {
                assistantText: processedText,
                sources: enrichedSources,
              })
            )
          );

          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.enqueue(
            encoder.encode(
              createSSEMessage("error", {
                error: "Bir hata oluştu. Lütfen tekrar deneyin.",
              })
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        ...rateLimitResult.headers,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      createSSEMessage("error", {
        error: "Bir hata oluştu.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "text/event-stream" },
      }
    );
  }
}

// Helper to chunk text for streaming
function chunkText(text: string, wordsPerChunk: number): string[] {
  const words = text.split(/(\s+)/);
  const chunks: string[] = [];
  let current = "";
  let wordCount = 0;

  for (const word of words) {
    current += word;
    if (!/^\s+$/.test(word)) {
      wordCount++;
    }
    if (wordCount >= wordsPerChunk) {
      chunks.push(current);
      current = "";
      wordCount = 0;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}
