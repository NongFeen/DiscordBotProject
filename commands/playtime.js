const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const headers = {
    'X-API-Key': process.env.XAPIkey_ID,
    'Content-Type': 'application/json', //set the content type to JSON
  };

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playtime')
		.setDescription('playtime')
		.addStringOption(option =>
			option.setName('input')),
async execute(interaction) {
  const inputString = interaction.options.get('input').value;
  const part = inputString.split('#');

  const bungieGlobalDisplayName = part[0]; // string
  const bungieGlobalDisplayNameCode = part[1]; // #xxxx int

  const idUrl = 'https://www.bungie.net/Platform/User/Search/GlobalName/';
  const profileUrl = 'https://www.bungie.net/Platform/Destiny2/{membershipType}/Profile/{membershipId}/?components=200';
  
  let page = 0;
  let dataCount =0;
  let membershipId;
  let found =false;
  console.log(bungieGlobalDisplayName + "  " + bungieGlobalDisplayNameCode);
  console.log(`${idUrl}${page}`);

  let totalPlaytime = 0;
  const msg = await interaction.reply("fetching data...")
  try {
    while (!found) {
      const response = await axios.post(`${idUrl}${page}`, { "displayNamePrefix": bungieGlobalDisplayName }, { headers });
    //   console.log(response.data.Response);
      const responseData = response.data.Response;
      for (const result of responseData.searchResults) {
        dataCount++;
        // console.log(dataCount + " : " + `${idUrl}${page}`)
        // console.log(result.bungieGlobalDisplayNameCode+" : "+ parseInt(bungieGlobalDisplayNameCode) + (result.bungieGlobalDisplayName === bungieGlobalDisplayName).toString());
        if (result.bungieGlobalDisplayName === bungieGlobalDisplayName &&
            result.bungieGlobalDisplayNameCode === parseInt(bungieGlobalDisplayNameCode)
        ){
          console.log("found")
          found=true;
          for (const membership of result.destinyMemberships) { //each membership PS,Xbox,PC
            if(membership.bungieGlobalDisplayNameCode==parseInt(bungieGlobalDisplayNameCode)){
                membershipId = membership.membershipId;
                const memshipId = membership.membershipId;
                let membershipType = membership.membershipType;
                let profileUrl = 'https://www.bungie.net/Platform/Destiny2/{membershipType}/Profile/{membershipId}/?components=200';
                profileUrl = profileUrl.replace('{membershipType}', membershipType).replace('{membershipId}', memshipId );
                try {
                    const profileResponse = await axios.get(profileUrl, {headers});
                    console.log(profileResponse.data.Response.characters.data);
                    const characters = profileResponse.data.Response.characters.data;
                    for (const characterId in characters) {
                        totalPlaytime += parseInt(characters[characterId].minutesPlayedTotal);
                        console.log(/*"bug here| Playtime = "+*/ totalPlaytime.toString());
                    }
                } catch (error) {
                    console.log("No character found");
                }
            }
          }
        }
      }
      if (responseData.hasMore&&dataCount>=24 &&!found) {//24 work due to Max data count per page
        // If there are more pages, increment the page number
        // console.log("page = " + page + " url = " + `${idUrl}${page}`)
        page++;
        dataCount=0;
      } else {
        // No more pages to retrieve
        break;
      }
    }

    if (membershipId) {
      // Reply back to the interaction with the membershipId
      let hour = parseInt(totalPlaytime/60);
      let min = parseInt((totalPlaytime%60));
      let a =0;
      msg.edit("Total play time of "+ inputString.toString() + " : " +hour.toString()+ " hour " + min.toString()+(" min"));
    //   await interaction.reply("Total play time of "+ inputString.toString() + " : " +hour.toString()+ " hour " + min.toString()+(" min"));
    } else {
    //   // Reply back if no matching entry is found
      msg.edit(`No matching entry found for ${bungieGlobalDisplayName}#${bungieGlobalDisplayNameCode}`);
    }
  } catch (error) {
    // console.error('Error:', error);
    // Handle and reply with an error message
    msg.edit('An error occurred while fetching the data from Bungie API.');
  }
  


}
};