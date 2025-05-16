import { Tabs } from 'expo-router';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Colors } from '@/constants/theme';
import { BookOpen, Plus, ListChecks, Settings } from 'lucide-react-native';

export default function TabLayout() {
  const { settings } = useAppSettings();
  const isDarkMode = settings?.darkMode || false;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? Colors.darkCard : Colors.background,
          borderTopColor: isDarkMode ? Colors.darkBorder : Colors.border,
          borderTopWidth: 1,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: isDarkMode ? Colors.primaryLight : Colors.primary,
        tabBarInactiveTintColor: isDarkMode ? Colors.darkTextSecondary : Colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Lists',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color, size }) => <Plus size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: 'Study',
          tabBarIcon: ({ color, size }) => <ListChecks size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}