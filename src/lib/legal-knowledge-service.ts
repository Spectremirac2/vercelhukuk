/**
 * Hukuk Bilgi Servisi (Genişletilmiş)
 * 
 * Tüm hukuk veritabanlarını (mevzuat, emsal kararlar, kavramlar, 
 * FAQ, hesaplayıcılar, güncel değişiklikler) birleştirir
 * ve AI sistemine kapsamlı hukuki bilgi sağlar.
 */

import {
  ALL_PRECEDENTS,
  getPrecedentsByCategory,
  searchPrecedents,
  getPrecedentsByCourt,
  getImportantPrecedents,
  getPrecedentsByLaw,
  PrecedentCase,
  LegalCategory as PrecedentCategory
} from "./data/precedent-database";

import {
  ALL_LAWS,
  getLawByIdOrShortName,
  getLawsByCategory,
  searchArticles,
  getArticleByReference,
  Law,
  LawArticle,
  LawCategory
} from "./data/turkish-law-database";

import {
  ALL_CONCEPTS,
  getConceptById,
  getConceptByTerm,
  getConceptsByCategory,
  searchConcepts,
  getRelatedConcepts,
  LegalConcept,
  ConceptCategory
} from "./data/legal-concepts-database";

// Yeni veritabanları
import {
  ALL_FAQ,
  searchFAQ,
  getFAQByCategory,
  getMostAskedFAQ,
  FAQItem,
  FAQCategory
} from "./data/faq-database";

import {
  SIRKET_TURLERI,
  TICARI_SOZLESMELER,
  KIYMETLI_EVRAKLAR,
  TACIR_YUKUMLULUKLERI,
  TICARET_FAQ,
  searchSirketTuru,
  searchTicariSozlesme
} from "./data/ticaret-hukuku-database";

import {
  VERGI_TURLERI,
  VERGI_CEZALARI,
  VERGI_TAKVIMI,
  VERGI_FAQ,
  searchVergiTuru,
  hesaplaGelirVergisi,
  hesaplaKDV,
  hesaplaDamgaVergisi
} from "./data/vergi-hukuku-database";

import {
  MAHKEME_TURLERI,
  YETKI_KURALLARI,
  TEMYIZ_ISTINAF,
  DAVA_SURECLERI,
  MAHKEME_FAQ,
  searchMahkemeTuru,
  findCompetentCourt
} from "./data/mahkeme-yetki-database";

import {
  LEGISLATION_UPDATES,
  getRecentUpdates,
  getCriticalUpdates,
  searchUpdates as searchLegislationUpdates,
  LegislationUpdate
} from "./data/legislation-updates";

// İcra İflas Veritabanı
import {
  ICRA_TAKIP_TURLERI,
  HACIZ_TURLERI,
  IFLAS_USULLERI,
  ICRA_HESAPLAMALARI,
  ICRA_FAQ,
  searchIcraTakipTuru,
  searchHacizTuru,
  getIcraFAQ
} from "./data/icra-iflas-database";

// ============================================
// TİPLER
// ============================================
export interface LegalSearchResult {
  type: "law" | "article" | "precedent" | "concept";
  relevanceScore: number;
  data: Law | { law: Law; article: LawArticle } | PrecedentCase | LegalConcept;
}

export interface LegalContext {
  relevantLaws: Law[];
  relevantArticles: Array<{ law: Law; article: LawArticle }>;
  relevantPrecedents: PrecedentCase[];
  relevantConcepts: LegalConcept[];
  summary: string;
}

export interface LegalQuery {
  query: string;
  category?: string;
  includeImportantPrecedents?: boolean;
  maxResults?: number;
}

// ============================================
// ANA SERVİS FONKSİYONLARI
// ============================================

/**
 * Kapsamlı hukuki arama yapar
 * Mevzuat, emsal kararlar ve kavramlar arasında arama yaparak sonuçları birleştirir
 */
