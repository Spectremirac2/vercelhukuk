/**
 * Smart Contract Legal Analyzer
 *
 * Analyzes blockchain smart contracts from a legal perspective:
 * - Legal compliance verification
 * - Turkish law compatibility assessment
 * - Consumer protection analysis
 * - KVKK (data protection) compliance for on-chain data
 * - Risk identification for decentralized agreements
 *
 * Based on 2025-2026 research on smart contract regulation and legal frameworks.
 */

export type BlockchainPlatform =
  | "ethereum"
  | "polygon"
  | "bsc"
  | "avalanche"
  | "solana"
  | "arbitrum"
  | "optimism"
  | "private";

export type ContractType =
  | "token"
  | "nft"
  | "defi"
  | "dao"
  | "escrow"
  | "multisig"
  | "vesting"
  | "staking"
  | "marketplace"
  | "loan"
  | "insurance"
  | "supply_chain"
  | "identity"
  | "other";

export type LegalIssueCategory =
  | "tuketici_koruma"
  | "finansal_duzenleme"
  | "veri_koruma"
  | "sozlesme_hukuku"
  | "vergi"
  | "aklanma_karsi"
  | "menkul_kiymet"
  | "fikri_mulkiyet"
  | "yetki_alani"
  | "uygulanabilirlik";

export type IssueSeverity = "kritik" | "yuksek" | "orta" | "dusuk" | "bilgilendirme";

export interface SmartContractInfo {
  address?: string;
  platform: BlockchainPlatform;
  contractType: ContractType;
  sourceCode?: string;
  abi?: ContractABI;
  bytecode?: string;
  name?: string;
  version?: string;
  compiler?: string;
  deployedAt?: Date;
  verified: boolean;
}

export interface ContractABI {
  functions: ContractFunction[];
  events: ContractEvent[];
  modifiers: string[];
}

export interface ContractFunction {
  name: string;
  type: "function" | "constructor" | "fallback" | "receive";
  visibility: "public" | "external" | "internal" | "private";
  stateMutability: "pure" | "view" | "payable" | "nonpayable";
  inputs: Array<{ name: string; type: string }>;
  outputs: Array<{ name: string; type: string }>;
}

export interface ContractEvent {
  name: string;
  inputs: Array<{ name: string; type: string; indexed: boolean }>;
}

export interface LegalIssue {
  id: string;
  category: LegalIssueCategory;
  severity: IssueSeverity;
  title: string;
  description: string;
  affectedCode?: string;
  legalReference: string;
  turkishLawReference?: string;
  recommendation: string;
  riskScore: number; // 0-100
}

export interface RegulatoryClassification {
  isSecurityToken: boolean;
  isPaymentToken: boolean;
  isUtilityToken: boolean;
  requiresLicense: boolean;
  applicableRegulations: string[];
  jurisdictionNotes: string[];
}

export interface SmartContractAnalysisResult {
  id: string;
  contractInfo: SmartContractInfo;
  analyzedAt: Date;
  overallRiskScore: number;
  overallStatus: "uyumlu" | "riskli" | "kritik_riskli" | "belirsiz";
  issues: LegalIssue[];
  regulatoryClassification: RegulatoryClassification;
  consumerProtectionAnalysis: ConsumerProtectionAnalysis;
  dataProtectionAnalysis: DataProtectionAnalysis;
  contractLawAnalysis: ContractLawAnalysis;
  recommendations: string[];
  requiredActions: RequiredLegalAction[];
  disclaimer: string;
  processingTimeMs: number;
}

export interface ConsumerProtectionAnalysis {
  isB2C: boolean;
  hasWithdrawalRight: boolean;
  hasTransparency: boolean;
  unfairTermsFound: UnfairTerm[];
  consumerRisks: string[];
  compliance: "uyumlu" | "kismen_uyumlu" | "uyumsuz" | "uygulanamaz";
}

export interface UnfairTerm {
  description: string;
  location: string;
  legalBasis: string;
  severity: IssueSeverity;
}

export interface DataProtectionAnalysis {
  collectsPersonalData: boolean;
  dataTypes: string[];
  onChainData: boolean;
  kvkkCompliance: "uyumlu" | "kismen_uyumlu" | "uyumsuz" | "uygulanamaz";
  issues: string[];
  recommendations: string[];
}

