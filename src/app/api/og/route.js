import { ImageResponse } from '@vercel/og';
import { fetch4dData } from '../../utils/fetch4d';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const results = await fetch4dData();
    const magnum = results.magnum || {};
    const toto = results.toto || {};
    const damacai = results.damacai || {};

    const hasDraw = magnum.drawNo && magnum.drawNo !== '----';
    const drawDate = hasDraw ? magnum.drawNo : 'Latest Results';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#450a0a', // bg-red-950
            backgroundImage: 'linear-gradient(to bottom, #7f1d1d, #450a0a)',
            fontFamily: 'sans-serif',
            color: 'white',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
            <h1 style={{ fontSize: 64, fontWeight: 'bolder', margin: 0, color: '#fbbf24' }}>
              NEO4D LIVE 🚀
            </h1>
            <p style={{ fontSize: 32, margin: 0, color: '#fca5a5' }}>Draw: {drawDate}</p>
          </div>

          {/* Results Board */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '40px', marginTop: '20px' }}>
            
            {/* Magnum */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#ffffff', padding: '20px 40px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
              <h2 style={{ fontSize: 40, color: '#dc2626', margin: 0, fontWeight: '900' }}>MAGNUM</h2>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                <span style={{ fontSize: 24, color: '#64748b' }}>1st Prize</span>
                <span style={{ fontSize: 64, color: '#dc2626', fontWeight: 'bold' }}>{magnum.p1 || '----'}</span>
                
                <span style={{ fontSize: 20, color: '#64748b', marginTop: 10 }}>2nd Prize</span>
                <span style={{ fontSize: 40, color: '#1e293b', fontWeight: 'bold' }}>{magnum.p2 || '----'}</span>
                
                <span style={{ fontSize: 20, color: '#64748b', marginTop: 10 }}>3rd Prize</span>
                <span style={{ fontSize: 40, color: '#1e293b', fontWeight: 'bold' }}>{magnum.p3 || '----'}</span>
              </div>
            </div>

            {/* Toto */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#ffffff', padding: '20px 40px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
              <h2 style={{ fontSize: 40, color: '#dc2626', margin: 0, fontWeight: '900' }}>TOTO</h2>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                <span style={{ fontSize: 24, color: '#64748b' }}>1st Prize</span>
                <span style={{ fontSize: 64, color: '#dc2626', fontWeight: 'bold' }}>{toto.p1 || '----'}</span>
                
                <span style={{ fontSize: 20, color: '#64748b', marginTop: 10 }}>2nd Prize</span>
                <span style={{ fontSize: 40, color: '#1e293b', fontWeight: 'bold' }}>{toto.p2 || '----'}</span>
                
                <span style={{ fontSize: 20, color: '#64748b', marginTop: 10 }}>3rd Prize</span>
                <span style={{ fontSize: 40, color: '#1e293b', fontWeight: 'bold' }}>{toto.p3 || '----'}</span>
              </div>
            </div>

            {/* Da Ma Cai */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#ffffff', padding: '20px 40px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
              <h2 style={{ fontSize: 40, color: '#1d4ed8', margin: 0, fontWeight: '900' }}>DA MA CAI</h2>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                <span style={{ fontSize: 24, color: '#64748b' }}>1st Prize</span>
                <span style={{ fontSize: 64, color: '#1d4ed8', fontWeight: 'bold' }}>{damacai.p1 || '----'}</span>
                
                <span style={{ fontSize: 20, color: '#64748b', marginTop: 10 }}>2nd Prize</span>
                <span style={{ fontSize: 40, color: '#1e293b', fontWeight: 'bold' }}>{damacai.p2 || '----'}</span>
                
                <span style={{ fontSize: 20, color: '#64748b', marginTop: 10 }}>3rd Prize</span>
                <span style={{ fontSize: 40, color: '#1e293b', fontWeight: 'bold' }}>{damacai.p3 || '----'}</span>
              </div>
            </div>

          </div>

          <p style={{ marginTop: 40, fontSize: 24, color: '#fef3c7', fontWeight: 'bold' }}>
            Get instant Live Updates at NEO4D.LIVE
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error) {
    console.error('Failed to generate OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
