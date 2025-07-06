import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/theme';

import { Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FidhaHeartIcon from '../components/FidhaHeartIcon';

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  // Gradient colors as tuple for LinearGradient
  const gradientColors: [string, string] = [COLORS.primary, COLORS.primaryLight];
  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.gradientBg}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Fidha</Text>
          <Text style={styles.tagline}>Express true connection</Text>
          <View style={styles.iconAccentRow}>
            <View style={styles.accentDot} />
            <FidhaHeartIcon size={160} />
            <View style={styles.accentDot} />
          </View>
          <Text style={styles.headline}>Connect with a glance</Text>
          <Text style={styles.subtext}>
            Start a search and find someone nearby who also felt a connection.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.pillButtonWrapper}>
            <Button
              title="Start Searching"
              onPress={() => navigation.navigate('Home')}
            />
          </View>
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
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 22,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  iconAccentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  accentDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.7,
    marginHorizontal: 12,
  },
  headline: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtext: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 48,
  },
  pillButtonWrapper: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 40,
    paddingVertical: 8,
    paddingHorizontal: 8,
    minWidth: 280,
    elevation: 2,
  },
});

export default WelcomeScreen; 