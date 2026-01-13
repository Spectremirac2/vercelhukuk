/**
 * Legal Compliance Checker
 *
 * Checks documents and contracts for compliance with Turkish laws:
 * - KVKK (6698 sayılı Kişisel Verilerin Korunması Kanunu)
 * - İş Kanunu (4857 sayılı)
 * - Türk Ticaret Kanunu (6102 sayılı)
 * - Türk Borçlar Kanunu (6098 sayılı)
 * - Tüketicinin Korunması Hakkında Kanun (6502 sayılı)
 *
 * Based on 2025-2026 legal AI trends for automated compliance checking.
 */

export type ComplianceArea =
  | "kvkk"
  | "is_kanunu"
  | "ticaret_kanunu"
  | "borclar_kanunu"
  | "tuketici_kanunu"
  | "rekabet_kanunu"
  | "bankacilik"
  | "elektrik_piyasasi";

export type ComplianceSeverity = "uyarı" | "ihlal" | "kritik_ihlal";

export interface ComplianceCheck {
  area: ComplianceArea;
  areaName: string;
  passed: boolean;
  score: number; // 0-100
  findings: ComplianceFinding[];
  recommendations: string[];
  legalBasis: string[];
}

export interface ComplianceFinding {
  id: string;
  severity: ComplianceSeverity;
  title: string;
  description: string;
  location?: string;
  legalReference: string;
  remediation: string;
  deadline?: string;
}

export interface ComplianceReport {
  overallScore: number;
  overallStatus: "uyumlu" | "kısmen_uyumlu" | "uyumsuz";
  checks: ComplianceCheck[];
  criticalFindings: ComplianceFinding[];
  summary: string;
  generatedAt: Date;
}

// KVKK Compliance Rules
const KVKK_RULES = {
  // Madde 5 - Kişisel verilerin işlenme şartları
  m5_acik_riza: {
    pattern: /açık rıza|açıkça onay|yazılı izin/i,
    required: true,
    finding: "Açık rıza düzenlemesi eksik",
    reference: "KVKK m.5",
    remediation: "Kişisel veri işleme için açık rıza metni eklenmeli",
  },
  // Madde 10 - Aydınlatma yükümlülüğü
  m10_aydinlatma: {
    pattern: /aydınlatma|veri sorumlusu|işleme amacı|aktarım/i,
    required: true,
    finding: "Aydınlatma metni eksik veya yetersiz",
    reference: "KVKK m.10",
    remediation: "Veri sorumlusu kimliği, işleme amacı ve haklar bilgisi eklenmeli",
  },
  // Madde 11 - İlgili kişinin hakları
  m11_haklar: {
    pattern: /silme.*talep|düzeltme.*talep|itiraz hakkı|bilgi alma hakkı/i,
    required: false,
    finding: "İlgili kişi hakları tam olarak belirtilmemiş",
    reference: "KVKK m.11",
    remediation: "Kişisel veri sahibinin hakları açıkça belirtilmeli",
  },
  // Madde 12 - Veri güvenliği
  m12_guvenlik: {
    pattern: /veri güvenliği|şifreleme|erişim kontrolü|güvenlik önlemi/i,
    required: false,
    finding: "Veri güvenliği önlemleri belirtilmemiş",
    reference: "KVKK m.12",
    remediation: "Alınan teknik ve idari tedbirler belirtilmeli",
  },
};

