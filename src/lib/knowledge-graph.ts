/**
 * Legal Knowledge Graph System
 *
 * Captures relationships between:
 * - Laws and their articles
 * - Court cases and precedents
 * - Legal concepts and their connections
 * - Amendments and legislative history
 *
 * Based on 2025 best practices for legal AI systems
 */

export interface LegalNode {
  id: string;
  type: NodeType;
  label: string;
  properties: Record<string, unknown>;
  metadata: NodeMetadata;
}

export type NodeType =
  | "law"           // Kanun
  | "article"       // Madde
  | "case"          // Dava/İçtihat
  | "court"         // Mahkeme
  | "concept"       // Hukuki kavram
  | "party"         // Taraf
  | "judge"         // Hakim
  | "lawyer"        // Avukat
  | "date"          // Tarih
  | "amount"        // Miktar/tutar
  | "document";     // Belge

export interface NodeMetadata {
  source?: string;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
  extractedFrom?: string;
}

export interface LegalEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  weight: number;
  properties: Record<string, unknown>;
}

export type EdgeType =
  | "references"        // Atıf yapar
  | "amends"           // Değiştirir
  | "repeals"          // Yürürlükten kaldırır
  | "interprets"       // Yorumlar
  | "applies"          // Uygular
  | "cites"            // Kaynak gösterir
  | "overrules"        // Bozar
  | "follows"          // Takip eder
  | "distinguishes"    // Ayırır
  | "related_to"       // İlişkili
  | "part_of"          // Parçası
  | "defines"          // Tanımlar
  | "contradicts"      // Çelişir
  | "supports";        // Destekler

export interface KnowledgeGraph {
  nodes: Map<string, LegalNode>;
  edges: Map<string, LegalEdge>;
  nodeIndex: Map<NodeType, Set<string>>;
  edgeIndex: Map<string, Set<string>>; // node id -> edge ids
}

export interface GraphQuery {
  startNode?: string;
  nodeTypes?: NodeType[];
  edgeTypes?: EdgeType[];
  maxDepth?: number;
  limit?: number;
}

export interface GraphPath {
  nodes: LegalNode[];
  edges: LegalEdge[];
  score: number;
}

export interface ConceptRelation {
  concept: string;
  relatedConcepts: Array<{
    concept: string;
    relation: EdgeType;
    strength: number;
  }>;
  laws: string[];
  cases: string[];
}

// Turkish Legal Concepts Ontology
const LEGAL_CONCEPTS: Record<string, {
  category: string;
  relatedTerms: string[];
  parentConcept?: string;
}> = {
  // Borçlar Hukuku
  "sözleşme": {
    category: "borçlar",
    relatedTerms: ["akit", "mukavele", "kontrat"],
    parentConcept: "borç ilişkisi",
  },
  "tazminat": {
    category: "borçlar",
    relatedTerms: ["zarar", "bedel", "ödeme"],
    parentConcept: "borç ilişkisi",
  },
  "fesih": {
    category: "borçlar",
    relatedTerms: ["sona erdirme", "iptal", "bozma"],
  },
  // İş Hukuku
  "iş sözleşmesi": {
    category: "iş",
    relatedTerms: ["hizmet sözleşmesi", "iş akdi"],
    parentConcept: "sözleşme",
  },
  "kıdem tazminatı": {
    category: "iş",
    relatedTerms: ["kıdem", "tazminat"],
    parentConcept: "tazminat",
  },
  "ihbar tazminatı": {
    category: "iş",
    relatedTerms: ["ihbar", "bildirim süresi"],
    parentConcept: "tazminat",
  },
  "işe iade": {
    category: "iş",
    relatedTerms: ["işe başlatmama", "fesih geçersizliği"],
  },
  // Ceza Hukuku
  "suç": {
    category: "ceza",
    relatedTerms: ["fiil", "eylem", "hareket"],
  },
  "ceza": {
    category: "ceza",
    relatedTerms: ["yaptırım", "müeyyide"],
  },
  "beraat": {
    category: "ceza",
    relatedTerms: ["aklanma", "suçsuzluk"],
  },
  "mahkumiyet": {
    category: "ceza",
    relatedTerms: ["hüküm", "ceza kararı"],
  },
  // Aile Hukuku
  "boşanma": {
    category: "aile",
    relatedTerms: ["ayrılık", "evliliğin sona ermesi"],
  },
  "nafaka": {
    category: "aile",
    relatedTerms: ["bakım yükümlülüğü", "iştirak nafakası", "yoksulluk nafakası"],
  },
  "velayet": {
    category: "aile",
    relatedTerms: ["çocuk hakları", "ebeveyn hakları"],
  },
  // Ticaret Hukuku
  "şirket": {
    category: "ticaret",
    relatedTerms: ["ortaklık", "tüzel kişi"],
  },
  "iflas": {
    category: "ticaret",
    relatedTerms: ["aciz", "ödeme güçlüğü"],
  },
  "konkordato": {
    category: "ticaret",
    relatedTerms: ["iflas erteleme", "borç yapılandırma"],
  },
  // Miras Hukuku
  "miras": {
    category: "miras",
    relatedTerms: ["tereke", "kalıt"],
  },
  "vasiyet": {
    category: "miras",
    relatedTerms: ["vasiyetname", "ölüme bağlı tasarruf"],
  },
  // Eşya Hukuku
  "mülkiyet": {
    category: "eşya",
    relatedTerms: ["sahiplik", "malik"],
  },
  "tapu": {
    category: "eşya",
    relatedTerms: ["tapu sicili", "gayrimenkul"],
  },
  "ipotek": {
    category: "eşya",
    relatedTerms: ["rehin", "teminat"],
  },
};

