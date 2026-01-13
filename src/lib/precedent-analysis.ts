/**
 * Precedent Analysis Module
 *
 * Advanced legal precedent (içtihat) analysis for Turkish law:
 * - Yargıtay (Court of Cassation) decisions
 * - Danıştay (Council of State) decisions
 * - Anayasa Mahkemesi (Constitutional Court) decisions
 * - Bölge Adliye/İdare Mahkemeleri (Regional Courts) decisions
 *
 * Features:
 * - Precedent search and classification
 * - Ratio decidendi extraction
 * - Obiter dicta identification
 * - Precedent strength analysis
 * - Evolution tracking over time
 * - Conflicting precedent detection
 */

export interface Precedent {
  id: string;
  court: CourtType;
  chamber: string;
  caseNumber: CaseNumber;
  decisionDate: Date;
  publicationDate?: Date;
  subject: string;
  legalArea: LegalArea;
  keywords: string[];
  headnote: string;
  facts: string;
  issues: LegalIssue[];
  holdings: Holding[];
  reasoning: string;
  ratioDecidendi: RatioDecidendi[];
  obiterDicta: ObiterDictum[];
  citedPrecedents: CitedPrecedent[];
  citedLaws: CitedLaw[];
  outcome: CaseOutcome;
  significance: PrecedentSignificance;
  status: PrecedentStatus;
}

export interface CaseNumber {
  year: number;
  esasNo: number;
  kararNo?: number;
  fullCitation: string;
}

export interface LegalIssue {
  id: string;
  question: string;
  answer: string;
  isNovel: boolean;
}

export interface Holding {
  id: string;
  statement: string;
  isBinding: boolean;
  scope: "genel" | "sinirli" | "ozel";
  relatedLaw?: string;
}

export interface RatioDecidendi {
  id: string;
  principle: string;
  context: string;
  bindingStrength: "guclu" | "orta" | "zayif";
  applicableScenarios: string[];
}

export interface ObiterDictum {
  id: string;
  statement: string;
  relevance: "yuksek" | "orta" | "dusuk";
  potentialFuturePrinciple: boolean;
}

export interface CitedPrecedent {
  caseNumber: string;
  court: CourtType;
  year: number;
  citationType: "destekleyici" | "ayirt_edici" | "degistirici";
  relevance: number; // 0-1
}

export interface CitedLaw {
  lawName: string;
  lawNumber?: number;
  articles: string[];
  interpretation?: string;
}

export interface CaseOutcome {
  type: "onama" | "bozma" | "kismi_bozma" | "ret" | "kabul" | "diger";
  summary: string;
  remedies?: string[];
}

export interface PrecedentSignificance {
  level: "ictihat_birlestirme" | "emsal" | "standart" | "sinirli";
  reason: string;
  citationCount: number;
  followedBy: number;
  distinguishedBy: number;
  overruledBy?: string;
}

export type PrecedentStatus =
  | "gecerli"           // Currently valid
  | "degistirildi"      // Modified by later decision
  | "sinirlandirildi"   // Limited in scope
  | "kaldirildi"        // Overruled
  | "yasayla_degisti";  // Changed by legislation

export type CourtType =
  | "yargitay"
  | "danistay"
  | "anayasa_mahkemesi"
  | "bolge_adliye"
  | "bolge_idare"
  | "uyusmazlik_mahkemesi";

export type LegalArea =
  | "ceza"
  | "hukuk"
  | "is"
  | "ticaret"
  | "idare"
  | "vergi"
  | "aile"
  | "icra_iflas"
  | "tuketici"
  | "fikri_mulkiyet"
  | "insaat"
  | "saglik"
  | "cevre"
  | "anayasa";

