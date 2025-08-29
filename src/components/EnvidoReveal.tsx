import React from 'react';
import { GameState, Player } from '../types/game';
import { calculateEnvidoValue } from '../utils/cardUtils';

interface EnvidoRevealProps {
  gameState: GameState;
  currentPlayer: Player | null;
  onRevealEnvido: (value: number) => void;
}

export function EnvidoReveal({ gameState, currentPlayer, onRevealEnvido }: EnvidoRevealProps) {
  const currentPlayerIndex = currentPlayer ? gameState.players.findIndex(p => p.id === currentPlayer.id) : -1;
  const isCurrentPlayerTurn = currentPlayerIndex === gameState.currentPlayer;
  
  const myEnvidoValue = currentPlayer ? calculateEnvidoValue(currentPlayer.cards) : 0;

  return (
    <div className="text-center mb-8 p-6 bg-yellow-50 rounded-lg border-2 border-yellow-300">
      <h3 className="text-xl font-bold mb-4">Envido Reveal Phase</h3>
      
      {/* Show revealed values */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Revealed Values:</h4>
        <div className="grid grid-cols-2 gap-4">
          {gameState.envidoValues?.map((ev, index) => {
            const player = gameState.players.find(p => p.id === ev.playerId);
            return (
              <div key={ev.playerId} className={`p-3 rounded-lg ${player?.team === 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
                <div className="font-semibold">{player?.name}</div>
                <div className="text-lg">
                  {ev.revealed ? `${ev.value} points` : 'Passed'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current player's turn */}
      {isCurrentPlayerTurn && (
        <div className="space-y-4">
          <p className="font-semibold">Your turn to reveal or pass</p>
          <p className="text-sm text-gray-600">Your envido value: {myEnvidoValue}</p>
          <div className="flex justify-center gap-4">
            <button 
              className="btn btn-success"
              onClick={() => onRevealEnvido(myEnvidoValue)}
            >
              Reveal ({myEnvidoValue})
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => onRevealEnvido(0)}
            >
              Pass
            </button>
          </div>
        </div>
      )}

      {!isCurrentPlayerTurn && (
        <p className="text-gray-600">
          Waiting for {gameState.players[gameState.currentPlayer]?.name} to reveal or pass...
        </p>
      )}
    </div>
  );
}