export interface ContractLawAnalysis {
  hasOffer: boolean;
  hasAcceptance: boolean;
  hasConsideration: boolean;
  hasCapacity: boolean;
  hasLegality: boolean;
  isEnforceable: "evet" | "hayir" | "belirsiz";
  enforcementChallenges: string[];
  jurisdictionIssues: string[];
}

export interface RequiredLegalAction {
  id: string;
  priority: "acil" | "yuksek" | "orta" | "dusuk";
  action: string;
  description: string;
  deadline?: string;
  legalBasis: string;
}

// Turkish Financial Regulations for Crypto/Blockchain
const TURKISH_CRYPTO_REGULATIONS = {
  // TCMB Decision (2021) - Crypto payment ban
  tcmb_2021: {
    title: "TCMB Kripto Ödeme Yasağı",
    date: "2021-04-16",
    description: "Kripto varlıkların ödeme aracı olarak kullanılması yasaklandı",
    reference: "TCMB Yönetmelik 2021/1",
  },
  // SPK Regulations
  spk_token: {
    title: "SPK Menkul Kıymet Değerlendirmesi",
    description: "Token türünün menkul kıymet sayılıp sayılmayacağı değerlendirmesi",
    reference: "6362 sayılı SPKn",
  },
  // MASAK AML Requirements
  masak_aml: {
    title: "MASAK Kara Para Aklamayı Önleme",
    description: "Kripto varlık hizmet sağlayıcıları için AML gereklilikleri",
    reference: "5549 sayılı Kanun",
  },
  // 2024 Crypto Regulation Draft
  crypto_regulation_2024: {
    title: "Kripto Varlık Düzenlemesi (2024)",
    description: "Kripto varlık hizmet sağlayıcılarının lisanslanması",
    reference: "Kripto Varlık Kanun Taslağı",
  },
};

// Smart Contract Legal Patterns
const LEGAL_PATTERNS = {
  // Payment functions
  payment: {
    functions: ["transfer", "transferFrom", "send", "withdraw", "deposit", "pay"],
    issue: "Ödeme işlevi - TCMB kripto ödeme kısıtlaması kontrol edilmeli",
  },
  // Token minting/burning
  tokenControl: {
    functions: ["mint", "burn", "pause", "unpause", "blacklist", "freeze"],
    issue: "Token kontrol fonksiyonları - Merkezi kontrol riski",
  },
  // Ownership
  ownership: {
    functions: ["transferOwnership", "renounceOwnership", "setOwner"],
    issue: "Sahiplik transferi - Yönetim riski",
  },
  // Fee extraction
  fees: {
    patterns: ["fee", "tax", "royalty", "commission"],
    issue: "Ücret mekanizması - Vergi ve tüketici hukuku değerlendirmesi",
  },
  // Upgradability
  upgradability: {
    patterns: ["proxy", "upgrade", "implementation", "beacon"],
    issue: "Güncellenebilir sözleşme - Tek taraflı değişiklik riski",
  },
};

// Consumer Protection Patterns
const CONSUMER_PROTECTION_PATTERNS = {
  noWithdrawal: {
    patterns: ["noRefund", "nonRefundable", "finalSale"],
    issue: "Cayma hakkı kısıtlaması - TKHK m.48 ihlali olabilir",
  },
  unilateralChange: {
    patterns: ["changeTerms", "updateRules", "modifyConditions"],
    issue: "Tek taraflı değişiklik hakkı - Haksız şart riski",
  },
  limitedLiability: {
    patterns: ["noLiability", "asIs", "noWarranty"],
    issue: "Sorumluluk reddi - Tüketici haklarını kısıtlayamaz",
  },
};

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Analyze smart contract for legal compliance
 */
