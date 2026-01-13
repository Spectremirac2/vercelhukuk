/**
 * Hukuki Hesaplama Formülleri
 * 
 * Tüm yasal hesaplamalar için fonksiyonlar
 * Kıdem, ihbar, faiz, nafaka, vergi, miras vb.
 */

// ============================================
// SABİTLER VE ORANLAR (2024)
// ============================================

export const LEGAL_CONSTANTS_2024 = {
  // Asgari ücret
  MINIMUM_WAGE_GROSS: 20002.50,  // Brüt
  MINIMUM_WAGE_NET: 17002.12,    // Net
  
  // Kıdem tazminatı tavanı (6 ayda bir güncellenir)
  SEVERANCE_CEILING: 35058.58,   // 1 Ocak 2024
  
  // SGK kesintileri
  SGK_WORKER_RATE: 0.14,         // İşçi payı
  SGK_EMPLOYER_RATE: 0.205,      // İşveren payı
  UNEMPLOYMENT_WORKER_RATE: 0.01,
  UNEMPLOYMENT_EMPLOYER_RATE: 0.02,
  
  // Gelir vergisi dilimleri
  INCOME_TAX_BRACKETS: [
    { limit: 110000, rate: 0.15 },
    { limit: 230000, rate: 0.20 },
    { limit: 580000, rate: 0.27 },
    { limit: 3000000, rate: 0.35 },
    { limit: Infinity, rate: 0.40 }
  ],
  
  // Damga vergisi oranları
  STAMP_TAX_CONTRACT: 0.00948,   // Binde 9,48
  STAMP_TAX_LEASE: 0.00569,      // Binde 5,69
  STAMP_TAX_CEILING: 21167887.50,
  
  // Yasal faiz oranları
  LEGAL_INTEREST_RATE: 0.24,     // %24 (yıllık)
  DEFAULT_INTEREST_RATE: 0.24,   // Temerrüt faizi
  COMMERCIAL_INTEREST_RATE: 0.33, // Ticari temerrüt (avans faizi)
  
  // Gecikme zammı (vergi)
  LATE_PAYMENT_RATE: 0.03,       // Aylık %3
  
  // TÜFE (yaklaşık yıllık)
  TUFE_ANNUAL: 0.6489,           // %64.89 (Aralık 2023)
  
  // Emlak vergisi (büyükşehir dışı temel oranlar)
  PROPERTY_TAX_RESIDENTIAL: 0.001,
  PROPERTY_TAX_COMMERCIAL: 0.002,
  PROPERTY_TAX_LAND: 0.001,
  PROPERTY_TAX_LOT: 0.003
};

// ============================================
// TİPLER
// ============================================

export interface SeveranceCalculationInput {
  startDate: Date;
  endDate: Date;
  grossSalary: number;
  hasBonus?: boolean;
  bonusAmount?: number;
  hasFoodAllowance?: boolean;
  foodAllowanceMonthly?: number;
  hasTransportAllowance?: boolean;
  transportAllowanceMonthly?: number;
}

export interface SeveranceCalculationResult {
  yearsWorked: number;
  monthsWorked: number;
  daysWorked: number;
  totalDays: number;
  dailyGrossSalary: number;
  dailyWithBenefits: number;
  grossSeverance: number;
  severanceCeiling: number;
  appliedCeiling: boolean;
  finalSeverance: number;
  stampTax: number;
  netSeverance: number;
  breakdown: Array<{ item: string; amount: number }>;
}

export interface NoticeCalculationInput {
  yearsWorked: number;
  grossSalary: number;
}

export interface NoticeCalculationResult {
  noticePeriodWeeks: number;
  noticePeriodDays: number;
  dailyWage: number;
  grossNoticeCompensation: number;
  incomeTax: number;
  stampTax: number;
  netNoticeCompensation: number;
}

export interface OvertimeCalculationInput {
  hourlyWage: number;
  overtimeHours: number;
  isWeekend?: boolean;
  isHoliday?: boolean;
}

export interface InterestCalculationInput {
  principal: number;
  annualRate: number;
  startDate: Date;
  endDate: Date;
  isCommercial?: boolean;
}

export interface InterestCalculationResult {
  principal: number;
  totalDays: number;
  annualRate: number;
  interest: number;
  total: number;
  breakdown: {
    years: number;
    months: number;
    days: number;
  };
}

