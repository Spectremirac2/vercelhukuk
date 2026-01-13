/**
 * Legal Cost Estimator Module
 *
 * Comprehensive cost estimation for Turkish legal proceedings:
 * - Court fees (Harçlar)
 * - Attorney fees (Avukatlık Ücretleri)
 * - Expert witness fees (Bilirkişi Ücretleri)
 * - Notification costs (Tebligat Masrafları)
 * - Execution costs (İcra Masrafları)
 *
 * Based on:
 * - 492 sayılı Harçlar Kanunu
 * - Avukatlık Asgari Ücret Tarifesi (AAÜT) 2025
 * - Bilirkişi Ücret Tarifesi
 * - İcra ve İflas Kanunu harç oranları
 */

export interface CostEstimate {
  id: string;
  caseType: CaseType;
  disputeValue: number;
  currency: "TRY";
  breakdown: CostBreakdown;
  scenarios: CostScenario[];
  timeline: PaymentTimeline;
  totalEstimate: {
    minimum: number;
    expected: number;
    maximum: number;
  };
  assumptions: string[];
  disclaimers: string[];
  calculatedAt: Date;
}

export interface CostBreakdown {
  courtFees: CourtFeeDetails;
  attorneyFees: AttorneyFeeDetails;
  expertFees: ExpertFeeDetails;
  notificationCosts: number;
  travelCosts: number;
  documentCosts: number;
  executionCosts?: ExecutionCostDetails;
  otherCosts: OtherCost[];
}

export interface CourtFeeDetails {
  basvuruHarci: number;
  kararHarci: number;
  temyizHarci?: number;
  istinafHarci?: number;
  kesifHarci?: number;
  bilirkisiHarci?: number;
  total: number;
  notes: string[];
}

export interface AttorneyFeeDetails {
  minimumFee: number;      // AAÜT minimum
  estimatedFee: number;    // Market rate estimate
  maximumFee: number;      // High-end estimate
  feeType: "sabit" | "deger_bazli" | "saatlik" | "karma";
  hourlyRate?: number;
  estimatedHours?: number;
  successFee?: {
    percentage: number;
    estimatedAmount: number;
  };
  vatIncluded: boolean;
  notes: string[];
}

export interface ExpertFeeDetails {
  required: boolean;
  expertTypes: ExpertType[];
  estimatedFee: number;
  numberOfExperts: number;
  notes: string[];
}

export interface ExpertType {
  type: string;
  baseFee: number;
  complexity: "basit" | "orta" | "karmasik";
}

export interface ExecutionCostDetails {
  icraHarci: number;
  tahsilHarci: number;
  cezaeviHarci?: number;
  hacizMasrafi?: number;
  satisHarci?: number;
  total: number;
}

export interface OtherCost {
  name: string;
  amount: number;
  mandatory: boolean;
  notes?: string;
}

export interface CostScenario {
  name: string;
  description: string;
  probability: "yuksek" | "orta" | "dusuk";
  additionalCosts: number;
  totalCost: number;
  duration: string;
}

export interface PaymentTimeline {
  stages: PaymentStage[];
  totalUpfront: number;
  totalDuringProceeding: number;
  totalAtConclusion: number;
}

export interface PaymentStage {
  stage: string;
  timing: string;
  costs: { name: string; amount: number }[];
  total: number;
}

export type CaseType =
  | "hukuk_davasi"          // Civil case
  | "is_davasi"             // Employment case
  | "ticaret_davasi"        // Commercial case
  | "aile_davasi"           // Family case
  | "tuketici_davasi"       // Consumer case
  | "idari_dava"            // Administrative case
  | "ceza_davasi"           // Criminal case
  | "icra_takibi"           // Execution proceeding
  | "iflas_davasi"          // Bankruptcy case
  | "fikri_mulkiyet"        // IP case
  | "vergi_davasi";         // Tax case

