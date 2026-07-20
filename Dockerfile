FROM node:20-slim

# Install FFmpeg and Chinese fonts for video rendering
RUN apt-get update && apt-get install -y ffmpeg fonts-noto-cjk && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . ./

# Run the Cloud Run server
CMD [ "node", "seo-bots/server.js" ]