// İş Kanunu Compliance Rules
const IS_KANUNU_RULES = {
  // Madde 8 - İş sözleşmesi
  m8_yazili_sozlesme: {
    pattern: /iş sözleşmesi|hizmet akdi|çalışma koşulları/i,
    finding: "İş sözleşmesi şartları eksik",
    reference: "İş Kanunu m.8",
  },
  // Madde 17 - Fesih bildirimi
  m17_fesih: {
    pattern: /ihbar süresi|fesih bildirimi|bildirim süresi/i,
    finding: "İhbar süresi düzenlemesi eksik",
    reference: "İş Kanunu m.17",
    values: {
      "6 aydan az": "2 hafta",
      "6 ay - 1.5 yıl": "4 hafta",
      "1.5 - 3 yıl": "6 hafta",
      "3 yıldan fazla": "8 hafta",
    },
  },
  // Madde 32 - Ücret
  m32_ucret: {
    pattern: /ücret|maaş|ödeme|brüt|net/i,
    finding: "Ücret düzenlemesi eksik veya belirsiz",
    reference: "İş Kanunu m.32",
  },
  // Madde 41 - Fazla çalışma
  m41_fazla_calisma: {
    pattern: /fazla çalışma|fazla mesai|overtime/i,
    finding: "Fazla çalışma ücreti düzenlemesi eksik",
    reference: "İş Kanunu m.41",
    limit: "Yıllık 270 saat",
  },
  // Madde 46 - Hafta tatili
  m46_tatil: {
    pattern: /hafta tatili|yıllık izin|ulusal bayram/i,
    finding: "Tatil ve izin hakları eksik",
    reference: "İş Kanunu m.46, m.53",
  },
  // Madde 25 - Haklı fesih
  m25_hakli_fesih: {
    pattern: /haklı fesih|derhal fesih|haklı nedenle/i,
    finding: "Haklı fesih koşulları belirsiz",
    reference: "İş Kanunu m.25",
  },
};

// Tüketici Kanunu Rules
const TUKETICI_RULES = {
  // Madde 48 - Cayma hakkı
  m48_cayma: {
    pattern: /cayma hakkı|14 gün|iade hakkı/i,
    required: true,
    finding: "Cayma hakkı bilgisi eksik",
    reference: "TKHK m.48",
    remediation: "14 günlük cayma hakkı açıkça belirtilmeli",
  },
  // Madde 4 - Haksız şartlar
  m4_haksiz_sart: {
    patterns: [
      /tek taraflı değişiklik/i,
      /sınırsız sorumluluk/i,
      /tüm riskleri.*üstlenir/i,
    ],
    finding: "Haksız şart olabilecek hüküm",
    reference: "TKHK m.4",
  },
  // Madde 5 - Bilgilendirme yükümlülüğü
  m5_bilgilendirme: {
    pattern: /satıcı bilgileri|iletişim|adres/i,
    finding: "Satıcı bilgilendirmesi eksik",
    reference: "TKHK m.5",
  },
};

// TBK Rules
const BORCLAR_RULES = {
  // Madde 27 - Aşırı yararlanma
  m27_gabin: {
    patterns: [
      /aşırı fiyat/i,
      /orantısız edim/i,
    ],
    finding: "Aşırı yararlanma (gabin) riski",
    reference: "TBK m.28",
  },
  // Madde 20 - Genel işlem koşulları
  m20_gis: {
    patterns: [
      /standart sözleşme/i,
      /matbu form/i,
    ],
    finding: "Genel işlem koşulları denetimi gerekebilir",
    reference: "TBK m.20-25",
  },
  // Madde 445 - Rekabet yasağı
  m445_rekabet: {
    pattern: /rekabet yasağı/i,
    limits: {
      sure: "2 yıl",
      kapsam: "İş alanı ve coğrafi sınır belirtilmeli",
    },
    finding: "Rekabet yasağı sınırları aşılmış olabilir",
    reference: "TBK m.444-447",
  },
};

/**
 * Run comprehensive compliance check
 */
export function runComplianceCheck(
  text: string,
  areas?: ComplianceArea[]
): ComplianceReport {
  const areasToCheck = areas || [
    "kvkk",
    "is_kanunu",
    "borclar_kanunu",
    "tuketici_kanunu",
  ];

  const checks: ComplianceCheck[] = [];

  for (const area of areasToCheck) {
    const check = checkArea(text, area);
    checks.push(check);
  }

  // Calculate overall score
  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  const overallScore = Math.round(totalScore / checks.length);

  // Determine overall status
  let overallStatus: "uyumlu" | "kısmen_uyumlu" | "uyumsuz";
  if (overallScore >= 80) overallStatus = "uyumlu";
  else if (overallScore >= 50) overallStatus = "kısmen_uyumlu";
  else overallStatus = "uyumsuz";

  // Collect critical findings
  const criticalFindings = checks
    .flatMap((c) => c.findings)
    .filter((f) => f.severity === "kritik_ihlal");

  // Generate summary
  const summary = generateSummary(checks, overallScore);

  return {
    overallScore,
    overallStatus,
    checks,
    criticalFindings,
    summary,
    generatedAt: new Date(),
  };
}

