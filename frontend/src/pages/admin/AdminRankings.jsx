import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getRankings } from '../../services/api';

const MOCK_TOP = [
  { fullName:'David Chen', badge:'Lifesaver Elite', appreciationPoints:18942, missionsCompleted:142, rank:1 },
  { fullName:'Sarah Miller', badge:'Rapid Responder', appreciationPoints:14205, missionsCompleted:110, rank:2 },
  { fullName:'Elena Rodriguez', badge:'First Contact', appreciationPoints:12110, missionsCompleted:98, rank:3 },
];
const MOCK_REST = [
  { fullName:'Marcus Thorne', badge:'Rapid Responder', appreciationPoints:10845, missionsCompleted:92, rank:4, joined:'Oct 2023' },
  { fullName:'Aisha Khan', badge:'Lifesaver', appreciationPoints:9920, missionsCompleted:78, rank:5, joined:'Jan 2024' },
  { fullName:'James Wilson', badge:'Crisis Expert', appreciationPoints:8442, missionsCompleted:64, rank:6, joined:'Aug 2023' },
  { fullName:'Linda Wu', badge:'Community Anchor', appreciationPoints:7110, missionsCompleted:59, rank:7, joined:'Dec 2023' },
];

const BADGE_COLORS = { 'Lifesaver Elite':'var(--amber-400)', 'Rapid Responder':'var(--teal-600)', 'First Contact':'var(--red-500)', 'Crisis Expert':'var(--amber-500)', 'Community Anchor':'var(--teal-400)', 'Lifesaver':'var(--teal-500)' };

