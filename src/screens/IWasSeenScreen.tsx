import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GradientBackground,
  Container,
  Header,
  BackButton,
  Title,
  Content,
  Card,
  Description,
  Button,
  Input,
} from '../components/styled';

const IWasSeenScreen: React.FC = () => {
  const navigate = useNavigate();
  const [outfitDescription, setOutfitDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!outfitDescription.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/home');
    }, 2000);
  };

  return (
    <GradientBackground>
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/home')}>
            ← Back
          </BackButton>
          <Title>I Was Noticed</Title>
        </Header>
        
        <Content>
          <Card>
            <Description>
              Help someone start a conversation with you by describing what you're wearing.
            </Description>
            
            <Input
              placeholder="Describe your outfit, accessories, or what you're doing..."
              value={outfitDescription}
              onChange={(e) => setOutfitDescription(e.target.value)}
              style={{ marginBottom: '24px' }}
            />
            
            <Button 
              onClick={handleSubmit}
              disabled={!outfitDescription.trim() || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Description'}
            </Button>
          </Card>
        </Content>
      </Container>
    </GradientBackground>
  );
};

export default IWasSeenScreen; 