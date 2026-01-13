/**
 * Litigation Support Module with Deadline Tracking
 * Based on 2025-2026 trends: Automated deadline management, evidence organization, case timeline
 * Supports Turkish civil and administrative procedure rules
 */

// Litigation types
export type LitigationType =
  | "hukuk_davasi"
  | "ceza_davasi"
  | "idari_dava"
  | "is_davasi"
  | "ticaret_davasi"
  | "aile_davasi"
  | "icra_takibi"
  | "iflas_davasi";

export type DeadlineType =
  | "dava_acma"
  | "cevap_suresi"
  | "delil_sunumu"
  | "istinaf"
  | "temyiz"
  | "karar_duzeltme"
  | "odeme"
  | "tebligat"
  | "bilirkisi"
  | "durusma"
  | "ozel_sure";

export type DeadlineStatus = "aktif" | "yaklasan" | "gecmis" | "tamamlandi" | "iptal";

export type DocumentType =
  | "dava_dilekçesi"
  | "cevap_dilekçesi"
  | "delil_listesi"
  | "bilirkisi_raporu"
  | "tanık_listesi"
  | "istinaf_dilekçesi"
  | "temyiz_dilekçesi"
  | "ihtarname"
  | "vekaletname"
  | "sozlesme"
  | "fatura"
  | "banka_dekontu"
  | "diger";

export interface LitigationDeadline {
  id: string;
  caseId: string;
  type: DeadlineType;
  title: string;
  description: string;
  dueDate: Date;
  reminderDates: Date[];
  status: DeadlineStatus;
  legalBasis?: string;
  calculationBasis?: string;
  isAutoCalculated: boolean;
  priority: "kritik" | "yuksek" | "orta" | "dusuk";
  assignedTo?: string;
  completedAt?: Date;
  notes?: string;
}

export interface LitigationDocument {
  id: string;
  caseId: string;
  type: DocumentType;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  uploadedBy: string;
  tags: string[];
  isEvidence: boolean;
  evidenceNumber?: string;
  sourceParty: "davaci" | "davali" | "mahkeme" | "bilirkisi" | "diger";
  status: "aktif" | "arsiv";
  relatedDeadlineId?: string;
}

export interface LitigationParty {
  id: string;
  role: "davaci" | "davali" | "mudahil" | "ucuncu_kisi";
  partyType: "gercek_kisi" | "tuzel_kisi";
  name: string;
  identificationNumber?: string; // TC or Tax ID
  address?: string;
  phone?: string;
  email?: string;
  lawyer?: {
    name: string;
    barNumber: string;
    phone: string;
    email: string;
  };
}

export interface LitigationEvent {
  id: string;
  caseId: string;
  date: Date;
  type: "durusma" | "karar" | "tebligat" | "dilekce" | "delil" | "bilirkisi" | "diger";
  title: string;
  description: string;
  outcome?: string;
  documentIds: string[];
  isKeyEvent: boolean;
}

export interface LitigationCase {
  id: string;
  caseNumber?: string;
  courtName: string;
  courtFile?: string;
  type: LitigationType;
  subject: string;
  description: string;
  status: "acik" | "durusma_asamasi" | "karar_asamasi" | "istinaf" | "temyiz" | "kapali";
  filingDate?: Date;
  parties: LitigationParty[];
  documents: LitigationDocument[];
  deadlines: LitigationDeadline[];
  events: LitigationEvent[];
  claimAmount?: number;
  currentStage: string;
  nextHearingDate?: Date;
  assignedLawyer?: string;
  createdAt: Date;
  updatedAt: Date;
  riskAssessment?: {
    successProbability: number;
    riskLevel: "dusuk" | "orta" | "yuksek";
    factors: string[];
  };
  notes: string[];
}

export interface DeadlineCalculationInput {
  eventType: string;
  eventDate: Date;
  litigationType: LitigationType;
  isDefendant: boolean;
  courtType?: "asliye" | "sulh" | "is" | "ticaret" | "idare" | "vergi";
}

export interface LitigationStatistics {
  totalCases: number;
  openCases: number;
  closedCases: number;
  upcomingDeadlines: number;
  overdueDeadlines: number;
  upcomingHearings: number;
  casesByType: Record<LitigationType, number>;
  casesByStatus: Record<string, number>;
  avgCaseDuration: number;
  successRate: number;
}

