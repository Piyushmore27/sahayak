import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VolunteerLayout from '../../components/volunteer/VolunteerLayout';
import { useAuth } from '../../context/AuthContext';

export default function VolunteerSettings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [theme] = useState('Light');
  const [lang] = useState('English (IN)');
  const [showLockdown, setShowLockdown] = useState(false);

  return (
    <VolunteerLayout activeTab="Settings">
      {/* Top nav (as shown in design) */}
      <div style={{ display:'flex', borderBottom:'1px solid var(--gray-200)', padding:'0 24px', background:'white' }}>
        {['Home','Volunteers','Resources','Settings'].map(t => (
          <button key={t} onClick={() => t!=='Settings' && navigate(t==='Home'?'/volunteer/home':'/volunteer/'+t.toLowerCase())} style={{
            padding:'14px 16px', fontSize:13, fontWeight: t==='Settings'?600:400, border:'none', background:'none', cursor:'pointer',
            color: t==='Settings'?'var(--teal-700)':'var(--gray-500)', borderBottom: t==='Settings'?'2px solid var(--teal-700)':'2px solid transparent',
            marginBottom:-1,
          }}>
            {t}
          </button>
        ))}
        <div style={{ flex:1 }} />
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <button style={{ padding:6, border:'none', background:'none', cursor:'pointer' }}>🔔</button>
          <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--teal-800)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
        </div>
      </div>

      <div style={{ padding:'32px 32px', maxWidth:900 }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:700, marginBottom:4 }}>Settings</h1>
        <p style={{ color:'var(--gray-500)', fontSize:13, marginBottom:28 }}>Manage your preferences and organization profile.</p>

        {/* Profile + Basic Settings */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:20, marginBottom:20 }}>
          {/* User profile */}
          <div style={{ background:'white', borderRadius:14, padding:24, boxShadow:'var(--shadow-sm)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <span style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:16, color:'var(--teal-700)' }}>User Profile</span>
              <button style={{ fontSize:13, color:'var(--teal-700)', fontWeight:500, background:'none', padding:0, cursor:'pointer' }}>Edit Profile</button>
            </div>
            <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>
              <div style={{ position:'relative' }}>
                <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--teal-100)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--teal-700)" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <button style={{ position:'absolute', bottom:0, right:0, width:22, height:22, borderRadius:'50%', background:'var(--teal-600)', border:'2px solid white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                </button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px 40px', flex:1 }}>
                {[
                  { label:'FULL NAME', value: user?.fullName || 'Arjun Varma' },
                  { label:'EMAIL ADDRESS', value: user?.email || 'arjun.v@sahayak.org' },
                  { label:'PHONE NUMBER', value: user?.phone || '+91 98765 43210' },
                  { label:'EMERGENCY ROLE', value: user?.emergencyRole || 'Field Coordinator' },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize:10, fontWeight:600, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:0.8, marginBottom:3 }}>{f.label}</div>
                    <div style={{ fontSize:13, fontWeight:500, color:'var(--gray-800)' }}>{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Basic settings */}
          <div style={{ background:'white', borderRadius:14, padding:24, boxShadow:'var(--shadow-sm)' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:16, color:'var(--teal-700)', marginBottom:18 }}>Basic Settings</div>
            {[
              { icon:'🔔', label:'Notifications', value: notifications, toggle: true, onToggle: () => setNotifications(n=>!n) },
              { icon:'🌙', label:'Theme', value: theme },
              { icon:'🌐', label:'Language', value: lang },
            ].map(s => (
              <div key={s.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'var(--gray-50)', borderRadius:10, marginBottom:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span>{s.icon}</span>
                  <span style={{ fontSize:13, fontWeight:500, color:'var(--gray-700)' }}>{s.label}</span>
                </div>
                {s.toggle ? (
                  <div onClick={s.onToggle} style={{ width:40, height:22, borderRadius:11, background: s.value?'var(--teal-600)':'var(--gray-300)', cursor:'pointer', position:'relative', transition:'background 0.2s' }}>
                    <div style={{ width:18, height:18, borderRadius:'50%', background:'white', position:'absolute', top:2, left: s.value?20:2, transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }} />
                  </div>
                ) : (
                  <span style={{ fontSize:12, color:'var(--gray-500)' }}>{s.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* App Info */}
        <div style={{ background:'white', borderRadius:14, padding:24, boxShadow:'var(--shadow-sm)', marginBottom:20 }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:16, color:'var(--teal-700)', marginBottom:18 }}>Application Info</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:24 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                <span style={{ fontSize:12 }}>ℹ️</span>
                <span style={{ fontSize:13, fontWeight:600, color:'var(--gray-800)' }}>Version Control</span>
              </div>
              <div style={{ fontSize:12, color:'var(--gray-500)', lineHeight:1.6 }}>
                Current Version: <span style={{ color:'var(--teal-700)', fontWeight:600 }}>v2.4.1-stable</span><br/>
                Last Check: 2 hours ago. Your application is up to date with the latest security patches.
              </div>
            </div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                <span style={{ fontSize:12 }}>⚖️</span>
                <span style={{ fontSize:13, fontWeight:600, color:'var(--gray-800)' }}>Legal & Policy</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {['Terms of Service','Data Usage Policy','Privacy Commitment'].map(l => (
                  <a key={l} href="#" style={{ fontSize:12, color:'var(--teal-700)' }}>{l}</a>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                <span style={{ fontSize:12 }}>🎧</span>
                <span style={{ fontSize:13, fontWeight:600, color:'var(--gray-800)' }}>Support & Feedback</span>
              </div>
              <div style={{ fontSize:12, color:'var(--gray-500)', lineHeight:1.6, marginBottom:8 }}>
                Encountering issues? Our emergency tech team is available 24/7.
              </div>
              <a href="#" style={{ fontSize:12, fontWeight:700, color:'var(--amber-500)', textTransform:'uppercase', letterSpacing:0.5 }}>Contact Support</a>
            </div>
          </div>
        </div>

        {/* Security Lockdown */}
        <div style={{ background:'var(--teal-800)', borderRadius:14, padding:'24px 28px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ maxWidth:560 }}>
            <div style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, color:'white', marginBottom:8 }}>Security Lockdown Mode</div>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.75)', lineHeight:1.7 }}>
              In case of immediate physical threat or device compromise, activate Lockdown Mode. This will instantly wipe local cached data and alert the Sahayak central command of your coordinates.
            </p>
          </div>
          <button onClick={() => setShowLockdown(true)} style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 24px', background:'var(--red-600)', color:'white', border:'none', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer', flexShrink:0, letterSpacing:0.5, textTransform:'uppercase' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Activate Lockdown
          </button>
        </div>
      </div>

      {/* Lockdown confirm modal */}
      {showLockdown && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <div style={{ background:'white', borderRadius:16, padding:32, maxWidth:400, textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:16 }}>🔒</div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:18, marginBottom:8 }}>Confirm Security Lockdown?</h3>
            <p style={{ fontSize:13, color:'var(--gray-500)', marginBottom:24 }}>This will wipe all local data and alert command of your location. This action cannot be undone.</p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setShowLockdown(false)} style={{ flex:1, padding:'11px', border:'1px solid var(--gray-200)', borderRadius:8, fontSize:14, cursor:'pointer', background:'white' }}>Cancel</button>
              <button style={{ flex:1, padding:'11px', background:'var(--red-600)', color:'white', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer' }}>Confirm Lockdown</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding:'16px 32px', borderTop:'1px solid var(--gray-100)', fontSize:12, color:'var(--gray-400)', display:'flex', justifyContent:'space-between' }}>
        <span>© 2024 Sahayak Emergency Response. Built for community resilience.</span>
        <div style={{ display:'flex', gap:16 }}>
          {['Privacy Policy','Terms of Service','Contact Support'].map(l => <a key={l} href="#" style={{ color:'var(--gray-400)' }}>{l}</a>)}
        </div>
      </div>
    </VolunteerLayout>
  );
}
