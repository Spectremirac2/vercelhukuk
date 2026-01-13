/**
 * Sık Sorulan Sorular (FAQ) Veritabanı
 * 
 * Türk hukuku hakkında en çok sorulan sorular ve kapsamlı cevaplar
 * Kategorilere göre organize edilmiş
 */

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  legalBasis: string[];
  relatedTopics: string[];
  lastUpdated: string;
  keywords: string[];
  importance: "high" | "medium" | "low";
}

export type FAQCategory = 
  | "is_hukuku"
  | "aile_hukuku"
  | "tuketici"
  | "kira"
  | "ceza"
  | "miras"
  | "ticaret"
  | "icra_iflas"
  | "idare"
  | "vergi"
  | "borçlar"
  | "kvkk"
  | "trafik"
  | "genel";

export const FAQ_CATEGORIES: Record<FAQCategory, { name: string; icon: string; description: string }> = {
  is_hukuku: { name: "İş Hukuku", icon: "💼", description: "İşçi-işveren ilişkileri, tazminatlar, işe iade" },
  aile_hukuku: { name: "Aile Hukuku", icon: "👨‍👩‍👧", description: "Boşanma, velayet, nafaka, mal paylaşımı" },
  tuketici: { name: "Tüketici Hakları", icon: "🛒", description: "Ayıplı mal, cayma hakkı, garanti" },
  kira: { name: "Kira Hukuku", icon: "🏠", description: "Kira sözleşmesi, tahliye, kira artışı" },
  ceza: { name: "Ceza Hukuku", icon: "⚖️", description: "Suçlar, cezalar, adli süreç" },
  miras: { name: "Miras Hukuku", icon: "📜", description: "Miras paylaşımı, vasiyetname, terekenin tasfiyesi" },
  ticaret: { name: "Ticaret Hukuku", icon: "🏢", description: "Şirketler, ticari sözleşmeler, fatura" },
  icra_iflas: { name: "İcra İflas", icon: "📋", description: "Alacak takibi, haciz, iflas" },
  idare: { name: "İdare Hukuku", icon: "🏛️", description: "Devletle ilişkiler, idari davalar" },
  vergi: { name: "Vergi Hukuku", icon: "💰", description: "Vergiler, beyannameler, vergi cezaları" },
  borçlar: { name: "Borçlar Hukuku", icon: "📝", description: "Sözleşmeler, tazminat, sorumluluk" },
  kvkk: { name: "Kişisel Veriler", icon: "🔒", description: "KVKK, veri koruma, açık rıza" },
  trafik: { name: "Trafik Hukuku", icon: "🚗", description: "Trafik kazaları, cezalar, sigorta" },
  genel: { name: "Genel Hukuk", icon: "📚", description: "Temel hukuki kavramlar ve süreçler" }
};

