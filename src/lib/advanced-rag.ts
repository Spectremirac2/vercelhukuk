/**
 * Advanced RAG System
 * Features:
 * - Semantic chunking for legal documents
 * - Query rewriting and expansion
 * - Hybrid search (keyword + semantic)
 * - Reranking for relevance
 * - Citation extraction and linking
 */

export interface Chunk {
  id: string;
  content: string;
  metadata: ChunkMetadata;
  embedding?: number[];
}

export interface ChunkMetadata {
  documentId: string;
  documentTitle: string;
  chunkIndex: number;
  totalChunks: number;
  type: "header" | "paragraph" | "list" | "table" | "citation" | "article";
  section?: string;
  pageNumber?: number;
  charStart: number;
  charEnd: number;
  entities?: string[];
  importance?: number;
}

export interface RetrievalResult {
  chunk: Chunk;
  score: number;
  matchType: "semantic" | "keyword" | "hybrid";
  highlights?: string[];
}

export interface QueryAnalysis {
  originalQuery: string;
  intent: QueryIntent;
  entities: ExtractedEntity[];
  expandedQueries: string[];
  keywords: string[];
  filters: QueryFilters;
}

export type QueryIntent =
  | "find_law"           // Looking for specific law/article
  | "find_case"          // Looking for court case
  | "explain_concept"    // Explain legal concept
  | "compare"            // Compare laws or concepts
  | "procedure"          // Ask about legal procedure
  | "general";           // General legal question

export interface ExtractedEntity {
  type: "law" | "article" | "case" | "court" | "concept" | "date";
  value: string;
  normalized?: string;
}

export interface QueryFilters {
  courts?: string[];
  yearRange?: { start?: number; end?: number };
  lawNumbers?: string[];
  lawAreas?: string[];
}

// Semantic chunking configuration
const CHUNK_CONFIG = {
  minChunkSize: 100,      // Minimum characters
  maxChunkSize: 1500,     // Maximum characters
  overlapSize: 100,       // Overlap between chunks
  preferredBreakPoints: [
    /\n\n/,                // Double newline
    /\.\s+(?=[A-ZÇĞİÖŞÜ])/,  // Sentence end followed by capital
    /(?:madde|MADDE)\s+\d+/gi, // Article start
    /(?:fıkra|bent|paragraf)/gi, // Legal structure markers
  ],
};

// Query intent patterns
const INTENT_PATTERNS: Array<{ intent: QueryIntent; patterns: RegExp[] }> = [
  {
    intent: "find_law",
    patterns: [
      /(?:hangi|ne)\s*(?:kanun|mevzuat|madde)/gi,
      /(\d{3,5})\s*sayılı/gi,
      /madde\s*\d+/gi,
    ],
  },
  {
    intent: "find_case",
    patterns: [
      /(?:emsal|içtihat|karar|yargıtay|danıştay)/gi,
      /\d{4}\/\d+\s*[EK]\.?/gi,
      /(?:mahkeme|daire)\s*kararı/gi,
    ],
  },
  {
    intent: "explain_concept",
    patterns: [
      /(?:ne\s*demek|nedir|açıkla|tanımla)/gi,
      /(?:kavram|terim|anlam)/gi,
    ],
  },
  {
    intent: "compare",
    patterns: [
      /(?:fark|karşılaştır|arasında)/gi,
      /(?:hangisi|tercih)/gi,
    ],
  },
  {
    intent: "procedure",
    patterns: [
      /(?:nasıl|süre[çc]|prosedür|adım)/gi,
      /(?:başvur|müracaat|dilekçe)/gi,
    ],
  },
];

/**
 * Semantic chunking for legal documents
 */
