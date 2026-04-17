import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const TABS = ['Doctors', 'Ambulance Drivers', 'Medical Owners'];
const MOCK = {
  Doctors: [
    { id: '#DOC-9021', name: 'Dr. Elena Rodriguez', role: 'Senior Trauma Surgeon', phone: '+91 98765 01234', address: 'AIIMS, Ansari Nagar, New Delhi', verified: true, email: 'elena.rodriguez@aiims.edu', specialization: 'Trauma & Emergency Surgery', experience: '14 years', availability: 'Available' },
    { id: '#DOC-8832', name: 'Dr. Sarah Jenkins', role: 'Pediatric Emergency Care', phone: '+91 98765 98765', address: "Safdarjung Hospital, New Delhi", verified: true, email: 'sarah.j@safdarjung.gov.in', specialization: 'Pediatric Emergency', experience: '9 years', availability: 'On Call' },
    { id: '#DOC-7719', name: 'Dr. Michael Chen', role: 'Cardiovascular Specialist', phone: '+91 98765 44332', address: 'Fortis Escorts Heart Institute, New Delhi', verified: false, email: 'm.chen@fortis.in', specialization: 'Cardiology', experience: '18 years', availability: 'Unavailable' },
    { id: '#OWN-1102', name: 'Linda McGregor', role: 'Director, Peak Performance Clinics', phone: '+91 98765 22110', address: 'Max Super Speciality, Saket', verified: true, email: 'linda@maxhealthcare.in', specialization: 'Hospital Administration', experience: '22 years', availability: 'Available' },
    { id: '#DOC-1122', name: 'Dr. James Wilson', role: 'Internal Medicine', phone: '+91 98765 77889', address: 'Apollo Hospitals, Jasola', verified: true, email: 'jwilson@apollo.in', specialization: 'Internal Medicine', experience: '11 years', availability: 'Available' },
  ],
  'Ambulance Drivers': [
    { id: '#AMB-1001', name: 'Ravi Kumar', role: 'Emergency Driver – Level 3', phone: '+91 98765 11222', address: 'Central Dispatch, Zone A', verified: true, email: 'ravi.k@dispatch.gov.in', specialization: 'Critical Response', experience: '7 years', availability: 'On Duty' },
    { id: '#AMB-1002', name: 'Priya Nair', role: 'Critical Response Driver', phone: '+91 98765 33444', address: 'Station 7, North Hub', verified: true, email: 'priya.n@dispatch.gov.in', specialization: 'Advanced Life Support', experience: '5 years', availability: 'On Duty' },
    { id: '#AMB-1003', name: 'Suresh Mehta', role: 'Standard Ambulance Driver', phone: '+91 98765 55666', address: 'Station 3, South Zone', verified: false, email: 'suresh.m@dispatch.gov.in', specialization: 'Basic Life Support', experience: '3 years', availability: 'Available' },
  ],
  'Medical Owners': [
    { id: '#OWN-2001', name: 'Metro General Hospital', role: 'Regional Medical Center', phone: '+91 11 5000 0001', address: 'Connaught Place, New Delhi', verified: true, email: 'admin@metrogeneral.in', specialization: 'Multi-Specialty', experience: '35 years', availability: 'Open 24/7' },
    { id: '#OWN-2002', name: 'CurePoint Clinics', role: 'Multi-Site Medical Chain', phone: '+91 11 5000 0002', address: 'Multiple Locations, Delhi NCR', verified: false, email: 'admin@curepoint.in', specialization: 'Primary Care', experience: '12 years', availability: 'Open 9AM–9PM' },
    { id: '#OWN-2003', name: 'HealthFirst Pharmacy', role: 'Medical Supply Chain', phone: '+91 11 5000 0003', address: 'Karol Bagh, New Delhi', verified: true, email: 'hq@healthfirst.in', specialization: 'Pharmacy & Dispensary', experience: '20 years', availability: 'Open 24/7' },
  ],
};

