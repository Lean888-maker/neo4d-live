import { generateArticle } from './article_generator.js';
import { publishToMedium } from './publish_medium.js';
import { publishToBlogger } from './publish_blogger.js';
import { publishToDevTo } from './publish_devto.js';
import { publishToTumblr } from './publish_tumblr.js';
import { publishToWordPress } from './publish_wordpress.js';
import { publishToHashnode } from './publish_hashnode.js';

/**
 * SUPERCHARGE SEO MANAGER
 * Orchestrates posting across multiple platforms with natural Velocity Control.
 */
async function runSupercharge() {
  console.log("🚀 STARTING CAUTIOUS SEO SUPERCHARGE MANAGER...");

  try {
    // 1. Generate the core article
    const articleData = await generateArticle();
    
    // 2. We use an array of publisher functions
    const publishers = [
      { name: 'Medium', fn: publishToMedium },
      { name: 'Blogger', fn: publishToBlogger },
      { name: 'Dev.to', fn: publishToDevTo },
      { name: 'Tumblr', fn: publishToTumblr },
      { name: 'WordPress', fn: publishToWordPress },
      { name: 'Hashnode', fn: publishToHashnode },
    ];

    // VELOCITY CONTROL: Randomly select 2-3 platforms to post to per hour to avoid spam detection
    const numberOfPostsToday = Math.floor(Math.random() * 2) + 2;
    const shuffled = publishers.sort(() => 0.5 - Math.random());
    const selectedPublishers = shuffled.slice(0, numberOfPostsToday);

    console.log(`🤖 Velocity Control: Selected ${numberOfPostsToday} random platforms for syndication.`);

    for (const publisher of selectedPublishers) {
      console.log(`⏳ Triggering ${publisher.name} Bot...`);
      try {
        await publisher.fn(articleData);
      } catch (pubErr) {
        console.error(`⚠️ Failed to publish to ${publisher.name}:`, pubErr.message || pubErr);
      }
      // Small natural delay between platforms
      await new Promise(r => setTimeout(r, Math.random() * 3000 + 2000));
    }

    console.log(`✅ SUPERCHARGE CYCLE COMPLETE! Bot is resting until the next hourly schedule.`);

  } catch (err) {
    console.error("🔥 FATAL ERROR IN SUPERCHARGE MANAGER:", err);
  }
}

runSupercharge();
