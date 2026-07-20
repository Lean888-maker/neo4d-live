import express from 'express';
import { Storage } from '@google-cloud/storage';
import { generateDailyVideo } from './video_generator.js';
import { uploadToYouTube } from './youtube_uploader.js';
import fs from 'fs';
import path from 'path';

const app = express();
const storage = new Storage();
const bucketName = 'neo4d-seo-assets-prod'; // Our new GCS bucket

app.get('/trigger-video', async (req, res) => {
  try {
    console.log("Triggered video generation from Cloud Run...");
    const result = await generateDailyVideo();
    
    if (!result || !result.videoPath) {
      return res.status(500).send("Video generation failed.");
    }
    
    console.log("Uploading to Cloud Storage...");
    const fileName = path.basename(result.videoPath);
    const destination = `viral-videos/${Date.now()}-${fileName}`;
    
    await storage.bucket(bucketName).upload(result.videoPath, {
      destination: destination,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${destination}`;
    console.log(`Successfully uploaded to: ${publicUrl}`);
    
    // Upload to YouTube Shorts via native YouTube Data API v3
    let youtubeResult = null;
    try {
      youtubeResult = await uploadToYouTube(publicUrl, result.description);
    } catch (ytErr) {
      console.error("YouTube upload encountered an error, but video was generated:", ytErr.message);
    }
    
    res.status(200).json({
      success: true,
      message: "Video generated and uploaded successfully!",
      publicUrl: publicUrl,
      caption: result.description,
      youtube: youtubeResult
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Video Farm listening on port ${port}`);
});
