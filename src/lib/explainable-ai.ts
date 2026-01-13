/**
 * Explainable AI (XAI) Module for Legal Reasoning
 *
 * Based on 2025 research: Legal professionals require transparent,
 * auditable AI reasoning. This module provides:
 * - Step-by-step reasoning chains
 * - Confidence scoring with justification
 * - Source attribution and verification
 * - Counter-argument generation
 * - Uncertainty quantification
 *
 * Reference: "Explainable AI and Law: An Evidential Survey" (2023)
 */

// Types for explainable reasoning
export type ReasoningType =
  | "deductive"      // From general rules to specific conclusion
  | "inductive"      // From specific cases to general principle
  | "analogical"     // From similar cases
  | "abductive"      // Best explanation inference
  | "statutory"      // Based on statute interpretation
  | "precedential";  // Based on case precedents

export type ConfidenceLevel = "very_high" | "high" | "medium" | "low" | "very_low";

export type EvidenceType =
  | "kanun"          // Statute/Law
  | "yonetmelik"     // Regulation
  | "ictihat"        // Case law/Precedent
  | "doktrin"        // Legal doctrine
  | "teamul"         // Custom/Practice
  | "karsilastirmali" // Comparative law
  | "uzman_gorusu";  // Expert opinion

export interface Evidence {
  id: string;
  type: EvidenceType;
  source: string;
  citation: string;
  content: string;
  relevanceScore: number;
  reliability: ConfidenceLevel;
  dateAccessed?: Date;
  isVerified: boolean;
  verificationMethod?: string;
}

export interface ReasoningStep {
  id: string;
  order: number;
  type: ReasoningType;
  premise: string;
  inference: string;
  conclusion: string;
  evidences: Evidence[];
  confidence: number;
  alternativeInterpretations?: string[];
  potentialWeaknesses?: string[];
}

export interface CounterArgument {
  id: string;
  argument: string;
  basis: string;
  strength: ConfidenceLevel;
  rebuttal?: string;
  evidences: Evidence[];
}

export interface UncertaintyFactor {
  factor: string;
  description: string;
  impact: "high" | "medium" | "low";
  mitigationSuggestion?: string;
}

export interface ExplainableResult {
  id: string;
  query: string;
  conclusion: string;
  confidenceScore: number;
  confidenceLevel: ConfidenceLevel;
  confidenceJustification: string;
  reasoningChain: ReasoningStep[];
  evidences: Evidence[];
  counterArguments: CounterArgument[];
  uncertaintyFactors: UncertaintyFactor[];
  limitations: string[];
  assumptions: string[];
  suggestedNextSteps: string[];
  generatedAt: Date;
  processingTimeMs: number;
  modelVersion: string;
}

export interface ReasoningContext {
  legalArea: string;
  jurisdiction: string;
  caseType?: string;
  relevantDates?: { event: string; date: Date }[];
  parties?: { role: string; description: string }[];
  keyFacts: string[];
  legalQuestions: string[];
}

// Confidence calculation weights
const CONFIDENCE_WEIGHTS = {
  evidenceQuality: 0.30,
  evidenceQuantity: 0.15,
  sourceReliability: 0.25,
  reasoningCoherence: 0.20,
  precedentAlignment: 0.10,
};

// Evidence reliability scores
const EVIDENCE_RELIABILITY: Record<EvidenceType, number> = {
  kanun: 1.0,
  yonetmelik: 0.95,
  ictihat: 0.90,
  doktrin: 0.75,
  teamul: 0.60,
  karsilastirmali: 0.50,
  uzman_gorusu: 0.70,
};

