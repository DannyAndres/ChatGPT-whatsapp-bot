const axios = require('axios');

function ChatGPT({ OPENAI_API_KEY, OPENAI_ORGANIZATION, OPENAI_CONFIG }) {
  this.open_ai_request = async (text, { log, noPersonality }) => {
    try {
      let input = [];
      if (log) {
        input = log;
      }
      if (OPENAI_CONFIG.personality && !noPersonality) {
        input.unshift({
          role: 'system',
          content: OPENAI_CONFIG.personality,
        });
      }
      input.push({
        role: 'user',
        content: text,
      });

      const response = await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + OPENAI_API_KEY,
          'OpenAI-Organization': OPENAI_ORGANIZATION,
        },
        data: {
          frequency_penalty: 1,
          presence_penalty: 1,
          top_p: 1,
          model: 'gpt-3.5-turbo',
          messages: input,
          temperature: 1,
          max_tokens: OPENAI_CONFIG.max_tokens ? OPENAI_CONFIG.max_tokens : 100,
        },
      });
      let res = '';
      res = response.data.choices[0].message.content;
      res = res.replace(/\\n/g, '');
      res = res.replace(/\\/g, '');
      res = res.replace(/!/g, '');

      return {
        response: res,
        tokens: response.data.usage.total_tokens,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}

module.exports = { ChatGPT };
