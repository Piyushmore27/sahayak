import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await loginAdmin({ email: form.email, adminId: form.email, password: form.password });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display:'flex', height:'100vh', fontFamily:'var(--font-body)' }}>
      {/* Left panel */}
      <div style={{
        flex: 1, background: 'linear-gradient(135deg, #0a3d42 0%, #0e6b73 50%, #177a82 100%)',
        display:'flex', flexDirection:'column', justifyContent:'center', padding:'60px',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:48 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:22, color:'white' }}>Sahayak Sentinel</span>
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:42, fontWeight:700, color:'white', lineHeight:1.15, marginBottom:20 }}>
            Empowering those<br />who protect.
          </h1>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:15, lineHeight:1.7, maxWidth:420, marginBottom:48 }}>
            Access the unified command dashboard to coordinate emergency response, monitor real-time community safety alerts, and manage sentinel assets across the metropolitan grid.
          </p>
          <div style={{ display:'flex', gap:48 }}>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:700, color:'var(--amber-400)' }}>12.4s</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:1, marginTop:4 }}>Avg Response Time</div>
            </div>
            <div style={{ borderLeft:'1px solid rgba(255,255,255,0.2)', paddingLeft:48 }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:32, fontWeight:700, color:'var(--amber-400)' }}>24/7</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)', textTransform:'uppercase', letterSpacing:1, marginTop:4 }}>Active Vigilance</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width:480, background:'var(--white)', display:'flex', flexDirection:'column', justifyContent:'center', padding:'60px 48px' }}>
        <div style={{ marginBottom:32 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'var(--amber-400)', color:'white', padding:'4px 12px', borderRadius:20, fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:20 }}>
            🔒 Secure Access
          </div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:30, fontWeight:700, color:'var(--gray-900)', marginBottom:8 }}>Command Center Login</h2>
          <p style={{ color:'var(--gray-500)', fontSize:14 }}>Authorized Personnel Only. Please verify your credentials to continue.</p>
        </div>

        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:'var(--gray-800)', display:'block', marginBottom:6 }}>Administrator ID or Email</label>
            <div style={{ position:'relative' }}>
              <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input name="email" value={form.email} onChange={handle} placeholder="e.g. ADM-99234" required
                style={{ width:'100%', padding:'11px 14px 11px 38px', border:'1.5px solid var(--gray-200)', borderRadius:8, fontSize:14, outline:'none', transition:'border 0.2s', color:'var(--gray-800)' }}
                onFocus={e => e.target.style.borderColor='var(--teal-600)'}
                onBlur={e => e.target.style.borderColor='var(--gray-200)'}
              />
            </div>
          </div>
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <label style={{ fontSize:13, fontWeight:600, color:'var(--gray-800)' }}>Secure Password</label>
              <a href="#" style={{ fontSize:12, color:'var(--teal-700)', fontWeight:500 }}>Forgot Access Credentials?</a>
            </div>
            <div style={{ position:'relative' }}>
              <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
              <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handle} placeholder="••••••••••••" required
                style={{ width:'100%', padding:'11px 40px 11px 38px', border:'1.5px solid var(--gray-200)', borderRadius:8, fontSize:14, outline:'none', transition:'border 0.2s', color:'var(--gray-800)' }}
                onFocus={e => e.target.style.borderColor='var(--teal-600)'}
                onBlur={e => e.target.style.borderColor='var(--gray-200)'}
              />
              <button type="button" onClick={() => setShowPass(s => !s)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', padding:0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>

          {error && <div style={{ background:'var(--red-100)', color:'var(--red-600)', padding:'10px 14px', borderRadius:8, fontSize:13 }}>{error}</div>}

          <button type="submit" disabled={loading} style={{
            padding:'13px', background:'var(--teal-800)', color:'white', borderRadius:8,
            fontSize:15, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop:4,
            boxShadow:'var(--shadow-teal)', transition:'all 0.2s',
          }}>
            {loading ? 'Authenticating…' : <>Access Command Center →</>}
          </button>
        </form>

        {/* MFA note */}
        <div style={{ marginTop:28, background:'var(--gray-50)', borderRadius:10, padding:'14px 16px', display:'flex', gap:12 }}>
          <div style={{ width:20, height:20, borderRadius:4, background:'var(--amber-400)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--gray-800)', marginBottom:3 }}>Multi-Factor Authentication</div>
            <div style={{ fontSize:12, color:'var(--gray-500)' }}>Successful login will require secondary verification via your Sahayak hardware token or registered mobile device.</div>
          </div>
        </div>

        <div style={{ marginTop:24, textAlign:'center', fontSize:12, color:'var(--gray-400)' }}>
          <Link to="/" style={{ color:'var(--teal-700)' }}>← Back to Selection</Link>
          {' · '}
          <Link to="/volunteer/login" style={{ color:'var(--teal-700)' }}>Volunteer Login</Link>
        </div>
        <div style={{ marginTop:20, fontSize:11, color:'var(--gray-400)', textAlign:'center' }}>
          © 2024 SAHAYAK SENTINEL. AUTHORIZED PERSONNEL ONLY.
        </div>
      </div>
    </div>
  );
}
