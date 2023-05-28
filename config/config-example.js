/**
 * Add example_config to a json file called "config.json"
 */

const example_config = {
  OPENAI_API_KEY: 'XXXX',
  OPENAI_ORGANIZATION: 'XXXX',
  ELEVENLABS_API_KEY: 'XXXX',
  HUGGINGFACE_API_KEY: 'XXXX',
  chatgpt: {
    max_tokens: 300, // Number - chatgpt max_tokens in openai request
    personality: 'fake that you are a woman called thalia.',
    // String - will be added to the context
  },
  elevenlabs: {
    id: 'XXXXX', // String - id of the voice that the bot will have (get it from elevenlabs website)
    stability: 0.25,
    // Number - Range<0-1>
    // values closer to 0, the voice will make more human like mistakes or things like "mmmmm" "ahhh"
    // values closer to 1, the voice will make less mistakes similar to a home assistance type of voice
    similarity_boost: 0.7,
    // Number - Range<0-1>
    // values closer to 0, recommended if the voice has background noice after training, it will fill most of the voice with pre trained similar voices
    // values closer to 1, recommended to voices trained without background noice or artifacts, also with pre trained voices
  },
  config: {
    name: 'thalia',
    memory: 10,
    // Number - the bot will build a history of the conversation (question-answer)
    // this number makes reference on how many messages previous to the current one will be handed to openai's chatgpt to have more context
  },
};
