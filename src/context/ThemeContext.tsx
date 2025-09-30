import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { useColorScheme, Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../theme/colors";

type Theme = typeof colors.light;
type ThemeMode = "light" | "dark" | "system";

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
};


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_KEY = "@app_theme_preference";

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme(); // initial value
  console.log("📱 Device reports:", Appearance.getColorScheme());
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(
    systemColorScheme ?? "dark"
  );
  const [themeMode, setThemeModeState] = useState<ThemeMode>("dark");
  const [isInitialized, setIsInitialized] = useState(false);

  // Keep systemTheme updated when OS changes theme
  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme === "light" || colorScheme === "dark") {
        setSystemTheme(colorScheme);
      }
    });

    // initialize on mount too
    if (systemColorScheme === "dark" || systemColorScheme === "light") {
      setSystemTheme(systemColorScheme);
    };

    return () => listener.remove();
  }, [systemColorScheme]);

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
          setThemeModeState(savedTheme as ThemeMode);
        } else {
          setThemeModeState("dark");
        }
      } catch (error) {
        console.log("🛑 Error loading theme preference:", error);
        setThemeModeState("dark");
      } finally {
        setIsInitialized(true);
      };
    };
    loadThemePreference();
  }, []);

  const [forceDark, setForceDark] = useState(false);
  // Decide if dark mode is active
  const isDark = useMemo(() => {
    if (themeMode === "system") {
      if (systemTheme == null || systemTheme === "light") {
        // fallback: let user decide manually
        return forceDark;
      }
      return systemTheme === "dark";
    }
    return themeMode === "dark";
  }, [themeMode, systemTheme, forceDark]);
  

  const theme = isDark ? colors.dark : colors.light;

  const saveThemePreference = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
    } catch (error) {
      console.log("🛑 Error saving theme preference:", error);
    }
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    saveThemePreference(mode);
  };

  const toggleTheme = () => {
    const nextMode: ThemeMode = themeMode === "system" ? "light" : themeMode === "light" ? "dark" : "system";
    setThemeMode(nextMode);
  };

  const setTheme = (dark: boolean) => {
    setThemeMode(dark ? "dark" : "light");
  };

  const contextValue = useMemo(
    () => ({
      theme,
      isDark,
      themeMode,
      setThemeMode,
      toggleTheme,
      setTheme,
    }),
    [theme, isDark, themeMode]
  );

  if (!isInitialized) return null;

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