/**
 * Check a specific compliance area
 */
function checkArea(text: string, area: ComplianceArea): ComplianceCheck {
  switch (area) {
    case "kvkk":
      return checkKVKK(text);
    case "is_kanunu":
      return checkIsKanunu(text);
    case "borclar_kanunu":
      return checkBorclarKanunu(text);
    case "tuketici_kanunu":
      return checkTuketiciKanunu(text);
    default:
      return createEmptyCheck(area);
  }
}

/**
 * Check KVKK compliance
 */
function checkKVKK(text: string): ComplianceCheck {
  const findings: ComplianceFinding[] = [];
  const recommendations: string[] = [];
  const legalBasis: string[] = ["6698 sayılı KVKK"];
  let score = 100;

  // Check if document contains personal data references
  const hasPersonalData = /kişisel veri|kişisel bilgi|tc kimlik|telefon|e-?posta|adres/i.test(text);

  if (hasPersonalData) {
    // Check each KVKK rule
    for (const [ruleId, rule] of Object.entries(KVKK_RULES)) {
      if (!rule.pattern.test(text)) {
        const severity: ComplianceSeverity = rule.required ? "ihlal" : "uyarı";
        findings.push({
          id: `kvkk_${ruleId}`,
          severity,
          title: rule.finding,
          description: `${rule.reference} kapsamında gerekli düzenleme eksik`,
          legalReference: rule.reference,
          remediation: rule.remediation,
        });

        if (severity === "ihlal") score -= 15;
        else score -= 5;

        recommendations.push(rule.remediation);
      }
    }

    // Check for sensitive data without extra protection
    if (/sağlık|din|ırk|biyometrik|siyasi görüş|cinsel/i.test(text)) {
      if (!/özel nitelikli|hassas veri|açık rıza/i.test(text)) {
        findings.push({
          id: "kvkk_ozel_nitelikli",
          severity: "kritik_ihlal",
          title: "Özel nitelikli kişisel veri koruması eksik",
          description: "Özel nitelikli kişisel verilerin işlenmesi için ek tedbirler gereklidir",
          legalReference: "KVKK m.6",
          remediation: "Özel nitelikli veriler için açık rıza ve ek güvenlik önlemleri belirtilmeli",
        });
        score -= 25;
      }
    }
  } else {
    // No personal data detected
    score = 100;
  }

  return {
    area: "kvkk",
    areaName: "KVKK (Kişisel Verilerin Korunması)",
    passed: score >= 70,
    score: Math.max(0, score),
    findings,
    recommendations: [...new Set(recommendations)],
    legalBasis,
  };
}

/**
 * Check İş Kanunu compliance
 */
