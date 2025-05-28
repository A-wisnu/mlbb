// Daftar data wasit
export interface Referee {
  name: string;
  phone: string;
}

export const referees: Referee[] = [
  { name: "Ibad", phone: "(+62) 815-7321-5336" },
  { name: "Wisnu hidayat", phone: "(+62) 856-4302-5633" },
  { name: "Ardian Wisnu", phone: "(+62) 819-1001-2958" },
  { name: "Kanzul", phone: "(+62) 823-2935-5683" },
  { name: "Romi", phone: "(+62) 895-3265-44080" },
  { name: "Genard", phone: "(+62) 895-3417-71720" },
  { name: "Haqi", phone: "(+62) 853-2540-8453" },
  { name: "Hasan", phone: "(+62) 852-2583-6307" },
  { name: "Zidan", phone: "(+62) 822-2144-4004" },
  { name: "Ricko", phone: "(+62) 857-2611-1948" },
  { name: "Abil", phone: "(+62) 812-2872-3714" },
  { name: "Wafi", phone: "(+62) 896-7249-9000" }
];

// Fungsi untuk mendapatkan wasit acak
export function getRandomReferee(): Referee {
  const randomIndex = Math.floor(Math.random() * referees.length);
  return referees[randomIndex];
}

// Fungsi untuk mendapatkan wasit berdasarkan id pertandingan (konsisten)
export function getRefereeForMatch(matchId: number): Referee {
  // Gunakan matchId sebagai seed untuk mendapatkan wasit yang sama untuk pertandingan yang sama
  const index = matchId % referees.length;
  return referees[index];
} 