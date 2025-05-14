import { StyleSheet } from 'react-native';

// Color system
export const Colors = {
  // Primary
  primary: '#5046E4',
  primaryLight: '#7F78EE',
  primaryDark: '#3731B3',
  
  // Accent
  accent: '#E84747',
  accentLight: '#FB6E6E',
  accentDark: '#BF3535',
  
  // Success
  success: '#34C759',
  successLight: '#68E384',
  successDark: '#279A44',
  
  // Warning
  warning: '#FFA500',
  warningLight: '#FFC04D',
  warningDark: '#CC8400',
  
  // Error
  error: '#FF3B30',
  errorLight: '#FF6B63',
  errorDark: '#CC2F26',
  
  // Neutral
  background: '#FFFFFF',
  card: '#F9F9F9',
  border: '#E5E5E5',
  text: '#1C1C1E',
  textSecondary: '#6C6C6C',
  textTertiary: '#9C9C9C',
  
  // Dark mode
  darkBackground: '#121212',
  darkCard: '#1E1E1E',
  darkBorder: '#333333',
  darkText: '#FFFFFF',
  darkTextSecondary: '#B0B0B0',
  darkTextTertiary: '#808080',
};

// Spacing system (based on 8px)
export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

// Typography scale
export const Typography = StyleSheet.create({
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: 'bold',
  },
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 'bold',
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 'bold',
  },
  title3: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '600',
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
  },
  body: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 'normal',
  },
  callout: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'normal',
  },
  subhead: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 'normal',
  },
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 'normal',
  },
  caption1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'normal',
  },
  caption2: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: 'normal',
  },
});

// Common styles
export const CommonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  darkContainer: {
    flex: 1,
    backgroundColor: Colors.darkBackground,
  },
  section: {
    marginVertical: Spacing.m,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.m,
    marginVertical: Spacing.s,
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
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.s,
  },
  darkSeparator: {
    height: 1,
    backgroundColor: Colors.darkBorder,
    marginVertical: Spacing.s,
  },
});