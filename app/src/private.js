const { COMMANDS, REACTIONS, INSTRUCTIONS, instructionsKeyboard,commandsText,reactionsText,prompts } = require('./const.js');
const { chatgptConversation } = require('./chatgpt.js');

async function onBotStartPrivate(ctx) {
    await ctx.reply('👋 Welcome to VedaVany.');
    await onBotCommandHelpPrivate(ctx);
    await onBotCommandNewTopicPrivate(ctx);
}

async function onBotCommandNewTopicPrivate(ctx) {
    console.log(ctx);
    const topic=ctx.message.text.substring(ctx.message.text.indexOf(" ") + 1);
    console.log(topic);

    ctx.session.dialog = prompts.default;
    if((topic == "/newtopic")||(topic == "/chatgpt"))
    {
        await ctx.reply('👉👨‍💻💬 Please choose instructions set or just type something:', { reply_markup: { parse_mode: "MakrdownV2", keyboard: instructionsKeyboard, resize_keyboard: true, one_time_keyboard: true } });
    } else {
        //var q = { "role": "user", "content": topic };
        //ctx.session.dialog = ctx.session.dialog.concat([q]);
        ctx.message.text=topic;
        onBotTextPrivate(ctx);
    }

}

async function onBotCommandHelpPrivate(ctx) {
    await ctx.reply('List of commands:');
    await ctx.reply(commandsText);
    await ctx.reply(`💬 Any time you can write text. 👨‍💻 And bot will give response. 👉 You can give feedback(it will help us to improve) after response, using this buttons:`);
    await ctx.reply(reactionsText);
}



async function onBotTextPrivate(ctx) {
    console.log(ctx.session);
    const message = ctx.message.text;
    const chatId = ctx.message.chat.id;
    const messageId = ctx.message.message_id;

    const userId = ctx.message.from.id;

    const dialogId = ctx.session.dialogId;
    var toMessageId = messageId;

    var dialog = ctx.session.dialog;
    var feedback = ctx.session.feedback;
    var messages = ctx.session.messages;


    console.log('📩 Incoming message:', message);
    if (typeof ctx.message.reply_to_message !== 'undefined') {
         
         toMessageId=ctx.message.reply_to_message.message_id;
         console.log("on reply toMessageId=",toMessageId);
         dialog=ctx.session.dialogs[toMessageId];
    }

    


    console.log('🤖 Dialog:', dialog);
    // Send the "typing" action to the chat
    await ctx.replyWithChatAction('typing');

    // Call the chatGPT API to generate a response
    const response = await chatgptConversation(message, dialog);
    console.log('🤖 Response:', response);

    var q = { "role": "user", "content": message };
    var a = { "role": "assistant", "content": response };
    
    var qa=[q,a];
    
    //dialog = dialog.concat(qa);
    dialog = dialog.concat([q]);
    var dialogHalf=dialog;
    dialog = dialog.concat([a]);

    console.log('🤖 dialog:', dialog);




    const reactionsKeyboard = Object.keys(REACTIONS).map(command => ({
        text: REACTIONS[command].emoji,
        callback_data: `reaction:${command}:${toMessageId}`
    }));

    // Send the response back to the user
    const messageResponse=await ctx.reply(response, { reply_markup: { parse_mode: "MakrdownV2", inline_keyboard: [reactionsKeyboard] } })
    var responseMessageId=messageResponse.message_id;
    console.log(messageResponse);

    ctx.session.dialog = dialog; 
    ctx.session.lastMessageId = toMessageId;
    ctx.session.responseMessageId = responseMessageId;
    ctx.session.dialogs[toMessageId] = dialogHalf;
    ctx.session.dialogs[responseMessageId] = dialog;
    ctx.session.responses[toMessageId]=responseMessageId;

}


module.exports = {
    onBotStartPrivate,
    onBotCommandNewTopicPrivate,
    onBotCommandHelpPrivate,
    onBotTextPrivate
};