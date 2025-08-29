import React from 'react';
import { CARD_ORDER } from '../utils/cardUtils';
import { Card } from './Card';

interface CardOrderModalProps {
  onClose: () => void;
}

export function CardOrderModal({ onClose }: CardOrderModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Card Order (Highest to Lowest)</h2>
          <button className="btn btn-secondary" onClick={onClose}>×</button>
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-96 overflow-y-auto">
          {CARD_ORDER.map((card, index) => (
            <div key={index} className="text-center">
              <Card card={card} />
              <p className="text-xs mt-1 font-semibold">#{index + 1}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p className="font-semibold">Remember:</p>
          <p>Lower number = Higher strength</p>
          <p>1 of Sword is the strongest card</p>
        </div>
      </div>
    </div>
  );
}