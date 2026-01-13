/**
 * Document Analysis & Summarization System
 * Features:
 * - Legal document structure analysis
 * - Key entity extraction
 * - Automatic summarization
 * - Timeline extraction
 * - Risk/issue identification
 */

export interface DocumentMetadata {
  fileName: string;
  fileType: string;
  fileSize: number;
  pageCount?: number;
  uploadedAt: Date;
  language: string;
}

export interface LegalEntity {
  type: "law" | "article" | "case" | "court" | "party" | "date" | "amount" | "term";
  value: string;
  context?: string;
  position?: { start: number; end: number };
  confidence: number;
}

export interface TimelineEvent {
  date: Date | string;
  description: string;
  type: "filing" | "decision" | "hearing" | "deadline" | "event" | "other";
  importance: "high" | "medium" | "low";
  relatedEntities?: string[];
}

export interface DocumentSection {
  title: string;
  content: string;
  type: "header" | "body" | "footer" | "signature" | "table" | "list";
  pageNumber?: number;
}

export interface DocumentAnalysis {
  metadata: DocumentMetadata;
  documentType: DocumentType;
  sections: DocumentSection[];
  entities: LegalEntity[];
  summary: DocumentSummary;
  timeline: TimelineEvent[];
  keyFindings: KeyFinding[];
  risks: RiskItem[];
  relatedLaws: string[];
}

export interface DocumentSummary {
  brief: string;           // 1-2 sentences
  detailed: string;        // Full paragraph
  keyPoints: string[];     // Bullet points
  parties?: string[];
  subject?: string;
  outcome?: string;
}

export interface KeyFinding {
  category: string;
  finding: string;
  importance: "critical" | "important" | "informational";
  sourceSection?: string;
}

export interface RiskItem {
  description: string;
  severity: "high" | "medium" | "low";
  recommendation: string;
  relatedClause?: string;
}

export type DocumentType =
  | "court_decision"      // Mahkeme kararı
  | "contract"            // Sözleşme
  | "petition"            // Dilekçe
  | "indictment"          // İddianame
  | "legislation"         // Mevzuat
  | "legal_opinion"       // Hukuki mütalaa
  | "protocol"            // Tutanak
  | "notification"        // Tebligat
  | "unknown";

// Document type detection patterns
const DOCUMENT_TYPE_PATTERNS: Array<{ type: DocumentType; patterns: RegExp[] }> = [
  {
    type: "court_decision",
    patterns: [
      /(?:Yargıtay|Danıştay|İstinaf|Asliye|Sulh|Ağır Ceza)\s*(?:Mahkemesi|Dairesi)/gi,
      /KARAR\s*(?:NO|NUMARASI)/gi,
      /Esas\s*(?:No|Numarası)/gi,
      /GEREKÇELİ\s*KARAR/gi,
      /HÜKÜM/gi,
    ],
  },
  {
    type: "contract",
    patterns: [
      /SÖZLEŞME(?:Sİ)?/gi,
      /taraflar\s*arasında/gi,
      /madde\s*\d+\s*[-–:]/gi,
      /(?:iş|kira|hizmet|satış)\s*sözleşmesi/gi,
      /imza\s*(?:tarihi|yeri)/gi,
    ],
  },
  {
    type: "petition",
    patterns: [
      /DİLEKÇE/gi,
      /DAVACI/gi,
      /DAVALI/gi,
      /TALEP\s*VE\s*SONUÇ/gi,
      /sayın\s*(?:mahkeme|hakim)/gi,
    ],
  },
  {
    type: "indictment",
    patterns: [
      /İDDİANAME/gi,
      /SANIĞIN?\s*(?:ADI|KİMLİĞİ)/gi,
      /SUÇ(?:UN)?\s*(?:TARİHİ|YERİ)/gi,
      /CEZA\s*TALEBİ/gi,
    ],
  },
  {
    type: "legislation",
    patterns: [
      /KANUN(?:U)?/gi,
      /MADDE\s*\d+\s*[-–]/gi,
      /Resmi\s*Gazete/gi,
      /(?:GEÇİCİ|EK)\s*MADDE/gi,
    ],
  },
  {
    type: "legal_opinion",
    patterns: [
      /HUKUKİ\s*(?:MÜTALAA|GÖRÜŞ)/gi,
      /DEĞERLENDİRME/gi,
      /SONUÇ\s*VE\s*KANAATİMİZ/gi,
    ],
  },
  {
    type: "protocol",
    patterns: [
      /TUTANAK/gi,
      /hazır\s*bulunanlar/gi,
      /imza\s*altına\s*alın/gi,
    ],
  },
  {
    type: "notification",
    patterns: [
      /TEBLİGAT/gi,
      /TEBLİĞ\s*(?:TARİHİ|EDİLDİ)/gi,
      /(?:7201|Tebligat\s*Kanunu)/gi,
    ],
  },
];

