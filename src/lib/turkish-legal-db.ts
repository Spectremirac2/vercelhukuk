/**
 * Turkish Legal Database Integration
 * Provides unified access to Turkish legal databases and court systems
 *
 * Supported Sources:
 * - mevzuat.gov.tr (Official legislation)
 * - Yargıtay (Court of Cassation)
 * - Danıştay (Council of State)
 * - Anayasa Mahkemesi (Constitutional Court)
 * - Resmi Gazete (Official Gazette)
 */

export interface CourtCase {
  id: string;
  court: Court;
  chamber?: string;
  year: number;
  caseNumber: string;
  decisionNumber?: string;
  decisionDate?: string;
  subject?: string;
  summary?: string;
  fullText?: string;
  relatedLaws?: string[];
  keywords?: string[];
  outcome?: "kabul" | "ret" | "bozma" | "onama" | "kısmi" | "diğer";
  sourceUrl?: string;
}

export interface Legislation {
  id: string;
  type: LegislationType;
  number: string;
  name: string;
  officialGazetteDate?: string;
  officialGazetteNumber?: string;
  effectiveDate?: string;
  status: "yürürlükte" | "mülga" | "değişik";
  articles?: LegislationArticle[];
  sourceUrl?: string;
}

export interface LegislationArticle {
  number: string;
  title?: string;
  content: string;
  subArticles?: string[];
  amendments?: Amendment[];
}

export interface Amendment {
  date: string;
  law: string;
  description: string;
}

export type Court =
  | "yargitay"
  | "danistay"
  | "anayasa_mahkemesi"
  | "uyusmazlik_mahkemesi"
  | "sayistay"
  | "istinaf"
  | "yerel_mahkeme";

export type LegislationType =
  | "kanun"
  | "khk"
  | "cbk"
  | "tuzuk"
  | "yonetmelik"
  | "teblig"
  | "anayasa";

export interface SearchParams {
  query: string;
  court?: Court;
  chamber?: string;
  yearStart?: number;
  yearEnd?: number;
  caseType?: string;
  keywords?: string[];
  limit?: number;
  offset?: number;
}

export interface LegislationSearchParams {
  query: string;
  type?: LegislationType;
  number?: string;
  article?: string;
  status?: "yürürlükte" | "mülga" | "tümü";
  limit?: number;
}

export interface SearchResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  query: string;
  executionTimeMs: number;
}

// Court chamber configurations
export const YARGITAY_CHAMBERS = {
  hukuk: Array.from({ length: 23 }, (_, i) => ({
    id: `hukuk_${i + 1}`,
    name: `${i + 1}. Hukuk Dairesi`,
  })),
  ceza: Array.from({ length: 20 }, (_, i) => ({
    id: `ceza_${i + 1}`,
    name: `${i + 1}. Ceza Dairesi`,
  })),
  special: [
    { id: "hgk", name: "Hukuk Genel Kurulu" },
    { id: "cgk", name: "Ceza Genel Kurulu" },
    { id: "ibk", name: "İçtihadı Birleştirme Kurulu" },
  ],
};

export const DANISTAY_CHAMBERS = Array.from({ length: 17 }, (_, i) => ({
  id: `daire_${i + 1}`,
  name: `${i + 1}. Daire`,
})).concat([
  { id: "iddk", name: "İdari Dava Daireleri Kurulu" },
  { id: "vddk", name: "Vergi Dava Daireleri Kurulu" },
]);

// Major Turkish laws for quick reference
export const MAJOR_LAWS: Record<string, { name: string; shortName: string }> = {
  "2709": { name: "Türkiye Cumhuriyeti Anayasası", shortName: "Anayasa" },
  "4721": { name: "Türk Medeni Kanunu", shortName: "TMK" },
  "6098": { name: "Türk Borçlar Kanunu", shortName: "TBK" },
  "5237": { name: "Türk Ceza Kanunu", shortName: "TCK" },
  "5271": { name: "Ceza Muhakemesi Kanunu", shortName: "CMK" },
  "6100": { name: "Hukuk Muhakemeleri Kanunu", shortName: "HMK" },
  "6102": { name: "Türk Ticaret Kanunu", shortName: "TTK" },
  "4857": { name: "İş Kanunu", shortName: "İş K." },
  "6698": { name: "Kişisel Verilerin Korunması Kanunu", shortName: "KVKK" },
  "213": { name: "Vergi Usul Kanunu", shortName: "VUK" },
  "3065": { name: "Katma Değer Vergisi Kanunu", shortName: "KDVK" },
  "193": { name: "Gelir Vergisi Kanunu", shortName: "GVK" },
  "5520": { name: "Kurumlar Vergisi Kanunu", shortName: "KVK" },
  "2004": { name: "İcra ve İflas Kanunu", shortName: "İİK" },
  "2577": { name: "İdari Yargılama Usulü Kanunu", shortName: "İYUK" },
  "4734": { name: "Kamu İhale Kanunu", shortName: "KİK" },
  "5510": { name: "Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu", shortName: "SSGSS" },
};

