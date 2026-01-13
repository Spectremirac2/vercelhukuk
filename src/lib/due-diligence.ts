/**
 * Due Diligence Automation Module for M&A Reviews
 * Based on 2025-2026 trends: AI-driven document review, risk detection, portfolio analysis
 * Supports Turkish corporate, commercial, and regulatory requirements
 */

// Due diligence types
export type DueDiligenceType =
  | "full_acquisition"
  | "asset_acquisition"
  | "merger"
  | "joint_venture"
  | "investment"
  | "ipo_readiness"
  | "vendor_dd"
  | "legal_audit";

export type ReviewCategory =
  | "corporate"
  | "contracts"
  | "litigation"
  | "employment"
  | "intellectual_property"
  | "real_estate"
  | "regulatory"
  | "tax"
  | "environmental"
  | "data_privacy"
  | "antitrust"
  | "insurance";

export type RiskSeverity = "kritik" | "yuksek" | "orta" | "dusuk" | "bilgi";

export type DocumentStatus = "beklemede" | "inceleniyor" | "tamamlandi" | "eksik" | "uyari";

export interface DueDiligenceProject {
  id: string;
  name: string;
  type: DueDiligenceType;
  targetCompany: CompanyInfo;
  acquirerCompany?: CompanyInfo;
  status: "planlama" | "dokuman_toplama" | "inceleme" | "raporlama" | "tamamlandi";
  startDate: Date;
  targetCompletionDate: Date;
  actualCompletionDate?: Date;
  teamMembers: TeamMember[];
  categories: ReviewCategory[];
  documents: DueDiligenceDocument[];
  findings: DueDiligenceFinding[];
  checklists: DueDiligenceChecklist[];
  dealValue?: number;
  currency?: string;
  confidentialityLevel: "normal" | "hassas" | "cok_gizli";
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyInfo {
  name: string;
  type: "anonim_sirket" | "limited_sirket" | "kollektif" | "komandit" | "kooperatif" | "diger";
  registrationNumber?: string;
  taxNumber?: string;
  registrationDate?: Date;
  registeredAddress?: string;
  sector?: string;
  employeeCount?: number;
  annualRevenue?: number;
  shareholders?: ShareholderInfo[];
}

export interface ShareholderInfo {
  name: string;
  type: "gercek_kisi" | "tuzel_kisi";
  sharePercentage: number;
  shareClass?: string;
  votingRights?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: "proje_yoneticisi" | "kidemli_avukat" | "avukat" | "paralegal" | "uzman";
  email: string;
  assignedCategories: ReviewCategory[];
}

export interface DueDiligenceDocument {
  id: string;
  projectId: string;
  category: ReviewCategory;
  subcategory?: string;
  name: string;
  description?: string;
  fileName?: string;
  fileSize?: number;
  status: DocumentStatus;
  isRequired: boolean;
  isCritical: boolean;
  requestDate: Date;
  receivedDate?: Date;
  reviewedDate?: Date;
  reviewedBy?: string;
  notes?: string;
  findings: string[];
  redFlags: string[];
}

export interface DueDiligenceFinding {
  id: string;
  projectId: string;
  category: ReviewCategory;
  documentId?: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  riskType: string;
  potentialImpact?: string;
  financialImpact?: number;
  mitigationStrategy?: string;
  legalReference?: string;
  status: "acik" | "inceleniyor" | "cozuldu" | "kabul_edildi";
  assignedTo?: string;
  createdAt: Date;
  resolvedAt?: Date;
  resolutionNotes?: string;
}

export interface DueDiligenceChecklist {
  id: string;
  projectId: string;
  category: ReviewCategory;
  name: string;
  items: ChecklistItem[];
  completionPercentage: number;
  status: "beklemede" | "devam_ediyor" | "tamamlandi";
}

export interface ChecklistItem {
  id: string;
  description: string;
  isRequired: boolean;
  isCompleted: boolean;
  documentId?: string;
  notes?: string;
  completedAt?: Date;
  completedBy?: string;
}

export interface DueDiligenceReport {
  projectId: string;
  projectName: string;
  targetCompany: string;
  executiveSummary: string;
  overallRiskRating: RiskSeverity;
  categoryScores: CategoryScore[];
  keyFindings: DueDiligenceFinding[];
  redFlags: string[];
  recommendations: string[];
  documentationStatus: DocumentationStatus;
  generatedAt: Date;
}

export interface CategoryScore {
  category: ReviewCategory;
  categoryName: string;
  score: number;
  status: "yeşil" | "sarı" | "kırmızı";
  findingsCount: number;
  criticalIssues: number;
  completionPercentage: number;
}

export interface DocumentationStatus {
  totalRequested: number;
  received: number;
  reviewed: number;
  pending: number;
  missing: number;
  completionPercentage: number;
}

// Category definitions with required documents
const categoryDefinitions: Record<
  ReviewCategory,
  {
    name: string;
    description: string;
    requiredDocuments: string[];
    checklistItems: string[];
  }
> = {
  corporate: {
    name: "Şirket Hukuku",
    description: "Ana sözleşme, ticaret sicil, yönetim kurulu ve genel kurul",
    requiredDocuments: [
      "Ana sözleşme ve tadilleri",
      "Ticaret sicil gazetesi ilanları",
      "Pay defteri",
      "Yönetim kurulu kararları",
      "Genel kurul kararları",
      "İmza sirküleri",
      "Ortaklık yapısı belgesi",
      "Faaliyet belgeleri",
    ],
    checklistItems: [
      "Ana sözleşme güncelliği kontrol edildi",
      "Ortaklık yapısı doğrulandı",
      "Yönetim kurulu kompozisyonu incelendi",
      "Genel kurul kararları gözden geçirildi",
      "İmza yetkileri kontrol edildi",
      "Şirket sermayesi doğrulandı",
    ],
  },
  contracts: {
    name: "Sözleşmeler",
    description: "Ticari sözleşmeler, tedarikçi ve müşteri anlaşmaları",
    requiredDocuments: [
      "Önemli müşteri sözleşmeleri",
      "Tedarikçi sözleşmeleri",
      "Distribütörlük/Bayilik sözleşmeleri",
      "Franchise sözleşmeleri",
      "Lisans sözleşmeleri",
      "Hizmet sözleşmeleri",
      "Kredi sözleşmeleri",
      "Teminat sözleşmeleri",
    ],
    checklistItems: [
      "Change of control maddeleri incelendi",
      "Fesih koşulları değerlendirildi",
      "Rekabet yasağı hükümleri kontrol edildi",
      "Minimum taahhütler belirlendi",
      "Sözleşme süreleri doğrulandı",
      "Teminat ve garantiler incelendi",
    ],
  },
  litigation: {
    name: "Davalar ve Uyuşmazlıklar",
    description: "Aktif davalar, potansiyel talepler, tahkim",
    requiredDocuments: [
      "Aktif dava listesi",
      "Mahkeme kararları",
      "İcra takipleri",
      "Tahkim davaları",
      "İdari cezalar",
      "Potansiyel talep bildirimleri",
      "Hukuki mütalaa raporları",
    ],
    checklistItems: [
      "Aktif davalar değerlendirildi",
      "Mali etki hesaplandı",
      "Karşılık yeterliliği kontrol edildi",
      "Potansiyel riskler belirlendi",
      "Sigorta kapsamı incelendi",
      "Kesinleşmiş kararlar gözden geçirildi",
    ],
  },
  employment: {
    name: "İş Hukuku",
    description: "İş sözleşmeleri, özlük dosyaları, sendika ilişkileri",
    requiredDocuments: [
      "İş sözleşmeleri (örnekler)",
      "Toplu iş sözleşmeleri",
      "Personel yönetmeliği",
      "SGK işlemleri",
      "İş kazası kayıtları",
      "Disiplin işlemleri",
      "Çalışan listesi",
      "Yönetici sözleşmeleri",
    ],
    checklistItems: [
      "İş sözleşmeleri İş Kanunu'na uygunluk",
      "SGK yükümlülükleri kontrol edildi",
      "Kıdem tazminatı karşılığı hesaplandı",
      "Yönetici hakları değerlendirildi",
      "Rekabet yasağı hükümleri incelendi",
      "Sendika durumu belirlendi",
    ],
  },
  intellectual_property: {
    name: "Fikri Mülkiyet",
    description: "Marka, patent, telif, ticari sır",
    requiredDocuments: [
      "Marka tescil belgeleri",
      "Patent belgeleri",
      "Tasarım tescilleri",
      "Lisans sözleşmeleri",
      "Yazılım hakları",
      "Alan adı kayıtları",
      "Ticari sır politikaları",
    ],
    checklistItems: [
      "Marka tescilleri doğrulandı",
      "Patent portföyü değerlendirildi",
      "Lisans hakları incelendi",
      "Yazılım sahipliği kontrol edildi",
      "İhlal riskleri belirlendi",
      "Koruma süreleri değerlendirildi",
    ],
  },
  real_estate: {
    name: "Gayrimenkul",
    description: "Taşınmazlar, kira sözleşmeleri, imar durumu",
    requiredDocuments: [
      "Tapu kayıtları",
      "Kira sözleşmeleri",
      "İmar durumu belgeleri",
      "Ruhsat ve izinler",
      "Yapı kullanma izni",
      "İpotek ve rehinler",
      "Ekspertiz raporları",
    ],
    checklistItems: [
      "Tapu kayıtları doğrulandı",
      "İpotek ve takyidatlar incelendi",
      "Kira sözleşmeleri değerlendirildi",
      "İmar durumu kontrol edildi",
      "Çevresel riskler belirlendi",
      "Değerleme yapıldı",
    ],
  },
  regulatory: {
    name: "Düzenleyici Uyum",
    description: "Sektörel düzenlemeler, lisanslar, izinler",
    requiredDocuments: [
      "Faaliyet izinleri",
      "Sektörel lisanslar",
      "Çevre izinleri",
      "İş güvenliği belgeleri",
      "Kalite sertifikaları",
      "Denetim raporları",
      "İdari yaptırımlar",
    ],
    checklistItems: [
      "Faaliyet izinleri güncel",
      "Sektörel yükümlülükler kontrol edildi",
      "İdari yaptırımlar incelendi",
      "Lisans devri gereksinimleri belirlendi",
      "Uyum programı değerlendirildi",
      "Denetim bulguları gözden geçirildi",
    ],
  },
  tax: {
    name: "Vergi",
    description: "Vergi beyanları, denetimler, potansiyel riskler",
    requiredDocuments: [
      "Kurumlar vergisi beyannameleri",
      "KDV beyannameleri",
      "Muhtasar beyannameler",
      "Vergi denetim raporları",
      "Transfer fiyatlandırması raporları",
      "Teşvik belgeleri",
      "Vergi borcu yoktur yazısı",
    ],
    checklistItems: [
      "Vergi beyanları incelendi",
      "Vergi denetimleri değerlendirildi",
      "Potansiyel vergi riskleri belirlendi",
      "Transfer fiyatlandırması uyumu kontrol edildi",
      "Teşvikler doğrulandı",
      "Zamanaşımı süreleri belirlendi",
    ],
  },
  environmental: {
    name: "Çevre",
    description: "Çevre izinleri, kirlilik, atık yönetimi",
    requiredDocuments: [
      "Çevre izin ve lisansları",
      "ÇED raporları",
      "Atık yönetim planları",
      "Emisyon izleme raporları",
      "Toprak analiz raporları",
      "Çevre denetim raporları",
    ],
    checklistItems: [
      "Çevre izinleri güncel",
      "ÇED gereksinimleri karşılandı",
      "Kirlilik riskleri değerlendirildi",
      "Atık yönetimi uyumu kontrol edildi",
      "Çevresel yükümlülükler belirlendi",
      "İyileştirme gereksinimleri incelendi",
    ],
  },
  data_privacy: {
    name: "Kişisel Veriler",
    description: "KVKK uyumu, VERBİS, veri güvenliği",
    requiredDocuments: [
      "VERBİS kayıt belgesi",
      "Veri işleme envanteri",
      "Aydınlatma metinleri",
      "Açık rıza formları",
      "Veri işleme sözleşmeleri",
      "Veri güvenliği politikası",
      "Veri ihlali kayıtları",
    ],
    checklistItems: [
      "VERBİS kaydı kontrol edildi",
      "Veri işleme envanteri incelendi",
      "Aydınlatma yükümlülüğü değerlendirildi",
      "Veri aktarım mekanizmaları kontrol edildi",
      "Güvenlik tedbirleri gözden geçirildi",
      "Veri ihlali prosedürleri belirlendi",
    ],
  },
  antitrust: {
    name: "Rekabet Hukuku",
    description: "Rekabet uyumu, birleşme bildirimi, hakim durum",
    requiredDocuments: [
      "Pazar payı analizleri",
      "Distribütörlük anlaşmaları",
      "Rekabet Kurulu kararları",
      "Rekabet uyum programı",
      "Fiyatlandırma politikaları",
    ],
    checklistItems: [
      "Pazar payı değerlendirildi",
      "Birleşme bildirimi gerekliliği belirlendi",
      "Rekabet soruşturmaları incelendi",
      "Dikey anlaşmalar kontrol edildi",
      "Hakim durum analizi yapıldı",
    ],
  },
  insurance: {
    name: "Sigorta",
    description: "Sigorta poliçeleri, teminatlar, hasar talepleri",
    requiredDocuments: [
      "Sigorta poliçeleri",
      "Hasar geçmişi",
      "Açık hasar talepleri",
      "Teminat limitleri özeti",
      "Yenileme bildirimleri",
    ],
    checklistItems: [
      "Sigorta kapsamı yeterliliği değerlendirildi",
      "Teminat boşlukları belirlendi",
      "Hasar geçmişi incelendi",
      "Devir gereksinimleri kontrol edildi",
      "D&O sigortası değerlendirildi",
    ],
  },
};

// Project storage
const projects: Map<string, DueDiligenceProject> = new Map();

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get category definition
 */
export function getCategoryDefinition(category: ReviewCategory): {
  name: string;
  description: string;
  requiredDocuments: string[];
  checklistItems: string[];
} {
  return categoryDefinitions[category];
}

/**
 * Get all categories
 */
export function getAllCategories(): Array<{
  id: ReviewCategory;
  name: string;
  description: string;
}> {
  return Object.entries(categoryDefinitions).map(([id, def]) => ({
    id: id as ReviewCategory,
    name: def.name,
    description: def.description,
  }));
}

/**
 * Create a new due diligence project
 */
export function createDueDiligenceProject(
  data: Omit<
    DueDiligenceProject,
    "id" | "documents" | "findings" | "checklists" | "createdAt" | "updatedAt"
  >
): DueDiligenceProject {
  const id = generateId("dd_project");
  const now = new Date();

  // Generate initial checklists based on selected categories
  const checklists: DueDiligenceChecklist[] = data.categories.map((category) => {
    const def = categoryDefinitions[category];
    return {
      id: generateId("checklist"),
      projectId: id,
      category,
      name: `${def.name} Kontrol Listesi`,
      items: def.checklistItems.map((item) => ({
        id: generateId("item"),
        description: item,
        isRequired: true,
        isCompleted: false,
      })),
      completionPercentage: 0,
      status: "beklemede" as const,
    };
  });

  // Generate initial document requests based on selected categories
  const documents: DueDiligenceDocument[] = [];
  for (const category of data.categories) {
    const def = categoryDefinitions[category];
    for (const docName of def.requiredDocuments) {
      documents.push({
        id: generateId("doc"),
        projectId: id,
        category,
        name: docName,
        status: "beklemede",
        isRequired: true,
        isCritical: docName.toLowerCase().includes("ana sözleşme") ||
          docName.toLowerCase().includes("tapu") ||
          docName.toLowerCase().includes("lisans"),
        requestDate: now,
        findings: [],
        redFlags: [],
      });
    }
  }

  const project: DueDiligenceProject = {
    ...data,
    id,
    documents,
    findings: [],
    checklists,
    createdAt: now,
    updatedAt: now,
  };

  projects.set(id, project);
  return project;
}

/**
 * Get project by ID
 */
export function getDueDiligenceProject(projectId: string): DueDiligenceProject | undefined {
  return projects.get(projectId);
}

/**
 * Get all projects
 */
export function getAllProjects(): DueDiligenceProject[] {
  return Array.from(projects.values());
}

/**
 * Update project
 */
export function updateProject(
  projectId: string,
  updates: Partial<DueDiligenceProject>
): DueDiligenceProject | null {
  const project = projects.get(projectId);
  if (!project) return null;

  const updatedProject = {
    ...project,
    ...updates,
    id: project.id,
    createdAt: project.createdAt,
    updatedAt: new Date(),
  };

  projects.set(projectId, updatedProject);
  return updatedProject;
}

/**
 * Add finding to project
 */
export function addFinding(
  projectId: string,
  finding: Omit<DueDiligenceFinding, "id" | "projectId" | "createdAt" | "status">
): DueDiligenceFinding | null {
  const project = projects.get(projectId);
  if (!project) return null;

  const newFinding: DueDiligenceFinding = {
    ...finding,
    id: generateId("finding"),
    projectId,
    status: "acik",
    createdAt: new Date(),
  };

  project.findings.push(newFinding);
  project.updatedAt = new Date();
  projects.set(projectId, project);

  return newFinding;
}

/**
 * Update document status
 */
export function updateDocumentStatus(
  projectId: string,
  documentId: string,
  status: DocumentStatus,
  notes?: string
): boolean {
  const project = projects.get(projectId);
  if (!project) return false;

  const doc = project.documents.find((d) => d.id === documentId);
  if (!doc) return false;

  doc.status = status;
  if (status === "tamamlandi") {
    doc.reviewedDate = new Date();
  } else if (status === "beklemede" && !doc.receivedDate) {
    // Nothing to update
  }
  if (notes) {
    doc.notes = notes;
  }

  project.updatedAt = new Date();
  projects.set(projectId, project);

  return true;
}

/**
 * Mark document as received
 */
export function markDocumentReceived(
  projectId: string,
  documentId: string,
  fileName?: string,
  fileSize?: number
): boolean {
  const project = projects.get(projectId);
  if (!project) return false;

  const doc = project.documents.find((d) => d.id === documentId);
  if (!doc) return false;

  doc.receivedDate = new Date();
  doc.status = "inceleniyor";
  if (fileName) doc.fileName = fileName;
  if (fileSize) doc.fileSize = fileSize;

  project.updatedAt = new Date();
  projects.set(projectId, project);

  return true;
}

/**
 * Add document finding
 */
export function addDocumentFinding(
  projectId: string,
  documentId: string,
  finding: string,
  isRedFlag: boolean = false
): boolean {
  const project = projects.get(projectId);
  if (!project) return false;

  const doc = project.documents.find((d) => d.id === documentId);
  if (!doc) return false;

  doc.findings.push(finding);
  if (isRedFlag) {
    doc.redFlags.push(finding);
    doc.status = "uyari";
  }

  project.updatedAt = new Date();
  projects.set(projectId, project);

  return true;
}

/**
 * Complete checklist item
 */
export function completeChecklistItem(
  projectId: string,
  checklistId: string,
  itemId: string,
  completedBy: string,
  notes?: string
): boolean {
  const project = projects.get(projectId);
  if (!project) return false;

  const checklist = project.checklists.find((c) => c.id === checklistId);
  if (!checklist) return false;

  const item = checklist.items.find((i) => i.id === itemId);
  if (!item) return false;

  item.isCompleted = true;
  item.completedAt = new Date();
  item.completedBy = completedBy;
  if (notes) item.notes = notes;

  // Update completion percentage
  const completedCount = checklist.items.filter((i) => i.isCompleted).length;
  checklist.completionPercentage = Math.round((completedCount / checklist.items.length) * 100);

  if (checklist.completionPercentage === 100) {
    checklist.status = "tamamlandi";
  } else if (checklist.completionPercentage > 0) {
    checklist.status = "devam_ediyor";
  }

  project.updatedAt = new Date();
  projects.set(projectId, project);

  return true;
}

/**
 * Calculate category score
 */
function calculateCategoryScore(
  project: DueDiligenceProject,
  category: ReviewCategory
): CategoryScore {
  const categoryDef = categoryDefinitions[category];
  const categoryDocs = project.documents.filter((d) => d.category === category);
  const categoryFindings = project.findings.filter((f) => f.category === category);
  const categoryChecklist = project.checklists.find((c) => c.category === category);

  // Calculate document completion
  const receivedDocs = categoryDocs.filter((d) => d.receivedDate).length;
  const totalDocs = categoryDocs.length;
  const docCompletion = totalDocs > 0 ? (receivedDocs / totalDocs) * 100 : 0;

  // Calculate checklist completion
  const checklistCompletion = categoryChecklist?.completionPercentage || 0;

  // Count critical issues
  const criticalIssues = categoryFindings.filter(
    (f) => f.severity === "kritik" || f.severity === "yuksek"
  ).length;

  // Calculate overall score
  let score = 100;

  // Deduct for missing documents
  score -= (100 - docCompletion) * 0.3;

  // Deduct for incomplete checklist
  score -= (100 - checklistCompletion) * 0.2;

  // Deduct for findings
  for (const finding of categoryFindings) {
    switch (finding.severity) {
      case "kritik":
        score -= 20;
        break;
      case "yuksek":
        score -= 10;
        break;
      case "orta":
        score -= 5;
        break;
      case "dusuk":
        score -= 2;
        break;
    }
  }

  score = Math.max(0, Math.min(100, score));

  // Determine status
  let status: "yeşil" | "sarı" | "kırmızı";
  if (score >= 80) {
    status = "yeşil";
  } else if (score >= 50) {
    status = "sarı";
  } else {
    status = "kırmızı";
  }

  return {
    category,
    categoryName: categoryDef.name,
    score: Math.round(score),
    status,
    findingsCount: categoryFindings.length,
    criticalIssues,
    completionPercentage: Math.round((docCompletion + checklistCompletion) / 2),
  };
}

/**
 * Generate due diligence report
 */
export function generateReport(projectId: string): DueDiligenceReport | null {
  const project = projects.get(projectId);
  if (!project) return null;

  // Calculate category scores
  const categoryScores = project.categories.map((cat) =>
    calculateCategoryScore(project, cat)
  );

  // Calculate overall risk rating
  const avgScore =
    categoryScores.reduce((sum, cs) => sum + cs.score, 0) / categoryScores.length;
  const criticalCount = categoryScores.reduce((sum, cs) => sum + cs.criticalIssues, 0);

  let overallRiskRating: RiskSeverity;
  if (criticalCount > 3 || avgScore < 40) {
    overallRiskRating = "kritik";
  } else if (criticalCount > 0 || avgScore < 60) {
    overallRiskRating = "yuksek";
  } else if (avgScore < 80) {
    overallRiskRating = "orta";
  } else {
    overallRiskRating = "dusuk";
  }

  // Get key findings (critical and high severity)
  const keyFindings = project.findings
    .filter((f) => f.severity === "kritik" || f.severity === "yuksek")
    .sort((a, b) => {
      const severityOrder = { kritik: 0, yuksek: 1, orta: 2, dusuk: 3, bilgi: 4 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

  // Collect all red flags
  const redFlags = project.documents
    .flatMap((d) => d.redFlags.map((rf) => `[${categoryDefinitions[d.category].name}] ${rf}`));

  // Generate recommendations
  const recommendations: string[] = [];

  if (criticalCount > 0) {
    recommendations.push("Kritik bulgular işlem öncesinde çözülmeli veya fiyata yansıtılmalıdır");
  }

  for (const cs of categoryScores) {
    if (cs.status === "kırmızı") {
      recommendations.push(`${cs.categoryName} alanında derinlemesine inceleme yapılmalıdır`);
    }
    if (cs.completionPercentage < 70) {
      recommendations.push(`${cs.categoryName} için eksik belgeler tamamlanmalıdır`);
    }
  }

  // Documentation status
  const docStatus: DocumentationStatus = {
    totalRequested: project.documents.length,
    received: project.documents.filter((d) => d.receivedDate).length,
    reviewed: project.documents.filter((d) => d.status === "tamamlandi").length,
    pending: project.documents.filter((d) => d.status === "beklemede").length,
    missing: project.documents.filter((d) => d.status === "eksik").length,
    completionPercentage: 0,
  };
  docStatus.completionPercentage = Math.round(
    (docStatus.reviewed / docStatus.totalRequested) * 100
  );

  // Generate executive summary
  const executiveSummary = `${project.targetCompany.name} şirketi için ${getDueDiligenceTypeName(project.type)} kapsamında yürütülen inceleme sonuçları bu raporda sunulmaktadır.

Toplam ${project.categories.length} kategoride inceleme yapılmış olup, ${docStatus.received}/${docStatus.totalRequested} belge alınmıştır (${docStatus.completionPercentage}% tamamlanma).

${keyFindings.length} adet önemli bulgu tespit edilmiş olup, bunların ${criticalCount} adedi kritik/yüksek önem seviyesindedir.

Genel risk değerlendirmesi: ${overallRiskRating.toUpperCase()}
Ortalama kategori skoru: ${Math.round(avgScore)}/100`;

  return {
    projectId,
    projectName: project.name,
    targetCompany: project.targetCompany.name,
    executiveSummary,
    overallRiskRating,
    categoryScores,
    keyFindings,
    redFlags,
    recommendations,
    documentationStatus: docStatus,
    generatedAt: new Date(),
  };
}

/**
 * Analyze document for potential issues (simulation)
 */
export function analyzeDocument(
  document: DueDiligenceDocument,
  content: string
): { findings: string[]; redFlags: string[]; score: number } {
  const findings: string[] = [];
  const redFlags: string[] = [];
  let score = 100;
  const contentLower = content.toLowerCase();

  // Generic risk patterns
  const riskPatterns = [
    { pattern: /tek taraflı fesih/i, finding: "Tek taraflı fesih hakkı tespit edildi", severity: 10 },
    { pattern: /sınırsız sorumluluk/i, finding: "Sınırsız sorumluluk kaydı var", severity: 20, isRedFlag: true },
    { pattern: /teminat.*ipotek/i, finding: "Teminat/ipotek kaydı mevcut", severity: 5 },
    { pattern: /cezai şart/i, finding: "Cezai şart hükmü içeriyor", severity: 5 },
    { pattern: /rekabet yasağı/i, finding: "Rekabet yasağı hükmü tespit edildi", severity: 5 },
    { pattern: /gizlilik/i, finding: "Gizlilik hükmü mevcut", severity: 0 },
    { pattern: /change of control/i, finding: "Change of control maddesi var", severity: 15, isRedFlag: true },
    { pattern: /devir.*yasak/i, finding: "Devir yasağı hükmü tespit edildi", severity: 15, isRedFlag: true },
    { pattern: /yabancı hukuk/i, finding: "Yabancı hukuk uygulanacak", severity: 10 },
    { pattern: /tahkim/i, finding: "Tahkim şartı mevcut", severity: 5 },
  ];

  // Category-specific patterns
  if (document.category === "corporate") {
    if (contentLower.includes("sermaye artırımı")) {
      findings.push("Sermaye artırımı geçmişi var - detaylı inceleme gerekli");
      score -= 5;
    }
    if (contentLower.includes("oy hakkı") || contentLower.includes("imtiyaz")) {
      findings.push("İmtiyazlı pay/oy hakkı düzenlemesi tespit edildi");
      score -= 10;
    }
  }

  if (document.category === "litigation") {
    if (contentLower.includes("dava") || contentLower.includes("icra")) {
      findings.push("Aktif dava/icra takibi referansı");
      score -= 15;
    }
  }

  if (document.category === "employment") {
    if (contentLower.includes("sendika") || contentLower.includes("toplu iş")) {
      findings.push("Sendika/toplu iş sözleşmesi durumu mevcut");
      score -= 5;
    }
  }

  if (document.category === "data_privacy") {
    if (!contentLower.includes("kvkk") && !contentLower.includes("kişisel veri")) {
      findings.push("KVKK referansı eksik");
      score -= 15;
      redFlags.push("KVKK uyum eksikliği riski");
    }
  }

  // Apply generic patterns
  for (const pattern of riskPatterns) {
    if (pattern.pattern.test(content)) {
      findings.push(pattern.finding);
      score -= pattern.severity;
      if (pattern.isRedFlag) {
        redFlags.push(pattern.finding);
      }
    }
  }

  return {
    findings,
    redFlags,
    score: Math.max(0, score),
  };
}

/**
 * Get project progress
 */
export function getProjectProgress(projectId: string): {
  overall: number;
  documentCollection: number;
  review: number;
  reporting: number;
  byCategory: Record<ReviewCategory, number>;
} | null {
  const project = projects.get(projectId);
  if (!project) return null;

  // Document collection progress
  const receivedDocs = project.documents.filter((d) => d.receivedDate).length;
  const documentCollection = project.documents.length > 0
    ? (receivedDocs / project.documents.length) * 100
    : 0;

  // Review progress
  const reviewedDocs = project.documents.filter((d) => d.status === "tamamlandi").length;
  const review = project.documents.length > 0
    ? (reviewedDocs / project.documents.length) * 100
    : 0;

  // Checklist progress
  const checklistProgress = project.checklists.length > 0
    ? project.checklists.reduce((sum, c) => sum + c.completionPercentage, 0) / project.checklists.length
    : 0;

  // Reporting (simplified)
  const reporting = project.status === "tamamlandi" ? 100 : 0;

  // Overall
  const overall = (documentCollection * 0.3 + review * 0.4 + checklistProgress * 0.2 + reporting * 0.1);

  // By category
  const byCategory: Record<ReviewCategory, number> = {} as Record<ReviewCategory, number>;
  for (const category of project.categories) {
    const catDocs = project.documents.filter((d) => d.category === category);
    const catReviewed = catDocs.filter((d) => d.status === "tamamlandi").length;
    const catChecklist = project.checklists.find((c) => c.category === category);

    const docProgress = catDocs.length > 0 ? (catReviewed / catDocs.length) * 100 : 0;
    const checkProgress = catChecklist?.completionPercentage || 0;

    byCategory[category] = Math.round((docProgress + checkProgress) / 2);
  }

  return {
    overall: Math.round(overall),
    documentCollection: Math.round(documentCollection),
    review: Math.round(review),
    reporting: Math.round(reporting),
    byCategory,
  };
}

/**
 * Get due diligence type display name
 */
export function getDueDiligenceTypeName(type: DueDiligenceType): string {
  const names: Record<DueDiligenceType, string> = {
    full_acquisition: "Tam Devralma İncelemesi",
    asset_acquisition: "Varlık Devralma İncelemesi",
    merger: "Birleşme İncelemesi",
    joint_venture: "Ortak Girişim İncelemesi",
    investment: "Yatırım İncelemesi",
    ipo_readiness: "Halka Arz Hazırlık İncelemesi",
    vendor_dd: "Satıcı Taraflı İnceleme",
    legal_audit: "Hukuki Denetim",
  };
  return names[type];
}

/**
 * Get all due diligence types
 */
export function getAllDueDiligenceTypes(): Array<{ id: DueDiligenceType; name: string }> {
  return [
    { id: "full_acquisition", name: "Tam Devralma İncelemesi" },
    { id: "asset_acquisition", name: "Varlık Devralma İncelemesi" },
    { id: "merger", name: "Birleşme İncelemesi" },
    { id: "joint_venture", name: "Ortak Girişim İncelemesi" },
    { id: "investment", name: "Yatırım İncelemesi" },
    { id: "ipo_readiness", name: "Halka Arz Hazırlık İncelemesi" },
    { id: "vendor_dd", name: "Satıcı Taraflı İnceleme" },
    { id: "legal_audit", name: "Hukuki Denetim" },
  ];
}

/**
 * Export report to different formats
 */
export function exportReport(report: DueDiligenceReport, format: "markdown" | "text"): string {
  if (format === "markdown") {
    return `# Due Diligence Raporu

## Proje Bilgileri
- **Proje:** ${report.projectName}
- **Hedef Şirket:** ${report.targetCompany}
- **Rapor Tarihi:** ${report.generatedAt.toLocaleDateString("tr-TR")}

## Yönetici Özeti
${report.executiveSummary}

## Genel Risk Değerlendirmesi
**Risk Seviyesi:** ${report.overallRiskRating.toUpperCase()}

## Kategori Skorları
| Kategori | Skor | Durum | Bulgular | Kritik |
|----------|------|-------|----------|--------|
${report.categoryScores.map((cs) => `| ${cs.categoryName} | ${cs.score}/100 | ${cs.status} | ${cs.findingsCount} | ${cs.criticalIssues} |`).join("\n")}

## Önemli Bulgular
${report.keyFindings.map((f) => `### ${f.title}
- **Kategori:** ${categoryDefinitions[f.category].name}
- **Önem:** ${f.severity}
- **Açıklama:** ${f.description}
${f.mitigationStrategy ? `- **Öneri:** ${f.mitigationStrategy}` : ""}
`).join("\n")}

## Red Flags
${report.redFlags.map((rf) => `- ${rf}`).join("\n")}

## Öneriler
${report.recommendations.map((r) => `- ${r}`).join("\n")}

## Dokümantasyon Durumu
- Talep Edilen: ${report.documentationStatus.totalRequested}
- Alınan: ${report.documentationStatus.received}
- İncelenen: ${report.documentationStatus.reviewed}
- Eksik: ${report.documentationStatus.missing}
- Tamamlanma: %${report.documentationStatus.completionPercentage}
`;
  }

  // Text format
  return `DUE DILIGENCE RAPORU
${"=".repeat(60)}

PROJE: ${report.projectName}
HEDEF ŞİRKET: ${report.targetCompany}
TARİH: ${report.generatedAt.toLocaleDateString("tr-TR")}

YÖNETİCİ ÖZETİ
${"-".repeat(40)}
${report.executiveSummary}

GENEL RİSK DEĞERLENDİRMESİ: ${report.overallRiskRating.toUpperCase()}

KATEGORİ SKORLARI
${"-".repeat(40)}
${report.categoryScores.map((cs) => `${cs.categoryName}: ${cs.score}/100 (${cs.status})`).join("\n")}

ÖNEMLİ BULGULAR
${"-".repeat(40)}
${report.keyFindings.map((f) => `• ${f.title} [${f.severity}]\n  ${f.description}`).join("\n\n")}

RED FLAGS
${"-".repeat(40)}
${report.redFlags.map((rf) => `• ${rf}`).join("\n")}

ÖNERİLER
${"-".repeat(40)}
${report.recommendations.map((r) => `• ${r}`).join("\n")}

DOKÜMANTASYON DURUMU: %${report.documentationStatus.completionPercentage}
(${report.documentationStatus.reviewed}/${report.documentationStatus.totalRequested} incelendi)

${"=".repeat(60)}
`;
}
