import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useDate } from '../hooks/useDate';
import { Card, ProgressBar } from '../components/Card';
import './Pages.css';

export default function Water() {
  const { user, refreshProfile } = useAuth();
  const { date } = useDate();
  const [cups, setCups] = useState(0);
  const [goalInput, setGoalInput] = useState('');
  const waterGoal = user?.waterGoal || 8;

  const load = async () => { const res = await axios.get(`/api/water/${date}`); setCups(res.data.cups || 0); };
  useEffect(() => { load(); }, [date]);

  const update = async (val) => {
    const newVal = Math.max(0, val);
    await axios.post('/api/water', { cups: newVal, date });
    setCups(newVal);
  };

  const setGoal = async () => {
    if (!goalInput) return;
    await axios.put('/api/profile', { ...user, waterGoal: parseInt(goalInput) });
    setGoalInput(''); refreshProfile();
  };

  return (
    <div className="page">
      <h1 className="page-title">Water Tracker</h1>
      <Card>
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div style={{ fontSize: 52, fontWeight: 700, color: '#3B82F6' }}>{cups}</div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>cups (goal: {waterGoal})</div>
        </div>
        <ProgressBar value={cups} max={waterGoal} color="#3B82F6" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', margin: '20px 0' }}>
          {Array.from({ length: waterGoal }, (_, i) => (
            <button key={i} onClick={() => update(i + 1)}
              style={{ fontSize: 26, background: 'none', border: 'none', cursor: 'pointer', opacity: i < cups ? 1 : 0.25, transition: 'opacity .2s' }}>
              💧
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="btn-accent" onClick={() => update(cups + 1)}>+ 1 cup</button>
          <button className="btn-outline" onClick={() => update(cups - 1)}>– 1 cup</button>
        </div>
      </Card>
      <Card>
        <h2 className="card-title">Set daily goal</h2>
        <div className="input-row">
          <input className="form-input" type="number" placeholder="cups per day" value={goalInput}
            onChange={e => setGoalInput(e.target.value)} />
          <button className="btn-outline" onClick={setGoal}>Set</button>
        </div>
      </Card>
      <Card>
        <h2 className="card-title">Hydration tips</h2>
        <ul style={{ paddingLeft: 20, color: 'var(--muted)', fontSize: 14, lineHeight: 2.2 }}>
          <li>Drink a glass right after waking up</li>
          <li>Carry a reusable bottle everywhere</li>
          <li>Drink 30 min before each meal</li>
          <li>Set hourly reminders on your phone</li>
        </ul>
      </Card>
    </div>
  );
}
