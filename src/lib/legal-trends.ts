/**
 * Legal Trend Analysis System
 *
 * Analyzes trends in court decisions, legislation changes,
 * and legal doctrine evolution over time.
 *
 * Features:
 * - Court decision trend analysis
 * - Legislative change tracking
 * - Topic popularity over time
 * - Regional court variations
 */

export interface TrendData {
  period: string;
  value: number;
  change?: number;
  changePercent?: number;
}

export interface TrendAnalysis {
  topic: string;
  timeRange: { start: string; end: string };
  dataPoints: TrendData[];
  summary: TrendSummary;
  insights: TrendInsight[];
}

export interface TrendSummary {
  direction: "increasing" | "decreasing" | "stable" | "volatile";
  averageValue: number;
  peakValue: number;
  peakPeriod: string;
  lowestValue: number;
  lowestPeriod: string;
  overallChange: number;
  overallChangePercent: number;
}

export interface TrendInsight {
  type: "observation" | "warning" | "opportunity" | "prediction";
  title: string;
  description: string;
  confidence: number;
  relatedTopics?: string[];
}

export interface CourtStatistics {
  court: string;
  totalCases: number;
  acceptanceRate: number;
  avgDecisionTime: number;
  topCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  yearlyTrend: TrendData[];
}

export interface LegislationChange {
  lawNumber: number;
  lawName: string;
  changeDate: string;
  changeType: "amendment" | "new" | "repeal" | "update";
  affectedArticles?: number[];
  description: string;
  impact: "high" | "medium" | "low";
}

export interface TopicTrend {
  topic: string;
  category: string;
  currentPopularity: number;
  trend: "hot" | "rising" | "stable" | "declining";
  relatedCases: number;
  recentChanges: string[];
}

// Mock court statistics (in production, this would come from a database)
const COURT_STATISTICS: Record<string, CourtStatistics> = {
  "yargitay": {
    court: "Yargıtay",
    totalCases: 850000,
    acceptanceRate: 0.42,
    avgDecisionTime: 18,
    topCategories: [
      { category: "İş Hukuku", count: 180000, percentage: 21.2 },
      { category: "Borçlar Hukuku", count: 150000, percentage: 17.6 },
      { category: "Ceza Hukuku", count: 140000, percentage: 16.5 },
      { category: "Aile Hukuku", count: 120000, percentage: 14.1 },
      { category: "Ticaret Hukuku", count: 100000, percentage: 11.8 },
    ],
    yearlyTrend: [
      { period: "2020", value: 720000, change: 0, changePercent: 0 },
      { period: "2021", value: 680000, change: -40000, changePercent: -5.6 },
      { period: "2022", value: 750000, change: 70000, changePercent: 10.3 },
      { period: "2023", value: 820000, change: 70000, changePercent: 9.3 },
      { period: "2024", value: 850000, change: 30000, changePercent: 3.7 },
    ],
  },
  "danistay": {
    court: "Danıştay",
    totalCases: 120000,
    acceptanceRate: 0.38,
    avgDecisionTime: 24,
    topCategories: [
      { category: "İdari İşlem İptali", count: 45000, percentage: 37.5 },
      { category: "Vergi Uyuşmazlıkları", count: 30000, percentage: 25.0 },
      { category: "Memur Hukuku", count: 20000, percentage: 16.7 },
      { category: "İmar Hukuku", count: 15000, percentage: 12.5 },
      { category: "Çevre Hukuku", count: 10000, percentage: 8.3 },
    ],
    yearlyTrend: [
      { period: "2020", value: 100000, change: 0, changePercent: 0 },
      { period: "2021", value: 95000, change: -5000, changePercent: -5.0 },
      { period: "2022", value: 105000, change: 10000, changePercent: 10.5 },
      { period: "2023", value: 115000, change: 10000, changePercent: 9.5 },
      { period: "2024", value: 120000, change: 5000, changePercent: 4.3 },
    ],
  },
  "anayasa_mahkemesi": {
    court: "Anayasa Mahkemesi",
    totalCases: 85000,
    acceptanceRate: 0.12,
    avgDecisionTime: 36,
    topCategories: [
      { category: "Bireysel Başvuru", count: 80000, percentage: 94.1 },
      { category: "İptal Davası", count: 3000, percentage: 3.5 },
      { category: "Siyasi Parti Kapatma", count: 500, percentage: 0.6 },
      { category: "Diğer", count: 1500, percentage: 1.8 },
    ],
    yearlyTrend: [
      { period: "2020", value: 45000, change: 0, changePercent: 0 },
      { period: "2021", value: 55000, change: 10000, changePercent: 22.2 },
      { period: "2022", value: 70000, change: 15000, changePercent: 27.3 },
      { period: "2023", value: 80000, change: 10000, changePercent: 14.3 },
      { period: "2024", value: 85000, change: 5000, changePercent: 6.3 },
    ],
  },
};

