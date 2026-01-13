/**
 * KVKK Consent Management System
 * Based on 2025 updates: Digital consent tracking, user-friendly withdrawal mechanisms
 * Supports automated consent lifecycle management
 */

// Consent types
export type ConsentType =
  | "acik_riza"
  | "pazarlama"
  | "profilleme"
  | "yurtdisi_aktarim"
  | "ozel_nitelikli"
  | "cerez"
  | "ucuncu_taraf"
  | "elektronik_ileti";

export type ConsentStatus = "aktif" | "geri_cekildi" | "suresi_doldu" | "beklemede";

export type ConsentChannel = "web" | "mobil" | "kagit" | "email" | "sms" | "telefon" | "yuz_yuze";

export type DataSubjectCategory =
  | "musteri"
  | "potansiyel_musteri"
  | "calisan"
  | "aday"
  | "tedarikci"
  | "ziyaretci"
  | "abone"
  | "diger";

export interface ConsentRecord {
  id: string;
  dataSubjectId: string;
  dataSubjectCategory: DataSubjectCategory;
  consentType: ConsentType;
  purpose: string;
  legalBasis: string;
  status: ConsentStatus;
  version: string;
  consentText: string;
  channel: ConsentChannel;
  collectedAt: Date;
  collectedBy?: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  expiresAt?: Date;
  withdrawnAt?: Date;
  withdrawalReason?: string;
  parentConsentId?: string;
  linkedProcessingActivities: string[];
  proofDocument?: string;
  metadata: Record<string, unknown>;
}

export interface DataSubject {
  id: string;
  externalId?: string;
  category: DataSubjectCategory;
  email?: string;
  phone?: string;
  fullName?: string;
  identificationHash?: string; // Hashed TC or other ID
  consents: ConsentRecord[];
  preferences: ConsentPreference[];
  requests: DataSubjectRequest[];
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt?: Date;
  isVerified: boolean;
  communicationPreference: "email" | "sms" | "telefon" | "posta";
}

export interface ConsentPreference {
  category: string;
  isEnabled: boolean;
  lastUpdated: Date;
  source: ConsentChannel;
}

export interface DataSubjectRequest {
  id: string;
  dataSubjectId: string;
  type: "erisim" | "duzeltme" | "silme" | "kisitlama" | "tasinabilirlik" | "itiraz";
  status: "beklemede" | "inceleniyor" | "tamamlandi" | "reddedildi";
  description: string;
  submittedAt: Date;
  responseDeadline: Date;
  respondedAt?: Date;
  response?: string;
  assignedTo?: string;
  attachments: string[];
}

