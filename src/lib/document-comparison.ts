/**
 * Document Comparison and Redlining System
 *
 * Based on 2025 research: AI-powered document comparison provides
 * 45-90% cycle-time reductions. Features:
 * - Side-by-side diff analysis
 * - Semantic change detection (not just text diff)
 * - Risk scoring for changes
 * - Clause-level comparison
 * - Track changes export
 *
 * Reference: Spellbook, LEGALFLY, Diffchecker Legal
 */

// Change types
export type ChangeType =
  | "added"
  | "removed"
  | "modified"
  | "moved"
  | "formatting"
  | "unchanged";

export type ChangeSeverity =
  | "critical"   // High-risk legal change
  | "major"      // Significant change requiring review
  | "minor"      // Low-risk change
  | "cosmetic";  // Formatting/style only

export type ClauseCategory =
  | "taraflar"
  | "tanimlar"
  | "konu"
  | "sure"
  | "bedel"
  | "odeme"
  | "teslim"
  | "garanti"
  | "sorumluluk"
  | "tazminat"
  | "gizlilik"
  | "rekabet_yasagi"
  | "fikri_mulkiyet"
  | "fesih"
  | "mucbir_sebep"
  | "uyusmazlik"
  | "tebligat"
  | "genel_hukumler"
  | "imzalar"
  | "ekler"
  | "diger";

export interface TextSegment {
  id: string;
  text: string;
  startIndex: number;
  endIndex: number;
  lineNumber: number;
  paragraphNumber: number;
}

export interface DocumentChange {
  id: string;
  type: ChangeType;
  severity: ChangeSeverity;
  originalSegment?: TextSegment;
  newSegment?: TextSegment;
  originalText: string;
  newText: string;
  clauseCategory?: ClauseCategory;
  description: string;
  legalImplication?: string;
  riskScore: number;
  suggestedAction?: string;
  isAccepted?: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
  comments: string[];
}

export interface ClauseComparison {
  clauseCategory: ClauseCategory;
  clauseName: string;
  originalPresent: boolean;
  newPresent: boolean;
  changes: DocumentChange[];
  overallChange: "added" | "removed" | "modified" | "unchanged";
  riskAssessment: {
    level: ChangeSeverity;
    reason: string;
  };
}

export interface ComparisonSummary {
  totalChanges: number;
  addedCount: number;
  removedCount: number;
  modifiedCount: number;
  movedCount: number;
  criticalChanges: number;
  majorChanges: number;
  minorChanges: number;
  cosmeticChanges: number;
  overallRiskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  keyFindings: string[];
  recommendations: string[];
}

export interface ComparisonResult {
  id: string;
  originalDocument: {
    name: string;
    content: string;
    wordCount: number;
    characterCount: number;
  };
  newDocument: {
    name: string;
    content: string;
    wordCount: number;
    characterCount: number;
  };
  changes: DocumentChange[];
  clauseComparisons: ClauseComparison[];
  summary: ComparisonSummary;
  createdAt: Date;
  processingTimeMs: number;
}

export interface RedlineDocument {
  content: string;
  htmlContent: string;
  changes: DocumentChange[];
  acceptedChanges: string[];
  rejectedChanges: string[];
}

