/**
 * Vergi Hukuku Veritabanı
 * 
 * Temel vergi kanunları, vergi türleri, beyanname süreleri,
 * vergi cezaları ve önemli hesaplamalar
 */

export interface VergiTuru {
  id: string;
  name: string;
  description: string;
  legalBasis: string[];
  taxpayer: string; // Mükellef
  taxableEvent: string; // Vergiyi doğuran olay
  taxBase: string; // Matrah
  rates: VergiOrani[];
  exemptions: string[]; // Muafiyetler
  deductions: string[]; // İstisnalar
  declarationPeriod: string; // Beyanname dönemi
  paymentDeadline: string; // Ödeme vadesi
  practicalTips: string[];
}

export interface VergiOrani {
  bracket?: string;
  rate: string;
  description?: string;
}

export interface VergiCezasi {
  id: string;
  name: string;
  description: string;
  legalBasis: string;
  type: "vergi_ziyai" | "usulsuzluk" | "ozel_usulsuzluk" | "kacakcilik";
  penalty: string;
  additionalConsequences: string[];
}

export interface VergiTakvimi {
  month: string;
  declarations: DeclarationDeadline[];
}

export interface DeclarationDeadline {
  name: string;
  deadline: string;
  paymentDeadline?: string;
  notes?: string;
}

