import { DiaryEntry, StreakData } from '../types';
import { format, isToday, isYesterday, parseISO, differenceInDays } from 'date-fns';

const STORAGE_KEY = 'diary_entries';
const STREAK_KEY = 'streak_data';

export const storageService = {
  // Get all entries
  getAllEntries(): DiaryEntry[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Get entry by ID
  getEntry(id: string): DiaryEntry | null {
    const entries = this.getAllEntries();
    return entries.find(entry => entry.id === id) || null;
  },

  // Get entry for a specific date
  getEntryByDate(date: string): DiaryEntry | null {
    const entries = this.getAllEntries();
    return entries.find(entry => entry.date === date) || null;
  },

  // Create a new entry (allows multiple entries per day)
  createEntry(content: string, mood: number): DiaryEntry {
    const entries = this.getAllEntries();
    const today = format(new Date(), 'yyyy-MM-dd');

    const newEntry: DiaryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: today,
      content,
      mood: mood as 0 | 1 | 2 | 3 | 4 | 5,
      createdAt: Date.now(),
    };

    entries.push(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    
    // Update streak
    this.updateStreak();
    
    return newEntry;
  },

  // Update an existing entry
  updateEntry(id: string, content: string, mood: number): DiaryEntry {
    const entries = this.getAllEntries();
    const index = entries.findIndex(entry => entry.id === id);
    
    if (index === -1) {
      throw new Error('Entry not found');
    }

    entries[index] = {
      ...entries[index],
      content,
      mood: mood as 0 | 1 | 2 | 3 | 4 | 5,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return entries[index];
  },

  // Delete an entry
  deleteEntry(id: string): void {
    const entries = this.getAllEntries();
    const filtered = entries.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    this.updateStreak();
  },

  // Get streak data
  getStreak(): StreakData {
    const stored = localStorage.getItem(STREAK_KEY);
    const defaultStreak: StreakData = {
      currentStreak: 0,
      longestStreak: 0,
      lastEntryDate: null,
    };
    
    if (!stored) {
      return defaultStreak;
    }

    return JSON.parse(stored);
  },

  // Update streak based on entries (works with multiple entries per day)
  updateStreak(): void {
    const entries = this.getAllEntries();
    if (entries.length === 0) {
      localStorage.setItem(STREAK_KEY, JSON.stringify({
        currentStreak: 0,
        longestStreak: 0,
        lastEntryDate: null,
      }));
      return;
    }

    // Get unique dates with entries (allows multiple entries per day)
    const uniqueDates = Array.from(new Set(entries.map(e => e.date)))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (uniqueDates.length === 0) {
      localStorage.setItem(STREAK_KEY, JSON.stringify({
        currentStreak: 0,
        longestStreak: 0,
        lastEntryDate: null,
      }));
      return;
    }

    const today = format(new Date(), 'yyyy-MM-dd');
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastEntryDate: string | null = uniqueDates[0];

    // Calculate current streak - check if we have entries for consecutive days starting from today
    let checkDate = new Date(today);
    for (const dateStr of uniqueDates) {
      const entryDate = parseISO(dateStr);
      const daysDiff = differenceInDays(checkDate, entryDate);
      
      if (daysDiff === 0) {
        // Today
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (daysDiff === 1) {
        // Consecutive day
        currentStreak++;
        checkDate = new Date(entryDate);
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // Streak broken
        break;
      }
    }

    // Calculate longest streak from all unique dates
    for (let i = 0; i < uniqueDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = parseISO(uniqueDates[i - 1]);
        const currDate = parseISO(uniqueDates[i]);
        const daysDiff = differenceInDays(prevDate, currDate);
        
        if (daysDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    const streakData: StreakData = {
      currentStreak,
      longestStreak,
      lastEntryDate,
    };

    localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
  },
};

