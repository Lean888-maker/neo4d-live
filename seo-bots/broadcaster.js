// Native fetch is available in Node 20+

/**
 * Broadcasts a video URL and caption to linked social networks via Ayrshare.
 * @param {string} videoUrl - The public URL of the MP4 video on Cloud Storage.
 * @param {string} caption - The social media caption including hashtags.
 * @returns {Object} The API response from Ayrshare.
 */
export async function broadcastToSocials(videoUrl, caption) {
  const apiKey = process.env.AYRSHARE_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ AYRSHARE_API_KEY is not set. Skipping social broadcast.");
    return null;
  }

  console.log(`📡 Broadcasting to Social Media...`);
  console.log(`Video URL: ${videoUrl}`);

  const payload = {
    post: caption,
    // Posting to YouTube Shorts and TikTok only
    platforms: ["youtube", "tiktok"],
    mediaUrls: [videoUrl],
    // Optional: TikTok specific settings
    tiktokOptions: {
      privacy_level: "PUBLIC_TO_EVERYONE",
      disable_comment: false
    },
    // Optional: YouTube Shorts specific settings
    youTubeOptions: {
      title: "今日最热吉数 🔥 #Shorts", // Fallback title
      shorts: true, // Forces posting as a YouTube Short
      visibility: "public"
    }
  };

  try {
    const response = await fetch("https://app.ayrshare.com/api/post", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (data.status === "error") {
      console.error("❌ Ayrshare API Error:", data.message);
      return data;
    }

    console.log("✅ Successfully Broadcasted to Socials!");
    console.log("Ayrshare Response:", JSON.stringify(data, null, 2));
    
    return data;
  } catch (err) {
    console.error("❌ Failed to broadcast to Ayrshare:", err.message);
    throw err;
  }
}
