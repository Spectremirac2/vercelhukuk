# Hukuk AI Chat - Türk Hukuku Araştırma Asistanı

Türk hukuku araştırması için özelleştirilmiş, üretim kalitesinde bir web chat uygulaması. Gemini API ile Google Search Grounding ve RAG desteği sunar.

## Özellikler

### Temel Özellikler
- **Kanıta Dayalı Cevaplar:** Gemini'nin `google_search` aracını kullanarak gerçek zamanlı web araması sonuçlarına dayalı cevaplar sunar.
- **Satır İçi Alıntılar:** Kaynaklara bağlı alıntıları (örn: `[1]`) otomatik olarak metne ekler.
- **Kaynaklar Paneli:** Alıntılanan tüm kaynakların detaylarını gösteren özel panel.
- **Kaynak Güvenilirlik Göstergesi:** Resmi (mevzuat.gov.tr vb.) ve ikincil kaynakları ayırt eder.
- **IRAC Metodolojisi:** Cevaplar Issue-Rule-Analysis-Conclusion yöntemi ile yapılandırılır.

### Strict Mode
- **Açık:** En az 2 kaynak VE en az 1 resmi kaynak gerektirir; aksi halde reddeder.
- **Kapalı:** Tüm kaynakları kullanır, ikincilleri etiketler.

### RAG / Dosya Arama (Phase 2)
- Kendi hukuki belgelerinizi (PDF, DOCX) yükleyerek cevapları spesifik dosyalara dayandırabilirsiniz.
- Gemini File Search tool'u ile entegre edilmiştir.

## Teknoloji Yığını

- **Frontend:** Next.js (App Router), React, TailwindCSS
- **Backend:** Next.js API Routes
- **AI/LLM:** Google Gemini API (`@google/genai`)
- **Test:** Vitest
- **Dil:** TypeScript

## Kurulum

### 1. Depoyu Klonlayın
```bash
git clone <repo-url>
cd legal-chat
```

### 2. Bağımlılıkları Yükleyin
```bash
pnpm install
```

### 3. Ortam Değişkenleri
`.env.example` dosyasını `.env.local` olarak kopyalayın ve API anahtarınızı ayarlayın:

```bash
cp .env.example .env.local
```

`.env.local` içeriği:
```env
# Zorunlu: Gemini API Anahtarı
GEMINI_API_KEY=your_gemini_api_key_here

# Opsiyonel: Güvenilir kaynak domainleri
ALLOWED_SOURCE_DOMAINS=mevzuat.gov.tr,resmigazete.gov.tr,anayasa.gov.tr,yargitay.gov.tr,danistay.gov.tr,barobirlik.org.tr

# Opsiyonel: Kanıt sağlayıcı türü (web_search | file_search)
EVIDENCE_PROVIDER=web_search

# Opsiyonel: Varsayılan strict mode durumu
STRICT_MODE_DEFAULT=false

# Opsiyonel: Debug modu (grounding metadata'yı döndürür)
DEBUG=false
```

### 4. Geliştirme Sunucusunu Başlatın
```bash
pnpm dev
```