export function semanticChunk(
  text: string,
  documentId: string,
  documentTitle: string
): Chunk[] {
  const chunks: Chunk[] = [];
  let currentPosition = 0;
  let chunkIndex = 0;

  while (currentPosition < text.length) {
    const remainingText = text.slice(currentPosition);

    // Find the best break point
    let chunkEnd = Math.min(CHUNK_CONFIG.maxChunkSize, remainingText.length);

    if (chunkEnd < remainingText.length) {
      // Look for preferred break points
      let bestBreak = -1;

      for (const pattern of CHUNK_CONFIG.preferredBreakPoints) {
        const searchText = remainingText.slice(
          CHUNK_CONFIG.minChunkSize,
          CHUNK_CONFIG.maxChunkSize
        );
        const match = searchText.match(pattern);

        if (match && match.index !== undefined) {
          const breakPoint = CHUNK_CONFIG.minChunkSize + match.index + match[0].length;
          if (breakPoint > bestBreak) {
            bestBreak = breakPoint;
          }
        }
      }

      if (bestBreak > CHUNK_CONFIG.minChunkSize) {
        chunkEnd = bestBreak;
      }
    }

    const chunkContent = remainingText.slice(0, chunkEnd).trim();

    if (chunkContent.length >= CHUNK_CONFIG.minChunkSize) {
      // Detect chunk type
      const chunkType = detectChunkType(chunkContent);

      // Extract entities from chunk
      const entities = extractChunkEntities(chunkContent);

      // Calculate importance
      const importance = calculateChunkImportance(chunkContent, chunkType, entities);

      chunks.push({
        id: `${documentId}_chunk_${chunkIndex}`,
        content: chunkContent,
        metadata: {
          documentId,
          documentTitle,
          chunkIndex,
          totalChunks: 0, // Will be updated after
          type: chunkType,
          charStart: currentPosition,
          charEnd: currentPosition + chunkEnd,
          entities,
          importance,
        },
      });

      chunkIndex++;
    }

    // Move position with overlap, ensuring we always advance
    const advance = Math.max(1, chunkEnd - CHUNK_CONFIG.overlapSize);
    currentPosition += advance;
  }

  // Update total chunks
  for (const chunk of chunks) {
    chunk.metadata.totalChunks = chunks.length;
  }

  return chunks;
}

/**
 * Detect chunk type based on content
 */
function detectChunkType(content: string): ChunkMetadata["type"] {
  if (/^(?:madde|MADDE)\s*\d+/i.test(content)) {
    return "article";
  }
  if (/^(?:#|##|###|\*\*|[A-ZÇĞİÖŞÜ]{2,})/m.test(content)) {
    return "header";
  }
  if (/^\s*[-•*]\s/m.test(content) || /^\s*\d+[.)]\s/m.test(content)) {
    return "list";
  }
  if (/\|.*\|/.test(content)) {
    return "table";
  }
  if (/\d{4}\/\d+\s*[EK]\.?/.test(content)) {
    return "citation";
  }
  return "paragraph";
}

/**
 * Extract entities from chunk
 */
function extractChunkEntities(content: string): string[] {
  const entities: Set<string> = new Set();

  // Law references
  const lawMatches = content.match(/\d{3,5}\s*sayılı\s*[^,.\n]+/gi);
  if (lawMatches) lawMatches.forEach(m => entities.add(m.trim()));

  // Article references
  const articleMatches = content.match(/madde\s*\d+(?:\/\d+)?/gi);
  if (articleMatches) articleMatches.forEach(m => entities.add(m.trim()));

  // Case references
  const caseMatches = content.match(/\d{4}\/\d+\s*[EK]\.?/gi);
  if (caseMatches) caseMatches.forEach(m => entities.add(m.trim()));

  return Array.from(entities);
}

/**
 * Calculate chunk importance for ranking
 */
function calculateChunkImportance(
  content: string,
  type: ChunkMetadata["type"],
  entities: string[]
): number {
  let score = 0.5; // Base score

  // Type-based scoring
  const typeScores: Record<ChunkMetadata["type"], number> = {
    article: 0.3,
    citation: 0.2,
    header: 0.1,
    paragraph: 0,
    list: 0.05,
    table: 0.1,
  };
  score += typeScores[type];

  // Entity density
  score += Math.min(0.2, entities.length * 0.05);

  // Legal term density
  const legalTerms = content.match(/(?:hüküm|karar|kanun|mahkeme|daire|madde)/gi);
  if (legalTerms) {
    score += Math.min(0.1, legalTerms.length * 0.02);
  }

  return Math.min(1, score);
}

/**
 * Analyze query to understand intent and extract information
 */
export function analyzeQuery(query: string): QueryAnalysis {
  const entities = extractQueryEntities(query);
  const intent = detectQueryIntent(query);
  const keywords = extractKeywords(query);
  const expandedQueries = expandQuery(query, intent, entities);
  const filters = extractFilters(query, entities);

  return {
    originalQuery: query,
    intent,
    entities,
    expandedQueries,
    keywords,
    filters,
  };
}

