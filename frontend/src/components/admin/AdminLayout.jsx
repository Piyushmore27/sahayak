import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/admin/dashboard', label: 'Overview', icon: <GridIcon /> },
  { to: '/admin/volunteers', label: 'Volunteers', icon: <PeopleIcon /> },
  { to: '/admin/role-directories', label: 'Role Directories', icon: <FolderIcon /> },
  { to: '/admin/rankings', label: 'Rankings', icon: <ChartIcon /> },
  { to: '/admin/new-accounts', label: 'New Accounts', icon: <PersonAddIcon /> },
];

export default function AdminLayout({ children, title, subtitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--gray-50)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0, background: 'var(--white)', borderRight: '1px solid var(--gray-200)',
        display: 'flex', flexDirection: 'column', padding: '20px 0',
      }}>
        {/* Logo */}
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--gray-100)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--teal-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldIcon color="white" size={18} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--gray-900)' }}>Command Center</div>
              <div style={{ fontSize: 10, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Emergency Response Platform</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
              borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none',
              color: isActive ? 'var(--white)' : 'var(--gray-600)',
              background: isActive ? 'var(--teal-800)' : 'transparent',
              transition: 'all 0.15s',
            })}>
              <span style={{ opacity: 0.9 }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--gray-100)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button onClick={() => {}} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:8, fontSize:14, color:'var(--gray-600)', background:'transparent', width:'100%' }}>
            <SupportIcon /> Support
          </button>
          <button onClick={() => {}} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:8, fontSize:14, color:'var(--gray-600)', background:'transparent', width:'100%' }}>
            <ArchiveIcon /> Archive
          </button>
          <button onClick={() => navigate('/admin/new-accounts')} style={{
            marginTop: 8, padding: '9px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: 'var(--teal-800)', color: 'white', width: '100%', cursor: 'pointer',
          }}>
            Export Report
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <header style={{
          height: 56, background: 'var(--white)', borderBottom: '1px solid var(--gray-200)',
          display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexShrink: 0,
        }}>
          <input placeholder="Search incidents or users..." style={{
            flex: 1, maxWidth: 400, padding: '7px 14px 7px 36px', borderRadius: 8,
            border: '1px solid var(--gray-200)', fontSize: 14, color: 'var(--gray-700)',
            background: `var(--gray-50) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 10px center`,
          }} />
          <div style={{ flex: 1 }} />
          <button style={{ width:36,height:36,borderRadius:8,border:'1px solid var(--gray-200)',background:'var(--white)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <BellIcon />
          </button>
          <button style={{ width:36,height:36,borderRadius:8,border:'1px solid var(--gray-200)',background:'var(--white)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <GearIcon />
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 8px', cursor:'pointer' }} onClick={handleLogout}>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--gray-900)' }}>{user?.name || 'Admin User'}</div>
              <div style={{ fontSize:11, color:'var(--teal-700)', fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>
                {user?.sentinelLevel ? `Sentinel Level ${user.sentinelLevel}` : 'Super Administrator'}
              </div>
            </div>
            <div style={{ width:34,height:34,borderRadius:'50%',background:'var(--teal-100)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden' }}>
              {user?.avatar ? <img src={user.avatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <PersonIcon />}
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
          <div className="page-enter">{children}</div>
        </main>
      </div>
    </div>
  );
}

// ── Icons ────────────────────────────────────────────────────────
function GridIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>; }
function PeopleIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function FolderIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>; }
function ChartIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function PersonAddIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>; }
function ShieldIcon({ color = 'currentColor', size = 16 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function BellIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-600)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function GearIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-600)" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function SupportIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function ArchiveIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>; }
function PersonIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--teal-700)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
