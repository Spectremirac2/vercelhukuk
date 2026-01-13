/**
 * Tests for Court Fees Library
 * @vitest-environment node
 */

import { describe, it, expect } from "vitest";
import {
  calculateFees,
  calculateIcraFees,
  getCaseTypes,
  getCaseTypeName,
  formatCurrency,
  isExemptFromFees,
  getFeeExemptions,
  calculateTotalCostEstimate,
  getFeeSummary,
} from "@/lib/court-fees";

describe("calculateFees", () => {
  it("should calculate fees for hukuk_genel case", () => {
    const result = calculateFees("hukuk_genel", 100000);

    expect(result.caseType).toBe("hukuk_genel");
    expect(result.claimAmount).toBe(100000);
    expect(result.fees.length).toBeGreaterThan(0);
    expect(result.totalFees).toBeGreaterThan(0);
  });

  it("should include başvuru harcı", () => {
    const result = calculateFees("hukuk_genel", 50000);
    const basvuruHarci = result.fees.find((f) => f.type === "basvuru");

    expect(basvuruHarci).toBeDefined();
    expect(basvuruHarci?.amount).toBeGreaterThan(0);
  });

  it("should include karar ve ilam harcı for cases with claim amount", () => {
    const result = calculateFees("ticaret", 200000);
    const kararHarci = result.fees.find((f) => f.type === "karar_ilam");

    expect(kararHarci).toBeDefined();
    expect(kararHarci?.amount).toBeGreaterThan(0);
  });

  it("should include tebligat masrafı", () => {
    const result = calculateFees("hukuk_genel", 50000);
    const tebligat = result.fees.find((f) => f.type === "tebligat");

    expect(tebligat).toBeDefined();
    expect(tebligat?.amount).toBeGreaterThan(0);
  });

  it("should note exemption for tüketici cases", () => {
    const result = calculateFees("tüketici", 50000);

    // Tüketici davalarında harç muafiyeti not olarak eklenir
    expect(result.notes.some((n) => n.toLowerCase().includes("muaf") || n.toLowerCase().includes("tüketici"))).toBe(true);
  });

  it("should include temyiz harcı when requested", () => {
    const result = calculateFees("hukuk_genel", 100000, { includeTemyiz: true });
    const temyizHarci = result.fees.find((f) => f.type === "temyiz");

    expect(temyizHarci).toBeDefined();
    expect(temyizHarci?.amount).toBeGreaterThan(0);
  });

  it("should include keşif masrafı when requested", () => {
    const result = calculateFees("aile", 0, { includeKeşif: true });
    const kesif = result.fees.find((f) => f.type === "keşif");

    expect(kesif).toBeDefined();
    expect(kesif?.amount).toBeGreaterThan(0);
  });

  it("should include bilirkişi ücreti when requested", () => {
    const result = calculateFees("is", 100000, { includeBilirkişi: true });
    const bilirkisi = result.fees.find((f) => f.type === "bilirkişi");

    expect(bilirkisi).toBeDefined();
    expect(bilirkisi?.amount).toBeGreaterThan(0);
  });

  it("should include tanık masrafı when count provided", () => {
    const result = calculateFees("hukuk_genel", 50000, { tanıkSayısı: 3 });
    const tanik = result.fees.find((f) => f.type === "tanık");

    expect(tanik).toBeDefined();
    expect(tanik?.name).toContain("3 tanık");
  });
});

describe("calculateIcraFees", () => {
  it("should calculate icra takip fees", () => {
    const result = calculateIcraFees(100000);

    expect(result.caseType).toBe("icra");
    expect(result.fees.length).toBeGreaterThan(0);
    expect(result.totalFees).toBeGreaterThan(0);
  });

  it("should include takip harcı", () => {
    const result = calculateIcraFees(50000);
    const takipHarci = result.fees.find((f) => f.name.includes("Takip"));

    expect(takipHarci).toBeDefined();
  });

  it("should include haciz harcı when requested", () => {
    const result = calculateIcraFees(100000, { includeHaciz: true });
    const haciz = result.fees.find((f) => f.type === "haciz");

    expect(haciz).toBeDefined();
    expect(haciz?.amount).toBeGreaterThan(0);
  });

  it("should include satış talebi when requested", () => {
    const result = calculateIcraFees(100000, { includeSatış: true });
    const satis = result.fees.find((f) => f.type === "satış");

    expect(satis).toBeDefined();
  });

  it("should include tahsil harcı", () => {
    const result = calculateIcraFees(100000);
    const tahsil = result.fees.find((f) => f.name.includes("Tahsil"));

    expect(tahsil).toBeDefined();
    expect(tahsil?.amount).toBeGreaterThan(0);
  });
});

