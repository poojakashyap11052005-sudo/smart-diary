import { DiaryEntry, MoodPalette } from '../types';
import { MOODS } from '../constants/moods';
import { format, parseISO } from 'date-fns';

interface DiaryEntryListProps {
  entries: DiaryEntry[];
  onEdit: (entry: DiaryEntry) => void;
  onDelete: (id: string) => void;
  paletteType?: 'corrective' | 'associative';
  onView?: (entry: DiaryEntry) => void;
  grid?: boolean; // show entries in a two-column grid
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

export default function DiaryEntryList({ entries, onEdit, onDelete, paletteType = 'corrective', onView, grid = false }: DiaryEntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No entries yet. Start writing your first diary entry!</p>
      </div>
    );
  }

  // Sort entries by date and creation time (most recent first)
  const sortedEntries = [...entries].sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    // If same date, sort by creation time (most recent first)
    return b.createdAt - a.createdAt;
  });

  // Check if there are multiple entries on the same day
  const hasMultipleEntriesSameDay = entries.length > 1 && 
    entries.some((e, i) => entries.slice(i + 1).some(other => e.date === other.date));

  const containerClass = grid
    ? 'grid gap-6 sm:grid-cols-2'
    : 'space-y-6';

  return (
    <div className={containerClass}>
      {sortedEntries.map((entry) => {
        const moodInfo = MOODS[entry.mood];
        const palette: MoodPalette = moodInfo?.palettes[paletteType] ?? FALLBACK_PALETTE[paletteType];
        const entryDate = parseISO(entry.date);
        const formattedDate = format(entryDate, 'EEEE, MMMM d, yyyy');
        const formattedTime = format(new Date(entry.createdAt), 'h:mm a');
        const showTime = hasMultipleEntriesSameDay && entries.some(e => e.id !== entry.id && e.date === entry.date);

        return (
          <div
            key={entry.id}
            className="rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-4 h-full"
            style={{
              background: `linear-gradient(135deg, ${palette.background} 0%, ${palette.accent} 100%)`,
              borderColor: palette.primary,
              borderLeftWidth: '8px',
              borderTopWidth: '4px',
              borderRightWidth: '4px',
              borderBottomWidth: '4px',
              boxShadow: `0 15px 40px -10px ${palette.primary}50, 0 0 0 1px ${palette.secondary}40`,
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div 
                  className="rounded-full p-4 shadow-lg border-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${palette.secondary} 0%, ${palette.primary}80 100%)`,
                    borderColor: palette.primary,
                    boxShadow: `0 8px 20px -5px ${palette.primary}60`,
                  }}
                >
                  <span className="text-4xl drop-shadow-md">{moodInfo.emoji}</span>
                </div>
                <div>
                  <div className="font-bold text-xl mb-1" style={{ color: palette.text }}>
                    {moodInfo.name}
                  </div>
                  <div className="text-sm opacity-80 font-semibold" style={{ color: palette.text }}>
                    {formattedDate}
                    {showTime && (
                      <span className="ml-2 opacity-70">• {formattedTime}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {onView && (
                  <button
                    onClick={() => onView(entry)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 transform hover:scale-110 hover:shadow-lg text-gray-900 bg-white"
                    style={{
                      boxShadow: '0 4px 15px -5px rgba(15, 23, 42, 0.15)',
                    }}
                  >
                    View
                  </button>
                )}
                <button
                  onClick={() => onEdit(entry)}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 transform hover:scale-110 hover:shadow-lg text-white"
                  style={{
                    background: `linear-gradient(135deg, ${palette.button} 0%, ${palette.primary} 100%)`,
                    boxShadow: `0 4px 15px -5px ${palette.button}80`,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this entry?')) {
                      onDelete(entry.id);
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 hover:shadow-lg transition-all duration-200 transform hover:scale-110"
                  style={{
                    boxShadow: '0 4px 15px -5px rgba(239, 68, 68, 0.5)',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            <div 
              className="whitespace-pre-wrap text-base leading-relaxed pt-4 border-t-2 font-medium"
              style={{ 
                color: palette.text,
                borderColor: `${palette.primary}60`,
              }}
            >
              {entry.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

