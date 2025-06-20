import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { COLORS, FONTS, SIZES, SPACING } from '../constants/theme';

type WhatIsHeWearingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'WhatIsHeWearing'>;
  route: RouteProp<RootStackParamList, 'WhatIsHeWearing'>;
};

interface OutfitOption {
  id: string;
  label: string;
  icon: string;
  category: 'clothing' | 'accessories' | 'activity' | 'colors';
}

const clothingOptions: OutfitOption[] = [
  { id: 'shirt', label: 'Shirt', icon: '👕', category: 'clothing' },
  { id: 'jeans', label: 'Jeans', icon: '👖', category: 'clothing' },
  { id: 'hoodie', label: 'Hoodie', icon: '🧥', category: 'clothing' },
  { id: 'suit', label: 'Suit', icon: '👔', category: 'clothing' },
  { id: 'shorts', label: 'Shorts', icon: '🩳', category: 'clothing' },
  { id: 'jacket', label: 'Jacket', icon: '🧥', category: 'clothing' },
];

const accessoryOptions: OutfitOption[] = [
  { id: 'backpack', label: 'Backpack', icon: '🎒', category: 'accessories' },
  { id: 'bag', label: 'Bag', icon: '💼', category: 'accessories' },
  { id: 'hat', label: 'Hat', icon: '🧢', category: 'accessories' },
  { id: 'glasses', label: 'Glasses', icon: '👓', category: 'accessories' },
  { id: 'watch', label: 'Watch', icon: '⌚', category: 'accessories' },
  { id: 'tie', label: 'Tie', icon: '👔', category: 'accessories' },
];

const activityOptions: OutfitOption[] = [
  { id: 'walking', label: 'Walking', icon: '🚶‍♂️', category: 'activity' },
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

const WhatIsHeWearingScreen: React.FC<WhatIsHeWearingScreenProps> = ({ navigation, route }) => {
  const { targetUserId } = route.params;
  
  const [selectedClothing, setSelectedClothing] = useState<string[]>([]);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

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

  const handleSubmit = () => {
    // Here you would save the description to Firebase
    const description = {
      clothing: selectedClothing,
      accessories: selectedAccessories,
      activity: selectedActivity,
      colors: selectedColors,
    };
    
    // TODO: Implement Firebase save functionality
    // Navigate to match screen or back to home
    navigation.navigate('Home');
  };

  const renderOption = (option: OutfitOption, selectedItems: string[]) => {
    const isSelected = selectedItems.includes(option.id);
    
    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.option,
          { 
            backgroundColor: isSelected ? COLORS.primary : COLORS.surface,
            borderColor: isSelected ? COLORS.primary : COLORS.border,
          }
        ]}
        onPress={() => handleOptionSelect(option)}
      >
        <Text style={styles.optionIcon}>{option.icon}</Text>
        <Text style={[
          styles.optionLabel,
          { color: isSelected ? COLORS.background : COLORS.text }
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>What Is He Wearing?</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.l,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    fontSize: SIZES.body1,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  title: {
    fontSize: SIZES.h3,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: SPACING.l,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.m,
    color: COLORS.text,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
  },
  option: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.s,
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  optionLabel: {
    fontSize: SIZES.body3,
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },
  footer: {
    padding: SPACING.l,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.l,
    borderRadius: 30,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: SIZES.h4,
    fontFamily: FONTS.medium,
    color: COLORS.background,
  },
});

export default WhatIsHeWearingScreen; 