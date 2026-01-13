/**
 * KVKK 2025 Regulations Module
 *
 * Based on the latest 2025 updates from KVKK (Kisisel Verileri Koruma Kurumu):
 * - 2025/1072 Decision: SMS verification code regulations
 * - 2025 Fine limits update (increased administrative fines)
 * - Personal health data regulations (December 2025)
 * - Cross-border data transfer guide updates
 * - Automated decision-making clarifications
 *
 * References:
 * - kvkk.gov.tr
 * - 6698 sayili Kisisel Verilerin Korunmasi Kanunu
 * - Kisisel Saglik Verileri Hakkinda Yonetmelik
 */

export interface KVKK2025Finding {
  id: string;
  category: KVKK2025Category;
  severity: "kritik" | "yuksek" | "orta" | "dusuk";
  title: string;
  description: string;
  legalReference: string;
  remediation: string;
  deadline?: string;
  fineRange?: {
    min: number;
    max: number;
    currency: "TL";
  };
}

export type KVKK2025Category =
  | "sms_dogrulama"
  | "saglik_verisi"
  | "yurtdisi_aktarim"
  | "otomatik_karar"
  | "aydinlatma"
  | "acik_riza"
  | "veri_guvenligi"
  | "veri_ihlali"
  | "verbis"
  | "ozel_nitelikli";

export interface KVKK2025ComplianceResult {
  id: string;
  documentName: string;
  analyzedAt: Date;
  overallScore: number;
  status: "uyumlu" | "kismen_uyumlu" | "uyumsuz";
  findings: KVKK2025Finding[];
  recommendations: string[];
  requiredActions: RequiredAction[];
  estimatedFineRisk: {
    min: number;
    max: number;
    probability: "dusuk" | "orta" | "yuksek";
  };
  processingTimeMs: number;
}

export interface RequiredAction {
  id: string;
  priority: "acil" | "yuksek" | "orta" | "dusuk";
  title: string;
  description: string;
  deadline: string;
  responsibleRole: string;
  status: "beklemede" | "devam_ediyor" | "tamamlandi";
}

// 2025 Fine Limits (Updated annually)
export const KVKK_2025_FINE_LIMITS = {
  // KVKK m.18/1-a: Aydinlatma yukumlulugune aykirilik
  aydinlatma_ihlali: {
    min: 100_000,
    max: 1_000_000,
    currency: "TL" as const,
    description: "Aydinlatma yukumlulugune aykirilik",
    article: "KVKK m.18/1-a",
  },
  // KVKK m.18/1-b: Veri guvenligi ihlali
  veri_guvenligi_ihlali: {
    min: 150_000,
    max: 3_000_000,
    currency: "TL" as const,
    description: "Veri guvenligi onlemlerine aykirilik",
    article: "KVKK m.18/1-b",
  },
  // KVKK m.18/1-c: Kurul kararlarinin yerine getirilmemesi
  kurul_karari_ihlali: {
    min: 250_000,
    max: 5_000_000,
    currency: "TL" as const,
    description: "Kurul kararlarinin yerine getirilmemesi",
    article: "KVKK m.18/1-c",
  },
  // KVKK m.18/1-d: VERBiS kayit yukumlulugune aykirilik
  verbis_ihlali: {
    min: 200_000,
    max: 4_000_000,
    currency: "TL" as const,
    description: "Veri Sorumluları Sicili kayit yukumlulugune aykirilik",
    article: "KVKK m.18/1-ç",
  },
  // 2025 yeni: Ozel nitelikli veri ihlali
  ozel_nitelikli_ihlal: {
    min: 300_000,
    max: 6_000_000,
    currency: "TL" as const,
    description: "Ozel nitelikli kisisel veri islemede ihlal",
    article: "KVKK m.6, m.18",
  },
};

