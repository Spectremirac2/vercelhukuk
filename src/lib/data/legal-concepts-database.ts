/**
 * Hukuk Kavramları Veritabanı
 * 
 * Temel hukuki kavramlar, tanımlar ve ilişkiler
 * AI sisteminin hukuki anlamlandırma kapasitesini artırır.
 */

export interface LegalConcept {
  id: string;
  term: string;
  definition: string;
  detailedExplanation: string;
  category: ConceptCategory;
  relatedTerms: string[];
  legalBasis: string[];
  examples?: string[];
  practicalApplication?: string;
  commonMisconceptions?: string[];
  synonyms?: string[];
  antonyms?: string[];
}

export type ConceptCategory =
  | "genel_hukuk"
  | "ozel_hukuk"
  | "kamu_hukuku"
  | "usul_hukuku"
  | "is_hukuku"
  | "ceza_hukuku"
  | "ticaret_hukuku"
  | "aile_hukuku"
  | "miras_hukuku"
  | "esya_hukuku";

// ============================================
// GENEL HUKUK KAVRAMLARI
// ============================================
const GENEL_HUKUK_KAVRAMLARI: LegalConcept[] = [
  {
    id: "hukuki_islem",
    term: "Hukuki İşlem",
    definition: "Hukuki sonuç doğurmaya yönelik irade beyanı",
    detailedExplanation: "Hukuki işlem, kişilerin hukuki sonuç doğurmak amacıyla iradelerini açıkladıkları işlemlerdir. Tek taraflı (vasiyetname), iki taraflı (sözleşme) veya çok taraflı (şirket kurma) olabilir.",
    category: "genel_hukuk",
    relatedTerms: ["irade beyanı", "sözleşme", "hukuki fiil"],
    legalBasis: ["TBK m.1-48"],
    examples: [
      "Satış sözleşmesi yapma",
      "Vasiyetname düzenleme",
      "Vekaletname verme"
    ],
    practicalApplication: "Geçerli bir hukuki işlem için ehliyet, irade, şekil ve konu unsurlarının mevcut olması gerekir."
  },
  {
    id: "irade_sakatligi",
    term: "İrade Sakatlığı",
    definition: "İrade beyanının hata, hile veya korkutma ile sakatlanması",
    detailedExplanation: "İrade sakatlıkları sözleşmenin iptalini gerektiren sebeplerdir. Esaslı hata, hile (aldatma) ve korkutma (tehdit) bu kapsamdadır. Yanılan taraf sözleşmeyi iptal edebilir.",
    category: "genel_hukuk",
    relatedTerms: ["hata", "hile", "ikrah", "iptal"],
    legalBasis: ["TBK m.30-39"],
    examples: [
      "Sahte tablo satılması (hile)",
      "Altın yerine pirinç satılması (esaslı hata)",
      "Tehdit altında imzalanan sözleşme (korkutma)"
    ],
    commonMisconceptions: [
      "Her hata iptal sebebi değildir, esaslı hata olmalıdır",
      "Saik (güdü) hatası kural olarak iptal sebebi değildir"
    ]
  },
  {
    id: "hak_dusuruc_sure",
    term: "Hak Düşürücü Süre",
    definition: "Sürenin geçmesiyle hakkın tamamen ortadan kalktığı süre",
    detailedExplanation: "Hak düşürücü süre geçtiğinde hak kendiliğinden düşer, hakim tarafından re'sen dikkate alınır. Zamanaşımından farklı olarak ileri sürülmesine gerek yoktur.",
    category: "genel_hukuk",
    relatedTerms: ["zamanaşımı", "süre", "hak kaybı"],
    legalBasis: ["Çeşitli kanunlarda özel düzenlemeler"],
    examples: [
      "İşe iade davası için arabuluculuk başvuru süresi (1 ay)",
      "İş kazası bildirimi süresi",
      "Miras taksimi davası açma süresi"
    ],
    commonMisconceptions: [
      "Hak düşürücü süre ile zamanaşımı aynı şey değildir",
      "Hak düşürücü sürede durma veya kesilme söz konusu olmaz"
    ]
  },
  {
    id: "zamanasimi",
    term: "Zamanaşımı",
    definition: "Belirli süre geçmesiyle alacağın dava edilebilirliğinin sona ermesi",
    detailedExplanation: "Zamanaşımı dolmasıyla hak sona ermez, sadece dava edilemez hale gelir. Borçlu zamanaşımı def'ini ileri sürmelidir, hakim re'sen dikkate almaz.",
    category: "genel_hukuk",
    relatedTerms: ["def'i", "süre", "borç"],
    legalBasis: ["TBK m.146-161"],
    examples: [
      "Genel zamanaşımı 10 yıldır",
      "Haksız fiilde 2 ve 10 yıllık süreler",
      "Kira alacakları 5 yıl"
    ],
    practicalApplication: "Zamanaşımı durabilir (askıya alınma) veya kesilebilir (yeniden başlama). Borçlunun ikrarı zamanaşımını keser."
  },
  {
    id: "iyiniyet",
    term: "İyi Niyet",
    definition: "Bir hakkın kazanılmasında gerekli özeni gösterme ve bilmemenin mazur görülebilir olması",
    detailedExplanation: "TMK m.3 uyarınca iyi niyet karine olarak kabul edilir. İyi niyetin yokluğunu ispat yükü karşı taraftadır. Araştırma yükümlülüğü ihlal edilirse iyi niyet iddia edilemez.",
    category: "genel_hukuk",
    relatedTerms: ["karine", "ispat", "hak kazanımı"],
    legalBasis: ["TMK m.3"],
    examples: [
      "Tapu siciline güvenerek taşınmaz satın alma",
      "Malik olmayandan araç satın alma",
      "Sahte vekaletnameye dayanarak işlem yapma"
    ],
    commonMisconceptions: [
      "İyi niyet 'iyi insan olmak' anlamına gelmez",
      "Ağır ihmal durumunda iyi niyet iddia edilemez"
    ]
  },
  {
    id: "durustukluk",
    term: "Dürüstlük Kuralı",
    definition: "Hakların kullanılması ve borçların yerine getirilmesinde dürüst davranma yükümlülüğü",
    detailedExplanation: "TMK m.2 uyarınca herkes haklarını kullanırken ve borçlarını yerine getirirken dürüstlük kurallarına uymalıdır. Hakkın kötüye kullanılması yasaktır.",
    category: "genel_hukuk",
    relatedTerms: ["hakkın kötüye kullanılması", "iyi niyet", "MK m.2"],
    legalBasis: ["TMK m.2"],
    examples: [
      "Borçluyu bilerek zor durumda bırakma",
      "Sözleşme serbestisini kötüye kullanma",
      "Şekle aykırılığı kendi lehine ileri sürme"
    ],
    practicalApplication: "Dürüstlük kuralı tüm özel hukuk ilişkilerinde uygulanır ve sözleşmelerin yorumunda kullanılır."
  }
];

