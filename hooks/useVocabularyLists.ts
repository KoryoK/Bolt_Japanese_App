import { useState, useEffect, useCallback } from 'react';
import { VocabularyList } from '../types';
import { getLists, saveLists } from '../utils/storage';

export function useVocabularyLists() {
  const [lists, setLists] = useState<VocabularyList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load lists from storage
  const loadLists = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedLists = await getLists();
      setLists(fetchedLists);
      setError(null);
    } catch (err) {
      setError('Failed to load vocabulary lists');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new list
  const createList = useCallback(async (name: string, description?: string) => {
    try {
      const newList: VocabularyList = {
        id: Date.now().toString(),
        name,
        description,
        createdAt: Date.now(),
        totalWords: 0,
      };
      
      const updatedLists = [...lists, newList];
      await saveLists(updatedLists);
      setLists(updatedLists);
      return newList.id;
    } catch (err) {
      setError('Failed to create vocabulary list');
      console.error(err);
      return null;
    }
  }, [lists]);

  // Update a list
  const updateList = useCallback(async (updatedList: VocabularyList) => {
    try {
      const updatedLists = lists.map(list => 
        list.id === updatedList.id ? updatedList : list
      );
      await saveLists(updatedLists);
      setLists(updatedLists);
    } catch (err) {
      setError('Failed to update vocabulary list');
      console.error(err);
    }
  }, [lists]);

  // Delete a list
  const deleteList = useCallback(async (listId: string) => {
    try {
      const updatedLists = lists.filter(list => list.id !== listId);
      await saveLists(updatedLists);
      setLists(updatedLists);
    } catch (err) {
      setError('Failed to delete vocabulary list');
      console.error(err);
    }
  }, [lists]);

  // Update word count for a list
  const updateWordCount = useCallback(async (listId: string, totalWords: number) => {
    try {
      const listToUpdate = lists.find(list => list.id === listId);
      if (listToUpdate) {
        const updatedList = { ...listToUpdate, totalWords };
        const updatedLists = lists.map(list => 
          list.id === listId ? updatedList : list
        );
        await saveLists(updatedLists);
        setLists(updatedLists);
      }
    } catch (err) {
      setError('Failed to update word count');
      console.error(err);
    }
  }, [lists]);

  // Load lists on component mount
  useEffect(() => {
    loadLists();
  }, [loadLists]);

  return {
    lists,
    loading,
    error,
    loadLists,
    createList,
    updateList,
    deleteList,
    updateWordCount,
  };
}