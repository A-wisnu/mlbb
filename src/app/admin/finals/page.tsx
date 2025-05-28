'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getBracketASpecialSlots, 
  getBracketBSpecialSlots,
  getBracketARound2Winners,
  getBracketBRound2Winners,
  saveFinalsData, 
  getFinalsData,
  resetFinalsData,
  deleteFinalsData,
} from '../../../firebase/firestore';
import { Team } from '../../../types';

const createInitialMatches = (teams: Team[]): { team1: Team; team2: Team }[] => {
  const matches = [];
  for (let i = 0; i < teams.length; i += 2) {
    if (i+1 < teams.length) {
      matches.push({ team1: teams[i], team2: teams[i+1] });
    } else {
      matches.push({ team1: teams[i], team2: { id: -1, name: "BYE" } });
    }
  }
  return matches;
};

const AdminFinals = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [quarterFinalMatches, setQuarterFinalMatches] = useState<{ team1: Team; team2: Team; winner?: string }[]>([]);
  const [semiFinalMatches, setSemiFinalMatches] = useState<{ team1: Team; team2: Team; winner?: string }[]>([]);
  const [finalMatch, setFinalMatch] = useState<{ team1: Team; team2: Team; winner?: string } | null>(null);
  const [thirdPlaceMatch, setThirdPlaceMatch] = useState<{ team1: Team; team2: Team; winner?: string } | null>(null);
  const [champion, setChampion] = useState<string | null>(null);
  const [runnerUp, setRunnerUp] = useState<string | null>(null);
  const [thirdPlace, setThirdPlace] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  const autoGenerateQuarterFinals = () => {
    if (allTeams.length === 8) {
      // Buat pertandingan perempat final yang terstruktur berdasarkan seeding
      // Seeding: Alternating A1-B4, B1-A4, A2-B3, B2-A3
      const teamsFromA = allTeams.filter(team => team.id <= 4);
      const teamsFromB = allTeams.filter(team => team.id > 4);

      // Pastikan semua tim tersedia
      if (teamsFromA.length === 4 && teamsFromB.length === 4) {
        const qfMatches = [
          { team1: teamsFromA[0], team2: teamsFromB[3], winner: undefined },
          { team1: teamsFromB[0], team2: teamsFromA[3], winner: undefined },
          { team1: teamsFromA[1], team2: teamsFromB[2], winner: undefined },
          { team1: teamsFromB[1], team2: teamsFromA[2], winner: undefined }
        ];
        setQuarterFinalMatches(qfMatches);
        showSuccessMessage('Bracket perempat final berhasil dibuat');
      } else {
        showErrorMessage('Data tim tidak lengkap untuk membuat perempat final');
      }
    } else {
      showErrorMessage('Diperlukan tepat 8 tim untuk membuat bracket perempat final');
    }
  };

  const fetchDataFromFirestore = async () => {
      try {
        setIsLoading(true);
      setIsOffline(false);
      
      // Debug: Tampilkan data mentah
      console.log("Mencoba mengambil data pemenang...");
      
      // Ambil data dari special slots
      const specialSlotsA = await getBracketASpecialSlots(); 
      const specialSlotsB = await getBracketBSpecialSlots(); 
      
      // Ambil data dari pemenang ronde 2
      const round2A = await getBracketARound2Winners();
      const round2B = await getBracketBRound2Winners();
      
      // Gabungkan data dan hapus duplikat
      const winnersA = [...new Set([...specialSlotsA, ...round2A])]; 
      const winnersB = [...new Set([...specialSlotsB, ...round2B])]; 
      
      console.log("Data pemenang Bracket A:", { specialSlots: specialSlotsA, round2Winners: round2A, combined: winnersA });
      console.log("Data pemenang Bracket B:", { specialSlots: specialSlotsB, round2Winners: round2B, combined: winnersB });
      
      // Jangan gunakan data dummy, hanya gunakan data asli
      const finalTeamsA = [...winnersA];
      const finalTeamsB = [...winnersB];
      
      // Periksa jumlah tim
      if (finalTeamsA.length < 4 || finalTeamsB.length < 4) {
        setErrorMessage(`Jumlah tim tidak cukup (A: ${finalTeamsA.length}/4, B: ${finalTeamsB.length}/4). Pastikan 8 tim telah ditentukan sebagai pemenang.`);
        return;
      }
      
      // Konversi ke format Team
      const teamsFromA: Team[] = finalTeamsA.slice(0, 4).map((name: string, idx: number) => ({ id: idx + 1, name }));
      const teamsFromB: Team[] = finalTeamsB.slice(0, 4).map((name: string, idx: number) => ({ id: idx + 5, name }));
      const combinedTeams = [...teamsFromA, ...teamsFromB];
      
      console.log("Combined teams for finals:", combinedTeams);
      
      if (combinedTeams.length === 8) { // Membutuhkan tepat 8 tim
        setAllTeams(combinedTeams);
        
        // Tidak perlu membuat pertandingan secara otomatis di sini
        // Akan menggunakan fungsi autoGenerateQuarterFinals() untuk itu
      } else {
        setErrorMessage(`Jumlah tim tidak sesuai (${combinedTeams.length}/8). Pastikan jumlah pemenang tepat 4 tim dari Bracket A dan 4 tim dari Bracket B.`);
      }
      } catch (error) {
        console.error('Error fetching data:', error);
      setErrorMessage('Terjadi kesalahan saat mengambil data tim final');
      setIsOffline(true);
      } finally {
        setIsLoading(false);
      }
    };
    
  useEffect(() => {
    fetchDataFromFirestore();
    
    const handleOnlineStatus = () => {
      if (navigator.onLine) {
        setIsOffline(false);
        if (isOffline) {
          fetchDataFromFirestore();
        }
      } else {
        setIsOffline(true);
      }
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [isOffline]);
  
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setSuccessMessage('');
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const handleWinnerSelection = (round: 'quarter' | 'semi' | 'final' | 'thirdPlace', matchIndex: number, winnerName: string) => {
    if (round === 'quarter') {
      const updatedMatches = [...quarterFinalMatches];
      updatedMatches[matchIndex].winner = winnerName;
      setQuarterFinalMatches(updatedMatches);
      if (updatedMatches.every(match => match.winner)) {
        const winners = updatedMatches.map(match => allTeams.find(t => t.name === match.winner!)).filter(Boolean) as Team[];
        if (winners.length === 4) {
          const sfMatches = createInitialMatches(winners);
          setSemiFinalMatches(sfMatches.map(match => ({ ...match, winner: undefined })));
        }
      }
    } else if (round === 'semi') {
      const updatedMatches = [...semiFinalMatches];
      updatedMatches[matchIndex].winner = winnerName;
      setSemiFinalMatches(updatedMatches);
      if (updatedMatches.every(match => match.winner)) {
        const winners = updatedMatches.map(match => allTeams.find(t => t.name === match.winner!)).filter(Boolean) as Team[];
        const losers = updatedMatches.map(match => {
          const loserName = match.team1.name === match.winner ? match.team2.name : match.team1.name;
          return allTeams.find(t => t.name === loserName);
        }).filter(Boolean) as Team[];
        if (winners.length === 2) {
          setFinalMatch({ team1: winners[0], team2: winners[1], winner: undefined });
        }
        if (losers.length === 2) {
          setThirdPlaceMatch({ team1: losers[0], team2: losers[1], winner: undefined });
        }
      }
    } else if (round === 'final') {
      if (finalMatch) {
        const updatedMatch = { ...finalMatch, winner: winnerName };
        setFinalMatch(updatedMatch);
        setChampion(winnerName);
        setRunnerUp(winnerName === finalMatch.team1.name ? finalMatch.team2.name : finalMatch.team1.name);
      }
    } else if (round === 'thirdPlace') {
      if (thirdPlaceMatch) {
        const updatedMatch = { ...thirdPlaceMatch, winner: winnerName };
        setThirdPlaceMatch(updatedMatch);
        setThirdPlace(winnerName);
      }
    }
  };

  const handleSaveFinals = async () => {
    try {
      setIsLoading(true);
      
      // Simpan data yang tersedia, bahkan jika pemenang belum ditentukan
      await saveFinalsData({
        // Gunakan nilai default jika belum ada pemenang
        champion: champion || '',
        runnerUp: runnerUp || '',
        thirdPlace: thirdPlace || '',
        quarterFinals: quarterFinalMatches.map(match => ({
          team1: match.team1,
          team2: match.team2,
          winner: match.winner || ''
        })),
        semiFinals: semiFinalMatches.map(match => ({
          team1: match.team1,
          team2: match.team2,
          winner: match.winner || ''
        })),
        finalMatch: finalMatch ? {
          team1: finalMatch.team1,
          team2: finalMatch.team2,
          winner: finalMatch.winner || ''
        } : null,
        thirdPlaceMatch: thirdPlaceMatch ? {
          team1: thirdPlaceMatch.team1,
          team2: thirdPlaceMatch.team2,
          winner: thirdPlaceMatch.winner || ''
        } : null,
      });
      
      showSuccessMessage('Data final berhasil disimpan! Data sudah dapat dilihat di halaman publik.');
    } catch (error) {
      console.error('Error saving finals data:', error);
      showErrorMessage('Gagal menyimpan data final.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !allTeams.length) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(79, 70, 229, 0.3)',
            borderTop: '4px solid rgba(79, 70, 229, 1)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{
            color: '#a5b4fc',
            fontSize: '1.25rem',
            fontWeight: '500'
          }}>Memuat Data...</p>
          <style jsx global>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  const renderMatchCard = (
    match: { team1: Team; team2: Team; winner?: string },
    round: 'quarter' | 'semi' | 'final' | 'thirdPlace',
    matchIndex: number,
    title: string
  ) => {
    if (!match || !match.team1 || !match.team2) {
      return (
        <div key={`${round}-${matchIndex}`} style={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            minWidth: isMobile ? '100%' : '280px',
            textAlign: 'center'
        }}>
            <h3 style={{ color: '#f59e0b', marginBottom: '0.75rem', fontSize: isMobile ? '1rem' : '1.1rem' }}>{title}</h3>
            <p style={{color: '#9ca3af'}}>Menunggu tim...</p>
        </div>
      );
    }

    const { team1, team2, winner } = match;

    return (
      <div key={`${round}-${matchIndex}-${team1.id}-${team2.id}`} style={{
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        minWidth: isMobile ? '100%' : '280px'
      }}>
        {title && (
          <h3 style={{ color: '#f59e0b', marginBottom: '0.75rem', textAlign:'center', fontSize: isMobile ? '1rem' : '1.1rem' }}>{title}</h3>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[team1, team2].map((team, teamIdx) => (
            team.name === "BYE" ? 
            <div key={teamIdx} style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: 'rgba(71, 85, 105, 0.5)', textAlign: 'center', fontStyle: 'italic'}}>{team.name}</div> :
            <button
              key={team.id || teamIdx}
              onClick={() => handleWinnerSelection(round, matchIndex, team.name)}
              disabled={!!winner}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: winner === team.name ? '#10b981' : (winner && winner !== team.name ? 'rgba(239, 68, 68, 0.7)' : 'rgba(55, 65, 81, 0.8)'),
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: winner ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                fontWeight: winner === team.name ? 'bold' : 'normal',
                opacity: winner && winner !== team.name ? 0.6 : 1,
                transition: 'background-color 0.2s ease, opacity 0.2s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{team.name}</span>
              {winner === team.name && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{color: 'white'}}>
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
              )}
              {winner && winner !== team.name && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{color: 'white'}}>
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
              )}
            </button>
          ))}
        </div>
        {winner && (
          <div style={{
            marginTop: '0.75rem',
            padding: '0.5rem',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '4px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            justifyContent: 'center'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#10b981" viewBox="0 0 16 16">
              <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
            </svg>
            <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>
              Pemenang: {winner}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      backgroundImage: 'radial-gradient(circle at 25% 10%, rgba(245, 158, 11, 0.15) 0%, transparent 40%), radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.1) 0%, transparent 40%)',
      color: 'white',
      padding: isMobile ? '1rem' : '2rem'
    }}>
      <header style={{
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        padding: isMobile ? '0.75rem' : '1rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)',
        marginBottom: '2rem'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            color: 'inherit'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.8), rgba(234, 88, 12, 0.6))',
              padding: '0.5rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.5)'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{color: 'white'}}>
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
              </svg>
            </div>
            <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 'bold', color: '#facc15'}}>Admin Panel - Final Stage</h1>
          </Link>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/admin/finals/select-winners" style={{
              backgroundColor: 'rgba(79, 70, 229, 0.2)',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#a5b4fc',
              fontSize: '0.875rem',
              transition: 'background-color 0.2s ease',
              border: '1px solid rgba(79, 70, 229, 0.5)'
            }}>
              Pilih Pemenang Manual
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {successMessage && (
          <div style={{ backgroundColor: '#10b981', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div style={{ backgroundColor: '#ef4444', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
            {errorMessage}
          </div>
        )}
        
        {/* Debug Button */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={async () => {
              try {
                const data = await getFinalsData();
                console.log('Current Finals Data:', data);
                alert('Data dicek. Lihat console untuk detailnya.');
              } catch (error) {
                console.error('Error checking finals data:', error);
              }
            }} 
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Periksa Data Final
          </button>
          
          <button 
            onClick={async () => {
              try {
                // Tidak perlu validasi yang mengharuskan adanya pemenang
                const currentData = {
                  champion: champion || '',
                  runnerUp: runnerUp || '',
                  thirdPlace: thirdPlace || '',
                  quarterFinals: quarterFinalMatches.map(match => ({
                    team1: match.team1,
                    team2: match.team2,
                    winner: match.winner || ''
                  })),
                  semiFinals: semiFinalMatches.map(match => ({
                    team1: match.team1,
                    team2: match.team2,
                    winner: match.winner || ''
                  })),
                  finalMatch: finalMatch ? {
                    team1: finalMatch.team1,
                    team2: finalMatch.team2,
                    winner: finalMatch.winner || ''
                  } : null,
                  thirdPlaceMatch: thirdPlaceMatch ? {
                    team1: thirdPlaceMatch.team1,
                    team2: thirdPlaceMatch.team2,
                    winner: thirdPlaceMatch.winner || ''
                  } : null,
                };
                
                console.log('Mencoba menyimpan ulang data:', currentData);
                setIsLoading(true);
                await saveFinalsData(currentData);
                showSuccessMessage('Data final berhasil disimpan ulang! Data sudah dapat dilihat di halaman publik.');
              } catch (error) {
                console.error('Error re-saving finals data:', error);
                showErrorMessage('Gagal menyimpan ulang data final.');
              } finally {
                setIsLoading(false);
              }
            }} 
            style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Simpan Ulang Data Final
          </button>
          
          <button 
            onClick={async () => {
              if (window.confirm('Yakin ingin mereset data final? Ini akan menghapus data di halaman publik final.')) {
                try {
                  setIsLoading(true);
                  await resetFinalsData();
                  showSuccessMessage('Data final berhasil direset! Halaman publik final telah dikosongkan.');
                } catch (error) {
                  console.error('Error resetting finals data:', error);
                  showErrorMessage('Gagal mereset data final.');
                } finally {
                  setIsLoading(false);
                }
              }
            }} 
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Reset Data Halaman Final
          </button>
          
          <button 
            onClick={async () => {
              if (window.confirm('PERINGATAN: Ini akan menghapus SEMUA data final secara permanen! Yakin?')) {
                try {
                  setIsLoading(true);
                  await deleteFinalsData();
                  // Reload halaman untuk membersihkan state
                  showSuccessMessage('Data final dihapus total! Halaman akan dimuat ulang...');
                  setTimeout(() => {
                    window.location.reload();
                  }, 1500);
                } catch (error) {
                  console.error('Error deleting finals data completely:', error);
                  showErrorMessage('Gagal menghapus data final sepenuhnya.');
                  setIsLoading(false);
                }
              }
            }} 
            style={{
              backgroundColor: '#7f1d1d',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Reset Total & Reload
          </button>
        </div>
        
        {/* Info Panel */}
          <div style={{
          backgroundColor: 'rgba(37, 99, 235, 0.1)', 
          border: '1px solid rgba(37, 99, 235, 0.3)', 
          borderRadius: '8px', 
            padding: '1rem',
          marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{color: '#3b82f6'}}>
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            </svg>
          <div>
            <p style={{color: '#60a5fa', margin: 0, fontWeight: 'bold'}}>Petunjuk Penyimpanan Data</p>
            <p style={{color: '#93c5fd', margin: '0.25rem 0 0 0', fontSize: '0.9rem'}}>
              Anda dapat menyimpan data final meskipun belum menyelesaikan semua pertandingan. Data akan segera terlihat di halaman publik.
            </p>
          </div>
        </div>

        {isOffline && (
          <div style={{
            backgroundColor: '#f59e0b', 
            color: 'white', 
            padding: '1rem',
            borderRadius: '8px', 
            marginBottom: '1.5rem', 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
            </svg>
              <span style={{ fontWeight: 'bold' }}>Status: Offline</span>
            </div>
            <p>Koneksi ke Firebase tidak tersedia. Silahkan periksa koneksi internet Anda.</p>
            <button 
              onClick={fetchDataFromFirestore}
              style={{
                backgroundColor: 'white',
                color: '#f59e0b',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
            >
              Coba Lagi
            </button>
          </div>
        )}
        
        {!isLoading && !quarterFinalMatches.length && !finalMatch && !errorMessage && (
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div style={{textAlign: 'center'}}>
              <h2 style={{ fontSize: '1.25rem', color: '#f59e0b', marginBottom: '0.75rem' }}>Data Tim Final Tersedia</h2>
              <p style={{color: '#9ca3af', fontSize: '1rem'}}>8 tim telah tersedia untuk membuat bracket final. Pilih opsi berikut:</p>
                </div>
            
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
              <button 
                onClick={autoGenerateQuarterFinals}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm1.5.5A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13z"/>
                </svg>
                Buat Bracket Perempat Final
              </button>
            </div>
          </div>
        )}
        
        {quarterFinalMatches.length > 0 && (
          <>
            <div style={{
              backgroundColor: 'rgba(30, 41, 59, 0.4)',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', color: '#f59e0b', margin: 0 }}>
                Perempat Final
              </h2>
            </div>
            
            <div className="quarter-finals" style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '2.5rem'
            }}>
              {quarterFinalMatches.map((match, idx) => renderMatchCard(match, 'quarter', idx, `QF Match ${idx+1}`))}
            </div>
          </>
        )}
        
        {semiFinalMatches.length > 0 && (
          <>
            <div style={{
              backgroundColor: 'rgba(30, 41, 59, 0.4)',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', color: '#f59e0b', margin: 0 }}>
                Semi Final
              </h2>
            </div>
            
            <div className="semi-finals" style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '2.5rem'
            }}>
              {semiFinalMatches.map((match, idx) => renderMatchCard(match, 'semi', idx, `SF Match ${idx+1}`))}
            </div>
          </>
        )}
        
        {(finalMatch || thirdPlaceMatch) && (
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                backgroundColor: 'rgba(30, 41, 59, 0.4)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', color: '#f59e0b', margin: 0 }}>
                  Final
                </h2>
              </div>
              {finalMatch ? renderMatchCard(finalMatch, 'final', 0, '') : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Menunggu semifinal...</div>
              )}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{
                backgroundColor: 'rgba(30, 41, 59, 0.4)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', color: '#f59e0b', margin: 0 }}>
                  Juara 3
                </h2>
              </div>
              {thirdPlaceMatch ? renderMatchCard(thirdPlaceMatch, 'thirdPlace', 0, '') : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Menunggu semifinal...</div>
              )}
            </div>
          </div>
        )}

        {quarterFinalMatches.length > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '2rem',
            marginBottom: '2rem'
          }}>
            <button
              onClick={fetchDataFromFirestore}
              style={{
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                color: '#a5b4fc',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(79, 70, 229, 0.5)',
                cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
            >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
            </svg>
              Muat Ulang Data
            </button>
          </div>
        )}
        
        {!isLoading && !quarterFinalMatches.length && !finalMatch && !errorMessage && (
          <div style={{textAlign: 'center', marginTop: '3rem'}}>
            <p style={{color: '#9ca3af', fontSize: '1.1rem'}}>Data tim final sedang diproses atau tidak ada tim yang memenuhi syarat.</p>
            <p style={{color: '#9ca3af', fontSize: '0.9rem'}}>Pastikan 8 tim pemenang telah ditentukan dari Bracket A dan Bracket B.</p>
        </div>
        )}
      </main>
      
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        marginTop: '2rem',
        color: 'rgba(255, 255, 255, 0.6)',
        borderTop: '1px solid rgba(245, 158, 11, 0.2)',
        fontSize: '0.9rem'
      }}>
        MLBB Tournament Bracket &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default AdminFinals; 