export function analyzeSmartContract(
  contractInfo: SmartContractInfo,
  options: {
    includeConsumerProtection?: boolean;
    includeDataProtection?: boolean;
    includeSecuritiesAnalysis?: boolean;
    jurisdiction?: "TR" | "EU" | "US";
  } = {}
): SmartContractAnalysisResult {
  const startTime = Date.now();
  const issues: LegalIssue[] = [];
  const recommendations: string[] = [];
  const requiredActions: RequiredLegalAction[] = [];

  // Default options
  const {
    includeConsumerProtection = true,
    includeDataProtection = true,
    includeSecuritiesAnalysis = true,
    jurisdiction = "TR",
  } = options;

  // Analyze contract functions if ABI available
  if (contractInfo.abi) {
    const functionIssues = analyzeFunctions(contractInfo.abi.functions);
    issues.push(...functionIssues);
  }

  // Analyze source code if available
  if (contractInfo.sourceCode) {
    const codeIssues = analyzeSourceCode(contractInfo.sourceCode);
    issues.push(...codeIssues);
  }

  // Regulatory classification
  const regulatoryClassification = classifyToken(contractInfo);

  // Consumer protection analysis
  const consumerProtectionAnalysis = includeConsumerProtection
    ? analyzeConsumerProtection(contractInfo)
    : createEmptyConsumerProtection();

  // Data protection analysis
  const dataProtectionAnalysis = includeDataProtection
    ? analyzeDataProtection(contractInfo)
    : createEmptyDataProtection();

  // Contract law analysis
  const contractLawAnalysis = analyzeContractLaw(contractInfo);

  // Securities law analysis
  if (includeSecuritiesAnalysis && regulatoryClassification.isSecurityToken) {
    const securitiesIssues = analyzeSecuritiesLaw(contractInfo, jurisdiction);
    issues.push(...securitiesIssues);
  }

  // Calculate overall risk score
  const overallRiskScore = calculateOverallRisk(issues);

  // Determine overall status
  let overallStatus: "uyumlu" | "riskli" | "kritik_riskli" | "belirsiz";
  if (issues.some((i) => i.severity === "kritik")) {
    overallStatus = "kritik_riskli";
  } else if (overallRiskScore > 60) {
    overallStatus = "riskli";
  } else if (overallRiskScore > 30) {
    overallStatus = "belirsiz";
  } else {
    overallStatus = "uyumlu";
  }

  // Generate recommendations
  for (const issue of issues) {
    if (!recommendations.includes(issue.recommendation)) {
      recommendations.push(issue.recommendation);
    }

    // Create required actions for critical/high issues
    if (issue.severity === "kritik" || issue.severity === "yuksek") {
      requiredActions.push({
        id: generateId("action"),
        priority: issue.severity === "kritik" ? "acil" : "yuksek",
        action: issue.title,
        description: issue.recommendation,
        deadline: issue.severity === "kritik" ? "Derhal" : "30 gün",
        legalBasis: issue.legalReference,
      });
    }
  }

  return {
    id: generateId("analysis"),
    contractInfo,
    analyzedAt: new Date(),
    overallRiskScore,
    overallStatus,
    issues,
    regulatoryClassification,
    consumerProtectionAnalysis,
    dataProtectionAnalysis,
    contractLawAnalysis,
    recommendations,
    requiredActions,
    disclaimer: generateDisclaimer(),
    processingTimeMs: Date.now() - startTime,
  };
}

/**
 * Analyze contract functions for legal issues
 */
function analyzeFunctions(functions: ContractFunction[]): LegalIssue[] {
  const issues: LegalIssue[] = [];

  for (const func of functions) {
    const funcName = func.name.toLowerCase();

    // Check payment patterns
    for (const paymentFunc of LEGAL_PATTERNS.payment.functions) {
      if (funcName.includes(paymentFunc.toLowerCase())) {
        issues.push({
          id: generateId("issue"),
          category: "finansal_duzenleme",
          severity: "yuksek",
          title: `Ödeme Fonksiyonu Tespit Edildi: ${func.name}`,
          description: "Bu fonksiyon ödeme işlevi içeriyor. Türkiye'de kripto varlıklarla ödeme yapılması TCMB tarafından kısıtlanmıştır.",
          affectedCode: func.name,
          legalReference: "TCMB Yönetmelik 2021/1",
          turkishLawReference: "TCMB 16.04.2021 tarihli Yönetmelik",
          recommendation: "Ödeme fonksiyonlarının Türkiye'de kullanılması durumunda hukuki risk değerlendirmesi yapılmalıdır.",
          riskScore: 70,
        });
      }
    }

    // Check centralized control patterns
    for (const controlFunc of LEGAL_PATTERNS.tokenControl.functions) {
      if (funcName.includes(controlFunc.toLowerCase())) {
        issues.push({
          id: generateId("issue"),
          category: "sozlesme_hukuku",
          severity: "orta",
          title: `Merkezi Kontrol Fonksiyonu: ${func.name}`,
          description: "Bu fonksiyon merkezi kontrol sağlıyor. Tek taraflı değişiklik veya dondurma riski mevcut.",
          affectedCode: func.name,
          legalReference: "TBK m.20-25 (Genel İşlem Koşulları)",
          turkishLawReference: "6098 sayılı TBK",
          recommendation: "Merkezi kontrol fonksiyonlarının kullanım koşulları şeffaf biçimde açıklanmalıdır.",
          riskScore: 50,
        });
      }
    }

    // Check ownership transfer
    if (funcName.includes("transferownership") || funcName.includes("renounceownership")) {
      issues.push({
        id: generateId("issue"),
        category: "yetki_alani",
        severity: "orta",
        title: "Sahiplik Transfer Fonksiyonu",
        description: "Sözleşme sahipliği değiştirilebilir veya bırakılabilir. Bu durum yönetim ve sorumluluk sorularına yol açabilir.",
        affectedCode: func.name,
        legalReference: "Kurumsal Yönetim İlkeleri",
        recommendation: "Sahiplik transferi için çoklu imza (multisig) veya zaman kilidi (timelock) mekanizması önerilir.",
        riskScore: 45,
      });
    }
  }

  return issues;
}

