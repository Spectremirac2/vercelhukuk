/**
 * Court Fee Calculator
 *
 * Calculates court fees (harç) for Turkish courts based on:
 * - 492 sayılı Harçlar Kanunu
 * - Yıllık Harç Tarifeleri
 *
 * Note: Fee rates are updated annually. This module uses 2024-2025 rates
 * and should be updated each year when new tariffs are announced.
 */

export type CaseType =
  | "hukuk_genel" // Genel hukuk davaları
  | "ticaret" // Ticaret davaları
  | "is" // İş davaları
  | "aile" // Aile davaları
  | "icra" // İcra takipleri
  | "idare" // İdari davalar
  | "tüketici" // Tüketici davaları
  | "tapu" // Tapu işlemleri
  | "veraset"; // Veraset işlemleri

export type FeeType =
  | "basvuru" // Başvuru harcı
  | "karar_ilam" // Karar ve ilam harcı
  | "temyiz" // Temyiz/İstinaf harcı
  | "icra_takip" // İcra takip harcı
  | "haciz" // Haciz harcı
  | "satış" // Satış harcı
  | "tebligat" // Tebligat masrafı
  | "keşif" // Keşif masrafı
  | "bilirkişi" // Bilirkişi ücreti
  | "tanık"; // Tanık masrafı

export interface FeeCalculation {
  caseType: CaseType;
  claimAmount: number;
  fees: FeeItem[];
  totalFees: number;
  notes: string[];
  legalBasis: string;
}

export interface FeeItem {
  type: FeeType;
  name: string;
  amount: number;
  description?: string;
  isPercentage?: boolean;
  percentage?: number;
}

// 2024-2025 Fee Rates (Updated annually)
const FEE_RATES = {
  // Başvuru harçları (maktu)
  basvuru: {
    hukuk_genel: 427.60,
    ticaret: 427.60,
    is: 427.60, // İş mahkemesi başvuru harcı
    aile: 427.60,
    idare: 855.20,
    tüketici: 0, // Tüketici davaları harçtan muaf
    icra: 118.00,
    tapu: 427.60, // Tapu işlemleri
    veraset: 427.60, // Veraset işlemleri
  },

  // Karar ve ilam harcı oranları (nispi)
  karar_ilam: {
    oran_düşük: 0.0683, // %6.83 (ilk 45.000 TL için)
    oran_yüksek: 0.0455, // %4.55 (45.000 TL üstü için)
    sinir: 45000, // Oran değişim sınırı
    minimum: 150.00, // Minimum harç
    maksimum: null, // Maksimum sınır yok
  },

  // Temyiz/İstinaf harçları
  temyiz: {
    maktu: 855.20,
    nispi_oran: 0.00683, // Nispi kısım
  },

  // İcra harçları
  icra: {
    takip: 118.00, // Takip başlatma
    ödeme_emri: 59.00, // Ödeme emri
    haciz_oran: 0.004, // %0.4 haciz harcı
    satış_talep: 118.00, // Satış talep harcı
    tahsil_oran: 0.0228, // %2.28 tahsil harcı
  },

  // Masraflar
  masraflar: {
    tebligat: 100.00, // Ortalama tebligat masrafı
    posta: 50.00, // Posta masrafı
    dosya: 45.00, // Dosya masrafı
    keşif_ortalama: 3000.00, // Ortalama keşif masrafı
    bilirkişi_ortalama: 5000.00, // Ortalama bilirkişi ücreti
    tanık_günlük: 100.00, // Günlük tanık ücreti
  },
};

// Case type descriptions
const CASE_TYPE_NAMES: Record<CaseType, string> = {
  hukuk_genel: "Genel Hukuk Davası",
  ticaret: "Ticaret Davası",
  is: "İş Davası",
  aile: "Aile Davası",
  icra: "İcra Takibi",
  idare: "İdari Dava",
  tüketici: "Tüketici Davası",
  tapu: "Tapu İşlemi",
  veraset: "Veraset İşlemi",
};

/**
 * Calculate court fees for a case
 */
