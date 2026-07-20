import { GoogleAuth } from 'google-auth-library';

async function testGemini() {
  const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
  const client = await auth.getClient();
  const projectId = await auth.getProjectId();
  const aiLocation = 'us-central1';
  
  const geminiUrl = `https://${aiLocation}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${aiLocation}/publishers/google/models/gemini-1.5-flash-001:generateContent`;
  
  try {
    console.log("Calling:", geminiUrl);
    const res = await client.request({
      url: geminiUrl,
      method: 'POST',
      data: {
        contents: [{ role: 'user', parts: [{ text: "Hello" }] }],
      }
    });
    console.log("Success!", JSON.stringify(res.data).substring(0, 100));
  } catch (err) {
    console.error("Failed!", err.message);
  }
}

testGemini();
