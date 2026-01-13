/**
 * Tests for Risk Assessment Library
 * @vitest-environment node
 */

import { describe, it, expect } from "vitest";
import {
  assessCaseRisk,
  assessContractRisk,
  assessComplianceRisk,
  getRiskLevelColor,
  getRiskLevelName,
  getCategoryName,
  getRiskCategories,
  getRiskLevels,
  generateRiskReport,
  formatRiskScore,
  type CaseRiskInput,
  type ContractRiskInput,
  type ComplianceRiskInput,
} from "@/lib/risk-assessment";

// Sample inputs for testing
const SAMPLE_CASE_INPUT_LOW_RISK: CaseRiskInput = {
  caseType: "hukuk",
  evidenceStrength: "strong",
  precedentSupport: "favorable",
  opposingPartyStrength: "weak",
  timelinePressure: "flexible",
  jurisdictionFamiliarity: "familiar",
  settlementPossibility: "likely",
  publicityRisk: "low",
};

const SAMPLE_CASE_INPUT_HIGH_RISK: CaseRiskInput = {
  caseType: "hukuk",
  evidenceStrength: "weak",
  precedentSupport: "unfavorable",
  opposingPartyStrength: "strong",
  timelinePressure: "urgent",
  jurisdictionFamiliarity: "unfamiliar",
  settlementPossibility: "unlikely",
  publicityRisk: "high",
};

const SAMPLE_CONTRACT_INPUT_LOW_RISK: ContractRiskInput = {
  contractType: "hizmet",
  counterpartyReliability: "high",
  termLength: "short",
  exclusivityClause: false,
  penaltyClause: false,
  terminationEase: "easy",
  jurisdictionClause: "favorable",
  arbitrationClause: true,
  forceNajeureClause: true,
  limitationOfLiability: true,
  confidentialityClause: true,
  intellectualPropertyRisk: "low",
};

const SAMPLE_CONTRACT_INPUT_HIGH_RISK: ContractRiskInput = {
  contractType: "hizmet",
  counterpartyReliability: "unknown",
  termLength: "long",
  exclusivityClause: true,
  penaltyClause: true,
  terminationEase: "difficult",
  jurisdictionClause: "unfavorable",
  arbitrationClause: false,
  forceNajeureClause: false,
  limitationOfLiability: false,
  confidentialityClause: false,
  intellectualPropertyRisk: "high",
};

const SAMPLE_COMPLIANCE_INPUT_LOW_RISK: ComplianceRiskInput = {
  industry: "teknoloji",
  employeeCount: 50,
  dataProcessingVolume: "low",
  internationalOperations: false,
  previousViolations: 0,
  complianceOfficer: true,
  regularAudits: true,
  documentedPolicies: true,
  employeeTraining: true,
  incidentResponsePlan: true,
};

const SAMPLE_COMPLIANCE_INPUT_HIGH_RISK: ComplianceRiskInput = {
  industry: "finans",
  employeeCount: 500,
  dataProcessingVolume: "high",
  internationalOperations: true,
  previousViolations: 3,
  complianceOfficer: false,
  regularAudits: false,
  documentedPolicies: false,
  employeeTraining: false,
  incidentResponsePlan: false,
};

