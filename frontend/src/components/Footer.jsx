import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div style={{ backgroundColor: '#F3F6FA', marginTop: '80px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px' }}>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr 1fr 1fr', 
          gap: '40px',
          flexWrap: 'wrap'
        }}>
          
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
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
            </div>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, maxWidth: '280px' }}>
              Rural healthcare AI assistant combining modern medicine with Ayurvedic wisdom.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
              Product
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/sehat-ai" style={{ fontSize: '14px', color: '#64748B', textDecoration: 'none' }}>AI Chat Assistant</Link>
              <Link to="/charak-samhita" style={{ fontSize: '14px', color: '#64748B', textDecoration: 'none' }}>Charak Samhita</Link>
              <Link to="/dashboard" style={{ fontSize: '14px', color: '#64748B', textDecoration: 'none' }}>Health Dashboard</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
              Company
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" style={{ fontSize: '14px', color: '#64748B', textDecoration: 'none' }}>About Us</a>
              <a href="#" style={{ fontSize: '14px', color: '#64748B', textDecoration: 'none' }}>Blog</a>
              <a href="#" style={{ fontSize: '14px', color: '#64748B', textDecoration: 'none' }}>Contact</a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
              Legal
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" style={{ fontSize: '14px', color: '#64748B', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ fontSize: '14px', color: '#64748B', textDecoration: 'none' }}>Terms of Service</a>
              <a href="#" style={{ fontSize: '14px', color: '#64748B', textDecoration: 'none' }}>Disclaimer</a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div style={{ 
          borderTop: '1px solid #E2E8F0', 
          marginTop: '40px', 
          paddingTop: '24px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '4px' }}>
            © 2026 Sehat Healthcare. All rights reserved.
          </p>
          <p style={{ fontSize: '12px', color: '#94A3B8' }}>
            Not a substitute for professional medical advice. Always consult a doctor.
          </p>
        </div>

      </div>
    </div>
  );
}