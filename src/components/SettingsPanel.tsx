"use client";

import React, { useState } from "react";
import {
  Settings,
  X,
  Moon,
  Sun,
  Monitor,
  Type,
  Scale,
  Bell,
  Shield,
  Sparkles,
  Save,
  RotateCcw,
  ChevronRight,
  User,
  BookOpen,
  Zap,
} from "lucide-react";
import { cn } from "@/utils/cn";
import {
  UserPreferences,
  LawArea,
  LAW_AREA_LABELS,
  UserRole,
} from "@/lib/user-profile";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  userRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

const ROLE_OPTIONS: Array<{ value: UserRole; label: string; description: string }> = [
  { value: "lawyer", label: "Avukat", description: "Detaylı ve teknik yanıtlar" },
  { value: "student", label: "Öğrenci", description: "Açıklayıcı ve öğretici" },
  { value: "researcher", label: "Araştırmacı", description: "Akademik kaynaklar dahil" },
  { value: "professional", label: "Profesyonel", description: "İş odaklı yanıtlar" },
  { value: "citizen", label: "Vatandaş", description: "Anlaşılır ve basit" },
];

const THEME_OPTIONS = [
  { value: "light", label: "Açık", icon: Sun },
  { value: "dark", label: "Koyu", icon: Moon },
  { value: "system", label: "Sistem", icon: Monitor },
] as const;

const FONT_SIZE_OPTIONS = [
  { value: "small", label: "Küçük" },
  { value: "medium", label: "Normal" },
  { value: "large", label: "Büyük" },
] as const;

const RESPONSE_LENGTH_OPTIONS = [
  { value: "concise", label: "Kısa", description: "Öz ve direkt" },
  { value: "detailed", label: "Detaylı", description: "Dengeli açıklama" },
  { value: "comprehensive", label: "Kapsamlı", description: "Tüm yönleriyle" },
] as const;

const CITATION_STYLE_OPTIONS = [
  { value: "turkish", label: "Türkçe", example: "Yargıtay 9. HD, E. 2024/1234" },
  { value: "academic", label: "Akademik", example: "Yarg. 9. HD, 2024/1234 E." },
  { value: "simple", label: "Basit", example: "9. HD 2024/1234" },
] as const;

