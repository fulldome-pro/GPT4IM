const {onBotCommandNewTopicCommon} = require('./common.js');
const { COMMANDS, REACTIONS, INSTRUCTIONS, instructionsKeyboard,commandsText,reactionsText,prompts } = require('./const/const.js');

async function onBotStartPrivate(ctx) {
    await ctx.reply('👋 Welcome to VedaVany.');
    await onBotCommandHelpPrivate(ctx);
    await onBotCommandNewTopicCommon(ctx);
}


async function onBotCommandHelpPrivate(ctx) {
    await ctx.reply('List of commands:');
    await ctx.reply(commandsText);
    await ctx.reply(`💬 Any time you can write text. 👨‍💻 And bot will give response. 👉 You can give feedback(it will help us to improve) after response, using this buttons:`);
    await ctx.reply(reactionsText);
}



module.exports = {
    onBotStartPrivate,
    onBotCommandHelpPrivate,
};