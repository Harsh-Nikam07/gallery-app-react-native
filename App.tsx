import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ApiProvider, ThemeProvider, FavoritesProvider } from './src/context';
import { useTheme } from './src/context/ThemeContext';
import React from 'react';
import { LogBox } from 'react-native';

const AppContent = () => {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
};

export default function App() {
  // LogBox.ignoreAllLogs();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApiProvider>
        <ThemeProvider>
          <FavoritesProvider>
            <AppContent />
          </FavoritesProvider>
        </ThemeProvider>
      </ApiProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
