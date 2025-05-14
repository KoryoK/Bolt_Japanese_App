import { VocabularyWord, DifficultyLevel } from '../types';
import dayjs from 'dayjs';

// Define intervals based on difficulty (in days)
const INTERVALS = {
  easy: [1, 3, 7, 14, 30, 60, 120, 240],
  medium: [1, 2, 5, 10, 21, 45, 90, 180],
  hard: [1, 1, 3, 7, 14, 30, 60, 120],
};

/**
 * Calculate the next review date based on difficulty and review count
 */
export const calculateNextReview = (
  difficulty: DifficultyLevel,
  reviewCount: number
): number => {
  const intervals = INTERVALS[difficulty];
  const intervalIndex = Math.min(reviewCount, intervals.length - 1);
  const daysToAdd = intervals[intervalIndex];
  
  return dayjs().add(daysToAdd, 'day').valueOf();
};

/**
 * Update word after review based on new difficulty
 */
export const updateWordAfterReview = (
  word: VocabularyWord,
  newDifficulty: DifficultyLevel
): VocabularyWord => {
  const currentTime = Date.now();
  const newReviewCount = word.reviewCount + 1;
  
  return {
    ...word,
    difficulty: newDifficulty,
    lastStudied: currentTime,
    nextReview: calculateNextReview(newDifficulty, newReviewCount),
    reviewCount: newReviewCount,
  };
};

/**
 * Get words due for review
 */
export const getWordsForReview = (words: VocabularyWord[]): VocabularyWord[] => {
  const currentTime = Date.now();
  return words.filter(word => 
    !word.nextReview || word.nextReview <= currentTime
  );
};

/**
 * Get difficult words (those marked as 'hard')
 */
export const getDifficultWords = (words: VocabularyWord[]): VocabularyWord[] => {
  return words.filter(word => word.difficulty === 'hard');
};

/**
 * Sort words by priority for study (due date, difficulty)
 */
export const sortWordsByStudyPriority = (words: VocabularyWord[]): VocabularyWord[] => {
  return [...words].sort((a, b) => {
    // First sort by due date (null nextReview values come first)
    if (!a.nextReview && b.nextReview) return -1;
    if (a.nextReview && !b.nextReview) return 1;
    if (a.nextReview && b.nextReview) {
      if (a.nextReview !== b.nextReview) {
        return a.nextReview - b.nextReview;
      }
    }
    
    // Then sort by difficulty (hard > medium > easy)
    const difficultyWeight = { hard: 3, medium: 2, easy: 1 };
    return difficultyWeight[b.difficulty] - difficultyWeight[a.difficulty];
  });
};