// 2025/1072 Decision: SMS Verification Code Rules
export const SMS_VERIFICATION_RULES = {
  decision: "2025/1072",
  effectiveDate: new Date("2025-01-01"),
  rules: [
    {
      id: "sms_001",
      title: "SMS Dogrulama Kodu Icerigi",
      description: "Finansal dogrulama SMS'leri yalnizca dogrulama kodu ve isleme iliskin minimum bilgi icermelidir",
      pattern: /dogrulama kod|OTP|tek kullanımlık|güvenlik kodu/i,
      violation_pattern: /reklam|kampanya|indirim|fırsat|promosyon/i,
    },
    {
      id: "sms_002",
      title: "Ticari Ileti Yasagi",
      description: "Dogrulama SMS'lerinde ticari ileti veya pazarlama mesajı bulunamaz",
      pattern: /dogrulama|onay|güvenlik/i,
      violation_pattern: /satın al|sipariş ver|tıkla|linke tıkla|kampanya/i,
    },
    {
      id: "sms_003",
      title: "Veri Minimizasyonu",
      description: "SMS icerigi islem icin gerekli minimum veriyle sinirli olmalidir",
      maxLength: 160,
      requiredElements: ["kod", "islem_turu"],
      forbiddenElements: ["tam_ad", "tc_kimlik", "hesap_bakiye"],
    },
  ],
};

// Personal Health Data Regulations (December 2025)
export const HEALTH_DATA_REGULATIONS = {
  effectiveDate: new Date("2025-12-01"),
  categories: [
    {
      id: "saglik_genel",
      name: "Genel Saglik Verisi",
      description: "Genel saglik durumu, hastalik gecmisi",
      processingRequirement: "acik_riza",
      retentionPeriod: "20 yıl (hasta dosyası için)",
      specialMeasures: ["sifreleme", "erisim_kontrolu", "denetim_izi"],
    },
    {
      id: "genetik_veri",
      name: "Genetik Veri",
      description: "DNA analizi, genetik test sonuclari",
      processingRequirement: "acik_riza_ozel",
      retentionPeriod: "Belirli süre sonra anonimlestirilmeli",
      specialMeasures: ["guclu_sifreleme", "anahtar_yonetimi", "bolunmus_depolama"],
    },
    {
      id: "biyometrik_veri",
      name: "Biyometrik Veri",
      description: "Parmak izi, yuz tanima, iris taramasi",
      processingRequirement: "acik_riza_ozel",
      retentionPeriod: "Amac ortadan kalktiginda derhal silinmeli",
      specialMeasures: ["template_sifreleme", "merkezi_olmayan_depolama"],
    },
    {
      id: "psikolojik_veri",
      name: "Psikolojik/Psikiyatrik Veri",
      description: "Ruh sagligi kayitlari, terapist notlari",
      processingRequirement: "acik_riza_ozel",
      retentionPeriod: "10 yıl",
      specialMeasures: ["yuksek_gizlilik", "sinirli_erisim", "ayri_depolama"],
    },
  ],
  requiredDocuments: [
    "saglik_verisi_isleme_politikasi",
    "hasta_aydinlatma_metni",
    "saglik_verisi_erisim_matrisi",
    "veri_ihlali_mudahale_plani",
  ],
};

// Cross-border Data Transfer Guide (2025 Update)
export const CROSS_BORDER_TRANSFER_GUIDE = {
  lastUpdated: new Date("2025-03-15"),
  adequateCountries: [
    // Countries with adequate level of protection
    { country: "Almanya", code: "DE", status: "yeterli", since: "2020" },
    { country: "Fransa", code: "FR", status: "yeterli", since: "2020" },
    { country: "Ispanya", code: "ES", status: "yeterli", since: "2020" },
    { country: "Italya", code: "IT", status: "yeterli", since: "2020" },
    { country: "Hollanda", code: "NL", status: "yeterli", since: "2020" },
    { country: "Belcika", code: "BE", status: "yeterli", since: "2020" },
    { country: "Avusturya", code: "AT", status: "yeterli", since: "2020" },
    { country: "Isvicre", code: "CH", status: "yeterli", since: "2021" },
    { country: "Ingiltere", code: "GB", status: "yeterli", since: "2021" },
    { country: "Japonya", code: "JP", status: "yeterli", since: "2022" },
    { country: "Guney Kore", code: "KR", status: "yeterli", since: "2023" },
    { country: "Kanada", code: "CA", status: "yeterli", since: "2024" },
  ],
  transferMechanisms: [
    {
      id: "acik_riza",
      name: "Acik Riza",
      description: "Ilgili kisinin acik rizasi",
      requirements: ["bilgilendirme", "gercek_irade", "belirli_amac"],
      article: "KVKK m.9/1",
    },
    {
      id: "taahhutname",
      name: "Taahhütname",
      description: "Yeterli koruma saglanacagina dair taahhütname",
      requirements: ["kurul_onay", "standart_taahhutname", "periyodik_denetim"],
      article: "KVKK m.9/2",
    },
    {
      id: "baglayici_sirket_kurallari",
      name: "Baglayici Sirket Kurallari (BCR)",
      description: "Sirket grubu icinde baglayici kurallar",
      requirements: ["kurul_onay", "grup_ici_uyum", "bagimsiz_denetim"],
      article: "KVKK m.9/2",
    },
  ],
  riskAssessment: {
    required: true,
    factors: [
      "hedef_ulke_mevzuati",
      "alici_guvenlik_onlemleri",
      "veri_hassasiyeti",
      "aktarim_miktari",
      "aktarim_sikligi",
    ],
  },
};

