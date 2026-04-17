import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getDashboardStats, getIncidents } from '../../services/api';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Crisis zone markers color
const crisisIcon = L.divIcon({
  className: '',
  html: `<div style="width:24px;height:24px;background:#e74c3c;border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:700">H</div>`,
  iconSize: [24, 24], iconAnchor: [12, 12],
});

const safeIcon = L.divIcon({
  className: '',
  html: `<div style="width:24px;height:24px;background:#27ae60;border:2px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:700">✓</div>`,
  iconSize: [24, 24], iconAnchor: [12, 12],
});

const INCIDENT_MARKERS = [
  { lat: 28.6139, lng: 77.209, type: 'crisis', label: 'Connaught Place Incident' },
  { lat: 28.5672, lng: 77.2100, type: 'crisis', label: 'Lajpat Nagar Emergency' },
  { lat: 28.6304, lng: 77.2177, type: 'safe', label: 'Safe Zone – Sector 14' },
  { lat: 28.6448, lng: 77.1800, type: 'crisis', label: 'Rohini Alert' },
];

// A component to handle map search/goto
function MapSearchControl({ query }) {
  const map = useMap();
  useEffect(() => {
    if (!query) return;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    fetch(url)
      .then(r => r.json())
      .then(results => {
        if (results && results.length > 0) {
          const { lat, lon } = results[0];
          map.setView([parseFloat(lat), parseFloat(lon)], 14, { animate: true });
        }
      })
      .catch(() => {});
  }, [query, map]);
  return null;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ activeVolunteers: 1284, pendingAlerts: 42, safeZones: 15, systemHealth: 94 });
  const [incidents, setIncidents] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [feed] = useState([
    { color: '#e74c3c', text: 'Vehicle Collision Reported', sub: 'Connaught Place • 2m ago' },
    { color: '#e8930a', text: 'Volunteer Unit Arrived', sub: 'Sector 14 • 5m ago' },
    { color: '#177a82', text: 'Medical Support Requested', sub: 'Lajpat Nagar • 12m ago' },
  ]);

  useEffect(() => {
    getDashboardStats().then(r => setStats(r.data.data)).catch(() => {});
    getIncidents({ status: 'active' }).then(r => setIncidents(r.data.data.incidents || [])).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  return (
    <AdminLayout>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, height: 'calc(100vh - 120px)' }}>
        {/* Real Map */}
        <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', minHeight: 400 }}>
          {/* Search bar overlay */}
          <form onSubmit={handleSearch} style={{
            position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
            zIndex: 1000, display: 'flex', gap: 0, background: 'white',
            borderRadius: 28, boxShadow: 'var(--shadow-md)', overflow: 'hidden',
            border: '1px solid var(--gray-200)'
          }}>
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search location on map..."
              style={{
                padding: '9px 16px', border: 'none', outline: 'none',
                fontSize: 13, width: 260, color: 'var(--gray-700)'
              }}
            />
            <button type="submit" style={{
              padding: '9px 16px', background: 'var(--teal-800)', color: 'white',
              border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer'
            }}>🔍 Search</button>
          </form>

          <MapContainer
            center={[28.6139, 77.209]}
            zoom={12}
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapSearchControl query={searchQuery} />

            {/* Crisis markers */}
            {INCIDENT_MARKERS.map((m, i) => (
              <React.Fragment key={i}>
                <Marker position={[m.lat, m.lng]} icon={m.type === 'crisis' ? crisisIcon : safeIcon}>
                  <Popup>
                    <strong>{m.label}</strong><br />
                    Type: {m.type === 'crisis' ? '🔴 Active Crisis' : '🟢 Safe Zone'}
                  </Popup>
                </Marker>
                {m.type === 'crisis' && (
                  <Circle
                    center={[m.lat, m.lng]}
                    radius={600}
                    pathOptions={{ color: '#e74c3c', fillColor: '#e74c3c', fillOpacity: 0.1, weight: 1.5 }}
                  />
                )}
              </React.Fragment>
            ))}
          </MapContainer>

          {/* Bottom crisis banner */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(255,255,255,0.95)', padding: '10px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderTop: '1px solid var(--gray-200)', zIndex: 1000
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red-500)', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--red-600)' }}>Active Crisis: Severe Logistical Delay in South Zone</span>
            </div>
            <button style={{ fontSize: 12, color: 'var(--teal-700)', fontWeight: 600, background: 'none', padding: 0, cursor: 'pointer' }}>View Analytics →</button>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Sentinel Status card */}
          <div style={{ background: 'var(--white)', borderRadius: 14, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal-700)" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15, color: 'var(--gray-800)' }}>Sentinel Status</span>
            </div>
            <StatRow label="ACTIVE VOLUNTEERS" value={stats.activeVolunteers?.toLocaleString() || '1,284'} badge="+12%" badgeColor="var(--green-500)" barColor="var(--green-500)" pct={80} />
            <StatRow label="PENDING ALERTS" value={stats.pendingAlerts || 42} badge="HIGH" badgeColor="var(--red-500)" barColor="var(--red-500)" pct={70} />
            <StatRow label="SAFE ZONES" value={stats.safeZones || 15} badge="STABLE" badgeColor="var(--teal-600)" barColor="var(--teal-500)" pct={60} />
            <button 
              onClick={() => alert('Deploying Incident Response Team... \nNotification sent to nearby volunteers.')}
              style={{ width: '100%', padding: '11px', background: 'var(--teal-800)', color: 'white', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 4, boxShadow: 'var(--shadow-teal)' }}>
              Deploy Incident Response ▶
            </button>
          </div>

          {/* Real-time feed */}
          <div style={{ background: 'var(--white)', borderRadius: 14, padding: 20, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>Real-Time Feed</div>
            {feed.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.color, marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)' }}>{f.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* System health */}
          <div style={{ background: 'var(--white)', borderRadius: 14, padding: 16, boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-700)' }}>System Health</span>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green-500)' }} />
            </div>
            <div style={{ height: 5, background: 'var(--gray-100)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${stats.systemHealth || 94}%`, background: 'var(--teal-500)', borderRadius: 10, transition: 'width 1s' }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 6 }}>{stats.systemHealth || 94}% Connectivity Coverage</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatRow({ label, value, badge, badgeColor, barColor, pct }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'white', background: badgeColor, padding: '2px 7px', borderRadius: 10 }}>{badge}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 6 }}>{value}</div>
      <div style={{ height: 3, background: 'var(--gray-100)', borderRadius: 10 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 10 }} />
      </div>
    </div>
  );
}
