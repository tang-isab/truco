import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, ChatMessage } from '../types/game';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('gameState', (state: GameState) => {
      setGameState(state);
    });

    newSocket.on('chatMessage', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('playerId', (id: string) => {
      setPlayerId(id);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const joinAsPlayer = (name: string) => {
    socket?.emit('joinAsPlayer', { name });
  };

  const joinAsSpectator = (name: string) => {
    socket?.emit('joinAsSpectator', { name });
  };

  const playCard = (cardIndex: number) => {
    socket?.emit('playCard', { cardIndex });
  };

  const makeBet = (betType: string) => {
    socket?.emit('makeBet', { betType });
  };

  const acceptBet = () => {
    socket?.emit('acceptBet');
  };

  const denyBet = () => {
    socket?.emit('denyBet');
  };

  const sendMessage = (message: string) => {
    socket?.emit('chatMessage', { message });
  };

  const revealEnvido = (value: number) => {
    socket?.emit('revealEnvido', { value });
  };

  const fold = () => {
    socket?.emit('fold');
  };

  return {
    gameState,
    messages,
    playerId,
    joinAsPlayer,
    joinAsSpectator,
    playCard,
    makeBet,
    acceptBet,
    denyBet,
    sendMessage,
    revealEnvido,
    fold,
  };
}