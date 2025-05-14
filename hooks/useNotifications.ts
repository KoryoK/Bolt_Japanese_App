import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NotificationSettings, VocabularyWord } from '../types';
import { 
  configureNotifications, 
  scheduleReviewNotification,
  handleNotificationResponse 
} from '../utils/notifications';
import { getSettings, saveSettings } from '../utils/storage';

export function useNotifications(words: VocabularyWord[] = []) {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    interval: 60,
    focusOnDifficult: true,
  });

  // Initialize notifications
  const initialize = useCallback(async () => {
    if (Platform.OS === 'web') {
      return;
    }
    
    const hasPermission = await configureNotifications();
    setIsPermissionGranted(hasPermission);
    
    // Load notification settings
    const appSettings = await getSettings();
    setSettings(appSettings.notifications);
    
    // Schedule initial notification if enabled
    if (hasPermission && appSettings.notifications.enabled && words.length > 0) {
      await scheduleReviewNotification(appSettings.notifications, words);
    }
  }, [words]);

  // Update notification settings
  const updateSettings = useCallback(async (newSettings: NotificationSettings) => {
    try {
      const appSettings = await getSettings();
      const updatedSettings = {
        ...appSettings,
        notifications: newSettings,
      };
      
      await saveSettings(updatedSettings);
      setSettings(newSettings);
      
      // Update scheduled notifications based on new settings
      if (isPermissionGranted && words.length > 0) {
        if (newSettings.enabled) {
          await scheduleReviewNotification(newSettings, words);
        } else {
          await Notifications.cancelAllScheduledNotificationsAsync();
        }
      }
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  }, [isPermissionGranted, words]);

  // Set up notification response handler
  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }
    
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const wordId = handleNotificationResponse(response);
      // This wordId can be used to navigate to the specific word
      console.log('Notification clicked for word:', wordId);
    });
    
    return () => subscription.remove();
  }, []);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Update notifications when words change
  useEffect(() => {
    if (isPermissionGranted && settings.enabled && words.length > 0) {
      scheduleReviewNotification(settings, words);
    }
  }, [isPermissionGranted, settings, words]);

  return {
    isPermissionGranted,
    settings,
    updateSettings,
  };
}