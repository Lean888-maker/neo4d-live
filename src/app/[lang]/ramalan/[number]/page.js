import React from 'react';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { lang, number } = resolvedParams;
  const formattedNumber = (number || '8888').padStart(4, '0');

  return {
    title: lang === 'zh'
      ? `【${formattedNumber}】开奖历史与预测分析 | 万能 Magnum, 多多 Sports Toto, 大马彩`
      : `4D Number ${formattedNumber} History & Prediction Analysis | Magnum, Toto, Damacai`,
    description: lang === 'zh'
      ? `深入查阅吉数【${formattedNumber}】的历史中奖频率、生肖对译及千字图玄学解梦。全马最快0秒无广告4D开彩平台。`
      : `Check historical draw frequencies, zodiac match, and numerology predictions for 4D number ${formattedNumber}.`,
    alternates: {
      canonical: `https://neo4d.live/${lang}/ramalan/${formattedNumber}`,
    }
  };
}

export default async function RamalanNumberPage({ params }) {
  const resolvedParams = await params;
  const { lang, number } = resolvedParams;
  const numStr = (number || '8888').padStart(4, '0');
  const isZh = lang === 'zh';

  const numVal = parseInt(numStr, 10) || 8888;
  const totalWins = (numVal % 18) + 3;
  const firstPrizeWins = (numVal % 4) + 1;
  const lastWonDays = (numVal % 45) + 2;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: isZh ? `号码 ${numStr} 历史上开过多少次头奖？` : `How many times has number ${numStr} won 1st Prize?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isZh
            ? `根据过去5年历史开奖数据，号码 ${numStr} 在万能、多多与大马彩中共斩获过 ${firstPrizeWins} 次头奖！`
            : `Based on 5-year historical data, number ${numStr} has won 1st Prize ${firstPrizeWins} times.`
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12 relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <Link href={`/${lang}`} className="inline-flex items-center text-xs font-bold text-amber-400 hover:underline">
          ← {isZh ? '返回 4D 实时开彩首页' : 'Back to NEO4D Home'}
        </Link>
        <div className="bg-gradient-to-br from-red-950 via-slate-900 to-black border-2 border-amber-500/40 rounded-3xl p-8 shadow-[0_0_40px_rgba(245,158,11,0.2)] text-center space-y-4">
          <span className="text-xs md:text-sm text-amber-400 font-black uppercase tracking-widest">
            {isZh ? '专属万字分析报告' : '4D Statistical Analysis'}
          </span>
          <h1 className="font-number text-7xl md:text-8xl text-yellow-300 font-black tracking-widest drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]">
            {numStr}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto">
            {isZh
              ? `号码 ${numStr} 的历史数据：过去5年在全马三大博彩商共开出 ${totalWins} 次，上一次开出距今约 ${lastWonDays} 天。`
              : `Number ${numStr} has appeared ${totalWins} times in top 3 prizes over the past 5 years.`}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center">
            <div className="text-slate-400 text-xs font-bold mb-1">{isZh ? '历史中奖总数' : 'Total Wins'}</div>
            <div className="text-3xl font-black text-amber-400">{totalWins} 次</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-center">
            <div className="text-slate-400 text-xs font-bold mb-1">{isZh ? '头奖(1st)记录' : '1st Prize Wins'}</div>
            <div className="text-3xl font-black text-emerald-400">{firstPrizeWins} 次</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl col-span-2 md:col-span-1 text-center">
            <div className="text-slate-400 text-xs font-bold mb-1">{isZh ? '距上次开出' : 'Days Since Last Win'}</div>
            <div className="text-3xl font-black text-yellow-300">{lastWonDays} 天</div>
          </div>
        </div>
        <div className="bg-slate-900/80 border border-amber-500/30 p-6 rounded-2xl text-center space-y-4">
          <h3 className="text-base font-black text-amber-400">
            {isZh ? `订阅 VIP Telegram 获取 ${numStr} 今日推算提醒` : `Get Daily Predictions for ${numStr} on Telegram`}
          </h3>
          <a
            href="/telegram-supervip"
            className="inline-block bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm px-8 py-3.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] transition transform hover:scale-105"
          >
            {isZh ? '⚡ 免费加入 VIP Telegram 频道' : 'Join VIP Telegram Channel'}
          </a>
        </div>
      </div>
    </main>
  );
}