#!/bin/bash

echo "🚀 Fidha Production Setup Script"
echo "=================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
else
    echo "✅ Firebase CLI is installed"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp env.example .env
    echo "📝 Please edit .env file with your Firebase configuration values"
    echo "   Get these values from Firebase Console > Project Settings > Your apps"
else
    echo "✅ .env file exists"
fi

# Install function dependencies
echo "📦 Installing Cloud Function dependencies..."
cd functions
npm install
cd ..

# Check if Firebase project is initialized
if [ ! -f ".firebaserc" ]; then
    echo "⚠️  Firebase project not initialized. Please run:"
    echo "   firebase login"
    echo "   firebase init"
    echo "   Select your fidha-app project"
else
    echo "✅ Firebase project is initialized"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Edit .env file with your Firebase configuration"
echo "2. Run: firebase login"
echo "3. Run: firebase init (if not done already)"
echo "4. Run: npm run deploy:all"
echo "5. Run: npm run build:preview (for testing)"
echo ""
echo "📚 See DEPLOYMENT_GUIDE.md for detailed instructions" 