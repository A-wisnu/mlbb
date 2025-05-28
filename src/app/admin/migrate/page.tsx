'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { migrateLocalStorageToFirebase, clearLocalStorage } from '../../../firebase/migrate';
import Image from 'next/image';
import Link from 'next/link';

const MigratePage = () => {
  const [migrating, setMigrating] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleMigrate = async () => {
    setMigrating(true);
    setMessage('Memulai migrasi data...');
    try {
      const result = await migrateLocalStorageToFirebase();
      setMessage(result.message);
      setSuccess(result.success);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setSuccess(false);
    } finally {
      setMigrating(false);
    }
  };

  const handleClearLocalStorage = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua data dari localStorage? Ini tidak dapat dikembalikan.')) {
      try {
        clearLocalStorage();
        setMessage('Data localStorage berhasil dihapus.');
        setSuccess(true);
      } catch (error) {
        setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
        setSuccess(false);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#111827'
    }}>
      {/* Background */}
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
        padding: '1rem'
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
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: 'white'
            }}>Admin Panel</span>
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
          maxWidth: '600px',
          width: '100%',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(67, 56, 202, 0.1))',
          borderRadius: '1rem',
          overflow: 'hidden',
          border: '1px solid rgba(79, 70, 229, 0.4)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(124, 58, 237, 0.2)',
          backdropFilter: 'blur(12px)',
          padding: '2rem',
        }}>
          <div style={{
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '0.5rem'
            }}>Migrasi Data ke Firebase</h1>
            <p style={{
              color: '#d1d5db',
              fontSize: '1rem'
            }}>
              Halaman ini akan memindahkan semua data dari localStorage ke Firebase Database.
              Ini akan memungkinkan data diakses dari perangkat manapun.
            </p>
          </div>

          {message && (
            <div style={{
              backgroundColor: success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(220, 38, 38, 0.2)',
              color: success ? '#a7f3d0' : '#fca5a5',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              border: `1px solid ${success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(220, 38, 38, 0.3)'}`,
              fontSize: '0.875rem'
            }}>
              {message}
            </div>
          )}

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <button
              onClick={handleMigrate}
              disabled={migrating}
              style={{
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: 500,
                cursor: migrating ? 'not-allowed' : 'pointer',
                opacity: migrating ? 0.7 : 1,
                transition: 'all 0.3s ease',
                border: '1px solid rgba(79, 70, 229, 0.6)',
              }}
            >
              {migrating ? 'Memproses...' : 'Migrasi Data ke Firebase'}
            </button>

            <button
              onClick={handleClearLocalStorage}
              style={{
                backgroundColor: 'rgba(220, 38, 38, 0.8)',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(220, 38, 38, 0.6)',
                marginTop: '1rem',
              }}
            >
              Hapus Data localStorage
            </button>

            <button
              onClick={() => router.push('/admin/dashboard')}
              style={{
                backgroundColor: 'rgba(31, 41, 55, 0.8)',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(31, 41, 55, 0.6)',
                marginTop: '1rem',
              }}
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MigratePage; 