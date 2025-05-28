import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { migrateLocalStorageToFirebase } from '../firebase/migrate';

interface MigrationContextType {
  migrationStatus: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  error?: string;
}

const initialState: MigrationContextType = {
  migrationStatus: 'idle',
  message: '',
};

const MigrationContext = createContext<MigrationContextType>(initialState);

export const useMigration = () => useContext(MigrationContext);

interface MigrationProviderProps {
  children: ReactNode;
}

export function MigrationProvider({ children }: MigrationProviderProps) {
  const [state, setState] = useState<MigrationContextType>(initialState);

  useEffect(() => {
    // Hindari menjalankan migrasi di server-side
    if (typeof window === 'undefined') return;

    const runMigration = async () => {
      try {
        setState({
          migrationStatus: 'loading',
          message: 'Memproses migrasi data...',
        });

        const result = await migrateLocalStorageToFirebase();
        
        if (result.success) {
          setState({
            migrationStatus: 'success',
            message: result.message,
          });
        } else {
          setState({
            migrationStatus: 'error',
            message: result.message,
            error: result.error,
          });
        }
      } catch (error) {
        setState({
          migrationStatus: 'error',
          message: 'Gagal melakukan migrasi data',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    runMigration();
  }, []); // Jalankan sekali saat mounting

  return (
    <MigrationContext.Provider value={state}>
      {children}
    </MigrationContext.Provider>
  );
} 