import { useState, useCallback } from 'react';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION } from '../constants/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  colors: typeof COLORS;
  fonts: typeof FONTS;
  sizes: typeof SIZES;
  spacing: typeof SPACING;
  borderRadius: typeof BORDER_RADIUS;
  shadows: typeof SHADOWS;
  animation: typeof ANIMATION;
}

const lightTheme: ThemeState = {
  mode: 'light',
  colors: {
    ...COLORS,
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E0E0E0',
  },
  fonts: FONTS,
  sizes: SIZES,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  animation: ANIMATION,
};

const darkTheme: ThemeState = {
  mode: 'dark',
  colors: {
    ...COLORS,
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    border: '#333333',
  },
  fonts: FONTS,
  sizes: SIZES,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  animation: ANIMATION,
};

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeState>(darkTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) =>
      prevTheme.mode === 'light' ? darkTheme : lightTheme
    );
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setTheme(mode === 'light' ? lightTheme : darkTheme);
  }, []);

  return {
    theme,
    toggleTheme,
    setThemeMode,
  };
}; 