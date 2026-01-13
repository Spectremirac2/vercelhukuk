/**
 * Mahkeme Türleri ve Yetki Kuralları Veritabanı
 * 
 * Türk yargı sistemi, mahkeme türleri, görev ve yetki kuralları,
 * temyiz/istinaf süreçleri
 */

export interface MahkemeTuru {
  id: string;
  name: string;
  description: string;
  category: "adli" | "idari" | "anayasa" | "uyusmazlik";
  legalBasis: string[];
  jurisdiction: string; // Görev alanı
  composition: string; // Oluşumu
  appealCourt?: string; // Temyiz/istinaf mercii
  procedureRules: string[]; // Uygulanan usul kuralları
  commonCaseTypes: string[];
  practicalTips: string[];
}

export interface YetkiKurali {
  id: string;
  name: string;
  description: string;
  type: "genel" | "ozel" | "kesin";
  legalBasis: string;
  applicableIn: string[]; // Uygulandığı dava türleri
  exceptions: string[];
  howToDetermine: string;
}

export interface TemyizIstinaf {
  id: string;
  caseType: string;
  firstInstance: string; // İlk derece mahkemesi
  appealCourt: string; // İstinaf mahkemesi
  highCourt: string; // Temyiz mahkemesi
  appealDeadline: string;
  appealConditions: string[];
  practicalTips: string[];
}

export interface DavaAcmaSureci {
  id: string;
  name: string;
  steps: DavaAdimi[];
  requiredDocuments: string[];
  estimatedDuration: string;
  costs: DavaMasrafi[];
}

export interface DavaAdimi {
  order: number;
  name: string;
  description: string;
  deadline?: string;
}

export interface DavaMasrafi {
  name: string;
  amount: string;
  notes?: string;
}

