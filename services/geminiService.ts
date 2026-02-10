import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { MODEL_NAME, SYSTEM_INSTRUCTION } from "../constants";
import { GroundingChunk } from "../types";

class GeminiService {
  private ai: GoogleGenAI;
  private chatSession: Chat | null = null;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing from environment variables");
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  public initializeChat() {
    this.chatSession = this.ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], // Enable Search for live odds
      },
    });
  }

  public async sendMessageStream(
    message: string,
    onChunk: (text: string) => void,
    onComplete: (fullText: string, groundingChunks?: GroundingChunk[]) => void,
    onError: (error: Error) => void
  ) {
    if (!this.chatSession) {
      this.initializeChat();
    }

    try {
      const resultStream = await this.chatSession!.sendMessageStream({ message });
      
      let fullText = '';
      let allGroundingChunks: GroundingChunk[] = [];

      for await (const chunk of resultStream) {
        const c = chunk as GenerateContentResponse;
        const textPart = c.text;
        
        if (textPart) {
          fullText += textPart;
          onChunk(fullText);
        }

        // Collect grounding metadata if present
        if (c.candidates?.[0]?.groundingMetadata?.groundingChunks) {
          // Flatten and add unique chunks if necessary, but usually we just want the final set or accumulation
          // The API often sends grounding info in the final chunk or throughout. 
          // We will accumulate them.
          const chunks = c.candidates[0].groundingMetadata.groundingChunks as GroundingChunk[];
          allGroundingChunks = [...allGroundingChunks, ...chunks];
        }
      }

      onComplete(fullText, allGroundingChunks.length > 0 ? allGroundingChunks : undefined);
    } catch (error) {
      console.error("Error in Gemini Stream:", error);
      onError(error instanceof Error ? error : new Error("Unknown error occurred"));
    }
  }

  public resetChat() {
    this.initializeChat();
  }
}

export const geminiService = new GeminiService();
