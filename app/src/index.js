//import { chatgptConversation } from './chatgptConversation';
const { Telegraf, Markup } = require('telegraf');
const { Keyboard } = require('telegram-keyboard')
const LocalSession = require('telegraf-session-local')

const dotenv = require('dotenv');
dotenv.config();

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
if (!telegramBotToken) {
  throw new Error('TELEGRAM_BOT_TOKEN not found');
}

// Create a new Telegraf instance using the API token provided by BotFather
const bot = new Telegraf(telegramBotToken);

// Enable command menu
const commands = [
  { command: 'start', description: 'Start the bot' },
  { command: 'newchat', description: 'Startnew chat' },  
  { command: 'chats', description: 'Show chats list' },
  { command: 'prompts', description: 'Chose special prompt' },  
  { command: 'useinternet_once', description: 'Use internet once for next mesage' },  
  { command: 'useinternet_always', description: 'Use internet always for this chat' },  
  { command: 'useinternet_never', description: 'Useinternet never for this chat' },  
  //{ command: 'help', description: 'Get help' },
];
bot.telegram.setMyCommands(commands);


// Listen for incoming text messages
bot.on('text', async (ctx) => {
  try {
    // Send the user's message to the GPT-3 chat API
    const cookies = process.env.API_CHATGTP_COOKIES;
    const authorization = process.env.API_CHATGTP_AUTHORIZATION;

    console.log(ctx.message.text);

    // Send the "typing" action to the chat
    await ctx.replyWithChatAction('typing');
    const response = "test"; //await chatgptConversation(ctx.message.text, cookies, authorization);
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
