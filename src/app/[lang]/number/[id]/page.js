import { notFound } from 'next/navigation';
import { dreamData } from '../../../dream_data';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const { lang, id } = params;
  
  if (!id || id.length !== 4 || isNaN(id)) {
    return { title: 'Number Not Found' };
  }

  return {
    title: lang === 'zh' 
      ? `${id} 4D 万字吉数分析与千字图解梦 | NEO4D LIVE` 
      : `${id} 4D Lucky Number Analysis & Dream Meaning | NEO4D LIVE`,
    description: lang === 'zh'
      ? `全面解析 ${id} 万字运势。查找 ${id} 的千字图解梦含义、历史频数与开彩推荐。`
      : `Full analysis of 4D number ${id}. Find dream meanings, historical frequency, and lucky predictions for ${id}.`,
    alternates: {
      canonical: `https://neo4d.live/${lang}/number/${id}`,
    }
  };
}

export default function NumberAnalysisPage({ params }) {
  const { lang, id } = params;
  
  if (!id || id.length !== 4 || isNaN(id)) {
    notFound();
  }

  const dreamMatch = dreamData.find(d => d.number === id);

  // Deterministic random-like analysis based on ID string
  const sum = id.split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
  const luckyScore = 50 + (sum * 7) % 50; // Score between 50 and 99
  const elements = ['Gold', 'Water', 'Wood', 'Fire', 'Earth'];
  const element = elements[sum % 5];
  
  const elementZh = ['金', '水', '木', '火', '土'][sum % 5];

  const analysisZh = `根据易经五行推算，号码 **${id}** 属【${elementZh}】。此数字组合的整体灵数总和为 ${sum}，代表着近期的财运磁场较为活跃。吉利指数高达 ${luckyScore}%。适合在星期三或周末的开彩日进行投注。`;
  const analysisEn = `Based on numerology elements, the number **${id}** aligns with the [${element}] element. The sum of these digits is ${sum}, indicating an active wealth aura. It has a lucky index of ${luckyScore}%. Highly recommended for Wednesday or weekend draws.`;

  // JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": lang === 'zh' ? `${id} 4D万字分析` : `${id} 4D Number Analysis`,
    "description": lang === 'zh' ? analysisZh : analysisEn,
    "author": {
      "@type": "Organization",
      "name": "NEO4D LIVE"
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 pt-24 font-sans selection:bg-amber-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-3xl mx-auto px-4 relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest">
            {lang === 'zh' ? '万字号码大全' : 'Number Directory'}
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 tracking-tight filter drop-shadow-lg">
            {id}
          </h1>
        </div>

        {/* Luck Score */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">{lang === 'zh' ? '吉利指数' : 'Lucky Index'}</h2>
            <p className="text-sm text-slate-400">{lang === 'zh' ? '基于五行演算' : 'Based on 5-element computation'}</p>
          </div>
          <div className="text-4xl font-black text-emerald-400">
            {luckyScore}%
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>🔮</span> {lang === 'zh' ? '易经AI分析' : 'AI Numerology Analysis'}
          </h2>
          <p className="text-slate-300 leading-relaxed">
            {lang === 'zh' ? analysisZh : analysisEn}
          </p>
        </div>

        {/* Dream Dictionary Match */}
        {dreamMatch && (
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-3xl p-6 border border-indigo-500/20 shadow-xl space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>💤</span> {lang === 'zh' ? '千字图解梦' : 'Dream Dictionary Match'}
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-5xl">🌙</div>
              <div>
                <h3 className="text-xl font-bold text-indigo-300">{lang === 'zh' ? dreamMatch.titleZh : dreamMatch.titleEn}</h3>
                <p className="text-sm text-indigo-200/70 mt-1">{lang === 'zh' ? dreamMatch.descZh : dreamMatch.descEn}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {dreamMatch.keywords.map(kw => (
                <span key={kw} className="px-3 py-1 bg-indigo-500/20 rounded-lg text-xs font-medium text-indigo-300" key={kw}>#{kw}</span>
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center pt-8">
          <Link href={`/${lang}`} className="text-amber-500 hover:text-amber-400 font-bold underline decoration-amber-500/30 underline-offset-4">
            {lang === 'zh' ? '返回主页' : 'Back to Home'}
          </Link>
        </div>

      </div>
    </div>
  );
}
