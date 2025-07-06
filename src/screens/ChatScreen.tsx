import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GradientBackground,
  Container,
  Header,
  BackButton,
  Title,
  Content,
  ChatContainer,
  MessageBubble,
  ChatInputContainer,
  Input,
  Button,
} from '../components/styled';
import { getChatMessages, sendMessage, initializeUser, getCurrentUser } from '../services/firebaseService';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isSender: boolean;
}

// For demo purposes, use a fixed chat ID
const DEMO_CHAT_ID = 'demo_chat_1';

const ChatScreen: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initAndLoadMessages = async () => {
      try {
        await initializeUser();
        const chatMessages = await getChatMessages(DEMO_CHAT_ID);
        const currentUser = await getCurrentUser();
        
        const formattedMessages: Message[] = chatMessages.map(msg => ({
          id: msg.id,
          content: msg.content,
          timestamp: msg.timestamp,
          isSender: msg.senderId === currentUser?.id,
        }));
        
        setMessages(formattedMessages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading messages:', error);
        setIsLoading(false);
      }
    };
    
    initAndLoadMessages();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (message.trim().length === 0) return;

    try {
      const sentMessage = await sendMessage(DEMO_CHAT_ID, message.trim());
      
      const newMessage: Message = {
        id: sentMessage.id,
        content: sentMessage.content,
        timestamp: sentMessage.timestamp,
        isSender: true,
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <GradientBackground>
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/home')}>
            ← Back
          </BackButton>
          <Title>Conversation</Title>
        </Header>
        
        <Content>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '3px solid #E0C3FC', 
                borderTop: '3px solid #7B4AE2', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px auto'
              }} />
              <p style={{ color: 'white' }}>Loading conversation...</p>
            </div>
          ) : (
            <ChatContainer ref={chatContainerRef}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <MessageBubble key={msg.id} isSender={msg.isSender}>
                    {msg.content}
                  </MessageBubble>
                ))
              )}
            </ChatContainer>
          )}
          
          <ChatInputContainer>
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={handleSend} disabled={!message.trim()}>
              Send
            </Button>
          </ChatInputContainer>
        </Content>
      </Container>
    </GradientBackground>
  );
};

export default ChatScreen; 