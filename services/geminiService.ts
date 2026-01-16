
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getGameCommentary(score: number, lines: number, level: number, event: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a high-energy esports commentator for a massive multiplayer Tetris battle. 
      The current player state: Score ${score}, Lines ${lines}, Level ${level}. 
      Just happened: ${event}. 
      Give a very short (max 10 words) hype shoutout or tactical tip.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text?.trim() || "Unbelievable play!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Keep pushing!";
  }
}
