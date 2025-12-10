import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const ProgressChart = ({ habits }) => {
  
  // 1. Process Data: Count total completions for the last 7 days
  const data = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateString = d.toISOString().split('T')[0];
    
    // Count how many habits were done on this specific date
    let count = 0;
    habits.forEach(habit => {
      if (habit.completedDates.includes(dateString)) {
        count++;
      }
    });

    data.push({
      day: dateString.slice(5), // Show "12-11" instead of "2023-12-11"
      completed: count
    });
  }

 return (
    // REMOVED marginTop: '40px'
    <div className="card" style={{ height: '300px' }}> 
      <h3>Your Consistency Graph 📈</h3>
      <p style={{color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px'}}>
        Visualizing your daily wins over the last 7 days.
      </p>
      
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--input-border)" />
          <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
          <YAxis allowDecimals={false} stroke="var(--text-muted)" fontSize={12} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--input-border)', color: 'var(--text-main)' }} 
          />
          <Line 
            type="monotone" 
            dataKey="completed" 
            stroke="var(--primary)" 
            strokeWidth={3} 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;