'use client';

import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation'; // Komentari atau hapus jika router tidak digunakan
import Link from 'next/link';
import { 
  getBracketASpecialSlots, 
  saveBracketASpecialSlots,
  getBracketBSpecialSlots,
  saveBracketBSpecialSlots,
  saveFinalsWinner,
  saveFinalsThirdPlace 
} from '../../../firebase/firestore';
import { Team } from '../../../types';

const AdminFinals = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [finalTeams, setFinalTeams] = useState<Team[]>([]);
  const [semifinalWinners, setSemifinalWinners] = useState<string[]>([]);
  const [semifinalLosers, setSemifinalLosers] = useState<string[]>([]);
  const [firstMatchWinner, setFirstMatchWinner] = useState<string | null>(null);
  const [secondMatchWinner, setSecondMatchWinner] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // const router = useRouter(); // Commented out as it's not used
  
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
  
  // Load special slots data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Ambil special slots dari bracket A dan B
        const slotsA = await getBracketASpecialSlots();
        const slotsB = await getBracketBSpecialSlots();
        
        // Konversi string[] ke Team[]
        const teamsA: Team[] = slotsA.map((name: string, idx: number) => ({
          id: idx + 1,
          name
        }));
        
        const teamsB: Team[] = slotsB.map((name: string, idx: number) => ({
          id: idx + 5,
          name
        }));
        
        setFinalTeams([...teamsA, ...teamsB]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrorMessage('Terjadi kesalahan saat mengambil data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage('');
    
    // Otomatis hapus pesan sukses setelah 3 detik
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setSuccessMessage('');
    
    // Otomatis hapus pesan error setelah 3 detik
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleSemifinalWinnerChange = (team: string, index: number) => {
    const updatedWinners = [...semifinalWinners];
    updatedWinners[index] = team;
    setSemifinalWinners(updatedWinners);
  };
  
  const handleSemifinalLoserChange = (team: string, index: number) => {
    const updatedLosers = [...semifinalLosers];
    updatedLosers[index] = team;
    setSemifinalLosers(updatedLosers);
  };

  const handleSaveSemifinalTeams = async () => {
    try {
      if (semifinalWinners.length < 2) {
        showErrorMessage('Silahkan pilih semua pemenang semifinal');
        return;
      }
      
      if (semifinalLosers.length < 2) {
        showErrorMessage('Silahkan pilih semua yang kalah di semifinal');
        return;
      }
      
      // Simpan ke Firestore
      await saveBracketASpecialSlots(semifinalWinners);
      await saveBracketBSpecialSlots(semifinalLosers);
      
      showSuccessMessage('Tim semifinal berhasil disimpan');
    } catch (error) {
      console.error('Error saving semifinal teams:', error);
      showErrorMessage('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleSaveFinalsWinner = async () => {
    try {
      if (!firstMatchWinner) {
        showErrorMessage('Silahkan pilih juara 1');
        return;
      }
      
      if (!secondMatchWinner) {
        showErrorMessage('Silahkan pilih juara 3');
        return;
      }
      
      // Simpan pemenang final (juara 1)
      const winnerTeam: Team = {
        id: 1,
        name: firstMatchWinner
      };
      await saveFinalsWinner(winnerTeam);
      
      // Simpan juara 3
      const thirdPlaceTeam: Team = {
        id: 3,
        name: secondMatchWinner
      };
      await saveFinalsThirdPlace(thirdPlaceTeam);
      
      showSuccessMessage('Pemenang final berhasil disimpan');
    } catch (error) {
      console.error('Error saving finals winner:', error);
      showErrorMessage('Terjadi kesalahan saat menyimpan data');
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
      color: 'white'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
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
          <Link href="/admin/dashboard" style={{
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
            <div>
              <h1 style={{
                fontSize: isMobile ? '1.1rem' : '1.25rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '0.125rem',
                background: 'linear-gradient(to right, #fff, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Grand Finals</h1>
              <p style={{
                fontSize: '0.75rem',
                color: '#fbbf24',
                letterSpacing: '0.025em'
              }}>Kelola Final Tournament</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        padding: isMobile ? '1.5rem 1rem' : '3rem 2rem',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        {/* Notification */}
        {successMessage && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderLeft: '4px solid #10b981',
            color: '#6ee7b7',
            padding: '1rem',
            marginBottom: '2rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div style={{
            backgroundColor: 'rgba(220, 38, 38, 0.2)',
            borderLeft: '4px solid #dc2626',
            color: '#f87171',
            padding: '1rem',
            marginBottom: '2rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}
        
        <div style={{
          background: 'linear-gradient(135deg, rgba(243, 244, 246, 0.05), rgba(243, 244, 246, 0.03))',
          borderRadius: '1rem',
          padding: isMobile ? '1.5rem' : '2rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          marginBottom: '3rem',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            color: '#fbbf24',
            fontSize: '0.75rem',
            fontWeight: 'medium',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
          }}>
            Kelola Final
          </div>

          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            marginBottom: '2rem',
            color: '#fbbf24',
            position: 'relative',
            display: 'inline-block',
            paddingBottom: '0.75rem'
          }}>
            Pengaturan Final Tournament
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '2px',
              background: 'linear-gradient(to right, rgba(245, 158, 11, 0.7), transparent)'
            }}></div>
          </h2>

          <div style={{
            marginBottom: '3rem'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#f59e0b'
            }}>
              1. Pilih Tim Pemenang dari Babak Quarter Final
            </h3>
            <p style={{
              color: '#d1d5db',
              marginBottom: '1.5rem',
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              Pilih 2 tim pemenang dari Bracket A dan 2 tim pemenang dari Bracket B yang akan masuk ke Final.
            </p>

            <div style={{
              background: 'rgba(17, 24, 39, 0.6)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#f59e0b'
              }}>
                Pemenang Semifinal (Juara 1 & 2)
              </h4>

              {[0, 1].map((index) => (
                <div key={`semifinal-winner-${index}`} style={{
                  marginBottom: '1rem'
                }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem',
                    color: '#d1d5db'
                  }}>
                    Tim {index + 1}
                  </label>
                  <select 
                    value={semifinalWinners[index] || ''}
                    onChange={(e) => handleSemifinalWinnerChange(e.target.value, index)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(31, 41, 55, 0.8)',
                      color: 'white',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(75, 85, 99, 0.4)',
                      outline: 'none',
                      fontSize: '0.95rem'
                    }}
                  >
                    <option value="">Pilih Tim</option>
                    {finalTeams.map((team) => (
                      <option key={`winner-team-${team.id}`} value={team.name}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                marginTop: '2rem',
                color: '#f59e0b'
              }}>
                Yang Kalah di Semifinal (Perebutan Juara 3)
              </h4>

              {[0, 1].map((index) => (
                <div key={`semifinal-loser-${index}`} style={{
                  marginBottom: '1rem'
                }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.9rem',
                    color: '#d1d5db'
                  }}>
                    Tim {index + 1}
                  </label>
                  <select 
                    value={semifinalLosers[index] || ''}
                    onChange={(e) => handleSemifinalLoserChange(e.target.value, index)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: 'rgba(31, 41, 55, 0.8)',
                      color: 'white',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(75, 85, 99, 0.4)',
                      outline: 'none',
                      fontSize: '0.95rem'
                    }}
                  >
                    <option value="">Pilih Tim</option>
                    {finalTeams.map((team) => (
                      <option key={`loser-team-${team.id}`} value={team.name}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <button 
                onClick={handleSaveSemifinalTeams}
                style={{
                  marginTop: '1.5rem',
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                </svg>
                Simpan Tim Semifinal
              </button>
            </div>
          </div>

          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#f59e0b'
            }}>
              2. Tentukan Juara
            </h3>
            <p style={{
              color: '#d1d5db',
              marginBottom: '1.5rem',
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              Pilih pemenang dari pertandingan final untuk juara 1 & 2, serta pemenang perebutan juara 3.
            </p>

            <div style={{
              background: 'rgba(17, 24, 39, 0.6)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#f59e0b'
              }}>
                Juara 1 (Pemenang Final)
              </h4>
              <select 
                value={firstMatchWinner || ''}
                onChange={(e) => setFirstMatchWinner(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(75, 85, 99, 0.4)',
                  outline: 'none',
                  fontSize: '0.95rem',
                  marginBottom: '1.5rem'
                }}
              >
                <option value="">Pilih Tim</option>
                {semifinalWinners.map((team, idx) => team && (
                  <option key={`first-match-${idx}`} value={team}>{team}</option>
                ))}
              </select>

              <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#f59e0b'
              }}>
                Juara 3 (Pemenang Perebutan Juara 3)
              </h4>
              <select 
                value={secondMatchWinner || ''}
                onChange={(e) => setSecondMatchWinner(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(75, 85, 99, 0.4)',
                  outline: 'none',
                  fontSize: '0.95rem',
                  marginBottom: '1.5rem'
                }}
              >
                <option value="">Pilih Tim</option>
                {semifinalLosers.map((team, idx) => team && (
                  <option key={`second-match-${idx}`} value={team}>{team}</option>
                ))}
              </select>

              <button 
                onClick={handleSaveFinalsWinner}
                style={{
                  marginTop: '1.5rem',
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M9.669.864L8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193l.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z"/>
                  <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
                </svg>
                Tetapkan Juara
              </button>
            </div>
          </div>
        </div>

        {/* Tombol kembali */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '2rem',
          marginBottom: '3rem'
        }}>
          <Link href="/admin/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'rgba(31, 41, 55, 0.7)',
            color: '#e5e7eb',
            borderRadius: '0.5rem',
            fontWeight: '500',
            textDecoration: 'none',
            border: '1px solid rgba(75, 85, 99, 0.6)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 0.9)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 0.7)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            Kembali ke Dashboard
          </Link>
        </div>
      </main>
      
      {/* Footer */}
      <footer style={{
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderTop: '1px solid rgba(245, 158, 11, 0.3)',
        padding: '1.5rem',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.875rem',
        backdropFilter: 'blur(10px)'
      }}>
        <p>© 2023 Mobile Legends Tournament. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminFinals; 