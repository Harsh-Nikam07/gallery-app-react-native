import { useState, useEffect, useCallback } from 'react';
import { galleryApi } from '../services/api/galleryApi';
import { GalleryImage } from '../services/api/types';

interface UseGalleryDataReturn {
  images: GalleryImage[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  hasNextPage: boolean;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useGalleryData = (): UseGalleryDataReturn => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);

  const fetchImages = useCallback(async (page: number, reset = false) => {
    try {
      const response = await galleryApi.getImages(page);
      if (response.status === 'error') throw new Error(response.message || 'Failed to fetch images');
      setImages(prev => reset ? response.data : [...prev, ...response.data]);
      setHasNextPage(response.pagination?.has_next ?? false);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchImages(0, true);
    setRefreshing(false);
  }, [fetchImages]);

  const loadMore = useCallback(async () => {
    if (!hasNextPage || loadingMore) return;
    
    setLoadingMore(true);
    await fetchImages(currentPage + 1);
    setLoadingMore(false);
  }, [fetchImages, currentPage, hasNextPage, loadingMore]);

  useEffect(() => {
    fetchImages(0, true).finally(() => setLoading(false));
  }, [fetchImages]);

  return {
    images,
    loading,
    refreshing,
    loadingMore,
    error,
    hasNextPage,
    refresh,
    loadMore,
  };
};