// High-risk terms and patterns for Turkish contracts
const highRiskPatterns: Array<{
  pattern: RegExp;
  description: string;
  category: ClauseCategory;
  riskLevel: ChangeSeverity;
}> = [
  {
    pattern: /sınırsız\s+sorumluluk/gi,
    description: "Sınırsız sorumluluk kaydı",
    category: "sorumluluk",
    riskLevel: "critical",
  },
  {
    pattern: /tek\s+taraflı\s+fesih/gi,
    description: "Tek taraflı fesih hakkı",
    category: "fesih",
    riskLevel: "major",
  },
  {
    pattern: /cayma\s+hakkı.*(?:yoktur|bulunmamaktadır)/gi,
    description: "Cayma hakkının kaldırılması",
    category: "fesih",
    riskLevel: "critical",
  },
  {
    pattern: /cezai\s+şart.*(\d+[.,]?\d*)\s*(tl|lira|dolar|euro)/gi,
    description: "Cezai şart miktarı",
    category: "tazminat",
    riskLevel: "major",
  },
  {
    pattern: /tüm\s+(?:masraf|gider|harç).*(?:alıcı|kiracı|işçi|tüketici)/gi,
    description: "Masrafların zayıf tarafa yüklenmesi",
    category: "bedel",
    riskLevel: "major",
  },
  {
    pattern: /yetki.*(?:münhasır|tek|yalnızca).*mahkeme/gi,
    description: "Münhasır yetki şartı",
    category: "uyusmazlik",
    riskLevel: "minor",
  },
  {
    pattern: /tahkim.*(?:zorunlu|bağlayıcı)/gi,
    description: "Zorunlu tahkim şartı",
    category: "uyusmazlik",
    riskLevel: "major",
  },
  {
    pattern: /otomatik\s+yenileme/gi,
    description: "Otomatik yenileme maddesi",
    category: "sure",
    riskLevel: "minor",
  },
  {
    pattern: /gizlilik.*süresiz|süresiz.*gizlilik/gi,
    description: "Süresiz gizlilik yükümlülüğü",
    category: "gizlilik",
    riskLevel: "major",
  },
  {
    pattern: /rekabet\s+yasağı.*(\d+)\s*yıl/gi,
    description: "Rekabet yasağı süresi",
    category: "rekabet_yasagi",
    riskLevel: "major",
  },
  {
    pattern: /(?:devir|temlik).*(?:yasak|izne\s+tabi)/gi,
    description: "Devir kısıtlaması",
    category: "genel_hukumler",
    riskLevel: "minor",
  },
  {
    pattern: /mücbir\s+sebep.*(?:kapsam|dahil|hariç)/gi,
    description: "Mücbir sebep tanımı değişikliği",
    category: "mucbir_sebep",
    riskLevel: "major",
  },
  {
    pattern: /kişisel\s+veri.*(?:aktarım|işleme|paylaşım)/gi,
    description: "Kişisel veri işleme hükmü",
    category: "gizlilik",
    riskLevel: "major",
  },
  {
    pattern: /temerrüt\s+faizi.*%\s*(\d+)/gi,
    description: "Temerrüt faizi oranı",
    category: "odeme",
    riskLevel: "minor",
  },
];

// Clause detection patterns
const clausePatterns: Array<{
  category: ClauseCategory;
  patterns: RegExp[];
  name: string;
}> = [
  {
    category: "taraflar",
    patterns: [/taraflar/i, /işbu\s+sözleşme/i, /arasında.*akdedilmiştir/i],
    name: "Taraflar",
  },
  {
    category: "tanimlar",
    patterns: [/tanımlar/i, /terimler/i, /kavramlar/i],
    name: "Tanımlar",
  },
  {
    category: "konu",
    patterns: [/sözleşmenin\s+konusu/i, /amaç/i, /kapsam/i],
    name: "Konu ve Kapsam",
  },
  {
    category: "sure",
    patterns: [/süre/i, /yürürlük/i, /geçerlilik/i, /başlangıç.*bitiş/i],
    name: "Süre",
  },
  {
    category: "bedel",
    patterns: [/bedel/i, /ücret/i, /fiyat/i, /tutar/i],
    name: "Bedel",
  },
  {
    category: "odeme",
    patterns: [/ödeme/i, /vade/i, /taksit/i, /fatura/i],
    name: "Ödeme Koşulları",
  },
  {
    category: "teslim",
    patterns: [/teslim/i, /teslimat/i, /ifa/i, /edim/i],
    name: "Teslim",
  },
  {
    category: "garanti",
    patterns: [/garanti/i, /taahhüt/i, /beyan/i],
    name: "Garanti ve Taahhütler",
  },
  {
    category: "sorumluluk",
    patterns: [/sorumluluk/i, /yükümlülük/i, /borç/i],
    name: "Sorumluluk",
  },
  {
    category: "tazminat",
    patterns: [/tazminat/i, /cezai\s+şart/i, /zarar/i],
    name: "Tazminat ve Cezai Şart",
  },
  {
    category: "gizlilik",
    patterns: [/gizlilik/i, /sır/i, /mahrem/i, /ifşa/i],
    name: "Gizlilik",
  },
  {
    category: "rekabet_yasagi",
    patterns: [/rekabet/i, /yarışma/i, /rakip/i],
    name: "Rekabet Yasağı",
  },
  {
    category: "fikri_mulkiyet",
    patterns: [/fikri\s+mülkiyet/i, /telif/i, /patent/i, /marka/i, /lisans/i],
    name: "Fikri Mülkiyet",
  },
  {
    category: "fesih",
    patterns: [/fesih/i, /sona\s+erme/i, /iptal/i, /cayma/i],
    name: "Fesih",
  },
  {
    category: "mucbir_sebep",
    patterns: [/mücbir\s+sebep/i, /force\s+majeure/i, /beklenmeyen\s+hal/i],
    name: "Mücbir Sebep",
  },
  {
    category: "uyusmazlik",
    patterns: [/uyuşmazlık/i, /ihtilaf/i, /tahkim/i, /arabuluculuk/i, /mahkeme/i],
    name: "Uyuşmazlık Çözümü",
  },
  {
    category: "tebligat",
    patterns: [/tebligat/i, /bildirim/i, /ihbar/i],
    name: "Tebligat",
  },
  {
    category: "genel_hukumler",
    patterns: [/diğer\s+hükümler/i, /çeşitli\s+hükümler/i, /son\s+hükümler/i],
    name: "Genel Hükümler",
  },
  {
    category: "imzalar",
    patterns: [/imza/i, /taraflar.*kabul/i, /tanzim/i],
    name: "İmzalar",
  },
  {
    category: "ekler",
    patterns: [/ek[-\s]/i, /lahika/i, /appendix/i],
    name: "Ekler",
  },
];

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Split text into segments (paragraphs)
 */
