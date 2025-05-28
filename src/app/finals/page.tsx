"use client";

import { useEffect, useState } from "react";
import TournamentBracket from "../../components/TournamentBracket";
import { Team } from "../../types";
import Link from "next/link";
import Image from "next/image";
import { 
  onBracketASpecialSlotsChange, 
  onBracketBSpecialSlotsChange,
  getFinalsWinner,
  saveFinalsWinner,
  onFinalsWinnerChange,
  getFinalsThirdPlace,
  onFinalsThirdPlaceChange,
  onFinalsMatchesChange
} from '../../firebase/firestore';
import { UIMatch, convertToUIMatches } from '../../types/adapter';
import { getRefereeForMatch } from '../../types/referees';

// Definisikan tipe untuk Match
type Match = UIMatch;

// Link WA helper
const getWhatsAppLink = (phone: string) => {
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;
};

const FinalsPage = () => {
  const [finalTeams, setFinalTeams] = useState<Team[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [specialSlotsA, setSpecialSlotsA] = useState<string[]>([]);
  const [specialSlotsB, setSpecialSlotsB] = useState<string[]>([]);
  const [winnerTeam, setWinnerTeam] = useState<Team | null>(null);
  const [thirdPlaceTeam, setThirdPlaceTeam] = useState<Team | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Hubungkan ke Firebase untuk mendapatkan data
  useEffect(() => {
    // Subscribe to special slots from Bracket A
    const unsubscribeA = onBracketASpecialSlotsChange((slots) => {
      setSpecialSlotsA(slots);
    });
    
    // Subscribe to special slots from Bracket B
    const unsubscribeB = onBracketBSpecialSlotsChange((slots) => {
      setSpecialSlotsB(slots);
    });
    
    // Subscribe to finals winner
    const unsubscribeWinner = onFinalsWinnerChange((winner) => {
      if (winner) {
        setWinnerTeam(winner);
        setShowConfetti(true);
      }
    });
    
    // Subscribe to third place winner
    const unsubscribeThirdPlace = onFinalsThirdPlaceChange((winner) => {
      if (winner) {
        setThirdPlaceTeam(winner);
      }
    });
    
    // Subscribe to finals matches
    const unsubscribeMatches = onFinalsMatchesChange((matches) => {
      setMatches(matches);
    });
    
    // Ambil data juara langsung saat komponen dimount
    const fetchWinners = async () => {
      const savedWinner = await getFinalsWinner();
      if (savedWinner) {
        setWinnerTeam(savedWinner);
        setShowConfetti(true);
      }
      
      const savedThirdPlace = await getFinalsThirdPlace();
      if (savedThirdPlace) {
        setThirdPlaceTeam(savedThirdPlace);
      }
    };
    
    fetchWinners();
    
    // Cleanup
    return () => {
      unsubscribeA();
      unsubscribeB();
      unsubscribeWinner();
      unsubscribeThirdPlace();
      unsubscribeMatches();
    };
  }, []);

  // Update finalTeams saat specialSlots berubah
  useEffect(() => {
    try {
      // Pastikan kita mengambil hanya 4 tim dari masing-masing bracket
      // dan hapus duplikasi jika ada
      const uniqueTeamsA = [...new Set(specialSlotsA)];
      const uniqueTeamsB = [...new Set(specialSlotsB)];
      
      // Batasi hanya 4 tim dari masing-masing bracket
      const limitedTeamsA = uniqueTeamsA.slice(0, 4);
      const limitedTeamsB = uniqueTeamsB.slice(0, 4);
      
      // Konversi string[] ke Team[]
      const teamsA: Team[] = limitedTeamsA.map((name: string, idx: number) => ({
        id: idx + 1,
        name,
        bracket: 'A'  // Tandai tim dari bracket A
      }));
      
      const teamsB: Team[] = limitedTeamsB.map((name: string, idx: number) => ({
        id: idx + 5,
        name,
        bracket: 'B'  // Tandai tim dari bracket B
      }));
      
      // Gabung dan update state
      setFinalTeams([...teamsA, ...teamsB]);

      // Log untuk debugging
      console.log('Final teams from Bracket A:', limitedTeamsA);
      console.log('Final teams from Bracket B:', limitedTeamsB);
    } catch (error) {
      console.error('Error processing final teams:', error);
      setFinalTeams([]);
    }
  }, [specialSlotsA, specialSlotsB]);
  
  // Fungsi untuk menetapkan pemenang
  const handleSetWinner = async (team: Team) => {
    setWinnerTeam(team);
    await saveFinalsWinner(team);
    setShowConfetti(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0f172a",
        backgroundImage:
          "radial-gradient(circle at 25% 10%, rgba(234, 88, 12, 0.15) 0%, transparent 40%), radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.1) 0%, transparent 40%)",
      }}
    >
      {showConfetti && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 100,
          background: "url('/images/confetti.gif') repeat"
        }} />
      )}
      
      <div style={{ position: "relative", paddingTop: "4rem", paddingBottom: "8rem" }}>
        {/* Background Element */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            opacity: 0.2,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/images/logo-mobile-legend-31251.png"
            alt="Background Logo"
            fill
            style={{ objectFit: "contain", opacity: 0.1 }}
            sizes="100vw"
          />
        </div>
        
        {/* Header */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
            <div style={{ position: "relative", zIndex: 10, marginBottom: "3rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "2rem",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "1rem" : "0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", width: isMobile ? "100%" : "auto" }}>
                  <Link
                    href="/"
                    style={{
                      background: "rgba(31, 41, 55, 0.8)",
                      padding: "0.75rem",
                      borderRadius: "9999px",
                      marginRight: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      border: "1px solid rgba(75, 85, 99, 0.4)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ height: "1.5rem", width: "1.5rem", color: "#60a5fa" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </Link>
                  <div>
                    <h1
                      style={{
                        fontSize: isMobile ? "2.5rem" : "3.25rem",
                        fontWeight: 800,
                        background: "linear-gradient(to right, #f59e42, #fbbf24)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginBottom: "0.5rem",
                        textShadow: "0 2px 10px rgba(245, 158, 11, 0.5)",
                      }}
                    >
                      GRAND FINALS
                    </h1>
                    <p
                      style={{
                        color: "#fbbf24",
                        fontSize: "1.25rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        style={{ width: "1.25rem", height: "1.25rem" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                        />
                      </svg>
                      28 Mei, 2025
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    flexDirection: isMobile ? "column" : "row",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  <Link
                    href="/bracket-a"
                    style={{
                      fontSize: "0.875rem",
                      padding: "0.75rem 1.25rem",
                      borderRadius: "0.5rem",
                      background:
                        "linear-gradient(to right, rgba(49, 46, 129, 0.6), rgba(79, 70, 229, 0.6))",
                      border: "1px solid rgba(79, 70, 229, 0.7)",
                      color: "#c7d2fe",
                      transition: "all 0.3s ease",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.025em",
                      width: isMobile ? "100%" : "auto",
                    }}
                  >
                    Bracket A
                  </Link>
                  <Link
                    href="/bracket-b"
                    style={{
                      fontSize: "0.875rem",
                      padding: "0.75rem 1.25rem",
                      borderRadius: "0.5rem",
                      background:
                        "linear-gradient(to right, rgba(146, 64, 14, 0.6), rgba(234, 88, 12, 0.6))",
                      border: "1px solid rgba(234, 88, 12, 0.7)",
                      color: "#fde68a",
                      transition: "all 0.3s ease",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.025em",
                      width: isMobile ? "100%" : "auto",
                    }}
                  >
                    Bracket B
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Informasi Finalis */}
            <div style={{
              background: "linear-gradient(135deg, rgba(234, 88, 12, 0.1), rgba(245, 158, 11, 0.05))",
              borderRadius: "1rem",
              padding: "1.5rem",
              marginBottom: "2rem",
              border: "1px solid rgba(245, 158, 11, 0.2)",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
            }}>
              <h2 style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#fbbf24",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fbbf24" viewBox="0 0 16 16">
                  <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
                </svg>
                Tim Finalis
              </h2>
              
              {finalTeams.length === 0 ? (
                <div style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  color: '#94a3b8',
                  textAlign: 'center',
                  border: '1px dashed rgba(100, 116, 139, 0.5)'
                }}>
                  <p>Data tim finalis belum tersedia</p>
                </div>
              ) : (
              <div style={{
                display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "2rem"
                }}>
                  {/* Tim dari Bracket A */}
                  <div style={{
                    padding: "1.5rem",
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))",
                      borderRadius: "0.75rem",
                    border: "1px solid rgba(59, 130, 246, 0.3)"
                  }}>
                    <h3 style={{
                      fontSize: "1.25rem",
                      color: "#60a5fa",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
                      </svg>
                      Tim dari Bracket A
                    </h3>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                      gap: "1rem"
                    }}>
                      {finalTeams.filter(team => team.bracket === 'A').map((team) => (
                        <div 
                          key={`team-a-${team.id}`} 
                          style={{
                            background: winnerTeam?.id === team.id 
                              ? "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.2))" 
                              : "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))",
                            padding: "1rem",
                            borderRadius: "0.5rem",
                            border: winnerTeam?.id === team.id
                              ? "1px solid rgba(59, 130, 246, 0.8)"
                              : "1px solid rgba(59, 130, 246, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            boxShadow: winnerTeam?.id === team.id
                              ? "0 0 15px rgba(59, 130, 246, 0.4)"
                              : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer"
                    }}
                    onClick={() => handleSetWinner(team)}
                    >
                      <div style={{
                            backgroundColor: "rgba(59, 130, 246, 0.2)",
                            color: "#93c5fd",
                            width: "2.5rem",
                            height: "2.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                            borderRadius: "9999px",
                        fontWeight: "bold",
                            fontSize: "1rem"
                          }}>A{team.id}</div>
                          <span style={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                          color: "white",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}>{team.name}</span>
                      {winnerTeam?.id === team.id && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#60a5fa" viewBox="0 0 16 16" style={{ marginLeft: 'auto' }}>
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tim dari Bracket B */}
                  <div style={{
                    padding: "1.5rem",
                    background: "linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(109, 40, 217, 0.05))",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(124, 58, 237, 0.3)"
                  }}>
                    <h3 style={{
                      fontSize: "1.25rem",
                      color: "#a78bfa",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
                      </svg>
                      Tim dari Bracket B
                    </h3>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                      gap: "1rem"
                    }}>
                      {finalTeams.filter(team => team.bracket === 'B').map((team) => (
                        <div 
                          key={`team-b-${team.id}`} 
                          style={{
                            background: winnerTeam?.id === team.id 
                              ? "linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(109, 40, 217, 0.2))" 
                              : "linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(109, 40, 217, 0.1))",
                            padding: "1rem",
                            borderRadius: "0.5rem",
                            border: winnerTeam?.id === team.id
                              ? "1px solid rgba(124, 58, 237, 0.8)"
                              : "1px solid rgba(124, 58, 237, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            boxShadow: winnerTeam?.id === team.id
                              ? "0 0 15px rgba(124, 58, 237, 0.4)"
                              : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            cursor: "pointer"
                          }}
                          onClick={() => handleSetWinner(team)}
                        >
                          <div style={{
                            backgroundColor: "rgba(124, 58, 237, 0.2)",
                            color: "#a78bfa",
                            width: "2.5rem",
                            height: "2.5rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "9999px",
                            fontWeight: "bold",
                            fontSize: "1rem"
                          }}>B{team.id-4}</div>
                          <span style={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            color: "white",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}>{team.name}</span>
                          {winnerTeam?.id === team.id && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#a78bfa" viewBox="0 0 16 16" style={{ marginLeft: 'auto' }}>
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  </div>
                )}
            </div>
            
            {/* Winner Trophy */}
            {winnerTeam && (
              <div style={{
                background: "radial-gradient(circle at center, rgba(251, 191, 36, 0.3), transparent 70%)",
                borderRadius: "1rem",
                padding: "2rem",
                marginBottom: "2rem",
                textAlign: "center",
                boxShadow: "0 0 30px rgba(251, 191, 36, 0.2)",
                border: "1px solid rgba(251, 191, 36, 0.3)"
              }}>
                <div style={{
                  fontSize: "1.5rem",
                  color: "#fbbf24",
                  marginBottom: "0.5rem",
                  fontWeight: "bold"
                }}>
                  🏆 JUARA TURNAMEN 🏆
                </div>
                <div style={{
                  fontSize: "2.5rem",
                  fontWeight: "900",
                  color: "white",
                  marginBottom: "1rem",
                  textShadow: "0 0 10px rgba(251, 191, 36, 0.8), 0 0 20px rgba(251, 191, 36, 0.4)"
                }}>
                  {winnerTeam.name}
                </div>
                <div style={{
                  color: "#94a3b8",
                  fontSize: "1rem"
                }}>
                  Selamat kepada tim {winnerTeam.name} yang telah menjadi juara turnamen!
                </div>
              </div>
            )}
            
            {/* Third Place Trophy */}
            {thirdPlaceTeam && (
              <div style={{
                background: "radial-gradient(circle at center, rgba(168, 85, 247, 0.2), transparent 70%)",
                borderRadius: "1rem",
                padding: "1.5rem",
                marginBottom: "2rem",
                textAlign: "center",
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.15)",
                border: "1px solid rgba(168, 85, 247, 0.2)"
              }}>
                <div style={{
                  fontSize: "1.25rem",
                  color: "#c084fc",
                  marginBottom: "0.5rem",
                  fontWeight: "bold"
                }}>
                  🥉 JUARA 3 🥉
                </div>
                <div style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: "white",
                  marginBottom: "0.75rem",
                  textShadow: "0 0 8px rgba(168, 85, 247, 0.6), 0 0 15px rgba(168, 85, 247, 0.3)"
                }}>
                  {thirdPlaceTeam.name}
                </div>
                <div style={{
                  color: "#94a3b8",
                  fontSize: "0.95rem"
                }}>
                  Selamat kepada tim {thirdPlaceTeam.name} yang telah menjadi juara 3!
                </div>
              </div>
            )}
            
            {/* Perebutan Juara 3 */}
            <div style={{
              marginBottom: "2rem",
              background: "linear-gradient(135deg, rgba(107, 114, 128, 0.15), rgba(75, 85, 99, 0.05))",
              padding: "1rem",
              borderRadius: "1rem",
              border: "1px solid rgba(107, 114, 128, 0.3)",
            }}>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#94a3b8",
                marginBottom: "1rem",
                textAlign: "center",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "0.5rem" }}>
                  <path fillRule="evenodd" d="M4 0a2 2 0 1 0 0 4h8a2 2 0 1 0 0-4H4zm.879.879a1 1 0 1 0-1.758 0l-.5 2A1 1 0 0 0 4 4h8a1 1 0 0 0 1.379-1.121l-.5-2A1 1 0 0 0 11.12.879L11 1H5l-.12-.121zM7.188 6.05L8 10l.812-3.95A1.812 1.812 0 0 0 8 6a1.812 1.812 0 0 0-.812.05ZM8.5 5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM3.88 6.963A1 1 0 0 0 4 7h8a1 1 0 0 0 .965-.738l1.84-6.648A2.99 2.99 0 0 1 13 0H3a2.99 2.99 0 0 1-1.806.628L3.034 7.263A1 1 0 0 0 3.88 6.963Z"/>
                </svg>
                Perebutan Juara 3
              </h3>

              {/* Referee information */}
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(17, 24, 39, 0.5)',
                borderRadius: '0.75rem',
                marginBottom: '1rem',
                border: '1px solid rgba(107, 114, 128, 0.3)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  backgroundColor: 'rgba(79, 70, 229, 0.1)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  border: '1px solid rgba(79, 70, 229, 0.2)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#94a3b8" style={{width: '1.25rem', height: '1.25rem'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <span style={{ color: '#cbd5e1', fontWeight: 'bold', fontSize: '1rem' }}>
                      Wasit: {getRefereeForMatch(1001).name}
                    </span>
                  </div>
                  <a 
                    href={getWhatsAppLink(getRefereeForMatch(1001).phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#cbd5e1',
                      backgroundColor: 'rgba(75, 85, 99, 0.2)',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(75, 85, 99, 0.3)',
                      transition: 'all 0.2s ease',
                      fontWeight: 'medium'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(75, 85, 99, 0.3)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(75, 85, 99, 0.2)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#cbd5e1" viewBox="0 0 24 24" style={{width: '1rem', height: '1rem'}}>
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>{getRefereeForMatch(1001).phone}</span>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Bracket Final */}
            <div style={{
              background: "linear-gradient(135deg, rgba(234, 88, 12, 0.1), rgba(245, 158, 11, 0.05))",
              borderRadius: "1rem",
              padding: "1.5rem",
              border: "1px solid rgba(245, 158, 11, 0.2)",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              marginBottom: "2rem"
            }}>
              <h2 style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#fbbf24",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fbbf24" viewBox="0 0 16 16">
                  <path d="M6.375 7.125V4.658h1.78c.973 0 1.542.457 1.542 1.237 0 .802-.604 1.23-1.764 1.23H6.375zm0 3.762h1.898c1.184 0 1.81-.48 1.81-1.377 0-.885-.65-1.348-1.886-1.348H6.375v2.725z"/>
                  <path d="M4.002 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4h-8zm0 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
                </svg>
                Struktur Bracket Final
              </h2>
              
              <TournamentBracket bracketType="Final" teams={finalTeams} />
            </div>
            
            {/* Jadwal dan Info */}
            <div style={{
              background: "rgba(30, 41, 59, 0.5)",
              borderRadius: "1rem",
              padding: "1.5rem",
              border: "1px solid rgba(75, 85, 99, 0.4)"
            }}>
              <h2 style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "white",
                marginBottom: "1rem"
              }}>
                Informasi Final
              </h2>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                gap: "1.5rem"
              }}>
                <div style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  borderRadius: "0.75rem",
                  padding: "1.25rem",
                  border: "1px solid rgba(75, 85, 99, 0.2)"
                }}>
                  <h3 style={{
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    color: "#fbbf24",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fbbf24" viewBox="0 0 16 16">
                      <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/>
                      <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/>
                    </svg>
                    Jadwal
                  </h3>
                  
                  <ul style={{
                    listStyleType: "none",
                    padding: 0,
                    margin: 0
                  }}>
                    <li style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.75rem",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      background: "rgba(30, 41, 59, 0.5)",
                      border: "1px solid rgba(75, 85, 99, 0.2)"
                    }}>
                      <div style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #ea580c, #f59e0b)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold"
                      }}>
                        1
                      </div>
                      <div>
                        <div style={{ color: "white", fontWeight: "500" }}>Semi Final</div>
                        <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>28 Mei, 2025 - 10:00 WIB</div>
                      </div>
                    </li>
                    <li style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.75rem",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      background: "rgba(30, 41, 59, 0.5)",
                      border: "1px solid rgba(75, 85, 99, 0.2)"
                    }}>
                      <div style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #ea580c, #f59e0b)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold"
                      }}>
                        2
                      </div>
                      <div>
                        <div style={{ color: "white", fontWeight: "500" }}>Final</div>
                        <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>28 Mei, 2025 - 15:00 WIB</div>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  borderRadius: "0.75rem",
                  padding: "1.25rem",
                  border: "1px solid rgba(75, 85, 99, 0.2)"
                }}>
                  <h3 style={{
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    color: "#fbbf24",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fbbf24" viewBox="0 0 16 16">
                      <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/>
                      <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/>
                    </svg>
                    Jadwal
                  </h3>
                  
                  <ul style={{
                    listStyleType: "none",
                    padding: 0,
                    margin: 0
                  }}>
                    <li style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.75rem",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      background: "rgba(30, 41, 59, 0.5)",
                      border: "1px solid rgba(75, 85, 99, 0.2)"
                    }}>
                      <div style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #ea580c, #f59e0b)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold"
                      }}>
                        1
                      </div>
                      <div>
                        <div style={{ color: "white", fontWeight: "500" }}>Semi Final</div>
                        <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>28 Mei, 2025 - 10:00 WIB</div>
                      </div>
                    </li>
                    <li style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.75rem",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      background: "rgba(30, 41, 59, 0.5)",
                      border: "1px solid rgba(75, 85, 99, 0.2)"
                    }}>
                      <div style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #ea580c, #f59e0b)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold"
                      }}>
                        2
                      </div>
                      <div>
                        <div style={{ color: "white", fontWeight: "500" }}>Final</div>
                        <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>28 Mei, 2025 - 15:00 WIB</div>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  borderRadius: "0.75rem",
                  padding: "1.25rem",
                  border: "1px solid rgba(75, 85, 99, 0.2)"
                }}>
                  <h3 style={{
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    color: "#fbbf24",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fbbf24" viewBox="0 0 16 16">
"use client";

import { useEffect, useState } from "react";
import TournamentBracket from "../../components/TournamentBracket";
import { Team } from "../../types";
import Link from "next/link";
import Image from "next/image";
import { 
  onBracketASpecialSlotsChange, 
  onBracketBSpecialSlotsChange,
  getFinalsWinner,
  saveFinalsWinner,
  onFinalsWinnerChange,
  getFinalsThirdPlace,
  onFinalsThirdPlaceChange,
  onFinalsMatchesChange
} from '../../firebase/firestore';
import { UIMatch, convertToUIMatches } from '../../types/adapter';
import { getRefereeForMatch } from '../../types/referees';

// Definisikan tipe untuk Match
type Match = UIMatch;

// Link WA helper
const getWhatsAppLink = (phone: string) => {
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;
};

const FinalsPage = () => {
  const [finalTeams, setFinalTeams] = useState<Team[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [specialSlotsA, setSpecialSlotsA] = useState<string[]>([]);
  const [specialSlotsB, setSpecialSlotsB] = useState<string[]>([]);
  const [winnerTeam, setWinnerTeam] = useState<Team | null>(null);
  const [thirdPlaceTeam, setThirdPlaceTeam] = useState<Team | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Hubungkan ke Firebase untuk mendapatkan data
  useEffect(() => {
    // Subscribe to special slots from Bracket A
    const unsubscribeA = onBracketASpecialSlotsChange((slots) => {
      setSpecialSlotsA(slots);
    });
    
    // Subscribe to special slots from Bracket B
    const unsubscribeB = onBracketBSpecialSlotsChange((slots) => {
      setSpecialSlotsB(slots);
    });
    
    // Subscribe to finals winner
    const unsubscribeWinner = onFinalsWinnerChange((winner) => {
      if (winner) {
        setWinnerTeam(winner);
        setShowConfetti(true);
      }
    });
    
    // Subscribe to third place winner
    const unsubscribeThirdPlace = onFinalsThirdPlaceChange((winner) => {
      if (winner) {
        setThirdPlaceTeam(winner);
      }
    });
    
    // Subscribe to finals matches
    const unsubscribeMatches = onFinalsMatchesChange((matches) => {
      setMatches(matches);
    });
    
    // Ambil data juara langsung saat komponen dimount
    const fetchWinners = async () => {
      const savedWinner = await getFinalsWinner();
      if (savedWinner) {
        setWinnerTeam(savedWinner);
        setShowConfetti(true);
      }
      
      const savedThirdPlace = await getFinalsThirdPlace();
      if (savedThirdPlace) {
        setThirdPlaceTeam(savedThirdPlace);
      }
    };
    
    fetchWinners();
    
    // Cleanup
    return () => {
      unsubscribeA();
      unsubscribeB();
      unsubscribeWinner();
      unsubscribeThirdPlace();
      unsubscribeMatches();
    };
  }, []);

  // Update finalTeams saat specialSlots berubah
  useEffect(() => {
    try {
      // Pastikan kita mengambil hanya 4 tim dari masing-masing bracket
      // dan hapus duplikasi jika ada
      const uniqueTeamsA = [...new Set(specialSlotsA)];
      const uniqueTeamsB = [...new Set(specialSlotsB)];
      
      // Batasi hanya 4 tim dari masing-masing bracket
      const limitedTeamsA = uniqueTeamsA.slice(0, 4);
      const limitedTeamsB = uniqueTeamsB.slice(0, 4);
      
      // Konversi string[] ke Team[]
      const teamsA: Team[] = limitedTeamsA.map((name: string, idx: number) => ({
        id: idx + 1,
        name,
        bracket: 'A'  // Tandai tim dari bracket A
      }));
      
      const teamsB: Team[] = limitedTeamsB.map((name: string, idx: number) => ({
        id: idx + 5,
        name,
        bracket: 'B'  // Tandai tim dari bracket B
      }));
      
      // Gabung dan update state
      setFinalTeams([...teamsA, ...teamsB]);

      // Log untuk debugging
      console.log('Final teams from Bracket A:', limitedTeamsA);
      console.log('Final teams from Bracket B:', limitedTeamsB);
    } catch (error) {
      console.error('Error processing final teams:', error);
      setFinalTeams([]);
    }
  }, [specialSlotsA, specialSlotsB]);
  
  // Fungsi untuk menetapkan pemenang
  const handleSetWinner = async (team: Team) => {
    setWinnerTeam(team);
    await saveFinalsWinner(team);
    setShowConfetti(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0f172a",
        backgroundImage:
          "radial-gradient(circle at 25% 10%, rgba(234, 88, 12, 0.15) 0%, transparent 40%), radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.1) 0%, transparent 40%)",
      }}
    >
      {showConfetti && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 100,
          background: "url('/images/confetti.gif') repeat"
        }} />
      )}
      
      <div style={{ position: "relative", paddingTop: "4rem", paddingBottom: "8rem" }}>
        {/* Background Element */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            opacity: 0.2,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/images/logo-mobile-legend-31251.png"
            alt="Background Logo"
            fill
            style={{ objectFit: "contain", opacity: 0.1 }}
            sizes="100vw"
          />
        </div>
        
        {/* Header */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
            <div style={{ position: "relative", zIndex: 10, marginBottom: "3rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "2rem",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "1rem" : "0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", width: isMobile ? "100%" : "auto" }}>
                  <Link
                    href="/"
                    style={{
                      background: "rgba(31, 41, 55, 0.8)",
                      padding: "0.75rem",
                      borderRadius: "9999px",
                      marginRight: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      border: "1px solid rgba(75, 85, 99, 0.4)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ height: "1.5rem", width: "1.5rem", color: "#60a5fa" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </Link>
                  <div>
                    <h1
                      style={{
                        fontSize: isMobile ? "2.5rem" : "3.25rem",
                        fontWeight: 800,
                        background: "linear-gradient(to right, #f59e42, #fbbf24)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginBottom: "0.5rem",
                        textShadow: "0 2px 10px rgba(245, 158, 11, 0.5)",
                      }}
                    >
                      GRAND FINALS
                    </h1>
                    <p
                      style={{
                        color: "#fbbf24",
                        fontSize: "1.25rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        style={{ width: "1.25rem", height: "1.25rem" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                        />
                      </svg>
                      28 Mei, 2025
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    flexDirection: isMobile ? "column" : "row",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  <Link
                    href="/bracket-a"
                    style={{
                      fontSize: "0.875rem",
                      padding: "0.75rem 1.25rem",
                      borderRadius: "0.5rem",
                      background:
                        "linear-gradient(to right, rgba(49, 46, 129, 0.6), rgba(79, 70, 229, 0.6))",
                      border: "1px solid rgba(79, 70, 229, 0.7)",
                      color: "#c7d2fe",
                      transition: "all 0.3s ease",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.025em",
                      width: isMobile ? "100%" : "auto",
                    }}
                  >
                    Bracket A
                  </Link>
                  <Link
                    href="/bracket-b"
                    style={{
                      fontSize: "0.875rem",
                      padding: "0.75rem 1.25rem",
                      borderRadius: "0.5rem",
                      background:
                        "linear-gradient(to right, rgba(146, 64, 14, 0.6), rgba(234, 88, 12, 0.6))",
                      border: "1px solid rgba(234, 88, 12, 0.7)",
                      color: "#fde68a",
                      transition: "all 0.3s ease",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.025em",
                      width: isMobile ? "100%" : "auto",
                    }}
                  >
                    Bracket B
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Informasi Finalis */}
            <div style={{
              background: "linear-gradient(135deg, rgba(234, 88, 12, 0.1), rgba(245, 158, 11, 0.05))",
              borderRadius: "1rem",
              padding: "1.5rem",
              marginBottom: "2rem",
              border: "1px solid rgba(245, 158, 11, 0.2)",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
            }}>
              <h2 style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#fbbf24",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fbbf24" viewBox="0 0 16 16">
                  <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
                </svg>
                Tim Finalis
              </h2>
              
              {finalTeams.length === 0 ? (
                <div style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  color: '#94a3b8',
                  textAlign: 'center',
                  border: '1px dashed rgba(100, 116, 139, 0.5)'
                }}>
                  <p>Data tim finalis belum tersedia</p>
                </div>
              ) : (
              <div style={{
                display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: "2rem"
                }}>
                  {/* Tim dari Bracket A */}
                  <div style={{
                    padding: "1.5rem",
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))",
                      borderRadius: "0.75rem",
                    border: "1px solid rgba(59, 130, 246, 0.3)"
                  }}>
                    <h3 style={{
                      fontSize: "1.25rem",
                      color: "#60a5fa",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
                      </svg>
                      Tim dari Bracket A
                    </h3>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                      gap: "1rem"
                    }}>
                      {finalTeams.filter(team => team.bracket === 'A').map((team) => (
                        <div 
                          key={`team-a-${team.id}`} 
                          style={{
                            background: winnerTeam?.id === team.id 
                              ? "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.2))" 
                              : "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))",
                            padding: "1rem",
                            borderRadius: "0.5rem",
                            border: winnerTeam?.id === team.id
                              ? "1px solid rgba(59, 130, 246, 0.8)"
                              : "1px solid rgba(59, 130, 246, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            boxShadow: winnerTeam?.id === team.id
                              ? "0 0 15px rgba(59, 130, 246, 0.4)"
                              : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer"
                    }}
                    onClick={() => handleSetWinner(team)}
                    >
                      <div style={{
                            backgroundColor: "rgba(59, 130, 246, 0.2)",
                            color: "#93c5fd",
                            width: "2.5rem",
                            height: "2.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                            borderRadius: "9999px",
                        fontWeight: "bold",
                            fontSize: "1rem"
                          }}>A{team.id}</div>
                          <span style={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                          color: "white",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}>{team.name}</span>
                      {winnerTeam?.id === team.id && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#60a5fa" viewBox="0 0 16 16" style={{ marginLeft: 'auto' }}>
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tim dari Bracket B */}
                  <div style={{
                    padding: "1.5rem",
                    background: "linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(109, 40, 217, 0.05))",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(124, 58, 237, 0.3)"
                  }}>
                    <h3 style={{
                      fontSize: "1.25rem",
                      color: "#a78bfa",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
                      </svg>
                      Tim dari Bracket B
                    </h3>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                      gap: "1rem"
                    }}>
                      {finalTeams.filter(team => team.bracket === 'B').map((team) => (
                        <div 
                          key={`team-b-${team.id}`} 
                          style={{
                            background: winnerTeam?.id === team.id 
                              ? "linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(109, 40, 217, 0.2))" 
                              : "linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(109, 40, 217, 0.1))",
                            padding: "1rem",
                            borderRadius: "0.5rem",
                            border: winnerTeam?.id === team.id
                              ? "1px solid rgba(124, 58, 237, 0.8)"
                              : "1px solid rgba(124, 58, 237, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            boxShadow: winnerTeam?.id === team.id
                              ? "0 0 15px rgba(124, 58, 237, 0.4)"
                              : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            cursor: "pointer"
                          }}
                          onClick={() => handleSetWinner(team)}
                        >
                          <div style={{
                            backgroundColor: "rgba(124, 58, 237, 0.2)",
                            color: "#a78bfa",
                            width: "2.5rem",
                            height: "2.5rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "9999px",
                            fontWeight: "bold",
                            fontSize: "1rem"
                          }}>B{team.id-4}</div>
                          <span style={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            color: "white",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}>{team.name}</span>
                          {winnerTeam?.id === team.id && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#a78bfa" viewBox="0 0 16 16" style={{ marginLeft: 'auto' }}>
                              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  </div>
                )}
            </div>
            
            {/* Winner Trophy */}
            {winnerTeam && (
              <div style={{
                background: "radial-gradient(circle at center, rgba(251, 191, 36, 0.3), transparent 70%)",
                borderRadius: "1rem",
                padding: "2rem",
                marginBottom: "2rem",
                textAlign: "center",
                boxShadow: "0 0 30px rgba(251, 191, 36, 0.2)",
                border: "1px solid rgba(251, 191, 36, 0.3)"
              }}>
                <div style={{
                  fontSize: "1.5rem",
                  color: "#fbbf24",
                  marginBottom: "0.5rem",
                  fontWeight: "bold"
                }}>
                  🏆 JUARA TURNAMEN 🏆
                </div>
                <div style={{
                  fontSize: "2.5rem",
                  fontWeight: "900",
                  color: "white",
                  marginBottom: "1rem",
                  textShadow: "0 0 10px rgba(251, 191, 36, 0.8), 0 0 20px rgba(251, 191, 36, 0.4)"
                }}>
                  {winnerTeam.name}
                </div>
                <div style={{
                  color: "#94a3b8",
                  fontSize: "1rem"
                }}>
                  Selamat kepada tim {winnerTeam.name} yang telah menjadi juara turnamen!
                </div>
              </div>
            )}
            
            {/* Third Place Trophy */}
            {thirdPlaceTeam && (
              <div style={{
                background: "radial-gradient(circle at center, rgba(168, 85, 247, 0.2), transparent 70%)",
                borderRadius: "1rem",
                padding: "1.5rem",
                marginBottom: "2rem",
                textAlign: "center",
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.15)",
                border: "1px solid rgba(168, 85, 247, 0.2)"
              }}>
                <div style={{
                  fontSize: "1.25rem",
                  color: "#c084fc",
                  marginBottom: "0.5rem",
                  fontWeight: "bold"
                }}>
                  🥉 JUARA 3 🥉
                </div>
                <div style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: "white",
                  marginBottom: "0.75rem",
                  textShadow: "0 0 8px rgba(168, 85, 247, 0.6), 0 0 15px rgba(168, 85, 247, 0.3)"
                }}>
                  {thirdPlaceTeam.name}
                </div>
                <div style={{
                  color: "#94a3b8",
                  fontSize: "0.95rem"
                }}>
                  Selamat kepada tim {thirdPlaceTeam.name} yang telah menjadi juara 3!
                </div>
              </div>
            )}
            
            {/* Perebutan Juara 3 */}
            <div style={{
              marginBottom: "2rem",
              background: "linear-gradient(135deg, rgba(107, 114, 128, 0.15), rgba(75, 85, 99, 0.05))",
              padding: "1rem",
              borderRadius: "1rem",
              border: "1px solid rgba(107, 114, 128, 0.3)",
            }}>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#94a3b8",
                marginBottom: "1rem",
                textAlign: "center",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "0.5rem" }}>
                  <path fillRule="evenodd" d="M4 0a2 2 0 1 0 0 4h8a2 2 0 1 0 0-4H4zm.879.879a1 1 0 1 0-1.758 0l-.5 2A1 1 0 0 0 4 4h8a1 1 0 0 0 1.379-1.121l-.5-2A1 1 0 0 0 11.12.879L11 1H5l-.12-.121zM7.188 6.05L8 10l.812-3.95A1.812 1.812 0 0 0 8 6a1.812 1.812 0 0 0-.812.05ZM8.5 5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM3.88 6.963A1 1 0 0 0 4 7h8a1 1 0 0 0 .965-.738l1.84-6.648A2.99 2.99 0 0 1 13 0H3a2.99 2.99 0 0 1-1.806.628L3.034 7.263A1 1 0 0 0 3.88 6.963Z"/>
                </svg>
                Perebutan Juara 3
              </h3>

              {/* Referee information */}
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(17, 24, 39, 0.5)',
                borderRadius: '0.75rem',
                marginBottom: '1rem',
                border: '1px solid rgba(107, 114, 128, 0.3)',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  backgroundColor: 'rgba(79, 70, 229, 0.1)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  border: '1px solid rgba(79, 70, 229, 0.2)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#94a3b8" style={{width: '1.25rem', height: '1.25rem'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <span style={{ color: '#cbd5e1', fontWeight: 'bold', fontSize: '1rem' }}>
                      Wasit: {getRefereeForMatch(1001).name}
                    </span>
                  </div>
                  <a 
                    href={getWhatsAppLink(getRefereeForMatch(1001).phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: '#cbd5e1',
                      backgroundColor: 'rgba(75, 85, 99, 0.2)',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(75, 85, 99, 0.3)',
                      transition: 'all 0.2s ease',
                      fontWeight: 'medium'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(75, 85, 99, 0.3)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(75, 85, 99, 0.2)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#cbd5e1" viewBox="0 0 24 24" style={{width: '1rem', height: '1rem'}}>
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>{getRefereeForMatch(1001).phone}</span>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Bracket Final */}
            <div style={{
              background: "linear-gradient(135deg, rgba(234, 88, 12, 0.1), rgba(245, 158, 11, 0.05))",
              borderRadius: "1rem",
              padding: "1.5rem",
              border: "1px solid rgba(245, 158, 11, 0.2)",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              marginBottom: "2rem"
            }}>
              <h2 style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#fbbf24",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fbbf24" viewBox="0 0 16 16">
                  <path d="M6.375 7.125V4.658h1.78c.973 0 1.542.457 1.542 1.237 0 .802-.604 1.23-1.764 1.23H6.375zm0 3.762h1.898c1.184 0 1.81-.48 1.81-1.377 0-.885-.65-1.348-1.886-1.348H6.375v2.725z"/>
                  <path d="M4.002 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4h-8zm0 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
                </svg>
                Struktur Bracket Final
              </h2>
              
              <TournamentBracket bracketType="Final" teams={finalTeams} />
            </div>
            
            {/* Jadwal dan Info */}
            <div style={{
              background: "rgba(30, 41, 59, 0.5)",
              borderRadius: "1rem",
              padding: "1.5rem",
              border: "1px solid rgba(75, 85, 99, 0.4)"
            }}>
              <h2 style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "white",
                marginBottom: "1rem"
              }}>
                Informasi Final
              </h2>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                gap: "1.5rem"
              }}>
                <div style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  borderRadius: "0.75rem",
                  padding: "1.25rem",
                  border: "1px solid rgba(75, 85, 99, 0.2)"
                }}>
                  <h3 style={{
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    color: "#fbbf24",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fbbf24" viewBox="0 0 16 16">
                      <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/>
                      <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/>
                    </svg>
                    Jadwal
                  </h3>
                  
                  <ul style={{
                    listStyleType: "none",
                    padding: 0,
                    margin: 0
                  }}>
                    <li style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.75rem",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      background: "rgba(30, 41, 59, 0.5)",
                      border: "1px solid rgba(75, 85, 99, 0.2)"
                    }}>
                      <div style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #ea580c, #f59e0b)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold"
                      }}>
                        1
                      </div>
                      <div>
                        <div style={{ color: "white", fontWeight: "500" }}>Semi Final</div>
                        <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>28 Mei, 2025 - 10:00 WIB</div>
                      </div>
                    </li>
                    <li style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.75rem",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      background: "rgba(30, 41, 59, 0.5)",
                      border: "1px solid rgba(75, 85, 99, 0.2)"
                    }}>
                      <div style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #ea580c, #f59e0b)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold"
                      }}>
                        2
                      </div>
                      <div>
                        <div style={{ color: "white", fontWeight: "500" }}>Final</div>
                        <div style={{ color: "#94a3b8", fontSize: "0.875rem" }}>28 Mei, 2025 - 15:00 WIB</div>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  borderRadius: "0.75rem",
                  padding: "1.25rem",
                  border: "1px solid rgba(75, 85, 99, 0.2)"
                }}>
                  <h3 style={{
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    color: "#fbbf24",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fbbf24" viewBox="0 0 16 16">
"use client";

import { useEffect, useState } from "react";
import TournamentBracket from "../../components/TournamentBracket";
import { Team } from "../../types";
import Link from "next/link";
import Image from "next/image";
import { 
  onBracketASpecialSlotsChange, 
  onBracketBSpecialSlotsChange,
  getFinalsWinner,
  saveFinalsWinner,
  onFinalsWinnerChange,
  getFinalsThirdPlace,
  onFinalsThirdPlaceChange,
  onFinalsMatchesChange
} from '../../firebase/firestore';
import { UIMatch, convertToUIMatches } from '../../types/adapter';
import { getRefereeForMatch } from '../../types/referees';

// Definisikan tipe untuk Match
type Match = UIMatch;

// Link WA helper
const getWhatsAppLink = (phone: string) => {
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;
};

const FinalsPage = () => {
  const [finalTeams, setFinalTeams] = useState<Team[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [specialSlotsA, setSpecialSlotsA] = useState<string[]>([]);
  const [specialSlotsB, setSpecialSlotsB] = useState<string[]>([]);
  const [winnerTeam, setWinnerTeam] = useState<Team | null>(null);
  const [thirdPlaceTeam, setThirdPlaceTeam] = useState<Team | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Hubungkan ke Firebase untuk mendapatkan data
  useEffect(() => {
    // Subscribe to special slots from Bracket A
    const unsubscribeA = onBracketASpecialSlotsChange((slots) => {
      setSpecialSlotsA(slots);
    });
    
    // Subscribe to special slots from Bracket B
    const unsubscribeB = onBracketBSpecialSlotsChange((slots) => {
      setSpecialSlotsB(slots);
    });
    
    // Subscribe to finals winner
    const unsubscribeWinner = onFinalsWinnerChange((winner) => {
      if (winner) {
        setWinnerTeam(winner);
        setShowConfetti(true);
      }
    });
    
    // Subscribe to third place winner
    const unsubscribeThirdPlace = onFinalsThirdPlaceChange((winner) => {
      if (winner) {
        setThirdPlaceTeam(winner);
      }
    });
    
    // Subscribe to finals matches
    const unsubscribeMatches = onFinalsMatchesChange((matches) => {
      setMatches(matches);
    });
    
    // Ambil data juara langsung saat komponen dimount
    const fetchWinners = async () => {
      const savedWinner = await getFinalsWinner();
      if (savedWinner) {
        setWinnerTeam(savedWinner);
        setShowConfetti(true);
      }
      
      const savedThirdPlace = await getFinalsThirdPlace();
      if (savedThirdPlace) {
        setThirdPlaceTeam(savedThirdPlace);
      }
    };
    
    fetchWinners();
    
    // Cleanup
    return () => {
      unsubscribeA();
      unsubscribeB();
      unsubscribeWinner();
      unsubscribeThirdPlace();
      unsubscribeMatches();
    };
  }, []);

  // Update finalTeams saat specialSlots berubah
  useEffect(() => {
    try {
      // Pastikan kita mengambil hanya 4 tim dari masing-masing bracket
      // dan hapus duplikasi jika ada
      const uniqueTeamsA = [...new Set(specialSlotsA)];
      const uniqueTeamsB = [...new Set(specialSlotsB)];
      
      // Batasi hanya 4 tim dari masing-masing bracket
      const limitedTeamsA = uniqueTeamsA.slice(0, 4);
      const limitedTeamsB = uniqueTeamsB.slice(0, 4);
      
      // Konversi string[] ke Team[]
      const teamsA: Team[] = limitedTeamsA.map((name: string, idx: number) => ({
        id: idx + 1,
        name,
        bracket: 'A'  // Tandai tim dari bracket A
      }));
      
      const teamsB: Team[] = limitedTeamsB.map((name: string, idx: number) => ({
        id: idx + 5,
        name,
        bracket: 'B'  // Tandai tim dari bracket B
      }));
      
      // Gabung dan update state
      setFinalTeams([...teamsA, ...teamsB]);

      // Log untuk debugging
      console.log('Final teams from Bracket A:', limitedTeamsA);
      console.log('Final teams from Bracket B:', limitedTeamsB);
    } catch (error) {
      console.error('Error processing final teams:', error);
      setFinalTeams([]);
    }
  }, [specialSlotsA, specialSlotsB]);
  
  // Fungsi untuk menetapkan pemenang
  const handleSetWinner = async (team: Team) => {
    setWinnerTeam(team);
    await saveFinalsWinner(team);
    setShowConfetti(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0f172a",
        backgroundImage:
          "radial-gradient(circle at 25% 10%, rgba(234, 88, 12, 0.15) 0%, transparent 40%), radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.1) 0%, transparent 40%)",
      }}
    >
      {showConfetti && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 100,
          background: "url('/images/confetti.gif') repeat"
        }} />
      )}
      
      <div style={{ position: "relative", paddingTop: "4rem", paddingBottom: "8rem" }}>
        {/* Background Element */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            opacity: 0.2,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/images/logo-mobile-legend-31251.png"
            alt="Background Logo"
            fill
            style={{ objectFit: "contain", opacity: 0.1 }}
            sizes="100vw"
          />
        </div>
        
        {/* Header */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
            <div style={{ position: "relative", zIndex: 10, marginBottom: "3rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "2rem",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "1rem" : "0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", width: isMobile ? "100%" : "auto" }}>
                  <Link
                    href="/"
                    style={{
                      background: "rgba(31, 41, 55, 0.8)",
                      padding: "0.75rem",
                      borderRadius: "9999px",
                      marginRight: "1.25rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      border: "1px solid rgba(75, 85, 99, 0.4)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ height: "1.5rem", width: "1.5rem", color: "#60a5fa" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </Link>
                  <div>
                    <h1
                      style={{
                        fontSize: isMobile ? "2.5rem" : "3.25rem",
                        fontWeight: 800,
                        background: "linear-gradient(to right, #f59e42, #fbbf24)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginBottom: "0.5rem",
                        textShadow: "0 2px 10px rgba(245, 158, 11, 0.5)",
                      }}
                    >
                      GRAND FINALS
                    </h1>
                    <p
                      style={{
                        color: "#fbbf24",
                        fontSize: "1.25rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        style={{ width: "1.25rem", height: "1.25rem" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
          <p>© 2025 ML Tournament Bracket. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FinalsPage; 