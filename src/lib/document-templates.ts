/**
 * Legal Document Templates System
 *
 * Provides automated generation of common Turkish legal documents
 * from structured data and questionnaires.
 *
 * Features:
 * - Dilekçe (Petition) templates
 * - Sözleşme (Contract) templates
 * - Vekaletname (Power of Attorney) templates
 * - İhtarname (Notice) templates
 * - Dynamic variable substitution
 * - Format validation
 */

export type DocumentCategory =
  | "dilekce"
  | "sozlesme"
  | "vekaletname"
  | "ihtarname"
  | "tutanak"
  | "beyanname";

export interface DocumentTemplate {
  id: string;
  name: string;
  category: DocumentCategory;
  description: string;
  requiredFields: TemplateField[];
  optionalFields: TemplateField[];
  template: string;
  legalBasis?: string;
  warnings?: string[];
}

export interface TemplateField {
  key: string;
  label: string;
  type: "text" | "date" | "number" | "select" | "textarea" | "currency";
  placeholder?: string;
  options?: string[];
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface GeneratedDocument {
  title: string;
  content: string;
  category: DocumentCategory;
  generatedAt: Date;
  fields: Record<string, string>;
  warnings: string[];
}

// Document Templates Database
const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  // İşe İade Davası Dilekçesi
  {
    id: "dilekce_ise_iade",
    name: "İşe İade Davası Dilekçesi",
    category: "dilekce",
    description: "4857 sayılı İş Kanunu kapsamında işe iade davası açmak için kullanılan dilekçe şablonu",
    legalBasis: "4857 sayılı İş Kanunu m.18-21",
    requiredFields: [
      { key: "mahkeme", label: "Mahkeme", type: "text", placeholder: "... İş Mahkemesi" },
      { key: "davaci_ad", label: "Davacı Adı Soyadı", type: "text" },
      { key: "davaci_tc", label: "Davacı TC Kimlik No", type: "text", validation: { pattern: "^[0-9]{11}$" } },
      { key: "davaci_adres", label: "Davacı Adresi", type: "textarea" },
      { key: "davali_unvan", label: "Davalı İşveren Ünvanı", type: "text" },
      { key: "davali_adres", label: "Davalı Adresi", type: "textarea" },
      { key: "ise_baslama_tarihi", label: "İşe Başlama Tarihi", type: "date" },
      { key: "fesih_tarihi", label: "Fesih Tarihi", type: "date" },
      { key: "fesih_nedeni", label: "Bildirilen Fesih Nedeni", type: "textarea" },
      { key: "son_maas", label: "Son Brüt Maaş (TL)", type: "currency" },
    ],
    optionalFields: [
      { key: "avukat_ad", label: "Avukat Adı", type: "text" },
      { key: "baro_sicil", label: "Baro Sicil No", type: "text" },
    ],
    warnings: [
      "İşe iade davası fesih bildiriminin tebliğinden itibaren 1 ay içinde arabulucuya başvurulmalıdır.",
      "Arabuluculuk süreci tükenmeden dava açılamaz.",
      "İşyerinde 30 veya daha fazla işçi çalışıyor olmalıdır.",
      "İşçinin en az 6 aylık kıdemi bulunmalıdır.",
    ],
    template: `
                              {{mahkeme}}'NE

DAVACI                : {{davaci_ad}}
                        TC: {{davaci_tc}}
                        {{davaci_adres}}

VEKİLİ                : {{avukat_ad}} {{baro_sicil}}

DAVALI                : {{davali_unvan}}
                        {{davali_adres}}

KONU                  : Feshin geçersizliğinin tespiti ile işe iade ve
                        boşta geçen süre ücretinin tahsili talebidir.

AÇIKLAMALAR           :

1. Müvekkil, davalı işyerinde {{ise_baslama_tarihi}} tarihinden {{fesih_tarihi}} tarihine kadar kesintisiz olarak çalışmıştır.

2. Müvekkilin iş sözleşmesi {{fesih_tarihi}} tarihinde "{{fesih_nedeni}}" gerekçesiyle feshedilmiştir.

3. Ancak yapılan fesih işlemi hukuka aykırıdır. Şöyle ki:
   - Fesih için geçerli bir neden bulunmamaktadır.
   - Fesih öncesinde müvekkilin savunması alınmamıştır.
   - Feshin son çare olması ilkesine uyulmamıştır.

4. 4857 sayılı İş Kanunu'nun 18. maddesi uyarınca, otuz veya daha fazla işçi çalıştıran işyerlerinde en az altı aylık kıdemi olan işçinin belirsiz süreli iş sözleşmesini fesheden işveren, işçinin yeterliliğinden veya davranışlarından ya da işletmenin, işyerinin veya işin gereklerinden kaynaklanan geçerli bir sebebe dayanmak zorundadır.

5. Müvekkilin son brüt ücreti {{son_maas}} TL'dir.

HUKUKİ NEDENLER       : 4857 s.K. m.18-21, HMK ve ilgili mevzuat

DELİLLER              : İş sözleşmesi, bordro kayıtları, SGK kayıtları,
                        fesih bildirimi, tanık beyanları, bilirkişi incelemesi
                        ve her türlü yasal delil

SONUÇ VE İSTEM        : Yukarıda açıklanan nedenlerle;

1. Feshin GEÇERSİZLİĞİNİN TESPİTİNE,
2. Müvekkilin İŞE İADESİNE,
3. İşe başlatılmama halinde 4-8 aylık brüt ücret tutarında TAZMİNAT ödenmesine,
4. Boşta geçen süreye ilişkin 4 aya kadar ücret ve diğer haklarının ödenmesine,
5. Yargılama giderleri ve vekalet ücretinin davalıya yükletilmesine,

Karar verilmesini saygılarımla arz ve talep ederim.

Tarih: {{tarih}}

                                                    Davacı Vekili
                                                    {{avukat_ad}}
`,
  },

