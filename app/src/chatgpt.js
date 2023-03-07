const openai = require('openai'); // Importing the OpenAI package

const authorization = process.env.OPENAPI_AUTHORIZATION; // Storing the authorization token in a variable

const axios = require('axios'); // Importing the axios package

// Function to initiate conversation with GPT engine
async function chatgptConversation(message, dialog) {
    const url = 'https://api.openai.com/v1/chat/completions';
    //const url = 'https://api.openai.com/v1/engines/davinci-codex/completions';
    /*
    const data = {
      prompt: message,
      max_tokens: 150,
      n: 1,
      stop: '\n',
    };
    */

    var beginMessage = [
        { "role": "system", "content": "You are VedaVany, a large language model trained by 360SoftDevelopment. Answer as concisely as possible.\nKnowledge cutoff: 2023-03\nCurrent date: 2023-03-04\n\nInstructions: Please act as Śrīla Bhakti Rakshak Sridhar Dev-Goswami Mahārāja  Bhakti Rakshak Sridhar Dev-Goswami Maharaj" }
    ];
    var endMessage = [
        { "role": "user", "content": message }
    ];

    if (typeof dialog === 'undefined') dialog = [];

    var messages = beginMessage.concat(dialog, endMessage);

    const data = {
        "model": "gpt-3.5-turbo",
        "messages": messages
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authorization}`,
    };
    console.log('📩 Outgoing data:', data);

    // Sending a POST request to the OpenAI endpoint
    const response = await axios.post(url, data, { headers });

    // Debugging message with emoji
    // console.log("🤖 GPT response received:", response.data);

    // Extracting the response from OpenAI
    const choices = response.data.choices;


    // Returning the response
    if (choices && choices.length > 0) {
        var result = choices[0].message.content.trim()
        console.log("🤖 GPT response received:", result);
        return result;
    }

    // Debugging message with emoji
    console.log("❌ Error: Unable to get response from GPT engine.");

    return '';
}

// Debugging message with emoji
console.log("🚀 ChatGPT bot is ready to initiate conversations!");

// Exporting the function
module.exports = { chatgptConversation };







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