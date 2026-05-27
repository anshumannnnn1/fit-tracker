import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDate } from '../hooks/useDate';
import { Card } from '../components/Card';
import './Pages.css';

const TYPE_COLORS = {
  workout: { bg: '#E1F5EE', color: '#0F6E56' },
  meal:    { bg: '#FEF3C7', color: '#92400E' },
  rest:    { bg: '#EFF6FF', color: '#1E40AF' },
  other:   { bg: '#F3F4F6', color: '#374151' },
};

export default function Schedule() {
  const { date } = useDate();
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ time: '', title: '', detail: '', type: 'workout' });

  const load = async () => { const res = await axios.get(`/api/schedule/${date}`); setEntries(res.data); };
  useEffect(() => { load(); }, [date]);

  const add = async () => {
    if (!form.title) return;
    await axios.post('/api/schedule', { ...form, date });
    setForm({ time: '', title: '', detail: '', type: 'workout' }); load();
  };

  const remove = async (id) => { await axios.delete(`/api/schedule/${id}`); load(); };

  return (
    <div className="page">
      <h1 className="page-title">Daily Schedule</h1>
      <Card>
        <h2 className="card-title">Add entry</h2>
        <div className="form-grid">
          <div className="form-group"><label>Time</label>
            <input className="form-input" type="time" value={form.time} onChange={e => setForm({...form,time:e.target.value})} />
          </div>
          <div className="form-group"><label>Type</label>
            <select className="form-input" value={form.type} onChange={e => setForm({...form,type:e.target.value})}>
              <option value="workout">Workout</option><option value="meal">Meal</option>
              <option value="rest">Rest / Recovery</option><option value="other">Other</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Activity</label>
            <input className="form-input" placeholder="e.g. Morning run, Breakfast, Yoga..." value={form.title}
              onChange={e => setForm({...form,title:e.target.value})} />
          </div>
          <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Details</label>
            <input className="form-input" placeholder="e.g. 30 min, 500 kcal..." value={form.detail}
              onChange={e => setForm({...form,detail:e.target.value})} />
          </div>
        </div>
        <button className="btn-accent" onClick={add}>Add to schedule</button>
      </Card>
      <Card>
        <h2 className="card-title">Today's timetable</h2>
        {entries.length === 0
          ? <p className="empty-text">No entries yet</p>
          : entries.map(e => {
            const c = TYPE_COLORS[e.type];
            return (
              <div key={e._id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, color: 'var(--muted)', minWidth: 48, paddingTop: 4 }}>{e.time || '—'}</div>
                <div style={{ flex: 1, background: c.bg, color: c.color, borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontWeight: 500 }}>{e.title}</div>
                  {e.detail && <div style={{ fontSize: 12, marginTop: 2 }}>{e.detail}</div>}
                </div>
                <button className="btn-icon" onClick={() => remove(e._id)}>✕</button>
              </div>
            );
          })}
      </Card>
    </div>
  );
}
