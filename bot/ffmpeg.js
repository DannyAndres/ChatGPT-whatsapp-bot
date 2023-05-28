const ffmpeg = require('fluent-ffmpeg');

function Ffmpeg() {
  this.convertToMp3 = async (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  };

  this.splitVideo = async (inputPath, outputPath, { frames }) => {
    if (frames) {
      return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .screenshots({
            count: frames,
            folder: outputPath,
          })
          .on('end', () => resolve())
          .on('error', (err) => reject(err));
      });
    }

    return null;
  };
}

module.exports = { Ffmpeg };