// ============================================
// MAHKEME TÜRLERİ
// ============================================
export const MAHKEME_TURLERI: MahkemeTuru[] = [
  // ADLİ YARGI
  {
    id: "asliye_hukuk",
    name: "Asliye Hukuk Mahkemesi",
    description: "Hukuk davalarında genel görevli mahkeme. Özel mahkemelerin görevine girmeyen tüm hukuk davaları.",
    category: "adli",
    legalBasis: ["5235 sayılı Adli Yargı İlk Derece Mahkemeleri ile Bölge Adliye Mahkemelerinin Kuruluş Kanunu m.5"],
    jurisdiction: "Dava konusunun değer veya tutarına bakılmaksızın malvarlığı haklarına ilişkin davalar (özel mahkeme yoksa), şahıs varlığına ilişkin davalar, çekişmesiz yargı işleri",
    composition: "Tek hakimli",
    appealCourt: "Bölge Adliye Mahkemesi → Yargıtay",
    procedureRules: ["HMK (6100 sayılı Hukuk Muhakemeleri Kanunu)"],
    commonCaseTypes: [
      "Tapu iptal ve tescil davaları",
      "Alacak davaları",
      "Tazminat davaları",
      "Ortaklığın giderilmesi",
      "Kamulaştırma davaları",
      "İtirazın iptali davaları"
    ],
    practicalTips: [
      "Görev itirazı ilk itirazlar arasında ve cevap dilekçesiyle yapılmalı",
      "Değer belirtilmezse nispi harç sorunu çıkabilir",
      "Arabuluculuk dava şartı olan davalara dikkat"
    ]
  },
  {
    id: "sulh_hukuk",
    name: "Sulh Hukuk Mahkemesi",
    description: "Kira, kat mülkiyeti, ortaklığın giderilmesi ve basit yargılama usulüne tabi davalarda görevli mahkeme.",
    category: "adli",
    legalBasis: ["5235 sayılı Kanun m.4", "HMK m.316-322"],
    jurisdiction: "Kira ilişkisinden doğan davalar, kat mülkiyeti uyuşmazlıkları, ortaklığın giderilmesi, taşınır ve taşınmaz mal paylaştırılması, zilyetlik davaları, çekişmesiz yargı işlerinin bir kısmı",
    composition: "Tek hakimli",
    appealCourt: "Bölge Adliye Mahkemesi → Yargıtay",
    procedureRules: ["HMK - Basit Yargılama Usulü"],
    commonCaseTypes: [
      "Kira tespiti davaları",
      "Kira bedelinin uyarlanması",
      "Tahliye davaları",
      "Kat mülkiyeti uyuşmazlıkları",
      "Mirasçılık belgesi (veraset ilamı)",
      "Zilyetliğin korunması"
    ],
    practicalTips: [
      "Basit yargılama usulü uygulanır - süreler kısa",
      "Tahliye davası süresine dikkat (2 hafta)",
      "Kira tespit davası her yıl açılabilir"
    ]
  },
  {
    id: "asliye_ticaret",
    name: "Asliye Ticaret Mahkemesi",
    description: "Ticari davalar ve ticari nitelikli çekişmesiz yargı işleri.",
    category: "adli",
    legalBasis: ["TTK m.5", "5235 sayılı Kanun m.5"],
    jurisdiction: "Her iki tarafın da ticari işletmesiyle ilgili davalar, TTK'da düzenlenen hususlardan doğan davalar, ticari nitelikte çekişmesiz yargı işleri",
    composition: "Tek hakimli (bazı davalarda heyet)",
    appealCourt: "Bölge Adliye Mahkemesi → Yargıtay",
    procedureRules: ["HMK", "TTK özel hükümleri"],
    commonCaseTypes: [
      "Şirket davaları (fesih, tasfiye, iptal)",
      "İflas davaları",
      "Konkordato",
      "Haksız rekabet davaları",
      "Kambiyo senetlerinden doğan davalar",
      "Sigorta davaları"
    ],
    practicalTips: [
      "Arabuluculuk dava şartı (TTK kapsamı)",
      "Tacirler arasında özel usul kuralları var",
      "İhtiyati haciz kararları bu mahkemeden"
    ]
  },
  {
    id: "aile",
    name: "Aile Mahkemesi",
    description: "Aile hukukuna ilişkin dava ve işler.",
    category: "adli",
    legalBasis: ["4787 sayılı Aile Mahkemelerinin Kuruluş, Görev ve Yargılama Usullerine Dair Kanun"],
    jurisdiction: "Nişanlanma, evlenme, boşanma, mal rejimleri, nafaka, velayet, soybağı, evlat edinme, babalık, vesayet",
    composition: "Tek hakimli (uzman psikolog/pedagog desteği)",
    appealCourt: "Bölge Adliye Mahkemesi → Yargıtay",
    procedureRules: ["HMK", "4787 sayılı Kanun özel hükümleri"],
    commonCaseTypes: [
      "Boşanma davaları",
      "Velayet davaları",
      "Nafaka davaları",
      "Mal rejimi tasfiyesi",
      "Babalık davaları",
      "Evlat edinme"
    ],
    practicalTips: [
      "Zorunlu arabuluculuk yok (aile hukukunda)",
      "Çocuğun üstün yararı ön planda",
      "Uzman görüşü alınabilir",
      "Gizlilik ilkesi önemli"
    ]
  },
  {
    id: "is",
    name: "İş Mahkemesi",
    description: "İş hukukundan kaynaklanan uyuşmazlıklar.",
    category: "adli",
    legalBasis: ["7036 sayılı İş Mahkemeleri Kanunu"],
    jurisdiction: "Bireysel veya toplu iş sözleşmesine dayanan davalar, sosyal güvenlik hukuku davaları, işçi-işveren arasındaki davalar",
    composition: "Tek hakimli",
    appealCourt: "Bölge Adliye Mahkemesi → Yargıtay",
    procedureRules: ["HMK - Basit Yargılama Usulü", "7036 sayılı Kanun"],
    commonCaseTypes: [
      "İşe iade davaları",
      "Kıdem/ihbar tazminatı",
      "Fazla mesai alacağı",
      "İş kazası tazminatı",
      "SGK prim davaları",
      "Hizmet tespiti davaları"
    ],
    practicalTips: [
      "Dava şartı olarak arabuluculuk zorunlu",
      "2 hafta içinde arabuluculuk son tutanağı eklenmeli",
      "Zamanaşımı 5 yıl (genel alacaklarda)"
    ]
  },
  {
    id: "tuketici",
    name: "Tüketici Mahkemesi",
    description: "Tüketici işlemlerinden doğan uyuşmazlıklar.",
    category: "adli",
    legalBasis: ["6502 sayılı Tüketicinin Korunması Hakkında Kanun m.73"],
    jurisdiction: "Tüketici işlemleri, tüketici kredileri, konut finansmanı, ayıplı mal/hizmet davaları",
    composition: "Tek hakimli",
    appealCourt: "Bölge Adliye Mahkemesi → Yargıtay",
    procedureRules: ["HMK - Basit Yargılama Usulü"],
    commonCaseTypes: [
      "Ayıplı mal/hizmet davaları",
      "Tüketici kredi uyuşmazlıkları",
      "Devre tatil sözleşmeleri",
      "Mesafeli satış iptalleri",
      "Paket tur davaları"
    ],
    practicalTips: [
      "Dava şartı olarak arabuluculuk zorunlu (01.01.2024)",
      "10.000 TL altı uyuşmazlıklar → Tüketici Hakem Heyeti",
      "Harçtan muafiyet bazı durumlarda var"
    ]
  },
  {
    id: "icra_hukuk",
    name: "İcra Hukuk Mahkemesi",
    description: "İcra ve iflas işlemlerinden doğan hukuki uyuşmazlıklar.",
    category: "adli",
    legalBasis: ["2004 sayılı İcra ve İflas Kanunu"],
    jurisdiction: "İcra dairesi işlemlerine şikayet, itirazın kaldırılması, ihalenin feshi, menfi tespit davaları",
    composition: "Tek hakimli",
    appealCourt: "Bölge Adliye Mahkemesi → Yargıtay",
    procedureRules: ["İİK özel hükümleri", "HMK (uygun düştükçe)"],
    commonCaseTypes: [
      "İtirazın kaldırılması",
      "İhalenin feshi",
      "Şikayet davaları",
      "İstihkak davaları",
      "Borçtan kurtulma (menfi tespit)"
    ],
    practicalTips: [
      "7 gün şikayet süresi kritik",
      "İhalenin feshi için 7 gün süre",
      "Duruşmasız karar verilebilir"
    ]
  },
  {
    id: "asliye_ceza",
    name: "Asliye Ceza Mahkemesi",
    description: "Sulh ceza hakimliğinin görev alanı dışında kalan ve ağır ceza mahkemesinin görevine girmeyen ceza davalarında görevli.",
    category: "adli",
    legalBasis: ["5235 sayılı Kanun m.11"],
    jurisdiction: "2-10 yıl arası hapis cezası gerektiren suçlar (genel olarak)",
    composition: "Tek hakimli",
    appealCourt: "Bölge Adliye Mahkemesi → Yargıtay",
    procedureRules: ["CMK (5271 sayılı Ceza Muhakemesi Kanunu)"],
    commonCaseTypes: [
      "Basit yaralama",
      "Hırsızlık",
      "Dolandırıcılık",
      "Tehdit",
      "Hakaret",
      "Trafik kazası (ölümlü olmayan)"
    ],
    practicalTips: [
      "Uzlaşmaya tabi suçlar önce uzlaştırmacıya",
      "Seri muhakeme ve basit yargılama usulü uygulanabilir",
      "Duruşma hazırlığı önemli"
    ]
  },
  {
    id: "agir_ceza",
    name: "Ağır Ceza Mahkemesi",
    description: "Ağır cezayı gerektiren suçlarda görevli mahkeme.",
    category: "adli",
    legalBasis: ["5235 sayılı Kanun m.12"],
    jurisdiction: "10 yıldan fazla hapis veya ağırlaştırılmış müebbet hapis gerektiren suçlar",
    composition: "1 başkan + 2 üye (3 hakimli heyet)",
    appealCourt: "Bölge Adliye Mahkemesi → Yargıtay",
    procedureRules: ["CMK"],
    commonCaseTypes: [
      "Kasten öldürme",
      "Uyuşturucu ticareti",
      "Cinsel istismar",
      "Yağma (gasp)",
      "Terör suçları",
      "Zimmet, rüşvet"
    ],
    practicalTips: [
      "Tutukluluğa itiraz aynı mahkemeden",
      "Tahliye talepleri dikkatle hazırlanmalı",
      "Tanık koruma talep edilebilir"
    ]
  },

  // İDARİ YARGI
  {
    id: "idare",
    name: "İdare Mahkemesi",
    description: "İdari işlem ve eylemlere karşı açılan davaları inceler.",
    category: "idari",
    legalBasis: ["2576 sayılı Bölge İdare Mahkemeleri, İdare Mahkemeleri ve Vergi Mahkemelerinin Kuruluşu ve Görevleri Hakkında Kanun"],
    jurisdiction: "İdari işlemlerin iptali, tam yargı davaları, idari sözleşmelerden doğan davalar",
    composition: "Tek hakimli veya heyet (konuya göre)",
    appealCourt: "Bölge İdare Mahkemesi → Danıştay",
    procedureRules: ["2577 sayılı İdari Yargılama Usulü Kanunu"],
    commonCaseTypes: [
      "Kamu görevlisi davaları",
      "Disiplin cezası iptali",
      "İmar davaları",
      "Kamulaştırma davaları",
      "İdari para cezası iptali",
      "Çevre ve ruhsat davaları"
    ],
    practicalTips: [
      "Dava açma süresi 60 gün (yazılı bildirimden)",
      "Yürütmenin durdurulması talebi kritik",
      "İdari başvuru (zorunlu ise) süreyi kesmez"
    ]
  },
  {
    id: "vergi",
    name: "Vergi Mahkemesi",
    description: "Vergi uyuşmazlıklarını çözümler.",
    category: "idari",
    legalBasis: ["2576 sayılı Kanun", "2577 sayılı İYUK"],
    jurisdiction: "Vergi, resim, harç ve benzeri mali yükümlere ilişkin davalar",
    composition: "Tek hakimli veya heyet (konuya göre)",
    appealCourt: "Bölge İdare Mahkemesi → Danıştay",
    procedureRules: ["2577 sayılı İYUK"],
    commonCaseTypes: [
      "Vergi tarhiyatının iptali",
      "Vergi cezası iptali",
      "Gümrük vergisi davaları",
      "Ödeme emri iptali",
      "İhtirazi kayıtla beyan sonrası davalar"
    ],
    practicalTips: [
      "Dava açma süresi 30 gün",
      "İhtirazi kayıt şerhi önemli",
      "Yürütmenin durdurulması için teminat gerekebilir"
    ]
  },
  {
    id: "danistay",
    name: "Danıştay",
    description: "İdari yargının en yüksek mahkemesi, bazı davalarda ilk ve son derece mahkemesi.",
    category: "idari",
    legalBasis: ["2575 sayılı Danıştay Kanunu"],
    jurisdiction: "Bakanlar Kurulu kararları, bakanlık düzenleyici işlemleri, üst kurullar, kamu ihaleleri (belirli tutarın üzeri)",
    composition: "Daireler (5 üye heyet), Genel Kurullar",
    appealCourt: "İdari Dava Daireleri Kurulu (kesin)",
    procedureRules: ["2577 sayılı İYUK"],
    commonCaseTypes: [
      "Tüzük ve yönetmelik iptali",
      "Bakanlar Kurulu kararları",
      "Düzenleyici işlemler",
      "Üst kurul kararları (BDDK, EPDK vb.)"
    ],
    practicalTips: [
      "İlk derece dava süresi 60 gün",
      "Temyiz süresi 30 gün",
      "Hukuki mütalaa hazırlanması faydalı"
    ]
  },

  // ANAYASA YARGISI
  {
    id: "anayasa",
    name: "Anayasa Mahkemesi",
    description: "Kanunların Anayasa'ya uygunluğunu denetler, bireysel başvuruları inceler.",
    category: "anayasa",
    legalBasis: ["Anayasa m.146-153", "6216 sayılı Anayasa Mahkemesinin Kuruluşu ve Yargılama Usulleri Hakkında Kanun"],
    jurisdiction: "Norm denetimi (soyut ve somut), bireysel başvuru, parti kapatma, Yüce Divan yargılaması",
    composition: "15 üye",
    appealCourt: "Kararları kesindir (AİHM'e bireysel başvuru mümkün)",
    procedureRules: ["6216 sayılı Kanun", "AYM İçtüzüğü"],
    commonCaseTypes: [
      "Bireysel başvuru (temel hak ihlalleri)",
      "İtiraz yolu (somut norm denetimi)",
      "İptal davası (soyut norm denetimi)",
      "Yüce Divan yargılaması"
    ],
    practicalTips: [
      "Bireysel başvuru: İç hukuk yolları tükendikten sonra 30 gün",
      "Adil yargılanma, mülkiyet, özgürlük hakları en sık başvuru konusu",
      "Başvuru formunun eksiksiz doldurulması kritik"
    ]
  }
];

