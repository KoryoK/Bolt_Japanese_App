import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  NotoSansJP_400Regular,
  NotoSansJP_700Bold,
} from '@expo-google-fonts/noto-sans-jp';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useAppSettings } from '@/hooks/useAppSettings';

export default function RootLayout() {
  useFrameworkReady();
  const { settings } = useAppSettings();
  const isDarkMode = settings?.darkMode || false;

  const [fontsLoaded, fontError] = useFonts({
    'NotoSansJP-Regular': NotoSansJP_400Regular,
    'NotoSansJP-Bold': NotoSansJP_700Bold,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // Prevent rendering until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: {
          backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background,
        },
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="list-detail" options={{ presentation: 'modal' }} />
        <Stack.Screen name="add-word" options={{ presentation: 'modal' }} />
        <Stack.Screen name="edit-word" options={{ presentation: 'modal' }} />
        <Stack.Screen name="word-detail" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </>
  );
}