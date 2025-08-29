import React, { useState } from 'react';
import { GameState, ChatMessage } from '../types/game';

interface WaitingRoomProps {
  gameState: GameState;
  onJoinAsPlayer: (name: string) => void;
  onJoinAsSpectator: (name: string) => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onVoteToStart: () => void;
  playerId: string | null;
}

export function WaitingRoom({ gameState, onJoinAsPlayer, onJoinAsSpectator, messages, onSendMessage, onVoteToStart, playerId }: WaitingRoomProps) {
  const [name, setName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  
  // Import Chat component
  const Chat = React.lazy(() => import('./Chat').then(module => ({ default: module.Chat })));

  const currentPlayer = gameState.players.find(p => p.id === playerId);
  const hasVoted = gameState.startVotes?.includes(playerId || '') || false;
  const totalVotes = gameState.startVotes?.length || 0;
  const requiredVotes = gameState.players.length;

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
      <div className="max-w-6xl w-full">
        <h1 className="text-4xl font-bold mb-8">Truco Game</h1>
        
        {!hasJoined ? (
          <div className="game-area max-w-2xl mx-auto p-8 text-center space-y-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 game-area p-8 text-center space-y-6">
            <h2 className="text-2xl font-semibold">Waiting for Game to Start...</h2>
            
            {/* Start Game Section */}
            {currentPlayer && gameState.players.length >= 2 && (
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Ready to Start?</h3>
                <p className="text-gray-600 mb-4">
                  All players must vote to start the game ({totalVotes}/{requiredVotes} votes)
                </p>
                
                <button 
                  className={`btn text-lg px-8 py-3 ${hasVoted ? 'btn-success' : 'btn-primary'}`}
                  onClick={onVoteToStart}
                  disabled={hasVoted}
                >
                  {hasVoted ? '✓ Voted to Start' : 'Vote to Start Game'}
                </button>
                
                {totalVotes > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Players who voted:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {gameState.players.map((player) => (
                        <span 
                          key={player.id}
                          className={`px-3 py-1 rounded-full text-sm ${
                            gameState.startVotes?.includes(player.id) 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {player.name} {gameState.startVotes?.includes(player.id) ? '✓' : '○'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Players ({gameState.players.length}/4)</h3>
                <div className="space-y-2">
                  {gameState.players.map((player, index) => (
                    <div key={player.id} className={`p-3 rounded-lg ${player.team === 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
                      <div className="font-semibold">{player.name}</div>
                      <div className="text-sm">Team {player.team + 1}</div>
                      {index === 0 && <div className="text-xs text-gray-500">Will be Dealer</div>}
                      {!player.isConnected && <div className="text-xs text-red-500">Disconnected</div>}
                    </div>
                  ))}
                  {gameState.players.length < 4 && Array.from({ length: 4 - gameState.players.length }).map((_, index) => (
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
            
            {gameState.players.length < 2 && (
              <p className="text-gray-600">Need at least 2 players to start</p>
            )}
            </div>
            
            {/* Chat in waiting room */}
            <div className="lg:col-span-1">
              <React.Suspense fallback={<div>Loading chat...</div>}>
                <Chat messages={messages} onSendMessage={onSendMessage} />
              </React.Suspense>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}