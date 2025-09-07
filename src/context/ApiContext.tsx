import React, { createContext, useContext, ReactNode, useCallback, useState } from 'react';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

type ApiResponse<T = any> = {
  data: T;
  status: number;
  statusText: string;
};

type ApiContextType = {
  get: <T>(url: string, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
  post: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) => Promise<ApiResponse<T>>;
  put: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) => Promise<ApiResponse<T>>;
  del: <T>(url: string, config?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
  isLoading: boolean;
  error: Error | null;
  clearError: () => void;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

const api: AxiosInstance = axios.create({
  baseURL: 'https://openapi.fotoowl.ai/open/event/image-list?event_id=154770&page=0&page_size=40&key=4030&order_by=2&order_asc=true',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { isConnected } = useNetworkStatus();

  const handleError = useCallback((error: any) => {
    if (error.response) {
      setError(
        new Error(
          `Request failed with status ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`
        )
      );
    } else if (error.request) {
      setError(new Error('No response received from server'));
    } else {
      setError(new Error(error.message || 'An unknown error occurred'));
    }
    throw error;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const get = useCallback(
    async <T,>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
      if (!isConnected) {
        throw new Error('No internet connection');
      }

      setIsLoading(true);
      try {
        const response: AxiosResponse<T> = await api.get<T>(url, config);
        return {
          data: response.data,
          status: response.status,
          statusText: response.statusText,
        };
      } catch (error) {
        return handleError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, handleError]
  );

  const post = useCallback(
    async <T,>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> => {
      if (!isConnected) {
        throw new Error('No internet connection');
      }

      setIsLoading(true);
      try {
        const response: AxiosResponse<T> = await api.post<T>(url, data, config);
        return {
          data: response.data,
          status: response.status,
          statusText: response.statusText,
        };
      } catch (error) {
        return handleError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, handleError]
  );

  const put = useCallback(
    async <T,>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> => {
      if (!isConnected) {
        throw new Error('No internet connection');
      }

      setIsLoading(true);
      try {
        const response: AxiosResponse<T> = await api.put<T>(url, data, config);
        return {
          data: response.data,
          status: response.status,
          statusText: response.statusText,
        };
      } catch (error) {
        return handleError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, handleError]
  );

  const del = useCallback(
    async <T,>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
      if (!isConnected) {
        throw new Error('No internet connection');
      }

      setIsLoading(true);
      try {
        const response: AxiosResponse<T> = await api.delete<T>(url, config);
        return {
          data: response.data,
          status: response.status,
          statusText: response.statusText,
        };
      } catch (error) {
        return handleError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, handleError]
  );

  const value = {
    get,
    post,
    put,
    del,
    isLoading,
    error,
    clearError,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export default ApiContext;