// ============================================
// İŞ HUKUKU SSS
// ============================================
const IS_HUKUKU_FAQ: FAQItem[] = [
  {
    id: "is_001",
    category: "is_hukuku",
    question: "Kıdem tazminatına hak kazanmak için kaç yıl çalışmak gerekir?",
    shortAnswer: "En az 1 yıl çalışmak gerekir.",
    detailedAnswer: `Kıdem tazminatına hak kazanmak için işçinin aynı işverene bağlı olarak en az 1 yıl (365 gün) kesintisiz çalışmış olması gerekir.

**Kıdem tazminatına hak kazandıran durumlar:**
- İşveren tarafından haklı neden olmaksızın fesih
- İşçinin haklı nedenle (İş K. m.24) feshi
- Kadın işçinin evlendikten sonraki 1 yıl içinde feshi
- Emeklilik (yaşlılık, malullük)
- Askerlik
- Ölüm

**Hesaplama:** Her tam yıl için 30 günlük brüt ücret. Kıst (kesirli) yıl da hesaba katılır.

**Tavan:** 2024 yılı için kıdem tazminatı tavanı mevcuttur ve 6 ayda bir güncellenir.`,
    legalBasis: ["1475 sayılı İş Kanunu m.14", "4857 sayılı İş Kanunu m.120"],
    relatedTopics: ["İhbar tazminatı", "İşe iade", "Fesih bildirimi"],
    lastUpdated: "2024-01-15",
    keywords: ["kıdem tazminatı", "tazminat", "işten çıkarma", "1 yıl", "emeklilik"],
    importance: "high"
  },
  {
    id: "is_002",
    category: "is_hukuku",
    question: "İşe iade davası nasıl açılır ve süresi nedir?",
    shortAnswer: "1 ay içinde arabulucuya, ardından 2 hafta içinde mahkemeye başvuru gerekir.",
    detailedAnswer: `**Dava Şartları:**
- İşyerinde en az 30 işçi çalışıyor olmalı
- İşçinin en az 6 ay kıdemi olmalı
- Belirsiz süreli iş sözleşmesi olmalı
- Fesih geçerli bir nedene dayanmamalı

**Süreç:**
1. Fesih bildiriminin tebliğinden itibaren **1 ay** içinde arabulucuya başvuru (zorunlu)
2. Arabuluculuk son tutanağının düzenlenmesinden itibaren **2 hafta** içinde iş mahkemesinde dava

**İşe İade Kararı Verilirse:**
- İşçi 10 gün içinde işverene başvurmalı
- İşveren 1 ay içinde işe başlatmalı
- Başlatmazsa: 4-8 aylık tazminat + 4 aya kadar boşta geçen süre ücreti`,
    legalBasis: ["İş Kanunu m.18-21", "7036 sayılı İş Mahkemeleri Kanunu m.3"],
    relatedTopics: ["Arabuluculuk", "Geçerli fesih", "Fesih bildirimi"],
    lastUpdated: "2024-01-15",
    keywords: ["işe iade", "30 işçi", "6 ay kıdem", "arabuluculuk", "fesih"],
    importance: "high"
  },
  {
    id: "is_003",
    category: "is_hukuku",
    question: "Fazla mesai ücreti nasıl hesaplanır?",
    shortAnswer: "Normal saat ücretinin %50 fazlası ile hesaplanır.",
    detailedAnswer: `**Fazla Çalışma Tanımı:**
Haftalık 45 saati aşan çalışmalar fazla çalışmadır.

**Hesaplama:**
- Normal saat ücreti × 1.5 = Fazla mesai ücreti
- Örnek: Saat ücreti 100 TL ise, fazla mesai saat ücreti 150 TL

**Sınırlamalar:**
- Yıllık fazla çalışma 270 saati geçemez
- İşçinin yazılı onayı gerekir
- Günlük 11 saati aşamaz (dinlenme dahil)

**Alternatif:**
- Serbest zaman olarak kullandırılabilir (1.5 saat serbest zaman/1 saat fazla mesai)

**Zamanaşımı:** 5 yıl`,
    legalBasis: ["İş Kanunu m.41", "İş Kanunu m.102"],
    relatedTopics: ["Çalışma süreleri", "Ara dinlenmesi", "Ücret"],
    lastUpdated: "2024-01-15",
    keywords: ["fazla mesai", "mesai ücreti", "45 saat", "270 saat", "zamlı ücret"],
    importance: "high"
  },
  {
    id: "is_004",
    category: "is_hukuku",
    question: "İhbar süresi ne kadardır?",
    shortAnswer: "Kıdeme göre 2-8 hafta arasında değişir.",
    detailedAnswer: `**Kıdeme Göre İhbar Süreleri:**

| Kıdem | İhbar Süresi |
|-------|--------------|
| 0-6 ay | 2 hafta |
| 6 ay - 1.5 yıl | 4 hafta |
| 1.5 - 3 yıl | 6 hafta |
| 3 yıl üzeri | 8 hafta |

**Önemli Noktalar:**
- Her iki taraf için de geçerli
- İhbar süresi kullandırılmazsa ihbar tazminatı ödenir
- İhbar süresinde iş arama izni: Günde 2 saat (ücretli)
- Haklı nedenle fesihte ihbar süresi gerekmez`,
    legalBasis: ["İş Kanunu m.17"],
    relatedTopics: ["Kıdem tazminatı", "Fesih bildirimi", "İş arama izni"],
    lastUpdated: "2024-01-15",
    keywords: ["ihbar süresi", "ihbar tazminatı", "fesih bildirimi", "2 hafta", "8 hafta"],
    importance: "medium"
  }
];