// Turkish procedural deadlines database
const proceduralDeadlines: Record<
  string,
  { days: number; description: string; legalBasis: string; isBusinessDays: boolean }
> = {
  // HMK - Hukuk Muhakemeleri Kanunu
  cevap_suresi_hukuk: {
    days: 14,
    description: "Davalının cevap dilekçesi verme süresi",
    legalBasis: "HMK m.127",
    isBusinessDays: false,
  },
  cevaba_cevap_suresi: {
    days: 14,
    description: "Cevaba cevap ve ikinci cevap dilekçesi süresi",
    legalBasis: "HMK m.136",
    isBusinessDays: false,
  },
  istinaf_suresi_hukuk: {
    days: 14,
    description: "İstinaf başvuru süresi (kararın tebliğinden itibaren)",
    legalBasis: "HMK m.345",
    isBusinessDays: false,
  },
  temyiz_suresi_hukuk: {
    days: 14,
    description: "Temyiz başvuru süresi",
    legalBasis: "HMK m.361",
    isBusinessDays: false,
  },
  karar_duzeltme_hukuk: {
    days: 15,
    description: "Karar düzeltme başvuru süresi",
    legalBasis: "HMK m.373",
    isBusinessDays: false,
  },

  // İYUK - İdari Yargılama Usulü Kanunu
  dava_acma_idari: {
    days: 60,
    description: "İdari işlemlere karşı dava açma süresi",
    legalBasis: "İYUK m.7",
    isBusinessDays: false,
  },
  cevap_suresi_idari: {
    days: 30,
    description: "İdari davalarda cevap süresi",
    legalBasis: "İYUK m.16",
    isBusinessDays: false,
  },
  istinaf_suresi_idari: {
    days: 30,
    description: "İdari yargıda istinaf süresi",
    legalBasis: "İYUK m.45",
    isBusinessDays: false,
  },
  temyiz_suresi_idari: {
    days: 30,
    description: "İdari yargıda temyiz süresi",
    legalBasis: "İYUK m.46",
    isBusinessDays: false,
  },

  // İş Mahkemeleri
  dava_acma_is: {
    days: 30,
    description: "İşe iade davası açma süresi (fesih tebliğinden itibaren)",
    legalBasis: "4857 s.K. m.20",
    isBusinessDays: false,
  },
  ise_basvuru_suresi: {
    days: 10,
    description: "İşe iade kararından sonra işverene başvuru süresi",
    legalBasis: "4857 s.K. m.21",
    isBusinessDays: true,
  },

  // İcra İflas Kanunu
  itiraz_suresi_icra: {
    days: 7,
    description: "Ödeme emrine itiraz süresi",
    legalBasis: "İİK m.62",
    isBusinessDays: false,
  },
  itirazin_iptali_suresi: {
    days: 365,
    description: "İtirazın iptali davası açma süresi (1 yıl)",
    legalBasis: "İİK m.67",
    isBusinessDays: false,
  },
  itirazin_kaldirilmasi: {
    days: 180,
    description: "İtirazın kaldırılması davası açma süresi (6 ay)",
    legalBasis: "İİK m.68",
    isBusinessDays: false,
  },

  // Tüketici Kanunu
  cayma_hakki: {
    days: 14,
    description: "Mesafeli sözleşmelerde cayma hakkı",
    legalBasis: "6502 s.K. m.48",
    isBusinessDays: false,
  },
  tuketici_sikayet: {
    days: 30,
    description: "Satıcıya başvuru süresi (ayıp halinde)",
    legalBasis: "6502 s.K. m.11",
    isBusinessDays: false,
  },

  // KVKK
  veri_sahibi_basvuru: {
    days: 30,
    description: "Veri sorumlusunun başvuruya cevap süresi",
    legalBasis: "KVKK m.13",
    isBusinessDays: false,
  },
  kurula_sikayet: {
    days: 30,
    description: "KVKK Kurulu'na şikayet süresi",
    legalBasis: "KVKK m.14",
    isBusinessDays: false,
  },
};

// Case storage
const cases: Map<string, LitigationCase> = new Map();

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Add business days to a date
 */
function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let addedDays = 0;
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      addedDays++;
    }
  }
  return result;
}

/**
 * Add calendar days to a date
 */
function addCalendarDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Calculate deadline based on event type
 */
