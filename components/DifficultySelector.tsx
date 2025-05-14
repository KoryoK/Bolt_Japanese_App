import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DifficultyLevel } from '../types';
import { Colors, Spacing, Typography } from '../constants/theme';

interface DifficultySelectorProps {
  value: DifficultyLevel;
  onChange: (difficulty: DifficultyLevel) => void;
  darkMode?: boolean;
}

export function DifficultySelector({ value, onChange, darkMode = false }: DifficultySelectorProps) {
  const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];
  
  const getDifficultyColor = (difficulty: DifficultyLevel, isSelected: boolean) => {
    if (!isSelected) {
      return darkMode ? Colors.darkCard : 'transparent';
    }
    
    const colors = {
      easy: Colors.success,
      medium: Colors.warning,
      hard: Colors.error,
    };
    
    return colors[difficulty];
  };
  
  const getTextColor = (difficulty: DifficultyLevel, isSelected: boolean) => {
    if (!isSelected) {
      return darkMode ? Colors.darkText : Colors.text;
    }
    
    return '#FFFFFF';
  };

  return (
    <View style={styles.container}>
      {difficulties.map((difficulty) => {
        const isSelected = value === difficulty;
        return (
          <TouchableOpacity
            key={difficulty}
            style={[
              styles.option,
              {
                backgroundColor: getDifficultyColor(difficulty, isSelected),
                borderColor: isSelected ? 'transparent' : darkMode ? Colors.darkBorder : Colors.border,
              },
            ]}
            onPress={() => onChange(difficulty)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.optionText,
                { color: getTextColor(difficulty, isSelected) },
              ]}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Spacing.s,
  },
  option: {
    flex: 1,
    paddingVertical: Spacing.s,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: Spacing.xs,
  },
  optionText: {
    ...Typography.subhead,
    fontWeight: '600',
  },
});