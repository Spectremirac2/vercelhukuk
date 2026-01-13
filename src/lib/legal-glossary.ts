/**
 * Legal Glossary System
 *
 * Comprehensive Turkish legal terminology database with:
 * - Term definitions
 * - Related terms
 * - Usage examples
 * - Legal citations
 * - Auto-explain feature for legal texts
 */

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: LegalCategory;
  synonyms: string[];
  relatedTerms: string[];
  usage: UsageExample[];
  legalBasis?: LegalBasis[];
  etymology?: string;
  englishEquivalent?: string;
  practicalNotes?: string;
}

export type LegalCategory =
  | "genel"           // Genel hukuk
  | "anayasa"         // Anayasa hukuku
  | "medeni"          // Medeni hukuk
  | "borclar"         // Borçlar hukuku
  | "ticaret"         // Ticaret hukuku
  | "ceza"            // Ceza hukuku
  | "is"              // İş hukuku
  | "idare"           // İdare hukuku
  | "usul"            // Usul hukuku
  | "icra_iflas"      // İcra iflas hukuku
  | "vergi"           // Vergi hukuku
  | "aile"            // Aile hukuku
  | "miras";          // Miras hukuku

export interface UsageExample {
  context: string;
  sentence: string;
  source?: string;
}

export interface LegalBasis {
  lawNumber: number;
  lawName: string;
  article?: number;
}

export interface ExplainedText {
  originalText: string;
  explanations: TermExplanation[];
  simplifiedText: string;
}

export interface TermExplanation {
  term: string;
  position: { start: number; end: number };
  definition: string;
  category: LegalCategory;
  relatedTerms: string[];
}

export interface GlossarySearchResult {
  term: GlossaryTerm;
  matchType: "exact" | "synonym" | "partial" | "related";
  score: number;
}

