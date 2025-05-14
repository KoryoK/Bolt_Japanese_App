import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from './Button';
import { Colors, Spacing, Typography } from '../constants/theme';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
  icon?: React.ReactNode;
  darkMode?: boolean;
}

export function EmptyState({
  title,
  description,
  buttonTitle,
  onButtonPress,
  icon,
  darkMode = false,
}: EmptyStateProps) {
  const textColor = darkMode ? Colors.darkText : Colors.text;
  const secondaryTextColor = darkMode ? Colors.darkTextSecondary : Colors.textSecondary;

  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <Text style={[styles.description, { color: secondaryTextColor }]}>{description}</Text>
      {buttonTitle && onButtonPress && (
        <Button
          title={buttonTitle}
          onPress={onButtonPress}
          variant="primary"
          style={styles.button}
          darkMode={darkMode}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.l,
  },
  title: {
    ...Typography.title2,
    textAlign: 'center',
    marginBottom: Spacing.s,
  },
  description: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.l,
  },
  button: {
    minWidth: 200,
  },
});