import { createContext, ReactNode, useContext, useState } from 'react';
import { Mood } from '../types';

type MoodContextValue = {
  currentMood: Mood | null;
  setCurrentMood: (mood: Mood | null) => void;
};

const MoodContext = createContext<MoodContextValue | undefined>(undefined);

export function MoodProvider({ children }: { children: ReactNode }) {
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);

  return (
    <MoodContext.Provider value={{ currentMood, setCurrentMood }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const ctx = useContext(MoodContext);
  if (!ctx) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return ctx;
}