  // Kira Tespit Davası Dilekçesi
  {
    id: "dilekce_kira_tespit",
    name: "Kira Tespit Davası Dilekçesi",
    category: "dilekce",
    description: "Kira bedelinin tespiti için açılan dava dilekçesi şablonu",
    legalBasis: "6098 sayılı TBK m.344",
    requiredFields: [
      { key: "mahkeme", label: "Mahkeme", type: "text", placeholder: "... Sulh Hukuk Mahkemesi" },
      { key: "davaci_ad", label: "Davacı (Kiraya Veren) Adı", type: "text" },
      { key: "davaci_adres", label: "Davacı Adresi", type: "textarea" },
      { key: "davali_ad", label: "Davalı (Kiracı) Adı", type: "text" },
      { key: "davali_adres", label: "Davalı Adresi", type: "textarea" },
      { key: "tasınmaz_adres", label: "Kiralanan Taşınmaz Adresi", type: "textarea" },
      { key: "kira_baslangic", label: "Kira Başlangıç Tarihi", type: "date" },
      { key: "mevcut_kira", label: "Mevcut Aylık Kira (TL)", type: "currency" },
      { key: "talep_kira", label: "Talep Edilen Kira (TL)", type: "currency" },
    ],
    optionalFields: [
      { key: "avukat_ad", label: "Avukat Adı", type: "text" },
    ],
    warnings: [
      "Kira tespit davası yeni kira döneminin başlangıcından en geç 30 gün önce açılmalıdır.",
      "5 yıldan uzun süreli kiralarda veya 5 yılın sonunda hâkim rayice göre belirler.",
    ],
    template: `
                              {{mahkeme}}'NE

DAVACI                : {{davaci_ad}}
                        {{davaci_adres}}

DAVALI                : {{davali_ad}}
                        {{davali_adres}}

KONU                  : Kira bedelinin tespiti talebidir.

AÇIKLAMALAR           :

1. Davalı, {{tasınmaz_adres}} adresindeki taşınmazda {{kira_baslangic}} tarihinden itibaren kiracı olarak oturmaktadır.

2. Halen aylık {{mevcut_kira}} TL kira ödenmektedir.

3. Ancak mevcut kira bedeli, emsal taşınmazların kira bedellerinin çok altında kalmaktadır. Çevredeki benzer taşınmazların kira bedelleri dikkate alındığında, rayiç kira bedelinin {{talep_kira}} TL civarında olduğu görülmektedir.

4. TBK m.344 gereğince kira bedelinin yeniden belirlenmesi gerekmektedir.

HUKUKİ NEDENLER       : 6098 s. TBK m.344 ve ilgili mevzuat

DELİLLER              : Kira sözleşmesi, emsal kira araştırması, keşif,
                        bilirkişi incelemesi, tanık ve her türlü yasal delil

SONUÇ VE İSTEM        : Kira bedelinin yeni dönem için aylık {{talep_kira}} TL
                        olarak TESPİTİNE karar verilmesini arz ve talep ederim.

Tarih: {{tarih}}
                                                    Davacı
                                                    {{davaci_ad}}
`,
  },

