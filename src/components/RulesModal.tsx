import React from 'react';

interface RulesModalProps {
  onClose: () => void;
}

export function RulesModal({ onClose }: RulesModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Truco Rules</h2>
          <button className="btn btn-secondary" onClick={onClose}>×</button>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-bold text-lg mb-2">Game Overview</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>First team to 30 points wins</li>
              <li>Teams can fold at any point (all team members must agree)</li>
              <li>Player to the right of dealer is the "mono"</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Envido Phase</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Card values: numbered cards = face value, face cards = 0</li>
              <li>Pairs = 20 + sum of card values in that suit</li>
              <li>No pairs = highest single card value</li>
              <li>Only available before first trick and before Truco is called</li>
              <li>Ties go to the "mono"</li>
            </ul>
            <div className="mt-2">
              <strong>Bets:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>"Envido" - 2 points</li>
                <li>"Envido" (2nd) - +2 points</li>
                <li>"Real Envido" - +3 points</li>
                <li>"Falta Envido" - Points needed to reach 15 or 30</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Truco Phase</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>3 tricks per round</li>
              <li>Win 2/3 tricks to win the round</li>
              <li>Highest card wins each trick</li>
              <li>Ties go to first trick winner, or first to win if first trick tied</li>
            </ul>
            <div className="mt-2">
              <strong>Bets:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>"Truco" - 2 points</li>
                <li>"Retruco" - 3 points</li>
                <li>"Vale Cuatro" - 4 points</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}