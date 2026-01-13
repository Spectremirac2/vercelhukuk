"use client";

import React, { useState, useMemo } from "react";
import {
  findSimilarCases,
  searchCasesByText,
  getRecentCases,
  getCaseStatistics,
  getLandmarkCases,
  getCaseById,
  buildPrecedentChain,
  type CaseDocument,
  type CaseSearchQuery,
  type SimilarCaseResult,
  type CaseOutcome,
} from "@/lib/similar-cases";

export function SimilarCasesTool() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<SimilarCaseResult[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseDocument | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<CaseSearchQuery>({
    limit: 10,
  });

  const recentCases = useMemo(() => getRecentCases(5), []);
  const landmarkCases = useMemo(() => getLandmarkCases(3), []);
  const statistics = useMemo(() => getCaseStatistics(), []);

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    setIsSearching(true);
    try {
      const results = findSimilarCases({
        text: searchText,
        ...filters,
      });
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCaseClick = (caseDoc: CaseDocument) => {
    setSelectedCase(caseDoc);
  };

  const getOutcomeLabel = (outcome: CaseOutcome): string => {
    const labels: Record<CaseOutcome, string> = {
      kabul: "Kabul",
      kismi_kabul: "Kısmi Kabul",
      red: "Red",
      bozma: "Bozma",
      onama: "Onama",
      dusme: "Düşme",
      gonderme: "Gönderme",
    };
    return labels[outcome];
  };

  const getOutcomeColor = (outcome: CaseOutcome): string => {
    const colors: Record<CaseOutcome, string> = {
      kabul: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      kismi_kabul: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      bozma: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      onama: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      dusme: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      gonderme: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return colors[outcome];
  };

  const precedentChain = useMemo(() => {
    if (selectedCase) {
      return buildPrecedentChain(selectedCase.id);
    }
    return null;
  }, [selectedCase]);

  return (
    <div className="h-full flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Emsal Karar Arama</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Yargıtay ve Danıştay içtihatları</p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)] text-center">
            <div className="text-lg font-bold text-[var(--foreground)]">{statistics.totalCases}</div>
            <div className="text-xs text-[var(--muted-foreground)]">Toplam Karar</div>
          </div>
          <div className="p-2 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)] text-center">
            <div className="text-lg font-bold text-[var(--foreground)]">{statistics.byLegalArea.size}</div>
            <div className="text-xs text-[var(--muted-foreground)]">Hukuk Alanı</div>
          </div>
          <div className="p-2 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)] text-center">
            <div className="text-lg font-bold text-[var(--foreground)]">{statistics.byCourt.size}</div>
            <div className="text-xs text-[var(--muted-foreground)]">Mahkeme</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {!selectedCase ? (
          <div className="space-y-6">
            {/* Search */}
            <div className="space-y-3">
              <textarea
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Davanızın konusunu veya olayları açıklayın... Örn: İşçinin performans düşüklüğü nedeniyle iş sözleşmesinin feshi"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-[var(--input-background)] border border-[var(--border-color)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              />

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={filters.legalArea || ""}
                  onChange={(e) => setFilters({ ...filters, legalArea: e.target.value || undefined })}
                  className="px-3 py-2 rounded-lg bg-[var(--input-background)] border border-[var(--border-color)] text-sm text-[var(--foreground)]"
                >
                  <option value="">Tüm Alanlar</option>
                  <option value="iş hukuku">İş Hukuku</option>
                  <option value="borçlar hukuku">Borçlar Hukuku</option>
                  <option value="ticaret hukuku">Ticaret Hukuku</option>
                  <option value="aile hukuku">Aile Hukuku</option>
                  <option value="ceza hukuku">Ceza Hukuku</option>
                  <option value="idare hukuku">İdare Hukuku</option>
                </select>

                <select
                  value={filters.court || ""}
                  onChange={(e) => setFilters({ ...filters, court: e.target.value || undefined })}
                  className="px-3 py-2 rounded-lg bg-[var(--input-background)] border border-[var(--border-color)] text-sm text-[var(--foreground)]"
                >
                  <option value="">Tüm Mahkemeler</option>
                  <option value="Yargıtay">Yargıtay</option>
                  <option value="Danıştay">Danıştay</option>
                </select>

                <select
                  value={filters.outcome || ""}
                  onChange={(e) => setFilters({ ...filters, outcome: (e.target.value as CaseOutcome) || undefined })}
                  className="px-3 py-2 rounded-lg bg-[var(--input-background)] border border-[var(--border-color)] text-sm text-[var(--foreground)]"
                >
                  <option value="">Tüm Sonuçlar</option>
                  <option value="kabul">Kabul</option>
                  <option value="red">Red</option>
                  <option value="kismi_kabul">Kısmi Kabul</option>
                  <option value="bozma">Bozma</option>
                  <option value="onama">Onama</option>
                </select>
              </div>

              <button
                onClick={handleSearch}
                disabled={!searchText.trim() || isSearching}
                className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Aranıyor...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Emsal Ara
                  </>
                )}
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--muted-foreground)] mb-3">
                  Bulunan Emsaller ({searchResults.length})
                </h3>
                <div className="space-y-3">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => handleCaseClick(result.case)}
                      className="p-4 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)] cursor-pointer hover:border-[var(--primary)] transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-sm font-medium text-[var(--primary)]">
                            {result.case.court} {result.case.chamber}
                          </span>
                          <span className="text-sm text-[var(--muted-foreground)] ml-2">
                            {result.case.caseNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getOutcomeColor(result.case.outcome)}`}>
                            {getOutcomeLabel(result.case.outcome)}
                          </span>
                          <span className="text-xs font-medium text-[var(--foreground)]">
                            %{Math.round(result.similarity.overall * 100)}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-[var(--foreground)] mb-2">{result.case.facts}</p>

                      {result.matchingFactors.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {result.matchingFactors.slice(0, 3).map((factor, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 rounded bg-[var(--input-background)] text-[var(--muted-foreground)]"
                            >
                              {factor.description}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-3 text-xs text-[var(--muted-foreground)]">
                        <span>📅 {result.case.date}</span>
                        <span>📂 {result.case.legalArea}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Initial State - Recent & Landmark Cases */}
            {searchResults.length === 0 && !searchText && (
              <>
                {/* Landmark Cases */}
                {landmarkCases.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--muted-foreground)] mb-3 flex items-center gap-2">
                      ⭐ Önemli Kararlar
                    </h3>
                    <div className="space-y-2">
                      {landmarkCases.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => handleCaseClick(item.case)}
                          className="p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 cursor-pointer hover:border-amber-500/50 transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-sm font-medium text-[var(--foreground)]">
                                {item.case.caseNumber}
                              </span>
                              <span className="text-xs text-[var(--muted-foreground)] ml-2">
                                {item.citationCount} atıf
                              </span>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getOutcomeColor(item.case.outcome)}`}>
                              {getOutcomeLabel(item.case.outcome)}
                            </span>
                          </div>
                          <p className="text-sm text-[var(--muted-foreground)] mt-1 line-clamp-2">
                            {item.case.facts}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Cases */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--muted-foreground)] mb-3 flex items-center gap-2">
                    🕐 Son Eklenen Kararlar
                  </h3>
                  <div className="space-y-2">
                    {recentCases.map((caseDoc, index) => (
                      <div
                        key={index}
                        onClick={() => handleCaseClick(caseDoc)}
                        className="p-3 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)] cursor-pointer hover:border-[var(--primary)] transition-all"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-sm font-medium text-[var(--foreground)]">
                            {caseDoc.court} {caseDoc.chamber}
                          </span>
                          <span className="text-xs text-[var(--muted-foreground)]">{caseDoc.date}</span>
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">{caseDoc.facts}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getOutcomeColor(caseDoc.outcome)}`}>
                            {getOutcomeLabel(caseDoc.outcome)}
                          </span>
                          <span className="text-xs text-[var(--muted-foreground)]">{caseDoc.legalArea}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Search Tips */}
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">💡 Arama İpuçları</h4>
                  <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
                    <li>• Davanızın olaylarını detaylı açıklayın</li>
                    <li>• Hukuki terimleri kullanmayı deneyin</li>
                    <li>• Filtreleri daraltmak için kullanın</li>
                    <li>• Benzer sonuçlardan emsal zincirine ulaşın</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Case Detail View */
          <div className="space-y-4">
            <button
              onClick={() => setSelectedCase(null)}
              className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              ← Arama Sonuçlarına Dön
            </button>

            <div className="p-4 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)]">
              {/* Case Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[var(--foreground)]">
                    {selectedCase.court} {selectedCase.chamber}
                  </h3>
                  <p className="text-sm text-[var(--primary)]">{selectedCase.caseNumber}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${getOutcomeColor(selectedCase.outcome)}`}>
                  {getOutcomeLabel(selectedCase.outcome)}
                </span>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="p-2 rounded-lg bg-[var(--input-background)]">
                  <span className="text-[var(--muted-foreground)]">Tarih:</span>
                  <span className="text-[var(--foreground)] ml-2">{selectedCase.date}</span>
                </div>
                <div className="p-2 rounded-lg bg-[var(--input-background)]">
                  <span className="text-[var(--muted-foreground)]">Alan:</span>
                  <span className="text-[var(--foreground)] ml-2">{selectedCase.legalArea}</span>
                </div>
                <div className="p-2 rounded-lg bg-[var(--input-background)]">
                  <span className="text-[var(--muted-foreground)]">Tür:</span>
                  <span className="text-[var(--foreground)] ml-2">{selectedCase.caseType}</span>
                </div>
                <div className="p-2 rounded-lg bg-[var(--input-background)]">
                  <span className="text-[var(--muted-foreground)]">Yıl:</span>
                  <span className="text-[var(--foreground)] ml-2">{selectedCase.year}</span>
                </div>
              </div>

              {/* Facts */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-[var(--muted-foreground)] mb-2">Olaylar</h4>
                <p className="text-sm text-[var(--foreground)] leading-relaxed">{selectedCase.facts}</p>
              </div>

              {/* Legal Issues */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-[var(--muted-foreground)] mb-2">Hukuki Sorunlar</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.legalIssues.map((issue, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                    >
                      {issue}
                    </span>
                  ))}
                </div>
              </div>

              {/* Applied Laws */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-[var(--muted-foreground)] mb-2">Uygulanan Mevzuat</h4>
                <div className="space-y-2">
                  {selectedCase.appliedLaws.map((law, i) => (
                    <div key={i} className="p-2 rounded-lg bg-[var(--input-background)]">
                      <span className="text-sm text-[var(--foreground)]">
                        {law.lawNumber} sayılı {law.lawName}
                      </span>
                      <span className="text-xs text-[var(--muted-foreground)] ml-2">
                        m. {law.articles.join(", ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision */}
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">Karar</h4>
                <p className="text-sm text-green-600 dark:text-green-300">{selectedCase.decision}</p>
              </div>

              {/* Keywords */}
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-[var(--muted-foreground)] mb-2">Anahtar Kelimeler</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedCase.keywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded bg-[var(--input-background)] text-[var(--muted-foreground)]"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Precedent Chain */}
            {precedentChain && (precedentChain.precedents.length > 0 || precedentChain.followers.length > 0) && (
              <div className="p-4 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)]">
                <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">Emsal Zinciri</h4>

                {precedentChain.precedents.length > 0 && (
                  <div className="mb-4">
                    <span className="text-xs font-medium text-[var(--muted-foreground)]">Atıf Yapılan Kararlar:</span>
                    <div className="space-y-2 mt-2">
                      {precedentChain.precedents.map((item, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedCase(item.case)}
                          className="p-2 rounded-lg bg-[var(--input-background)] cursor-pointer hover:bg-[var(--border-color)] transition-all flex items-center justify-between"
                        >
                          <span className="text-sm text-[var(--foreground)]">
                            {item.case.caseNumber}
                          </span>
                          <span className="text-xs text-[var(--muted-foreground)]">
                            Derinlik: {item.depth}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {precedentChain.followers.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-[var(--muted-foreground)]">Bu Karara Atıf Yapan:</span>
                    <div className="space-y-2 mt-2">
                      {precedentChain.followers.map((item, i) => (
                        <div
                          key={i}
                          onClick={() => setSelectedCase(item.case)}
                          className="p-2 rounded-lg bg-[var(--input-background)] cursor-pointer hover:bg-[var(--border-color)] transition-all"
                        >
                          <span className="text-sm text-[var(--foreground)]">
                            {item.case.caseNumber}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
