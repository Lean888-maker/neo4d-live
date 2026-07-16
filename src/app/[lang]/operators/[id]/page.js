import { fetch4dData } from '../../../utils/fetch4d';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const operatorsInfo = {
  magnum: { 
    name: 'MAGNUM 4D', 
    jpName: '萬能 4D', 
    color: 'text-slate-900', 
    headerBg: 'bg-[#FFCC00]', 
    p1Gradient: 'from-yellow-100/50 via-yellow-50/10 to-white border-yellow-300',
    borderColor: 'border-t-[#FFCC00]'
  },
  toto: { 
    name: 'SPORTS TOTO', 
    jpName: '多多 4D', 
    color: 'text-white', 
    headerBg: 'bg-[#E11D48]', 
    p1Gradient: 'from-red-100/50 via-red-50/10 to-white border-red-300',
    borderColor: 'border-t-[#E11D48]'
  },
  damacai: { 
    name: 'DA MA CAI 1+3D', 
    jpName: '大馬彩 1+3D', 
    color: 'text-white', 
    headerBg: 'bg-[#1D4ED8]', 
    p1Gradient: 'from-blue-100/50 via-blue-50/10 to-white border-blue-300',
    borderColor: 'border-t-[#1D4ED8]'
  },
  singapore: { 
    name: 'SINGAPORE POOLS', 
    jpName: '新加坡博彩', 
    color: 'text-white', 
    headerBg: 'bg-[#0369A1]', 
    p1Gradient: 'from-sky-100/50 via-sky-50/10 to-white border-cyan-300',
    borderColor: 'border-t-[#0369A1]'
  },
  sabah: { 
    name: 'SABAH 88', 
    jpName: '沙巴 88', 
    color: 'text-white', 
    headerBg: 'bg-[#EA580C]', 
    p1Gradient: 'from-orange-100/50 via-orange-50/10 to-white border-orange-300',
    borderColor: 'border-t-[#EA580C]'
  },
  sarawak: { 
    name: 'SPECIAL CASHSWEEP', 
    jpName: '砂拉越特別大彩', 
    color: 'text-white', 
    headerBg: 'bg-[#15803D]', 
    p1Gradient: 'from-green-100/50 via-green-50/10 to-white border-green-300',
    borderColor: 'border-t-[#15803D]'
  },
  sandakan: { 
    name: 'SANDAKAN 4D', 
    jpName: '山打根 4D', 
    color: 'text-white', 
    headerBg: 'bg-[#6B21A8]', 
    p1Gradient: 'from-purple-100/50 via-purple-50/10 to-white border-purple-300',
    borderColor: 'border-t-[#6B21A8]'
  }
};

// Next.js dynamic metadata generator
export async function generateMetadata({ params }) {
  const { id } = params;
  const info = operatorsInfo[id];
  if (!info) return {};

  const name = `${info.jpName} (${info.name})`;
  return {
    title: `今日 ${name} 最新开彩结果 | NEO4D LIVE`,
    description: `全马最快的无广告实时4D开彩结果引擎。查看今日最新 ${name} 开彩结果，首奖、二奖、三奖、特别奖、安慰奖与历史吉数解析。`,
    keywords: `${info.name.toLowerCase()} results, ${info.jpName} 开彩结果, 今日4d, keputusan ${id}`,
  };
}

