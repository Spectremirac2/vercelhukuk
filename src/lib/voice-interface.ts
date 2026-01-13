/**
 * Voice Interface for Legal AI
 *
 * Provides accessibility-focused voice interaction for legal assistance:
 * - Turkish speech recognition with legal terminology support
 * - Text-to-speech for legal document reading
 * - Voice commands for common legal operations
 * - Accessibility features for visually impaired users
 *
 * Based on 2025-2026 legal tech trends for voice-enabled legal assistants.
 */

export type VoiceLanguage = "tr-TR" | "en-US" | "de-DE" | "fr-FR" | "ar-SA";

export type VoiceCommand =
  | "arama_yap"
  | "belge_oku"
  | "ozet_cikar"
  | "madde_bul"
  | "tanim_ver"
  | "kaydet"
  | "geri_al"
  | "yardim"
  | "tekrar_soyle"
  | "durdur"
  | "devam_et";

export type VoiceGender = "male" | "female" | "neutral";

export interface VoiceSettings {
  language: VoiceLanguage;
  speechRate: number; // 0.5 - 2.0
  pitch: number; // 0.5 - 2.0
  volume: number; // 0 - 1
  voiceGender: VoiceGender;
  autoListen: boolean;
  feedbackSounds: boolean;
  legalTermPronunciation: boolean;
  punctuationAnnouncement: boolean;
  highlightWhileReading: boolean;
}

export interface SpeechRecognitionResult {
  id: string;
  transcript: string;
  confidence: number;
  isFinal: boolean;
  alternatives: Array<{ transcript: string; confidence: number }>;
  detectedCommand?: VoiceCommand;
  entities: RecognizedEntity[];
  intent: RecognizedIntent | null;
  processingTimeMs: number;
}

export interface RecognizedEntity {
  type: "kanun" | "madde" | "tarih" | "tutar" | "kisi" | "kurum" | "dava_no";
  value: string;
  startIndex: number;
  endIndex: number;
  confidence: number;
}

export interface RecognizedIntent {
  name: string;
  confidence: number;
  parameters: Record<string, string>;
  suggestedAction: string;
}

export interface TextToSpeechRequest {
  text: string;
  language?: VoiceLanguage;
  settings?: Partial<VoiceSettings>;
  annotations?: SpeechAnnotation[];
  breakpoints?: number[];
}

export interface SpeechAnnotation {
  startIndex: number;
  endIndex: number;
  type: "emphasis" | "spell" | "slow" | "pause" | "citation";
  duration?: number;
}

export interface VoiceSession {
  id: string;
  startedAt: Date;
  endedAt?: Date;
  status: "active" | "paused" | "ended";
  interactions: VoiceInteraction[];
  settings: VoiceSettings;
  userId?: string;
  accessibilityMode: boolean;
  totalDurationMs: number;
}

export interface VoiceInteraction {
  id: string;
  timestamp: Date;
  type: "speech_input" | "speech_output" | "command";
  content: string;
  metadata: {
    duration?: number;
    wordCount?: number;
    command?: VoiceCommand;
    successful?: boolean;
  };
}

export interface VoiceAccessibilityOptions {
  screenReaderMode: boolean;
  highContrastAudio: boolean;
  verboseDescriptions: boolean;
  navigationAnnouncements: boolean;
  errorExplanations: boolean;
  keyboardShortcutAnnounce: boolean;
  autoReadNewContent: boolean;
  readingSpeed: "slow" | "normal" | "fast";
}

export interface LegalTermPronunciation {
  term: string;
  phonetic: string;
  syllables: string[];
  emphasis: number; // syllable index
  audioUrl?: string;
}

