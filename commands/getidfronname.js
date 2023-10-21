const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const headers = {
    'X-API-Key': process.env.XAPIkey_ID,
    'Content-Type': 'application/json', //set the content type to JSON
  };

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getidfronname')
		.setDescription('getidfronname')
		.addStringOption(option =>
			option.setName('input')),
async execute(interaction) {
  const inputString = interaction.options.get('input').value;
  const part = inputString.split('#');

  const bungieGlobalDisplayName = part[0]; // string
  const bungieGlobalDisplayNameCode = part[1]; // #xxxx int

  const apiUrl = 'https://www.bungie.net/Platform/User/Search/GlobalName/';
  

  const resultsPerPage = 25;
  let page = 0;
  let dataCount =0;
  let membershipId;
  let found =false;
  console.log(bungieGlobalDisplayName + "  " + bungieGlobalDisplayNameCode);
  console.log(`${apiUrl}${page}`);

  try {
    while (!found) {
      const response = await axios.post(`${apiUrl}${page}`, { "displayNamePrefix": bungieGlobalDisplayName }, { headers });
      console.log(response.data.Response);
      const responseData = response.data.Response;
      for (const result of responseData.searchResults) {
        dataCount++;
        console.log(dataCount + " : " + `${apiUrl}${page}`)
        // console.log(result.bungieGlobalDisplayNameCode+" : "+ parseInt(bungieGlobalDisplayNameCode) + (result.bungieGlobalDisplayName === bungieGlobalDisplayName).toString());
        if (result.bungieGlobalDisplayName === bungieGlobalDisplayName &&
            result.bungieGlobalDisplayNameCode === parseInt(bungieGlobalDisplayNameCode)
        ){
          console.log("found")
          found=true;
          for (const membership of result.destinyMemberships) {
            if(membership.bungieGlobalDisplayNameCode==bungieGlobalDisplayNameCode){
              membershipId = membership.membershipId;
              break;
            }
          }
        }
      }
      if (responseData.hasMore&&dataCount>=24 &&!found) {//24 work due to Max data count per page
        // If there are more pages, increment the page number
        console.log("page = " + page + " url = " + `${apiUrl}${page}`)
        page++;
        dataCount=0;
      } else {
        // No more pages to retrieve
        break;
      }
    }
    if (membershipId) {
      // Reply back to the interaction with the membershipId
      let str = `Membership ID for ${bungieGlobalDisplayName}#${bungieGlobalDisplayNameCode} is ${membershipId}`;
      await interaction.reply(str);
    } else {
    //   // Reply back if no matching entry is found
      await interaction.reply(`No matching entry found for ${bungieGlobalDisplayName}#${bungieGlobalDisplayNameCode}`);
    }
    
  } catch (error) {
    // console.error('Error:', error);
    // Handle and reply with an error message
    await interaction.reply('An error occurred while fetching the data from Bungie API.');
  }
}
};