function splitIntoSegments(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const paragraphs = text.split(/\n\s*\n/);

  let currentIndex = 0;
  let lineNumber = 1;

  paragraphs.forEach((paragraph, paragraphNumber) => {
    const trimmed = paragraph.trim();
    if (trimmed) {
      segments.push({
        id: generateId("segment"),
        text: trimmed,
        startIndex: currentIndex,
        endIndex: currentIndex + paragraph.length,
        lineNumber,
        paragraphNumber: paragraphNumber + 1,
      });
    }

    currentIndex += paragraph.length + 2; // Account for \n\n
    lineNumber += (paragraph.match(/\n/g) || []).length + 2;
  });

  return segments;
}

/**
 * Detect clause category for a text segment
 */
function detectClauseCategory(text: string): ClauseCategory {
  for (const clause of clausePatterns) {
    if (clause.patterns.some(pattern => pattern.test(text))) {
      return clause.category;
    }
  }
  return "diger";
}

/**
 * Calculate text similarity using Levenshtein distance
 */
export function calculateSimilarity(text1: string, text2: string): number {
  const len1 = text1.length;
  const len2 = text2.length;

  if (len1 === 0) return len2 === 0 ? 1 : 0;
  if (len2 === 0) return 0;

  // For very long texts, use a simpler comparison
  if (len1 > 1000 || len2 > 1000) {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  }

  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = text1[i - 1] === text2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return 1 - distance / maxLen;
}

/**
 * Find best matching segment in the other document
 */
function findBestMatch(
  segment: TextSegment,
  otherSegments: TextSegment[],
  threshold: number = 0.6
): { match: TextSegment | null; similarity: number } {
  let bestMatch: TextSegment | null = null;
  let bestSimilarity = 0;

  for (const other of otherSegments) {
    const similarity = calculateSimilarity(segment.text, other.text);
    if (similarity > bestSimilarity && similarity >= threshold) {
      bestSimilarity = similarity;
      bestMatch = other;
    }
  }

  return { match: bestMatch, similarity: bestSimilarity };
}

/**
 * Assess risk level for a change
 */
