/**
 * Kapsamlı Türk Mevzuatı Veritabanı
 * 
 * Bu veritabanı sistemin hukuki bilgisini güçlendirmek için
 * temel kanunlar, maddeler ve yorumlarını içerir.
 */

export interface LawArticle {
  number: string;
  title: string;
  content: string;
  explanation?: string;
  relatedArticles?: string[];
  practicalNotes?: string[];
  keywords?: string[];
}

export interface Law {
  number: string;
  name: string;
  shortName: string;
  category: LawCategory;
  officialGazetteDate: string;
  effectiveDate: string;
  description: string;
  keyPrinciples: string[];
  articles: LawArticle[];
}

export type LawCategory =
  | "anayasa"
  | "medeni"
  | "borclar"
  | "ticaret"
  | "ceza"
  | "ceza_usul"
  | "hukuk_usul"
  | "is"
  | "idare"
  | "vergi"
  | "icra_iflas"
  | "sosyal_guvenlik"
  | "veri_koruma";

// ============================================
// TÜRK BORÇLAR KANUNU (6098)
// ============================================
export const TURK_BORCLAR_KANUNU: Law = {
  number: "6098",
  name: "Türk Borçlar Kanunu",
  shortName: "TBK",
  category: "borclar",
  officialGazetteDate: "04.02.2011",
  effectiveDate: "01.07.2012",
  description: "Borç ilişkilerini düzenleyen temel kanun. Sözleşmeler, haksız fiiller, sebepsiz zenginleşme ve borçların genel hükümleri.",
  keyPrinciples: [
    "Sözleşme özgürlüğü",
    "Ahde vefa (pacta sunt servanda)",
    "Dürüstlük kuralı",
    "İyi niyet ilkesi",
    "Kusur sorumluluğu"
  ],
  articles: [
    {
      number: "1",
      title: "Sözleşmenin kurulması - İrade açıklaması",
      content: "Sözleşme, tarafların iradelerini karşılıklı ve birbirine uygun olarak açıklamalarıyla kurulur. İrade açıklaması, açık veya örtülü olabilir.",
      explanation: "Sözleşmenin temel kuruluş şartını düzenler. İcap ve kabul ile sözleşme kurulur.",
      relatedArticles: ["2", "3", "4"],
      practicalNotes: [
        "Sözlü sözleşmeler de geçerlidir (şekil şartı olan durumlar hariç)",
        "Susma kural olarak kabul sayılmaz",
        "E-posta ile yapılan sözleşmeler yazılı şekil yerine geçer"
      ],
      keywords: ["sözleşme", "irade", "icap", "kabul"]
    },
    {
      number: "19",
      title: "Sözleşmenin yorumu ve muvazaa",
      content: "Bir sözleşmenin türünün ve içeriğinin belirlenmesinde, tarafların kullandıkları sözcüklere bakılmaksızın, gerçek ve ortak iradeleri esas alınır. Tarafların gerçek ve ortak iradelerine dayanılarak, görünüşte işlemin arkasındaki gizli anlaşma da dikkate alınır.",
      explanation: "Muvazaa (danışıklılık) halinde tarafların gerçek iradesi esas alınır.",
      relatedArticles: ["18", "20", "21"],
      practicalNotes: [
        "Nispi muvazaada gizli işlem geçerlidir",
        "Mutlak muvazaada işlem geçersizdir",
        "Üçüncü kişilerin iyiniyeti korunur"
      ],
      keywords: ["muvazaa", "yorum", "gerçek irade", "gizli anlaşma"]
    },
    {
      number: "27",
      title: "Sözleşme özgürlüğünün sınırları - Kesin hükümsüzlük",
      content: "Kanunun emredici hükümlerine, ahlaka, kamu düzenine, kişilik haklarına aykırı veya konusu imkânsız olan sözleşmeler kesin olarak hükümsüzdür.",
      explanation: "Butlan (kesin hükümsüzlük) hallerini düzenler.",
      relatedArticles: ["26", "28", "29"],
      practicalNotes: [
        "Butlan her zaman ileri sürülebilir",
        "Hakim re'sen dikkate alır",
        "Kısmi butlan mümkündür (TBK m.27/2)"
      ],
      keywords: ["butlan", "kesin hükümsüzlük", "emredici hüküm", "ahlak"]
    },
    {
      number: "49",
      title: "Haksız fiilden doğan borç - Sorumluluk",
      content: "Kusurlu ve hukuka aykırı bir fiille başkasına zarar veren, bu zararı gidermekle yükümlüdür. Zarar verici fiili yasaklayan bir hukuk kuralı bulunmasa bile, ahlaka aykırı bir fiille başkasına kasten zarar veren de bu zararı gidermekle yükümlüdür.",
      explanation: "Haksız fiil sorumluluğunun temel maddesini düzenler.",
      relatedArticles: ["50", "51", "52", "53"],
      practicalNotes: [
        "Kusur, zarar, hukuka aykırılık ve illiyet bağı unsurları aranır",
        "Kusur ispatı davacıya aittir",
        "Manevi tazminat TBK m.56'da düzenlenmiştir"
      ],
      keywords: ["haksız fiil", "kusur", "zarar", "tazminat"]
    },
    {
      number: "51",
      title: "Tazminatın belirlenmesi",
      content: "Hâkim, tazminatın kapsamını ve ödenme biçimini, durumun gereğini ve özellikle kusurun ağırlığını göz önüne alarak belirler.",
      explanation: "Tazminat miktarının belirlenmesinde hakime takdir yetkisi verir.",
      relatedArticles: ["49", "50", "52"],
      practicalNotes: [
        "Müterafik kusur tazminatı azaltır",
        "Zenginleşme yasağı ilkesi geçerlidir",
        "Hakkaniyete göre indirim yapılabilir"
      ],
      keywords: ["tazminat", "kusur", "hakkaniyet"]
    },
    {
      number: "117",
      title: "Borçlu temerrüdü - Koşulları",
      content: "Muaccel bir borcun borçlusu, alacaklının ihtarıyla temerrüde düşer. Borcun ifa edileceği gün birlikte belirlenmiş veya sözleşmede saklı tutulan bir hakka dayanılarak taraflardan biri usulüne uygun bir bildirimde bulunarak belirlemişse, bu günün geçmesiyle borçlu temerrüde düşer.",
      explanation: "Borçlunun temerrüde düşme koşullarını düzenler.",
      relatedArticles: ["118", "119", "120"],
      practicalNotes: [
        "İhtar şekle bağlı değildir",
        "Kesin vadeli borçlarda ihtar gerekmez",
        "Temerrüt faizi talep edilebilir"
      ],
      keywords: ["temerrüt", "ihtar", "muacceliyet", "gecikme"]
    },
    {
      number: "146",
      title: "Zamanaşımı süreleri - On yıllık zamanaşımı",
      content: "Kanunda aksine bir hüküm bulunmadıkça, her alacak on yıllık zamanaşımına tabidir.",
      explanation: "Genel zamanaşımı süresini düzenler.",
      relatedArticles: ["147", "148", "149"],
      practicalNotes: [
        "Özel zamanaşımı süreleri bu kuralın istisnasıdır",
        "Haksız fiilde 2-10 yıl (TBK m.72)",
        "İş alacaklarında 5 yıl"
      ],
      keywords: ["zamanaşımı", "süre", "alacak"]
    },
    {
      number: "347",
      title: "Konut ve çatılı işyeri kiralarında fesih bildirimi",
      content: "Konut ve çatılı işyeri kiralarında kiracı, belirli süreli sözleşmelerin süresinin bitiminden en az on beş gün önce bildirimde bulunmadıkça, sözleşme aynı koşullarla bir yıl için uzatılmış sayılır.",
      explanation: "Kira sözleşmelerinin uzamasını ve fesih bildirimini düzenler.",
      relatedArticles: ["348", "349", "350"],
      practicalNotes: [
        "Kiraya veren 10 yıl dolmadan tahliye isteyemez",
        "Yeni malikin tahliye hakkı TBK m.351'de düzenlenmiştir",
        "Kiracının 15 günlük bildirim süresi vardır"
      ],
      keywords: ["kira", "fesih", "uzama", "tahliye"]
    }
  ]
};

