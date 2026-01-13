/**
 * Ticaret Hukuku Veritabanı
 * 
 * 6102 sayılı Türk Ticaret Kanunu ve ilgili düzenlemeler
 * Şirketler, ticari işletme, kıymetli evrak, taşıma, sigorta
 */

export interface SirketTuru {
  id: string;
  name: string;
  description: string;
  legalBasis: string[];
  minCapital: string;
  minPartners: string;
  liability: string;
  organs: OrganInfo[];
  establishmentSteps: string[];
  advantages: string[];
  disadvantages: string[];
  practicalTips: string[];
}

export interface OrganInfo {
  name: string;
  composition: string;
  duties: string[];
  electionTerm?: string;
}

export interface TicariSozlesme {
  id: string;
  name: string;
  description: string;
  parties: string[];
  essentialElements: string[];
  legalBasis: string[];
  formRequirement: string;
  commonClauses: string[];
  risks: string[];
  practicalTips: string[];
}

export interface KiymetliEvrak {
  id: string;
  name: string;
  description: string;
  types: string[];
  legalBasis: string[];
  formalRequirements: string[];
  transfer: string;
  practicalTips: string[];
}

// ============================================
// ŞİRKET TÜRLERİ
// ============================================
export const SIRKET_TURLERI: SirketTuru[] = [
  {
    id: "limited",
    name: "Limited Şirket",
    description: "En yaygın şirket türü. Bir veya daha fazla gerçek veya tüzel kişi tarafından kurulabilir.",
    legalBasis: ["TTK m.573-644"],
    minCapital: "10.000 TL (2024 itibariyle 50.000 TL'ye çıkarıldı)",
    minPartners: "1 kişi (tek ortaklı olabilir), en fazla 50 ortak",
    liability: "Ortaklar, şirket borçlarından şahsen sorumlu değildir. Sadece taahhüt ettikleri sermaye ile sorumludurlar.",
    organs: [
      {
        name: "Genel Kurul",
        composition: "Tüm ortaklar",
        duties: [
          "Müdür seçimi ve azli",
          "Bilanço ve kar dağıtımı onayı",
          "Ana sözleşme değişikliği",
          "Şirketin feshi kararı"
        ],
        electionTerm: "Yılda en az 1 kez toplanır"
      },
      {
        name: "Müdür/Müdürler Kurulu",
        composition: "Ortak veya dışarıdan atanan kişiler",
        duties: [
          "Şirketi temsil ve yönetim",
          "Defter tutma",
          "Genel kurulu toplantıya çağırma",
          "Ortaklar hakkında bilgi verme"
        ]
      }
    ],
    establishmentSteps: [
      "Ana sözleşme hazırlanması",
      "MERSİS üzerinden başvuru",
      "Noterde ana sözleşme imzası",
      "Sermayenin 1/4'ünün bankaya bloke edilmesi",
      "Ticaret siciline tescil",
      "Vergi dairesi kaydı",
      "SGK kaydı"
    ],
    advantages: [
      "Düşük sermaye ile kurulabilir",
      "Tek ortakla kurulabilir",
      "Ortakların sorumluluğu sınırlı",
      "Hisse devri kolay (noter onayı gerekli)",
      "Bağımsız denetim zorunluluğu yok (küçük şirketler)"
    ],
    disadvantages: [
      "Halka açılamaz",
      "Tahvil çıkaramaz",
      "Ortak sayısı 50 ile sınırlı",
      "Hisse devri noter onayı gerektirir"
    ],
    practicalTips: [
      "Tek ortaklı Ltd. Şti. için TTK m.574 hükümlerine dikkat edin",
      "Müdürün en az birinin Türkiye'de yerleşik olması gerekir",
      "Ortak sayısı 20'yi geçerse bağımsız denetim zorunlu olabilir",
      "Kar dağıtım kararı genel kurul yetkisindedir"
    ]
  },
  {
    id: "anonim",
    name: "Anonim Şirket",
    description: "Sermayesi belirli ve paylara bölünmüş, borçlarından yalnızca malvarlığıyla sorumlu şirket.",
    legalBasis: ["TTK m.329-572"],
    minCapital: "50.000 TL (kayıtlı sermaye sisteminde 100.000 TL)",
    minPartners: "1 kişi (tek ortaklı olabilir), üst sınır yok",
    liability: "Ortaklar (pay sahipleri) şirket borçlarından şahsen sorumlu değildir.",
    organs: [
      {
        name: "Genel Kurul",
        composition: "Tüm pay sahipleri",
        duties: [
          "Yönetim kurulu seçimi ve azli",
          "Bağımsız denetçi seçimi",
          "Finansal tabloların onayı",
          "Kar dağıtım kararı",
          "Ana sözleşme değişikliği",
          "Sermaye artırımı/azaltımı",
          "Birleşme, bölünme, tür değiştirme kararları"
        ],
        electionTerm: "Yılda en az 1 kez (hesap dönemini izleyen 3 ay içinde)"
      },
      {
        name: "Yönetim Kurulu",
        composition: "En az 1 üye (tüzel kişi de olabilir)",
        duties: [
          "Şirketi temsil ve yönetim",
          "Genel kurulu toplantıya çağırma",
          "Şirket defterlerinin tutulması",
          "İç yönerge hazırlanması",
          "Risklerin erken tespiti komitesi (halka açık)"
        ],
        electionTerm: "En fazla 3 yıl"
      },
      {
        name: "Denetçi (Bağımsız Denetim)",
        composition: "Bağımsız denetim kuruluşu veya SMMM/YMM",
        duties: [
          "Finansal tabloların denetimi",
          "Yıllık faaliyet raporunun denetimi",
          "Denetim raporu hazırlanması"
        ],
        electionTerm: "1 yıl"
      }
    ],
    establishmentSteps: [
      "Ana sözleşme hazırlanması",
      "MERSİS başvurusu",
      "Bakanlık izni (gerekli sektörlerde)",
      "Noterde ana sözleşme onayı",
      "Sermayenin 1/4'ünün bankaya yatırılması",
      "Kuruluş işlemlerinin tescili",
      "İlan ve diğer kayıtlar"
    ],
    advantages: [
      "Halka açılabilir",
      "Tahvil ve bono çıkarabilir",
      "Pay devri kolay (ciro ile)",
      "Kurumsal imaj",
      "Ortak sayısı sınırsız"
    ],
    disadvantages: [
      "Yüksek sermaye gereksinimi",
      "Bağımsız denetim zorunlu (belirli ölçekte)",
      "Daha fazla formalite",
      "KAP bildirimi (halka açık)"
    ],
    practicalTips: [
      "Tek pay sahipli A.Ş. kurulabilir (TTK m.338)",
      "Hamiline yazılı pay için MKK kaydı zorunlu",
      "Bağımsız denetim eşikleri yıllık güncellenir",
      "Yönetim kurulunda en az 1 üyenin Türkiye'de yerleşik olması önerilir"
    ]
  },
  {
    id: "kollektif",
    name: "Kollektif Şirket",
    description: "Tüm ortakların sınırsız sorumlu olduğu şahıs şirketi.",
    legalBasis: ["TTK m.211-303"],
    minCapital: "Yasal asgari sermaye yok",
    minPartners: "En az 2 gerçek kişi",
    liability: "Ortaklar şirket borçlarından müteselsil ve sınırsız sorumludur.",
    organs: [
      {
        name: "Ortaklar",
        composition: "Tüm ortaklar",
        duties: [
          "Şirketi birlikte yönetme ve temsil",
          "Kararları oybirliği ile alma (aksi kararlaştırılmadıkça)"
        ]
      }
    ],
    establishmentSteps: [
      "Şirket sözleşmesi hazırlanması",
      "Noterde imza",
      "Ticaret siciline tescil"
    ],
    advantages: [
      "Kolay kuruluş",
      "Asgari sermaye şartı yok",
      "Esnek yönetim yapısı"
    ],
    disadvantages: [
      "Sınırsız sorumluluk",
      "Tüzel kişi ortak olamaz",
      "Ortağın ölümü/çıkması şirketi etkiler"
    ],
    practicalTips: [
      "Günümüzde nadiren tercih edilir",
      "Aile işletmeleri için uygun olabilir",
      "Ortakların birbirine güveni esas"
    ]
  },
  {
    id: "komandit",
    name: "Komandit Şirket",
    description: "Bir kısım ortağın sınırsız (komandite), bir kısmının sınırlı (komanditer) sorumlu olduğu şirket.",
    legalBasis: ["TTK m.304-328 (adi komandit)", "TTK m.565-572 (paylı komandit)"],
    minCapital: "Yasal asgari sermaye yok (adi), 50.000 TL (paylı)",
    minPartners: "En az 1 komandite + 1 komanditer ortak",
    liability: "Komandite ortaklar sınırsız, komanditer ortaklar koydukları sermaye ile sorumlu.",
    organs: [
      {
        name: "Komandite Ortaklar",
        composition: "Sınırsız sorumlu ortaklar",
        duties: [
          "Şirketi yönetme ve temsil",
          "Günlük işlerin yürütülmesi"
        ]
      },
      {
        name: "Komanditer Ortaklar",
        composition: "Sınırlı sorumlu ortaklar",
        duties: [
          "Sermaye koyma",
          "Yönetime karışmama (karışırsa sınırsız sorumlu olur)"
        ]
      }
    ],
    establishmentSteps: [
      "Şirket sözleşmesi hazırlanması",
      "Noterde onay",
      "Ticaret siciline tescil"
    ],
    advantages: [
      "Sermaye ve emek ortaklığı",
      "Komanditer ortaklar için sınırlı sorumluluk"
    ],
    disadvantages: [
      "Karmaşık yapı",
      "Komandite ortağın sınırsız sorumluluğu"
    ],
    practicalTips: [
      "Sermayesi olan ama yönetmek istemeyen yatırımcılar için uygun",
      "Paylı komandit A.Ş. hükümlerine tabidir"
    ]
  },
  {
    id: "kooperatif",
    name: "Kooperatif",
    description: "Ortakların ekonomik çıkarlarını korumak için kurulan tüzel kişilik.",
    legalBasis: ["1163 sayılı Kooperatifler Kanunu"],
    minCapital: "Ana sözleşmede belirlenir (genellikle düşük)",
    minPartners: "En az 7 ortak",
    liability: "Ortaklar sınırlı sorumlu (ana sözleşmeye bağlı)",
    organs: [
      {
        name: "Genel Kurul",
        composition: "Tüm ortaklar",
        duties: [
          "Yönetim ve denetim kurulu seçimi",
          "Bilanço onayı",
          "Ana sözleşme değişikliği"
        ]
      },
      {
        name: "Yönetim Kurulu",
        composition: "En az 3 üye",
        duties: [
          "Kooperatifi temsil ve yönetim"
        ],
        electionTerm: "En fazla 4 yıl"
      },
      {
        name: "Denetim Kurulu",
        composition: "En az 3 üye",
        duties: [
          "Yönetim kurulunun denetimi"
        ],
        electionTerm: "En fazla 4 yıl"
      }
    ],
    establishmentSteps: [
      "Ana sözleşme hazırlanması",
      "Bakanlık izni (İlgili Bakanlık)",
      "Ticaret siciline tescil"
    ],
    advantages: [
      "Demokratik yönetim (1 ortak = 1 oy)",
      "Vergi avantajları",
      "Kar amacı gütmeme prensibi"
    ],
    disadvantages: [
      "Bakanlık denetimi",
      "Esnek olmayan yapı"
    ],
    practicalTips: [
      "Yapı kooperatifleri için özel düzenlemeler var",
      "Tarım kredi kooperatifleri farklı mevzuata tabi",
      "Ortakların aidat ödeme yükümlülüğü önemli"
    ]
  }
];

