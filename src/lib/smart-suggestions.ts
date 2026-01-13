/**
 * Akıllı Öneri Sistemi
 * 
 * Kullanıcının soru/bağlamına göre akıllı öneriler sunar
 * İlgili soruları, araçları ve kaynakları önerir
 */

import { ALL_FAQ, FAQItem, searchFAQ, getFAQByCategory, FAQCategory } from './data/faq-database';
import { TURK_KANUNLARI, searchTurkishLaw } from './data/turkish-law-database';
import { EMSAL_KARARLAR, searchPrecedents } from './data/precedent-database';
import { HUKUKI_KAVRAMLAR, searchConcepts } from './data/legal-concepts-database';

// ============================================
// TİPLER
// ============================================

export interface SmartSuggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  relevance: number; // 0-100
  action: SuggestionAction;
  metadata?: Record<string, unknown>;
}

export type SuggestionType = 
  | 'question'      // Önerilen soru
  | 'tool'          // Önerilen araç
  | 'article'       // İlgili kanun maddesi
  | 'precedent'     // İlgili emsal karar
  | 'concept'       // Hukuki kavram
  | 'calculator'    // Hesaplama aracı
  | 'template'      // Belge şablonu
  | 'deadline'      // Süre uyarısı
  | 'warning';      // Önemli uyarı

export interface SuggestionAction {
  type: 'ask' | 'navigate' | 'calculate' | 'open_tool' | 'show_info';
  payload: unknown;
}

export interface SuggestionContext {
  query: string;
  conversationHistory?: string[];
  currentTool?: string;
  userIntent?: UserIntent;
}

export type UserIntent = 
  | 'legal_question'
  | 'document_help'
  | 'calculation'
  | 'deadline_check'
  | 'case_research'
  | 'general_info'
  | 'unknown';

// ============================================
// ANAHTAR KELİME HARİTALARI
// ============================================

const INTENT_KEYWORDS: Record<UserIntent, string[]> = {
  legal_question: [
    'nasıl', 'nedir', 'hakkım', 'yapabilir miyim', 'gerekiyor', 'zorunlu mu',
    'şartları', 'koşulları', 'hangi', 'kim', 'nerede', 'ne zaman'
  ],
  document_help: [
    'dilekçe', 'sözleşme', 'belge', 'form', 'şablon', 'örnek', 'nasıl yazılır',
    'hazırlama', 'düzenleme', 'imza'
  ],
  calculation: [
    'hesapla', 'hesaplama', 'kaç', 'ne kadar', 'tutar', 'miktar', 'oran',
    'faiz', 'tazminat', 'maaş', 'kıdem', 'ihbar', 'nafaka', 'kira'
  ],
  deadline_check: [
    'süre', 'zaman aşımı', 'zamanaşımı', 'ne zamana kadar', 'son tarih',
    'kaç gün', 'kaç ay', 'itiraz süresi', 'başvuru süresi', 'dava süresi'
  ],
  case_research: [
    'emsal', 'yargıtay', 'danıştay', 'içtihat', 'karar', 'mahkeme',
    'dava', 'örnek karar', 'benzer dava'
  ],
  general_info: [
    'bilgi', 'açıkla', 'anlat', 'özetle', 'tanım', 'kavram', 'terim'
  ],
  unknown: []
};

const TOPIC_TOOLS: Record<string, string[]> = {
  'iş': ['kidem_hesaplama', 'ihbar_hesaplama', 'fazla_mesai', 'ise_iade'],
  'kira': ['kira_artis', 'tahliye_suresi', 'depozito'],
  'boşanma': ['nafaka_hesaplama', 'velayet', 'mal_paylasimi'],
  'miras': ['miras_payi', 'veraset_vergisi', 'vasiyetname'],
  'trafik': ['trafik_cezasi', 'tazminat_hesaplama', 'kusur_orani'],
  'icra': ['faiz_hesaplama', 'haciz_suresi', 'itiraz_suresi'],
  'vergi': ['gelir_vergisi', 'kdv_hesaplama', 'damga_vergisi'],
  'tüketici': ['cayma_hakki', 'ayipli_mal', 'tuketici_hakem']
};

