import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

const { width } = Dimensions.get('window');

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Gradient colors as tuple for LinearGradient
  const gradientColors: [string, string] = [COLORS.primary, COLORS.primaryLight];

  const slides = [
    {
      title: 'Welcome to Fidha',
      description: 'Connect with people you notice in real life through shared moments.',
    },
    {
      title: 'Find Someone',
      description: 'Describe what someone is wearing and see if they noticed you too.',
    },
    {
      title: 'I Was Seen',
      description: 'Help someone find you by describing your outfit and location.',
    },
    {
      title: 'Start Connecting',
      description: 'Begin your journey of meaningful connections.',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
    } else {
      navigation.navigate('Welcome');
    }
  };

  const handleSkip = () => {
    navigation.navigate('Welcome');
  };

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.gradientBg}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipButton}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentSlide(slideIndex);
          }}
        >
          {slides.map((slide, index) => (
            <View key={index} style={styles.slide}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentSlide && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
          
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: SPACING.l,
  },
  skipButton: {
    fontSize: SIZES.body1,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },
  slide: {
    width,
    padding: SPACING.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: SIZES.h2,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  description: {
    fontSize: SIZES.body1,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.m,
  },
  footer: {
    padding: SPACING.l,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.l,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primaryLight,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  paginationDotActive: {
    backgroundColor: COLORS.text,
    opacity: 1,
  },
  button: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xl,
    borderRadius: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.text,
    fontSize: SIZES.body1,
    fontFamily: FONTS.bold,
  },
});

export default OnboardingScreen; 