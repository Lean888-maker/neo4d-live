/**
 * YouTube Shorts Native Uploader
 * Uses the YouTube Data API v3 directly (100% free)
 * 
 * Required env vars:
 *   YOUTUBE_CLIENT_ID      - OAuth 2.0 Client ID from Google Cloud Console
 *   YOUTUBE_CLIENT_SECRET  - OAuth 2.0 Client Secret
 *   YOUTUBE_REFRESH_TOKEN  - Long-lived refresh token from OAuth Playground
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { createWriteStream } from 'fs';
import { tmpdir } from 'os';

/**
 * Downloads a video from a public URL to a temp file.
 * YouTube upload requires a local file stream.
 */
async function downloadToTemp(url) {
  const tmpPath = path.join(tmpdir(), `yt-upload-${Date.now()}.mp4`);
  return new Promise((resolve, reject) => {
    const file = createWriteStream(tmpPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(tmpPath);
      });
    }).on('error', (err) => {
      fs.unlink(tmpPath, () => {});
      reject(err);
    });
  });
}

/**
 * Uploads a video to YouTube as a Short.
 * @param {string} videoUrl - Public URL of the MP4 to upload.
 * @param {string} caption  - Full caption/description (hashtags included).
 * @param {string} headline - Short title for the YouTube video (max 100 chars).
 */
export async function uploadToYouTube(videoUrl, caption, headline = '今日最热吉数 🔥') {
  const clientId     = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.warn("⚠️  YouTube credentials not set. Skipping YouTube upload.");
    return null;
  }

  console.log("📺 Starting YouTube Shorts upload...");

  // 1. Set up OAuth2 client and refresh access token automatically
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  // 2. Download the video from Cloud Storage to a local temp file
  console.log("⬇️  Downloading video from Cloud Storage...");
  const tmpVideoPath = await downloadToTemp(videoUrl);
  console.log(`✅ Downloaded to: ${tmpVideoPath}`);

  // 3. Build a clean title (YouTube has a 100-char limit)
  const today = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });
  const title = `${headline} | ${today} #Shorts`.slice(0, 100);

  // 4. Upload to YouTube
  try {
    console.log(`📤 Uploading to YouTube with title: "${title}"`);
    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title:       title,
          description: caption + '\n\n' +
            '🔗 AI 数字分析: https://neo4d.live/analysis\n' +
            '📲 专属 Telegram 频道: https://neo4d.live/telegram-supervip\n\n' +
            '免责声明: 本内容仅供娱乐参考，请合理娱乐。',
          tags: ['Malaysia4D', '万字', 'Magnum', 'Toto', 'Damacai', '发财', '幸运数字', 'Shorts'],
          categoryId:  '24', // Entertainment
          defaultLanguage: 'zh-CN',
        },
        status: {
          privacyStatus: 'public',       // Post publicly immediately
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: fs.createReadStream(tmpVideoPath),
      },
    });

    const videoId = response.data.id;
    const youtubeUrl = `https://www.youtube.com/shorts/${videoId}`;
    console.log(`✅ YouTube Shorts Upload Successful!`);
    console.log(`🔗 Live URL: ${youtubeUrl}`);

    // Cleanup temp file
    fs.unlink(tmpVideoPath, () => {});

    return { videoId, youtubeUrl };

  } catch (err) {
    // Cleanup temp file on error
    fs.unlink(tmpVideoPath, () => {});
    console.error("❌ YouTube upload failed:", err.message);
    throw err;
  }
}
