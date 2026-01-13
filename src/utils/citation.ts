import { GroundingMetadata } from "../rag/evidence";

interface CitationInsertion {
  index: number;
  citations: number[]; // 1-based citation numbers
}

/**
 * Adds inline citations to the text based on grounding metadata.
 * Optimized algorithm using array-based string building.
 *
 * @param text - The original text
 * @param groundingMetadata - Grounding metadata from Gemini
 * @returns Text with [1][2] style citations inserted
 */
export function addCitations(
  text: string,
  groundingMetadata: GroundingMetadata | null | undefined
): string {
  if (!groundingMetadata || !text) {
    return text;
  }

  const supports = groundingMetadata.groundingSupports;
  const chunks = groundingMetadata.groundingChunks;

  if (!supports || !chunks || supports.length === 0) {
    return text;
  }

  // Collect all citation insertions
  const insertionMap = new Map<number, Set<number>>();

  for (const support of supports) {
    const segment = support.segment;
    const chunkIndices = support.groundingChunkIndices;

    if (!segment || !chunkIndices || chunkIndices.length === 0) {
      continue;
    }

    // Validate segment bounds
    const endIndex = segment.endIndex;
    if (endIndex === undefined || endIndex < 0 || endIndex > text.length) {
      console.warn(`Skipping invalid citation segment: endIndex=${endIndex}`);
      continue;
    }

    // Use Set to avoid duplicate citations at same position
    if (!insertionMap.has(endIndex)) {
      insertionMap.set(endIndex, new Set());
    }

    const citationSet = insertionMap.get(endIndex)!;
    for (const idx of chunkIndices) {
      // Convert to 1-based citation number
      citationSet.add(idx + 1);
    }
  }

  // No insertions needed
  if (insertionMap.size === 0) {
    return text;
  }

  // Convert map to sorted array (ascending order for single-pass processing)
  const insertions: CitationInsertion[] = Array.from(insertionMap.entries())
    .map(([index, citations]) => ({
      index,
      citations: Array.from(citations).sort((a, b) => a - b), // Sort citations numerically
    }))
    .sort((a, b) => a.index - b.index);

  // Build result using array (more efficient than repeated string slicing)
  const parts: string[] = [];
  let lastIndex = 0;

  for (const insertion of insertions) {
    // Add text from last position to current insertion point
    if (insertion.index > lastIndex) {
      parts.push(text.slice(lastIndex, insertion.index));
    }

    // Format citations: [1][2][3]
    const citationText = insertion.citations.map((n) => `[${n}]`).join("");

    // Smart spacing: add space before citations if needed
    const needsSpace = shouldAddSpace(text, insertion.index, parts);
    if (needsSpace) {
      parts.push(" ");
    }

    parts.push(citationText);
    lastIndex = insertion.index;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.join("");
}

/**
 * Determines if a space should be added before the citation.
 * Avoids double spaces and adds space after sentences.
 */
function shouldAddSpace(
  text: string,
  insertIndex: number,
  previousParts: string[]
): boolean {
  // Get the character before insertion point
  let charBefore: string | undefined;

  if (previousParts.length > 0) {
    const lastPart = previousParts[previousParts.length - 1];
    if (lastPart.length > 0) {
      charBefore = lastPart[lastPart.length - 1];
    }
  } else if (insertIndex > 0) {
    charBefore = text[insertIndex - 1];
  }

  // No char before (start of text), no space needed
  if (!charBefore) {
    return false;
  }

  // Already has space, don't add another
  if (charBefore === " " || charBefore === "\n" || charBefore === "\t") {
    return false;
  }

  // Add space after most characters for readability
  return true;
}

/**
 * Extracts unique citation numbers from text.
 * Useful for validation and debugging.
 */
export function extractCitationNumbers(text: string): number[] {
  const matches = text.matchAll(/\[(\d+)\]/g);
  const numbers = new Set<number>();

  for (const match of matches) {
    numbers.add(parseInt(match[1], 10));
  }

  return Array.from(numbers).sort((a, b) => a - b);
}

/**
 * Validates that all citations in text have corresponding sources.
 */
export function validateCitations(
  text: string,
  sourceCount: number
): { valid: boolean; invalidCitations: number[] } {
  const citationNumbers = extractCitationNumbers(text);
  const invalidCitations = citationNumbers.filter(
    (n) => n < 1 || n > sourceCount
  );

  return {
    valid: invalidCitations.length === 0,
    invalidCitations,
  };
}
