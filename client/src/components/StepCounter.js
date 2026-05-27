import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const StepCounter = () => {
  const [steps, setSteps] = useState(0);
  const [needsPermission, setNeedsPermission] = useState(false);
  const [error, setError] = useState('');

  const lastMagnitude = useRef(0);
  const cooldown = useRef(false);

  const handleMotion = async (event) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    const magnitude = Math.sqrt(
      (acc.x || 0) * (acc.x || 0) +
      (acc.y || 0) * (acc.y || 0) +
      (acc.z || 0) * (acc.z || 0)
    );

    const diff = Math.abs(magnitude - lastMagnitude.current);

    // ✅ Fixed: added cooldown to prevent false steps
    if (diff > 6 && !cooldown.current) {
      cooldown.current = true;
      setSteps(prev => prev + 1);

      const today = new Date().toISOString().split("T")[0];
      try {
        // ✅ Fixed: use relative URL instead of hardcoded IP
        // ✅ Fixed: use correct token key "fittrack_token"
        await axios.post(
          '/api/steps',
          { count: 1, date: today },
          { headers: { Authorization: `Bearer ${localStorage.getItem("fittrack_token")}` } }
        );
      } catch (err) {
        console.log(err);
      }

      setTimeout(() => { cooldown.current = false; }, 400);
    }

    lastMagnitude.current = magnitude;
  };

  const startListening = () => {
    window.addEventListener("devicemotion", handleMotion);
  };

  // ✅ Fixed: iOS permission must come from a button tap, not useEffect
  const requestIOSPermission = async () => {
    try {
      const state = await DeviceMotionEvent.requestPermission();
      if (state === 'granted') {
        setNeedsPermission(false);
        startListening();
      } else {
        setError('Permission denied. Enable in iOS Settings > Safari > Motion & Orientation Access.');
      }
    } catch (err) {
      setError('Could not request permission: ' + err.message);
    }
  };

  useEffect(() => {
    if (typeof DeviceMotionEvent === 'undefined') return;

    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      // iOS — show button, don't start yet
      setNeedsPermission(true);
    } else {
      // Android — start directly
      startListening();
    }

    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  return (
    <div style={{ padding: '12px 0' }}>
      {needsPermission && (
        <button
          onClick={requestIOSPermission}
          style={{
            background: 'var(--accent)', color: '#fff', border: 'none',
            padding: '10px 20px', borderRadius: 8, fontWeight: 600,
            cursor: 'pointer', width: '100%', marginBottom: 8
          }}
        >
          📱 Tap to enable step detection
        </button>
      )}
      {error && (
        <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 8 }}>⚠️ {error}</div>
      )}
      {!needsPermission && !error && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>🟢 Live steps (this session)</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--accent)' }}>{steps}</span>
        </div>
      )}
    </div>
  );
};

export default StepCounter;