export function comprehensiveLegalSearch(
  query: string,
  maxResults: number = 20
): LegalSearchResult[] {
  const results: LegalSearchResult[] = [];
  const queryLower = query.toLowerCase();
  
  // Kanunlarda ara
  for (const law of ALL_LAWS) {
    let score = 0;
    if (law.name.toLowerCase().includes(queryLower)) score += 3;
    if (law.shortName.toLowerCase().includes(queryLower)) score += 3;
    if (law.description.toLowerCase().includes(queryLower)) score += 1;
    
    if (score > 0) {
      results.push({
        type: "law",
        relevanceScore: score,
        data: law
      });
    }
  }
  
  // Maddelerde ara
  const articleResults = searchArticles(query);
  for (const { law, article } of articleResults) {
    let score = 2;
    if (article.title.toLowerCase().includes(queryLower)) score += 2;
    if (article.keywords.some(k => k.toLowerCase().includes(queryLower))) score += 1;
    
    results.push({
      type: "article",
      relevanceScore: score,
      data: { law, article }
    });
  }
  
  // Emsal kararlarda ara
  const precedentResults = searchPrecedents(query);
  for (const precedent of precedentResults) {
    let score = 2;
    if (precedent.importance === "yüksek") score += 1;
    if (precedent.subject.toLowerCase().includes(queryLower)) score += 2;
    
    results.push({
      type: "precedent",
      relevanceScore: score,
      data: precedent
    });
  }
  
  // Kavramlarda ara
  const conceptResults = searchConcepts(query);
  for (const concept of conceptResults) {
    let score = 2;
    if (concept.term.toLowerCase().includes(queryLower)) score += 3;
    
    results.push({
      type: "concept",
      relevanceScore: score,
      data: concept
    });
  }
  
  // Puana göre sırala ve limitle
  return results
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxResults);
}

/**
 * Bir soru için hukuki bağlam oluşturur
 * AI sisteminin cevap oluştururken kullanacağı referans bilgiler
 */
export function buildLegalContext(query: LegalQuery): LegalContext {
  const { 
    query: searchQuery, 
    category, 
    includeImportantPrecedents = true,
    maxResults = 10 
  } = query;
  
  const context: LegalContext = {
    relevantLaws: [],
    relevantArticles: [],
    relevantPrecedents: [],
    relevantConcepts: [],
    summary: ""
  };
  
  // Arama yap
  const searchResults = comprehensiveLegalSearch(searchQuery, maxResults * 2);
  
  // Sonuçları kategorize et
  for (const result of searchResults) {
    switch (result.type) {
      case "law":
        if (context.relevantLaws.length < maxResults) {
          context.relevantLaws.push(result.data as Law);
        }
        break;
      case "article":
        if (context.relevantArticles.length < maxResults) {
          context.relevantArticles.push(result.data as { law: Law; article: LawArticle });
        }
        break;
      case "precedent":
        if (context.relevantPrecedents.length < maxResults) {
          context.relevantPrecedents.push(result.data as PrecedentCase);
        }
        break;
      case "concept":
        if (context.relevantConcepts.length < maxResults) {
          context.relevantConcepts.push(result.data as LegalConcept);
        }
        break;
    }
  }
  
  // Önemli emsal kararları ekle (opsiyonel)
  if (includeImportantPrecedents && context.relevantPrecedents.length < maxResults) {
    const important = getImportantPrecedents();
    const filtered = important.filter(p =>
      !context.relevantPrecedents.some(existing => existing.id === p.id)
    );
    
    // Kategoriye göre filtrele
    if (category) {
      const categoryFiltered = filtered.filter(p => p.category === category);
      context.relevantPrecedents.push(...categoryFiltered.slice(0, 3));
    }
  }
  
  // Özet oluştur
  context.summary = generateContextSummary(context);
  
  return context;
}

/**
 * Bağlam özeti oluşturur
 */
