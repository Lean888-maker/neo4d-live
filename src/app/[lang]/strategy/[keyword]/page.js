import React from 'react';
import Link from 'next/link';

// Preset target high-volume SEO keywords mapping
const keywordMap = {
  'magnum-4d-prediction': {
    zh: '万能 4D 预测指南与热门开彩分析',
    en: 'Magnum 4D Prediction Guide & Hot Number Trends',
    descZh: '结合过去5年万能 4D 历史开奖频数与五行数理演算法，提供今日最高概率 4D 头奖组合预测。',
    descEn: 'Advanced statistical analysis and probability algorithms for Magnum 4D prediction today.',
    keyword: 'Magnum 4D Prediction'
  },
  'toto-6d-winning-strategy': {
    zh: 'Toto 6D 积金中奖策略与排列矩阵',
    en: 'Toto 6D Jackpot Strategy & Permutation Matrix',
    descZh: '全面破解 Sports Toto 多多 6D 与 Supreme 6/58 积金包字推算技巧，提高中奖胜率。',
    descEn: 'Proven permutation matrix and mathematical formulas for Sports Toto 6D and Supreme Toto 6/58.',
    keyword: 'Toto 6D Strategy'
  },
  'damacai-3d-head-tail': {
    zh: '大马彩 Da Ma Cai 3D/4D 头尾定位胆推算',
    en: 'Da Ma Cai 3D/4D Head-Tail Position Analysis',
    descZh: '分析 Da Ma Cai 大马彩 1+3D 独家头尾号码走势，掌握最新积金派彩动态。',
    descEn: 'Position analysis and head-tail digit tracking for Da Ma Cai 1+3D.',
    keyword: 'Da Ma Cai 3D Strategy'
  },
  'gdlotto-live-draw-tips': {
    zh: '豪龙 GD Lotto 柬埔寨实时开彩与秘籍',
    en: 'Grand Dragon Lotto (GDLotto) Live Draw Tips',
    descZh: '每日提供豪龙 Grand Dragon Lotto 7:00 PM 实时开彩开号监控与专业下注指标。',
    descEn: 'Real-time live draw tracking and tips for Grand Dragon Lotto (GD Lotto).',
    keyword: 'GD Lotto Tips'
  }
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { lang, keyword } = resolvedParams;
  const kwData = keywordMap[keyword] || {
    zh: `${keyword?.replace(/-/g, ' ')} 4D 预测与开彩指南`,
    en: `${keyword?.replace(/-/g, ' ')} 4D Prediction & Strategy Guide`,
    descZh: `查阅 ${keyword} 的最新4D开彩数据、热门号与易经千字图推算。全马最快0秒无广告平台。`,
    descEn: `Read strategy analysis and 4D predictions for ${keyword} on NEO4D LIVE.`,
    keyword: keyword?.replace(/-/g, ' ')
  };

  const isZh = lang === 'zh';

  return {
    title: `${isZh ? kwData.zh : kwData.en} | NEO4D LIVE 2026`,
    description: isZh ? kwData.descZh : kwData.descEn,
    alternates: {
      canonical: `https://neo4d.live/${lang}/strategy/${keyword}`,
    }
  };
}

export default async function KeywordHijackerPage({ params }) {
  const resolvedParams = await params;
  const { lang, keyword } = resolvedParams;
  const isZh = lang === 'zh';

  const kwData = keywordMap[keyword] || {
    zh: `${keyword?.replace(/-/g, ' ')} 4D 预测与开彩指南`,
    en: `${keyword?.replace(/-/g, ' ')} 4D Prediction & Strategy Guide`,
    descZh: `查阅 ${keyword} 的最新4D开彩数据、热门号与易经千字图推算。全马最快0秒无广告平台。`,
    descEn: `Read strategy analysis and 4D predictions for ${keyword} on NEO4D LIVE.`,
    keyword: keyword?.replace(/-/g, ' ')
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isZh ? kwData.zh : kwData.en,
    description: isZh ? kwData.descZh : kwData.descEn,
    author: { '@type': 'Organization', name: 'NEO4D LIVE Engine' },
    publisher: { '@type': 'Organization', name: 'NEO4D LIVE', url: 'https://neo4d.live' }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <div className="max-w-4xl mx-auto space-y-8">
        <Link href={`/${lang}`} className="inline-flex items-center text-xs font-bold text-amber-400 hover:underline">
          ← {isZh ? '返回 4D 实时开彩首页' : 'Back to NEO4D Home'}
        </Link>

        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-black border border-amber-500/30 rounded-3xl p-8 shadow-2xl space-y-4">
          <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            SEO STRATEGY ENGINE
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-amber-400 tracking-tight leading-tight">
            {isZh ? kwData.zh : kwData.en}
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            {isZh ? kwData.descZh : kwData.descEn}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h2 className="text-xl font-black text-emerald-400">{isZh ? '核心推算公式' : 'Core Predictive Formula'}</h2>
            <p className="text-slate-300 text-xs leading-relaxed">
              {isZh 
                ? '通过对比过去30期开奖频次，排除冷号与过热沉淀号，将投注范围精确锁定在前10%最高胜率组合。'
                : 'Filters cold numbers and over-saturated combinations to focus on the top 10% highest probability combinations.'}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
            <h2 className="text-xl font-black text-amber-400">{isZh ? '即时开彩监控' : '0-Second Live Tracking'}</h2>
            <p className="text-slate-300 text-xs leading-relaxed">
              {isZh
                ? '全马首个0秒无广告实时开彩中心，开彩期间无需手动刷新页面，系统自动推送第一手中奖数据。'
                : 'Malaysia’s fastest ad-free real-time 4D live results platform with zero manual page refreshes required.'}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-950 to-slate-900 border border-amber-500/40 p-8 rounded-3xl text-center space-y-4 shadow-2xl">
          <h3 className="text-xl font-black text-yellow-300">
            {isZh ? '想获取今日专属 4D 必中头奖预测？' : 'Want Today’s Exclusive 4D Predictions?'}
          </h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            {isZh ? '加入我们的 VIP Telegram 频道，每日免费获取大伯公千字图解密与热号推算！' : 'Join our VIP Telegram channel for daily free predictions, dream code breakdowns, and hot alerts!'}
          </p>
          <a
            href="/telegram-supervip"
            className="inline-block bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm px-8 py-4 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.5)] transition transform hover:scale-105"
          >
            {isZh ? '⚡ 立即加入 VIP Telegram 频道' : 'Join VIP Telegram Channel'}
          </a>
        </div>
      </div>
    </main>
  );
}