// ============================================
// YETKİ KURALLARI
// ============================================
export const YETKI_KURALLARI: YetkiKurali[] = [
  {
    id: "genel_yetki",
    name: "Genel Yetkili Mahkeme (Davalının Yerleşim Yeri)",
    description: "Kural olarak davalının yerleşim yerindeki mahkeme yetkilidir.",
    type: "genel",
    legalBasis: "HMK m.6",
    applicableIn: ["Tüm hukuk davaları (özel yetki kuralı yoksa)"],
    exceptions: ["Kesin yetki kuralı olan davalar", "Özel yetki kuralı tercih edildiğinde"],
    howToDetermine: "Davalının nüfus kayıtlarındaki yerleşim yeri esas alınır. Tüzel kişilerde merkezin bulunduğu yer."
  },
  {
    id: "sozlesme_yetkisi",
    name: "Sözleşmeden Doğan Davalarda Yetki",
    description: "Sözleşmenin ifa edileceği yer mahkemesi de yetkilidir.",
    type: "ozel",
    legalBasis: "HMK m.10",
    applicableIn: ["Sözleşmeden doğan davalar", "Alacak davaları"],
    exceptions: ["Kesin yetki kuralı olan sözleşmeler (taşınmaz kirası)"],
    howToDetermine: "Sözleşmede kararlaştırılan veya borcun niteliğine göre belirlenen ifa yeri."
  },
  {
    id: "haksiz_fiil",
    name: "Haksız Fiilden Doğan Davalarda Yetki",
    description: "Haksız fiilin işlendiği, zararın meydana geldiği veya gelme ihtimali olan yer ya da zarar görenin yerleşim yeri mahkemesi yetkilidir.",
    type: "ozel",
    legalBasis: "HMK m.16",
    applicableIn: ["Tazminat davaları", "Haksız fiil davaları"],
    exceptions: [],
    howToDetermine: "Fiilin işlendiği yer, zararın meydana geldiği yer veya davacının yerleşim yerinden biri seçilebilir."
  },
  {
    id: "tasinmaz_kesin",
    name: "Taşınmaza İlişkin Davalarda Kesin Yetki",
    description: "Taşınmaza ilişkin davalar, taşınmazın bulunduğu yer mahkemesinde açılır.",
    type: "kesin",
    legalBasis: "HMK m.12",
    applicableIn: [
      "Tapu iptal ve tescil",
      "Mülkiyet davaları",
      "İrtifak hakkı davaları",
      "Taşınmaz kirası davaları",
      "İpotek davaları"
    ],
    exceptions: [],
    howToDetermine: "Taşınmazın tapuda kayıtlı olduğu yer. Birden fazla taşınmaz varsa, her biri için ayrı yer."
  },
  {
    id: "miras_kesin",
    name: "Miras Davalarında Kesin Yetki",
    description: "Miras sebebiyle istihkak, terekenin paylaşılması, miras ortaklığına ilişkin davalar murisin son yerleşim yerinde açılır.",
    type: "kesin",
    legalBasis: "HMK m.11",
    applicableIn: [
      "Mirasçılık davası",
      "Terekenin paylaşılması",
      "Vasiyetnamenin iptali",
      "Miras sebebiyle istihkak"
    ],
    exceptions: ["Terekedeki taşınmazlar için ayrıca HMK m.12 uygulanabilir"],
    howToDetermine: "Murisin ölüm tarihindeki yerleşim yeri esas alınır."
  },
  {
    id: "is_yetki",
    name: "İş Davalarında Yetki",
    description: "İş davalarında davalının yerleşim yeri veya işin yapıldığı yer mahkemesi yetkilidir.",
    type: "ozel",
    legalBasis: "7036 sayılı İş Mahkemeleri Kanunu m.6",
    applicableIn: ["İş davaları", "Hizmet tespiti davaları"],
    exceptions: [],
    howToDetermine: "İşin fiilen yapıldığı yer veya davalı işverenin yerleşim yeri seçilebilir. Yetki sözleşmesi yapılamaz."
  },
  {
    id: "tuketici_yetki",
    name: "Tüketici Davalarında Yetki",
    description: "Tüketici davaları, tüketicinin yerleşim yerinde de açılabilir.",
    type: "ozel",
    legalBasis: "6502 sayılı TKHK m.73/5",
    applicableIn: ["Tüketici davaları", "Tüketici hakem heyeti kararlarına itiraz"],
    exceptions: [],
    howToDetermine: "Tüketicinin yerleşim yeri, davalının yerleşim yeri veya sözleşmenin yapıldığı/ifa edildiği yer."
  },
  {
    id: "idari_yetki",
    name: "İdari Davalarda Yetki",
    description: "İdari davalar, işlemi yapan idari merciin bulunduğu yerdeki idare mahkemesinde açılır.",
    type: "genel",
    legalBasis: "2577 sayılı İYUK m.32-37",
    applicableIn: ["İptal davaları", "Tam yargı davaları"],
    exceptions: [
      "Kamu görevlileri: Görevin yapıldığı yer",
      "Taşınmaz davaları: Taşınmazın bulunduğu yer",
      "Vergi davaları: Vergi/resmin tarh edildiği yer"
    ],
    howToDetermine: "İşlemi tesis eden idari makamın bulunduğu yerdeki idare mahkemesi."
  }
];