// Recent legislation changes
const RECENT_LEGISLATION_CHANGES: LegislationChange[] = [
  {
    lawNumber: 7456,
    lawName: "Yapay Zeka Kanunu",
    changeDate: "2024-12-15",
    changeType: "new",
    description: "Yapay zeka sistemlerinin hukuki statüsü ve sorumluluk rejimi düzenlendi.",
    impact: "high",
  },
  {
    lawNumber: 4857,
    lawName: "İş Kanunu Değişikliği",
    changeDate: "2024-09-01",
    changeType: "amendment",
    affectedArticles: [17, 18, 21, 25],
    description: "Uzaktan çalışma ve esnek çalışma düzenlemelerinde değişiklik yapıldı.",
    impact: "high",
  },
  {
    lawNumber: 6698,
    lawName: "KVKK Değişikliği",
    changeDate: "2024-07-15",
    changeType: "amendment",
    affectedArticles: [5, 6, 8, 9],
    description: "AB GDPR uyumu kapsamında veri işleme şartları güncellendi.",
    impact: "high",
  },
  {
    lawNumber: 6102,
    lawName: "TTK Değişikliği",
    changeDate: "2024-06-01",
    changeType: "amendment",
    affectedArticles: [353, 355, 358],
    description: "Elektronik genel kurul ve dijital imza düzenlemeleri.",
    impact: "medium",
  },
  {
    lawNumber: 7459,
    lawName: "Kripto Varlıklar Kanunu",
    changeDate: "2024-03-15",
    changeType: "new",
    description: "Kripto varlık hizmet sağlayıcıları ve yatırımcı koruma düzenlemesi.",
    impact: "high",
  },
];

// Hot legal topics with trend data
const LEGAL_TOPICS: TopicTrend[] = [
  {
    topic: "Yapay Zeka ve Hukuk",
    category: "Teknoloji Hukuku",
    currentPopularity: 95,
    trend: "hot",
    relatedCases: 1250,
    recentChanges: [
      "7456 sayılı Yapay Zeka Kanunu yürürlüğe girdi",
      "AYM yapay zeka kararı bekleniyor",
      "Yargıtay'dan ilk içtihat kararı",
    ],
  },
  {
    topic: "Kişisel Veri Koruma",
    category: "Veri Hukuku",
    currentPopularity: 88,
    trend: "hot",
    relatedCases: 4500,
    recentChanges: [
      "KVKK 2024 değişiklikleri",
      "Yurt dışı veri aktarımı kararları",
      "Veri ihlali cezalarında artış",
    ],
  },
  {
    topic: "Uzaktan Çalışma",
    category: "İş Hukuku",
    currentPopularity: 75,
    trend: "stable",
    relatedCases: 3200,
    recentChanges: [
      "Hibrit çalışma düzenlemeleri",
      "Evden çalışma giderleri kararları",
      "İş kazası tanımı genişletildi",
    ],
  },
  {
    topic: "Kripto Varlıklar",
    category: "Finans Hukuku",
    currentPopularity: 82,
    trend: "rising",
    relatedCases: 850,
    recentChanges: [
      "Kripto Varlıklar Kanunu",
      "SPK düzenlemeleri",
      "Vergilendirme esasları",
    ],
  },
  {
    topic: "İşe İade Davaları",
    category: "İş Hukuku",
    currentPopularity: 70,
    trend: "stable",
    relatedCases: 28000,
    recentChanges: [
      "30 işçi sınırı tartışmaları",
      "Arabuluculuk zorunluluğu etkileri",
      "Tazminat hesaplama yöntemleri",
    ],
  },
  {
    topic: "E-Ticaret Hukuku",
    category: "Ticaret Hukuku",
    currentPopularity: 78,
    trend: "rising",
    relatedCases: 5600,
    recentChanges: [
      "Pazar yeri düzenlemeleri",
      "Tüketici hakları genişletildi",
      "Platform sorumlulukları",
    ],
  },
  {
    topic: "Çevre Hukuku",
    category: "İdare Hukuku",
    currentPopularity: 65,
    trend: "rising",
    relatedCases: 2100,
    recentChanges: [
      "Karbon emisyon düzenlemeleri",
      "ÇED raporları yargısal denetimi",
      "Yeşil dönüşüm teşvikleri",
    ],
  },
  {
    topic: "Miras Hukuku",
    category: "Medeni Hukuk",
    currentPopularity: 55,
    trend: "stable",
    relatedCases: 15000,
    recentChanges: [
      "Saklı pay hesaplamaları",
      "Dijital miras kavramı",
      "Yurt dışı miras davaları",
    ],
  },
];

