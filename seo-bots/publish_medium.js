import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Medium Integration
// Requires MEDIUM_INTEGRATION_TOKEN to be set in environment variables
export async function publishToMedium(articleData) {
  const token = process.env.MEDIUM_INTEGRATION_TOKEN;
  if (!token) {
    console.warn("⚠️ MEDIUM_INTEGRATION_TOKEN not found. Skipping Medium publish.");
    return false;
  }

  try {
    // 1. Get the user ID
    console.log("Fetching Medium User ID...");
    const userRes = await axios.get('https://api.medium.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const authorId = userRes.data.data.id;

    // 2. Publish the post
    console.log(`Publishing "${articleData.title}" to Medium...`);
    const postRes = await axios.post(`https://api.medium.com/v1/users/${authorId}/posts`, {
      title: articleData.title,
      contentFormat: "markdown",
      content: articleData.finalContent,
      canonicalUrl: `https://neo4d.live/blog/${articleData.slug}`,
      tags: ["万字票", "马来西亚", "万能", "多多", "今日成绩"],
      publishStatus: "public" // or "draft" if we want to review it first
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`✅ Successfully published to Medium: ${postRes.data.data.url}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to publish to Medium:", error.response?.data || error.message);
    return false;
  }
}