// Turkish Legal Terminology Pronunciations
const LEGAL_TERM_PRONUNCIATIONS: LegalTermPronunciation[] = [
  { term: "KVKK", phonetic: "ka-ve-ka-ka", syllables: ["ka", "ve", "ka", "ka"], emphasis: 0 },
  { term: "TCK", phonetic: "te-ce-ka", syllables: ["te", "ce", "ka"], emphasis: 0 },
  { term: "TBK", phonetic: "te-be-ka", syllables: ["te", "be", "ka"], emphasis: 0 },
  { term: "TTK", phonetic: "te-te-ka", syllables: ["te", "te", "ka"], emphasis: 0 },
  { term: "HMK", phonetic: "ha-me-ka", syllables: ["ha", "me", "ka"], emphasis: 0 },
  { term: "CMK", phonetic: "ce-me-ka", syllables: ["ce", "me", "ka"], emphasis: 0 },
  { term: "İİK", phonetic: "i-i-ka", syllables: ["i", "i", "ka"], emphasis: 0 },
  { term: "VERBİS", phonetic: "ver-bis", syllables: ["ver", "bis"], emphasis: 0 },
  { term: "TKHK", phonetic: "te-ka-ha-ka", syllables: ["te", "ka", "ha", "ka"], emphasis: 0 },
  { term: "İş Kanunu", phonetic: "ish ka-nu-nu", syllables: ["ish", "ka", "nu", "nu"], emphasis: 0 },
  { term: "gabin", phonetic: "ga-bin", syllables: ["ga", "bin"], emphasis: 1 },
  { term: "müteselsil", phonetic: "mü-te-sel-sil", syllables: ["mü", "te", "sel", "sil"], emphasis: 2 },
  { term: "rücu", phonetic: "rü-cu", syllables: ["rü", "cu"], emphasis: 0 },
  { term: "cebri icra", phonetic: "ceb-ri ic-ra", syllables: ["ceb", "ri", "ic", "ra"], emphasis: 2 },
  { term: "ihtiyati tedbir", phonetic: "ih-ti-ya-ti ted-bir", syllables: ["ih", "ti", "ya", "ti", "ted", "bir"], emphasis: 4 },
  { term: "müddeabihi", phonetic: "müd-de-a-bi-hi", syllables: ["müd", "de", "a", "bi", "hi"], emphasis: 2 },
  { term: "temyiz", phonetic: "tem-yiz", syllables: ["tem", "yiz"], emphasis: 1 },
  { term: "istinaf", phonetic: "is-ti-naf", syllables: ["is", "ti", "naf"], emphasis: 2 },
  { term: "tebligat", phonetic: "teb-li-gat", syllables: ["teb", "li", "gat"], emphasis: 2 },
  { term: "icra iflas", phonetic: "ic-ra if-las", syllables: ["ic", "ra", "if", "las"], emphasis: 0 },
];

// Voice Command Patterns (Turkish)
const VOICE_COMMAND_PATTERNS: Array<{ command: VoiceCommand; patterns: RegExp[]; description: string }> = [
  {
    command: "arama_yap",
    patterns: [
      /^(ara|arat|araştır|bul)\s+(.+)/i,
      /^(.+)\s+(hakkında|ile ilgili)\s+(ara|bul)/i,
      /^(.+)\s+nedir$/i,
    ],
    description: "Hukuki arama yapar",
  },
  {
    command: "belge_oku",
    patterns: [
      /^(oku|okut|seslendir)\s+(.+)/i,
      /^(.+)\s+(oku|okut)$/i,
      /^belge(yi)?\s+oku/i,
    ],
    description: "Belgeyi sesli okur",
  },
  {
    command: "ozet_cikar",
    patterns: [
      /^(özetle|özet çıkar|kısaca anlat)/i,
      /^(.+)\s+(özetle|özetini çıkar)/i,
    ],
    description: "Metnin özetini çıkarır",
  },
  {
    command: "madde_bul",
    patterns: [
      /^(madde|m\.)\s*(\d+)/i,
      /^(\d+)\s*(inci|nci|üncü|ncı)?\s*madde/i,
      /^(.+)\s+kanunu?\s+madde\s*(\d+)/i,
    ],
    description: "Belirli bir maddeyi bulur",
  },
  {
    command: "tanim_ver",
    patterns: [
      /^(.+)\s+(ne demek|nedir|tanımı)/i,
      /^(tanımla|açıkla)\s+(.+)/i,
    ],
    description: "Hukuki terimin tanımını verir",
  },
  {
    command: "kaydet",
    patterns: [
      /^(kaydet|sakla|not al)/i,
      /^bunu kaydet/i,
    ],
    description: "Mevcut içeriği kaydeder",
  },
  {
    command: "geri_al",
    patterns: [
      /^(geri al|iptal|vazgeç)/i,
      /^son işlemi geri al/i,
    ],
    description: "Son işlemi geri alır",
  },
  {
    command: "yardim",
    patterns: [
      /^(yardım|yardım et|ne yapabilirim)/i,
      /^komutlar(ı göster)?$/i,
    ],
    description: "Yardım bilgisi gösterir",
  },
  {
    command: "tekrar_soyle",
    patterns: [
      /^(tekrar|tekrarla|yine söyle)/i,
      /^(anlamadım|bir daha)/i,
    ],
    description: "Son cevabı tekrarlar",
  },
  {
    command: "durdur",
    patterns: [
      /^(dur|durdur|sus|sessiz)/i,
      /^okumayı durdur/i,
    ],
    description: "Seslendirmeyi durdurur",
  },
  {
    command: "devam_et",
    patterns: [
      /^(devam|devam et|sürdür)/i,
      /^okumaya devam/i,
    ],
    description: "Seslendirmeye devam eder",
  },
];

