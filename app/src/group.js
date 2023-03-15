const { COMMANDS, REACTIONS, INSTRUCTIONS, instructionsKeyboard,commandsText,reactionsText,prompts } = require('./const.js');
const { chatgptConversation } = require('./chatgpt.js');


async function onBotStartGroup(ctx) {
    await ctx.reply('👋 Hi');
}

async function onBotCommandNewTopicGroup(ctx) {
  //console.log(ctx);
  //console.log(ctx.message.text);
  if ((ctx.message.text == "/newtopic@VedaVany2_bot") || (ctx.message.text == "/chatgpt@VedaVany2_bot")) {
    await ctx.reply('Usage: /newtopic What is life after life?', { reply_to_message_id: ctx.message.message_id });
    return;
  }
  await ctx.reply('👉 !!!');
}

async function onBotCommandHelpGroup(ctx) {
    await ctx.reply('List of commands:');
    const commandsText = COMMANDS.map(cmd => `/${cmd.command} - ${cmd.description}`).join('\n');
    await ctx.reply(commandsText);
    await ctx.reply(`💬 Any time you can write text. 👨‍💻 And bot will give response. 👉 You can give feedback(it will help us to improve) after response, using this buttons:`);
    const reactionsText = Object.keys(REACTIONS).map(command => `${REACTIONS[command].emoji} - ${REACTIONS[command].description}`).join('\n');
    await ctx.reply(reactionsText,{ reply_to_message_id: ctx.message.message_id });
  }

async function onBotTextGroup(ctx) {
    await ctx.reply("group");
}


module.exports = {
    onBotStartGroup,
    onBotCommandNewTopicGroup,
    onBotCommandHelpGroup,
    onBotTextGroup
};