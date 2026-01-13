/**
 * Contract Analysis System
 *
 * AI-powered contract analysis for Turkish legal documents.
 * Provides risk detection, clause analysis, and compliance checking.
 *
 * Features:
 * - Risk identification in contract clauses
 * - Missing clause detection
 * - Contract summarization
 * - Party obligation extraction
 * - Term and condition analysis
 *
 * Based on 2025-2026 Legal AI research:
 * - Leagle, Apilex gibi Türk legaltech çözümleri
 * - AI contract review best practices
 */

export type ContractType =
  | "is_sozlesmesi"
  | "kira_sozlesmesi"
  | "satis_sozlesmesi"
  | "hizmet_sozlesmesi"
  | "ortaklik_sozlesmesi"
  | "gizlilik_sozlesmesi"
  | "franchise_sozlesmesi"
  | "diger";

export type RiskLevel = "düşük" | "orta" | "yüksek" | "kritik";

export interface ContractClause {
  id: string;
  title: string;
  content: string;
  type: ClauseType;
  riskLevel: RiskLevel;
  issues: ClauseIssue[];
  suggestions: string[];
}

export type ClauseType =
  | "taraflar"
  | "konu"
  | "sure"
  | "ucret"
  | "odeme"
  | "fesih"
  | "cezai_sart"
  | "gizlilik"
  | "rekabet_yasagi"
  | "uyusmazlik"
  | "tebligat"
  | "mucbir_sebep"
  | "devir"
  | "diger";

export interface ClauseIssue {
  type: IssueType;
  severity: RiskLevel;
  description: string;
  recommendation: string;
  legalBasis?: string;
}

export type IssueType =
  | "eksik_madde"
  | "belirsiz_ifade"
  | "hukuka_aykiri"
  | "dengesiz_sart"
  | "eksik_bilgi"
  | "risk_maddesi"
  | "uyumsuzluk";

export interface ContractAnalysis {
  contractType: ContractType;
  parties: PartyInfo[];
  clauses: ContractClause[];
  missingClauses: MissingClause[];
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  summary: ContractSummary;
  recommendations: string[];
  complianceStatus: ComplianceStatus;
}

export interface PartyInfo {
  role: "taraf1" | "taraf2" | "diger";
  name: string;
  type: "gercek_kisi" | "tuzel_kisi";
  obligations: string[];
  rights: string[];
}

export interface MissingClause {
  type: ClauseType;
  importance: RiskLevel;
  description: string;
  suggestedContent: string;
}

export interface ContractSummary {
  purpose: string;
  duration: string;
  value?: string;
  keyTerms: string[];
  mainObligations: string[];
  terminationConditions: string[];
}

export interface ComplianceStatus {
  kvkk: ComplianceResult;
  isKanunu: ComplianceResult;
  ticaretKanunu: ComplianceResult;
  tuketiciKanunu: ComplianceResult;
  overall: RiskLevel;
}

export interface ComplianceResult {
  compliant: boolean;
  issues: string[];
  recommendations: string[];
}

// Clause patterns for detection
const CLAUSE_PATTERNS: Record<ClauseType, RegExp[]> = {
  taraflar: [
    /taraflar/i,
    /sözleşmenin tarafları/i,
    /işbu sözleşme.*arasında/i,
    /bir tarafta.*diğer tarafta/i,
  ],
  konu: [
    /sözleşmenin konusu/i,
    /konu ve kapsam/i,
    /amaç/i,
  ],
  sure: [
    /sözleşme süresi/i,
    /süre/i,
    /yürürlük/i,
    /başlangıç.*bitiş/i,
  ],
  ucret: [
    /ücret/i,
    /bedel/i,
    /kira bedeli/i,
    /hizmet bedeli/i,
    /ödeme/i,
  ],
  odeme: [
    /ödeme koşulları/i,
    /ödeme şekli/i,
    /ödeme vadesi/i,
  ],
  fesih: [
    /fesih/i,
    /sona erme/i,
    /sözleşmenin sona ermesi/i,
    /haklı nedenle fesih/i,
  ],
  cezai_sart: [
    /cezai şart/i,
    /ceza koşulu/i,
    /tazminat/i,
    /gecikme cezası/i,
  ],
  gizlilik: [
    /gizlilik/i,
    /sır saklama/i,
    /confidential/i,
    /ticari sır/i,
  ],
  rekabet_yasagi: [
    /rekabet yasağı/i,
    /rekabet etmeme/i,
    /non-compete/i,
  ],
  uyusmazlik: [
    /uyuşmazlık/i,
    /yetkili mahkeme/i,
    /tahkim/i,
    /arabuluculuk/i,
  ],
  tebligat: [
    /tebligat/i,
    /bildirim/i,
    /adres değişikliği/i,
  ],
  mucbir_sebep: [
    /mücbir sebep/i,
    /force majeure/i,
    /olağanüstü hal/i,
  ],
  devir: [
    /devir/i,
    /temlik/i,
    /sözleşmenin devri/i,
  ],
  diger: [],
};

