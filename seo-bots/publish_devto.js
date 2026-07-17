import axios from 'axios';

// Dev.to Integration
export async function publishToDevTo(articleData) {
  const apiKey = process.env.DEVTO_API_KEY;
  if (!apiKey) return false;

  try {
    console.log(`Publishing "${articleData.title}" to Dev.to...`);
    const postRes = await axios.post('https://dev.to/api/articles', {
      article: {
        title: articleData.title,
        body_markdown: articleData.finalContent,
        published: true,
        tags: ["webdev", "tutorial", "javascript", "programming"] // Dev.to requires tech tags
      }
    }, {
      headers: { 'api-key': apiKey }
    });
    console.log(`✅ Successfully published to Dev.to: ${postRes.data.url}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to publish to Dev.to:", error.message);
    return false;
  }
}
