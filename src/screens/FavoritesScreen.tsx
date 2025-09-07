import React, { useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ImageGrid } from '../components/gallery/ImageGrid';
import { useFavorites } from '../context/FavoritesContext';
import { RootStackParamList } from '../types/navigation';
import { GalleryImage } from '../services/api/types';
import { useTheme } from '../context/ThemeContext';

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Favorites'>;

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { favorites } = useFavorites();
  const { theme } = useTheme();

  const handleImagePress = useCallback((image: GalleryImage, index: number) => {
    navigation.navigate('ImageViewer', {
      image,
      index,
      images: favorites,
    });
  }, [navigation, favorites]);

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>❤️</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>No Favorites Yet</Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Images you favorite will appear here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ImageGrid
        images={favorites}
        loading={false}
        refreshing={false}
        loadingMore={false}
        error={null}
        hasNextPage={false}
        onRefresh={() => {}}
        onLoadMore={() => {}}
        onRetry={() => {}}
        onImagePress={handleImagePress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: theme.colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
