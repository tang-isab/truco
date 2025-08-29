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
  onFold: () => void;
}

export function GameControls({ gameState, currentPlayer, onBet, onAcceptBet, onDenyBet, onFold }: GameControlsProps) {
  const [showCardOrder, setShowCardOrder] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const canCallEnvido = gameState.phase === 'truco' && 
    gameState.currentBet.type !== 'truco' && 
    gameState.currentTrick.length === 0 && 
    gameState.currentRound === 1;
    
  const isWaitingForBetResponse = gameState.currentBet.type && 
    currentPlayer && 
    gameState.currentBet.waitingFor === gameState.players.findIndex(p => p.id === currentPlayer.id);
    
  const currentPlayerIndex = currentPlayer ? gameState.players.findIndex(p => p.id === currentPlayer.id) : -1;
  const isCurrentPlayerTurn = currentPlayerIndex === gameState.currentPlayer;

  const getAvailableBets = () => {
    const bets = [];
    
    // Check if there's a pending bet - if so, only the waiting player can bet
    if (gameState.currentBet.type && gameState.currentBet.waitingFor !== -1) {
      if (gameState.currentBet.waitingFor !== currentPlayerIndex) {
        return []; // Not your turn to respond
      }
      // Player can respond - handled in getResponseBets
      return [];
    }
    
    // No pending bet - check available initial bets
    if (canCallEnvido && !gameState.currentBet.type) {
      // Envido bets - only if not already used
      if (!gameState.betsUsedThisRound?.includes('envido')) {
        bets.push('envido');
      }
    }
    
    // Truco bets - only on current player's turn
    if (gameState.phase === 'truco' && isCurrentPlayerTurn && !gameState.currentBet.type) {
      if (!gameState.betsUsedThisRound?.includes('truco')) {
        bets.push('truco');
      }
    }
    
    return bets;
  };

  const getResponseBets = () => {
    if (!gameState.currentBet.type) return [];
    
    const bets = [];
    if (gameState.currentBet.type === 'envido') {
      // Second envido - only if first envido was called and second not used
      if (gameState.betsUsedThisRound?.includes('envido') && !gameState.betsUsedThisRound?.includes('envido2')) {
        bets.push('envido2');
      }
      // Real envido - only if not already used
      if (!gameState.betsUsedThisRound?.includes('real-envido')) {
        bets.push('real-envido');
      }
      
      // Calculate if falta-envido is available and not used
      if (!gameState.betsUsedThisRound?.includes('falta-envido')) {
        const opposingTeam = currentPlayer?.team === 0 ? 1 : 0;
        const opposingScore = gameState.teamScores[opposingTeam];
        const faltaPoints = opposingScore < 15 ? 15 - opposingScore : 30 - opposingScore;
        
        if (gameState.currentBet.amount < faltaPoints) {
          bets.push('falta-envido');
        }
      }
    } else if (gameState.currentBet.type === 'truco') {
      if (gameState.currentBet.amount === 2 && !gameState.betsUsedThisRound?.includes('retruco')) {
        bets.push('retruco');
      } else if (gameState.currentBet.amount === 3 && !gameState.betsUsedThisRound?.includes('vale-cuatro')) {
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
            Respond to {gameState.currentBet.type?.toUpperCase()} bet ({gameState.currentBet.amount} points)
          </p>
          <div className="flex justify-center gap-4">
            <button className="btn btn-success" onClick={onAcceptBet}>
              Quiero (Accept)
            </button>
            <button className="btn btn-danger" onClick={onDenyBet}>
              No Quiero (Deny)
            </button>
            {getResponseBets().map(bet => (
              <button key={bet} className="btn btn-primary" onClick={() => onBet(bet)}>
                {bet === 'envido2' ? 'ENVIDO' : bet.replace('-', ' ').toUpperCase()}
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
                {bet.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fold Button */}
      {gameState.canFold && currentPlayer && (
        <div className="text-center">
          <button className="btn btn-danger" onClick={onFold}>
            Fold Team
          </button>
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