/**
 * İcra ve İflas Hukuku Veritabanı
 * 
 * 2004 sayılı İcra ve İflas Kanunu ve ilgili düzenlemeler
 * Alacak takibi, haciz, iflas prosedürleri
 */

export interface IcraTakipTuru {
  id: string;
  name: string;
  description: string;
  legalBasis: string[];
  requirements: string[];
  process: ProcessStep[];
  timeframes: Timeframe[];
  fees: FeeInfo[];
  practicalTips: string[];
}

export interface ProcessStep {
  order: number;
  name: string;
  description: string;
  duration?: string;
  documents?: string[];
}

export interface Timeframe {
  name: string;
  duration: string;
  startPoint: string;
  consequences: string;
}

export interface FeeInfo {
  name: string;
  amount: string;
  basis: string;
}

export interface HacizTuru {
  id: string;
  name: string;
  description: string;
  applicableTo: string[];
  exemptions: string[];
  process: string[];
  legalBasis: string[];
}

export interface IflasUsulu {
  id: string;
  name: string;
  description: string;
  conditions: string[];
  process: ProcessStep[];
  effects: string[];
  legalBasis: string[];
}

// ============================================
// İCRA TAKİP TÜRLERİ
// ============================================
export const ICRA_TAKIP_TURLERI: IcraTakipTuru[] = [
  {
    id: "ilamsiz_takip",
    name: "İlamsız Takip (Genel Haciz Yolu)",
    description: "Mahkeme kararı olmadan, para ve teminat alacakları için başlatılan icra takibi",
    legalBasis: ["İİK m.42-72"],
    requirements: [
      "Alacağın para veya teminat alacağı olması",
      "Alacağın muaccel (vadesi gelmiş) olması",
      "Borçlunun belli olması"
    ],
    process: [
      {
        order: 1,
        name: "Takip Talebi",
        description: "Alacaklının icra dairesine başvurusu",
        documents: ["Takip talep formu", "Kimlik fotokopisi", "Varsa sözleşme"]
      },
      {
        order: 2,
        name: "Ödeme Emri Tebliği",
        description: "Borçluya ödeme emrinin tebliğ edilmesi",
        duration: "7-15 gün (tebligat süresi)"
      },
      {
        order: 3,
        name: "İtiraz Süresi",
        description: "Borçlunun itiraz hakkını kullanabileceği süre",
        duration: "7 gün (tebliğden itibaren)"
      },
      {
        order: 4,
        name: "Kesinleşme veya İtirazın Kaldırılması",
        description: "İtiraz yoksa takip kesinleşir, varsa itirazın kaldırılması davası",
        duration: "İtiraz yoksa 7 gün sonra kesinleşir"
      },
      {
        order: 5,
        name: "Haciz İşlemleri",
        description: "Borçlunun mallarına haciz konulması",
        documents: ["Haciz talep dilekçesi"]
      },
      {
        order: 6,
        name: "Satış ve Tahsilat",
        description: "Haczedilen malların satışı ve alacağın tahsili"
      }
    ],
    timeframes: [
      {
        name: "İtiraz Süresi",
        duration: "7 gün",
        startPoint: "Ödeme emrinin tebliğinden itibaren",
        consequences: "Süresinde itiraz edilmezse takip kesinleşir"
      },
      {
        name: "İtirazın Kaldırılması Davası",
        duration: "6 ay",
        startPoint: "İtirazın tebliğinden itibaren",
        consequences: "Süre geçerse takip düşer"
      },
      {
        name: "Haciz Talep Süresi",
        duration: "1 yıl",
        startPoint: "Takibin kesinleşmesinden itibaren",
        consequences: "Süre geçerse dosya işlemden kaldırılır"
      }
    ],
    fees: [
      {
        name: "Başvuru Harcı",
        amount: "Maktu (yıllık güncellenir)",
        basis: "Harçlar Kanunu"
      },
      {
        name: "Peşin Harç",
        amount: "Takip tutarının binde 4,55'i",
        basis: "Harçlar Kanunu"
      },
      {
        name: "Tahsil Harcı",
        amount: "Tahsil edilen tutarın %4,55'i",
        basis: "Harçlar Kanunu"
      }
    ],
    practicalTips: [
      "Borçlunun mal varlığını önceden araştırın",
      "Tebligat adresinin doğruluğunu kontrol edin",
      "İtiraz ihtimaline karşı delillerinizi hazır bulundurun",
      "Haciz talebini zamanında yapın (1 yıl)",
      "Birden fazla borçlu varsa müteselsil sorumluluk belirtin"
    ]
  },
  {
    id: "ilamli_takip",
    name: "İlamlı Takip",
    description: "Mahkeme kararı (ilam) veya ilam niteliğindeki belgeye dayanan icra takibi",
    legalBasis: ["İİK m.24-41"],
    requirements: [
      "Kesinleşmiş mahkeme kararı veya ilam niteliğinde belge",
      "İlamın icra edilebilir nitelikte olması",
      "Zamanaşımı süresinin dolmamış olması (10 yıl)"
    ],
    process: [
      {
        order: 1,
        name: "Takip Talebi",
        description: "İlam ile birlikte icra dairesine başvuru",
        documents: ["İlam sureti", "Kesinleşme şerhi", "Takip talep formu"]
      },
      {
        order: 2,
        name: "İcra Emri Tebliği",
        description: "Borçluya icra emrinin tebliği",
        duration: "7-15 gün"
      },
      {
        order: 3,
        name: "Ödeme/İfa Süresi",
        description: "Borçlunun borcunu ödemesi veya ifa etmesi için verilen süre",
        duration: "7 gün (para borcu) / İlamda belirtilen süre"
      },
      {
        order: 4,
        name: "Cebri İcra",
        description: "Borç ödenmezse haciz ve satış işlemleri"
      }
    ],
    timeframes: [
      {
        name: "İcra Emrine İtiraz",
        duration: "7 gün",
        startPoint: "İcra emrinin tebliğinden itibaren",
        consequences: "Sadece borcun ödendiği, zamanaşımı gibi dar kapsamlı itiraz"
      },
      {
        name: "İlamın Zamanaşımı",
        duration: "10 yıl",
        startPoint: "İlamın kesinleşmesinden itibaren",
        consequences: "Süre geçerse ilam icra edilemez"
      }
    ],
    fees: [
      {
        name: "Başvuru Harcı",
        amount: "Maktu",
        basis: "Harçlar Kanunu"
      },
      {
        name: "Tahsil Harcı",
        amount: "Tahsil edilen tutarın %2,27'si",
        basis: "Harçlar Kanunu (ilamsız takibe göre düşük)"
      }
    ],
    practicalTips: [
      "İlamın kesinleşme şerhini mutlaka alın",
      "Faiz hesabını doğru yapın (ilam tarihinden itibaren)",
      "Taşınmaz teslimi davalarında tahliye için ayrı harç gerekir",
      "Nafaka ilamlarında aylık taksitler için ayrı takip açılabilir"
    ]
  },
  {
    id: "kambiyo_takip",
    name: "Kambiyo Senetlerine Özgü Haciz Yolu",
    description: "Çek, bono ve poliçe gibi kambiyo senetlerine dayanan özel takip yolu",
    legalBasis: ["İİK m.167-176"],
    requirements: [
      "Geçerli bir kambiyo senedi (çek, bono, poliçe)",
      "Senedin vadesinin gelmiş olması",
      "Protestonun çekilmiş olması (gerekli hallerde)"
    ],
    process: [
      {
        order: 1,
        name: "Takip Talebi",
        description: "Kambiyo senedi ile icra dairesine başvuru",
        documents: ["Orijinal senet", "Takip talep formu", "Varsa protesto belgesi"]
      },
      {
        order: 2,
        name: "Ödeme Emri Tebliği",
        description: "Borçluya 10 örnek ödeme emrinin tebliği",
        duration: "7-15 gün"
      },
      {
        order: 3,
        name: "İtiraz/Şikayet Süresi",
        description: "Borçlunun itiraz veya şikayette bulunabileceği süre",
        duration: "5 gün (itiraz), 7 gün (şikayet)"
      },
      {
        order: 4,
        name: "Haciz İşlemleri",
        description: "İtiraz yoksa veya kaldırılırsa haciz"
      }
    ],
    timeframes: [
      {
        name: "İtiraz Süresi",
        duration: "5 gün",
        startPoint: "Ödeme emrinin tebliğinden itibaren",
        consequences: "Genel haciz yoluna göre daha kısa!"
      },
      {
        name: "Şikayet Süresi",
        duration: "7 gün",
        startPoint: "Ödeme emrinin tebliğinden itibaren",
        consequences: "Takibin iptalini gerektirir"
      },
      {
        name: "Çek İbraz Süresi",
        duration: "10 gün (aynı il) / 30 gün (farklı il)",
        startPoint: "Keşide tarihinden itibaren",
        consequences: "Süre geçerse kambiyo vasfı kaybolabilir"
      }
    ],
    fees: [
      {
        name: "Başvuru Harcı",
        amount: "Maktu",
        basis: "Harçlar Kanunu"
      },
      {
        name: "Peşin Harç",
        amount: "Takip tutarının binde 4,55'i",
        basis: "Harçlar Kanunu"
      }
    ],
    practicalTips: [
      "Senedin orijinalini mutlaka icra dosyasına sunun",
      "Çeklerde ibraz süresine dikkat edin",
      "Karşılıksız çek için ayrıca ceza davası açılabilir",
      "Bononun arkasına ciro silsilesi kontrol edilmeli",
      "5 günlük itiraz süresini asla kaçırmayın (borçlu iseniz)"
    ]
  },
  {
    id: "rehinin_paraya_cevrilmesi",
    name: "Rehnin Paraya Çevrilmesi Yoluyla Takip",
    description: "Taşınır veya taşınmaz rehni ile teminat altına alınmış alacaklar için takip",
    legalBasis: ["İİK m.145-153"],
    requirements: [
      "Geçerli bir rehin hakkının varlığı",
      "Alacağın muaccel olması",
      "Rehin konusu malın belirli olması"
    ],
    process: [
      {
        order: 1,
        name: "Takip Talebi",
        description: "Rehin belgesi ile icra dairesine başvuru",
        documents: ["Rehin sözleşmesi/Tapu kaydı", "Takip talep formu"]
      },
      {
        order: 2,
        name: "İcra/Ödeme Emri Tebliği",
        description: "Borçluya ve varsa rehin verene tebligat"
      },
      {
        order: 3,
        name: "Satış Talebi",
        description: "Rehinli malın satışının talep edilmesi"
      },
      {
        order: 4,
        name: "Kıymet Takdiri ve Satış",
        description: "Malın değerinin belirlenmesi ve ihale ile satışı"
      }
    ],
    timeframes: [
      {
        name: "Satış Talep Süresi",
        duration: "2 yıl (taşınmaz), 1 yıl (taşınır)",
        startPoint: "Takibin kesinleşmesinden itibaren",
        consequences: "Rehin hakkı düşmez ama takip düşer"
      }
    ],
    fees: [
      {
        name: "Satış Harcı",
        amount: "Satış bedelinin %1,13'ü",
        basis: "Harçlar Kanunu"
      }
    ],
    practicalTips: [
      "İpotek alacaklısı önce rehnin paraya çevrilmesi yoluna başvurmalı",
      "Üst sınır ipoteğinde limit dahilinde takip yapılabilir",
      "Taşınmaz satışında ilan süreleri uzundur (1 ay)",
      "Birinci sıradaki alacaklının önceliği vardır"
    ]
  },
  {
    id: "kiralanan_tahliye",
    name: "Kiralananın Tahliyesi (İcra Yoluyla)",
    description: "Kira sözleşmesine dayanan tahliye ve kira alacağı takibi",
    legalBasis: ["İİK m.269-276"],
    requirements: [
      "Geçerli kira sözleşmesi",
      "Kira bedelinin ödenmemesi veya sürenin sona ermesi",
      "Kiralananın belirli olması"
    ],
    process: [
      {
        order: 1,
        name: "Tahliye Talepli Takip",
        description: "Kira alacağı ve tahliye talepli takip başlatma",
        documents: ["Kira sözleşmesi", "Takip talep formu"]
      },
      {
        order: 2,
        name: "Ödeme/Tahliye Emri",
        description: "Kiracıya ödeme ve tahliye emri tebliği"
      },
      {
        order: 3,
        name: "30 Günlük Ödeme Süresi",
        description: "Kiracının kira borcunu ödemesi için süre",
        duration: "30 gün"
      },
      {
        order: 4,
        name: "Tahliye Kararı",
        description: "Ödeme yapılmazsa mahkemeden tahliye kararı"
      },
      {
        order: 5,
        name: "Cebri Tahliye",
        description: "İcra marifetiyle tahliye işlemi"
      }
    ],
    timeframes: [
      {
        name: "Ödeme Süresi (Konut/İşyeri)",
        duration: "30 gün",
        startPoint: "Ödeme emrinin tebliğinden itibaren",
        consequences: "Ödeme yapılmazsa tahliye davası açılabilir"
      },
      {
        name: "İtiraz Süresi",
        duration: "7 gün",
        startPoint: "Ödeme emrinin tebliğinden itibaren",
        consequences: "İtiraz tahliyeyi durdurur"
      }
    ],
    fees: [
      {
        name: "Tahliye Harcı",
        amount: "6 aylık kira bedeli üzerinden",
        basis: "Harçlar Kanunu"
      }
    ],
    practicalTips: [
      "Kira sözleşmesinin yazılı olması ispat kolaylığı sağlar",
      "2 haklı ihtar göndermek tahliye nedeni olabilir (TBK m.352)",
      "Tahliye kararı olmadan zorla tahliye yapılamaz",
      "Sözleşme süresi bitiminde de tahliye talep edilebilir"
    ]
  }
];

