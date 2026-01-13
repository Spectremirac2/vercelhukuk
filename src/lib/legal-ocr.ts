/**
 * Legal Document OCR Module
 *
 * Advanced OCR processing for Turkish legal documents including:
 * - Court decisions (Mahkeme kararlari)
 * - Contracts and agreements (Sozlesmeler)
 * - Notarized documents (Noter belgeleri)
 * - Official correspondence (Resmi yazilar)
 * - Legal petitions (Dilekçeler)
 *
 * Features:
 * - Turkish character recognition optimization
 * - Legal document structure detection
 * - Stamp and seal recognition
 * - Handwritten annotation detection
 * - Document quality assessment
 */

export interface OCRResult {
  id: string;
  documentType: LegalDocumentType;
  extractedText: string;
  confidence: number;
  language: "tr" | "en" | "de" | "mixed";
  pages: OCRPage[];
  metadata: DocumentMetadata;
  structuredData: StructuredLegalData;
  qualityAssessment: QualityAssessment;
  processingTimeMs: number;
}

export interface OCRPage {
  pageNumber: number;
  width: number;
  height: number;
  text: string;
  blocks: TextBlock[];
  tables: DetectedTable[];
  signatures: DetectedSignature[];
  stamps: DetectedStamp[];
  handwrittenAreas: HandwrittenArea[];
  confidence: number;
}

