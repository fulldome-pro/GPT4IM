const { Telegraf, Markup } = require('telegraf');
const { Keyboard } = require('telegram-keyboard')
const LocalSession = require('telegraf-session-local')
const fs = require('fs');




const dotenv = require('dotenv');
dotenv.config();

const { chatgptConversation } = require('./chatgpt.js');
const { prompts } = require('./prompts.js');

// Load environment variables
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
if (!telegramBotToken) {
  throw new Error('TELEGRAM_BOT_TOKEN not found');
}

// Create a new Telegraf instance using the API token provided by BotFather
const bot = new Telegraf(telegramBotToken);

// Set up local session middleware to store user data
const sessionPath = './data/sessions/session.json';
const session = new LocalSession();
bot.use((new LocalSession({ database: sessionPath })).middleware())

// Enable command menu
const COMMANDS = [
  { command: 'start', description: 'Start the bot' },
  { command: 'newtopic', description: 'Start new topic' },
  //{ command: 'translate', description: 'Translate to english next message' },  
  //{ command: 'chats', description: 'Show chats list' },
  //{ command: 'prompts', description: 'Chose special prompt' },  
  //{ command: 'useinternet_once', description: 'Use internet once for next mesage' },  
  //{ command: 'useinternet_always', description: 'Use internet always for this chat' },  
  //{ command: 'useinternet_never', description: 'Useinternet never for this chat' },  
  { command: 'help', description: 'Get help' },
];

const REACTIONS = {
  perfect: { emoji: '💯', description: 'Use this button to indicate a perfect answer' },
  good: { emoji: '👍', description: 'Use this button to indicate a good answer' },
  like: { emoji: '❤️', description: 'Use this button to indicate that you like this answer' },
  funny: { emoji: '😂', description: 'Use this button to indicate that this answer is funny' },
  //continue: { emoji: '📝', description: 'Use this button later if you want to continue the conversation from this point' },
  //regenerate: { emoji: '🔄', description: 'Use this button to generate a new answer' },
  bad: { emoji: '👎', description: 'Use this button to indicate a bad answer' },
  terrible: { emoji: '❌', description: 'Use this button to indicate a terrible answer and ask not to get an answer like this again' }
};

const INSTRUCTIONS = {
  "Spiritual": { emoji: '🕉️', description: 'Spiritual', prompt: prompts.spiritual },
  "Plain": { emoji: '🤷‍♂️', description: 'Plain (no instructions)', prompt: prompts.plain },
  "DAN": { emoji: '💪', description: 'DAN (jailbrake)', prompt: prompts.DAN },
  "Developer": { emoji: '💻', description: 'Developer', prompt: prompts.developer },
  "SVG": { emoji: '🎨', description: 'SVG creator', prompt: prompts.svg },
};

const instructionsKeyboard = Object.keys(INSTRUCTIONS).map(instructionKey => ([{
  text: INSTRUCTIONS[instructionKey].emoji + " " + INSTRUCTIONS[instructionKey].description,
  callback_data: `instruction:${instructionKey}`
}]));



bot.telegram.setMyCommands(COMMANDS);

// Start command
bot.start(async (ctx) => {
  await ctx.reply('👋 Welcome to VedaVany.');
  await commandHelp(ctx);
  await commandNewTopic(ctx);
});

bot.command('newtopic', async (ctx) => {
  await commandNewTopic(ctx);
});

function checkSession(ctx)
{  
  if (typeof ctx.session === 'undefined') ctx.session = {
    dialog: prompts.default,
    dialogs: {},
    //dialogId: Math.floor(Math.random() * 999999999999),
    //userId: Math.floor(Math.random() * 999999999999),
    //messages: {},
    feedback: {},
    lastMessageId: null
  }

  if (typeof ctx.session.dialog === 'undefined') ctx.session.dialog = prompts.default;
  if (typeof ctx.session.dialogs === 'undefined') ctx.session.dialogs = {};
//  if (typeof ctx.session.messages === 'undefined') ctx.session.messages = {};
  if (typeof ctx.session.feedback === 'undefined') ctx.session.feedback = {};
  if (typeof ctx.session.lastMessageId === 'undefined') ctx.session.lastMessageId = null;
}

async function commandNewTopic(ctx) {
  // Send the response back to the user
  await ctx.reply('👉👨‍💻💬 Please choose instructions set or just type something:', { reply_markup: { parse_mode: "MakrdownV2", keyboard: instructionsKeyboard, resize_keyboard: true, one_time_keyboard: true } });
  checkSession(ctx);
  ctx.session.dialog=prompts.default;
}

