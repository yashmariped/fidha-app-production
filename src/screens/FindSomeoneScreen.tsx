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
import { getNearbyUsers, User, initializeUser } from '../services/firebaseService';

const FindSomeoneScreen: React.FC = () => {
  const navigate = useNavigate();
  const [nearbyUsers, setNearbyUsers] = useState<User[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const initAndScan = async () => {
      try {
        await initializeUser();
        startScanning();
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    };
    initAndScan();
  }, []);

  const startScanning = async () => {
    try {
      setIsScanning(true);
      
      // Use real backend service
      const users = await getNearbyUsers();
      setNearbyUsers(users);
      setIsScanning(false);
    } catch (error) {
      console.error('Error starting scan:', error);
      setIsScanning(false);
    }
  };

  const handleUserSelect = (user: User) => {
    navigate(`/what-was-she-wearing/${user.id}`);
  };

  return (
    <GradientBackground>
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/home')}>
            ← Back
          </BackButton>
          <Title>Start a Conversation</Title>
        </Header>
        
        <Content>
          <Card>
            <Description>
              {isScanning ? (
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
                  <p>Looking for people nearby...</p>
                </div>
              ) : nearbyUsers.length === 0 ? (
                <div style={{ textAlign: 'center' }}>
                  <Description>
                    No one nearby right now
                  </Description>
                  <Button onClick={startScanning}>
                    Try Again
                  </Button>
                </div>
              ) : (
                <div style={{ width: '100%' }}>
                  <Description>
                    Found {nearbyUsers.length} person(s) nearby
                  </Description>
                  {nearbyUsers.map((user) => (
                    <Card 
                      key={user.id} 
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleUserSelect(user)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ color: 'white', margin: '0 0 4px 0' }}>
                            {user.name}
                          </h3>
                          <p style={{ color: '#E0C3FC', margin: 0 }}>
                            {user.isOnline ? 'Online now' : 'Recently seen'}
                          </p>
                        </div>
                        <div style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: user.isOnline ? '#00FF9D' : '#FFD700' 
                        }} />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Description>
          </Card>
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

export default FindSomeoneScreen; 