// Risk indicators
const RISK_INDICATORS: Array<{
  pattern: RegExp;
  issue: string;
  severity: RiskLevel;
  recommendation: string;
}> = [
  {
    pattern: /tek taraflı fesih hakkı/i,
    issue: "Tek taraflı fesih hakkı tanınmış",
    severity: "yüksek",
    recommendation: "Karşılıklı fesih hakları düzenlenmeli veya fesih koşulları netleştirilmeli",
  },
  {
    pattern: /sınırsız sorumluluk/i,
    issue: "Sınırsız sorumluluk düzenlemesi var",
    severity: "kritik",
    recommendation: "Sorumluluk sınırlandırılmalı",
  },
  {
    pattern: /cezai şart.*%\s*(\d+)/i,
    issue: "Yüksek cezai şart oranı",
    severity: "yüksek",
    recommendation: "Cezai şart miktarı makul seviyeye indirilmeli",
  },
  {
    pattern: /süresiz.*rekabet yasağı/i,
    issue: "Süresiz rekabet yasağı hukuka aykırı olabilir",
    severity: "kritik",
    recommendation: "Rekabet yasağı süresi ve kapsamı sınırlandırılmalı (TBK m.445)",
  },
  {
    pattern: /tüm hakları devredilmiş sayılır/i,
    issue: "Geniş kapsamlı hak devri maddesi",
    severity: "yüksek",
    recommendation: "Devredilen haklar açıkça belirtilmeli",
  },
  {
    pattern: /önceden bildirime gerek olmaksızın/i,
    issue: "Bildirimsiz işlem yetkisi",
    severity: "orta",
    recommendation: "Makul bildirim süreleri eklenmeli",
  },
  {
    pattern: /her türlü değişiklik.*tek taraflı/i,
    issue: "Tek taraflı değişiklik hakkı",
    severity: "yüksek",
    recommendation: "Değişiklikler için karşılıklı onay şartı eklenmeli",
  },
  {
    pattern: /kefalet/i,
    issue: "Kefalet düzenlemesi var",
    severity: "orta",
    recommendation: "Kefalet şartları ve limitleri netleştirilmeli",
  },
  {
    pattern: /otomatik yenileme/i,
    issue: "Otomatik yenileme maddesi var",
    severity: "düşük",
    recommendation: "Yenileme koşulları ve itiraz süresi kontrol edilmeli",
  },
];

// Essential clauses by contract type
const ESSENTIAL_CLAUSES: Record<ContractType, ClauseType[]> = {
  is_sozlesmesi: ["taraflar", "konu", "sure", "ucret", "fesih", "gizlilik", "rekabet_yasagi", "uyusmazlik"],
  kira_sozlesmesi: ["taraflar", "konu", "sure", "ucret", "odeme", "fesih", "tebligat", "uyusmazlik"],
  satis_sozlesmesi: ["taraflar", "konu", "ucret", "odeme", "devir", "uyusmazlik"],
  hizmet_sozlesmesi: ["taraflar", "konu", "sure", "ucret", "fesih", "gizlilik", "uyusmazlik"],
  ortaklik_sozlesmesi: ["taraflar", "konu", "sure", "fesih", "uyusmazlik", "devir"],
  gizlilik_sozlesmesi: ["taraflar", "konu", "sure", "gizlilik", "cezai_sart", "uyusmazlik"],
  franchise_sozlesmesi: ["taraflar", "konu", "sure", "ucret", "fesih", "gizlilik", "rekabet_yasagi", "uyusmazlik"],
  diger: ["taraflar", "konu", "uyusmazlik"],
};