export interface InheritanceCalculationInput {
  estateValue: number;
  spouseAlive: boolean;
  children: number;
  parentsAlive: boolean;
  siblings: number;
  hasWill?: boolean;
  willBequests?: number;
}

export interface InheritanceShare {
  heir: string;
  shareRatio: string;
  shareAmount: number;
}

export interface InheritanceCalculationResult {
  totalEstate: number;
  reservedPortion: number;
  disposablePortion: number;
  shares: InheritanceShare[];
  notes: string[];
}

// ============================================
// KIDEM TAZMİNATI HESAPLAMA
// ============================================

export function calculateSeverance(input: SeveranceCalculationInput): SeveranceCalculationResult {
  const { startDate, endDate, grossSalary } = input;
  
  // Çalışma süresi hesapla
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const yearsWorked = Math.floor(totalDays / 365);
  const remainingDays = totalDays % 365;
  const monthsWorked = Math.floor(remainingDays / 30);
  const daysWorked = remainingDays % 30;
  
  // Brüt gün ücreti
  const dailyGrossSalary = grossSalary / 30;
  
  // Ek haklar dahil gün ücreti
  let dailyWithBenefits = dailyGrossSalary;
  const breakdown: Array<{ item: string; amount: number }> = [
    { item: 'Brüt Maaş', amount: grossSalary }
  ];
  
  if (input.hasBonus && input.bonusAmount) {
    const monthlyBonus = input.bonusAmount / 12;
    dailyWithBenefits += monthlyBonus / 30;
    breakdown.push({ item: 'İkramiye (Yıllık/12)', amount: monthlyBonus });
  }
  
  if (input.hasFoodAllowance && input.foodAllowanceMonthly) {
    dailyWithBenefits += input.foodAllowanceMonthly / 30;
    breakdown.push({ item: 'Yemek Yardımı', amount: input.foodAllowanceMonthly });
  }
  
  if (input.hasTransportAllowance && input.transportAllowanceMonthly) {
    dailyWithBenefits += input.transportAllowanceMonthly / 30;
    breakdown.push({ item: 'Yol Yardımı', amount: input.transportAllowanceMonthly });
  }
  
  // Brüt kıdem tazminatı (her yıl için 30 günlük ücret)
  const kistRatio = totalDays / 365;
  const grossSeverance = dailyWithBenefits * 30 * kistRatio;
  
  // Tavan kontrolü
  const severanceCeiling = LEGAL_CONSTANTS_2024.SEVERANCE_CEILING;
  const ceilingAppliedDaily = Math.min(dailyWithBenefits * 30, severanceCeiling);
  const appliedCeiling = (dailyWithBenefits * 30) > severanceCeiling;
  
  const finalSeverance = appliedCeiling 
    ? (severanceCeiling / 30) * 30 * kistRatio 
    : grossSeverance;
  
  // Damga vergisi (kıdem tazminatında binde 7,59)
  const stampTax = finalSeverance * 0.00759;
  
  // Net kıdem tazminatı
  const netSeverance = finalSeverance - stampTax;
  
  return {
    yearsWorked,
    monthsWorked,
    daysWorked,
    totalDays,
    dailyGrossSalary,
    dailyWithBenefits,
    grossSeverance,
    severanceCeiling,
    appliedCeiling,
    finalSeverance,
    stampTax,
    netSeverance,
    breakdown
  };
}

// ============================================
// İHBAR TAZMİNATI HESAPLAMA
// ============================================

export function calculateNoticeCompensation(input: NoticeCalculationInput): NoticeCalculationResult {
  const { yearsWorked, grossSalary } = input;
  
  // İhbar süresi belirleme
  let noticePeriodWeeks: number;
  if (yearsWorked < 0.5) {
    noticePeriodWeeks = 2;
  } else if (yearsWorked < 1.5) {
    noticePeriodWeeks = 4;
  } else if (yearsWorked < 3) {
    noticePeriodWeeks = 6;
  } else {
    noticePeriodWeeks = 8;
  }
  
  const noticePeriodDays = noticePeriodWeeks * 7;
  const dailyWage = grossSalary / 30;
  const grossNoticeCompensation = dailyWage * noticePeriodDays;
  
  // Gelir vergisi (kümülatif matrah olmadan basit hesaplama)
  const incomeTax = grossNoticeCompensation * 0.15;
  
  // Damga vergisi
  const stampTax = grossNoticeCompensation * 0.00759;
  
  const netNoticeCompensation = grossNoticeCompensation - incomeTax - stampTax;
  
  return {
    noticePeriodWeeks,
    noticePeriodDays,
    dailyWage,
    grossNoticeCompensation,
    incomeTax,
    stampTax,
    netNoticeCompensation
  };
}

