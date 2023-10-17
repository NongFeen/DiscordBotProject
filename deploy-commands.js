const {REST, Routes} = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: 'yo',
        description: 'yo',
    },
    {
        name: 'test',
        description: 'Test command',
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
    }
})();