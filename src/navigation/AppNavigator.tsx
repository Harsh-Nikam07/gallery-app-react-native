import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ImageViewer } from '../screens/ImageViewer';
import { RootStackParamList, TabParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Entypo';


const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();


const TabNavigator = () => {
  const { theme, isDark } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: isDark ? '#333' : '#e0e0e0',
          borderTopWidth: 1,
          paddingBottom: 20,
          paddingTop: 10,
          height: 70,
        },
        tabBarActiveTintColor: isDark ? '#fff' : '#000',
        tabBarInactiveTintColor: isDark ? '#fff' : '#000',
        
        headerStyle: {
          backgroundColor: theme.background,
          elevation: isDark ? 0 : 3,
          shadowOpacity: isDark ? 0 : 0.1,
        },
        headerTintColor: isDark ? '#fff' : '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Gallery',
          tabBarLabel: '',
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Icon2 name="grid" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favorites',
          tabBarLabel: '',
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarLabel: '',
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" size={22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const { theme, isDark } = useTheme();
  
  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: theme.primary,
          background: theme.background,
          card: theme.surface,
          text: theme.text,
          border: isDark ? '#333' : '#e0e0e0',
          notification: theme.primary,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400' as const,
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500' as const,
          },
          bold: {
            fontFamily: 'System',
            fontWeight: '700' as const,
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '800' as const,
          },
        },
      }}
    >
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Main"
          component={TabNavigator}
        />
        <Stack.Screen
          name="ImageViewer"
          // component={ImageViewerScreen}
          component={ImageViewer}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
