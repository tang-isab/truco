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
  phase: 'waiting' | 'envido' | 'truco' | 'envido-reveal';
  players: Player[];
  spectators: { id: string; name: string }[];
  currentTrick: Card[];
  currentPlayer: number;
  dealer: number;
  mono: number;
  teamScores: [number, number];
  tricksWon: [number, number];
  currentRound: number;
  envidoValues?: { playerId: string; value: number; revealed: boolean }[];
  currentBet: {
    type: 'envido' | 'truco' | null;
    amount: number;
    caller: number;
    waitingFor: number;
  };
  gameStarted: boolean;
  gameEnded: boolean;
  winner: number | null;
  canFold: boolean;
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