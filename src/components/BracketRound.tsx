import React from 'react';
import { Match } from '../types';
import BracketMatch from './BracketMatch';

interface BracketRoundProps {
  round: number;
  matches: Match[];
  onSelectWinner: (matchId: number, teamId: number) => void;
}

const BracketRound: React.FC<BracketRoundProps> = ({ round, matches, onSelectWinner }) => {
  const roundMatches = matches.filter(match => match.round === round);
  
  const roundNames: Record<number, string> = {
    1: 'Babak Pertama',
    2: 'Perempat Final',
    3: 'Semi Final',
    4: 'Final'
  };

  return (
    <div className="flex-1 px-2">
      <div className="bg-gray-900 py-2 px-4 rounded-t-lg">
        <h3 className="text-white font-bold text-center">
          {roundNames[round] || `Round ${round}`}
        </h3>
      </div>
      <div className="bg-gray-900/50 p-4 rounded-b-lg mb-4">
        {roundMatches.length > 0 ? (
          roundMatches.map(match => (
            <BracketMatch
              key={match.id}
              match={match}
              onSelectWinner={onSelectWinner}
            />
          ))
        ) : (
          <div className="text-gray-400 text-center py-8">Belum ada pertandingan</div>
        )}
      </div>
    </div>
  );
};

export default BracketRound; 