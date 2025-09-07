import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GalleryImage } from '../services/api/types';

interface FavoritesContextType {
  favorites: GalleryImage[];
  isFavorite: (imageId: string) => boolean;
  toggleFavorite: (image: GalleryImage) => Promise<void>;
  clearFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_KEY = '@gallery_favorites';

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<GalleryImage[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveFavorites = async (newFavorites: GalleryImage[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.log(error);
    }
  };

  const isFavorite = (imageId: string): boolean => {
    return favorites.some(fav => fav.id === imageId);
  };

  const toggleFavorite = async (image: GalleryImage) => {
    const newFavorites = isFavorite(image.id)
      ? favorites.filter(fav => fav.id !== image.id)
      : [...favorites, image];
    await saveFavorites(newFavorites);
  };

  const clearFavorites = async () => {
    await saveFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