// ============================================
// FAZLA MESAİ HESAPLAMA
// ============================================

export function calculateOvertime(input: OvertimeCalculationInput): {
  normalRate: number;
  overtimeRate: number;
  totalOvertimePay: number;
  multiplier: number;
} {
  const { hourlyWage, overtimeHours, isWeekend, isHoliday } = input;
  
  // Çarpan belirleme
  let multiplier = 1.5; // Normal fazla mesai
  if (isWeekend) multiplier = 2.0;
  if (isHoliday) multiplier = 2.5;
  
  const overtimeRate = hourlyWage * multiplier;
  const totalOvertimePay = overtimeRate * overtimeHours;
  
  return {
    normalRate: hourlyWage,
    overtimeRate,
    totalOvertimePay,
    multiplier
  };
}

// ============================================
// FAİZ HESAPLAMA
// ============================================

export function calculateInterest(input: InterestCalculationInput): InterestCalculationResult {
  const { principal, annualRate, startDate, endDate, isCommercial } = input;
  
  // Gün sayısı hesapla
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Süre dökümü
  const years = Math.floor(totalDays / 365);
  const remainingDays = totalDays % 365;
  const months = Math.floor(remainingDays / 30);
  const days = remainingDays % 30;
  
  // Uygulanan oran
  const rate = isCommercial 
    ? LEGAL_CONSTANTS_2024.COMMERCIAL_INTEREST_RATE 
    : (annualRate || LEGAL_CONSTANTS_2024.LEGAL_INTEREST_RATE);
  
  // Faiz hesaplama (basit faiz)
  const interest = principal * rate * (totalDays / 365);
  
  return {
    principal,
    totalDays,
    annualRate: rate,
    interest: Math.round(interest * 100) / 100,
    total: Math.round((principal + interest) * 100) / 100,
    breakdown: { years, months, days }
  };
}

// ============================================
// MİRAS PAYI HESAPLAMA
// ============================================