// 2025 Court Fee Rates (Harç Oranları)
const COURT_FEE_RATES_2025 = {
  // Başvuru Harçları (Maktu)
  basvuruHarclari: {
    hukukDavasi: 427.60,
    isDavasi: 427.60,
    ticaretDavasi: 427.60,
    aileDavasi: 427.60,
    tuketiciDavasi: 213.80,
    idariDava: 1_068.30,
    cezaDavasi: 0, // No fee
    icraTakibi: 427.60,
  },
  // Karar Harçları (Nispi - Value-based)
  kararHarci: {
    oran: 0.0683, // 68.3 per thousand (binde 68.3)
    minimumTutar: 427.60,
    maximumTutar: Infinity,
  },
  // Temyiz/İstinaf Harçları
  temyizHarci: {
    basvuru: 1_709.80,
    karar: 0.0683, // Same as decision fee rate
  },
  istinafHarci: {
    basvuru: 854.90,
    karar: 0.0683,
  },
  // İcra Harçları
  icraHarclari: {
    basvuru: 427.60,
    tahsilHarci: 0.044, // 44 per thousand (binde 44)
    odenmemeTahsilHarci: 0.088, // binde 88 for non-payment
  },
};

// 2025 Attorney Fee Schedule (AAÜT - Avukatlık Asgari Ücret Tarifesi)
const ATTORNEY_FEE_SCHEDULE_2025 = {
  // Minimum fees by case type
  hukukDavasi: {
    sulhHukuk: 17_900,
    asliyeHukuk: 29_000,
    islemDegeri: true,
  },
  isDavasi: {
    işeİade: 29_000,
    alacak: 17_900,
    islemDegeri: true,
  },
  ticaretDavasi: {
    asliyeTicaret: 35_800,
    islemDegeri: true,
  },
  aileDavasi: {
    bosanma: 35_800,
    nafaka: 17_900,
    velayet: 23_800,
  },
  tuketiciDavasi: {
    hakemHeyeti: 5_950,
    mahkeme: 17_900,
  },
  idariDava: {
    iptal: 29_000,
    tamYargi: 29_000,
  },
  cezaDavasi: {
    sulhCeza: 11_900,
    asliyeCeza: 23_800,
    agirCeza: 71_500,
  },
  icraTakibi: {
    takip: 5_950,
    itiraz: 11_900,
  },
  // Value-based rate (for cases over minimum)
  degerBazliOran: 0.15, // 15% of amount over threshold
  degerBazliEsik: 90_000, // Threshold amount
};

// Expert witness fee estimates
const EXPERT_FEE_ESTIMATES = {
  muhendis: {
    basit: 8_000,
    orta: 15_000,
    karmasik: 30_000,
  },
  mali_musavir: {
    basit: 6_000,
    orta: 12_000,
    karmasik: 25_000,
  },
  doktor: {
    basit: 5_000,
    orta: 10_000,
    karmasik: 20_000,
  },
  deger_tespit: {
    basit: 10_000,
    orta: 20_000,
    karmasik: 50_000,
  },
  yazi_inceleme: {
    basit: 4_000,
    orta: 8_000,
    karmasik: 15_000,
  },
  bilisim: {
    basit: 8_000,
    orta: 18_000,
    karmasik: 40_000,
  },
};

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Estimate total legal costs
 */
