# 🚀 Hukuk AI Chat - Deploy Rehberi

Bu rehber, Hukuk AI Chat uygulamasını Vercel'e deploy ederek başkalarıyla paylaşmanızı sağlar.

## 📋 Seçenekler

### 1. **Vercel (Önerilen) - Ücretsiz ve Kolay**

#### Adım 1: GitHub'a Push
```bash
# Git repository oluştur
git init
git add .
git commit -m "Initial commit"
git branch -M main

# GitHub'da yeni repo oluştur, sonra:
git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
git push -u origin main
```

#### Adım 2: Vercel'e Deploy
1. [Vercel.com](https://vercel.com) adresine git
2. "Sign Up" ile GitHub hesabınla giriş yap
3. "Add New Project" tıkla
4. GitHub repo'nu seç
5. **Environment Variables** ekle:
   ```
   GEMINI_API_KEY=AIzaSyBTe1pKngLSJyV3lJdrHstpRRkPDeNqztU
   OPENAI_API_KEY= (opsiyonel)
   EVIDENCE_PROVIDER=web_search
   DEBUG=false
   ```
6. "Deploy" butonuna tıkla
7. ✅ **Hazır!** Uygulamanız `https://PROJE-ADI.vercel.app` adresinde yayında

#### Adım 3: Custom Domain (Opsiyonel)
- Vercel dashboard'dan "Settings" > "Domains"
- Kendi domain'inizi ekleyin

---

### 2. **Netlify (Alternatif)**

1. [Netlify.com](https://netlify.com) adresine git
2. GitHub repo'nu bağla
3. Build settings:
   - Build command: `pnpm build`
   - Publish directory: `.next`
4. Environment variables ekle (Vercel ile aynı)
5. Deploy!

---

### 3. **ngrok (Geçici Test İçin)**

Sadece hızlı test için:

```bash
# ngrok kurulumu
npm install -g ngrok

# Next.js dev server'ı başlat
pnpm dev

# Yeni terminal'de
ngrok http 3000
```

ngrok size bir link verecek: `https://xxxx-xx-xx-xx-xx.ngrok.io`
Bu linki paylaşabilirsiniz (sadece bilgisayarınız açıkken çalışır).

---

## 🔐 Güvenlik Notları

1. **API Key Güvenliği:**
   - API key'leri asla kod içine yazmayın
   - Vercel'de Environment Variables kullanın
   - Public repo'da `.env` dosyalarını `.gitignore`'a ekleyin

2. **Rate Limiting:**
   - Vercel'in ücretsiz planında rate limit var
   - Production'da kendi rate limiting'inizi ekleyin

3. **CORS:**
   - Vercel otomatik olarak CORS ayarlarını yapar
   - Custom domain kullanıyorsanız ek ayar gerekebilir

---

## 📝 Environment Variables Listesi

Vercel'de şu environment variables'ları ekleyin:

| Variable | Açıklama | Zorunlu | Varsayılan |
|----------|----------|---------|------------|
| `GEMINI_API_KEY` | Google Gemini API anahtarı | ✅ Evet | - |
| `OPENAI_API_KEY` | OpenAI API anahtarı (opsiyonel) | ❌ Hayır | - |
| `EVIDENCE_PROVIDER` | `web_search` veya `file_search` | ❌ Hayır | `web_search` |
| `ALLOWED_SOURCE_DOMAINS` | Güvenilir domainler (virgülle ayrılmış) | ❌ Hayır | `mevzuat.gov.tr,...` |
| `DEBUG` | Debug modu | ❌ Hayır | `false` |
| `STRICT_MODE_DEFAULT` | Varsayılan strict mode | ❌ Hayır | `false` |

---

## 🎯 Hızlı Başlangıç (Vercel CLI)

```bash
# Vercel CLI kurulumu
npm i -g vercel

# Proje dizininde
vercel

# Production deploy
vercel --prod
```

---

## ✅ Deploy Sonrası Kontrol Listesi

- [ ] Uygulama açılıyor mu?
- [ ] API çağrıları çalışıyor mu?
- [ ] Environment variables doğru mu?
- [ ] Custom domain çalışıyor mu? (varsa)
- [ ] HTTPS aktif mi?
- [ ] Rate limiting çalışıyor mu?

---

## 🆘 Sorun Giderme

### Build Hatası
```bash
# Local'de test et
pnpm build
```

### API Key Hatası
- Vercel dashboard'dan environment variables'ı kontrol et
- Deploy sonrası yeniden deploy et (env değişiklikleri için)

### CORS Hatası
- Vercel otomatik halleder, ek ayar gerekmez

---

## 📞 Destek

Sorun yaşarsanız:
1. Vercel logs'ları kontrol edin
2. Browser console'u kontrol edin
3. Network tab'ı kontrol edin
