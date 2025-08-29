import React from 'react';
import { useSocket } from './hooks/useSocket';
import { GameBoard } from './components/GameBoard';
import { WaitingRoom } from './components/WaitingRoom';

function App() {
  const {
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
    startGame,
  } = useSocket();

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Connecting to game server...</div>
      </div>
    );
  }

  const currentPlayer = gameState.players.find(p => p.id === playerId) || null;
  const isHost = playerId === 'host'; // This would be determined by the server
  const canStartGame = isHost || gameState.players.every(p => p.isConnected);

  if (!gameState.gameStarted) {
    return (
      <WaitingRoom
        gameState={gameState}
        onJoinAsPlayer={joinAsPlayer}
        onJoinAsSpectator={joinAsSpectator}
        canStartGame={canStartGame}
        onStartGame={startGame}
      />
    );
  }

  return (
    <GameBoard
      gameState={gameState}
      currentPlayer={currentPlayer}
      onPlayCard={playCard}
      onBet={makeBet}
      onAcceptBet={acceptBet}
      onDenyBet={denyBet}
      onSendMessage={sendMessage}
    />
  );
}

export default App;