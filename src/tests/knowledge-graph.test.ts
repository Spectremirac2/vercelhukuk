/**
 * Tests for Knowledge Graph Library
 * @vitest-environment node
 */

import { describe, it, expect } from "vitest";
import {
  createKnowledgeGraph,
  addNode,
  addEdge,
  findNodesByType,
  getConnectedNodes,
  findPaths,
  buildGraphFromText,
  getConceptRelations,
  mergeGraphs,
  exportGraph,
  importGraph,
  findRelatedLaws,
  getLawInfo,
  findConceptsByCategory,
  getLegalCategories,
  LegalNode,
  LegalEdge,
} from "@/lib/knowledge-graph";

describe("createKnowledgeGraph", () => {
  it("should create an empty graph", () => {
    const graph = createKnowledgeGraph();

    expect(graph.nodes.size).toBe(0);
    expect(graph.edges.size).toBe(0);
  });
});

describe("addNode", () => {
  it("should add a node to the graph", () => {
    const graph = createKnowledgeGraph();
    const node: LegalNode = {
      id: "law_4857",
      type: "law",
      label: "İş Kanunu",
      properties: { number: 4857 },
      metadata: {
        confidence: 0.9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    addNode(graph, node);

    expect(graph.nodes.has("law_4857")).toBe(true);
    expect(graph.nodeIndex.get("law")?.has("law_4857")).toBe(true);
  });
});

describe("addEdge", () => {
  it("should add an edge between nodes", () => {
    const graph = createKnowledgeGraph();
    const edge: LegalEdge = {
      id: "edge_1",
      source: "node_1",
      target: "node_2",
      type: "references",
      weight: 0.8,
      properties: {},
    };

    addEdge(graph, edge);

    expect(graph.edges.has("edge_1")).toBe(true);
    expect(graph.edgeIndex.get("node_1")?.has("edge_1")).toBe(true);
    expect(graph.edgeIndex.get("node_2")?.has("edge_1")).toBe(true);
  });
});

describe("findNodesByType", () => {
  it("should find nodes of a specific type", () => {
    const graph = createKnowledgeGraph();

    addNode(graph, {
      id: "law_1",
      type: "law",
      label: "Law 1",
      properties: {},
      metadata: { confidence: 1, createdAt: new Date(), updatedAt: new Date() },
    });

    addNode(graph, {
      id: "case_1",
      type: "case",
      label: "Case 1",
      properties: {},
      metadata: { confidence: 1, createdAt: new Date(), updatedAt: new Date() },
    });

    const laws = findNodesByType(graph, "law");
    const cases = findNodesByType(graph, "case");

    expect(laws.length).toBe(1);
    expect(cases.length).toBe(1);
    expect(laws[0].id).toBe("law_1");
    expect(cases[0].id).toBe("case_1");
  });
});

describe("getConnectedNodes", () => {
  it("should find connected nodes", () => {
    const graph = createKnowledgeGraph();

    addNode(graph, {
      id: "node_1",
      type: "law",
      label: "Node 1",
      properties: {},
      metadata: { confidence: 1, createdAt: new Date(), updatedAt: new Date() },
    });

    addNode(graph, {
      id: "node_2",
      type: "article",
      label: "Node 2",
      properties: {},
      metadata: { confidence: 1, createdAt: new Date(), updatedAt: new Date() },
    });

    addEdge(graph, {
      id: "edge_1",
      source: "node_1",
      target: "node_2",
      type: "part_of",
      weight: 1,
      properties: {},
    });

    const connected = getConnectedNodes(graph, "node_1");

    expect(connected.length).toBe(1);
    expect(connected[0].node.id).toBe("node_2");
    expect(connected[0].direction).toBe("outgoing");
  });

  it("should filter by edge type", () => {
    const graph = createKnowledgeGraph();

    addNode(graph, {
      id: "node_1",
      type: "law",
      label: "Node 1",
      properties: {},
      metadata: { confidence: 1, createdAt: new Date(), updatedAt: new Date() },
    });

    addNode(graph, {
      id: "node_2",
      type: "law",
      label: "Node 2",
      properties: {},
      metadata: { confidence: 1, createdAt: new Date(), updatedAt: new Date() },
    });

    addEdge(graph, {
      id: "edge_1",
      source: "node_1",
      target: "node_2",
      type: "references",
      weight: 1,
      properties: {},
    });

    const connected = getConnectedNodes(graph, "node_1", ["amends"]);

    expect(connected.length).toBe(0);
  });
});

describe("buildGraphFromText", () => {
  it("should extract law references from text", () => {
    const text = "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında incelenmiştir.";
    const graph = buildGraphFromText(text, "doc_1");

    const laws = findNodesByType(graph, "law");
    expect(laws.length).toBeGreaterThan(0);
  });

  it("should extract case references from text", () => {
    const text = "Yargıtay 9. Hukuk Dairesi 2023/1234 E. kararına atıf yapılmıştır.";
    const graph = buildGraphFromText(text, "doc_1");

    const cases = findNodesByType(graph, "case");
    expect(cases.length).toBeGreaterThan(0);
  });

  it("should extract court references from text", () => {
    const text = "Yargıtay 9. Hukuk Dairesi tarafından verilen karar incelenmiştir.";
    const graph = buildGraphFromText(text, "doc_1");

    const courts = findNodesByType(graph, "court");
    expect(courts.length).toBeGreaterThan(0);
  });
});

describe("getConceptRelations", () => {
  it("should return relations for known concepts", () => {
    const relations = getConceptRelations("kıdem tazminatı");

    expect(relations).not.toBeNull();
    expect(relations?.concept).toBe("kıdem tazminatı");
    expect(relations?.laws.length).toBeGreaterThan(0);
  });

  it("should return null for unknown concepts", () => {
    const relations = getConceptRelations("bilinmeyen kavram");

    expect(relations).toBeNull();
  });
});

describe("mergeGraphs", () => {
  it("should merge two graphs", () => {
    const graph1 = createKnowledgeGraph();
    const graph2 = createKnowledgeGraph();

    addNode(graph1, {
      id: "node_1",
      type: "law",
      label: "Node 1",
      properties: {},
      metadata: { confidence: 0.8, createdAt: new Date(), updatedAt: new Date() },
    });

    addNode(graph2, {
      id: "node_2",
      type: "case",
      label: "Node 2",
      properties: {},
      metadata: { confidence: 0.9, createdAt: new Date(), updatedAt: new Date() },
    });

    const merged = mergeGraphs(graph1, graph2);

    expect(merged.nodes.size).toBe(2);
  });
});

describe("exportGraph and importGraph", () => {
  it("should export and import a graph", () => {
    const graph = createKnowledgeGraph();

    addNode(graph, {
      id: "node_1",
      type: "law",
      label: "Node 1",
      properties: { test: true },
      metadata: { confidence: 1, createdAt: new Date(), updatedAt: new Date() },
    });

    const exported = exportGraph(graph);
    expect(exported.nodes.length).toBe(1);

    const imported = importGraph(exported);
    expect(imported.nodes.size).toBe(1);
    expect(imported.nodes.get("node_1")?.label).toBe("Node 1");
  });
});

describe("findRelatedLaws", () => {
  it("should find related laws for İş Kanunu", () => {
    const related = findRelatedLaws("4857");

    expect(related.length).toBeGreaterThan(0);
  });

  it("should return empty for unknown law", () => {
    const related = findRelatedLaws("99999");

    expect(related.length).toBe(0);
  });
});

describe("getLawInfo", () => {
  it("should return info for known laws", () => {
    const info = getLawInfo("4857");

    expect(info).not.toBeNull();
    expect(info?.name).toBe("İş Kanunu");
    expect(info?.category).toBe("iş");
  });

  it("should return null for unknown laws", () => {
    const info = getLawInfo("99999");

    expect(info).toBeNull();
  });
});

describe("findConceptsByCategory", () => {
  it("should find concepts in iş category", () => {
    const concepts = findConceptsByCategory("iş");

    expect(concepts.length).toBeGreaterThan(0);
    expect(concepts).toContain("iş sözleşmesi");
  });
});

describe("getLegalCategories", () => {
  it("should return all legal categories", () => {
    const categories = getLegalCategories();

    expect(categories.length).toBeGreaterThan(0);
    expect(categories).toContain("borçlar");
    expect(categories).toContain("iş");
  });
});