// ============================================
// HACİZ TÜRLERİ
// ============================================
export const HACIZ_TURLERI: HacizTuru[] = [
  {
    id: "menkul_haczi",
    name: "Menkul (Taşınır) Haczi",
    description: "Borçlunun taşınır mallarına uygulanan haciz",
    applicableTo: [
      "Ev eşyaları",
      "Araçlar",
      "Makineler",
      "Ticari mal stokları",
      "Değerli eşyalar"
    ],
    exemptions: [
      "Borçlu ve ailesinin yaşamı için zorunlu eşyalar",
      "Çalışma araçları (meslek icabı)",
      "Öğrenci için gerekli kitap ve araçlar",
      "Aile fotoğrafları, nişanlar",
      "Borçlunun haline uygun elbiseler"
    ],
    process: [
      "Haciz talebi yapılır",
      "İcra memuru borçlunun adresine gider",
      "Mallar tespit edilir ve kıymet takdiri yapılır",
      "Haciz tutanağı düzenlenir",
      "Mallar muhafaza altına alınır veya yediemin bırakılır"
    ],
    legalBasis: ["İİK m.78-99", "İİK m.82 (haczedilmezlik)"]
  },
  {
    id: "gayrimenkul_haczi",
    name: "Gayrimenkul (Taşınmaz) Haczi",
    description: "Borçlunun taşınmaz mallarına uygulanan haciz",
    applicableTo: [
      "Arsalar",
      "Binalar/Daireler",
      "Tarım arazileri",
      "Ticari taşınmazlar"
    ],
    exemptions: [
      "Haline münasip ev (meskeniyet iddiası ile)",
      "Aile konutu (TMK m.194 sınırları dahilinde)"
    ],
    process: [
      "Haciz talebi yapılır",
      "Tapu Müdürlüğüne haciz şerhi yazısı gönderilir",
      "Haciz şerhi tapu kaydına işlenir",
      "Kıymet takdiri için bilirkişi atanır",
      "Satış aşamasına geçilir"
    ],
    legalBasis: ["İİK m.78-99", "İİK m.82/12 (haline münasip ev)"]
  },
  {
    id: "maas_haczi",
    name: "Maaş Haczi",
    description: "Borçlunun maaşından kesinti yapılması",
    applicableTo: [
      "Ücret/Maaş",
      "Emekli aylığı",
      "İkramiye",
      "Prim ve komisyon"
    ],
    exemptions: [
      "Maaşın dörtte birinden fazlası haczedilemez (genel kural)",
      "Nafaka alacaklarında bu sınır uygulanmaz",
      "Asgari ücretin altında kalan kısım haczedilemez"
    ],
    process: [
      "Haciz yazısı işverene/kuruma gönderilir",
      "Her ay maaştan 1/4 kesinti yapılır",
      "Kesinti tutarları icra dairesine yatırılır",
      "Borç tamamen ödenene kadar devam eder"
    ],
    legalBasis: ["İİK m.83", "İİK m.83/a (kısmen haczi caiz olmayan haklar)"]
  },
  {
    id: "banka_haczi",
    name: "Banka Hesabı Haczi",
    description: "Borçlunun banka hesaplarına bloke konulması",
    applicableTo: [
      "Vadesiz hesaplar",
      "Vadeli hesaplar",
      "Döviz hesapları",
      "Yatırım hesapları"
    ],
    exemptions: [
      "Asgari ücretin aylık tutarı kadar kısmı haczedilemez",
      "SGK aylıklarının 1/4'ünden fazlası haczedilemez",
      "Nafaka yatırılan hesap (belirli koşullarda)"
    ],
    process: [
      "Haciz ihbarnamesi bankalara gönderilir (İİK m.89)",
      "Banka hesap bilgilerini ve bakiyeyi bildirir",
      "Hesaplara bloke konulur",
      "7 gün içinde itiraz edilmezse para icra dosyasına aktarılır"
    ],
    legalBasis: ["İİK m.89", "İİK m.83"]
  },
  {
    id: "ihtiyati_haciz",
    name: "İhtiyati Haciz",
    description: "Alacağı tehlikede olan alacaklının önceden tedbir alması",
    applicableTo: [
      "Henüz vadesi gelmemiş alacaklar",
      "Borçlunun kaçma ihtimali olan durumlar",
      "Mal kaçırma riski bulunan haller"
    ],
    exemptions: [],
    process: [
      "Mahkemeden ihtiyati haciz kararı alınır",
      "Teminat yatırılır (genellikle %15)",
      "Haciz derhal uygulanır",
      "7 gün içinde icra/dava takibi başlatılmalıdır"
    ],
    legalBasis: ["İİK m.257-268"]
  }
];

