import { GalleryImage } from '../services/api/types';

export type RootStackParamList = {
  Main: undefined;
  Home: undefined;
  Favorites: undefined;
  ImageViewer: {
    image: GalleryImage;
    index: number;
    images: GalleryImage[];
  };
};

export type TabParamList = {
  Home: undefined;
  Favorites: undefined;
  Settings: undefined;
};
