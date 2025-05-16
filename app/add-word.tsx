import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Colors, Spacing, Typography, CommonStyles } from '@/constants/theme';
import { Button } from '@/components/Button';
import { DifficultySelector } from '@/components/DifficultySelector';
import { useVocabularyLists } from '@/hooks/useVocabularyLists';
import { useVocabularyWords } from '@/hooks/useVocabularyWords';
import { useAppSettings } from '@/hooks/useAppSettings';
import { DifficultyLevel } from '@/types';

export default function AddWordScreen() {
  const router = useRouter();
  const { listId } = useLocalSearchParams();
  const selectedListId = typeof listId === 'string' ? listId : '';
  
  const { lists, updateWordCount } = useVocabularyLists();
  const { addWord } = useVocabularyWords();
  const { settings } = useAppSettings();
  const isDarkMode = settings?.darkMode || false;
  
  const [japanese, setJapanese] = useState('');
  const [english, setEnglish] = useState('');
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const containerStyle = isDarkMode ? CommonStyles.darkContainer : CommonStyles.container;
  const textColor = isDarkMode ? Colors.darkText : Colors.text;
  const secondaryTextColor = isDarkMode ? Colors.darkTextSecondary : Colors.textSecondary;
  
  const selectedList = lists.find(list => list.id === selectedListId);
  
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
      
      // Update word count for the list
      if (selectedList) {
        await updateWordCount(selectedListId, selectedList.totalWords + 1);
      }
      
      // Success and go back
      router.back();
    } catch (error) {
      console.error('Failed to add word:', error);
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={containerStyle}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color={textColor} />
              </TouchableOpacity>
              <Text style={[styles.title, { color: textColor }]}>Add New Word</Text>
              <View style={{ width: 24 }} />
            </View>
            
            {selectedList && (
              <View style={[styles.selectedListBanner, { backgroundColor: isDarkMode ? Colors.primaryDark : Colors.primaryLight }]}>
                <Text style={styles.selectedListText}>Adding to: {selectedList.name}</Text>
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
                  returnKeyType="next"
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
                  returnKeyType="next"
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
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
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
              
              <View style={styles.buttonRow}>
                <Button
                  title="Cancel"
                  onPress={() => router.back()}
                  variant="outline"
                  style={styles.button}
                  darkMode={isDarkMode}
                />
                <Button
                  title="Save Word"
                  onPress={handleAddWord}
                  disabled={!japanese.trim() || !english.trim() || isSaving}
                  loading={isSaving}
                  style={styles.button}
                  darkMode={isDarkMode}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
    ...Typography.title2,
  },
  selectedListBanner: {
    padding: Spacing.m,
    marginHorizontal: Spacing.m,
    marginBottom: Spacing.m,
    borderRadius: 8,
  },
  selectedListText: {
    ...Typography.subhead,
    color: '#FFFFFF',
    textAlign: 'center',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.m,
  },
  button: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
});