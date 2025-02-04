const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();
const axios = require('axios'); 

const API_KEY = process.env.XAPIkey_ID; 
let START_GAME_ID_FORWARD = 15853247284; //15853247284
let START_GAME_ID_BACKWARD = 15851395725; 
const TARGET_SCORE = 304788; 
const SEARCH_RANGE = 50; 

async function fetchGameData(gameId, direction) {
    const url = `https://www.bungie.net/Platform/Destiny2/Stats/PostGameCarnageReport/${gameId}`;
    try {
        const response = await axios.get(url, {
            headers: { 'X-API-Key': API_KEY }
        });
        return { gameId, data: response.data, direction };
    } catch (error) {
        if (error.response) {
            console.error(`Error: Received status ${error.response.status} for Game ID ${gameId} (${direction})`);
            if (error.response.status === 429) {
                console.log('Rate limit reached, waiting before retrying...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } else {
            console.error(`Request error for Game ID ${gameId} (${direction}):`, error.message);
        }
        return { gameId, data: null, direction };
    }
}

async function findTeamScore(startForward, startBackward, targetScore) {
    let gameIdForward = startForward;
    let gameIdBackward = startBackward;
    let requestCount = 0;

    while (true) {
        const requests = [];

        // Search forward (+SEARCH_RANGE)
        for (let i = 1; i <= SEARCH_RANGE; i++) {
            requests.push(fetchGameData(gameIdForward + i, "Forward"));
        }

        // Search backward (-SEARCH_RANGE)
        for (let i = 1; i <= SEARCH_RANGE; i++) {
            if (gameIdBackward - i > 0) { 
                requests.push(fetchGameData(gameIdBackward - i, "Backward"));
            }
        }

        const results = await Promise.all(requests);
        for (const { gameId: fetchedGameId, data, direction } of results) {
            requestCount++;

            if (!data) continue;
            if (data.ErrorCode === 2102) {
                console.error('Error: API key is missing. Please provide a valid X-API-Key.');
                return 'FEEN';
            }

            if (data.Response) {
                const period = data.Response.period || 'Unknown Period';
                const teamScore = data.Response.entries?.[0]?.values?.teamScore?.basic?.value || 'Unknown';
                console.log(`#${requestCount} Game ID: ${fetchedGameId} (${direction}) | Period: ${period} | Score: ${teamScore}`);

                if (teamScore === targetScore) {
                    console.log(`Total requests made: ${requestCount}`);
                    return { gameId: fetchedGameId, data };
                }
            }
        }

        // Move to next cycle
        gameIdForward += SEARCH_RANGE;
        gameIdBackward -= SEARCH_RANGE;
        if (gameIdBackward < 0) gameIdBackward = 0; // Prevent negative IDs
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before next batch
    }
}

// Start the search with custom start IDs
findTeamScore(START_GAME_ID_FORWARD, START_GAME_ID_BACKWARD, TARGET_SCORE).then(result => {
    if (result) {
        console.log(`Found matching team score in Game ID ${result.gameId}:`, result.data);
    } else {
        console.log('No matching team score found.');
    }
});
