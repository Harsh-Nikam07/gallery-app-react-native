# Gallery App 📸

A modern, performant React Native gallery application built with Expo, featuring infinite scroll, dark/light themes, favorites, and offline support.

![Gallery App Demo](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Gallery+App+Demo)

## ✨ Features

- 🖼️ **Infinite Scroll Gallery** with masonry layout
- 🌙 **Dark/Light/System Theme** with persistent preferences
- ❤️ **Favorites System** with local storage
- 📱 **Offline Support** with network status detection
- 💾 **Image Caching** for smooth performance
- 📤 **Share & Save** images to device
- 🔄 **Pull-to-Refresh** functionality
- ⚡ **Optimized Performance** with lazy loading and virtualization

## 🚀 Setup & Run Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GalleryApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file and configure your API settings:
   ```env
   EXPO_PUBLIC_API_BASE_URL=https://api.fotoowl.com/v1
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

### Running on Devices

#### iOS
```bash
npm run ios
# or
yarn ios
```

#### Android
```bash
npm run android
# or
yarn android
```

#### Web (Development Only)
```bash
npm run web
# or
yarn web
```

### Building for Production

#### iOS
```bash
expo build:ios
# or use EAS Build
eas build --platform ios
```

#### Android
```bash
expo build:android
# or use EAS Build
eas build --platform android
```

## 🏗️ Architecture Overview

### High-Level Architecture

The Gallery App follows a modular, context-driven architecture designed for scalability and maintainability. The application is built using React Native with Expo, leveraging modern React patterns and TypeScript for type safety.

The core architecture centers around three main contexts: **ThemeContext** for UI theming, **FavoritesContext** for user preferences, and **ApiContext** for data management. This context-driven approach ensures clean separation of concerns while providing global state management without the complexity of external state management libraries. The navigation system uses React Navigation v7 with a stack-based structure, allowing for smooth transitions between the main gallery, image viewer, favorites, and settings screens.

### Component Structure & Data Flow

The component hierarchy follows a clear separation between screens, reusable components, and business logic. Screens handle navigation and high-level state orchestration, while components focus on UI presentation and user interactions. Custom hooks like `useGalleryData` and `useNetworkStatus` encapsulate complex business logic, making components cleaner and more testable. The data flow is unidirectional, with API calls managed through a centralized service layer that handles caching, error handling, and retry logic.

### Performance & Optimization Trade-offs

The application prioritizes smooth user experience through several performance optimizations, sometimes at the cost of simplicity. The masonry layout provides an attractive Pinterest-style grid but requires more complex calculations than a simple FlatList. Image caching improves user experience significantly but increases memory usage and complexity. The infinite scroll implementation with virtualization keeps memory usage low for large datasets but adds complexity to state management. The theme system uses React Context, which can cause unnecessary re-renders, but provides excellent developer experience and maintainability compared to prop drilling.

## ⚡ Performance Optimizations

### Smooth Scrolling & Memory Management

#### Image Loading & Caching
- **Progressive Loading**: Images load thumbnail first, then full resolution
- **Memory-Disk Caching**: Expo Image with configurable cache policies
- **Lazy Loading**: Images only load when approaching viewport
- **Placeholder Strategy**: Lightweight base64 placeholders prevent layout jumps

#### Virtualization & Rendering
- **Masonry Layout**: Custom column-based virtualization for Pinterest-style layout
- **Window Size Management**: Limited render window (`windowSize={3}`) to reduce memory footprint
- **Remove Clipped Subviews**: Enabled to free memory for off-screen items
- **Batch Rendering**: `maxToRenderPerBatch={2}` prevents UI blocking during scrolls

#### State & Context Optimization
- **Memoized Components**: Heavy use of `React.memo` and `useMemo` for expensive operations
- **Context Splitting**: Separate contexts (Theme, Favorites, Api) to minimize re-renders
- **Callback Optimization**: `useCallback` for event handlers to prevent child re-renders
- **Throttled Scroll Events**: `scrollEventThrottle={16}` for 60fps scroll performance

#### Network & Data Management
- **Request Deduplication**: Prevents duplicate API calls for same data
- **Intelligent Pagination**: Pre-fetches next page when user is 100px from bottom
- **Error Boundaries**: Graceful handling of image load failures
- **Offline Caching**: AsyncStorage for favorites and settings persistence

### Memory Usage Strategies
- **Image Compression**: Automatic image sizing based on screen density
- **Garbage Collection**: Explicit cleanup in useEffect returns
- **Background Processing**: Heavy operations moved to background threads where possible

## 🔧 Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `EXPO_PUBLIC_API_BASE_URL` | Base URL for the gallery API | ✅ Yes | - |
| `EXPO_PUBLIC_API_KEY` | API key for authentication | ❌ No | - |
| `EXPO_PUBLIC_DEBUG_MODE` | Enable debug logging | ❌ No | `false` |
| `EXPO_PUBLIC_IMAGE_CACHE_SIZE` | Max cached images | ❌ No | `100` |

## 🛠️ Tech Stack

- **Framework**: React Native + Expo
- **Navigation**: React Navigation v7
- **State Management**: React Context + Custom Hooks
- **Image Handling**: Expo Image with caching
- **Storage**: AsyncStorage + Expo FileSystem
- **Network**: Axios with retry logic
- **Icons**: React Native Vector Icons
- **Animations**: React Native Reanimated
- **TypeScript**: Full type safety
- **Testing**: Detox (E2E testing setup)

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (LoadingSpinner, ErrorMessage)
│   └── gallery/         # Gallery-specific components
├── context/             # React Context providers
│   ├── ApiContext.tsx   # API state management
│   ├── FavoritesContext.tsx
│   └── ThemeContext.tsx
├── hooks/               # Custom React hooks
│   ├── useGalleryData.ts
│   └── useNetworkStatus.ts
├── navigation/          # Navigation configuration
├── screens/             # Screen components
├── services/            # API and external services
│   └── api/            # API client and types
├── theme/              # Theme configuration and colors
└── types/              # TypeScript type definitions
```