function assessChangeRisk(
  originalText: string,
  newText: string,
  changeType: ChangeType
): { severity: ChangeSeverity; riskScore: number; implication?: string } {
  // Formatting only changes
  if (
    changeType === "formatting" ||
    originalText.replace(/\s+/g, "") === newText.replace(/\s+/g, "")
  ) {
    return { severity: "cosmetic", riskScore: 0 };
  }

  // Check for high-risk patterns
  for (const risk of highRiskPatterns) {
    const wasInOriginal = risk.pattern.test(originalText);
    const isInNew = risk.pattern.test(newText);

    // Reset lastIndex for global regex
    risk.pattern.lastIndex = 0;

    if (!wasInOriginal && isInNew) {
      return {
        severity: risk.riskLevel,
        riskScore: risk.riskLevel === "critical" ? 1 : risk.riskLevel === "major" ? 0.7 : 0.4,
        implication: `YENİ EKLENDİ: ${risk.description}`,
      };
    }

    if (wasInOriginal && !isInNew) {
      return {
        severity: risk.riskLevel,
        riskScore: risk.riskLevel === "critical" ? 0.8 : risk.riskLevel === "major" ? 0.5 : 0.3,
        implication: `ÇIKARILDI: ${risk.description}`,
      };
    }
  }

  // Assess based on change type
  if (changeType === "removed") {
    return { severity: "major", riskScore: 0.5 };
  }

  if (changeType === "added") {
    return { severity: "minor", riskScore: 0.3 };
  }

  if (changeType === "modified") {
    const similarity = calculateSimilarity(originalText, newText);
    if (similarity < 0.3) {
      return { severity: "major", riskScore: 0.6 };
    } else if (similarity < 0.7) {
      return { severity: "minor", riskScore: 0.4 };
    }
  }

  return { severity: "cosmetic", riskScore: 0.1 };
}

/**
 * Compare two documents and generate changes
 */
export function compareDocuments(
  originalContent: string,
  newContent: string,
  originalName: string = "Orijinal",
  newName: string = "Yeni"
): ComparisonResult {
  const startTime = Date.now();

  // Split into segments
  const originalSegments = splitIntoSegments(originalContent);
  const newSegments = splitIntoSegments(newContent);

  const changes: DocumentChange[] = [];
  const matchedOriginals = new Set<string>();
  const matchedNew = new Set<string>();

  // Find modified and unchanged segments
  for (const origSeg of originalSegments) {
    const { match, similarity } = findBestMatch(origSeg, newSegments);

    if (match && similarity >= 0.95) {
      // Unchanged or cosmetic
      matchedOriginals.add(origSeg.id);
      matchedNew.add(match.id);

      if (similarity < 1) {
        const { severity, riskScore, implication } = assessChangeRisk(
          origSeg.text,
          match.text,
          "formatting"
        );

        changes.push({
          id: generateId("change"),
          type: "formatting",
          severity,
          originalSegment: origSeg,
          newSegment: match,
          originalText: origSeg.text,
          newText: match.text,
          clauseCategory: detectClauseCategory(origSeg.text),
          description: "Biçimlendirme değişikliği",
          legalImplication: implication,
          riskScore,
          comments: [],
        });
      }
    } else if (match && similarity >= 0.6) {
      // Modified
      matchedOriginals.add(origSeg.id);
      matchedNew.add(match.id);

      const { severity, riskScore, implication } = assessChangeRisk(
        origSeg.text,
        match.text,
        "modified"
      );

      changes.push({
        id: generateId("change"),
        type: "modified",
        severity,
        originalSegment: origSeg,
        newSegment: match,
        originalText: origSeg.text,
        newText: match.text,
        clauseCategory: detectClauseCategory(origSeg.text),
        description: `Paragraf ${origSeg.paragraphNumber} değiştirildi (${(similarity * 100).toFixed(0)}% benzerlik)`,
        legalImplication: implication,
        riskScore,
        comments: [],
      });
    }
  }

  // Find removed segments
  for (const origSeg of originalSegments) {
    if (!matchedOriginals.has(origSeg.id)) {
      const { severity, riskScore, implication } = assessChangeRisk(
        origSeg.text,
        "",
        "removed"
      );

      changes.push({
        id: generateId("change"),
        type: "removed",
        severity,
        originalSegment: origSeg,
        originalText: origSeg.text,
        newText: "",
        clauseCategory: detectClauseCategory(origSeg.text),
        description: `Paragraf ${origSeg.paragraphNumber} silindi`,
        legalImplication: implication,
        riskScore,
        comments: [],
      });
    }
  }

  // Find added segments
  for (const newSeg of newSegments) {
    if (!matchedNew.has(newSeg.id)) {
      const { severity, riskScore, implication } = assessChangeRisk(
        "",
        newSeg.text,
        "added"
      );

      changes.push({
        id: generateId("change"),
        type: "added",
        severity,
        newSegment: newSeg,
        originalText: "",
        newText: newSeg.text,
        clauseCategory: detectClauseCategory(newSeg.text),
        description: `Yeni paragraf eklendi (paragraf ${newSeg.paragraphNumber})`,
        legalImplication: implication,
        riskScore,
        comments: [],
      });
    }
  }

  // Sort changes by paragraph number
  changes.sort((a, b) => {
    const aNum = a.originalSegment?.paragraphNumber || a.newSegment?.paragraphNumber || 0;
    const bNum = b.originalSegment?.paragraphNumber || b.newSegment?.paragraphNumber || 0;
    return aNum - bNum;
  });

  // Generate clause comparisons
  const clauseComparisons = generateClauseComparisons(changes, originalContent, newContent);

  // Generate summary
  const summary = generateSummary(changes);

  return {
    id: generateId("comparison"),
    originalDocument: {
      name: originalName,
      content: originalContent,
      wordCount: originalContent.split(/\s+/).length,
      characterCount: originalContent.length,
    },
    newDocument: {
      name: newName,
      content: newContent,
      wordCount: newContent.split(/\s+/).length,
      characterCount: newContent.length,
    },
    changes,
    clauseComparisons,
    summary,
    createdAt: new Date(),
    processingTimeMs: Date.now() - startTime,
  };
}

