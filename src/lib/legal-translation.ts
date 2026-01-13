/**
 * Legal Translation Module
 *
 * Specialized translation for Turkish legal documents supporting:
 * - Turkish ↔ English
 * - Turkish ↔ German
 * - English ↔ German
 *
 * Features:
 * - Legal terminology preservation
 * - Citation format conversion
 * - Legal system context adaptation
 * - Certified translation support
 * - Parallel text generation
 */

export type SupportedLanguage = "tr" | "en" | "de";

export interface TranslationResult {
  id: string;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  sourceText: string;
  translatedText: string;
  segments: TranslationSegment[];
  terminology: TerminologyMatch[];
  citationConversions: CitationConversion[];
  qualityScore: number;
  warnings: TranslationWarning[];
  metadata: TranslationMetadata;
  processingTimeMs: number;
}

export interface TranslationSegment {
  id: string;
  sourceText: string;
  translatedText: string;
  confidence: number;
  alternatives?: string[];
  notes?: string;
  isLegalTerm: boolean;
}

export interface TerminologyMatch {
  sourceTerm: string;
  translatedTerm: string;
  definition?: string;
  legalContext: string;
  confidence: number;
}

export interface CitationConversion {
  originalCitation: string;
  convertedCitation: string;
  citationType: "law" | "case" | "regulation" | "treaty";
  notes?: string;
}

export interface TranslationWarning {
  type: "terminology" | "legal_system" | "cultural" | "ambiguity";
  severity: "low" | "medium" | "high";
  message: string;
  suggestion?: string;
  affectedText?: string;
}

export interface TranslationMetadata {
  documentType?: string;
  wordCount: {
    source: number;
    target: number;
  };
  isCertified: boolean;
  translatorNotes: string[];
  legalDisclaimer: string;
}

export interface TranslationOptions {
  preserveFormatting?: boolean;
  includeTechnicalTerms?: boolean;
  targetAudience?: "legal_professional" | "general" | "court";
  certifiedTranslation?: boolean;
  includeAlternatives?: boolean;
  adaptToLegalSystem?: boolean;
}

