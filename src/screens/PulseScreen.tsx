import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { useMoment } from '../hooks/useMoment';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/theme';

type PulseScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const PulseScreen = () => {
  const { detectMoment } = useMoment();
  const navigation = useNavigation<PulseScreenNavigationProp>();
  const pulseAnim = new Animated.Value(0);

  useEffect(() => {
    const startPulseAnimation = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => startPulseAnimation());
    };

    startPulseAnimation();

    // Simulate moment detection every 10 seconds
    const detectionInterval = setInterval(async () => {
      try {
        await detectMoment();
        navigation.navigate('Home');
      } catch (error) {
        console.error('Failed to detect moment:', error);
      }
    }, 10000);

    return () => {
      clearInterval(detectionInterval);
    };
  }, [pulseAnim, detectMoment, navigation]);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.pulse,
          {
            backgroundColor: COLORS.primary,
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
      <View style={styles.innerCircle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  pulse: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
  },
}); 