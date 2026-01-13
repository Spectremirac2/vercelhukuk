/**
 * Türk Hukuk Mevzuatı Veritabanı
 * 
 * Temel kanunlar, maddeler ve açıklamalar
 * AI sisteminin hukuki yorumlarını güçlendirir.
 */

export interface Law {
  id: string;
  name: string;
  shortName: string;
  number: string;
  publishDate: string;
  category: LawCategory;
  description: string;
  keyArticles: LawArticle[];
  amendments?: Amendment[];
  relatedLaws?: string[];
}

export interface LawArticle {
  number: string;
  title: string;
  content: string;
  explanation?: string;
  keywords: string[];
  practicalTips?: string[];
}

export interface Amendment {
  date: string;
  lawNumber: string;
  description: string;
  affectedArticles: string[];
}

export type LawCategory =
  | "temel_kanunlar"
  | "ozel_hukuk"
  | "kamu_hukuku"
  | "ceza_hukuku"
  | "usul_hukuku"
  | "is_hukuku"
  | "ticaret_hukuku"
  | "idare_hukuku"
  | "vergi_hukuku";

// ============================================
// TÜRK BORÇLAR KANUNU (TBK)
// ============================================
const TBK: Law = {
  id: "tbk",
  name: "Türk Borçlar Kanunu",
  shortName: "TBK",
  number: "6098",
  publishDate: "2011-02-04",
  category: "ozel_hukuk",
  description: "Borç ilişkilerinin kurulması, hükümleri ve sona ermesini düzenleyen temel kanun",
  keyArticles: [
    {
      number: "1",
      title: "Sözleşmenin Kurulması",
      content: "Sözleşme, tarafların iradelerini karşılıklı ve birbirine uygun olarak açıklamalarıyla kurulur.",
      explanation: "İrade uyumu prensibi gereği öneri ve kabul iradelerinin örtüşmesi gerekir. Susma kural olarak kabul sayılmaz.",
      keywords: ["sözleşme", "irade beyanı", "öneri", "kabul"],
      practicalTips: ["İrade beyanları açık veya örtülü olabilir", "Yazılı şekil aranmayan hallerde sözlü sözleşme geçerlidir"]
    },
    {
      number: "49",
      title: "Haksız Fiil - Genel Kurallar",
      content: "Kusurlu ve hukuka aykırı bir fiille başkasına zarar veren, bu zararı gidermekle yükümlüdür.",
      explanation: "Haksız fiilin unsurları: fiil, hukuka aykırılık, kusur, zarar ve illiyet bağı",
      keywords: ["haksız fiil", "kusur", "zarar", "tazminat"],
      practicalTips: [
        "Kusur kanıtlanamıyorsa kusursuz sorumluluk halleri araştırılmalı",
        "Maddi ve manevi zarar ayrımı yapılmalı"
      ]
    },
    {
      number: "56",
      title: "Manevi Tazminat",
      content: "Hâkim, bir kimsenin bedensel bütünlüğünün zedelenmesi durumunda, olayın özelliklerini göz önünde tutarak, zarar görene uygun bir miktar paranın manevi tazminat olarak ödenmesine karar verebilir.",
      explanation: "Manevi tazminat zenginleşme aracı değil, tatmin fonksiyonu görür",
      keywords: ["manevi tazminat", "bedensel zarar", "hakkaniyete", "uygun miktar"],
      practicalTips: [
        "Somut olayın özellikleri, tarafların ekonomik durumu dikkate alınır",
        "Ne sembolik ne de aşırı bir miktar olmamalı"
      ]
    },
    {
      number: "117",
      title: "Temerrüt",
      content: "Muaccel bir borcun borçlusu, alacaklının ihtarıyla temerrüde düşer.",
      explanation: "Belirli vadeli borçlarda ihtara gerek yoktur, vade gelince temerrüt oluşur",
      keywords: ["temerrüt", "ihtar", "muacceliyet", "vade"],
      practicalTips: [
        "Para borçlarında temerrüt faizi işlemeye başlar",
        "İfa edilememezlik rizikosunun borçluya geçmesi sonucunu doğurur"
      ]
    },
    {
      number: "344",
      title: "Kira Bedelinin Belirlenmesi",
      content: "Tarafların yenilenen kira dönemlerinde uygulanacak kira bedeline ilişkin anlaşmaları, bir önceki kira yılında tüketici fiyat endeksindeki on iki aylık ortalamalara göre değişim oranını geçmemek koşuluyla geçerlidir.",
      explanation: "Konut kiralarında artış üst sınırı TÜFE'dir (2024 itibariyle %25 üst sınırı da uygulanmaktadır)",
      keywords: ["kira artışı", "TÜFE", "kira bedeli", "yenileme"],
      practicalTips: [
        "İş yeri kiraları bu sınırlamaya tabi değildir",
        "5 yıldan uzun süreli kiralarda hâkim yeni kira bedeli belirleyebilir"
      ]
    },
    {
      number: "347",
      title: "Kiracının Fesih Hakkı",
      content: "Konut ve çatılı işyeri kiralarında kiracı, belirli süreli sözleşmelerin süresinin bitiminden en az on beş gün önce bildirimde bulunmadıkça, sözleşme aynı koşullarla bir yıl için uzatılmış sayılır.",
      explanation: "Kiracının fesih bildirimi 15 gün önceden yapılmalıdır. Kiraya veren ise süresi dolmadan fesih yapamaz.",
      keywords: ["kira feshi", "bildirim süresi", "sözleşme uzaması"],
      practicalTips: [
        "Bildirim noter aracılığıyla yapılması ispat kolaylığı sağlar",
        "Kiraya veren ancak kanunda sayılan hallerde tahliye davası açabilir"
      ]
    },
    {
      number: "417",
      title: "İşçinin Kişiliğinin Korunması",
      content: "İşveren, hizmet ilişkisinde işçinin kişiliğini korumak ve saygı göstermek ve işyerinde dürüstlük ilkelerine uygun bir düzeni sağlamakla... yükümlüdür.",
      explanation: "Mobbing (psikolojik taciz) de bu madde kapsamında değerlendirilir",
      keywords: ["işçi kişiliği", "koruma yükümlülüğü", "mobbing", "iş sağlığı"],
      practicalTips: [
        "İşverenin koruma yükümlülüğünü yerine getirmemesi tazminat sebebidir",
        "Mobbing iddiası sistematik davranışlar ile ispatlanabilir"
      ]
    }
  ],
  relatedLaws: ["TMK", "TTK", "İş Kanunu"]
};