## 🚫 Known Limitations

### Current Limitations

1. **Image Search**: No search functionality implemented
2. **Image Details**: Limited metadata display (title, caption only)
3. **Offline Mode**: Read-only when offline (no image saving/sharing)
4. **Image Upload**: No user image upload capability
5. **Social Features**: No comments, likes, or user profiles
6. **Push Notifications**: No real-time updates or notifications

### Technical Limitations

1. **Memory Usage**: Large image collections may impact performance on low-memory devices
2. **Network Dependency**: Requires internet connection for initial image loading
3. **Platform Differences**: Some features may behave differently between iOS/Android
4. **Cache Management**: No automatic cache cleanup (manual intervention required)

## 🔮 Next Steps & Roadmap

### Phase 1: Core Improvements
- [ ] **Search Functionality**: Add image search with filters (tags, colors, orientation)
- [ ] **Advanced Caching**: Implement intelligent cache management with size limits
- [ ] **Performance Monitoring**: Add performance metrics and crash reporting
- [ ] **Accessibility**: Improve screen reader support and keyboard navigation

### Phase 2: Feature Expansion
- [ ] **User Authentication**: Login system with cloud sync for favorites
- [ ] **Collections**: Organize favorites into custom collections/albums
- [ ] **Image Upload**: Allow users to upload and share their own images
- [ ] **Social Features**: Comments, likes, and user profiles

### Phase 3: Advanced Features
- [ ] **AI-Powered Recommendations**: Suggest images based on viewing history
- [ ] **Collaborative Collections**: Share and collaborate on image collections
- [ ] **Advanced Editing**: Basic image editing tools (crop, filters, adjustments)
- [ ] **Push Notifications**: Notify users of new collections or updates

### Technical Improvements
- [ ] **Migration to React Native New Architecture**: Adopt Fabric and TurboModules
- [ ] **Advanced State Management**: Consider Zustand or Redux Toolkit for complex state
- [ ] **Testing Coverage**: Increase unit and integration test coverage
- [ ] **CI/CD Pipeline**: Automated testing and deployment pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [FotoOwl API](https://api.fotoowl.com) for providing the image gallery API
- [Expo](https://expo.io) for the amazing development platform
- [React Native Community](https://reactnative.dev) for the fantastic ecosystem
- All the open-source contributors who made this project possible

---

**Built with ❤️ using React Native & Expo**
