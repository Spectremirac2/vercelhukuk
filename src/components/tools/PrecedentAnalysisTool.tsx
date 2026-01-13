"use client";

import React, { useState, useMemo } from "react";
import {
  searchPrecedents,
  analyzePrecedents,
  getCourtName,
  getLegalAreaName,
  getPrecedentStatusName,
  getAllYargitayChambers,
  formatAnalysisSummary,
  type PrecedentAnalysisResult,
  type PrecedentMatch,
  type LegalArea,
  type CourtType,
} from "@/lib/precedent-analysis";

export function PrecedentAnalysisTool() {
  const [query, setQuery] = useState("");
  const [facts, setFacts] = useState("");
  const [selectedArea, setSelectedArea] = useState<LegalArea>("hukuk");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PrecedentAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<"precedents" | "principles" | "timeline" | "recommendations">("precedents");

  const yargitayChambers = useMemo(() => getAllYargitayChambers(), []);

  const legalAreas: { value: LegalArea; label: string }[] = [
    { value: "hukuk", label: "Medeni Hukuk" },
    { value: "is", label: "İş Hukuku" },
    { value: "ticaret", label: "Ticaret Hukuku" },
    { value: "ceza", label: "Ceza Hukuku" },
    { value: "idare", label: "İdare Hukuku" },
    { value: "aile", label: "Aile Hukuku" },
    { value: "icra_iflas", label: "İcra İflas Hukuku" },
    { value: "tuketici", label: "Tüketici Hukuku" },
    { value: "vergi", label: "Vergi Hukuku" },
    { value: "insaat", label: "İnşaat Hukuku" },
    { value: "fikri_mulkiyet", label: "Fikri Mülkiyet" },
    { value: "anayasa", label: "Anayasa Hukuku" },
  ];

  const handleAnalyze = async () => {
    if (!query.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzePrecedents(query, {
        legalArea: selectedArea,
        facts: facts,
      });
      setAnalysisResult(result);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getApplicabilityLabel = (applicability: PrecedentMatch["applicability"]): string => {
    const labels: Record<PrecedentMatch["applicability"], string> = {
      dogrudan: "Doğrudan",
      benzer: "Benzer",
      kiyas: "Kıyas",
      zayif: "Zayıf",
    };
    return labels[applicability];
  };

  const getApplicabilityColor = (applicability: PrecedentMatch["applicability"]): string => {
    const colors: Record<PrecedentMatch["applicability"], string> = {
      dogrudan: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      benzer: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      kiyas: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      zayif: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return colors[applicability];
  };

  return (
    <div className="h-full flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">İçtihat Analizi</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Gelişmiş emsal ve içtihat araştırması</p>
          </div>
        </div>

        {/* Yargıtay Daireleri Quick Info */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {yargitayChambers.slice(0, 6).map((chamber) => (
            <div
              key={chamber.code}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)] text-xs"
            >
              <span className="font-medium text-[var(--foreground)]">{chamber.code}</span>
              <span className="text-[var(--muted-foreground)] ml-1">
                {chamber.specialization.slice(0, 2).join(", ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {!analysisResult ? (
          <div className="space-y-4">
            {/* Legal Issue Input */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Hukuki Sorun <span className="text-red-500">*</span>
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Analiz etmek istediğiniz hukuki sorunu açıklayın... Örn: İşverenin ekonomik nedenlerle fesih yapması halinde son çare ilkesinin uygulanması"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-[var(--input-background)] border border-[var(--border-color)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              />
            </div>

            {/* Facts Input */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Olay Özeti (Opsiyonel)
              </label>
              <textarea
                value={facts}
                onChange={(e) => setFacts(e.target.value)}
                placeholder="Davanızın olaylarını kısaca özetleyin..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-[var(--input-background)] border border-[var(--border-color)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              />
            </div>

            {/* Legal Area Selection */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Hukuk Alanı
              </label>
              <div className="grid grid-cols-3 gap-2">
                {legalAreas.map((area) => (
                  <button
                    key={area.value}
                    onClick={() => setSelectedArea(area.value)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedArea === area.value
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--input-background)] text-[var(--foreground)] hover:bg-[var(--border-color)]"
                    }`}
                  >
                    {area.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!query.trim() || isAnalyzing}
              className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analiz Ediliyor...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  İçtihat Analizi Yap
                </>
              )}
            </button>

            {/* Info Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20">
              <h4 className="text-sm font-semibold text-rose-700 dark:text-rose-400 mb-2">
                📊 İçtihat Analizi Ne Yapar?
              </h4>
              <ul className="text-sm text-rose-600 dark:text-rose-300 space-y-1">
                <li>• İlgili Yargıtay ve Danıştay kararlarını bulur</li>
                <li>• Ratio decidendi (bağlayıcı ilke) çıkarır</li>
                <li>• Zaman içindeki içtihat evrimini gösterir</li>
                <li>• Çelişen görüşleri tespit eder</li>
                <li>• Pratik önerilerde bulunur</li>
              </ul>
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-4">
            <button
              onClick={() => setAnalysisResult(null)}
              className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              ← Yeni Analiz
            </button>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)] text-center">
                <div className="text-2xl font-bold text-[var(--foreground)]">
                  {analysisResult.relevantPrecedents.length}
                </div>
                <div className="text-xs text-[var(--muted-foreground)]">İlgili Karar</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)] text-center">
                <div className="text-2xl font-bold text-[var(--foreground)]">
                  {analysisResult.principlesExtracted.length}
                </div>
                <div className="text-xs text-[var(--muted-foreground)]">Çıkarılan İlke</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)] text-center">
                <div className="text-2xl font-bold text-[var(--foreground)]">
                  {analysisResult.processingTimeMs}ms
                </div>
                <div className="text-xs text-[var(--muted-foreground)]">İşlem Süresi</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-[var(--input-background)]">
              {[
                { id: "precedents", label: "Emsaller", count: analysisResult.relevantPrecedents.length },
                { id: "principles", label: "İlkeler", count: analysisResult.principlesExtracted.length },
                { id: "timeline", label: "Zaman Çizelgesi", count: analysisResult.timelineAnalysis.length },
                { id: "recommendations", label: "Öneriler", count: analysisResult.recommendations.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-gray-800 text-[var(--foreground)] shadow"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-1 text-xs opacity-75">({tab.count})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-3">
              {/* Precedents Tab */}
              {activeTab === "precedents" && (
                <>
                  {analysisResult.relevantPrecedents.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)] text-center">
                      <p className="text-[var(--muted-foreground)]">İlgili emsal bulunamadı.</p>
                    </div>
                  ) : (
                    analysisResult.relevantPrecedents.map((match, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)]"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="text-sm font-medium text-[var(--primary)]">
                              {getCourtName(match.precedent.court)} {match.precedent.chamber}
                            </span>
                            <p className="text-sm text-[var(--foreground)]">
                              {match.precedent.caseNumber.fullCitation}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getApplicabilityColor(match.applicability)}`}>
                              {getApplicabilityLabel(match.applicability)}
                            </span>
                            <span className="text-xs font-bold text-[var(--foreground)]">
                              %{Math.round(match.relevanceScore * 100)}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-[var(--foreground)] mb-2">{match.precedent.subject}</p>

                        {match.precedent.headnote && (
                          <p className="text-sm text-[var(--muted-foreground)] italic mb-2">
                            "{match.precedent.headnote}"
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded bg-[var(--input-background)] text-[var(--muted-foreground)]">
                            {getLegalAreaName(match.precedent.legalArea)}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[var(--input-background)] text-[var(--muted-foreground)]">
                            {getPrecedentStatusName(match.precedent.status)}
                          </span>
                        </div>

                        {match.matchedKeywords.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {match.matchedKeywords.map((kw, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </>
              )}

              {/* Principles Tab */}
              {activeTab === "principles" && (
                <>
                  {analysisResult.principlesExtracted.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)] text-center">
                      <p className="text-[var(--muted-foreground)]">Çıkarılabilecek ilke bulunamadı.</p>
                    </div>
                  ) : (
                    analysisResult.principlesExtracted.map((principle, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)]"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-[var(--foreground)]">İlke #{index + 1}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            principle.currentValidity === "gecerli"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : principle.currentValidity === "belirsiz"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}>
                            {principle.currentValidity === "gecerli" ? "Geçerli" : principle.currentValidity === "belirsiz" ? "Belirsiz" : "Geçersiz"}
                          </span>
                        </div>

                        <p className="text-sm text-[var(--foreground)] mb-2">{principle.principle}</p>

                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 mb-2">
                          <p className="text-xs text-blue-700 dark:text-blue-400">
                            💡 {principle.practicalGuidance}
                          </p>
                        </div>

                        <div className="text-xs text-[var(--muted-foreground)]">
                          Kaynaklar: {principle.sources.map(s => s.caseNumber).join(", ")}
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

              {/* Timeline Tab */}
              {activeTab === "timeline" && (
                <>
                  {analysisResult.timelineAnalysis.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)] text-center">
                      <p className="text-[var(--muted-foreground)]">Zaman çizelgesi oluşturulamadı.</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--border-color)]" />
                      {analysisResult.timelineAnalysis.map((point, index) => (
                        <div key={index} className="relative pl-10 pb-4">
                          <div className={`absolute left-2 w-4 h-4 rounded-full ${
                            point.event === "ilk_karar"
                              ? "bg-green-500"
                              : point.event === "birlestirme"
                                ? "bg-purple-500"
                                : point.event === "degisiklik"
                                  ? "bg-orange-500"
                                  : "bg-blue-500"
                          }`} />
                          <div className="p-3 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-[var(--muted-foreground)]">
                                {new Date(point.date).toLocaleDateString("tr-TR")}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                point.event === "ilk_karar"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : point.event === "birlestirme"
                                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              }`}>
                                {point.event === "ilk_karar" ? "İlk Karar" : point.event === "birlestirme" ? "Birleştirme" : point.event === "takip" ? "Takip" : "Değişiklik"}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-[var(--foreground)]">{point.caseNumber}</p>
                            <p className="text-sm text-[var(--muted-foreground)]">{point.description}</p>
                            <p className="text-xs text-[var(--primary)] mt-1">{point.impact}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Recommendations Tab */}
              {activeTab === "recommendations" && (
                <>
                  {analysisResult.recommendations.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)] text-center">
                      <p className="text-[var(--muted-foreground)]">Öneri üretilemedi.</p>
                    </div>
                  ) : (
                    analysisResult.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl border ${
                          rec.type === "emsal_kullan"
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            : rec.type === "dikkat"
                              ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                              : rec.type === "alternatif"
                                ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                                : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-xl">
                            {rec.type === "emsal_kullan" ? "✅" : rec.type === "dikkat" ? "⚠️" : rec.type === "alternatif" ? "💡" : "🔄"}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-semibold ${
                                rec.type === "emsal_kullan"
                                  ? "text-green-700 dark:text-green-400"
                                  : rec.type === "dikkat"
                                    ? "text-yellow-700 dark:text-yellow-400"
                                    : rec.type === "alternatif"
                                      ? "text-purple-700 dark:text-purple-400"
                                      : "text-blue-700 dark:text-blue-400"
                              }`}>
                                {rec.title}
                              </h4>
                              <span className="text-xs opacity-75">
                                Güven: %{Math.round(rec.confidence * 100)}
                              </span>
                            </div>
                            <p className={`text-sm mt-1 ${
                              rec.type === "emsal_kullan"
                                ? "text-green-600 dark:text-green-300"
                                : rec.type === "dikkat"
                                  ? "text-yellow-600 dark:text-yellow-300"
                                  : rec.type === "alternatif"
                                    ? "text-purple-600 dark:text-purple-300"
                                    : "text-blue-600 dark:text-blue-300"
                            }`}>
                              {rec.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
