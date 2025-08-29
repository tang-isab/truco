import React from 'react';
import { Card as CardType } from '../types/game';
import { getCardImagePath } from '../utils/cardUtils';

interface CardProps {
  card?: CardType;
  isBack?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Card({ card, isBack = false, onClick, className = '' }: CardProps) {
  if (isBack || !card) {
    return (
      <div 
        className={`card card-back ${className}`}
        onClick={onClick}
      />
    );
  }

  return (
    <img
      src={getCardImagePath(card)}
      alt={`${card.value} of ${card.suit}`}
      className={`card ${className}`}
      onClick={onClick}
    />
  );
}