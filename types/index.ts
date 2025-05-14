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
  interval: 30 | 60 | 1440; // in minutes (30min, 1hr, 1day)
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