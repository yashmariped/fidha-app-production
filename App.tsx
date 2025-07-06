import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { initializeUser, requestNotificationPermission, subscribeToMatches, subscribeToNewMessages, cleanupUser, updateUserPresence } from './src/services/firebaseService';
import { View, Text, ActivityIndicator } from 'react-native';
import { AppState } from 'react-native';

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const setupApp = async () => {
      try {
        console.log('Starting app initialization...');
        
        // Initialize user
        const user = await initializeUser();
        console.log('User initialized successfully');
        
        // Request notification permission
        const hasPermission = await requestNotificationPermission();
        if (hasPermission) {
          console.log('Notification permission granted');
          
          // Subscribe to matches
          subscribeToMatches((match) => {
            console.log('New match!', match);
            // You can navigate to chat or show a modal
          });
          
          // Subscribe to new messages
          subscribeToNewMessages((message) => {
            console.log('New message!', message);
            // You can show a toast or update UI
          });
        } else {
          console.log('Notification permission not granted');
        }
        
        setIsInitializing(false);
      } catch (error) {
        console.error('Error setting up app:', error);
        setInitError(error instanceof Error ? error.message : 'Unknown error');
        setIsInitializing(false);
      }
    };

    setupApp();
  }, []);

  // Handle app state changes for user presence
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === 'active') {
        // App came to foreground
        const user = await initializeUser();
        if (user) {
          await updateUserPresence(user.id, true);
        }
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App went to background
        const user = await initializeUser();
        if (user) {
          await updateUserPresence(user.id, false);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup function
    return () => {
      subscription?.remove();
      // Clean up user when app is unmounted
      cleanupUser();
    };
  }, []);

  if (isInitializing) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A24' }}>
          <ActivityIndicator size="large" color="#7B4AE2" />
          <Text style={{ color: 'white', marginTop: 16, fontSize: 16 }}>Initializing Fidha...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  if (initError) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A24', padding: 20 }}>
          <Text style={{ color: 'white', fontSize: 18, textAlign: 'center', marginBottom: 16 }}>
            Failed to initialize app
          </Text>
          <Text style={{ color: '#E0C3FC', fontSize: 14, textAlign: 'center' }}>
            {initError}
          </Text>
          <Text style={{ color: '#E0C3FC', fontSize: 12, textAlign: 'center', marginTop: 16 }}>
            Please check your internet connection and try again
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
} 