  // Boşanma Davası Dilekçesi (Anlaşmalı)
  {
    id: "dilekce_bosanma_anlasmalı",
    name: "Anlaşmalı Boşanma Davası Dilekçesi",
    category: "dilekce",
    description: "Eşlerin anlaşarak boşanması için dava dilekçesi şablonu",
    legalBasis: "4721 sayılı TMK m.166/3",
    requiredFields: [
      { key: "mahkeme", label: "Mahkeme", type: "text", placeholder: "... Aile Mahkemesi" },
      { key: "davaci_ad", label: "Davacı Eş Adı", type: "text" },
      { key: "davaci_tc", label: "Davacı TC No", type: "text" },
      { key: "davaci_adres", label: "Davacı Adresi", type: "textarea" },
      { key: "davali_ad", label: "Davalı Eş Adı", type: "text" },
      { key: "davali_adres", label: "Davalı Adresi", type: "textarea" },
      { key: "evlilik_tarihi", label: "Evlilik Tarihi", type: "date" },
      { key: "cocuk_durumu", label: "Çocuk Durumu", type: "select", options: ["Çocuk yok", "Müşterek çocuk var"] },
    ],
    optionalFields: [
      { key: "cocuk_ad", label: "Çocuk Adı/Yaşı", type: "text" },
      { key: "velayet", label: "Velayet Kararı", type: "text" },
      { key: "nafaka", label: "Nafaka Miktarı", type: "currency" },
    ],
    warnings: [
      "Anlaşmalı boşanma için evliliğin en az 1 yıl sürmüş olması gerekir.",
      "Her iki eşin de duruşmada hazır bulunması zorunludur.",
      "Protokol mahkemece uygun bulunmalıdır.",
    ],
    template: `
                              {{mahkeme}}'NE

DAVACI                : {{davaci_ad}}
                        TC: {{davaci_tc}}
                        {{davaci_adres}}

DAVALI                : {{davali_ad}}
                        {{davali_adres}}

KONU                  : TMK m.166/3 uyarınca anlaşmalı boşanma talebidir.

AÇIKLAMALAR           :

1. Taraflar {{evlilik_tarihi}} tarihinde evlenmiş olup, evlilik birliği 1 yıldan fazla sürmüştür.

2. Taraflar arasında evlilik birliğinin devamını imkansız kılan şiddetli geçimsizlik mevcuttur.

3. Her iki taraf da boşanma ve boşanmanın mali sonuçları ile çocukların durumu hakkında anlaşmaya varmıştır.

4. Tarafların anlaşma protokolü ekte sunulmuştur.

{{#cocuk_durumu}}
5. Müşterek çocuk {{cocuk_ad}} için velayet {{velayet}} verilecek, {{nafaka}} TL nafaka ödenecektir.
{{/cocuk_durumu}}

HUKUKİ NEDENLER       : TMK m.166/3, HMK ve ilgili mevzuat

SONUÇ VE İSTEM        : Tarafların BOŞANMALARINA ve anlaşma protokolünün
                        onaylanmasına karar verilmesini arz ve talep ederim.

Tarih: {{tarih}}
                                                    Davacı
                                                    {{davaci_ad}}

EK: Anlaşmalı Boşanma Protokolü
`,
  },