// ============================================
// TEMYİZ VE İSTİNAF BİLGİLERİ
// ============================================
export const TEMYIZ_ISTINAF: TemyizIstinaf[] = [
  {
    id: "hukuk_genel",
    caseType: "Hukuk Davaları (Genel)",
    firstInstance: "Asliye Hukuk / Sulh Hukuk Mahkemesi",
    appealCourt: "Bölge Adliye Mahkemesi (İstinaf)",
    highCourt: "Yargıtay (Temyiz)",
    appealDeadline: "İstinaf: 2 hafta, Temyiz: 2 hafta",
    appealConditions: [
      "İstinaf: Miktar/değer sınırı 28.250 TL üzeri (2024)",
      "Temyiz: Miktar/değer sınırı 340.640 TL üzeri (2024)",
      "Kesin nitelikte kararlar istinaf edilemez"
    ],
    practicalTips: [
      "Tebliğ tarihinden itibaren süre işler",
      "İstinaf dilekçesi ilk derece mahkemesine verilir",
      "Temyiz dilekçesi BAM'a verilir"
    ]
  },
  {
    id: "ceza_genel",
    caseType: "Ceza Davaları",
    firstInstance: "Asliye Ceza / Ağır Ceza Mahkemesi",
    appealCourt: "Bölge Adliye Mahkemesi (İstinaf)",
    highCourt: "Yargıtay (Temyiz)",
    appealDeadline: "İstinaf: 7 gün, Temyiz: 15 gün",
    appealConditions: [
      "İstinaf: 3.000 TL dahil adli para cezası veya üzeri",
      "Temyiz: 5 yıldan fazla hapis cezası içeren kararlar",
      "CMK m.286'daki kesinlik halleri hariç"
    ],
    practicalTips: [
      "Süre tefhimle (duruşmada açıklama) başlar",
      "Tutuklu sanık için süre tebliğle başlar",
      "Ek süre için mazeret bildirimi yapılabilir"
    ]
  },
  {
    id: "idari_genel",
    caseType: "İdari Davalar",
    firstInstance: "İdare Mahkemesi / Vergi Mahkemesi",
    appealCourt: "Bölge İdare Mahkemesi (İstinaf)",
    highCourt: "Danıştay (Temyiz)",
    appealDeadline: "İstinaf: 30 gün, Temyiz: 30 gün",
    appealConditions: [
      "İstinaf: Tüm kararlar için açık",
      "Temyiz: Konusuna göre kesinlik sınırları değişir",
      "Yürütmenin durdurulması kararlarına karşı 7 gün içinde itiraz"
    ],
    practicalTips: [
      "Tebliğden itibaren süre başlar",
      "Bölge İdare Mahkemesi kararları çoğunlukla kesin",
      "Danıştay temyizi sınırlı"
    ]
  }
];