// ============================================
// VERGİ TÜRLERİ
// ============================================
export const VERGI_TURLERI: VergiTuru[] = [
  {
    id: "gelir_vergisi",
    name: "Gelir Vergisi",
    description: "Gerçek kişilerin bir takvim yılı içinde elde ettikleri kazanç ve iratların toplamı üzerinden alınan vergi.",
    legalBasis: ["193 sayılı Gelir Vergisi Kanunu"],
    taxpayer: "Gerçek kişiler (tam mükellef: Türkiye'de yerleşik olanlar, dar mükellef: yerleşik olmayanlar)",
    taxableEvent: "Gelirin elde edilmesi",
    taxBase: "Yıllık toplam gelir (7 gelir unsuru)",
    rates: [
      { bracket: "0 - 110.000 TL", rate: "%15" },
      { bracket: "110.000 - 230.000 TL", rate: "%20" },
      { bracket: "230.000 - 580.000 TL", rate: "%27" },
      { bracket: "580.000 - 3.000.000 TL", rate: "%35" },
      { bracket: "3.000.000 TL üzeri", rate: "%40" }
    ],
    exemptions: [
      "Genç girişimci istisnası (GVK m.Mükerrer 20)",
      "Esnaf muaflığı (GVK m.9)",
      "Diplomatik muafiyet"
    ],
    deductions: [
      "Menkul sermaye iratlarında indirim",
      "Eğitim ve sağlık harcamaları (%10'a kadar)",
      "Bağış ve yardımlar",
      "Bireysel emeklilik katkı payları"
    ],
    declarationPeriod: "Yıllık (1 Ocak - 31 Aralık)",
    paymentDeadline: "Mart ve Temmuz aylarında iki eşit taksit",
    practicalTips: [
      "7 gelir unsuru: Ticari, zirai, serbest meslek, ücret, menkul/gayrimenkul sermaye iradı, diğer kazançlar",
      "Tevkifat (stopaj) yapılan gelirler beyan dışı kalabilir",
      "GMSİ'de götürü gider yöntemi %15",
      "2024 yılı için istisna ve muafiyet tutarları güncellenmiştir"
    ]
  },
  {
    id: "kurumlar_vergisi",
    name: "Kurumlar Vergisi",
    description: "Kurumların (sermaye şirketleri, kooperatifler, dernek ve vakıflar, kamu ikt. teşeb.) kazançları üzerinden alınan vergi.",
    legalBasis: ["5520 sayılı Kurumlar Vergisi Kanunu"],
    taxpayer: "Sermaye şirketleri, kooperatifler, iktisadi kamu kuruluşları, dernek ve vakıfların iktisadi işletmeleri, iş ortaklıkları",
    taxableEvent: "Kurum kazancının elde edilmesi",
    taxBase: "Safi kurum kazancı (ticari bilanço karı ± kanunen kabul edilmeyen giderler)",
    rates: [
      { rate: "%25", description: "Genel oran (2024 yılı için)" },
      { rate: "%30", description: "Bankalar, fin. kir. şirketleri, faktoring, fin. şirketleri, ödeme ve e-para kuruluşları" },
      { rate: "%20", description: "İhracat kazançları (belirli şartlarla)" },
      { rate: "%1", description: "Yatırım fonları, gayrimenkul yatırım ortaklıkları" }
    ],
    exemptions: [
      "İştirak kazançları istisnası (KVK m.5/1-a)",
      "Yurt dışı iştirak kazançları (KVK m.5/1-b)",
      "Gayrimenkul satış kazancı istisnası (KVK m.5/1-e) - %50'si",
      "AR-GE indirimi"
    ],
    deductions: [
      "Sponsorluk harcamaları",
      "Bağış ve yardımlar",
      "Girişim sermayesi fonu",
      "Nakdi sermaye artırımı indirimi"
    ],
    declarationPeriod: "Yıllık (hesap dönemi kapanışından sonra 4 ay içinde)",
    paymentDeadline: "Beyanname verme süresi içinde tek seferde",
    practicalTips: [
      "Geçici vergi dönemleri: 3'er aylık",
      "Transfer fiyatlandırması kurallarına dikkat",
      "Örtülü sermaye ve örtülü kazanç dağıtımı",
      "KKEG'ler (Kanunen Kabul Edilmeyen Giderler) matrahı artırır"
    ]
  },
  {
    id: "kdv",
    name: "Katma Değer Vergisi (KDV)",
    description: "Mal ve hizmet teslimlerinde, her aşamada yaratılan katma değer üzerinden alınan tüketim vergisi.",
    legalBasis: ["3065 sayılı Katma Değer Vergisi Kanunu"],
    taxpayer: "Mal teslimi ve hizmet ifası yapan mükellefler",
    taxableEvent: "Mal teslimi, hizmet ifası, mal ve hizmet ithali",
    taxBase: "Bedel (teslim ve hizmet karşılığı alınan değerler toplamı)",
    rates: [
      { rate: "%20", description: "Genel oran (2024 değişikliği ile)" },
      { rate: "%10", description: "Temel gıda maddeleri, turizm işletmeleri, bazı hizmetler" },
      { rate: "%1", description: "Temel gıda (ekmek, un, süt vb.), gazete, dergi, kitap, konut teslimleri (150 m² altı)" }
    ],
    exemptions: [
      "İhracat istisnası (KDVK m.11)",
      "Diplomatik istisna (KDVK m.15)",
      "Uluslararası taşımacılık (KDVK m.14)"
    ],
    deductions: [
      "Yüklenilen KDV'nin indirilmesi",
      "İndirimli orana tabi işlemlerde KDV iadesi"
    ],
    declarationPeriod: "Aylık (takip eden ayın 28'ine kadar)",
    paymentDeadline: "Beyanname verme süresi içinde",
    practicalTips: [
      "KDV tevkifatı (2/10, 5/10, 7/10, 9/10 oranlarında)",
      "Sorumlu sıfatıyla KDV (hizmet ithalinde)",
      "İade işlemlerinde belge düzeni kritik",
      "Ba-Bs formu 5.000 TL üzeri işlemler için zorunlu"
    ]
  },
  {
    id: "otv",
    name: "Özel Tüketim Vergisi (ÖTV)",
    description: "Belirli mal gruplarının ithali veya ilk tesliminde bir defaya mahsus alınan vergi.",
    legalBasis: ["4760 sayılı Özel Tüketim Vergisi Kanunu"],
    taxpayer: "İmalatçılar, ithalatçılar",
    taxableEvent: "İlk iktisap, ithalat, ilk teslim",
    taxBase: "Bedel veya maktu tutar (listeye göre değişir)",
    rates: [
      { rate: "Liste I", description: "Petrol ürünleri: Maktu tutar (TL/lt, TL/kg)" },
      { rate: "Liste II", description: "Motorlu taşıtlar: %10 - %220 (motor hacmi ve değere göre)" },
      { rate: "Liste III", description: "Alkol ve tütün: %0 - %70 + maktu" },
      { rate: "Liste IV", description: "Lüks tüketim: %10 - %40" }
    ],
    exemptions: [
      "Engelli araç istisnası",
      "Diplomatik istisna",
      "İhracat istisnası"
    ],
    deductions: [],
    declarationPeriod: "15 günlük dönemler (1-15 ve 16-ay sonu)",
    paymentDeadline: "Takip eden 15 gün içinde",
    practicalTips: [
      "ÖTV, KDV matrahına dahil edilir",
      "Araç ÖTV oranları motor hacmi ve fiyata göre kademeli",
      "İkinci el araçta ÖTV alınmaz",
      "Bandrol ve etiket yükümlülükleri"
    ]
  },
  {
    id: "damga_vergisi",
    name: "Damga Vergisi",
    description: "Yazılı kağıtlardan (sözleşme, makbuz, beyanname vb.) alınan vergi.",
    legalBasis: ["488 sayılı Damga Vergisi Kanunu"],
    taxpayer: "Kağıdı imzalayanlar (müteselsil sorumluluk)",
    taxableEvent: "Vergiye tabi kağıdın düzenlenmesi",
    taxBase: "Kağıtta yazılı bedel veya maktu tutar",
    rates: [
      { rate: "Binde 9,48", description: "Sözleşmeler (genel)" },
      { rate: "Binde 5,69", description: "Kira sözleşmeleri" },
      { rate: "Binde 7,59", description: "Taahhütnameler, kefaletnameler" },
      { rate: "Maktu", description: "Beyannameler, bilançolar: Sabit tutarlar" }
    ],
    exemptions: [
      "Resmi daireler arası yazışmalar",
      "Banka ve kredi kurumlarının bazı işlemleri",
      "Yatırım teşvik belgeli işlemler"
    ],
    deductions: [],
    declarationPeriod: "Sürekli mükellefiyet: Aylık (takip eden ayın 26'sına kadar)",
    paymentDeadline: "Beyanname verme süresi içinde",
    practicalTips: [
      "Damga vergisi üst sınırı var (2024 için 21.167.887,50 TL)",
      "Aynı kağıtta birden fazla işlem varsa en yüksek oranlı alınır",
      "Nüsha sayısı kadar vergi doğabilir",
      "İstisna ve muafiyet halleri dikkatle incelenmeli"
    ]
  },
  {
    id: "emlak_vergisi",
    name: "Emlak Vergisi",
    description: "Bina ve arazi üzerinden belediyeler tarafından alınan servet vergisi.",
    legalBasis: ["1319 sayılı Emlak Vergisi Kanunu"],
    taxpayer: "Malik, varsa intifa hakkı sahibi, her ikisi de yoksa maliki gibi tasarruf eden",
    taxableEvent: "Bina/arazinin maliki veya intifa hakkı sahibi olmak",
    taxBase: "Vergi değeri (rayiç bedel)",
    rates: [
      { rate: "Binde 1", description: "Konutlar (meskeni)" },
      { rate: "Binde 2", description: "İşyerleri, diğer binalar" },
      { rate: "Binde 1", description: "Araziler" },
      { rate: "Binde 3", description: "Arsalar" }
    ],
    exemptions: [
      "Emekli, engelli, dul, yetim tek konut muafiyeti",
      "Kamu kuruluşlarının binaları",
      "Eğitim ve sağlık tesisleri"
    ],
    deductions: [],
    declarationPeriod: "Değişiklik olmadıkça beyan gerekmez (4 yılda bir yeniden değerleme)",
    paymentDeadline: "Mayıs ve Kasım aylarında iki taksit",
    practicalTips: [
      "Büyükşehirlerde oranlar %100 zamlı uygulanır",
      "Çevre temizlik vergisi de emlak vergisi ile birlikte ödenir",
      "Vergi değeri 4 yılda bir güncellenir",
      "Muafiyet için belediyeye başvuru gerekli"
    ]
  },
  {
    id: "veraset_intikal",
    name: "Veraset ve İntikal Vergisi",
    description: "Miras, bağış ve her türlü karşılıksız edinim üzerinden alınan vergi.",
    legalBasis: ["7338 sayılı Veraset ve İntikal Vergisi Kanunu"],
    taxpayer: "Malı edinen kişi (varis, bağış alan)",
    taxableEvent: "Ölüm veya ivazsız intikal",
    taxBase: "İntikal eden malların safi değeri",
    rates: [
      { bracket: "Veraset yoluyla", rate: "%1 - %10", description: "Kademeli artan oran" },
      { bracket: "İvazsız intikal (bağış)", rate: "%10 - %30", description: "Kademeli artan oran" }
    ],
    exemptions: [
      "Murisin eşi ve çocuklarına isabet eden istisna tutarı",
      "Kamusal bağışlar",
      "Evlat edinmede belirli sınırlar"
    ],
    deductions: [
      "Cenaze masrafları",
      "Murisin borçları",
      "Beyanname verme masrafları"
    ],
    declarationPeriod: "Ölüm: 4 ay (yurtdışında 6 ay), Bağış: 1 ay",
    paymentDeadline: "3 yılda 6 taksit",
    practicalTips: [
      "Emlak değeri rayiç bedel üzerinden hesaplanır",
      "Banka mevduatları otomatik bildirilir",
      "Tapu devri için vergi borcu yoktur yazısı gerekir",
      "İstisna tutarları her yıl güncellenir"
    ]
  }
];