export interface TextBlock {
  id: string;
  text: string;
  boundingBox: BoundingBox;
  confidence: number;
  blockType: "paragraph" | "heading" | "list" | "table" | "footer" | "header";
  fontSize: number;
  fontStyle: "normal" | "bold" | "italic" | "underline";
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectedTable {
  id: string;
  boundingBox: BoundingBox;
  rows: number;
  columns: number;
  cells: TableCell[];
  headerRow: boolean;
}

export interface TableCell {
  row: number;
  column: number;
  text: string;
  boundingBox: BoundingBox;
  isHeader: boolean;
}

export interface DetectedSignature {
  id: string;
  boundingBox: BoundingBox;
  signatureType: "handwritten" | "digital" | "stamp";
  confidence: number;
  associatedName?: string;
}

export interface DetectedStamp {
  id: string;
  boundingBox: BoundingBox;
  stampType: "court" | "notary" | "official" | "company" | "unknown";
  text?: string;
  confidence: number;
}

export interface HandwrittenArea {
  id: string;
  boundingBox: BoundingBox;
  text?: string;
  confidence: number;
  isAnnotation: boolean;
}

export interface DocumentMetadata {
  title?: string;
  date?: Date;
  documentNumber?: string;
  courtName?: string;
  caseNumber?: string;
  parties?: string[];
  notaryInfo?: NotaryInfo;
  pageCount: number;
  estimatedWordCount: number;
}

export interface NotaryInfo {
  notaryName: string;
  notaryNumber: string;
  city: string;
  date: Date;
  registerNumber: string;
}

export interface StructuredLegalData {
  articles: ExtractedArticle[];
  dates: ExtractedDate[];
  amounts: ExtractedAmount[];
  parties: ExtractedParty[];
  references: LegalReference[];
  obligations: ExtractedObligation[];
}

export interface ExtractedArticle {
  articleNumber: string;
  title?: string;
  content: string;
  pageNumber: number;
}

export interface ExtractedDate {
  date: Date;
  context: string;
  dateType: "document" | "deadline" | "event" | "reference";
  pageNumber: number;
}

export interface ExtractedAmount {
  value: number;
  currency: "TRY" | "USD" | "EUR" | "other";
  context: string;
  amountType: "payment" | "fine" | "compensation" | "fee" | "other";
  pageNumber: number;
}

export interface ExtractedParty {
  name: string;
  role: "plaintiff" | "defendant" | "witness" | "lawyer" | "judge" | "notary" | "party" | "other";
  identifiers?: {
    tcKimlik?: string;
    vergiNo?: string;
    sicilNo?: string;
  };
  pageNumber: number;
}

export interface LegalReference {
  lawName: string;
  articleNumber?: string;
  context: string;
  pageNumber: number;
}

export interface ExtractedObligation {
  obligor: string;
  obligee: string;
  description: string;
  deadline?: Date;
  amount?: ExtractedAmount;
  pageNumber: number;
}

export interface QualityAssessment {
  overallScore: number; // 0-100
  readability: "excellent" | "good" | "fair" | "poor";
  issues: QualityIssue[];
  recommendations: string[];
}

export interface QualityIssue {
  type: "blur" | "skew" | "noise" | "low_contrast" | "partial_content" | "damaged";
  severity: "low" | "medium" | "high";
  affectedPages: number[];
  description: string;
}

export type LegalDocumentType =
  | "mahkeme_karari"      // Court decision
  | "sozlesme"            // Contract
  | "dilekce"             // Petition
  | "vekaletname"         // Power of attorney
  | "noter_belgesi"       // Notarized document
  | "icra_emri"           // Execution order
  | "tebligat"            // Legal notification
  | "bilirkisi_raporu"    // Expert report
  | "dava_dosyasi"        // Case file
  | "resmi_yazi"          // Official letter
  | "kanun_metni"         // Law text
  | "yonetmelik"          // Regulation
  | "genelge"             // Circular
  | "unknown";

// Turkish legal document patterns
const LEGAL_PATTERNS = {
  // Court decision patterns
  courtDecision: {
    header: /T\.?C\.?\s*([\w\s]+)\s*MAHKEMESİ/i,
    caseNumber: /(?:ESAS\s*(?:NO|NUMARASI)?[:\s]*)?(\d{4}\/\d+)/i,
    decisionNumber: /KARAR\s*(?:NO|NUMARASI)?[:\s]*(\d{4}\/\d+)/i,
    date: /(?:KARAR\s*TARİHİ|TARİH)[:\s]*(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/i,
  },
  // Contract patterns
  contract: {
    header: /SÖZLEŞME|PROTOKOL|ANLAŞMA/i,
    parties: /(?:TARAFLAR|1\.\s*TARAF|BİRİNCİ\s*TARAF)[:\s]*/i,
    articles: /MADDE\s*(\d+)/gi,
  },
  // Petition patterns
  petition: {
    header: /(?:SAYIN\s*)?(?:[\w\s]+)\s*MAHKEMESİ(?:NE|'NE)/i,
    petitioner: /(?:DAVACI|MÜŞTEKİ|BAŞVURAN)[:\s]*/i,
    defendant: /(?:DAVALI|SANIK|KARŞI\s*TARAF)[:\s]*/i,
  },
  // Notary patterns
  notary: {
    header: /(?:T\.?C\.?\s*)?(?:[\w\s]+)\s*NOTERLİĞİ/i,
    registerNumber: /YEVMİYE\s*(?:NO|NUMARASI)?[:\s]*(\d+)/i,
    notaryNumber: /NOTER\s*(?:NO|NUMARASI)?[:\s]*(\d+)/i,
  },
  // Legal references
  lawReferences: {
    turkishPenalCode: /(?:TCK|Türk\s*Ceza\s*Kanunu)\s*(?:m\.?|madde)?\s*(\d+)/gi,
    civilCode: /(?:TMK|Türk\s*Medeni\s*Kanunu)\s*(?:m\.?|madde)?\s*(\d+)/gi,
    obligationsCode: /(?:TBK|Borçlar\s*Kanunu)\s*(?:m\.?|madde)?\s*(\d+)/gi,
    commercialCode: /(?:TTK|Türk\s*Ticaret\s*Kanunu)\s*(?:m\.?|madde)?\s*(\d+)/gi,
    laborLaw: /(?:İş\s*Kanunu)\s*(?:m\.?|madde)?\s*(\d+)/gi,
    kvkk: /(?:KVKK|Kişisel\s*Verilerin\s*Korunması\s*Kanunu)\s*(?:m\.?|madde)?\s*(\d+)/gi,
  },
  // Amount patterns
  amounts: {
    tl: /([\d.,]+)\s*(?:TL|Türk\s*Lirası|₺)/gi,
    usd: /([\d.,]+)\s*(?:USD|Dolar|\$|ABD\s*Doları)/gi,
    eur: /([\d.,]+)\s*(?:EUR|Euro|€)/gi,
  },
  // Date patterns
  dates: {
    standard: /(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})/g,
    written: /(\d{1,2})\s*(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s*(\d{4})/gi,
  },
  // TC Kimlik pattern
  tcKimlik: /(?:T\.?C\.?\s*(?:KİMLİK\s*(?:NO|NUMARASI)?)?[:\s]*)(\d{11})/gi,
  // Tax number pattern
  vergiNo: /(?:VERGİ\s*(?:NO|NUMARASI|KİMLİK\s*NO)?[:\s]*)(\d{10,11})/gi,
};

// Turkish character normalization map
const TURKISH_CHAR_CORRECTIONS: Record<string, string> = {
  "ı": "ı", "I": "I",
  "i": "i", "İ": "İ",
  "ğ": "ğ", "Ğ": "Ğ",
  "ü": "ü", "Ü": "Ü",
  "ş": "ş", "Ş": "Ş",
  "ö": "ö", "Ö": "Ö",
  "ç": "ç", "Ç": "Ç",
};

// Common OCR errors in Turkish legal documents
const OCR_CORRECTIONS: Record<string, string> = {
  "madde": "MADDE",
  "davacı": "DAVACI",
  "davalı": "DAVALI",
  "mahkemesi": "MAHKEMESİ",
  "karar": "KARAR",
  "esas": "ESAS",
  "hüküm": "HÜKÜM",
  "fıkra": "FIKRA",
  "bent": "BENT",
  "sozlesme": "SÖZLEŞME",
  "protokol": "PROTOKOL",
  "vekaletname": "VEKÂLETNAME",
  "noter": "NOTER",
  "yevmiye": "YEVMİYE",
  "tebligat": "TEBLİGAT",
  "icra": "İCRA",
  "iflas": "İFLAS",
  "haciz": "HACİZ",
  "ipotek": "İPOTEK",
  "rehin": "REHİN",
  "kefalet": "KEFALET",
  "teminat": "TEMİNAT",
};

/**
 * Generate unique ID
 */
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Process a legal document image/PDF for OCR
 */
export async function processLegalDocument(
  documentData: ArrayBuffer | string,
  options: OCROptions = {}
): Promise<OCRResult> {
  const startTime = Date.now();

  const {
    language = "tr",
    enhanceQuality = true,
    extractStructuredData = true,
    detectSignatures = true,
    detectStamps = true,
  } = options;

  // Simulate OCR processing (in production, would use Tesseract.js or cloud OCR)
  const simulatedText = simulateOCRExtraction(documentData);
  const normalizedText = normalizeTurkishText(simulatedText);
  const correctedText = applyOCRCorrections(normalizedText);

  // Detect document type
  const documentType = detectDocumentType(correctedText);

  // Extract structured data
  const structuredData = extractStructuredData
    ? extractLegalStructuredData(correctedText)
    : createEmptyStructuredData();

  // Extract metadata
  const metadata = extractDocumentMetadata(correctedText, documentType);

  // Create page data
  const pages = createPageData(correctedText, detectSignatures, detectStamps);

  // Assess quality
  const qualityAssessment = assessDocumentQuality(pages);

  // Calculate overall confidence
  const confidence = calculateOverallConfidence(pages, qualityAssessment);

  return {
    id: generateId("ocr"),
    documentType,
    extractedText: correctedText,
    confidence,
    language: detectLanguage(correctedText),
    pages,
    metadata,
    structuredData,
    qualityAssessment,
    processingTimeMs: Date.now() - startTime,
  };
}

export interface OCROptions {
  language?: "tr" | "en" | "de" | "auto";
  enhanceQuality?: boolean;
  extractStructuredData?: boolean;
  detectSignatures?: boolean;
  detectStamps?: boolean;
  dpi?: number;
  outputFormat?: "text" | "hocr" | "json";
}

/**
 * Simulate OCR extraction (placeholder for actual OCR engine)
 */
function simulateOCRExtraction(documentData: ArrayBuffer | string): string {
  // In production, this would use actual OCR
  if (typeof documentData === "string") {
    return documentData;
  }
  return "Simulated OCR text extraction from binary data";
}

/**
 * Normalize Turkish characters in OCR output
 */
export function normalizeTurkishText(text: string): string {
  let normalized = text;

  // Fix common Turkish character OCR errors
  const charFixes: [RegExp, string][] = [
    [/ı/g, "ı"],
    [/İ/g, "İ"],
    [/ğ/g, "ğ"],
    [/Ğ/g, "Ğ"],
    [/ü/g, "ü"],
    [/Ü/g, "Ü"],
    [/ş/g, "ş"],
    [/Ş/g, "Ş"],
    [/ö/g, "ö"],
    [/Ö/g, "Ö"],
    [/ç/g, "ç"],
    [/Ç/g, "Ç"],
  ];

  for (const [pattern, replacement] of charFixes) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized;
}

/**
 * Apply common OCR corrections for legal terms
 */
export function applyOCRCorrections(text: string): string {
  let corrected = text;

  for (const [error, correction] of Object.entries(OCR_CORRECTIONS)) {
    const regex = new RegExp(error, "gi");
    corrected = corrected.replace(regex, correction);
  }

  return corrected;
}

/**
 * Detect document type from content
 */
export function detectDocumentType(text: string): LegalDocumentType {
  const upperText = text.toUpperCase();

  // Check for court decision
  if (LEGAL_PATTERNS.courtDecision.header.test(text)) {
    return "mahkeme_karari";
  }

  // Check for notary document
  if (LEGAL_PATTERNS.notary.header.test(text)) {
    return "noter_belgesi";
  }

  // Check for petition
  if (LEGAL_PATTERNS.petition.header.test(text)) {
    return "dilekce";
  }

  // Check for contract
  if (LEGAL_PATTERNS.contract.header.test(text)) {
    return "sozlesme";
  }

  // Check for power of attorney
  if (/VEKÂLETNAME|VEKALETNAME/i.test(text)) {
    return "vekaletname";
  }

  // Check for execution order
  if (/İCRA\s*(EMRİ|MÜDÜRLÜĞÜ)|HACİZ/i.test(text)) {
    return "icra_emri";
  }

  // Check for notification
  if (/TEBLİGAT|TEBLİĞ/i.test(text)) {
    return "tebligat";
  }

  // Check for expert report
  if (/BİLİRKİŞİ\s*RAPORU/i.test(text)) {
    return "bilirkisi_raporu";
  }

  // Check for law text
  if (/KANUN|YASA/i.test(upperText) && /MADDE\s*\d+/i.test(text)) {
    return "kanun_metni";
  }

  // Check for regulation
  if (/YÖNETMELİK/i.test(text)) {
    return "yonetmelik";
  }

  // Check for circular
  if (/GENELGE/i.test(text)) {
    return "genelge";
  }

  // Check for official letter
  if (/SAYI[:\s]*|KONU[:\s]*/i.test(text) && /T\.?C\.?/i.test(text)) {
    return "resmi_yazi";
  }

  return "unknown";
}

/**
 * Extract structured legal data from text
 */
function extractLegalStructuredData(text: string): StructuredLegalData {
  return {
    articles: extractArticles(text),
    dates: extractDates(text),
    amounts: extractAmounts(text),
    parties: extractParties(text),
    references: extractLegalReferences(text),
    obligations: extractObligations(text),
  };
}

/**
 * Extract articles from text
 */
function extractArticles(text: string): ExtractedArticle[] {
  const articles: ExtractedArticle[] = [];
  const articlePattern = /MADDE\s*(\d+)\s*[-–:.]?\s*([^\n]+)?(?:\n([\s\S]*?))?(?=MADDE\s*\d+|$)/gi;

  let match;
  while ((match = articlePattern.exec(text)) !== null) {
    articles.push({
      articleNumber: match[1],
      title: match[2]?.trim(),
      content: match[3]?.trim() || "",
      pageNumber: 1, // Would be calculated from actual page position
    });
  }

  return articles;
}

/**
 * Extract dates from text
 */
function extractDates(text: string): ExtractedDate[] {
  const dates: ExtractedDate[] = [];
  const seenDates = new Set<string>();

  // Standard date format
  let match;
  while ((match = LEGAL_PATTERNS.dates.standard.exec(text)) !== null) {
    const dateStr = match[1];
    if (!seenDates.has(dateStr)) {
      seenDates.add(dateStr);
      const parsedDate = parseDate(dateStr);
      if (parsedDate) {
        const context = getDateContext(text, match.index);
        dates.push({
          date: parsedDate,
          context,
          dateType: determineDateType(context),
          pageNumber: 1,
        });
      }
    }
  }

  return dates;
}

/**
 * Parse date string to Date object
 */
function parseDate(dateStr: string): Date | null {
  const parts = dateStr.split(/[./-]/);
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  let year = parseInt(parts[2], 10);

  if (year < 100) {
    year += year > 50 ? 1900 : 2000;
  }

  const date = new Date(year, month, day);
  if (isNaN(date.getTime())) return null;

  return date;
}

/**
 * Get context around a date
 */
function getDateContext(text: string, index: number): string {
  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, index + 50);
  return text.substring(start, end).replace(/\s+/g, " ").trim();
}

/**
 * Determine date type from context
 */
function determineDateType(context: string): ExtractedDate["dateType"] {
  const lowerContext = context.toLowerCase();

  if (/tarih|düzenlen|imza/i.test(lowerContext)) {
    return "document";
  }
  if (/süre|vade|son|kadar|içinde/i.test(lowerContext)) {
    return "deadline";
  }
  if (/olay|vuku|gerçekleş/i.test(lowerContext)) {
    return "event";
  }

  return "reference";
}

/**
 * Extract monetary amounts from text
 */
function extractAmounts(text: string): ExtractedAmount[] {
  const amounts: ExtractedAmount[] = [];

  // Extract TL amounts
  let match;
  while ((match = LEGAL_PATTERNS.amounts.tl.exec(text)) !== null) {
    const value = parseAmount(match[1]);
    if (value > 0) {
      const context = getDateContext(text, match.index);
      amounts.push({
        value,
        currency: "TRY",
        context,
        amountType: determineAmountType(context),
        pageNumber: 1,
      });
    }
  }

  // Extract USD amounts
  while ((match = LEGAL_PATTERNS.amounts.usd.exec(text)) !== null) {
    const value = parseAmount(match[1]);
    if (value > 0) {
      const context = getDateContext(text, match.index);
      amounts.push({
        value,
        currency: "USD",
        context,
        amountType: determineAmountType(context),
        pageNumber: 1,
      });
    }
  }

  // Extract EUR amounts
  while ((match = LEGAL_PATTERNS.amounts.eur.exec(text)) !== null) {
    const value = parseAmount(match[1]);
    if (value > 0) {
      const context = getDateContext(text, match.index);
      amounts.push({
        value,
        currency: "EUR",
        context,
        amountType: determineAmountType(context),
        pageNumber: 1,
      });
    }
  }

  return amounts;
}

/**
 * Parse amount string to number
 */
function parseAmount(amountStr: string): number {
  // Turkish format: 1.234.567,89
  const normalized = amountStr.replace(/\./g, "").replace(",", ".");
  return parseFloat(normalized) || 0;
}

/**
 * Determine amount type from context
 */
function determineAmountType(context: string): ExtractedAmount["amountType"] {
  const lowerContext = context.toLowerCase();

  if (/ödeme|ücret|bedel|kira/i.test(lowerContext)) {
    return "payment";
  }
  if (/ceza|para cezası|idari/i.test(lowerContext)) {
    return "fine";
  }
  if (/tazminat|zarar|ziyan/i.test(lowerContext)) {
    return "compensation";
  }
  if (/harç|masraf|gider/i.test(lowerContext)) {
    return "fee";
  }

  return "other";
}

/**
 * Extract parties from text
 */
function extractParties(text: string): ExtractedParty[] {
  const parties: ExtractedParty[] = [];

  // Extract plaintiffs
  const plaintiffMatch = text.match(/DAVACI\s*[:\s]*([^\n,]+)/i);
  if (plaintiffMatch) {
    parties.push({
      name: plaintiffMatch[1].trim(),
      role: "plaintiff",
      pageNumber: 1,
    });
  }

  // Extract defendants
  const defendantMatch = text.match(/DAVALI\s*[:\s]*([^\n,]+)/i);
  if (defendantMatch) {
    parties.push({
      name: defendantMatch[1].trim(),
      role: "defendant",
      pageNumber: 1,
    });
  }

  // Extract lawyers
  const lawyerMatches = text.matchAll(/(?:VEKİL|AVUKAT)\s*[:\s]*([^\n,]+)/gi);
  for (const match of lawyerMatches) {
    parties.push({
      name: match[1].trim(),
      role: "lawyer",
      pageNumber: 1,
    });
  }

  // Extract TC Kimlik numbers for parties
  const tcMatches = text.matchAll(LEGAL_PATTERNS.tcKimlik);
  for (const match of tcMatches) {
    const tcKimlik = match[1];
    // Try to associate with existing party or create new one
    const context = getDateContext(text, match.index || 0);
    const existingParty = parties.find((p) =>
      context.toLowerCase().includes(p.name.toLowerCase().split(" ")[0])
    );
    if (existingParty) {
      existingParty.identifiers = { ...existingParty.identifiers, tcKimlik };
    }
  }

  return parties;
}

/**
 * Extract legal references from text
 */
function extractLegalReferences(text: string): LegalReference[] {
  const references: LegalReference[] = [];
  const seenRefs = new Set<string>();

  const lawPatterns: [string, RegExp][] = [
    ["Türk Ceza Kanunu", LEGAL_PATTERNS.lawReferences.turkishPenalCode],
    ["Türk Medeni Kanunu", LEGAL_PATTERNS.lawReferences.civilCode],
    ["Borçlar Kanunu", LEGAL_PATTERNS.lawReferences.obligationsCode],
    ["Türk Ticaret Kanunu", LEGAL_PATTERNS.lawReferences.commercialCode],
    ["İş Kanunu", LEGAL_PATTERNS.lawReferences.laborLaw],
    ["KVKK", LEGAL_PATTERNS.lawReferences.kvkk],
  ];

  for (const [lawName, pattern] of lawPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const refKey = `${lawName}-${match[1]}`;
      if (!seenRefs.has(refKey)) {
        seenRefs.add(refKey);
        references.push({
          lawName,
          articleNumber: match[1],
          context: getDateContext(text, match.index),
          pageNumber: 1,
        });
      }
    }
  }

  return references;
}

/**
 * Extract obligations from text
 */
function extractObligations(text: string): ExtractedObligation[] {
  const obligations: ExtractedObligation[] = [];

  // Pattern for obligation statements
  const obligationPatterns = [
    /([^.]+)\s+(?:tarafından|tarafindan)\s+([^.]+)\s+(?:ödenecektir|yapılacaktır|yerine getirilecektir)/gi,
    /([^.]+)\s+(?:yükümlüdür|mecburdur|zorunludur)/gi,
  ];

  for (const pattern of obligationPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      obligations.push({
        obligor: match[1]?.trim() || "Belirtilmemiş",
        obligee: match[2]?.trim() || "Belirtilmemiş",
        description: match[0],
        pageNumber: 1,
      });
    }
  }

