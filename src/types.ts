export type Mood = 0 | 1 | 2 | 3 | 4 | 5;

export interface MoodPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  button: string;
}

export interface MoodInfo {
  id: Mood;
  name: string;
  emoji: string;
  palettes: {
    corrective: MoodPalette;
    associative: MoodPalette;
  };
}

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  mood: Mood;
  createdAt: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastEntryDate: string | null;
}

