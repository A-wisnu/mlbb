"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  getFinalsData,
  onFinalsDataChange
} from '../../firebase/firestore';
import { Team } from "../../types";

interface FinalsData {
  champion: string;
  runnerUp: string;
  thirdPlace: string;
  quarterFinals: { team1: Team; team2: Team; winner?: string }[];
  semiFinals: { team1: Team; team2: Team; winner?: string }[];
  finalMatch: { team1: Team; team2: Team; winner?: string } | null;
  thirdPlaceMatch: { team1: Team; team2: Team; winner?: string } | null;
}

const FinalsPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [finalsData, setFinalsData] = useState<FinalsData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getFinalsData();
        setFinalsData(data);
      } catch (error) {
        console.error('Error fetching finals data:', error);
        setErrorMessage('Tidak dapat mengambil data final. Silakan coba lagi nanti.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time updates
    const unsubscribe = onFinalsDataChange((data) => {
      setFinalsData(data);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
          }}>Memuat Data Final...</p>
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

  if (errorMessage) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a'
      }}>
        <div style={{
          backgroundColor: '#ef4444',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Error</h2>
          <p>{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: 'white',
              color: '#ef4444',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              marginTop: '1rem',
              cursor: 'pointer'
            }}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!finalsData || !finalsData.quarterFinals || finalsData.quarterFinals.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        color: 'white',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Belum Ada Data Final</h2>
          <p>Data pertandingan final belum tersedia. Silakan kembali nanti.</p>
          
          <Link href="/" style={{
            display: 'inline-block',
            marginTop: '1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            textDecoration: 'none'
          }}>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const renderMatchCard = (match: { team1: Team; team2: Team; winner?: string }, title: string) => {
    if (!match) return null;

    const { team1, team2, winner } = match;

    return (
      <div style={{
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        marginBottom: '1rem'
      }}>
        {title && (
          <h3 style={{ color: '#f59e0b', marginBottom: '0.75rem', textAlign:'center', fontSize: isMobile ? '1rem' : '1.1rem' }}>{title}</h3>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[team1, team2].map((team, teamIdx) => (
            team.name === "BYE" ? 
            <div key={teamIdx} style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: 'rgba(71, 85, 105, 0.5)', textAlign: 'center', fontStyle: 'italic'}}>{team.name}</div> :
            <div
              key={team.id || teamIdx}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: winner === team.name ? '#10b981' : (winner && winner !== team.name ? 'rgba(239, 68, 68, 0.7)' : 'rgba(55, 65, 81, 0.8)'),
                color: 'white',
                borderRadius: '4px',
                textAlign: 'left',
                fontWeight: winner === team.name ? 'bold' : 'normal',
                opacity: winner && winner !== team.name ? 0.6 : 1,
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
            </div>
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
            <h1 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 'bold', color: '#facc15'}}>MLBB Tournament - Babak Final</h1>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Juara - Tampilkan juga jika ada data, tapi juara belum ditentukan */}
        {finalsData.quarterFinals && finalsData.quarterFinals.length > 0 && (
          <div style={{
            backgroundColor: 'rgba(14, 116, 144, 0.3)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            borderLeft: '4px solid #06b6d4',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ fontSize: '1.5rem', color: '#22d3ee', marginBottom: '1rem', textAlign: 'center' }}>Hasil Turnamen</h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '1rem'
            }}>
              <div style={{
                backgroundColor: 'rgba(250, 204, 21, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                order: isMobile ? 1 : 2
              }}>
                <div style={{
                  backgroundColor: 'rgba(250, 204, 21, 0.8)',
                  color: '#000',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.25rem'
                }}>1</div>
                <h3 style={{ color: '#facc15', fontSize: '1.1rem' }}>Juara 1</h3>
                <p style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {finalsData.champion || (finalsData.finalMatch?.winner ? finalsData.finalMatch.winner : 'Belum ditentukan')}
                </p>
              </div>
              
              <div style={{
                backgroundColor: 'rgba(148, 163, 184, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                order: isMobile ? 2 : 1
              }}>
                <div style={{
                  backgroundColor: 'rgba(148, 163, 184, 0.8)',
                  color: '#000',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.25rem'
                }}>2</div>
                <h3 style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>Juara 2</h3>
                <p style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {finalsData.runnerUp || (finalsData.finalMatch?.winner && finalsData.finalMatch?.team1 && finalsData.finalMatch?.team2 ? 
                    (finalsData.finalMatch.winner === finalsData.finalMatch.team1.name ? finalsData.finalMatch.team2.name : finalsData.finalMatch.team1.name) : 
                    'Belum ditentukan')}
                </p>
              </div>
              
              <div style={{
                backgroundColor: 'rgba(234, 88, 12, 0.2)',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                order: isMobile ? 3 : 3
              }}>
                <div style={{
                  backgroundColor: 'rgba(234, 88, 12, 0.8)',
                  color: '#000',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.25rem'
                }}>3</div>
                <h3 style={{ color: '#fb923c', fontSize: '1.1rem' }}>Juara 3</h3>
                <p style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {finalsData.thirdPlace || (finalsData.thirdPlaceMatch?.winner ? finalsData.thirdPlaceMatch.winner : 'Belum ditentukan')}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Perempat Final */}
        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.4)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
        }}>
          <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', color: '#f59e0b', marginBottom: '1rem', textAlign: 'center' }}>
            Perempat Final
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '1rem',
          }}>
            {finalsData.quarterFinals.map((match, idx) => (
              <div key={`qf-${idx}`}>
                {renderMatchCard(match, `QF Match ${idx+1}`)}
              </div>
            ))}
          </div>
        </div>
        
        {/* Semi Final */}
        {finalsData.semiFinals && finalsData.semiFinals.length > 0 && (
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
          }}>
            <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', color: '#f59e0b', marginBottom: '1rem', textAlign: 'center' }}>
              Semi Final
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: '1rem',
            }}>
              {finalsData.semiFinals.map((match, idx) => (
                <div key={`sf-${idx}`}>
                  {renderMatchCard(match, `SF Match ${idx+1}`)}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Final & Juara 3 */}
        {(finalsData.finalMatch || finalsData.thirdPlaceMatch) && (
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}>
            {finalsData.finalMatch && (
              <div style={{ flex: 1 }}>
                <div style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.4)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                }}>
                  <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', color: '#f59e0b', marginBottom: '1rem', textAlign: 'center' }}>
                    Final
                  </h2>
                  {renderMatchCard(finalsData.finalMatch, '')}
                </div>
              </div>
            )}
            
            {finalsData.thirdPlaceMatch && (
              <div style={{ flex: 1 }}>
                <div style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.4)',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                }}>
                  <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', color: '#f59e0b', marginBottom: '1rem', textAlign: 'center' }}>
                    Perebutan Juara 3
                  </h2>
                  {renderMatchCard(finalsData.thirdPlaceMatch, '')}
                </div>
                    </div>
            )}
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

export default FinalsPage; 