/**
 * Detect query intent
 */
function detectQueryIntent(query: string): QueryIntent {
  for (const { intent, patterns } of INTENT_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(query)) {
        return intent;
      }
    }
  }
  return "general";
}

/**
 * Extract entities from query
 */
function extractQueryEntities(query: string): ExtractedEntity[] {
  const entities: ExtractedEntity[] = [];

  // Law numbers
  const lawMatches = query.matchAll(/(\d{3,5})\s*sayılı\s*([^,.\n]+)/gi);
  for (const match of lawMatches) {
    entities.push({
      type: "law",
      value: match[0],
      normalized: match[1],
    });
  }

  // Articles
  const articleMatches = query.matchAll(/(?:madde|md?\.|m\.)\s*(\d+)/gi);
  for (const match of articleMatches) {
    entities.push({
      type: "article",
      value: match[0],
      normalized: match[1],
    });
  }

  // Case numbers
  const caseMatches = query.matchAll(/(\d{4})\/(\d+)\s*([EK])\.?/gi);
  for (const match of caseMatches) {
    entities.push({
      type: "case",
      value: match[0],
      normalized: `${match[1]}/${match[2]} ${match[3]}`,
    });
  }

  // Courts
  const courtMatches = query.matchAll(/(Yargıtay|Danıştay|Anayasa\s*Mahkemesi)/gi);
  for (const match of courtMatches) {
    entities.push({
      type: "court",
      value: match[0],
      normalized: match[1].toLowerCase(),
    });
  }

  return entities;
}

/**
 * Extract keywords from query
 */
function extractKeywords(query: string): string[] {
  // Remove common Turkish stop words
  const stopWords = new Set([
    "ve", "veya", "ile", "için", "bu", "şu", "o", "bir", "de", "da",
    "mi", "mı", "mu", "mü", "ne", "nasıl", "hangi", "nerede", "neden",
    "gibi", "kadar", "daha", "en", "çok", "az", "her", "tüm", "bazı",
  ]);

  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
}

/**
 * Expand query with synonyms and related terms
 */
function expandQuery(
  query: string,
  intent: QueryIntent,
  entities: ExtractedEntity[]
): string[] {
  const expanded: string[] = [query];

  // Legal term synonyms
  const synonyms: Record<string, string[]> = {
    "tazminat": ["zarar", "bedel", "ödeme"],
    "fesih": ["sona erdirme", "iptal", "bozma"],
    "sözleşme": ["akit", "mukavele", "kontrat"],
    "dava": ["yargılama", "muhakeme", "duruşma"],
    "kanun": ["yasa", "mevzuat", "hukuk"],
    "mahkeme": ["yargı", "hakim", "savcı"],
    "hüküm": ["karar", "sonuç", "netice"],
    "delil": ["kanıt", "ispat", "belge"],
  };

  const queryLower = query.toLowerCase();

  for (const [term, syns] of Object.entries(synonyms)) {
    if (queryLower.includes(term)) {
      for (const syn of syns) {
        expanded.push(query.replace(new RegExp(term, "gi"), syn));
      }
    }
  }

  // Add intent-specific expansions
  if (intent === "find_case" && entities.some(e => e.type === "law")) {
    expanded.push(`${query} Yargıtay kararı`);
    expanded.push(`${query} emsal içtihat`);
  }

  if (intent === "find_law") {
    expanded.push(`${query} mevzuat`);
    expanded.push(`${query} kanun maddesi`);
  }

  return [...new Set(expanded)].slice(0, 5);
}

/**
 * Extract filters from query
 */
function extractFilters(
  query: string,
  entities: ExtractedEntity[]
): QueryFilters {
  const filters: QueryFilters = {};

  // Extract courts
  const courts = entities
    .filter(e => e.type === "court")
    .map(e => e.normalized || e.value);
  if (courts.length > 0) {
    filters.courts = courts;
  }

  // Extract law numbers
  const lawNumbers = entities
    .filter(e => e.type === "law")
    .map(e => e.normalized || e.value);
  if (lawNumbers.length > 0) {
    filters.lawNumbers = lawNumbers;
  }

  // Extract year range
  const yearMatch = query.match(/(\d{4})\s*(?:yıl|tarih|ve\s*sonrası)/gi);
  if (yearMatch) {
    const year = parseInt(yearMatch[0].match(/\d{4}/)?.[0] || "0");
    if (year > 1900 && year < 2100) {
      filters.yearRange = { start: year };
    }
  }

  return filters;
}

