import React from 'react';
import VolunteerLayout from '../../components/volunteer/VolunteerLayout';

const RESOURCES = [
  { icon: '🏥', title: 'Medical Protocols', desc: 'Standard operating procedures for emergency medical aid.' },
  { icon: '📻', title: 'Comm Guide', desc: 'Radio frequencies and communication protocols for field ops.' },
  { icon: '🛡️', title: 'Safety Vesting', desc: 'Guidelines for identifying yourself and staying safe on site.' },
  { icon: '📦', title: 'Supply Requisition', desc: 'How to request emergency supplies and equipment.' },
];

export default function VolunteerResources() {
  return (
    <VolunteerLayout activeTab="Resources">
      <div style={{ padding: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--teal-800)', marginBottom: 8 }}>Resources & Training</h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 13, marginBottom: 24 }}>Essential guides and tools for your mission.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {RESOURCES.map(r => (
            <div key={r.title} style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{r.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 8 }}>{r.title}</div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5 }}>{r.desc}</div>
              <button style={{ marginTop: 16, padding: '7px 16px', background: 'var(--teal-800)', color: 'white', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none' }}>
                View Guide
              </button>
            </div>
          ))}
        </div>
      </div>
    </VolunteerLayout>
  );
}
