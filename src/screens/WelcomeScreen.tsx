import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GradientBackground,
  Container,
  Content,
  Title,
  Tagline,
  Description,
  Button,
  HeartIcon,
} from '../components/styled';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <GradientBackground>
      <Container>
        <Content>
          <HeartIcon>💬</HeartIcon>
          <Title>Fidha</Title>
          <Tagline>Start conversations that matter</Tagline>
          
          <Description>
            Notice someone interesting? Start a conversation without the awkwardness. 
            Connect through shared moments and see where it leads.
          </Description>
          
          <Button onClick={() => navigate('/home')}>
            Get Started
          </Button>
        </Content>
      </Container>
    </GradientBackground>
  );
};

export default WelcomeScreen; 