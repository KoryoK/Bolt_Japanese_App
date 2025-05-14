import AsyncStorage from '@react-native-async-storage/async-storage';
import { VocabularyList, VocabularyWord, AppSettings } from '../types';

// Keys for AsyncStorage
const KEYS = {
  LISTS: 'vocabulary_lists',
  WORDS: 'vocabulary_words',
  SETTINGS: 'app_settings',
  STUDY_SESSIONS: 'study_sessions',
};

// Default app settings
export const DEFAULT_SETTINGS: AppSettings = {
  notifications: {
    enabled: true,
    interval: 60, // 1 hour by default
    focusOnDifficult: true,
  },
  darkMode: false,
};

// Save vocabulary lists
export const saveLists = async (lists: VocabularyList[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.LISTS, JSON.stringify(lists));
  } catch (error) {
    console.error('Error saving vocabulary lists:', error);
    throw error;
  }
};

// Get vocabulary lists
export const getLists = async (): Promise<VocabularyList[]> => {
  try {
    const lists = await AsyncStorage.getItem(KEYS.LISTS);
    return lists ? JSON.parse(lists) : [];
  } catch (error) {
    console.error('Error getting vocabulary lists:', error);
    return [];
  }
};

// Save vocabulary words
export const saveWords = async (words: VocabularyWord[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.WORDS, JSON.stringify(words));
  } catch (error) {
    console.error('Error saving vocabulary words:', error);
    throw error;
  }
};

// Get vocabulary words
export const getWords = async (): Promise<VocabularyWord[]> => {
  try {
    const words = await AsyncStorage.getItem(KEYS.WORDS);
    return words ? JSON.parse(words) : [];
  } catch (error) {
    console.error('Error getting vocabulary words:', error);
    return [];
  }
};

// Get words for a specific list
export const getWordsByListId = async (listId: string): Promise<VocabularyWord[]> => {
  try {
    const allWords = await getWords();
    return allWords.filter(word => word.listId === listId);
  } catch (error) {
    console.error('Error getting words by list ID:', error);
    return [];
  }
};

// Save app settings
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving app settings:', error);
    throw error;
  }
};

// Get app settings
export const getSettings = async (): Promise<AppSettings> => {
  try {
    const settings = await AsyncStorage.getItem(KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error getting app settings:', error);
    return DEFAULT_SETTINGS;
  }
};

// Clear all data (for testing or reset)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.LISTS,
      KEYS.WORDS,
      KEYS.SETTINGS,
      KEYS.STUDY_SESSIONS,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};