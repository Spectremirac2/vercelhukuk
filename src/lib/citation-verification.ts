/**
 * Citation Verification System
 * Inspired by HalluGraph framework for legal RAG hallucination detection
 *
 * Key metrics:
 * - Entity Grounding (EG): Are entities in response present in sources?
 * - Relation Preservation (RP): Are claimed relationships supported by context?
 * - Citation Validity: Does the citation actually exist and support the claim?
 */

export interface Citation {
  text: string;           // The cited text/claim
  sourceUri: string;      // Source URL
  sourceTitle: string;    // Source title
  startIndex?: number;    // Position in response
  endIndex?: number;
}

export interface VerificationResult {
  isValid: boolean;
  confidence: number;     // 0-1 score
  entityGrounding: number;  // 0-1 score
  relationPreservation: number; // 0-1 score
  issues: string[];
  suggestions: string[];
}

export interface EntityMatch {
  entity: string;
  foundInSource: boolean;
  sourceSnippet?: string;
}

export interface SourceVerification {
  uri: string;
  title: string;
  isAccessible: boolean;
  isTrusted: boolean;
  contentMatch: number;   // 0-1 score for content relevance
  lastVerified?: Date;
}

// Turkish legal entity patterns
const LEGAL_ENTITY_PATTERNS = {
  // Case citations: "2024/1234 E., 2024/5678 K."
  caseNumber: /\d{4}\/\d+\s*[EK]\.?/gi,

  // Law articles: "madde 5", "m. 5", "md. 5"
  lawArticle: /(?:madde|md?\.|m\.)\s*\d+(?:\/\d+)?/gi,

  // Law numbers: "6698 sayılı Kanun", "5237 sayılı TCK"
  lawNumber: /\d{4,5}\s*sayılı\s*(?:Kanun|KHK|Tüzük|Yönetmelik|[A-ZÇĞİÖŞÜ]+)/gi,

  // Court names
  courtNames: /(?:Yargıtay|Danıştay|Anayasa Mahkemesi|AYM|İstinaf|Bölge (?:Adliye|İdare) Mahkemesi|BAM|BİM)/gi,

  // Chamber/Division: "4. Hukuk Dairesi", "12. Ceza Dairesi"
  chamber: /\d+\.?\s*(?:Hukuk|Ceza|İdari|Vergi)\s*Dairesi/gi,

  // Dates: "01.01.2024", "1 Ocak 2024"
  dates: /\d{1,2}[./-]\d{1,2}[./-]\d{4}|\d{1,2}\s+(?:Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s+\d{4}/gi,

  // Legal terms that should be grounded
  legalTerms: /(?:hüküm|karar|içtihat|emsal|mütalaa|gerekçe|sonuç|ret|kabul|bozma|onama)/gi,
};

// Key Turkish law references
const MAJOR_LAWS: Record<string, string> = {
  "6698": "Kişisel Verilerin Korunması Kanunu (KVKK)",
  "6102": "Türk Ticaret Kanunu (TTK)",
  "6100": "Hukuk Muhakemeleri Kanunu (HMK)",
  "5237": "Türk Ceza Kanunu (TCK)",
  "5271": "Ceza Muhakemesi Kanunu (CMK)",
  "4857": "İş Kanunu",
  "6098": "Türk Borçlar Kanunu (TBK)",
  "4721": "Türk Medeni Kanunu (TMK)",
  "2709": "Türkiye Cumhuriyeti Anayasası",
  "213": "Vergi Usul Kanunu (VUK)",
  "3065": "Katma Değer Vergisi Kanunu",
  "193": "Gelir Vergisi Kanunu",
  "5520": "Kurumlar Vergisi Kanunu",
};

/**
 * Extract legal entities from text
 */
export function extractLegalEntities(text: string): string[] {
  const entities: Set<string> = new Set();

  for (const [, pattern] of Object.entries(LEGAL_ENTITY_PATTERNS)) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => entities.add(match.trim()));
    }
  }

  return Array.from(entities);
}

/**
 * Calculate Entity Grounding score
 * Measures: Are entities in the response present in the source documents?
 */
