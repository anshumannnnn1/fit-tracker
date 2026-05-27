import React from 'react';
import './Card.css';

export function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function MetricCard({ value, label, sub, color }) {
  return (
    <div className="metric-card">
      <div className="metric-value" style={{ color: color || 'var(--text)' }}>{value}</div>
      <div className="metric-label">{label}</div>
      {sub && <div className="metric-sub">{sub}</div>}
    </div>
  );
}

export function ProgressBar({ value, max, color }) {
  const pct = Math.min(Math.round((value / (max || 1)) * 100), 100);
  let bg = color || 'var(--accent)';
  if (!color && pct > 90) bg = 'var(--danger)';
  else if (!color && pct > 75) bg = 'var(--warn)';
  return (
    <div className="progress-bar-wrap">
      <div className="progress-bar-fill" style={{ width: `${pct}%`, background: bg }} />
    </div>
  );
}
