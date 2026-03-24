import { Mood, MoodInfo, MoodPalette } from '../types';

const createPalette = (palette: MoodPalette): MoodPalette => palette;

export const MOODS: Record<number, MoodInfo> = {
  0: {
    id: 0,
    name: 'Sadness',
    emoji: '😢',
    palettes: {
      corrective: createPalette({
        primary: '#C6BE9B',
        secondary: '#CC9DDF',
        accent: '#FDFDF9',
        background: '#FDFDF9',
        text: '#4A443A',
        button: '#A582C9',
      }),
      associative: createPalette({
        primary: '#B8C6C7',
        secondary: '#D5E1E6',
        accent: '#EEF4F6',
        background: '#FFFFFF',
        text: '#333333',
        button: '#8FA2A5',
      }),
    },
  },
  1: {
    id: 1,
    name: 'Joy',
    emoji: '😊',
    palettes: {
      corrective: createPalette({
        primary: '#C6BE9B',
        secondary: '#FEF1EF',
        accent: '#FFFFFF',
        background: '#FFFFFF',
        text: '#5B5A53',
        button: '#B8A97C',
      }),
      associative: createPalette({
        primary: '#EC8589',
        secondary: '#F1DEE3',
        accent: '#FCE9ED',
        background: '#FFFFFF',
        text: '#333333',
        button: '#D95D69',
      }),
    },
  },
  2: {
    id: 2,
    name: 'Love',
    emoji: '❤️',
    palettes: {
      corrective: createPalette({
        primary: '#FCA185',
        secondary: '#FEF1EF',
        accent: '#FFFFFF',
        background: '#FFFFFF',
        text: '#7A5C58',
        button: '#E8865F',
      }),
      associative: createPalette({
        primary: '#CE7F81',
        secondary: '#E6B700',
        accent: '#F7D6A5',
        background: '#FFFFFF',
        text: '#333333',
        button: '#B76365',
      }),
    },
  },
  3: {
    id: 3,
    name: 'Anger',
    emoji: '😠',
    palettes: {
      corrective: createPalette({
        primary: '#CC9DDF',
        secondary: '#C6BE9B',
        accent: '#FFFFFF',
        background: '#FFFFFF',
        text: '#333333',
        button: '#A582C9',
      }),
      associative: createPalette({
        primary: '#6E6364',
        secondary: '#B7B1B4',
        accent: '#2D2728',
        background: '#1A1A1A',
        text: '#E0E0E0',
        button: '#8A7F80',
      }),
    },
  },
  4: {
    id: 4,
    name: 'Fear',
    emoji: '😨',
    palettes: {
      corrective: createPalette({
        primary: '#ACDAFC',
        secondary: '#ACAFEC',
        accent: '#FFFFFF',
        background: '#FFFFFF',
        text: '#2A3A4A',
        button: '#7FC5E8',
      }),
      associative: createPalette({
        primary: '#B8C6C7',
        secondary: '#F93E3F',
        accent: '#F7D8D9',
        background: '#FFFFFF',
        text: '#333333',
        button: '#9BA8AA',
      }),
    },
  },
  5: {
    id: 5,
    name: 'Surprise',
    emoji: '😲',
    palettes: {
      corrective: createPalette({
        primary: '#CBC434',
        secondary: '#C4C46C',
        accent: '#FAFAF5',
        background: '#FAFAF5',
        text: '#44442A',
        button: '#A8A826',
      }),
      associative: createPalette({
        primary: '#FCB4CF',
        secondary: '#E6B700',
        accent: '#FFF0F8',
        background: '#FFFFFF',
        text: '#333333',
        button: '#E27AA8',
      }),
    },
  },
};

export const getMoodPalette = (mood: Mood | null, type: 'corrective' | 'associative') => {
  if (mood === null) return null;
  return MOODS[mood].palettes[type];
};