export function calculateFees(
  caseType: CaseType,
  claimAmount: number,
  options?: {
    includeTemyiz?: boolean;
    includeTebligat?: number;
    includeKeşif?: boolean;
    includeBilirkişi?: boolean;
    tanıkSayısı?: number;
  }
): FeeCalculation {
  const fees: FeeItem[] = [];
  const notes: string[] = [];

  // 1. Başvuru Harcı
  const basvuruHarci = FEE_RATES.basvuru[caseType] ?? FEE_RATES.basvuru.hukuk_genel;
  if (basvuruHarci > 0) {
    fees.push({
      type: "basvuru",
      name: "Başvuru Harcı",
      amount: basvuruHarci,
      description: "Dava açılırken ödenen maktu harç",
    });
  } else if (caseType === "tüketici") {
    notes.push("Tüketici davaları harçtan muaftır");
  }

  // 2. Karar ve İlam Harcı (Nispi)
  if (claimAmount > 0 && caseType !== "tüketici") {
    const kararHarci = calculateKararIlamHarci(claimAmount);
    fees.push({
      type: "karar_ilam",
      name: "Karar ve İlam Harcı",
      amount: kararHarci.amount,
      description: `Dava değeri üzerinden hesaplanan nispi harç`,
      isPercentage: true,
      percentage: kararHarci.effectiveRate * 100,
    });
    notes.push(`Dava değeri: ${formatCurrency(claimAmount)}`);
  }

  // 3. Peşin Harç (1/4 karar harcı)
  if (claimAmount > 0 && caseType !== "tüketici") {
    const kararHarci = calculateKararIlamHarci(claimAmount);
    const pesinHarc = kararHarci.amount / 4;
    fees.push({
      type: "karar_ilam",
      name: "Peşin Harç (Dava açılışında)",
      amount: pesinHarc,
      description: "Karar harcının 1/4'ü dava açılışında peşin alınır",
    });
  }

  // 4. Temyiz/İstinaf Harcı (opsiyonel)
  if (options?.includeTemyiz) {
    const temyizHarci = FEE_RATES.temyiz.maktu +
      (claimAmount * FEE_RATES.temyiz.nispi_oran);
    fees.push({
      type: "temyiz",
      name: "İstinaf/Temyiz Harcı",
      amount: temyizHarci,
      description: "Üst mahkemeye başvuru harcı",
    });
  }

  // 5. Tebligat Masrafı
  const tebligatSayisi = options?.includeTebligat || 2;
  const tebligatMasrafi = tebligatSayisi * FEE_RATES.masraflar.tebligat;
  fees.push({
    type: "tebligat",
    name: `Tebligat Masrafı (${tebligatSayisi} adet)`,
    amount: tebligatMasrafi,
    description: "Taraflara yapılacak tebligat masrafları",
  });

  // 6. Keşif Masrafı (opsiyonel)
  if (options?.includeKeşif) {
    fees.push({
      type: "keşif",
      name: "Keşif Masrafı (Tahmini)",
      amount: FEE_RATES.masraflar.keşif_ortalama,
      description: "Mahallinde keşif yapılması halinde",
    });
    notes.push("Keşif masrafı bölgeye göre değişebilir");
  }

  // 7. Bilirkişi Ücreti (opsiyonel)
  if (options?.includeBilirkişi) {
    fees.push({
      type: "bilirkişi",
      name: "Bilirkişi Ücreti (Tahmini)",
      amount: FEE_RATES.masraflar.bilirkişi_ortalama,
      description: "Bilirkişi incelemesi yapılması halinde",
    });
    notes.push("Bilirkişi ücreti uzmanlık alanına göre değişebilir");
  }

  // 8. Tanık Masrafı (opsiyonel)
  if (options?.tanıkSayısı && options.tanıkSayısı > 0) {
    const tanıkMasrafi = options.tanıkSayısı * FEE_RATES.masraflar.tanık_günlük;
    fees.push({
      type: "tanık",
      name: `Tanık Masrafı (${options.tanıkSayısı} tanık)`,
      amount: tanıkMasrafi,
      description: "Tanıklara ödenecek tazminat",
    });
  }

  // Calculate total
  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);

  return {
    caseType,
    claimAmount,
    fees,
    totalFees,
    notes,
    legalBasis: "492 sayılı Harçlar Kanunu",
  };
}

