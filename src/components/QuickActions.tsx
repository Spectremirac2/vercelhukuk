"use client";

import React, { useState } from "react";
import {
  Zap,
  FileText,
  Scale,
  BookOpen,
  Calculator,
  Clock,
  AlertTriangle,
  FileSearch,
  Briefcase,
  Gavel,
  HelpCircle,
  ChevronRight,
  Sparkles,
  CheckSquare,
  ListTodo,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  category: "analysis" | "calculation" | "research" | "template";
  prompt: string;
  color: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  // Analysis
  {
    id: "summarize_case",
    label: "Davayı Özetle",
    description: "Yüklenen belgenin hukuki özetini çıkar",
    icon: FileText,
    category: "analysis",
    prompt: "Yüklenen belgeyi analiz et ve hukuki bir özet hazırla. Tarafları, konuyu, talepleri ve sonucu belirt.",
    color: "blue",
  },
  {
    id: "identify_risks",
    label: "Riskleri Belirle",
    description: "Sözleşme veya belgedeki riskleri tespit et",
    icon: AlertTriangle,
    category: "analysis",
    prompt: "Bu belgedeki hukuki riskleri ve dikkat edilmesi gereken noktaları belirle. Her risk için önem derecesi ve öneri sun.",
    color: "red",
  },
  {
    id: "extract_timeline",
    label: "Zaman Çizelgesi",
    description: "Belgeden kronolojik olayları çıkar",
    icon: Clock,
    category: "analysis",
    prompt: "Bu belgeden tüm önemli tarihleri ve olayları kronolojik sırayla çıkar. Dava sürecinin zaman çizelgesini oluştur.",
    color: "purple",
  },
  {
    id: "find_precedents",
    label: "Emsal Ara",
    description: "İlgili Yargıtay/Danıştay kararlarını bul",
    icon: Gavel,
    category: "research",
    prompt: "Bu konuyla ilgili güncel Yargıtay ve Danıştay kararlarını bul. Emsal niteliğinde kararları ve sonuçlarını listele.",
    color: "orange",
  },
  // Calculations
  {
    id: "calc_severance",
    label: "Kıdem Tazminatı",
    description: "Kıdem tazminatı hesapla",
    icon: Calculator,
    category: "calculation",
    prompt: "Kıdem tazminatı hesaplaması için gerekli bilgileri sor: çalışma süresi, son brüt maaş, işe giriş tarihi. Ardından hesaplamayı yap.",
    color: "green",
  },
  {
    id: "calc_interest",
    label: "Faiz Hesapla",
    description: "Yasal/ticari faiz hesapla",
    icon: Calculator,
    category: "calculation",
    prompt: "Faiz hesaplaması için gerekli bilgileri sor: ana para, başlangıç tarihi, faiz türü (yasal/ticari/temerrüt). Güncel faiz oranlarıyla hesapla.",
    color: "green",
  },
  {
    id: "calc_deadline",
    label: "Süre Hesapla",
    description: "Hukuki süreleri hesapla",
    icon: Clock,
    category: "calculation",
    prompt: "Hukuki süre hesaplaması için başlangıç tarihini ve süre türünü (iş günü/takvim günü/hafta/ay) sor. Resmi tatilleri de dikkate alarak son günü hesapla.",
    color: "green",
  },
  // Research
  {
    id: "explain_law",
    label: "Kanunu Açıkla",
    description: "Belirli bir kanun maddesini açıkla",
    icon: BookOpen,
    category: "research",
    prompt: "Hangi kanun ve madde numarasını açıklamamı istersin? Madde metnini, amacını, uygulamasını ve güncel içtihatları açıklayacağım.",
    color: "blue",
  },
  {
    id: "compare_laws",
    label: "Kanunları Karşılaştır",
    description: "İki düzenlemeyi karşılaştır",
    icon: Scale,
    category: "research",
    prompt: "Hangi kanunları veya maddeleri karşılaştırmamı istersin? Farklılıkları, benzerlikleri ve uygulamadaki etkilerini analiz edeceğim.",
    color: "purple",
  },
  {
    id: "legal_terms",
    label: "Terim Açıkla",
    description: "Hukuki terimi tanımla",
    icon: HelpCircle,
    category: "research",
    prompt: "Hangi hukuki terimi açıklamamı istersin? Tanımı, kullanım alanı ve örneklerle birlikte açıklayacağım.",
    color: "teal",
  },
  // Templates
  {
    id: "draft_petition",
    label: "Dilekçe Taslağı",
    description: "Dilekçe taslağı oluştur",
    icon: FileSearch,
    category: "template",
    prompt: "Ne tür bir dilekçe hazırlamamı istersin? (Dava dilekçesi, cevap dilekçesi, itiraz dilekçesi, vb.) Gerekli bilgileri alarak taslak hazırlayacağım.",
    color: "indigo",
  },
  {
    id: "contract_review",
    label: "Sözleşme İncele",
    description: "Sözleşme kontrolü yap",
    icon: Briefcase,
    category: "template",
    prompt: "Yüklenen sözleşmeyi incele. Eksik maddeler, riskli hükümler ve önerilen değişiklikleri listele.",
    color: "indigo",
  },
  {
    id: "checklist",
    label: "Kontrol Listesi",
    description: "Hukuki işlem kontrol listesi",
    icon: CheckSquare,
    category: "template",
    prompt: "Hangi hukuki işlem için kontrol listesi oluşturmamı istersin? (Şirket kuruluşu, dava açma, icra takibi, vb.)",
    color: "teal",
  },
];