// ============================================
// TÜRK MEDENİ KANUNU (TMK)
// ============================================
const TMK: Law = {
  id: "tmk",
  name: "Türk Medeni Kanunu",
  shortName: "TMK",
  number: "4721",
  publishDate: "2001-11-22",
  category: "ozel_hukuk",
  description: "Kişiler, aile, miras ve eşya hukuku alanlarını düzenleyen temel kanun",
  keyArticles: [
    {
      number: "23",
      title: "Kişiliğin Korunması",
      content: "Kimse, hak ve fiil ehliyetlerinden kısmen de olsa vazgeçemez. Kimse özgürlüklerinden vazgeçemez veya onları hukuka ya da ahlâka aykırı olarak sınırlayamaz.",
      explanation: "Kişilik hakları vazgeçilmez ve devredilmez niteliktedir",
      keywords: ["kişilik hakkı", "ehliyet", "özgürlük"],
      practicalTips: ["Kişilik haklarına saldırı halinde TBK m.58 ile tazminat talep edilebilir"]
    },
    {
      number: "166",
      title: "Evlilik Birliğinin Sarsılması (Şiddetli Geçimsizlik)",
      content: "Evlilik birliği, ortak hayatı sürdürmeleri kendilerinden beklenmeyecek derecede temelinden sarsılmış olursa, eşlerden her biri boşanma davası açabilir.",
      explanation: "En sık kullanılan boşanma sebebidir. Her iki eşin de kusurlu olması durumunda da dava açılabilir.",
      keywords: ["boşanma", "şiddetli geçimsizlik", "ortak hayat"],
      practicalTips: [
        "Kusur oranı tazminat ve nafaka taleplerini etkiler",
        "Dava açan taraf daha kusurlu ise davalı itiraz edebilir"
      ]
    },
    {
      number: "174",
      title: "Boşanmada Maddi ve Manevi Tazminat",
      content: "Mevcut veya beklenen menfaatleri boşanma yüzünden zedelenen kusursuz veya daha az kusurlu taraf, kusurlu taraftan uygun bir maddî tazminat isteyebilir.",
      explanation: "Tazminat için davacının kusursuz veya daha az kusurlu olması şarttır",
      keywords: ["boşanma tazminatı", "kusur", "maddi tazminat", "manevi tazminat"],
      practicalTips: ["Boşanma davasıyla birlikte veya ayrı dava olarak talep edilebilir"]
    },
    {
      number: "336",
      title: "Velayet",
      content: "Evlilik devam ettiği sürece ana ve baba velâyeti birlikte kullanırlar. Boşanma hâlinde hâkim, velâyeti eşlerden birine verebilir.",
      explanation: "Çocuğun üstün yararı esas alınır. Ortak velayet de artık uygulanmaktadır.",
      keywords: ["velayet", "boşanma", "çocuk", "ebeveyn"],
      practicalTips: [
        "Velayet kararı her zaman değiştirilebilir",
        "Velayeti almayan eşin kişisel ilişki hakkı mahkemece düzenlenir"
      ]
    },
    {
      number: "505",
      title: "Saklı Pay",
      content: "Mirasçı olarak altsoyu, ana ve babası veya eşi bulunan mirasbırakan, mirasının saklı paylar dışında kalan kısmında ölüme bağlı tasarrufta bulunabilir.",
      explanation: "Altsoy 1/2, eş 1/4, anne-baba 1/4 oranında saklı paya sahiptir",
      keywords: ["saklı pay", "miras", "ölüme bağlı tasarruf", "mirasçı"],
      practicalTips: [
        "Saklı payın ihlali halinde tenkis davası açılabilir",
        "2023 değişikliği ile anne-babanın saklı payı kaldırılmıştır"
      ]
    },
    {
      number: "683",
      title: "Mülkiyet Hakkının İçeriği",
      content: "Bir şeye malik olan kimse, hukuk düzeninin sınırları içinde, o şey üzerinde dilediği gibi kullanma, yararlanma ve tasarrufta bulunma yetkisine sahiptir.",
      explanation: "Mülkiyet hakkı anayasal güvence altındadır ancak kamu yararı ile sınırlanabilir",
      keywords: ["mülkiyet", "kullanma", "yararlanma", "tasarruf"],
      practicalTips: ["Komşuluk hukuku kapsamında bazı kısıtlamalar mevcuttur"]
    }
  ],
  relatedLaws: ["TBK", "Nüfus Hizmetleri Kanunu"]
};

