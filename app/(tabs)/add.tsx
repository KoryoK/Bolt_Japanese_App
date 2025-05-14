import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Save, ArrowRight, Check } from 'lucide-react-native';
import { Colors, Spacing, Typography, CommonStyles } from '@/constants/theme';
import { Button } from '@/components/Button';
import { DifficultySelector } from '@/components/DifficultySelector';
import { useVocabularyLists } from '@/hooks/useVocabularyLists';
import { useVocabularyWords } from '@/hooks/useVocabularyWords';
import { useAppSettings } from '@/hooks/useAppSettings';
import { DifficultyLevel } from '@/types';

export default function AddWordScreen() {
  const router = useRouter();
  const { lists } = useVocabularyLists();
  const { addWord } = useVocabularyWords();
  const { settings } = useAppSettings();
  const isDarkMode = settings?.darkMode || false;
  
  const [japanese, setJapanese] = useState('');
  const [english, setEnglish] = useState('');
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [showListSelector, setShowListSelector] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const containerStyle = isDarkMode ? CommonStyles.darkContainer : CommonStyles.container;
  const textColor = isDarkMode ? Colors.darkText : Colors.text;
  const secondaryTextColor = isDarkMode ? Colors.darkTextSecondary : Colors.textSecondary;
  
  // Reset success message after 2 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);
  
  const handleAddWord = async () => {
    if (!japanese.trim() || !english.trim() || !selectedListId) return;
    
    setIsSaving(true);
    
    try {
      await addWord(
        selectedListId,
        japanese.trim(),
        english.trim(),
        difficulty,
        notes.trim() || undefined
      );
      
      setJapanese('');
      setEnglish('');
      setNotes('');
      setDifficulty('medium');
      setShowSuccess(true);
    } catch (error) {
      console.error('Failed to add word:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const selectedList = lists.find(list => list.id === selectedListId);

  return (
    <SafeAreaView style={containerStyle}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>Add New Word</Text>
          </View>
          
          {showSuccess && (
            <View style={[styles.successContainer, { backgroundColor: Colors.success }]}>
              <Check size={20} color="#FFFFFF" />
              <Text style={styles.successText}>Word added successfully</Text>
            </View>
          )}
          
          <View style={styles.form}>
            <View style={styles.formField}>
              <Text style={[styles.label, { color: textColor }]}>Japanese</Text>
              <TextInput
                style={[styles.input, { 
                  color: textColor,
                  backgroundColor: isDarkMode ? Colors.darkCard : Colors.background,
                  borderColor: isDarkMode ? Colors.darkBorder : Colors.border,
                }]}
                value={japanese}
                onChangeText={setJapanese}
                placeholder="Enter Japanese word"
                placeholderTextColor={secondaryTextColor}
                autoCorrect={false}
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={[styles.label, { color: textColor }]}>English</Text>
              <TextInput
                style={[styles.input, { 
                  color: textColor,
                  backgroundColor: isDarkMode ? Colors.darkCard : Colors.background,
                  borderColor: isDarkMode ? Colors.darkBorder : Colors.border,
                }]}
                value={english}
                onChangeText={setEnglish}
                placeholder="Enter English translation"
                placeholderTextColor={secondaryTextColor}
                autoCorrect={false}
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={[styles.label, { color: textColor }]}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, { 
                  color: textColor,
                  backgroundColor: isDarkMode ? Colors.darkCard : Colors.background,
                  borderColor: isDarkMode ? Colors.darkBorder : Colors.border,
                  height: 100,
                  textAlignVertical: 'top',
                }]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes, context, example sentences..."
                placeholderTextColor={secondaryTextColor}
                multiline
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={[styles.label, { color: textColor }]}>Difficulty</Text>
              <DifficultySelector
                value={difficulty}
                onChange={setDifficulty}
                darkMode={isDarkMode}
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={[styles.label, { color: textColor }]}>Vocabulary List</Text>
              {selectedList ? (
                <TouchableOpacity
                  style={[styles.listSelector, { 
                    backgroundColor: isDarkMode ? Colors.darkCard : Colors.background,
                    borderColor: isDarkMode ? Colors.darkBorder : Colors.border,
                  }]}
                  onPress={() => setShowListSelector(true)}
                >
                  <Text style={[styles.selectedListText, { color: textColor }]}>
                    {selectedList.name}
                  </Text>
                  <ArrowRight size={20} color={secondaryTextColor} />
                </TouchableOpacity>
              ) : (
                <Button
                  title="Select a List"
                  onPress={() => setShowListSelector(true)}
                  variant="outline"
                  darkMode={isDarkMode}
                />
              )}
            </View>
            
            <Button
              title="Add Word"
              onPress={handleAddWord}
              disabled={!japanese.trim() || !english.trim() || !selectedListId || isSaving}
              loading={isSaving}
              style={styles.addButton}
              darkMode={isDarkMode}
            />
          </View>
          
          {showListSelector && (
            <View style={[styles.listSelectorModal, { 
              backgroundColor: isDarkMode ? Colors.darkBackground : Colors.background,
            }]}>
              <View style={[styles.listSelectorHeader, {
                borderBottomColor: isDarkMode ? Colors.darkBorder : Colors.border,
              }]}>
                <Text style={[styles.listSelectorTitle, { color: textColor }]}>
                  Select a List
                </Text>
                <TouchableOpacity onPress={() => setShowListSelector(false)}>
                  <Text style={[styles.cancelButton, { color: Colors.primary }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView>
                {lists.length === 0 ? (
                  <View style={styles.emptyListContainer}>
                    <Text style={[styles.emptyListText, { color: secondaryTextColor }]}>
                      No vocabulary lists found.
                    </Text>
                    <Button
                      title="Create a List"
                      onPress={() => {
                        setShowListSelector(false);
                        router.push('/');
                      }}
                      style={styles.createListButton}
                      darkMode={isDarkMode}
                    />
                  </View>
                ) : (
                  lists.map(list => (
                    <TouchableOpacity
                      key={list.id}
                      style={[styles.listItem, {
                        backgroundColor: 
                          selectedListId === list.id
                            ? (isDarkMode ? Colors.primaryDark : Colors.primaryLight)
                            : 'transparent',
                        borderBottomColor: isDarkMode ? Colors.darkBorder : Colors.border,
                      }]}
                      onPress={() => {
                        setSelectedListId(list.id);
                        setShowListSelector(false);
                      }}
                    >
                      <Text style={[styles.listItemText, { 
                        color: selectedListId === list.id ? '#FFFFFF' : textColor 
                      }]}>
                        {list.name}
                      </Text>
                      {selectedListId === list.id && (
                        <Check size={20} color="#FFFFFF" />
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
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
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.m,
    marginBottom: Spacing.m,
    padding: Spacing.m,
    borderRadius: 8,
  },
  successText: {
    ...Typography.subhead,
    color: '#FFFFFF',
    marginLeft: Spacing.s,
  },
  form: {
    padding: Spacing.m,
  },
  formField: {
    marginBottom: Spacing.m,
  },
  label: {
    ...Typography.subhead,
    marginBottom: Spacing.s,
  },
  input: {
    ...Typography.body,
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.m,
  },
  addButton: {
    marginTop: Spacing.m,
  },
  listSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.m,
  },
  selectedListText: {
    ...Typography.body,
  },
  listSelectorModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  listSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.m,
    borderBottomWidth: 1,
  },
  listSelectorTitle: {
    ...Typography.title3,
  },
  cancelButton: {
    ...Typography.subhead,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.m,
    borderBottomWidth: 1,
  },
  listItemText: {
    ...Typography.body,
  },
  emptyListContainer: {
    padding: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  createListButton: {
    minWidth: 200,
  },
});