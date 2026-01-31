"use client";

import React, { JSX } from "react";

/**
 * Skip Links - Ekran okuyucu ve klavye kullanıcıları için
 * Ana içeriğe, sohbet girişine ve navigasyona hızlı atlama
 */

interface SkipLink {
  id: string;
  label: string;
  targetId: string;
}

const defaultSkipLinks: SkipLink[] = [
  { id: "skip-main", label: "Ana içeriğe atla", targetId: "main-content" },
  { id: "skip-chat", label: "Sohbet girişine atla", targetId: "chat-input" },
  { id: "skip-nav", label: "Navigasyona atla", targetId: "main-nav" },
  { id: "skip-sidebar", label: "Kenar çubuğuna atla", targetId: "sidebar" },
];

export function SkipLinks() {
  const handleSkip = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      aria-label="Atlama bağlantıları"
      className="skip-links-container"
    >
      {defaultSkipLinks.map((link) => (
        <a
          key={link.id}
          href={`#${link.targetId}`}
          onClick={(e) => {
            e.preventDefault();
            handleSkip(link.targetId);
          }}
          className="skip-link"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

/**
 * SkipTarget - Skip link hedefi için wrapper
 * Sayfa içinde atlama hedefi oluşturur
 */
interface SkipTargetProps {
  id: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export function SkipTarget({
  id,
  children,
  as: Component = "div",
  className,
}: SkipTargetProps) {
  return React.createElement(
    Component,
    {
      id,
      tabIndex: -1,
      className: `outline-none focus:outline-none ${className || ""}`,
      "aria-label": `${id} bölümü`,
    },
    children
  );
}
