"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MessageBubble } from "@/components/MessageBubble";
import { SourcesPanel } from "@/components/SourcesPanel";
import { ExportModal } from "@/components/ExportModal";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";
import {
  SearchFiltersPanel,
  SearchFilters,
  DEFAULT_SEARCH_FILTERS,
} from "@/components/SearchFilters";
import { ThemeToggle, useTheme } from "@/contexts/ThemeContext";
import { useApiSettings } from "@/contexts/ApiSettingsContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useChatShortcuts } from "@/hooks/useKeyboardShortcuts";
import { ConversationSidebar, ConversationItem } from "@/components/ConversationSidebar";
import { QuickActions, FloatingQuickActions } from "@/components/QuickActions";
import { SettingsPanel } from "@/components/SettingsPanel";
import { AccessibilitySettingsPanel } from "@/components/accessibility/AccessibilitySettingsPanel";
import { VerificationData } from "@/components/VerificationBadge";
import { UserPreferences, UserRole } from "@/lib/user-profile";
import { LegalSearch } from "@/components/LegalSearch";
import { formatCaseCitation, formatLegislationCitation } from "@/lib/turkish-legal-db";
import {
  Send,
  Plus,
  Loader2,
  ShieldCheck,
  Paperclip,
  FileText,
  RefreshCw,
  AlertCircle,
  Download,
  Keyboard,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Scale,
  X,
  Home,
  Headphones,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
  verification?: VerificationData;
  retryPayload?: {
    userMessage: string;
    previousMessages: Message[];
  };
}

interface Source {
  title: string;
  uri: string;
  isTrusted?: boolean;
}

interface UploadedFile {
  name: string;
  displayName: string;
  uri: string;
}

// Storage keys
const STORAGE_KEY_MESSAGES = "hukuk-chat-messages";
const STORAGE_KEY_STRICT_MODE = "hukuk-chat-strict-mode";
const STORAGE_KEY_FILTERS = "hukuk-chat-filters";
const STORAGE_KEY_CONVERSATIONS = "hukuk-chat-conversations";
const STORAGE_KEY_SETTINGS = "hukuk-chat-settings";
const STORAGE_KEY_SIDEBAR_COLLAPSED = "hukuk-chat-sidebar-collapsed";

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff

// Default user preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  language: "tr",
  fontSize: "medium",
  strictMode: false,
  defaultSearchMode: "web",
  preferredCourts: [],
  preferredLawAreas: [],
  citationStyle: "turkish",
  autoExpandSources: true,
  emailNotifications: false,
  deadlineReminders: false,
  responseLength: "detailed",
  includeAlternativeViews: true,
  showConfidenceScores: true,
};

/**
 * ChatInterface props
 */
interface ChatInterfaceProps {
  /** Seçili araç (dashboard'dan geçiş) */
  initialTool?: string | null;
  /** Dashboard'a dönüş callback'i */
  onBackToDashboard?: () => void;
}

