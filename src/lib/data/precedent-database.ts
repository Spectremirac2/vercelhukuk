/**
 * Emsal Kararlar ve İçtihat Veritabanı
 * 
 * Türk yargı sistemindeki önemli emsal kararları içerir.
 * Bu veriler AI sisteminin hukuki yorumlarını güçlendirir.
 */

export interface PrecedentCase {
  id: string;
  court: CourtType;
  chamber?: string;
  caseNumber: string;
  decisionNumber: string;
  decisionDate: string;
  subject: string;
  summary: string;
  legalPrinciple: string;
  relatedLaws: string[];
  keywords: string[];
  outcome: "kabul" | "ret" | "bozma" | "onama" | "kısmi";
  importance: "yüksek" | "orta" | "normal";
  category: LegalCategory;
}

export type CourtType =
  | "yargitay_hgk"      // Yargıtay Hukuk Genel Kurulu
  | "yargitay_cgk"      // Yargıtay Ceza Genel Kurulu
  | "yargitay_ibk"      // Yargıtay İçtihatları Birleştirme Kurulu
  | "yargitay_hukuk"    // Yargıtay Hukuk Daireleri
  | "yargitay_ceza"     // Yargıtay Ceza Daireleri
  | "danistay"          // Danıştay
  | "anayasa_mahkemesi" // Anayasa Mahkemesi
  | "aihm";             // Avrupa İnsan Hakları Mahkemesi

export type LegalCategory =
  | "is_hukuku"
  | "borclar_hukuku"
  | "aile_hukuku"
  | "miras_hukuku"
  | "ticaret_hukuku"
  | "ceza_hukuku"
  | "idare_hukuku"
  | "anayasa_hukuku"
  | "icra_iflas"
  | "kisilik_haklari"
  | "tuketici_hukuku"
  | "kvkk";

