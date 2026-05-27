import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useDate } from '../hooks/useDate';
import { Card, ProgressBar } from '../components/Card';
import './Pages.css';

export default function Steps() {
  const { user, refreshProfile } = useAuth();
  const { date } = useDate();

  const [total, setTotal] = useState(0);
  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState('');
  const [goalInput, setGoalInput] = useState('');

  // Sensor state
  const [sensorActive, setSensorActive] = useState(false);
  const [sensorError, setSensorError] = useState('');
  const [needsPermission, setNeedsPermission] = useState(false);

  const lastMagnitude = useRef(0);
  const cooldown = useRef(false);
  const dateRef = useRef(date);
  dateRef.current = date;

  const stepGoal = user?.stepGoal || 10000;

  const load = async () => {
    try {
      const res = await axios.get(`/api/steps/${date}`);
      setTotal(res.data.total);
      setLogs(res.data.logs);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { load(); }, [date]);

  // Step detection handler — kept stable via refs
  const handleMotion = async (event) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    const x = acc.x || 0;
    const y = acc.y || 0;
    const z = acc.z || 0;
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    const diff = Math.abs(magnitude - lastMagnitude.current);

    if (diff > 6 && !cooldown.current) {
      cooldown.current = true;
      try {
        await axios.post('/api/steps', { count: 1, date: dateRef.current });
        setTotal(prev => prev + 1);
        setLogs(prev => [...prev, { count: 1, loggedAt: new Date() }]);
      } catch (err) {
        console.log(err);
      }
      setTimeout(() => { cooldown.current = false; }, 400);
    }
    lastMagnitude.current = magnitude;
  };

  const startSensor = () => {
    window.addEventListener('devicemotion', handleMotion);
    setSensorActive(true);
    setSensorError('');
  };

  const stopSensor = () => {
    window.removeEventListener('devicemotion', handleMotion);
    setSensorActive(false);
  };

  useEffect(() => {
    if (typeof DeviceMotionEvent === 'undefined') {
      setSensorError('Motion sensor not available on this device/browser.');
      return;
    }

    // iOS 13+ requires explicit permission via a user gesture
    // We CANNOT call requestPermission() here — must be from a button tap
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      setNeedsPermission(true); // show a button for iOS
      return;
    }

    // Android / other — check HTTPS
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setSensorError('Motion sensor requires HTTPS. Please serve the app over HTTPS on Android.');
      return;
    }

    // Android — start directly
    startSensor();
    return () => stopSensor();
  }, []);

  // iOS permission request — MUST be called from a button click
  const requestIOSPermission = async () => {
    try {
      const state = await DeviceMotionEvent.requestPermission();
      if (state === 'granted') {
        setNeedsPermission(false);
        startSensor();
      } else {
        setSensorError('Motion permission denied. You can enable it in iOS Settings > Safari > Motion & Orientation Access.');
      }
    } catch (err) {
      setSensorError('Could not request motion permission: ' + err.message);
    }
  };

  const addSteps = async () => {
    if (!input || parseInt(input) <= 0) return;
    try {
      await axios.post('/api/steps', { count: parseInt(input), date });
      setInput('');
      load();
    } catch (err) {
      console.log(err);
    }
  };

  const setGoal = async () => {
    if (!goalInput) return;
    try {
      await axios.put('/api/profile', { ...user, stepGoal: parseInt(goalInput) });
      setGoalInput('');
      refreshProfile();
    } catch (err) {
      console.log(err);
    }
  };

  const pct = Math.min(Math.round((total / stepGoal) * 100), 100);

  return (
    <div className="page">
      <h1 className="page-title">Step Counter</h1>

      <Card>
        {/* STEP DISPLAY */}
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div style={{ fontSize: 52, fontWeight: 700, color: 'var(--accent)' }}>
            {total.toLocaleString()}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>
            Goal: {stepGoal.toLocaleString()} steps
          </div>
        </div>

        <ProgressBar value={total} max={stepGoal} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
          <span>0</span>
          <span>{pct}% of goal</span>
          <span>{stepGoal.toLocaleString()}</span>
        </div>

        {/* SENSOR STATUS */}
        <div style={{ marginTop: 16, marginBottom: 4 }}>
          {/* iOS: needs button tap to trigger permission */}
          {needsPermission && (
            <button className="btn-accent" style={{ width: '100%', marginBottom: 8 }} onClick={requestIOSPermission}>
              📱 Enable motion sensor (tap to allow)
            </button>
          )}

          {/* Sensor running indicator */}
          {sensorActive && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--accent-light)', borderRadius: 8, padding: '8px 14px', fontSize: 13 }}>
              <span style={{ color: 'var(--accent-dark)' }}>🟢 Auto step detection active</span>
              <button className="btn-outline" style={{ padding: '4px 10px', fontSize: 12 }} onClick={stopSensor}>Stop</button>
            </div>
          )}

          {/* Error message */}
          {sensorError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: 'var(--danger)',
              borderRadius: 8, padding: '8px 14px', fontSize: 13 }}>
              ⚠️ {sensorError}
            </div>
          )}

          {/* Sensor stopped — offer restart */}
          {!sensorActive && !needsPermission && !sensorError && (
            <button className="btn-outline" style={{ width: '100%' }} onClick={startSensor}>
              ▶ Start auto step detection
            </button>
          )}
        </div>

        {/* MANUAL ADD */}
        <div className="input-row" style={{ marginTop: 16 }}>
          <input className="form-input" type="number" placeholder="Add steps manually (e.g. 500)"
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSteps()} />
          <button className="btn-accent" onClick={addSteps}>Add</button>
        </div>

        {/* GOAL */}
        <div className="input-row">
          <input className="form-input" type="number" placeholder="Set daily goal"
            value={goalInput} onChange={e => setGoalInput(e.target.value)} />
          <button className="btn-outline" onClick={setGoal}>Set goal</button>
        </div>

        {/* TEST */}
        <button className="btn-outline" style={{ marginTop: 8 }} onClick={() => {
          setInput('1000');
          setTimeout(addSteps, 100);
        }}>
          ⌚ Simulate +1000 steps
        </button>
      </Card>

      {/* LOGS */}
      <Card>
        <h2 className="card-title">Today's log</h2>
        {logs.length === 0
          ? <p className="empty-text">No steps logged yet</p>
          : logs.slice(-10).reverse().map((l, i) => (
            <div key={i} className="log-row">
              <span>{new Date(l.loggedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
              <span style={{ fontWeight: 600, color: 'var(--accent)' }}>+{l.count.toLocaleString()} steps</span>
            </div>
          ))
        }
      </Card>
    </div>
  );
}