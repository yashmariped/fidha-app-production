import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useMoment } from '../hooks/useMoment';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import Button from '../components/Button';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';

type MomentDetectedScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const MomentDetectedScreen = () => {
  const { moments, confirmMoment, rejectMoment } = useMoment();
  const navigation = useNavigation<MomentDetectedScreenNavigationProp>();

  const latestMoment = moments[0];

  const handleConfirm = async () => {
    if (latestMoment) {
      await confirmMoment(latestMoment.id);
      navigation.navigate('Home');
    }
  };

  const handleReject = async () => {
    if (latestMoment) {
      await rejectMoment(latestMoment.id);
      navigation.navigate('Home');
    }
  };

  if (!latestMoment) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No moment detected</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.navigate('Home')}
          variant="primary"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Moment Detected!
        </Text>
        <Text style={styles.subtitle}>
          Someone nearby felt the same way you did
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Confirm"
          onPress={handleConfirm}
          variant="primary"
          style={styles.button}
        />
        <Button
          title="Reject"
          onPress={handleReject}
          variant="secondary"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.textSecondary,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.text,
  },
  actions: {
    marginBottom: 40,
  },
  button: {
    marginBottom: 10,
  },
}); 