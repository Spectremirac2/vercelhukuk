"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ToolModal } from "./ToolModal";
import {
  estimateLegalCosts,
  getCaseTypeName,
  type CostEstimate,
  type CaseType,
} from "@/lib/legal-cost-estimator";
import { Calculator } from "lucide-react";

interface LegalCostEstimatorToolProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LegalCostEstimatorTool({ isOpen, onClose }: LegalCostEstimatorToolProps) {
  const [caseType, setCaseType] = useState<CaseType>("hukuk_davasi");
  const [disputeValue, setDisputeValue] = useState<number>(100000);
  const [complexity, setComplexity] = useState<"basit" | "orta" | "karmasik">("orta");
  const [includeAppeals, setIncludeAppeals] = useState(false);
  const [includeExecution, setIncludeExecution] = useState(false);
  const [expertRequired, setExpertRequired] = useState(false);
  const [result, setResult] = useState<CostEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"input" | "breakdown" | "timeline" | "scenarios">("input");

  const caseTypes: { value: CaseType; label: string }[] = [
    { value: "hukuk_davasi", label: "Hukuk Davası" },
    { value: "is_davasi", label: "İş Davası" },
    { value: "ticaret_davasi", label: "Ticaret Davası" },
    { value: "aile_davasi", label: "Aile Davası" },
    { value: "tuketici_davasi", label: "Tüketici Davası" },
    { value: "idari_dava", label: "İdari Dava" },
    { value: "ceza_davasi", label: "Ceza Davası" },
    { value: "icra_takibi", label: "İcra Takibi" },
  ];

  const handleEstimate = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const estimate = estimateLegalCosts(caseType, disputeValue, {
      complexity,
      includeAppeals,
      includeExecution,
      expertRequired,
      expertTypes: expertRequired ? ["mali_musavir"] : [],
    });