export function calculateDeadline(input: DeadlineCalculationInput): {
  deadline: Date;
  description: string;
  legalBasis: string;
} | null {
  let deadlineKey: string | null = null;

  // Determine the appropriate deadline
  switch (input.eventType) {
    case "dava_teblig":
      if (input.litigationType === "idari_dava") {
        deadlineKey = "cevap_suresi_idari";
      } else if (input.litigationType === "is_davasi") {
        deadlineKey = "cevap_suresi_hukuk";
      } else {
        deadlineKey = "cevap_suresi_hukuk";
      }
      break;
    case "karar_teblig":
      if (input.litigationType === "idari_dava") {
        deadlineKey = "istinaf_suresi_idari";
      } else {
        deadlineKey = "istinaf_suresi_hukuk";
      }
      break;
    case "istinaf_karar":
      if (input.litigationType === "idari_dava") {
        deadlineKey = "temyiz_suresi_idari";
      } else {
        deadlineKey = "temyiz_suresi_hukuk";
      }
      break;
    case "odeme_emri":
      deadlineKey = "itiraz_suresi_icra";
      break;
    case "fesih_teblig":
      if (input.litigationType === "is_davasi") {
        deadlineKey = "dava_acma_is";
      }
      break;
    case "idari_islem":
      deadlineKey = "dava_acma_idari";
      break;
    default:
      return null;
  }

  if (!deadlineKey || !proceduralDeadlines[deadlineKey]) {
    return null;
  }

  const deadlineInfo = proceduralDeadlines[deadlineKey];
  const deadlineDate = deadlineInfo.isBusinessDays
    ? addBusinessDays(input.eventDate, deadlineInfo.days)
    : addCalendarDays(input.eventDate, deadlineInfo.days);

  return {
    deadline: deadlineDate,
    description: deadlineInfo.description,
    legalBasis: deadlineInfo.legalBasis,
  };
}

/**
 * Get all procedural deadlines information
 */
export function getProceduralDeadlinesInfo(): Array<{
  key: string;
  days: number;
  description: string;
  legalBasis: string;
  isBusinessDays: boolean;
}> {
  return Object.entries(proceduralDeadlines).map(([key, info]) => ({
    key,
    ...info,
  }));
}

/**
 * Create a new litigation case
 */
export function createLitigationCase(
  data: Omit<LitigationCase, "id" | "documents" | "deadlines" | "events" | "createdAt" | "updatedAt">
): LitigationCase {
  const id = generateId("case");
  const now = new Date();

  const newCase: LitigationCase = {
    ...data,
    id,
    documents: [],
    deadlines: [],
    events: [],
    createdAt: now,
    updatedAt: now,
  };

  cases.set(id, newCase);
  return newCase;
}

/**
 * Get case by ID
 */
export function getLitigationCase(caseId: string): LitigationCase | undefined {
  return cases.get(caseId);
}

/**
 * Get all cases
 */
export function getAllLitigationCases(): LitigationCase[] {
  return Array.from(cases.values());
}

/**
 * Update case
 */
export function updateLitigationCase(
  caseId: string,
  updates: Partial<LitigationCase>
): LitigationCase | null {
  const existingCase = cases.get(caseId);
  if (!existingCase) return null;

  const updatedCase: LitigationCase = {
    ...existingCase,
    ...updates,
    id: existingCase.id,
    createdAt: existingCase.createdAt,
    updatedAt: new Date(),
  };

  cases.set(caseId, updatedCase);
  return updatedCase;
}

/**
 * Add deadline to case
 */
export function addDeadline(
  caseId: string,
  deadline: Omit<LitigationDeadline, "id" | "caseId" | "status">
): LitigationDeadline | null {
  const existingCase = cases.get(caseId);
  if (!existingCase) return null;

  const now = new Date();
  const dueDate = new Date(deadline.dueDate);

  // Calculate status
  let status: DeadlineStatus = "aktif";
  const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilDue < 0) {
    status = "gecmis";
  } else if (daysUntilDue <= 7) {
    status = "yaklasan";
  }

  const newDeadline: LitigationDeadline = {
    ...deadline,
    id: generateId("deadline"),
    caseId,
    status,
  };

  existingCase.deadlines.push(newDeadline);
  existingCase.updatedAt = new Date();
  cases.set(caseId, existingCase);

  return newDeadline;
}

/**
 * Complete a deadline
 */
