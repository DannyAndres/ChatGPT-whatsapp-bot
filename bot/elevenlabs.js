const axios = require('axios');
const path = require('path');
const fs = require('fs');
const emojiRegex = require('emoji-regex');
const regex = emojiRegex();
const fsPromises = require('fs').promises;
const { Ffmpeg } = require('./ffmpeg');

const ffmpeg = new Ffmpeg();

function ElevenLabs({ ELEVENLABS_API_KEY, ELEVENLABS_CONFIG }) {
  this.textToSpeech = async (message) => {
    const text = message.replace(regex, '');
    try {
      const response = await axios({
        method: 'post',
        url: `https://api.elevenlabs.io/v1/text-to-speech/${
          ELEVENLABS_CONFIG.id ? ELEVENLABS_CONFIG.id : 'EXAVITQu4vr4xnSDxMaL'
        }`,
        responseType: 'arraybuffer',
        headers: {
          'Content-type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
          accept: 'audio/mpeg',
        },
        data: {
          text: text,
          model_id: 'eleven_multilingual_v1',
          voice_settings: {
            stability: ELEVENLABS_CONFIG.stability
              ? ELEVENLABS_CONFIG.stability
              : 0.45,
            similarity_boost: ELEVENLABS_CONFIG.similarity_boost
              ? ELEVENLABS_CONFIG.similarity_boost
              : 0.7,
          },
        },
      });

      const savedAnswerPath = path.join(__dirname, 'audio/answer.mpeg');
      const savedAnswerPathMP3 = path.join(__dirname, 'audio/answer.mp3');

      try {
        await fsPromises.stat(savedAnswerPath);
        await fsPromises.unlink(savedAnswerPath);
        console.log('[elevenlabs] Temp response file deleted successfully.');
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log('[elevenlabs] Temp response file does not exist.');
        } else {
          console.log(
            '[elevenlabs] Error deleting temp response file - cannot continue.'
          );
          return null;
        }
      }

      try {
        await fsPromises.stat(savedAnswerPathMP3);
        await fsPromises.unlink(savedAnswerPathMP3);
        console.log('[elevenlabs] Converted file deleted successfully.');
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log('[elevenlabs] Converted file does not exist.');
        } else {
          console.log(
            '[elevenlabs] Error deleting converted file - cannot continue.'
          );
          return null;
        }
      }

      await fs.writeFileSync(savedAnswerPath, response.data, 'binary');

      await ffmpeg.convertToMp3(savedAnswerPath, savedAnswerPathMP3);

      try {
        await fsPromises.stat(savedAnswerPath);
        await fsPromises.unlink(savedAnswerPath);
        console.log('[elevenlabs] Temp response file deleted successfully.');
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log('[elevenlabs] Temp response file does not exist.');
        }
      }

      return 'ok';
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}

module.exports = { ElevenLabs };
