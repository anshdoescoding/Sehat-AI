import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const API_URL = 'http://localhost:8000';

const REMEDIES = [
  { icon: '🌿', name: 'Tulsi (Holy Basil)', category: 'Immunity', desc: 'Boosts immunity, relieves cough & cold. Sacred herb in Ayurveda.', uses: 'Cough, cold, fever, respiratory issues, stress' },
  { icon: '🟡', name: 'Turmeric (Haldi)', category: 'Anti-inflammatory', desc: 'Powerful anti-inflammatory & antioxidant. Heals wounds & skin.', uses: 'Inflammation, skin issues, wounds, arthritis, digestion' },
  { icon: '🍯', name: 'Honey (Madhu)', category: 'General Wellness', desc: 'Natural antibacterial. Soothes throat & boosts energy.', uses: 'Cough, sore throat, wounds, digestion, energy boost' },
  { icon: '🧄', name: 'Garlic (Lahsun)', category: 'Heart Health', desc: 'Lowers cholesterol & blood pressure. Natural antibiotic.', uses: 'High BP, cholesterol, infections, cold, digestion' },
  { icon: '🫚', name: 'Ginger (Adrak)', category: 'Digestion', desc: 'Aids digestion, reduces nausea. Warming herb for cold.', uses: 'Nausea, indigestion, cold, cough, joint pain' },
  { icon: '🌱', name: 'Neem (Nimba)', category: 'Skin Care', desc: 'Purifies blood, treats skin diseases. Natural antiseptic.', uses: 'Acne, eczema, wounds, dandruff, fever' },
  { icon: '🍃', name: 'Giloy (Guduchi)', category: 'Immunity', desc: 'Boosts immunity, fights fever. Called Amrita in Ayurveda.', uses: 'Fever, diabetes, immunity, skin diseases, liver' },
  { icon: '💪', name: 'Ashwagandha', category: 'Strength', desc: 'Adaptogenic herb. Reduces stress & boosts strength.', uses: 'Stress, anxiety, weakness, insomnia, joint pain' },
  { icon: '🌸', name: 'Shatavari', category: 'Women Health', desc: 'Female reproductive tonic. Nourishes & rejuvenates.', uses: 'Menstrual issues, lactation, menopause, digestion' },
  { icon: '🍈', name: 'Triphala', category: 'Digestion', desc: 'Three-fruit formula. Gentle cleanser & digestive tonic.', uses: 'Constipation, digestion, eye health, detox, weight loss' },
  { icon: '🧠', name: 'Brahmi', category: 'Brain Health', desc: 'Brain tonic. Improves memory & concentration.', uses: 'Memory loss, stress, anxiety, epilepsy, hair growth' },
  { icon: '🌰', name: 'Sesame Oil', category: 'Body Care', desc: 'Best massage oil. Nourishes skin & calms Vata dosha.', uses: 'Joint pain, dry skin, constipation, hair fall, Vata imbalance' },
  { icon: '🥛', name: 'Ghee (Ghrita)', category: 'General Wellness', desc: 'Clarified butter. Nourishes tissues & boosts digestion.', uses: 'Weakness, digestion, skin, eyes, memory, immunity' },
  { icon: '☕', name: 'Cumin (Jeera)', category: 'Digestion', desc: 'Improves digestion & metabolism. Cooling spice.', uses: 'Indigestion, bloating, gas, acidity, IBS' },
  { icon: '🌾', name: 'Barley (Yava)', category: 'Metabolism', desc: 'Light grain. Diuretic & good for diabetes.', uses: 'Diabetes, obesity, urinary issues, inflammation' },
  { icon: '🍎', name: 'Amla (Amlaki)', category: 'Immunity', desc: 'Richest source of Vitamin C. Rejuvenates body.', uses: 'Immunity, hair, skin, digestion, diabetes, eyes' },
  { icon: '💧', name: 'Castor Oil (Eranda)', category: 'Body Care', desc: 'Best purgative. Relieves joint pain & constipation.', uses: 'Constipation, joint pain, skin, hair growth, detox' },
  { icon: '🌼', name: 'Licorice (Mulethi)', category: 'Respiratory', desc: 'Soothes throat & respiratory tract. Sweet herb.', uses: 'Cough, sore throat, ulcers, acidity, respiratory' },
  { icon: '🫑', name: 'Black Pepper (Maricha)', category: 'Metabolism', desc: 'Improves digestion & nutrient absorption.', uses: 'Cold, cough, indigestion, obesity, sinus issues' },
  { icon: '🌿', name: 'Mint (Pudina)', category: 'Digestion', desc: 'Cooling herb. Refreshes & aids digestion.', uses: 'Indigestion, nausea, headache, skin, bad breath' },
];

