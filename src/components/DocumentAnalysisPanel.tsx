"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Scale,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  Shield,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { CaseTimeline, TimelineEvent } from "./CaseTimeline";

// Types from document-analysis
interface DocumentAnalysis {
  metadata: {
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedAt: Date;
  };
  documentType: string;
  summary: {
    brief: string;
    detailed: string;
    keyPoints: string[];
    parties?: string[];
    subject?: string;
    outcome?: string;
  };
  entities: Array<{
    type: string;
    value: string;
    context?: string;
    confidence: number;
  }>;
  timeline: TimelineEvent[];
  risks: Array<{
    description: string;
    severity: "high" | "medium" | "low";
    recommendation: string;
    relatedClause?: string;
  }>;
  relatedLaws: string[];
  keyFindings: Array<{
    category: string;
    finding: string;
    importance: "critical" | "important" | "informational";
  }>;
}

interface VerificationResult {
  overallConfidence: number;
  totalCitations: number;
  verifiedCitations: number;
  warnings: string[];
  riskLevel: "low" | "medium" | "high";
}

interface DocumentAnalysisPanelProps {
  analysis: DocumentAnalysis | null;
  verification?: VerificationResult | null;
  isLoading?: boolean;
  onClose?: () => void;
  className?: string;
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  court_decision: "Mahkeme Kararı",
  contract: "Sözleşme",
  petition: "Dilekçe",
  indictment: "İddianame",
  legislation: "Mevzuat",
  legal_opinion: "Hukuki Mütalaa",
  protocol: "Tutanak",
  notification: "Tebligat",
  unknown: "Belge",
};

const ENTITY_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  law: { label: "Kanun", color: "blue" },
  article: { label: "Madde", color: "green" },
  case: { label: "Esas/Karar", color: "purple" },
  court: { label: "Mahkeme", color: "orange" },
  party: { label: "Taraf", color: "gray" },
  date: { label: "Tarih", color: "yellow" },
  amount: { label: "Tutar", color: "red" },
  term: { label: "Terim", color: "teal" },
};

