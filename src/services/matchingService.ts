import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  Timestamp,
  doc,
  updateDoc,
  orderBy,
  limit,
  writeBatch
} from 'firebase/firestore';
import { 
  OutfitDescription, 
  Match, 
  DiscoverySession,
  LocationData 
} from '../types';
import locationService from './locationService';

class MatchingService {
  private readonly MATCH_RADIUS_METERS = 100; // 100 meter radius
  private readonly MATCH_TIME_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

  async createDiscoverySession(userId: string, anonymousId: string, location: LocationData): Promise<string> {
    const session = {
      userId,
      anonymousId,
      timestamp: new Date().toISOString(),
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
      },
      bleDevices: [],
      status: 'active' as const,
      expiresAt: new Date(Date.now() + this.MATCH_TIME_WINDOW_MS).toISOString(),
    };

    const docRef = await addDoc(collection(db, 'discoverySessions'), session);
    return docRef.id;
  }

  async submitOutfitDescription(
    sessionId: string,
    userId: string,
    targetUserId: string,
    description: {
      clothing: string[];
      accessories: string[];
      activity: string[];
      colors: string[];
    },
    location: LocationData
  ): Promise<string> {
    const outfitDescription: Omit<OutfitDescription, 'id'> = {
      sessionId,
      userId,
      targetUserId,
      description,
      timestamp: new Date().toISOString(),
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    };

    const docRef = await addDoc(collection(db, 'outfitDescriptions'), outfitDescription);
    return docRef.id;
  }

  async findMatches(userId: string, sessionId: string): Promise<Match[]> {
    const matches: Match[] = [];

    // Get all outfit descriptions for this session
    const sessionQuery = query(
      collection(db, 'outfitDescriptions'),
      where('sessionId', '==', sessionId)
    );
    const sessionDocs = await getDocs(sessionQuery);
    const sessionDescriptions = sessionDocs.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as OutfitDescription[];

    // Get all active discovery sessions within time window
    const timeWindow = new Date(Date.now() - this.MATCH_TIME_WINDOW_MS);
    const sessionsQuery = query(
      collection(db, 'discoverySessions'),
      where('status', '==', 'active'),
      where('timestamp', '>=', timeWindow.toISOString())
    );
    const sessionsDocs = await getDocs(sessionsQuery);
    const activeSessions = sessionsDocs.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DiscoverySession[];

    // For each session description, look for matching descriptions
    for (const description of sessionDescriptions) {
      const otherDescriptions = sessionDescriptions.filter(d => 
        d.userId !== description.userId && 
        d.targetUserId === description.userId
      );

      for (const otherDescription of otherDescriptions) {
        // Check if they're within the time window
        const timeDiff = Math.abs(
          new Date(description.timestamp).getTime() - 
          new Date(otherDescription.timestamp).getTime()
        );
        
        if (timeDiff > this.MATCH_TIME_WINDOW_MS) continue;

        // Check if they're within the location radius
        const distance = locationService.calculateDistance(
          description.location.latitude,
          description.location.longitude,
          otherDescription.location.latitude,
          otherDescription.location.longitude
        );

        if (distance > this.MATCH_RADIUS_METERS) continue;

        // Check if descriptions match (simplified matching logic)
        const matchScore = this.calculateMatchScore(description, otherDescription);
        
        if (matchScore >= 0.7) { // 70% match threshold
          const match: Omit<Match, 'id'> = {
            sessionId1: description.sessionId,
            sessionId2: otherDescription.sessionId,
            user1Id: description.userId,
            user2Id: otherDescription.userId,
            user1Description: description,
            user2Description: otherDescription,
            timestamp: new Date().toISOString(),
            location: {
              latitude: (description.location.latitude + otherDescription.location.latitude) / 2,
              longitude: (description.location.longitude + otherDescription.location.longitude) / 2,
            },
            status: 'pending',
          };

          const matchRef = await addDoc(collection(db, 'matches'), match);
          matches.push({ id: matchRef.id, ...match });
        }
      }
    }

    return matches;
  }

  private calculateMatchScore(desc1: OutfitDescription, desc2: OutfitDescription): number {
    let totalScore = 0;
    let maxScore = 0;

    // Clothing match (40% weight)
    const clothingScore = this.calculateArrayOverlap(
      desc1.description.clothing,
      desc2.description.clothing
    );
    totalScore += clothingScore * 0.4;
    maxScore += 0.4;

    // Accessories match (25% weight)
    const accessoriesScore = this.calculateArrayOverlap(
      desc1.description.accessories,
      desc2.description.accessories
    );
    totalScore += accessoriesScore * 0.25;
    maxScore += 0.25;

    // Activity match (20% weight)
    const activityScore = this.calculateArrayOverlap(
      desc1.description.activity,
      desc2.description.activity
    );
    totalScore += activityScore * 0.2;
    maxScore += 0.2;

    // Colors match (15% weight)
    const colorsScore = this.calculateArrayOverlap(
      desc1.description.colors,
      desc2.description.colors
    );
    totalScore += colorsScore * 0.15;
    maxScore += 0.15;

    return totalScore / maxScore;
  }

  private calculateArrayOverlap(arr1: string[], arr2: string[]): number {
    if (arr1.length === 0 && arr2.length === 0) return 1;
    if (arr1.length === 0 || arr2.length === 0) return 0;

    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  async acceptMatch(matchId: string): Promise<void> {
    await updateDoc(doc(db, 'matches', matchId), {
      status: 'accepted',
    });
  }

  async rejectMatch(matchId: string): Promise<void> {
    await updateDoc(doc(db, 'matches', matchId), {
      status: 'rejected',
    });
  }

  async getUserMatches(userId: string): Promise<Match[]> {
    const matchesQuery = query(
      collection(db, 'matches'),
      where('user1Id', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    
    const matchesDocs = await getDocs(matchesQuery);
    return matchesDocs.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Match[];
  }

  async cleanupExpiredSessions(): Promise<void> {
    const expiredQuery = query(
      collection(db, 'discoverySessions'),
      where('expiresAt', '<=', new Date().toISOString()),
      where('status', '==', 'active')
    );
    
    const expiredDocs = await getDocs(expiredQuery);
    const batch = writeBatch(db);
    
    expiredDocs.docs.forEach(doc => {
      batch.update(doc.ref, { status: 'expired' });
    });
    
    await batch.commit();
  }
}

export const matchingService = new MatchingService();
export default matchingService; 