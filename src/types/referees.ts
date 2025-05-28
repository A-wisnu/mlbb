// Daftar data wasit
export interface Referee {
  name: string;
  phone: string;
}

// Wasit untuk Bracket A
export const refereesA: Referee[] = [
  { name: "Ibad", phone: "(+62) 815-7321-5336" },
  { name: "Ardian Wisnu", phone: "(+62) 819-1001-2958" },
  { name: "Kanzul", phone: "(+62) 823-2935-5683" },
  { name: "Yoga", phone: "(+62) 822-4164-3610" },
  { name: "Genard", phone: "(+62) 895-3417-71720" }
];

// Wasit untuk Bracket B
export const refereesB: Referee[] = [
  { name: "Haqi", phone: "(+62) 853-2540-8453" },
  { name: "Hasan", phone: "(+62) 852-2583-6307" },
  { name: "Zidan", phone: "(+62) 822-2144-4004" },
  { name: "Ricko", phone: "(+62) 857-2611-1948" },
  { name: "Abil", phone: "(+62) 812-2872-3714" },
  { name: "Wafi", phone: "(+62) 896-7249-9000" }
];

// Semua wasit (gabungan untuk backward compatibility)
export const referees: Referee[] = [...refereesA, ...refereesB];

// Fungsi untuk mendapatkan wasit acak dari bracket tertentu
export function getRandomReferee(bracket: 'A' | 'B'): Referee {
  const refs = bracket === 'A' ? refereesA : refereesB;
  const randomIndex = Math.floor(Math.random() * refs.length);
  return refs[randomIndex];
}

// Fungsi untuk mendapatkan wasit berdasarkan id pertandingan dan bracket
export function getRefereeForMatch(matchId: number, bracket: 'A' | 'B' = 'A'): Referee {
  // Gunakan matchId sebagai seed untuk mendapatkan wasit yang sama untuk pertandingan yang sama
  const refs = bracket === 'A' ? refereesA : refereesB;
  const index = matchId % refs.length;
  return refs[index];
} 