/**
 * Tests for Legal Trends Library
 * @vitest-environment node
 */

import { describe, it, expect } from "vitest";
import {
  getCourtStatistics,
  getAvailableCourts,
  analyzeTrend,
  getHotTopics,
  getRecentLegislationChanges,
  getTopicsByCategory,
  getTopicCategories,
  getLegalAreaDistribution,
  searchTopics,
  getCaseVolumeTrends,
  compareCourtAcceptanceRates,
} from "@/lib/legal-trends";

describe("getCourtStatistics", () => {
  it("should return statistics for Yargıtay", () => {
    const stats = getCourtStatistics("yargitay");

    expect(stats).not.toBeNull();
    expect(stats?.court).toBe("Yargıtay");
    expect(stats?.totalCases).toBeGreaterThan(0);
    expect(stats?.avgDecisionTime).toBeDefined();
    expect(stats?.topCategories.length).toBeGreaterThan(0);
  });

  it("should return statistics for Danıştay", () => {
    const stats = getCourtStatistics("danistay");

    expect(stats).not.toBeNull();
    expect(stats?.court).toBe("Danıştay");
    expect(stats?.totalCases).toBeGreaterThan(0);
  });

  it("should return statistics for Anayasa Mahkemesi", () => {
    const stats = getCourtStatistics("anayasa_mahkemesi");

    expect(stats).not.toBeNull();
    expect(stats?.court).toBe("Anayasa Mahkemesi");
  });

  it("should return null for unknown court", () => {
    const stats = getCourtStatistics("bilinmeyen");

    expect(stats).toBeNull();
  });
});

describe("getAvailableCourts", () => {
  it("should return list of available courts", () => {
    const courts = getAvailableCourts();

    expect(courts.length).toBeGreaterThan(0);
    expect(courts).toContain("yargitay");
    expect(courts).toContain("danistay");
  });
});

describe("analyzeTrend", () => {
  it("should analyze Yapay Zeka ve Hukuk trend", () => {
    const trend = analyzeTrend("Yapay Zeka ve Hukuk");

    expect(trend).not.toBeNull();
    expect(trend?.topic).toBe("Yapay Zeka ve Hukuk");
    expect(trend?.summary.direction).toBeDefined();
    expect(trend?.dataPoints.length).toBeGreaterThan(0);
  });

  it("should analyze Kişisel Veri Koruma trend", () => {
    const trend = analyzeTrend("Kişisel Veri Koruma");

    expect(trend).not.toBeNull();
    expect(trend?.insights.length).toBeGreaterThanOrEqual(0);
  });

  it("should return null for unknown topic", () => {
    const trend = analyzeTrend("bilinmeyen konu");

    expect(trend).toBeNull();
  });
});

describe("getHotTopics", () => {
  it("should return hot legal topics", () => {
    const topics = getHotTopics();

    expect(topics.length).toBeGreaterThan(0);
    expect(topics[0].topic).toBeDefined();
    expect(topics[0].currentPopularity).toBeGreaterThan(0);
    expect(topics[0].trend).toBeDefined();
  });

  it("should return topics sorted by popularity", () => {
    const topics = getHotTopics();

    for (let i = 1; i < topics.length; i++) {
      expect(topics[i - 1].currentPopularity).toBeGreaterThanOrEqual(
        topics[i].currentPopularity
      );
    }
  });

  it("should limit results when specified", () => {
    const topics = getHotTopics(3);

    expect(topics.length).toBeLessThanOrEqual(3);
  });
});

describe("getRecentLegislationChanges", () => {
  it("should return recent legislation changes", () => {
    const changes = getRecentLegislationChanges();

    expect(changes.length).toBeGreaterThan(0);
    expect(changes[0].lawNumber).toBeDefined();
    expect(changes[0].lawName).toBeDefined();
    expect(changes[0].changeType).toMatch(/^(new|amendment|repeal|update)$/);
    expect(changes[0].changeDate).toBeDefined();
  });

  it("should filter by impact level", () => {
    const changes = getRecentLegislationChanges({ impactLevel: "high" });

    changes.forEach((change) => {
      expect(change.impact).toBe("high");
    });
  });

  it("should filter by change type", () => {
    const changes = getRecentLegislationChanges({ changeType: "new" });

    changes.forEach((change) => {
      expect(change.changeType).toBe("new");
    });
  });

  it("should limit results", () => {
    const changes = getRecentLegislationChanges({ limit: 2 });

    expect(changes.length).toBeLessThanOrEqual(2);
  });
});

describe("getLegalAreaDistribution", () => {
  it("should return legal area distribution", () => {
    const distribution = getLegalAreaDistribution();

    expect(distribution.length).toBeGreaterThan(0);
    expect(distribution[0].area).toBeDefined();
    expect(distribution[0].caseCount).toBeGreaterThan(0);
    expect(distribution[0].percentage).toBeGreaterThan(0);
  });
});

describe("getTopicsByCategory", () => {
  it("should return topics in İş Hukuku category", () => {
    const topics = getTopicsByCategory("İş Hukuku");

    expect(topics.length).toBeGreaterThan(0);
    topics.forEach((topic) => {
      expect(topic.category).toBe("İş Hukuku");
    });
  });
});

describe("getTopicCategories", () => {
  it("should return all topic categories", () => {
    const categories = getTopicCategories();

    expect(categories.length).toBeGreaterThan(0);
  });
});

describe("searchTopics", () => {
  it("should search topics by query", () => {
    const results = searchTopics("yapay zeka");

    expect(results.length).toBeGreaterThan(0);
  });
});

describe("getCaseVolumeTrends", () => {
  it("should return case volume trends for a year", () => {
    const trends = getCaseVolumeTrends("2024");

    expect(trends.length).toBeGreaterThan(0);
    expect(trends[0].court).toBeDefined();
    expect(trends[0].volume).toBeGreaterThan(0);
  });
});

describe("compareCourtAcceptanceRates", () => {
  it("should compare court acceptance rates", () => {
    const comparison = compareCourtAcceptanceRates();

    expect(comparison.length).toBeGreaterThan(0);
    expect(comparison[0].court).toBeDefined();
    expect(comparison[0].acceptanceRate).toBeGreaterThan(0);
    expect(comparison[0].rank).toBe(1);
  });
});
