import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  User as FirebaseUser 
} from 'firebase/auth';
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
  serverTimestamp
} from 'firebase/firestore';

// Firebase configuration - using the same config as mobile app
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID || process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Check if we're in demo mode (no real Firebase config)
const isDemoMode = !firebaseConfig.apiKey || firebaseConfig.apiKey === "demo-key" || firebaseConfig.apiKey === "your-api-key-here";

console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? 'SET' : 'NOT SET',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  isDemoMode
});

// Initialize Firebase only if not in demo mode
let app: any;
let auth: any;
let db: any;

if (!isDemoMode) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    // Fall back to demo mode
  }
}

// Types
export interface User {
  id: string;
  name: string;
  anonymousId: string;
  isOnline: boolean;
  lastSeen: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface OutfitDescription {
  id: string;
  userId: string;
  targetUserId: string;
  clothing: string[];
  accessories: string[];
  activity: string[];
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
  lastMessage?: ChatMessage;
}

export interface Conversation {
  id: string;
  personName: string;
  lastMessage: string;
  lastMessageTime: string;
  isActive: boolean;
}

// Demo mode fallback data
let demoUsers: User[] = [];

// Authentication
export const signInUser = async (): Promise<FirebaseUser> => {
  if (isDemoMode) {
    // Return a mock Firebase user for demo mode
    return {
      uid: `demo_${Math.random().toString(36).substr(2, 9)}`,
      email: null,
      displayName: null,
      photoURL: null,
      emailVerified: false,
      isAnonymous: true,
      metadata: {} as any,
      providerData: [],
      refreshToken: '',
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => '',
      getIdTokenResult: async () => ({} as any),
      reload: async () => {},
      toJSON: () => ({}),
      phoneNumber: null,
      providerId: 'anonymous',
    };
  }

  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const getCurrentFirebaseUser = (): FirebaseUser | null => {
  if (isDemoMode) {
    // Return a mock user for demo mode
    const userId = localStorage.getItem('fidha_demo_user_id');
    if (userId) {
      return {
        uid: userId,
        email: null,
        displayName: null,
        photoURL: null,
        emailVerified: false,
        isAnonymous: true,
        metadata: {} as any,
        providerData: [],
        refreshToken: '',
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => '',
        getIdTokenResult: async () => ({} as any),
        reload: async () => {},
        toJSON: () => ({}),
        phoneNumber: null,
        providerId: 'anonymous',
      };
    }
    return null;
  }
  return auth.currentUser;
};

// User management
export const createUserProfile = async (user: FirebaseUser, name: string): Promise<void> => {
  if (isDemoMode) {
    const newUser: User = {
      id: user.uid,
      name,
      anonymousId: `anon_${Math.random().toString(36).substr(2, 9)}`,
      isOnline: true,
      lastSeen: new Date().toISOString(),
    };
    demoUsers.push(newUser);
    localStorage.setItem('fidha_demo_user_id', user.uid);
    return;
  }

  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    id: user.uid,
    name,
    anonymousId: `anon_${Math.random().toString(36).substr(2, 9)}`,
    isOnline: true,
    lastSeen: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
};

export const updateUserOnlineStatus = async (userId: string, isOnline: boolean): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    isOnline,
    lastSeen: serverTimestamp(),
  });
};

export const getCurrentUser = async (): Promise<User | null> => {
  const user = getCurrentFirebaseUser();
  if (!user) return null;

  if (isDemoMode) {
    return demoUsers.find(u => u.id === user.uid) || null;
  }

  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  
  if (userDoc.exists()) {
    return userDoc.data() as User;
  }
  return null;
};

// Nearby users
export const getNearbyUsers = async (): Promise<User[]> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];

  console.log('Getting nearby users. Current user:', currentUser.name, 'Demo mode:', isDemoMode);

  if (isDemoMode) {
    // In demo mode, return other demo users
    const users = demoUsers.filter(user => user.id !== currentUser.id && user.isOnline);
    console.log('Demo mode - Found users:', users.map(u => u.name));
    return users;
  }

  // Get all online users except current user
  const usersRef = collection(db, 'users');
  const q = query(
    usersRef,
    where('isOnline', '==', true),
    orderBy('lastSeen', 'desc'),
    limit(20)
  );

  const querySnapshot = await getDocs(q);
  const users: User[] = [];
  
  querySnapshot.forEach((doc) => {
    const userData = doc.data() as User;
    if (userData.id !== currentUser.id) {
      users.push(userData);
    }
  });

  console.log('Firebase mode - Found users:', users.map(u => u.name));
  return users;
};