// Legal terminology dictionaries
const LEGAL_TERMINOLOGY_TR_EN: Record<string, { term: string; context?: string }> = {
  // Court and procedure terms
  "mahkeme": { term: "court", context: "judicial body" },
  "davacı": { term: "plaintiff", context: "civil case initiator" },
  "davalı": { term: "defendant", context: "civil case respondent" },
  "sanık": { term: "defendant/accused", context: "criminal case" },
  "müşteki": { term: "complainant", context: "criminal case" },
  "tanık": { term: "witness", context: "legal proceeding" },
  "bilirkişi": { term: "expert witness", context: "court-appointed expert" },
  "avukat": { term: "attorney/lawyer", context: "legal representative" },
  "vekil": { term: "representative/counsel", context: "legal proceeding" },
  "savcı": { term: "prosecutor", context: "criminal case" },
  "hakim": { term: "judge", context: "judicial officer" },
  "yargıç": { term: "judge", context: "judicial officer" },
  "karar": { term: "decision/judgment", context: "court ruling" },
  "hüküm": { term: "verdict/sentence", context: "final decision" },
  "temyiz": { term: "appeal", context: "higher court review" },
  "istinaf": { term: "appellate review", context: "regional appeal" },
  "itiraz": { term: "objection", context: "procedural challenge" },
  "dava": { term: "lawsuit/case", context: "legal proceeding" },
  "duruşma": { term: "hearing", context: "court session" },
  "celp": { term: "summons", context: "court order to appear" },
  "tebligat": { term: "legal notification/service", context: "official delivery" },
  "dilekçe": { term: "petition/motion", context: "written application" },
  "cevap dilekçesi": { term: "answer/response", context: "defendant's reply" },
  "iddianame": { term: "indictment", context: "criminal charge document" },
  "mütalaa": { term: "opinion/recommendation", context: "prosecutor's view" },
  "keşif": { term: "inspection/discovery", context: "evidence gathering" },
  "delil": { term: "evidence", context: "proof" },
  "ispat": { term: "proof/burden of proof", context: "evidence standard" },
  "yemin": { term: "oath", context: "sworn statement" },

  // Contract terms
  "sözleşme": { term: "contract/agreement", context: "legal agreement" },
  "akit": { term: "contract/covenant", context: "formal agreement" },
  "protokol": { term: "protocol/memorandum", context: "formal agreement" },
  "taraf": { term: "party", context: "contracting party" },
  "edim": { term: "performance/obligation", context: "contractual duty" },
  "borç": { term: "debt/obligation", context: "legal duty" },
  "alacak": { term: "receivable/claim", context: "legal right" },
  "temerrüt": { term: "default", context: "failure to perform" },
  "fesih": { term: "termination/rescission", context: "contract ending" },
  "cayma": { term: "withdrawal/rescission", context: "contract cancellation" },
  "cezai şart": { term: "penalty clause", context: "liquidated damages" },
  "teminat": { term: "security/collateral", context: "guarantee" },
  "kefalet": { term: "suretyship/guarantee", context: "third-party guarantee" },
  "ipotek": { term: "mortgage", context: "real property security" },
  "rehin": { term: "pledge", context: "movable property security" },
  "vekâletname": { term: "power of attorney", context: "authorization document" },

  // Property terms
  "mülkiyet": { term: "ownership/property", context: "property right" },
  "taşınmaz": { term: "immovable property/real estate", context: "land and buildings" },
  "taşınır": { term: "movable property/chattel", context: "personal property" },
  "zilyetlik": { term: "possession", context: "physical control" },
  "irtifak hakkı": { term: "easement/servitude", context: "limited property right" },
  "intifa hakkı": { term: "usufruct", context: "use and benefit right" },
  "tapu": { term: "title deed/land registry", context: "property registration" },
  "kadastro": { term: "cadastre/land survey", context: "property mapping" },

  // Corporate terms
  "şirket": { term: "company", context: "business entity" },
  "anonim şirket": { term: "joint stock company", context: "corporation" },
  "limited şirket": { term: "limited liability company", context: "LLC" },
  "ortaklık": { term: "partnership", context: "business association" },
  "hissedar": { term: "shareholder", context: "stock owner" },
  "yönetim kurulu": { term: "board of directors", context: "corporate governance" },
  "genel kurul": { term: "general assembly", context: "shareholder meeting" },
  "sermaye": { term: "capital", context: "company funds" },
  "iflas": { term: "bankruptcy", context: "insolvency proceeding" },
  "konkordato": { term: "concordat/composition", context: "debt restructuring" },
  "tasfiye": { term: "liquidation", context: "company dissolution" },

  // Criminal law terms
  "suç": { term: "crime/offense", context: "criminal act" },
  "ceza": { term: "punishment/penalty", context: "criminal sanction" },
  "hapis": { term: "imprisonment", context: "incarceration" },
  "tutuklama": { term: "detention/arrest", context: "pretrial custody" },
  "gözaltı": { term: "police custody", context: "temporary detention" },
  "beraat": { term: "acquittal", context: "not guilty verdict" },
  "mahkumiyet": { term: "conviction", context: "guilty verdict" },
  "tecil": { term: "suspension/deferral", context: "postponed sentence" },
  "erteleme": { term: "suspension/postponement", context: "delayed execution" },
  "af": { term: "amnesty/pardon", context: "forgiveness of crime" },
  "zamanaşımı": { term: "statute of limitations", context: "time bar" },

  // Family law terms
  "evlilik": { term: "marriage", context: "matrimony" },
  "boşanma": { term: "divorce", context: "marriage dissolution" },
  "nafaka": { term: "alimony/maintenance", context: "spousal support" },
  "velayet": { term: "custody", context: "parental rights" },
  "vesayet": { term: "guardianship", context: "legal protection" },
  "miras": { term: "inheritance/estate", context: "succession" },
  "vasiyet": { term: "will/testament", context: "testamentary document" },
  "tereke": { term: "estate", context: "deceased's property" },

  // Employment law terms
  "iş sözleşmesi": { term: "employment contract", context: "labor agreement" },
  "işveren": { term: "employer", context: "employing party" },
  "işçi": { term: "employee/worker", context: "employed party" },
  "kıdem tazminatı": { term: "severance pay", context: "termination benefit" },
  "ihbar tazminatı": { term: "notice pay", context: "termination notice" },
  "fazla mesai": { term: "overtime", context: "extra working hours" },
  "toplu iş sözleşmesi": { term: "collective bargaining agreement", context: "union contract" },
  "grev": { term: "strike", context: "work stoppage" },
  "lokavt": { term: "lockout", context: "employer closure" },
};