function generateContextSummary(context: LegalContext): string {
  const parts: string[] = [];
  
  if (context.relevantLaws.length > 0) {
    parts.push(`İlgili ${context.relevantLaws.length} kanun bulundu: ${
      context.relevantLaws.map(l => l.shortName).join(", ")
    }`);
  }
  
  if (context.relevantArticles.length > 0) {
    parts.push(`${context.relevantArticles.length} ilgili kanun maddesi tespit edildi`);
  }
  
  if (context.relevantPrecedents.length > 0) {
    parts.push(`${context.relevantPrecedents.length} emsal karar bulundu`);
  }
  
  if (context.relevantConcepts.length > 0) {
    parts.push(`${context.relevantConcepts.length} hukuki kavram ile ilişkilendirildi`);
  }
  
  return parts.length > 0 
    ? parts.join(". ") + "."
    : "İlgili hukuki referans bulunamadı.";
}

/**
 * Belirli bir hukuk dalı için tam bilgi paketi oluşturur
 */
export function getLegalAreaInfo(category: PrecedentCategory): {
  laws: Law[];
  precedents: PrecedentCase[];
  concepts: LegalConcept[];
} {
  // Kategori eşleştirmeleri
  const lawCategoryMap: Record<string, LawCategory> = {
    "is_hukuku": "is_hukuku",
    "borclar_hukuku": "ozel_hukuk",
    "aile_hukuku": "ozel_hukuk",
    "miras_hukuku": "ozel_hukuk",
    "ceza_hukuku": "ceza_hukuku",
    "ticaret_hukuku": "ticaret_hukuku",
    "idare_hukuku": "idare_hukuku",
    "kvkk": "kamu_hukuku",
    "tuketici_hukuku": "ozel_hukuk"
  };
  
  const conceptCategoryMap: Record<string, ConceptCategory> = {
    "is_hukuku": "is_hukuku",
    "borclar_hukuku": "ozel_hukuk",
    "aile_hukuku": "aile_hukuku",
    "miras_hukuku": "miras_hukuku",
    "ceza_hukuku": "ceza_hukuku",
    "ticaret_hukuku": "ticaret_hukuku"
  };
  
  const lawCategory = lawCategoryMap[category];
  const conceptCategory = conceptCategoryMap[category];
  
  return {
    laws: lawCategory ? getLawsByCategory(lawCategory) : [],
    precedents: getPrecedentsByCategory(category),
    concepts: conceptCategory ? getConceptsByCategory(conceptCategory) : []
  };
}

/**
 * Kanun maddesi referansını çözümler ve detayları getirir
 * Örnek: "TBK m.49" -> { law: TBK, article: Madde 49 }
 */
export function resolveArticleReference(reference: string): { 
  law: Law; 
  article: LawArticle;
  relatedPrecedents: PrecedentCase[];
  relatedConcepts: LegalConcept[];
} | null {
  const articleResult = getArticleByReference(reference);
  if (!articleResult) return null;
  
  const { law, article } = articleResult;
  
  // İlgili emsal kararları bul
  const relatedPrecedents = getPrecedentsByLaw(reference).slice(0, 5);
  
  // İlgili kavramları bul
  const relatedConcepts = article.keywords
    .flatMap(keyword => searchConcepts(keyword))
    .filter((concept, index, self) => 
      index === self.findIndex(c => c.id === concept.id)
    )
    .slice(0, 5);
  
  return {
    law,
    article,
    relatedPrecedents,
    relatedConcepts
  };
}

/**
 * Hukuki bir kavramın tam açıklamasını getirir
 */
export function getConceptExplanation(termOrId: string): {
  concept: LegalConcept;
  relatedArticles: Array<{ law: Law; article: LawArticle }>;
  relatedPrecedents: PrecedentCase[];
  relatedConcepts: LegalConcept[];
} | null {
  const concept = getConceptById(termOrId) || getConceptByTerm(termOrId);
  if (!concept) return null;
  
  // İlgili maddeleri bul
  const relatedArticles = concept.legalBasis
    .map(ref => getArticleByReference(ref))
    .filter((result): result is { law: Law; article: LawArticle } => result !== null);
  
  // İlgili emsal kararları bul
  const relatedPrecedents = searchPrecedents(concept.term).slice(0, 5);
  
  // İlişkili kavramları bul
  const relatedConceptsList = getRelatedConcepts(concept.id).slice(0, 5);
  
  return {
    concept,
    relatedArticles,
    relatedPrecedents,
    relatedConcepts: relatedConceptsList
  };
}

