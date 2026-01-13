/**
 * Güncel Mevzuat Değişiklikleri Modülü
 * 
 * Son yasal değişiklikler, güncellemeler ve önemli duyurular
 * Hukuk profesyonelleri ve vatandaşlar için güncel bilgiler
 */

export interface LegislationUpdate {
  id: string;
  title: string;
  summary: string;
  fullDescription: string;
  category: UpdateCategory;
  effectiveDate: string;
  publishDate: string;
  officialGazetteNo?: string;
  officialGazetteDate?: string;
  affectedLaws: string[];
  keyChanges: string[];
  practicalImpact: string[];
  importance: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'pending' | 'expired';
  sources: string[];
  tags: string[];
}

export type UpdateCategory = 
  | 'is_hukuku'
  | 'vergi'
  | 'ticaret'
  | 'tuketici'
  | 'kira'
  | 'ceza'
  | 'idare'
  | 'kvkk'
  | 'sosyal_guvenlik'
  | 'icra_iflas'
  | 'aile'
  | 'genel';

export const UPDATE_CATEGORIES: Record<UpdateCategory, { name: string; color: string }> = {
  is_hukuku: { name: 'İş Hukuku', color: '#3B82F6' },
  vergi: { name: 'Vergi Hukuku', color: '#10B981' },
  ticaret: { name: 'Ticaret Hukuku', color: '#8B5CF6' },
  tuketici: { name: 'Tüketici Hukuku', color: '#F59E0B' },
  kira: { name: 'Kira Hukuku', color: '#EC4899' },
  ceza: { name: 'Ceza Hukuku', color: '#EF4444' },
  idare: { name: 'İdare Hukuku', color: '#6366F1' },
  kvkk: { name: 'Kişisel Veriler', color: '#14B8A6' },
  sosyal_guvenlik: { name: 'Sosyal Güvenlik', color: '#F97316' },
  icra_iflas: { name: 'İcra İflas', color: '#84CC16' },
  aile: { name: 'Aile Hukuku', color: '#D946EF' },
  genel: { name: 'Genel', color: '#6B7280' }
};

// ============================================
// 2024 YILI ÖNEMLİ DEĞİŞİKLİKLER
// ============================================

