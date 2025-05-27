import React, { useState, useEffect } from 'react';
import { Match, Team, BracketType } from '../types';
import BracketRound from './BracketRound';

interface TournamentBracketProps {
  bracketType: BracketType;
  teams: Team[];
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({ bracketType, teams }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [rounds, setRounds] = useState<number[]>([]);
  
  useEffect(() => {
    // Buat struktur bracket
    const generatedMatches: Match[] = [];
    const numTeams = teams.length;
    const numRounds = Math.ceil(Math.log2(numTeams));
    
    // Buat daftar ronde
    const roundsList = Array.from({ length: numRounds }, (_, i) => i + 1);
    setRounds(roundsList);

    // Buat match untuk ronde pertama
    const firstRoundMatchCount = Math.floor(numTeams / 2);
    for (let i = 0; i < firstRoundMatchCount; i++) {
      const teamA = teams[i * 2];
      const teamB = teams[i * 2 + 1];
      
      generatedMatches.push({
        id: i + 1,
        teamA,
        teamB,
        round: 1,
        matchNumber: i + 1
      });
    }

    // Buat match untuk ronde-ronde berikutnya
    let matchId = firstRoundMatchCount + 1;
    for (let round = 2; round <= numRounds; round++) {
      const matchesInRound = Math.pow(2, numRounds - round);
      for (let i = 0; i < matchesInRound; i++) {
        generatedMatches.push({
          id: matchId,
          round,
          matchNumber: i + 1
        });
        matchId++;
      }
    }
    
    setMatches(generatedMatches);
  }, [teams]);

  // Memilih pemenang pertandingan
  const handleSelectWinner = (matchId: number, teamId: number) => {
    setMatches(prevMatches => {
      // Salin array match yang ada
      const updatedMatches = [...prevMatches];
      
      // Temukan match yang sedang diperbarui
      const matchIndex = updatedMatches.findIndex(m => m.id === matchId);
      if (matchIndex === -1) return prevMatches;
      
      const currentMatch = updatedMatches[matchIndex];
      const winningTeam = 
        currentMatch.teamA?.id === teamId ? currentMatch.teamA : 
        currentMatch.teamB?.id === teamId ? currentMatch.teamB : undefined;
        
      // Update match dengan pemenang baru
      updatedMatches[matchIndex] = {
        ...currentMatch,
        winner: winningTeam
      };

      // Temukan match di ronde berikutnya untuk diupdate
      if (currentMatch.round < Math.max(...rounds)) {
        const nextRoundMatchPosition = Math.ceil(currentMatch.matchNumber / 2);
        const nextRoundMatchIndex = updatedMatches.findIndex(
          m => m.round === currentMatch.round + 1 && m.matchNumber === nextRoundMatchPosition
        );

        if (nextRoundMatchIndex !== -1) {
          const isFirstMatchOfPair = currentMatch.matchNumber % 2 !== 0;
          
          if (isFirstMatchOfPair) {
            updatedMatches[nextRoundMatchIndex] = {
              ...updatedMatches[nextRoundMatchIndex],
              teamA: winningTeam
            };
          } else {
            updatedMatches[nextRoundMatchIndex] = {
              ...updatedMatches[nextRoundMatchIndex],
              teamB: winningTeam
            };
          }
        }
      }

      return updatedMatches;
    });
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="bg-gradient-to-b from-blue-900 to-indigo-900 p-6 rounded-xl shadow-xl">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">
          Bracket {bracketType}
          <span className="block text-sm font-normal text-blue-300 mt-1">
            28 Mei 2025 • {teams.length} Tim
          </span>
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {rounds.map(round => (
            <BracketRound 
              key={round}
              round={round}
              matches={matches}
              onSelectWinner={handleSelectWinner}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket; 