'use client';

import Link from 'next/link';

const zodiacDataMap = {
  rat: {
    name: '鼠', pinyin: 'Shǔ', icon: '🐭', element: '水 (Water)',
    descZh: '属鼠的朋友聪明伶俐，机智过人，擅长察言观色和捕捉微小的机会。在今日的五行磁场中，属鼠者财运呈上升趋势，尤其是在偏财运方面，容易获得意外之财。',
    descEn: 'Those born in the Year of the Rat are smart, resourceful, and sharp-witted. Today\'s elemental alignment shows an upward trend in wealth luck, especially in windfall/indirect luck.',
    adviceZh: '今日财气聚于北面，特别适合在午后或夜间进行决策。如果遇到突如其来的灵感数字，切记第一时间记录下来。',
    adviceEn: 'Today\'s wealth energy gathers in the North. Highly recommended to make financial choices in the afternoon/night. Write down any sudden number inspirations immediately.',
    personalityZh: '直觉敏锐、处事细心、擅长社交、具有极佳的危机意识。',
    personalityEn: 'Intuitive, detail-oriented, highly social, and excellent at crisis management.',
    luckyNumFormula: 'date-base-01'
  },
  ox: {
    name: '牛', pinyin: 'Niú', icon: '🐮', element: '土 (Earth)',
    descZh: '属牛的朋友踏实肯干，耐力惊人，作风稳健。今日适逢土生金的吉运，财星高照，代表你的坚持即将获得丰厚的回报，今天的幸运磁场非常适合锁定心仪的4D字。',
    descEn: 'People born in the Year of the Ox are steady, industrious, and highly resilient. Today\'s Earth-Gold element alignment brings shining wealth luck, indicating reward for your hard work.',
    adviceZh: '不要急于求成，多留意身边带有"1"和"8"数字的凭证，今日发财吉时在凌晨至清晨，早起能吸纳第一波财气。',
    adviceEn: 'Be patient. Pay attention to documents or receipts containing the numbers "1" and "8". Today\'s luck peaks in the early morning.',
    personalityZh: '忠厚老实、勤劳勇敢、责任感强、作风严谨稳健。',
    personalityEn: 'Honest, hardworking, responsible, and structured in approach.',
    luckyNumFormula: 'date-base-02'
  },
  tiger: {
    name: '虎', pinyin: 'Hǔ', icon: '🐯', element: '木 (Wood)',
    descZh: '属虎的朋友天生具备领导力，敢想敢干，富有冒险精神。今日五行木气旺盛，意味着你拥有极强的开拓运，非常适合尝试新的灵感、新的号码组合。',
    descEn: 'Those born in the Year of the Tiger are natural leaders, courageous, and adventurous. Strong Wood element energy today offers excellent growth luck for trying new lucky numbers.',
    adviceZh: '财位处于东北方，今日可以适当做出果断决策，避免犹豫不决。你第一眼看到的4D组合就是你的今日吉数。',
    adviceEn: 'Your wealth position lies in the Northeast. Trust your initial instinct; the first 4D combination you spot today holds your strongest luck.',
    personalityZh: '雄心勃勃、热情大胆、慷慨大方、富有正义感。',
    personalityEn: 'Ambitious, passionate, bold, generous, and has a strong sense of justice.',
    luckyNumFormula: 'date-base-03'
  },
  rabbit: {
    name: '兔', pinyin: 'Tù', icon: '🐰', element: '木 (Wood)',
    descZh: '属兔的朋友性格温柔、心思细腻，人缘极佳。今日财运磁场较为平稳，但在贵人相助下，会有意想不到的惊喜号码被引荐给你，保持社交活跃有助于提升财运。',
    descEn: 'Rabbits are gentle, analytical, and highly popular. While raw wealth energy is stable, key benefactors (Gui Ren) may introduce high-potential lucky numbers to you today.',
    adviceZh: '多与属羊或属猪的朋友交流，他们今日是你的财运贵人。发财方向在正东，适合使用柔和的金黄色物品加持好运。',
    adviceEn: 'Connect with Pig or Goat zodiac friends today; they are your wealth guides. Focus on the East and use gold items to boost luck.',
    personalityZh: '优雅温和、心思缜密、追求和谐、做事谨慎。',
    personalityEn: 'Gentle, analytical, peace-loving, and highly cautious.',
    luckyNumFormula: 'date-base-04'
  },
  dragon: {
    name: '龙', pinyin: 'Lóng', icon: '🐲', element: '土 (Earth)',
    descZh: '属龙的朋友气宇轩昂，才华横溢，做事有大局观。今日有龙德星高照，气场极强，不管是生活还是求财都容易心想事成，幸运4D号的命中概率也因此大增。',
    descEn: 'Dragons are charismatic, talented, and visionary. Blessed by the Dragon-Virtue star today, your general luck is extremely strong, significantly increasing your lucky number strike rates.',
    adviceZh: '今日宜保持自信，锁定你经常梦见或见到的固定号码，发财吉时为早上7点至9点，避开过于复杂的组合。',
    adviceEn: 'Stay confident. Focus on numbers that appear regularly in your dreams or daily routines. Peak wealth hour is 7:00 AM - 9:00 AM.',
    personalityZh: '自信果敢、富有魅力、充满活力、志向远大。',
    personalityEn: 'Self-confident, charismatic, highly energetic, and ambitious.',
    luckyNumFormula: 'date-base-05'
  },
  snake: {
    name: '蛇', pinyin: 'Shé', icon: '🐍', element: '火 (Fire)',
    descZh: '属蛇的朋友冷静理智，直觉极度敏锐，擅长深谋远虑。今日五行火旺，燃起了你的财富欲望，这也使你的感官与潜意识灵感达到巅峰，最容易在解梦中发现密码。',
    descEn: 'Snakes are calm, logical, and highly intuitive. Strong Fire element today sharpens your subconscious inspiration, making dream decoding highly lucrative.',
    adviceZh: '相信你脑海里突然闪过的数字组合。今日发财方位在东南，红色和绿色是今日最强幸运色。',
    adviceEn: 'Trust the sudden number combos that flash in your mind. Focus on the Southeast direction. Red and Green are your lucky colors.',
    personalityZh: '冷静沉着、直觉敏锐、处事神秘、充满智慧。',
    personalityEn: 'Calm, highly intuitive, wise, and carrying a mysterious aura.',
    luckyNumFormula: 'date-base-06'
  },
  horse: {
    name: '马', pinyin: 'Mǎ', icon: '🐴', element: '火 (Fire)',
    descZh: '属马的朋友性格开朗，行动力极强，热爱自由。今日火生土，求财运势势如破竹，适合主动出击。不要放过任何一个与车辆、路牌相关的随机数字。',
    descEn: 'Horses are optimistic, highly active, and freedom-loving. Strong wealth momentum today supports decisive action. Keep an eye on license plates and road sign numbers.',
    adviceZh: '发财吉时为中午11点至1点，正南方是你的聚财方位。多使用红色配饰可以刺激今日财运磁场。',
    adviceEn: 'Lucky peak window is 11:00 AM - 1:00 PM. South is your wealth orientation. Use red accessories to stimulate financial luck.',
    personalityZh: '精力充沛、热爱社交、做事果断、热爱冒险。',
    personalityEn: 'Energetic, highly social, decisive, and loves adventure.',
    luckyNumFormula: 'date-base-07'
  },
  goat: {
    name: '羊', pinyin: 'Yáng', icon: '🐐', element: '土 (Earth)',
    descZh: '属羊的朋友儒雅温和，富有创造力，做事务实。今日你的财富格局平稳上升，适合在安静的环境中冷静分析历史数据，找出最符合今日走势的规律字。',
    descEn: 'Goats are creative, gentle, and pragmatic. Today\'s stable wealth trend is ideal for looking at past results directories and identifying pattern-based numbers.',
    adviceZh: '财运吉星集中在西南方，多关注与日期、时间相关的组合。今日吉色为绿色和紫色，能带给你平和与财运。',
    adviceEn: 'Your luck stars cluster in the Southwest. Focus on date and time combinations. Lucky colors are Green and Purple.',
    personalityZh: '温柔善良、富有同情心、艺术天赋高、心思细腻。',
    personalityEn: 'Gentle, compassionate, artistic, and detail-oriented.',
    luckyNumFormula: 'date-base-08'
  },
  monkey: {
    name: '猴', pinyin: 'Hóu', icon: '🐵', element: '金 (Metal)',
    descZh: '属猴的朋友活泼好动，脑筋灵活，应变能力极强。今日五行金气凝聚，说明你的智慧能在求财中派上用场，通过逻辑分析和AI推算的号码能让你如虎添翼。',
    descEn: 'Monkeys are lively, highly intelligent, and adaptable. Today\'s dominant Metal element energy suggests your logic, combined with AI calculations, will bring fortune.',
    adviceZh: '下午3点至5点是你的黄金时段，宜打开发财箱获取专属数字。正西方与西南方都是不错的财气来源。',
    adviceEn: '3:00 PM - 5:00 PM is your golden hour to shake the fortune chest. Focus on West and Southwest directions.',
    personalityZh: '机智幽默、学习力强、应变神速、精力充沛。',
    personalityEn: 'Witty, quick learner, highly adaptable, and energetic.',
    luckyNumFormula: 'date-base-09'
  },
  rooster: {
    name: '鸡', pinyin: 'Jī', icon: '🐔', element: '金 (Metal)',
    descZh: '属鸡的朋友勤奋踏实，有条理，善于理财。今日有贵人相助，有利于在合伙或群组中获得高爆率号码。今日的幸运数字将带给你强烈的直觉感应。',
    descEn: 'Roosters are diligent, organized, and great at wealth management. Benefactor luck is strong today; group discussions or VIP pools will yield great numbers.',
    adviceZh: '正西方是你的财位，今日吉色为黄色和金色，适合在傍晚17:00至19:00进行投注或求字。',
    adviceEn: 'West is your primary wealth direction. Lucky colors are Yellow and Gold. Best time window is 5:00 PM - 7:00 PM.',
    personalityZh: '精力充沛、做事严谨、表达力强、追求完美。',
    personalityEn: 'Energetic, meticulous, highly expressive, and detail-oriented.',
    luckyNumFormula: 'date-base-10'
  },
  dog: {
    name: '狗', pinyin: 'Gǒu', icon: '🐶', element: '土 (Earth)',
    descZh: '属狗的朋友忠诚可靠，正义感强，做事有始有终。今日财运有暗财生旺，代表会有意想不到的偏财红字在不经意间显现，建议多留意路边的随机事件。',
    descEn: 'Dogs are loyal, reliable, and persistent. Today\'s hidden wealth star indicates unexpected lucky combinations will appear in daily encounters.',
    adviceZh: '吉时为晚上19:00至21:00，西北方向最聚财。红色和黄色可带旺你今日的守护磁场。',
    adviceEn: 'Best hour is 7:00 PM - 9:00 PM. Northwest is the wealth focus. Red and Yellow will protect and boost your aura today.',
    personalityZh: '忠诚可靠、直率真诚、责任心重、防备心强。',
    personalityEn: 'Loyal, direct, highly responsible, and protective.',
    luckyNumFormula: 'date-base-11'
  },
  pig: {
    name: '猪', pinyin: 'Zhū', icon: '🐷', element: '水 (Water)',
    descZh: '属猪的朋友性格豁达，福气深厚，一生财运亨通。今日水气生财，是偏财爆发的绝佳日子，非常适合参与预测或解梦，获取今日最具爆点性的4D号码。',
    descEn: 'Pigs are easygoing, blessed, and naturally lucky with wealth. Today\'s dominant Water element creates massive windfall/4D luck, perfect for dream decoding.',
    adviceZh: '多关注黑色和灰色的幸运色，今日的财位处于西北偏北。夜间21:00至23:00是你财气最旺的时刻。',
    adviceEn: 'Focus on Black and Grey colors. Wealth position lies in North-Northwest. Peak lucky window is 9:00 PM - 11:00 PM.',
    personalityZh: '真诚善良、心胸宽广、福气深厚、乐观豁达。',
    personalityEn: 'Honest, generous, naturally blessed, and highly optimistic.',
    luckyNumFormula: 'date-base-12'
  }
};

