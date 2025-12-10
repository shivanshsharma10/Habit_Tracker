import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProgressChart from '../components/ProgressChart'; // Import the chart
import '../App.css';

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState('');
  const [identity, setIdentity] = useState('');
  const [cue, setCue] = useState('');
  const [error, setError] = useState('');
  
  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const navigate = useNavigate();

  // Helper Functions
  const getTodayString = () => new Date().toISOString().split('T')[0];
  
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Effects
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('https://habittracker-production-8d4a.up.railway.app/api/habits', getAuthHeaders());
        setHabits(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
        setError('Failed to fetch habits');
      }
    };
    fetchHabits();
  }, [navigate]);

  // Handlers
  const handleAddHabit = async (e) => {
    e.preventDefault();
    try {
      const newHabit = { title, identity, cue };
      const response = await axios.post('https://habittracker-production-8d4a.up.railway.app/api/habits', newHabit, getAuthHeaders());
      setHabits([...habits, response.data]);
      setTitle(''); setIdentity(''); setCue('');
    } catch {
      setError('Failed to add habit');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://habittracker-production-8d4a.up.railway.app/${id}`, getAuthHeaders());
      setHabits(habits.filter(habit => habit._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleCheckIn = async (id) => {
    try {
      const response = await axios.put(`https://habittracker-production-8d4a.up.railway.app/${id}/checkin`, {}, getAuthHeaders());
      setHabits(habits.map(habit => habit._id === id ? response.data : habit));
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container" style={{maxWidth: '1200px'}}> 
      
      {/* HEADER */}
      <div className="header">
        <h1 className="app-title">Atomic Habits</h1>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <button 
                onClick={toggleTheme} 
                style={{
                    background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-main)', 
                    borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {/* --- GRID LAYOUT --- */}
      <div className="dashboard-grid">
        
        {/* --- LEFT COLUMN: TOOLS (Sticky) --- */}
        <div className="dashboard-sidebar">
            

            <div className="card" style={{marginTop: habits.length > 0 ? '30px' : '0'}}>
                <h3>New Habit</h3>
                <br/>
                <form onSubmit={handleAddHabit} className="form-group">
                <input 
                    type="text" 
                    placeholder="Habit Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />
                <div style={{display:'flex', gap:'10px', flexDirection: 'column'}}> 
                    <input type="text" placeholder="Identity (I am...)" value={identity} onChange={(e) => setIdentity(e.target.value)} />
                    <input type="text" placeholder="Cue (After I...)" value={cue} onChange={(e) => setCue(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Add Habit</button>
                </form>
            </div>
            {habits.length > 0 && <ProgressChart habits={habits} />}
        </div>

        {/* --- RIGHT COLUMN: THE LIST --- */}
        <div className="main-content">
            <h3 style={{marginBottom: '20px', color: 'var(--text-main)'}}>Your Habits</h3>
            
            {habits.length === 0 ? <div className="card"><p>No habits yet.</p></div> : (
            <ul className="habit-list">
                {habits.map(habit => {
                const isCompletedToday = habit.completedDates.includes(getTodayString());
                const last7Days = getLast7Days();
                
                return (
                    <li key={habit._id} className={`habit-item ${isCompletedToday ? 'completed' : ''}`}>
                    
                    <div style={{width: '100%'}}> 
                        
                        {/* Row 1: Title & Badges */}
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'15px'}}>
                             <div className="habit-info">
                                {/* FIX 1: Explicitly set color to var(--text-main) */}
                                <h4 style={{ 
                                    textDecoration: isCompletedToday ? 'line-through' : 'none',
                                    color: 'var(--text-main)', 
                                    fontSize: '18px'
                                }}>
                                    {habit.title}
                                </h4>
                                <div className="habit-meta" style={{marginTop:'5px'}}>
                                    {habit.identity && <span>🆔 {habit.identity}</span>}
                                    <span className="streak-badge">🔥 {habit.streak}</span>
                                </div>
                            </div>
                            <button className="btn-delete" onClick={() => handleDelete(habit._id)}>&times;</button>
                        </div>

                        {/* Row 2: Circles & Check Button */}
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                             {/* Weekly Circles */}
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {last7Days.map(date => {
                                    const isDone = habit.completedDates.includes(date);
                                    const isToday = date === getTodayString();
                                    return (
                                        <div key={date} style={{
                                            width: '28px', height: '28px', borderRadius: '50%', 
                                            // FIX 2: Use the new --circle-bg variable so it's visible in both modes
                                            backgroundColor: isDone ? '#10b981' : 'var(--circle-bg)',
                                            border: isToday ? '2px solid var(--primary)' : '1px solid transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '11px', fontWeight: 'bold',
                                            // FIX 3: Text is white if done, but "text-muted" (gray) if not done. Never transparent!
                                            color: isDone ? 'white' : 'var(--text-muted)'
                                        }}>
                                            {/* FIX 4: Show the Date number (slice last 2 chars) */}
                                            {date.slice(8)}
                                        </div>
                                    )
                                })}
                            </div>

                            <button className={`btn btn-checkin ${isCompletedToday ? 'done' : ''}`} onClick={() => handleCheckIn(habit._id)}>
                                {isCompletedToday ? 'Done' : 'Check In'}
                            </button>
                        </div>

                    </div>
                    </li>
                );
                })}
            </ul>
            )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;