export function estimateLegalCosts(
  caseType: CaseType,
  disputeValue: number,
  options: CostEstimationOptions = {}
): CostEstimate {
  const {
    includeAppeals = false,
    includeExecution = false,
    expertRequired = false,
    expertTypes = [],
    complexity = "orta",
    jurisdiction = "istanbul",
    attorneyFeeType = "karma",
  } = options;

  // Calculate court fees
  const courtFees = calculateCourtFees(
    caseType,
    disputeValue,
    includeAppeals
  );

  // Calculate attorney fees
  const attorneyFees = calculateAttorneyFees(
    caseType,
    disputeValue,
    attorneyFeeType,
    complexity
  );

  // Calculate expert fees
  const expertFees = calculateExpertFees(expertRequired, expertTypes, complexity);

  // Calculate notification costs
  const notificationCosts = calculateNotificationCosts(caseType);

  // Calculate document costs
  const documentCosts = calculateDocumentCosts(caseType, complexity);

  // Calculate execution costs if needed
  const executionCosts = includeExecution
    ? calculateExecutionCosts(disputeValue)
    : undefined;

  // Calculate travel costs based on jurisdiction
  const travelCosts = calculateTravelCosts(jurisdiction, complexity);

  // Build breakdown
  const breakdown: CostBreakdown = {
    courtFees,
    attorneyFees,
    expertFees,
    notificationCosts,
    travelCosts,
    documentCosts,
    executionCosts,
    otherCosts: [],
  };

  // Calculate totals
  const baseTotal =
    courtFees.total +
    attorneyFees.estimatedFee +
    expertFees.estimatedFee +
    notificationCosts +
    travelCosts +
    documentCosts +
    (executionCosts?.total || 0);

  // Generate scenarios
  const scenarios = generateCostScenarios(
    baseTotal,
    caseType,
    complexity,
    includeAppeals
  );

  // Build payment timeline
  const timeline = buildPaymentTimeline(breakdown, includeAppeals);

  // Calculate min/max estimates
  const minimum = calculateMinimumCost(breakdown);
  const maximum = calculateMaximumCost(breakdown, includeAppeals);

  return {
    id: generateId("est"),
    caseType,
    disputeValue,
    currency: "TRY",
    breakdown,
    scenarios,
    timeline,
    totalEstimate: {
      minimum,
      expected: baseTotal,
      maximum,
    },
    assumptions: generateAssumptions(caseType, options),
    disclaimers: getDisclaimers(),
    calculatedAt: new Date(),
  };
}

export interface CostEstimationOptions {
  includeAppeals?: boolean;
  includeExecution?: boolean;
  expertRequired?: boolean;
  expertTypes?: string[];
  complexity?: "basit" | "orta" | "karmasik";
  jurisdiction?: string;
  attorneyFeeType?: "sabit" | "deger_bazli" | "saatlik" | "karma";
}

/**
 * Calculate court fees
 */
function calculateCourtFees(
  caseType: CaseType,
  disputeValue: number,
  includeAppeals: boolean
): CourtFeeDetails {
  const rates = COURT_FEE_RATES_2025;
  const notes: string[] = [];

  // Get application fee
  let basvuruHarci = 0;
  switch (caseType) {
    case "hukuk_davasi":
      basvuruHarci = rates.basvuruHarclari.hukukDavasi;
      break;
    case "is_davasi":
      basvuruHarci = rates.basvuruHarclari.isDavasi;
      break;
    case "ticaret_davasi":
      basvuruHarci = rates.basvuruHarclari.ticaretDavasi;
      break;
    case "aile_davasi":
      basvuruHarci = rates.basvuruHarclari.aileDavasi;
      break;
    case "tuketici_davasi":
      basvuruHarci = rates.basvuruHarclari.tuketiciDavasi;
      notes.push("Tüketici davalarında harç indirimi uygulanır");
      break;
    case "idari_dava":
      basvuruHarci = rates.basvuruHarclari.idariDava;
      break;
    case "ceza_davasi":
      basvuruHarci = 0;
      notes.push("Ceza davalarında başvuru harcı alınmaz");
      break;
    case "icra_takibi":
      basvuruHarci = rates.basvuruHarclari.icraTakibi;
      break;
    default:
      basvuruHarci = rates.basvuruHarclari.hukukDavasi;
  }

  // Calculate decision fee (value-based)
  let kararHarci = Math.max(
    disputeValue * rates.kararHarci.oran,
    rates.kararHarci.minimumTutar
  );

  // For non-monetary cases
  if (
    caseType === "aile_davasi" ||
    (caseType === "is_davasi" && disputeValue === 0)
  ) {
    kararHarci = rates.kararHarci.minimumTutar;
    notes.push("Konusu para olmayan davalarda maktu harç uygulanır");
  }

  // Appeal fees
  let temyizHarci: number | undefined;
  let istinafHarci: number | undefined;

  if (includeAppeals) {
    istinafHarci =
      rates.istinafHarci.basvuru +
      Math.max(disputeValue * rates.istinafHarci.karar, rates.kararHarci.minimumTutar);

    temyizHarci =
      rates.temyizHarci.basvuru +
      Math.max(disputeValue * rates.temyizHarci.karar, rates.kararHarci.minimumTutar);

    notes.push("İstinaf ve temyiz harçları dahil edilmiştir");
  }

  const total =
    basvuruHarci +
    kararHarci +
    (istinafHarci || 0) +
    (temyizHarci || 0);

  return {
    basvuruHarci,
    kararHarci,
    temyizHarci,
    istinafHarci,
    total,
    notes,
  };
}

