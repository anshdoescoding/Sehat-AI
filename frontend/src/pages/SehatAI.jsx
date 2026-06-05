import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function SehatAI() {
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your Sehat health assistant. Describe your symptoms and I'll help you understand what might be going on.", 
      isUser: false, 
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [mode, setMode] = useState('modern');
  const chatRef = useRef(null);

  useEffect(() => {
    const container = chatRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const formatResponse = (data) => {
    if (data.status === 'EMERGENCY') {
      let reply = `🚨  MEDICAL EMERGENCY\n\n`;
      reply += `━━━━━━━━━━━━━━━━━\n\n`;
      reply += `${data.message}\n\n`;
      reply += `📞  Call 108 immediately\n`;
      reply += `🏥  Go to your nearest hospital`;
      return reply;
    }
    if (data.status === 'follow_up') {
      return data.message;
    }
    if (data.status === 'need_more_info' || data.status === 'no_match') {
      return data.message || "I need more details to understand your condition.";
    }
    if (data.status === 'success') {
      const diag = data.diagnosis || {};
      const primary = diag.primary || {};
      const treatment = data.treatment || {};
      
      let reply = '';
      
      reply += `🩺  ${primary.disease || 'Assessment'}\n\n`;
      reply += `━━━━━━━━━━━━━━━━━\n\n`;
      
      if (diag.symptoms_found && diag.symptoms_found.length > 0) {
        reply += `🔍  Symptoms identified\n`;
        reply += `${diag.symptoms_found.join(', ')}\n\n`;
      }
      
      if (treatment.primary_advice) {
        reply += `📋  What you should do\n`;
        reply += `${treatment.primary_advice}\n\n`;
      }
      
      if (treatment.general_tips && treatment.general_tips.length > 0) {
        reply += `💡  General care\n`;
        treatment.general_tips.forEach(tip => reply += `• ${tip}\n`);
        reply += '\n';
      }
      
      if (treatment.diet_tip) {
        reply += `🥗  Diet\n`;
        reply += `${treatment.diet_tip}\n\n`;
      }
      
      if (diag.alternatives && diag.alternatives.length > 0) {
        reply += `🔎  Other possibilities\n`;
        diag.alternatives.forEach(alt => reply += `• ${alt.disease}\n`);
        reply += '\n';
      }
      
      if (data.danger_signs) {
        reply += `⚠️  Seek help if you experience\n`;
        data.danger_signs.slice(0, 4).forEach(sign => reply += `• ${sign}\n`);
        reply += '\n';
      }
      
      reply += `━━━━━━━━━━━━━━━━━\n`;
      reply += `⚠️  This is an AI assessment, not a medical diagnosis.`;
      
      return reply;
    }
    return "I've analyzed your symptoms. If you're concerned, please visit a healthcare provider.";
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userText = input.trim();
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    
    setMessages(prev => [...prev, { text: userText, isUser: true, timestamp: now }]);
    setInput('');
    setLoading(true);

    try {
      const endpoint = mode === 'integrated' ? '/synthesize' : '/check';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userText, session_id: sessionId })
      });
      
      const data = await response.json();
      if (data.session_id) setSessionId(data.session_id);
      
      let replyText;
      if (mode === 'integrated' && data.synthesis) {
        replyText = `🌿✨  Integrated Health Plan\n\n${data.synthesis}`;
      } else {
        replyText = formatResponse(data);
      }
      
      setMessages(prev => [...prev, {
        text: replyText,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        text: "Sorry, I can't connect to the server. Make sure the backend is running on port 8000.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      }]);
    }
    
    setLoading(false);
  };

  const startNewConversation = async () => {
    if (sessionId) {
      try { await fetch(`${API_URL}/session/${sessionId}`, { method: 'DELETE' }); } catch (e) {}
    }
    setSessionId(null);
    setMessages([{ 
      text: "Hello! I'm your Sehat health assistant. Describe your symptoms and I'll help you understand what might be going on.", 
      isUser: false, 
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    }]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#FFFFFF', margin: 0, padding: 0 }}>
      
      {/* Top Bar with Navigation */}
      <div style={{ 
        borderBottom: '1px solid #1E293B', 
        padding: '8px 16px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: '#1E293B',
        color: 'white',
        flexShrink: 0,
        height: '48px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '18px' }} title="Home">🏠</Link>
          <Link to="/dashboard" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '18px' }} title="Dashboard">📊</Link>
          <Link to="/charak-samhita" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '18px' }} title="Charak Samhita">🌿</Link>
          <div style={{ width: '1px', height: '20px', backgroundColor: '#334155' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', backgroundColor: '#2563EB', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>+</div>
            <span style={{ fontSize: '15px', fontWeight: 700 }}>Sehat AI</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {sessionId && (
            <button onClick={startNewConversation} style={{
              padding: '4px 12px', fontSize: '11px', border: '1px solid #475569', borderRadius: '14px',
              backgroundColor: 'transparent', cursor: 'pointer', color: '#CBD5E1'
            }}>
              New Chat
            </button>
          )}
          <span style={{ width: '6px', height: '6px', backgroundColor: '#10B981', borderRadius: '50%' }}></span>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '16px', backgroundColor: '#F8FAFC' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: msg.isUser ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
            {!msg.isUser && (
              <div style={{ width: '30px', height: '30px', backgroundColor: '#DBEAFE', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', marginRight: '8px', flexShrink: 0 }}>🤖</div>
            )}
            <div style={{ maxWidth: '80%' }}>
              <div style={{
                padding: '10px 14px',
                borderRadius: msg.isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                backgroundColor: msg.isUser ? '#2563EB' : 'white',
                color: msg.isUser ? 'white' : '#1E293B',
                border: msg.isUser ? 'none' : '1px solid #E2E8F0',
                fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
              <p style={{ fontSize: '10px', color: '#94A3B8', marginTop: '3px', paddingLeft: msg.isUser ? '0' : '38px' }}>{msg.timestamp}</p>
            </div>
            {msg.isUser && (
              <div style={{ width: '30px', height: '30px', backgroundColor: '#EFF6FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', marginLeft: '8px', flexShrink: 0 }}>👤</div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
            <div style={{ width: '30px', height: '30px', backgroundColor: '#DBEAFE', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', marginRight: '8px' }}>🤖</div>
            <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', backgroundColor: 'white', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '13px', color: '#64748B' }}>Analyzing your symptoms...</span>
            </div>
          </div>
        )}
      </div>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#F8FAFC' }}>
        <button onClick={() => setMode('modern')} style={{
          padding: '6px 16px', borderRadius: '20px', border: mode === 'modern' ? '2px solid #2563EB' : '1px solid #E2E8F0',
          backgroundColor: mode === 'modern' ? '#EFF6FF' : 'white', color: mode === 'modern' ? '#2563EB' : '#64748B',
          fontSize: '12px', fontWeight: 600, cursor: 'pointer'
        }}>
          💊 Modern
        </button>
        <button onClick={() => setMode('integrated')} style={{
          padding: '6px 16px', borderRadius: '20px', border: mode === 'integrated' ? '2px solid #059669' : '1px solid #E2E8F0',
          backgroundColor: mode === 'integrated' ? '#ECFDF5' : 'white', color: mode === 'integrated' ? '#059669' : '#64748B',
          fontSize: '12px', fontWeight: 600, cursor: 'pointer'
        }}>
          🌿 Integrated
        </button>
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid #E2E8F0', padding: '10px 16px', backgroundColor: 'white', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter' && !loading) handleSend(); }}
            placeholder="Describe your symptoms..."
            disabled={loading}
            style={{
              flex: 1, border: '1px solid #E2E8F0', borderRadius: '24px',
              padding: '10px 16px', fontSize: '13px', outline: 'none',
              backgroundColor: '#F8FAFC', color: '#1E293B'
            }}
          />
          <button onClick={handleSend} disabled={!input.trim() || loading}
            style={{
              width: '40px', height: '40px', borderRadius: '50%',
              backgroundColor: (input.trim() && !loading) ? '#2563EB' : '#CBD5E1',
              border: 'none', cursor: (input.trim() && !loading) ? 'pointer' : 'default',
              color: 'white', fontSize: '18px', flexShrink: 0
            }}>
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}