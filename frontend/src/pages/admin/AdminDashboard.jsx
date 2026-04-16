import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getDashboardStats, getIncidents } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ activeVolunteers: 1284, pendingAlerts: 42, safeZones: 15, systemHealth: 94 });
  const [incidents, setIncidents] = useState([]);
  const [feed] = useState([
    { color:'#e74c3c', text:'Vehicle Collision Reported', sub:'Connaught Place • 2m ago' },
    { color:'#e8930a', text:'Volunteer Unit Arrived', sub:'Sector 14 • 5m ago' },
    { color:'#177a82', text:'Medical Support Requested', sub:'Lajpat Nagar • 12m ago' },
  ]);

  useEffect(() => {
    getDashboardStats().then(r => setStats(r.data.data)).catch(() => {});
    getIncidents({ status: 'active' }).then(r => setIncidents(r.data.data.incidents || [])).catch(() => {});
  }, []);

  return (
    <AdminLayout>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:24, height:'calc(100vh - 120px)' }}>
        {/* Map placeholder */}
        <div style={{ background:'var(--gray-200)', borderRadius:16, overflow:'hidden', position:'relative', minHeight:400 }}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, #b8d8c8 0%, #c8dfc8 50%, #b0ccc0 100%)' }}>
            {/* Simulated map grid */}
            <svg width="100%" height="100%" style={{ opacity:0.4 }}>
              {Array.from({length:20}).map((_,i) => (
                <line key={`h${i}`} x1="0" y1={i*40} x2="100%" y2={i*40} stroke="#666" strokeWidth="0.5" />
              ))}
              {Array.from({length:30}).map((_,i) => (
                <line key={`v${i}`} x1={i*50} y1="0" x2={i*50} y2="100%" stroke="#666" strokeWidth="0.5" />
              ))}
            </svg>
            {/* Crisis zones */}
            <div style={{ position:'absolute', top:'35%', left:'40%', width:120, height:120, borderRadius:'50%', background:'rgba(220,50,50,0.15)', border:'2px solid rgba(220,50,50,0.3)' }} />
            <div style={{ position:'absolute', top:'60%', left:'25%', width:90, height:90, borderRadius:'50%', background:'rgba(220,50,50,0.12)', border:'2px solid rgba(220,50,50,0.25)' }} />
            {/* Markers */}
            {[{x:'42%',y:'32%',c:'#e74c3c',label:'H'},{x:'28%',y:'68%',c:'#e74c3c',label:'H'},{x:'62%',y:'55%',c:'#9b59b6',label:'★'},{x:'48%',y:'48%',c:'#27ae60',label:'●'}].map((m,i) => (
              <div key={i} style={{ position:'absolute', left:m.x, top:m.y, width:28, height:28, borderRadius:'50%', background:m.c, border:'2px solid white', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:11, fontWeight:700, boxShadow:'0 2px 6px rgba(0,0,0,0.3)', transform:'translate(-50%,-50%)' }}>{m.label}</div>
            ))}
          </div>
          {/* Bottom crisis banner */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(255,255,255,0.95)', padding:'10px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid var(--gray-200)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--red-500)', animation:'pulse 1.5s infinite' }} />
              <span style={{ fontSize:13, fontWeight:600, color:'var(--red-600)' }}>Active Crisis: Severe Logistical Delay in South Zone</span>
            </div>
            <button style={{ fontSize:12, color:'var(--teal-700)', fontWeight:600, background:'none', padding:0, cursor:'pointer' }}>View Analytics →</button>
          </div>
          {/* Map controls */}
          <div style={{ position:'absolute', bottom:50, right:16, display:'flex', flexDirection:'column', gap:2 }}>
            {['+','−'].map(s => <button key={s} style={{ width:30, height:30, background:'white', border:'1px solid var(--gray-200)', borderRadius:4, fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{s}</button>)}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Sentinel Status card */}
          <div style={{ background:'var(--white)', borderRadius:14, padding:20, boxShadow:'var(--shadow-sm)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal-700)" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:15, color:'var(--gray-800)' }}>Sentinel Status</span>
            </div>
            <StatRow label="ACTIVE VOLUNTEERS" value={stats.activeVolunteers?.toLocaleString() || '1,284'} badge="+12%" badgeColor="var(--green-500)" barColor="var(--green-500)" pct={80} />
            <StatRow label="PENDING ALERTS" value={stats.pendingAlerts || 42} badge="HIGH" badgeColor="var(--red-500)" barColor="var(--red-500)" pct={70} />
            <StatRow label="SAFE ZONES" value={stats.safeZones || 15} badge="STABLE" badgeColor="var(--teal-600)" barColor="var(--teal-500)" pct={60} />
            <button style={{ width:'100%', padding:'11px', background:'var(--teal-800)', color:'white', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', marginTop:4, boxShadow:'var(--shadow-teal)' }}>
              Deploy Incident Response ▶
            </button>
          </div>

          {/* Real-time feed */}
          <div style={{ background:'var(--white)', borderRadius:14, padding:20, boxShadow:'var(--shadow-sm)' }}>
            <div style={{ fontSize:11, fontWeight:600, color:'var(--gray-500)', textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Real-Time Feed</div>
            {feed.map((f,i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:12 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:f.color, marginTop:5, flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:'var(--gray-800)' }}>{f.text}</div>
                  <div style={{ fontSize:11, color:'var(--gray-400)' }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* System health */}
          <div style={{ background:'var(--white)', borderRadius:14, padding:16, boxShadow:'var(--shadow-sm)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:13, fontWeight:600, color:'var(--gray-700)' }}>System Health</span>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--green-500)' }} />
            </div>
            <div style={{ height:5, background:'var(--gray-100)', borderRadius:10, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${stats.systemHealth || 94}%`, background:'var(--teal-500)', borderRadius:10, transition:'width 1s' }} />
            </div>
            <div style={{ fontSize:11, color:'var(--gray-500)', marginTop:6 }}>{stats.systemHealth || 94}% Connectivity Coverage</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatRow({ label, value, badge, badgeColor, barColor, pct }) {
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
        <span style={{ fontSize:10, color:'var(--gray-500)', textTransform:'uppercase', letterSpacing:0.8, fontWeight:600 }}>{label}</span>
        <span style={{ fontSize:10, fontWeight:700, color:'white', background:badgeColor, padding:'2px 7px', borderRadius:10 }}>{badge}</span>
      </div>
      <div style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:700, color:'var(--gray-900)', marginBottom:6 }}>{value}</div>
      <div style={{ height:3, background:'var(--gray-100)', borderRadius:10 }}>
        <div style={{ height:'100%', width:`${pct}%`, background:barColor, borderRadius:10 }} />
      </div>
    </div>
  );
}