export default function CharakSamhita() {
  const [selectedRemedy, setSelectedRemedy] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { text: "Hello! Ask me anything about Ayurvedic remedies from the Charak Samhita.", isUser: false }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChatSend = async () => {
    if (!chatInput.trim() || loading) return;
    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { text: userText, isUser: true }]);
    setChatInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/charak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userText })
      });
      const data = await response.json();
      let reply = '';

      if (data.type === 'home_remedy') {
        reply = `🌿  ${data.title}\n\n`;
        reply += `━━━━━━━━━━━━━━━━━\n\n`;
        reply += `📋  What it treats\n`;
        reply += `${data.condition}\n\n`;
        reply += `🫙  Ingredients\n`;
        reply += `${data.ingredients}\n\n`;
        reply += `📝  How to use\n`;
        reply += `${data.method}\n\n`;
        if (data.diet) {
          reply += `🥗  Diet tip\n`;
          reply += `${data.diet}\n\n`;
        }
        reply += `📖  Charak Samhita ${data.source}`;
      } else if (data.type === 'herb') {
        reply = `🪴  ${data.title}\n\n`;
        reply += `━━━━━━━━━━━━━━━━━\n\n`;
        reply += `👅  Taste: ${data.taste}\n`;
        reply += `🔥  Potency: ${data.potency}\n`;
        if (data.properties) reply += `⚡  Properties: ${data.properties}\n`;
        reply += `\n💚  Uses:\n${data.uses}\n`;
        if (data.contraindications) reply += `\n⚠️  Avoid if: ${data.contraindications}\n`;
        reply += `\n📖  ${data.source}`;
      } else if (data.type === 'disease_treatment') {
        reply = `🏥  ${data.title}\n\n`;
        reply += `━━━━━━━━━━━━━━━━━\n\n`;
        reply += `💊  Treatment:\n${data.treatment}\n`;
        if (data.herbs) reply += `\n🌿  Herbs:\n${data.herbs}\n`;
        if (data.diet) reply += `\n🥗  Diet:\n${data.diet}\n`;
        if (data.symptoms) reply += `\n🔍  Symptoms:\n${data.symptoms}\n`;
      } else if (data.type === 'not_found') {
        reply = `❓  ${data.description}`;
      } else {
        reply = data.description || "Here's what I found in the Charak Samhita.";
      }

      setChatMessages(prev => [...prev, { text: reply, isUser: false }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { text: "Sorry, I couldn't search the Charak Samhita. Try browsing the catalog above.", isUser: false }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      
      {/* Header */}
<div style={{ backgroundColor: '#1E293B', color: 'white', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '48px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '18px' }} title="Home">🏠</Link>
    <Link to="/dashboard" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '18px' }} title="Dashboard">📊</Link>
    <Link to="/sehat-ai" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '18px' }} title="Sehat AI">💬</Link>
    <div style={{ width: '1px', height: '20px', backgroundColor: '#334155' }}></div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '24px', height: '24px', backgroundColor: '#F59E0B', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🌿</div>
      <span style={{ fontSize: '15px', fontWeight: 700 }}>Charak Samhita</span>
    </div>
  </div>
</div>

      {/* Remedy Cards */}
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>Ayurvedic Remedies</h2>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>Click a remedy to learn more, or use the chat to search the Charak Samhita</p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
          gap: '14px',
          paddingBottom: '100px'
        }}>
          {REMEDIES.map((remedy, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedRemedy(selectedRemedy?.name === remedy.name ? null : remedy)}
              style={{
                backgroundColor: selectedRemedy?.name === remedy.name ? '#FEF3C7' : 'white',
                border: selectedRemedy?.name === remedy.name ? '2px solid #F59E0B' : '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '20px 14px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>{remedy.icon}</div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>{remedy.name}</h3>
              <span style={{ fontSize: '10px', color: '#F59E0B', fontWeight: 600, textTransform: 'uppercase' }}>{remedy.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRemedy && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '20px', padding: '28px',
            maxWidth: '420px', width: '100%', maxHeight: '80vh', overflowY: 'auto',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '60px' }}>{selectedRemedy.icon}</span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1E293B', textAlign: 'center', marginBottom: '4px' }}>{selectedRemedy.name}</h2>
            <span style={{ display: 'block', textAlign: 'center', fontSize: '11px', color: '#F59E0B', fontWeight: 600, marginBottom: '16px' }}>{selectedRemedy.category}</span>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7, marginBottom: '16px' }}>{selectedRemedy.desc}</p>
            <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>Uses:</p>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>{selectedRemedy.uses}</p>
            </div>
            <button onClick={() => setSelectedRemedy(null)}
              style={{ width: '100%', padding: '12px', backgroundColor: '#1E293B', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 90 }}>
        {showChat && (
          <div style={{
            position: 'absolute', bottom: '60px', right: '0',
            width: '360px', height: '480px', backgroundColor: 'white',
            borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
            <div style={{ backgroundColor: '#F59E0B', color: 'white', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>🌿</span>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>Charak AI</span>
              </div>
              <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px', backgroundColor: '#F8FAFC' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: msg.isUser ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
                  <div style={{
                    padding: '10px 14px', borderRadius: msg.isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    backgroundColor: msg.isUser ? '#F59E0B' : 'white', color: msg.isUser ? 'white' : '#1E293B',
                    fontSize: '12px', lineHeight: 1.5, maxWidth: '85%', whiteSpace: 'pre-wrap',
                    border: msg.isUser ? 'none' : '1px solid #E2E8F0'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ padding: '8px 12px', fontSize: '12px', color: '#64748B' }}>Searching Charak Samhita...</div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', padding: '8px', display: 'flex', gap: '6px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') handleChatSend(); }}
                placeholder="Ask about herbs, remedies..."
                disabled={loading}
                style={{
                  flex: 1, border: '1px solid #E2E8F0', borderRadius: '20px',
                  padding: '8px 14px', fontSize: '12px', outline: 'none'
                }}
              />
              <button onClick={handleChatSend} disabled={!chatInput.trim() || loading}
                style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  backgroundColor: '#F59E0B', border: 'none', color: 'white',
                  cursor: 'pointer', fontSize: '14px', flexShrink: 0
                }}>
                ↑
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowChat(!showChat)}
          style={{
            width: '52px', height: '52px', borderRadius: '50%',
            backgroundColor: '#F59E0B', color: 'white', border: 'none',
            fontSize: '24px', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(245,158,11,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
          {showChat ? '✕' : '🌿'}
        </button>
      </div>
    </div>
  );
}