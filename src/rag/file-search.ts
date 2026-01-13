import { EvidenceProvider, EvidenceResponse, EvidenceSource } from "./evidence";
import { Content } from "@google/genai";
import { geminiClient } from "@/utils/gemini-client";

interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  uri?: string;
}

export class FileSearchEvidenceProvider implements EvidenceProvider {
  private modelName: string;
  private storeId: string;

  constructor(_apiKey: string, storeId: string, modelName: string = "gemini-2.0-flash-exp") {
    this.modelName = modelName;
    this.storeId = storeId;
  }

  async getEvidenceAndAnswer(
    _conversationId: string,
    messages: Content[]
  ): Promise<EvidenceResponse> {
    if (!this.storeId) {
      throw new Error("Store ID is required for File Search");
    }

    try {
      console.log(`Querying File Search Store: ${this.storeId}`);

      const result = await geminiClient.models.generateContent({
        model: this.modelName,
        contents: messages,
        config: {
          tools: [
            {
              fileSearch: {
                fileSearchStoreNames: [this.storeId],
              },
            },
          ],
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
              return { title: chunk.web.title || "", uri: chunk.web.uri || "" };
            }
            if (chunk.uri) {
              return { title: "Uploaded Document", uri: chunk.uri };
            }
            return null;
          })
          .filter((s): s is EvidenceSource => s !== null) || [];

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
      console.error("Error in FileSearchEvidenceProvider:", error);
      throw error;
    }
  }
}