export default function ZodiacDetailClient({ id, lang }) {
  const zodiac = zodiacDataMap[id];
  const todayStr = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  const dateIso = new Date().toISOString().split('T')[0];

  // Deterministic calculation of 4 sets of numbers so the page feels rich and valuable for SEO
  const getDeterministic4D = (zodiacId, modifier) => {
    const seed = `${dateIso}-${zodiacId}-${modifier}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const num = Math.abs(hash) % 10000;
    return String(num).padStart(4, '0');
  };

  const luckyNums = [
    { type: lang === 'zh' ? '头奖吉数 (1st Prize Lucky)' : '1st Prize Lucky', val: getDeterministic4D(id, 'first') },
    { type: lang === 'zh' ? '二奖吉数 (2nd Prize Lucky)' : '2nd Prize Lucky', val: getDeterministic4D(id, 'second') },
    { type: lang === 'zh' ? '三奖吉数 (3rd Prize Lucky)' : '3rd Prize Lucky', val: getDeterministic4D(id, 'third') },
    { type: lang === 'zh' ? '特别推荐 (Special Pick)' : 'Special Pick', val: getDeterministic4D(id, 'special') }
  ];

  return (
    <main className="min-h-screen text-slate-800 pb-16 bg-[#faf8f5] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.01] select-none z-0">
        <div className="absolute top-[15%] left-[5%] font-black text-[15vw] text-red-600 font-mono">吉</div>
        <div className="absolute top-[60%] right-[5%] font-black text-[12vw] text-amber-500 font-mono">发</div>
      </div>

      {/* Premium Header */}
      <div className="relative py-12 border-b-2 border-amber-500/20 bg-gradient-to-b from-red-800 via-red-900 to-red-950 text-white shadow-xl overflow-hidden text-center z-10">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>
        <div className="max-w-4xl mx-auto px-4 relative space-y-3">
          <Link href={`/${lang}/zodiac`} className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-amber-400 hover:text-amber-300 transition-colors bg-black/30 px-3.5 py-1.5 rounded-full border border-white/10 shadow-inner">
            ⬅️ 返回生肖列表
          </Link>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
            {lang === 'zh' ? `生肖【${zodiac.name}】今日发财运势与4D红字` : `Zodiac ${zodiac.pinyin} (${zodiac.name}) Today's Lucky 4D`}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto font-medium leading-relaxed uppercase tracking-wider">
            📅 {todayStr} · 每日天干地支五行推算预测
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl mx-auto px-4 mt-8 relative z-10">
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-md space-y-8">
          
          {/* Top Intro Card */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <span className="text-7xl md:text-8xl p-4 bg-red-50 rounded-full border border-red-100 filter drop-shadow-md">{zodiac.icon}</span>
            <div className="text-center sm:text-left space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                生肖属{zodiac.name} ({zodiac.pinyin})
              </h2>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full border border-amber-200">
                  五行: {zodiac.element}
                </span>
                <span className="bg-red-100 text-red-800 text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full border border-red-200">
                  吉时: {zodiac.hours}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Forecast Paragraphs (SEO Content Richness) */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 border-l-4 border-red-600 pl-2">
              今日运势详析 (Daily Forecast)
            </h3>
            <p className="text-sm md:text-base text-slate-700 leading-relaxed indent-8">
              {lang === 'zh' ? zodiac.descZh : zodiac.descEn}
            </p>
            <p className="text-sm md:text-base text-slate-700 leading-relaxed indent-8">
              {lang === 'zh' ? zodiac.adviceZh : zodiac.adviceEn}
            </p>
          </div>

          {/* Deterministic Lucky Numbers Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 border-l-4 border-red-600 pl-2">
              今日专属推荐 4D 吉数 (Your Lucky 4D Picks)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {luckyNums.map((num, idx) => (
                <div key={idx} className="bg-gradient-to-b from-yellow-50 to-amber-100/30 border border-amber-300/70 rounded-2xl p-4 text-center hover:border-amber-400 transition-colors shadow-sm">
                  <span className="text-[10px] text-gray-500 font-black tracking-wider uppercase block mb-1">{num.type}</span>
                  <span className="text-3xl md:text-4xl font-black text-red-700 font-mono tracking-widest block py-1">
                    {num.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Personality Traits */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
            <h4 className="font-black text-slate-900 text-sm">🧠 生肖【{zodiac.name}】天生特质 (Zodiac Traits)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'zh' ? zodiac.personalityZh : zodiac.personalityEn}
            </p>
          </div>

          {/* High Conversion Box to Pre-lander */}
          <div className="bg-gradient-to-r from-red-800 to-red-950 text-white rounded-2xl p-6 text-center space-y-4 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('/images/header_dragon_bg.png')] bg-cover bg-center opacity-10 pointer-events-none"></div>
            <div className="relative z-10">
              <span className="text-3xl block mb-2">🎁</span>
              <h4 className="text-lg font-black text-amber-300">觉得这组号码不够带运？</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                属{zodiac.name}者今日的偏财偏向于“动水”磁场。打开发财箱可以让你的个人运势产生共鸣，摇出属于你的第二组头奖预测号码。
              </p>
              <Link 
                href={`/${lang}/telegram-supervip`}
                className="mt-4 inline-block bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black px-8 py-3.5 rounded-xl shadow transition-transform hover:scale-105 active:scale-95 text-xs uppercase tracking-wider"
              >
                🧧 摇取属{zodiac.name}专属发财箱
              </Link>
            </div>
          </div>

          {/* Bottom Disclaimer */}
          <footer className="pt-6 border-t border-slate-100 text-[10px] text-slate-400 font-medium leading-relaxed text-center">
            *声明：本生肖运势及4D预测仅基于传统五行学说及大数据算法娱乐性推算，不构成任何投注建议与保证，请理性娱乐。
          </footer>
        </div>

        {/* Back and Forward navigation */}
        <div className="flex justify-between mt-6 text-xs font-bold text-amber-600">
          <Link href={`/${lang}/zodiac`} className="hover:underline">
            ⬅️ 返回生肖总表
          </Link>
          <Link href={`/${lang}`} className="hover:underline">
            查看今日最新4D开彩结果 ➡️
          </Link>
        </div>
      </div>
    </main>
  );
}