// ============================================
// İFLAS USULLERİ
// ============================================
export const IFLAS_USULLERI: IflasUsulu[] = [
  {
    id: "adi_iflas",
    name: "Adi (Takipli) İflas",
    description: "İcra takibi sonucu borçlunun iflas etmesi",
    conditions: [
      "Borçlunun tacir olması",
      "İcra takibinin kesinleşmiş olması",
      "Borcun ödenmemiş olması"
    ],
    process: [
      {
        order: 1,
        name: "İcra Takibi",
        description: "Önce normal icra takibi yapılır"
      },
      {
        order: 2,
        name: "İflas Ödeme Emri",
        description: "Borç ödenmezse iflas yoluyla takibe dönülür"
      },
      {
        order: 3,
        name: "İflas Davası",
        description: "Asliye Ticaret Mahkemesinde iflas davası açılır"
      },
      {
        order: 4,
        name: "İflas Kararı",
        description: "Mahkeme iflasa karar verir"
      },
      {
        order: 5,
        name: "İflas Masası Oluşumu",
        description: "Borçlunun malvarlığı iflas masasına girer"
      }
    ],
    effects: [
      "Borçlunun tasarruf yetkisi sona erer",
      "Tüm takipler durur",
      "Vadesi gelmemiş borçlar muaccel olur",
      "Faiz işlemeye devam eder (iflas tarihindeki oran)"
    ],
    legalBasis: ["İİK m.171-176", "TTK m.18 (tacir tanımı)"]
  },
  {
    id: "dogrudan_iflas",
    name: "Doğrudan (Takipsiz) İflas",
    description: "İcra takibi yapılmadan doğrudan iflas talebinde bulunulması",
    conditions: [
      "Borçlunun tacir olması",
      "Borçlunun yerleşim yerinin belli olmaması",
      "Borçlunun kaçması veya alacaklıları zarara uğratacak işlemler yapması",
      "Borçlunun aczini ilan etmesi (İİK m.178)"
    ],
    process: [
      {
        order: 1,
        name: "Doğrudan Dava",
        description: "Asliye Ticaret Mahkemesinde iflas davası açılır"
      },
      {
        order: 2,
        name: "Teminat",
        description: "Alacaklı teminat yatırır"
      },
      {
        order: 3,
        name: "İflas Kararı",
        description: "Koşullar varsa mahkeme iflasa karar verir"
      }
    ],
    effects: [
      "Derhal iflas masası oluşur",
      "Tüm takipler durur",
      "Alacaklılar sıra cetveline göre ödeme alır"
    ],
    legalBasis: ["İİK m.177-178"]
  },
  {
    id: "iflas_erteleme",
    name: "İflasın Ertelenmesi / Konkordato",
    description: "Borçlunun mali durumunun iyileştirilmesi için verilen süre",
    conditions: [
      "Borca batıklık durumu",
      "İyileştirme projesinin sunulması",
      "Alacaklıların çoğunluğunun onayı (konkordato)",
      "Mahkemenin uygun görmesi"
    ],
    process: [
      {
        order: 1,
        name: "Başvuru",
        description: "Borçlu veya alacaklı mahkemeye başvurur"
      },
      {
        order: 2,
        name: "Geçici Mühlet",
        description: "3 aylık geçici koruma süresi verilir"
      },
      {
        order: 3,
        name: "Kesin Mühlet",
        description: "1 yıllık (+6 ay uzatma) kesin mühlet"
      },
      {
        order: 4,
        name: "Konkordato Projesi",
        description: "Ödeme planı hazırlanır"
      },
      {
        order: 5,
        name: "Alacaklılar Toplantısı",
        description: "Alacaklılar projeyi oylar"
      },
      {
        order: 6,
        name: "Tasdik/Red",
        description: "Mahkeme konkordatoyu tasdik eder veya reddeder"
      }
    ],
    effects: [
      "Takipler durur",
      "İhtiyati hacizler uygulanamaz",
      "Takas yapılamaz",
      "Borçlu işletmeyi yönetmeye devam eder (komiser denetiminde)"
    ],
    legalBasis: ["İİK m.285-309/l (Konkordato)"]
  }
];