export const LEGISLATION_UPDATES: LegislationUpdate[] = [
  // İŞ HUKUKU
  {
    id: 'update_2024_001',
    title: 'Asgari Ücret Artışı - 2024',
    summary: '2024 yılı için asgari ücret brüt 20.002,50 TL, net 17.002,12 TL olarak belirlendi.',
    fullDescription: `2024 yılı asgari ücreti Asgari Ücret Tespit Komisyonu tarafından belirlenerek 1 Ocak 2024 tarihinden itibaren yürürlüğe girmiştir.

**Brüt Asgari Ücret:** 20.002,50 TL
**Net Asgari Ücret:** 17.002,12 TL (bekar, çocuksuz)

**Yıllık Artış Oranı:** Yaklaşık %49

Bu artış ile birlikte:
- Kıdem tazminatı tavanı güncellendi
- SGK prim tabanları değişti
- İşsizlik maaşı tabanları güncellendi`,
    category: 'is_hukuku',
    effectiveDate: '2024-01-01',
    publishDate: '2023-12-28',
    officialGazetteNo: '32414',
    officialGazetteDate: '2023-12-28',
    affectedLaws: ['4857 sayılı İş Kanunu', '5510 sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu'],
    keyChanges: [
      'Brüt asgari ücret: 20.002,50 TL',
      'Net asgari ücret: 17.002,12 TL',
      'İşveren maliyeti: 23.502,94 TL',
      'Asgari geçim indirimi dahil edildi'
    ],
    practicalImpact: [
      'İşverenlerin maliyet planlamalarını güncellemesi gerekiyor',
      'Haczedilemez maaş alt sınırı yükseldi',
      'SGK primleri ve işsizlik sigortası tutarları arttı'
    ],
    importance: 'critical',
    status: 'active',
    sources: ['Resmi Gazete', 'Çalışma ve Sosyal Güvenlik Bakanlığı'],
    tags: ['asgari ücret', 'ücret', 'maaş', 'sgk', '2024']
  },
  {
    id: 'update_2024_002',
    title: 'Kıdem Tazminatı Tavanı Güncelleme - Ocak 2024',
    summary: 'Kıdem tazminatı tavan tutarı 35.058,58 TL olarak belirlendi.',
    fullDescription: `Devlet Memurları Kanunu'na tabi en yüksek devlet memuru olan Cumhurbaşkanlığı İdari İşler Başkanı'nın aylık tutarına göre belirlenen kıdem tazminatı tavanı güncellendi.

**Ocak-Haziran 2024:** 35.058,58 TL

Bu tutar her 6 ayda bir güncellenmektedir. Temmuz 2024'te yeni güncelleme yapılacaktır.`,
    category: 'is_hukuku',
    effectiveDate: '2024-01-01',
    publishDate: '2024-01-01',
    affectedLaws: ['1475 sayılı İş Kanunu m.14'],
    keyChanges: [
      'Kıdem tazminatı tavanı: 35.058,58 TL',
      'Önceki dönem tavanı: 23.489,83 TL',
      'Artış oranı: %49,3'
    ],
    practicalImpact: [
      'Yüksek maaşlı işçilerin kıdem tazminatı hesabı etkilendi',
      'Tavan üstü kazananlar için sınırlama devam ediyor'
    ],
    importance: 'high',
    status: 'active',
    sources: ['Resmi Gazete'],
    tags: ['kıdem tazminatı', 'tavan', 'işçi hakları', '2024']
  },

  // KİRA HUKUKU
  {
    id: 'update_2024_003',
    title: 'Kira Artış Tavanı Uzatıldı - 2024',
    summary: 'Konut kiralarında %25 artış tavanı 1 Temmuz 2024\'e kadar uzatıldı.',
    fullDescription: `7456 sayılı Kanun ile getirilen konut kira artış sınırlaması uzatılmıştır.

**Düzenleme:**
- Konut kiralarında yıllık artış oranı %25'i geçemez
- TÜFE oranı ne olursa olsun bu tavan uygulanır
- İşyeri kiralarında da benzer sınırlama devam etmektedir

**Süre:** 1 Temmuz 2024'e kadar geçerli

**Önemli:** Bu düzenleme yeni kira sözleşmeleri için geçerli değildir, sadece mevcut sözleşmelerin yenilenmesinde uygulanır.`,
    category: 'kira',
    effectiveDate: '2024-01-01',
    publishDate: '2023-07-01',
    officialGazetteNo: '32236',
    affectedLaws: ['6098 sayılı TBK m.344', '7456 sayılı Kanun'],
    keyChanges: [
      'Konut kiralarında %25 artış tavanı',
      'İşyeri kiralarında TÜFE sınırı devam',
      '1 Temmuz 2024\'e kadar geçerli'
    ],
    practicalImpact: [
      'Kiracılar %25\'in üzerinde artış kabul etmek zorunda değil',
      'Ev sahipleri yargı yoluna başvurabilir (kira tespit)',
      'Yeni kira sözleşmelerinde serbest piyasa koşulları geçerli'
    ],
    importance: 'high',
    status: 'active',
    sources: ['Resmi Gazete', 'Adalet Bakanlığı'],
    tags: ['kira artışı', '%25 tavan', 'konut kirası', 'kiracı hakları']
  },

  // VERGİ HUKUKU
  {
    id: 'update_2024_004',
    title: 'KDV Oranları Değişikliği',
    summary: 'Genel KDV oranı %18\'den %20\'ye çıkarıldı.',
    fullDescription: `7456 sayılı Kanun ile KDV oranlarında değişiklik yapılmıştır.

**Yeni KDV Oranları:**
- Genel oran: %20 (eski: %18)
- İndirimli oran: %10 (değişmedi)
- Süper indirimli oran: %1 (değişmedi)

**%10 Orana Tabi Ürünler:**
- Temel gıda maddeleri (bazıları)
- Turizm işletmeleri
- Sağlık hizmetleri
- Tekstil ürünleri

**%1 Orana Tabi:**
- Ekmek, un, süt, yumurta
- Gazete, dergi
- 150 m² altı konut teslimleri`,
    category: 'vergi',
    effectiveDate: '2023-07-10',
    publishDate: '2023-07-07',
    officialGazetteNo: '32241',
    affectedLaws: ['3065 sayılı KDV Kanunu'],
    keyChanges: [
      'Genel KDV oranı %18\'den %20\'ye çıktı',
      '%10 ve %1 oranlar korundu',
      'Bazı mal ve hizmetlerde oran güncellemesi'
    ],
    practicalImpact: [
      'Fiyatlar %2 oranında artış gösterebilir',
      'E-fatura ve ÖKC güncellemesi gerekebilir',
      'KDV beyannamelerinde yeni oran kullanılacak'
    ],
    importance: 'high',
    status: 'active',
    sources: ['Resmi Gazete', 'Gelir İdaresi Başkanlığı'],
    tags: ['kdv', 'vergi', '%20', 'vergi oranları']
  },
  {
    id: 'update_2024_005',
    title: 'Gelir Vergisi Dilimleri - 2024',
    summary: '2024 yılı için gelir vergisi dilimleri güncellendi.',
    fullDescription: `2024 yılı gelir vergisi tarifesi yeniden değerleme oranına göre güncellendi.

**2024 Gelir Vergisi Dilimleri:**
| Dilim | Oran |
|-------|------|
| 0 - 110.000 TL | %15 |
| 110.000 - 230.000 TL | %20 |
| 230.000 - 580.000 TL | %27 |
| 580.000 - 3.000.000 TL | %35 |
| 3.000.000 TL üzeri | %40 |

Ücret gelirleri için farklı dilimler uygulanabilir.`,
    category: 'vergi',
    effectiveDate: '2024-01-01',
    publishDate: '2023-12-30',
    officialGazetteNo: '32416',
    affectedLaws: ['193 sayılı Gelir Vergisi Kanunu'],
    keyChanges: [
      'İlk dilim: 110.000 TL\'ye kadar %15',
      'En yüksek oran: %40 (3M TL üzeri)',
      'Yeniden değerleme oranı uygulandı'
    ],
    practicalImpact: [
      'Vergi planlaması yeniden yapılmalı',
      'Kümülatif matrah hesapları güncellenmeli',
      'Muhtasar beyannamelerde yeni dilimler'
    ],
    importance: 'high',
    status: 'active',
    sources: ['Resmi Gazete', 'GİB'],
    tags: ['gelir vergisi', 'vergi dilimleri', '2024', 'matrah']
  },

  // TÜKETİCİ HUKUKU
  {
    id: 'update_2024_006',
    title: 'Tüketici Davalarında Zorunlu Arabuluculuk',
    summary: '1 Ocak 2024\'ten itibaren tüketici davalarında arabuluculuk dava şartı oldu.',
    fullDescription: `7445 sayılı Kanun değişikliği ile tüketici uyuşmazlıklarında zorunlu arabuluculuk getirilmiştir.

**Kapsam:**
- Tüketici işlemlerinden doğan davalar
- Tüketici hakem heyeti kararlarına itiraz davaları (hariç)

**Önemli Noktalar:**
- Dava açılmadan önce arabulucuya başvuru zorunlu
- Arabuluculuk son tutanağı dava dilekçesine eklenmeli
- Arabuluculuk süresi 4 hafta (uzatılabilir)

**İstisnalar:**
- Tüketici hakem heyeti kararlarına itiraz
- Geçici hukuki koruma talepleri`,
    category: 'tuketici',
    effectiveDate: '2024-01-01',
    publishDate: '2023-11-28',
    officialGazetteNo: '32383',
    affectedLaws: ['6502 sayılı TKHK', '6325 sayılı Arabuluculuk Kanunu'],
    keyChanges: [
      'Tüketici davalarında arabuluculuk zorunlu',
      'Dava şartı olarak düzenlendi',
      'Süre: 4 hafta (+2 hafta uzatma)'
    ],
    practicalImpact: [
      'Dava açmadan önce arabulucuya başvurmak gerekiyor',
      'Arabuluculuk masrafı taraflarca karşılanır',
      'Uyuşmazlıklar daha hızlı çözülebilir'
    ],
    importance: 'critical',
    status: 'active',
    sources: ['Resmi Gazete', 'Adalet Bakanlığı'],
    tags: ['tüketici', 'arabuluculuk', 'dava şartı', 'zorunlu arabuluculuk']
  },

  // KVKK
  {
    id: 'update_2024_007',
    title: 'KVKK 2025 Yönetmelik Değişiklikleri',
    summary: 'Kişisel verilerin korunması ile ilgili yeni yönetmelik düzenlemeleri.',
    fullDescription: `Kişisel Verileri Koruma Kurumu 2024-2025 döneminde önemli düzenlemeler yapmıştır.

**Önemli Değişiklikler:**

1. **SMS Doğrulama Kodu Düzenlemesi**
   - Tek kullanımlık şifreler kişisel veri sayılmaz
   - Servis sağlayıcılar bu verileri işleyebilir

2. **İdari Para Cezası Güncellemesi**
   - Üst sınır: 9.013.500 TL (2024)
   - Yeniden değerleme oranına göre artar

3. **Sağlık Verisi İşleme**
   - Hekimler sır saklama yükümlülüğü kapsamında işleyebilir
   - Hastanelerin veri işleme kuralları netleşti

4. **Yurtdışı Veri Aktarımı**
   - Yeterlilik kararı alınan ülke listesi güncellendi
   - Bağlayıcı şirket kuralları kolaylaştırıldı`,
    category: 'kvkk',
    effectiveDate: '2024-01-01',
    publishDate: '2024-01-15',
    affectedLaws: ['6698 sayılı KVKK'],
    keyChanges: [
      'SMS doğrulama kodları kişisel veri değil',
      'Para cezası üst sınırı: 9.013.500 TL',
      'Sağlık verisi işleme kuralları netleşti',
      'Yurtdışı aktarım prosedürleri güncellendi'
    ],
    practicalImpact: [
      'Şirketler KVKK politikalarını güncellemeli',
      'Aydınlatma metinleri gözden geçirilmeli',
      'Veri işleme envanteri güncellenmeli'
    ],
    importance: 'high',
    status: 'active',
    sources: ['KVKK', 'Resmi Gazete'],
    tags: ['kvkk', 'kişisel veri', 'veri koruma', 'idari para cezası']
  },

  // TİCARET HUKUKU
  {
    id: 'update_2024_008',
    title: 'Limited Şirket Asgari Sermaye Artışı',
    summary: 'Limited şirketlerde asgari sermaye 50.000 TL\'ye çıkarıldı.',
    fullDescription: `Türk Ticaret Kanunu değişikliği ile limited şirket asgari sermayesi artırıldı.

**Yeni Düzenleme:**
- Asgari sermaye: 50.000 TL (eski: 10.000 TL)
- Mevcut şirketler için geçiş süresi tanındı

**Geçiş Süreci:**
- 31 Aralık 2024'e kadar mevcut şirketler sermayelerini artırmalı
- Artırmayan şirketler için yaptırım uygulanabilir

**Anonim Şirketlerde:**
- Asgari sermaye: 50.000 TL (değişmedi)
- Kayıtlı sermaye sisteminde: 100.000 TL`,
    category: 'ticaret',
    effectiveDate: '2024-01-01',
    publishDate: '2023-11-29',
    officialGazetteNo: '32384',
    affectedLaws: ['6102 sayılı TTK m.580'],
    keyChanges: [
      'Ltd. Şti. asgari sermaye: 50.000 TL',
      'Mevcut şirketler için geçiş süresi: 31.12.2024',
      'A.Ş. asgari sermaye değişmedi'
    ],
    practicalImpact: [
      'Mevcut limited şirketler sermaye artırımı yapmalı',
      'Yeni kuruluşlarda daha yüksek sermaye gerekli',
      'Ticaret sicil işlemleri yoğunlaşabilir'
    ],
    importance: 'high',
    status: 'active',
    sources: ['Resmi Gazete', 'TOBB'],
    tags: ['limited şirket', 'sermaye', 'ttk', 'şirket kuruluşu']
  },

  // İCRA İFLAS
  {
    id: 'update_2024_009',
    title: 'Yeni Konkordato Düzenlemeleri',
    summary: 'Konkordato süreçleri ve şartlarında önemli değişiklikler yapıldı.',
    fullDescription: `İcra ve İflas Kanunu'nda konkordato hükümlerinde değişiklikler yapılmıştır.

**Önemli Değişiklikler:**

1. **Başvuru Şartları**
   - Mali tabloların bağımsız denetimden geçmesi gerekiyor
   - Ön proje daha detaylı hazırlanmalı

2. **Geçici Mühlet**
   - 3 ay (eski düzenleme korundu)
   - Uzatma 2 ay (toplam 5 ay)

3. **Kesin Mühlet**
   - 12 ay + 6 ay uzatma = 18 ay
   
4. **Komiser Ataması**
   - En az bir komiser zorunlu
   - Mali müşavir komiser olabilir

5. **Alacaklılar Toplantısı**
   - Online toplantı yapılabilir
   - Çoğunluk hesabı değişti`,
    category: 'icra_iflas',
    effectiveDate: '2024-01-01',
    publishDate: '2023-12-15',
    affectedLaws: ['2004 sayılı İİK m.285-309'],
    keyChanges: [
      'Bağımsız denetim zorunluluğu',
      'Online alacaklılar toplantısı',
      'Komiser atama kuralları güncellendi'
    ],
    practicalImpact: [
      'Konkordato başvuruları daha detaylı hazırlanmalı',
      'Mali tabloların denetlenmesi gerekiyor',
      'Süreç daha şeffaf hale geldi'
    ],
    importance: 'medium',
    status: 'active',
    sources: ['Resmi Gazete'],
    tags: ['konkordato', 'iflas', 'icra', 'mali kriz']
  },

  // SOSYAL GÜVENLİK
  {
    id: 'update_2024_010',
    title: 'Emeklilik Yaş Şartı Güncellemesi',
    summary: 'EYT sonrası emeklilik yaş şartları ve prim günleri güncellendi.',
    fullDescription: `Emeklilik şartlarında 7438 sayılı EYT Kanunu sonrası düzenlemeler devam etmektedir.

**Güncel Emeklilik Şartları (4/a - SSK):**

**Kadınlar:**
- 58 yaş + 7200 gün (20 yıl)
- veya 25 yıl sigortalılık + 4500 gün

**Erkekler:**
- 60 yaş + 7200 gün (20 yıl)
- veya 25 yıl sigortalılık + 5400 gün

**EYT Kapsamında Olanlar:**
- 08.09.1999 öncesi sigorta başlangıcı
- Yaş şartı aranmadan emeklilik hakkı

**Kısa Çalışma ve Ücretsiz İzin:**
- Borçlanma hakları devam ediyor`,
    category: 'sosyal_guvenlik',
    effectiveDate: '2023-03-03',
    publishDate: '2023-03-03',
    officialGazetteNo: '32121',
    affectedLaws: ['5510 sayılı Kanun', '7438 sayılı Kanun'],
    keyChanges: [
      'EYT kapsamı belirlendi',
      'Yaş şartı kaldırılan kesim tanımlandı',
      'Borçlanma hakları genişletildi'
    ],
    practicalImpact: [
      '2 milyonun üzerinde kişi emekli oldu',
      'SGK\'ya başvuru yoğunluğu yaşandı',
      'İşgücü piyasasında değişim oldu'
    ],
    importance: 'high',
    status: 'active',
    sources: ['Resmi Gazete', 'SGK'],
    tags: ['emeklilik', 'eyt', 'yaş şartı', 'sgk', 'prim günü']
  }
];

