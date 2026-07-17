import { generateDailyVideo } from './video_generator.js';
import { publishToFacebookReels } from './publish_facebook.js';

async function runVideoBot() {
  console.log("🚀 STARTING FACEBOOK VIDEO BOT...");
  try {
    const videoData = await generateDailyVideo();
    if (videoData) {
      await publishToFacebookReels(videoData);
    }
  } catch (error) {
    console.error("🔥 FATAL ERROR IN VIDEO BOT:", error);
  }
}

runVideoBot();