function checkIsKanunu(text: string): ComplianceCheck {
  const findings: ComplianceFinding[] = [];
  const recommendations: string[] = [];
  const legalBasis: string[] = ["4857 sayılı İş Kanunu"];
  let score = 100;

  // Check if it's an employment-related document
  const isEmploymentDoc = /iş sözleşmesi|işçi|işveren|çalışan|personel/i.test(text);

  if (!isEmploymentDoc) {
    return createEmptyCheck("is_kanunu");
  }

  // Check minimum wage compliance
  if (/asgari ücret.*altında|minimum.*altında/i.test(text)) {
    findings.push({
      id: "ik_asgari_ucret",
      severity: "kritik_ihlal",
      title: "Asgari ücret ihlali",
      description: "Asgari ücretin altında ücret belirlenmesi hukuka aykırıdır",
      legalReference: "İş Kanunu m.39",
      remediation: "Ücret en az asgari ücret seviyesine çıkarılmalıdır",
    });
    score -= 30;
  }

  // Check working hours
  const workingHoursMatch = text.match(/haftalık\s+(\d+)\s*saat/i);
  if (workingHoursMatch) {
    const hours = parseInt(workingHoursMatch[1]);
    if (hours > 45) {
      findings.push({
        id: "ik_calisma_suresi",
        severity: "ihlal",
        title: "Çalışma süresi sınırı aşımı",
        description: `Haftalık ${hours} saat çalışma yasal sınırı aşıyor`,
        legalReference: "İş Kanunu m.63",
        remediation: "Haftalık çalışma 45 saate indirilmeli veya fazla mesai düzenlemesi yapılmalı",
      });
      score -= 15;
    }
  }

  // Check probation period
  const probationMatch = text.match(/deneme süresi.*?(\d+)\s*(ay|gün|hafta)/i);
  if (probationMatch) {
    const duration = parseInt(probationMatch[1]);
    const unit = probationMatch[2].toLowerCase();
    const months = unit === "ay" ? duration : unit === "hafta" ? duration / 4 : duration / 30;

    if (months > 2) {
      findings.push({
        id: "ik_deneme_suresi",
        severity: months > 4 ? "ihlal" : "uyarı",
        title: "Deneme süresi uzun",
        description: `${duration} ${unit} deneme süresi yasal sınırı aşabilir`,
        legalReference: "İş Kanunu m.15",
        remediation: "Deneme süresi en fazla 2 ay (toplu sözleşme ile 4 ay) olmalıdır",
      });
      score -= months > 4 ? 15 : 5;
    }
  }

  // Check for illegal termination clauses
  if (/sebepsiz fesih|bildirimsiz fesih|derhal işten çıkarma/i.test(text)) {
    if (!/haklı neden|iş kanunu m\.25/i.test(text)) {
      findings.push({
        id: "ik_fesih",
        severity: "uyarı",
        title: "Fesih koşulları belirsiz",
        description: "Haklı nedenle fesih koşulları açıkça belirtilmemiş",
        legalReference: "İş Kanunu m.25",
        remediation: "Haklı nedenle fesih halleri İş Kanunu m.25'e uygun olarak düzenlenmeli",
      });
      score -= 10;
    }
  }

  // Check notice period
  if (!/ihbar süresi|bildirim süresi|m\.17/i.test(text)) {
    findings.push({
      id: "ik_ihbar",
      severity: "uyarı",
      title: "İhbar süresi düzenlemesi eksik",
      description: "Fesih bildirim süreleri belirtilmemiş",
      legalReference: "İş Kanunu m.17",
      remediation: "Kıdeme göre ihbar süreleri (2-8 hafta) belirtilmeli",
    });
    score -= 5;
    recommendations.push("İhbar süreleri düzenlemesi eklenmeli");
  }

  return {
    area: "is_kanunu",
    areaName: "İş Kanunu",
    passed: score >= 70,
    score: Math.max(0, score),
    findings,
    recommendations: [...new Set(recommendations)],
    legalBasis,
  };
}

/**
 * Check Borçlar Kanunu compliance
 */
