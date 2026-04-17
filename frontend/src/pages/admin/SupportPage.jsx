import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function SupportPage() {
  return (
    <AdminLayout>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--gray-900)' }}>Support Center</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 4 }}>Get help, report issues, or contact the Sahayak Sentinel operations team.</p>
        </div>

        {/* Quick help cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { icon: '📖', title: 'Documentation', desc: 'Browse guides and platform manuals.', btn: 'View Docs', action: () => alert('Opening Documentation...') },
            { icon: '🐛', title: 'Report an Issue', desc: 'Found a bug? Let us know so we can fix it.', btn: 'Report Bug', action: () => alert('Redirecting to Bug Report form...') },
            { icon: '💬', title: 'Live Chat', desc: 'Chat with our operations support team.', btn: 'Start Chat', action: () => alert('Connecting to Live Support...') },
          ].map(c => (
            <div key={c.title} style={{ background: 'white', borderRadius: 14, padding: 24, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 30 }}>{c.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--gray-900)' }}>{c.title}</div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)', flex: 1 }}>{c.desc}</div>
              <button 
                onClick={c.action}
                style={{ padding: '9px 18px', background: 'var(--teal-800)', color: 'white', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>{c.btn}</button>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <form 
          onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully! Our team will contact you soon.'); }}
          style={{ background: 'white', borderRadius: 14, padding: 28, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)', marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 20 }}>Send a Message</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={lbl}>Your Name</label>
              <input required placeholder="Full name" style={inp} />
            </div>
            <div>
              <label style={lbl}>Email</label>
              <input required type="email" placeholder="your@email.com" style={inp} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Subject</label>
            <select required style={inp}>
              <option value="">Select a topic...</option>
              <option>Technical Issue</option>
              <option>Account Help</option>
              <option>Feature Request</option>
              <option>Emergency Escalation</option>
              <option>Other</option>
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Message</label>
            <textarea required placeholder="Describe your issue or question in detail..." rows={5}
              style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
          </div>
          <button type="submit" style={{ padding: '11px 28px', background: 'var(--teal-800)', color: 'white', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Submit Request
          </button>
        </form>

        {/* FAQ */}
        <div style={{ background: 'white', borderRadius: 14, padding: 28, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 20 }}>Frequently Asked Questions</div>
          {[
            { q: 'How do I approve a pending volunteer?', a: 'Go to New Accounts → Pending, then click Approve on the volunteer card.' },
            { q: 'How do I assign volunteers to an incident?', a: 'On the Dashboard, click "Deploy Incident Response" and choose volunteers from the directory.' },
            { q: 'Can I export volunteer data?', a: 'Yes. Use the "Export Report" button in the sidebar to download a CSV of active volunteers.' },
            { q: 'What does Sentinel Level mean?', a: 'Sentinel Level is an admin hierarchy indicator from 1–10. Level 10 is Super Administrator.' },
          ].map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: 14, marginBottom: 14 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
        background: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, gap: 12
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{q}</span>
        <span style={{ fontSize: 18, color: 'var(--teal-600)', flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
      </button>
      {open && <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 10, lineHeight: 1.7 }}>{a}</p>}
    </div>
  );
}

const lbl = { fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 5 };
const inp = { width: '100%', padding: '9px 12px', border: '1px solid var(--gray-200)', borderRadius: 8, fontSize: 13, color: 'var(--gray-800)', background: 'var(--gray-50)', outline: 'none' };
