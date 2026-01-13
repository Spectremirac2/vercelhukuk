"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ToolsProvider, useTools, ToolId } from "@/components/tools/ToolsProvider";

// Dynamically import ChatInterface with no SSR
const ChatInterface = dynamic(
  () => import("@/components/ChatInterface"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Yükleniyor...</p>
        </div>
      </div>
    ),
  }
);

type View = "dashboard" | "chat";

/**
 * Ana içerik bileşeni
 */
function MainContent() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const { openTool } = useTools();

  /**
   * Dashboard'dan chat'e geçiş
   */
  const handleNavigateToChat = useCallback(() => {
    setCurrentView("chat");
    setSelectedTool(null);
  }, []);

  /**
   * Araç seçildiğinde
   */
  const handleOpenTool = useCallback((toolId: string) => {
    // Modal açılacak araçlar
    const modalTools: ToolId[] = [
      "contract-analysis",
      "case-prediction", 
      "deadline-calculator",
      "court-fees",
      "risk-assessment",
      "document-analysis",
      "document-comparison",
      "legal-cost-estimator",
      "kvkk-check",
      "compliance-check",
      "legal-glossary",
      "similar-cases",
      "document-generator",
      "precedent-analysis",
      "severance-calculator",
      "interest-calculator",
      "faq",
      "legislation-updates",
    ];
    
    if (modalTools.includes(toolId as ToolId)) {
      openTool(toolId as ToolId);
    } else {
      // Chat'e yönlendir (legal-search)
      setSelectedTool(toolId);
      setCurrentView("chat");
    }
  }, [openTool]);

  /**
   * Dashboard'a geri dön
   */
  const handleBackToDashboard = useCallback(() => {
    setCurrentView("dashboard");
    setSelectedTool(null);
  }, []);

  return (
    <main className="min-h-screen">
      {currentView === "dashboard" ? (
        <Dashboard
          onNavigateToChat={handleNavigateToChat}
          onOpenTool={handleOpenTool}
        />
      ) : (
        <ChatInterface
          initialTool={selectedTool}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
    </main>
  );
}

/**
 * Ana sayfa
 */
export default function Home() {
  return (
    <ToolsProvider>
      <MainContent />
    </ToolsProvider>
  );
}
