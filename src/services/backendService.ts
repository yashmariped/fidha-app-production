// Simulated backend service for testing
export interface User {
  id: string;
  name: string;
  anonymousId: string;
  isOnline: boolean;
  lastSeen: string;
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

// Simulated database
let users: User[] = [
  {
    id: 'user1',
    name: 'Sarah',
    anonymousId: 'anon_123',
    isOnline: true,
    lastSeen: new Date().toISOString(),
  },
  {
    id: 'user2',
    name: 'Alex',
    anonymousId: 'anon_456',
    isOnline: true,
    lastSeen: new Date().toISOString(),
  },
  {
    id: 'user3',
    name: 'Emma',
    anonymousId: 'anon_789',
    isOnline: false,
    lastSeen: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
  },
];

let outfitDescriptions: OutfitDescription[] = [];
let matches: Match[] = [];
let chats: Chat[] = [];

// Generate a random user ID
const generateUserId = (): string => {
  return 'user_' + Math.random().toString(36).substr(2, 9);
};

// Get current user (simulate login)
export const getCurrentUser = (): User => {
  const userId = localStorage.getItem('fidha_user_id');
  if (userId) {
    const user = users.find(u => u.id === userId);
    if (user) return user;
  }
  
  // Create new user
  const newUser: User = {
    id: generateUserId(),
    name: `User_${Math.floor(Math.random() * 1000)}`,
    anonymousId: 'anon_' + Math.random().toString(36).substr(2, 9),
    isOnline: true,
    lastSeen: new Date().toISOString(),
  };
  
  users.push(newUser);
  localStorage.setItem('fidha_user_id', newUser.id);
  return newUser;
};

// Get nearby users (simulate BLE scanning)
export const getNearbyUsers = async (): Promise<User[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const currentUser = getCurrentUser();
  return users.filter(user => user.id !== currentUser.id && user.isOnline);
};

// Submit outfit description
export const submitOutfitDescription = async (
  targetUserId: string,
  clothing: string[],
  accessories: string[],
  activity: string[]
): Promise<boolean> => {
  const currentUser = getCurrentUser();
  
  const description: OutfitDescription = {
    id: 'desc_' + Math.random().toString(36).substr(2, 9),
    userId: currentUser.id,
    targetUserId,
    clothing,
    accessories,
    activity,
    timestamp: new Date().toISOString(),
    location: {
      latitude: 37.7749 + (Math.random() - 0.5) * 0.01, // San Francisco area
      longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
    },
  };
  
  outfitDescriptions.push(description);
  
  // Check for mutual match
  const existingDescription = outfitDescriptions.find(
    desc => desc.userId === targetUserId && desc.targetUserId === currentUser.id
  );
  
  if (existingDescription) {
    // Create match
    const match: Match = {
      id: 'match_' + Math.random().toString(36).substr(2, 9),
      user1Id: currentUser.id,
      user2Id: targetUserId,
      user1Description: description,
      user2Description: existingDescription,
      timestamp: new Date().toISOString(),
      status: 'matched',
      chatId: 'chat_' + Math.random().toString(36).substr(2, 9),
    };
    
    matches.push(match);
    
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
          content: 'You both noticed each other! Say what you couldn\'t then.',
          timestamp: new Date().toISOString(),
          isRead: false,
        },
      ],
    };
    
    chats.push(chat);
    return true; // Match found
  }
  
  return false; // No match yet
};

// Get user's matches
export const getUserMatches = async (): Promise<Match[]> => {
  const currentUser = getCurrentUser();
  return matches.filter(match => 
    match.user1Id === currentUser.id || match.user2Id === currentUser.id
  );
};

// Get chat messages
export const getChatMessages = async (chatId: string): Promise<ChatMessage[]> => {
  const chat = chats.find(c => c.id === chatId);
  return chat?.messages || [];
};

// Send message
export const sendMessage = async (chatId: string, content: string): Promise<ChatMessage> => {
  const currentUser = getCurrentUser();
  
  const message: ChatMessage = {
    id: 'msg_' + Math.random().toString(36).substr(2, 9),
    chatId,
    senderId: currentUser.id,
    content,
    timestamp: new Date().toISOString(),
    isRead: false,
  };
  
  const chat = chats.find(c => c.id === chatId);
  if (chat) {
    chat.messages.push(message);
    chat.lastMessage = message;
  }
  
  // Simulate response after 2-5 seconds
  setTimeout(() => {
    const otherUserId = chat?.user1Id === currentUser.id ? chat.user2Id : chat?.user1Id;
    // const otherUser = users.find(u => u.id === otherUserId); // Available for future use
    
    const responses = [
      'Thanks for reaching out! I noticed you too 😊',
      'Hey! I was wondering if you\'d say something!',
      'I\'m glad you did that - I was too shy to make the first move',
      'This is so cool! I love this app already',
      'I was hoping you\'d notice me too!',
      'Thanks for the courage to reach out!',
      'I\'m so happy you did this!',
      'This is exactly what I was hoping for!',
    ];
    
    const response: ChatMessage = {
      id: 'msg_' + Math.random().toString(36).substr(2, 9),
      chatId,
      senderId: otherUserId || 'unknown',
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    
    if (chat) {
      chat.messages.push(response);
      chat.lastMessage = response;
    }
  }, 2000 + Math.random() * 3000);
  
  return message;
};

// Get user's chat history
export const getUserChats = async (): Promise<Chat[]> => {
  const currentUser = getCurrentUser();
  return chats.filter(chat => 
    chat.user1Id === currentUser.id || chat.user2Id === currentUser.id
  );
};

// Get conversation history for history screen
export const getConversationHistory = async (): Promise<Conversation[]> => {
  const currentUser = getCurrentUser();
  const userChats = chats.filter(chat => 
    chat.user1Id === currentUser.id || chat.user2Id === currentUser.id
  );
  
  return userChats.map(chat => {
    const otherUserId = chat.user1Id === currentUser.id ? chat.user2Id : chat.user1Id;
    const otherUser = users.find(u => u.id === otherUserId);
    
    return {
      id: chat.id,
      personName: otherUser?.name || 'Unknown Person',
      lastMessage: chat.lastMessage?.content || 'No messages yet',
      lastMessageTime: chat.lastMessage?.timestamp || chat.messages[0]?.timestamp || new Date().toISOString(),
      isActive: otherUser?.isOnline || false,
    };
  });
}; 