// ============================================
// İŞ HUKUKU KAVRAMLARI
// ============================================
const IS_HUKUKU_KAVRAMLARI: LegalConcept[] = [
  {
    id: "is_sozlesmesi",
    term: "İş Sözleşmesi",
    definition: "İşçinin bağımlı olarak iş görmeyi, işverenin ücret ödemeyi üstlendiği sözleşme",
    detailedExplanation: "İş sözleşmesinin üç temel unsuru vardır: iş görme, ücret ve bağımlılık (işveren emir ve talimatlarına tabi olma). Yazılı şekle tabi değildir ancak ispat kolaylığı açısından önerilir.",
    category: "is_hukuku",
    relatedTerms: ["işçi", "işveren", "ücret", "bağımlılık"],
    legalBasis: ["4857 sayılı İş Kanunu m.8", "TBK m.393"],
    examples: [
      "Belirsiz süreli iş sözleşmesi",
      "Belirli süreli iş sözleşmesi",
      "Kısmi süreli (part-time) iş sözleşmesi"
    ],
    practicalApplication: "Belirli süreli sözleşme ardı ardına en fazla 3 kez yapılabilir, aksi halde belirsiz süreliye dönüşür."
  },
  {
    id: "kidem_tazminati",
    term: "Kıdem Tazminatı",
    definition: "İşçinin kıdemi karşılığında hak ettiği tazminat",
    detailedExplanation: "Her tam yıl için 30 günlük brüt ücret tutarında hesaplanır. Haklı nedenle fesih, emeklilik, askerlik, evlilik (kadın işçi) gibi hallerde ödenir. İşçinin kusurlu haklı fesih halinde (İK m.25/II) ödenmez.",
    category: "is_hukuku",
    relatedTerms: ["fesih", "ihbar", "tazminat", "işçi hakları"],
    legalBasis: ["1475 sayılı İş Kanunu m.14"],
    examples: [
      "5 yıl çalışan işçiye 5 aylık brüt ücret",
      "Emekli olan işçiye kıdem tazminatı",
      "İstifa eden işçiye genellikle ödenmez (istisnalar hariç)"
    ],
    commonMisconceptions: [
      "Her ayrılmada kıdem tazminatı hakkı doğmaz",
      "İstifa halinde bazı durumlarda (evlilik, askerlik) kıdem hakkı var"
    ]
  },
  {
    id: "ihbar_tazminati",
    term: "İhbar Tazminatı",
    definition: "Bildirim süresine uyulmadan yapılan fesihlerde ödenen tazminat",
    detailedExplanation: "Belirsiz süreli iş sözleşmelerinde fesih öncesi bildirim süresi vardır. Bu süreye uyulmadan fesih yapılırsa karşı tarafa ihbar tazminatı ödenir.",
    category: "is_hukuku",
    relatedTerms: ["fesih", "bildirim süresi", "iş sözleşmesi"],
    legalBasis: ["4857 sayılı İş Kanunu m.17"],
    examples: [
      "0-6 ay kıdem: 2 haftalık ücret",
      "6 ay-1.5 yıl: 4 haftalık",
      "1.5-3 yıl: 6 haftalık",
      "3 yıl+: 8 haftalık"
    ],
    practicalApplication: "İşveren ihbar süresinde işçiyi çalıştırabilir veya ihbar tazminatı ödeyerek derhal feshedebilir."
  },
  {
    id: "mobbing",
    term: "Mobbing (Psikolojik Taciz)",
    definition: "İşyerinde sistematik olarak uygulanan psikolojik baskı ve taciz",
    detailedExplanation: "Mobbing, işyerinde bir veya birden fazla kişi tarafından sistematik olarak, süreklilik arz eden şekilde uygulanan, mağduru işten soğutmayı ve psikolojik olarak yıpratmayı amaçlayan davranışlardır.",
    category: "is_hukuku",
    relatedTerms: ["taciz", "ayrımcılık", "haklı fesih", "tazminat"],
    legalBasis: ["TBK m.417", "4857 sayılı İş Kanunu m.5", "Anayasa m.17"],
    examples: [
      "Sürekli eleştiri ve küçümseme",
      "İşe yarayan görevlerden alıkoyma",
      "Sosyal izolasyon",
      "Aşırı iş yükü verme"
    ],
    practicalApplication: "Mobbing ispatında e-postalar, tanık beyanları, sağlık raporları kullanılabilir. Mobbinge maruz kalan işçi haklı nedenle fesih yapabilir."
  },
  {
    id: "fazla_calisma",
    term: "Fazla Çalışma",
    definition: "Haftalık 45 saati aşan çalışma süresi",
    detailedExplanation: "Haftalık normal çalışma süresi 45 saattir. Bu süreyi aşan her saat fazla çalışma sayılır. Fazla çalışma ücreti normal saat ücretinin %50 fazlasıyla ödenir.",
    category: "is_hukuku",
    relatedTerms: ["mesai", "ücret", "çalışma süresi"],
    legalBasis: ["4857 sayılı İş Kanunu m.41"],
    examples: [
      "Haftada 50 saat çalışma = 5 saat fazla mesai",
      "Günde 11 saat çalışma (üst sınır)",
      "Yılda en fazla 270 saat fazla çalışma"
    ],
    commonMisconceptions: [
      "Yönetici kadrosu fazla mesai talep edemez (üst düzey)",
      "Fazla çalışma için işçinin yazılı onayı gerekir"
    ]
  }
];

