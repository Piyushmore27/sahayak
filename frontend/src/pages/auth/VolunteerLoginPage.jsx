import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function VolunteerLoginPage() {
  const { loginVolunteer } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await loginVolunteer({ username: form.username, password: form.password });
      navigate('/volunteer/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight:'100vh', background:'linear-gradient(135deg, #e8f5f7 0%, #f0fbfc 50%, #e0f5f7 100%)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:24,
    }}>
      <div style={{
        background:'var(--white)', borderRadius:20, boxShadow:'var(--shadow-lg)',
        overflow:'hidden', display:'flex', width:'100%', maxWidth:960,
      }}>
        {/* Left */}
        <div style={{ flex:1, padding:'52px 48px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:36 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal-800)" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, color:'var(--teal-800)' }}>Sentinel</span>
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:36, fontWeight:700, lineHeight:1.15, marginBottom:16, color:'var(--gray-900)' }}>
            A calm presence in{' '}
            <span style={{ color:'var(--teal-700)' }}>times of need.</span>
          </h1>
          <p style={{ color:'var(--gray-500)', fontSize:14, lineHeight:1.7, marginBottom:36, maxWidth:340 }}>
            Access your community safety hub and connect with the support network that watches over you.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24 }}>
            {[
              { icon:'🛡️', title:'Secure Access', desc:'Multi-layered security protocols protect your identity.' },
              { icon:'👥', title:'Community First', desc:'Built by the people, for the people.' },
            ].map(c => (
              <div key={c.title} style={{ background:'var(--gray-50)', borderRadius:10, padding:'14px 16px' }}>
                <div style={{ fontSize:18, marginBottom:6 }}>{c.icon}</div>
                <div style={{ fontSize:13, fontWeight:600, color:'var(--gray-800)', marginBottom:3 }}>{c.title}</div>
                <div style={{ fontSize:12, color:'var(--gray-500)' }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div style={{ width:400, background:'var(--white)', padding:'52px 40px', borderLeft:'1px solid var(--gray-100)' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:700, marginBottom:6 }}>Welcome back</h2>
          <p style={{ color:'var(--gray-500)', fontSize:13, marginBottom:28 }}>Please enter your details to sign in.</p>

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:500, color:'var(--gray-700)', display:'block', marginBottom:6 }}>Username or Phone Number</label>
              <div style={{ position:'relative' }}>
                <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input name="username" value={form.username} onChange={handle} placeholder="e.g. johndoe or +1 234..." required
                  style={{ width:'100%', padding:'10px 14px 10px 36px', border:'1.5px solid var(--gray-200)', borderRadius:8, fontSize:14, outline:'none' }}
                  onFocus={e => e.target.style.borderColor='var(--teal-600)'}
                  onBlur={e => e.target.style.borderColor='var(--gray-200)'}
                />
              </div>
            </div>
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <label style={{ fontSize:13, fontWeight:500, color:'var(--gray-700)' }}>Password</label>
                <a href="#" style={{ fontSize:12, color:'var(--teal-700)' }}>Forgot Password?</a>
              </div>
              <div style={{ position:'relative' }}>
                <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handle} placeholder="••••••••" required
                  style={{ width:'100%', padding:'10px 36px', border:'1.5px solid var(--gray-200)', borderRadius:8, fontSize:14, outline:'none' }}
                  onFocus={e => e.target.style.borderColor='var(--teal-600)'}
                  onBlur={e => e.target.style.borderColor='var(--gray-200)'}
                />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', padding:0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>
            <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--gray-600)', cursor:'pointer' }}>
              <input type="checkbox" name="remember" checked={form.remember} onChange={handle} style={{ width:14, height:14, accentColor:'var(--teal-700)' }} />
              Keep me signed in on this device
            </label>

            {error && <div style={{ background:'var(--red-100)', color:'var(--red-600)', padding:'10px 14px', borderRadius:8, fontSize:13 }}>{error}</div>}

            <button type="submit" disabled={loading} style={{
              padding:'12px', background:'var(--teal-800)', color:'white', borderRadius:8,
              fontSize:14, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow:'var(--shadow-teal)',
            }}>
              {loading ? 'Signing in…' : 'Login →'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:20, fontSize:13, color:'var(--gray-500)' }}>
            New here?{' '}
            <Link to="/volunteer/signup" style={{ color:'var(--teal-700)', fontWeight:600 }}>Join the community</Link>
          </p>
          <p style={{ textAlign:'center', marginTop:12, fontSize:12, color:'var(--gray-400)' }}>
            <Link to="/" style={{ color:'var(--teal-700)' }}>← Back to Selection</Link>
            {' · '}
            <Link to="/admin/login" style={{ color:'var(--gray-500)' }}>Admin Portal</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