/**
 * Generate clause-level comparisons
 */
function generateClauseComparisons(
  changes: DocumentChange[],
  originalContent: string,
  newContent: string
): ClauseComparison[] {
  const comparisons: ClauseComparison[] = [];

  for (const clause of clausePatterns) {
    const clauseChanges = changes.filter(c => c.clauseCategory === clause.category);

    const originalHasClause = clause.patterns.some(p => p.test(originalContent));
    const newHasClause = clause.patterns.some(p => p.test(newContent));

    let overallChange: ClauseComparison["overallChange"] = "unchanged";
    if (!originalHasClause && newHasClause) {
      overallChange = "added";
    } else if (originalHasClause && !newHasClause) {
      overallChange = "removed";
    } else if (clauseChanges.length > 0) {
      overallChange = "modified";
    }

    // Skip if no changes and both have or don't have the clause
    if (overallChange === "unchanged" && clauseChanges.length === 0) {
      continue;
    }

    // Calculate risk level
    let maxRiskScore = 0;
    let riskReason = "";
    for (const change of clauseChanges) {
      if (change.riskScore > maxRiskScore) {
        maxRiskScore = change.riskScore;
        riskReason = change.legalImplication || change.description;
      }
    }

    let riskLevel: ChangeSeverity = "cosmetic";
    if (maxRiskScore >= 0.8) riskLevel = "critical";
    else if (maxRiskScore >= 0.5) riskLevel = "major";
    else if (maxRiskScore >= 0.2) riskLevel = "minor";

    comparisons.push({
      clauseCategory: clause.category,
      clauseName: clause.name,
      originalPresent: originalHasClause,
      newPresent: newHasClause,
      changes: clauseChanges,
      overallChange,
      riskAssessment: {
        level: riskLevel,
        reason: riskReason || "Değişiklik tespit edildi",
      },
    });
  }

  return comparisons;
}

/**
 * Generate comparison summary
 */
