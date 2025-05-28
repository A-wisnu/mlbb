import {
  saveBracketAMatches,
  saveBracketAByeTeam,
  saveBracketASpecialSlots,
  saveBracketBMatches,
  saveBracketBByeTeam,
  saveBracketBSpecialSlots,
  saveFinalsWinner,
  getBracketAMatches,
  getBracketAByeTeam,
  getBracketASpecialSlots,
  getBracketBMatches,
  getBracketBByeTeam,
  getBracketBSpecialSlots,
  getFinalsWinner
} from './firestore';
import { Team } from '../types';

interface MigrationResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Migrates all data from localStorage to Firebase
 * Only migrates if Firebase doesn't already have data
 */
export const migrateLocalStorageToFirebase = async (): Promise<MigrationResult> => {
  try {
    let migratedCount = 0;
    let skippedCount = 0;

    // Check if there's any localStorage data to migrate
    const hasLocalData = checkLocalStorageData();
    if (!hasLocalData) {
      return {
        success: true,
        message: 'Tidak ada data localStorage yang perlu dimigrasi.'
      };
    }
    
    // Bracket A
    const existingBracketAMatches = await getBracketAMatches();
    if (existingBracketAMatches.length === 0) {
      const bracketAMatches = localStorage.getItem('bracketA_matches');
      if (bracketAMatches) {
        await saveBracketAMatches(JSON.parse(bracketAMatches));
        migratedCount++;
      }
    } else {
      skippedCount++;
    }

    const existingBracketAByeTeam = await getBracketAByeTeam();
    if (!existingBracketAByeTeam) {
      const bracketAByeTeam = localStorage.getItem('bracketA_byeTeam');
      if (bracketAByeTeam) {
        await saveBracketAByeTeam(JSON.parse(bracketAByeTeam));
        migratedCount++;
      }
    } else {
      skippedCount++;
    }

    const existingBracketASpecialSlots = await getBracketASpecialSlots();
    if (existingBracketASpecialSlots.length === 0) {
      const bracketASpecialSlots = localStorage.getItem('bracketA_specialSlots');
      if (bracketASpecialSlots) {
        await saveBracketASpecialSlots(JSON.parse(bracketASpecialSlots));
        migratedCount++;
      }
    } else {
      skippedCount++;
    }

    // Bracket B
    const existingBracketBMatches = await getBracketBMatches();
    if (existingBracketBMatches.length === 0) {
      const bracketBMatches = localStorage.getItem('bracketB_matches');
      if (bracketBMatches) {
        await saveBracketBMatches(JSON.parse(bracketBMatches));
        migratedCount++;
      }
    } else {
      skippedCount++;
    }

    const existingBracketBByeTeam = await getBracketBByeTeam();
    if (!existingBracketBByeTeam) {
      const bracketBByeTeam = localStorage.getItem('bracketB_byeTeam');
      if (bracketBByeTeam) {
        await saveBracketBByeTeam(JSON.parse(bracketBByeTeam));
        migratedCount++;
      }
    } else {
      skippedCount++;
    }

    const existingBracketBSpecialSlots = await getBracketBSpecialSlots();
    if (existingBracketBSpecialSlots.length === 0) {
      const bracketBSpecialSlots = localStorage.getItem('bracketB_specialSlots');
      if (bracketBSpecialSlots) {
        await saveBracketBSpecialSlots(JSON.parse(bracketBSpecialSlots));
        migratedCount++;
      }
    } else {
      skippedCount++;
    }

    // Finals
    const existingFinalsWinner = await getFinalsWinner();
    if (!existingFinalsWinner) {
      const finalsWinner = localStorage.getItem('finals_winner');
      if (finalsWinner) {
        await saveFinalsWinner(JSON.parse(finalsWinner) as Team);
        migratedCount++;
      }
    } else {
      skippedCount++;
    }

    // Clear localStorage after successful migration
    if (migratedCount > 0) {
      clearLocalStorage();
    }

    return {
      success: true,
      message: `Migrasi berhasil: ${migratedCount} data berhasil dimigrasi, ${skippedCount} data dilewati (sudah ada di Firebase).`
    };
  } catch (error) {
    console.error('Error migrasi data:', error);
    return {
      success: false,
      message: 'Migrasi data gagal',
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Check if there's any data in localStorage to migrate
 */
export const checkLocalStorageData = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const keys = [
    'bracketA_matches',
    'bracketA_byeTeam',
    'bracketA_specialSlots',
    'bracketB_matches',
    'bracketB_byeTeam',
    'bracketB_specialSlots',
    'finals_winner'
  ];
  
  return keys.some(key => localStorage.getItem(key) !== null);
};

export const clearLocalStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  // Bracket A
  localStorage.removeItem('bracketA_matches');
  localStorage.removeItem('bracketA_byeTeam');
  localStorage.removeItem('bracketA_specialSlots');

  // Bracket B
  localStorage.removeItem('bracketB_matches');
  localStorage.removeItem('bracketB_byeTeam');
  localStorage.removeItem('bracketB_specialSlots');

  // Finals
  localStorage.removeItem('finals_winner');
}; 