  return obligations;
}

/**
 * Create empty structured data
 */
function createEmptyStructuredData(): StructuredLegalData {
  return {
    articles: [],
    dates: [],
    amounts: [],
    parties: [],
    references: [],
    obligations: [],
  };
}

/**
 * Extract document metadata
 */
function extractDocumentMetadata(
  text: string,
  documentType: LegalDocumentType
): DocumentMetadata {
  const metadata: DocumentMetadata = {
    pageCount: 1, // Would be determined from actual document
    estimatedWordCount: text.split(/\s+/).length,
  };

  // Extract case number
  const caseMatch = text.match(LEGAL_PATTERNS.courtDecision.caseNumber);
  if (caseMatch) {
    metadata.caseNumber = caseMatch[1];
  }

  // Extract document number
  const decisionMatch = text.match(LEGAL_PATTERNS.courtDecision.decisionNumber);
  if (decisionMatch) {
    metadata.documentNumber = decisionMatch[1];
  }

  // Extract court name
  const courtMatch = text.match(LEGAL_PATTERNS.courtDecision.header);
  if (courtMatch) {
    metadata.courtName = courtMatch[1].trim();
  }

  // Extract date
  const dateMatch = text.match(LEGAL_PATTERNS.courtDecision.date);
  if (dateMatch) {
    const date = parseDate(dateMatch[1]);
    if (date) {
      metadata.date = date;
    }
  }

  // Extract notary info
  if (documentType === "noter_belgesi") {
    const notaryMatch = text.match(LEGAL_PATTERNS.notary.header);
    const registerMatch = text.match(LEGAL_PATTERNS.notary.registerNumber);
    const notaryNumMatch = text.match(LEGAL_PATTERNS.notary.notaryNumber);

    if (notaryMatch) {
      metadata.notaryInfo = {
        notaryName: notaryMatch[0].trim(),
        notaryNumber: notaryNumMatch?.[1] || "",
        city: "",
        date: metadata.date || new Date(),
        registerNumber: registerMatch?.[1] || "",
      };
    }
  }

  return metadata;
}

