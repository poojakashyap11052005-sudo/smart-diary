import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EntryDetailPage from './pages/EntryDetailPage';
import NewEntryPage from './pages/NewEntryPage';
import EditEntryPage from './pages/EditEntryPage';
import { MoodProvider, useMood } from './context/MoodContext';
import Logo from './assets/logo.svg';
import { MOODS } from './constants/moods';
import { MoodPalette, StreakData } from './types';
import { storageService } from './services/storage';

const FALLBACK_HEADER_PALETTE: Record<'corrective' | 'associative', MoodPalette> = {
  corrective: {
    primary: '#C6BE9B',
    secondary: '#E5E7FF',
    accent: '#FFFFFF',
    background: '#F9FAFB',
    text: '#1F2937',
    button: '#8B7C54',
  },
  associative: {
    primary: '#EC8589',
    secondary: '#F1DEE3',
    accent: '#FFFFFF',
    background: '#FFFFFF',
    text: '#1F2937',
    button: '#D95D69',
  },
};

function Header() {
  const { currentMood } = useMood();
  const location = useLocation();
  const navigate = useNavigate();
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, longestStreak: 0, lastEntryDate: null });

  const paletteType: 'corrective' | 'associative' = location.pathname.startsWith('/entries') ? 'associative' : 'corrective';
  const palette = currentMood !== null
    ? MOODS[currentMood].palettes[paletteType]
    : FALLBACK_HEADER_PALETTE[paletteType];

  const handleNewEntry = () => {
    navigate('/new');
  };

  useEffect(() => {
    setStreak(storageService.getStreak());
  }, [location.pathname]);

  return (
    <header
      className="border-b border-white/40 backdrop-blur"
      style={{
        background: `linear-gradient(90deg, ${palette.background} 0%, ${palette.accent} 60%, ${palette.secondary}30 100%)`,
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-2xl font-semibold" style={{ color: palette.text }}>
          <img src={Logo} alt="" className="h-8 w-8" />
          <span>Smart Diary</span>
        </Link>
        <div className="flex items-center gap-3">
          <div
            className="hidden sm:inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold shadow"
            style={{
              background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.background} 100%)`,
              color: palette.text,
              border: `1px solid ${palette.primary}55`,
            }}
            title={`Current streak: ${streak.currentStreak}`}
          >
            <span>🔥</span>
            <span>{streak.currentStreak}</span>
          </div>
          <button
            onClick={handleNewEntry}
            className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 transition"
            style={{ background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.button} 100%)` }}
          >
            New Entry
          </button>
        </div>
      </div>
    </header>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function App() {
  return (
    <MoodProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen">
          <Header />

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/entries/:id" element={<EntryDetailPage />} />
              <Route path="/new" element={<NewEntryPage />} />
              <Route path="/entries/:id/edit" element={<EditEntryPage />} />
            </Routes>
          </main>

          <footer className="mt-20 border-t border-slate-200 bg-white/70">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-500 md:flex-row">
              <span>© {new Date().getFullYear()} Smart Diary. All rights reserved.</span>
              <span>Designed to support mindful journaling.</span>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </MoodProvider>
  );
}

export default App;