const LEGAL_TERMINOLOGY_TR_DE: Record<string, { term: string; context?: string }> = {
  // Court and procedure terms
  "mahkeme": { term: "Gericht", context: "Gerichtsbehörde" },
  "davacı": { term: "Kläger", context: "Zivilverfahren" },
  "davalı": { term: "Beklagter", context: "Zivilverfahren" },
  "sanık": { term: "Angeklagter", context: "Strafverfahren" },
  "tanık": { term: "Zeuge", context: "Gerichtsverfahren" },
  "avukat": { term: "Rechtsanwalt", context: "Rechtsbeistand" },
  "savcı": { term: "Staatsanwalt", context: "Strafverfahren" },
  "hakim": { term: "Richter", context: "Gerichtsbeamter" },
  "karar": { term: "Entscheidung/Urteil", context: "Gerichtsentscheidung" },
  "hüküm": { term: "Urteil", context: "Endentscheidung" },
  "temyiz": { term: "Revision", context: "Rechtsmittel" },
  "itiraz": { term: "Einspruch", context: "Verfahrensanfechtung" },
  "dava": { term: "Klage/Verfahren", context: "Rechtsstreit" },
  "duruşma": { term: "Verhandlung", context: "Gerichtssitzung" },
  "dilekçe": { term: "Antrag/Schriftsatz", context: "schriftlicher Antrag" },
  "delil": { term: "Beweis", context: "Beweismittel" },

  // Contract terms
  "sözleşme": { term: "Vertrag", context: "rechtliche Vereinbarung" },
  "taraf": { term: "Partei", context: "Vertragspartei" },
  "borç": { term: "Schuld/Verbindlichkeit", context: "rechtliche Pflicht" },
  "fesih": { term: "Kündigung", context: "Vertragsbeendigung" },
  "teminat": { term: "Sicherheit", context: "Garantie" },
  "ipotek": { term: "Hypothek", context: "Grundpfandrecht" },
  "vekâletname": { term: "Vollmacht", context: "Ermächtigungsdokument" },

  // Property terms
  "mülkiyet": { term: "Eigentum", context: "Eigentumsrecht" },
  "taşınmaz": { term: "Immobilie/Grundstück", context: "unbewegliches Vermögen" },
  "tapu": { term: "Grundbuch", context: "Eigentumsregister" },

  // Corporate terms
  "şirket": { term: "Gesellschaft", context: "Unternehmen" },
  "anonim şirket": { term: "Aktiengesellschaft (AG)", context: "Kapitalgesellschaft" },
  "limited şirket": { term: "GmbH", context: "Gesellschaft mit beschränkter Haftung" },
  "iflas": { term: "Insolvenz", context: "Zahlungsunfähigkeit" },

  // Criminal law terms
  "suç": { term: "Straftat", context: "strafbare Handlung" },
  "ceza": { term: "Strafe", context: "Sanktion" },
  "hapis": { term: "Freiheitsstrafe", context: "Haft" },
  "beraat": { term: "Freispruch", context: "Unschuldsvermutung" },

  // Family law terms
  "evlilik": { term: "Ehe", context: "Eheschließung" },
  "boşanma": { term: "Scheidung", context: "Eheauflösung" },
  "nafaka": { term: "Unterhalt", context: "Unterhaltsleistung" },
  "velayet": { term: "Sorgerecht", context: "elterliche Sorge" },
  "miras": { term: "Erbschaft", context: "Erbfolge" },
};

const LEGAL_TERMINOLOGY_EN_DE: Record<string, { term: string; context?: string }> = {
  "court": { term: "Gericht", context: "judicial body" },
  "plaintiff": { term: "Kläger", context: "civil case" },
  "defendant": { term: "Beklagter", context: "civil case" },
  "contract": { term: "Vertrag", context: "legal agreement" },
  "judgment": { term: "Urteil", context: "court decision" },
  "appeal": { term: "Berufung/Revision", context: "higher court review" },
  "evidence": { term: "Beweis", context: "proof" },
  "witness": { term: "Zeuge", context: "testimony provider" },
  "attorney": { term: "Rechtsanwalt", context: "legal representative" },
  "prosecution": { term: "Staatsanwaltschaft", context: "criminal case" },
  "acquittal": { term: "Freispruch", context: "not guilty" },
  "conviction": { term: "Verurteilung", context: "guilty verdict" },
  "liability": { term: "Haftung", context: "legal responsibility" },
  "negligence": { term: "Fahrlässigkeit", context: "tort law" },
  "damages": { term: "Schadensersatz", context: "compensation" },
  "injunction": { term: "einstweilige Verfügung", context: "court order" },
  "bankruptcy": { term: "Insolvenz", context: "insolvency" },
  "arbitration": { term: "Schiedsgerichtsbarkeit", context: "alternative dispute resolution" },
  "mediation": { term: "Mediation", context: "alternative dispute resolution" },
};