// ============================================
// CEZA HUKUKU KAVRAMLARI
// ============================================
const CEZA_HUKUKU_KAVRAMLARI: LegalConcept[] = [
  {
    id: "kast",
    term: "Kast",
    definition: "Suçun kanuni tanımındaki unsurların bilerek ve istenerek gerçekleştirilmesi",
    detailedExplanation: "Kast, ceza hukukunda kural olan kusur türüdür. Fail, yaptığı hareketin suç oluşturduğunu bilmeli (bilme) ve bu sonucu istemelidir (isteme). Olası kastta fail neticeyi öngörür ve kabullenir.",
    category: "ceza_hukuku",
    relatedTerms: ["kusur", "taksir", "olası kast", "bilinçli taksir"],
    legalBasis: ["TCK m.21"],
    examples: [
      "Öldürmek için silah ateşleme (doğrudan kast)",
      "Kalabalığa ateş açma (olası kast)",
      "Hırsızlık amacıyla eve girme"
    ],
    practicalApplication: "Olası kastta ceza 1/3'ten 1/2'ye kadar indirilir."
  },
  {
    id: "taksir",
    term: "Taksir",
    definition: "Dikkat ve özen yükümlülüğüne aykırılık dolayısıyla suçun öngörülmeyerek gerçekleştirilmesi",
    detailedExplanation: "Taksirli suçlar kanunda açıkça belirtilmişse cezalandırılır. Bilinçli taksirde fail neticeyi öngörür ama olmayacağını düşünür. Normal taksirde netice öngörülmez.",
    category: "ceza_hukuku",
    relatedTerms: ["ihmal", "bilinçli taksir", "dikkat", "özen"],
    legalBasis: ["TCK m.22"],
    examples: [
      "Kırmızı ışıkta geçip kaza yapma (bilinçli taksir)",
      "Dikkatsiz araç kullanma sonucu ölüm",
      "Doktor hatası (tıbbi malpraktis)"
    ],
    commonMisconceptions: [
      "Her kaza taksirli suç değildir",
      "Bilinçli taksir ile olası kast sıklıkla karıştırılır"
    ]
  },
  {
    id: "mesru_mudafaa",
    term: "Meşru Müdafaa",
    definition: "Haksız bir saldırıyı defetmek için zorunlu olan savunma",
    detailedExplanation: "Meşru müdafaa hukuka uygunluk sebebidir. Gerek kendisine gerek başkasına yönelmiş haksız bir saldırıyı defetmek için, savunma ile orantılı bir güç kullanılabilir.",
    category: "ceza_hukuku",
    relatedTerms: ["hukuka uygunluk", "zorunluluk hali", "orantılılık"],
    legalBasis: ["TCK m.25"],
    examples: [
      "Eve giren hırsıza karşı savunma",
      "Saldırgan kişiye karşı fiziksel müdahale",
      "Bir başkasını korumak için müdahale"
    ],
    commonMisconceptions: [
      "Meşru müdafaada orantılılık şarttır",
      "Saldırı sona erdikten sonra yapılan hareket meşru müdafaa değildir"
    ]
  },
  {
    id: "suc_tesebbusü",
    term: "Suça Teşebbüs",
    definition: "Suçun icrasına başlayıp elinde olmayan nedenlerle tamamlayamama",
    detailedExplanation: "Teşebbüste ceza indirilir. Gönüllü vazgeçme halinde ise faile yalnızca tamamlanan kısım için ceza verilir.",
    category: "ceza_hukuku",
    relatedTerms: ["icra hareketleri", "gönüllü vazgeçme", "ceza indirimi"],
    legalBasis: ["TCK m.35-36"],
    examples: [
      "Silahı doğrultup ateş edememek (teşebbüs)",
      "Hırsızlık yaparken yakalanma",
      "Cinayet girişiminden vazgeçme (gönüllü vazgeçme)"
    ],
    practicalApplication: "Teşebbüste ceza, meydana gelen zarar veya tehlikenin ağırlığına göre belirlenir."
  }
];