/**
 * Analyze source code for legal patterns
 */
function analyzeSourceCode(sourceCode: string): LegalIssue[] {
  const issues: LegalIssue[] = [];

  // Check for upgradability patterns
  for (const pattern of LEGAL_PATTERNS.upgradability.patterns) {
    if (sourceCode.toLowerCase().includes(pattern.toLowerCase())) {
      issues.push({
        id: generateId("issue"),
        category: "sozlesme_hukuku",
        severity: "yuksek",
        title: "Güncellenebilir Sözleşme Tespit Edildi",
        description: "Bu sözleşme proxy/upgrade mekanizması içeriyor. Tek taraflı değişiklik yapılabilir.",
        legalReference: "TBK m.20 - Genel İşlem Koşullarında Değişiklik",
        turkishLawReference: "6098 sayılı TBK m.20-25",
        recommendation: "Güncelleme mekanizması için zaman kilidi ve topluluk onayı mekanizması eklenmelidir.",
        riskScore: 65,
      });
      break; // Only one issue for upgradability
    }
  }

  // Check for consumer protection violations
  for (const [key, pattern] of Object.entries(CONSUMER_PROTECTION_PATTERNS)) {
    for (const p of pattern.patterns) {
      if (sourceCode.toLowerCase().includes(p.toLowerCase())) {
        issues.push({
          id: generateId("issue"),
          category: "tuketici_koruma",
          severity: key === "noWithdrawal" ? "kritik" : "yuksek",
          title: `Tüketici Koruma Riski: ${pattern.issue}`,
          description: pattern.issue,
          legalReference: "TKHK (6502 sayılı Kanun)",
          turkishLawReference: "6502 sayılı TKHK m.4, m.48",
          recommendation: "Tüketici işlemlerinde yasal hakların kısıtlanmaması sağlanmalıdır.",
          riskScore: key === "noWithdrawal" ? 80 : 60,
        });
      }
    }
  }

  // Check for personal data handling
  const personalDataPatterns = ["address", "owner", "sender", "recipient", "user", "holder"];
  let personalDataFound = false;
  for (const pattern of personalDataPatterns) {
    if (sourceCode.includes(pattern)) {
      personalDataFound = true;
      break;
    }
  }

  if (personalDataFound) {
    issues.push({
      id: generateId("issue"),
      category: "veri_koruma",
      severity: "orta",
      title: "Zincir Üzeri Kişisel Veri",
      description: "Sözleşme cüzdan adresleri ve işlem geçmişi gibi kişisel verileri zincir üzerinde saklar. Bu veriler herkese açıktır.",
      legalReference: "KVKK m.4, m.12",
      turkishLawReference: "6698 sayılı KVKK",
      recommendation: "Kullanıcılar zincir üzeri veri paylaşımı hakkında bilgilendirilmeli, minimizasyon ilkesi uygulanmalıdır.",
      riskScore: 55,
    });
  }

  return issues;
}

/**
 * Classify token for regulatory purposes
 */
