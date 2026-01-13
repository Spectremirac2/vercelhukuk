"use client";

import React from "react";
import { ExternalLink, Shield, AlertTriangle } from "lucide-react";
import { cn } from "@/utils/cn";

interface Source {
  title: string;
  uri: string;
  isTrusted?: boolean;
}

interface SourcesPanelProps {
  sources: Source[];
}

export function SourcesPanel({ sources }: SourcesPanelProps) {
  if (!sources || sources.length === 0) return null;

  const trustedCount = sources.filter((s) => s.isTrusted).length;
  const secondaryCount = sources.length - trustedCount;

  return (
    <div className="w-80 h-full border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 overflow-y-auto hidden lg:block">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
        Kaynaklar ({sources.length})
      </h3>

      {/* Source Summary */}
      <div className="flex gap-2 mb-4 text-xs">
        {trustedCount > 0 && (
          <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
            <Shield size={10} />
            {trustedCount} Resmi
          </span>
        )}
        {secondaryCount > 0 && (
          <span className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full">
            <AlertTriangle size={10} />
            {secondaryCount} İkincil
          </span>
        )}
      </div>

      <div className="space-y-3">
        {sources.map((source, idx) => {
          let hostname = "";
          try {
            hostname = new URL(source.uri).hostname;
          } catch {
            hostname = source.uri;
          }

          return (
            <a
              key={idx}
              href={source.uri}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "block p-3 bg-white dark:bg-gray-800 border rounded-lg hover:shadow-md dark:hover:shadow-none dark:hover:bg-gray-700 transition-all group",
                source.isTrusted
                  ? "border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600"
                  : "border-yellow-200 dark:border-yellow-800 hover:border-yellow-400 dark:hover:border-yellow-600"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    [{idx + 1}]
                  </span>
                  {source.isTrusted ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <Shield size={10} />
                      Resmi
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                      <AlertTriangle size={10} />
                      İkincil
                    </span>
                  )}
                </div>
                <ExternalLink
                  size={12}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-500"
                />
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug">
                {source.title || "Adsız Kaynak"}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 truncate">
                {hostname}
              </div>
            </a>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-xs text-gray-600 dark:text-gray-400">
        <p className="font-medium mb-2">Kaynak Türleri:</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield size={10} className="text-green-600 dark:text-green-400" />
            <span>
              <strong>Resmi:</strong> mevzuat.gov.tr, yargitay.gov.tr vb.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={10} className="text-yellow-600 dark:text-yellow-400" />
            <span>
              <strong>İkincil:</strong> Diğer kaynaklar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
