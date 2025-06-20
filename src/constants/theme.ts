export const COLORS = {
  // Primary colors
  primary: '#6C63FF', // Modern purple
  primaryLight: '#8A84FF',
  primaryDark: '#4A42E0',
  
  // Secondary colors
  secondary: '#00F5FF', // Cyan
  secondaryLight: '#33F7FF',
  secondaryDark: '#00D6E0',
  
  // Accent colors
  accent1: '#FF3366', // Neon pink
  accent2: '#00FF9D', // Neon green
  accent3: '#FFD700', // Gold
  
  // Background colors
  background: '#0A0A0F', // Dark background
  surface: '#1A1A24',
  surfaceLight: '#2A2A34',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textTertiary: '#808080',
  
  // Status colors
  success: '#00FF9D',
  error: '#FF3366',
  warning: '#FFD700',
  info: '#00F5FF',
  
  // UI elements
  border: '#2A2A34',
  divider: '#1A1A24',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Gradients
  gradientPrimary: ['#6C63FF', '#00F5FF'],
  gradientAccent: ['#FF3366', '#FFD700'],
  gradientDark: ['#0A0A0F', '#1A1A24'],
};

export const FONTS = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  bold: 'Inter-Bold',
  light: 'Inter-Light',
};

export const SIZES = {
  // Global sizes
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,

  // Font sizes
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 18,
  body1: 16,
  body2: 14,
  body3: 12,
  caption: 10,

  // App dimensions
  width: '100%',
  height: '100%',
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  dark: {
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  glow: {
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

export const ANIMATION = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    easeIn: 'ease-in',
  },
};

export const BORDER_RADIUS = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  round: 9999,
}; 