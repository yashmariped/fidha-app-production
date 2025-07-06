import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

// Types
interface OutfitData {
  userId: string;
  outfitDescription: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: admin.firestore.Timestamp;
}

interface MatchData {
  participants: string[];
  createdAt: admin.firestore.Timestamp;
  status: 'active' | 'expired';
}

interface UserData {
  fcmToken?: string;
  displayName?: string;
  profilePicture?: string;
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper function to find similar outfit descriptions
function findSimilarOutfits(outfitDescription: string, outfits: OutfitData[]): OutfitData[] {
  const keywords = outfitDescription.toLowerCase().split(' ');
  return outfits.filter(outfit => {
    const outfitKeywords = outfit.outfitDescription.toLowerCase().split(' ');
    const commonKeywords = keywords.filter(keyword => 
      outfitKeywords.some(outfitKeyword => 
        outfitKeyword.includes(keyword) || keyword.includes(outfitKeyword)
      )
    );
    return commonKeywords.length >= Math.min(2, Math.min(keywords.length, outfitKeywords.length));
  });
}

// Cloud Function: Triggered when a new outfit is submitted
export const onOutfitSubmitted = functions.firestore
  .document('outfits/{outfitId}')
  .onCreate(async (snap, context) => {
    try {
      const newOutfit = snap.data() as OutfitData;
      console.log(`New outfit submitted by user ${newOutfit.userId}`);

      // Get recent outfits from the same location (within 1km)
      const recentOutfitsQuery = await db.collection('outfits')
        .where('timestamp', '>', admin.firestore.Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000))) // Last 24 hours
        .get();

      const recentOutfits: OutfitData[] = [];
      recentOutfitsQuery.forEach(doc => {
        const outfit = doc.data() as OutfitData;
        if (outfit.userId !== newOutfit.userId) {
          const distance = calculateDistance(
            newOutfit.location.latitude, newOutfit.location.longitude,
            outfit.location.latitude, outfit.location.longitude
          );
          if (distance <= 1) { // Within 1km
            recentOutfits.push(outfit);
          }
        }
      });

      // Find similar outfits
      const similarOutfits = findSimilarOutfits(newOutfit.outfitDescription, recentOutfits);

      // Create matches for similar outfits
      for (const similarOutfit of similarOutfits) {
        // Check if match already exists
        const existingMatchQuery = await db.collection('matches')
          .where('participants', 'array-contains', newOutfit.userId)
          .where('participants', 'array-contains', similarOutfit.userId)
          .get();

        if (existingMatchQuery.empty) {
          // Create new match
          const matchData: MatchData = {
            participants: [newOutfit.userId, similarOutfit.userId],
            createdAt: admin.firestore.Timestamp.now(),
            status: 'active'
          };

          const matchRef = await db.collection('matches').add(matchData);

          // Add participants to match subcollection
          await matchRef.collection('participants').doc(newOutfit.userId).set({
            joinedAt: admin.firestore.Timestamp.now()
          });
          await matchRef.collection('participants').doc(similarOutfit.userId).set({
            joinedAt: admin.firestore.Timestamp.now()
          });

          // Send notifications to both users
          await sendMatchNotification(newOutfit.userId, similarOutfit.userId, matchRef.id);
          await sendMatchNotification(similarOutfit.userId, newOutfit.userId, matchRef.id);

          console.log(`Match created between ${newOutfit.userId} and ${similarOutfit.userId}`);
        }
      }
    } catch (error) {
      console.error('Error processing outfit submission:', error);
    }
  });