/**
 * Calculate attorney fees
 */
function calculateAttorneyFees(
  caseType: CaseType,
  disputeValue: number,
  feeType: "sabit" | "deger_bazli" | "saatlik" | "karma",
  complexity: "basit" | "orta" | "karmasik"
): AttorneyFeeDetails {
  const schedule = ATTORNEY_FEE_SCHEDULE_2025;
  const notes: string[] = [];
  let minimumFee = 17_900; // Default minimum
  let estimatedFee: number;
  let maximumFee: number;
  let hourlyRate: number | undefined;
  let estimatedHours: number | undefined;

  // Get minimum fee based on case type
  switch (caseType) {
    case "hukuk_davasi":
      minimumFee = schedule.hukukDavasi.asliyeHukuk;
      break;
    case "is_davasi":
      minimumFee = schedule.isDavasi.işeİade;
      break;
    case "ticaret_davasi":
      minimumFee = schedule.ticaretDavasi.asliyeTicaret;
      break;
    case "aile_davasi":
      minimumFee = schedule.aileDavasi.bosanma;
      break;
    case "tuketici_davasi":
      minimumFee = schedule.tuketiciDavasi.mahkeme;
      break;
    case "idari_dava":
      minimumFee = schedule.idariDava.tamYargi;
      break;
    case "ceza_davasi":
      minimumFee = schedule.cezaDavasi.asliyeCeza;
      break;
    case "icra_takibi":
      minimumFee = schedule.icraTakibi.takip;
      break;
    default:
      minimumFee = schedule.hukukDavasi.asliyeHukuk;
  }

  // Calculate based on fee type
  switch (feeType) {
    case "sabit":
      estimatedFee = minimumFee * 2; // Market rate typically 2x minimum
      maximumFee = minimumFee * 4;
      notes.push("Sabit ücret anlaşması öngörülmüştür");
      break;

    case "deger_bazli":
      const valueBasedAmount =
        disputeValue > schedule.degerBazliEsik
          ? minimumFee +
            (disputeValue - schedule.degerBazliEsik) * schedule.degerBazliOran
          : minimumFee;
      estimatedFee = valueBasedAmount;
      maximumFee = valueBasedAmount * 1.5;
      notes.push("Dava değeri üzerinden ücret hesaplanmıştır");
      break;

    case "saatlik":
      hourlyRate = complexity === "karmasik" ? 3_500 : complexity === "orta" ? 2_500 : 1_800;
      estimatedHours = complexity === "karmasik" ? 80 : complexity === "orta" ? 50 : 30;
      estimatedFee = hourlyRate * estimatedHours;
      maximumFee = hourlyRate * estimatedHours * 1.5;
      notes.push(`Saatlik ücret: ${formatCurrency(hourlyRate)}, Tahmini saat: ${estimatedHours}`);
      break;

    case "karma":
    default:
      const baseFee = minimumFee * 1.5;
      const valuePortion =
        disputeValue > schedule.degerBazliEsik
          ? (disputeValue - schedule.degerBazliEsik) * 0.1
          : 0;
      estimatedFee = baseFee + valuePortion;
      maximumFee = estimatedFee * 1.5;
      notes.push("Karma ücret sistemi (sabit + değer bazlı) öngörülmüştür");
  }

  // Apply complexity multiplier
  const complexityMultiplier =
    complexity === "karmasik" ? 1.5 : complexity === "orta" ? 1.2 : 1;
  estimatedFee *= complexityMultiplier;
  maximumFee *= complexityMultiplier;

  return {
    minimumFee,
    estimatedFee: Math.round(estimatedFee),
    maximumFee: Math.round(maximumFee),
    feeType,
    hourlyRate,
    estimatedHours,
    vatIncluded: false,
    notes,
  };
}

