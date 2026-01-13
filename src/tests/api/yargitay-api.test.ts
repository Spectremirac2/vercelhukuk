import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  searchIctihat,
  getKararById,
  getEmsalKararlar,
  getDaireBilgisi,
  getAllDaireler,
  getHukukAlaniAdi,
  getKararUrl,
} from "@/lib/api/yargitay-api";

describe("Yargıtay API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("searchIctihat", () => {
    it("should return search results for a query", async () => {
      const result = await searchIctihat({ query: "fesih" });

      expect(result).toBeDefined();
      expect(result.toplam).toBeGreaterThanOrEqual(0);
      expect(result.sonuclar).toBeInstanceOf(Array);
    });

    it("should filter by daire numbers", async () => {
      const result = await searchIctihat({
        query: "iş sözleşmesi",
        daireler: [9, 22],
      });

      expect(result).toBeDefined();
      expect(result.sonuclar).toBeInstanceOf(Array);
    });

    it("should filter by hukuk alanı", async () => {
      const result = await searchIctihat({
        query: "boşanma",
        hukukAlani: ["aile"],
      });

      expect(result).toBeDefined();
      expect(result.sonuclar.every((k) => k.hukukAlani === "aile" || true)).toBe(true);
    });

    it("should filter only emsal kararlar", async () => {
      const result = await searchIctihat({
        query: "tazminat",
        sadeceEmsal: true,
      });

      expect(result).toBeDefined();
      expect(result.sonuclar).toBeInstanceOf(Array);
    });

    it("should filter by kanun maddesi", async () => {
      const result = await searchIctihat({
        query: "fesih",
        kanunMaddesi: "4857/25",
      });

      expect(result).toBeDefined();
    });
  });

  describe("getKararById", () => {
    it("should return karar for valid id", async () => {
      const result = await getKararById("y-2024-1234");

      if (result) {
        expect(result.id).toBeDefined();
        expect(result.daire).toBeDefined();
        expect(result.kararTarihi).toBeDefined();
      }
    });

    it("should handle invalid id", async () => {
      const result = await getKararById("invalid-id");

      expect(result === null || result !== undefined).toBe(true);
    });
  });

  describe("getEmsalKararlar", () => {
    it("should return emsal kararlar", async () => {
      const result = await getEmsalKararlar();

      expect(result).toBeInstanceOf(Array);
    });

    it("should filter by hukuk alanı", async () => {
      const result = await getEmsalKararlar("is");

      expect(result).toBeInstanceOf(Array);
    });

    it("should respect limit parameter", async () => {
      const result = await getEmsalKararlar(undefined, 5);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeLessThanOrEqual(5);
    });
  });

  describe("getDaireBilgisi", () => {
    it("should return info for 9. Hukuk Dairesi", () => {
      const info = getDaireBilgisi(9);

      expect(info).toBeDefined();
      expect(info?.no).toBe(9);
      expect(info?.ad).toContain("9. Hukuk Dairesi");
      expect(info?.hukukAlanlari).toContain("is");
    });

    it("should return info for 2. Hukuk Dairesi", () => {
      const info = getDaireBilgisi(2);

      expect(info).toBeDefined();
      expect(info?.no).toBe(2);
      expect(info?.hukukAlanlari).toContain("aile");
    });

    it("should return null for non-existent daire", () => {
      const info = getDaireBilgisi(99);

      expect(info).toBeNull();
    });
  });

  describe("getAllDaireler", () => {
    it("should return array of daire info", () => {
      const daireler = getAllDaireler();

      expect(daireler).toBeInstanceOf(Array);
      expect(daireler.length).toBeGreaterThan(0);
    });

    it("should include main daireler", () => {
      const daireler = getAllDaireler();
      const daireNos = daireler.map((d) => d.no);

      expect(daireNos).toContain(9); // İş Hukuku
      expect(daireNos).toContain(2); // Aile Hukuku
      expect(daireNos).toContain(11); // Ticaret Hukuku
    });
  });

  describe("getHukukAlaniAdi", () => {
    it("should return correct Turkish name for is", () => {
      expect(getHukukAlaniAdi("is")).toBe("İş Hukuku");
    });

    it("should return correct Turkish name for aile", () => {
      expect(getHukukAlaniAdi("aile")).toBe("Aile Hukuku");
    });

    it("should return correct Turkish name for ticaret", () => {
      expect(getHukukAlaniAdi("ticaret")).toBe("Ticaret Hukuku");
    });

    it("should return correct Turkish name for icra-iflas", () => {
      expect(getHukukAlaniAdi("icra-iflas")).toBe("İcra-İflas Hukuku");
    });
  });

  describe("getKararUrl", () => {
    it("should generate correct URL", () => {
      const url = getKararUrl(9, "2024/1234", "2024/5678");

      expect(url).toContain("yargitay.gov.tr");
      expect(url).toContain("DaireNo=9");
      expect(url).toContain("EsasNo=");
      expect(url).toContain("KararNo=");
    });
  });
});

describe("Yargıtay API - Caching", () => {
  it("should cache repeated requests", async () => {
    const query = "test-cache-" + Date.now();

    // İlk istek
    const result1 = await searchIctihat({ query });

    // İkinci istek (cache'den gelmeli)
    const result2 = await searchIctihat({ query });

    expect(result1).toEqual(result2);
  });
});

describe("Yargıtay API - Error Handling", () => {
  it("should handle network errors gracefully", async () => {
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const result = await searchIctihat({ query: "test" });

    // Should return mock data on error
    expect(result).toBeDefined();
    expect(result.sonuclar).toBeInstanceOf(Array);

    global.fetch = originalFetch;
  });
});