// ============================================
// TİCARİ SÖZLEŞMELER
// ============================================
export const TICARI_SOZLESMELER: TicariSozlesme[] = [
  {
    id: "satis",
    name: "Ticari Satış Sözleşmesi",
    description: "Tacirler arası mal satışını düzenleyen sözleşme.",
    parties: ["Satıcı (tacir)", "Alıcı (tacir)"],
    essentialElements: [
      "Tarafların belirlenmesi",
      "Satış konusu malın belirlenmesi",
      "Satış bedeli",
      "Teslim şartları (Incoterms)"
    ],
    legalBasis: ["TBK m.207-246", "TTK m.23 (ticari satış özel hükümleri)"],
    formRequirement: "Kural olarak şekil şartı yok (taşınmaz hariç)",
    commonClauses: [
      "Teslim yeri ve zamanı",
      "Ödeme koşulları",
      "Mülkiyetin saklı tutulması",
      "Garanti şartları",
      "Ayıp ihbar süreleri",
      "Cezai şart",
      "Uyuşmazlık çözümü"
    ],
    risks: [
      "Ayıplı mal teslimi",
      "Geç teslim",
      "Ödeme riski",
      "Mülkiyet devri zamanlaması"
    ],
    practicalTips: [
      "Ticari satışta ayıp ihbarı derhal yapılmalı (TBK m.223)",
      "Mülkiyetin saklı tutulması için yazılı şart gerekli",
      "Uluslararası satışta CISG uygulanabilir"
    ]
  },
  {
    id: "acente",
    name: "Acentelik Sözleşmesi",
    description: "Acentenin, müvekkili adına ve hesabına sözleşme yapmasını düzenler.",
    parties: ["Acente", "Müvekkil (tacir)"],
    essentialElements: [
      "Temsil yetkisinin kapsamı",
      "Bölge sınırlaması",
      "Komisyon oranı",
      "Süre"
    ],
    legalBasis: ["TTK m.102-123"],
    formRequirement: "Yazılı şekil şartı yok ama önerilir",
    commonClauses: [
      "Münhasırlık (tek yetkili acente)",
      "Rekabet yasağı",
      "Denkleştirme tazminatı",
      "Fesih koşulları"
    ],
    risks: [
      "Yetki aşımı",
      "Rekabet ihlali",
      "Denkleştirme tazminatı yükümlülüğü"
    ],
    practicalTips: [
      "Denkleştirme tazminatı hakkından önceden vazgeçilemez",
      "2 yıl içinde talep edilmezse zamanaşımına uğrar",
      "Münhasırlık açıkça kararlaştırılmalı"
    ]
  },
  {
    id: "franchise",
    name: "Franchise (Franchising) Sözleşmesi",
    description: "Bir işletme sisteminin ve markasının kullanım hakkının verilmesi.",
    parties: ["Franchisor (veren)", "Franchisee (alan)"],
    essentialElements: [
      "Marka ve sistem kullanım hakkı",
      "Bölge",
      "Royalty ve giriş ücreti",
      "Eğitim ve destek"
    ],
    legalBasis: ["TBK genel hükümler", "Marka Kanunu", "Rekabet Kanunu"],
    formRequirement: "Yazılı şekil önerilir",
    commonClauses: [
      "Know-how transferi",
      "Kalite standartları",
      "Reklam katkı payı",
      "Kontrol ve denetim hakkı",
      "Rekabet yasağı",
      "Yenileme koşulları"
    ],
    risks: [
      "Marka ihlali",
      "Kalite düşüşü",
      "Rekabet hukuku ihlali",
      "Bağımlılık ilişkisi"
    ],
    practicalTips: [
      "Sözleşme öncesi bilgilendirme belgesi (FDD) alın",
      "Çıkış stratejisini baştan planlayın",
      "Bölge münhasırlığını netleştirin"
    ]
  },
  {
    id: "faktoring",
    name: "Faktoring Sözleşmesi",
    description: "Alacakların faktoring şirketine devredilmesi.",
    parties: ["Satıcı/Alacaklı", "Faktoring Şirketi"],
    essentialElements: [
      "Devredilecek alacaklar",
      "Faktoring ücreti/komisyon",
      "Ödeme koşulları",
      "Rücu hakkı (varsa)"
    ],
    legalBasis: ["6361 sayılı Finansal Kiralama, Faktoring ve Finansman Şirketleri Kanunu"],
    formRequirement: "Yazılı",
    commonClauses: [
      "Alacak devri şartları",
      "Rücu hakkı (gerçek/gerçek olmayan faktoring)",
      "Bildirim yükümlülüğü",
      "Limit ve teminatlar"
    ],
    risks: [
      "Borçlunun ödememesi (rücu'lu faktoring)",
      "Alacağın geçersizliği",
      "Mahsup riskleri"
    ],
    practicalTips: [
      "Gerçek olmayan (rücu'lu) faktoring daha yaygın",
      "Borçluya ihbar edilmesi önemli (TBK m.186)",
      "Limit ve teminatları iyi değerlendirin"
    ]
  },
  {
    id: "leasing",
    name: "Finansal Kiralama (Leasing) Sözleşmesi",
    description: "Kiralayanın, malı kiracının seçimine göre satın alıp kiraya vermesi.",
    parties: ["Kiralayan (leasing şirketi)", "Kiracı"],
    essentialElements: [
      "Kira konusu mal",
      "Kira süresi",
      "Kira bedelleri",
      "Satın alma opsiyonu"
    ],
    legalBasis: ["6361 sayılı Kanun"],
    formRequirement: "Yazılı (taşınmazlarda tapuya şerh)",
    commonClauses: [
      "Mülkiyet durumu (leasing şirketinde)",
      "Sigorta yükümlülüğü",
      "Bakım ve onarım",
      "Sözleşme sonu opsiyon (satın alma, iade, yenileme)"
    ],
    risks: [
      "Kiracının temerrüdü",
      "Malın hasarı",
      "Değer kaybı"
    ],
    practicalTips: [
      "KDV avantajı olabilir (yatırım teşviki)",
      "Faaliyet kiralaması (operasyonel leasing) farklı",
      "Sözleşme süresi malın ekonomik ömrüne yakın olmalı"
    ]
  }
];