  // İhtarname (Kira Ödeme)
  {
    id: "ihtarname_kira",
    name: "Kira Ödeme İhtarnamesi",
    category: "ihtarname",
    description: "Kiracıya kira borcunu ödemesi için gönderilen ihtarname şablonu",
    legalBasis: "6098 sayılı TBK m.315",
    requiredFields: [
      { key: "noter", label: "Noter", type: "text", placeholder: "... Noterliği" },
      { key: "ihtar_eden_ad", label: "İhtar Eden (Kiraya Veren)", type: "text" },
      { key: "ihtar_eden_adres", label: "İhtar Eden Adresi", type: "textarea" },
      { key: "muhatap_ad", label: "Muhatap (Kiracı)", type: "text" },
      { key: "muhatap_adres", label: "Muhatap Adresi", type: "textarea" },
      { key: "kiralanан_adres", label: "Kiralanan Yer Adresi", type: "textarea" },
      { key: "borc_tutari", label: "Toplam Borç Tutarı (TL)", type: "currency" },
      { key: "borc_donemi", label: "Borç Dönemi", type: "text", placeholder: "Ocak-Mart 2024" },
    ],
    optionalFields: [],
    warnings: [
      "İhtarnamede verilen süre en az 30 gün olmalıdır.",
      "İhtarname noter aracılığıyla gönderilmelidir.",
      "İki haklı ihtar tahliye sebebi oluşturabilir.",
    ],
    template: `
                              İHTARNAME

İHTAR EDEN            : {{ihtar_eden_ad}}
                        {{ihtar_eden_adres}}

MUHATAP               : {{muhatap_ad}}
                        {{muhatap_adres}}

KONU                  : Kira borcunun ödenmesi ihtarıdır.

AÇIKLAMALAR           :

Sayın Muhatap,

{{kiralanан_adres}} adresindeki taşınmazı tarafınıza kiralamış bulunmaktayım.

Ancak {{borc_donemi}} dönemine ait toplam {{borc_tutari}} TL kira borcunuzu ödemediğiniz tespit edilmiştir.

İşbu ihtarnamenin tarafınıza tebliğinden itibaren 30 (OTUZ) GÜN içerisinde belirtilen borç tutarını ödemenizi, aksi takdirde 6098 sayılı Türk Borçlar Kanunu'nun 315. maddesi uyarınca tahliye davası dahil yasal yollara başvuracağımı ihtar ederim.

İhtar Eden: {{ihtar_eden_ad}}
Tarih: {{tarih}}

                              {{noter}}
                              Tarih: ___/___/______
                              Yevmiye No: _______
`,
  },

