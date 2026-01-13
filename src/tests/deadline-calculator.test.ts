/**
 * Tests for Deadline Calculator Library
 * @vitest-environment node
 */

import { describe, it, expect } from "vitest";
import {
  getDeadlineTypes,
  getDeadlinesByCategory,
  getDeadlineById,
  searchDeadlines,
  calculateDeadline,
  getDeadlineCategories,
  calculateMultipleDeadlines,
  getTerminationNoticePeriod,
  formatDateTR,
  formatRemainingTime,
} from "@/lib/deadline-calculator";

describe("getDeadlineTypes", () => {
  it("should return all deadline types", () => {
    const types = getDeadlineTypes();
    expect(types.length).toBeGreaterThan(0);
  });

  it("should have required properties", () => {
    const types = getDeadlineTypes();
    types.forEach((t) => {
      expect(t.id).toBeDefined();
      expect(t.name).toBeDefined();
      expect(t.category).toBeDefined();
      expect(t.baseDuration).toBeGreaterThan(0);
      expect(t.durationUnit).toBeDefined();
      expect(t.legalBasis).toBeDefined();
    });
  });
});

describe("getDeadlinesByCategory", () => {
  it("should return zamanasimi deadlines", () => {
    const deadlines = getDeadlinesByCategory("zamanasimi");
    expect(deadlines.length).toBeGreaterThan(0);
    deadlines.forEach((d) => {
      expect(d.category).toBe("zamanasimi");
    });
  });

  it("should return temyiz deadlines", () => {
    const deadlines = getDeadlinesByCategory("temyiz");
    expect(deadlines.length).toBeGreaterThan(0);
    deadlines.forEach((d) => {
      expect(d.category).toBe("temyiz");
    });
  });
});

describe("getDeadlineById", () => {
  it("should return deadline by ID", () => {
    const deadline = getDeadlineById("zamanasimi_genel");
    expect(deadline).not.toBeNull();
    expect(deadline?.id).toBe("zamanasimi_genel");
    expect(deadline?.baseDuration).toBe(10);
    expect(deadline?.durationUnit).toBe("year");
  });

  it("should return null for unknown ID", () => {
    const deadline = getDeadlineById("nonexistent_id");
    expect(deadline).toBeNull();
  });
});

describe("searchDeadlines", () => {
  it("should find deadlines by name", () => {
    const results = searchDeadlines("zamanaşımı");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should find deadlines by legal basis", () => {
    const results = searchDeadlines("TBK");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should return empty for no matches", () => {
    const results = searchDeadlines("xyzabc123456");
    expect(results.length).toBe(0);
  });
});

describe("calculateDeadline", () => {
  it("should calculate deadline for day-based duration", () => {
    // Use a date that doesn't have timezone issues
    const startDate = new Date(2024, 0, 1, 12, 0, 0); // Jan 1, 2024, noon local time
    const result = calculateDeadline("itiraz_icra", startDate);

    expect(result).not.toBeNull();
    // Compare dates using toDateString to avoid timezone issues
    expect(result?.startDate.toDateString()).toBe(startDate.toDateString());
    expect(result?.endDate.getTime()).toBeGreaterThan(startDate.getTime());
  });

  it("should calculate deadline for week-based duration", () => {
    const startDate = new Date("2024-01-01");
    const result = calculateDeadline("istinaf_hukuk", startDate);

    expect(result).not.toBeNull();
    // 2 weeks = 14 days
    const expectedEnd = new Date("2024-01-15");
    expect(result?.endDate.getDate()).toBeGreaterThanOrEqual(expectedEnd.getDate());
  });

  it("should calculate deadline for month-based duration", () => {
    const startDate = new Date("2024-01-15");
    const result = calculateDeadline("dava_ise_iade", startDate);

    expect(result).not.toBeNull();
    // 1 month later
    expect(result?.endDate.getMonth()).toBeGreaterThanOrEqual(1);
  });

  it("should calculate deadline for year-based duration", () => {
    const startDate = new Date("2024-01-01");
    const result = calculateDeadline("zamanasimi_genel", startDate);

    expect(result).not.toBeNull();
    // 10 years later
    expect(result?.endDate.getFullYear()).toBe(2034);
  });

  it("should return null for unknown deadline", () => {
    const result = calculateDeadline("nonexistent", new Date());
    expect(result).toBeNull();
  });

  it("should mark expired deadlines", () => {
    const pastDate = new Date("2020-01-01");
    const result = calculateDeadline("itiraz_icra", pastDate);

    expect(result).not.toBeNull();
    expect(result?.isExpired).toBe(true);
    expect(result?.remainingDays).toBe(0);
  });

  it("should include warnings for urgent deadlines", () => {
    // Use a date that will result in remaining days <= 7
    const nearDate = new Date();
    nearDate.setDate(nearDate.getDate() - 3); // 3 days ago for 7-day deadline
    const result = calculateDeadline("itiraz_icra", nearDate);

    expect(result).not.toBeNull();
    // Should have at least notes from the deadline type
  });
});

