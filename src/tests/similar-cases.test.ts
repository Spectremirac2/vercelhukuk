/**
 * Tests for Similar Cases Library
 * @vitest-environment node
 */

import { describe, it, expect } from "vitest";
import {
  findSimilarCases,
  searchCasesByText,
  buildPrecedentChain,
  getCasesByLegalArea,
  getCaseById,
  getRecentCases,
  getCasesByCourt,
  getCaseStatistics,
  findCasesByLaw,
  getLandmarkCases,
} from "@/lib/similar-cases";

describe("findSimilarCases", () => {
  it("should find similar cases based on criteria", () => {
    const similar = findSimilarCases({
      legalArea: "iş",
      keywords: ["işe iade", "fesih"],
      caseType: "işe iade",
    });

    expect(similar.length).toBeGreaterThan(0);
    expect(similar[0].similarity.overall).toBeGreaterThanOrEqual(0);
    expect(similar[0].similarity.overall).toBeLessThanOrEqual(1);
  });

  it("should return cases sorted by similarity", () => {
    const similar = findSimilarCases({
      legalArea: "borçlar",
      keywords: ["tazminat"],
    });

    for (let i = 1; i < similar.length; i++) {
      expect(similar[i - 1].similarity.overall).toBeGreaterThanOrEqual(
        similar[i].similarity.overall
      );
    }
  });

  it("should limit results", () => {
    const similar = findSimilarCases({
      legalArea: "iş",
      limit: 2,
    });

    expect(similar.length).toBeLessThanOrEqual(2);
  });

  it("should include matching factors", () => {
    const similar = findSimilarCases({
      legalArea: "iş",
      keywords: ["işe iade"],
    });

    if (similar.length > 0) {
      expect(similar[0].matchingFactors).toBeDefined();
      expect(similar[0].relevanceExplanation).toBeDefined();
    }
  });

  it("should filter by court", () => {
    const similar = findSimilarCases({
      court: "Yargıtay",
    });

    similar.forEach((result) => {
      expect(result.case.court).toContain("Yargıtay");
    });
  });

  it("should filter by year range", () => {
    const similar = findSimilarCases({
      yearRange: { start: 2023, end: 2024 },
    });

    similar.forEach((result) => {
      expect(result.case.year).toBeGreaterThanOrEqual(2023);
      expect(result.case.year).toBeLessThanOrEqual(2024);
    });
  });
});

describe("searchCasesByText", () => {
  it("should search cases by text query", () => {
    const results = searchCasesByText("işçi hakları haksız fesih");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].case).toBeDefined();
    expect(results[0].similarity).toBeDefined();
  });

  it("should limit results", () => {
    const results = searchCasesByText("tazminat", 3);

    expect(results.length).toBeLessThanOrEqual(3);
  });
});

describe("buildPrecedentChain", () => {
  it("should build precedent chain for a case", () => {
    const chain = buildPrecedentChain("yargitay_9hd_2023_4567");

    expect(chain).not.toBeNull();
    expect(chain?.rootCase).toBeDefined();
    expect(chain?.precedents).toBeDefined();
    expect(chain?.followers).toBeDefined();
  });

  it("should return null for unknown case", () => {
    const chain = buildPrecedentChain("nonexistent_case_id");

    expect(chain).toBeNull();
  });

  it("should include precedents with depth", () => {
    const chain = buildPrecedentChain("yargitay_9hd_2023_4567");

    if (chain && chain.precedents.length > 0) {
      expect(chain.precedents[0].depth).toBeGreaterThanOrEqual(1);
      expect(chain.precedents[0].relationship).toBeDefined();
    }
  });
});

describe("getCasesByLegalArea", () => {
  it("should get cases by legal area", () => {
    const cases = getCasesByLegalArea("iş");

    expect(cases.length).toBeGreaterThan(0);
    cases.forEach((c) => {
      expect(c.legalArea.toLowerCase()).toContain("iş");
    });
  });

  it("should get cases by aile area", () => {
    const cases = getCasesByLegalArea("aile");

    expect(cases.length).toBeGreaterThan(0);
    cases.forEach((c) => {
      expect(c.legalArea.toLowerCase()).toContain("aile");
    });
  });

  it("should return empty for unknown area", () => {
    const cases = getCasesByLegalArea("bilinmeyen_alan");

    expect(cases.length).toBe(0);
  });
});

describe("getCaseById", () => {
  it("should get case by ID", () => {
    const caseData = getCaseById("yargitay_9hd_2023_4567");

    expect(caseData).not.toBeNull();
    expect(caseData?.id).toBe("yargitay_9hd_2023_4567");
    expect(caseData?.court).toBeDefined();
    expect(caseData?.caseNumber).toBeDefined();
    expect(caseData?.facts).toBeDefined();
  });

  it("should return null for unknown ID", () => {
    const caseData = getCaseById("nonexistent_id");

    expect(caseData).toBeNull();
  });
});

describe("getRecentCases", () => {
  it("should return recent cases", () => {
    const recent = getRecentCases();

    expect(recent.length).toBeGreaterThan(0);
    expect(recent[0].date).toBeDefined();
  });

  it("should return cases sorted by date", () => {
    const recent = getRecentCases();

    for (let i = 1; i < recent.length; i++) {
      expect(new Date(recent[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(recent[i].date).getTime()
      );
    }
  });

  it("should limit results", () => {
    const recent = getRecentCases(2);

    expect(recent.length).toBeLessThanOrEqual(2);
  });
});

describe("getCasesByCourt", () => {
  it("should get cases by court", () => {
    const cases = getCasesByCourt("Yargıtay");

    expect(cases.length).toBeGreaterThan(0);
    cases.forEach((c) => {
      expect(c.court).toContain("Yargıtay");
    });
  });

  it("should get cases by Danıştay", () => {
    const cases = getCasesByCourt("Danıştay");

    expect(cases.length).toBeGreaterThan(0);
  });
});

describe("getCaseStatistics", () => {
  it("should return case statistics", () => {
    const stats = getCaseStatistics();

    expect(stats.totalCases).toBeGreaterThan(0);
    expect(stats.byLegalArea.size).toBeGreaterThan(0);
    expect(stats.byCourt.size).toBeGreaterThan(0);
    expect(stats.byOutcome.size).toBeGreaterThan(0);
  });
});

describe("findCasesByLaw", () => {
  it("should find cases applying specific law", () => {
    const cases = findCasesByLaw(4857); // İş Kanunu

    expect(cases.length).toBeGreaterThan(0);
    cases.forEach((c) => {
      expect(c.appliedLaws.some((law) => law.lawNumber === 4857)).toBe(true);
    });
  });
});

describe("getLandmarkCases", () => {
  it("should return landmark cases with citation count", () => {
    const landmark = getLandmarkCases();

    // May be empty if no citations
    if (landmark.length > 0) {
      expect(landmark[0].case).toBeDefined();
      expect(landmark[0].citationCount).toBeGreaterThan(0);
    }
  });
});
