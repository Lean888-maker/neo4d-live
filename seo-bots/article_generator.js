import { GoogleGenAI } from '@google/genai';
import { getRandomPrompt } from './prompts.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure you set GEMINI_API_KEY in your environment variables before running
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateArticle() {
  try {
    const { topic, prompt } = getRandomPrompt();
    console.log(`Generating SEO article for topic: "${topic}"...`);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const articleContent = response.text;
    
    // Extract a title from the first line (assuming the LLM puts # Title at the top)
    const firstLine = articleContent.split('\n')[0].replace(/#/g, '').trim();
    const slug = firstLine.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const date = new Date().toISOString().split('T')[0];
    
    // Format the final file content with some frontmatter for Jekyll/Hugo/Next.js blogs
    const finalContent = `---
title: "${firstLine}"
date: "${date}"
topic: "${topic}"
---

${articleContent}
`;

    // Ensure output directory exists
    const outDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const filePath = path.join(outDir, `${date}-${slug}.md`);
    fs.writeFileSync(filePath, finalContent, 'utf-8');
    
    console.log(`✅ Article generated and saved to: ${filePath}`);
    return { filePath, finalContent, title: firstLine, slug };
    
  } catch (error) {
    console.error('Error generating article:', error);
    throw error;
  }
}

// Allow running directly via `node article_generator.js`
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateArticle();
}
