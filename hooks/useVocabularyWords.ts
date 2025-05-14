import { useState, useEffect, useCallback } from 'react';
import { VocabularyWord, DifficultyLevel } from '../types';
import { getWords, saveWords, getWordsByListId } from '../utils/storage';
import { updateWordAfterReview } from '../utils/spaced-repetition';

export function useVocabularyWords(listId?: string) {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load words from storage
  const loadWords = useCallback(async () => {
    try {
      setLoading(true);
      let fetchedWords: VocabularyWord[];
      
      if (listId) {
        fetchedWords = await getWordsByListId(listId);
      } else {
        fetchedWords = await getWords();
      }
      
      setWords(fetchedWords);
      setError(null);
    } catch (err) {
      setError('Failed to load vocabulary words');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [listId]);

  // Add a new word
  const addWord = useCallback(async (
    listId: string,
    japanese: string,
    english: string,
    difficulty: DifficultyLevel,
    notes?: string
  ) => {
    try {
      const allWords = await getWords();
      
      const newWord: VocabularyWord = {
        id: Date.now().toString(),
        listId,
        japanese,
        english,
        notes,
        difficulty,
        reviewCount: 0,
      };
      
      const updatedWords = [...allWords, newWord];
      await saveWords(updatedWords);
      
      // Update the local state if this hook is specific to the list
      if (listId === newWord.listId || !listId) {
        setWords(prev => [...prev, newWord]);
      }
      
      return newWord.id;
    } catch (err) {
      setError('Failed to add vocabulary word');
      console.error(err);
      return null;
    }
  }, [listId]);

  // Update a word
  const updateWord = useCallback(async (updatedWord: VocabularyWord) => {
    try {
      const allWords = await getWords();
      const updatedWords = allWords.map(word => 
        word.id === updatedWord.id ? updatedWord : word
      );
      
      await saveWords(updatedWords);
      
      // Update the local state if this hook is for all words or for the specific list
      if (!listId || listId === updatedWord.listId) {
        setWords(prev => prev.map(word => 
          word.id === updatedWord.id ? updatedWord : word
        ));
      }
    } catch (err) {
      setError('Failed to update vocabulary word');
      console.error(err);
    }
  }, [listId]);

  // Delete a word
  const deleteWord = useCallback(async (wordId: string) => {
    try {
      const allWords = await getWords();
      const updatedWords = allWords.filter(word => word.id !== wordId);
      
      await saveWords(updatedWords);
      setWords(prev => prev.filter(word => word.id !== wordId));
    } catch (err) {
      setError('Failed to delete vocabulary word');
      console.error(err);
    }
  }, []);

  // Review a word and update its difficulty
  const reviewWord = useCallback(async (
    wordId: string,
    newDifficulty: DifficultyLevel
  ) => {
    try {
      const allWords = await getWords();
      const wordToUpdate = allWords.find(word => word.id === wordId);
      
      if (wordToUpdate) {
        const updatedWord = updateWordAfterReview(wordToUpdate, newDifficulty);
        const updatedWords = allWords.map(word => 
          word.id === wordId ? updatedWord : word
        );
        
        await saveWords(updatedWords);
        
        // Update the local state if this hook is for all words or for the specific list
        if (!listId || listId === updatedWord.listId) {
          setWords(prev => prev.map(word => 
            word.id === wordId ? updatedWord : word
          ));
        }
      }
    } catch (err) {
      setError('Failed to review vocabulary word');
      console.error(err);
    }
  }, [listId]);

  // Load words on component mount
  useEffect(() => {
    loadWords();
  }, [loadWords]);

  return {
    words,
    loading,
    error,
    loadWords,
    addWord,
    updateWord,
    deleteWord,
    reviewWord,
  };
}