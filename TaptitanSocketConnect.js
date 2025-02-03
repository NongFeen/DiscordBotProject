const { io } = require('socket.io-client');

// Define server URL and options
const SERVER_URL = 'https://tt2-public.gamehivegames.com/api';

// Define the API key
const API_KEY = '71e8e898-4888-4f95-8845-40a3bf368abd'; // Replace with your actual API key

// Connect to the Socket.IO server
const socket = io(SERVER_URL, {
  transports: ['websocket'], // Use WebSocket transport
  extraHeaders: {
    'API-Authenticate': API_KEY, // Include the API key in the headers
  },
});

// Define the payload for the 'player/data' event
const payload = {
  player_token: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  properties: ['max_stage'],
};

// Handle connection success
socket.on('connect', () => {
  console.log('Connected to the server');

  // Emit the 'player/data' event with the payload
  socket.emit('player/data', payload, (response) => {
    console.log('Response from server:', response);

    // Disconnect after receiving the response
    socket.disconnect();
  });
});

// Handle authentication or connection errors
socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
  if (error.response && error.response.data) {
    console.error('Error details:', error.response.data);
  }
});

// Handle disconnection
socket.on('disconnect', (reason) => {
  console.log('Disconnected from the server:', reason);
});
