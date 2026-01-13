/**
 * Yargıtay İçtihat Bankası API Entegrasyonu
 * 
 * Yargıtay kararlarına erişim sağlayan API servisi.
 * Not: Bu API şu anda simüle edilmiştir. Gerçek entegrasyon için
 * resmi API endpoint'leri kullanılmalıdır.
 */

export interface YargitayKarar {
  id: string;
  daire: string;
  daireNo: number;
  esasNo: string;
  kararNo: string;
  kararTarihi: string;
  hukukAlani: HukukAlani;
  konuBasliklari: string[];
  ozet: string;
  kararMetni?: string;
  kanunMaddeleri: KanunMaddesi[];
  onemDerecesi: "emsal" | "normal" | "guncel";
  gorusler?: {
    cogunluk: string;
    karsiOy?: string;
  };
}

export type HukukAlani =
  | "medeni"
  | "is"
  | "ticaret"
  | "ceza"
  | "idare"
  | "icra-iflas"
  | "aile"
  | "miras"
  | "esya"
  | "borclar"
  | "tuketici"
  | "sozlesme";

export interface KanunMaddesi {
  kanunNo: string;
  kanunAdi: string;
  maddeNo: string;
  fikraNo?: string;
}

export interface YargitaySearchParams {
  query: string;
  daireler?: number[];
  hukukAlani?: HukukAlani[];
  baslangicTarihi?: string;
  bitisTarihi?: string;
  sadeceEmsal?: boolean;
  kanunMaddesi?: string;
  sayfa?: number;
  sayfaBoyutu?: number;
}

export interface YargitaySearchResult {
  toplam: number;
  sayfa: number;
  sayfaBoyutu: number;
  sonuclar: YargitayKarar[];
}

export interface DaireInfo {
  no: number;
  ad: string;
  hukukAlanlari: HukukAlani[];
  aciklama: string;
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_YARGITAY_API_URL || "https://api.yargitay.gov.tr/v1";

// Cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 dakika

/**
 * API çağrısı yapan yardımcı fonksiyon
 */
async function fetchWithCache<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const cacheKey = `yargitay-${endpoint}-${JSON.stringify(options?.body || {})}`;
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
    console.error("Yargıtay API error:", error);
    return getMockData<T>(endpoint);
  }
}

/**
 * İçtihat arama
 */
export async function searchIctihat(
  params: YargitaySearchParams
): Promise<YargitaySearchResult> {
  const queryParams = new URLSearchParams();
  queryParams.set("q", params.query);

  if (params.daireler?.length) {
    queryParams.set("daireler", params.daireler.join(","));
  }
  if (params.hukukAlani?.length) {
    queryParams.set("alan", params.hukukAlani.join(","));
  }
  if (params.baslangicTarihi) {
    queryParams.set("baslangic", params.baslangicTarihi);
  }
  if (params.bitisTarihi) {
    queryParams.set("bitis", params.bitisTarihi);
  }
  if (params.sadeceEmsal) {
    queryParams.set("emsal", "true");
  }
  if (params.kanunMaddesi) {
    queryParams.set("madde", params.kanunMaddesi);
  }
  queryParams.set("sayfa", String(params.sayfa || 1));
  queryParams.set("boyut", String(params.sayfaBoyutu || 20));

  return fetchWithCache<YargitaySearchResult>(`/arama?${queryParams.toString()}`);
}

/**
 * Karar detayı getir
 */
export async function getKararById(id: string): Promise<YargitayKarar | null> {
  try {
    return await fetchWithCache<YargitayKarar>(`/karar/${id}`);
  } catch {
    return null;
  }
}

/**
 * Daireye göre kararları getir
 */
export async function getKararlarByDaire(
  daireNo: number,
  sayfa: number = 1,
  sayfaBoyutu: number = 20
): Promise<YargitaySearchResult> {
  return fetchWithCache<YargitaySearchResult>(
    `/daire/${daireNo}/kararlar?sayfa=${sayfa}&boyut=${sayfaBoyutu}`
  );
}

/**
 * Emsal kararları getir
 */
export async function getEmsalKararlar(
  hukukAlani?: HukukAlani,
  limit: number = 10
): Promise<YargitayKarar[]> {
  const params = new URLSearchParams();
  if (hukukAlani) {
    params.set("alan", hukukAlani);
  }
  params.set("limit", String(limit));

  return fetchWithCache<YargitayKarar[]>(`/emsal?${params.toString()}`);
}

/**
 * Son kararları getir
 */