// Turkish legal knowledge base for reasoning
const legalKnowledge = {
  principles: [
    {
      id: "kanun_oncelik",
      name: "Kanunların Önceliği",
      description: "Normlar hiyerarşisinde kanunlar yönetmeliklerden üstündür",
      application: "Çelişki durumunda kanun hükmü uygulanır",
    },
    {
      id: "ozel_genel",
      name: "Özel Kanun - Genel Kanun",
      description: "Özel kanun genel kanuna göre öncelikli uygulanır",
      application: "Lex specialis derogat legi generali",
    },
    {
      id: "sonraki_onceki",
      name: "Sonraki Kanun Önceliği",
      description: "Sonraki tarihli kanun öncekini zımnen ilga eder",
      application: "Lex posterior derogat legi priori",
    },
    {
      id: "lehte_yorum",
      name: "Şüpheden Sanık Yararlanır",
      description: "Ceza hukukunda şüphe sanık lehine yorumlanır",
      application: "In dubio pro reo",
    },
    {
      id: "ahde_vefa",
      name: "Ahde Vefa",
      description: "Sözleşmelere bağlılık ilkesi",
      application: "Pacta sunt servanda",
    },
    {
      id: "iyi_niyet",
      name: "Dürüstlük Kuralı",
      description: "Herkes haklarını kullanırken dürüstlük kurallarına uymalıdır",
      application: "TMK m.2",
    },
  ],
  interpretationMethods: [
    {
      id: "lafzi",
      name: "Lafzi (Sözel) Yorum",
      description: "Kanun metninin kelime anlamına göre yorumu",
      priority: 1,
    },
    {
      id: "sistematik",
      name: "Sistematik Yorum",
      description: "Hükmün kanun sistematiği içindeki yerine göre yorumu",
      priority: 2,
    },
    {
      id: "tarihi",
      name: "Tarihi Yorum",
      description: "Kanun koyucunun iradesine göre yorum",
      priority: 3,
    },
    {
      id: "amaci",
      name: "Amaçsal (Teleolojik) Yorum",
      description: "Hükmün amacına göre yorum",
      priority: 4,
    },
  ],
};

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate confidence level from score
 */
function scoreToLevel(score: number): ConfidenceLevel {
  if (score >= 0.9) return "very_high";
  if (score >= 0.75) return "high";
  if (score >= 0.5) return "medium";
  if (score >= 0.25) return "low";
  return "very_low";
}

/**
 * Calculate confidence level description in Turkish
 */
function getConfidenceLevelDescription(level: ConfidenceLevel): string {
  const descriptions: Record<ConfidenceLevel, string> = {
    very_high: "Çok Yüksek - Güçlü kanıtlarla desteklenen, emsal kararlarla uyumlu sonuç",
    high: "Yüksek - Sağlam hukuki dayanakları olan, genel kabul gören yorum",
    medium: "Orta - Makul gerekçelere dayanan ancak alternatif yorumları olan sonuç",
    low: "Düşük - Sınırlı kanıtlara dayanan, belirsizlik içeren değerlendirme",
    very_low: "Çok Düşük - Spekülatif, yeterli hukuki dayanaktan yoksun değerlendirme",
  };
  return descriptions[level];
}

/**
 * Create evidence from source
 */
export function createEvidence(
  type: EvidenceType,
  source: string,
  citation: string,
  content: string,
  relevanceScore: number = 0.8,
  isVerified: boolean = false
): Evidence {
  return {
    id: generateId("evidence"),
    type,
    source,
    citation,
    content,
    relevanceScore: Math.max(0, Math.min(1, relevanceScore)),
    reliability: scoreToLevel(EVIDENCE_RELIABILITY[type]),
    dateAccessed: new Date(),
    isVerified,
  };
}

/**
 * Create a reasoning step
 */
export function createReasoningStep(
  order: number,
  type: ReasoningType,
  premise: string,
  inference: string,
  conclusion: string,
  evidences: Evidence[] = [],
  alternativeInterpretations?: string[],
  potentialWeaknesses?: string[]
): ReasoningStep {
  // Calculate confidence based on evidence quality
  const avgEvidenceScore = evidences.length > 0
    ? evidences.reduce((sum, e) => sum + e.relevanceScore * EVIDENCE_RELIABILITY[e.type], 0) / evidences.length
    : 0.3;

  return {
    id: generateId("step"),
    order,
    type,
    premise,
    inference,
    conclusion,
    evidences,
    confidence: avgEvidenceScore,
    alternativeInterpretations,
    potentialWeaknesses,
  };
}

/**
 * Generate counter-arguments for a conclusion
 */