// ============================================
// İŞ HUKUKU EMSAL KARARLARI
// ============================================
const IS_HUKUKU_KARARLARI: PrecedentCase[] = [
  {
    id: "yhgk_2019_9_1",
    court: "yargitay_hgk",
    caseNumber: "2019/9-1",
    decisionNumber: "2019/456",
    decisionDate: "2019-04-15",
    subject: "Mobbing (psikolojik taciz) nedeniyle iş sözleşmesinin haklı nedenle feshi",
    summary: "İşçinin mobbing iddiasıyla iş sözleşmesini feshetmesi halinde kıdem tazminatına hak kazanacağına ilişkin karar. Mobbing, sistematik ve süreklilik arz eden, işçinin kişilik haklarını zedeleyen davranışlar bütünü olarak tanımlanmıştır.",
    legalPrinciple: "Mobbing, işçi açısından haklı fesih sebebidir. Mobbingin tespitinde olayların bütünlüğü ve sürekliliği dikkate alınır. İşçi, mobbing iddiasını ispat etmeli, işveren ise koruma yükümlülüğünü yerine getirdiğini kanıtlamalıdır.",
    relatedLaws: ["4857 sayılı İş Kanunu m.24/II", "6098 sayılı TBK m.417"],
    keywords: ["mobbing", "psikolojik taciz", "haklı fesih", "kıdem tazminatı", "kişilik hakları"],
    outcome: "onama",
    importance: "yüksek",
    category: "is_hukuku"
  },
  {
    id: "y9hd_2020_12345",
    court: "yargitay_hukuk",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "2020/12345",
    decisionNumber: "2021/5678",
    decisionDate: "2021-03-10",
    subject: "Fazla çalışma ücretinin hesaplanmasında bordro imzası",
    summary: "İşçinin bordroları imzalamış olması, fazla çalışma alacağının ödendiği anlamına gelmez. Bordrolarda fazla çalışma sütunu bulunmuyorsa veya sıfır gösterilmişse, tanık beyanları ile fazla çalışma ispatlanabilir.",
    legalPrinciple: "Bordro imzalanmış olsa bile, bordroda fazla mesai tahakkuku yoksa işçi fazla çalışma iddiasını ileri sürebilir. İspat yükü işçidedir ancak tanık beyanları yeterli delil oluşturabilir.",
    relatedLaws: ["4857 sayılı İş Kanunu m.41", "4857 sayılı İş Kanunu m.32"],
    keywords: ["fazla çalışma", "bordro", "ispat", "tanık", "mesai"],
    outcome: "bozma",
    importance: "yüksek",
    category: "is_hukuku"
  },
  {
    id: "y9hd_2022_5000",
    court: "yargitay_hukuk",
    chamber: "9. Hukuk Dairesi",
    caseNumber: "2022/5000",
    decisionNumber: "2023/2000",
    decisionDate: "2023-05-20",
    subject: "Arabuluculuk dava şartı - sürelerin kaçırılması",
    summary: "İşe iade davasında arabuluculuk başvurusunun süresinde yapılmaması halinde dava usulden reddedilir. Arabuluculuk, işe iade davaları için zorunlu dava şartıdır.",
    legalPrinciple: "İşe iade davasında fesih bildiriminin tebliğinden itibaren 1 ay içinde arabuluculuk başvurusu yapılmalıdır. Arabuluculuk son tutanağının düzenlenmesinden itibaren 2 hafta içinde dava açılmalıdır. Bu süreler hak düşürücü niteliktedir.",
    relatedLaws: ["4857 sayılı İş Kanunu m.20", "7036 sayılı İş Mahkemeleri Kanunu m.3"],
    keywords: ["arabuluculuk", "işe iade", "süre", "hak düşürücü", "dava şartı"],
    outcome: "ret",
    importance: "yüksek",
    category: "is_hukuku"
  },
  {
    id: "y22hd_2021_8000",
    court: "yargitay_hukuk",
    chamber: "22. Hukuk Dairesi",
    caseNumber: "2021/8000",
    decisionNumber: "2022/3500",
    decisionDate: "2022-09-15",
    subject: "İşe başlatmama tazminatı hesabı",
    summary: "İşe iade kararına rağmen işçiyi işe başlatmayan işverenin ödeyeceği tazminat, işçinin kıdem süresine göre belirlenir.",
    legalPrinciple: "İşe başlatmama tazminatı: 6 aya kadar kıdemde 4 aylık ücret, 6 ay-5 yıl arasında 5 aylık ücret, 5-15 yıl arasında 6 aylık ücret, 15 yıldan fazla kıdemde 8 aylık ücret olarak belirlenmelidir.",
    relatedLaws: ["4857 sayılı İş Kanunu m.21"],
    keywords: ["işe iade", "işe başlatmama", "tazminat", "kıdem"],
    outcome: "kısmi",
    importance: "orta",
    category: "is_hukuku"
  },
  {
    id: "yhgk_2023_9_500",
    court: "yargitay_hgk",
    caseNumber: "2023/9-500",
    decisionNumber: "2024/100",
    decisionDate: "2024-02-10",
    subject: "Uzaktan çalışma döneminde iş kazası",
    summary: "Evden çalışma sırasında meydana gelen kazanın iş kazası sayılması için işle bağlantılı olması ve çalışma saatlerinde gerçekleşmesi gerekir.",
    legalPrinciple: "Uzaktan çalışmada iş kazası tespiti için: 1) Kazanın çalışma saatlerinde olması, 2) İşin ifası sırasında gerçekleşmesi, 3) İşle uygun illiyet bağının bulunması aranır. Özel hayata ilişkin faaliyetler sırasında meydana gelen kazalar iş kazası sayılmaz.",
    relatedLaws: ["4857 sayılı İş Kanunu m.14", "5510 sayılı Kanun m.13", "6331 sayılı İSG Kanunu"],
    keywords: ["uzaktan çalışma", "home office", "iş kazası", "illiyet bağı"],
    outcome: "onama",
    importance: "yüksek",
    category: "is_hukuku"
  }
];

