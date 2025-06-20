import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  showIcon?: boolean;
  position?: 'top' | 'bottom';
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  style,
  textStyle,
  showIcon = true,
  position = 'top',
}) => {
  const translateY = new Animated.Value(position === 'top' ? -100 : 100);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: position === 'top' ? -100 : 100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onClose?.();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return COLORS.success;
      case 'error':
        return COLORS.error;
      case 'warning':
        return COLORS.warning;
      default:
        return COLORS.primary;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getTypeColor(),
          transform: [{ translateY }],
          opacity,
        },
        style,
      ]}
    >
      {showIcon && (
        <Text style={styles.icon}>
          {getIcon()}
        </Text>
      )}
      <Text style={[styles.message, textStyle]}>{message}</Text>
      {onClose && (
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: SPACING.l,
    right: SPACING.l,
    padding: SPACING.m,
    borderRadius: BORDER_RADIUS.m,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 9999,
  },
  icon: {
    marginRight: SPACING.s,
    fontSize: 20,
    color: COLORS.text,
  },
  message: {
    flex: 1,
    color: COLORS.text,
    fontFamily: FONTS.medium,
    fontSize: SIZES.body2,
  },
  closeButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.s,
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: 'bold',
  },
});

export default Toast; 