// ============================================
// İŞ KANUNU
// ============================================
const IS_KANUNU: Law = {
  id: "is_kanunu",
  name: "İş Kanunu",
  shortName: "İK",
  number: "4857",
  publishDate: "2003-05-22",
  category: "is_hukuku",
  description: "İş sözleşmesi, işçi ve işveren ilişkilerini düzenleyen temel kanun",
  keyArticles: [
    {
      number: "17",
      title: "Süreli Fesih",
      content: "Belirsiz süreli iş sözleşmelerinin feshinden önce durumun diğer tarafa bildirilmesi gerekir. Bildirim süreleri işçinin kıdemine göre 2-8 hafta arasında değişir.",
      explanation: "Bildirim sürelerine uyulmaması halinde ihbar tazminatı ödenir",
      keywords: ["ihbar", "fesih bildirimi", "süre", "ihbar tazminatı"],
      practicalTips: [
        "6 aya kadar kıdem: 2 hafta",
        "6 ay-1.5 yıl: 4 hafta",
        "1.5-3 yıl: 6 hafta",
        "3 yıldan fazla: 8 hafta"
      ]
    },
    {
      number: "18",
      title: "Feshin Geçerli Sebebe Dayandırılması",
      content: "Otuz veya daha fazla işçi çalıştıran işyerlerinde en az altı aylık kıdemi olan işçinin belirsiz süreli iş sözleşmesinin feshi, geçerli bir sebebe dayanmak zorundadır.",
      explanation: "Geçerli sebepler: işçinin yetersizliği, davranışları veya işletme gerekleri olabilir",
      keywords: ["geçerli sebep", "iş güvencesi", "fesih"],
      practicalTips: [
        "Feshin son çare (ultima ratio) ilkesine uygun olması gerekir",
        "Performans düşüklüğü somut verilerle ispatlanmalı"
      ]
    },
    {
      number: "20",
      title: "Fesih Bildirimine İtiraz ve Usul",
      content: "İş sözleşmesi feshedilen işçi, fesih bildiriminde sebep gösterilmediği veya gösterilen sebebin geçerli olmadığı iddiası ile fesih bildiriminin tebliği tarihinden itibaren bir ay içinde arabuluculuğa başvurmak zorundadır.",
      explanation: "İşe iade davası için arabuluculuk zorunlu dava şartıdır",
      keywords: ["işe iade", "arabuluculuk", "süre", "dava şartı"],
      practicalTips: [
        "1 ay içinde arabuluculuğa başvurulmalı (hak düşürücü süre)",
        "Arabuluculuk tutanağından itibaren 2 hafta içinde dava açılmalı"
      ]
    },
    {
      number: "24",
      title: "İşçinin Haklı Nedenle Derhal Fesih Hakkı",
      content: "Sağlık sebepleri, ahlak ve iyi niyet kurallarına uymayan haller ve zorlayıcı sebepler işçiye haklı nedenle fesih hakkı verir.",
      explanation: "Haklı fesihte ihbar süresine gerek yoktur, kıdem tazminatı hakkı doğar",
      keywords: ["haklı fesih", "mobbing", "ücret ödememe", "kıdem tazminatı"],
      practicalTips: [
        "Ücreti 20 gün içinde ödenmeyen işçi haklı fesih yapabilir",
        "Mobbing sistematik ise haklı fesih sebebidir"
      ]
    },
    {
      number: "25",
      title: "İşverenin Haklı Nedenle Derhal Fesih Hakkı",
      content: "Sağlık sebepleri, ahlak ve iyi niyet kurallarına uymayan haller ve zorlayıcı sebepler işverene haklı nedenle fesih hakkı verir.",
      explanation: "II-ı bendindeki (ahlak ve iyi niyet) hallerde kıdem tazminatı ödenmez",
      keywords: ["haklı fesih", "işveren", "disiplin", "kıdem"],
      practicalTips: [
        "Fesih sebebinin öğrenilmesinden itibaren 6 iş günü içinde kullanılmalı",
        "Her halükarda 1 yıl içinde kullanılmalı (hak düşürücü süre)"
      ]
    },
    {
      number: "32",
      title: "Ücret ve Ücretin Ödenmesi",
      content: "Genel anlamda ücret bir kimseye bir iş karşılığında işveren veya üçüncü kişiler tarafından sağlanan ve para ile ödenen tutardır.",
      explanation: "Ücret ayda en az bir kez ve en geç ayın sonunda ödenir",
      keywords: ["ücret", "maaş", "ödeme", "banka"],
      practicalTips: [
        "Ücret ödemelerinin bankadan yapılması zorunludur (5 ve üzeri işçi)",
        "Fazla çalışma ücreti normal saat ücretinin %50 fazlasıdır"
      ]
    },
    {
      number: "41",
      title: "Fazla Çalışma",
      content: "Ülkenin genel yararları yahut işin niteliği veya üretimin artırılması gibi nedenlerle fazla çalışma yapılabilir. Fazla çalışma, haftalık 45 saati aşan çalışmalardır.",
      explanation: "Yılda en fazla 270 saat fazla çalışma yaptırılabilir",
      keywords: ["fazla çalışma", "mesai", "45 saat", "270 saat"],
      practicalTips: [
        "İşçinin yazılı onayı gereklidir",
        "Fazla çalışma yerine serbest zaman kullandırılabilir"
      ]
    }
  ],
  amendments: [
    {
      date: "2024-07-01",
      lawNumber: "7521",
      description: "Asgari ücretin vergi muafiyeti ve bazı değişiklikler",
      affectedArticles: ["32", "34"]
    }
  ],
  relatedLaws: ["TBK m.393-447", "SGK Kanunu", "İş Sağlığı ve Güvenliği Kanunu"]
};

