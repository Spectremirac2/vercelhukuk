/**
 * VERBİS Registration Tracker for KVKK Compliance
 * Based on 2025 updates: Enhanced data subject rights, stricter enforcement
 * Supports Turkish Data Controllers' Registry (Veri Sorumluları Sicili)
 */

// VERBİS related types
export type VerbisRegistrationStatus =
  | "kayitli"
  | "kayit_bekliyor"
  | "guncelleme_gerekli"
  | "muaf"
  | "suresi_dolmus";

export type DataCategory =
  | "kimlik"
  | "iletisim"
  | "lokasyon"
  | "ozluk"
  | "hukuki_islem"
  | "musteri_islem"
  | "fiziksel_mekan"
  | "islem_guvenlik"
  | "risk_yonetim"
  | "finans"
  | "mesleki_deneyim"
  | "pazarlama"
  | "gorsel_isitsel"
  | "saglik"
  | "biyometrik"
  | "genetik"
  | "cinsel_hayat"
  | "irk_etnik"
  | "siyasi_gorus"
  | "felsefi_inanc"
  | "dini_mezhep"
  | "dernek_vakif"
  | "ceza_mahkumiyet";

export type ProcessingPurpose =
  | "insan_kaynaklari"
  | "is_faaliyetleri"
  | "musteri_iliskileri"
  | "pazarlama"
  | "finans_muhasebe"
  | "hukuki_islemler"
  | "bilgi_guvenlik"
  | "fiziksel_guvenlik"
  | "iletisim"
  | "tedarik_zinciri"
  | "denetim"
  | "yasal_yukumluluk";

export type DataTransferType =
  | "yurtici_gercek"
  | "yurtici_tuzel"
  | "yurtici_kamu"
  | "yurtdisi_yeterli_koruma"
  | "yurtdisi_taahhut"
  | "yurtdisi_acik_riza";

export interface DataProcessingActivity {
  id: string;
  category: DataCategory;
  purpose: ProcessingPurpose;
  legalBasis: string;
  dataSubjects: string[];
  retentionPeriod: string;
  technicalMeasures: string[];
  administrativeMeasures: string[];
  transfers: DataTransferType[];
  isSpecialCategory: boolean;
}

export interface VerbisRegistration {
  id: string;
  organizationName: string;
  organizationType: "gercek_kisi" | "tuzel_kisi" | "kamu_kurumu";
  verbisNumber?: string;
  registrationDate?: Date;
  lastUpdateDate?: Date;
  status: VerbisRegistrationStatus;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  dataProtectionOfficer?: {
    name: string;
    email: string;
    phone: string;
  };
  employeeCount: number;
  annualTurnover: number; // in TL
  processesSpecialData: boolean;
  processingActivities: DataProcessingActivity[];
  exemptionReason?: string;
  complianceScore: number;
  nextReviewDate: Date;
  warnings: string[];
  recommendations: string[];
}

export interface VerbisComplianceCheck {
  area: string;
  status: "uyumlu" | "kismen_uyumlu" | "uyumsuz" | "kontrol_gerekli";
  findings: string[];
  actions: string[];
  deadline?: Date;
  priority: "kritik" | "yuksek" | "orta" | "dusuk";
}

export interface VerbisReport {
  registration: VerbisRegistration;
  complianceChecks: VerbisComplianceCheck[];
  overallScore: number;
  status: "tam_uyumlu" | "kismen_uyumlu" | "uyumsuz";
  generatedAt: Date;
  nextActions: string[];
  riskAreas: string[];
}

// Data category definitions
const dataCategoryInfo: Record<
  DataCategory,
  { name: string; description: string; isSpecial: boolean }
