import React from 'react';
import Image from 'next/image';

export const metadata = {
  title: 'Carta Ramalan 4D 2026 | Best 4D Forecast Chart Malaysia',
  description: 'View the latest Carta Ramalan 4D for Magnum, Sports Toto, Da Ma Cai, and Grand Dragon Lotto. Analyze historical patterns with our 2026 4D forecast chart.',
  keywords: 'carta ramalan 4d, 4d forecast chart, magnum 4d prediction, 4d predict today, carta senja, top 50 permutation',
  alternates: {
    canonical: 'https://neo4d.live/en/ramalan',
  },
};

export default function CartaRamalanPage({ params }) {
  const { lang } = params;
  
  const content = {
    en: {
      title: 'Carta Ramalan 4D (Forecast Chart)',
      subtitle: 'Identify Historical Patterns & Hot Numbers for 2026',
      intro: 'The "Carta Ramalan" (Forecast Chart) is a popular visual tool used by veteran lottery players in Malaysia and Singapore. By mapping out historical draw data, these charts help players identify potential number clusters, cold digits, and frequent patterns across Magnum 4D, Sports Toto, and Da Ma Cai.',
      section1Title: 'How to Read a 4D Forecast Chart',
      section1Body: 'A standard Carta Ramalan organizes digits in a matrix. Players look for diagonal sequences, repeating pairs (e.g., 88, 22), and "hot" numbers that have appeared in the top 3 prizes over the last 10 draws. While entirely based on past probabilities, many find this visual analysis helpful for narrowing down their permutations.',
      section2Title: 'Magnum & Toto Permutation Analysis',
      section2Body: 'Beyond visual charts, analyzing the "Top 50 Permutation List" is another advanced strategy. For example, if the digits 1-2-3-4 frequently appear in scrambled forms (like 4321, 2143), a forecast chart will highlight this family of numbers as a high-potential target.',
      disclaimer: 'Disclaimer: Lottery draws are completely random events. Carta Ramalan 4D charts and statistical tools are strictly for entertainment and analytical reference. They do not guarantee winning numbers. Please play responsibly.',
      faqTitle: 'Frequently Asked Questions',
      faq1Q: 'Can a forecast chart guarantee a 4D win?',
      faq1A: 'No. All lottery games are based purely on chance. Charts only show what has happened in the past, not what will happen in the future.',
      faq2Q: 'Which operators are supported in these charts?',
      faq2A: 'Our analysis covers Magnum 4D, Sports Toto, Da Ma Cai, Grand Dragon Lotto (GDL), and Perdana 4D.',
    },
    zh: {
      title: 'Carta Ramalan 4D (万字预测图表)',
      subtitle: '2026年寻找历史规律与热门号码',
      intro: '“Carta Ramalan”（预测图表）是马来西亚和新加坡资深彩票玩家常用的一种视觉工具。通过绘制历史开奖数据，这些图表帮助玩家在 Magnum 4D、Sports Toto 和 Da Ma Cai 中识别潜在的数字集群、冷门数字和频繁出现的模式。',
      section1Title: '如何阅读 4D 预测图表',
      section1Body: '标准的 Carta Ramalan 将数字组织在矩阵中。玩家寻找对角线序列、重复对（例如 88、22）以及过去 10 期在前 3 名中出现的“热门”数字。虽然完全基于过去的概率，但许多人发现这种视觉分析有助于缩小他们的排列组合范围。',
      section2Title: '万能与多多排列分析',
      section2Body: '除了视觉图表之外，分析“前50名排列列表”是另一种高级策略。例如，如果数字 1-2-3-4 经常以打乱的形式出现（如 4321、2143），预测图表会将这组数字突出显示为高潜力目标。',
      disclaimer: '免责声明：彩票开奖是完全随机的事件。Carta Ramalan 4D 图表和统计工具严格用于娱乐和分析参考。它们不能保证中奖号码。请理性投注。',
      faqTitle: '常见问题解答',
      faq1Q: '预测图表能保证中奖吗？',
      faq1A: '不能。所有彩票游戏纯粹基于运气。图表只显示过去发生过什么，而不是将来会发生什么。',
      faq2Q: '这些图表支持哪些博彩公司？',
      faq2A: '我们的分析涵盖了万能 4D (Magnum)、多多 (Sports Toto)、大马彩 (Da Ma Cai)、豪龙 (GDL) 和 Perdana 4D。',
    }
  };

  const t = content[lang] || content.en;

  // Add JSON-LD FAQ Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: t.faq1Q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: t.faq1A,
        },
      },
      {
        '@type': 'Question',
        name: t.faq2Q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: t.faq2A,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Schema.org Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">{t.title}</h1>
          <p className="text-lg md:text-xl text-cyan-400 font-bold">{t.subtitle}</p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-cyan-500/30">
          <Image 
            src="/images/carta-ramalan.png" 
            alt="Carta Ramalan 4D Chart" 
            width={1200} 
            height={630} 
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <p className="text-lg text-slate-700 leading-relaxed font-medium">{t.intro}</p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-black text-indigo-900 mb-4">{t.section1Title}</h2>
            <p className="text-slate-600 leading-relaxed">{t.section1Body}</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-black text-indigo-900 mb-4">{t.section2Title}</h2>
            <p className="text-slate-600 leading-relaxed">{t.section2Body}</p>
          </div>
        </div>
        
        <div className="mt-12 bg-indigo-50 p-8 rounded-2xl border border-indigo-100">
          <h2 className="text-2xl font-black text-indigo-900 mb-6">{t.faqTitle}</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{t.faq1Q}</h3>
              <p className="text-slate-600">{t.faq1A}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{t.faq2Q}</h3>
              <p className="text-slate-600">{t.faq2A}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-slate-200 p-6 rounded-xl border-l-4 border-slate-400">
          <p className="text-sm text-slate-600 italic font-semibold">{t.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
