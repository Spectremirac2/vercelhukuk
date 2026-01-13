"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ToolModal, ToolSection } from "./ToolModal";
import { compareDocuments, formatComparisonReport, type ComparisonResult } from "@/lib/document-comparison";
import { GitCompare } from "lucide-react";

interface DocumentComparisonToolProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentComparisonTool({ isOpen, onClose }: DocumentComparisonToolProps) {
  const [originalText, setOriginalText] = useState("");
  const [newText, setNewText] = useState("");
  const [originalName, setOriginalName] = useState("Orijinal Belge");
  const [newName, setNewName] = useState("Güncel Belge");
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"input" | "summary" | "changes" | "clauses">("input");

  const handleCompare = async () => {
    if (!originalText.trim() || !newText.trim()) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const comparison = compareDocuments(originalText, newText, originalName, newName);
    setResult(comparison);
    setActiveTab("summary");
    setLoading(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "text-red-400 bg-red-500/10";
      case "high": return "text-orange-400 bg-orange-500/10";
      case "medium": return "text-yellow-400 bg-yellow-500/10";
      case "low": return "text-green-400 bg-green-500/10";
      default: return "text-gray-400 bg-gray-500/10";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "major": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "minor": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case "added": return "➕";
      case "removed": return "➖";
      case "modified": return "✏️";
      case "moved": return "↔️";
      default: return "•";
    }
  };

  return (
    <ToolModal
      isOpen={isOpen}
      onClose={onClose}
      title="Belge Karşılaştırma"
      description="İki belge arasındaki farkları analiz edin ve risk değerlendirmesi yapın"
      icon={<GitCompare size={24} />}
      size="xl"
    >
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-lg">
        {[
          { id: "input", label: "Belge Girişi", icon: "📝" },
          { id: "summary", label: "Özet", icon: "📊", disabled: !result },
          { id: "changes", label: "Değişiklikler", icon: "🔄", disabled: !result },
          { id: "clauses", label: "Madde Analizi", icon: "📑", disabled: !result },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id as typeof activeTab)}
            disabled={tab.disabled}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
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
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Original Document */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Orijinal Belge
              </label>
              <input
                type="text"
                value={originalName}
                onChange={(e) => setOriginalName(e.target.value)}
                placeholder="Belge adı"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Orijinal sözleşme metnini buraya yapıştırın..."
                className="w-full h-64 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              />
              <p className="text-xs text-gray-500">
                {originalText.length} karakter, {originalText.split(/\s+/).filter(Boolean).length} kelime
              </p>
            </div>

            {/* New Document */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Güncel Belge
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Belge adı"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Güncel/değiştirilmiş sözleşme metnini buraya yapıştırın..."
                className="w-full h-64 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              />
              <p className="text-xs text-gray-500">
                {newText.length} karakter, {newText.split(/\s+/).filter(Boolean).length} kelime
              </p>
            </div>
          </div>

          <Button
            onClick={handleCompare}
            disabled={loading || !originalText.trim() || !newText.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⚙️</span>
                Karşılaştırılıyor...
              </>
            ) : (
              <>
                🔍 Belgeleri Karşılaştır
              </>
            )}
          </Button>
        </div>
      )}

      {/* Summary Tab */}
      {activeTab === "summary" && result && (
        <div className="space-y-6">
          {/* Risk Score */}
          <div className={`p-6 rounded-xl border ${getRiskColor(result.summary.riskLevel)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Risk Değerlendirmesi</h3>
                <p className="text-sm opacity-80">
                  {result.summary.riskLevel === "critical" ? "Kritik risk - acil inceleme gerekli" :
                   result.summary.riskLevel === "high" ? "Yüksek risk - dikkatli inceleme gerekli" :
                   result.summary.riskLevel === "medium" ? "Orta risk - gözden geçirilmeli" :
                   "Düşük risk - küçük değişiklikler"}
                </p>
              </div>
              <div className="text-4xl font-bold">
                %{Math.round(result.summary.overallRiskScore * 100)}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{result.summary.addedCount}</div>
              <div className="text-sm text-gray-400">Eklenen</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{result.summary.removedCount}</div>
              <div className="text-sm text-gray-400">Silinen</div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{result.summary.modifiedCount}</div>
              <div className="text-sm text-gray-400">Değiştirilen</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{result.summary.totalChanges}</div>
              <div className="text-sm text-gray-400">Toplam</div>
            </div>
          </div>

          {/* Key Findings */}
          {result.summary.keyFindings.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>🔍</span> Önemli Bulgular
              </h3>
              <ul className="space-y-2">
                {result.summary.keyFindings.map((finding, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span>💼</span> Öneriler
            </h3>
            <ul className="space-y-2">
              {result.summary.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Processing Info */}
          <div className="text-xs text-gray-500 text-center">
            İşlem süresi: {result.processingTimeMs}ms | 
            Oluşturulma: {result.createdAt.toLocaleString("tr-TR")}
          </div>
        </div>
      )}

      {/* Changes Tab */}
      {activeTab === "changes" && result && (
        <div className="space-y-4">
          {/* Severity Filter */}
          <div className="flex gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs ${getSeverityColor("critical")}`}>
              Kritik: {result.summary.criticalChanges}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs ${getSeverityColor("major")}`}>
              Önemli: {result.summary.majorChanges}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs ${getSeverityColor("minor")}`}>
              Küçük: {result.summary.minorChanges}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs ${getSeverityColor("cosmetic")}`}>
              Biçimsel: {result.summary.cosmeticChanges}
            </span>
          </div>

          {/* Changes List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {result.changes.map((change) => (
              <div
                key={change.id}
                className={`p-4 rounded-xl border ${getSeverityColor(change.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getChangeIcon(change.type)}</span>
                    <span className="font-medium">{change.description}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(change.severity)}`}>
                    {change.severity}
                  </span>
                </div>

                {change.originalText && (
                  <div className="mt-2 p-2 bg-red-500/10 rounded text-sm">
                    <span className="text-red-400 font-medium">Eski:</span>
                    <p className="text-gray-300 mt-1 line-clamp-3">{change.originalText}</p>
                  </div>
                )}

                {change.newText && (
                  <div className="mt-2 p-2 bg-green-500/10 rounded text-sm">
                    <span className="text-green-400 font-medium">Yeni:</span>
                    <p className="text-gray-300 mt-1 line-clamp-3">{change.newText}</p>
                  </div>
                )}

                {change.legalImplication && (
                  <div className="mt-2 text-sm text-yellow-400 flex items-center gap-1">
                    ⚠️ {change.legalImplication}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clauses Tab */}
      {activeTab === "clauses" && result && (
        <div className="space-y-4">
          {result.clauseComparisons.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Madde bazlı değişiklik tespit edilmedi
            </div>
          ) : (
            <div className="grid gap-3">
              {result.clauseComparisons.map((clause) => (
                <div
                  key={clause.clauseCategory}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {clause.overallChange === "added" ? "➕" :
                         clause.overallChange === "removed" ? "➖" :
                         clause.overallChange === "modified" ? "✏️" : "✓"}
                      </span>
                      <span className="font-medium">{clause.clauseName}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(clause.riskAssessment.level)}`}>
                      {clause.riskAssessment.level}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400 mb-2">
                    {clause.changes.length} değişiklik: {clause.riskAssessment.reason}
                  </p>

                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>Orijinal: {clause.originalPresent ? "✓ Var" : "✗ Yok"}</span>
                    <span>Güncel: {clause.newPresent ? "✓ Var" : "✗ Yok"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
    </ToolModal>
  );
}