export function calculateEntityGrounding(
  responseEntities: string[],
  sourceContent: string
): { score: number; matches: EntityMatch[] } {
  if (responseEntities.length === 0) {
    return { score: 1, matches: [] };
  }

  const matches: EntityMatch[] = [];
  let foundCount = 0;

  const normalizedSource = sourceContent.toLowerCase();

  for (const entity of responseEntities) {
    const normalizedEntity = entity.toLowerCase();
    const found = normalizedSource.includes(normalizedEntity);

    matches.push({
      entity,
      foundInSource: found,
      sourceSnippet: found
        ? extractSnippet(sourceContent, entity)
        : undefined,
    });

    if (found) foundCount++;
  }

  return {
    score: foundCount / responseEntities.length,
    matches,
  };
}

/**
 * Extract a snippet around the found entity
 */
function extractSnippet(text: string, entity: string, contextLength = 50): string {
  const lowerText = text.toLowerCase();
  const lowerEntity = entity.toLowerCase();
  const index = lowerText.indexOf(lowerEntity);

  if (index === -1) return "";

  const start = Math.max(0, index - contextLength);
  const end = Math.min(text.length, index + entity.length + contextLength);

  let snippet = text.slice(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";

  return snippet;
}

/**
 * Calculate Relation Preservation score
 * Measures: Are the relationships claimed in the response supported by sources?
 */
export function calculateRelationPreservation(
  claims: string[],
  sourceContent: string
): number {
  if (claims.length === 0) return 1;

  let supportedCount = 0;
  const normalizedSource = sourceContent.toLowerCase();

  for (const claim of claims) {
    // Extract key words from the claim
    const keyWords = claim
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 5); // Take first 5 significant words

    // Check if most key words appear in source
    const foundWords = keyWords.filter(word => normalizedSource.includes(word));
    const matchRatio = keyWords.length > 0 ? foundWords.length / keyWords.length : 0;

    if (matchRatio >= 0.6) supportedCount++;
  }

  return supportedCount / claims.length;
}

/**
 * Verify a single citation
 */
export function verifyCitation(
  citation: Citation,
  sourceContent: string
): VerificationResult {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Extract entities from the cited text
  const citedEntities = extractLegalEntities(citation.text);

  // Calculate Entity Grounding
  const { score: egScore, matches } = calculateEntityGrounding(citedEntities, sourceContent);

  // Find ungrounded entities
  const ungroundedEntities = matches
    .filter(m => !m.foundInSource)
    .map(m => m.entity);

  if (ungroundedEntities.length > 0) {
    issues.push(`Kaynakta bulunamayan referanslar: ${ungroundedEntities.join(", ")}`);
    suggestions.push("Bu referansları doğrudan kaynaklardan kontrol edin.");
  }

  // Calculate Relation Preservation (simple heuristic)
  const sentences = citation.text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const rpScore = calculateRelationPreservation(sentences, sourceContent);

  if (rpScore < 0.5) {
    issues.push("İddiaların kaynak içeriğiyle düşük eşleşme oranı.");
    suggestions.push("Kaynak metnini dikkatlice inceleyin.");
  }

  // Overall confidence
  const confidence = (egScore * 0.6 + rpScore * 0.4);

  return {
    isValid: confidence >= 0.5 && issues.length === 0,
    confidence,
    entityGrounding: egScore,
    relationPreservation: rpScore,
    issues,
    suggestions,
  };
}

/**
 * Verify all citations in a response
 */
export interface ResponseVerification {
  overallConfidence: number;
  totalCitations: number;
  verifiedCitations: number;
  unverifiedCitations: number;
  citationResults: Array<{
    citation: Citation;
    verification: VerificationResult;
  }>;
  warnings: string[];
  riskLevel: "low" | "medium" | "high";
}