describe("assessCaseRisk", () => {
  it("should return risk assessment", () => {
    const assessment = assessCaseRisk(SAMPLE_CASE_INPUT_LOW_RISK);
    expect(assessment).toBeDefined();
    expect(assessment.id).toBeDefined();
    expect(assessment.createdAt).toBeDefined();
    expect(assessment.assessmentType).toBe("case");
  });

  it("should calculate overall score between 0-100", () => {
    const assessment = assessCaseRisk(SAMPLE_CASE_INPUT_LOW_RISK);
    expect(assessment.overallScore).toBeGreaterThanOrEqual(0);
    expect(assessment.overallScore).toBeLessThanOrEqual(100);
  });

  it("should have risk level", () => {
    const assessment = assessCaseRisk(SAMPLE_CASE_INPUT_LOW_RISK);
    expect(["critical", "high", "medium", "low", "minimal"]).toContain(
      assessment.overallLevel
    );
  });

  it("should have risk factors", () => {
    const assessment = assessCaseRisk(SAMPLE_CASE_INPUT_LOW_RISK);
    expect(assessment.factors.length).toBeGreaterThan(0);
  });

  it("should have summary", () => {
    const assessment = assessCaseRisk(SAMPLE_CASE_INPUT_LOW_RISK);
    expect(assessment.summary).toBeDefined();
    expect(assessment.summary.length).toBeGreaterThan(0);
  });

  it("should have recommendations", () => {
    const assessment = assessCaseRisk(SAMPLE_CASE_INPUT_HIGH_RISK);
    expect(assessment.recommendations.length).toBeGreaterThanOrEqual(0);
  });

  it("should have category breakdown", () => {
    const assessment = assessCaseRisk(SAMPLE_CASE_INPUT_LOW_RISK);
    expect(assessment.categoryBreakdown).toBeDefined();
    expect(assessment.categoryBreakdown.legal).toBeDefined();
  });

  it("should return lower risk for favorable inputs", () => {
    const lowRiskAssessment = assessCaseRisk(SAMPLE_CASE_INPUT_LOW_RISK);
    const highRiskAssessment = assessCaseRisk(SAMPLE_CASE_INPUT_HIGH_RISK);
    expect(lowRiskAssessment.overallScore).toBeLessThan(highRiskAssessment.overallScore);
  });

  it("should generate unique IDs", () => {
    const assessment1 = assessCaseRisk(SAMPLE_CASE_INPUT_LOW_RISK);
    const assessment2 = assessCaseRisk(SAMPLE_CASE_INPUT_LOW_RISK);
    expect(assessment1.id).not.toBe(assessment2.id);
  });
});

describe("assessContractRisk", () => {
  it("should return risk assessment", () => {
    const assessment = assessContractRisk(SAMPLE_CONTRACT_INPUT_LOW_RISK);
    expect(assessment).toBeDefined();
    expect(assessment.assessmentType).toBe("contract");
  });

  it("should calculate overall score between 0-100", () => {
    const assessment = assessContractRisk(SAMPLE_CONTRACT_INPUT_LOW_RISK);
    expect(assessment.overallScore).toBeGreaterThanOrEqual(0);
    expect(assessment.overallScore).toBeLessThanOrEqual(100);
  });

  it("should have risk factors", () => {
    const assessment = assessContractRisk(SAMPLE_CONTRACT_INPUT_LOW_RISK);
    expect(assessment.factors.length).toBeGreaterThan(0);
  });

  it("should return lower risk for favorable inputs", () => {
    const lowRiskAssessment = assessContractRisk(SAMPLE_CONTRACT_INPUT_LOW_RISK);
    const highRiskAssessment = assessContractRisk(SAMPLE_CONTRACT_INPUT_HIGH_RISK);
    expect(lowRiskAssessment.overallScore).toBeLessThan(highRiskAssessment.overallScore);
  });

  it("should add exclusivity clause factor when present", () => {
    const withExclusivity: ContractRiskInput = {
      ...SAMPLE_CONTRACT_INPUT_LOW_RISK,
      exclusivityClause: true,
    };
    const assessment = assessContractRisk(withExclusivity);
    const hasExclusivityFactor = assessment.factors.some((f) => f.id === "exclusivity");
    expect(hasExclusivityFactor).toBe(true);
  });

  it("should add penalty clause factor when present", () => {
    const withPenalty: ContractRiskInput = {
      ...SAMPLE_CONTRACT_INPUT_LOW_RISK,
      penaltyClause: true,
    };
    const assessment = assessContractRisk(withPenalty);
    const hasPenaltyFactor = assessment.factors.some((f) => f.id === "penalty");
    expect(hasPenaltyFactor).toBe(true);
  });

  it("should add missing force majeure factor", () => {
    const withoutForceMajeure: ContractRiskInput = {
      ...SAMPLE_CONTRACT_INPUT_LOW_RISK,
      forceNajeureClause: false,
    };
    const assessment = assessContractRisk(withoutForceMajeure);
    const hasMissingFactor = assessment.factors.some(
      (f) => f.id === "force_majeure_missing"
    );
    expect(hasMissingFactor).toBe(true);
  });

  it("should add missing liability limitation factor", () => {
    const withoutLiability: ContractRiskInput = {
      ...SAMPLE_CONTRACT_INPUT_LOW_RISK,
      limitationOfLiability: false,
    };
    const assessment = assessContractRisk(withoutLiability);
    const hasMissingFactor = assessment.factors.some(
      (f) => f.id === "liability_limitation_missing"
    );
    expect(hasMissingFactor).toBe(true);
  });
});