const CALCULATION_TRIGGERS = [
  { keywords: ['kıdem', 'tazminat', 'çalıştım'], calculator: 'kidem_tazminati' },
  { keywords: ['ihbar', 'tazminat', 'süre'], calculator: 'ihbar_tazminati' },
  { keywords: ['fazla', 'mesai', 'saat'], calculator: 'fazla_mesai' },
  { keywords: ['kira', 'artış', 'zam'], calculator: 'kira_artisi' },
  { keywords: ['faiz', 'gecikme', 'temerrüt'], calculator: 'faiz_hesaplama' },
  { keywords: ['nafaka', 'hesapla'], calculator: 'nafaka' },
  { keywords: ['vergi', 'gelir', 'matrah'], calculator: 'gelir_vergisi' },
  { keywords: ['kdv', 'hesapla'], calculator: 'kdv' },
  { keywords: ['damga', 'vergisi'], calculator: 'damga_vergisi' },
  { keywords: ['miras', 'pay', 'hisse'], calculator: 'miras_payi' },
  { keywords: ['vade', 'süre', 'gün', 'hesapla'], calculator: 'sure_hesaplama' }
];

const DEADLINE_WARNINGS: Array<{
  keywords: string[];
  warning: string;
  deadline: string;
  legal_basis: string;
}> = [
  {
    keywords: ['icra', 'itiraz', 'ödeme emri'],
    warning: 'İcra takibine itiraz süresi çok kısadır!',
    deadline: '7 gün',
    legal_basis: 'İİK m.62'
  },
  {
    keywords: ['işe', 'iade', 'fesih'],
    warning: 'İşe iade için arabuluculuk başvuru süresi sınırlıdır!',
    deadline: '1 ay (arabuluculuk) + 2 hafta (dava)',
    legal_basis: '7036 sayılı Kanun m.3'
  },
  {
    keywords: ['idari', 'dava', 'iptal'],
    warning: 'İdari dava açma süresi sınırlıdır!',
    deadline: '60 gün',
    legal_basis: 'İYUK m.7'
  },
  {
    keywords: ['vergi', 'dava'],
    warning: 'Vergi mahkemesinde dava açma süresi!',
    deadline: '30 gün',
    legal_basis: 'İYUK m.7'
  },
  {
    keywords: ['cayma', 'iade', 'internet'],
    warning: 'Mesafeli satışlarda cayma hakkı süresi!',
    deadline: '14 gün',
    legal_basis: 'TKHK m.48'
  },
  {
    keywords: ['şikayet', 'suç'],
    warning: 'Şikayete bağlı suçlarda şikayet süresi!',
    deadline: '6 ay (öğrenmeden itibaren)',
    legal_basis: 'TCK m.73'
  },
  {
    keywords: ['istinaf', 'temyiz'],
    warning: 'Kanun yolu başvuru süreleri!',
    deadline: 'Hukukta: 2 hafta, Cezada: 7-15 gün',
    legal_basis: 'HMK m.361, CMK m.291'
  },
  {
    keywords: ['iş', 'alacak', 'zamanaşımı'],
    warning: 'İş alacaklarında zamanaşımı süresi!',
    deadline: '5 yıl',
    legal_basis: 'İş Kanunu m.32'
  }
];

// ============================================
// ANA FONKSİYONLAR
// ============================================

/**
 * Ana öneri fonksiyonu - kullanıcı girdisine göre akıllı öneriler üretir
 */
export function getSmartSuggestions(context: SuggestionContext): SmartSuggestion[] {
  const suggestions: SmartSuggestion[] = [];
  const { query } = context;
  const normalizedQuery = query.toLowerCase().trim();
  
  // 1. Kullanıcı niyetini belirle
  const intent = detectUserIntent(normalizedQuery);
  
  // 2. Süre uyarıları kontrol et (öncelikli)
  const deadlineWarnings = checkDeadlineWarnings(normalizedQuery);
  suggestions.push(...deadlineWarnings);
  
  // 3. Hesaplama önerileri
  if (intent === 'calculation' || hasCalculationKeywords(normalizedQuery)) {
    const calcSuggestions = getCalculationSuggestions(normalizedQuery);
    suggestions.push(...calcSuggestions);
  }
  
  // 4. İlgili FAQ önerileri
  const faqSuggestions = getFAQSuggestions(normalizedQuery);
  suggestions.push(...faqSuggestions.slice(0, 3));
  
  // 5. İlgili kavram önerileri
  const conceptSuggestions = getConceptSuggestions(normalizedQuery);
  suggestions.push(...conceptSuggestions.slice(0, 2));
  
  // 6. İlgili kanun maddesi önerileri
  const lawSuggestions = getLawSuggestions(normalizedQuery);
  suggestions.push(...lawSuggestions.slice(0, 2));
  
  // 7. Emsal karar önerileri
  if (intent === 'case_research') {
    const precedentSuggestions = getPrecedentSuggestions(normalizedQuery);
    suggestions.push(...precedentSuggestions.slice(0, 2));
  }
  
  // 8. Araç önerileri
  const toolSuggestions = getToolSuggestions(normalizedQuery);
  suggestions.push(...toolSuggestions.slice(0, 2));
  
  // Önerileri relevance'a göre sırala ve benzersiz yap
  return deduplicateAndSort(suggestions).slice(0, 8);
}

