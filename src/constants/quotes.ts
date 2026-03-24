import { Mood } from '../types';

export const MOOD_QUOTES: Record<Mood, string[]> = {
  0: [ // Sadness
    "It's okay to feel sad. Your emotions are valid and important.",
    "Sadness is just a visitor, not a permanent resident. This too shall pass.",
    "The darkest nights produce the brightest stars. Keep going.",
    "Your feelings are like waves - they come and go. You are the ocean.",
    "Sadness allows us to appreciate joy. This moment is part of your journey.",
  ],
  1: [ // Joy
    "Joy is not in things, it is in us. You carry it wherever you go.",
    "Happiness is a journey, not a destination. Enjoy the moment!",
    "Let your joy be uncontained. Celebrate the little victories.",
    "The best way to cheer yourself up is to try to cheer somebody else up.",
    "Joy multiplies when shared. Your positive energy is contagious!",
  ],
  2: [ // Love
    "Love yourself first, and everything else falls into line.",
    "The greatest thing you'll ever learn is just to love and be loved in return.",
    "Love is not about how much you say, but how much you do.",
    "Your capacity to love is your greatest strength.",
    "Love is the only force capable of transforming an enemy into a friend.",
  ],
  3: [ // Anger
    "Anger is an energy. Use it constructively, not destructively.",
    "It's okay to be angry, but don't let it control your actions.",
    "Anger is a signal that something needs to change. Listen to it.",
    "Take a deep breath. You have the power to choose your response.",
    "Transform your anger into motivation for positive change.",
  ],
  4: [ // Fear
    "Fear is a natural emotion. It shows you what matters to you.",
    "Courage is not the absence of fear, but action in spite of it.",
    "You are braver than you believe, stronger than you seem.",
    "Fear is temporary, but regret lasts forever. Take that step.",
    "What you fear most has no power over you. It's the fear itself that's the prison.",
  ],
  5: [ // Surprise
    "Life's surprises are its greatest gifts. Embrace the unexpected!",
    "Wonder is the beginning of wisdom. Stay curious and open.",
    "Sometimes the best moments are the ones we never saw coming.",
    "Surprise yourself with your own courage and capability.",
    "The unexpected often leads to the most beautiful destinations.",
  ],
};

export function getRandomQuote(mood: Mood): string {
  const quotes = MOOD_QUOTES[mood];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

