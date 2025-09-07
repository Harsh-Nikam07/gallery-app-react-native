import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';

interface NetworkState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: NetInfoStateType | null;
  isWifi: boolean;
  isCellular: boolean;
  isOffline: boolean;
}

const initialState: NetworkState = {
  isConnected: null,
  isInternetReachable: null,
  type: null,
  isWifi: false,
  isCellular: false,
  isOffline: true,
};

export const useNetworkStatus = (): NetworkState => {
  const [networkState, setNetworkState] = useState<NetworkState>(initialState);
  const [appState, setAppState] = useState<AppStateStatus>('active');

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Handle network state changes
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      if (isMounted) {
        const newState: NetworkState = {
          isConnected: state.isConnected,
          isInternetReachable: state.isInternetReachable,
          type: state.type,
          isWifi: state.type === 'wifi',
          isCellular: state.type === 'cellular',
          isOffline: !state.isConnected || !state.isInternetReachable,
        };
        setNetworkState(newState);
      }
    });

    // Initial network state fetch
    const fetchNetworkState = async () => {
      try {
        const state = await NetInfo.fetch();
        if (isMounted) {
          setNetworkState({
            isConnected: state.isConnected,
            isInternetReachable: state.isInternetReachable,
            type: state.type,
            isWifi: state.type === 'wifi',
            isCellular: state.type === 'cellular',
            isOffline: !state.isConnected || !state.isInternetReachable,
          });
        }
      } catch (error) {
        console.log('🛑 Error fetching network state:', error);
      }
    };

    fetchNetworkState();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [appState]);

  return networkState;
};


