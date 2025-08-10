
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might have better error handling or fallback.
  // For this context, we assume the key is present.
  console.warn("API_KEY environment variable not set. Gemini features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateTangerineName = async (skinName: string): Promise<string> => {
  if (!API_KEY) {
    return "멋진 귤 껍질 작품"; // Fallback name
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `"${skinName}" 스킨을 사용해서 귤을 까서 만든 예술 작품이야. 이 작품에 대한 짧고, 창의적이고, 기발한 이름을 한국어로 딱 하나만 지어줘.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: 'The creative name for the artwork.',
            },
          },
        },
        temperature: 1,
        topP: 0.95,
      }
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);

    if (parsed && typeof parsed.name === 'string' && parsed.name.length > 0) {
      return parsed.name;
    }
    
    // Fallback if parsing fails or name is empty
    return "기묘한 귤 조각";

  } catch (error) {
    console.error("Error generating name with Gemini:", error);
    return "AI가 지쳐버린 작품"; // Return a fallback name on error
  }
};
