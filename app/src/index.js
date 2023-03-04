const { Telegraf, Markup } = require('telegraf');
const { Keyboard } = require('telegram-keyboard')
const LocalSession = require('telegraf-session-local')

const dotenv = require('dotenv');
dotenv.config();

const { chatgptConversation }  = require('./chatgpt.js');

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
if (!telegramBotToken) {
  throw new Error('TELEGRAM_BOT_TOKEN not found');
}

// Create a new Telegraf instance using the API token provided by BotFather
const bot = new Telegraf(telegramBotToken);

const sessionPath = './sessions/session.json';
const session = new LocalSession();


// Use session middleware to store user data
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


// Listen for incoming text messages
bot.on('text', async (ctx) => {
  try {

    console.log(ctx.message.text);

    // Send the "typing" action to the chat
    await ctx.replyWithChatAction('typing');
    const response = await chatgptConversation(ctx.message.text); 
    console.log(response);

    // Send the response back to the user
    await ctx.reply(response);
  } catch (err) {
    // Handle errors gracefully
    console.error(err);
    await ctx.reply('Oops! Something went wrong. Please try again later.');
  }
});

// Start polling for incoming messages
bot.launch();
console.log('🚀 Bot running');