export async function getSonKararlar(
  gun: number = 30,
  limit: number = 20
): Promise<YargitayKarar[]> {
  return fetchWithCache<YargitayKarar[]>(`/son?gun=${gun}&limit=${limit}`);
}

/**
 * Benzer kararları bul
 */
export async function findSimilarKararlar(
  kararId: string,
  limit: number = 5
): Promise<YargitayKarar[]> {
  return fetchWithCache<YargitayKarar[]>(`/karar/${kararId}/benzer?limit=${limit}`);
}

/**
 * Kanun maddesine göre kararları getir
 */
export async function getKararlarByKanunMaddesi(
  kanunNo: string,
  maddeNo: string,
  sayfa: number = 1,
  sayfaBoyutu: number = 20
): Promise<YargitaySearchResult> {
  return fetchWithCache<YargitaySearchResult>(
    `/kanun/${kanunNo}/madde/${maddeNo}/kararlar?sayfa=${sayfa}&boyut=${sayfaBoyutu}`
  );
}

/**
 * Daire bilgilerini getir
 */
export function getDaireBilgisi(daireNo: number): DaireInfo | null {
  const daireler: DaireInfo[] = [
    { no: 1, ad: "1. Hukuk Dairesi", hukukAlanlari: ["medeni", "esya"], aciklama: "Taşınmaz mülkiyeti, tapu iptali, el atmanın önlenmesi" },
    { no: 2, ad: "2. Hukuk Dairesi", hukukAlanlari: ["aile"], aciklama: "Boşanma, velayet, nafaka, mal paylaşımı" },
    { no: 3, ad: "3. Hukuk Dairesi", hukukAlanlari: ["borclar"], aciklama: "Tazminat, alacak, haksız fiil" },
    { no: 4, ad: "4. Hukuk Dairesi", hukukAlanlari: ["borclar"], aciklama: "Borçlar, tazminat, sözleşme" },
    { no: 5, ad: "5. Hukuk Dairesi", hukukAlanlari: ["medeni"], aciklama: "Kamulaştırma, irtifak hakları" },
    { no: 6, ad: "6. Hukuk Dairesi", hukukAlanlari: ["borclar", "sozlesme"], aciklama: "Kira, ortaklığın giderilmesi" },
    { no: 7, ad: "7. Hukuk Dairesi", hukukAlanlari: ["miras", "medeni"], aciklama: "Miras, kadastro" },
    { no: 8, ad: "8. Hukuk Dairesi", hukukAlanlari: ["miras", "aile"], aciklama: "Miras, aile, zilyetlik" },
    { no: 9, ad: "9. Hukuk Dairesi", hukukAlanlari: ["is"], aciklama: "İş sözleşmesi, fesih, tazminat" },
    { no: 10, ad: "10. Hukuk Dairesi", hukukAlanlari: ["is"], aciklama: "Sosyal güvenlik, iş kazası" },
    { no: 11, ad: "11. Hukuk Dairesi", hukukAlanlari: ["ticaret"], aciklama: "Ticari davalar, sigorta, banka" },
    { no: 12, ad: "12. Hukuk Dairesi", hukukAlanlari: ["icra-iflas"], aciklama: "İcra-iflas, takip" },
    { no: 13, ad: "13. Hukuk Dairesi", hukukAlanlari: ["tuketici", "borclar"], aciklama: "Tüketici, alacak, sözleşme" },
    { no: 14, ad: "14. Hukuk Dairesi", hukukAlanlari: ["medeni", "esya"], aciklama: "Taşınmaz, ortaklığın giderilmesi" },
    { no: 15, ad: "15. Hukuk Dairesi", hukukAlanlari: ["ticaret", "sozlesme"], aciklama: "Eser sözleşmesi, arsa payı" },
    { no: 17, ad: "17. Hukuk Dairesi", hukukAlanlari: ["medeni", "ticaret"], aciklama: "Taşınmaz, ticaret, sigorta" },
    { no: 19, ad: "19. Hukuk Dairesi", hukukAlanlari: ["ticaret", "icra-iflas"], aciklama: "Ticaret, iflas, konkordato" },
    { no: 21, ad: "21. Hukuk Dairesi", hukukAlanlari: ["is"], aciklama: "İş hukuku, iş kazası, meslek hastalığı" },
    { no: 22, ad: "22. Hukuk Dairesi", hukukAlanlari: ["is"], aciklama: "İş hukuku, işe iade, fesih" },
    { no: 23, ad: "23. Hukuk Dairesi", hukukAlanlari: ["ticaret"], aciklama: "Ticari davalar, şirketler" },
  ];

  return daireler.find((d) => d.no === daireNo) || null;
}

