export const colors = {
    light: {
      // Backgrounds
      background: 'rgb(255, 255, 255)',  // #ffffff
      surface: 'rgb(245, 245, 245)',  // #f5f5f5
      surfaceSecondary: 'rgb(249, 249, 249)',  // #f9f9f9
      card: 'rgb(255, 255, 255)',  // #ffffff
      overlay: 'rgba(0, 0, 0, 0.5)',
      
      // Text colors
      text: 'rgb(0, 0, 0)',  // #000000
      textSecondary: 'rgb(102, 102, 102)',  // #666666
      textTertiary: 'rgb(172, 172, 172)',  // #acacac
      
      // Interactive colors
      primary: 'rgb(0, 122, 255)',  // #007aff
      error: 'rgb(255, 59, 48)',  // #ff3b30
      warning: 'rgb(255, 107, 107)',  // #FF6B6B
      success: 'rgb(52, 199, 89)',  // #34c759
      
      // Borders and separators
      border: 'rgb(240, 240, 240)',  // #f0f0f0
      separator: 'rgb(229, 229, 229)',  // #e5e5e5
      
      // Special colors
      skeleton: 'rgb(225, 233, 238)',  // #E1E9EE
      favorite: 'rgb(255, 59, 48)',  // #ff3b30 - red for hearts
      offlineBanner: 'rgb(255, 107, 107)',  // #FF6B6B
    },
    dark: {
      // Backgrounds
      background: 'rgb(0, 0, 0)',  // #000000
      surface: 'rgb(28, 28, 30)',  // #1c1c1e
      surfaceSecondary: 'rgb(31, 31, 31)',  // #1f1f1f
      card: 'rgb(28, 28, 30)',  // #1c1c1e
      overlay: 'rgba(255, 255, 255, 0.1)',
      
      // Text colors
      text: 'rgb(255, 255, 255)',  // #ffffff
      textSecondary: 'rgb(153, 153, 153)',  // #999999
      textTertiary: 'rgb(172, 172, 172)',  // #acacac
      
      // Interactive colors
      primary: 'rgb(10, 132, 255)',  // #0a84ff
      error: 'rgb(255, 79, 58)',  // #ff453a
      warning: 'rgb(255, 107, 107)',  // #FF6B6B
      success: 'rgb(48, 209, 88)',  // #30d158
      
      // Borders and separators
      border: 'rgb(51, 51, 51)',  // #333333
      separator: 'rgb(44, 44, 46)',  // #2c2c2e
      
      // Special colors
      skeleton: 'rgb(51, 51, 51)',  // #333333
      favorite: 'rgb(255, 79, 58)',  // #ff453a - red for hearts
      offlineBanner: 'rgb(255, 107, 107)',  // #FF6B6B
    },
  };


export type ThemeColors = typeof colors.light;
