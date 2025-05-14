import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationSettings, VocabularyWord } from '../types';
import { getDifficultWords } from './spaced-repetition';

// Configure notifications
export const configureNotifications = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    console.log('Notifications not supported on web');
    return false;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// Schedule vocabulary review notification
export const scheduleReviewNotification = async (
  settings: NotificationSettings,
  words: VocabularyWord[]
): Promise<void> => {
  if (Platform.OS === 'web') {
    console.log('Notifications not supported on web');
    return;
  }

  if (!settings.enabled || words.length === 0) {
    return;
  }

  // Cancel any existing notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Get words for notification
  let wordsForNotification = words;
  if (settings.focusOnDifficult) {
    const difficultWords = getDifficultWords(words);
    if (difficultWords.length > 0) {
      wordsForNotification = difficultWords;
    }
  }

  // Pick a random word
  const randomWord = wordsForNotification[Math.floor(Math.random() * wordsForNotification.length)];

  // Schedule notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to review your Japanese vocabulary!',
      body: `What does "${randomWord.japanese}" mean?`,
      data: { wordId: randomWord.id },
    },
    trigger: {
      seconds: settings.interval * 60, // Convert minutes to seconds
      repeats: true,
    },
  });
};

// Handle notification response (when user taps on notification)
export const handleNotificationResponse = (response: Notifications.NotificationResponse): string | null => {
  const data = response.notification.request.content.data;
  return data?.wordId ? String(data.wordId) : null;
};