/**
 * Tüm daireleri getir
 */
export function getAllDaireler(): DaireInfo[] {
  const daireler: DaireInfo[] = [];
  for (let i = 1; i <= 23; i++) {
    const daire = getDaireBilgisi(i);
    if (daire) daireler.push(daire);
  }
  return daireler;
}

/**
 * Hukuk alanı adını getir
 */
export function getHukukAlaniAdi(alan: HukukAlani): string {
  const alanlar: Record<HukukAlani, string> = {
    medeni: "Medeni Hukuk",
    is: "İş Hukuku",
    ticaret: "Ticaret Hukuku",
    ceza: "Ceza Hukuku",
    idare: "İdare Hukuku",
    "icra-iflas": "İcra-İflas Hukuku",
    aile: "Aile Hukuku",
    miras: "Miras Hukuku",
    esya: "Eşya Hukuku",
    borclar: "Borçlar Hukuku",
    tuketici: "Tüketici Hukuku",
    sozlesme: "Sözleşme Hukuku",
  };
  return alanlar[alan] || alan;
}

/**
 * Karar bağlantısı oluştur
 */
export function getKararUrl(daireNo: number, esasNo: string, kararNo: string): string {
  return `https://karararama.yargitay.gov.tr/KararArama/KararDetay?DaireNo=${daireNo}&EsasNo=${encodeURIComponent(esasNo)}&KararNo=${encodeURIComponent(kararNo)}`;
}

// Mock data
function getMockData<T>(endpoint: string): T {
  const mockKararlar: YargitayKarar[] = [
    {
      id: "y-2024-1234",
      daire: "9. Hukuk Dairesi",
      daireNo: 9,
      esasNo: "2024/1234",
      kararNo: "2024/5678",
      kararTarihi: "2024-11-15",
      hukukAlani: "is",
      konuBasliklari: ["Fesih", "İhbar Tazminatı", "Kıdem Tazminatı"],
      ozet: "İşçinin iş sözleşmesinin feshi halinde, işverenin ihbar ve kıdem tazminatı yükümlülüğü bulunmaktadır.",
      kanunMaddeleri: [
        { kanunNo: "4857", kanunAdi: "İş Kanunu", maddeNo: "17" },
        { kanunNo: "4857", kanunAdi: "İş Kanunu", maddeNo: "25" },
      ],
      onemDerecesi: "emsal",
    },
    {
      id: "y-2024-2345",
      daire: "2. Hukuk Dairesi",
      daireNo: 2,
      esasNo: "2024/2345",
      kararNo: "2024/6789",
      kararTarihi: "2024-10-20",
      hukukAlani: "aile",
      konuBasliklari: ["Boşanma", "Maddi Tazminat", "Manevi Tazminat"],
      ozet: "Boşanma davasında kusur belirlemesi ve tazminat hesabı hakkında.",
      kanunMaddeleri: [
        { kanunNo: "4721", kanunAdi: "Türk Medeni Kanunu", maddeNo: "174" },
      ],
      onemDerecesi: "normal",
    },
    {
      id: "y-2024-3456",
      daire: "11. Hukuk Dairesi",
      daireNo: 11,
      esasNo: "2024/3456",
      kararNo: "2024/7890",
      kararTarihi: "2024-09-10",
      hukukAlani: "ticaret",
      konuBasliklari: ["Ticari Satış", "Ayıplı Mal", "Tazminat"],
      ozet: "Ticari satışta ayıplı mal teslimi halinde alıcının hakları.",
      kanunMaddeleri: [
        { kanunNo: "6102", kanunAdi: "Türk Ticaret Kanunu", maddeNo: "23" },
        { kanunNo: "6098", kanunAdi: "Türk Borçlar Kanunu", maddeNo: "219" },
      ],
      onemDerecesi: "emsal",
    },
  ];

  const mockResult: YargitaySearchResult = {
    toplam: mockKararlar.length,
    sayfa: 1,
    sayfaBoyutu: 20,
    sonuclar: mockKararlar,
  };

  if (endpoint.includes("/arama") || endpoint.includes("/kararlar")) {
    return mockResult as T;
  }

  if (endpoint.includes("/emsal") || endpoint.includes("/son") || endpoint.includes("/benzer")) {
    return mockKararlar as T;
  }

  if (endpoint.includes("/karar/")) {
    return mockKararlar[0] as T;
  }

  return mockResult as T;
}
