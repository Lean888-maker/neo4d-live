export async function getDailyAIContent(type) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
  }

  const prompt = type === 'predictions' 
    ? "Generate a detailed 600-word daily 4D prediction article for lottery players in Malaysia and Singapore. Talk about hot numbers, cold numbers, and general statistical luck trends for today. Write in Chinese (Simplified). Use an exciting, lucky tone with plenty of emojis. Structure it with clear subheadings (e.g. 今日幸运号码, 生肖财运, 投注建议) and return in clean HTML tags for formatting."
    : "Generate a detailed 600-word article explaining the lucky 4D meanings behind a random common dream topic (e.g., dreaming of gold, dreaming of swimming, dreaming of snakes, dreaming of catching fish). Explain what the dream represents traditionally and what lucky 4D numbers are associated with it. Write in Chinese (Simplified). Use a mysterious, traditional, and helpful tone. Structure it with clear subheadings (e.g. 梦境解析, 传统典故, 推荐吉数) and return in clean HTML tags for formatting.";

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    }),
    next: { revalidate: 43200 } // Cache this fetch result in Next.js for 12 hours
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text;
}
