import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '../../../utils/telegram';
import { fetch4dData } from '../../../utils/fetch4d';

export const dynamic = 'force-dynamic'; 

export async function GET(request) {
  // CRON Security
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 1. Fetch live results using our highly-optimized scraper
    const liveData = await fetch4dData();
    
    if (!liveData || liveData.length === 0) {
      return NextResponse.json({ success: false, error: 'No data retrieved from scraper' }, { status: 500 });
    }

    // 2. Extract Top 3 Prizes for the 3 main operators
    const magnum = liveData.find(d => d.operator === 'Magnum 4D');
    const toto = liveData.find(d => d.operator === 'Sports Toto');
    const damacai = liveData.find(d => d.operator === 'Da Ma Cai');

    // 3. Format the Broadcast Message
    let message = `🚨 <b>LIVE RESULTS JUST DROPPED!</b> 🚨\n\n`;

    if (magnum) {
      message += `🟡 <b>Magnum 4D</b>\n`;
      message += `🥇 1st: <b>${magnum.prizes.first || '----'}</b>\n`;
      message += `🥈 2nd: <b>${magnum.prizes.second || '----'}</b>\n`;
      message += `🥉 3rd: <b>${magnum.prizes.third || '----'}</b>\n\n`;
    }

    if (toto) {
      message += `🔴 <b>Sports Toto</b>\n`;
      message += `🥇 1st: <b>${toto.prizes.first || '----'}</b>\n`;
      message += `🥈 2nd: <b>${toto.prizes.second || '----'}</b>\n`;
      message += `🥉 3rd: <b>${toto.prizes.third || '----'}</b>\n\n`;
    }

    if (damacai) {
      message += `🔵 <b>Da Ma Cai</b>\n`;
      message += `🥇 1st: <b>${damacai.prizes.first || '----'}</b>\n`;
      message += `🥈 2nd: <b>${damacai.prizes.second || '----'}</b>\n`;
      message += `🥉 3rd: <b>${damacai.prizes.third || '----'}</b>\n\n`;
    }

    message += `🔗 <i>Did you win today? Check your Special & Consolation prizes now!</i>\n`;
    message += `<a href="https://neo4d.live">View Full Results at NEO4D.live</a>`;

    // 4. Send to Telegram
    const success = await sendTelegramMessage(message);

    if (success) {
      return NextResponse.json({ success: true, message: 'Live results broadcasted.' });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to send broadcast.' }, { status: 500 });
    }

  } catch (error) {
    console.error("Cron Error (Live):", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
