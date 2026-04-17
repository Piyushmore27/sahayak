import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { volunteerRegister } from '../../services/api';

const ROLES = ['Medical Lead', 'Logistics', 'Communications', 'Support', 'Coordinator', 'Field Agent'];
const DISTRICTS = ['North District', 'South District', 'East District', 'West District', 'Central District', 'Coastal Sector'];
const SKILLS_OPTIONS = ['Emergency Care', 'Search & Rescue', 'Volunteer Operations', 'Data & Tech', 'Physical Barrelling', 'Team Leadership', 'Incident Navigation'];

export default function AddVolunteerPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '',
    emergencyRole: 'Field Agent', district: '', sector: '', skills: [],
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleSkill = (sk) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(sk) ? f.skills.filter(s => s !== sk) : [...f.skills, sk]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      setError('Name, email and password are required.'); return;
    }
    setLoading(true); setError('');
    try {
      await volunteerRegister({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        emergencyRole: form.emergencyRole,
        district: form.district,
        sector: form.sector,
        skills: form.skills,
        bio: form.bio,
      });
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add volunteer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 20 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>✅</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gray-900)' }}>Volunteer Added!</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>The volunteer has been registered and is pending approval.</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => { setSuccess(false); setForm({ fullName: '', email: '', phone: '', password: '', emergencyRole: 'Field Agent', district: '', sector: '', skills: [], bio: '' }); }}
            style={{ padding: '10px 24px', background: 'var(--gray-100)', color: 'var(--gray-700)', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Add Another
          </button>
          <button onClick={() => navigate('/admin/volunteers')}
            style={{ padding: '10px 24px', background: 'var(--teal-800)', color: 'white', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            View Directory
          </button>
        </div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <button onClick={() => navigate('/admin/volunteers')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gray-500)', background: 'none', marginBottom: 12, cursor: 'pointer' }}>
            ← Back to Volunteers
          </button>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--gray-900)' }}>Add New Volunteer</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 4 }}>Onboard a new community responder to the network.</p>
        </div>

        {error && (
          <div style={{ background: 'var(--red-100)', color: 'var(--red-600)', padding: '12px 16px', borderRadius: 10, fontSize: 13, marginBottom: 20, border: '1px solid #fCA5A5' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <Card title="Personal Information">
            <Row>
              <Field label="Full Name *">
                <input value={form.fullName} onChange={e => update('fullName', e.target.value)}
                  placeholder="Elena Rodriguez" style={inp} />
              </Field>
              <Field label="Email Address *">
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder="elena@sentinel.org" style={inp} />
              </Field>
            </Row>
            <Row>
              <Field label="Phone Number">
                <input value={form.phone} onChange={e => update('phone', e.target.value)}
                  placeholder="+91 98765 43210" style={inp} />
              </Field>
              <Field label="Password *">
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                  placeholder="Minimum 8 characters" style={inp} />
              </Field>
            </Row>
            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>Profile Photo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid var(--gray-200)' }}>
                  {form.avatar ? <img src={form.avatar} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => update('avatar', reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ fontSize: 12 }}
                />
              </div>
            </div>
          </Card>

          {/* Role & Location */}
          <Card title="Role & Location">
            <Row>
              <Field label="Emergency Role">
                <select value={form.emergencyRole} onChange={e => update('emergencyRole', e.target.value)} style={inp}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="District">
                <select value={form.district} onChange={e => update('district', e.target.value)} style={inp}>
                  <option value="">Select District</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
            </Row>
            <Field label="Sector">
              <input value={form.sector} onChange={e => update('sector', e.target.value)}
                placeholder="e.g. Sector 4, Zone A" style={inp} />
            </Field>
          </Card>

          {/* Skills */}
          <Card title="Skills & Expertise">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SKILLS_OPTIONS.map(sk => {
                const active = form.skills.includes(sk);
                return (
                  <button key={sk} type="button" onClick={() => toggleSkill(sk)} style={{
                    padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    border: `1.5px solid ${active ? 'var(--teal-600)' : 'var(--gray-200)'}`,
                    background: active ? 'var(--teal-50)' : 'white',
                    color: active ? 'var(--teal-700)' : 'var(--gray-500)',
                    transition: 'all 0.15s'
                  }}>{active ? '✓ ' : ''}{sk}</button>
                );
              })}
            </div>
          </Card>

          {/* Bio */}
          <Card title="Bio / Notes">
            <textarea value={form.bio} onChange={e => update('bio', e.target.value)}
              placeholder="Brief background, certifications, or relevant experience..."
              rows={3} style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
          </Card>

          {/* Submit */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => navigate('/admin/volunteers')} style={{
              padding: '11px 24px', background: 'var(--gray-100)', color: 'var(--gray-700)', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer'
            }}>Cancel</button>
            <button type="submit" disabled={loading} style={{
              padding: '11px 28px', background: loading ? 'var(--gray-300)' : 'var(--teal-800)', color: 'white',
              borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: loading ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              {loading && <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />}
              {loading ? 'Adding...' : 'Add Volunteer'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)', marginBottom: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 18 }}>{title}</div>
      {children}
    </div>
  );
}
function Row({ children }) { return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>{children}</div>; }
function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}
const inp = {
  width: '100%', padding: '9px 12px', border: '1px solid var(--gray-200)', borderRadius: 8,
  fontSize: 13, color: 'var(--gray-800)', background: 'var(--gray-50)', outline: 'none'
};
