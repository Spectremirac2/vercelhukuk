import { describe, it, expect } from "vitest";
import { addCitations } from "../utils/citation";
import { GroundingMetadata } from "../rag/evidence";

describe("addCitations", () => {
  it("should return original text when no grounding metadata", () => {
    const text = "Bu bir test metnidir.";
    const result = addCitations(text, null);
    expect(result).toBe(text);
  });

  it("should return original text when grounding metadata has no supports", () => {
    const text = "Bu bir test metnidir.";
    const metadata: GroundingMetadata = {
      groundingChunks: [{ web: { title: "Source", uri: "http://example.com" } }],
    };
    const result = addCitations(text, metadata);
    expect(result).toBe(text);
  });

  it("should insert single citation at correct position", () => {
    const text = "Turkish law protects data.";
    const metadata: GroundingMetadata = {
      groundingSupports: [
        {
          segment: { startIndex: 0, endIndex: 26 },
          groundingChunkIndices: [0],
        },
      ],
      groundingChunks: [
        { web: { title: "Source 1", uri: "http://example.com" } },
      ],
    };

    const result = addCitations(text, metadata);
    expect(result).toBe("Turkish law protects data. [1]");
  });

  it("should insert multiple citations at different positions", () => {
    const text = "Fact one. Fact two.";
    const metadata: GroundingMetadata = {
      groundingSupports: [
        {
          segment: { startIndex: 0, endIndex: 9 },
          groundingChunkIndices: [0],
        },
        {
          segment: { startIndex: 10, endIndex: 19 },
          groundingChunkIndices: [1, 2],
        },
      ],
      groundingChunks: [
        { web: { title: "S1", uri: "" } },
        { web: { title: "S2", uri: "" } },
        { web: { title: "S3", uri: "" } },
      ],
    };

    const result = addCitations(text, metadata);
    expect(result).toBe("Fact one. [1] Fact two. [2][3]");
  });

  it("should handle overlapping citations at same index", () => {
    const text = "Some important claim.";
    const metadata: GroundingMetadata = {
      groundingSupports: [
        {
          segment: { startIndex: 0, endIndex: 21 },
          groundingChunkIndices: [0],
        },
        {
          segment: { startIndex: 0, endIndex: 21 },
          groundingChunkIndices: [1],
        },
      ],
      groundingChunks: [
        { web: { title: "S1", uri: "http://a.com" } },
        { web: { title: "S2", uri: "http://b.com" } },
      ],
    };

    const result = addCitations(text, metadata);
    // Both citations should be at end
    expect(result).toContain("[1]");
    expect(result).toContain("[2]");
  });

  it("should skip invalid segment indices", () => {
    const text = "Short text.";
    const metadata: GroundingMetadata = {
      groundingSupports: [
        {
          segment: { startIndex: 0, endIndex: 100 }, // Invalid: beyond text length
          groundingChunkIndices: [0],
        },
      ],
      groundingChunks: [
        { web: { title: "S1", uri: "http://a.com" } },
      ],
    };

    const result = addCitations(text, metadata);
    expect(result).toBe(text); // No citation added due to invalid segment
  });

  it("should handle empty text", () => {
    const text = "";
    const metadata: GroundingMetadata = {
      groundingSupports: [],
      groundingChunks: [],
    };
    const result = addCitations(text, metadata);
    expect(result).toBe("");
  });
});