export function calculateInheritance(input: InheritanceCalculationInput): InheritanceCalculationResult {
  const { estateValue, spouseAlive, children, parentsAlive, siblings, hasWill, willBequests } = input;
  const shares: InheritanceShare[] = [];
  const notes: string[] = [];
  
  // Saklı pay oranları
  let reservedPortionRatio = 0;
  let disposablePortionRatio = 1;
  
  if (children > 0) {
    // Eş + çocuklar
    if (spouseAlive) {
      // Eş: 1/4, Çocuklar: 3/4
      const spouseShare = estateValue * 0.25;
      shares.push({ heir: 'Eş', shareRatio: '1/4', shareAmount: spouseShare });
      
      const childrenTotal = estateValue * 0.75;
      const perChild = childrenTotal / children;
      for (let i = 1; i <= children; i++) {
        shares.push({ heir: `Çocuk ${i}`, shareRatio: `${(0.75/children).toFixed(4)}`, shareAmount: perChild });
      }
      
      // Saklı pay: Eş 1/8, her çocuk yasal payın 1/2'si
      reservedPortionRatio = 0.125 + (0.75 * 0.5);
      notes.push('Eşin saklı payı: Yasal payın 1/2si (1/8)');
      notes.push('Çocukların saklı payı: Yasal payın 1/2si');
    } else {
      // Sadece çocuklar
      const perChild = estateValue / children;
      for (let i = 1; i <= children; i++) {
        shares.push({ heir: `Çocuk ${i}`, shareRatio: `1/${children}`, shareAmount: perChild });
      }
      reservedPortionRatio = 0.5; // Çocukların saklı payı
    }
  } else if (parentsAlive) {
    // Eş + anne-baba
    if (spouseAlive) {
      // Eş: 1/2, Anne-baba: 1/2
      shares.push({ heir: 'Eş', shareRatio: '1/2', shareAmount: estateValue * 0.5 });
      shares.push({ heir: 'Anne-Baba', shareRatio: '1/2', shareAmount: estateValue * 0.5 });
      
      reservedPortionRatio = 0.25 + 0.25; // Eş 1/4, anne-baba 1/4
      notes.push('Anne-babanın saklı payı: Yasal payın 1/2si (1/4)');
    } else {
      shares.push({ heir: 'Anne-Baba', shareRatio: '1/1', shareAmount: estateValue });
      reservedPortionRatio = 0.5;
    }
  } else if (spouseAlive) {
    // Sadece eş (kardeşler varsa)
    if (siblings > 0) {
      // Eş: 3/4, Kardeşler: 1/4
      shares.push({ heir: 'Eş', shareRatio: '3/4', shareAmount: estateValue * 0.75 });
      const siblingsTotal = estateValue * 0.25;
      const perSibling = siblingsTotal / siblings;
      for (let i = 1; i <= siblings; i++) {
        shares.push({ heir: `Kardeş ${i}`, shareRatio: `${(0.25/siblings).toFixed(4)}`, shareAmount: perSibling });
      }
      notes.push('Kardeşlerin saklı payı yoktur');
    } else {
      // Sadece eş
      shares.push({ heir: 'Eş', shareRatio: '1/1', shareAmount: estateValue });
    }
    reservedPortionRatio = 0.375; // Eşin bu durumda saklı payı 3/8
  } else if (siblings > 0) {
    // Sadece kardeşler
    const perSibling = estateValue / siblings;
    for (let i = 1; i <= siblings; i++) {
      shares.push({ heir: `Kardeş ${i}`, shareRatio: `1/${siblings}`, shareAmount: perSibling });
    }
    notes.push('Kardeşlerin saklı payı yoktur');
    reservedPortionRatio = 0;
  }
  
  disposablePortionRatio = 1 - reservedPortionRatio;
  const reservedPortion = estateValue * reservedPortionRatio;
  const disposablePortion = estateValue * disposablePortionRatio;
  
  // Vasiyetname varsa
  if (hasWill && willBequests) {
    if (willBequests > disposablePortion) {
      notes.push(`⚠️ Vasiyetname tutarı (${willBequests.toLocaleString('tr-TR')} TL) tasarruf oranını (${disposablePortion.toLocaleString('tr-TR')} TL) aşıyor. Tenkis davası açılabilir.`);
    } else {
      notes.push(`Vasiyetname tutarı tasarruf oranı içinde kalmaktadır.`);
    }
  }
  
  return {
    totalEstate: estateValue,
    reservedPortion,
    disposablePortion,
    shares,
    notes
  };
}

// ============================================
// GELİR VERGİSİ HESAPLAMA
// ============================================

export function calculateIncomeTax(annualIncome: number): {
  taxableIncome: number;
  totalTax: number;
  effectiveRate: number;
  brackets: Array<{ bracket: string; income: number; rate: number; tax: number }>;
} {
  const brackets = LEGAL_CONSTANTS_2024.INCOME_TAX_BRACKETS;
  const result: Array<{ bracket: string; income: number; rate: number; tax: number }> = [];
  
  let remainingIncome = annualIncome;
  let totalTax = 0;
  let previousLimit = 0;
  
  for (const bracket of brackets) {
    const bracketSize = bracket.limit - previousLimit;
    const incomeInBracket = Math.min(remainingIncome, bracketSize);
    
    if (incomeInBracket <= 0) break;
    
    const taxInBracket = incomeInBracket * bracket.rate;
    totalTax += taxInBracket;
    
    result.push({
      bracket: `${previousLimit.toLocaleString('tr-TR')} - ${bracket.limit === Infinity ? '∞' : bracket.limit.toLocaleString('tr-TR')} TL`,
      income: incomeInBracket,
      rate: bracket.rate,
      tax: taxInBracket
    });
    
    remainingIncome -= incomeInBracket;
    previousLimit = bracket.limit;
  }
  
  return {
    taxableIncome: annualIncome,
    totalTax: Math.round(totalTax * 100) / 100,
    effectiveRate: Math.round((totalTax / annualIncome) * 10000) / 100,
    brackets: result
  };
}

// ============================================
// KİRA ARTIŞI HESAPLAMA
// ============================================

