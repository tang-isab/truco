import React from 'react';

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
        
        <div className="max-h-96 overflow-y-auto flex justify-center">
          <img 
            src="/cards/card_order.jpg" 
            alt="Card Order from Highest to Lowest" 
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
        
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p className="font-semibold">Remember:</p>
          <p>Cards shown from strongest (top) to weakest (bottom)</p>
          <p>1 of Sword is the strongest card</p>
        </div>
      </div>
    </div>
  );
}