// Automated Decision Making Rules (2025 Clarification)
export const AUTOMATED_DECISION_RULES = {
  article: "KVKK m.11/1-g",
  clarificationDate: new Date("2025-02-01"),
  requirements: [
    {
      id: "bilgilendirme",
      title: "Otomatik Karar Alma Bilgilendirmesi",
      description: "Ilgili kisiye otomatik karar alma sureci hakkinda bilgi verilmelidir",
      mandatory: true,
    },
    {
      id: "itiraz_hakki",
      title: "Itiraz Hakki",
      description: "Tamamen otomatik kararlara itiraz hakki taninmalidir",
      mandatory: true,
    },
    {
      id: "insan_mudahalesi",
      title: "Insan Müdahalesi Talep Hakki",
      description: "Onemli kararlarda insan müdahalesi talep edilebilmelidir",
      mandatory: true,
    },
    {
      id: "aciklama_hakki",
      title: "Karar Aciklama Hakki",
      description: "Otomatik kararin mantigi hakkinda aciklama talep edilebilir",
      mandatory: true,
    },
  ],
  prohibitedDecisions: [
    "yalnizca otomasyona dayali ise alim/işten cikarma",
    "yalnizca otomasyona dayali kredi ret karari",
    "yalnizca otomasyona dayali saglik hizmeti reddi",
    "yalnizca otomasyona dayali egitim kabul/red karari",
  ],
  exemptions: [
    "ilgili kisinin acik rizasi",
    "kanunlarda acikca ongörülme",
    "sozlesmenin kurulmasi veya ifasi icin zorunluluk",
  ],
};

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check KVKK 2025 compliance for a document
 */
export function checkKVKK2025Compliance(
  text: string,
  documentType: "sozlesme" | "politika" | "aydinlatma" | "riza_metni" | "sms" | "genel"
): KVKK2025ComplianceResult {
  const startTime = Date.now();
  const findings: KVKK2025Finding[] = [];
  const recommendations: string[] = [];
  const requiredActions: RequiredAction[] = [];
  let score = 100;

  // Check SMS verification rules (2025/1072)
  if (documentType === "sms" || /sms|dogrulama|otp|güvenlik kodu/i.test(text)) {
    const smsFindings = checkSMSVerificationRules(text);
    findings.push(...smsFindings);
    score -= smsFindings.length * 15;
  }

  // Check health data regulations
  if (/saglik|hasta|tıbbi|tedavi|ilaç|tanı|doktor|hekim|hastane/i.test(text)) {
    const healthFindings = checkHealthDataRegulations(text);
    findings.push(...healthFindings);
    score -= healthFindings.length * 20;
  }

  // Check cross-border transfer compliance
  if (/yurtdışı|uluslararası|aktarım|transfer|abroad|international/i.test(text)) {
    const transferFindings = checkCrossBorderTransfer(text);
    findings.push(...transferFindings);
    score -= transferFindings.length * 15;
  }

  // Check automated decision making
  if (/otomatik|algoritma|yapay zeka|AI|ML|makine öğrenmesi|profilleme/i.test(text)) {
    const automatedFindings = checkAutomatedDecisionMaking(text);
    findings.push(...automatedFindings);
    score -= automatedFindings.length * 10;
  }

  // Check illumination text requirements (2025 standards)
  if (documentType === "aydinlatma" || /aydınlatma|bilgilendirme/i.test(text)) {
    const illuminationFindings = checkIlluminationRequirements(text);
    findings.push(...illuminationFindings);
    score -= illuminationFindings.length * 10;
  }

  // Check explicit consent requirements
  if (documentType === "riza_metni" || /açık rıza|onay/i.test(text)) {
    const consentFindings = checkExplicitConsentRequirements(text);
    findings.push(...consentFindings);
    score -= consentFindings.length * 15;
  }

  // Check data security measures
  const securityFindings = checkDataSecurityMeasures(text);
  findings.push(...securityFindings);
  score -= securityFindings.length * 10;

  // Generate recommendations based on findings
  for (const finding of findings) {
    recommendations.push(finding.remediation);

    // Create required actions for high/critical findings
    if (finding.severity === "kritik" || finding.severity === "yuksek") {
      requiredActions.push({
        id: generateId("action"),
        priority: finding.severity === "kritik" ? "acil" : "yuksek",
        title: finding.title,
        description: finding.remediation,
        deadline: finding.severity === "kritik" ? "7 gün" : "30 gün",
        responsibleRole: "Veri Koruma Sorumlusu",
        status: "beklemede",
      });
    }
  }

  // Calculate fine risk
  const estimatedFineRisk = calculateFineRisk(findings);

  // Normalize score
  score = Math.max(0, Math.min(100, score));

  // Determine status
  let status: "uyumlu" | "kismen_uyumlu" | "uyumsuz";
  if (score >= 80) status = "uyumlu";
  else if (score >= 50) status = "kismen_uyumlu";
  else status = "uyumsuz";

  return {
    id: generateId("kvkk2025"),
    documentName: documentType,
    analyzedAt: new Date(),
    overallScore: score,
    status,
    findings,
    recommendations: [...new Set(recommendations)],
    requiredActions,
    estimatedFineRisk,
    processingTimeMs: Date.now() - startTime,
  };
}