// Citation format patterns
const CITATION_PATTERNS = {
  turkish: {
    law: /(?:(\d+)\s*sayılı\s*)?([^,]+)\s*(?:m\.|madde)\s*(\d+)(?:\/(\d+))?/gi,
    case: /(?:Yargıtay|AYM|Danıştay)\s*(\d+)\.\s*(?:H\.?D\.?|Ceza\s*Dairesi)\s*(\d{4})\/(\d+)\s*E\.\s*(\d{4})\/(\d+)\s*K\./gi,
  },
  english: {
    case: /(\d+)\s+([A-Z][a-z]+\.?\s*)+(\d+)/g, // e.g., "123 U.S. 456"
    statute: /(\d+)\s*U\.S\.C\.\s*§\s*(\d+)/gi,
  },
  german: {
    law: /§\s*(\d+)(?:\s*Abs\.\s*(\d+))?\s*([A-Z]{2,})/gi,
    case: /(\d+)\s*([A-Z]+)\s*(\d+)\/(\d+)/gi,
  },
};

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Translate legal document
 */
export async function translateLegalDocument(
  text: string,
  sourceLanguage: SupportedLanguage,
  targetLanguage: SupportedLanguage,
  options: TranslationOptions = {}
): Promise<TranslationResult> {
  const startTime = Date.now();

  const {
    preserveFormatting = true,
    includeTechnicalTerms = true,
    targetAudience = "legal_professional",
    certifiedTranslation = false,
    includeAlternatives = false,
    adaptToLegalSystem = true,
  } = options;

  // Get terminology dictionary
  const terminology = getTerminologyDictionary(sourceLanguage, targetLanguage);

  // Segment text for translation
  const segments = segmentText(text);

  // Translate each segment
  const translatedSegments = segments.map((segment) =>
    translateSegment(segment, sourceLanguage, targetLanguage, terminology, includeAlternatives)
  );

  // Find and record terminology matches
  const terminologyMatches = findTerminologyMatches(text, terminology, sourceLanguage);

  // Convert citations
  const citationConversions = adaptToLegalSystem
    ? convertCitations(text, sourceLanguage, targetLanguage)
    : [];

  // Generate warnings
  const warnings = generateTranslationWarnings(
    text,
    translatedSegments,
    sourceLanguage,
    targetLanguage
  );

  // Combine translated segments
  const translatedText = combineSegments(translatedSegments, preserveFormatting);

  // Calculate quality score
  const qualityScore = calculateTranslationQuality(translatedSegments, warnings);

  // Generate metadata
  const metadata: TranslationMetadata = {
    wordCount: {
      source: countWords(text),
      target: countWords(translatedText),
    },
    isCertified: certifiedTranslation,
    translatorNotes: generateTranslatorNotes(warnings, targetAudience),
    legalDisclaimer: getLegalDisclaimer(targetLanguage, certifiedTranslation),
  };

  return {
    id: generateId("trans"),
    sourceLanguage,
    targetLanguage,
    sourceText: text,
    translatedText,
    segments: translatedSegments,
    terminology: terminologyMatches,
    citationConversions,
    qualityScore,
    warnings,
    metadata,
    processingTimeMs: Date.now() - startTime,
  };
}

/**
 * Get terminology dictionary for language pair
 */
function getTerminologyDictionary(
  source: SupportedLanguage,
  target: SupportedLanguage
): Record<string, { term: string; context?: string }> {
  if (source === "tr" && target === "en") {
    return LEGAL_TERMINOLOGY_TR_EN;
  }
  if (source === "en" && target === "tr") {
    return invertDictionary(LEGAL_TERMINOLOGY_TR_EN);
  }
  if (source === "tr" && target === "de") {
    return LEGAL_TERMINOLOGY_TR_DE;
  }
  if (source === "de" && target === "tr") {
    return invertDictionary(LEGAL_TERMINOLOGY_TR_DE);
  }
  if (source === "en" && target === "de") {
    return LEGAL_TERMINOLOGY_EN_DE;
  }
  if (source === "de" && target === "en") {
    return invertDictionary(LEGAL_TERMINOLOGY_EN_DE);
  }
  return {};
}

