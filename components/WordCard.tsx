import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard as Edit, Trash } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '../constants/theme';
import { VocabularyWord, DifficultyLevel } from '../types';

interface WordCardProps {
  word: VocabularyWord;
  darkMode: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  showButtons?: boolean;
  showFlip?: boolean;
}

export function WordCard({
  word,
  darkMode,
  onEdit,
  onDelete,
  showButtons = true,
  showFlip = false,
}: WordCardProps) {
  const router = useRouter();
  const [flipped, setFlipped] = useState(false);
  const [spinValue] = useState(new Animated.Value(0));
  
  const textColor = darkMode ? Colors.darkText : Colors.text;
  const secondaryTextColor = darkMode ? Colors.darkTextSecondary : Colors.textSecondary;
  const cardStyles = darkMode ? styles.darkCard : styles.card;
  
  const handleFlip = () => {
    if (!showFlip) return;
    
    const toValue = flipped ? 0 : 1;
    
    Animated.timing(spinValue, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    setFlipped(!flipped);
  };
  
  // Interpolate for the flip animation
  const frontAnimatedStyle = {
    transform: [{
      rotateY: spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
      })
    }]
  };
  
  const backAnimatedStyle = {
    transform: [{
      rotateY: spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
      })
    }]
  };
  
  // Get difficulty color
  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    const colors = {
      easy: darkMode ? Colors.successLight : Colors.success,
      medium: darkMode ? Colors.warningLight : Colors.warning,
      hard: darkMode ? Colors.errorLight : Colors.error,
    };
    return colors[difficulty];
  };

  return (
    <TouchableOpacity 
      style={[cardStyles]} 
      onPress={showFlip ? handleFlip : undefined}
      activeOpacity={showFlip ? 0.7 : 1}
    >
      <View style={styles.content}>
        {showFlip ? (
          <>
            <Animated.View style={[styles.flipCard, frontAnimatedStyle, { opacity: flipped ? 0 : 1 }]}>
              <Text style={[styles.japanese, { color: textColor }]}>{word.japanese}</Text>
            </Animated.View>
            <Animated.View style={[styles.flipCard, styles.backFlipCard, backAnimatedStyle, { opacity: flipped ? 1 : 0 }]}>
              <Text style={[styles.english, { color: textColor }]}>{word.english}</Text>
            </Animated.View>
          </>
        ) : (
          <>
            <Text style={[styles.japanese, { color: textColor }]}>{word.japanese}</Text>
            <Text style={[styles.english, { color: textColor }]}>{word.english}</Text>
          </>
        )}
        
        {word.notes ? (
          <Text style={[styles.notes, { color: secondaryTextColor }]}>{word.notes}</Text>
        ) : null}
        
        <View style={styles.metaRow}>
          <View style={[
            styles.difficultyBadge, 
            { backgroundColor: getDifficultyColor(word.difficulty) }
          ]}>
            <Text style={styles.difficultyText}>
              {word.difficulty.charAt(0).toUpperCase() + word.difficulty.slice(1)}
            </Text>
          </View>
          
          {word.lastStudied ? (
            <Text style={[styles.lastStudied, { color: secondaryTextColor }]}>
              Last studied: {new Date(word.lastStudied).toLocaleDateString()}
            </Text>
          ) : null}
        </View>
        
        {showButtons && (
          <View style={styles.buttonsRow}>
            {onEdit && (
              <TouchableOpacity style={styles.button} onPress={onEdit}>
                <Edit size={18} color={darkMode ? Colors.darkTextSecondary : Colors.textSecondary} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity style={styles.button} onPress={onDelete}>
                <Trash size={18} color={darkMode ? Colors.errorLight : Colors.error} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.m,
    marginVertical: Spacing.s,
    marginHorizontal: Spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 12,
    padding: Spacing.m,
    marginVertical: Spacing.s,
    marginHorizontal: Spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    minHeight: 100,
  },
  flipCard: {
    backfaceVisibility: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backFlipCard: {
    backfaceVisibility: 'hidden',
  },
  japanese: {
    ...Typography.title2,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  english: {
    ...Typography.headline,
    marginBottom: Spacing.s,
    textAlign: 'center',
  },
  notes: {
    ...Typography.footnote,
    marginBottom: Spacing.s,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.s,
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs,
    borderRadius: 4,
  },
  difficultyText: {
    color: 'white',
    ...Typography.caption1,
    fontWeight: 'bold',
  },
  lastStudied: {
    ...Typography.caption2,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.m,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.s,
  },
});