import { NextResponse } from 'next/server';

/**
 * Validates if a specific Telegram user is currently a member of the required channel.
 */
export async function POST(request) {
  try {
    const { telegramUserId } = await request.json();
    
    if (!telegramUserId) {
      return NextResponse.json({ success: false, error: "Missing User ID" }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID;

    if (!botToken || !channelId) {
      console.warn("⚠️ Telegram API keys missing in server environment.");
      // In dev mode without keys, we might want to mock success so the UI can be tested
      return NextResponse.json({ success: true, isMember: true, mock: true });
    }

    // Call Telegram API getChatMember
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${channelId}&user_id=${telegramUserId}`);
    const data = await response.json();

    if (!data.ok) {
      return NextResponse.json({ success: false, error: data.description }, { status: 500 });
    }

    // Valid statuses: "creator", "administrator", "member", "restricted"
    // Invalid statuses: "left", "kicked"
    const status = data.result.status;
    const isMember = ["creator", "administrator", "member", "restricted"].includes(status);

    return NextResponse.json({ success: true, isMember });

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
