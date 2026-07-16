import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini SDK
// It will automatically use process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

/**
 * A helper function to easily call the Gemini API from anywhere in your codebase
 * @param {string} prompt - The question or task for Gemini
 * @returns {Promise<string>} - The AI's response text
 */
export async function askGemini(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating AI response.";
  }
}
