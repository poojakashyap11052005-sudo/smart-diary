import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { DiaryEntry, MoodPalette } from '../types';
import { storageService } from '../services/storage';
import { MOODS } from '../constants/moods';
import QuoteDisplay from '../components/QuoteDisplay';
import { useMood } from '../context/MoodContext';

const FALLBACK_ASSOCIATIVE: MoodPalette = {
  primary: '#EC8589',
  secondary: '#F1DEE3',
  accent: '#FFFFFF',
  background: '#FFFFFF',
  text: '#1F2937',
  button: '#D95D69',
};

export default function EntryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const { setCurrentMood } = useMood();

  useEffect(() => {
    if (!id) return;
    const found = storageService.getEntry(id);
    setEntry(found);
  }, [id]);

  useEffect(() => {
    if (entry) {
      setCurrentMood(entry.mood);
    } else {
      setCurrentMood(null);
    }
    return () => {
      setCurrentMood(null);
    };
  }, [entry, setCurrentMood]);

  const palette = useMemo<MoodPalette>(() => {
    if (entry) {
      return MOODS[entry.mood].palettes.associative;
    }
    return FALLBACK_ASSOCIATIVE;
  }, [entry]);

  if (!entry) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-semibold text-gray-900">Entry not found</h1>
          <p className="mt-3 text-gray-600">The diary entry you&#39;re looking for doesn&#39;t exist or was removed.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Return to journal
          </button>
        </div>
      </div>
    );
  }

  const entryDate = parseISO(entry.date);
  const formattedDate = format(entryDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(new Date(entry.createdAt), 'h:mm a');
  const moodInfo = MOODS[entry.mood];

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        background: `linear-gradient(135deg, ${palette.background} 0%, ${palette.accent} 60%, ${palette.secondary}40 100%)`,
      }}
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-10 space-y-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/70 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur hover:bg-white"
        >
          ← Back to journal
        </button>

        <section className="rounded-3xl border border-white/50 bg-white/80 p-10 backdrop-blur shadow-2xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gray-500">
                {moodInfo.emoji} {moodInfo.name}
              </span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Diary entry</h1>
                <p className="text-sm text-gray-500">
                  {formattedDate} • {formattedTime}
                </p>
              </div>
            </div>
            <QuoteDisplay mood={entry.mood} paletteType="associative" />
          </div>

          <article
            className="mt-8 whitespace-pre-wrap rounded-2xl border border-white/60 bg-white/70 p-8 text-lg leading-relaxed text-gray-800 shadow-inner"
          >
            {entry.content}
          </article>
        </section>

        <section className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/entries/${entry.id}/edit`)}
            className="inline-flex items-center rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Edit entry
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center rounded-lg border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400"
          >
            View all entries
          </button>
        </section>
      </div>
    </div>
  );
}