export function generateCounterArguments(
  conclusion: string,
  context: ReasoningContext
): CounterArgument[] {
  const counterArguments: CounterArgument[] = [];

  // Standard counter-argument patterns for Turkish law
  const patterns = [
    {
      trigger: /tazminat|zarar|kusur/i,
      argument: "Müterafik kusur savunması ileri sürülebilir",
      basis: "TBK m.52 - Zarar görenin de kusuru varsa tazminat indirilebilir",
      strength: "medium" as ConfidenceLevel,
    },
    {
      trigger: /fesih|sözleşme.*son/i,
      argument: "Haklı neden veya mücbir sebep savunması yapılabilir",
      basis: "TBK m.136, m.138 - Mücbir sebep ve aşırı ifa güçlüğü",
      strength: "medium" as ConfidenceLevel,
    },
    {
      trigger: /alacak|borç|ödeme/i,
      argument: "Zamanaşımı def'i ileri sürülebilir",
      basis: "TBK m.146 vd. - Genel zamanaşımı süreleri",
      strength: "high" as ConfidenceLevel,
    },
    {
      trigger: /tahliye|kira/i,
      argument: "Kiracının korunması hükümleri uygulanabilir",
      basis: "TBK m.347 vd. - Konut ve çatılı işyeri kiraları",
      strength: "high" as ConfidenceLevel,
    },
    {
      trigger: /işe iade|fesih.*iş/i,
      argument: "İşverenin yönetim hakkı savunması yapılabilir",
      basis: "4857 s.K. m.18 - Feshin son çare olması ilkesi",
      strength: "medium" as ConfidenceLevel,
    },
    {
      trigger: /kvkk|kişisel veri/i,
      argument: "Meşru menfaat veya kanuni yükümlülük istisnası ileri sürülebilir",
      basis: "KVKK m.5/2 - Açık rıza gerektirmeyen haller",
      strength: "high" as ConfidenceLevel,
    },
  ];

  for (const pattern of patterns) {
    if (pattern.trigger.test(conclusion) || context.keyFacts.some(f => pattern.trigger.test(f))) {
      counterArguments.push({
        id: generateId("counter"),
        argument: pattern.argument,
        basis: pattern.basis,
        strength: pattern.strength,
        evidences: [],
      });
    }
  }

  // Add general procedural counter-arguments
  if (context.caseType) {
    counterArguments.push({
      id: generateId("counter"),
      argument: "Usuli itirazlar (görev, yetki, husumet) ileri sürülebilir",
      basis: "HMK m.114 vd. - Dava şartları",
      strength: "medium",
      evidences: [],
    });
  }

  return counterArguments;
}

/**
 * Identify uncertainty factors in the analysis
 */
export function identifyUncertaintyFactors(
  context: ReasoningContext,
  evidences: Evidence[]
): UncertaintyFactor[] {
  const factors: UncertaintyFactor[] = [];

  // Check evidence quality
  const verifiedCount = evidences.filter(e => e.isVerified).length;
  if (verifiedCount < evidences.length * 0.5) {
    factors.push({
      factor: "Doğrulanmamış Kaynaklar",
      description: `Kullanılan kaynakların ${Math.round((1 - verifiedCount/evidences.length) * 100)}%'i henüz doğrulanmamış`,
      impact: "medium",
      mitigationSuggestion: "Resmi mevzuat ve içtihat kaynaklarından teyit alınması önerilir",
    });
  }

  // Check for recent legal changes
  const recentDate = new Date();
  recentDate.setMonth(recentDate.getMonth() - 6);
  factors.push({
    factor: "Mevzuat Güncelliği",
    description: "Son 6 ay içinde ilgili mevzuatta değişiklik olup olmadığı kontrol edilmelidir",
    impact: "medium",
    mitigationSuggestion: "Resmi Gazete ve KVKK duyurularını kontrol edin",
  });

  // Check for jurisdictional issues
  if (!context.jurisdiction || context.jurisdiction === "belirsiz") {
    factors.push({
      factor: "Yetki Belirsizliği",
      description: "Hangi mahkemenin yetkili olduğu netleştirilmeli",
      impact: "high",
      mitigationSuggestion: "Yetki kurallarına göre yetkili mahkemeyi belirleyin",
    });
  }

  // Check for factual gaps
  if (context.keyFacts.length < 3) {
    factors.push({
      factor: "Yetersiz Olay Bilgisi",
      description: "Değerlendirme için yeterli olay bilgisi mevcut değil",
      impact: "high",
      mitigationSuggestion: "Ek bilgi ve belge toplanması önerilir",
    });
  }

  // Check evidence diversity
  const evidenceTypes = new Set(evidences.map(e => e.type));
  if (evidenceTypes.size === 1) {
    factors.push({
      factor: "Tek Tip Kaynak",
      description: "Analiz sadece tek tip kaynağa dayanmaktadır",
      impact: "low",
      mitigationSuggestion: "Farklı kaynak türlerinden (içtihat, doktrin) destekleyici bilgi ekleyin",
    });
  }

  return factors;
}

