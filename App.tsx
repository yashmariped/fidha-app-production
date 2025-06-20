import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList } from './src/types';

// Import screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import FindSomeoneScreen from './src/screens/FindSomeoneScreen';
import IWasSeenScreen from './src/screens/IWasSeenScreen';
import WhatWasSheWearingScreen from './src/screens/WhatWasSheWearingScreen';
import WhatIsHeWearingScreen from './src/screens/WhatIsHeWearingScreen';
import MatchFoundScreen from './src/screens/MatchFoundScreen';
import ChatScreen from './src/screens/ChatScreen';
import MomentHistoryScreen from './src/screens/MomentHistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="FindSomeone" component={FindSomeoneScreen} />
          <Stack.Screen name="IWasSeen" component={IWasSeenScreen} />
          <Stack.Screen name="WhatWasSheWearing" component={WhatWasSheWearingScreen} />
          <Stack.Screen name="WhatIsHeWearing" component={WhatIsHeWearingScreen} />
          <Stack.Screen name="MatchFound" component={MatchFoundScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="MomentHistory" component={MomentHistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 