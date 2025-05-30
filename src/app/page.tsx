'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import { bracketA, bracketB } from '../data/teams';
import React from 'react';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

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

  // Reduce number of particles from 22 to 8 and make them static elements instead of randomized
  const particles = React.useMemo(() => {
    return [
      { width: 4, height: 4, opacity: 0.2, top: 15, left: 20 },
      { width: 5, height: 5, opacity: 0.3, top: 30, left: 60 },
      { width: 3, height: 3, opacity: 0.2, top: 50, left: 30 },
      { width: 6, height: 6, opacity: 0.2, top: 75, left: 70 },
      { width: 4, height: 4, opacity: 0.25, top: 20, left: 80 },
      { width: 5, height: 5, opacity: 0.15, top: 60, left: 15 },
      { width: 3, height: 3, opacity: 0.2, top: 80, left: 40 },
      { width: 4, height: 4, opacity: 0.3, top: 40, left: 90 }
    ];
  }, []);

  // Add animation keyframes with useEffect
  useEffect(() => {
    // Add keyframes animation style
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glowText {
        0% { text-shadow: 0 0 10px rgba(255, 184, 0, 0.3), 0 0 20px rgba(255, 184, 0, 0.2); }
        50% { text-shadow: 0 0 20px rgba(255, 184, 0, 0.7), 0 0 40px rgba(255, 184, 0, 0.5); }
        100% { text-shadow: 0 0 10px rgba(255, 184, 0, 0.3), 0 0 20px rgba(255, 184, 0, 0.2); }
      }
      
      @keyframes floatIn {
        0% { transform: translateY(30px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes slideIn {
        0% { transform: translateX(-50px); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes pulseScale {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes rotateGlow {
        0% { filter: drop-shadow(0 0 15px rgba(255, 184, 0, 0.5)); transform: rotate(0deg); }
        50% { filter: drop-shadow(0 0 25px rgba(255, 184, 0, 0.8)); transform: rotate(5deg); }
        100% { filter: drop-shadow(0 0 15px rgba(255, 184, 0, 0.5)); transform: rotate(0deg); }
      }
      
      @keyframes electricMove {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeInLeft {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes borderPulse {
        0% {
          border-color: rgba(255, 184, 0, 0.5);
        }
        50% {
          border-color: rgba(255, 184, 0, 0.8);
        }
        100% {
          border-color: rgba(255, 184, 0, 0.5);
        }
      }
      
      @keyframes subtleFloat {
        0% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
        100% { transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Layout>
      {/* Hero Section with Video Background */}
      <section style={{
        position: 'relative',
        minHeight: isMobile ? '90vh' : '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        padding: 0
      }}>
        {/* Video Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0
        }}>
          <iframe 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: isMobile ? '300%' : '150vw',
              height: isMobile ? '100%' : '150vh',
              transform: isMobile ? 'translate(-50%, -50%)' : 'translate(-50%, -50%) scale(1.1)',
              pointerEvents: 'none',
              border: 'none',
              objectFit: 'cover'
            }}
            src="https://www.youtube.com/embed/8vkKxOmCM-0?autoplay=1&mute=1&controls=0&showinfo=0&loop=1&playlist=8vkKxOmCM-0&modestbranding=1&iv_load_policy=3"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Mobile Legends Background"
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1
          }} />
        </div>

        <div style={{
          maxWidth: '1200px',
          width: '100%',
          zIndex: 2,
          textAlign: 'center',
          padding: isMobile ? '1rem' : '2rem',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: isMobile ? '75vh' : '85vh'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center', 
            gap: isMobile ? '0.5rem' : '3rem',
            marginBottom: isMobile ? '1.5rem' : '4rem',
            animation: 'floatIn 1.5s ease-out'
          }}>
            <Image 
              src="/images/logo-mobile-legend-31251.png" 
              alt="ML Logo"
              width={isMobile ? 80 : 300}
              height={isMobile ? 40 : 150}
              priority
              style={{
                maxWidth: '100%',
                height: 'auto',
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.7))',
                animation: 'pulseScale 4s infinite ease-in-out'
              }}
            />
            <div style={{
              fontSize: isMobile ? '1.5rem' : '5rem',
              fontWeight: 'bold',
              color: '#FFB800',
              textShadow: '0 0 25px rgba(255, 184, 0, 0.9)',
              animation: 'glowText 3s infinite ease-in-out',
              margin: '0 0.25rem'
            }}>X</div>
            <Image
              src="/images/infoikamtif 11.png"
              alt="IKMATIF Logo"
              width={isMobile ? 70 : 280}
              height={isMobile ? 70 : 280}
              priority
              style={{
                maxWidth: '100%',
                height: 'auto',
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.7))',
                animation: 'rotateGlow 5s infinite ease-in-out'
              }}
            />
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: isMobile ? '1rem' : '3rem',
            opacity: 1,
            position: 'relative',
            zIndex: 10,
            animation: 'none',
            width: isMobile ? '100%' : 'auto'
          }}>
            <Link href="/bracket-a" style={{
              padding: isMobile ? '0.75rem 1.5rem' : '1rem 3rem',
              background: 'linear-gradient(to right, #FFB800, #e69500)',
              color: 'black',
              fontWeight: 600,
              fontSize: isMobile ? '1rem' : '1.3rem',
              borderRadius: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: isMobile ? '1px' : '2px',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 10px rgba(255, 184, 0, 0.7), 0 0 20px rgba(255, 184, 0, 0.4)',
              textDecoration: 'none',
              transformStyle: 'preserve-3d',
              transform: 'perspective(500px) rotateX(0deg)',
              border: '2px solid rgba(255, 184, 0, 0.5)',
              position: 'relative',
              overflow: 'hidden',
              width: isMobile ? '90%' : 'auto',
              display: 'inline-block',
              textAlign: 'center'
            }} onMouseOver={(e) => {
              e.currentTarget.style.transform = 'perspective(500px) rotateX(10deg)';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 184, 0, 0.9), 0 0 30px rgba(255, 184, 0, 0.6)';
              const shineElement = e.currentTarget.querySelector('.electric-shine') as HTMLElement;
              if (shineElement) shineElement.style.left = '100%';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(500px) rotateX(0deg)';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 184, 0, 0.7), 0 0 20px rgba(255, 184, 0, 0.4)';
              const shineElement = e.currentTarget.querySelector('.electric-shine') as HTMLElement;
              if (shineElement) shineElement.style.left = '-100%';
            }}>
              <span className="text-content" style={{ 
                position: 'relative', 
                zIndex: 1,
              }}>Lihat Brackets</span>
              <div className="electric-shine" style={{
                position: 'absolute',
                top: '-50%',
                left: '-100%',
                width: '200%',
                height: '200%',
                background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent)',
                transform: 'rotate(30deg)',
                transition: 'left 0.5s ease',
                zIndex: 0
              }}></div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Teams Section - Optimized with static background */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        padding: isMobile ? '2rem 0' : '6rem 0',
        position: 'relative',
        overflow: 'hidden',
        marginTop: isMobile ? '-1rem' : '0'
      }}>
        {/* Static decorative elements instead of many animated particles */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
          {particles.map((particle, index) => (
            <div key={index} style={{
              position: 'absolute',
              width: `${particle.width}px`,
              height: `${particle.height}px`,
              borderRadius: '50%',
              backgroundColor: `rgba(255, 184, 0, ${particle.opacity})`,
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              zIndex: 1
            }} />
          ))}
        </div>
        
        {/* Single light beam instead of multiple animated ones */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '30%',
          width: '1px',
          height: '200%',
          background: 'linear-gradient(to bottom, transparent, rgba(255, 184, 0, 0.2), transparent)',
          transform: 'rotate(35deg)',
          zIndex: 1
        }}></div>

        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: isMobile ? '0 1rem' : '0 1.5rem',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: isMobile ? '2rem' : '5rem',
            position: 'relative'
          }}>
            <div style={{
              opacity: 1,
              animation: 'none'
            }}>
              <h2 style={{
                fontSize: isMobile ? '2rem' : '3rem',
                fontWeight: '800',
                color: 'white',
                marginBottom: '1.5rem',
                textShadow: '0 0 15px rgba(255, 184, 0, 0.3)',
                letterSpacing: '1px',
                position: 'relative',
                display: 'inline-block'
              }}>
                Tim Peserta
                <div style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  width: isMobile ? '60px' : '80px',
                  height: '4px',
                  background: 'linear-gradient(90deg, transparent, #FFB800, transparent)',
                  transform: 'translateX(-50%)',
                  borderRadius: '2px'
                }}></div>
              </h2>
            </div>
            
            <div style={{
              opacity: 1,
              animation: 'none'
            }}>
              <p style={{
                fontSize: isMobile ? '1.2rem' : '1.5rem',
                color: '#93c5fd',
                fontWeight: '500',
                maxWidth: '700px',
                margin: '0 auto',
                lineHeight: '1.6',
                textShadow: '0 0 5px rgba(147, 197, 253, 0.3)'
              }}>
                22 Tim bersaing untuk gelar juara
              </p>
            </div>
          </div>
        
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: isMobile ? '1.5rem' : '2.5rem',
            position: 'relative'
          }}>
            <div style={{
              opacity: 1,
              animation: 'none'
            }}>
              <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(8px)',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                position: 'relative'
              }}>
                <div style={{
                  padding: isMobile ? '1.5rem' : '2rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      width: isMobile ? '30px' : '36px',
                      height: isMobile ? '30px' : '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FFB800, #e69500)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem',
                      boxShadow: '0 0 15px rgba(255, 184, 0, 0.5)'
                    }}>
                      <span style={{
                        color: '#000',
                        fontWeight: '700',
                        fontSize: isMobile ? '1rem' : '1.2rem'
                      }}>A</span>
                    </div>
                    <h3 style={{
                      fontSize: isMobile ? '1.25rem' : '1.5rem',
                      fontWeight: '700',
                      color: '#FFB800',
                      margin: 0,
                      textShadow: '0 0 10px rgba(255, 184, 0, 0.3)'
                    }}>Grup A</h3>
                  </div>
                  
                  <div style={{
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    {bracketA.map((team, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        background: 'rgba(15, 23, 42, 0.7)',
                        borderRadius: '0.5rem',
                        transition: 'all 0.2s ease',
                      }} onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateX(5px)';
                        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.7)';
                      }} onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.background = 'rgba(15, 23, 42, 0.7)';
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: isMobile ? '1.75rem' : '2rem',
                          height: isMobile ? '1.75rem' : '2rem',
                          background: '#FFB800',
                          color: '#000',
                          borderRadius: '50%',
                          fontWeight: '700',
                          marginRight: '1rem',
                          flexShrink: 0
                        }}>
                          {index + 1}
                        </div>
                        <span style={{
                          color: 'white',
                          fontWeight: '500',
                          fontSize: isMobile ? '0.9rem' : '1rem'
                        }}>
                          {team}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{
              opacity: 1,
              animation: 'none'
            }}>
              <div style={{
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(8px)',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                position: 'relative'
              }}>
                <div style={{
                  padding: isMobile ? '1.5rem' : '2rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      width: isMobile ? '30px' : '36px',
                      height: isMobile ? '30px' : '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7e22ce, #4c1d95)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem',
                      boxShadow: '0 0 15px rgba(126, 34, 206, 0.5)'
                    }}>
                      <span style={{
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: isMobile ? '1rem' : '1.2rem'
                      }}>B</span>
                    </div>
                    <h3 style={{
                      fontSize: isMobile ? '1.25rem' : '1.5rem',
                      fontWeight: '700',
                      color: '#a78bfa',
                      margin: 0,
                      textShadow: '0 0 10px rgba(167, 139, 250, 0.3)'
                    }}>Grup B</h3>
                  </div>
                  
                  <div style={{
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    {bracketB.map((team, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        background: 'rgba(15, 23, 42, 0.7)',
                        borderRadius: '0.5rem',
                        transition: 'all 0.2s ease',
                      }} onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateX(5px)';
                        e.currentTarget.style.background = 'rgba(30, 41, 59, 0.7)';
                      }} onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.background = 'rgba(15, 23, 42, 0.7)';
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: isMobile ? '1.75rem' : '2rem',
                          height: isMobile ? '1.75rem' : '2rem',
                          background: '#a78bfa',
                          color: '#000',
                          borderRadius: '50%',
                          fontWeight: '700',
                          marginRight: '1rem',
                          flexShrink: 0
                        }}>
                          {index + 1}
                        </div>
                        <span style={{
                          color: 'white',
                          fontWeight: '500',
                          fontSize: isMobile ? '0.9rem' : '1rem'
                        }}>
                          {team}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tournament Structure Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: isMobile ? '3rem 0' : '6rem 0',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1.5rem',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: isMobile ? '2rem' : '4rem' 
          }}>
            <h2 style={{
              fontSize: isMobile ? '2rem' : '2.5rem',
              fontWeight: '800',
              color: '#f59e0b',
              marginBottom: '1.25rem',
              textShadow: '0 0 15px rgba(245, 158, 11, 0.3)',
              position: 'relative',
              display: 'inline-block'
            }}>
              Struktur Turnamen
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                width: isMobile ? '60px' : '80px',
                height: '4px',
                background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)',
                transform: 'translateX(-50%)',
                borderRadius: '2px'
              }}></div>
            </h2>
            
            <p style={{
              fontSize: isMobile ? '1.1rem' : '1.25rem',
              color: '#d1d5db',
              maxWidth: '800px',
              margin: '0 auto 2rem',
              lineHeight: '1.7'
            }}>
              Dari grup hingga final kejuaraan - perjalanan turnamen
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {/* Bracket A */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(5px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem'
                }}>
                  <span style={{color: 'white', fontWeight: '700'}}>A</span>
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#60a5fa',
                  margin: 0
                }}>Grup A</h3>
              </div>
              
              <ul style={{
                listStyle: 'none',
                padding: '0',
                margin: '0',
                flexGrow: 1
              }}>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  color: '#d1d5db'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#60a5fa" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  11 tim bersaing (1 tim mendapat bye ke Babak 2)
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  color: '#d1d5db'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#60a5fa" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  2 pemenang acak mendapat slot langsung ke final
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#d1d5db'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#60a5fa" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span style={{fontWeight: '600', color: 'white'}}>2 slot lainnya ditentukan lewat pertandingan</span>
                </li>
              </ul>
              
              <div style={{marginTop: '1.5rem'}}>
                <Link href="/bracket-a" style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  color: '#60a5fa',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: '600',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.2s ease'
                }}>
                  Lihat Grup A
                </Link>
              </div>
            </div>
            
            {/* Bracket B */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(5px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem'
                }}>
                  <span style={{color: 'white', fontWeight: '700'}}>B</span>
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#a78bfa',
                  margin: 0
                }}>Grup B</h3>
              </div>
              
              <ul style={{
                listStyle: 'none',
                padding: '0',
                margin: '0',
                flexGrow: 1
              }}>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  color: '#d1d5db'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#a78bfa" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  11 tim bersaing (1 tim mendapat bye ke Babak 2)
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  color: '#d1d5db'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#a78bfa" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  2 pemenang acak mendapat slot langsung ke final
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#d1d5db'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#a78bfa" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span style={{fontWeight: '600', color: 'white'}}>2 slot lainnya ditentukan lewat pertandingan</span>
                </li>
              </ul>
              
              <div style={{marginTop: '1.5rem'}}>
                <Link href="/bracket-b" style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: 'rgba(124, 58, 237, 0.2)',
                  color: '#a78bfa',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: '600',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  transition: 'all 0.2s ease'
                }}>
                  Lihat Grup B
                </Link>
              </div>
            </div>
            
            {/* Finals */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(5px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(234, 88, 12, 0.3)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ea580c, #c2410c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
                    <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5z"/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#fb923c',
                  margin: 0
                }}>Final Besar</h3>
              </div>
              
              <ul style={{
                listStyle: 'none',
                padding: '0',
                margin: '0',
                flexGrow: 1
              }}>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  color: '#d1d5db'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#fb923c" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span style={{fontWeight: '600', color: 'white'}}>4 tim dari Grup A</span>
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  color: '#d1d5db'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#fb923c" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span style={{fontWeight: '600', color: 'white'}}>4 tim dari Grup B</span>
                </li>
                <li style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#d1d5db'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#fb923c" style={{width: '1rem', height: '1rem', marginRight: '0.5rem'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Gelar juara tournament
                </li>
              </ul>
              
              <div style={{marginTop: '1.5rem'}}>
                <Link href="/finals" style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.25rem',
                  backgroundColor: 'rgba(234, 88, 12, 0.2)',
                  color: '#fb923c',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: '600',
                  border: '1px solid rgba(234, 88, 12, 0.3)',
                  transition: 'all 0.2s ease'
                }}>
                  Lihat Final
                </Link>
              </div>
            </div>
          </div>
          
          {/* Tournament Flow - Added explanation */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(5px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(255, 184, 0, 0.2)',
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#f59e0b',
              marginBottom: '1rem'
            }}>🔄 Alur Turnamen</h3>
            
            <ol style={{
              color: '#d1d5db',
              paddingLeft: '1.5rem',
              marginBottom: '0',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '1rem'
            }}>
              <li>Setiap grup memiliki 11 tim, dengan 1 tim mendapatkan bye ke Babak 2</li>
              <li>Setelah Babak 1, pemenang melaju ke Babak 2</li>
              <li>Dari Babak 2, 2 tim dipilih secara acak untuk langsung ke Final</li>
              <li>Tim dengan bye di Babak 1 harus bermain di Babak 2</li>
              <li>Tim lainnya bertanding untuk 2 slot terakhir</li>
              <li>Final menampilkan 4 tim dari setiap grup (total 8 tim)</li>
              <li>Tim bermain dalam format gugur hingga juara ditentukan</li>
            </ol>
          </div>
        </div>
      </section>
    </Layout>
  );
} 