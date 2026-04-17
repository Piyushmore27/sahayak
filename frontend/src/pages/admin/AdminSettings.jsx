import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettings() {
  const { user, setUser } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    sector: user?.sector || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    incidentAlerts: true,
    volunteerUpdates: true,
    systemHealth: false,
    weeklyReport: true,
  });
  const [saved, setSaved] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const SECTIONS = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
  ];

  return (
    <AdminLayout>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--gray-900)' }}>Settings</h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 4 }}>Manage your account preferences, security and notification settings.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        {/* Sidebar */}
        <div style={{ background: 'white', borderRadius: 14, padding: 12, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)', alignSelf: 'start' }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8,
              width: '100%', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 2,
              background: activeSection === s.id ? 'var(--teal-50)' : 'transparent',
              color: activeSection === s.id ? 'var(--teal-700)' : 'var(--gray-600)',
              transition: 'all 0.15s'
            }}>
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {activeSection === 'profile' && (
            <Card title="Profile Information">
              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid var(--gray-100)' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--teal-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 4 }}>{user?.name || 'Admin User'}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 8 }}>JPG, PNG or GIF • Max 2MB</div>
                  <button style={{ padding: '7px 16px', border: '1px solid var(--gray-200)', borderRadius: 8, background: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--gray-700)' }}>Upload Photo</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <Field label="Full Name">
                  <input value={form.name} onChange={e => update('name', e.target.value)} style={inp} />
                </Field>
                <Field label="Email Address">
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)} style={inp} />
                </Field>
              </div>
              <Field label="Sector">
                <input value={form.sector} onChange={e => update('sector', e.target.value)} placeholder="Delhi Sector Alpha" style={inp} />
              </Field>
              <div style={{ marginTop: 20 }}>
                <Field label="Admin ID">
                  <input value={user?.adminId || '—'} disabled style={{ ...inp, background: 'var(--gray-100)', color: 'var(--gray-400)' }} />
                </Field>
              </div>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card title="Security Settings">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Field label="Current Password">
                  <input type="password" value={form.currentPassword} onChange={e => update('currentPassword', e.target.value)} placeholder="••••••••" style={inp} />
                </Field>
                <Field label="New Password">
                  <input type="password" value={form.newPassword} onChange={e => update('newPassword', e.target.value)} placeholder="Min 8 characters" style={inp} />
                </Field>
                <Field label="Confirm New Password">
                  <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="Repeat new password" style={inp} />
                </Field>
              </div>
              <div style={{ marginTop: 20, padding: 16, background: 'var(--teal-50)', borderRadius: 10, border: '1px solid var(--teal-100)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--teal-700)', marginBottom: 4 }}>🔐 Two-Factor Authentication</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 10 }}>Add an extra layer of security to your account with 2FA.</div>
                <button style={{ padding: '8px 16px', background: 'var(--teal-800)', color: 'white', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Enable 2FA</button>
              </div>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card title="Notification Preferences">
              {Object.entries(notifications).map(([key, val]) => {
                const labels = {
                  incidentAlerts: { title: 'Incident Alerts', desc: 'Get notified about new incidents and emergencies.' },
                  volunteerUpdates: { title: 'Volunteer Updates', desc: 'Status changes and new registrations.' },
                  systemHealth: { title: 'System Health', desc: 'Infrastructure and API health notifications.' },
                  weeklyReport: { title: 'Weekly Report', desc: 'Summary of weekly operations and statistics.' },
                };
                const info = labels[key];
                return (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{info.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>{info.desc}</div>
                    </div>
                    <button onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))} style={{
                      width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: val ? 'var(--teal-700)' : 'var(--gray-200)', transition: 'background 0.2s', position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute', top: 3, left: val ? 'calc(100% - 21px)' : 3,
                        width: 18, height: 18, borderRadius: '50%', background: 'white',
                        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }} />
                    </button>
                  </div>
                );
              })}
            </Card>
          )}

          {activeSection === 'appearance' && (
            <Card title="Appearance">
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 12 }}>Theme</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['Light', 'Dark', 'System'].map(t => (
                    <button key={t} style={{
                      padding: '10px 20px', border: `2px solid ${t === 'Light' ? 'var(--teal-700)' : 'var(--gray-200)'}`,
                      borderRadius: 10, background: t === 'Light' ? 'var(--teal-50)' : 'white',
                      color: t === 'Light' ? 'var(--teal-700)' : 'var(--gray-500)',
                      fontSize: 13, fontWeight: t === 'Light' ? 700 : 500, cursor: 'pointer'
                    }}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)', marginBottom: 12 }}>Sidebar Density</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['Compact', 'Default', 'Comfortable'].map(d => (
                    <button key={d} style={{
                      padding: '10px 20px', border: `2px solid ${d === 'Default' ? 'var(--teal-700)' : 'var(--gray-200)'}`,
                      borderRadius: 10, background: d === 'Default' ? 'var(--teal-50)' : 'white',
                      color: d === 'Default' ? 'var(--teal-700)' : 'var(--gray-500)',
                      fontSize: 13, fontWeight: d === 'Default' ? 700 : 500, cursor: 'pointer'
                    }}>{d}</button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Save bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            {saved && <div style={{ fontSize: 13, color: 'var(--green-500)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>✓ Changes saved!</div>}
            <button onClick={handleSave} style={{
              padding: '11px 28px', background: 'var(--teal-800)', color: 'white',
              borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer'
            }}>Save Changes</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: 28, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)', fontFamily: 'var(--font-display)', marginBottom: 22 }}>{title}</div>
      {children}
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
  width: '100%', padding: '10px 12px', border: '1px solid var(--gray-200)', borderRadius: 8,
  fontSize: 13, color: 'var(--gray-800)', background: 'var(--gray-50)', outline: 'none'
};
