import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export default async function getAIResponse(query) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: query }] }],
      config: {
        systemInstruction: "You are an AI. Your name is ChadGPT.",
      },
    });

    return response.text;
  } catch (err) {
    console.log(err);
  }
}
