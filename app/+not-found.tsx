import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Colors } from '@/constants/theme';

export default function NotFoundScreen() {
  const { settings } = useAppSettings();
  const isDarkMode = settings?.darkMode || false;
  const textColor = isDarkMode ? Colors.darkText : Colors.text;

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={[
        styles.container,
        { backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background }
      ]}>
        <Text style={[styles.text, { color: textColor }]}>
          This screen doesn't exist.
        </Text>
        <Link href="/" style={[styles.link, { color: isDarkMode ? Colors.primaryLight : Colors.primary }]}>
          <Text style={{ color: isDarkMode ? Colors.primaryLight : Colors.primary }}>
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});