> = {
  kimlik: {
    name: "Kimlik",
    description: "Ad, soyad, TC kimlik no, doğum tarihi, cinsiyet",
    isSpecial: false,
  },
  iletisim: {
    name: "İletişim",
    description: "Telefon, e-posta, adres, sosyal medya",
    isSpecial: false,
  },
  lokasyon: {
    name: "Lokasyon",
    description: "GPS, IP adresi, konum verileri",
    isSpecial: false,
  },
  ozluk: {
    name: "Özlük",
    description: "Medeni hal, askerlik, ehliyet, pasaport",
    isSpecial: false,
  },
  hukuki_islem: {
    name: "Hukuki İşlem",
    description: "Dava, icra, şikayet bilgileri",
    isSpecial: false,
  },
  musteri_islem: {
    name: "Müşteri İşlem",
    description: "Sipariş, talep, şikayet, fatura",
    isSpecial: false,
  },
  fiziksel_mekan: {
    name: "Fiziksel Mekan Güvenliği",
    description: "Giriş-çıkış, kamera kaydı",
    isSpecial: false,
  },
  islem_guvenlik: {
    name: "İşlem Güvenliği",
    description: "Log kayıtları, IP, şifre hash",
    isSpecial: false,
  },
  risk_yonetim: {
    name: "Risk Yönetimi",
    description: "Ticari, teknik, idari risk verileri",
    isSpecial: false,
  },
  finans: {
    name: "Finans",
    description: "Banka, kredi kartı, maaş, vergi",
    isSpecial: false,
  },
  mesleki_deneyim: {
    name: "Mesleki Deneyim",
    description: "CV, eğitim, sertifika, referans",
    isSpecial: false,
  },
  pazarlama: {
    name: "Pazarlama",
    description: "Tercihler, çerez, kampanya katılımı",
    isSpecial: false,
  },
  gorsel_isitsel: {
    name: "Görsel ve İşitsel",
    description: "Fotoğraf, video, ses kaydı",
    isSpecial: false,
  },
  saglik: {
    name: "Sağlık Bilgileri",
    description: "Hastalık, rapor, engel durumu",
    isSpecial: true,
  },
  biyometrik: {
    name: "Biyometrik Veri",
    description: "Parmak izi, yüz tanıma, retina",
    isSpecial: true,
  },
  genetik: {
    name: "Genetik Veri",
    description: "DNA, genetik test sonuçları",
    isSpecial: true,
  },
  cinsel_hayat: {
    name: "Cinsel Hayat",
    description: "Cinsel tercih ve yaşam bilgileri",
    isSpecial: true,
  },
  irk_etnik: {
    name: "Irk ve Etnik Köken",
    description: "Irk, etnik köken bilgileri",
    isSpecial: true,
  },
  siyasi_gorus: {
    name: "Siyasi Görüş",
    description: "Parti üyeliği, siyasi tercihler",
    isSpecial: true,
  },
  felsefi_inanc: {
    name: "Felsefi İnanç",
    description: "Dünya görüşü, felsefi inanışlar",
    isSpecial: true,
  },
  dini_mezhep: {
    name: "Din ve Mezhep",
    description: "Dini inanç, mezhep, ibadet bilgileri",
    isSpecial: true,
  },
  dernek_vakif: {
    name: "Dernek/Vakıf/Sendika Üyeliği",
    description: "STK, sendika, vakıf üyelikleri",
    isSpecial: true,
  },
  ceza_mahkumiyet: {
    name: "Ceza Mahkumiyeti",
    description: "Sabıka, adli sicil bilgileri",
    isSpecial: true,
  },
};

// Processing purpose definitions
const processingPurposeInfo: Record<
  ProcessingPurpose,
  { name: string; description: string }
