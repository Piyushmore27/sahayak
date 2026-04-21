import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getPendingVolunteers, approveVolunteer, rejectVolunteer, getIncidents } from '../../services/api';

const MOCK_PENDING = [
  { _id:'1', fullName:'Julian DeRosa', occupation:'Certified EMT-B • 4y exp.' },
  { _id:'2', fullName:'Sarah Mitchell', occupation:'Search & Rescue Diver' },
  { _id:'3', fullName:'Arnav Kapoor', occupation:'Logistics Coordinator' },
];

const MOCK_INCIDENTS = [
  { _id:'i1', title:'Highway 101 Pileup near KM 42', type:'Traffic Accident', priority:'Urgent', createdAt: new Date(Date.now()-30*60000), respondersCount:4 },
  { _id:'i2', title:'Power Outage: Sector 7 Industrial', type:'Urban Infrastructure', priority:'Monitor', description:'Widespread grid failure reported. Requires liaison with municipal utility teams for site security.', createdAt: new Date(Date.now()-75*60000) },
  { _id:'i3', title:'Brush Fire Spotted: Redwood Trail', type:'Wildfire Alert', priority:'High Priority', createdAt: new Date(Date.now()-90*60000) },
];

const PRIORITY_STYLES = {
  'Urgent': { color:'var(--red-600)', bg:'var(--red-100)', border:'var(--red-500)' },
  'High Priority': { color:'var(--amber-500)', bg:'var(--amber-100)', border:'var(--amber-400)' },
  'Monitor': { color:'var(--teal-700)', bg:'var(--teal-50)', border:'var(--teal-400)' },
  'Critical': { color:'var(--red-600)', bg:'var(--red-100)', border:'var(--red-500)' },
};

export default function AdminNewAccounts() {
  const [pending, setPending] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    getPendingVolunteers().then(r => setPending(r.data.data)).catch(() => setPending(MOCK_PENDING));
    getIncidents({ status: 'active' }).then(r => setIncidents(r.data.data.incidents || [])).catch(() => setIncidents(MOCK_INCIDENTS));
  }, []);

  const handle = async (id, action) => {
    setProcessing(p => ({ ...p, [id]: action }));
    try {
      if (action === 'approve') await approveVolunteer(id);
      else await rejectVolunteer(id);
      setPending(p => p.filter(v => v._id !== id));
    } catch (err){
      console.log(err);
    }
    setProcessing(p => { const n={...p}; delete n[id]; return n; });
  };

  const fmt = (d) => {
    const mins = Math.floor((Date.now() - new Date(d)) / 60000);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins/60)}h ago`;
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:700 }}>Command Dispatch</h1>
        <p style={{ color:'var(--gray-500)', fontSize:13, marginTop:4 }}>Real-time emergency monitoring and volunteer onboarding. Action required for pending alerts and registrations.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:24 }}>
        {/* Left: incidents */}
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--red-500)', animation:'pulse 1.5s infinite' }} />
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17 }}>Active Incidents</span>
            <span style={{ background:'var(--red-500)', color:'white', fontSize:11, fontWeight:700, padding:'2px 10px', borderRadius:20 }}>3 Critical</span>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {(incidents.length ? incidents : MOCK_INCIDENTS).map((inc) => {
              const style = PRIORITY_STYLES[inc.priority] || PRIORITY_STYLES['Monitor'];
              return (
                <div key={inc._id} style={{ background:'white', borderRadius:12, padding:20, boxShadow:'var(--shadow-sm)', borderLeft:`3px solid ${style.border}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, color: style.color, textTransform:'uppercase', letterSpacing:0.5, marginBottom:4 }}>
                        {inc.type} • {inc.priority}
                      </div>
                      <div style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700, color:'var(--gray-900)' }}>{inc.title}</div>
                    </div>
                    <span style={{ fontSize:12, color:'var(--gray-400)' }}>{fmt(inc.createdAt)}</span>
                  </div>
                  {inc.description && <p style={{ fontSize:13, color:'var(--gray-500)', marginBottom:12, lineHeight:1.6 }}>{inc.description}</p>}
                  {inc.respondersCount > 0 && (
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                      <div style={{ display:'flex', gap:-4 }}>
                        {[...Array(Math.min(inc.respondersCount,3))].map((_,i) => (
                          <div key={i} style={{ width:24, height:24, borderRadius:'50%', background:['var(--teal-400)','var(--teal-600)','var(--teal-800)'][i], border:'2px solid white', marginLeft: i>0?-8:0 }} />
                        ))}
                        {inc.respondersCount > 3 && <div style={{ width:24, height:24, borderRadius:'50%', background:'var(--gray-200)', border:'2px solid white', marginLeft:-8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700 }}>+{inc.respondersCount-3}</div>}
                      </div>
                      <span style={{ fontSize:12, color:'var(--gray-500)' }}>{inc.respondersCount} Responders dispatched</span>
                    </div>
                  )}
                  <div style={{ display:'flex', gap:10 }}>
                    <button style={{ flex:1, padding:'10px', background:'var(--teal-800)', color:'white', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      Assign Volunteers
                    </button>
                    <button style={{ padding:'10px 18px', border:'1px solid var(--gray-200)', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer', background:'white', color:'var(--gray-700)' }}>
                      {inc.type === 'Wildfire Alert' ? 'Initiate Evacuation Protocol' : 'Details'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: new accounts */}
        <div>
          <div style={{ background:'white', borderRadius:12, boxShadow:'var(--shadow-sm)', overflow:'hidden' }}>
            <div style={{ padding:'16px 18px', borderBottom:'1px solid var(--gray-100)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15 }}>New Account Requests</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>

            {(pending.length ? pending : MOCK_PENDING).map((v) => (
              <div key={v._id} style={{ padding:'14px 18px', borderBottom:'1px solid var(--gray-50)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div style={{ display:'flex', gap:10 }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:'var(--teal-50)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'var(--gray-900)' }}>{v.fullName}</div>
                      <div style={{ fontSize:11, color:'var(--gray-400)' }}>{v.occupation}</div>
                    </div>
                  </div>
                  <button style={{ background:'none', padding:2, cursor:'pointer' }}>⋮</button>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => handle(v._id, 'approve')} disabled={!!processing[v._id]} style={{ flex:1, padding:'8px', background:'var(--teal-800)', color:'white', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer', opacity: processing[v._id]?0.6:1 }}>
                    {processing[v._id]==='approve' ? '…' : 'Approve'}
                  </button>
                  <button onClick={() => handle(v._id, 'reject')} disabled={!!processing[v._id]} style={{ flex:1, padding:'8px', border:'1px solid var(--gray-200)', borderRadius:7, fontSize:12, fontWeight:500, cursor:'pointer', background:'white', color:'var(--gray-600)' }}>
                    {processing[v._id]==='reject' ? '…' : 'Reject'}
                  </button>
                </div>
              </div>
            ))}

            <div style={{ padding:'14px 18px', background:'var(--teal-50)' }}>
              <div style={{ display:'flex', gap:8, marginBottom:6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--teal-700)" strokeWidth="2" style={{marginTop:2,flexShrink:0}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{ fontSize:12, fontWeight:600, color:'var(--teal-800)' }}>Background Checks</span>
              </div>
              <p style={{ fontSize:11, color:'var(--teal-700)', lineHeight:1.6 }}>All new registrants are cross-referenced with national databases. Blue checks indicate pre-verified credentials.</p>
              <button style={{ marginTop:8, fontSize:12, color:'var(--teal-700)', fontWeight:600, background:'none', padding:0, cursor:'pointer' }}>Manage Verification API ›</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
