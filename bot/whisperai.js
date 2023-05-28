const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const { Configuration, OpenAIApi } = require('openai');
const { Ffmpeg } = require('./ffmpeg');

const ffmpeg = new Ffmpeg();

function WhisperAI({ OPENAI_API_KEY }) {
  this.speechToText = async (data64) => {
    const binaryData = Buffer.from(data64, 'base64'); // 64 to binary
    /**
     * Delete temp files if they exist
     */
    const savedAudioPath = path.join(__dirname, 'audio/temp.ogg');
    const savedAudioPathMP3 = path.join(__dirname, 'audio/temp.mp3');
    try {
      await fsPromises.stat(savedAudioPath);
      await fsPromises.unlink(savedAudioPath);
      console.log('[whisper-ai] Temp file deleted successfully.');
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('[whisper-ai] File does not exist.');
      } else {
        console.log('[whisper-ai] Error deleting file - cannot continue.');
        return null;
      }
    }

    // store temp ogg file
    await fs.writeFileSync(savedAudioPath, binaryData, 'binary');

    try {
      await ffmpeg.convertToMp3(savedAudioPath, savedAudioPathMP3);
      console.log(
        '[whisper-ai] Conversion from ogg to mp3 completed successfully.'
      );
    } catch (error) {
      console.log('[whisper-ai] Error occurred during conversion.');
    }

    const configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const transcript = await openai.createTranscription(
      fs.createReadStream(savedAudioPathMP3),
      'whisper-1'
    );

    try {
      await fsPromises.stat(savedAudioPath);
      await fsPromises.unlink(savedAudioPath);
      console.log('[whisper-ai] Temp file deleted successfully.');
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('[whisper-ai] File does not exist.');
      }
    }

    try {
      await fsPromises.stat(savedAudioPathMP3);
      await fsPromises.unlink(savedAudioPathMP3);
      console.log('[whisper-ai] Converted file deleted successfully.');
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('[whisper-ai] Converted file does not exist.');
      }
    }

    return transcript.data.text;
  };
}

module.exports = { WhisperAI };
