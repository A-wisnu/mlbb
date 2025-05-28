'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getBracketAMatches, 
  getBracketBMatches,
  saveBracketASpecialSlots,
  saveBracketBSpecialSlots,
  getBracketASpecialSlots,
  getBracketBSpecialSlots,
  getBracketARound2Winners,
  getBracketBRound2Winners,
  saveBracketARound2Winners,
  saveBracketBRound2Winners
} from '../../../../firebase/firestore';
import { Team, Match } from '../../../../types';

const SelectWinnersPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bracketAMatches, setBracketAMatches] = useState<Match[]>([]);
  const [bracketBMatches, setBracketBMatches] = useState<Match[]>([]);
  const [selectedTeamsA, setSelectedTeamsA] = useState<string[]>([]);
  const [selectedTeamsB, setSelectedTeamsB] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [specialSlotsA, setSpecialSlotsA] = useState<string[]>([]);
  const [specialSlotsB, setSpecialSlotsB] = useState<string[]>([]);
  const [round2WinnersA, setRound2WinnersA] = useState<string[]>([]);
  const [round2WinnersB, setRound2WinnersB] = useState<string[]>([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const matchesA = await getBracketAMatches();
        const matchesB = await getBracketBMatches();
        
        const specialA = await getBracketASpecialSlots();
        const specialB = await getBracketBSpecialSlots();
        
        const r2WinnersA = await getBracketARound2Winners();
        const r2WinnersB = await getBracketBRound2Winners();
        
        console.log("Bracket A matches:", matchesA);
        console.log("Bracket B matches:", matchesB);
        console.log("Bracket A special slots:", specialA);
        console.log("Bracket B special slots:", specialB);
        console.log("Bracket A round 2 winners:", r2WinnersA);
        console.log("Bracket B round 2 winners:", r2WinnersB);
        
        setBracketAMatches(matchesA);
        setBracketBMatches(matchesB);
        setSpecialSlotsA(specialA);
        setSpecialSlotsB(specialB);
        setRound2WinnersA(r2WinnersA);
        setRound2WinnersB(r2WinnersB);
        
        const preselectedTeamsA = [...new Set([...specialA, ...r2WinnersA])];
        const preselectedTeamsB = [...new Set([...specialB, ...r2WinnersB])];
        
        setSelectedTeamsA(preselectedTeamsA);
        setSelectedTeamsB(preselectedTeamsB);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage('Terjadi kesalahan saat mengambil data pertandingan');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Fungsi untuk mengekstrak nama tim unik dari pertandingan
  const extractTeamNames = (matches: Match[]): string[] => {
    const teamNames = new Set<string>();
    
    matches.forEach(match => {
      if (match.teamA?.name) teamNames.add(match.teamA.name);
      if (match.teamB?.name) teamNames.add(match.teamB.name);
    });
    
    return Array.from(teamNames);
  };
  
  // Mendapatkan semua tim dari bracket, special slots, dan pemenang ronde 2
  const allTeamsA = [...new Set([
    ...extractTeamNames(bracketAMatches), 
    ...specialSlotsA,
    ...round2WinnersA
  ])];
  
  const allTeamsB = [...new Set([
    ...extractTeamNames(bracketBMatches), 
    ...specialSlotsB,
    ...round2WinnersB
  ])];
  
  // Handler untuk saat tim dipilih/tidak dipilih
  const toggleTeamSelection = (teamName: string, bracket: 'A' | 'B') => {
    if (bracket === 'A') {
      setSelectedTeamsA(prev => {
        if (prev.includes(teamName)) {
          return prev.filter(name => name !== teamName);
        } else {
          return [...prev, teamName];
        }
      });
    } else {
      setSelectedTeamsB(prev => {
        if (prev.includes(teamName)) {
          return prev.filter(name => name !== teamName);
        } else {
          return [...prev, teamName];
        }
      });
    }
  };
  
  // Simpan tim yang dipilih sebagai pemenang
  const saveSelectedTeams = async () => {
    try {
      setIsLoading(true);
      
      // Simpan tim dari bracket A
      await saveBracketASpecialSlots(selectedTeamsA);
      
      // Simpan tim dari bracket B
      await saveBracketBSpecialSlots(selectedTeamsB);
      
      // Simpan pemenang ronde 2 bracket A (menggunakan selectedTeamsA juga)
      await saveBracketARound2Winners(selectedTeamsA);
      
      // Simpan pemenang ronde 2 bracket B (menggunakan selectedTeamsB juga)
      await saveBracketBRound2Winners(selectedTeamsB);
      
      setSuccessMessage('Pemenang berhasil disimpan! Data tersimpan di special slots dan pemenang ronde 2.');
    } catch (error) {
      console.error('Error saving winners:', error);
      setErrorMessage('Terjadi kesalahan saat menyimpan pemenang');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
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
          <Link href="/admin/finals" style={{
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
            <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 'bold', color: '#facc15'}}>Pilih Pemenang untuk Final</h1>
          </Link>
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
        
        {/* Informasi tentang special slots */}
        <div style={{
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          padding: '1rem',
          borderRadius: '8px', 
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>Info Tim yang Sudah Terpilih</h3>
          <p style={{ color: '#d1d5db', marginBottom: '0.5rem' }}>
            Tim yang sudah ada di special slots atau pemenang ronde 2 akan otomatis terpilih:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
            <div>
              <p style={{ fontWeight: 'bold', color: '#a5b4fc', marginBottom: '0.25rem' }}>Bracket A:</p>
              <div style={{ marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.9rem', color: '#d1d5db', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  Special Slots ({specialSlotsA.length}):
                </p>
                <ul style={{ color: '#d1d5db', fontSize: '0.9rem', padding: '0 0 0 1.5rem', margin: 0 }}>
                  {specialSlotsA.length > 0 ? (
                    specialSlotsA.map((team, idx) => (
                      <li key={`special-a-${idx}`}>{team}</li>
                    ))
                  ) : (
                    <li>Tidak ada tim</li>
                  )}
                </ul>
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', color: '#d1d5db', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  Pemenang Ronde 2 ({round2WinnersA.length}):
                </p>
                <ul style={{ color: '#d1d5db', fontSize: '0.9rem', padding: '0 0 0 1.5rem', margin: 0 }}>
                  {round2WinnersA.length > 0 ? (
                    round2WinnersA.map((team, idx) => (
                      <li key={`r2-a-${idx}`}>{team}</li>
                    ))
                  ) : (
                    <li>Tidak ada tim</li>
                  )}
                </ul>
              </div>
            </div>
            
            <div>
              <p style={{ fontWeight: 'bold', color: '#a5b4fc', marginBottom: '0.25rem' }}>Bracket B:</p>
              <div style={{ marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.9rem', color: '#d1d5db', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  Special Slots ({specialSlotsB.length}):
                </p>
                <ul style={{ color: '#d1d5db', fontSize: '0.9rem', padding: '0 0 0 1.5rem', margin: 0 }}>
                  {specialSlotsB.length > 0 ? (
                    specialSlotsB.map((team, idx) => (
                      <li key={`special-b-${idx}`}>{team}</li>
                    ))
                  ) : (
                    <li>Tidak ada tim</li>
                  )}
                </ul>
              </div>
              <div>
                <p style={{ fontSize: '0.9rem', color: '#d1d5db', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  Pemenang Ronde 2 ({round2WinnersB.length}):
                </p>
                <ul style={{ color: '#d1d5db', fontSize: '0.9rem', padding: '0 0 0 1.5rem', margin: 0 }}>
                  {round2WinnersB.length > 0 ? (
                    round2WinnersB.map((team, idx) => (
                      <li key={`r2-b-${idx}`}>{team}</li>
                    ))
                  ) : (
                    <li>Tidak ada tim</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Bracket A */}
          <section style={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ 
              fontSize: isMobile ? '1.5rem' : '1.75rem', 
              color: '#f59e0b', 
              marginBottom: '1.5rem',
              borderBottom: '2px solid #f59e0b',
              paddingBottom: '0.5rem'
            }}>
              Tim Bracket A
            </h2>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Pilih 4 tim dari Bracket A yang akan masuk ke babak Final
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {allTeamsA.length ? (
                allTeamsA.map((teamName) => (
                  <div key={teamName} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: selectedTeamsA.includes(teamName) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(55, 65, 81, 0.5)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    border: selectedTeamsA.includes(teamName) ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid transparent'
                  }} onClick={() => toggleTeamSelection(teamName, 'A')}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid white',
                      borderRadius: '4px',
                      marginRight: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: selectedTeamsA.includes(teamName) ? '#10b981' : 'transparent'
                    }}>
                      {selectedTeamsA.includes(teamName) && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                        </svg>
                      )}
                    </div>
                    <span>{teamName}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: '#9ca3af', textAlign: 'center' }}>Tidak ada tim dari Bracket A</p>
              )}
              
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Tim terpilih: {selectedTeamsA.length}/4</span>
                {selectedTeamsA.length > 4 && (
                  <span style={{ color: '#ef4444' }}>Terlalu banyak! Pilih maksimal 4 tim</span>
                )}
              </div>
            </div>
          </section>
          
          {/* Bracket B */}
          <section style={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ 
              fontSize: isMobile ? '1.5rem' : '1.75rem', 
              color: '#f59e0b', 
              marginBottom: '1.5rem',
              borderBottom: '2px solid #f59e0b',
              paddingBottom: '0.5rem'
            }}>
              Tim Bracket B
            </h2>
            <p style={{ marginBottom: '1.5rem', color: '#d1d5db' }}>
              Pilih 4 tim dari Bracket B yang akan masuk ke babak Final
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {allTeamsB.length ? (
                allTeamsB.map((teamName) => (
                  <div key={teamName} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem',
                    backgroundColor: selectedTeamsB.includes(teamName) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(55, 65, 81, 0.5)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    border: selectedTeamsB.includes(teamName) ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid transparent'
                  }} onClick={() => toggleTeamSelection(teamName, 'B')}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid white',
                      borderRadius: '4px',
                      marginRight: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: selectedTeamsB.includes(teamName) ? '#10b981' : 'transparent'
                    }}>
                      {selectedTeamsB.includes(teamName) && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                        </svg>
                      )}
                    </div>
                    <span>{teamName}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: '#9ca3af', textAlign: 'center' }}>Tidak ada tim dari Bracket B</p>
              )}
              
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Tim terpilih: {selectedTeamsB.length}/4</span>
                {selectedTeamsB.length > 4 && (
                  <span style={{ color: '#ef4444' }}>Terlalu banyak! Pilih maksimal 4 tim</span>
                )}
              </div>
            </div>
          </section>
        </div>
        
        {/* Tombol Simpan */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '2rem',
          marginBottom: '2rem'
        }}>
          <button 
            onClick={saveSelectedTeams}
            disabled={isLoading || selectedTeamsA.length > 4 || selectedTeamsB.length > 4}
            style={{
              backgroundColor: (isLoading || selectedTeamsA.length > 4 || selectedTeamsB.length > 4) ? 'rgba(59, 130, 246, 0.5)' : '#3b82f6',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: (isLoading || selectedTeamsA.length > 4 || selectedTeamsB.length > 4) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'background-color 0.2s ease, transform 0.2s ease',
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: 'white',
                  animation: 'spin 0.8s linear infinite'
                }}></div>
                Menyimpan...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
                </svg>
                Simpan Tim Pemenang
              </>
            )}
          </button>
        </div>
        
        {(selectedTeamsA.length > 0 || selectedTeamsB.length > 0) && (
          <section style={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ 
              fontSize: isMobile ? '1.5rem' : '1.75rem', 
              color: '#f59e0b', 
              marginBottom: '1.5rem',
              borderBottom: '2px solid #f59e0b',
              paddingBottom: '0.5rem',
              textAlign: 'center'
            }}>
              Tim yang Akan Masuk Final
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '1.5rem'
            }}>
              <div>
                <h3 style={{ color: '#d1d5db', marginBottom: '1rem' }}>Bracket A ({selectedTeamsA.length})</h3>
                <ul style={{
                  listStyleType: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {selectedTeamsA.length > 0 ? selectedTeamsA.map((team, index) => (
                    <li key={team} style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '4px',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        color: 'white',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>{index + 1}</span>
                      {team}
                    </li>
                  )) : (
                    <li style={{ color: '#9ca3af', fontStyle: 'italic' }}>Belum ada tim yang dipilih</li>
                  )}
                </ul>
              </div>
              
              <div>
                <h3 style={{ color: '#d1d5db', marginBottom: '1rem' }}>Bracket B ({selectedTeamsB.length})</h3>
                <ul style={{
                  listStyleType: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {selectedTeamsB.length > 0 ? selectedTeamsB.map((team, index) => (
                    <li key={team} style={{
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      borderRadius: '4px',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(245, 158, 11, 0.8)',
                        color: 'white',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>{index + 1}</span>
                      {team}
                    </li>
                  )) : (
                    <li style={{ color: '#9ca3af', fontStyle: 'italic' }}>Belum ada tim yang dipilih</li>
                  )}
                </ul>
              </div>
            </div>
            
            <div style={{
              marginTop: '1.5rem',
              padding: '0.75rem',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '6px',
              color: '#d1d5db'
            }}>
              <p style={{ margin: 0 }}>
                <strong>Total:</strong> {selectedTeamsA.length + selectedTeamsB.length} tim ({selectedTeamsA.length} dari A, {selectedTeamsB.length} dari B)
              </p>
              <p style={{ margin: 0, marginTop: '0.5rem', fontSize: '0.9rem' }}>
                *Idealnya pilih 4 tim dari masing-masing bracket untuk total 8 tim di babak final
              </p>
            </div>
          </section>
        )}
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}>
          <Link href="/admin/finals" style={{
            backgroundColor: 'rgba(55, 65, 81, 0.7)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'background-color 0.2s ease'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6 12.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1h-8a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h12a.5.5 0 0 1 0 1h-12a.5.5 0 0 1-.5-.5z"/>
            </svg>
            Kembali ke Halaman Final
          </Link>
        </div>
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

export default SelectWinnersPage; 