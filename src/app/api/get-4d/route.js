import { NextResponse } from 'next/server';

export async function GET() {
  const url = 'https://4d-results.p.rapidapi.com/latest'; 
  
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-host': '4d-results.p.rapidapi.com',
      'x-rapidapi-key': process.env.RAPIDAPI_KEY
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error("Data proxy fetch failed:", error);
    return NextResponse.json({ error: 'Data Fetch Error' }, { status: 500 });
  }
}