/**
 * Invert terminology dictionary
 */
function invertDictionary(
  dict: Record<string, { term: string; context?: string }>
): Record<string, { term: string; context?: string }> {
  const inverted: Record<string, { term: string; context?: string }> = {};
  for (const [key, value] of Object.entries(dict)) {
    const mainTerm = value.term.split("/")[0].trim();
    inverted[mainTerm.toLowerCase()] = { term: key, context: value.context };
  }
  return inverted;
}

/**
 * Segment text for translation
 */
function segmentText(text: string): string[] {
  // Split by sentences and paragraphs
  const segments = text
    .split(/(?<=[.!?])\s+|\n{2,}/)
    .filter((s) => s.trim().length > 0);

  return segments;
}

/**
 * Translate a single segment
 */
function translateSegment(
  segment: string,
  source: SupportedLanguage,
  target: SupportedLanguage,
  terminology: Record<string, { term: string; context?: string }>,
  includeAlternatives: boolean
): TranslationSegment {
  let translatedText = segment;
  let isLegalTerm = false;
  const alternatives: string[] = [];

  // Apply terminology replacements
  for (const [term, translation] of Object.entries(terminology)) {
    const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, "gi");
    if (regex.test(segment)) {
      isLegalTerm = true;
      translatedText = translatedText.replace(regex, translation.term);

      if (includeAlternatives && translation.term.includes("/")) {
        const altTerms = translation.term.split("/").map((t) => t.trim());
        for (const alt of altTerms.slice(1)) {
          alternatives.push(segment.replace(regex, alt));
        }
      }
    }
  }

  // Simulate additional translation for non-terminology words
  // In production, this would call an actual translation API
  translatedText = simulateTranslation(translatedText, source, target);

  return {
    id: generateId("seg"),
    sourceText: segment,
    translatedText,
    confidence: isLegalTerm ? 0.95 : 0.85,
    alternatives: alternatives.length > 0 ? alternatives : undefined,
    isLegalTerm,
  };
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Simulate translation (placeholder for actual translation API)
 */
function simulateTranslation(
  text: string,
  source: SupportedLanguage,
  target: SupportedLanguage
): string {
  // In production, this would use a translation API
  // For now, return the text with terminology already applied
  return text;
}

/**
 * Find terminology matches in text
 */
function findTerminologyMatches(
  text: string,
  terminology: Record<string, { term: string; context?: string }>,
  sourceLanguage: SupportedLanguage
): TerminologyMatch[] {
  const matches: TerminologyMatch[] = [];
  const lowerText = text.toLowerCase();

  for (const [term, translation] of Object.entries(terminology)) {
    if (lowerText.includes(term.toLowerCase())) {
      matches.push({
        sourceTerm: term,
        translatedTerm: translation.term,
        definition: translation.context,
        legalContext: getLegalContext(term, sourceLanguage),
        confidence: 0.9,
      });
    }
  }

  return matches;
}

/**
 * Get legal context for a term
 */
function getLegalContext(term: string, language: SupportedLanguage): string {
  const contexts: Record<string, string> = {
    mahkeme: "Yargı sistemi",
    sözleşme: "Borçlar hukuku",
    mülkiyet: "Eşya hukuku",
    şirket: "Ticaret hukuku",
    suç: "Ceza hukuku",
    evlilik: "Aile hukuku",
    court: "Judicial system",
    contract: "Contract law",
    property: "Property law",
    company: "Corporate law",
    crime: "Criminal law",
    Gericht: "Justizsystem",
    Vertrag: "Vertragsrecht",
  };

  return contexts[term.toLowerCase()] || "Genel hukuk";
}

/**
 * Convert legal citations between jurisdictions
 */
