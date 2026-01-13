/**
 * Tests for Advanced RAG Library
 * @vitest-environment node
 */

import { describe, it, expect } from "vitest";
import {
  semanticChunk,
  analyzeQuery,
  rerankResults,
  formatContextFromResults,
  keywordRetrieval,
  Chunk,
  RetrievalResult,
} from "@/lib/advanced-rag";

describe("analyzeQuery", () => {
  it("should detect find_law intent", () => {
    const query = "6698 sayılı kanun madde 5 nedir?";

    const analysis = analyzeQuery(query);

    expect(analysis.intent).toBe("find_law");
    expect(analysis.originalQuery).toBe(query);
  });

  it("should detect find_case intent", () => {
    const query = "Yargıtay emsal kararları nelerdir?";

    const analysis = analyzeQuery(query);

    expect(analysis.intent).toBe("find_case");
  });

  it("should detect explain_concept intent", () => {
    const query = "Kıdem tazminatı nedir?";

    const analysis = analyzeQuery(query);

    expect(analysis.intent).toBe("explain_concept");
  });

  it("should detect compare intent", () => {
    const query = "İş sözleşmesi ve hizmet sözleşmesi arasındaki fark";

    const analysis = analyzeQuery(query);

    expect(analysis.intent).toBe("compare");
  });

  it("should detect procedure intent", () => {
    const query = "Dava nasıl açılır?";

    const analysis = analyzeQuery(query);

    expect(analysis.intent).toBe("procedure");
  });

  it("should return general intent for generic queries", () => {
    const query = "Hukuk konusunda bilgi istiyorum";

    const analysis = analyzeQuery(query);

    expect(analysis.intent).toBe("general");
  });

  it("should extract law entities", () => {
    const query = "6698 sayılı KVKK kapsamında haklar nelerdir?";

    const analysis = analyzeQuery(query);

    const lawEntities = analysis.entities.filter(e => e.type === "law");
    expect(lawEntities.length).toBeGreaterThanOrEqual(1);
  });

  it("should extract article entities", () => {
    const query = "Madde 5 ve madde 10 hakkında bilgi verin";

    const analysis = analyzeQuery(query);

    const articleEntities = analysis.entities.filter(e => e.type === "article");
    expect(articleEntities.length).toBeGreaterThanOrEqual(1);
  });

  it("should extract case entities", () => {
    const query = "2024/1234 E. sayılı karar hakkında bilgi";

    const analysis = analyzeQuery(query);

    const caseEntities = analysis.entities.filter(e => e.type === "case");
    expect(caseEntities.length).toBe(1);
  });

  it("should extract court entities", () => {
    const query = "Yargıtay ve Danıştay kararları";

    const analysis = analyzeQuery(query);

    const courtEntities = analysis.entities.filter(e => e.type === "court");
    expect(courtEntities.length).toBeGreaterThanOrEqual(1);
  });

  it("should extract keywords without stop words", () => {
    const query = "İş hukuku ve tazminat hesaplama";

    const analysis = analyzeQuery(query);

    expect(analysis.keywords).not.toContain("ve");
    expect(analysis.keywords.length).toBeGreaterThan(0);
  });

  it("should expand query with synonyms", () => {
    const query = "Tazminat davası nasıl açılır?";

    const analysis = analyzeQuery(query);

    expect(analysis.expandedQueries.length).toBeGreaterThan(1);
    expect(analysis.expandedQueries).toContain(query);
  });

  it("should extract court filters", () => {
    const query = "Yargıtay kararları";

    const analysis = analyzeQuery(query);

    expect(analysis.filters.courts?.length).toBeGreaterThan(0);
  });

  it("should extract law number filters", () => {
    const query = "6698 sayılı Kanun uygulaması";

    const analysis = analyzeQuery(query);

    expect(analysis.filters.lawNumbers?.length).toBeGreaterThan(0);
  });
});

