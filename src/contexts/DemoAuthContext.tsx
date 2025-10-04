import { createContext, useContext, ReactNode } from 'react';

export interface DemoUser {
  id: string;
  email: string;
  display_name: string;
  role: 'student' | 'teacher' | 'admin';
  class_id?: string;
  total_points: number;
  level: number;
}

// Hardcoded demo user
const DEMO_USER: DemoUser = {
  id: 'demo-user-123',
  email: 'demo@biomescribe.com',
  display_name: 'Demo Student',
  role: 'student',
  class_id: 'class-a',
  total_points: 150,
  level: 3,
};

interface DemoAuthContextType {
  user: DemoUser;
  loading: boolean;
}

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined);

export const DemoAuthProvider = ({ children }: { children: ReactNode }) => {
  const value = {
    user: DEMO_USER,
    loading: false, // No loading needed for demo
  };

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(DemoAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a DemoAuthProvider');
  }
  return context;
};