/**
 * AI için prompt zenginleştirme - Hukuki bağlamı prompt'a ekler
 */
export function enrichPromptWithLegalContext(
  userQuery: string,
  detectedCategory?: string
): string {
  const context = buildLegalContext({
    query: userQuery,
    category: detectedCategory,
    includeImportantPrecedents: true,
    maxResults: 5
  });
  
  let enrichedContext = "";
  
  // Kavram tanımları
  if (context.relevantConcepts.length > 0) {
    enrichedContext += "\n### İlgili Hukuki Kavramlar:\n";
    for (const concept of context.relevantConcepts.slice(0, 3)) {
      enrichedContext += `- **${concept.term}**: ${concept.definition}\n`;
    }
  }
  
  // İlgili maddeler
  if (context.relevantArticles.length > 0) {
    enrichedContext += "\n### İlgili Kanun Maddeleri:\n";
    for (const { law, article } of context.relevantArticles.slice(0, 3)) {
      enrichedContext += `- **${law.shortName} m.${article.number} (${article.title})**: ${article.content.substring(0, 200)}...\n`;
    }
  }
  
  // Emsal kararlar
  if (context.relevantPrecedents.length > 0) {
    enrichedContext += "\n### İlgili Emsal Kararlar:\n";
    for (const precedent of context.relevantPrecedents.slice(0, 3)) {
      enrichedContext += `- **${precedent.court} ${precedent.decisionNumber}**: ${precedent.legalPrinciple.substring(0, 150)}...\n`;
    }
  }
  
  return enrichedContext;
}

/**
 * İstatistikler - Veritabanı içeriği hakkında bilgi (Genişletilmiş)
 */
export function getDatabaseStats(): {
  totalLaws: number;
  totalArticles: number;
  totalPrecedents: number;
  totalConcepts: number;
  totalFAQ: number;
  totalCompanyTypes: number;
  totalTaxTypes: number;
  totalCourtTypes: number;
  totalLegislationUpdates: number;
  totalIcraTakipTurleri: number;
  totalHacizTurleri: number;
  categories: string[];
} {
  const totalArticles = ALL_LAWS.reduce((acc, law) => acc + law.keyArticles.length, 0);
  
  return {
    totalLaws: ALL_LAWS.length,
    totalArticles,
    totalPrecedents: ALL_PRECEDENTS.length,
    totalConcepts: ALL_CONCEPTS.length,
    totalFAQ: ALL_FAQ.length + ICRA_FAQ.length + TICARET_FAQ.length + VERGI_FAQ.length + MAHKEME_FAQ.length,
    totalCompanyTypes: SIRKET_TURLERI.length,
    totalTaxTypes: VERGI_TURLERI.length,
    totalCourtTypes: MAHKEME_TURLERI.length,
    totalLegislationUpdates: LEGISLATION_UPDATES.length,
    totalIcraTakipTurleri: ICRA_TAKIP_TURLERI.length,
    totalHacizTurleri: HACIZ_TURLERI.length,
    categories: [
      "is_hukuku",
      "borclar_hukuku", 
      "aile_hukuku",
      "ceza_hukuku",
      "ticaret_hukuku",
      "kvkk",
      "tuketici_hukuku",
      "vergi_hukuku",
      "icra_iflas",
      "idare_hukuku"
    ]
  };
}

/**
 * FAQ Arama - Sık sorulan sorularda arama yapar
 */
export function searchFAQDatabase(query: string): FAQItem[] {
  return searchFAQ(query);
}

/**
 * Güncel Mevzuat Değişikliklerini Getir
 */
export function getLatestLegalUpdates(limit: number = 5): LegislationUpdate[] {
  return getRecentUpdates(limit);
}

/**
 * Kritik/Önemli Değişiklikleri Getir
 */
