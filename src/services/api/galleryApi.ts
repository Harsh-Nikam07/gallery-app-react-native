import Constants from 'expo-constants';
import { apiClient } from './apiClient';
import { GalleryImage, ApiResponse } from '../api/types';

class GalleryApi {
  private readonly API_KEY: string;
  private readonly EVENT_ID: string;

  constructor() {
    this.API_KEY = (Constants.expoConfig?.extra?.apiKey ?? process.env.EXPO_PUBLIC_API_KEY ?? '').toString();
    this.EVENT_ID = (Constants.expoConfig?.extra?.eventId ?? process.env.EXPO_PUBLIC_EVENT_ID ?? '').toString();

    if (!this.API_KEY || !this.EVENT_ID) {
      console.warn('API key or Event ID is not set. Please set EXPO_PUBLIC_API_KEY and EXPO_PUBLIC_EVENT_ID in .env or extra in app.config.js');
    }
  }

  async getImages(page: number = 0, pageSize: number = 40): Promise<ApiResponse<GalleryImage[]>> {
    const queryParams = new URLSearchParams({
      event_id: this.EVENT_ID,
      page: page.toString(),
      page_size: pageSize.toString(),
      key: this.API_KEY,
      order_by: '2',
      order_asc: 'true',
    });

    try {
      const response = await apiClient.fetch<any>(`?${queryParams}`);
      const list: any[] = response?.data?.image_list ?? [];
      const images: GalleryImage[] = list.map((img: any, index: number) => ({
        id: img.id ? `${img.id}_${index}_${Date.now()}` : `generated_${index}_${Date.now()}`,
        url: img.high_url ?? img.med_url ?? img.img_url ?? img.url,
        thumbnail_url: img.med_url ?? img.thumbnail_url ?? img.low_url,
        title: img.name ?? img.title,
        caption: img.note ?? img.caption,
        width: img.width,
        height: img.height,
      }));

      return {
        data: images,
        pagination: {
          page,
          page_size: pageSize,
          total: images.length,
          has_next: images.length === pageSize,
        },
        status: 'success',
      };
    } catch (error) {
      let errorMessage = 'Unable to load images. Please try again.';

      if (error instanceof Error) {
        if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
          errorMessage = 'No internet connection. Please check your network and try again.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Connection timeout. Please check your internet speed and try again.';
        } else if (error.message.includes('500') || error.message.includes('503')) {
          errorMessage = 'Server is currently unavailable. Please try again later.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Images not found. Please try refreshing.';
        } else if (error.message.includes('API Error')) {
          errorMessage = error.message.replace('API Error:', '').trim();
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }

      console.log('🛑 Gallery API Error:', error);

      return {
        data: [],
        status: 'error',
        message: errorMessage,
      };
    }
  }
}

export const galleryApi = new GalleryApi();
