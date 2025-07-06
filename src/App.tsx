import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import FindSomeoneScreen from './screens/FindSomeoneScreen';
import IWasSeenScreen from './screens/IWasSeenScreen';
import WhatWasSheWearingScreen from './screens/WhatWasSheWearingScreen';
import MatchFoundScreen from './screens/MatchFoundScreen';
import ChatScreen from './screens/ChatScreen';
import HistoryScreen from './screens/HistoryScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/find-someone" element={<FindSomeoneScreen />} />
        <Route path="/i-was-seen" element={<IWasSeenScreen />} />
        <Route path="/what-was-she-wearing/:targetUserId" element={<WhatWasSheWearingScreen />} />
        <Route path="/match-found" element={<MatchFoundScreen />} />
        <Route path="/chat" element={<ChatScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
