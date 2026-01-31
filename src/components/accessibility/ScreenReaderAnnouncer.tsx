"use client";

import React from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";

/**
 * Screen Reader Announcer
 * ARIA live region for screen reader announcements
 * Ekran okuyuculara dinamik içerik değişikliklerini duyurur
 */

export function ScreenReaderAnnouncer() {
  const { announcements } = useAccessibility();

  // Filter by priority
  const politeAnnouncements = announcements.filter((a) => a.priority === "polite");
  const assertiveAnnouncements = announcements.filter((a) => a.priority === "assertive");

  return (
    <>
      {/* Polite announcements - waits for user to finish current task */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {politeAnnouncements.map((a) => (
          <p key={a.id}>{a.message}</p>
        ))}
      </div>

      {/* Assertive announcements - interrupts user immediately */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertiveAnnouncements.map((a) => (
          <p key={a.id}>{a.message}</p>
        ))}
      </div>

      {/* Status region for loading states */}
      <div
        id="loading-status"
        role="status"
        aria-live="polite"
        className="sr-only"
      />

      {/* Progress region for progress updates */}
      <div
        id="progress-status"
        role="progressbar"
        aria-live="polite"
        className="sr-only"
      />
    </>
  );
}

/**
 * Visual feedback component for screen reader mode
 * Shows what's being announced when in screen reader testing mode
 */
export function AnnouncementDisplay() {
  const { announcements, settings } = useAccessibility();

  if (!settings.screenReaderMode || announcements.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 left-4 z-50 max-w-sm bg-black/90 text-white p-4 rounded-lg shadow-lg"
      role="log"
      aria-label="Ekran okuyucu duyuruları"
    >
      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        Ekran Okuyucu Duyuruları
      </h3>
      <ul className="space-y-1">
        {announcements.slice(-5).map((a) => (
          <li
            key={a.id}
            className={`text-sm ${
              a.priority === "assertive" ? "text-yellow-300" : "text-gray-300"
            }`}
          >
            {a.priority === "assertive" && (
              <span className="text-yellow-500 mr-1">[!]</span>
            )}
            {a.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