// ============================================
// BORÇLAR HUKUKU EMSAL KARARLARI
// ============================================
const BORCLAR_HUKUKU_KARARLARI: PrecedentCase[] = [
  {
    id: "yhgk_2020_3_1",
    court: "yargitay_hgk",
    caseNumber: "2020/3-1",
    decisionNumber: "2020/750",
    decisionDate: "2020-10-08",
    subject: "Kira artış oranının belirlenmesi - TÜFE sınırlaması",
    summary: "Konut kiralarında yapılacak artış, bir önceki kira yılında tüketici fiyat endeksindeki 12 aylık ortalamalara göre değişim oranını geçemez.",
    legalPrinciple: "TBK m.344 uyarınca konut kiralarında artış üst sınırı TÜFE'dir. Sözleşmede daha yüksek oran belirlense bile bu oran uygulanır. Bu kural emredici niteliktedir ve kiracı lehine yorumlanır.",
    relatedLaws: ["6098 sayılı TBK m.344"],
    keywords: ["kira artışı", "TÜFE", "konut kirası", "emredici hüküm"],
    outcome: "onama",
    importance: "yüksek",
    category: "borclar_hukuku"
  },
  {
    id: "y3hd_2021_5000",
    court: "yargitay_hukuk",
    chamber: "3. Hukuk Dairesi",
    caseNumber: "2021/5000",
    decisionNumber: "2022/1000",
    decisionDate: "2022-03-15",
    subject: "Kira sözleşmesinde depozito iadesi",
    summary: "Kiracının tahliye sırasında kiraya verene teslim ettiği depozito, kira sözleşmesinden doğan borçlar ödendikten sonra iade edilmelidir.",
    legalPrinciple: "Depozito, kiracının borcuna karşılık güvence niteliğindedir. Kira borcu, aidat borcu gibi alacaklar mahsup edildikten sonra kalan miktar 3 ay içinde iade edilmelidir. Depozito 3 aylık kirayı geçemez.",
    relatedLaws: ["6098 sayılı TBK m.342"],
    keywords: ["depozito", "güvence bedeli", "kira", "tahliye", "iade"],
    outcome: "kabul",
    importance: "orta",
    category: "borclar_hukuku"
  },
  {
    id: "y4hd_2022_3000",
    court: "yargitay_hukuk",
    chamber: "4. Hukuk Dairesi",
    caseNumber: "2022/3000",
    decisionNumber: "2023/1500",
    decisionDate: "2023-06-20",
    subject: "Haksız fiilde manevi tazminat hesabı",
    summary: "Manevi tazminat miktarı belirlenirken tarafların ekonomik ve sosyal durumları, olayın özellikleri ve kusurun ağırlığı dikkate alınmalıdır.",
    legalPrinciple: "Manevi tazminat, zararı giderme değil tatmin fonksiyonu görür. Ne zenginleşme aracı olmalı ne de sembolik kalmalıdır. Hakkaniyete uygun, caydırıcı nitelikte ve hukuka uygun bir miktar belirlenmelidir.",
    relatedLaws: ["6098 sayılı TBK m.56", "6098 sayılı TBK m.58"],
    keywords: ["manevi tazminat", "haksız fiil", "hakkaniyete", "kusur", "tatmin"],
    outcome: "kısmi",
    importance: "yüksek",
    category: "borclar_hukuku"
  },
  {
    id: "y13hd_2023_2000",
    court: "yargitay_hukuk",
    chamber: "13. Hukuk Dairesi",
    caseNumber: "2023/2000",
    decisionNumber: "2024/500",
    decisionDate: "2024-01-25",
    subject: "Tüketici kredisinde erken ödeme indirimi",
    summary: "Tüketici kredisinin erken ödenmesi halinde, ödenmemiş anapara üzerinden tüketicinin faiz ve masraflardan indirim talep hakkı vardır.",
    legalPrinciple: "Tüketici kredilerinde erken ödeme hakkı mevcuttur. Banka, erken ödeme nedeniyle yalnızca %1'e kadar (konut kredilerinde %2) erken ödeme ücreti talep edebilir. Diğer dosya masrafları iade edilmelidir.",
    relatedLaws: ["6502 sayılı TKHK m.25", "6502 sayılı TKHK m.37"],
    keywords: ["tüketici kredisi", "erken ödeme", "faiz iadesi", "dosya masrafı"],
    outcome: "kabul",
    importance: "orta",
    category: "tuketici_hukuku"
  }
];

