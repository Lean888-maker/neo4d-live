import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '../../../utils/telegram';

export const dynamic = 'force-dynamic'; // Ensures cron always runs fresh

export async function GET(request) {
  // CRON Security: Ensure only authorized requests trigger this
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const today = new Date().toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    // Generate some lucky numbers for hype
    const num1 = Math.floor(1000 + Math.random() * 9000);
    const num2 = Math.floor(1000 + Math.random() * 9000);

    const message = `
🔮 <b>TODAY'S LUCKY PREDICTIONS</b> 🔮
<i>${today}</i>

Tua Pek Kong's hot numbers for Magnum & Toto:
🔥 <b>${num1}</b>
🔥 <b>${num2}</b>

Are you feeling lucky today? 
🔗 Get your tickets ready and check back here at 7:00 PM for live results!
<a href="https://neo4d.live">Check Results at NEO4D.live</a>
`;

    const success = await sendTelegramMessage(message);

    if (success) {
      return NextResponse.json({ success: true, message: 'Morning hype broadcasted.' });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to send broadcast.' }, { status: 500 });
    }

  } catch (error) {
    console.error("Cron Error (Morning):", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
