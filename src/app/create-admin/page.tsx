'use client';

import { useState } from 'react';
import { auth } from '../../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

export default function CreateAdminPage() {
  const [message, setMessage] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const createAdmin = async () => {
    setIsCreating(true);
    setMessage('Membuat akun admin...');
    
    try {
      const email = 'agoy@gmail.com';
      const password = 'Agoyberakye';
      
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage('Akun admin berhasil dibuat! Email: agoy@gmail.com, Password: Agoyberakye');
    } catch (error: FirebaseError | unknown) {
      console.error('Error creating admin:', error);
      
      if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
        setMessage('Akun dengan email ini sudah ada. Anda dapat login dengan password yang ditentukan.');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setMessage(`Gagal membuat akun admin: ${errorMessage}`);
      }
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '600px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Buat Akun Admin</h1>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <p>Klik tombol di bawah untuk membuat akun admin dengan:</p>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>Email: agoy@gmail.com</li>
          <li>Password: Agoyberakye</li>
        </ul>
      </div>
      
      <button 
        onClick={createAdmin}
        disabled={isCreating}
        style={{
          backgroundColor: '#4f46e5',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.375rem',
          border: 'none',
          cursor: isCreating ? 'not-allowed' : 'pointer',
          opacity: isCreating ? 0.7 : 1
        }}
      >
        {isCreating ? 'Membuat Akun...' : 'Buat Akun Admin'}
      </button>
      
      {message && (
        <div style={{ 
          marginTop: '1.5rem',
          padding: '1rem',
          borderRadius: '0.375rem',
          backgroundColor: message.includes('berhasil') ? '#ecfdf5' : '#fef2f2',
          color: message.includes('berhasil') ? '#065f46' : '#b91c1c',
          border: `1px solid ${message.includes('berhasil') ? '#d1fae5' : '#fee2e2'}`
        }}>
          {message}
        </div>
      )}
      
      <div style={{ marginTop: '2rem' }}>
        <a 
          href="/admin"
          style={{
            color: '#4f46e5',
            textDecoration: 'none'
          }}
        >
          ← Kembali ke halaman login admin
        </a>
      </div>
    </div>
  );
} 