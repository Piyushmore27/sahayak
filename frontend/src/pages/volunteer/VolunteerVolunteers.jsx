import React, { useState, useEffect } from 'react';
import VolunteerLayout from '../../components/volunteer/VolunteerLayout';
import { getVolunteers } from '../../services/api';

export default function VolunteerVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVolunteers().then(r => {
      setVolunteers(r.data.data.volunteers);
    }).catch(() => {
      setVolunteers(MOCK);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <VolunteerLayout activeTab="Volunteers">
      <div style={{ padding: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--teal-800)', marginBottom: 8 }}>Volunteer Directory</h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 13, marginBottom: 24 }}>Connect with other Sentinels in the network.</p>

        {loading ? (
          <div>Loading volunteers...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {volunteers.map((v, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--teal-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-900)' }}>{v.fullName}</div>
                    <div style={{ fontSize: 12, color: 'var(--teal-600)', fontWeight: 500 }}>{v.emergencyRole || 'Field Agent'}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div>📍 {v.district || 'Anywhere'}</div>
                  <div>📞 {v.phone || 'N/A'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </VolunteerLayout>
  );
}

const MOCK = [
  { fullName: 'Elena Rodriguez', emergencyRole: 'Medical Lead', district: 'North District', phone: '+91 98765 01234' },
  { fullName: 'Marcus Chen', emergencyRole: 'Logistics', district: 'Central District', phone: '+91 98765 44332' },
];