function classifyToken(contractInfo: SmartContractInfo): RegulatoryClassification {
  const sourceCode = contractInfo.sourceCode?.toLowerCase() || "";
  const contractType = contractInfo.contractType;

  // Security token indicators
  const securityIndicators = [
    "dividend", "profit", "share", "equity", "revenue", "distribution",
    "voting", "governance", "temettü", "kar payı", "hisse", "oy hakkı"
  ];
  const isSecurityToken = securityIndicators.some((i) => sourceCode.includes(i));

  // Payment token indicators
  const paymentIndicators = ["transfer", "payment", "currency", "exchange", "ödeme", "para"];
  const isPaymentToken = paymentIndicators.some((i) => sourceCode.includes(i)) &&
    !isSecurityToken;

  // Utility token indicators (not security, not payment)
  const isUtilityToken = !isSecurityToken && !isPaymentToken;

  // License requirements
  const requiresLicense = isSecurityToken ||
    contractType === "defi" ||
    contractType === "loan" ||
    contractType === "insurance";

  // Applicable regulations
  const applicableRegulations: string[] = [];
  const jurisdictionNotes: string[] = [];

  if (isSecurityToken) {
    applicableRegulations.push("6362 sayılı Sermaye Piyasası Kanunu");
    applicableRegulations.push("SPK Tebliğleri");
    jurisdictionNotes.push("Security token ihracı için SPK izni gerekebilir");
  }

  if (isPaymentToken) {
    applicableRegulations.push("TCMB Yönetmeliği (2021)");
    applicableRegulations.push("5411 sayılı Bankacılık Kanunu");
    jurisdictionNotes.push("Ödeme hizmeti sunumu için TCMB/BDDK izni gerekir");
  }

  // Always applicable
  applicableRegulations.push("5549 sayılı Suç Gelirlerinin Aklanmasının Önlenmesi");
  applicableRegulations.push("6698 sayılı KVKK");

  if (contractType === "marketplace" || contractType === "nft") {
    applicableRegulations.push("6502 sayılı TKHK");
    jurisdictionNotes.push("B2C işlemlerde tüketici hakları geçerlidir");
  }

  return {
    isSecurityToken,
    isPaymentToken,
    isUtilityToken,
    requiresLicense,
    applicableRegulations,
    jurisdictionNotes,
  };
}

/**
 * Analyze consumer protection aspects
 */
function analyzeConsumerProtection(contractInfo: SmartContractInfo): ConsumerProtectionAnalysis {
  const sourceCode = contractInfo.sourceCode?.toLowerCase() || "";

  // Determine if B2C
  const isB2C = contractInfo.contractType === "marketplace" ||
    contractInfo.contractType === "nft" ||
    contractInfo.contractType === "token";

  // Check for withdrawal right
  const hasWithdrawalRight = sourceCode.includes("refund") ||
    sourceCode.includes("cancel") ||
    sourceCode.includes("cayma") ||
    sourceCode.includes("iade");

  // Check for transparency
  const hasTransparency = sourceCode.includes("event") && sourceCode.includes("emit");

  // Find unfair terms
  const unfairTermsFound: UnfairTerm[] = [];

  if (sourceCode.includes("norefund") || sourceCode.includes("nonrefundable")) {
    unfairTermsFound.push({
      description: "İade/cayma hakkının tamamen kaldırılması",
      location: "Sözleşme kodu",
      legalBasis: "TKHK m.48 - 14 günlük cayma hakkı",
      severity: "kritik",
    });
  }

  if (sourceCode.includes("changeterms") || sourceCode.includes("modifyrules")) {
    unfairTermsFound.push({
      description: "Tek taraflı koşul değişikliği hakkı",
      location: "Sözleşme kodu",
      legalBasis: "TKHK m.4 - Haksız Şartlar",
      severity: "yuksek",
    });
  }

  // Consumer risks
  const consumerRisks: string[] = [];
  if (!hasWithdrawalRight && isB2C) {
    consumerRisks.push("Cayma hakkı mekanizması bulunmuyor");
  }
  if (sourceCode.includes("burn") || sourceCode.includes("freeze")) {
    consumerRisks.push("Token/varlık yakılabilir veya dondurulabilir");
  }

  // Determine compliance
  let compliance: ConsumerProtectionAnalysis["compliance"];
  if (!isB2C) {
    compliance = "uygulanamaz";
  } else if (unfairTermsFound.length > 0) {
    compliance = "uyumsuz";
  } else if (consumerRisks.length > 0) {
    compliance = "kismen_uyumlu";
  } else {
    compliance = "uyumlu";
  }

  return {
    isB2C,
    hasWithdrawalRight,
    hasTransparency,
    unfairTermsFound,
    consumerRisks,
    compliance,
  };
}

/**
 * Analyze data protection aspects
 */
