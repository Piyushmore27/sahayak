import React from 'react';

export default function LoadingSpinner({ fullScreen, size = 40 }) {
  const spinner = (
    <svg width={size} height={size} viewBox="0 0 50 50" style={{ animation: 'spin 0.8s linear infinite' }}>
      <circle cx="25" cy="25" r="20" fill="none" stroke="var(--teal-600)" strokeWidth="4" strokeDasharray="100 28" strokeLinecap="round" />
    </svg>
  );
  if (fullScreen) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--gray-50)' }}>
      {spinner}
    </div>
  );
  return <div style={{ display:'flex', justifyContent:'center', padding:'40px' }}>{spinner}</div>;
}