// ============================================
// TÜRK CEZA KANUNU (TCK)
// ============================================
const TCK: Law = {
  id: "tck",
  name: "Türk Ceza Kanunu",
  shortName: "TCK",
  number: "5237",
  publishDate: "2004-09-26",
  category: "ceza_hukuku",
  description: "Suç ve cezaları düzenleyen temel ceza kanunu",
  keyArticles: [
    {
      number: "21",
      title: "Kast",
      content: "Suçun oluşması kastın varlığına bağlıdır. Kast, suçun kanunî tanımındaki unsurların bilerek ve istenerek gerçekleştirilmesidir.",
      explanation: "Olası kast: fail neticeyi öngörür ve kabullenir. Bu durumda ceza indirilir.",
      keywords: ["kast", "olası kast", "bilme", "isteme"],
      practicalTips: [
        "Olası kastta ceza 1/3'ten 1/2'ye kadar indirilir",
        "Doğrudan kast ve olası kast ayrımı önemli"
      ]
    },
    {
      number: "22",
      title: "Taksir",
      content: "Taksirle işlenen fiiller, kanunun açıkça belirttiği hallerde cezalandırılır. Taksir, dikkat ve özen yükümlülüğüne aykırılık dolayısıyla suçun öngörülmeyerek gerçekleştirilmesidir.",
      explanation: "Bilinçli taksir: fail neticeyi öngörür ama olmayacağını düşünür",
      keywords: ["taksir", "bilinçli taksir", "dikkat", "özen"],
      practicalTips: ["Bilinçli taksirde ceza artırılır", "Trafik kazaları genellikle taksirle işlenen suçlardır"]
    },
    {
      number: "29",
      title: "Haksız Tahrik",
      content: "Haksız bir fiilin meydana getirdiği hiddet veya şiddetli elemin etkisi altında suç işleyen kimseye, ağırlığına göre cezada indirim yapılır.",
      explanation: "Ağır tahrik: 1/4'ten 3/4'e kadar indirim",
      keywords: ["haksız tahrik", "hiddet", "elem", "indirim"],
      practicalTips: [
        "Tahrik eden kişiye karşı işlenen suçlarda uygulanır",
        "Tahrikin ağırlığı indirimi belirler"
      ]
    },
    {
      number: "81",
      title: "Kasten Öldürme",
      content: "Bir insanı kasten öldüren kişi, müebbet hapis cezası ile cezalandırılır.",
      explanation: "Nitelikli haller (m.82) halinde ağırlaştırılmış müebbet hapis verilir",
      keywords: ["adam öldürme", "kasten öldürme", "müebbet hapis"],
      practicalTips: [
        "Tasarlama halinde ağırlaştırılmış müebbet hapis",
        "Meşru müdafaa durumunda ceza verilmez"
      ]
    },
    {
      number: "125",
      title: "Hakaret",
      content: "Bir kimseye onur, şeref ve saygınlığını rencide edebilecek nitelikte somut bir fiil veya olgu isnat eden veya sövmek suretiyle bir kimsenin onur, şeref ve saygınlığına saldıran kişi cezalandırılır.",
      explanation: "Aleniyet halinde ceza artırılır. Kamu görevlisine hakaret şikayete bağlı değildir.",
      keywords: ["hakaret", "sövme", "onur", "şeref", "sosyal medya"],
      practicalTips: [
        "Haksız fiilin ispatı durumunda ceza verilmez",
        "Sosyal medyada herkese açık paylaşımlar aleniyet taşır"
      ]
    },
    {
      number: "136",
      title: "Verileri Hukuka Aykırı Olarak Verme veya Ele Geçirme",
      content: "Kişisel verileri, hukuka aykırı olarak bir başkasına veren, yayan veya ele geçiren kişi, iki yıldan dört yıla kadar hapis cezası ile cezalandırılır.",
      explanation: "KVKK ihlalleri de bu madde kapsamında değerlendirilir",
      keywords: ["kişisel veri", "veri ihlali", "KVKK", "hukuka aykırı"],
      practicalTips: [
        "Veri sorumlusunun yükümlülüklerini yerine getirmemesi suç oluşturabilir",
        "Özel nitelikli veriler için ceza daha ağır"
      ]
    }
  ],
  relatedLaws: ["CMK", "CGİK", "KVKK"]
};

