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
            backgroundColor: '#0a0a0a',
            backgroundImage: 'radial-gradient(circle at center, #1f2937 0%, #030712 100%)',
            fontFamily: 'sans-serif',
            color: 'white',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
               <div style={{ fontSize: 72, fontWeight: '900', color: '#fbbf24', textShadow: '0 0 30px rgba(251,191,36,0.6)' }}>NEO4D LIVE</div>
               <div style={{ fontSize: 60 }}>🎲</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
              <span style={{ backgroundColor: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', padding: '5px 20px', borderRadius: '20px', fontSize: 24, color: '#fbbf24', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live Draw: {drawDate}</span>
            </div>
          </div>

          {/* Results Board */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}>
            
            {/* Magnum */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#111827', padding: '30px 45px', borderRadius: '30px', border: '2px solid #334155', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
              <h2 style={{ fontSize: 40, color: '#ef4444', margin: 0, fontWeight: '900', letterSpacing: '0.05em' }}>MAGNUM</h2>
              <div style={{ width: '100%', height: '2px', backgroundColor: '#334155', margin: '20px 0' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 22, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>1st Prize</span>
                <span style={{ fontSize: 64, color: '#fbbf24', fontWeight: '900', margin: '10px 0', textShadow: '0 0 15px rgba(251,191,36,0.3)' }}>{magnum.p1 || '----'}</span>
                <span style={{ fontSize: 20, color: '#64748b', marginTop: 15 }}>2nd Prize: <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{magnum.p2 || '----'}</span></span>
                <span style={{ fontSize: 20, color: '#64748b', marginTop: 10 }}>3rd Prize: <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{magnum.p3 || '----'}</span></span>
              </div>
            </div>

            {/* Toto */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#111827', padding: '30px 45px', borderRadius: '30px', border: '2px solid #334155', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
              <h2 style={{ fontSize: 40, color: '#ef4444', margin: 0, fontWeight: '900', letterSpacing: '0.05em' }}>TOTO</h2>
              <div style={{ width: '100%', height: '2px', backgroundColor: '#334155', margin: '20px 0' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 22, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>1st Prize</span>
                <span style={{ fontSize: 64, color: '#fbbf24', fontWeight: '900', margin: '10px 0', textShadow: '0 0 15px rgba(251,191,36,0.3)' }}>{toto.p1 || '----'}</span>
                <span style={{ fontSize: 20, color: '#64748b', marginTop: 15 }}>2nd Prize: <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{toto.p2 || '----'}</span></span>
                <span style={{ fontSize: 20, color: '#64748b', marginTop: 10 }}>3rd Prize: <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{toto.p3 || '----'}</span></span>
              </div>
            </div>

            {/* Da Ma Cai */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#111827', padding: '30px 45px', borderRadius: '30px', border: '2px solid #334155', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
              <h2 style={{ fontSize: 40, color: '#3b82f6', margin: 0, fontWeight: '900', letterSpacing: '0.05em' }}>DA MA CAI</h2>
              <div style={{ width: '100%', height: '2px', backgroundColor: '#334155', margin: '20px 0' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 22, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>1st Prize</span>
                <span style={{ fontSize: 64, color: '#fbbf24', fontWeight: '900', margin: '10px 0', textShadow: '0 0 15px rgba(251,191,36,0.3)' }}>{damacai.p1 || '----'}</span>
                <span style={{ fontSize: 20, color: '#64748b', marginTop: 15 }}>2nd Prize: <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{damacai.p2 || '----'}</span></span>
                <span style={{ fontSize: 20, color: '#64748b', marginTop: 10 }}>3rd Prize: <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{damacai.p3 || '----'}</span></span>
              </div>
            </div>

          </div>

          <p style={{ marginTop: 50, fontSize: 26, color: '#94a3b8', fontWeight: 'bold', letterSpacing: '0.05em' }}>
            Check Full Results at <span style={{ color: '#fbbf24' }}>NEO4D.LIVE</span>
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
