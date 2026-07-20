import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleAuth } from 'google-auth-library';
import textToSpeech from '@google-cloud/text-to-speech';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateDailyVideo() {
  console.log("🎬 Starting Advanced AI Video Generation with Voiceover...");
  const outDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outDir)) { fs.mkdirSync(outDir, { recursive: true }); }
  
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  // Use AI Studio API key (passed via env variable in Cloud Run)
  const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = ai.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: "application/json" }
  });
  
  // 1. Ask Gemini for Content
  console.log("🧠 Calling Gemini for Chinese Copywriting...");
  let aiData;
  try {
    const response = await model.generateContent(`Generate a JSON object with 4 fields for a viral 4D lottery TikTok video for a Malaysian Chinese audience:
  1. "headline": A very short, punchy relatable hook (e.g., "月底又吃快熟面?", "老板又发脾气?", "想要提早退休?").
  2. "jokeText": A funny, slightly sarcastic 1-sentence joke/complaint about daily life, work, or money, leading into wanting to strike lottery.
  3. "imagePrompt": A prompt for an AI image generator to create a funny 3D Pixar-style relatable scene matching the joke (e.g. stressed office worker, empty wallet) but with a magical glowing twist, 8k, vertical, no text.
  4. "caption": A highly engaging social media caption using emojis and SEO hashtags for Malaysia 4D.`);
    const text = response.response.text();
    aiData = JSON.parse(text);
    console.log("✅ AI Content Generated:", aiData.headline);
  } catch (err) {
    console.error("Gemini failed due to billing/API limits. Using ultra-premium dynamic fallback content:", err.message);
    
    const today = new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' });
    const fallbacks = [
      {
        headline: "月底又吃快熟面?",
        jokeText: "老板不加薪，老婆要买包，月底只能吃 Maggi Mee？别慌！",
        imagePrompt: "A funny highly detailed 3D Pixar style render of a stressed exhausted Malaysian office worker sitting at a desk eating instant noodles, surrounded by glowing golden lottery tickets and magical glowing numbers, cinematic lighting, 8k resolution, vertical format, no text.",
        caption: `😂 ${today} 月底又到了，钱包空空？别怕，大数据预测的幸运数字来了，搞不好明天就辞职！🚀 快截图你的专属靓字！💸 #Malaysia4D #万字 #搞笑 #发大财 #Magnum4D #Damacai #Toto`
      },
      {
        headline: "老板又在发脾气?",
        jokeText: "今天老板又在 office 发神经？不想干了？来看看今天的退休号码！",
        imagePrompt: "A funny highly detailed 3D Pixar style render of an angry boss with steam coming out of his ears, while an employee secretly looks at a glowing magical golden smartphone showing winning lottery numbers, office background, cinematic lighting, 8k, vertical, no text.",
        caption: `🤬 ${today} 老板又发脾气？受够了职场生活？来看看你的「提早退休」幸运号码！💼 祝你早日炒老板鱿鱼！😎 #Malaysia4D #万字 #打工人 #炒老板鱿鱼 #Magnum4D #Damacai #Toto`
      },
      {
        headline: "塞车塞到怀疑人生?",
        jokeText: "每天 Federal Highway 塞到想哭？与其天天塞车，不如中个头奖请司机！",
        imagePrompt: "A funny 3d Pixar style illustration of a frustrated Malaysian driver stuck in massive traffic jam, dreaming of a glowing magical golden helicopter dropping money, neon lighting, hyper detailed, vertical format, 8k, no text.",
        caption: `🚗 ${today} 每天塞车塞到怀疑人生？与其等路通，不如靠自己中头奖！💰 来看今天的大数据预测，准备暴富！🔥 #Malaysia4D #万字 #塞车 #发财 #Magnum4D #Damacai #Toto`
      }
    ];

    aiData = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
  
  // 2. Generate Image via Pollinations (Free High-Quality AI Image API)
  console.log("🎨 Calling Pollinations AI Image Generator...");
  let bgPath = path.join(__dirname, 'assets', 'premium_bg.png'); // Fallback
  try {
    const prompt = encodeURIComponent(aiData.imagePrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1080&height=1920&nologo=true`;
    const imageRes = await fetch(imageUrl);
    const buffer = await imageRes.arrayBuffer();
    bgPath = path.join(__dirname, 'assets', 'dynamic_bg.png');
    fs.writeFileSync(bgPath, Buffer.from(buffer));
    console.log("✅ AI Background Image Generated!");
  } catch (err) {
    console.error("Image generation failed, using fallback:", err.message);
  }

  const num1 = Math.floor(1000 + Math.random() * 9000);
  const num2 = Math.floor(1000 + Math.random() * 9000);

  // 3. Generate Voiceover via Google Cloud TTS
  console.log("🗣️ Generating AI Voiceover...");
  let audioPath = '';
  try {
    const ttsClient = new textToSpeech.TextToSpeechClient();
    const textToRead = `${aiData.headline}。 ${aiData.jokeText}。 今天的大数据最热吉数是: ${num1}, 和 ${num2}。 祝你早日退休！`;
    const request = {
      input: { text: textToRead },
      voice: { languageCode: 'cmn-CN', name: 'cmn-CN-Wavenet-B' }, // Enthusiastic male voice
      audioConfig: { audioEncoding: 'MP3', speakingRate: 1.15, pitch: 2.0 },
    };
    const [ttsResponse] = await ttsClient.synthesizeSpeech(request);
    audioPath = path.join(__dirname, 'assets', 'voiceover.mp3');
    fs.writeFileSync(audioPath, ttsResponse.audioContent, 'binary');
    console.log("✅ AI Voiceover Generated!");
  } catch (err) {
    console.error("TTS failed:", err.message);
  }

  // 4. Render Video via FFmpeg
  const outputPath = path.join(outDir, 'daily-lucky-numbers.mp4');
  const fontFile = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc";
  
  // Conditionally add audio input if TTS succeeded
  const audioInput = audioPath ? `-i "${audioPath}"` : '';
  const audioMap = audioPath ? `-c:a aac -b:a 192k` : '';
  
  // Comedy timing: Fade in the headline first, then the joke, then wait before revealing the numbers
  const ffmpegCommand = `ffmpeg -y -loop 1 -i "${bgPath}" ${audioInput} -t 12 -vf "scale=1080:1920, zoompan=z='min(zoom+0.0015,1.5)':d=300:x='iw/2-(iw/zoom)/2':y='ih/2-(ih/zoom)/2', drawtext=fontfile='${fontFile}':text='${aiData.headline}':fontcolor=0xffffff:fontsize=95:x=(w-text_w)/2:y=200:box=1:boxcolor=black@0.7:boxborderw=20, drawtext=fontfile='${fontFile}':text='${aiData.jokeText}':fontcolor=0xffff00:fontsize=48:x=(w-text_w)/2:y=350:box=1:boxcolor=black@0.7:boxborderw=20:alpha='if(lt(t,1),0,if(lt(t,2),t-1,1))', drawtext=fontfile='${fontFile}':text='今日最热吉数':fontcolor=0x00ffff:fontsize=75:x=(w-text_w)/2:y=750:box=1:boxcolor=black@0.6:boxborderw=20:alpha='if(lt(t,3),0,if(lt(t,4),t-3,1))', drawtext=fontfile='${fontFile}':text='${num1}   |   ${num2}':fontcolor=0xffd700:fontsize=180:x=(w-text_w)/2:y=900:box=1:boxcolor=red@0.8:boxborderw=40:alpha='if(lt(t,4),0,if(lt(t,5),t-4,1))', drawtext=fontfile='${fontFile}':text='立刻前往获取专属AI字':fontcolor=white:fontsize=55:x=(w-text_w)/2:y=1400:box=1:boxcolor=black@0.6:boxborderw=15, drawtext=fontfile='${fontFile}':text='neo4d.live/analysis':fontcolor=0x00ffff:fontsize=65:x=(w-text_w)/2:y=1500:box=1:boxcolor=black@0.6:boxborderw=15" -c:v libx264 -preset ultrafast -pix_fmt yuv420p ${audioMap} "${outputPath}"`;

  try {
    console.log("Rendering MP4 via FFmpeg...");
    execSync(ffmpegCommand, { stdio: 'inherit' });
    return { videoPath: outputPath, description: aiData.caption };
  } catch (error) {
    console.error("❌ FFmpeg Video Generation Failed:", error.message);
    return null;
  }
}

if (process.argv[1] === __filename) {
  generateDailyVideo();
}