/**
 * Turkish Legal Database Client
 * Unified interface for accessing Turkish legal sources
 */
export class TurkishLegalDBClient {
  private baseUrls = {
    mevzuat: "https://www.mevzuat.gov.tr",
    yargitay: "https://karararama.yargitay.gov.tr",
    danistay: "https://www.danistay.gov.tr",
    anayasa: "https://www.anayasa.gov.tr",
    resmiGazete: "https://www.resmigazete.gov.tr",
  };

  /**
   * Search court cases across all courts
   */
  async searchCases(params: SearchParams): Promise<SearchResult<CourtCase>> {
    const startTime = Date.now();

    // In production, this would make actual API calls
    // For now, we simulate the search with mock data
    const mockResults = this.generateMockCases(params);

    return {
      items: mockResults,
      totalCount: mockResults.length,
      page: Math.floor((params.offset || 0) / (params.limit || 10)) + 1,
      pageSize: params.limit || 10,
      query: params.query,
      executionTimeMs: Date.now() - startTime,
    };
  }

  /**
   * Search legislation
   */
  async searchLegislation(params: LegislationSearchParams): Promise<SearchResult<Legislation>> {
    const startTime = Date.now();

    const mockResults = this.generateMockLegislation(params);

    return {
      items: mockResults,
      totalCount: mockResults.length,
      page: 1,
      pageSize: params.limit || 10,
      query: params.query,
      executionTimeMs: Date.now() - startTime,
    };
  }

  /**
   * Get specific case by ID
   */
  async getCase(court: Court, caseId: string): Promise<CourtCase | null> {
    // In production, fetch from actual API
    return null;
  }

  /**
   * Get specific legislation by number
   */
  async getLegislation(type: LegislationType, number: string): Promise<Legislation | null> {
    // In production, fetch from mevzuat.gov.tr
    const lawInfo = MAJOR_LAWS[number];
    if (lawInfo) {
      return {
        id: `${type}_${number}`,
        type,
        number,
        name: lawInfo.name,
        status: "yürürlükte",
        sourceUrl: `${this.baseUrls.mevzuat}/mevzuat?MevzuatNo=${number}`,
      };
    }
    return null;
  }

  /**
   * Get legislation article
   */
  async getLegislationArticle(
    lawNumber: string,
    articleNumber: string
  ): Promise<LegislationArticle | null> {
    // In production, fetch from mevzuat.gov.tr
    return null;
  }

  /**
   * Build search query URL for external search
   */
  buildSearchUrl(court: Court, params: SearchParams): string {
    switch (court) {
      case "yargitay":
        return `${this.baseUrls.yargitay}/aramadetay?q=${encodeURIComponent(params.query)}`;
      case "danistay":
        return `${this.baseUrls.danistay}/karar-arama`;
      case "anayasa_mahkemesi":
        return `${this.baseUrls.anayasa}/kararlar`;
      default:
        return this.baseUrls.mevzuat;
    }
  }

  /**
   * Build legislation URL
   */
  buildLegislationUrl(number: string, article?: string): string {
    let url = `${this.baseUrls.mevzuat}/mevzuat?MevzuatNo=${number}`;
    if (article) {
      url += `&MevzuatTur=1&MaddeNo=${article}`;
    }
    return url;
  }

