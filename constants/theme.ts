/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Semantic color system for light/dark mode. Extend as needed.
// Keep keys stable for existing hooks (useThemeColor expects matching keys in both modes).
export const Colors = {
  light: {
    // Core
    background: '#FFFFFF',
    text: '#0D0F11',
    tint: '#FF7A00',
    icon: '#4A4F55',
    border: '#E4E6EA',

    // Surfaces
    surface: '#FFFFFF',
    surfaceAlt: '#F5F6F9',

    // Cards (section specific)
    bunkenCard: '#FCEFA1', // pale warm yellow
    challengesArea: '#D8C5FF', // lilac background behind horizontal list
    challengeInner: '#FFFFFF',
    moodMovement: '#FFB3AF', // pink
    moodCreative: '#E3CCFF', // purple
    moodLearning: '#C7DCFF', // light blue
    moodPranks: '#BBF7C5', // light green

    // Tabs
    tabIconDefault: '#8A8F96',
    tabIconSelected: '#FF7A00',
  },
  dark: {
    background: '#121315',
    text: '#F3F5F6',
    tint: '#FF9A33',
    icon: '#C2C7CC',
    border: '#2A2D31',

    surface: '#1C1E21',
    surfaceAlt: '#25282C',

    bunkenCard: '#5B4F12',
    challengesArea: '#3F2F63',
    challengeInner: '#25282C',
    moodMovement: '#5A2F2D',
    moodCreative: '#4C3963',
    moodLearning: '#233A55',
    moodPranks: '#1F5130',

    tabIconDefault: '#7A8087',
    tabIconSelected: '#FF9A33',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export type AppColorName = keyof typeof Colors.light & keyof typeof Colors.dark;