// ============================================
// VERGİ CEZALARI
// ============================================
export const VERGI_CEZALARI: VergiCezasi[] = [
  {
    id: "vergi_ziyai",
    name: "Vergi Ziyaı Cezası",
    description: "Mükellefin veya sorumlunun vergilendirme ile ilgili ödevlerini zamanında yerine getirmemesi veya eksik yerine getirmesi nedeniyle verginin zamanında tahakkuk ettirilmemesi.",
    legalBasis: "VUK m.341, 344",
    type: "vergi_ziyai",
    penalty: "Ziyaa uğratılan verginin 1 katı (kasıt halinde 3 katına kadar artırılabilir)",
    additionalConsequences: [
      "Gecikme faizi uygulanır",
      "Tekrarında ceza artırımı",
      "Belirli durumlarda suç duyurusu"
    ]
  },
  {
    id: "usulsuzluk",
    name: "Usulsüzlük Cezası",
    description: "Vergi kanunlarının şekle ve usule ilişkin hükümlerine uyulmaması.",
    legalBasis: "VUK m.351-352",
    type: "usulsuzluk",
    penalty: "Birinci derece: 740 TL - 22.000 TL, İkinci derece: 400 TL - 11.000 TL (2024 tutarları)",
    additionalConsequences: [
      "Tekrarda %25 artırım",
      "Re'sen tarhiyata neden olabilir"
    ]
  },
  {
    id: "ozel_usulsuzluk",
    name: "Özel Usulsüzlük Cezası",
    description: "Fatura, fiş vb. belgelerin düzenlenmemesi veya alınmaması.",
    legalBasis: "VUK m.353",
    type: "ozel_usulsuzluk",
    penalty: "Belge başına değişen miktarlar (fatura için 6.900 TL'den başlayarak)",
    additionalConsequences: [
      "Tespit başına ceza",
      "Üst sınırlar uygulanabilir",
      "POS cihazı kullanmama: Ayrıca ceza"
    ]
  },
  {
    id: "kacakcilik",
    name: "Vergi Kaçakçılığı Suçu",
    description: "Vergi kaçakçılığı fiilleri hapis cezası gerektiren suçlardır.",
    legalBasis: "VUK m.359",
    type: "kacakcilik",
    penalty: "1 yıl - 5 yıl hapis (fiilin niteliğine göre)",
    additionalConsequences: [
      "Vergi ziyaı cezası 3 kat",
      "Defter ve belge gizleme: 3-8 yıl",
      "Sahte belge düzenleme/kullanma: 3-8 yıl",
      "Etkin pişmanlık indirimi mümkün"
    ]
  }
];