/**
 * Check SMS verification code rules (2025/1072)
 */
function checkSMSVerificationRules(text: string): KVKK2025Finding[] {
  const findings: KVKK2025Finding[] = [];

  // Check for commercial messages in verification SMS
  for (const rule of SMS_VERIFICATION_RULES.rules) {
    if (rule.violation_pattern && rule.violation_pattern.test(text)) {
      findings.push({
        id: generateId("sms"),
        category: "sms_dogrulama",
        severity: "yuksek",
        title: rule.title,
        description: rule.description,
        legalReference: `KVKK 2025/1072 Karar - ${rule.id}`,
        remediation: "SMS iceriginizi sadece dogrulama kodunu ve gerekli islem bilgisini icerecek sekilde guncelleyin. Reklam ve pazarlama mesajlarini kaldirin.",
        fineRange: KVKK_2025_FINE_LIMITS.aydinlatma_ihlali,
      });
    }
  }

  // Check SMS length
  if (text.length > 160 && /dogrulama|otp|güvenlik kodu/i.test(text)) {
    findings.push({
      id: generateId("sms"),
      category: "sms_dogrulama",
      severity: "orta",
      title: "SMS Uzunluk Siniri",
      description: "Dogrulama SMS'i 160 karakteri asmamalıdır (veri minimizasyonu)",
      legalReference: "KVKK m.4 - Veri Minimizasyonu",
      remediation: "SMS icerigini 160 karakter altına indirin",
    });
  }

  return findings;
}

/**
 * Check health data regulations
 */
function checkHealthDataRegulations(text: string): KVKK2025Finding[] {
  const findings: KVKK2025Finding[] = [];

  // Check for explicit consent for health data
  if (!/açık rıza|yazılı onay|ozel nitelikli.*rıza/i.test(text)) {
    findings.push({
      id: generateId("health"),
      category: "saglik_verisi",
      severity: "kritik",
      title: "Saglik Verisi Icin Acik Riza Eksik",
      description: "Saglik verileri ozel nitelikli kisisel veridir ve islenmesi icin acik riza gereklidir",
      legalReference: "KVKK m.6, Kisisel Saglik Verileri Yonetmeligi",
      remediation: "Saglik verilerinin islenmesi icin ayri ve acik riza metni olusturun",
      fineRange: KVKK_2025_FINE_LIMITS.ozel_nitelikli_ihlal,
    });
  }

  // Check for security measures
  if (!/şifreleme|kriptografi|erişim kontrolü|güvenlik önlemi/i.test(text)) {
    findings.push({
      id: generateId("health"),
      category: "saglik_verisi",
      severity: "yuksek",
      title: "Saglik Verisi Guvenlik Onlemleri Eksik",
      description: "Saglik verilerinin korunmasi icin ozel guvenlik onlemleri belirtilmelidir",
      legalReference: "KVKK m.12, Saglik Verileri Yonetmeligi m.5",
      remediation: "Sifreleme, erisim kontrolu ve denetim izi mekanizmalarini belgeleyin",
      fineRange: KVKK_2025_FINE_LIMITS.veri_guvenligi_ihlali,
    });
  }

  // Check for retention period
  if (!/saklama süresi|muhafaza|arşiv|silme süresi/i.test(text)) {
    findings.push({
      id: generateId("health"),
      category: "saglik_verisi",
      severity: "orta",
      title: "Saglik Verisi Saklama Suresi Belirtilmemis",
      description: "Saglik verilerinin ne kadar süreyle saklanacagi belirtilmelidir",
      legalReference: "KVKK m.4/1-d, Saglik Verileri Yonetmeligi",
      remediation: "Saglik verileri icin yasal saklama surelerini (hasta dosyasi: 20 yil) belgeleyin",
    });
  }

  return findings;
}

