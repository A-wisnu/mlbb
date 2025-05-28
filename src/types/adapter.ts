// Utilitas Adapter untuk menangani perbedaan tipe Match

import { Match as GlobalMatch, Team } from './index';

// Tipe Match yang digunakan di komponen UI
export interface UIMatch {
  id: number;
  team1: string;
  team2: string;
  date: string;
  time: string;
  result: string | null;
  status: 'scheduled' | 'playing' | 'completed';
  round?: number;
}

/**
 * Mengkonversi array UIMatch ke GlobalMatch untuk Firebase
 */
export const convertToGlobalMatches = (uiMatches: UIMatch[]): GlobalMatch[] => {
  return uiMatches.map(match => {
    // Buat objek dasar dengan properti wajib
    const globalMatch: GlobalMatch = {
      id: match.id,
      matchNumber: match.id, // Menggunakan id sebagai matchNumber
      round: match.round || 1,
      teamA: { id: 1, name: match.team1 }, // Konversi sederhana string -> Team
      teamB: { id: 2, name: match.team2 },
      status: match.status // Simpan status pertandingan
    };
    
    // Tambahkan winner hanya jika ada hasil (bukan null atau undefined)
    if (match.result === 'team1') {
      globalMatch.winner = { id: 1, name: match.team1 };
    } else if (match.result === 'team2') {
      globalMatch.winner = { id: 2, name: match.team2 };
    }
    // Jika match.result null atau nilai lain, winner tidak akan ditambahkan
    
    return globalMatch;
  });
};

/**
 * Mengkonversi array GlobalMatch ke UIMatch untuk komponen
 */
export const convertToUIMatches = (globalMatches: GlobalMatch[]): UIMatch[] => {
  return globalMatches.map(match => {
    // Cari tim fallback jika nama tim tidak ada
    const defaultTeamName = getDefaultTeamName(globalMatches);
    
    return {
      id: match.id,
      team1: match.teamA?.name || defaultTeamName,
      team2: match.teamB?.name || defaultTeamName,
      date: new Date().toISOString().split('T')[0], // Default tanggal hari ini
      time: '12:00', // Default waktu
      result: match.winner 
        ? match.winner.name === match.teamA?.name 
          ? 'team1' 
          : 'team2'
        : null,
      status: match.status || (match.winner ? 'completed' : 'scheduled'), // Gunakan status dari Firebase jika ada
      round: match.round
    };
  });
};

/**
 * Cari nama tim default dari pertandingan lain jika ada
 */
const getDefaultTeamName = (matches: GlobalMatch[]): string => {
  // Coba temukan tim yang ada di pertandingan lain
  for (const match of matches) {
    if (match.teamA?.name && match.teamA.name !== 'TBD') {
      return match.teamA.name;
    }
    if (match.teamB?.name && match.teamB.name !== 'TBD') {
      return match.teamB.name;
    }
  }
  
  // Jika tidak ada tim yang ditemukan, gunakan string kosong daripada TBD
  return "Tim Belum Ditentukan";
}; 