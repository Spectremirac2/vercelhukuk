"use client";

import React, { useState, useMemo } from "react";
import {
  searchGlossary,
  getCategories,
  getTermsByCategory,
  getTerm,
  getRelatedTerms,
  getTermOfTheDay,
  getConfusedTermPairs,
  explainText,
  GlossaryTerm,
  LegalCategory,
} from "@/lib/legal-glossary";

interface GlossaryPanelProps {
  onClose?: () => void;
  onInsertTerm?: (term: string, definition: string) => void;
  initialSearch?: string;
}

export function GlossaryPanel({
  onClose,
  onInsertTerm,
  initialSearch = "",
}: GlossaryPanelProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<LegalCategory | "all">("all");
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [showExplainer, setShowExplainer] = useState(false);
  const [textToExplain, setTextToExplain] = useState("");
  const [explainedResult, setExplainedResult] = useState<ReturnType<typeof explainText> | null>(null);

  const categories = useMemo(() => getCategories(), []);
  const termOfTheDay = useMemo(() => getTermOfTheDay(), []);
  const confusedPairs = useMemo(() => getConfusedTermPairs(), []);

  const searchResults = useMemo(() => {
    if (searchQuery.trim()) {
      return searchGlossary(searchQuery, 20);
    }
    if (selectedCategory !== "all") {
      return getTermsByCategory(selectedCategory).map((term) => ({
        term,
        matchType: "exact" as const,
        score: 1,
      }));
    }
    return [];
  }, [searchQuery, selectedCategory]);

  const relatedTerms = useMemo(() => {
    if (selectedTerm) {
      return getRelatedTerms(selectedTerm.term);
    }
    return [];
  }, [selectedTerm]);

  const handleExplainText = () => {
    if (textToExplain.trim()) {
      const result = explainText(textToExplain);
      setExplainedResult(result);
    }
  };

  const getCategoryLabel = (category: LegalCategory): string => {
    const labels: Record<LegalCategory, string> = {
      genel: "Genel Hukuk",
      anayasa: "Anayasa Hukuku",
      medeni: "Medeni Hukuk",
      borclar: "Borçlar Hukuku",
      ticaret: "Ticaret Hukuku",
      ceza: "Ceza Hukuku",
      is: "İş Hukuku",
      idare: "İdare Hukuku",
      usul: "Usul Hukuku",
      icra_iflas: "İcra İflas Hukuku",
      vergi: "Vergi Hukuku",
      aile: "Aile Hukuku",
      miras: "Miras Hukuku",
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: LegalCategory): string => {
    const colors: Record<LegalCategory, string> = {
      genel: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      anayasa: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      medeni: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      borclar: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      ticaret: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      ceza: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      is: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      idare: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
      usul: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      icra_iflas: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      vergi: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
      aile: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
      miras: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    };
    return colors[category] || colors.genel;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Hukuk Sözlüğü
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Türk hukuku terminolojisi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExplainer(!showExplainer)}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              showExplainer
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Metin Açıklayıcı
          </button>
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
      </div>

      {/* Text Explainer Section */}
      {showExplainer && (
        <div className="border-b dark:border-gray-700 p-4 bg-blue-50 dark:bg-blue-900/20">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">
            Hukuki Metin Açıklayıcı
          </h3>
          <textarea
            value={textToExplain}
            onChange={(e) => setTextToExplain(e.target.value)}
            placeholder="Açıklanmasını istediğiniz hukuki metni buraya yapıştırın..."
            className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            rows={3}
          />
          <button
            onClick={handleExplainText}
            disabled={!textToExplain.trim()}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            Terimleri Açıkla
          </button>

          {explainedResult && explainedResult.explanations.length > 0 && (
            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Bulunan Terimler ({explainedResult.explanations.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {explainedResult.explanations.map((exp, index) => (
                  <div key={index} className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {exp.term}:
                    </span>{" "}
                    <span className="text-gray-600 dark:text-gray-300">
                      {exp.definition}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search and Filter */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Terim ara..."
              className="w-full px-4 py-2 pl-10 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as LegalCategory | "all")}
            className="px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.label} ({cat.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Term of the Day */}
        {!searchQuery && selectedCategory === "all" && !selectedTerm && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Günün Terimi
            </h3>
            <div
              onClick={() => setSelectedTerm(termOfTheDay)}
              className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {termOfTheDay.term}
                  </h4>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs ${getCategoryColor(termOfTheDay.category)}`}>
                    {getCategoryLabel(termOfTheDay.category)}
                  </span>
                </div>
                {termOfTheDay.englishEquivalent && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                    {termOfTheDay.englishEquivalent}
                  </span>
                )}
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">
                {termOfTheDay.definition}
              </p>
            </div>
          </div>
        )}

        {/* Confused Term Pairs */}
        {!searchQuery && selectedCategory === "all" && !selectedTerm && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Karıştırılan Terimler
            </h3>
            <div className="space-y-3">
              {confusedPairs.map((pair, index) => (
                <div
                  key={index}
                  className="p-3 border dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      onClick={() => setSelectedTerm(pair.term1)}
                      className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline"
                    >
                      {pair.term1.term}
                    </span>
                    <span className="text-gray-400">vs</span>
                    <span
                      onClick={() => setSelectedTerm(pair.term2)}
                      className="text-blue-600 dark:text-blue-400 font-medium cursor-pointer hover:underline"
                    >
                      {pair.term2.term}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {pair.difference}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Term Detail */}
        {selectedTerm && (
          <div className="mb-6">
            <button
              onClick={() => setSelectedTerm(null)}
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm mb-4 hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Geri
            </button>

            <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedTerm.term}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(selectedTerm.category)}`}>
                        {getCategoryLabel(selectedTerm.category)}
                      </span>
                      {selectedTerm.englishEquivalent && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                          ({selectedTerm.englishEquivalent})
                        </span>
                      )}
                    </div>
                  </div>
                  {onInsertTerm && (
                    <button
                      onClick={() => onInsertTerm(selectedTerm.term, selectedTerm.definition)}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      Ekle
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Definition */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Tanım
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedTerm.definition}
                  </p>
                </div>

                {/* Synonyms */}
                {selectedTerm.synonyms.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Eş Anlamlılar
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerm.synonyms.map((syn, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300"
                        >
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legal Basis */}
                {selectedTerm.legalBasis && selectedTerm.legalBasis.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Yasal Dayanak
                    </h4>
                    <div className="space-y-1">
                      {selectedTerm.legalBasis.map((basis, index) => (
                        <p key={index} className="text-sm text-gray-600 dark:text-gray-300">
                          {basis.lawNumber} sayılı {basis.lawName}
                          {basis.article && ` m.${basis.article}`}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Usage Examples */}
                {selectedTerm.usage.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Kullanım Örnekleri
                    </h4>
                    <div className="space-y-2">
                      {selectedTerm.usage.map((usage, index) => (
                        <div
                          key={index}
                          className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                        >
                          <span className="text-gray-500 dark:text-gray-400">
                            [{usage.context}]
                          </span>
                          <p className="text-gray-700 dark:text-gray-300 mt-1 italic">
                            &quot;{usage.sentence}&quot;
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practical Notes */}
                {selectedTerm.practicalNotes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Pratik Notlar
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                      {selectedTerm.practicalNotes}
                    </p>
                  </div>
                )}

                {/* Related Terms */}
                {relatedTerms.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      İlişkili Terimler
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {relatedTerms.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedTerm(term)}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50"
                        >
                          {term.term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {!selectedTerm && searchResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {searchQuery ? "Arama Sonuçları" : "Terimler"} ({searchResults.length})
            </h3>
            {searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => setSelectedTerm(result.term)}
                className="p-3 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {result.term.term}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {result.term.definition}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs whitespace-nowrap ${getCategoryColor(result.term.category)}`}>
                    {getCategoryLabel(result.term.category)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!selectedTerm && searchQuery && searchResults.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>&quot;{searchQuery}&quot; için sonuç bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GlossaryPanel;
