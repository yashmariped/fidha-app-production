import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/theme';

// Import screens
import WelcomeScreen from '../screens/WelcomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import FindSomeoneScreen from '../screens/FindSomeoneScreen';
import IWasSeenScreen from '../screens/IWasSeenScreen';
import WhatWasSheWearingScreen from '../screens/WhatWasSheWearingScreen';
import WhatIsHeWearingScreen from '../screens/WhatIsHeWearingScreen';
import MatchFoundScreen from '../screens/MatchFoundScreen';
import ChatScreen from '../screens/ChatScreen';
import MomentHistoryScreen from '../screens/MomentHistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="MomentHistory" 
        component={MomentHistoryScreen}
        options={{
          title: 'History',
          headerShown: false,
          tabBarLabel: 'History',
        }}
      />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.background,
          },
          headerTintColor: COLORS.text,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="FindSomeone" 
          component={FindSomeoneScreen}
          options={{ 
            title: 'Find Someone',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="IWasSeen" 
          component={IWasSeenScreen}
          options={{ 
            title: 'I Was Seen',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="WhatWasSheWearing" 
          component={WhatWasSheWearingScreen}
          options={{ 
            title: 'What Was She Wearing?',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="WhatIsHeWearing" 
          component={WhatIsHeWearingScreen}
          options={{ 
            title: 'What Is He Wearing?',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="MatchFound" 
          component={MatchFoundScreen}
          options={{ 
            title: 'Match Found!',
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen}
          options={{ 
            title: 'Chat',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator; 