// ============================================
// KIYMETLİ EVRAK
// ============================================
export const KIYMETLI_EVRAKLAR: KiymetliEvrak[] = [
  {
    id: "cek",
    name: "Çek",
    description: "Keşidecinin bankaya hitaben düzenlediği ödeme emri.",
    types: [
      "Hamiline yazılı çek",
      "Nama yazılı çek",
      "Emre yazılı çek"
    ],
    legalBasis: ["TTK m.780-823", "5941 sayılı Çek Kanunu"],
    formalRequirements: [
      "'Çek' kelimesi",
      "Belirli bir bedelin kayıtsız şartsız ödenmesi",
      "Muhatabın (banka) adı",
      "Keşide yeri",
      "Keşide tarihi",
      "Keşidecinin imzası",
      "KAREKOD (zorunlu)"
    ],
    transfer: "Ciro (emre yazılı), teslim (hamiline yazılı), alacağın temliki (nama yazılı)",
    practicalTips: [
      "İbraz süreleri: 10 gün (aynı il), 30 gün (farklı il), 3 ay (yurtdışı)",
      "Karşılıksız çekte cezai yaptırım var",
      "Çek Kanunu değişiklikleri düzenli takip edilmeli",
      "Hamiline çekte MKK kaydı zorunlu"
    ]
  },
  {
    id: "bono",
    name: "Bono (Emre Yazılı Senet)",
    description: "Düzenleyenin, belirli bir bedeli lehdara ödeme vaadi.",
    types: [
      "Adi bono",
      "Teminatlı bono",
      "Nama yazılı bono"
    ],
    legalBasis: ["TTK m.776-779"],
    formalRequirements: [
      "'Bono' veya 'emre yazılı senet' ibaresi",
      "Kayıtsız şartsız ödeme vaadi",
      "Vade",
      "Ödeme yeri",
      "Lehdar adı",
      "Düzenleme tarihi ve yeri",
      "Düzenleyenin imzası"
    ],
    transfer: "Ciro ve teslim",
    practicalTips: [
      "Vade belirtilmezse görüldüğünde ödenecek sayılır",
      "Ciro silsilesinin kesintisiz olmasına dikkat edin",
      "Protesto çekilmesi başvuru hakkı için önemli"
    ]
  },
  {
    id: "police",
    name: "Poliçe",
    description: "Düzenleyenin, muhatabı lehdara ödeme yapmaya davet ettiği senet.",
    types: [
      "Görüldüğünde ödenecek poliçe",
      "Belirli vadeli poliçe",
      "Düzenleme gününden belirli süre sonra ödenecek poliçe"
    ],
    legalBasis: ["TTK m.671-775"],
    formalRequirements: [
      "'Poliçe' kelimesi",
      "Kayıtsız şartsız ödeme emri",
      "Muhatabın adı",
      "Vade",
      "Ödeme yeri",
      "Lehdar adı",
      "Düzenleme tarihi ve yeri",
      "Düzenleyenin imzası"
    ],
    transfer: "Ciro ve teslim",
    practicalTips: [
      "Üç taraflı ilişki: Düzenleyen, muhatap, lehdar",
      "Kabul işlemi ile muhatap asıl borçlu olur",
      "Günümüzde çek ve bonoya göre az kullanılır"
    ]
  },
  {
    id: "konismento",
    name: "Konişmento (Bill of Lading)",
    description: "Deniz taşımacılığında malların teslim alındığını gösteren belge.",
    types: [
      "Nama yazılı konişmento",
      "Emre yazılı konişmento",
      "Hamiline yazılı konişmento"
    ],
    legalBasis: ["TTK m.1228-1244"],
    formalRequirements: [
      "Taşıyanın adı ve soyadı/ticaret unvanı",
      "Yükletenin adı",
      "Alıcının adı",
      "Geminin adı ve bayrak",
      "Yükleme limanı",
      "Boşaltma limanı",
      "Malların cinsi, ölçüsü, adedi",
      "Düzenleme tarihi ve yeri"
    ],
    transfer: "Ciro (emre yazılı), teslim (hamiline yazılı)",
    practicalTips: [
      "Clean B/L: Mal hasarsız teslim alındı",
      "Claused B/L: Rezervli konişmento",
      "Akreditifli ödemelerde temiz konişmento istenir"
    ]
  }
];