/**
 * Analyze a contract text
 */
export function analyzeContract(
  text: string,
  contractType?: ContractType
): ContractAnalysis {
  // Detect contract type if not provided
  const detectedType = contractType || detectContractType(text);

  // Extract parties
  const parties = extractParties(text);

  // Identify clauses
  const clauses = identifyClauses(text);

  // Find missing clauses
  const missingClauses = findMissingClauses(clauses, detectedType);

  // Calculate risk score
  const { score, level } = calculateRiskScore(clauses, missingClauses);

  // Generate summary
  const summary = generateSummary(text, clauses, parties);

  // Check compliance
  const complianceStatus = checkCompliance(text, detectedType);

  // Generate recommendations
  const recommendations = generateRecommendations(clauses, missingClauses, complianceStatus);

  return {
    contractType: detectedType,
    parties,
    clauses,
    missingClauses,
    riskScore: score,
    riskLevel: level,
    summary,
    recommendations,
    complianceStatus,
  };
}

/**
 * Detect contract type from text
 */
function detectContractType(text: string): ContractType {
  const lowerText = text.toLowerCase();

  if (lowerText.includes("iş sözleşmesi") || lowerText.includes("hizmet akdi")) {
    return "is_sozlesmesi";
  }
  if (lowerText.includes("kira sözleşmesi") || lowerText.includes("kira kontratı")) {
    return "kira_sozlesmesi";
  }
  if (lowerText.includes("satış sözleşmesi") || lowerText.includes("satım sözleşmesi")) {
    return "satis_sozlesmesi";
  }
  if (lowerText.includes("hizmet sözleşmesi") || lowerText.includes("danışmanlık sözleşmesi")) {
    return "hizmet_sozlesmesi";
  }
  if (lowerText.includes("ortaklık") || lowerText.includes("şirket sözleşmesi")) {
    return "ortaklik_sozlesmesi";
  }
  if (lowerText.includes("gizlilik sözleşmesi") || lowerText.includes("nda")) {
    return "gizlilik_sozlesmesi";
  }
  if (lowerText.includes("franchise") || lowerText.includes("bayilik")) {
    return "franchise_sozlesmesi";
  }

  return "diger";
}

/**
 * Extract party information
 */
function extractParties(text: string): PartyInfo[] {
  const parties: PartyInfo[] = [];

  // Simple pattern matching for parties
  const partyPatterns = [
    /bir tarafta\s+([^,]+)/i,
    /diğer tarafta\s+([^,]+)/i,
    /işveren[:\s]+([^\n]+)/i,
    /işçi[:\s]+([^\n]+)/i,
    /kiraya veren[:\s]+([^\n]+)/i,
    /kiracı[:\s]+([^\n]+)/i,
    /satıcı[:\s]+([^\n]+)/i,
    /alıcı[:\s]+([^\n]+)/i,
  ];

  for (const pattern of partyPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim().substring(0, 100);
      const isTuzel = /a\.ş\.|ltd\.|şti\.|şirket|limited/i.test(name);

      parties.push({
        role: parties.length === 0 ? "taraf1" : "taraf2",
        name,
        type: isTuzel ? "tuzel_kisi" : "gercek_kisi",
        obligations: [],
        rights: [],
      });
    }
  }

  return parties;
}

/**
 * Identify clauses in contract
 */
function identifyClauses(text: string): ContractClause[] {
  const clauses: ContractClause[] = [];
  const sections = text.split(/(?:madde\s*\d+|m\.\s*\d+|^\d+[.)]\s*)/im);

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i].trim();
    if (section.length < 20) continue;

    const clauseType = detectClauseType(section);
    const issues = detectClauseIssues(section);
    const riskLevel = calculateClauseRisk(issues);

    clauses.push({
      id: `clause_${i}`,
      title: extractClauseTitle(section) || `Madde ${i}`,
      content: section.substring(0, 500),
      type: clauseType,
      riskLevel,
      issues,
      suggestions: generateClauseSuggestions(issues),
    });
  }

  return clauses;
}

