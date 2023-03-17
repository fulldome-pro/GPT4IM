const OpenAI = require('openai-api');
const stream = require('stream');


const EventSource = require('eventsource');
//const fetch = require('node-fetch');
//const fetch = require('@microsoft/fetch-event-source');


const authorization = process.env.OPENAPI_AUTHORIZATION; // Storing the authorization token in a variable

const MODEL = "gpt-3.5-turbo"; //"model": "gpt-4-32k",

const axios = require('axios'); // Importing the axios package

// Function to initiate conversation with GPT engine
//https://github.com/openai/openai-node/issues/18#issuecomment-1369996933




async function chatgptConversationMessagesFetch2(messages, onText) {
    //try {

        const url = `https://api.openai.com/v1/chat/completions`;
        const headers = {
            Authorization: `Bearer ${authorization}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        const data = {
            "model": MODEL,
            "messages": messages,
            stream: true,
        };

        const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });

        // Create a reader for the response body
        const reader = res.body.getReader();
        // Create a decoder for UTF-8 encoded text
        const decoder = new TextDecoder("utf-8");
        let result = "";
        // Function to read chunks of the response body

        let fullText = ''
        let lastFire = 0

        async function read() {
            const { value, done } = await reader.read();

            if (done) return /*await*/ onText(fullText)

            const delta = decoder.decode(value).match(/"delta":\s*({.*?"content":\s*".*?"})/)?.[1]

            if (delta) {
                const content = JSON.parse(delta).content

                fullText += content

                //Detects punctuation, if yes, fires onText once per .5 sec
                if (/[\p{P}\p{S}]/u.test(content)) {
                    const now = Date.now();

                    if (now - lastFire > 3000) {
                        lastFire = now
                        /*await*/ onText(fullText)
                    }
                }
            }

            await read()

        }

        await read()

        return fullText;
    //} catch (error) {
    //    return "Oops. Error. Sorry";
    //}
}



async function chatgptConversationMessagesApi(messages) {
    const openai = new OpenAI(authorization);

    const data = {
        "model": MODEL,
        "messages": messages,
        stream: true,
    };


    const transformer = new stream.Transform({
        objectMode: true,
        transform: function (chunk, encoding, callback) {
            const text = chunk.text;
            console.log(text);
            callback();
        },
    });


    console.log(openai)
    openai.createCompletion(data).then((response) => {
        response.stream()
            .pipe(transformer)
            .on('error', console.error)
            .on('end', () => console.log('Stream complete.'));
    });


}


async function chatgptConversationMessages(messages) {
    const url = 'https://api.openai.com/v1/chat/completions';
    const data = {
        "model": MODEL,
        "messages": messages
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authorization}`,
    };
    console.log('📩 Outgoing data:', data);

    // Sending a POST request to the OpenAI endpoint
    const response = await axios.post(url, data, { headers });

    // Debugging message with emojiz
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



async function chatgptConversationMessagesNodeFetch(messages) {



    const url = `https://api.openai.com/v1/completions?engine=${encodeURIComponent(MODEL)}&prompt=${encodeURIComponent(PROMPT)}&max_tokens=50&n=1&stream=true`;
    const headers = {
        Authorization: `Bearer ${authorization}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    const fetchData = async () => {
        const response = await fetch(url, { headers });
        const stream = response.body;
        const reader = stream.getReader();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = new TextDecoder('utf-8').decode(value);
            const json = JSON.parse(text);
            const generatedText = json.choices[0].text.trim();
            console.log(generatedText);
        }
    };

    fetchData().catch((error) => {
        console.error(error);
    });
}


async function chatgptConversationMessagesEventSource(messages) {

    const url = 'https://api.openai.com/v1/chat/completions'


    const data = {
        "model": MODEL,
        "messages": messages,
        "stream": true
    };

    const params = `model=${encodeURIComponent(MODEL)}&messages=${encodeURIComponent(JSON.stringify(messages))}&stream=true`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authorization}`,
    };

    console.log('📩 Outgoing data:', data);

    const evtSource = new EventSource(url + "?" + params, {
        withCredentials: true,
        headers: headers,
    });

    evtSource.onmessage = (event) => {
        console.log(message, event.data);
    };

    evtSource.onerror = (err) => {
        console.error("EventSource failed:", err);
    };

    await new Promise((resolve, reject) => {
        evtSource.addEventListener('close', resolve);
        evtSource.addEventListener('error', reject);
    });




    return "OK";
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

async function chatgptConversationMessagesFetch(messages) {

    const url = 'https://api.openai.com/v1/chat/completions';
    const data = {
        "model": "gpt-3.5-turbo",
        "messages": messages,
        "stream": true
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authorization}`,
    };

    console.log('📩 Outgoing data:', data);

    fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
        .then(response => {
            console.log('📨 Incoming response:', response);
            // Respond to the response here
        })
        .catch(error => {
            console.error('Error:', error);
        });


    /*
        
    
        const data = {
            "model": "gpt-3.5-turbo",
            "messages": messages,
            "stream": true
        };
    
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authorization}`,
        };
    
        console.log('📩 Outgoing data:', data);
    
        const evtSource = new EventSource(url, {
            withCredentials: true,
                headers: headers,
        });
    
        evtSource.onmessage = (event) => {
            console.log(message, event.data);
        };
    
        evtSource.onerror = (err) => {
            console.error("EventSource failed:", err);
        };
    
        await new Promise((resolve, reject) => {
            evtSource.addEventListener('close', resolve);
            evtSource.addEventListener('error', reject);
        });
    */
    /*
     const url = 'https://api.openai.com/v1/chat/completions';
 
     const data = {
         "model": "gpt-3.5-turbo",
         "messages": messages,
         "stream": true
     };
 
     const headers = {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${authorization}`,
     };
 
     console.log('📩 Outgoing data:', data);
 
     var evtSource=fetch(url, {
         method: 'POST',
         headers: headers,
         body: JSON.stringify(data)
     });
 
     evtSource.onmessage = (event) => {
         console.log(message, event.data);
     };
 
     evtSource.onerror = (err) => {
         console.error("EventSource failed:", err);
     };
 
     await new Promise((resolve, reject) => {
             evtSource.addEventListener('close', resolve);
             evtSource.addEventListener('error', reject);
     });
 */
    /*
    .then(response => {
        console.log('📨 Incoming response:', response);
        // Respond to the response here
    })
    .catch(error => {
        console.error('Error:', error);
    });
*/



    return "OK";
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

async function chatgptConversation(message, dialog, onText) {

    /*
    var beginMessage = [
        { "role": "system", "content": "You are VedaVany, a large language model trained by 360SoftDevelopment. Answer as concisely as possible.\nKnowledge cutoff: 2023-03\nCurrent date: 2023-03-04\n\nInstructions: Please act as Śrīla Bhakti Rakshak Sridhar Dev-Goswami Mahārāja  Bhakti Rakshak Sridhar Dev-Goswami Maharaj" }
    ];*/

    var beginMessage = [];

    var endMessage = [
        { "role": "user", "content": message }
    ];

    if (typeof dialog === 'undefined') dialog = [];

    var messages = beginMessage.concat(dialog, endMessage);
    return await chatgptConversationMessagesFetch2(messages, onText);
    //return await chatgptConversationMessages(messages);
}

// Debugging message with emoji
console.log("🚀 ChatGPT bot is ready to initiate conversations!");

// Exporting the function
module.exports = {
    chatgptConversation,
    chatgptConversationMessages
};