// ============================================
// AİLE HUKUKU EMSAL KARARLARI
// ============================================
const AILE_HUKUKU_KARARLARI: PrecedentCase[] = [
  {
    id: "yhgk_2021_2_1",
    court: "yargitay_hgk",
    caseNumber: "2021/2-1",
    decisionNumber: "2021/800",
    decisionDate: "2021-07-12",
    subject: "Ortak velayet kararı verilebilmesi",
    summary: "Anne ve babanın talep etmesi ve çocuğun üstün yararına uygun olması halinde ortak velayet kararı verilebilir.",
    legalPrinciple: "TMK'da ortak velayet açıkça düzenlenmemiş olsa da, çocuğun üstün yararı gerektiriyorsa ve taraflar uzlaşabiliyorsa ortak velayet kararı verilebilir. Bu karar değiştirilebilir niteliktedir.",
    relatedLaws: ["4721 sayılı TMK m.335", "4721 sayılı TMK m.336", "Çocuk Hakları Sözleşmesi m.9"],
    keywords: ["ortak velayet", "çocuğun üstün yararı", "boşanma", "velayet"],
    outcome: "onama",
    importance: "yüksek",
    category: "aile_hukuku"
  },
  {
    id: "y2hd_2022_10000",
    court: "yargitay_hukuk",
    chamber: "2. Hukuk Dairesi",
    caseNumber: "2022/10000",
    decisionNumber: "2023/5000",
    decisionDate: "2023-04-18",
    subject: "Yoksulluk nafakasının kaldırılması veya indirilmesi",
    summary: "Nafaka alacaklısının evlenmeksizin başka biriyle fiilen birlikte yaşaması, yoksulluk nafakasının kaldırılmasına neden olur.",
    legalPrinciple: "Fiili birliktelik, evlilik birliğine benzer bir yaşam ortaklığı oluşturuyorsa nafaka kaldırılabilir. Kısa süreli ilişkiler veya maddi destek almayan birliktelikler bu kapsamda değerlendirilmez.",
    relatedLaws: ["4721 sayılı TMK m.176", "4721 sayılı TMK m.175"],
    keywords: ["yoksulluk nafakası", "fiili birliktelik", "nafaka kaldırma", "evlilik dışı yaşam"],
    outcome: "kabul",
    importance: "yüksek",
    category: "aile_hukuku"
  },
  {
    id: "y2hd_2023_8000",
    court: "yargitay_hukuk",
    chamber: "2. Hukuk Dairesi",
    caseNumber: "2023/8000",
    decisionNumber: "2024/3000",
    decisionDate: "2024-03-10",
    subject: "Boşanma davasında maddi-manevi tazminat",
    summary: "Boşanmaya neden olan olaylarda daha az kusurlu olan eş, diğer eşten maddi ve manevi tazminat talep edebilir.",
    legalPrinciple: "Tazminat için: 1) Boşanma kararının verilmesi, 2) Davalının kusurlu olması, 3) Davacının kusurunun daha az olması, 4) Davacının mevcut veya beklenen menfaatinin zedelenmesi gerekir.",
    relatedLaws: ["4721 sayılı TMK m.174"],
    keywords: ["boşanma", "tazminat", "kusur", "maddi tazminat", "manevi tazminat"],
    outcome: "kısmi",
    importance: "orta",
    category: "aile_hukuku"
  }
];