// ============================================
// YARDIMCI FONKSİYONLAR
// ============================================

export function getRecentUpdates(limit: number = 10): LegislationUpdate[] {
  return [...LEGISLATION_UPDATES]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, limit);
}

export function getUpdatesByCategory(category: UpdateCategory): LegislationUpdate[] {
  return LEGISLATION_UPDATES.filter(u => u.category === category);
}

export function getCriticalUpdates(): LegislationUpdate[] {
  return LEGISLATION_UPDATES.filter(u => u.importance === 'critical' && u.status === 'active');
}

export function searchUpdates(query: string): LegislationUpdate[] {
  const normalizedQuery = query.toLowerCase();
  
  return LEGISLATION_UPDATES.filter(update => {
    const searchableText = [
      update.title,
      update.summary,
      update.fullDescription,
      ...update.tags,
      ...update.keyChanges
    ].join(' ').toLowerCase();
    
    return searchableText.includes(normalizedQuery);
  });
}

export function getUpdateById(id: string): LegislationUpdate | undefined {
  return LEGISLATION_UPDATES.find(u => u.id === id);
}

export function getActiveUpdates(): LegislationUpdate[] {
  return LEGISLATION_UPDATES.filter(u => u.status === 'active');
}

export function getUpdatesAffectingLaw(lawNumber: string): LegislationUpdate[] {
  return LEGISLATION_UPDATES.filter(u => 
    u.affectedLaws.some(law => law.includes(lawNumber))
  );
}

