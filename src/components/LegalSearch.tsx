"use client";

import React, { useState, useCallback } from "react";
import {
  Search,
  Filter,
  Scale,
  BookOpen,
  Gavel,
  Building,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  X,
  FileText,
  Hash,
} from "lucide-react";
import { cn } from "@/utils/cn";
import {
  CourtCase,
  Legislation,
  Court,
  YARGITAY_CHAMBERS,
  DANISTAY_CHAMBERS,
  MAJOR_LAWS,
  formatCaseCitation,
  formatLegislationCitation,
} from "@/lib/turkish-legal-db";

interface LegalSearchProps {
  onSelectCase?: (case_: CourtCase) => void;
  onSelectLegislation?: (law: Legislation) => void;
  onInsertCitation?: (citation: string) => void;
  className?: string;
}

type SearchType = "all" | "cases" | "legislation";

interface SearchFilters {
  court?: Court;
  chamber?: string;
  yearStart?: number;
  yearEnd?: number;
  lawType?: string;
}

export function LegalSearch({
  onSelectCase,
  onSelectLegislation,
  onInsertCitation,
  className,
}: LegalSearchProps) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [caseResults, setCaseResults] = useState<CourtCase[]>([]);
  const [lawResults, setLawResults] = useState<Legislation[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setCaseResults([]);
    setLawResults([]);

    try {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Generate contextual mock results
      const mockCases = generateMockCases(query, filters);
      const mockLaws = generateMockLaws(query);

      if (searchType === "all" || searchType === "cases") {
        setCaseResults(mockCases);
      }
      if (searchType === "all" || searchType === "legislation") {
        setLawResults(mockLaws);
      }
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, searchType]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleInsertCitation = (citation: string) => {
    onInsertCitation?.(citation);
  };

  return (
    <div className={cn("bg-white dark:bg-gray-900 rounded-2xl shadow-lg", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Hukuk Araştırması
          </h3>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Kanun, içtihat veya hukuki terim ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-24 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ara"}
          </button>
        </div>

        {/* Search Type Tabs */}
        <div className="flex gap-2 mt-3">
          {[
            { value: "all", label: "Tümü", icon: Search },
            { value: "cases", label: "İçtihatlar", icon: Gavel },
            { value: "legislation", label: "Mevzuat", icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => setSearchType(tab.value as SearchType)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  searchType === tab.value
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filters Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <Filter size={14} />
          Filtreler
          {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-3">
            {/* Court Filter */}
            {(searchType === "all" || searchType === "cases") && (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Mahkeme
                </label>
                <select
                  value={filters.court || ""}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      court: (e.target.value as Court) || undefined,
                      chamber: undefined,
                    }))
                  }
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                >
                  <option value="">Tüm Mahkemeler</option>
                  <option value="yargitay">Yargıtay</option>
                  <option value="danistay">Danıştay</option>
                  <option value="anayasa_mahkemesi">Anayasa Mahkemesi</option>
                </select>
              </div>
            )}

            {/* Chamber Filter */}
            {filters.court === "yargitay" && (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Daire
                </label>
                <select
                  value={filters.chamber || ""}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, chamber: e.target.value || undefined }))
                  }
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                >
                  <option value="">Tüm Daireler</option>
                  <optgroup label="Hukuk Daireleri">
                    {YARGITAY_CHAMBERS.hukuk.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Ceza Daireleri">
                    {YARGITAY_CHAMBERS.ceza.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Genel Kurullar">
                    {YARGITAY_CHAMBERS.special.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            )}

            {filters.court === "danistay" && (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Daire
                </label>
                <select
                  value={filters.chamber || ""}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, chamber: e.target.value || undefined }))
                  }
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                >
                  <option value="">Tüm Daireler</option>
                  {DANISTAY_CHAMBERS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Year Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Başlangıç Yılı
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="2020"
                  value={filters.yearStart || ""}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      yearStart: e.target.value ? parseInt(e.target.value) : undefined,
                    }))
                  }
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Bitiş Yılı
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="2024"
                  value={filters.yearEnd || ""}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      yearEnd: e.target.value ? parseInt(e.target.value) : undefined,
                    }))
                  }
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({})}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="max-h-[500px] overflow-y-auto">
        {/* Quick Law References */}
        {!isLoading && caseResults.length === 0 && lawResults.length === 0 && !query && (
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Temel Kanunlar
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(MAJOR_LAWS)
                .slice(0, 8)
                .map(([number, info]) => (
                  <button
                    key={number}
                    onClick={() => setQuery(`${number} sayılı ${info.name}`)}
                    className="p-2 text-left bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {info.shortName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {number} sayılı
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Aranıyor...</p>
          </div>
        )}

        {/* Case Results */}
        {caseResults.length > 0 && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Gavel size={14} />
              İçtihatlar ({caseResults.length})
            </h4>
            <div className="space-y-2">
              {caseResults.map((case_) => (
                <CaseResultCard
                  key={case_.id}
                  case_={case_}
                  isExpanded={expandedId === case_.id}
                  isCopied={copiedId === case_.id}
                  onToggleExpand={() =>
                    setExpandedId(expandedId === case_.id ? null : case_.id)
                  }
                  onSelect={() => onSelectCase?.(case_)}
                  onCopy={() =>
                    copyToClipboard(formatCaseCitation(case_), case_.id)
                  }
                  onInsert={() =>
                    handleInsertCitation(formatCaseCitation(case_))
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Legislation Results */}
        {lawResults.length > 0 && (
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <BookOpen size={14} />
              Mevzuat ({lawResults.length})
            </h4>
            <div className="space-y-2">
              {lawResults.map((law) => (
                <LegislationResultCard
                  key={law.id}
                  law={law}
                  isExpanded={expandedId === law.id}
                  isCopied={copiedId === law.id}
                  onToggleExpand={() =>
                    setExpandedId(expandedId === law.id ? null : law.id)
                  }
                  onSelect={() => onSelectLegislation?.(law)}
                  onCopy={() =>
                    copyToClipboard(formatLegislationCitation(law), law.id)
                  }
                  onInsert={() =>
                    handleInsertCitation(formatLegislationCitation(law))
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading &&
          query &&
          caseResults.length === 0 &&
          lawResults.length === 0 && (
            <div className="p-8 text-center">
              <Search className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &quot;{query}&quot; için sonuç bulunamadı
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Farklı anahtar kelimeler deneyin
              </p>
            </div>
          )}
      </div>
    </div>
  );
}

// Case Result Card
interface CaseResultCardProps {
  case_: CourtCase;
  isExpanded: boolean;
  isCopied: boolean;
  onToggleExpand: () => void;
  onSelect: () => void;
  onCopy: () => void;
  onInsert: () => void;
}

function CaseResultCard({
  case_,
  isExpanded,
  isCopied,
  onToggleExpand,
  onSelect,
  onCopy,
  onInsert,
}: CaseResultCardProps) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
      <div className="flex items-start justify-between">
        <div className="flex-1 cursor-pointer" onClick={onToggleExpand}>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded">
              {case_.court === "yargitay" ? "Yargıtay" : "Danıştay"}
            </span>
            {case_.chamber && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {case_.chamber}
              </span>
            )}
          </div>
          <div className="font-medium text-sm text-gray-900 dark:text-white">
            E. {case_.caseNumber}
            {case_.decisionNumber && `, K. ${case_.decisionNumber}`}
          </div>
          {case_.subject && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {case_.subject}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onCopy}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            title="Atıfı Kopyala"
          >
            {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
          <button
            onClick={onInsert}
            className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
            title="Metne Ekle"
          >
            <FileText size={14} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          {case_.summary && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {case_.summary}
            </p>
          )}
          {case_.relatedLaws && case_.relatedLaws.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {case_.relatedLaws.map((law, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded"
                >
                  {law}
                </span>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {case_.decisionDate}
            </span>
            {case_.sourceUrl && (
              <a
                href={case_.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Kaynağa Git <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Legislation Result Card
interface LegislationResultCardProps {
  law: Legislation;
  isExpanded: boolean;
  isCopied: boolean;
  onToggleExpand: () => void;
  onSelect: () => void;
  onCopy: () => void;
  onInsert: () => void;
}

function LegislationResultCard({
  law,
  isExpanded,
  isCopied,
  onToggleExpand,
  onSelect,
  onCopy,
  onInsert,
}: LegislationResultCardProps) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
      <div className="flex items-start justify-between">
        <div className="flex-1 cursor-pointer" onClick={onToggleExpand}>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded">
              {law.type === "kanun" ? "Kanun" : law.type.toUpperCase()}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Hash size={10} />
              {law.number}
            </span>
            <span
              className={cn(
                "px-1.5 py-0.5 text-xs rounded",
                law.status === "yürürlükte"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
              )}
            >
              {law.status}
            </span>
          </div>
          <div className="font-medium text-sm text-gray-900 dark:text-white">
            {law.name}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onCopy}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            title="Atıfı Kopyala"
          >
            {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
          <button
            onClick={onInsert}
            className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
            title="Metne Ekle"
          >
            <FileText size={14} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          {law.officialGazetteDate && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <Calendar size={12} />
              Resmi Gazete: {law.officialGazetteDate}
              {law.officialGazetteNumber && ` / ${law.officialGazetteNumber}`}
            </div>
          )}
          <div className="flex justify-end">
            {law.sourceUrl && (
              <a
                href={law.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                mevzuat.gov.tr <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Mock data generators
function generateMockCases(query: string, filters: SearchFilters): CourtCase[] {
  const cases: CourtCase[] = [];
  const queryLower = query.toLowerCase();

  if (queryLower.includes("iş") || queryLower.includes("işçi") || queryLower.includes("kıdem")) {
    cases.push({
      id: "yargitay_9hd_2024_1234",
      court: "yargitay",
      chamber: "9. Hukuk Dairesi",
      year: 2024,
      caseNumber: "2024/1234",
      decisionNumber: "2024/5678",
      decisionDate: "15.03.2024",
      subject: "Kıdem tazminatı - Haklı fesih",
      summary: "İşçinin haklı fesih nedeniyle kıdem ve ihbar tazminatına hak kazandığına ilişkin karar.",
      relatedLaws: ["4857 sayılı İş Kanunu m. 17", "4857 sayılı İş Kanunu m. 25"],
      keywords: ["kıdem tazminatı", "haklı fesih"],
      outcome: "kabul",
    });
    cases.push({
      id: "yargitay_22hd_2023_9999",
      court: "yargitay",
      chamber: "22. Hukuk Dairesi",
      year: 2023,
      caseNumber: "2023/9999",
      decisionNumber: "2023/12345",
      decisionDate: "10.12.2023",
      subject: "İhbar tazminatı hesaplaması",
      summary: "İhbar süresine uyulmadan yapılan fesihte tazminat hesaplama yöntemi.",
      relatedLaws: ["4857 sayılı İş Kanunu m. 17"],
      outcome: "kabul",
    });
  }

  if (queryLower.includes("kvkk") || queryLower.includes("kişisel veri")) {
    cases.push({
      id: "danistay_10d_2024_500",
      court: "danistay",
      chamber: "10. Daire",
      year: 2024,
      caseNumber: "2024/500",
      decisionNumber: "2024/750",
      decisionDate: "20.06.2024",
      subject: "KVKK - Açık rıza",
      summary: "Açık rıza alınmadan kişisel veri işlenmesine ilişkin idari para cezası.",
      relatedLaws: ["6698 sayılı KVKK m. 5", "6698 sayılı KVKK m. 18"],
      outcome: "ret",
    });
  }

  // Filter by court if specified
  if (filters.court) {
    return cases.filter((c) => c.court === filters.court);
  }

  return cases;
}

function generateMockLaws(query: string): Legislation[] {
  const laws: Legislation[] = [];
  const queryLower = query.toLowerCase();

  for (const [number, info] of Object.entries(MAJOR_LAWS)) {
    if (
      info.name.toLowerCase().includes(queryLower) ||
      info.shortName.toLowerCase().includes(queryLower) ||
      query.includes(number)
    ) {
      laws.push({
        id: `kanun_${number}`,
        type: "kanun",
        number,
        name: info.name,
        status: "yürürlükte",
        sourceUrl: `https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=${number}`,
      });
    }
  }

  return laws.slice(0, 5);
}
