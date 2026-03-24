from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import re
import nltk
from nltk.corpus import stopwords
import os
import warnings



# Suppress scikit-learn version warnings (they're harmless for pickle files)
warnings.filterwarnings('ignore', category=UserWarning, module='sklearn')

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load the saved model and vectorizer
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'emotion_svm_model.pkl')
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), 'tfidf_vectorizer.pkl')

try:
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    print("✅ Model and vectorizer loaded successfully")
except FileNotFoundError as e:
    print(f"⚠️ Warning: Model files not found: {e}")
    print("⚠️ Please place emotion_svm_model.pkl and tfidf_vectorizer.pkl in the backend/ directory")
    model = None
    vectorizer = None

# Download stopwords if not already downloaded
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    stop_words = set(stopwords.words('english'))
except LookupError:
    nltk.download('stopwords')
    stop_words = set(stopwords.words('english'))


def clean_text(text):
    """Clean the input text"""
    text = str(text).lower()
    text = re.sub(r'http\S+|www\S+', '', text)  # Remove URLs
    text = re.sub(r'[^a-z\s]', '', text)  # Remove special characters
    text = re.sub(r'\s+', ' ', text).strip()  # Remove extra spaces
    return text


def preprocess(text):
    """Preprocess text for prediction"""
    text = clean_text(text)
    tokens = [w for w in text.split() if w not in stop_words]
    return ' '.join(tokens)


def predict_emotion(text):
    """Predict emotion from text"""
    if model is None or vectorizer is None:
        raise ValueError("Model not loaded. Please ensure .pkl files are in the backend directory.")
    
    processed = preprocess(text)
    if not processed.strip():
        return 1  # Default to joy if empty after preprocessing
    
    vectorized = vectorizer.transform([processed])
    label = model.predict(vectorized)[0]
    return int(label)


@app.route('/api/predict', methods=['POST'])
def predict():
    """API endpoint to predict mood from text"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
            
        text = data.get('text', '')
        
        if not text or not text.strip():
            return jsonify({'error': 'Text is required'}), 400
        
        if model is None or vectorizer is None:
            return jsonify({
                'error': 'Model not loaded',
                'message': 'Please ensure emotion_svm_model.pkl and tfidf_vectorizer.pkl are in the backend directory'
            }), 503
        
        label = predict_emotion(text)
        return jsonify({'mood': label, 'text': text})
    
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({'error': 'Internal server error', 'message': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'vectorizer_loaded': vectorizer is not None
    })


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)