// Major Turkish Laws with relationships
const MAJOR_LAWS: Record<string, {
  name: string;
  number: number;
  category: string;
  relatedLaws: number[];
}> = {
  "6098": {
    name: "Türk Borçlar Kanunu",
    number: 6098,
    category: "borçlar",
    relatedLaws: [6102, 4721],
  },
  "4857": {
    name: "İş Kanunu",
    number: 4857,
    category: "iş",
    relatedLaws: [6098, 5510, 6356],
  },
  "5237": {
    name: "Türk Ceza Kanunu",
    number: 5237,
    category: "ceza",
    relatedLaws: [5271, 5275],
  },
  "4721": {
    name: "Türk Medeni Kanunu",
    number: 4721,
    category: "medeni",
    relatedLaws: [6098, 6100],
  },
  "6102": {
    name: "Türk Ticaret Kanunu",
    number: 6102,
    category: "ticaret",
    relatedLaws: [6098, 2004],
  },
  "6100": {
    name: "Hukuk Muhakemeleri Kanunu",
    number: 6100,
    category: "usul",
    relatedLaws: [4721, 6098],
  },
  "5271": {
    name: "Ceza Muhakemesi Kanunu",
    number: 5271,
    category: "ceza usul",
    relatedLaws: [5237],
  },
  "6698": {
    name: "Kişisel Verilerin Korunması Kanunu",
    number: 6698,
    category: "veri koruma",
    relatedLaws: [5237],
  },
  "5510": {
    name: "Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu",
    number: 5510,
    category: "sosyal güvenlik",
    relatedLaws: [4857],
  },
  "2004": {
    name: "İcra ve İflas Kanunu",
    number: 2004,
    category: "icra iflas",
    relatedLaws: [6098, 6102],
  },
};

/**
 * Create an empty knowledge graph
 */
export function createKnowledgeGraph(): KnowledgeGraph {
  return {
    nodes: new Map(),
    edges: new Map(),
    nodeIndex: new Map(),
    edgeIndex: new Map(),
  };
}

/**
 * Add a node to the knowledge graph
 */
export function addNode(graph: KnowledgeGraph, node: LegalNode): void {
  graph.nodes.set(node.id, node);

  // Update type index
  if (!graph.nodeIndex.has(node.type)) {
    graph.nodeIndex.set(node.type, new Set());
  }
  graph.nodeIndex.get(node.type)!.add(node.id);
}

/**
 * Add an edge to the knowledge graph
 */
export function addEdge(graph: KnowledgeGraph, edge: LegalEdge): void {
  graph.edges.set(edge.id, edge);

  // Update edge index for both source and target
  if (!graph.edgeIndex.has(edge.source)) {
    graph.edgeIndex.set(edge.source, new Set());
  }
  graph.edgeIndex.get(edge.source)!.add(edge.id);

  if (!graph.edgeIndex.has(edge.target)) {
    graph.edgeIndex.set(edge.target, new Set());
  }
  graph.edgeIndex.get(edge.target)!.add(edge.id);
}

/**
 * Find nodes by type
 */
export function findNodesByType(graph: KnowledgeGraph, type: NodeType): LegalNode[] {
  const nodeIds = graph.nodeIndex.get(type);
  if (!nodeIds) return [];

  return Array.from(nodeIds)
    .map(id => graph.nodes.get(id)!)
    .filter(Boolean);
}

