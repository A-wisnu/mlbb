"use client";

import { useEffect, useState } from "react";
import TournamentBracket from "../../components/TournamentBracket";
import { Team } from "../../types";
import Link from "next/link";
import Image from "next/image";

const FinalsPage = () => {
  const [finalTeams, setFinalTeams] = useState<Team[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    try {
      // Ambil 4 tim dari bracketA dan 4 tim dari bracketB yang lolos ke final
      const specialA = localStorage.getItem("bracketA_specialSlots");
      const specialB = localStorage.getItem("bracketB_specialSlots");
      let teamsA: Team[] = [];
      let teamsB: Team[] = [];
      if (specialA) {
        teamsA = JSON.parse(specialA);
      }
      if (specialB) {
        teamsB = JSON.parse(specialB);
      }
      // Pastikan format tim sesuai interface Team
      teamsA = teamsA.map((t: any, idx: number) => ({
        id: t.id ?? idx + 1,
        name: t.name ?? t,
      }));
      teamsB = teamsB.map((t: any, idx: number) => ({
        id: t.id ?? idx + 5,
        name: t.name ?? t,
      }));
      setFinalTeams([...teamsA, ...teamsB]);
    } catch (error) {
      setFinalTeams([]);
    }
  }, [lastUpdate]);

  useEffect(() => {
    // Sync jika ada perubahan localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "bracketA_specialSlots" ||
        e.key === "bracketB_specialSlots"
      ) {
        setLastUpdate(Date.now());
      }
    };
    window.addEventListener("storage", handleStorageChange);
    const intervalId = setInterval(() => setLastUpdate(Date.now()), 5000);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0f172a",
        backgroundImage:
          "radial-gradient(circle at 25% 10%, rgba(79, 70, 229, 0.15) 0%, transparent 40%), radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.1) 0%, transparent 40%)",
      }}
    >
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
                      FINAL BRACKET
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
            {/* Bracket Final */}
            <TournamentBracket bracketType="Final" teams={finalTeams} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalsPage; 