// ============================================
// VERGİ TAKVİMİ (ÖNEMLİ TARİHLER)
// ============================================
export const VERGI_TAKVIMI: VergiTakvimi[] = [
  {
    month: "Ocak",
    declarations: [
      { name: "Aralık Dönemi KDV Beyannamesi", deadline: "28 Ocak", paymentDeadline: "28 Ocak" },
      { name: "Aralık Dönemi Muhtasar Beyanname", deadline: "26 Ocak", paymentDeadline: "26 Ocak" },
      { name: "4. Dönem Geçici Vergi Beyannamesi", deadline: "17 Şubat", paymentDeadline: "17 Şubat" }
    ]
  },
  {
    month: "Şubat",
    declarations: [
      { name: "Ocak Dönemi KDV Beyannamesi", deadline: "28 Şubat", paymentDeadline: "28 Şubat" },
      { name: "Ocak Dönemi Muhtasar Beyanname", deadline: "26 Şubat", paymentDeadline: "26 Şubat" },
      { name: "Emlak Vergisi 1. Taksit", deadline: "31 Mayıs", notes: "Hatırlatma" }
    ]
  },
  {
    month: "Mart",
    declarations: [
      { name: "Şubat Dönemi KDV Beyannamesi", deadline: "28 Mart", paymentDeadline: "28 Mart" },
      { name: "Yıllık Gelir Vergisi Beyannamesi", deadline: "31 Mart", paymentDeadline: "31 Mart (1. taksit)" },
      { name: "Şubat Dönemi Muhtasar Beyanname", deadline: "26 Mart", paymentDeadline: "26 Mart" }
    ]
  },
  {
    month: "Nisan",
    declarations: [
      { name: "Mart Dönemi KDV Beyannamesi", deadline: "28 Nisan", paymentDeadline: "28 Nisan" },
      { name: "Yıllık Kurumlar Vergisi Beyannamesi", deadline: "30 Nisan", paymentDeadline: "30 Nisan" },
      { name: "1. Dönem Geçici Vergi Beyannamesi", deadline: "17 Mayıs", paymentDeadline: "17 Mayıs" }
    ]
  },
  {
    month: "Mayıs",
    declarations: [
      { name: "Nisan Dönemi KDV Beyannamesi", deadline: "28 Mayıs", paymentDeadline: "28 Mayıs" },
      { name: "Emlak Vergisi 1. Taksit", deadline: "31 Mayıs", paymentDeadline: "31 Mayıs" }
    ]
  },
  {
    month: "Temmuz",
    declarations: [
      { name: "Haziran Dönemi KDV Beyannamesi", deadline: "28 Temmuz", paymentDeadline: "28 Temmuz" },
      { name: "Yıllık Gelir Vergisi 2. Taksit", deadline: "31 Temmuz", paymentDeadline: "31 Temmuz" },
      { name: "2. Dönem Geçici Vergi Beyannamesi", deadline: "17 Ağustos", paymentDeadline: "17 Ağustos" }
    ]
  },
  {
    month: "Ekim",
    declarations: [
      { name: "Eylül Dönemi KDV Beyannamesi", deadline: "28 Ekim", paymentDeadline: "28 Ekim" },
      { name: "3. Dönem Geçici Vergi Beyannamesi", deadline: "17 Kasım", paymentDeadline: "17 Kasım" }
    ]
  },
  {
    month: "Kasım",
    declarations: [
      { name: "Ekim Dönemi KDV Beyannamesi", deadline: "28 Kasım", paymentDeadline: "28 Kasım" },
      { name: "Emlak Vergisi 2. Taksit", deadline: "30 Kasım", paymentDeadline: "30 Kasım" }
    ]
  }
];

