"use client";

import React, { useState } from "react";
import { ToolModal } from "./ToolModal";
import { 
  calculateSeverance, 
  calculateNoticeCompensation,
  calculateTermination,
  LEGAL_CONSTANTS_2024,
  SeveranceCalculationResult,
  NoticeCalculationResult
} from "@/lib/calculators/legal-calculators";
import { Calculator, Calendar, DollarSign, AlertCircle, CheckCircle, Info } from "lucide-react";
import { cn } from "@/utils/cn";

interface SeveranceCalculatorToolProps {
  isOpen: boolean;
  onClose: () => void;
}

type TerminationReason = 'employer_without_cause' | 'employee_just_cause' | 'employee_without_cause' | 'mutual' | 'retirement';

const TERMINATION_REASONS: { value: TerminationReason; label: string; description: string }[] = [
  { 
    value: 'employer_without_cause', 
    label: 'İşveren Feshi (Haklı Nedensiz)', 
    description: 'İşveren iş sözleşmesini haklı neden olmadan feshetti'
  },
  { 
    value: 'employee_just_cause', 
    label: 'İşçi Feshi (Haklı Nedenle)', 
    description: 'İşçi iş sözleşmesini haklı nedenle feshetti'
  },
  { 
    value: 'employee_without_cause', 
    label: 'İşçi İstifası', 
    description: 'İşçi haklı neden olmadan istifa etti'
  },
  { 
    value: 'retirement', 
    label: 'Emeklilik', 
    description: 'İşçi emeklilik nedeniyle ayrıldı'
  },
  { 
    value: 'mutual', 
    label: 'Karşılıklı Anlaşma (İkale)', 
    description: 'Taraflar karşılıklı anlaşarak sözleşmeyi sona erdirdi'
  },
];