export function completeDeadline(caseId: string, deadlineId: string): boolean {
  const existingCase = cases.get(caseId);
  if (!existingCase) return false;

  const deadline = existingCase.deadlines.find((d) => d.id === deadlineId);
  if (!deadline) return false;

  deadline.status = "tamamlandi";
  deadline.completedAt = new Date();
  existingCase.updatedAt = new Date();
  cases.set(caseId, existingCase);

  return true;
}

/**
 * Add document to case
 */
export function addDocument(
  caseId: string,
  document: Omit<LitigationDocument, "id" | "caseId" | "uploadedAt" | "status">
): LitigationDocument | null {
  const existingCase = cases.get(caseId);
  if (!existingCase) return null;

  const newDocument: LitigationDocument = {
    ...document,
    id: generateId("doc"),
    caseId,
    uploadedAt: new Date(),
    status: "aktif",
  };

  existingCase.documents.push(newDocument);
  existingCase.updatedAt = new Date();
  cases.set(caseId, existingCase);

  return newDocument;
}

/**
 * Add event to case
 */
export function addEvent(
  caseId: string,
  event: Omit<LitigationEvent, "id" | "caseId">
): LitigationEvent | null {
  const existingCase = cases.get(caseId);
  if (!existingCase) return null;

  const newEvent: LitigationEvent = {
    ...event,
    id: generateId("event"),
    caseId,
  };

  existingCase.events.push(newEvent);
  existingCase.events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  existingCase.updatedAt = new Date();
  cases.set(caseId, existingCase);

  return newEvent;
}

/**
 * Add party to case
 */
export function addParty(caseId: string, party: Omit<LitigationParty, "id">): LitigationParty | null {
  const existingCase = cases.get(caseId);
  if (!existingCase) return null;

  const newParty: LitigationParty = {
    ...party,
    id: generateId("party"),
  };

  existingCase.parties.push(newParty);
  existingCase.updatedAt = new Date();
  cases.set(caseId, existingCase);

  return newParty;
}

/**
 * Get upcoming deadlines across all cases
 */
export function getUpcomingDeadlines(daysAhead: number = 30): LitigationDeadline[] {
  const now = new Date();
  const cutoff = addCalendarDays(now, daysAhead);
  const deadlines: LitigationDeadline[] = [];

  for (const litigationCase of cases.values()) {
    for (const deadline of litigationCase.deadlines) {
      if (
        deadline.status !== "tamamlandi" &&
        deadline.status !== "iptal" &&
        new Date(deadline.dueDate) <= cutoff
      ) {
        deadlines.push(deadline);
      }
    }
  }

  // Sort by due date
  return deadlines.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
}

/**
 * Get overdue deadlines
 */
export function getOverdueDeadlines(): LitigationDeadline[] {
  const now = new Date();
  const deadlines: LitigationDeadline[] = [];

  for (const litigationCase of cases.values()) {
    for (const deadline of litigationCase.deadlines) {
      if (
        deadline.status !== "tamamlandi" &&
        deadline.status !== "iptal" &&
        new Date(deadline.dueDate) < now
      ) {
        deadline.status = "gecmis";
        deadlines.push(deadline);
      }
    }
  }

  return deadlines;
}

/**
 * Update deadline statuses
 */
export function updateDeadlineStatuses(): void {
  const now = new Date();

  for (const litigationCase of cases.values()) {
    let updated = false;

    for (const deadline of litigationCase.deadlines) {
      if (deadline.status === "tamamlandi" || deadline.status === "iptal") {
        continue;
      }

      const dueDate = new Date(deadline.dueDate);
      const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      const oldStatus = deadline.status;
      if (daysUntilDue < 0) {
        deadline.status = "gecmis";
      } else if (daysUntilDue <= 7) {
        deadline.status = "yaklasan";
      } else {
        deadline.status = "aktif";
      }

      if (oldStatus !== deadline.status) {
        updated = true;
      }
    }

    if (updated) {
      litigationCase.updatedAt = new Date();
      cases.set(litigationCase.id, litigationCase);
    }
  }
}

/**
 * Get upcoming hearings
 */
