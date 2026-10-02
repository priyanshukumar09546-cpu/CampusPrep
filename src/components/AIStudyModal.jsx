import React, { useState } from 'react';
import { X, Send, Bot, Sparkles, Lightbulb, BookOpen, CheckCircle } from 'lucide-react';

export default function AIStudyModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'virus',
      text: 'Arey student! Main hoon Virus (AI Study Buddy). Koi doubt hai AKTU syllabus ya subject me? Kuch bhi puch lo — OS, Data Structures, DBMS, Maths, TAFL, PYQs... Jaldi pucho!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg })
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages(prev => [...prev, { sender: 'virus', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { 
          sender: 'virus', 
          text: data.error || 'Ask Virus is currently connecting to OpenAI. Please ensure OPENAI_API_KEY is configured in the backend environment.' 
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        sender: 'virus', 
        text: 'Network error communicating with Ask Virus server. Please verify backend connection.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(6px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#1F2421',
        border: '2px solid #3E4642',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '640px',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        overflow: 'hidden'
      }}>
        {/* MODAL HEADER */}
        <div style={{
          padding: '1rem 1.25rem',
          backgroundColor: '#161917',
          borderBottom: '1px solid #2A302C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid #C88D2D',
              backgroundColor: '#FAF7F2'
            }}>
              <img src="/assets/navbar_logo.png" alt="ProfessorVirus AI" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.2rem' }} />
            </div>

            <div>
              <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Ask ProfessorVirus <span style={{ fontSize: '0.75rem', backgroundColor: '#C88D2D', color: '#1F2421', padding: '0.1rem 0.5rem', borderRadius: '9999px', fontWeight: 800 }}>AI Study Buddy</span>
              </div>
              <div style={{ color: '#E8D3B0', fontSize: '0.75rem', fontFamily: "'Kalam', cursive" }}>
                “No doubt is foolish!” — ProfessorVirus
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.3rem'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* CHAT MESSAGES BODY */}
        <div style={{
          flex: 1,
          padding: '1.25rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                backgroundColor: m.sender === 'user' ? '#C88D2D' : '#2A302C',
                color: m.sender === 'user' ? '#1F2421' : '#FAF7F2',
                padding: '0.85rem 1.1rem',
                borderRadius: m.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                fontSize: '0.92rem',
                lineHeight: 1.4,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontWeight: m.sender === 'user' ? 600 : 400,
                fontFamily: m.sender === 'virus' ? "'Outfit', sans-serif" : 'sans-serif'
              }}
            >
              {m.text}
            </div>
          ))}

          {isTyping && (
            <div style={{
              alignSelf: 'flex-start',
              color: '#C88D2D',
              fontSize: '0.82rem',
              fontStyle: 'italic',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <Sparkles size={14} className="animate-spin" /> Virus is preparing your explanation...
            </div>
          )}
        </div>

        {/* INPUT FOOTER */}
        <form onSubmit={handleSend} style={{
          padding: '0.85rem 1.25rem',
          backgroundColor: '#161917',
          borderTop: '1px solid #2A302C',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <input
            type="text"
            placeholder="Ask Virus any AKTU doubt, concept or PYQ..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              backgroundColor: '#1F2421',
              border: '1px solid #3E4642',
              borderRadius: '9999px',
              padding: '0.65rem 1.1rem',
              color: '#ffffff',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{
              backgroundColor: '#C88D2D',
              color: '#1F2421',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              padding: 0
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
