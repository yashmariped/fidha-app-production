export interface User {
  id: string;
  anonymousId: string;
  createdAt: string;
  lastActive: string;
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

export interface DiscoverySession {
  id: string;
  userId: string;
  anonymousId: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  bleDevices: string[]; // Array of nearby device IDs
  status: 'active' | 'expired' | 'matched';
  expiresAt: string; // 15 minutes from creation
}

export interface OutfitDescription {
  id: string;
  sessionId: string;
  userId: string;
  targetUserId: string; // The person they're describing
  description: {
    clothing: string[];
    accessories: string[];
    activity: string[];
    colors: string[];
  };
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface Match {
  id: string;
  sessionId1: string;
  sessionId2: string;
  user1Id: string;
  user2Id: string;
  user1Description: OutfitDescription;
  user2Description: OutfitDescription;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  chatId?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'location';
  metadata?: {
    imageUrl?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface Chat {
  id: string;
  matchId: string;
  user1Id: string;
  user2Id: string;
  createdAt: string;
  lastMessage?: {
    content: string;
    timestamp: string;
    senderId: string;
  };
  status: 'active' | 'archived' | 'blocked';
}

export interface BLEDevice {
  id: string;
  name: string;
  rssi: number;
  timestamp: string;
  userId?: string; // Only if device is registered
} 