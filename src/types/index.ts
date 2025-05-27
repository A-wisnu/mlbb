export interface Team {
  id: number;
  name: string;
}

export interface Match {
  id: number;
  teamA?: Team;
  teamB?: Team;
  winner?: Team;
  round: number;
  matchNumber: number;
}

export interface Bracket {
  id: string;
  name: string;
  teams: Team[];
  matches: Match[];
}

export type BracketType = 'A' | 'B' | 'Quarter' | 'Semi' | 'Final'; 