export function DocumentAnalysisPanel({
  analysis,
  verification,
  isLoading,
  onClose,
  className,
}: DocumentAnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "entities" | "timeline" | "risks">("summary");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["summary", "keyPoints"]));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Group entities by type
  const groupedEntities = useMemo(() => {
    if (!analysis?.entities) return {};
    const groups: Record<string, typeof analysis.entities> = {};
    for (const entity of analysis.entities) {
      if (!groups[entity.type]) {
        groups[entity.type] = [];
      }
      groups[entity.type].push(entity);
    }
    return groups;
  }, [analysis?.entities]);

  // Convert timeline events
  const timelineEvents: TimelineEvent[] = useMemo(() => {
    if (!analysis?.timeline) return [];
    return analysis.timeline.map((event, index) => {
      // Destructure to remove any existing id, then add our own
      const { ...eventData } = event;
      return {
        ...eventData,
        id: `event_${index}`,
      } as TimelineEvent;
    });
  }, [analysis?.timeline]);

  if (isLoading) {
    return (
      <div className={cn("bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6", className)}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Belge analiz ediliyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className={cn("bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6", className)}>
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Analiz için bir belge yükleyin</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {analysis.metadata.fileName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {DOCUMENT_TYPE_LABELS[analysis.documentType] || analysis.documentType} •{" "}
                {(analysis.metadata.fileSize / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Verification Badge */}
        {verification && (
          <div className="mt-3 flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                verification.riskLevel === "low"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : verification.riskLevel === "medium"
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
              )}
            >
              <Shield size={12} />
              {verification.riskLevel === "low"
                ? "Yüksek Güvenilirlik"
                : verification.riskLevel === "medium"
                ? "Orta Güvenilirlik"
                : "Düşük Güvenilirlik"}
              ({Math.round(verification.overallConfidence * 100)}%)
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {verification.verifiedCitations}/{verification.totalCitations} kaynak doğrulandı
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { id: "summary", label: "Özet", icon: BookOpen },
          { id: "entities", label: "Referanslar", icon: Scale },
          { id: "timeline", label: "Zaman Çizelgesi", icon: Clock },
          { id: "risks", label: "Riskler", icon: AlertTriangle },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2",
              activeTab === id
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            <Icon size={16} />
            {label}
            {id === "risks" && analysis.risks.length > 0 && (
              <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full">
                {analysis.risks.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {/* Summary Tab */}
        {activeTab === "summary" && (
          <div className="space-y-4">
            {/* Brief Summary */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <p className="text-gray-800 dark:text-gray-200">{analysis.summary.brief}</p>
            </div>

            {/* Key Points */}
            {analysis.summary.keyPoints.length > 0 && (
              <CollapsibleSection
                title="Önemli Noktalar"
                isExpanded={expandedSections.has("keyPoints")}
                onToggle={() => toggleSection("keyPoints")}
              >
                <ul className="space-y-2">
                  {analysis.summary.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            )}

            {/* Parties */}
            {analysis.summary.parties && analysis.summary.parties.length > 0 && (
              <CollapsibleSection
                title="Taraflar"
                isExpanded={expandedSections.has("parties")}
                onToggle={() => toggleSection("parties")}
              >
                <div className="flex flex-wrap gap-2">
                  {analysis.summary.parties.map((party, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {party}
                    </span>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Related Laws */}
            {analysis.relatedLaws.length > 0 && (
              <CollapsibleSection
                title="İlgili Mevzuat"
                isExpanded={expandedSections.has("laws")}
                onToggle={() => toggleSection("laws")}
              >
                <div className="space-y-2">
                  {analysis.relatedLaws.map((law, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">{law}</span>
                      <button className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded">
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* Key Findings */}
            {analysis.keyFindings.length > 0 && (
              <CollapsibleSection
                title="Bulgular"
                isExpanded={expandedSections.has("findings")}
                onToggle={() => toggleSection("findings")}
              >
                <div className="space-y-2">
                  {analysis.keyFindings.map((finding, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-3 rounded-lg border",
                        finding.importance === "critical"
                          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                          : finding.importance === "important"
                          ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {finding.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{finding.finding}</p>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            )}
          </div>
        )}

        {/* Entities Tab */}
        {activeTab === "entities" && (
          <div className="space-y-4">
            {Object.entries(groupedEntities).map(([type, entities]) => {
              const config = ENTITY_TYPE_LABELS[type] || { label: type, color: "gray" };
              return (
                <div key={type}>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        `bg-${config.color}-500`
                      )}
                    />
                    {config.label} ({entities.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {entities.map((entity, index) => (
                      <EntityBadge
                        key={index}
                        entity={entity}
                        color={config.color}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            {Object.keys(groupedEntities).length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Referans bulunamadı
              </p>
            )}
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === "timeline" && (
          <div>
            {timelineEvents.length > 0 ? (
              <CaseTimeline events={timelineEvents} title="" />
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Zaman çizelgesi olayı bulunamadı
              </p>
            )}
          </div>
        )}

        {/* Risks Tab */}
        {activeTab === "risks" && (
          <div className="space-y-3">
            {analysis.risks.length > 0 ? (
              analysis.risks.map((risk, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-xl border",
                    risk.severity === "high"
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      : risk.severity === "medium"
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className={cn(
                        "w-5 h-5 shrink-0",
                        risk.severity === "high"
                          ? "text-red-500"
                          : risk.severity === "medium"
                          ? "text-yellow-500"
                          : "text-gray-500"
                      )}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-xs font-medium",
                            risk.severity === "high"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                              : risk.severity === "medium"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          )}
                        >
                          {risk.severity === "high"
                            ? "Yüksek Risk"
                            : risk.severity === "medium"
                            ? "Orta Risk"
                            : "Düşük Risk"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 mb-2">
                        {risk.description}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Öneri:</strong> {risk.recommendation}
                      </p>
                      {risk.relatedClause && (
                        <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {risk.relatedClause}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-700 dark:text-gray-300">Risk tespit edilmedi</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Belgede önemli bir risk bulunmamaktadır
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  isExpanded,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="font-medium text-gray-900 dark:text-white">{title}</span>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isExpanded && <div className="p-4">{children}</div>}
    </div>
  );
}

// Entity Badge Component
interface EntityBadgeProps {
  entity: {
    type: string;
    value: string;
    context?: string;
    confidence: number;
  };
  color: string;
}

function EntityBadge({ entity, color }: EntityBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          "px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors",
          `bg-${color}-50 dark:bg-${color}-900/20`,
          `text-${color}-700 dark:text-${color}-300`,
          `hover:bg-${color}-100 dark:hover:bg-${color}-900/30`
        )}
      >
        {entity.value}
        <Copy
          size={12}
          className="opacity-50 hover:opacity-100 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(entity.value);
          }}
        />
      </button>

      {showTooltip && entity.context && (
        <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg z-10">
          <p className="mb-1 font-medium">Bağlam:</p>
          <p className="text-gray-300">{entity.context}</p>
          <p className="mt-2 text-gray-400">
            Güven: {Math.round(entity.confidence * 100)}%
          </p>
          <div className="absolute bottom-0 left-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-700" />
        </div>
      )}
    </div>
  );
}
