import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CharakSamhita from './pages/CharakSamhita';
import SehatAI from './pages/SehatAI';

function AppContent() {
  const location = useLocation();
  const isChatPage = location.pathname === '/sehat-ai' || location.pathname === '/charak-samhita';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {!isChatPage && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/charak-samhita" element={<CharakSamhita />} />
          <Route path="/sehat-ai" element={<SehatAI />} />
        </Routes>
      </main>
      {!isChatPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;