// ============================================
// TÜRK MEDENİ KANUNU (4721)
// ============================================
export const TURK_MEDENI_KANUNU: Law = {
  number: "4721",
  name: "Türk Medeni Kanunu",
  shortName: "TMK",
  category: "medeni",
  officialGazetteDate: "08.12.2001",
  effectiveDate: "01.01.2002",
  description: "Kişiler hukuku, aile hukuku, miras hukuku ve eşya hukukunu düzenleyen temel kanun.",
  keyPrinciples: [
    "Dürüstlük kuralı",
    "İyi niyet ilkesi",
    "Hakkın kötüye kullanılması yasağı",
    "Kişiliğin korunması",
    "Mülkiyet hakkının güvencesi"
  ],
  articles: [
    {
      number: "2",
      title: "Dürüst davranma",
      content: "Herkes, haklarını kullanırken ve borçlarını yerine getirirken dürüstlük kurallarına uymak zorundadır. Bir hakkın açıkça kötüye kullanılmasını hukuk düzeni korumaz.",
      explanation: "Tüm hukuk sisteminin temelini oluşturan dürüstlük kuralını düzenler.",
      practicalNotes: [
        "Objektif iyi niyet kuralıdır",
        "Bütün hukuk alanlarında uygulanır",
        "Hakkın kötüye kullanılması halinde hukuki koruma sağlanmaz"
      ],
      keywords: ["dürüstlük", "iyi niyet", "hakkın kötüye kullanılması"]
    },
    {
      number: "3",
      title: "İyi niyetin korunması",
      content: "Kanunun iyiniyete hukukî bir sonuç bağladığı durumlarda, asıl olan iyiniyetin varlığıdır. Ancak, durumun gereklerine göre kendisinden beklenen özeni göstermeyen kimse iyiniyet iddiasında bulunamaz.",
      explanation: "Sübjektif iyi niyet kuralını düzenler.",
      relatedArticles: ["2", "988", "989", "1023"],
      practicalNotes: [
        "İyi niyet karinedir, ispat yükü karşı taraftadır",
        "Tapu siciline güven ilkesi TMK m.1023",
        "Ağır ihmal iyiniyeti ortadan kaldırır"
      ],
      keywords: ["iyi niyet", "karine", "özgü dikkat"]
    },
    {
      number: "8",
      title: "Hak ehliyeti",
      content: "Her insanın hak ehliyeti vardır. Buna göre bütün insanlar, hukuk düzeninin sınırları içinde, haklara ve borçlara ehil olmada eşittirler.",
      explanation: "Kişilerin hak sahibi olabilme ehliyetini düzenler.",
      relatedArticles: ["9", "10", "11"],
      practicalNotes: [
        "Doğumla başlar, ölümle sona erer",
        "Cenin sağ doğmak koşuluyla hak ehliyetine sahiptir",
        "Hak ehliyeti sınırlandırılamaz"
      ],
      keywords: ["hak ehliyeti", "kişi", "ehliyet"]
    },
    {
      number: "10",
      title: "Fiil ehliyetinin koşulları",
      content: "Ayırt etme gücüne sahip ve kısıtlı olmayan her ergin kişinin fiil ehliyeti vardır.",
      explanation: "Fiil ehliyetinin üç koşulunu belirler: erginlik, ayırt etme gücü, kısıtlı olmama.",
      relatedArticles: ["11", "12", "13", "14"],
      practicalNotes: [
        "Erginlik 18 yaş ile kazanılır",
        "Evlenme ile erginlik kazanılır (m.11)",
        "Mahkeme kararıyla da erginlik verilebilir"
      ],
      keywords: ["fiil ehliyeti", "erginlik", "ayırt etme gücü", "kısıtlama"]
    },
    {
      number: "166",
      title: "Boşanma sebepleri - Evlilik birliğinin sarsılması",
      content: "Evlilik birliği, ortak hayatı sürdürmeleri kendilerinden beklenmeyecek derecede temelinden sarsılmış olursa, eşlerden her biri boşanma davası açabilir.",
      explanation: "En sık başvurulan boşanma sebebini düzenler.",
      relatedArticles: ["161", "162", "163", "164", "165"],
      practicalNotes: [
        "Şiddetli geçimsizlik olarak da anılır",
        "Her iki taraf da dava açabilir",
        "Kusur tespiti nafaka ve tazminat için önemlidir"
      ],
      keywords: ["boşanma", "evlilik birliği", "geçimsizlik", "kusur"]
    },
    {
      number: "175",
      title: "Yoksulluk nafakası",
      content: "Boşanma yüzünden yoksulluğa düşecek taraf, kusuru daha ağır olmamak koşuluyla geçimi için diğer taraftan malî gücü oranında süresiz olarak nafaka isteyebilir.",
      explanation: "Boşanma sonrası yoksulluk nafakasını düzenler.",
      relatedArticles: ["174", "176", "177"],
      practicalNotes: [
        "Talep edilmesi gerekir",
        "Kusuru ağır olan taraf talep edemez",
        "Yeniden evlenme ile sona erer",
        "Ekonomik durum değişirse uyarlama istenebilir"
      ],
      keywords: ["nafaka", "yoksulluk", "boşanma", "kusur"]
    },
    {
      number: "335",
      title: "Velayet hakkı",
      content: "Ergin olmayan çocuk, ana ve babasının velâyeti altındadır. Yasal sebep olmadıkça velâyet ana ve babadan alınamaz.",
      explanation: "Velayet hakkının kapsamını düzenler.",
      relatedArticles: ["336", "337", "338"],
      practicalNotes: [
        "Velayet hakkı kamu düzenine ilişkindir",
        "Çocuğun üstün yararı esastır",
        "Ortak velayet mümkündür"
      ],
      keywords: ["velayet", "çocuk", "anne", "baba"]
    },
    {
      number: "683",
      title: "Mülkiyet hakkının içeriği",
      content: "Bir şeye malik olan kimse, hukuk düzeninin sınırları içinde, o şey üzerinde dilediği gibi kullanma, yararlanma ve tasarrufta bulunma yetkisine sahiptir.",
      explanation: "Mülkiyet hakkının kapsamını tanımlar.",
      relatedArticles: ["684", "685", "686"],
      practicalNotes: [
        "Usus, fructus, abusus yetkileri",
        "Mülkiyet anayasal güvence altındadır",
        "Komşuluk hukukuyla sınırlanır"
      ],
      keywords: ["mülkiyet", "tasarruf", "kullanma", "yararlanma"]
    }
  ]
};

