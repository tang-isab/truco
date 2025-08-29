import React from 'react';
import { GameState, Player, ChatMessage } from '../types/game';
import { Card } from './Card';
import { GameControls } from './GameControls';
import { Chat } from './Chat';
import { EnvidoReveal } from './EnvidoReveal';

interface GameBoardProps {
  gameState: GameState;
  currentPlayer: Player | null;
  onPlayCard: (cardIndex: number) => void;
  onBet: (betType: string) => void;
  onAcceptBet: () => void;
  onDenyBet: () => void;
  onSendMessage: (message: string) => void;
  onRevealEnvido: (value: number) => void;
  onFold: () => void;
  messages: ChatMessage[];
}

export function GameBoard({ 
  gameState, 
  currentPlayer, 
  onPlayCard, 
  onBet, 
  onAcceptBet, 
  onDenyBet,
  onSendMessage,
  onRevealEnvido,
  onFold,
  messages
}: GameBoardProps) {
  const isCurrentPlayerTurn = currentPlayer && gameState.currentPlayer === gameState.players.findIndex(p => p.id === currentPlayer.id);
  const currentPlayerIndex = currentPlayer ? gameState.players.findIndex(p => p.id === currentPlayer.id) : -1;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Truco</h1>
          <div className="text-xl text-white mb-4">
            Phase: <span className="font-semibold capitalize">{gameState.phase}</span>
            {gameState.currentRound > 0 && (
              <span className="ml-4">Round: {gameState.currentRound}</span>
            )}
          </div>
          <div className="flex justify-center gap-8 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">{gameState.teamScores[0]}</div>
              <div className="text-sm">Team 1</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{gameState.teamScores[1]}</div>
              <div className="text-sm">Team 2</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Area */}
          <div className="lg:col-span-3">
            <div className="game-area p-6">
              {/* Envido Reveal Phase */}
              {gameState.phase === 'envido-reveal' && (
                <EnvidoReveal
                  gameState={gameState}
                  currentPlayer={currentPlayer}
                  onRevealEnvido={onRevealEnvido}
                />
              )}

              {/* Center Cards */}
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold mb-4">Cards Played</h3>
                <div className="flex justify-center gap-6 items-center">
                  {gameState.currentTrick.map((card, index) => (
                    <Card key={index} card={card} />
                  ))}
                  {Array.from({ length: 4 - gameState.currentTrick.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="card border-2 border-dashed border-gray-300" />
                  ))}
                </div>
              </div>

              {/* Players */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                {gameState.players.map((player, index) => (
                  <div key={player.id} className="text-center">
                    <div className={`p-4 rounded-lg ${player.team === 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
                      <h4 className="font-semibold mb-2">
                        {player.name} {index === gameState.dealer && '(Dealer)'} {index === gameState.mono && '(Mono)'}
                      </h4>
                      <div className="flex justify-center gap-3 items-center">
                        {player.id === currentPlayer?.id ? (
                          player.cards.map((card, cardIndex) => (
                            <Card 
                              key={cardIndex} 
                              card={card} 
                              onClick={() => isCurrentPlayerTurn && onPlayCard(cardIndex)}
                              className={isCurrentPlayerTurn ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                            />
                          ))
                        ) : (
                          Array.from({ length: player.cards.length }).map((_, cardIndex) => (
                            <Card key={cardIndex} isBack />
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Player Info */}
              {currentPlayer && (
                <div className="text-center mb-6">
                  <div className="bg-white/90 rounded-lg p-4 inline-block">
                    <h3 className="font-semibold mb-2">You are: {currentPlayer.name}</h3>
                    <p className="text-sm text-gray-600">Team {currentPlayer.team + 1}</p>
                    {isCurrentPlayerTurn && gameState.phase === 'truco' && (
                      <p className="text-green-600 font-semibold mt-2">Your turn to play a card!</p>
                    )}
                  </div>
                </div>
              )}

              {/* Game Controls */}
              <GameControls
                gameState={gameState}
                currentPlayer={currentPlayer}
                onBet={onBet}
                onAcceptBet={onAcceptBet}
                onDenyBet={onDenyBet}
                onFold={onFold}
              />
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-1">
            <Chat messages={messages} onSendMessage={onSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}