// ============================================
// TACİR VE TİCARİ İŞLETME
// ============================================
export interface TacirYukumlulugu {
  id: string;
  name: string;
  description: string;
  legalBasis: string;
  consequences: string[];
}

export const TACIR_YUKUMLULUKLERI: TacirYukumlulugu[] = [
  {
    id: "basiretli_is_adami",
    name: "Basiretli İş Adamı Gibi Davranma",
    description: "Tacir, ticari faaliyetlerinde basiretli bir iş adamı gibi davranmak zorundadır.",
    legalBasis: "TTK m.18/2",
    consequences: [
      "Hafif ihmalden dahi sorumlu olur",
      "Bilmediğini ileri süremez",
      "Sektörün teamüllerini bilmesi beklenir"
    ]
  },
  {
    id: "ticaret_sicili_kaydi",
    name: "Ticaret Siciline Tescil",
    description: "Her tacir, ticari işletmesini ticaret siciline tescil ettirmek zorundadır.",
    legalBasis: "TTK m.40",
    consequences: [
      "15 gün içinde tescil zorunluluğu",
      "Tescil edilmemiş hususlar üçüncü kişilere karşı ileri sürülemez",
      "İdari para cezası"
    ]
  },
  {
    id: "ticari_defter",
    name: "Ticari Defter Tutma",
    description: "Tacir, ticari defterlerini tutmak ve saklamak zorundadır.",
    legalBasis: "TTK m.64-88",
    consequences: [
      "Yevmiye defteri, defteri kebir, envanter defteri zorunlu",
      "10 yıl saklama yükümlülüğü",
      "Usulsüz defterde lehine delil olamaz"
    ]
  },
  {
    id: "ticari_odul",
    name: "Ticari Ödün (Cezai Şart Tenkisi Yapılmaması)",
    description: "Tacirler arasındaki sözleşmelerde cezai şartın tenkisi istenemez.",
    legalBasis: "TTK m.22",
    consequences: [
      "Sözleşmedeki cezai şart aynen uygulanır",
      "Fahiş olsa bile indirim talep edilemez (kural olarak)"
    ]
  },
  {
    id: "fatura_itiraz",
    name: "Faturaya İtiraz Süresi",
    description: "Faturayı alan tacir, 8 gün içinde itiraz etmezse içeriğini kabul etmiş sayılır.",
    legalBasis: "TTK m.21/2",
    consequences: [
      "8 gün içinde yazılı itiraz gerekli",
      "Süresinde itiraz edilmezse fatura içeriği kesinleşir",
      "İspat yükü tersine döner"
    ]
  },
  {
    id: "ticari_faiz",
    name: "Ticari Faiz",
    description: "Ticari işlerde temerrüt faizi daha yüksek oranda uygulanır.",
    legalBasis: "TTK m.8-10, 3095 sayılı Kanun",
    consequences: [
      "Avans faizi uygulanabilir",
      "Faiz oranı serbestçe kararlaştırılabilir",
      "Bileşik faiz yasağı (istisnalar hariç)"
    ]
  }
];

