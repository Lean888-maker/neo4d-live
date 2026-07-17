import axios from 'axios';

// Blogger Integration
// Requires BLOGGER_API_KEY and BLOG_ID to be set in environment variables
export async function publishToBlogger(articleData) {
  const apiKey = process.env.BLOGGER_API_KEY;
  const blogId = process.env.BLOG_ID;
  
  if (!apiKey || !blogId) {
    console.warn("⚠️ BLOGGER_API_KEY or BLOG_ID not found. Skipping Blogger publish.");
    return false;
  }

  try {
    console.log(`Publishing "${articleData.title}" to Blogger...`);
    
    // Blogger API requires HTML, so we do a simple replace of our Markdown output
    // A proper implementation would use marked.js to convert md -> html, but this works for basic output
    const htmlContent = articleData.finalContent
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/\n\n/g, '<br><br>');
      
    const postRes = await axios.post(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/?key=${apiKey}`, {
      kind: "blogger#post",
      blog: {
        id: blogId
      },
      title: articleData.title,
      content: htmlContent,
      labels: ["4D Results", "Magnum", "Toto", "Da Ma Cai"]
    });

    console.log(`✅ Successfully published to Blogger: ${postRes.data.url}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to publish to Blogger:", error.response?.data || error.message);
    return false;
  }
}