  // İş Sözleşmesi
  {
    id: "sozlesme_is",
    name: "Belirsiz Süreli İş Sözleşmesi",
    category: "sozlesme",
    description: "4857 sayılı İş Kanunu kapsamında belirsiz süreli iş sözleşmesi şablonu",
    legalBasis: "4857 sayılı İş Kanunu",
    requiredFields: [
      { key: "isveren_unvan", label: "İşveren Ünvanı", type: "text" },
      { key: "isveren_adres", label: "İşveren Adresi", type: "textarea" },
      { key: "isci_ad", label: "İşçi Adı Soyadı", type: "text" },
      { key: "isci_tc", label: "İşçi TC No", type: "text" },
      { key: "isci_adres", label: "İşçi Adresi", type: "textarea" },
      { key: "gorev", label: "Görevi/Pozisyonu", type: "text" },
      { key: "ise_baslama", label: "İşe Başlama Tarihi", type: "date" },
      { key: "ucret", label: "Aylık Brüt Ücret (TL)", type: "currency" },
      { key: "calisma_yeri", label: "Çalışma Yeri", type: "text" },
    ],
    optionalFields: [
      { key: "deneme_suresi", label: "Deneme Süresi (Gün)", type: "number" },
      { key: "ek_haklar", label: "Ek Haklar/Yan Ödemeler", type: "textarea" },
    ],
    warnings: [
      "Deneme süresi en fazla 2 ay olabilir.",
      "Asgari ücretin altında ücret belirlenemez.",
      "Sözleşme iki nüsha düzenlenmelidir.",
    ],
    template: `
                    BELİRSİZ SÜRELİ İŞ SÖZLEŞMESİ

MADDE 1 - TARAFLAR

İŞVEREN:
Ünvan  : {{isveren_unvan}}
Adres  : {{isveren_adres}}

İŞÇİ:
Ad Soyad : {{isci_ad}}
TC No    : {{isci_tc}}
Adres    : {{isci_adres}}

MADDE 2 - SÖZLEŞMENİN KONUSU

İşbu sözleşme, işçinin işverene ait işyerinde belirsiz süreli olarak çalışmasına ilişkin koşulları düzenlemektedir.

MADDE 3 - İŞE BAŞLAMA TARİHİ VE DENEME SÜRESİ

İşçi, {{ise_baslama}} tarihinde işe başlayacaktır.
{{#deneme_suresi}}
Taraflar {{deneme_suresi}} günlük deneme süresi kararlaştırmışlardır. Bu süre içinde taraflar iş sözleşmesini bildirim süresine gerek olmaksızın ve tazminatsız feshedebilir.
{{/deneme_suresi}}

MADDE 4 - YAPILACAK İŞ VE ÇALIŞMA YERİ

İşçi, {{gorev}} olarak görev yapacaktır.
Çalışma yeri: {{calisma_yeri}}

MADDE 5 - ÇALIŞMA SÜRESİ

Haftalık çalışma süresi 45 saattir. Günlük çalışma süresi en fazla 11 saattir.

MADDE 6 - ÜCRET VE ÖDEME

Aylık brüt ücret: {{ucret}} TL
Ücret her ayın son iş günü işçinin banka hesabına yatırılır.
{{#ek_haklar}}
Ek haklar: {{ek_haklar}}
{{/ek_haklar}}

MADDE 7 - YILLIK İZİN

İşçi, 4857 sayılı İş Kanunu hükümlerine göre yıllık ücretli izin hakkına sahiptir.

MADDE 8 - FESİH

Taraflardan her biri, 4857 sayılı İş Kanunu'nda belirtilen bildirim sürelerine uymak kaydıyla sözleşmeyi feshedebilir.

MADDE 9 - DİĞER HÜKÜMLER

Bu sözleşmede yer almayan hususlarda 4857 sayılı İş Kanunu ve ilgili mevzuat hükümleri uygulanır.

İşbu sözleşme {{tarih}} tarihinde iki nüsha olarak imzalanmıştır.

İŞVEREN                                    İŞÇİ
{{isveren_unvan}}                          {{isci_ad}}
Kaşe/İmza                                  İmza
`,
  },

