/**
 * Similar Case Finder System
 *
 * Uses semantic similarity and legal entity matching to find
 * relevant precedents and similar cases.
 *
 * Features:
 * - Text-based similarity search
 * - Legal entity matching (laws, courts, concepts)
 * - Outcome-based filtering
 * - Precedent chain analysis
 */

export interface CaseDocument {
  id: string;
  court: string;
  chamber?: string;
  caseNumber: string;
  year: number;
  date: string;
  caseType: string;
  legalArea: string;
  parties?: {
    plaintiff: string;
    defendant: string;
  };
  facts: string;
  legalIssues: string[];
  appliedLaws: AppliedLaw[];
  decision: string;
  outcome: CaseOutcome;
  precedentsCited: string[];
  keywords: string[];
}

export interface AppliedLaw {
  lawNumber: number;
  lawName: string;
  articles: number[];
}

export type CaseOutcome =
  | "kabul"
  | "kismi_kabul"
  | "red"
  | "bozma"
  | "onama"
  | "dusme"
  | "gonderme";

export interface SimilarCaseResult {
  case: CaseDocument;
  similarity: SimilarityScore;
  matchingFactors: MatchingFactor[];
  relevanceExplanation: string;
}

export interface SimilarityScore {
  overall: number;
  factSimilarity: number;
  legalIssueSimilarity: number;
  lawSimilarity: number;
  outcomeSimilarity: number;
}

export interface MatchingFactor {
  type: "law" | "concept" | "fact" | "issue" | "court" | "outcome";
  description: string;
  weight: number;
}

export interface CaseSearchQuery {
  text?: string;
  legalArea?: string;
  caseType?: string;
  laws?: number[];
  court?: string;
  yearRange?: { start: number; end: number };
  outcome?: CaseOutcome;
  keywords?: string[];
  limit?: number;
}

export interface PrecedentChain {
  rootCase: CaseDocument;
  precedents: Array<{
    case: CaseDocument;
    relationship: "cites" | "follows" | "distinguishes" | "overrules";
    depth: number;
  }>;
  followers: Array<{
    case: CaseDocument;
    relationship: "cites" | "follows" | "distinguishes" | "overrules";
  }>;
}

