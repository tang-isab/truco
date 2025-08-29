import { Card } from '../types/game';

export const CARD_ORDER = [
  { value: 1, suit: 'sword' },
  { value: 1, suit: 'club' },
  { value: 7, suit: 'sword' },
  { value: 7, suit: 'coin' },
  { value: 3, suit: 'sword' },
  { value: 3, suit: 'club' },
  { value: 3, suit: 'coin' },
  { value: 3, suit: 'cup' },
  { value: 2, suit: 'sword' },
  { value: 2, suit: 'club' },
  { value: 2, suit: 'coin' },
  { value: 2, suit: 'cup' },
  { value: 1, suit: 'coin' },
  { value: 1, suit: 'cup' },
  { value: 12, suit: 'sword' },
  { value: 12, suit: 'club' },
  { value: 12, suit: 'coin' },
  { value: 12, suit: 'cup' },
  { value: 11, suit: 'sword' },
  { value: 11, suit: 'club' },
  { value: 11, suit: 'coin' },
  { value: 11, suit: 'cup' },
  { value: 10, suit: 'sword' },
  { value: 10, suit: 'club' },
  { value: 10, suit: 'coin' },
  { value: 10, suit: 'cup' },
  { value: 7, suit: 'cup' },
  { value: 6, suit: 'sword' },
  { value: 6, suit: 'club' },
  { value: 6, suit: 'coin' },
  { value: 6, suit: 'cup' },
  { value: 5, suit: 'sword' },
  { value: 5, suit: 'club' },
  { value: 5, suit: 'coin' },
  { value: 5, suit: 'cup' },
  { value: 4, suit: 'sword' },
  { value: 4, suit: 'club' },
  { value: 4, suit: 'coin' },
  { value: 4, suit: 'cup' },
];

export function getCardStrength(card: Card): number {
  return CARD_ORDER.findIndex(c => c.value === card.value && c.suit === card.suit);
}

export function compareCards(card1: Card, card2: Card): number {
  const strength1 = getCardStrength(card1);
  const strength2 = getCardStrength(card2);
  return strength1 - strength2; // Lower index = higher strength
}

export function getCardImagePath(card: Card): string {
  return `/cards/${card.value}_${card.suit}.jpg`;
}

export function calculateEnvidoValue(cards: Card[]): number {
  const suits = ['club', 'coin', 'cup', 'sword'] as const;
  let maxValue = 0;
  
  // Check for pairs in each suit
  for (const suit of suits) {
    const suitCards = cards.filter(card => card.suit === suit);
    if (suitCards.length >= 2) {
      // Calculate pair value (20 + sum of card values)
      const cardValues = suitCards.map(card => card.value > 10 ? 0 : card.value);
      const sum = cardValues.reduce((a, b) => a + b, 0);
      maxValue = Math.max(maxValue, 20 + sum);
    }
  }
  
  // If no pairs, return highest single card value
  if (maxValue === 0) {
    const cardValues = cards.map(card => card.value > 10 ? 0 : card.value);
    maxValue = Math.max(...cardValues);
  }
  
  return maxValue;
}

export function createDeck(): Card[] {
  const suits: Card['suit'][] = ['club', 'coin', 'cup', 'sword'];
  const values = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12];
  
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ value, suit });
    }
  }
  
  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}