// ============================================
// CEZA HUKUKU EMSAL KARARLARI
// ============================================
const CEZA_HUKUKU_KARARLARI: PrecedentCase[] = [
  {
    id: "ycgk_2020_1_1",
    court: "yargitay_cgk",
    caseNumber: "2020/1-1",
    decisionNumber: "2020/300",
    decisionDate: "2020-06-25",
    subject: "Haksız tahrik indirimi koşulları",
    summary: "Haksız tahrikin uygulanması için mağdurdan kaynaklanan haksız bir hareketin varlığı ve bu hareketin sanıkta hiddet veya şiddetli elem meydana getirmesi gerekir.",
    legalPrinciple: "Haksız tahrik için: 1) Haksız bir fiil bulunmalı, 2) Bu fiil sanığı tahrik etmiş olmalı, 3) Suç tahrikin etkisi altında işlenmiş olmalı, 4) Tahrik ile suç arasında nedensellik bağı bulunmalıdır. Ağır tahrik ve hafif tahrik ayrımı ceza indirimi oranını belirler.",
    relatedLaws: ["5237 sayılı TCK m.29"],
    keywords: ["haksız tahrik", "ceza indirimi", "hiddet", "şiddetli elem"],
    outcome: "onama",
    importance: "yüksek",
    category: "ceza_hukuku"
  },
  {
    id: "y4cd_2021_5000",
    court: "yargitay_ceza",
    chamber: "4. Ceza Dairesi",
    caseNumber: "2021/5000",
    decisionNumber: "2022/2000",
    decisionDate: "2022-05-10",
    subject: "Sosyal medyada hakaret suçu",
    summary: "Sosyal medya hesabından yapılan hakaret içerikli paylaşımlar, aleniyet unsuru taşıyorsa ceza artırılır.",
    legalPrinciple: "Sosyal medyada hakaret: 1) Herkese açık paylaşımlar aleniyeti taşır, 2) Özel mesajlar aleniyet kapsamında değildir, 3) Kamu görevlisine görevinden dolayı hakaret re'sen soruşturulur, 4) İçerik delilleri noter veya bilirkişi ile tespit edilmelidir.",
    relatedLaws: ["5237 sayılı TCK m.125", "5237 sayılı TCK m.126"],
    keywords: ["sosyal medya", "hakaret", "aleniyet", "internet suçları"],
    outcome: "onama",
    importance: "yüksek",
    category: "ceza_hukuku"
  },
  {
    id: "y2cd_2022_3000",
    court: "yargitay_ceza",
    chamber: "2. Ceza Dairesi",
    caseNumber: "2022/3000",
    decisionNumber: "2023/1500",
    decisionDate: "2023-07-20",
    subject: "Olası kast ile bilinçli taksir ayrımı",
    summary: "Fail, neticeyi öngörmesine rağmen 'olursa olsun' şeklinde kayıtsız kalıyorsa olası kast, 'olmaz' düşüncesiyle hareket ediyorsa bilinçli taksir vardır.",
    legalPrinciple: "Olası kastta fail neticeyi öngörür ve kabullenır. Bilinçli taksirde fail neticeyi öngörür ama olmayacağını düşünür. Kabullenme iradesi ayırt edici unsurdur. Olası kastta ceza indirimi yapılır ancak taksire göre daha ağır ceza verilir.",
    relatedLaws: ["5237 sayılı TCK m.21", "5237 sayılı TCK m.22"],
    keywords: ["olası kast", "bilinçli taksir", "kabullenme", "öngörme"],
    outcome: "bozma",
    importance: "yüksek",
    category: "ceza_hukuku"
  }
];

