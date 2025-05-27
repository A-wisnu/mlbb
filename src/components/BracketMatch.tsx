import React from 'react';
import { Match } from '../types';

interface BracketMatchProps {
  match: Match;
  onSelectWinner?: (matchId: number, teamId: number) => void;
}

const BracketMatch: React.FC<BracketMatchProps> = ({ match, onSelectWinner }) => {
  const handleWinnerSelect = (teamId: number) => {
    if (onSelectWinner) {
      onSelectWinner(match.id, teamId);
    }
  };

  return (
    <div className="mb-4">
      <div className="flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div
          className={`flex items-center p-3 border-l-4 ${
            match.winner?.id === match.teamA?.id
              ? 'border-yellow-500 bg-gray-700'
              : 'border-transparent hover:bg-gray-700'
          } cursor-pointer transition-all`}
          onClick={() => match.teamA && handleWinnerSelect(match.teamA.id)}
          style={{ justifyContent: 'center' }}
        >
          <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full mr-3 text-sm font-bold">
            {match.teamA?.id || '?'}
          </span>
          <span
            className="flex-1 team-name"
            style={{
              color: '#fff',
              fontWeight: 900,
              fontSize: '1.25rem',
              padding: '0.75rem 1.5rem',
              border: '3px solid #FFD700',
              borderRadius: '1rem',
              background: 'rgba(24, 24, 32, 0.7)',
              boxShadow: '0 0 24px 4px #FFD70088, 0 2px 16px #000a',
              letterSpacing: '1px',
              textShadow: '0 2px 12px #FFD700cc, 0 1px 2px #000',
              margin: '0 auto',
              display: 'block',
              textAlign: 'center',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onMouseOver={e => {
              e.currentTarget.style.border = '3.5px solid #fff700';
              e.currentTarget.style.boxShadow = '0 0 32px 8px #FFD700cc, 0 2px 16px #000a';
              e.currentTarget.style.transform = 'scale(1.04)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.border = '3px solid #FFD700';
              e.currentTarget.style.boxShadow = '0 0 24px 4px #FFD70088, 0 2px 16px #000a';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {match.teamA?.name || 'TBD'}
          </span>
        </div>
        <div className="h-px bg-gray-700" />
        <div
          className={`flex items-center p-3 border-l-4 ${
            match.winner?.id === match.teamB?.id
              ? 'border-yellow-500 bg-gray-700'
              : 'border-transparent hover:bg-gray-700'
          } cursor-pointer transition-all`}
          onClick={() => match.teamB && handleWinnerSelect(match.teamB.id)}
          style={{ justifyContent: 'center' }}
        >
          <span className="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-full mr-3 text-sm font-bold">
            {match.teamB?.id || '?'}
          </span>
          <span
            className="flex-1 team-name"
            style={{
              color: '#fff',
              fontWeight: 900,
              fontSize: '1.25rem',
              padding: '0.75rem 1.5rem',
              border: '3px solid #FFD700',
              borderRadius: '1rem',
              background: 'rgba(24, 24, 32, 0.7)',
              boxShadow: '0 0 24px 4px #FFD70088, 0 2px 16px #000a',
              letterSpacing: '1px',
              textShadow: '0 2px 12px #FFD700cc, 0 1px 2px #000',
              margin: '0 auto',
              display: 'block',
              textAlign: 'center',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onMouseOver={e => {
              e.currentTarget.style.border = '3.5px solid #fff700';
              e.currentTarget.style.boxShadow = '0 0 32px 8px #FFD700cc, 0 2px 16px #000a';
              e.currentTarget.style.transform = 'scale(1.04)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.border = '3px solid #FFD700';
              e.currentTarget.style.boxShadow = '0 0 24px 4px #FFD70088, 0 2px 16px #000a';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {match.teamB?.name || 'TBD'}
          </span>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-1">Match #{match.matchNumber}</div>
    </div>
  );
};

export default BracketMatch; 