// ============================================
// DAVA AÇMA SÜREÇLERİ
// ============================================
export const DAVA_SURECLERI: DavaAcmaSureci[] = [
  {
    id: "hukuk_dava",
    name: "Hukuk Davası Açma Süreci",
    steps: [
      { order: 1, name: "Dava dilekçesinin hazırlanması", description: "HMK m.119'a uygun dilekçe hazırlama" },
      { order: 2, name: "Harç ve gider avansı yatırma", description: "Mahkeme veznesine harç ve gider avansı ödeme" },
      { order: 3, name: "Dilekçenin mahkemeye sunulması", description: "UYAP üzerinden veya fiziken" },
      { order: 4, name: "Tensip zaptı", description: "Mahkemenin davayı ele alması, taraflara tebligat" },
      { order: 5, name: "Cevap dilekçesi", description: "Davalının 2 hafta içinde cevap vermesi" },
      { order: 6, name: "Ön inceleme", description: "Sulh, dava şartları, ilk itirazlar" },
      { order: 7, name: "Tahkikat", description: "Delillerin incelenmesi, tanık dinleme, bilirkişi" },
      { order: 8, name: "Sözlü yargılama ve hüküm", description: "Son beyanlar ve karar" }
    ],
    requiredDocuments: [
      "Dava dilekçesi (2 nüsha + davalı sayısı kadar)",
      "Vekaletname (avukat ile temsilde)",
      "Kimlik fotokopisi",
      "Delil listesi ve deliller"
    ],
    estimatedDuration: "6 ay - 2 yıl (konuya göre değişir)",
    costs: [
      { name: "Başvurma harcı", amount: "Maktu (492 sayılı Kanun)" },
      { name: "Nispi karar harcı", amount: "Dava değerinin binde 68,31'i" },
      { name: "Gider avansı", amount: "Taraf ve tanık sayısına göre" },
      { name: "Bilirkişi ücreti", amount: "Değişken" }
    ]
  },
  {
    id: "idari_dava",
    name: "İdari Dava Açma Süreci",
    steps: [
      { order: 1, name: "İdari başvuru (zorunlu ise)", description: "Üst makama itiraz (bazı durumlarda zorunlu)" },
      { order: 2, name: "Dava dilekçesinin hazırlanması", description: "İYUK m.3'e uygun" },
      { order: 3, name: "Harç yatırma", description: "Peşin harç ödeme" },
      { order: 4, name: "Dilekçenin mahkemeye sunulması", description: "60 gün içinde" },
      { order: 5, name: "Yürütmenin durdurulması talebi", description: "Gerekli ise acil karar" },
      { order: 6, name: "Savunma", description: "İdarenin 30 gün içinde savunması" },
      { order: 7, name: "İnceleme ve karar", description: "Dosya üzerinden veya duruşmalı" }
    ],
    requiredDocuments: [
      "Dava dilekçesi",
      "Dava konusu idari işlemin örneği",
      "Tebliğ belgesi",
      "Vekaletname",
      "Deliller"
    ],
    estimatedDuration: "6 ay - 1.5 yıl",
    costs: [
      { name: "Başvurma harcı", amount: "Maktu" },
      { name: "Karar harcı", amount: "Maktu (idari davalarda)" },
      { name: "Posta giderleri", amount: "Avans olarak" }
    ]
  }
];

