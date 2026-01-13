"use client";

import React, { useState } from "react";
import {
  predictOutcome,
  getCaseTypeStats,
  CaseFacts,
  CaseType,
  LegalArea,
  PredictionResult,
  Evidence,
} from "@/lib/case-prediction";

interface CasePredictionPanelProps {
  onClose?: () => void;
  initialFacts?: Partial<CaseFacts>;
}

const CASE_TYPES: { value: CaseType; label: string }[] = [
  { value: "alacak", label: "Alacak Davası" },
  { value: "tazminat", label: "Tazminat Davası" },
  { value: "ise_iade", label: "İşe İade Davası" },
  { value: "bosanma", label: "Boşanma Davası" },
  { value: "tapu_iptal", label: "Tapu İptal Davası" },
  { value: "miras", label: "Miras Davası" },
  { value: "kira", label: "Kira Davası" },
  { value: "icra", label: "İcra Davası" },
  { value: "ceza", label: "Ceza Davası" },
  { value: "idari", label: "İdari Dava" },
];

const LEGAL_AREAS: { value: LegalArea; label: string }[] = [
  { value: "is_hukuku", label: "İş Hukuku" },
  { value: "borclar", label: "Borçlar Hukuku" },
  { value: "aile", label: "Aile Hukuku" },
  { value: "ticaret", label: "Ticaret Hukuku" },
  { value: "esya", label: "Eşya Hukuku" },
  { value: "miras", label: "Miras Hukuku" },
  { value: "ceza", label: "Ceza Hukuku" },
  { value: "idare", label: "İdare Hukuku" },
  { value: "vergi", label: "Vergi Hukuku" },
  { value: "tuketici", label: "Tüketici Hukuku" },
];

