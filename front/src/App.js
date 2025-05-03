import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MapPage from './pages/MapPage';
import MainPage from './pages/MainPage';

function App() {
  useEffect(() => { // 우클방지
    document.oncontextmenu = () => {
      return false;
    }
  }, [])
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Navigate to="/main" replace />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </Router >
  );
}

export default App;
