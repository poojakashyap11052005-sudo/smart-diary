# Quick Setup Guide

## Step 1: Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Place your .pkl files here:
# - emotion_svm_model.pkl
# - tfidf_vectorizer.pkl

# Start Flask server
python app.py
```

Backend will be available at: `http://localhost:5000`

## Step 3: Verify Setup

1. Check backend health: Visit `http://localhost:5000/api/health`
2. You should see: `{"status": "healthy", "model_loaded": true, "vectorizer_loaded": true}`

## Troubleshooting

### Backend not connecting?
- Make sure Flask server is running on port 5000
- Check browser console for CORS errors
- Verify .pkl files are in the `backend/` directory

### Model not loading?
- Ensure file names are exactly: `emotion_svm_model.pkl` and `tfidf_vectorizer.pkl`
- Check that files are in the `backend/` directory (same folder as `app.py`)
- Verify the .pkl files are valid and not corrupted

### Fallback mode?
- If backend is unavailable, the app uses keyword-based mood detection
- This works but is less accurate than the ML model
- Start the backend for full ML-powered predictions

## Environment Variables (Optional)

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:5000
```

This allows you to customize the backend URL if needed.

