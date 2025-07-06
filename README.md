# Fidha Web App

A web version of the Fidha mobile app that connects people who notice each other in real life using outfit descriptions and proximity.

## Features

- **Welcome Screen**: Beautiful landing page with app introduction
- **Find Someone**: Search for nearby users and describe what you saw
- **I Was Seen**: Help others find you by describing your outfit
- **Chat**: Real-time messaging with matched users
- **History**: View past connections and their status
- **Responsive Design**: Works on desktop, tablet, and mobile browsers

## Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Styled Components** for styling
- **Inter Font** for typography
- **CSS3** with custom animations

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yashmaripeddi/fidha-web.git
cd fidha-web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   └── styled.ts          # Styled components
├── constants/
│   └── theme.ts           # Theme constants
├── screens/
│   ├── WelcomeScreen.tsx
│   ├── HomeScreen.tsx
│   ├── FindSomeoneScreen.tsx
│   ├── IWasSeenScreen.tsx
│   ├── WhatWasSheWearingScreen.tsx
│   ├── MatchFoundScreen.tsx
│   ├── ChatScreen.tsx
│   └── HistoryScreen.tsx
├── types/
│   └── index.ts           # TypeScript interfaces
├── App.tsx                # Main app component
└── index.tsx              # App entry point
```

## Design System

### Colors
- **Primary**: #7B4AE2 (Vibrant purple)
- **Primary Light**: #A084E8
- **Text**: #FFFFFF (White)
- **Text Secondary**: #E0C3FC
- **Success**: #00FF9D
- **Error**: #FF3366

### Typography
- **Font Family**: Inter
- **Weights**: 300, 400, 500, 600, 700

### Components
- Gradient backgrounds
- Pill-shaped buttons
- Glass-morphism cards
- Custom heart icon
- Responsive grid layouts

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to connect to your GitHub repository

### Manual Build

1. Build the app:
```bash
npm run build
```

2. The build files will be in the `build/` directory

3. Deploy the `build/` directory to your hosting provider

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=your_api_url_here
REACT_APP_FIREBASE_CONFIG=your_firebase_config_here
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@fidha.app or create an issue in this repository.

## Current Status

✅ **Demo Mode**: App works with simulated users for testing
✅ **Firebase Ready**: Real-time backend integration ready
✅ **Conversation Focus**: Reframed as conversation starter app
✅ **Responsive Design**: Works on all devices

## Next Steps

To see real users instead of bots:

1. **Set up Firebase** (5 minutes):
   - Follow [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Create Firebase project
   - Add your config to `.env` file

2. **Share with friends**:
   - Deploy to Vercel/Netlify
   - Share the live URL
   - Friends will see each other as real users

## Roadmap

- [x] Firebase integration for real-time data
- [x] BLE scanning simulation for web
- [ ] Push notifications
- [ ] User authentication
- [ ] Profile management
- [ ] Advanced matching algorithms
- [ ] PWA capabilities
