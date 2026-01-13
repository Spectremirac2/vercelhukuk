"use client";

import React, { useEffect } from "react";
import { cn } from "@/utils/cn";
import { X } from "lucide-react";

/**
 * ToolModal - Araç panelleri için modal wrapper
 */
interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  size?: "md" | "lg" | "xl" | "full";
  children: React.ReactNode;
}

const sizeMap = {
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-[95vw]",
};

export function ToolModal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  size = "lg",
  children,
}: ToolModalProps) {
  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl",
          "max-h-[90vh] overflow-hidden flex flex-col",
          "animate-scale-in",
          sizeMap[size]
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-4">
            {icon && (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                {icon}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * ToolSection - Araç içerik bölümü
 */
interface ToolSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ToolSection({ title, description, children, className }: ToolSectionProps) {
  return (
    <div className={cn("mb-6 last:mb-0", className)}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * ToolResult - Araç sonuç kartı
 */
interface ToolResultProps {
  title: string;
  subtitle?: string;
  status?: "success" | "warning" | "error" | "info";
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const statusColors = {
  success: "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
  warning: "border-l-amber-500 bg-amber-50 dark:bg-amber-900/20",
  error: "border-l-red-500 bg-red-50 dark:bg-red-900/20",
  info: "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20",
};

export function ToolResult({ title, subtitle, status = "info", children, actions }: ToolResultProps) {
  return (
    <div
      className={cn(
        "rounded-xl border-l-4 p-4",
        statusColors[status]
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  );
}

/**
 * ToolResultGrid - Sonuç grid'i
 */
interface ToolResultGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
}

export function ToolResultGrid({ children, columns = 2 }: ToolResultGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {children}
    </div>
  );
}