  // Mock data generators (for development/testing)
  private generateMockCases(params: SearchParams): CourtCase[] {
    const queryLower = params.query.toLowerCase();
    const cases: CourtCase[] = [];

    // Generate contextually relevant mock cases
    if (queryLower.includes("iş") || queryLower.includes("işçi") || queryLower.includes("fesih")) {
      cases.push({
        id: "yargitay_9hd_2024_1234",
        court: "yargitay",
        chamber: "9. Hukuk Dairesi",
        year: 2024,
        caseNumber: "2024/1234",
        decisionNumber: "2024/5678",
        decisionDate: "2024-03-15",
        subject: "İş sözleşmesinin feshi - Kıdem tazminatı",
        summary: "İşçinin haklı fesih nedeniyle kıdem tazminatına hak kazandığına ilişkin karar.",
        relatedLaws: ["4857 sayılı İş Kanunu", "6098 sayılı TBK"],
        keywords: ["kıdem tazminatı", "haklı fesih", "ihbar süresi"],
        outcome: "kabul",
      });
    }

    if (queryLower.includes("kvkk") || queryLower.includes("kişisel veri")) {
      cases.push({
        id: "danistay_10d_2024_789",
        court: "danistay",
        chamber: "10. Daire",
        year: 2024,
        caseNumber: "2024/789",
        decisionNumber: "2024/1011",
        decisionDate: "2024-06-20",
        subject: "KVKK ihlali - İdari para cezası",
        summary: "Kişisel verilerin hukuka aykırı işlenmesi nedeniyle verilen idari para cezasının iptali talebi.",
        relatedLaws: ["6698 sayılı KVKK"],
        keywords: ["kişisel veri", "açık rıza", "idari para cezası"],
        outcome: "ret",
      });
    }

    if (queryLower.includes("vergi") || queryLower.includes("kdv")) {
      cases.push({
        id: "danistay_4d_2024_456",
        court: "danistay",
        chamber: "4. Daire",
        year: 2024,
        caseNumber: "2024/456",
        decisionNumber: "2024/789",
        decisionDate: "2024-04-10",
        subject: "KDV iadesi - Sahte fatura kullanımı",
        summary: "Sahte fatura kullanımı iddiasıyla reddedilen KDV iadesi talebine ilişkin karar.",
        relatedLaws: ["3065 sayılı KDVK", "213 sayılı VUK"],
        keywords: ["kdv iadesi", "sahte fatura", "vergi cezası"],
        outcome: "kısmi",
      });
    }

    // Add a generic case if no specific matches
    if (cases.length === 0) {
      cases.push({
        id: "yargitay_hgk_2024_100",
        court: "yargitay",
        chamber: "Hukuk Genel Kurulu",
        year: 2024,
        caseNumber: "2024/100",
        decisionNumber: "2024/200",
        decisionDate: "2024-02-28",
        subject: params.query,
        summary: `${params.query} konusunda Yargıtay Hukuk Genel Kurulu kararı.`,
        keywords: params.keywords || [],
        outcome: "onama",
      });
    }

    return cases.slice(0, params.limit || 10);
  }

  private generateMockLegislation(params: LegislationSearchParams): Legislation[] {
    const results: Legislation[] = [];
    const queryLower = params.query.toLowerCase();

    // Check if query matches any major law
    for (const [number, info] of Object.entries(MAJOR_LAWS)) {
      if (
        info.name.toLowerCase().includes(queryLower) ||
        info.shortName.toLowerCase().includes(queryLower) ||
        number === params.number
      ) {
        results.push({
          id: `kanun_${number}`,
          type: "kanun",
          number,
          name: info.name,
          status: "yürürlükte",
          sourceUrl: this.buildLegislationUrl(number),
        });
      }
    }

    return results.slice(0, params.limit || 10);
  }
}

// Singleton instance
export const turkishLegalDB = new TurkishLegalDBClient();

/**
 * Helper function to format case citation
 */
export function formatCaseCitation(case_: CourtCase): string {
  const parts = [
    case_.court === "yargitay" ? "Yargıtay" : case_.court === "danistay" ? "Danıştay" : case_.court,
    case_.chamber,
    `E. ${case_.caseNumber}`,
    case_.decisionNumber ? `K. ${case_.decisionNumber}` : "",
    case_.decisionDate ? `T. ${case_.decisionDate}` : "",
  ].filter(Boolean);

  return parts.join(", ");
}

/**
 * Helper function to format legislation citation
 */
export function formatLegislationCitation(law: Legislation, article?: string): string {
  let citation = `${law.number} sayılı ${law.name}`;
  if (article) {
    citation += ` m. ${article}`;
  }
  return citation;
}

/**
 * Parse case number from text
 */
export function parseCaseNumber(text: string): {
  year?: number;
  number?: string;
  type?: "E" | "K";
} | null {
  const match = text.match(/(\d{4})\/(\d+)\s*([EK])\.?/i);
  if (match) {
    return {
      year: parseInt(match[1]),
      number: match[2],
      type: match[3].toUpperCase() as "E" | "K",
    };
  }
  return null;
}

/**
 * Parse law reference from text
 */
export function parseLawReference(text: string): {
  number?: string;
  name?: string;
  article?: string;
} | null {
  const lawMatch = text.match(/(\d{3,5})\s*sayılı\s*([^,.\n]+)/i);
  const articleMatch = text.match(/(?:madde|md?\.|m\.)\s*(\d+)/i);

  if (lawMatch) {
    return {
      number: lawMatch[1],
      name: lawMatch[2].trim(),
      article: articleMatch?.[1],
    };
  }
  return null;
}

/**
 * Get trusted legal source URLs
 */
export function getTrustedSourceUrls(): string[] {
  return [
    "mevzuat.gov.tr",
    "karararama.yargitay.gov.tr",
    "www.yargitay.gov.tr",
    "www.danistay.gov.tr",
    "www.anayasa.gov.tr",
    "www.resmigazete.gov.tr",
    "www.kazanci.com",
    "www.lexpera.com.tr",
    "www.mevbank.com",
    "www.kararara.com",
    "emsal.yargitay.gov.tr",
  ];
}