function analyzeDataProtection(contractInfo: SmartContractInfo): DataProtectionAnalysis {
  const sourceCode = contractInfo.sourceCode?.toLowerCase() || "";

  // On-chain data is always public
  const onChainData = true;

  // Check for personal data collection patterns
  const dataPatterns = {
    "Cüzdan Adresi": ["address", "owner", "sender", "recipient"],
    "İşlem Geçmişi": ["history", "transaction", "log", "event"],
    "Bakiye Bilgisi": ["balance", "amount", "holdings"],
    "Kimlik Verileri": ["identity", "kyc", "verification"],
  };

  const dataTypes: string[] = [];
  for (const [typeName, patterns] of Object.entries(dataPatterns)) {
    if (patterns.some((p) => sourceCode.includes(p))) {
      dataTypes.push(typeName);
    }
  }

  const collectsPersonalData = dataTypes.length > 0;

  // KVKK issues
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (collectsPersonalData) {
    issues.push("Zincir üzeri veriler halka açık ve silinemez niteliktedir");
    recommendations.push("Kullanıcılara zincir üzeri veri kalıcılığı hakkında aydınlatma yapılmalıdır");
  }

  if (dataTypes.includes("Kimlik Verileri")) {
    issues.push("Özel nitelikli kişisel veri işleme riski");
    recommendations.push("KYC verileri zincir dışında (off-chain) saklanmalıdır");
  }

  if (onChainData && !sourceCode.includes("private")) {
    issues.push("Tüm zincir üzeri veriler herkese açıktır");
    recommendations.push("Hassas veriler için şifreleme veya zincir dışı saklama kullanılmalıdır");
  }

  // KVKK compliance
  let kvkkCompliance: DataProtectionAnalysis["kvkkCompliance"];
  if (!collectsPersonalData) {
    kvkkCompliance = "uygulanamaz";
  } else if (dataTypes.includes("Kimlik Verileri")) {
    kvkkCompliance = "uyumsuz";
  } else if (issues.length > 1) {
    kvkkCompliance = "kismen_uyumlu";
  } else {
    kvkkCompliance = "uyumlu";
  }

  return {
    collectsPersonalData,
    dataTypes,
    onChainData,
    kvkkCompliance,
    issues,
    recommendations,
  };
}

/**
 * Analyze contract law aspects
 */
function analyzeContractLaw(contractInfo: SmartContractInfo): ContractLawAnalysis {
  const sourceCode = contractInfo.sourceCode?.toLowerCase() || "";

  // Contract formation elements
  const hasOffer = sourceCode.includes("function") && sourceCode.includes("public");
  const hasAcceptance = sourceCode.includes("msg.sender") || sourceCode.includes("call");
  const hasConsideration = sourceCode.includes("value") || sourceCode.includes("payable") ||
    sourceCode.includes("transfer");
  const hasCapacity = true; // Assumed - blockchain has no capacity check
  const hasLegality = !sourceCode.includes("illegal") && !sourceCode.includes("prohibited");

  // Enforceability assessment
  const enforcementChallenges: string[] = [];
  const jurisdictionIssues: string[] = [];

  enforcementChallenges.push("Akıllı sözleşmeler Türk hukukunda henüz açıkça düzenlenmemiştir");
  enforcementChallenges.push("Sözleşme taraflarının kimliği belirsiz olabilir");
  enforcementChallenges.push("Yargı kararlarının teknik uygulanabilirliği sınırlıdır");

  jurisdictionIssues.push("Blokzincir işlemleri sınır ötesi niteliktedir");
  jurisdictionIssues.push("Yetkili mahkeme ve uygulanacak hukuk belirsiz olabilir");

  // Enforceability
  let isEnforceable: ContractLawAnalysis["isEnforceable"];
  if (hasOffer && hasAcceptance && hasConsideration && hasLegality) {
    isEnforceable = "belirsiz"; // Legal but uncertain enforceability
  } else {
    isEnforceable = "belirsiz";
  }

  return {
    hasOffer,
    hasAcceptance,
    hasConsideration,
    hasCapacity,
    hasLegality,
    isEnforceable,
    enforcementChallenges,
    jurisdictionIssues,
  };
}

/**
 * Analyze securities law compliance
 */