/**
 * Check cross-border transfer requirements
 */
function checkCrossBorderTransfer(text: string): KVKK2025Finding[] {
  const findings: KVKK2025Finding[] = [];

  // Check for transfer mechanism
  if (!/taahhütname|açık rıza|bağlayıcı.*kural|BCR|yeterli koruma/i.test(text)) {
    findings.push({
      id: generateId("transfer"),
      category: "yurtdisi_aktarim",
      severity: "kritik",
      title: "Yurtdisi Aktarim Mekanizmasi Eksik",
      description: "Yurtdisina veri aktarimi icin yasal bir mekanizma belirtilmemiş",
      legalReference: "KVKK m.9",
      remediation: "Acik riza, taahhütname veya baglayici sirket kurallari yoluyla aktarim mekanizmasi olusturun",
      fineRange: KVKK_2025_FINE_LIMITS.kurul_karari_ihlali,
    });
  }

  // Check for destination country information
  if (!/aktarım.*ülke|hedef ülke|alıcı ülke/i.test(text)) {
    findings.push({
      id: generateId("transfer"),
      category: "yurtdisi_aktarim",
      severity: "yuksek",
      title: "Hedef Ulke Bilgisi Eksik",
      description: "Kisisel verilerin aktarilacagi ulke/ulkeler belirtilmemiş",
      legalReference: "KVKK m.9, m.10",
      remediation: "Verilerin aktarilacagi ulkeleri ve alici kuruluslari acikca belirtin",
    });
  }

  // Check for risk assessment mention
  if (!/risk değerlendirme|etki analizi|transfer.*risk/i.test(text)) {
    findings.push({
      id: generateId("transfer"),
      category: "yurtdisi_aktarim",
      severity: "orta",
      title: "Yurtdisi Aktarim Risk Degerlendirmesi Eksik",
      description: "Yurtdisi aktarim oncesi risk degerlendirmesi yapilmali",
      legalReference: "KVKK 2025 Rehberi",
      remediation: "Hedef ulke mevzuati ve alici guvenlik onlemlerini degerlendiren bir analiz yapin",
    });
  }

  return findings;
}

/**
 * Check automated decision making compliance
 */
