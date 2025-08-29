export interface Card {
  value: number;
  suit: 'club' | 'coin' | 'cup' | 'sword';
}

export interface Player {
  id: string;
  name: string;
  cards: Card[];
  team: number;
  isConnected: boolean;
}

export interface GameState {
  phase: 'waiting' | 'envido' | 'truco';
  players: Player[];
  spectators: { id: string; name: string }[];
  currentTrick: Card[];
  currentPlayer: number;
  dealer: number;
  mono: number;
  teamScores: [number, number];
  tricksWon: [number, number];
  currentBet: {
    type: 'envido' | 'truco' | null;
    amount: number;
    caller: number;
    waitingFor: number;
  };
  gameStarted: boolean;
  gameEnded: boolean;
  winner: number | null;
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
}

export type BetType = 'envido' | 'envido2' | 'real-envido' | 'falta-envido' | 'truco' | 'retruco' | 'vale-cuatro';

export interface GameAction {
  type: 'join' | 'spectate' | 'play-card' | 'bet' | 'accept-bet' | 'deny-bet' | 'chat' | 'start-game';
  playerId: string;
  data?: any;
}