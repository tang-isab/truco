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
              <li>Teams can fold at any point</li>
              <li>Player to the right of dealer is the "mono"</li>
              <li>Game can be played with 2 or 4 players</li>
              <li>Teams are: Player 1 & 3 vs Player 2 & 4</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Envido Phase</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Card values: numbered cards = face value, face cards = 0</li>
              <li>Pairs = 20 + sum of card values in that suit</li>
              <li>No pairs = highest single card value</li>
              <li>Only available in first round, before any cards played, and before Truco</li>
              <li>Ties go to the "mono"</li>
              <li>Players reveal values in clockwise order starting from caller</li>
            </ul>
            <div className="mt-2">
              <strong>Bets:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>"Envido" - 2 points</li>
                <li>"Envido" (2nd) - +2 points</li>
                <li>"Real Envido" - +3 points</li>
                <li>"Falta Envido" - Points opponent needs to reach 15 or 30</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Truco Phase</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>3 tricks per round</li>
              <li>Win 2/3 tricks to win the round</li>
              <li>Highest card wins each trick</li>
              <li>Ties: goes to first trick winner, or first to win if first trick tied</li>
              <li>Starting player: "mono" for first trick, trick winner for subsequent tricks</li>
            </ul>
            <div className="mt-2">
              <strong>Bets:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>"Truco" - 2 points</li>
                <li>"Retruco" - 3 points</li>
                <li>"Vale Cuatro" - 4 points</li>
              </ul>
              <p className="text-xs mt-2 text-gray-600">
                Must be called in order. Cannot skip levels.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Card Order (Highest to Lowest)</h3>
            <div className="text-xs space-y-1">
              <p>1. 1 of Sword, 1 of Club</p>
              <p>2. 7 of Sword, 7 of Coin</p>
              <p>3. All 3s (Sword, Club, Coin, Cup)</p>
              <p>4. All 2s (Sword, Club, Coin, Cup)</p>
              <p>5. 1 of Coin, 1 of Cup</p>
              <p>6. All 12s, 11s, 10s</p>
              <p>7. 7 of Cup</p>
              <p>8. All 6s, 5s, 4s</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}