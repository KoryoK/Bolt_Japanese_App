import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated, 
  Dimensions,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useVocabularyWords } from '@/hooks/useVocabularyWords';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Colors, Spacing, Typography, CommonStyles } from '@/constants/theme';
import { WordCard } from '@/components/WordCard';
import { Button } from '@/components/Button';
import { DifficultySelector } from '@/components/DifficultySelector';
import { StudyProgressCard } from '@/components/StudyProgressCard';
import { EmptyState } from '@/components/EmptyState';
import { DifficultyLevel, VocabularyWord } from '@/types';
import { BookOpen, RotateCcw } from 'lucide-react-native';
import { getWordsForReview, sortWordsByStudyPriority, getDifficultWords } from '@/utils/spaced-repetition';
import { useIsFocused } from '@react-navigation/native';

export default function StudyScreen() {
  const router = useRouter();
  const { words, loading } = useVocabularyWords();
  const { settings } = useAppSettings();
  const isDarkMode = settings?.darkMode || false;
  const isFocused = useIsFocused();
  
  const [wordsToStudy, setWordsToStudy] = useState<VocabularyWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  
  const flipAnimationValue = useRef(new Animated.Value(0)).current;
  const swipeAnimationValue = useRef(new Animated.Value(0)).current;
  
  const containerStyle = isDarkMode ? CommonStyles.darkContainer : CommonStyles.container;
  const textColor = isDarkMode ? Colors.darkText : Colors.text;
  const secondaryTextColor = isDarkMode ? Colors.darkTextSecondary : Colors.textSecondary;

  // Reset study state when the tab comes into focus
  useEffect(() => {
    if (isFocused) {
      setCurrentIndex(0);
      setIsFlipped(false);
      setShowAnswer(false);
      setSelectedDifficulty(null);
      setIsFinished(false);
      flipAnimationValue.setValue(0);
      swipeAnimationValue.setValue(0);
    }
  }, [isFocused]);
  
  // Prepare study words when data is loaded
  useEffect(() => {
    if (!loading && words.length > 0) {
      const dueWords = getWordsForReview(words);
      const sortedWords = sortWordsByStudyPriority(dueWords);
      setWordsToStudy(sortedWords.slice(0, 10));  // Limit to 10 words per session
      setIsFinished(false);
    }
  }, [loading, words]);
  
  const handleFlip = () => {
    if (isFlipped) return;
    
    Animated.timing(flipAnimationValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(true);
      setShowAnswer(true);
    });
  };
  
  const handleReviewWord = async (difficulty: DifficultyLevel) => {
    const currentWord = wordsToStudy[currentIndex];
    setSelectedDifficulty(difficulty);
    
    // Animate card swiping out
    Animated.timing(swipeAnimationValue, {
      toValue: Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Move to next card or finish
      if (currentIndex < wordsToStudy.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsFinished(true);
      }
      
      // Reset animation values and state for next card
      flipAnimationValue.setValue(0);
      swipeAnimationValue.setValue(0);
      setIsFlipped(false);
      setShowAnswer(false);
      setSelectedDifficulty(null);
    });
  };
  
  const restartStudy = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    setSelectedDifficulty(null);
    setIsFinished(false);
    flipAnimationValue.setValue(0);
    swipeAnimationValue.setValue(0);
  };
  
  // Card flip animation styles
  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnimationValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
      {
        translateX: swipeAnimationValue,
      },
    ],
  };
  
  const backAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnimationValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['180deg', '0deg'],
        }),
      },
      {
        translateX: swipeAnimationValue,
      },
    ],
  };
  
  // Stats for progress card
  const totalWords = words.length;
  const dueWords = getWordsForReview(words).length;
  const difficultWords = getDifficultWords(words).length;
  const masteredWords = totalWords - dueWords - difficultWords;

  if (loading) {
    return (
      <SafeAreaView style={containerStyle}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: secondaryTextColor }]}>
            Loading vocabulary...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (words.length === 0) {
    return (
      <SafeAreaView style={containerStyle}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Study</Text>
        </View>
        
        <EmptyState
          title="No Words to Study"
          description="Add some vocabulary words to start studying."
          buttonTitle="Add Words"
          onButtonPress={() => router.push('/add-word')}
          icon={<BookOpen size={48} color={isDarkMode ? Colors.primaryLight : Colors.primary} />}
          darkMode={isDarkMode}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyle}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Study</Text>
      </View>
      
      <StudyProgressCard
        totalWords={totalWords}
        dueWords={dueWords}
        masteredWords={masteredWords}
        difficultWords={difficultWords}
        darkMode={isDarkMode}
      />
      
      {wordsToStudy.length === 0 ? (
        <EmptyState
          title="All Caught Up!"
          description="You've reviewed all words due for today. Check back later for more reviews."
          buttonTitle="Review Difficult Words"
          onButtonPress={() => {
            const difficultWordsToStudy = getDifficultWords(words);
            if (difficultWordsToStudy.length > 0) {
              setWordsToStudy(difficultWordsToStudy.slice(0, 10));
            }
          }}
          darkMode={isDarkMode}
        />
      ) : isFinished ? (
        <View style={styles.finishedContainer}>
          <Text style={[styles.finishedTitle, { color: textColor }]}>
            Study Session Complete!
          </Text>
          <Text style={[styles.finishedDescription, { color: secondaryTextColor }]}>
            You've reviewed {wordsToStudy.length} words in this session.
          </Text>
          <Button
            title="Start Another Session"
            onPress={restartStudy}
            style={styles.restartButton}
            darkMode={isDarkMode}
          />
        </View>
      ) : (
        <View style={styles.studyContainer}>
          <View style={styles.progressIndicator}>
            <Text style={[styles.progressText, { color: secondaryTextColor }]}>
              {currentIndex + 1} of {wordsToStudy.length}
            </Text>
          </View>
          
          <View style={styles.cardContainer}>
            <Animated.View
              style={[styles.card, frontAnimatedStyle, { opacity: isFlipped ? 0 : 1 }]}
            >
              <TouchableOpacity
                style={[styles.flashcard, { backgroundColor: isDarkMode ? Colors.darkCard : Colors.card }]}
                onPress={handleFlip}
                activeOpacity={0.9}
              >
                <Text style={[styles.japaneseText, { color: textColor }]}>
                  {wordsToStudy[currentIndex]?.japanese}
                </Text>
                <Text style={[styles.instruction, { color: secondaryTextColor }]}>
                  Tap to reveal meaning
                </Text>
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View
              style={[styles.card, backAnimatedStyle, { opacity: isFlipped ? 1 : 0 }]}
            >
              <View style={[styles.flashcard, { backgroundColor: isDarkMode ? Colors.darkCard : Colors.card }]}>
                <Text style={[styles.englishText, { color: textColor }]}>
                  {wordsToStudy[currentIndex]?.english}
                </Text>
                
                {wordsToStudy[currentIndex]?.notes && (
                  <Text style={[styles.notesText, { color: secondaryTextColor }]}>
                    {wordsToStudy[currentIndex]?.notes}
                  </Text>
                )}
                
                <View style={styles.difficultyContainer}>
                  <Text style={[styles.rateText, { color: secondaryTextColor }]}>
                    How well did you know this word?
                  </Text>
                  
                  <View style={styles.difficultyButtons}>
                    <Button
                      title="Easy"
                      onPress={() => handleReviewWord('easy')}
                      variant={selectedDifficulty === 'easy' ? 'primary' : 'outline'}
                      size="small"
                      style={[styles.difficultyButton, { backgroundColor: selectedDifficulty === 'easy' ? Colors.success : undefined }]}
                      darkMode={isDarkMode}
                    />
                    <Button
                      title="Medium"
                      onPress={() => handleReviewWord('medium')}
                      variant={selectedDifficulty === 'medium' ? 'primary' : 'outline'}
                      size="small"
                      style={[styles.difficultyButton, { backgroundColor: selectedDifficulty === 'medium' ? Colors.warning : undefined }]}
                      darkMode={isDarkMode}
                    />
                    <Button
                      title="Hard"
                      onPress={() => handleReviewWord('hard')}
                      variant={selectedDifficulty === 'hard' ? 'primary' : 'outline'}
                      size="small"
                      style={[styles.difficultyButton, { backgroundColor: selectedDifficulty === 'hard' ? Colors.error : undefined }]}
                      darkMode={isDarkMode}
                    />
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>
          
          <View style={styles.skipButtonContainer}>
            <Button
              title="Skip"
              onPress={() => {
                // Just move to the next card
                if (currentIndex < wordsToStudy.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                  setIsFlipped(false);
                  setShowAnswer(false);
                  flipAnimationValue.setValue(0);
                  swipeAnimationValue.setValue(0);
                } else {
                  setIsFinished(true);
                }
              }}
              variant="outline"
              darkMode={isDarkMode}
            />
          </View>
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
  },
  studyContainer: {
    flex: 1,
    padding: Spacing.m,
  },
  progressIndicator: {
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  progressText: {
    ...Typography.subhead,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: 300,
    backfaceVisibility: 'hidden',
  },
  flashcard: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    padding: Spacing.l,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  japaneseText: {
    ...Typography.largeTitle,
    textAlign: 'center',
    marginBottom: Spacing.l,
  },
  instruction: {
    ...Typography.caption1,
    textAlign: 'center',
    marginTop: Spacing.l,
  },
  englishText: {
    ...Typography.title1,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  notesText: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.l,
  },
  difficultyContainer: {
    width: '100%',
    marginTop: Spacing.m,
  },
  rateText: {
    ...Typography.subhead,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  difficultyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  skipButtonContainer: {
    marginTop: Spacing.l,
    alignItems: 'center',
  },
  finishedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  finishedTitle: {
    ...Typography.title1,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  finishedDescription: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  restartButton: {
    minWidth: 200,
  },
});