export function getCriticalLegalUpdates(): LegislationUpdate[] {
  return getCriticalUpdates();
}

/**
 * Şirket Türü Bilgisi Getir
 */
export function getCompanyTypeInfo(keyword: string) {
  return searchSirketTuru(keyword);
}

/**
 * Vergi Türü Bilgisi Getir
 */
export function getTaxTypeInfo(keyword: string) {
  return searchVergiTuru(keyword);
}

/**
 * Yetkili Mahkeme Bul
 */
export function findCompetentCourtForCase(caseType: string) {
  return findCompetentCourt(caseType);
}

/**
 * Mahkeme Bilgisi Getir
 */
export function getCourtInfo(keyword: string) {
  return searchMahkemeTuru(keyword);
}

/**
 * Genişletilmiş Prompt Zenginleştirme
 * Tüm veritabanlarından bilgi toplayarak AI promptunu zenginleştirir
 */
export function enrichPromptWithFullLegalContext(
  userQuery: string,
  detectedCategory?: string
): string {
  let enrichedContext = enrichPromptWithLegalContext(userQuery, detectedCategory);
  
  // FAQ'lardan ilgili soruları ekle
  const relevantFAQs = searchFAQ(userQuery).slice(0, 2);
  if (relevantFAQs.length > 0) {
    enrichedContext += "\n### İlgili Sık Sorulan Sorular:\n";
    for (const faq of relevantFAQs) {
      enrichedContext += `- **${faq.question}**: ${faq.shortAnswer}\n`;
    }
  }
  
  // Güncel değişiklikleri kontrol et
  const relevantUpdates = searchLegislationUpdates(userQuery).slice(0, 2);
  if (relevantUpdates.length > 0) {
    enrichedContext += "\n### Güncel Mevzuat Değişiklikleri:\n";
    for (const update of relevantUpdates) {
      enrichedContext += `- **${update.title}** (${update.effectiveDate}): ${update.summary}\n`;
    }
  }
  
  // Ticaret hukuku konularını kontrol et
  const queryLower = userQuery.toLowerCase();
  if (queryLower.includes('şirket') || queryLower.includes('limited') || queryLower.includes('anonim')) {
    const companyTypes = searchSirketTuru(userQuery);
    if (companyTypes.length > 0) {
      enrichedContext += "\n### Şirket Türü Bilgisi:\n";
      const company = companyTypes[0];
      enrichedContext += `- **${company.name}**: ${company.description}\n`;
      enrichedContext += `  - Asgari Sermaye: ${company.minCapital}\n`;
      enrichedContext += `  - Sorumluluk: ${company.liability}\n`;
    }
  }
  
  // Vergi konularını kontrol et
  if (queryLower.includes('vergi') || queryLower.includes('kdv') || queryLower.includes('gelir')) {
    const taxTypes = searchVergiTuru(userQuery);
    if (taxTypes.length > 0) {
      enrichedContext += "\n### Vergi Bilgisi:\n";
      const tax = taxTypes[0];
      enrichedContext += `- **${tax.name}**: ${tax.description}\n`;
      enrichedContext += `  - Beyanname Dönemi: ${tax.declarationPeriod}\n`;
    }
  }
  
  // Mahkeme/dava konularını kontrol et
  if (queryLower.includes('mahkeme') || queryLower.includes('dava') || queryLower.includes('yetki')) {
    const courts = searchMahkemeTuru(userQuery);
    if (courts.length > 0) {
      enrichedContext += "\n### Mahkeme Bilgisi:\n";
      const court = courts[0];
      enrichedContext += `- **${court.name}**: ${court.jurisdiction}\n`;
    }
  }
  
  // İcra/haciz konularını kontrol et
  if (queryLower.includes('icra') || queryLower.includes('haciz') || queryLower.includes('iflas') || queryLower.includes('takip') || queryLower.includes('borç')) {
    const takipTurleri = searchIcraTakipTuru(userQuery);
    if (takipTurleri.length > 0) {
      enrichedContext += "\n### İcra Takip Bilgisi:\n";
      const takip = takipTurleri[0];
      enrichedContext += `- **${takip.name}**: ${takip.description}\n`;
    }
    
    const hacizTurleri = searchHacizTuru(userQuery);
    if (hacizTurleri.length > 0) {
      enrichedContext += "\n### Haciz Bilgisi:\n";
      const haciz = hacizTurleri[0];
      enrichedContext += `- **${haciz.name}**: ${haciz.description}\n`;
      if (haciz.exemptions.length > 0) {
        enrichedContext += `  - Haczedilemez: ${haciz.exemptions.slice(0, 3).join(', ')}\n`;
      }
    }
    
    const icraFaq = getIcraFAQ(userQuery);
    if (icraFaq.length > 0) {
      enrichedContext += "\n### İlgili İcra SSS:\n";
      enrichedContext += `- **${icraFaq[0].question}**: ${icraFaq[0].answer.substring(0, 150)}...\n`;
    }
  }
  
  return enrichedContext;
}

