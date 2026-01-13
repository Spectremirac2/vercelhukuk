"use client";

import { useEffect, useCallback } from "react";

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
  preventDefault?: boolean;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
}

export function useKeyboardShortcuts(
  shortcuts: ShortcutConfig[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Ignore if typing in input/textarea (unless shortcut explicitly handles it)
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey;
        const metaMatch = shortcut.metaKey ? event.metaKey : !event.metaKey;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.altKey ? event.altKey : !event.altKey;

        // For Ctrl/Meta shortcuts, allow even in input fields
        const requiresModifier =
          shortcut.ctrlKey || shortcut.metaKey || shortcut.altKey;

        if (
          keyMatch &&
          ctrlMatch &&
          metaMatch &&
          shiftMatch &&
          altMatch &&
          (requiresModifier || !isInputField)
        ) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.action();
          return;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

// Predefined shortcuts for the chat app
export function useChatShortcuts({
  onNewChat,
  onFocusInput,
  onToggleStrictMode,
  onToggleTheme,
  onExport,
  onShowShortcuts,
}: {
  onNewChat?: () => void;
  onFocusInput?: () => void;
  onToggleStrictMode?: () => void;
  onToggleTheme?: () => void;
  onExport?: () => void;
  onShowShortcuts?: () => void;
}) {
  const shortcuts: ShortcutConfig[] = [];

  if (onNewChat) {
    shortcuts.push({
      key: "n",
      ctrlKey: true,
      shiftKey: true,
      action: onNewChat,
      description: "Yeni sohbet başlat",
    });
  }

  if (onFocusInput) {
    shortcuts.push({
      key: "/",
      action: onFocusInput,
      description: "Mesaj alanına odaklan",
    });
  }

  if (onToggleStrictMode) {
    shortcuts.push({
      key: "s",
      ctrlKey: true,
      shiftKey: true,
      action: onToggleStrictMode,
      description: "Strict Mode aç/kapat",
    });
  }

  if (onToggleTheme) {
    shortcuts.push({
      key: "d",
      ctrlKey: true,
      shiftKey: true,
      action: onToggleTheme,
      description: "Tema değiştir",
    });
  }

  if (onExport) {
    shortcuts.push({
      key: "e",
      ctrlKey: true,
      action: onExport,
      description: "Sohbeti dışa aktar",
    });
  }

  if (onShowShortcuts) {
    shortcuts.push({
      key: "?",
      shiftKey: true,
      action: onShowShortcuts,
      description: "Kısayolları göster",
    });
  }

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
}

// Keyboard shortcut display component data
export const SHORTCUT_GROUPS = [
  {
    title: "Genel",
    shortcuts: [
      { keys: ["Ctrl", "Shift", "N"], description: "Yeni sohbet" },
      { keys: ["/"], description: "Mesaj alanına odaklan" },
      { keys: ["Enter"], description: "Mesaj gönder" },
      { keys: ["Shift", "Enter"], description: "Yeni satır" },
    ],
  },
  {
    title: "Ayarlar",
    shortcuts: [
      { keys: ["Ctrl", "Shift", "S"], description: "Strict Mode" },
      { keys: ["Ctrl", "Shift", "D"], description: "Tema değiştir" },
    ],
  },
  {
    title: "Diğer",
    shortcuts: [
      { keys: ["Ctrl", "E"], description: "Sohbeti dışa aktar" },
      { keys: ["?"], description: "Bu menüyü göster" },
    ],
  },
];
