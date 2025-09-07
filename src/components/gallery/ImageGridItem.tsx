import React, { memo, useRef, useState, useMemo } from 'react';
import { StyleSheet, View, Animated, Pressable, Text } from 'react-native';
import { Image } from 'expo-image';
import { GalleryImage } from '../../services/api/types';
import { useFavorites } from '../../context/FavoritesContext';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

interface ImageGridItemProps {
  image: GalleryImage;
  width: number;
  onPress: (image: GalleryImage) => void;
}

export const ImageGridItem = memo<ImageGridItemProps>(({ image, width, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isFavorite } = useFavorites();
  const { theme } = useTheme();

  // Calculating dynamic height based on aspect ratio
  const imageHeight = useMemo(() => {
    if (image.width && image.height) {
      const aspectRatio = image.height / image.width;
      return width * aspectRatio;
    }
    return 150 + Math.random() * 100;
  }, [image, width]);

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}> 
      <Pressable
        style={[
          styles.container,
          {
            width,
            height: imageHeight,
            backgroundColor: theme.card,
            shadowOpacity: 0.08,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 4,
            elevation: 3,
          }
        ]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => onPress(image)}
      >
        <Image
          source={{ uri: image.thumbnail_url || image.url }}
          style={styles.image}
          contentFit="cover"
          placeholder={{ uri: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' }}
          transition={300}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <View style={[styles.loadingOverlay, { backgroundColor: theme.surface }]} />
        )}
        {isFavorite(image.id) && (
          <View style={[styles.favoriteIndicator, { backgroundColor: theme.overlay }]}>
            <Icon name="heart" size={16} color={theme.favorite} />
          </View>
        )}
        {/* {image.title && (
          <View style={[
            styles.titleContainer,
            { backgroundColor: isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.95)' }
          ]}>
            <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]} numberOfLines={2}>
              {image.title}
            </Text>
          </View>
        )} */}
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  title: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
  },
  favoriteIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 14,
  },
});
