/**
 * Mediation and Arbitration Support Module
 *
 * Comprehensive support for Alternative Dispute Resolution (ADR) in Turkish law:
 * - Mediation (Arabuluculuk) - Law No. 6325
 * - Arbitration (Tahkim) - Law No. 4686 (International) and HMK (Domestic)
 * - Mandatory mediation areas (İş, Ticari, Tüketici)
 * - ISTAC (Istanbul Arbitration Centre) procedures
 *
 * Based on:
 * - 6325 sayılı Hukuk Uyuşmazlıklarında Arabuluculuk Kanunu
 * - 4686 sayılı Milletlerarası Tahkim Kanunu
 * - 6100 sayılı HMK Tahkim hükümleri
 * - Arabuluculuk Daire Başkanlığı düzenlemeleri
 */

export interface MediationCase {
  id: string;
  type: MediationType;
  category: DisputeCategory;
  parties: MediationParty[];
  mediator?: MediatorInfo;
  status: MediationStatus;
  timeline: MediationEvent[];
  documents: MediationDocument[];
  settlement?: SettlementAgreement;
  fees: MediationFees;
  statistics: CaseStatistics;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArbitrationCase {
  id: string;
  type: ArbitrationType;
  institution?: ArbitrationInstitution;
  parties: ArbitrationParty[];
  tribunal: ArbitralTribunal;
  status: ArbitrationStatus;
  timeline: ArbitrationEvent[];
  pleadings: ArbitrationPleading[];
  hearings: ArbitrationHearing[];
  award?: ArbitralAward;
  fees: ArbitrationFees;
  createdAt: Date;
  updatedAt: Date;
}

export type MediationType =
  | "zorunlu_is"           // Mandatory - Employment
  | "zorunlu_ticari"       // Mandatory - Commercial
  | "zorunlu_tuketici"     // Mandatory - Consumer
  | "ihtiyari"             // Voluntary
  | "mahkeme_yonlendirmeli"; // Court-referred

export type ArbitrationType =
  | "ic_tahkim"            // Domestic arbitration
  | "milletlerarasi"       // International arbitration
  | "yatirim_tahkimi"      // Investment arbitration
  | "spor_tahkimi";        // Sports arbitration

export type DisputeCategory =
  | "is_hukuku"
  | "ticari"
  | "tuketici"
  | "aile"
  | "kira"
  | "insaat"
  | "sigorta"
  | "bankacilik"
  | "fikri_mulkiyet"
  | "saglik"
  | "diger";

export type MediationStatus =
  | "basvuru_yapildi"
  | "arabulucu_atandi"
  | "gorusmeler_devam"
  | "anlasma_saglandi"
  | "anlasma_saglanamadi"
  | "vazgecildi"
  | "suresi_doldu";

export type ArbitrationStatus =
  | "basvuru"
  | "hakem_heyeti_olusumu"
  | "dilekce_teatisi"
  | "delil_sunumu"
  | "durusma"
  | "karar_asamasi"
  | "karar_verildi"
  | "tenfiz";

export interface MediationParty {
  id: string;
  name: string;
  type: "gercek_kisi" | "tuzel_kisi";
  role: "basvuran" | "karsi_taraf";
  representative?: string;
  contact: ContactInfo;
  tcKimlik?: string;
  vergiNo?: string;
}

export interface ArbitrationParty {
  id: string;
  name: string;
  type: "gercek_kisi" | "tuzel_kisi";
  role: "davaci" | "davali";
  nationality: string;
  address: string;
  representatives: LegalRepresentative[];
}

export interface LegalRepresentative {
  name: string;
  barAssociation: string;
  email: string;
  phone: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface MediatorInfo {
  id: string;
  name: string;
  sicilNo: string;
  specializations: DisputeCategory[];
  experience: number; // years
  successRate: number;
  contact: ContactInfo;
  availability: boolean;
}

export interface ArbitralTribunal {
  arbitrators: Arbitrator[];
  chairperson?: string;
  secretary?: string;
  seatOfArbitration: string;
  language: string[];
  applicableLaw: string;
  proceduralRules: string;
}

export interface Arbitrator {
  id: string;
  name: string;
  nationality: string;
  appointedBy: "davaci" | "davali" | "kurum" | "mahkeme";
  specialization: string[];
  experience: number;
}

export interface MediationEvent {
  id: string;
  date: Date;
  type: "basvuru" | "atama" | "gorusme" | "sonuc" | "belge";
  description: string;
  participants?: string[];
  outcome?: string;
}

export interface ArbitrationEvent {
  id: string;
  date: Date;
  type: "basvuru" | "cevap" | "durusma" | "karar" | "tenfiz";
  description: string;
  deadline?: Date;
}

export interface MediationDocument {
  id: string;
  type: "basvuru_formu" | "vekaletname" | "belge" | "tutanak" | "anlasma";
  name: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface ArbitrationPleading {
  id: string;
  type: "dava_dilekce" | "cevap" | "replik" | "duplik" | "beyan";
  filedBy: string;
  filedAt: Date;
  summary: string;
}

export interface ArbitrationHearing {
  id: string;
  date: Date;
  type: "on_toplanti" | "durusma" | "delil_inceleme" | "uzman_dinleme";
  duration: number; // minutes
  participants: string[];
  summary?: string;
}

export interface SettlementAgreement {
  id: string;
  date: Date;
  terms: SettlementTerm[];
  totalValue?: number;
  currency?: string;
  enforceable: boolean;
  ilamNiteliginde: boolean;
  signatories: string[];
}

export interface SettlementTerm {
  id: string;
  description: string;
  obligor: string;
  deadline?: Date;
  amount?: number;
  status: "beklemede" | "yerine_getirildi" | "ihlal";
}

export interface ArbitralAward {
  id: string;
  date: Date;
  type: "nihai" | "kismi" | "ek" | "yorum";
  dispositif: string;
  reasoning: string;
  damages?: {
    principal: number;
    interest: number;
    costs: number;
    currency: string;
  };
  dissentingOpinion?: string;
}

export interface MediationFees {
  basvuruHarci: number;
  arabulucuUcreti: number;
  tarafBasiMaliyet: number;
  toplam: number;
  currency: "TRY";
}

export interface ArbitrationFees {
  kayitUcreti: number;
  idariUcret: number;
  hakemUcreti: number;
  diger: number;
  toplam: number;
  currency: "TRY" | "USD" | "EUR";
}

export interface CaseStatistics {
  gorusmeSayisi: number;
  toplamSure: number; // days
  belgeSayisi: number;
  anlasmaSaglama?: boolean;
}

export type ArbitrationInstitution =
  | "ISTAC"      // Istanbul Arbitration Centre
  | "ICC"        // International Chamber of Commerce
  | "ICSID"      // Investment disputes
  | "LCIA"       // London Court
  | "SIAC"       // Singapore
  | "HKIAC"      // Hong Kong
  | "ad_hoc";    // Ad hoc arbitration

// Mandatory mediation requirements
const MANDATORY_MEDIATION_AREAS: Record<
  string,
  {
    law: string;
    effectiveDate: Date;
    description: string;
    exceptions: string[];
  }
> = {
  is_hukuku: {
    law: "7036 sayılı İş Mahkemeleri Kanunu m.3",
    effectiveDate: new Date("2018-01-01"),
    description: "İşçi-işveren uyuşmazlıkları (işe iade, kıdem/ihbar tazminatı, fazla mesai vb.)",
    exceptions: [
      "İş kazası ve meslek hastalığından kaynaklanan tazminat davaları",
      "İşe iade davalarında işverenin işçiyi işe başlatmaması halinde ödenmesi gereken tazminat",
    ],
  },
  ticari: {
    law: "6102 sayılı TTK m.5/A",
    effectiveDate: new Date("2019-01-01"),
    description: "Ticari davalar (konusu para olan alacak ve tazminat talepleri)",
    exceptions: [
      "Menfi tespit davaları",
      "İstirdat davaları",
      "İflas, konkordato ve tasfiye işlemleri",
    ],
  },
  tuketici: {
    law: "6502 sayılı TKHK m.73/A",
    effectiveDate: new Date("2020-07-28"),
    description: "Tüketici uyuşmazlıkları (parasal sınır üzeri)",
    exceptions: [
      "Tüketici hakem heyetinin görev alanına giren uyuşmazlıklar",
      "Tüketici örgütlerinin açtığı davalar",
    ],
  },
  kira: {
    law: "7445 sayılı Kanun (HMK m.188)",
    effectiveDate: new Date("2023-09-01"),
    description: "Kira ilişkisinden kaynaklanan uyuşmazlıklar",
    exceptions: [
      "İlamsız icra takibi sonrası itirazın iptali",
      "Tahliye davaları",
    ],
  },
};

// Mediation time limits
const MEDIATION_TIME_LIMITS: Record<MediationType, {
  gorusmeBaslama: number | null;
  azamiSure: number | null;
  uzatma: number | null;
}> = {
  zorunlu_is: {
    gorusmeBaslama: 3, // weeks from application
    azamiSure: 3, // weeks total
    uzatma: 1, // additional week if agreed
  },
  zorunlu_ticari: {
    gorusmeBaslama: 3,
    azamiSure: 6, // weeks total
    uzatma: 2,
  },
  zorunlu_tuketici: {
    gorusmeBaslama: 3,
    azamiSure: 4,
    uzatma: 2,
  },
  ihtiyari: {
    gorusmeBaslama: null, // no limit
    azamiSure: null,
    uzatma: null,
  },
  mahkeme_yonlendirmeli: {
    gorusmeBaslama: 2, // court sets deadline
    azamiSure: 4, // typically 4 weeks
    uzatma: 2,
  },
};

// 2024-2025 Mediation fee schedule (Arabuluculuk Asgari Ücret Tarifesi)
const MEDIATION_FEE_SCHEDULE_2025 = {
  // Based on dispute value
  valueBasedFees: [
    { maxValue: 30_000, fee: 1_100, perSide: true },
    { maxValue: 60_000, fee: 1_650, perSide: true },
    { maxValue: 120_000, fee: 2_200, perSide: true },
    { maxValue: 240_000, fee: 3_300, perSide: true },
    { maxValue: 480_000, fee: 4_950, perSide: true },
    { maxValue: 960_000, fee: 7_150, perSide: true },
    { maxValue: Infinity, feePercentage: 0.01, minFee: 7_150, perSide: true },
  ],
  // Fixed fees for non-monetary disputes
  fixedFees: {
    isIade: 2_750, // per party
    diger: 1_650, // per party
  },
  // Hourly rate for extended mediations
  hourlyRate: 1_100,
  // Application fee
  basvuruHarci: 85,
};

// ISTAC fee schedule (simplified)
const ISTAC_FEE_SCHEDULE = {
  registrationFee: {
    upTo50K: 500,
    upTo100K: 750,
    upTo500K: 1_000,
    upTo1M: 1_500,
    above1M: 2_000,
  },
  administrativeFee: {
    upTo50K: 2_500,
    upTo100K: 4_000,
    upTo500K: 7_500,
    upTo1M: 12_500,
    above1M: 0.015, // 1.5% of amount
  },
  arbitratorFee: {
    upTo50K: 5_000,
    upTo100K: 8_000,
    upTo500K: 15_000,
    upTo1M: 25_000,
    above1M: 0.02, // 2% of amount
  },
  currency: "USD" as const,
};

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if mediation is mandatory for a dispute
 */
export function isMediationMandatory(
  category: DisputeCategory,
  disputeValue?: number
): {
  mandatory: boolean;
  law?: string;
  description?: string;
  exceptions?: string[];
} {
  const mandatoryArea = MANDATORY_MEDIATION_AREAS[category];

  if (!mandatoryArea) {
    return { mandatory: false };
  }

  // Check for consumer disputes with value threshold
  if (category === "tuketici" && disputeValue) {
    const threshold2025 = 104_000; // TL - 2025 threshold
    if (disputeValue <= threshold2025) {
      return {
        mandatory: false,
        description: "Tüketici hakem heyetinin görev alanında",
      };
    }
  }

  return {
    mandatory: true,
    law: mandatoryArea.law,
    description: mandatoryArea.description,
    exceptions: mandatoryArea.exceptions,
  };
}

/**
 * Calculate mediation fees
 */
export function calculateMediationFees(
  disputeValue: number,
  category: DisputeCategory,
  partyCount: number = 2
): MediationFees {
  const schedule = MEDIATION_FEE_SCHEDULE_2025;
  let arabulucuUcreti = 0;

  // Find applicable fee tier
  for (const tier of schedule.valueBasedFees) {
    if (disputeValue <= tier.maxValue) {
      if (tier.fee) {
        arabulucuUcreti = tier.fee;
      } else if (tier.feePercentage) {
        arabulucuUcreti = Math.max(
          disputeValue * tier.feePercentage,
          tier.minFee || 0
        );
      }
      break;
    }
  }

  // For employment reinstatement cases
  if (category === "is_hukuku" && disputeValue === 0) {
    arabulucuUcreti = schedule.fixedFees.isIade;
  }

  const tarafBasiMaliyet = arabulucuUcreti;
  const toplam = schedule.basvuruHarci + arabulucuUcreti * partyCount;

  return {
    basvuruHarci: schedule.basvuruHarci,
    arabulucuUcreti,
    tarafBasiMaliyet,
    toplam,
    currency: "TRY",
  };
}

/**
 * Calculate arbitration fees
 */
export function calculateArbitrationFees(
  disputeValue: number,
  institution: ArbitrationInstitution,
  arbitratorCount: number = 1
): ArbitrationFees {
  if (institution === "ISTAC") {
    const schedule = ISTAC_FEE_SCHEDULE;
    let kayitUcreti = 0;
    let idariUcret = 0;
    let hakemUcreti = 0;

    // Registration fee
    if (disputeValue <= 50_000) {
      kayitUcreti = schedule.registrationFee.upTo50K;
      idariUcret = schedule.administrativeFee.upTo50K;
      hakemUcreti = schedule.arbitratorFee.upTo50K;
    } else if (disputeValue <= 100_000) {
      kayitUcreti = schedule.registrationFee.upTo100K;
      idariUcret = schedule.administrativeFee.upTo100K;
      hakemUcreti = schedule.arbitratorFee.upTo100K;
    } else if (disputeValue <= 500_000) {
      kayitUcreti = schedule.registrationFee.upTo500K;
      idariUcret = schedule.administrativeFee.upTo500K;
      hakemUcreti = schedule.arbitratorFee.upTo500K;
    } else if (disputeValue <= 1_000_000) {
      kayitUcreti = schedule.registrationFee.upTo1M;
      idariUcret = schedule.administrativeFee.upTo1M;
      hakemUcreti = schedule.arbitratorFee.upTo1M;
    } else {
      kayitUcreti = schedule.registrationFee.above1M;
      idariUcret = disputeValue * (schedule.administrativeFee.above1M as number);
      hakemUcreti = disputeValue * (schedule.arbitratorFee.above1M as number);
    }

    hakemUcreti *= arbitratorCount;

    return {
      kayitUcreti,
      idariUcret,
      hakemUcreti,
      diger: 0,
      toplam: kayitUcreti + idariUcret + hakemUcreti,
      currency: "USD",
    };
  }

  // Default ad hoc fees
  return {
    kayitUcreti: 0,
    idariUcret: 0,
    hakemUcreti: disputeValue * 0.03 * arbitratorCount, // 3% estimate
    diger: 5000, // Estimated venue, transcript costs
    toplam: disputeValue * 0.03 * arbitratorCount + 5000,
    currency: "TRY",
  };
}

/**
 * Create a new mediation case
 */
export function createMediationCase(
  type: MediationType,
  category: DisputeCategory,
  parties: Omit<MediationParty, "id">[],
  disputeValue?: number
): MediationCase {
  const fees = calculateMediationFees(
    disputeValue || 0,
    category,
    parties.length
  );

  return {
    id: generateId("med"),
    type,
    category,
    parties: parties.map((p) => ({ ...p, id: generateId("party") })),
    status: "basvuru_yapildi",
    timeline: [
      {
        id: generateId("event"),
        date: new Date(),
        type: "basvuru",
        description: "Arabuluculuk başvurusu yapıldı",
      },
    ],
    documents: [],
    fees,
    statistics: {
      gorusmeSayisi: 0,
      toplamSure: 0,
      belgeSayisi: 0,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Create a new arbitration case
 */
export function createArbitrationCase(
  type: ArbitrationType,
  institution: ArbitrationInstitution | undefined,
  parties: Omit<ArbitrationParty, "id">[],
  disputeValue: number,
  seatOfArbitration: string,
  language: string[],
  arbitratorCount: number = 1
): ArbitrationCase {
  const fees = calculateArbitrationFees(
    disputeValue,
    institution || "ad_hoc",
    arbitratorCount
  );

  return {
    id: generateId("arb"),
    type,
    institution,
    parties: parties.map((p) => ({ ...p, id: generateId("party") })),
    tribunal: {
      arbitrators: [],
      seatOfArbitration,
      language,
      applicableLaw: "Türk Hukuku",
      proceduralRules: institution ? `${institution} Tahkim Kuralları` : "HMK",
    },
    status: "basvuru",
    timeline: [
      {
        id: generateId("event"),
        date: new Date(),
        type: "basvuru",
        description: "Tahkim başvurusu yapıldı",
      },
    ],
    pleadings: [],
    hearings: [],
    fees,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Get mediation time limits
 */
export function getMediationTimeLimits(type: MediationType): {
  gorusmeBaslama: number | null;
  azamiSure: number | null;
  uzatma: number | null;
  description: string;
} {
  const limits = MEDIATION_TIME_LIMITS[type];
  const descriptions: Record<MediationType, string> = {
    zorunlu_is:
      "İş uyuşmazlıklarında arabuluculuk süreci 3 hafta (uzatma ile 4 hafta)",
    zorunlu_ticari:
      "Ticari uyuşmazlıklarda arabuluculuk süreci 6 hafta (uzatma ile 8 hafta)",
    zorunlu_tuketici:
      "Tüketici uyuşmazlıklarında arabuluculuk süreci 4 hafta (uzatma ile 6 hafta)",
    ihtiyari: "İhtiyari arabuluculukta süre sınırı bulunmamaktadır",
    mahkeme_yonlendirmeli:
      "Mahkeme tarafından belirlenen süre içinde tamamlanmalıdır",
  };

  return {
    ...limits,
    description: descriptions[type],
  };
}

/**
 * Recommend dispute resolution method
 */
export function recommendDisputeResolution(
  category: DisputeCategory,
  disputeValue: number,
  urgency: "dusuk" | "orta" | "yuksek",
  complexity: "basit" | "orta" | "karmasik",
  internationalParty: boolean
): {
  recommended: "arabuluculuk" | "tahkim" | "dava";
  reasons: string[];
  alternatives: string[];
  estimatedDuration: string;
  estimatedCost: string;
} {
  const mandatory = isMediationMandatory(category, disputeValue);
  const reasons: string[] = [];
  const alternatives: string[] = [];

  // If mediation is mandatory, always recommend starting there
  if (mandatory.mandatory) {
    reasons.push(`${mandatory.law} gereği zorunlu arabuluculuk şartı`);
    reasons.push("Dava açmadan önce arabuluculuğa başvuru zorunlu");

    return {
      recommended: "arabuluculuk",
      reasons,
      alternatives: ["Anlaşma sağlanamazsa dava yolu açılır"],
      estimatedDuration: "3-8 hafta",
      estimatedCost: formatCurrency(
        calculateMediationFees(disputeValue, category).toplam
      ),
    };
  }

  // For international parties, recommend arbitration
  if (internationalParty) {
    reasons.push("Yabancı taraf bulunması nedeniyle tahkim avantajlı");
    reasons.push("Yabancı mahkeme kararlarının tenfizi zorluğu");
    reasons.push("New York Sözleşmesi kapsamında hakem kararı tenfizi kolaylığı");

    return {
      recommended: "tahkim",
      reasons,
      alternatives: ["İhtiyari arabuluculuk", "Türk mahkemelerinde dava"],
      estimatedDuration: "6-18 ay",
      estimatedCost: "Uyuşmazlık değerinin %3-5'i",
    };
  }

  // For simple disputes with low value
  if (complexity === "basit" && disputeValue < 100_000) {
    reasons.push("Basit uyuşmazlık için arabuluculuk hızlı ve ekonomik");
    reasons.push("Taraflar arası ilişkinin korunması");

    return {
      recommended: "arabuluculuk",
      reasons,
      alternatives: ["Basit yargılama usulü ile dava"],
      estimatedDuration: "2-4 hafta",
      estimatedCost: formatCurrency(
        calculateMediationFees(disputeValue, category).toplam
      ),
    };
  }

  // For complex commercial disputes
  if (complexity === "karmasik" && category === "ticari") {
    reasons.push("Karmaşık ticari uyuşmazlık için uzman hakem avantajı");
    reasons.push("Gizlilik gereksinimi");
    reasons.push("Teknik konularda uzman karar verici");

    return {
      recommended: "tahkim",
      reasons,
      alternatives: ["İhtiyari arabuluculuk", "Ticaret mahkemesinde dava"],
      estimatedDuration: "6-12 ay",
      estimatedCost: "Uyuşmazlık değerinin %2-4'ü",
    };
  }

  // For urgent matters
  if (urgency === "yuksek") {
    reasons.push("Acil çözüm gereksinimi için arabuluculuk öncelikli");
    reasons.push("Mahkeme süreçlerinin uzunluğu");

    alternatives.push("Tahkim (acil hakem prosedürü ile)");
    alternatives.push("İhtiyati tedbir ile dava");

    return {
      recommended: "arabuluculuk",
      reasons,
      alternatives,
      estimatedDuration: "1-3 hafta",
      estimatedCost: formatCurrency(
        calculateMediationFees(disputeValue, category).toplam
      ),
    };
  }

  // Default: standard litigation
  reasons.push("Standart uyuşmazlık çözüm yolu");
  reasons.push("Kesin hüküm etkisi");

  return {
    recommended: "dava",
    reasons,
    alternatives: ["İhtiyari arabuluculuk", "Tahkim"],
    estimatedDuration: "1-3 yıl",
    estimatedCost: "Uyuşmazlık değerinin %5-10'u (harç, avukatlık ücreti dahil)",
  };
}

/**
 * Format currency amount
 */
function formatCurrency(amount: number, currency: string = "TRY"): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate mediation application checklist
 */
export function getMediationChecklist(
  type: MediationType,
  category: DisputeCategory
): Array<{ item: string; required: boolean; description: string }> {
  const baseChecklist = [
    {
      item: "Arabuluculuk Başvuru Formu",
      required: true,
      description: "UYAP veya Adalet Bakanlığı web sitesinden temin edilebilir",
    },
    {
      item: "Kimlik Fotokopisi",
      required: true,
      description: "Tüm başvuran tarafların TC kimlik kartı",
    },
    {
      item: "Vekâletname",
      required: false,
      description: "Avukat aracılığıyla başvuru yapılacaksa gerekli",
    },
    {
      item: "Uyuşmazlığa İlişkin Belgeler",
      required: true,
      description: "Sözleşme, fatura, yazışmalar vb.",
    },
    {
      item: "Karşı Taraf İletişim Bilgileri",
      required: true,
      description: "Ad, adres, telefon, e-posta",
    },
  ];

  // Category-specific items
  if (category === "is_hukuku") {
    baseChecklist.push(
      {
        item: "İş Sözleşmesi",
        required: true,
        description: "Yazılı sözleşme veya SGK kaydı",
      },
      {
        item: "SGK Hizmet Dökümü",
        required: true,
        description: "e-Devlet üzerinden alınabilir",
      },
      {
        item: "Maaş Bordroları",
        required: false,
        description: "Varsa son 6 aylık bordrolar",
      }
    );
  }

  if (category === "ticari") {
    baseChecklist.push(
      {
        item: "Ticaret Sicil Gazetesi",
        required: true,
        description: "Tarafların ticari sicil kayıtları",
      },
      {
        item: "İmza Sirküleri",
        required: true,
        description: "Tüzel kişiler için güncel imza sirküleri",
      }
    );
  }

  if (category === "tuketici") {
    baseChecklist.push(
      {
        item: "Satış Belgesi / Fatura",
        required: true,
        description: "Ürün veya hizmet alımına ilişkin belge",
      },
      {
        item: "Garanti Belgesi",
        required: false,
        description: "Varsa garanti belgesi fotokopisi",
      }
    );
  }

  return baseChecklist;
}

/**
 * Get arbitration clause template
 */
export function getArbitrationClauseTemplate(
  institution: ArbitrationInstitution,
  language: "tr" | "en" = "tr"
): string {
  const templates: Record<
    ArbitrationInstitution,
    Record<"tr" | "en", string>
  > = {
    ISTAC: {
      tr: `Bu sözleşmeden kaynaklanan veya bu sözleşmeyle ilgili tüm uyuşmazlıklar, İstanbul Tahkim Merkezi (ISTAC) Tahkim Kuralları uyarınca nihai olarak tahkim yoluyla çözümlenecektir. Hakem sayısı [bir/üç] olacaktır. Tahkim yeri İstanbul'dur. Tahkim dili Türkçe'dir. Uygulanacak hukuk Türk hukukudur.`,
      en: `All disputes arising out of or in connection with this contract shall be finally settled under the Rules of Arbitration of the Istanbul Arbitration Centre (ISTAC). The number of arbitrators shall be [one/three]. The seat of arbitration shall be Istanbul, Turkey. The language of arbitration shall be English. The law applicable to the merits shall be Turkish law.`,
    },
    ICC: {
      tr: `Bu sözleşmeden kaynaklanan veya bu sözleşmeyle ilgili tüm uyuşmazlıklar, Milletlerarası Ticaret Odası (ICC) Tahkim Kuralları uyarınca [bir/üç] hakem tarafından nihai olarak çözümlenecektir. Tahkim yeri [şehir]'dir.`,
      en: `All disputes arising out of or in connection with this contract shall be finally settled under the Rules of Arbitration of the International Chamber of Commerce by [one/three] arbitrators. The seat of arbitration shall be [city].`,
    },
    ICSID: {
      tr: `Bu Anlaşmadan kaynaklanan yatırım uyuşmazlıkları, Yatırım Uyuşmazlıklarının Çözümü için Uluslararası Merkez (ICSID) Sözleşmesi uyarınca çözümlenecektir.`,
      en: `Investment disputes arising out of this Agreement shall be settled in accordance with the Convention on the Settlement of Investment Disputes between States and Nationals of Other States (ICSID Convention).`,
    },
    LCIA: {
      tr: `Bu sözleşmeden kaynaklanan tüm uyuşmazlıklar, Londra Uluslararası Tahkim Mahkemesi (LCIA) Kuralları uyarınca nihai olarak çözümlenecektir.`,
      en: `Any dispute arising out of or in connection with this contract shall be finally resolved by arbitration under the LCIA Rules.`,
    },
    SIAC: {
      tr: `Bu sözleşmeden kaynaklanan tüm uyuşmazlıklar, Singapur Uluslararası Tahkim Merkezi (SIAC) Kuralları uyarınca çözümlenecektir.`,
      en: `Any dispute arising out of or in connection with this contract shall be referred to and finally resolved by arbitration administered by the Singapore International Arbitration Centre (SIAC) in accordance with the Arbitration Rules of the SIAC.`,
    },
    HKIAC: {
      tr: `Bu sözleşmeden kaynaklanan tüm uyuşmazlıklar, Hong Kong Uluslararası Tahkim Merkezi (HKIAC) Tahkim Kuralları uyarınca çözümlenecektir.`,
      en: `Any dispute arising out of or in connection with this contract shall be referred to and finally resolved by arbitration administered by the Hong Kong International Arbitration Centre (HKIAC) under the HKIAC Administered Arbitration Rules.`,
    },
    ad_hoc: {
      tr: `Bu sözleşmeden kaynaklanan tüm uyuşmazlıklar, UNCITRAL Tahkim Kuralları uyarınca ad hoc tahkim yoluyla çözümlenecektir. Atayıcı makam [kurum]'dur.`,
      en: `Any dispute arising out of or in connection with this contract shall be settled by ad hoc arbitration under the UNCITRAL Arbitration Rules. The appointing authority shall be [institution].`,
    },
  };

  return templates[institution][language];
}

/**
 * Get mediation centers by city
 */
export function getMediationCenters(
  city?: string
): Array<{ name: string; city: string; address: string; phone: string }> {
  const centers = [
    {
      name: "İstanbul Arabuluculuk Merkezi",
      city: "İstanbul",
      address: "Caglayan Adliyesi, Kağıthane",
      phone: "0212 XXX XX XX",
    },
    {
      name: "Ankara Arabuluculuk Merkezi",
      city: "Ankara",
      address: "Ankara Adliyesi, Sıhhiye",
      phone: "0312 XXX XX XX",
    },
    {
      name: "İzmir Arabuluculuk Merkezi",
      city: "İzmir",
      address: "İzmir Adliyesi, Bayraklı",
      phone: "0232 XXX XX XX",
    },
    {
      name: "Bursa Arabuluculuk Merkezi",
      city: "Bursa",
      address: "Bursa Adliyesi",
      phone: "0224 XXX XX XX",
    },
    {
      name: "Antalya Arabuluculuk Merkezi",
      city: "Antalya",
      address: "Antalya Adliyesi",
      phone: "0242 XXX XX XX",
    },
  ];

  if (city) {
    return centers.filter(
      (c) => c.city.toLowerCase() === city.toLowerCase()
    );
  }

  return centers;
}

/**
 * Get dispute category name in Turkish
 */
export function getDisputeCategoryName(category: DisputeCategory): string {
  const names: Record<DisputeCategory, string> = {
    is_hukuku: "İş Hukuku",
    ticari: "Ticari",
    tuketici: "Tüketici",
    aile: "Aile",
    kira: "Kira",
    insaat: "İnşaat",
    sigorta: "Sigorta",
    bankacilik: "Bankacılık",
    fikri_mulkiyet: "Fikri Mülkiyet",
    saglik: "Sağlık",
    diger: "Diğer",
  };
  return names[category];
}

/**
 * Get arbitration institution name
 */
export function getInstitutionName(institution: ArbitrationInstitution): string {
  const names: Record<ArbitrationInstitution, string> = {
    ISTAC: "İstanbul Tahkim Merkezi",
    ICC: "Milletlerarası Ticaret Odası",
    ICSID: "Yatırım Uyuşmazlıkları Çözüm Merkezi",
    LCIA: "Londra Uluslararası Tahkim Mahkemesi",
    SIAC: "Singapur Uluslararası Tahkim Merkezi",
    HKIAC: "Hong Kong Uluslararası Tahkim Merkezi",
    ad_hoc: "Ad Hoc Tahkim",
  };
  return names[institution];
}

/**
 * Format mediation case summary
 */
export function formatMediationSummary(caseData: MediationCase): string {
  const lines: string[] = [];

  lines.push(`## Arabuluculuk Dosyası Özeti`);
  lines.push(``);
  lines.push(`**Dosya No:** ${caseData.id}`);
  lines.push(`**Tür:** ${caseData.type === "zorunlu_is" ? "Zorunlu (İş)" : caseData.type === "zorunlu_ticari" ? "Zorunlu (Ticari)" : "İhtiyari"}`);
  lines.push(`**Kategori:** ${getDisputeCategoryName(caseData.category)}`);
  lines.push(`**Durum:** ${getMediationStatusName(caseData.status)}`);
  lines.push(``);

  lines.push(`### Taraflar`);
  for (const party of caseData.parties) {
    lines.push(`- ${party.name} (${party.role === "basvuran" ? "Başvuran" : "Karşı Taraf"})`);
  }

  if (caseData.mediator) {
    lines.push(``);
    lines.push(`### Arabulucu`);
    lines.push(`**Ad:** ${caseData.mediator.name}`);
    lines.push(`**Sicil No:** ${caseData.mediator.sicilNo}`);
  }

  lines.push(``);
  lines.push(`### Ücretler`);
  lines.push(`- Başvuru Harcı: ${formatCurrency(caseData.fees.basvuruHarci)}`);
  lines.push(`- Arabulucu Ücreti: ${formatCurrency(caseData.fees.arabulucuUcreti)} (taraf başı)`);
  lines.push(`- **Toplam:** ${formatCurrency(caseData.fees.toplam)}`);

  if (caseData.settlement) {
    lines.push(``);
    lines.push(`### Anlaşma`);
    lines.push(`**Tarih:** ${caseData.settlement.date.toLocaleDateString("tr-TR")}`);
    lines.push(`**İlam Niteliğinde:** ${caseData.settlement.ilamNiteliginde ? "Evet" : "Hayır"}`);
    if (caseData.settlement.totalValue) {
      lines.push(`**Toplam Değer:** ${formatCurrency(caseData.settlement.totalValue)}`);
    }
  }

  return lines.join("\n");
}

/**
 * Get mediation status name in Turkish
 */
function getMediationStatusName(status: MediationStatus): string {
  const names: Record<MediationStatus, string> = {
    basvuru_yapildi: "Başvuru Yapıldı",
    arabulucu_atandi: "Arabulucu Atandı",
    gorusmeler_devam: "Görüşmeler Devam Ediyor",
    anlasma_saglandi: "Anlaşma Sağlandı",
    anlasma_saglanamadi: "Anlaşma Sağlanamadı",
    vazgecildi: "Vazgeçildi",
    suresi_doldu: "Süresi Doldu",
  };
  return names[status];
}
