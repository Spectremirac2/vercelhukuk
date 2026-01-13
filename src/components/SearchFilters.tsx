"use client";

import React, { useState } from "react";
import { Filter, ChevronDown, X, Calendar, Globe, FileText } from "lucide-react";
import { cn } from "@/utils/cn";

export interface SearchFilters {
  sourceType: "all" | "official" | "secondary";
  dateRange: "all" | "week" | "month" | "year";
  searchMode: "web" | "file" | "hybrid";
}

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  hasFiles: boolean;
}

const SOURCE_OPTIONS = [
  { value: "all", label: "Tüm Kaynaklar" },
  { value: "official", label: "Sadece Resmi" },
  { value: "secondary", label: "İkincil Dahil" },
] as const;

const DATE_OPTIONS = [
  { value: "all", label: "Tüm Zamanlar" },
  { value: "week", label: "Son 1 Hafta" },
  { value: "month", label: "Son 1 Ay" },
  { value: "year", label: "Son 1 Yıl" },
] as const;

const MODE_OPTIONS = [
  { value: "web", label: "Web Araması", icon: Globe },
  { value: "file", label: "Dosya Araması", icon: FileText },
  { value: "hybrid", label: "Hibrit", icon: Filter },
] as const;

export function SearchFiltersPanel({
  filters,
  onFiltersChange,
  hasFiles,
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFiltersCount = [
    filters.sourceType !== "all",
    filters.dateRange !== "all",
    filters.searchMode !== "web",
  ].filter(Boolean).length;

  const resetFilters = () => {
    onFiltersChange({
      sourceType: "all",
      dateRange: "all",
      searchMode: hasFiles ? "hybrid" : "web",
    });
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter size={14} />
          <span>Arama Filtreleri</span>
          {activeFiltersCount > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <ChevronDown
          size={14}
          className={cn("transition-transform", isExpanded && "rotate-180")}
        />
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 space-y-4">
          {/* Search Mode */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Arama Modu
            </label>
            <div className="flex gap-2">
              {MODE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isDisabled =
                  option.value === "file" && !hasFiles;
                return (
                  <button
                    key={option.value}
                    onClick={() =>
                      !isDisabled &&
                      onFiltersChange({ ...filters, searchMode: option.value })
                    }
                    disabled={isDisabled}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors",
                      filters.searchMode === option.value
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600",
                      isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Icon size={12} />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source Type */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Kaynak Türü
            </label>
            <div className="flex gap-2">
              {SOURCE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    onFiltersChange({ ...filters, sourceType: option.value })
                  }
                  className={cn(
                    "flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                    filters.sourceType === option.value
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              <Calendar size={12} className="inline mr-1" />
              Tarih Aralığı
            </label>
            <div className="flex gap-2">
              {DATE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    onFiltersChange({ ...filters, dateRange: option.value })
                  }
                  className={cn(
                    "flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-colors",
                    filters.dateRange === option.value
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="w-full px-3 py-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center justify-center gap-1"
            >
              <X size={12} />
              Filtreleri Sıfırla
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Default filters
export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  sourceType: "all",
  dateRange: "all",
  searchMode: "web",
};
