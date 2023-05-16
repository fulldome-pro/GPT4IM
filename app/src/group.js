const { COMMANDS, REACTIONS, INSTRUCTIONS, menuKeyboard,commandsText,reactionsText,feedbackText,helpGroupText,prompts } = require('./const/const.js');



async function onBotStartGroup(ctx) {
	console.log(ctx);
	console.log(ctx.message.message_thread_id);
	//await ctx.reply('👋 Hi', { reply_markup: { message_thread_id:ctx.message.message_thread_id}} );
	await ctx.reply('👋 Hi',  { reply_to_message_id: ctx.message.message_id } );
}


async function onBotCommandHelpGroup(ctx) {
	await ctx.reply(ctx.i18n.t('commands_list'));
	await ctx.reply(ctx.i18n.t('help_private'));
	await ctx.reply(ctx.i18n.t('reactions'));
	await ctx.reply(ctx.i18n.t('feedback'));
}

async function onBotTextGroup(ctx) {
    console.log(ctx);
    console.log(ctx.message.from);
    console.log(ctx.message.chat);
    //await ctx.reply("group");
}

async function onBotDonateGroup(ctx) {
	await ctx.reply(ctx.i18n.t('donate'), {
		reply_markup: {
			inline_keyboard: [
					[ { text: ctx.i18n.t('donate_btn'), callback_data: 'donate' }],
			]
	}
	});
}

async function onBotChangeLanguageGroup(ctx) {
	await ctx.reply(ctx.i18n.t('change_lang_btn'), {
		reply_markup: {
			inline_keyboard: [
					[ { text: '🇬🇧', callback_data: 'change:language:en' },
					{ text: '🇮🇳', callback_data: 'change:language:hi' },
					{ text: '🇷🇺', callback_data: 'change:language:ru' },
					{ text: '🇺🇦', callback_data: 'change:language:ua' },],
			]
	}
	});
}

module.exports = {
    onBotStartGroup,
    onBotCommandHelpGroup,
    onBotTextGroup,
		onBotDonateGroup,
		onBotChangeLanguageGroup
};