// ============================================
// KİŞİSEL VERİLERİN KORUNMASI KANUNU (KVKK)
// ============================================
const KVKK: Law = {
  id: "kvkk",
  name: "Kişisel Verilerin Korunması Kanunu",
  shortName: "KVKK",
  number: "6698",
  publishDate: "2016-04-07",
  category: "kamu_hukuku",
  description: "Kişisel verilerin işlenmesi ve korunmasına ilişkin temel kanun",
  keyArticles: [
    {
      number: "3",
      title: "Tanımlar",
      content: "Kişisel veri: Kimliği belirli veya belirlenebilir gerçek kişiye ilişkin her türlü bilgiyi ifade eder.",
      explanation: "İsim, TC kimlik no, e-posta, IP adresi, konum bilgisi vb. kişisel veri kapsamındadır",
      keywords: ["kişisel veri", "tanım", "açık rıza", "ilgili kişi"],
      practicalTips: [
        "Anonim veriler KVKK kapsamında değildir",
        "Pseudonim veriler hala kişisel veri sayılır"
      ]
    },
    {
      number: "5",
      title: "Kişisel Verilerin İşlenme Şartları",
      content: "Kişisel veriler ilgili kişinin açık rızası olmaksızın işlenemez. Ancak kanunda sayılan hallerde açık rıza aranmaz.",
      explanation: "İstisnalar: kanuni yükümlülük, sözleşmenin ifası, meşru menfaat vb.",
      keywords: ["açık rıza", "işlenme şartı", "istisna", "meşru menfaat"],
      practicalTips: [
        "Açık rıza belirli konuya ilişkin ve bilgilendirilmiş olmalı",
        "Çalışan verilerinde sözleşmenin ifası istisnası sıkça kullanılır"
      ]
    },
    {
      number: "6",
      title: "Özel Nitelikli Kişisel Veriler",
      content: "Kişilerin ırkı, etnik kökeni, siyasi düşüncesi, dini, mezhebi, kılık kıyafeti, dernek vakıf ve sendika üyeliği, sağlığı, cinsel hayatı, ceza mahkumiyeti ve biyometrik verileri özel nitelikli veridir.",
      explanation: "Özel nitelikli verilerin işlenmesi daha sıkı kurallara tabidir",
      keywords: ["özel nitelikli veri", "sağlık verisi", "biyometrik", "hassas veri"],
      practicalTips: [
        "Sağlık verileri ancak sır saklama yükümlülüğü olanlar tarafından işlenebilir",
        "Biyometrik veriler için açık rıza gerekir"
      ]
    },
    {
      number: "11",
      title: "İlgili Kişinin Hakları",
      content: "İlgili kişi, veri sorumlusuna başvurarak kendisiyle ilgili; kişisel veri işlenip işlenmediğini öğrenme, düzeltilmesini isteme, silinmesini isteme haklarına sahiptir.",
      explanation: "GDPR'daki haklara paralel haklar tanınmıştır",
      keywords: ["ilgili kişi hakları", "silme", "düzeltme", "itiraz"],
      practicalTips: [
        "Başvuru 30 gün içinde cevaplanmalı",
        "Ret halinde Kurul'a şikayet hakkı vardır"
      ]
    },
    {
      number: "18",
      title: "Kabahatler",
      content: "Aydınlatma yükümlülüğünü yerine getirmeyenlere 5.000-100.000 TL, veri güvenliğini sağlamayanlara 15.000-1.000.000 TL idari para cezası verilir.",
      explanation: "2025 yılı için ceza miktarları yeniden değerleme ile güncellenir",
      keywords: ["idari para cezası", "yaptırım", "aydınlatma", "güvenlik"],
      practicalTips: [
        "Kurul'un karar tarihindeki ceza tarifesi uygulanır",
        "Veri ihlali bildirimi 72 saat içinde yapılmalı"
      ]
    }
  ],
  amendments: [
    {
      date: "2025-01-01",
      lawNumber: "7253",
      description: "SMS doğrulama kodu düzenlemesi ve ceza güncellemeleri",
      affectedArticles: ["6", "18"]
    }
  ],
  relatedLaws: ["TCK m.135-140", "Elektronik Haberleşme Kanunu"]
};