// Entity extraction patterns
const ENTITY_PATTERNS: Array<{
  type: LegalEntity["type"];
  pattern: RegExp;
  confidence: number;
}> = [
  // Laws
  {
    type: "law",
    pattern: /(\d{3,5})\s*sayılı\s*([A-ZÇĞİÖŞÜa-zçğıöşü\s]+(?:Kanun|KHK|Tüzük|Yönetmelik))/gi,
    confidence: 0.95,
  },
  // Articles
  {
    type: "article",
    pattern: /(?:madde|md?\.|m\.)\s*(\d+)(?:\/(\d+))?(?:\s*(?:fıkra|bent|(\d+)))?/gi,
    confidence: 0.9,
  },
  // Case numbers
  {
    type: "case",
    pattern: /(\d{4})\/(\d+)\s*([EK])\.?/gi,
    confidence: 0.95,
  },
  // Courts
  {
    type: "court",
    pattern: /((?:Yargıtay|Danıştay)\s*\d+\.\s*(?:Hukuk|Ceza|İdari|Vergi)\s*Dairesi)/gi,
    confidence: 0.95,
  },
  // Dates
  {
    type: "date",
    pattern: /(\d{1,2})[./-](\d{1,2})[./-](\d{4})/g,
    confidence: 0.85,
  },
  // Amounts
  {
    type: "amount",
    pattern: /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*(?:TL|Türk\s*Lirası|EUR|USD|\$|€)/gi,
    confidence: 0.9,
  },
  // Legal terms
  {
    type: "term",
    pattern: /(?:tazminat|nafaka|vekalet\s*ücreti|faiz|ceza|hapis|para\s*cezası)/gi,
    confidence: 0.8,
  },
];