// ============================================
// ÖNEMLİ İCRA HESAPLAMALARI
// ============================================
export interface IcraHesaplama {
  id: string;
  name: string;
  formula: string;
  description: string;
  example: string;
}

export const ICRA_HESAPLAMALARI: IcraHesaplama[] = [
  {
    id: "faiz_hesaplama",
    name: "İcra Dosyasında Faiz Hesaplama",
    formula: "Faiz = Anapara × Faiz Oranı × Gün Sayısı / 365",
    description: "İcra takibinde faiz, takip tarihinden itibaren işler. Yasal faiz oranı yıllık olarak belirlenir.",
    example: "100.000 TL anapara, %24 yasal faiz, 180 gün: 100.000 × 0.24 × 180/365 = 11.835,62 TL faiz"
  },
  {
    id: "tahsil_harci",
    name: "Tahsil Harcı Hesaplama",
    formula: "Tahsil Harcı = Tahsil Edilen Tutar × %4,55 (ilamsız) veya %2,27 (ilamlı)",
    description: "Tahsil harcı, icra dairesine yatırılan tutar üzerinden hesaplanır.",
    example: "50.000 TL tahsilat (ilamsız): 50.000 × 0.0455 = 2.275 TL harç"
  },
  {
    id: "satis_harci",
    name: "Satış Harcı Hesaplama",
    formula: "Satış Harcı = Satış Bedeli × %1,13",
    description: "Haczedilen malların satışında alınan harç.",
    example: "200.000 TL'ye satılan araç: 200.000 × 0.0113 = 2.260 TL harç"
  },
  {
    id: "vekalet_ucreti",
    name: "İcra Vekalet Ücreti",
    formula: "AAÜT'ye göre takip tutarının %'si veya maktu tutar",
    description: "Avukatın icra takibindeki vekalet ücreti.",
    example: "100.000 TL takipte vekalet ücreti: AAÜT tarifesine göre (2024: %12 ile asgari 11.000 TL)"
  }
];

