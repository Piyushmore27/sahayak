import React from 'react';

export default function VolunteerProfileModal({ volunteer, onClose }) {
  if (!volunteer) return null;
  const v = volunteer;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease'
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: 20, width: '100%', maxWidth: 520, padding: 32,
        boxShadow: '0 24px 80px rgba(0,0,0,0.2)', position: 'relative', maxHeight: '90vh', overflowY: 'auto'
      }} onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16, width: 32, height: 32,
          borderRadius: '50%', border: '1px solid var(--gray-200)', background: 'var(--gray-50)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: 'var(--gray-500)'
        }}>×</button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 16, background: 'var(--teal-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0
          }}>
            {v.avatar
              ? <img src={v.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            }
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>
              {v.fullName || v.name || 'Unknown'}
            </h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 11, fontWeight: 700, color: 'var(--teal-700)', background: 'var(--teal-50)',
                padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 0.5
              }}>{v.emergencyRole || 'Field Agent'}</span>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                background: v.status === 'active' ? 'var(--green-100)' : 'var(--amber-100)',
                color: v.status === 'active' ? 'var(--green-500)' : 'var(--amber-500)',
              }}>{v.status || 'Active'}</span>
            </div>
          </div>
        </div>

        {/* Stars */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 20 }}>
          {[1, 2, 3, 4, 5].map(s => (
            <span key={s} style={{ fontSize: 18, color: s <= Math.round(v.rating || 0) ? 'var(--amber-400)' : 'var(--gray-200)' }}>★</span>
          ))}
          <span style={{ fontSize: 14, color: 'var(--gray-500)', marginLeft: 6 }}>{v.rating?.toFixed(1) || '0.0'} / 5.0</span>
        </div>

        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
          {[
            { label: 'Email', value: v.email, icon: '✉' },
            { label: 'Phone', value: v.phone || v.phoneNumber || '—', icon: '📞' },
            { label: 'District', value: v.district || '—', icon: '📍' },
            { label: 'Sector', value: v.sector || '—', icon: '🗺' },
            { label: 'Missions', value: v.completedMissions ?? v.missionsCompleted ?? '—', icon: '✅' },
            { label: 'Joined', value: v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '—', icon: '📅' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ background: 'var(--gray-50)', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 3 }}>{icon} {label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Skills */}
        {v.skills && v.skills.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Skills</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {v.skills.map((sk, i) => (
                <span key={i} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: 'var(--teal-50)', color: 'var(--teal-700)', fontWeight: 500 }}>{sk}</span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            flex: 1, padding: '11px', background: 'var(--teal-800)', color: 'white',
            borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer'
          }}>Send Message</button>
          <button style={{
            flex: 1, padding: '11px', background: 'var(--gray-100)', color: 'var(--gray-700)',
            borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer'
          }} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
