"use client";

import React, { useState, useMemo } from "react";
import {
  runComplianceCheck,
  getComplianceCategories,
  type ComplianceReport,
  type ComplianceCategory,
} from "@/lib/compliance-checker";

export function ComplianceCheckerPanel() {
  const [documentText, setDocumentText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<ComplianceCategory[]>([
    "kvkk",
    "is_kanunu",
  ]);
  const [report, setReport] = useState<ComplianceReport | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const categories = getComplianceCategories();

  const handleCategoryToggle = (category: ComplianceCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleCheck = () => {
    if (!documentText.trim() || selectedCategories.length === 0) return;

    setIsChecking(true);
    setTimeout(() => {
      const result = runComplianceCheck(documentText, selectedCategories);
      setReport(result);
      setIsChecking(false);
    }, 500);
  };

  // Derive data from report
  const allFindings = useMemo(() => {
    if (!report) return [];
    return report.checks.flatMap((c) => c.findings);
  }, [report]);

  const allRecommendations = useMemo(() => {
    if (!report) return [];
    const recs = report.checks.flatMap((c) => c.recommendations);
    return [...new Set(recs)];
  }, [report]);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "#16a34a";
    if (score >= 60) return "#ca8a04";
    if (score >= 40) return "#ea580c";
    return "#dc2626";
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case "kritik_ihlal":
        return "#dc2626";
      case "ihlal":
        return "#ea580c";
      case "uyarı":
        return "#ca8a04";
      default:
        return "#6b7280";
    }
  };

  const getSeverityName = (severity: string): string => {
    switch (severity) {
      case "kritik_ihlal":
        return "Kritik";
      case "ihlal":
        return "İhlal";
      case "uyarı":
        return "Uyarı";
      default:
        return severity;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">✅</span>
        Uyumluluk Kontrolü
      </h2>

      <div className="space-y-4">
        {/* Document Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Belge / Politika Metni
          </label>
          <textarea
            className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Uyumluluk kontrolü yapılacak belge metnini buraya yapıştırın..."
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
          />
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kontrol Kategorileri
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`px-3 py-2 rounded-lg border-2 transition-colors ${
                  selectedCategories.includes(cat.id)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => handleCategoryToggle(cat.id)}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Check Button */}
        <button
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          onClick={handleCheck}
          disabled={!documentText.trim() || selectedCategories.length === 0 || isChecking}
        >
          {isChecking ? (
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
              Kontrol Ediliyor...
            </span>
          ) : (
            "Uyumluluk Kontrolü Yap"
          )}
        </button>

        {/* Report Results */}
        {report && (
          <div className="mt-6 space-y-4">
            {/* Overall Score */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Genel Uyumluluk Skoru</h3>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke={getScoreColor(report.overallScore)}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(report.overallScore / 100) * 251.2} 251.2`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-2xl font-bold"
                      style={{ color: getScoreColor(report.overallScore) }}
                    >
                      %{report.overallScore}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 mb-2">{report.summary}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-600">
                      ✓ {report.checks.filter((c) => c.passed).length} Uyumlu
                    </span>
                    <span className="text-red-600">
                      ✗ {report.checks.filter((c) => !c.passed).length} Uyumsuz
                    </span>
                    <span className="text-amber-600">
                      ⚠ {allFindings.length} Bulgu
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Scores */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3">Kategori Bazlı Sonuçlar</h3>
              <div className="space-y-3">
                {report.checks.map((check) => {
                  const category = categories.find((c) => c.id === check.area);
                  return (
                    <div key={check.area} className="flex items-center gap-3">
                      <span className="w-32 text-sm font-medium text-gray-700">
                        {category?.icon} {check.areaName}
                      </span>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${check.score}%`,
                            backgroundColor: getScoreColor(check.score),
                          }}
                        />
                      </div>
                      <span
                        className="w-12 text-right font-bold text-sm"
                        style={{ color: getScoreColor(check.score) }}
                      >
                        %{check.score}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Findings */}
            {allFindings.length > 0 && (
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-3">
                  Dikkat Gerektiren Bulgular ({allFindings.length})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {allFindings.map((finding, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white rounded-lg border-l-4"
                      style={{ borderColor: getSeverityColor(finding.severity) }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-gray-800">{finding.title}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: getSeverityColor(finding.severity) }}
                        >
                          {getSeverityName(finding.severity)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{finding.description}</p>
                      <p className="text-xs text-gray-500">
                        <strong>Yasal Dayanak:</strong> {finding.legalReference}
                      </p>
                      {finding.remediation && (
                        <p className="text-xs text-blue-600 mt-1">
                          <strong>Öneri:</strong> {finding.remediation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {allRecommendations.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-3">Genel Öneriler</h3>
                <ul className="space-y-2">
                  {allRecommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-green-700 text-sm">
                      <span className="mt-0.5">💡</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Passed Checks */}
            {report.checks.filter((c) => c.passed).length > 0 && (
              <details className="p-4 bg-gray-50 rounded-lg">
                <summary className="font-semibold text-gray-700 cursor-pointer">
                  Uyumlu Alanlar ({report.checks.filter((c) => c.passed).length})
                </summary>
                <ul className="mt-3 space-y-1">
                  {report.checks
                    .filter((c) => c.passed)
                    .map((check, index) => (
                      <li key={index} className="flex items-center gap-2 text-green-600 text-sm">
                        <span>✓</span>
                        {check.areaName} (%{check.score})
                      </li>
                    ))}
                </ul>
              </details>
            )}
          </div>
        )}

        {/* Info Box */}
        {!report && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-700 mb-2">Uyumluluk Kontrolü Nedir?</h3>
            <p className="text-sm text-blue-600">
              Bu araç, belgelerinizi KVKK, İş Kanunu, Borçlar Kanunu ve Tüketici Kanunu
              gerekliliklerine göre otomatik olarak kontrol eder. Eksik veya uyumsuz
              maddeleri tespit eder ve iyileştirme önerileri sunar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ComplianceCheckerPanel;
