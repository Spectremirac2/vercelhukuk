"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  Suspense,
  lazy,
} from "react";
import { ToolModal } from "./ToolModal";

// Lazy loaded tool components for better performance
const ContractAnalysisTool = lazy(() =>
  import("./ContractAnalysisTool").then((mod) => ({ default: mod.ContractAnalysisTool }))
);
const CasePredictionTool = lazy(() =>
  import("./CasePredictionTool").then((mod) => ({ default: mod.CasePredictionTool }))
);
const DeadlineCalculatorTool = lazy(() =>
  import("./DeadlineCalculatorTool").then((mod) => ({ default: mod.DeadlineCalculatorTool }))
);
const DocumentComparisonTool = lazy(() =>
  import("./DocumentComparisonTool").then((mod) => ({ default: mod.DocumentComparisonTool }))
);
const LegalCostEstimatorTool = lazy(() =>
  import("./LegalCostEstimatorTool").then((mod) => ({ default: mod.LegalCostEstimatorTool }))
);
const KVKKComplianceTool = lazy(() =>
  import("./KVKKComplianceTool").then((mod) => ({ default: mod.KVKKComplianceTool }))
);
const RiskAssessmentTool = lazy(() =>
  import("./RiskAssessmentTool").then((mod) => ({ default: mod.RiskAssessmentTool }))
);
const LegalGlossaryTool = lazy(() =>
  import("./LegalGlossaryTool").then((mod) => ({ default: mod.LegalGlossaryTool }))
);
const SimilarCasesTool = lazy(() =>
  import("./SimilarCasesTool").then((mod) => ({ default: mod.SimilarCasesTool }))
);
const DocumentGeneratorTool = lazy(() =>
  import("./DocumentGeneratorTool").then((mod) => ({ default: mod.DocumentGeneratorTool }))
);
const PrecedentAnalysisTool = lazy(() =>
  import("./PrecedentAnalysisTool").then((mod) => ({ default: mod.PrecedentAnalysisTool }))
);
const SeveranceCalculatorTool = lazy(() =>
  import("./SeveranceCalculatorTool").then((mod) => ({ default: mod.SeveranceCalculatorTool }))
);
const InterestCalculatorTool = lazy(() =>
  import("./InterestCalculatorTool").then((mod) => ({ default: mod.InterestCalculatorTool }))
);

// Lazy loaded panel components
const FAQPanel = lazy(() =>
  import("@/components/FAQPanel").then((mod) => ({ default: mod.FAQPanel }))
);
const LegislationUpdatesPanel = lazy(() =>
  import("@/components/LegislationUpdates").then((mod) => ({ default: mod.LegislationUpdatesPanel }))
);

/**
 * Araç ID'leri
 */
export type ToolId =
  | "contract-analysis"
  | "case-prediction"
  | "deadline-calculator"
  | "court-fees"
  | "risk-assessment"
  | "document-analysis"
  | "document-comparison"
  | "legal-cost-estimator"
  | "legal-search"
  | "similar-cases"
  | "legal-glossary"
  | "precedent-analysis"
  | "document-generator"
  | "kvkk-check"
  | "compliance-check"
  | "severance-calculator"
  | "interest-calculator"
  | "faq"
  | "legislation-updates";

/**
 * Context value type
 */
interface ToolsContextValue {
  openTool: (toolId: ToolId) => void;
  closeTool: () => void;
  activeTool: ToolId | null;
}

const ToolsContext = createContext<ToolsContextValue | null>(null);

/**
 * useTools hook
 */
export function useTools() {
  const context = useContext(ToolsContext);
  if (!context) {
    throw new Error("useTools must be used within a ToolsProvider");
  }
  return context;
}

/**
 * Loading fallback component
 */
function ToolLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Yükleniyor...</p>
      </div>
    </div>
  );
}

/**
 * ToolsProvider - Araç panellerini yöneten provider
 */
interface ToolsProviderProps {
  children: ReactNode;
}

