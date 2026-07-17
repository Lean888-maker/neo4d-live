import axios from 'axios';

// WordPress REST API Integration
export async function publishToWordPress(articleData) {
  const wpDomain = process.env.WP_DOMAIN; // e.g., https://my-neo4d-blog.wordpress.com
  const wpUsername = process.env.WP_USERNAME;
  const wpAppPassword = process.env.WP_APP_PASSWORD;

  if (!wpDomain || !wpUsername || !wpAppPassword) return false;

  try {
    console.log(`Publishing "${articleData.title}" to WordPress...`);
    const auth = Buffer.from(`${wpUsername}:${wpAppPassword}`).toString('base64');
    
    // Convert Markdown to simple HTML for WordPress
    const htmlContent = articleData.finalContent
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/\n\n/g, '<p></p>');

    const postRes = await axios.post(`${wpDomain}/wp-json/wp/v2/posts`, {
      title: articleData.title,
      content: htmlContent,
      status: "publish"
    }, {
      headers: { Authorization: `Basic ${auth}` }
    });

    console.log(`✅ Successfully published to WordPress: ${postRes.data.link}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to publish to WordPress:", error.message);
    return false;
  }
}