function generateSummary(changes: DocumentChange[]): ComparisonSummary {
  const addedCount = changes.filter(c => c.type === "added").length;
  const removedCount = changes.filter(c => c.type === "removed").length;
  const modifiedCount = changes.filter(c => c.type === "modified").length;
  const movedCount = changes.filter(c => c.type === "moved").length;

  const criticalChanges = changes.filter(c => c.severity === "critical").length;
  const majorChanges = changes.filter(c => c.severity === "major").length;
  const minorChanges = changes.filter(c => c.severity === "minor").length;
  const cosmeticChanges = changes.filter(c => c.severity === "cosmetic").length;

  // Calculate overall risk score
  let overallRiskScore = 0;
  if (changes.length > 0) {
    overallRiskScore = changes.reduce((sum, c) => sum + c.riskScore, 0) / changes.length;
  }

  // Determine risk level
  let riskLevel: ComparisonSummary["riskLevel"] = "low";
  if (criticalChanges > 0 || overallRiskScore >= 0.7) {
    riskLevel = "critical";
  } else if (majorChanges > 2 || overallRiskScore >= 0.5) {
    riskLevel = "high";
  } else if (majorChanges > 0 || overallRiskScore >= 0.3) {
    riskLevel = "medium";
  }

  // Generate key findings
  const keyFindings: string[] = [];

  if (criticalChanges > 0) {
    keyFindings.push(`⚠️ ${criticalChanges} kritik değişiklik dikkat gerektiriyor`);
  }

  if (removedCount > addedCount) {
    keyFindings.push(`📉 ${removedCount - addedCount} paragraf kaldırılmış (sadeleştirme veya hak kaybı olabilir)`);
  } else if (addedCount > removedCount) {
    keyFindings.push(`📈 ${addedCount - removedCount} yeni paragraf eklenmiş`);
  }

  const highRiskChanges = changes.filter(c => c.legalImplication);
  for (const change of highRiskChanges.slice(0, 3)) {
    keyFindings.push(`⚡ ${change.legalImplication}`);
  }

  // Generate recommendations
  const recommendations: string[] = [];

  if (criticalChanges > 0) {
    recommendations.push("Kritik değişiklikleri avukatınızla görüşün");
  }

  if (majorChanges > 0) {
    recommendations.push("Önemli değişikliklerin hukuki sonuçlarını değerlendirin");
  }

  if (changes.some(c => c.clauseCategory === "sorumluluk" || c.clauseCategory === "tazminat")) {
    recommendations.push("Sorumluluk ve tazminat maddelerini dikkatle inceleyin");
  }

  if (changes.some(c => c.clauseCategory === "fesih")) {
    recommendations.push("Fesih koşullarındaki değişiklikleri kontrol edin");
  }

  if (changes.some(c => c.clauseCategory === "gizlilik")) {
    recommendations.push("Gizlilik yükümlülüklerini gözden geçirin");
  }

  if (recommendations.length === 0) {
    recommendations.push("Değişiklikler düşük riskli görünmektedir");
  }

  return {
    totalChanges: changes.length,
    addedCount,
    removedCount,
    modifiedCount,
    movedCount,
    criticalChanges,
    majorChanges,
    minorChanges,
    cosmeticChanges,
    overallRiskScore,
    riskLevel,
    keyFindings,
    recommendations,
  };
}

/**
 * Generate redline document with track changes
 */
