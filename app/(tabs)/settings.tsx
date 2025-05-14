import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  Moon, 
  Info, 
  ArrowRight, 
  Trash, 
  ChevronRight 
} from 'lucide-react-native';
import { Colors, Spacing, Typography, CommonStyles } from '@/constants/theme';
import { Button } from '@/components/Button';
import { NotificationSettingsComponent } from '@/components/NotificationSettings';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useVocabularyWords } from '@/hooks/useVocabularyWords';
import { clearAllData } from '@/utils/storage';
import { configureNotifications } from '@/utils/notifications';

export default function SettingsScreen() {
  const { settings, updateNotificationSettings, toggleDarkMode, resetSettings } = useAppSettings();
  const { words } = useVocabularyWords();
  const isDarkMode = settings?.darkMode || false;
  
  const containerStyle = isDarkMode ? CommonStyles.darkContainer : CommonStyles.container;
  const textColor = isDarkMode ? Colors.darkText : Colors.text;
  const secondaryTextColor = isDarkMode ? Colors.darkTextSecondary : Colors.textSecondary;
  
  const handleClearData = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
        clearAllData()
          .then(() => {
            alert('All data has been cleared');
            // Force a reload to update all hooks
            window.location.reload();
          })
          .catch(error => {
            console.error('Failed to clear data:', error);
            alert('Failed to clear data');
          });
      }
    } else {
      Alert.alert(
        'Clear All Data',
        'Are you sure you want to delete all your data? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => {
              clearAllData()
                .then(() => {
                  Alert.alert('Success', 'All data has been cleared');
                  // Force a reload to update all hooks
                  // This will depend on your navigation setup
                })
                .catch(error => {
                  console.error('Failed to clear data:', error);
                  Alert.alert('Error', 'Failed to clear data');
                });
            }
          },
        ]
      );
    }
  };
  
  const handleRequestNotificationPermission = async () => {
    const granted = await configureNotifications();
    if (granted) {
      Alert.alert('Success', 'Notification permission granted');
    } else {
      Alert.alert('Error', 'Failed to get notification permission');
    }
  };

  return (
    <SafeAreaView style={containerStyle}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Settings</Text>
      </View>
      
      <ScrollView style={styles.scrollContent}>
        <View style={[styles.section, { backgroundColor: isDarkMode ? Colors.darkCard : Colors.card }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Appearance</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Moon size={22} color={isDarkMode ? Colors.primaryLight : Colors.primary} />
              <Text style={[styles.settingLabel, { color: textColor }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
        
        <NotificationSettingsComponent
          settings={settings.notifications}
          onSettingsChange={updateNotificationSettings}
          darkMode={isDarkMode}
        />
        
        {Platform.OS !== 'web' && (
          <View style={[styles.section, { backgroundColor: isDarkMode ? Colors.darkCard : Colors.card }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Notifications</Text>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleRequestNotificationPermission}
            >
              <View style={styles.settingInfo}>
                <Bell size={22} color={isDarkMode ? Colors.primaryLight : Colors.primary} />
                <Text style={[styles.settingLabel, { color: textColor }]}>Request Permission</Text>
              </View>
              <ChevronRight size={18} color={secondaryTextColor} />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={[styles.section, { backgroundColor: isDarkMode ? Colors.darkCard : Colors.card }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Data Management</Text>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleClearData}
          >
            <View style={styles.settingInfo}>
              <Trash size={22} color={Colors.error} />
              <View>
                <Text style={[styles.settingLabel, { color: textColor }]}>Clear All Data</Text>
                <Text style={[styles.settingDescription, { color: secondaryTextColor }]}>
                  This will delete all your vocabulary lists and words
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={secondaryTextColor} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: isDarkMode ? Colors.darkCard : Colors.card }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>About</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Info size={22} color={isDarkMode ? Colors.primaryLight : Colors.primary} />
              <View>
                <Text style={[styles.settingLabel, { color: textColor }]}>Japanese Flashcards</Text>
                <Text style={[styles.settingDescription, { color: secondaryTextColor }]}>
                  Version 1.0.0
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <Text style={[styles.statsTitle, { color: secondaryTextColor }]}>App Statistics</Text>
          <Text style={[styles.statsText, { color: secondaryTextColor }]}>
            Total words: {words.length}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.m,
  },
  title: {
    ...Typography.largeTitle,
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    borderRadius: 12,
    margin: Spacing.m,
    overflow: 'hidden',
  },
  sectionTitle: {
    ...Typography.headline,
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    ...Typography.body,
    marginLeft: Spacing.m,
  },
  settingDescription: {
    ...Typography.caption1,
    marginLeft: Spacing.m,
  },
  statsContainer: {
    padding: Spacing.m,
    margin: Spacing.m,
    alignItems: 'center',
  },
  statsTitle: {
    ...Typography.subhead,
    marginBottom: Spacing.s,
  },
  statsText: {
    ...Typography.caption1,
  },
});