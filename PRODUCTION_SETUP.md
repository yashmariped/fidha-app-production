# 🚀 Fidha Production Setup Guide

## **Step 1: Firebase Project Setup**

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Name: `fidha-production`
4. Enable Google Analytics (recommended)
5. Choose analytics account or create new

### 1.2 Enable Firebase Services
```bash
# Enable these services in Firebase Console:
✅ Authentication
✅ Firestore Database
✅ Cloud Functions
✅ Cloud Storage
✅ Analytics
✅ Crashlytics
```

### 1.3 Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click "Add app" → Web app
4. Name: `fidha-web`
5. Copy the config object

### 1.4 Create Environment File
```bash
# Create .env file in project root
cp env.example .env

# Fill in your Firebase values:
EXPO_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## **Step 2: EAS Project Setup**

### 2.1 Login to EAS
```bash
eas login
# Enter your Expo account credentials
```

### 2.2 Initialize EAS Project
```bash
eas build:configure
# This will create/update eas.json
```

### 2.3 Get Project ID
```bash
# After configuration, update app.json:
"extra": {
  "eas": {
    "projectId": "your-actual-project-id"
  }
}
```

## **Step 3: App Store Setup**

### 3.1 iOS App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app
3. Bundle ID: `com.fidha.app`
4. Platform: iOS
5. Name: `Fidha`

### 3.2 Android Google Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Package name: `com.fidha.app`
4. App name: `Fidha`

## **Step 4: Production Build**

### 4.1 Test Build
```bash
# Create preview build for testing
npm run build:preview
```

### 4.2 Production Build
```bash
# Build for production
npm run build:android  # Android APK/AAB
npm run build:ios      # iOS IPA
```

### 4.3 Submit to Stores
```bash
# Submit to app stores
npm run submit:android # Google Play
npm run submit:ios     # App Store
```

## **Step 5: Pre-Launch Checklist**

### Technical
- [ ] Firebase project created and configured
- [ ] Environment variables set in .env
- [ ] EAS project ID updated in app.json
- [ ] App tested on real devices
- [ ] All features working correctly
- [ ] Push notifications tested

### App Store Requirements
- [ ] App metadata complete
- [ ] Screenshots uploaded (all device sizes)
- [ ] App description written
- [ ] Privacy policy URL added
- [ ] Age rating configured
- [ ] Content rights verified

### Legal
- [ ] Privacy policy created
- [ ] Terms of service created
- [ ] Data handling compliance
- [ ] GDPR compliance (if applicable)

## **Step 6: Monitoring Setup**

### 6.1 Firebase Analytics
- Enable in Firebase Console
- Set up custom events
- Monitor user engagement

### 6.2 Crashlytics
- Enable in Firebase Console
- Set up crash reporting
- Monitor app stability

### 6.3 Performance Monitoring
- Enable in Firebase Console
- Monitor app performance
- Track API response times

## **Troubleshooting**

### Common Issues
1. **Firebase config errors**: Check .env file values
2. **Build failures**: Check EAS project configuration
3. **App store rejection**: Review app store guidelines
4. **Permission issues**: Verify app.json permissions

### Support
- Firebase Docs: https://firebase.google.com/docs
- Expo Docs: https://docs.expo.dev
- EAS Docs: https://docs.expo.dev/build/introduction/ 