import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Paperclip, 
  Clock, 
  RotateCcw, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  BookOpen,
  MessageSquare
} from 'lucide-react';

export default function AIStudyModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'virus',
      text: 'Namaste student! I am Virus, your AI Study Assistant. Ask me anything about your university syllabus, technical concepts, code syntax, or PYQ solutions!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const suggestedQuestions = [
    'Explain DBMS in simple words',
    'Difference between OS and DBMS',
    'Write a C program for factorial',
    'Explain OOP concepts',
    'What is normalization?'
  ];

  const handleSendQuery = async (queryText) => {
    const userMsg = (queryText || input).trim();
    if (!userMsg) return;

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
          text: data.error || 'Ask Virus is currently connecting to OpenAI. Please verify backend environment configuration.' 
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

  const handleClearHistory = () => {
    setMessages([
      {
        sender: 'virus',
        text: 'History cleared. What academic topic or concept would you like to explore next?'
      }
    ]);
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Ask Virus AI Assistant"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(10, 4, 6, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        className="pv-ask-virus-container"
        style={{
          backgroundColor: '#18070B',
          backgroundImage: 'linear-gradient(180deg, #270A11 0%, #160509 100%)',
          border: '1px solid rgba(246, 214, 220, 0.15)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          height: '100%',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          color: '#FFFFFF'
        }}
      >
        {/* HEADER BAR */}
        <div style={{
          padding: '0.85rem 1.15rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Ask Virus"
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            <ArrowLeft size={20} />
          </button>

          <div style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '-0.01em'
          }}>
            Ask Virus
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleClearHistory}
              aria-label="Reset conversation"
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.75)',
                cursor: 'pointer',
                padding: '6px'
              }}
            >
              <RotateCcw size={17} />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.75)',
                cursor: 'pointer',
                padding: '6px'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* CHAT / CONTENT BODY */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem 1.15rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* MASCOT HERO BANNER (Shown if 1 or 2 messages) */}
          {messages.length <= 2 && (
            <div style={{
              textAlign: 'center',
              padding: '0.5rem 0 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(246, 214, 220, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem',
                boxShadow: '0 8px 24px rgba(122, 28, 40, 0.4)'
              }}>
                <img 
                  src="/assets/hero_virus.png" 
                  alt="Ask Virus Mascot" 
                  style={{ width: '70px', height: '70px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.currentTarget.src = '/assets/navbar_logo.png';
                  }}
                />
              </div>

              <h2 style={{
                margin: '0 0 0.25rem',
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-0.02em'
              }}>
                Ask Virus
              </h2>
              <div style={{
                fontSize: '0.86rem',
                color: '#F9D8DE',
                fontWeight: 700,
                marginBottom: '0.4rem'
              }}>
                Your AI Study Assistant
              </div>
              <p style={{
                margin: 0,
                fontSize: '0.78rem',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: 1.4,
                maxWidth: '280px'
              }}>
                Get instant, accurate and well-explained answers to your academic doubts anytime.
              </p>
            </div>
          )}

          {/* MESSAGES LIST */}
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '86%',
                backgroundColor: m.sender === 'user' ? '#7A1C28' : 'rgba(255, 255, 255, 0.08)',
                backgroundImage: m.sender === 'user' ? 'linear-gradient(135deg, #85182A 0%, #63121F 100%)' : 'none',
                border: m.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                padding: '0.85rem 1rem',
                borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                fontSize: '0.88rem',
                lineHeight: 1.45,
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
              }}
            >
              {m.text}
            </div>
          ))}

          {isTyping && (
            <div style={{
              alignSelf: 'flex-start',
              color: '#F9D8DE',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0'
            }}>
              <Sparkles size={14} className="animate-spin" color="#FFD166" /> 
              Virus is preparing your explanation...
            </div>
          )}

          {/* SUGGESTED QUESTION CHIPS */}
          {messages.length <= 2 && (
            <div style={{
              marginTop: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem'
            }}>
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendQuery(q)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '14px',
                    padding: '0.65rem 0.95rem',
                    color: '#FAF7F2',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    transition: 'all 0.18s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'}
                >
                  <MessageSquare size={14} color="#F9D8DE" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INPUT BOX & BADGES */}
        <div style={{
          padding: '0.75rem 1rem 1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(10, 4, 6, 0.4)'
        }}>
          {/* INPUT PILL */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendQuery(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1.5px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '999px',
              padding: '0.3rem 0.4rem 0.3rem 0.9rem',
              marginBottom: '0.65rem'
            }}
          >
            <Paperclip size={18} color="rgba(255, 255, 255, 0.5)" style={{ marginRight: '0.5rem', flexShrink: 0 }} />
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              aria-label="Type your question for Ask Virus"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                fontSize: '0.86rem'
              }}
            />
            <button
              type="submit"
              aria-label="Send query"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#7A1C28',
                backgroundImage: 'linear-gradient(135deg, #85182A 0%, #63121F 100%)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <Send size={15} />
            </button>
          </form>

          {/* BADGES ROW */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.68rem',
            color: 'rgba(255, 255, 255, 0.65)'
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <ShieldCheck size={12} color="#4ADE80" /> Accurate
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <BookOpen size={12} color="#60A5FA" /> Study Focused
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <CheckCircle2 size={12} color="#FBBF24" /> Powered by OpenAI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
