import Constants from 'expo-constants';

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = (Constants.expoConfig?.extra?.apiBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

    if (!this.baseUrl) {
      console.warn('API base URL is not set. Please set EXPO_PUBLIC_API_BASE_URL in .env or extra.apiBaseUrl in app.config.js');
    }
  }

  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const timeoutMs = 30000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `${response.status}`;
        
        if (response.status === 404) {
          errorMessage = 'API Error: 404 Resource not found';
        } else if (response.status === 500) {
          errorMessage = 'API Error: 500 Server error';
        } else if (response.status === 503) {
          errorMessage = 'API Error: 503 Service unavailable';
        } else if (response.status === 401) {
          errorMessage = 'API Error: 401 Unauthorized';
        } else if (response.status === 403) {
          errorMessage = 'API Error: 403 Forbidden';
        } else {
          errorMessage = `API Error: ${response.status} ${response.statusText}`;
        }
        
        const errorText = await response.text().catch(() => '');
        console.log('🛑 API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          url,
          response: errorText,
        });
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.log('🛑 Request timeout:', url);
        throw new Error('Request timeout: Connection took too long');
      } else if (error.message === 'Network request failed') {
        console.log('🛑 Network error:', error);
        throw new Error('Network request failed: Please check your internet connection');
      } else if (error.message.includes('API Error:')) {
        throw error;
      } else {
        console.log('🛑 API Request Failed:', error);
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  }
}

export const apiClient = new ApiClient();
