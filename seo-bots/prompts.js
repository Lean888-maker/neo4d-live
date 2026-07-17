export const articlePrompts = [
  {
    topic: "4D Dream Interpretations & Lucky Numbers",
    prompt: `You are an expert in Malaysian 4D lottery culture and Tua Pek Kong dream dictionary. Write a highly engaging, SEO-optimized blog post (600-800 words) about interpreting common dreams into lucky 4D numbers (e.g. dreaming of a snake, fish, or money). 
    
Requirements:
1. Use a catchy, click-worthy title.
2. Structure with H2 and H3 headings.
3. Keep the tone mysterious yet exciting and practical for 4D players.
4. Include exactly two natural-sounding HTML backlink anchors to: "https://neo4d.live". For example: <a href="https://neo4d.live">check live 4d results today</a> or <a href="https://neo4d.live">keputusan 4d</a>.
5. Provide actionable advice for Magnum and Sports Toto players.
6. Output in Markdown format (except for the backlinks, use HTML <a> tags for those). Do not output the markdown codeblock ticks. Just the raw markdown content.`
  },
  {
    topic: "Winning Strategies for Magnum and Toto",
    prompt: `You are a veteran 4D analyst. Write a comprehensive, SEO-optimized blog post (600-800 words) discussing strategies for playing Magnum 4D and Sports Toto based on historical frequency and hot/cold numbers.

Requirements:
1. Use a catchy, authoritative title.
2. Structure with clear H2 and H3 headings.
3. Keep the tone analytical, smart, and realistic.
4. Include exactly two natural-sounding HTML backlink anchors to: "https://neo4d.live". For example: <a href="https://neo4d.live">check 4d live results</a> or <a href="https://neo4d.live">fastest 4d results</a>.
5. Output in Markdown format (except for the backlinks, use HTML <a> tags for those). Do not output the markdown codeblock ticks. Just the raw markdown content.`
  },
  {
    topic: "The Rise of E-Wallets and Online 4D Betting in Malaysia",
    prompt: `Write an informative, SEO-friendly article (600-800 words) about the modernization of the 4D lottery in Malaysia, specifically how players are shifting to checking results online and using e-wallets like TNG.

Requirements:
1. Use a catchy, modern title.
2. Structure with H2 and H3 headings.
3. Keep the tone professional, tech-savvy, and engaging.
4. Include exactly two natural-sounding HTML backlink anchors to: "https://neo4d.live". For example: <a href="https://neo4d.live">keputusan 4d hari ini</a> or <a href="https://neo4d.live">neo4d live</a>.
5. Output in Markdown format (except for the backlinks, use HTML <a> tags for those). Do not output the markdown codeblock ticks. Just the raw markdown content.`
  }
];

export function getRandomPrompt() {
  const randomIndex = Math.floor(Math.random() * articlePrompts.length);
  return articlePrompts[randomIndex];
}