/**
 * Kullanıcı niyetini tespit et
 */
export function detectUserIntent(query: string): UserIntent {
  const normalizedQuery = query.toLowerCase();
  
  let bestMatch: UserIntent = 'unknown';
  let bestScore = 0;
  
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    const score = keywords.filter(kw => normalizedQuery.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = intent as UserIntent;
    }
  }
  
  return bestMatch;
}

/**
 * Sıradaki olası soruları öner
 */
export function getFollowUpQuestions(currentQuery: string, lastResponse?: string): string[] {
  const followUps: string[] = [];
  const query = currentQuery.toLowerCase();
  
  // Konu bazlı takip soruları
  if (query.includes('kıdem') || query.includes('tazminat')) {
    followUps.push(
      'İhbar tazminatı ne kadar?',
      'Kıdem tazminatı nasıl hesaplanır?',
      'Tazminat için dava açma süresi nedir?'
    );
  }
  
  if (query.includes('boşanma')) {
    followUps.push(
      'Nafaka miktarı nasıl belirlenir?',
      'Velayet kime verilir?',
      'Mal paylaşımı nasıl yapılır?'
    );
  }
  
  if (query.includes('kira')) {
    followUps.push(
      'Kira artış oranı ne kadar olabilir?',
      'Depozito ne zaman iade edilir?',
      'Ev sahibi beni çıkarabilir mi?'
    );
  }
  
  if (query.includes('icra') || query.includes('haciz')) {
    followUps.push(
      'Maaşımın ne kadarı haczedilebilir?',
      'Hangi mallar haczedilemez?',
      'İcra borcumu nasıl taksitlendirebilirim?'
    );
  }
  
  if (query.includes('iş') && (query.includes('çık') || query.includes('fesih'))) {
    followUps.push(
      'İşe iade davası açabilir miyim?',
      'Hangi haklarımı talep edebilirim?',
      'İşsizlik maaşı alabilir miyim?'
    );
  }
  
  // Genel takip soruları
  if (followUps.length === 0) {
    followUps.push(
      'Bu konuda dava açabilir miyim?',
      'Zamanaşımı süresi ne kadardır?',
      'Hangi mahkemede dava açmalıyım?'
    );
  }
  
  return followUps.slice(0, 3);
}

/**
 * Konuşma bağlamına göre araç öner
 */
export function suggestToolsForContext(query: string): Array<{ tool: string; relevance: number }> {
  const suggestions: Array<{ tool: string; relevance: number }> = [];
  const normalizedQuery = query.toLowerCase();
  
  for (const [topic, tools] of Object.entries(TOPIC_TOOLS)) {
    if (normalizedQuery.includes(topic)) {
      tools.forEach(tool => {
        suggestions.push({ tool, relevance: 80 });
      });
    }
  }
  
  return suggestions;
}

// ============================================
// YARDIMCI FONKSİYONLAR
// ============================================

function hasCalculationKeywords(query: string): boolean {
  const calcKeywords = ['hesapla', 'kaç', 'ne kadar', 'tutar', 'miktar'];
  return calcKeywords.some(kw => query.includes(kw));
}

function checkDeadlineWarnings(query: string): SmartSuggestion[] {
  const warnings: SmartSuggestion[] = [];
  
  for (const dw of DEADLINE_WARNINGS) {
    const matchCount = dw.keywords.filter(kw => query.includes(kw)).length;
    if (matchCount >= 2) {
      warnings.push({
        id: `deadline_${Date.now()}`,
        type: 'deadline',
        title: `⚠️ ${dw.warning}`,
        description: `Süre: ${dw.deadline} (${dw.legal_basis})`,
        relevance: 95,
        action: {
          type: 'show_info',
          payload: { warning: dw.warning, deadline: dw.deadline, basis: dw.legal_basis }
        }
      });
    }
  }
  
  return warnings;
}

