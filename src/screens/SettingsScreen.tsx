import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';

export const SettingsScreen: React.FC = () => {
  const { theme, isDark, themeMode, setThemeMode } = useTheme();
  const { favorites, clearFavorites } = useFavorites();
  const [cacheSize, setCacheSize] = useState<string>('Calculating...');

  React.useEffect(() => {
    calculateCacheSize();
  }, []);

  const calculateCacheSize = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }
      
      // Convert bytes to MB
      const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
      setCacheSize(`${sizeInMB} MB`);
    } catch (error) {
      setCacheSize('Unknown');
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached images. The app may take longer to load images afterward.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await Image.clearDiskCache();
              await Image.clearMemoryCache();
              await calculateCacheSize();
              Alert.alert('Success', 'Cache cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const handleClearFavorites = () => {
    if (favorites.length === 0) {
      Alert.alert('No Favorites', 'You have no favorites to clear');
      return;
    }

    Alert.alert(
      'Clear All Favorites',
      `This will remove all ${favorites.length} favorited images. This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearFavorites();
            Alert.alert('Success', 'All favorites have been removed');
          },
        },
      ]
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'This will clear all app data including favorites and settings. The app will return to its default state.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              await Image.clearDiskCache();
              await Image.clearMemoryCache();
              Alert.alert(
                'App Reset',
                'All data has been cleared. Please restart the app for changes to take full effect.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to reset app');
            }
          },
        },
      ]
    );
  };

  const RadioButton = ({ selected, onPress }: { selected: boolean; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[
        styles.radioButton,
        { borderColor: theme.text }
      ]}>
        {selected && (
          <View style={[styles.radioButtonInner, { backgroundColor: theme.text }]} />
        )}
      </View>
    </TouchableOpacity>
  );

  const ThemeOption = ({ 
    mode, 
    title, 
    description, 
    icon 
  }: { 
    mode: 'light' | 'dark' | 'system'; 
    title: string; 
    description: string;
    icon: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.themeOption,
        { 
          backgroundColor: theme.surfaceSecondary,
        }
      ]}
      onPress={() => setThemeMode(mode)}
      activeOpacity={0.7}
    >
      <View style={styles.themeOptionLeft} >
        <View style={[styles.iconContainer, { backgroundColor: theme.border }]}>
          <Icon name={icon} size={20} color={theme.text} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.settingDescription, { color: theme.textTertiary }]}>
            {description}
          </Text>
        </View>
      </View>
      <RadioButton selected={themeMode === mode} onPress={() => setThemeMode(mode)} />
    </TouchableOpacity>
  );

  const SettingItem = ({ 
    icon, 
    title, 
    description, 
    onPress, 
    rightComponent,
    iconFamily = 'FontAwesome'
  }: {
    icon: string;
    title: string;
    description?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    iconFamily?: 'FontAwesome' | 'Entypo';
  }) => {
    const IconComponent = iconFamily === 'Entypo' ? Icon2 : Icon;
    
    return (
      <TouchableOpacity 
        style={[styles.settingItem, { backgroundColor: theme.surfaceSecondary }]}
        onPress={onPress}
        disabled={!onPress && !rightComponent}
        activeOpacity={onPress ? 0.7 : 1}
      >
        <View style={styles.settingItemLeft}>
          <View style={[styles.iconContainer, { backgroundColor: theme.border }]}>
            <IconComponent name={icon} size={20} color={theme.text} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
            {description && (
              <Text style={[styles.settingDescription, { color: theme.textTertiary }]}>
                {description}
              </Text>
            )}
          </View>
        </View>
        {rightComponent || (onPress && (
          <Icon2 name="chevron-right" size={16} color={theme.text} />
        ))}
      </TouchableOpacity>
    );
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>


        {/* Appearance Section */}
        <SectionHeader title="THEME" />
        <View style={styles.section}>
          <ThemeOption
            mode="light"
            icon="sun-o"
            title="Light"
            description="Always use light theme"
          />
          <ThemeOption
            mode="dark"
            icon="moon-o"
            title="Dark"
            description="Always use dark theme"
          />
          <ThemeOption
            mode="system"
            icon="desktop"
            title="System"
            description="Follow system theme preference"
          />
        </View>

        {/* Data & Storage Section */}
        <SectionHeader title="DATA & STORAGE" />
        <View style={styles.section}>
          <SettingItem
            icon="heart"
            title="Favorites"
            description={`${favorites.length} images favorited`}
            onPress={handleClearFavorites}
          />
        </View>

        {/* About Section */}
        <SectionHeader title="ABOUT" />
        <View style={styles.section}>
          <SettingItem
            icon="info-circle"
            title="App Version"
            description="Version 1.0.0"
          />
          <SettingItem
            icon="shield"
            title="Privacy Policy"
            onPress={() => Alert.alert('Privacy Policy', 'Your data is stored locally on your device. We do not collect any personal information.')}
          />
          <SettingItem
            icon="book"
            title="Terms of Service"
            onPress={() => Alert.alert('Terms of Service', 'This app uses the FotoOwl API for image content. All images are property of their respective owners.')}
          />
        </View>

        {/* <SectionHeader title="ADVANCED" />
        <View style={styles.section}>
          <SettingItem
            icon="trash"
            title="Reset App"
            description="Clear all app data"
            onPress={handleResetApp}
          />
        </View> */}

        {/* Developer Info */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Gallery App © 2025
          </Text>
          <Text style={[styles.footerText, { color: theme.textSecondary, fontSize: 12 }]}>
            Built with React Native & Expo
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  section: {
    // marginBottom: 8,s
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    gap:8
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 1,
    borderRadius: 12,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    marginBottom: 4,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 2,
    borderRadius: 12,
  },
  themeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});

export default SettingsScreen;