// ============================================
// AİLE HUKUKU SSS
// ============================================
const AILE_HUKUKU_FAQ: FAQItem[] = [
  {
    id: "aile_001",
    category: "aile_hukuku",
    question: "Anlaşmalı boşanma şartları nelerdir?",
    shortAnswer: "En az 1 yıl evlilik, birlikte başvuru veya bir tarafın diğerini kabul etmesi gerekir.",
    detailedAnswer: `**Anlaşmalı Boşanma Şartları (TMK m.166/3):**

1. **Evliliğin en az 1 yıl sürmüş olması**
2. **Eşlerin birlikte başvurması** veya bir eşin açtığı davayı diğerinin kabul etmesi
3. **Hakimin tarafları bizzat dinlemesi**
4. **Anlaşma protokolünün uygun bulunması**

**Protokolde Bulunması Gerekenler:**
- Mal paylaşımı
- Nafaka (varsa)
- Velayet ve çocukla kişisel ilişki
- Maddi-manevi tazminat (varsa)

**Süreç:**
- Tek celsede sonuçlanabilir
- Protokol onaylandığında karar kesinleşir
- 30 gün içinde nüfus müdürlüğüne bildirim`,
    legalBasis: ["TMK m.166/3"],
    relatedTopics: ["Çekişmeli boşanma", "Velayet", "Nafaka", "Mal rejimi"],
    lastUpdated: "2024-01-15",
    keywords: ["anlaşmalı boşanma", "protokol", "1 yıl evlilik", "mal paylaşımı"],
    importance: "high"
  },
  {
    id: "aile_002",
    category: "aile_hukuku",
    question: "Velayet kime verilir?",
    shortAnswer: "Çocuğun üstün yararına göre hakim karar verir.",
    detailedAnswer: `**Velayet Kararında Dikkate Alınan Kriterler:**

1. **Çocuğun üstün yararı** (en önemli kriter)
2. **Çocuğun yaşı ve görüşü** (idrak çağında ise)
3. **Ebeveynlerin bakım kapasitesi**
4. **Ekonomik durum** (tek başına belirleyici değil)
5. **Çocuğun mevcut yaşam düzeni**
6. **Kardeşlerin birlikte kalması ilkesi**

**Ortak Velayet:**
- Boşanmada ortak velayet kural olarak mümkün değil (AİHM kararları sonrası tartışmalı)
- Fiilen uygulanabiliyor (anlaşma ile)

**Velayetin Değiştirilmesi:**
- Koşullar değişirse istenebilir
- Çocuğun menfaatine olmalı
- Her zaman dava açılabilir`,
    legalBasis: ["TMK m.182", "TMK m.183", "TMK m.336"],
    relatedTopics: ["Kişisel ilişki", "İştirak nafakası", "Çocuk hakları"],
    lastUpdated: "2024-01-15",
    keywords: ["velayet", "çocuk", "üstün yarar", "ortak velayet", "bakım"],
    importance: "high"
  },
  {
    id: "aile_003",
    category: "aile_hukuku",
    question: "Nafaka türleri nelerdir ve nasıl hesaplanır?",
    shortAnswer: "Tedbir, yoksulluk ve iştirak nafakası olmak üzere 3 türü vardır.",
    detailedAnswer: `**Nafaka Türleri:**

1. **Tedbir Nafakası**
   - Dava süresince
   - Geçici nitelikte
   - Her iki tarafa da bağlanabilir

2. **Yoksulluk Nafakası**
   - Boşanma sonrası
   - Yoksulluğa düşecek eş lehine
   - Süresiz veya süreli olabilir
   - Yeniden evlenme veya ölümle sona erer

3. **İştirak Nafakası**
   - Çocuk için
   - Velayeti almayan ebeveyn öder
   - Çocuk ergin olana kadar (öğrenim devam ediyorsa uzar)

**Hesaplamada Dikkate Alınan Faktörler:**
- Tarafların gelir durumu
- Yaşam standardı
- Çocukların ihtiyaçları
- Sosyal ve ekonomik koşullar

**ÜFE/TÜFE Artışı:** Nafaka her yıl ÜFE/TÜFE oranında artırılabilir.`,
    legalBasis: ["TMK m.169", "TMK m.175", "TMK m.182"],
    relatedTopics: ["Boşanma", "Velayet", "Nafaka artırımı davası"],
    lastUpdated: "2024-01-15",
    keywords: ["nafaka", "yoksulluk nafakası", "iştirak nafakası", "tedbir nafakası"],
    importance: "high"
  }
];

