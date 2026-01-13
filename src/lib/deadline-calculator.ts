/**
 * Legal Deadline Calculator
 *
 * Calculates important legal deadlines for Turkish law including:
 * - Statute of limitations (Zamanaşımı)
 * - Appeal deadlines (İtiraz/Temyiz süreleri)
 * - Response deadlines (Cevap süreleri)
 * - Notification periods (Bildirim süreleri)
 *
 * Based on Turkish legal codes:
 * - TMK (Türk Medeni Kanunu)
 * - TBK (Türk Borçlar Kanunu)
 * - HMK (Hukuk Muhakemeleri Kanunu)
 * - İş Kanunu
 * - TTK (Türk Ticaret Kanunu)
 */

export interface DeadlineType {
  id: string;
  name: string;
  category: DeadlineCategory;
  description: string;
  baseDuration: number; // in days
  durationUnit: "day" | "week" | "month" | "year";
  legalBasis: string;
  notes?: string[];
  isWorkingDays?: boolean;
}

export type DeadlineCategory =
  | "zamanasimi"
  | "itiraz"
  | "temyiz"
  | "cevap"
  | "bildirim"
  | "dava_acma"
  | "icra";

export interface DeadlineCalculation {
  deadline: DeadlineType;
  startDate: Date;
  endDate: Date;
  remainingDays: number;
  isExpired: boolean;
  warnings: string[];
  holidays: Date[];
}

// Turkish Public Holidays (recurring and fixed)
const RECURRING_HOLIDAYS = [
  { month: 1, day: 1, name: "Yılbaşı" },
  { month: 4, day: 23, name: "Ulusal Egemenlik ve Çocuk Bayramı" },
  { month: 5, day: 1, name: "Emek ve Dayanışma Günü" },
  { month: 5, day: 19, name: "Atatürk'ü Anma, Gençlik ve Spor Bayramı" },
  { month: 7, day: 15, name: "Demokrasi ve Milli Birlik Günü" },
  { month: 8, day: 30, name: "Zafer Bayramı" },
  { month: 10, day: 29, name: "Cumhuriyet Bayramı" },
];

