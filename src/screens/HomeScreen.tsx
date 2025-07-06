import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GradientBackground,
  Container,
  Content,
  Title,
  Tagline,
  Description,
  ButtonGroup,
  Button,
} from '../components/styled';
import { 
  initializeUser, 
  requestNotificationPermission, 
  subscribeToMatches, 
  subscribeToNewMessages 
} from '../services/firebaseService';

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        // Initialize user
        await initializeUser();
        
        // Request notification permission
        const hasPermission = await requestNotificationPermission();
        if (hasPermission) {
          console.log('Notification permission granted');
          
          // Subscribe to matches
          subscribeToMatches((match) => {
            console.log('New match!', match);
            // You can navigate to chat or show a modal
            navigate('/chat');
          });
          
          // Subscribe to new messages
          subscribeToNewMessages((message) => {
            console.log('New message!', message);
            // You can show a toast or update UI
          });
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();
  }, [navigate]);

  return (
    <GradientBackground>
      <Container>
        <Content>
          <Title>Fidha</Title>
          <Tagline>Start conversations that matter</Tagline>
          
          <ButtonGroup>
            <Button onClick={() => navigate('/find-someone')}>
              Start a Conversation
            </Button>
            
            <Button onClick={() => navigate('/i-was-seen')}>
              I Was Noticed
            </Button>
            
            <Button variant="outline" onClick={() => navigate('/history')}>
              My Conversations
            </Button>
          </ButtonGroup>
          
          <Description>
            Connect through shared moments and see where conversations lead
          </Description>
        </Content>
      </Container>
    </GradientBackground>
  );
};

export default HomeScreen; 