// Entity Recognition Patterns
const ENTITY_PATTERNS: Array<{ type: RecognizedEntity["type"]; pattern: RegExp; extractor: (match: RegExpMatchArray) => string }> = [
  {
    type: "kanun",
    pattern: /(\d+)\s*sayılı\s+(.+?)\s*(kanun|kanunu|yasa|yasası)/gi,
    extractor: (m) => `${m[1]} sayılı ${m[2]} ${m[3]}`,
  },
  {
    type: "madde",
    pattern: /(?:madde|m\.)\s*(\d+)(?:\/(\d+))?(?:-([a-z]))?/gi,
    extractor: (m) => `Madde ${m[1]}${m[2] ? "/" + m[2] : ""}${m[3] ? "-" + m[3] : ""}`,
  },
  {
    type: "tarih",
    pattern: /(\d{1,2})[.\/](\d{1,2})[.\/](\d{2,4})/g,
    extractor: (m) => `${m[1]}.${m[2]}.${m[3]}`,
  },
  {
    type: "tutar",
    pattern: /(\d+(?:[.,]\d+)?)\s*(TL|₺|lira|türk lirası|dolar|euro|EUR|USD)/gi,
    extractor: (m) => `${m[1]} ${m[2]}`,
  },
  {
    type: "dava_no",
    pattern: /(\d{4}\/\d+)\s*(esas|karar|E\.|K\.)/gi,
    extractor: (m) => `${m[1]} ${m[2]}`,
  },
  {
    type: "kurum",
    pattern: /(yargıtay|danıştay|anayasa mahkemesi|sayıştay|uyuşmazlık mahkemesi|bölge adliye mahkemesi)/gi,
    extractor: (m) => m[1],
  },
];

// Storage
const activeSessions: Map<string, VoiceSession> = new Map();
let lastSpeechOutput: string = "";

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get default voice settings
 */
export function getDefaultVoiceSettings(): VoiceSettings {
  return {
    language: "tr-TR",
    speechRate: 1.0,
    pitch: 1.0,
    volume: 0.8,
    voiceGender: "female",
    autoListen: false,
    feedbackSounds: true,
    legalTermPronunciation: true,
    punctuationAnnouncement: false,
    highlightWhileReading: true,
  };
}

/**
 * Get accessibility options
 */
export function getAccessibilityOptions(): VoiceAccessibilityOptions {
  return {
    screenReaderMode: false,
    highContrastAudio: false,
    verboseDescriptions: true,
    navigationAnnouncements: true,
    errorExplanations: true,
    keyboardShortcutAnnounce: true,
    autoReadNewContent: false,
    readingSpeed: "normal",
  };
}

/**
 * Start a new voice session
 */