// ============================================
// VERGİ HESAPLAMA YARDIMCI FONKSİYONLARI
// ============================================
export interface GelirVergisiHesaplama {
  yillikGelir: number;
  vergiMatrahi: number;
  hesaplananVergi: number;
  dilimDetay: DilimDetay[];
}

export interface DilimDetay {
  dilim: string;
  oran: string;
  matrah: number;
  vergi: number;
}

export function hesaplaGelirVergisi(yillikGelir: number): GelirVergisiHesaplama {
  const dilimler = [
    { limit: 110000, oran: 0.15 },
    { limit: 230000, oran: 0.20 },
    { limit: 580000, oran: 0.27 },
    { limit: 3000000, oran: 0.35 },
    { limit: Infinity, oran: 0.40 }
  ];

  let kalanMatrah = yillikGelir;
  let toplamVergi = 0;
  let oncekiLimit = 0;
  const dilimDetay: DilimDetay[] = [];

  for (const dilim of dilimler) {
    const dilimMatrahi = Math.min(kalanMatrah, dilim.limit - oncekiLimit);
    if (dilimMatrahi <= 0) break;

    const dilimVergisi = dilimMatrahi * dilim.oran;
    toplamVergi += dilimVergisi;

    dilimDetay.push({
      dilim: `${oncekiLimit.toLocaleString('tr-TR')} - ${dilim.limit === Infinity ? '∞' : dilim.limit.toLocaleString('tr-TR')} TL`,
      oran: `%${dilim.oran * 100}`,
      matrah: dilimMatrahi,
      vergi: dilimVergisi
    });

    kalanMatrah -= dilimMatrahi;
    oncekiLimit = dilim.limit;
  }

  return {
    yillikGelir,
    vergiMatrahi: yillikGelir,
    hesaplananVergi: Math.round(toplamVergi * 100) / 100,
    dilimDetay
  };
}