export default function ChatInterface({ initialTool: _initialTool, onBackToDashboard }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [strictMode, setStrictMode] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState(() => generateId());
  const [retryingMessageId, setRetryingMessageId] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_SEARCH_FILTERS);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // New state for enhanced features
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showLegalSearch, setShowLegalSearch] = useState(false);
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Accessibility context for screen reader announcements
  const { announce, settings: accessibilitySettings } = useAccessibility();

  // API Settings for multi-provider support
  const { settings: apiSettings } = useApiSettings();
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [userRole, setUserRole] = useState<UserRole>("citizen");

  const { toggleTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Save current conversation before switching
  const saveCurrentConversation = useCallback(() => {
    if (messages.length > 0) {
      // Filter out any messages with null/empty content before saving
      const validMessages = messages.filter(
        (m) => m && m.content && typeof m.content === 'string' && m.content.trim().length > 0
      );
      
      if (validMessages.length === 0) return;
      
      const title = validMessages[0]?.content?.slice(0, 50) || `Sohbet ${new Date().toLocaleDateString("tr-TR")}`;
      const existingIndex = conversations.findIndex(c => c.id === conversationId);

      // Save conversation with messages included
      const conversationItem = {
        id: conversationId,
        title: title + (title.length >= 50 ? "..." : ""),
        preview: validMessages[validMessages.length - 1]?.content?.slice(0, 80) || "",
        createdAt: existingIndex >= 0 ? conversations[existingIndex].createdAt : new Date(),
        updatedAt: new Date(),
        messageCount: validMessages.length,
        isPinned: existingIndex >= 0 ? conversations[existingIndex].isPinned : false,
        isFavorite: existingIndex >= 0 ? conversations[existingIndex].isFavorite : false,
        isArchived: existingIndex >= 0 ? conversations[existingIndex].isArchived : false,
        // Include filtered messages with the conversation
        messages: validMessages.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
        })),
      };

      setConversations(prev => {
        const filtered = prev.filter(c => c.id !== conversationId);
        return [conversationItem, ...filtered].slice(0, 100); // Keep last 100 conversations
      });
    }
  }, [messages, conversationId, conversations]);

  // Handle new chat - must be defined before useChatShortcuts
  const handleNewChat = useCallback(() => {
    saveCurrentConversation();
    setMessages([]);
    setSources([]);
    setFiles([]);
    setStoreId(null);
    setFilters(DEFAULT_SEARCH_FILTERS);
    setConversationId(generateId());
    setActiveConversationId(null);
    try {
      localStorage.removeItem(STORAGE_KEY_MESSAGES);
    } catch (e) {
      console.warn("Failed to clear localStorage:", e);
    }
  }, [saveCurrentConversation]);

  // Handle selecting a conversation from sidebar
  const handleSelectConversation = useCallback((selectedId: string) => {
    saveCurrentConversation();
    setActiveConversationId(selectedId);
    setConversationId(selectedId);
    // Reset sources and files
    setSources([]);
    setFiles([]);
    // Load messages for this conversation from localStorage
    try {
      const savedConversations = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
      if (savedConversations) {
        const parsed = JSON.parse(savedConversations);
        const conv = parsed.find((c: { id: string; messages?: Message[] }) => c.id === selectedId);
        if (conv?.messages && Array.isArray(conv.messages)) {
          // Filter out any messages with null/empty content (exclude error messages too)
          const validMessages = conv.messages.filter(
            (m: Message) => m && m.content && typeof m.content === 'string' && m.content.trim().length > 0 && !m.error
          );
          setMessages(validMessages);
        } else {
          // No messages in this conversation - clear current messages
          setMessages([]);
        }
      } else {
        // No conversations found - clear current messages
        setMessages([]);
      }
    } catch (e) {
      console.warn("Failed to load conversation:", e);
      setMessages([]);
    }
  }, [saveCurrentConversation]);

  // Handle quick action selection
  const handleQuickAction = useCallback((prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  }, []);

  // Keyboard shortcuts
  useChatShortcuts({
    onNewChat: handleNewChat,
    onFocusInput: () => inputRef.current?.focus(),
    onToggleStrictMode: () => setStrictMode((prev) => !prev),
    onToggleTheme: toggleTheme,
    onExport: () => messages.length > 0 && setShowExportModal(true),
    onShowShortcuts: () => setShowShortcutsModal(true),
  });

  // Load messages from localStorage on mount (with cleanup)
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out any messages with null/empty content
          const validMessages = parsed.filter(
            (m: Message) => m && m.content && typeof m.content === 'string' && m.content.trim().length > 0 && !m.error
          );
          if (validMessages.length > 0) {
            setMessages(validMessages);
          } else {
            // All messages were invalid - clear storage to prevent future issues
            localStorage.removeItem(STORAGE_KEY_MESSAGES);
          }
        }
      }

      const savedStrictMode = localStorage.getItem(STORAGE_KEY_STRICT_MODE);
      if (savedStrictMode) {
        setStrictMode(savedStrictMode === "true");
      }

      const savedFilters = localStorage.getItem(STORAGE_KEY_FILTERS);
      if (savedFilters) {
        setFilters(JSON.parse(savedFilters));
      }
    } catch (e) {
      console.warn("Failed to load from localStorage:", e);
    }
  }, []);

  // Save messages to localStorage (only valid messages)
  useEffect(() => {
    try {
      if (messages.length > 0) {
        // Filter out invalid messages and only save last 50
        const validMessages = messages.filter(
          (m) => m && m.content && typeof m.content === 'string' && m.content.trim().length > 0 && !m.error
        );
        if (validMessages.length > 0) {
          const toSave = validMessages.slice(-50);
          localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(toSave));
        }
      }
    } catch (e) {
      console.warn("Failed to save to localStorage:", e);
    }
  }, [messages]);

  // Save strict mode preference
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STRICT_MODE, String(strictMode));
    } catch (e) {
      console.warn("Failed to save strict mode:", e);
    }
  }, [strictMode]);

  // Save filters
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FILTERS, JSON.stringify(filters));
    } catch (e) {
      console.warn("Failed to save filters:", e);
    }
  }, [filters]);

  // Load conversations, settings, and sidebar state on mount (with cleanup)
  useEffect(() => {
    try {
      const savedConversations = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
      if (savedConversations) {
        const parsed = JSON.parse(savedConversations);
        // Convert date strings back to Date objects and filter invalid messages
        const withDates = parsed.map((c: ConversationItem & { createdAt: string; updatedAt: string; messages?: Message[] }) => {
          // Filter out invalid messages if they exist (exclude error messages too)
          const validMessages = c.messages?.filter(
            (m: Message) => m && m.content && typeof m.content === 'string' && m.content.trim().length > 0 && !m.error
          ) || [];
          
          return {
            ...c,
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt),
            messages: validMessages,
            messageCount: validMessages.length,
          };
        // Filter out conversations that:
        // 1. Have no messages array and no valid messageCount
        // 2. Have an empty messages array (all messages were invalid)
        // Keep conversations with valid messages or that are new (no messages yet)
        }).filter((c: ConversationItem & { messages?: Message[] }) => {
          // If messages array exists but is empty, this conversation had corrupted messages - remove it
          if (c.messages && c.messages.length === 0 && c.messageCount === 0) {
            console.log(`[Cleanup] Removing corrupted conversation: ${c.id}`);
            return false;
          }
          return true;
        });
        setConversations(withDates);
        
        // Save cleaned data back to localStorage
        if (withDates.length !== parsed.length) {
          console.log(`[Cleanup] Removed ${parsed.length - withDates.length} corrupted conversations`);
          localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(withDates));
        }
      }

      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (savedSettings) {
        setUserPreferences(JSON.parse(savedSettings));
      }

      const savedSidebarState = localStorage.getItem(STORAGE_KEY_SIDEBAR_COLLAPSED);
      if (savedSidebarState) {
        setSidebarCollapsed(savedSidebarState === "true");
      }
    } catch (e) {
      console.warn("Failed to load enhanced settings:", e);
    }
  }, []);

  // Save conversations when they change
  useEffect(() => {
    try {
      if (conversations.length > 0) {
        localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(conversations));
      }
    } catch (e) {
      console.warn("Failed to save conversations:", e);
    }
  }, [conversations]);

  // Save user settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(userPreferences));
      // Apply strict mode from settings
      if (userPreferences.strictMode !== strictMode) {
        setStrictMode(userPreferences.strictMode);
      }
    } catch (e) {
      console.warn("Failed to save settings:", e);
    }
  }, [userPreferences, strictMode]);

  // Save sidebar collapsed state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SIDEBAR_COLLAPSED, String(sidebarCollapsed));
    } catch (e) {
      console.warn("Failed to save sidebar state:", e);
    }
  }, [sidebarCollapsed]);

  // Update filters when files change
  useEffect(() => {
    if (files.length > 0 && filters.searchMode === "web") {
      setFilters((prev) => ({ ...prev, searchMode: "hybrid" }));
    }
  }, [files.length, filters.searchMode]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    if (storeId) {
      formData.append("storeId", storeId);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setFiles((prev) => [...prev, data.file]);
        if (data.storeId) setStoreId(data.storeId);
      } else {
        alert("Dosya yükleme hatası: " + data.error);
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Dosya yükleme hatası");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Core send function with retry support
  const sendMessage = useCallback(
    async (
      userContent: string,
      previousMessages: Message[],
      retryCount = 0
    ): Promise<{
      success: boolean;
      data?: { assistantText: string; sources: Source[] };
      error?: string;
    }> => {
      try {
        // Determine if we should use files based on search mode
        const useFiles =
          files.length > 0 &&
          (filters.searchMode === "file" || filters.searchMode === "hybrid");

        // Prepare API request with multi-provider support
        // Filter out any messages with null/empty content
        const validPreviousMessages = previousMessages.filter(
          (m) => m.content && typeof m.content === 'string' && m.content.trim().length > 0
        );
        
        const requestBody: Record<string, unknown> = {
          conversationId,
          messages: [
            ...validPreviousMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            { role: "user", content: userContent },
          ],
          strictMode,
          storeId,
          useFiles,
        };

        // Add provider and API key if user has configured them
        if (apiSettings.activeProvider && (apiSettings.geminiApiKey || apiSettings.openaiApiKey)) {
          const activeKey = apiSettings.activeProvider === "openai" 
            ? apiSettings.openaiApiKey 
            : apiSettings.geminiApiKey;
          
          if (activeKey) {
            requestBody.provider = apiSettings.activeProvider;
            requestBody.apiKey = activeKey;
            requestBody.model = apiSettings.activeProvider === "openai" 
              ? apiSettings.openaiModel 
              : apiSettings.geminiModel;
          }
        }

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
          // Check if it's a rate limit error
          if (response.status === 429) {
            return {
              success: false,
              error: data.error || "Çok fazla istek. Lütfen bekleyin.",
            };
          }

          // Retry on server errors
          if (response.status >= 500 && retryCount < MAX_RETRIES) {
            await new Promise((r) => setTimeout(r, RETRY_DELAYS[retryCount]));
            return sendMessage(userContent, previousMessages, retryCount + 1);
          }

          return { success: false, error: data.error || "Bir hata oluştu." };
        }

        return {
          success: true,
          data: {
            assistantText: data.assistantText,
            sources: data.sources || [],
          },
        };
      } catch (error) {
        // Network error - retry
        if (retryCount < MAX_RETRIES) {
          await new Promise((r) => setTimeout(r, RETRY_DELAYS[retryCount]));
          return sendMessage(userContent, previousMessages, retryCount + 1);
        }

        console.error("Send error:", error);
        return {
          success: false,
          error: "Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.",
        };
      }
    },
    [conversationId, strictMode, storeId, files.length, filters.searchMode, apiSettings]
  );

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userContent = input.trim();
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: userContent,
    };

    const previousMessages = [...messages];
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setSources([]);

    const result = await sendMessage(userContent, previousMessages);

    if (result.success && result.data) {
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: result.data.assistantText,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setSources(result.data.sources);
    } else {
      // Add error message with retry capability
      const errorMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: result.error || "Bir hata oluştu.",
        error: true,
        retryPayload: {
          userMessage: userContent,
          previousMessages,
        },
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleRetry = async (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message?.retryPayload) return;

    setRetryingMessageId(messageId);

    const result = await sendMessage(
      message.retryPayload.userMessage,
      message.retryPayload.previousMessages
    );

    if (result.success && result.data) {
      // Replace error message with successful response
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                content: result.data!.assistantText,
                error: false,
                retryPayload: undefined,
              }
            : m
        )
      );
      setSources(result.data.sources);
    }

    setRetryingMessageId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Announce new messages for screen readers
  useEffect(() => {
    if (messages.length > 0 && accessibilitySettings.autoAnnounceMessages) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant" && !lastMessage.error) {
        // Truncate long messages for announcement
        const truncated = lastMessage.content.length > 200 
          ? lastMessage.content.slice(0, 200) + "..." 
          : lastMessage.content;
        announce(`Yeni yanıt: ${truncated}`, "polite");
      }
    }
  }, [messages.length, announce, accessibilitySettings.autoAnnounceMessages, messages]);

  // Announce loading state
  useEffect(() => {
    if (isLoading) {
      announce("Yanıt hazırlanıyor, lütfen bekleyin...", "polite");
    }
  }, [isLoading, announce]);

  return (
    <div 
      className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans overflow-hidden"
      role="application"
      aria-label="Hukuk AI Sohbet Uygulaması"
    >
      {/* Conversation Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={activeConversationId || conversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewChat}
        onDeleteConversation={(id) => {
          setConversations(prev => prev.filter(c => c.id !== id));
        }}
        onRenameConversation={(id, newTitle) => {
          setConversations(prev =>
            prev.map(c => (c.id === id ? { ...c, title: newTitle } : c))
          );
        }}
        onTogglePin={(id) => {
          setConversations(prev =>
            prev.map(c => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
          );
        }}
        onToggleFavorite={(id) => {
          setConversations(prev =>
            prev.map(c => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
          );
        }}
        onArchive={(id) => {
          setConversations(prev =>
            prev.map(c => (c.id === id ? { ...c, isArchived: !c.isArchived } : c))
          );
        }}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Chat Area */}
      <main 
        id="main-content" 
        className="flex-1 flex flex-col h-full relative"
        role="main"
        aria-label="Ana sohbet alanı"
        tabIndex={-1}
      >
        {/* Header */}
        <header 
          id="main-nav"
          className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 bg-white dark:bg-gray-900 shrink-0 z-10"
          role="banner"
          aria-label="Uygulama başlığı ve araç çubuğu"
        >
          <div className="flex items-center gap-2">
            {/* Back to Dashboard */}
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors flex items-center gap-1.5 mr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                title="Ana Sayfaya Dön"
                aria-label="Ana sayfaya dön"
              >
                <Home size={18} aria-hidden="true" />
                <span className="text-sm font-medium hidden sm:inline">Ana Sayfa</span>
              </button>
            )}
            {/* Sidebar Toggle for mobile */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Kenar Çubuğu"
              aria-label={sidebarCollapsed ? "Kenar çubuğunu aç" : "Kenar çubuğunu kapat"}
              aria-expanded={!sidebarCollapsed}
            >
              {sidebarCollapsed ? <PanelLeft size={20} aria-hidden="true" /> : <PanelLeftClose size={20} aria-hidden="true" />}
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              <Scale size={16} />
            </div>
            <h1 className="font-semibold text-lg">
              Hukuk AI
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full ml-2">
                Beta
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2" role="toolbar" aria-label="Araç çubuğu">
            {/* Legal Search Button */}
            <button
              onClick={() => setShowLegalSearch(true)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Mevzuat Ara"
              aria-label="Mevzuat ve içtihat arama panelini aç"
            >
              <Scale size={18} aria-hidden="true" />
            </button>

            {/* Export Button */}
            {messages.length > 0 && (
              <button
                onClick={() => setShowExportModal(true)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                title="Sohbeti Dışa Aktar (Ctrl+E)"
                aria-label="Sohbeti dışa aktar. Kısayol: Kontrol artı E"
              >
                <Download size={18} aria-hidden="true" />
              </button>
            )}

            {/* Keyboard Shortcuts */}
            <button
              onClick={() => setShowShortcutsModal(true)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Klavye Kısayolları (?)"
              aria-label="Klavye kısayollarını göster. Kısayol: Soru işareti"
            >
              <Keyboard size={18} aria-hidden="true" />
            </button>

            {/* Accessibility Button - JAWS/Screen Reader */}
            <button
              onClick={() => setShowAccessibilityPanel(true)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Ekran Okuyucu Ayarları (JAWS, NVDA, VoiceOver)"
              aria-label="Ekran okuyucu ayarlarını aç. JAWS, NVDA ve VoiceOver için erişilebilirlik seçenekleri"
            >
              <Headphones size={18} aria-hidden="true" />
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettingsPanel(true)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Ayarlar"
              aria-label="Genel ayarları aç"
            >
              <Settings size={18} aria-hidden="true" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Strict Mode Toggle */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span
                id="strict-mode-label"
                className={cn(
                  "font-medium transition-colors",
                  strictMode
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                Strict
              </span>
              <button
                onClick={() => {
                  setStrictMode(!strictMode);
                  announce(strictMode ? "Strict mod kapatıldı" : "Strict mod açıldı", "polite");
                }}
                className={cn(
                  "w-10 h-6 rounded-full p-1 transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                  strictMode ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                )}
                role="switch"
                aria-checked={strictMode}
                aria-labelledby="strict-mode-label"
                aria-describedby="strict-mode-description"
              >
                <span className="sr-only">Strict mod</span>
                <div
                  className={cn(
                    "w-4 h-4 bg-white rounded-full shadow-sm transition-transform",
                    strictMode ? "translate-x-4" : "translate-x-0"
                  )}
                  aria-hidden="true"
                />
              </button>
              <span id="strict-mode-description" className="sr-only">
                Strict mod açıkken en az 2 güvenilir kaynak gerekir
              </span>
            </div>

            {/* New Chat Button */}
            <button
              onClick={() => {
                handleNewChat();
                announce("Yeni sohbet başlatıldı", "polite");
              }}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Yeni Sohbet (Ctrl+Shift+N)"
              aria-label="Yeni sohbet başlat. Kısayol: Kontrol artı Shift artı N"
            >
              <Plus size={20} aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Search Filters Panel */}
        <SearchFiltersPanel
          filters={filters}
          onFiltersChange={setFilters}
          hasFiles={files.length > 0}
        />

        {/* Messages List */}
        <div 
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 scroll-smooth"
          role="log"
          aria-label="Sohbet mesajları"
          aria-live="polite"
          aria-relevant="additions"
          tabIndex={0}
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Türk Hukuku Asistanı
              </h2>
              <p className="mb-6">
                Mevzuat, içtihat ve hukuki süreçlerle ilgili sorularınızı
                yanıtlar. Cevaplar doğrulanabilir kaynaklara dayandırılır.
              </p>

              {/* Quick Actions */}
              <div className="w-full max-w-xl mb-6">
                <QuickActions
                  onSelectAction={handleQuickAction}
                  variant="grid"
                  showCategories={true}
                />
              </div>

              {/* Shortcut hint */}
              <p className="text-xs text-gray-400 dark:text-gray-500">
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                  ?
                </kbd>{" "}
                tuşuna basarak klavye kısayollarını görüntüleyebilirsiniz
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.error ? (
                <div className="flex w-full mb-6 justify-start">
                  <div className="max-w-[85%] px-5 py-4 rounded-2xl rounded-bl-none bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle size={16} />
                      <span className="font-medium">Hata</span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                    {msg.retryPayload && (
                      <button
                        onClick={() => handleRetry(msg.id)}
                        disabled={retryingMessageId === msg.id}
                        className="mt-3 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 disabled:opacity-50"
                        aria-label={retryingMessageId === msg.id ? "Mesaj tekrar gönderiliyor" : "Hatalı mesajı tekrar gönder"}
                      >
                        {retryingMessageId === msg.id ? (
                          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                        ) : (
                          <RefreshCw size={14} aria-hidden="true" />
                        )}
                        Tekrar Dene
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <MessageBubble role={msg.role} content={msg.content} />
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex w-full mb-6 justify-start">
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-5 py-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-3">
                <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={20} />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Araştırılıyor ve kaynaklar doğrulanıyor...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* File List (if any) */}
        {files.length > 0 && (
          <div className="px-6 pb-2 flex gap-2 overflow-x-auto">
            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300"
              >
                <FileText size={12} />
                <span className="truncate max-w-[150px]">{f.displayName}</span>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <div className="max-w-3xl mx-auto relative flex gap-2 items-end">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt"
              aria-label="Belge dosyası seç"
              id="file-upload-input"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isLoading}
              className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-2xl transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Belge Yükle"
              aria-label={isUploading ? "Belge yükleniyor..." : "PDF, DOC, DOCX veya TXT dosyası yükle"}
              aria-describedby="file-upload-help"
            >
              {isUploading ? (
                <Loader2 size={20} className="animate-spin" aria-hidden="true" />
              ) : (
                <Paperclip size={20} aria-hidden="true" />
              )}
            </button>
            <span id="file-upload-help" className="sr-only">
              Desteklenen dosya türleri: PDF, Word belgesi ve metin dosyaları
            </span>

            <div className="relative flex-1">
              <label htmlFor="chat-input" className="sr-only">
                Hukuki sorunuzu yazın
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hukuki sorunuzu buraya yazın..."
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-4 pr-12 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none max-h-40 min-h-[52px]"
                rows={1}
                style={{ minHeight: "52px" }}
                aria-describedby="chat-input-help"
                aria-label="Hukuki sorunuzu yazın. Enter tuşuyla gönderin, Shift+Enter ile yeni satır ekleyin"
              />
              <span id="chat-input-help" className="sr-only">
                Enter tuşuyla mesajı gönderin. Shift artı Enter ile yeni satır ekleyebilirsiniz.
              </span>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
                aria-label={isLoading ? "Gönderiliyor..." : "Mesajı gönder"}
                aria-disabled={!input.trim() || isLoading}
              >
                <Send size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="text-center mt-2">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Bu sistem hukuki tavsiye vermez, sadece araştırma amaçlıdır.
              Hatalar yapabilir.
            </p>
          </div>
        </div>
      </main>

      {/* Sources Panel (Right Sidebar) */}
      <SourcesPanel sources={sources} />

      {/* Floating Quick Actions (when chat has messages) */}
      {messages.length > 0 && (
        <FloatingQuickActions onSelectAction={handleQuickAction} />
      )}

      {/* Modals */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        messages={messages}
        sources={sources}
      />

      <KeyboardShortcutsModal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />

      {/* Settings Panel Modal */}
      {showSettingsPanel && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-panel-title"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 id="settings-panel-title" className="text-lg font-semibold text-gray-900 dark:text-white">Ayarlar</h2>
              <button
                onClick={() => setShowSettingsPanel(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Ayarlar penceresini kapat"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <SettingsPanel
                isOpen={showSettingsPanel}
                onClose={() => setShowSettingsPanel(false)}
                preferences={userPreferences}
                onSave={(prefs) => {
                  setUserPreferences(prefs);
                  setShowSettingsPanel(false);
                }}
                userRole={userRole}
                onRoleChange={setUserRole}
              />
            </div>
          </div>
        </div>
      )}

      {/* Legal Search Modal */}
      {showLegalSearch && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-search-title"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 id="legal-search-title" className="text-lg font-semibold text-gray-900 dark:text-white">Mevzuat ve İçtihat Arama</h2>
              <button
                onClick={() => setShowLegalSearch(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Mevzuat arama penceresini kapat"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <LegalSearch
                onSelectCase={(case_) => {
                  const citation = formatCaseCitation(case_);
                  setInput(`${case_.subject || case_.caseNumber} hakkında bilgi ver. ${citation}`);
                  setShowLegalSearch(false);
                  inputRef.current?.focus();
                  announce(`Seçilen dava: ${case_.caseNumber}`, "polite");
                }}
                onSelectLegislation={(law) => {
                  const citation = formatLegislationCitation(law);
                  setInput(`${law.name} hakkında bilgi ver. ${citation}`);
                  setShowLegalSearch(false);
                  inputRef.current?.focus();
                  announce(`Seçilen mevzuat: ${law.name}`, "polite");
                }}
                onInsertCitation={(citation) => {
                  setInput((prev) => prev + " " + citation);
                  inputRef.current?.focus();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Settings Modal */}
      {showAccessibilityPanel && (
        <AccessibilitySettingsPanel
          isOpen={showAccessibilityPanel}
          onClose={() => setShowAccessibilityPanel(false)}
        />
      )}
    </div>
  );
}
