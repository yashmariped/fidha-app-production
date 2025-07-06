import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase with error handling
let app: any = null;
let db: any = null;

const initializeFirebase = () => {
  try {
    if (!app) {
      console.log('Initializing Firebase...');
      app = initializeApp(firebaseConfig);
      console.log('Firebase app initialized');
      
      db = getFirestore(app);
      console.log('Firebase firestore initialized');
    }
    return { app, db };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface User {
  id: string;
  anonymousId: string;
  createdAt: string;
  lastActive: string;
  isOnline: boolean;
  lastSeen: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  profile?: {
    name?: string;
    avatar?: string;
    bio?: string;
  };
  preferences: {
    notifications: boolean;
    locationSharing: boolean;
    profileVisibility: 'public' | 'anonymous' | 'friends';
  };
}

export interface OutfitDescription {
  id: string;
  userId: string;
  targetUserId: string;
  clothing: string[];
  accessories: string[];
  activity: string[];
  colors: string[];
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  user1Description: OutfitDescription;
  user2Description: OutfitDescription;
  timestamp: string;
  status: 'pending' | 'matched' | 'expired';
  chatId: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Chat {
  id: string;
  matchId: string;
  user1Id: string;
  user2Id: string;
  messages: ChatMessage[];
}

// Real user management (no bots)
let currentUser: User | null = null;

const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Initialize user (real version)
export const initializeUser = async (): Promise<User> => {
  try {
    console.log('Starting user initialization...');
    
    // Initialize Firebase first
    const { db: firestore } = initializeFirebase();
    
    // Create a real user if we don't have one
    if (!currentUser) {
      const userId = generateUserId();
      console.log('Creating real user with ID:', userId);
      
      currentUser = {
        id: userId,
        anonymousId: `anon_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        isOnline: true,
        preferences: {
          notifications: true,
          locationSharing: true,
          profileVisibility: 'anonymous',
        },
      };
      
      // Save user to Firestore
      const userRef = doc(firestore, 'users', userId);
      await setDoc(userRef, currentUser);
      console.log('Real user saved to Firestore');
      
      // Set up user presence tracking
      await updateUserPresence(userId, true);
    }
    
    console.log('User initialized successfully:', currentUser.id);
    return currentUser;
  } catch (error) {
    console.error('Error initializing user:', error);
    throw error;
  }
};

// Update user presence (online/offline status)
export const updateUserPresence = async (userId: string, isOnline: boolean) => {
  try {
    const { db: firestore } = initializeFirebase();
    const userRef = doc(firestore, 'users', userId);
    
    await updateDoc(userRef, {
      isOnline: isOnline,
      lastSeen: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    });
    
    console.log(`User ${userId} presence updated: ${isOnline ? 'online' : 'offline'}`);
  } catch (error) {
    console.error('Error updating user presence:', error);
  }
};

// Get current user (real version)
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    if (!currentUser) {
      await initializeUser();
    }
    return currentUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Get nearby real users only (no bots)
export const getNearbyUsers = async (): Promise<User[]> => {
  try {
    const { db: firestore } = initializeFirebase();
    const currentUser = await getCurrentUser();
    if (!currentUser) return [];
    
    console.log('Searching for nearby real users...');
    
    const usersRef = collection(firestore, 'users');
    
    try {
      // Try the optimized query first (with indexes)
      const q = query(
        usersRef,
        where('isOnline', '==', true),
        orderBy('lastActive', 'desc'),
        limit(20)
      );
      
      const snapshot = await getDocs(q);
      const realUsers = snapshot.docs
        .map(doc => doc.data() as User)
        .filter(user => 
          // Filter out current user
          user.id !== currentUser.id &&
          // Filter out any potential bot users (users created in the last 5 seconds are likely bots)
          new Date(user.createdAt).getTime() < Date.now() - 5000 &&
          // Only show users who have been active in the last 10 minutes
          new Date(user.lastActive).getTime() > Date.now() - 600000
        );
      
      console.log(`Found ${realUsers.length} real nearby users`);
      return realUsers;
    } catch (indexError) {
      // If index is still building, fall back to simple query
      console.log('Index still building, using fallback query...');
      
      const fallbackQuery = query(
        usersRef,
        limit(50) // Get more users since we'll filter in JS
      );
      
      const snapshot = await getDocs(fallbackQuery);
      const allUsers = snapshot.docs.map(doc => doc.data() as User);
      
      const realUsers = allUsers.filter(user => 
        // Filter out current user
        user.id !== currentUser.id &&
        // Only show online users
        user.isOnline === true &&
        // Filter out any potential bot users
        new Date(user.createdAt).getTime() < Date.now() - 5000 &&
        // Only show users who have been active in the last 10 minutes
        new Date(user.lastActive).getTime() > Date.now() - 600000
      );
      
      // Sort by lastActive in JavaScript
      realUsers.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
      
      console.log(`Found ${realUsers.length} real nearby users (fallback query)`);
      return realUsers.slice(0, 20); // Limit to 20 users
    }
  } catch (error) {
    console.error('Error getting nearby users:', error);
    return [];
  }
};

// Subscribe to real-time nearby users
export const subscribeToNearbyUsers = (callback: (users: User[]) => void) => {
  try {
    const { db: firestore } = initializeFirebase();
    const usersRef = collection(firestore, 'users');
    
    // For now, use a simple query without complex filters while indexes build
    const q = query(
      usersRef,
      limit(50)
    );
    
    return onSnapshot(q, (snapshot) => {
      const allUsers = snapshot.docs.map(doc => doc.data() as User);
      
      const realUsers = allUsers.filter(user => 
        // Filter out current user
        user.id !== (currentUser?.id || '') &&
        // Only show online users
        user.isOnline === true &&
        // Filter out bots and inactive users
        new Date(user.createdAt).getTime() < Date.now() - 5000 &&
        new Date(user.lastActive).getTime() > Date.now() - 600000
      );
      
      // Sort by lastActive in JavaScript
      realUsers.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
      
      callback(realUsers.slice(0, 20)); // Limit to 20 users
    });
  } catch (error) {
    console.error('Error subscribing to nearby users:', error);
  }
};

// Submit outfit description
export const submitOutfitDescription = async (
  targetUserId: string,
  clothing: string[],
  accessories: string[],
  activity: string[],
  colors: string[]
): Promise<boolean> => {
  try {
    const { db: firestore } = initializeFirebase();
    const currentUser = await getCurrentUser();
    if (!currentUser) return false;

    const description: OutfitDescription = {
      id: `desc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.id,
      targetUserId,
      clothing,
      accessories,
      activity,
      colors,
      timestamp: new Date().toISOString(),
      location: {
        latitude: 37.7749 + (Math.random() - 0.5) * 0.01, // Demo location
        longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
      },
    };

    console.log('Submitting outfit description:', {
      userId: currentUser.id,
      targetUserId,
      clothing,
      accessories,
      activity,
      colors
    });

    // Save description to 'outfits' collection (for Cloud Functions)
    const outfitsRef = collection(firestore, 'outfits');
    await addDoc(outfitsRef, {
      userId: currentUser.id,
      outfitDescription: `${clothing.join(', ')} ${accessories.join(', ')} ${activity.join(', ')} ${colors.join(', ')}`,
      targetUserId: targetUserId,
      clothing: clothing,
      accessories: accessories,
      activity: activity,
      colors: colors,
      timestamp: serverTimestamp(),
      location: description.location,
    });

    console.log('Outfit description saved to Firestore');

    // Check for mutual match
    const existingQuery = query(
      outfitsRef,
      where('userId', '==', targetUserId),
      where('targetUserId', '==', currentUser.id)
    );
    
    const existingSnapshot = await getDocs(existingQuery);
    console.log('Checking for existing descriptions, found:', existingSnapshot.size);
    
    if (!existingSnapshot.empty) {
      const existingDescription = existingSnapshot.docs[0].data();
      console.log('Found mutual match! Creating match...');
      
      // Create match
      const match: Match = {
        id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user1Id: currentUser.id,
        user2Id: targetUserId,
        user1Description: description,
        user2Description: {
          id: existingDescription.id || 'existing_desc',
          userId: existingDescription.userId,
          targetUserId: existingDescription.targetUserId,
          clothing: existingDescription.clothing || [],
          accessories: existingDescription.accessories || [],
          activity: existingDescription.activity || [],
          colors: existingDescription.colors || [],
          timestamp: existingDescription.timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
          location: existingDescription.location || { latitude: 0, longitude: 0 },
        },
        timestamp: new Date().toISOString(),
        status: 'matched',
        chatId: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      // Save match
      const matchesRef = collection(firestore, 'matches');
      await addDoc(matchesRef, match);
      console.log('Match saved to Firestore');

      // Create chat
      const chat: Chat = {
        id: match.chatId,
        matchId: match.id,
        user1Id: currentUser.id,
        user2Id: targetUserId,
        messages: [
          {
            id: 'msg_1',
            chatId: match.chatId,
            senderId: 'system',
            content: 'You both noticed each other! Start a conversation about what caught your attention.',
            timestamp: new Date().toISOString(),
            isRead: false,
          },
        ],
      };

      const chatsRef = collection(firestore, 'chats');
      await addDoc(chatsRef, chat);
      console.log('Chat created in Firestore');

      // Show notification for match
      await showMatchNotification();

      return true; // Match found
    }

    console.log('No mutual match found yet');
    return false; // No match yet
  } catch (error) {
    console.error('Error submitting outfit description:', error);
    return false;
  }
};

// Request notification permissions
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return false;
      }
      
      return true;
    } else {
      console.log('Must use physical device for Push Notifications');
      return false;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Show match notification
export const showMatchNotification = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Match Found! 💬',
        body: 'You both noticed each other! Start a conversation.',
        data: { type: 'match' },
      },
      trigger: null, // Show immediately
    });
  } catch (error) {
    console.error('Error showing match notification:', error);
  }
};

