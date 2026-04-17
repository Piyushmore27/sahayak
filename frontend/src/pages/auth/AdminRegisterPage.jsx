import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', sector: '', adminId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Name, email and password are required.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, sector: form.sector })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0d5c63 0%, #177a82 50%, #1a9aa5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 48, maxWidth: 460, width: '90%', textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🛡️</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gray-900)', marginBottom: 10 }}>Admin Registered!</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 28 }}>Your admin account has been created. You can now log into the Command Center.</p>
        <button onClick={() => navigate('/admin/login')} style={{ padding: '12px 32px', background: 'var(--teal-800)', color: 'white', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Go to Login →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0d5c63 0%, #177a82 50%, #1a9aa5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 40, maxWidth: 500, width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}>
        {/* Back */}
        <button onClick={() => navigate('/admin/login')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gray-400)', background: 'none', marginBottom: 24, cursor: 'pointer' }}>
          ← Back to Login
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--teal-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--gray-900)' }}>Register Admin</h1>
            <p style={{ color: 'var(--gray-400)', fontSize: 12 }}>Command Center • New Account</p>
          </div>
        </div>

        {error && (
          <div style={{ background: 'var(--red-100)', color: 'var(--red-600)', padding: '12px 16px', borderRadius: 10, fontSize: 13, marginBottom: 20 }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Full Name">
            <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Commander Singh" style={inp} />
          </Field>
          <Field label="Email Address">
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="admin@sahayak.org" style={inp} />
          </Field>
          <Field label="Sector">
            <input value={form.sector} onChange={e => update('sector', e.target.value)} placeholder="Delhi Sector Alpha" style={inp} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Password">
              <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min 8 chars" style={inp} />
            </Field>
            <Field label="Confirm Password">
              <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="Repeat password" style={inp} />
            </Field>
          </div>

          <button type="submit" disabled={loading} style={{
            padding: '13px', background: loading ? 'var(--gray-300)' : 'var(--teal-800)', color: 'white',
            borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: loading ? 'default' : 'pointer', marginTop: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            {loading && <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />}
            {loading ? 'Registering...' : 'Create Admin Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

const inp = {
  width: '100%', padding: '10px 12px', border: '1.5px solid var(--gray-200)', borderRadius: 8,
  fontSize: 13, color: 'var(--gray-800)', background: 'var(--gray-50)', outline: 'none'
};
