/**
 * AI-Powered Legal Document Template Generator
 * Based on 2025-2026 legal AI trends: RAG, conditional logic, dynamic data merging
 * Supports Turkish legal documents with jurisdiction-specific templates
 */

// Document template types
export type DocumentTemplateType =
  | "is_sozlesmesi"
  | "kira_sozlesmesi"
  | "hizmet_sozlesmesi"
  | "gizlilik_sozlesmesi"
  | "vekaletname"
  | "ihtarname"
  | "sulh_protokolu"
  | "sirket_ana_sozlesmesi"
  | "ortaklik_sozlesmesi"
  | "satis_sozlesmesi"
  | "borc_senedi"
  | "kefalet_sozlesmesi"
  | "franchise_sozlesmesi"
  | "lisans_sozlesmesi"
  | "kvkk_aydinlatma"
  | "kvkk_acik_riza";

export interface DocumentVariable {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "multiline" | "currency" | "boolean";
  required: boolean;
  defaultValue?: string | number | boolean;
  options?: string[]; // For select type
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  helpText?: string;
  section?: string;
}

export interface ConditionalClause {
  id: string;
  condition: string; // Variable name or expression
  trueContent: string;
  falseContent?: string;
  description: string;
}

export interface DocumentTemplate {
  id: DocumentTemplateType;
  name: string;
  description: string;
  category: "is_hukuku" | "ticaret_hukuku" | "borçlar_hukuku" | "kvkk" | "genel";
  variables: DocumentVariable[];
  conditionalClauses: ConditionalClause[];
  template: string;
  legalBasis: string[];
  requiredAttachments?: string[];
  version: string;
  lastUpdated: string;
}

export interface GeneratedDocument {
  id: string;
  templateType: DocumentTemplateType;
  templateName: string;
  content: string;
  variables: Record<string, string | number | boolean>;
  generatedAt: Date;
  warnings: string[];
  suggestions: string[];
  legalReferences: string[];
  wordCount: number;
  estimatedPages: number;
}

