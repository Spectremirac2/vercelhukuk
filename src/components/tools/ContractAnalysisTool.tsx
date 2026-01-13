"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ToolModal, ToolSection, ToolResult, ToolResultGrid } from "./ToolModal";
import {
  analyzeContract,
  ContractAnalysis,
  ContractType,
  getContractTypes,
  getRiskColor,
  getRiskLabel,
  getContractTypeName,
} from "@/lib/contract-analysis";
import {
  FileText,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Shield,
  FileCheck,
  Scale,
  Copy,
  Download,
} from "lucide-react";

/**
 * ContractAnalysisTool - Sözleşme analiz aracı
 */
interface ContractAnalysisToolProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContractAnalysisTool({ isOpen, onClose }: ContractAnalysisToolProps) {
  const [contractText, setContractText] = useState("");
  const [selectedType, setSelectedType] = useState<ContractType | "">("");
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"clauses" | "risks" | "compliance" | "summary">("summary");

  const contractTypes = getContractTypes();

  /**
   * Sözleşmeyi analiz et
   */
  const handleAnalyze = useCallback(async () => {
    if (!contractText.trim()) return;

    setIsAnalyzing(true);
    
    // Simüle edilmiş gecikme (gerçek API çağrısı için)
    await new Promise((r) => setTimeout(r, 1500));
    
    try {
      const result = analyzeContract(
        contractText,
        selectedType || undefined
      );
      setAnalysis(result);
      setActiveTab("summary");
    } catch (error) {
      console.error("Analiz hatası:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [contractText, selectedType]);

  /**
   * Formu temizle
   */
  const handleReset = useCallback(() => {
    setContractText("");
    setSelectedType("");
    setAnalysis(null);
  }, []);

  /**
   * Sonuçları kopyala
   */
  const handleCopy = useCallback(() => {
    if (!analysis) return;
    
    const text = `
Sözleşme Analizi Raporu
=======================
Tür: ${getContractTypeName(analysis.contractType)}
Risk Skoru: %${analysis.riskScore} (${getRiskLabel(analysis.riskLevel)})

Özet:
${analysis.summary.purpose}

Öneriler:
${analysis.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}
    `.trim();
    
    navigator.clipboard.writeText(text);
  }, [analysis]);

  return (
    <ToolModal
      isOpen={isOpen}
      onClose={onClose}
      title="Sözleşme Analizi"
      description="AI destekli sözleşme risk analizi ve madde kontrolü"
      icon={<FileCheck size={24} />}
      size="xl"
    >
      {!analysis ? (
        // Input form
        <div className="space-y-6">
          <ToolSection title="Sözleşme Metni" description="Analiz edilecek sözleşme metnini yapıştırın">
            <textarea
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
              placeholder="Sözleşme metnini buraya yapıştırın veya yazın...

Örnek:
İŞ SÖZLEŞMESİ

TARAFLAR
Bir tarafta ... (İşveren)
Diğer tarafta ... (İşçi)

MADDE 1 - KONU
..."
              className="w-full h-64 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {contractText.length.toLocaleString("tr-TR")} karakter
              </span>
              <button
                onClick={() => setContractText("")}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                Temizle
              </button>
            </div>
          </ToolSection>

          <ToolSection title="Sözleşme Türü" description="Tür belirleme opsiyoneldir, sistem otomatik algılayabilir">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {contractTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id as ContractType)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium transition-all text-left",
                    selectedType === type.id
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </ToolSection>

          <div className="flex gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAnalyze}
              loading={isAnalyzing}
              disabled={!contractText.trim()}
              icon={<Scale size={20} />}
            >
              Analiz Et
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setContractText("")}
              disabled={!contractText}
            >
              Temizle
            </Button>
          </div>
        </div>
      ) : (
        // Analysis results
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card variant="elevated" padding="md">
              <div className="text-sm text-gray-500 dark:text-gray-400">Sözleşme Türü</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {getContractTypeName(analysis.contractType)}
              </div>
            </Card>
            <Card variant="elevated" padding="md">
              <div className="text-sm text-gray-500 dark:text-gray-400">Risk Skoru</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className="text-2xl font-bold"
                  style={{ color: getRiskColor(analysis.riskLevel) }}
                >
                  %{analysis.riskScore}
                </span>
                <span
                  className="text-sm font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${getRiskColor(analysis.riskLevel)}20`,
                    color: getRiskColor(analysis.riskLevel),
                  }}
                >
                  {getRiskLabel(analysis.riskLevel)}
                </span>
              </div>
            </Card>
            <Card variant="elevated" padding="md">
              <div className="text-sm text-gray-500 dark:text-gray-400">Tespit Edilen</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {analysis.clauses.length} madde
              </div>
            </Card>
            <Card variant="elevated" padding="md">
              <div className="text-sm text-gray-500 dark:text-gray-400">Eksik Madde</div>
              <div className="text-lg font-semibold text-amber-600 dark:text-amber-400 mt-1">
                {analysis.missingClauses.length} adet
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: "summary", label: "Özet" },
              { id: "clauses", label: "Maddeler" },
              { id: "risks", label: "Riskler" },
              { id: "compliance", label: "Uyumluluk" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === "summary" && (
              <div className="space-y-4">
                <ToolResult title="Sözleşme Özeti" status="info">
                  <p className="mb-3">{analysis.summary.purpose}</p>
                  {analysis.summary.duration && (
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Süre:</strong> {analysis.summary.duration}
                    </p>
                  )}
                  {analysis.summary.value && (
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Bedel:</strong> {analysis.summary.value}
                    </p>
                  )}
                </ToolResult>

                {analysis.parties.length > 0 && (
                  <ToolResult title="Taraflar" status="info">
                    <div className="space-y-2">
                      {analysis.parties.map((party, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-medium">
                            {i + 1}
                          </span>
                          <span>{party.name}</span>
                          <span className="text-xs text-gray-400">
                            ({party.type === "tuzel_kisi" ? "Tüzel Kişi" : "Gerçek Kişi"})
                          </span>
                        </div>
                      ))}
                    </div>
                  </ToolResult>
                )}

                {analysis.recommendations.length > 0 && (
                  <ToolResult title="Öneriler" status="warning">
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ChevronRight size={16} className="mt-0.5 text-amber-500 shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </ToolResult>
                )}
              </div>
            )}

            {activeTab === "clauses" && (
              <div className="space-y-3">
                {analysis.clauses.map((clause) => (
                  <Card key={clause.id} variant="elevated" padding="md" className={cn(
                    "border-l-4",
                    clause.riskLevel === "kritik" && "border-l-red-500",
                    clause.riskLevel === "yüksek" && "border-l-orange-500",
                    clause.riskLevel === "orta" && "border-l-amber-500",
                    clause.riskLevel === "düşük" && "border-l-green-500"
                  )}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {clause.title}
                      </h4>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${getRiskColor(clause.riskLevel)}20`,
                          color: getRiskColor(clause.riskLevel),
                        }}
                      >
                        {getRiskLabel(clause.riskLevel)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {clause.content}
                    </p>
                    {clause.issues.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {clause.issues.map((issue, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <AlertTriangle size={14} className="mt-0.5 text-amber-500 shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{issue.description}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}

                {analysis.missingClauses.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <XCircle size={18} className="text-red-500" />
                      Eksik Maddeler
                    </h4>
                    <div className="space-y-2">
                      {analysis.missingClauses.map((missing, i) => (
                        <Card key={i} variant="elevated" padding="sm" className="border-l-4 border-l-red-500">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {missing.description}
                              </span>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {missing.suggestedContent}
                              </p>
                            </div>
                            <span
                              className="text-xs font-medium px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: `${getRiskColor(missing.importance)}20`,
                                color: getRiskColor(missing.importance),
                              }}
                            >
                              {getRiskLabel(missing.importance)}
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "risks" && (
              <div className="space-y-4">
                {/* Risk gauge visualization */}
                <Card variant="elevated" padding="lg" className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={getRiskColor(analysis.riskLevel)}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${analysis.riskScore * 2.51} 251`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div>
                        <div className="text-3xl font-bold" style={{ color: getRiskColor(analysis.riskLevel) }}>
                          {analysis.riskScore}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Risk Skoru</div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${getRiskColor(analysis.riskLevel)}20`,
                      color: getRiskColor(analysis.riskLevel),
                    }}
                  >
                    {analysis.riskLevel === "düşük" && <CheckCircle size={16} />}
                    {analysis.riskLevel === "orta" && <AlertTriangle size={16} />}
                    {analysis.riskLevel === "yüksek" && <AlertTriangle size={16} />}
                    {analysis.riskLevel === "kritik" && <XCircle size={16} />}
                    {getRiskLabel(analysis.riskLevel)} Risk
                  </div>
                </Card>

                {/* Risk breakdown by clause */}
                <ToolResultGrid>
                  {analysis.clauses
                    .filter((c) => c.issues.length > 0)
                    .map((clause) => (
                      <ToolResult
                        key={clause.id}
                        title={clause.title}
                        status={
                          clause.riskLevel === "kritik"
                            ? "error"
                            : clause.riskLevel === "yüksek"
                            ? "warning"
                            : "info"
                        }
                      >
                        <ul className="space-y-1">
                          {clause.issues.map((issue, i) => (
                            <li key={i} className="text-sm">
                              • {issue.description}
                            </li>
                          ))}
                        </ul>
                      </ToolResult>
                    ))}
                </ToolResultGrid>
              </div>
            )}

            {activeTab === "compliance" && (
              <ToolResultGrid>
                <ToolResult
                  title="KVKK Uyumluluğu"
                  status={analysis.complianceStatus.kvkk.compliant ? "success" : "warning"}
                >
                  {analysis.complianceStatus.kvkk.compliant ? (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle size={16} />
                      Uyumlu
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {analysis.complianceStatus.kvkk.issues.map((issue, i) => (
                        <li key={i}>• {issue}</li>
                      ))}
                    </ul>
                  )}
                </ToolResult>

                <ToolResult
                  title="İş Kanunu"
                  status={analysis.complianceStatus.isKanunu.compliant ? "success" : "warning"}
                >
                  {analysis.complianceStatus.isKanunu.compliant ? (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle size={16} />
                      Uyumlu
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {analysis.complianceStatus.isKanunu.issues.map((issue, i) => (
                        <li key={i}>• {issue}</li>
                      ))}
                    </ul>
                  )}
                </ToolResult>

                <ToolResult
                  title="Ticaret Kanunu"
                  status={analysis.complianceStatus.ticaretKanunu.compliant ? "success" : "warning"}
                >
                  {analysis.complianceStatus.ticaretKanunu.compliant ? (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle size={16} />
                      Uyumlu
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {analysis.complianceStatus.ticaretKanunu.issues.map((issue, i) => (
                        <li key={i}>• {issue}</li>
                      ))}
                    </ul>
                  )}
                </ToolResult>

                <ToolResult
                  title="Tüketici Kanunu"
                  status={analysis.complianceStatus.tuketiciKanunu.compliant ? "success" : "warning"}
                >
                  {analysis.complianceStatus.tuketiciKanunu.compliant ? (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle size={16} />
                      Uyumlu
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {analysis.complianceStatus.tuketiciKanunu.issues.map((issue, i) => (
                        <li key={i}>• {issue}</li>
                      ))}
                    </ul>
                  )}
                </ToolResult>
              </ToolResultGrid>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" icon={<Copy size={18} />} onClick={handleCopy}>
              Kopyala
            </Button>
            <Button variant="secondary" icon={<Download size={18} />}>
              PDF İndir
            </Button>
            <div className="flex-1" />
            <Button variant="ghost" onClick={handleReset}>
              Yeni Analiz
            </Button>
          </div>
        </div>
      )}
    </ToolModal>
  );
}