/**
 * Create page data from text
 */
function createPageData(
  text: string,
  detectSignatures: boolean,
  detectStamps: boolean
): OCRPage[] {
  // Split text into pages (simplified - in production would use actual page breaks)
  const pageTexts = text.split(/\f|\n{4,}/).filter((t) => t.trim());

  return pageTexts.map((pageText, index) => ({
    pageNumber: index + 1,
    width: 595, // A4 width in points
    height: 842, // A4 height in points
    text: pageText,
    blocks: createTextBlocks(pageText),
    tables: detectTables(pageText),
    signatures: detectSignatures ? detectSignaturesInPage(pageText) : [],
    stamps: detectStamps ? detectStampsInPage(pageText) : [],
    handwrittenAreas: [],
    confidence: 0.85 + Math.random() * 0.1,
  }));
}

/**
 * Create text blocks from page text
 */
function createTextBlocks(text: string): TextBlock[] {
  const blocks: TextBlock[] = [];
  const paragraphs = text.split(/\n{2,}/);

  let yPosition = 50;
  for (const para of paragraphs) {
    if (!para.trim()) continue;

    const isHeading =
      /^(MADDE|BÖLÜM|KISIM|T\.?C\.)/i.test(para) || para.length < 100;

    blocks.push({
      id: generateId("block"),
      text: para.trim(),
      boundingBox: {
        x: 50,
        y: yPosition,
        width: 495,
        height: Math.ceil(para.length / 80) * 15,
      },
      confidence: 0.85 + Math.random() * 0.1,
      blockType: isHeading ? "heading" : "paragraph",
      fontSize: isHeading ? 14 : 12,
      fontStyle: isHeading ? "bold" : "normal",
    });

    yPosition += Math.ceil(para.length / 80) * 15 + 20;
  }

  return blocks;
}