export default function AdminRoleDirectories() {
  const [tab, setTab] = useState('Doctors');
  const [selectedProfile, setSelectedProfile] = useState(null);

  return (
    <AdminLayout>
      {selectedProfile && (
        <ProfileModal person={selectedProfile} tab={tab} onClose={() => setSelectedProfile(null)} />
      )}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--teal-800)' }}>Role-Specific Directories</h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 4 }}>Manage and verify medical professionals across the network. All profiles are reviewed against regional medical board standards.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--gray-100)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 18px', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none',
            background: tab === t ? 'white' : 'transparent', color: tab === t ? 'var(--gray-900)' : 'var(--gray-500)',
            boxShadow: tab === t ? 'var(--shadow-sm)' : 'none', transition: 'all 0.15s',
          }}>
            {tab === t ? (t === 'Doctors' ? '🩺 ' : t === 'Ambulance Drivers' ? '🚑 ' : '🏥 ') : ''}{t}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {(MOCK[tab] || []).map((p, i) => (
          <div key={i} style={{ background: 'white', borderRadius: 14, padding: 20, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)', transition: 'box-shadow 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end', marginBottom: 3 }}>
                  {p.verified
                    ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green-500)" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg><span style={{ fontSize: 11, fontWeight: 700, color: 'var(--green-500)' }}>VERIFIED</span></>
                    : <><span style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber-500)' }}>⏳ PENDING</span></>
                  }
                </div>
                <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>ID: {p.id}</div>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--gray-900)' }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--teal-700)', fontWeight: 500, marginTop: 2 }}>{p.role}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--gray-600)' }}>
                📞 {p.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12, color: 'var(--gray-600)' }}>
                📍 {p.address}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setSelectedProfile(p)} style={{ flex: 1, padding: '8px', background: 'var(--teal-800)', color: 'white', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View Profile</button>
              <button style={{ width: 34, height: 34, border: '1px solid var(--gray-200)', borderRadius: 7, background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gray-500)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </button>
            </div>
          </div>
        ))}

        {/* Invite card */}
        <div style={{ border: '2px dashed var(--gray-200)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>+</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--gray-700)' }}>Invite New Professional</div>
          <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>Send a secure registration link to a verified medical practitioner.</div>
          <button style={{ padding: '8px 20px', border: '1px solid var(--gray-200)', borderRadius: 7, background: 'white', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: 'var(--gray-700)' }}>Send Invitation</button>
        </div>
      </div>
    </AdminLayout>
  );
}

function ProfileModal({ person: p, tab, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 500, padding: 32, boxShadow: '0 24px 80px rgba(0,0,0,0.2)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--gray-200)', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: 'var(--gray-500)' }}>×</button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 68, height: 68, borderRadius: 14, background: 'var(--teal-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, flexShrink: 0 }}>
            {tab === 'Doctors' ? '🩺' : tab === 'Ambulance Drivers' ? '🚑' : '🏥'}
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>{p.name}</h2>
            <div style={{ fontSize: 13, color: 'var(--teal-700)', fontWeight: 500 }}>{p.role}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              {p.verified
                ? <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--green-500)', background: 'var(--green-100)', padding: '2px 8px', borderRadius: 20 }}>✓ VERIFIED</span>
                : <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber-500)', background: 'var(--amber-100)', padding: '2px 8px', borderRadius: 20 }}>⏳ PENDING</span>
              }
              <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>{p.id}</span>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Email', value: p.email, icon: '✉' },
            { label: 'Phone', value: p.phone, icon: '📞' },
            { label: 'Specialization', value: p.specialization, icon: '🔬' },
            { label: 'Experience', value: p.experience, icon: '📅' },
            { label: 'Availability', value: p.availability, icon: '🟢' },
            { label: 'Address', value: p.address, icon: '📍' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{ background: 'var(--gray-50)', borderRadius: 10, padding: '11px 13px' }}>
              <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 3 }}>{icon} {label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)' }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ flex: 1, padding: '11px', background: 'var(--teal-800)', color: 'white', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Contact</button>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', background: 'var(--gray-100)', color: 'var(--gray-700)', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </div>
  );
}
