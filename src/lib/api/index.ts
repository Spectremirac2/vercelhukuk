/**
 * Hukuk AI - API Entegrasyonları
 * 
 * Bu modül, Türk hukuk kaynaklarına erişim sağlayan API servislerini içerir.
 */

// Mevzuat.gov.tr API
export {
  searchMevzuat,
  getMevzuatById,
  getKanunMaddesi,
  getPopulerKanunlar,
  getMevzuatByTur,
  getSonDegisiklikler,
  getMevzuatTurAdi,
  getMevzuatUrl,
  type MevzuatDocument,
  type MevzuatType,
  type MevzuatSearchParams,
  type MevzuatSearchResult,
  type MevzuatArticle,
} from "./mevzuat-api";

// Yargıtay API
export {
  searchIctihat,
  getKararById,
  getKararlarByDaire,
  getEmsalKararlar,
  getSonKararlar,
  findSimilarKararlar,
  getKararlarByKanunMaddesi,
  getDaireBilgisi,
  getAllDaireler,
  getHukukAlaniAdi,
  getKararUrl,
  type YargitayKarar,
  type HukukAlani,
  type KanunMaddesi,
  type YargitaySearchParams,
  type YargitaySearchResult,
  type DaireInfo,
} from "./yargitay-api";

/**
 * API durumunu kontrol et
 */
export async function checkApiStatus(): Promise<{
  mevzuat: boolean;
  yargitay: boolean;
}> {
  const results = {
    mevzuat: false,
    yargitay: false,
  };

  try {
    const mevzuatResponse = await fetch(
      `${process.env.NEXT_PUBLIC_MEVZUAT_API_URL || "https://api.mevzuat.gov.tr"}/health`,
      { method: "HEAD", signal: AbortSignal.timeout(5000) }
    );
    results.mevzuat = mevzuatResponse.ok;
  } catch {
    results.mevzuat = false;
  }

  try {
    const yargitayResponse = await fetch(
      `${process.env.NEXT_PUBLIC_YARGITAY_API_URL || "https://api.yargitay.gov.tr"}/health`,
      { method: "HEAD", signal: AbortSignal.timeout(5000) }
    );
    results.yargitay = yargitayResponse.ok;
  } catch {
    results.yargitay = false;
  }

  return results;
}

/**
 * Birleşik arama - Hem mevzuat hem içtihat
 */
export async function unifiedSearch(
  query: string,
  options?: {
    includeMevzuat?: boolean;
    includeIctihat?: boolean;
    limit?: number;
  }
): Promise<{
  mevzuat: import("./mevzuat-api").MevzuatDocument[];
  ictihat: import("./yargitay-api").YargitayKarar[];
}> {
  const { includeMevzuat = true, includeIctihat = true, limit = 10 } = options || {};

  const [mevzuatResult, ictihatResult] = await Promise.allSettled([
    includeMevzuat
      ? import("./mevzuat-api").then((m) =>
          m.searchMevzuat({ query, sayfaBoyutu: limit })
        )
      : Promise.resolve({ sonuclar: [] }),
    includeIctihat
      ? import("./yargitay-api").then((y) =>
          y.searchIctihat({ query, sayfaBoyutu: limit })
        )
      : Promise.resolve({ sonuclar: [] }),
  ]);

  return {
    mevzuat:
      mevzuatResult.status === "fulfilled"
        ? mevzuatResult.value.sonuclar
        : [],
    ictihat:
      ictihatResult.status === "fulfilled"
        ? ictihatResult.value.sonuclar
        : [],
  };
}