    setResult(estimate);
    setActiveTab("breakdown");
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProbabilityColor = (prob: string) => {
    switch (prob) {
      case "yuksek": return "bg-green-500/10 text-green-400 border-green-500/30";
      case "orta": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "dusuk": return "bg-gray-500/10 text-gray-400 border-gray-500/30";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <ToolModal
      isOpen={isOpen}
      onClose={onClose}
      title="Dava Maliyet Tahmini"
      description="Mahkeme harçları, avukatlık ücretleri ve diğer dava masraflarını hesaplayın"
      icon={<Calculator size={24} />}
      size="xl"
    >
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-lg">
        {[
          { id: "input", label: "Dava Bilgileri", icon: "📋" },
          { id: "breakdown", label: "Maliyet Dağılımı", icon: "💰", disabled: !result },
          { id: "timeline", label: "Ödeme Planı", icon: "📅", disabled: !result },
          { id: "scenarios", label: "Senaryolar", icon: "🎯", disabled: !result },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id as typeof activeTab)}
            disabled={tab.disabled}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                : tab.disabled
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input Tab */}
      {activeTab === "input" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Case Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Dava Türü
              </label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value as CaseType)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {caseTypes.map((type) => (
                  <option key={type.value} value={type.value} className="bg-gray-900">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dispute Value */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Dava Değeri (TL)
              </label>
              <input
                type="number"
                value={disputeValue}
                onChange={(e) => setDisputeValue(Number(e.target.value))}
                placeholder="100000"
                min={0}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <p className="text-xs text-gray-500">
                {formatCurrency(disputeValue)}
              </p>
            </div>
          </div>

          {/* Complexity */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Dava Karmaşıklığı
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "basit", label: "Basit", desc: "Standart süreç" },
                { value: "orta", label: "Orta", desc: "Bilirkişi gerekli" },
                { value: "karmasik", label: "Karmaşık", desc: "Çoklu taraf/uzman" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setComplexity(opt.value as typeof complexity)}
                  className={`p-4 rounded-xl border transition-all ${
                    complexity === opt.value
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-xs mt-1 opacity-70">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Ek Seçenekler
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                includeAppeals ? "bg-blue-500/20 border-blue-500/50" : "bg-white/5 border-white/10"
              }`}>
                <input
                  type="checkbox"
                  checked={includeAppeals}
                  onChange={(e) => setIncludeAppeals(e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-500"
                />
                <div>
                  <div className="text-sm font-medium text-gray-300">İstinaf/Temyiz</div>
                  <div className="text-xs text-gray-500">Kanun yolları dahil</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                includeExecution ? "bg-purple-500/20 border-purple-500/50" : "bg-white/5 border-white/10"
              }`}>
                <input
                  type="checkbox"
                  checked={includeExecution}
                  onChange={(e) => setIncludeExecution(e.target.checked)}
                  className="w-4 h-4 rounded accent-purple-500"
                />
                <div>
                  <div className="text-sm font-medium text-gray-300">İcra Takibi</div>
                  <div className="text-xs text-gray-500">Tahsilat masrafları</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                expertRequired ? "bg-orange-500/20 border-orange-500/50" : "bg-white/5 border-white/10"
              }`}>
                <input
                  type="checkbox"
                  checked={expertRequired}
                  onChange={(e) => setExpertRequired(e.target.checked)}
                  className="w-4 h-4 rounded accent-orange-500"
                />
                <div>
                  <div className="text-sm font-medium text-gray-300">Bilirkişi</div>
                  <div className="text-xs text-gray-500">Uzman raporu gerekli</div>
                </div>
              </label>
            </div>
          </div>

          <Button onClick={handleEstimate} disabled={loading} className="w-full">
            {loading ? (
              <>
                <span className="animate-spin mr-2">⚙️</span>
                Hesaplanıyor...
              </>
            ) : (
              <>
                💰 Maliyet Tahmini Hesapla
              </>
            )}
          </Button>
        </div>
      )}

      {/* Breakdown Tab */}
      {activeTab === "breakdown" && result && (
        <div className="space-y-6">
          {/* Total Estimate */}
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl p-6">
            <div className="text-center">
              <div className="text-sm text-emerald-400 mb-2">Beklenen Toplam Maliyet</div>
              <div className="text-4xl font-bold text-white mb-4">
                {formatCurrency(result.totalEstimate.expected)}
              </div>
              <div className="flex justify-center gap-6 text-sm">
                <div>
                  <span className="text-gray-400">Minimum:</span>
                  <span className="text-green-400 ml-2">{formatCurrency(result.totalEstimate.minimum)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Maksimum:</span>
                  <span className="text-red-400 ml-2">{formatCurrency(result.totalEstimate.maximum)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">⚖️</span>
                <span className="font-medium">Mahkeme Harçları</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">
                {formatCurrency(result.breakdown.courtFees.total)}
              </div>
              <div className="mt-2 space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Başvuru Harcı:</span>
                  <span>{formatCurrency(result.breakdown.courtFees.basvuruHarci)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Karar Harcı:</span>
                  <span>{formatCurrency(result.breakdown.courtFees.kararHarci)}</span>
                </div>
                {result.breakdown.courtFees.istinafHarci && (
                  <div className="flex justify-between">
                    <span>İstinaf Harcı:</span>
                    <span>{formatCurrency(result.breakdown.courtFees.istinafHarci)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">👨‍💼</span>
                <span className="font-medium">Avukatlık Ücreti</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">
                {formatCurrency(result.breakdown.attorneyFees.estimatedFee)}
              </div>
              <div className="mt-2 space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>AAÜT Minimum:</span>
                  <span>{formatCurrency(result.breakdown.attorneyFees.minimumFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tahmini Maks:</span>
                  <span>{formatCurrency(result.breakdown.attorneyFees.maximumFee)}</span>
                </div>
              </div>
            </div>

            {result.breakdown.expertFees.required && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🔬</span>
                  <span className="font-medium">Bilirkişi Ücreti</span>
                </div>
                <div className="text-2xl font-bold text-orange-400">
                  {formatCurrency(result.breakdown.expertFees.estimatedFee)}
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {result.breakdown.expertFees.numberOfExperts} bilirkişi raporu
                </div>
              </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📬</span>
                <span className="font-medium">Diğer Masraflar</span>
              </div>
              <div className="text-2xl font-bold text-gray-400">
                {formatCurrency(
                  result.breakdown.notificationCosts +
                  result.breakdown.travelCosts +
                  result.breakdown.documentCosts
                )}
              </div>
              <div className="mt-2 space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Tebligat:</span>
                  <span>{formatCurrency(result.breakdown.notificationCosts)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Yol/Ulaşım:</span>
                  <span>{formatCurrency(result.breakdown.travelCosts)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Belge:</span>
                  <span>{formatCurrency(result.breakdown.documentCosts)}</span>
                </div>
              </div>
            </div>

            {result.breakdown.executionCosts && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🏛️</span>
                  <span className="font-medium">İcra Masrafları</span>
                </div>
                <div className="text-2xl font-bold text-red-400">
                  {formatCurrency(result.breakdown.executionCosts.total)}
                </div>
              </div>
            )}
          </div>

          {/* Disclaimers */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-yellow-400">⚠️</span>
              <div className="text-sm text-yellow-200">
                <p className="font-medium mb-1">Uyarılar</p>
                <ul className="space-y-1 text-yellow-300/80 text-xs">
                  {result.disclaimers.map((d, i) => (
                    <li key={i}>• {d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === "timeline" && result && (
        <div className="space-y-4">
          {result.timeline.stages.map((stage, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-white">{stage.stage}</div>
                    <div className="text-xs text-gray-500">{stage.timing}</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-emerald-400">
                  {formatCurrency(stage.total)}
                </div>
              </div>

              <div className="space-y-2 ml-11">
                {stage.costs.map((cost, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-400">{cost.name}</span>
                    <span className="text-gray-300">{formatCurrency(cost.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {formatCurrency(result.timeline.totalUpfront)}
              </div>
              <div className="text-sm text-gray-400">Peşin Ödeme</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {formatCurrency(result.timeline.totalDuringProceeding)}
              </div>
              <div className="text-sm text-gray-400">Süreç Boyunca</div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {formatCurrency(result.timeline.totalAtConclusion)}
              </div>
              <div className="text-sm text-gray-400">Sonuçta</div>
            </div>
          </div>
        </div>
      )}

      {/* Scenarios Tab */}
      {activeTab === "scenarios" && result && (
        <div className="space-y-4">
          {result.scenarios.map((scenario, index) => (
            <div
              key={index}
              className={`p-5 rounded-xl border ${getProbabilityColor(scenario.probability)}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{scenario.name}</h3>
                  <p className="text-sm opacity-80 mt-1">{scenario.description}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10">
                  {scenario.probability === "yuksek" ? "Yüksek Olasılık" :
                   scenario.probability === "orta" ? "Orta Olasılık" : "Düşük Olasılık"}
                </span>
              </div>

              <div className="flex gap-6 mt-4">
                <div>
                  <div className="text-sm opacity-70">Toplam Maliyet</div>
                  <div className="text-2xl font-bold">{formatCurrency(scenario.totalCost)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-70">Tahmini Süre</div>
                  <div className="text-2xl font-bold">{scenario.duration}</div>
                </div>
                {scenario.additionalCosts > 0 && (
                  <div>
                    <div className="text-sm opacity-70">Ek Maliyet</div>
                    <div className="text-2xl font-bold">+{formatCurrency(scenario.additionalCosts)}</div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Assumptions */}
          <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 mt-6">
            <h4 className="font-medium mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
              <span>📝</span> Varsayımlar
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {result.assumptions.map((a, i) => (
                <li key={i}>• {a}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
    </ToolModal>
  );
}
