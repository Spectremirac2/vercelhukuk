"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type AIProviderType = "gemini" | "openai";

export interface ApiSettings {
  geminiApiKey: string;
  openaiApiKey: string;
  activeProvider: AIProviderType;
  geminiModel: string;
  openaiModel: string;
}

interface ApiSettingsContextValue {
  settings: ApiSettings;
  updateSettings: (newSettings: Partial<ApiSettings>) => void;
  hasValidKey: (provider: AIProviderType) => boolean;
  getActiveApiKey: () => string | null;
  isReady: boolean;
}

const STORAGE_KEY = "hukuk-ai-api-settings";

// Varsayılan Gemini API Key (demo amaçlı)
const DEFAULT_GEMINI_API_KEY = "AIzaSyDrejx7w5Zm4JLNf9SKhn4qt_8aLlr8ZR8";

const DEFAULT_SETTINGS: ApiSettings = {
  geminiApiKey: DEFAULT_GEMINI_API_KEY,
  openaiApiKey: "",
  activeProvider: "gemini",
  geminiModel: "gemini-2.0-flash-exp", // En güncel Gemini modeli
  openaiModel: "gpt-4o", // En güncel stable GPT modeli (GPT-5 henüz yok)
};

const ApiSettingsContext = createContext<ApiSettingsContextValue | null>(null);

/**
 * useApiSettings hook
 */
export function useApiSettings() {
  const context = useContext(ApiSettingsContext);
  if (!context) {
    throw new Error("useApiSettings must be used within an ApiSettingsProvider");
  }
  return context;
}

interface ApiSettingsProviderProps {
  children: ReactNode;
}

/**
 * ApiSettingsProvider
 * 
 * API ayarlarını localStorage'da saklar ve uygulama genelinde erişilebilir kılar.
 */
export function ApiSettingsProvider({ children }: ApiSettingsProviderProps) {
  const [settings, setSettings] = useState<ApiSettings>(DEFAULT_SETTINGS);
  const [isReady, setIsReady] = useState(false);

  // localStorage'dan ayarları yükle
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
        });
      }
    } catch (error) {
      console.error("API ayarları yüklenemedi:", error);
    }
    setIsReady(true);
  }, []);

  // Ayarları localStorage'a kaydet
  const updateSettings = useCallback((newSettings: Partial<ApiSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("API ayarları kaydedilemedi:", error);
      }
      return updated;
    });
  }, []);

  // Belirli bir provider için geçerli key var mı kontrol et
  const hasValidKey = useCallback(
    (provider: AIProviderType): boolean => {
      if (provider === "gemini") {
        return settings.geminiApiKey.length > 10;
      }
      if (provider === "openai") {
        return settings.openaiApiKey.startsWith("sk-") && settings.openaiApiKey.length > 20;
      }
      return false;
    },
    [settings]
  );

  // Aktif provider'ın API key'ini al
  const getActiveApiKey = useCallback((): string | null => {
    const { activeProvider, geminiApiKey, openaiApiKey } = settings;

    // Aktif provider'ın key'ini kontrol et
    if (activeProvider === "gemini" && geminiApiKey) {
      return geminiApiKey;
    }
    if (activeProvider === "openai" && openaiApiKey) {
      return openaiApiKey;
    }

    // Fallback: Diğer provider'ı dene
    if (geminiApiKey) return geminiApiKey;
    if (openaiApiKey) return openaiApiKey;

    return null;
  }, [settings]);

  return (
    <ApiSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        hasValidKey,
        getActiveApiKey,
        isReady,
      }}
    >
      {children}
    </ApiSettingsContext.Provider>
  );
}