/**
 * Calculate overall confidence score
 */
function calculateConfidenceScore(
  evidences: Evidence[],
  reasoningSteps: ReasoningStep[],
  counterArguments: CounterArgument[],
  uncertaintyFactors: UncertaintyFactor[]
): { score: number; justification: string } {
  let score = 0;
  const justificationParts: string[] = [];

  // Evidence quality (30%)
  if (evidences.length > 0) {
    const avgQuality = evidences.reduce((sum, e) =>
      sum + e.relevanceScore * EVIDENCE_RELIABILITY[e.type], 0) / evidences.length;
    const evidenceScore = avgQuality * CONFIDENCE_WEIGHTS.evidenceQuality;
    score += evidenceScore;
    justificationParts.push(`Kanıt kalitesi: ${(avgQuality * 100).toFixed(0)}%`);
  }

  // Evidence quantity (15%)
  const quantityScore = Math.min(evidences.length / 5, 1) * CONFIDENCE_WEIGHTS.evidenceQuantity;
  score += quantityScore;
  justificationParts.push(`Kanıt sayısı: ${evidences.length}`);

  // Source reliability (25%)
  const verifiedRatio = evidences.filter(e => e.isVerified).length / Math.max(evidences.length, 1);
  const kanunRatio = evidences.filter(e => e.type === "kanun" || e.type === "ictihat").length / Math.max(evidences.length, 1);
  const reliabilityScore = ((verifiedRatio + kanunRatio) / 2) * CONFIDENCE_WEIGHTS.sourceReliability;
  score += reliabilityScore;
  justificationParts.push(`Kaynak güvenilirliği: ${((verifiedRatio + kanunRatio) / 2 * 100).toFixed(0)}%`);

  // Reasoning coherence (20%)
  if (reasoningSteps.length > 0) {
    const avgStepConfidence = reasoningSteps.reduce((sum, s) => sum + s.confidence, 0) / reasoningSteps.length;
    const coherenceScore = avgStepConfidence * CONFIDENCE_WEIGHTS.reasoningCoherence;
    score += coherenceScore;
    justificationParts.push(`Muhakeme tutarlılığı: ${(avgStepConfidence * 100).toFixed(0)}%`);
  }

  // Precedent alignment (10%)
  const precedentEvidences = evidences.filter(e => e.type === "ictihat");
  const precedentScore = Math.min(precedentEvidences.length / 2, 1) * CONFIDENCE_WEIGHTS.precedentAlignment;
  score += precedentScore;
  justificationParts.push(`Emsal desteği: ${precedentEvidences.length} karar`);

  // Deductions for uncertainty
  const highImpactFactors = uncertaintyFactors.filter(f => f.impact === "high").length;
  const mediumImpactFactors = uncertaintyFactors.filter(f => f.impact === "medium").length;
  const uncertaintyDeduction = (highImpactFactors * 0.15) + (mediumImpactFactors * 0.05);
  score = Math.max(0, score - uncertaintyDeduction);

  if (uncertaintyDeduction > 0) {
    justificationParts.push(`Belirsizlik faktörleri: -${(uncertaintyDeduction * 100).toFixed(0)}%`);
  }

  // Strong counter-arguments reduce confidence
  const strongCounters = counterArguments.filter(c => c.strength === "high" || c.strength === "very_high").length;
  if (strongCounters > 0) {
    score = Math.max(0, score - (strongCounters * 0.05));
    justificationParts.push(`Güçlü karşı argümanlar: ${strongCounters}`);
  }

  return {
    score: Math.min(1, Math.max(0, score)),
    justification: justificationParts.join(" | "),
  };
}

/**
 * Generate explainable legal reasoning
 */
