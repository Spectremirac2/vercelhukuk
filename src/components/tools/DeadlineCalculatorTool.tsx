"use client";

import React, { useState, useCallback, useMemo } from "react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ToolModal, ToolSection, ToolResult } from "./ToolModal";
import {
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Calculator,
  ChevronRight,
  Info,
  Copy,
} from "lucide-react";

/**
 * DeadlineCalculatorTool - Hukuki süre hesaplama aracı
 */
interface DeadlineCalculatorToolProps {
  isOpen: boolean;
  onClose: () => void;
}

// Süre türleri
const deadlineTypes = [
  { id: "appeal", name: "İstinaf Süresi", days: 14, description: "İstinaf başvuru süresi" },
  { id: "cassation", name: "Temyiz Süresi", days: 15, description: "Yargıtay temyiz süresi" },
  { id: "response", name: "Cevap Dilekçesi", days: 14, description: "Dava cevap süresi" },
  { id: "objection", name: "İtiraz Süresi", days: 7, description: "İcra itiraz süresi" },
  { id: "correction", name: "Düzeltme Talebi", days: 15, description: "Karar düzeltme süresi" },
  { id: "execution", name: "İcra Takibi", days: 10, description: "İcra takip süresi" },
  { id: "custom", name: "Özel Süre", days: 0, description: "Özel gün sayısı girin" },
];

// Resmi tatil günleri (2026)
const holidays2026: Date[] = [
  new Date(2026, 0, 1),   // Yılbaşı
  new Date(2026, 3, 23),  // Ulusal Egemenlik
  new Date(2026, 4, 1),   // İşçi Bayramı
  new Date(2026, 4, 19),  // Gençlik Bayramı
  new Date(2026, 6, 15),  // Demokrasi Bayramı
  new Date(2026, 7, 30),  // Zafer Bayramı
  new Date(2026, 9, 28),  // Cumhuriyet Bayramı
  new Date(2026, 9, 29),  // Cumhuriyet Bayramı
  // Ramazan Bayramı (tahmini)
  new Date(2026, 2, 20),
  new Date(2026, 2, 21),
  new Date(2026, 2, 22),
  // Kurban Bayramı (tahmini)
  new Date(2026, 4, 27),
  new Date(2026, 4, 28),
  new Date(2026, 4, 29),
  new Date(2026, 4, 30),
];

/**
 * Tarihi formatla
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * İş günü mü kontrol et
 */
function isBusinessDay(date: Date): boolean {
  const day = date.getDay();
  // Hafta sonu kontrolü
  if (day === 0 || day === 6) return false;
  
  // Resmi tatil kontrolü
  return !holidays2026.some(
    (h) =>
      h.getDate() === date.getDate() &&
      h.getMonth() === date.getMonth() &&
      h.getFullYear() === date.getFullYear()
  );
}

/**
 * İş günü ekle
 */
function addBusinessDays(startDate: Date, days: number): Date {
  let result = new Date(startDate);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    if (isBusinessDay(result)) {
      addedDays++;
    }
  }
  
  return result;
}

/**
 * Takvim günü ekle
 */
function addCalendarDays(startDate: Date, days: number): Date {
  const result = new Date(startDate);
  result.setDate(result.getDate() + days);
  return result;
}