/**
 * Get court statistics for a specific court
 */
export function getCourtStatistics(courtId: string): CourtStatistics | null {
  return COURT_STATISTICS[courtId.toLowerCase().replace(/\s+/g, "_")] || null;
}

/**
 * Get all available courts
 */
export function getAvailableCourts(): string[] {
  return Object.keys(COURT_STATISTICS);
}

/**
 * Analyze trend for a specific topic
 */
export function analyzeTrend(topic: string): TrendAnalysis | null {
  const topicData = LEGAL_TOPICS.find(
    t => t.topic.toLowerCase() === topic.toLowerCase()
  );

  if (!topicData) return null;

  // Generate mock trend data points
  const dataPoints: TrendData[] = generateTrendDataPoints(topicData);

  // Calculate summary
  const summary = calculateTrendSummary(dataPoints);

  // Generate insights
  const insights = generateTrendInsights(topicData, summary);

  return {
    topic: topicData.topic,
    timeRange: {
      start: dataPoints[0].period,
      end: dataPoints[dataPoints.length - 1].period,
    },
    dataPoints,
    summary,
    insights,
  };
}

/**
 * Generate trend data points
 */
function generateTrendDataPoints(topic: TopicTrend): TrendData[] {
  const months = [
    "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
    "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12",
  ];

  const baseValue = topic.relatedCases / 12;
  const trendMultiplier = topic.trend === "hot" ? 1.2 :
    topic.trend === "rising" ? 1.1 :
    topic.trend === "declining" ? 0.9 : 1.0;

  let previousValue = baseValue * 0.8;
  const dataPoints: TrendData[] = [];

  for (let i = 0; i < months.length; i++) {
    // Add some variance
    const variance = (Math.random() - 0.5) * 0.2;
    const trendEffect = Math.pow(trendMultiplier, i / 12);
    const value = Math.round(baseValue * trendEffect * (1 + variance));

    const change = value - previousValue;
    const changePercent = previousValue > 0 ? (change / previousValue) * 100 : 0;

    dataPoints.push({
      period: months[i],
      value,
      change: Math.round(change),
      changePercent: Math.round(changePercent * 10) / 10,
    });

    previousValue = value;
  }

  return dataPoints;
}

/**
 * Calculate trend summary
 */
