import React, { useState } from 'react';
import VolunteerLayout from '../../components/volunteer/VolunteerLayout';

export default function VolunteerHome() {
  const [online, setOnline] = useState(true);

  return (
    <VolunteerLayout activeTab="Map">
      <div style={{ position:'relative', height:'100vh', display:'flex', flexDirection:'column' }}>
        {/* Top bar */}
        <div style={{ position:'absolute', top:16, left:'50%', transform:'translateX(-50%)', zIndex:10, display:'flex', gap:0, background:'white', borderRadius:24, boxShadow:'var(--shadow-md)', overflow:'hidden', padding:3 }}>
          <button onClick={() => setOnline(true)} style={{ padding:'8px 20px', borderRadius:20, fontSize:13, fontWeight:600, cursor:'pointer', border:'none', background: online?'var(--teal-800)':'transparent', color: online?'white':'var(--gray-500)', transition:'all 0.2s' }}>Online</button>
          <button onClick={() => setOnline(false)} style={{ padding:'8px 20px', borderRadius:20, fontSize:13, fontWeight:600, cursor:'pointer', border:'none', background: !online?'var(--teal-800)':'transparent', color: !online?'white':'var(--gray-500)', transition:'all 0.2s' }}>Offline</button>
        </div>

        {/* Quick nav */}
        <div style={{ position:'absolute', top:70, left:'50%', transform:'translateX(-50%)', zIndex:10, display:'flex', gap:8 }}>
          {[
            { icon:'🏥', label:'Navigate to Hospital' },
            { icon:'💊', label:'Medical Shop' },
            { icon:'🏪', label:'Dispensary' },
          ].map(b => (
            <button key={b.label} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:'white', border:'1px solid var(--gray-200)', borderRadius:20, fontSize:12, fontWeight:500, cursor:'pointer', boxShadow:'var(--shadow-sm)', whiteSpace:'nowrap' }}>
              <span>{b.icon}</span> {b.label}
            </button>
          ))}
        </div>

        {/* Map */}
        <div style={{ flex:1, background:'#e8ede0', position:'relative' }}>
          {/* Muted map style */}
          <svg width="100%" height="100%" style={{ position:'absolute', inset:0 }}>
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="#d4dbc8"/>
            <rect width="100%" height="100%" fill="url(#grid)"/>
            {/* Roads */}
            <line x1="0" y1="40%" x2="100%" y2="40%" stroke="white" strokeWidth="6" opacity="0.7"/>
            <line x1="0" y1="65%" x2="100%" y2="65%" stroke="white" strokeWidth="4" opacity="0.6"/>
            <line x1="35%" y1="0" x2="35%" y2="100%" stroke="white" strokeWidth="6" opacity="0.7"/>
            <line x1="65%" y1="0" x2="65%" y2="100%" stroke="white" strokeWidth="4" opacity="0.6"/>
            <line x1="0" y1="25%" x2="100%" y2="50%" stroke="white" strokeWidth="3" opacity="0.4"/>
            {/* User location */}
            <circle cx="48%" cy="52%" r="10" fill="var(--teal-700)" opacity="0.9"/>
            <circle cx="48%" cy="52%" r="18" fill="none" stroke="var(--teal-600)" strokeWidth="2" opacity="0.5"/>
          </svg>

          {/* Map controls */}
          <div style={{ position:'absolute', right:16, top:'35%', display:'flex', flexDirection:'column', gap:4 }}>
            <button style={{ width:40, height:40, background:'white', border:'none', borderRadius:8, boxShadow:'var(--shadow-md)', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal-700)" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
            </button>
            <button style={{ width:40, height:40, background:'white', border:'none', borderRadius:8, boxShadow:'var(--shadow-md)', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-600)" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
            <button style={{ width:40, height:40, background:'white', border:'none', borderRadius:8, boxShadow:'var(--shadow-md)', fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-600)" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </button>
          </div>

          {/* Call Volunteers button */}
          <button style={{ position:'absolute', right:16, bottom:100, display:'flex', alignItems:'center', gap:8, padding:'12px 20px', background:'var(--amber-400)', color:'white', border:'none', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:'var(--shadow-md)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Call Volunteers Near Me
          </button>
        </div>

        {/* Emergency quick actions */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', borderTop:'1px solid var(--gray-100)', background:'white', flexShrink:0 }}>
          {[
            { icon:'🚑', title:'Call Ambulance', sub:'Medical Emergency Response', color:'var(--red-500)', bg:'var(--red-100)' },
            { icon:'🛡️', title:'Call Police', sub:'Local Law Enforcement', color:'var(--teal-700)', bg:'var(--teal-50)' },
            { icon:'🚒', title:'Call Fire Brigade', sub:'Fire & Rescue Services', color:'var(--amber-500)', bg:'var(--amber-100)' },
          ].map(a => (
            <button key={a.title} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', background:a.bg, border:'none', cursor:'pointer', textAlign:'left', borderRight:'1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${a.color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{a.icon}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:a.color }}>{a.title}</div>
                <div style={{ fontSize:11, color:'var(--gray-500)' }}>{a.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </VolunteerLayout>
  );
}
