"use client";

import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/utils/cn";

export interface VerificationData {
  overallConfidence: number;
  riskLevel: "low" | "medium" | "high";
  totalCitations: number;
  verifiedCitations: number;
  entityGrounding: number;
  relationPreservation: number;
  warnings: string[];
  citationDetails?: Array<{
    text: string;
    source: string;
    isVerified: boolean;
    confidence: number;
  }>;
}

interface VerificationBadgeProps {
  verification: VerificationData;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const RISK_CONFIG = {
  low: {
    icon: ShieldCheck,
    label: "Yüksek Güvenilirlik",
    color: "green",
    bgLight: "bg-green-50 dark:bg-green-900/20",
    bgDark: "bg-green-500",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-700 dark:text-green-300",
  },
  medium: {
    icon: ShieldAlert,
    label: "Orta Güvenilirlik",
    color: "yellow",
    bgLight: "bg-yellow-50 dark:bg-yellow-900/20",
    bgDark: "bg-yellow-500",
    border: "border-yellow-200 dark:border-yellow-800",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  high: {
    icon: ShieldX,
    label: "Doğrulama Gerekli",
    color: "red",
    bgLight: "bg-red-50 dark:bg-red-900/20",
    bgDark: "bg-red-500",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-700 dark:text-red-300",
  },
};

export function VerificationBadge({
  verification,
  showDetails = true,
  size = "md",
  className,
}: VerificationBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = RISK_CONFIG[verification.riskLevel];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  };

  return (
    <div className={cn("inline-block", className)}>
      {/* Main Badge */}
      <button
        onClick={() => showDetails && setIsExpanded(!isExpanded)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-medium transition-all",
          config.bgLight,
          config.text,
          sizeClasses[size],
          showDetails && "cursor-pointer hover:opacity-80"
        )}
      >
        <Icon size={iconSizes[size]} />
        <span>{config.label}</span>
        <span className="opacity-70">
          ({Math.round(verification.overallConfidence * 100)}%)
        </span>
        {showDetails && (
          isExpanded ? (
            <ChevronUp size={iconSizes[size]} />
          ) : (
            <ChevronDown size={iconSizes[size]} />
          )
        )}
      </button>

      {/* Expanded Details */}
      {showDetails && isExpanded && (
        <div
          className={cn(
            "mt-2 p-4 rounded-xl border",
            config.bgLight,
            config.border
          )}
        >
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <MetricCard
              label="Kaynak Doğrulama"
              value={`${verification.verifiedCitations}/${verification.totalCitations}`}
              percentage={
                verification.totalCitations > 0
                  ? (verification.verifiedCitations / verification.totalCitations) * 100
                  : 0
              }
            />
            <MetricCard
              label="Entity Grounding"
              value={`${Math.round(verification.entityGrounding * 100)}%`}
              percentage={verification.entityGrounding * 100}
            />
            <MetricCard
              label="Relation Preservation"
              value={`${Math.round(verification.relationPreservation * 100)}%`}
              percentage={verification.relationPreservation * 100}
            />
            <MetricCard
              label="Toplam Güven"
              value={`${Math.round(verification.overallConfidence * 100)}%`}
              percentage={verification.overallConfidence * 100}
            />
          </div>

          {/* Warnings */}
          {verification.warnings.length > 0 && (
            <div className="mb-4">
              <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Uyarılar
              </h5>
              <div className="space-y-1">
                {verification.warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-yellow-700 dark:text-yellow-300"
                  >
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Citation Details */}
          {verification.citationDetails && verification.citationDetails.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Kaynak Detayları
              </h5>
              <div className="space-y-2">
                {verification.citationDetails.map((citation, index) => (
                  <CitationDetail key={index} citation={citation} />
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Info size={12} className="shrink-0 mt-0.5" />
              <p>
                Bu skor, yanıttaki bilgilerin kaynaklarla ne kadar tutarlı olduğunu gösterir.
                Yüksek skor, bilgilerin kaynaklar tarafından desteklendiğini gösterir.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Metric Card
interface MetricCardProps {
  label: string;
  value: string;
  percentage: number;
}

function MetricCard({ label, value, percentage }: MetricCardProps) {
  const getColor = (p: number) => {
    if (p >= 70) return "bg-green-500";
    if (p >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</div>
      <div className="font-medium text-gray-900 dark:text-white">{value}</div>
      <div className="mt-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", getColor(percentage))}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
}

// Citation Detail
interface CitationDetailProps {
  citation: {
    text: string;
    source: string;
    isVerified: boolean;
    confidence: number;
  };
}

function CitationDetail({ citation }: CitationDetailProps) {
  return (
    <div
      className={cn(
        "p-2 rounded-lg border",
        citation.isVerified
          ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
          : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
      )}
    >
      <div className="flex items-start gap-2">
        {citation.isVerified ? (
          <CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />
        ) : (
          <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {citation.text}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {citation.source}
            </span>
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded",
                citation.confidence >= 0.7
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : citation.confidence >= 0.4
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                  : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
              )}
            >
              {Math.round(citation.confidence * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline Verification Indicator - For use within message bubbles
 */
interface InlineVerificationProps {
  confidence: number;
  onClick?: () => void;
}

export function InlineVerification({ confidence, onClick }: InlineVerificationProps) {
  const getStyle = () => {
    if (confidence >= 0.7) {
      return {
        icon: ShieldCheck,
        className: "text-green-600 dark:text-green-400",
        bg: "bg-green-100 dark:bg-green-900/30",
      };
    }
    if (confidence >= 0.4) {
      return {
        icon: ShieldAlert,
        className: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
      };
    }
    return {
      icon: ShieldX,
      className: "text-red-600 dark:text-red-400",
      bg: "bg-red-100 dark:bg-red-900/30",
    };
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs",
        style.bg,
        style.className,
        onClick && "cursor-pointer hover:opacity-80"
      )}
      title={`Güven skoru: ${Math.round(confidence * 100)}%`}
    >
      <Icon size={10} />
      <span>{Math.round(confidence * 100)}%</span>
    </button>
  );
}

/**
 * Verification Summary - For showing at the end of a response
 */
interface VerificationSummaryProps {
  verification: VerificationData;
  onViewDetails?: () => void;
}

export function VerificationSummary({ verification, onViewDetails }: VerificationSummaryProps) {
  const config = RISK_CONFIG[verification.riskLevel];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-xl mt-4",
        config.bgLight,
        config.border,
        "border"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", config.bgLight)}>
          <Icon size={20} className={config.text} />
        </div>
        <div>
          <div className={cn("font-medium", config.text)}>{config.label}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {verification.verifiedCitations}/{verification.totalCitations} kaynak doğrulandı
          </div>
        </div>
      </div>
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className={cn(
            "text-sm font-medium flex items-center gap-1",
            config.text,
            "hover:underline"
          )}
        >
          Detaylar
          <ExternalLink size={12} />
        </button>
      )}
    </div>
  );
}