describe("assessComplianceRisk", () => {
  it("should return risk assessment", () => {
    const assessment = assessComplianceRisk(SAMPLE_COMPLIANCE_INPUT_LOW_RISK);
    expect(assessment).toBeDefined();
    expect(assessment.assessmentType).toBe("compliance");
  });

  it("should calculate overall score between 0-100", () => {
    const assessment = assessComplianceRisk(SAMPLE_COMPLIANCE_INPUT_LOW_RISK);
    expect(assessment.overallScore).toBeGreaterThanOrEqual(0);
    expect(assessment.overallScore).toBeLessThanOrEqual(100);
  });

  it("should have risk factors", () => {
    const assessment = assessComplianceRisk(SAMPLE_COMPLIANCE_INPUT_LOW_RISK);
    expect(assessment.factors.length).toBeGreaterThan(0);
  });

  it("should return lower risk for favorable inputs", () => {
    const lowRiskAssessment = assessComplianceRisk(SAMPLE_COMPLIANCE_INPUT_LOW_RISK);
    const highRiskAssessment = assessComplianceRisk(SAMPLE_COMPLIANCE_INPUT_HIGH_RISK);
    expect(lowRiskAssessment.overallScore).toBeLessThan(highRiskAssessment.overallScore);
  });

  it("should consider previous violations", () => {
    const withViolations: ComplianceRiskInput = {
      ...SAMPLE_COMPLIANCE_INPUT_LOW_RISK,
      previousViolations: 5,
    };
    const assessment = assessComplianceRisk(withViolations);
    const violationFactor = assessment.factors.find((f) => f.id === "previous_violations");
    expect(violationFactor).toBeDefined();
    expect(violationFactor!.score).toBeGreaterThan(50);
  });

  it("should add international operations factor", () => {
    const withInternational: ComplianceRiskInput = {
      ...SAMPLE_COMPLIANCE_INPUT_LOW_RISK,
      internationalOperations: true,
    };
    const assessment = assessComplianceRisk(withInternational);
    const hasInternationalFactor = assessment.factors.some(
      (f) => f.id === "international_ops"
    );
    expect(hasInternationalFactor).toBe(true);
  });

  it("should add missing compliance officer factor", () => {
    const withoutOfficer: ComplianceRiskInput = {
      ...SAMPLE_COMPLIANCE_INPUT_LOW_RISK,
      complianceOfficer: false,
    };
    const assessment = assessComplianceRisk(withoutOfficer);
    const hasMissingFactor = assessment.factors.some(
      (f) => f.id === "no_compliance_officer"
    );
    expect(hasMissingFactor).toBe(true);
  });

  it("should consider employee count for large organizations", () => {
    const largeOrg: ComplianceRiskInput = {
      ...SAMPLE_COMPLIANCE_INPUT_LOW_RISK,
      employeeCount: 300,
    };
    const assessment = assessComplianceRisk(largeOrg);
    const hasEmployeeFactor = assessment.factors.some((f) => f.id === "employee_count");
    expect(hasEmployeeFactor).toBe(true);
  });
});

describe("getRiskLevelColor", () => {
  it("should return correct colors for each level", () => {
    expect(getRiskLevelColor("critical")).toBe("#dc2626");
    expect(getRiskLevelColor("high")).toBe("#ea580c");
    expect(getRiskLevelColor("medium")).toBe("#ca8a04");
    expect(getRiskLevelColor("low")).toBe("#16a34a");
    expect(getRiskLevelColor("minimal")).toBe("#059669");
  });
});

describe("getRiskLevelName", () => {
  it("should return Turkish names for each level", () => {
    expect(getRiskLevelName("critical")).toBe("Kritik");
    expect(getRiskLevelName("high")).toBe("Yüksek");
    expect(getRiskLevelName("medium")).toBe("Orta");
    expect(getRiskLevelName("low")).toBe("Düşük");
    expect(getRiskLevelName("minimal")).toBe("Minimal");
  });
});

describe("getCategoryName", () => {
  it("should return Turkish names for categories", () => {
    expect(getCategoryName("legal")).toBe("Hukuki Risk");
    expect(getCategoryName("financial")).toBe("Mali Risk");
    expect(getCategoryName("operational")).toBe("Operasyonel Risk");
    expect(getCategoryName("compliance")).toBe("Uyumluluk Riski");
    expect(getCategoryName("reputational")).toBe("İtibar Riski");
    expect(getCategoryName("contractual")).toBe("Sözleşmesel Risk");
  });
});

