import React, { useState } from 'react';
import { GameState, Player } from '../types/game';
import { CardOrderModal } from './CardOrderModal';
import { RulesModal } from './RulesModal';

interface GameControlsProps {
  gameState: GameState;
  currentPlayer: Player | null;
  onBet: (betType: string) => void;
  onAcceptBet: () => void;
  onDenyBet: () => void;
}

export function GameControls({ gameState, currentPlayer, onBet, onAcceptBet, onDenyBet }: GameControlsProps) {
  const [showCardOrder, setShowCardOrder] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const canCallEnvido = gameState.phase === 'truco' && gameState.currentBet.type !== 'truco';
  const isWaitingForBetResponse = gameState.currentBet.type && 
    currentPlayer && 
    gameState.currentBet.waitingFor === gameState.players.findIndex(p => p.id === currentPlayer.id);

  const getAvailableBets = () => {
    const bets = [];
    
    if (canCallEnvido) {
      if (!gameState.currentBet.type) {
        bets.push('envido');
      } else if (gameState.currentBet.type === 'envido') {
        bets.push('envido2', 'real-envido', 'falta-envido');
      }
    }
    
    if (gameState.phase === 'truco') {
      if (!gameState.currentBet.type || gameState.currentBet.type === 'envido') {
        bets.push('truco');
      } else if (gameState.currentBet.type === 'truco') {
        bets.push('retruco');
      } else if (gameState.currentBet.type === 'retruco') {
        bets.push('vale-cuatro');
      }
    }
    
    return bets;
  };

  return (
    <div className="space-y-4">
      {/* Betting Controls */}
      {isWaitingForBetResponse && (
        <div className="text-center p-4 bg-yellow-100 rounded-lg">
          <p className="mb-4 font-semibold">
            Respond to {gameState.currentBet.type} bet ({gameState.currentBet.amount} points)
          </p>
          <div className="flex justify-center gap-4">
            <button className="btn btn-success" onClick={onAcceptBet}>
              Quiero (Accept)
            </button>
            <button className="btn btn-danger" onClick={onDenyBet}>
              No Quiero (Deny)
            </button>
            {getAvailableBets().map(bet => (
              <button key={bet} className="btn btn-primary" onClick={() => onBet(bet)}>
                {bet.replace('-', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Available Bets */}
      {!isWaitingForBetResponse && getAvailableBets().length > 0 && (
        <div className="text-center">
          <p className="mb-2 font-semibold">Available Bets:</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {getAvailableBets().map(bet => (
              <button key={bet} className="btn btn-primary" onClick={() => onBet(bet)}>
                {bet.replace('-', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info Buttons */}
      <div className="flex justify-center gap-4">
        <button className="btn btn-secondary" onClick={() => setShowCardOrder(true)}>
          Card Order
        </button>
        <button className="btn btn-secondary" onClick={() => setShowRules(true)}>
          Rules
        </button>
      </div>

      {/* Modals */}
      {showCardOrder && <CardOrderModal onClose={() => setShowCardOrder(false)} />}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </div>
  );
}