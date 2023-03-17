const { prompts } = require('./prompts.js');

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
    "Data Scientist": { emoji: '🔬', description: 'Data Scientist', prompt: prompts.scientist },
    "SVG": { emoji: '🎨', description: 'SVG creator', prompt: prompts.svg },
};

const instructionsKeyboard = Object.keys(INSTRUCTIONS).map(instructionKey => ([{
    text: INSTRUCTIONS[instructionKey].emoji + " " + INSTRUCTIONS[instructionKey].description,
    callback_data: `instruction:${instructionKey}`
}]));

const commandsText = COMMANDS.map(cmd => `/${cmd.command} - ${cmd.description}`).join('\n');
const reactionsText = Object.keys(REACTIONS).map(command => `${REACTIONS[command].emoji} - ${REACTIONS[command].description}`).join('\n');


module.exports = {
    COMMANDS, REACTIONS, INSTRUCTIONS, 
    instructionsKeyboard,
    commandsText,reactionsText,prompts
};