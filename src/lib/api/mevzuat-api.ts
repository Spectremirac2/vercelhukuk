/**
 * Mevzuat.gov.tr API Entegrasyonu
 * 
 * Türk mevzuatına erişim sağlayan API servisi.
 * Not: Bu API şu anda simüle edilmiştir. Gerçek entegrasyon için
 * resmi API endpoint'leri kullanılmalıdır.
 */

export interface MevzuatDocument {
  id: string;
  mevzuatNo: string;
  mevzuatTur: MevzuatType;
  mevzuatAdi: string;
  kabulTarihi: string;
  resmiGazeteTarihi?: string;
  resmiGazeteSayisi?: string;
  maddeNo?: string;
  maddeBasi?: string;
  maddeMetni?: string;
  durum: "yururlukte" | "mulga" | "degisik";
  sonGuncelleme: string;
}

export type MevzuatType =
  | "kanun"
  | "khk"
  | "cbk"
  | "tuzuk"
  | "yonetmelik"
  | "teblig"
  | "genelge"
  | "anayasa";

export interface MevzuatSearchParams {
  query: string;
  mevzuatTur?: MevzuatType[];
  baslangicTarihi?: string;
  bitisTarihi?: string;
  sadeceyururlukte?: boolean;
  sayfa?: number;
  sayfaBoyutu?: number;
}

export interface MevzuatSearchResult {
  toplam: number;
  sayfa: number;
  sayfaBoyutu: number;
  sonuclar: MevzuatDocument[];
}

export interface MevzuatArticle {
  maddeNo: string;
  maddeBasi?: string;
  maddeMetni: string;
  fikralar: string[];
  bentler?: { harf: string; metin: string }[];
  geciciMadde?: boolean;
  ekMadde?: boolean;
  degisiklikTarihi?: string;
  degisiklikKanunu?: string;
}

// API Base URL - Gerçek entegrasyonda değiştirilmeli
const API_BASE_URL = process.env.NEXT_PUBLIC_MEVZUAT_API_URL || "https://api.mevzuat.gov.tr/v1";

// Rate limiting için cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 dakika

/**
 * API çağrısı yapan yardımcı fonksiyon
 */
async function fetchWithCache<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const cacheKey = `${endpoint}-${JSON.stringify(options?.body || {})}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data as T;
  } catch (error) {
    console.error("Mevzuat API error:", error);
    // Fallback to mock data in development
    return getMockData<T>(endpoint);
  }
}

/**
 * Mevzuat arama
 */
export async function searchMevzuat(
  params: MevzuatSearchParams
): Promise<MevzuatSearchResult> {
  const queryParams = new URLSearchParams();
  queryParams.set("q", params.query);
  
  if (params.mevzuatTur?.length) {
    queryParams.set("tur", params.mevzuatTur.join(","));
  }
  if (params.baslangicTarihi) {
    queryParams.set("baslangic", params.baslangicTarihi);
  }
  if (params.bitisTarihi) {
    queryParams.set("bitis", params.bitisTarihi);
  }
  if (params.sadeceyururlukte) {
    queryParams.set("yururlukte", "true");
  }
  queryParams.set("sayfa", String(params.sayfa || 1));
  queryParams.set("boyut", String(params.sayfaBoyutu || 20));

  return fetchWithCache<MevzuatSearchResult>(`/arama?${queryParams.toString()}`);
}

/**
 * Mevzuat detayı getir
 */
export async function getMevzuatById(id: string): Promise<MevzuatDocument | null> {
  try {
    return await fetchWithCache<MevzuatDocument>(`/mevzuat/${id}`);
  } catch {
    return null;
  }
}

/**
 * Kanun maddesi getir
 */
export async function getKanunMaddesi(
  kanunNo: string,
  maddeNo: string
): Promise<MevzuatArticle | null> {
  try {
    return await fetchWithCache<MevzuatArticle>(
      `/kanun/${kanunNo}/madde/${maddeNo}`
    );
  } catch {
    return null;
  }
}

/**
 * Popüler kanunları getir
 */
export async function getPopulerKanunlar(): Promise<MevzuatDocument[]> {
  return fetchWithCache<MevzuatDocument[]>("/populer");
}

/**
 * Kanun türüne göre listele
 */
export async function getMevzuatByTur(
  tur: MevzuatType,
  sayfa: number = 1,
  sayfaBoyutu: number = 20
): Promise<MevzuatSearchResult> {
  return fetchWithCache<MevzuatSearchResult>(
    `/mevzuat?tur=${tur}&sayfa=${sayfa}&boyut=${sayfaBoyutu}`
  );
}

/**
 * Son değişiklikleri getir
 */
export async function getSonDegisiklikler(
  gun: number = 30
): Promise<MevzuatDocument[]> {
  return fetchWithCache<MevzuatDocument[]>(`/degisiklikler?gun=${gun}`);
}

// Mock data for development
function getMockData<T>(endpoint: string): T {
  const mockResults: MevzuatSearchResult = {
    toplam: 3,
    sayfa: 1,
    sayfaBoyutu: 20,
    sonuclar: [
      {
        id: "6098",
        mevzuatNo: "6098",
        mevzuatTur: "kanun",
        mevzuatAdi: "Türk Borçlar Kanunu",
        kabulTarihi: "2011-01-11",
        resmiGazeteTarihi: "2011-02-04",
        resmiGazeteSayisi: "27836",
        durum: "yururlukte",
        sonGuncelleme: "2024-06-15",
      },
      {
        id: "4857",
        mevzuatNo: "4857",
        mevzuatTur: "kanun",
        mevzuatAdi: "İş Kanunu",
        kabulTarihi: "2003-05-22",
        resmiGazeteTarihi: "2003-06-10",
        resmiGazeteSayisi: "25134",
        durum: "yururlukte",
        sonGuncelleme: "2024-09-20",
      },
      {
        id: "6102",
        mevzuatNo: "6102",
        mevzuatTur: "kanun",
        mevzuatAdi: "Türk Ticaret Kanunu",
        kabulTarihi: "2011-01-13",
        resmiGazeteTarihi: "2011-02-14",
        resmiGazeteSayisi: "27846",
        durum: "yururlukte",
        sonGuncelleme: "2024-08-10",
      },
    ],
  };

  if (endpoint.includes("/arama")) {
    return mockResults as T;
  }

  if (endpoint.includes("/populer")) {
    return mockResults.sonuclar as T;
  }

  return mockResults as T;
}

/**
 * Mevzuat türü adını getir
 */
export function getMevzuatTurAdi(tur: MevzuatType): string {
  const turlar: Record<MevzuatType, string> = {
    anayasa: "Anayasa",
    kanun: "Kanun",
    khk: "Kanun Hükmünde Kararname",
    cbk: "Cumhurbaşkanlığı Kararnamesi",
    tuzuk: "Tüzük",
    yonetmelik: "Yönetmelik",
    teblig: "Tebliğ",
    genelge: "Genelge",
  };
  return turlar[tur] || tur;
}

/**
 * Mevzuat bağlantısı oluştur
 */
export function getMevzuatUrl(mevzuatNo: string, tur: MevzuatType): string {
  return `https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=${mevzuatNo}&MevzuatTur=${getMevzuatTurKodu(tur)}`;
}

function getMevzuatTurKodu(tur: MevzuatType): number {
  const kodlar: Record<MevzuatType, number> = {
    anayasa: 0,
    kanun: 1,
    khk: 4,
    cbk: 19,
    tuzuk: 2,
    yonetmelik: 3,
    teblig: 9,
    genelge: 12,
  };
  return kodlar[tur] || 1;
}
