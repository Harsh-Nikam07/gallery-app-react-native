export const LAYOUT = {
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
  },
  
  BORDER_RADIUS: {
    SM: 4,
    MD: 8,
    LG: 12,
    XL: 16,
    ROUND: 1000,
  },
  
  SHADOW: {
    SM: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    MD: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    LG: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
  },
};

export const ANIMATION = {
  DURATION: {
    SHORT: 150,
    MEDIUM: 300,
    LONG: 500,
  },
  EASING: {
    STANDARD: 'easeInOut',
    DECELERATE: 'easeOut',
    ACCELERATE: 'easeIn',
  },
};

export const API = {
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  PAGINATION: {
    PAGE_SIZE: 20,
    INITIAL_PAGE: 0,
  },
};

export const STORAGE_KEYS = {
  THEME_PREFERENCE: '@app_theme_preference',
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
  APP_SETTINGS: '@app_settings',
};

export const ERROR_MESSAGES = {
  NETWORK: {
    TITLE: 'Network Error',
    MESSAGE: 'Unable to connect to the server. Please check your internet connection.',
    RETRY: 'Retry',
  },
  SERVER: {
    TITLE: 'Server Error',
    MESSAGE: 'something went wrong on our end. Please try again later.',
  },
  VALIDATION: {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
  },
};

export const SUCCESS_MESSAGES = {
  IMAGE_UPLOAD: 'Image uploaded successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',  
  SETTINGS_SAVED: 'Settings saved successfully!',
};

export const FEATURE_FLAGS = {
  ENABLE_OFFLINE_MODE: true,
  ENABLE_ANALYTICS: false,
  ENABLE_LOGGING: __DEV__,
};

export const APP = {
  NAME: 'Gallery App',
  VERSION: '1.0.0',
  ENVIRONMENT: __DEV__ ? 'development' : 'production',
};