// ============================================
// SIK SORULAN SORULAR
// ============================================
export const ICRA_FAQ = [
  {
    question: "Maaşımın ne kadarı haczedilebilir?",
    answer: "Maaşınızın en fazla 1/4'ü haczedilebilir. Ancak asgari ücretin altında kalan kısım hiçbir şekilde haczedilemez. Nafaka borçlarında bu sınır uygulanmaz, maaşın tamamından kesinti yapılabilir."
  },
  {
    question: "Evdeki eşyalar haczedilebilir mi?",
    answer: "Hayır, borçlu ve ailesinin yaşamı için zorunlu olan eşyalar (buzdolabı, çamaşır makinesi, yatak, yemek takımı vb.) haczedilemez. Ancak lüks eşyalar (ikinci televizyon, değerli tablolar vb.) haczedilebilir."
  },
  {
    question: "Tek evim varsa haczedilebilir mi?",
    answer: "Haline münasip ev (meskeniyet iddiası) haczedilemez. Ancak evin değeri borcunuzdan çok yüksekse, satılıp size mütevazı bir ev alınacak kadar para ayrılabilir, kalanı alacaklıya verilir."
  },
  {
    question: "İcra takibine nasıl itiraz edilir?",
    answer: "İlamsız takipte ödeme emrinin tebliğinden itibaren 7 gün içinde icra dairesine yazılı veya sözlü itiraz edilir. İtiraz takibi durdurur. Kambiyo takiplerinde süre 5 gündür."
  },
  {
    question: "Banka hesabıma haciz konuldu, ne yapmalıyım?",
    answer: "Asgari ücret tutarı kadar kısım haczedilemez. Bu tutarın üzerindeki bakiyeye haciz konulur. Hesaptaki paranın maaş/emekli aylığı olduğunu ispat ederseniz, haciz kaldırılabilir (1/4 sınırı uygulanır)."
  },
  {
    question: "İcra dosyası ne zaman düşer?",
    answer: "Haciz talep etmeden 1 yıl geçerse dosya işlemden kaldırılır. Satış talep etmeden 2 yıl (taşınmaz) veya 1 yıl (taşınır) geçerse satış hakkı düşer. İlamlı takipte zamanaşımı 10 yıldır."
  },
  {
    question: "Borçlu ölürse ne olur?",
    answer: "Mirasçılar mirası reddetmezlerse borçtan sorumlu olurlar. Mirasın reddi için 3 ay süre vardır. Mirasçılara karşı takip devam edebilir."
  }
];

// Arama fonksiyonları
export function searchIcraTakipTuru(keyword: string): IcraTakipTuru[] {
  const normalized = keyword.toLowerCase();
  return ICRA_TAKIP_TURLERI.filter(
    t => t.name.toLowerCase().includes(normalized) ||
         t.description.toLowerCase().includes(normalized)
  );
}

export function searchHacizTuru(keyword: string): HacizTuru[] {
  const normalized = keyword.toLowerCase();
  return HACIZ_TURLERI.filter(
    h => h.name.toLowerCase().includes(normalized) ||
         h.description.toLowerCase().includes(normalized)
  );
}

export function getIcraFAQ(keyword: string) {
  const normalized = keyword.toLowerCase();
  return ICRA_FAQ.filter(
    f => f.question.toLowerCase().includes(normalized) ||
         f.answer.toLowerCase().includes(normalized)
  );
}
