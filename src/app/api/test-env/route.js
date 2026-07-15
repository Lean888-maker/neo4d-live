export async function GET() {
  const hasKey = !!process.env.GEMINI_API_KEY;
  const keyLength = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0;
  const keyPrefix = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 5) : 'none';
  
  return Response.json({
    hasKey,
    keyLength,
    keyPrefix,
    nodeEnv: process.env.NODE_ENV
  });
}