export function SeveranceCalculatorTool({ isOpen, onClose }: SeveranceCalculatorToolProps) {
  // Form state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [grossSalary, setGrossSalary] = useState("");
  const [terminationReason, setTerminationReason] = useState<TerminationReason>("employer_without_cause");
  const [hasBonus, setHasBonus] = useState(false);
  const [bonusAmount, setBonusAmount] = useState("");
  const [unusedLeaveDays, setUnusedLeaveDays] = useState("");
  const [hasFoodAllowance, setHasFoodAllowance] = useState(false);
  const [foodAllowance, setFoodAllowance] = useState("");
  const [hasTransportAllowance, setHasTransportAllowance] = useState(false);
  const [transportAllowance, setTransportAllowance] = useState("");
  
  // Result state
  const [result, setResult] = useState<{
    severance: SeveranceCalculationResult | null;
    notice: NoticeCalculationResult | null;
    unusedLeaveCompensation: number;
    totalGross: number;
    totalNet: number;
    breakdown: Array<{ item: string; gross: number; net: number }>;
    notes: string[];
  } | null>(null);
  
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    setResult(null);
    
    if (!startDate || !endDate || !grossSalary) {
      setError("Lütfen zorunlu alanları doldurun");
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const salary = parseFloat(grossSalary);
    
    if (isNaN(salary) || salary <= 0) {
      setError("Geçerli bir maaş tutarı girin");
      return;
    }
    
    if (end <= start) {
      setError("Bitiş tarihi başlangıç tarihinden sonra olmalıdır");
      return;
    }
    
    try {
      const calcResult = calculateTermination({
        startDate: start,
        endDate: end,
        grossSalary: salary,
        reason: terminationReason,
        hasBonus,
        bonusAmount: hasBonus ? parseFloat(bonusAmount) || 0 : undefined,
        unusedLeaveDays: parseInt(unusedLeaveDays) || 0
      });
      
      // Ek menfaatlerle yeniden hesapla
      if ((hasFoodAllowance || hasTransportAllowance) && calcResult.severance) {
        const severanceResult = calculateSeverance({
          startDate: start,
          endDate: end,
          grossSalary: salary,
          hasBonus,
          bonusAmount: hasBonus ? parseFloat(bonusAmount) || 0 : undefined,
          hasFoodAllowance,
          foodAllowanceMonthly: hasFoodAllowance ? parseFloat(foodAllowance) || 0 : undefined,
          hasTransportAllowance,
          transportAllowanceMonthly: hasTransportAllowance ? parseFloat(transportAllowance) || 0 : undefined
        });
        
        calcResult.severance = severanceResult;
        
        // Breakdown'ı güncelle
        const severanceIndex = calcResult.breakdown.findIndex(b => b.item === 'Kıdem Tazminatı');
        if (severanceIndex >= 0) {
          calcResult.breakdown[severanceIndex] = {
            item: 'Kıdem Tazminatı',
            gross: severanceResult.finalSeverance,
            net: severanceResult.netSeverance
          };
        }
        
        calcResult.totalGross = calcResult.breakdown.reduce((sum, item) => sum + item.gross, 0);
        calcResult.totalNet = calcResult.breakdown.reduce((sum, item) => sum + item.net, 0);
      }
      
      setResult(calcResult);
    } catch {
      setError("Hesaplama sırasında bir hata oluştu");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { 
      style: 'currency', 
      currency: 'TRY',
      minimumFractionDigits: 2 
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <ToolModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Kıdem ve İhbar Tazminatı Hesaplama"
      size="xl"
    >
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-800 dark:text-blue-200">2024 Yasal Değerler</p>
            <p className="text-blue-700 dark:text-blue-300 mt-1">
              Kıdem Tazminatı Tavanı: {formatCurrency(LEGAL_CONSTANTS_2024.SEVERANCE_CEILING)} • 
              Asgari Ücret (Brüt): {formatCurrency(LEGAL_CONSTANTS_2024.MINIMUM_WAGE_GROSS)}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-4">
            {/* İşe Başlama Tarihi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                İşe Başlama Tarihi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* İşten Ayrılma Tarihi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                İşten Ayrılma Tarihi <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Brüt Maaş */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Brüt Aylık Maaş (TL) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(e.target.value)}
                  placeholder="Örn: 25000"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Fesih Nedeni */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Fesih Nedeni
              </label>
              <select
                value={terminationReason}
                onChange={(e) => setTerminationReason(e.target.value as TerminationReason)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {TERMINATION_REASONS.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {TERMINATION_REASONS.find(r => r.value === terminationReason)?.description}
              </p>
            </div>

            {/* Kullanılmayan İzin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Kullanılmayan Yıllık İzin (Gün)
              </label>
              <input
                type="number"
                value={unusedLeaveDays}
                onChange={(e) => setUnusedLeaveDays(e.target.value)}
                placeholder="Örn: 14"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Ek Menfaatler */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Ek Menfaatler</h4>
              
              {/* İkramiye */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hasBonus"
                  checked={hasBonus}
                  onChange={(e) => setHasBonus(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="hasBonus" className="text-sm text-gray-600 dark:text-gray-400">
                  Yıllık İkramiye
                </label>
                {hasBonus && (
                  <input
                    type="number"
                    value={bonusAmount}
                    onChange={(e) => setBonusAmount(e.target.value)}
                    placeholder="Yıllık tutar"
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                )}
              </div>

              {/* Yemek Yardımı */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hasFoodAllowance"
                  checked={hasFoodAllowance}
                  onChange={(e) => setHasFoodAllowance(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="hasFoodAllowance" className="text-sm text-gray-600 dark:text-gray-400">
                  Yemek Yardımı
                </label>
                {hasFoodAllowance && (
                  <input
                    type="number"
                    value={foodAllowance}
                    onChange={(e) => setFoodAllowance(e.target.value)}
                    placeholder="Aylık tutar"
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                )}
              </div>

              {/* Yol Yardımı */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="hasTransportAllowance"
                  checked={hasTransportAllowance}
                  onChange={(e) => setHasTransportAllowance(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="hasTransportAllowance" className="text-sm text-gray-600 dark:text-gray-400">
                  Yol Yardımı
                </label>
                {hasTransportAllowance && (
                  <input
                    type="number"
                    value={transportAllowance}
                    onChange={(e) => setTransportAllowance(e.target.value)}
                    placeholder="Aylık tutar"
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Calculator className="w-5 h-5" />
              Hesapla
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {result ? (
              <>
                {/* Çalışma Süresi */}
                {result.severance && (
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Çalışma Süresi</h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {result.severance.yearsWorked} yıl {result.severance.monthsWorked} ay {result.severance.daysWorked} gün
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Toplam {result.severance.totalDays} gün
                    </p>
                  </div>
                )}

                {/* Toplam Sonuç */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                  <h4 className="text-sm font-medium text-emerald-100">Toplam Net Alacak</h4>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(result.totalNet)}</p>
                  <p className="text-sm text-emerald-200 mt-1">
                    Brüt: {formatCurrency(result.totalGross)}
                  </p>
                </div>

                {/* Kalem Detayları */}
                <div className="space-y-2">
                  {result.breakdown.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.item}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Brüt: {formatCurrency(item.gross)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(item.net)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Net</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Kıdem Tazminatı Detayları */}
                {result.severance && (
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Kıdem Tazminatı Detayları</h4>
                    
                    {result.severance.appliedCeiling && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                          Tavan uygulandı: Maaş tavanı ({formatCurrency(result.severance.severanceCeiling)}) aşıldığı için tavan üzerinden hesaplandı
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Günlük Ücret</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(result.severance.dailyWithBenefits)}
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Damga Vergisi</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(result.severance.stampTax)}
                        </p>
                      </div>
                    </div>

                    {result.severance.breakdown.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hesaplamaya Dahil Edilen:</p>
                        <div className="flex flex-wrap gap-1">
                          {result.severance.breakdown.map((item, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                              {item.item}: {formatCurrency(item.amount)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* İhbar Tazminatı Detayları */}
                {result.notice && (
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">İhbar Tazminatı Detayları</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400">İhbar Süresi</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {result.notice.noticePeriodWeeks} hafta ({result.notice.noticePeriodDays} gün)
                        </p>
                      </div>
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Günlük Ücret</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(result.notice.dailyWage)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notlar */}
                {result.notes.length > 0 && (
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Önemli Notlar</h4>
                    <ul className="space-y-1">
                      {result.notes.map((note, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300">
                          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <Calculator className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Hesaplama Sonuçları
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                  Formu doldurup &quot;Hesapla&quot; butonuna tıkladığınızda sonuçlar burada görüntülenecek
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center p-4 border-t border-gray-200 dark:border-gray-700">
          Bu hesaplama tahmini bir sonuç sunar ve hukuki tavsiye niteliği taşımaz. 
          Kesin hesaplama için bir iş hukuku avukatına danışmanız önerilir.
        </div>
      </div>
    </ToolModal>
  );
}
