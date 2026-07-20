import { GoogleGenAI } from '@google/genai';
import { getRandomPrompt } from './prompts.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Models to try in order: prefer 2.0-flash, fall back to 1.5-flash
const MODEL_FALLBACK_CHAIN = ['gemini-2.0-flash', 'gemini-1.5-flash'];

/**
 * Generate content with automatic retry + model fallback.
 * On quota (429) errors: waits then retries; if exhausted, exits 0 (no CI failure email).
 */
async function generateWithRetry(prompt, maxRetries = 2) {
  for (const model of MODEL_FALLBACK_CHAIN) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`  Trying model: ${model}, attempt ${attempt}/${maxRetries}...`);
        const response = await ai.models.generateContent({ model, contents: prompt });
        console.log(`  ✅ Success with model: ${model}`);
        return response.text;
      } catch (err) {
        const isQuota = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED');
        const isInvalid = err?.status === 400 || err?.message?.includes('not found') || err?.message?.includes('not supported');

        if (isQuota) {
          const retryAfterMatch = err?.message?.match(/retryDelay.*?(\d+)s/);
          const waitMs = retryAfterMatch ? parseInt(retryAfterMatch[1]) * 1000 + 2000 : 60000;
          if (attempt < maxRetries) {
            console.warn(`  ⏳ Quota hit. Waiting ${Math.round(waitMs / 1000)}s before retry...`);
            await new Promise(r => setTimeout(r, waitMs));
          } else {
            console.warn(`  ⚠️ Quota exhausted on model ${model}. Trying next model...`);
          }
        } else if (isInvalid) {
          console.warn(`  ⚠️ Model ${model} invalid/unavailable. Trying next model...`);
          break; // Try next model immediately
        } else {
          throw err; // Non-quota error, propagate
        }
      }
    }
  }
  return null; // All models and retries exhausted
}

export async function generateArticle() {
  const { topic, prompt } = getRandomPrompt();
  console.log(`Generating SEO article for topic: "${topic}"...`);

  const articleContent = await generateWithRetry(prompt);

  if (!articleContent) {
    // Quota exhausted on all models — skip gracefully, DO NOT throw
    console.warn('⏭️ SKIPPING article generation: API quota exhausted on all models. Will retry next cycle.');
    return null;
  }

  const firstLine = articleContent.split('\n')[0].replace(/#/g, '').trim();
  const slug = firstLine.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const date = new Date().toISOString().split('T')[0];

  const finalContent = `---
title: "${firstLine}"
date: "${date}"
topic: "${topic}"
---

${articleContent}
`;

  const outDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const filePath = path.join(outDir, `${date}-${slug}.md`);
  fs.writeFileSync(filePath, finalContent, 'utf-8');

  console.log(`✅ Article generated and saved to: ${filePath}`);
  return { filePath, finalContent, title: firstLine, slug };
}

// Allow running directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateArticle().catch(err => {
    console.error('🔥 Unexpected error in article generator:', err.message);
    process.exit(0); // Always exit 0 to prevent GitHub Actions failure emails
  });
}