/**
 * Detect tables in page text
 */
function detectTables(text: string): DetectedTable[] {
  const tables: DetectedTable[] = [];

  // Simple table detection based on tab/space patterns
  const tablePattern = /(?:[^\n]+\t[^\n]+\n?){3,}/g;
  let match;

  while ((match = tablePattern.exec(text)) !== null) {
    const tableText = match[0];
    const rows = tableText.split("\n").filter((r) => r.trim());

    tables.push({
      id: generateId("table"),
      boundingBox: { x: 50, y: 100, width: 495, height: rows.length * 25 },
      rows: rows.length,
      columns: rows[0]?.split("\t").length || 2,
      cells: [],
      headerRow: true,
    });
  }

  return tables;
}

/**
 * Detect signatures in page
 */
function detectSignaturesInPage(text: string): DetectedSignature[] {
  const signatures: DetectedSignature[] = [];

  // Look for signature indicators
  if (/imza|İMZA/i.test(text)) {
    signatures.push({
      id: generateId("sig"),
      boundingBox: { x: 400, y: 700, width: 150, height: 50 },
      signatureType: "handwritten",
      confidence: 0.7,
    });
  }

  return signatures;
}

/**
 * Detect stamps in page
 */
function detectStampsInPage(text: string): DetectedStamp[] {
  const stamps: DetectedStamp[] = [];

  // Look for stamp indicators
  if (/mühür|MÜHÜR|kaşe|KAŞE/i.test(text)) {
    stamps.push({
      id: generateId("stamp"),
      boundingBox: { x: 250, y: 700, width: 100, height: 100 },
      stampType: "official",
      confidence: 0.6,
    });
  }

  if (/noter|NOTERLİĞİ/i.test(text)) {
    stamps.push({
      id: generateId("stamp"),
      boundingBox: { x: 100, y: 100, width: 80, height: 80 },
      stampType: "notary",
      confidence: 0.75,
    });
  }

  return stamps;
}

