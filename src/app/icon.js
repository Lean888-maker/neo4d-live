import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = { width: 144, height: 144 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
          borderRadius: '50%',
          border: '8px solid #f59e0b',
          color: 'white',
          fontSize: 72,
          fontWeight: 900,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', marginTop: '-4px' }}>
          4D
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
