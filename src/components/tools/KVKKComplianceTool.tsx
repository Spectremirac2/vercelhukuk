"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ToolModal } from "./ToolModal";
import {
  checkKVKK2025Compliance,
  formatSeverity,
  formatCategory,
  getFineLimits,
  type KVKK2025ComplianceResult,
} from "@/lib/kvkk-2025";
import { Shield } from "lucide-react";

interface KVKKComplianceToolProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KVKKComplianceTool({ isOpen, onClose }: KVKKComplianceToolProps) {
  const [text, setText] = useState("");
  const [documentType, setDocumentType] = useState<"sozlesme" | "politika" | "aydinlatma" | "riza_metni" | "sms" | "genel">("genel");
  const [result, setResult] = useState<KVKK2025ComplianceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"input" | "findings" | "actions" | "fines">("input");

  const documentTypes = [
    { value: "genel", label: "Genel Belge", icon: "📄" },
    { value: "sozlesme", label: "Sözleşme", icon: "📝" },
    { value: "politika", label: "Politika Belgesi", icon: "📋" },
    { value: "aydinlatma", label: "Aydınlatma Metni", icon: "💡" },
    { value: "riza_metni", label: "Rıza Metni", icon: "✅" },
    { value: "sms", label: "SMS Metni", icon: "📱" },
  ];

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));

    const compliance = checkKVKK2025Compliance(text, documentType);
    setResult(compliance);
    setActiveTab("findings");
    setLoading(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "kritik": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "yuksek": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "orta": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "dusuk": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uyumlu": return "from-green-500 to-emerald-500";
      case "kismen_uyumlu": return "from-yellow-500 to-orange-500";
      case "uyumsuz": return "from-red-500 to-rose-500";
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

  const fineLimits = getFineLimits();

  return (
    <ToolModal
      isOpen={isOpen}
      onClose={onClose}
      title="KVKK 2025 Uyumluluk Kontrolü"
      description="Belgelerinizi 2025 KVKK düzenlemelerine göre kontrol edin"
      icon={<Shield size={24} />}
      size="xl"
    >
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-lg">
        {[
          { id: "input", label: "Belge Girişi", icon: "📝" },
          { id: "findings", label: "Bulgular", icon: "🔍", disabled: !result },
          { id: "actions", label: "Aksiyonlar", icon: "⚡", disabled: !result },
          { id: "fines", label: "Ceza Riski", icon: "⚠️", disabled: !result },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id as typeof activeTab)}
            disabled={tab.disabled}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
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
          {/* Document Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Belge Türü
            </label>
            <div className="grid grid-cols-3 gap-2">
              {documentTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setDocumentType(type.value as typeof documentType)}
                  className={`p-3 rounded-xl border transition-all ${
                    documentType === type.value
                      ? "bg-violet-500/20 border-violet-500/50 text-violet-400"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <span className="text-lg mr-2">{type.icon}</span>
                  <span className="text-sm">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Belge Metni
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="KVKK uyumluluğunu kontrol etmek istediğiniz belge metnini buraya yapıştırın..."
              className="w-full h-64 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
            />
            <p className="text-xs text-gray-500">
              {text.length} karakter
            </p>
          </div>

          {/* Quick Info */}
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
            <h4 className="font-medium text-violet-300 mb-2">🔒 KVKK 2025 Kontrol Kapsamı</h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• 2025/1072 SMS Doğrulama Kodu Düzenlemesi</li>
              <li>• Sağlık Verisi Yönetmeliği (Aralık 2025)</li>
              <li>• Yurtdışı Veri Aktarım Rehberi</li>
              <li>• Otomatik Karar Alma Kuralları</li>
              <li>• Aydınlatma ve Açık Rıza Gereksinimleri</li>
            </ul>
          </div>

          <Button onClick={handleAnalyze} disabled={loading || !text.trim()} className="w-full">
            {loading ? (
              <>
                <span className="animate-spin mr-2">⚙️</span>
                Analiz Ediliyor...
              </>
            ) : (
              <>
                🔒 KVKK 2025 Uyumluluğunu Kontrol Et
              </>
            )}
          </Button>
        </div>
      )}

      {/* Findings Tab */}
      {activeTab === "findings" && result && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className={`p-6 rounded-xl bg-gradient-to-r ${getStatusColor(result.status)} bg-opacity-20`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Uyumluluk Durumu</h3>
                <p className="text-sm text-white/70 mt-1">
                  {result.status === "uyumlu" ? "Belge KVKK 2025 gereksinimlerini karşılıyor" :
                   result.status === "kismen_uyumlu" ? "Bazı düzeltmeler gerekli" :
                   "Ciddi uyumluluk eksiklikleri tespit edildi"}
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">%{result.overallScore}</div>
                <div className="text-sm text-white/70">Uyumluluk Puanı</div>
              </div>
            </div>
          </div>

          {/* Findings by Severity */}
          {result.findings.length === 0 ? (
            <div className="text-center py-8 bg-green-500/10 border border-green-500/20 rounded-xl">
              <span className="text-4xl">✅</span>
              <p className="text-green-400 mt-2 font-medium">Tebrikler! Herhangi bir uyumluluk sorunu tespit edilmedi.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-300">
                Bulgular ({result.findings.length})
              </h4>
              {result.findings.map((finding) => (
                <div
                  key={finding.id}
                  className={`p-4 rounded-xl border ${getSeverityColor(finding.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className={`px-2 py-0.5 rounded text-xs mr-2 ${getSeverityColor(finding.severity)}`}>
                        {formatSeverity(finding.severity)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatCategory(finding.category)}
                      </span>
                    </div>
                    {finding.fineRange && (
                      <span className="text-xs text-red-400">
                        {formatCurrency(finding.fineRange.min)} - {formatCurrency(finding.fineRange.max)}
                      </span>
                    )}
                  </div>

                  <h5 className="font-medium text-white mb-1">{finding.title}</h5>
                  <p className="text-sm text-gray-400 mb-2">{finding.description}</p>

                  <div className="flex items-start gap-2 text-xs text-gray-500 mb-2">
                    <span>📖</span>
                    <span>{finding.legalReference}</span>
                  </div>

                  <div className="mt-2 p-2 bg-white/5 rounded-lg">
                    <span className="text-xs text-blue-400">💡 Çözüm:</span>
                    <p className="text-sm text-gray-300 mt-1">{finding.remediation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions Tab */}
      {activeTab === "actions" && result && (
        <div className="space-y-4">
          {result.requiredActions.length === 0 ? (
            <div className="text-center py-8 bg-green-500/10 border border-green-500/20 rounded-xl">
              <span className="text-4xl">🎉</span>
              <p className="text-green-400 mt-2 font-medium">Acil aksiyon gerektiren bulgu yok!</p>
            </div>
          ) : (
            <>
              <h4 className="font-medium text-gray-300">
                Gerekli Aksiyonlar ({result.requiredActions.length})
              </h4>
              {result.requiredActions.map((action) => (
                <div
                  key={action.id}
                  className={`p-4 rounded-xl border ${
                    action.priority === "acil" ? "bg-red-500/10 border-red-500/30" :
                    action.priority === "yuksek" ? "bg-orange-500/10 border-orange-500/30" :
                    "bg-yellow-500/10 border-yellow-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      action.priority === "acil" ? "bg-red-500/20 text-red-400" :
                      action.priority === "yuksek" ? "bg-orange-500/20 text-orange-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {action.priority === "acil" ? "⚡ ACİL" :
                       action.priority === "yuksek" ? "🔥 YÜKSEK" : "⚠️ ORTA"}
                    </span>
                    <span className="text-sm text-gray-500">Süre: {action.deadline}</span>
                  </div>

                  <h5 className="font-medium text-white mb-1">{action.title}</h5>
                  <p className="text-sm text-gray-400 mb-2">{action.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>👤 Sorumlu: {action.responsibleRole}</span>
                    <span className={`px-2 py-0.5 rounded ${
                      action.status === "tamamlandi" ? "bg-green-500/20 text-green-400" :
                      action.status === "devam_ediyor" ? "bg-blue-500/20 text-blue-400" :
                      "bg-gray-500/20 text-gray-400"
                    }`}>
                      {action.status === "tamamlandi" ? "Tamamlandı" :
                       action.status === "devam_ediyor" ? "Devam Ediyor" : "Beklemede"}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-6">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <span>💡</span> Öneriler
              </h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-violet-400">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Fines Tab */}
      {activeTab === "fines" && result && (
        <div className="space-y-6">
          {/* Estimated Fine Risk */}
          <div className={`p-6 rounded-xl border ${
            result.estimatedFineRisk.probability === "yuksek" ? "bg-red-500/10 border-red-500/30" :
            result.estimatedFineRisk.probability === "orta" ? "bg-orange-500/10 border-orange-500/30" :
            "bg-green-500/10 border-green-500/30"
          }`}>
            <h3 className="text-lg font-semibold text-white mb-4">Tahmini Ceza Riski</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-400 mb-1">Minimum</div>
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(result.estimatedFineRisk.min)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Olasılık</div>
                <div className={`text-2xl font-bold ${
                  result.estimatedFineRisk.probability === "yuksek" ? "text-red-400" :
                  result.estimatedFineRisk.probability === "orta" ? "text-orange-400" :
                  "text-green-400"
                }`}>
                  {result.estimatedFineRisk.probability === "yuksek" ? "Yüksek" :
                   result.estimatedFineRisk.probability === "orta" ? "Orta" : "Düşük"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Maksimum</div>
                <div className="text-2xl font-bold text-red-400">
                  {formatCurrency(result.estimatedFineRisk.max)}
                </div>
              </div>
            </div>
          </div>

          {/* 2025 Fine Limits Reference */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <span>📊</span> 2025 KVKK Ceza Limitleri
            </h4>
            <div className="space-y-3">
              {Object.entries(fineLimits).map(([key, limit]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-300 text-sm">{limit.description}</div>
                    <div className="text-xs text-gray-500">{limit.article}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-red-400">
                      {formatCurrency(limit.min)} - {formatCurrency(limit.max)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-300 dark:border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium mb-1">Önemli Uyarı</p>
                <p className="text-yellow-700 dark:text-yellow-300/80 text-xs">
                  Bu tahminler bilgilendirme amaçlıdır. Gerçek cezalar Kişisel Verileri Koruma Kurulu 
                  tarafından somut olay bazında değerlendirilerek belirlenir. İhlal tekrarı, 
                  kasıt unsuru ve etkilenen kişi sayısı ceza miktarını artırabilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </ToolModal>
  );
}