export function DeadlineCalculatorTool({ isOpen, onClose }: DeadlineCalculatorToolProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [customDays, setCustomDays] = useState<number>(7);
  const [useBusinessDays, setUseBusinessDays] = useState(false);
  const [result, setResult] = useState<{
    endDate: Date;
    dayCount: number;
    isBusinessDay: boolean;
    warnings: string[];
  } | null>(null);

  /**
   * Süre hesapla
   */
  const handleCalculate = useCallback(() => {
    if (!startDate || !selectedType) return;

    const start = new Date(startDate);
    const typeInfo = deadlineTypes.find((t) => t.id === selectedType);
    const days = selectedType === "custom" ? customDays : (typeInfo?.days || 0);

    let endDate: Date;
    if (useBusinessDays) {
      endDate = addBusinessDays(start, days);
    } else {
      endDate = addCalendarDays(start, days);
    }

    // Son gün hafta sonu veya tatil ise bir sonraki iş gününe taşı
    const warnings: string[] = [];
    if (!isBusinessDay(endDate)) {
      const originalEnd = new Date(endDate);
      while (!isBusinessDay(endDate)) {
        endDate.setDate(endDate.getDate() + 1);
      }
      warnings.push(
        `Son gün (${formatDate(originalEnd)}) hafta sonu veya tatil olduğundan, süre bir sonraki iş gününe uzatıldı.`
      );
    }

    // Süre yaklaşıyor uyarısı
    const today = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 3 && daysLeft > 0) {
      warnings.push(`Dikkat: Süre dolmasına ${daysLeft} gün kaldı!`);
    } else if (daysLeft <= 0) {
      warnings.push(`Süre dolmuş! ${Math.abs(daysLeft)} gün geçti.`);
    }

    setResult({
      endDate,
      dayCount: days,
      isBusinessDay: isBusinessDay(endDate),
      warnings,
    });
  }, [startDate, selectedType, customDays, useBusinessDays]);

  /**
   * Sonucu kopyala
   */
  const handleCopy = useCallback(() => {
    if (!result) return;
    
    const typeInfo = deadlineTypes.find((t) => t.id === selectedType);
    const text = `${typeInfo?.name || "Süre"}: ${formatDate(result.endDate)}`;
    navigator.clipboard.writeText(text);
  }, [result, selectedType]);

  /**
   * Kaç gün kaldı
   */
  const daysRemaining = useMemo(() => {
    if (!result) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((result.endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }, [result]);

  return (
    <ToolModal
      isOpen={isOpen}
      onClose={onClose}
      title="Hukuki Süre Hesaplama"
      description="Dava ve icra sürelerini hesaplayın"
      icon={<Clock size={24} />}
      size="lg"
    >
      <div className="space-y-6">
        {/* Süre türü seçimi */}
        <ToolSection title="Süre Türü" description="Hesaplamak istediğiniz süre türünü seçin">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {deadlineTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  "flex flex-col items-start p-3 rounded-xl transition-all text-left",
                  selectedType === type.id
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <span className="font-medium text-sm">{type.name}</span>
                {type.days > 0 && (
                  <span className="text-xs opacity-75">{type.days} gün</span>
                )}
              </button>
            ))}
          </div>
        </ToolSection>

        {/* Özel gün sayısı */}
        {selectedType === "custom" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gün Sayısı
            </label>
            <input
              type="number"
              value={customDays}
              onChange={(e) => setCustomDays(parseInt(e.target.value) || 0)}
              min={1}
              className="w-32 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        )}

        {/* Başlangıç tarihi */}
        <ToolSection title="Başlangıç Tarihi" description="Sürenin başladığı tarihi seçin (tebliğ, karar tarihi vb.)">
          <div className="flex gap-4 items-end">
            <div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="businessDays"
                checked={useBusinessDays}
                onChange={(e) => setUseBusinessDays(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="businessDays" className="text-sm text-gray-600 dark:text-gray-400">
                İş günü hesabı
              </label>
            </div>
          </div>
        </ToolSection>

        {/* Hesapla butonu */}
        <Button
          variant="primary"
          size="lg"
          icon={<Calculator size={20} />}
          onClick={handleCalculate}
          disabled={!startDate || !selectedType}
        >
          Hesapla
        </Button>

        {/* Sonuç */}
        {result && (
          <div className="animate-scale-in">
            <Card
              variant="elevated"
              padding="lg"
              className={cn(
                "border-l-4",
                daysRemaining !== null && daysRemaining <= 0
                  ? "border-l-red-500"
                  : daysRemaining !== null && daysRemaining <= 3
                  ? "border-l-amber-500"
                  : "border-l-emerald-500"
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Son Tarih
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatDate(result.endDate)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
                        daysRemaining !== null && daysRemaining <= 0
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                          : daysRemaining !== null && daysRemaining <= 3
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      )}
                    >
                      {daysRemaining !== null && daysRemaining > 0 ? (
                        <>
                          <Clock size={14} />
                          {daysRemaining} gün kaldı
                        </>
                      ) : daysRemaining === 0 ? (
                        <>
                          <AlertTriangle size={14} />
                          Bugün son gün!
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={14} />
                          Süre doldu ({Math.abs(daysRemaining!)} gün geçti)
                        </>
                      )}
                    </span>
                    {result.isBusinessDay && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <CheckCircle size={12} />
                        İş günü
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" icon={<Copy size={16} />} onClick={handleCopy}>
                  Kopyala
                </Button>
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="mt-4 space-y-2">
                  {result.warnings.map((warning, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm text-amber-700 dark:text-amber-300"
                    >
                      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                      {warning}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Info */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-start gap-3">
              <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Önemli Bilgi</p>
                <ul className="space-y-1 text-blue-600 dark:text-blue-400">
                  <li>• Süreler tebliğ tarihini izleyen günden başlar</li>
                  <li>• Sürenin son günü tatil ise süre bir sonraki iş gününe uzar</li>
                  <li>• Resmi tatiller ve hafta sonları iş günü sayılmaz</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolModal>
  );
}