function checkBorclarKanunu(text: string): ComplianceCheck {
  const findings: ComplianceFinding[] = [];
  const recommendations: string[] = [];
  const legalBasis: string[] = ["6098 sayılı Türk Borçlar Kanunu"];
  let score = 100;

  // Check for unfair terms (gabin)
  if (/aşırı.*edim|orantısız.*yükümlülük|fahiş/i.test(text)) {
    findings.push({
      id: "tbk_gabin",
      severity: "uyarı",
      title: "Aşırı yararlanma riski",
      description: "Taraflar arasında orantısız edim durumu olabilir",
      legalReference: "TBK m.28",
      remediation: "Edimler arası denge gözden geçirilmeli",
    });
    score -= 10;
  }

  // Check non-compete clause limits
  const nonCompeteMatch = text.match(/rekabet yasağı.*?(\d+)\s*(yıl|ay)/i);
  if (nonCompeteMatch) {
    const duration = parseInt(nonCompeteMatch[1]);
    const unit = nonCompeteMatch[2].toLowerCase();
    const years = unit === "yıl" ? duration : duration / 12;

    if (years > 2) {
      findings.push({
        id: "tbk_rekabet_sure",
        severity: "ihlal",
        title: "Rekabet yasağı süresi aşırı",
        description: `${duration} ${unit}lık rekabet yasağı yasal sınırı (2 yıl) aşıyor`,
        legalReference: "TBK m.445",
        remediation: "Rekabet yasağı süresi en fazla 2 yıla indirilmeli",
      });
      score -= 20;
    }
  }

  // Check for scope limitation in non-compete
  if (/rekabet yasağı/i.test(text)) {
    if (!/bölge|alan|sektör|coğrafi sınır/i.test(text)) {
      findings.push({
        id: "tbk_rekabet_kapsam",
        severity: "uyarı",
        title: "Rekabet yasağı kapsamı belirsiz",
        description: "Rekabet yasağının coğrafi ve sektörel kapsamı belirtilmemiş",
        legalReference: "TBK m.445",
        remediation: "Rekabet yasağı yer ve iş türü bakımından sınırlandırılmalı",
      });
      score -= 10;
    }
  }

  // Check for penalty clauses
  if (/cezai şart/i.test(text)) {
    const penaltyMatch = text.match(/cezai şart.*?(\d+(?:[.,]\d+)?)\s*(TL|₺|%)/i);
    if (penaltyMatch && penaltyMatch[2] === "%") {
      const percentage = parseFloat(penaltyMatch[1].replace(",", "."));
      if (percentage > 50) {
        findings.push({
          id: "tbk_cezai_sart",
          severity: "uyarı",
          title: "Yüksek cezai şart",
          description: `%${percentage} oranında cezai şart aşırı yüksek olabilir`,
          legalReference: "TBK m.182",
          remediation: "Hakim aşırı cezai şartı indirebilir, makul oran belirlenmeli",
        });
        score -= 10;
      }
    }
  }

  // Check for general terms (GİŞ)
  if (/matbu|standart sözleşme|genel işlem koşul/i.test(text)) {
    findings.push({
      id: "tbk_gis",
      severity: "uyarı",
      title: "Genel İşlem Koşulları tespit edildi",
      description: "Bu sözleşme GİK/GİŞ içerebilir, denetim gerekebilir",
      legalReference: "TBK m.20-25",
      remediation: "Karşı tarafın aleyhine olan şartlar dürüstlük kuralına göre değerlendirilmeli",
    });
    // Not reducing score, just warning
  }

  return {
    area: "borclar_kanunu",
    areaName: "Türk Borçlar Kanunu",
    passed: score >= 70,
    score: Math.max(0, score),
    findings,
    recommendations: [...new Set(recommendations)],
    legalBasis,
  };
}

/**
 * Check Tüketici Kanunu compliance
 */
