import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  GradientBackground,
  Container,
  Header,
  BackButton,
  Title,
  Content,
  Description,
  Grid,
  GridItem,
  Button,
  Footer,
} from '../components/styled';
import { submitOutfitDescription } from '../services/backendService';

interface OutfitOption {
  id: string;
  label: string;
  icon: string;
}

const clothingOptions: OutfitOption[] = [
  { id: 'dress', label: 'Dress', icon: '👗' },
  { id: 'jeans', label: 'Jeans', icon: '👖' },
  { id: 'shirt', label: 'Shirt', icon: '👕' },
  { id: 'skirt', label: 'Skirt', icon: '👗' },
  { id: 'jacket', label: 'Jacket', icon: '🧥' },
  { id: 'sweater', label: 'Sweater', icon: '🧶' },
];

const accessoryOptions: OutfitOption[] = [
  { id: 'hat', label: 'Hat', icon: '👒' },
  { id: 'glasses', label: 'Glasses', icon: '👓' },
  { id: 'bag', label: 'Bag', icon: '👜' },
  { id: 'watch', label: 'Watch', icon: '⌚' },
  { id: 'jewelry', label: 'Jewelry', icon: '💍' },
  { id: 'scarf', label: 'Scarf', icon: '🧣' },
];

const activityOptions: OutfitOption[] = [
  { id: 'walking', label: 'Walking', icon: '🚶' },
  { id: 'sitting', label: 'Sitting', icon: '🪑' },
  { id: 'reading', label: 'Reading', icon: '📖' },
  { id: 'coffee', label: 'Coffee', icon: '☕' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'working', label: 'Working', icon: '💼' },
];

const WhatWasSheWearingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { targetUserId } = useParams<{ targetUserId: string }>();
  const [selectedClothing, setSelectedClothing] = useState<string[]>([]);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionSelect = (option: OutfitOption, category: 'clothing' | 'accessories' | 'activity') => {
    switch (category) {
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
    }
  };

  const handleSubmit = async () => {
    if (!targetUserId) return;
    
    setIsSubmitting(true);
    
    try {
      // Use real backend service
      const isMatch = await submitOutfitDescription(
        targetUserId,
        selectedClothing,
        selectedAccessories,
        selectedActivity
      );
      
      if (isMatch) {
        navigate('/match-found');
      } else {
        // No match yet, show waiting screen
        navigate('/home');
        alert('Description submitted! We\'ll notify you if they notice you too.');
      }
    } catch (error) {
      console.error('Error submitting description:', error);
      alert('Error submitting description. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSection = (title: string, options: OutfitOption[], selected: string[]) => (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '20px' }}>{title}</h3>
      <Grid>
        {options.map((option) => (
          <GridItem
            key={option.id}
            selected={selected.includes(option.id)}
            onClick={() => handleOptionSelect(option, title.toLowerCase() as 'clothing' | 'accessories' | 'activity')}
          >
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{option.icon}</div>
            <div>{option.label}</div>
          </GridItem>
        ))}
      </Grid>
    </div>
  );

  return (
    <GradientBackground>
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/find-someone')}>
            ← Back
          </BackButton>
          <Title style={{ fontSize: '20px' }}>What was she wearing?</Title>
          <div style={{ width: '50px' }} />
        </Header>

        <Content style={{ alignItems: 'flex-start', textAlign: 'left' }}>
          <div style={{ textAlign: 'center', width: '100%', marginBottom: '32px' }}>
            <Title style={{ fontSize: '24px', marginBottom: '12px' }}>
              Describe what you saw
            </Title>
            <Description>
              Help us find the person you noticed by describing their outfit.
            </Description>
          </div>

          {renderSection('Clothing', clothingOptions, selectedClothing)}
          {renderSection('Accessories', accessoryOptions, selectedAccessories)}
          {renderSection('Activity', activityOptions, selectedActivity)}
        </Content>

        <Footer>
          <Button 
            onClick={handleSubmit} 
            style={{ width: '100%' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Description'}
          </Button>
        </Footer>
      </Container>
    </GradientBackground>
  );
};

export default WhatWasSheWearingScreen; 