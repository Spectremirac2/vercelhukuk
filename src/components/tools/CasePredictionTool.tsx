"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ToolModal, ToolSection, ToolResult, ToolResultGrid } from "./ToolModal";
import {
  predictOutcome,
  CaseFacts,
  CaseType,
  LegalArea,
  PredictionResult,
  PredictedOutcome,
} from "@/lib/case-prediction";
import {
  TrendingUp,
  Scale,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  ChevronRight,
  Gavel,
  Target,
  Info,
} from "lucide-react";

/**
 * CasePredictionTool - Dava sonuç tahmini aracı
 */
interface CasePredictionToolProps {
  isOpen: boolean;
  onClose: () => void;
}

const caseTypes: Array<{ id: CaseType; name: string; icon: React.ReactNode }> = [
  { id: "alacak", name: "Alacak Davası", icon: <Scale size={18} /> },
  { id: "tazminat", name: "Tazminat Davası", icon: <AlertTriangle size={18} /> },
  { id: "ise_iade", name: "İşe İade", icon: <Users size={18} /> },
  { id: "bosanma", name: "Boşanma", icon: <Users size={18} /> },
  { id: "kira", name: "Kira Davası", icon: <FileText size={18} /> },
  { id: "tapu_iptal", name: "Tapu İptal", icon: <FileText size={18} /> },
  { id: "miras", name: "Miras Davası", icon: <Users size={18} /> },
  { id: "icra", name: "İcra Davası", icon: <Gavel size={18} /> },
  { id: "ceza", name: "Ceza Davası", icon: <Gavel size={18} /> },
  { id: "idari", name: "İdari Dava", icon: <Scale size={18} /> },
];

const legalAreas: Array<{ id: LegalArea; name: string }> = [
  { id: "is_hukuku", name: "İş Hukuku" },
  { id: "borclar", name: "Borçlar Hukuku" },
  { id: "aile", name: "Aile Hukuku" },
  { id: "ticaret", name: "Ticaret Hukuku" },
  { id: "esya", name: "Eşya Hukuku" },
  { id: "miras", name: "Miras Hukuku" },
  { id: "ceza", name: "Ceza Hukuku" },
  { id: "idare", name: "İdare Hukuku" },
  { id: "vergi", name: "Vergi Hukuku" },
  { id: "tuketici", name: "Tüketici Hukuku" },
];

const outcomeLabels: Record<PredictedOutcome, string> = {
  kabul: "Kabul",
  kismi_kabul: "Kısmi Kabul",
  red: "Red",
  dusme: "Düşme",
  feragat: "Feragat",
  sulh: "Sulh",
  belirsiz: "Belirsiz",
};

const outcomeColors: Record<PredictedOutcome, string> = {
  kabul: "#22c55e",
  kismi_kabul: "#84cc16",
  red: "#ef4444",
  dusme: "#94a3b8",
  feragat: "#64748b",
  sulh: "#3b82f6",
  belirsiz: "#94a3b8",
};

