const openai = require('openai');

const authorization = process.env.OPENAPI_AUTHORIZATION;

const axios = require('axios');

async function chatgptConversation(message) {
  const url = 'https://api.openai.com/v1/engines/davinci-codex/completions';
  const data = {
    prompt: message,
    max_tokens: 150,
    n: 1,
    stop: '\n',
  };
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authorization}`,
  };
  const response = await axios.post(url, data, { headers });
  const { choices } = response.data;
  if (choices && choices.length > 0) {
    return choices[0].text.trim();
  }
  return '';
}


/*
const client = openai.Auth({ api_key: authorization });


async function chatgptConversation(message) {
    const prompt = `User: ${message}\nAI:`;
    const completions = await client.completions.create({
      engine: 'text-davinci-002',
      prompt: prompt,
      max_tokens: 150,
      n: 1,
      stop: '\n',
    });
    const response = completions.choices[0].text.trim();
    return response;
}
*/
module.exports = {
    chatgptConversation
  };