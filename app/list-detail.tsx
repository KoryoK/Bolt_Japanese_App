import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Plus, CreditCard as Edit, Trash, MoveVertical as MoreVertical, Search, X } from 'lucide-react-native';
import { Colors, Spacing, Typography, CommonStyles } from '@/constants/theme';
import { Button } from '@/components/Button';
import { WordCard } from '@/components/WordCard';
import { EmptyState } from '@/components/EmptyState';
import { useVocabularyLists } from '@/hooks/useVocabularyLists';
import { useVocabularyWords } from '@/hooks/useVocabularyWords';
import { useAppSettings } from '@/hooks/useAppSettings';

export default function ListDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const listId = typeof id === 'string' ? id : '';
  
  const { lists } = useVocabularyLists();
  const { words, loading, deleteWord } = useVocabularyWords(listId);
  const { settings } = useAppSettings();
  const isDarkMode = settings?.darkMode || false;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isEditingList, setIsEditingList] = useState(false);
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');
  
  const list = lists.find(item => item.id === listId);
  
  const filteredWords = words.filter(word => 
    word.japanese.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.english.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const containerStyle = isDarkMode ? CommonStyles.darkContainer : CommonStyles.container;
  const textColor = isDarkMode ? Colors.darkText : Colors.text;
  const secondaryTextColor = isDarkMode ? Colors.darkTextSecondary : Colors.textSecondary;
  
  useEffect(() => {
    if (list) {
      setListName(list.name);
      setListDescription(list.description || '');
    }
  }, [list]);
  
  const handleDeleteList = () => {
    const confirmDelete = () => {
      const { deleteList } = useVocabularyLists();
      deleteList(listId);
      router.back();
    };
    
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete this list and all its words?')) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        'Delete List',
        'Are you sure you want to delete this list and all its words?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  };
  
  const handleDeleteWord = (wordId: string) => {
    const confirmDelete = () => {
      deleteWord(wordId);
    };
    
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete this word?')) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        'Delete Word',
        'Are you sure you want to delete this word?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  };
  
  const handleEditWord = (wordId: string) => {
    router.push(`/edit-word?id=${wordId}&listId=${listId}`);
  };
  
  const handleAddWord = () => {
    router.push(`/add-word?listId=${listId}`);
  };
  
  const updateList = () => {
    if (listName.trim() === '') return;
    
    const { updateList } = useVocabularyLists();
    if (list) {
      updateList({
        ...list,
        name: listName.trim(),
        description: listDescription.trim() || undefined,
      });
    }
    
    setIsEditingList(false);
  };

  if (!list) {
    return (
      <SafeAreaView style={containerStyle}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: textColor }]}>List Not Found</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: textColor }]}>
            The vocabulary list you're looking for doesn't exist.
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            darkMode={isDarkMode}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyle}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={textColor} />
        </TouchableOpacity>
        
        {isEditingList ? (
          <TextInput
            style={[styles.editTitleInput, { color: textColor }]}
            value={listName}
            onChangeText={setListName}
            autoFocus
          />
        ) : (
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {list.name}
          </Text>
        )}
        
        <TouchableOpacity onPress={() => setShowOptionsMenu(!showOptionsMenu)}>
          <MoreVertical size={24} color={textColor} />
        </TouchableOpacity>
      </View>
      
      {showOptionsMenu && (
        <View style={[styles.optionsMenu, { 
          backgroundColor: isDarkMode ? Colors.darkCard : Colors.card,
          borderColor: isDarkMode ? Colors.darkBorder : Colors.border,
        }]}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              setShowOptionsMenu(false);
              setIsEditingList(true);
            }}
          >
            <Edit size={20} color={textColor} />
            <Text style={[styles.optionText, { color: textColor }]}>Edit List</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              setShowOptionsMenu(false);
              handleDeleteList();
            }}
          >
            <Trash size={20} color={Colors.error} />
            <Text style={[styles.optionText, { color: Colors.error }]}>Delete List</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {isEditingList ? (
        <View style={[styles.editListContainer, { backgroundColor: isDarkMode ? Colors.darkCard : Colors.card }]}>
          <TextInput
            style={[styles.descriptionInput, { 
              color: textColor,
              backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background,
              borderColor: isDarkMode ? Colors.darkBorder : Colors.border,
              textAlignVertical: 'top',
            }]}
            placeholder="Description (optional)"
            placeholderTextColor={secondaryTextColor}
            value={listDescription}
            onChangeText={setListDescription}
            multiline
          />
          
          <View style={styles.buttonRow}>
            <Button
              title="Cancel"
              onPress={() => {
                setIsEditingList(false);
                if (list) {
                  setListName(list.name);
                  setListDescription(list.description || '');
                }
              }}
              variant="outline"
              style={styles.buttonSpacing}
              darkMode={isDarkMode}
            />
            <Button
              title="Save"
              onPress={updateList}
              disabled={listName.trim() === ''}
              style={styles.buttonSpacing}
              darkMode={isDarkMode}
            />
          </View>
        </View>
      ) : list.description ? (
        <View style={styles.descriptionContainer}>
          <Text style={[styles.description, { color: secondaryTextColor }]}>
            {list.description}
          </Text>
        </View>
      ) : null}
      
      <View style={[styles.searchContainer, { backgroundColor: isDarkMode ? Colors.darkCard : Colors.card }]}>
        <Search size={20} color={secondaryTextColor} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search words..."
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
      
      <View style={styles.statsRow}>
        <Text style={[styles.statsText, { color: secondaryTextColor }]}>
          {list.totalWords} {list.totalWords === 1 ? 'word' : 'words'}
        </Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: isDarkMode ? Colors.primaryDark : Colors.primary }]}
          onPress={handleAddWord}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Word</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDarkMode ? Colors.primaryLight : Colors.primary} />
        </View>
      ) : words.length === 0 ? (
        <EmptyState
          title="No Words in This List"
          description="Add your first word to start learning."
          buttonTitle="Add Word"
          onButtonPress={handleAddWord}
          darkMode={isDarkMode}
        />
      ) : (
        <FlatList
          data={filteredWords}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WordCard
              word={item}
              darkMode={isDarkMode}
              onEdit={() => handleEditWord(item.id)}
              onDelete={() => handleDeleteWord(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            searchQuery !== '' ? (
              <EmptyState
                title="No Matching Words"
                description={`No words match "${searchQuery}"`}
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
    ...Typography.title2,
    flex: 1,
    textAlign: 'center',
  },
  editTitleInput: {
    ...Typography.title2,
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: Spacing.s,
  },
  optionsMenu: {
    position: 'absolute',
    top: 60,
    right: Spacing.m,
    borderRadius: 8,
    borderWidth: 1,
    padding: Spacing.s,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.s,
  },
  optionText: {
    ...Typography.subhead,
    marginLeft: Spacing.s,
  },
  descriptionContainer: {
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.m,
  },
  description: {
    ...Typography.body,
  },
  editListContainer: {
    margin: Spacing.m,
    padding: Spacing.m,
    borderRadius: 12,
  },
  descriptionInput: {
    ...Typography.body,
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.m,
    height: 100,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    marginBottom: Spacing.m,
  },
  statsText: {
    ...Typography.subhead,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: 20,
  },
  addButtonText: {
    ...Typography.subhead,
    color: '#FFFFFF',
    marginLeft: Spacing.xs,
  },
  listContent: {
    paddingBottom: Spacing.l,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  notFoundText: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.l,
  },
});