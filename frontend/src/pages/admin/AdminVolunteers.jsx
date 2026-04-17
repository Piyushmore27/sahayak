import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getVolunteers } from '../../services/api';
import VolunteerProfileModal from './VolunteerProfileModal';

const ROLE_COLORS = { 'Medical Lead': 'var(--teal-600)', 'Logistics': 'var(--amber-500)', 'Communications': 'var(--teal-400)', 'Support': 'var(--gray-500)', 'Coordinator': 'var(--teal-700)', 'Field Agent': 'var(--gray-600)' };
const LOCATIONS = ['All Locations', 'North District', 'South District', 'East District', 'West District', 'Central District', 'Coastal Sector'];

export default function AdminVolunteers() {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (locationRef.current && !locationRef.current.contains(e.target)) setShowLocationDropdown(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setLoading(true);
    getVolunteers({ page, limit: 6, search }).then(r => {
      setVolunteers(r.data.data.volunteers);
      setTotal(r.data.data.total);
      setPages(r.data.data.pages);
    }).catch(() => setVolunteers(MOCK)).finally(() => setLoading(false));
  }, [page, search]);

  const filteredVolunteers = (volunteers.length ? volunteers : MOCK).filter(v => {
    if (locationFilter === 'All Locations') return true;
    return (v.district || '').toLowerCase().includes(locationFilter.toLowerCase());
  });

  return (
    <AdminLayout>
      {selectedVolunteer && (
        <VolunteerProfileModal volunteer={selectedVolunteer} onClose={() => setSelectedVolunteer(null)} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 2 }}>Admin › Volunteers</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--gray-900)' }}>Volunteer Directory</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 4, maxWidth: 440 }}>Manage and monitor community responders across all designated districts.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Filter by Location */}
          <div ref={locationRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLocationDropdown(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid var(--gray-200)', borderRadius: 8, fontSize: 13, background: 'white', color: 'var(--gray-600)', cursor: 'pointer' }}>
              📍 {locationFilter} ▾
            </button>
            {showLocationDropdown && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0, background: 'white',
                borderRadius: 10, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--gray-100)',
                minWidth: 200, zIndex: 500, padding: 4, animation: 'fadeIn 0.15s ease'
              }}>
                {LOCATIONS.map(loc => (
                  <button key={loc} onClick={() => { setLocationFilter(loc); setShowLocationDropdown(false); }} style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px',
                    background: loc === locationFilter ? 'var(--teal-50)' : 'transparent',
                    color: loc === locationFilter ? 'var(--teal-700)' : 'var(--gray-700)',
                    borderRadius: 7, fontSize: 13, cursor: 'pointer', fontWeight: loc === locationFilter ? 600 : 400
                  }}>
                    {loc === locationFilter ? '✓ ' : ''}{loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, email or role..."
              style={{ padding: '8px 14px 8px 34px', border: '1px solid var(--gray-200)', borderRadius: 8, fontSize: 13, outline: 'none', width: 240 }}
            />
            <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          </div>

          {/* Register New */}
          <button
            onClick={() => navigate('/admin/register')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: 'var(--amber-400)', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            + Register New
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div style={{ width: 32, height: 32, border: '3px solid var(--teal-200)', borderTopColor: 'var(--teal-600)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {filteredVolunteers.map((v, i) => (
            <VolunteerCard key={v._id || i} v={v} onViewProfile={() => setSelectedVolunteer(v)} />
          ))}
          {/* Add new card */}
          <div onClick={() => navigate('/admin/volunteers/add')} style={{ border: '2px dashed var(--gray-200)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10, cursor: 'pointer', minHeight: 200, transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--teal-400)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gray-200)'}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)' }}>Add New Volunteer</div>
            <div style={{ fontSize: 12, color: 'var(--gray-400)', textAlign: 'center' }}>Onboard a community responder to the district network.</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>Showing <b>{Math.min(6, total || MOCK.length)}</b> of <b>{total || MOCK.length}</b> active volunteers</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pgBtn}>‹</button>
          {Array.from({ length: Math.min(pages || 1, 5) }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} style={{ ...pgBtn, background: page === i + 1 ? 'var(--teal-800)' : 'white', color: page === i + 1 ? 'white' : 'var(--gray-600)' }}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(pages || 1, p + 1))} disabled={page === pages} style={pgBtn}>›</button>
        </div>
      </div>
    </AdminLayout>
  );
}

function VolunteerCard({ v, onViewProfile }) {
  const roleColor = ROLE_COLORS[v.emergencyRole] || 'var(--gray-500)';
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: 20, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)', transition: 'box-shadow 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--teal-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {v.avatar ? <img src={v.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--gray-900)' }}>{v.fullName}</div>
            <div style={{ display: 'flex', gap: 3, marginTop: 3 }}>
              {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: 11, color: s <= Math.round(v.rating || 0) ? 'var(--amber-400)' : 'var(--gray-300)' }}>★</span>)}
              <span style={{ fontSize: 11, color: 'var(--gray-500)', marginLeft: 2 }}>{v.rating?.toFixed(1) || '0.0'}</span>
            </div>
          </div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 600, color: roleColor, background: roleColor + '20', padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {v.emergencyRole || 'Field Agent'}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--gray-500)' }}>
          <span>@</span> {v.email}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--gray-500)' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
          {v.district || 'North District'} • {v.sector || 'Sector 4'}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {(v.skills || ['EC', 'SR']).slice(0, 3).map((s, i) => (
            <span key={i} style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--gray-600)' }}>{s.slice(0, 2).toUpperCase()}</span>
          ))}
        </div>
        <button onClick={onViewProfile} style={{ padding: '7px 16px', background: 'var(--teal-800)', color: 'white', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View Profile</button>
      </div>
    </div>
  );
}

const pgBtn = { width: 32, height: 32, border: '1px solid var(--gray-200)', borderRadius: 6, background: 'white', color: 'var(--gray-600)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 };

const MOCK = [
  { fullName: 'Elena Rodriguez', email: 'e.rodriguez@sentinel.org', emergencyRole: 'Medical Lead', rating: 5.0, district: 'North District', sector: 'Sector 4', skills: ['EC', 'SR'] },
  { fullName: 'Marcus Chen', email: 'm.chen.response@sentinel.org', emergencyRole: 'Logistics', rating: 4.2, district: 'Central District', sector: 'Hub A', skills: ['VO'] },
  { fullName: 'Sarah Jenkins', email: 's.jenkins@sentinel.org', emergencyRole: 'Communications', rating: 4.9, district: 'Coastal Sector', sector: 'Reach 1', skills: ['DT'] },
  { fullName: 'David Okoro', email: 'd.okoro@sentinel.org', emergencyRole: 'Support', rating: 3.5, district: 'South District', sector: 'Zone C', skills: ['PB'] },
  { fullName: 'Jessica Taylor', email: 'j.taylor@sentinel.org', emergencyRole: 'Coordinator', rating: 4.8, district: 'North District', sector: 'Sector 2', skills: ['TL', 'IN'] },
];
