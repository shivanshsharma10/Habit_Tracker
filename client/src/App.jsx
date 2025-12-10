import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// A generic "Home" component that just redirects to login for now
function Home() {
  return <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route: Redirect to Login */}
        <Route path="/" element={<Home />} />
        
        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        
        {/* Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
