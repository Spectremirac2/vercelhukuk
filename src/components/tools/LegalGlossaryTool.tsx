"use client";

import React, { useState, useMemo } from "react";
import {
  searchGlossary,
  getTermsByCategory,
  getCategories,
  getTermOfTheDay,
  getConfusedTermPairs,
  getTerm,
  getRelatedTerms,
  explainText,
  type GlossaryTerm,
  type LegalCategory,
  type GlossarySearchResult,
} from "@/lib/legal-glossary";

export function LegalGlossaryTool() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<LegalCategory | "all">("all");
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [explainMode, setExplainMode] = useState(false);
  const [textToExplain, setTextToExplain] = useState("");
  const [explanationResult, setExplanationResult] = useState<ReturnType<typeof explainText> | null>(null);

  const categories = useMemo(() => getCategories(), []);
  const termOfTheDay = useMemo(() => getTermOfTheDay(), []);
  const confusedPairs = useMemo(() => getConfusedTermPairs(), []);

  const searchResults = useMemo(() => {
    if (searchQuery.trim()) {
      return searchGlossary(searchQuery, 20);
    }
    return [];
  }, [searchQuery]);

  const categoryTerms = useMemo(() => {
    if (selectedCategory !== "all") {
      return getTermsByCategory(selectedCategory);
    }
    return [];
  }, [selectedCategory]);

  const handleTermClick = (term: GlossaryTerm) => {
    setSelectedTerm(term);
  };

  const handleExplainText = () => {
    if (textToExplain.trim()) {
      const result = explainText(textToExplain);
      setExplanationResult(result);
    }
  };

  const relatedTerms = useMemo(() => {
    if (selectedTerm) {
      return getRelatedTerms(selectedTerm.term);
    }
    return [];
  }, [selectedTerm]);

  const getCategoryLabel = (cat: LegalCategory): string => {
    const labels: Record<LegalCategory, string> = {
      genel: "Genel",
      anayasa: "Anayasa",
      medeni: "Medeni",
      borclar: "Borçlar",
      ticaret: "Ticaret",
      ceza: "Ceza",
      is: "İş",
      idare: "İdare",
      usul: "Usul",
      icra_iflas: "İcra İflas",
      vergi: "Vergi",
      aile: "Aile",
      miras: "Miras",
    };
    return labels[cat];
  };

  return (
    <div className="h-full flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Hukuk Sözlüğü</h2>
            <p className="text-sm text-[var(--muted-foreground)]">Türk hukuk terminolojisi veritabanı</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setExplainMode(false)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              !explainMode
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--input-background)] text-[var(--foreground)] hover:bg-[var(--border-color)]"
            }`}
          >
            🔍 Terim Ara
          </button>
          <button
            onClick={() => setExplainMode(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              explainMode
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--input-background)] text-[var(--foreground)] hover:bg-[var(--border-color)]"
            }`}
          >
            📝 Metin Açıkla
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {!explainMode ? (
          <div className="space-y-6">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Hukuki terim ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--input-background)] border border-[var(--border-color)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--muted-foreground)] mb-3">
                  Arama Sonuçları ({searchResults.length})
                </h3>
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => handleTermClick(result.term)}
                      className="p-3 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)] cursor-pointer hover:border-[var(--primary)] transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-medium text-[var(--foreground)]">{result.term.term}</span>
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                            {getCategoryLabel(result.term.category)}
                          </span>
                          {result.matchType === "exact" && (
                            <span className="ml-2 text-xs text-green-600">✓ Tam eşleşme</span>
                          )}
                        </div>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          %{Math.round(result.score * 100)}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)] mt-1 line-clamp-2">
                        {result.term.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {!searchQuery && !selectedTerm && (
              <>
                {/* Term of the Day */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📚</span>
                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">Günün Terimi</span>
                  </div>
                  <h4 className="font-bold text-[var(--foreground)] mb-1">{termOfTheDay.term}</h4>
                  <p className="text-sm text-[var(--muted-foreground)]">{termOfTheDay.definition}</p>
                  {termOfTheDay.englishEquivalent && (
                    <p className="text-xs text-[var(--muted-foreground)] mt-2">
                      🇬🇧 {termOfTheDay.englishEquivalent}
                    </p>
                  )}
                </div>

                {/* Category Grid */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--muted-foreground)] mb-3">Kategoriler</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.category}
                        onClick={() => setSelectedCategory(cat.category)}
                        className={`p-3 rounded-lg text-left transition-all border ${
                          selectedCategory === cat.category
                            ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                            : "bg-[var(--card-background)] border-[var(--border-color)] hover:border-[var(--primary)]"
                        }`}
                      >
                        <div className="font-medium">{cat.label}</div>
                        <div className="text-xs opacity-75">{cat.count} terim</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confused Pairs */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--muted-foreground)] mb-3">
                    Sık Karıştırılan Terimler
                  </h3>
                  <div className="space-y-3">
                    {confusedPairs.map((pair, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)]"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium">
                            {pair.term1.term}
                          </span>
                          <span className="text-[var(--muted-foreground)]">vs</span>
                          <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium">
                            {pair.term2.term}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)]">{pair.difference}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Category Terms */}
            {selectedCategory !== "all" && categoryTerms.length > 0 && !selectedTerm && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">
                    {getCategoryLabel(selectedCategory)} Terimleri ({categoryTerms.length})
                  </h3>
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="text-sm text-[var(--primary)] hover:underline"
                  >
                    Tümünü Göster
                  </button>
                </div>
                <div className="space-y-2">
                  {categoryTerms.map((term, index) => (
                    <div
                      key={index}
                      onClick={() => handleTermClick(term)}
                      className="p-3 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)] cursor-pointer hover:border-[var(--primary)] transition-all"
                    >
                      <div className="font-medium text-[var(--foreground)]">{term.term}</div>
                      <p className="text-sm text-[var(--muted-foreground)] mt-1 line-clamp-2">
                        {term.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Term Detail */}
            {selectedTerm && (
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedTerm(null)}
                  className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1"
                >
                  ← Geri Dön
                </button>

                <div className="p-4 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)]">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-[var(--foreground)]">{selectedTerm.term}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                      {getCategoryLabel(selectedTerm.category)}
                    </span>
                  </div>

                  <p className="text-[var(--foreground)] mb-4">{selectedTerm.definition}</p>

                  {selectedTerm.englishEquivalent && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-[var(--muted-foreground)]">İngilizce:</span>
                      <span className="text-sm text-[var(--foreground)]">{selectedTerm.englishEquivalent}</span>
                    </div>
                  )}

                  {selectedTerm.synonyms.length > 0 && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-[var(--muted-foreground)]">Eş Anlamlılar: </span>
                      <span className="text-sm text-[var(--foreground)]">{selectedTerm.synonyms.join(", ")}</span>
                    </div>
                  )}

                  {selectedTerm.legalBasis && selectedTerm.legalBasis.length > 0 && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-[var(--muted-foreground)]">Yasal Dayanak: </span>
                      {selectedTerm.legalBasis.map((basis, i) => (
                        <span key={i} className="text-sm text-[var(--foreground)]">
                          {basis.lawNumber} sayılı {basis.lawName}
                          {basis.article && ` m.${basis.article}`}
                          {i < selectedTerm.legalBasis!.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  )}

                  {selectedTerm.practicalNotes && (
                    <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 mt-3">
                      <div className="flex items-start gap-2">
                        <span>💡</span>
                        <p className="text-sm text-[var(--foreground)]">{selectedTerm.practicalNotes}</p>
                      </div>
                    </div>
                  )}

                  {selectedTerm.usage.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-[var(--muted-foreground)] mb-2">Kullanım Örnekleri</h4>
                      {selectedTerm.usage.map((usage, i) => (
                        <div key={i} className="p-3 rounded-lg bg-[var(--input-background)] mb-2">
                          <span className="text-xs text-[var(--muted-foreground)] block mb-1">{usage.context}</span>
                          <p className="text-sm text-[var(--foreground)] italic">"{usage.sentence}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Related Terms */}
                {relatedTerms.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--muted-foreground)] mb-2">İlgili Terimler</h4>
                    <div className="flex flex-wrap gap-2">
                      {relatedTerms.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedTerm(term)}
                          className="px-3 py-1.5 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)] text-sm text-[var(--foreground)] hover:border-[var(--primary)] transition-all"
                        >
                          {term.term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Explain Mode */
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Açıklanacak Metin
              </label>
              <textarea
                value={textToExplain}
                onChange={(e) => setTextToExplain(e.target.value)}
                placeholder="Hukuki metni buraya yapıştırın. Metindeki terimler otomatik olarak tespit edilip açıklanacaktır..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-[var(--input-background)] border border-[var(--border-color)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              />
            </div>

            <button
              onClick={handleExplainText}
              disabled={!textToExplain.trim()}
              className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Terimleri Açıkla
            </button>

            {explanationResult && (
              <div className="space-y-4">
                {explanationResult.explanations.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[var(--card-background)] border border-[var(--border-color)] text-center">
                    <p className="text-[var(--muted-foreground)]">Metinde hukuki terim bulunamadı.</p>
                  </div>
                ) : (
                  <>
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-700 dark:text-green-400">
                        ✓ {explanationResult.explanations.length} hukuki terim tespit edildi
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[var(--muted-foreground)] mb-3">Tespit Edilen Terimler</h4>
                      <div className="space-y-3">
                        {explanationResult.explanations.map((exp, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-lg bg-[var(--card-background)] border border-[var(--border-color)]"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-medium text-[var(--primary)]">{exp.term}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                {getCategoryLabel(exp.category)}
                              </span>
                            </div>
                            <p className="text-sm text-[var(--foreground)]">{exp.definition}</p>
                            {exp.relatedTerms.length > 0 && (
                              <p className="text-xs text-[var(--muted-foreground)] mt-2">
                                İlgili: {exp.relatedTerms.slice(0, 3).join(", ")}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
