import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Alert,
  ViewToken,
} from 'react-native';
import { Image } from 'expo-image';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Feather';

type ImageViewerScreenRouteProp = RouteProp<RootStackParamList, 'ImageViewer'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const ImageViewer: React.FC = () => {
  const route = useRoute<ImageViewerScreenRouteProp>();
  const navigation = useNavigation();
  const { images: initialImages, index: initialIndex, image: initialImage } = route.params;
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [images] = useState(initialImages);
  const [imageLoading, setImageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { theme } = useTheme();
  
  const currentImage = images[currentIndex];
  const isFav = isFavorite(currentImage.id);

  const handleClose = () => {
    navigation.goBack();
  };

  const saveImage = async () => {
    try {
      setSaving(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow access to save images.');
        return;
      }

      const fileUri = FileSystem.documentDirectory + `image_${Date.now()}.jpg`;
      const downloadResult = await FileSystem.downloadAsync(currentImage.url, fileUri);
      
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      await MediaLibrary.createAlbumAsync('Gallery App', asset, false);
      
      Alert.alert('Success', 'Image saved to gallery!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save image');
      console.log('ðŸ›‘ Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const shareImage = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + `share_${Date.now()}.jpg`;
      const downloadResult = await FileSystem.downloadAsync(currentImage.url, fileUri);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadResult.uri);
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share image');
      console.log('ðŸ›‘ Share error:', error);
    }
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(currentImage);
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      if (newIndex !== null && newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        setImageLoading(true);
      }
    }
  }, [currentIndex]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderImageItem = useCallback(({ item: img, index }: { item: any, index: number }) => (
    <View key={`img-${index}-${img.id}`} style={styles.imageWrapper}>
      <View style={styles.imageContainer}>
        {img.thumbnail_url && (
          <Image
            source={{ uri: img.thumbnail_url }}
            style={[styles.image, styles.thumbnailImage]}
            contentFit="contain"
            blurRadius={imageLoading && index === currentIndex ? 20 : 0}
          />
        )}
        
        <Image
          source={{ uri: img.url }}
          style={styles.image}
          contentFit="contain"
          priority={index === currentIndex ? "high" : "low"}
          cachePolicy="memory-disk"
          onLoadStart={() => index === currentIndex && setImageLoading(true)}
          onLoad={() => index === currentIndex && setImageLoading(false)}
        />
        
        {/* {imageLoading && index === currentIndex && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )} */}
      </View>
    </View>
  ), [imageLoading, currentIndex]);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'transparent']}
        style={styles.topGradient}
      />
      
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <View style={styles.iconContainer}>
            <Icon2 name="x" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <View style={styles.counterContainer}>
          <Text style={styles.counter}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>
      </SafeAreaView>

      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => `img-${index}-${item.id}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
        initialScrollIndex={initialIndex}
        windowSize={3}
        maxToRenderPerBatch={2}
        removeClippedSubviews={true}
        initialNumToRender={1}
      />

      {/* Action buttons */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.bottomGradient}
      >
        <SafeAreaView style={styles.footer}>
          {currentImage.title && (
            <View style={styles.infoContainer}>
              <Text style={styles.title} numberOfLines={1}>{currentImage.title}</Text>
              {currentImage.caption && (
                <Text style={styles.caption} numberOfLines={2}>{currentImage.caption}</Text>
              )}
            </View>
          )}
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleFavoriteToggle}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, isFav && styles.favoriteActive]}>
                {isFav ? <Icon name="heart" size={24} color={theme.favorite} /> : <Icon name="heart-o" size={24} color={theme.favorite} />}
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={shareImage}
              activeOpacity={0.7}
            >
              <View style={styles.actionIcon}>
                <Icon2 name="share" size={24} color="white" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={saveImage}
              activeOpacity={0.7}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <View style={styles.actionIcon}>
                  <Icon2 name="download" size={24} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  closeButton: {
    padding: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  counterContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  counter: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  imageWrapper: {
    width: screenWidth,
    height: screenHeight,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: screenWidth,
    height: screenHeight,
    position: 'absolute',
  },
  thumbnailImage: {
    zIndex: 0,
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoContainer: {
    marginBottom: 16,
  },
  title: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  caption: {
    color: 'white',
    fontSize: 10,
    opacity: 0.9,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    // Container style for the icon
  },
  actionIconText: {
    fontSize: 24,
    lineHeight: 24, // Ensures proper vertical alignment
  },
  favoriteActive: {
    transform: [{ scale: 1.1 }],
  },
});