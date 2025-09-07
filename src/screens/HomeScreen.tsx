import React, { useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ImageGrid } from '../components/gallery/ImageGrid';
import { useGalleryData } from '../hooks/useGalleryData';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { RootStackParamList } from '../types/navigation';
import { GalleryImage } from '../services/api/types';
import { useTheme } from '../context/ThemeContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { isOffline } = useNetworkStatus();
  const { theme } = useTheme();
  const {
    images,
    loading,
    refreshing,
    loadingMore,
    error,
    hasNextPage,
    refresh,
    loadMore,
  } = useGalleryData();

  const handleImagePress = useCallback((image: GalleryImage, index: number) => {
    navigation.navigate('ImageViewer', {
      image,
      index,
      images,
    });
  }, [navigation, images]);

  const handleRetry = useCallback(() => {
    refresh();
  }, [refresh]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {isOffline && (
        <View style={[styles.offlineBanner, { backgroundColor: theme.offlineBanner }]}>
          <Text style={styles.offlineIcon}>📵</Text>
          <Text style={[styles.offlineText, { color: theme.text }]}>You're offline</Text>
        </View>
      )}
      <ImageGrid
        images={images}
        loading={loading}
        refreshing={refreshing}
        loadingMore={loadingMore}
        error={error}
        hasNextPage={hasNextPage}
        onRefresh={refresh}
        onLoadMore={loadMore}
        onRetry={handleRetry}
        onImagePress={handleImagePress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  offlineBanner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  offlineText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