export function generateExplainableReasoning(
  query: string,
  context: ReasoningContext,
  providedEvidences: Evidence[] = []
): ExplainableResult {
  const startTime = Date.now();
  const evidences: Evidence[] = [...providedEvidences];
  const reasoningSteps: ReasoningStep[] = [];
  const assumptions: string[] = [];
  const limitations: string[] = [];

  // Step 1: Identify applicable legal principles
  const applicablePrinciples = legalKnowledge.principles.filter(p => {
    const queryLower = query.toLowerCase();
    const factsLower = context.keyFacts.join(" ").toLowerCase();

    return queryLower.includes(p.name.toLowerCase()) ||
           factsLower.includes(p.name.toLowerCase()) ||
           p.application.toLowerCase().split(" ").some(w => queryLower.includes(w));
  });

  if (applicablePrinciples.length > 0) {
    reasoningSteps.push(createReasoningStep(
      1,
      "deductive",
      `Uygulanabilir hukuki ilkeler: ${applicablePrinciples.map(p => p.name).join(", ")}`,
      `Bu ilkeler somut olaya tatbik edildiğinde...`,
      `${applicablePrinciples[0].application} ilkesi gereği değerlendirme yapılmalıdır.`,
      evidences.filter(e => e.type === "kanun"),
      undefined,
      ["Farklı ilkelerin öncelikli uygulanması tartışılabilir"]
    ));
  }

  // Step 2: Apply statutory interpretation
  if (evidences.some(e => e.type === "kanun")) {
    const statuteEvidence = evidences.filter(e => e.type === "kanun");
    reasoningSteps.push(createReasoningStep(
      2,
      "statutory",
      `İlgili kanun hükümleri: ${statuteEvidence.map(e => e.citation).join(", ")}`,
      "Lafzi yorum metoduyla kanun metninin açık anlamı değerlendirilmiştir.",
      "Kanun hükmünün lafzından çıkan sonuç uygulanmalıdır.",
      statuteEvidence,
      ["Amaçsal yorum farklı sonuç doğurabilir", "Tarihi yorum farklı anlam verebilir"],
      ["Kanun metni birden fazla yoruma açık olabilir"]
    ));
  }

  // Step 3: Consider precedents
  if (evidences.some(e => e.type === "ictihat")) {
    const caseEvidence = evidences.filter(e => e.type === "ictihat");
    reasoningSteps.push(createReasoningStep(
      3,
      "precedential",
      `Emsal kararlar incelenmiştir: ${caseEvidence.length} adet içtihat`,
      "Yargıtay/Danıştay içtihatları benzer olaylarda istikrarlı görüş ortaya koymaktadır.",
      "Yerleşik içtihat yönünde karar verilmesi muhtemeldir.",
      caseEvidence,
      ["İçtihat değişikliği olabilir", "Somut olay farklılıkları etkili olabilir"],
      ["İçtihat henüz tam olarak yerleşmemiş olabilir"]
    ));
  }

  // Step 4: Analogical reasoning if applicable
  if (context.caseType) {
    reasoningSteps.push(createReasoningStep(
      4,
      "analogical",
      `Benzer ${context.caseType} davalarında uygulanan çözümler değerlendirilmiştir.`,
      "Kıyas yoluyla benzer olaylardaki çözümler somut olaya uygulanabilir.",
      "Benzer davalardaki çözümler yol gösterici niteliktedir.",
      [],
      ["Her dava kendine özgü koşullar içerir"],
      ["Kıyas yasakları (özellikle ceza hukukunda) gözetilmelidir"]
    ));
  }

  // Generate counter-arguments
  const counterArguments = generateCounterArguments(query, context);

  // Identify uncertainty factors
  const uncertaintyFactors = identifyUncertaintyFactors(context, evidences);

  // Calculate confidence
  const { score: confidenceScore, justification: confidenceJustification } =
    calculateConfidenceScore(evidences, reasoningSteps, counterArguments, uncertaintyFactors);

  // Generate conclusion
  let conclusion = "";
  if (reasoningSteps.length > 0) {
    conclusion = reasoningSteps.map(s => s.conclusion).join(" ");
  } else {
    conclusion = "Yeterli veri olmadan kesin bir sonuca ulaşmak mümkün değildir.";
  }

  // Add standard assumptions
  assumptions.push("Sunulan bilgilerin doğru ve eksiksiz olduğu varsayılmıştır.");
  assumptions.push("Mevzuatın analiz tarihi itibarıyla güncel olduğu kabul edilmiştir.");
  assumptions.push("Tarafların ehliyetlerinin tam olduğu varsayılmıştır.");

  // Add limitations
  limitations.push("Bu analiz hukuki mütalaa yerine geçmez.");
  limitations.push("Somut olayın tüm koşulları bilinmeden kesin değerlendirme yapılamaz.");
  limitations.push("Mahkeme kararları her zaman farklı olabilir.");
  limitations.push("Mevzuat değişikliklerinden etkilenebilir.");

  // Suggested next steps
  const suggestedNextSteps = [
    "Avukatınıza danışarak detaylı hukuki değerlendirme alınız.",
    "İlgili belgelerin aslını temin ediniz.",
    "Zamanaşımı ve hak düşürücü süreleri kontrol ediniz.",
  ];

  if (counterArguments.length > 0) {
    suggestedNextSteps.push("Karşı argümanları değerlendirerek savunma stratejisi belirleyiniz.");
  }

  if (uncertaintyFactors.some(f => f.impact === "high")) {
    suggestedNextSteps.push("Belirsizlik faktörlerini gidermek için ek bilgi toplayınız.");
  }

  return {
    id: generateId("xai"),
    query,
    conclusion,
    confidenceScore,
    confidenceLevel: scoreToLevel(confidenceScore),
    confidenceJustification,
    reasoningChain: reasoningSteps,
    evidences,
    counterArguments,
    uncertaintyFactors,
    limitations,
    assumptions,
    suggestedNextSteps,
    generatedAt: new Date(),
    processingTimeMs: Date.now() - startTime,
    modelVersion: "1.0.0-xai",
  };
}

