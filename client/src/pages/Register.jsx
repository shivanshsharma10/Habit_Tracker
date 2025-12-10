import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css'; 

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the register route
      await axios.post('https://habittracker-production-8d4a.up.railway.app/api/auth/register', {
        name,
        email,
        password
      });
      
      // If successful, go to login page
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{maxWidth: '400px', marginTop: '60px'}}>
      <div className="card" style={{textAlign: 'center'}}>
        <h1 className="app-title" style={{marginBottom: '10px'}}>Join the Movement</h1>
        <p style={{marginBottom: '30px', color: '#6b7280'}}>Start building better habits today.</p>
        
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} className="form-group">
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </form>

        <p style={{marginTop: '20px', fontSize: '14px', color: '#6b7280'}}>
          Already have an account? <Link to="/login" style={{color: 'var(--primary)', fontWeight: '600'}}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;