async function commandHelp(ctx) {

  await ctx.reply('List of commands:');
  const commandsText = COMMANDS.map(cmd => `/${cmd.command} - ${cmd.description}`).join('\n');
  await ctx.reply(commandsText);
  await ctx.reply(`💬 Any time you can write text. 👨‍💻 And bot will give response. 👉 You can give feedback(it will help us to improve) after response, using this buttons:`);
  const reactionsText = Object.keys(REACTIONS).map(command => `${REACTIONS[command].emoji} - ${REACTIONS[command].description}`).join('\n');
  await ctx.reply(reactionsText);
}


async function checkOnInstruction(ctx) {
  const message = ctx.message.text;
  var instruction = null;
  for (const instructionKey in INSTRUCTIONS) {
    instruction = INSTRUCTIONS[instructionKey];
    if (message == instruction.emoji + " " + instruction.description) break;
    instruction = null;
  }
  if (instruction == null) return false;
  await onInstruction(ctx, instruction);
  return true;
}

async function onInstruction(ctx, instruction) {
  console.log("Instruction prompt:", instruction.prompt);
  ctx.session.dialog = instruction.prompt;
  //await ctx.answerCbQuery('Instructions set, please write your text!', { show_alert: false }); //cache_time: 300  
  await ctx.reply('👉👨‍💻💬 Now just type something:');

}

// Listen for incoming text messages
bot.on('text', async (ctx) => {
  try {
    checkSession(ctx);

    const message = ctx.message.text;
    const chatId = ctx.message.chat.id;
    const messageId = ctx.message.message_id;

    const userId = ctx.message.from.id;

    const dialogId = ctx.session.dialogId;
    const lastMessageId = ctx.session.lastMessageId;

    var dialog = ctx.session.dialog;
    var feedback = ctx.session.feedback;
    var messages = ctx.session.messages;


    if( await checkOnInstruction(ctx) == true) return;

    console.log('📩 Incoming message:', message);
    console.log('🤖 Dialog:', dialog);
    // Send the "typing" action to the chat
    await ctx.replyWithChatAction('typing');

    // Call the chatGPT API to generate a response
    const response = await chatgptConversation(message, dialog);
    console.log('🤖 Response:', response);

    var qa = [
      { "role": "user", "content": message },
      { "role": "assistant", "content": response } // , messageId
    ];
    console.log('🤖 qa:', qa);

    dialog = dialog.concat(qa);

    console.log('🤖 dialog:', dialog);



    var chatContent = { dialogId, chatId, dialog, lastMessageId, messageId };

    ctx.session.dialog = dialog; //JSON.stringify(dialog);
    ctx.session.lastMessageId = messageId; //JSON.stringify(dialog);
    ctx.session.dialogs[messageId]=dialog;

    /*
    fs.writeFile('data/chats/' + chatId + "_" + dialogId + '.json', JSON.stringify(chatContent), 'utf8', (err) => {
      if (err) throw err;
      console.log('Data has been written to file successfully!');
    });
    */

    const reactionsKeyboard = Object.keys(REACTIONS).map(command => ({
      text: REACTIONS[command].emoji,
      callback_data: `reaction:${command}:${messageId}`
    }));

    // Send the response back to the user
    await ctx.reply(response, { reply_markup: { parse_mode: "MakrdownV2", inline_keyboard: [reactionsKeyboard] } });






  } catch (err) {
    // Handle errors gracefully
    console.error('❌ Error:', err);
    if (err.response.status == 429) {
      await ctx.reply('Oops! Too many requests, bot is overloaded. Please try again little bit later.');
    } else if (err.response.status == 400) {
      await ctx.reply('Oops! Something went wrong with server. Please try again later or try to restart bot using /start command.');
    } else {
      await ctx.reply(`Oops! Something went wrong(status code ${err.response.status}). Please try again later or try to restart bot using /start command.`);
    }
  }
});

bot.action(/reaction:(.*):(.*)/, async (ctx) => {
  const reactionType = ctx.match[1];
  const reactionMessageId = ctx.match[2];
  console.log(reactionType, reactionMessageId);
  ctx.session.feedback[reactionMessageId] = reactionType;
  await ctx.answerCbQuery('Thank you for feedback!', { show_alert: false }); //cache_time: 300  
});






// Start polling for incoming messages
bot.launch();
console.log('🚀 VadaVany bot is running');