// Cloud Function: Send match notification
async function sendMatchNotification(userId: string, matchedUserId: string, matchId: string) {
  try {
    // Get user data
    const userDoc = await db.collection('users').doc(userId).get();
    const matchedUserDoc = await db.collection('users').doc(matchedUserId).get();

    if (!userDoc.exists || !matchedUserDoc.exists) {
      console.log('User document not found');
      return;
    }

    const userData = userDoc.data() as UserData;
    const matchedUserData = matchedUserDoc.data() as UserData;

    if (!userData.fcmToken) {
      console.log(`No FCM token for user ${userId}`);
      return;
    }

    // Create notification message
    const message = {
      token: userData.fcmToken,
      notification: {
        title: 'New Match! 🎉',
        body: `You matched with someone wearing a similar outfit! Start a conversation.`
      },
      data: {
        matchId: matchId,
        matchedUserId: matchedUserId,
        matchedUserName: matchedUserData.displayName || 'Someone',
        type: 'match'
      },
      android: {
        notification: {
          sound: 'default',
          priority: 'high'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };

    // Send notification
    const response = await messaging.send(message);
    console.log(`Notification sent to ${userId}:`, response);

    // Store notification in Firestore
    await db.collection('notifications').add({
      userId: userId,
      title: 'New Match! 🎉',
      body: `You matched with someone wearing a similar outfit! Start a conversation.`,
      data: {
        matchId: matchId,
        matchedUserId: matchedUserId,
        type: 'match'
      },
      timestamp: admin.firestore.Timestamp.now(),
      read: false
    });

  } catch (error) {
    console.error('Error sending match notification:', error);
  }
}

// Cloud Function: Triggered when a new message is sent
export const onMessageSent = functions.firestore
  .document('matches/{matchId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    try {
      const message = snap.data();
      const matchId = context.params.matchId;

      // Get match participants
      const matchDoc = await db.collection('matches').doc(matchId).get();
      if (!matchDoc.exists) return;

      const matchData = matchDoc.data() as MatchData;
      const recipientId = matchData.participants.find(id => id !== message.senderId);

      if (!recipientId) return;

      // Get recipient's FCM token
      const recipientDoc = await db.collection('users').doc(recipientId).get();
      if (!recipientDoc.exists) return;

      const recipientData = recipientDoc.data() as UserData;
      if (!recipientData.fcmToken) return;

      // Send push notification
      const notificationMessage = {
        token: recipientData.fcmToken,
        notification: {
          title: 'New Message 💬',
          body: message.text || 'Someone sent you a message'
        },
        data: {
          matchId: matchId,
          senderId: message.senderId,
          type: 'message'
        },
        android: {
          notification: {
            sound: 'default',
            priority: 'high'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        }
      };

      await messaging.send(notificationMessage);

      // Store notification in Firestore
      await db.collection('notifications').add({
        userId: recipientId,
        title: 'New Message 💬',
        body: message.text || 'Someone sent you a message',
        data: {
          matchId: matchId,
          senderId: message.senderId,
          type: 'message'
        },
        timestamp: admin.firestore.Timestamp.now(),
        read: false
      });

    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

// Cloud Function: Clean up expired matches (runs every hour)
export const cleanupExpiredMatches = functions.pubsub
  .schedule('every 1 hours')
  .onRun(async (context) => {
    try {
      const oneDayAgo = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() - 24 * 60 * 60 * 1000)
      );

      const expiredMatchesQuery = await db.collection('matches')
        .where('createdAt', '<', oneDayAgo)
        .where('status', '==', 'active')
        .get();

      const batch = db.batch();
      expiredMatchesQuery.forEach(doc => {
        batch.update(doc.ref, { status: 'expired' });
      });

      await batch.commit();
      console.log(`Marked ${expiredMatchesQuery.size} matches as expired`);
    } catch (error) {
      console.error('Error cleaning up expired matches:', error);
    }
  });

// Cloud Function: Update user's FCM token
export const updateFCMToken = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { fcmToken } = data;
    if (!fcmToken) {
      throw new functions.https.HttpsError('invalid-argument', 'FCM token is required');
    }

    await db.collection('users').doc(context.auth.uid).update({
      fcmToken: fcmToken,
      lastTokenUpdate: admin.firestore.Timestamp.now()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating FCM token:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update FCM token');
  }
}); 