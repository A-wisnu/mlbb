import { db } from './config';
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  Unsubscribe,
  deleteDoc
} from 'firebase/firestore';
import { Team, Match } from '../types';

// Collections
const BRACKET_A = 'bracketA';
const BRACKET_B = 'bracketB';
const FINALS = 'finals';

// ==================== BRACKET A ====================
// Simpan matches Bracket A
export const saveBracketAMatches = async (matches: Match[]) => {
  try {
    await setDoc(doc(db, BRACKET_A, 'matches'), { matches }, { merge: true });
    console.log('Bracket A matches saved to Firestore');
  } catch (error) {
    console.error('Error saving Bracket A matches:', error);
  }
};

// Ambil matches Bracket A (satu kali)
export const getBracketAMatches = async (): Promise<Match[]> => {
  try {
    const docRef = doc(db, BRACKET_A, 'matches');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().matches) {
      return docSnap.data().matches;
    }
    return [];
  } catch (error) {
    console.error('Error getting Bracket A matches:', error);
    return [];
  }
};

// Dengarkan perubahan matches Bracket A (realtime)
export const onBracketAMatchesChange = (callback: (matches: Match[]) => void): Unsubscribe => {
  const docRef = doc(db, BRACKET_A, 'matches');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists() && docSnap.data().matches) {
      callback(docSnap.data().matches);
    } else {
      callback([]);
    }
  });
};

// Simpan Bye Team Bracket A
export const saveBracketAByeTeam = async (team: string | null) => {
  try {
    await setDoc(doc(db, BRACKET_A, 'byeTeam'), { team }, { merge: true });
    console.log('Bracket A bye team saved to Firestore');
  } catch (error) {
    console.error('Error saving Bracket A bye team:', error);
  }
};

// Ambil Bye Team Bracket A
export const getBracketAByeTeam = async (): Promise<string | null> => {
  try {
    const docRef = doc(db, BRACKET_A, 'byeTeam');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().team !== undefined) {
      return docSnap.data().team;
    }
    return null;
  } catch (error) {
    console.error('Error getting Bracket A bye team:', error);
    return null;
  }
};

// Dengarkan perubahan Bye Team Bracket A
export const onBracketAByeTeamChange = (callback: (team: string | null) => void): Unsubscribe => {
  const docRef = doc(db, BRACKET_A, 'byeTeam');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists() && docSnap.data().team !== undefined) {
      callback(docSnap.data().team);
    } else {
      callback(null);
    }
  });
};

// Simpan Special Slots Bracket A
export const saveBracketASpecialSlots = async (teams: string[]) => {
  try {
    await setDoc(doc(db, BRACKET_A, 'specialSlots'), { teams }, { merge: true });
    console.log('Bracket A special slots saved to Firestore');
  } catch (error) {
    console.error('Error saving Bracket A special slots:', error);
  }
};

// Ambil Special Slots Bracket A
export const getBracketASpecialSlots = async (): Promise<string[]> => {
  try {
    const docRef = doc(db, BRACKET_A, 'specialSlots');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().teams) {
      return docSnap.data().teams;
    }
    return [];
  } catch (error) {
    console.error('Error getting Bracket A special slots:', error);
    return [];
  }
};

// Dengarkan perubahan Special Slots Bracket A
export const onBracketASpecialSlotsChange = (callback: (teams: string[]) => void): Unsubscribe => {
  const docRef = doc(db, BRACKET_A, 'specialSlots');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists() && docSnap.data().teams) {
      callback(docSnap.data().teams);
    } else {
      callback([]);
    }
  });
};

// Simpan Pemenang Ronde 2 Bracket A
export const saveBracketARound2Winners = async (teams: string[]) => {
  try {
    await setDoc(doc(db, BRACKET_A, 'round2Winners'), { teams }, { merge: true });
    console.log('Bracket A round 2 winners saved to Firestore');
  } catch (error) {
    console.error('Error saving Bracket A round 2 winners:', error);
  }
};

// Ambil Pemenang Ronde 2 Bracket A
export const getBracketARound2Winners = async (): Promise<string[]> => {
  try {
    const docRef = doc(db, BRACKET_A, 'round2Winners');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().teams) {
      return docSnap.data().teams;
    }
    return [];
  } catch (error) {
    console.error('Error getting Bracket A round 2 winners:', error);
    return [];
  }
};

// Dengarkan perubahan Pemenang Ronde 2 Bracket A
export const onBracketARound2WinnersChange = (callback: (teams: string[]) => void): Unsubscribe => {
  const docRef = doc(db, BRACKET_A, 'round2Winners');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists() && docSnap.data().teams) {
      callback(docSnap.data().teams);
    } else {
      callback([]);
    }
  });
};

// ==================== BRACKET B ====================
// Simpan matches Bracket B
export const saveBracketBMatches = async (matches: Match[]) => {
  try {
    await setDoc(doc(db, BRACKET_B, 'matches'), { matches }, { merge: true });
    console.log('Bracket B matches saved to Firestore');
  } catch (error) {
    console.error('Error saving Bracket B matches:', error);
  }
};