// Timeline extraction patterns
const DATE_PATTERNS = [
  /(\d{1,2})[./-](\d{1,2})[./-](\d{4})/g,
  /(\d{1,2})\s*(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s*(\d{4})/gi,
];

const EVENT_KEYWORDS: Array<{ keywords: string[]; type: TimelineEvent["type"] }> = [
  { keywords: ["dava", "başvuru", "açıl", "ikame"], type: "filing" },
  { keywords: ["karar", "hüküm", "sonuç", "red", "kabul"], type: "decision" },
  { keywords: ["duruşma", "celp", "davet"], type: "hearing" },
  { keywords: ["süre", "müddet", "vade", "son gün"], type: "deadline" },
];

/**
 * Detect document type from content
 */
export function detectDocumentType(content: string): DocumentType {
  const scores: Record<DocumentType, number> = {
    court_decision: 0,
    contract: 0,
    petition: 0,
    indictment: 0,
    legislation: 0,
    legal_opinion: 0,
    protocol: 0,
    notification: 0,
    unknown: 0,
  };

  for (const { type, patterns } of DOCUMENT_TYPE_PATTERNS) {
    for (const pattern of patterns) {
      const matches = content.match(pattern);
      if (matches) {
        scores[type] += matches.length;
      }
    }
  }

  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return "unknown";

  const detected = Object.entries(scores).find(([, score]) => score === maxScore);
  return (detected?.[0] as DocumentType) || "unknown";
}

/**
 * Extract legal entities from document
 */
export function extractEntities(content: string): LegalEntity[] {
  const entities: LegalEntity[] = [];
  const seen = new Set<string>();

  for (const { type, pattern, confidence } of ENTITY_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;

    while ((match = regex.exec(content)) !== null) {
      const value = match[0].trim();
      const key = `${type}:${value.toLowerCase()}`;

      if (!seen.has(key)) {
        seen.add(key);

        // Get surrounding context
        const contextStart = Math.max(0, match.index - 50);
        const contextEnd = Math.min(content.length, match.index + value.length + 50);
        const context = content.slice(contextStart, contextEnd).replace(/\s+/g, " ").trim();

        entities.push({
          type,
          value,
          context,
          position: { start: match.index, end: match.index + value.length },
          confidence,
        });
      }
    }
  }

  return entities.sort((a, b) => (a.position?.start || 0) - (b.position?.start || 0));
}

/**
 * Extract timeline events from document
 */
export function extractTimeline(content: string): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);

  for (const sentence of sentences) {
    // Check for dates
    let dateMatch: RegExpMatchArray | null = null;
    for (const pattern of DATE_PATTERNS) {
      dateMatch = sentence.match(pattern);
      if (dateMatch) break;
    }

    if (!dateMatch) continue;

    // Determine event type
    let eventType: TimelineEvent["type"] = "event";
    const lowerSentence = sentence.toLowerCase();

    for (const { keywords, type } of EVENT_KEYWORDS) {
      if (keywords.some(k => lowerSentence.includes(k))) {
        eventType = type;
        break;
      }
    }

    // Determine importance
    let importance: TimelineEvent["importance"] = "medium";
    if (eventType === "decision" || eventType === "deadline") {
      importance = "high";
    } else if (eventType === "event") {
      importance = "low";
    }

    events.push({
      date: dateMatch[0],
      description: sentence.trim().slice(0, 200),
      type: eventType,
      importance,
    });
  }

  // Sort by date string (simple sort, may need parsing for accuracy)
  return events.slice(0, 20);
}

/**
 * Generate document summary
 */
