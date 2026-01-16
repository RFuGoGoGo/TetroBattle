
import { GoogleGenAI } from "@google/genai";

// 安全地獲取 API Key，防止 ReferenceError
const getApiKey = () => {
  try {
    return process.env.API_KEY || "";
  } catch (e) {
    return "";
  }
};

const apiKey = getApiKey();
// 只有在有 API Key 的情況下才初始化 AI
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function getGameCommentary(score: number, lines: number, level: number, event: string) {
  if (!ai) {
    console.warn("Gemini API Key missing. Commentary disabled.");
    return "Keep it up!";
  }

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
    return "Nice move!";
  }
}
