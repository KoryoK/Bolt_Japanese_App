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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors, Spacing, Typography, CommonStyles } from '@/constants/theme';
import { Button } from '@/components/Button';
import { DifficultySelector } from '@/components/DifficultySelector';
import { useVocabularyWords } from '@/hooks/useVocabularyWords';
import { useAppSettings } from '@/hooks/useAppSettings';
import { DifficultyLevel } from '@/types';

export default function EditWordScreen() {
  const router = useRouter();
  const { id, listId } = useLocalSearchParams();
  const wordId = typeof id === 'string' ? id : '';
  const selectedListId = typeof listId === 'string' ? listId : '';
  
  const { words, updateWord } = useVocabularyWords(selectedListId);
  const { settings } = useAppSettings();
  const isDarkMode = settings?.darkMode || false;
  
  const [japanese, setJapanese] = useState('');
  const [english, setEnglish] = useState('');
  const [notes, setNotes] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [isSaving, setIsSaving] = useState(false);
  
  const containerStyle = isDarkMode ? CommonStyles.darkContainer : CommonStyles.container;
  const textColor = isDarkMode ? Colors.darkText : Colors.text;
  const secondaryTextColor = isDarkMode ? Colors.darkTextSecondary : Colors.textSecondary;
  
  const word = words.find(item => item.id === wordId);
  
  // Load word data
  useEffect(() => {
    if (word) {
      setJapanese(word.japanese);
      setEnglish(word.english);
      setNotes(word.notes || '');
      setDifficulty(word.difficulty);
    }
  }, [word]);
  
  const handleSaveWord = async () => {
    if (!japanese.trim() || !english.trim() || !word) return;
    
    setIsSaving(true);
    
    try {
      await updateWord({
        ...word,
        japanese: japanese.trim(),
        english: english.trim(),
        notes: notes.trim() || undefined,
        difficulty,
      });
      
      // Success and go back
      router.back();
    } catch (error) {
      console.error('Failed to update word:', error);
      setIsSaving(false);
    }
  };

  if (!word) {
    return (
      <SafeAreaView style={containerStyle}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: textColor }]}>Word Not Found</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: textColor }]}>
            The word you're trying to edit doesn't exist.
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={textColor} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: textColor }]}>Edit Word</Text>
            <View style={{ width: 24 }} />
          </View>
          
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
            
            <View style={styles.buttonRow}>
              <Button
                title="Cancel"
                onPress={() => router.back()}
                variant="outline"
                style={styles.button}
                darkMode={isDarkMode}
              />
              <Button
                title="Save Changes"
                onPress={handleSaveWord}
                disabled={!japanese.trim() || !english.trim() || isSaving}
                loading={isSaving}
                style={styles.button}
                darkMode={isDarkMode}
              />
            </View>
          </View>
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
    ...Typography.title2,
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