/**
 * Get connected nodes
 */
export function getConnectedNodes(
  graph: KnowledgeGraph,
  nodeId: string,
  edgeTypes?: EdgeType[]
): Array<{ node: LegalNode; edge: LegalEdge; direction: "outgoing" | "incoming" }> {
  const edgeIds = graph.edgeIndex.get(nodeId);
  if (!edgeIds) return [];

  const results: Array<{ node: LegalNode; edge: LegalEdge; direction: "outgoing" | "incoming" }> = [];

  for (const edgeId of edgeIds) {
    const edge = graph.edges.get(edgeId);
    if (!edge) continue;

    if (edgeTypes && !edgeTypes.includes(edge.type)) continue;

    let connectedNodeId: string;
    let direction: "outgoing" | "incoming";

    if (edge.source === nodeId) {
      connectedNodeId = edge.target;
      direction = "outgoing";
    } else {
      connectedNodeId = edge.source;
      direction = "incoming";
    }

    const connectedNode = graph.nodes.get(connectedNodeId);
    if (connectedNode) {
      results.push({ node: connectedNode, edge, direction });
    }
  }

  return results;
}

/**
 * Find paths between two nodes
 */
export function findPaths(
  graph: KnowledgeGraph,
  startId: string,
  endId: string,
  maxDepth: number = 3
): GraphPath[] {
  const paths: GraphPath[] = [];
  const visited = new Set<string>();

  function dfs(
    currentId: string,
    path: LegalNode[],
    edges: LegalEdge[],
    depth: number
  ): void {
    if (depth > maxDepth) return;
    if (visited.has(currentId)) return;

    const currentNode = graph.nodes.get(currentId);
    if (!currentNode) return;

    visited.add(currentId);
    path.push(currentNode);

    if (currentId === endId && path.length > 1) {
      paths.push({
        nodes: [...path],
        edges: [...edges],
        score: calculatePathScore(path, edges),
      });
    } else {
      const connected = getConnectedNodes(graph, currentId);
      for (const { node, edge } of connected) {
        if (!visited.has(node.id)) {
          edges.push(edge);
          dfs(node.id, path, edges, depth + 1);
          edges.pop();
        }
      }
    }

    path.pop();
    visited.delete(currentId);
  }

  dfs(startId, [], [], 0);

  return paths.sort((a, b) => b.score - a.score);
}

/**
 * Calculate path relevance score
 */
function calculatePathScore(nodes: LegalNode[], edges: LegalEdge[]): number {
  let score = 1.0;

  // Shorter paths are better
  score *= 1 / nodes.length;

  // Higher confidence nodes contribute more
  for (const node of nodes) {
    score *= node.metadata.confidence;
  }

  // Stronger edges contribute more
  for (const edge of edges) {
    score *= edge.weight;
  }

  return score;
}

/**
 * Extract legal entities and build graph from text
 */
