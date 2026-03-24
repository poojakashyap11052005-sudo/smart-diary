import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DiaryEntry, Mood } from '../types';
import { storageService } from '../services/storage';
import DiaryEntryForm from '../components/DiaryEntryForm';
import { useMood } from '../context/MoodContext';

export default function EditEntryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setCurrentMood } = useMood();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);

  useEffect(() => {
    if (!id) return;
    const found = storageService.getEntry(id);
    setEntry(found);
    if (found) setCurrentMood(found.mood);
  }, [id, setCurrentMood]);

  const handleSubmit = async (content: string, mood: Mood): Promise<DiaryEntry> => {
    if (!id) throw new Error('Missing id');
    const saved = storageService.updateEntry(id, content, mood);
    navigate(`/entries/${saved.id}`);
    return saved;
  };

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto w-full max-w-3xl px-4">
        <DiaryEntryForm
          entry={entry}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/entries/${id}`)}
          paletteType="associative"
          onMoodPredicted={(m) => setCurrentMood(m)}
        />
      </div>
    </div>
  );
}


