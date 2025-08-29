import React from 'react';
import { Player } from '../types/game';
import { Card } from './Card';

interface PlayerHandProps {
  player: Player;
  isCurrentTurn: boolean;
  onPlayCard: (cardIndex: number) => void;
}

export function PlayerHand({ player, isCurrentTurn, onPlayCard }: PlayerHandProps) {
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-4">Your Hand</h3>
      <div className="flex justify-center gap-4">
        {player.cards.map((card, index) => (
          <Card
            key={index}
            card={card}
            onClick={() => isCurrentTurn && onPlayCard(index)}
            className={`${isCurrentTurn ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}`}
          />
        ))}
      </div>
      {isCurrentTurn && (
        <p className="text-green-600 font-semibold mt-2">Your turn!</p>
      )}
    </div>
  );
}