function calculateTrendSummary(dataPoints: TrendData[]): TrendSummary {
  const values = dataPoints.map(d => d.value);
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
  const peakValue = Math.max(...values);
  const lowestValue = Math.min(...values);
  const peakIndex = values.indexOf(peakValue);
  const lowestIndex = values.indexOf(lowestValue);

  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const overallChange = lastValue - firstValue;
  const overallChangePercent = (overallChange / firstValue) * 100;

  // Determine direction
  let direction: TrendSummary["direction"];
  const volatility = (peakValue - lowestValue) / avgValue;

  if (volatility > 0.5) {
    direction = "volatile";
  } else if (overallChangePercent > 10) {
    direction = "increasing";
  } else if (overallChangePercent < -10) {
    direction = "decreasing";
  } else {
    direction = "stable";
  }

  return {
    direction,
    averageValue: Math.round(avgValue),
    peakValue,
    peakPeriod: dataPoints[peakIndex].period,
    lowestValue,
    lowestPeriod: dataPoints[lowestIndex].period,
    overallChange,
    overallChangePercent: Math.round(overallChangePercent * 10) / 10,
  };
}

/**
 * Generate trend insights
 */
function generateTrendInsights(
  topic: TopicTrend,
  summary: TrendSummary
): TrendInsight[] {
  const insights: TrendInsight[] = [];

  // Direction-based insight
  if (summary.direction === "increasing") {
    insights.push({
      type: "observation",
      title: "Artan İlgi",
      description: `${topic.topic} alanında dava sayıları son dönemde %${summary.overallChangePercent} artış gösterdi.`,
      confidence: 0.85,
      relatedTopics: [topic.category],
    });
  }

  // Recent changes insight
  if (topic.recentChanges.length > 0) {
    insights.push({
      type: "observation",
      title: "Güncel Değişiklikler",
      description: `${topic.recentChanges[0]}. Bu değişiklik dava sayılarını etkileyebilir.`,
      confidence: 0.9,
    });
  }

  // Trend-based prediction
  if (topic.trend === "hot" || topic.trend === "rising") {
    insights.push({
      type: "prediction",
      title: "Gelecek Tahminı",
      description: `${topic.topic} alanında önümüzdeki 6 ay içinde dava sayılarının artmaya devam etmesi bekleniyor.`,
      confidence: 0.7,
    });
  }

  // Opportunity insight
  if (topic.currentPopularity > 80) {
    insights.push({
      type: "opportunity",
      title: "Uzmanlık Fırsatı",
      description: `${topic.topic} yüksek talep gören bir alan. Bu alanda uzmanlaşma değerlendirilebilir.`,
      confidence: 0.75,
    });
  }

  // Warning for declining topics
  if (topic.trend === "declining") {
    insights.push({
      type: "warning",
      title: "Azalan Trend",
      description: `${topic.topic} alanında dava sayıları düşüş eğiliminde.`,
      confidence: 0.8,
    });
  }

  return insights;
}

/**
 * Get recent legislation changes
 */
export function getRecentLegislationChanges(
  options?: {
    limit?: number;
    impactLevel?: "high" | "medium" | "low";
    changeType?: LegislationChange["changeType"];
  }
): LegislationChange[] {
  let changes = [...RECENT_LEGISLATION_CHANGES];

  if (options?.impactLevel) {
    changes = changes.filter(c => c.impact === options.impactLevel);
  }

  if (options?.changeType) {
    changes = changes.filter(c => c.changeType === options.changeType);
  }

  // Sort by date descending
  changes.sort((a, b) => new Date(b.changeDate).getTime() - new Date(a.changeDate).getTime());

  if (options?.limit) {
    changes = changes.slice(0, options.limit);
  }

  return changes;
}

/**
 * Get hot legal topics
 */
export function getHotTopics(limit: number = 5): TopicTrend[] {
  return [...LEGAL_TOPICS]
    .sort((a, b) => b.currentPopularity - a.currentPopularity)
    .slice(0, limit);
}

/**
 * Get topics by category
 */