/**
 * Calculate expert witness fees
 */
function calculateExpertFees(
  required: boolean,
  expertTypes: string[],
  complexity: "basit" | "orta" | "karmasik"
): ExpertFeeDetails {
  if (!required) {
    return {
      required: false,
      expertTypes: [],
      estimatedFee: 0,
      numberOfExperts: 0,
      notes: ["Bilirkişi raporu gerekli görülmemiştir"],
    };
  }

  const notes: string[] = [];
  let totalFee = 0;
  const types: ExpertType[] = [];

  // Default expert types if none specified
  const typesToUse = expertTypes.length > 0 ? expertTypes : ["mali_musavir"];

  for (const type of typesToUse) {
    const feeSchedule =
      EXPERT_FEE_ESTIMATES[type as keyof typeof EXPERT_FEE_ESTIMATES];
    if (feeSchedule) {
      const fee = feeSchedule[complexity];
      totalFee += fee;
      types.push({
        type: getExpertTypeName(type),
        baseFee: fee,
        complexity,
      });
    }
  }

  notes.push(`${types.length} bilirkişi raporu öngörülmüştür`);
  notes.push("Bilirkişi ücreti mahkemece belirlenir");

  return {
    required: true,
    expertTypes: types,
    estimatedFee: totalFee,
    numberOfExperts: types.length,
    notes,
  };
}

/**
 * Get expert type name in Turkish
 */
function getExpertTypeName(type: string): string {
  const names: Record<string, string> = {
    muhendis: "Mühendis",
    mali_musavir: "Mali Müşavir",
    doktor: "Doktor",
    deger_tespit: "Değer Tespit Uzmanı",
    yazi_inceleme: "Yazı İnceleme Uzmanı",
    bilisim: "Bilişim Uzmanı",
  };
  return names[type] || type;
}

/**
 * Calculate notification costs
 */
function calculateNotificationCosts(caseType: CaseType): number {
  // Average notification cost per party
  const baseNotificationCost = 150;
  const numberOfParties = 2;
  const estimatedNotifications = caseType === "icra_takibi" ? 5 : 4;

  return baseNotificationCost * estimatedNotifications * numberOfParties;
}

/**
 * Calculate document costs
 */
function calculateDocumentCosts(
  caseType: CaseType,
  complexity: "basit" | "orta" | "karmasik"
): number {
  const baseCost = 500;
  const complexityMultiplier =
    complexity === "karmasik" ? 3 : complexity === "orta" ? 2 : 1;

  return baseCost * complexityMultiplier;
}

/**
 * Calculate execution costs
 */
function calculateExecutionCosts(disputeValue: number): ExecutionCostDetails {
  const rates = COURT_FEE_RATES_2025.icraHarclari;

  const icraHarci = rates.basvuru;
  const tahsilHarci = disputeValue * rates.tahsilHarci;
  const hacizMasrafi = 2_000; // Estimated
  const satisHarci = disputeValue * 0.01; // 1% for sale

  return {
    icraHarci,
    tahsilHarci,
    hacizMasrafi,
    satisHarci,
    total: icraHarci + tahsilHarci + hacizMasrafi + satisHarci,
  };
}

/**
 * Calculate travel costs
 */
function calculateTravelCosts(
  jurisdiction: string,
  complexity: "basit" | "orta" | "karmasik"
): number {
  // Estimate based on number of hearings
  const estimatedHearings = complexity === "karmasik" ? 6 : complexity === "orta" ? 4 : 2;
  const costPerTrip = 300; // Average in major cities

  return estimatedHearings * costPerTrip;
}

/**
 * Generate cost scenarios
 */