/**
 * Detect clause type
 */
function detectClauseType(text: string): ClauseType {
  for (const [type, patterns] of Object.entries(CLAUSE_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return type as ClauseType;
      }
    }
  }
  return "diger";
}

/**
 * Extract clause title
 */
function extractClauseTitle(text: string): string | null {
  const lines = text.split("\n");
  const firstLine = lines[0]?.trim();

  if (firstLine && firstLine.length < 100) {
    return firstLine.replace(/[:.-]+$/, "");
  }

  return null;
}

/**
 * Detect issues in a clause
 */
function detectClauseIssues(text: string): ClauseIssue[] {
  const issues: ClauseIssue[] = [];

  for (const indicator of RISK_INDICATORS) {
    if (indicator.pattern.test(text)) {
      issues.push({
        type: "risk_maddesi",
        severity: indicator.severity,
        description: indicator.issue,
        recommendation: indicator.recommendation,
      });
    }
  }

  // Check for vague language
  const vaguePatterns = [
    /makul süre içinde/i,
    /uygun görülen/i,
    /gerektiğinde/i,
    /vs\./i,
    /vb\./i,
    /gibi/i,
  ];

  for (const pattern of vaguePatterns) {
    if (pattern.test(text)) {
      issues.push({
        type: "belirsiz_ifade",
        severity: "düşük",
        description: "Belirsiz ifade kullanılmış",
        recommendation: "Net ve ölçülebilir ifadeler kullanılmalı",
      });
      break;
    }
  }

  return issues;
}

/**
 * Calculate clause risk level
 */
function calculateClauseRisk(issues: ClauseIssue[]): RiskLevel {
  if (issues.some(i => i.severity === "kritik")) return "kritik";
  if (issues.some(i => i.severity === "yüksek")) return "yüksek";
  if (issues.some(i => i.severity === "orta")) return "orta";
  if (issues.length > 0) return "düşük";
  return "düşük";
}

/**
 * Generate suggestions for clause issues
 */
function generateClauseSuggestions(issues: ClauseIssue[]): string[] {
  return issues.map(i => i.recommendation);
}

/**
 * Find missing essential clauses
 */
function findMissingClauses(clauses: ContractClause[], contractType: ContractType): MissingClause[] {
  const missing: MissingClause[] = [];
  const essentialTypes = ESSENTIAL_CLAUSES[contractType] || ESSENTIAL_CLAUSES.diger;
  const presentTypes = new Set(clauses.map(c => c.type));

  const clauseInfo: Record<ClauseType, { importance: RiskLevel; description: string; suggestion: string }> = {
    taraflar: {
      importance: "kritik",
      description: "Sözleşme taraflarının kimlik bilgileri",
      suggestion: "Tarafların tam adı, adresi ve iletişim bilgileri eklenmelidir.",
    },
    konu: {
      importance: "kritik",
      description: "Sözleşmenin konusu ve kapsamı",
      suggestion: "Sözleşmenin amacı ve kapsamı açıkça belirtilmelidir.",
    },
    sure: {
      importance: "yüksek",
      description: "Sözleşme süresi ve yürürlük tarihleri",
      suggestion: "Başlangıç ve bitiş tarihleri, uzama koşulları belirtilmelidir.",
    },
    ucret: {
      importance: "kritik",
      description: "Ücret/bedel miktarı ve ödeme koşulları",
      suggestion: "Bedel miktarı, KDV durumu ve ödeme vadesi eklenmelidir.",
    },
    odeme: {
      importance: "yüksek",
      description: "Ödeme şekli ve koşulları",
      suggestion: "Ödeme yöntemi, vadesi ve gecikme sonuçları düzenlenmelidir.",
    },
    fesih: {
      importance: "yüksek",
      description: "Sözleşmenin feshi koşulları",
      suggestion: "Haklı ve haksız fesih koşulları, bildirim süreleri eklenmelidir.",
    },
    cezai_sart: {
      importance: "orta",
      description: "Cezai şart düzenlemesi",
      suggestion: "İhlal halinde uygulanacak cezai şart miktarı belirlenmelidir.",
    },
    gizlilik: {
      importance: "yüksek",
      description: "Gizlilik ve sır saklama yükümlülüğü",
      suggestion: "Gizli bilgilerin kapsamı ve süresi belirtilmelidir.",
    },
    rekabet_yasagi: {
      importance: "orta",
      description: "Rekabet etmeme yükümlülüğü",
      suggestion: "Rekabet yasağı süresi (max 2 yıl) ve kapsamı eklenmelidir.",
    },
    uyusmazlik: {
      importance: "kritik",
      description: "Uyuşmazlık çözüm yolu ve yetkili mahkeme",
      suggestion: "Yetkili mahkeme veya tahkim şartı eklenmelidir.",
    },
    tebligat: {
      importance: "orta",
      description: "Tebligat adresleri ve bildirimlerin usulü",
      suggestion: "Tebligat adresleri ve geçerli bildirim yöntemleri eklenmelidir.",
    },
    mucbir_sebep: {
      importance: "yüksek",
      description: "Mücbir sebep halleri ve sonuçları",
      suggestion: "Mücbir sebep tanımı ve bu hallerde tarafların hakları düzenlenmelidir.",
    },
    devir: {
      importance: "orta",
      description: "Sözleşmenin devri koşulları",
      suggestion: "Sözleşmenin üçüncü kişilere devir koşulları belirtilmelidir.",
    },
    diger: {
      importance: "düşük",
      description: "Diğer hükümler",
      suggestion: "",
    },
  };

  for (const type of essentialTypes) {
    if (!presentTypes.has(type)) {
      const info = clauseInfo[type];
      missing.push({
        type,
        importance: info.importance,
        description: info.description,
        suggestedContent: info.suggestion,
      });
    }
  }

  return missing;
}

