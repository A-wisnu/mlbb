'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  onBracketBMatchesChange, 
  onBracketBByeTeamChange, 
  onBracketBSpecialSlotsChange 
} from '../../firebase/firestore';
import { UIMatch, convertToUIMatches } from '../../types/adapter';
import { getRefereeForMatch } from '../../types/referees';

// Define Match type
type Match = UIMatch;

// Link WA helper
const getWhatsAppLink = (phone: string) => {
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}`;
};

const BracketB = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [byeTeam, setByeTeam] = useState<string | null>(null);
  const [specialSlotTeams, setSpecialSlotTeams] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // Responsive check
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Load data from Firebase (real-time)
  useEffect(() => {
    // Subscribe to matches changes
    const unsubscribeMatches = onBracketBMatchesChange((matches) => {
      setMatches(convertToUIMatches(matches));
    });
    
    // Subscribe to bye team changes
    const unsubscribeByeTeam = onBracketBByeTeamChange(setByeTeam);
    
    // Subscribe to special slots changes
    const unsubscribeSpecialSlots = onBracketBSpecialSlotsChange(setSpecialSlotTeams);
    
    // Cleanup function
    return () => {
      unsubscribeMatches();
      unsubscribeByeTeam();
      unsubscribeSpecialSlots();
    };
  }, []);

  // Load data from localStorage
  useEffect(() => {
    try {
      const storedTeams = localStorage.getItem('bracketB_teams');
      if (storedTeams) setTeams(JSON.parse(storedTeams));
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, [lastUpdate]);

  // Listen for changes from other tabs and polling
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === 'bracketB_teams'
      ) {
        setLastUpdate(Date.now());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    const intervalId = setInterval(() => setLastUpdate(Date.now()), 5000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  // Helper for match status
  const getStatus = (status: string) => {
    if (status === 'completed') return { label: 'Selesai', bg: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' };
    if (status === 'playing') return { label: 'Berlangsung', bg: 'rgba(234, 88, 12, 0.2)', color: '#fdba74' };
    return { label: 'Terjadwal', bg: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' };
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0f172a',
      backgroundImage:
        'radial-gradient(circle at 25% 10%, rgba(79, 70, 229, 0.15) 0%, transparent 40%), radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.1) 0%, transparent 40%)',
    }}>
      <div style={{ position: 'relative', paddingTop: '4rem', paddingBottom: '8rem' }}>
        {/* Background Element */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.2, pointerEvents: 'none' }}>
          <Image
            src="/images/logo-mobile-legend-31251.png"
            alt="Background Logo"
            fill
            style={{ objectFit: 'contain', opacity: 0.1 }}
            sizes="100vw"
          />
        </div>
        {/* Header */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
            <div style={{ position: 'relative', zIndex: 10, marginBottom: '3rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '1rem' : '0',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', width: isMobile ? '100%' : 'auto' }}>
                  <Link href="/" style={{
                    background: 'rgba(31, 41, 55, 0.8)',
                    padding: '0.75rem',
                    borderRadius: '9999px',
                    marginRight: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid rgba(75, 85, 99, 0.4)',
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '1.5rem', width: '1.5rem', color: '#60a5fa' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </Link>
                  <div>
                    <h1 style={{
                      fontSize: isMobile ? '2.5rem' : '3.25rem',
                      fontWeight: 800,
                      background: 'linear-gradient(to right, #3b82f6, #93c5fd)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      marginBottom: '0.5rem',
                      textShadow: '0 2px 10px rgba(59, 130, 246, 0.5)',
                    }}>Bracket B</h1>
                    <p style={{
                      color: '#60a5fa',
                      fontSize: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <span>29 Mei, 2025</span>
                    </p>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  flexDirection: isMobile ? 'column' : 'row',
                  width: isMobile ? '100%' : 'auto',
                }}>
                  <Link href="/bracket-a" style={{
                    fontSize: '0.875rem',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '0.5rem',
                    background: 'linear-gradient(to right, rgba(49, 46, 129, 0.6), rgba(79, 70, 229, 0.6))',
                    border: '1px solid rgba(79, 70, 229, 0.7)',
                    color: '#c7d2fe',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                    width: isMobile ? '100%' : 'auto',
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1rem', height: '1rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                    Ke Bracket A
                  </Link>
                  <Link href="/finals" style={{
                    fontSize: '0.875rem',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '0.5rem',
                    background: 'linear-gradient(to right, rgba(146, 64, 14, 0.6), rgba(234, 88, 12, 0.6))',
                    border: '1px solid rgba(234, 88, 12, 0.7)',
                    color: '#fde68a',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                    width: isMobile ? '100%' : 'auto',
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1rem', height: '1rem' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                    </svg>
                    Lihat Final
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', width: '100%', position: 'relative', zIndex: 10 }}>
          {/* Bracket Structure */}
          <div style={{
            overflowX: 'auto',
            borderRadius: '1.25rem',
            background: 'rgba(15, 23, 42, 0.7)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 8px 30px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            padding: '0.5rem',
            WebkitOverflowScrolling: 'touch',
          }}>
            <div style={{ minWidth: '1000px', padding: '2rem' }}>
              {/* Bye Team Section */}
              {byeTeam && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(67, 56, 202, 0.05))',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(79, 70, 229, 0.3)',
                  marginBottom: '1rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                }}>
                  <h3 style={{ fontSize: '1.25rem', color: '#93c5fd', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
                    Tim dengan Slot Khusus (Bye to Round 2)
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.5), rgba(30, 58, 138, 0.3))',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}>
                      <div style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.3)',
                        color: '#93c5fd',
                        width: '2.5rem',
                        height: '2.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '9999px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172" />
                        </svg>
                      </div>
                      <span style={{ color: 'white', fontWeight: '600', fontSize: '1.125rem', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>{byeTeam}</span>
                    </div>
                  </div>
                </div>
              )}
              {/* Special Slot Teams Section */}
              {specialSlotTeams && specialSlotTeams.length > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.2), rgba(217, 119, 6, 0.05))',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(234, 88, 12, 0.3)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  marginBottom: '2rem',
                }}>
                  <h3 style={{ fontSize: '1.25rem', color: '#fdba74', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
                    Tim dengan Slot Khusus (Langsung Ke Final)
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                    {specialSlotTeams.map((team, idx) => (
                      <div key={`specialSlot-${idx}`} style={{
                        background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.5), rgba(146, 64, 14, 0.3))',
                        borderRadius: '0.75rem',
                        padding: '1rem',
                        border: '1px solid rgba(234, 88, 12, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}>
                        <div style={{
                          backgroundColor: 'rgba(234, 88, 12, 0.3)',
                          color: '#fdba74',
                          width: '2.5rem',
                          height: '2.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '9999px',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          boxShadow: '0 0 10px rgba(234, 88, 12, 0.5)',
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172" />
                          </svg>
                        </div>
                        <span style={{ color: 'white', fontWeight: '600', fontSize: '1.125rem', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>{team}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Teams List Section */}
              {teams && teams.length > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(30, 64, 175, 0.04))',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  marginBottom: '2rem',
                }}>
                  <h3 style={{ fontSize: '1.25rem', color: '#60a5fa', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
                    Daftar Tim Bracket B
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                    {teams.map((team, idx) => (
                      <div key={`team-${idx}`} style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        fontSize: '1rem',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        boxShadow: '0 2px 6px rgba(59, 130, 246, 0.08)',
                      }}>{team}</div>
                    ))}
                  </div>
                </div>
              )}
              {/* Bracket Columns */}
              <div style={{ display: 'flex', marginBottom: '4rem' }}>
                {/* Round 1 */}
                <div style={{ width: '33.333%' }}>
                  <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#60a5fa' }}>Babak 1</h3>
                    <div style={{ width: '4rem', height: '0.125rem', backgroundColor: '#3b82f6', margin: '0.5rem auto 0' }}></div>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem'
                  }}>
                    {matches.filter(match => (match.round || 1) === 1).map((match, index) => (
                      <div key={`round1-${match.id}-${index}`} style={{ marginBottom: '2rem' }}>
                        <div style={{
                          background: 'linear-gradient(135deg, #1f2937, #111827)',
                          borderRadius: '0.75rem',
                          overflow: 'hidden',
                          border: '1px solid rgba(30, 58, 138, 0.6)',
                          boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
                        }}>
                          {/* Match date */}
                          <div style={{
                            padding: '0.5rem 1rem',
                            borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
                            backgroundColor: 'rgba(30, 41, 59, 0.5)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.75rem',
                              color: '#9ca3af'
                            }}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width: '0.875rem', height: '0.875rem'}}>
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                              </svg>
                              <span>{match.date} - {match.time}</span>
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '9999px',
                              backgroundColor: match.status === 'completed' ? 'rgba(34, 197, 94, 0.2)' : 
                                             match.status === 'playing' ? 'rgba(234, 88, 12, 0.2)' :
                                             'rgba(59, 130, 246, 0.2)',
                              color: match.status === 'completed' ? '#4ade80' : 
                                     match.status === 'playing' ? '#fdba74' :
                                     '#93c5fd'
                            }}>
                              {match.status === 'completed' ? 'Selesai' : 
                               match.status === 'playing' ? 'Berlangsung' : 
                               'Terjadwal'}
                            </div>
                          </div>
                          
                          {/* Referee information */}
                          <div style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'rgba(17, 24, 39, 0.5)',
                            borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.875rem',
                              color: '#e5e7eb',
                              backgroundColor: 'rgba(79, 70, 229, 0.2)',
                              borderRadius: '0.5rem',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid rgba(79, 70, 229, 0.3)',
                              width: '100%',
                              justifyContent: 'space-between'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#93c5fd" style={{width: '1rem', height: '1rem'}}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                </svg>
                                <span>Wasit: {getRefereeForMatch(match.id).name}</span>
                              </div>
                              <a 
                                href={getWhatsAppLink(getRefereeForMatch(match.id).phone)}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  color: '#93c5fd',
                                  fontSize: '0.75rem',
                                  backgroundColor: 'rgba(30, 64, 175, 0.3)',
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '9999px',
                                  border: '1px solid rgba(59, 130, 246, 0.3)',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(30, 64, 175, 0.5)';
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(30, 64, 175, 0.3)';
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#93c5fd" viewBox="0 0 24 24" style={{width: '0.875rem', height: '0.875rem'}}>
                                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                <span>{getRefereeForMatch(match.id).phone}</span>
                              </a>
                            </div>
                          </div>
                          
                          {/* Team 1 */}
                          <div style={{
                            padding: '1rem',
                            borderBottom: '1px solid #374151',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            position: 'relative',
                            overflow: 'hidden',
                            backgroundColor: match.result === 'team1' ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                          }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #3b82f6, #93c5fd)' }}></div>
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '1rem', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {match.team1}
                              {match.result === 'team1' && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#4ade80" style={{ width: '1rem', height: '1rem' }}>
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                          </div>
                          {/* Team 2 */}
                          <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', overflow: 'hidden', backgroundColor: match.result === 'team2' ? 'rgba(34, 197, 94, 0.1)' : 'transparent' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #3b82f6, #93c5fd)' }}></div>
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '1rem', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {match.team2}
                              {match.result === 'team2' && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#4ade80" style={{ width: '1rem', height: '1rem' }}>
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {matches.filter(match => (match.round || 1) === 1).length === 0 && (
                      <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '1rem', borderRadius: '0.5rem', color: '#94a3b8', textAlign: 'center', border: '1px dashed rgba(100, 116, 139, 0.5)' }}>
                        Belum ada pertandingan yang dijadwalkan
                      </div>
                    )}
                  </div>
                </div>
                {/* Round 2 */}
                <div style={{ width: '33.333%', paddingTop: '60px' }}>
                  <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#60a5fa' }}>Babak 2</h3>
                    <div style={{ width: '4rem', height: '0.125rem', backgroundColor: '#3b82f6', margin: '0.5rem auto 0' }}></div>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8rem'
                  }}>
                    {matches.filter(match => (match.round || 0) === 2).map((match, index) => (
                      <div key={`round2-${match.id}-${index}`} style={{ marginBottom: '2rem' }}>
                        <div style={{
                          background: 'linear-gradient(135deg, #1f2937, #111827)',
                          borderRadius: '0.75rem',
                          overflow: 'hidden',
                          border: '1px solid rgba(30, 58, 138, 0.6)',
                          boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
                        }}>
                          {/* Match date */}
                          <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid rgba(75, 85, 99, 0.3)', backgroundColor: 'rgba(30, 41, 59, 0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '0.875rem', height: '0.875rem' }}>
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                              </svg>
                              <span>{match.date} - {match.time}</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', backgroundColor: getStatus(match.status).bg, color: getStatus(match.status).color }}>
                              {getStatus(match.status).label}
                            </div>
                          </div>
                          {/* Referee information */}
                          <div style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'rgba(17, 24, 39, 0.5)',
                            borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.875rem',
                              color: '#e5e7eb',
                              backgroundColor: 'rgba(79, 70, 229, 0.2)',
                              borderRadius: '0.5rem',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid rgba(79, 70, 229, 0.3)',
                              width: '100%',
                              justifyContent: 'space-between'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#93c5fd" style={{width: '1rem', height: '1rem'}}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                </svg>
                                <span>Wasit: {getRefereeForMatch(match.id).name}</span>
                              </div>
                              <a 
                                href={getWhatsAppLink(getRefereeForMatch(match.id).phone)}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  color: '#93c5fd',
                                  fontSize: '0.75rem',
                                  backgroundColor: 'rgba(30, 64, 175, 0.3)',
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '9999px',
                                  border: '1px solid rgba(59, 130, 246, 0.3)',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(30, 64, 175, 0.5)';
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(30, 64, 175, 0.3)';
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#93c5fd" viewBox="0 0 24 24" style={{width: '0.875rem', height: '0.875rem'}}>
                                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                <span>{getRefereeForMatch(match.id).phone}</span>
                              </a>
                            </div>
                          </div>
                          
                          {/* Team 1 */}
                          <div style={{ padding: '1rem', borderBottom: '1px solid #374151', display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', overflow: 'hidden', backgroundColor: match.result === 'team1' ? 'rgba(34, 197, 94, 0.1)' : 'transparent' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #3b82f6, #93c5fd)' }}></div>
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '1rem', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {match.team1}
                              {match.result === 'team1' && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#4ade80" style={{ width: '1rem', height: '1rem' }}>
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                          </div>
                          {/* Team 2 */}
                          <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', overflow: 'hidden', backgroundColor: match.result === 'team2' ? 'rgba(34, 197, 94, 0.1)' : 'transparent' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #3b82f6, #93c5fd)' }}></div>
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '1rem', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {match.team2}
                              {match.result === 'team2' && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#4ade80" style={{ width: '1rem', height: '1rem' }}>
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Special Slot for Round 2 - Tampilkan tim yang dapat bye di Round 2 */}
                    {specialSlotTeams && specialSlotTeams.length > 0 && (
                      <div style={{
                        textAlign: 'center',
                        marginTop: '2rem',
                        marginBottom: '2rem',
                        color: '#94a3b8',
                        fontSize: '0.875rem'
                      }}>
                        <span>Tim dengan slot langsung ke ronde berikutnya:</span>
                        <div style={{
                          marginTop: '0.5rem',
                          display: 'flex',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          gap: '0.5rem'
                        }}>
                          {specialSlotTeams.map((team, idx) => (
                            <div key={`round2-special-${idx}`} style={{
                              backgroundColor: 'rgba(59, 130, 246, 0.2)',
                              padding: '0.5rem',
                              borderRadius: '0.375rem',
                              color: '#60a5fa',
                              fontWeight: '500',
                              fontSize: '0.875rem',
                              border: '1px solid rgba(59, 130, 246, 0.3)'
                            }}>
                              {team}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {matches.filter(match => (match.round || 0) === 2).length === 0 && !specialSlotTeams.length && (
                      <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '1rem', borderRadius: '0.5rem', color: '#94a3b8', textAlign: 'center', border: '1px dashed rgba(100, 116, 139, 0.5)' }}>
                        Belum ada pertandingan yang dijadwalkan
                      </div>
                    )}
                  </div>
                </div>
                {/* Final */}
                <div style={{ width: '33.333%', paddingTop: '120px' }}>
                  <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fb923c' }}>Final</h3>
                    <div style={{ width: '4rem', height: '0.125rem', backgroundColor: '#ea580c', margin: '0.5rem auto 0' }}></div>
                  </div>
                  <div>
                    {/* Special Slot Teams Section */}
                    {specialSlotTeams && specialSlotTeams.length > 0 && (
                      <div style={{
                        textAlign: 'center',
                        marginBottom: '1rem',
                        color: '#94a3b8',
                        fontSize: '0.875rem'
                      }}>
                        <span>Tim dengan slot langsung ke final:</span>
                        <div style={{
                          marginTop: '0.5rem',
                          display: 'flex',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          gap: '0.5rem'
                        }}>
                          {specialSlotTeams.map((team, idx) => (
                            <div key={`special-final-${idx}`} style={{
                              backgroundColor: 'rgba(234, 88, 12, 0.2)',
                              padding: '0.5rem',
                              borderRadius: '0.375rem',
                              color: '#fdba74',
                              fontWeight: '500',
                              fontSize: '0.875rem',
                              border: '1px solid rgba(234, 88, 12, 0.3)'
                            }}>
                              {team}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Filter matches untuk menghindari tim yang sudah ada di specialSlotTeams */}
                    {matches.filter(match => {
                      // Filter hanya match di round 3
                      if ((match.round || 0) !== 3) return false;
                      
                      // Jangan tampilkan match yang timnya sudah ada di specialSlotTeams
                      const teamsInMatch = [match.team1, match.team2].filter(Boolean);
                      const hasSpecialTeam = teamsInMatch.some(team => 
                        specialSlotTeams.includes(team)
                      );
                      
                      // Kembalikan true jika tidak ada tim dari match ini di specialSlotTeams
                      return !hasSpecialTeam;
                    }).map((match, index) => (
                      <div key={`round3-${match.id}-${index}`} style={{ marginBottom: '2rem' }}>
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(146, 64, 14, 0.3), rgba(234, 88, 12, 0.1))',
                          borderRadius: '0.75rem',
                          overflow: 'hidden',
                          border: '1px solid rgba(234, 88, 12, 0.6)',
                          boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
                        }}>
                          {/* Match date */}
                          <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid rgba(75, 85, 99, 0.3)', backgroundColor: 'rgba(30, 41, 59, 0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ width: '0.875rem', height: '0.875rem' }}>
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                              </svg>
                              <span>{match.date} - {match.time}</span>
                            </div>
                            <div style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', backgroundColor: getStatus(match.status).bg, color: getStatus(match.status).color }}>
                              {getStatus(match.status).label}
                            </div>
                          </div>
                          {/* Referee information */}
                          <div style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'rgba(17, 24, 39, 0.5)',
                            borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.875rem',
                              color: '#e5e7eb',
                              backgroundColor: 'rgba(79, 70, 229, 0.2)',
                              borderRadius: '0.5rem',
                              padding: '0.375rem 0.75rem',
                              border: '1px solid rgba(79, 70, 229, 0.3)',
                              width: '100%',
                              justifyContent: 'space-between'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#93c5fd" style={{width: '1rem', height: '1rem'}}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                </svg>
                                <span>Wasit: {getRefereeForMatch(match.id).name}</span>
                              </div>
                              <a 
                                href={getWhatsAppLink(getRefereeForMatch(match.id).phone)}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  color: '#93c5fd',
                                  fontSize: '0.75rem',
                                  backgroundColor: 'rgba(30, 64, 175, 0.3)',
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '9999px',
                                  border: '1px solid rgba(59, 130, 246, 0.3)',
                                  transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(30, 64, 175, 0.5)';
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(30, 64, 175, 0.3)';
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#93c5fd" viewBox="0 0 24 24" style={{width: '0.875rem', height: '0.875rem'}}>
                                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                <span>{getRefereeForMatch(match.id).phone}</span>
                              </a>
                            </div>
                          </div>
                          
                          {/* Team 1 */}
                          <div style={{ padding: '1rem', borderBottom: '1px solid #374151', display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', overflow: 'hidden', backgroundColor: match.result === 'team1' ? 'rgba(34, 197, 94, 0.1)' : 'transparent' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #ea580c, #fdba74)' }}></div>
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '1rem', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {match.team1}
                              {match.result === 'team1' && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#4ade80" style={{ width: '1rem', height: '1rem' }}>
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                          </div>
                          {/* Team 2 */}
                          <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative', overflow: 'hidden', backgroundColor: match.result === 'team2' ? 'rgba(34, 197, 94, 0.1)' : 'transparent' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #ea580c, #fdba74)' }}></div>
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '1rem', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {match.team2}
                              {match.result === 'team2' && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#4ade80" style={{ width: '1rem', height: '1rem' }}>
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                                </svg>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {matches.filter(match => (match.round || 0) === 3).length === 0 && (
                      <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '1rem', borderRadius: '0.5rem', color: '#94a3b8', textAlign: 'center', border: '1px dashed rgba(100, 116, 139, 0.5)' }}>
                        Final belum dijadwalkan
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
                  Top 2 dari Bracket B akan maju ke Quarter Final
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Pertandingan dimulai tanggal 29 Mei 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer style={{
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderTop: '1px solid rgba(51, 65, 85, 0.6)',
        padding: '2rem 0',
        marginTop: 'auto',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Image src="/images/logo-mobile-legend-31251.png" alt="Mobile Legends Logo" width={40} height={40} style={{ objectFit: 'contain' }} />
            <Image src="/images/infoikamtif 11.png" alt="IKMATIF Logo" width={40} height={40} style={{ objectFit: 'contain' }} />
          </div>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            &copy; {new Date().getFullYear()} MLBB Tournament Bracket. Powered by IKMATIF.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BracketB; 