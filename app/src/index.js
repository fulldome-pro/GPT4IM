const { Telegraf, Markup } = require('telegraf');
const { Keyboard } = require('telegram-keyboard')
const LocalSession = require('telegraf-session-local')

const dotenv = require('dotenv');
dotenv.config();

const { chatgptConversation } = require('./chatgpt.js');

// Load environment variables
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
if (!telegramBotToken) {
  throw new Error('TELEGRAM_BOT_TOKEN not found');
}

// Create a new Telegraf instance using the API token provided by BotFather
const bot = new Telegraf(telegramBotToken);

// Set up local session middleware to store user data
const sessionPath = './sessions/session.json';
const session = new LocalSession();
bot.use((new LocalSession({ database: sessionPath })).middleware())

// Enable command menu
const commands = [
  { command: 'start', description: 'Start the bot' },
  { command: 'newchat', description: 'Startnew chat' },  
  //{ command: 'chats', description: 'Show chats list' },
  //{ command: 'prompts', description: 'Chose special prompt' },  
  //{ command: 'useinternet_once', description: 'Use internet once for next mesage' },  
  //{ command: 'useinternet_always', description: 'Use internet always for this chat' },  
  //{ command: 'useinternet_never', description: 'Useinternet never for this chat' },  
  //{ command: 'help', description: 'Get help' },
];
bot.telegram.setMyCommands(commands);

async function newChat(ctx)
{
  await ctx.reply('👉👨‍💻💬 Just type something.');

  // Clear user session data
  ctx.session = null;
  ctx.session.dialog = JSON.stringify([]);
}

// Start command
bot.start(async (ctx) => {
  await ctx.reply('👋 Welcome to VedaVany.');
  await newChat(ctx);
});



bot.command('newchat', async (ctx) => {
  await newChat(ctx);
});


// Listen for incoming text messages
bot.on('text', async (ctx) => {
  try {
    var message = ctx.message.text;
    var dialog = JSON.parse(ctx.session.dialog);
    console.log('📩 Incoming message:', message);
    console.log('🤖 Dialog:', dialog);
    // Send the "typing" action to the chat
    await ctx.replyWithChatAction('typing');

    // Call the chatGPT API to generate a response
    const response = await chatgptConversation(message, dialog);
    console.log('🤖 Response:', response);

    var qa = [
      { "role": "user", "content": message },
      { "role": "assistant", "content": response }
    ];
    console.log('🤖 qa:', qa);

    dialog=dialog.concat(qa);

    console.log('🤖 dialog:', dialog);
    ctx.session.dialog=JSON.stringify(dialog);

    // Send the response back to the user
    await ctx.reply(response);

  } catch (err) {
    // Handle errors gracefully
    console.error('❌ Error:', err);
    await ctx.reply('Oops! Something went wrong. Please try again later.');
  }
});

// Start polling for incoming messages
bot.launch();
console.log('🚀 VadaVany bot is running');