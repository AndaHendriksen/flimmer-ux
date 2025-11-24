import { ImageSourcePropType } from 'react-native';

// Static data for Home screen. Replace image requires with actual local assets.

export const bunkenStats = {
  count: 152,
  updatedAt: '2025-11-23T10:00:00Z',
};

export type Challenge = {
  id: string;
  title: string;
  subtitle?: string;
  image: ImageSourcePropType;
};

export const challenges: Challenge[] = [
  {
    id: 'painting',
    title: 'Kunst udfordring!',
    subtitle: 'Anda har udfordret dig',
    image: require('@/assets/images/challenge-painting.png'), // TODO: add this asset
  },
  // Add more challenges here
];

export type MoodCategory = {
  id: string;
  label: string;
  image: ImageSourcePropType;
  colorLight: string;
  colorDark: string;
};

export const moodCategories: MoodCategory[] = [
  {
    id: 'movement',
    label: 'Bevægelse',
    image: require('@/assets/images/mood-movement.png'), // TODO: add this asset
    colorLight: '#FFB3AF',
    colorDark: '#5A2F2D',
  },
  {
    id: 'creative',
    label: 'Krea og byg',
    image: require('@/assets/images/mood-creative.png'), // TODO: add this asset
    colorLight: '#E3CCFF',
    colorDark: '#4C3963',
  },
  {
    id: 'learning',
    label: 'Læring, quiz og gæt',
    image: require('@/assets/images/mood-learning.png'), // TODO: add this asset
    colorLight: '#C7DCFF',
    colorDark: '#233A55',
  },
  // {
  //   id: 'pranks',
  //   label: 'Pranks og sjov',
  //   image: require('@/assets/images/mood-pranks.png'), // TODO: add this asset
  //   colorLight: '#BBF7C5',
  //   colorDark: '#1F5130',
  // },
];