function analyzeSecuritiesLaw(
  contractInfo: SmartContractInfo,
  jurisdiction: "TR" | "EU" | "US"
): LegalIssue[] {
  const issues: LegalIssue[] = [];

  if (jurisdiction === "TR") {
    issues.push({
      id: generateId("issue"),
      category: "menkul_kiymet",
      severity: "kritik",
      title: "Menkul Kıymet Token Değerlendirmesi",
      description: "Bu token, kar payı veya yönetim hakkı gibi özellikler taşıyor. SPK mevzuatı kapsamında menkul kıymet sayılabilir.",
      legalReference: "6362 sayılı SPKn",
      turkishLawReference: "Sermaye Piyasası Kanunu m.3, m.128",
      recommendation: "SPK'dan izin alınmadan halka arz yapılmamalı, hukuki görüş alınmalıdır.",
      riskScore: 90,
    });
  }

  return issues;
}

/**
 * Create empty consumer protection analysis
 */
function createEmptyConsumerProtection(): ConsumerProtectionAnalysis {
  return {
    isB2C: false,
    hasWithdrawalRight: false,
    hasTransparency: false,
    unfairTermsFound: [],
    consumerRisks: [],
    compliance: "uygulanamaz",
  };
}

/**
 * Create empty data protection analysis
 */
function createEmptyDataProtection(): DataProtectionAnalysis {
  return {
    collectsPersonalData: false,
    dataTypes: [],
    onChainData: false,
    kvkkCompliance: "uygulanamaz",
    issues: [],
    recommendations: [],
  };
}

/**
 * Calculate overall risk score
 */
function calculateOverallRisk(issues: LegalIssue[]): number {
  if (issues.length === 0) return 0;

  const severityWeights: Record<IssueSeverity, number> = {
    kritik: 30,
    yuksek: 20,
    orta: 10,
    dusuk: 5,
    bilgilendirme: 2,
  };

  let totalRisk = 0;
  for (const issue of issues) {
    totalRisk += severityWeights[issue.severity];
  }

  return Math.min(100, totalRisk);
}

/**
 * Generate disclaimer
 */
function generateDisclaimer(): string {
  return `Bu analiz otomatik olarak üretilmiştir ve hukuki tavsiye niteliği taşımaz. ` +
    `Akıllı sözleşmeler ve kripto varlıklar sürekli değişen düzenlemelere tabidir. ` +
    `Kesin hukuki değerlendirme için mutlaka uzman bir avukata danışınız. ` +
    `Analiz tarihi: ${new Date().toLocaleDateString("tr-TR")}`;
}

/**
 * Get Turkish crypto regulations
 */
export function getTurkishCryptoRegulations(): typeof TURKISH_CRYPTO_REGULATIONS {
  return TURKISH_CRYPTO_REGULATIONS;
}

/**
 * Format analysis result as text
 */
export function formatAnalysisResult(result: SmartContractAnalysisResult): string {
  let output = `Akıllı Sözleşme Hukuki Analizi\n`;
  output += `${"=".repeat(50)}\n\n`;

  output += `Sözleşme Türü: ${formatContractType(result.contractInfo.contractType)}\n`;
  output += `Platform: ${result.contractInfo.platform.toUpperCase()}\n`;
  output += `Genel Risk Skoru: %${result.overallRiskScore}\n`;
  output += `Durum: ${formatStatus(result.overallStatus)}\n\n`;

  if (result.issues.length > 0) {
    output += `Tespit Edilen Sorunlar (${result.issues.length}):\n`;
    output += `${"-".repeat(30)}\n`;

    for (const issue of result.issues) {
      output += `\n[${formatSeverity(issue.severity)}] ${issue.title}\n`;
      output += `Kategori: ${formatCategory(issue.category)}\n`;
      output += `Açıklama: ${issue.description}\n`;
      output += `Referans: ${issue.legalReference}\n`;
      output += `Öneri: ${issue.recommendation}\n`;
    }
  }

  output += `\nDüzenleyici Sınıflandırma:\n`;
  output += `${"-".repeat(30)}\n`;
  output += `Security Token: ${result.regulatoryClassification.isSecurityToken ? "Evet" : "Hayır"}\n`;
  output += `Payment Token: ${result.regulatoryClassification.isPaymentToken ? "Evet" : "Hayır"}\n`;
  output += `Utility Token: ${result.regulatoryClassification.isUtilityToken ? "Evet" : "Hayır"}\n`;
  output += `Lisans Gerektirir: ${result.regulatoryClassification.requiresLicense ? "Evet" : "Hayır"}\n`;

  output += `\n${result.disclaimer}\n`;

  return output;
}

/**
 * Format contract type
 */