// ============================================
// BORÇLAR HUKUKU KAVRAMLARI
// ============================================
const BORCLAR_HUKUKU_KAVRAMLARI: LegalConcept[] = [
  {
    id: "sozlesme",
    term: "Sözleşme",
    definition: "Tarafların karşılıklı ve birbirine uygun irade beyanlarıyla kurdukları hukuki işlem",
    detailedExplanation: "Sözleşme, en az iki tarafın karşılıklı ve birbirine uygun irade beyanlarıyla meydana gelir. Öneri ve kabul iradelerinin örtüşmesi gerekir.",
    category: "ozel_hukuk",
    relatedTerms: ["irade", "öneri", "kabul", "hukuki işlem"],
    legalBasis: ["TBK m.1-48"],
    examples: [
      "Satış sözleşmesi",
      "Kira sözleşmesi",
      "İş sözleşmesi",
      "Bağışlama sözleşmesi"
    ],
    practicalApplication: "Yazılı şekil şartı olmayan sözleşmeler sözlü olarak da kurulabilir ancak ispat zorluğu yaşanabilir."
  },
  {
    id: "borcun_ifasi",
    term: "Borcun İfası",
    definition: "Borcun sözleşmeye uygun şekilde yerine getirilmesi",
    detailedExplanation: "İfa, borcun sona erme sebeplerinden en önemlisidir. Tam ve gereği gibi yapılmalıdır. Kısmi ifa kural olarak alacaklıyı bağlamaz.",
    category: "ozel_hukuk",
    relatedTerms: ["ödeme", "temerrüt", "ifa yeri", "ifa zamanı"],
    legalBasis: ["TBK m.83-111"],
    examples: [
      "Satış bedelinin ödenmesi",
      "Kiralanan şeyin teslimi",
      "Hizmetin yerine getirilmesi"
    ],
    practicalApplication: "Para borçları alacaklının ikametgahında, diğer borçlar borçlunun ikametgahında ifa edilir."
  },
  {
    id: "haksiz_fiil",
    term: "Haksız Fiil",
    definition: "Kusurlu ve hukuka aykırı bir fiille başkasına zarar verme",
    detailedExplanation: "Haksız fiilin beş unsuru: fiil, hukuka aykırılık, kusur, zarar ve illiyet bağı. Tüm unsurlar gerçekleşirse tazminat yükümlülüğü doğar.",
    category: "ozel_hukuk",
    relatedTerms: ["tazminat", "kusur", "zarar", "illiyet bağı"],
    legalBasis: ["TBK m.49-76"],
    examples: [
      "Trafik kazası",
      "Hakaret (manevi zarar)",
      "Mala zarar verme",
      "Kişilik hakkı ihlali"
    ],
    commonMisconceptions: [
      "Kusursuz sorumluluk halleri de vardır (tehlike sorumluluğu)",
      "Manevi zarar da tazmin edilebilir"
    ]
  },
  {
    id: "sebepsiz_zenginlesme",
    term: "Sebepsiz Zenginleşme",
    definition: "Haklı bir neden olmaksızın başkasının malvarlığından zenginleşme",
    detailedExplanation: "Bir kişi başkasının malvarlığından veya emeğinden haklı bir sebep olmaksızın zenginleşmişse, bunun iadesini borçlanır.",
    category: "ozel_hukuk",
    relatedTerms: ["iade", "zenginleşme", "malvarlığı"],
    legalBasis: ["TBK m.77-82"],
    examples: [
      "Yanlışlıkla başkasının hesabına para gönderme",
      "Geçersiz sözleşmeye dayanarak alınan edim",
      "Borcu ödediğini bilmeden tekrar ödeme"
    ],
    practicalApplication: "İade yükümlülüğü zenginleşmenin miktarı kadardır. İyiniyetli zenginleşen, elinden çıkan kısmı iade etmek zorunda değildir."
  }
];

