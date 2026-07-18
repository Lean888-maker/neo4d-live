import axios from 'axios';
import fs from 'fs';

/**
 * Publishes the generated MP4 to a Facebook Page as a Reel.
 * Requires FB_PAGE_ID and FB_PAGE_ACCESS_TOKEN.
 */
export async function publishToFacebookReels(videoData) {
  const pageId = process.env.FB_PAGE_ID;
  const token = process.env.FB_PAGE_ACCESS_TOKEN;

  if (!pageId || !token) {
    console.warn("⚠️ Facebook API keys missing. Skipping Facebook upload.");
    return false;
  }

  try {
    console.log("📤 Initializing Facebook Reel Upload...");
    
    // Step 1: Initialize Upload Session
    const initRes = await axios.post(`https://graph.facebook.com/v19.0/${pageId}/video_reels`, {
      upload_phase: "start",
      access_token: token
    });
    const videoId = initRes.data.video_id;
    const uploadUrl = initRes.data.upload_url;

    console.log(`Uploading Video File (ID: ${videoId})...`);

    // Step 2: Upload Video File
    const videoBuffer = fs.readFileSync(videoData.videoPath);
    await axios.post(uploadUrl, videoBuffer, {
      headers: {
        'Authorization': `OAuth ${token}`,
        'offset': 0,
        'file_size': videoBuffer.length,
        'Content-Type': 'application/octet-stream'
      }
    });

    console.log("Publishing Reel to Page...");

    // Step 3: Publish the Reel
    const publishRes = await axios.post(`https://graph.facebook.com/v19.0/${pageId}/video_reels`, {
      upload_phase: "finish",
      video_id: videoId,
      video_state: "PUBLISHED",
      description: videoData.description,
      access_token: token
    });

    console.log(`✅ Successfully published Facebook Reel!`);
    return true;
  } catch (error) {
    console.error("❌ Failed to publish to Facebook:", error.response?.data || error.message);
    return false;
  }
}

/**
 * Publishes a photo to a Facebook Page or Group.
 */
export async function publishToFacebookPhoto(imageUrl, description) {
  const pageId = process.env.FB_PAGE_ID;
  const token = process.env.FB_PAGE_ACCESS_TOKEN;

  if (!pageId || !token) {
    console.warn("⚠️ Facebook API keys missing. Skipping Facebook upload.");
    return false;
  }

  try {
    console.log("📤 Publishing Photo to Facebook...");
    
    const url = `https://graph.facebook.com/v19.0/${pageId}/photos`;
    const res = await axios.post(url, {
      url: imageUrl,
      message: description,
      access_token: token
    });

    console.log(`✅ Successfully published Photo to Facebook! Post ID: ${res.data.post_id}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to publish photo to Facebook:", error.response?.data || error.message);
    return false;
  }
}