export function generateDocumentSummary(
  content: string,
  documentType: DocumentType,
  entities: LegalEntity[]
): DocumentSummary {
  const keyPoints: string[] = [];
  let subject = "";
  let outcome = "";
  const parties: string[] = [];

  // Extract parties from court decision or contract
  const partyPatterns = [
    /DAVACI\s*[:–-]?\s*([^\n,]+)/gi,
    /DAVALI\s*[:–-]?\s*([^\n,]+)/gi,
    /TARAF\s*[:–-]?\s*([^\n,]+)/gi,
  ];

  for (const pattern of partyPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      parties.push(...matches.map(m => m.replace(/^(DAVACI|DAVALI|TARAF)\s*[:–-]?\s*/i, "").trim()));
    }
  }

  // Extract subject based on document type
  if (documentType === "court_decision") {
    const subjectMatch = content.match(/(?:DAVA\s*KONUSU|KONU)\s*[:–-]?\s*([^\n]+)/i);
    if (subjectMatch) subject = subjectMatch[1].trim();

    const outcomeMatch = content.match(/(?:SONUÇ|HÜKÜM)\s*[:–-]?\s*([^\n.]+)/i);
    if (outcomeMatch) outcome = outcomeMatch[1].trim();
  } else if (documentType === "contract") {
    const subjectMatch = content.match(/(?:KONU|SÖZLEŞMENİN\s*KONUSU)\s*[:–-]?\s*([^\n]+)/i);
    if (subjectMatch) subject = subjectMatch[1].trim();
  }

  // Extract key points from entities
  const laws = entities.filter(e => e.type === "law").slice(0, 3);
  const amounts = entities.filter(e => e.type === "amount").slice(0, 2);

  if (laws.length > 0) {
    keyPoints.push(`İlgili mevzuat: ${laws.map(l => l.value).join(", ")}`);
  }
  if (amounts.length > 0) {
    keyPoints.push(`Tutarlar: ${amounts.map(a => a.value).join(", ")}`);
  }
  if (outcome) {
    keyPoints.push(`Sonuç: ${outcome}`);
  }

  // Generate brief summary
  const docTypeLabels: Record<DocumentType, string> = {
    court_decision: "Mahkeme kararı",
    contract: "Sözleşme",
    petition: "Dilekçe",
    indictment: "İddianame",
    legislation: "Mevzuat",
    legal_opinion: "Hukuki mütalaa",
    protocol: "Tutanak",
    notification: "Tebligat",
    unknown: "Belge",
  };

  const brief = `${docTypeLabels[documentType]}${subject ? ` - ${subject}` : ""}${outcome ? `. Sonuç: ${outcome}` : ""}`;

  // Generate detailed summary
  const detailed = [
    `Bu ${docTypeLabels[documentType].toLowerCase()}`,
    parties.length > 0 ? `${parties.slice(0, 2).join(" ve ")} arasındaki` : "",
    subject ? `${subject} konusundaki` : "",
    "hukuki işlemi içermektedir.",
    laws.length > 0 ? `${laws[0].value} kapsamında değerlendirilmektedir.` : "",
    outcome ? `Sonuç olarak ${outcome.toLowerCase()}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    brief: brief.slice(0, 200),
    detailed: detailed.slice(0, 500),
    keyPoints: keyPoints.slice(0, 5),
    parties: parties.slice(0, 4),
    subject: subject || undefined,
    outcome: outcome || undefined,
  };
}

/**
 * Identify risks in legal documents
 */
export function identifyRisks(
  content: string,
  documentType: DocumentType
): RiskItem[] {
  const risks: RiskItem[] = [];

  // Common risk patterns
  const riskPatterns: Array<{
    pattern: RegExp;
    severity: RiskItem["severity"];
    description: string;
    recommendation: string;
    documentTypes?: DocumentType[];
  }> = [
    {
      pattern: /süre\s*(?:aşım|geçti|doldu|kaçırıl)/gi,
      severity: "high",
      description: "Zamanaşımı veya süre sorunu tespit edildi",
      recommendation: "Süreleri acilen kontrol edin ve gerekli işlemleri başlatın",
    },
    {
      pattern: /eksik\s*(?:belge|evrak|bilgi)/gi,
      severity: "medium",
      description: "Eksik belge/bilgi uyarısı",
      recommendation: "Eksik belgeleri tamamlayın",
    },
    {
      pattern: /(?:cezai|hukuki)\s*sorumluluk/gi,
      severity: "high",
      description: "Sorumluluk riski belirlendi",
      recommendation: "Hukuki danışmanlık alın",
    },
    {
      pattern: /ihtarname|ihtar\s*(?:çek|gönder)/gi,
      severity: "medium",
      description: "İhtar süreci başlatılmış veya gerekli",
      recommendation: "İhtar sürecini takip edin",
      documentTypes: ["contract", "petition"],
    },
    {
      pattern: /temerrüt|gecikme\s*(?:fiz|cezası)/gi,
      severity: "medium",
      description: "Temerrüt/gecikme durumu",
      recommendation: "Gecikme faizi hesaplaması yapın",
      documentTypes: ["contract", "court_decision"],
    },
    {
      pattern: /iptal|fesih|bozma/gi,
      severity: "high",
      description: "İptal/fesih riski",
      recommendation: "İptal/fesih şartlarını ve sonuçlarını değerlendirin",
    },
  ];

  for (const { pattern, severity, description, recommendation, documentTypes } of riskPatterns) {
    if (documentTypes && !documentTypes.includes(documentType)) continue;

    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      // Get the clause/context
      const matchIndex = content.search(pattern);
      const contextStart = Math.max(0, matchIndex - 100);
      const contextEnd = Math.min(content.length, matchIndex + 200);
      const relatedClause = content.slice(contextStart, contextEnd).trim();

      risks.push({
        description,
        severity,
        recommendation,
        relatedClause: relatedClause.slice(0, 300),
      });
    }
  }

  return risks;
}

/**
 * Full document analysis
 */
export function analyzeDocument(
  content: string,
  metadata: DocumentMetadata
): DocumentAnalysis {
  const documentType = detectDocumentType(content);
  const entities = extractEntities(content);
  const timeline = extractTimeline(content);
  const summary = generateDocumentSummary(content, documentType, entities);
  const risks = identifyRisks(content, documentType);

  // Extract related laws
  const relatedLaws = entities
    .filter(e => e.type === "law")
    .map(e => e.value);

  // Generate key findings
  const keyFindings: KeyFinding[] = [];

  if (summary.outcome) {
    keyFindings.push({
      category: "Sonuç",
      finding: summary.outcome,
      importance: "critical",
    });
  }

  if (entities.filter(e => e.type === "amount").length > 0) {
    const amounts = entities.filter(e => e.type === "amount");
    keyFindings.push({
      category: "Mali",
      finding: `Belgede ${amounts.length} adet tutar referansı bulundu: ${amounts.slice(0, 3).map(a => a.value).join(", ")}`,
      importance: "important",
    });
  }

  if (timeline.filter(e => e.type === "deadline").length > 0) {
    keyFindings.push({
      category: "Süre",
      finding: "Belgede önemli süreler/tarihler tespit edildi",
      importance: "critical",
    });
  }

  return {
    metadata,
    documentType,
    sections: [], // Would need proper PDF parsing
    entities,
    summary,
    timeline,
    keyFindings,
    risks,
    relatedLaws: [...new Set(relatedLaws)],
  };
}

/**
 * Compare two documents
 */
export interface DocumentComparison {
  similarities: string[];
  differences: string[];
  sharedEntities: LegalEntity[];
  conflictingClauses: Array<{ doc1: string; doc2: string; issue: string }>;
}

export function compareDocuments(
  analysis1: DocumentAnalysis,
  analysis2: DocumentAnalysis
): DocumentComparison {
  const similarities: string[] = [];
  const differences: string[] = [];
  const conflictingClauses: DocumentComparison["conflictingClauses"] = [];

  // Compare document types
  if (analysis1.documentType === analysis2.documentType) {
    similarities.push(`Her iki belge de ${analysis1.documentType} türünde`);
  } else {
    differences.push(
      `Farklı belge türleri: ${analysis1.documentType} vs ${analysis2.documentType}`
    );
  }

  // Find shared entities
  const entities1 = new Set(analysis1.entities.map(e => `${e.type}:${e.value.toLowerCase()}`));
  const sharedEntities = analysis2.entities.filter(e =>
    entities1.has(`${e.type}:${e.value.toLowerCase()}`)
  );

  if (sharedEntities.length > 0) {
    similarities.push(`${sharedEntities.length} ortak referans bulundu`);
  }

  // Compare related laws
  const laws1 = new Set(analysis1.relatedLaws);
  const laws2 = new Set(analysis2.relatedLaws);
  const sharedLaws = [...laws1].filter(l => laws2.has(l));
  const uniqueLaws1 = [...laws1].filter(l => !laws2.has(l));
  const uniqueLaws2 = [...laws2].filter(l => !laws1.has(l));

  if (sharedLaws.length > 0) {
    similarities.push(`Ortak mevzuat: ${sharedLaws.join(", ")}`);
  }
  if (uniqueLaws1.length > 0 || uniqueLaws2.length > 0) {
    differences.push(
      `Farklı mevzuat referansları: Belge 1: ${uniqueLaws1.join(", ") || "yok"}, Belge 2: ${uniqueLaws2.join(", ") || "yok"}`
    );
  }

  return {
    similarities,
    differences,
    sharedEntities,
    conflictingClauses,
  };
}
