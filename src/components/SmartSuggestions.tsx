"use client";

import React, { useMemo } from "react";
import { cn } from "@/utils/cn";
import {
  getSmartSuggestions,
  getFollowUpQuestions,
  QUICK_ACCESS_QUESTIONS,
  SmartSuggestion,
  getContextualHelp
} from "@/lib/smart-suggestions";
import {
  Lightbulb,
  HelpCircle,
  Calculator,
  Clock,
  AlertTriangle,
  FileText,
  Gavel,
  BookOpen,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface SmartSuggestionsProps {
  /** Mevcut sorgu veya bağlam */
  currentQuery?: string;
  /** Son mesaj (takip soruları için) */
  lastMessage?: string;
  /** Öneri tıklandığında */
  onSuggestionClick: (suggestion: string) => void;
  /** Araç açma (opsiyonel) */
  onToolOpen?: (toolId: string) => void;
  /** Compact mod (chat içinde) */
  compact?: boolean;
  /** Sınıf adı */
  className?: string;
}

const suggestionTypeIcons: Record<string, React.ReactNode> = {
  question: <HelpCircle size={14} />,
  tool: <Sparkles size={14} />,
  article: <FileText size={14} />,
  precedent: <Gavel size={14} />,
  concept: <BookOpen size={14} />,
  calculator: <Calculator size={14} />,
  template: <FileText size={14} />,
  deadline: <Clock size={14} />,
  warning: <AlertTriangle size={14} />,
};

const suggestionTypeColors: Record<string, string> = {
  question: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  tool: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  article: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  precedent: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  concept: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  calculator: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
  template: "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  deadline: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
  warning: "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800",
};

export function SmartSuggestions({
  currentQuery = "",
  lastMessage,
  onSuggestionClick,
  onToolOpen,
  compact = false,
  className
}: SmartSuggestionsProps) {
  // Akıllı öneriler
  const suggestions = useMemo(() => {
    if (currentQuery.length > 2) {
      return getSmartSuggestions({ query: currentQuery });
    }
    return [];
  }, [currentQuery]);

  // Takip soruları
  const followUpQuestions = useMemo(() => {
    if (lastMessage) {
      return getFollowUpQuestions(lastMessage);
    }
    return [];
  }, [lastMessage]);

  // Bağlamsal yardım
  const contextualHelp = useMemo(() => {
    if (currentQuery.length > 3) {
      return getContextualHelp(currentQuery);
    }
    return null;
  }, [currentQuery]);

  const handleSuggestionAction = (suggestion: SmartSuggestion) => {
    switch (suggestion.action.type) {
      case 'ask':
        const payload = suggestion.action.payload as { question?: string };
        onSuggestionClick(payload.question || suggestion.title);
        break;
      case 'open_tool':
        if (onToolOpen) {
          const toolPayload = suggestion.action.payload as { toolId: string };
          onToolOpen(toolPayload.toolId);
        }
        break;
      case 'calculate':
        onSuggestionClick(`${suggestion.title} hesapla`);
        break;
      default:
        onSuggestionClick(suggestion.title);
    }
  };

  // Eğer hiç öneri yoksa ve boş query varsa, hızlı erişim sorularını göster
  if (suggestions.length === 0 && !currentQuery && !lastMessage) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          <Lightbulb size={16} className="text-amber-500" />
          <span>Hızlı Sorular</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {QUICK_ACCESS_QUESTIONS.slice(0, 3).map((category) => (
            <div key={category.category} className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {category.category}
              </p>
              {category.questions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => onSuggestionClick(question)}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 flex items-center gap-2 group"
                >
                  <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <span className="line-clamp-1">{question}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Compact mode - sadece birkaç öneri göster
  if (compact && suggestions.length > 0) {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {suggestions.slice(0, 4).map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => handleSuggestionAction(suggestion)}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all hover:scale-[1.02]",
              suggestionTypeColors[suggestion.type] || suggestionTypeColors.question
            )}
          >
            {suggestionTypeIcons[suggestion.type]}
            <span className="line-clamp-1 max-w-[150px]">{suggestion.title}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Uyarılar (deadline, warning) öncelikli */}
      {suggestions.filter(s => s.type === 'deadline' || s.type === 'warning').length > 0 && (
        <div className="space-y-2">
          {suggestions
            .filter(s => s.type === 'deadline' || s.type === 'warning')
            .map((suggestion) => (
              <div
                key={suggestion.id}
                className={cn(
                  "p-3 rounded-xl border flex items-start gap-3",
                  suggestion.type === 'deadline' 
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    : "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  suggestion.type === 'deadline' ? "bg-red-100 dark:bg-red-900/50" : "bg-orange-100 dark:bg-orange-900/50"
                )}>
                  {suggestionTypeIcons[suggestion.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium",
                    suggestion.type === 'deadline' ? "text-red-800 dark:text-red-200" : "text-orange-800 dark:text-orange-200"
                  )}>
                    {suggestion.title}
                  </p>
                  <p className={cn(
                    "text-xs mt-0.5",
                    suggestion.type === 'deadline' ? "text-red-600 dark:text-red-300" : "text-orange-600 dark:text-orange-300"
                  )}>
                    {suggestion.description}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Diğer öneriler */}
      {suggestions.filter(s => s.type !== 'deadline' && s.type !== 'warning').length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            <Sparkles size={14} className="text-purple-500" />
            <span>Öneriler</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions
              .filter(s => s.type !== 'deadline' && s.type !== 'warning')
              .slice(0, 6)
              .map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionAction(suggestion)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:scale-[1.02] hover:shadow-sm",
                    suggestionTypeColors[suggestion.type] || suggestionTypeColors.question
                  )}
                  title={suggestion.description}
                >
                  {suggestionTypeIcons[suggestion.type]}
                  <span className="line-clamp-1 max-w-[200px]">{suggestion.title}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Takip soruları */}
      {followUpQuestions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            <HelpCircle size={14} className="text-blue-500" />
            <span>İlgili Sorular</span>
          </div>
          <div className="space-y-1.5">
            {followUpQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => onSuggestionClick(question)}
                className="w-full text-left px-3 py-2 text-sm rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-blue-700 dark:text-blue-300 flex items-center gap-2 group border border-blue-200 dark:border-blue-800"
              >
                <ChevronRight size={14} className="text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                <span>{question}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bağlamsal Yardım */}
      {contextualHelp && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800">
          <h4 className="text-sm font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
            💡 {contextualHelp.topic}
          </h4>
          
          {contextualHelp.tips.length > 0 && (
            <div className="space-y-1 mb-3">
              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-300">İpuçları:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {contextualHelp.tips.slice(0, 3).map((tip, idx) => (
                  <li key={idx} className="text-xs text-indigo-700 dark:text-indigo-300">{tip}</li>
                ))}
              </ul>
            </div>
          )}
          
          {contextualHelp.warnings.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-orange-600 dark:text-orange-300">⚠️ Dikkat:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {contextualHelp.warnings.slice(0, 2).map((warning, idx) => (
                  <li key={idx} className="text-xs text-orange-700 dark:text-orange-300">{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {contextualHelp.suggestedQuestions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-700">
              <div className="flex flex-wrap gap-1.5">
                {contextualHelp.suggestedQuestions.slice(0, 3).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSuggestionClick(q)}
                    className="text-xs px-2 py-1 rounded-md bg-white/50 dark:bg-black/20 text-indigo-700 dark:text-indigo-300 hover:bg-white dark:hover:bg-black/30 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Chat içinde kullanılacak mini öneri çubuğu
 */
export function MiniSuggestionBar({
  query,
  onSuggestionClick,
  className
}: {
  query: string;
  onSuggestionClick: (text: string) => void;
  className?: string;
}) {
  const suggestions = useMemo(() => {
    if (query.length < 3) return [];
    return getSmartSuggestions({ query }).slice(0, 3);
  }, [query]);

  if (suggestions.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto py-1 px-2", className)}>
      <Lightbulb size={12} className="text-amber-500 flex-shrink-0" />
      {suggestions.map((s) => (
        <button
          key={s.id}
          onClick={() => {
            if (s.action.type === 'ask') {
              const payload = s.action.payload as { question?: string };
              onSuggestionClick(payload.question || s.title);
            } else {
              onSuggestionClick(s.title);
            }
          }}
          className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap flex-shrink-0"
        >
          {s.title.length > 30 ? s.title.slice(0, 30) + '...' : s.title}
        </button>
      ))}
    </div>
  );
}
