import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { getNearbyUsers, subscribeToNearbyUsers, User } from '../services/firebaseService';

type FindSomeoneScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'FindSomeone'>;
  route: RouteProp<RootStackParamList, 'FindSomeone'>;
};

const FindSomeoneScreen: React.FC<FindSomeoneScreenProps> = ({ navigation }) => {
  const [nearbyUsers, setNearbyUsers] = useState<User[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);

  // Gradient colors as tuple for LinearGradient
  const gradientColors: [string, string] = [COLORS.primary, COLORS.primaryLight];

  useEffect(() => {
    startScanning();
    
    // Set up real-time subscription to nearby users
    const unsubscribe = subscribeToNearbyUsers((users) => {
      console.log('Real-time update: Found', users.length, 'users');
      setNearbyUsers(users);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setLastScanTime(new Date());
      
      // Get nearby users from Firebase
      const users = await getNearbyUsers();
      setNearbyUsers(users);
      
      console.log(`Scan complete: Found ${users.length} real users`);
    } catch (error) {
      console.error('Error getting nearby users:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleUserSelect = (user: User) => {
    navigation.navigate('WhatWasSheWearing', { targetUserId: user.id });
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const renderUser = ({ item: user }: { item: User }) => (
    <TouchableOpacity
      style={styles.deviceCard}
      onPress={() => handleUserSelect(user)}
    >
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>
          {user.profile?.name || 'Anonymous User'}
        </Text>
        <Text style={styles.deviceDistance}>
          {user.isOnline ? 'Online now' : `Last seen ${getTimeAgo(user.lastSeen)}`}
        </Text>
      </View>
      <View style={[
        styles.signalIndicator,
        { backgroundColor: user.isOnline ? COLORS.success : '#FFD700' }
      ]} />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.gradientBg}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Find Someone</Text>
          <View style={{ width: 50 }} />
        </View>

        <View style={styles.content}>
          {isScanning ? (
            <View style={styles.scanningContainer}>
              <ActivityIndicator size="large" color={COLORS.text} />
              <Text style={styles.scanningText}>
                Scanning for nearby users...
              </Text>
              <Text style={styles.scanningSubtext}>
                Looking for real people nearby
              </Text>
            </View>
          ) : nearbyUsers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No nearby users found
              </Text>
              <Text style={styles.emptySubtext}>
                Make sure you're in a populated area and try again
              </Text>
              {lastScanTime && (
                <Text style={styles.lastScanText}>
                  Last scan: {lastScanTime.toLocaleTimeString()}
                </Text>
              )}
              <TouchableOpacity
                style={styles.retryButton}
                onPress={startScanning}
              >
                <Text style={styles.retryButtonText}>
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.resultsContainer}>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>
                  Found {nearbyUsers.length} user{nearbyUsers.length !== 1 ? 's' : ''} nearby
                </Text>
                {lastScanTime && (
                  <Text style={styles.lastScanText}>
                    Updated: {lastScanTime.toLocaleTimeString()}
                  </Text>
                )}
              </View>
              <FlatList
                data={nearbyUsers}
                renderItem={renderUser}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.deviceList}
                showsVerticalScrollIndicator={false}
              />
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={startScanning}
              >
                <Text style={styles.refreshButtonText}>
                  Refresh
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryLight,
  },
  backButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  scanningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    fontSize: 18,
    color: COLORS.text,
    marginTop: 16,
    textAlign: 'center',
  },
  scanningSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  lastScanText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 40,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  deviceList: {
    flex: 1,
    paddingBottom: 16,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  deviceDistance: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  signalIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  refreshButton: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

export default FindSomeoneScreen; 