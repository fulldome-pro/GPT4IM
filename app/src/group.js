const { COMMANDS, REACTIONS, INSTRUCTIONS, instructionsKeyboard,commandsText,reactionsText,prompts } = require('./const/const.js');



async function onBotStartGroup(ctx) {
    console.log(ctx);
    console.log(ctx.message.message_thread_id);
    //await ctx.reply('👋 Hi', { reply_markup: { message_thread_id:ctx.message.message_thread_id}} );
    await ctx.reply('👋 Hi',  { reply_to_message_id: ctx.message.message_id } );
}


async function onBotCommandHelpGroup(ctx) {
    await ctx.reply('List of commands:');
    await ctx.reply(commandsText);
    await ctx.reply(`💬 Any time you can write text. 👨‍💻 And bot will give response. 👉 You can give feedback(it will help us to improve) after response, using this buttons:`);
    await ctx.reply(reactionsText,{ reply_to_message_id: ctx.message.message_id });
  }

async function onBotTextGroup(ctx) {
    console.log(ctx);
    console.log(ctx.message.from);
    console.log(ctx.message.chat);
    await ctx.reply("group");
}


module.exports = {
    onBotStartGroup,
    onBotCommandHelpGroup,
    onBotTextGroup
};