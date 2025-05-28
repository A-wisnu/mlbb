'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  
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

  // Add animation keyframes with useEffect
  useEffect(() => {
    // Add keyframes animation style
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulseGlow {
        0% { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        50% { box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4), 0 8px 10px -6px rgba(79, 70, 229, 0.2); }
        100% { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleLogout = () => {
    // In a real application, this would handle proper logout
    router.push('/admin');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0f172a',
      backgroundImage: 'radial-gradient(circle at 25% 10%, rgba(79, 70, 229, 0.15) 0%, transparent 40%), radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.1) 0%, transparent 40%)'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderBottom: '1px solid rgba(79, 70, 229, 0.3)',
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.8), rgba(67, 56, 202, 0.6))',
              padding: '0.3rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(79, 70, 229, 0.4)'
            }}>
              <Image 
                src="/images/logo-mobile-legend-31251.png" 
                alt="Mobile Legends Logo" 
                width={20}
                height={20}
                style={{
                  height: 'auto',
                  width: 'auto',
                  filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))'
                }}
              />
            </div>
            <div>
              <h1 style={{
                fontSize: isMobile ? '1.1rem' : '1.25rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '0.125rem',
                background: 'linear-gradient(to right, #fff, #a5b4fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Admin Dashboard</h1>
              <p style={{
                fontSize: '0.75rem',
                color: '#a5b4fc',
                letterSpacing: '0.025em'
              }}>Panel Pengelolaan Tournament</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.2rem',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              color: '#f87171',
              borderRadius: '0.5rem',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
              <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>
            Keluar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flex: '1',
        padding: isMobile ? '1.5rem 1rem' : '3rem 1.5rem',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        position: 'relative'
      }}>
        <h2 style={{
          fontSize: isMobile ? '1.5rem' : '2rem',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: isMobile ? '1.5rem' : '2.5rem',
          textAlign: 'center',
          position: 'relative',
          display: 'inline-block',
          animation: 'fadeIn 0.6s ease'
        }}>
          Selamat Datang di Panel Admin
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            width: '60%',
            height: '3px',
            background: 'linear-gradient(to right, transparent, #8b5cf6, transparent)',
            transform: 'translateX(-50%)',
            borderRadius: '2px'
          }}></div>
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: isMobile ? '1.5rem' : '2rem',
          marginBottom: '2.5rem'
        }}>
          {/* Bracket A Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(67, 56, 202, 0.05))',
            borderRadius: '1rem',
            overflow: 'hidden',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            animation: 'fadeIn 0.6s ease'
          }} 
          onClick={() => router.push('/admin/bracket-a')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(79, 70, 229, 0.4), 0 10px 10px -5px rgba(79, 70, 229, 0.2)';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(79, 70, 229, 0.3), rgba(67, 56, 202, 0.1))';
            e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(67, 56, 202, 0.05))';
            e.currentTarget.style.borderColor = 'rgba(79, 70, 229, 0.3)';
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #4f46e5, #8b5cf6)',
              zIndex: 1
            }}></div>
            <div style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              height: '100%'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(79, 70, 229, 0.5)'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{color: 'white'}}>
                      <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: 0
                  }}>Bracket A</h3>
                </div>
                <span style={{
                  backgroundColor: 'rgba(79, 70, 229, 0.2)',
                  color: '#a5b4fc',
                  fontSize: '0.75rem',
                  fontWeight: 'medium',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(79, 70, 229, 0.3)',
                  backdropFilter: 'blur(4px)'
                }}>Tournament</span>
              </div>
              
              <p style={{
                color: '#d1d5db',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                margin: '0.5rem 0 1.5rem'
              }}>Kelola turnamen di Bracket A. Tambah, edit, dan monitoring hasil pertandingan.</p>
              
              <div style={{
                marginTop: 'auto',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.2rem',
                  background: 'linear-gradient(to right, rgba(79, 70, 229, 0.2), rgba(67, 56, 202, 0.2))',
                  color: '#a5b4fc',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: '1px solid rgba(79, 70, 229, 0.3)',
                  transition: 'all 0.2s ease'
                }}>
                  Kelola Bracket
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Bracket B Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.05))',
            borderRadius: '1rem',
            overflow: 'hidden',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            animation: 'fadeIn 0.9s ease'
          }} 
          onClick={() => router.push('/admin/bracket-b')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(16, 185, 129, 0.4), 0 10px 10px -5px rgba(16, 185, 129, 0.2)';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.1))';
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.05))';
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #10b981, #059669)',
              zIndex: 1
            }}></div>
            <div style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              height: '100%'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{color: 'white'}}>
                      <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: 0
                  }}>Bracket B</h3>
                </div>
                <span style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#6ee7b7',
                  fontSize: '0.75rem',
                  fontWeight: 'medium',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  backdropFilter: 'blur(4px)'
                }}>Tournament</span>
              </div>
              
              <p style={{
                color: '#d1d5db',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                margin: '0.5rem 0 1.5rem'
              }}>Kelola turnamen di Bracket B. Tambah, edit, dan monitoring hasil pertandingan.</p>
              
              <div style={{
                marginTop: 'auto',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.2rem',
                  background: 'linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
                  color: '#6ee7b7',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.2s ease'
                }}>
                  Kelola Bracket
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Grand Final Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(234, 88, 12, 0.05))',
            borderRadius: '1rem',
            overflow: 'hidden',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            animation: 'fadeIn 1.2s ease'
          }} 
          onClick={() => router.push('/admin/finals')}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(245, 158, 11, 0.4), 0 10px 10px -5px rgba(245, 158, 11, 0.2)';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(234, 88, 12, 0.1))';
            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(234, 88, 12, 0.05))';
            e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #f59e0b, #ea580c)',
              zIndex: 1
            }}></div>
            <div style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              height: '100%'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{color: 'white'}}>
                      <path d="M9.669.864L8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193l.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z"/>
                      <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"/>
                    </svg>
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: 0
                  }}>Grand Final</h3>
                </div>
                <span style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  fontSize: '0.75rem',
                  fontWeight: 'medium',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  backdropFilter: 'blur(4px)'
                }}>Grand Final</span>
              </div>
              
              <p style={{
                color: '#d1d5db',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                margin: '0.5rem 0 1.5rem'
              }}>Kelola Final Tournament. Atur tim dari pemenang Bracket A dan B untuk final dan juara 3.</p>
              
              <div style={{
                marginTop: 'auto',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.2rem',
                  background: 'linear-gradient(to right, rgba(245, 158, 11, 0.2), rgba(234, 88, 12, 0.2))',
                  color: '#fbbf24',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  transition: 'all 0.2s ease'
                }}>
                  Kelola Final
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer style={{
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderTop: '1px solid rgba(79, 70, 229, 0.3)',
        padding: '1.5rem',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.875rem',
        backdropFilter: 'blur(10px)'
      }}>
        <p>© 29 Mobile Legends Tournament. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard; 