function convertCitations(
  text: string,
  source: SupportedLanguage,
  target: SupportedLanguage
): CitationConversion[] {
  const conversions: CitationConversion[] = [];

  if (source === "tr") {
    // Convert Turkish law citations
    let match;
    const lawPattern = CITATION_PATTERNS.turkish.law;
    while ((match = lawPattern.exec(text)) !== null) {
      const originalCitation = match[0];
      let converted: string;

      if (target === "en") {
        converted = `Art. ${match[3]}${match[4] ? `/${match[4]}` : ""} of the ${match[2]}${match[1] ? ` (Law No. ${match[1]})` : ""}`;
      } else {
        converted = `§ ${match[3]}${match[4] ? ` Abs. ${match[4]}` : ""} ${match[2]}${match[1] ? ` (Gesetz Nr. ${match[1]})` : ""}`;
      }

      conversions.push({
        originalCitation,
        convertedCitation: converted,
        citationType: "law",
        notes: "Turkish law citation converted to target format",
      });
    }
  }

  return conversions;
}

/**
 * Generate translation warnings
 */
function generateTranslationWarnings(
  sourceText: string,
  segments: TranslationSegment[],
  source: SupportedLanguage,
  target: SupportedLanguage
): TranslationWarning[] {
  const warnings: TranslationWarning[] = [];

  // Check for low confidence segments
  const lowConfidenceSegments = segments.filter((s) => s.confidence < 0.8);
  if (lowConfidenceSegments.length > 0) {
    warnings.push({
      type: "terminology",
      severity: "medium",
      message: `${lowConfidenceSegments.length} segment(s) translated with lower confidence`,
      suggestion: "Review these segments for accuracy",
    });
  }

  // Check for legal system differences
  if (source === "tr" && (target === "en" || target === "de")) {
    if (/icra|haciz/i.test(sourceText)) {
      warnings.push({
        type: "legal_system",
        severity: "high",
        message: "Turkish execution/enforcement terms may not have direct equivalents",
        suggestion: "Consider adding explanatory notes for the target jurisdiction",
        affectedText: "icra/haciz",
      });
    }
  }

  // Check for culturally specific terms
  if (/KVKK|kişisel veri/i.test(sourceText) && target !== "tr") {
    warnings.push({
      type: "cultural",
      severity: "medium",
      message: "KVKK (Turkish Data Protection Law) references should be explained",
      suggestion: "Add note comparing to GDPR or equivalent regulations",
    });
  }

  // Check for ambiguous terms
  const ambiguousTerms = ["hak", "borç", "edim"];
  for (const term of ambiguousTerms) {
    if (sourceText.toLowerCase().includes(term)) {
      warnings.push({
        type: "ambiguity",
        severity: "low",
        message: `Term '${term}' may have multiple translations depending on context`,
        suggestion: "Verify the correct meaning in context",
        affectedText: term,
      });
    }
  }

  return warnings;
}

/**
 * Combine translated segments
 */
function combineSegments(
  segments: TranslationSegment[],
  preserveFormatting: boolean
): string {
  if (preserveFormatting) {
    return segments.map((s) => s.translatedText).join("\n\n");
  }
  return segments.map((s) => s.translatedText).join(" ");
}

/**
 * Calculate translation quality score
 */