export function getUpcomingHearings(daysAhead: number = 30): Array<{
  caseId: string;
  caseNumber?: string;
  courtName: string;
  subject: string;
  hearingDate: Date;
  event?: LitigationEvent;
}> {
  const now = new Date();
  const cutoff = addCalendarDays(now, daysAhead);
  const hearings: Array<{
    caseId: string;
    caseNumber?: string;
    courtName: string;
    subject: string;
    hearingDate: Date;
    event?: LitigationEvent;
  }> = [];

  for (const litigationCase of cases.values()) {
    // Check nextHearingDate
    if (
      litigationCase.nextHearingDate &&
      new Date(litigationCase.nextHearingDate) >= now &&
      new Date(litigationCase.nextHearingDate) <= cutoff
    ) {
      hearings.push({
        caseId: litigationCase.id,
        caseNumber: litigationCase.caseNumber,
        courtName: litigationCase.courtName,
        subject: litigationCase.subject,
        hearingDate: new Date(litigationCase.nextHearingDate),
      });
    }

    // Check events
    for (const event of litigationCase.events) {
      if (
        event.type === "durusma" &&
        new Date(event.date) >= now &&
        new Date(event.date) <= cutoff
      ) {
        hearings.push({
          caseId: litigationCase.id,
          caseNumber: litigationCase.caseNumber,
          courtName: litigationCase.courtName,
          subject: litigationCase.subject,
          hearingDate: new Date(event.date),
          event,
        });
      }
    }
  }

  // Sort by hearing date
  return hearings.sort((a, b) => a.hearingDate.getTime() - b.hearingDate.getTime());
}

/**
 * Generate case timeline
 */