export function CasePredictionPanel({
  onClose,
  initialFacts,
}: CasePredictionPanelProps) {
  const [caseType, setCaseType] = useState<CaseType>(
    initialFacts?.caseType || "alacak"
  );
  const [legalArea, setLegalArea] = useState<LegalArea>(
    initialFacts?.legalArea || "borclar"
  );
  const [facts, setFacts] = useState<string>(
    initialFacts?.facts?.join("\n") || ""
  );
  const [claimAmount, setClaimAmount] = useState<string>("");
  const [hasLawyer, setHasLawyer] = useState(true);
  const [defendantType, setDefendantType] = useState<
    "gercek_kisi" | "tuzel_kisi" | "kamu_kurumu"
  >("gercek_kisi");
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [newEvidence, setNewEvidence] = useState({
    type: "yazili" as Evidence["type"],
    description: "",
    strength: 0.7,
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAddEvidence = () => {
    if (newEvidence.description.trim()) {
      setEvidenceList([...evidenceList, { ...newEvidence }]);
      setNewEvidence({ type: "yazili", description: "", strength: 0.7 });
    }
  };

  const handleRemoveEvidence = (index: number) => {
    setEvidenceList(evidenceList.filter((_, i) => i !== index));
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);

    const caseFacts: CaseFacts = {
      caseType,
      legalArea,
      facts: facts.split("\n").filter((f) => f.trim()),
      claimAmount: claimAmount ? parseFloat(claimAmount) : undefined,
      parties: {
        plaintiff: {
          type: "gercek_kisi",
          hasLawyer,
        },
        defendant: {
          type: defendantType,
          hasLawyer: true,
        },
      },
      timeline: [],
      evidence: evidenceList,
    };

    // Simulate analysis delay
    setTimeout(() => {
      const result = predictOutcome(caseFacts);
      setPrediction(result);
      setIsAnalyzing(false);
    }, 1000);
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "kabul":
        return "text-green-600 dark:text-green-400";
      case "kismi_kabul":
        return "text-yellow-600 dark:text-yellow-400";
      case "red":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getOutcomeLabel = (outcome: string) => {
    const labels: Record<string, string> = {
      kabul: "Kabul",
      kismi_kabul: "Kısmi Kabul",
      red: "Red",
      dusme: "Düşme",
      sulh: "Sulh",
      belirsiz: "Belirsiz",
    };
    return labels[outcome] || outcome;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const caseStats = getCaseTypeStats(caseType);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Dava Sonucu Tahmini
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Yapay zeka destekli dava analizi
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Case Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dava Türü
            </label>
            <select
              value={caseType}
              onChange={(e) => setCaseType(e.target.value as CaseType)}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {CASE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Ortalama kabul oranı: %{Math.round(caseStats.acceptanceRate * 100)} |
              Süre: {caseStats.avgDuration}
            </p>
          </div>

          {/* Legal Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hukuk Alanı
            </label>
            <select
              value={legalArea}
              onChange={(e) => setLegalArea(e.target.value as LegalArea)}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {LEGAL_AREAS.map((area) => (
                <option key={area.value} value={area.value}>
                  {area.label}
                </option>
              ))}
            </select>
          </div>

          {/* Claim Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Talep Miktarı (TL)
            </label>
            <input
              type="number"
              value={claimAmount}
              onChange={(e) => setClaimAmount(e.target.value)}
              placeholder="Örn: 100000"
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Defendant Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Davalı Türü
            </label>
            <select
              value={defendantType}
              onChange={(e) => setDefendantType(e.target.value as typeof defendantType)}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="gercek_kisi">Gerçek Kişi</option>
              <option value="tuzel_kisi">Tüzel Kişi (Şirket)</option>
              <option value="kamu_kurumu">Kamu Kurumu</option>
            </select>
          </div>
        </div>

        {/* Facts */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Dava Olayları (Her satıra bir olay)
          </label>
          <textarea
            value={facts}
            onChange={(e) => setFacts(e.target.value)}
            rows={4}
            placeholder="Örn:&#10;Davacı 5 yıl boyunca davalı şirkette çalışmıştır.&#10;İş sözleşmesi performans düşüklüğü gerekçesiyle feshedilmiştir.&#10;Davacıya yazılı uyarı verilmemiştir."
            className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Lawyer Checkbox */}
        <div className="mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasLawyer}
              onChange={(e) => setHasLawyer(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Davacının avukatı var
            </span>
          </label>
        </div>

        {/* Evidence Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Deliller
          </label>
          <div className="flex gap-2 mb-2">
            <select
              value={newEvidence.type}
              onChange={(e) =>
                setNewEvidence({ ...newEvidence, type: e.target.value as Evidence["type"] })
              }
              className="px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="yazili">Yazılı</option>
              <option value="tanik">Tanık</option>
              <option value="bilirkisi">Bilirkişi</option>
              <option value="kesif">Keşif</option>
              <option value="dijital">Dijital</option>
            </select>
            <input
              type="text"
              value={newEvidence.description}
              onChange={(e) =>
                setNewEvidence({ ...newEvidence, description: e.target.value })
              }
              placeholder="Delil açıklaması"
              className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <select
              value={newEvidence.strength}
              onChange={(e) =>
                setNewEvidence({ ...newEvidence, strength: parseFloat(e.target.value) })
              }
              className="px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="0.9">Çok Güçlü</option>
              <option value="0.7">Güçlü</option>
              <option value="0.5">Orta</option>
              <option value="0.3">Zayıf</option>
            </select>
            <button
              onClick={handleAddEvidence}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Ekle
            </button>
          </div>
          {evidenceList.length > 0 && (
            <div className="space-y-2">
              {evidenceList.map((evidence, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium capitalize">{evidence.type}:</span>{" "}
                    {evidence.description}
                  </span>
                  <button
                    onClick={() => handleRemoveEvidence(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !facts.trim()}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analiz Ediliyor...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Tahmin Et
            </>
          )}
        </button>

        {/* Results */}
        {prediction && (
          <div className="mt-8 space-y-6">
            {/* Main Prediction */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Tahmini Sonuç
                </p>
                <p className={`text-3xl font-bold ${getOutcomeColor(prediction.outcome)}`}>
                  {getOutcomeLabel(prediction.outcome)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Güven: %{Math.round(prediction.confidence * 100)}
                </p>
              </div>

              {/* Probability Bars */}
              <div className="mt-6 space-y-3">
                {Object.entries(prediction.probabilities).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300 w-24">
                      {getOutcomeLabel(key)}
                    </span>
                    <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${value * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                      %{Math.round(value * 100)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="p-4 border dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Risk Değerlendirmesi
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(prediction.riskAssessment.overallRisk)}`}
                >
                  {prediction.riskAssessment.overallRisk === "low" && "Düşük Risk"}
                  {prediction.riskAssessment.overallRisk === "medium" && "Orta Risk"}
                  {prediction.riskAssessment.overallRisk === "high" && "Yüksek Risk"}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Tahmini süre: {prediction.riskAssessment.timeEstimate.minMonths}-
                  {prediction.riskAssessment.timeEstimate.maxMonths} ay
                </span>
              </div>
              {prediction.riskAssessment.riskFactors.length > 0 && (
                <div className="space-y-2">
                  {prediction.riskAssessment.riskFactors.map((risk, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-red-500">!</span>
                      <div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {risk.factor}
                        </span>
                        {risk.mitigation && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                            Öneri: {risk.mitigation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Key Factors */}
            <div className="p-4 border dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Önemli Faktörler
              </h3>
              <div className="space-y-2">
                {prediction.keyFactors.map((factor, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span
                      className={
                        factor.impact === "positive"
                          ? "text-green-500"
                          : factor.impact === "negative"
                          ? "text-red-500"
                          : "text-gray-400"
                      }
                    >
                      {factor.impact === "positive" ? "+" : factor.impact === "negative" ? "-" : "•"}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {factor.explanation}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Cases */}
            {prediction.similarCases.length > 0 && (
              <div className="p-4 border dark:border-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Benzer İçtihatlar
                </h3>
                <div className="space-y-3">
                  {prediction.similarCases.map((similarCase, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {similarCase.citation}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${getOutcomeColor(similarCase.outcome)}`}
                        >
                          {getOutcomeLabel(similarCase.outcome)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Benzerlik: %{Math.round(similarCase.similarity * 100)}
                      </p>
                      {similarCase.keyDifferences.length > 0 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Farklılıklar: {similarCase.keyDifferences.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {prediction.recommendations.length > 0 && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Öneriler
                </h3>
                <ul className="space-y-2">
                  {prediction.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center italic">
              {prediction.disclaimer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CasePredictionPanel;