export function calculateRentIncrease(
  currentRent: number,
  tufeRate?: number
): {
  currentRent: number;
  maxIncreaseRate: number;
  maxNewRent: number;
  cappedRate?: number;
  cappedRent?: number;
  notes: string[];
} {
  const rate = tufeRate || LEGAL_CONSTANTS_2024.TUFE_ANNUAL;
  const maxNewRent = currentRent * (1 + rate);
  const notes: string[] = [];
  
  // 2024 yılı için %25 tavan uygulaması (konutlarda)
  const RENT_CAP_RATE = 0.25;
  const cappedRent = currentRent * (1 + RENT_CAP_RATE);
  
  if (rate > RENT_CAP_RATE) {
    notes.push(`TÜFE oranı (%${(rate * 100).toFixed(2)}) konut kira artış tavanını (%25) aşmaktadır.`);
    notes.push('Konut kiralarında %25 tavan uygulanır.');
  }
  
  notes.push('İşyeri kiralarında da geçici dönemde TÜFE sınırı uygulanmaktadır.');
  
  return {
    currentRent,
    maxIncreaseRate: rate,
    maxNewRent: Math.round(maxNewRent * 100) / 100,
    cappedRate: rate > RENT_CAP_RATE ? RENT_CAP_RATE : undefined,
    cappedRent: rate > RENT_CAP_RATE ? Math.round(cappedRent * 100) / 100 : undefined,
    notes
  };
}

// ============================================
// SÜRE HESAPLAMA
// ============================================

export function calculateDeadline(
  startDate: Date,
  periodDays?: number,
  periodWeeks?: number,
  periodMonths?: number,
  periodYears?: number,
  excludeWeekends?: boolean
): {
  startDate: Date;
  endDate: Date;
  totalDays: number;
  businessDays?: number;
  isWeekend: boolean;
  adjustedEndDate?: Date;
  notes: string[];
} {
  let totalDays = 0;
  if (periodDays) totalDays += periodDays;
  if (periodWeeks) totalDays += periodWeeks * 7;
  if (periodMonths) totalDays += periodMonths * 30; // Yaklaşık
  if (periodYears) totalDays += periodYears * 365;
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + totalDays);
  
  const notes: string[] = [];
  const dayOfWeek = endDate.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  let adjustedEndDate: Date | undefined;
  if (isWeekend) {
    adjustedEndDate = new Date(endDate);
    if (dayOfWeek === 6) adjustedEndDate.setDate(adjustedEndDate.getDate() + 2);
    if (dayOfWeek === 0) adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
    notes.push('Son gün hafta sonuna denk geldiği için pazartesiye uzar.');
  }
  
  let businessDays: number | undefined;
  if (excludeWeekends) {
    businessDays = 0;
    const current = new Date(startDate);
    while (current <= endDate) {
      const dow = current.getDay();
      if (dow !== 0 && dow !== 6) businessDays++;
      current.setDate(current.getDate() + 1);
    }
  }
  
  return {
    startDate,
    endDate,
    totalDays,
    businessDays,
    isWeekend,
    adjustedEndDate,
    notes
  };
}

// ============================================
// DAMGA VERGİSİ HESAPLAMA
// ============================================

export function calculateStampTax(
  amount: number,
  documentType: 'contract' | 'lease' | 'commitment' | 'receipt' | 'custom',
  customRate?: number
): {
  amount: number;
  rate: number;
  stampTax: number;
  ceiling: number;
  ceilingApplied: boolean;
  finalTax: number;
} {
  let rate: number;
  
  switch (documentType) {
    case 'contract':
      rate = LEGAL_CONSTANTS_2024.STAMP_TAX_CONTRACT;
      break;
    case 'lease':
      rate = LEGAL_CONSTANTS_2024.STAMP_TAX_LEASE;
      break;
    case 'commitment':
      rate = 0.00759; // Binde 7,59
      break;
    case 'receipt':
      rate = 0.00948;
      break;
    case 'custom':
      rate = customRate || 0;
      break;
    default:
      rate = LEGAL_CONSTANTS_2024.STAMP_TAX_CONTRACT;
  }
  
  const stampTax = amount * rate;
  const ceiling = LEGAL_CONSTANTS_2024.STAMP_TAX_CEILING;
  const ceilingApplied = stampTax > ceiling;
  const finalTax = ceilingApplied ? ceiling : stampTax;
  
  return {
    amount,
    rate,
    stampTax: Math.round(stampTax * 100) / 100,
    ceiling,
    ceilingApplied,
    finalTax: Math.round(finalTax * 100) / 100
  };
}