/**
 * Format explainable result as readable text
 */
export function formatExplainableResult(result: ExplainableResult): string {
  let output = "";

  // Header
  output += "═══════════════════════════════════════════════════════════\n";
  output += "                    HUKUKİ ANALİZ RAPORU\n";
  output += "                  (Açıklanabilir AI Modülü)\n";
  output += "═══════════════════════════════════════════════════════════\n\n";

  // Query
  output += "📋 SORU/KONU:\n";
  output += `   ${result.query}\n\n`;

  // Conclusion with confidence
  output += "📌 SONUÇ:\n";
  output += `   ${result.conclusion}\n\n`;

  // Confidence
  const confidenceEmoji = result.confidenceLevel === "very_high" || result.confidenceLevel === "high"
    ? "✅" : result.confidenceLevel === "medium" ? "⚠️" : "❌";
  output += `${confidenceEmoji} GÜVENİLİRLİK: ${(result.confidenceScore * 100).toFixed(0)}% (${getConfidenceLevelDescription(result.confidenceLevel)})\n`;
  output += `   Gerekçe: ${result.confidenceJustification}\n\n`;

  // Reasoning chain
  if (result.reasoningChain.length > 0) {
    output += "🔗 MUHAKEME ZİNCİRİ:\n";
    output += "───────────────────────────────────────────────────────────\n";

    for (const step of result.reasoningChain) {
      output += `\n   Adım ${step.order} [${step.type.toUpperCase()}]:\n`;
      output += `   ├─ Öncül: ${step.premise}\n`;
      output += `   ├─ Çıkarım: ${step.inference}\n`;
      output += `   └─ Sonuç: ${step.conclusion}\n`;

      if (step.evidences.length > 0) {
        output += `   📚 Dayanak: ${step.evidences.map(e => e.citation).join(", ")}\n`;
      }

      if (step.alternativeInterpretations && step.alternativeInterpretations.length > 0) {
        output += `   ⚖️ Alternatif yorumlar: ${step.alternativeInterpretations.join("; ")}\n`;
      }

      if (step.potentialWeaknesses && step.potentialWeaknesses.length > 0) {
        output += `   ⚡ Olası zayıf noktalar: ${step.potentialWeaknesses.join("; ")}\n`;
      }
    }
    output += "\n";
  }

  // Evidences
  if (result.evidences.length > 0) {
    output += "📚 KAYNAKLAR VE DAYANAKLAR:\n";
    output += "───────────────────────────────────────────────────────────\n";

    for (const evidence of result.evidences) {
      const verifiedMark = evidence.isVerified ? "✓" : "?";
      output += `   [${verifiedMark}] ${evidence.citation}\n`;
      output += `       Tür: ${evidence.type} | İlgililik: ${(evidence.relevanceScore * 100).toFixed(0)}%\n`;
    }
    output += "\n";
  }

  // Counter-arguments
  if (result.counterArguments.length > 0) {
    output += "⚔️ KARŞI ARGÜMANLAR:\n";
    output += "───────────────────────────────────────────────────────────\n";

    for (const counter of result.counterArguments) {
      output += `   • ${counter.argument}\n`;
      output += `     Dayanak: ${counter.basis}\n`;
      output += `     Güç: ${counter.strength}\n`;
      if (counter.rebuttal) {
        output += `     Çürütme: ${counter.rebuttal}\n`;
      }
    }
    output += "\n";
  }

  // Uncertainty factors
  if (result.uncertaintyFactors.length > 0) {
    output += "⚠️ BELİRSİZLİK FAKTÖRLERİ:\n";
    output += "───────────────────────────────────────────────────────────\n";

    for (const factor of result.uncertaintyFactors) {
      const impactEmoji = factor.impact === "high" ? "🔴" : factor.impact === "medium" ? "🟡" : "🟢";
      output += `   ${impactEmoji} ${factor.factor}\n`;
      output += `      ${factor.description}\n`;
      if (factor.mitigationSuggestion) {
        output += `      💡 Öneri: ${factor.mitigationSuggestion}\n`;
      }
    }
    output += "\n";
  }

  // Assumptions
  output += "📝 VARSAYIMLAR:\n";
  for (const assumption of result.assumptions) {
    output += `   • ${assumption}\n`;
  }
  output += "\n";

  // Limitations
  output += "⛔ SINIRLAMALAR:\n";
  for (const limitation of result.limitations) {
    output += `   • ${limitation}\n`;
  }
  output += "\n";

  // Next steps
  output += "➡️ ÖNERİLEN ADIMLAR:\n";
  for (const step of result.suggestedNextSteps) {
    output += `   • ${step}\n`;
  }
  output += "\n";

  // Footer
  output += "═══════════════════════════════════════════════════════════\n";
  output += `Oluşturulma: ${result.generatedAt.toLocaleString("tr-TR")}\n`;
  output += `İşlem Süresi: ${result.processingTimeMs}ms | Versiyon: ${result.modelVersion}\n`;
  output += "═══════════════════════════════════════════════════════════\n";

  return output;
}

