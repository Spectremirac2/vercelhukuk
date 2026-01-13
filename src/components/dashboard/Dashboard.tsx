"use client";

import React, { useState, useCallback, useMemo } from "react";
import { cn } from "@/utils/cn";
import { Card, FeatureCard, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/contexts/ThemeContext";
import { useApiSettings, AIProviderType } from "@/contexts/ApiSettingsContext";
import { KeyRound, Check, AlertCircle, Loader2, Database, BookMarked } from "lucide-react";
import {
  Scale,
  FileText,
  Calculator,
  Shield,
  Clock,
  Search,
  BookOpen,
  TrendingUp,
  Users,
  Gavel,
  MessageSquare,
  ArrowRight,
  Sparkles,
  FileCheck,
  AlertTriangle,
  CalendarDays,
  History,
  ChevronRight,
  FilePlus,
  FileSearch,
  Library,
  Menu,
  X,
  Home,
  Settings,
} from "lucide-react";
import { getDatabaseStats } from "@/lib/legal-knowledge-service";

/**
 * Dashboard - Ana sayfa görünümü
 * Hukuki araçlara hızlı erişim ve istatistikler
 */

interface DashboardProps {
  onNavigateToChat: () => void;
  onOpenTool: (tool: string) => void;
}

// Araç kategorileri
const toolCategories = [
  {
    id: "analysis",
    name: "Analiz Araçları",
    description: "Belge ve sözleşme analizi",
    tools: [
      {
        id: "contract-analysis",
        name: "Sözleşme Analizi",
        description: "AI destekli sözleşme risk analizi ve madde kontrolü",
        icon: <FileCheck size={24} />,
        color: "blue" as const,
        badge: "Popüler",
      },
      {
        id: "document-comparison",
        name: "Belge Karşılaştırma",
        description: "İki belge arasındaki farkları analiz edin",
        icon: <FileText size={24} />,
        color: "purple" as const,
      },
      {
        id: "risk-assessment",
        name: "Risk Değerlendirme",
        description: "Dava ve sözleşme risk skorlaması",
        icon: <AlertTriangle size={24} />,
        color: "rose" as const,
      },
    ],
  },
  {
    id: "prediction",
    name: "Tahmin & Hesaplama",
    description: "Dava sonucu tahmini ve hesaplamalar",
    tools: [
      {
        id: "case-prediction",
        name: "Dava Sonuç Tahmini",
        description: "AI ile dava sonucu olasılık analizi",
        icon: <TrendingUp size={24} />,
        color: "emerald" as const,
      },
      {
        id: "legal-cost-estimator",
        name: "Dava Maliyet Tahmini",
        description: "Harç, avukatlık ücreti ve masraf hesaplayıcı",
        icon: <Calculator size={24} />,
        color: "gold" as const,
      },
      {
        id: "deadline-calculator",
        name: "Süre Hesaplama",
        description: "Hukuki süre ve müddet hesabı",
        icon: <Clock size={24} />,
        color: "cyan" as const,
      },
      {
        id: "severance-calculator",
        name: "Kıdem Tazminatı",
        description: "Kıdem ve ihbar tazminatı hesaplama",
        icon: <Calculator size={24} />,
        color: "blue" as const,
        badge: "Yeni",
      },
      {
        id: "interest-calculator",
        name: "Faiz Hesaplama",
        description: "Yasal ve ticari faiz hesaplayıcı",
        icon: <TrendingUp size={24} />,
        color: "rose" as const,
        badge: "Yeni",
      },
    ],
  },
  {
    id: "research",
    name: "Araştırma",
    description: "Mevzuat ve içtihat araştırması",
    tools: [
      {
        id: "similar-cases",
        name: "Emsal Davalar",
        description: "Benzer dava ve içtihat bulma",
        icon: <Gavel size={24} />,
        color: "gold" as const,
        badge: "Yeni",
      },
      {
        id: "precedent-analysis",
        name: "İçtihat Analizi",
        description: "Gelişmiş emsal ve içtihat araştırması",
        icon: <FileSearch size={24} />,
        color: "rose" as const,
        badge: "Yeni",
      },
      {
        id: "legal-glossary",
        name: "Hukuk Sözlüğü",
        description: "Hukuki terimler ve açıklamaları",
        icon: <BookOpen size={24} />,
        color: "purple" as const,
        badge: "Yeni",
      },
      {
        id: "faq",
        name: "Sık Sorulan Sorular",
        description: "Hukuki konularda en çok sorulan sorular",
        icon: <MessageSquare size={24} />,
        color: "gold" as const,
        badge: "Yeni",
      },
      {
        id: "legislation-updates",
        name: "Güncel Mevzuat",
        description: "Son yasal değişiklikler ve güncellemeler",
        icon: <History size={24} />,
        color: "cyan" as const,
        badge: "2024",
      },
    ],
  },
  {
    id: "documents",
    name: "Belge İşlemleri",
    description: "Belge oluşturma ve şablonlar",
    tools: [
      {
        id: "document-generator",
        name: "Belge Oluşturucu",
        description: "İş, kira, KVKK sözleşme şablonları",
        icon: <FilePlus size={24} />,
        color: "emerald" as const,
        badge: "Yeni",
      },
      {
        id: "legal-search",
        name: "Mevzuat Arama",
        description: "Türk mevzuatında arama yapın",
        icon: <Search size={24} />,
        color: "blue" as const,
      },
    ],
  },
  {
    id: "compliance",
    name: "Uyumluluk",
    description: "Yasal uyumluluk kontrolü",
    tools: [
      {
        id: "kvkk-check",
        name: "KVKK 2025 Uyumluluk",
        description: "2025 KVKK düzenlemelerine uyumluluk kontrolü",
        icon: <Shield size={24} />,
        color: "blue" as const,
        badge: "Güncel",
      },
      {
        id: "compliance-check",
        name: "Genel Uyumluluk",
        description: "Genel yasal uyumluluk denetimi",
        icon: <FileCheck size={24} />,
        color: "emerald" as const,
      },
    ],
  },
];

// Örnek son aktiviteler
const recentActivities = [
  {
    id: "1",
    type: "chat",
    title: "İş sözleşmesi feshi hakkında soru",
    time: "2 saat önce",
    icon: <MessageSquare size={16} />,
  },
  {
    id: "2",
    type: "analysis",
    title: "Kira sözleşmesi analizi",
    time: "5 saat önce",
    icon: <FileText size={16} />,
  },
  {
    id: "3",
    type: "calculation",
    title: "Mahkeme ücreti hesaplama",
    time: "Dün",
    icon: <Calculator size={16} />,
  },
];

// Örnek yaklaşan süreler
const upcomingDeadlines = [
  {
    id: "1",
    title: "İtiraz süresi sonu",
    date: "15 Ocak 2026",
    daysLeft: 3,
    type: "urgent",
  },
  {
    id: "2",
    title: "Cevap dilekçesi",
    date: "20 Ocak 2026",
    daysLeft: 8,
    type: "warning",
  },
  {
    id: "3",
    title: "Duruşma tarihi",
    date: "28 Ocak 2026",
    daysLeft: 16,
    type: "normal",
  },
];

export function Dashboard({ onNavigateToChat, onOpenTool }: DashboardProps) {
  const [activeCategory, setActiveCategory] = useState("analysis");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showApiSettings, setShowApiSettings] = useState(false);

  // API Settings
  const { settings: apiSettings, updateSettings, hasValidKey } = useApiSettings();
  const [localGeminiKey, setLocalGeminiKey] = useState("");
  const [localOpenAIKey, setLocalOpenAIKey] = useState("");
  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [keyTestResult, setKeyTestResult] = useState<{ provider: string; success: boolean; error?: string } | null>(null);

  // Memoize category change handler
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  // Memoize tool open handler
  const handleOpenTool = useCallback((toolId: string) => {
    onOpenTool(toolId);
    setIsMobileMenuOpen(false);
  }, [onOpenTool]);

  // Memoize active tools
  const activeTools = useMemo(() => {
    return toolCategories.find((c) => c.id === activeCategory)?.tools || [];
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16 sm:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-gray-200 dark:border-gray-800 safe-area-top">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25">
                <Scale size={20} className="sm:w-[22px] sm:h-[22px]" />
              </div>
              <div className="hidden xs:block">
                <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Hukuk AI
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  Türk Hukuku Asistanı
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              {/* API Settings Button - Desktop */}
              <button
                onClick={() => setShowApiSettings(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                title="API Ayarları"
              >
                <KeyRound size={18} />
                {(hasValidKey("gemini") || hasValidKey("openai")) && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </button>
              {/* Desktop button */}
              <Button
                variant="primary"
                size="md"
                icon={<MessageSquare size={18} />}
                onClick={onNavigateToChat}
                className="hidden sm:inline-flex"
              >
                Sohbete Başla
              </Button>
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Menü"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-slide-down">
            <div className="px-4 py-3 space-y-2">
              <Button
                variant="primary"
                fullWidth
                icon={<MessageSquare size={18} />}
                onClick={() => {
                  onNavigateToChat();
                  setIsMobileMenuOpen(false);
                }}
              >
                Sohbete Başla
              </Button>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {toolCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      handleCategoryChange(cat.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "p-3 rounded-xl text-sm font-medium text-left transition-all",
                      activeCategory === cat.id
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Hero Section - Mobile Optimized */}
        <section className="mb-6 sm:mb-10">
          <div className="hero-section relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-5 sm:p-8 md:p-12">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-32 sm:w-64 h-32 sm:h-64 bg-blue-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/20 text-white text-xs sm:text-sm mb-3 sm:mb-4">
                <Sparkles size={12} className="sm:w-[14px] sm:h-[14px]" />
                <span>AI Destekli Hukuki Araştırma</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                Türk Hukuku Araştırmalarınızı{" "}
                <span className="text-blue-200 block sm:inline">Hızlandırın</span>
              </h2>
              
              <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-lg leading-relaxed">
                Mevzuat, içtihat ve hukuki süreçlerle ilgili sorularınızı
                doğrulanabilir kaynaklara dayalı yanıtlarla cevaplayın.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  icon={<MessageSquare size={18} className="sm:w-5 sm:h-5" />}
                  onClick={onNavigateToChat}
                  className="bg-white text-blue-700 hover:bg-blue-50 w-full sm:w-auto justify-center"
                >
                  Soru Sor
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  icon={<ArrowRight size={18} className="sm:w-5 sm:h-5" />}
                  iconPosition="right"
                  onClick={() => handleCategoryChange("analysis")}
                  className="text-white hover:bg-white/10 w-full sm:w-auto justify-center"
                >
                  Araçları Keşfet
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Knowledge Base Stats Section - Mobile Optimized */}
        <section className="mb-6 sm:mb-10">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Database size={18} className="text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
              Dahili Hukuk Bilgi Tabanı
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            <StatCard
              title="Temel Kanunlar"
              value={getDatabaseStats().totalLaws.toString()}
              icon={<BookMarked size={20} className="sm:w-6 sm:h-6" />}
              color="blue"
            />
            <StatCard
              title="Kritik Maddeler"
              value={`${getDatabaseStats().totalArticles}+`}
              icon={<FileText size={20} className="sm:w-6 sm:h-6" />}
              color="purple"
            />
            <StatCard
              title="Emsal Kararlar"
              value={`${getDatabaseStats().totalPrecedents}+`}
              icon={<Gavel size={20} className="sm:w-6 sm:h-6" />}
              color="gold"
            />
            <StatCard
              title="Hukuki Kavramlar"
              value={`${getDatabaseStats().totalConcepts}+`}
              icon={<BookOpen size={20} className="sm:w-6 sm:h-6" />}
              color="emerald"
            />
          </div>
          {/* Genişletilmiş İstatistikler */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3 mt-3">
            <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <span className="text-amber-500">📋</span>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">SSS</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{getDatabaseStats().totalFAQ}+</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <span className="text-purple-500">🏢</span>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Şirket Türleri</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{getDatabaseStats().totalCompanyTypes}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <span className="text-green-500">💰</span>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Vergi Türleri</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{getDatabaseStats().totalTaxTypes}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <span className="text-blue-500">⚖️</span>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Mahkemeler</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{getDatabaseStats().totalCourtTypes}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <span className="text-red-500">📰</span>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Güncel Değişiklik</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">{getDatabaseStats().totalLegislationUpdates}</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 sm:mt-3">
            TBK, TMK, İş Kanunu, TCK, KVKK, TKHK, TTK, VUK, İİK ve Yargıtay/Danıştay içtihatları dahil
          </p>
        </section>

        {/* Main Content Grid - Mobile Optimized */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Tools Section */}
          <div className="lg:col-span-2 order-1">
            <Card variant="elevated" padding="md" className="sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    Hukuki Araçlar
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                    AI destekli hukuki analiz ve hesaplama araçları
                  </p>
                </div>
              </div>

              {/* Category Tabs - Horizontal scroll on mobile */}
              <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-container">
                {toolCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={cn(
                      "px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all touch-target flex-shrink-0",
                      activeCategory === category.id
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Tools Grid - 1 col on mobile, 2 on sm, 3 on lg */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {activeTools.map((tool, index) => (
                  <div
                    key={tool.id}
                    className={cn(
                      "animate-slide-up",
                      `stagger-${index + 1}`
                    )}
                  >
                    <FeatureCard
                      title={tool.name}
                      description={tool.description}
                      icon={tool.icon}
                      color={tool.color}
                      badge={tool.badge}
                      onClick={() => handleOpenTool(tool.id)}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar - Hidden on mobile, shown on tablet+ */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-2">
            {/* Quick Chat - Hidden on mobile (use bottom nav instead) */}
            <Card variant="glass" padding="md" className="hidden sm:block border border-blue-200 dark:border-blue-800 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    Hızlı Soru
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    AI asistana sor
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                fullWidth
                onClick={onNavigateToChat}
                icon={<ArrowRight size={18} />}
                iconPosition="right"
              >
                Sohbete Başla
              </Button>
            </Card>

            {/* Recent Activities & Deadlines - Horizontal scroll on mobile */}
            <div className="flex sm:flex-col gap-4 overflow-x-auto sm:overflow-visible -mx-3 px-3 sm:mx-0 sm:px-0 pb-2 sm:pb-0">
              {/* Recent Activities */}
              <Card variant="elevated" padding="md" className="min-w-[280px] sm:min-w-0 flex-shrink-0 sm:flex-shrink sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                    <History size={16} className="sm:w-[18px] sm:h-[18px]" />
                    Son Aktiviteler
                  </h4>
                  <button className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Tümü
                  </button>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group touch-target"
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">
                          {activity.title}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
                          {activity.time}
                        </p>
                      </div>
                      <ChevronRight
                        size={14}
                        className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
                      />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Upcoming Deadlines */}
              <Card variant="elevated" padding="md" className="min-w-[280px] sm:min-w-0 flex-shrink-0 sm:flex-shrink sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm sm:text-base">
                    <CalendarDays size={16} className="sm:w-[18px] sm:h-[18px]" />
                    Yaklaşan Süreler
                  </h4>
                  <button className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline">
                    Tümü
                  </button>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {upcomingDeadlines.map((deadline) => (
                    <div
                      key={deadline.id}
                      className={cn(
                        "p-2 sm:p-3 rounded-lg sm:rounded-xl border-l-4",
                        deadline.type === "urgent" &&
                          "bg-red-50 dark:bg-red-900/20 border-red-500",
                        deadline.type === "warning" &&
                          "bg-amber-50 dark:bg-amber-900/20 border-amber-500",
                        deadline.type === "normal" &&
                          "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                          {deadline.title}
                        </p>
                        <span
                          className={cn(
                            "text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full",
                            deadline.type === "urgent" &&
                              "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
                            deadline.type === "warning" &&
                              "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
                            deadline.type === "normal" &&
                              "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                          )}
                        >
                          {deadline.daysLeft} gün
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {deadline.date}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* API Settings Modal */}
      {showApiSettings && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowApiSettings(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">API Ayarları</h3>
              </div>
              <button
                onClick={() => setShowApiSettings(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Provider Status */}
              <div className="flex gap-3">
                <div className={cn(
                  "flex-1 p-3 rounded-xl border-2",
                  hasValidKey("gemini")
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 dark:border-gray-700"
                )}>
                  <div className="flex items-center gap-2">
                    {hasValidKey("gemini") ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="font-medium text-sm">Gemini</span>
                  </div>
                </div>
                <div className={cn(
                  "flex-1 p-3 rounded-xl border-2",
                  hasValidKey("openai")
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 dark:border-gray-700"
                )}>
                  <div className="flex items-center gap-2">
                    {hasValidKey("openai") ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="font-medium text-sm">OpenAI</span>
                  </div>
                </div>
              </div>

              {/* Gemini API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Google Gemini API Anahtarı
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder={apiSettings.geminiApiKey ? "••••••••••••••••" : "API anahtarınızı girin"}
                    value={localGeminiKey}
                    onChange={(e) => setLocalGeminiKey(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={async () => {
                      if (!localGeminiKey) return;
                      setTestingKey("gemini");
                      try {
                        const res = await fetch("/api/test-api-key", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ provider: "gemini", apiKey: localGeminiKey }),
                        });
                        const data = await res.json();
                        setKeyTestResult({ provider: "gemini", success: data.success, error: data.error });
                        if (data.success) {
                          updateSettings({ geminiApiKey: localGeminiKey });
                          setLocalGeminiKey("");
                        }
                      } catch {
                        setKeyTestResult({ provider: "gemini", success: false, error: "Test başarısız" });
                      }
                      setTestingKey(null);
                    }}
                    disabled={!localGeminiKey || testingKey === "gemini"}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {testingKey === "gemini" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Kaydet"}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Google AI Studio
                  </a>
                  &apos;dan API anahtarı alabilirsiniz.
                </p>
              </div>

              {/* OpenAI API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  OpenAI API Anahtarı
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder={apiSettings.openaiApiKey ? "••••••••••••••••" : "sk-..."}
                    value={localOpenAIKey}
                    onChange={(e) => setLocalOpenAIKey(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={async () => {
                      if (!localOpenAIKey) return;
                      setTestingKey("openai");
                      try {
                        const res = await fetch("/api/test-api-key", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ provider: "openai", apiKey: localOpenAIKey }),
                        });
                        const data = await res.json();
                        setKeyTestResult({ provider: "openai", success: data.success, error: data.error });
                        if (data.success) {
                          updateSettings({ openaiApiKey: localOpenAIKey });
                          setLocalOpenAIKey("");
                        }
                      } catch {
                        setKeyTestResult({ provider: "openai", success: false, error: "Test başarısız" });
                      }
                      setTestingKey(null);
                    }}
                    disabled={!localOpenAIKey || testingKey === "openai"}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {testingKey === "openai" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Kaydet"}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    OpenAI Platform
                  </a>
                  &apos;dan API anahtarı alabilirsiniz.
                </p>
              </div>

              {/* Test Result */}
              {keyTestResult && (
                <div className={cn(
                  "p-3 rounded-xl",
                  keyTestResult.success
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                    : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                )}>
                  {keyTestResult.success
                    ? `${keyTestResult.provider === "gemini" ? "Gemini" : "OpenAI"} API anahtarı başarıyla kaydedildi!`
                    : keyTestResult.error || "Geçersiz API anahtarı"}
                </div>
              )}

              {/* Active Provider Selection */}
              {(hasValidKey("gemini") || hasValidKey("openai")) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Aktif AI Sağlayıcısı
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateSettings({ activeProvider: "gemini" })}
                      disabled={!hasValidKey("gemini")}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                        apiSettings.activeProvider === "gemini"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      )}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">Gemini</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Web arama + RAG
                      </div>
                    </button>
                    <button
                      onClick={() => updateSettings({ activeProvider: "openai" })}
                      disabled={!hasValidKey("openai")}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                        apiSettings.activeProvider === "openai"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      )}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">OpenAI</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        GPT-4o / GPT-4
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Bilgilendirme</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  API anahtarlarınız yalnızca tarayıcınızda saklanır ve sunucuya kaydedilmez.
                  Gemini web arama ve kaynak doğrulama özellikleri sunarken, OpenAI genel sohbet için kullanılır.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Hidden on mobile */}
      <footer className="hidden sm:block border-t border-gray-200 dark:border-gray-800 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
              © 2026 Hukuk AI. Bu sistem hukuki tavsiye vermez, sadece araştırma amaçlıdır.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Gizlilik
              </a>
              <a
                href="#"
                className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Kullanım Koşulları
              </a>
              <a
                href="#"
                className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Destek
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => handleCategoryChange("analysis")}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              activeCategory === "analysis"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            <Home size={20} />
            <span className="text-[10px] font-medium">Ana Sayfa</span>
          </button>
          <button
            onClick={() => handleCategoryChange("research")}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              activeCategory === "research"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            <Search size={20} />
            <span className="text-[10px] font-medium">Araştırma</span>
          </button>
          <button
            onClick={onNavigateToChat}
            className="flex flex-col items-center justify-center gap-1 text-white"
          >
            <div className="w-12 h-12 -mt-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <MessageSquare size={22} />
            </div>
          </button>
          <button
            onClick={() => setShowApiSettings(true)}
            className="flex flex-col items-center justify-center gap-1 text-gray-500 dark:text-gray-400"
          >
            <Settings size={20} />
            <span className="text-[10px] font-medium">Ayarlar</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
