import ZodiacClient from './ZodiacClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '今日十二生肖发财字与幸运4D预测 | NEO4D LIVE',
  description: '免费获取今日最新生肖运势、财运指数及专属幸运4D字。根据生肖天干地支推算今日最旺生肖幸运号码。',
  keywords: '生肖幸运号码, 生肖 4d, 十二生肖运势, 4d lucky number by zodiac, zodiac fortune 4d',
};

export default async function ZodiacPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || 'zh';

  return <ZodiacClient lang={lang} />;
}
