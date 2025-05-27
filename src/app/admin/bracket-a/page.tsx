'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { bracketA } from '../../../data/teams';

// Define Match interface
interface Match {
  id: number;
  team1: string;
  team2: string;
  date: string;
  time: string;
  result: string | null;
  status: 'scheduled' | 'playing' | 'completed';
  round?: number;
}

// Define RandomizeResults interface
interface RandomizeResults {
  byeTeam?: string;
  round1Matches?: Match[];
  simulatedMatches?: Match[];
  nextRoundMatches?: Match[];
  specialSlotTeams?: string[];
}

const BracketAPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [showAddMatchModal, setShowAddMatchModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formData, setFormData] = useState<Match>({
    id: 0,
    team1: '',
    team2: '',
    date: '',
    time: '',
    result: null,
    status: 'scheduled' // default status: scheduled, playing, completed
  });
  const [showRandomizeModal, setShowRandomizeModal] = useState(false);
  const [randomizeResults, setRandomizeResults] = useState<RandomizeResults | null>(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  
  // New state variables for localStorage data
  const [byeTeam, setByeTeam] = useState<string | null>(null);
  const [specialSlots, setSpecialSlots] = useState<string[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      // Load matches
      const savedMatches = localStorage.getItem('bracketA_matches');
      if (savedMatches) {
        setMatches(JSON.parse(savedMatches));
      } else {
        // Initialize with some sample data if none exists
        const initialMatches: Match[] = [
          { id: 1, team1: bracketA[0], team2: bracketA[1], date: '2025-05-28', time: '14:00', result: null, status: 'scheduled' },
          { id: 2, team1: bracketA[2], team2: bracketA[3], date: '2025-05-28', time: '16:00', result: null, status: 'scheduled' },
          { id: 3, team1: bracketA[4], team2: bracketA[5], date: '2025-05-29', time: '14:00', result: null, status: 'scheduled' },
          { id: 4, team1: bracketA[6], team2: bracketA[7], date: '2025-05-29', time: '16:00', result: null, status: 'scheduled' },
          { id: 5, team1: bracketA[8], team2: bracketA[9], date: '2025-05-30', time: '14:00', result: null, status: 'scheduled' },
        ];
        setMatches(initialMatches);
        localStorage.setItem('bracketA_matches', JSON.stringify(initialMatches));
      }
      
      // Load bye team
      const savedByeTeam = localStorage.getItem('bracketA_byeTeam');
      if (savedByeTeam) {
        setByeTeam(JSON.parse(savedByeTeam));
      }
      
      // Load special slots
      const savedSpecialSlots = localStorage.getItem('bracketA_specialSlots');
      if (savedSpecialSlots) {
        setSpecialSlots(JSON.parse(savedSpecialSlots));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      // Set default matches if there's an error
      const initialMatches: Match[] = [
        { id: 1, team1: bracketA[0], team2: bracketA[1], date: '2025-05-28', time: '14:00', result: null, status: 'scheduled' },
        { id: 2, team1: bracketA[2], team2: bracketA[3], date: '2025-05-28', time: '16:00', result: null, status: 'scheduled' },
      ];
      setMatches(initialMatches);
    }
  }, []);

  // Save matches to localStorage whenever they change
  useEffect(() => {
    try {
      if (matches && matches.length > 0) {
        localStorage.setItem('bracketA_matches', JSON.stringify(matches));
      }
    } catch (error) {
      console.error('Error saving matches to localStorage:', error);
    }
  }, [matches]);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const handleBack = () => {
    router.push('/admin/dashboard');
  };

  const handleResultChange = (matchId: number, result: string) => {
    const updatedMatches = matches.map(match => 
      match.id === matchId ? { ...match, result, status: 'completed' as const } : match
    );
    setMatches(updatedMatches);
  };

  const handleStatusChange = (matchId: number, status: 'scheduled' | 'playing' | 'completed') => {
    const updatedMatches = matches.map(match => 
      match.id === matchId ? { ...match, status } : match
    );
    setMatches(updatedMatches);
  };

  const handleAddMatch = () => {
    setFormData({
      id: 0,
      team1: '',
      team2: '',
      date: '',
      time: '',
      result: null,
      status: 'scheduled'
    });
    setEditingMatch(null);
    setShowAddMatchModal(true);
  };

  const handleEditMatch = (match: Match) => {
    setFormData({
      id: match.id,
      team1: match.team1,
      team2: match.team2,
      date: match.date,
      time: match.time,
      result: match.result,
      status: match.status
    });
    setEditingMatch(match);
    setShowAddMatchModal(true);
  };

  const handleDeleteMatch = (matchId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pertandingan ini?')) {
      const updatedMatches = matches.filter(match => match.id !== matchId);
      setMatches(updatedMatches);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!e || !e.target) return;
    
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (editingMatch) {
      // Update existing match
      const updatedMatches = matches.map(match => 
        match.id === editingMatch.id ? { ...formData, id: editingMatch.id } : match
      );
      setMatches(updatedMatches);
    } else {
      // Add new match
      const newId = matches.length > 0 ? Math.max(...matches.map(m => m.id)) + 1 : 1;
      const newMatch: Match = { 
        ...formData, 
        id: newId, 
        result: null, 
        status: 'scheduled' 
      };
      setMatches([...matches, newMatch]);
    }
    
    setShowAddMatchModal(false);
  };

  // Function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Tambahkan fungsi untuk mendapatkan tim-tim pemenang dari semua ronde
  const getWinners = () => {
    // Pemenang ronde 1
    const round1Winners = matches
      .filter(m => (m.round || 1) === 1 && m.status === 'completed' && m.result)
      .map(match => match.result === 'team1' ? match.team1 : match.team2);
    
    // Pemenang ronde 2
    const round2Winners = matches
      .filter(m => (m.round || 0) === 2 && m.status === 'completed' && m.result)
      .map(match => match.result === 'team1' ? match.team1 : match.team2);
      
    // Semua tim di ronde 2
    const _round2Teams = matches
      .filter(m => (m.round || 0) === 2)
      .flatMap(match => [match.team1, match.team2])
      .filter(team => !team.includes("TBD"));
      
    return { round1Winners, round2Winners, _round2Teams };
  };

  // Fungsi untuk membuat atau memperbarui match di Ronde 2 dan Final
  const createOrUpdateBracket = () => {
    // Dapatkan semua pemenang
    const { round1Winners, round2Winners, _round2Teams } = getWinners();
    
    // Hapus semua match Ronde 2 dan Final yang ada
    const round1Matches = matches.filter(m => (m.round || 1) === 1);
    // Simpan match yang sudah ada di Ronde 2
    const existingRound2Matches = matches.filter(m => (m.round || 0) === 2);
    
    // Buat ID baru untuk match
    let nextId = round1Matches.length > 0 ? Math.max(...round1Matches.map(m => m.id)) + 1 : 1;
    // Mulai dengan semua match Ronde 1
    const newMatches = [...round1Matches];
    
    // Tetapkan GOGLAK ESPORT sebagai bye team
    const byeTeam = "GOGLAK ESPORT";
    setByeTeam(byeTeam);
    localStorage.setItem('bracketA_byeTeam', JSON.stringify(byeTeam));
    
    // Tanggal untuk Ronde 2 dan Final
    const round2Date = new Date();
    round2Date.setDate(round2Date.getDate() + 3);
    const round2DateStr = round2Date.toISOString().split('T')[0];
    
    const finalsDate = new Date();
    finalsDate.setDate(finalsDate.getDate() + 6);
    const finalsDateStr = finalsDate.toISOString().split('T')[0];
    
    // Filter pemenang Ronde 1 yang tersedia untuk Ronde 2 (kecuali bye team)
    const availableWinners = round1Winners.filter(team => team !== byeTeam);
    
    // Pilih 2 tim terbaik untuk special slots (langsung ke Final)
    let specialSlotTeams: string[] = [...specialSlots];
    
    // Jika belum ada special slots dan kita punya cukup pemenang Ronde 1
    if (specialSlotTeams.length === 0 && availableWinners.length >= 2) {
      specialSlotTeams = [availableWinners[0], availableWinners[1]];
      setSpecialSlots(specialSlotTeams);
      localStorage.setItem('bracketA_specialSlots', JSON.stringify(specialSlotTeams));
    }
    
    // Tim yang tersedia untuk Ronde 2 (kecuali special slots)
    const teamsForRound2 = availableWinners.filter(team => !specialSlotTeams.includes(team));
    
    // Jika sudah ada match di Ronde 2, gunakan itu
    // Jika belum ada atau jumlahnya kurang, buat match baru
    if (existingRound2Matches.length > 0) {
      // Tambahkan match yang sudah ada di Ronde 2
      newMatches.push(...existingRound2Matches);
      
      // Perbarui nextId jika perlu
      const maxRound2Id = Math.max(...existingRound2Matches.map(m => m.id));
      nextId = Math.max(nextId, maxRound2Id + 1);
    } else {
      // Match 1 untuk Ronde 2
      if (teamsForRound2.length >= 2) {
        newMatches.push({
          id: nextId++,
          team1: teamsForRound2[0],
          team2: teamsForRound2[1],
          date: round2DateStr,
          time: "14:00",
          result: null,
          status: 'scheduled',
          round: 2
        });
      }
      
      // Match 2 untuk Ronde 2 (dengan bye team)
      newMatches.push({
        id: nextId++,
        team1: byeTeam,
        team2: teamsForRound2.length > 2 ? teamsForRound2[2] : "",
        date: round2DateStr,
        time: "16:00",
        result: null,
        status: 'scheduled',
        round: 2
      });
      
      // Match 3 untuk Ronde 2 (jika masih ada tim yang tersedia)
      if (teamsForRound2.length > 3) {
        newMatches.push({
          id: nextId++,
          team1: teamsForRound2[3],
          team2: teamsForRound2.length > 4 ? teamsForRound2[4] : "",
          date: round2DateStr,
          time: "18:00",
          result: null,
          status: 'scheduled',
          round: 2
        });
      }
    }
    
    // Match untuk Special Slots di Final (selalu dibuat karena sudah punya special slot)
    if (specialSlotTeams.length > 0) {
      newMatches.push({
        id: nextId++,
        team1: specialSlotTeams[0],
        team2: specialSlotTeams.length > 1 ? specialSlotTeams[1] : "",
        date: finalsDateStr,
        time: "15:00",
        result: null,
        status: 'scheduled',
        round: 3
      });
    }
    
    // Match untuk pemenang Ronde 2 di Final
    // Hanya buat match ini jika ada pemenang dari Ronde 2
    if (round2Winners.length > 0) {
      // Jika sudah ada pemenang dari Ronde 2, buat match Final
      newMatches.push({
        id: nextId++,
        team1: round2Winners[0],
        team2: round2Winners.length > 1 ? round2Winners[1] : "",
        date: finalsDateStr,
        time: "17:00",
        result: null,
        status: 'scheduled',
        round: 3
      });
    } else {
      // Tampilkan toast bahwa Final menunggu hasil Ronde 2
      setToastMessage('Match Final akan dibuat setelah pertandingan Ronde 2 selesai!');
      setToastType('info');
      setShowToast(true);
    }
    
    // Update state dan localStorage
    setMatches(newMatches);
    localStorage.setItem('bracketA_matches', JSON.stringify(newMatches));
    
    // Tampilkan toast
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Function to generate automatic placeholder matches for Round 2 and Finals
  const _generatePlaceholderMatches = () => {
    // Gunakan fungsi baru untuk membuat bracket
    createOrUpdateBracket();
  };

  // Function to randomize teams and create matches
  const handleRandomizeTeams = () => {
    setIsRandomizing(true);
    
    // Simulate some processing time to show animation
    setTimeout(() => {
      // Shuffle all teams from Bracket A
      const shuffledTeams = shuffleArray([...bracketA]);
      
      // The last team gets a bye in Round 1 (langsung ke ronde 2)
      const newByeTeam = shuffledTeams.pop();
      
      // Save bye team to state and localStorage for future rounds
      if (newByeTeam) {
        setByeTeam(newByeTeam);
        localStorage.setItem('bracketA_byeTeam', JSON.stringify(newByeTeam));
      }
      
      // Reset special slots
      setSpecialSlots([]);
      localStorage.removeItem('bracketA_specialSlots');
      
      // Remaining teams to be paired for matches (10 tim)
      const teamsForMatches = shuffledTeams;
      
      // Create matches for Round 1
      const round1Matches: Match[] = [];
      for (let i = 0; i < teamsForMatches.length; i += 2) {
        round1Matches.push({
          id: (i / 2) + 1,
          team1: teamsForMatches[i],
          team2: teamsForMatches[i + 1],
          date: new Date().toISOString().split('T')[0], // Today's date as default
          time: '14:00', // Default time
          result: null,
          status: 'scheduled' as const,
          round: 1
        });
      }
      
      // Reset all matches in round 2 and finals
      // Only keep Round 1 matches
      
      // Save matches to state and localStorage
      setMatches(round1Matches);
      localStorage.setItem('bracketA_matches', JSON.stringify(round1Matches));
      
      // Display results
      setRandomizeResults({
        byeTeam: newByeTeam,
        round1Matches,
      });
      
      // Show toast message
      setToastMessage('Tim berhasil diacak dan bracket direset!');
      setToastType('success');
      setShowToast(true);
      
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      
      setIsRandomizing(false);
    }, 1500); // 1.5 seconds of animation
  };

  // Function to simulate matches and advance winners to the next round
  const _handleSimulateRound = () => {
    setIsRandomizing(true);
    
    // Get all matches from the current round
    const currentRound = Math.max(...matches.map(m => m.round || 1));
    const currentRoundMatches = matches.filter(m => (m.round || 1) === currentRound);
    const otherMatches = matches.filter(m => (m.round || 1) !== currentRound);
    
    // Simulate results for matches without results
    const simulatedMatches = currentRoundMatches.map(match => {
      if (match.result) return match; // Skip matches with existing results
      
      // Randomly determine winner
      const winner = Math.random() > 0.5 ? 'team1' : 'team2';
      return { ...match, result: winner, status: 'completed' as const };
    });
    
    // Get winning teams from simulated matches
    const winners = simulatedMatches.map(match => 
      match.result === 'team1' ? match.team1 : match.team2
    );
    
    // Get saved bye team if exists (tim yang langsung ke ronde 2 dari ronde 1)
    const savedByeTeam = localStorage.getItem('bracketA_byeTeam');
    let byeTeamFromRound1: string | undefined = undefined;
    if (currentRound === 1 && savedByeTeam) {
      byeTeamFromRound1 = JSON.parse(savedByeTeam);
    }
    
    // All teams advancing to next round
    const allAdvancingTeams = [...winners];
    
    // Prepare special slots for round 2 and regular matches
    const nextRoundMatches: Match[] = [];
    const specialSlotTeams: string[] = [];
    
    if (currentRound === 1) {
      // Check if all matches in Round 1 have results
      const allRound1Completed = simulatedMatches.every(match => match.result !== null);
      
      if (!allRound1Completed) {
        // If some matches don't have results, just update the simulated ones
        const updatedMatches = [...otherMatches, ...simulatedMatches];
        setMatches(updatedMatches);
        localStorage.setItem('bracketA_matches', JSON.stringify(updatedMatches));
        setIsRandomizing(false);
        return;
      }
      
      // For round 1 -> round 2 transition: we need 2 special slots
      // The team that had a bye in round 1 cannot get a special slot in round 2
      
      // Shuffle winners to randomize who gets special slots
      const shuffledWinners = shuffleArray([...winners]);
      
      // Get 2 lucky teams for special slots (cannot include byeTeamFromRound1)
      let specialSlotsCount = 0;
      const remainingTeams: string[] = [];
      
      shuffledWinners.forEach(team => {
        if (specialSlotsCount < 2 && team !== byeTeamFromRound1) {
          specialSlotTeams.push(team);
          specialSlotsCount++;
        } else {
          remainingTeams.push(team);
        }
      });
      
      // Create or update Round 2 matches
      const round2Date = new Date();
      round2Date.setDate(round2Date.getDate() + 3); // 3 days after today
      const round2DateStr = round2Date.toISOString().split('T')[0];
      
      // Create match 1 for Round 2
      const existingRound2 = otherMatches.filter(m => (m.round || 0) === 2);
      let round2Id = simulatedMatches.length > 0 ? Math.max(...simulatedMatches.map(m => m.id)) + 1 : matches.length + 1;
      
      // If we have remaining teams from round 1 winners (excluding special slots)
      if (remainingTeams.length > 0) {
        // Create or update the first Round 2 match
        if (existingRound2.length > 0) {
          // Update existing Round 2 match 1
          const match1 = existingRound2.find(m => m.id === existingRound2[0].id);
          if (match1) {
            match1.team1 = remainingTeams[0] || "TBD";
            match1.team2 = remainingTeams.length > 1 ? remainingTeams[1] : "TBD";
          }
        } else {
          // Create new Round 2 match 1
          nextRoundMatches.push({
            id: round2Id++,
            team1: remainingTeams[0] || "TBD",
            team2: remainingTeams.length > 1 ? remainingTeams[1] : "TBD",
            date: round2DateStr,
            time: '14:00',
            result: null,
            status: 'scheduled' as const,
            round: 2
          });
        }
      }
      
      // Create or update match for bye team
      if (byeTeamFromRound1) {
        const opponentForByeTeam = remainingTeams.length > 2 ? remainingTeams[2] : (remainingTeams.length > 0 ? remainingTeams[0] : "TBD");
        
        // Check if there's already a match with the bye team
        const byeTeamMatch = existingRound2.find(m => 
          m.team1 === byeTeamFromRound1 || m.team2 === byeTeamFromRound1
        );
        
        if (byeTeamMatch) {
          // Update existing match
          if (byeTeamMatch.team1 === byeTeamFromRound1) {
            byeTeamMatch.team2 = opponentForByeTeam;
          } else {
            byeTeamMatch.team1 = opponentForByeTeam;
          }
        } else {
          // Create new match
          nextRoundMatches.push({
            id: round2Id++,
            team1: byeTeamFromRound1,
            team2: opponentForByeTeam,
            date: round2DateStr,
            time: '16:00',
            result: null,
            status: 'scheduled' as const,
            round: 2
          });
        }
      }
      
      // Create additional Round 2 match if needed
      if (remainingTeams.length > 3) {
        // If we have more remaining teams, create another match
        nextRoundMatches.push({
          id: round2Id++,
          team1: remainingTeams[2] || "TBD",
          team2: remainingTeams[3] || "TBD",
          date: round2DateStr,
          time: '18:00',
          result: null,
          status: 'scheduled' as const,
          round: 2
        });
      }
      
      // Save special slots for future reference
      localStorage.setItem('bracketA_specialSlots', JSON.stringify(specialSlotTeams));
      
      // Combine all Round 2 matches
      const updatedRound2Matches = existingRound2.filter(m => 
        !nextRoundMatches.some(nm => nm.id === m.id)
      );
      const allRound2Matches = [...updatedRound2Matches, ...nextRoundMatches];
      
      // Create Finals matches
      const finalsDate = new Date();
      finalsDate.setDate(finalsDate.getDate() + 7); // 7 days after today
      const finalsDateStr = finalsDate.toISOString().split('T')[0];
      
      // Create match for special slot teams
      const finalsMatches: Match[] = [];
      if (specialSlotTeams.length === 2) {
        finalsMatches.push({
          id: round2Id + nextRoundMatches.length,
          team1: specialSlotTeams[0],
          team2: specialSlotTeams[1],
          date: finalsDateStr,
          time: '15:00',
          result: null,
          status: 'scheduled' as const,
          round: 3
        });
      }
      
      // Combine previous matches with simulated ones and new round
      const updatedMatches = [
        ...otherMatches.filter(m => (m.round || 0) !== 2), 
        ...simulatedMatches,
        ...allRound2Matches,
        ...finalsMatches
      ];
      
      // Show results
      setRandomizeResults({
        simulatedMatches,
        nextRoundMatches: allRound2Matches,
        byeTeam: byeTeamFromRound1,
        specialSlotTeams
      });
      
      // Save to state and localStorage
      setMatches(updatedMatches);
      localStorage.setItem('bracketA_matches', JSON.stringify(updatedMatches));
    } else if (currentRound === 2) {
      // For round 2 -> finals transition
      const shuffledWinners = shuffleArray(allAdvancingTeams);
      
      // Get special slot teams that are already in Finals
      const specialSlotTeams = JSON.parse(localStorage.getItem('bracketA_specialSlots') || '[]');
      
      // Create Finals match with winners from Round 2
      const finalsDate = new Date();
      finalsDate.setDate(finalsDate.getDate() + 3); // 3 days after today
      const finalsDateStr = finalsDate.toISOString().split('T')[0];
      
      if (shuffledWinners.length > 0) {
        nextRoundMatches.push({
          id: matches.length + 1,
          team1: shuffledWinners[0],
          team2: shuffledWinners.length > 1 ? shuffledWinners[1] : "TBD",
          date: finalsDateStr,
          time: '17:00',
          result: null,
          status: 'scheduled' as const,
          round: 3
        });
      }
      
      // Combine previous matches with simulated ones and new round
      const updatedMatches = [...otherMatches, ...simulatedMatches, ...nextRoundMatches];
      
      // Show results
      setRandomizeResults({
        simulatedMatches,
        nextRoundMatches,
        specialSlotTeams
      });
      
      // Save to state and localStorage
      setMatches(updatedMatches);
      localStorage.setItem('bracketA_matches', JSON.stringify(updatedMatches));
    } else {
      // For finals (no more rounds after this)
      // Just update the match results
      const updatedMatches = [...otherMatches, ...simulatedMatches];
      
      // Show results
      setRandomizeResults({
        simulatedMatches
      });
      
      // Save to state and localStorage
      setMatches(updatedMatches);
      localStorage.setItem('bracketA_matches', JSON.stringify(updatedMatches));
    }
    
    setIsRandomizing(false);
  };

  // Status label component
  const StatusLabel = ({ status }: { status: 'scheduled' | 'playing' | 'completed' }) => {
    let bgColor, textColor, label;
    
    switch(status) {
      case 'playing':
        bgColor = 'rgba(234, 88, 12, 0.2)';
        textColor = '#fdba74';
        label = 'Sedang Bertanding';
        break;
      case 'completed':
        bgColor = 'rgba(22, 163, 74, 0.2)';
        textColor = '#86efac';
        label = 'Selesai';
        break;
      default:
        bgColor = 'rgba(79, 70, 229, 0.2)';
        textColor = '#a5b4fc';
        label = 'Terjadwal';
    }
    
    return (
      <span style={{
        padding: '0.25rem 0.75rem',
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '500',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem'
      }}>
        <span style={{
          width: '0.5rem',
          height: '0.5rem',
          borderRadius: '50%',
          backgroundColor: textColor
        }}></span>
        {label}
      </span>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0f172a',
      backgroundImage: 'radial-gradient(circle at 25% 10%, rgba(79, 70, 229, 0.15) 0%, transparent 40%), radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.1) 0%, transparent 40%)'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderBottom: '1px solid rgba(79, 70, 229, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        padding: isMobile ? '0.75rem' : '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <button 
              onClick={handleBack}
              style={{
                background: 'none',
                border: 'none',
                color: '#a5b4fc',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (e && e.currentTarget) {
                  e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.1)';
                }
              }}
              onMouseOut={(e) => {
                if (e && e.currentTarget) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
              </svg>
              Kembali
            </button>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.8), rgba(67, 56, 202, 0.6))',
                padding: '0.5rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(79, 70, 229, 0.5)'
              }}>
                <Image 
                  src="/images/logo-mobile-legend-31251.png" 
                  alt="Mobile Legends Logo" 
                  width={32}
                  height={32}
                  style={{
                    height: 'auto',
                    width: 'auto',
                    filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))'
                  }}
                />
              </div>
              <div>
                <h1 style={{
                  fontSize: isMobile ? '1.1rem' : '1.25rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '0.125rem',
                  background: 'linear-gradient(to right, #fff, #a5b4fc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Bracket A</h1>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#a5b4fc',
                  letterSpacing: '0.025em'
                }}>Kelola Pertandingan</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flex: '1',
        padding: isMobile ? '1.5rem 1rem' : '2rem 1.5rem',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Randomize Teams Button Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '3rem',
          gap: '1rem',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <button 
            onClick={() => setShowRandomizeModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              color: '#c4b5fd',
              borderRadius: '0.5rem',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => {
              if (e && e.currentTarget) {
                e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(139, 92, 246, 0.2)';
              }
            }}
            onMouseOut={(e) => {
              if (e && e.currentTarget) {
                e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
              <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
            </svg>
            Acak Tim Bracket A
          </button>
          
          <button 
            onClick={createOrUpdateBracket}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'rgba(14, 165, 233, 0.2)',
              color: '#7dd3fc',
              borderRadius: '0.5rem',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => {
              if (e && e.currentTarget) {
                e.currentTarget.style.backgroundColor = 'rgba(14, 165, 233, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(14, 165, 233, 0.2)';
              }
            }}
            onMouseOut={(e) => {
              if (e && e.currentTarget) {
                e.currentTarget.style.backgroundColor = 'rgba(14, 165, 233, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2H5zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>
              <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2V7zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
            </svg>
            Buat Bracket dengan Tim Pemenang
          </button>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: isMobile ? '1.5rem' : '2rem',
            fontWeight: 'bold',
            color: 'white',
            margin: 0
          }}>Jadwal Pertandingan</h2>
          <button 
            onClick={handleAddMatch}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.2rem',
              backgroundColor: 'rgba(79, 70, 229, 0.2)',
              color: '#a5b4fc',
              borderRadius: '0.5rem',
              border: '1px solid rgba(79, 70, 229, 0.3)',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (e && e.currentTarget) {
                e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseOut={(e) => {
              if (e && e.currentTarget) {
                e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
            Tambah Pertandingan
          </button>
        </div>

        {/* Team List */}
        <div style={{
          marginBottom: '2rem',
          background: 'rgba(15, 23, 42, 0.5)',
          borderRadius: '1rem',
          padding: '1.5rem',
          border: '1px solid rgba(79, 70, 229, 0.2)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem'
          }}>Daftar Tim Bracket A</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {bracketA.map((team, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(79, 70, 229, 0.1)'
              }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(79, 70, 229, 0.2)',
                  color: '#a5b4fc',
                  borderRadius: '50%',
                  marginRight: '0.75rem',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  {index + 1}
                </div>
                <span style={{
                  color: 'white',
                  fontWeight: '500',
                  fontSize: '0.95rem'
                }}>
                  {team}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tournament Bracket Visualization */}
        <div style={{
          marginBottom: '3rem',
          background: 'rgba(15, 23, 42, 0.5)',
          borderRadius: '1rem',
          padding: '1.5rem',
          border: '1px solid rgba(79, 70, 229, 0.2)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#a5b4fc" viewBox="0 0 16 16">
              <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13zM1.5 1a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5h-13z"/>
              <path d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0zM7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z"/>
            </svg>
            Struktur Bracket Tournament
          </h3>
          
          <div style={{
            overflowX: 'auto',
            paddingBottom: '1rem'
          }}>
            <div style={{
              display: 'flex',
              minWidth: isMobile ? '800px' : 'auto',
              gap: '2rem'
            }}>
              {/* Round 1 */}
              <div style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  textAlign: 'center',
                  marginBottom: '1rem',
                  padding: '0.5rem',
                  backgroundColor: 'rgba(30, 58, 138, 0.3)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#93c5fd',
                    margin: 0
                  }}>Ronde 1</h4>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  {matches.filter(m => (m.round || 1) === 1).length > 0 ? (
                    matches.filter(m => (m.round || 1) === 1).map((match, idx) => (
                      <div key={idx} style={{
                        background: 'rgba(30, 41, 59, 0.6)',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        padding: '0.75rem',
                        position: 'relative'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#93c5fd',
                            fontWeight: '500'
                          }}>Match {match.id}</span>
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#93c5fd'
                          }}>{match.date}</span>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.5rem',
                            backgroundColor: match.result === 'team1' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(30, 41, 59, 0.8)',
                            borderRadius: '0.25rem',
                            border: match.result === 'team1' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(59, 130, 246, 0.15)'
                          }}>
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: match.result === 'team1' ? '#4ade80' : 'white'
                            }}>{match.team1}</span>
                            {match.result === 'team1' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4ade80" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                              </svg>
                            )}
                          </div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.5rem',
                            backgroundColor: match.result === 'team2' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(30, 41, 59, 0.8)',
                            borderRadius: '0.25rem',
                            border: match.result === 'team2' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(59, 130, 246, 0.15)'
                          }}>
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: match.result === 'team2' ? '#4ade80' : 'white'
                            }}>{match.team2}</span>
                            {match.result === 'team2' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4ade80" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                              </svg>
                            )}
                          </div>
                        </div>
                        
                        <div style={{
                          position: 'absolute',
                          right: '-2rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '2rem',
                          height: '2px',
                          backgroundColor: match.result ? '#4ade80' : '#475569',
                          display: isMobile ? 'none' : 'block'
                        }}></div>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      backgroundColor: 'rgba(30, 41, 59, 0.5)',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      color: '#94a3b8',
                      textAlign: 'center',
                      border: '1px dashed rgba(59, 130, 246, 0.2)'
                    }}>
                      Belum ada match
                    </div>
                  )}
                </div>
                
                {/* Bye Team */}
                {byeTeam && (
                  <div style={{
                    marginTop: '1rem',
                    backgroundColor: 'rgba(30, 58, 138, 0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#93c5fd" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                      </svg>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#93c5fd',
                        fontWeight: '500'
                      }}>Bye Team (Langsung ke Ronde 2):</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.5rem',
                      backgroundColor: 'rgba(30, 41, 59, 0.8)',
                      borderRadius: '0.25rem',
                      border: '1px solid rgba(59, 130, 246, 0.15)'
                    }}>
                      <span style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: 'white'
                      }}>{byeTeam}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Round 2 */}
              <div style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  textAlign: 'center',
                  marginBottom: '1rem',
                  padding: '0.5rem',
                  backgroundColor: 'rgba(124, 58, 237, 0.3)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#c4b5fd',
                    margin: 0
                  }}>Ronde 2</h4>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4rem',
                  marginTop: '2rem'
                }}>
                  {matches.filter(m => (m.round || 0) === 2).length > 0 ? (
                    matches.filter(m => (m.round || 0) === 2).map((match, idx) => (
                      <div key={idx} style={{
                        background: 'rgba(30, 41, 59, 0.6)',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        padding: '0.75rem',
                        position: 'relative'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#c4b5fd',
                            fontWeight: '500'
                          }}>Match {match.id}</span>
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#c4b5fd'
                          }}>{match.date}</span>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.5rem',
                            backgroundColor: match.result === 'team1' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(30, 41, 59, 0.8)',
                            borderRadius: '0.25rem',
                            border: match.result === 'team1' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(139, 92, 246, 0.15)'
                          }}>
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: match.result === 'team1' ? '#4ade80' : 'white'
                            }}>{match.team1}</span>
                            {match.result === 'team1' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4ade80" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                              </svg>
                            )}
                          </div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.5rem',
                            backgroundColor: match.result === 'team2' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(30, 41, 59, 0.8)',
                            borderRadius: '0.25rem',
                            border: match.result === 'team2' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(139, 92, 246, 0.15)'
                          }}>
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: match.result === 'team2' ? '#4ade80' : 'white'
                            }}>{match.team2}</span>
                            {match.result === 'team2' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4ade80" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                              </svg>
                            )}
                          </div>
                        </div>
                        
                        <div style={{
                          position: 'absolute',
                          right: '-2rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '2rem',
                          height: '2px',
                          backgroundColor: match.result ? '#4ade80' : '#475569',
                          display: isMobile ? 'none' : 'block'
                        }}></div>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      backgroundColor: 'rgba(30, 41, 59, 0.5)',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      color: '#94a3b8',
                      textAlign: 'center',
                      border: '1px dashed rgba(139, 92, 246, 0.2)'
                    }}>
                      Belum ada match
                    </div>
                  )}
                </div>
                
                {/* Special Slot Teams */}
                {specialSlots.length > 0 && (
                  <div style={{
                    marginTop: '2rem',
                    backgroundColor: 'rgba(234, 88, 12, 0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem',
                    border: '1px solid rgba(234, 88, 12, 0.2)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fdba74" viewBox="0 0 16 16">
                        <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
                      </svg>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#fdba74',
                        fontWeight: '500'
                      }}>Special Slots (Langsung ke Final):</span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      {specialSlots.map((team, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0.5rem',
                          backgroundColor: 'rgba(30, 41, 59, 0.8)',
                          borderRadius: '0.25rem',
                          border: '1px solid rgba(234, 88, 12, 0.3)'
                        }}>
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: 'white'
                          }}>{team}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fdba74" viewBox="0 0 16 16">
                            <path d="M8 0l1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z"/>
                            <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
                          </svg>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Finals */}
              <div style={{
                flex: '1',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{
                  textAlign: 'center',
                  marginBottom: '1rem',
                  padding: '0.5rem',
                  backgroundColor: 'rgba(234, 88, 12, 0.3)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(234, 88, 12, 0.3)'
                }}>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#fdba74',
                    margin: 0
                  }}>Final</h4>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  marginTop: '5rem',
                  alignItems: 'center'
                }}>
                  {matches.filter(m => (m.round || 0) === 3).length > 0 ? (
                    matches.filter(m => (m.round || 0) === 3).map((match, idx) => (
                      <div key={idx} style={{
                        background: 'rgba(30, 41, 59, 0.6)',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(234, 88, 12, 0.3)',
                        padding: '0.75rem',
                        position: 'relative',
                        width: '100%'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#fdba74',
                            fontWeight: '500'
                          }}>Final Match</span>
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#fdba74'
                          }}>{match.date}</span>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.5rem',
                            backgroundColor: match.result === 'team1' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(30, 41, 59, 0.8)',
                            borderRadius: '0.25rem',
                            border: match.result === 'team1' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(234, 88, 12, 0.2)'
                          }}>
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: match.result === 'team1' ? '#4ade80' : 'white'
                            }}>{match.team1}</span>
                            {match.result === 'team1' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4ade80" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                              </svg>
                            )}
                          </div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0.5rem',
                            backgroundColor: match.result === 'team2' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(30, 41, 59, 0.8)',
                            borderRadius: '0.25rem',
                            border: match.result === 'team2' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(234, 88, 12, 0.2)'
                          }}>
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: match.result === 'team2' ? '#4ade80' : 'white'
                            }}>{match.team2}</span>
                            {match.result === 'team2' && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4ade80" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      backgroundColor: 'rgba(30, 41, 59, 0.5)',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      color: '#94a3b8',
                      textAlign: 'center',
                      border: '1px dashed rgba(234, 88, 12, 0.3)',
                      width: '100%'
                    }}>
                      Final belum dijadwalkan
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '0.5rem',
            border: '1px dashed rgba(148, 163, 184, 0.3)'
          }}>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#94a3b8',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#94a3b8" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
              Format Tournament
            </h4>
            <ul style={{
              listStyleType: 'none',
              padding: 0,
              margin: 0,
              color: '#94a3b8',
              fontSize: '0.875rem'
            }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#94a3b8" viewBox="0 0 16 16">
                  <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                </svg>
                Dari 11 tim, 1 tim mendapat bye ke Ronde 2
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#94a3b8" viewBox="0 0 16 16">
                  <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                </svg>
                Setelah Ronde 1, 2 tim pemenang mendapat slot langsung ke Final
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#94a3b8" viewBox="0 0 16 16">
                  <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                </svg>
                Tim dengan slot bye tidak bisa mendapat slot langsung ke Final
              </li>
            </ul>
          </div>
        </div>

        {/* Matches Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {matches.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: 'rgba(30, 41, 59, 0.3)',
              borderRadius: '1rem',
              color: '#a5b4fc',
              gridColumn: '1 / -1'
            }}>
              <p>Belum ada pertandingan yang dijadwalkan. Silakan tambah pertandingan baru.</p>
            </div>
          ) : (
            matches.map(match => (
              <div key={match.id} style={{
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(67, 56, 202, 0.05))',
                borderRadius: '1rem',
                overflow: 'hidden',
                border: '1px solid rgba(79, 70, 229, 0.2)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: match.status === 'playing' ? 'linear-gradient(90deg, #ea580c, #fdba74)' :
                              match.status === 'completed' ? 'linear-gradient(90deg, #16a34a, #86efac)' :
                              'linear-gradient(90deg, #4f46e5, #8b5cf6)',
                  zIndex: 1
                }}></div>
                <div style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{color: '#a5b4fc'}}>
                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                      </svg>
                      <span style={{
                        color: '#a5b4fc',
                        fontSize: '0.875rem'
                      }}>{match.date} - {match.time}</span>
                    </div>
                    <StatusLabel status={match.status} />
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem'
                    }}>
                      <button 
                        onClick={() => handleEditMatch(match)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: 'rgba(79, 70, 229, 0.1)',
                          color: '#a5b4fc',
                          borderRadius: '0.25rem',
                          border: '1px solid rgba(79, 70, 229, 0.2)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          if (e && e.currentTarget) {
                            e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.2)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (e && e.currentTarget) {
                            e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.1)';
                          }
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteMatch(match.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: 'rgba(220, 38, 38, 0.1)',
                          color: '#f87171',
                          borderRadius: '0.25rem',
                          border: '1px solid rgba(220, 38, 38, 0.2)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          if (e && e.currentTarget) {
                            e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.2)';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (e && e.currentTarget) {
                            e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
                          }
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                    
                    {match.status !== 'completed' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {match.status === 'scheduled' ? (
                          <button
                            onClick={() => handleStatusChange(match.id, 'playing')}
                            style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: 'rgba(234, 88, 12, 0.1)',
                              color: '#fdba74',
                              borderRadius: '0.25rem',
                              border: '1px solid rgba(234, 88, 12, 0.2)',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            Mulai Pertandingan
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(match.id, 'scheduled')}
                            style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: 'rgba(79, 70, 229, 0.1)',
                              color: '#a5b4fc',
                              borderRadius: '0.25rem',
                              border: '1px solid rgba(79, 70, 229, 0.2)',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            Reset Status
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      backgroundColor: match.result === 'team1' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(79, 70, 229, 0.05)',
                      borderRadius: '0.5rem',
                      border: '1px solid',
                      borderColor: match.result === 'team1' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(79, 70, 229, 0.1)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{
                          color: 'white',
                          fontWeight: '500'
                        }}>{match.team1}</span>
                        {match.result === 'team1' && (
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '9999px',
                            backgroundColor: 'rgba(34, 197, 94, 0.2)',
                            color: '#4ade80'
                          }}>Menang</span>
                        )}
                        {match.result === 'team2' && (
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '9999px',
                            backgroundColor: 'rgba(220, 38, 38, 0.2)',
                            color: '#f87171'
                          }}>Kalah</span>
                        )}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem'
                      }}>
                        {match.status === 'playing' && (
                          <button 
                            onClick={() => handleResultChange(match.id, 'team1')}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: match.result === 'team1' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(79, 70, 229, 0.1)',
                              color: match.result === 'team1' ? '#4ade80' : '#a5b4fc',
                              borderRadius: '0.25rem',
                              border: '1px solid',
                              borderColor: match.result === 'team1' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(79, 70, 229, 0.2)',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              if (e && e.currentTarget && match.result !== 'team1') {
                                e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.2)';
                              }
                            }}
                            onMouseOut={(e) => {
                              if (e && e.currentTarget && match.result !== 'team1') {
                                e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.1)';
                              }
                            }}
                          >
                            Menang
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      backgroundColor: match.result === 'team2' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(79, 70, 229, 0.05)',
                      borderRadius: '0.5rem',
                      border: '1px solid',
                      borderColor: match.result === 'team2' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(79, 70, 229, 0.1)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{
                          color: 'white',
                          fontWeight: '500'
                        }}>{match.team2}</span>
                        {match.result === 'team2' && (
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '9999px',
                            backgroundColor: 'rgba(34, 197, 94, 0.2)',
                            color: '#4ade80'
                          }}>Menang</span>
                        )}
                        {match.result === 'team1' && (
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '9999px',
                            backgroundColor: 'rgba(220, 38, 38, 0.2)',
                            color: '#f87171'
                          }}>Kalah</span>
                        )}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem'
                      }}>
                        {match.status === 'playing' && (
                          <button 
                            onClick={() => handleResultChange(match.id, 'team2')}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: match.result === 'team2' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(79, 70, 229, 0.1)',
                              color: match.result === 'team2' ? '#4ade80' : '#a5b4fc',
                              borderRadius: '0.25rem',
                              border: '1px solid',
                              borderColor: match.result === 'team2' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(79, 70, 229, 0.2)',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              if (e && e.currentTarget && match.result !== 'team2') {
                                e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.2)';
                              }
                            }}
                            onMouseOut={(e) => {
                              if (e && e.currentTarget && match.result !== 'team2') {
                                e.currentTarget.style.backgroundColor = 'rgba(79, 70, 229, 0.1)';
                              }
                            }}
                          >
                            Menang
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      
      {/* Add/Edit Match Modal */}
      {showAddMatchModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          backdropFilter: 'blur(5px)',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#1f2937',
            borderRadius: '1rem',
            width: isMobile ? '90%' : '500px',
            maxWidth: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(79, 70, 229, 0.3)'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(79, 70, 229, 0.2)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>{editingMatch ? 'Edit Pertandingan' : 'Tambah Pertandingan Baru'}</h3>
            </div>
            
            <form onSubmit={handleSubmitForm} style={{
              padding: '1.5rem'
            }}>
              <div style={{
                marginBottom: '1.5rem'
              }}>
                <label htmlFor="team1" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#d1d5db',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>Tim 1</label>
                <select
                  id="team1"
                  name="team1"
                  value={formData.team1 || ''}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(75, 85, 99, 0.4)',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                >
                  <option value="">-- Pilih Tim --</option>
                  {bracketA.map((team, idx) => (
                    <option key={idx} value={team}>{team}</option>
                  ))}
                </select>
              </div>
              
              <div style={{
                marginBottom: '1.5rem'
              }}>
                <label htmlFor="team2" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#d1d5db',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>Tim 2</label>
                <select
                  id="team2"
                  name="team2"
                  value={formData.team2 || ''}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(75, 85, 99, 0.4)',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                >
                  <option value="">-- Pilih Tim --</option>
                  {bracketA.map((team, idx) => (
                    <option key={idx} value={team}>{team}</option>
                  ))}
                </select>
              </div>
              
              <div style={{
                marginBottom: '1.5rem'
              }}>
                <label htmlFor="date" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#d1d5db',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>Tanggal</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date || ''}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(75, 85, 99, 0.4)',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div style={{
                marginBottom: '1.5rem'
              }}>
                <label htmlFor="time" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#d1d5db',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>Waktu</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time || ''}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(75, 85, 99, 0.4)',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>
              
              <div style={{
                marginBottom: '2rem'
              }}>
                <label htmlFor="status" style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#d1d5db',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status || 'scheduled'}
                  onChange={handleFormChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(75, 85, 99, 0.4)',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                >
                  <option value="scheduled">Terjadwal</option>
                  <option value="playing">Sedang Bertanding</option>
                  <option value="completed">Selesai</option>
                </select>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem'
              }}>
                <button
                  type="button"
                  onClick={() => setShowAddMatchModal(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'rgba(31, 41, 55, 0.6)',
                    color: '#d1d5db',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(75, 85, 99, 0.4)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'rgba(79, 70, 229, 0.8)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(79, 70, 229, 0.6)',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {editingMatch ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Randomize Modal */}
      {showRandomizeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          backdropFilter: 'blur(8px)',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#1f2937',
            borderRadius: '1rem',
            width: isMobile ? '95%' : '600px',
            maxWidth: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(79, 70, 229, 0.3)'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(79, 70, 229, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>Acak Tim Bracket A</h3>
              <button
                onClick={() => setShowRandomizeModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.25rem'
                }}
              >
                &times;
              </button>
            </div>
            
            <div style={{
              padding: '1.5rem'
            }}>
              {isRandomizing ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem'
                }}>
                  <div style={{
                    display: 'inline-block',
                    width: '3rem',
                    height: '3rem',
                    border: '0.25rem solid rgba(79, 70, 229, 0.3)',
                    borderTopColor: '#8b5cf6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '1.5rem'
                  }}></div>
                  <style jsx>{`
                    @keyframes spin {
                      to { transform: rotate(360deg); }
                    }
                  `}</style>
                  <p style={{
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: '500'
                  }}>Mengacak Tim...</p>
                </div>
              ) : randomizeResults ? (
                <div>
                  <div style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(79, 70, 229, 0.2)'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      color: '#a5b4fc',
                      marginBottom: '0.75rem'
                    }}>Tim dengan Slot Khusus (Bye):</h4>
                    <div style={{
                      backgroundColor: 'rgba(30, 41, 59, 0.6)',
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      color: 'white',
                      fontWeight: '500'
                    }}>
                      {randomizeResults.byeTeam}
                    </div>
                  </div>
                  
                  {randomizeResults.specialSlotTeams && randomizeResults.specialSlotTeams.length > 0 && (
                    <div style={{
                      marginBottom: '1.5rem',
                      padding: '1rem',
                      backgroundColor: 'rgba(234, 88, 12, 0.1)',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(234, 88, 12, 0.2)'
                    }}>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#fdba74',
                        marginBottom: '0.75rem'
                      }}>Tim dengan Slot Khusus (Langsung ke Final):</h4>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        {randomizeResults.specialSlotTeams.map((team, idx) => (
                          <div key={idx} style={{
                            backgroundColor: 'rgba(30, 41, 59, 0.6)',
                            padding: '0.75rem',
                            borderRadius: '0.375rem',
                            color: 'white',
                            fontWeight: '500',
                            border: '1px solid rgba(234, 88, 12, 0.3)'
                          }}>
                            {team}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {randomizeResults.round1Matches && (
                    <div style={{
                      marginBottom: '1.5rem'
                    }}>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#a5b4fc',
                        marginBottom: '0.75rem'
                      }}>Pertandingan Ronde 1:</h4>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        {randomizeResults.round1Matches.map((match, idx) => (
                          <div key={idx} style={{
                            backgroundColor: 'rgba(30, 41, 59, 0.6)',
                            padding: '0.75rem',
                            borderRadius: '0.375rem',
                            color: 'white'
                          }}>
                            <div style={{fontWeight: '500'}}>Match {idx + 1}:</div>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                              <span>{match.team1}</span>
                              <span>VS</span>
                              <span>{match.team2}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {randomizeResults.simulatedMatches && (
                    <div style={{
                      marginBottom: '1.5rem'
                    }}>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#a5b4fc',
                        marginBottom: '0.75rem'
                      }}>Hasil Simulasi:</h4>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        {randomizeResults.simulatedMatches.map((match, idx) => (
                          <div key={idx} style={{
                            backgroundColor: 'rgba(30, 41, 59, 0.6)',
                            padding: '0.75rem',
                            borderRadius: '0.375rem',
                            color: 'white'
                          }}>
                            <div style={{fontWeight: '500'}}>Match {idx + 1}:</div>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                              <span style={{
                                color: match.result === 'team1' ? '#4ade80' : 'white',
                                fontWeight: match.result === 'team1' ? '600' : '400'
                              }}>{match.team1}</span>
                              <span>VS</span>
                              <span style={{
                                color: match.result === 'team2' ? '#4ade80' : 'white',
                                fontWeight: match.result === 'team2' ? '600' : '400'
                              }}>{match.team2}</span>
                            </div>
                            <div style={{
                              marginTop: '0.5rem',
                              fontSize: '0.875rem',
                              color: '#4ade80',
                              textAlign: 'center'
                            }}>
                              Pemenang: {match.result === 'team1' ? match.team1 : match.team2}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {randomizeResults.nextRoundMatches && randomizeResults.nextRoundMatches.length > 0 && (
                    <div style={{
                      marginBottom: '1.5rem'
                    }}>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#a5b4fc',
                        marginBottom: '0.75rem'
                      }}>Pertandingan Ronde Berikutnya:</h4>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        {randomizeResults.nextRoundMatches.map((match, idx) => (
                          <div key={idx} style={{
                            backgroundColor: 'rgba(30, 41, 59, 0.6)',
                            padding: '0.75rem',
                            borderRadius: '0.375rem',
                            color: 'white'
                          }}>
                            <div style={{fontWeight: '500'}}>Match {idx + 1}:</div>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                              <span>{match.team1}</span>
                              <span>VS</span>
                              <span>{match.team2}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '1rem',
                    marginTop: '1rem'
                  }}>
                    <button
                      onClick={() => {
                        setRandomizeResults(null);
                        setShowRandomizeModal(false);
                      }}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: 'rgba(79, 70, 229, 0.8)',
                        color: 'white',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(79, 70, 229, 0.6)',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{
                    color: '#d1d5db',
                    marginBottom: '1.5rem',
                    lineHeight: '1.5'
                  }}>
                    Fitur ini akan mengacak tim-tim di Bracket A dan membuat struktur pertandingan baru. 
                    Tim akan diacak untuk pertandingan Ronde 1, dan satu tim akan mendapatkan slot khusus.
                  </p>
                  
                  <div style={{
                    backgroundColor: 'rgba(248, 113, 113, 0.1)',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    border: '1px solid rgba(248, 113, 113, 0.2)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      color: '#f87171'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                      </svg>
                      <span style={{fontWeight: '600'}}>Perhatian!</span>
                    </div>
                    <p style={{
                      color: '#ef4444',
                      fontSize: '0.875rem'
                    }}>
                      Tindakan ini akan menghapus semua pertandingan yang ada dan membuat ulang jadwal. 
                      Pastikan Anda telah mencadangkan data penting sebelum melanjutkan.
                    </p>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <button
                      onClick={() => setShowRandomizeModal(false)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: 'rgba(31, 41, 55, 0.6)',
                        color: '#d1d5db',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(75, 85, 99, 0.4)',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        flex: '1'
                      }}
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleRandomizeTeams}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: 'rgba(79, 70, 229, 0.8)',
                        color: 'white',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(79, 70, 229, 0.6)',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        flex: '1',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
                        <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
                      </svg>
                      Acak Sekarang
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer style={{
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderTop: '1px solid rgba(79, 70, 229, 0.3)',
        padding: isMobile ? '1rem' : '1.5rem',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.875rem',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <Image 
              src="/images/logo-mobile-legend-31251.png" 
              alt="Mobile Legends Logo" 
              width={20}
              height={20}
              style={{
                height: 'auto',
                width: 'auto',
                filter: 'grayscale(50%) brightness(80%)'
              }}
            />
            <Image 
              src="/images/infoikamtif 11.png" 
              alt="IKMATIF Logo" 
              width={20}
              height={20}
              style={{
                height: 'auto',
                width: 'auto',
                filter: 'grayscale(50%) brightness(80%)'
              }}
            />
          </div>
          <p>© 2025 ML Tournament Admin Panel. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: toastType === 'success' ? 'rgba(34, 197, 94, 0.9)' : 
                           toastType === 'error' ? 'rgba(220, 38, 38, 0.9)' : 
                           'rgba(59, 130, 246, 0.9)',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 1000
        }}>
          {toastType === 'success' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          )}
          {toastType === 'error' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
            </svg>
          )}
          {toastType === 'info' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            </svg>
          )}
          <span style={{ fontWeight: '500' }}>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default BracketAPage; 