import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';

type MatchFoundScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MatchFound'>;
  route: RouteProp<RootStackParamList, 'MatchFound'>;
};

const MatchFoundScreen: React.FC<MatchFoundScreenProps> = ({ navigation, route }) => {
  const { matchId } = route.params;
  
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    // Animate the match celebration
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStartChat = () => {
    // Navigate to chat with the matched user
    navigation.navigate('Chat', { chatId: `chat_${matchId}` });
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <View style={styles.celebrationContainer}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.matchTitle}>
            It's a Match!
          </Text>
          <Text style={styles.matchSubtitle}>
            Let's Vibe
          </Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>
            You both noticed each other
          </Text>
          <Text style={styles.descriptionText}>
            Your outfit descriptions matched perfectly. Time to start a conversation!
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartChat}
          >
            <Text style={styles.primaryButtonText}>
              Start Chat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleGoHome}
          >
            <Text style={styles.secondaryButtonText}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.l,
  },
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  celebrationEmoji: {
    fontSize: 80,
    marginBottom: SPACING.l,
  },
  matchTitle: {
    fontSize: SIZES.h1,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.s,
    color: COLORS.primary,
  },
  matchSubtitle: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  descriptionContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    paddingHorizontal: SPACING.l,
  },
  descriptionTitle: {
    fontSize: SIZES.h4,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.m,
    textAlign: 'center',
    color: COLORS.text,
  },
  descriptionText: {
    fontSize: SIZES.body1,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    lineHeight: 24,
    color: COLORS.textSecondary,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.m,
  },
  primaryButton: {
    paddingVertical: SPACING.l,
    paddingHorizontal: SPACING.xl,
    borderRadius: 30,
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    fontSize: SIZES.h4,
    fontFamily: FONTS.medium,
    color: COLORS.background,
  },
  secondaryButton: {
    paddingVertical: SPACING.l,
    paddingHorizontal: SPACING.xl,
    borderRadius: 30,
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    fontSize: SIZES.h4,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
});

export default MatchFoundScreen; 