export function generateCaseTimeline(caseId: string): Array<{
  date: Date;
  type: string;
  title: string;
  description: string;
  isKeyEvent: boolean;
}> {
  const litigationCase = cases.get(caseId);
  if (!litigationCase) return [];

  const timeline: Array<{
    date: Date;
    type: string;
    title: string;
    description: string;
    isKeyEvent: boolean;
  }> = [];

  // Add case creation
  timeline.push({
    date: litigationCase.createdAt,
    type: "sistem",
    title: "Dava Kaydı Oluşturuldu",
    description: `"${litigationCase.subject}" konulu dava sisteme kaydedildi`,
    isKeyEvent: false,
  });

  // Add filing date if exists
  if (litigationCase.filingDate) {
    timeline.push({
      date: litigationCase.filingDate,
      type: "dava",
      title: "Dava Açıldı",
      description: `${litigationCase.courtName} nezdinde dava açıldı`,
      isKeyEvent: true,
    });
  }

  // Add events
  for (const event of litigationCase.events) {
    timeline.push({
      date: new Date(event.date),
      type: event.type,
      title: event.title,
      description: event.description,
      isKeyEvent: event.isKeyEvent,
    });
  }

  // Add completed deadlines
  for (const deadline of litigationCase.deadlines) {
    if (deadline.status === "tamamlandi" && deadline.completedAt) {
      timeline.push({
        date: deadline.completedAt,
        type: "sure",
        title: `${deadline.title} - Tamamlandı`,
        description: deadline.description,
        isKeyEvent: false,
      });
    }
  }

  // Add documents
  for (const doc of litigationCase.documents) {
    if (doc.isEvidence) {
      timeline.push({
        date: doc.uploadedAt,
        type: "belge",
        title: `Delil Eklendi: ${doc.title}`,
        description: `${doc.type} - ${doc.sourceParty} tarafından`,
        isKeyEvent: false,
      });
    }
  }

  // Sort by date
  return timeline.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Generate case statistics
 */
export function getLitigationStatistics(): LitigationStatistics {
  const allCases = Array.from(cases.values());
  const now = new Date();

  // Count cases by status
  const openCases = allCases.filter((c) => c.status !== "kapali").length;
  const closedCases = allCases.filter((c) => c.status === "kapali").length;

  // Count deadlines
  let upcomingDeadlines = 0;
  let overdueDeadlines = 0;
  for (const c of allCases) {
    for (const d of c.deadlines) {
      if (d.status === "yaklasan") upcomingDeadlines++;
      if (d.status === "gecmis") overdueDeadlines++;
    }
  }

  // Count upcoming hearings
  const upcomingHearings = getUpcomingHearings(30).length;

  // Cases by type
  const casesByType: Record<LitigationType, number> = {
    hukuk_davasi: 0,
    ceza_davasi: 0,
    idari_dava: 0,
    is_davasi: 0,
    ticaret_davasi: 0,
    aile_davasi: 0,
    icra_takibi: 0,
    iflas_davasi: 0,
  };
  for (const c of allCases) {
    casesByType[c.type]++;
  }

  // Cases by status
  const casesByStatus: Record<string, number> = {};
  for (const c of allCases) {
    casesByStatus[c.status] = (casesByStatus[c.status] || 0) + 1;
  }

  // Calculate average duration for closed cases
  let totalDuration = 0;
  let closedCount = 0;
  for (const c of allCases) {
    if (c.status === "kapali" && c.filingDate) {
      const duration = c.updatedAt.getTime() - c.filingDate.getTime();
      totalDuration += duration;
      closedCount++;
    }
  }
  const avgCaseDuration = closedCount > 0 ? totalDuration / closedCount / (1000 * 60 * 60 * 24) : 0;

  // Calculate success rate (simplified)
  let successCount = 0;
  for (const c of allCases) {
    if (
      c.status === "kapali" &&
      c.riskAssessment &&
      c.riskAssessment.successProbability >= 0.5
    ) {
      successCount++;
    }
  }
  const successRate = closedCount > 0 ? (successCount / closedCount) * 100 : 0;

  return {
    totalCases: allCases.length,
    openCases,
    closedCases,
    upcomingDeadlines,
    overdueDeadlines,
    upcomingHearings,
    casesByType,
    casesByStatus,
    avgCaseDuration,
    successRate,
  };
}

/**
 * Search cases
 */
export function searchCases(query: string): LitigationCase[] {
  const queryLower = query.toLowerCase();

  return Array.from(cases.values()).filter((c) => {
    return (
      c.subject.toLowerCase().includes(queryLower) ||
      c.caseNumber?.toLowerCase().includes(queryLower) ||
      c.courtName.toLowerCase().includes(queryLower) ||
      c.parties.some((p) => p.name.toLowerCase().includes(queryLower)) ||
      c.notes.some((n) => n.toLowerCase().includes(queryLower))
    );
  });
}

/**
 * Get deadline reminders
 */
export function getDeadlineReminders(): Array<{
  deadline: LitigationDeadline;
  case: LitigationCase;
  message: string;
  urgency: "kritik" | "yuksek" | "orta" | "bilgi";
}> {
  const now = new Date();
  const reminders: Array<{
    deadline: LitigationDeadline;
    case: LitigationCase;
    message: string;
    urgency: "kritik" | "yuksek" | "orta" | "bilgi";
  }> = [];

  for (const litigationCase of cases.values()) {
    for (const deadline of litigationCase.deadlines) {
      if (deadline.status === "tamamlandi" || deadline.status === "iptal") {
        continue;
      }

      const dueDate = new Date(deadline.dueDate);
      const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      let urgency: "kritik" | "yuksek" | "orta" | "bilgi" = "bilgi";
      let message = "";

      if (daysUntilDue < 0) {
        urgency = "kritik";
        message = `GECİKMİŞ: ${deadline.title} - ${Math.abs(daysUntilDue)} gün gecikme!`;
      } else if (daysUntilDue === 0) {
        urgency = "kritik";
        message = `BUGÜN SON GÜN: ${deadline.title}`;
      } else if (daysUntilDue <= 3) {
        urgency = "yuksek";
        message = `ACİL: ${deadline.title} - ${daysUntilDue} gün kaldı`;
      } else if (daysUntilDue <= 7) {
        urgency = "orta";
        message = `YAKLASAN: ${deadline.title} - ${daysUntilDue} gün kaldı`;
      } else if (daysUntilDue <= 14) {
        urgency = "bilgi";
        message = `HATIRLATMA: ${deadline.title} - ${daysUntilDue} gün kaldı`;
      } else {
        continue; // Don't remind for deadlines more than 14 days away
      }

      reminders.push({
        deadline,
        case: litigationCase,
        message,
        urgency,
      });
    }
  }

  // Sort by urgency and then by due date
  const urgencyOrder = { kritik: 0, yuksek: 1, orta: 2, bilgi: 3 };
  return reminders.sort((a, b) => {
    const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;
    return new Date(a.deadline.dueDate).getTime() - new Date(b.deadline.dueDate).getTime();
  });
}

/**
 * Export case report
 */
export function exportCaseReport(caseId: string, format: "text" | "markdown"): string | null {
  const litigationCase = cases.get(caseId);
  if (!litigationCase) return null;

  const timeline = generateCaseTimeline(caseId);

  if (format === "markdown") {
    return `# Dava Raporu

## Genel Bilgiler
- **Dava No:** ${litigationCase.caseNumber || "Belirlenmedi"}
- **Mahkeme:** ${litigationCase.courtName}
- **Konu:** ${litigationCase.subject}
- **Dava Türü:** ${litigationCase.type}
- **Durum:** ${litigationCase.status}
- **Dava Tarihi:** ${litigationCase.filingDate?.toLocaleDateString("tr-TR") || "Belirlenmedi"}

## Taraflar
${litigationCase.parties
  .map(
    (p) => `### ${p.role === "davaci" ? "Davacı" : "Davalı"}
- **Ad:** ${p.name}
- **Avukat:** ${p.lawyer?.name || "Belirtilmedi"}`
  )
  .join("\n\n")}

## Yaklaşan Süreler
${litigationCase.deadlines
  .filter((d) => d.status !== "tamamlandi" && d.status !== "iptal")
  .map(
    (d) =>
      `- **${d.title}** - ${new Date(d.dueDate).toLocaleDateString("tr-TR")} (${d.status})`
  )
  .join("\n")}

## Zaman Çizelgesi
${timeline.map((t) => `- **${t.date.toLocaleDateString("tr-TR")}** - ${t.title}`).join("\n")}

## Belgeler
${litigationCase.documents.map((d) => `- ${d.title} (${d.type})`).join("\n")}

---
*Rapor Tarihi: ${new Date().toLocaleDateString("tr-TR")}*
`;
  }

  // Text format
  return `DAVA RAPORU
${"=".repeat(50)}

GENEL BİLGİLER
${"-".repeat(30)}
Dava No: ${litigationCase.caseNumber || "Belirlenmedi"}
Mahkeme: ${litigationCase.courtName}
Konu: ${litigationCase.subject}
Dava Türü: ${litigationCase.type}
Durum: ${litigationCase.status}
Dava Tarihi: ${litigationCase.filingDate?.toLocaleDateString("tr-TR") || "Belirlenmedi"}

TARAFLAR
${"-".repeat(30)}
${litigationCase.parties.map((p) => `${p.role === "davaci" ? "Davacı" : "Davalı"}: ${p.name}`).join("\n")}

YAKLAŞAN SÜRELER
${"-".repeat(30)}
${litigationCase.deadlines
  .filter((d) => d.status !== "tamamlandi" && d.status !== "iptal")
  .map((d) => `• ${d.title} - ${new Date(d.dueDate).toLocaleDateString("tr-TR")}`)
  .join("\n")}

ZAMAN ÇİZELGESİ
${"-".repeat(30)}
${timeline.map((t) => `${t.date.toLocaleDateString("tr-TR")} - ${t.title}`).join("\n")}

BELGELER
${"-".repeat(30)}
${litigationCase.documents.map((d) => `• ${d.title}`).join("\n")}

${"=".repeat(50)}
Rapor Tarihi: ${new Date().toLocaleDateString("tr-TR")}
`;
}

/**
 * Get litigation type display name
 */
export function getLitigationTypeName(type: LitigationType): string {
  const names: Record<LitigationType, string> = {
    hukuk_davasi: "Hukuk Davası",
    ceza_davasi: "Ceza Davası",
    idari_dava: "İdari Dava",
    is_davasi: "İş Davası",
    ticaret_davasi: "Ticaret Davası",
    aile_davasi: "Aile Davası",
    icra_takibi: "İcra Takibi",
    iflas_davasi: "İflas Davası",
  };
  return names[type];
}

/**
 * Get all litigation types
 */
export function getAllLitigationTypes(): Array<{ id: LitigationType; name: string }> {
  return [
    { id: "hukuk_davasi", name: "Hukuk Davası" },
    { id: "ceza_davasi", name: "Ceza Davası" },
    { id: "idari_dava", name: "İdari Dava" },
    { id: "is_davasi", name: "İş Davası" },
    { id: "ticaret_davasi", name: "Ticaret Davası" },
    { id: "aile_davasi", name: "Aile Davası" },
    { id: "icra_takibi", name: "İcra Takibi" },
    { id: "iflas_davasi", name: "İflas Davası" },
  ];
}
