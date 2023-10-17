const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const apiUrl = 'https://www.bungie.net/Platform/Destiny2/3/Profile/4611686018522440454/?components=100,200';
const header = {'X-API-Key': process.env.XAPIkey_ID};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yo')
		.setDescription('yo'),
	async execute(interaction) {
		// await interaction.reply('Yo!');
		var bungieGlobalDisplayName;
		var bungieGlobalDisplayNameCode;
		await axios.get(apiUrl, { header })
		.then((response) => {
			console.log(response.data);
			bungieGlobalDisplayName = response.data.Response.profile.data.userInfo.bungieGlobalDisplayName;	
			bungieGlobalDisplayNameCode = response.data.Response.profile.data.userInfo.bungieGlobalDisplayNameCode;	
			console.log("Bungie Global Display Name:", bungieGlobalDisplayName+"#"+bungieGlobalDisplayNameCode);
			interaction.reply('Bungie Global Display Name : '+ bungieGlobalDisplayName+'#'+bungieGlobalDisplayNameCode);
		})
		.catch((error) => {
			// Handle any errors that occurred during the request
			console.error(error);
		});
		
		console.log();
	},
};