/**
 * Calculate overall risk score
 */
function calculateRiskScore(
  clauses: ContractClause[],
  missingClauses: MissingClause[]
): { score: number; level: RiskLevel } {
  let score = 100;

  // Deduct for clause issues
  for (const clause of clauses) {
    for (const issue of clause.issues) {
      switch (issue.severity) {
        case "kritik": score -= 15; break;
        case "yüksek": score -= 10; break;
        case "orta": score -= 5; break;
        case "düşük": score -= 2; break;
      }
    }
  }

  // Deduct for missing clauses
  for (const missing of missingClauses) {
    switch (missing.importance) {
      case "kritik": score -= 20; break;
      case "yüksek": score -= 10; break;
      case "orta": score -= 5; break;
      case "düşük": score -= 2; break;
    }
  }

  score = Math.max(0, Math.min(100, score));

  let level: RiskLevel;
  if (score >= 80) level = "düşük";
  else if (score >= 60) level = "orta";
  else if (score >= 40) level = "yüksek";
  else level = "kritik";

  return { score, level };
}

/**
 * Generate contract summary
 */
function generateSummary(
  text: string,
  clauses: ContractClause[],
  parties: PartyInfo[]
): ContractSummary {
  const konuClause = clauses.find(c => c.type === "konu");
  const sureClause = clauses.find(c => c.type === "sure");
  const ucretClause = clauses.find(c => c.type === "ucret");
  const fesihClause = clauses.find(c => c.type === "fesih");

  return {
    purpose: konuClause?.content.substring(0, 200) || "Sözleşme konusu belirtilmemiş",
    duration: sureClause?.content.substring(0, 100) || "Süre belirtilmemiş",
    value: ucretClause ? extractValue(ucretClause.content) : undefined,
    keyTerms: extractKeyTerms(text),
    mainObligations: parties.flatMap(p => p.obligations).slice(0, 5),
    terminationConditions: fesihClause
      ? [fesihClause.content.substring(0, 200)]
      : ["Fesih koşulları belirtilmemiş"],
  };
}

/**
 * Extract monetary value from text
 */
