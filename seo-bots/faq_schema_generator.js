import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * FAQ Schema Generator
 * Nightly bot that generates fresh Q&A for Google's "People Also Ask" boxes.
 * It updates a JSON file that Next.js uses to render dynamic structured data.
 */
async function generateFreshFAQ() {
  console.log("🧠 STARTING FAQ SCHEMA GENERATOR...");

  try {
    const prompt = `
      You are an expert SEO for a Malaysian 4D lottery website.
      Generate 3 highly searched, trending questions related to 4D lotteries (e.g., Magnum, Toto, Da Ma Cai, Dream Numbers, Carta Ramalan).
      Provide a concise, accurate answer for each.
      Output ONLY a valid JSON array of objects with "question" and "answer" properties.
      Example: [{"question": "What time is Magnum 4D draw?", "answer": "The Magnum 4D draw starts at 7:00 PM..."}]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    const rawText = response.text.trim();
    const jsonMatch = rawText.match(/\[.*\]/s);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Gemini response.");
    }

    const newFaqs = JSON.parse(jsonMatch[0]);
    console.log(`✅ Generated ${newFaqs.length} new FAQ entries.`);

    const dataPath = path.resolve(process.cwd(), 'src/app/data/faq_schema.json');
    
    // Ensure directory exists
    if (!fs.existsSync(path.dirname(dataPath))) {
      fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    }

    // Merge with existing or keep a rolling window of the 10 freshest questions
    let existingFaqs = [];
    if (fs.existsSync(dataPath)) {
      existingFaqs = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }

    // Add new to the top, keep max 10
    const mergedFaqs = [...newFaqs, ...existingFaqs].slice(0, 10);

    fs.writeFileSync(dataPath, JSON.stringify(mergedFaqs, null, 2));
    console.log("✅ Successfully updated FAQ Schema JSON file.");

  } catch (err) {
    console.error("🔥 FATAL ERROR IN FAQ GENERATOR:", err.message);
    process.exit(1);
  }
}

generateFreshFAQ();
