import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GradientBackground,
  Container,
  Content,
  Title,
  Subtitle,
  Description,
  ButtonGroup,
  Button,
} from '../components/styled';

const MatchFoundScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <GradientBackground>
      <Container>
        <Content>
          <Title>Match Found!</Title>
          <Subtitle>
            You both noticed each other
          </Subtitle>
          <Description>
            Start a conversation and see where it leads
          </Description>
          
          <ButtonGroup>
            <Button onClick={() => navigate('/chat')}>
              Start Chat
            </Button>
            <Button variant="outline" onClick={() => navigate('/home')}>
              Back to Home
            </Button>
          </ButtonGroup>
        </Content>
      </Container>
    </GradientBackground>
  );
};

export default MatchFoundScreen; 