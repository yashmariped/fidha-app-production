import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'glass' | 'gradient';
  elevation?: 'light' | 'medium' | 'dark' | 'glow';
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  elevation = 'medium',
}) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getCardStyle = () => {
    const baseStyle = [styles.card, styles[elevation]];

    switch (variant) {
      case 'glass':
        return [...baseStyle, styles.glassCard];
      case 'gradient':
        return [...baseStyle, styles.gradientCard];
      default:
        return [...baseStyle, styles.defaultCard];
    }
  };

  const renderContent = () => {
    if (variant === 'gradient') {
      return (
        <LinearGradient
          colors={COLORS.gradientPrimary as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      );
    }
    return children;
  };

  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <CardContainer
        style={[getCardStyle(), style]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {renderContent()}
      </CardContainer>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.l,
    padding: SPACING.m,
    overflow: 'hidden',
  },
  defaultCard: {
    backgroundColor: COLORS.surface,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  gradientCard: {
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
    padding: SPACING.m,
  },
  light: {
    ...SHADOWS.light,
  },
  medium: {
    ...SHADOWS.medium,
  },
  dark: {
    ...SHADOWS.dark,
  },
  glow: {
    ...SHADOWS.glow,
  },
});

export default Card; 