import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiaryEntry, Mood } from '../types';
import { storageService } from '../services/storage';
import DiaryEntryForm from '../components/DiaryEntryForm';
import { useMood } from '../context/MoodContext';

export default function NewEntryPage() {
  const navigate = useNavigate();
  const { setCurrentMood } = useMood();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (content: string, mood: Mood): Promise<DiaryEntry> => {
    setSaving(true);
    try {
      const saved = storageService.createEntry(content, mood);
      navigate(`/entries/${saved.id}`);
      return saved;
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="mx-auto w-full max-w-3xl px-4">
        <DiaryEntryForm
          entry={null}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/')}
          paletteType="associative"
          onMoodPredicted={(m) => setCurrentMood(m)}
        />
      </div>
    </div>
  );
}