export default async function OperatorPage({ params }) {
  const { id } = params;
  const info = operatorsInfo[id];
  
  if (!info) {
    notFound();
  }

  let results = null;
  try {
    results = await fetch4dData();
  } catch (error) {
    console.error(`Failed to fetch 4D data for ${id}:`, error);
  }

  const opData = results ? results[id] : null;
  const operatorName = info.jpName;

  return (
    <main className="min-h-screen text-slate-800 pb-16 relative bg-[#faf8f5]">
      {/* Top Gold cloud border ornament */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.015] select-none z-0">
        <div className="absolute top-[10%] left-[5%] font-black text-[13vw] text-amber-600 font-mono tracking-tighter">8888</div>
        <div className="absolute top-[50%] right-[5%] font-black text-[15vw] text-red-600 font-mono">發</div>
      </div>

      {/* Header Section */}
      <div className="relative py-12 border-b-2 border-amber-500/20 bg-gradient-to-b from-red-800 via-red-900 to-red-950 text-white shadow-xl overflow-hidden text-center">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>
        <div className="absolute inset-0 bg-[url('/images/header_dragon_bg.png')] bg-cover bg-center opacity-30 mix-blend-overlay pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-3">
          <Link href="/" className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-amber-400 hover:text-amber-300 transition-colors bg-black/30 px-3.5 py-1.5 rounded-full border border-white/10 shadow-inner">
            ⬅️ 返回 NEO4D 首页
          </Link>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
            今日 <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">{operatorName}</span> 开彩结果
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto font-medium leading-relaxed uppercase tracking-wider">
            ✨ 无广告、大字清晰，全马极速发布 ✨
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-xl mx-auto px-4 mt-8 relative z-10">
        <div className={`group bg-white rounded-3xl overflow-hidden border-t-8 ${info.borderColor} border-x border-b border-slate-200 shadow-xl`}>
          {/* Operator Banner */}
          <div className={`px-6 py-5 flex justify-between items-center ${info.headerBg} ${info.color}`}>
            <div>
              <h2 className="font-black text-lg tracking-tight uppercase">{info.name}</h2>
              <p className="text-xs font-bold uppercase tracking-wider mt-0.5">
                期号: <span className="font-mono font-black">{opData?.drawNo || '----'}</span>
              </p>
            </div>
            <span className="text-xs font-mono font-black bg-white/20 border border-white/30 px-3 py-1 rounded shadow-sm">
              {opData?.date || results?.date || '----'}
            </span>
          </div>

          {/* High-Contrast Bold Prize Display */}
          <div className="p-6 space-y-4 bg-white">
            {/* 1st Prize */}
            <div className={`flex flex-col p-4 rounded-2xl border bg-gradient-to-br ${info.p1Gradient} relative overflow-hidden`}>
              <span className="text-black text-[12px] font-black uppercase tracking-wider">
                🏆 首獎 1ST PRIZE
              </span>
              <span className="font-number text-5xl md:text-6xl text-center text-black tracking-[0.05em] py-3 font-black">
                {opData?.numbers?.first || '----'}
              </span>
            </div>

            {/* 2nd & 3rd Prize Side-by-Side */}
            <div className="grid grid-cols-2 gap-3">
              {/* 2nd Prize */}
              <div className="flex flex-col p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-black text-[10px] md:text-[11px] font-black uppercase tracking-wider">
                  🥈 二獎 2ND PRIZE
                </span>
                <span className="font-number text-3xl md:text-4xl text-center text-black tracking-[0.05em] mt-2 font-bold">
                  {opData?.numbers?.second || '----'}
                </span>
              </div>

              {/* 3rd Prize */}
              <div className="flex flex-col p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-black text-[10px] md:text-[11px] font-black uppercase tracking-wider">
                  🥉 三獎 3RD PRIZE
                </span>
                <span className="font-number text-3xl md:text-4xl text-center text-black tracking-[0.05em] mt-2 font-bold">
                  {opData?.numbers?.third || '----'}
                </span>
              </div>
            </div>
          </div>

          {/* Specials/Consolations */}
          <div className="px-6 pb-6 border-t border-slate-100 bg-slate-50/20 pt-5 space-y-5">
            {/* Specials */}
            <div>
              <h4 className="text-[12px] font-black text-black uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                特别奖 (Special Prizes)
              </h4>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 text-center">
                {opData?.numbers?.special && opData.numbers.special.length > 0 ? (
                  opData.numbers.special.map((num, i) => (
                    <div 
                      key={i} 
                      className="font-number text-lg md:text-xl py-2 rounded-xl border border-amber-200 bg-amber-50/50 font-black text-slate-800"
                    >
                      {num}
                    </div>
                  ))
                ) : (
                  Array(10).fill('----').map((num, i) => (
                    <div key={i} className="font-number text-lg py-2 rounded-xl border border-slate-100 bg-slate-50/10 text-slate-300">{num}</div>
                  ))
                )}
              </div>
            </div>

            {/* Consolations */}
            <div>
              <h4 className="text-[12px] font-black text-black uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                安慰奖 (Consolation Prizes)
              </h4>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 text-center">
                {opData?.numbers?.consolation && opData.numbers.consolation.length > 0 ? (
                  opData.numbers.consolation.map((num, i) => (
                    <div 
                      key={i} 
                      className="font-number text-lg md:text-xl py-2 rounded-xl border border-slate-200 bg-slate-50/50 font-black text-slate-800"
                    >
                      {num}
                    </div>
                  ))
                ) : (
                  Array(10).fill('----').map((num, i) => (
                    <div key={i} className="font-number text-lg py-2 rounded-xl border border-slate-100 bg-slate-50/10 text-slate-300">{num}</div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 font-mono">
            <span>数据源于官方广播独立校验</span>
            <span>已启用极速代理</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Link href="/predictions" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 text-center shadow-sm hover:shadow transition-all group">
            <span className="text-2xl block mb-1">📈</span>
            <span className="text-xs font-black text-slate-800 group-hover:text-amber-600">今日 AI 万字预测</span>
          </Link>
          <Link href="/dreams" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 text-center shadow-sm hover:shadow transition-all group">
            <span className="text-2xl block mb-1">🔮</span>
            <span className="text-xs font-black text-slate-800 group-hover:text-amber-600">大伯公千字图</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
