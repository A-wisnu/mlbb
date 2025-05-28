export interface Team {
  id: number;
  name: string;
  bracket?: 'A' | 'B';
}

export interface Match {
  id: number;
  teamA?: Team;
  teamB?: Team;
  winner?: Team;
  round: number;
  matchNumber: number;
  status?: 'scheduled' | 'playing' | 'completed';
}

export interface Bracket {
  id: string;
  name: string;
  teams: Team[];
  matches: Match[];
}

export type BracketType = 'A' | 'B' | 'Quarter' | 'Semi' | 'Final'; 