export default function AdminRankings() {
  const [period, setPeriod] = useState('all');
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    getRankings({ period }).then(r => setRankings(r.data.data)).catch(() => setRankings([]));
  }, [period]);

  const top3 = rankings.length >= 3 ? rankings.slice(0,3).map((r,i) => ({...r, rank:i+1})) : MOCK_TOP;
  const rest = rankings.length > 3 ? rankings.slice(3).map((r,i) => ({...r, rank:i+4})) : MOCK_REST;

  return (
    <AdminLayout>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:700, color:'var(--teal-800)' }}>Volunteer Leaderboard</h1>
        <p style={{ color:'var(--gray-500)', fontSize:13, marginTop:4, maxWidth:560 }}>
          Recognizing the extraordinary contributions of our community guardians. Rankings are calculated based on successful missions and peer appreciation points.
        </p>
      </div>

      {/* Top 3 podium */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.15fr 1fr', gap:16, marginBottom:32, alignItems:'flex-end' }}>
        {/* 2nd */}
        <PodiumCard v={top3[1]} highlight={false} />
        {/* 1st */}
        <PodiumCard v={top3[0]} highlight />
        {/* 3rd */}
        <PodiumCard v={top3[2]} highlight={false} />
      </div>

      {/* Table */}
      <div style={{ background:'white', borderRadius:14, boxShadow:'var(--shadow-sm)', overflow:'hidden' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', borderBottom:'1px solid var(--gray-100)' }}>
          <span style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:15 }}>Global Rankings</span>
          <div style={{ display:'flex', gap:6 }}>
            {['This Month','All Time'].map(p => (
              <button key={p} onClick={() => setPeriod(p==='This Month'?'month':'all')} style={{
                padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, cursor:'pointer', border:'none',
                background: (p==='All Time'&&period==='all')||(p==='This Month'&&period==='month') ? 'var(--teal-800)':'var(--gray-100)',
                color: (p==='All Time'&&period==='all')||(p==='This Month'&&period==='month') ? 'white':'var(--gray-600)',
              }}>{p}</button>
            ))}
          </div>
        </div>
        {rest.map((v,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', padding:'14px 20px', borderBottom:'1px solid var(--gray-50)', gap:16 }}>
            <span style={{ width:24, fontSize:13, fontWeight:700, color:'var(--gray-400)', textAlign:'center' }}>{v.rank}</span>
            <div style={{ width:36, height:36, borderRadius:10, background:'var(--teal-50)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--teal-600)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--gray-900)' }}>{v.fullName}</div>
              <div style={{ fontSize:11, color:'var(--gray-400)' }}>Joined {v.joined || 'Jan 2024'}</div>
            </div>
            <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background: BADGE_COLORS[v.badge]+'20', color: BADGE_COLORS[v.badge] || 'var(--gray-500)' }}>
              🏅 {v.badge}
            </span>
            <div style={{ textAlign:'right', minWidth:70 }}>
              <div style={{ fontSize:14, fontWeight:700, color:'var(--teal-700)' }}>{v.appreciationPoints?.toLocaleString()}</div>
              <div style={{ fontSize:10, color:'var(--gray-400)', textTransform:'uppercase' }}>Points</div>
            </div>
            <div style={{ textAlign:'right', minWidth:50 }}>
              <div style={{ fontSize:14, fontWeight:700, color:'var(--gray-700)' }}>{v.missionsCompleted}</div>
              <div style={{ fontSize:10, color:'var(--gray-400)', textTransform:'uppercase' }}>Missions</div>
            </div>
          </div>
        ))}
        <div style={{ padding:'12px 20px', fontSize:12, color:'var(--gray-400)', borderTop:'1px solid var(--gray-100)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span>Showing top 50 of 1,284 volunteers</span>
          <div style={{ display:'flex', gap:4 }}>
            {[1,2,3].map(n => <button key={n} style={{ width:28, height:28, borderRadius:6, border:'1px solid var(--gray-200)', background: n===1?'var(--teal-800)':'white', color: n===1?'white':'var(--gray-600)', fontSize:12, cursor:'pointer' }}>{n}</button>)}
            <button style={{ width:28, height:28, borderRadius:6, border:'1px solid var(--gray-200)', background:'white', color:'var(--gray-600)', fontSize:12, cursor:'pointer' }}>›</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function PodiumCard({ v, highlight }) {
  if (!v) return null;
  const badgeColor = BADGE_COLORS[v.badge] || 'var(--teal-600)';
  return (
    <div style={{
      background: highlight ? 'var(--teal-800)' : 'white',
      borderRadius: 16, padding: highlight ? '28px 24px' : '22px 20px',
      boxShadow: highlight ? 'var(--shadow-teal)' : 'var(--shadow-sm)',
      textAlign: 'center', position: 'relative',
      border: highlight ? 'none' : '1px solid var(--gray-100)',
      marginBottom: highlight ? 0 : 12,
    }}>
      <div style={{ fontSize: highlight ? 48 : 36, position:'absolute', top:-16, left:'50%', transform:'translateX(-50%)', opacity:0.1, fontFamily:'var(--font-display)', fontWeight:700, color: highlight?'white':'var(--gray-400)' }}>{v.rank}</div>
      <div style={{ width: highlight?68:54, height: highlight?68:54, borderRadius:'50%', background: highlight?'rgba(255,255,255,0.15)':'var(--teal-50)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', border: highlight?'3px solid rgba(255,255,255,0.3)':'3px solid var(--teal-100)', position:'relative' }}>
        <svg width={highlight?28:22} height={highlight?28:22} viewBox="0 0 24 24" fill="none" stroke={highlight?'white':'var(--teal-600)'} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        {v.rank <= 3 && <div style={{ position:'absolute', bottom:-4, right:-4, width:20, height:20, borderRadius:'50%', background:v.rank===1?'var(--amber-400)':v.rank===2?'var(--gray-400)':'#cd7f32', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:8, color:'white', fontWeight:700 }}>{v.rank}</span>
        </div>}
      </div>
      <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:highlight?18:15, color: highlight?'white':'var(--gray-900)', marginBottom:4 }}>{v.fullName}</div>
      <div style={{ fontSize:12, fontWeight:600, color: highlight?'rgba(255,255,255,0.8)':badgeColor, marginBottom:12 }}>{v.badge}</div>
      <div style={{ background: highlight?'rgba(0,0,0,0.2)':'var(--teal-50)', borderRadius:10, padding:'10px 14px' }}>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:highlight?24:20, color: highlight?'white':'var(--teal-700)' }}>
          {v.appreciationPoints?.toLocaleString()}
        </div>
        <div style={{ fontSize:10, color: highlight?'rgba(255,255,255,0.6)':'var(--gray-400)', textTransform:'uppercase', letterSpacing:0.5 }}>
          Points{v.missionsCompleted ? ` • ${v.missionsCompleted} Missions` : ''}
        </div>
      </div>
    </div>
  );
}
