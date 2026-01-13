"use client";

import React, { useState, useMemo } from "react";
import {
  getHotTopics,
  getRecentLegislationChanges,
  getCourtStatistics,
  getAvailableCourts,
  analyzeTrend,
  getLegalAreaDistribution,
  TopicTrend,
  LegislationChange,
  CourtStatistics,
  TrendAnalysis,
} from "@/lib/legal-trends";

interface LegalTrendsPanelProps {
  onClose?: () => void;
  onSelectTopic?: (topic: string) => void;
}

type TabType = "topics" | "legislation" | "courts" | "distribution";

export function LegalTrendsPanel({ onClose, onSelectTopic }: LegalTrendsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("topics");
  const [selectedCourt, setSelectedCourt] = useState<string>("yargitay");
  const [selectedTopic, setSelectedTopic] = useState<TopicTrend | null>(null);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);

  const hotTopics = useMemo(() => getHotTopics(8), []);
  const legislationChanges = useMemo(() => getRecentLegislationChanges({ limit: 10 }), []);
  const availableCourts = useMemo(() => getAvailableCourts(), []);
  const courtStats = useMemo(() => getCourtStatistics(selectedCourt), [selectedCourt]);
  const areaDistribution = useMemo(() => getLegalAreaDistribution(), []);

  const handleTopicClick = (topic: TopicTrend) => {
    setSelectedTopic(topic);
    const analysis = analyzeTrend(topic.topic);
    setTrendAnalysis(analysis);
  };

  const getTrendIcon = (trend: TopicTrend["trend"]) => {
    switch (trend) {
      case "hot":
        return (
          <span className="text-red-500" title="Sıcak Konu">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
          </span>
        );
      case "rising":
        return (
          <span className="text-green-500" title="Yükselen">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </span>
        );
      case "declining":
        return (
          <span className="text-red-400" title="Düşen">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
            </svg>
          </span>
        );
      default:
        return (
          <span className="text-gray-400" title="Stabil">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
          </span>
        );
    }
  };

  const getImpactBadge = (impact: LegislationChange["impact"]) => {
    const colors = {
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    const labels = { high: "Yüksek Etki", medium: "Orta Etki", low: "Düşük Etki" };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[impact]}`}>
        {labels[impact]}
      </span>
    );
  };

  const getChangeTypeBadge = (type: LegislationChange["changeType"]) => {
    const colors = {
      new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      amendment: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      repeal: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      update: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };
    const labels = { new: "Yeni", amendment: "Değişiklik", repeal: "Yürürlükten Kaldırma", update: "Güncelleme" };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[type]}`}>
        {labels[type]}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Hukuki Trendler
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Güncel mevzuat değişiklikleri ve popüler konular
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

      {/* Tabs */}
      <div className="border-b dark:border-gray-700 px-6">
        <div className="flex gap-4">
          {[
            { id: "topics" as TabType, label: "Popüler Konular" },
            { id: "legislation" as TabType, label: "Mevzuat Değişiklikleri" },
            { id: "courts" as TabType, label: "Mahkeme İstatistikleri" },
            { id: "distribution" as TabType, label: "Alan Dağılımı" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Hot Topics Tab */}
        {activeTab === "topics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotTopics.map((topic, index) => (
              <div
                key={index}
                onClick={() => handleTopicClick(topic)}
                className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(topic.trend)}
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {topic.topic}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${topic.currentPopularity}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{topic.currentPopularity}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {topic.category}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {topic.relatedCases.toLocaleString()} ilgili dava
                </p>
                {topic.recentChanges.length > 0 && (
                  <div className="mt-2 pt-2 border-t dark:border-gray-600">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Son: {topic.recentChanges[0]}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Topic Detail Modal */}
            {selectedTopic && trendAnalysis && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {selectedTopic.topic}
                      </h3>
                      <button
                        onClick={() => {
                          setSelectedTopic(null);
                          setTrendAnalysis(null);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Trend Summary */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {trendAnalysis.summary.averageValue.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Ortalama Dava</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className={`text-2xl font-bold ${
                          trendAnalysis.summary.overallChangePercent > 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          {trendAnalysis.summary.overallChangePercent > 0 ? "+" : ""}
                          {trendAnalysis.summary.overallChangePercent}%
                        </p>
                        <p className="text-xs text-gray-500">Değişim</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                          {trendAnalysis.summary.direction === "increasing" && "Artış"}
                          {trendAnalysis.summary.direction === "decreasing" && "Düşüş"}
                          {trendAnalysis.summary.direction === "stable" && "Stabil"}
                          {trendAnalysis.summary.direction === "volatile" && "Değişken"}
                        </p>
                        <p className="text-xs text-gray-500">Trend</p>
                      </div>
                    </div>

                    {/* Insights */}
                    {trendAnalysis.insights.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          İçgörüler
                        </h4>
                        {trendAnalysis.insights.map((insight, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg ${
                              insight.type === "warning"
                                ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                                : insight.type === "opportunity"
                                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                                : insight.type === "prediction"
                                ? "bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
                                : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                            }`}
                          >
                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                              {insight.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {insight.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {onSelectTopic && (
                      <button
                        onClick={() => {
                          onSelectTopic(selectedTopic.topic);
                          setSelectedTopic(null);
                          setTrendAnalysis(null);
                        }}
                        className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Bu Konuda Soru Sor
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Legislation Tab */}
        {activeTab === "legislation" && (
          <div className="space-y-4">
            {legislationChanges.map((change, index) => (
              <div
                key={index}
                className="p-4 border dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {change.lawNumber} sayılı {change.lawName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(change.changeDate).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {getChangeTypeBadge(change.changeType)}
                    {getImpactBadge(change.impact)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {change.description}
                </p>
                {change.affectedArticles && change.affectedArticles.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Etkilenen maddeler: {change.affectedArticles.map(a => `m.${a}`).join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Courts Tab */}
        {activeTab === "courts" && (
          <div>
            <div className="mb-4">
              <select
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value)}
                className="px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {availableCourts.map((court) => (
                  <option key={court} value={court}>
                    {court.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {courtStats && (
              <div className="space-y-6">
                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {courtStats.totalCases.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Toplam Dava</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      %{Math.round(courtStats.acceptanceRate * 100)}
                    </p>
                    <p className="text-xs text-gray-500">Kabul Oranı</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {courtStats.avgDecisionTime}
                    </p>
                    <p className="text-xs text-gray-500">Ort. Karar Süresi (Ay)</p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {courtStats.topCategories.length}
                    </p>
                    <p className="text-xs text-gray-500">Kategori</p>
                  </div>
                </div>

                {/* Top Categories */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    En Çok Dava Açılan Alanlar
                  </h4>
                  <div className="space-y-2">
                    {courtStats.topCategories.map((cat, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-300 w-40">
                          {cat.category}
                        </span>
                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-20 text-right">
                          {cat.count.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Yearly Trend */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Yıllık Dava Sayısı Trendi
                  </h4>
                  <div className="flex items-end gap-2 h-40">
                    {courtStats.yearlyTrend.map((data, index) => {
                      const maxValue = Math.max(...courtStats.yearlyTrend.map(d => d.value));
                      const height = (data.value / maxValue) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                            style={{ height: `${height}%` }}
                            title={`${data.value.toLocaleString()} dava`}
                          />
                          <span className="text-xs text-gray-500 mt-1">{data.period}</span>
                          {data.changePercent !== undefined && data.changePercent !== 0 && (
                            <span className={`text-xs ${data.changePercent > 0 ? "text-green-500" : "text-red-500"}`}>
                              {data.changePercent > 0 ? "+" : ""}{data.changePercent}%
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Distribution Tab */}
        {activeTab === "distribution" && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">
              Hukuk Alanlarına Göre Dava Dağılımı
            </h4>
            <div className="space-y-3">
              {areaDistribution.slice(0, 10).map((area, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-300 w-48">
                    {area.area}
                  </span>
                  <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${Math.min(100, area.percentage * 2)}%` }}
                    >
                      {area.percentage > 5 && (
                        <span className="text-xs text-white font-medium">
                          %{area.percentage}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-24 text-right">
                    {area.caseCount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LegalTrendsPanel;