// ============================================
// ÖNEMLİ TARİHLER
// ============================================

export interface ImportantDate {
  date: string;
  description: string;
  category: UpdateCategory;
  isRecurring: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

export const IMPORTANT_DATES_2024: ImportantDate[] = [
  {
    date: '2024-01-01',
    description: 'Asgari ücret yeni dönem başlangıcı',
    category: 'is_hukuku',
    isRecurring: true,
    frequency: 'yearly'
  },
  {
    date: '2024-01-01',
    description: 'Kıdem tazminatı tavanı güncelleme (1. dönem)',
    category: 'is_hukuku',
    isRecurring: true,
    frequency: 'yearly'
  },
  {
    date: '2024-01-26',
    description: 'Aralık dönemi muhtasar beyanname son günü',
    category: 'vergi',
    isRecurring: true,
    frequency: 'monthly'
  },
  {
    date: '2024-01-28',
    description: 'Aralık dönemi KDV beyanname son günü',
    category: 'vergi',
    isRecurring: true,
    frequency: 'monthly'
  },
  {
    date: '2024-03-31',
    description: 'Yıllık gelir vergisi beyanname son günü',
    category: 'vergi',
    isRecurring: true,
    frequency: 'yearly'
  },
  {
    date: '2024-04-30',
    description: 'Kurumlar vergisi beyanname son günü',
    category: 'vergi',
    isRecurring: true,
    frequency: 'yearly'
  },
  {
    date: '2024-05-31',
    description: 'Emlak vergisi 1. taksit son ödeme',
    category: 'vergi',
    isRecurring: true,
    frequency: 'yearly'
  },
  {
    date: '2024-07-01',
    description: 'Kıdem tazminatı tavanı güncelleme (2. dönem)',
    category: 'is_hukuku',
    isRecurring: true,
    frequency: 'yearly'
  },
  {
    date: '2024-07-01',
    description: 'Kira artış tavanı düzenlemesi bitiş tarihi',
    category: 'kira',
    isRecurring: false
  },
  {
    date: '2024-11-30',
    description: 'Emlak vergisi 2. taksit son ödeme',
    category: 'vergi',
    isRecurring: true,
    frequency: 'yearly'
  },
  {
    date: '2024-12-31',
    description: 'Limited şirket sermaye artırımı son gün',
    category: 'ticaret',
    isRecurring: false
  }
];

export function getUpcomingDates(daysAhead: number = 30): ImportantDate[] {
  const today = new Date();
  const futureDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  
  return IMPORTANT_DATES_2024.filter(date => {
    const dateObj = new Date(date.date);
    return dateObj >= today && dateObj <= futureDate;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