/**
 * Kapsamlı Hukuki Bağlam (Tüm Kaynaklardan)
 */
export interface ExtendedLegalContext {
  relevantLaws: Law[];
  relevantArticles: Array<{ law: Law; article: LawArticle }>;
  relevantPrecedents: PrecedentCase[];
  relevantConcepts: LegalConcept[];
  relevantFAQs: FAQItem[];
  relevantUpdates: LegislationUpdate[];
  summary: string;
}

export function buildExtendedLegalContext(query: string): ExtendedLegalContext {
  const baseContext = buildLegalContext({ query, maxResults: 5 });
  
  return {
    ...baseContext,
    relevantFAQs: searchFAQ(query).slice(0, 3),
    relevantUpdates: searchLegislationUpdates(query).slice(0, 2),
    summary: generateExtendedSummary(baseContext, query)
  };
}

function generateExtendedSummary(context: LegalContext, query: string): string {
  const parts: string[] = [];
  
  if (context.relevantLaws.length > 0) {
    parts.push(`${context.relevantLaws.length} ilgili kanun`);
  }
  if (context.relevantArticles.length > 0) {
    parts.push(`${context.relevantArticles.length} kanun maddesi`);
  }
  if (context.relevantPrecedents.length > 0) {
    parts.push(`${context.relevantPrecedents.length} emsal karar`);
  }
  if (context.relevantConcepts.length > 0) {
    parts.push(`${context.relevantConcepts.length} hukuki kavram`);
  }
  
  const faqs = searchFAQ(query);
  if (faqs.length > 0) {
    parts.push(`${faqs.length} SSS`);
  }
  
  const updates = searchLegislationUpdates(query);
  if (updates.length > 0) {
    parts.push(`${updates.length} güncel değişiklik`);
  }
  
  return parts.length > 0 
    ? `Dahili bilgi tabanında bulunan ilgili içerik: ${parts.join(", ")}.`
    : "İlgili hukuki referans bulunamadı.";
}

// Re-export for convenience
export {
  ALL_LAWS,
  ALL_PRECEDENTS,
  ALL_CONCEPTS,
  ALL_FAQ,
  searchPrecedents,
  searchArticles,
  searchConcepts,
  searchFAQ,
  getLawByIdOrShortName,
  getPrecedentsByCategory,
  getConceptsByCategory,
  getImportantPrecedents,
  getMostAskedFAQ,
  getRecentUpdates,
  SIRKET_TURLERI,
  VERGI_TURLERI,
  MAHKEME_TURLERI,
  LEGISLATION_UPDATES,
  VERGI_TAKVIMI,
  YETKI_KURALLARI,
  hesaplaGelirVergisi,
  hesaplaKDV,
  hesaplaDamgaVergisi,
  // İcra İflas
  ICRA_TAKIP_TURLERI,
  HACIZ_TURLERI,
  IFLAS_USULLERI,
  ICRA_HESAPLAMALARI,
  ICRA_FAQ,
  searchIcraTakipTuru,
  searchHacizTuru,
  getIcraFAQ
};
