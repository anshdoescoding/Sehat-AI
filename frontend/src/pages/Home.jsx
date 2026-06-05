import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ width: '100%' }}>
      
      {/* HERO */}
      <div style={{ paddingTop: '80px', paddingBottom: '60px', textAlign: 'center', paddingLeft: '20px', paddingRight: '20px' }}>
        
        <span style={{ 
          display: 'inline-block', 
          padding: '8px 20px', 
          backgroundColor: '#F3F6FA', 
          color: '#64748B', 
          borderRadius: '50px',
          fontSize: '14px',
          fontWeight: 500,
          marginBottom: '30px'
        }}>
          🌍 Healthcare for Everyone
        </span>

        <h1 style={{ 
          fontSize: '52px', 
          fontWeight: 700, 
          color: '#1E293B', 
          lineHeight: 1.2,
          marginBottom: '20px',
          maxWidth: '600px',
          margin: '0 auto 20px'
        }}>
          Your Personal<br />
          <span style={{ color: '#2563EB' }}>Health Assistant</span>
        </h1>

        <p style={{ 
          fontSize: '18px', 
          color: '#64748B', 
          maxWidth: '550px', 
          margin: '0 auto 40px',
          lineHeight: 1.6
        }}>
          AI-powered healthcare guidance combined with traditional Ayurvedic wisdom, designed 
          for everyone. Get instant symptom assessment, health tracking, and personalized 
          remedies—anytime, anywhere.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Link to="/sehat-ai" style={{
            backgroundColor: '#2563EB',
            color: 'white',
            padding: '14px 32px',
            borderRadius: '50px',
            fontWeight: 600,
            fontSize: '15px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            💬 Sehat AI
          </Link>
          <Link to="/dashboard" style={{
            border: '2px solid #E2E8F0',
            color: '#1E293B',
            padding: '14px 32px',
            borderRadius: '50px',
            fontWeight: 600,
            fontSize: '15px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📊 View Dashboard
          </Link>
        </div>

        <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '20px' }}>
          Guidance tool, not a diagnosis. Always consult healthcare professionals for serious concerns.
        </p>
      </div>

      {/* FEATURES */}
      <div style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#1E293B', marginBottom: '12px' }}>
            Comprehensive Healthcare Platform
          </h2>
          <p style={{ fontSize: '18px', color: '#64748B' }}>
            Everything you need to manage your health and make informed decisions
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '20px' 
        }}>
          
          {/* Card 1 */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#DBEAFE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>
              💬
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>Sehat - Medical AI</h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, marginBottom: '16px' }}>
              Get evidence-based medical guidance using explainable AI models based on modern clinical research.
            </p>
            <Link to="/sehat-ai" style={{ color: '#2563EB', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
              Sehat AI →
            </Link>
          </div>

          {/* Card 2 */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>
              📈
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>Personal Dashboard</h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, marginBottom: '16px' }}>
              Track your vitals, health records, and get personalized health insights powered by AI.
            </p>
            <Link to="/dashboard" style={{ color: '#2563EB', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
              Explore →
            </Link>
          </div>

          {/* Card 3 */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#FEF3C7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>
              🌿
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>Charak Samhita AI</h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, marginBottom: '16px' }}>
              Explore classical Ayurvedic wisdom and traditional remedies based on Charak Samhita teachings.
            </p>
            <Link to="/charak-samhita" style={{ color: '#2563EB', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
              Explore →
            </Link>
          </div>

          {/* Card 4 */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#FEE2E2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>
              🚨
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>Emergency Detection</h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, marginBottom: '16px' }}>
              Instant identification of critical symptoms that need immediate medical attention.
            </p>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Always Active
            </span>
          </div>

          {/* Card 5 */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#DBEAFE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>
              🏠
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>Digital Health Records</h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, marginBottom: '16px' }}>
              Secure storage of your complete medical history, prescriptions, and health timeline.
            </p>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              In Dashboard
            </span>
          </div>

          {/* Card 6 */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#F1F5F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>
              ⚡
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>Smart Guidance</h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, marginBottom: '16px' }}>
              When to use home remedies vs when to see a doctor. Decision support based on your condition.
            </p>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              AI-Powered
            </span>
          </div>

        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ backgroundColor: '#F3F6FA', paddingTop: '80px', paddingBottom: '80px', paddingLeft: '20px', paddingRight: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#1E293B', marginBottom: '12px' }}>
              How Sehat Works
            </h2>
            <p style={{ fontSize: '18px', color: '#64748B' }}>
              Simple, secure, and designed for accessibility
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '40px',
            textAlign: 'center'
          }}>
            
            {[
              { num: '1', title: 'Describe Symptoms', desc: 'Tell us about your health concerns in simple language' },
              { num: '2', title: 'AI Analysis', desc: 'Our AI analyzes and checks for emergency symptoms' },
              { num: '3', title: 'Choose Your AI', desc: 'Western Medicine (evidence-based) or Charak Samhita (Ayurvedic)' },
              { num: '4', title: 'Get Treatment', desc: 'Receive recommendations and follow up with healthcare professionals' },
            ].map((step) => (
              <div key={step.num}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: 'white',
                  border: '2px solid #93C5FD',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#2563EB',
                  margin: '0 auto 20px'
                }}>
                  {step.num}
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#1E293B', marginBottom: '8px' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </div>

    </div>
  );
}