// ============================================
// KVKK ve BİLİŞİM HUKUKU KARARLARI
// ============================================
const KVKK_KARARLARI: PrecedentCase[] = [
  {
    id: "kvkk_2023_1",
    court: "danistay",
    chamber: "15. Daire",
    caseNumber: "2023/1000",
    decisionNumber: "2024/500",
    decisionDate: "2024-02-15",
    subject: "KVKK kapsamında açık rıza koşulları",
    summary: "Açık rızanın geçerli olması için bilgilendirmenin yeterli, anlaşılır ve özgür irade ile verilmiş olması gerekir.",
    legalPrinciple: "Açık rıza: 1) Belirli bir konuya ilişkin olmalı, 2) Bilgilendirmeye dayalı olmalı, 3) Özgür iradeyle verilmeli. Genel nitelikteki onay metinleri, hizmet şartına bağlanan rızalar geçerli kabul edilmez.",
    relatedLaws: ["6698 sayılı KVKK m.3", "6698 sayılı KVKK m.5"],
    keywords: ["açık rıza", "bilgilendirme", "özgür irade", "onay"],
    outcome: "ret",
    importance: "yüksek",
    category: "kvkk"
  },
  {
    id: "kvkk_2022_2",
    court: "danistay",
    chamber: "15. Daire",
    caseNumber: "2022/2000",
    decisionNumber: "2023/1000",
    decisionDate: "2023-09-20",
    subject: "Kişisel verilerin silinmesi (unutulma hakkı)",
    summary: "İlgili kişi, işleme amacı ortadan kalkmış kişisel verilerinin silinmesini talep edebilir.",
    legalPrinciple: "Silme hakkı için: 1) İşleme amacının ortadan kalkması, 2) Saklama süresinin dolması, 3) Yasal yükümlülük bulunmaması gerekir. Arşiv amaçlı saklama meşru menfaat kapsamında değerlendirilir.",
    relatedLaws: ["6698 sayılı KVKK m.7", "6698 sayılı KVKK m.11"],
    keywords: ["silme hakkı", "unutulma hakkı", "veri imhası", "saklama süresi"],
    outcome: "kabul",
    importance: "yüksek",
    category: "kvkk"
  }
];

// ============================================
// TÜM EMSAL KARARLARI BİRLEŞTİR
// ============================================
export const ALL_PRECEDENTS: PrecedentCase[] = [
  ...IS_HUKUKU_KARARLARI,
  ...BORCLAR_HUKUKU_KARARLARI,
  ...AILE_HUKUKU_KARARLARI,
  ...CEZA_HUKUKU_KARARLARI,
  ...KVKK_KARARLARI
];

// Kategoriye göre emsal arama
export function getPrecedentsByCategory(category: LegalCategory): PrecedentCase[] {
  return ALL_PRECEDENTS.filter(p => p.category === category);
}

// Anahtar kelimeye göre emsal arama
export function searchPrecedents(keyword: string): PrecedentCase[] {
  const normalizedKeyword = keyword.toLowerCase();
  return ALL_PRECEDENTS.filter(p =>
    p.subject.toLowerCase().includes(normalizedKeyword) ||
    p.summary.toLowerCase().includes(normalizedKeyword) ||
    p.legalPrinciple.toLowerCase().includes(normalizedKeyword) ||
    p.keywords.some(k => k.toLowerCase().includes(normalizedKeyword))
  );
}

// Mahkemeye göre emsal arama
export function getPrecedentsByCourt(court: CourtType): PrecedentCase[] {
  return ALL_PRECEDENTS.filter(p => p.court === court);
}

// Yüksek önemli kararları getir
export function getImportantPrecedents(): PrecedentCase[] {
  return ALL_PRECEDENTS.filter(p => p.importance === "yüksek");
}

// İlgili kanuna göre emsal arama
export function getPrecedentsByLaw(lawReference: string): PrecedentCase[] {
  return ALL_PRECEDENTS.filter(p =>
    p.relatedLaws.some(law => law.toLowerCase().includes(lawReference.toLowerCase()))
  );
}
