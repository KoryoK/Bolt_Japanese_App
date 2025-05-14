import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Search, BookOpenCheck, X } from 'lucide-react-native';
import { Colors, Spacing, Typography, CommonStyles } from '@/constants/theme';
import { VocabularyListCard } from '@/components/VocabularyListCard';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { useVocabularyLists } from '@/hooks/useVocabularyLists';
import { useAppSettings } from '@/hooks/useAppSettings';

export default function VocabularyListsScreen() {
  const router = useRouter();
  const { lists, loading } = useVocabularyLists();
  const { settings } = useAppSettings();
  const isDarkMode = settings?.darkMode || false;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  
  const containerStyle = isDarkMode ? CommonStyles.darkContainer : CommonStyles.container;
  const textColor = isDarkMode ? Colors.darkText : Colors.text;
  const secondaryTextColor = isDarkMode ? Colors.darkTextSecondary : Colors.textSecondary;
  
  const filteredLists = lists.filter(list => 
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleOpenList = (listId: string) => {
    router.push(`/list-detail?id=${listId}`);
  };
  
  const handleCreateList = async () => {
    if (newListName.trim() === '') return;
    
    const { createList } = useVocabularyLists();
    const listId = await createList(newListName.trim(), newListDescription.trim() || undefined);
    
    if (listId) {
      setNewListName('');
      setNewListDescription('');
      setIsAddingList(false);
      router.push(`/list-detail?id=${listId}`);
    }
  };

  return (
    <SafeAreaView style={containerStyle}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Vocabulary Lists</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: isDarkMode ? Colors.primaryDark : Colors.primary }]}
          onPress={() => setIsAddingList(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: isDarkMode ? Colors.darkCard : Colors.card }]}>
        <Search size={20} color={secondaryTextColor} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search lists..."
          placeholderTextColor={secondaryTextColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <X size={20} color={secondaryTextColor} />
          </TouchableOpacity>
        )}
      </View>
      
      {isAddingList ? (
        <View style={[styles.addListContainer, { backgroundColor: isDarkMode ? Colors.darkCard : Colors.card }]}>
          <Text style={[styles.addListTitle, { color: textColor }]}>Create New List</Text>
          
          <TextInput
            style={[styles.input, { 
              color: textColor,
              backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background,
              borderColor: isDarkMode ? Colors.darkBorder : Colors.border,
            }]}
            placeholder="List name"
            placeholderTextColor={secondaryTextColor}
            value={newListName}
            onChangeText={setNewListName}
          />
          
          <TextInput
            style={[styles.input, { 
              color: textColor,
              backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background,
              borderColor: isDarkMode ? Colors.darkBorder : Colors.border,
              height: 100,
              textAlignVertical: 'top',
            }]}
            placeholder="Description (optional)"
            placeholderTextColor={secondaryTextColor}
            value={newListDescription}
            onChangeText={setNewListDescription}
            multiline
          />
          
          <View style={styles.buttonRow}>
            <Button
              title="Cancel"
              onPress={() => {
                setIsAddingList(false);
                setNewListName('');
                setNewListDescription('');
              }}
              variant="outline"
              style={styles.buttonSpacing}
              darkMode={isDarkMode}
            />
            <Button
              title="Create"
              onPress={handleCreateList}
              disabled={newListName.trim() === ''}
              style={styles.buttonSpacing}
              darkMode={isDarkMode}
            />
          </View>
        </View>
      ) : lists.length === 0 ? (
        <EmptyState
          title="No Vocabulary Lists Yet"
          description="Create your first vocabulary list to start learning Japanese."
          buttonTitle="Create List"
          onButtonPress={() => setIsAddingList(true)}
          icon={<BookOpenCheck size={48} color={isDarkMode ? Colors.primaryLight : Colors.primary} />}
          darkMode={isDarkMode}
        />
      ) : (
        <FlatList
          data={filteredLists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VocabularyListCard 
              list={item} 
              darkMode={isDarkMode}
              onPress={() => handleOpenList(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            searchQuery !== '' ? (
              <EmptyState
                title="No Matching Lists"
                description={`No lists match "${searchQuery}"`}
                buttonTitle="Clear Search"
                onButtonPress={() => setSearchQuery('')}
                darkMode={isDarkMode}
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.m,
  },
  title: {
    ...Typography.largeTitle,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.m,
    marginBottom: Spacing.m,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: Spacing.s,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
  },
  listContent: {
    paddingBottom: Spacing.l,
  },
  addListContainer: {
    margin: Spacing.m,
    padding: Spacing.m,
    borderRadius: 12,
  },
  addListTitle: {
    ...Typography.title3,
    marginBottom: Spacing.m,
  },
  input: {
    ...Typography.body,
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.m,
    marginBottom: Spacing.m,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonSpacing: {
    marginLeft: Spacing.s,
    minWidth: 100,
  },
});