export function buildGraphFromText(
  text: string,
  documentId: string
): KnowledgeGraph {
  const graph = createKnowledgeGraph();
  const now = new Date();

  // Extract law references
  const lawMatches = text.matchAll(/(\d{3,5})\s*sayılı\s*([^,.\n]+?)(?:Kanun|Kanunu)/gi);
  for (const match of lawMatches) {
    const lawNumber = match[1];
    const lawName = match[0].trim();

    const lawNode: LegalNode = {
      id: `law_${lawNumber}`,
      type: "law",
      label: lawName,
      properties: { number: parseInt(lawNumber) },
      metadata: {
        source: documentId,
        confidence: 0.9,
        createdAt: now,
        updatedAt: now,
        extractedFrom: text.substring(
          Math.max(0, match.index! - 20),
          Math.min(text.length, match.index! + match[0].length + 20)
        ),
      },
    };
    addNode(graph, lawNode);

    // Add related laws from our ontology
    const lawInfo = MAJOR_LAWS[lawNumber];
    if (lawInfo) {
      for (const relatedLawNum of lawInfo.relatedLaws) {
        const relatedLawInfo = MAJOR_LAWS[String(relatedLawNum)];
        if (relatedLawInfo) {
          const relatedNode: LegalNode = {
            id: `law_${relatedLawNum}`,
            type: "law",
            label: relatedLawInfo.name,
            properties: { number: relatedLawNum },
            metadata: {
              confidence: 1.0,
              createdAt: now,
              updatedAt: now,
            },
          };
          addNode(graph, relatedNode);

          addEdge(graph, {
            id: `edge_${lawNumber}_${relatedLawNum}`,
            source: `law_${lawNumber}`,
            target: `law_${relatedLawNum}`,
            type: "related_to",
            weight: 0.7,
            properties: {},
          });
        }
      }
    }
  }

  // Extract article references
  const articleMatches = text.matchAll(/(?:madde|md\.?)\s*(\d+)/gi);
  for (const match of articleMatches) {
    const articleNum = match[1];

    const articleNode: LegalNode = {
      id: `article_${articleNum}_${documentId}`,
      type: "article",
      label: `Madde ${articleNum}`,
      properties: { number: parseInt(articleNum) },
      metadata: {
        source: documentId,
        confidence: 0.85,
        createdAt: now,
        updatedAt: now,
      },
    };
    addNode(graph, articleNode);
  }

  // Extract case references
  const caseMatches = text.matchAll(/(\d{4})\/(\d+)\s*([EK])\.?/gi);
  for (const match of caseMatches) {
    const year = match[1];
    const number = match[2];
    const type = match[3].toUpperCase();
    const caseId = `${year}/${number} ${type}`;

    const caseNode: LegalNode = {
      id: `case_${year}_${number}_${type}`,
      type: "case",
      label: caseId,
      properties: { year: parseInt(year), number: parseInt(number), type },
      metadata: {
        source: documentId,
        confidence: 0.9,
        createdAt: now,
        updatedAt: now,
      },
    };
    addNode(graph, caseNode);
  }

  // Extract legal concepts
  for (const [concept, info] of Object.entries(LEGAL_CONCEPTS)) {
    const conceptRegex = new RegExp(`\\b${concept}\\b`, "gi");
    if (conceptRegex.test(text)) {
      const conceptNode: LegalNode = {
        id: `concept_${concept.replace(/\s+/g, "_")}`,
        type: "concept",
        label: concept,
        properties: {
          category: info.category,
          relatedTerms: info.relatedTerms,
        },
        metadata: {
          source: documentId,
          confidence: 0.8,
          createdAt: now,
          updatedAt: now,
        },
      };
      addNode(graph, conceptNode);

      // Add parent concept relationship
      if (info.parentConcept) {
        const parentId = `concept_${info.parentConcept.replace(/\s+/g, "_")}`;
        addEdge(graph, {
          id: `edge_${conceptNode.id}_${parentId}`,
          source: conceptNode.id,
          target: parentId,
          type: "part_of",
          weight: 0.9,
          properties: {},
        });
      }
    }
  }

  // Extract court names
  const courtMatches = text.matchAll(/(Yargıtay|Danıştay|Anayasa\s*Mahkemesi|Bölge\s*Adliye\s*Mahkemesi)(?:\s*(\d+)\.\s*(Hukuk|Ceza|İdare|Daire))?/gi);
  for (const match of courtMatches) {
    const courtName = match[0].trim();
    const courtId = courtName.toLowerCase().replace(/\s+/g, "_");

    const courtNode: LegalNode = {
      id: `court_${courtId}`,
      type: "court",
      label: courtName,
      properties: {
        chamber: match[2] ? parseInt(match[2]) : undefined,
        type: match[3],
      },
      metadata: {
        source: documentId,
        confidence: 0.95,
        createdAt: now,
        updatedAt: now,
      },
    };
    addNode(graph, courtNode);
  }

  return graph;
}

/**
 * Get concept relations from the ontology
 */
export function getConceptRelations(concept: string): ConceptRelation | null {
  const normalizedConcept = concept.toLowerCase().trim();
  const conceptInfo = LEGAL_CONCEPTS[normalizedConcept];

  if (!conceptInfo) return null;

  const relatedConcepts: ConceptRelation["relatedConcepts"] = [];

  // Find related concepts by category
  for (const [otherConcept, otherInfo] of Object.entries(LEGAL_CONCEPTS)) {
    if (otherConcept === normalizedConcept) continue;

    let strength = 0;
    let relation: EdgeType = "related_to";

    // Same category = stronger relation
    if (otherInfo.category === conceptInfo.category) {
      strength = 0.8;
    }

    // Parent-child relationship
    if (otherInfo.parentConcept === normalizedConcept) {
      relation = "part_of";
      strength = 0.95;
    } else if (conceptInfo.parentConcept === otherConcept) {
      relation = "part_of";
      strength = 0.95;
    }

    // Related terms overlap
    const termOverlap = conceptInfo.relatedTerms.some(t =>
      otherInfo.relatedTerms.includes(t)
    );
    if (termOverlap) {
      strength = Math.max(strength, 0.6);
    }

    if (strength > 0) {
      relatedConcepts.push({
        concept: otherConcept,
        relation,
        strength,
      });
    }
  }

  // Find laws related to this concept's category
  const relatedLaws: string[] = [];
  for (const [lawNum, lawInfo] of Object.entries(MAJOR_LAWS)) {
    if (lawInfo.category === conceptInfo.category) {
      relatedLaws.push(`${lawNum} sayılı ${lawInfo.name}`);
    }
  }

  return {
    concept: normalizedConcept,
    relatedConcepts: relatedConcepts.sort((a, b) => b.strength - a.strength),
    laws: relatedLaws,
    cases: [], // Would be populated from actual case database
  };
}