// ============================================
// AİLE HUKUKU KAVRAMLARI
// ============================================
const AILE_HUKUKU_KAVRAMLARI: LegalConcept[] = [
  {
    id: "evlilik",
    term: "Evlilik",
    definition: "Kadın ve erkeğin sürekli birlikte yaşamak amacıyla kurduğu aile birliği",
    detailedExplanation: "Evlilik, nikah akdi ile kurulur. Yasal evlilik yaşı 18'dir. Hakim izniyle 17 yaşında evlenilebilir.",
    category: "aile_hukuku",
    relatedTerms: ["nikah", "nişanlanma", "boşanma", "aile"],
    legalBasis: ["TMK m.124-184"],
    examples: [
      "Resmi nikah",
      "Dini nikah (tek başına geçersiz)",
      "Yabancı ülkede yapılan evlilik"
    ]
  },
  {
    id: "bosanma",
    term: "Boşanma",
    definition: "Evlilik birliğinin mahkeme kararıyla sona ermesi",
    detailedExplanation: "Boşanma, özel (zina, hayata kast vb.) veya genel (şiddetli geçimsizlik) sebeplere dayanabilir. Anlaşmalı boşanma da mümkündür (1 yıllık evlilik şartı).",
    category: "aile_hukuku",
    relatedTerms: ["nafaka", "velayet", "tazminat", "mal paylaşımı"],
    legalBasis: ["TMK m.161-184"],
    examples: [
      "Şiddetli geçimsizlik nedeniyle boşanma",
      "Anlaşmalı boşanma",
      "Zina nedeniyle boşanma"
    ],
    practicalApplication: "Boşanma davasıyla birlikte velayet, nafaka, tazminat ve mal paylaşımı da talep edilebilir."
  },
  {
    id: "nafaka",
    term: "Nafaka",
    definition: "Aile hukuku kapsamında bakım ve geçim yükümlülüğü karşılığı ödenen para",
    detailedExplanation: "Tedbir nafakası (dava süresince), iştirak nafakası (çocuk için), yoksulluk nafakası (boşanma sonrası) ve yardım nafakası (akrabalar arası) türleri vardır.",
    category: "aile_hukuku",
    relatedTerms: ["boşanma", "velayet", "çocuk", "bakım"],
    legalBasis: ["TMK m.169, 175, 176, 182, 328, 364"],
    examples: [
      "Boşanma sonrası çocuk için iştirak nafakası",
      "Eşe ödenen yoksulluk nafakası",
      "Anne-babaya ödenen yardım nafakası"
    ],
    commonMisconceptions: [
      "Nafaka sadece kadına ödenmez, erkeğe de ödenebilir",
      "Yoksulluk nafakası süresiz değildir, şartları ortadan kalkarsa kaldırılır"
    ]
  },
  {
    id: "velayet",
    term: "Velayet",
    definition: "Anne ve babanın çocuk üzerindeki bakım, koruma ve temsil hakkı ve yükümlülüğü",
    detailedExplanation: "Evlilik devam ederken velayet ortak kullanılır. Boşanma halinde velayet eşlerden birine verilebilir. Çocuğun üstün yararı esastır. Son yıllarda ortak velayet kararları da verilmektedir.",
    category: "aile_hukuku",
    relatedTerms: ["çocuk", "boşanma", "kişisel ilişki", "nafaka"],
    legalBasis: ["TMK m.335-351"],
    examples: [
      "Anneye velayet verilmesi",
      "Ortak velayet kararı",
      "Velayetin değiştirilmesi davası"
    ]
  }
];

