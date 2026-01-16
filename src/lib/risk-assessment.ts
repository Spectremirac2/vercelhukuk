/**
 * Risk Assessment and Scoring Module
 * Hukuki risk değerlendirme ve puanlama sistemi
 *
 * Bu modül:
 * - Dava risklerini değerlendirir
 * - Sözleşme risklerini analiz eder
 * - Uyumluluk risklerini hesaplar
 * - Genel risk skoru üretir
 */

// Risk kategorileri
export type RiskCategory =
  | "legal"        // Hukuki risk
  | "financial"    // Mali risk
  | "operational"  // Operasyonel risk
  | "compliance"   // Uyumluluk riski
  | "reputational" // İtibar riski
  | "contractual"; // Sözleşmesel risk

// Risk seviyesi
export type RiskLevel = "critical" | "high" | "medium" | "low" | "minimal";

// Risk faktörü
export interface RiskFactor {
  id: string;
  name: string;
  category: RiskCategory;
  description: string;
  weight: number; // 0-1 arası ağırlık
  score: number; // 0-100 arası puan
  level: RiskLevel;
  mitigationSuggestions: string[];
  legalBasis?: string;
}

// Risk değerlendirme sonucu
export interface RiskAssessment {
  id: string;
  createdAt: Date;
  assessmentType: "case" | "contract" | "compliance" | "general";
  overallScore: number; // 0-100
  overallLevel: RiskLevel;
  factors: RiskFactor[];
  summary: string;
  recommendations: string[];
  categoryBreakdown: Record<RiskCategory, { score: number; level: RiskLevel }>;
}

// Dava risk değerlendirme girdisi
export interface CaseRiskInput {
  caseType: string;
  claimAmount?: number;
  disputeValue?: number;
  evidenceStrength: "strong" | "moderate" | "weak";
  hasLawyer?: boolean;
  opposingPartyType?: "individual" | "company" | "government";
  description?: string;
  precedentSupport?: "favorable" | "mixed" | "unfavorable" | "none";
  opposingPartyStrength?: "strong" | "moderate" | "weak";
  timelinePressure?: "urgent" | "normal" | "flexible";
  jurisdictionFamiliarity?: "familiar" | "moderate" | "unfamiliar";
  settlementPossibility?: "likely" | "possible" | "unlikely";
  publicityRisk?: "high" | "moderate" | "low";
}

// Sözleşme risk değerlendirme girdisi
export interface ContractRiskInput {
  contractType: string;
  contractValue?: number;
  hasLegalReview?: boolean;
  counterpartyType?: "individual" | "small_business" | "corporation" | "government";
  contractText?: string;
  counterpartyReliability?: "high" | "moderate" | "low" | "unknown";
  termLength?: "short" | "medium" | "long"; // < 1 yıl, 1-5 yıl, > 5 yıl
  exclusivityClause?: boolean;
  penaltyClause?: boolean;
  terminationEase?: "easy" | "moderate" | "difficult";
  jurisdictionClause?: "favorable" | "neutral" | "unfavorable";
  arbitrationClause?: boolean;
  forceNajeureClause?: boolean;
  limitationOfLiability?: boolean;
  confidentialityClause?: boolean;
  intellectualPropertyRisk?: "high" | "moderate" | "low";
}

// Uyumluluk risk değerlendirme girdisi
export interface ComplianceRiskInput {
  industry: string;
  employeeCount: number;
  annualRevenue?: number;
  dataProcessingVolume: "high" | "moderate" | "low";
  internationalOperations: boolean;
  previousViolations: number;
  complianceOfficer: boolean;
  regularAudits: boolean;
  documentedPolicies: boolean;
  employeeTraining: boolean;
  incidentResponsePlan: boolean;
}

// Risk seviyesini hesapla
function calculateRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 40) return "medium";
  if (score >= 20) return "low";
  return "minimal";
}

// Risk seviyesi rengi
export function getRiskLevelColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    critical: "#dc2626", // kırmızı
    high: "#ea580c",     // turuncu
    medium: "#ca8a04",   // sarı
    low: "#16a34a",      // yeşil
    minimal: "#059669",  // koyu yeşil
  };
  return colors[level];
}

// Risk seviyesi adı (Türkçe)
export function getRiskLevelName(level: RiskLevel): string {
  const names: Record<RiskLevel, string> = {
    critical: "Kritik",
    high: "Yüksek",
    medium: "Orta",
    low: "Düşük",
    minimal: "Minimal",
  };
  return names[level];
}

// Kategori adı (Türkçe)
export function getCategoryName(category: RiskCategory): string {
  const names: Record<RiskCategory, string> = {
    legal: "Hukuki Risk",
    financial: "Mali Risk",
    operational: "Operasyonel Risk",
    compliance: "Uyumluluk Riski",
    reputational: "İtibar Riski",
    contractual: "Sözleşmesel Risk",
  };
  return names[category];
}