// Outfit descriptions
export const submitOutfitDescription = async (
  targetUserId: string,
  clothing: string[],
  accessories: string[],
  activity: string[]
): Promise<boolean> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return false;

  const description: OutfitDescription = {
    id: `desc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: currentUser.id,
    targetUserId,
    clothing,
    accessories,
    activity,
    timestamp: new Date().toISOString(),
    location: {
      latitude: 37.7749 + (Math.random() - 0.5) * 0.01, // Demo location
      longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
    },
  };

  // Save description
  const descriptionsRef = collection(db, 'outfitDescriptions');
  await addDoc(descriptionsRef, description);

  // Check for mutual match
  const existingQuery = query(
    descriptionsRef,
    where('userId', '==', targetUserId),
    where('targetUserId', '==', currentUser.id)
  );
  
  const existingSnapshot = await getDocs(existingQuery);
  
  if (!existingSnapshot.empty) {
    const existingDescription = existingSnapshot.docs[0].data() as OutfitDescription;
    
    // Create match
    const match: Match = {
      id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user1Id: currentUser.id,
      user2Id: targetUserId,
      user1Description: description,
      user2Description: existingDescription,
      timestamp: new Date().toISOString(),
      status: 'matched',
      chatId: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    // Save match
    const matchesRef = collection(db, 'matches');
    await addDoc(matchesRef, match);

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

    const chatsRef = collection(db, 'chats');
    await addDoc(chatsRef, chat);

    // Show immediate notification for match
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Match Found! 💬', {
        body: 'You both noticed each other! Click to start chatting.',
        icon: '/favicon.ico',
        requireInteraction: true
      });
    }

    return true; // Match found
  }

  return false; // No match yet
};

// Chat management
export const getChatMessages = async (chatId: string): Promise<ChatMessage[]> => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  
  const querySnapshot = await getDocs(q);
  const messages: ChatMessage[] = [];
  
  querySnapshot.forEach((doc) => {
    messages.push(doc.data() as ChatMessage);
  });

  return messages;
};

export const sendMessage = async (chatId: string, content: string): Promise<ChatMessage> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error('User not authenticated');

  const message: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    chatId,
    senderId: currentUser.id,
    content,
    timestamp: new Date().toISOString(),
    isRead: false,
  };

  // Save message
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  await addDoc(messagesRef, message);

  // Update chat's last message
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    lastMessage: message,
    lastMessageTime: serverTimestamp(),
  });

  return message;
};

// Conversation history
export const getConversationHistory = async (): Promise<Conversation[]> => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];

  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('user1Id', '==', currentUser.id),
    orderBy('lastMessageTime', 'desc')
  );

  const querySnapshot = await getDocs(q);
  const conversations: Conversation[] = [];

  for (const chatDoc of querySnapshot.docs) {
    const chatData = chatDoc.data() as Chat;
    const otherUserId = chatData.user1Id === currentUser.id ? chatData.user2Id : chatData.user1Id;
    
    // Get other user's info
    const userRef = doc(db, 'users', otherUserId);
    const userDoc = await getDoc(userRef);
    const otherUser = userDoc.exists() ? userDoc.data() as User : null;

    conversations.push({
      id: chatData.id,
      personName: otherUser?.name || 'Unknown Person',
      lastMessage: chatData.lastMessage?.content || 'No messages yet',
      lastMessageTime: chatData.lastMessage?.timestamp || chatData.messages[0]?.timestamp || new Date().toISOString(),
      isActive: otherUser?.isOnline || false,
    });
  }

  return conversations;
};

// Real-time listeners
export const subscribeToNearbyUsers = (callback: (users: User[]) => void) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('isOnline', '==', true));
  
  return onSnapshot(q, (snapshot) => {
    const users: User[] = [];
    snapshot.forEach((doc) => {
      users.push(doc.data() as User);
    });
    callback(users);
  });
};

export const subscribeToChatMessages = (chatId: string, callback: (messages: ChatMessage[]) => void) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = [];
    snapshot.forEach((doc) => {
      messages.push(doc.data() as ChatMessage);
    });
    callback(messages);
  });
};

// Subscribe to new matches for current user
export const subscribeToMatches = async (callback: (match: Match) => void) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return () => {};

  const matchesRef = collection(db, 'matches');
  const q = query(
    matchesRef,
    where('user1Id', '==', currentUser.id),
    where('status', '==', 'matched')
  );

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const match = change.doc.data() as Match;
        callback(match);
        
        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('New Match! 💬', {
            body: 'Someone noticed you too! Start a conversation.',
            icon: '/favicon.ico'
          });
        }
      }
    });
  });
};

// Subscribe to new messages for current user
export const subscribeToNewMessages = async (callback: (message: ChatMessage) => void) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return () => {};

  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('user1Id', '==', currentUser.id)
  );

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'modified') {
        const chat = change.doc.data() as Chat;
        if (chat.lastMessage && chat.lastMessage.senderId !== currentUser.id) {
          callback(chat.lastMessage);
          
          // Show browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Message 💬', {
              body: chat.lastMessage.content.substring(0, 50) + '...',
              icon: '/favicon.ico'
            });
          }
        }
      }
    });
  });
};

// Request notification permissions
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    console.log('Notification permission denied');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

// Initialize user on app start
export const initializeUser = async (): Promise<User> => {
  let user = await getCurrentUser();
  
  if (!user) {
    // Sign in anonymously
    const firebaseUser = await signInUser();
    
    // Create user profile with random name
    const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Quinn', 'Avery'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    
    await createUserProfile(firebaseUser, randomName);
    user = await getCurrentUser();
  }

  // Update online status
  if (user) {
    await updateUserOnlineStatus(user.id, true);
  }

  // In demo mode, create some fake users for testing
  if (isDemoMode && demoUsers.length < 3) {
    const fakeNames = ['Sarah', 'Emma', 'Michael', 'Lisa', 'David'];
    for (let i = 0; i < 3; i++) {
      const fakeUser: User = {
        id: `fake_${i}`,
        name: fakeNames[i % fakeNames.length],
        anonymousId: `anon_fake_${i}`,
        isOnline: true,
        lastSeen: new Date().toISOString(),
      };
      demoUsers.push(fakeUser);
    }
  }

  return user!;
};

// Cleanup on app close
export const cleanupUser = async (): Promise<void> => {
  const user = await getCurrentUser();
  if (user) {
    await updateUserOnlineStatus(user.id, false);
  }
}; 