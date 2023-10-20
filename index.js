const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();
const commandsFolder = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsFolder).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsFolder, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.on('interactionCreate', async (interaction) => {
        if(!interaction.isChatInputCommand())return;
        const command = client.commands.get(interaction.commandName);
        if(!command){//return if bug
            console.log('GG code bug');
            return;
        }
        
    try {
        // if(interaction.commandName=='test'){//double check name
            command.execute(interaction);
        // }
        // console.log(interaction.commandName);
    } catch (error) {
        // console.error(error);
        await interaction.reply('There was an error while executing this command!');
    }
});

client.on('ready', () => {
    console.log('Bot is ready');
});

client.login(process.env.TOKEN);
