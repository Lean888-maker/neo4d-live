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
  console.log("🚀 STARTING AGGRESSIVE SEO SUPERCHARGE MANAGER...");
  let count = 0;

  while (true) {
    count++;
    console.log(`\n--- SUPERCHARGE CYCLE #${count} ---`);
    
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

      // Randomly select 2-3 platforms to post to
      const numberOfPostsToday = Math.floor(Math.random() * 2) + 2;
      const shuffled = publishers.sort(() => 0.5 - Math.random());
      const selectedPublishers = shuffled.slice(0, numberOfPostsToday);

      console.log(`🤖 Selected ${numberOfPostsToday} random platforms for syndication.`);

      for (const publisher of selectedPublishers) {
        console.log(`⏳ Triggering ${publisher.name} Bot...`);
        try {
          await publisher.fn(articleData);
        } catch (pubErr) {
          console.error(`⚠️ Failed to publish to ${publisher.name}:`, pubErr.message || pubErr);
        }
        // Small delay between platforms
        await new Promise(r => setTimeout(r, 2000));
      }

      console.log(`✅ CYCLE #${count} COMPLETE! Resting for 15 seconds before next post...`);
      // Rest 15 seconds to avoid hammering APIs instantly
      await new Promise(r => setTimeout(r, 15000));

    } catch (err) {
      if (err.status === 429 || (err.message && err.message.includes('429')) || (err.message && err.message.includes('Quota'))) {
        console.log("🛑 Google AI Free Daily Quota Exhausted! Sleeping until tomorrow's reset.");
        break; // Exit the loop safely. The hourly cron will naturally wake it up later to check again.
      } else {
        console.error("🔥 FATAL ERROR IN SUPERCHARGE MANAGER:", err);
        break; // Stop on unknown errors to prevent infinite crash loops
      }
    }
  }
}

runSupercharge();
