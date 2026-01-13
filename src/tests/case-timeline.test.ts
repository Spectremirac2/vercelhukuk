/**
 * Tests for Case Timeline Library
 * @vitest-environment node
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  createCase,
  getCase,
  updateCase,
  deleteCase,
  getAllCases,
  getCasesByStatus,
  addEvent,
  updateEvent,
  deleteEvent,
  getTimelineView,
  getCaseStatistics,
  getOverdueTasks,
  getUpcomingDeadlines,
  getEventTypes,
  getEventTypeInfo,
  getCaseStatusName,
  searchCases,
  generateCaseReport,
} from "@/lib/case-timeline";

describe("createCase", () => {
  it("should create a new case", () => {
    const newCase = createCase({
      title: "Test Davası",
      caseType: "alacak",
      status: "açık",
      parties: {
        plaintiff: "Davacı Test",
        defendant: "Davalı Test",
      },
      startDate: new Date(),
    });

    expect(newCase).not.toBeNull();
    expect(newCase.id).toBeDefined();
    expect(newCase.title).toBe("Test Davası");
    expect(newCase.events).toEqual([]);
    expect(newCase.createdAt).toBeDefined();
  });

  it("should generate unique IDs", () => {
    const case1 = createCase({
      title: "Dava 1",
      caseType: "alacak",
      status: "açık",
      parties: { plaintiff: "P1", defendant: "D1" },
      startDate: new Date(),
    });

    const case2 = createCase({
      title: "Dava 2",
      caseType: "alacak",
      status: "açık",
      parties: { plaintiff: "P2", defendant: "D2" },
      startDate: new Date(),
    });

    expect(case1.id).not.toBe(case2.id);
  });
});

describe("getCase", () => {
  it("should get case by ID", () => {
    const created = createCase({
      title: "Get Test",
      caseType: "tazminat",
      status: "açık",
      parties: { plaintiff: "P", defendant: "D" },
      startDate: new Date(),
    });

    const retrieved = getCase(created.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(created.id);
    expect(retrieved?.title).toBe("Get Test");
  });

  it("should return null for non-existent ID", () => {
    const result = getCase("nonexistent_id");
    expect(result).toBeNull();
  });
});

describe("updateCase", () => {
  it("should update case properties", () => {
    const created = createCase({
      title: "Update Test",
      caseType: "alacak",
      status: "açık",
      parties: { plaintiff: "P", defendant: "D" },
      startDate: new Date(),
    });

    const updated = updateCase(created.id, {
      status: "kapalı",
      title: "Updated Title",
    });

    expect(updated).not.toBeNull();
    expect(updated?.status).toBe("kapalı");
    expect(updated?.title).toBe("Updated Title");
    expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(
      created.updatedAt.getTime()
    );
  });

  it("should return null for non-existent case", () => {
    const result = updateCase("nonexistent", { status: "kapalı" });
    expect(result).toBeNull();
  });
});

describe("deleteCase", () => {
  it("should delete case", () => {
    const created = createCase({
      title: "Delete Test",
      caseType: "alacak",
      status: "açık",
      parties: { plaintiff: "P", defendant: "D" },
      startDate: new Date(),
    });

    const deleted = deleteCase(created.id);
    expect(deleted).toBe(true);

    const retrieved = getCase(created.id);
    expect(retrieved).toBeNull();
  });

  it("should return false for non-existent case", () => {
    const result = deleteCase("nonexistent");
    expect(result).toBe(false);
  });
});

describe("getAllCases", () => {
  it("should return all cases", () => {
    createCase({
      title: "List Test 1",
      caseType: "alacak",
      status: "açık",
      parties: { plaintiff: "P", defendant: "D" },
      startDate: new Date(),
    });

    const cases = getAllCases();
    expect(cases.length).toBeGreaterThan(0);
  });
});

describe("getCasesByStatus", () => {
  it("should filter cases by status", () => {
    createCase({
      title: "Open Case",
      caseType: "alacak",
      status: "açık",
      parties: { plaintiff: "P", defendant: "D" },
      startDate: new Date(),
    });

    const openCases = getCasesByStatus("açık");
    expect(openCases.length).toBeGreaterThan(0);
    openCases.forEach((c) => {
      expect(c.status).toBe("açık");
    });
  });
});

describe("addEvent", () => {
  it("should add event to case", () => {
    const testCase = createCase({
      title: "Event Test",
      caseType: "alacak",
      status: "açık",
      parties: { plaintiff: "P", defendant: "D" },
      startDate: new Date(),
    });

    const event = addEvent(testCase.id, {
      eventType: "durusma",
      title: "Test Duruşması",
      date: new Date(),
      completed: false,
    });

    expect(event).not.toBeNull();
    expect(event?.id).toBeDefined();
    expect(event?.title).toBe("Test Duruşması");

    const updated = getCase(testCase.id);
    expect(updated?.events.length).toBe(1);
  });

  it("should return null for non-existent case", () => {
    const result = addEvent("nonexistent", {
      eventType: "diger",
      title: "Test",
      date: new Date(),
      completed: false,
    });

    expect(result).toBeNull();
  });
});

describe("updateEvent", () => {
  it("should update event", () => {
    const testCase = createCase({
      title: "Update Event Test",
      caseType: "alacak",
      status: "açık",
      parties: { plaintiff: "P", defendant: "D" },
      startDate: new Date(),
    });

    const event = addEvent(testCase.id, {
      eventType: "durusma",
      title: "Original Title",
      date: new Date(),
      completed: false,
    });

    const updated = updateEvent(testCase.id, event!.id, {
      title: "Updated Title",
      completed: true,
    });

    expect(updated).not.toBeNull();
    expect(updated?.title).toBe("Updated Title");
    expect(updated?.completed).toBe(true);
  });
});

describe("deleteEvent", () => {
  it("should delete event", () => {
    const testCase = createCase({
      title: "Delete Event Test",
      caseType: "alacak",
      status: "açık",
      parties: { plaintiff: "P", defendant: "D" },
      startDate: new Date(),
    });

    const event = addEvent(testCase.id, {
      eventType: "durusma",
      title: "To Delete",
      date: new Date(),
      completed: false,
    });

    const deleted = deleteEvent(testCase.id, event!.id);
    expect(deleted).toBe(true);

    const updated = getCase(testCase.id);
    expect(updated?.events.length).toBe(0);
  });
});

describe("getTimelineView", () => {
  it("should return timeline view for case", () => {
    const testCase = createCase({
      title: "Timeline Test",
      caseType: "alacak",
      status: "açık",
      parties: { plaintiff: "P", defendant: "D" },
      startDate: new Date(),
    });

    addEvent(testCase.id, {
      eventType: "dava_acma",
      title: "Dava Açıldı",
      date: new Date(),
      completed: true,
    });

    const view = getTimelineView(testCase.id);

    expect(view).not.toBeNull();
    expect(view?.case).toBeDefined();
    expect(view?.events.length).toBeGreaterThan(0);
    expect(view?.progress).toBeGreaterThanOrEqual(0);
  });

  it("should return null for non-existent case", () => {
    const view = getTimelineView("nonexistent");
    expect(view).toBeNull();
  });
});

describe("getCaseStatistics", () => {
  it("should return case statistics", () => {
    const testCase = createCase({
      title: "Stats Test",
      caseType: "alacak",
      status: "açık",
      parties: { plaintiff: "P", defendant: "D" },
      startDate: new Date("2024-01-01"),
    });

    addEvent(testCase.id, {
      eventType: "dava_acma",
      title: "Dava Açıldı",
      date: new Date(),
      completed: true,
    });

    addEvent(testCase.id, {
      eventType: "durusma",
      title: "Duruşma",
      date: new Date(),
      completed: false,
    });

    const stats = getCaseStatistics(testCase.id);

    expect(stats).not.toBeNull();
    expect(stats?.totalEvents).toBe(2);
    expect(stats?.completedEvents).toBe(1);
    expect(stats?.durationDays).toBeGreaterThanOrEqual(0);
  });
});

describe("getEventTypes", () => {
  it("should return all event types", () => {
    const types = getEventTypes();
    expect(types.length).toBeGreaterThan(0);
  });

  it("should have id, name, and icon for each type", () => {
    const types = getEventTypes();
    types.forEach((t) => {
      expect(t.id).toBeDefined();
      expect(t.name).toBeDefined();
      expect(t.icon).toBeDefined();
    });
  });
});

describe("getEventTypeInfo", () => {
  it("should return info for event type", () => {
    const info = getEventTypeInfo("durusma");

    expect(info.name).toBe("Duruşma");
    expect(info.icon).toBeDefined();
    expect(info.color).toBeDefined();
  });

  it("should return default for unknown type", () => {
    const info = getEventTypeInfo("unknown" as any);

    expect(info).toBeDefined();
  });
});

describe("getCaseStatusName", () => {
  it("should return Turkish status names", () => {
    expect(getCaseStatusName("açık")).toBe("Açık");
    expect(getCaseStatusName("kapalı")).toBe("Kapalı");
    expect(getCaseStatusName("beklemede")).toBe("Beklemede");
    expect(getCaseStatusName("temyizde")).toContain("Temyiz");
  });
});

describe("searchCases", () => {
  it("should search cases by title", () => {
    createCase({
      title: "Benzersiz Arama Test Davası",
      caseType: "alacak",
      status: "açık",
      parties: { plaintiff: "P", defendant: "D" },
      startDate: new Date(),
    });

    const results = searchCases("Benzersiz Arama");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should search by plaintiff name", () => {
    createCase({
      title: "Search Test",
      caseType: "alacak",
      status: "açık",
      parties: { plaintiff: "Özel Davacı İsmi", defendant: "D" },
      startDate: new Date(),
    });

    const results = searchCases("Özel Davacı");
    expect(results.length).toBeGreaterThan(0);
  });
});

describe("generateCaseReport", () => {
  it("should generate case report", () => {
    const testCase = createCase({
      title: "Rapor Test Davası",
      caseNumber: "2024/9999",
      court: "Test Mahkemesi",
      caseType: "alacak",
      status: "açık",
      parties: { plaintiff: "Davacı", defendant: "Davalı" },
      startDate: new Date(),
    });

    addEvent(testCase.id, {
      eventType: "dava_acma",
      title: "Dava Açıldı",
      date: new Date(),
      completed: true,
    });

    const report = generateCaseReport(testCase.id);

    expect(report).not.toBeNull();
    expect(report).toContain("DAVA RAPORU");
    expect(report).toContain("2024/9999");
    expect(report).toContain("Test Mahkemesi");
    expect(report).toContain("Zaman Çizelgesi");
    expect(report).toContain("Dava Açıldı");
  });

  it("should return null for non-existent case", () => {
    const report = generateCaseReport("nonexistent");
    expect(report).toBeNull();
  });
});
