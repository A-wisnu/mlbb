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
  onFinalsThirdPlaceChange
} from '../../firebase/firestore';
import { UIMatch } from '../../types/adapter';

// Definisikan tipe untuk Match
type Match = UIMatch;

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
                      29 Mei, 2025
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
            
            {/* Content */}
            {/* Tambahkan konten di sini */}
                </div>
                    </div>
                  </div>
                  
      {/* Footer */}
      <footer style={{ 
        marginTop: "auto", 
        padding: "2rem 1rem", 
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        borderTop: "1px solid rgba(51, 65, 85, 0.5)" 
      }}>
                    <div style={{
          maxWidth: "1200px", 
          margin: "0 auto", 
                textAlign: "center",
          color: "#94a3b8" 
        }}>
          <p>© 2025 ML Tournament Bracket. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FinalsPage; 