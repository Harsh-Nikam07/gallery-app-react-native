export interface GalleryImage {
    id: string;
    url: string;
    thumbnail_url?: string;
    title?: string;
    caption?: string;
    author?: string;
    tags?: string[];
    width?: number;
    height?: number;
    created_at?: string;
    file_size?: number;
  }
  
  export interface ApiResponse<T> {
    data: T;
    pagination?: {
      page: number;
      page_size: number;
      total: number;
      has_next: boolean;
    };
    status: 'success' | 'error';
    message?: string;
  }
  
  export interface GalleryApiParams {
    event_id: string;
    page: number;
    page_size: number;
    key: string;
    order_by: number;
    order_asc: boolean;
  }