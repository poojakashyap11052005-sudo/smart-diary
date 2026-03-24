import { Mood, MoodPalette } from '../types';
import { getRandomQuote } from '../constants/quotes';
import { MOODS } from '../constants/moods';

interface QuoteDisplayProps {
  mood: Mood | null;
  paletteType?: 'corrective' | 'associative';
}

const FALLBACK_PALETTE: Record<'corrective' | 'associative', MoodPalette> = {
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

export default function QuoteDisplay({ mood, paletteType = 'corrective' }: QuoteDisplayProps) {
  if (!mood) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <p className="text-gray-600 italic">
          Select your mood to see an inspiring quote!
        </p>
      </div>
    );
  }

  const quote = getRandomQuote(mood);
  const moodInfo = MOODS[mood];
  const palette = moodInfo?.palettes[paletteType] ?? FALLBACK_PALETTE[paletteType];

  return (
    <div 
      className="rounded-2xl p-8 text-center shadow-2xl transition-all duration-300 border-4 backdrop-blur-sm"
      style={{
        background: `linear-gradient(135deg, ${palette.background} 0%, ${palette.accent} 100%)`,
        color: palette.text,
        borderColor: palette.primary,
        boxShadow: `0 20px 50px -15px ${palette.primary}60, 0 0 0 1px ${palette.secondary}40`,
      }}
    >
      <div className="text-6xl mb-5 drop-shadow-lg">{moodInfo.emoji}</div>
      <p className="text-2xl italic font-bold leading-relaxed" style={{ color: palette.text }}>
        "{quote}"
      </p>
    </div>
  );
}

