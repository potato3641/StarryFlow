import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TestPage from './pages/TestPage';

function App() {
  useEffect(() => {
    document.oncontextmenu = () => {
      return false;
    }
  }, [])
  return (
    // <Router basename={process.env.PUBLIC_URL}>
    <Router>
      <Routes>
        <Route path="/" element={<TestPage />} />
      </Routes>
    </Router >
  );
}

export default App;