// Subscribe to matches
export const subscribeToMatches = async (callback: (match: Match) => void) => {
  try {
    const { db: firestore } = initializeFirebase();
    const currentUser = await getCurrentUser();
    if (!currentUser) return;

    const matchesRef = collection(firestore, 'matches');
    const q = query(
      matchesRef,
      where('user1Id', '==', currentUser.id)
    );

    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const match = change.doc.data() as Match;
          console.log('New match found:', match);
          callback(match);
        }
      });
    });
  } catch (error) {
    console.error('Error subscribing to matches:', error);
  }
};

// Subscribe to new messages
export const subscribeToNewMessages = async (callback: (message: ChatMessage) => void) => {
  try {
    const { db: firestore } = initializeFirebase();
    const currentUser = await getCurrentUser();
    if (!currentUser) return;

    const chatsRef = collection(firestore, 'chats');
    const q = query(
      chatsRef,
      where('user1Id', '==', currentUser.id)
    );

    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          const chat = change.doc.data() as Chat;
          const lastMessage = chat.messages[chat.messages.length - 1];
          if (lastMessage && lastMessage.senderId !== currentUser.id) {
            console.log('New message received:', lastMessage);
            callback(lastMessage);
          }
        }
      });
    });
  } catch (error) {
    console.error('Error subscribing to new messages:', error);
  }
};

// Clean up user when app closes
export const cleanupUser = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      await updateUserPresence(currentUser.id, false);
      console.log('User cleanup completed');
    }
  } catch (error) {
    console.error('Error cleaning up user:', error);
  }
}; 