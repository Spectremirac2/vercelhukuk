"use client";

import React, { useState, useEffect } from "react";
import {
  Key,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Sparkles,
  Zap,
  ExternalLink,
  RefreshCw,
  Trash2,
  Shield,
} from "lucide-react";
import { cn } from "@/utils/cn";
import {
  AIProvider,
  SUPPORTED_MODELS,
  getProviderInfo,
  getStoredApiSettings,
  saveApiSettings,
} from "@/lib/ai-providers";

interface ApiSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export function ApiSettingsPanel({ isOpen, onClose, onSave }: ApiSettingsPanelProps) {
  // State
  const [geminiKey, setGeminiKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [testingProvider, setTestingProvider] = useState<AIProvider | null>(null);
  const [testResults, setTestResults] = useState<Record<AIProvider, "success" | "error" | null>>({
    gemini: null,
    openai: null,
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings on mount
  useEffect(() => {
    if (isOpen) {
      const settings = getStoredApiSettings();
      setGeminiKey(settings.geminiKey || "");
      setOpenaiKey(settings.openaiKey || "");
      setSelectedProvider(settings.selectedProvider);
      setSelectedModel(settings.selectedModel || "");
      setHasChanges(false);
      setTestResults({ gemini: null, openai: null });
    }
  }, [isOpen]);

  // Update model when provider changes
  useEffect(() => {
    if (selectedProvider && !selectedModel) {
      setSelectedModel(SUPPORTED_MODELS[selectedProvider].default);
    }
  }, [selectedProvider, selectedModel]);

  /**
   * API key'i test et
   */
  const testApiKey = async (provider: AIProvider) => {
    const apiKey = provider === "gemini" ? geminiKey : openaiKey;
    if (!apiKey) return;

    setTestingProvider(provider);
    setTestResults((prev) => ({ ...prev, [provider]: null }));

    try {
      const response = await fetch("/api/test-api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey }),
      });

      const result = await response.json();
      setTestResults((prev) => ({
        ...prev,
        [provider]: result.success ? "success" : "error",
      }));
    } catch {
      setTestResults((prev) => ({ ...prev, [provider]: "error" }));
    } finally {
      setTestingProvider(null);
    }
  };

  /**
   * Ayarları kaydet
   */
  const handleSave = () => {
    saveApiSettings({
      geminiKey: geminiKey || undefined,
      openaiKey: openaiKey || undefined,
      selectedProvider: selectedProvider || undefined,
      selectedModel: selectedModel || undefined,
    });

    setHasChanges(false);
    onSave?.();
    onClose();
  };

  /**
   * Key'i sil
   */
  const clearKey = (provider: AIProvider) => {
    if (provider === "gemini") {
      setGeminiKey("");
      if (selectedProvider === "gemini") {
        setSelectedProvider(openaiKey ? "openai" : null);
      }
    } else {
      setOpenaiKey("");
      if (selectedProvider === "openai") {
        setSelectedProvider(geminiKey ? "gemini" : null);
      }
    }
    setTestResults((prev) => ({ ...prev, [provider]: null }));
    setHasChanges(true);
  };

  if (!isOpen) return null;

  const geminiInfo = getProviderInfo("gemini");
  const openaiInfo = getProviderInfo("openai");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                API Ayarları
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI model API anahtarlarını yapılandırın
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Security Notice */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-200">
                API Anahtarları Güvenliği
              </p>
              <p className="text-amber-700 dark:text-amber-300 mt-1">
                API anahtarlarınız yalnızca tarayıcınızda saklanır ve sunucuya gönderilmez. 
                Her istek doğrudan AI sağlayıcılarına gider.
              </p>
            </div>
          </div>

          {/* Gemini Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {geminiInfo.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {geminiInfo.description}
                  </p>
                </div>
              </div>
              <a
                href={geminiInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                API Key Al <ExternalLink size={14} />
              </a>
            </div>

            <div className="relative">
              <input
                type={showGeminiKey ? "text" : "password"}
                value={geminiKey}
                onChange={(e) => {
                  setGeminiKey(e.target.value);
                  setHasChanges(true);
                  setTestResults((prev) => ({ ...prev, gemini: null }));
                }}
                placeholder="AIza..."
                className={cn(
                  "w-full px-4 py-3 pr-24 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
                  testResults.gemini === "success" && "border-green-500",
                  testResults.gemini === "error" && "border-red-500",
                  !testResults.gemini && "border-gray-200 dark:border-gray-700"
                )}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {geminiKey && (
                  <button
                    onClick={() => clearKey("gemini")}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  {showGeminiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => testApiKey("gemini")}
                disabled={!geminiKey || testingProvider === "gemini"}
                className="px-4 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 flex items-center gap-2"
              >
                {testingProvider === "gemini" ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Zap size={14} />
                )}
                Test Et
              </button>
              {testResults.gemini === "success" && (
                <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <Check size={14} /> Bağlantı başarılı
                </span>
              )}
              {testResults.gemini === "error" && (
                <span className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle size={14} /> Bağlantı hatası
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700" />

          {/* OpenAI Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {openaiInfo.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {openaiInfo.description}
                  </p>
                </div>
              </div>
              <a
                href={openaiInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                API Key Al <ExternalLink size={14} />
              </a>
            </div>

            <div className="relative">
              <input
                type={showOpenaiKey ? "text" : "password"}
                value={openaiKey}
                onChange={(e) => {
                  setOpenaiKey(e.target.value);
                  setHasChanges(true);
                  setTestResults((prev) => ({ ...prev, openai: null }));
                }}
                placeholder="sk-..."
                className={cn(
                  "w-full px-4 py-3 pr-24 rounded-xl border bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
                  testResults.openai === "success" && "border-green-500",
                  testResults.openai === "error" && "border-red-500",
                  !testResults.openai && "border-gray-200 dark:border-gray-700"
                )}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {openaiKey && (
                  <button
                    onClick={() => clearKey("openai")}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  {showOpenaiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => testApiKey("openai")}
                disabled={!openaiKey || testingProvider === "openai"}
                className="px-4 py-2 text-sm bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 disabled:opacity-50 flex items-center gap-2"
              >
                {testingProvider === "openai" ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Zap size={14} />
                )}
                Test Et
              </button>
              {testResults.openai === "success" && (
                <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <Check size={14} /> Bağlantı başarılı
                </span>
              )}
              {testResults.openai === "error" && (
                <span className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle size={14} /> Bağlantı hatası
                </span>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700" />

          {/* Provider Selection */}
          {(geminiKey || openaiKey) && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Aktif AI Sağlayıcısı
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Varsayılan olarak kullanılacak AI modelini seçin
              </p>

              <div className="grid grid-cols-2 gap-3">
                {geminiKey && (
                  <button
                    onClick={() => {
                      setSelectedProvider("gemini");
                      setSelectedModel(SUPPORTED_MODELS.gemini.default);
                      setHasChanges(true);
                    }}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all",
                      selectedProvider === "gemini"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        Gemini
                      </span>
                      {selectedProvider === "gemini" && (
                        <Check className="w-4 h-4 text-blue-500 ml-auto" />
                      )}
                    </div>
                  </button>
                )}
                {openaiKey && (
                  <button
                    onClick={() => {
                      setSelectedProvider("openai");
                      setSelectedModel(SUPPORTED_MODELS.openai.default);
                      setHasChanges(true);
                    }}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all",
                      selectedProvider === "openai"
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-emerald-500" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        OpenAI
                      </span>
                      {selectedProvider === "openai" && (
                        <Check className="w-4 h-4 text-emerald-500 ml-auto" />
                      )}
                    </div>
                  </button>
                )}
              </div>

              {/* Model Selection */}
              {selectedProvider && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Model Seçimi
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => {
                      setSelectedModel(e.target.value);
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {SUPPORTED_MODELS[selectedProvider].models.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} {"recommended" in model && model.recommended && "⭐"}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* No API Key Warning */}
          {!geminiKey && !openaiKey && (
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <AlertCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-gray-700 dark:text-gray-300">
                  API Anahtarı Gerekli
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Hukuk AI sistemini kullanabilmek için en az bir API anahtarı girmeniz gerekmektedir.
                  Gemini veya OpenAI API anahtarı alabilirsiniz.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Check size={16} />
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
