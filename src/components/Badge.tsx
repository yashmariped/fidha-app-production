import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';

interface BadgeProps {
  value?: number | string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  dot?: boolean;
  pulse?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  value,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  dot = false,
  pulse = false,
}) => {
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    if (pulse) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      pulseAnimation.start();

      return () => {
        pulseAnimation.stop();
      };
    }
  }, [pulse]);

  const getVariantColor = () => {
    switch (variant) {
      case 'secondary':
        return COLORS.secondary;
      case 'success':
        return COLORS.success;
      case 'warning':
        return COLORS.warning;
      case 'error':
        return COLORS.error;
      default:
        return COLORS.primary;
    }
  };

  const getSize = () => {
    if (dot) {
      switch (size) {
        case 'small':
          return 8;
        case 'large':
          return 12;
        default:
          return 10;
      }
    }

    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return SIZES.caption;
      case 'large':
        return SIZES.body2;
      default:
        return SIZES.body3;
    }
  };

  const getPadding = () => {
    if (dot) return 0;
    switch (size) {
      case 'small':
        return SPACING.xs;
      case 'large':
        return SPACING.s;
      default:
        return SPACING.xs;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getVariantColor(),
          width: dot ? getSize() : undefined,
          height: getSize(),
          minWidth: dot ? getSize() : getSize() * 1.5,
          paddingHorizontal: getPadding(),
          transform: [{ scale: pulseAnim }],
        },
        style,
      ]}
    >
      {!dot && value && (
        <Text
          style={[
            styles.text,
            {
              fontSize: getFontSize(),
            },
            textStyle,
          ]}
        >
          {value}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: COLORS.text,
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },
});

export default Badge; 