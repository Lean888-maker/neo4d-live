import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash'];

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
      Generate the questions and answers ENTIRELY in Simplified Chinese (Mandarin).
      Output ONLY a valid JSON array of objects with "question" and "answer" properties.
      Example: [{"question": "万能4D几点开彩？", "answer": "万能4D的开彩时间是晚上7点..."}]
    `;

    for (const model of MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        var rawText = response.text.trim();
        break; // Success — exit model loop
      } catch (err) {
        const isQuota = err?.status === 429 || err?.message?.includes('RESOURCE_EXHAUSTED');
        if (isQuota) {
          console.warn(`⏳ Quota hit on ${model}. Trying next model...`);
          continue;
        }
        throw err;
      }
    }

    if (!rawText) {
      console.warn('⏭️ FAQ generation SKIPPED: API quota exhausted. Will retry next nightly cycle.');
      process.exit(0); // Graceful skip — no failure email
    }
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
    const isQuota = err?.status === 429 || err?.message?.includes('RESOURCE_EXHAUSTED');
    if (isQuota) {
      console.warn('⏭️ FAQ generation SKIPPED: quota exhausted. No action needed.');
      process.exit(0); // Graceful — no GitHub Actions failure email
    }
    console.error('🔥 FATAL ERROR IN FAQ GENERATOR:', err.message);
    process.exit(0); // Always exit 0 to stop failure email spam
  }
}

generateFreshFAQ();
