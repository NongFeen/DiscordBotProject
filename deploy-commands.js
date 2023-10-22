const {REST, Routes, ApplicationCommandType, ApplicationCommand, ApplicationCommandOptionType} = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: 'getidfronname',
        description: 'getidfronname',
        options: [
            {
                name: 'input',
                description: 'Enter bungie name',
                type: ApplicationCommandOptionType.String,
                require: true,
            }
        ],
        require: true,
    },
    {
        name: 'test',
        description: 'Test command',
    },
    {
        name: 'playtime',
        description: 'playtime',
        options: [
            {
                name: 'input',
                description: 'Enter bungie name',
                type: ApplicationCommandOptionType.String,
                require: true,
            }
        ],
        require: true,
    },
];


const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async ()=>{
    try {
        console.log('Registering commands');
        await rest.put(
            // Routes.applicationGuildCommands(process.env.CLIENT_ID,process.env.GUILD_ID)// register only on test server
            Routes.applicationCommands(process.env.CLIENT_ID),
            {
                body:commands
            }
        )     
        console.log('Command Registed');

    } catch (error) {
        console.log('there was an  error');
        console.log(error);
    }
})();