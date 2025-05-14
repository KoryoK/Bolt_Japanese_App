import { useState, useEffect, useCallback } from 'react';
import { AppSettings, NotificationSettings } from '../types';
import { getSettings, saveSettings, DEFAULT_SETTINGS } from '../utils/storage';

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from storage
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const savedSettings = await getSettings();
      setSettings(savedSettings);
      setError(null);
    } catch (err) {
      setError('Failed to load app settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update notification settings
  const updateNotificationSettings = useCallback(async (notificationSettings: NotificationSettings) => {
    try {
      const updatedSettings = {
        ...settings,
        notifications: notificationSettings,
      };
      
      await saveSettings(updatedSettings);
      setSettings(updatedSettings);
    } catch (err) {
      setError('Failed to update notification settings');
      console.error(err);
    }
  }, [settings]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(async () => {
    try {
      const updatedSettings = {
        ...settings,
        darkMode: !settings.darkMode,
      };
      
      await saveSettings(updatedSettings);
      setSettings(updatedSettings);
    } catch (err) {
      setError('Failed to toggle dark mode');
      console.error(err);
    }
  }, [settings]);

  // Reset settings to default
  const resetSettings = useCallback(async () => {
    try {
      await saveSettings(DEFAULT_SETTINGS);
      setSettings(DEFAULT_SETTINGS);
    } catch (err) {
      setError('Failed to reset settings');
      console.error(err);
    }
  }, []);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    error,
    updateNotificationSettings,
    toggleDarkMode,
    resetSettings,
  };
}