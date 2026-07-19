export const articlePrompts = [
  {
    topic: "4D Dream Interpretations & Lucky Numbers",
    prompt: `You are an expert in Malaysian 4D lottery culture and Tua Pek Kong dream dictionary. Write a highly engaging, SEO-optimized blog post (600-800 words) about interpreting common dreams into lucky 4D numbers (e.g. dreaming of a snake, fish, or money). 
    
Requirements:
1. Write the ENTIRE blog post in Simplified Chinese (Mandarin), suitable for a Malaysian audience.
2. Use a catchy, click-worthy title in Chinese.
3. Structure with H2 and H3 headings.
4. Keep the tone mysterious yet exciting and practical for 4D players.
5. Include exactly two natural-sounding HTML backlink anchors to: "https://neo4d.live". For example: <a href="https://neo4d.live">今日4D成绩</a> or <a href="https://neo4d.live">最新4D开奖</a>.
6. Provide actionable advice for Magnum and Sports Toto players.
7. Output in Markdown format (except for the backlinks, use HTML <a> tags for those). Do not output the markdown codeblock ticks. Just the raw markdown content.`
  },
  {
    topic: "Winning Strategies for Magnum and Toto",
    prompt: `You are a veteran 4D analyst. Write a comprehensive, SEO-optimized blog post (600-800 words) discussing strategies for playing Magnum 4D and Sports Toto based on historical frequency and hot/cold numbers.

Requirements:
1. Write the ENTIRE blog post in Simplified Chinese (Mandarin), suitable for a Malaysian audience.
2. Use a catchy, authoritative title in Chinese.
3. Structure with clear H2 and H3 headings.
4. Keep the tone analytical, smart, and realistic.
5. Include exactly two natural-sounding HTML backlink anchors to: "https://neo4d.live". For example: <a href="https://neo4d.live">万能4D成绩</a> or <a href="https://neo4d.live">最快4D开奖</a>.
6. Output in Markdown format (except for the backlinks, use HTML <a> tags for those). Do not output the markdown codeblock ticks. Just the raw markdown content.`
  },
  {
    topic: "The Rise of E-Wallets and Online 4D Betting in Malaysia",
    prompt: `Write an informative, SEO-friendly article (600-800 words) about the modernization of the 4D lottery in Malaysia, specifically how players are shifting to checking results online and using e-wallets like TNG.

Requirements:
1. Write the ENTIRE blog post in Simplified Chinese (Mandarin), suitable for a Malaysian audience.
2. Use a catchy, modern title in Chinese.
3. Structure with H2 and H3 headings.
4. Keep the tone professional, tech-savvy, and engaging.
5. Include exactly two natural-sounding HTML backlink anchors to: "https://neo4d.live". For example: <a href="https://neo4d.live">大马彩最新成绩</a> or <a href="https://neo4d.live">网上买4D</a>.
6. Output in Markdown format (except for the backlinks, use HTML <a> tags for those). Do not output the markdown codeblock ticks. Just the raw markdown content.`
  },
  {
    topic: "Live 4D Draw Today - Instant Results",
    prompt: `Write a high-urgency, highly engaging SEO blog post (600-800 words) announcing that today is a 4D draw day in Malaysia. Build excitement and direct readers to check their results live as they happen.

Requirements:
1. Write the ENTIRE blog post in Simplified Chinese (Mandarin), suitable for a Malaysian audience.
2. Use an extremely urgent, click-worthy title (e.g., "【现场直击】今日4D开彩...").
3. Emphasize that results for Magnum (万能), Sports Toto (多多), and Da Ma Cai (大马彩) are rolling out LIVE tonight at 7:00 PM.
4. Keep the tone thrilling, urgent, and fast-paced.
5. Include exactly two natural-sounding HTML backlink anchors directing users to check results NOW: "https://neo4d.live". For example: <a href="https://neo4d.live">今日4D现场直播</a> or <a href="https://neo4d.live">立即查看万字票开奖</a>.
6. Output in Markdown format (except for the backlinks, use HTML <a> tags for those). Do not output the markdown codeblock ticks. Just the raw markdown content.`
  }
];

export function getRandomPrompt() {
  const randomIndex = Math.floor(Math.random() * articlePrompts.length);
  return articlePrompts[randomIndex];
}
