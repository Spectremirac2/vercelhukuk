"use client";

import React, { useState, useMemo } from "react";
import {
  findSimilarCases,
  searchCasesByText,
  getCasesByLegalArea,
  getRecentCases,
  buildPrecedentChain,
  findCasesByLaw,
  getCaseStatistics,
  CaseDocument,
  SimilarCaseResult,
  CaseSearchQuery,
  PrecedentChain,
} from "@/lib/similar-cases";

interface SimilarCasesPanelProps {
  onClose?: () => void;
  onSelectCase?: (caseDoc: CaseDocument) => void;
  initialQuery?: string;
}

type TabType = "search" | "recent" | "byArea" | "byLaw";

export function SimilarCasesPanel({
  onClose,
  onSelectCase,
  initialQuery = "",
}: SimilarCasesPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("search");
  const [searchText, setSearchText] = useState(initialQuery);
  const [selectedLegalArea, setSelectedLegalArea] = useState("iş hukuku");
  const [selectedLawNumber, setSelectedLawNumber] = useState("4857");
  const [searchResults, setSearchResults] = useState<SimilarCaseResult[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseDocument | null>(null);
  const [precedentChain, setPrecedentChain] = useState<PrecedentChain | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const recentCases = useMemo(() => getRecentCases(5), []);
  const caseStats = useMemo(() => getCaseStatistics(), []);

  const legalAreas = [
    "iş hukuku",
    "borçlar hukuku",
    "aile hukuku",
    "ticaret hukuku",
    "ceza hukuku",
    "idare hukuku",
  ];

  const majorLaws = [
    { number: "4857", name: "İş Kanunu" },
    { number: "6098", name: "Türk Borçlar Kanunu" },
    { number: "4721", name: "Türk Medeni Kanunu" },
    { number: "6102", name: "Türk Ticaret Kanunu" },
    { number: "5237", name: "Türk Ceza Kanunu" },
    { number: "6100", name: "Hukuk Muhakemeleri Kanunu" },
  ];

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      const results = searchCasesByText(searchText, 10);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleSearchByArea = () => {
    setIsSearching(true);
    setTimeout(() => {
      const cases = getCasesByLegalArea(selectedLegalArea);
      setSearchResults(
        cases.map((c) => ({
          case: c,
          similarity: { overall: 1, factSimilarity: 1, legalIssueSimilarity: 1, lawSimilarity: 1, outcomeSimilarity: 1 },
          matchingFactors: [],
          relevanceExplanation: `${selectedLegalArea} alanında karar`,
        }))
      );
      setIsSearching(false);
    }, 500);
  };

  const handleSearchByLaw = () => {
    setIsSearching(true);
    setTimeout(() => {
      const cases = findCasesByLaw(parseInt(selectedLawNumber));
      setSearchResults(
        cases.map((c) => ({
          case: c,
          similarity: { overall: 1, factSimilarity: 1, legalIssueSimilarity: 1, lawSimilarity: 1, outcomeSimilarity: 1 },
          matchingFactors: [],
          relevanceExplanation: `${selectedLawNumber} sayılı Kanun uygulanmış`,
        }))
      );
      setIsSearching(false);
    }, 500);
  };

  const handleViewCase = (caseDoc: CaseDocument) => {
    setSelectedCase(caseDoc);
    const chain = buildPrecedentChain(caseDoc.id);
    setPrecedentChain(chain);
  };

  const getOutcomeLabel = (outcome: string) => {
    const labels: Record<string, string> = {
      kabul: "Kabul",
      kismi_kabul: "Kısmi Kabul",
      red: "Red",
      bozma: "Bozma",
      onama: "Onama",
      dusme: "Düşme",
      gonderme: "Gönderme",
    };
    return labels[outcome] || outcome;
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "kabul":
      case "onama":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "kismi_kabul":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "red":
      case "bozma":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Emsal Karar Arama
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Benzer içtihat ve kararları bulun
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

      {/* Case Detail View */}
      {selectedCase && (
        <div className="flex-1 overflow-y-auto p-6">
          <button
            onClick={() => {
              setSelectedCase(null);
              setPrecedentChain(null);
            }}
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm mb-4 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Geri
          </button>

          <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
            {/* Case Header */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {selectedCase.court} {selectedCase.chamber}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedCase.caseNumber}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(selectedCase.date).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOutcomeColor(selectedCase.outcome)}`}>
                  {getOutcomeLabel(selectedCase.outcome)}
                </span>
              </div>
            </div>

            {/* Case Content */}
            <div className="p-4 space-y-4">
              {/* Facts */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Olay Özeti
                </h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {selectedCase.facts}
                </p>
              </div>

              {/* Legal Issues */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Hukuki Sorunlar
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.legalIssues.map((issue, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                    >
                      {issue}
                    </span>
                  ))}
                </div>
              </div>

              {/* Applied Laws */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Uygulanan Mevzuat
                </h4>
                <div className="space-y-1">
                  {selectedCase.appliedLaws.map((law, index) => (
                    <p key={index} className="text-sm text-gray-600 dark:text-gray-300">
                      {law.lawNumber} sayılı {law.lawName} m.{law.articles.join(", ")}
                    </p>
                  ))}
                </div>
              </div>

              {/* Decision */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Karar
                </h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {selectedCase.decision}
                </p>
              </div>

              {/* Keywords */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Anahtar Kelimeler
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Precedent Chain */}
              {precedentChain && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Atıf Zinciri
                  </h4>
                  {precedentChain.precedents.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Atıf Yapılan Kararlar</p>
                      <div className="space-y-2">
                        {precedentChain.precedents.map((p, index) => (
                          <div
                            key={index}
                            onClick={() => handleViewCase(p.case)}
                            className="p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {p.case.caseNumber}
                            </p>
                            <p className="text-xs text-gray-500">
                              {p.case.court} - {p.relationship}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {precedentChain.followers.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Bu Karara Atıf Yapan Kararlar</p>
                      <div className="space-y-2">
                        {precedentChain.followers.map((f, index) => (
                          <div
                            key={index}
                            onClick={() => handleViewCase(f.case)}
                            className="p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {f.case.caseNumber}
                            </p>
                            <p className="text-xs text-gray-500">{f.case.court}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {precedentChain.precedents.length === 0 && precedentChain.followers.length === 0 && (
                    <p className="text-sm text-gray-500">Atıf bilgisi bulunamadı.</p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            {onSelectCase && (
              <div className="p-4 border-t dark:border-gray-700">
                <button
                  onClick={() => onSelectCase(selectedCase)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Bu Kararı Seç
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      {!selectedCase && (
        <>
          {/* Tabs */}
          <div className="border-b dark:border-gray-700 px-6">
            <div className="flex gap-4">
              {[
                { id: "search" as TabType, label: "Metin Arama" },
                { id: "recent" as TabType, label: "Son Kararlar" },
                { id: "byArea" as TabType, label: "Alana Göre" },
                { id: "byLaw" as TabType, label: "Kanuna Göre" },
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

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Text Search Tab */}
            {activeTab === "search" && (
              <div>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Dava olayları veya anahtar kelime girin..."
                    className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={isSearching || !searchText.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSearching ? "Aranıyor..." : "Ara"}
                  </button>
                </div>

                {/* Search Tips */}
                {searchResults.length === 0 && !isSearching && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="mb-2">Benzer karar aramak için dava olaylarını girin</p>
                    <p className="text-sm">
                      Örnek: &quot;işçi performans düşüklüğü fesih&quot;
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Recent Cases Tab */}
            {activeTab === "recent" && (
              <div className="space-y-3">
                {recentCases.map((caseDoc, index) => (
                  <div
                    key={index}
                    onClick={() => handleViewCase(caseDoc)}
                    className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {caseDoc.court} {caseDoc.chamber}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {caseDoc.caseNumber}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs ${getOutcomeColor(caseDoc.outcome)}`}>
                        {getOutcomeLabel(caseDoc.outcome)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {caseDoc.facts}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(caseDoc.date).toLocaleDateString("tr-TR")} | {caseDoc.legalArea}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* By Area Tab */}
            {activeTab === "byArea" && (
              <div>
                <div className="flex gap-2 mb-4">
                  <select
                    value={selectedLegalArea}
                    onChange={(e) => setSelectedLegalArea(e.target.value)}
                    className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {legalAreas.map((area) => (
                      <option key={area} value={area}>
                        {area.charAt(0).toUpperCase() + area.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSearchByArea}
                    disabled={isSearching}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSearching ? "Aranıyor..." : "Listele"}
                  </button>
                </div>
              </div>
            )}

            {/* By Law Tab */}
            {activeTab === "byLaw" && (
              <div>
                <div className="flex gap-2 mb-4">
                  <select
                    value={selectedLawNumber}
                    onChange={(e) => setSelectedLawNumber(e.target.value)}
                    className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {majorLaws.map((law) => (
                      <option key={law.number} value={law.number}>
                        {law.number} sayılı {law.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSearchByLaw}
                    disabled={isSearching}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSearching ? "Aranıyor..." : "Listele"}
                  </button>
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-3 mt-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Sonuçlar ({searchResults.length})
                </h4>
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => handleViewCase(result.case)}
                    className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {result.case.court} {result.case.chamber}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {result.case.caseNumber}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.similarity.overall > 0 && (
                          <span className="text-xs text-gray-500">
                            %{Math.round(result.similarity.overall * 100)} benzerlik
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-xs ${getOutcomeColor(result.case.outcome)}`}>
                          {getOutcomeLabel(result.case.outcome)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {result.case.facts}
                    </p>
                    {result.matchingFactors.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.matchingFactors.slice(0, 3).map((factor, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs"
                          >
                            {factor.description}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SimilarCasesPanel;
