import { BLEDevice } from '../types';
import * as Device from 'expo-device';

class BLEService {
  private isScanning = false;
  private scanCallback: ((device: BLEDevice) => void) | null = null;
  private mockDevices: BLEDevice[] = [];

  constructor() {
    this.initializeMockDevices();
  }

  private initializeMockDevices() {
    // Create mock devices for testing
    this.mockDevices = [
      {
        id: 'device_1',
        name: 'iPhone 15 Pro',
        rssi: -45,
        timestamp: new Date().toISOString(),
        userId: 'user_123',
      },
      {
        id: 'device_2',
        name: 'Samsung Galaxy S24',
        rssi: -52,
        timestamp: new Date().toISOString(),
        userId: 'user_456',
      },
      {
        id: 'device_3',
        name: 'Google Pixel 8',
        rssi: -58,
        timestamp: new Date().toISOString(),
        userId: 'user_789',
      },
    ];
  }

  async requestPermissions(): Promise<boolean> {
    // For now, return true to simulate permission granted
    // In a real app, you would check actual Bluetooth permissions
    console.log('BLE permissions requested');
    return true;
  }

  async isBluetoothEnabled(): Promise<boolean> {
    // Check if device supports Bluetooth
    return Device.isDevice;
  }

  async startScanning(callback: (device: BLEDevice) => void): Promise<void> {
    if (this.isScanning) {
      console.log('BLE scanning already in progress');
      return;
    }

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Bluetooth permissions not granted');
    }

    const isEnabled = await this.isBluetoothEnabled();
    if (!isEnabled) {
      throw new Error('Bluetooth is not enabled');
    }

    this.isScanning = true;
    this.scanCallback = callback;

    console.log('Starting BLE scan...');

    // Simulate device discovery with mock data
    this.simulateDeviceDiscovery();
  }

  private simulateDeviceDiscovery() {
    if (!this.isScanning || !this.scanCallback) return;

    // Simulate finding devices with random delays
    this.mockDevices.forEach((device, index) => {
      setTimeout(() => {
        if (this.isScanning && this.scanCallback) {
          // Update RSSI to simulate movement
          const updatedDevice = {
            ...device,
            rssi: device.rssi + Math.floor(Math.random() * 10) - 5,
            timestamp: new Date().toISOString(),
          };
          this.scanCallback!(updatedDevice);
        }
      }, index * 1000 + Math.random() * 2000);
    });

    // Continue scanning for new devices
    setTimeout(() => {
      if (this.isScanning) {
        this.simulateDeviceDiscovery();
      }
    }, 5000);
  }

  async stopScanning(): Promise<void> {
    this.isScanning = false;
    this.scanCallback = null;
    console.log('BLE scanning stopped');
  }

  calculateDistance(rssi: number): number {
    // Simple distance calculation based on RSSI
    // This is a rough approximation - real implementations would be more complex
    if (rssi >= -50) return 1; // Very close
    if (rssi >= -60) return 2; // Close
    if (rssi >= -70) return 5; // Medium
    if (rssi >= -80) return 10; // Far
    return 20; // Very far
  }

  async startAdvertising(userId: string): Promise<void> {
    // In a real implementation, this would start advertising the device
    console.log(`Started advertising for user: ${userId}`);
  }

  async stopAdvertising(): Promise<void> {
    // In a real implementation, this would stop advertising
    console.log('Stopped advertising');
  }

  // Method to add a new mock device for testing
  addMockDevice(device: BLEDevice): void {
    this.mockDevices.push(device);
  }

  // Method to clear mock devices
  clearMockDevices(): void {
    this.mockDevices = [];
  }

  // Method to get current mock devices
  getMockDevices(): BLEDevice[] {
    return [...this.mockDevices];
  }
}

export const bleService = new BLEService();
export default bleService; 