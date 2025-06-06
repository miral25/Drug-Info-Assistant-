import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DrugList from './components/DrugList';
import DrugDetails from './components/DrugDetails';
import './App.css';

function App() {
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
