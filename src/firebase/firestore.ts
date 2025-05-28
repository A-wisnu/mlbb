import { db } from './config';
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  Unsubscribe 
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

// ==================== FINALS ====================
// Simpan pemenang Final
export const saveFinalsWinner = async (team: Team | null) => {
  try {
    await setDoc(doc(db, FINALS, 'winner'), { team }, { merge: true });
    console.log('Finals winner saved to Firestore');
  } catch (error) {
    console.error('Error saving Finals winner:', error);
  }
};

// Ambil pemenang Final
export const getFinalsWinner = async (): Promise<Team | null> => {
  try {
    const docRef = doc(db, FINALS, 'winner');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().team) {
      return docSnap.data().team;
    }
    return null;
  } catch (error) {
    console.error('Error getting Finals winner:', error);
    return null;
  }
};

// Dengarkan perubahan pemenang Final
export const onFinalsWinnerChange = (callback: (team: Team | null) => void): Unsubscribe => {
  const docRef = doc(db, FINALS, 'winner');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists() && docSnap.data().team) {
      callback(docSnap.data().team);
    } else {
      callback(null);
    }
  });
};

// Simpan pemenang Juara 3
export const saveFinalsThirdPlace = async (team: Team | null) => {
  try {
    await setDoc(doc(db, FINALS, 'thirdPlace'), { team }, { merge: true });
    console.log('Finals third place winner saved to Firestore');
  } catch (error) {
    console.error('Error saving Finals third place winner:', error);
  }
};

// Ambil pemenang Juara 3
export const getFinalsThirdPlace = async (): Promise<Team | null> => {
  try {
    const docRef = doc(db, FINALS, 'thirdPlace');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().team) {
      return docSnap.data().team;
    }
    return null;
  } catch (error) {
    console.error('Error getting Finals third place winner:', error);
    return null;
  }
};

// Dengarkan perubahan pemenang Juara 3
export const onFinalsThirdPlaceChange = (callback: (team: Team | null) => void): Unsubscribe => {
  const docRef = doc(db, FINALS, 'thirdPlace');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists() && docSnap.data().team) {
      callback(docSnap.data().team);
    } else {
      callback(null);
    }
  });
}; 