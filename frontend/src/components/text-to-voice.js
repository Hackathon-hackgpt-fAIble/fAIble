const https = require('https');
const fs = require('fs');
require('dotenv').config();

const options = {
  hostname: 'api.elevenlabs.io',
  path: '/v1/text-to-speech/'+process.env.voice_id,
  method: 'POST',
  headers: {
    'accept': 'audio/mpeg',
    'xi-api-key': process.env.api_key,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);

  const audioFile = fs.createWriteStream('audio.mp3');
  res.pipe(audioFile);
});

req.on('error', (error) => {
  console.error(error);
});

req.write(JSON.stringify({
  text: 'Hello this is a great day. London is amazing, I want to go to new york, I will be rich.',
  voice_settings: {
    stability: 0.5,
    similarity_boost: 0.5
  }
}));

req.end();
