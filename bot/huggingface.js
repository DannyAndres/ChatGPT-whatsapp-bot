const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { HfInference } = require('@huggingface/inference');
const { Ffmpeg } = require('./ffmpeg');
const { WhisperAI } = require('./whisperai');

const ffmpeg = new Ffmpeg();

function HuggingFace({ HUGGINGFACE_API_KEY, OPENAI_API_KEY }) {
  const hf = new HfInference(HUGGINGFACE_API_KEY);

  const whisperAI = new WhisperAI({
    OPENAI_API_KEY: OPENAI_API_KEY,
  });

  this.imageToText = async (data64) => {
    const binaryData = Buffer.from(data64, 'base64'); // 64 to binary
    await fs.writeFileSync(
      path.join(__dirname, 'images/image.jpeg'),
      binaryData,
      'binary'
    );
    const blobData = new Blob([binaryData], {
      type: 'application/octet-stream',
    });
    const imgDesc = await hf.imageToText({
      data: blobData,
      model: 'nlpconnect/vit-gpt2-image-captioning',
    });
    if (imgDesc) {
      return imgDesc.generated_text;
    }
    return null;
  };

  this.videoToText = async (data64) => {
    const frames = 10;
    const binaryData = Buffer.from(data64, 'base64'); // 64 to binary
    const videoPath = path.join(__dirname, 'videos/video.mp4');
    const videoFramesPath = path.join(__dirname, 'videos/frames');
    await fs.writeFileSync(videoPath, binaryData, 'binary');
    await ffmpeg.splitVideo(videoPath, videoFramesPath, {
      frames,
    });
    let output = [];
    for (let i = 1; i <= frames; i++) {
      try {
        const data = await fsPromises.readFile(
          `${videoFramesPath}/tn_${i}.png`
        );
        const base64Data = Buffer.from(data).toString('base64');
        const frameToText = await this.imageToText(base64Data);
        output.push(frameToText);
      } catch (err) {
        console.error('Error reading file:', err);
        throw err;
      }
      try {
        await fsPromises.stat(`${videoFramesPath}/tn_${i}.png`);
        await fsPromises.unlink(`${videoFramesPath}/tn_${i}.png`);
        console.log(`[huggingface] Temp image ${i} file deleted successfully.`);
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log('[huggingface] Temp image file does not exist.');
        }
      }
    }
    console.log(output);
    let outputString = '';

    output.forEach((e, i) => {
      outputString += `[${i + 1}](${e});`;
    });

    const videoAudio = await whisperAI.speechToText(data64);
    console.log([videoAudio]);
    outputString += `[audio](${videoAudio});`;

    return outputString;
  };
}

module.exports = { HuggingFace };
