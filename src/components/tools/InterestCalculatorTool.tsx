"use client";

import React, { useState } from "react";
import { ToolModal } from "./ToolModal";
import { 
  calculateInterest, 
  calculateEnforcementInterest,
  LEGAL_CONSTANTS_2024,
  InterestCalculationResult
} from "@/lib/calculators/legal-calculators";
import { Calculator, Calendar, DollarSign, AlertCircle, Info, TrendingUp, Percent } from "lucide-react";
import { cn } from "@/utils/cn";

interface InterestCalculatorToolProps {
  isOpen: boolean;
  onClose: () => void;
}

type InterestType = 'legal' | 'commercial' | 'custom';

const INTEREST_TYPES: { value: InterestType; label: string; rate: number; description: string }[] = [
  { 
    value: 'legal', 
    label: 'Yasal Faiz', 
    rate: LEGAL_CONSTANTS_2024.LEGAL_INTEREST_RATE * 100,
    description: 'TBK ve 3095 sayılı Kanun kapsamında uygulanan faiz'
  },
  { 
    value: 'commercial', 
    label: 'Ticari (Avans) Faiz', 
    rate: LEGAL_CONSTANTS_2024.COMMERCIAL_INTEREST_RATE * 100,
    description: 'Ticari işlerde uygulanan avans faizi oranı'
  },
  { 
    value: 'custom', 
    label: 'Özel Faiz Oranı', 
    rate: 0,
    description: 'Sözleşmeyle kararlaştırılmış faiz oranı'
  },
];

