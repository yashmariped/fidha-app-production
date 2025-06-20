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

type IWasSeenScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'IWasSeen'>;
  route: RouteProp<RootStackParamList, 'IWasSeen'>;
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
  { id: 'suit', label: 'Suit', icon: '👔', category: 'clothing' },
  { id: 'shorts', label: 'Shorts', icon: '🩳', category: 'clothing' },
];

const accessoryOptions: OutfitOption[] = [
  { id: 'backpack', label: 'Backpack', icon: '🎒', category: 'accessories' },
  { id: 'bag', label: 'Bag', icon: '👜', category: 'accessories' },
  { id: 'hat', label: 'Hat', icon: '👒', category: 'accessories' },
  { id: 'glasses', label: 'Glasses', icon: '👓', category: 'accessories' },
  { id: 'jewelry', label: 'Jewelry', icon: '💍', category: 'accessories' },
  { id: 'scarf', label: 'Scarf', icon: '🧣', category: 'accessories' },
  { id: 'watch', label: 'Watch', icon: '⌚', category: 'accessories' },
  { id: 'tie', label: 'Tie', icon: '👔', category: 'accessories' },
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

const IWasSeenScreen: React.FC<IWasSeenScreenProps> = ({ navigation }) => {
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>I Was Seen</Text>
        <View style={{ width: 50 }} />
      </View>

      <View style={styles.introContainer}>
        <Text style={styles.introTitle}>
          What were you wearing?
        </Text>
        <Text style={styles.introText}>
          Help someone find you by describing your outfit
        </Text>
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
            Submit My Outfit
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A34',
  },
  backButton: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6C63FF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  introContainer: {
    padding: 24,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  introText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20,
    color: '#B3B3B3',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFFFFF',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#2A2A34',
  },
  submitButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default IWasSeenScreen; 