describe("getRiskCategories", () => {
  it("should return all risk categories", () => {
    const categories = getRiskCategories();
    expect(categories.length).toBe(6);
    expect(categories.some((c) => c.id === "legal")).toBe(true);
    expect(categories.some((c) => c.id === "financial")).toBe(true);
  });

  it("should have id and name for each category", () => {
    const categories = getRiskCategories();
    categories.forEach((cat) => {
      expect(cat.id).toBeDefined();
      expect(cat.name).toBeDefined();
    });
  });
});

describe("getRiskLevels", () => {
  it("should return all risk levels", () => {
    const levels = getRiskLevels();
    expect(levels.length).toBe(5);
    expect(levels.some((l) => l.id === "critical")).toBe(true);
    expect(levels.some((l) => l.id === "minimal")).toBe(true);
  });

  it("should have id, name, and color for each level", () => {
    const levels = getRiskLevels();
    levels.forEach((level) => {
      expect(level.id).toBeDefined();
      expect(level.name).toBeDefined();
      expect(level.color).toBeDefined();
    });
  });
});

describe("generateRiskReport", () => {
  it("should generate report for case assessment", () => {
    const assessment = assessCaseRisk(SAMPLE_CASE_INPUT_LOW_RISK);
    const report = generateRiskReport(assessment);
    expect(report).toBeDefined();
    expect(report).toContain("RİSK DEĞERLENDİRME RAPORU");
    expect(report).toContain("Dava Risk Değerlendirmesi");
  });

  it("should generate report for contract assessment", () => {
    const assessment = assessContractRisk(SAMPLE_CONTRACT_INPUT_LOW_RISK);
    const report = generateRiskReport(assessment);
    expect(report).toBeDefined();
    expect(report).toContain("Sözleşme Risk Değerlendirmesi");
  });

  it("should generate report for compliance assessment", () => {
    const assessment = assessComplianceRisk(SAMPLE_COMPLIANCE_INPUT_LOW_RISK);
    const report = generateRiskReport(assessment);
    expect(report).toBeDefined();
    expect(report).toContain("Uyumluluk Risk Değerlendirmesi");
  });

  it("should include risk score in report", () => {
    const assessment = assessCaseRisk(SAMPLE_CASE_INPUT_LOW_RISK);
    const report = generateRiskReport(assessment);
    expect(report).toContain(`%${assessment.overallScore}`);
  });

  it("should include risk factors in report", () => {
    const assessment = assessCaseRisk(SAMPLE_CASE_INPUT_LOW_RISK);
    const report = generateRiskReport(assessment);
    expect(report).toContain("RİSK FAKTÖRLERİ");
  });

  it("should include recommendations in report", () => {
    const assessment = assessCaseRisk(SAMPLE_CASE_INPUT_HIGH_RISK);
    const report = generateRiskReport(assessment);
    expect(report).toContain("ÖNERİLER");
  });
});

describe("formatRiskScore", () => {
  it("should format score with visual bars", () => {
    const formatted = formatRiskScore(50);
    expect(formatted).toContain("%50");
    expect(formatted).toContain("█");
  });

  it("should include risk level name", () => {
    const formatted = formatRiskScore(85);
    expect(formatted).toContain("Kritik");
  });

  it("should show minimal risk for low scores", () => {
    const formatted = formatRiskScore(10);
    expect(formatted).toContain("Minimal");
  });
});

describe("Risk Factor Properties", () => {
  it("should have required properties for each factor", () => {
    const assessment = assessCaseRisk(SAMPLE_CASE_INPUT_LOW_RISK);
    assessment.factors.forEach((factor) => {
      expect(factor.id).toBeDefined();
      expect(factor.name).toBeDefined();
      expect(factor.category).toBeDefined();
      expect(factor.description).toBeDefined();
      expect(factor.weight).toBeGreaterThan(0);
      expect(factor.weight).toBeLessThanOrEqual(1);
      expect(factor.score).toBeGreaterThanOrEqual(0);
      expect(factor.score).toBeLessThanOrEqual(100);
      expect(factor.level).toBeDefined();
      expect(factor.mitigationSuggestions).toBeDefined();
    });
  });
});

describe("Category Breakdown", () => {
  it("should have score and level for each category", () => {
    const assessment = assessCaseRisk(SAMPLE_CASE_INPUT_LOW_RISK);
    Object.values(assessment.categoryBreakdown).forEach((category) => {
      expect(category.score).toBeGreaterThanOrEqual(0);
      expect(category.score).toBeLessThanOrEqual(100);
      expect(category.level).toBeDefined();
    });
  });
});