// ============================================
// TÜKETİCİ HAKLARI SSS
// ============================================
const TUKETICI_FAQ: FAQItem[] = [
  {
    id: "tuk_001",
    category: "tuketici",
    question: "Ayıplı mal için hangi haklarım var?",
    shortAnswer: "Ücretsiz onarım, değişim, bedel iadesi veya indirim talep edebilirsiniz.",
    detailedAnswer: `**Seçimlik Haklar (TKHK m.11):**

1. **Ücretsiz onarım** - Satıcının makul sürede onarması
2. **Ürünün yenisi ile değiştirilmesi**
3. **Bedelin iadesini isteme** (sözleşmeden dönme)
4. **Bedelden indirim isteme** (ayıp oranında)

**Önemli Kurallar:**
- İlk tercih satıcıda olabilir (onarım veya değişim)
- Satıcı yükümlülüğünü yerine getirmezse diğer haklar kullanılabilir
- İş gücü kaybı da tazmin edilebilir

**Süreler:**
- 2 yıl içinde ayıp ortaya çıkmalı (yasal garanti)
- 6 ay içinde ortaya çıkan ayıplarda ispat yükü satıcıda

**Başvuru:**
- Önce satıcıya
- Sonuç alınamazsa → Tüketici Hakem Heyeti veya Mahkeme`,
    legalBasis: ["6502 sayılı TKHK m.8-11"],
    relatedTopics: ["Garanti belgesi", "Tüketici Hakem Heyeti", "Cayma hakkı"],
    lastUpdated: "2024-01-15",
    keywords: ["ayıplı mal", "garanti", "değişim", "iade", "onarım"],
    importance: "high"
  },
  {
    id: "tuk_002",
    category: "tuketici",
    question: "İnternetten aldığım ürünü iade edebilir miyim?",
    shortAnswer: "14 gün içinde sebep göstermeksizin cayma hakkınız var.",
    detailedAnswer: `**Cayma Hakkı (TKHK m.48):**

- Süre: Malın teslim tarihinden itibaren **14 gün**
- Sebep gösterme zorunluluğu **YOK**
- Cayma bildirimi yazılı veya kalıcı veri saklayıcısı ile yapılır

**İade Süreci:**
1. 14 gün içinde cayma bildirimini gönderin
2. 10 gün içinde ürünü iade edin
3. Satıcı 14 gün içinde ödemeyi iade etmeli

**Cayma Hakkı OLMAYAN Ürünler:**
- Kişiye özel hazırlanan ürünler
- Çabuk bozulan mallar
- Açılmış hijyenik ürünler
- Dijital içerikler (indirme başlamışsa)
- Gazete, dergi (abonelik hariç)
- Acil konaklama, taşıma, eğlence hizmetleri

**Kargo Ücreti:** Satıcı tarafından karşılanır (aksi belirtilmemişse)`,
    legalBasis: ["6502 sayılı TKHK m.48", "Mesafeli Sözleşmeler Yönetmeliği"],
    relatedTopics: ["E-ticaret", "Mesafeli satış", "Kapıdan satış"],
    lastUpdated: "2024-01-15",
    keywords: ["cayma hakkı", "internet alışverişi", "14 gün", "iade", "e-ticaret"],
    importance: "high"
  },
  {
    id: "tuk_003",
    category: "tuketici",
    question: "Tüketici Hakem Heyeti'ne nasıl başvurabilirim?",
    shortAnswer: "İkamet adresinize göre ilçe veya il tüketici hakem heyetine başvurabilirsiniz.",
    detailedAnswer: `**Başvuru Sınırları (2024):**

- **İl Tüketici Hakem Heyeti:** 10.000 TL - 66.000 TL arası uyuşmazlıklar
- **İlçe Tüketici Hakem Heyeti:** 10.000 TL'ye kadar uyuşmazlıklar
- **10.000 TL'nin altı:** Zorunlu başvuru (dava açmadan önce)
- **66.000 TL üzeri:** Doğrudan Tüketici Mahkemesi

**Başvuru Nasıl Yapılır?**
1. e-Devlet üzerinden online başvuru
2. Tüketici Bilgi Sistemi (TÜBİS)
3. Dilekçe ile bizzat başvuru

**Gerekli Belgeler:**
- Başvuru formu
- Fatura/fiş fotokopisi
- Sözleşme (varsa)
- Yazışma ve belgeler

**Süreç:**
- 6 ay içinde karar verilir (genellikle daha kısa)
- Karar bağlayıcıdır
- İtiraz: 15 gün içinde Tüketici Mahkemesi`,
    legalBasis: ["6502 sayılı TKHK m.66-72"],
    relatedTopics: ["Tüketici Mahkemesi", "Ayıplı mal", "Arabuluculuk"],
    lastUpdated: "2024-01-15",
    keywords: ["tüketici hakem heyeti", "şikayet", "başvuru", "10.000 TL", "66.000 TL"],
    importance: "high"
  }
];

