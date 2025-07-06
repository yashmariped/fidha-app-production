export const COLORS = {
  // Primary colors
  primary: '#7B4AE2', // Vibrant purple
  primaryLight: '#A084E8',
  primaryDark: '#4B2995',
  
  // Secondary colors
  secondary: '#B388FF', // Light purple
  secondaryLight: '#E0C3FC',
  secondaryDark: '#7C43BD',
  
  // Accent colors
  accent1: '#F3C4FB', // Soft pink
  accent2: '#F5E6FF', // Lightest purple
  accent3: '#FFD6EC', // Light pink
  
  // Background colors
  background: '#7B4AE2', // Main background
  surface: '#A084E8',
  surfaceLight: '#F5E6FF',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#E0C3FC',
  textTertiary: '#B388FF',
  
  // Status colors
  success: '#00FF9D',
  error: '#FF3366',
  warning: '#FFD700',
  info: '#B388FF',
  
  // UI elements
  border: '#A084E8',
  divider: '#B388FF',
  overlay: 'rgba(123, 74, 226, 0.7)',
  
  // Gradients
  gradientPrimary: ['#7B4AE2', '#A084E8'],
  gradientAccent: ['#F3C4FB', '#FFD6EC'],
  gradientDark: ['#4B2995', '#7B4AE2'],
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