/**
 * Merge two knowledge graphs
 */
export function mergeGraphs(
  graph1: KnowledgeGraph,
  graph2: KnowledgeGraph
): KnowledgeGraph {
  const merged = createKnowledgeGraph();

  // Add all nodes from both graphs
  for (const node of graph1.nodes.values()) {
    addNode(merged, node);
  }
  for (const node of graph2.nodes.values()) {
    // If node exists, merge properties
    if (merged.nodes.has(node.id)) {
      const existing = merged.nodes.get(node.id)!;
      existing.properties = { ...existing.properties, ...node.properties };
      existing.metadata.updatedAt = new Date();
      existing.metadata.confidence = Math.max(
        existing.metadata.confidence,
        node.metadata.confidence
      );
    } else {
      addNode(merged, node);
    }
  }

  // Add all edges from both graphs
  for (const edge of graph1.edges.values()) {
    addEdge(merged, edge);
  }
  for (const edge of graph2.edges.values()) {
    if (!merged.edges.has(edge.id)) {
      addEdge(merged, edge);
    }
  }

  return merged;
}

/**
 * Export graph to a serializable format
 */
export function exportGraph(graph: KnowledgeGraph): {
  nodes: LegalNode[];
  edges: LegalEdge[];
} {
  return {
    nodes: Array.from(graph.nodes.values()),
    edges: Array.from(graph.edges.values()),
  };
}

/**
 * Import graph from serialized format
 */
export function importGraph(data: {
  nodes: LegalNode[];
  edges: LegalEdge[];
}): KnowledgeGraph {
  const graph = createKnowledgeGraph();

  for (const node of data.nodes) {
    addNode(graph, node);
  }

  for (const edge of data.edges) {
    addEdge(graph, edge);
  }

  return graph;
}

/**
 * Find all laws that reference or are referenced by a given law
 */
export function findRelatedLaws(lawNumber: string): string[] {
  const lawInfo = MAJOR_LAWS[lawNumber];
  if (!lawInfo) return [];

  const related = new Set<string>();

  // Add directly related laws
  for (const relatedNum of lawInfo.relatedLaws) {
    related.add(String(relatedNum));
  }

  // Add laws that reference this law
  for (const [otherNum, otherInfo] of Object.entries(MAJOR_LAWS)) {
    if (otherInfo.relatedLaws.includes(parseInt(lawNumber))) {
      related.add(otherNum);
    }
  }

  return Array.from(related);
}

/**
 * Get law information from ontology
 */
export function getLawInfo(lawNumber: string): {
  name: string;
  number: number;
  category: string;
  relatedLaws: Array<{ number: number; name: string }>;
} | null {
  const lawInfo = MAJOR_LAWS[lawNumber];
  if (!lawInfo) return null;

  return {
    name: lawInfo.name,
    number: lawInfo.number,
    category: lawInfo.category,
    relatedLaws: lawInfo.relatedLaws
      .map(num => {
        const related = MAJOR_LAWS[String(num)];
        return related ? { number: num, name: related.name } : null;
      })
      .filter((x): x is { number: number; name: string } => x !== null),
  };
}

/**
 * Find concepts by category
 */
export function findConceptsByCategory(category: string): string[] {
  return Object.entries(LEGAL_CONCEPTS)
    .filter(([, info]) => info.category === category)
    .map(([concept]) => concept);
}

/**
 * Get all legal categories
 */
export function getLegalCategories(): string[] {
  const categories = new Set<string>();
  for (const info of Object.values(LEGAL_CONCEPTS)) {
    categories.add(info.category);
  }
  return Array.from(categories);
}
