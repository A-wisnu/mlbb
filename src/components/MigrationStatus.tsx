import { useState, useEffect } from 'react';
import { useMigration } from '../context/MigrationContext';

export default function MigrationNotification() {
  const { migrationStatus, message, error } = useMigration();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Tampilkan notifikasi hanya jika ada status
    if (migrationStatus !== 'idle') {
      setVisible(true);

      // Sembunyikan notifikasi setelah 5 detik jika sukses
      if (migrationStatus === 'success') {
        const timer = setTimeout(() => {
          setVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [migrationStatus]);

  if (!visible || migrationStatus === 'idle') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm animate-fade-in"
         style={{ 
           backgroundColor: migrationStatus === 'error' ? '#FEECEC' : 
                           migrationStatus === 'success' ? '#ECFDF5' : 
                           '#EFF6FF',
           borderLeft: `4px solid ${migrationStatus === 'error' ? '#F87171' : 
                                    migrationStatus === 'success' ? '#10B981' : 
                                    '#3B82F6'}`
         }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {migrationStatus === 'loading' && (
            <svg className="w-5 h-5 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {migrationStatus === 'success' && (
            <svg className="w-5 h-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          {migrationStatus === 'error' && (
            <svg className="w-5 h-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">
            {migrationStatus === 'loading' && 'Migrasi Data Sedang Berjalan'}
            {migrationStatus === 'success' && 'Migrasi Data Berhasil'}
            {migrationStatus === 'error' && 'Migrasi Data Gagal'}
          </h3>
          <div className="mt-1 text-sm text-gray-700">
            <p>{message}</p>
            {error && <p className="text-red-600 mt-1 text-xs">{error}</p>}
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={() => setVisible(false)}
              className="inline-flex rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 