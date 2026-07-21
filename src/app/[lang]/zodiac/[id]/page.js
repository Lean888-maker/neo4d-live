import ZodiacDetailClient from './ZodiacDetailClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const validZodiacs = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const lang = resolvedParams?.lang || 'zh';

  if (!validZodiacs.includes(id)) {
    return {};
  }

  const names = {
    rat: { zh: '生肖鼠', en: 'Rat' },
    ox: { zh: '生肖牛', en: 'Ox' },
    tiger: { zh: '生肖虎', en: 'Tiger' },
    rabbit: { zh: '生肖兔', en: 'Rabbit' },
    dragon: { zh: '生肖龙', en: 'Dragon' },
    snake: { zh: '生肖蛇', en: 'Snake' },
    horse: { zh: '生肖马', en: 'Horse' },
    goat: { zh: '生肖羊', en: 'Goat' },
    monkey: { zh: '生肖猴', en: 'Monkey' },
    rooster: { zh: '生肖鸡', en: 'Rooster' },
    dog: { zh: '生肖狗', en: 'Dog' },
    pig: { zh: '生肖猪', en: 'Pig' },
  };

  const nameObj = names[id];
  const title = lang === 'zh' 
    ? `今日【${nameObj.zh}】发财4D号码推荐与运势解析 | NEO4D LIVE`
    : `Today's ${nameObj.en} Zodiac Lucky 4D Numbers & Horoscope | NEO4D LIVE`;

  const desc = lang === 'zh'
    ? `免费查询今日最新【${nameObj.zh}】专属生肖吉数、财运吉凶、幸运颜色及五行吉时预测，大数据智能推算。`
    : `Check today's ${nameObj.en} zodiac lucky 4D numbers, wealth forecast, lucky hours, and directions.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://neo4d.live/${lang}/zodiac/${id}`,
      languages: {
        'zh': `https://neo4d.live/zh/zodiac/${id}`,
        'en': `https://neo4d.live/en/zodiac/${id}`,
        'x-default': `https://neo4d.live/zh/zodiac/${id}`,
      },
    },
  };
}

export default async function ZodiacDetailPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const lang = resolvedParams?.lang || 'zh';

  if (!validZodiacs.includes(id)) {
    notFound();
  }

  return <ZodiacDetailClient id={id} lang={lang} />;
}