// ============================================
// İŞ KANUNU (4857)
// ============================================
export const IS_KANUNU: Law = {
  number: "4857",
  name: "İş Kanunu",
  shortName: "İş K.",
  category: "is",
  officialGazetteDate: "10.06.2003",
  effectiveDate: "10.06.2003",
  description: "İşçi-işveren ilişkilerini düzenleyen temel kanun. İş sözleşmesi, çalışma koşulları, fesih ve tazminatları düzenler.",
  keyPrinciples: [
    "İşçinin korunması",
    "Eşit davranma ilkesi",
    "İş güvencesi",
    "Çalışma barışı",
    "Sosyal devlet ilkesi"
  ],
  articles: [
    {
      number: "2",
      title: "Tanımlar",
      content: "Bir iş sözleşmesine dayanarak çalışan gerçek kişiye işçi, işçi çalıştıran gerçek veya tüzel kişiye yahut tüzel kişiliği olmayan kurum ve kuruluşlara işveren denir.",
      explanation: "Temel kavramları tanımlar.",
      practicalNotes: [
        "Bağımlılık unsuru işçiyi diğerlerinden ayırır",
        "Alt işveren ilişkisi ayrıca düzenlenmiştir",
        "Asıl işveren müteselsil sorumludur"
      ],
      keywords: ["işçi", "işveren", "iş sözleşmesi", "bağımlılık"]
    },
    {
      number: "17",
      title: "Süreli fesih - İhbar süreleri",
      content: "Belirsiz süreli iş sözleşmelerinin feshinden önce durumun diğer tarafa bildirilmesi gerekir. İş sözleşmeleri; a) İşi altı aydan az sürmüş olan işçi için, bildirimin diğer tarafa yapılmasından başlayarak iki hafta sonra, b) İşi altı aydan birbuçuk yıla kadar sürmüş olan işçi için, bildirimin diğer tarafa yapılmasından başlayarak dört hafta sonra, c) İşi birbuçuk yıldan üç yıla kadar sürmüş olan işçi için, bildirimin diğer tarafa yapılmasından başlayarak altı hafta sonra, d) İşi üç yıldan fazla sürmüş işçi için, bildirim yapılmasından başlayarak sekiz hafta sonra feshedilmiş sayılır.",
      explanation: "İhbar sürelerini ve ihbar tazminatını düzenler.",
      relatedArticles: ["18", "19", "21"],
      practicalNotes: [
        "İhbar süreleri sözleşmeyle artırılabilir",
        "İhbar süresi içinde günde 2 saat iş arama izni verilir",
        "İhbar tazminatı brüt ücret üzerinden hesaplanır"
      ],
      keywords: ["ihbar", "bildirim", "fesih", "süre"]
    },
    {
      number: "18",
      title: "Feshin geçerli sebebe dayandırılması",
      content: "Otuz veya daha fazla işçi çalıştıran işyerlerinde en az altı aylık kıdemi olan işçinin belirsiz süreli iş sözleşmesini fesheden işveren, işçinin yeterliliğinden veya davranışlarından ya da işletmenin, işyerinin veya işin gereklerinden kaynaklanan geçerli bir sebebe dayanmak zorundadır.",
      explanation: "İş güvencesi kapsamını ve geçerli fesih nedenlerini düzenler.",
      relatedArticles: ["17", "19", "20", "21"],
      practicalNotes: [
        "30 işçi ve 6 ay kıdem şartı aranır",
        "İşletme gerekleri objektif olmalıdır",
        "Son çare ilkesi uygulanır"
      ],
      keywords: ["iş güvencesi", "geçerli fesih", "işe iade"]
    },
    {
      number: "21",
      title: "Geçersiz sebeple yapılan feshin sonuçları",
      content: "İşverence geçerli sebep gösterilmediği veya gösterilen sebebin geçerli olmadığı mahkemece veya özel hakem tarafından tespit edilerek feshin geçersizliğine karar verildiğinde, işveren, işçiyi bir ay içinde işe başlatmak zorundadır. İşçiyi başlatmayan işveren, işçiye en az dört aylık ve en çok sekiz aylık ücreti tutarında tazminat ödemekle yükümlü olur.",
      explanation: "İşe iade kararının sonuçlarını düzenler.",
      relatedArticles: ["18", "19", "20"],
      practicalNotes: [
        "4-8 aylık işe başlatmama tazminatı",
        "En çok 4 aylık boşta geçen süre ücreti",
        "10 iş günü içinde başvuru zorunluluğu"
      ],
      keywords: ["işe iade", "tazminat", "boşta geçen süre"]
    },
    {
      number: "24",
      title: "İşçinin haklı nedenle derhal fesih hakkı",
      content: "Süresi belirli olsun veya olmasın işçi, aşağıda yazılı hallerde iş sözleşmesini sürenin bitiminden önce veya bildirim süresini beklemeksizin feshedebilir: I- Sağlık sebepleri, II- Ahlak ve iyi niyet kurallarına uymayan haller, III- Zorlayıcı sebepler.",
      explanation: "İşçinin haklı fesih nedenlerini düzenler.",
      relatedArticles: ["25", "26"],
      practicalNotes: [
        "Mobbing haklı fesih sebebidir",
        "Ücretin ödenmemesi haklı fesih sebebidir",
        "6 iş günü içinde fesih hakkı kullanılmalıdır"
      ],
      keywords: ["haklı fesih", "işçi", "kıdem tazminatı", "mobbing"]
    },
    {
      number: "25",
      title: "İşverenin haklı nedenle derhal fesih hakkı",
      content: "Süresi belirli olsun veya olmasın işveren, aşağıda yazılı hallerde iş sözleşmesini sürenin bitiminden önce veya bildirim süresini beklemeksizin feshedebilir: I- Sağlık sebepleri, II- Ahlak ve iyi niyet kurallarına uymayan haller, III- Zorlayıcı sebepler.",
      explanation: "İşverenin haklı fesih nedenlerini düzenler.",
      relatedArticles: ["24", "26"],
      practicalNotes: [
        "II. bent hallerinde kıdem tazminatı ödenmez",
        "Devamsızlık sınırı ardı ardına 2 veya ayda 3 gündür",
        "Sadakat borcuna aykırılık haklı fesih sebebidir"
      ],
      keywords: ["haklı fesih", "işveren", "sadakat", "devamsızlık"]
    },
    {
      number: "32",
      title: "Ücret ve ücretin ödenmesi",
      content: "Genel anlamda ücret bir kimseye bir iş karşılığında işveren veya üçüncü kişiler tarafından sağlanan ve para ile ödenen tutardır. Ücret, prim, ikramiye ve bu nitelikteki her çeşit istihkak kural olarak, Türk parası ile işyerinde veya özel olarak açılan bir banka hesabına ödenir.",
      explanation: "Ücretin tanımı ve ödeme şeklini düzenler.",
      relatedArticles: ["33", "34", "35"],
      practicalNotes: [
        "Ücret en geç ayda bir ödenir",
        "Asgari ücretin altında ücret belirlenemez",
        "Ücret alacakları 5 yıllık zamanaşımına tabidir"
      ],
      keywords: ["ücret", "maaş", "ödeme", "banka"]
    },
    {
      number: "41",
      title: "Fazla çalışma ücreti",
      content: "Ülkenin genel yararları yahut işin niteliği veya üretimin artırılması gibi nedenlerle fazla çalışma yapılabilir. Fazla çalışma, Kanunda yazılı koşullar çerçevesinde, haftalık kırk beş saati aşan çalışmalardır. Her bir saat fazla çalışma için verilecek ücret normal çalışma ücretinin saat başına düşen miktarının yüzde elli yükseltilmesi suretiyle ödenir.",
      explanation: "Fazla çalışma ve ücretlendirmesini düzenler.",
      relatedArticles: ["42", "43", "63"],
      practicalNotes: [
        "Fazla çalışma yılda 270 saati geçemez",
        "Fazla sürelerle çalışmada %25 zamlı ücret",
        "Serbest zaman kullandırılabilir"
      ],
      keywords: ["fazla çalışma", "mesai", "ücret", "haftalık çalışma"]
    },
    {
      number: "53",
      title: "Yıllık ücretli izin hakkı ve izin süreleri",
      content: "İşyerinde işe başladığı günden itibaren, deneme süresi de içinde olmak üzere, en az bir yıl çalışmış olan işçilere yıllık ücretli izin verilir. Yıllık ücretli izin hakkından vazgeçilemez. İşçilere verilecek yıllık ücretli izin süresi, hizmet süresi; a) Bir yıldan beş yıla kadar (beş yıl dahil) olanlara ondört günden, b) Beş yıldan fazla onbeş yıldan az olanlara yirmi günden, c) Onbeş yıl (dahil) ve daha fazla olanlara yirmialtı günden az olamaz.",
      explanation: "Yıllık izin hakkı ve sürelerini düzenler.",
      relatedArticles: ["54", "55", "56", "57"],
      practicalNotes: [
        "18 yaşından küçükler için 20 gün asgari",
        "50 yaşından büyükler için 20 gün asgari",
        "İzin ücreti peşin ödenir"
      ],
      keywords: ["yıllık izin", "ücretli izin", "tatil", "dinlenme"]
    }
  ]
};