// ============================================
// KİRA HUKUKU SSS
// ============================================
const KIRA_FAQ: FAQItem[] = [
  {
    id: "kira_001",
    category: "kira",
    question: "Kira artış oranı ne kadar olabilir?",
    shortAnswer: "TÜFE'nin yıllık değişim oranını geçemez.",
    detailedAnswer: `**Kira Artış Oranı Kuralları:**

**Konut Kiralarında:**
- Yıllık artış oranı bir önceki yılın TÜFE ortalamasını aşamaz
- 2024 yılında geçici düzenleme: %25 tavan (konutlarda)
- Taraflar daha düşük oran kararlaştırabilir

**İşyeri Kiralarında:**
- TÜFE sınırlaması var (2024'e kadar uzatıldı)
- Serbest piyasa koşulları uygulanabilir (belirli durumlarda)

**Kira Tespit Davası:**
- 5 yıllık kira döneminin sonunda açılabilir
- Emsal kira bedeli belirlenir
- Her zaman açılabilir (ileriye dönük karar)

**Önemli:**
- Sözleşmede artış maddesi yoksa bile TÜFE'ye göre artış istenebilir
- Artış bildiriminin süresi içinde yapılması gerekir`,
    legalBasis: ["TBK m.344", "7409 sayılı Kanun (geçici düzenleme)"],
    relatedTopics: ["Kira sözleşmesi", "Kira tespit davası", "Tahliye"],
    lastUpdated: "2024-01-15",
    keywords: ["kira artışı", "TÜFE", "%25", "kira zammı", "artış oranı"],
    importance: "high"
  },
  {
    id: "kira_002",
    category: "kira",
    question: "Ev sahibi beni evden çıkarabilir mi?",
    shortAnswer: "Sadece kanunda sayılı nedenlerle ve dava yoluyla çıkarabilir.",
    detailedAnswer: `**Tahliye Nedenleri:**

**Kiracıdan Kaynaklanan:**
1. Kira bedelini ödememe (2 haklı ihtar veya temerrüt)
2. Kiracının yazılı tahliye taahhüdü
3. Kiracının veya birlikte oturanların taşınmaza zarar vermesi

**Kiraya Verenden Kaynaklanan:**
1. Kendisi/eşi/altsoyu/üstsoyu için konut/işyeri ihtiyacı
2. Taşınmazın yeniden inşa veya imarı
3. Yeni malikin ihtiyacı (edinmeden 1 ay içinde bildirip 6 ay sonra dava)

**Tahliye Taahhüdü:**
- Yazılı olmalı
- Tarih belirtilmeli
- Kira başlangıcından sonra alınmalı

**Önemli:**
- 10 yıl sonunda kiraya veren sebep göstermeksizin fesih hakkı kazanır
- Tahliye davasında 30 güne kadar süre verilebilir`,
    legalBasis: ["TBK m.350-356"],
    relatedTopics: ["Tahliye davası", "Kira sözleşmesi", "10 yıl kuralı"],
    lastUpdated: "2024-01-15",
    keywords: ["tahliye", "kiracı hakları", "ev sahibi", "çıkarma", "tahliye taahhüdü"],
    importance: "high"
  },
  {
    id: "kira_003",
    category: "kira",
    question: "Depozito ne kadar olmalı ve ne zaman iade edilir?",
    shortAnswer: "En fazla 3 aylık kira bedeli kadar olabilir, kira sonunda iade edilir.",
    detailedAnswer: `**Depozito (Güvence Bedeli) Kuralları:**

**Miktar:**
- Konut ve işyeri kiralarında en fazla **3 aylık kira bedeli**
- Fazlası geçersiz

**İade:**
- Kira sözleşmesi sona erdiğinde
- Taşınmaz hasarsız teslim edildiğinde
- Borç ve hasar yoksa tamamı iade edilir

**Banka Hesabı Zorunluluğu:**
- Para olarak alınırsa vadeli mevduat hesabına yatırılmalı
- Birlikte imza ile çekilebilir
- Faizi kiracıya aittir

**Kesinti Yapılabilecek Durumlar:**
- Kira borcu
- Taşınmaza verilen hasar
- Aidat/fatura borçları (sözleşmede yazılı ise)

**Uyuşmazlıkta:**
- Sulh hukuk mahkemesi görevli
- İspat yükü ev sahibinde (hasar iddiasında)`,
    legalBasis: ["TBK m.342"],
    relatedTopics: ["Kira sözleşmesi", "Kira borcu", "Taşınmaz teslimi"],
    lastUpdated: "2024-01-15",
    keywords: ["depozito", "güvence", "3 aylık", "iade", "kira güvencesi"],
    importance: "medium"
  }
];