// Mock case database (in production, this would be a real database)
const CASE_DATABASE: CaseDocument[] = [
  {
    id: "yargitay_9hd_2023_4567",
    court: "Yargıtay",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "2023/4567 E., 2023/8901 K.",
    year: 2023,
    date: "2023-10-15",
    caseType: "işe iade",
    legalArea: "iş hukuku",
    facts: "Davacı işçi, 8 yıl süreyle davalı şirkette çalışmış, performans düşüklüğü gerekçesiyle iş sözleşmesi feshedilmiştir. Davacı, feshin geçersizliği iddiasıyla işe iade davası açmıştır.",
    legalIssues: ["geçerli fesih", "performans değerlendirmesi", "iş güvencesi"],
    appliedLaws: [
      { lawNumber: 4857, lawName: "İş Kanunu", articles: [18, 19, 20, 21] },
    ],
    decision: "Davanın kabulüne, feshin geçersizliğine ve davacının işe iadesine karar verilmiştir.",
    outcome: "kabul",
    precedentsCited: ["yargitay_9hd_2022_1234", "yargitay_22hd_2021_5678"],
    keywords: ["işe iade", "performans", "iş güvencesi", "geçersiz fesih"],
  },
  {
    id: "yargitay_9hd_2022_1234",
    court: "Yargıtay",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "2022/1234 E., 2022/5678 K.",
    year: 2022,
    date: "2022-06-20",
    caseType: "işe iade",
    legalArea: "iş hukuku",
    facts: "Davacı işçi, ekonomik nedenlerle iş sözleşmesi feshedildiğini iddia etmiş, ancak davalı işveren aynı pozisyona yeni işçi almıştır.",
    legalIssues: ["ekonomik nedenle fesih", "feshin son çare olması", "iş güvencesi"],
    appliedLaws: [
      { lawNumber: 4857, lawName: "İş Kanunu", articles: [18, 19, 20, 21] },
    ],
    decision: "Feshin geçersizliğine ve davacının işe iadesine karar verilmiştir.",
    outcome: "kabul",
    precedentsCited: [],
    keywords: ["işe iade", "ekonomik fesih", "son çare", "iş güvencesi"],
  },
  {
    id: "yargitay_4hd_2023_7890",
    court: "Yargıtay",
    chamber: "4. Hukuk Dairesi",
    caseNumber: "2023/7890 E., 2023/12345 K.",
    year: 2023,
    date: "2023-09-25",
    caseType: "tazminat",
    legalArea: "borçlar hukuku",
    facts: "Davacı, davalının kusurlu davranışı sonucu meydana gelen trafik kazasında yaralanmış ve maddi-manevi tazminat talep etmiştir.",
    legalIssues: ["haksız fiil", "kusur", "tazminat hesabı", "manevi tazminat"],
    appliedLaws: [
      { lawNumber: 6098, lawName: "Türk Borçlar Kanunu", articles: [49, 51, 56] },
    ],
    decision: "Davanın kısmen kabulü ile maddi tazminat talebinin kabulüne, manevi tazminatın indirimli kabulüne karar verilmiştir.",
    outcome: "kismi_kabul",
    precedentsCited: [],
    keywords: ["tazminat", "trafik kazası", "haksız fiil", "manevi tazminat"],
  },
  {
    id: "yargitay_2hd_2024_2345",
    court: "Yargıtay",
    chamber: "2. Hukuk Dairesi",
    caseNumber: "2024/2345 E., 2024/4567 K.",
    year: 2024,
    date: "2024-03-10",
    caseType: "boşanma",
    legalArea: "aile hukuku",
    facts: "Davacı kadın, davalı kocanın sürekli şiddet uyguladığını iddia ederek boşanma davası açmış, nafaka ve velayet talep etmiştir.",
    legalIssues: ["evlilik birliğinin temelinden sarsılması", "şiddet", "velayet", "nafaka"],
    appliedLaws: [
      { lawNumber: 4721, lawName: "Türk Medeni Kanunu", articles: [166, 175, 336] },
    ],
    decision: "Boşanmaya, velayetin davacı anneye verilmesine ve nafakaya hükmedilmiştir.",
    outcome: "kabul",
    precedentsCited: [],
    keywords: ["boşanma", "şiddet", "velayet", "nafaka", "kusur"],
  },
  {
    id: "yargitay_11hd_2023_5678",
    court: "Yargıtay",
    chamber: "11. Hukuk Dairesi",
    caseNumber: "2023/5678 E., 2023/9012 K.",
    year: 2023,
    date: "2023-08-05",
    caseType: "alacak",
    legalArea: "ticaret hukuku",
    facts: "Davacı şirket, davalı şirketten olan ticari alacağının ödenmediğini iddia ederek alacak davası açmıştır.",
    legalIssues: ["ticari alacak", "fatura", "ödeme", "zamanaşımı"],
    appliedLaws: [
      { lawNumber: 6102, lawName: "Türk Ticaret Kanunu", articles: [4, 21] },
      { lawNumber: 6098, lawName: "Türk Borçlar Kanunu", articles: [117, 146] },
    ],
    decision: "Davanın kabulüne ve alacağın tahsiline karar verilmiştir.",
    outcome: "kabul",
    precedentsCited: [],
    keywords: ["ticari alacak", "fatura", "ödeme", "temerrüt"],
  },
  {
    id: "danistay_5d_2023_3456",
    court: "Danıştay",
    chamber: "5. Daire",
    caseNumber: "2023/3456 E., 2023/7890 K.",
    year: 2023,
    date: "2023-11-20",
    caseType: "iptal",
    legalArea: "idare hukuku",
    facts: "Davacı memur, disiplin cezası olarak verilen kınama kararının iptali istemiyle dava açmıştır.",
    legalIssues: ["disiplin cezası", "savunma hakkı", "ölçülülük", "idari işlem"],
    appliedLaws: [
      { lawNumber: 657, lawName: "Devlet Memurları Kanunu", articles: [125, 130] },
    ],
    decision: "Savunma hakkının yeterince kullandırılmadığı gerekçesiyle işlemin iptaline karar verilmiştir.",
    outcome: "kabul",
    precedentsCited: [],
    keywords: ["disiplin", "memur", "savunma hakkı", "iptal"],
  },
  {
    id: "yargitay_ceza_2023_8901",
    court: "Yargıtay",
    chamber: "Ceza Genel Kurulu",
    caseNumber: "2023/8901 E., 2023/1234 K.",
    year: 2023,
    date: "2023-12-05",
    caseType: "ceza",
    legalArea: "ceza hukuku",
    facts: "Sanık, mağduru kasten yaralama suçundan yargılanmış, ilk derece mahkemesi mahkumiyet kararı vermiştir.",
    legalIssues: ["kasten yaralama", "meşru müdafaa", "ceza indirimi"],
    appliedLaws: [
      { lawNumber: 5237, lawName: "Türk Ceza Kanunu", articles: [86, 25, 29] },
    ],
    decision: "Meşru müdafaa koşullarının oluştuğu kabul edilerek beraat kararı verilmiştir.",
    outcome: "kabul",
    precedentsCited: [],
    keywords: ["kasten yaralama", "meşru müdafaa", "beraat", "ceza"],
  },
];