const CATEGORY_LABELS = {
  analysis: { label: "Analiz", icon: FileText },
  calculation: { label: "Hesaplama", icon: Calculator },
  research: { label: "Araştırma", icon: BookOpen },
  template: { label: "Şablon", icon: ListTodo },
};

interface QuickActionsProps {
  onSelectAction: (prompt: string) => void;
  variant?: "grid" | "list" | "compact";
  showCategories?: boolean;
  className?: string;
}

export function QuickActions({
  onSelectAction,
  variant = "grid",
  showCategories = true,
  className,
}: QuickActionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const filteredActions = selectedCategory
    ? QUICK_ACTIONS.filter((a) => a.category === selectedCategory)
    : QUICK_ACTIONS;

  if (variant === "compact") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Zap size={12} />
          <span>Hızlı İşlemler</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.slice(0, 6).map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onSelectAction(action.prompt)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Icon size={12} />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white dark:bg-gray-900 rounded-2xl", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Hızlı İşlemler
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Sık kullanılan hukuki işlemler
            </p>
          </div>
        </div>

        {/* Category Filters */}
        {showCategories && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                !selectedCategory
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              )}
            >
              Tümü
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, { label, icon: Icon }]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
                  selectedCategory === key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                )}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions Grid/List */}
      <div className="p-4 max-h-[400px] overflow-y-auto">
        {variant === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredActions.map((action) => (
              <QuickActionCard
                key={action.id}
                action={action}
                isHovered={hoveredAction === action.id}
                onHover={() => setHoveredAction(action.id)}
                onLeave={() => setHoveredAction(null)}
                onClick={() => onSelectAction(action.prompt)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredActions.map((action) => (
              <QuickActionRow
                key={action.id}
                action={action}
                onClick={() => onSelectAction(action.prompt)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Card variant
interface QuickActionCardProps {
  action: QuickAction;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

function QuickActionCard({
  action,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: QuickActionCardProps) {
  const Icon = action.icon;

  const colorClasses: Record<string, { bg: string; text: string; hover: string }> = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
      hover: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-600 dark:text-green-400",
      hover: "hover:bg-green-100 dark:hover:bg-green-900/30",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-900/20",
      text: "text-red-600 dark:text-red-400",
      hover: "hover:bg-red-100 dark:hover:bg-red-900/30",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-600 dark:text-purple-400",
      hover: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      text: "text-orange-600 dark:text-orange-400",
      hover: "hover:bg-orange-100 dark:hover:bg-orange-900/30",
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      text: "text-indigo-600 dark:text-indigo-400",
      hover: "hover:bg-indigo-100 dark:hover:bg-indigo-900/30",
    },
    teal: {
      bg: "bg-teal-50 dark:bg-teal-900/20",
      text: "text-teal-600 dark:text-teal-400",
      hover: "hover:bg-teal-100 dark:hover:bg-teal-900/30",
    },
  };

  const colors = colorClasses[action.color] || colorClasses.blue;

  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={cn(
        "p-4 rounded-xl border border-gray-200 dark:border-gray-700 text-left transition-all",
        colors.hover,
        isHovered && "shadow-md scale-[1.02]"
      )}
    >
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", colors.bg)}>
        <Icon size={20} className={colors.text} />
      </div>
      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{action.label}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
        {action.description}
      </p>
    </button>
  );
}

// Row variant
interface QuickActionRowProps {
  action: QuickAction;
  onClick: () => void;
}

function QuickActionRow({ action, onClick }: QuickActionRowProps) {
  const Icon = action.icon;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
    >
      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-gray-200 dark:group-hover:bg-gray-700">
        <Icon size={18} className="text-gray-600 dark:text-gray-400" />
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="font-medium text-gray-900 dark:text-white text-sm">{action.label}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {action.description}
        </div>
      </div>
      <ChevronRight
        size={16}
        className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
      />
    </button>
  );
}

/**
 * Floating Quick Actions Button
 */
interface FloatingQuickActionsProps {
  onSelectAction: (prompt: string) => void;
}

export function FloatingQuickActions({ onSelectAction }: FloatingQuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-40">
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <QuickActions
            onSelectAction={(prompt) => {
              onSelectAction(prompt);
              setIsOpen(false);
            }}
            variant="list"
            showCategories={false}
          />
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-4 rounded-full shadow-lg transition-all",
          isOpen
            ? "bg-gray-200 dark:bg-gray-700"
            : "bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        )}
      >
        {isOpen ? (
          <ArrowRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <Zap className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}
