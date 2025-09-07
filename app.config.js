// Learn more: https://docs.expo.dev/guides/environment-variables/
module.exports = {
  expo: {
    name: 'GalleryApp',
    slug: 'GalleryApp',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [],
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
      apiKey: process.env.EXPO_PUBLIC_API_KEY,
      eventId: process.env.EXPO_PUBLIC_EVENT_ID,
      eas: {
        projectId: "6ae0699b-fd0a-406b-9a38-50d61afa62f4"
      }
    },
  },
};