// Benzersiz ID oluştur
function generateId(): string {
  return `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Dava risk değerlendirmesi
 */
export function assessCaseRisk(input: CaseRiskInput): RiskAssessment {
  const factors: RiskFactor[] = [];
  
  // Default değerler
  const precedentSupport = input.precedentSupport ?? "mixed";
  const opposingPartyStrength = input.opposingPartyStrength ?? 
    (input.opposingPartyType === "government" ? "strong" : 
     input.opposingPartyType === "company" ? "moderate" : "weak");
  const timelinePressure = input.timelinePressure ?? "normal";
  const settlementPossibility = input.settlementPossibility ?? "possible";
  const publicityRisk = input.publicityRisk ?? "moderate";
  const jurisdictionFamiliarity = input.jurisdictionFamiliarity ?? "moderate";

  // Kanıt gücü faktörü
  const evidenceScore = input.evidenceStrength === "strong" ? 20 :
                        input.evidenceStrength === "moderate" ? 50 : 80;
  factors.push({
    id: "evidence_strength",
    name: "Kanıt Gücü",
    category: "legal",
    description: `Kanıt gücü ${input.evidenceStrength === "strong" ? "güçlü" :
                             input.evidenceStrength === "moderate" ? "orta düzeyde" : "zayıf"}`,
    weight: 0.25,
    score: evidenceScore,
    level: calculateRiskLevel(evidenceScore),
    mitigationSuggestions: evidenceScore > 50 ? [
      "Ek delil toplanması önerilir",
      "Tanık ifadeleri güçlendirilmeli",
      "Uzman görüşü alınabilir",
    ] : [],
  });

  // Emsal destek faktörü
  const precedentScore = precedentSupport === "favorable" ? 15 :
                         precedentSupport === "mixed" ? 45 :
                         precedentSupport === "unfavorable" ? 75 : 60;
  factors.push({
    id: "precedent_support",
    name: "Emsal İçtihat Desteği",
    category: "legal",
    description: `Emsal içtihatlar ${precedentSupport === "favorable" ? "lehte" :
                                    precedentSupport === "mixed" ? "karışık" :
                                    precedentSupport === "unfavorable" ? "aleyhte" : "yetersiz"}`,
    weight: 0.20,
    score: precedentScore,
    level: calculateRiskLevel(precedentScore),
    mitigationSuggestions: precedentScore > 40 ? [
      "Yargıtay kararları detaylı incelenmeli",
      "Farklı daire kararları karşılaştırılmalı",
      "Güncel içtihat değişiklikleri takip edilmeli",
    ] : [],
    legalBasis: "HMK m. 33 - Hakim Türk Hukukunu re'sen uygular",
  });

  // Karşı taraf gücü
  const opposingScore = opposingPartyStrength === "strong" ? 70 :
                        opposingPartyStrength === "moderate" ? 45 : 25;
  factors.push({
    id: "opposing_party",
    name: "Karşı Taraf Gücü",
    category: "operational",
    description: `Karşı taraf ${opposingPartyStrength === "strong" ? "güçlü" :
                               opposingPartyStrength === "moderate" ? "orta düzeyde" : "zayıf"}`,
    weight: 0.15,
    score: opposingScore,
    level: calculateRiskLevel(opposingScore),
    mitigationSuggestions: opposingScore > 50 ? [
      "Deneyimli avukat desteği alınmalı",
      "Alternatif uyuşmazlık çözüm yolları değerlendirilmeli",
      "Savunma stratejisi güçlendirilmeli",
    ] : [],
  });

  // Zaman baskısı
  const timeScore = timelinePressure === "urgent" ? 75 :
                    timelinePressure === "normal" ? 35 : 15;
  factors.push({
    id: "timeline_pressure",
    name: "Zaman Baskısı",
    category: "operational",
    description: `Süre baskısı ${timelinePressure === "urgent" ? "acil" :
                                timelinePressure === "normal" ? "normal" : "esnek"}`,
    weight: 0.10,
    score: timeScore,
    level: calculateRiskLevel(timeScore),
    mitigationSuggestions: timeScore > 50 ? [
      "Süre uzatım talepleri değerlendirilmeli",
      "Öncelikli işlemler belirlenmeli",
      "Kaynak planlaması yapılmalı",
    ] : [],
  });

  // Sulh olasılığı
  const settlementScore = settlementPossibility === "likely" ? 20 :
                          settlementPossibility === "possible" ? 45 : 70;
  factors.push({
    id: "settlement",
    name: "Sulh Olasılığı",
    category: "financial",
    description: `Sulh ${settlementPossibility === "likely" ? "muhtemel" :
                        settlementPossibility === "possible" ? "mümkün" : "zor"}`,
    weight: 0.15,
    score: settlementScore,
    level: calculateRiskLevel(settlementScore),
    mitigationSuggestions: settlementScore > 40 ? [
      "Arabuluculuk görüşmeleri başlatılabilir",
      "Karşı tarafa sulh teklifi sunulabilir",
      "Uzlaşma koşulları belirlenmeli",
    ] : [],
    legalBasis: "HMK m. 137-142 - Sulh",
  });

  // Kamuoyu riski
  const publicityScore = publicityRisk === "high" ? 80 :
                         publicityRisk === "moderate" ? 45 : 15;
  factors.push({
    id: "publicity",
    name: "Kamuoyu Riski",
    category: "reputational",
    description: `Kamuoyu etkisi ${publicityRisk === "high" ? "yüksek" :
                                  publicityRisk === "moderate" ? "orta" : "düşük"}`,
    weight: 0.15,
    score: publicityScore,
    level: calculateRiskLevel(publicityScore),
    mitigationSuggestions: publicityScore > 40 ? [
      "İletişim stratejisi hazırlanmalı",
      "Gizlilik tedbirleri değerlendirilmeli",
      "Kriz yönetim planı oluşturulmalı",
    ] : [],
  });

  // Genel skoru hesapla
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const overallScore = Math.round(
    factors.reduce((sum, f) => sum + f.score * f.weight, 0) / totalWeight
  );

  // Kategori bazlı breakdown
  const categoryBreakdown = calculateCategoryBreakdown(factors);

  // Özet ve öneriler
  const summary = generateCaseSummary(overallScore, input);
  const recommendations = generateCaseRecommendations(factors, input);

  return {
    id: generateId(),
    createdAt: new Date(),
    assessmentType: "case",
    overallScore,
    overallLevel: calculateRiskLevel(overallScore),
    factors,
    summary,
    recommendations,
    categoryBreakdown,
  };
}

/**
 * Sözleşme risk değerlendirmesi
 */
export function assessContractRisk(input: ContractRiskInput): RiskAssessment {
  const factors: RiskFactor[] = [];

  // Default değerler
  const counterpartyReliability = input.counterpartyReliability ?? 
    (input.counterpartyType === "government" ? "high" :
     input.counterpartyType === "corporation" ? "moderate" : 
     input.counterpartyType === "small_business" ? "low" : "unknown");
  const termLength = input.termLength ?? "medium";
  const exclusivityClause = input.exclusivityClause ?? false;
  const penaltyClause = input.penaltyClause ?? false;
  const terminationEase = input.terminationEase ?? "moderate";
  const jurisdictionClause = input.jurisdictionClause ?? "neutral";
  const arbitrationClause = input.arbitrationClause ?? false;
  const forceNajeureClause = input.forceNajeureClause ?? false;
  const limitationOfLiability = input.limitationOfLiability ?? false;
  const confidentialityClause = input.confidentialityClause ?? false;
  const intellectualPropertyRisk = input.intellectualPropertyRisk ?? "moderate";

  // Karşı taraf güvenilirliği
  const counterpartyScore = counterpartyReliability === "high" ? 15 :
                            counterpartyReliability === "moderate" ? 40 :
                            counterpartyReliability === "low" ? 75 : 60;
  factors.push({
    id: "counterparty_reliability",
    name: "Karşı Taraf Güvenilirliği",
    category: "contractual",
    description: `Karşı taraf güvenilirliği ${counterpartyReliability === "high" ? "yüksek" :
                                              counterpartyReliability === "moderate" ? "orta" :
                                              counterpartyReliability === "low" ? "düşük" : "bilinmiyor"}`,
    weight: 0.20,
    score: counterpartyScore,
    level: calculateRiskLevel(counterpartyScore),
    mitigationSuggestions: counterpartyScore > 40 ? [
      "Karşı taraf hakkında detaylı araştırma yapılmalı",
      "Referans kontrolü yapılmalı",
      "Teminat/depozito talep edilebilir",
    ] : [],
  });

  // Sözleşme süresi riski
  const termScore = termLength === "long" ? 65 :
                    termLength === "medium" ? 40 : 20;
  factors.push({
    id: "term_length",
    name: "Sözleşme Süresi",
    category: "contractual",
    description: `Sözleşme süresi ${termLength === "long" ? "uzun (5+ yıl)" :
                                   termLength === "medium" ? "orta (1-5 yıl)" : "kısa (< 1 yıl)"}`,
    weight: 0.10,
    score: termScore,
    level: calculateRiskLevel(termScore),
    mitigationSuggestions: termScore > 40 ? [
      "Periyodik gözden geçirme maddeleri eklenebilir",
      "Fiyat güncelleme mekanizması önerilir",
      "Erken fesih koşulları netleştirilmeli",
    ] : [],
  });

  // Münhasırlık riski
  if (exclusivityClause) {
    factors.push({
      id: "exclusivity",
      name: "Münhasırlık Maddesi",
      category: "contractual",
      description: "Sözleşmede münhasırlık maddesi mevcut",
      weight: 0.15,
      score: 70,
      level: "high",
      mitigationSuggestions: [
        "Münhasırlık kapsamı sınırlandırılmalı",
        "Coğrafi veya sektörel sınırlar belirlenmeli",
        "Performans koşullarına bağlanabilir",
      ],
      legalBasis: "TBK m. 27 - Aşırı yükümlülük",
    });
  }

  // Ceza koşulu riski
  if (penaltyClause) {
    factors.push({
      id: "penalty",
      name: "Ceza Koşulu",
      category: "financial",
      description: "Sözleşmede ceza koşulu mevcut",
      weight: 0.15,
      score: 55,
      level: "medium",
      mitigationSuggestions: [
        "Ceza miktarının orantılılığı değerlendirilmeli",
        "Üst limit belirlenmeli",
        "Karşılıklılık sağlanmalı",
      ],
      legalBasis: "TBK m. 179-182 - Ceza Koşulu",
    });
  }

  // Fesih kolaylığı
  const terminationScore = terminationEase === "difficult" ? 70 :
                           terminationEase === "moderate" ? 40 : 15;
  factors.push({
    id: "termination",
    name: "Fesih Zorluğu",
    category: "operational",
    description: `Fesih ${terminationEase === "difficult" ? "zor" :
                         terminationEase === "moderate" ? "orta düzeyde" : "kolay"}`,
    weight: 0.15,
    score: terminationScore,
    level: calculateRiskLevel(terminationScore),
    mitigationSuggestions: terminationScore > 40 ? [
      "Haklı nedenle fesih halleri genişletilmeli",
      "İhbar süreleri makul belirlenmeli",
      "Çıkış stratejisi planlanmalı",
    ] : [],
    legalBasis: "TBK m. 430 - Haklı nedenle fesih",
  });

  // Yetki maddesi
  const jurisdictionScore = jurisdictionClause === "favorable" ? 15 :
                            jurisdictionClause === "neutral" ? 35 : 65;
  factors.push({
    id: "jurisdiction",
    name: "Yetki Maddesi",
    category: "legal",
    description: `Yetki maddesi ${jurisdictionClause === "favorable" ? "lehte" :
                                 jurisdictionClause === "neutral" ? "nötr" : "aleyhte"}`,
    weight: 0.10,
    score: jurisdictionScore,
    level: calculateRiskLevel(jurisdictionScore),
    mitigationSuggestions: jurisdictionScore > 40 ? [
      "Yetkili mahkeme değişikliği müzakere edilmeli",
      "Alternatif yetki maddeleri önerilmeli",
      "Yargılama maliyetleri değerlendirilmeli",
    ] : [],
    legalBasis: "HMK m. 17-18 - Yetki Sözleşmesi",
  });

  // Fikri mülkiyet riski
  const ipScore = intellectualPropertyRisk === "high" ? 75 :
                  intellectualPropertyRisk === "moderate" ? 45 : 20;
  factors.push({
    id: "intellectual_property",
    name: "Fikri Mülkiyet Riski",
    category: "legal",
    description: `Fikri mülkiyet riski ${intellectualPropertyRisk === "high" ? "yüksek" :
                                        intellectualPropertyRisk === "moderate" ? "orta" : "düşük"}`,
    weight: 0.15,
    score: ipScore,
    level: calculateRiskLevel(ipScore),
    mitigationSuggestions: ipScore > 40 ? [
      "Fikri mülkiyet hakları netleştirilmeli",
      "Lisans kapsamı belirlenmeli",
      "İhlal durumunda tazminat maddeleri eklenmeli",
    ] : [],
    legalBasis: "FSEK, SMK",
  });

  // Eksik madde kontrolleri
  if (!forceNajeureClause) {
    factors.push({
      id: "force_majeure_missing",
      name: "Mücbir Sebep Maddesi Eksik",
      category: "contractual",
      description: "Sözleşmede mücbir sebep maddesi bulunmuyor",
      weight: 0.10,
      score: 55,
      level: "medium",
      mitigationSuggestions: [
        "Mücbir sebep maddesi eklenmeli",
        "COVID-19 benzeri durumlar kapsanmalı",
        "Bildirim süreleri belirlenmeli",
      ],
      legalBasis: "TBK m. 136 - İfa imkansızlığı",
    });
  }

  if (!limitationOfLiability) {
    factors.push({
      id: "liability_limitation_missing",
      name: "Sorumluluk Sınırı Eksik",
      category: "financial",
      description: "Sözleşmede sorumluluk sınırı belirlenmemiş",
      weight: 0.10,
      score: 60,
      level: "medium",
      mitigationSuggestions: [
        "Sorumluluk üst limiti belirlenmeli",
        "Dolaylı zararlar hariç tutulmalı",
        "Sigorta yaptırılmalı",
      ],
    });
  }

  // Genel skoru hesapla
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const overallScore = Math.round(
    factors.reduce((sum, f) => sum + f.score * f.weight, 0) / totalWeight
  );

  const categoryBreakdown = calculateCategoryBreakdown(factors);
  const summary = generateContractSummary(overallScore, input);
  const recommendations = generateContractRecommendations(factors, input);

  return {
    id: generateId(),
    createdAt: new Date(),
    assessmentType: "contract",
    overallScore,
    overallLevel: calculateRiskLevel(overallScore),
    factors,
    summary,
    recommendations,
    categoryBreakdown,
  };
}

/**
 * Uyumluluk risk değerlendirmesi
 */
export function assessComplianceRisk(input: ComplianceRiskInput): RiskAssessment {
  const factors: RiskFactor[] = [];

  // Veri işleme hacmi
  const dataScore = input.dataProcessingVolume === "high" ? 70 :
                    input.dataProcessingVolume === "moderate" ? 45 : 20;
  factors.push({
    id: "data_processing",
    name: "Veri İşleme Hacmi",
    category: "compliance",
    description: `Kişisel veri işleme hacmi ${input.dataProcessingVolume === "high" ? "yüksek" :
                                              input.dataProcessingVolume === "moderate" ? "orta" : "düşük"}`,
    weight: 0.20,
    score: dataScore,
    level: calculateRiskLevel(dataScore),
    mitigationSuggestions: dataScore > 40 ? [
      "KVKK uyum programı oluşturulmalı",
      "Veri envanteri çıkarılmalı",
      "VERBİS kaydı kontrol edilmeli",
    ] : [],
    legalBasis: "KVKK m. 4 - Genel ilkeler",
  });

  // Uluslararası operasyonlar
  if (input.internationalOperations) {
    factors.push({
      id: "international_ops",
      name: "Uluslararası Operasyonlar",
      category: "compliance",
      description: "Şirketin uluslararası operasyonları mevcut",
      weight: 0.15,
      score: 65,
      level: "high",
      mitigationSuggestions: [
        "GDPR uyumluluğu değerlendirilmeli",
        "Veri transfer mekanizmaları gözden geçirilmeli",
        "Yerel hukuk danışmanlığı alınmalı",
      ],
      legalBasis: "KVKK m. 9 - Yurt dışına veri aktarımı",
    });
  }

  // Önceki ihlaller
  const violationScore = input.previousViolations === 0 ? 10 :
                         input.previousViolations <= 2 ? 50 : 85;
  factors.push({
    id: "previous_violations",
    name: "Önceki İhlaller",
    category: "compliance",
    description: `${input.previousViolations} adet önceki ihlal kaydı`,
    weight: 0.20,
    score: violationScore,
    level: calculateRiskLevel(violationScore),
    mitigationSuggestions: violationScore > 30 ? [
      "Kök neden analizi yapılmalı",
      "Düzeltici eylem planı oluşturulmalı",
      "İç kontroller güçlendirilmeli",
    ] : [],
  });

  // Uyum görevlisi
  if (!input.complianceOfficer) {
    factors.push({
      id: "no_compliance_officer",
      name: "Uyum Görevlisi Eksik",
      category: "operational",
      description: "Atanmış bir uyum görevlisi bulunmuyor",
      weight: 0.10,
      score: 55,
      level: "medium",
      mitigationSuggestions: [
        "Uyum görevlisi atanmalı",
        "Veri sorumlusu temsilcisi belirlenmeli",
        "Uyum birimi kurulmalı",
      ],
      legalBasis: "KVKK m. 13 - Veri sorumlusu",
    });
  }

  // Düzenli denetimler
  const auditScore = input.regularAudits ? 20 : 60;
  factors.push({
    id: "audits",
    name: "Düzenli Denetimler",
    category: "operational",
    description: input.regularAudits ? "Düzenli denetimler yapılıyor" : "Düzenli denetim yapılmıyor",
    weight: 0.10,
    score: auditScore,
    level: calculateRiskLevel(auditScore),
    mitigationSuggestions: !input.regularAudits ? [
      "Yıllık iç denetim programı oluşturulmalı",
      "Bağımsız denetim yaptırılmalı",
      "Denetim bulguları takip edilmeli",
    ] : [],
  });

  // Dokümante politikalar
  const policyScore = input.documentedPolicies ? 15 : 65;
  factors.push({
    id: "policies",
    name: "Dokümante Politikalar",
    category: "compliance",
    description: input.documentedPolicies ? "Politikalar dokümante edilmiş" : "Politikalar dokümante edilmemiş",
    weight: 0.10,
    score: policyScore,
    level: calculateRiskLevel(policyScore),
    mitigationSuggestions: !input.documentedPolicies ? [
      "Kişisel veri işleme politikası hazırlanmalı",
      "Bilgi güvenliği politikası oluşturulmalı",
      "Gizlilik politikası yayınlanmalı",
    ] : [],
  });

  // Çalışan eğitimi
  const trainingScore = input.employeeTraining ? 15 : 55;
  factors.push({
    id: "training",
    name: "Çalışan Eğitimi",
    category: "operational",
    description: input.employeeTraining ? "Düzenli eğitimler veriliyor" : "Çalışan eğitimi yetersiz",
    weight: 0.10,
    score: trainingScore,
    level: calculateRiskLevel(trainingScore),
    mitigationSuggestions: !input.employeeTraining ? [
      "Yıllık KVKK eğitimi planlanmalı",
      "Farkındalık programı oluşturulmalı",
      "Eğitim kayıtları tutulmalı",
    ] : [],
  });

  // Olay müdahale planı
  const incidentScore = input.incidentResponsePlan ? 15 : 70;
  factors.push({
    id: "incident_response",
    name: "Olay Müdahale Planı",
    category: "operational",
    description: input.incidentResponsePlan ? "Olay müdahale planı mevcut" : "Olay müdahale planı eksik",
    weight: 0.10,
    score: incidentScore,
    level: calculateRiskLevel(incidentScore),
    mitigationSuggestions: !input.incidentResponsePlan ? [
      "Veri ihlali müdahale planı hazırlanmalı",
      "72 saat bildirim prosedürü belirlenmeli",
      "Olay müdahale ekibi oluşturulmalı",
    ] : [],
    legalBasis: "KVKK m. 12 - Veri güvenliği, ihlal bildirimi",
  });

  // Çalışan sayısına göre ek risk
  if (input.employeeCount > 50) {
    factors.push({
      id: "employee_count",
      name: "Organizasyon Büyüklüğü",
      category: "operational",
      description: `${input.employeeCount} çalışan ile büyük organizasyon`,
      weight: 0.05,
      score: input.employeeCount > 250 ? 55 : 40,
      level: input.employeeCount > 250 ? "medium" : "medium",
      mitigationSuggestions: [
        "Departman bazlı uyum sorumluları atanmalı",
        "İç iletişim kanalları güçlendirilmeli",
        "Ölçeklendirilebilir uyum programı kurulmalı",
      ],
    });
  }

  // Genel skoru hesapla
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const overallScore = Math.round(
    factors.reduce((sum, f) => sum + f.score * f.weight, 0) / totalWeight
  );

  const categoryBreakdown = calculateCategoryBreakdown(factors);
  const summary = generateComplianceSummary(overallScore, input);
  const recommendations = generateComplianceRecommendations(factors, input);

  return {
    id: generateId(),
    createdAt: new Date(),
    assessmentType: "compliance",
    overallScore,
    overallLevel: calculateRiskLevel(overallScore),
    factors,
    summary,
    recommendations,
    categoryBreakdown,
  };
}

// Kategori bazlı breakdown hesapla
function calculateCategoryBreakdown(
  factors: RiskFactor[]
): Record<RiskCategory, { score: number; level: RiskLevel }> {
  const categories: RiskCategory[] = [
    "legal", "financial", "operational", "compliance", "reputational", "contractual"
  ];

  const breakdown: Record<RiskCategory, { score: number; level: RiskLevel }> = {} as any;

  for (const category of categories) {
    const categoryFactors = factors.filter(f => f.category === category);
    if (categoryFactors.length > 0) {
      const avgScore = Math.round(
        categoryFactors.reduce((sum, f) => sum + f.score, 0) / categoryFactors.length
      );
      breakdown[category] = {
        score: avgScore,
        level: calculateRiskLevel(avgScore),
      };
    } else {
      breakdown[category] = { score: 0, level: "minimal" };
    }
  }

  return breakdown;
}

// Dava özeti oluştur
function generateCaseSummary(score: number, input: CaseRiskInput): string {
  const level = calculateRiskLevel(score);
  let summary = `Bu dava için genel risk seviyesi ${getRiskLevelName(level).toLowerCase()} (%${score}) olarak değerlendirilmiştir. `;

  if (input.evidenceStrength === "weak") {
    summary += "Kanıt gücünün zayıf olması önemli bir risk faktörüdür. ";
  }
  if (input.precedentSupport && (input.precedentSupport === "unfavorable" || input.precedentSupport === "none")) {
    summary += "Emsal içtihat desteğinin yetersizliği dikkate alınmalıdır. ";
  }
  if (input.publicityRisk && input.publicityRisk === "high") {
    summary += "Yüksek kamuoyu ilgisi itibar riski oluşturmaktadır. ";
  }

  return summary;
}

// Sözleşme özeti oluştur
function generateContractSummary(score: number, input: ContractRiskInput): string {
  const level = calculateRiskLevel(score);
  let summary = `Bu sözleşme için genel risk seviyesi ${getRiskLevelName(level).toLowerCase()} (%${score}) olarak değerlendirilmiştir. `;

  const counterpartyReliability = input.counterpartyReliability ?? "unknown";
  const exclusivityClause = input.exclusivityClause ?? false;
  const terminationEase = input.terminationEase ?? "moderate";

  if (counterpartyReliability === "low" || counterpartyReliability === "unknown") {
    summary += "Karşı taraf güvenilirliği konusunda dikkatli olunmalıdır. ";
  }
  if (exclusivityClause) {
    summary += "Münhasırlık maddesi esnekliği kısıtlamaktadır. ";
  }
  if (terminationEase === "difficult") {
    summary += "Fesih koşullarının zorluğu uzun vadeli bağlılık riski oluşturmaktadır. ";
  }

  return summary;
}

// Uyumluluk özeti oluştur
function generateComplianceSummary(score: number, input: ComplianceRiskInput): string {
  const level = calculateRiskLevel(score);
  let summary = `Uyumluluk risk seviyesi ${getRiskLevelName(level).toLowerCase()} (%${score}) olarak değerlendirilmiştir. `;

  if (input.previousViolations > 0) {
    summary += `Önceki ${input.previousViolations} ihlal kaydı dikkate alınmalıdır. `;
  }
  if (input.dataProcessingVolume === "high") {
    summary += "Yüksek veri işleme hacmi ek önlemler gerektirmektedir. ";
  }
  if (input.internationalOperations) {
    summary += "Uluslararası operasyonlar çoklu yargı yetkisi uyumluluğu gerektirmektedir. ";
  }

  return summary;
}

// Dava önerileri oluştur
function generateCaseRecommendations(factors: RiskFactor[], input: CaseRiskInput): string[] {
  const recommendations: string[] = [];

  // Yüksek riskli faktörlerden öneriler topla
  const highRiskFactors = factors.filter(f => f.score >= 60);
  highRiskFactors.forEach(f => {
    if (f.mitigationSuggestions.length > 0) {
      recommendations.push(f.mitigationSuggestions[0]);
    }
  });

  // Genel öneriler
  if (input.settlementPossibility !== "unlikely") {
    recommendations.push("Sulh/arabuluculuk seçenekleri değerlendirilmelidir");
  }

  if (recommendations.length === 0) {
    recommendations.push("Mevcut strateji ile devam edilebilir");
  }

  return [...new Set(recommendations)].slice(0, 5);
}

// Sözleşme önerileri oluştur
function generateContractRecommendations(factors: RiskFactor[], input: ContractRiskInput): string[] {
  const recommendations: string[] = [];

  const highRiskFactors = factors.filter(f => f.score >= 60);
  highRiskFactors.forEach(f => {
    if (f.mitigationSuggestions.length > 0) {
      recommendations.push(f.mitigationSuggestions[0]);
    }
  });

  // Eksik maddeler için öneriler
  if (!forceNajeureClause) {
    recommendations.push("Mücbir sebep maddesi eklenmesi önerilir");
  }
  if (!limitationOfLiability) {
    recommendations.push("Sorumluluk sınırı belirlenmesi önerilir");
  }
  if (!arbitrationClause && jurisdictionClause === "unfavorable") {
    recommendations.push("Tahkim maddesi alternatif olarak değerlendirilebilir");
  }

  if (recommendations.length === 0) {
    recommendations.push("Sözleşme koşulları genel olarak uygun görünmektedir");
  }

  return [...new Set(recommendations)].slice(0, 5);
}

// Uyumluluk önerileri oluştur
function generateComplianceRecommendations(factors: RiskFactor[], input: ComplianceRiskInput): string[] {
  const recommendations: string[] = [];

  const highRiskFactors = factors.filter(f => f.score >= 60);
  highRiskFactors.forEach(f => {
    if (f.mitigationSuggestions.length > 0) {
      recommendations.push(f.mitigationSuggestions[0]);
    }
  });

  // Öncelikli öneriler
  if (!input.complianceOfficer) {
    recommendations.unshift("Uyum görevlisi atanması önceliklidir");
  }
  if (!input.incidentResponsePlan) {
    recommendations.push("Veri ihlali müdahale planı acilen hazırlanmalıdır");
  }
  if (input.dataProcessingVolume === "high" && !input.documentedPolicies) {
    recommendations.push("Kişisel veri işleme politikası derhal dokümante edilmelidir");
  }

  if (recommendations.length === 0) {
    recommendations.push("Uyumluluk durumu genel olarak iyi seviyededir");
  }

  return [...new Set(recommendations)].slice(0, 5);
}

/**
 * Risk değerlendirmesi raporu oluştur
 */
export function generateRiskReport(assessment: RiskAssessment): string {
  const lines: string[] = [];

  lines.push("═".repeat(60));
  lines.push("           RİSK DEĞERLENDİRME RAPORU");
  lines.push("═".repeat(60));
  lines.push("");
  lines.push(`Değerlendirme Tarihi: ${assessment.createdAt.toLocaleDateString("tr-TR")}`);
  lines.push(`Değerlendirme Türü: ${getAssessmentTypeName(assessment.assessmentType)}`);
  lines.push(`Değerlendirme ID: ${assessment.id}`);
  lines.push("");
  lines.push("─".repeat(60));
  lines.push("GENEL DEĞERLENDİRME");
  lines.push("─".repeat(60));
  lines.push(`Risk Skoru: %${assessment.overallScore}`);
  lines.push(`Risk Seviyesi: ${getRiskLevelName(assessment.overallLevel)}`);
  lines.push("");
  lines.push("Özet:");
  lines.push(assessment.summary);
  lines.push("");
  lines.push("─".repeat(60));
  lines.push("KATEGORİ BAZLI ANALİZ");
  lines.push("─".repeat(60));

  for (const [category, data] of Object.entries(assessment.categoryBreakdown)) {
    if (data.score > 0) {
      lines.push(`${getCategoryName(category as RiskCategory)}: %${data.score} (${getRiskLevelName(data.level)})`);
    }
  }

  lines.push("");
  lines.push("─".repeat(60));
  lines.push("RİSK FAKTÖRLERİ");
  lines.push("─".repeat(60));

  // Faktörleri risk skoruna göre sırala
  const sortedFactors = [...assessment.factors].sort((a, b) => b.score - a.score);

  for (const factor of sortedFactors) {
    lines.push(`\n● ${factor.name}`);
    lines.push(`  Risk Skoru: %${factor.score} (${getRiskLevelName(factor.level)})`);
    lines.push(`  ${factor.description}`);
    if (factor.legalBasis) {
      lines.push(`  Yasal Dayanak: ${factor.legalBasis}`);
    }
    if (factor.mitigationSuggestions.length > 0 && factor.score >= 40) {
      lines.push("  Önerilen Aksiyonlar:");
      factor.mitigationSuggestions.forEach(s => {
        lines.push(`    - ${s}`);
      });
    }
  }

  lines.push("");
  lines.push("─".repeat(60));
  lines.push("ÖNERİLER");
  lines.push("─".repeat(60));

  assessment.recommendations.forEach((rec, i) => {
    lines.push(`${i + 1}. ${rec}`);
  });

  lines.push("");
  lines.push("═".repeat(60));
  lines.push("Bu rapor otomatik olarak oluşturulmuştur.");
  lines.push("Kesin hukuki değerlendirme için avukata danışınız.");
  lines.push("═".repeat(60));

  return lines.join("\n");
}

function getAssessmentTypeName(type: string): string {
  const names: Record<string, string> = {
    case: "Dava Risk Değerlendirmesi",
    contract: "Sözleşme Risk Değerlendirmesi",
    compliance: "Uyumluluk Risk Değerlendirmesi",
    general: "Genel Risk Değerlendirmesi",
  };
  return names[type] || type;
}

/**
 * Risk skorunu görsel olarak formatla
 */
export function formatRiskScore(score: number): string {
  const level = calculateRiskLevel(score);
  const bars = Math.round(score / 10);
  const filled = "█".repeat(bars);
  const empty = "░".repeat(10 - bars);
  return `${filled}${empty} %${score} (${getRiskLevelName(level)})`;
}

/**
 * Tüm risk kategorilerini getir
 */
export function getRiskCategories(): Array<{ id: RiskCategory; name: string }> {
  return [
    { id: "legal", name: "Hukuki Risk" },
    { id: "financial", name: "Mali Risk" },
    { id: "operational", name: "Operasyonel Risk" },
    { id: "compliance", name: "Uyumluluk Riski" },
    { id: "reputational", name: "İtibar Riski" },
    { id: "contractual", name: "Sözleşmesel Risk" },
  ];
}

/**
 * Risk seviyelerini getir
 */
export function getRiskLevels(): Array<{ id: RiskLevel; name: string; color: string }> {
  return [
    { id: "critical", name: "Kritik", color: "#dc2626" },
    { id: "high", name: "Yüksek", color: "#ea580c" },
    { id: "medium", name: "Orta", color: "#ca8a04" },
    { id: "low", name: "Düşük", color: "#16a34a" },
    { id: "minimal", name: "Minimal", color: "#059669" },
  ];
}