function getCalculationSuggestions(query: string): SmartSuggestion[] {
  const suggestions: SmartSuggestion[] = [];
  
  for (const trigger of CALCULATION_TRIGGERS) {
    const matchCount = trigger.keywords.filter(kw => query.includes(kw)).length;
    if (matchCount >= 2) {
      suggestions.push({
        id: `calc_${trigger.calculator}`,
        type: 'calculator',
        title: `📊 ${getCalculatorName(trigger.calculator)} Hesapla`,
        description: 'Bu hesaplama aracını kullanmak ister misiniz?',
        relevance: 85,
        action: {
          type: 'calculate',
          payload: { calculator: trigger.calculator }
        }
      });
    }
  }
  
  return suggestions;
}

function getCalculatorName(calculatorId: string): string {
  const names: Record<string, string> = {
    'kidem_tazminati': 'Kıdem Tazminatı',
    'ihbar_tazminati': 'İhbar Tazminatı',
    'fazla_mesai': 'Fazla Mesai Ücreti',
    'kira_artisi': 'Kira Artış Oranı',
    'faiz_hesaplama': 'Faiz',
    'nafaka': 'Nafaka Tahmini',
    'gelir_vergisi': 'Gelir Vergisi',
    'kdv': 'KDV',
    'damga_vergisi': 'Damga Vergisi',
    'miras_payi': 'Miras Payı',
    'sure_hesaplama': 'Süre'
  };
  return names[calculatorId] || calculatorId;
}

function getFAQSuggestions(query: string): SmartSuggestion[] {
  const faqs = searchFAQ(query);
  
  return faqs.slice(0, 5).map((faq, index) => ({
    id: `faq_${faq.id}`,
    type: 'question' as const,
    title: faq.question,
    description: faq.shortAnswer,
    relevance: 80 - (index * 5),
    action: {
      type: 'ask' as const,
      payload: { question: faq.question, faqId: faq.id }
    }
  }));
}

function getConceptSuggestions(query: string): SmartSuggestion[] {
  const concepts = searchConcepts(query);
  
  return concepts.slice(0, 3).map((concept, index) => ({
    id: `concept_${concept.id}`,
    type: 'concept' as const,
    title: `📖 ${concept.term}`,
    description: concept.definition.substring(0, 100) + '...',
    relevance: 70 - (index * 5),
    action: {
      type: 'show_info' as const,
      payload: { conceptId: concept.id, term: concept.term }
    }
  }));
}

function getLawSuggestions(query: string): SmartSuggestion[] {
  const laws = searchTurkishLaw(query);
  const suggestions: SmartSuggestion[] = [];
  
  laws.slice(0, 2).forEach((law, index) => {
    // İlk kritik maddeyi öner
    if (law.criticalArticles && law.criticalArticles.length > 0) {
      const article = law.criticalArticles[0];
      suggestions.push({
        id: `law_${law.number}_${article.number}`,
        type: 'article',
        title: `📜 ${law.name} m.${article.number}`,
        description: article.content.substring(0, 100) + '...',
        relevance: 65 - (index * 5),
        action: {
          type: 'show_info',
          payload: { lawNumber: law.number, articleNumber: article.number }
        }
      });
    }
  });
  
  return suggestions;
}

function getPrecedentSuggestions(query: string): SmartSuggestion[] {
  const precedents = searchPrecedents(query);
  
  return precedents.slice(0, 3).map((prec, index) => ({
    id: `precedent_${prec.id}`,
    type: 'precedent' as const,
    title: `⚖️ ${prec.court} ${prec.chamber} ${prec.decisionNumber}`,
    description: prec.summary.substring(0, 100) + '...',
    relevance: 60 - (index * 5),
    action: {
      type: 'show_info' as const,
      payload: { precedentId: prec.id }
    }
  }));
}

function getToolSuggestions(query: string): SmartSuggestion[] {
  const suggestions: SmartSuggestion[] = [];
  const toolMatches = suggestToolsForContext(query);
  
  toolMatches.slice(0, 3).forEach((match, index) => {
    suggestions.push({
      id: `tool_${match.tool}`,
      type: 'tool',
      title: `🔧 ${formatToolName(match.tool)}`,
      description: 'Bu aracı kullanarak işleminizi hızlandırın',
      relevance: match.relevance - (index * 5),
      action: {
        type: 'open_tool',
        payload: { toolId: match.tool }
      }
    });
  });
  
  return suggestions;
}

