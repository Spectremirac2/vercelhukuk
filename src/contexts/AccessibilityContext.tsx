"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

/**
 * Erişilebilirlik Ayarları
 * Görme engelli kullanıcılar için ekran okuyucu desteği
 */

interface AccessibilitySettings {
  // Screen reader mode - extra verbose announcements
  screenReaderMode: boolean;
  // High contrast mode for better visibility
  highContrastMode: boolean;
  // Reduce motion for users sensitive to animations
  reducedMotion: boolean;
  // Larger focus indicators
  largeFocusIndicators: boolean;
  // Auto-announce new messages
  autoAnnounceMessages: boolean;
  // Announce navigation changes
  announceNavigation: boolean;
  // Reading speed for auto-read (words per minute)
  readingSpeed: "slow" | "normal" | "fast";
  // Font size multiplier (1.0 = 100%, 1.5 = 150%, etc.)
  fontSizeMultiplier: number;
  // Keyboard shortcuts enabled
  keyboardShortcutsEnabled: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  // Screen reader announcement function
  announce: (message: string, priority?: "polite" | "assertive") => void;
  // Announcements queue
  announcements: Array<{ id: string; message: string; priority: "polite" | "assertive" }>;
  clearAnnouncement: (id: string) => void;
}

const defaultSettings: AccessibilitySettings = {
  screenReaderMode: false,
  highContrastMode: false,
  reducedMotion: false,
  largeFocusIndicators: false,
  autoAnnounceMessages: true,
  announceNavigation: true,
  readingSpeed: "normal",
  fontSizeMultiplier: 1.0,
  keyboardShortcutsEnabled: true,
};

const STORAGE_KEY = "hukuk-ai-accessibility";

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [announcements, setAnnouncements] = useState<Array<{ id: string; message: string; priority: "polite" | "assertive" }>>([]);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }

      // Check system preferences
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setSettings((prev) => ({ ...prev, reducedMotion: true }));
      }

      // Check for high contrast preference
      if (window.matchMedia("(prefers-contrast: more)").matches) {
        setSettings((prev) => ({ ...prev, highContrastMode: true }));
      }
    } catch (e) {
      console.warn("Failed to load accessibility settings:", e);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn("Failed to save accessibility settings:", e);
    }
  }, [settings]);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast mode
    if (settings.highContrastMode) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Large focus indicators
    if (settings.largeFocusIndicators) {
      root.classList.add("large-focus");
    } else {
      root.classList.remove("large-focus");
    }

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    // Screen reader mode
    if (settings.screenReaderMode) {
      root.classList.add("screen-reader-mode");
    } else {
      root.classList.remove("screen-reader-mode");
    }

    // Font size
    root.style.setProperty("--a11y-font-scale", String(settings.fontSizeMultiplier));
  }, [settings]);

  const updateSettings = useCallback((updates: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  // Announce message for screen readers
  const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setAnnouncements((prev) => [...prev, { id, message, priority }]);

    // Auto-clear after announcement
    setTimeout(() => {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }, 5000);
  }, []);

  const clearAnnouncement = useCallback((id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSettings,
        announce,
        announcements,
        clearAnnouncement,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
}

// Hook for announcing messages
export function useAnnounce() {
  const { announce } = useAccessibility();
  return announce;
}
