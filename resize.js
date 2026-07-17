const sharp = require('sharp');
const fs = require('fs');

const inputPath = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\f935ec5e-a221-4222-9198-42e5e23fa800\\telegram_mini_app_cover_1784270032087.png';
const outputPath = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\f935ec5e-a221-4222-9198-42e5e23fa800\\telegram_cover_640x360.png';

async function resizeImage() {
  try {
    await sharp(inputPath)
      .resize(640, 360, {
        fit: 'cover',
        position: 'center'
      })
      .toFile(outputPath);
    console.log("Success! Image resized to 640x360.");
  } catch (error) {
    console.error("Error resizing:", error.message);
  }
}

resizeImage();