function generateCostScenarios(
  baseCost: number,
  caseType: CaseType,
  complexity: "basit" | "orta" | "karmasik",
  includeAppeals: boolean
): CostScenario[] {
  const scenarios: CostScenario[] = [];

  // Best case scenario
  scenarios.push({
    name: "En İyi Senaryo",
    description: "Dava ilk aşamada sonuçlanır, uzlaşma sağlanır",
    probability: "dusuk",
    additionalCosts: 0,
    totalCost: baseCost * 0.6,
    duration: "3-6 ay",
  });

  // Expected scenario
  scenarios.push({
    name: "Beklenen Senaryo",
    description: "Dava normal sürecinde ilerler, karar verilir",
    probability: "yuksek",
    additionalCosts: 0,
    totalCost: baseCost,
    duration: complexity === "karmasik" ? "18-24 ay" : complexity === "orta" ? "12-18 ay" : "6-12 ay",
  });

  // Worst case scenario
  scenarios.push({
    name: "En Kötü Senaryo",
    description: "Dava uzar, itiraz ve temyiz süreçleri yaşanır",
    probability: "orta",
    additionalCosts: baseCost * 0.5,
    totalCost: baseCost * 1.5,
    duration: "2-4 yıl",
  });

  if (includeAppeals) {
    scenarios.push({
      name: "Temyiz Senaryosu",
      description: "Karar temyiz edilir ve yeniden yargılama yapılır",
      probability: "orta",
      additionalCosts: baseCost * 0.3,
      totalCost: baseCost * 1.3,
      duration: "3-5 yıl",
    });
  }

  return scenarios;
}

/**
 * Build payment timeline
 */
function buildPaymentTimeline(
  breakdown: CostBreakdown,
  includeAppeals: boolean
): PaymentTimeline {
  const stages: PaymentStage[] = [];

  // Stage 1: Filing
  stages.push({
    stage: "Dava Açılışı",
    timing: "Başlangıç",
    costs: [
      { name: "Başvuru Harcı", amount: breakdown.courtFees.basvuruHarci },
      { name: "Avukat Peşinat", amount: breakdown.attorneyFees.estimatedFee * 0.3 },
      { name: "Belge Masrafları", amount: breakdown.documentCosts },
    ],
    total:
      breakdown.courtFees.basvuruHarci +
      breakdown.attorneyFees.estimatedFee * 0.3 +
      breakdown.documentCosts,
  });

  // Stage 2: During proceedings
  stages.push({
    stage: "Yargılama Süreci",
    timing: "Süreç Boyunca",
    costs: [
      { name: "Bilirkişi Ücreti", amount: breakdown.expertFees.estimatedFee },
      { name: "Tebligat Masrafları", amount: breakdown.notificationCosts },
      { name: "Yol Masrafları", amount: breakdown.travelCosts },
      { name: "Avukat Ara Ödeme", amount: breakdown.attorneyFees.estimatedFee * 0.4 },
    ],
    total:
      breakdown.expertFees.estimatedFee +
      breakdown.notificationCosts +
      breakdown.travelCosts +
      breakdown.attorneyFees.estimatedFee * 0.4,
  });

  // Stage 3: Conclusion
  stages.push({
    stage: "Karar Aşaması",
    timing: "Sonuç",
    costs: [
      { name: "Karar Harcı", amount: breakdown.courtFees.kararHarci },
      { name: "Avukat Son Ödeme", amount: breakdown.attorneyFees.estimatedFee * 0.3 },
    ],
    total:
      breakdown.courtFees.kararHarci +
      breakdown.attorneyFees.estimatedFee * 0.3,
  });

  // Appeals if applicable
  if (includeAppeals) {
    stages.push({
      stage: "İstinaf/Temyiz",
      timing: "Kanun Yolları",
      costs: [
        { name: "İstinaf Harcı", amount: breakdown.courtFees.istinafHarci || 0 },
        { name: "Temyiz Harcı", amount: breakdown.courtFees.temyizHarci || 0 },
      ],
      total:
        (breakdown.courtFees.istinafHarci || 0) +
        (breakdown.courtFees.temyizHarci || 0),
    });
  }

  // Execution if applicable
  if (breakdown.executionCosts) {
    stages.push({
      stage: "İcra Takibi",
      timing: "Tahsilat",
      costs: [
        { name: "İcra Harcı", amount: breakdown.executionCosts.icraHarci },
        { name: "Tahsil Harcı", amount: breakdown.executionCosts.tahsilHarci },
        { name: "Haciz Masrafları", amount: breakdown.executionCosts.hacizMasrafi || 0 },
      ],
      total: breakdown.executionCosts.total,
    });
  }

  return {
    stages,
    totalUpfront: stages[0].total,
    totalDuringProceeding: stages[1].total,
    totalAtConclusion: stages.slice(2).reduce((sum, s) => sum + s.total, 0),
  };
}

