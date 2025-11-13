import { createContext, useState, ReactNode } from 'react';

interface GlobalContextType {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

export const globalContext = createContext<GlobalContextType>({
  mode: 'light',
  toggleMode: () => {},
});

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <globalContext.Provider value={{ mode, toggleMode }}>
      {children}
    </globalContext.Provider>
  );
}