// ============================================
// SIK SORULAN SORULAR
// ============================================
export const MAHKEME_FAQ = [
  {
    question: "Hangi mahkemede dava açmalıyım?",
    answer: "Görevli mahkeme, davanın konusuna göre belirlenir. Genel olarak: Ticari davalar → Asliye Ticaret, iş davaları → İş Mahkemesi, boşanma → Aile Mahkemesi, kira → Sulh Hukuk, idari işlemler → İdare Mahkemesi. Şüphe durumunda asliye hukuk mahkemesi genel görevlidir."
  },
  {
    question: "Yetkili mahkeme nasıl belirlenir?",
    answer: "Genel kural: Davalının yerleşim yeri mahkemesi yetkilidir (HMK m.6). Ancak sözleşme ifa yeri, haksız fiilin işlendiği yer, taşınmazın bulunduğu yer gibi özel yetki kuralları da mevcuttur. Taşınmaz ve miras davalarında kesin yetki kuralı vardır."
  },
  {
    question: "İstinaf ve temyiz arasındaki fark nedir?",
    answer: "İstinaf (2. derece): Kararın hem maddi hem hukuki yönden yeniden incelenmesi. Temyiz: Sadece hukuki denetim (kural olarak), maddi vakıalar yeniden incelenmez. İstinaf → Bölge Adliye/İdare Mahkemesi, Temyiz → Yargıtay/Danıştay."
  },
  {
    question: "Dava açma süreleri nelerdir?",
    answer: "Hukuk davalarında genel zamanaşımı 10 yıl (TBK m.146). Özel süreler: Tazminat 2 yıl (öğrenmeden), işe iade 1 ay, iş alacakları 5 yıl. İdari davalar: 60 gün. Vergi davaları: 30 gün. Ceza zamanaşımı suça göre değişir."
  },
  {
    question: "Arabuluculuk zorunlu mu?",
    answer: "Belirli dava türlerinde zorunludur: İş davaları (mutlaka), ticari davalar (TTK kapsamı), tüketici davaları (01.01.2024'ten itibaren). Aile hukukunda zorunlu değil. Arabuluculuk son tutanağı dava dilekçesine eklenmeli."
  },
  {
    question: "Mahkeme harçları ne kadar?",
    answer: "Harçlar 492 sayılı Harçlar Kanunu'na göre belirlenir. Başvurma harcı maktu, karar harcı ise davaya göre maktu veya nispi olabilir. Nispi harç dava değerinin binde 68,31'i kadardır. Harç makbuzları UYAP veya vezne üzerinden alınır."
  },
  {
    question: "Avukat tutmak zorunlu mu?",
    answer: "Hukuk davalarının çoğunda zorunlu değil, taraf bizzat takip edebilir. Ancak: Ceza davalarında müdafi zorunlu olabilir (ağır suçlar, yaş durumu). Anayasa Mahkemesi bireysel başvuruda avukat zorunlu değil ama tavsiye edilir."
  }
];