/**
 * Rerank results based on multiple signals
 */
export function rerankResults(
  results: RetrievalResult[],
  query: QueryAnalysis
): RetrievalResult[] {
  return results
    .map(result => ({
      ...result,
      score: calculateFinalScore(result, query),
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Calculate final score for reranking
 */
function calculateFinalScore(
  result: RetrievalResult,
  query: QueryAnalysis
): number {
  let score = result.score;

  // Boost for entity matches
  const chunkEntities = new Set(result.chunk.metadata.entities || []);
  const queryEntities = query.entities.map(e => e.value.toLowerCase());

  let entityMatchCount = 0;
  for (const qEntity of queryEntities) {
    for (const cEntity of chunkEntities) {
      if (cEntity.toLowerCase().includes(qEntity)) {
        entityMatchCount++;
      }
    }
  }
  score += entityMatchCount * 0.1;

  // Boost for keyword matches
  const chunkLower = result.chunk.content.toLowerCase();
  let keywordMatchCount = 0;
  for (const keyword of query.keywords) {
    if (chunkLower.includes(keyword)) {
      keywordMatchCount++;
    }
  }
  score += (keywordMatchCount / Math.max(1, query.keywords.length)) * 0.2;

  // Boost based on chunk importance
  score += (result.chunk.metadata.importance || 0.5) * 0.1;

  // Boost for article chunks when looking for law
  if (query.intent === "find_law" && result.chunk.metadata.type === "article") {
    score += 0.15;
  }

  // Boost for citation chunks when looking for cases
  if (query.intent === "find_case" && result.chunk.metadata.type === "citation") {
    score += 0.15;
  }

  return Math.min(1, score);
}

/**
 * Format retrieved results for context
 */
export function formatContextFromResults(
  results: RetrievalResult[],
  maxTokens: number = 4000
): string {
  const contextParts: string[] = [];
  let estimatedTokens = 0;
  const tokensPerChar = 0.25; // Rough estimate for Turkish

  for (const result of results) {
    const chunkText = result.chunk.content;
    const chunkTokens = Math.ceil(chunkText.length * tokensPerChar);

    if (estimatedTokens + chunkTokens > maxTokens) break;

    const source = result.chunk.metadata.documentTitle;
    const section = result.chunk.metadata.section || "";
    const header = section ? `[${source} - ${section}]` : `[${source}]`;

    contextParts.push(`${header}\n${chunkText}`);
    estimatedTokens += chunkTokens;
  }

  return contextParts.join("\n\n---\n\n");
}

/**
 * Simple keyword-based retrieval (fallback when no embeddings)
 */
export function keywordRetrieval(
  chunks: Chunk[],
  query: QueryAnalysis,
  limit: number = 10
): RetrievalResult[] {
  const results: RetrievalResult[] = [];

  for (const chunk of chunks) {
    const contentLower = chunk.content.toLowerCase();
    let score = 0;

    // Keyword matching
    for (const keyword of query.keywords) {
      const keywordLower = keyword.toLowerCase();
      const count = (contentLower.match(new RegExp(keywordLower, "g")) || []).length;
      score += count * 0.1;
    }

    // Entity matching
    for (const entity of query.entities) {
      if (contentLower.includes(entity.value.toLowerCase())) {
        score += 0.3;
      }
    }

    if (score > 0) {
      results.push({
        chunk,
        score,
        matchType: "keyword",
        highlights: findHighlights(chunk.content, query.keywords),
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * Find highlights in text based on keywords
 */
function findHighlights(text: string, keywords: string[]): string[] {
  const highlights: string[] = [];
  const textLower = text.toLowerCase();

  for (const keyword of keywords) {
    const index = textLower.indexOf(keyword.toLowerCase());
    if (index !== -1) {
      const start = Math.max(0, index - 50);
      const end = Math.min(text.length, index + keyword.length + 50);
      let highlight = text.slice(start, end);
      if (start > 0) highlight = "..." + highlight;
      if (end < text.length) highlight = highlight + "...";
      highlights.push(highlight);
    }
  }

  return highlights.slice(0, 3);
}