function calculateTranslationQuality(
  segments: TranslationSegment[],
  warnings: TranslationWarning[]
): number {
  const avgConfidence =
    segments.reduce((sum, s) => sum + s.confidence, 0) / segments.length;

  const warningPenalty =
    warnings.reduce((sum, w) => {
      if (w.severity === "high") return sum + 0.1;
      if (w.severity === "medium") return sum + 0.05;
      return sum + 0.02;
    }, 0);

  return Math.max(0, Math.min(1, avgConfidence - warningPenalty));
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

/**
 * Generate translator notes
 */
function generateTranslatorNotes(
  warnings: TranslationWarning[],
  audience: TranslationOptions["targetAudience"]
): string[] {
  const notes: string[] = [];

  for (const warning of warnings) {
    if (warning.severity === "high" || audience === "court") {
      notes.push(`${warning.message}${warning.suggestion ? ` - ${warning.suggestion}` : ""}`);
    }
  }

  return notes;
}

/**
 * Get legal disclaimer for translation
 */
function getLegalDisclaimer(
  language: SupportedLanguage,
  certified: boolean
): string {
  const disclaimers: Record<SupportedLanguage, { standard: string; certified: string }> = {
    tr: {
      standard:
        "Bu çeviri bilgilendirme amaçlıdır ve resmi bir tercüme yerine geçmez. Hukuki işlemler için yeminli tercümana başvurunuz.",
      certified:
        "Bu tercüme, yeminli tercüman tarafından hazırlanmış olup, aslına uygun olduğu tasdik edilmiştir.",
    },
    en: {
      standard:
        "This translation is for informational purposes only and does not replace an official certified translation. For legal proceedings, please consult a certified translator.",
      certified:
        "This translation has been prepared by a certified translator and is certified to be a true and accurate translation of the original document.",
    },
    de: {
      standard:
        "Diese Übersetzung dient nur zu Informationszwecken und ersetzt keine beglaubigte Übersetzung. Für Rechtsverfahren wenden Sie sich bitte an einen vereidigten Übersetzer.",
      certified:
        "Diese Übersetzung wurde von einem vereidigten Übersetzer erstellt und als wahrheitsgetreue und genaue Übersetzung des Originaldokuments bestätigt.",
    },
  };

  return certified
    ? disclaimers[language].certified
    : disclaimers[language].standard;
}

/**
 * Get supported language pairs
 */
export function getSupportedLanguagePairs(): Array<{
  source: SupportedLanguage;
  target: SupportedLanguage;
  name: string;
}> {
  return [
    { source: "tr", target: "en", name: "Türkçe → İngilizce" },
    { source: "en", target: "tr", name: "İngilizce → Türkçe" },
    { source: "tr", target: "de", name: "Türkçe → Almanca" },
    { source: "de", target: "tr", name: "Almanca → Türkçe" },
    { source: "en", target: "de", name: "İngilizce → Almanca" },
    { source: "de", target: "en", name: "Almanca → İngilizce" },
  ];
}

/**
 * Get language name in Turkish
 */
export function getLanguageName(code: SupportedLanguage): string {
  const names: Record<SupportedLanguage, string> = {
    tr: "Türkçe",
    en: "İngilizce",
    de: "Almanca",
  };
  return names[code];
}

/**
 * Translate a single legal term
 */
export function translateLegalTerm(
  term: string,
  source: SupportedLanguage,
  target: SupportedLanguage
): { translation: string; context?: string } | null {
  const dictionary = getTerminologyDictionary(source, target);
  const lowerTerm = term.toLowerCase();

  if (dictionary[lowerTerm]) {
    return {
      translation: dictionary[lowerTerm].term,
      context: dictionary[lowerTerm].context,
    };
  }

  return null;
}

/**
 * Get terminology count for language pair
 */
export function getTerminologyCount(
  source: SupportedLanguage,
  target: SupportedLanguage
): number {
  const dictionary = getTerminologyDictionary(source, target);
  return Object.keys(dictionary).length;
}

/**
 * Format translation result as summary
 */
export function formatTranslationSummary(result: TranslationResult): string {
  const lines: string[] = [];

  lines.push(`## Çeviri Özeti`);
  lines.push(``);
  lines.push(
    `**Kaynak Dil:** ${getLanguageName(result.sourceLanguage)}`
  );
  lines.push(
    `**Hedef Dil:** ${getLanguageName(result.targetLanguage)}`
  );
  lines.push(`**Kalite Skoru:** %${Math.round(result.qualityScore * 100)}`);
  lines.push(``);

  lines.push(`### İstatistikler`);
  lines.push(`- Kaynak kelime sayısı: ${result.metadata.wordCount.source}`);
  lines.push(`- Hedef kelime sayısı: ${result.metadata.wordCount.target}`);
  lines.push(`- Çeviri segmenti: ${result.segments.length}`);
  lines.push(`- Hukuki terim eşleşmesi: ${result.terminology.length}`);

  if (result.citationConversions.length > 0) {
    lines.push(``);
    lines.push(`### Atıf Dönüşümleri`);
    for (const conv of result.citationConversions) {
      lines.push(`- ${conv.originalCitation} → ${conv.convertedCitation}`);
    }
  }

  if (result.warnings.length > 0) {
    lines.push(``);
    lines.push(`### Uyarılar`);
    for (const warning of result.warnings) {
      lines.push(`- [${warning.severity.toUpperCase()}] ${warning.message}`);
    }
  }

  lines.push(``);
  lines.push(`*${result.metadata.legalDisclaimer}*`);
  lines.push(``);
  lines.push(`*İşlem süresi: ${result.processingTimeMs}ms*`);

  return lines.join("\n");
}