/**
 * Calculate karar ve ilam harcı (court judgment fee)
 */
function calculateKararIlamHarci(amount: number): { amount: number; effectiveRate: number } {
  const rates = FEE_RATES.karar_ilam;

  if (amount <= rates.sinir) {
    // İlk dilim oranı
    const harç = amount * rates.oran_düşük;
    return {
      amount: Math.max(harç, rates.minimum),
      effectiveRate: rates.oran_düşük,
    };
  }

  // İkinci dilim
  const ilkDilim = rates.sinir * rates.oran_düşük;
  const ikinciDilim = (amount - rates.sinir) * rates.oran_yüksek;
  const toplam = ilkDilim + ikinciDilim;

  return {
    amount: Math.max(toplam, rates.minimum),
    effectiveRate: toplam / amount,
  };
}

/**
 * Calculate icra (enforcement) fees
 */
export function calculateIcraFees(
  claimAmount: number,
  options?: {
    includeHaciz?: boolean;
    includeSatış?: boolean;
    tahsilEdilecek?: number;
  }
): FeeCalculation {
  const fees: FeeItem[] = [];
  const notes: string[] = [];

  // 1. Takip Başlatma Harcı
  fees.push({
    type: "icra_takip",
    name: "Takip Harcı",
    amount: FEE_RATES.icra.takip,
    description: "İcra takibi başlatma harcı",
  });

  // 2. Ödeme/İcra Emri Harcı
  fees.push({
    type: "icra_takip",
    name: "Ödeme Emri Harcı",
    amount: FEE_RATES.icra.ödeme_emri,
    description: "Borçluya gönderilecek ödeme emri",
  });

  // 3. Tebligat
  fees.push({
    type: "tebligat",
    name: "Tebligat Masrafı",
    amount: FEE_RATES.masraflar.tebligat * 2,
    description: "Ödeme emri tebligatı",
  });

  // 4. Haciz Harcı (opsiyonel)
  if (options?.includeHaciz) {
    const hacizHarci = claimAmount * FEE_RATES.icra.haciz_oran;
    fees.push({
      type: "haciz",
      name: "Haciz Harcı",
      amount: hacizHarci,
      description: `Alacak tutarının %${FEE_RATES.icra.haciz_oran * 100}'i`,
      isPercentage: true,
      percentage: FEE_RATES.icra.haciz_oran * 100,
    });
  }

  // 5. Satış Talebi (opsiyonel)
  if (options?.includeSatış) {
    fees.push({
      type: "satış",
      name: "Satış Talep Harcı",
      amount: FEE_RATES.icra.satış_talep,
      description: "Hacizli malların satışı talebi",
    });
  }

  // 6. Tahsil Harcı
  const tahsilTutar = options?.tahsilEdilecek || claimAmount;
  const tahsilHarci = tahsilTutar * FEE_RATES.icra.tahsil_oran;
  fees.push({
    type: "icra_takip",
    name: "Tahsil Harcı",
    amount: tahsilHarci,
    description: `Tahsil edilecek tutarın %${FEE_RATES.icra.tahsil_oran * 100}'i`,
    isPercentage: true,
    percentage: FEE_RATES.icra.tahsil_oran * 100,
  });
  notes.push("Tahsil harcı, tahsilat yapıldığında alınır");

  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);

  return {
    caseType: "icra",
    claimAmount,
    fees,
    totalFees,
    notes,
    legalBasis: "492 sayılı Harçlar Kanunu, İcra ve İflas Kanunu",
  };
}

/**
 * Get fee summary for different case types
 */
export function getFeeSummary(claimAmount: number): Array<{
  caseType: CaseType;
  name: string;
  estimatedFees: number;
  isExempt: boolean;
}> {
  const caseTypes: CaseType[] = ["hukuk_genel", "ticaret", "is", "aile", "idare", "tüketici"];

  return caseTypes.map(caseType => {
    const calculation = calculateFees(caseType, claimAmount);
    return {
      caseType,
      name: CASE_TYPE_NAMES[caseType],
      estimatedFees: calculation.totalFees,
      isExempt: caseType === "tüketici",
    };
  });
}

