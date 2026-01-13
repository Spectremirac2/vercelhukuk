import { EvidenceProvider, EvidenceResponse, EvidenceSource } from "./evidence";
import { GoogleGenAI, Content } from "@google/genai";

interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export class WebSearchEvidenceProvider implements EvidenceProvider {
  private client: GoogleGenAI;
  private modelName: string;

  constructor(apiKey: string, modelName: string = "gemini-2.0-flash-exp") {
    this.client = new GoogleGenAI({ apiKey });
    this.modelName = modelName;
  }

  async getEvidenceAndAnswer(
    _conversationId: string,
    messages: Content[]
  ): Promise<EvidenceResponse> {
    try {
      const result = await this.client.models.generateContent({
        model: this.modelName,
        contents: messages,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const response = result.candidates?.[0];
      if (!response) {
        throw new Error("No response from Gemini");
      }

      const textPart = response.content?.parts?.find((p) => p.text);
      const answerText = textPart?.text || "No answer generated.";

      const groundingMetadata = response.groundingMetadata;

      const sources: EvidenceSource[] =
        groundingMetadata?.groundingChunks
          ?.map((chunk: GroundingChunk) => {
            if (chunk.web) {
              return {
                title: chunk.web.title || "",
                uri: chunk.web.uri || "",
              };
            }
            return null;
          })
          .filter((s): s is EvidenceSource => s !== null) || [];

      // Deduplicate sources
      const uniqueSources = Array.from(
        new Map(sources.map((s) => [s.uri, s])).values()
      );

      return {
        answerText,
        groundingMetadata,
        sources: uniqueSources,
        rawGroundingMetadata: groundingMetadata,
      };
    } catch (error) {
      console.error("Error in WebSearchEvidenceProvider:", error);
      throw error;
    }
  }
}
