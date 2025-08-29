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

  socket.on('revealEnvido', ({ value }) => {
    const result = gameEngine.revealEnvido(playerId, value);
    if (result.success) {
      io.emit('gameState', gameEngine.getGameState());
    }
  });

  socket.on('fold', () => {
    const result = gameEngine.fold(playerId);
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

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    gameEngine.removePlayer(playerId);
    io.emit('gameState', gameEngine.getGameState());
    connectedClients.delete(socket.id);
  });
});

// Host command to start game
console.log('Truco Game Server');
console.log('================');
console.log('Available commands:');
console.log('  start - Start the game (requires 2 or 4 players)');
console.log('  reset - Reset the game completely');
console.log('  status - Show current game status');
console.log('  help - Show this help message');
console.log('');

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
  } else if (command === 'status') {
    const state = gameEngine.getGameState();
    console.log('Game Status:');
    console.log(`  Players: ${state.players.length}/4`);
    console.log(`  Spectators: ${state.spectators.length}`);
    console.log(`  Game Started: ${state.gameStarted}`);
    console.log(`  Phase: ${state.phase}`);
    console.log(`  Scores: Team 1: ${state.teamScores[0]}, Team 2: ${state.teamScores[1]}`);
  } else if (command === 'help') {
    console.log('Available commands:');
    console.log('  start  - Start the game (requires 2 or 4 players)');
    console.log('  reset  - Reset the game completely');
    console.log('  status - Show current game status');
    console.log('  help   - Show this help message');
  } else if (command.trim() !== '') {
    console.log('Unknown command. Type "help" for available commands.');
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Truco game server running on port ${PORT}`);
  console.log('Type "help" for available commands');
});