/**
 * Get case type name
 */
export function getCaseTypeName(caseType: CaseType): string {
  return CASE_TYPE_NAMES[caseType] || caseType;
}

/**
 * Get all case types
 */
export function getCaseTypes(): Array<{ id: CaseType; name: string }> {
  return Object.entries(CASE_TYPE_NAMES).map(([id, name]) => ({
    id: id as CaseType,
    name,
  }));
}

/**
 * Check if case type is exempt from fees
 */
export function isExemptFromFees(caseType: CaseType): boolean {
  return caseType === "tüketici";
}

/**
 * Format currency in Turkish Lira
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get fee exemptions information
 */
export function getFeeExemptions(): Array<{
  description: string;
  legalBasis: string;
}> {
  return [
    {
      description: "Tüketici mahkemelerinde açılan davalar harçtan muaftır",
      legalBasis: "6502 sayılı TKHK m.73/2",
    },
    {
      description: "Adli yardım kararı alınması halinde harçlar ertelenir",
      legalBasis: "HMK m.334-340",
    },
    {
      description: "İş mahkemelerinde işçi aleyhine hüküm halinde harç alınmaz",
      legalBasis: "7036 sayılı İş Mahkemeleri Kanunu m.11",
    },
    {
      description: "Arabuluculuk görüşmeleri harçtan muaftır",
      legalBasis: "6325 sayılı Arabuluculuk Kanunu m.18/A",
    },
    {
      description: "Şehit ve gazi yakınları harçtan muaftır",
      legalBasis: "Harçlar Kanunu m.13",
    },
  ];
}

/**
 * Calculate total cost estimate for a lawsuit
 */
export function calculateTotalCostEstimate(
  caseType: CaseType,
  claimAmount: number,
  options?: {
    avukatUcreti?: number;
    tahminiSure?: number; // ay
    istinafOlasiligi?: boolean;
    temyizOlasiligi?: boolean;
  }
): {
  harclar: number;
  masraflar: number;
  avukatUcreti: number;
  toplam: number;
  sure: string;
  notes: string[];
} {
  const feeCalc = calculateFees(caseType, claimAmount, {
    includeTemyiz: options?.istinafOlasiligi || options?.temyizOlasiligi,
    includeTebligat: 4,
    includeKeşif: caseType === "aile" || caseType === "hukuk_genel",
    includeBilirkişi: caseType === "is" || caseType === "ticaret",
  });

  const avukatUcreti = options?.avukatUcreti ||
    Math.max(claimAmount * 0.1, 15000); // Minimum veya %10

  const notes: string[] = [
    ...feeCalc.notes,
    "Avukat ücreti tahminidir, anlaşmaya göre değişir",
    "Karşı vekalet ücreti dava sonucuna göre belirlenebilir",
  ];

  let sure = `${options?.tahminiSure || 12}-${(options?.tahminiSure || 12) + 6} ay`;
  if (options?.istinafOlasiligi) {
    sure = `${options?.tahminiSure || 18}-${(options?.tahminiSure || 18) + 12} ay`;
    notes.push("İstinaf süreci ek 6-12 ay sürebilir");
  }
  if (options?.temyizOlasiligi) {
    sure = `${options?.tahminiSure || 24}-${(options?.tahminiSure || 24) + 18} ay`;
    notes.push("Temyiz süreci ek 12-18 ay sürebilir");
  }

  return {
    harclar: feeCalc.fees.filter(f =>
      ["basvuru", "karar_ilam", "temyiz"].includes(f.type)
    ).reduce((sum, f) => sum + f.amount, 0),
    masraflar: feeCalc.fees.filter(f =>
      ["tebligat", "keşif", "bilirkişi", "tanık"].includes(f.type)
    ).reduce((sum, f) => sum + f.amount, 0),
    avukatUcreti,
    toplam: feeCalc.totalFees + avukatUcreti,
    sure,
    notes,
  };
}
