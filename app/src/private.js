const {onBotCommandNewTopicCommon} = require('./common.js');
const { COMMANDS, REACTIONS, INSTRUCTIONS,commandsText,reactionsText,feedbackText,helpPrivateText,prompts } = require('./const/const.js');
let menuKeyboard;

async function onBotStartPrivate(ctx) {
    await ctx.reply(ctx.i18n.t('start_welcome'));
    await onBotCommandHelpPrivate(ctx);
		await onBotDonatePrivate(ctx);
		await onBotChangeLanguagePrivate(ctx);
    await onBotCommandNewTopicCommon(ctx);

		const MENU = [
			{
					"instructions:spiritual": { emoji: '🕉️', description: ctx.i18n.t('menu_spiritual'), prompt: prompts.spiritual }
			},
	
			{
					"instructions:plain": { emoji: '🤷‍♂️', description: ctx.i18n.t('menu_spiritual'), prompt: prompts.plain },
					"instructions:dan": { emoji: '💪', description: ctx.i18n.t('menu_spiritual'), prompt: prompts.dan }
			},
			{
					"instructions:developer": { emoji: '💻', description: ctx.i18n.t('menu_spiritual'), prompt: prompts.developer },
					"instructions:sceintist": { emoji: '🔬', description: ctx.i18n.t('menu_spiritual'), prompt: prompts.scientist }
			},
			{
					"instructions:svg": { emoji: '🎨', description: ctx.i18n.t('menu_spiritual'), prompt: prompts.svg },
			},
	
			{
					"mode:qa": { emoji: '❓', description: ctx.i18n.t('menu_spiritual'), mode: "qa" },
					"mode:dialog": { emoji: '💬', description: ctx.i18n.t('menu_spiritual'), mode: "dialog" },
					//"mode:internet": { emoji: '🌐', description: 'Internet', mode:"internet" },
			}
		];
	
	function createKeyboard(menu) {
		let keyboard = [];

		for (let i = 0; i < menu.length; i++) {
			let row = [];
			for (let key in menu[i]) {
				let button = {
					text: menu[i][key].emoji + " " + menu[i][key].description,
					callback_data: `menu:${key}`
				};
				row.push(button);
			}
				keyboard.push(row);
		}
		return keyboard;
	}
	
	//.oneTimeKeyboard(true);
	
	menuKeyboard = createKeyboard(MENU);
}


async function onBotCommandHelpPrivate(ctx) {
    await ctx.reply(ctx.i18n.t('commands_list'));
    await ctx.reply(ctx.i18n.t('help_private'));
    await ctx.reply(ctx.i18n.t('reactions'));
    await ctx.reply(ctx.i18n.t('feedback'));
}

async function onBotDonatePrivate(ctx) {
	await ctx.reply(ctx.i18n.t('donate'), {
		reply_markup: {
			inline_keyboard: [
					[ { text: ctx.i18n.t('donate_btn'), url: 'google.com' }],
			]
	}
	});
}

async function onBotChangeLanguagePrivate(ctx) {
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
    onBotStartPrivate,
    onBotCommandHelpPrivate,
		onBotDonatePrivate,
		onBotChangeLanguagePrivate
};