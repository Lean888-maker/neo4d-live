import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          borderRadius: '25%', // Apple icons should have slightly rounded corners, though iOS clips it anyway.
          border: '10px solid #f59e0b',
          color: 'white',
          fontSize: 90,
          fontWeight: 900,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', marginTop: '-6px' }}>
          4D
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
