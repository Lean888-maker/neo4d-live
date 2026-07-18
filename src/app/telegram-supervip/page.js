export const dynamic = 'force-dynamic';

import ClientWheel from './ClientWheel';

export const metadata = {
  title: 'NEO4D VIP | 生成幸运号码',
  description: '仅限NEO4D Telegram内部订阅者访问。生成今日高胜率号码。',
  openGraph: {
    title: 'NEO4D VIP | 生成幸运号码',
    description: '仅限NEO4D Telegram内部订阅者访问。生成今日高胜率号码。',
    url: 'https://neo4d.live/telegram-supervip',
    images: [{ url: 'https://neo4d.live/api/og' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEO4D VIP | 生成幸运号码',
    description: '仅限NEO4D Telegram内部订阅者访问。生成今日高胜率号码。',
    images: ['https://neo4d.live/api/og'],
  },
};

export default function TelegramSuperVip() {
  return <ClientWheel />;
}