export interface ConsentTemplate {
  id: string;
  name: string;
  consentType: ConsentType;
  version: string;
  language: "tr" | "en";
  title: string;
  text: string;
  shortDescription: string;
  purposes: string[];
  dataCategories: string[];
  retentionPeriod: string;
  thirdParties?: string[];
  isActive: boolean;
  effectiveFrom: Date;
  effectiveUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConsentCampaign {
  id: string;
  name: string;
  description: string;
  templateId: string;
  targetAudience: DataSubjectCategory[];
  channel: ConsentChannel;
  status: "taslak" | "aktif" | "tamamlandi" | "iptal";
  startDate: Date;
  endDate?: Date;
  sentCount: number;
  consentedCount: number;
  withdrawnCount: number;
  conversionRate: number;
  createdAt: Date;
}

export interface ConsentReport {
  generatedAt: Date;
  period: { start: Date; end: Date };
  summary: {
    totalDataSubjects: number;
    activeConsents: number;
    withdrawnConsents: number;
    pendingRequests: number;
    overdueRequests: number;
  };
  byConsentType: Array<{
    type: ConsentType;
    typeName: string;
    active: number;
    withdrawn: number;
    conversionRate: number;
  }>;
  byChannel: Array<{
    channel: ConsentChannel;
    collected: number;
    withdrawn: number;
  }>;
  trends: Array<{
    date: string;
    collected: number;
    withdrawn: number;
  }>;
  complianceScore: number;
  issues: string[];
  recommendations: string[];
}

export interface ConsentAuditLog {
  id: string;
  timestamp: Date;
  action: "created" | "updated" | "withdrawn" | "expired" | "renewed" | "exported";
  consentId?: string;
  dataSubjectId: string;
  performedBy: string;
  ipAddress?: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}

// Consent type definitions
const consentTypeInfo: Record<
  ConsentType,
  { name: string; description: string; requiresExplicit: boolean; kvkkArticle: string }
> = {
  acik_riza: {
    name: "Açık Rıza",
    description: "Genel veri işleme için açık rıza",
    requiresExplicit: true,
    kvkkArticle: "KVKK m.5/1",
  },
  pazarlama: {
    name: "Pazarlama İletişimi",
    description: "Ticari elektronik ileti gönderimi için rıza",
    requiresExplicit: true,
    kvkkArticle: "6563 s.K. m.6, KVKK m.5/1",
  },
  profilleme: {
    name: "Profilleme ve Analiz",
    description: "Otomatik karar verme ve profilleme için rıza",
    requiresExplicit: true,
    kvkkArticle: "KVKK m.11/1-g",
  },
  yurtdisi_aktarim: {
    name: "Yurtdışı Veri Aktarımı",
    description: "Kişisel verilerin yurtdışına aktarılması için rıza",
    requiresExplicit: true,
    kvkkArticle: "KVKK m.9",
  },
  ozel_nitelikli: {
    name: "Özel Nitelikli Veri İşleme",
    description: "Sağlık, biyometrik vb. özel nitelikli verilerin işlenmesi",
    requiresExplicit: true,
    kvkkArticle: "KVKK m.6",
  },
  cerez: {
    name: "Çerez Kullanımı",
    description: "Web sitesi çerezleri için rıza",
    requiresExplicit: true,
    kvkkArticle: "KVKK m.5/1, 5809 s.K.",
  },
  ucuncu_taraf: {
    name: "Üçüncü Taraf Paylaşımı",
    description: "Verilerin iş ortaklarıyla paylaşılması için rıza",
    requiresExplicit: true,
    kvkkArticle: "KVKK m.8",
  },
  elektronik_ileti: {
    name: "Elektronik İleti",
    description: "E-posta, SMS bildirimleri için izin",
    requiresExplicit: true,
    kvkkArticle: "6563 s.K. m.6",
  },
};

// Storage
const dataSubjects: Map<string, DataSubject> = new Map();
const consentTemplates: Map<string, ConsentTemplate> = new Map();
const campaigns: Map<string, ConsentCampaign> = new Map();
const auditLogs: ConsentAuditLog[] = [];

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Add audit log entry
 */
function addAuditLog(
  action: ConsentAuditLog["action"],
  dataSubjectId: string,
  performedBy: string,
  details: string,
  consentId?: string,
  ipAddress?: string,
  previousValue?: string,
  newValue?: string
): void {
  auditLogs.push({
    id: generateId("audit"),
    timestamp: new Date(),
    action,
    consentId,
    dataSubjectId,
    performedBy,
    ipAddress,
    details,
    previousValue,
    newValue,
  });
}

/**
 * Get consent type information
 */
export function getConsentTypeInfo(type: ConsentType): {
  name: string;
  description: string;
  requiresExplicit: boolean;
  kvkkArticle: string;
} {
  return consentTypeInfo[type];
}

/**
 * Get all consent types
 */
export function getAllConsentTypes(): Array<{
  id: ConsentType;
  name: string;
  description: string;
  kvkkArticle: string;
}> {
  return Object.entries(consentTypeInfo).map(([id, info]) => ({
    id: id as ConsentType,
    name: info.name,
    description: info.description,
    kvkkArticle: info.kvkkArticle,
  }));
}

/**
 * Create or get data subject
 */
export function getOrCreateDataSubject(
  identifier: { email?: string; phone?: string; externalId?: string },
  category: DataSubjectCategory = "musteri"
): DataSubject {
  // Try to find existing
  for (const subject of dataSubjects.values()) {
    if (
      (identifier.email && subject.email === identifier.email) ||
      (identifier.phone && subject.phone === identifier.phone) ||
      (identifier.externalId && subject.externalId === identifier.externalId)
    ) {
      return subject;
    }
  }

  // Create new
  const id = generateId("subject");
  const now = new Date();

  const newSubject: DataSubject = {
    id,
    externalId: identifier.externalId,
    category,
    email: identifier.email,
    phone: identifier.phone,
    consents: [],
    preferences: [],
    requests: [],
    createdAt: now,
    updatedAt: now,
    isVerified: false,
    communicationPreference: identifier.email ? "email" : "sms",
  };

  dataSubjects.set(id, newSubject);
  return newSubject;
}

/**
 * Get data subject by ID
 */
export function getDataSubject(id: string): DataSubject | undefined {
  return dataSubjects.get(id);
}

/**
 * Collect consent
 */
export function collectConsent(
  dataSubjectId: string,
  consentData: {
    consentType: ConsentType;
    purpose: string;
    consentText: string;
    channel: ConsentChannel;
    version?: string;
    expiresAt?: Date;
    linkedProcessingActivities?: string[];
    ipAddress?: string;
    userAgent?: string;
    collectedBy?: string;
    metadata?: Record<string, unknown>;
  }
): ConsentRecord | null {
  const subject = dataSubjects.get(dataSubjectId);
  if (!subject) return null;

  const typeInfo = consentTypeInfo[consentData.consentType];

  const consent: ConsentRecord = {
    id: generateId("consent"),
    dataSubjectId,
    dataSubjectCategory: subject.category,
    consentType: consentData.consentType,
    purpose: consentData.purpose,
    legalBasis: typeInfo.kvkkArticle,
    status: "aktif",
    version: consentData.version || "1.0",
    consentText: consentData.consentText,
    channel: consentData.channel,
    collectedAt: new Date(),
    collectedBy: consentData.collectedBy,
    ipAddress: consentData.ipAddress,
    userAgent: consentData.userAgent,
    expiresAt: consentData.expiresAt,
    linkedProcessingActivities: consentData.linkedProcessingActivities || [],
    metadata: consentData.metadata || {},
  };

  subject.consents.push(consent);
  subject.updatedAt = new Date();
  subject.lastActivityAt = new Date();
  dataSubjects.set(dataSubjectId, subject);

  addAuditLog(
    "created",
    dataSubjectId,
    consentData.collectedBy || "system",
    `${typeInfo.name} rızası alındı`,
    consent.id,
    consentData.ipAddress
  );

  return consent;
}

/**
 * Withdraw consent
 */
export function withdrawConsent(
  dataSubjectId: string,
  consentId: string,
  reason?: string,
  withdrawnBy?: string,
  ipAddress?: string
): boolean {
  const subject = dataSubjects.get(dataSubjectId);
  if (!subject) return false;

  const consent = subject.consents.find((c) => c.id === consentId);
  if (!consent) return false;

  if (consent.status === "geri_cekildi") {
    return false; // Already withdrawn
  }

  const previousStatus = consent.status;
  consent.status = "geri_cekildi";
  consent.withdrawnAt = new Date();
  consent.withdrawalReason = reason;

  subject.updatedAt = new Date();
  subject.lastActivityAt = new Date();
  dataSubjects.set(dataSubjectId, subject);

  addAuditLog(
    "withdrawn",
    dataSubjectId,
    withdrawnBy || "data_subject",
    `${consentTypeInfo[consent.consentType].name} rızası geri çekildi. Neden: ${reason || "Belirtilmedi"}`,
    consentId,
    ipAddress,
    previousStatus,
    "geri_cekildi"
  );

  return true;
}

/**
 * Check if consent is valid
 */
export function isConsentValid(
  dataSubjectId: string,
  consentType: ConsentType
): { valid: boolean; consent?: ConsentRecord; reason?: string } {
  const subject = dataSubjects.get(dataSubjectId);
  if (!subject) {
    return { valid: false, reason: "Veri sahibi bulunamadı" };
  }

  const consent = subject.consents.find(
    (c) => c.consentType === consentType && c.status === "aktif"
  );

  if (!consent) {
    return { valid: false, reason: "Geçerli rıza kaydı bulunamadı" };
  }

  // Check expiration
  if (consent.expiresAt && new Date() > new Date(consent.expiresAt)) {
    consent.status = "suresi_doldu";
    dataSubjects.set(dataSubjectId, subject);
    return { valid: false, consent, reason: "Rıza süresi dolmuş" };
  }

  return { valid: true, consent };
}

/**
 * Get all consents for a data subject
 */
export function getDataSubjectConsents(dataSubjectId: string): ConsentRecord[] {
  const subject = dataSubjects.get(dataSubjectId);
  return subject?.consents || [];
}

/**
 * Create consent template
 */
export function createConsentTemplate(
  data: Omit<ConsentTemplate, "id" | "createdAt" | "updatedAt">
): ConsentTemplate {
  const id = generateId("template");
  const now = new Date();

  const template: ConsentTemplate = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  consentTemplates.set(id, template);
  return template;
}

/**
 * Get consent template
 */
export function getConsentTemplate(id: string): ConsentTemplate | undefined {
  return consentTemplates.get(id);
}

/**
 * Get all active templates
 */
export function getActiveTemplates(): ConsentTemplate[] {
  const now = new Date();
  return Array.from(consentTemplates.values()).filter(
    (t) =>
      t.isActive &&
      new Date(t.effectiveFrom) <= now &&
      (!t.effectiveUntil || new Date(t.effectiveUntil) >= now)
  );
}

/**
 * Create data subject request
 */
export function createDataSubjectRequest(
  dataSubjectId: string,
  request: Omit<DataSubjectRequest, "id" | "dataSubjectId" | "submittedAt" | "responseDeadline" | "status">
): DataSubjectRequest | null {
  const subject = dataSubjects.get(dataSubjectId);
  if (!subject) return null;

  const now = new Date();
  // KVKK requires response within 30 days
  const deadline = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const newRequest: DataSubjectRequest = {
    ...request,
    id: generateId("request"),
    dataSubjectId,
    status: "beklemede",
    submittedAt: now,
    responseDeadline: deadline,
    attachments: request.attachments || [],
  };

  subject.requests.push(newRequest);
  subject.updatedAt = now;
  dataSubjects.set(dataSubjectId, subject);

  return newRequest;
}

/**
 * Respond to data subject request
 */
export function respondToRequest(
  dataSubjectId: string,
  requestId: string,
  response: string,
  status: "tamamlandi" | "reddedildi",
  respondedBy: string
): boolean {
  const subject = dataSubjects.get(dataSubjectId);
  if (!subject) return false;

  const request = subject.requests.find((r) => r.id === requestId);
  if (!request) return false;

  request.status = status;
  request.response = response;
  request.respondedAt = new Date();
  request.assignedTo = respondedBy;

  subject.updatedAt = new Date();
  dataSubjects.set(dataSubjectId, subject);

  addAuditLog(
    "updated",
    dataSubjectId,
    respondedBy,
    `Veri sahibi başvurusu ${status === "tamamlandi" ? "yanıtlandı" : "reddedildi"}`,
    undefined,
    undefined
  );

  return true;
}

/**
 * Get pending requests
 */
export function getPendingRequests(): Array<{
  request: DataSubjectRequest;
  dataSubject: DataSubject;
  isOverdue: boolean;
  daysRemaining: number;
}> {
  const now = new Date();
  const results: Array<{
    request: DataSubjectRequest;
    dataSubject: DataSubject;
    isOverdue: boolean;
    daysRemaining: number;
  }> = [];

  for (const subject of dataSubjects.values()) {
    for (const request of subject.requests) {
      if (request.status === "beklemede" || request.status === "inceleniyor") {
        const deadline = new Date(request.responseDeadline);
        const daysRemaining = Math.ceil(
          (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        const isOverdue = daysRemaining < 0;

        results.push({
          request,
          dataSubject: subject,
          isOverdue,
          daysRemaining,
        });
      }
    }
  }

  // Sort by deadline (overdue first, then by remaining days)
  return results.sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    return a.daysRemaining - b.daysRemaining;
  });
}

/**
 * Update consent preferences (bulk)
 */
export function updatePreferences(
  dataSubjectId: string,
  preferences: Array<{ category: string; isEnabled: boolean }>,
  source: ConsentChannel
): boolean {
  const subject = dataSubjects.get(dataSubjectId);
  if (!subject) return false;

  const now = new Date();

  for (const pref of preferences) {
    const existing = subject.preferences.find((p) => p.category === pref.category);
    if (existing) {
      existing.isEnabled = pref.isEnabled;
      existing.lastUpdated = now;
      existing.source = source;
    } else {
      subject.preferences.push({
        category: pref.category,
        isEnabled: pref.isEnabled,
        lastUpdated: now,
        source,
      });
    }
  }

  subject.updatedAt = now;
  dataSubjects.set(dataSubjectId, subject);

  return true;
}

/**
 * Check expired consents and update status
 */
export function processExpiredConsents(): number {
  const now = new Date();
  let expiredCount = 0;

  for (const subject of dataSubjects.values()) {
    let updated = false;

    for (const consent of subject.consents) {
      if (
        consent.status === "aktif" &&
        consent.expiresAt &&
        new Date(consent.expiresAt) < now
      ) {
        consent.status = "suresi_doldu";
        expiredCount++;
        updated = true;

        addAuditLog(
          "expired",
          subject.id,
          "system",
          `${consentTypeInfo[consent.consentType].name} rızası süresi doldu`,
          consent.id
        );
      }
    }

    if (updated) {
      subject.updatedAt = now;
      dataSubjects.set(subject.id, subject);
    }
  }

  return expiredCount;
}

/**
 * Generate consent report
 */
export function generateConsentReport(
  startDate: Date,
  endDate: Date
): ConsentReport {
  const now = new Date();
  const allSubjects = Array.from(dataSubjects.values());

  // Summary counts
  const totalDataSubjects = allSubjects.length;
  let activeConsents = 0;
  let withdrawnConsents = 0;
  let pendingRequests = 0;
  let overdueRequests = 0;

  // By consent type
  const byConsentType: Map<ConsentType, { active: number; withdrawn: number; total: number }> = new Map();
  for (const type of Object.keys(consentTypeInfo) as ConsentType[]) {
    byConsentType.set(type, { active: 0, withdrawn: 0, total: 0 });
  }

  // By channel
  const byChannel: Map<ConsentChannel, { collected: number; withdrawn: number }> = new Map();

  // Trends (daily)
  const trendsMap: Map<string, { collected: number; withdrawn: number }> = new Map();

  for (const subject of allSubjects) {
    // Process consents
    for (const consent of subject.consents) {
      const consentDate = new Date(consent.collectedAt);

      if (consentDate >= startDate && consentDate <= endDate) {
        // Count by type
        const typeStats = byConsentType.get(consent.consentType)!;
        typeStats.total++;
        if (consent.status === "aktif") {
          typeStats.active++;
          activeConsents++;
        } else if (consent.status === "geri_cekildi") {
          typeStats.withdrawn++;
          withdrawnConsents++;
        }

        // Count by channel
        if (!byChannel.has(consent.channel)) {
          byChannel.set(consent.channel, { collected: 0, withdrawn: 0 });
        }
        const channelStats = byChannel.get(consent.channel)!;
        channelStats.collected++;
        if (consent.status === "geri_cekildi") {
          channelStats.withdrawn++;
        }

        // Trends
        const dateKey = consentDate.toISOString().split("T")[0];
        if (!trendsMap.has(dateKey)) {
          trendsMap.set(dateKey, { collected: 0, withdrawn: 0 });
        }
        trendsMap.get(dateKey)!.collected++;
      }

      // Count withdrawals in trend
      if (consent.withdrawnAt) {
        const withdrawDate = new Date(consent.withdrawnAt);
        if (withdrawDate >= startDate && withdrawDate <= endDate) {
          const dateKey = withdrawDate.toISOString().split("T")[0];
          if (!trendsMap.has(dateKey)) {
            trendsMap.set(dateKey, { collected: 0, withdrawn: 0 });
          }
          trendsMap.get(dateKey)!.withdrawn++;
        }
      }
    }

    // Process requests
    for (const request of subject.requests) {
      if (request.status === "beklemede" || request.status === "inceleniyor") {
        pendingRequests++;
        if (new Date(request.responseDeadline) < now) {
          overdueRequests++;
        }
      }
    }
  }

  // Calculate compliance score
  let complianceScore = 100;
  const issues: string[] = [];
  const recommendations: string[] = [];

  if (overdueRequests > 0) {
    complianceScore -= overdueRequests * 10;
    issues.push(`${overdueRequests} adet süresi geçmiş veri sahibi başvurusu var`);
    recommendations.push("Süresi geçmiş başvuruları acilen yanıtlayın");
  }

  const withdrawalRate = activeConsents > 0
    ? (withdrawnConsents / (activeConsents + withdrawnConsents)) * 100
    : 0;

  if (withdrawalRate > 20) {
    complianceScore -= 10;
    issues.push(`Yüksek rıza geri çekme oranı: %${withdrawalRate.toFixed(1)}`);
    recommendations.push("Rıza geri çekme nedenlerini analiz edin");
  }

  // Convert to arrays
  const byConsentTypeArray = Array.from(byConsentType.entries()).map(([type, stats]) => ({
    type,
    typeName: consentTypeInfo[type].name,
    active: stats.active,
    withdrawn: stats.withdrawn,
    conversionRate: stats.total > 0 ? (stats.active / stats.total) * 100 : 0,
  }));

  const byChannelArray = Array.from(byChannel.entries()).map(([channel, stats]) => ({
    channel,
    collected: stats.collected,
    withdrawn: stats.withdrawn,
  }));

  const trends = Array.from(trendsMap.entries())
    .map(([date, stats]) => ({
      date,
      collected: stats.collected,
      withdrawn: stats.withdrawn,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  complianceScore = Math.max(0, Math.min(100, complianceScore));

  return {
    generatedAt: now,
    period: { start: startDate, end: endDate },
    summary: {
      totalDataSubjects,
      activeConsents,
      withdrawnConsents,
      pendingRequests,
      overdueRequests,
    },
    byConsentType: byConsentTypeArray,
    byChannel: byChannelArray,
    trends,
    complianceScore,
    issues,
    recommendations,
  };
}

/**
 * Get audit logs
 */
export function getAuditLogs(
  filters?: {
    dataSubjectId?: string;
    consentId?: string;
    action?: ConsentAuditLog["action"];
    startDate?: Date;
    endDate?: Date;
  },
  limit: number = 100
): ConsentAuditLog[] {
  let logs = [...auditLogs];

  if (filters) {
    if (filters.dataSubjectId) {
      logs = logs.filter((l) => l.dataSubjectId === filters.dataSubjectId);
    }
    if (filters.consentId) {
      logs = logs.filter((l) => l.consentId === filters.consentId);
    }
    if (filters.action) {
      logs = logs.filter((l) => l.action === filters.action);
    }
    if (filters.startDate) {
      logs = logs.filter((l) => new Date(l.timestamp) >= filters.startDate!);
    }
    if (filters.endDate) {
      logs = logs.filter((l) => new Date(l.timestamp) <= filters.endDate!);
    }
  }

  // Sort by timestamp descending
  logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return logs.slice(0, limit);
}

/**
 * Export data subject data (for data portability requests)
 */
export function exportDataSubjectData(dataSubjectId: string): object | null {
  const subject = dataSubjects.get(dataSubjectId);
  if (!subject) return null;

  // Add export audit log
  addAuditLog(
    "exported",
    dataSubjectId,
    "system",
    "Veri sahibi verileri dışa aktarıldı"
  );

  return {
    exportDate: new Date().toISOString(),
    dataSubject: {
      id: subject.id,
      category: subject.category,
      email: subject.email,
      phone: subject.phone,
      createdAt: subject.createdAt,
    },
    consents: subject.consents.map((c) => ({
      type: c.consentType,
      typeName: consentTypeInfo[c.consentType].name,
      purpose: c.purpose,
      status: c.status,
      collectedAt: c.collectedAt,
      withdrawnAt: c.withdrawnAt,
      channel: c.channel,
    })),
    preferences: subject.preferences,
    requests: subject.requests.map((r) => ({
      type: r.type,
      status: r.status,
      submittedAt: r.submittedAt,
      respondedAt: r.respondedAt,
    })),
  };
}

/**
 * Delete data subject (for erasure requests)
 */
export function deleteDataSubject(dataSubjectId: string, deletedBy: string): boolean {
  const subject = dataSubjects.get(dataSubjectId);
  if (!subject) return false;

  // Log before deletion
  addAuditLog(
    "updated",
    dataSubjectId,
    deletedBy,
    "Veri sahibi kaydı silindi (silme hakkı talebi)"
  );

  dataSubjects.delete(dataSubjectId);
  return true;
}

/**
 * Get consent statistics summary
 */
export function getConsentStatistics(): {
  totalSubjects: number;
  totalConsents: number;
  activeConsents: number;
  withdrawnConsents: number;
  expiredConsents: number;
  pendingRequests: number;
  byType: Record<ConsentType, number>;
} {
  const subjects = Array.from(dataSubjects.values());

  let totalConsents = 0;
  let activeConsents = 0;
  let withdrawnConsents = 0;
  let expiredConsents = 0;
  let pendingRequests = 0;
  const byType: Record<ConsentType, number> = {} as Record<ConsentType, number>;

  for (const type of Object.keys(consentTypeInfo) as ConsentType[]) {
    byType[type] = 0;
  }

  for (const subject of subjects) {
    for (const consent of subject.consents) {
      totalConsents++;
      byType[consent.consentType]++;

      switch (consent.status) {
        case "aktif":
          activeConsents++;
          break;
        case "geri_cekildi":
          withdrawnConsents++;
          break;
        case "suresi_doldu":
          expiredConsents++;
          break;
      }
    }

    for (const request of subject.requests) {
      if (request.status === "beklemede" || request.status === "inceleniyor") {
        pendingRequests++;
      }
    }
  }

  return {
    totalSubjects: subjects.length,
    totalConsents,
    activeConsents,
    withdrawnConsents,
    expiredConsents,
    pendingRequests,
    byType,
  };
}

/**
 * Get channel display name
 */
export function getChannelName(channel: ConsentChannel): string {
  const names: Record<ConsentChannel, string> = {
    web: "Web Sitesi",
    mobil: "Mobil Uygulama",
    kagit: "Kağıt Form",
    email: "E-posta",
    sms: "SMS",
    telefon: "Telefon",
    yuz_yuze: "Yüz Yüze",
  };
  return names[channel];
}

/**
 * Get request type display name
 */
export function getRequestTypeName(type: DataSubjectRequest["type"]): string {
  const names: Record<DataSubjectRequest["type"], string> = {
    erisim: "Erişim Hakkı (m.11/b)",
    duzeltme: "Düzeltme Hakkı (m.11/d)",
    silme: "Silme Hakkı (m.11/e)",
    kisitlama: "İşlemeyi Kısıtlama",
    tasinabilirlik: "Veri Taşınabilirliği",
    itiraz: "İtiraz Hakkı (m.11/g)",
  };
  return names[type];
}
