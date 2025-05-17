export interface VocabularyList {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  totalWords: number;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface VocabularyWord {
  id: string;
  listId: string;
  japanese: string;
  english: string;
  notes?: string;
  difficulty: DifficultyLevel;
  lastStudied?: number;
  nextReview?: number;
  reviewCount: number;
}

export interface NotificationSettings {
  enabled: boolean;
  interval: number; // in minutes
  focusOnDifficult: boolean;
}

export interface AppSettings {
  notifications: NotificationSettings;
  darkMode: boolean;
}

export interface StudySession {
  id: string;
  listId: string;
  startTime: number;
  endTime?: number;
  wordsStudied: number;
  wordsCorrect: number;
}