/**
 * Find similar cases based on search query
 */
export function findSimilarCases(
  query: CaseSearchQuery,
  referenceCase?: CaseDocument
): SimilarCaseResult[] {
  let candidates = [...CASE_DATABASE];

  // Apply filters
  if (query.legalArea) {
    candidates = candidates.filter(c =>
      c.legalArea.toLowerCase().includes(query.legalArea!.toLowerCase())
    );
  }

  if (query.caseType) {
    candidates = candidates.filter(c =>
      c.caseType.toLowerCase().includes(query.caseType!.toLowerCase())
    );
  }

  if (query.court) {
    candidates = candidates.filter(c =>
      c.court.toLowerCase().includes(query.court!.toLowerCase())
    );
  }

  if (query.yearRange) {
    candidates = candidates.filter(c =>
      c.year >= (query.yearRange!.start || 0) &&
      c.year <= (query.yearRange!.end || 9999)
    );
  }

  if (query.outcome) {
    candidates = candidates.filter(c => c.outcome === query.outcome);
  }

  if (query.laws && query.laws.length > 0) {
    candidates = candidates.filter(c =>
      c.appliedLaws.some(law => query.laws!.includes(law.lawNumber))
    );
  }

  // Calculate similarity for each candidate
  const results: SimilarCaseResult[] = candidates.map(caseDoc => {
    const similarity = calculateSimilarity(caseDoc, query, referenceCase);
    const matchingFactors = findMatchingFactors(caseDoc, query, referenceCase);
    const relevanceExplanation = generateRelevanceExplanation(caseDoc, matchingFactors);

    return {
      case: caseDoc,
      similarity,
      matchingFactors,
      relevanceExplanation,
    };
  });

  // Sort by overall similarity
  results.sort((a, b) => b.similarity.overall - a.similarity.overall);

  // Apply limit
  const limit = query.limit || 10;
  return results.slice(0, limit);
}

/**
 * Calculate similarity between a case and query/reference
 */
function calculateSimilarity(
  caseDoc: CaseDocument,
  query: CaseSearchQuery,
  referenceCase?: CaseDocument
): SimilarityScore {
  let factSimilarity = 0;
  let legalIssueSimilarity = 0;
  let lawSimilarity = 0;
  let outcomeSimilarity = 0;

  // Text-based fact similarity
  if (query.text) {
    factSimilarity = calculateTextSimilarity(caseDoc.facts, query.text);
  } else if (referenceCase) {
    factSimilarity = calculateTextSimilarity(caseDoc.facts, referenceCase.facts);
  }

  // Legal issue similarity
  if (query.keywords && query.keywords.length > 0) {
    const matchingIssues = caseDoc.legalIssues.filter(issue =>
      query.keywords!.some(kw => issue.toLowerCase().includes(kw.toLowerCase()))
    );
    legalIssueSimilarity = matchingIssues.length / caseDoc.legalIssues.length;
  } else if (referenceCase) {
    const commonIssues = caseDoc.legalIssues.filter(issue =>
      referenceCase.legalIssues.some(refIssue =>
        issue.toLowerCase() === refIssue.toLowerCase()
      )
    );
    legalIssueSimilarity = commonIssues.length /
      Math.max(caseDoc.legalIssues.length, referenceCase.legalIssues.length);
  }

  // Law similarity
  if (query.laws && query.laws.length > 0) {
    const matchingLaws = caseDoc.appliedLaws.filter(law =>
      query.laws!.includes(law.lawNumber)
    );
    lawSimilarity = matchingLaws.length / query.laws.length;
  } else if (referenceCase) {
    const caseLawNumbers = caseDoc.appliedLaws.map(l => l.lawNumber);
    const refLawNumbers = referenceCase.appliedLaws.map(l => l.lawNumber);
    const commonLaws = caseLawNumbers.filter(ln => refLawNumbers.includes(ln));
    lawSimilarity = commonLaws.length /
      Math.max(caseLawNumbers.length, refLawNumbers.length);
  }

  // Outcome similarity
  if (query.outcome) {
    outcomeSimilarity = caseDoc.outcome === query.outcome ? 1 : 0;
  } else if (referenceCase) {
    outcomeSimilarity = caseDoc.outcome === referenceCase.outcome ? 1 : 0.5;
  }

  // Calculate overall similarity (weighted average)
  const overall =
    factSimilarity * 0.35 +
    legalIssueSimilarity * 0.25 +
    lawSimilarity * 0.25 +
    outcomeSimilarity * 0.15;

  return {
    overall: Math.round(overall * 100) / 100,
    factSimilarity: Math.round(factSimilarity * 100) / 100,
    legalIssueSimilarity: Math.round(legalIssueSimilarity * 100) / 100,
    lawSimilarity: Math.round(lawSimilarity * 100) / 100,
    outcomeSimilarity: Math.round(outcomeSimilarity * 100) / 100,
  };
}