// ============================================
// SIK SORULAN SORULAR
// ============================================
export const TICARET_FAQ = [
  {
    question: "Limited şirket ile anonim şirket arasındaki temel fark nedir?",
    answer: "Temel farklar: 1) Asgari sermaye: Ltd. 50.000 TL, A.Ş. 50.000 TL (kayıtlı sermayede 100.000 TL). 2) Pay devri: Ltd.'de noter onayı gerekli, A.Ş.'de ciro ile kolay devir. 3) Halka açılma: Sadece A.Ş. halka açılabilir. 4) Ortak sayısı: Ltd.'de max 50, A.Ş.'de sınırsız."
  },
  {
    question: "Tek kişilik şirket kurulabilir mi?",
    answer: "Evet. Hem limited şirket hem anonim şirket tek ortakla kurulabilir (TTK m.338, m.574). Ancak tek ortaklı şirketlerde bazı ek yükümlülükler vardır ve genel kurul kararları yazılı olmalıdır."
  },
  {
    question: "Şirket müdürü/yönetim kurulu üyesi şahsen sorumlu olabilir mi?",
    answer: "Evet, belirli durumlarda: 1) Vergi ve SGK borçlarından şahsi sorumluluk. 2) Özen yükümlülüğünün ihlali. 3) Hukuka aykırı kar dağıtımı. 4) Sermaye kaybı veya borca batıklık halinde gerekli önlemleri almama."
  },
  {
    question: "Faturaya itiraz süresi nedir?",
    answer: "Tacirler arasında faturayı alan taraf 8 gün içinde yazılı itiraz etmezse, fatura içeriğini kabul etmiş sayılır (TTK m.21/2). İtiraz noter, iadeli taahhütlü mektup veya KEP ile yapılmalıdır."
  },
  {
    question: "Çekin ibraz süresi ne kadardır?",
    answer: "Keşide yeri ile ödeme yeri aynı ilde ise 10 gün, farklı ilde ise 30 gün, yurtdışı keşideli çeklerde 3 aydır. Süre keşide tarihinden itibaren başlar."
  },
  {
    question: "Karşılıksız çekin cezası nedir?",
    answer: "5941 sayılı Çek Kanunu'na göre karşılıksız çek düzenleme adli para cezası ile cezalandırılır. Ayrıca çek düzenleme ve çek hesabı açma yasağı uygulanabilir. Mağdur şikayetten vazgeçerse dava düşer."
  },
  {
    question: "Ticari işlerde zamanaşımı süresi nedir?",
    answer: "Genel kural 10 yıldır (TBK m.146). Ancak özel süreler: Satıcının ayıptan sorumluluğu 2 yıl, taşıma sözleşmesinde 1 yıl, sigorta 2-6 yıl, kıymetli evrakta 3 yıl (çek/bono/poliçe)."
  }
];

// Arama fonksiyonları
export function searchSirketTuru(keyword: string): SirketTuru[] {
  const normalized = keyword.toLowerCase();
  return SIRKET_TURLERI.filter(
    s => s.name.toLowerCase().includes(normalized) ||
         s.description.toLowerCase().includes(normalized)
  );
}

export function searchTicariSozlesme(keyword: string): TicariSozlesme[] {
  const normalized = keyword.toLowerCase();
  return TICARI_SOZLESMELER.filter(
    s => s.name.toLowerCase().includes(normalized) ||
         s.description.toLowerCase().includes(normalized)
  );
}

export function getTicaretFAQ(keyword: string) {
  const normalized = keyword.toLowerCase();
  return TICARET_FAQ.filter(
    f => f.question.toLowerCase().includes(normalized) ||
         f.answer.toLowerCase().includes(normalized)
  );
}