export function generateRedline(result: ComparisonResult): RedlineDocument {
  let content = result.newDocument.content;
  let htmlContent = "";

  // Build HTML with highlighted changes
  htmlContent = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Redline: ${result.originalDocument.name} vs ${result.newDocument.name}</title>
  <style>
    body { font-family: 'Times New Roman', serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; }
    .added { background-color: #d4edda; color: #155724; text-decoration: underline; }
    .removed { background-color: #f8d7da; color: #721c24; text-decoration: line-through; }
    .modified-old { background-color: #fff3cd; color: #856404; text-decoration: line-through; }
    .modified-new { background-color: #d4edda; color: #155724; text-decoration: underline; }
    .critical { border-left: 4px solid #dc3545; padding-left: 10px; }
    .major { border-left: 4px solid #ffc107; padding-left: 10px; }
    .change-note { font-size: 0.8em; color: #6c757d; font-style: italic; }
    .summary { background: #f8f9fa; padding: 20px; margin-bottom: 20px; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="summary">
    <h2>Karşılaştırma Özeti</h2>
    <p>Toplam Değişiklik: ${result.summary.totalChanges}</p>
    <p>Risk Seviyesi: ${result.summary.riskLevel.toUpperCase()}</p>
    <p>Eklenen: ${result.summary.addedCount} | Silinen: ${result.summary.removedCount} | Değiştirilen: ${result.summary.modifiedCount}</p>
  </div>
  <div class="content">
`;

  // Process paragraphs with change highlighting
  const segments = splitIntoSegments(result.newDocument.content);

  for (const segment of segments) {
    const relatedChange = result.changes.find(
      c => c.newSegment?.id === segment.id || c.originalSegment?.id === segment.id
    );

    if (relatedChange) {
      const severityClass = relatedChange.severity === "critical" || relatedChange.severity === "major"
        ? relatedChange.severity
        : "";

      switch (relatedChange.type) {
        case "added":
          htmlContent += `<p class="added ${severityClass}">${segment.text}</p>\n`;
          htmlContent += `<p class="change-note">[YENİ EKLENDİ]</p>\n`;
          break;
        case "removed":
          htmlContent += `<p class="removed ${severityClass}">${relatedChange.originalText}</p>\n`;
          htmlContent += `<p class="change-note">[SİLİNDİ]</p>\n`;
          break;
        case "modified":
          htmlContent += `<p class="${severityClass}">`;
          htmlContent += `<span class="modified-old">${relatedChange.originalText}</span><br>`;
          htmlContent += `<span class="modified-new">${segment.text}</span>`;
          htmlContent += `</p>\n`;
          htmlContent += `<p class="change-note">[DEĞİŞTİRİLDİ]</p>\n`;
          break;
        default:
          htmlContent += `<p>${segment.text}</p>\n`;
      }
    } else {
      htmlContent += `<p>${segment.text}</p>\n`;
    }
  }

  // Add removed segments that aren't in new document
  for (const change of result.changes.filter(c => c.type === "removed")) {
    if (!change.newSegment) {
      htmlContent += `<p class="removed critical">${change.originalText}</p>\n`;
      htmlContent += `<p class="change-note">[TAMAMEN SİLİNDİ - Orijinal paragraf ${change.originalSegment?.paragraphNumber}]</p>\n`;
    }
  }

  htmlContent += `
  </div>
  <div class="summary">
    <h3>Önemli Bulgular</h3>
    <ul>
      ${result.summary.keyFindings.map(f => `<li>${f}</li>`).join("\n")}
    </ul>
    <h3>Öneriler</h3>
    <ul>
      ${result.summary.recommendations.map(r => `<li>${r}</li>`).join("\n")}
    </ul>
  </div>
</body>
</html>`;

  return {
    content,
    htmlContent,
    changes: result.changes,
    acceptedChanges: [],
    rejectedChanges: [],
  };
}

/**
 * Accept a change in the redline
 */
export function acceptChange(redline: RedlineDocument, changeId: string): RedlineDocument {
  if (!redline.acceptedChanges.includes(changeId)) {
    redline.acceptedChanges.push(changeId);
  }
  // Remove from rejected if it was there
  redline.rejectedChanges = redline.rejectedChanges.filter(id => id !== changeId);
  return redline;
}

/**
 * Reject a change in the redline
 */
export function rejectChange(redline: RedlineDocument, changeId: string): RedlineDocument {
  if (!redline.rejectedChanges.includes(changeId)) {
    redline.rejectedChanges.push(changeId);
  }
  // Remove from accepted if it was there
  redline.acceptedChanges = redline.acceptedChanges.filter(id => id !== changeId);
  return redline;
}

/**
 * Format comparison as text report
 */
export function formatComparisonReport(result: ComparisonResult): string {
  let output = "";

  output += "═══════════════════════════════════════════════════════════\n";
  output += "                BELGE KARŞILAŞTIRMA RAPORU\n";
  output += "═══════════════════════════════════════════════════════════\n\n";

  output += `📄 Orijinal: ${result.originalDocument.name} (${result.originalDocument.wordCount} kelime)\n`;
  output += `📄 Yeni: ${result.newDocument.name} (${result.newDocument.wordCount} kelime)\n\n`;

  // Summary
  output += "📊 ÖZET\n";
  output += "───────────────────────────────────────────────────────────\n";
  output += `   Toplam Değişiklik: ${result.summary.totalChanges}\n`;
  output += `   ├─ Eklenen: ${result.summary.addedCount}\n`;
  output += `   ├─ Silinen: ${result.summary.removedCount}\n`;
  output += `   ├─ Değiştirilen: ${result.summary.modifiedCount}\n`;
  output += `   └─ Biçimsel: ${result.summary.cosmeticChanges}\n\n`;

  const riskEmoji = result.summary.riskLevel === "critical" ? "🔴" :
                    result.summary.riskLevel === "high" ? "🟠" :
                    result.summary.riskLevel === "medium" ? "🟡" : "🟢";
  output += `${riskEmoji} Risk Seviyesi: ${result.summary.riskLevel.toUpperCase()}\n`;
  output += `   Risk Skoru: ${(result.summary.overallRiskScore * 100).toFixed(0)}%\n\n`;

  // Key findings
  if (result.summary.keyFindings.length > 0) {
    output += "🔍 ÖNEMLİ BULGULAR\n";
    output += "───────────────────────────────────────────────────────────\n";
    for (const finding of result.summary.keyFindings) {
      output += `   ${finding}\n`;
    }
    output += "\n";
  }

  // Clause comparisons
  if (result.clauseComparisons.length > 0) {
    output += "📑 MADDE BAZLI KARŞILAŞTIRMA\n";
    output += "───────────────────────────────────────────────────────────\n";

    for (const clause of result.clauseComparisons) {
      const changeIcon = clause.overallChange === "added" ? "➕" :
                         clause.overallChange === "removed" ? "➖" :
                         clause.overallChange === "modified" ? "✏️" : "✓";
      const riskIcon = clause.riskAssessment.level === "critical" ? "🔴" :
                       clause.riskAssessment.level === "major" ? "🟠" :
                       clause.riskAssessment.level === "minor" ? "🟡" : "⚪";

      output += `   ${changeIcon} ${clause.clauseName} ${riskIcon}\n`;
      if (clause.changes.length > 0) {
        output += `      ${clause.changes.length} değişiklik: ${clause.riskAssessment.reason}\n`;
      }
    }
    output += "\n";
  }

  // Detailed changes (critical and major only)
  const importantChanges = result.changes.filter(c => c.severity === "critical" || c.severity === "major");
  if (importantChanges.length > 0) {
    output += "⚠️ ÖNEMLİ DEĞİŞİKLİKLER\n";
    output += "───────────────────────────────────────────────────────────\n";

    for (const change of importantChanges) {
      const typeIcon = change.type === "added" ? "➕" :
                       change.type === "removed" ? "➖" : "✏️";
      output += `\n   ${typeIcon} [${change.severity.toUpperCase()}] ${change.description}\n`;

      if (change.type === "removed" || change.type === "modified") {
        output += `      ESKİ: "${change.originalText.substring(0, 100)}${change.originalText.length > 100 ? "..." : ""}"\n`;
      }
      if (change.type === "added" || change.type === "modified") {
        output += `      YENİ: "${change.newText.substring(0, 100)}${change.newText.length > 100 ? "..." : ""}"\n`;
      }
      if (change.legalImplication) {
        output += `      💡 ${change.legalImplication}\n`;
      }
    }
    output += "\n";
  }

  // Recommendations
  output += "💼 ÖNERİLER\n";
  output += "───────────────────────────────────────────────────────────\n";
  for (const rec of result.summary.recommendations) {
    output += `   • ${rec}\n`;
  }

  output += "\n═══════════════════════════════════════════════════════════\n";
  output += `İşlem Süresi: ${result.processingTimeMs}ms\n`;
  output += `Oluşturulma: ${result.createdAt.toLocaleString("tr-TR")}\n`;

  return output;
}

/**
 * Get all clause categories with names
 */
export function getClauseCategories(): Array<{ id: ClauseCategory; name: string }> {
  return clausePatterns.map(c => ({ id: c.category, name: c.name }));
}

/**
 * Get high-risk patterns info
 */
export function getHighRiskPatterns(): Array<{
  description: string;
  category: ClauseCategory;
  riskLevel: ChangeSeverity;
}> {
  return highRiskPatterns.map(p => ({
    description: p.description,
    category: p.category,
    riskLevel: p.riskLevel,
  }));
}

/**
 * Get change type name in Turkish
 */
export function getChangeTypeName(type: ChangeType): string {
  const names: Record<ChangeType, string> = {
    added: "Ekleme",
    removed: "Silme",
    modified: "Değişiklik",
    moved: "Taşıma",
    formatting: "Biçimlendirme",
    unchanged: "Değişiklik Yok",
  };
  return names[type];
}