export function startVoiceSession(
  settings?: Partial<VoiceSettings>,
  accessibilityMode: boolean = false,
  userId?: string
): VoiceSession {
  const session: VoiceSession = {
    id: generateId("voice"),
    startedAt: new Date(),
    status: "active",
    interactions: [],
    settings: { ...getDefaultVoiceSettings(), ...settings },
    userId,
    accessibilityMode,
    totalDurationMs: 0,
  };

  activeSessions.set(session.id, session);
  return session;
}

/**
 * End a voice session
 */
export function endVoiceSession(sessionId: string): VoiceSession | null {
  const session = activeSessions.get(sessionId);
  if (!session) return null;

  session.endedAt = new Date();
  session.status = "ended";
  session.totalDurationMs = session.endedAt.getTime() - session.startedAt.getTime();

  activeSessions.delete(sessionId);
  return session;
}

/**
 * Get active voice session
 */
export function getVoiceSession(sessionId: string): VoiceSession | undefined {
  return activeSessions.get(sessionId);
}

/**
 * Process speech input and recognize commands/entities
 */
export function processSpeechInput(
  transcript: string,
  confidence: number = 1.0
): SpeechRecognitionResult {
  const startTime = Date.now();
  const entities = extractEntities(transcript);
  const command = detectCommand(transcript);
  const intent = inferIntent(transcript, entities, command);

  return {
    id: generateId("speech"),
    transcript,
    confidence,
    isFinal: true,
    alternatives: [],
    detectedCommand: command,
    entities,
    intent,
    processingTimeMs: Date.now() - startTime,
  };
}

/**
 * Extract entities from transcript
 */
function extractEntities(transcript: string): RecognizedEntity[] {
  const entities: RecognizedEntity[] = [];

  for (const { type, pattern, extractor } of ENTITY_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;

    while ((match = regex.exec(transcript)) !== null) {
      entities.push({
        type,
        value: extractor(match),
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        confidence: 0.9,
      });
    }
  }

  return entities;
}

/**
 * Detect voice command from transcript
 */
function detectCommand(transcript: string): VoiceCommand | undefined {
  const normalizedTranscript = transcript.toLowerCase().trim();

  for (const { command, patterns } of VOICE_COMMAND_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(normalizedTranscript)) {
        return command;
      }
    }
  }

  return undefined;
}

/**
 * Infer user intent from transcript
 */
function inferIntent(
  transcript: string,
  entities: RecognizedEntity[],
  command?: VoiceCommand
): RecognizedIntent | null {
  const normalizedTranscript = transcript.toLowerCase();

  // Legal search intent
  if (command === "arama_yap" || /ara|bul|nedir|hakkında/i.test(normalizedTranscript)) {
    const searchTermMatch = normalizedTranscript.match(/(?:ara|bul|araştır)\s+(.+)/i) ||
      normalizedTranscript.match(/(.+)\s+(?:nedir|hakkında)/i);

    return {
      name: "legal_search",
      confidence: 0.85,
      parameters: {
        query: searchTermMatch ? searchTermMatch[1].trim() : transcript,
        entities: entities.map((e) => e.value).join(", "),
      },
      suggestedAction: "Hukuki arama yap",
    };
  }

  // Document reading intent
  if (command === "belge_oku" || /oku|okut|seslendir/i.test(normalizedTranscript)) {
    return {
      name: "read_document",
      confidence: 0.9,
      parameters: {
        documentType: entities.find((e) => e.type === "kanun")?.value || "current",
      },
      suggestedAction: "Belgeyi sesli oku",
    };
  }

  // Article lookup intent
  if (command === "madde_bul" || entities.some((e) => e.type === "madde")) {
    const articleEntity = entities.find((e) => e.type === "madde");
    const lawEntity = entities.find((e) => e.type === "kanun");

    return {
      name: "find_article",
      confidence: 0.9,
      parameters: {
        article: articleEntity?.value || "",
        law: lawEntity?.value || "",
      },
      suggestedAction: "Maddeyi bul ve oku",
    };
  }

  // Definition intent
  if (command === "tanim_ver" || /ne demek|tanım|açıkla/i.test(normalizedTranscript)) {
    const termMatch = normalizedTranscript.match(/(.+)\s+(?:ne demek|nedir|tanımı)/i) ||
      normalizedTranscript.match(/(?:tanımla|açıkla)\s+(.+)/i);

    return {
      name: "define_term",
      confidence: 0.85,
      parameters: {
        term: termMatch ? termMatch[1].trim() : transcript,
      },
      suggestedAction: "Terimin tanımını ver",
    };
  }

  // Summary intent
  if (command === "ozet_cikar" || /özetle|özet|kısaca/i.test(normalizedTranscript)) {
    return {
      name: "summarize",
      confidence: 0.85,
      parameters: {},
      suggestedAction: "Özet çıkar",
    };
  }

  return null;
}

