import { fetch4dData } from '../utils/fetch4d';
import WidgetClient from './WidgetClient';

export const revalidate = 10;
export const dynamic = 'force-dynamic';

export default async function WidgetPage() {
  const data = await fetch4dData();
  return <WidgetClient data={data} />;
}
