import { StyleSheet } from 'react-native';

// Color system
export const Colors = {
  // Primary
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',

  // Accent
  accent: '#F43F5E',
  accentLight: '#FB7185',
  accentDark: '#E11D48',

  // Success
  success: '#10B981',
  successLight: '#34D399',
  successDark: '#059669',

  // Warning
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningDark: '#D97706',

  // Error
  error: '#EF4444',
  errorLight: '#F87171',
  errorDark: '#DC2626',

  // Neutral
  background: '#FFFFFF',
  card: '#F8FAFC',
  border: '#E2E8F0',
  text: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',

  // Dark mode
  darkBackground: '#0F172A',
  darkCard: '#1E293B',
  darkBorder: '#334155',
  darkText: '#F8FAFC',
  darkTextSecondary: '#CBD5E1',
  darkTextTertiary: '#94A3B8',
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
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.5,
  },
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.5,
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.3,
  },
  title3: {
    fontSize: 20,
    lineHeight: 25,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: -0.2,
  },
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  callout: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: 'Inter-Regular',
  },
  subhead: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: 'Inter-Medium',
  },
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  caption1: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter-Regular',
  },
  caption2: {
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Inter-Regular',
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
    borderRadius: 16,
    padding: Spacing.m,
    marginVertical: Spacing.s,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: Colors.darkCard,
    borderRadius: 16,
    padding: Spacing.m,
    marginVertical: Spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
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
  // Modern styles
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  darkGlass: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.3)',
  },
  pill: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  pillText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});