export function verifyResponse(
  responseText: string,
  citations: Citation[],
  sourceContents: Map<string, string>
): ResponseVerification {
  const results: ResponseVerification["citationResults"] = [];
  const warnings: string[] = [];

  let totalConfidence = 0;
  let verifiedCount = 0;

  for (const citation of citations) {
    const sourceContent = sourceContents.get(citation.sourceUri) || "";

    if (!sourceContent) {
      warnings.push(`Kaynak içeriği alınamadı: ${citation.sourceTitle}`);
      results.push({
        citation,
        verification: {
          isValid: false,
          confidence: 0,
          entityGrounding: 0,
          relationPreservation: 0,
          issues: ["Kaynak içeriği doğrulanamadı"],
          suggestions: ["Kaynağı manuel olarak kontrol edin"],
        },
      });
      continue;
    }

    const verification = verifyCitation(citation, sourceContent);
    results.push({ citation, verification });

    totalConfidence += verification.confidence;
    if (verification.isValid) verifiedCount++;
  }

  const overallConfidence = citations.length > 0
    ? totalConfidence / citations.length
    : 0;

  // Determine risk level
  let riskLevel: "low" | "medium" | "high";
  if (overallConfidence >= 0.7 && verifiedCount === citations.length) {
    riskLevel = "low";
  } else if (overallConfidence >= 0.4) {
    riskLevel = "medium";
  } else {
    riskLevel = "high";
  }

  // Check for response entities not backed by any source
  const responseEntities = extractLegalEntities(responseText);
  const allSourceContent = Array.from(sourceContents.values()).join(" ");
  const { matches } = calculateEntityGrounding(responseEntities, allSourceContent);
  const orphanedEntities = matches.filter(m => !m.foundInSource);

  if (orphanedEntities.length > 0) {
    warnings.push(
      `Yanıtta kaynaklarla desteklenmeyen ${orphanedEntities.length} referans bulundu: ` +
      orphanedEntities.slice(0, 3).map(e => e.entity).join(", ") +
      (orphanedEntities.length > 3 ? "..." : "")
    );
  }

  return {
    overallConfidence,
    totalCitations: citations.length,
    verifiedCitations: verifiedCount,
    unverifiedCitations: citations.length - verifiedCount,
    citationResults: results,
    warnings,
    riskLevel,
  };
}

/**
 * Generate a verification badge/indicator
 */
export function getVerificationBadge(confidence: number): {
  label: string;
  color: string;
  icon: string;
} {
  if (confidence >= 0.8) {
    return { label: "Yüksek Güvenilirlik", color: "green", icon: "✓✓" };
  } else if (confidence >= 0.6) {
    return { label: "Orta Güvenilirlik", color: "yellow", icon: "✓" };
  } else if (confidence >= 0.4) {
    return { label: "Düşük Güvenilirlik", color: "orange", icon: "⚠" };
  } else {
    return { label: "Doğrulama Gerekli", color: "red", icon: "✗" };
  }
}

/**
 * Validate law reference format
 */
export function validateLawReference(reference: string): {
  isValid: boolean;
  lawName?: string;
  suggestion?: string;
} {
  // Extract law number
  const lawNumberMatch = reference.match(/(\d{3,5})\s*sayılı/);

  if (lawNumberMatch) {
    const lawNum = lawNumberMatch[1];
    const knownLaw = MAJOR_LAWS[lawNum];

    if (knownLaw) {
      return {
        isValid: true,
        lawName: knownLaw,
      };
    } else {
      return {
        isValid: true,
        suggestion: `${lawNum} sayılı kanun tanınmıyor, mevzuat.gov.tr'den doğrulayın`,
      };
    }
  }

  return {
    isValid: false,
    suggestion: "Geçerli bir kanun numarası formatı kullanın (örn: 6698 sayılı Kanun)",
  };
}

/**
 * Extract claims that need verification from response
 */
export function extractVerifiableClaims(text: string): string[] {
  const claims: string[] = [];

  // Patterns indicating factual claims
  const claimIndicators = [
    /(?:göre|uyarınca|gereğince)[^.]+\./gi,
    /(?:hükm|karar|düzenleme)[^.]+\./gi,
    /(?:mahkeme|yargıtay|danıştay)[^.]+(?:karar|hüküm)[^.]+\./gi,
    /madde\s+\d+[^.]+(?:hüküm|düzenle|öngör)[^.]+\./gi,
  ];

  for (const pattern of claimIndicators) {
    const matches = text.match(pattern);
    if (matches) {
      claims.push(...matches.map(m => m.trim()));
    }
  }

  return [...new Set(claims)]; // Remove duplicates
}
