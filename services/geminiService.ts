
import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, QuizQuestion } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quizSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: 'The question text.'
      },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'An array of 4 possible answers.'
      },
      correctAnswerIndex: {
        type: Type.INTEGER,
        description: 'The index (0-3) of the correct answer in the options array.'
      },
      explanation: {
        type: Type.STRING,
        description: 'A brief explanation for why the correct answer is right.'
      }
    },
    required: ['question', 'options', 'correctAnswerIndex', 'explanation']
  }
};

export async function generateQuiz(topic: string, difficulty: Difficulty): Promise<QuizQuestion[]> {
  const prompt = `Generate a 10-question multiple-choice quiz about "${topic}". 
The difficulty level should be "${difficulty}". 
Each question must have exactly 4 options.
For each question, also provide a brief explanation for the correct answer.
The response must follow the provided JSON schema.
Ensure the questions are relevant, clear, and the correct answer index is accurate.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const quizData = JSON.parse(jsonText);

    // Basic validation
    if (!Array.isArray(quizData) || quizData.some(q => !q.question || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correctAnswerIndex !== 'number' || !q.explanation)) {
      throw new Error("Received malformed quiz data from API.");
    }
    
    return quizData as QuizQuestion[];

  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to communicate with the AI to generate a quiz. Please check your connection or API key and try again.");
  }
}
