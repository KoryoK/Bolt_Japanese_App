import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
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
  
  const [sliderValue, setSliderValue] = useState(settings.interval);

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

  const formatIntervalText = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else if (minutes === 60) {
      return '1 hour';
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    } else {
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor((minutes % 1440) / 60);
      return `${days}d ${hours}h`;
    }
  };

  const handleSliderComplete = (value: number) => {
    onSettingsChange({
      ...settings,
      interval: Math.round(value),
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
            <Text style={[styles.intervalValue, { color: textColor }]}>
              {formatIntervalText(sliderValue)}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={2880} // 2 days in minutes
              step={5}
              value={settings.interval}
              onValueChange={setSliderValue}
              onSlidingComplete={handleSliderComplete}
              minimumTrackTintColor={darkMode ? Colors.primaryLight : Colors.primary}
              maximumTrackTintColor={darkMode ? Colors.darkBorder : Colors.border}
              thumbTintColor={darkMode ? Colors.primaryLight : Colors.primary}
            />
            <View style={styles.sliderLabels}>
              <Text style={[styles.sliderLabel, { color: secondaryTextColor }]}>5m</Text>
              <Text style={[styles.sliderLabel, { color: secondaryTextColor }]}>2d</Text>
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
  intervalValue: {
    ...Typography.title3,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -Spacing.s,
  },
  sliderLabel: {
    ...Typography.caption1,
  },
  optionTitle: {
    ...Typography.subhead,
    marginBottom: Spacing.xs,
  },
  optionDescription: {
    ...Typography.caption1,
  },
});