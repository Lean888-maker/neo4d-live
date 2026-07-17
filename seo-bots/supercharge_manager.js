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
  console.log("🚀 STARTING SEO SUPERCHARGE MANAGER...");

  try {
    // 1. Generate the core article for today
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

    // VELOCITY CONTROL: We don't post to ALL 6 platforms every day (that triggers Google SpamBrain).
    // We randomly select 2-3 platforms to post to each day.
    const numberOfPostsToday = Math.floor(Math.random() * 2) + 2; // Randomly 2 or 3
    const shuffled = publishers.sort(() => 0.5 - Math.random());
    const selectedPublishers = shuffled.slice(0, numberOfPostsToday);

    console.log(`🤖 Velocity Control: Selected ${numberOfPostsToday} random platforms for today's syndication.`);

    for (const publisher of selectedPublishers) {
      console.log(`\n⏳ Triggering ${publisher.name} Bot...`);
      // We await to simulate human-like delay between posts
      await publisher.fn(articleData);
      
      // Random delay between 1 to 3 seconds to avoid API rate limiting
      await new Promise(r => setTimeout(r, Math.random() * 2000 + 1000));
    }

    console.log("\n✅ SUPERCHARGE CYCLE COMPLETE!");

  } catch (err) {
    console.error("🔥 FATAL ERROR IN SUPERCHARGE MANAGER:", err);
  }
}

runSupercharge();
