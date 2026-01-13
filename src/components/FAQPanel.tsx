"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/utils/cn";
import {
  ALL_FAQ,
  FAQ_CATEGORIES,
  FAQCategory,
  searchFAQ,
  getFAQByCategory,
  getMostAskedFAQ,
  FAQItem
} from "@/lib/data/faq-database";
import {
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  ExternalLink,
  X,
  Star,
  Clock
} from "lucide-react";

interface FAQPanelProps {
  /** Soru seçildiğinde */
  onQuestionSelect?: (question: string) => void;
  /** Panel kapatma */
  onClose?: () => void;
  /** Sadece görüntüleme modu */
  viewOnly?: boolean;
  /** Sınıf adı */
  className?: string;
}

export function FAQPanel({
  onQuestionSelect,
  onClose,
  viewOnly = false,
  className
}: FAQPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | "all">("all");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Filtrelenmiş FAQ'lar
  const filteredFAQs = useMemo(() => {
    let results: FAQItem[] = [];
    
    if (searchQuery.trim()) {
      results = searchFAQ(searchQuery);
    } else if (selectedCategory === "all") {
      results = getMostAskedFAQ(20);
    } else {
      results = getFAQByCategory(selectedCategory);
    }
    
    return results;
  }, [searchQuery, selectedCategory]);

  // Kategori sayıları
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: ALL_FAQ.length };
    for (const faq of ALL_FAQ) {
      counts[faq.category] = (counts[faq.category] || 0) + 1;
    }
    return counts;
  }, []);

  const handleToggleFAQ = (faqId: string) => {
    setExpandedFAQ(prev => prev === faqId ? null : faqId);
  };

  const handleSelectQuestion = (faq: FAQItem) => {
    if (onQuestionSelect) {
      onQuestionSelect(faq.question);
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-amber-600 dark:text-amber-400" />
          <h2 className="font-semibold text-gray-800 dark:text-white">Sık Sorulan Sorular</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
            {ALL_FAQ.length} soru
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Soru ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
              selectedCategory === "all"
                ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            Tümü ({categoryCounts.all})
          </button>
          {Object.entries(FAQ_CATEGORIES).slice(0, 8).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as FAQCategory)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5",
                selectedCategory === key
                  ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              {categoryCounts[key] && (
                <span className="text-[10px] opacity-70">({categoryCounts[key]})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="flex-1 overflow-y-auto">
        {filteredFAQs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <Search size={40} className="mb-3 opacity-50" />
            <p className="text-sm">Sonuç bulunamadı</p>
            <p className="text-xs mt-1">Farklı anahtar kelimeler deneyin</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="group">
                {/* Question */}
                <button
                  onClick={() => handleToggleFAQ(faq.id)}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                >
                  <div className={cn(
                    "w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform",
                    expandedFAQ === faq.id && "rotate-90"
                  )}>
                    <ChevronRight size={14} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {faq.question}
                      </p>
                      {faq.importance === "high" && (
                        <Star size={12} className="text-amber-500 flex-shrink-0 mt-1" fill="currentColor" />
                      )}
                    </div>
                    {expandedFAQ !== faq.id && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                        {faq.shortAnswer}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {FAQ_CATEGORIES[faq.category]?.icon}
                  </span>
                </button>

                {/* Expanded Answer */}
                {expandedFAQ === faq.id && (
                  <div className="px-4 pb-4 animate-slide-down">
                    <div className="ml-8 space-y-3">
                      {/* Short Answer */}
                      <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                          📌 Kısa Cevap
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                          {faq.shortAnswer}
                        </p>
                      </div>

                      {/* Detailed Answer */}
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                          {faq.detailedAnswer}
                        </div>
                      </div>

                      {/* Legal Basis */}
                      {faq.legalBasis.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Yasal Dayanak:</span>
                          {faq.legalBasis.map((basis, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                            >
                              {basis}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      {!viewOnly && onQuestionSelect && (
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleSelectQuestion(faq)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                          >
                            Bu konuda soru sor
                            <ExternalLink size={12} />
                          </button>
                        </div>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center gap-3 pt-2 text-[10px] text-gray-400 dark:text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          Güncelleme: {faq.lastUpdated}
                        </span>
                        <span>#{faq.keywords.slice(0, 3).join(', ')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Mini FAQ Kartı - Dashboard veya sidebar'da kullanım için
 */
export function MiniFAQCard({
  limit = 5,
  onQuestionSelect,
  className
}: {
  limit?: number;
  onQuestionSelect?: (question: string) => void;
  className?: string;
}) {
  const topFAQs = useMemo(() => getMostAskedFAQ(limit), [limit]);

  return (
    <div className={cn(
      "rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden",
      className
    )}>
      <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Sık Sorulanlar</span>
        </div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {topFAQs.map((faq) => (
          <button
            key={faq.id}
            onClick={() => onQuestionSelect?.(faq.question)}
            className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
          >
            <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              {faq.question}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
              {faq.shortAnswer}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
