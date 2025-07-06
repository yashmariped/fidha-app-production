import React, { useState, useEffect } from 'react';
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
} from '../components/styled';
import { getConversationHistory, Conversation, initializeUser } from '../services/firebaseService';

const HistoryScreen: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAndLoad = async () => {
      try {
        await initializeUser();
        loadConversations();
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    };
    initAndLoad();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const history = await getConversationHistory();
      setConversations(history);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    navigate('/chat', { state: { conversationId: conversation.id } });
  };

  return (
    <GradientBackground>
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/home')}>
            ← Back
          </BackButton>
          <Title>My Conversations</Title>
        </Header>
        
        <Content>
          {isLoading ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '3px solid #E0C3FC', 
                borderTop: '3px solid #7B4AE2', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px auto'
              }} />
              <Description>Loading conversations...</Description>
            </div>
          ) : conversations.length === 0 ? (
            <Card>
              <Description>
                No conversations yet. Start by noticing someone interesting!
              </Description>
              <Button onClick={() => navigate('/find-someone')}>
                Start a Conversation
              </Button>
            </Card>
          ) : (
            <div style={{ width: '100%' }}>
              <Description>
                Your conversation history
              </Description>
              {conversations.map((conversation) => (
                <Card 
                  key={conversation.id} 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ color: 'white', margin: '0 0 4px 0' }}>
                        {conversation.personName}
                      </h3>
                      <p style={{ color: '#E0C3FC', margin: '0 0 8px 0' }}>
                        {conversation.lastMessage}
                      </p>
                      <p style={{ color: '#E0C3FC', margin: 0, fontSize: '12px' }}>
                        {new Date(conversation.lastMessageTime).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      backgroundColor: conversation.isActive ? '#00FF9D' : '#FFD700' 
                    }} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Content>
      </Container>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </GradientBackground>
  );
};

export default HistoryScreen; 