// ============================================
// CEZA HUKUKU SSS
// ============================================
const CEZA_FAQ: FAQItem[] = [
  {
    id: "ceza_001",
    category: "ceza",
    question: "Gözaltı süresi ne kadardır?",
    shortAnswer: "Bireysel suçlarda 24 saat, toplu suçlarda 4 güne kadar uzatılabilir.",
    detailedAnswer: `**Gözaltı Süreleri:**

**Bireysel Suçlarda:**
- Yakalama anından itibaren **24 saat**
- Hakim kararıyla uzatma yok

**Toplu Suçlarda (3+ kişi birlikte):**
- İlk 24 saat
- Cumhuriyet savcısının yazılı emriyle 3 gün uzatma
- Toplam: **4 gün**

**Terör Suçlarında:**
- 48 saat + hakim kararıyla 2 x 48 saat uzatma
- Toplam: **7 gün** (olağanüstü hallerde 14 gün)

**Gözaltında Haklar:**
- Avukat görüşme hakkı
- Yakınlara haber verme
- Sağlık kontrolü
- Susma hakkı
- Müdafi yardımından yararlanma`,
    legalBasis: ["CMK m.91", "Anayasa m.19"],
    relatedTopics: ["Tutukluluk", "Yakalama", "Avukat hakkı"],
    lastUpdated: "2024-01-15",
    keywords: ["gözaltı", "24 saat", "yakalama", "tutuklama", "avukat"],
    importance: "high"
  },
  {
    id: "ceza_002",
    category: "ceza",
    question: "Hükmün açıklanmasının geri bırakılması (HAGB) nedir?",
    shortAnswer: "Mahkumiyet kararı 5 yıl ertelenir, denetim süresi iyi geçerse düşer.",
    detailedAnswer: `**HAGB Şartları:**

1. Cezanın 2 yıl veya daha az hapis veya adli para cezası olması
2. Daha önce kasıtlı suçtan mahkumiyet olmaması
3. Sanığın kişilik özellikleri ve duruşmadaki tutumu
4. Sanığın kabul etmesi
5. Mağdurun zararının giderilmesi

**5 Yıllık Denetim Süresi:**
- Kasıtlı suç işlenmezse → Dava düşer, sicile işlemez
- Kasıtlı suç işlenirse → Her iki ceza birlikte çektirilir

**Önemli:**
- Bazı suçlarda HAGB uygulanamaz (cinsel suçlar, terör vb.)
- Memuriyete engel teşkil etmez (düşerse)
- Tekerrür hükümlerinde dikkate alınmaz

**İtiraz:** 7 gün içinde bir üst mahkemeye`,
    legalBasis: ["CMK m.231"],
    relatedTopics: ["Erteleme", "Seçenek yaptırımlar", "Adli sicil"],
    lastUpdated: "2024-01-15",
    keywords: ["HAGB", "hükmün açıklanmasının geri bırakılması", "5 yıl", "denetim", "düşme"],
    importance: "high"
  },
  {
    id: "ceza_003",
    category: "ceza",
    question: "Şikayetten vazgeçersem dava düşer mi?",
    shortAnswer: "Şikayete bağlı suçlarda düşer, diğerlerinde devam eder.",
    detailedAnswer: `**Şikayete Bağlı Suçlar (Örnekler):**
- Basit yaralama (TCK m.86/2)
- Basit tehdit (TCK m.106/1)
- Hakaret (TCK m.125)
- Konut dokunulmazlığını ihlal (TCK m.116)
- Basit hırsızlık (belirli hallerde)
- Güveni kötüye kullanma

**Vazgeçmenin Etkisi:**
- Şikayete bağlı suçlarda → Dava düşer / Kovuşturmaya yer olmadığı kararı
- Kamu davasında → Sadece cezanın indirilmesinde etkili olabilir

**Şikayet Süresi:** Öğrenmeden itibaren **6 ay**

**Vazgeçme Ne Zaman Yapılabilir?**
- Soruşturma veya kovuşturma aşamasında
- Hüküm kesinleşinceye kadar
- Yazılı veya sözlü (tutanağa geçirilerek)

**Uzlaşma:** Uzlaşmaya tabi suçlarda önce uzlaştırıcıya gidilir`,
    legalBasis: ["TCK m.73", "CMK m.223"],
    relatedTopics: ["Uzlaşma", "Şikayet süresi", "Kamu davası"],
    lastUpdated: "2024-01-15",
    keywords: ["şikayetten vazgeçme", "şikayete bağlı suç", "dava düşmesi", "6 ay"],
    importance: "medium"
  }
];

