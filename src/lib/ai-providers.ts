/**
 * AI Provider Configuration
 * 
 * Hem Gemini hem OpenAI API desteği sağlar.
 * En güncel model versiyonlarını kullanır.
 */

export type AIProvider = "gemini" | "openai";

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  text: string;
  model: string;
  provider: AIProvider;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Desteklenen modeller ve versiyonları
 * 2026 yılı itibariyle en güncel versiyonlar
 */
export const SUPPORTED_MODELS = {
  gemini: {
    default: "gemini-2.5-pro-preview-06-05",
    models: [
      { id: "gemini-2.5-pro-preview-06-05", name: "Gemini 2.5 Pro (En Yeni)", recommended: true },
      { id: "gemini-2.5-flash-preview-05-20", name: "Gemini 2.5 Flash (Hızlı)" },
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Stabil)" },
    ],
  },
  openai: {
    default: "gpt-4.1-2025-04-14",
    models: [
      { id: "gpt-4.1-2025-04-14", name: "GPT-4.1 (En Yeni)", recommended: true },
      { id: "o3-mini-2025-01-31", name: "O3 Mini (Reasoning)" },
      { id: "gpt-4o-2024-11-20", name: "GPT-4o (Multimodal)" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo (Stabil)" },
    ],
  },
} as const;

/**
 * Provider bilgilerini getir
 */
export function getProviderInfo(provider: AIProvider) {
  const info = {
    gemini: {
      name: "Google Gemini",
      description: "Google'ın en gelişmiş AI modeli",
      website: "https://ai.google.dev/",
      features: ["Web grounding", "Türkçe desteği", "Uzun context"],
    },
    openai: {
      name: "OpenAI GPT",
      description: "OpenAI'nin en güçlü dil modeli",
      website: "https://platform.openai.com/",
      features: ["Gelişmiş reasoning", "Function calling", "Kod analizi"],
    },
  };
  return info[provider];
}

/**
 * API key'i validate et
 */
export function validateApiKey(provider: AIProvider, apiKey: string): boolean {
  if (!apiKey || apiKey.trim().length < 10) return false;

  if (provider === "gemini") {
    // Gemini API key'leri genelde AI ile başlar
    return apiKey.startsWith("AI") || apiKey.length > 30;
  }

  if (provider === "openai") {
    // OpenAI API key'leri sk- ile başlar
    return apiKey.startsWith("sk-") && apiKey.length > 40;
  }

  return false;
}

/**
 * API key'i gizle (gösterim için)
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 10) return "***";
  return `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}`;
}

/**
 * LocalStorage key'leri
 */
export const STORAGE_KEYS = {
  GEMINI_API_KEY: "hukuk-ai-gemini-key",
  OPENAI_API_KEY: "hukuk-ai-openai-key",
  SELECTED_PROVIDER: "hukuk-ai-selected-provider",
  SELECTED_MODEL: "hukuk-ai-selected-model",
} as const;

/**
 * API ayarlarını localStorage'dan al
 */
export function getStoredApiSettings(): {
  geminiKey: string | null;
  openaiKey: string | null;
  selectedProvider: AIProvider | null;
  selectedModel: string | null;
} {
  if (typeof window === "undefined") {
    return {
      geminiKey: null,
      openaiKey: null,
      selectedProvider: null,
      selectedModel: null,
    };
  }

  return {
    geminiKey: localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY),
    openaiKey: localStorage.getItem(STORAGE_KEYS.OPENAI_API_KEY),
    selectedProvider: localStorage.getItem(STORAGE_KEYS.SELECTED_PROVIDER) as AIProvider | null,
    selectedModel: localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL),
  };
}

/**
 * API ayarlarını localStorage'a kaydet
 */
export function saveApiSettings(settings: {
  geminiKey?: string;
  openaiKey?: string;
  selectedProvider?: AIProvider;
  selectedModel?: string;
}): void {
  if (typeof window === "undefined") return;

  if (settings.geminiKey !== undefined) {
    if (settings.geminiKey) {
      localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, settings.geminiKey);
    } else {
      localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
    }
  }

  if (settings.openaiKey !== undefined) {
    if (settings.openaiKey) {
      localStorage.setItem(STORAGE_KEYS.OPENAI_API_KEY, settings.openaiKey);
    } else {
      localStorage.removeItem(STORAGE_KEYS.OPENAI_API_KEY);
    }
  }

  if (settings.selectedProvider !== undefined) {
    if (settings.selectedProvider) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_PROVIDER, settings.selectedProvider);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_PROVIDER);
    }
  }

  if (settings.selectedModel !== undefined) {
    if (settings.selectedModel) {
      localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, settings.selectedModel);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_MODEL);
    }
  }
}

/**
 * Aktif provider'ı belirle
 */
export function getActiveProvider(): { provider: AIProvider; model: string } | null {
  const settings = getStoredApiSettings();

  // Seçili provider varsa ve key'i de varsa onu kullan
  if (settings.selectedProvider) {
    const hasKey =
      settings.selectedProvider === "gemini"
        ? !!settings.geminiKey
        : !!settings.openaiKey;

    if (hasKey) {
      return {
        provider: settings.selectedProvider,
        model:
          settings.selectedModel ||
          SUPPORTED_MODELS[settings.selectedProvider].default,
      };
    }
  }

  // Gemini key varsa onu kullan
  if (settings.geminiKey) {
    return {
      provider: "gemini",
      model: settings.selectedModel || SUPPORTED_MODELS.gemini.default,
    };
  }

  // OpenAI key varsa onu kullan
  if (settings.openaiKey) {
    return {
      provider: "openai",
      model: settings.selectedModel || SUPPORTED_MODELS.openai.default,
    };
  }

  return null;
}

/**
 * API key durumunu kontrol et
 */
export function getApiKeyStatus(): {
  hasGemini: boolean;
  hasOpenai: boolean;
  hasAny: boolean;
  activeProvider: AIProvider | null;
} {
  const settings = getStoredApiSettings();
  const hasGemini = !!settings.geminiKey;
  const hasOpenai = !!settings.openaiKey;

  let activeProvider: AIProvider | null = null;
  if (settings.selectedProvider && (
    (settings.selectedProvider === "gemini" && hasGemini) ||
    (settings.selectedProvider === "openai" && hasOpenai)
  )) {
    activeProvider = settings.selectedProvider;
  } else if (hasGemini) {
    activeProvider = "gemini";
  } else if (hasOpenai) {
    activeProvider = "openai";
  }

  return {
    hasGemini,
    hasOpenai,
    hasAny: hasGemini || hasOpenai,
    activeProvider,
  };
}
