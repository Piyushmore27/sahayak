import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const TABS = ['Doctors', 'Ambulance Drivers', 'Medical Owners'];
const MOCK = {
  Doctors: [
    { id:'#DOC-9021', name:'Dr. Elena Rodriguez', role:'Senior Trauma Surgeon', phone:'+1 (555) 012-3456', address:'Central Hope Medical Plaza, Suite 402, Metro City', verified:true },
    { id:'#DOC-8832', name:'Dr. Sarah Jenkins', role:'Pediatric Emergency Care', phone:'+1 (555) 987-6543', address:"Children's General Hospital, ER Wing, Downtown", verified:true },
    { id:'#DOC-7719', name:'Dr. Michael Chen', role:'Cardiovascular Specialist', phone:'+1 (555) 444-3322', address:'Eastside Heart & Wellness, Medical Way', verified:false },
    { id:'#OWN-1102', name:'Linda McGregor', role:'Director, Peak Performance Clinics', phone:'+1 (555) 222-1100', address:'10 Corporate Plaza, Global Heights District', verified:true },
    { id:'#DOC-1122', name:'Dr. James Wilson', role:'Internal Medicine', phone:'+1 (555) 777-8899', address:'Medical Arts Building, Floor 2, Eastside', verified:true },
  ],
  'Ambulance Drivers': [
    { id:'#AMB-1001', name:'Ravi Kumar', role:'Emergency Driver – Level 3', phone:'+1 (555) 111-2222', address:'Central Dispatch, Zone A', verified:true },
    { id:'#AMB-1002', name:'Priya Nair', role:'Critical Response Driver', phone:'+1 (555) 333-4444', address:'Station 7, North Hub', verified:true },
  ],
  'Medical Owners': [
    { id:'#OWN-2001', name:'Metro General Hospital', role:'Regional Medical Center', phone:'+1 (555) 500-0001', address:'1 Health Drive, Metro City', verified:true },
    { id:'#OWN-2002', name:'CurePoint Clinics', role:'Multi-Site Medical Chain', phone:'+1 (555) 500-0002', address:'Various Locations', verified:false },
  ],
};

export default function AdminRoleDirectories() {
  const [tab, setTab] = useState('Doctors');

  return (
    <AdminLayout>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:700, color:'var(--teal-800)' }}>Role-Specific Directories</h1>
        <p style={{ color:'var(--gray-500)', fontSize:13, marginTop:4 }}>Manage and verify medical professionals across the network. All profiles are reviewed against regional medical board standards.</p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:24, background:'var(--gray-100)', padding:4, borderRadius:10, width:'fit-content' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:'8px 18px', borderRadius:7, fontSize:13, fontWeight:500, cursor:'pointer', border:'none',
            background: tab===t ? 'white':'transparent', color: tab===t ? 'var(--gray-900)':'var(--gray-500)',
            boxShadow: tab===t ? 'var(--shadow-sm)':'none', transition:'all 0.15s',
          }}>
            {tab===t ? (t==='Doctors'?'🩺 ':t==='Ambulance Drivers'?'🚑 ':'🏥 ') : ''}{t}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
        {(MOCK[tab]||[]).map((p,i) => (
          <div key={i} style={{ background:'white', borderRadius:14, padding:20, boxShadow:'var(--shadow-sm)', border:'1px solid var(--gray-100)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <div style={{ width:52, height:52, borderRadius:12, background:'var(--teal-50)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ display:'flex', alignItems:'center', gap:5, justifyContent:'flex-end', marginBottom:3 }}>
                  {p.verified
                    ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green-500)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg><span style={{ fontSize:11, fontWeight:700, color:'var(--green-500)' }}>VERIFIED</span></>
                    : <><span style={{ fontSize:11, fontWeight:700, color:'var(--amber-500)' }}>⏳ PENDING REVIEW</span></>
                  }
                </div>
                <div style={{ fontSize:10, color:'var(--gray-400)' }}>ID: {p.id}</div>
              </div>
            </div>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:15, color:'var(--gray-900)' }}>{p.name}</div>
              <div style={{ fontSize:12, color:'var(--teal-700)', fontWeight:500, marginTop:2 }}>{p.role}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, color:'var(--gray-600)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.41 12.22 19.79 19.79 0 0 1 1.34 3.6 2 2 0 0 1 3.31 1.4h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9l-.01.01A16.001 16.001 0 0 0 14.99 16l.75-.75.01-.01a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {p.phone}
              </div>
              <div style={{ display:'flex', alignItems:'flex-start', gap:7, fontSize:12, color:'var(--gray-600)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginTop:2,flexShrink:0}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {p.address}
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button style={{ flex:1, padding:'8px', background:'var(--teal-800)', color:'white', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>View Profile</button>
              <button style={{ width:34, height:34, border:'1px solid var(--gray-200)', borderRadius:7, background:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gray-500)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </button>
            </div>
          </div>
        ))}

        {/* Invite card */}
        <div style={{ border:'2px dashed var(--gray-200)', borderRadius:14, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:28, textAlign:'center', gap:10 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', background:'var(--gray-100)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>+</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:14, fontWeight:600, color:'var(--gray-700)' }}>Invite New Professional</div>
          <div style={{ fontSize:12, color:'var(--gray-400)' }}>Send a secure registration link to a verified medical practitioner.</div>
          <button style={{ padding:'8px 20px', border:'1px solid var(--gray-200)', borderRadius:7, background:'white', fontSize:12, fontWeight:500, cursor:'pointer', color:'var(--gray-700)' }}>Send Invitation</button>
        </div>
      </div>
    </AdminLayout>
  );
}
