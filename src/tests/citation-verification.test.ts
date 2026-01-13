/**
 * Tests for Citation Verification Library
 */

import { describe, it, expect } from "vitest";
import {
  extractLegalEntities,
  calculateEntityGrounding,
  verifyCitation,
  verifyResponse,
  getVerificationBadge,
} from "@/lib/citation-verification";

describe("extractLegalEntities", () => {
  it("should extract case numbers", () => {
    const text = "Yargıtay kararı 2024/1234 E., 2024/5678 K.";
    const entities = extractLegalEntities(text);

    expect(entities).toContain("2024/1234 E.");
    expect(entities).toContain("2024/5678 K.");
  });

  it("should extract law articles", () => {
    const text = "Bu husus madde 5 ve md. 10 ile düzenlenmiştir.";
    const entities = extractLegalEntities(text);

    expect(entities.some((e) => e.includes("madde 5"))).toBe(true);
    expect(entities.some((e) => e.includes("md. 10"))).toBe(true);
  });

  it("should extract law numbers with names", () => {
    const text = "6698 sayılı Kanun ve 5237 sayılı TCK kapsamında";
    const entities = extractLegalEntities(text);

    expect(entities.some((e) => e.includes("6698 sayılı Kanun"))).toBe(true);
    expect(entities.some((e) => e.includes("5237 sayılı TCK"))).toBe(true);
  });

  it("should extract court names", () => {
    const text = "Yargıtay ve Danıştay kararlarına göre";
    const entities = extractLegalEntities(text);

    expect(entities).toContain("Yargıtay");
    expect(entities).toContain("Danıştay");
  });

  it("should extract chamber references", () => {
    const text = "4. Hukuk Dairesi ve 12. Ceza Dairesi kararları";
    const entities = extractLegalEntities(text);

    expect(entities.some((e) => e.includes("4. Hukuk Dairesi"))).toBe(true);
    expect(entities.some((e) => e.includes("12. Ceza Dairesi"))).toBe(true);
  });

  it("should extract dates in various formats", () => {
    const text = "01.01.2024 tarihli ve 15 Ocak 2024 günlü karar";
    const entities = extractLegalEntities(text);

    expect(entities.some((e) => e.includes("01.01.2024"))).toBe(true);
    expect(entities.some((e) => e.includes("15 Ocak 2024"))).toBe(true);
  });

  it("should return empty array for text without legal entities", () => {
    const text = "Bugün hava güzel.";
    const entities = extractLegalEntities(text);

    expect(entities.length).toBe(0);
  });
});

describe("calculateEntityGrounding", () => {
  it("should return score of 1 when all entities are found", () => {
    const entities = ["madde 5", "Yargıtay"];
    const source = "madde 5 uyarınca Yargıtay kararına göre";

    const result = calculateEntityGrounding(entities, source);

    expect(result.score).toBe(1);
    expect(result.matches.every((m) => m.foundInSource)).toBe(true);
  });

  it("should return score of 0.5 when half entities are found", () => {
    const entities = ["madde 5", "madde 10"];
    const source = "madde 5 uyarınca işlem yapılır";

    const result = calculateEntityGrounding(entities, source);

    expect(result.score).toBe(0.5);
    expect(result.matches.filter((m) => m.foundInSource).length).toBe(1);
  });

  it("should return score of 0 when no entities are found", () => {
    const entities = ["madde 100", "Yargıtay"];
    const source = "Tamamen farklı bir metin";

    const result = calculateEntityGrounding(entities, source);

    expect(result.score).toBe(0);
  });

  it("should return score of 1 for empty entities list", () => {
    const entities: string[] = [];
    const source = "Herhangi bir kaynak metin";

    const result = calculateEntityGrounding(entities, source);

    expect(result.score).toBe(1);
  });

  it("should be case insensitive", () => {
    const entities = ["MADDE 5", "yargıtay"];
    const source = "madde 5 ve Yargıtay kararı";

    const result = calculateEntityGrounding(entities, source);

    expect(result.score).toBe(1);
  });

  it("should provide source snippets for found entities", () => {
    const entities = ["madde 5"];
    const source = "Bu durumda madde 5 uyarınca işlem yapılmalıdır.";

    const result = calculateEntityGrounding(entities, source);

    expect(result.matches[0].sourceSnippet).toBeTruthy();
    expect(result.matches[0].sourceSnippet).toContain("madde 5");
  });
});

