'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial checks
    handleScroll();
    checkIfMobile();
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Create the electricity animation effect with useEffect
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes neonGlow {
        0% {
          text-shadow: 0 0 10px rgba(255, 184, 0, 0.7),
                      0 0 20px rgba(255, 184, 0, 0.5),
                      0 0 30px rgba(255, 184, 0, 0.3);
          box-shadow: 0 0 10px rgba(255, 184, 0, 0.5),
                    0 0 20px rgba(255, 184, 0, 0.3);
        }
        50% {
          text-shadow: 0 0 15px rgba(255, 184, 0, 0.9),
                      0 0 30px rgba(255, 184, 0, 0.7),
                      0 0 40px rgba(255, 184, 0, 0.5);
          box-shadow: 0 0 15px rgba(255, 184, 0, 0.7),
                    0 0 30px rgba(255, 184, 0, 0.5);
        }
        100% {
          text-shadow: 0 0 10px rgba(255, 184, 0, 0.7),
                      0 0 20px rgba(255, 184, 0, 0.5),
                      0 0 30px rgba(255, 184, 0, 0.3);
          box-shadow: 0 0 10px rgba(255, 184, 0, 0.5),
                    0 0 20px rgba(255, 184, 0, 0.3);
        }
      }

      @keyframes electricBorder {
        0% {
          border-image: linear-gradient(90deg, transparent, #FFB800, transparent) 1;
          opacity: 0.5;
        }
        25% {
          border-image: linear-gradient(180deg, transparent, #FFB800, transparent) 1;
          opacity: 0.8;
        }
        50% {
          border-image: linear-gradient(270deg, transparent, #FFB800, transparent) 1;
          opacity: 1;
        }
        75% {
          border-image: linear-gradient(0deg, transparent, #FFB800, transparent) 1;
          opacity: 0.8;
        }
        100% {
          border-image: linear-gradient(90deg, transparent, #FFB800, transparent) 1;
          opacity: 0.5;
        }
      }

      @keyframes electricFlash {
        0%, 100% {
          opacity: 0.3;
        }
        5%, 9%, 15%, 20% {
          opacity: 1;
        }
        7%, 12%, 17% {
          opacity: 0.5;
        }
        25%, 90% {
          opacity: 0.3;
        }
      }

      @keyframes electricMove {
        0% {
          background-position: -300px 0;
        }
        100% {
          background-position: 300px 0;
        }
      }

      @keyframes fadeIn {
        0% { 
          opacity: 0;
          transform: translateY(-10px);
        }
        100% { 
          opacity: 1; 
          transform: translateY(0);
        }
      }

      @keyframes slideIn {
        0% { 
          transform: translateY(20px);
          opacity: 0;
        }
        100% { 
          transform: translateY(0);
          opacity: 1; 
        }
      }

      .mobile-menu-item {
        animation: slideIn 0.4s ease forwards;
        opacity: 0;
      }

      .mobile-menu-item:nth-child(1) {
        animation-delay: 0.1s;
      }
      .mobile-menu-item:nth-child(2) {
        animation-delay: 0.2s;
      }
      .mobile-menu-item:nth-child(3) {
        animation-delay: 0.3s;
      }
      .mobile-menu-item:nth-child(4) {
        animation-delay: 0.4s;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #111827, #0f1729, #030712)',
      color: 'white',
      position: 'relative'
    }}>
      {/* Navigation Bar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        padding: scrolled ? (isMobile ? '0.4rem 0' : '0.5rem 0') : (isMobile ? '0.75rem 0' : '1rem 0'),
        backgroundColor: scrolled 
          ? 'rgba(0, 0, 0, 0.9)' 
          : 'rgba(0, 0, 0, 0.6)',
        boxShadow: scrolled 
          ? '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(255, 184, 0, 0.5)' 
          : '0 0 10px rgba(255, 184, 0, 0.3)',
        borderBottom: '1px solid rgba(255, 184, 0, 0.3)',
        backdropFilter: 'blur(8px)'
      }}>
        {/* Lightning effect container */}
        <div className="lightning-container" style={{ display: 'none' }}>
          <div className="lightning"></div>
        </div>
        
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isMobile ? '0 0.75rem' : '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Electric animation overlay - hidden */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 184, 0, 0.8), transparent)',
            backgroundSize: '600px 1px',
            display: 'none'
          }} className="electric-flow"></div>
          
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '0.4rem' : '0.75rem',
            textDecoration: 'none',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: isMobile ? 'linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0))' : 'none',
              padding: isMobile ? '0.4rem 0.6rem 0.4rem 0.5rem' : '0',
              borderRadius: isMobile ? '0.6rem' : '0',
              border: isMobile ? '1px solid rgba(255, 184, 0, 0.3)' : 'none',
              boxShadow: isMobile ? '0 0 8px rgba(255, 184, 0, 0.3)' : 'none'
            }}>
              <Image 
                src="/images/logo-mobile-legend-31251.png" 
                alt="Mobile Legends Logo" 
                width={isMobile ? 24 : 28} 
                height={isMobile ? 24 : 28}
                style={{ 
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))'
                }}
              />
              
              <Image 
                src="/images/infoikamtif 11.png" 
                alt="IKMATIF Logo" 
                width={isMobile ? 24 : 28} 
                height={isMobile ? 24 : 28}
                style={{ 
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))'
                }}
              />
            </div>
            
            {!isMobile && (
              <span style={{
                fontWeight: 'bold',
                fontSize: '1.25rem',
                color: '#FFB800',
                textShadow: '0 0 10px rgba(255, 184, 0, 0.7), 0 0 20px rgba(255, 184, 0, 0.5)'
              }}>ML Tournament</span>
            )}
          </Link>

          {/* Mobile menu button */}
          {isMobile && (
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'linear-gradient(to right, rgba(255, 184, 0, 0.3), rgba(255, 184, 0, 0.2))',
                border: '1px solid rgba(255, 184, 0, 0.5)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '28px',
                width: '34px',
                padding: '6px',
                zIndex: 60,
                boxShadow: '0 0 10px rgba(255, 184, 0, 0.5)'
              }}
              aria-label="Toggle menu"
            >
              <span style={{
                display: 'block',
                height: '2px',
                width: '100%',
                backgroundColor: '#FFB800',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 5px rgba(255, 184, 0, 0.7), 0 0 10px rgba(255, 184, 0, 0.5)',
                transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }}></span>
              <span style={{
                display: 'block',
                height: '2px',
                width: '100%',
                backgroundColor: '#FFB800',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 5px rgba(255, 184, 0, 0.7), 0 0 10px rgba(255, 184, 0, 0.5)',
                opacity: menuOpen ? 0 : 1
              }}></span>
              <span style={{
                display: 'block',
                height: '2px',
                width: '100%',
                backgroundColor: '#FFB800',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 5px rgba(255, 184, 0, 0.7), 0 0 10px rgba(255, 184, 0, 0.5)',
                transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
              }}></span>
            </button>
          )}

          {/* Desktop navigation links */}
          {!isMobile && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              position: 'relative'
            }}>
              <Link href="/" style={{
                color: 'rgb(229, 231, 235)',
                textDecoration: 'none',
                transition: 'color 0.2s ease, text-shadow 0.2s ease',
                fontWeight: '500',
                padding: '0.5rem 0.75rem',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1
              }} className="nav-item-hover" onMouseOver={(e) => {
                e.currentTarget.style.color = '#FFB800';
                e.currentTarget.style.textShadow = '0 0 10px rgba(255, 184, 0, 0.7), 0 0 20px rgba(255, 184, 0, 0.5)';
              }} 
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'rgb(229, 231, 235)';
                e.currentTarget.style.textShadow = 'none';
              }}>
                Home
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  height: '2px',
                  width: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 184, 0, 0.8), transparent)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }} className="nav-border"></div>
              </Link>
              
              <Link href="/bracket-a" style={{
                color: 'rgb(229, 231, 235)',
                textDecoration: 'none',
                transition: 'color 0.2s ease, text-shadow 0.2s ease',
                fontWeight: '500',
                padding: '0.5rem 0.75rem',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1
              }} className="nav-item-hover" onMouseOver={(e) => {
                e.currentTarget.style.color = '#FFB800';
                e.currentTarget.style.textShadow = '0 0 10px rgba(255, 184, 0, 0.7), 0 0 20px rgba(255, 184, 0, 0.5)';
                const navBorder = e.currentTarget.querySelector('.nav-border') as HTMLElement;
                if (navBorder) navBorder.style.opacity = '1';
              }} 
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'rgb(229, 231, 235)';
                e.currentTarget.style.textShadow = 'none';
                const navBorder = e.currentTarget.querySelector('.nav-border') as HTMLElement;
                if (navBorder) navBorder.style.opacity = '0';
              }}>
                Bracket A
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  height: '2px',
                  width: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 184, 0, 0.8), transparent)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }} className="nav-border"></div>
              </Link>
              
              <Link href="/bracket-b" style={{
                color: 'rgb(229, 231, 235)',
                textDecoration: 'none',
                transition: 'color 0.2s ease, text-shadow 0.2s ease',
                fontWeight: '500',
                padding: '0.5rem 0.75rem',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1
              }} className="nav-item-hover" onMouseOver={(e) => {
                e.currentTarget.style.color = '#FFB800';
                e.currentTarget.style.textShadow = '0 0 10px rgba(255, 184, 0, 0.7), 0 0 20px rgba(255, 184, 0, 0.5)';
                const navBorder = e.currentTarget.querySelector('.nav-border') as HTMLElement;
                if (navBorder) navBorder.style.opacity = '1';
              }} 
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'rgb(229, 231, 235)';
                e.currentTarget.style.textShadow = 'none';
                const navBorder = e.currentTarget.querySelector('.nav-border') as HTMLElement;
                if (navBorder) navBorder.style.opacity = '0';
              }}>
                Bracket B
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  height: '2px',
                  width: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 184, 0, 0.8), transparent)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }} className="nav-border"></div>
              </Link>
              
              <Link href="/finals" style={{
                color: 'rgb(229, 231, 235)',
                textDecoration: 'none',
                transition: 'color 0.2s ease, text-shadow 0.2s ease',
                fontWeight: '500',
                padding: '0.5rem 0.75rem',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1
              }} className="nav-item-hover" onMouseOver={(e) => {
                e.currentTarget.style.color = '#FFB800';
                e.currentTarget.style.textShadow = '0 0 10px rgba(255, 184, 0, 0.7), 0 0 20px rgba(255, 184, 0, 0.5)';
                const navBorder = e.currentTarget.querySelector('.nav-border') as HTMLElement;
                if (navBorder) navBorder.style.opacity = '1';
              }} 
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'rgb(229, 231, 235)';
                e.currentTarget.style.textShadow = 'none';
                const navBorder = e.currentTarget.querySelector('.nav-border') as HTMLElement;
                if (navBorder) navBorder.style.opacity = '0';
              }}>
                Finals
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  height: '2px',
                  width: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 184, 0, 0.8), transparent)',
                  backgroundSize: '200% 100%',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }} className="nav-border"></div>
              </Link>
            </div>
          )}

          {/* Mobile menu overlay */}
          {isMobile && menuOpen && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              zIndex: 50,
              transition: 'all 0.3s ease',
              animation: 'fadeIn 0.3s ease forwards',
              paddingTop: '80px'
            }}>
              <div style={{
                marginBottom: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <Image 
                    src="/images/logo-mobile-legend-31251.png" 
                    alt="Mobile Legends Logo" 
                    width={64} 
                    height={64}
                    style={{ 
                      width: 'auto', 
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))'
                    }}
                  />
                  <Image 
                    src="/images/infoikamtif 11.png" 
                    alt="IKMATIF Logo" 
                    width={64} 
                    height={64}
                    style={{ 
                      width: 'auto', 
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))'
                    }}
                  />
                </div>
                <span style={{
                  fontWeight: 'bold',
                  fontSize: '1.75rem',
                  color: '#FFB800',
                  textShadow: '0 0 10px rgba(255, 184, 0, 0.7), 0 0 20px rgba(255, 184, 0, 0.5)'
                }}>ML Tournament</span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                width: '85%',
                maxWidth: '320px'
              }}>
                <Link href="/" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '1.375rem',
                  padding: '1rem 0',
                  textAlign: 'center',
                  background: 'linear-gradient(to right, rgba(255, 184, 0, 0.2), rgba(255, 184, 0, 0.1), rgba(255, 184, 0, 0.2))',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 184, 0, 0.3)',
                  boxShadow: '0 0 10px rgba(255, 184, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }} onClick={() => setMenuOpen(false)}
                className="mobile-menu-item"
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 184, 0, 0.5)';
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 184, 0, 0.3)';
                }}>
                  Home
                </Link>
                <Link href="/bracket-a" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '1.375rem',
                  padding: '1rem 0',
                  textAlign: 'center',
                  background: 'linear-gradient(to right, rgba(255, 184, 0, 0.2), rgba(255, 184, 0, 0.1), rgba(255, 184, 0, 0.2))',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 184, 0, 0.3)',
                  boxShadow: '0 0 10px rgba(255, 184, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }} onClick={() => setMenuOpen(false)}
                className="mobile-menu-item"
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 184, 0, 0.5)';
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 184, 0, 0.3)';
                }}>
                  Bracket A
                </Link>
                <Link href="/bracket-b" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '1.375rem',
                  padding: '1rem 0',
                  textAlign: 'center',
                  background: 'linear-gradient(to right, rgba(255, 184, 0, 0.2), rgba(255, 184, 0, 0.1), rgba(255, 184, 0, 0.2))',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 184, 0, 0.3)',
                  boxShadow: '0 0 10px rgba(255, 184, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }} onClick={() => setMenuOpen(false)}
                className="mobile-menu-item"
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 184, 0, 0.5)';
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 184, 0, 0.3)';
                }}>
                  Bracket B
                </Link>
                <Link href="/finals" style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '1.375rem',
                  padding: '1rem 0',
                  textAlign: 'center',
                  background: 'linear-gradient(to right, rgba(255, 184, 0, 0.2), rgba(255, 184, 0, 0.1), rgba(255, 184, 0, 0.2))',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255, 184, 0, 0.3)',
                  boxShadow: '0 0 10px rgba(255, 184, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }} onClick={() => setMenuOpen(false)}
                className="mobile-menu-item"
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 184, 0, 0.5)';
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 184, 0, 0.3)';
                }}>
                  Finals
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content with padding for the navbar */}
      <main style={{ paddingTop: '5rem' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderTop: '1px solid rgb(31, 41, 55)',
        paddingBottom: isMobile ? '1rem' : 0
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isMobile ? '1.5rem 1rem 0.5rem' : '2.5rem 1rem'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '2rem' : '2rem',
            justifyContent: 'space-between'
          }}>
            <div style={{
              textAlign: isMobile ? 'center' : 'left',
              width: isMobile ? '100%' : '33%'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
                justifyContent: isMobile ? 'center' : 'flex-start'
              }}>
                <Image 
                  src="/images/logo-mobile-legend-31251.png" 
                  alt="Mobile Legends Logo" 
                  width={40} 
                  height={40}
                  style={{ 
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
                <Image 
                  src="/images/infoikamtif 11.png" 
                  alt="IKMATIF Logo" 
                  width={40} 
                  height={40}
                  style={{ 
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                />
                <h3 style={{
                  fontWeight: 'bold',
                  fontSize: isMobile ? '1.1rem' : '1.25rem',
                  color: 'white',
                  margin: 0
                }}>ML x IKMATIF 11</h3>
              </div>
              <p style={{
                color: 'rgb(156, 163, 175)',
                lineHeight: 1.6,
                textAlign: isMobile ? 'center' : 'left',
                fontSize: isMobile ? '0.9rem' : '1rem',
                maxWidth: isMobile ? '100%' : '90%'
              }}>
                Professional Mobile Legends tournament platform for IKMATIF 11 event.
              </p>
            </div>
            
            {isMobile && <div style={{ height: '1px', width: '80%', background: 'rgba(255, 255, 255, 0.1)', margin: '0 auto' }}></div>}
            
            <div style={{ 
              textAlign: isMobile ? 'center' : 'left',
              width: isMobile ? '100%' : '33%'
            }}>
              <h3 style={{
                fontWeight: 'bold',
                fontSize: '1.125rem',
                marginBottom: '1rem',
                color: 'white'
              }}>Quick Links</h3>
              
              {isMobile ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem',
                  justifyContent: 'center'
                }}>
                  <Link href="/" style={{
                    color: 'rgb(156, 163, 175)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    padding: '0.4rem 0',
                    display: 'block'
                  }}>
                    Home
                  </Link>
                  <Link href="/bracket-a" style={{
                    color: 'rgb(156, 163, 175)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    padding: '0.4rem 0',
                    display: 'block'
                  }}>
                    Bracket A
                  </Link>
                  <Link href="/bracket-b" style={{
                    color: 'rgb(156, 163, 175)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    padding: '0.4rem 0',
                    display: 'block'
                  }}>
                    Bracket B
                  </Link>
                  <Link href="/finals" style={{
                    color: 'rgb(156, 163, 175)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    padding: '0.4rem 0',
                    display: 'block'
                  }}>
                    Finals
                  </Link>
                </div>
              ) : (
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}>
                  <li>
                    <Link href="/" style={{
                      color: 'rgb(156, 163, 175)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }} onMouseOver={(e) => e.currentTarget.style.color = '#FFB800'} 
                       onMouseOut={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/bracket-a" style={{
                      color: 'rgb(156, 163, 175)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }} onMouseOver={(e) => e.currentTarget.style.color = '#FFB800'} 
                       onMouseOut={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>
                      Bracket A
                    </Link>
                  </li>
                  <li>
                    <Link href="/bracket-b" style={{
                      color: 'rgb(156, 163, 175)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }} onMouseOver={(e) => e.currentTarget.style.color = '#FFB800'} 
                       onMouseOut={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>
                      Bracket B
                    </Link>
                  </li>
                  <li>
                    <Link href="/finals" style={{
                      color: 'rgb(156, 163, 175)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease'
                    }} onMouseOver={(e) => e.currentTarget.style.color = '#FFB800'} 
                       onMouseOut={(e) => e.currentTarget.style.color = 'rgb(156, 163, 175)'}>
                      Finals
                    </Link>
                  </li>
                </ul>
              )}
            </div>
            
            {isMobile && <div style={{ height: '1px', width: '80%', background: 'rgba(255, 255, 255, 0.1)', margin: '0 auto' }}></div>}
            
            <div style={{ 
              textAlign: isMobile ? 'center' : 'left',
              width: isMobile ? '100%' : '33%'
            }}>
              <h3 style={{
                fontWeight: 'bold',
                fontSize: '1.125rem',
                marginBottom: '1rem',
                color: 'white'
              }}>Tournament Info</h3>
              
              {isMobile ? (
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.75rem 1rem',
                  color: 'rgb(156, 163, 175)',
                  fontSize: '0.9rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <span style={{ color: '#FFB800', marginRight: '0.25rem' }}>•</span> 
                    <span>29 May 2025</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <span style={{ color: '#FFB800', marginRight: '0.25rem' }}>•</span> 
                    <span>Semi-Finals: TBA</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <span style={{ color: '#FFB800', marginRight: '0.25rem' }}>•</span> 
                    <span>Finals: TBA</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <span style={{ color: '#FFB800', marginRight: '0.25rem' }}>•</span> 
                    <span>22 Teams Total</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gridColumn: '1 / -1' }}>
                    <span style={{ color: '#FFB800', marginRight: '0.25rem' }}>•</span> 
                    <span>5 Wasit di Bracket A</span>
                  </div>
                </div>
              ) : (
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  color: 'rgb(156, 163, 175)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <span style={{ color: '#FFB800', marginRight: '0.5rem' }}>•</span> 
                    <span>Bracket Matches: 29 May 2025</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <span style={{ color: '#FFB800', marginRight: '0.5rem' }}>•</span> 
                    <span>Semi-Finals: TBA</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <span style={{ color: '#FFB800', marginRight: '0.5rem' }}>•</span> 
                    <span>Grand Finals: TBA</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <span style={{ color: '#FFB800', marginRight: '0.5rem' }}>•</span> 
                    <span>22 Teams Total</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <span style={{ color: '#FFB800', marginRight: '0.5rem' }}>•</span> 
                    <span>5 Wasit di Bracket A (5 pertandingan bersamaan)</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
          
          <div style={{
            borderTop: '1px solid rgb(31, 41, 55)',
            marginTop: isMobile ? '1.5rem' : '2rem',
            paddingTop: isMobile ? '1rem' : '1.5rem',
            textAlign: 'center',
            color: 'rgb(107, 114, 128)',
            fontSize: isMobile ? '0.8rem' : '0.9rem'
          }}>
            <div style={{
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Link href="/admin" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                background: 'linear-gradient(to right, rgba(255, 184, 0, 0.1), rgba(255, 184, 0, 0.2))',
                border: '1px solid rgba(255, 184, 0, 0.3)',
                color: 'rgb(156, 163, 175)',
                fontSize: '0.85rem',
                fontWeight: '500',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                boxShadow: '0 0 5px rgba(255, 184, 0, 0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, rgba(255, 184, 0, 0.2), rgba(255, 184, 0, 0.3))';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.boxShadow = '0 0 8px rgba(255, 184, 0, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, rgba(255, 184, 0, 0.1), rgba(255, 184, 0, 0.2))';
                e.currentTarget.style.color = 'rgb(156, 163, 175)';
                e.currentTarget.style.boxShadow = '0 0 5px rgba(255, 184, 0, 0.2)';
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                </svg>
                Admin Login
              </Link>
            </div>
            <p style={{ margin: 0 }}>© 2025 MOBILE LEGENDS X IKMATIF 11 - All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 