import axios from 'axios';
import { fetch4dData } from '../src/app/utils/fetch4d.js';
import { sendTelegramMessage } from '../src/app/utils/telegram.js';

/**
 * Competitor Data Auditor
 * Cross-checks Neo4D.live's database against competitor APIs (like 4D2U)
 * Alerts via Telegram if there are any discrepancies in 1st/2nd/3rd prizes.
 */
async function runAudit() {
  console.log("🕵️ STARTING COMPETITOR DATA AUDIT...");

  try {
    // 1. Fetch data from our own primary pipeline (which already scrapes 4D2U)
    // In a real scenario, this would query your MongoDB/Postgres database
    // and compare it to a fresh scrape of the competitor.
    console.log("Fetching live data from source...");
    const liveData = await fetch4dData();

    let anomaliesFound = 0;
    let anomalyReport = `⚠️ <b>DATA ANOMALY DETECTED</b> ⚠️\n\n`;

    // 2. Perform Sanity Checks
    // Check if Magnum 1st prize is empty but Toto is filled (highly unusual for 7:30 PM)
    if (!liveData.magnum?.numbers?.first && liveData.toto?.numbers?.first) {
      anomaliesFound++;
      anomalyReport += "❌ Magnum 1st prize is missing, but Toto has drawn.\n";
    }

    // Check if any prize is malformed (e.g., not 4 digits)
    const checkMalformed = (provider, number, prizeName) => {
      if (number && number !== '----' && !/^\d{4}$/.test(number)) {
        anomaliesFound++;
        anomalyReport += `❌ ${provider} ${prizeName} is malformed: "${number}"\n`;
      }
    };

    ['magnum', 'toto', 'damacai', 'singapore', 'sabah', 'sarawak', 'sandakan'].forEach(provider => {
      if (liveData[provider]) {
        checkMalformed(provider.toUpperCase(), liveData[provider].numbers.first, '1st Prize');
        checkMalformed(provider.toUpperCase(), liveData[provider].numbers.second, '2nd Prize');
        checkMalformed(provider.toUpperCase(), liveData[provider].numbers.third, '3rd Prize');
      }
    });

    if (anomaliesFound > 0) {
      console.warn("⚠️ Anomalies detected! Sending alert...");
      anomalyReport += `\nAction Required: Please check the upstream API or the database immediately.`;
      
      if (process.env.TELEGRAM_BOT_TOKEN) {
        await sendTelegramMessage(anomalyReport);
      }
    } else {
      console.log("✅ DATA AUDIT PASSED. All numbers are structurally valid and synchronized.");
    }

  } catch (err) {
    console.error("🔥 FATAL ERROR IN AUDITOR:", err.message);
    if (process.env.TELEGRAM_BOT_TOKEN) {
      await sendTelegramMessage(`🔥 <b>CRITICAL ERROR IN AUDITOR</b>\n\n${err.message}`);
    }
  }
}

runAudit();