/**
 * Prepare text for speech synthesis with proper pronunciation
 */
export function prepareTextForSpeech(
  text: string,
  settings: VoiceSettings
): TextToSpeechRequest {
  let processedText = text;
  const annotations: SpeechAnnotation[] = [];

  // Apply legal term pronunciations
  if (settings.legalTermPronunciation) {
    for (const term of LEGAL_TERM_PRONUNCIATIONS) {
      const regex = new RegExp(`\\b${term.term}\\b`, "gi");
      const matches = text.matchAll(regex);

      for (const match of matches) {
        if (match.index !== undefined) {
          annotations.push({
            startIndex: match.index,
            endIndex: match.index + match[0].length,
            type: "spell",
          });
        }
      }
    }
  }

  // Handle article numbers (read as numbers)
  processedText = processedText.replace(
    /[Mm]adde\s*(\d+)/g,
    (match, num) => `madde ${numberToTurkishWords(parseInt(num))}`
  );

  // Handle law numbers
  processedText = processedText.replace(
    /(\d+)\s*sayılı/gi,
    (match, num) => `${numberToTurkishWords(parseInt(num))} sayılı`
  );

  // Add pauses for punctuation
  if (settings.punctuationAnnouncement) {
    processedText = processedText
      .replace(/\./g, ". <break time=\"300ms\"/>")
      .replace(/,/g, ", <break time=\"150ms\"/>")
      .replace(/;/g, "; <break time=\"200ms\"/>")
      .replace(/:/g, ": <break time=\"200ms\"/>");
  }

  // Calculate breakpoints for long texts
  const breakpoints: number[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let currentPosition = 0;

  for (const sentence of sentences) {
    currentPosition += sentence.length + 1;
    if (currentPosition > 0) {
      breakpoints.push(currentPosition);
    }
  }

  // Store for repeat command
  lastSpeechOutput = text;

  return {
    text: processedText,
    language: settings.language,
    settings,
    annotations,
    breakpoints,
  };
}

/**
 * Convert number to Turkish words
 */
function numberToTurkishWords(num: number): string {
  if (num === 0) return "sıfır";

  const ones = ["", "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz"];
  const tens = ["", "on", "yirmi", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan"];
  const hundreds = ["", "yüz", "iki yüz", "üç yüz", "dört yüz", "beş yüz", "altı yüz", "yedi yüz", "sekiz yüz", "dokuz yüz"];

  if (num < 10) return ones[num];
  if (num < 100) return `${tens[Math.floor(num / 10)]} ${ones[num % 10]}`.trim();
  if (num < 1000) return `${hundreds[Math.floor(num / 100)]} ${numberToTurkishWords(num % 100)}`.trim();
  if (num < 10000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    const prefix = thousands === 1 ? "bin" : `${ones[thousands]} bin`;
    return `${prefix} ${numberToTurkishWords(remainder)}`.trim();
  }

  return num.toString();
}

/**
 * Get voice command help
 */
export function getVoiceCommandHelp(): Array<{
  command: VoiceCommand;
  description: string;
  examples: string[];
}> {
  return [
    {
      command: "arama_yap",
      description: "Hukuki konularda arama yapar",
      examples: [
        "Ara iş sözleşmesi fesih",
        "KVKK nedir",
        "Kiracı hakları hakkında ara",
      ],
    },
    {
      command: "belge_oku",
      description: "Belgeyi veya metni sesli okur",
      examples: [
        "Bu belgeyi oku",
        "Sözleşmeyi oku",
        "Maddeyi seslendir",
      ],
    },
    {
      command: "ozet_cikar",
      description: "Metnin özetini çıkarır",
      examples: [
        "Özetle",
        "Kısaca anlat",
        "Bu belgenin özetini çıkar",
      ],
    },
    {
      command: "madde_bul",
      description: "Belirli bir kanun maddesini bulur",
      examples: [
        "Madde 25",
        "İş Kanunu madde 17",
        "TCK 141. madde",
      ],
    },
    {
      command: "tanim_ver",
      description: "Hukuki terimin tanımını verir",
      examples: [
        "Gabin ne demek",
        "Tanımla müteselsil sorumluluk",
        "Cebri icra nedir",
      ],
    },
    {
      command: "durdur",
      description: "Seslendirmeyi durdurur",
      examples: ["Dur", "Durdur", "Sessiz"],
    },
    {
      command: "devam_et",
      description: "Seslendirmeye devam eder",
      examples: ["Devam", "Devam et", "Sürdür"],
    },
    {
      command: "tekrar_soyle",
      description: "Son cevabı tekrarlar",
      examples: ["Tekrar", "Bir daha söyle", "Anlamadım"],
    },
    {
      command: "yardim",
      description: "Yardım bilgisi gösterir",
      examples: ["Yardım", "Ne yapabilirim", "Komutları göster"],
    },
  ];
}

/**
 * Get legal term pronunciation guide
 */
export function getLegalTermPronunciations(): LegalTermPronunciation[] {
  return LEGAL_TERM_PRONUNCIATIONS;
}

/**
 * Add custom pronunciation for a legal term
 */
export function addLegalTermPronunciation(
  term: string,
  phonetic: string,
  syllables: string[],
  emphasis: number = 0
): void {
  LEGAL_TERM_PRONUNCIATIONS.push({
    term,
    phonetic,
    syllables,
    emphasis,
  });
}

/**
 * Get last speech output (for repeat command)
 */
export function getLastSpeechOutput(): string {
  return lastSpeechOutput;
}

/**
 * Format legal document for accessible reading
 */
export function formatForAccessibleReading(
  text: string,
  options: VoiceAccessibilityOptions
): string {
  let formatted = text;

  if (options.verboseDescriptions) {
    // Add descriptions for structure elements
    formatted = formatted.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
      const level = hashes.length;
      return `Başlık seviye ${level}: ${title}`;
    });

    // Describe bullet points
    formatted = formatted.replace(/^[-*]\s+(.+)$/gm, "Liste ögesi: $1");

    // Describe numbered lists
    formatted = formatted.replace(/^(\d+)\.\s+(.+)$/gm, "Madde $1: $2");
  }

  if (options.navigationAnnouncements) {
    // Add section announcements
    formatted = formatted.replace(/\n{2,}/g, "\n<break time=\"500ms\"/>Yeni bölüm.<break time=\"300ms\"/>\n");
  }

  return formatted;
}