// ============================================
// İCRA FAİZİ HESAPLAMA (BİLEŞİK)
// ============================================

export function calculateEnforcementInterest(
  principal: number,
  startDate: Date,
  endDate: Date,
  isCommercial: boolean = false
): InterestCalculationResult & { interestType: string } {
  const rate = isCommercial 
    ? LEGAL_CONSTANTS_2024.COMMERCIAL_INTEREST_RATE 
    : LEGAL_CONSTANTS_2024.LEGAL_INTEREST_RATE;
  
  const result = calculateInterest({
    principal,
    annualRate: rate,
    startDate,
    endDate,
    isCommercial
  });
  
  return {
    ...result,
    interestType: isCommercial ? 'Ticari (Avans) Faiz' : 'Yasal Faiz'
  };
}

// ============================================
// TOPLU HESAPLAMA (İŞTEN ÇIKARMA)
// ============================================

export interface TerminationCalculationInput {
  startDate: Date;
  endDate: Date;
  grossSalary: number;
  reason: 'employer_without_cause' | 'employee_just_cause' | 'employee_without_cause' | 'mutual' | 'retirement';
  hasBonus?: boolean;
  bonusAmount?: number;
  unusedLeaveDays?: number;
}

export interface TerminationCalculationResult {
  severance: SeveranceCalculationResult | null;
  notice: NoticeCalculationResult | null;
  unusedLeaveCompensation: number;
  totalGross: number;
  totalNet: number;
  breakdown: Array<{ item: string; gross: number; net: number }>;
  notes: string[];
}

export function calculateTermination(input: TerminationCalculationInput): TerminationCalculationResult {
  const { reason, grossSalary, unusedLeaveDays } = input;
  const notes: string[] = [];
  const breakdown: Array<{ item: string; gross: number; net: number }> = [];
  
  let severance: SeveranceCalculationResult | null = null;
  let notice: NoticeCalculationResult | null = null;
  
  // Çalışma süresi hesapla
  const totalDays = Math.floor((input.endDate.getTime() - input.startDate.getTime()) / (1000 * 60 * 60 * 24));
  const yearsWorked = totalDays / 365;
  
  // Kıdem tazminatı hak edişi
  if (yearsWorked >= 1) {
    if (reason === 'employer_without_cause' || reason === 'employee_just_cause' || reason === 'retirement') {
      severance = calculateSeverance({
        startDate: input.startDate,
        endDate: input.endDate,
        grossSalary,
        hasBonus: input.hasBonus,
        bonusAmount: input.bonusAmount
      });
      breakdown.push({
        item: 'Kıdem Tazminatı',
        gross: severance.finalSeverance,
        net: severance.netSeverance
      });
    } else if (reason === 'employee_without_cause') {
      notes.push('İşçinin haklı neden olmaksızın istifasında kıdem tazminatı hakkı yoktur.');
    }
  } else {
    notes.push('1 yıldan az çalışma süresinde kıdem tazminatı hakkı yoktur.');
  }
  
  // İhbar tazminatı
  if (reason === 'employer_without_cause') {
    notice = calculateNoticeCompensation({ yearsWorked, grossSalary });
    breakdown.push({
      item: 'İhbar Tazminatı',
      gross: notice.grossNoticeCompensation,
      net: notice.netNoticeCompensation
    });
    notes.push(`İhbar süresi: ${notice.noticePeriodWeeks} hafta`);
  }
  
  // Kullanılmayan izin ücreti
  let unusedLeaveCompensation = 0;
  if (unusedLeaveDays && unusedLeaveDays > 0) {
    const dailyWage = grossSalary / 30;
    unusedLeaveCompensation = dailyWage * unusedLeaveDays;
    const tax = unusedLeaveCompensation * 0.15;
    const stamp = unusedLeaveCompensation * 0.00759;
    breakdown.push({
      item: 'Kullanılmayan İzin Ücreti',
      gross: unusedLeaveCompensation,
      net: unusedLeaveCompensation - tax - stamp
    });
  }
  
  const totalGross = breakdown.reduce((sum, item) => sum + item.gross, 0);
  const totalNet = breakdown.reduce((sum, item) => sum + item.net, 0);
  
  return {
    severance,
    notice,
    unusedLeaveCompensation,
    totalGross: Math.round(totalGross * 100) / 100,
    totalNet: Math.round(totalNet * 100) / 100,
    breakdown,
    notes
  };
}