function checkTuketiciKanunu(text: string): ComplianceCheck {
  const findings: ComplianceFinding[] = [];
  const recommendations: string[] = [];
  const legalBasis: string[] = ["6502 sayılı Tüketicinin Korunması Hakkında Kanun"];
  let score = 100;

  // Check if it's a consumer-related document
  const isConsumerDoc = /tüketici|müşteri|satın alma|sipariş|e-ticaret/i.test(text);

  if (!isConsumerDoc) {
    return createEmptyCheck("tuketici_kanunu");
  }

  // Check for right of withdrawal
  if (!/cayma hakkı/i.test(text)) {
    findings.push({
      id: "tkhk_cayma",
      severity: "ihlal",
      title: "Cayma hakkı bilgisi eksik",
      description: "Tüketicinin 14 günlük cayma hakkı belirtilmemiş",
      legalReference: "TKHK m.48",
      remediation: "14 günlük cayma hakkı ve kullanım koşulları açıkça belirtilmeli",
    });
    score -= 20;
    recommendations.push("Cayma hakkı maddesi eklenmeli");
  }

  // Check for seller information
  if (!/satıcı.*adres|şirket.*iletişim|mersis/i.test(text)) {
    findings.push({
      id: "tkhk_satici_bilgi",
      severity: "uyarı",
      title: "Satıcı bilgileri eksik",
      description: "Satıcının kimlik ve iletişim bilgileri belirtilmemiş",
      legalReference: "TKHK m.48/2",
      remediation: "Satıcının adı, adresi, telefonu ve e-posta adresi belirtilmeli",
    });
    score -= 10;
  }

  // Check for price information
  if (!/toplam bedel|tüm vergiler dahil|kdv dahil/i.test(text)) {
    findings.push({
      id: "tkhk_fiyat",
      severity: "uyarı",
      title: "Fiyat bilgilendirmesi eksik",
      description: "Toplam bedel ve vergiler açıkça belirtilmemiş",
      legalReference: "TKHK m.48/2",
      remediation: "Tüm vergiler dahil toplam bedel açıkça gösterilmeli",
    });
    score -= 10;
  }

  // Check for unfair terms
  const unfairPatterns = [
    { pattern: /tek taraflı fiyat değişikliği/i, issue: "Tek taraflı fiyat değişikliği hakkı" },
    { pattern: /tüm sorumluluğu.*reddeder/i, issue: "Sorumluluk reddi" },
    { pattern: /iade kabul edilmez/i, issue: "İade reddi" },
  ];

  for (const { pattern, issue } of unfairPatterns) {
    if (pattern.test(text)) {
      findings.push({
        id: `tkhk_haksiz_${issue.replace(/\s+/g, "_")}`,
        severity: "ihlal",
        title: `Haksız şart: ${issue}`,
        description: "Tüketici aleyhine haksız şart içerebilir",
        legalReference: "TKHK m.4",
        remediation: "Bu şart geçersiz sayılabilir, kaldırılmalı veya değiştirilmeli",
      });
      score -= 15;
    }
  }

  return {
    area: "tuketici_kanunu",
    areaName: "Tüketici Kanunu",
    passed: score >= 70,
    score: Math.max(0, score),
    findings,
    recommendations: [...new Set(recommendations)],
    legalBasis,
  };
}

/**
 * Create empty check for non-applicable areas
 */
function createEmptyCheck(area: ComplianceArea): ComplianceCheck {
  const areaNames: Record<ComplianceArea, string> = {
    kvkk: "KVKK",
    is_kanunu: "İş Kanunu",
    ticaret_kanunu: "Ticaret Kanunu",
    borclar_kanunu: "Borçlar Kanunu",
    tuketici_kanunu: "Tüketici Kanunu",
    rekabet_kanunu: "Rekabet Kanunu",
    bankacilik: "Bankacılık Mevzuatı",
    elektrik_piyasasi: "Elektrik Piyasası Mevzuatı",
  };

  return {
    area,
    areaName: areaNames[area],
    passed: true,
    score: 100,
    findings: [],
    recommendations: [],
    legalBasis: [],
  };
}

/**
 * Generate compliance report summary
 */
function generateSummary(checks: ComplianceCheck[], overallScore: number): string {
  const failedChecks = checks.filter((c) => !c.passed);
  const criticalCount = checks.flatMap((c) => c.findings).filter((f) => f.severity === "kritik_ihlal").length;
  const violationCount = checks.flatMap((c) => c.findings).filter((f) => f.severity === "ihlal").length;
  const warningCount = checks.flatMap((c) => c.findings).filter((f) => f.severity === "uyarı").length;

  let summary = `Genel Uyumluluk Puanı: %${overallScore}\n\n`;

  if (overallScore >= 80) {
    summary += "Belge genel olarak mevzuata uygun görünmektedir. ";
  } else if (overallScore >= 50) {
    summary += "Belgede bazı uyumluluk eksiklikleri tespit edilmiştir. ";
  } else {
    summary += "Belgede önemli uyumluluk sorunları tespit edilmiştir. ";
  }

  if (criticalCount > 0) {
    summary += `${criticalCount} kritik ihlal, `;
  }
  if (violationCount > 0) {
    summary += `${violationCount} ihlal, `;
  }
  if (warningCount > 0) {
    summary += `${warningCount} uyarı `;
  }
  summary += "bulunmaktadır.\n\n";

  if (failedChecks.length > 0) {
    summary += "Düzeltilmesi gereken alanlar: ";
    summary += failedChecks.map((c) => c.areaName).join(", ");
  }

  return summary;
}

