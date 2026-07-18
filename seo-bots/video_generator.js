import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Automatically generates a 10-second Facebook Reel / TikTok style video.
 * Uses FFmpeg to generate an animated video using raw text filters (no external heavy libraries required).
 */
export async function generateDailyVideo() {
  console.log("🎬 Starting Facebook Video Generation...");
  const outDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outputPath = path.join(outDir, 'daily-lucky-numbers.mp4');
  const today = new Date().toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  // Random lucky numbers for prediction
  const num1 = Math.floor(1000 + Math.random() * 9000);
  const num2 = Math.floor(1000 + Math.random() * 9000);

  console.log(`Generating video with Lucky Numbers: ${num1} and ${num2}`);

  // FFmpeg command to generate a 1080x1920 (Reels format) video entirely from scratch
  // 1. Solid dark red background (#7f1d1d)
  // 2. Draw text for Title, Date, and Numbers
  // 3. 10 second duration
  const ffmpegCommand = `ffmpeg -y -f lavfi -i color=c=0x7f1d1d:s=1080x1920:d=10 -vf "drawtext=text='NEO4D LIVE':fontcolor=white:fontsize=80:x=(w-text_w)/2:y=200, drawtext=text='LUCKY PREDICTIONS':fontcolor=0xf59e0b:fontsize=100:x=(w-text_w)/2:y=320, drawtext=text='${today}':fontcolor=white:fontsize=50:x=(w-text_w)/2:y=450, drawtext=text='${num1}   |   ${num2}':fontcolor=0xf59e0b:fontsize=150:x=(w-text_w)/2:y=800, drawtext=text='Check full results at neo4d.live':fontcolor=white:fontsize=60:x=(w-text_w)/2:y=1500" -c:v libx264 -preset ultrafast -pix_fmt yuv420p "${outputPath}"`;

  try {
    console.log("Rendering MP4 via FFmpeg...");
    execSync(ffmpegCommand, { stdio: 'inherit' });
    console.log(`✅ Video generated successfully at: ${outputPath}`);
    
    return {
      videoPath: outputPath,
      description: `🧧💰 今日最强心水字 ${today} 来了！ \n\n我们的首选号码：${num1} & ${num2}！\n\n您今天有买字吗？立刻前往 https://neo4d.live 查看最快开奖成绩 🏆\n\n#万能4D #大马彩 #多多 #4DResultMalaysia #今日4D`
    };
  } catch (error) {
    console.error("❌ FFmpeg Video Generation Failed:", error.message);
    return null;
  }
}

// Allow direct execution
if (process.argv[1] === __filename) {
  generateDailyVideo();
}
