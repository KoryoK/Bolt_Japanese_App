import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  darkMode?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  darkMode = false,
}: ButtonProps) {
  // Get button styles based on variant and dark mode
  const getButtonStyles = () => {
    const baseStyle = [styles.button, styles[size]];
    
    // Add variant style
    if (variant === 'primary') {
      baseStyle.push(darkMode ? styles.primaryDarkMode : styles.primary);
    } else if (variant === 'secondary') {
      baseStyle.push(darkMode ? styles.secondaryDarkMode : styles.secondary);
    } else if (variant === 'outline') {
      baseStyle.push(darkMode ? styles.outlineDarkMode : styles.outline);
    } else if (variant === 'danger') {
      baseStyle.push(darkMode ? styles.dangerDarkMode : styles.danger);
    }
    
    // Add disabled style
    if (disabled) {
      baseStyle.push(darkMode ? styles.disabledDarkMode : styles.disabled);
    }
    
    return baseStyle;
  };
  
  // Get text styles based on variant and dark mode
  const getTextStyles = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    if (variant === 'primary') {
      baseStyle.push(styles.primaryText);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryText);
    } else if (variant === 'outline') {
      baseStyle.push(darkMode ? styles.outlineTextDarkMode : styles.outlineText);
    } else if (variant === 'danger') {
      baseStyle.push(styles.dangerText);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabledText);
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? (darkMode ? Colors.darkText : Colors.primary) : '#FFFFFF'}
          size="small"
        />
      ) : (
        <Text style={[...getTextStyles(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.m,
    minHeight: 32,
  },
  medium: {
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    minHeight: 44,
  },
  large: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    minHeight: 56,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  primaryDarkMode: {
    backgroundColor: Colors.primaryLight,
  },
  secondary: {
    backgroundColor: Colors.accent,
  },
  secondaryDarkMode: {
    backgroundColor: Colors.accentLight,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  outlineDarkMode: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  danger: {
    backgroundColor: Colors.error,
  },
  dangerDarkMode: {
    backgroundColor: Colors.errorLight,
  },
  disabled: {
    backgroundColor: Colors.border,
    borderColor: Colors.border,
  },
  disabledDarkMode: {
    backgroundColor: Colors.darkBorder,
    borderColor: Colors.darkBorder,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    ...Typography.footnote,
  },
  mediumText: {
    ...Typography.callout,
  },
  largeText: {
    ...Typography.body,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: Colors.primary,
  },
  outlineTextDarkMode: {
    color: Colors.primaryLight,
  },
  dangerText: {
    color: '#FFFFFF',
  },
  disabledText: {
    color: Colors.textTertiary,
  },
});