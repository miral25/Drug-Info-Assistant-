import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DrugList from './components/DrugList';
import DrugDetails from './components/DrugDetails';
import './App.css';

function App() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Just test a basic endpoint
    fetch(`${API_BASE}/api/drugs`)
      .then(res => res.json())
      .then(data => {
        console.log("✅ API Test Success:", data);
      })
      .catch(err => {
        console.error("❌ API Test Failed:", err);
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DrugList />} />
        <Route path="/drug/:name" element={<DrugDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
