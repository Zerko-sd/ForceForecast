import { GeneratedContent } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function generateContent(prompt: string): Promise<GeneratedContent | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Mission Directive: ${prompt}\nGenerate a JSON object with:\n- schedule: an array of objects with time, task, and priority for a productive day\n- goals: an array of 3 ambitious goals\n- journalPrompt: a single motivational journal prompt.\nRespond ONLY with valid JSON.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  task: { type: Type.STRING },
                  priority: { type: Type.STRING },
                },
                propertyOrdering: ['time', 'task', 'priority'],
              },
            },
            goals: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            journalPrompt: { type: Type.STRING },
          },
          propertyOrdering: ['schedule', 'goals', 'journalPrompt'],
        },
      },
    });
    console.log(response.text);
    return JSON.parse(response.text ?? '{}');
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
}

export function getDefaultPrompt(): string {
  const defaultPrompts = [
    'Crush today with maximum output and zero mercy.',
    'Dominate every obstacle and emerge victorious.',
    'Transform weakness into power and fear into strength.',
    'Execute with precision and eliminate all inefficiencies.'
  ];
  return defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)];
}