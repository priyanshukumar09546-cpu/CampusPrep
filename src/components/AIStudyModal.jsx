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

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = `“Concept clear hona chahiye! '${userMsg}' ke liye exact AKTU unit-wise notes, 5-year PYQs & simple solved examples humare database me tayyar hain. Exam me 10/10 marks aayenge!” — Virus`;
      setMessages(prev => [...prev, { sender: 'virus', text: reply }]);
      setIsTyping(false);
    }, 1000);
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
        backgroundColor: '#0c3829',
        border: '2px solid #1a563f',
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
          backgroundColor: '#07271c',
          borderBottom: '1px solid #1a563f',
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
              border: '2px solid #34d399',
              backgroundColor: '#1e293b'
            }}>
              <img src="/assets/ai_virus.png" alt="Ask Virus" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div>
              <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Ask Virus <span style={{ fontSize: '0.75rem', backgroundColor: '#059669', color: '#fff', padding: '0.1rem 0.5rem', borderRadius: '9999px' }}>AI Study Buddy</span>
              </div>
              <div style={{ color: '#a7f3d0', fontSize: '0.75rem', fontFamily: "'Kalam', cursive" }}>
                “No doubt is foolish!” — Virus
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
                backgroundColor: m.sender === 'user' ? '#059669' : '#144d37',
                color: '#ffffff',
                padding: '0.85rem 1.1rem',
                borderRadius: m.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                fontSize: '0.92rem',
                lineHeight: 1.4,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontFamily: m.sender === 'virus' ? "'Outfit', sans-serif" : 'sans-serif'
              }}
            >
              {m.text}
            </div>
          ))}

          {isTyping && (
            <div style={{
              alignSelf: 'flex-start',
              color: '#a7f3d0',
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
          backgroundColor: '#07271c',
          borderTop: '1px solid #1a563f',
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
              backgroundColor: '#0c3829',
              border: '1px solid #1a563f',
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
              backgroundColor: '#059669',
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
