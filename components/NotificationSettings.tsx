import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { NotificationSettings as NotificationSettingsType } from '../types';
import { Colors, Spacing, Typography } from '../constants/theme';

interface NotificationSettingsProps {
  settings: NotificationSettingsType;
  onSettingsChange: (settings: NotificationSettingsType) => void;
  darkMode?: boolean;
}

export function NotificationSettingsComponent({
  settings,
  onSettingsChange,
  darkMode = false,
}: NotificationSettingsProps) {
  const textColor = darkMode ? Colors.darkText : Colors.text;
  const secondaryTextColor = darkMode ? Colors.darkTextSecondary : Colors.textSecondary;
  const backgroundColor = darkMode ? Colors.darkCard : Colors.card;
  
  const intervalOptions = [
    { label: '30 minutes', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '1 day', value: 1440 },
  ];

  const handleToggleEnabled = () => {
    onSettingsChange({
      ...settings,
      enabled: !settings.enabled,
    });
  };

  const handleToggleFocusOnDifficult = () => {
    onSettingsChange({
      ...settings,
      focusOnDifficult: !settings.focusOnDifficult,
    });
  };

  const handleIntervalChange = (interval: 30 | 60 | 1440) => {
    onSettingsChange({
      ...settings,
      interval,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.row}>
        <Text style={[styles.title, { color: textColor }]}>Push Notifications</Text>
        <Switch
          value={settings.enabled}
          onValueChange={handleToggleEnabled}
          trackColor={{ false: Colors.border, true: Colors.primary }}
          thumbColor="#FFFFFF"
        />
      </View>
      
      {settings.enabled && (
        <>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: secondaryTextColor }]}>
              Review Interval
            </Text>
            <View style={styles.optionsContainer}>
              {intervalOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.intervalOption,
                    settings.interval === option.value && 
                    { backgroundColor: darkMode ? Colors.primaryDark : Colors.primaryLight },
                  ]}
                  onPress={() => handleIntervalChange(option.value as 30 | 60 | 1440)}
                >
                  <Text
                    style={[
                      styles.intervalText,
                      {
                        color:
                          settings.interval === option.value
                            ? '#FFFFFF'
                            : textColor,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.row}>
            <View>
              <Text style={[styles.optionTitle, { color: textColor }]}>
                Focus on difficult words
              </Text>
              <Text style={[styles.optionDescription, { color: secondaryTextColor }]}>
                Prioritize words you marked as difficult
              </Text>
            </View>
            <Switch
              value={settings.focusOnDifficult}
              onValueChange={handleToggleFocusOnDifficult}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: Spacing.m,
    marginVertical: Spacing.m,
    marginHorizontal: Spacing.m,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  title: {
    ...Typography.headline,
  },
  section: {
    marginBottom: Spacing.m,
  },
  sectionTitle: {
    ...Typography.footnote,
    marginBottom: Spacing.s,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  intervalOption: {
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: 20,
    marginRight: Spacing.s,
    marginBottom: Spacing.s,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  intervalText: {
    ...Typography.subhead,
  },
  optionTitle: {
    ...Typography.subhead,
    marginBottom: Spacing.xs,
  },
  optionDescription: {
    ...Typography.caption1,
  },
});