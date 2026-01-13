/**
 * Tests for Legal Glossary Library
 * @vitest-environment node
 */

import { describe, it, expect } from "vitest";
import {
  getTerm,
  searchGlossary,
  explainText,
  getTermOfTheDay,
  getConfusedTermPairs,
  getTermsByCategory,
  getCategories,
  getRelatedTerms,
  getGlossaryStats,
} from "@/lib/legal-glossary";

describe("getTerm", () => {
  it("should return definition for known term", () => {
    const term = getTerm("dava");

    expect(term).not.toBeNull();
    expect(term?.term).toBe("dava");
    expect(term?.definition).toBeDefined();
    expect(term?.category).toBeDefined();
  });

  it("should return definition for sözleşme", () => {
    const term = getTerm("sözleşme");

    expect(term).not.toBeNull();
    expect(term?.term).toBe("sözleşme");
    expect(term?.usage).toBeDefined();
  });

  it("should return null for unknown term", () => {
    const term = getTerm("bilinmeyen_terim");

    expect(term).toBeNull();
  });

  it("should be case insensitive", () => {
    const term1 = getTerm("DAVA");
    const term2 = getTerm("dava");

    expect(term1?.definition).toBe(term2?.definition);
  });

  it("should find term by synonym", () => {
    const term = getTerm("akit"); // synonym for sözleşme

    expect(term).not.toBeNull();
    expect(term?.term).toBe("sözleşme");
  });
});

describe("searchGlossary", () => {
  it("should find terms matching query", () => {
    const results = searchGlossary("dava");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].term).toBeDefined();
    expect(results[0].score).toBeGreaterThan(0);
  });

  it("should search in definitions", () => {
    const results = searchGlossary("mahkeme");

    expect(results.length).toBeGreaterThan(0);
  });

  it("should return empty for no matches", () => {
    const results = searchGlossary("zzzzzzz");

    expect(results.length).toBe(0);
  });

  it("should limit results", () => {
    const results = searchGlossary("hukuk", 3);

    expect(results.length).toBeLessThanOrEqual(3);
  });

  it("should return match type", () => {
    const results = searchGlossary("dava");

    expect(results[0].matchType).toMatch(/^(exact|synonym|partial|related)$/);
  });
});

describe("explainText", () => {
  it("should explain legal terms in text", () => {
    const text = "Sözleşmenin temerrüt hükümleri kapsamında incelenmesi gerekmektedir.";
    const result = explainText(text);

    expect(result.originalText).toBe(text);
    expect(result.explanations.length).toBeGreaterThan(0);
    expect(result.simplifiedText).toBeDefined();
  });

  it("should return empty explanations for text without legal terms", () => {
    const text = "Bugün hava çok güzel.";
    const result = explainText(text);

    expect(result.explanations.length).toBe(0);
  });

  it("should include position information", () => {
    const text = "Davacı mahkemeye başvurmuştur.";
    const result = explainText(text);

    if (result.explanations.length > 0) {
      expect(result.explanations[0].position).toBeDefined();
      expect(result.explanations[0].position.start).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("getTermOfTheDay", () => {
  it("should return a term", () => {
    const term = getTermOfTheDay();

    expect(term).not.toBeNull();
    expect(term.term).toBeDefined();
    expect(term.definition).toBeDefined();
  });
});

describe("getConfusedTermPairs", () => {
  it("should return commonly confused term pairs", () => {
    const pairs = getConfusedTermPairs();

    expect(pairs.length).toBeGreaterThan(0);
    expect(pairs[0].term1).toBeDefined();
    expect(pairs[0].term2).toBeDefined();
    expect(pairs[0].difference).toBeDefined();
  });

  it("should have distinct terms in each pair", () => {
    const pairs = getConfusedTermPairs();

    pairs.forEach((pair) => {
      expect(pair.term1.term).not.toBe(pair.term2.term);
    });
  });
});

describe("getTermsByCategory", () => {
  it("should return terms in genel category", () => {
    const terms = getTermsByCategory("genel");

    expect(terms.length).toBeGreaterThan(0);
    terms.forEach((term) => {
      expect(term.category).toBe("genel");
    });
  });

  it("should return terms in ceza category", () => {
    const terms = getTermsByCategory("ceza");

    expect(terms.length).toBeGreaterThan(0);
    terms.forEach((term) => {
      expect(term.category).toBe("ceza");
    });
  });

  it("should return terms in borclar category", () => {
    const terms = getTermsByCategory("borclar");

    expect(terms.length).toBeGreaterThan(0);
  });
});

describe("getCategories", () => {
  it("should return all glossary categories", () => {
    const categories = getCategories();

    expect(categories.length).toBeGreaterThan(3);
    expect(categories.some((c) => c.category === "genel")).toBe(true);
    expect(categories.some((c) => c.category === "ceza")).toBe(true);
  });

  it("should include count and label", () => {
    const categories = getCategories();

    expect(categories[0].count).toBeGreaterThan(0);
    expect(categories[0].label).toBeDefined();
  });
});

describe("getRelatedTerms", () => {
  it("should return related terms for sözleşme", () => {
    const related = getRelatedTerms("sözleşme");

    expect(related.length).toBeGreaterThan(0);
  });

  it("should return empty for unknown term", () => {
    const related = getRelatedTerms("bilinmeyen_terim");

    expect(related.length).toBe(0);
  });
});

describe("getGlossaryStats", () => {
  it("should return glossary statistics", () => {
    const stats = getGlossaryStats();

    expect(stats.totalTerms).toBeGreaterThan(0);
    expect(stats.categoryCounts.size).toBeGreaterThan(0);
    expect(stats.termsWithExamples).toBeGreaterThanOrEqual(0);
  });
});
