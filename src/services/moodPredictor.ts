import { Mood } from '../types';

const API_BASE_URL = (import.meta.env?.VITE_API_URL as string | undefined) || 'http://localhost:5000';

/**
 * Predicts mood from text using the SVM (LinearSVC) model via backend API
 * 
 * @param text - Diary entry text to analyze
 * @returns Predicted mood (0-5)
 */
export async function predictMood(text: string): Promise<Mood> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.mood as Mood;
  } catch (error) {
    console.error('Error predicting mood from API:', error);
    // Fallback to keyword-based prediction if API is unavailable
    return fallbackPredictMood(text);
  }
}

/**
 * Fallback keyword-based mood prediction
 * Used when the ML API is unavailable
 */
function fallbackPredictMood(text: string): Mood {
  const lowerText = text.toLowerCase();
  
  // Simple keyword-based fallback
  if (lowerText.match(/\b(sad|sadness|depressed|down|upset|crying|tears|melancholy|blue)\b/)) {
    return 0; // Sadness
  }
  if (lowerText.match(/\b(angry|mad|furious|annoyed|frustrated|rage|irritated|fuming)\b/)) {
    return 3; // Anger
  }
  if (lowerText.match(/\b(afraid|fear|scared|worried|anxious|nervous|terrified|panic)\b/)) {
    return 4; // Fear
  }
  if (lowerText.match(/\b(love|adore|affection|heart|romantic|cherish|beloved|sweetheart)\b/)) {
    return 2; // Love
  }
  if (lowerText.match(/\b(surprised|shocked|amazed|wow|unexpected|astonished|stunned)\b/)) {
    return 5; // Surprise
  }
  if (lowerText.match(/\b(happy|joy|excited|glad|cheerful|amazing|wonderful|delighted|ecstatic)\b/)) {
    return 1; // Joy
  }
  
  // Default to joy if no keywords found
  return 1; // Joy as default
}

/**
 * Check if the ML API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) return false;
    const data = await response.json();
    return data.model_loaded && data.vectorizer_loaded;
  } catch (error) {
    return false;
  }
}

