"use client";

import React, { useRef, useEffect } from "react";
import {
  X,
  Headphones,
  Volume2,
  MousePointer,
  Type,
  Zap,
  Keyboard,
  Monitor,
  Save,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useAccessibility } from "@/contexts/AccessibilityContext";

interface AccessibilitySettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Erişilebilirlik Ayarları Paneli
 * Görme engelli kullanıcılar için ekran okuyucu ve navigasyon seçenekleri
 */
export function AccessibilitySettingsPanel({
  isOpen,
  onClose,
}: AccessibilitySettingsPanelProps) {
  const { settings, updateSettings, announce } = useAccessibility();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Focus trap - modal açıldığında focus'u içeride tut
  useEffect(() => {
    if (isOpen) {
      // Announce panel opening
      announce("Erişilebilirlik ayarları paneli açıldı", "assertive");
      
      // Focus first element
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);

      // Trap focus inside modal
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
          return;
        }

        if (e.key === "Tab" && panelRef.current) {
          const focusableElements = panelRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose, announce]);

  if (!isOpen) return null;

  const handleSave = () => {
    announce("Ayarlar kaydedildi", "polite");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-panel-title"
      aria-describedby="accessibility-panel-description"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        role="document"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="accessibility-panel-title"
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                Ekran Okuyucu Ayarları
              </h2>
              <p
                id="accessibility-panel-description"
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                JAWS, NVDA ve VoiceOver için erişilebilirlik seçenekleri
              </p>
            </div>
          </div>
          <button
            ref={firstFocusableRef}
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Erişilebilirlik panelini kapat"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)] p-6 space-y-6">
          {/* Screen Reader Mode */}
          <SettingSection
            icon={<Volume2 className="w-5 h-5" aria-hidden="true" />}
            title="Ekran Okuyucu Modu"
            description="NVDA, JAWS veya VoiceOver gibi ekran okuyucularla kullanım için optimize edilmiş mod"
          >
            <ToggleSwitch
              checked={settings.screenReaderMode}
              onChange={(v) => {
                updateSettings({ screenReaderMode: v });
                announce(v ? "Ekran okuyucu modu açıldı" : "Ekran okuyucu modu kapatıldı", "assertive");
              }}
              label="Ekran okuyucu modunu etkinleştir"
            />
          </SettingSection>

          {/* Auto Announce Messages */}
          <SettingSection
            icon={<Volume2 className="w-5 h-5" aria-hidden="true" />}
            title="Otomatik Duyurular"
            description="Yeni mesajlar geldiğinde ekran okuyucuya otomatik duyur"
          >
            <ToggleSwitch
              checked={settings.autoAnnounceMessages}
              onChange={(v) => {
                updateSettings({ autoAnnounceMessages: v });
                announce(v ? "Otomatik duyurular açıldı" : "Otomatik duyurular kapatıldı", "polite");
              }}
              label="Yeni mesajları otomatik duyur"
            />
          </SettingSection>

          {/* Navigation Announcements */}
          <SettingSection
            icon={<MousePointer className="w-5 h-5" aria-hidden="true" />}
            title="Navigasyon Duyuruları"
            description="Sayfa geçişleri ve modal açılışlarını duyur"
          >
            <ToggleSwitch
              checked={settings.announceNavigation}
              onChange={(v) => {
                updateSettings({ announceNavigation: v });
                announce(v ? "Navigasyon duyuruları açıldı" : "Navigasyon duyuruları kapatıldı", "polite");
              }}
              label="Navigasyon değişikliklerini duyur"
            />
          </SettingSection>

          {/* High Contrast */}
          <SettingSection
            icon={<Monitor className="w-5 h-5" aria-hidden="true" />}
            title="Yüksek Kontrast"
            description="Metin ve arka plan arasında daha fazla kontrast"
          >
            <ToggleSwitch
              checked={settings.highContrastMode}
              onChange={(v) => {
                updateSettings({ highContrastMode: v });
                announce(v ? "Yüksek kontrast modu açıldı" : "Yüksek kontrast modu kapatıldı", "polite");
              }}
              label="Yüksek kontrast modunu etkinleştir"
            />
          </SettingSection>

          {/* Large Focus Indicators */}
          <SettingSection
            icon={<MousePointer className="w-5 h-5" aria-hidden="true" />}
            title="Büyük Odak Göstergeleri"
            description="Klavye ile gezinirken daha görünür odak halkaları"
          >
            <ToggleSwitch
              checked={settings.largeFocusIndicators}
              onChange={(v) => {
                updateSettings({ largeFocusIndicators: v });
                announce(v ? "Büyük odak göstergeleri açıldı" : "Büyük odak göstergeleri kapatıldı", "polite");
              }}
              label="Büyük odak göstergelerini etkinleştir"
            />
          </SettingSection>

          {/* Reduced Motion */}
          <SettingSection
            icon={<Zap className="w-5 h-5" aria-hidden="true" />}
            title="Azaltılmış Hareket"
            description="Animasyonları ve geçişleri azalt veya kaldır"
          >
            <ToggleSwitch
              checked={settings.reducedMotion}
              onChange={(v) => {
                updateSettings({ reducedMotion: v });
                announce(v ? "Azaltılmış hareket modu açıldı" : "Azaltılmış hareket modu kapatıldı", "polite");
              }}
              label="Animasyonları azalt"
            />
          </SettingSection>

          {/* Keyboard Shortcuts */}
          <SettingSection
            icon={<Keyboard className="w-5 h-5" aria-hidden="true" />}
            title="Klavye Kısayolları"
            description="Hızlı erişim için klavye kısayollarını etkinleştir"
          >
            <ToggleSwitch
              checked={settings.keyboardShortcutsEnabled}
              onChange={(v) => {
                updateSettings({ keyboardShortcutsEnabled: v });
                announce(v ? "Klavye kısayolları açıldı" : "Klavye kısayolları kapatıldı", "polite");
              }}
              label="Klavye kısayollarını etkinleştir"
            />
          </SettingSection>

          {/* Font Size */}
          <SettingSection
            icon={<Type className="w-5 h-5" aria-hidden="true" />}
            title="Yazı Boyutu"
            description="Metin boyutunu artır veya azalt"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const newSize = Math.max(0.8, settings.fontSizeMultiplier - 0.1);
                  updateSettings({ fontSizeMultiplier: newSize });
                  announce(`Yazı boyutu: yüzde ${Math.round(newSize * 100)}`, "polite");
                }}
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Yazı boyutunu küçült"
                disabled={settings.fontSizeMultiplier <= 0.8}
              >
                <Type size={16} aria-hidden="true" />
                <span className="sr-only">Küçült</span>
              </button>
              <span
                className="min-w-[60px] text-center font-medium"
                aria-live="polite"
              >
                %{Math.round(settings.fontSizeMultiplier * 100)}
              </span>
              <button
                onClick={() => {
                  const newSize = Math.min(2.0, settings.fontSizeMultiplier + 0.1);
                  updateSettings({ fontSizeMultiplier: newSize });
                  announce(`Yazı boyutu: yüzde ${Math.round(newSize * 100)}`, "polite");
                }}
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Yazı boyutunu büyüt"
                disabled={settings.fontSizeMultiplier >= 2.0}
              >
                <Type size={20} aria-hidden="true" />
                <span className="sr-only">Büyüt</span>
              </button>
            </div>
          </SettingSection>

          {/* Reading Speed */}
          <SettingSection
            icon={<Volume2 className="w-5 h-5" aria-hidden="true" />}
            title="Okuma Hızı"
            description="Otomatik okuma için hız tercihi"
          >
            <div className="flex gap-2" role="radiogroup" aria-label="Okuma hızı">
              {[
                { value: "slow", label: "Yavaş" },
                { value: "normal", label: "Normal" },
                { value: "fast", label: "Hızlı" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    updateSettings({ readingSpeed: option.value as "slow" | "normal" | "fast" });
                    announce(`Okuma hızı: ${option.label}`, "polite");
                  }}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    settings.readingSpeed === option.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                  )}
                  role="radio"
                  aria-checked={settings.readingSpeed === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </SettingSection>

          {/* Keyboard Shortcuts Info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mt-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Keyboard size={18} aria-hidden="true" />
              Önemli Klavye Kısayolları
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Tab</kbd>
                {" "}— Sonraki öğeye geç
              </li>
              <li>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Shift+Tab</kbd>
                {" "}— Önceki öğeye geç
              </li>
              <li>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Enter</kbd>
                {" "}— Seç veya etkinleştir
              </li>
              <li>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Escape</kbd>
                {" "}— Pencereyi kapat
              </li>
              <li>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">/</kbd>
                {" "}— Sohbet girişine odaklan
              </li>
              <li>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">?</kbd>
                {" "}— Tüm kısayolları göster
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Değişiklikleri iptal et ve paneli kapat"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            aria-label="Erişilebilirlik ayarlarını kaydet"
          >
            <Save size={16} aria-hidden="true" />
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper Components
interface SettingSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingSection({ icon, title, description, children }: SettingSectionProps) {
  const sectionId = title.toLowerCase().replace(/\s+/g, "-");
  return (
    <div
      className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
      role="group"
      aria-labelledby={`${sectionId}-title`}
    >
      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4
          id={`${sectionId}-title`}
          className="font-medium text-gray-900 dark:text-white mb-1"
        >
          {title}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {description}
        </p>
        {children}
      </div>
    </div>
  );
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  const switchId = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor={switchId}
        className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
      >
        {label}
      </label>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-12 h-7 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
        )}
      >
        <span className="sr-only">{label}</span>
        <span
          className={cn(
            "absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform",
            checked && "translate-x-5"
          )}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