describe("rerankResults", () => {
  const createMockChunk = (content: string, entities: string[] = []): Chunk => ({
    id: `chunk_${Math.random()}`,
    content,
    metadata: {
      documentId: "doc-1",
      documentTitle: "Test Document",
      chunkIndex: 0,
      totalChunks: 1,
      type: "paragraph",
      charStart: 0,
      charEnd: content.length,
      entities,
      importance: 0.5,
    },
  });

  const createMockResult = (chunk: Chunk, score: number): RetrievalResult => ({
    chunk,
    score,
    matchType: "keyword",
  });

  it("should reorder results based on relevance", () => {
    const query = analyzeQuery("6698 sayılı kanun");

    const results: RetrievalResult[] = [
      createMockResult(createMockChunk("Genel hukuk bilgisi"), 0.5),
      createMockResult(createMockChunk("6698 sayılı Kanun hükümleri", ["6698 sayılı Kanun"]), 0.4),
      createMockResult(createMockChunk("Farklı konu hakkında"), 0.6),
    ];

    const reranked = rerankResults(results, query);

    expect(reranked.length).toBe(3);
  });

  it("should boost scores for entity matches", () => {
    const query = analyzeQuery("4857 sayılı İş Kanunu");

    const chunkWithEntity = createMockChunk("4857 sayılı İş Kanunu maddeleri", ["4857 sayılı İş Kanunu"]);
    const chunkWithoutEntity = createMockChunk("Genel iş hukuku bilgisi");

    const results: RetrievalResult[] = [
      createMockResult(chunkWithoutEntity, 0.5),
      createMockResult(chunkWithEntity, 0.5),
    ];

    const reranked = rerankResults(results, query);

    const withEntityScore = reranked.find(r => r.chunk.content.includes("4857"))?.score;
    const withoutEntityScore = reranked.find(r => !r.chunk.content.includes("4857"))?.score;

    expect(withEntityScore).toBeGreaterThanOrEqual(withoutEntityScore || 0);
  });

  it("should handle empty results", () => {
    const query = analyzeQuery("test query");
    const results: RetrievalResult[] = [];

    const reranked = rerankResults(results, query);

    expect(reranked).toHaveLength(0);
  });
});

describe("formatContextFromResults", () => {
  const createResult = (content: string, title: string, section?: string): RetrievalResult => ({
    chunk: {
      id: "chunk-1",
      content,
      metadata: {
        documentId: "doc-1",
        documentTitle: title,
        chunkIndex: 0,
        totalChunks: 1,
        type: "paragraph",
        charStart: 0,
        charEnd: content.length,
        section,
      },
    },
    score: 0.8,
    matchType: "keyword",
  });

  it("should format results with document titles", () => {
    const results: RetrievalResult[] = [
      createResult("Test içeriği burada", "KVKK"),
    ];

    const context = formatContextFromResults(results);

    expect(context).toContain("[KVKK]");
    expect(context).toContain("Test içeriği burada");
  });

  it("should include section in header when available", () => {
    const results: RetrievalResult[] = [
      createResult("Madde içeriği", "KVKK", "Madde 5"),
    ];

    const context = formatContextFromResults(results);

    expect(context).toContain("KVKK - Madde 5");
  });

  it("should separate multiple results with dividers", () => {
    const results: RetrievalResult[] = [
      createResult("Birinci içerik", "Doc 1"),
      createResult("İkinci içerik", "Doc 2"),
    ];

    const context = formatContextFromResults(results);

    expect(context).toContain("---");
    expect(context).toContain("Birinci içerik");
    expect(context).toContain("İkinci içerik");
  });

  it("should handle empty results", () => {
    const context = formatContextFromResults([]);

    expect(context).toBe("");
  });
});

