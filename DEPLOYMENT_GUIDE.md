# 🚀 Fidha Production Deployment Guide

## **Prerequisites**

1. **Firebase CLI installed**: `npm install -g firebase-tools`
2. **Firebase project created**: `fidha-app` in Firebase Console
3. **Environment variables configured**: Create `.env` file with production values
4. **EAS CLI installed**: `npm install -g @expo/eas-cli`

## **Step 1: Firebase Project Setup**

### 1.1 Login to Firebase
```bash
firebase login
```

### 1.2 Initialize Firebase in your project
```bash
npm run setup:firebase
```

Select the following options:
- ✅ Firestore
- ✅ Functions  
- ✅ Hosting
- ✅ Storage
- Choose existing project: `fidha-app`
- Use existing project

### 1.3 Configure Environment Variables
Create `.env` file in project root with your production Firebase values:

```bash
# Copy from env.example and fill in actual values
cp env.example .env
```

**Required Firebase values to get from Firebase Console:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your `fidha-app` project
3. Go to Project Settings (gear icon)
4. Scroll to "Your apps" section
5. Copy the configuration values

## **Step 2: Deploy Firebase Security Rules**

### 2.1 Deploy Firestore Rules
```bash
npm run deploy:rules
```

This deploys the secure Firestore rules that:
- ✅ Protect user data
- ✅ Allow only authorized access
- ✅ Prevent unauthorized writes to matches
- ✅ Secure chat messages

### 2.2 Deploy Storage Rules
```bash
npm run deploy:storage
```

This deploys secure Storage rules for:
- ✅ Profile pictures
- ✅ Outfit images
- ✅ Chat images
- ✅ File size limits

## **Step 3: Deploy Cloud Functions**

### 3.1 Install Function Dependencies
```bash
cd functions
npm install
cd ..
```

### 3.2 Deploy Functions
```bash
npm run deploy:functions
```

This deploys the following Cloud Functions:
- ✅ `onOutfitSubmitted` - Matchmaking logic
- ✅ `onMessageSent` - Message notifications
- ✅ `cleanupExpiredMatches` - Maintenance
- ✅ `updateFCMToken` - Token management

## **Step 4: Deploy Web App (Optional)**

### 4.1 Build Web App
```bash
cd fidha-web
npm install
npm run build
cd ..
```

### 4.2 Deploy to Firebase Hosting
```bash
npm run deploy:hosting
```

Your web app will be available at: `https://fidha-app.web.app`

## **Step 5: Deploy Everything at Once**

```bash
npm run deploy:all
```

This command deploys:
- ✅ Firestore rules
- ✅ Storage rules  
- ✅ Cloud Functions
- ✅ Web hosting

## **Step 6: Build Mobile App**

### 6.1 Login to EAS
```bash
eas login
```

### 6.2 Build Preview Version
```bash
npm run build:preview
```

### 6.3 Build Production Versions
```bash
# Android
npm run build:android

# iOS  
npm run build:ios
```

## **Step 7: Submit to App Stores**

### 7.1 Submit to Google Play
```bash
npm run submit:android
```

### 7.2 Submit to App Store
```bash
npm run submit:ios
```

## **Step 8: Post-Deployment Verification**

### 8.1 Test Firebase Services
1. **Firestore**: Verify data is being written/read correctly
2. **Functions**: Check function logs in Firebase Console
3. **Storage**: Test file uploads/downloads
4. **Hosting**: Visit your web app URL

### 8.2 Test App Features
1. **User Registration**: Create test accounts
2. **Outfit Submission**: Submit outfit descriptions
3. **Matching**: Verify match creation works
4. **Chat**: Test messaging between matched users
5. **Notifications**: Verify push notifications work

### 8.3 Monitor Performance
1. **Firebase Console**: Check Analytics, Crashlytics
2. **Function Logs**: Monitor Cloud Function performance
3. **App Performance**: Use Firebase Performance Monitoring

## **Troubleshooting**

### Common Issues

#### 1. Firebase Auth Errors
```bash
# Check if Firebase Auth is properly initialized
firebase auth:export users.json
```

#### 2. Function Deployment Failures
```bash
# Check function logs
firebase functions:log

# Redeploy specific function
firebase deploy --only functions:functionName
```

#### 3. Build Failures
```bash
# Clear cache and rebuild
expo r -c
eas build --clear-cache
```

#### 4. Environment Variables
```bash
# Verify environment variables are loaded
expo start --clear
```

### Support Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [Expo Documentation](https://docs.expo.dev)
- [EAS Documentation](https://docs.expo.dev/build/introduction/)

## **Security Checklist**

Before going live, ensure:

- [ ] Firestore rules deployed and tested
- [ ] Storage rules deployed and tested
- [ ] Cloud Functions secured
- [ ] Environment variables not in version control
- [ ] API keys properly configured
- [ ] User data protection measures in place
- [ ] Privacy policy and terms of service ready

## **Monitoring Setup**

### 8.1 Enable Firebase Services
1. **Analytics**: Track user engagement
2. **Crashlytics**: Monitor app stability
3. **Performance**: Track app performance
4. **Remote Config**: A/B testing capability

### 8.2 Set Up Alerts
1. **Function Errors**: Alert on function failures
2. **High Latency**: Alert on slow responses
3. **Storage Usage**: Monitor storage costs
4. **User Growth**: Track user acquisition

## **Next Steps**

After successful deployment:

1. **User Testing**: Share with beta testers
2. **Marketing**: Prepare app store listings
3. **Analytics**: Set up conversion tracking
4. **Support**: Prepare customer support system
5. **Scaling**: Plan for user growth

---

**🎉 Congratulations! Your Fidha app is now live and ready to connect people through fashion!** 