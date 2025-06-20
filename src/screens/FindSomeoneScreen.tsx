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
import { RootStackParamList, BLEDevice } from '../types';
import bleService from '../services/bleService';
import locationService from '../services/locationService';

type FindSomeoneScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'FindSomeone'>;
  route: RouteProp<RootStackParamList, 'FindSomeone'>;
};

const FindSomeoneScreen: React.FC<FindSomeoneScreenProps> = ({ navigation }) => {
  const [nearbyDevices, setNearbyDevices] = useState<BLEDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    startScanning();
    return () => {
      bleService.stopScanning();
    };
  }, []);

  const startScanning = async () => {
    try {
      setIsScanning(true);
      
      // Get current location
      const currentLocation = await locationService.getCurrentLocation();
      setLocation(currentLocation);

      // Start BLE scanning
      await bleService.startScanning((device) => {
        setNearbyDevices(prev => {
          const existing = prev.find(d => d.id === device.id);
          if (existing) {
            return prev.map(d => d.id === device.id ? device : d);
          }
          return [...prev, device];
        });
      });
    } catch (error) {
      console.error('Error starting scan:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDeviceSelect = (device: BLEDevice) => {
    if (device.userId) {
      navigation.navigate('WhatWasSheWearing', { targetUserId: device.userId });
    }
  };

  const renderDevice = ({ item: device }: { item: BLEDevice }) => (
    <TouchableOpacity
      style={styles.deviceCard}
      onPress={() => handleDeviceSelect(device)}
    >
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>
          {device.name}
        </Text>
        <Text style={styles.deviceDistance}>
          {bleService.calculateDistance(device.rssi).toFixed(1)}m away
        </Text>
      </View>
      <View style={styles.signalIndicator} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
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
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text style={styles.scanningText}>
              Scanning for nearby users...
            </Text>
          </View>
        ) : nearbyDevices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No nearby users found
            </Text>
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
          <FlatList
            data={nearbyDevices}
            renderItem={renderDevice}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.deviceList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A34',
  },
  backButton: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6C63FF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    fontSize: 16,
    color: '#B3B3B3',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#B3B3B3',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  deviceList: {
    paddingBottom: 24,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#1A1A24',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  deviceDistance: {
    fontSize: 14,
    color: '#B3B3B3',
  },
  signalIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6C63FF',
  },
});

export default FindSomeoneScreen; 