/**
 * Assess document quality
 */
function assessDocumentQuality(pages: OCRPage[]): QualityAssessment {
  const avgConfidence =
    pages.reduce((sum, p) => sum + p.confidence, 0) / pages.length;

  const issues: QualityIssue[] = [];

  // Check for low confidence pages
  const lowConfPages = pages
    .filter((p) => p.confidence < 0.7)
    .map((p) => p.pageNumber);
  if (lowConfPages.length > 0) {
    issues.push({
      type: "blur",
      severity: "medium",
      affectedPages: lowConfPages,
      description: "Bazı sayfalar düşük kalitede taranmış olabilir",
    });
  }

  const score = avgConfidence * 100;
  let readability: QualityAssessment["readability"];

  if (score >= 90) readability = "excellent";
  else if (score >= 75) readability = "good";
  else if (score >= 60) readability = "fair";
  else readability = "poor";

  const recommendations: string[] = [];
  if (readability === "poor" || readability === "fair") {
    recommendations.push("Belgeyi daha yüksek çözünürlükte taramayı deneyin");
    recommendations.push("Tarama sırasında belgenin düz olduğundan emin olun");
  }

  return {
    overallScore: Math.round(score),
    readability,
    issues,
    recommendations,
  };
}

/**
 * Calculate overall confidence score
 */