/**
 * Get severity color
 */
export function getSeverityColor(severity: ComplianceSeverity): string {
  switch (severity) {
    case "uyarı":
      return "#eab308";
    case "ihlal":
      return "#f97316";
    case "kritik_ihlal":
      return "#ef4444";
  }
}

/**
 * Get severity label
 */
export function getSeverityLabel(severity: ComplianceSeverity): string {
  switch (severity) {
    case "uyarı":
      return "Uyarı";
    case "ihlal":
      return "İhlal";
    case "kritik_ihlal":
      return "Kritik İhlal";
  }
}

/**
 * Get status color
 */
export function getStatusColor(status: "uyumlu" | "kısmen_uyumlu" | "uyumsuz"): string {
  switch (status) {
    case "uyumlu":
      return "#22c55e";
    case "kısmen_uyumlu":
      return "#eab308";
    case "uyumsuz":
      return "#ef4444";
  }
}

/**
 * Get compliance area description
 */
export function getAreaDescription(area: ComplianceArea): string {
  const descriptions: Record<ComplianceArea, string> = {
    kvkk: "Kişisel verilerin korunması ve işlenmesine ilişkin kurallar",
    is_kanunu: "İşçi-işveren ilişkilerini düzenleyen kurallar",
    ticaret_kanunu: "Ticari işletme ve şirketlere ilişkin kurallar",
    borclar_kanunu: "Sözleşmeler ve borç ilişkilerine ilişkin kurallar",
    tuketici_kanunu: "Tüketici haklarının korunmasına ilişkin kurallar",
    rekabet_kanunu: "Rekabet ve piyasa düzenine ilişkin kurallar",
    bankacilik: "Bankacılık ve finans sektörüne ilişkin kurallar",
    elektrik_piyasasi: "Enerji sektörüne ilişkin kurallar",
  };
  return descriptions[area];
}

// Type alias for backward compatibility
export type ComplianceCategory = ComplianceArea;

/**
 * Get all compliance categories with their details
 */
export function getComplianceCategories(): Array<{
  id: ComplianceArea;
  name: string;
  icon: string;
  description: string;
}> {
  return [
    {
      id: "kvkk",
      name: "KVKK",
      icon: "🔒",
      description: "Kişisel Verilerin Korunması Kanunu",
    },
    {
      id: "is_kanunu",
      name: "İş Kanunu",
      icon: "👷",
      description: "İş Hukuku ve Çalışan Hakları",
    },
    {
      id: "ticaret_kanunu",
      name: "Ticaret Kanunu",
      icon: "🏢",
      description: "Ticari İşletme Hukuku",
    },
    {
      id: "borclar_kanunu",
      name: "Borçlar Kanunu",
      icon: "📜",
      description: "Sözleşmeler ve Borç İlişkileri",
    },
    {
      id: "tuketici_kanunu",
      name: "Tüketici Kanunu",
      icon: "🛒",
      description: "Tüketici Hakları",
    },
    {
      id: "rekabet_kanunu",
      name: "Rekabet Kanunu",
      icon: "⚖️",
      description: "Rekabet ve Piyasa Düzeni",
    },
    {
      id: "bankacilik",
      name: "Bankacılık",
      icon: "🏦",
      description: "Bankacılık Mevzuatı",
    },
    {
      id: "elektrik_piyasasi",
      name: "Enerji",
      icon: "⚡",
      description: "Elektrik Piyasası Mevzuatı",
    },
  ];
}