describe("getCaseTypes", () => {
  it("should return all case types", () => {
    const types = getCaseTypes();
    expect(types.length).toBeGreaterThan(0);
  });

  it("should have id and name for each type", () => {
    const types = getCaseTypes();
    types.forEach((t) => {
      expect(t.id).toBeDefined();
      expect(t.name).toBeDefined();
    });
  });
});

describe("getCaseTypeName", () => {
  it("should return correct name for case types", () => {
    expect(getCaseTypeName("hukuk_genel")).toContain("Hukuk");
    expect(getCaseTypeName("is")).toContain("İş");
    expect(getCaseTypeName("aile")).toContain("Aile");
    expect(getCaseTypeName("icra")).toContain("İcra");
  });
});

describe("formatCurrency", () => {
  it("should format currency in Turkish Lira", () => {
    const formatted = formatCurrency(12345.67);
    expect(formatted).toContain("12.345");
    // Turkish locale may use ₺ or TL symbol
    expect(formatted.includes("TL") || formatted.includes("₺")).toBe(true);
  });

  it("should format 0 correctly", () => {
    const formatted = formatCurrency(0);
    expect(formatted).toContain("0");
  });
});

describe("isExemptFromFees", () => {
  it("should return true for tüketici cases", () => {
    expect(isExemptFromFees("tüketici")).toBe(true);
  });

  it("should return false for other case types", () => {
    expect(isExemptFromFees("hukuk_genel")).toBe(false);
    expect(isExemptFromFees("ticaret")).toBe(false);
    expect(isExemptFromFees("is")).toBe(false);
  });
});

describe("getFeeExemptions", () => {
  it("should return fee exemptions", () => {
    const exemptions = getFeeExemptions();
    expect(exemptions.length).toBeGreaterThan(0);
  });

  it("should have description and legal basis", () => {
    const exemptions = getFeeExemptions();
    exemptions.forEach((ex) => {
      expect(ex.description).toBeDefined();
      expect(ex.legalBasis).toBeDefined();
    });
  });
});

describe("calculateTotalCostEstimate", () => {
  it("should calculate total cost estimate", () => {
    const estimate = calculateTotalCostEstimate("hukuk_genel", 100000);

    expect(estimate.harclar).toBeGreaterThan(0);
    expect(estimate.masraflar).toBeGreaterThanOrEqual(0);
    expect(estimate.avukatUcreti).toBeGreaterThan(0);
    expect(estimate.toplam).toBeGreaterThan(0);
    expect(estimate.sure).toBeDefined();
  });

  it("should include longer duration for istinaf", () => {
    const withoutIstinaf = calculateTotalCostEstimate("hukuk_genel", 100000);
    const withIstinaf = calculateTotalCostEstimate("hukuk_genel", 100000, {
      istinafOlasiligi: true,
    });

    expect(withIstinaf.sure).not.toBe(withoutIstinaf.sure);
  });

  it("should use custom avukat ücreti when provided", () => {
    const estimate = calculateTotalCostEstimate("hukuk_genel", 100000, {
      avukatUcreti: 25000,
    });

    expect(estimate.avukatUcreti).toBe(25000);
  });
});

describe("getFeeSummary", () => {
  it("should return fee summary for different case types", () => {
    const summary = getFeeSummary(100000);

    expect(summary.length).toBeGreaterThan(0);
    summary.forEach((item) => {
      expect(item.caseType).toBeDefined();
      expect(item.name).toBeDefined();
      expect(typeof item.estimatedFees).toBe("number");
      expect(typeof item.isExempt).toBe("boolean");
    });
  });

  it("should mark tüketici as exempt", () => {
    const summary = getFeeSummary(50000);
    const tuketici = summary.find((s) => s.caseType === "tüketici");

    expect(tuketici?.isExempt).toBe(true);
  });
});