/**
 * Calculate text similarity using simple word overlap
 */
function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = new Set(
    text1.toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3)
  );
  const words2 = new Set(
    text2.toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3)
  );

  let intersection = 0;
  for (const word of words1) {
    if (words2.has(word)) {
      intersection++;
    }
  }

  const union = words1.size + words2.size - intersection;
  return union > 0 ? intersection / union : 0;
}

/**
 * Find matching factors between case and query
 */
function findMatchingFactors(
  caseDoc: CaseDocument,
  query: CaseSearchQuery,
  referenceCase?: CaseDocument
): MatchingFactor[] {
  const factors: MatchingFactor[] = [];

  // Law matches
  if (query.laws) {
    for (const law of caseDoc.appliedLaws) {
      if (query.laws.includes(law.lawNumber)) {
        factors.push({
          type: "law",
          description: `${law.lawNumber} sayılı ${law.lawName} uygulanmış`,
          weight: 0.3,
        });
      }
    }
  }

  // Court match
  if (query.court && caseDoc.court.toLowerCase().includes(query.court.toLowerCase())) {
    factors.push({
      type: "court",
      description: `${caseDoc.court} ${caseDoc.chamber || ""} kararı`,
      weight: 0.1,
    });
  }

  // Keyword/concept matches
  if (query.keywords) {
    for (const keyword of query.keywords) {
      if (
        caseDoc.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase())) ||
        caseDoc.facts.toLowerCase().includes(keyword.toLowerCase())
      ) {
        factors.push({
          type: "concept",
          description: `"${keyword}" kavramı içeriyor`,
          weight: 0.15,
        });
      }
    }
  }

  // Outcome match
  if (query.outcome && caseDoc.outcome === query.outcome) {
    factors.push({
      type: "outcome",
      description: `Aynı sonuç: ${getOutcomeLabel(query.outcome)}`,
      weight: 0.2,
    });
  }

  // Issue matches with reference case
  if (referenceCase) {
    const commonIssues = caseDoc.legalIssues.filter(issue =>
      referenceCase.legalIssues.includes(issue)
    );
    for (const issue of commonIssues) {
      factors.push({
        type: "issue",
        description: `Ortak hukuki sorun: ${issue}`,
        weight: 0.25,
      });
    }
  }

  return factors;
}

/**
 * Generate human-readable relevance explanation
 */
function generateRelevanceExplanation(
  caseDoc: CaseDocument,
  factors: MatchingFactor[]
): string {
  if (factors.length === 0) {
    return "Bu karar genel olarak benzer konuları içermektedir.";
  }

  const mainFactors = factors
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map(f => f.description);

  return `Bu karar benzerdir çünkü: ${mainFactors.join("; ")}.`;
}

/**
 * Get outcome label in Turkish
 */
function getOutcomeLabel(outcome: CaseOutcome): string {
  const labels: Record<CaseOutcome, string> = {
    kabul: "Kabul",
    kismi_kabul: "Kısmi Kabul",
    red: "Red",
    bozma: "Bozma",
    onama: "Onama",
    dusme: "Düşme",
    gonderme: "Gönderme",
  };
  return labels[outcome];
}