// Ambil matches Bracket B (satu kali)
export const getBracketBMatches = async (): Promise<Match[]> => {
  try {
    const docRef = doc(db, BRACKET_B, 'matches');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().matches) {
      return docSnap.data().matches;
    }
    return [];
  } catch (error) {
    console.error('Error getting Bracket B matches:', error);
    return [];
  }
};

// Dengarkan perubahan matches Bracket B (realtime)
export const onBracketBMatchesChange = (callback: (matches: Match[]) => void): Unsubscribe => {
  const docRef = doc(db, BRACKET_B, 'matches');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists() && docSnap.data().matches) {
      callback(docSnap.data().matches);
    } else {
      callback([]);
    }
  });
};

// Simpan Bye Team Bracket B
export const saveBracketBByeTeam = async (team: string | null) => {
  try {
    await setDoc(doc(db, BRACKET_B, 'byeTeam'), { team }, { merge: true });
    console.log('Bracket B bye team saved to Firestore');
  } catch (error) {
    console.error('Error saving Bracket B bye team:', error);
  }
};

// Ambil Bye Team Bracket B
export const getBracketBByeTeam = async (): Promise<string | null> => {
  try {
    const docRef = doc(db, BRACKET_B, 'byeTeam');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().team !== undefined) {
      return docSnap.data().team;
    }
    return null;
  } catch (error) {
    console.error('Error getting Bracket B bye team:', error);
    return null;
  }
};

// Dengarkan perubahan Bye Team Bracket B
export const onBracketBByeTeamChange = (callback: (team: string | null) => void): Unsubscribe => {
  const docRef = doc(db, BRACKET_B, 'byeTeam');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists() && docSnap.data().team !== undefined) {
      callback(docSnap.data().team);
    } else {
      callback(null);
    }
  });
};

// Simpan Special Slots Bracket B
export const saveBracketBSpecialSlots = async (teams: string[]) => {
  try {
    await setDoc(doc(db, BRACKET_B, 'specialSlots'), { teams }, { merge: true });
    console.log('Bracket B special slots saved to Firestore');
  } catch (error) {
    console.error('Error saving Bracket B special slots:', error);
  }
};

// Ambil Special Slots Bracket B
export const getBracketBSpecialSlots = async (): Promise<string[]> => {
  try {
    const docRef = doc(db, BRACKET_B, 'specialSlots');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().teams) {
      return docSnap.data().teams;
    }
    return [];
  } catch (error) {
    console.error('Error getting Bracket B special slots:', error);
    return [];
  }
};

// Dengarkan perubahan Special Slots Bracket B
export const onBracketBSpecialSlotsChange = (callback: (teams: string[]) => void): Unsubscribe => {
  const docRef = doc(db, BRACKET_B, 'specialSlots');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists() && docSnap.data().teams) {
      callback(docSnap.data().teams);
    } else {
      callback([]);
    }
  });
};

// Simpan Pemenang Ronde 2 Bracket B
export const saveBracketBRound2Winners = async (teams: string[]) => {
  try {
    await setDoc(doc(db, BRACKET_B, 'round2Winners'), { teams }, { merge: true });
    console.log('Bracket B round 2 winners saved to Firestore');
  } catch (error) {
    console.error('Error saving Bracket B round 2 winners:', error);
  }
};

// Ambil Pemenang Ronde 2 Bracket B
export const getBracketBRound2Winners = async (): Promise<string[]> => {
  try {
    const docRef = doc(db, BRACKET_B, 'round2Winners');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().teams) {
      return docSnap.data().teams;
    }
    return [];
  } catch (error) {
    console.error('Error getting Bracket B round 2 winners:', error);
    return [];
  }
};

// Dengarkan perubahan Pemenang Ronde 2 Bracket B
export const onBracketBRound2WinnersChange = (callback: (teams: string[]) => void): Unsubscribe => {
  const docRef = doc(db, BRACKET_B, 'round2Winners');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists() && docSnap.data().teams) {
      callback(docSnap.data().teams);
    } else {
      callback([]);
    }
  });
};

// ==================== FINALS ====================
// Simpan pemenang Final
export const saveFinalsWinner = async (team: Team | null) => {
  try {
    await setDoc(doc(db, FINALS, 'winner'), { team }, { merge: true });
    console.log('Finals winner saved to Firestore');
  } catch (error) {
    console.error('Error saving finals winner:', error);
  }
};

// Ambil pemenang Final
export const getFinalsWinner = async (): Promise<Team | null> => {
  try {
    const docRef = doc(db, FINALS, 'winner');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().team !== undefined) {
      return docSnap.data().team;
    }
    return null;
  } catch (error) {
    console.error('Error getting finals winner:', error);
    return null;
  }
};

// Dengarkan perubahan pemenang Final
export const onFinalsWinnerChange = (callback: (team: Team | null) => void): Unsubscribe => {
  const docRef = doc(db, FINALS, 'winner');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists() && docSnap.data().team !== undefined) {
      callback(docSnap.data().team);
    } else {
      callback(null);
    }
  });
};

