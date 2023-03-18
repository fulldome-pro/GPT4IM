const { makeDialog } = require('./dialog.js');
const { COMMANDS, REACTIONS, INSTRUCTIONS, menuKeyboard, commandsText, reactionsText, prompts } = require('./const/const.js');

async function onBotCommandNewTopicCommon(ctx) {
    /*TODO
    /new
    Text

    Чтобы тоже отрабатывал
    */
    var topic = ctx.message.text.substring(ctx.message.text.indexOf(" ") + 1);

    if (topic == "/start") topic = "/new";

    


    if ((topic == "/new@VedaVany2_bot") || (topic == "/newtopic@VedaVany2_bot") || (topic == "/chatgpt@VedaVany2_bot") || (topic == "/chatgpt@uz_chatGPT_bot")) {
        await ctx.reply('Usage: /new What is life after life?', { reply_to_message_id: ctx.message.message_id });
        return;
    }

    if ((topic == "/new") || (topic == "/newtopic") || (topic == "/chatgpt")) {
        ctx.session.dialog = prompts.default;
        if (ctx.chat.type === 'private') {
            await ctx.reply('👉👨‍💻💬 Please choose instructions set or just type something:', { reply_markup: { parse_mode: "MakrdownV2", keyboard: menuKeyboard, resize_keyboard: true, one_time_keyboard: true } });
        } else {
            await ctx.reply('💬 New topic started');
        }
        return;
    }

    ctx.message.text = topic;
    await makeDialog(ctx);
}

async function checkSession(ctx) {
    if (typeof ctx.session === 'undefined') ctx.session = {
        dialog: prompts.default,
        dialogs: {},
        feedback: {},
        lastMessageId: null
    };

    if (typeof ctx.session.dialog === 'undefined') ctx.session.dialog = prompts.default;
    if (typeof ctx.session.dialogs === 'undefined') ctx.session.dialogs = {};
    if (typeof ctx.session.feedback === 'undefined') ctx.session.feedback = {};
    if (typeof ctx.session.lastMessageId === 'undefined') ctx.session.lastMessageId = null;
    if (typeof ctx.session.responseMessageId === 'undefined') ctx.session.responseMessageId = null;
    if (typeof ctx.session.responses === 'undefined') ctx.session.responses = {};
    if (typeof ctx.session.responses2 === 'undefined') ctx.session.responses2 = {};
    console.log(ctx.session);
}

module.exports = {
    onBotCommandNewTopicCommon,
    checkSession
};