// Document templates database
const documentTemplates: DocumentTemplate[] = [
  {
    id: "is_sozlesmesi",
    name: "İş Sözleşmesi",
    description: "4857 sayılı İş Kanunu'na uygun belirsiz/belirli süreli iş sözleşmesi",
    category: "is_hukuku",
    version: "2.0",
    lastUpdated: "2025-01-01",
    legalBasis: ["4857 sayılı İş Kanunu", "6098 sayılı TBK"],
    variables: [
      {
        name: "isverenUnvan",
        label: "İşveren Unvanı",
        type: "text",
        required: true,
        placeholder: "ABC Teknoloji A.Ş.",
        section: "Taraflar",
      },
      {
        name: "isverenAdres",
        label: "İşveren Adresi",
        type: "multiline",
        required: true,
        section: "Taraflar",
      },
      {
        name: "isverenVergiNo",
        label: "İşveren Vergi No",
        type: "text",
        required: true,
        validation: { minLength: 10, maxLength: 11 },
        section: "Taraflar",
      },
      {
        name: "isciAdi",
        label: "İşçi Adı Soyadı",
        type: "text",
        required: true,
        section: "Taraflar",
      },
      {
        name: "isciTcNo",
        label: "İşçi TC Kimlik No",
        type: "text",
        required: true,
        validation: { minLength: 11, maxLength: 11 },
        section: "Taraflar",
      },
      {
        name: "isciAdres",
        label: "İşçi Adresi",
        type: "multiline",
        required: true,
        section: "Taraflar",
      },
      {
        name: "gorevTanimi",
        label: "Görev Tanımı",
        type: "text",
        required: true,
        placeholder: "Yazılım Geliştirici",
        section: "İş Tanımı",
      },
      {
        name: "calismaYeri",
        label: "Çalışma Yeri",
        type: "text",
        required: true,
        section: "İş Tanımı",
      },
      {
        name: "sozlesmeTuru",
        label: "Sözleşme Türü",
        type: "select",
        required: true,
        options: ["Belirsiz Süreli", "Belirli Süreli"],
        defaultValue: "Belirsiz Süreli",
        section: "Süre",
      },
      {
        name: "baslangicTarihi",
        label: "İşe Başlangıç Tarihi",
        type: "date",
        required: true,
        section: "Süre",
      },
      {
        name: "bitisTarihi",
        label: "Sözleşme Bitiş Tarihi",
        type: "date",
        required: false,
        helpText: "Sadece belirli süreli sözleşmelerde doldurunuz",
        section: "Süre",
      },
      {
        name: "denemeSuresi",
        label: "Deneme Süresi (Ay)",
        type: "number",
        required: false,
        defaultValue: 2,
        validation: { min: 0, max: 4 },
        helpText: "İş Kanunu'na göre en fazla 2 ay (toplu iş sözleşmesiyle 4 ay)",
        section: "Süre",
      },
      {
        name: "brutUcret",
        label: "Brüt Ücret (TL)",
        type: "currency",
        required: true,
        validation: { min: 22104 }, // 2025 asgari ücret tahmini
        helpText: "Asgari ücretten az olamaz",
        section: "Ücret",
      },
      {
        name: "ucretOdemeDonemi",
        label: "Ücret Ödeme Dönemi",
        type: "select",
        required: true,
        options: ["Aylık", "Haftalık"],
        defaultValue: "Aylık",
        section: "Ücret",
      },
      {
        name: "haftalikCalisma",
        label: "Haftalık Çalışma Saati",
        type: "number",
        required: true,
        defaultValue: 45,
        validation: { min: 1, max: 45 },
        helpText: "İş Kanunu'na göre en fazla 45 saat",
        section: "Çalışma Koşulları",
      },
      {
        name: "yillikIzin",
        label: "Yıllık İzin (Gün)",
        type: "number",
        required: true,
        defaultValue: 14,
        validation: { min: 14 },
        helpText: "1-5 yıl arası en az 14 gün",
        section: "Çalışma Koşulları",
      },
      {
        name: "gizlilikMaddesi",
        label: "Gizlilik Maddesi Eklensin mi?",
        type: "boolean",
        required: false,
        defaultValue: true,
        section: "Ek Maddeler",
      },
      {
        name: "rekabetYasagi",
        label: "Rekabet Yasağı Eklensin mi?",
        type: "boolean",
        required: false,
        defaultValue: false,
        helpText: "TBK m.444-447'ye göre sınırlamalara tabidir",
        section: "Ek Maddeler",
      },
      {
        name: "rekabetSuresi",
        label: "Rekabet Yasağı Süresi (Yıl)",
        type: "number",
        required: false,
        validation: { min: 0, max: 2 },
        helpText: "En fazla 2 yıl olabilir",
        section: "Ek Maddeler",
      },
    ],
    conditionalClauses: [
      {
        id: "belirli_sure",
        condition: "sozlesmeTuru === 'Belirli Süreli'",
        trueContent:
          "İşbu sözleşme {{bitisTarihi}} tarihinde kendiliğinden sona erecek olup, tarafların yazılı mutabakatı olmaksızın yenilenmeyecektir.",
        falseContent:
          "İşbu sözleşme belirsiz süreli olup, taraflardan birinin feshi bildirmesine kadar yürürlükte kalacaktır.",
        description: "Sözleşme süresi maddesi",
      },
      {
        id: "deneme_suresi",
        condition: "denemeSuresi > 0",
        trueContent:
          "Taraflar arasında {{denemeSuresi}} aylık deneme süresi kararlaştırılmıştır. Deneme süresi içinde taraflardan her biri, ihbar süresine gerek olmaksızın sözleşmeyi feshedebilir.",
        description: "Deneme süresi maddesi",
      },
      {
        id: "gizlilik",
        condition: "gizlilikMaddesi",
        trueContent: `GİZLİLİK YÜKÜMLÜLÜĞÜ

İşçi, iş ilişkisi süresince ve sona erdikten sonra da işverenin ticari sırlarını, müşteri bilgilerini, teknik bilgilerini ve diğer gizli bilgilerini korumakla yükümlüdür. Bu yükümlülüğe aykırı davranan işçi, işverenin uğradığı tüm zararları tazmin etmekle yükümlüdür.`,
        description: "Gizlilik maddesi",
      },
      {
        id: "rekabet_yasagi",
        condition: "rekabetYasagi",
        trueContent: `REKABET YASAĞI

TBK m.444-447 hükümleri çerçevesinde, işçi iş sözleşmesinin sona ermesinden itibaren {{rekabetSuresi}} yıl süreyle işverenle rekabet teşkil edecek faaliyetlerde bulunmamayı kabul eder. Rekabet yasağı, işverenin faaliyet gösterdiği coğrafi alan ile sınırlıdır.

Bu yasağa aykırı davranan işçi, işverenin uğradığı zararları tazmin etmekle yükümlüdür.`,
        description: "Rekabet yasağı maddesi",
      },
    ],
    template: `İŞ SÖZLEŞMESİ

TARAFLAR

1. İŞVEREN
Unvan: {{isverenUnvan}}
Adres: {{isverenAdres}}
Vergi No: {{isverenVergiNo}}

2. İŞÇİ
Adı Soyadı: {{isciAdi}}
TC Kimlik No: {{isciTcNo}}
Adres: {{isciAdres}}

İşbu iş sözleşmesi, yukarıda bilgileri yazılı taraflar arasında aşağıdaki koşullarla akdedilmiştir.

MADDE 1 - KONU VE ÇALIŞMA YERİ

İşçi, {{gorevTanimi}} unvanıyla {{calismaYeri}} adresinde çalışacaktır. İşveren, işin gereği olarak işçinin çalışma yerini değiştirebilir.

MADDE 2 - SÖZLEŞME SÜRESİ

İşe başlama tarihi: {{baslangicTarihi}}

{{#belirli_sure}}

{{#deneme_suresi}}

MADDE 3 - ÜCRET VE ÖDEME

İşçinin brüt ücreti aylık {{brutUcret}} TL olarak belirlenmiştir. Ücret {{ucretOdemeDonemi}} olarak, takip eden ayın ilk 5 (beş) işgünü içinde işçinin banka hesabına yatırılarak ödenecektir.

MADDE 4 - ÇALIŞMA SÜRESİ

Haftalık normal çalışma süresi {{haftalikCalisma}} saattir. Çalışma saatleri işveren tarafından belirlenir ve işin gereğine göre değiştirilebilir. Fazla çalışma, İş Kanunu hükümlerine göre uygulanır.

MADDE 5 - YILLIK İZİN

İşçi, yılda {{yillikIzin}} gün ücretli yıllık izin hakkına sahiptir. Yıllık izin kullanım zamanı, işveren tarafından iş durumuna göre belirlenir.

MADDE 6 - FESİH

Taraflar, sözleşmeyi İş Kanunu'nda belirtilen ihbar sürelerine uyarak feshedebilir. Haklı nedenle derhal fesih hakkı saklıdır.

{{#gizlilik}}

{{#rekabet_yasagi}}

MADDE 7 - KİŞİSEL VERİLERİN KORUNMASI

İşçi, KVKK kapsamında işverenin müşteri ve çalışan verilerini korumakla yükümlüdür. İşveren, işçinin kişisel verilerini KVKK'ya uygun şekilde işleyecektir.

MADDE 8 - DİĞER HÜKÜMLER

1. İşbu sözleşmede hüküm bulunmayan hallerde 4857 sayılı İş Kanunu ve ilgili mevzuat hükümleri uygulanır.
2. Taraflar, sözleşmede belirtilen adresleri tebligat adresi olarak kabul ederler.
3. Uyuşmazlıklarda işyerinin bulunduğu yer mahkemeleri ve icra daireleri yetkilidir.

İşbu sözleşme, 2 (iki) nüsha olarak düzenlenmiş olup, taraflar yukarıdaki koşulları okuduklarını, anladıklarını ve kabul ettiklerini beyan ederler.

İŞVEREN                                     İŞÇİ
{{isverenUnvan}}                            {{isciAdi}}
Tarih: {{baslangicTarihi}}                  Tarih: {{baslangicTarihi}}
İmza:                                       İmza:`,
  },
  {
    id: "kira_sozlesmesi",
    name: "Konut Kira Sözleşmesi",
    description: "6098 sayılı TBK'ya uygun konut kira sözleşmesi",
    category: "borçlar_hukuku",
    version: "1.5",
    lastUpdated: "2025-01-01",
    legalBasis: ["6098 sayılı TBK (Kira Hükümleri)", "634 sayılı Kat Mülkiyeti Kanunu"],
    variables: [
      {
        name: "kirayaVerenAdi",
        label: "Kiraya Veren Adı Soyadı",
        type: "text",
        required: true,
        section: "Taraflar",
      },
      {
        name: "kirayaVerenTcNo",
        label: "Kiraya Veren TC No",
        type: "text",
        required: true,
        validation: { minLength: 11, maxLength: 11 },
        section: "Taraflar",
      },
      {
        name: "kirayaVerenAdres",
        label: "Kiraya Veren Adresi",
        type: "multiline",
        required: true,
        section: "Taraflar",
      },
      {
        name: "kiraciAdi",
        label: "Kiracı Adı Soyadı",
        type: "text",
        required: true,
        section: "Taraflar",
      },
      {
        name: "kiraciTcNo",
        label: "Kiracı TC No",
        type: "text",
        required: true,
        validation: { minLength: 11, maxLength: 11 },
        section: "Taraflar",
      },
      {
        name: "kiraciAdres",
        label: "Kiracı İletişim Adresi",
        type: "multiline",
        required: true,
        section: "Taraflar",
      },
      {
        name: "tasinmazAdres",
        label: "Kiralanan Taşınmaz Adresi",
        type: "multiline",
        required: true,
        section: "Kiralanan",
      },
      {
        name: "tasinmazNitelik",
        label: "Taşınmaz Niteliği",
        type: "select",
        required: true,
        options: ["Konut", "İşyeri", "Depo"],
        defaultValue: "Konut",
        section: "Kiralanan",
      },
      {
        name: "odaSayisi",
        label: "Oda Sayısı",
        type: "text",
        required: true,
        placeholder: "3+1",
        section: "Kiralanan",
      },
      {
        name: "metrekare",
        label: "Brüt m²",
        type: "number",
        required: true,
        section: "Kiralanan",
      },
      {
        name: "kiraBaslangic",
        label: "Kira Başlangıç Tarihi",
        type: "date",
        required: true,
        section: "Süre ve Bedel",
      },
      {
        name: "kiraSuresi",
        label: "Kira Süresi (Yıl)",
        type: "number",
        required: true,
        defaultValue: 1,
        validation: { min: 1 },
        section: "Süre ve Bedel",
      },
      {
        name: "aylikKira",
        label: "Aylık Kira Bedeli (TL)",
        type: "currency",
        required: true,
        section: "Süre ve Bedel",
      },
      {
        name: "odemeGunu",
        label: "Ödeme Günü",
        type: "number",
        required: true,
        defaultValue: 1,
        validation: { min: 1, max: 31 },
        helpText: "Her ayın kaçıncı günü",
        section: "Süre ve Bedel",
      },
      {
        name: "depozito",
        label: "Depozito (Aylık Kira Çarpanı)",
        type: "number",
        required: true,
        defaultValue: 2,
        validation: { min: 0, max: 3 },
        helpText: "Genellikle 2-3 aylık kira bedeli",
        section: "Süre ve Bedel",
      },
      {
        name: "aidatDahil",
        label: "Aidat Kiraya Dahil mi?",
        type: "boolean",
        required: false,
        defaultValue: false,
        section: "Giderler",
      },
      {
        name: "esyali",
        label: "Eşyalı mı?",
        type: "boolean",
        required: false,
        defaultValue: false,
        section: "Ek Bilgiler",
      },
    ],
    conditionalClauses: [
      {
        id: "esya_listesi",
        condition: "esyali",
        trueContent: `EŞYA LİSTESİ

Kiralanan taşınmaz eşyalı olarak teslim edilmektedir. Mevcut eşyaların listesi sözleşme ekinde (EK-1) yer almaktadır. Kiracı, eşyaları teslim aldığı durumda iade etmekle yükümlüdür.`,
        description: "Eşyalı kiralama maddesi",
      },
      {
        id: "aidat",
        condition: "aidatDahil",
        trueContent:
          "Site/apartman aidatı kira bedeline dahildir.",
        falseContent:
          "Site/apartman aidatı kiracı tarafından ayrıca ödenecektir.",
        description: "Aidat maddesi",
      },
    ],
    template: `KONUT KİRA SÖZLEŞMESİ

TARAFLAR

1. KİRAYA VEREN
Adı Soyadı: {{kirayaVerenAdi}}
TC Kimlik No: {{kirayaVerenTcNo}}
Adres: {{kirayaVerenAdres}}

2. KİRACI
Adı Soyadı: {{kiraciAdi}}
TC Kimlik No: {{kiraciTcNo}}
İletişim Adresi: {{kiraciAdres}}

MADDE 1 - KİRALANAN TAŞINMAZ

Adres: {{tasinmazAdres}}
Nitelik: {{tasinmazNitelik}}
Oda Sayısı: {{odaSayisi}}
Brüt Alan: {{metrekare}} m²

MADDE 2 - KİRA SÜRESİ

Kira süresi {{kiraSuresi}} yıl olup, {{kiraBaslangic}} tarihinde başlayacaktır. Süre sonunda, taraflardan biri sözleşme bitiminden en az 15 gün önce yazılı bildirimde bulunmadıkça sözleşme aynı koşullarla 1 yıl uzamış sayılır.

MADDE 3 - KİRA BEDELİ VE ÖDEME

Aylık kira bedeli {{aylikKira}} TL olup, her ayın {{odemeGunu}}. günü peşin olarak kiraya verenin bildireceği banka hesabına ödenecektir.

Yıllık kira artışı, TÜFE oranını geçmemek üzere taraflarca belirlenecektir. TBK m.344 gereği konut kiralarında artış TÜFE ile sınırlıdır.

MADDE 4 - DEPOZİTO

Kiracı, {{depozito}} aylık kira bedeli tutarında ({{depozito * aylikKira}} TL) depozitoyu sözleşme imzası sırasında kiraya verene ödeyecektir. Depozito, kira sözleşmesinin sona ermesinde, kiralananın hasarsız teslimi ve borçların ödenmesi halinde kiracıya iade edilecektir.

MADDE 5 - GİDERLER

{{#aidat}}

Elektrik, su, doğalgaz ve internet giderleri kiracı tarafından ödenecektir.

MADDE 6 - KULLANIM

Kiracı, kiralananı özenle kullanacak ve komşulara rahatsızlık vermeyecektir. Kiralananı başkasına devredemez veya alt kiraya veremez.

{{#esya_listesi}}

MADDE 7 - TADİLAT VE DEĞİŞİKLİK

Kiracı, kiraya verenin yazılı izni olmadan taşınmazda tadilat yapamaz. İzinle yapılan tadilatlar tahliye sırasında kiraya verene bırakılır.

MADDE 8 - TAHLİYE

Kiracı, kira süresi sonunda veya fesih halinde taşınmazı aldığı gibi teslim edecektir. TBK m.350 ve devamı hükümlerine göre tahliye sebepleri geçerlidir.

MADDE 9 - TEBLİGAT

Taraflar, sözleşmede yazılı adresleri tebligat adresi olarak kabul ederler. Adres değişikliği yazılı olarak bildirilecektir.

MADDE 10 - UYUŞMAZLIK

İşbu sözleşmeden doğan uyuşmazlıklarda taşınmazın bulunduğu yer mahkemeleri ve icra daireleri yetkilidir.

İşbu sözleşme 2 nüsha olarak düzenlenmiştir.

KİRAYA VEREN                                KİRACI
{{kirayaVerenAdi}}                          {{kiraciAdi}}
Tarih:                                      Tarih:
İmza:                                       İmza:`,
  },
  {
    id: "kvkk_aydinlatma",
    name: "KVKK Aydınlatma Metni",
    description: "6698 sayılı KVKK'ya uygun aydınlatma metni şablonu",
    category: "kvkk",
    version: "2.0",
    lastUpdated: "2025-01-01",
    legalBasis: ["6698 sayılı KVKK m.10", "Aydınlatma Yükümlülüğünün Yerine Getirilmesi Hakkında Tebliğ"],
    variables: [
      {
        name: "veriSorumlusu",
        label: "Veri Sorumlusu Unvanı",
        type: "text",
        required: true,
        section: "Veri Sorumlusu",
      },
      {
        name: "veriSorumlusuAdres",
        label: "Veri Sorumlusu Adresi",
        type: "multiline",
        required: true,
        section: "Veri Sorumlusu",
      },
      {
        name: "veriSorumlusuEmail",
        label: "Veri Sorumlusu E-posta",
        type: "text",
        required: true,
        section: "Veri Sorumlusu",
      },
      {
        name: "verbisNo",
        label: "VERBİS Kayıt No",
        type: "text",
        required: false,
        helpText: "VERBİS'e kayıtlıysanız",
        section: "Veri Sorumlusu",
      },
      {
        name: "veriKategorileri",
        label: "İşlenen Veri Kategorileri",
        type: "multiline",
        required: true,
        placeholder: "Kimlik, İletişim, Finans...",
        section: "Veri İşleme",
      },
      {
        name: "islemeAmaclari",
        label: "Veri İşleme Amaçları",
        type: "multiline",
        required: true,
        section: "Veri İşleme",
      },
      {
        name: "aktarimYapilacaklar",
        label: "Verilerin Aktarılacağı Taraflar",
        type: "multiline",
        required: true,
        section: "Veri Aktarımı",
      },
      {
        name: "yurtdisiAktarim",
        label: "Yurtdışına Aktarım Var mı?",
        type: "boolean",
        required: false,
        defaultValue: false,
        section: "Veri Aktarımı",
      },
      {
        name: "saklaSuresi",
        label: "Veri Saklama Süresi",
        type: "text",
        required: true,
        placeholder: "Yasal süre + 1 yıl",
        section: "Saklama",
      },
    ],
    conditionalClauses: [
      {
        id: "yurtdisi",
        condition: "yurtdisiAktarim",
        trueContent: `YURTDIŞINA VERİ AKTARIMI

Kişisel verileriniz, yukarıda belirtilen amaçlar doğrultusunda yeterli korumaya sahip ülkelere veya açık rızanızın bulunması halinde diğer ülkelere aktarılabilir. Yurtdışına aktarımda KVKK m.9 hükümlerine uygun hareket edilmektedir.`,
        description: "Yurtdışı aktarım maddesi",
      },
      {
        id: "verbis",
        condition: "verbisNo",
        trueContent: "VERBİS Kayıt Numarası: {{verbisNo}}",
        description: "VERBİS bilgisi",
      },
    ],
    template: `KİŞİSEL VERİLERİN İŞLENMESİNE İLİŞKİN AYDINLATMA METNİ

{{veriSorumlusu}} ("Şirket") olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla, kişisel verilerinizin işlenmesine ilişkin sizi aydınlatmak istiyoruz.

1. VERİ SORUMLUSU

{{veriSorumlusu}}
Adres: {{veriSorumlusuAdres}}
E-posta: {{veriSorumlusuEmail}}
{{#verbis}}

2. İŞLENEN KİŞİSEL VERİ KATEGORİLERİ

{{veriKategorileri}}

3. KİŞİSEL VERİLERİN İŞLENME AMAÇLARI

Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:

{{islemeAmaclari}}

4. KİŞİSEL VERİLERİN TOPLANMA YÖNTEMİ VE HUKUKİ SEBEBİ

Kişisel verileriniz; fiziki ve elektronik ortamda, otomatik ve otomatik olmayan yöntemlerle toplanmaktadır. Hukuki sebepler:
- Sözleşmenin kurulması veya ifası (KVKK m.5/2-c)
- Hukuki yükümlülüklerin yerine getirilmesi (KVKK m.5/2-ç)
- Meşru menfaatler (KVKK m.5/2-f)
- Açık rıza (gerekli hallerde)

5. KİŞİSEL VERİLERİN AKTARILMASI

Kişisel verileriniz, işleme amaçları doğrultusunda aşağıdaki taraflara aktarılabilir:

{{aktarimYapilacaklar}}

{{#yurtdisi}}

6. KİŞİSEL VERİLERİN SAKLANMASI

Kişisel verileriniz, işleme amaçlarının gerektirdiği süre boyunca saklanacaktır.
Saklama süresi: {{saklaSuresi}}

7. VERİ SAHİBİNİN HAKLARI (KVKK m.11)

KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:

a) Kişisel verilerinizin işlenip işlenmediğini öğrenme
b) İşlenmişse buna ilişkin bilgi talep etme
c) İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme
d) Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme
e) Eksik veya yanlış işlenmişse düzeltilmesini isteme
f) KVKK m.7 koşulları oluşmuşsa silinmesini veya yok edilmesini isteme
g) Düzeltme, silme veya yok etme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme
h) İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonuç ortaya çıkmasına itiraz etme
i) Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme

8. BAŞVURU

Yukarıdaki haklarınızı kullanmak için {{veriSorumlusuEmail}} adresine yazılı olarak veya KEP aracılığıyla başvurabilirsiniz.

Başvurunuz en geç 30 gün içinde değerlendirilerek sonuçlandırılacaktır.

Son güncelleme: {{tarih}}`,
  },
  {
    id: "kvkk_acik_riza",
    name: "KVKK Açık Rıza Beyanı",
    description: "6698 sayılı KVKK'ya uygun açık rıza beyanı şablonu",
    category: "kvkk",
    version: "1.5",
    lastUpdated: "2025-01-01",
    legalBasis: ["6698 sayılı KVKK m.3, m.5, m.6"],
    variables: [
      {
        name: "veriSorumlusu",
        label: "Veri Sorumlusu Unvanı",
        type: "text",
        required: true,
        section: "Veri Sorumlusu",
      },
      {
        name: "veriSahibiAdi",
        label: "Veri Sahibi Adı Soyadı",
        type: "text",
        required: true,
        section: "Veri Sahibi",
      },
      {
        name: "veriSahibiTcNo",
        label: "Veri Sahibi TC No",
        type: "text",
        required: true,
        validation: { minLength: 11, maxLength: 11 },
        section: "Veri Sahibi",
      },
      {
        name: "islenecekVeriler",
        label: "Açık Rıza Kapsamında İşlenecek Veriler",
        type: "multiline",
        required: true,
        section: "Veri Detayları",
      },
      {
        name: "islemeAmaci",
        label: "Veri İşleme Amacı",
        type: "multiline",
        required: true,
        section: "Veri Detayları",
      },
      {
        name: "aktarimYapilacaklar",
        label: "Verilerin Aktarılacağı Taraflar",
        type: "multiline",
        required: false,
        section: "Veri Aktarımı",
      },
      {
        name: "ozelNitelikliVeri",
        label: "Özel Nitelikli Veri İşlenecek mi?",
        type: "boolean",
        required: false,
        defaultValue: false,
        helpText: "Sağlık, biyometrik, ırk, din vb.",
        section: "Veri Detayları",
      },
    ],
    conditionalClauses: [
      {
        id: "ozel_nitelikli",
        condition: "ozelNitelikliVeri",
        trueContent: `ÖZEL NİTELİKLİ KİŞİSEL VERİLERE İLİŞKİN AÇIK RIZA

KVKK m.6 kapsamında özel nitelikli kişisel verilerimin (sağlık verileri, biyometrik veriler vb.) yukarıda belirtilen amaçlarla işlenmesine açık rızam bulunmaktadır.`,
        description: "Özel nitelikli veri rızası",
      },
      {
        id: "aktarim_rizasi",
        condition: "aktarimYapilacaklar",
        trueContent: `VERİ AKTARIMINA İLİŞKİN AÇIK RIZA

Kişisel verilerimin aşağıdaki taraflara aktarılmasına açık rızam bulunmaktadır:
{{aktarimYapilacaklar}}`,
        description: "Aktarım rızası",
      },
    ],
    template: `AÇIK RIZA BEYANI

VERİ SORUMLUSU: {{veriSorumlusu}}

VERİ SAHİBİ BİLGİLERİ
Adı Soyadı: {{veriSahibiAdi}}
TC Kimlik No: {{veriSahibiTcNo}}

1. AÇIK RIZA KONUSU

{{veriSorumlusu}} tarafından tarafıma sunulan Aydınlatma Metni'ni okudum ve anladım.

2. İŞLENECEK KİŞİSEL VERİLER

{{islenecekVeriler}}

3. VERİ İŞLEME AMACI

{{islemeAmaci}}

4. AÇIK RIZA BEYANI

6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, yukarıda belirtilen kişisel verilerimin, belirtilen amaçlarla işlenmesine özgür iradem ile AÇIK RIZA VERİYORUM.

{{#ozel_nitelikli}}

{{#aktarim_rizasi}}

5. BİLGİLENDİRME

- Bu rızanın verilmesi zorunlu değildir.
- Verdiğim rızayı istediğim zaman, hiçbir gerekçe göstermeksizin geri alabilirim.
- Rızamı geri almam halinde, geri alma tarihine kadar gerçekleştirilen veri işleme faaliyetlerinin hukuka uygunluğu etkilenmez.
- Rızamı geri almak için {{veriSorumlusu}}'na yazılı olarak başvurabilirim.

Tarih: _______________

VERİ SAHİBİ
{{veriSahibiAdi}}
İmza: _______________`,
  },
  {
    id: "gizlilik_sozlesmesi",
    name: "Gizlilik Sözleşmesi (NDA)",
    description: "Karşılıklı veya tek taraflı gizlilik sözleşmesi",
    category: "ticaret_hukuku",
    version: "1.5",
    lastUpdated: "2025-01-01",
    legalBasis: ["6098 sayılı TBK", "6102 sayılı TTK"],
    variables: [
      {
        name: "taraf1Unvan",
        label: "1. Taraf Unvanı",
        type: "text",
        required: true,
        section: "Taraflar",
      },
      {
        name: "taraf1Adres",
        label: "1. Taraf Adresi",
        type: "multiline",
        required: true,
        section: "Taraflar",
      },
      {
        name: "taraf2Unvan",
        label: "2. Taraf Unvanı",
        type: "text",
        required: true,
        section: "Taraflar",
      },
      {
        name: "taraf2Adres",
        label: "2. Taraf Adresi",
        type: "multiline",
        required: true,
        section: "Taraflar",
      },
      {
        name: "sozlesmeTuru",
        label: "Sözleşme Türü",
        type: "select",
        required: true,
        options: ["Karşılıklı", "Tek Taraflı"],
        defaultValue: "Karşılıklı",
        section: "Genel",
      },
      {
        name: "projeAdi",
        label: "Proje/Konu Adı",
        type: "text",
        required: true,
        placeholder: "XYZ Projesi",
        section: "Genel",
      },
      {
        name: "gizlilikSuresi",
        label: "Gizlilik Süresi (Yıl)",
        type: "number",
        required: true,
        defaultValue: 3,
        validation: { min: 1, max: 10 },
        section: "Süre",
      },
      {
        name: "cezaiSart",
        label: "Cezai Şart (TL)",
        type: "currency",
        required: false,
        section: "Yaptırımlar",
      },
    ],
    conditionalClauses: [
      {
        id: "tek_tarafli",
        condition: "sozlesmeTuru === 'Tek Taraflı'",
        trueContent:
          "İşbu sözleşme kapsamında yalnızca {{taraf2Unvan}} gizlilik yükümlülüğü altındadır.",
        falseContent:
          "İşbu sözleşme kapsamında her iki taraf da karşılıklı olarak gizlilik yükümlülüğü altındadır.",
        description: "Tek taraflı/karşılıklı",
      },
      {
        id: "cezai_sart",
        condition: "cezaiSart > 0",
        trueContent: `CEZAİ ŞART

Gizlilik yükümlülüğünü ihlal eden taraf, diğer tarafa {{cezaiSart}} TL cezai şart ödeyecektir. Cezai şart, uğranılan gerçek zararın tazminini talep hakkını ortadan kaldırmaz.`,
        description: "Cezai şart maddesi",
      },
    ],
    template: `GİZLİLİK SÖZLEŞMESİ
(Non-Disclosure Agreement - NDA)

TARAFLAR

1. TARAF
{{taraf1Unvan}}
{{taraf1Adres}}

2. TARAF
{{taraf2Unvan}}
{{taraf2Adres}}

MADDE 1 - KONU

İşbu Gizlilik Sözleşmesi, tarafların "{{projeAdi}}" kapsamında birbirlerine açıklayacakları gizli bilgilerin korunması amacıyla düzenlenmiştir.

{{#tek_tarafli}}

MADDE 2 - GİZLİ BİLGİ TANIMI

"Gizli Bilgi" terimi; yazılı, sözlü veya elektronik ortamda açıklanan, açıklandığı sırada veya sonrasında gizli olduğu belirtilen tüm bilgileri kapsar:

a) Ticari sırlar, know-how, iş planları
b) Müşteri ve tedarikçi bilgileri
c) Finansal bilgiler ve projeksiyonlar
d) Teknik bilgiler, tasarımlar, yazılımlar
e) Pazarlama stratejileri
f) Henüz kamuya açıklanmamış her türlü bilgi

MADDE 3 - GİZLİLİK YÜKÜMLÜLÜĞÜ

Taraflar, gizli bilgileri:
a) Kesinlikle gizli tutacak
b) Yalnızca belirtilen amaç için kullanacak
c) Yazılı izin olmaksızın üçüncü kişilere açıklamayacak
d) Kendi gizli bilgilerini korurken gösterdiği özenle koruyacak
e) Yetkisiz erişime karşı gerekli önlemleri alacak

MADDE 4 - İSTİSNALAR

Aşağıdaki bilgiler gizli bilgi kapsamında değildir:
a) Açıklama tarihinde kamuya açık olan bilgiler
b) Alıcının ihlali olmaksızın kamuya açık hale gelen bilgiler
c) Alıcının önceden meşru yollarla sahip olduğu bilgiler
d) Gizlilik yükümlülüğü bulunmayan üçüncü taraftan alınan bilgiler
e) Bağımsız olarak geliştirilen bilgiler

MADDE 5 - ZORUNLU AÇIKLAMA

Mahkeme kararı veya yasal zorunluluk nedeniyle açıklama gerektiğinde, açıklama yapacak taraf:
a) Derhal diğer tarafa bildirim yapacak
b) Açıklamayı en dar kapsamda tutacak
c) Koruma tedbirleri alınması için işbirliği yapacak

MADDE 6 - SÜRE

İşbu sözleşme imza tarihinden itibaren yürürlüğe girecek olup, gizlilik yükümlülüğü son bilgi açıklamasından itibaren {{gizlilikSuresi}} yıl süreyle devam edecektir.

MADDE 7 - İADE YÜKÜMLÜLÜĞÜ

Sözleşme sona erdiğinde veya talep üzerine, taraflar aldıkları tüm gizli bilgileri ve kopyalarını iade edecek veya imha edecektir.

{{#cezai_sart}}

MADDE 8 - UYUŞMAZLIK

İşbu sözleşmeden doğan uyuşmazlıklarda Türk Hukuku uygulanacak olup, İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.

MADDE 9 - DİĞER HÜKÜMLER

a) Sözleşme değişiklikleri yazılı olmalıdır.
b) Herhangi bir hükmün geçersizliği diğer hükümleri etkilemez.
c) Taraflar, sözleşmede belirtilen adresleri tebligat adresi olarak kabul eder.

İşbu sözleşme 2 nüsha olarak düzenlenmiştir.

1. TARAF                                    2. TARAF
{{taraf1Unvan}}                             {{taraf2Unvan}}
Tarih:                                      Tarih:
İmza:                                       İmza:`,
  },
  {
    id: "ihtarname",
    name: "İhtarname",
    description: "Noter veya taahhütlü posta ile gönderilecek ihtarname şablonu",
    category: "genel",
    version: "1.0",
    lastUpdated: "2025-01-01",
    legalBasis: ["6098 sayılı TBK m.117-126", "Tebligat Kanunu"],
    variables: [
      {
        name: "gonderenAdi",
        label: "Gönderen Adı/Unvanı",
        type: "text",
        required: true,
        section: "Gönderen",
      },
      {
        name: "gonderenAdres",
        label: "Gönderen Adresi",
        type: "multiline",
        required: true,
        section: "Gönderen",
      },
      {
        name: "gonderenTcVergi",
        label: "TC/Vergi No",
        type: "text",
        required: true,
        section: "Gönderen",
      },
      {
        name: "muhatapAdi",
        label: "Muhatap Adı/Unvanı",
        type: "text",
        required: true,
        section: "Muhatap",
      },
      {
        name: "muhatapAdres",
        label: "Muhatap Adresi",
        type: "multiline",
        required: true,
        section: "Muhatap",
      },
      {
        name: "ihtarKonusu",
        label: "İhtar Konusu",
        type: "select",
        required: true,
        options: ["Alacak Talebi", "Sözleşme İhlali", "Tahliye Talebi", "Ayıplı Mal/Hizmet", "Diğer"],
        section: "İhtar Detayları",
      },
      {
        name: "ihtarMetni",
        label: "İhtar Açıklaması",
        type: "multiline",
        required: true,
        placeholder: "İhtar konusunu detaylı açıklayınız...",
        section: "İhtar Detayları",
      },
      {
        name: "talepEdilen",
        label: "Talep Edilen",
        type: "multiline",
        required: true,
        placeholder: "Talep edilen edim veya işlem...",
        section: "İhtar Detayları",
      },
      {
        name: "mehilSuresi",
        label: "Mehil Süresi (Gün)",
        type: "number",
        required: true,
        defaultValue: 7,
        validation: { min: 1, max: 30 },
        section: "İhtar Detayları",
      },
      {
        name: "alacakTutari",
        label: "Alacak Tutarı (varsa)",
        type: "currency",
        required: false,
        section: "Finansal",
      },
    ],
    conditionalClauses: [
      {
        id: "alacak",
        condition: "alacakTutari > 0",
        trueContent:
          "Toplam alacak tutarı {{alacakTutari}} TL olup, bu tutarın ödenmemesi halinde yasal faizi ile birlikte tahsili için hukuki yollara başvurulacaktır.",
        description: "Alacak tutarı maddesi",
      },
    ],
    template: `İ H T A R N A M E

GÖNDEREN    : {{gonderenAdi}}
              {{gonderenAdres}}
              TC/Vergi No: {{gonderenTcVergi}}

MUHATAP     : {{muhatapAdi}}
              {{muhatapAdres}}

KONU        : {{ihtarKonusu}}

İHTAR METNİ :

Sayın Muhatap,

{{ihtarMetni}}

{{#alacak}}

Bu nedenle;

{{talepEdilen}}

hususunda, işbu ihtarnamenin tarafınıza tebliğinden itibaren {{mehilSuresi}} ({{mehilSuresiYazi}}) gün içinde gereğini yapmanızı,

Aksi takdirde, başta icra takibi ve dava açılması olmak üzere tüm yasal haklarımı kullanacağımı, bu süreçte ortaya çıkacak her türlü masraf ve vekâlet ücretinin de tarafınıza yükleneceğini İHTAR ve İHBAR ederim.

Saygılarımla,

Tarih:
{{gonderenAdi}}
İmza:

NOT: İşbu ihtarname noter aracılığıyla / taahhütlü posta (iadeli taahhütlü) ile gönderilecektir.`,
  },
  {
    id: "vekaletname",
    name: "Genel Vekaletname",
    description: "Noter onaylı genel vekaletname şablonu",
    category: "genel",
    version: "1.0",
    lastUpdated: "2025-01-01",
    legalBasis: ["6098 sayılı TBK m.502-514", "Avukatlık Kanunu m.35"],
    variables: [
      {
        name: "vekilEdenAdi",
        label: "Vekil Eden Adı Soyadı",
        type: "text",
        required: true,
        section: "Vekil Eden",
      },
      {
        name: "vekilEdenTcNo",
        label: "Vekil Eden TC No",
        type: "text",
        required: true,
        validation: { minLength: 11, maxLength: 11 },
        section: "Vekil Eden",
      },
      {
        name: "vekilEdenAdres",
        label: "Vekil Eden Adresi",
        type: "multiline",
        required: true,
        section: "Vekil Eden",
      },
      {
        name: "vekilAdi",
        label: "Vekil Adı Soyadı",
        type: "text",
        required: true,
        section: "Vekil",
      },
      {
        name: "vekilTcNo",
        label: "Vekil TC No",
        type: "text",
        required: true,
        validation: { minLength: 11, maxLength: 11 },
        section: "Vekil",
      },
      {
        name: "vekilBaroSicil",
        label: "Vekil Baro Sicil No",
        type: "text",
        required: false,
        helpText: "Avukat ise",
        section: "Vekil",
      },
      {
        name: "yetkiKapsamı",
        label: "Yetki Kapsamı",
        type: "select",
        required: true,
        options: ["Genel Vekaletname", "Özel Vekaletname"],
        defaultValue: "Genel Vekaletname",
        section: "Yetkiler",
      },
      {
        name: "davalardaTemsil",
        label: "Davalarda Temsil",
        type: "boolean",
        required: false,
        defaultValue: true,
        section: "Yetkiler",
      },
      {
        name: "sulhYetkisi",
        label: "Sulh ve Feragat Yetkisi",
        type: "boolean",
        required: false,
        defaultValue: false,
        helpText: "Davalarda sulh, kabul ve feragat yetkisi",
        section: "Yetkiler",
      },
      {
        name: "tasinmazYetkisi",
        label: "Taşınmaz İşlemleri Yetkisi",
        type: "boolean",
        required: false,
        defaultValue: false,
        section: "Yetkiler",
      },
    ],
    conditionalClauses: [
      {
        id: "sulh",
        condition: "sulhYetkisi",
        trueContent:
          "Dava ve icra takiplerinde sulh olmaya, kabul ve feragat etmeye, davadan vazgeçmeye,",
        description: "Sulh yetkisi",
      },
      {
        id: "tasinmaz",
        condition: "tasinmazYetkisi",
        trueContent:
          "Her türlü taşınmaz alım, satım, ipotek tesisi ve fekki, ayni hak tesisi işlemlerini yapmaya,",
        description: "Taşınmaz yetkisi",
      },
      {
        id: "baro",
        condition: "vekilBaroSicil",
        trueContent: "Baro Sicil No: {{vekilBaroSicil}}",
        description: "Baro sicil bilgisi",
      },
    ],
    template: `VEKALETNAME

VEKİL EDEN
Adı Soyadı: {{vekilEdenAdi}}
TC Kimlik No: {{vekilEdenTcNo}}
Adres: {{vekilEdenAdres}}

VEKİL
Adı Soyadı: {{vekilAdi}}
TC Kimlik No: {{vekilTcNo}}
{{#baro}}

Yukarıda kimliği yazılı vekile;

Genel olarak, beni/bizi tüm kamu kurum ve kuruluşları, mahkemeler, icra daireleri, noter, tapu, vergi dairesi, belediye, SGK ve diğer tüm resmi ve özel kuruluşlar nezdinde temsil etmeye,

{{#davalarda_temsil}}
Her türlü dava açmaya, açılmış davalara katılmaya, davadan feragat etmeye, davayı kabule, {{#sulh}} temyiz, istinaf, karar düzeltme, yargılamanın iadesi yollarına başvurmaya,

İcra takibi yapmaya ve takip etmeye, haciz koymaya ve kaldırmaya, para ve değerli evrak tahsil etmeye,

{{#tasinmaz}}

Her türlü sözleşme ve taahhütname imzalamaya, feshetmeye,

Banka hesapları açmaya, kapatmaya, havale ve EFT işlemleri yapmaya,

Benim/bizim adıma tebligat almaya, bildirimlerde bulunmaya,

Bunun gibi işlerin yapılması için gerekli her türlü belgeyi ilgili yerlerden almaya ve vermeye, pul yapıştırmaya, imza atmaya,

Ahzu kabza, temsil ve ilzama, gerektiğinde başkalarını tevkil, teşrik ve azle yetkili olmak üzere,

İşbu vekaletnameyi verdim.

Tarih: _______________

VEKİL EDEN
{{vekilEdenAdi}}

İmza: _______________

_______________________________________________
NOTER ONAYI
_______________________________________________`,
  },
];