describe("verifyCitation", () => {
  const baseCitation = {
    text: "6698 sayılı Kanun madde 5 uyarınca kişisel veriler işlenebilir.",
    sourceUri: "https://example.com/kvkk",
    sourceTitle: "KVKK Mevzuat",
  };

  it("should return high confidence when citation matches source", () => {
    const sourceContent =
      "6698 sayılı Kanun madde 5 uyarınca kişisel verilerin işlenmesi mümkündür.";

    const result = verifyCitation(baseCitation, sourceContent);

    expect(result.confidence).toBeGreaterThan(0.5);
    expect(result.entityGrounding).toBeGreaterThan(0.5);
  });

  it("should return low confidence when citation does not match source", () => {
    const sourceContent = "Tamamen farklı ve alakasız bir içerik.";

    const result = verifyCitation(baseCitation, sourceContent);

    expect(result.confidence).toBeLessThan(0.5);
  });

  it("should identify missing entities in issues", () => {
    const citation = {
      text: "4857 sayılı İş Kanunu madde 17 iş güvencesi sağlar.",
      sourceUri: "https://example.com/is-kanunu",
      sourceTitle: "İş Kanunu",
    };
    const sourceContent = "İş ilişkisi sözleşme ile kurulur.";

    const result = verifyCitation(citation, sourceContent);

    expect(result.issues.length).toBeGreaterThan(0);
  });
});

describe("verifyResponse", () => {
  it("should verify multiple citations", () => {
    const responseText = "madde 5 uyarınca ve madde 10 gereğince işlem yapılır.";
    const citations = [
      {
        text: "madde 5 uyarınca",
        sourceUri: "https://example.com/1",
        sourceTitle: "Kaynak 1",
      },
      {
        text: "madde 10 gereğince",
        sourceUri: "https://example.com/2",
        sourceTitle: "Kaynak 2",
      },
    ];

    const sourceContents = new Map([
      ["https://example.com/1", "madde 5 uyarınca işlem yapılır"],
      ["https://example.com/2", "madde 10 gereğince düzenleme yapılmıştır"],
    ]);

    const result = verifyResponse(responseText, citations, sourceContents);

    expect(result.totalCitations).toBe(2);
    expect(result.citationResults.length).toBe(2);
  });

  it("should handle missing source content gracefully", () => {
    const responseText = "madde 5 uyarınca işlem yapılır.";
    const citations = [
      {
        text: "madde 5 uyarınca",
        sourceUri: "https://example.com/missing",
        sourceTitle: "Kaynak",
      },
    ];

    const sourceContents = new Map<string, string>();

    const result = verifyResponse(responseText, citations, sourceContents);

    expect(result.totalCitations).toBe(1);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.citationResults[0].verification.isValid).toBe(false);
  });

  it("should calculate overall confidence correctly", () => {
    const responseText = "madde 5 uyarınca işlem yapılır.";
    const citations = [
      {
        text: "madde 5 uyarınca",
        sourceUri: "https://example.com/1",
        sourceTitle: "Kaynak 1",
      },
    ];

    const sourceContents = new Map([
      ["https://example.com/1", "madde 5 uyarınca işlem yapılır ve düzenlenir"],
    ]);

    const result = verifyResponse(responseText, citations, sourceContents);

    expect(result.overallConfidence).toBeGreaterThan(0);
    expect(result.overallConfidence).toBeLessThanOrEqual(1);
  });

  it("should return low risk for high confidence results", () => {
    const responseText = "madde 5 uyarınca kişisel veriler işlenir.";
    const citations = [
      {
        text: "madde 5 uyarınca kişisel veriler işlenir",
        sourceUri: "https://example.com/1",
        sourceTitle: "KVKK",
      },
    ];

    const sourceContents = new Map([
      [
        "https://example.com/1",
        "6698 sayılı Kanun madde 5 uyarınca kişisel veriler işlenebilir hükmü bulunmaktadır.",
      ],
    ]);

    const result = verifyResponse(responseText, citations, sourceContents);

    // Should not be high risk when there's good match
    expect(["low", "medium"]).toContain(result.riskLevel);
  });
});

describe("getVerificationBadge", () => {
  it("should return green badge for high confidence", () => {
    const badge = getVerificationBadge(0.85);

    expect(badge.color).toBe("green");
    expect(badge.label).toContain("Yüksek");
  });

  it("should return yellow badge for medium confidence", () => {
    const badge = getVerificationBadge(0.65);

    expect(badge.color).toBe("yellow");
    expect(badge.label).toContain("Orta");
  });

  it("should return orange badge for low confidence", () => {
    const badge = getVerificationBadge(0.45);

    expect(badge.color).toBe("orange");
    expect(badge.label).toContain("Düşük");
  });

  it("should return red badge for very low confidence", () => {
    const badge = getVerificationBadge(0.2);

    expect(badge.color).toBe("red");
    expect(badge.label).toContain("Doğrulama");
  });

  it("should handle edge cases", () => {
    expect(getVerificationBadge(1).color).toBe("green");
    expect(getVerificationBadge(0).color).toBe("red");
    expect(getVerificationBadge(0.8).color).toBe("green");
    expect(getVerificationBadge(0.6).color).toBe("yellow");
    expect(getVerificationBadge(0.4).color).toBe("orange");
  });
});