export function InterestCalculatorTool({ isOpen, onClose }: InterestCalculatorToolProps) {
  // Form state
  const [principal, setPrincipal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [interestType, setInterestType] = useState<InterestType>("legal");
  const [customRate, setCustomRate] = useState("");
  
  // Result state
  const [result, setResult] = useState<InterestCalculationResult | null>(null);
  const [error, setError] = useState("");

  // Calculate interest for period display
  const [periodResults, setPeriodResults] = useState<{
    yearly: number;
    monthly: number;
    daily: number;
  } | null>(null);

  const handleCalculate = () => {
    setError("");
    setResult(null);
    setPeriodResults(null);
    
    if (!principal || !startDate || !endDate) {
      setError("Lütfen zorunlu alanları doldurun");
      return;
    }
    
    const principalAmount = parseFloat(principal);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(principalAmount) || principalAmount <= 0) {
      setError("Geçerli bir ana para tutarı girin");
      return;
    }
    
    if (end <= start) {
      setError("Bitiş tarihi başlangıç tarihinden sonra olmalıdır");
      return;
    }

    if (interestType === 'custom' && (!customRate || parseFloat(customRate) <= 0)) {
      setError("Özel faiz oranı belirtmelisiniz");
      return;
    }
    
    try {
      let rate: number;
      
      if (interestType === 'legal') {
        rate = LEGAL_CONSTANTS_2024.LEGAL_INTEREST_RATE;
      } else if (interestType === 'commercial') {
        rate = LEGAL_CONSTANTS_2024.COMMERCIAL_INTEREST_RATE;
      } else {
        rate = parseFloat(customRate) / 100;
      }

      const calcResult = calculateInterest({
        principal: principalAmount,
        annualRate: rate,
        startDate: start,
        endDate: end,
        isCommercial: interestType === 'commercial'
      });
      
      setResult(calcResult);

      // Calculate period-based interests
      const yearly = principalAmount * rate;
      const monthly = yearly / 12;
      const daily = yearly / 365;
      
      setPeriodResults({
        yearly: Math.round(yearly * 100) / 100,
        monthly: Math.round(monthly * 100) / 100,
        daily: Math.round(daily * 100) / 100
      });

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

  const selectedType = INTEREST_TYPES.find(t => t.value === interestType);

  return (
    <ToolModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Faiz Hesaplama"
      size="lg"
    >
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-amber-800 dark:text-amber-200">2024 Güncel Faiz Oranları</p>
            <div className="mt-1 grid grid-cols-2 gap-2 text-amber-700 dark:text-amber-300">
              <span>Yasal Faiz: %{(LEGAL_CONSTANTS_2024.LEGAL_INTEREST_RATE * 100).toFixed(0)}</span>
              <span>Ticari Faiz: %{(LEGAL_CONSTANTS_2024.COMMERCIAL_INTEREST_RATE * 100).toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-4">
            {/* Ana Para */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Ana Para (TL) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="Örn: 100000"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Başlangıç Tarihi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Başlangıç Tarihi <span className="text-red-500">*</span>
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Temerrüt veya alacağın muaccel olduğu tarih
              </p>
            </div>

            {/* Bitiş Tarihi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Bitiş Tarihi <span className="text-red-500">*</span>
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Hesaplamanın yapıldığı tarih (ödeme veya bugün)
              </p>
            </div>

            {/* Faiz Türü */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Faiz Türü
              </label>
              <div className="space-y-2">
                {INTEREST_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
                      interestType === type.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="interestType"
                      value={type.value}
                      checked={interestType === type.value}
                      onChange={(e) => setInterestType(e.target.value as InterestType)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">{type.label}</span>
                        {type.rate > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                            %{type.rate}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{type.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Özel Faiz Oranı */}
            {interestType === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Özel Faiz Oranı (%) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                    placeholder="Örn: 35"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

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
                {/* Toplam Sonuç */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <div className="flex items-center gap-2 text-blue-100 mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Toplam Alacak (Ana Para + Faiz)</span>
                  </div>
                  <p className="text-3xl font-bold">{formatCurrency(result.total)}</p>
                </div>

                {/* Ana Detaylar */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ana Para</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(result.principal)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">İşlemiş Faiz</p>
                    <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                      {formatCurrency(result.interest)}
                    </p>
                  </div>
                </div>

                {/* Süre Bilgisi */}
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Süre Bilgisi</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Toplam Gün</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{result.totalDays} gün</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{result.breakdown.years} yıl</span>
                    <span>•</span>
                    <span>{result.breakdown.months} ay</span>
                    <span>•</span>
                    <span>{result.breakdown.days} gün</span>
                  </div>
                </div>

                {/* Faiz Oranı Bilgisi */}
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Uygulanan Faiz</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Yıllık Faiz Oranı</span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      %{(result.annualRate * 100).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Dönemsel Faiz Bilgisi */}
                {periodResults && (
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Dönemsel Faiz (Ana Para Üzerinden)</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Yıllık Faiz</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(periodResults.yearly)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Aylık Faiz</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(periodResults.monthly)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Günlük Faiz</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(periodResults.daily)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Yasal Bilgi */}
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Yasal Dayanak</h4>
                  <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                    {interestType === 'legal' && (
                      <>
                        <li>• 3095 sayılı Kanuni Faiz ve Temerrüt Faizine İlişkin Kanun</li>
                        <li>• TBK m. 88 (Faiz)</li>
                        <li>• TBK m. 117-120 (Temerrüt)</li>
                      </>
                    )}
                    {interestType === 'commercial' && (
                      <>
                        <li>• 3095 sayılı Kanun m. 2 (Ticari İşlerde Faiz)</li>
                        <li>• TTK m. 8-9 (Ticari Faiz)</li>
                        <li>• T.C. Merkez Bankası Avans Faiz Oranı</li>
                      </>
                    )}
                    {interestType === 'custom' && (
                      <>
                        <li>• TBK m. 88 (Sözleşme ile faiz belirleme)</li>
                        <li>• Aşırı yüksek oranlar tenkise tabi olabilir</li>
                      </>
                    )}
                  </ul>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Faiz Hesaplama Sonuçları
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                  Ana para, tarih aralığı ve faiz türünü seçerek hesaplama yapabilirsiniz
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center p-4 border-t border-gray-200 dark:border-gray-700">
          Bu hesaplama basit faiz yöntemiyle yapılmıştır. Bileşik faiz veya değişken oranlı hesaplamalar için 
          profesyonel destek alınması önerilir.
        </div>
      </div>
    </ToolModal>
  );
}
