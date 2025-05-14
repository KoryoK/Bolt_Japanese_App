import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';

interface StudyProgressCardProps {
  totalWords: number;
  dueWords: number;
  masteredWords: number;
  difficultWords: number;
  darkMode?: boolean;
}

export function StudyProgressCard({
  totalWords,
  dueWords,
  masteredWords,
  difficultWords,
  darkMode = false,
}: StudyProgressCardProps) {
  const containerStyle = darkMode ? styles.darkContainer : styles.container;
  const textColor = darkMode ? Colors.darkText : Colors.text;
  const secondaryTextColor = darkMode ? Colors.darkTextSecondary : Colors.textSecondary;
  
  const masteredPercentage = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;
  const difficultPercentage = totalWords > 0 ? Math.round((difficultWords / totalWords) * 100) : 0;
  
  return (
    <View style={containerStyle}>
      <Text style={[styles.title, { color: textColor }]}>Study Progress</Text>
      
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressBarSegment,
            { 
              backgroundColor: Colors.success,
              width: `${masteredPercentage}%`,
            },
          ]}
        />
        <View
          style={[
            styles.progressBarSegment,
            { 
              backgroundColor: Colors.error,
              width: `${difficultPercentage}%`,
            },
          ]}
        />
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: textColor }]}>{totalWords}</Text>
          <Text style={[styles.statLabel, { color: secondaryTextColor }]}>Total</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: Colors.warning }]}>{dueWords}</Text>
          <Text style={[styles.statLabel, { color: secondaryTextColor }]}>Due</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: Colors.success }]}>{masteredWords}</Text>
          <Text style={[styles.statLabel, { color: secondaryTextColor }]}>Mastered</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: Colors.error }]}>{difficultWords}</Text>
          <Text style={[styles.statLabel, { color: secondaryTextColor }]}>Difficult</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.m,
    marginVertical: Spacing.m,
    marginHorizontal: Spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  darkContainer: {
    backgroundColor: Colors.darkCard,
    borderRadius: 12,
    padding: Spacing.m,
    marginVertical: Spacing.m,
    marginHorizontal: Spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    ...Typography.headline,
    marginBottom: Spacing.m,
  },
  progressBar: {
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: 5,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: Spacing.m,
  },
  progressBarSegment: {
    height: '100%',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...Typography.title3,
  },
  statLabel: {
    ...Typography.caption1,
    marginTop: Spacing.xs,
  },
});