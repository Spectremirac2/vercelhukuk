import { describe, it, expect } from "vitest";
import { isAllowedDomain, DEFAULT_ALLOWED_DOMAINS } from "../utils/domains";

describe("isAllowedDomain", () => {
  const testDomains = ["mevzuat.gov.tr", "resmigazete.gov.tr"];

  it("should return true for exact domain match", () => {
    expect(isAllowedDomain("https://mevzuat.gov.tr/kanun/1", testDomains)).toBe(true);
    expect(isAllowedDomain("https://resmigazete.gov.tr", testDomains)).toBe(true);
  });

  it("should return true for subdomain match", () => {
    expect(isAllowedDomain("https://www.mevzuat.gov.tr/kanun/1", testDomains)).toBe(true);
    expect(isAllowedDomain("https://corpus.mevzuat.gov.tr", testDomains)).toBe(true);
    expect(isAllowedDomain("https://deep.sub.mevzuat.gov.tr", testDomains)).toBe(true);
  });

  it("should return false for non-matching domains", () => {
    expect(isAllowedDomain("https://example.com", testDomains)).toBe(false);
    expect(isAllowedDomain("https://google.com", testDomains)).toBe(false);
    expect(isAllowedDomain("https://blog.mevzuat.com", testDomains)).toBe(false); // .com not .gov.tr
  });

  it("should return false for similar but not matching domains", () => {
    // "evil-mevzuat.gov.tr" should NOT match - it's a different domain
    expect(isAllowedDomain("https://evil-mevzuat.gov.tr", testDomains)).toBe(false);
    // "mevzuatfake.gov.tr" should NOT match
    expect(isAllowedDomain("https://mevzuatfake.gov.tr", testDomains)).toBe(false);
  });

  it("should return false for invalid URLs", () => {
    expect(isAllowedDomain("not-a-valid-url", testDomains)).toBe(false);
    expect(isAllowedDomain("", testDomains)).toBe(false);
  });

  it("should use DEFAULT_ALLOWED_DOMAINS when no domains provided", () => {
    // Test with default domains
    expect(isAllowedDomain("https://mevzuat.gov.tr")).toBe(true);
    expect(isAllowedDomain("https://yargitay.gov.tr")).toBe(true);
    expect(isAllowedDomain("https://danistay.gov.tr")).toBe(true);
    expect(isAllowedDomain("https://anayasa.gov.tr")).toBe(true);
    expect(isAllowedDomain("https://barobirlik.org.tr")).toBe(true);
  });

  it("should contain expected official Turkish legal domains in defaults", () => {
    expect(DEFAULT_ALLOWED_DOMAINS).toContain("mevzuat.gov.tr");
    expect(DEFAULT_ALLOWED_DOMAINS).toContain("resmigazete.gov.tr");
    expect(DEFAULT_ALLOWED_DOMAINS).toContain("anayasa.gov.tr");
    expect(DEFAULT_ALLOWED_DOMAINS).toContain("yargitay.gov.tr");
    expect(DEFAULT_ALLOWED_DOMAINS).toContain("danistay.gov.tr");
    expect(DEFAULT_ALLOWED_DOMAINS).toContain("barobirlik.org.tr");
  });
});

describe("Strict Mode Logic", () => {
  it("should correctly filter trusted sources from a list", () => {
    const sources = [
      { uri: "https://mevzuat.gov.tr/kanun/1", title: "Kanun" },
      { uri: "https://example.com/article", title: "Blog" },
      { uri: "https://www.yargitay.gov.tr/karar", title: "Karar" },
    ];

    const trustedSources = sources.filter((s) =>
      isAllowedDomain(s.uri, DEFAULT_ALLOWED_DOMAINS)
    );

    expect(trustedSources).toHaveLength(2);
    expect(trustedSources[0].uri).toContain("mevzuat.gov.tr");
    expect(trustedSources[1].uri).toContain("yargitay.gov.tr");
  });

  it("should validate strict mode requirements", () => {
    // Strict mode: ≥2 sources AND ≥1 trusted domain
    const checkStrictMode = (sources: { uri: string; title: string }[]) => {
      const trustedSources = sources.filter((s) =>
        isAllowedDomain(s.uri, DEFAULT_ALLOWED_DOMAINS)
      );
      return sources.length >= 2 && trustedSources.length >= 1;
    };

    // Passing case: 2 sources, 1 trusted
    expect(
      checkStrictMode([
        { uri: "https://mevzuat.gov.tr", title: "A" },
        { uri: "https://example.com", title: "B" },
      ])
    ).toBe(true);

    // Failing case: 1 source only
    expect(
      checkStrictMode([{ uri: "https://mevzuat.gov.tr", title: "A" }])
    ).toBe(false);

    // Failing case: 2 sources but none trusted
    expect(
      checkStrictMode([
        { uri: "https://example.com", title: "A" },
        { uri: "https://blog.com", title: "B" },
      ])
    ).toBe(false);
  });
});