/**
 * Calculate minimum possible cost
 */
function calculateMinimumCost(breakdown: CostBreakdown): number {
  return (
    breakdown.courtFees.basvuruHarci +
    breakdown.attorneyFees.minimumFee +
    breakdown.notificationCosts * 0.5 +
    breakdown.documentCosts * 0.5
  );
}

/**
 * Calculate maximum possible cost
 */
function calculateMaximumCost(
  breakdown: CostBreakdown,
  includeAppeals: boolean
): number {
  let max =
    breakdown.courtFees.total +
    breakdown.attorneyFees.maximumFee +
    breakdown.expertFees.estimatedFee * 1.5 +
    breakdown.notificationCosts * 2 +
    breakdown.travelCosts * 2 +
    breakdown.documentCosts * 2;

  if (breakdown.executionCosts) {
    max += breakdown.executionCosts.total * 1.2;
  }

  if (includeAppeals) {
    max *= 1.3;
  }

  return Math.round(max);
}

/**
 * Generate assumptions list
 */
function generateAssumptions(
  caseType: CaseType,
  options: CostEstimationOptions
): string[] {
  const assumptions: string[] = [
    "2025 yılı harç ve ücret tarifeleri esas alınmıştır",
    "Tahmini süreler ortalama dava süreleri üzerinden hesaplanmıştır",
    "Avukatlık ücretleri piyasa koşullarına göre tahmin edilmiştir",
  ];

  if (options.complexity === "karmasik") {
    assumptions.push("Karmaşık dava yapısı dikkate alınmıştır");
  }

  if (options.expertRequired) {
    assumptions.push("Bilirkişi raporu gerekli görülmüştür");
  }

  if (options.includeAppeals) {
    assumptions.push("Kanun yolu başvuruları hesaplamaya dahil edilmiştir");
  }

  if (options.includeExecution) {
    assumptions.push("İcra takibi masrafları dahil edilmiştir");
  }

  return assumptions;
}

/**
 * Get disclaimers
 */
function getDisclaimers(): string[] {
  return [
    "Bu tahmin bilgilendirme amaçlıdır ve kesin maliyet taahhüdü içermez.",
    "Gerçek maliyetler davaya özgü koşullara göre değişebilir.",
    "Güncel harç ve ücret tarifeleri için resmi kaynakları kontrol ediniz.",
    "Avukat ücretleri serbestçe belirlenir ve asgari ücret tarifesinin altında olamaz.",
  ];
}

/**
 * Format currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get case type name in Turkish
 */
export function getCaseTypeName(caseType: CaseType): string {
  const names: Record<CaseType, string> = {
    hukuk_davasi: "Hukuk Davası",
    is_davasi: "İş Davası",
    ticaret_davasi: "Ticaret Davası",
    aile_davasi: "Aile Davası",
    tuketici_davasi: "Tüketici Davası",
    idari_dava: "İdari Dava",
    ceza_davasi: "Ceza Davası",
    icra_takibi: "İcra Takibi",
    iflas_davasi: "İflas Davası",
    fikri_mulkiyet: "Fikri Mülkiyet Davası",
    vergi_davasi: "Vergi Davası",
  };
  return names[caseType];
}

/**
 * Format cost estimate as summary
 */