  // Vekaletname
  {
    id: "vekaletname_genel",
    name: "Genel Vekaletname",
    category: "vekaletname",
    description: "Avukata verilen genel dava vekaletnamesi şablonu",
    legalBasis: "1136 sayılı Avukatlık Kanunu",
    requiredFields: [
      { key: "vekil_eden_ad", label: "Vekil Eden Adı", type: "text" },
      { key: "vekil_eden_tc", label: "Vekil Eden TC No", type: "text" },
      { key: "vekil_eden_adres", label: "Vekil Eden Adresi", type: "textarea" },
      { key: "avukat_ad", label: "Avukat Adı Soyadı", type: "text" },
      { key: "baro", label: "Baro", type: "text" },
      { key: "baro_sicil", label: "Baro Sicil No", type: "text" },
    ],
    optionalFields: [
      { key: "yetki_siniri", label: "Yetki Sınırı/Özel Yetkiler", type: "textarea" },
    ],
    warnings: [
      "Vekaletname noter huzurunda düzenlenmelidir.",
      "Özel yetki gerektiren işlemler ayrıca belirtilmelidir.",
    ],
    template: `
                              GENEL DAVA VEKALETNAMESİ

VEKİL EDEN:
Ad Soyad  : {{vekil_eden_ad}}
TC No     : {{vekil_eden_tc}}
Adres     : {{vekil_eden_adres}}

VEKİL:
Ad Soyad     : {{avukat_ad}}
Baro         : {{baro}}
Sicil No     : {{baro_sicil}}

Leh ve aleyhime açılmış ve açılacak her türlü dava ve takiplerde beni temsile, hak ve menfaatlerimi korumaya, her türlü yargı mercileri, icra daireleri, noter ve tüm resmi daireler nezdinde her türlü işlemi yapmaya,

Dava açmaya, icra takibine başlamaya, davadan ve takipten vazgeçmeye, kabule, sulhe, feragate, temyiz, istinaf ve karar düzeltme yollarına başvurmaya, başvurudan vazgeçmeye, tahkim ve hakem sözleşmesi yapmaya, hâkimi reddetmeye,

Delil sunmaya, yemin teklif etmeye, tanık göstermeye, bilirkişi talebinde bulunmaya, keşif talebinde bulunmaya, ihtiyati tedbir ve ihtiyati haciz talebinde bulunmaya,

Adıma harç, masraf, teminat ve avans yatırmaya ve almaya, ahzu kabza, sulh ve ibraya, hak ve alacakları tahsile, mal ve hakları teslim almaya, dosyadan evrak almaya, makbuz ve ibraname vermeye,

{{#yetki_siniri}}
{{yetki_siniri}}
{{/yetki_siniri}}

Münferiden ve birlikte yetkili olmak üzere başka avukatlar tayin etmeye,

Yukarıda belirtilen tüm yetkileri kullanmak üzere {{baro}} Barosu avukatlarından {{baro_sicil}} sicil numaralı Av. {{avukat_ad}}'ı vekil tayin ettim.

Tarih: {{tarih}}

                                        Vekil Eden
                                        {{vekil_eden_ad}}
                                        İmza
`,
  },
];

/**
 * Get all available templates
 */
export function getTemplates(): DocumentTemplate[] {
  return DOCUMENT_TEMPLATES;
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: DocumentCategory): DocumentTemplate[] {
  return DOCUMENT_TEMPLATES.filter(t => t.category === category);
}

/**
 * Get template by ID
 */
export function getTemplateById(templateId: string): DocumentTemplate | null {
  return DOCUMENT_TEMPLATES.find(t => t.id === templateId) || null;
}

/**
 * Search templates
 */
