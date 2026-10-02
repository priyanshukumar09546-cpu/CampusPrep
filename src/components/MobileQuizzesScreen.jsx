import React, { useState } from 'react';
import { 
  Trophy, 
  Code, 
  Cpu, 
  Wrench, 
  Building2, 
  Radio, 
  Zap, 
  Sigma, 
  Play, 
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function MobileQuizzesScreen({ onStartQuiz }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const quizList = [
    {
      id: 'c-prog',
      subject: 'C Programming',
      category: 'CSE',
      questions: '25 Questions',
      time: '15 min',
      icon: Code,
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      iconBorder: '#DBEAFE'
    },
    {
      id: 'dbms',
      subject: 'DBMS',
      category: 'CSE',
      questions: '30 Questions',
      time: '20 min',
      icon: BookOpen,
      iconColor: '#E11D48',
      iconBg: '#FFF1F2',
      iconBorder: '#FFE4E6'
    },
    {
      id: 'os',
      subject: 'Operating System',
      category: 'CSE',
      questions: '25 Questions',
      time: '15 min',
      icon: Cpu,
      iconColor: '#7C3AED',
      iconBg: '#F5F3FF',
      iconBorder: '#EDE9FE'
    },
    {
      id: 'cn',
      subject: 'Computer Networks',
      category: 'CSE',
      questions: '25 Questions',
      time: '15 min',
      icon: Radio,
      iconColor: '#D97706',
      iconBg: '#FEF3C7',
      iconBorder: '#FDE68A'
    },
    {
      id: 'web-dev',
      subject: 'Web Development',
      category: 'CSE',
      questions: '30 Questions',
      time: '20 min',
      icon: Zap,
      iconColor: '#059669',
      iconBg: '#ECFDF5',
      iconBorder: '#D1FAE5'
    },
    {
      id: 'java',
      subject: 'Java Programming',
      category: 'CSE',
      questions: '25 Questions',
      time: '15 min',
      icon: Code,
      iconColor: '#E11D48',
      iconBg: '#FFF1F2',
      iconBorder: '#FFE4E6'
    }
  ];

  return (
    <div 
      className="pv-mobile-quizzes"
      style={{
        padding: '1rem 1rem 5.5rem',
        backgroundColor: '#FAF7F2',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. HERO BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #1C0A10 0%, #3B121C 55%, #561826 100%)',
        borderRadius: '22px',
        padding: '1.25rem',
        color: '#FFFFFF',
        marginBottom: '1.25rem',
        boxShadow: '0 10px 28px rgba(90, 15, 25, 0.28)',
        border: '1px solid rgba(246, 214, 220, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFD166',
          flexShrink: 0
        }}>
          <Trophy size={28} />
        </div>

        <div>
          <h2 style={{
            margin: '0 0 0.25rem',
            fontSize: '1.2rem',
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.02em'
          }}>
            Test Your Knowledge
          </h2>
          <p style={{
            margin: 0,
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.82)'
          }}>
            Practice, Learn and Improve
          </p>
        </div>
      </div>

      {/* 2. PILL FILTERS */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        marginBottom: '1.15rem',
        overflowX: 'auto',
        paddingBottom: '0.2rem'
      }}>
        {['All', 'Semester Wise', 'Subject Wise'].map((f) => {
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '999px',
                border: isActive ? 'none' : '1px solid #E5DFD6',
                backgroundColor: isActive ? '#7A1C28' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#2D3139',
                fontSize: '0.8rem',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 4px 12px rgba(122, 28, 40, 0.25)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* 3. QUIZ CARDS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {quizList.map((quiz) => {
          const IconComp = quiz.icon;
          return (
            <div
              key={quiz.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '0.95rem 1.15rem',
                border: '1px solid #ECE7E0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '13px',
                  backgroundColor: quiz.iconBg,
                  border: `1.5px solid ${quiz.iconBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: quiz.iconColor,
                  flexShrink: 0
                }}>
                  <IconComp size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1C1E21' }}>
                    {quiz.subject}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#71717A', marginTop: '0.15rem' }}>
                    {quiz.questions} • {quiz.time}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartQuiz(quiz.id)}
                style={{
                  backgroundColor: '#7A1C28',
                  backgroundImage: 'linear-gradient(135deg, #85182A 0%, #63121F 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(122, 28, 40, 0.25)',
                  flexShrink: 0
                }}
              >
                Start Quiz
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
