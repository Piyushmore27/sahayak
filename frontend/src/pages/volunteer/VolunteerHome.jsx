import React, { useState, useEffect, useRef } from 'react';
import VolunteerLayout from '../../components/volunteer/VolunteerLayout';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const hospitalIcon = L.divIcon({
  className: '',
  html: `<div style="width:32px;height:32px;background:#e74c3c;border:2px solid white;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:16px;">🏥</div>`,
  iconSize: [32, 32], iconAnchor: [16, 16],
});

const medShopIcon = L.divIcon({
  className: '',
  html: `<div style="width:32px;height:32px;background:#27ae60;border:2px solid white;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:16px;">💊</div>`,
  iconSize: [32, 32], iconAnchor: [16, 16],
});

const dispensaryIcon = L.divIcon({
  className: '',
  html: `<div style="width:32px;height:32px;background:#9b59b6;border:2px solid white;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:16px;">🏪</div>`,
  iconSize: [32, 32], iconAnchor: [16, 16],
});

const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:20px;height:20px;background:#0d5c63;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
  iconSize: [20, 20], iconAnchor: [10, 10],
});

// Overpass API to fetch nearby places
async function fetchNearby(type, lat, lng, radius = 3000) {
  const queries = {
    hospital: `[out:json];node["amenity"="hospital"](around:${radius},${lat},${lng});out;`,
    pharmacy: `[out:json];node["amenity"="pharmacy"](around:${radius},${lat},${lng});out;`,
    dispensary: `[out:json];(node["amenity"="clinic"](around:${radius},${lat},${lng});node["shop"="chemist"](around:${radius},${lat},${lng}););out;`,
  };
  const body = queries[type];
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(body)}`
  });
  const data = await res.json();
  return data.elements || [];
}

// Component to fly map to bounds
function FlyToControl({ targets }) {
  const map = useMap();
  useEffect(() => {
    if (targets && targets.length > 0) {
      const bounds = targets.map(t => [t.lat, t.lon]);
      if (bounds.length === 1) map.flyTo(bounds[0], 15, { animate: true, duration: 1.2 });
      else map.flyToBounds(bounds, { padding: [60, 60], animate: true, duration: 1.2 });
    }
  }, [targets, map]);
  return null;
}

// Get user's live location
function useUserLocation() {
  const [pos, setPos] = useState({ lat: 28.6139, lng: 77.209 });
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        p => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => {} // fallback to default Delhi coords
      );
    }
  }, []);
  return pos;
}

export default function VolunteerHome() {
  const [online, setOnline] = useState(true);
  const [activeLayer, setActiveLayer] = useState(null); // 'hospital' | 'pharmacy' | 'dispensary'
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const userPos = useUserLocation();
  const prevLayerRef = useRef(null);

  const handleNav = async (type) => {
    // Toggle off if clicking the same
    if (activeLayer === type) {
      setActiveLayer(null);
      setMarkers([]);
      prevLayerRef.current = null;
      return;
    }
    setActiveLayer(type);
    prevLayerRef.current = type;
    setLoading(true);
    setMarkers([]);
    try {
      const results = await fetchNearby(type, userPos.lat, userPos.lng);
      setMarkers(results.slice(0, 15)); // limit to 15 markers
    } catch {
      setMarkers([]);
    } finally {
      setLoading(false);
    }
  };

  const navButtons = [
    { icon: '🏥', label: 'Navigate to Hospital', type: 'hospital', color: '#e74c3c' },
    { icon: '💊', label: 'Medical Shop', type: 'pharmacy', color: '#27ae60' },
    { icon: '🏪', label: 'Dispensary', type: 'dispensary', color: '#9b59b6' },
  ];

  const markerIcon = activeLayer === 'hospital' ? hospitalIcon : activeLayer === 'pharmacy' ? medShopIcon : dispensaryIcon;

  return (
    <VolunteerLayout activeTab="Map">
      <div style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Online/Offline toggle */}
        <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, display: 'flex', gap: 0, background: 'white', borderRadius: 24, boxShadow: 'var(--shadow-md)', overflow: 'hidden', padding: 3 }}>
          <button onClick={() => setOnline(true)} style={{
            padding: '8px 20px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
            background: online ? 'var(--teal-800)' : 'transparent', color: online ? 'white' : 'var(--gray-500)', transition: 'all 0.2s'
          }}>🟢 Online</button>
          <button onClick={() => setOnline(false)} style={{
            padding: '8px 20px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
            background: !online ? 'var(--teal-800)' : 'transparent', color: !online ? 'white' : 'var(--gray-500)', transition: 'all 0.2s'
          }}>⚫ Offline</button>
        </div>

        {/* Quick nav buttons */}
        <div style={{ position: 'absolute', top: 70, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, display: 'flex', gap: 8 }}>
          {navButtons.map(b => (
            <button
              key={b.type}
              onClick={() => handleNav(b.type)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                background: activeLayer === b.type ? b.color : 'white',
                color: activeLayer === b.type ? 'white' : 'var(--gray-700)',
                border: `2px solid ${activeLayer === b.type ? b.color : 'var(--gray-200)'}`,
                borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)', whiteSpace: 'nowrap', transition: 'all 0.2s'
              }}
            >
              <span>{b.icon}</span> {b.label}
              {activeLayer === b.type && loading && (
                <span style={{ width: 10, height: 10, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
              )}
            </button>
          ))}
        </div>

        {/* Status banner when layer active */}
        {activeLayer && !loading && markers.length > 0 && (
          <div style={{
            position: 'absolute', top: 116, left: '50%', transform: 'translateX(-50%)',
            zIndex: 1000, background: 'white', borderRadius: 20, padding: '6px 16px',
            boxShadow: 'var(--shadow-md)', fontSize: 12, color: 'var(--gray-600)', fontWeight: 500
          }}>
            📍 Found {markers.length} {activeLayer === 'hospital' ? 'hospitals' : activeLayer === 'pharmacy' ? 'medical shops' : 'dispensaries'} nearby
          </div>
        )}

        {/* Map */}
        <div style={{ flex: 1, position: 'relative', zIndex: 0 }}>
          <MapContainer
            center={[userPos.lat, userPos.lng]}
            zoom={14}
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User position */}
            <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
              <Popup>📍 Your Location</Popup>
            </Marker>

            {/* Nearby markers */}
            {markers.map((m, i) => (
              <Marker key={i} position={[m.lat, m.lon]} icon={markerIcon}>
                <Popup>
                  <strong>{m.tags?.name || (activeLayer === 'hospital' ? '🏥 Hospital' : activeLayer === 'pharmacy' ? '💊 Medical Shop' : '🏪 Dispensary')}</strong>
                  {m.tags?.['addr:street'] && <><br />{m.tags['addr:street']}</>}
                  {m.tags?.phone && <><br />📞 {m.tags.phone}</>}
                  {m.tags?.opening_hours && <><br />⏰ {m.tags.opening_hours}</>}
                  <br />
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lon}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--teal-700)', fontWeight: 600, fontSize: 12 }}
                  >
                    🗺 Get Directions
                  </a>
                </Popup>
              </Marker>
            ))}

            {/* Fly to markers when found */}
            {markers.length > 0 && <FlyToControl targets={markers.slice(0, 5)} />}
          </MapContainer>
        </div>

        {/* Emergency quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid var(--gray-100)', background: 'white', flexShrink: 0 }}>
          {[
            { icon: '🚑', title: 'Call Ambulance', sub: 'Medical Emergency Response', color: 'var(--red-500)', bg: 'var(--red-100)', tel: 'tel:102' },
            { icon: '🛡️', title: 'Call Police', sub: 'Local Law Enforcement', color: 'var(--teal-700)', bg: 'var(--teal-50)', tel: 'tel:100' },
            { icon: '🚒', title: 'Call Fire Brigade', sub: 'Fire & Rescue Services', color: 'var(--amber-500)', bg: 'var(--amber-100)', tel: 'tel:101' },
          ].map(a => (
            <a key={a.title} href={a.tel} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: a.bg, textDecoration: 'none', borderRight: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${a.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{a.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: a.color }}>{a.title}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{a.sub}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </VolunteerLayout>
  );
}