export function hesaplaKDV(bedel: number, oran: number = 20): { kdvHaric: number; kdv: number; kdvDahil: number } {
  return {
    kdvHaric: bedel,
    kdv: Math.round(bedel * oran / 100 * 100) / 100,
    kdvDahil: Math.round(bedel * (1 + oran / 100) * 100) / 100
  };
}

export function hesaplaDamgaVergisi(bedel: number, oranBinde: number = 9.48): number {
  const vergi = bedel * oranBinde / 1000;
  const ustSinir = 21167887.50; // 2024 yılı üst sınırı
  return Math.min(Math.round(vergi * 100) / 100, ustSinir);
}

// ============================================
// SIK SORULAN SORULAR
// ============================================
export const VERGI_FAQ = [
  {
    question: "Gelir vergisi beyannamesi ne zaman verilir?",
    answer: "Yıllık gelir vergisi beyannamesi, izleyen yılın Mart ayının başından 31 Mart akşamına kadar verilir. Ödeme ise Mart ve Temmuz aylarında iki eşit taksitte yapılır."
  },
  {
    question: "KDV oranları nelerdir?",
    answer: "Genel oran %20'dir (2024 değişikliği). İndirimli oranlar: Temel gıda, turizm, sağlık hizmetleri için %10; ekmek, un, süt, kitap, 150 m² altı konut için %1."
  },
  {
    question: "Vergi cezasına itiraz nasıl yapılır?",
    answer: "Vergi cezasına karşı 30 gün içinde vergi mahkemesinde dava açılabilir. Alternatif olarak uzlaşma talep edilebilir (tarhiyat öncesi veya sonrası). İdari başvuru olarak da düzeltme talep edilebilir."
  },
  {
    question: "Fatura düzenlememenin cezası nedir?",
    answer: "Her bir belge için 2024 yılında 6.900 TL özel usulsüzlük cezası kesilir. Aynı yıl içinde tespit edilen her işlem için ayrı ayrı ceza uygulanır. Üst sınır yıllık 3.400.000 TL'dir."
  },
  {
    question: "Pişmanlık ve ıslah nedir?",
    answer: "VUK m.371'e göre, vergi ziyaına neden olan fiiller kendiliğinden idareye bildirilir ve 15 gün içinde ödeme yapılırsa vergi ziyaı cezası kesilmez, sadece %50 oranında gecikme zammı uygulanır. Vergi incelemesi başlamadan önce yapılmalıdır."
  },
  {
    question: "Geçici vergi nedir ve ne zaman ödenir?",
    answer: "Ticari ve mesleki kazançlar için yıl içinde 3'er aylık dönemlerde beyan edilen peşin vergidir. Dönem sonunu izleyen 2. ayın 17'sine kadar beyan edilir. Yıllık vergiden mahsup edilir, fazla ödeme iade alınabilir."
  },
  {
    question: "Vergi mahsubu nasıl yapılır?",
    answer: "Yıl içinde kesilen stopajlar (tevkifat) ve ödenen geçici vergiler, yıllık vergi beyannamesiyle hesaplanan vergiden mahsup edilir. Mahsup sonrası ödenmesi gereken vergi ortaya çıkar veya iade hakkı doğar."
  },
  {
    question: "E-fatura ve e-defter kimler için zorunlu?",
    answer: "Brüt satış hasılatı 3 milyon TL'yi aşan mükellefler, ÖTV mükellefleri, EPDK lisans sahipleri ve ihracat yapanlar e-fatura kullanmak zorundadır. E-fatura zorunluluğu olan mükellefler için e-defter de zorunludur."
  }
];

// Arama fonksiyonları
export function searchVergiTuru(keyword: string): VergiTuru[] {
  const normalized = keyword.toLowerCase();
  return VERGI_TURLERI.filter(
    v => v.name.toLowerCase().includes(normalized) ||
         v.description.toLowerCase().includes(normalized)
  );
}

export function getVergiCezasi(type: string): VergiCezasi[] {
  return VERGI_CEZALARI.filter(c => c.type === type || c.name.toLowerCase().includes(type.toLowerCase()));
}

export function getVergiFAQ(keyword: string) {
  const normalized = keyword.toLowerCase();
  return VERGI_FAQ.filter(
    f => f.question.toLowerCase().includes(normalized) ||
         f.answer.toLowerCase().includes(normalized)
  );
}
