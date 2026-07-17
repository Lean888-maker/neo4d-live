/**
 * Utility functions for interacting with the Telegram Bot API.
 */

export async function sendTelegramMessage(message) {
  // We use environment variables so you don't expose your tokens in public code
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID; 

  if (!botToken || !channelId) {
    console.warn("⚠️ Telegram configuration missing. Check TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID.");
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: channelId,
        text: message,
        parse_mode: 'HTML', // Allows for bolding, italics, links
        disable_web_page_preview: true // Keep the channel clean
      })
    });

    const data = await response.json();
    
    if (!data.ok) {
      console.error("❌ Telegram API Error:", data.description);
      return false;
    }
    
    console.log("✅ Successfully sent message to Telegram channel.");
    return true;
  } catch (error) {
    console.error("❌ Failed to send Telegram message:", error);
    return false;
  }
}
