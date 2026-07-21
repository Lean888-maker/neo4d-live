export async function getDailyAIContent(type) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
  }

  const prompt = type === 'predictions' 
    ? "Generate a detailed 600-word daily 4D prediction article for lottery players in Malaysia and Singapore. Talk about hot numbers, cold numbers, and general statistical luck trends for today. Write in Chinese (Simplified). Use an exciting, lucky tone with plenty of emojis. Structure it with clear subheadings (e.g. 今日幸运号码, 生肖财运, 投注建议) and return in clean HTML tags for formatting."
    : "Generate a detailed 600-word article explaining the lucky 4D meanings behind a random common dream topic (e.g., dreaming of gold, dreaming of swimming, dreaming of snakes, dreaming of catching fish). Explain what the dream represents traditionally and what lucky 4D numbers are associated with it. Write in Chinese (Simplified). Use a mysterious, traditional, and helpful tone. Structure it with clear subheadings (e.g. 梦境解析, 传统典故, 推荐吉数) and return in clean HTML tags for formatting.";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

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
    console.error(`Gemini API error: ${response.status} - ${errorBody}`);
    
    // FALLBACK CONTENT to prevent 500 Server Errors when quota is exhausted
    if (type === 'predictions') {
      return `
        <h2>🎯 今日幸运号码趋势 (Today's Lucky Numbers)</h2>
        <p>亲爱的彩民朋友，根据历史开彩数据统计，近期 <strong>7</strong> 和 <strong>3</strong> 的出现频率极高，属于热门幸运数字！可以多留意 73XX 或 XX37 的组合。</p>
        <h2>💰 投注小建议</h2>
        <p>小赌怡情，大赌伤身。建议根据自己的生肖幸运数字进行搭配组合，愿您今日财源广进，好运连连！✨</p>
      `;
    } else {
      return `
        <h2>🌙 梦境解析与吉数 (Dream Interpretation)</h2>
        <p>梦境是潜意识的暗示，如果您昨晚梦见了水、鱼或金银财宝，在传统大伯公解梦中，这些都代表着 <strong>财运亨通</strong>！</p>
        <h2>🔢 推荐吉数</h2>
        <p>对于代表财富的梦境，推荐尝试 <strong>8823</strong> 或 <strong>1688</strong>，祝您梦想成真，好运降临！✨</p>
      `;
    }
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  return text;
}
