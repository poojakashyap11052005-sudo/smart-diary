import { useState, useEffect } from 'react';
import { DiaryEntry, Mood, MoodPalette } from '../types';
import { MOODS } from '../constants/moods';
import { format } from 'date-fns';
import { predictMood } from '../services/moodPredictor';

interface DiaryEntryFormProps {
  entry: DiaryEntry | null;
  onSubmit: (content: string, mood: Mood) => Promise<DiaryEntry>;
  onCancel?: () => void;
  paletteType?: 'corrective' | 'associative';
  onMoodPredicted?: (mood: Mood) => void;
}

const FALLBACK_PALETTES: Record<'corrective' | 'associative', MoodPalette> = {
  corrective: {
    primary: '#C6BE9B',
    secondary: '#E5E7FF',
    accent: '#F9FAFB',
    background: '#F9FAFB',
    text: '#1F2937',
    button: '#8B7C54',
  },
  associative: {
    primary: '#B8C6C7',
    secondary: '#E5E7EB',
    accent: '#FFFFFF',
    background: '#FFFFFF',
    text: '#1F2937',
    button: '#7D8F91',
  },
};

export default function DiaryEntryForm({ entry, onSubmit, onCancel, paletteType = 'corrective', onMoodPredicted }: DiaryEntryFormProps) {
  const [content, setContent] = useState('');
  const [predictedMood, setPredictedMood] = useState<Mood | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [originalContent, setOriginalContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (entry) {
      setContent(entry.content);
      setPredictedMood(entry.mood);
      setOriginalContent(entry.content);
    } else {
      setContent('');
      setPredictedMood(null);
      setOriginalContent('');
    }
  }, [entry]);

  // Debounced mood prediction - works for both new entries and edits
  useEffect(() => {
    if (!content.trim()) {
      return;
    }

    // Only predict if content has changed from original or is a new entry
    const contentChanged = !entry || content.trim() !== originalContent.trim();
    
    if (!contentChanged) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      if (content.trim().length > 10) {
        setIsPredicting(true);
        try {
          const mood = await predictMood(content);
          setPredictedMood(mood);
          onMoodPredicted?.(mood);
        } catch (error) {
          console.error('Error predicting mood:', error);
        } finally {
          setIsPredicting(false);
        }
      }
    }, 1000); // Wait 1 second after user stops typing

    return () => clearTimeout(timeoutId);
  }, [content, entry, originalContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('Please write something in your diary');
      return;
    }

    let mood: Mood;
    
    // Always use predicted mood if available (for both new entries and edits)
    if (predictedMood !== null) {
      mood = predictedMood;
    } else {
      // Fallback: predict now if not already predicted
      setIsPredicting(true);
      try {
        mood = await predictMood(content);
        setPredictedMood(mood);
        onMoodPredicted?.(mood);
      } catch (error) {
        console.error('Error predicting mood:', error);
        // If prediction fails and we're editing, keep the original mood
        // Otherwise default to joy
        mood = entry ? entry.mood : 1;
      } finally {
        setIsPredicting(false);
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content, mood);
      if (!entry) {
        setContent('');
        setPredictedMood(null);
        setOriginalContent('');
      } else {
        setOriginalContent(content);
      }
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = format(new Date(), 'EEEE, MMMM d, yyyy');
  const moodInfo = predictedMood !== null ? MOODS[predictedMood] : null;
  const palette: MoodPalette = moodInfo
    ? moodInfo.palettes[paletteType]
    : FALLBACK_PALETTES[paletteType];

  return (
    <form 
      onSubmit={handleSubmit}
      className="rounded-2xl p-8 shadow-2xl transition-all duration-500 backdrop-blur-md border-4"
      style={{
        background: `linear-gradient(135deg, ${palette.background} 0%, ${palette.accent} 100%)`,
        borderColor: palette.primary,
        boxShadow: `0 25px 70px -15px ${palette.primary}60, 0 0 0 1px ${palette.secondary}40`,
      }}
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold" style={{ color: palette.text }}>
            {entry ? 'Edit Entry' : 'New Diary Entry'}
          </h2>
          {predictedMood !== null && (
            <div 
              className="flex items-center gap-3 px-5 py-3 rounded-full shadow-lg border-2 backdrop-blur-sm"
              style={{ 
                background: `linear-gradient(135deg, ${palette.secondary} 0%, ${palette.primary}40 100%)`,
                borderColor: palette.primary,
                boxShadow: `0 8px 20px -5px ${palette.primary}50`,
              }}
            >
              <span className="text-3xl drop-shadow-md">{moodInfo?.emoji}</span>
              <span className="font-bold text-lg" style={{ color: palette.text }}>
                {moodInfo?.name}
              </span>
              {isPredicting && (
                <span className="ml-2 text-sm opacity-80 font-medium" style={{ color: palette.text }}>Analyzing...</span>
              )}
            </div>
          )}
        </div>
        <p className="text-sm opacity-70 font-medium" style={{ color: palette.text }}>
          {today}
        </p>
        {predictedMood === null && content.length > 10 && (
          <p className="text-sm mt-2 opacity-60" style={{ color: palette.text }}>
            💭 Detecting your mood from what you write...
          </p>
        )}
        {entry && content.trim() !== originalContent.trim() && !isPredicting && predictedMood === entry.mood && content.length > 10 && (
          <p className="text-sm mt-2 opacity-60" style={{ color: palette.text }}>
            💭 Content changed - analyzing new mood...
          </p>
        )}
      </div>

      <div className="mb-6">
        <label 
          htmlFor="content" 
          className="block text-sm font-semibold mb-3"
          style={{ color: palette.text }}
        >
          What's on your mind?
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write about your day, your thoughts, your feelings... The app will automatically detect your mood."
          rows={10}
          className="w-full p-5 rounded-xl border-3 resize-none focus:outline-none transition-all text-base leading-relaxed shadow-inner"
          style={{
            background: `linear-gradient(to bottom, ${palette.accent} 0%, ${palette.background} 100%)`,
            borderColor: palette.primary,
            borderWidth: '3px',
            color: palette.text,
            minHeight: '200px',
            boxShadow: `inset 0 2px 10px -5px ${palette.primary}30`,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = palette.primary;
            e.target.style.borderWidth = '4px';
            e.target.style.boxShadow = `0 0 0 3px ${palette.primary}30, inset 0 2px 10px -5px ${palette.primary}30`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = palette.secondary;
            e.target.style.borderWidth = '3px';
            e.target.style.boxShadow = `inset 0 2px 10px -5px ${palette.primary}30`;
          }}
        />
        <div className="mt-2 text-xs opacity-60" style={{ color: palette.text }}>
          {content.length} characters
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isPredicting || isSubmitting}
          className="flex-1 py-4 px-8 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          style={{
            backgroundColor: palette.button,
            boxShadow: `0 10px 30px -10px ${palette.button}80`,
          }}
        >
          {isSubmitting
            ? 'Saving...'
            : isPredicting
              ? 'Analyzing...'
              : entry
                ? 'Update Entry'
                : 'Save Entry'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="py-4 px-8 rounded-xl font-bold border-2 transition-all duration-300 hover:scale-105"
            style={{
              borderColor: palette.primary,
              color: palette.primary,
              backgroundColor: 'transparent',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