function formatContractType(type: ContractType): string {
  const labels: Record<ContractType, string> = {
    token: "Token Sözleşmesi",
    nft: "NFT Sözleşmesi",
    defi: "DeFi Protokolü",
    dao: "DAO Sözleşmesi",
    escrow: "Emanet Sözleşmesi",
    multisig: "Çoklu İmza",
    vesting: "Vesting Sözleşmesi",
    staking: "Staking Sözleşmesi",
    marketplace: "Pazar Yeri",
    loan: "Kredi Protokolü",
    insurance: "Sigorta Protokolü",
    supply_chain: "Tedarik Zinciri",
    identity: "Kimlik Sözleşmesi",
    other: "Diğer",
  };
  return labels[type];
}

/**
 * Format severity
 */
function formatSeverity(severity: IssueSeverity): string {
  const labels: Record<IssueSeverity, string> = {
    kritik: "KRİTİK",
    yuksek: "YÜKSEK",
    orta: "ORTA",
    dusuk: "DÜŞÜK",
    bilgilendirme: "BİLGİ",
  };
  return labels[severity];
}

/**
 * Format category
 */
function formatCategory(category: LegalIssueCategory): string {
  const labels: Record<LegalIssueCategory, string> = {
    tuketici_koruma: "Tüketici Koruma",
    finansal_duzenleme: "Finansal Düzenleme",
    veri_koruma: "Veri Koruma",
    sozlesme_hukuku: "Sözleşme Hukuku",
    vergi: "Vergi",
    aklanma_karsi: "Kara Para Aklama",
    menkul_kiymet: "Menkul Kıymet",
    fikri_mulkiyet: "Fikri Mülkiyet",
    yetki_alani: "Yetki Alanı",
    uygulanabilirlik: "Uygulanabilirlik",
  };
  return labels[category];
}

/**
 * Format status
 */
function formatStatus(status: SmartContractAnalysisResult["overallStatus"]): string {
  const labels: Record<SmartContractAnalysisResult["overallStatus"], string> = {
    uyumlu: "Uyumlu",
    riskli: "Riskli",
    kritik_riskli: "Kritik Riskli",
    belirsiz: "Belirsiz",
  };
  return labels[status];
}

/**
 * Get supported platforms
 */
export function getSupportedPlatforms(): Array<{
  id: BlockchainPlatform;
  name: string;
  type: "public" | "private";
}> {
  return [
    { id: "ethereum", name: "Ethereum", type: "public" },
    { id: "polygon", name: "Polygon", type: "public" },
    { id: "bsc", name: "BNB Smart Chain", type: "public" },
    { id: "avalanche", name: "Avalanche", type: "public" },
    { id: "solana", name: "Solana", type: "public" },
    { id: "arbitrum", name: "Arbitrum", type: "public" },
    { id: "optimism", name: "Optimism", type: "public" },
    { id: "private", name: "Özel Blokzincir", type: "private" },
  ];
}

/**
 * Get contract types
 */
export function getContractTypes(): Array<{
  id: ContractType;
  name: string;
  description: string;
}> {
  return [
    { id: "token", name: "Token", description: "ERC-20 veya benzeri token sözleşmesi" },
    { id: "nft", name: "NFT", description: "ERC-721 veya ERC-1155 NFT sözleşmesi" },
    { id: "defi", name: "DeFi", description: "Merkeziyetsiz finans protokolü" },
    { id: "dao", name: "DAO", description: "Merkeziyetsiz otonom organizasyon" },
    { id: "escrow", name: "Emanet", description: "Güvenli ödeme/teslim sözleşmesi" },
    { id: "multisig", name: "Multisig", description: "Çoklu imza cüzdanı" },
    { id: "vesting", name: "Vesting", description: "Token kilitleme sözleşmesi" },
    { id: "staking", name: "Staking", description: "Token stake etme sözleşmesi" },
    { id: "marketplace", name: "Pazar Yeri", description: "NFT veya token pazar yeri" },
    { id: "loan", name: "Kredi", description: "Kredi/borç verme protokolü" },
    { id: "insurance", name: "Sigorta", description: "Merkeziyetsiz sigorta protokolü" },
    { id: "supply_chain", name: "Tedarik Zinciri", description: "Tedarik zinciri takip sözleşmesi" },
    { id: "identity", name: "Kimlik", description: "Merkeyetsiz kimlik sözleşmesi" },
    { id: "other", name: "Diğer", description: "Diğer akıllı sözleşme türleri" },
  ];
}