// ============================================
// TÜKETİCİNİN KORUNMASI HAKKINDA KANUN
// ============================================
const TUKETICI_KANUNU: Law = {
  id: "tkhk",
  name: "Tüketicinin Korunması Hakkında Kanun",
  shortName: "TKHK",
  number: "6502",
  publishDate: "2013-11-28",
  category: "ozel_hukuk",
  description: "Tüketici işlemleri ve tüketici haklarını düzenleyen kanun",
  keyArticles: [
    {
      number: "4",
      title: "Sözleşmedeki Haksız Şartlar",
      content: "Tüketiciyle müzakere edilmeden sözleşmeye dahil edilen ve tarafların hak ve yükümlülüklerinde iyi niyet kuralına aykırı düşecek biçimde dengesizliğe neden olan sözleşme şartları haksız şarttır.",
      explanation: "Haksız şartlar kesin hükümsüzdür",
      keywords: ["haksız şart", "standart sözleşme", "tüketici", "müzakere"],
      practicalTips: [
        "Matbu sözleşmelerdeki küçük puntolu şartlar denetlenir",
        "Tüketici aleyhine tek taraflı değişiklik hakkı haksız şarttır"
      ]
    },
    {
      number: "11",
      title: "Ayıplı Mal",
      content: "Ayıplı mal, tüketiciye teslimi anında, taraflarca kararlaştırılmış olan örnek ya da modele uygun olmaması veya nesnel olarak sahip olması gereken özellikleri taşımaması nedeniyle sözleşmeye aykırı olan maldır.",
      explanation: "Tüketici, ücretsiz onarım, değişim, indirim veya sözleşmeden dönme haklarına sahiptir",
      keywords: ["ayıplı mal", "garanti", "değişim", "onarım"],
      practicalTips: [
        "Ayıp 2 yıl içinde ortaya çıkmalı",
        "İlk 6 ayda ayıp karinesi tüketici lehinedir"
      ]
    },
    {
      number: "43",
      title: "Mesafeli Sözleşmeler",
      content: "Mesafeli sözleşme; satıcı veya sağlayıcı ile tüketicinin eş zamanlı fiziksel varlığı olmaksızın, mal veya hizmetlerin uzaktan pazarlanmasına yönelik olarak oluşturulmuş bir sistem çerçevesinde kurulan sözleşmelerdir.",
      explanation: "14 gün içinde cayma hakkı mevcuttur",
      keywords: ["mesafeli satış", "e-ticaret", "cayma hakkı", "internet"],
      practicalTips: [
        "Cayma hakkı bazı ürünlerde kullanılamaz (kişiselleştirilmiş ürünler, gıda vb.)",
        "Cayma bildirimi herhangi bir şekilde yapılabilir"
      ]
    },
    {
      number: "48",
      title: "Tüketici Kredileri",
      content: "Tüketici kredisi sözleşmesi, kredi verenin tüketiciye faiz veya benzeri bir menfaat karşılığında ödemenin ertelenmesi, ödünç veya benzeri finansman şekilleri aracılığıyla kredi verdiği sözleşmedir.",
      explanation: "Erken ödeme hakkı, toplam kredi maliyeti bilgilendirmesi zorunludur",
      keywords: ["tüketici kredisi", "erken ödeme", "faiz", "TKHK"],
      practicalTips: [
        "Erken ödeme komisyonu kalan tutar üzerinden en fazla %1'dir",
        "Konut kredilerinde %2"
      ]
    }
  ],
  relatedLaws: ["TBK", "Mesafeli Sözleşmeler Yönetmeliği"]
};