// ============================================
// TÜRK CEZA KANUNU (5237)
// ============================================
export const TURK_CEZA_KANUNU: Law = {
  number: "5237",
  name: "Türk Ceza Kanunu",
  shortName: "TCK",
  category: "ceza",
  officialGazetteDate: "12.10.2004",
  effectiveDate: "01.06.2005",
  description: "Suç ve cezaları düzenleyen temel kanun.",
  keyPrinciples: [
    "Suçta ve cezada kanunilik",
    "Kıyas yasağı",
    "Lehe kanun uygulaması",
    "Şüpheden sanık yararlanır",
    "Cezaların şahsiliği"
  ],
  articles: [
    {
      number: "2",
      title: "Suçta ve cezada kanunîlik ilkesi",
      content: "Kanunun açıkça suç saymadığı bir fiil için kimseye ceza verilemez ve güvenlik tedbiri uygulanamaz. Kanunda yazılı cezalardan ve güvenlik tedbirlerinden başka bir ceza ve güvenlik tedbirine hükmolunamaz. İdarenin düzenleyici işlemleriyle suç ve ceza konulamaz.",
      explanation: "Ceza hukukunun temel ilkesi olan kanuniliği düzenler.",
      practicalNotes: [
        "Nullum crimen, nulla poena sine lege",
        "Kıyas yasağı vardır",
        "Lehe kanun geriye uygulanır"
      ],
      keywords: ["kanunilik", "suç", "ceza", "kıyas yasağı"]
    },
    {
      number: "21",
      title: "Kast",
      content: "Suçun oluşması kastın varlığına bağlıdır. Kast, suçun kanuni tanımındaki unsurların bilerek ve istenerek gerçekleştirilmesidir.",
      explanation: "Kastın tanımını yapar.",
      relatedArticles: ["22", "23"],
      practicalNotes: [
        "Doğrudan kast ve olası kast ayrımı",
        "Olası kastta fail sonucu öngörür ama kayıtsız kalır",
        "Kast ispatı Savcılığa aittir"
      ],
      keywords: ["kast", "niyet", "bilinçli", "isteyerek"]
    },
    {
      number: "22",
      title: "Taksir",
      content: "Taksirle işlenen fiiller, kanunun açıkça belirttiği hallerde cezalandırılır. Taksir, dikkat ve özen yükümlülüğüne aykırılık dolayısıyla, bir davranışın suçun kanuni tanımında belirtilen neticesi öngörülmeyerek gerçekleştirilmesidir.",
      explanation: "Taksiri ve bilinçli taksiri düzenler.",
      relatedArticles: ["21", "23"],
      practicalNotes: [
        "Bilinçli taksirde ceza artırılır",
        "Taksirli suçlarda teşebbüs olmaz",
        "Taksirli iştirak mümkün değildir"
      ],
      keywords: ["taksir", "ihmal", "özensizlik", "bilinçli taksir"]
    },
    {
      number: "25",
      title: "Meşru savunma ve zorunluluk hali",
      content: "Gerek kendisine ve gerek başkasına ait bir hakka yönelmiş, gerçekleşen, gerçekleşmesi veya tekrarı muhakkak olan haksız bir saldırıyı o anda hal ve koşullara göre saldırı ile orantılı biçimde defetmek zorunluluğu ile işlenen fiillerden dolayı faile ceza verilmez.",
      explanation: "Meşru savunmayı düzenler.",
      relatedArticles: ["26", "27"],
      practicalNotes: [
        "Orantılılık şartı aranır",
        "Meşru savunmada sınır aşılabilir",
        "Kaçma olanağı varsa meşru savunma tartışılır"
      ],
      keywords: ["meşru savunma", "nefsi müdafaa", "orantılılık"]
    },
    {
      number: "81",
      title: "Kasten öldürme",
      content: "Bir insanı kasten öldüren kişi, müebbet hapis cezası ile cezalandırılır.",
      explanation: "Kasten adam öldürme suçunun temel halini düzenler.",
      relatedArticles: ["82", "83", "84", "85"],
      practicalNotes: [
        "Nitelikli haller m.82'de düzenlenmiştir",
        "Ağırlaştırılmış müebbet hapis cezası verilebilir",
        "Tahrik indirimi uygulanabilir"
      ],
      keywords: ["adam öldürme", "cinayet", "müebbet", "kast"]
    },
    {
      number: "86",
      title: "Kasten yaralama",
      content: "Kasten başkasının vücuduna acı veren veya sağlığının ya da algılama yeteneğinin bozulmasına neden olan kişi, bir yıldan üç yıla kadar hapis cezası ile cezalandırılır.",
      explanation: "Kasten yaralama suçunu düzenler.",
      relatedArticles: ["87", "88", "89"],
      practicalNotes: [
        "Basit yaralama şikayete bağlıdır",
        "Silahla işlenmesi ağırlaştırıcı nedendir",
        "Netice sebebiyle ağırlaştırılmış haller m.87'de"
      ],
      keywords: ["yaralama", "darp", "saldırı", "şiddet"]
    },
    {
      number: "106",
      title: "Tehdit",
      content: "Bir başkasını, kendisinin veya yakınının hayatına, vücut veya cinsel dokunulmazlığına yönelik bir saldırı gerçekleştireceğinden bahisle tehdit eden kişi, altı aydan iki yıla kadar hapis cezası ile cezalandırılır.",
      explanation: "Tehdit suçunu düzenler.",
      relatedArticles: ["107", "108"],
      practicalNotes: [
        "Silahla tehdit ağırlaştırıcı nedendir",
        "Birden fazla kişiyle tehdit ağırlaştırıcıdır",
        "Soruşturma ve kovuşturma şikayete bağlıdır"
      ],
      keywords: ["tehdit", "korkutma", "gözdağı"]
    },
    {
      number: "125",
      title: "Hakaret",
      content: "Bir kimseye onur, şeref ve saygınlığını rencide edebilecek nitelikte somut bir fiil veya olgu isnat eden veya sövmek suretiyle bir kimsenin onur, şeref ve saygınlığına saldıran kişi, üç aydan iki yıla kadar hapis veya adlî para cezası ile cezalandırılır.",
      explanation: "Hakaret suçunu düzenler.",
      relatedArticles: ["126", "127", "128", "129", "130", "131"],
      practicalNotes: [
        "Aleniyet ağırlaştırıcı nedendir",
        "Kamu görevlisine hakaret re'sen soruşturulur",
        "Haksız fiile tepki olarak hakaret hukuka uygunluk nedenidir"
      ],
      keywords: ["hakaret", "onur", "şeref", "sövme"]
    },
    {
      number: "141",
      title: "Hırsızlık",
      content: "Zilyedinin rızası olmadan başkasına ait taşınır bir malı, kendisine veya başkasına bir yarar sağlamak maksadıyla bulunduğu yerden alan kimseye bir yıldan üç yıla kadar hapis cezası verilir.",
      explanation: "Hırsızlık suçunun temel halini düzenler.",
      relatedArticles: ["142", "143", "144", "145", "146", "147"],
      practicalNotes: [
        "Nitelikli haller m.142'de düzenlenmiştir",
        "Etkin pişmanlık indirimi mümkündür",
        "Kullanma hırsızlığı m.146'da düzenlenmiştir"
      ],
      keywords: ["hırsızlık", "çalma", "mal", "zilyetlik"]
    },
    {
      number: "157",
      title: "Dolandırıcılık",
      content: "Hileli davranışlarla bir kimseyi aldatıp, onun veya başkasının zararına olarak, kendisine veya başkasına bir yarar sağlayan kişiye bir yıldan beş yıla kadar hapis ve beşbin güne kadar adlî para cezası verilir.",
      explanation: "Dolandırıcılık suçunu düzenler.",
      relatedArticles: ["158", "159"],
      practicalNotes: [
        "Hile unsuru zorunludur",
        "Nitelikli haller m.158'de düzenlenmiştir",
        "Bilişim sistemleri kullanılarak işlenirse nitelikli hal"
      ],
      keywords: ["dolandırıcılık", "hile", "aldatma", "sahtecilik"]
    }
  ]
};