export function formatCostSummary(estimate: CostEstimate): string {
  const lines: string[] = [];

  lines.push(`## Dava Maliyet Tahmini`);
  lines.push(``);
  lines.push(`**Dava Türü:** ${getCaseTypeName(estimate.caseType)}`);
  lines.push(`**Dava Değeri:** ${formatCurrency(estimate.disputeValue)}`);
  lines.push(`**Hesaplama Tarihi:** ${estimate.calculatedAt.toLocaleDateString("tr-TR")}`);
  lines.push(``);

  lines.push(`### Toplam Tahmini Maliyet`);
  lines.push(`| Senaryo | Tutar |`);
  lines.push(`|---------|-------|`);
  lines.push(`| Minimum | ${formatCurrency(estimate.totalEstimate.minimum)} |`);
  lines.push(`| Beklenen | ${formatCurrency(estimate.totalEstimate.expected)} |`);
  lines.push(`| Maksimum | ${formatCurrency(estimate.totalEstimate.maximum)} |`);
  lines.push(``);

  lines.push(`### Maliyet Dağılımı`);
  lines.push(`- **Mahkeme Harçları:** ${formatCurrency(estimate.breakdown.courtFees.total)}`);
  lines.push(`- **Avukatlık Ücreti (Tahmini):** ${formatCurrency(estimate.breakdown.attorneyFees.estimatedFee)}`);
  if (estimate.breakdown.expertFees.required) {
    lines.push(`- **Bilirkişi Ücreti:** ${formatCurrency(estimate.breakdown.expertFees.estimatedFee)}`);
  }
  lines.push(`- **Tebligat Masrafları:** ${formatCurrency(estimate.breakdown.notificationCosts)}`);
  lines.push(`- **Diğer Masraflar:** ${formatCurrency(estimate.breakdown.travelCosts + estimate.breakdown.documentCosts)}`);
  if (estimate.breakdown.executionCosts) {
    lines.push(`- **İcra Masrafları:** ${formatCurrency(estimate.breakdown.executionCosts.total)}`);
  }
  lines.push(``);

  lines.push(`### Ödeme Planı`);
  lines.push(`- **Peşin Ödeme:** ${formatCurrency(estimate.timeline.totalUpfront)}`);
  lines.push(`- **Süreç Boyunca:** ${formatCurrency(estimate.timeline.totalDuringProceeding)}`);
  lines.push(`- **Sonuçta:** ${formatCurrency(estimate.timeline.totalAtConclusion)}`);
  lines.push(``);

  lines.push(`### Senaryolar`);
  for (const scenario of estimate.scenarios) {
    lines.push(`**${scenario.name}** (${scenario.probability === "yuksek" ? "Yüksek Olasılık" : scenario.probability === "orta" ? "Orta Olasılık" : "Düşük Olasılık"})`);
    lines.push(`- ${scenario.description}`);
    lines.push(`- Maliyet: ${formatCurrency(scenario.totalCost)}`);
    lines.push(`- Süre: ${scenario.duration}`);
    lines.push(``);
  }

  lines.push(`### Uyarılar`);
  for (const disclaimer of estimate.disclaimers) {
    lines.push(`- ${disclaimer}`);
  }

  return lines.join("\n");
}

/**
 * Compare costs between case types
 */
export function compareCaseTypeCosts(
  disputeValue: number,
  complexity: "basit" | "orta" | "karmasik" = "orta"
): Record<CaseType, { estimated: number; duration: string }> {
  const caseTypes: CaseType[] = [
    "hukuk_davasi",
    "is_davasi",
    "ticaret_davasi",
    "aile_davasi",
    "tuketici_davasi",
    "idari_dava",
  ];

  const results: Record<CaseType, { estimated: number; duration: string }> = {} as Record<CaseType, { estimated: number; duration: string }>;

  for (const caseType of caseTypes) {
    const estimate = estimateLegalCosts(caseType, disputeValue, { complexity });
    results[caseType] = {
      estimated: estimate.totalEstimate.expected,
      duration: estimate.scenarios[1]?.duration || "12-18 ay",
    };
  }

  return results;
}
