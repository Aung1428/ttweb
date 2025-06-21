import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import Header from './Frontend/components/Header';
import Footer from './Frontend/components/Footer';
import Main from './Frontend/sections/main';
import Application from './Frontend/sections/Application';
import Verification from './Frontend/sections/Verification';
import LecturerDashboard from './Frontend/sections/LecturerDashboard'; // ✅ Imported LecturerDashboard

const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      <div className="App">
        <ScrollToHash />
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/application" element={<Application />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/lecturer" element={<LecturerDashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