export interface PrecedentSearchCriteria {
  court?: CourtType[];
  legalArea?: LegalArea[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  keywords?: string[];
  citedLaw?: string;
  citedArticle?: string;
  outcome?: CaseOutcome["type"][];
  significance?: PrecedentSignificance["level"][];
  status?: PrecedentStatus[];
}

export interface PrecedentAnalysisResult {
  id: string;
  query: string;
  relevantPrecedents: PrecedentMatch[];
  principlesExtracted: ExtractedPrinciple[];
  timelineAnalysis: TimelinePoint[];
  conflictingViews: ConflictingView[];
  recommendations: AnalysisRecommendation[];
  statistics: AnalysisStatistics;
  processingTimeMs: number;
}

export interface PrecedentMatch {
  precedent: Precedent;
  relevanceScore: number;
  matchedKeywords: string[];
  matchedPrinciples: string[];
  applicability: "dogrudan" | "benzer" | "kiyas" | "zayif";
}

export interface ExtractedPrinciple {
  principle: string;
  sources: Array<{ caseNumber: string; court: CourtType }>;
  consistency: "tutarli" | "degisken" | "celiskili";
  currentValidity: "gecerli" | "belirsiz" | "gecersiz";
  practicalGuidance: string;
}

export interface TimelinePoint {
  date: Date;
  caseNumber: string;
  event: "ilk_karar" | "takip" | "degisiklik" | "birlestirme";
  description: string;
  impact: string;
}

export interface ConflictingView {
  issue: string;
  view1: {
    position: string;
    supportingCases: string[];
    court?: string;
  };
  view2: {
    position: string;
    supportingCases: string[];
    court?: string;
  };
  resolution?: {
    resolvedBy: string;
    date: Date;
    outcome: string;
  };
}

export interface AnalysisRecommendation {
  type: "emsal_kullan" | "dikkat" | "alternatif" | "guncel_kontrol";
  title: string;
  description: string;
  confidence: number;
}

export interface AnalysisStatistics {
  totalPrecedentsAnalyzed: number;
  relevantPrecedentsFound: number;
  dateRangeCovered: { start: Date; end: Date };
  courtDistribution: Record<CourtType, number>;
  outcomeDistribution: Record<string, number>;
}

// Yargıtay chambers and their specializations
const YARGITAY_CHAMBERS: Record<string, { name: string; specialization: string[] }> = {
  "1HD": { name: "1. Hukuk Dairesi", specialization: ["taşınmaz", "mülkiyet", "tapu"] },
  "2HD": { name: "2. Hukuk Dairesi", specialization: ["aile", "boşanma", "nafaka", "velayet"] },
  "3HD": { name: "3. Hukuk Dairesi", specialization: ["tazminat", "haksız fiil"] },
  "4HD": { name: "4. Hukuk Dairesi", specialization: ["borçlar", "tazminat"] },
  "5HD": { name: "5. Hukuk Dairesi", specialization: ["kamulaştırma"] },
  "6HD": { name: "6. Hukuk Dairesi", specialization: ["kira", "paydaşlık"] },
  "7HD": { name: "7. Hukuk Dairesi", specialization: ["kadastro", "mülkiyet"] },
  "8HD": { name: "8. Hukuk Dairesi", specialization: ["miras", "vesayet"] },
  "9HD": { name: "9. Hukuk Dairesi", specialization: ["iş", "işçi hakları"] },
  "10HD": { name: "10. Hukuk Dairesi", specialization: ["sosyal güvenlik"] },
  "11HD": { name: "11. Hukuk Dairesi", specialization: ["ticaret", "şirket", "sigorta"] },
  "12HD": { name: "12. Hukuk Dairesi", specialization: ["icra", "iflas"] },
  "13HD": { name: "13. Hukuk Dairesi", specialization: ["tüketici", "borçlar"] },
  "14HD": { name: "14. Hukuk Dairesi", specialization: ["taşınmaz", "kat mülkiyeti"] },
  "15HD": { name: "15. Hukuk Dairesi", specialization: ["eser sözleşmesi", "inşaat"] },
  "17HD": { name: "17. Hukuk Dairesi", specialization: ["trafik", "sigorta"] },
  "19HD": { name: "19. Hukuk Dairesi", specialization: ["ticaret", "banka"] },
  "21HD": { name: "21. Hukuk Dairesi", specialization: ["iş kazası", "meslek hastalığı"] },
  "22HD": { name: "22. Hukuk Dairesi", specialization: ["iş", "fesih", "işe iade"] },
  "HGKD": { name: "Hukuk Genel Kurulu", specialization: ["içtihat birleştirme"] },
  "CGK": { name: "Ceza Genel Kurulu", specialization: ["ceza", "içtihat birleştirme"] },
};

// Sample precedent database (simplified - in production would be connected to actual database)
const SAMPLE_PRECEDENTS: Partial<Precedent>[] = [
  {
    id: "prec_001",
    court: "yargitay",
    chamber: "9HD",
    caseNumber: { year: 2024, esasNo: 12345, kararNo: 6789, fullCitation: "Yargıtay 9. HD 2024/12345 E. 2024/6789 K." },
    decisionDate: new Date("2024-06-15"),
    subject: "İşe iade davasında feshin geçersizliği",
    legalArea: "is",
    keywords: ["işe iade", "geçersiz fesih", "son çare ilkesi", "iş güvencesi"],
    headnote: "İşverenin fesih bildiriminde somut ve geçerli bir sebep göstermemesi halinde fesih geçersiz sayılır.",
    status: "gecerli",
  },
  {
    id: "prec_002",
    court: "yargitay",
    chamber: "HGKD",
    caseNumber: { year: 2023, esasNo: 456, kararNo: 789, fullCitation: "Yargıtay HGK 2023/456 E. 2023/789 K." },
    decisionDate: new Date("2023-11-20"),
    subject: "Kira artış oranında sınırlama",
    legalArea: "hukuk",
    keywords: ["kira artışı", "TÜFE", "üst sınır", "TBK 344"],
    headnote: "Konut kiralarında yıllık artış oranı TÜFE'nin 12 aylık ortalamasını geçemez.",
    status: "gecerli",
  },
  {
    id: "prec_003",
    court: "anayasa_mahkemesi",
    chamber: "Genel Kurul",
    caseNumber: { year: 2024, esasNo: 100, kararNo: 50, fullCitation: "AYM 2024/100 E. 2024/50 K." },
    decisionDate: new Date("2024-03-10"),
    subject: "Kişisel verilerin korunması hakkı",
    legalArea: "anayasa",
    keywords: ["kişisel veri", "özel hayat", "mahremiyet", "KVKK"],
    headnote: "Kişisel verilerin işlenmesinde Anayasa'nın 20. maddesi kapsamında özel hayatın gizliliği hakkı öncelikle değerlendirilmelidir.",
    status: "gecerli",
  },
];

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Search for relevant precedents
 */
export async function searchPrecedents(
  query: string,
  criteria?: PrecedentSearchCriteria
): Promise<PrecedentMatch[]> {
  const matches: PrecedentMatch[] = [];
  const queryLower = query.toLowerCase();
  const queryKeywords = extractKeywords(query);

  for (const prec of SAMPLE_PRECEDENTS) {
    let relevanceScore = 0;
    const matchedKeywords: string[] = [];
    const matchedPrinciples: string[] = [];

    // Check keyword matches
    for (const keyword of prec.keywords || []) {
      if (queryLower.includes(keyword.toLowerCase())) {
        relevanceScore += 0.2;
        matchedKeywords.push(keyword);
      }
      if (queryKeywords.some((qk) => keyword.toLowerCase().includes(qk))) {
        relevanceScore += 0.1;
        if (!matchedKeywords.includes(keyword)) {
          matchedKeywords.push(keyword);
        }
      }
    }

    // Check subject match
    if (prec.subject && queryLower.includes(prec.subject.toLowerCase())) {
      relevanceScore += 0.3;
    }

    // Check headnote match
    if (prec.headnote) {
      const headnoteLower = prec.headnote.toLowerCase();
      for (const qk of queryKeywords) {
        if (headnoteLower.includes(qk)) {
          relevanceScore += 0.15;
          matchedPrinciples.push(prec.headnote);
          break;
        }
      }
    }

    // Apply criteria filters
    if (criteria) {
      if (criteria.court && !criteria.court.includes(prec.court!)) {
        continue;
      }
      if (criteria.legalArea && !criteria.legalArea.includes(prec.legalArea!)) {
        continue;
      }
      if (criteria.dateRange) {
        const decDate = prec.decisionDate!;
        if (decDate < criteria.dateRange.start || decDate > criteria.dateRange.end) {
          continue;
        }
      }
      if (criteria.status && !criteria.status.includes(prec.status!)) {
        continue;
      }
    }

    if (relevanceScore > 0.1) {
      matches.push({
        precedent: prec as Precedent,
        relevanceScore: Math.min(relevanceScore, 1),
        matchedKeywords,
        matchedPrinciples,
        applicability: determineApplicability(relevanceScore),
      });
    }
  }

  // Sort by relevance
  matches.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return matches;
}

/**
 * Extract keywords from query
 */
function extractKeywords(query: string): string[] {
  const stopWords = new Set([
    "ve", "veya", "ile", "için", "bu", "bir", "da", "de", "mi", "mı",
    "ne", "nasıl", "hangi", "karar", "emsal", "içtihat",
  ]);

  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

/**
 * Determine applicability level
 */
function determineApplicability(
  relevanceScore: number
): PrecedentMatch["applicability"] {
  if (relevanceScore >= 0.7) return "dogrudan";
  if (relevanceScore >= 0.5) return "benzer";
  if (relevanceScore >= 0.3) return "kiyas";
  return "zayif";
}

/**
 * Analyze a legal issue against precedents
 */
export async function analyzePrecedents(
  legalIssue: string,
  context: {
    legalArea: LegalArea;
    facts: string;
    jurisdiction?: string;
  }
): Promise<PrecedentAnalysisResult> {
  const startTime = Date.now();

  // Search for relevant precedents
  const relevantPrecedents = await searchPrecedents(legalIssue, {
    legalArea: [context.legalArea],
    status: ["gecerli", "degistirildi"],
  });

  // Extract principles from precedents
  const principlesExtracted = extractPrinciples(relevantPrecedents, legalIssue);

  // Build timeline analysis
  const timelineAnalysis = buildTimeline(relevantPrecedents);

  // Detect conflicting views
  const conflictingViews = detectConflicts(relevantPrecedents);

  // Generate recommendations
  const recommendations = generateRecommendations(
    relevantPrecedents,
    principlesExtracted,
    conflictingViews
  );

  // Compile statistics
  const statistics = compileStatistics(relevantPrecedents);

  return {
    id: generateId("analysis"),
    query: legalIssue,
    relevantPrecedents,
    principlesExtracted,
    timelineAnalysis,
    conflictingViews,
    recommendations,
    statistics,
    processingTimeMs: Date.now() - startTime,
  };
}

/**
 * Extract legal principles from precedents
 */
function extractPrinciples(
  matches: PrecedentMatch[],
  issue: string
): ExtractedPrinciple[] {
  const principles: ExtractedPrinciple[] = [];
  const seenPrinciples = new Map<string, ExtractedPrinciple>();

  for (const match of matches) {
    const prec = match.precedent;
    if (prec.headnote) {
      const key = prec.headnote.substring(0, 50);
      if (!seenPrinciples.has(key)) {
        seenPrinciples.set(key, {
          principle: prec.headnote,
          sources: [{ caseNumber: prec.caseNumber.fullCitation, court: prec.court }],
          consistency: "tutarli",
          currentValidity: prec.status === "gecerli" ? "gecerli" : "belirsiz",
          practicalGuidance: generatePracticalGuidance(prec.headnote, issue),
        });
      } else {
        const existing = seenPrinciples.get(key)!;
        existing.sources.push({
          caseNumber: prec.caseNumber.fullCitation,
          court: prec.court,
        });
      }
    }
  }

  return Array.from(seenPrinciples.values());
}

/**
 * Generate practical guidance from a principle
 */
function generatePracticalGuidance(principle: string, issue: string): string {
  // In production, this would use AI to generate specific guidance
  return `Bu ilke uyarınca: ${principle.substring(0, 100)}... konusunda dikkatli değerlendirme yapılmalıdır.`;
}

/**
 * Build timeline of precedent evolution
 */
function buildTimeline(matches: PrecedentMatch[]): TimelinePoint[] {
  const timeline: TimelinePoint[] = [];

  const sortedMatches = [...matches].sort(
    (a, b) =>
      a.precedent.decisionDate.getTime() - b.precedent.decisionDate.getTime()
  );

  for (let i = 0; i < sortedMatches.length; i++) {
    const match = sortedMatches[i];
    const prec = match.precedent;

    let event: TimelinePoint["event"] = "ilk_karar";
    if (i > 0) {
      event = prec.court === "yargitay" && prec.chamber === "HGKD"
        ? "birlestirme"
        : "takip";
    }

    timeline.push({
      date: prec.decisionDate,
      caseNumber: prec.caseNumber.fullCitation,
      event,
      description: prec.subject,
      impact: determineImpact(prec, i === 0),
    });
  }

  return timeline;
}

/**
 * Determine impact of a precedent
 */
function determineImpact(prec: Precedent, isFirst: boolean): string {
  if (isFirst) {
    return "Bu konudaki ilk önemli karar";
  }
  if (prec.chamber === "HGKD" || prec.chamber === "CGK") {
    return "İçtihat birleştirici nitelikte karar";
  }
  if (prec.status === "degistirildi") {
    return "Bu karar daha sonra değiştirilmiştir";
  }
  return "Yerleşik içtihadı takip eden karar";
}

/**
 * Detect conflicting precedents
 */
function detectConflicts(matches: PrecedentMatch[]): ConflictingView[] {
  const conflicts: ConflictingView[] = [];

  // In production, this would use NLP to detect actual conflicts
  // For now, return empty array indicating no conflicts found

  return conflicts;
}

/**
 * Generate analysis recommendations
 */
function generateRecommendations(
  matches: PrecedentMatch[],
  principles: ExtractedPrinciple[],
  conflicts: ConflictingView[]
): AnalysisRecommendation[] {
  const recommendations: AnalysisRecommendation[] = [];

  // Recommend using strong precedents
  const strongMatches = matches.filter(
    (m) => m.relevanceScore > 0.6 && m.precedent.status === "gecerli"
  );
  if (strongMatches.length > 0) {
    recommendations.push({
      type: "emsal_kullan",
      title: "Güçlü Emsal Mevcut",
      description: `${strongMatches.length} adet doğrudan uygulanabilir emsal karar tespit edildi. Bu kararlar savunmanızı güçlendirebilir.`,
      confidence: 0.85,
    });
  }

  // Warn about conflicts
  if (conflicts.length > 0) {
    recommendations.push({
      type: "dikkat",
      title: "Çelişkili İçtihat",
      description: `${conflicts.length} adet çelişkili görüş tespit edildi. Her iki görüşe karşı hazırlıklı olunmalı.`,
      confidence: 0.75,
    });
  }

  // Suggest checking for updates
  const recentMatch = matches.find(
    (m) =>
      m.precedent.decisionDate >
      new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
  );
  if (!recentMatch && matches.length > 0) {
    recommendations.push({
      type: "guncel_kontrol",
      title: "Güncel Karar Kontrolü",
      description:
        "Son 6 ayda bu konuda yeni karar verilmemiş. Güncel içtihat kontrolü yapılması önerilir.",
      confidence: 0.6,
    });
  }

  // Alternative approach
  if (matches.length === 0) {
    recommendations.push({
      type: "alternatif",
      title: "Alternatif Yaklaşım",
      description:
        "Doğrudan emsal bulunamadı. Benzer konularda kıyas yoluyla argüman geliştirilebilir.",
      confidence: 0.5,
    });
  }

  return recommendations;
}

/**
 * Compile analysis statistics
 */
function compileStatistics(matches: PrecedentMatch[]): AnalysisStatistics {
  const courtDistribution: Record<CourtType, number> = {
    yargitay: 0,
    danistay: 0,
    anayasa_mahkemesi: 0,
    bolge_adliye: 0,
    bolge_idare: 0,
    uyusmazlik_mahkemesi: 0,
  };

  const outcomeDistribution: Record<string, number> = {};

  let minDate = new Date();
  let maxDate = new Date(0);

  for (const match of matches) {
    const prec = match.precedent;

    // Court distribution
    courtDistribution[prec.court]++;

    // Outcome distribution
    if (prec.outcome) {
      const outcomeType = prec.outcome.type;
      outcomeDistribution[outcomeType] =
        (outcomeDistribution[outcomeType] || 0) + 1;
    }

    // Date range
    if (prec.decisionDate < minDate) minDate = prec.decisionDate;
    if (prec.decisionDate > maxDate) maxDate = prec.decisionDate;
  }

  return {
    totalPrecedentsAnalyzed: SAMPLE_PRECEDENTS.length,
    relevantPrecedentsFound: matches.length,
    dateRangeCovered: { start: minDate, end: maxDate },
    courtDistribution,
    outcomeDistribution,
  };
}

/**
 * Get court name in Turkish
 */
export function getCourtName(court: CourtType): string {
  const names: Record<CourtType, string> = {
    yargitay: "Yargıtay",
    danistay: "Danıştay",
    anayasa_mahkemesi: "Anayasa Mahkemesi",
    bolge_adliye: "Bölge Adliye Mahkemesi",
    bolge_idare: "Bölge İdare Mahkemesi",
    uyusmazlik_mahkemesi: "Uyuşmazlık Mahkemesi",
  };
  return names[court];
}

/**
 * Get legal area name in Turkish
 */
export function getLegalAreaName(area: LegalArea): string {
  const names: Record<LegalArea, string> = {
    ceza: "Ceza Hukuku",
    hukuk: "Medeni Hukuk",
    is: "İş Hukuku",
    ticaret: "Ticaret Hukuku",
    idare: "İdare Hukuku",
    vergi: "Vergi Hukuku",
    aile: "Aile Hukuku",
    icra_iflas: "İcra ve İflas Hukuku",
    tuketici: "Tüketici Hukuku",
    fikri_mulkiyet: "Fikri Mülkiyet Hukuku",
    insaat: "İnşaat Hukuku",
    saglik: "Sağlık Hukuku",
    cevre: "Çevre Hukuku",
    anayasa: "Anayasa Hukuku",
  };
  return names[area];
}

/**
 * Get Yargıtay chamber info
 */
export function getYargitayChamberInfo(
  chamberCode: string
): { name: string; specialization: string[] } | null {
  return YARGITAY_CHAMBERS[chamberCode] || null;
}

/**
 * Get all Yargıtay chambers
 */
export function getAllYargitayChambers(): Array<{
  code: string;
  name: string;
  specialization: string[];
}> {
  return Object.entries(YARGITAY_CHAMBERS).map(([code, info]) => ({
    code,
    ...info,
  }));
}

/**
 * Parse case citation
 */
export function parseCaseCitation(citation: string): CaseNumber | null {
  // Pattern: "Yargıtay 9. HD 2024/12345 E. 2024/6789 K."
  const yargitayPattern =
    /Yargıtay\s+(\d+\.?\s*(?:HD|CD|HGKD?|CGK))\s+(\d{4})\/(\d+)\s*E\.\s*(\d{4})\/(\d+)\s*K\./i;

  const match = citation.match(yargitayPattern);
  if (match) {
    return {
      year: parseInt(match[2], 10),
      esasNo: parseInt(match[3], 10),
      kararNo: parseInt(match[5], 10),
      fullCitation: citation,
    };
  }

  // Pattern: "AYM 2024/100 E. 2024/50 K."
  const aymPattern = /AYM\s+(\d{4})\/(\d+)\s*E\.\s*(\d{4})\/(\d+)\s*K\./i;
  const aymMatch = citation.match(aymPattern);
  if (aymMatch) {
    return {
      year: parseInt(aymMatch[1], 10),
      esasNo: parseInt(aymMatch[2], 10),
      kararNo: parseInt(aymMatch[4], 10),
      fullCitation: citation,
    };
  }

  return null;
}

/**
 * Format case citation
 */
export function formatCaseCitation(
  court: CourtType,
  chamber: string,
  year: number,
  esasNo: number,
  kararNo?: number
): string {
  const courtName = getCourtName(court);

  if (court === "yargitay") {
    return `${courtName} ${chamber} ${year}/${esasNo} E.${kararNo ? ` ${year}/${kararNo} K.` : ""}`;
  }

  if (court === "anayasa_mahkemesi") {
    return `AYM ${year}/${esasNo} E.${kararNo ? ` ${year}/${kararNo} K.` : ""}`;
  }

  return `${courtName} ${year}/${esasNo}${kararNo ? ` K.${kararNo}` : ""}`;
}

/**
 * Get precedent status name in Turkish
 */
export function getPrecedentStatusName(status: PrecedentStatus): string {
  const names: Record<PrecedentStatus, string> = {
    gecerli: "Geçerli",
    degistirildi: "Değiştirildi",
    sinirlandirildi: "Sınırlandırıldı",
    kaldirildi: "Kaldırıldı",
    yasayla_degisti: "Yasa ile Değişti",
  };
  return names[status];
}

/**
 * Format precedent analysis summary
 */
export function formatAnalysisSummary(result: PrecedentAnalysisResult): string {
  const lines: string[] = [];

  lines.push(`## İçtihat Analizi Raporu`);
  lines.push(``);
  lines.push(`**Sorgu:** ${result.query}`);
  lines.push(`**Analiz ID:** ${result.id}`);
  lines.push(``);

  lines.push(`### İstatistikler`);
  lines.push(
    `- Toplam taranan karar: ${result.statistics.totalPrecedentsAnalyzed}`
  );
  lines.push(
    `- İlgili karar sayısı: ${result.statistics.relevantPrecedentsFound}`
  );
  lines.push(``);

  if (result.relevantPrecedents.length > 0) {
    lines.push(`### Tespit Edilen Emsal Kararlar`);
    for (const match of result.relevantPrecedents.slice(0, 5)) {
      const prec = match.precedent;
      lines.push(
        `- **${prec.caseNumber.fullCitation}** (Alaka: %${Math.round(match.relevanceScore * 100)})`
      );
      lines.push(`  - ${prec.subject}`);
      lines.push(`  - Durum: ${getPrecedentStatusName(prec.status)}`);
    }
  }

  if (result.principlesExtracted.length > 0) {
    lines.push(``);
    lines.push(`### Çıkarılan İlkeler`);
    for (const principle of result.principlesExtracted.slice(0, 3)) {
      lines.push(`1. ${principle.principle}`);
      lines.push(
        `   - Kaynak: ${principle.sources.map((s) => s.caseNumber).join(", ")}`
      );
    }
  }

  if (result.recommendations.length > 0) {
    lines.push(``);
    lines.push(`### Öneriler`);
    for (const rec of result.recommendations) {
      const icon =
        rec.type === "emsal_kullan"
          ? "+"
          : rec.type === "dikkat"
            ? "!"
            : rec.type === "alternatif"
              ? "*"
              : "?";
      lines.push(`[${icon}] **${rec.title}**: ${rec.description}`);
    }
  }

  lines.push(``);
  lines.push(`*İşlem süresi: ${result.processingTimeMs}ms*`);

  return lines.join("\n");
}

/**
 * Compare two precedents
 */
export function comparePrecedents(
  prec1: Precedent,
  prec2: Precedent
): {
  similarities: string[];
  differences: string[];
  recommendation: string;
} {
  const similarities: string[] = [];
  const differences: string[] = [];

  // Compare courts
  if (prec1.court === prec2.court) {
    similarities.push(`Aynı yüksek mahkeme: ${getCourtName(prec1.court)}`);
  } else {
    differences.push(
      `Farklı mahkemeler: ${getCourtName(prec1.court)} vs ${getCourtName(prec2.court)}`
    );
  }

  // Compare legal areas
  if (prec1.legalArea === prec2.legalArea) {
    similarities.push(`Aynı hukuk alanı: ${getLegalAreaName(prec1.legalArea)}`);
  } else {
    differences.push(
      `Farklı hukuk alanları: ${getLegalAreaName(prec1.legalArea)} vs ${getLegalAreaName(prec2.legalArea)}`
    );
  }

  // Compare status
  if (prec1.status === prec2.status) {
    similarities.push(`Aynı geçerlilik durumu: ${getPrecedentStatusName(prec1.status)}`);
  } else {
    differences.push(
      `Farklı geçerlilik durumları: ${getPrecedentStatusName(prec1.status)} vs ${getPrecedentStatusName(prec2.status)}`
    );
  }

  // Compare keywords
  const commonKeywords = prec1.keywords.filter((k) =>
    prec2.keywords.includes(k)
  );
  if (commonKeywords.length > 0) {
    similarities.push(`Ortak anahtar kelimeler: ${commonKeywords.join(", ")}`);
  }

  // Generate recommendation
  let recommendation: string;
  if (similarities.length > differences.length) {
    recommendation =
      "Bu kararlar benzer niteliktedir ve birlikte kullanılabilir.";
  } else {
    recommendation =
      "Bu kararlar arasında önemli farklılıklar bulunmaktadır. Dikkatli değerlendirme gerekir.";
  }

  return { similarities, differences, recommendation };
}
