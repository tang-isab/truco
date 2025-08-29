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
    revealEnvido,
    fold,
  } = useSocket();

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Connecting to game server...</div>
      </div>
    );
  }

  const currentPlayer = gameState.players.find(p => p.id === playerId) || null;

  if (!gameState.gameStarted) {
    return (
      <WaitingRoom
        gameState={gameState}
        onJoinAsPlayer={joinAsPlayer}
        onJoinAsSpectator={joinAsSpectator}
        messages={messages}
        onSendMessage={sendMessage}
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
      onRevealEnvido={revealEnvido}
      onFold={fold}
    />
  );
}

export default App;