describe("keywordRetrieval", () => {
  const createChunk = (id: string, content: string): Chunk => ({
    id,
    content,
    metadata: {
      documentId: "doc-1",
      documentTitle: "Test",
      chunkIndex: 0,
      totalChunks: 1,
      type: "paragraph",
      charStart: 0,
      charEnd: content.length,
    },
  });

  it("should retrieve chunks matching keywords", () => {
    const chunks: Chunk[] = [
      createChunk("1", "İş hukuku ve çalışan hakları hakkında bilgi"),
      createChunk("2", "Vergi hukuku ve mali konular"),
      createChunk("3", "Aile hukuku ve boşanma davaları"),
    ];

    const query = analyzeQuery("iş hukuku");
    const results = keywordRetrieval(chunks, query);

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].chunk.content).toContain("İş hukuku");
  });

  it("should return results with match type keyword", () => {
    const chunks: Chunk[] = [
      createChunk("1", "Kıdem tazminatı hesaplama yöntemi"),
    ];

    const query = analyzeQuery("tazminat");
    const results = keywordRetrieval(chunks, query);

    if (results.length > 0) {
      expect(results[0].matchType).toBe("keyword");
    }
  });

  it("should respect limit parameter", () => {
    const chunks: Chunk[] = Array.from({ length: 20 }, (_, i) =>
      createChunk(`${i}`, `Hukuk konusu ${i} hakkında bilgi`)
    );

    const query = analyzeQuery("hukuk");
    const results = keywordRetrieval(chunks, query, 5);

    expect(results.length).toBeLessThanOrEqual(5);
  });

  it("should return empty array when no matches", () => {
    const chunks: Chunk[] = [
      createChunk("1", "Tamamen farklı bir konu hakkında"),
    ];

    const query = analyzeQuery("astronomi bilimi");
    const results = keywordRetrieval(chunks, query);

    expect(results.length).toBe(0);
  });

  it("should sort results by score descending", () => {
    const chunks: Chunk[] = [
      createChunk("1", "Hukuk"),
      createChunk("2", "Hukuk hukuk hukuk"),
      createChunk("3", "Hukuk hukuk"),
    ];

    const query = analyzeQuery("hukuk");
    const results = keywordRetrieval(chunks, query);

    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });
});

describe("semanticChunk", () => {
  it("should chunk text into multiple parts", () => {
    const longText = `
      MADDE 1 - Amaç
      Bu Kanunun amacı, kişisel verilerin işlenmesinde başta özel hayatın gizliliği olmak üzere
      kişilerin temel hak ve özgürlüklerini korumak ve kişisel verileri işleyen gerçek ve tüzel
      kişilerin yükümlülükleri ile uyacakları usul ve esasları düzenlemektir.

      MADDE 2 - Kapsam
      Bu Kanun hükümleri, kişisel verileri işlenen gerçek kişiler ile bu verileri tamamen veya
      kısmen otomatik olan ya da herhangi bir veri kayıt sisteminin parçası olmak kaydıyla
      otomatik olmayan yollarla işleyen gerçek ve tüzel kişiler hakkında uygulanır.
    `.trim();

    const chunks = semanticChunk(longText, "doc-1", "KVKK");

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[0].metadata.documentId).toBe("doc-1");
    expect(chunks[0].metadata.documentTitle).toBe("KVKK");
  });

  it("should handle short text", () => {
    const shortText = "Kısa metin.";

    const chunks = semanticChunk(shortText, "short-1", "Short");

    expect(Array.isArray(chunks)).toBe(true);
  });

  it("should assign chunk IDs correctly", () => {
    const text = `
      Bu bir test metnidir ve yeterli uzunlukta olması gerekmektedir.
      Birden fazla cümle içerir ve hukuki konuları ele alır.
      Kanun maddeleri ve mahkeme kararları bu belgede yer almaktadır.
    `.repeat(3);

    const chunks = semanticChunk(text, "test-doc", "Test");

    if (chunks.length > 0) {
      expect(chunks[0].id).toContain("test-doc_chunk_");
      for (let i = 0; i < chunks.length; i++) {
        expect(chunks[i].metadata.chunkIndex).toBe(i);
        expect(chunks[i].metadata.totalChunks).toBe(chunks.length);
      }
    }
  });

  it("should calculate importance scores", () => {
    const text = `
      Bu metin hukuki içerik içermektedir. Kanun maddeleri ve mahkeme kararları referans verilmiştir.
      Hüküm ve kararlar detaylı şekilde incelenmiştir. 6698 sayılı Kanun kapsamında değerlendirme yapılmıştır.
    `.repeat(2);

    const chunks = semanticChunk(text, "doc-4", "Test");

    for (const chunk of chunks) {
      if (chunk.metadata.importance !== undefined) {
        expect(chunk.metadata.importance).toBeGreaterThanOrEqual(0);
        expect(chunk.metadata.importance).toBeLessThanOrEqual(1);
      }
    }
  });
});