/**
 * Get all available document templates
 */
export function getDocumentTemplates(): DocumentTemplate[] {
  return documentTemplates;
}

/**
 * Get template by ID
 */
export function getTemplateById(templateId: DocumentTemplateType): DocumentTemplate | null {
  return documentTemplates.find((t) => t.id === templateId) || null;
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(
  category: DocumentTemplate["category"]
): DocumentTemplate[] {
  return documentTemplates.filter((t) => t.category === category);
}

/**
 * Validate variables against template requirements
 */
export function validateVariables(
  template: DocumentTemplate,
  variables: Record<string, string | number | boolean>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const variable of template.variables) {
    const value = variables[variable.name];

    // Check required fields
    if (variable.required && (value === undefined || value === "" || value === null)) {
      errors.push(`${variable.label} alanı zorunludur`);
      continue;
    }

    // Skip validation if value is empty and not required
    if (value === undefined || value === "" || value === null) {
      continue;
    }

    // Validate based on type and validation rules
    if (variable.validation) {
      const strValue = String(value);
      const numValue = Number(value);

      if (variable.validation.minLength && strValue.length < variable.validation.minLength) {
        errors.push(`${variable.label} en az ${variable.validation.minLength} karakter olmalıdır`);
      }

      if (variable.validation.maxLength && strValue.length > variable.validation.maxLength) {
        errors.push(`${variable.label} en fazla ${variable.validation.maxLength} karakter olmalıdır`);
      }

      if (variable.validation.min !== undefined && numValue < variable.validation.min) {
        errors.push(`${variable.label} en az ${variable.validation.min} olmalıdır`);
      }

      if (variable.validation.max !== undefined && numValue > variable.validation.max) {
        errors.push(`${variable.label} en fazla ${variable.validation.max} olmalıdır`);
      }

      if (variable.validation.pattern) {
        const regex = new RegExp(variable.validation.pattern);
        if (!regex.test(strValue)) {
          errors.push(`${variable.label} geçerli formatta değil`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Evaluate conditional clause
 */
function evaluateCondition(
  condition: string,
  variables: Record<string, string | number | boolean>
): boolean {
  try {
    // Simple condition evaluation
    // Supports: variable, variable === 'value', variable > 0, !variable
    const trimmed = condition.trim();

    // Check for comparison operators
    if (trimmed.includes("===")) {
      const [varName, value] = trimmed.split("===").map((s) => s.trim());
      const varValue = variables[varName];
      const compareValue = value.replace(/['"]/g, "");
      return String(varValue) === compareValue;
    }

    if (trimmed.includes(">")) {
      const [varName, value] = trimmed.split(">").map((s) => s.trim());
      return Number(variables[varName]) > Number(value);
    }

    if (trimmed.includes("<")) {
      const [varName, value] = trimmed.split("<").map((s) => s.trim());
      return Number(variables[varName]) < Number(value);
    }

    // Check for negation
    if (trimmed.startsWith("!")) {
      const varName = trimmed.substring(1);
      return !variables[varName];
    }

    // Simple boolean check
    return Boolean(variables[trimmed]);
  } catch {
    return false;
  }
}

/**
 * Replace variables in template text
 */
function replaceVariables(
  text: string,
  variables: Record<string, string | number | boolean>
): string {
  let result = text;

  // Replace all {{variableName}} patterns
  const variablePattern = /\{\{(\w+)\}\}/g;
  result = result.replace(variablePattern, (match, varName) => {
    const value = variables[varName];
    if (value !== undefined && value !== null) {
      return String(value);
    }
    return match; // Keep placeholder if no value
  });

  // Handle expressions like {{depozito * aylikKira}}
  const expressionPattern = /\{\{(\w+)\s*\*\s*(\w+)\}\}/g;
  result = result.replace(expressionPattern, (match, var1, var2) => {
    const value1 = Number(variables[var1]);
    const value2 = Number(variables[var2]);
    if (!isNaN(value1) && !isNaN(value2)) {
      return String(value1 * value2);
    }
    return match;
  });

  return result;
}

/**
 * Process conditional clauses in template
 */
function processConditionalClauses(
  template: DocumentTemplate,
  variables: Record<string, string | number | boolean>
): string {
  let content = template.template;

  for (const clause of template.conditionalClauses) {
    const conditionMet = evaluateCondition(clause.condition, variables);
    const placeholder = `{{#${clause.id}}}`;

    if (conditionMet && clause.trueContent) {
      const processedContent = replaceVariables(clause.trueContent, variables);
      content = content.replace(placeholder, processedContent);
    } else if (!conditionMet && clause.falseContent) {
      const processedContent = replaceVariables(clause.falseContent, variables);
      content = content.replace(placeholder, processedContent);
    } else {
      content = content.replace(placeholder, "");
    }
  }

  return content;
}

/**
 * Generate warnings and suggestions based on variables
 */
function generateWarningsAndSuggestions(
  template: DocumentTemplate,
  variables: Record<string, string | number | boolean>
): { warnings: string[]; suggestions: string[] } {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // İş sözleşmesi specific checks
  if (template.id === "is_sozlesmesi") {
    const brutUcret = Number(variables.brutUcret);
    const denemeSuresi = Number(variables.denemeSuresi);
    const haftalikCalisma = Number(variables.haftalikCalisma);
    const rekabetSuresi = Number(variables.rekabetSuresi);

    if (brutUcret < 22104) {
      warnings.push("Brüt ücret 2025 asgari ücretinin altında olamaz");
    }

    if (denemeSuresi > 2) {
      warnings.push("Deneme süresi İş Kanunu'na göre en fazla 2 ay olabilir (TİS ile 4 ay)");
    }

    if (haftalikCalisma > 45) {
      warnings.push("Haftalık çalışma süresi 45 saati geçemez");
    }

    if (variables.rekabetYasagi && rekabetSuresi > 2) {
      warnings.push("Rekabet yasağı süresi TBK'ya göre en fazla 2 yıl olabilir");
    }

    if (!variables.gizlilikMaddesi) {
      suggestions.push("Gizlilik maddesi eklemeniz önerilir");
    }
  }

  // Kira sözleşmesi specific checks
  if (template.id === "kira_sozlesmesi") {
    const depozito = Number(variables.depozito);
    if (depozito > 3) {
      warnings.push("Depozito tutarı genellikle 3 aylık kirayı geçmemelidir");
    }
  }

  // KVKK documents
  if (template.id === "kvkk_aydinlatma" || template.id === "kvkk_acik_riza") {
    if (!variables.verbisNo) {
      suggestions.push("VERBİS kayıt numaranızı eklemeniz önerilir");
    }
  }

  return { warnings, suggestions };
}

/**
 * Generate document from template
 */
export function generateDocument(
  templateId: DocumentTemplateType,
  variables: Record<string, string | number | boolean>
): GeneratedDocument | null {
  const template = getTemplateById(templateId);
  if (!template) {
    return null;
  }

  // Validate variables
  const validation = validateVariables(template, variables);
  if (!validation.valid) {
    console.error("Validation errors:", validation.errors);
  }

  // Add current date
  const enrichedVariables = {
    ...variables,
    tarih: new Date().toLocaleDateString("tr-TR"),
    mehilSuresiYazi: numberToTurkishWords(Number(variables.mehilSuresi) || 7),
  };

  // Process conditional clauses
  let content = processConditionalClauses(template, enrichedVariables);

  // Replace remaining variables
  content = replaceVariables(content, enrichedVariables);

  // Clean up empty lines from removed conditionals
  content = content.replace(/\n{3,}/g, "\n\n").trim();

  // Generate warnings and suggestions
  const { warnings, suggestions } = generateWarningsAndSuggestions(template, variables);

  // Calculate word count and pages
  const wordCount = content.split(/\s+/).length;
  const estimatedPages = Math.ceil(wordCount / 300);

  return {
    id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    templateType: templateId,
    templateName: template.name,
    content,
    variables: enrichedVariables,
    generatedAt: new Date(),
    warnings,
    suggestions,
    legalReferences: template.legalBasis,
    wordCount,
    estimatedPages,
  };
}

/**
 * Convert number to Turkish words (simple implementation)
 */
function numberToTurkishWords(num: number): string {
  const words: Record<number, string> = {
    1: "bir",
    2: "iki",
    3: "üç",
    4: "dört",
    5: "beş",
    6: "altı",
    7: "yedi",
    8: "sekiz",
    9: "dokuz",
    10: "on",
    15: "on beş",
    20: "yirmi",
    30: "otuz",
  };
  return words[num] || String(num);
}

/**
 * Get document template categories
 */
export function getTemplateCategories(): Array<{
  id: DocumentTemplate["category"];
  name: string;
  icon: string;
  count: number;
}> {
  const categories = [
    { id: "is_hukuku" as const, name: "İş Hukuku", icon: "👷" },
    { id: "ticaret_hukuku" as const, name: "Ticaret Hukuku", icon: "🏢" },
    { id: "borçlar_hukuku" as const, name: "Borçlar Hukuku", icon: "📜" },
    { id: "kvkk" as const, name: "KVKK", icon: "🔒" },
    { id: "genel" as const, name: "Genel", icon: "📋" },
  ];

  return categories.map((cat) => ({
    ...cat,
    count: documentTemplates.filter((t) => t.category === cat.id).length,
  }));
}

/**
 * Search templates by keyword
 */
export function searchTemplates(keyword: string): DocumentTemplate[] {
  const lowerKeyword = keyword.toLowerCase();
  return documentTemplates.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerKeyword) ||
      t.description.toLowerCase().includes(lowerKeyword) ||
      t.legalBasis.some((b) => b.toLowerCase().includes(lowerKeyword))
  );
}

/**
 * Export document to different formats (placeholder for future implementation)
 */
export function exportDocument(
  document: GeneratedDocument,
  format: "txt" | "html" | "markdown"
): string {
  switch (format) {
    case "html":
      return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>${document.templateName}</title>
  <style>
    body { font-family: 'Times New Roman', serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1, h2, h3 { text-align: center; }
    .meta { color: #666; font-size: 0.9em; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="meta">
    <p>Oluşturma Tarihi: ${document.generatedAt.toLocaleDateString("tr-TR")}</p>
    <p>Kelime Sayısı: ${document.wordCount} | Tahmini Sayfa: ${document.estimatedPages}</p>
  </div>
  <pre style="white-space: pre-wrap;">${document.content}</pre>
</body>
</html>`;

    case "markdown":
      return `# ${document.templateName}

*Oluşturma Tarihi: ${document.generatedAt.toLocaleDateString("tr-TR")}*

---

${document.content}

---

**Yasal Dayanaklar:** ${document.legalReferences.join(", ")}
`;

    case "txt":
    default:
      return document.content;
  }
}