### 5. Tarayıcıda Açın
[http://localhost:3000](http://localhost:3000) adresine gidin.

## 🚀 Deploy (Başkalarıyla Paylaşma)

### Vercel ile Deploy (Önerilen - 5 Dakika)

1. **GitHub'a Push:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
   git push -u origin main
   ```

2. **Vercel'e Deploy:**
   - [vercel.com](https://vercel.com) adresine git
   - GitHub ile giriş yap
   - "Add New Project" > Repo'nu seç
   - **Environment Variables** ekle:
     ```
     GEMINI_API_KEY=AIzaSyBTe1pKngLSJyV3lJdrHstpRRkPDeNqztU
     EVIDENCE_PROVIDER=web_search
     DEBUG=false
     ```
   - "Deploy" tıkla
   - ✅ **Hazır!** Link: `https://PROJE-ADI.vercel.app`

3. **Link Paylaş:**
   - Vercel size otomatik bir link verir
   - Bu linki istediğinizle paylaşabilirsiniz
   - Custom domain de ekleyebilirsiniz

### Alternatif: ngrok (Hızlı Test)

```bash
# ngrok kurulumu
npm install -g ngrok

# Dev server çalışırken
ngrok http 3000
```

ngrok size bir link verir (örn: `https://xxxx.ngrok.io`) - sadece bilgisayarınız açıkken çalışır.

📖 **Detaylı Deploy Rehberi:** [DEPLOY.md](./DEPLOY.md) dosyasına bakın.

## Kullanım

### Web Araması
Sadece sorunuzu yazın. Sistem Google Search ile arama yaparak kanıtlara dayalı cevap verecektir.

### Dosya Araması
Ataç ikonuna tıklayarak belge yükleyin. Sistem o oturum için Dosya Arama moduna geçecektir.

### Strict Mode
- **Açık:** Sadece yeterli güvenilir kaynak varsa cevap verir.
- **Kapalı:** Tüm kaynakları kullanır, ikincilleri etiketler.

## Alıntılar Nasıl Hesaplanır

1. Gemini API çağrısı yapılır ve `groundingMetadata` alınır.
2. `groundingSupports` dizisi metin segmentlerini chunk indekslerine eşler.
3. `addCitations()` fonksiyonu:
   - Her segment için bitiş indeksini belirler
   - `[1]`, `[2]` gibi alıntı işaretlerini oluşturur
   - Azalan sırada ekler (indeks kaymasını önlemek için)
4. `groundingChunks` dizisinden kaynak URL'leri ve başlıkları çıkarılır.
5. Kaynaklar güvenilirlik durumuna göre (Resmi/İkincil) etiketlenir.

## Testler

### Tüm Testleri Çalıştır
```bash
pnpm test
```

### Testleri Bir Kez Çalıştır
```bash
pnpm test:run
```

### Test Kapsamı
- **Alıntı Testleri:** `src/tests/citation.test.ts`
  - Temel alıntı ekleme
  - Çoklu alıntılar
  - Örtüşen alıntılar
  - Geçersiz segment indeksleri

- **Domain Testleri:** `src/tests/domains.test.ts`
  - Exact domain eşleşmesi
  - Subdomain desteği
  - Strict mode gereksinimleri

## Proje Yapısı

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # Ana chat API endpoint'i
│   │   └── upload/route.ts    # Dosya yükleme endpoint'i
│   ├── page.tsx               # Ana sayfa
│   └── layout.tsx             # Root layout
├── components/
│   ├── ChatInterface.tsx      # Ana chat UI
│   ├── MessageBubble.tsx      # Mesaj balonu
│   └── SourcesPanel.tsx       # Kaynaklar paneli
├── rag/
│   ├── evidence.ts            # Temel interface'ler
│   ├── web-search.ts          # Web Search provider
│   └── file-search.ts         # File Search provider
├── utils/
│   ├── citation.ts            # Alıntı ekleme mantığı
│   ├── domains.ts             # Domain doğrulama
│   └── gemini-client.ts       # Gemini client singleton
└── tests/
    ├── citation.test.ts       # Alıntı testleri
    └── domains.test.ts        # Domain testleri
```

## Güvenilir Kaynak Domainleri

Varsayılan olarak aşağıdaki resmi Türk hukuk kaynakları güvenilir kabul edilir:

| Domain | Açıklama |
|--------|----------|
| `mevzuat.gov.tr` | Mevzuat Bilgi Sistemi |
| `resmigazete.gov.tr` | Resmi Gazete |
| `anayasa.gov.tr` | Anayasa Mahkemesi |
| `yargitay.gov.tr` | Yargıtay |
| `danistay.gov.tr` | Danıştay |
| `barobirlik.org.tr` | Türkiye Barolar Birliği |

## Phase 2: RAG ile Dosya Arama (Gelecek)

### Mevcut Durum
- Temel dosya yükleme altyapısı hazır
- Gemini File Search tool entegrasyonu mevcut
- Feature flag: `EVIDENCE_PROVIDER=file_search`

### Planlanan Geliştirmeler
1. **Belge İşleme Pipeline'ı**
   - PDF metin çıkarma optimizasyonu
   - Tablo ve yapılandırılmış veri desteği
   - OCR entegrasyonu

2. **Vektör Store Yönetimi**
   - Kalıcı store desteği
   - Belge versiyonlama
   - Toplu yükleme

3. **Hibrit Arama**
   - Web + Dosya aramayı birleştirme
   - Kaynak önceliklendirme
   - Çapraz referans kontrolü

4. **Mevzuat Veritabanı**
   - Önceden indekslenmiş Türk mevzuatı
   - Otomatik güncelleme mekanizması
   - Madde bazlı arama

## Halüsinasyon Önleme Kuralları

1. **Kaynak yoksa iddia yok** - Doğrulanamayan bilgi paylaşılmaz
2. **Uydurma yasak** - Kanun adları, madde numaraları, mahkeme kararları fabrike edilmez
3. **Düşük temperature** - Yaratıcılık yerine sadakati önceliklendirir
4. **Eksik bilgi sorulur** - Belirsiz durumlarda kullanıcıya soru sorulur
5. **Hukuki tavsiye değil** - Her yanıtta feragatname bulunur

## Lisans

MIT

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın
