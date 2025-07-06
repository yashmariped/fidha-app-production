import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

type WhatWasSheWearingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'WhatWasSheWearing'>;
  route: RouteProp<RootStackParamList, 'WhatWasSheWearing'>;
};

interface OutfitOption {
  id: string;
  label: string;
  icon: string;
  category: 'clothing' | 'accessories' | 'activity' | 'colors';
}

const clothingOptions: OutfitOption[] = [
  { id: 'dress', label: 'Dress', icon: '👗', category: 'clothing' },
  { id: 'jeans', label: 'Jeans', icon: '👖', category: 'clothing' },
  { id: 'hoodie', label: 'Hoodie', icon: '🧥', category: 'clothing' },
  { id: 'shirt', label: 'Shirt', icon: '👕', category: 'clothing' },
  { id: 'skirt', label: 'Skirt', icon: '👗', category: 'clothing' },
  { id: 'jacket', label: 'Jacket', icon: '🧥', category: 'clothing' },
];

const accessoryOptions: OutfitOption[] = [
  { id: 'backpack', label: 'Backpack', icon: '🎒', category: 'accessories' },
  { id: 'bag', label: 'Bag', icon: '👜', category: 'accessories' },
  { id: 'hat', label: 'Hat', icon: '👒', category: 'accessories' },
  { id: 'glasses', label: 'Glasses', icon: '👓', category: 'accessories' },
  { id: 'jewelry', label: 'Jewelry', icon: '💍', category: 'accessories' },
  { id: 'scarf', label: 'Scarf', icon: '🧣', category: 'accessories' },
];

const activityOptions: OutfitOption[] = [
  { id: 'walking', label: 'Walking', icon: '🚶‍♀️', category: 'activity' },
  { id: 'sitting', label: 'Sitting', icon: '🪑', category: 'activity' },
  { id: 'reading', label: 'Reading', icon: '📖', category: 'activity' },
  { id: 'coffee', label: 'Coffee', icon: '☕', category: 'activity' },
  { id: 'phone', label: 'On Phone', icon: '📱', category: 'activity' },
  { id: 'laptop', label: 'Laptop', icon: '💻', category: 'activity' },
];

const colorOptions: OutfitOption[] = [
  { id: 'red', label: 'Red', icon: '🔴', category: 'colors' },
  { id: 'blue', label: 'Blue', icon: '🔵', category: 'colors' },
  { id: 'black', label: 'Black', icon: '⚫', category: 'colors' },
  { id: 'white', label: 'White', icon: '⚪', category: 'colors' },
  { id: 'green', label: 'Green', icon: '🟢', category: 'colors' },
  { id: 'yellow', label: 'Yellow', icon: '🟡', category: 'colors' },
];

const WhatWasSheWearingScreen: React.FC<WhatWasSheWearingScreenProps> = ({ navigation, route }) => {
  const { targetUserId } = route.params;
  
  const [selectedClothing, setSelectedClothing] = useState<string[]>([]);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // Gradient colors as tuple for LinearGradient
  const gradientColors: [string, string] = [COLORS.primary, COLORS.primaryLight];

  const handleOptionSelect = (option: OutfitOption) => {
    switch (option.category) {
      case 'clothing':
        setSelectedClothing(prev => 
          prev.includes(option.id) 
            ? prev.filter(id => id !== option.id)
            : [...prev, option.id]
        );
        break;
      case 'accessories':
        setSelectedAccessories(prev => 
          prev.includes(option.id) 
            ? prev.filter(id => id !== option.id)
            : [...prev, option.id]
        );
        break;
      case 'activity':
        setSelectedActivity(prev => 
          prev.includes(option.id) 
            ? prev.filter(id => id !== option.id)
            : [...prev, option.id]
        );
        break;
      case 'colors':
        setSelectedColors(prev => 
          prev.includes(option.id) 
            ? prev.filter(id => id !== option.id)
            : [...prev, option.id]
        );
        break;
    }
  };

  const handleSubmit = async () => {
    if (!targetUserId) return;
    
    try {
      // Import the Firebase service
      const { submitOutfitDescription } = await import('../services/firebaseService');
      
      const isMatch = await submitOutfitDescription(
        targetUserId,
        selectedClothing,
        selectedAccessories,
        selectedActivity,
        selectedColors
      );
      
      if (isMatch) {
        navigation.navigate('MatchFound', { matchId: 'match_123' });
      } else {
        // No match yet, show waiting screen
        navigation.navigate('Home');
        // You could show a toast here
      }
    } catch (error) {
      console.error('Error submitting description:', error);
      // You could show an error toast here
      navigation.navigate('Home');
    }
  };

  const renderOption = (option: OutfitOption, selectedItems: string[]) => {
    const isSelected = selectedItems.includes(option.id);
    
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.option,
          { 
            backgroundColor: isSelected ? '#6C63FF' : '#1A1A24',
            borderColor: isSelected ? '#6C63FF' : '#2A2A34',
          }
        ]}
        onPress={() => handleOptionSelect(option)}
      >
        <Text style={styles.optionIcon}>{option.icon}</Text>
        <Text style={[
          styles.optionLabel,
          { color: isSelected ? '#FFFFFF' : '#FFFFFF' }
        ]}>
          {option.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSection = (title: string, options: OutfitOption[], selectedItems: string[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.optionsGrid}>
        {options.map(option => renderOption(option, selectedItems))}
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.gradientBg}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>What was she wearing?</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderSection('Clothing', clothingOptions, selectedClothing)}
          {renderSection('Accessories', accessoryOptions, selectedAccessories)}
          {renderSection('Activity', activityOptions, selectedActivity)}
          {renderSection('Colors', colorOptions, selectedColors)}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              Submit Description
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryLight,
  },
  backButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.text,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  option: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 4,
    color: COLORS.text,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.text,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.primaryLight,
  },
  submitButton: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 40,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

export default WhatWasSheWearingScreen; 