function checkAutomatedDecisionMaking(text: string): KVKK2025Finding[] {
  const findings: KVKK2025Finding[] = [];

  // Check for information about automated processing
  if (!/otomatik.*bilgilendirme|algoritma.*açıklama|karar.*mantık/i.test(text)) {
    findings.push({
      id: generateId("auto"),
      category: "otomatik_karar",
      severity: "yuksek",
      title: "Otomatik Karar Alma Bilgilendirmesi Eksik",
      description: "Ilgili kisiye otomatik karar alma sureci hakkinda bilgi verilmelidir",
      legalReference: "KVKK m.11/1-g",
      remediation: "Otomatik karar alma mekanizmasinin mantigi ve sonuclari hakkinda aciklama ekleyin",
    });
  }

  // Check for objection right
  if (!/itiraz hakkı|itiraz.*otomatik|karşı çıkma/i.test(text)) {
    findings.push({
      id: generateId("auto"),
      category: "otomatik_karar",
      severity: "yuksek",
      title: "Otomatik Karara Itiraz Hakki Eksik",
      description: "Tamamen otomatik kararlara itiraz hakki tanimlanmamis",
      legalReference: "KVKK m.11/1-g",
      remediation: "Otomatik kararlara itiraz mekanizmasi ve insan müdahalesi talep hakki ekleyin",
    });
  }

  // Check for prohibited automated decisions
  for (const prohibited of AUTOMATED_DECISION_RULES.prohibitedDecisions) {
    const pattern = new RegExp(prohibited.replace(/\//g, "|"), "i");
    if (pattern.test(text) && !/açık rıza|istisna|yasal dayanak/i.test(text)) {
      findings.push({
        id: generateId("auto"),
        category: "otomatik_karar",
        severity: "kritik",
        title: "Yasak Otomatik Karar Tespit Edildi",
        description: `"${prohibited}" yalnizca otomasyona dayali olamaz`,
        legalReference: "KVKK m.11, Kurul Kararlari",
        remediation: "Onemli kararlarda insan müdahalesini zorunlu kilin veya acik riza alin",
        fineRange: KVKK_2025_FINE_LIMITS.kurul_karari_ihlali,
      });
    }
  }

  return findings;
}

/**
 * Check illumination text requirements (2025)
 */
function checkIlluminationRequirements(text: string): KVKK2025Finding[] {
  const findings: KVKK2025Finding[] = [];

  // Required elements in illumination text
  const requiredElements = [
    { pattern: /veri sorumlusu|şirket.*kimlik|tüzel kişi.*ad/i, name: "Veri Sorumlusu Kimligi" },
    { pattern: /işleme amacı|hangi amaç|neden.*işlen/i, name: "Isleme Amaci" },
    { pattern: /hukuki sebep|yasal dayanak|kanuni.*dayanak/i, name: "Hukuki Sebep" },
    { pattern: /aktarım|paylaşım|üçüncü kişi/i, name: "Veri Aktarimi Bilgisi" },
    { pattern: /hakları|m\.11|başvuru.*hak/i, name: "Ilgili Kisi Haklari" },
    { pattern: /saklama süresi|muhafaza.*süre|silme.*süre/i, name: "Saklama Suresi" },
    { pattern: /toplama yöntemi|elde etme.*yol|kaynak/i, name: "Veri Toplama Yontemi" },
  ];

  for (const element of requiredElements) {
    if (!element.pattern.test(text)) {
      findings.push({
        id: generateId("illum"),
        category: "aydinlatma",
        severity: "orta",
        title: `Aydinlatma Eksigi: ${element.name}`,
        description: `Aydinlatma metninde ${element.name} bilgisi bulunmuyor`,
        legalReference: "KVKK m.10, Aydinlatma Yukumlulugu Yonetmeligi",
        remediation: `${element.name} bilgisini aydinlatma metnine ekleyin`,
      });
    }
  }

  // Check for plain language
  if (/hukuki terimler|mücbir sebep|cari hesap|defaten/i.test(text)) {
    findings.push({
      id: generateId("illum"),
      category: "aydinlatma",
      severity: "dusuk",
      title: "Anlasilabilirlik Sorunu",
      description: "Aydinlatma metni sade ve anlasilabilir dilde olmalidir",
      legalReference: "KVKK m.10, Kurul Ilke Kararlari",
      remediation: "Teknik ve hukuki terimleri gunluk dilde aciklayici ifadelerle degistirin",
    });
  }

  return findings;
}

/**
 * Check explicit consent requirements
 */
function checkExplicitConsentRequirements(text: string): KVKK2025Finding[] {
  const findings: KVKK2025Finding[] = [];

  // Check for freely given consent
  if (/zorunlu|mecburi|vazgeçilmez|koşul/i.test(text) && /onay|rıza|kabul/i.test(text)) {
    findings.push({
      id: generateId("consent"),
      category: "acik_riza",
      severity: "kritik",
      title: "Zorla Alinan Riza Riski",
      description: "Acik riza özgür iradeyle verilmeli, hizmet sartina baglanmamalidir",
      legalReference: "KVKK m.3/1-a, m.5/1",
      remediation: "Rizayi hizmet sunumu ile iliskilendirmeyin, ayri ve gercek irade beyanina dayandirin",
      fineRange: KVKK_2025_FINE_LIMITS.aydinlatma_ihlali,
    });
  }

  // Check for specific consent
  if (!/belirli.*amaç|özel.*amaç|hangi.*işlem/i.test(text)) {
    findings.push({
      id: generateId("consent"),
      category: "acik_riza",
      severity: "yuksek",
      title: "Belirsiz Riza Amaci",
      description: "Rizanin hangi islemler icin alindigi acikca belirtilmelidir",
      legalReference: "KVKK m.3/1-a",
      remediation: "Her islem turu icin ayri ve belirli amac belirtin",
    });
  }

  // Check for informed consent
  if (!/bilgilendirildim|aydınlatıldım|okudum.*anladım/i.test(text)) {
    findings.push({
      id: generateId("consent"),
      category: "acik_riza",
      severity: "orta",
      title: "Bilgilendirme Kaydı Eksik",
      description: "Ilgili kisinin aydinlatma metnini okuyup anladigi kayit altina alinmalidir",
      legalReference: "KVKK m.5, m.10",
      remediation: "Aydinlatma metninin okunduguna dair onay mekanizmasi ekleyin",
    });
  }

  // Check for withdrawal mechanism
  if (!/geri çekme|iptal.*hak|vazgeçme.*yol/i.test(text)) {
    findings.push({
      id: generateId("consent"),
      category: "acik_riza",
      severity: "orta",
      title: "Riza Geri Cekme Mekanizmasi Eksik",
      description: "Rizanin nasil geri cekilecegi aciklanmalidir",
      legalReference: "KVKK m.7",
      remediation: "Kolay ve erisilebilir riza geri cekme yontemi belirtin",
    });
  }

  return findings;
}

/**
 * Check data security measures
 */
function checkDataSecurityMeasures(text: string): KVKK2025Finding[] {
  const findings: KVKK2025Finding[] = [];

  // Only check if document discusses data processing
  if (!/kişisel veri|veri işle|veri kayıt/i.test(text)) {
    return findings;
  }

  const securityMeasures = [
    { pattern: /şifreleme|kriptografi|encrypt/i, name: "Sifreleme" },
    { pattern: /erişim kontrolü|yetkilendirme|kimlik doğrulama/i, name: "Erisim Kontrolu" },
    { pattern: /log|iz kayıt|denetim izi/i, name: "Denetim Izi" },
    { pattern: /yedekleme|backup|felaket kurtarma/i, name: "Yedekleme" },
  ];

  let missingCount = 0;
  for (const measure of securityMeasures) {
    if (!measure.pattern.test(text)) {
      missingCount++;
    }
  }

  if (missingCount >= 3) {
    findings.push({
      id: generateId("security"),
      category: "veri_guvenligi",
      severity: "yuksek",
      title: "Veri Guvenligi Onlemleri Yetersiz",
      description: "Teknik ve idari guvenlik onlemleri yeterince belirtilmemis",
      legalReference: "KVKK m.12",
      remediation: "Sifreleme, erisim kontrolu, denetim izi ve yedekleme mekanizmalarini belgeleyin",
      fineRange: KVKK_2025_FINE_LIMITS.veri_guvenligi_ihlali,
    });
  }

  return findings;
}

/**
 * Calculate fine risk based on findings
 */
function calculateFineRisk(findings: KVKK2025Finding[]): {
  min: number;
  max: number;
  probability: "dusuk" | "orta" | "yuksek";
} {
  let totalMin = 0;
  let totalMax = 0;

  for (const finding of findings) {
    if (finding.fineRange) {
      totalMin += finding.fineRange.min;
      totalMax += finding.fineRange.max;
    }
  }

  const criticalCount = findings.filter((f) => f.severity === "kritik").length;
  const highCount = findings.filter((f) => f.severity === "yuksek").length;

  let probability: "dusuk" | "orta" | "yuksek";
  if (criticalCount > 0) probability = "yuksek";
  else if (highCount >= 2) probability = "orta";
  else probability = "dusuk";

  return {
    min: totalMin,
    max: totalMax,
    probability,
  };
}

/**
 * Get adequate countries list
 */
export function getAdequateCountries(): Array<{
  country: string;
  code: string;
  status: string;
  since: string;
}> {
  return CROSS_BORDER_TRANSFER_GUIDE.adequateCountries;
}

/**
 * Check if a country has adequate protection
 */
export function isCountryAdequate(countryCode: string): boolean {
  return CROSS_BORDER_TRANSFER_GUIDE.adequateCountries.some(
    (c) => c.code.toLowerCase() === countryCode.toLowerCase()
  );
}

/**
 * Get transfer mechanisms
 */
export function getTransferMechanisms(): Array<{
  id: string;
  name: string;
  description: string;
  requirements: string[];
  article: string;
}> {
  return CROSS_BORDER_TRANSFER_GUIDE.transferMechanisms;
}

/**
 * Get 2025 fine limits
 */
export function getFineLimits(): typeof KVKK_2025_FINE_LIMITS {
  return KVKK_2025_FINE_LIMITS;
}

/**
 * Get health data categories
 */
export function getHealthDataCategories(): typeof HEALTH_DATA_REGULATIONS.categories {
  return HEALTH_DATA_REGULATIONS.categories;
}

/**
 * Get automated decision rules
 */
export function getAutomatedDecisionRules(): typeof AUTOMATED_DECISION_RULES {
  return AUTOMATED_DECISION_RULES;
}

/**
 * Format finding severity in Turkish
 */
export function formatSeverity(severity: KVKK2025Finding["severity"]): string {
  const labels: Record<KVKK2025Finding["severity"], string> = {
    kritik: "Kritik",
    yuksek: "Yüksek",
    orta: "Orta",
    dusuk: "Düşük",
  };
  return labels[severity];
}

/**
 * Format category in Turkish
 */
export function formatCategory(category: KVKK2025Category): string {
  const labels: Record<KVKK2025Category, string> = {
    sms_dogrulama: "SMS Doğrulama",
    saglik_verisi: "Sağlık Verisi",
    yurtdisi_aktarim: "Yurtdışı Aktarım",
    otomatik_karar: "Otomatik Karar",
    aydinlatma: "Aydınlatma",
    acik_riza: "Açık Rıza",
    veri_guvenligi: "Veri Güvenliği",
    veri_ihlali: "Veri İhlali",
    verbis: "VERBİS",
    ozel_nitelikli: "Özel Nitelikli Veri",
  };
  return labels[category];
}

/**
 * Generate KVKK 2025 compliance summary
 */
export function generateComplianceSummary(result: KVKK2025ComplianceResult): string {
  let summary = `KVKK 2025 Uyumluluk Raporu\n`;
  summary += `${"=".repeat(40)}\n\n`;

  summary += `Genel Puan: %${result.overallScore}\n`;
  summary += `Durum: ${result.status === "uyumlu" ? "Uyumlu" : result.status === "kismen_uyumlu" ? "Kısmen Uyumlu" : "Uyumsuz"}\n\n`;

  if (result.findings.length > 0) {
    summary += `Bulgular (${result.findings.length}):\n`;
    summary += `${"-".repeat(20)}\n`;

    for (const finding of result.findings) {
      summary += `\n[${formatSeverity(finding.severity)}] ${finding.title}\n`;
      summary += `Kategori: ${formatCategory(finding.category)}\n`;
      summary += `Aciklama: ${finding.description}\n`;
      summary += `Referans: ${finding.legalReference}\n`;
      summary += `Cozum: ${finding.remediation}\n`;

      if (finding.fineRange) {
        summary += `Tahmini Ceza: ${finding.fineRange.min.toLocaleString("tr-TR")} - ${finding.fineRange.max.toLocaleString("tr-TR")} TL\n`;
      }
    }
  }

  if (result.requiredActions.length > 0) {
    summary += `\nGerekli Aksiyonlar (${result.requiredActions.length}):\n`;
    summary += `${"-".repeat(20)}\n`;

    for (const action of result.requiredActions) {
      summary += `\n[${action.priority.toUpperCase()}] ${action.title}\n`;
      summary += `Sure: ${action.deadline}\n`;
      summary += `Sorumlu: ${action.responsibleRole}\n`;
    }
  }

  summary += `\nTahmini Ceza Riski:\n`;
  summary += `Min: ${result.estimatedFineRisk.min.toLocaleString("tr-TR")} TL\n`;
  summary += `Max: ${result.estimatedFineRisk.max.toLocaleString("tr-TR")} TL\n`;
  summary += `Olasilik: ${result.estimatedFineRisk.probability === "yuksek" ? "Yüksek" : result.estimatedFineRisk.probability === "orta" ? "Orta" : "Düşük"}\n`;

  return summary;
}
