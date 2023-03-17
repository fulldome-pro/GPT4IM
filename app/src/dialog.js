const { COMMANDS, REACTIONS, INSTRUCTIONS, instructionsKeyboard,commandsText,reactionsText,prompts } = require('./const/const.js');
const { chatgptConversation } = require('./api/chatgpt.js');

const { getCurrentDateFormatted,splitText } = require('./helper');



async function makeDialog(ctx) {
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

    /*
    if (ctx.chat.type === 'private') {} else {

    }
    */



    console.log('📩 Incoming message:', message);
    if (typeof ctx.message.reply_to_message !== 'undefined') {
         
         toMessageId=ctx.message.reply_to_message.message_id;
         console.log("on reply toMessageId=",toMessageId);
         dialog=ctx.session.dialogs[toMessageId];
    }

    // Send the "typing" action to the chat
    newMessage = await ctx.reply('...');
    //newMessage = await ctx.reply('...',{ reply_markup:  {  parse_mode: "MakrdownV2", inline_keyboard: [reactionsKeyboard]  }});
    
    const reactionsKeyboard = Object.keys(REACTIONS).map(command => ({
        text: REACTIONS[command].emoji,
        callback_data: `reaction:${command}:${toMessageId}`
    }));


    await ctx.replyWithChatAction('typing');



    console.log('🤖 Dialog:', dialog);

    // Call the chatGPT API to generate a response
    const response = await chatgptConversation(message, dialog,(text) => { 
        console.log(text);
        
        //TODO:сделать по правильному, через async
        //await
        ctx.telegram.editMessageText(newMessage.chat.id, newMessage.message_id, null, text+"\n...",{reply_markup:  {  parse_mode: "MakrdownV2", inline_keyboard: [reactionsKeyboard] }});
        ctx.replyWithChatAction('typing');
        });

    

    await ctx.replyWithChatAction('cancel')

    console.log('🤖 Response:', response);

    var q = { "role": "user", "content": message };
    var a = { "role": "assistant", "content": response };
    
    var qa=[q,a];
    
    //dialog = dialog.concat(qa);
    dialog = dialog.concat([q]);
    var dialogHalf=dialog;
    dialog = dialog.concat([a]);

    console.log('🤖 dialog:', dialog);


    var responseMessageId=newMessage.message_id;


    //TODO:Поддержка длинных 4096+ ответов
    /* старая версия работающая до ответов в realtime
    responseArray=splitText(response);
    //await newMessage.edit_text(responseArray[0]);
    ctx.telegram.editMessageText(newMessage.chat.id, newMessage.message_id, null, responseArray[0],{reply_markup:  {  parse_mode: "MakrdownV2", inline_keyboard: [reactionsKeyboard] }});


    // Send the response back to the user


    ctx.replyWithChatAction('cancel');
    responseArray.forEach(async (text, index) => {
        var messageResponse=await ctx.reply(text, { reply_markup: index === responseArray.length - 1 ? {  parse_mode: "MakrdownV2", inline_keyboard: [reactionsKeyboard]  } : undefined });
        //console.log(messageResponse);

        responseMessageId=messageResponse.message_id;
        ctx.session.responses2[responseMessageId]=toMessageId;
        ctx.session.dialogs[responseMessageId] = dialog;
        ctx.session.responseMessageId = responseMessageId;

    });
    //var feedback=await ctx.reply(" ", { reply_markup: { parse_mode: "MakrdownV2", inline_keyboard: [reactionsKeyboard] } });
    //var feedback=await ctx.replyWithMarkdownV2(" ", { reply_markup: { inline_keyboard: [reactionsKeyboard] } })
    */

    

    ctx.session.dialog = dialog; 
    ctx.session.lastMessageId = toMessageId;
    ctx.session.responseMessageId = responseMessageId;
    ctx.session.dialogs[toMessageId] = dialogHalf;
    ctx.session.dialogs[responseMessageId] = dialog;
    ctx.session.responses[toMessageId]=responseMessageId;

}


module.exports = {
    makeDialog
};