function formatToolName(toolId: string): string {
  return toolId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function deduplicateAndSort(suggestions: SmartSuggestion[]): SmartSuggestion[] {
  const seen = new Set<string>();
  const unique = suggestions.filter(s => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
  
  return unique.sort((a, b) => b.relevance - a.relevance);
}

// ============================================
// HIZLI ERİŞİM SORULARI
// ============================================

export const QUICK_ACCESS_QUESTIONS = [
  {
    category: 'İş Hukuku',
    questions: [
      'Kıdem tazminatı nasıl hesaplanır?',
      'İşe iade davası açabilir miyim?',
      'Fazla mesai ücretim ne kadar?'
    ]
  },
  {
    category: 'Aile Hukuku',
    questions: [
      'Anlaşmalı boşanma şartları nelerdir?',
      'Velayet kime verilir?',
      'Nafaka ne kadar olabilir?'
    ]
  },
  {
    category: 'Kira Hukuku',
    questions: [
      'Kira artış oranı ne kadar olabilir?',
      'Ev sahibi beni çıkarabilir mi?',
      'Depozitom ne zaman iade edilir?'
    ]
  },
  {
    category: 'Tüketici Hakları',
    questions: [
      'Ayıplı mal için ne yapabilirim?',
      'İnternetten aldığımı iade edebilir miyim?',
      'Tüketici Hakem Heyetine nasıl başvurabilirim?'
    ]
  },
  {
    category: 'İcra Hukuku',
    questions: [
      'İcra takibine nasıl itiraz ederim?',
      'Maaşımın ne kadarı haczedilebilir?',
      'Hangi mallarım haczedilemez?'
    ]
  }
];

// ============================================
// BAĞLAMSAL YARDIM
// ============================================

export interface ContextualHelp {
  topic: string;
  tips: string[];
  warnings: string[];
  relatedTools: string[];
  suggestedQuestions: string[];
}

export function getContextualHelp(query: string): ContextualHelp | null {
  const normalizedQuery = query.toLowerCase();
  
  if (normalizedQuery.includes('kıdem') || normalizedQuery.includes('işten çık')) {
    return {
      topic: 'İşten Ayrılma ve Tazminatlar',
      tips: [
        '1 yıldan fazla çalıştıysanız kıdem tazminatı hakkınız olabilir',
        'İhbar süresine uyulup uyulmadığını kontrol edin',
        'SGK hizmet dökümünüzü alın'
      ],
      warnings: [
        'Haklı nedenle istifa ederseniz tazminat alamazsınız',
        'İşe iade için 1 ay içinde arabulucuya başvurmalısınız'
      ],
      relatedTools: ['kidem_hesaplama', 'ihbar_hesaplama'],
      suggestedQuestions: [
        'Kıdem tazminatımı nasıl hesaplarım?',
        'İşe iade davası açabilir miyim?',
        'İşsizlik maaşı alabilir miyim?'
      ]
    };
  }
  
  if (normalizedQuery.includes('boşanma') || normalizedQuery.includes('ayrılık')) {
    return {
      topic: 'Boşanma Süreci',
      tips: [
        'Anlaşmalı boşanma daha hızlı sonuçlanır',
        'Mal rejimi tasfiyesi ayrı bir dava gerektirebilir',
        'Çocuklar varsa velayet ve nafaka düzenlenir'
      ],
      warnings: [
        'Boşanma davası süresince ortak konutta kalabilirsiniz',
        'Mal kaçırma girişimleri cezai sonuç doğurabilir'
      ],
      relatedTools: ['nafaka_hesaplama', 'mal_paylasimi'],
      suggestedQuestions: [
        'Anlaşmalı boşanma şartları nelerdir?',
        'Velayet kime verilir?',
        'Nafaka ne kadar olur?'
      ]
    };
  }
  
  if (normalizedQuery.includes('icra') || normalizedQuery.includes('borç')) {
    return {
      topic: 'İcra Takibi ve Borçlar',
      tips: [
        'Ödeme emrine 7 gün içinde itiraz edebilirsiniz',
        'Borcunuzu taksitlendirmek mümkün olabilir',
        'Bazı mallar haczedilemez'
      ],
      warnings: [
        'İtiraz süresi çok kısadır, hemen harekete geçin',
        'Haksız itiraz icra inkar tazminatına yol açabilir'
      ],
      relatedTools: ['faiz_hesaplama', 'haciz_listesi'],
      suggestedQuestions: [
        'İcra takibine nasıl itiraz ederim?',
        'Maaşımın ne kadarı haczedilebilir?',
        'Borcumu nasıl taksitlendirebilirim?'
      ]
    };
  }
  
  return null;
}
