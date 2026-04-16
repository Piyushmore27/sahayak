import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to:'/volunteer/home', label:'Map', icon:<MapIcon /> },
  { to:'/volunteer/volunteers', label:'Volunteers', icon:<PeopleIcon /> },
  { to:'/volunteer/resources', label:'Resources', icon:<PlusIcon /> },
  { to:'/volunteer/settings', label:'Settings', icon:<GearIcon /> },
];

export default function VolunteerLayout({ children, activeTab }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/volunteer/login'); };

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--gray-50)' }}>
      {/* Sidebar */}
      <aside style={{ width:220, flexShrink:0, background:'var(--white)', borderRight:'1px solid var(--gray-100)', display:'flex', flexDirection:'column', padding:'20px 0' }}>
        {/* Brand */}
        <div style={{ padding:'0 20px 20px', borderBottom:'1px solid var(--gray-100)' }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, color:'var(--teal-700)' }}>Sahayak</div>
          <div style={{ fontSize:11, color:'var(--gray-400)' }}>Community Aid</div>
        </div>

        {/* Top nav (horizontal in designs) */}
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--gray-50)' }}>
          <div style={{ display:'flex', gap:6 }}>
            {['Map','Volunteers','Resources'].map(t => (
              <button key={t} style={{ padding:'5px 10px', borderRadius:6, fontSize:12, border:'none', cursor:'pointer', background: activeTab===t?'transparent':'transparent', color: activeTab===t?'var(--teal-700)':'var(--gray-400)', fontWeight: activeTab===t?600:400, borderBottom: activeTab===t?'2px solid var(--teal-700)':'2px solid transparent' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* User */}
        <div style={{ padding:'16px 20px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
            <div style={{ width:38, height:38, borderRadius:'50%', background:'var(--teal-800)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--gray-900)' }}>Volunteer Portal</div>
              <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--green-500)' }} />
                <span style={{ fontSize:10, fontWeight:600, color:'var(--teal-600)', textTransform:'uppercase', letterSpacing:0.5 }}>Active Duty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'0 12px', display:'flex', flexDirection:'column', gap:2 }}>
          {NAV.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:8,
              fontSize:14, fontWeight:500, textDecoration:'none',
              color: isActive ? 'var(--teal-800)':'var(--gray-600)',
              background: isActive ? 'var(--teal-50)':'transparent',
            })}>
              {icon} {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding:'12px' }}>
          <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderRadius:8, fontSize:13, color:'var(--red-500)', background:'var(--red-100)', width:'100%', cursor:'pointer', fontWeight:500 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex:1, overflow:'auto' }} className="page-enter">{children}</main>
    </div>
  );
}

function MapIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>; }
function PeopleIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function PlusIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 2H5a2 2 0 0 0-2 2v4"/><path d="M15 2h4a2 2 0 0 1 2 2v4"/><path d="M9 22H5a2 2 0 0 1-2-2v-4"/><path d="M15 22h4a2 2 0 0 0 2-2v-4"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>; }
function GearIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
