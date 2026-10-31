import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  BookOpen,
  Code2,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { API_URL } from '../config/api';

export default function HoollowMentorDrawer({ isOpen, onClose, currentGoal, initialTopic }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hello! I am your HOOLLOW AI Learning Mentor. How can I assist you with your **${currentGoal || 'learning roadmap'}** today? Ask me for code examples, concept breakdowns, or project advice!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (initialTopic) {
      setInput(`Can you explain the key concepts and give a practical example for "${initialTopic}"?`);
    }
  }, [initialTopic]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e?.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    const userMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/hoollow/ask-mentor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          goal: currentGoal,
          taskTitle: initialTopic || ''
        })
      });

      const data = await res.json();
      const botMsg = {
        sender: 'bot',
        text: data?.answer || 'Keep practicing and breaking code down into small steps! You can do this.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Here is a helpful tip for **${currentGoal || 'this topic'}**:\n\n1. Read the official documentation carefully.\n2. Write a minimal code snippet to test your understanding.\n3. Check standard library methods.\n\nKeep going, consistent daily effort yields mastery!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(28, 30, 33, 0.45)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #E8E2D5'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.2rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'linear-gradient(135deg, #FFF9F1 0%, #FFFFFF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#8B101D',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bot size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#FFFFFF', fontFamily: "'Outfit', sans-serif" }}>
                HOOLLOW AI Mentor
              </div>
              <div style={{ fontSize: '0.72rem', color: '#7A6F62', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16A34A' }} />
                Online · Context: {currentGoal || 'Roadmap'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#F6F2E9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#646E78'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div
          style={{
            padding: '0.6rem 1rem',
            backgroundColor: '#0B0B0B',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          <button
            onClick={() => setInput('Explain this concept in simple terms')}
            style={{
              background: '#161616',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              padding: '0.25rem 0.65rem',
              fontSize: '0.72rem',
              color: '#A1A1AA',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            💡 Explain simply
          </button>
          <button
            onClick={() => setInput('Provide a working code example with comments')}
            style={{
              background: '#161616',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              padding: '0.25rem 0.65rem',
              fontSize: '0.72rem',
              color: '#A1A1AA',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            💻 Code example
          </button>
          <button
            onClick={() => setInput('What are the top 3 interview questions on this?')}
            style={{
              background: '#161616',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              padding: '0.25rem 0.65rem',
              fontSize: '0.72rem',
              color: '#A1A1AA',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            🎯 Interview FAQs
          </button>
        </div>

        {/* Message Thread */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem', backgroundColor: '#0B0B0B', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '0.6rem',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '90%'
              }}
            >
              {m.sender === 'bot' && (
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#FFB800',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  <Sparkles size={14} />
                </div>
              )}

              <div>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: m.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    backgroundColor: m.sender === 'user' ? '#8B101D' : '#FFFFFF',
                    color: m.sender === 'user' ? '#FFFFFF' : '#1F2421',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    border: m.sender === 'user' ? 'none' : '1px solid #E8E2D5',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {m.text}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#909AA4', marginTop: '0.2rem', textAlign: m.sender === 'user' ? 'right' : 'left' }}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '0.6rem', alignSelf: 'flex-start' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#FFB800',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Sparkles size={14} />
              </div>
              <div
                style={{
                  padding: '0.6rem 0.9rem',
                  borderRadius: '16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#646E78'
                }}
              >
                <Loader2 size={15} className="pv-spin" />
                Thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          style={{
            padding: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: '#FFFFFF',
            display: 'flex',
            gap: '0.5rem'
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask anything about ${currentGoal || 'your task'}...`}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              borderRadius: '9999px',
              border: '1.5px solid #E8E2D5',
              fontSize: '0.85rem',
              outline: 'none',
              backgroundColor: '#0B0B0B'
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            style={{
              backgroundColor: input.trim() && !loading ? '#8B101D' : '#E8E2D5',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: input.trim() && !loading ? 'pointer' : 'default',
              transition: 'all 0.15s ease'
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
