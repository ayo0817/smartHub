import { GoogleGenAI } from "@google/genai";

const apikey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apikey || "" });
const modelName = "gemini-3.1-pro-preview";

export async function summarizeText(text: string) {
  const result = await ai.models.generateContent({
    model: modelName,
    contents: `Summarize the following lecture notes into key bullet points and a brief overview:\n\n${text}`,
  });
  return result.text;
}

export async function generateQuiz(text: string) {
  const result = await ai.models.generateContent({
    model: modelName,
    contents: `Generate 5 multiple-choice questions based on the following text. Return the response in JSON format with the following structure:
    [{ "question": "...", "options": ["...", "...", "...", "..."], "answer": "..." }]
    
    Text: ${text}`,
    config: {
      responseMimeType: "application/json",
    }
  });
  return JSON.parse(result.text || "[]");
}

export async function explainConcept(concept: string) {
  const result = await ai.models.generateContent({
    model: modelName,
    contents: `Explain the following concept in simple terms for a student: ${concept}`,
  });
  return result.text;
}