/**
 * Get case by ID
 */
export function getCaseById(caseId: string): CaseDocument | null {
  return CASE_DATABASE.find(c => c.id === caseId) || null;
}

/**
 * Build precedent chain for a case
 */
export function buildPrecedentChain(caseId: string): PrecedentChain | null {
  const rootCase = getCaseById(caseId);
  if (!rootCase) return null;

  const precedents: PrecedentChain["precedents"] = [];
  const followers: PrecedentChain["followers"] = [];

  // Find cited precedents
  for (const citedId of rootCase.precedentsCited) {
    const citedCase = getCaseById(citedId);
    if (citedCase) {
      precedents.push({
        case: citedCase,
        relationship: "cites",
        depth: 1,
      });

      // Get second level precedents
      for (const secondLevelId of citedCase.precedentsCited) {
        const secondLevelCase = getCaseById(secondLevelId);
        if (secondLevelCase) {
          precedents.push({
            case: secondLevelCase,
            relationship: "cites",
            depth: 2,
          });
        }
      }
    }
  }

  // Find cases that cite this case
  for (const potentialFollower of CASE_DATABASE) {
    if (potentialFollower.precedentsCited.includes(caseId)) {
      followers.push({
        case: potentialFollower,
        relationship: "cites",
      });
    }
  }

  return {
    rootCase,
    precedents,
    followers,
  };
}

/**
 * Search cases by text
 */
export function searchCasesByText(
  searchText: string,
  limit: number = 10
): SimilarCaseResult[] {
  return findSimilarCases({
    text: searchText,
    limit,
  });
}

/**
 * Get cases by legal area
 */
export function getCasesByLegalArea(legalArea: string): CaseDocument[] {
  return CASE_DATABASE.filter(c =>
    c.legalArea.toLowerCase().includes(legalArea.toLowerCase())
  );
}

/**
 * Get cases by court
 */
export function getCasesByCourt(court: string): CaseDocument[] {
  return CASE_DATABASE.filter(c =>
    c.court.toLowerCase().includes(court.toLowerCase())
  );
}

/**
 * Get recent cases
 */
export function getRecentCases(limit: number = 5): CaseDocument[] {
  return [...CASE_DATABASE]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

/**
 * Get case statistics
 */
export function getCaseStatistics(): {
  totalCases: number;
  byLegalArea: Map<string, number>;
  byCourt: Map<string, number>;
  byOutcome: Map<CaseOutcome, number>;
  byYear: Map<number, number>;
} {
  const byLegalArea = new Map<string, number>();
  const byCourt = new Map<string, number>();
  const byOutcome = new Map<CaseOutcome, number>();
  const byYear = new Map<number, number>();

  for (const caseDoc of CASE_DATABASE) {
    byLegalArea.set(caseDoc.legalArea, (byLegalArea.get(caseDoc.legalArea) || 0) + 1);
    byCourt.set(caseDoc.court, (byCourt.get(caseDoc.court) || 0) + 1);
    byOutcome.set(caseDoc.outcome, (byOutcome.get(caseDoc.outcome) || 0) + 1);
    byYear.set(caseDoc.year, (byYear.get(caseDoc.year) || 0) + 1);
  }

  return {
    totalCases: CASE_DATABASE.length,
    byLegalArea,
    byCourt,
    byOutcome,
    byYear,
  };
}

/**
 * Find cases applying specific law
 */
export function findCasesByLaw(lawNumber: number): CaseDocument[] {
  return CASE_DATABASE.filter(c =>
    c.appliedLaws.some(law => law.lawNumber === lawNumber)
  );
}

/**
 * Get landmark cases (most cited)
 */
export function getLandmarkCases(limit: number = 5): Array<{
  case: CaseDocument;
  citationCount: number;
}> {
  const citationCounts = new Map<string, number>();

  for (const caseDoc of CASE_DATABASE) {
    for (const citedId of caseDoc.precedentsCited) {
      citationCounts.set(citedId, (citationCounts.get(citedId) || 0) + 1);
    }
  }

  return Array.from(citationCounts.entries())
    .map(([id, count]) => ({
      case: getCaseById(id)!,
      citationCount: count,
    }))
    .filter(entry => entry.case !== null)
    .sort((a, b) => b.citationCount - a.citationCount)
    .slice(0, limit);
}
