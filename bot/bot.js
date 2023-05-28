const { ChatGPT } = require('./chatgpt');
// const { addStorageKey, printStorage, getLogFrom } = require('./storage');
const { ElevenLabs } = require('./elevenlabs');
const { Storage } = require('./storage');

const storage = new Storage();

function Bot({
  OPENAI_API_KEY,
  OPENAI_ORGANIZATION,
  ELEVENLABS_API_KEY,
  ELEVENLABS_CONFIG,
  OPENAI_CONFIG,
}) {
  const chatGPT = new ChatGPT({
    OPENAI_API_KEY,
    OPENAI_ORGANIZATION,
    OPENAI_CONFIG,
  });
  const elevenLabs = new ElevenLabs({
    ELEVENLABS_API_KEY,
    ELEVENLABS_CONFIG,
  });
  const new_elevenlabs_config = {
    similarity_boost: ELEVENLABS_CONFIG.similarity_boost,
    id: ELEVENLABS_CONFIG.translate_id,
    stability: ELEVENLABS_CONFIG.translate_stability,
  };
  const elevenLabs_translation = new ElevenLabs({
    ELEVENLABS_API_KEY,
    ELEVENLABS_CONFIG: new_elevenlabs_config,
  });

  this.isTranlation = async (text) => {
    const log = [
      {
        role: 'user', // example NO spanish
        content: `does this text ask to be translated with another voice or not? answer only with yes or no. "traduce esto a ingles, hey como estas?"`,
      },
      {
        role: 'assistant',
        content: `No.`,
      },
      {
        role: 'user', // example YES spanish
        content: `does this text ask to be translated with another voice or not? answer only with yes or no. "traduce esto con mi voz a ingles, hey como estas?"`,
      },
      {
        role: 'assistant',
        content: `Yes.`,
      },
      {
        role: 'user', // example NO english
        content: `does this text ask to be translated with another voice or not? answer only with yes or no. "hey, whats up? translate that to english"`,
      },
      {
        role: 'assistant',
        content: `No.`,
      },
      {
        role: 'user', // example YES english
        content: `does this text ask to be translated with another voice or not? answer only with yes or no. "hey, whats up? translate that to english with my voice"`,
      },
      {
        role: 'assistant',
        content: `Yes.`,
      },
    ];
    const question = `does this text ask to be translated with another voice or not? answer only with yes or no. "${text}"`;
    const response = await chatGPT.open_ai_request(question, {
      log,
      noPersonality: true,
    });
    return response.response == 'Yes.';
  };

  this.reply = async (message, { audio, from, memory }) => {
    let tries = 0;
    let response = null;
    console.log('[bot] New reply loading');
    while (response == null && tries <= 5) {
      console.log('[bot] Trying chatgpt');
      const from_log = storage.getLog(from, memory);
      response = await chatGPT.open_ai_request(message, {
        log: from_log,
      });
      tries += 1;
    }
    if (response) {
      storage.addElement({
        from,
        tokens: response.tokens,
        message,
        response: response.response.trim(),
      });
      if (audio) {
        const isTranlation = await this.isTranlation(message);
        if (isTranlation) {
          await elevenLabs_translation.textToSpeech(response.response.trim());
        } else {
          await elevenLabs.textToSpeech(response.response.trim());
        }
      }
    }
    return response;
  };
}

module.exports = { Bot };