// ============================================
// KVKK (6698)
// ============================================
export const KVKK: Law = {
  number: "6698",
  name: "Kişisel Verilerin Korunması Kanunu",
  shortName: "KVKK",
  category: "veri_koruma",
  officialGazetteDate: "07.04.2016",
  effectiveDate: "07.04.2016",
  description: "Kişisel verilerin işlenmesini, korunmasını ve veri sorumlularının yükümlülüklerini düzenler.",
  keyPrinciples: [
    "Hukuka ve dürüstlük kurallarına uygun işleme",
    "Doğru ve güncel olma",
    "Belirli, açık ve meşru amaçlar için işleme",
    "Amaçla bağlantılı, sınırlı ve ölçülü olma",
    "İlgili mevzuatta öngörülen süre kadar muhafaza"
  ],
  articles: [
    {
      number: "3",
      title: "Tanımlar",
      content: "Bu Kanunun uygulanmasında; Kişisel veri: Kimliği belirli veya belirlenebilir gerçek kişiye ilişkin her türlü bilgiyi, Veri sorumlusu: Kişisel verilerin işleme amaçlarını ve vasıtalarını belirleyen, veri kayıt sisteminin kurulmasından ve yönetilmesinden sorumlu olan gerçek veya tüzel kişiyi, Açık rıza: Belirli bir konuya ilişkin, bilgilendirilmeye dayanan ve özgür iradeyle açıklanan rızayı ifade eder.",
      explanation: "Kanunun temel kavramlarını tanımlar.",
      practicalNotes: [
        "IP adresi, çerezler de kişisel veridir",
        "Anonim veriler KVKK kapsamında değildir",
        "Tüzel kişilerin verileri KVKK kapsamında değildir"
      ],
      keywords: ["kişisel veri", "veri sorumlusu", "açık rıza", "ilgili kişi"]
    },
    {
      number: "5",
      title: "Kişisel verilerin işlenme şartları",
      content: "Kişisel veriler ilgili kişinin açık rızası olmaksızın işlenemez. Aşağıdaki şartlardan birinin varlığı hâlinde, ilgili kişinin açık rızası aranmaksızın kişisel verilerinin işlenmesi mümkündür: a) Kanunlarda açıkça öngörülmesi, b) Fiili imkânsızlık, c) Bir sözleşmenin kurulması veya ifası, d) Veri sorumlusunun hukuki yükümlülüğü, e) Alenileştirilmiş veriler, f) Bir hakkın tesisi, kullanılması veya korunması, g) Meşru menfaat.",
      explanation: "Açık rıza gerektirmeyen işleme hallerini düzenler.",
      relatedArticles: ["4", "6", "7"],
      practicalNotes: [
        "Meşru menfaat en sık kullanılan istisnadır",
        "Sözleşme istisnası dar yorumlanmalıdır",
        "Açık rıza her zaman geri alınabilir"
      ],
      keywords: ["açık rıza", "işleme", "meşru menfaat", "istisnalar"]
    },
    {
      number: "6",
      title: "Özel nitelikli kişisel verilerin işlenme şartları",
      content: "Kişilerin ırkı, etnik kökeni, siyasi düşüncesi, felsefi inancı, dini, mezhebi veya diğer inançları, kılık ve kıyafeti, dernek, vakıf ya da sendika üyeliği, sağlığı, cinsel hayatı, ceza mahkûmiyeti ve güvenlik tedbirleriyle ilgili verileri ile biyometrik ve genetik verileri özel nitelikli kişisel veridir.",
      explanation: "Hassas verilerin işlenme şartlarını düzenler.",
      relatedArticles: ["5", "7"],
      practicalNotes: [
        "Sağlık verileri ayrı düzenlenmiştir",
        "Açık rıza her durumda gerekli değildir",
        "Kurul kararlarıyla ek güvenlik önlemleri getirilmiştir"
      ],
      keywords: ["özel nitelikli veri", "hassas veri", "sağlık", "biyometrik"]
    },
    {
      number: "11",
      title: "İlgili kişinin hakları",
      content: "Herkes, veri sorumlusuna başvurarak kendisiyle ilgili; a) Kişisel veri işlenip işlenmediğini öğrenme, b) Kişisel verileri işlenmişse buna ilişkin bilgi talep etme, c) İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, ç) Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme, d) Düzeltilmesini isteme, e) Silinmesini veya yok edilmesini isteme, f) Otomatik sistemlerle analiz edilmesi halinde itiraz etme, g) Zarara uğraması hâlinde tazminat isteme haklarına sahiptir.",
      explanation: "İlgili kişinin haklarını düzenler (GDPR benzeri).",
      relatedArticles: ["12", "13", "14"],
      practicalNotes: [
        "30 gün içinde yanıt verilmelidir",
        "Başvuru önce veri sorumlusuna yapılır",
        "Kurula şikayet hakkı saklıdır"
      ],
      keywords: ["ilgili kişi hakları", "erişim", "düzeltme", "silme", "itiraz"]
    },
    {
      number: "18",
      title: "İdari para cezaları",
      content: "Bu Kanunda belirtilen yükümlülüklerin yerine getirilmemesi halinde idari para cezası uygulanır.",
      explanation: "KVKK ihlallerine ilişkin cezaları düzenler.",
      practicalNotes: [
        "2025 yılı için cezalar güncellendi",
        "VERBİS kayıt yükümlülüğü cezaları yüksek",
        "Tekrarlayan ihlallerde cezalar artırılır"
      ],
      keywords: ["ceza", "idari para cezası", "ihlal", "yaptırım"]
    }
  ]
};

