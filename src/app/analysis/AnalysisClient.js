'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function AnalysisClient() {
  const [numQuery, setNumQuery] = useState('');
  const [activeNum, setActiveNum] = useState('');
  const [lang, setLang] = useState('zh');

  const t = {
    en: {
      backHome: '⬅️ Back to Home',
      title: '4D Number Analyzer',
      subtitle: '✨ Search and inspect historical luck frequencies & compatibility profiles ✨',
      placeholder: 'Enter 4D number (e.g. 8888)...',
      analyze: 'Analyze Number',
      enterValid: 'Please enter a valid 4-digit number.',
      frequency: 'Frequency Status',
      luckyDay: 'Dominant Lucky Day',
      bestOperator: 'Best Match Operator',
      coldDuration: 'Cold Spell Duration',
      recommendIndex: 'Luck Index Percentage',
      disclaimer: '*Note: Statistical indicators are calculated based on deterministic probability mapping for research and entertainment purposes. Please play responsibly.',
      shareText: 'I just checked the lucky metrics for 4D number {num} on NEO4D.LIVE! Luck Index is {idx}%, best day is {day}. Check yours here: https://neo4d.live/analysis',
      shareBtn: '💬 Share results to WhatsApp'
    },
    zh: {
      backHome: '⬅️ 返回 NEO4D 首页',
      title: '4D 万字历史频数分析',
      subtitle: '✨ 输入任意 4D 数字查询其历史大出频率、生肖契合度与最佳投注平台 ✨',
      placeholder: '输入4位数字 (例如：8888)...',
      analyze: '开始分析吉数',
      enterValid: '请输入有效的4位数字。',
      frequency: '出彩频率状态',
      luckyDay: '最强吉星开彩日',
      bestOperator: '最佳契合开彩商',
      coldDuration: '冷码未出间隔期',
      recommendIndex: '今日运势吉数百分比',
      disclaimer: '*声明：所有数据分析基于确定性概率分布演算与娱乐参考，不构成投注建议。请理智对待投注行为。',
      shareText: '我在 NEO4D.LIVE 查了今日万字吉数【{num}】的契合分析！运势指数达 {idx}%，最强吉日是【{day}】！来看看你的吉数分析吧：https://neo4d.live/analysis',
      shareBtn: '💬 一键分享结果至 WhatsApp'
    }
  };

  const getDeterministicStats = (num) => {
    if (!num || num.length !== 4) return null;
    
    // Simple deterministic hash based on number digits
    let hash = 0;
    for (let i = 0; i < num.length; i++) {
      hash = num.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);

    const frequencies = {
      zh: ['极热 (Hot)', '中频出彩 (Moderate)', '冷码蓄力 (Cold)', '爆冷倾向 (Overdue)'],
      en: ['Hot (High Frequency)', 'Moderate Frequency', 'Cold (Low Frequency)', 'Overdue / High Alert']
    };

    const days = {
      zh: ['星期三 (Wednesday)', '星期六 (Saturday)', '星期日 (Sunday)', '特别彩周二 (Special Tuesday)'],
      en: ['Wednesday', 'Saturday', 'Sunday', 'Special Tuesday']
    };

    const operators = ['MAGNUM 4D (万能)', 'SPORTS TOTO (多多)', 'DA MA CAI 1+3D (大马彩)', 'SINGAPORE POOLS (新加坡博彩)'];

    const freqIndex = hash % frequencies.zh.length;
    const dayIndex = (hash >> 2) % days.zh.length;
    const opIndex = (hash >> 4) % operators.length;
    const coldSpell = (hash % 18) + 1; // 1 to 18 weeks
    const luckPercentage = (hash % 31) + 70; // 70% to 100%

    return {
      num,
      frequency: {
        zh: frequencies.zh[freqIndex],
        en: frequencies.en[freqIndex]
      },
      luckyDay: {
        zh: days.zh[dayIndex],
        en: days.en[dayIndex]
      },
      operator: operators[opIndex],
      coldDuration: {
        zh: `${coldSpell} 周 (Weeks)`,
        en: `${coldSpell} Weeks`
      },
      luck: luckPercentage
    };
  };

  const stats = useMemo(() => {
    return getDeterministicStats(activeNum);
  }, [activeNum]);

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanNum = numQuery.replace(/\D/g, '');
    if (cleanNum.length === 4) {
      setActiveNum(cleanNum);
    } else {
      alert(t[lang].enterValid);
    }
  };

  const handleShare = () => {
    if (!stats) return;
    const rawShare = t[lang].shareText
      .replace('{num}', stats.num)
      .replace('{idx}', stats.luck)
      .replace('{day}', lang === 'zh' ? stats.luckyDay.zh : stats.luckyDay.en);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(rawShare)}`, '_blank');
  };

  return (
    <main className="min-h-screen text-slate-800 pb-16 relative bg-[#faf8f5]">
      {/* Top Gold cloud border ornament */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.015] select-none z-0">
        <div className="absolute top-[10%] left-[5%] font-black text-[13vw] text-amber-600 font-mono tracking-tighter">1688</div>
        <div className="absolute top-[50%] right-[5%] font-black text-[15vw] text-red-600 font-mono">吉</div>
      </div>

      {/* Header Section */}
      <div className="relative py-12 border-b-2 border-amber-500/20 bg-gradient-to-b from-red-800 via-red-900 to-red-950 text-white shadow-xl overflow-hidden text-center">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>
        <div className="absolute inset-0 bg-[url('/images/header_dragon_bg.png')] bg-cover bg-center opacity-30 mix-blend-overlay pointer-events-none"></div>

        {/* EN / 中文 Switcher Button */}
        <div className="absolute top-5 right-5 flex gap-1 bg-black/30 p-1.5 rounded-full border border-white/20 shadow-inner text-xs md:text-sm font-black tracking-wider z-20">
          <button 
            onClick={() => setLang('en')} 
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer font-black ${lang === 'en' ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md' : 'text-slate-300'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLang('zh')} 
            className={`px-4 py-1.5 rounded-full transition-all cursor-pointer font-black ${lang === 'zh' ? 'bg-gradient-to-r from-amber-500 to-red-600 text-white shadow-md' : 'text-slate-300'}`}
          >
            中文
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-3">
          <Link href="/" className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-amber-400 hover:text-amber-300 transition-colors bg-black/30 px-3.5 py-1.5 rounded-full border border-white/10 shadow-inner">
            {t[lang].backHome}
          </Link>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
            {t[lang].title}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto font-medium leading-relaxed uppercase tracking-wider">
            {t[lang].subtitle}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-xl mx-auto px-4 mt-8 relative z-10">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl space-y-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                maxLength={4}
                value={numQuery}
                onChange={(e) => setNumQuery(e.target.value.replace(/\D/g, ''))}
                placeholder={t[lang].placeholder}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800 transition-all font-mono font-bold text-center tracking-[0.25em]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-red-700 to-red-900 text-white rounded-2xl border border-amber-500/20 font-black text-sm uppercase tracking-wider shadow-md hover:scale-102 hover:border-amber-400/50 transition-all cursor-pointer"
            >
              🚀 {t[lang].analyze}
            </button>
          </form>

          {stats && (
            <div className="space-y-4 animate-fade-in border-t border-slate-100 pt-6">
              <div className="text-center pb-4">
                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase block mb-1">
                  吉数 (Analyzed Number)
                </span>
                <span className="font-number text-6xl text-red-600 tracking-[0.1em] font-black drop-shadow-sm">
                  {stats.num}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Freq */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    {t[lang].frequency}
                  </span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {lang === 'zh' ? stats.frequency.zh : stats.frequency.en}
                  </span>
                </div>

                {/* Lucky Day */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    {t[lang].luckyDay}
                  </span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {lang === 'zh' ? stats.luckyDay.zh : stats.luckyDay.en}
                  </span>
                </div>

                {/* Match */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    {t[lang].bestOperator}
                  </span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {stats.operator}
                  </span>
                </div>

                {/* Cold Duration */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    {t[lang].coldDuration}
                  </span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {lang === 'zh' ? stats.coldDuration.zh : stats.coldDuration.en}
                  </span>
                </div>
              </div>

              {/* Luck index bar */}
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-black text-amber-800">
                  <span>{t[lang].recommendIndex}</span>
                  <span>{stats.luck}%</span>
                </div>
                <div className="w-full h-3 bg-amber-200/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500" 
                    style={{ width: `${stats.luck}%` }}
                  />
                </div>
              </div>

              <button
                onClick={handleShare}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow border border-emerald-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors active:scale-98"
              >
                {t[lang].shareBtn}
              </button>
            </div>
          )}

          <p className="text-[10px] text-slate-400 text-center leading-relaxed font-medium">
            {t[lang].disclaimer}
          </p>
        </div>
      </div>
    </main>
  );
}
