# Smart Diary Application

A beautiful, mood-based diary application with dynamic UI themes, automatic mood detection using ML, streak tracking, and daily inspirational quotes.

## Features

- 📝 **CRUD Operations**: Create, read, update, and delete diary entries
- 🤖 **Automatic Mood Detection**: ML-powered mood prediction from your text using SVM (LinearSVC)
- 🎨 **Dynamic Color Palettes**: UI colors change based on your detected mood (therapeutic color schemes)
- 🔥 **Streak Tracking**: Track your daily writing streak
- 💬 **Daily Quotes**: Get inspirational quotes based on your mood
- 😊 **6 Mood Categories**: Sadness (0), Joy (1), Love (2), Anger (3), Fear (4), and Surprise (5)

## Moods & Color Palettes

Each mood uses therapeutic color palettes designed to be calming and supportive:

- 😢 **Sadness** (0): Warm beige and soft purple tones (Tanbeige & MediumPurpleViolet)
- 😊 **Joy** (1): Soft warm cream and tan tones for calm joy
- ❤️ **Love** (2): Gentle warm cream and peachy tones (Soft Warm Cream & Flesh)
- 😠 **Anger** (3): Calming lilac and beige tones for peace
- 😨 **Fear** (4): Clear sky blue tones for assurance and safety
- 😲 **Surprise** (5): Muted olive-gold tones for pleasant focus

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python 3.8 or higher (for ML backend)
- npm or yarn
- pip (Python package manager)

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Backend Setup (ML Model)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Place your ML model files in the `backend/` directory:
   - `emotion_svm_model.pkl` - Your trained SVM model
   - `tfidf_vectorizer.pkl` - Your TF-IDF vectorizer

4. Start the Flask backend server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

**Note**: The app will work with a fallback keyword-based mood detection if the backend is not running, but for best results, use the ML model.

### Building for Production

```bash
npm run build
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **date-fns** - Date manipulation
- **LocalStorage** - Data persistence

## Project Structure

```
├── src/
│   ├── components/        # React components
│   │   ├── DiaryEntryForm.tsx
│   │   ├── DiaryEntryList.tsx
│   │   ├── QuoteDisplay.tsx
│   │   └── StreakDisplay.tsx
│   ├── constants/         # Mood definitions and quotes
│   │   ├── moods.ts
│   │   └── quotes.ts
│   ├── services/          # Storage and ML prediction
│   │   ├── storage.ts
│   │   └── moodPredictor.ts
│   ├── types.ts          # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── backend/
│   ├── app.py            # Flask API server
│   ├── requirements.txt  # Python dependencies
│   └── README.md         # Backend setup instructions
└── README.md
```

## How It Works

1. **Writing**: User writes in the diary entry form
2. **Mood Detection**: After 1 second of no typing, the text is sent to the ML backend for mood prediction
3. **UI Update**: The UI dynamically changes colors based on the predicted mood
4. **Quote Display**: An inspirational quote matching the mood is displayed
5. **Storage**: Entries are saved to localStorage with the detected mood
6. **Streak Tracking**: The app automatically tracks consecutive days of entries

## ML Model Integration

The app uses a Flask backend that loads your trained SVM (LinearSVC) model and TF-IDF vectorizer. The model processes text using the same preprocessing steps used during training:

1. Text cleaning (lowercase, remove URLs, special characters)
2. Stopword removal
3. TF-IDF vectorization
4. SVM prediction

## Future Enhancements

- Data visualization for mood trends over time
- Export entries to PDF/JSON
- Cloud synchronization
- Multi-language support
- Mood analytics dashboard

## License

MIT