export function SettingsPanel({
  isOpen,
  onClose,
  preferences,
  onSave,
  userRole = "citizen",
  onRoleChange,
}: SettingsPanelProps) {
  const [localPrefs, setLocalPrefs] = useState<UserPreferences>(preferences);
  const [localRole, setLocalRole] = useState<UserRole>(userRole);
  const [activeSection, setActiveSection] = useState<string>("general");
  const [hasChanges, setHasChanges] = useState(false);

  const updatePref = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setLocalPrefs((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const toggleLawArea = (area: LawArea) => {
    const current = localPrefs.preferredLawAreas;
    const updated = current.includes(area)
      ? current.filter((a) => a !== area)
      : [...current, area];
    updatePref("preferredLawAreas", updated);
  };

  const handleSave = () => {
    onSave(localPrefs);
    if (onRoleChange && localRole !== userRole) {
      onRoleChange(localRole);
    }
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    setLocalPrefs(preferences);
    setLocalRole(userRole);
    setHasChanges(false);
  };

  if (!isOpen) return null;

  const sections = [
    { id: "general", label: "Genel", icon: Settings },
    { id: "profile", label: "Profil", icon: User },
    { id: "legal", label: "Hukuk Alanları", icon: Scale },
    { id: "ai", label: "AI Davranışı", icon: Sparkles },
    { id: "notifications", label: "Bildirimler", icon: Bell },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar */}
        <div className="w-56 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Ayarlar</h2>
          </div>

          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    activeSection === section.id
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon size={18} />
                  {section.label}
                  <ChevronRight
                    size={16}
                    className={cn(
                      "ml-auto transition-transform",
                      activeSection === section.id && "rotate-90"
                    )}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {sections.find((s) => s.id === activeSection)?.label}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* General Section */}
            {activeSection === "general" && (
              <div className="space-y-6">
                {/* Theme */}
                <SettingGroup title="Tema" description="Uygulama görünümü">
                  <div className="flex gap-3">
                    {THEME_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => updatePref("theme", option.value)}
                          className={cn(
                            "flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                            localPrefs.theme === option.value
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                          )}
                        >
                          <Icon
                            size={24}
                            className={cn(
                              localPrefs.theme === option.value
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-500"
                            )}
                          />
                          <span className="text-sm font-medium">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </SettingGroup>

                {/* Font Size */}
                <SettingGroup title="Yazı Boyutu" description="Metin boyutu tercihi">
                  <div className="flex gap-2">
                    {FONT_SIZE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updatePref("fontSize", option.value)}
                        className={cn(
                          "flex-1 py-2 px-4 rounded-lg border transition-colors",
                          localPrefs.fontSize === option.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </SettingGroup>

                {/* Strict Mode */}
                <SettingGroup
                  title="Strict Mode"
                  description="Kaynak doğrulama zorunluluğu"
                >
                  <ToggleSwitch
                    checked={localPrefs.strictMode}
                    onChange={(v) => updatePref("strictMode", v)}
                    label="En az 2 güvenilir kaynak gereksin"
                  />
                </SettingGroup>

                {/* Auto Expand Sources */}
                <SettingGroup
                  title="Kaynakları Otomatik Aç"
                  description="Yanıtlarda kaynakları göster"
                >
                  <ToggleSwitch
                    checked={localPrefs.autoExpandSources}
                    onChange={(v) => updatePref("autoExpandSources", v)}
                    label="Kaynak panelini otomatik genişlet"
                  />
                </SettingGroup>
              </div>
            )}

            {/* Profile Section */}
            {activeSection === "profile" && (
              <div className="space-y-6">
                <SettingGroup
                  title="Kullanıcı Rolü"
                  description="Yanıtların sizin için nasıl optimize edileceğini belirler"
                >
                  <div className="grid gap-3">
                    {ROLE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setLocalRole(option.value);
                          setHasChanges(true);
                        }}
                        className={cn(
                          "p-4 rounded-xl border-2 text-left transition-all",
                          localRole === option.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        )}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {option.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </SettingGroup>

                {/* Citation Style */}
                <SettingGroup
                  title="Atıf Stili"
                  description="Hukuki referansların gösterim formatı"
                >
                  <div className="space-y-2">
                    {CITATION_STYLE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updatePref("citationStyle", option.value)}
                        className={cn(
                          "w-full p-3 rounded-lg border text-left transition-colors",
                          localPrefs.citationStyle === option.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700"
                        )}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                          {option.example}
                        </div>
                      </button>
                    ))}
                  </div>
                </SettingGroup>
              </div>
            )}

            {/* Legal Areas Section */}
            {activeSection === "legal" && (
              <div className="space-y-6">
                <SettingGroup
                  title="İlgilendiğiniz Hukuk Alanları"
                  description="Seçimlerinize göre öneriler ve içerik özelleştirilir"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(LAW_AREA_LABELS) as [LawArea, string][]).map(
                      ([area, label]) => (
                        <button
                          key={area}
                          onClick={() => toggleLawArea(area)}
                          className={cn(
                            "p-3 rounded-lg border text-left text-sm transition-colors",
                            localPrefs.preferredLawAreas.includes(area)
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                              : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                          )}
                        >
                          {label}
                        </button>
                      )
                    )}
                  </div>
                </SettingGroup>

                {/* Default Search Mode */}
                <SettingGroup
                  title="Varsayılan Arama Modu"
                  description="Aramalar için varsayılan kaynak türü"
                >
                  <div className="flex gap-2">
                    {[
                      { value: "web", label: "Web", icon: BookOpen },
                      { value: "file", label: "Dosya", icon: Scale },
                      { value: "hybrid", label: "Hibrit", icon: Zap },
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() =>
                            updatePref(
                              "defaultSearchMode",
                              option.value as "web" | "file" | "hybrid"
                            )
                          }
                          className={cn(
                            "flex-1 p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors",
                            localPrefs.defaultSearchMode === option.value
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-700"
                          )}
                        >
                          <Icon size={20} />
                          <span className="text-sm">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </SettingGroup>
              </div>
            )}

            {/* AI Behavior Section */}
            {activeSection === "ai" && (
              <div className="space-y-6">
                {/* Response Length */}
                <SettingGroup
                  title="Yanıt Uzunluğu"
                  description="AI yanıtlarının detay seviyesi"
                >
                  <div className="space-y-2">
                    {RESPONSE_LENGTH_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updatePref("responseLength", option.value)}
                        className={cn(
                          "w-full p-3 rounded-lg border text-left transition-colors",
                          localPrefs.responseLength === option.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700"
                        )}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {option.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </SettingGroup>

                {/* Alternative Views */}
                <SettingGroup
                  title="Alternatif Görüşler"
                  description="Farklı hukuki yorumları da göster"
                >
                  <ToggleSwitch
                    checked={localPrefs.includeAlternativeViews}
                    onChange={(v) => updatePref("includeAlternativeViews", v)}
                    label="Farklı içtihat ve yorumları dahil et"
                  />
                </SettingGroup>

                {/* Confidence Scores */}
                <SettingGroup
                  title="Güven Skorları"
                  description="Kaynak güvenilirlik göstergelerini göster"
                >
                  <ToggleSwitch
                    checked={localPrefs.showConfidenceScores}
                    onChange={(v) => updatePref("showConfidenceScores", v)}
                    label="Güven skorlarını görüntüle"
                  />
                </SettingGroup>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && (
              <div className="space-y-6">
                <SettingGroup
                  title="E-posta Bildirimleri"
                  description="Önemli güncellemeler için e-posta al"
                >
                  <ToggleSwitch
                    checked={localPrefs.emailNotifications}
                    onChange={(v) => updatePref("emailNotifications", v)}
                    label="E-posta bildirimlerini etkinleştir"
                  />
                </SettingGroup>

                <SettingGroup
                  title="Süre Hatırlatıcıları"
                  description="Hukuki süreleri takip et"
                >
                  <ToggleSwitch
                    checked={localPrefs.deadlineReminders}
                    onChange={(v) => updatePref("deadlineReminders", v)}
                    label="Süre hatırlatıcılarını etkinleştir"
                  />
                </SettingGroup>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between">
            <button
              onClick={handleReset}
              disabled={!hasChanges}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
            >
              <RotateCcw size={16} />
              Sıfırla
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save size={16} />
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
interface SettingGroupProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingGroup({ title, description, children }: SettingGroupProps) {
  return (
    <div>
      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{description}</p>
      {children}
    </div>
  );
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors",
          checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
    </label>
  );
}