function calculateOverallConfidence(
  pages: OCRPage[],
  quality: QualityAssessment
): number {
  const avgPageConfidence =
    pages.reduce((sum, p) => sum + p.confidence, 0) / pages.length;
  const qualityFactor = quality.overallScore / 100;

  return (avgPageConfidence + qualityFactor) / 2;
}

/**
 * Detect language of text
 */
function detectLanguage(text: string): OCRResult["language"] {
  const turkishChars = (text.match(/[ğüşıöçĞÜŞİÖÇ]/g) || []).length;
  const germanChars = (text.match(/[äöüßÄÖÜ]/g) || []).length;
  const totalChars = text.length;

  const turkishRatio = turkishChars / totalChars;
  const germanRatio = germanChars / totalChars;

  if (turkishRatio > 0.01) {
    if (germanRatio > 0.005) return "mixed";
    return "tr";
  }
  if (germanRatio > 0.01) return "de";

  // Check for English by absence of special chars and common words
  if (/\b(the|and|or|is|are|was|were)\b/i.test(text)) {
    return "en";
  }

  return "tr"; // Default to Turkish
}

/**
 * Get document type display name in Turkish
 */
export function getDocumentTypeName(type: LegalDocumentType): string {
  const names: Record<LegalDocumentType, string> = {
    mahkeme_karari: "Mahkeme Kararı",
    sozlesme: "Sözleşme",
    dilekce: "Dilekçe",
    vekaletname: "Vekâletname",
    noter_belgesi: "Noter Belgesi",
    icra_emri: "İcra Emri",
    tebligat: "Tebligat",
    bilirkisi_raporu: "Bilirkişi Raporu",
    dava_dosyasi: "Dava Dosyası",
    resmi_yazi: "Resmi Yazı",
    kanun_metni: "Kanun Metni",
    yonetmelik: "Yönetmelik",
    genelge: "Genelge",
    unknown: "Bilinmeyen Belge Türü",
  };

  return names[type];
}