// ============================================
// İCRA İFLAS SSS
// ============================================
const ICRA_FAQ: FAQItem[] = [
  {
    id: "icra_001",
    category: "icra_iflas",
    question: "İcra takibine nasıl itiraz edilir?",
    shortAnswer: "Ödeme emrinin tebliğinden itibaren 7 gün içinde icra dairesine itiraz edilir.",
    detailedAnswer: `**İtiraz Süreci:**

**Süre:** Ödeme emrinin tebliğinden itibaren **7 gün**

**Nasıl Yapılır?**
- İcra dairesine yazılı veya sözlü
- Gerekçe göstermek zorunlu değil (genel itiraz)
- Borca, imzaya veya yetkiye itiraz edilebilir

**İtirazın Sonuçları:**
- Takip kendiliğinden durur
- Alacaklı itirazın kaldırılmasını isteyebilir
- İcra hukuk mahkemesinde itirazın kaldırılması davası (6 ay içinde)
- Genel mahkemede itirazın iptali davası (1 yıl içinde)

**İtiraz Edilmezse:**
- Takip kesinleşir
- Haciz aşamasına geçilir

**Kötü Niyetli İtiraz:**
- İcra inkar tazminatı (%20)`,
    legalBasis: ["İİK m.62-67"],
    relatedTopics: ["Haciz", "İtirazın kaldırılması", "Ödeme emri"],
    lastUpdated: "2024-01-15",
    keywords: ["icra itiraz", "7 gün", "ödeme emri", "takip durdurma", "itirazın kaldırılması"],
    importance: "high"
  },
  {
    id: "icra_002",
    category: "icra_iflas",
    question: "Maaşımın ne kadarı haczedilebilir?",
    shortAnswer: "Maaşın 1/4'ü haczedilebilir, asgari ücretin altı kalan kısım haczedilemez.",
    detailedAnswer: `**Maaş Haczi Kuralları:**

**Genel Kural:**
- Maaş ve ücretin **1/4'ü** haczedilebilir
- Kalan 3/4 haczedilemez

**Asgari Ücret Koruması:**
- Aylık net gelirin asgari ücretin altında kalan kısmı **kesinlikle haczedilemez**
- Örnek: Maaş 20.000 TL, asgari ücret 17.000 TL ise, 3.000 TL'nin 1/4'ü = 750 TL haczedilebilir

**Nafaka Alacağında:**
- Bu sınırlamalar uygulanmaz
- Tamamı haczedilebilir

**Birden Fazla İcra:**
- İlk gelen haciz öncelikli
- Sırada bekler, tamamlanınca diğeri başlar

**İşverenin Yükümlülüğü:**
- Haciz müzekkeresine uymak zorunda
- Uymayan işveren borcun tamamından sorumlu olabilir`,
    legalBasis: ["İİK m.83"],
    relatedTopics: ["Haciz", "Haczedilemez mallar", "Nafaka haczi"],
    lastUpdated: "2024-01-15",
    keywords: ["maaş haczi", "1/4", "asgari ücret", "haczedilemez", "nafaka"],
    importance: "high"
  },
  {
    id: "icra_003",
    category: "icra_iflas",
    question: "Hangi mallar haczedilemez?",
    shortAnswer: "Zorunlu ev eşyaları, kişisel eşyalar, meslek araçları ve bazı gelirler haczedilemez.",
    detailedAnswer: `**Haczedilemez Mallar (İİK m.82):**

**Ev Eşyaları:**
- Yatak ve yatak takımları
- Mutfak eşyaları (lüks olmayan)
- Isınma ve aydınlatma araçları
- Çamaşır makinesi, buzdolabı (temel ihtiyaç)

**Kişisel Eşyalar:**
- Borçlu ve ailesinin giyecekleri
- Çocukların eğitim araçları
- Engelli araçları

**Meslek ve Sanat Araçları:**
- Geçim için gerekli meslek araç ve gereçleri
- Çiftçinin zorunlu tarım araçları

**Haczedilemeyen Gelirler:**
- Emekli maaşının 1/4'ünü aşan kısmı
- Nafaka alacakları
- Tazminat ve maluliyet aylıkları

**Dikkat:**
- Lüks eşyalar haczedilebilir
- Borçlunun muvafakati ile haciz yapılabilir`,
    legalBasis: ["İİK m.82"],
    relatedTopics: ["Maaş haczi", "Ev haczi", "İstihkak davası"],
    lastUpdated: "2024-01-15",
    keywords: ["haczedilemez", "ev eşyası", "meslek araçları", "haciz", "istisna"],
    importance: "medium"
  }
];