/**
 * Get legal principles
 */
export function getLegalPrinciples(): typeof legalKnowledge.principles {
  return legalKnowledge.principles;
}

/**
 * Get interpretation methods
 */
export function getInterpretationMethods(): typeof legalKnowledge.interpretationMethods {
  return legalKnowledge.interpretationMethods;
}

/**
 * Validate reasoning chain for logical consistency
 */
export function validateReasoningChain(steps: ReasoningStep[]): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check for sequential ordering
  const orders = steps.map(s => s.order);
  const isSequential = orders.every((v, i, arr) => i === 0 || v > arr[i - 1]);
  if (!isSequential) {
    issues.push("Muhakeme adımları sıralı değil");
  }

  // Check for evidence support
  const unsupportedSteps = steps.filter(s => s.evidences.length === 0);
  if (unsupportedSteps.length > steps.length * 0.5) {
    issues.push("Adımların çoğunluğu kanıtla desteklenmiyor");
  }

  // Check for low confidence steps
  const lowConfidenceSteps = steps.filter(s => s.confidence < 0.3);
  if (lowConfidenceSteps.length > 0) {
    issues.push(`${lowConfidenceSteps.length} adım düşük güvenilirlikte`);
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Export result to JSON for audit trail
 */
export function exportForAudit(result: ExplainableResult): string {
  return JSON.stringify({
    ...result,
    exportedAt: new Date().toISOString(),
    exportVersion: "1.0",
  }, null, 2);
}

/**
 * Get confidence level label in Turkish
 */
export function getConfidenceLevelLabel(level: ConfidenceLevel): string {
  const labels: Record<ConfidenceLevel, string> = {
    very_high: "Çok Yüksek",
    high: "Yüksek",
    medium: "Orta",
    low: "Düşük",
    very_low: "Çok Düşük",
  };
  return labels[level];
}
