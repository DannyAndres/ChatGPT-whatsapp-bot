const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

function WhastAppClient({ onQr, onAuthenticated, onReady, onMessage }) {
  this.client = new Client({
    authStrategy: new LocalAuth(),
  });

  console.log('[whatsapp-web.js] Client is initializing!');
  this.client.initialize();

  this.client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
  });

  this.client.on('authenticated', () => {
    console.log('[whatsapp-web.js] AUTHENTICATED');
  });

  this.client.on('ready', () => {
    console.log('[whatsapp-web.js] Client is ready!');
  });

  this.client.on('message', onMessage);
}

function WhastAppConfig({ allowedChats, allowedGroups, phone }) {
  this.isAllowed = (message) => {
    const atSplit = message.from.split('@');
    const id = atSplit.length != 0 ? atSplit[0] : null;

    if (id) {
      const dashSplit = id.split('-');
      switch (dashSplit.length) {
        case 1: // just one element means a one to one chat
          return allowedChats.find((e) => e == dashSplit[0]);
        case 2: // just two elements means a group chat - "senderID-groupID"
          return allowedGroups.find((e) => e == dashSplit[1]);
        default:
          return false;
      }
    }

    return false;
  };

  this.isGroup = (message) => {
    const atSplit = message.from.split('@');
    const id = atSplit.length != 0 ? atSplit[0] : null;

    if (id) {
      const dashSplit = id.split('-');
      return dashSplit.length === 2;
    }

    return false;
  };

  this.gotMentioned = (message) => {
    return message.body.includes(`@${phone}`);
  };

  this.isAudio = async (message) => {
    /**
     * Types
     * 'audio/ogg; codecs=opus': // audio voice file
     * 'image/jpeg': // photo or image
     * 'image/webp': // sticker
     * 'video/mp4': // video or gif
     */
    if (message.hasMedia) {
      const messageMedia = await message.downloadMedia();
      return messageMedia && messageMedia.mimetype === 'audio/ogg; codecs=opus';
    }
    return false;
  };

  this.isPhoto = async (message) => {
    /**
     * Types
     * 'audio/ogg; codecs=opus': // audio voice file
     * 'image/jpeg': // photo or image
     * 'image/webp': // sticker
     * 'video/mp4': // video or gif
     */
    if (message.hasMedia) {
      const messageMedia = await message.downloadMedia();
      return messageMedia && messageMedia.mimetype === 'image/jpeg';
    }
    return false;
  };

  this.isVideo = async (message) => {
    /**
     * Types
     * 'audio/ogg; codecs=opus': // audio voice file
     * 'image/jpeg': // photo or image
     * 'image/webp': // sticker
     * 'video/mp4': // video or gif
     */
    if (message.hasMedia) {
      const messageMedia = await message.downloadMedia();
      return messageMedia && messageMedia.mimetype === 'video/mp4';
    }
    return false;
  };

  this.getAudio = async (message) => {
    /**
     * Types
     * 'audio/ogg; codecs=opus': // audio voice file
     * 'image/jpeg': // photo or image
     * 'image/webp': // sticker
     * 'video/mp4': // video or gif
     */
    if (message.hasMedia) {
      const messageMedia = await message.downloadMedia();
      if (messageMedia.mimetype === 'audio/ogg; codecs=opus') {
        return messageMedia.data;
      }
    }
    return null;
  };

  this.getPhoto = async (message) => {
    /**
     * Types
     * 'audio/ogg; codecs=opus': // audio voice file
     * 'image/jpeg': // photo or image
     * 'image/webp': // sticker
     * 'video/mp4': // video or gif
     */
    if (message.hasMedia) {
      const messageMedia = await message.downloadMedia();
      if (messageMedia.mimetype === 'image/jpeg') {
        return messageMedia.data;
      }
    }
    return null;
  };

  this.getVideo = async (message) => {
    /**
     * Types
     * 'audio/ogg; codecs=opus': // audio voice file
     * 'image/jpeg': // photo or image
     * 'image/webp': // sticker
     * 'video/mp4': // video or gif
     */
    if (message.hasMedia) {
      const messageMedia = await message.downloadMedia();
      if (messageMedia.mimetype === 'video/mp4') {
        return messageMedia.data;
      }
    }
    return null;
  };

  this.getMessage = (message, { isGroup, phone }) => {
    if (isGroup) {
      return message.body.replace(`@${phone}`, '');
    }
    return message.body;
  };

  this.replyMessage = async (
    message,
    { isGroup, response, isAudio, isVideo, isPhoto, audioPath }
  ) => {
    if (isGroup) {
      message.reply(response.trim());
    } else {
      const chat = await message.getChat();
      if (isAudio) {
        const media = MessageMedia.fromFilePath(audioPath);
        await chat.sendMessage(media, { sendAudioAsVoice: true });
      } else if (isPhoto) {
        message.reply(response.trim());
      } else if (isVideo) {
        message.reply(response.trim());
      } else {
        await chat.sendMessage(response.trim());
      }
    }
  };
}

module.exports = { WhastAppClient, WhastAppConfig };