// Arama fonksiyonları
export function searchMahkemeTuru(keyword: string): MahkemeTuru[] {
  const normalized = keyword.toLowerCase();
  return MAHKEME_TURLERI.filter(
    m => m.name.toLowerCase().includes(normalized) ||
         m.description.toLowerCase().includes(normalized) ||
         m.jurisdiction.toLowerCase().includes(normalized)
  );
}

export function getYetkiKurali(type: string): YetkiKurali[] {
  return YETKI_KURALLARI.filter(y => y.type === type || y.name.toLowerCase().includes(type.toLowerCase()));
}

export function getMahkemeFAQ(keyword: string) {
  const normalized = keyword.toLowerCase();
  return MAHKEME_FAQ.filter(
    f => f.question.toLowerCase().includes(normalized) ||
         f.answer.toLowerCase().includes(normalized)
  );
}

export function findCompetentCourt(caseType: string): MahkemeTuru | undefined {
  const caseTypeLower = caseType.toLowerCase();
  
  // Anahtar kelime eşleştirmesi
  const mappings: Record<string, string> = {
    'boşanma': 'aile',
    'velayet': 'aile',
    'nafaka': 'aile',
    'kira': 'sulh_hukuk',
    'tahliye': 'sulh_hukuk',
    'iş': 'is',
    'işçi': 'is',
    'tazminat': 'asliye_hukuk',
    'alacak': 'asliye_hukuk',
    'ticaret': 'asliye_ticaret',
    'şirket': 'asliye_ticaret',
    'iflas': 'asliye_ticaret',
    'tüketici': 'tuketici',
    'icra': 'icra_hukuk',
    'idari': 'idare',
    'iptal': 'idare',
    'vergi': 'vergi',
    'ceza': 'asliye_ceza',
    'suç': 'asliye_ceza',
    'öldürme': 'agir_ceza',
    'uyuşturucu': 'agir_ceza'
  };

  for (const [keyword, mahkemeId] of Object.entries(mappings)) {
    if (caseTypeLower.includes(keyword)) {
      return MAHKEME_TURLERI.find(m => m.id === mahkemeId);
    }
  }

  // Varsayılan olarak asliye hukuk
  return MAHKEME_TURLERI.find(m => m.id === 'asliye_hukuk');
}