> = {
  insan_kaynaklari: {
    name: "İnsan Kaynakları Süreçleri",
    description: "İşe alım, özlük, performans, bordro",
  },
  is_faaliyetleri: {
    name: "İş Faaliyetlerinin Yürütülmesi",
    description: "Operasyonel süreçler, üretim, hizmet sunumu",
  },
  musteri_iliskileri: {
    name: "Müşteri İlişkileri Yönetimi",
    description: "Satış, destek, şikayet yönetimi",
  },
  pazarlama: {
    name: "Pazarlama Faaliyetleri",
    description: "Reklam, kampanya, hedefleme",
  },
  finans_muhasebe: {
    name: "Finans ve Muhasebe",
    description: "Faturalama, tahsilat, mali raporlama",
  },
  hukuki_islemler: {
    name: "Hukuki İşlemlerin Takibi",
    description: "Dava, icra, sözleşme yönetimi",
  },
  bilgi_guvenlik: {
    name: "Bilgi Güvenliği",
    description: "Siber güvenlik, erişim kontrolü",
  },
  fiziksel_guvenlik: {
    name: "Fiziksel Güvenlik",
    description: "Tesis güvenliği, kamera sistemleri",
  },
  iletisim: {
    name: "İletişim Faaliyetleri",
    description: "Bilgilendirme, duyuru, destek",
  },
  tedarik_zinciri: {
    name: "Tedarik Zinciri Yönetimi",
    description: "Satın alma, lojistik, tedarikçi ilişkileri",
  },
  denetim: {
    name: "Denetim ve Kontrol",
    description: "İç denetim, uyumluluk kontrolü",
  },
  yasal_yukumluluk: {
    name: "Yasal Yükümlülükler",
    description: "Mevzuat gereklilikleri, resmi raporlama",
  },
};

// 2025 VERBİS exemption thresholds
const VERBIS_EXEMPTION_2025 = {
  employeeThreshold: 50,
  turnoverThreshold: 100_000_000, // 100 million TL
  smallBusinessEmployeeThreshold: 10,
  smallBusinessTurnoverThreshold: 10_000_000, // 10 million TL (new 2025)
};

// Fine ranges for 2025 (increased by 43.93%)
const VERBIS_FINES_2025 = {
  minFine: 68_083,
  maxFine: 13_600_000,
  lateRegistrationMin: 45_388,
  lateRegistrationMax: 9_066_666,
  dataBreachMin: 136_166,
  dataBreachMax: 13_600_000,
};

/**
 * Get data category information
 */
export function getDataCategoryInfo(category: DataCategory): {
  name: string;
  description: string;
  isSpecial: boolean;
} {
  return dataCategoryInfo[category];
}

/**
 * Get all data categories
 */
export function getAllDataCategories(): Array<{
  id: DataCategory;
  name: string;
  description: string;
  isSpecial: boolean;
}> {
  return Object.entries(dataCategoryInfo).map(([id, info]) => ({
    id: id as DataCategory,
    ...info,
  }));
}

/**
 * Get processing purpose information
 */
export function getProcessingPurposeInfo(purpose: ProcessingPurpose): {
  name: string;
  description: string;
} {
  return processingPurposeInfo[purpose];
}

/**
 * Get all processing purposes
 */
export function getAllProcessingPurposes(): Array<{
  id: ProcessingPurpose;
  name: string;
  description: string;
}> {
  return Object.entries(processingPurposeInfo).map(([id, info]) => ({
    id: id as ProcessingPurpose,
    ...info,
  }));
}

/**
 * Check if organization is exempt from VERBİS registration
 */
export function checkVerbisExemption(
  employeeCount: number,
  annualTurnover: number,
  processesSpecialData: boolean
): { exempt: boolean; reason?: string } {
  // 2025 update: Small businesses with <10 employees and <10M TL turnover are now exempt
  // even if they process special category data
  if (
    employeeCount < VERBIS_EXEMPTION_2025.smallBusinessEmployeeThreshold &&
    annualTurnover < VERBIS_EXEMPTION_2025.smallBusinessTurnoverThreshold
  ) {
    return {
      exempt: true,
      reason:
        "2025 güncellemesi: 10'dan az çalışan ve 10 milyon TL'nin altında ciro (özel nitelikli veri işlense dahi muaf)",
    };
  }

  // Standard exemption: <50 employees and <100M TL turnover (unless special data)
  if (
    employeeCount < VERBIS_EXEMPTION_2025.employeeThreshold &&
    annualTurnover < VERBIS_EXEMPTION_2025.turnoverThreshold &&
    !processesSpecialData
  ) {
    return {
      exempt: true,
      reason: "50'den az çalışan ve 100 milyon TL'nin altında ciro (özel nitelikli veri işlenmemekte)",
    };
  }

  // Must register
  return { exempt: false };
}

/**
 * Calculate compliance score for a registration
 */
