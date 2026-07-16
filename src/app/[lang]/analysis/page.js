import AnalysisClient from './AnalysisClient';

export const metadata = {
  title: '4D历史频数查询与吉数历史概率分析 | NEO4D LIVE',
  description: '全马最快无广告实时4D开彩平台为您带来历史出彩频数分析、幸运开彩商匹配与投注建议。输入您的4D万字吉数即可开始免费演算。',
  keywords: '4d past results search, 4d lucky number, check4d frequency, 万字历史频数查询, 4d契合度分析',
  alternates: {
    canonical: 'https://neo4d.live/analysis',
  }
};

export default function AnalysisPage() {
  return <AnalysisClient />;
}
