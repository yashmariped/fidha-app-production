import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

type MatchFoundScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MatchFound'>;
};

const MatchFoundScreen: React.FC<MatchFoundScreenProps> = ({ navigation }) => {
  // Gradient colors as tuple for LinearGradient
  const gradientColors: [string, string] = [COLORS.primary, COLORS.primaryLight];

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.gradientBg}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.content}>
          <Text style={styles.title}>Match Found!</Text>
          <Text style={styles.subtitle}>
            You both noticed each other
          </Text>
          <Text style={styles.description}>
            Start a conversation and see where it leads
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Chat', { chatId: 'new' })}
          >
            <Text style={styles.buttonText}>Start Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.outlineButton]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={[styles.buttonText, styles.outlineButtonText]}>Back to Home</Text>
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
    justifyContent: 'space-between',
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 24,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 40,
    alignItems: 'center',
    elevation: 2,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  outlineButtonText: {
    color: COLORS.text,
  },
});

export default MatchFoundScreen; 