// Simpan Juara 3
export const saveFinalsThirdPlace = async (team: Team | null) => {
  try {
    await setDoc(doc(db, FINALS, 'thirdPlace'), { team }, { merge: true });
    console.log('Finals third place saved to Firestore');
  } catch (error) {
    console.error('Error saving finals third place:', error);
  }
};

// Ambil Juara 3
export const getFinalsThirdPlace = async (): Promise<Team | null> => {
  try {
    const docRef = doc(db, FINALS, 'thirdPlace');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().team !== undefined) {
      return docSnap.data().team;
    }
    return null;
  } catch (error) {
    console.error('Error getting finals third place:', error);
    return null;
  }
};

// Dengarkan perubahan Juara 3
export const onFinalsThirdPlaceChange = (callback: (team: Team | null) => void): Unsubscribe => {
  const docRef = doc(db, FINALS, 'thirdPlace');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists() && docSnap.data().team !== undefined) {
      callback(docSnap.data().team);
    } else {
      callback(null);
    }
  });
};

// Fungsi untuk mendapatkan 4 tim teratas dari Bracket A (untuk final)
// Untuk saat ini, kita asumsikan specialSlots adalah tim yang lolos ke final
export const getBracketAWinner = async (): Promise<string[]> => {
  console.log("Mengambil pemenang Bracket A (alias untuk getBracketASpecialSlots)");
  return getBracketASpecialSlots(); 
};

// Fungsi untuk mendapatkan 4 tim teratas dari Bracket B (untuk final)
// Untuk saat ini, kita asumsikan specialSlots adalah tim yang lolos ke final
export const getBracketBWinner = async (): Promise<string[]> => {
  console.log("Mengambil pemenang Bracket B (alias untuk getBracketBSpecialSlots)");
  return getBracketBSpecialSlots();
};

// Interface untuk data final yang akan disimpan
interface FinalsData {
  champion: string;
  runnerUp: string;
  thirdPlace: string;
  quarterFinals: { team1: Team; team2: Team; winner?: string }[];
  semiFinals: { team1: Team; team2: Team; winner?: string }[];
  finalMatch: { team1: Team; team2: Team; winner?: string } | null;
  thirdPlaceMatch: { team1: Team; team2: Team; winner?: string } | null;
}

// Simpan semua data babak final
export const saveFinalsData = async (data: FinalsData) => {
  try {
    console.log('Mencoba menyimpan data final:', data);
    await setDoc(doc(db, FINALS, 'allFinalsData'), data, { merge: true });
    console.log('All finals data saved to Firestore successfully:', FINALS, 'allFinalsData');
    
    // Verifikasi data tersimpan dengan benar
    const verifyDoc = await getDoc(doc(db, FINALS, 'allFinalsData'));
    if (verifyDoc.exists()) {
      console.log('Verifikasi data tersimpan:', verifyDoc.data());
    } else {
      console.error('Data tidak terverifikasi, dokumen tidak ditemukan');
    }
  } catch (error) {
    console.error('Error saving all finals data:', error);
    throw error; // Lempar error agar bisa ditangkap di komponen
  }
};

// Ambil semua data babak final
export const getFinalsData = async (): Promise<FinalsData | null> => {
  try {
    const docRef = doc(db, FINALS, 'allFinalsData');
    console.log('Mencoba mengambil data final dari:', FINALS, 'allFinalsData');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('Data final ditemukan:', docSnap.data());
      return docSnap.data() as FinalsData;
    }
    console.log('Data final tidak ditemukan!');
    return null;
  } catch (error) {
    console.error('Error getting finals data:', error);
    return null;
  }
};

// Dengarkan perubahan pada semua data babak final
export const onFinalsDataChange = (callback: (data: FinalsData | null) => void): Unsubscribe => {
  const docRef = doc(db, FINALS, 'allFinalsData');
  console.log('Mengatur listener untuk perubahan data final');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      console.log('Perubahan data final terdeteksi:', docSnap.data());
      callback(docSnap.data() as FinalsData);
    } else {
      console.log('Tidak ada data final dalam snapshot');
      callback(null);
    }
  });
};

// Reset data final (hapus data di halaman final)
export const resetFinalsData = async (): Promise<void> => {
  try {
    console.log('Mencoba mereset data final...');
    // Kita tidak benar-benar menghapus dokumen, tapi menggantinya dengan dokumen kosong
    // Ini untuk memastikan halaman publik menampilkan "Belum Ada Data Final"
    await setDoc(doc(db, FINALS, 'allFinalsData'), {
      champion: '',
      runnerUp: '',
      thirdPlace: '',
      quarterFinals: [],
      semiFinals: [],
      finalMatch: null,
      thirdPlaceMatch: null
    });
    console.log('Data final berhasil direset');
  } catch (error) {
    console.error('Error resetting finals data:', error);
    throw error;
  }
};

// Hapus dokumen data final sepenuhnya (lebih radikal)
export const deleteFinalsData = async (): Promise<void> => {
  try {
    console.log('Mencoba menghapus dokumen data final...');
    await deleteDoc(doc(db, FINALS, 'allFinalsData'));
    console.log('Dokumen data final berhasil dihapus');
  } catch (error) {
    console.error('Error deleting finals data document:', error);
    throw error;
  }
}; 