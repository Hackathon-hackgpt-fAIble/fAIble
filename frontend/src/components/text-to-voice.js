const https = require('https');
const fs = require('fs');
require('dotenv').config();

const generateVoiceFile = (text) => {
  const options = {
    hostname: 'api.elevenlabs.io',
    path: '/v1/text-to-speech/' + process.env.REACT_APP_VOICE_ID,
    method: 'POST',
    headers: {
      'accept': 'audio/mpeg',
      'xi-api-key': process.env.REACT_APP_API_KEY,
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
    text,
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5
    }
  }));

  req.end();
};

module.exports = generateVoiceFile;