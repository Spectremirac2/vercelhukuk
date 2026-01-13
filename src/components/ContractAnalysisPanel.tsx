"use client";

import React, { useState, useMemo } from "react";
import {
  analyzeContract,
  getContractTypes,
  getRiskLevelInfo,
  type ContractAnalysis,
} from "@/lib/contract-analysis";

export function ContractAnalysisPanel() {
  const [contractText, setContractText] = useState("");
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!contractText.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeContract(contractText);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 500);
  };

  const contractTypes = getContractTypes();

  // Get all compliance issues from the compliance status
  const complianceIssues = useMemo(() => {
    if (!analysis) return [];
    const issues: Array<{ area: string; issue: string; recommendation: string }> = [];

    if (!analysis.complianceStatus.kvkk.compliant) {
      analysis.complianceStatus.kvkk.issues.forEach((issue) => {
        issues.push({
          area: "KVKK",
          issue,
          recommendation: analysis.complianceStatus.kvkk.recommendations[0] || "",
        });
      });
    }
    if (!analysis.complianceStatus.isKanunu.compliant) {
      analysis.complianceStatus.isKanunu.issues.forEach((issue) => {
        issues.push({
          area: "İş Kanunu",
          issue,
          recommendation: analysis.complianceStatus.isKanunu.recommendations[0] || "",
        });
      });
    }
    if (!analysis.complianceStatus.ticaretKanunu.compliant) {
      analysis.complianceStatus.ticaretKanunu.issues.forEach((issue) => {
        issues.push({
          area: "Ticaret Kanunu",
          issue,
          recommendation: analysis.complianceStatus.ticaretKanunu.recommendations[0] || "",
        });
      });
    }
    if (!analysis.complianceStatus.tuketiciKanunu.compliant) {
      analysis.complianceStatus.tuketiciKanunu.issues.forEach((issue) => {
        issues.push({
          area: "Tüketici Kanunu",
          issue,
          recommendation: analysis.complianceStatus.tuketiciKanunu.recommendations[0] || "",
        });
      });
    }
    return issues;
  }, [analysis]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">📜</span>
        Sözleşme Analizi
      </h2>

      <div className="space-y-4">
        {/* Contract Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sözleşme Metni
          </label>
          <textarea
            className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Analiz edilecek sözleşme metnini buraya yapıştırın..."
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
          />
        </div>

        {/* Analyze Button */}
        <button
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          onClick={handleAnalyze}
          disabled={!contractText.trim() || isAnalyzing}
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Analiz Ediliyor...
            </span>
          ) : (
            "Sözleşmeyi Analiz Et"
          )}
        </button>

        {/* Analysis Results */}
        {analysis && (
          <div className="mt-6 space-y-4">
            {/* Overview */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Genel Değerlendirme</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Sözleşme Türü:</span>
                  <p className="font-medium">
                    {contractTypes.find((t) => t.id === analysis.contractType)?.name ||
                      analysis.contractType}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Risk Skoru:</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${analysis.riskScore}%`,
                          backgroundColor: getRiskLevelInfo(analysis.riskLevel).color,
                        }}
                      />
                    </div>
                    <span
                      className="font-bold"
                      style={{ color: getRiskLevelInfo(analysis.riskLevel).color }}
                    >
                      %{analysis.riskScore}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-sm text-gray-600">Risk Seviyesi:</span>
                <span
                  className="ml-2 px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: getRiskLevelInfo(analysis.riskLevel).color }}
                >
                  {getRiskLevelInfo(analysis.riskLevel).name}
                </span>
              </div>
            </div>

            {/* Clauses Found */}
            {analysis.clauses.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-3">
                  Tespit Edilen Maddeler ({analysis.clauses.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {analysis.clauses.map((clause, index) => (
                    <div
                      key={index}
                      className="p-2 bg-white rounded border-l-4"
                      style={{
                        borderColor: getRiskLevelInfo(clause.riskLevel).color,
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-800">{clause.title}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded text-white"
                          style={{
                            backgroundColor: getRiskLevelInfo(clause.riskLevel).color,
                          }}
                        >
                          {getRiskLevelInfo(clause.riskLevel).name}
                        </span>
                      </div>
                      {clause.issues.length > 0 && (
                        <ul className="mt-1 text-sm text-gray-600">
                          {clause.issues.map((issue, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-amber-500">⚠</span>
                              {issue.description}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Clauses */}
            {analysis.missingClauses.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-lg">
                <h3 className="font-semibold text-amber-800 mb-3">
                  Eksik Maddeler ({analysis.missingClauses.length})
                </h3>
                <ul className="space-y-2">
                  {analysis.missingClauses.map((missing, index) => (
                    <li key={index} className="p-2 bg-white rounded">
                      <div className="flex items-center gap-2 text-amber-700">
                        <span>❌</span>
                        <span className="font-medium">{missing.description}</span>
                      </div>
                      {missing.suggestedContent && (
                        <p className="text-xs text-gray-600 mt-1 ml-6">
                          {missing.suggestedContent}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Compliance Issues */}
            {complianceIssues.length > 0 && (
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-3">
                  Uyumluluk Sorunları ({complianceIssues.length})
                </h3>
                <ul className="space-y-2">
                  {complianceIssues.map((issue, index) => (
                    <li key={index} className="p-2 bg-white rounded border-l-4 border-red-500">
                      <div className="font-medium text-gray-800">{issue.area}</div>
                      <div className="text-sm text-gray-600">{issue.issue}</div>
                      {issue.recommendation && (
                        <div className="text-xs text-blue-600 mt-1">
                          Öneri: {issue.recommendation}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">Öneriler</h3>
                <ul className="space-y-1">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-green-700">
                      <span className="mt-0.5">💡</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Contract Types Info */}
        {!analysis && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Desteklenen Sözleşme Türleri</h3>
            <div className="flex flex-wrap gap-2">
              {contractTypes.map((type) => (
                <span
                  key={type.id}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600"
                >
                  {type.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContractAnalysisPanel;