export function ToolsProvider({ children }: ToolsProviderProps) {
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);

  const openTool = useCallback((toolId: ToolId) => {
    setActiveTool(toolId);
  }, []);

  const closeTool = useCallback(() => {
    setActiveTool(null);
  }, []);

  // Known tools list for placeholder check
  const knownTools: ToolId[] = [
    "contract-analysis",
    "case-prediction",
    "deadline-calculator",
    "document-comparison",
    "legal-cost-estimator",
    "court-fees",
    "kvkk-check",
    "compliance-check",
    "risk-assessment",
    "legal-glossary",
    "similar-cases",
    "document-generator",
    "precedent-analysis",
    "severance-calculator",
    "interest-calculator",
    "faq",
    "legislation-updates",
  ];

  return (
    <ToolsContext.Provider value={{ openTool, closeTool, activeTool }}>
      {children}

      {/* Lazy loaded Tool Modals - Only render when active */}
      {activeTool === "contract-analysis" && (
        <Suspense fallback={<ToolLoadingFallback />}>
          <ContractAnalysisTool isOpen={true} onClose={closeTool} />
        </Suspense>
      )}

      {activeTool === "case-prediction" && (
        <Suspense fallback={<ToolLoadingFallback />}>
          <CasePredictionTool isOpen={true} onClose={closeTool} />
        </Suspense>
      )}

      {activeTool === "deadline-calculator" && (
        <Suspense fallback={<ToolLoadingFallback />}>
          <DeadlineCalculatorTool isOpen={true} onClose={closeTool} />
        </Suspense>
      )}

      {activeTool === "document-comparison" && (
        <Suspense fallback={<ToolLoadingFallback />}>
          <DocumentComparisonTool isOpen={true} onClose={closeTool} />
        </Suspense>
      )}

      {(activeTool === "legal-cost-estimator" || activeTool === "court-fees") && (
        <Suspense fallback={<ToolLoadingFallback />}>
          <LegalCostEstimatorTool isOpen={true} onClose={closeTool} />
        </Suspense>
      )}

      {(activeTool === "kvkk-check" || activeTool === "compliance-check") && (
        <Suspense fallback={<ToolLoadingFallback />}>
          <KVKKComplianceTool isOpen={true} onClose={closeTool} />
        </Suspense>
      )}

      {activeTool === "risk-assessment" && (
        <Suspense fallback={<ToolLoadingFallback />}>
          <RiskAssessmentTool isOpen={true} onClose={closeTool} />
        </Suspense>
      )}

      {/* Hukuk Sözlüğü */}
      {activeTool === "legal-glossary" && (
        <ToolModal isOpen={true} onClose={closeTool} title="Hukuk Sözlüğü" size="lg">
          <Suspense fallback={<ToolLoadingFallback />}>
            <LegalGlossaryTool />
          </Suspense>
        </ToolModal>
      )}

      {/* Emsal Dava Bulma */}
      {activeTool === "similar-cases" && (
        <ToolModal isOpen={true} onClose={closeTool} title="Emsal Karar Arama" size="lg">
          <Suspense fallback={<ToolLoadingFallback />}>
            <SimilarCasesTool />
          </Suspense>
        </ToolModal>
      )}

      {/* Belge Oluşturucu */}
      {activeTool === "document-generator" && (
        <ToolModal isOpen={true} onClose={closeTool} title="Belge Oluşturucu" size="lg">
          <Suspense fallback={<ToolLoadingFallback />}>
            <DocumentGeneratorTool />
          </Suspense>
        </ToolModal>
      )}

      {/* İçtihat Analizi */}
      {activeTool === "precedent-analysis" && (
        <ToolModal isOpen={true} onClose={closeTool} title="İçtihat Analizi" size="lg">
          <Suspense fallback={<ToolLoadingFallback />}>
            <PrecedentAnalysisTool />
          </Suspense>
        </ToolModal>
      )}

      {/* Kıdem Tazminatı Hesaplama */}
      {activeTool === "severance-calculator" && (
        <Suspense fallback={<ToolLoadingFallback />}>
          <SeveranceCalculatorTool isOpen={true} onClose={closeTool} />
        </Suspense>
      )}

      {/* Faiz Hesaplama */}
      {activeTool === "interest-calculator" && (
        <Suspense fallback={<ToolLoadingFallback />}>
          <InterestCalculatorTool isOpen={true} onClose={closeTool} />
        </Suspense>
      )}

      {/* Sık Sorulan Sorular */}
      {activeTool === "faq" && (
        <ToolModal isOpen={true} onClose={closeTool} title="Sık Sorulan Sorular" size="lg">
          <Suspense fallback={<ToolLoadingFallback />}>
            <FAQPanel />
          </Suspense>
        </ToolModal>
      )}

      {/* Güncel Mevzuat Değişiklikleri */}
      {activeTool === "legislation-updates" && (
        <ToolModal isOpen={true} onClose={closeTool} title="Güncel Mevzuat Değişiklikleri" size="lg">
          <Suspense fallback={<ToolLoadingFallback />}>
            <LegislationUpdatesPanel />
          </Suspense>
        </ToolModal>
      )}

      {/* Diğer araçlar için placeholder mesajları */}
      {activeTool && !knownTools.includes(activeTool) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeTool}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full animate-scale-in">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Yakında Geliyor
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Bu araç üzerinde çalışılıyor. Çok yakında kullanıma açılacak!
            </p>
            <button
              onClick={closeTool}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </ToolsContext.Provider>
  );
}