// Deadline Types Database
const DEADLINE_TYPES: DeadlineType[] = [
  // Zamanaşımı Süreleri
  {
    id: "zamanasimi_genel",
    name: "Genel Zamanaşımı",
    category: "zamanasimi",
    description: "Kanunda aksine hüküm bulunmayan hallerde alacak hakları için genel zamanaşımı süresi",
    baseDuration: 10,
    durationUnit: "year",
    legalBasis: "TBK m.146",
    notes: ["Süre, alacağın muaccel olduğu tarihten itibaren başlar"],
  },
  {
    id: "zamanasimi_kira",
    name: "Kira Alacağı Zamanaşımı",
    category: "zamanasimi",
    description: "Kira bedelinden doğan alacaklar için zamanaşımı",
    baseDuration: 5,
    durationUnit: "year",
    legalBasis: "TBK m.147/1",
  },
  {
    id: "zamanasimi_ucret",
    name: "Ücret Alacağı Zamanaşımı",
    category: "zamanasimi",
    description: "İşçi ücret alacakları için zamanaşımı",
    baseDuration: 5,
    durationUnit: "year",
    legalBasis: "TBK m.147/1, İş Kanunu m.32",
    notes: ["İşçilik alacakları için 5 yıllık zamanaşımı uygulanır"],
  },
  {
    id: "zamanasimi_haksiz_fiil",
    name: "Haksız Fiil Zamanaşımı",
    category: "zamanasimi",
    description: "Haksız fiilden doğan tazminat taleplerinde zamanaşımı",
    baseDuration: 2,
    durationUnit: "year",
    legalBasis: "TBK m.72",
    notes: [
      "Zarar ve faili öğrenmeden itibaren 2 yıl",
      "Her halde fiilin işlenmesinden itibaren 10 yıl",
    ],
  },
  {
    id: "zamanasimi_bono",
    name: "Bono/Çek Zamanaşımı",
    category: "zamanasimi",
    description: "Kambiyo senetlerinde zamanaşımı",
    baseDuration: 3,
    durationUnit: "year",
    legalBasis: "TTK m.749, m.814",
    notes: ["Vadeden itibaren 3 yıl"],
  },
  {
    id: "zamanasimi_is_kazasi",
    name: "İş Kazası Tazminat Zamanaşımı",
    category: "zamanasimi",
    description: "İş kazası ve meslek hastalığından doğan tazminat talepleri",
    baseDuration: 10,
    durationUnit: "year",
    legalBasis: "TBK m.146, Yargıtay İçtihadı",
    notes: ["Maddi ve manevi tazminat talepleri için 10 yıl"],
  },

  // Dava Açma Süreleri
  {
    id: "dava_ise_iade",
    name: "İşe İade Davası Süresi",
    category: "dava_acma",
    description: "Fesih bildiriminin tebliğinden itibaren arabulucuya başvuru süresi",
    baseDuration: 1,
    durationUnit: "month",
    legalBasis: "İş Kanunu m.20",
    notes: [
      "Önce arabulucuya başvurulmalıdır",
      "Arabuluculuk son tutanağından itibaren 2 hafta içinde dava açılmalıdır",
    ],
  },
  {
    id: "dava_kidem_ihbar",
    name: "Kıdem/İhbar Tazminatı Davası",
    category: "dava_acma",
    description: "Kıdem ve ihbar tazminatı alacakları için dava açma süresi",
    baseDuration: 5,
    durationUnit: "year",
    legalBasis: "İş Kanunu Ek m.3",
    notes: ["İş sözleşmesinin sona ermesinden itibaren 5 yıl"],
  },
  {
    id: "dava_iptal_idari",
    name: "İdari İşlemin İptali Davası",
    category: "dava_acma",
    description: "İdari işlemlere karşı iptal davası açma süresi",
    baseDuration: 60,
    durationUnit: "day",
    legalBasis: "İYUK m.7",
    notes: ["İşlemin tebliğinden itibaren 60 gün"],
  },
  {
    id: "dava_vergi",
    name: "Vergi Davası Açma Süresi",
    category: "dava_acma",
    description: "Vergi uyuşmazlıklarında dava açma süresi",
    baseDuration: 30,
    durationUnit: "day",
    legalBasis: "İYUK m.7/2",
    notes: ["Vergi işleminin tebliğinden itibaren 30 gün"],
  },

  // İtiraz ve Temyiz Süreleri
  {
    id: "itiraz_icra",
    name: "İcra Takibine İtiraz",
    category: "itiraz",
    description: "Ödeme emrine itiraz süresi",
    baseDuration: 7,
    durationUnit: "day",
    legalBasis: "İİK m.62",
    notes: ["Ödeme emrinin tebliğinden itibaren 7 gün"],
    isWorkingDays: false,
  },
  {
    id: "istinaf_hukuk",
    name: "Hukuk Davası İstinaf Süresi",
    category: "temyiz",
    description: "Hukuk davalarında istinaf başvuru süresi",
    baseDuration: 2,
    durationUnit: "week",
    legalBasis: "HMK m.345",
    notes: ["Gerekçeli kararın tebliğinden itibaren 2 hafta"],
  },
  {
    id: "temyiz_hukuk",
    name: "Hukuk Davası Temyiz Süresi",
    category: "temyiz",
    description: "İstinaf kararlarına karşı temyiz süresi",
    baseDuration: 2,
    durationUnit: "week",
    legalBasis: "HMK m.361",
    notes: ["İstinaf kararının tebliğinden itibaren 2 hafta"],
  },
  {
    id: "itiraz_ceza",
    name: "Ceza Mahkemesi İtiraz Süresi",
    category: "itiraz",
    description: "Ceza mahkemesi kararlarına itiraz süresi",
    baseDuration: 7,
    durationUnit: "day",
    legalBasis: "CMK m.268",
    notes: ["Kararın öğrenilmesinden itibaren 7 gün"],
  },
  {
    id: "istinaf_ceza",
    name: "Ceza Davası İstinaf Süresi",
    category: "temyiz",
    description: "Ceza davalarında istinaf başvuru süresi",
    baseDuration: 7,
    durationUnit: "day",
    legalBasis: "CMK m.273",
    notes: ["Hükmün açıklanmasından itibaren 7 gün"],
  },

  // Cevap Süreleri
  {
    id: "cevap_dilekce",
    name: "Davaya Cevap Süresi",
    category: "cevap",
    description: "Dava dilekçesine cevap verme süresi",
    baseDuration: 2,
    durationUnit: "week",
    legalBasis: "HMK m.127",
    notes: ["Dava dilekçesinin tebliğinden itibaren 2 hafta", "Süre 1 aya kadar uzatılabilir"],
  },
  {
    id: "cevap_is_mahkemesi",
    name: "İş Mahkemesi Cevap Süresi",
    category: "cevap",
    description: "İş mahkemesinde davaya cevap süresi",
    baseDuration: 2,
    durationUnit: "week",
    legalBasis: "İş Mah. Kanunu m.7",
    notes: ["Dava dilekçesinin tebliğinden itibaren 2 hafta"],
  },
  {
    id: "cevap_icra",
    name: "İcra İnkâr Tazminatı",
    category: "cevap",
    description: "İtirazın iptali davasında cevap süresi",
    baseDuration: 2,
    durationUnit: "week",
    legalBasis: "HMK m.127",
  },

  // Bildirim Süreleri
  {
    id: "bildirim_fesih_2yil",
    name: "İş Akdi Fesih Bildirimi (0-6 ay)",
    category: "bildirim",
    description: "6 aydan az kıdemi olan işçi için fesih bildirim süresi",
    baseDuration: 2,
    durationUnit: "week",
    legalBasis: "İş Kanunu m.17",
  },
  {
    id: "bildirim_fesih_6ay_15yil",
    name: "İş Akdi Fesih Bildirimi (6 ay - 1.5 yıl)",
    category: "bildirim",
    description: "6 ay ile 1.5 yıl arası kıdemi olan işçi için fesih bildirim süresi",
    baseDuration: 4,
    durationUnit: "week",
    legalBasis: "İş Kanunu m.17",
  },
  {
    id: "bildirim_fesih_15_3yil",
    name: "İş Akdi Fesih Bildirimi (1.5-3 yıl)",
    category: "bildirim",
    description: "1.5 ile 3 yıl arası kıdemi olan işçi için fesih bildirim süresi",
    baseDuration: 6,
    durationUnit: "week",
    legalBasis: "İş Kanunu m.17",
  },
  {
    id: "bildirim_fesih_3yil_fazla",
    name: "İş Akdi Fesih Bildirimi (3+ yıl)",
    category: "bildirim",
    description: "3 yıldan fazla kıdemi olan işçi için fesih bildirim süresi",
    baseDuration: 8,
    durationUnit: "week",
    legalBasis: "İş Kanunu m.17",
  },
  {
    id: "bildirim_kira_tahliye",
    name: "Kira Tahliye Bildirimi",
    category: "bildirim",
    description: "Kiracıya tahliye için önceden bildirim süresi",
    baseDuration: 3,
    durationUnit: "month",
    legalBasis: "TBK m.347",
    notes: ["Sözleşme süresi sonu için en az 3 ay önce bildirim yapılmalıdır"],
  },

  // İcra Süreleri
  {
    id: "icra_haciz",
    name: "Haciz İsteme Süresi",
    category: "icra",
    description: "Ödeme emri kesinleştikten sonra haciz isteme süresi",
    baseDuration: 1,
    durationUnit: "year",
    legalBasis: "İİK m.78",
    notes: ["Süre içinde haciz istenmezse dosya düşer"],
  },
  {
    id: "icra_satış_talep",
    name: "Satış İsteme Süresi (Taşınır)",
    category: "icra",
    description: "Taşınır mal haczi sonrası satış talep süresi",
    baseDuration: 6,
    durationUnit: "month",
    legalBasis: "İİK m.106",
  },
  {
    id: "icra_satış_talep_tasinmaz",
    name: "Satış İsteme Süresi (Taşınmaz)",
    category: "icra",
    description: "Taşınmaz haczi sonrası satış talep süresi",
    baseDuration: 1,
    durationUnit: "year",
    legalBasis: "İİK m.106",
  },
];

