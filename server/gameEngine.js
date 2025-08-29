import { v4 as uuidv4 } from 'uuid';

export class GameEngine {
  constructor() {
    this.gameState = {
      phase: 'waiting',
      players: [],
      spectators: [],
      currentTrick: [],
      currentPlayer: 0,
      dealer: 0,
      mono: 0,
      teamScores: [0, 0],
      tricksWon: [0, 0],
      currentBet: {
        type: null,
        amount: 0,
        caller: -1,
        waitingFor: -1,
      },
      gameStarted: false,
      gameEnded: false,
      winner: null,
    };
  }

  getGameState() {
    return { ...this.gameState };
  }

  addPlayer(playerId, name) {
    if (this.gameState.players.length >= 4 || this.gameState.gameStarted) {
      return { success: false, error: 'Game full or already started' };
    }

    const player = {
      id: playerId,
      name,
      cards: [],
      team: this.gameState.players.length % 2, // Alternate teams
      isConnected: true,
    };

    this.gameState.players.push(player);
    return { success: true };
  }

  addSpectator(playerId, name) {
    const spectator = { id: playerId, name };
    this.gameState.spectators.push(spectator);
    return { success: true };
  }

  removePlayer(playerId) {
    this.gameState.players = this.gameState.players.filter(p => p.id !== playerId);
    this.gameState.spectators = this.gameState.spectators.filter(s => s.id !== playerId);
  }

  getPlayerById(playerId) {
    return this.gameState.players.find(p => p.id === playerId);
  }

  getSpectatorById(playerId) {
    return this.gameState.spectators.find(s => s.id === playerId);
  }

  startGame(playerId) {
    if (this.gameState.players.length < 2) {
      return { success: false, error: 'Need at least 2 players' };
    }

    // Check if all players agree or if it's a force start
    const allPlayersReady = this.gameState.players.every(p => p.isConnected);
    if (!allPlayersReady && playerId !== 'host') {
      return { success: false, error: 'Not all players ready' };
    }

    this.initializeGame();
    return { success: true };
  }

  forceStartGame() {
    if (this.gameState.players.length < 2) {
      return { success: false, error: 'Need at least 2 players' };
    }

    this.initializeGame();
    return { success: true };
  }

  initializeGame() {
    // Set random dealer
    this.gameState.dealer = Math.floor(Math.random() * this.gameState.players.length);
    this.gameState.mono = (this.gameState.dealer + 1) % this.gameState.players.length;
    this.gameState.currentPlayer = this.gameState.mono;
    this.gameState.phase = 'truco';
    this.gameState.gameStarted = true;

    this.dealCards();
  }