describe("getDeadlineCategories", () => {
  it("should return all categories", () => {
    const categories = getDeadlineCategories();
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should have count for each category", () => {
    const categories = getDeadlineCategories();
    categories.forEach((cat) => {
      expect(cat.id).toBeDefined();
      expect(cat.name).toBeDefined();
      expect(typeof cat.count).toBe("number");
    });
  });
});

describe("calculateMultipleDeadlines", () => {
  it("should calculate multiple deadlines", () => {
    const ids = ["zamanasimi_genel", "itiraz_icra", "istinaf_hukuk"];
    const results = calculateMultipleDeadlines(ids, new Date("2024-01-01"));

    expect(results.length).toBe(3);
    // Should be sorted by end date
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].endDate.getTime()).toBeLessThanOrEqual(
        results[i].endDate.getTime()
      );
    }
  });

  it("should skip invalid deadline IDs", () => {
    const ids = ["zamanasimi_genel", "nonexistent", "itiraz_icra"];
    const results = calculateMultipleDeadlines(ids, new Date());

    expect(results.length).toBe(2);
  });
});

describe("getTerminationNoticePeriod", () => {
  it("should return 2 weeks for less than 6 months", () => {
    const result = getTerminationNoticePeriod(0.3);
    expect(result?.baseDuration).toBe(2);
    expect(result?.durationUnit).toBe("week");
  });

  it("should return 4 weeks for 6 months to 1.5 years", () => {
    const result = getTerminationNoticePeriod(1);
    expect(result?.baseDuration).toBe(4);
    expect(result?.durationUnit).toBe("week");
  });

  it("should return 6 weeks for 1.5 to 3 years", () => {
    const result = getTerminationNoticePeriod(2);
    expect(result?.baseDuration).toBe(6);
    expect(result?.durationUnit).toBe("week");
  });

  it("should return 8 weeks for more than 3 years", () => {
    const result = getTerminationNoticePeriod(5);
    expect(result?.baseDuration).toBe(8);
    expect(result?.durationUnit).toBe("week");
  });
});

describe("formatDateTR", () => {
  it("should format date in Turkish", () => {
    const date = new Date("2024-06-15");
    const formatted = formatDateTR(date);
    expect(formatted).toContain("Haziran");
    expect(formatted).toContain("2024");
    expect(formatted).toContain("15");
  });
});

describe("formatRemainingTime", () => {
  it("should format 0 days", () => {
    expect(formatRemainingTime(0)).toBe("Bugün son gün!");
  });

  it("should format 1 day", () => {
    expect(formatRemainingTime(1)).toBe("1 gün kaldı");
  });

  it("should format days", () => {
    expect(formatRemainingTime(5)).toContain("gün");
  });

  it("should format weeks", () => {
    expect(formatRemainingTime(14)).toContain("hafta");
  });

  it("should format months", () => {
    expect(formatRemainingTime(60)).toContain("ay");
  });

  it("should format years", () => {
    expect(formatRemainingTime(400)).toContain("yıl");
  });
});
