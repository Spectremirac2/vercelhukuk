/**
 * Tests for Case Prediction Library
 * @vitest-environment node
 */

import { describe, it, expect } from "vitest";
import {
  predictOutcome,
  analyzeCaseStrength,
  getCaseTypeStats,
  compareCaseScenarios,
  CaseFacts,
} from "@/lib/case-prediction";

describe("predictOutcome", () => {
  it("should predict outcome for alacak case", () => {
    const facts: CaseFacts = {
      caseType: "alacak",
      legalArea: "borclar",
      facts: ["Alacak belgesi mevcut", "Ödeme emri gönderildi"],
      parties: {
        plaintiff: { type: "gercek_kisi", hasLawyer: true },
        defendant: { type: "gercek_kisi", hasLawyer: false },
      },
      timeline: [],
      evidence: [{ type: "yazili", description: "Senet", strength: 0.8 }],
    };

    const result = predictOutcome(facts);

    expect(result).not.toBeNull();
    expect(result.outcome).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.probabilities).toBeDefined();
  });

  it("should predict outcome for ise_iade case", () => {
    const facts: CaseFacts = {
      caseType: "ise_iade",
      legalArea: "is_hukuku",
      facts: ["Haksız fesih iddiası", "6 ay çalışma süresi"],
      parties: {
        plaintiff: { type: "gercek_kisi", hasLawyer: true },
        defendant: { type: "tuzel_kisi", hasLawyer: true },
      },
      timeline: [],
      evidence: [{ type: "yazili", description: "İş sözleşmesi", strength: 0.7 }],
    };

    const result = predictOutcome(facts);

    expect(result).not.toBeNull();
    expect(result.riskAssessment).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThanOrEqual(0);
  });

  it("should predict outcome for bosanma case", () => {
    const facts: CaseFacts = {
      caseType: "bosanma",
      legalArea: "aile",
      facts: ["Şiddetli geçimsizlik", "3 yıllık evlilik"],
      parties: {
        plaintiff: { type: "gercek_kisi", hasLawyer: true },
        defendant: { type: "gercek_kisi", hasLawyer: false },
      },
      timeline: [],
      evidence: [{ type: "tanik", description: "Tanık ifadesi", strength: 0.6 }],
    };

    const result = predictOutcome(facts);

    expect(result).not.toBeNull();
    expect(result.riskAssessment.timeEstimate).toBeDefined();
  });

  it("should include disclaimer in prediction", () => {
    const facts: CaseFacts = {
      caseType: "tazminat",
      legalArea: "borclar",
      facts: ["Zarar oluşmuş"],
      parties: {
        plaintiff: { type: "gercek_kisi", hasLawyer: false },
        defendant: { type: "gercek_kisi", hasLawyer: false },
      },
      timeline: [],
      evidence: [],
    };

    const result = predictOutcome(facts);

    expect(result.disclaimer).toBeDefined();
    expect(result.disclaimer.length).toBeGreaterThan(0);
  });
});

describe("analyzeCaseStrength", () => {
  it("should analyze case with strong evidence", () => {
    const facts: CaseFacts = {
      caseType: "tazminat",
      legalArea: "borclar",
      facts: ["Belgelenmiş zarar", "Tanık ifadeleri mevcut"],
      parties: {
        plaintiff: { type: "gercek_kisi", hasLawyer: true },
        defendant: { type: "gercek_kisi", hasLawyer: false },
      },
      timeline: [],
      evidence: [
        { type: "yazili", description: "Belge", strength: 0.9 },
        { type: "tanik", description: "Tanık", strength: 0.8 },
      ],
    };

    const result = analyzeCaseStrength(facts);

    expect(result.strengthScore).toBeGreaterThan(0);
    expect(result.strengthLevel).toMatch(/^(weak|moderate|strong)$/);
  });

  it("should identify weaknesses in case", () => {
    const facts: CaseFacts = {
      caseType: "alacak",
      legalArea: "borclar",
      facts: ["Sözlü anlaşma"],
      parties: {
        plaintiff: { type: "gercek_kisi", hasLawyer: false },
        defendant: { type: "gercek_kisi", hasLawyer: true },
      },
      timeline: [],
      evidence: [{ type: "tanik", description: "Tanık", strength: 0.3 }],
    };

    const result = analyzeCaseStrength(facts);

    expect(result.strengthLevel).toBeDefined();
    expect(result.weaknesses).toBeDefined();
  });
});

describe("getCaseTypeStats", () => {
  it("should return stats for alacak cases", () => {
    const stats = getCaseTypeStats("alacak");

    expect(stats).not.toBeNull();
    expect(stats.acceptanceRate).toBeGreaterThan(0);
    expect(stats.avgDuration).toBeDefined();
    expect(stats.commonFactors.length).toBeGreaterThan(0);
  });

  it("should return stats for ise_iade cases", () => {
    const stats = getCaseTypeStats("ise_iade");

    expect(stats).not.toBeNull();
    expect(stats.commonFactors.length).toBeGreaterThan(0);
  });

  it("should return stats for bosanma cases", () => {
    const stats = getCaseTypeStats("bosanma");

    expect(stats).not.toBeNull();
    expect(stats.acceptanceRate).toBeGreaterThan(0);
  });
});

describe("compareCaseScenarios", () => {
  it("should compare two scenarios", () => {
    const scenario1: CaseFacts = {
      caseType: "alacak",
      legalArea: "borclar",
      facts: ["Senet mevcut"],
      parties: {
        plaintiff: { type: "gercek_kisi", hasLawyer: true },
        defendant: { type: "gercek_kisi", hasLawyer: false },
      },
      timeline: [],
      evidence: [{ type: "yazili", description: "Senet", strength: 0.8 }],
    };

    const scenario2: CaseFacts = {
      caseType: "alacak",
      legalArea: "borclar",
      facts: ["Sözlü anlaşma"],
      parties: {
        plaintiff: { type: "gercek_kisi", hasLawyer: false },
        defendant: { type: "gercek_kisi", hasLawyer: false },
      },
      timeline: [],
      evidence: [{ type: "tanik", description: "Tanık", strength: 0.4 }],
    };

    const comparison = compareCaseScenarios(scenario1, scenario2);

    expect(comparison.scenario1Prediction).toBeDefined();
    expect(comparison.scenario2Prediction).toBeDefined();
    expect([1, 2]).toContain(comparison.comparison.betterScenario);
    expect(comparison.comparison.winProbabilityDiff).toBeGreaterThanOrEqual(0);
  });
});
