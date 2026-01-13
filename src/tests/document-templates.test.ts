/**
 * Tests for Document Templates Library
 * @vitest-environment node
 */

import { describe, it, expect } from "vitest";
import {
  getTemplates,
  getTemplatesByCategory,
  getTemplateById,
  searchTemplates,
  generateDocument,
  validateField,
  getCategories,
  exportDocument,
} from "@/lib/document-templates";

describe("getTemplates", () => {
  it("should return all templates", () => {
    const templates = getTemplates();
    expect(templates.length).toBeGreaterThan(0);
  });

  it("should have required properties for each template", () => {
    const templates = getTemplates();
    templates.forEach((t) => {
      expect(t.id).toBeDefined();
      expect(t.name).toBeDefined();
      expect(t.category).toBeDefined();
      expect(t.requiredFields).toBeDefined();
      expect(t.template).toBeDefined();
    });
  });
});

describe("getTemplatesByCategory", () => {
  it("should return dilekce templates", () => {
    const templates = getTemplatesByCategory("dilekce");
    expect(templates.length).toBeGreaterThan(0);
    templates.forEach((t) => {
      expect(t.category).toBe("dilekce");
    });
  });

  it("should return sozlesme templates", () => {
    const templates = getTemplatesByCategory("sozlesme");
    expect(templates.length).toBeGreaterThan(0);
    templates.forEach((t) => {
      expect(t.category).toBe("sozlesme");
    });
  });

  it("should return empty for non-existent category", () => {
    const templates = getTemplatesByCategory("nonexistent" as any);
    expect(templates.length).toBe(0);
  });
});

describe("getTemplateById", () => {
  it("should return template by ID", () => {
    const template = getTemplateById("dilekce_ise_iade");
    expect(template).not.toBeNull();
    expect(template?.id).toBe("dilekce_ise_iade");
    expect(template?.name).toContain("İşe İade");
  });

  it("should return null for unknown ID", () => {
    const template = getTemplateById("nonexistent_id");
    expect(template).toBeNull();
  });
});

describe("searchTemplates", () => {
  it("should find templates by name", () => {
    const results = searchTemplates("işe iade");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should find templates by description", () => {
    const results = searchTemplates("boşanma");
    expect(results.length).toBeGreaterThan(0);
  });

  it("should return empty for no matches", () => {
    const results = searchTemplates("xyzabc123456");
    expect(results.length).toBe(0);
  });
});

describe("generateDocument", () => {
  it("should generate document from template", () => {
    const doc = generateDocument("dilekce_ise_iade", {
      mahkeme: "İstanbul 1. İş Mahkemesi",
      davaci_ad: "Ali Yılmaz",
      davaci_tc: "12345678901",
      davaci_adres: "İstanbul",
      davali_unvan: "ABC A.Ş.",
      davali_adres: "Ankara",
      ise_baslama_tarihi: "01.01.2020",
      fesih_tarihi: "01.01.2024",
      fesih_nedeni: "Performans düşüklüğü",
      son_maas: "50000",
    });

    expect(doc).not.toBeNull();
    expect(doc?.title).toContain("İşe İade");
    expect(doc?.content).toContain("Ali Yılmaz");
    expect(doc?.content).toContain("ABC A.Ş.");
    expect(doc?.category).toBe("dilekce");
  });

  it("should return null for unknown template", () => {
    const doc = generateDocument("nonexistent", {});
    expect(doc).toBeNull();
  });

  it("should include warnings for missing fields", () => {
    const doc = generateDocument("dilekce_ise_iade", {
      mahkeme: "Test Mahkeme",
    });

    expect(doc).not.toBeNull();
    expect(doc?.warnings.length).toBeGreaterThan(0);
  });

  it("should add current date if not provided", () => {
    const doc = generateDocument("dilekce_ise_iade", {});
    expect(doc?.fields.tarih).toBeDefined();
  });
});

describe("validateField", () => {
  it("should validate required field", () => {
    const result = validateField(
      { key: "test", label: "Test", type: "text", validation: { required: true } },
      ""
    );
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should validate TC Kimlik format", () => {
    const result = validateField(
      { key: "tc", label: "TC", type: "text" },
      "123"
    );
    expect(result.valid).toBe(false);

    const validResult = validateField(
      { key: "tc", label: "TC", type: "text" },
      "12345678901"
    );
    expect(validResult.valid).toBe(true);
  });

  it("should validate minLength", () => {
    const result = validateField(
      { key: "test", label: "Test", type: "text", validation: { minLength: 5 } },
      "ab"
    );
    expect(result.valid).toBe(false);
  });

  it("should pass valid field", () => {
    const result = validateField(
      { key: "test", label: "Test", type: "text" },
      "Valid value"
    );
    expect(result.valid).toBe(true);
  });
});

describe("getCategories", () => {
  it("should return all categories", () => {
    const categories = getCategories();
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should have count for each category", () => {
    const categories = getCategories();
    categories.forEach((cat) => {
      expect(cat.id).toBeDefined();
      expect(cat.name).toBeDefined();
      expect(typeof cat.count).toBe("number");
    });
  });
});

describe("exportDocument", () => {
  it("should export as text", () => {
    const doc = generateDocument("dilekce_ise_iade", {
      mahkeme: "Test Mahkeme",
    });

    if (doc) {
      const text = exportDocument(doc, "text");
      expect(text).toBe(doc.content);
    }
  });

  it("should export as HTML", () => {
    const doc = generateDocument("dilekce_ise_iade", {
      mahkeme: "Test Mahkeme",
    });

    if (doc) {
      const html = exportDocument(doc, "html");
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("<title>");
      expect(html).toContain("</html>");
    }
  });
});
