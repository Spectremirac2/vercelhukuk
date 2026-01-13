/**
 * Case Timeline Manager
 *
 * Manages and tracks legal case events, deadlines, and milestones.
 * Provides timeline visualization and automated deadline reminders.
 *
 * Features:
 * - Event tracking and categorization
 * - Automated deadline calculation
 * - Progress visualization
 * - Status management
 * - Document linking
 */

export type CaseStatus =
  | "açık" // Active case
  | "beklemede" // On hold / pending
  | "temyizde" // In appeal
  | "kapalı" // Closed
  | "arşivde"; // Archived

export type EventType =
  | "dava_acma" // Filing
  | "dilekce" // Petition/Motion
  | "durusma" // Hearing
  | "karar" // Decision
  | "tebligat" // Notification
  | "itiraz" // Objection
  | "temyiz" // Appeal
  | "kesinlesme" // Finalization
  | "icra" // Enforcement
  | "arabuluculuk" // Mediation
  | "bilirkisi" // Expert report
  | "kesif" // Site inspection
  | "belge" // Document
  | "odeme" // Payment
  | "diger"; // Other

export interface CaseEvent {
  id: string;
  caseId: string;
  eventType: EventType;
  title: string;
  description?: string;
  date: Date;
  deadline?: Date;
  completed: boolean;
  documents?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LegalCase {
  id: string;
  caseNumber?: string;
  court?: string;
  caseType: string;
  title: string;
  description?: string;
  status: CaseStatus;
  parties: {
    plaintiff: string;
    defendant: string;
  };
  claimAmount?: number;
  startDate: Date;
  events: CaseEvent[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineView {
  case: LegalCase;
  events: CaseEvent[];
  upcomingDeadlines: CaseEvent[];
  progress: number; // 0-100
  nextAction?: string;
  estimatedCompletion?: Date;
}

export interface CaseStatistics {
  totalEvents: number;
  completedEvents: number;
  pendingDeadlines: number;
  overdueTasks: number;
  durationDays: number;
  lastActivityDate: Date;
}

// Event type metadata
const EVENT_TYPE_INFO: Record<EventType, { name: string; icon: string; color: string }> = {
  dava_acma: { name: "Dava Açma", icon: "📋", color: "#3b82f6" },
  dilekce: { name: "Dilekçe", icon: "📝", color: "#6366f1" },
  durusma: { name: "Duruşma", icon: "⚖️", color: "#8b5cf6" },
  karar: { name: "Karar", icon: "📜", color: "#a855f7" },
  tebligat: { name: "Tebligat", icon: "📬", color: "#ec4899" },
  itiraz: { name: "İtiraz", icon: "✋", color: "#f43f5e" },
  temyiz: { name: "Temyiz/İstinaf", icon: "🔄", color: "#ef4444" },
  kesinlesme: { name: "Kesinleşme", icon: "✅", color: "#22c55e" },
  icra: { name: "İcra", icon: "💰", color: "#eab308" },
  arabuluculuk: { name: "Arabuluculuk", icon: "🤝", color: "#14b8a6" },
  bilirkisi: { name: "Bilirkişi", icon: "🔍", color: "#06b6d4" },
  kesif: { name: "Keşif", icon: "📍", color: "#0ea5e9" },
  belge: { name: "Belge", icon: "📎", color: "#64748b" },
  odeme: { name: "Ödeme", icon: "💳", color: "#84cc16" },
  diger: { name: "Diğer", icon: "📌", color: "#94a3b8" },
};

// In-memory storage (would be database in production)
const cases: Map<string, LegalCase> = new Map();

/**
 * Create a new case
 */
export function createCase(caseData: Omit<LegalCase, "id" | "events" | "createdAt" | "updatedAt">): LegalCase {
  const now = new Date();
  const id = `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const newCase: LegalCase = {
    ...caseData,
    id,
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
export function getCase(caseId: string): LegalCase | null {
  return cases.get(caseId) || null;
}

/**
 * Update case
 */
export function updateCase(
  caseId: string,
  updates: Partial<Omit<LegalCase, "id" | "createdAt">>
): LegalCase | null {
  const existingCase = cases.get(caseId);
  if (!existingCase) return null;

  const updatedCase: LegalCase = {
    ...existingCase,
    ...updates,
    updatedAt: new Date(),
  };

  cases.set(caseId, updatedCase);
  return updatedCase;
}

/**
 * Delete case
 */
export function deleteCase(caseId: string): boolean {
  return cases.delete(caseId);
}

/**
 * Get all cases
 */
export function getAllCases(): LegalCase[] {
  return Array.from(cases.values());
}

/**
 * Get cases by status
 */
export function getCasesByStatus(status: CaseStatus): LegalCase[] {
  return Array.from(cases.values()).filter(c => c.status === status);
}

/**
 * Add event to case
 */
export function addEvent(
  caseId: string,
  eventData: Omit<CaseEvent, "id" | "caseId" | "createdAt" | "updatedAt">
): CaseEvent | null {
  const existingCase = cases.get(caseId);
  if (!existingCase) return null;

  const now = new Date();
  const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const newEvent: CaseEvent = {
    ...eventData,
    id: eventId,
    caseId,
    createdAt: now,
    updatedAt: now,
  };

  existingCase.events.push(newEvent);
  existingCase.updatedAt = now;
  cases.set(caseId, existingCase);

  return newEvent;
}

/**
 * Update event
 */
export function updateEvent(
  caseId: string,
  eventId: string,
  updates: Partial<Omit<CaseEvent, "id" | "caseId" | "createdAt">>
): CaseEvent | null {
  const existingCase = cases.get(caseId);
  if (!existingCase) return null;

  const eventIndex = existingCase.events.findIndex(e => e.id === eventId);
  if (eventIndex === -1) return null;

  const updatedEvent: CaseEvent = {
    ...existingCase.events[eventIndex],
    ...updates,
    updatedAt: new Date(),
  };

  existingCase.events[eventIndex] = updatedEvent;
  existingCase.updatedAt = new Date();
  cases.set(caseId, existingCase);

  return updatedEvent;
}

/**
 * Delete event
 */
export function deleteEvent(caseId: string, eventId: string): boolean {
  const existingCase = cases.get(caseId);
  if (!existingCase) return false;

  const initialLength = existingCase.events.length;
  existingCase.events = existingCase.events.filter(e => e.id !== eventId);

  if (existingCase.events.length < initialLength) {
    existingCase.updatedAt = new Date();
    cases.set(caseId, existingCase);
    return true;
  }

  return false;
}

/**
 * Get timeline view for a case
 */
export function getTimelineView(caseId: string): TimelineView | null {
  const legalCase = cases.get(caseId);
  if (!legalCase) return null;

  const now = new Date();
  const sortedEvents = [...legalCase.events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get upcoming deadlines
  const upcomingDeadlines = sortedEvents
    .filter(e => e.deadline && new Date(e.deadline) > now && !e.completed)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

  // Calculate progress
  const totalMilestones = sortedEvents.filter(e =>
    ["dava_acma", "durusma", "karar", "kesinlesme"].includes(e.eventType)
  ).length;
  const completedMilestones = sortedEvents.filter(e =>
    ["dava_acma", "durusma", "karar", "kesinlesme"].includes(e.eventType) && e.completed
  ).length;
  const progress = totalMilestones > 0
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : 0;

  // Determine next action
  let nextAction: string | undefined;
  if (upcomingDeadlines.length > 0) {
    nextAction = upcomingDeadlines[0].title;
  } else {
    const pendingEvents = sortedEvents.filter(e => !e.completed);
    if (pendingEvents.length > 0) {
      nextAction = pendingEvents[0].title;
    }
  }

  return {
    case: legalCase,
    events: sortedEvents,
    upcomingDeadlines,
    progress,
    nextAction,
    estimatedCompletion: estimateCompletion(legalCase),
  };
}

/**
 * Estimate case completion date
 */
function estimateCompletion(legalCase: LegalCase): Date | undefined {
  if (legalCase.status === "kapalı" || legalCase.status === "arşivde") {
    return undefined;
  }

  // Average case durations by type (in months)
  const averageDurations: Record<string, number> = {
    "işe iade": 12,
    "alacak": 18,
    "boşanma": 8,
    "tazminat": 24,
    "icra": 6,
    "default": 12,
  };

  const duration = averageDurations[legalCase.caseType.toLowerCase()] ||
    averageDurations["default"];

  const estimated = new Date(legalCase.startDate);
  estimated.setMonth(estimated.getMonth() + duration);

  return estimated;
}

/**
 * Get case statistics
 */
export function getCaseStatistics(caseId: string): CaseStatistics | null {
  const legalCase = cases.get(caseId);
  if (!legalCase) return null;

  const now = new Date();
  const events = legalCase.events;

  const completedEvents = events.filter(e => e.completed).length;
  const pendingDeadlines = events.filter(e =>
    e.deadline && new Date(e.deadline) > now && !e.completed
  ).length;
  const overdueTasks = events.filter(e =>
    e.deadline && new Date(e.deadline) < now && !e.completed
  ).length;

  const startDate = new Date(legalCase.startDate);
  const durationDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  const lastActivityDate = sortedEvents.length > 0
    ? new Date(sortedEvents[0].updatedAt)
    : legalCase.updatedAt;

  return {
    totalEvents: events.length,
    completedEvents,
    pendingDeadlines,
    overdueTasks,
    durationDays,
    lastActivityDate,
  };
}

/**
 * Get overdue tasks across all cases
 */
export function getOverdueTasks(): Array<{ case: LegalCase; event: CaseEvent }> {
  const now = new Date();
  const overdue: Array<{ case: LegalCase; event: CaseEvent }> = [];

  for (const legalCase of cases.values()) {
    if (legalCase.status === "kapalı" || legalCase.status === "arşivde") continue;

    for (const event of legalCase.events) {
      if (event.deadline && new Date(event.deadline) < now && !event.completed) {
        overdue.push({ case: legalCase, event });
      }
    }
  }

  return overdue.sort(
    (a, b) => new Date(a.event.deadline!).getTime() - new Date(b.event.deadline!).getTime()
  );
}

/**
 * Get upcoming deadlines across all cases
 */
export function getUpcomingDeadlines(daysAhead: number = 7): Array<{
  case: LegalCase;
  event: CaseEvent;
  daysRemaining: number;
}> {
  const now = new Date();
  const futureDate = new Date(now);
  futureDate.setDate(futureDate.getDate() + daysAhead);

  const upcoming: Array<{ case: LegalCase; event: CaseEvent; daysRemaining: number }> = [];

  for (const legalCase of cases.values()) {
    if (legalCase.status === "kapalı" || legalCase.status === "arşivde") continue;

    for (const event of legalCase.events) {
      if (event.deadline && !event.completed) {
        const deadlineDate = new Date(event.deadline);
        if (deadlineDate >= now && deadlineDate <= futureDate) {
          const daysRemaining = Math.ceil(
            (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );
          upcoming.push({ case: legalCase, event, daysRemaining });
        }
      }
    }
  }

  return upcoming.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

/**
 * Get event type info
 */
export function getEventTypeInfo(eventType: EventType): { name: string; icon: string; color: string } {
  return EVENT_TYPE_INFO[eventType] || EVENT_TYPE_INFO.diger;
}

/**
 * Get all event types
 */
export function getEventTypes(): Array<{ id: EventType; name: string; icon: string }> {
  return Object.entries(EVENT_TYPE_INFO).map(([id, info]) => ({
    id: id as EventType,
    name: info.name,
    icon: info.icon,
  }));
}

/**
 * Search cases
 */
export function searchCases(query: string): LegalCase[] {
  const lowerQuery = query.toLowerCase();
  return Array.from(cases.values()).filter(c =>
    c.title.toLowerCase().includes(lowerQuery) ||
    c.caseNumber?.toLowerCase().includes(lowerQuery) ||
    c.parties.plaintiff.toLowerCase().includes(lowerQuery) ||
    c.parties.defendant.toLowerCase().includes(lowerQuery) ||
    c.description?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Generate case report
 */
export function generateCaseReport(caseId: string): string | null {
  const legalCase = cases.get(caseId);
  if (!legalCase) return null;

  const stats = getCaseStatistics(caseId);
  const timeline = getTimelineView(caseId);

  let report = `
DAVA RAPORU
===========

Dava Bilgileri
--------------
Dava No      : ${legalCase.caseNumber || "Belirtilmemiş"}
Mahkeme      : ${legalCase.court || "Belirtilmemiş"}
Dava Türü    : ${legalCase.caseType}
Durum        : ${getCaseStatusName(legalCase.status)}
Başlangıç    : ${formatDate(legalCase.startDate)}

Taraflar
--------
Davacı       : ${legalCase.parties.plaintiff}
Davalı       : ${legalCase.parties.defendant}
${legalCase.claimAmount ? `Dava Değeri  : ${formatCurrency(legalCase.claimAmount)}` : ""}

İstatistikler
-------------
Toplam Etkinlik : ${stats?.totalEvents || 0}
Tamamlanan      : ${stats?.completedEvents || 0}
Bekleyen        : ${stats?.pendingDeadlines || 0}
Gecikmiş        : ${stats?.overdueTasks || 0}
Süre (gün)      : ${stats?.durationDays || 0}
İlerleme        : %${timeline?.progress || 0}

Zaman Çizelgesi
---------------
`;

  if (timeline?.events) {
    for (const event of timeline.events) {
      const status = event.completed ? "✓" : "○";
      report += `${status} ${formatDate(event.date)} - ${event.title}\n`;
    }
  }

  if (timeline?.upcomingDeadlines && timeline.upcomingDeadlines.length > 0) {
    report += `\nYaklaşan Süreler\n----------------\n`;
    for (const deadline of timeline.upcomingDeadlines) {
      report += `⚠ ${formatDate(deadline.deadline!)} - ${deadline.title}\n`;
    }
  }

  return report.trim();
}

/**
 * Get case status name in Turkish
 */
export function getCaseStatusName(status: CaseStatus): string {
  const names: Record<CaseStatus, string> = {
    açık: "Açık",
    beklemede: "Beklemede",
    temyizde: "Temyiz/İstinaf Aşamasında",
    kapalı: "Kapalı",
    arşivde: "Arşivde",
  };
  return names[status];
}

/**
 * Format date in Turkish
 */
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Format currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(amount);
}

/**
 * Create sample case for demonstration
 */
export function createSampleCase(): LegalCase {
  const sampleCase = createCase({
    caseNumber: "2024/1234 E.",
    court: "İstanbul 5. İş Mahkemesi",
    caseType: "İşe İade",
    title: "Ali Yılmaz - ABC Şirketi İşe İade Davası",
    description: "Haksız fesih nedeniyle açılan işe iade davası",
    status: "açık",
    parties: {
      plaintiff: "Ali Yılmaz",
      defendant: "ABC Teknoloji A.Ş.",
    },
    claimAmount: 150000,
    startDate: new Date("2024-01-15"),
  });

  // Add sample events
  const sampleEvents = [
    { eventType: "arabuluculuk" as EventType, title: "Arabuluculuk başvurusu", date: new Date("2024-01-05"), completed: true },
    { eventType: "arabuluculuk" as EventType, title: "Arabuluculuk görüşmesi - Anlaşma sağlanamadı", date: new Date("2024-01-12"), completed: true },
    { eventType: "dava_acma" as EventType, title: "Dava dilekçesi verildi", date: new Date("2024-01-15"), completed: true },
    { eventType: "tebligat" as EventType, title: "Davalıya tebligat yapıldı", date: new Date("2024-01-25"), completed: true },
    { eventType: "dilekce" as EventType, title: "Cevap dilekçesi sunuldu", date: new Date("2024-02-08"), completed: true },
    { eventType: "durusma" as EventType, title: "1. Duruşma - Ön inceleme", date: new Date("2024-03-15"), completed: true },
    { eventType: "bilirkisi" as EventType, title: "Bilirkişi raporu bekleniyor", date: new Date("2024-04-20"), deadline: new Date("2024-05-20"), completed: false },
    { eventType: "durusma" as EventType, title: "2. Duruşma", date: new Date("2024-05-25"), deadline: new Date("2024-05-25"), completed: false },
  ];

  for (const event of sampleEvents) {
    addEvent(sampleCase.id, event);
  }

  return getCase(sampleCase.id)!;
}
