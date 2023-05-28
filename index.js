const fs = require('fs');
const path = require('path');

const { WhastAppClient, WhastAppConfig } = require('./whatsapp/whatsapp');
const { WhisperAI } = require('./bot/whisperai');
const { HuggingFace } = require('./bot/huggingface');
const { Bot } = require('./bot/bot');

/**
 *
 *  Config Files
 *
 */

const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'config/config.json'), 'utf8')
);

const whatsapp_config = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'config/whatsapp-config.json'), 'utf8')
);

/**
 *
 *  AI
 *
 */

const bot = new Bot({
  OPENAI_API_KEY: config.OPENAI_API_KEY,
  OPENAI_ORGANIZATION: config.OPENAI_ORGANIZATION,
  ELEVENLABS_API_KEY: config.ELEVENLABS_API_KEY,
  ELEVENLABS_CONFIG: config.elevenlabs,
  OPENAI_CONFIG: config.chatgpt,
});

const whisperAI = new WhisperAI({
  OPENAI_API_KEY: config.OPENAI_API_KEY,
});

const huggingFace = new HuggingFace({
  HUGGINGFACE_API_KEY: config.HUGGINGFACE_API_KEY,
  OPENAI_API_KEY: config.OPENAI_API_KEY,
});

/**
 *
 *  WhatsApp Client
 *
 */

const whastAppConfig = new WhastAppConfig({
  allowedChats: whatsapp_config.allowedChats,
  allowedGroups: whatsapp_config.allowedGroups,
  phone: whatsapp_config.phone,
});

// runs on every message recieved
const onMessage = async (message) => {
  if (whastAppConfig.isAllowed(message)) {
    // conditions on groups or chats
    const group =
      whastAppConfig.isGroup(message) && whastAppConfig.gotMentioned(message);
    const chat = !whastAppConfig.isGroup(message);
    if (group || chat) {
      /**
       * Get Message Body
       */
      let message_body = '';
      const isAudio = await whastAppConfig.isAudio(message);
      const isPhoto = await whastAppConfig.isPhoto(message);
      const isVideo = await whastAppConfig.isVideo(message);

      if (isAudio) {
        const base64ogg_data = await whastAppConfig.getAudio(message);
        message_body = await whisperAI.speechToText(base64ogg_data);
      } else if (isPhoto) {
        const base64jpeg_data = await whastAppConfig.getPhoto(message);
        message_body = await huggingFace.imageToText(base64jpeg_data);
        if (message_body) {
          message_body = `[imagine that the next text is a description of an image, answer like a friend of mine who just recieved this image from me, react to it in a short message] ${message_body}${
            message.body ? ' ----- ' : ''
          }${message.body ? message.body : ''}`;
        }
      } else if (isVideo) {
        const base64mp4_data = await whastAppConfig.getVideo(message);
        message_body = await huggingFace.videoToText(base64mp4_data);
        if (message_body) {
          message_body = `[imagine that the next text is a description of a video where the number is the order and the text right besides is a description on that point in time for the video, the line after audio is a description of the sound or what was said in the video, answer like a friend of mine who just recieved this video from me, react to it in a short message] ${message_body}${
            message.body ? ' ----- ' : ''
          }${message.body ? message.body : ''}`;
        }
      } else {
        message_body = whastAppConfig.getMessage(message, {
          isGroup: group,
          phone: whatsapp_config.phone,
        });
      }
      /**
       * Message Body
       */
      if (message_body) {
        const response = await bot.reply(message_body, {
          audio: isAudio,
          from: message.from,
          memory: config.config.memory,
        });

        if (response) {
          whastAppConfig.replyMessage(message, {
            response: response.response,
            isGroup: group,
            isAudio: isAudio,
            isPhoto: isPhoto,
            isVideo: isVideo,
            audioPath: path.join(__dirname, 'bot/audio/answer.mp3'),
          });
        }
      }
    }
  }
};

new WhastAppClient({
  onMessage,
});