// ============================================
// TÜM FAQ'LARI BİRLEŞTİR
// ============================================
export const ALL_FAQ: FAQItem[] = [
  ...IS_HUKUKU_FAQ,
  ...AILE_HUKUKU_FAQ,
  ...TUKETICI_FAQ,
  ...KIRA_FAQ,
  ...CEZA_FAQ,
  ...ICRA_FAQ
];

// ============================================
// YARDIMCI FONKSİYONLAR
// ============================================
export function searchFAQ(query: string): FAQItem[] {
  const normalizedQuery = query.toLowerCase().trim();
  const keywords = normalizedQuery.split(/\s+/);
  
  return ALL_FAQ.filter(faq => {
    const searchableText = [
      faq.question,
      faq.shortAnswer,
      faq.detailedAnswer,
      ...faq.keywords
    ].join(' ').toLowerCase();
    
    return keywords.every(keyword => searchableText.includes(keyword));
  }).sort((a, b) => {
    // Öncelik sırası: high > medium > low
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.importance] - priorityOrder[b.importance];
  });
}

export function getFAQByCategory(category: FAQCategory): FAQItem[] {
  return ALL_FAQ.filter(faq => faq.category === category);
}

export function getFAQById(id: string): FAQItem | undefined {
  return ALL_FAQ.find(faq => faq.id === id);
}

export function getRelatedFAQ(faqId: string): FAQItem[] {
  const currentFAQ = getFAQById(faqId);
  if (!currentFAQ) return [];
  
  return ALL_FAQ.filter(faq => 
    faq.id !== faqId && 
    (faq.category === currentFAQ.category ||
     currentFAQ.relatedTopics.some(topic => 
       faq.keywords.some(keyword => keyword.includes(topic.toLowerCase()))
     ))
  ).slice(0, 5);
}

export function getMostAskedFAQ(limit: number = 10): FAQItem[] {
  return ALL_FAQ
    .filter(faq => faq.importance === 'high')
    .slice(0, limit);
}

export function getFAQCategories(): typeof FAQ_CATEGORIES {
  return FAQ_CATEGORIES;
}