function extractValue(text: string): string | undefined {
  const patterns = [
    /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s*(?:TL|₺|Türk Lirası)/i,
    /(?:TL|₺)\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return undefined;
}

/**
 * Extract key terms from contract
 */
function extractKeyTerms(text: string): string[] {
  const terms: string[] = [];
  const termPatterns = [
    /belirsiz süreli/i,
    /belirli süreli/i,
    /deneme süresi/i,
    /ihbar süresi/i,
    /kıdem tazminatı/i,
    /rekabet yasağı/i,
    /gizlilik/i,
    /cezai şart/i,
    /depozito/i,
    /teminat/i,
  ];

  for (const pattern of termPatterns) {
    if (pattern.test(text)) {
      const match = text.match(pattern);
      if (match) {
        terms.push(match[0]);
      }
    }
  }

  return terms.slice(0, 10);
}

/**
 * Check compliance with Turkish laws
 */
function checkCompliance(text: string, contractType: ContractType): ComplianceStatus {
  return {
    kvkk: checkKVKKCompliance(text),
    isKanunu: checkIsKanunuCompliance(text, contractType),
    ticaretKanunu: checkTicaretKanunuCompliance(text, contractType),
    tuketiciKanunu: checkTuketiciKanunuCompliance(text),
    overall: "orta", // Will be calculated
  };
}

/**
 * Check KVKK (Turkish GDPR) compliance
 */
function checkKVKKCompliance(text: string): ComplianceResult {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check for personal data processing mentions
  if (/kişisel veri|kişisel bilgi/i.test(text)) {
    if (!/açık rıza/i.test(text)) {
      issues.push("Kişisel veri işleme için açık rıza şartı belirtilmemiş");
      recommendations.push("KVKK m.5 uyarınca açık rıza maddesi eklenmelidir");
    }
    if (!/veri sorumlusu/i.test(text)) {
      issues.push("Veri sorumlusu bilgisi eksik");
      recommendations.push("Veri sorumlusu kimlik ve iletişim bilgileri eklenmelidir");
    }
  }

  // Check for data transfer mentions
  if (/yurt dışı|uluslararası|aktarım/i.test(text)) {
    if (!/yeterli koruma/i.test(text)) {
      issues.push("Yurt dışı veri aktarımı için yeterli koruma şartları belirtilmemiş");
      recommendations.push("KVKK m.9 uyarınca veri aktarım şartları eklenmelidir");
    }
  }

  return {
    compliant: issues.length === 0,
    issues,
    recommendations,
  };
}

/**
 * Check Labor Law compliance
 */
function checkIsKanunuCompliance(text: string, contractType: ContractType): ComplianceResult {
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (contractType !== "is_sozlesmesi") {
    return { compliant: true, issues: [], recommendations: [] };
  }

  // Check minimum wage
  if (/asgari ücret.*altında|minimum.*altında/i.test(text)) {
    issues.push("Asgari ücretin altında ücret düzenlemesi hukuka aykırıdır");
    recommendations.push("Ücret en az asgari ücret seviyesinde olmalıdır");
  }

  // Check working hours
  if (/haftalık 45 saat.*aşan|60 saat|70 saat/i.test(text)) {
    issues.push("Haftalık çalışma süresi yasal sınırları aşabilir");
    recommendations.push("İş Kanunu m.63 uyarınca haftalık çalışma en fazla 45 saattir");
  }

  // Check probation period
  if (/deneme süresi.*(\d+)/i.test(text)) {
    const match = text.match(/deneme süresi.*?(\d+)/i);
    if (match && parseInt(match[1]) > 4) {
      issues.push("Deneme süresi yasal sınırı (4 ay) aşıyor olabilir");
      recommendations.push("İş Kanunu m.15 uyarınca deneme süresi en fazla 2 aydır (toplu iş sözleşmesi ile 4 ay)");
    }
  }

  // Check non-compete clause
  if (/rekabet yasağı/i.test(text)) {
    if (/(\d+)\s*yıl/i.test(text)) {
      const match = text.match(/(\d+)\s*yıl/i);
      if (match && parseInt(match[1]) > 2) {
        issues.push("Rekabet yasağı süresi yasal sınırı (2 yıl) aşıyor");
        recommendations.push("TBK m.445 uyarınca rekabet yasağı en fazla 2 yıl olabilir");
      }
    }
  }

  return {
    compliant: issues.length === 0,
    issues,
    recommendations,
  };
}

/**
 * Check Commercial Law compliance
 */
function checkTicaretKanunuCompliance(text: string, contractType: ContractType): ComplianceResult {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check for unfair terms
  if (/tüm riskleri.*üstlenir|her türlü zarar.*karşılar/i.test(text)) {
    issues.push("Tek tarafa aşırı risk yükleyen hüküm bulunabilir");
    recommendations.push("TTK m.1530 uyarınca hakkaniyete aykırı şartlar denetlenebilir");
  }

  return {
    compliant: issues.length === 0,
    issues,
    recommendations,
  };
}

/**
 * Check Consumer Law compliance
 */
function checkTuketiciKanunuCompliance(text: string): ComplianceResult {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check for consumer rights
  if (/tüketici|müşteri/i.test(text)) {
    if (!/cayma hakkı/i.test(text)) {
      issues.push("Cayma hakkı bilgisi eksik olabilir");
      recommendations.push("TKHK m.48 uyarınca 14 günlük cayma hakkı bilgisi eklenmelidir");
    }
  }

  return {
    compliant: issues.length === 0,
    issues,
    recommendations,
  };
}

/**
 * Generate recommendations
 */
function generateRecommendations(
  clauses: ContractClause[],
  missingClauses: MissingClause[],
  compliance: ComplianceStatus
): string[] {
  const recommendations: string[] = [];

  // Add clause issue recommendations
  for (const clause of clauses) {
    for (const issue of clause.issues) {
      if (!recommendations.includes(issue.recommendation)) {
        recommendations.push(issue.recommendation);
      }
    }
  }

  // Add missing clause recommendations
  for (const missing of missingClauses) {
    if (missing.importance === "kritik" || missing.importance === "yüksek") {
      recommendations.push(`Eksik madde eklenmeli: ${missing.description}`);
    }
  }

  // Add compliance recommendations
  for (const rec of compliance.kvkk.recommendations) {
    if (!recommendations.includes(rec)) recommendations.push(rec);
  }
  for (const rec of compliance.isKanunu.recommendations) {
    if (!recommendations.includes(rec)) recommendations.push(rec);
  }

  return recommendations.slice(0, 10);
}

/**
 * Get risk level color
 */
export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case "düşük": return "#22c55e";
    case "orta": return "#eab308";
    case "yüksek": return "#f97316";
    case "kritik": return "#ef4444";
  }
}