// ============================================
// TÜM KAVRAMLARI BİRLEŞTİR
// ============================================
export const ALL_CONCEPTS: LegalConcept[] = [
  ...GENEL_HUKUK_KAVRAMLARI,
  ...IS_HUKUKU_KAVRAMLARI,
  ...CEZA_HUKUKU_KAVRAMLARI,
  ...BORCLAR_HUKUKU_KAVRAMLARI,
  ...AILE_HUKUKU_KAVRAMLARI
];

// Kavram ID'sine göre ara
export function getConceptById(id: string): LegalConcept | undefined {
  return ALL_CONCEPTS.find(c => c.id === id);
}

// Terime göre ara
export function getConceptByTerm(term: string): LegalConcept | undefined {
  const normalized = term.toLowerCase();
  return ALL_CONCEPTS.find(
    c =>
      c.term.toLowerCase() === normalized ||
      c.synonyms?.some(s => s.toLowerCase() === normalized)
  );
}

// Kategoriye göre kavramları getir
export function getConceptsByCategory(category: ConceptCategory): LegalConcept[] {
  return ALL_CONCEPTS.filter(c => c.category === category);
}

// Anahtar kelimeye göre kavram ara
export function searchConcepts(keyword: string): LegalConcept[] {
  const normalized = keyword.toLowerCase();
  return ALL_CONCEPTS.filter(
    c =>
      c.term.toLowerCase().includes(normalized) ||
      c.definition.toLowerCase().includes(normalized) ||
      c.detailedExplanation.toLowerCase().includes(normalized) ||
      c.relatedTerms.some(t => t.toLowerCase().includes(normalized))
  );
}

// İlişkili kavramları getir
export function getRelatedConcepts(conceptId: string): LegalConcept[] {
  const concept = getConceptById(conceptId);
  if (!concept) return [];

  return ALL_CONCEPTS.filter(c =>
    c.id !== conceptId &&
    (concept.relatedTerms.some(t =>
      c.term.toLowerCase().includes(t.toLowerCase()) ||
      c.relatedTerms.some(rt => rt.toLowerCase() === t.toLowerCase())
    ))
  );
}