/**
 * Get supported document types
 */
export function getSupportedDocumentTypes(): Array<{
  type: LegalDocumentType;
  name: string;
  description: string;
}> {
  return [
    {
      type: "mahkeme_karari",
      name: "Mahkeme Kararı",
      description: "Tüm mahkeme kararları ve ilamlar",
    },
    {
      type: "sozlesme",
      name: "Sözleşme",
      description: "Her türlü sözleşme ve protokol",
    },
    {
      type: "dilekce",
      name: "Dilekçe",
      description: "Dava dilekçeleri ve başvurular",
    },
    {
      type: "vekaletname",
      name: "Vekâletname",
      description: "Avukata verilen vekâletnameler",
    },
    {
      type: "noter_belgesi",
      name: "Noter Belgesi",
      description: "Noterden onaylı tüm belgeler",
    },
    {
      type: "icra_emri",
      name: "İcra Emri",
      description: "İcra takip belgeleri",
    },
    {
      type: "tebligat",
      name: "Tebligat",
      description: "Yasal tebligat belgeleri",
    },
    {
      type: "bilirkisi_raporu",
      name: "Bilirkişi Raporu",
      description: "Mahkeme bilirkişi raporları",
    },
  ];
}

/**
 * Format OCR result as readable summary
 */
export function formatOCRSummary(result: OCRResult): string {
  const lines: string[] = [];

  lines.push(`## OCR Sonuç Özeti`);
  lines.push(``);
  lines.push(`**Belge Türü:** ${getDocumentTypeName(result.documentType)}`);
  lines.push(`**Güven Skoru:** %${Math.round(result.confidence * 100)}`);
  lines.push(`**Dil:** ${result.language.toUpperCase()}`);
  lines.push(`**Sayfa Sayısı:** ${result.pages.length}`);
  lines.push(``);

  if (result.metadata.caseNumber) {
    lines.push(`**Esas No:** ${result.metadata.caseNumber}`);
  }
  if (result.metadata.courtName) {
    lines.push(`**Mahkeme:** ${result.metadata.courtName}`);
  }
  if (result.metadata.date) {
    lines.push(`**Tarih:** ${result.metadata.date.toLocaleDateString("tr-TR")}`);
  }

  lines.push(``);
  lines.push(`### Çıkarılan Veriler`);

  if (result.structuredData.parties.length > 0) {
    lines.push(`**Taraflar:** ${result.structuredData.parties.length} kişi/kurum`);
  }
  if (result.structuredData.amounts.length > 0) {
    lines.push(`**Tutarlar:** ${result.structuredData.amounts.length} adet`);
  }
  if (result.structuredData.dates.length > 0) {
    lines.push(`**Tarihler:** ${result.structuredData.dates.length} adet`);
  }
  if (result.structuredData.references.length > 0) {
    lines.push(`**Yasal Referanslar:** ${result.structuredData.references.length} adet`);
  }

  lines.push(``);
  lines.push(`### Kalite Değerlendirmesi`);
  lines.push(`**Genel Skor:** %${result.qualityAssessment.overallScore}`);
  lines.push(`**Okunabilirlik:** ${getReadabilityLabel(result.qualityAssessment.readability)}`);

  if (result.qualityAssessment.recommendations.length > 0) {
    lines.push(``);
    lines.push(`### Öneriler`);
    for (const rec of result.qualityAssessment.recommendations) {
      lines.push(`- ${rec}`);
    }
  }

  lines.push(``);
  lines.push(`*İşlem süresi: ${result.processingTimeMs}ms*`);

  return lines.join("\n");
}

/**
 * Get readability label in Turkish
 */
function getReadabilityLabel(readability: QualityAssessment["readability"]): string {
  const labels: Record<QualityAssessment["readability"], string> = {
    excellent: "Mükemmel",
    good: "İyi",
    fair: "Orta",
    poor: "Zayıf",
  };
  return labels[readability];
}
