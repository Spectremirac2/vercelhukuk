"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  FileText,
  Gavel,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import { cn } from "@/utils/cn";

export interface TimelineEvent {
  id: string;
  date: string | Date;
  title: string;
  description: string;
  type: "filing" | "decision" | "hearing" | "deadline" | "document" | "event";
  importance: "high" | "medium" | "low";
  relatedEntities?: string[];
  source?: string;
}

interface CaseTimelineProps {
  events: TimelineEvent[];
  title?: string;
  className?: string;
  onEventClick?: (event: TimelineEvent) => void;
}

const EVENT_TYPE_CONFIG = {
  filing: {
    icon: FileText,
    label: "Başvuru/Dava",
    color: "blue",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    bgDark: "bg-blue-500",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-300",
  },
  decision: {
    icon: Gavel,
    label: "Karar",
    color: "purple",
    bgLight: "bg-purple-50 dark:bg-purple-900/20",
    bgDark: "bg-purple-500",
    border: "border-purple-200 dark:border-purple-800",
    text: "text-purple-700 dark:text-purple-300",
  },
  hearing: {
    icon: Calendar,
    label: "Duruşma",
    color: "green",
    bgLight: "bg-green-50 dark:bg-green-900/20",
    bgDark: "bg-green-500",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-700 dark:text-green-300",
  },
  deadline: {
    icon: Clock,
    label: "Süre/Vade",
    color: "red",
    bgLight: "bg-red-50 dark:bg-red-900/20",
    bgDark: "bg-red-500",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-700 dark:text-red-300",
  },
  document: {
    icon: FileText,
    label: "Belge",
    color: "gray",
    bgLight: "bg-gray-50 dark:bg-gray-800",
    bgDark: "bg-gray-500",
    border: "border-gray-200 dark:border-gray-700",
    text: "text-gray-700 dark:text-gray-300",
  },
  event: {
    icon: AlertTriangle,
    label: "Olay",
    color: "yellow",
    bgLight: "bg-yellow-50 dark:bg-yellow-900/20",
    bgDark: "bg-yellow-500",
    border: "border-yellow-200 dark:border-yellow-800",
    text: "text-yellow-700 dark:text-yellow-300",
  },
};

const IMPORTANCE_STYLES = {
  high: "ring-2 ring-red-500/50",
  medium: "",
  low: "opacity-80",
};

export function CaseTimeline({
  events,
  title = "Dava Zaman Çizelgesi",
  className,
  onEventClick,
}: CaseTimelineProps) {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Sort events by date
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    if (!filterType) return sortedEvents;
    return sortedEvents.filter((e) => e.type === filterType);
  }, [sortedEvents, filterType]);

  // Group events by year-month
  const groupedEvents = useMemo(() => {
    const groups: Map<string, TimelineEvent[]> = new Map();

    for (const event of filteredEvents) {
      const date = new Date(event.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(event);
    }

    return groups;
  }, [filteredEvents]);

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatMonthYear = (key: string) => {
    const [year, month] = key.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
  };

  const toggleExpand = (eventId: string) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  if (events.length === 0) {
    return (
      <div className={cn("p-6 text-center text-gray-500 dark:text-gray-400", className)}>
        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Henüz zaman çizelgesi olayı yok</p>
      </div>
    );
  }

  return (
    <div className={cn("bg-white dark:bg-gray-900 rounded-2xl shadow-lg", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
              {filteredEvents.length} olay
            </span>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              showFilters
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <Filter size={18} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType(null)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                !filterType
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              )}
            >
              Tümü
            </button>
            {Object.entries(EVENT_TYPE_CONFIG).map(([type, config]) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                  filterType === type
                    ? `${config.bgDark} text-white`
                    : `${config.bgLight} ${config.text}`
                )}
              >
                {config.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="p-4 max-h-[600px] overflow-y-auto">
        {Array.from(groupedEvents.entries()).map(([monthKey, monthEvents]) => (
          <div key={monthKey} className="mb-6 last:mb-0">
            {/* Month header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 py-2 z-10">
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {formatMonthYear(monthKey)}
              </h4>
            </div>

            {/* Events */}
            <div className="relative ml-4 border-l-2 border-gray-200 dark:border-gray-700">
              {monthEvents.map((event, index) => {
                const config = EVENT_TYPE_CONFIG[event.type];
                const Icon = config.icon;
                const isExpanded = expandedEvent === event.id;

                return (
                  <div
                    key={event.id}
                    className={cn(
                      "relative pl-6 pb-4 last:pb-0",
                      index === 0 && "pt-2"
                    )}
                  >
                    {/* Timeline dot */}
                    <div
                      className={cn(
                        "absolute -left-2 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900",
                        config.bgDark,
                        IMPORTANCE_STYLES[event.importance]
                      )}
                    />

                    {/* Event card */}
                    <div
                      className={cn(
                        "p-3 rounded-xl border cursor-pointer transition-all",
                        config.bgLight,
                        config.border,
                        isExpanded && "ring-2 ring-blue-500/30"
                      )}
                      onClick={() => {
                        toggleExpand(event.id);
                        onEventClick?.(event);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Icon className={cn("w-4 h-4", config.text)} />
                          <span className={cn("text-xs font-medium", config.text)}>
                            {config.label}
                          </span>
                          {event.importance === "high" && (
                            <span className="px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded">
                              Önemli
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(event.date)}
                        </span>
                      </div>

                      <h5 className="mt-1 font-medium text-gray-900 dark:text-white text-sm">
                        {event.title}
                      </h5>

                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {event.description}
                      </p>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {event.description}
                          </p>

                          {event.relatedEntities && event.relatedEntities.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                İlgili referanslar:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {event.relatedEntities.map((entity, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                                  >
                                    {entity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {event.source && (
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              Kaynak: {event.source}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Expand indicator */}
                      <div className="flex justify-center mt-2">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {filteredEvents.filter((e) => e.importance === "high").length} önemli olay
          </span>
          <span>
            {filteredEvents.filter((e) => e.type === "deadline").length} süre/vade
          </span>
          <span>
            {filteredEvents.filter((e) => e.type === "decision").length} karar
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Timeline Mini Preview - For showing in chat or sidebar
 */
interface TimelineMiniProps {
  events: TimelineEvent[];
  maxItems?: number;
  onViewAll?: () => void;
}

export function TimelineMini({ events, maxItems = 3, onViewAll }: TimelineMiniProps) {
  const recentEvents = events
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxItems);

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          Son Olaylar
        </span>
      </div>

      <div className="space-y-2">
        {recentEvents.map((event) => {
          const config = EVENT_TYPE_CONFIG[event.type];
          return (
            <div
              key={event.id}
              className="flex items-center gap-2 text-xs"
            >
              <div className={cn("w-2 h-2 rounded-full", config.bgDark)} />
              <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
                {event.title}
              </span>
              <span className="text-gray-400 dark:text-gray-500">
                {new Date(event.date).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          );
        })}
      </div>

      {events.length > maxItems && onViewAll && (
        <button
          onClick={onViewAll}
          className="mt-2 w-full text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          Tümünü gör ({events.length} olay)
        </button>
      )}
    </div>
  );
}
