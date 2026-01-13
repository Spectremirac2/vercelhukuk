"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/utils/cn";
import {
  LEGISLATION_UPDATES,
  UPDATE_CATEGORIES,
  UpdateCategory,
  getRecentUpdates,
  getCriticalUpdates,
  searchUpdates,
  getUpdatesByCategory,
  LegislationUpdate
} from "@/lib/data/legislation-updates";
import {
  Newspaper,
  Search,
  AlertTriangle,
  Clock,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  X,
  Bell,
  Filter,
  BookOpen,
  FileText,
  Tag
} from "lucide-react";

interface LegislationUpdatesProps {
  /** Panel kapatma */
  onClose?: () => void;
  /** Güncelleme seçildiğinde (detay gösterme) */
  onUpdateSelect?: (update: LegislationUpdate) => void;
  /** Sınıf adı */
  className?: string;
}

export function LegislationUpdatesPanel({
  onClose,
  onUpdateSelect,
  className
}: LegislationUpdatesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<UpdateCategory | "all">("all");
  const [expandedUpdate, setExpandedUpdate] = useState<string | null>(null);
  const [showOnlyCritical, setShowOnlyCritical] = useState(false);

  // Filtrelenmiş güncellemeler
  const filteredUpdates = useMemo(() => {
    let results: LegislationUpdate[] = [];
    
    if (searchQuery.trim()) {
      results = searchUpdates(searchQuery);
    } else if (selectedCategory === "all") {
      results = showOnlyCritical ? getCriticalUpdates() : getRecentUpdates(20);
    } else {
      results = getUpdatesByCategory(selectedCategory);
    }
    
    if (showOnlyCritical && !searchQuery.trim()) {
      results = results.filter(u => u.importance === 'critical');
    }
    
    return results;
  }, [searchQuery, selectedCategory, showOnlyCritical]);

  // Kritik güncellemeler
  const criticalCount = useMemo(() => getCriticalUpdates().length, []);

  const importanceColors = {
    critical: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    high: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
    medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    low: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
  };

  const importanceLabels = {
    critical: "Kritik",
    high: "Yüksek",
    medium: "Orta",
    low: "Düşük"
  };

  return (
    <div className={cn(
      "flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex items-center gap-2">
          <Newspaper size={20} className="text-blue-600 dark:text-blue-400" />
          <h2 className="font-semibold text-gray-800 dark:text-white">Güncel Mevzuat Değişiklikleri</h2>
          {criticalCount > 0 && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">
              <Bell size={10} />
              {criticalCount} kritik
            </span>
          )}
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

      {/* Search & Filter */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Değişiklik ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Critical Filter Toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyCritical}
            onChange={(e) => setShowOnlyCritical(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">Sadece kritik değişiklikleri göster</span>
        </label>
      </div>

      {/* Categories */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
              selectedCategory === "all"
                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            Tümü
          </button>
          {Object.entries(UPDATE_CATEGORIES).slice(0, 8).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as UpdateCategory)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                selectedCategory === key
                  ? "text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
              style={selectedCategory === key ? { backgroundColor: cat.color } : {}}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Updates List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUpdates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <Newspaper size={40} className="mb-3 opacity-50" />
            <p className="text-sm">Güncelleme bulunamadı</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredUpdates.map((update) => (
              <div key={update.id} className="group">
                {/* Update Header */}
                <button
                  onClick={() => setExpandedUpdate(prev => prev === update.id ? null : update.id)}
                  className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
                >
                  <div className={cn(
                    "w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform",
                    expandedUpdate === update.id && "rotate-90"
                  )}>
                    <ChevronRight size={14} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full border font-medium flex-shrink-0",
                        importanceColors[update.importance]
                      )}>
                        {importanceLabels[update.importance]}
                      </span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full text-white flex-shrink-0"
                        style={{ backgroundColor: UPDATE_CATEGORIES[update.category]?.color || '#6B7280' }}
                      >
                        {UPDATE_CATEGORIES[update.category]?.name}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1.5">
                      {update.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                      {update.summary}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        Yürürlük: {update.effectiveDate}
                      </span>
                      {update.officialGazetteNo && (
                        <span className="flex items-center gap-1">
                          <FileText size={10} />
                          RG: {update.officialGazetteNo}
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedUpdate === update.id && (
                  <div className="px-4 pb-4 animate-slide-down">
                    <div className="ml-8 space-y-4">
                      {/* Full Description */}
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                          {update.fullDescription}
                        </div>
                      </div>

                      {/* Key Changes */}
                      {update.keyChanges.length > 0 && (
                        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                          <p className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-1.5">
                            <AlertTriangle size={12} />
                            Önemli Değişiklikler
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            {update.keyChanges.map((change, idx) => (
                              <li key={idx} className="text-xs text-blue-700 dark:text-blue-300">{change}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Practical Impact */}
                      {update.practicalImpact.length > 0 && (
                        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                          <p className="text-xs font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-1.5">
                            <BookOpen size={12} />
                            Pratik Etkileri
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            {update.practicalImpact.map((impact, idx) => (
                              <li key={idx} className="text-xs text-amber-700 dark:text-amber-300">{impact}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Affected Laws */}
                      {update.affectedLaws.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Etkilenen Kanunlar:</span>
                          {update.affectedLaws.map((law, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300"
                            >
                              {law}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {update.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                          >
                            #{tag}
                          </span>
                        ))}
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
 * Mini Güncellemeler Kartı - Dashboard için
 */
export function MiniLegislationUpdates({
  limit = 3,
  onViewAll,
  className
}: {
  limit?: number;
  onViewAll?: () => void;
  className?: string;
}) {
  const recentUpdates = useMemo(() => getRecentUpdates(limit), [limit]);
  const criticalUpdates = useMemo(() => getCriticalUpdates(), []);

  const importanceBadgeColors = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-gray-400"
  };

  return (
    <div className={cn(
      "rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden",
      className
    )}>
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Güncel Değişiklikler</span>
          </div>
          {criticalUpdates.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300">
              <Bell size={8} />
              {criticalUpdates.length}
            </span>
          )}
        </div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {recentUpdates.map((update) => (
          <div
            key={update.id}
            className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-start gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                importanceBadgeColors[update.importance]
              )} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1 font-medium">
                  {update.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                  {update.summary}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                  {update.effectiveDate}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="w-full px-4 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors border-t border-gray-200 dark:border-gray-700 flex items-center justify-center gap-1"
        >
          Tümünü Gör
          <ExternalLink size={10} />
        </button>
      )}
    </div>
  );
}