/**
 * Get risk level label
 */
export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case "düşük": return "Düşük Risk";
    case "orta": return "Orta Risk";
    case "yüksek": return "Yüksek Risk";
    case "kritik": return "Kritik Risk";
  }
}

/**
 * Get contract type name
 */
export function getContractTypeName(type: ContractType): string {
  const names: Record<ContractType, string> = {
    is_sozlesmesi: "İş Sözleşmesi",
    kira_sozlesmesi: "Kira Sözleşmesi",
    satis_sozlesmesi: "Satış Sözleşmesi",
    hizmet_sozlesmesi: "Hizmet Sözleşmesi",
    ortaklik_sozlesmesi: "Ortaklık Sözleşmesi",
    gizlilik_sozlesmesi: "Gizlilik Sözleşmesi",
    franchise_sozlesmesi: "Franchise Sözleşmesi",
    diger: "Diğer",
  };
  return names[type];
}

/**
 * Get all contract types
 */
export function getContractTypes(): Array<{ id: ContractType; name: string }> {
  return [
    { id: "is_sozlesmesi", name: "İş Sözleşmesi" },
    { id: "kira_sozlesmesi", name: "Kira Sözleşmesi" },
    { id: "satis_sozlesmesi", name: "Satış Sözleşmesi" },
    { id: "hizmet_sozlesmesi", name: "Hizmet Sözleşmesi" },
    { id: "ortaklik_sozlesmesi", name: "Ortaklık Sözleşmesi" },
    { id: "gizlilik_sozlesmesi", name: "Gizlilik Sözleşmesi" },
    { id: "franchise_sozlesmesi", name: "Franchise Sözleşmesi" },
    { id: "diger", name: "Diğer" },
  ];
}

/**
 * Get risk level info (color and name)
 */
export function getRiskLevelInfo(level: RiskLevel): { name: string; color: string } {
  return {
    name: getRiskLabel(level),
    color: getRiskColor(level),
  };
}
