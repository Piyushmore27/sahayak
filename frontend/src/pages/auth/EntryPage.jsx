import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EntryPage.css';

const EntryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="entry-container">
      {/* Background Pattern */}
      <div className="bg-pattern"></div>
      
      <div className="entry-glass">
        <div className="logo-section">
          <div className="shield-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0e6b73" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h1>Sahayak Sentinel</h1>
          <p>Emergency Response & Coordination Platform</p>
        </div>

        <div className="choice-section">
          <h2>Access Portal</h2>
          <p className="subtitle">Select your role to continue to the command center</p>
          
          <div className="button-group">
            <button 
              className="portal-btn admin-btn"
              onClick={() => navigate('/admin/login')}
            >
              <span className="btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0e6b73" strokeWidth="2">
                  <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2l10 8H2l10-8z"/>
                </svg>
              </span>
              <div className="btn-text">
                <span className="btn-title">Admin Command</span>
                <span className="btn-desc">Sector monitoring & dispatch</span>
              </div>
            </button>

            <button 
              className="portal-btn volunteer-btn"
              onClick={() => navigate('/volunteer/login')}
            >
              <span className="btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0e6b73" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </span>
              <div className="btn-text">
                <span className="btn-title">Volunteer Portal</span>
                <span className="btn-desc">Real-time response & missions</span>
              </div>
            </button>
          </div>
        </div>

        <div className="footer-links">
          <p>Don't have a volunteer account? <span className="link" onClick={() => navigate('/volunteer/signup')}>Apply Now</span></p>
        </div>
      </div>
      
      <div className="bg-animations">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
    </div>
  );
};

export default EntryPage;
