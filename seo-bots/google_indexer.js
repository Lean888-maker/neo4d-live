import { google } from 'googleapis';
import axios from 'axios';

/**
 * Pings the Google Indexing API to force an immediate crawl of the live draw URLs.
 * Requires GOOGLE_APPLICATION_CREDENTIALS_JSON in the environment.
 */
async function triggerGoogleIndexing() {
  console.log("⚡ STARTING INSTANT GOOGLE INDEXING BOT...");

  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!credentialsJson) {
    console.warn("⚠️ GOOGLE_APPLICATION_CREDENTIALS_JSON not found. Skipping Google Indexing.");
    return;
  }

  try {
    const credentials = JSON.parse(credentialsJson);
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/indexing'],
      null
    );

    const indexing = google.indexing({
      version: 'v3',
      auth: auth,
    });

    const urlsToUpdate = [
      'https://neo4d.live/en',
      'https://neo4d.live/zh',
      'https://neo4d.live/en/ramalan',
      'https://neo4d.live/zh/ramalan'
    ];

    for (const url of urlsToUpdate) {
      console.log(`📡 Pinging Google for: ${url}`);
      try {
        const res = await indexing.urlNotifications.publish({
          requestBody: {
            url: url,
            type: 'URL_UPDATED',
          },
        });
        console.log(`✅ Success for ${url}:`, res.data);
      } catch (reqErr) {
        console.error(`❌ Failed to ping ${url}:`, reqErr.message);
      }
    }

    console.log("✅ GOOGLE INDEXING CYCLE COMPLETE.");
  } catch (err) {
    console.error("🔥 FATAL ERROR IN GOOGLE INDEXER:", err.message);
  }
}

triggerGoogleIndexing();