// ============================================
// TÜM KANUNLARI BİRLEŞTİR
// ============================================
export const ALL_LAWS: Law[] = [
  TBK,
  TMK,
  IS_KANUNU,
  TCK,
  KVKK,
  TUKETICI_KANUNU
];

// Kanun adına veya kısaltmasına göre ara
export function getLawByIdOrShortName(idOrShortName: string): Law | undefined {
  const normalized = idOrShortName.toLowerCase();
  return ALL_LAWS.find(
    law =>
      law.id.toLowerCase() === normalized ||
      law.shortName.toLowerCase() === normalized ||
      law.name.toLowerCase().includes(normalized)
  );
}

// Kategoriye göre kanunları getir
export function getLawsByCategory(category: LawCategory): Law[] {
  return ALL_LAWS.filter(law => law.category === category);
}

// Anahtar kelimeye göre madde ara
export function searchArticles(keyword: string): Array<{ law: Law; article: LawArticle }> {
  const results: Array<{ law: Law; article: LawArticle }> = [];
  const normalizedKeyword = keyword.toLowerCase();

  for (const law of ALL_LAWS) {
    for (const article of law.keyArticles) {
      if (
        article.title.toLowerCase().includes(normalizedKeyword) ||
        article.content.toLowerCase().includes(normalizedKeyword) ||
        article.explanation?.toLowerCase().includes(normalizedKeyword) ||
        article.keywords.some(k => k.toLowerCase().includes(normalizedKeyword))
      ) {
        results.push({ law, article });
      }
    }
  }

  return results;
}

// Madde numarasına göre ara (örn: "TBK m.49")
export function getArticleByReference(reference: string): { law: Law; article: LawArticle } | undefined {
  const match = reference.match(/^(\w+)\s*[mM]\.?\s*(\d+)/);
  if (!match) return undefined;

  const [, lawRef, articleNum] = match;
  const law = getLawByIdOrShortName(lawRef);
  if (!law) return undefined;

  const article = law.keyArticles.find(a => a.number === articleNum);
  if (!article) return undefined;

  return { law, article };
}
