import React, { useState } from 'react';
import { GameState } from '../types/game';

interface WaitingRoomProps {
  gameState: GameState;
  onJoinAsPlayer: (name: string) => void;
  onJoinAsSpectator: (name: string) => void;
  canStartGame: boolean;
  onStartGame: () => void;
}

export function WaitingRoom({ gameState, onJoinAsPlayer, onJoinAsSpectator, canStartGame, onStartGame }: WaitingRoomProps) {
  const [name, setName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoinAsPlayer = () => {
    if (name.trim()) {
      onJoinAsPlayer(name.trim());
      setHasJoined(true);
    }
  };

  const handleJoinAsSpectator = () => {
    if (name.trim()) {
      onJoinAsSpectator(name.trim());
      setHasJoined(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="game-area max-w-2xl w-full p-8 text-center">
        <h1 className="text-4xl font-bold mb-8">Truco Game</h1>
        
        {!hasJoined ? (
          <div className="space-y-6">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="input text-center text-lg"
                maxLength={20}
              />
            </div>
            
            <div className="flex justify-center gap-4">
              <button 
                className="btn btn-primary text-lg px-8 py-3"
                onClick={handleJoinAsPlayer}
                disabled={!name.trim() || gameState.players.length >= 4}
              >
                Join as Player
              </button>
              <button 
                className="btn btn-secondary text-lg px-8 py-3"
                onClick={handleJoinAsSpectator}
                disabled={!name.trim()}
              >
                Watch Game
              </button>
            </div>
            
            {gameState.players.length >= 4 && (
              <p className="text-red-600 font-semibold">
                Game is full! You can only join as a spectator.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Waiting for Game to Start...</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Players ({gameState.players.length}/4)</h3>
                <div className="space-y-2">
                  {gameState.players.map((player, index) => (
                    <div key={player.id} className={`p-3 rounded-lg ${player.team === 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
                      {player.name} (Team {player.team + 1})
                    </div>
                  ))}
                  {Array.from({ length: 4 - gameState.players.length }).map((_, index) => (
                    <div key={index} className="p-3 rounded-lg bg-gray-100 text-gray-500">
                      Waiting for player...
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Spectators ({gameState.spectators.length})</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {gameState.spectators.map((spectator) => (
                    <div key={spectator.id} className="p-2 rounded bg-gray-100">
                      {spectator.name}
                    </div>
                  ))}
                  {gameState.spectators.length === 0 && (
                    <p className="text-gray-500">No spectators</p>
                  )}
                </div>
              </div>
            </div>
            
            {canStartGame && gameState.players.length >= 2 && (
              <button className="btn btn-success text-lg px-8 py-3" onClick={onStartGame}>
                Start Game
              </button>
            )}
            
            {gameState.players.length < 2 && (
              <p className="text-gray-600">Need at least 2 players to start</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}