# Backend API for Smart Diary

This Flask backend provides the ML model API for mood prediction.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

**Note for Windows users**: If you encounter an error about Microsoft Visual C++ when installing scikit-learn, install it first with:
```bash
pip install scikit-learn --only-binary :all:
```
Then run `pip install -r requirements.txt` again.

2. Place your ML model files in this directory:
   - `emotion_svm_model.pkl` - The trained SVM model
   - `tfidf_vectorizer.pkl` - The TF-IDF vectorizer

3. The NLTK stopwords will be downloaded automatically on first run.

## Running the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### POST /api/predict
Predicts mood from text input.

**Request:**
```json
{
  "text": "I'm feeling really happy today!"
}
```

**Response:**
```json
{
  "mood": 1,
  "text": "I'm feeling really happy today!"
}
```

### GET /api/health
Check if the API and models are loaded correctly.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "vectorizer_loaded": true
}
```

## Environment Variables

You can set the following environment variables:
- `FLASK_ENV` - Set to `development` for debug mode
- `PORT` - Server port (default: 5000)