/**
 * Generate speech feedback for actions
 */
export function generateActionFeedback(
  action: string,
  success: boolean,
  options: VoiceAccessibilityOptions
): string {
  if (!success && options.errorExplanations) {
    return `İşlem başarısız: ${action}. Lütfen tekrar deneyin veya yardım deyin.`;
  }

  const feedbackMessages: Record<string, string> = {
    search: "Arama sonuçları hazır.",
    read: "Okuma tamamlandı.",
    save: "Kaydedildi.",
    undo: "Geri alındı.",
    navigate: "Sayfa değişti.",
    load: "Yüklendi.",
  };

  return feedbackMessages[action] || `${action} tamamlandı.`;
}

/**
 * Log voice interaction
 */
export function logVoiceInteraction(
  sessionId: string,
  type: VoiceInteraction["type"],
  content: string,
  metadata: VoiceInteraction["metadata"] = {}
): void {
  const session = activeSessions.get(sessionId);
  if (!session) return;

  session.interactions.push({
    id: generateId("interaction"),
    timestamp: new Date(),
    type,
    content,
    metadata,
  });

  activeSessions.set(sessionId, session);
}

/**
 * Get session statistics
 */
export function getSessionStatistics(sessionId: string): {
  totalInteractions: number;
  speechInputs: number;
  speechOutputs: number;
  commands: number;
  successfulCommands: number;
  averageConfidence: number;
  mostUsedCommands: Array<{ command: string; count: number }>;
} | null {
  const session = activeSessions.get(sessionId);
  if (!session) return null;

  const speechInputs = session.interactions.filter((i) => i.type === "speech_input").length;
  const speechOutputs = session.interactions.filter((i) => i.type === "speech_output").length;
  const commands = session.interactions.filter((i) => i.type === "command");

  const successfulCommands = commands.filter((c) => c.metadata.successful).length;

  // Count command usage
  const commandCounts: Record<string, number> = {};
  for (const cmd of commands) {
    const cmdName = cmd.metadata.command || "unknown";
    commandCounts[cmdName] = (commandCounts[cmdName] || 0) + 1;
  }

  const mostUsedCommands = Object.entries(commandCounts)
    .map(([command, count]) => ({ command, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalInteractions: session.interactions.length,
    speechInputs,
    speechOutputs,
    commands: commands.length,
    successfulCommands,
    averageConfidence: 0.85, // Placeholder
    mostUsedCommands,
  };
}

/**
 * Get all available voice languages
 */
export function getAvailableLanguages(): Array<{
  code: VoiceLanguage;
  name: string;
  nativeName: string;
}> {
  return [
    { code: "tr-TR", name: "Turkish", nativeName: "Türkçe" },
    { code: "en-US", name: "English (US)", nativeName: "English" },
    { code: "de-DE", name: "German", nativeName: "Deutsch" },
    { code: "fr-FR", name: "French", nativeName: "Français" },
    { code: "ar-SA", name: "Arabic", nativeName: "العربية" },
  ];
}

/**
 * Validate voice settings
 */
export function validateVoiceSettings(settings: Partial<VoiceSettings>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (settings.speechRate !== undefined) {
    if (settings.speechRate < 0.5 || settings.speechRate > 2.0) {
      errors.push("Konuşma hızı 0.5 ile 2.0 arasında olmalıdır");
    }
  }

  if (settings.pitch !== undefined) {
    if (settings.pitch < 0.5 || settings.pitch > 2.0) {
      errors.push("Ses tonu 0.5 ile 2.0 arasında olmalıdır");
    }
  }

  if (settings.volume !== undefined) {
    if (settings.volume < 0 || settings.volume > 1) {
      errors.push("Ses seviyesi 0 ile 1 arasında olmalıdır");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create keyboard shortcut announcements for accessibility
 */
export function getKeyboardShortcuts(): Array<{
  key: string;
  action: string;
  announcement: string;
}> {
  return [
    { key: "Ctrl+Shift+L", action: "start_listening", announcement: "Dinlemeyi başlat" },
    { key: "Ctrl+Shift+S", action: "stop_speaking", announcement: "Konuşmayı durdur" },
    { key: "Ctrl+Shift+R", action: "repeat", announcement: "Tekrarla" },
    { key: "Ctrl+Shift+H", action: "help", announcement: "Yardım" },
    { key: "Escape", action: "cancel", announcement: "İptal" },
    { key: "Space", action: "pause_resume", announcement: "Duraklat veya devam et" },
    { key: "Arrow Up", action: "increase_rate", announcement: "Hızı artır" },
    { key: "Arrow Down", action: "decrease_rate", announcement: "Hızı azalt" },
  ];
}

/**
 * Format error message for voice output
 */
export function formatVoiceError(
  errorCode: string,
  details?: string
): string {
  const errorMessages: Record<string, string> = {
    speech_not_supported: "Tarayıcınız ses tanımayı desteklemiyor",
    microphone_denied: "Mikrofon erişimi reddedildi",
    no_speech_detected: "Konuşma algılanamadı, lütfen tekrar deneyin",
    network_error: "Ağ hatası oluştu",
    audio_capture_failed: "Ses kaydı başarısız oldu",
    unknown: "Bilinmeyen bir hata oluştu",
  };

  const baseMessage = errorMessages[errorCode] || errorMessages.unknown;
  return details ? `${baseMessage}. ${details}` : baseMessage;
}
