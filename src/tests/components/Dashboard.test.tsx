import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ApiSettingsProvider } from "@/contexts/ApiSettingsContext";
import React from "react";

// Mock ThemeContext
vi.mock("@/contexts/ThemeContext", () => ({
  ThemeToggle: () => <button>Theme Toggle</button>,
  useTheme: () => ({ theme: "dark", setTheme: vi.fn() }),
}));

// Wrapper component with all required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ApiSettingsProvider>{children}</ApiSettingsProvider>
);

/**
 * Helper function to render Dashboard with providers
 */
const renderDashboard = (props: { onNavigateToChat: () => void; onOpenTool: (id: string) => void }) => {
  return render(
    <TestWrapper>
      <Dashboard {...props} />
    </TestWrapper>
  );
};

describe("Dashboard Component", () => {
  const mockNavigateToChat = vi.fn();
  const mockOpenTool = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render dashboard header", () => {
    renderDashboard({
      onNavigateToChat: mockNavigateToChat,
      onOpenTool: mockOpenTool,
    });

    expect(screen.getByText("Hukuk AI")).toBeInTheDocument();
    expect(screen.getByText("Türk Hukuku Asistanı")).toBeInTheDocument();
  });

  it("should render hero section", () => {
    renderDashboard({
      onNavigateToChat: mockNavigateToChat,
      onOpenTool: mockOpenTool,
    });

    expect(
      screen.getByText(/Türk Hukuku Araştırmalarınızı/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Hızlandırın/i)).toBeInTheDocument();
  });

  it("should render tool categories", () => {
    renderDashboard({
      onNavigateToChat: mockNavigateToChat,
      onOpenTool: mockOpenTool,
    });

    expect(screen.getByText("Analiz Araçları")).toBeInTheDocument();
    expect(screen.getByText("Tahmin & Hesaplama")).toBeInTheDocument();
    // "Araştırma" appears in both category tabs and mobile nav, use getAllByText
    expect(screen.getAllByText("Araştırma").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Uyumluluk")).toBeInTheDocument();
  });

  it("should render stats section", () => {
    renderDashboard({
      onNavigateToChat: mockNavigateToChat,
      onOpenTool: mockOpenTool,
    });

    // Updated stats section is now "Dahili Hukuk Bilgi Tabanı"
    expect(screen.getByText("Dahili Hukuk Bilgi Tabanı")).toBeInTheDocument();
    expect(screen.getByText("Temel Kanunlar")).toBeInTheDocument();
    expect(screen.getByText("Kritik Maddeler")).toBeInTheDocument();
    expect(screen.getByText("Emsal Kararlar")).toBeInTheDocument();
    expect(screen.getByText("Hukuki Kavramlar")).toBeInTheDocument();
  });

  it("should call onNavigateToChat when chat button is clicked", () => {
    renderDashboard({
      onNavigateToChat: mockNavigateToChat,
      onOpenTool: mockOpenTool,
    });

    const chatButtons = screen.getAllByText(/Sohbete Başla|Soru Sor/i);
    fireEvent.click(chatButtons[0]);

    expect(mockNavigateToChat).toHaveBeenCalled();
  });

  it("should switch categories when category tab is clicked", () => {
    renderDashboard({
      onNavigateToChat: mockNavigateToChat,
      onOpenTool: mockOpenTool,
    });

    // Click on Araştırma category - get first match (category tab, not mobile nav)
    const arastirmaTabs = screen.getAllByText("Araştırma");
    // First one should be the category tab button
    fireEvent.click(arastirmaTabs[0]);

    // Should show research tools
    expect(screen.getByText("Emsal Davalar")).toBeInTheDocument();
  });

  it("should call onOpenTool when a tool card is clicked", () => {
    renderDashboard({
      onNavigateToChat: mockNavigateToChat,
      onOpenTool: mockOpenTool,
    });

    // Find and click a tool card
    const sozlesmeAnalizi = screen.getByText("Sözleşme Analizi");
    const toolCard = sozlesmeAnalizi.closest("button");
    if (toolCard) {
      fireEvent.click(toolCard);
    }

    expect(mockOpenTool).toHaveBeenCalledWith("contract-analysis");
  });

  it("should render recent activities section", () => {
    renderDashboard({
      onNavigateToChat: mockNavigateToChat,
      onOpenTool: mockOpenTool,
    });

    expect(screen.getByText("Son Aktiviteler")).toBeInTheDocument();
    expect(
      screen.getByText("İş sözleşmesi feshi hakkında soru")
    ).toBeInTheDocument();
  });

  it("should render upcoming deadlines section", () => {
    renderDashboard({
      onNavigateToChat: mockNavigateToChat,
      onOpenTool: mockOpenTool,
    });

    expect(screen.getByText("Yaklaşan Süreler")).toBeInTheDocument();
    expect(screen.getByText("İtiraz süresi sonu")).toBeInTheDocument();
  });

  it("should show tools for selected category", () => {
    renderDashboard({
      onNavigateToChat: mockNavigateToChat,
      onOpenTool: mockOpenTool,
    });

    // Default is "analysis" category
    expect(screen.getByText("Sözleşme Analizi")).toBeInTheDocument();
    expect(screen.getByText("Risk Değerlendirme")).toBeInTheDocument();

    // Switch to "prediction" category
    fireEvent.click(screen.getByText("Tahmin & Hesaplama"));

    expect(screen.getByText("Dava Sonuç Tahmini")).toBeInTheDocument();
    expect(screen.getByText("Süre Hesaplama")).toBeInTheDocument();
  });
});

describe("Dashboard - Mobile Responsiveness", () => {
  const mockNavigateToChat = vi.fn();
  const mockOpenTool = vi.fn();

  it("should render mobile navigation", () => {
    // Mock mobile viewport
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    renderDashboard({
      onNavigateToChat: mockNavigateToChat,
      onOpenTool: mockOpenTool,
    });

    // Mobile bottom nav should be present
    expect(screen.getByText("Ana Sayfa")).toBeInTheDocument();
    // "Araştırma" appears multiple times, use getAllByText
    expect(screen.getAllByText("Araştırma").length).toBeGreaterThanOrEqual(1);
  });
});

describe("Dashboard - Accessibility", () => {
  const mockNavigateToChat = vi.fn();
  const mockOpenTool = vi.fn();

  it("should have accessible buttons", () => {
    renderDashboard({
      onNavigateToChat: mockNavigateToChat,
      onOpenTool: mockOpenTool,
    });

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should have headings in correct hierarchy", () => {
    renderDashboard({
      onNavigateToChat: mockNavigateToChat,
      onOpenTool: mockOpenTool,
    });

    const h1 = screen.getByRole("heading", { level: 1 });
    const h2s = screen.getAllByRole("heading", { level: 2 });

    expect(h1).toBeInTheDocument();
    expect(h2s.length).toBeGreaterThan(0);
  });
});
