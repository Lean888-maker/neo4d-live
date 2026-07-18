import axios from 'axios';

// Tumblr Integration
export async function publishToTumblr(articleData) {
  const blogIdentifier = process.env.TUMBLR_BLOG_ID; // e.g., neo4d.tumblr.com
  const apiKey = process.env.TUMBLR_API_KEY;
  if (!apiKey || !blogIdentifier) return false;

  try {
    console.log(`Publishing "${articleData.title}" to Tumblr...`);
    // Note: Tumblr uses OAuth1/2 for posting, this requires a proxy or full OAuth library in production.
    // We mock the REST structure here for the bot framework.
    const postRes = await axios.post(`https://api.tumblr.com/v2/blog/${blogIdentifier}/post`, {
      type: "text",
      title: articleData.title,
      body: articleData.finalContent,
      format: "markdown",
      tags: "4d, 万字票, 万能, 多多, 大马彩, 今日4d成绩"
    }, {
      headers: { Authorization: `Bearer ${process.env.TUMBLR_OAUTH_TOKEN}` }
    });
    console.log(`✅ Successfully published to Tumblr!`);
    return true;
  } catch (error) {
    console.error("❌ Failed to publish to Tumblr:", error.message);
    return false;
  }
}
