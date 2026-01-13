"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ToolModal } from "./ToolModal";
import {
  assessCaseRisk,
  assessContractRisk,
  generateRiskReport,
  type RiskAssessment,
  type CaseRiskInput,
  type ContractRiskInput,
} from "@/lib/risk-assessment";
import { AlertTriangle } from "lucide-react";

type AssessmentType = "case" | "contract";

interface RiskAssessmentToolProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RiskAssessmentTool({ isOpen, onClose }: RiskAssessmentToolProps) {
  const [assessmentType, setAssessmentType] = useState<AssessmentType>("case");
  const [result, setResult] = useState<RiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);

  // Case Risk Inputs
  const [caseType, setCaseType] = useState<CaseRiskInput["caseType"]>("civil");
  const [disputeValue, setDisputeValue] = useState(100000);
  const [evidenceStrength, setEvidenceStrength] = useState<"strong" | "moderate" | "weak">("moderate");
  const [hasLawyer, setHasLawyer] = useState(true);
  const [opposingPartyType, setOpposingPartyType] = useState<"individual" | "company" | "government">("company");
  const [caseDescription, setCaseDescription] = useState("");

  // Contract Risk Inputs
  const [contractValue, setContractValue] = useState(500000);
  const [contractType, setContractType] = useState<ContractRiskInput["contractType"]>("service");
  const [hasLegalReview, setHasLegalReview] = useState(false);
  const [counterpartyType, setCounterpartyType] = useState<"individual" | "small_business" | "corporation" | "government">("corporation");
  const [contractText, setContractText] = useState("");

  const handleAssess = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    let assessment: RiskAssessment;

    if (assessmentType === "case") {
      assessment = assessCaseRisk({
        caseType,
        disputeValue,
        evidenceStrength,
        hasLawyer,
        opposingPartyType,
        description: caseDescription,
      });
    } else {
      assessment = assessContractRisk({
        contractValue,
        contractType,
        hasLegalReview,
        counterpartyType,
        contractText,
      });
    }

    setResult(assessment);
    setLoading(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getRiskGradient = (level: string) => {
    switch (level) {
      case "critical": return "from-red-600 to-rose-600";
      case "high": return "from-orange-500 to-red-500";
      case "medium": return "from-yellow-500 to-orange-500";
      case "low": return "from-green-500 to-emerald-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <ToolModal
      isOpen={isOpen}
      onClose={onClose}
      title="Risk Değerlendirme"
      description="Dava veya sözleşme risk analizi yapın"
      icon={<AlertTriangle size={24} />}
      size="lg"
    >
    <div className="space-y-6">
      {/* Assessment Type Toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
        <button
          onClick={() => { setAssessmentType("case"); setResult(null); }}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
            assessmentType === "case"
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          ⚖️ Dava Risk Analizi
        </button>
        <button
          onClick={() => { setAssessmentType("contract"); setResult(null); }}
          className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
            assessmentType === "contract"
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          📄 Sözleşme Risk Analizi
        </button>
      </div>

      {/* Case Risk Form */}
      {assessmentType === "case" && !result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Dava Türü</label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value as CaseRiskInput["caseType"])}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="civil" className="bg-gray-900">Hukuk Davası</option>
                <option value="criminal" className="bg-gray-900">Ceza Davası</option>
                <option value="administrative" className="bg-gray-900">İdari Dava</option>
                <option value="labor" className="bg-gray-900">İş Davası</option>
                <option value="commercial" className="bg-gray-900">Ticaret Davası</option>
                <option value="family" className="bg-gray-900">Aile Davası</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Dava Değeri (TL)</label>
              <input
                type="number"
                value={disputeValue}
                onChange={(e) => setDisputeValue(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Delil Gücü</label>
              <select
                value={evidenceStrength}
                onChange={(e) => setEvidenceStrength(e.target.value as typeof evidenceStrength)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="strong" className="bg-gray-900">Güçlü</option>
                <option value="moderate" className="bg-gray-900">Orta</option>
                <option value="weak" className="bg-gray-900">Zayıf</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Karşı Taraf</label>
              <select
                value={opposingPartyType}
                onChange={(e) => setOpposingPartyType(e.target.value as typeof opposingPartyType)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="individual" className="bg-gray-900">Gerçek Kişi</option>
                <option value="company" className="bg-gray-900">Şirket</option>
                <option value="government" className="bg-gray-900">Kamu Kurumu</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all flex-1 ${
              hasLawyer ? "bg-green-500/20 border-green-500/50" : "bg-white/5 border-white/10"
            }`}>
              <input
                type="checkbox"
                checked={hasLawyer}
                onChange={(e) => setHasLawyer(e.target.checked)}
                className="w-4 h-4 rounded accent-green-500"
              />
              <div>
                <div className="text-sm font-medium text-gray-300">Avukat Desteği</div>
                <div className="text-xs text-gray-500">Profesyonel hukuki destek</div>
              </div>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Dava Özeti (Opsiyonel)</label>
            <textarea
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
              placeholder="Davanın kısa bir özetini yazın..."
              className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            />
          </div>
        </div>
      )}

      {/* Contract Risk Form */}
      {assessmentType === "contract" && !result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Sözleşme Türü</label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value as ContractRiskInput["contractType"])}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="service" className="bg-gray-900">Hizmet Sözleşmesi</option>
                <option value="employment" className="bg-gray-900">İş Sözleşmesi</option>
                <option value="sales" className="bg-gray-900">Satış Sözleşmesi</option>
                <option value="lease" className="bg-gray-900">Kira Sözleşmesi</option>
                <option value="partnership" className="bg-gray-900">Ortaklık Sözleşmesi</option>
                <option value="nda" className="bg-gray-900">Gizlilik Sözleşmesi</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Sözleşme Değeri (TL)</label>
              <input
                type="number"
                value={contractValue}
                onChange={(e) => setContractValue(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="block text-sm font-medium text-gray-300">Karşı Taraf Türü</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: "individual", label: "Gerçek Kişi", icon: "👤" },
                  { value: "small_business", label: "KOBİ", icon: "🏪" },
                  { value: "corporation", label: "Büyük Şirket", icon: "🏢" },
                  { value: "government", label: "Kamu", icon: "🏛️" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCounterpartyType(opt.value as typeof counterpartyType)}
                    className={`p-3 rounded-xl border transition-all ${
                      counterpartyType === opt.value
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <div className="text-xs mt-1">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all flex-1 ${
              hasLegalReview ? "bg-green-500/20 border-green-500/50" : "bg-white/5 border-white/10"
            }`}>
              <input
                type="checkbox"
                checked={hasLegalReview}
                onChange={(e) => setHasLegalReview(e.target.checked)}
                className="w-4 h-4 rounded accent-green-500"
              />
              <div>
                <div className="text-sm font-medium text-gray-300">Hukuki İnceleme</div>
                <div className="text-xs text-gray-500">Avukat tarafından incelendi</div>
              </div>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Sözleşme Metni (Opsiyonel)</label>
            <textarea
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
              placeholder="Sözleşme metnini yapıştırın (daha detaylı analiz için)..."
              className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            />
          </div>
        </div>
      )}

      {/* Analyze Button */}
      {!result && (
        <Button onClick={handleAssess} disabled={loading} className="w-full">
          {loading ? (
            <>
              <span className="animate-spin mr-2">⚙️</span>
              Analiz Ediliyor...
            </>
          ) : (
            <>
              📊 Risk Analizi Yap
            </>
          )}
        </Button>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Overall Risk Score */}
          <div className={`p-6 rounded-xl bg-gradient-to-r ${getRiskGradient(result.overallRisk)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Genel Risk Değerlendirmesi</h3>
                <p className="text-sm text-white/70 mt-1">
                  {result.overallRisk === "critical" ? "Kritik risk seviyesi - acil önlem gerekli" :
                   result.overallRisk === "high" ? "Yüksek risk - dikkatli değerlendirme gerekli" :
                   result.overallRisk === "medium" ? "Orta risk - bazı önlemler önerilir" :
                   "Düşük risk - standart dikkat yeterli"}
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-white">{result.score}</div>
                <div className="text-sm text-white/70">/100</div>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-300">Risk Faktörleri</h4>
            {result.factors.map((factor, index) => (
              <div key={index} className={`p-4 rounded-xl border ${getRiskColor(factor.level)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${getRiskColor(factor.level)}`}>
                      {factor.level === "critical" ? "Kritik" :
                       factor.level === "high" ? "Yüksek" :
                       factor.level === "medium" ? "Orta" : "Düşük"}
                    </span>
                    <span className="text-xs text-gray-500">{factor.category}</span>
                  </div>
                  <span className="text-sm font-medium">
                    Etki: {factor.impact}/10
                  </span>
                </div>
                <h5 className="font-medium text-white mb-1">{factor.name}</h5>
                <p className="text-sm text-gray-400">{factor.description}</p>
                {factor.mitigation && (
                  <div className="mt-2 p-2 bg-white/5 rounded-lg">
                    <span className="text-xs text-green-400">💡 Öneri:</span>
                    <p className="text-sm text-gray-300 mt-1">{factor.mitigation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <span>💼</span> Öneriler
            </h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* New Assessment Button */}
          <Button
            onClick={() => setResult(null)}
            variant="secondary"
            className="w-full"
          >
            🔄 Yeni Değerlendirme Yap
          </Button>
        </div>
      )}
    </div>
    </ToolModal>
  );
}
