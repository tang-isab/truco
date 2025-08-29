import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { GameEngine } from './gameEngine.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const gameEngine = new GameEngine();
const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  const playerId = uuidv4();
  connectedClients.set(socket.id, { playerId, socket });
  
  socket.emit('playerId', playerId);
  socket.emit('gameState', gameEngine.getGameState());

  socket.on('joinAsPlayer', ({ name }) => {
    const success = gameEngine.addPlayer(playerId, name);
    if (success) {
      io.emit('gameState', gameEngine.getGameState());
    }
  });

  socket.on('joinAsSpectator', ({ name }) => {
    gameEngine.addSpectator(playerId, name);
    io.emit('gameState', gameEngine.getGameState());
  });

  socket.on('playCard', ({ cardIndex }) => {
    const result = gameEngine.playCard(playerId, cardIndex);
    if (result.success) {
      io.emit('gameState', gameEngine.getGameState());
    }
  });

  socket.on('makeBet', ({ betType }) => {
    const result = gameEngine.makeBet(playerId, betType);
    if (result.success) {
      io.emit('gameState', gameEngine.getGameState());
    }
  });

  socket.on('acceptBet', () => {
    const result = gameEngine.acceptBet(playerId);
    if (result.success) {
      io.emit('gameState', gameEngine.getGameState());
    }
  });

  socket.on('denyBet', () => {
    const result = gameEngine.denyBet(playerId);
    if (result.success) {
      io.emit('gameState', gameEngine.getGameState());
    }
  });

  socket.on('chatMessage', ({ message }) => {
    const player = gameEngine.getPlayerById(playerId) || gameEngine.getSpectatorById(playerId);
    if (player) {
      const chatMessage = {
        id: uuidv4(),
        playerId,
        playerName: player.name,
        message,
        timestamp: Date.now()
      };
      io.emit('chatMessage', chatMessage);
    }
  });

  socket.on('startGame', () => {
    // Only allow host or unanimous agreement to start
    const result = gameEngine.startGame(playerId);
    if (result.success) {
      io.emit('gameState', gameEngine.getGameState());
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    gameEngine.removePlayer(playerId);
    connectedClients.delete(socket.id);
    io.emit('gameState', gameEngine.getGameState());
  });
});

// Host command to start game
process.stdin.on('data', (data) => {
  const command = data.toString().trim();
  if (command === 'start') {
    const result = gameEngine.forceStartGame();
    if (result.success) {
      console.log('Game started by host');
      io.emit('gameState', gameEngine.getGameState());
    } else {
      console.log('Cannot start game:', result.error);
    }
  } else if (command === 'reset') {
    gameEngine.resetGame();
    console.log('Game reset');
    io.emit('gameState', gameEngine.getGameState());
  } else if (command === 'help') {
    console.log('Available commands:');
    console.log('  start - Force start the game');
    console.log('  reset - Reset the game');
    console.log('  help  - Show this help');
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Truco game server running on port ${PORT}`);
  console.log('Type "help" for available commands');
});