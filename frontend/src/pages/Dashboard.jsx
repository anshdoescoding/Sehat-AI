import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Dashboard() {
  const [vitals, setVitals] = useState(null);
  const [history, setHistory] = useState([]);
  const [sessionId] = useState(() => localStorage.getItem('sehat_session_id') || 'default');
  const [form, setForm] = useState({ heart_rate: '', bp_systolic: '', bp_diastolic: '', temperature: '', weight: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVitals();
  }, []);

  const fetchVitals = async () => {
    try {
      const [latestRes, historyRes] = await Promise.all([
        fetch(`${API_URL}/vitals/${sessionId}/latest`),
        fetch(`${API_URL}/vitals/${sessionId}`)
      ]);
      const latest = await latestRes.json();
      const hist = await historyRes.json();
      
      if (latest.record) setVitals(latest.record);
      if (hist.records) setHistory(hist.records);
    } catch (e) {
      console.log('Dashboard: Backend not reachable');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`${API_URL}/vitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          heart_rate: form.heart_rate ? parseInt(form.heart_rate) : null,
          bp_systolic: form.bp_systolic ? parseInt(form.bp_systolic) : null,
          bp_diastolic: form.bp_diastolic ? parseInt(form.bp_diastolic) : null,
          temperature: form.temperature ? parseFloat(form.temperature) : null,
          weight: form.weight ? parseFloat(form.weight) : null,
        })
      });
      setForm({ heart_rate: '', bp_systolic: '', bp_diastolic: '', temperature: '', weight: '' });
      fetchVitals();
    } catch (e) {}
    setSaving(false);
  };

  const getBpStatus = (systolic, diastolic) => {
    if (!systolic || !diastolic) return { text: 'N/A', color: '#94A3B8' };
    if (systolic < 120 && diastolic < 80) return { text: 'Normal', color: '#10B981' };
    if (systolic < 140 && diastolic < 90) return { text: 'Elevated', color: '#F59E0B' };
    return { text: 'Check doctor', color: '#EF4444' };
  };

  const getHrStatus = (hr) => {
    if (!hr) return { text: 'N/A', color: '#94A3B8' };
    if (hr >= 60 && hr <= 100) return { text: 'Normal', color: '#10B981' };
    return { text: 'Check doctor', color: '#F59E0B' };
  };

  const chartData = history.map(v => ({
    date: new Date(v.recorded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    systolic: v.bp_systolic,
    diastolic: v.bp_diastolic
  }));

  const bpStatus = vitals ? getBpStatus(vitals.bp_systolic, vitals.bp_diastolic) : { text: 'No data', color: '#94A3B8' };
  const hrStatus = vitals ? getHrStatus(vitals.heart_rate) : { text: 'No data', color: '#94A3B8' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: '#1E293B', color: 'white', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '16px', height: '48px' }}>
        <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '18px' }}>🏠</Link>
        <Link to="/sehat-ai" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '18px' }}>💬</Link>
        <Link to="/charak-samhita" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '18px' }}>🌿</Link>
        <div style={{ width: '1px', height: '20px', backgroundColor: '#334155' }}></div>
        <span style={{ fontSize: '15px', fontWeight: 700 }}>📊 Dashboard</span>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        
        {/* Vitals Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
          <div style={cardStyle}>
            <div style={cardLabel}>❤️ Blood Pressure</div>
            <div style={cardValue}>{vitals ? `${vitals.bp_systolic || '?'}/${vitals.bp_diastolic || '?'}` : '--/--'}</div>
            <span style={{ fontSize: '11px', color: bpStatus.color, fontWeight: 600 }}>{bpStatus.text}</span>
          </div>
          <div style={cardStyle}>
            <div style={cardLabel}>💓 Heart Rate</div>
            <div style={cardValue}>{vitals?.heart_rate || '--'} <span style={{ fontSize: '13px', color: '#94A3B8' }}>bpm</span></div>
            <span style={{ fontSize: '11px', color: hrStatus.color, fontWeight: 600 }}>{hrStatus.text}</span>
          </div>
          <div style={cardStyle}>
            <div style={cardLabel}>🌡️ Temperature</div>
            <div style={cardValue}>{vitals?.temperature || '--'} <span style={{ fontSize: '13px', color: '#94A3B8' }}>°F</span></div>
          </div>
          <div style={cardStyle}>
            <div style={cardLabel}>⚖️ Weight</div>
            <div style={cardValue}>{vitals?.weight || '--'} <span style={{ fontSize: '13px', color: '#94A3B8' }}>kg</span></div>
          </div>
        </div>

        {/* BP Chart */}
        {chartData.length > 0 && (
          <div style={{ ...cardStyle, marginBottom: '20px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '16px' }}>Blood Pressure Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" fontSize={12} tick={{ fill: '#94A3B8' }} />
                <YAxis domain={[0, 180]} fontSize={12} tick={{ fill: '#94A3B8' }} />
                <Tooltip />
                <Line type="monotone" dataKey="systolic" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} name="Systolic" />
                <Line type="monotone" dataKey="diastolic" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="Diastolic" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Log Vitals Form */}
        <div style={{ ...cardStyle, padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', marginBottom: '12px' }}>Log Vitals</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '12px' }}>
              <input type="number" placeholder="Heart Rate" value={form.heart_rate} onChange={e => setForm({...form, heart_rate: e.target.value})}
                style={inputStyle} />
              <input type="number" placeholder="BP Systolic" value={form.bp_systolic} onChange={e => setForm({...form, bp_systolic: e.target.value})}
                style={inputStyle} />
              <input type="number" placeholder="BP Diastolic" value={form.bp_diastolic} onChange={e => setForm({...form, bp_diastolic: e.target.value})}
                style={inputStyle} />
              <input type="number" step="0.1" placeholder="Temperature (°F)" value={form.temperature} onChange={e => setForm({...form, temperature: e.target.value})}
                style={inputStyle} />
              <input type="number" step="0.1" placeholder="Weight (kg)" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})}
                style={inputStyle} />
            </div>
            <button type="submit" disabled={saving}
              style={{
                padding: '10px 24px', backgroundColor: '#2563EB', color: 'white', border: 'none',
                borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
              }}>
              {saving ? 'Saving...' : 'Save Vitals'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '14px',
  padding: '16px',
  border: '1px solid #E2E8F0',
};

const cardLabel = {
  fontSize: '11px',
  color: '#64748B',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '6px',
};

const cardValue = {
  fontSize: '24px',
  fontWeight: 700,
  color: '#1E293B',
  marginBottom: '4px',
};

const inputStyle = {
  padding: '8px 12px',
  border: '1px solid #E2E8F0',
  borderRadius: '8px',
  fontSize: '13px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};