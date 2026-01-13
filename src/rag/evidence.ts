// src/rag/evidence.ts
import { Content } from "@google/genai";

export interface EvidenceSource {
  title: string;
  uri: string;
}

export interface GroundingMetadata {
  webSearchQueries?: string[];
  searchEntryPoint?: {
    renderedContent?: string;
  };
  groundingChunks?: {
    web?: {
      uri?: string;
      title?: string;
    };
  }[];
  groundingSupports?: {
    segment?: {
      startIndex?: number;
      endIndex?: number;
    };
    groundingChunkIndices?: number[];
    confidenceScores?: number[];
  }[];
}

export interface EvidenceResponse {
  answerText: string;
  groundingMetadata?: GroundingMetadata | null;
  sources: EvidenceSource[];
  rawGroundingMetadata?: GroundingMetadata | null;
}

export interface EvidenceProvider {
  getEvidenceAndAnswer(
    conversationId: string,
    messages: Content[]
  ): Promise<EvidenceResponse>;
}