// ============================================
// TÜM KANUNLARI BİRLEŞTİR
// ============================================
export const ALL_LAWS: Law[] = [
  TURK_BORCLAR_KANUNU,
  TURK_MEDENI_KANUNU,
  IS_KANUNU,
  TURK_CEZA_KANUNU,
  KVKK
];

// Kanun numarasına göre arama
export function getLawByNumber(number: string): Law | undefined {
  return ALL_LAWS.find(law => law.number === number);
}

// Kanun maddesine göre arama
export function getLawArticle(lawNumber: string, articleNumber: string): LawArticle | undefined {
  const law = getLawByNumber(lawNumber);
  return law?.articles.find(a => a.number === articleNumber);
}

// Anahtar kelimeye göre madde arama
export function searchArticlesByKeyword(keyword: string): Array<{ law: Law; article: LawArticle }> {
  const results: Array<{ law: Law; article: LawArticle }> = [];
  const normalizedKeyword = keyword.toLowerCase();

  for (const law of ALL_LAWS) {
    for (const article of law.articles) {
      const matchInTitle = article.title.toLowerCase().includes(normalizedKeyword);
      const matchInContent = article.content.toLowerCase().includes(normalizedKeyword);
      const matchInKeywords = article.keywords?.some(k => k.toLowerCase().includes(normalizedKeyword));

      if (matchInTitle || matchInContent || matchInKeywords) {
        results.push({ law, article });
      }
    }
  }

  return results;
}

// Kategoriye göre kanun listesi
export function getLawsByCategory(category: LawCategory): Law[] {
  return ALL_LAWS.filter(law => law.category === category);
}