  dealCards() {
    const deck = this.createDeck();
    
    // Deal 3 cards to each player
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < this.gameState.players.length; j++) {
        this.gameState.players[j].cards.push(deck.pop());
      }
    }
  }

  createDeck() {
    const suits = ['club', 'coin', 'cup', 'sword'];
    const values = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
    
    const deck = [];
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ value, suit });
      }
    }
    
    return this.shuffleDeck(deck);
  }

  shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  playCard(playerId, cardIndex) {
    const playerIndex = this.gameState.players.findIndex(p => p.id === playerId);
    if (playerIndex !== this.gameState.currentPlayer) {
      return { success: false, error: 'Not your turn' };
    }

    const player = this.gameState.players[playerIndex];
    if (cardIndex >= player.cards.length) {
      return { success: false, error: 'Invalid card' };
    }

    const card = player.cards.splice(cardIndex, 1)[0];
    this.gameState.currentTrick.push(card);
    
    // Move to next player
    this.gameState.currentPlayer = (this.gameState.currentPlayer + 1) % this.gameState.players.length;
    
    // Check if trick is complete
    if (this.gameState.currentTrick.length === this.gameState.players.length) {
      this.resolveTrick();
    }

    return { success: true };
  }

  resolveTrick() {
    // Determine trick winner based on card strength
    let winnerIndex = 0;
    let highestStrength = this.getCardStrength(this.gameState.currentTrick[0]);
    
    for (let i = 1; i < this.gameState.currentTrick.length; i++) {
      const strength = this.getCardStrength(this.gameState.currentTrick[i]);
      if (strength < highestStrength) { // Lower index = higher strength
        highestStrength = strength;
        winnerIndex = i;
      }
    }

    const winnerTeam = this.gameState.players[winnerIndex].team;
    this.gameState.tricksWon[winnerTeam]++;
    
    // Clear trick
    this.gameState.currentTrick = [];
    
    // Check if round is over
    if (this.gameState.tricksWon[0] >= 2 || this.gameState.tricksWon[1] >= 2) {
      this.endRound();
    } else {
      // Start next trick with winner
      this.gameState.currentPlayer = winnerIndex;
    }
  }

  getCardStrength(card) {
    const cardOrder = [
      { value: 1, suit: 'sword' },
      { value: 1, suit: 'club' },
      { value: 7, suit: 'sword' },
      { value: 7, suit: 'coin' },
      { value: 3, suit: 'sword' },
      { value: 3, suit: 'club' },
      { value: 3, suit: 'coin' },
      { value: 3, suit: 'cup' },
      { value: 2, suit: 'sword' },
      { value: 2, suit: 'club' },
      { value: 2, suit: 'coin' },
      { value: 2, suit: 'cup' },
      { value: 1, suit: 'coin' },
      { value: 1, suit: 'cup' },
      { value: 12, suit: 'sword' },
      { value: 12, suit: 'club' },
      { value: 12, suit: 'coin' },
      { value: 12, suit: 'cup' },
      { value: 11, suit: 'sword' },
      { value: 11, suit: 'club' },
      { value: 11, suit: 'coin' },
      { value: 11, suit: 'cup' },
      { value: 10, suit: 'sword' },
      { value: 10, suit: 'club' },
      { value: 10, suit: 'coin' },
      { value: 10, suit: 'cup' },
      { value: 7, suit: 'cup' },
      { value: 6, suit: 'sword' },
      { value: 6, suit: 'club' },
      { value: 6, suit: 'coin' },
      { value: 6, suit: 'cup' },
      { value: 5, suit: 'sword' },
      { value: 5, suit: 'club' },
      { value: 5, suit: 'coin' },
      { value: 5, suit: 'cup' },
      { value: 4, suit: 'sword' },
      { value: 4, suit: 'club' },
      { value: 4, suit: 'coin' },
      { value: 4, suit: 'cup' },
    ];

    return cardOrder.findIndex(c => c.value === card.value && c.suit === card.suit);
  }

  endRound() {
    const winningTeam = this.gameState.tricksWon[0] > this.gameState.tricksWon[1] ? 0 : 1;
    const points = this.gameState.currentBet.amount || 1;
    
    this.gameState.teamScores[winningTeam] += points;
    
    // Check for game end
    if (this.gameState.teamScores[winningTeam] >= 30) {
      this.gameState.gameEnded = true;
      this.gameState.winner = winningTeam;
    } else {
      this.startNewRound();
    }
  }

  startNewRound() {
    // Reset for new round
    this.gameState.tricksWon = [0, 0];
    this.gameState.currentTrick = [];
    this.gameState.currentBet = { type: null, amount: 0, caller: -1, waitingFor: -1 };
    this.gameState.phase = 'truco';
    
    // Move dealer
    this.gameState.dealer = (this.gameState.dealer + 1) % this.gameState.players.length;
    this.gameState.mono = (this.gameState.dealer + 1) % this.gameState.players.length;
    this.gameState.currentPlayer = this.gameState.mono;
    
    // Clear and deal new cards
    this.gameState.players.forEach(player => player.cards = []);
    this.dealCards();
  }

  makeBet(playerId, betType) {
    const playerIndex = this.gameState.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) {
      return { success: false, error: 'Player not found' };
    }

    const betAmounts = {
      'envido': 2,
      'envido2': 2,
      'real-envido': 3,
      'falta-envido': this.calculateFaltaEnvido(),
      'truco': 2,
      'retruco': 3,
      'vale-cuatro': 4,
    };

    if (betType.includes('envido')) {
      this.gameState.phase = 'envido';
    }

    this.gameState.currentBet = {
      type: betType.includes('envido') ? 'envido' : 'truco',
      amount: (this.gameState.currentBet.amount || 0) + betAmounts[betType],
      caller: playerIndex,
      waitingFor: (playerIndex + 2) % this.gameState.players.length, // Opposite team
    };

    return { success: true };
  }

  calculateFaltaEnvido() {
    // Calculate points needed for opposing team to reach 15 or 30
    const opposingTeam = (this.gameState.currentBet.caller + 1) % 2;
    const currentScore = this.gameState.teamScores[opposingTeam];
    
    if (currentScore < 15) {
      return 15 - currentScore;
    } else {
      return 30 - currentScore;
    }
  }

  acceptBet(playerId) {
    const playerIndex = this.gameState.players.findIndex(p => p.id === playerId);
    if (playerIndex !== this.gameState.currentBet.waitingFor) {
      return { success: false, error: 'Not waiting for your response' };
    }

    // Bet accepted, continue game
    this.gameState.currentBet.waitingFor = -1;
    
    if (this.gameState.currentBet.type === 'envido') {
      this.resolveEnvido();
    }

    return { success: true };
  }

  denyBet(playerId) {
    const playerIndex = this.gameState.players.findIndex(p => p.id === playerId);
    if (playerIndex !== this.gameState.currentBet.waitingFor) {
      return { success: false, error: 'Not waiting for your response' };
    }

    // Award points to calling team
    const callerTeam = this.gameState.players[this.gameState.currentBet.caller].team;
    this.gameState.teamScores[callerTeam] += this.gameState.currentBet.amount;
    
    // Reset bet
    this.gameState.currentBet = { type: null, amount: 0, caller: -1, waitingFor: -1 };
    this.gameState.phase = 'truco';

    return { success: true };
  }

  resolveEnvido() {
    // Calculate envido values for each team
    const team0Values = [];
    const team1Values = [];
    
    this.gameState.players.forEach(player => {
      const envidoValue = this.calculateEnvidoValue(player.cards);
      if (player.team === 0) {
        team0Values.push(envidoValue);
      } else {
        team1Values.push(envidoValue);
      }
    });

    const team0Max = Math.max(...team0Values);
    const team1Max = Math.max(...team1Values);
    
    let winningTeam;
    if (team0Max > team1Max) {
      winningTeam = 0;
    } else if (team1Max > team0Max) {
      winningTeam = 1;
    } else {
      // Tie goes to mono's team
      winningTeam = this.gameState.players[this.gameState.mono].team;
    }

    this.gameState.teamScores[winningTeam] += this.gameState.currentBet.amount;
    this.gameState.currentBet = { type: null, amount: 0, caller: -1, waitingFor: -1 };
    this.gameState.phase = 'truco';
  }

  calculateEnvidoValue(cards) {
    const suits = ['club', 'coin', 'cup', 'sword'];
    let maxValue = 0;
    
    // Check for pairs in each suit
    for (const suit of suits) {
      const suitCards = cards.filter(card => card.suit === suit);
      if (suitCards.length >= 2) {
        const cardValues = suitCards.map(card => card.value > 10 ? 0 : card.value);
        const sum = cardValues.reduce((a, b) => a + b, 0);
        maxValue = Math.max(maxValue, 20 + sum);
      }
    }
    
    // If no pairs, return highest single card value
    if (maxValue === 0) {
      const cardValues = cards.map(card => card.value > 10 ? 0 : card.value);
      maxValue = Math.max(...cardValues);
    }
    
    return maxValue;
  }

  resetGame() {
    this.gameState = {
      phase: 'waiting',
      players: [],
      spectators: [],
      currentTrick: [],
      currentPlayer: 0,
      dealer: 0,
      mono: 0,
      teamScores: [0, 0],
      tricksWon: [0, 0],
      currentBet: {
        type: null,
        amount: 0,
        caller: -1,
        waitingFor: -1,
      },
      gameStarted: false,
      gameEnded: false,
      winner: null,
    };
  }
}