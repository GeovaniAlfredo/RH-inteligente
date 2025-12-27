
import { GoogleGenAI, Type } from "@google/genai";
import { JobDescription, CVAnalysis, InterviewGuide } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateJobDescription = async (prompt: string): Promise<JobDescription> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Gere uma descrição de vaga detalhada baseada no seguinte input: ${prompt}. Retorne em JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          department: { type: Type.STRING },
          seniority: { type: Type.STRING },
          description: { type: Type.STRING },
          requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
          responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
          benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "department", "seniority", "description", "requirements", "responsibilities", "benefits"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const analyzeCV = async (jd: string, cvText: string): Promise<CVAnalysis> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Compare o seguinte currículo com a descrição da vaga fornecida.
    Descrição da Vaga: ${jd}
    Texto do Currículo: ${cvText}
    
    Analise a compatibilidade técnica e de experiência. Retorne um JSON com a pontuação de 0 a 100.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          candidateName: { type: Type.STRING },
          score: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          isCompatible: { type: Type.BOOLEAN }
        },
        required: ["candidateName", "score", "reasoning", "pros", "cons", "isCompatible"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateInterviewGuide = async (jd: string): Promise<InterviewGuide> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Crie um roteiro inteligente de entrevista para a seguinte vaga: ${jd}. 
    Inclua perguntas técnicas, comportamentais e de fit cultural. Retorne em JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          jobTitle: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                question: { type: Type.STRING },
                expectedAnswer: { type: Type.STRING }
              },
              required: ["category", "question", "expectedAnswer"]
            }
          }
        },
        required: ["jobTitle", "questions"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