// Comprehensive legal glossary
const LEGAL_GLOSSARY: GlossaryTerm[] = [
  // Genel Hukuk Terimleri
  {
    term: "hukuki ehliyet",
    definition: "Bir kişinin hak ve borçlara sahip olabilme ve bunları kullanabilme yeteneği. Hak ehliyeti ve fiil ehliyeti olarak ikiye ayrılır.",
    category: "genel",
    synonyms: ["ehliyet", "hukuki yeterlilik"],
    relatedTerms: ["hak ehliyeti", "fiil ehliyeti", "temyiz kudreti"],
    usage: [
      {
        context: "Sözleşme hukuku",
        sentence: "Sözleşmenin geçerliliği için tarafların hukuki ehliyete sahip olması gerekir.",
      },
    ],
    legalBasis: [{ lawNumber: 4721, lawName: "Türk Medeni Kanunu", article: 8 }],
    englishEquivalent: "legal capacity",
  },
  {
    term: "hak ehliyeti",
    definition: "Bir kişinin hak sahibi olabilme ve borç altına girebilme ehliyeti. Her gerçek kişi doğumla birlikte hak ehliyetini kazanır.",
    category: "medeni",
    synonyms: ["pasif ehliyet"],
    relatedTerms: ["hukuki ehliyet", "fiil ehliyeti", "gerçek kişi"],
    usage: [
      {
        context: "Kişiler hukuku",
        sentence: "Cenin, sağ doğmak koşuluyla hak ehliyetine sahiptir.",
      },
    ],
    legalBasis: [{ lawNumber: 4721, lawName: "Türk Medeni Kanunu", article: 8 }],
    englishEquivalent: "capacity to have rights",
  },
  {
    term: "fiil ehliyeti",
    definition: "Bir kişinin kendi fiilleriyle hak edinebilme ve borç altına girebilme yeteneği. Ergin ve ayırt etme gücüne sahip olma şartına bağlıdır.",
    category: "medeni",
    synonyms: ["aktif ehliyet", "medeni hakları kullanma ehliyeti"],
    relatedTerms: ["hukuki ehliyet", "temyiz kudreti", "erginlik"],
    usage: [
      {
        context: "Sözleşmeler",
        sentence: "18 yaşını doldurmamış kişilerin fiil ehliyeti sınırlıdır.",
      },
    ],
    legalBasis: [{ lawNumber: 4721, lawName: "Türk Medeni Kanunu", article: 10 }],
    englishEquivalent: "capacity to act",
  },
  {
    term: "temyiz kudreti",
    definition: "Bir kişinin makul surette hareket edebilme yeteneği; akla uygun davranışta bulunabilme ve fiillerinin sonuçlarını öngörebilme kapasitesi.",
    category: "medeni",
    synonyms: ["ayırt etme gücü", "sezginlik"],
    relatedTerms: ["fiil ehliyeti", "akıl sağlığı"],
    usage: [
      {
        context: "Ceza hukuku",
        sentence: "Temyiz kudretinden yoksun kişilerin cezai sorumluluğu bulunmaz.",
      },
    ],
    legalBasis: [{ lawNumber: 4721, lawName: "Türk Medeni Kanunu", article: 13 }],
    englishEquivalent: "capacity for discernment",
  },

  // Borçlar Hukuku Terimleri
  {
    term: "sözleşme",
    definition: "İki veya daha fazla kişinin karşılıklı ve birbirine uygun irade beyanlarıyla meydana gelen hukuki işlem.",
    category: "borclar",
    synonyms: ["akit", "mukavele", "kontrat"],
    relatedTerms: ["icap", "kabul", "irade beyanı", "ehliyet"],
    usage: [
      {
        context: "Ticari ilişkiler",
        sentence: "Taraflar arasında geçerli bir sözleşme kurulmuştur.",
      },
    ],
    legalBasis: [{ lawNumber: 6098, lawName: "Türk Borçlar Kanunu", article: 1 }],
    englishEquivalent: "contract",
    practicalNotes: "Sözleşmenin geçerliliği için icap ve kabulün uyuşması, tarafların ehliyeti ve konunun hukuka uygunluğu gerekir.",
  },
  {
    term: "temerrüt",
    definition: "Borçlunun borcunu zamanında ifa etmemesi veya alacaklının ifayı kabul etmemesi durumu.",
    category: "borclar",
    synonyms: ["gecikme", "direnme"],
    relatedTerms: ["ifa", "borç", "tazminat", "faiz"],
    usage: [
      {
        context: "Alacak davası",
        sentence: "Borçlu temerrüde düşmüş olup gecikme faizi talep edilmektedir.",
      },
    ],
    legalBasis: [{ lawNumber: 6098, lawName: "Türk Borçlar Kanunu", article: 117 }],
    englishEquivalent: "default, delay",
  },
  {
    term: "kusur",
    definition: "Hukuka aykırı sonucu isteyerek veya gerekli özeni göstermeyerek meydana getirme durumu. Kast ve ihmal olarak ikiye ayrılır.",
    category: "borclar",
    synonyms: ["hata"],
    relatedTerms: ["kast", "ihmal", "tazminat", "sorumluluk"],
    usage: [
      {
        context: "Tazminat davası",
        sentence: "Davacının %30 oranında müterafik kusuru bulunmaktadır.",
      },
    ],
    legalBasis: [{ lawNumber: 6098, lawName: "Türk Borçlar Kanunu", article: 49 }],
    englishEquivalent: "fault, negligence",
  },
  {
    term: "haksız fiil",
    definition: "Hukuka aykırı bir eylemle başkasına zarar verme ve bu zararı tazmin etme yükümlülüğü doğuran fiil.",
    category: "borclar",
    synonyms: ["haksız eylem"],
    relatedTerms: ["kusur", "zarar", "tazminat", "illiyet bağı"],
    usage: [
      {
        context: "Tazminat hukuku",
        sentence: "Haksız fiil nedeniyle maddi ve manevi tazminat talep edilmektedir.",
      },
    ],
    legalBasis: [{ lawNumber: 6098, lawName: "Türk Borçlar Kanunu", article: 49 }],
    englishEquivalent: "tort",
  },
  {
    term: "zamanaşımı",
    definition: "Kanunda belirlenen süre içinde kullanılmayan hakların dava yoluyla talep edilememesi durumu.",
    category: "borclar",
    synonyms: ["müruruzaman"],
    relatedTerms: ["hak düşürücü süre", "dava hakkı"],
    usage: [
      {
        context: "Alacak davası",
        sentence: "Alacak 10 yıllık zamanaşımı süresine tabidir.",
      },
    ],
    legalBasis: [{ lawNumber: 6098, lawName: "Türk Borçlar Kanunu", article: 146 }],
    englishEquivalent: "statute of limitations",
    practicalNotes: "Zamanaşımı def'i olarak ileri sürülmelidir, hakim re'sen gözetemez.",
  },

  // İş Hukuku Terimleri
  {
    term: "kıdem tazminatı",
    definition: "İşçinin işverene bağlı olarak çalıştığı süre boyunca hak ettiği ve belirli koşullarla ödenen tazminat.",
    category: "is",
    synonyms: ["kıdem"],
    relatedTerms: ["ihbar tazminatı", "fesih", "iş sözleşmesi"],
    usage: [
      {
        context: "İş davası",
        sentence: "Davacı 5 yıllık çalışma süresine karşılık kıdem tazminatı talep etmektedir.",
      },
    ],
    legalBasis: [{ lawNumber: 1475, lawName: "İş Kanunu (mülga)", article: 14 }],
    englishEquivalent: "severance pay",
    practicalNotes: "Her tam yıl için 30 günlük brüt ücret tutarında hesaplanır.",
  },
  {
    term: "ihbar tazminatı",
    definition: "İş sözleşmesini fesheden tarafın karşı tarafa önceden haber vermemesi halinde ödenmesi gereken tazminat.",
    category: "is",
    synonyms: ["bildirim tazminatı"],
    relatedTerms: ["kıdem tazminatı", "fesih", "ihbar süresi"],
    usage: [
      {
        context: "İş davası",
        sentence: "Davacı işçiye ihbar süresi tanınmadan fesih yapılmıştır.",
      },
    ],
    legalBasis: [{ lawNumber: 4857, lawName: "İş Kanunu", article: 17 }],
    englishEquivalent: "notice pay",
  },
  {
    term: "işe iade",
    definition: "Geçersiz nedenle iş sözleşmesi feshedilen işçinin işine geri dönmesini sağlayan yargısal karar.",
    category: "is",
    synonyms: ["işe başlatma"],
    relatedTerms: ["iş güvencesi", "fesih", "geçersiz fesih"],
    usage: [
      {
        context: "İş güvencesi davası",
        sentence: "Mahkeme feshin geçersizliğine ve davacının işe iadesine karar vermiştir.",
      },
    ],
    legalBasis: [{ lawNumber: 4857, lawName: "İş Kanunu", article: 21 }],
    englishEquivalent: "reinstatement",
    practicalNotes: "Dava arabuluculuk şartına tabidir ve 1 ay içinde açılmalıdır.",
  },
  {
    term: "iş güvencesi",
    definition: "Belirsiz süreli iş sözleşmesiyle çalışan işçinin geçerli bir sebep olmadan işten çıkarılamaması güvencesi.",
    category: "is",
    synonyms: [],
    relatedTerms: ["işe iade", "geçerli fesih", "haklı fesih"],
    usage: [
      {
        context: "İş hukuku",
        sentence: "İşyerinde 30'dan fazla işçi çalıştığından iş güvencesi kapsamındadır.",
      },
    ],
    legalBasis: [{ lawNumber: 4857, lawName: "İş Kanunu", article: 18 }],
    englishEquivalent: "job security",
    practicalNotes: "En az 30 işçi çalışan işyerinde, 6 aylık kıdemi olan işçiler için geçerlidir.",
  },

  // Ceza Hukuku Terimleri
  {
    term: "suç",
    definition: "Kanunda tanımlanan, hukuka aykırı ve kusurlu insan davranışı.",
    category: "ceza",
    synonyms: ["cürüm"],
    relatedTerms: ["ceza", "fail", "mağdur", "kasıt", "taksir"],
    usage: [
      {
        context: "Ceza yargılaması",
        sentence: "Sanığın eylemi TCK m.86 kapsamında kasten yaralama suçunu oluşturmaktadır.",
      },
    ],
    legalBasis: [{ lawNumber: 5237, lawName: "Türk Ceza Kanunu", article: 2 }],
    englishEquivalent: "crime, offense",
  },
  {
    term: "kasıt",
    definition: "Suçun kanuni tanımındaki unsurların bilerek ve istenerek gerçekleştirilmesi.",
    category: "ceza",
    synonyms: ["kast"],
    relatedTerms: ["suç", "taksir", "bilinçli taksir"],
    usage: [
      {
        context: "Ceza davası",
        sentence: "Fail kasten adam öldürme suçunu işlemiştir.",
      },
    ],
    legalBasis: [{ lawNumber: 5237, lawName: "Türk Ceza Kanunu", article: 21 }],
    englishEquivalent: "intent, mens rea",
  },
  {
    term: "taksir",
    definition: "Dikkat ve özen yükümlülüğüne aykırılık dolayısıyla suçun öngörülmeden işlenmesi.",
    category: "ceza",
    synonyms: ["ihmal"],
    relatedTerms: ["kasıt", "bilinçli taksir", "kusur"],
    usage: [
      {
        context: "Ceza davası",
        sentence: "Trafik kazası taksirle adam öldürme suçunu oluşturmuştur.",
      },
    ],
    legalBasis: [{ lawNumber: 5237, lawName: "Türk Ceza Kanunu", article: 22 }],
    englishEquivalent: "negligence",
  },
  {
    term: "beraat",
    definition: "Sanığın suç işlemediğinin veya suçun unsurlarının oluşmadığının tespit edilmesi üzerine verilen karar.",
    category: "ceza",
    synonyms: ["aklanma"],
    relatedTerms: ["mahkumiyet", "düşme", "sanık"],
    usage: [
      {
        context: "Ceza yargılaması",
        sentence: "Delil yetersizliği nedeniyle sanığın beraatine karar verilmiştir.",
      },
    ],
    legalBasis: [{ lawNumber: 5271, lawName: "Ceza Muhakemesi Kanunu", article: 223 }],
    englishEquivalent: "acquittal",
  },

  // Aile Hukuku Terimleri
  {
    term: "nafaka",
    definition: "Bir kimsenin geçimini sağlamak üzere kanun gereği yapılması gereken parasal yardım.",
    category: "aile",
    synonyms: [],
    relatedTerms: ["tedbir nafakası", "iştirak nafakası", "yoksulluk nafakası"],
    usage: [
      {
        context: "Boşanma davası",
        sentence: "Davacı lehine aylık 5.000 TL yoksulluk nafakasına hükmedilmiştir.",
      },
    ],
    legalBasis: [{ lawNumber: 4721, lawName: "Türk Medeni Kanunu", article: 175 }],
    englishEquivalent: "alimony, maintenance",
  },
  {
    term: "velayet",
    definition: "Ana babanın çocukları üzerindeki bakım, eğitim ve temsil hakkı ve yükümlülüğü.",
    category: "aile",
    synonyms: [],
    relatedTerms: ["çocuk hakları", "kişisel ilişki", "vesayet"],
    usage: [
      {
        context: "Boşanma davası",
        sentence: "Müşterek çocuğun velayeti anneye verilmiştir.",
      },
    ],
    legalBasis: [{ lawNumber: 4721, lawName: "Türk Medeni Kanunu", article: 335 }],
    englishEquivalent: "custody, parental authority",
  },

  // İcra İflas Hukuku Terimleri
  {
    term: "haciz",
    definition: "Borçlunun borcuna yetecek miktardaki mal ve haklarına el konulması işlemi.",
    category: "icra_iflas",
    synonyms: [],
    relatedTerms: ["icra", "rehin", "iflas"],
    usage: [
      {
        context: "İcra takibi",
        sentence: "Borçlunun taşınmazına haciz konulmuştur.",
      },
    ],
    legalBasis: [{ lawNumber: 2004, lawName: "İcra ve İflas Kanunu", article: 78 }],
    englishEquivalent: "attachment, seizure",
  },
  {
    term: "iflas",
    definition: "Borçlarını ödeyemeyen tacirin tüm malvarlığının tasfiye edilerek alacaklılara dağıtılması.",
    category: "icra_iflas",
    synonyms: ["iflâs"],
    relatedTerms: ["konkordato", "haciz", "borç"],
    usage: [
      {
        context: "Ticaret hukuku",
        sentence: "Şirket hakkında iflas kararı verilmiştir.",
      },
    ],
    legalBasis: [{ lawNumber: 2004, lawName: "İcra ve İflas Kanunu", article: 154 }],
    englishEquivalent: "bankruptcy",
  },

  // Usul Hukuku Terimleri
  {
    term: "dava",
    definition: "Bir hakkın yerine getirilmesi veya korunması için mahkemeye başvurma.",
    category: "usul",
    synonyms: [],
    relatedTerms: ["davacı", "davalı", "dilekçe", "mahkeme"],
    usage: [
      {
        context: "Genel",
        sentence: "Davacı tarafından iş mahkemesinde dava açılmıştır.",
      },
    ],
    legalBasis: [{ lawNumber: 6100, lawName: "Hukuk Muhakemeleri Kanunu", article: 118 }],
    englishEquivalent: "lawsuit, legal action",
  },
  {
    term: "temyiz",
    definition: "İlk derece veya istinaf mahkemesi kararlarının hukuka uygunluğunun Yargıtay tarafından denetlenmesi.",
    category: "usul",
    synonyms: [],
    relatedTerms: ["istinaf", "karar düzeltme", "Yargıtay"],
    usage: [
      {
        context: "Yargılama",
        sentence: "Karar aleyhine temyiz yoluna başvurulmuştur.",
      },
    ],
    legalBasis: [{ lawNumber: 6100, lawName: "Hukuk Muhakemeleri Kanunu", article: 361 }],
    englishEquivalent: "appeal (to supreme court)",
  },
  {
    term: "istinaf",
    definition: "İlk derece mahkemesi kararlarının hem maddi hem hukuki yönden Bölge Adliye Mahkemesi tarafından incelenmesi.",
    category: "usul",
    synonyms: [],
    relatedTerms: ["temyiz", "Bölge Adliye Mahkemesi"],
    usage: [
      {
        context: "Yargılama",
        sentence: "Karar aleyhine istinaf başvurusunda bulunulmuştur.",
      },
    ],
    legalBasis: [{ lawNumber: 6100, lawName: "Hukuk Muhakemeleri Kanunu", article: 341 }],
    englishEquivalent: "appeal (to appellate court)",
  },
];

