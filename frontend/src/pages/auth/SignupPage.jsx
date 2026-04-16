import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { volunteerRegister } from '../../services/api';

const ROLES = ['Doctor','Nurse','Paramedic','Firefighter','Police','Rescue Diver','Logistics','Field Coordinator','Community Anchor','Other'];

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName:'', phone:'', occupation:'', aadharNumber:'', address:'', password:'' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const email = `${form.fullName.toLowerCase().replace(/\s+/g,'.')}@sentinel.org`;
      await volunteerRegister({ ...form, email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  if (success) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--gray-50)' }}>
      <div style={{ background:'white', borderRadius:16, padding:48, textAlign:'center', maxWidth:420, boxShadow:'var(--shadow-lg)' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--green-100)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green-500)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:22, marginBottom:10 }}>Application Submitted!</h2>
        <p style={{ color:'var(--gray-500)', fontSize:14, lineHeight:1.7, marginBottom:28 }}>
          Your volunteer application is under review. An admin will approve your account shortly. You'll be able to login once approved.
        </p>
        <button onClick={() => navigate('/volunteer/login')} style={{ padding:'11px 28px', background:'var(--teal-800)', color:'white', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer' }}>
          Back to Login
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'var(--gray-50)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ display:'flex', width:'100%', maxWidth:960, gap:32, alignItems:'flex-start' }}>
        {/* Left card */}
        <div style={{ width:320, flexShrink:0, background:'linear-gradient(160deg, var(--teal-800) 0%, var(--teal-600) 100%)', borderRadius:20, padding:40, color:'white' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:32 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17 }}>Sentinel</span>
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:30, fontWeight:700, lineHeight:1.2, marginBottom:16 }}>
            Be the guardian your community needs.
          </h1>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:13, lineHeight:1.7, marginBottom:36 }}>
            Join a network of dedicated volunteers providing emergency support, medical aid, and safety coordination across the country. Your skills save lives.
          </p>
          {[
            { icon:'🛡️', title:'Trust & Transparency', desc:'Verified profiles ensure a safe environment for everyone.' },
            { icon:'🤝', title:'Impactful Service', desc:'Directly connect with those in urgent need of your specific expertise.' },
          ].map(f => (
            <div key={f.title} style={{ display:'flex', gap:12, marginBottom:20 }}>
              <div style={{ width:36, height:36, borderRadius:8, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:16 }}>{f.icon}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:3 }}>{f.title}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.65)' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ flex:1, background:'white', borderRadius:20, padding:44, boxShadow:'var(--shadow-md)' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:22, color:'var(--teal-800)', marginBottom:6 }}>Volunteer Application</h2>
          <p style={{ color:'var(--gray-500)', fontSize:13, marginBottom:28 }}>Tell us about yourself to begin your journey as a Sentinel.</p>

          <form onSubmit={submit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input name="fullName" value={form.fullName} onChange={handle} placeholder="John Doe" required style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input name="phone" value={form.phone} onChange={handle} placeholder="+91 00000 00000" required style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
              </div>
              <div>
                <label style={labelStyle}>Occupation</label>
                <select name="occupation" value={form.occupation} onChange={handle} required style={{ ...inputStyle, background:'white' }}>
                  <option value="">Select your role</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Aadhar Number</label>
                <input name="aadharNumber" value={form.aadharNumber} onChange={handle} placeholder="0000 0000 0000" style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
              </div>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={labelStyle}>Profile Photo</label>
              <div style={{ border:'2px dashed var(--gray-200)', borderRadius:10, padding:'28px', textAlign:'center', color:'var(--gray-400)', fontSize:13 }}>
                <div style={{ fontSize:24, marginBottom:8 }}>☁️</div>
                Click to upload or drag and drop<br />
                <span style={{ fontSize:11 }}>PNG, JPG (max. 5MB)</span>
              </div>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={labelStyle}>Full Address</label>
              <textarea name="address" value={form.address} onChange={handle} placeholder="Enter your residential address..." rows={3}
                style={{ ...inputStyle, resize:'vertical', height:80 }} onFocus={focusHandler} onBlur={blurHandler} />
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={labelStyle}>Create Password</label>
              <div style={{ position:'relative' }}>
                <input name="password" type={showPass ? 'text':'password'} value={form.password} onChange={handle} placeholder="••••••••" required minLength={6}
                  style={{ ...inputStyle, paddingRight:38 }} onFocus={focusHandler} onBlur={blurHandler} />
                <button type="button" onClick={() => setShowPass(s=>!s)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', padding:0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            {error && <div style={{ background:'var(--red-100)', color:'var(--red-600)', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:16 }}>{error}</div>}

            <button type="submit" disabled={loading} style={{
              width:'100%', padding:'13px', background:'var(--teal-800)', color:'white', borderRadius:8,
              fontSize:14, fontWeight:600, cursor: loading ? 'not-allowed':'pointer', opacity: loading ? 0.7:1, boxShadow:'var(--shadow-teal)',
            }}>
              {loading ? 'Submitting…' : 'Create My Volunteer Account'}
            </button>
            <p style={{ textAlign:'center', marginTop:14, fontSize:13, color:'var(--gray-500)' }}>
              Already a member?{' '}
              <Link to="/volunteer/login" style={{ color:'var(--teal-700)', fontWeight:600 }}>Log in here</Link>
            </p>
          </form>
        </div>
      </div>
      <div style={{ position:'fixed', bottom:20, left:0, right:0, textAlign:'center', fontSize:12, color:'var(--gray-400)' }}>
        <Link to="#" style={{color:'var(--gray-400)'}}>Privacy Policy</Link> · <Link to="#" style={{color:'var(--gray-400)'}}>Terms of Service</Link> · <Link to="#" style={{color:'var(--gray-400)'}}>Community Guidelines</Link>
        <span style={{marginLeft:24}}>© 2024 Sentinel Network. All rights reserved.</span>
      </div>
    </div>
  );
}

const labelStyle = { fontSize:13, fontWeight:500, color:'var(--gray-700)', display:'block', marginBottom:6 };
const inputStyle = { width:'100%', padding:'10px 14px', border:'1.5px solid var(--gray-200)', borderRadius:8, fontSize:14, outline:'none', color:'var(--gray-800)' };
const focusHandler = (e) => e.target.style.borderColor = 'var(--teal-600)';
const blurHandler = (e) => e.target.style.borderColor = 'var(--gray-200)';
