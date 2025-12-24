
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from './constants';
import { CommContext, Tone, TransformationResult, BrandConfig } from './types';

export const transformCommunication = async (
  rawText: string,
  context: CommContext,
  tone: Tone,
  brand: BrandConfig
): Promise<TransformationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Brand Name: ${brand.name}
    Brand Core Values: ${brand.coreValues}
    Communication Context: ${context}
    Target Tone: ${tone}
    
    Original Draft:
    "${rawText}"
    
    Please provide the polished version and communication tips.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            revisedText: { type: Type.STRING },
            tips: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            toneAnalysis: {
              type: Type.OBJECT,
              properties: {
                professionalism: { type: Type.NUMBER },
                clarity: { type: Type.NUMBER },
                warmth: { type: Type.NUMBER }
              },
              required: ["professionalism", "clarity", "warmth"]
            }
          },
          required: ["revisedText", "tips", "toneAnalysis"]
        }
      },
    });

    const data = JSON.parse(response.text || '{}');
    return data as TransformationResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to transform text. Please try again.");
  }
};
