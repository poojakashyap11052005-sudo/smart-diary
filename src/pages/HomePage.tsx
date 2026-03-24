import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DiaryEntry, Mood, MoodPalette, StreakData } from '../types';
import { storageService } from '../services/storage';
import { MOODS } from '../constants/moods';
import DiaryEntryForm from '../components/DiaryEntryForm';
import DiaryEntryList from '../components/DiaryEntryList';
import StreakDisplay from '../components/StreakDisplay';
import QuoteDisplay from '../components/QuoteDisplay';
import { useMood } from '../context/MoodContext';

const FALLBACK_CORRECTIVE: MoodPalette = {
  primary: '#C6BE9B',
  secondary: '#E5E7FF',
  accent: '#FFFFFF',
  background: '#F9FAFB',
  text: '#1F2937',
  button: '#8B7C54',
};

export default function HomePage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastEntryDate: null,
  });
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentMood } = useMood();

  useEffect(() => {
    loadEntries();
    loadStreak();
  }, []);

  const loadEntries = () => {
    const allEntries = storageService.getAllEntries();
    const sortedEntries = [...allEntries].sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return b.createdAt - a.createdAt;
    });
    setEntries(sortedEntries);

    const today = new Date().toISOString().split('T')[0];
    const todayEntry = sortedEntries.find((e) => e.date === today);
    if (todayEntry) {
      setSelectedMood(todayEntry.mood);
      setCurrentMood(todayEntry.mood);
    } else if (sortedEntries.length > 0) {
      setSelectedMood(sortedEntries[0].mood);
      setCurrentMood(sortedEntries[0].mood);
    } else {
      setSelectedMood(null);
      setCurrentMood(null);
    }
  };

  useEffect(() => {
    const state = location.state as { editEntryId?: string } | null;
    if (state?.newEntry) {
      setEditingEntry(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/', { replace: true });
      return;
    }

    if (state?.editEntryId && entries.length > 0) {
      const toEdit = entries.find((entry) => entry.id === state.editEntryId);
      if (toEdit) {
        setEditingEntry(toEdit);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      navigate('/', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, entries]);

  const loadStreak = () => {
    const data = storageService.getStreak();
    setStreak(data);
  };

  const handleSubmit = async (content: string, mood: Mood): Promise<DiaryEntry> => {
    let savedEntry: DiaryEntry;
    if (editingEntry) {
      savedEntry = storageService.updateEntry(editingEntry.id, content, mood);
    } else {
      savedEntry = storageService.createEntry(content, mood);
    }

    loadEntries();
    loadStreak();
    setEditingEntry(null);
    setSelectedMood(savedEntry.mood);
    setCurrentMood(savedEntry.mood);
    navigate(`/entries/${savedEntry.id}`);
    return savedEntry;
  };

  const handleEdit = (entry: DiaryEntry) => {
    // Navigate to the dedicated edit page for this entry
    navigate(`/entries/${entry.id}/edit`);
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    if (selectedMood !== null) {
      setCurrentMood(selectedMood);
    }
  };

  const palette = useMemo<MoodPalette>(() => {
    if (selectedMood === null) {
      return FALLBACK_CORRECTIVE;
    }
    return MOODS[selectedMood].palettes.corrective;
  }, [selectedMood]);

  return (
    <div
      className="transition-colors duration-500"
      style={{
        background: `linear-gradient(135deg, ${palette.background} 0%, ${palette.accent} 60%, ${palette.secondary}30 100%)`,
      }}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-10 space-y-10">
        <section className="grid gap-8 rounded-3xl bg-white/80 backdrop-blur-md p-8 shadow-xl border border-white/60 md:grid-cols-5">
          <div className="md:col-span-3 space-y-6">
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-500 font-semibold">Smart diary</p>
              <h1 className="mt-2 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Reflect, track your mood, and build mindful habits.
              </h1>
              <p className="mt-4 text-base text-gray-600">
                Your daily space to write freely. We&#39;ll keep your streaks, surface supportive quotes, and gently guide your emotions toward balance.
              </p>
            </div>
            <StreakDisplay streak={streak} />
          </div>
          <div className="md:col-span-2">
            <QuoteDisplay mood={selectedMood} paletteType="corrective" />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Recent entries</h2>
          <DiaryEntryList
            entries={entries}
            onEdit={handleEdit}
            onDelete={(id) => {
              storageService.deleteEntry(id);
              loadEntries();
              loadStreak();
            }}
            onView={(entry) => navigate(`/entries/${entry.id}`)}
            paletteType="corrective"
            grid
          />
        </section>

        <section>
          <div className="mt-8 rounded-2xl border border-white/60 bg-white/80 p-8 shadow-xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Start a new entry</h3>
                <p className="mt-1 text-gray-600">Open a full-screen editor with color feedback based on your mood.</p>
              </div>
              <button
                onClick={() => navigate('/new')}
                className="inline-flex items-center rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                New entry
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


