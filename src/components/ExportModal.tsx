"use client";

import React, { useState } from "react";
import { X, Download, Copy, Check, FileText, FileJson, File } from "lucide-react";
import { exportConversation, downloadExport, copyToClipboard } from "@/lib/export";
import { cn } from "@/utils/cn";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Source {
  title: string;
  uri: string;
  isTrusted?: boolean;
}

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  sources: Source[];
}

type ExportFormat = "markdown" | "json" | "txt";

const FORMAT_OPTIONS = [
  {
    id: "markdown" as ExportFormat,
    name: "Markdown",
    description: "Okunabilir metin formatı",
    icon: FileText,
  },
  {
    id: "json" as ExportFormat,
    name: "JSON",
    description: "Yapılandırılmış veri",
    icon: FileJson,
  },
  {
    id: "txt" as ExportFormat,
    name: "Düz Metin",
    description: "Basit metin formatı",
    icon: File,
  },
];

export function ExportModal({
  isOpen,
  onClose,
  messages,
  sources,
}: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>("markdown");
  const [includeSources, setIncludeSources] = useState(true);
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    const content = exportConversation({
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      sources,
      format,
      includeSources,
      includeTimestamp,
    });
    downloadExport(content, format);
    onClose();
  };

  const handleCopy = async () => {
    const content = exportConversation({
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      sources,
      format,
      includeSources,
      includeTimestamp,
    });
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sohbeti Dışa Aktar
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {FORMAT_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setFormat(option.id)}
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all text-center",
                      format === option.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-6 h-6 mx-auto mb-2",
                        format === option.id
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400"
                      )}
                    />
                    <div
                      className={cn(
                        "text-sm font-medium",
                        format === option.id
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      {option.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSources}
                onChange={(e) => setIncludeSources(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Kaynakları dahil et
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTimestamp}
                onChange={(e) => setIncludeTimestamp(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Tarih bilgisini dahil et
              </span>
            </label>
          </div>

          {/* Stats */}
          <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Mesaj sayısı:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {messages.length}
              </span>
            </div>
            {sources.length > 0 && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-600 dark:text-gray-400">Kaynak sayısı:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {sources.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check size={16} className="text-green-600" />
                Kopyalandı
              </>
            ) : (
              <>
                <Copy size={16} />
                Kopyala
              </>
            )}
          </button>
          <button
            onClick={handleExport}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download size={16} />
            İndir
          </button>
        </div>
      </div>
    </div>
  );
}
