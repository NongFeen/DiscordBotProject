const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();
const axios = require('axios'); 

const API_KEY = process.env.XAPIkey_ID ; // Replace with your actual API key
let START_GAME_ID = parseInt(process.env.startGameId);// 15851419985; //->15851443084
const TARGET_SCORE = parseInt(process.env.TargetScore); // 
const REQUESTS_PER_SECOND = 100;

async function fetchGameData(gameId) {
    const url = `https://www.bungie.net/Platform/Destiny2/Stats/PostGameCarnageReport/${gameId}`;
    try {
        const response = await axios.get(url, {
            headers: { 'X-API-Key': API_KEY }
        });
        return { gameId, data: response.data };
    } catch (error) {
        if (error.response) {
            console.log(error);
            console.error(`Error: Received status ${error.response.status} for Game ID ${gameId}`);
            if (error.response.status === 429) {
                console.log('Rate limit reached, waiting before retrying...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } else {
            console.error(`Request error for Game ID ${gameId}:`, error.message);
        }
        return { gameId, data: null };
    }
}

async function findTeamScore(startGameId, targetScore) {
    let gameId = startGameId;
    let requestCount = 0;

    while (true) {
        const requests = [];
        for (let i = 0; i < REQUESTS_PER_SECOND; i++) {
            requests.push(fetchGameData(gameId + i));
        }
        
        const results = await Promise.all(requests);
        for (const { gameId: fetchedGameId, data } of results) {
            requestCount++;
            // console.log(`[${timestamp}] Checking Game ID: ${fetchedGameId} | Total Requests: ${requestCount}`);
            
            if (!data) continue;
            if (data.ErrorCode === 2102) {
                console.error('Error: API key is missing. Please provide a valid X-API-Key.');
                return 'FEEN';
            }
            
            if (data.Response) {
                const period = data.Response.period || 'Unknown Period';
                const teamScore = data.Response.entries[0].values.teamScore.basic.value || 'Unknown';
                console.log(`#${requestCount} Game ID: ${fetchedGameId} | Period: ${period} | Score: ${teamScore}`);
                
                if (data.Response.entries) {
                    for (const entry of data.Response.entries) {
                        if (teamScore  === targetScore) {
                            console.log(`Total requests made: ${requestCount}`);
                            return { gameId: fetchedGameId, entry };
                        }
                    }
                }
            }
        }
        
        gameId += REQUESTS_PER_SECOND;
        // await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before next batch
    }
}

findTeamScore(START_GAME_ID, TARGET_SCORE).then(result => {
    if (result) {
        console.log(`Found matching team score in Game ID ${result.gameId}:`, result.entry);
    } else {
        console.log('No matching team score found.');
    }
});
