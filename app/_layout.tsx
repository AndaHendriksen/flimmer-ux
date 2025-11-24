import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

import { DarkTheme } from '@/constants/DarkTheme';
import { DefaultTheme } from '@/constants/DefaultTheme';

import '../global.css';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="challenge" options={{ headerShown: false }} />
        </Stack>
        {/* <StatusBar style="auto" /> */}
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