export function getTopicsByCategory(category: string): TopicTrend[] {
  return LEGAL_TOPICS.filter(
    t => t.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get all topic categories
 */
export function getTopicCategories(): string[] {
  const categories = new Set<string>();
  for (const topic of LEGAL_TOPICS) {
    categories.add(topic.category);
  }
  return Array.from(categories);
}

/**
 * Compare court acceptance rates
 */
export function compareCourtAcceptanceRates(): Array<{
  court: string;
  acceptanceRate: number;
  rank: number;
}> {
  const courts = Object.values(COURT_STATISTICS)
    .map(c => ({
      court: c.court,
      acceptanceRate: c.acceptanceRate,
      rank: 0,
    }))
    .sort((a, b) => b.acceptanceRate - a.acceptanceRate);

  courts.forEach((c, i) => {
    c.rank = i + 1;
  });

  return courts;
}

/**
 * Get case volume trends across all courts
 */
export function getCaseVolumeTrends(year: string): Array<{
  court: string;
  volume: number;
  change: number;
}> {
  const results: Array<{
    court: string;
    volume: number;
    change: number;
  }> = [];

  for (const stats of Object.values(COURT_STATISTICS)) {
    const yearData = stats.yearlyTrend.find(d => d.period === year);
    if (yearData) {
      results.push({
        court: stats.court,
        volume: yearData.value,
        change: yearData.changePercent || 0,
      });
    }
  }

  return results.sort((a, b) => b.volume - a.volume);
}

/**
 * Get legal area distribution across cases
 */
export function getLegalAreaDistribution(): Array<{
  area: string;
  percentage: number;
  caseCount: number;
}> {
  const distribution: Map<string, number> = new Map();
  let totalCases = 0;

  for (const stats of Object.values(COURT_STATISTICS)) {
    for (const cat of stats.topCategories) {
      const current = distribution.get(cat.category) || 0;
      distribution.set(cat.category, current + cat.count);
      totalCases += cat.count;
    }
  }

  return Array.from(distribution.entries())
    .map(([area, count]) => ({
      area,
      percentage: Math.round((count / totalCases) * 1000) / 10,
      caseCount: count,
    }))
    .sort((a, b) => b.caseCount - a.caseCount);
}

/**
 * Search for topics matching a query
 */
export function searchTopics(query: string): TopicTrend[] {
  const queryLower = query.toLowerCase();

  return LEGAL_TOPICS.filter(topic =>
    topic.topic.toLowerCase().includes(queryLower) ||
    topic.category.toLowerCase().includes(queryLower) ||
    topic.recentChanges.some(c => c.toLowerCase().includes(queryLower))
  );
}

/**
 * Get trend report for a specific legal area
 */
export function getLegalAreaReport(area: string): {
  topics: TopicTrend[];
  legislationChanges: LegislationChange[];
  courtStats: Array<{
    court: string;
    caseCount: number;
    percentage: number;
  }>;
  insights: TrendInsight[];
} {
  const areaLower = area.toLowerCase();

  // Find relevant topics
  const topics = LEGAL_TOPICS.filter(
    t => t.category.toLowerCase().includes(areaLower) ||
         t.topic.toLowerCase().includes(areaLower)
  );

  // Find relevant legislation changes
  const legislationChanges = RECENT_LEGISLATION_CHANGES.filter(
    c => c.lawName.toLowerCase().includes(areaLower) ||
         c.description.toLowerCase().includes(areaLower)
  );

  // Get court statistics for this area
  const courtStats: Array<{
    court: string;
    caseCount: number;
    percentage: number;
  }> = [];

  for (const stats of Object.values(COURT_STATISTICS)) {
    const category = stats.topCategories.find(
      c => c.category.toLowerCase().includes(areaLower)
    );
    if (category) {
      courtStats.push({
        court: stats.court,
        caseCount: category.count,
        percentage: category.percentage,
      });
    }
  }

  // Generate insights
  const insights: TrendInsight[] = [];

  if (topics.length > 0) {
    const hotTopics = topics.filter(t => t.trend === "hot" || t.trend === "rising");
    if (hotTopics.length > 0) {
      insights.push({
        type: "observation",
        title: "Güncel Konular",
        description: `${area} alanında ${hotTopics.map(t => t.topic).join(", ")} konuları öne çıkıyor.`,
        confidence: 0.85,
      });
    }
  }

  if (legislationChanges.length > 0) {
    insights.push({
      type: "warning",
      title: "Mevzuat Değişiklikleri",
      description: `Son dönemde ${legislationChanges.length} önemli mevzuat değişikliği yapıldı.`,
      confidence: 0.95,
    });
  }

  return {
    topics,
    legislationChanges,
    courtStats,
    insights,
  };
}
