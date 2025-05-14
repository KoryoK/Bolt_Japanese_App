import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '../constants/theme';
import { VocabularyList } from '../types';
import dayjs from 'dayjs';

interface VocabularyListCardProps {
  list: VocabularyList;
  darkMode: boolean;
  onPress?: () => void;
}

export function VocabularyListCard({ list, darkMode, onPress }: VocabularyListCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/list-detail?id=${list.id}`);
    }
  };

  const cardStyles = darkMode ? styles.darkCard : styles.card;
  const textColor = darkMode ? Colors.darkText : Colors.text;
  const secondaryTextColor = darkMode ? Colors.darkTextSecondary : Colors.textSecondary;

  const formattedDate = dayjs(list.createdAt).format('MMM D, YYYY');

  return (
    <TouchableOpacity style={cardStyles} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <BookOpen size={24} color={darkMode ? Colors.primaryLight : Colors.primary} />
        </View>
        <View style={styles.content}>
          <Text style={[styles.title, { color: textColor }]}>{list.name}</Text>
          {list.description ? (
            <Text style={[styles.description, { color: secondaryTextColor }]} numberOfLines={1}>
              {list.description}
            </Text>
          ) : null}
          <View style={styles.metaRow}>
            <Text style={[styles.meta, { color: secondaryTextColor }]}>
              {list.totalWords} {list.totalWords === 1 ? 'word' : 'words'}
            </Text>
            <Text style={[styles.meta, { color: secondaryTextColor }]}>
              Created: {formattedDate}
            </Text>
          </View>
        </View>
        <ChevronRight size={20} color={secondaryTextColor} />
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(80, 70, 228, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.m,
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.headline,
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.subhead,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    ...Typography.caption1,
  },
});