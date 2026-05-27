import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import './Pages.css';

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  const [form, setForm] = useState({ name:'', profile:{age:'',weight:'',height:'',gender:'male'}, stepGoal:'', calGoal:'', waterGoal:'' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) setForm({
      name: user.name || '',
      profile: { age: user.profile?.age||'', weight: user.profile?.weight||'', height: user.profile?.height||'', gender: user.profile?.gender||'male' },
      stepGoal: user.stepGoal || 10000,
      calGoal: user.calGoal || 2000,
      waterGoal: user.waterGoal || 8
    });
  }, [user]);

  const save = async () => {
    await axios.put('/api/profile', form);
    await refreshProfile();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const bmi = form.profile.weight && form.profile.height
    ? parseFloat((+form.profile.weight / ((+form.profile.height/100)**2)).toFixed(1))
    : null;

  return (
    <div className="page">
      <h1 className="page-title">Profile & Settings</h1>
      <Card>
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
          <div style={{ width:56, height:56, borderRadius:'50%', background:'var(--accent-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>
            {form.name?.[0]?.toUpperCase() || '👤'}
          </div>
          <div>
            <div style={{ fontWeight:600, fontSize:18 }}>{user?.name}</div>
            <div style={{ fontSize:13, color:'var(--muted)' }}>{user?.email}</div>
          </div>
        </div>
        <h2 className="card-title">Personal info</h2>
        <div className="form-grid">
          <div className="form-group" style={{gridColumn:'1/-1'}}><label>Full name</label>
            <input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          </div>
          <div className="form-group"><label>Age</label>
            <input className="form-input" type="number" value={form.profile.age} onChange={e=>setForm({...form,profile:{...form.profile,age:+e.target.value}})} />
          </div>
          <div className="form-group"><label>Gender</label>
            <select className="form-input" value={form.profile.gender} onChange={e=>setForm({...form,profile:{...form.profile,gender:e.target.value}})}>
              <option value="male">Male</option><option value="female">Female</option>
            </select>
          </div>
          <div className="form-group"><label>Weight (kg)</label>
            <input className="form-input" type="number" value={form.profile.weight} onChange={e=>setForm({...form,profile:{...form.profile,weight:+e.target.value}})} />
          </div>
          <div className="form-group"><label>Height (cm)</label>
            <input className="form-input" type="number" value={form.profile.height} onChange={e=>setForm({...form,profile:{...form.profile,height:+e.target.value}})} />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="card-title">Goals</h2>
        <div className="form-grid">
          <div className="form-group"><label>Daily steps goal</label>
            <input className="form-input" type="number" value={form.stepGoal} onChange={e=>setForm({...form,stepGoal:+e.target.value})} />
          </div>
          <div className="form-group"><label>Calorie goal (kcal)</label>
            <input className="form-input" type="number" value={form.calGoal} onChange={e=>setForm({...form,calGoal:+e.target.value})} />
          </div>
          <div className="form-group"><label>Water goal (cups)</label>
            <input className="form-input" type="number" value={form.waterGoal} onChange={e=>setForm({...form,waterGoal:+e.target.value})} />
          </div>
        </div>
        <button className="btn-accent" onClick={save}>{saved ? '✓ Saved!' : 'Save profile'}</button>
      </Card>

      {bmi && (
        <Card>
          <h2 className="card-title">Your stats</h2>
          <div className="log-row"><span>BMI</span><span style={{fontWeight:600}}>{bmi} — {bmi<18.5?'Underweight':bmi<=24.9?'Normal':bmi<=29.9?'Overweight':'Obese'}</span></div>
          <div className="log-row"><span>Weight</span><span style={{fontWeight:600}}>{form.profile.weight} kg</span></div>
          <div className="log-row"><span>Height</span><span style={{fontWeight:600}}>{form.profile.height} cm</span></div>
        </Card>
      )}
    </div>
  );
}