function calculateComplianceScore(registration: VerbisRegistration): number {
  let score = 100;
  const deductions: Array<{ reason: string; points: number }> = [];

  // VERBİS registration status
  if (registration.status === "kayit_bekliyor") {
    deductions.push({ reason: "VERBİS kaydı tamamlanmamış", points: 30 });
  } else if (registration.status === "guncelleme_gerekli") {
    deductions.push({ reason: "VERBİS güncellemesi gerekli", points: 15 });
  } else if (registration.status === "suresi_dolmus") {
    deductions.push({ reason: "VERBİS kayıt süresi dolmuş", points: 40 });
  }

  // Data Protection Officer requirement check
  if (
    registration.employeeCount >= 50 ||
    registration.processesSpecialData
  ) {
    if (!registration.dataProtectionOfficer) {
      deductions.push({ reason: "Veri Koruma Görevlisi atanmamış", points: 20 });
    }
  }

  // Processing activities checks
  for (const activity of registration.processingActivities) {
    // Special category data checks
    if (activity.isSpecialCategory) {
      if (!activity.legalBasis.includes("açık rıza") && !activity.legalBasis.includes("kanun")) {
        deductions.push({
          reason: `${dataCategoryInfo[activity.category].name} için hukuki dayanak eksik`,
          points: 10,
        });
      }
    }

    // Technical measures check
    if (activity.technicalMeasures.length < 2) {
      deductions.push({
        reason: `${dataCategoryInfo[activity.category].name} için teknik tedbirler yetersiz`,
        points: 5,
      });
    }

    // Retention period check
    if (!activity.retentionPeriod || activity.retentionPeriod === "") {
      deductions.push({
        reason: `${dataCategoryInfo[activity.category].name} için saklama süresi belirtilmemiş`,
        points: 5,
      });
    }

    // International transfer checks
    const intlTransfers = activity.transfers.filter((t) => t.startsWith("yurtdisi"));
    if (intlTransfers.length > 0 && !intlTransfers.some((t) =>
      t === "yurtdisi_yeterli_koruma" || t === "yurtdisi_taahhut" || t === "yurtdisi_acik_riza"
    )) {
      deductions.push({
        reason: "Yurtdışı veri aktarımı için uygun mekanizma belirlenmemiş",
        points: 15,
      });
    }
  }

  // Apply deductions
  for (const deduction of deductions) {
    score -= deduction.points;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Run compliance checks for a registration
 */
function runComplianceChecks(registration: VerbisRegistration): VerbisComplianceCheck[] {
  const checks: VerbisComplianceCheck[] = [];

  // VERBİS Registration Check
  const verbisCheck: VerbisComplianceCheck = {
    area: "VERBİS Kaydı",
    status: "uyumlu",
    findings: [],
    actions: [],
    priority: "kritik",
  };

  if (registration.status === "kayitli") {
    verbisCheck.status = "uyumlu";
    verbisCheck.findings.push("VERBİS kaydı aktif");

    // Check if update is needed (annually)
    const lastUpdate = registration.lastUpdateDate || registration.registrationDate;
    if (lastUpdate) {
      const daysSinceUpdate = Math.floor(
        (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceUpdate > 365) {
        verbisCheck.status = "kontrol_gerekli";
        verbisCheck.findings.push(`Son güncellemeden ${daysSinceUpdate} gün geçmiş`);
        verbisCheck.actions.push("VERBİS kaydını gözden geçirin ve güncelleyin");
      }
    }
  } else if (registration.status === "kayit_bekliyor") {
    verbisCheck.status = "uyumsuz";
    verbisCheck.findings.push("VERBİS kaydı tamamlanmamış");
    verbisCheck.actions.push("VERBİS kaydını derhal tamamlayın");
    verbisCheck.deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  } else if (registration.status === "guncelleme_gerekli") {
    verbisCheck.status = "kismen_uyumlu";
    verbisCheck.findings.push("VERBİS kaydı güncelleme gerektiriyor");
    verbisCheck.actions.push("Veri işleme envanterini güncelleyip VERBİS'e bildirin");
    verbisCheck.deadline = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days
  }

  checks.push(verbisCheck);

  // Data Protection Officer Check
  const dpoCheck: VerbisComplianceCheck = {
    area: "Veri Koruma Görevlisi",
    status: "uyumlu",
    findings: [],
    actions: [],
    priority: "yuksek",
  };

  const dpoRequired =
    registration.employeeCount >= 50 || registration.processesSpecialData;

  if (dpoRequired) {
    if (registration.dataProtectionOfficer) {
      dpoCheck.findings.push("Veri Koruma Görevlisi atanmış");
    } else {
      dpoCheck.status = "uyumsuz";
      dpoCheck.findings.push("Veri Koruma Görevlisi atanması zorunlu ancak atanmamış");
      dpoCheck.actions.push("Veri Koruma Görevlisi atayın ve KVKK Kurumu'na bildirin");
      dpoCheck.deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  } else {
    dpoCheck.findings.push("Veri Koruma Görevlisi zorunlu değil");
    dpoCheck.actions.push("İsteğe bağlı olarak Veri Koruma Görevlisi atayabilirsiniz");
  }

  checks.push(dpoCheck);

  // Special Category Data Check
  const specialDataActivities = registration.processingActivities.filter(
    (a) => a.isSpecialCategory
  );

  if (specialDataActivities.length > 0) {
    const specialCheck: VerbisComplianceCheck = {
      area: "Özel Nitelikli Kişisel Veriler",
      status: "uyumlu",
      findings: [],
      actions: [],
      priority: "kritik",
    };

    for (const activity of specialDataActivities) {
      const catInfo = dataCategoryInfo[activity.category];
      specialCheck.findings.push(`${catInfo.name} verisi işleniyor`);

      // Check legal basis
      const validBases = ["açık rıza", "kanun", "sağlık", "iş sağlığı"];
      const hasValidBasis = validBases.some((b) =>
        activity.legalBasis.toLowerCase().includes(b)
      );

      if (!hasValidBasis) {
        specialCheck.status = "kismen_uyumlu";
        specialCheck.actions.push(
          `${catInfo.name} için geçerli hukuki dayanak belgeleyin (açık rıza veya kanuni dayanak)`
        );
      }

      // Check technical measures
      if (activity.technicalMeasures.length < 3) {
        specialCheck.status = "kismen_uyumlu";
        specialCheck.actions.push(
          `${catInfo.name} için ek teknik güvenlik tedbirleri uygulayın`
        );
      }
    }

    checks.push(specialCheck);
  }

  // International Transfer Check
  const intlTransferActivities = registration.processingActivities.filter((a) =>
    a.transfers.some((t) => t.startsWith("yurtdisi"))
  );

  if (intlTransferActivities.length > 0) {
    const transferCheck: VerbisComplianceCheck = {
      area: "Yurtdışı Veri Aktarımı",
      status: "uyumlu",
      findings: [],
      actions: [],
      priority: "yuksek",
    };

    for (const activity of intlTransferActivities) {
      const intlTransfers = activity.transfers.filter((t) => t.startsWith("yurtdisi"));
      for (const transfer of intlTransfers) {
        switch (transfer) {
          case "yurtdisi_yeterli_koruma":
            transferCheck.findings.push("Yeterli koruma bulunan ülkeye aktarım mevcut");
            break;
          case "yurtdisi_taahhut":
            transferCheck.findings.push("Taahhütname ile yurtdışı aktarım mevcut");
            transferCheck.actions.push("Taahhütnamelerin güncelliğini kontrol edin");
            break;
          case "yurtdisi_acik_riza":
            transferCheck.findings.push("Açık rıza ile yurtdışı aktarım mevcut");
            transferCheck.actions.push("Açık rıza kayıtlarının güncelliğini kontrol edin");
            break;
          default:
            transferCheck.status = "uyumsuz";
            transferCheck.findings.push("Uygun mekanizma olmadan yurtdışı aktarım tespit edildi");
            transferCheck.actions.push(
              "Yurtdışı aktarım için KVKK m.9'a uygun mekanizma belirleyin"
            );
        }
      }
    }

    checks.push(transferCheck);
  }

  // Data Retention Check
  const retentionCheck: VerbisComplianceCheck = {
    area: "Veri Saklama Süreleri",
    status: "uyumlu",
    findings: [],
    actions: [],
    priority: "orta",
  };

  const missingRetention = registration.processingActivities.filter(
    (a) => !a.retentionPeriod || a.retentionPeriod === ""
  );

  if (missingRetention.length > 0) {
    retentionCheck.status = "kismen_uyumlu";
    retentionCheck.findings.push(
      `${missingRetention.length} veri kategorisi için saklama süresi belirlenmemiş`
    );
    retentionCheck.actions.push(
      "Tüm veri kategorileri için saklama sürelerini belirleyin ve politikaya ekleyin"
    );
  } else {
    retentionCheck.findings.push("Tüm veri kategorileri için saklama süreleri belirlenmiş");
  }

  checks.push(retentionCheck);

  // Technical Measures Check
  const techCheck: VerbisComplianceCheck = {
    area: "Teknik Tedbirler",
    status: "uyumlu",
    findings: [],
    actions: [],
    priority: "yuksek",
  };

  const requiredMeasures = ["şifreleme", "erişim kontrolü", "log kayıtları", "yedekleme"];
  const allMeasures = registration.processingActivities.flatMap((a) => a.technicalMeasures);
  const uniqueMeasures = [...new Set(allMeasures.map((m) => m.toLowerCase()))];

  for (const required of requiredMeasures) {
    if (!uniqueMeasures.some((m) => m.includes(required))) {
      techCheck.status = "kismen_uyumlu";
      techCheck.actions.push(`"${required}" tedbirini uygulayın`);
    }
  }

  if (techCheck.status === "uyumlu") {
    techCheck.findings.push("Temel teknik tedbirler uygulanmış");
  } else {
    techCheck.findings.push("Bazı teknik tedbirler eksik");
  }

  checks.push(techCheck);

  return checks;
}

/**
 * Generate warnings and recommendations
 */
function generateWarningsAndRecommendations(
  registration: VerbisRegistration,
  checks: VerbisComplianceCheck[]
): { warnings: string[]; recommendations: string[] } {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Critical status warnings
  if (registration.status === "suresi_dolmus") {
    warnings.push(
      `VERBİS kayıt süresi dolmuş! ${VERBIS_FINES_2025.lateRegistrationMin.toLocaleString(
        "tr-TR"
      )} - ${VERBIS_FINES_2025.lateRegistrationMax.toLocaleString("tr-TR")} TL idari para cezası riski`
    );
  }

  // Check-based warnings
  for (const check of checks) {
    if (check.status === "uyumsuz" && check.priority === "kritik") {
      warnings.push(`Kritik: ${check.area} - ${check.findings.join(", ")}`);
    }
  }

  // Special data without DPO
  if (registration.processesSpecialData && !registration.dataProtectionOfficer) {
    warnings.push("Özel nitelikli veri işlenirken Veri Koruma Görevlisi bulunmuyor");
  }

  // Recommendations based on organization profile
  if (registration.employeeCount > 250) {
    recommendations.push("Büyük ölçekli kuruluş olarak veri koruma ekibi oluşturun");
    recommendations.push("Yıllık veri koruma denetimleri planlayın");
  }

  if (registration.processesSpecialData) {
    recommendations.push("Özel nitelikli veriler için ayrı veri işleme politikası hazırlayın");
    recommendations.push("Veri ihlali müdahale planı oluşturun");
  }

  // 2025 specific recommendations
  recommendations.push("2025 KVKK değişikliklerine uyum durumunuzu gözden geçirin");
  recommendations.push("Dijital rıza yönetim sistemi kurun");
  recommendations.push("Veri sahibi başvuru süreçlerini otomatikleştirin");

  return { warnings, recommendations };
}

/**
 * Create a new VERBİS registration
 */
export function createVerbisRegistration(
  data: Omit<
    VerbisRegistration,
    "id" | "complianceScore" | "warnings" | "recommendations" | "nextReviewDate"
  >
): VerbisRegistration {
  const id = `verbis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Check if activities include special category data
  const processesSpecialData =
    data.processesSpecialData ||
    data.processingActivities.some((a) => a.isSpecialCategory);

  const registration: VerbisRegistration = {
    ...data,
    id,
    processesSpecialData,
    complianceScore: 0,
    warnings: [],
    recommendations: [],
    nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
  };

  // Calculate compliance score
  registration.complianceScore = calculateComplianceScore(registration);

  // Generate warnings and recommendations
  const checks = runComplianceChecks(registration);
  const { warnings, recommendations } = generateWarningsAndRecommendations(
    registration,
    checks
  );
  registration.warnings = warnings;
  registration.recommendations = recommendations;

  return registration;
}

/**
 * Generate a compliance report
 */
export function generateVerbisReport(registration: VerbisRegistration): VerbisReport {
  const checks = runComplianceChecks(registration);
  const score = calculateComplianceScore(registration);

  // Determine overall status
  let status: VerbisReport["status"];
  if (score >= 80) {
    status = "tam_uyumlu";
  } else if (score >= 50) {
    status = "kismen_uyumlu";
  } else {
    status = "uyumsuz";
  }

  // Compile next actions
  const nextActions = checks
    .filter((c) => c.actions.length > 0)
    .sort((a, b) => {
      const priorityOrder = { kritik: 0, yuksek: 1, orta: 2, dusuk: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .flatMap((c) => c.actions.map((action) => `[${c.area}] ${action}`));

  // Identify risk areas
  const riskAreas = checks
    .filter((c) => c.status === "uyumsuz" || c.status === "kismen_uyumlu")
    .map((c) => c.area);

  return {
    registration,
    complianceChecks: checks,
    overallScore: score,
    status,
    generatedAt: new Date(),
    nextActions,
    riskAreas,
  };
}

/**
 * Get VERBİS fine information
 */
export function getVerbisFineLimits(): typeof VERBIS_FINES_2025 {
  return { ...VERBIS_FINES_2025 };
}

/**
 * Get exemption thresholds
 */
export function getExemptionThresholds(): typeof VERBIS_EXEMPTION_2025 {
  return { ...VERBIS_EXEMPTION_2025 };
}

/**
 * Create a data processing activity
 */
export function createProcessingActivity(
  data: Omit<DataProcessingActivity, "id" | "isSpecialCategory">
): DataProcessingActivity {
  const isSpecialCategory = dataCategoryInfo[data.category].isSpecial;

  return {
    ...data,
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    isSpecialCategory,
  };
}

/**
 * Validate a processing activity
 */
export function validateProcessingActivity(
  activity: DataProcessingActivity
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check legal basis
  if (!activity.legalBasis || activity.legalBasis.trim() === "") {
    errors.push("Hukuki dayanak belirtilmemiş");
  }

  // Special category checks
  if (activity.isSpecialCategory) {
    const validBases = ["açık rıza", "kanun", "sağlık", "iş sağlığı", "ceza soruşturma"];
    const hasValidBasis = validBases.some((b) =>
      activity.legalBasis.toLowerCase().includes(b)
    );
    if (!hasValidBasis) {
      errors.push("Özel nitelikli veri için geçerli hukuki dayanak gerekli (KVKK m.6)");
    }
  }

  // Data subjects check
  if (!activity.dataSubjects || activity.dataSubjects.length === 0) {
    errors.push("İlgili kişi grupları belirtilmemiş");
  }

  // Retention period check
  if (!activity.retentionPeriod || activity.retentionPeriod.trim() === "") {
    errors.push("Saklama süresi belirtilmemiş");
  }

  // Technical measures for special data
  if (activity.isSpecialCategory && activity.technicalMeasures.length < 3) {
    errors.push("Özel nitelikli veri için en az 3 teknik tedbir gerekli");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Generate suggested legal basis for a data category
 */
export function suggestLegalBasis(
  category: DataCategory,
  purpose: ProcessingPurpose
): string[] {
  const suggestions: string[] = [];
  const isSpecial = dataCategoryInfo[category].isSpecial;

  if (isSpecial) {
    suggestions.push("İlgili kişinin açık rızası (KVKK m.6/2)");

    if (category === "saglik") {
      suggestions.push("Kamu sağlığının korunması (KVKK m.6/3)");
      suggestions.push("Tıbbi teşhis ve tedavi (KVKK m.6/3)");
      suggestions.push("İş sağlığı ve güvenliği (KVKK m.6/3)");
    }

    if (category === "ceza_mahkumiyet") {
      suggestions.push("Yetkili kamu kurum ve kuruluşları denetiminde işleme (KVKK m.6/3)");
    }
  } else {
    // Normal data categories
    switch (purpose) {
      case "insan_kaynaklari":
        suggestions.push("Sözleşmenin kurulması veya ifası (KVKK m.5/2-c)");
        suggestions.push("Hukuki yükümlülüklerin yerine getirilmesi (KVKK m.5/2-ç)");
        break;
      case "is_faaliyetleri":
        suggestions.push("Meşru menfaat (KVKK m.5/2-f)");
        suggestions.push("Sözleşmenin kurulması veya ifası (KVKK m.5/2-c)");
        break;
      case "pazarlama":
        suggestions.push("İlgili kişinin açık rızası (KVKK m.5/1)");
        suggestions.push("Meşru menfaat - mevcut müşteriler için (KVKK m.5/2-f)");
        break;
      case "finans_muhasebe":
        suggestions.push("Hukuki yükümlülüklerin yerine getirilmesi (KVKK m.5/2-ç)");
        suggestions.push("Sözleşmenin kurulması veya ifası (KVKK m.5/2-c)");
        break;
      case "hukuki_islemler":
        suggestions.push("Hakkın tesisi, kullanılması veya korunması (KVKK m.5/2-e)");
        break;
      case "bilgi_guvenlik":
      case "fiziksel_guvenlik":
        suggestions.push("Meşru menfaat (KVKK m.5/2-f)");
        suggestions.push("Hukuki yükümlülüklerin yerine getirilmesi (KVKK m.5/2-ç)");
        break;
      default:
        suggestions.push("Sözleşmenin kurulması veya ifası (KVKK m.5/2-c)");
        suggestions.push("Meşru menfaat (KVKK m.5/2-f)");
    }
  }

  return suggestions;
}

/**
 * Get data transfer mechanism options
 */
export function getTransferMechanisms(): Array<{
  id: DataTransferType;
  name: string;
  description: string;
  requirements: string[];
}> {
  return [
    {
      id: "yurtici_gercek",
      name: "Yurtiçi - Gerçek Kişi",
      description: "Türkiye'deki gerçek kişilere aktarım",
      requirements: ["Hukuki dayanak", "Aydınlatma"],
    },
    {
      id: "yurtici_tuzel",
      name: "Yurtiçi - Tüzel Kişi",
      description: "Türkiye'deki şirket/kuruluşlara aktarım",
      requirements: ["Hukuki dayanak", "Veri işleme sözleşmesi"],
    },
    {
      id: "yurtici_kamu",
      name: "Yurtiçi - Kamu Kurumu",
      description: "Türkiye'deki kamu kurum ve kuruluşlarına aktarım",
      requirements: ["Yasal dayanak"],
    },
    {
      id: "yurtdisi_yeterli_koruma",
      name: "Yurtdışı - Yeterli Koruma",
      description: "KVKK Kurulu'nun yeterli koruma sağladığını ilan ettiği ülkelere",
      requirements: ["Yeterli koruma kararı", "Hukuki dayanak"],
    },
    {
      id: "yurtdisi_taahhut",
      name: "Yurtdışı - Taahhütname",
      description: "Yeterli koruma taahhüdü veren kuruluşlara",
      requirements: ["KVKK onaylı taahhütname", "Kurul izni"],
    },
    {
      id: "yurtdisi_acik_riza",
      name: "Yurtdışı - Açık Rıza",
      description: "İlgili kişinin açık rızası ile yurtdışına",
      requirements: ["Açık rıza beyanı", "Bilgilendirme"],
    },
  ];
}
