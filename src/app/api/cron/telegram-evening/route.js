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
    const results = await fetch4dData();
    
    const hasMagnum = results.magnum && results.magnum.numbers.first && results.magnum.numbers.first !== '----';
    const hasGD = results.granddragon && results.granddragon.numbers.first && results.granddragon.numbers.first !== '----';
    
    // Check if any major draw is completed
    if (!hasMagnum && !hasGD) {
      return NextResponse.json({ success: false, message: 'Draw not completed yet.' }, { status: 200 });
    }

    const m1 = results.magnum?.numbers?.first || '----';
    const t1 = results.toto?.numbers?.first || '----';
    const d1 = results.damacai?.numbers?.first || '----';
    const gd1 = results.granddragon?.numbers?.first || '----';
    const h1 = results.ninelotto?.numbers?.first || '----';

    const isDrawDay = m1 !== '----';

    const message = `
🚨 <b>LIVE DRAW RESULTS ARE OUT!</b> 🚨
<i>${results.date}</i>

🏆 <b>1ST PRIZES:</b>
${isDrawDay ? `🔴 Magnum: <b>${m1}</b>
🔵 Toto: <b>${t1}</b>
🟢 Da Ma Cai: <b>${d1}</b>
` : ''}🟡 Grand Dragon: <b>${gd1}</b>
🧧 9Lotto: <b>${h1}</b>

Check the full 2nd, 3rd, Special, and Consolation prizes right now on our live site (100% Ad-Free & Ultra Fast):
👉 <a href="https://neo4d.live">neo4d.live</a>
`;

    const success = await sendTelegramMessage(message);

    return NextResponse.json({ success, message: 'Evening results broadcasted.' });
  } catch (error) {
    console.error("Cron Error (Evening):", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
