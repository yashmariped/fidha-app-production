# Fidha - Anonymous Real-World Reconnections

**PROPRIETARY SOFTWARE** - Copyright (c) 2024 Fidha App. All rights reserved.

This software is licensed under a proprietary license. See [LICENSE](LICENSE) for details.

---

Fidha is a React Native app that enables anonymous real-world reconnections based on visual memory using BLE scanning, Firebase backend, and push notifications.

## 🚀 Features

- **BLE Scanning**: Anonymous device discovery
- **Visual Memory Matching**: Outfit description matching
- **Real-time Chat**: Secure messaging after matches
- **Location Services**: Proximity-based connections
- **Push Notifications**: Instant match alerts
- **Firebase Backend**: Scalable cloud infrastructure

## 📱 Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Firebase (Auth, Firestore, Functions)
- **Navigation**: React Navigation
- **BLE**: Expo Bluetooth
- **Location**: Expo Location
- **Notifications**: Expo Notifications
- **Language**: TypeScript

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Expo CLI
- EAS CLI
- Firebase Project

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd fidha

# Install dependencies
npm install

# Start development server
npm start
```

### Environment Setup
1. Copy `env.example` to `.env`
2. Fill in your Firebase configuration
3. Update `app.json` with your bundle identifiers

## 🏗️ Production Build

### 1. Configure EAS
```bash
# Login to Expo
eas login

# Configure EAS Build
eas build:configure
```

### 2. Build for Production
```bash
# Android APK/AAB
npm run build:android

# iOS IPA
npm run build:ios

# Preview build (internal testing)
npm run build:preview
```

### 3. Submit to Stores
```bash
# Submit to Google Play Store
npm run submit:android

# Submit to App Store
npm run submit:ios
```

## 🔧 Configuration

### Firebase Setup
1. Create Firebase project
2. Enable Authentication, Firestore, Functions
3. Set up security rules
4. Configure push notifications

### App Store Setup
1. Create App Store Connect app
2. Configure app metadata
3. Set up certificates and provisioning profiles

### Google Play Setup
1. Create Google Play Console app
2. Configure app signing
3. Set up release tracks

## 📋 Pre-Launch Checklist

### Technical
- [ ] All TypeScript errors resolved
- [ ] Firebase security rules configured
- [ ] Push notifications tested
- [ ] BLE permissions working
- [ ] Location services tested
- [ ] App icons and splash screens set
- [ ] Privacy policy and terms of service

### App Store
- [ ] App metadata complete
- [ ] Screenshots and videos uploaded
- [ ] Age rating configured
- [ ] Content rights verified
- [ ] Export compliance completed

### Google Play
- [ ] App content rating completed
- [ ] Privacy policy URL added
- [ ] App signing configured
- [ ] Release notes prepared

## 🚀 Deployment Steps

1. **Final Testing**
   ```bash
   npm run type-check
   npm run build:preview
   ```

2. **Production Build**
   ```bash
   npm run build:android
   npm run build:ios
   ```

3. **Store Submission**
   ```bash
   npm run submit:android
   npm run submit:ios
   ```

4. **Monitor Release**
   - Track app store reviews
   - Monitor crash reports
   - Analyze user feedback

## 📊 Analytics & Monitoring

- **Firebase Analytics**: User behavior tracking
- **Crashlytics**: Crash reporting
- **Performance Monitoring**: App performance
- **App Store Connect**: Store analytics

## 🔒 Security Considerations

- Firebase security rules configured
- User data anonymized
- BLE scanning privacy compliant
- Location data minimized
- Chat encryption implemented

## 📞 Support

For technical support or questions:
- Email: support@fidha.app
- Documentation: [docs.fidha.app](https://docs.fidha.app)
- GitHub Issues: [github.com/fidha/issues](https://github.com/fidha/issues)

## 📄 License

This project is licensed under a proprietary license. See [LICENSE](LICENSE) for details.

**For licensing inquiries, contact: legal@fidha.app** 