export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
export const ENDPOINTS = {
  IMAGES: {
    LIST: '/images',
    DETAIL: (id: string) => `/images/${id}`,
    UPLOAD: '/images/upload',
  },
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/me',
  },
};

export const DEFAULT_PAGINATION = {
  PAGE_SIZE: 20,
  INITIAL_PAGE: 0,
};

export const REQUEST_TIMEOUT = 30000;
export const MAX_RETRIES = 3;

export const CACHE = {
  DEFAULT_EXPIRY: 5 * 60 * 1000,
  KEYS: {
    IMAGES: 'cached_images',
    USER: 'user_session',
  },
};

export default {
  API_BASE_URL,
  ENDPOINTS,
  DEFAULT_PAGINATION,
  REQUEST_TIMEOUT,
  MAX_RETRIES,
  CACHE,
};
