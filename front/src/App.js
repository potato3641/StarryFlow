import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MapPage from './pages/MapPage';
import EntryPage from './pages/EntryPage';

function App() {
  useEffect(() => { // 우클방지
    document.oncontextmenu = () => {
      return false;
    }
  }, [])
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Navigate to="/entry" replace />} />
        <Route path="/map/:roomId" element={<MapPage />} />
        <Route path="/entry" element={<EntryPage />} />
      </Routes>
    </Router >
  );
}

export default App;
