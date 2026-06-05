import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
export default function Navbar() {
  const location = useLocation();
  
  const linkStyle = (path) => ({
    color: location.pathname === path ? '#2563EB' : '#64748B',
    fontWeight: location.pathname === path ? 600 : 500,
    fontSize: '14px',
    textDecoration: 'none',
    padding: '8px 0',
  });

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderBottom: '1px solid #F1F5F9',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 24px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        height: '64px'
      }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: '#2563EB', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 700
          }}>
            +
          </div>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#2563EB' }}>Sehat</span>
        </Link>

        {/* Center Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link to="/" style={linkStyle('/')}>Home</Link>
          <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
          <Link to="/charak-samhita" style={linkStyle('/charak-samhita')}>Charak Samhita</Link>
        </div>

        {/* CTA Button */}
        <Link to="/sehat-ai" style={{
          backgroundColor: '#2563EB',
          color: 'white',
          padding: '10px 22px',
          borderRadius: '50px',
          fontSize: '14px',
          fontWeight: 600,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          💬 Sehat AI
        </Link>

      </div>
    </div>
  );
}