// Build search index
const TERM_INDEX: Map<string, GlossaryTerm> = new Map();
const SYNONYM_INDEX: Map<string, string> = new Map();

for (const term of LEGAL_GLOSSARY) {
  TERM_INDEX.set(term.term.toLowerCase(), term);
  for (const syn of term.synonyms) {
    SYNONYM_INDEX.set(syn.toLowerCase(), term.term.toLowerCase());
  }
}

/**
 * Get a term definition
 */
export function getTerm(term: string): GlossaryTerm | null {
  const normalizedTerm = term.toLowerCase().trim();

  // Direct match
  if (TERM_INDEX.has(normalizedTerm)) {
    return TERM_INDEX.get(normalizedTerm)!;
  }

  // Synonym match
  if (SYNONYM_INDEX.has(normalizedTerm)) {
    const mainTerm = SYNONYM_INDEX.get(normalizedTerm)!;
    return TERM_INDEX.get(mainTerm) || null;
  }

  return null;
}

/**
 * Search glossary
 */
export function searchGlossary(query: string, limit: number = 10): GlossarySearchResult[] {
  const normalizedQuery = query.toLowerCase().trim();
  const results: GlossarySearchResult[] = [];

  for (const term of LEGAL_GLOSSARY) {
    let matchType: GlossarySearchResult["matchType"] | null = null;
    let score = 0;

    // Exact match
    if (term.term.toLowerCase() === normalizedQuery) {
      matchType = "exact";
      score = 1.0;
    }
    // Synonym match
    else if (term.synonyms.some(s => s.toLowerCase() === normalizedQuery)) {
      matchType = "synonym";
      score = 0.95;
    }
    // Partial match in term
    else if (term.term.toLowerCase().includes(normalizedQuery)) {
      matchType = "partial";
      score = 0.7 + (normalizedQuery.length / term.term.length) * 0.2;
    }
    // Partial match in definition
    else if (term.definition.toLowerCase().includes(normalizedQuery)) {
      matchType = "partial";
      score = 0.5;
    }
    // Related term match
    else if (term.relatedTerms.some(r => r.toLowerCase().includes(normalizedQuery))) {
      matchType = "related";
      score = 0.4;
    }

    if (matchType) {
      results.push({ term, matchType, score });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get terms by category
 */
export function getTermsByCategory(category: LegalCategory): GlossaryTerm[] {
  return LEGAL_GLOSSARY.filter(t => t.category === category);
}

/**
 * Get all categories
 */
export function getCategories(): Array<{ category: LegalCategory; count: number; label: string }> {
  const categoryLabels: Record<LegalCategory, string> = {
    genel: "Genel Hukuk",
    anayasa: "Anayasa Hukuku",
    medeni: "Medeni Hukuk",
    borclar: "Borçlar Hukuku",
    ticaret: "Ticaret Hukuku",
    ceza: "Ceza Hukuku",
    is: "İş Hukuku",
    idare: "İdare Hukuku",
    usul: "Usul Hukuku",
    icra_iflas: "İcra İflas Hukuku",
    vergi: "Vergi Hukuku",
    aile: "Aile Hukuku",
    miras: "Miras Hukuku",
  };

  const counts: Map<LegalCategory, number> = new Map();

  for (const term of LEGAL_GLOSSARY) {
    counts.set(term.category, (counts.get(term.category) || 0) + 1);
  }

  return Object.entries(categoryLabels)
    .map(([category, label]) => ({
      category: category as LegalCategory,
      label,
      count: counts.get(category as LegalCategory) || 0,
    }))
    .filter(c => c.count > 0)
    .sort((a, b) => b.count - a.count);
}

/**
 * Explain legal terms in a text
 */
export function explainText(text: string): ExplainedText {
  const explanations: TermExplanation[] = [];
  const foundTerms = new Set<string>();
  let simplifiedText = text;

  // Sort terms by length (longest first) to avoid partial matches
  const sortedTerms = [...LEGAL_GLOSSARY].sort(
    (a, b) => b.term.length - a.term.length
  );

  for (const term of sortedTerms) {
    // Check for main term and synonyms
    const termsToCheck = [term.term, ...term.synonyms];

    for (const termText of termsToCheck) {
      const regex = new RegExp(`\\b${escapeRegex(termText)}\\b`, "gi");
      let match;

      while ((match = regex.exec(text)) !== null) {
        if (!foundTerms.has(match[0].toLowerCase())) {
          foundTerms.add(match[0].toLowerCase());

          explanations.push({
            term: match[0],
            position: { start: match.index, end: match.index + match[0].length },
            definition: term.definition,
            category: term.category,
            relatedTerms: term.relatedTerms,
          });

          // Add simple explanation in parentheses for simplified text
          if (term.practicalNotes) {
            simplifiedText = simplifiedText.replace(
              new RegExp(`\\b${escapeRegex(match[0])}\\b`, "i"),
              `${match[0]} (${term.definition.split(".")[0]})`
            );
          }
        }
      }
    }
  }

  // Sort explanations by position
  explanations.sort((a, b) => a.position.start - b.position.start);

  return {
    originalText: text,
    explanations,
    simplifiedText,
  };
}

/**
 * Escape special regex characters
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Get related terms
 */
export function getRelatedTerms(term: string): GlossaryTerm[] {
  const termDef = getTerm(term);
  if (!termDef) return [];

  const related: GlossaryTerm[] = [];

  for (const relatedTermName of termDef.relatedTerms) {
    const relatedDef = getTerm(relatedTermName);
    if (relatedDef) {
      related.push(relatedDef);
    }
  }

  return related;
}

/**
 * Get random term of the day
 */
export function getTermOfTheDay(): GlossaryTerm {
  // Use date-based selection for consistency within a day
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
    (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % LEGAL_GLOSSARY.length;
  return LEGAL_GLOSSARY[index];
}

/**
 * Get frequently confused terms
 */
export function getConfusedTermPairs(): Array<{
  term1: GlossaryTerm;
  term2: GlossaryTerm;
  difference: string;
}> {
  return [
    {
      term1: getTerm("hak ehliyeti")!,
      term2: getTerm("fiil ehliyeti")!,
      difference: "Hak ehliyeti doğumla kazanılır ve herkes için geçerlidir. Fiil ehliyeti ise erginlik ve ayırt etme gücü gerektirir.",
    },
    {
      term1: getTerm("kasıt")!,
      term2: getTerm("taksir")!,
      difference: "Kasıtta fail sonucu bilerek ve isteyerek gerçekleştirir. Taksirde ise sonuç öngörülmeden, dikkat ve özen eksikliğiyle meydana gelir.",
    },
    {
      term1: getTerm("kıdem tazminatı")!,
      term2: getTerm("ihbar tazminatı")!,
      difference: "Kıdem tazminatı çalışma süresine bağlı olarak ödenir. İhbar tazminatı ise bildirim sürelerine uyulmadığında ödenir.",
    },
    {
      term1: getTerm("temyiz")!,
      term2: getTerm("istinaf")!,
      difference: "İstinaf BAM'a yapılır ve hem maddi hem hukuki inceleme yapılır. Temyiz Yargıtay'a yapılır ve sadece hukuki inceleme yapılır.",
    },
  ].filter(pair => pair.term1 && pair.term2);
}

/**
 * Get glossary statistics
 */
export function getGlossaryStats(): {
  totalTerms: number;
  categoryCounts: Map<LegalCategory, number>;
  termsWithExamples: number;
  termsWithLegalBasis: number;
} {
  const categoryCounts = new Map<LegalCategory, number>();
  let termsWithExamples = 0;
  let termsWithLegalBasis = 0;

  for (const term of LEGAL_GLOSSARY) {
    categoryCounts.set(
      term.category,
      (categoryCounts.get(term.category) || 0) + 1
    );

    if (term.usage.length > 0) termsWithExamples++;
    if (term.legalBasis && term.legalBasis.length > 0) termsWithLegalBasis++;
  }

  return {
    totalTerms: LEGAL_GLOSSARY.length,
    categoryCounts,
    termsWithExamples,
    termsWithLegalBasis,
  };
}