/**
 * Get all deadline types
 */
export function getDeadlineTypes(): DeadlineType[] {
  return DEADLINE_TYPES;
}

/**
 * Get deadline types by category
 */
export function getDeadlinesByCategory(category: DeadlineCategory): DeadlineType[] {
  return DEADLINE_TYPES.filter(d => d.category === category);
}

/**
 * Get deadline type by ID
 */
export function getDeadlineById(deadlineId: string): DeadlineType | null {
  return DEADLINE_TYPES.find(d => d.id === deadlineId) || null;
}

/**
 * Search deadline types
 */
export function searchDeadlines(query: string): DeadlineType[] {
  const lowerQuery = query.toLowerCase();
  return DEADLINE_TYPES.filter(d =>
    d.name.toLowerCase().includes(lowerQuery) ||
    d.description.toLowerCase().includes(lowerQuery) ||
    d.legalBasis.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Calculate deadline from start date
 */
export function calculateDeadline(
  deadlineId: string,
  startDate: Date
): DeadlineCalculation | null {
  const deadline = getDeadlineById(deadlineId);
  if (!deadline) return null;

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  let endDate: Date;

  switch (deadline.durationUnit) {
    case "day":
      endDate = addDays(start, deadline.baseDuration, deadline.isWorkingDays);
      break;
    case "week":
      endDate = addDays(start, deadline.baseDuration * 7, false);
      break;
    case "month":
      endDate = addMonths(start, deadline.baseDuration);
      break;
    case "year":
      endDate = addYears(start, deadline.baseDuration);
      break;
    default:
      endDate = addDays(start, deadline.baseDuration, false);
  }

  // Check if end date falls on weekend or holiday
  const holidays = getHolidaysInRange(start, endDate);
  endDate = adjustForHolidays(endDate, holidays);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const remainingDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = remainingDays < 0;

  // Generate warnings
  const warnings: string[] = [];
  if (isExpired) {
    warnings.push("⚠️ SÜRE DOLMUŞTUR!");
  } else if (remainingDays <= 3) {
    warnings.push("⚠️ Son 3 gün! Acil işlem yapınız.");
  } else if (remainingDays <= 7) {
    warnings.push("⚠️ Süre dolmak üzere, hazırlıklarınızı tamamlayınız.");
  }

  if (deadline.notes) {
    warnings.push(...deadline.notes);
  }

  return {
    deadline,
    startDate: start,
    endDate,
    remainingDays: Math.max(0, remainingDays),
    isExpired,
    warnings,
    holidays,
  };
}

/**
 * Add days to date
 */
function addDays(date: Date, days: number, workingDaysOnly: boolean = false): Date {
  const result = new Date(date);

  if (workingDaysOnly) {
    let addedDays = 0;
    while (addedDays < days) {
      result.setDate(result.getDate() + 1);
      if (!isWeekend(result)) {
        addedDays++;
      }
    }
  } else {
    result.setDate(result.getDate() + days);
  }

  return result;
}

/**
 * Add months to date
 */
function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Add years to date
 */
function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * Check if date is weekend
 */
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Check if date is a Turkish public holiday
 */
function isHoliday(date: Date): boolean {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return RECURRING_HOLIDAYS.some(h => h.month === month && h.day === day);
}

/**
 * Get holidays in date range
 */
function getHolidaysInRange(startDate: Date, endDate: Date): Date[] {
  const holidays: Date[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    if (isHoliday(current)) {
      holidays.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }

  return holidays;
}

/**
 * Adjust date if it falls on weekend or holiday
 */
function adjustForHolidays(date: Date, holidays: Date[]): Date {
  const result = new Date(date);

  while (isWeekend(result) || isHoliday(result)) {
    result.setDate(result.getDate() + 1);
  }

  return result;
}

/**
 * Get all deadline categories
 */
export function getDeadlineCategories(): Array<{ id: DeadlineCategory; name: string; count: number }> {
  const categoryNames: Record<DeadlineCategory, string> = {
    zamanasimi: "Zamanaşımı Süreleri",
    itiraz: "İtiraz Süreleri",
    temyiz: "İstinaf/Temyiz Süreleri",
    cevap: "Cevap Süreleri",
    bildirim: "Bildirim Süreleri",
    dava_acma: "Dava Açma Süreleri",
    icra: "İcra Süreleri",
  };

  const categories: DeadlineCategory[] = [
    "zamanasimi", "dava_acma", "itiraz", "temyiz", "cevap", "bildirim", "icra"
  ];

  return categories.map(cat => ({
    id: cat,
    name: categoryNames[cat],
    count: DEADLINE_TYPES.filter(d => d.category === cat).length,
  }));
}

/**
 * Calculate multiple deadlines
 */
export function calculateMultipleDeadlines(
  deadlineIds: string[],
  startDate: Date
): DeadlineCalculation[] {
  return deadlineIds
    .map(id => calculateDeadline(id, startDate))
    .filter((d): d is DeadlineCalculation => d !== null)
    .sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
}

/**
 * Get employment termination notice period
 */
export function getTerminationNoticePeriod(
  employmentYears: number
): DeadlineType | null {
  if (employmentYears < 0.5) {
    return getDeadlineById("bildirim_fesih_2yil");
  } else if (employmentYears < 1.5) {
    return getDeadlineById("bildirim_fesih_6ay_15yil");
  } else if (employmentYears < 3) {
    return getDeadlineById("bildirim_fesih_15_3yil");
  } else {
    return getDeadlineById("bildirim_fesih_3yil_fazla");
  }
}

/**
 * Format date in Turkish
 */
export function formatDateTR(date: Date): string {
  const months = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Format remaining time
 */
export function formatRemainingTime(days: number): string {
  if (days === 0) return "Bugün son gün!";
  if (days === 1) return "1 gün kaldı";
  if (days < 7) return `${days} gün kaldı`;
  if (days < 30) return `${Math.floor(days / 7)} hafta kaldı`;
  if (days < 365) return `${Math.floor(days / 30)} ay kaldı`;
  return `${Math.floor(days / 365)} yıl kaldı`;
}