export function CasePredictionTool({ isOpen, onClose }: CasePredictionToolProps) {
  const [step, setStep] = useState(1);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Form state
  const [formData, setFormData] = useState<{
    caseType: CaseType | "";
    legalArea: LegalArea | "";
    facts: string;
    claimAmount: string;
    evidenceStrength: "strong" | "moderate" | "weak";
    hasLawyer: boolean;
    defendantType: "gercek_kisi" | "tuzel_kisi" | "kamu_kurumu";
  }>({
    caseType: "",
    legalArea: "",
    facts: "",
    claimAmount: "",
    evidenceStrength: "moderate",
    hasLawyer: true,
    defendantType: "gercek_kisi",
  });

  /**
   * Form güncelle
   */
  const updateForm = useCallback(<K extends keyof typeof formData>(
    key: K,
    value: typeof formData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  /**
   * Tahmin yap
   */
  const handlePredict = useCallback(async () => {
    if (!formData.caseType || !formData.legalArea) return;

    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2000));

    try {
      const caseFacts: CaseFacts = {
        caseType: formData.caseType as CaseType,
        legalArea: formData.legalArea as LegalArea,
        facts: formData.facts.split("\n").filter(Boolean),
        claimAmount: formData.claimAmount ? parseFloat(formData.claimAmount) : undefined,
        parties: {
          plaintiff: {
            type: "gercek_kisi",
            hasLawyer: formData.hasLawyer,
          },
          defendant: {
            type: formData.defendantType,
            hasLawyer: true,
          },
        },
        timeline: [],
        evidence: [
          {
            type: "yazili",
            description: "Genel delil",
            strength: formData.evidenceStrength === "strong" ? 0.8 : formData.evidenceStrength === "moderate" ? 0.5 : 0.3,
          },
        ],
      };

      const result = predictOutcome(caseFacts);
      setPrediction(result);
      setStep(3);
    } catch (error) {
      console.error("Tahmin hatası:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [formData]);

  /**
   * Sıfırla
   */
  const handleReset = useCallback(() => {
    setStep(1);
    setPrediction(null);
    setFormData({
      caseType: "",
      legalArea: "",
      facts: "",
      claimAmount: "",
      evidenceStrength: "moderate",
      hasLawyer: true,
      defendantType: "gercek_kisi",
    });
  }, []);

  return (
    <ToolModal
      isOpen={isOpen}
      onClose={onClose}
      title="Dava Sonuç Tahmini"
      description="AI destekli dava sonucu olasılık analizi"
      icon={<TrendingUp size={24} />}
      size="xl"
    >
      {/* Progress indicator */}
      {!prediction && (
        <div className="flex items-center justify-center mb-8">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                  step >= s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                )}
              >
                {s}
              </div>
              {s < 2 && (
                <div
                  className={cn(
                    "w-20 h-1 mx-2 rounded-full transition-all",
                    step > s ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Step 1: Case Type Selection */}
      {step === 1 && (
        <div className="animate-fade-in">
          <ToolSection
            title="Dava Türü ve Hukuk Alanı"
            description="Dava türü ve ilgili hukuk alanını seçin"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Dava Türü *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {caseTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => updateForm("caseType", type.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
                        formData.caseType === type.id
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500"
                          : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      {type.icon}
                      <span className="text-xs font-medium text-center">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Hukuk Alanı *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {legalAreas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => updateForm("legalArea", area.id)}
                      className={cn(
                        "px-3 py-2 rounded-xl text-sm font-medium transition-all",
                        formData.legalArea === area.id
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500"
                          : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      {area.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ToolSection>

          <div className="flex justify-end mt-6">
            <Button
              variant="primary"
              icon={<ChevronRight size={18} />}
              iconPosition="right"
              onClick={() => setStep(2)}
              disabled={!formData.caseType || !formData.legalArea}
            >
              Devam
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Case Details */}
      {step === 2 && (
        <div className="animate-fade-in">
          <ToolSection
            title="Dava Detayları"
            description="Dava ile ilgili detayları girin"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dava Konusu ve Vakıalar
                </label>
                <textarea
                  value={formData.facts}
                  onChange={(e) => updateForm("facts", e.target.value)}
                  placeholder="Dava konusunu ve önemli vakıaları kısaca açıklayın...

Örnek:
- İşe giriş: 01.01.2020
- Fesih: 15.06.2024
- Fesih sebebi: Performans yetersizliği
- Yazılı uyarı: Yok"
                  className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Talep Miktarı (TL)
                  </label>
                  <input
                    type="number"
                    value={formData.claimAmount}
                    onChange={(e) => updateForm("claimAmount", e.target.value)}
                    placeholder="Örn: 100000"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Delil Gücü
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "strong", label: "Güçlü" },
                      { id: "moderate", label: "Orta" },
                      { id: "weak", label: "Zayıf" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => updateForm("evidenceStrength", opt.id as typeof formData.evidenceStrength)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                          formData.evidenceStrength === opt.id
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Avukat Temsili
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: true, label: "Var" },
                      { id: false, label: "Yok" },
                    ].map((opt) => (
                      <button
                        key={String(opt.id)}
                        onClick={() => updateForm("hasLawyer", opt.id)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                          formData.hasLawyer === opt.id
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Davalı Türü
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "gercek_kisi", label: "Gerçek Kişi" },
                      { id: "tuzel_kisi", label: "Tüzel Kişi" },
                      { id: "kamu_kurumu", label: "Kamu" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => updateForm("defendantType", opt.id as typeof formData.defendantType)}
                        className={cn(
                          "px-3 py-2 rounded-lg text-xs font-medium transition-all",
                          formData.defendantType === opt.id
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ToolSection>

          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={() => setStep(1)}>
              Geri
            </Button>
            <Button
              variant="primary"
              icon={<Target size={18} />}
              onClick={handlePredict}
              loading={isAnalyzing}
            >
              Tahmin Et
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {prediction && (
        <div className="animate-fade-in space-y-6">
          {/* Main prediction */}
          <Card variant="elevated" padding="lg" className="text-center">
            <div className="mb-4">
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
                style={{ backgroundColor: `${outcomeColors[prediction.outcome]}20` }}
              >
                {prediction.outcome === "kabul" && <CheckCircle size={40} style={{ color: outcomeColors[prediction.outcome] }} />}
                {prediction.outcome === "kismi_kabul" && <Target size={40} style={{ color: outcomeColors[prediction.outcome] }} />}
                {prediction.outcome === "red" && <XCircle size={40} style={{ color: outcomeColors[prediction.outcome] }} />}
                {["dusme", "feragat", "sulh", "belirsiz"].includes(prediction.outcome) && (
                  <Scale size={40} style={{ color: outcomeColors[prediction.outcome] }} />
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {outcomeLabels[prediction.outcome]}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Güven: %{Math.round(prediction.confidence * 100)}
              </p>
            </div>

            {/* Probability bars */}
            <div className="space-y-3 max-w-md mx-auto">
              {Object.entries(prediction.probabilities)
                .sort(([, a], [, b]) => b - a)
                .map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        {outcomeLabels[key as PredictedOutcome]}
                      </span>
                      <span className="font-medium" style={{ color: outcomeColors[key as PredictedOutcome] }}>
                        %{Math.round(value * 100)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${value * 100}%`,
                          backgroundColor: outcomeColors[key as PredictedOutcome],
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* Key factors */}
          {prediction.keyFactors.length > 0 && (
            <ToolSection title="Etkileyen Faktörler">
              <div className="space-y-2">
                {prediction.keyFactors.map((factor, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl",
                      factor.impact === "positive" && "bg-emerald-50 dark:bg-emerald-900/20",
                      factor.impact === "negative" && "bg-red-50 dark:bg-red-900/20",
                      factor.impact === "neutral" && "bg-gray-50 dark:bg-gray-800"
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                        factor.impact === "positive" && "bg-emerald-500 text-white",
                        factor.impact === "negative" && "bg-red-500 text-white",
                        factor.impact === "neutral" && "bg-gray-400 text-white"
                      )}
                    >
                      {factor.impact === "positive" && <TrendingUp size={12} />}
                      {factor.impact === "negative" && <AlertTriangle size={12} />}
                      {factor.impact === "neutral" && <Info size={12} />}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {factor.factor}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {factor.explanation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ToolSection>
          )}

          {/* Time and cost estimate */}
          <ToolResultGrid>
            <ToolResult title="Tahmini Süre" status="info">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-blue-500" />
                <span className="text-lg font-semibold">
                  {prediction.riskAssessment.timeEstimate.minMonths} - {prediction.riskAssessment.timeEstimate.maxMonths} ay
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Ortalama: {prediction.riskAssessment.timeEstimate.averageMonths} ay
              </p>
            </ToolResult>

            {prediction.riskAssessment.costEstimate && (
              <ToolResult title="Tahmini Maliyet" status="info">
                <div className="text-lg font-semibold">
                  ₺{prediction.riskAssessment.costEstimate.minCost.toLocaleString("tr-TR")} - ₺{prediction.riskAssessment.costEstimate.maxCost.toLocaleString("tr-TR")}
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-xs">
                  {prediction.riskAssessment.costEstimate.factors.join(", ")}
                </p>
              </ToolResult>
            )}
          </ToolResultGrid>

          {/* Recommendations */}
          {prediction.recommendations.length > 0 && (
            <ToolSection title="Öneriler">
              <div className="space-y-2">
                {prediction.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl"
                  >
                    <ChevronRight size={16} className="mt-0.5 text-amber-600 shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{rec}</span>
                  </div>
                ))}
              </div>
            </ToolSection>
          )}

          {/* Disclaimer */}
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm text-gray-500 dark:text-gray-400">
            <strong>Uyarı:</strong> {prediction.disclaimer}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleReset}>
              Yeni Tahmin
            </Button>
          </div>
        </div>
      )}
    </ToolModal>
  );
}
