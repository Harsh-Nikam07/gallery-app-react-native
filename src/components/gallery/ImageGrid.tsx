import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, RefreshControl, Animated, TouchableOpacity, Text } from 'react-native';
import { GalleryImage } from '../../services/api/types';
import { ImageGridItem } from './ImageGridItem';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { Skeleton } from '../common/Skeleton';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/Feather';


interface ImageGridProps {
  images: GalleryImage[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  hasNextPage: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onRetry: () => void;
  onImagePress: (image: GalleryImage, index: number) => void;
}

const { width } = Dimensions.get('window');
const PADDING = 8;
const ITEM_SPACING = 12;
const NUM_COLUMNS = 3;
const COLUMN_WIDTH = (width - PADDING * 2 - ITEM_SPACING * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

export const ImageGrid = memo<ImageGridProps>(({
  images,
  loading,
  refreshing,
  loadingMore,
  error,
  hasNextPage,
  onRefresh,
  onLoadMore,
  onRetry,
  onImagePress,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.8)).current;
  const { theme } = useTheme();

  // Spliting images into columns for masonry layout and keep track of original indices
  const columns = useMemo(() => {
    const cols: { image: GalleryImage; originalIndex: number }[][] = Array.from(
      { length: NUM_COLUMNS },
      () => []
    );
    images.forEach((image, index) => {
      cols[index % NUM_COLUMNS].push({ image, originalIndex: index });
    });
    return cols;
  }, [images]);

  const handleScroll = useCallback((event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
    
    // Show/hide back to top button
    const shouldShowButton = scrollY > 400;
    if (shouldShowButton !== showBackToTop) {
      setShowBackToTop(shouldShowButton);
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: shouldShowButton ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: shouldShowButton ? 1 : 0.8,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    if (isCloseToBottom && hasNextPage && !loadingMore && !refreshing) {
      onLoadMore();
    }
  }, [hasNextPage, loadingMore, refreshing, onLoadMore, showBackToTop, buttonOpacity, buttonScale]);

  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  }, []);

  const renderSkeletonGrid = useCallback(() => {
    const heights = [180, 220, 160, 240, 200, 180, 260, 140]; // Random heights for skeleton
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.skeletonContainer}>
          {Array.from({ length: NUM_COLUMNS }).map((_, colIndex) => (
            <View key={`col-${colIndex}`} style={styles.column}>
              {heights.map((height, i) => (
                <Skeleton
                  key={`sk-${colIndex}-${i}`}
                  style={{
                    width: COLUMN_WIDTH,
                    height,
                    marginBottom: ITEM_SPACING,
                    borderRadius: 12,
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }, []);

  if (loading && images.length === 0) {
    return renderSkeletonGrid();
  }

  if (error && images.length === 0) {
    return (
      <ErrorMessage
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (!loading && images.length === 0) {
    return (
      <ErrorMessage
        title="No images"
        message={'No images found. Pull to refresh or try again.'}
        onRetry={onRetry}
      />
    );
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.background }]}>
      <ScrollView
        ref={scrollViewRef}
        style={[styles.container, { backgroundColor: theme.background }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.masonryContainer}>
        {columns.map((column, columnIndex) => (
          <View key={`column-${columnIndex}`} style={styles.column}>
            {column.map((item, itemIndex) => (
              <ImageGridItem
                key={`${item.image.id}-${item.originalIndex}`}
                image={item.image}
                width={COLUMN_WIDTH}
                onPress={() => onImagePress(item.image, item.originalIndex)}
              />
            ))}
          </View>
        ))}
        </View>
        {loadingMore && (
          <View style={styles.footer}>
            <LoadingSpinner size="small" />
          </View>
        )}
      </ScrollView>
      
      {/* Back to Top Button */}
      <Animated.View
        style={[
          styles.backToTopContainer,
          {
            opacity: buttonOpacity,
            transform: [{ scale: buttonScale }],
            pointerEvents: showBackToTop ? 'auto' : 'none',
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.backToTopButton,
            {
              backgroundColor: theme.card,
            },
          ]}
          onPress={scrollToTop}
          activeOpacity={0.8}
          >
            <Icon name="arrow-up" size={30} color={theme.text} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  masonryContainer: {
    flexDirection: 'row',
    paddingHorizontal: PADDING,
    paddingTop: PADDING,
  },
  column: {
    flex: 1,
    marginHorizontal: ITEM_SPACING / 2,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  backToTopContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  backToTopButton: {
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backToTopGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToTopArrow: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: -2,
  },
  backToTopText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  skeletonContainer: {
    flexDirection: 'row',
    paddingHorizontal: PADDING,
    paddingTop: PADDING,
  },
});
