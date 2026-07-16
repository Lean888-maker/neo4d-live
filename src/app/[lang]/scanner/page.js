import { fetch4dData } from '../../utils/fetch4d';
import ScannerClient from './ScannerClient';

export const dynamic = 'force-dynamic';

export default async function ScannerPage() {
  const data = await fetch4dData();
  return <ScannerClient liveData={data} />;
}
