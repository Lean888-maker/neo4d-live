import { getDailyAIContent } from '../../utils/ai';
import Link from 'next/link';

export const revalidate = 43200; // Revalidate every 12 hours (Server-Side)

export const metadata = {
  title: '今日万字预测与幸运号码推荐 | NEO4D LIVE',
  description: '全马最快的无广告实时4D开彩引擎为您带来今日最新万能、多多、大马彩幸运数字预测与财运分析。',
  keywords: '4d prediction, 今日万字预测, magnum 4d prediction, sports toto lucky number, 4d forecast today',
};

export default async function PredictionsPage({ params }) {
  const lang = (await params)?.lang || 'zh';
  let content = '';
  let errorMsg = '';
  
  try {
    content = await getDailyAIContent('predictions');
    // Remove potential markdown code block wrappers ```html ... ``` if returned by Gemini
    content = content.replace(/^```html\s*/i, '').replace(/```\s*$/i, '');
  } catch (err) {
    console.error("Predictions fetch failed:", err);
    errorMsg = err.message;
  }

  return (
    <>
      {/* Top Gold cloud border ornament */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.015] select-none z-0">
        <div className="absolute top-[10%] left-[5%] font-black text-[13vw] text-amber-600 font-mono tracking-tighter">8888</div>
        <div className="absolute top-[50%] right-[5%] font-black text-[15vw] text-red-600 font-mono">發</div>
      </div>

      <main className="min-h-screen text-slate-800 pb-16 relative z-10 bg-[#faf8f5]">
        {/* Header Section */}
        <div className="relative py-12 border-b-2 border-amber-500/20 bg-gradient-to-b from-red-800 via-red-900 to-red-950 text-white shadow-xl overflow-hidden text-center">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>
          <div className="absolute inset-0 bg-[url('/images/header_dragon_bg.png')] bg-cover bg-center opacity-30 mix-blend-overlay pointer-events-none"></div>

          <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-3">
            <Link href="/" className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-amber-400 hover:text-amber-300 transition-colors bg-black/30 px-3.5 py-1.5 rounded-full border border-white/10 shadow-inner">
              ⬅️ 返回 NEO4D 首页
            </Link>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
              今日 <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">万字预测</span> 与推荐
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto font-medium leading-relaxed uppercase tracking-wider">
              ✨ 实时 AI 智能演算每日最新吉星财运及推荐号码 ✨
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-3xl mx-auto px-4 mt-8">
          <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-md relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-red-100 text-red-700 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-red-200">
              今日推荐 (Daily Update)
            </div>

            {errorMsg ? (
              <div className="py-12 text-center space-y-4">
                <span className="text-4xl">⚠️</span>
                <h3 className="font-bold text-slate-800">无法载入预测数据</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">{errorMsg}</p>
                <Link href="/" className="mt-4 inline-block px-6 py-2.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-colors">
                  返回首页
                </Link>
              </div>
            ) : (
              <article 
                className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed text-sm md:text-base space-y-6"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}

            {/* Bottom Disclaimer */}
            <footer className="mt-12 pt-6 border-t border-slate-100 text-[10px] text-slate-400 font-medium leading-relaxed text-center">
              *声明：以上预测与幸运号码仅由AI智能进行数据与趋势演化分析得出，不代表官方博彩观点。请理性对待，量力而行。
            </footer>
          </div>

          {/* Quick links to other sections */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Link href={`/${lang}/dreams`} className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 text-center shadow-sm hover:shadow transition-all group">
              <span className="text-2xl block mb-1">🔮</span>
              <span className="text-xs font-black text-slate-800 group-hover:text-amber-600">大伯公千字图</span>
            </Link>
            <Link href={`/${lang}`} className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 text-center shadow-sm hover:shadow transition-all group">
              <span className="text-2xl block mb-1">🏆</span>
              <span className="text-xs font-black text-slate-800 group-hover:text-amber-600">最新开彩结果</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