export function searchTemplates(query: string): DocumentTemplate[] {
  const lowerQuery = query.toLowerCase();
  return DOCUMENT_TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Generate document from template
 */
export function generateDocument(
  templateId: string,
  fieldValues: Record<string, string>
): GeneratedDocument | null {
  const template = getTemplateById(templateId);
  if (!template) return null;

  // Validate required fields
  const missingFields: string[] = [];
  for (const field of template.requiredFields) {
    if (!fieldValues[field.key] || fieldValues[field.key].trim() === "") {
      missingFields.push(field.label);
    }
  }

  const warnings = [...(template.warnings || [])];
  if (missingFields.length > 0) {
    warnings.unshift(`Eksik alanlar: ${missingFields.join(", ")}`);
  }

  // Add current date if not provided
  if (!fieldValues["tarih"]) {
    fieldValues["tarih"] = formatDate(new Date());
  }

  // Process template
  let content = template.template;

  // Simple variable substitution
  for (const [key, value] of Object.entries(fieldValues)) {
    const regex = new RegExp(`{{${key}}}`, "g");
    content = content.replace(regex, value || "_______________");
  }

  // Handle conditional sections (simple implementation)
  content = processConditionals(content, fieldValues);

  // Clean up any remaining placeholders
  content = content.replace(/{{[^}]+}}/g, "_______________");

  return {
    title: template.name,
    content: content.trim(),
    category: template.category,
    generatedAt: new Date(),
    fields: fieldValues,
    warnings,
  };
}

/**
 * Process conditional blocks in template
 */
function processConditionals(template: string, values: Record<string, string>): string {
  // Handle {{#field}}...{{/field}} blocks
  const conditionalRegex = /{{#(\w+)}}([\s\S]*?){{\/\1}}/g;

  return template.replace(conditionalRegex, (match, field, content) => {
    if (values[field] && values[field].trim() !== "") {
      // Replace the field reference within the block
      return content.replace(new RegExp(`{{${field}}}`, "g"), values[field]);
    }
    return "";
  });
}

/**
 * Format date in Turkish format
 */
function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Validate field value
 */
export function validateField(
  field: TemplateField,
  value: string
): { valid: boolean; error?: string } {
  if (field.validation?.required && (!value || value.trim() === "")) {
    return { valid: false, error: "Bu alan zorunludur" };
  }

  if (value && field.validation?.minLength && value.length < field.validation.minLength) {
    return { valid: false, error: `En az ${field.validation.minLength} karakter olmalıdır` };
  }

  if (value && field.validation?.maxLength && value.length > field.validation.maxLength) {
    return { valid: false, error: `En fazla ${field.validation.maxLength} karakter olabilir` };
  }

  if (value && field.validation?.pattern) {
    const regex = new RegExp(field.validation.pattern);
    if (!regex.test(value)) {
      return { valid: false, error: "Geçersiz format" };
    }
  }

  // TC Kimlik validation
  if (field.key.includes("tc") && value) {
    if (!/^[0-9]{11}$/.test(value)) {
      return { valid: false, error: "TC Kimlik No 11 haneli olmalıdır" };
    }
  }

  return { valid: true };
}

/**
 * Get all categories
 */
export function getCategories(): Array<{ id: DocumentCategory; name: string; count: number }> {
  const categoryNames: Record<DocumentCategory, string> = {
    dilekce: "Dilekçeler",
    sozlesme: "Sözleşmeler",
    vekaletname: "Vekaletnameler",
    ihtarname: "İhtarnameler",
    tutanak: "Tutanaklar",
    beyanname: "Beyannameler",
  };

  const categories: DocumentCategory[] = ["dilekce", "sozlesme", "vekaletname", "ihtarname", "tutanak", "beyanname"];

  return categories.map(cat => ({
    id: cat,
    name: categoryNames[cat],
    count: DOCUMENT_TEMPLATES.filter(t => t.category === cat).length,
  }));
}

/**
 * Export document to different formats
 */
export function exportDocument(
  document: GeneratedDocument,
  format: "text" | "html"
): string {
  if (format === "html") {
    return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>${document.title}</title>
  <style>
    body { font-family: 'Times New Roman', serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    pre { white-space: pre-wrap; font-family: inherit; }
  </style>
</head>
<body>
  <pre>${escapeHtml(document.content)}</pre>
</body>
</html>
    `.trim();
  }

  return document.content;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
