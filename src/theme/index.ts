import { colors, ThemeColors } from '../theme/colors';


export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const createTheme = (themeColors: ThemeColors) => ({
  ...themeColors,
  spacing,
});


export const theme = createTheme(colors.light);

export { colors, type ThemeColors };
