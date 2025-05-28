'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

const AdminPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (user) {
        router.push('/admin/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin/dashboard');
    } catch (error: FirebaseError | unknown) {
      console.error('Login error:', error);
      
      // Handle Firebase auth errors
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-credential' || 
            error.code === 'auth/user-not-found' || 
            error.code === 'auth/wrong-password') {
          setError('Email atau password salah');
        } else if (error.code === 'auth/too-many-requests') {
          setError('Terlalu banyak percobaan. Coba lagi nanti');
        } else {
          setError('Gagal masuk: ' + error.message);
        }
      } else {
        setError('Terjadi kesalahan tidak diketahui saat login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111827'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div className="spinner" style={{
            border: '4px solid rgba(255, 255, 255, 0.1)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Memuat...</p>
          <style jsx>{`
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
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      backgroundColor: '#111827'
    }}>
      {/* Background Video */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0
      }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.3
          }}
        >
          <source src="/videos/ml-background.mp4" type="video/mp4" />
        </video>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(17, 24, 39, 0.85)',
          backdropFilter: 'blur(4px)'
        }}></div>
      </div>

      {/* Header */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        padding: isMobile ? '0.75rem' : '1rem'
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
            gap: '0.5rem'
          }}>
            <Image 
              src="/images/logo-mobile-legend-31251.png" 
              alt="Mobile Legends Logo" 
              width={40}
              height={40}
              style={{
                height: 'auto',
                width: 'auto',
                filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))'
              }}
            />
            <span style={{
              fontSize: isMobile ? '1.1rem' : '1.25rem',
              fontWeight: 'bold',
              color: 'white'
            }}>ML Tournament</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        padding: '1rem'
      }}>
        <div style={{
          maxWidth: '450px',
          width: '100%',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(67, 56, 202, 0.1))',
          borderRadius: '1rem',
          overflow: 'hidden',
          border: '1px solid rgba(79, 70, 229, 0.4)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(124, 58, 237, 0.2)',
          backdropFilter: 'blur(12px)',
          padding: '2rem',
          animationDuration: '0.3s'
        }}>
          <div style={{
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <Image 
              src="/images/infoikamtif 11.png" 
              alt="IKMATIF Logo" 
              width={80}
              height={80}
              style={{
                margin: '0 auto 1rem'
              }}
            />
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '0.5rem'
            }}>Admin Login</h1>
            <p style={{
              color: '#d1d5db',
              fontSize: '1rem'
            }}>Masuk untuk mengelola tournament bracket</p>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'rgba(220, 38, 38, 0.2)',
              color: '#fca5a5',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{
              marginBottom: '1.5rem'
            }}>
              <label 
                htmlFor="email" 
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#d1d5db',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Email
              </label>
              <input 
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(75, 85, 99, 0.4)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  overflowWrap: 'break-word',
                  wordWrap: 'break-word'
                }}
                placeholder="Masukkan email"
                required
              />
            </div>

            <div style={{
              marginBottom: '2rem'
            }}>
              <label 
                htmlFor="password" 
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#d1d5db',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Password
              </label>
              <input 
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(31, 41, 55, 0.8)',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(75, 85, 99, 0.4)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                placeholder="Masukkan password"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: loading ? 'rgba(79, 70, 229, 0.5)' : 'rgba(79, 70, 229, 0.8)',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              {loading ? (
                <>
                  <svg 
                    style={{
                      animation: 'spin 1s linear infinite',
                      width: '1.25rem',
                      height: '1.25rem'
                    }}
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      style={{
                        opacity: 0.25
                      }}
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      fill="none" 
                    />
                    <path 
                      style={{
                        opacity: 0.75
                      }}
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : 'Masuk'}
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </button>
          </form>

          <div style={{
            marginTop: '2rem',
            textAlign: 'center'
          }}>
            <Link href="/" style={{
              color: '#8b5cf6',
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}>
              Kembali ke halaman utama
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage; 