import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  showIcon?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Oops!',
  message,
  onRetry,
  retryText = 'Try Again',
  showIcon = true,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {showIcon && (
        <Icon 
          name="error-outline" 
          size={64} 
          color={theme.error}
          style={styles.icon} 
        />
      )}
      
      <Text style={[styles.title, { color: theme.text }]}>
        {title}
      </Text>
      
      <Text style={[styles.message, { color: theme.text }]}>
        {message}
      </Text>
      
      {onRetry && (
        <TouchableOpacity 
          style={[styles.retryButton, { borderColor: theme.primary }]} 
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <Text style={[styles.retryText, { color: theme.primary }]}>
            {retryText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
