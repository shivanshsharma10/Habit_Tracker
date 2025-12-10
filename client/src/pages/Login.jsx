import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate , Link } from 'react-router-dom';
import '../App.css'; // Import shared styles

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch{
      setError('Invalid email or password');
    }
  };

  return (
    <div className="container" style={{maxWidth: '400px', marginTop: '100px'}}>
      <div className="card" style={{textAlign: 'center'}}>
        <h1 className="app-title" style={{marginBottom: '30px'}}>Welcome Back</h1>
        
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} className="form-group">
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
            Login
          </button>
        </form>
        <p style={{marginTop: '20px', fontSize: '14px', color: '#6b7280'}}>
          Don't have an account? <Link to="/register" style={{color: 'var(--primary)', fontWeight: '600'}}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;