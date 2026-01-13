"use client";

import React, { useState } from "react";
import {
  assessCaseRisk,
  assessContractRisk,
  assessComplianceRisk,
  getRiskLevelColor,
  getRiskLevelName,
  getCategoryName,
  getRiskCategories,
  generateRiskReport,
  formatRiskScore,
  type RiskAssessment,
  type CaseRiskInput,
  type ContractRiskInput,
  type ComplianceRiskInput,
} from "@/lib/risk-assessment";

type AssessmentType = "case" | "contract" | "compliance";

export function RiskAssessmentPanel() {
  const [assessmentType, setAssessmentType] = useState<AssessmentType>("case");
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [showReport, setShowReport] = useState(false);

  // Case risk inputs
  const [caseInput, setCaseInput] = useState<CaseRiskInput>({
    caseType: "hukuk",
    evidenceStrength: "moderate",
    precedentSupport: "mixed",
    opposingPartyStrength: "moderate",
    timelinePressure: "normal",
    jurisdictionFamiliarity: "familiar",
    settlementPossibility: "possible",
    publicityRisk: "low",
  });

  // Contract risk inputs
  const [contractInput, setContractInput] = useState<ContractRiskInput>({
    contractType: "hizmet",
    counterpartyReliability: "moderate",
    termLength: "medium",
    exclusivityClause: false,
    penaltyClause: true,
    terminationEase: "moderate",
    jurisdictionClause: "neutral",
    arbitrationClause: false,
    forceNajeureClause: true,
    limitationOfLiability: false,
    confidentialityClause: true,
    intellectualPropertyRisk: "low",
  });

  // Compliance risk inputs
  const [complianceInput, setComplianceInput] = useState<ComplianceRiskInput>({
    industry: "teknoloji",
    employeeCount: 50,
    dataProcessingVolume: "moderate",
    internationalOperations: false,
    previousViolations: 0,
    complianceOfficer: true,
    regularAudits: true,
    documentedPolicies: true,
    employeeTraining: false,
    incidentResponsePlan: false,
  });

  const handleAssess = () => {
    let result: RiskAssessment;
    switch (assessmentType) {
      case "case":
        result = assessCaseRisk(caseInput);
        break;
      case "contract":
        result = assessContractRisk(contractInput);
        break;
      case "compliance":
        result = assessComplianceRisk(complianceInput);
        break;
    }
    setAssessment(result);
    setShowReport(false);
  };

  const renderCaseInputs = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kanıt Gücü</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={caseInput.evidenceStrength}
          onChange={(e) =>
            setCaseInput({ ...caseInput, evidenceStrength: e.target.value as any })
          }
        >
          <option value="strong">Güçlü</option>
          <option value="moderate">Orta</option>
          <option value="weak">Zayıf</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Emsal Desteği</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={caseInput.precedentSupport}
          onChange={(e) =>
            setCaseInput({ ...caseInput, precedentSupport: e.target.value as any })
          }
        >
          <option value="favorable">Lehte</option>
          <option value="mixed">Karışık</option>
          <option value="unfavorable">Aleyhte</option>
          <option value="none">Yok</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Karşı Taraf</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={caseInput.opposingPartyStrength}
          onChange={(e) =>
            setCaseInput({ ...caseInput, opposingPartyStrength: e.target.value as any })
          }
        >
          <option value="strong">Güçlü</option>
          <option value="moderate">Orta</option>
          <option value="weak">Zayıf</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Zaman Baskısı</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={caseInput.timelinePressure}
          onChange={(e) =>
            setCaseInput({ ...caseInput, timelinePressure: e.target.value as any })
          }
        >
          <option value="urgent">Acil</option>
          <option value="normal">Normal</option>
          <option value="flexible">Esnek</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sulh Olasılığı</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={caseInput.settlementPossibility}
          onChange={(e) =>
            setCaseInput({ ...caseInput, settlementPossibility: e.target.value as any })
          }
        >
          <option value="likely">Muhtemel</option>
          <option value="possible">Mümkün</option>
          <option value="unlikely">Zor</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Kamuoyu Etkisi</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={caseInput.publicityRisk}
          onChange={(e) =>
            setCaseInput({ ...caseInput, publicityRisk: e.target.value as any })
          }
        >
          <option value="high">Yüksek</option>
          <option value="moderate">Orta</option>
          <option value="low">Düşük</option>
        </select>
      </div>
    </div>
  );

  const renderContractInputs = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Karşı Taraf Güvenilirliği
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={contractInput.counterpartyReliability}
            onChange={(e) =>
              setContractInput({ ...contractInput, counterpartyReliability: e.target.value as any })
            }
          >
            <option value="high">Yüksek</option>
            <option value="moderate">Orta</option>
            <option value="low">Düşük</option>
            <option value="unknown">Bilinmiyor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sözleşme Süresi</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={contractInput.termLength}
            onChange={(e) =>
              setContractInput({ ...contractInput, termLength: e.target.value as any })
            }
          >
            <option value="short">Kısa (&lt;1 yıl)</option>
            <option value="medium">Orta (1-5 yıl)</option>
            <option value="long">Uzun (&gt;5 yıl)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fesih Kolaylığı</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={contractInput.terminationEase}
            onChange={(e) =>
              setContractInput({ ...contractInput, terminationEase: e.target.value as any })
            }
          >
            <option value="easy">Kolay</option>
            <option value="moderate">Orta</option>
            <option value="difficult">Zor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Yetki Maddesi</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={contractInput.jurisdictionClause}
            onChange={(e) =>
              setContractInput({ ...contractInput, jurisdictionClause: e.target.value as any })
            }
          >
            <option value="favorable">Lehte</option>
            <option value="neutral">Nötr</option>
            <option value="unfavorable">Aleyhte</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fikri Mülkiyet Riski</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={contractInput.intellectualPropertyRisk}
            onChange={(e) =>
              setContractInput({
                ...contractInput,
                intellectualPropertyRisk: e.target.value as any,
              })
            }
          >
            <option value="high">Yüksek</option>
            <option value="moderate">Orta</option>
            <option value="low">Düşük</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded"
            checked={contractInput.exclusivityClause}
            onChange={(e) =>
              setContractInput({ ...contractInput, exclusivityClause: e.target.checked })
            }
          />
          <span className="text-sm text-gray-700">Münhasırlık Maddesi</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded"
            checked={contractInput.penaltyClause}
            onChange={(e) =>
              setContractInput({ ...contractInput, penaltyClause: e.target.checked })
            }
          />
          <span className="text-sm text-gray-700">Ceza Koşulu</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded"
            checked={contractInput.forceNajeureClause}
            onChange={(e) =>
              setContractInput({ ...contractInput, forceNajeureClause: e.target.checked })
            }
          />
          <span className="text-sm text-gray-700">Mücbir Sebep</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded"
            checked={contractInput.limitationOfLiability}
            onChange={(e) =>
              setContractInput({ ...contractInput, limitationOfLiability: e.target.checked })
            }
          />
          <span className="text-sm text-gray-700">Sorumluluk Sınırı</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded"
            checked={contractInput.arbitrationClause}
            onChange={(e) =>
              setContractInput({ ...contractInput, arbitrationClause: e.target.checked })
            }
          />
          <span className="text-sm text-gray-700">Tahkim Maddesi</span>
        </label>
      </div>
    </div>
  );

  const renderComplianceInputs = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sektör</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={complianceInput.industry}
            onChange={(e) =>
              setComplianceInput({ ...complianceInput, industry: e.target.value })
            }
            placeholder="örn: teknoloji, finans"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Çalışan Sayısı</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={complianceInput.employeeCount}
            onChange={(e) =>
              setComplianceInput({
                ...complianceInput,
                employeeCount: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Veri İşleme Hacmi</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={complianceInput.dataProcessingVolume}
            onChange={(e) =>
              setComplianceInput({
                ...complianceInput,
                dataProcessingVolume: e.target.value as any,
              })
            }
          >
            <option value="high">Yüksek</option>
            <option value="moderate">Orta</option>
            <option value="low">Düşük</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Önceki İhlaller</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={complianceInput.previousViolations}
            onChange={(e) =>
              setComplianceInput({
                ...complianceInput,
                previousViolations: parseInt(e.target.value) || 0,
              })
            }
            min="0"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded"
            checked={complianceInput.internationalOperations}
            onChange={(e) =>
              setComplianceInput({
                ...complianceInput,
                internationalOperations: e.target.checked,
              })
            }
          />
          <span className="text-sm text-gray-700">Uluslararası Operasyonlar</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded"
            checked={complianceInput.complianceOfficer}
            onChange={(e) =>
              setComplianceInput({ ...complianceInput, complianceOfficer: e.target.checked })
            }
          />
          <span className="text-sm text-gray-700">Uyum Görevlisi Var</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded"
            checked={complianceInput.regularAudits}
            onChange={(e) =>
              setComplianceInput({ ...complianceInput, regularAudits: e.target.checked })
            }
          />
          <span className="text-sm text-gray-700">Düzenli Denetimler</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded"
            checked={complianceInput.documentedPolicies}
            onChange={(e) =>
              setComplianceInput({ ...complianceInput, documentedPolicies: e.target.checked })
            }
          />
          <span className="text-sm text-gray-700">Dokümante Politikalar</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded"
            checked={complianceInput.employeeTraining}
            onChange={(e) =>
              setComplianceInput({ ...complianceInput, employeeTraining: e.target.checked })
            }
          />
          <span className="text-sm text-gray-700">Çalışan Eğitimi</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded"
            checked={complianceInput.incidentResponsePlan}
            onChange={(e) =>
              setComplianceInput({ ...complianceInput, incidentResponsePlan: e.target.checked })
            }
          />
          <span className="text-sm text-gray-700">Olay Müdahale Planı</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        Risk Değerlendirmesi
      </h2>

      <div className="space-y-4">
        {/* Assessment Type Tabs */}
        <div className="flex gap-2 border-b border-gray-200 pb-2">
          <button
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              assessmentType === "case"
                ? "bg-blue-100 text-blue-700 border-b-2 border-blue-500"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setAssessmentType("case")}
          >
            ⚖️ Dava Riski
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              assessmentType === "contract"
                ? "bg-blue-100 text-blue-700 border-b-2 border-blue-500"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setAssessmentType("contract")}
          >
            📜 Sözleşme Riski
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              assessmentType === "compliance"
                ? "bg-blue-100 text-blue-700 border-b-2 border-blue-500"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setAssessmentType("compliance")}
          >
            ✅ Uyumluluk Riski
          </button>
        </div>

        {/* Input Forms */}
        <div className="p-4 bg-gray-50 rounded-lg">
          {assessmentType === "case" && renderCaseInputs()}
          {assessmentType === "contract" && renderContractInputs()}
          {assessmentType === "compliance" && renderComplianceInputs()}
        </div>

        {/* Assess Button */}
        <button
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          onClick={handleAssess}
        >
          Risk Değerlendirmesi Yap
        </button>

        {/* Assessment Results */}
        {assessment && (
          <div className="mt-6 space-y-4">
            {/* Overall Score */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Genel Risk Değerlendirmesi</h3>
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setShowReport(!showReport)}
                >
                  {showReport ? "Özeti Göster" : "Detaylı Rapor"}
                </button>
              </div>

              <div className="flex items-center gap-6">
                {/* Score Circle */}
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="#e5e7eb"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke={getRiskLevelColor(assessment.overallLevel)}
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${(assessment.overallScore / 100) * 301.6} 301.6`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: getRiskLevelColor(assessment.overallLevel) }}
                    >
                      %{assessment.overallScore}
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: getRiskLevelColor(assessment.overallLevel) }}
                    >
                      {getRiskLevelName(assessment.overallLevel)}
                    </span>
                  </div>
                </div>

                {/* Summary */}
                <div className="flex-1">
                  <p className="text-gray-600 text-sm mb-3">{assessment.summary}</p>
                  <div className="text-xs text-gray-500">
                    Değerlendirme: {assessment.createdAt.toLocaleString("tr-TR")}
                  </div>
                </div>
              </div>
            </div>

            {showReport ? (
              /* Full Report */
              <div className="p-4 bg-gray-900 rounded-lg">
                <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                  {generateRiskReport(assessment)}
                </pre>
              </div>
            ) : (
              <>
                {/* Category Breakdown */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-3">Kategori Analizi</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(assessment.categoryBreakdown)
                      .filter(([_, data]) => data.score > 0)
                      .map(([category, data]) => (
                        <div key={category} className="p-2 bg-white rounded">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              {getCategoryName(category as any)}
                            </span>
                            <span
                              className="text-sm font-bold"
                              style={{ color: getRiskLevelColor(data.level) }}
                            >
                              %{data.score}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full transition-all"
                              style={{
                                width: `${data.score}%`,
                                backgroundColor: getRiskLevelColor(data.level),
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Top Risk Factors */}
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h3 className="font-semibold text-amber-800 mb-3">Önemli Risk Faktörleri</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {assessment.factors
                      .filter((f) => f.score >= 50)
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 5)
                      .map((factor) => (
                        <div
                          key={factor.id}
                          className="p-2 bg-white rounded border-l-4"
                          style={{ borderColor: getRiskLevelColor(factor.level) }}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-gray-800 text-sm">
                              {factor.name}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded text-white"
                              style={{ backgroundColor: getRiskLevelColor(factor.level) }}
                            >
                              %{factor.score}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{factor.description}</p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">Öneriler</h3>
                  <ul className="space-y-2">
                    {assessment.recommendations.map((rec, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-green-700 text-sm"
                      >
                        <span className="mt-0.5">💡</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {/* Info */}
        {!assessment && (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-2">Risk Değerlendirmesi Nedir?</h3>
            <p className="text-sm text-purple-600">
              Bu araç, davalarınız, sözleşmeleriniz ve uyumluluk durumunuz için kapsamlı
              risk analizi yapar. Faktörleri değerlendirir, risk skorları hesaplar ve
              risk azaltma önerileri sunar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RiskAssessmentPanel;
