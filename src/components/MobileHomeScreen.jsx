import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  BookOpen, 
  FileText, 
  CheckSquare, 
  Award, 
  Briefcase, 
  FileCheck, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function MobileHomeScreen({ 
  onNavigate, 
  onOpenAI, 
  onSearch, 
  onSelectCourse,
  onSelectSubject
}) {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      if (onSearch) onSearch(searchInput.trim());
      onNavigate('notes');
    }
  };

  const handleTrendingClick = (topic) => {
    if (onSelectSubject) {
      onSelectSubject(topic);
    } else {
      if (onSearch) onSearch(topic);
      onNavigate('notes');
    }
  };

  const featureCards = [
    {
      id: 'notes',
      title: 'Notes',
      subtitle: 'Study Material',
      icon: BookOpen,
      iconColor: '#C88D2D',
      iconBg: '#FFF8EC',
      iconBorder: '#F9E6C4',
      action: () => onNavigate('notes')
    },
    {
      id: 'pyqs',
      title: 'PYQs',
      subtitle: 'Previous Year',
      icon: FileText,
      iconColor: '#E11D48',
      iconBg: '#FFF1F2',
      iconBorder: '#FFE4E6',
      action: () => onNavigate('pyqs')
    },
    {
      id: 'syllabus',
      title: 'Syllabus',
      subtitle: 'Complete Curriculum',
      icon: CheckSquare,
      iconColor: '#2563EB',
      iconBg: '#EFF6FF',
      iconBorder: '#DBEAFE',
      action: () => onNavigate('syllabus')
    },
    {
      id: 'quizzes',
      title: 'Quizzes',
      subtitle: 'Test Your Knowledge',
      icon: Award,
      iconColor: '#7C3AED',
      iconBg: '#F5F3FF',
      iconBorder: '#EDE9FE',
      action: () => onNavigate('quizzes')
    },
    {
      id: 'interview-pro',
      title: 'Interview Pro',
      subtitle: 'Mock Interviews',
      icon: Briefcase,
      iconColor: '#D97706',
      iconBg: '#FEF3C7',
      iconBorder: '#FDE68A',
      action: () => onNavigate('interview-pro')
    },
    {
      id: 'resume-maker',
      title: 'Resume Builder',
      subtitle: 'Create Professional CV',
      icon: FileCheck,
      iconColor: '#4F46E5',
      iconBg: '#EEF2FF',
      iconBorder: '#E0E7FF',
      action: () => onNavigate('resume-maker')
    }
  ];

  const trendingTopics = [
    'C Programming',
    'DBMS',
    'DSA',
    'OS',
    'Java',
    'Web Development',
    'CN',
    'OOP'
  ];

  return (
    <div 
      className="pv-mobile-home"
      style={{
        padding: '1.25rem 1rem 5.5rem',
        backgroundColor: '#FAF7F2',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. HERO HEADLINE */}
      <div style={{ marginBottom: '1.15rem' }}>
        <h1 style={{
          fontSize: '1.95rem',
          fontWeight: 900,
          color: '#1C1E21',
          lineHeight: 1.18,
          margin: 0,
          letterSpacing: '-0.03em'
        }}>
          Your <br />
          Complete <span style={{ color: '#7A1C28', fontStyle: 'italic', fontFamily: 'serif' }}>Learning</span> <br />
          Platform
        </h1>
        <p style={{
          margin: '0.45rem 0 0',
          fontSize: '0.85rem',
          color: '#555555',
          lineHeight: 1.45,
          fontWeight: 450
        }}>
          Notes, PYQs, Quizzes, Interviews, Resume Builder &amp; Ask Virus — All in One.
        </p>
      </div>

      {/* 2. SEARCH BAR */}
      <form 
        onSubmit={handleSearchSubmit}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #EBE5DB',
          padding: '0.35rem 0.4rem 0.35rem 1rem',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
          marginBottom: '1.25rem'
        }}
      >
        <Search size={18} color="#888888" style={{ marginRight: '0.6rem', flexShrink: 0 }} />
        <input 
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search notes, PYQs, topics..."
          aria-label="Search notes, PYQs, topics"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.86rem',
            color: '#1A1A1A',
            backgroundColor: 'transparent'
          }}
        />
        <button
          type="submit"
          aria-label="Submit search"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
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
          <Search size={16} />
        </button>
      </form>

      {/* 3. FEATURED "ASK VIRUS" CARD */}
      <div
        onClick={onOpenAI}
        style={{
          background: 'linear-gradient(135deg, #1A090E 0%, #3B121C 55%, #561826 100%)',
          borderRadius: '22px',
          padding: '1.25rem',
          color: '#FFFFFF',
          marginBottom: '1.35rem',
          boxShadow: '0 10px 28px rgba(90, 15, 25, 0.28)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          border: '1px solid rgba(246, 214, 220, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
          <div style={{ flex: 1, paddingRight: '0.5rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              backgroundColor: 'rgba(255, 255, 255, 0.14)',
              padding: '0.2rem 0.55rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#F9D8DE',
              letterSpacing: '0.02em',
              marginBottom: '0.45rem',
              backdropFilter: 'blur(4px)'
            }}>
              Ask Virus <Sparkles size={11} color="#FFD166" />
            </div>

            <h2 style={{
              margin: '0 0 0.3rem',
              fontSize: '1.15rem',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.02em'
            }}>
              Your AI Study Assistant
            </h2>

            <p style={{
              margin: 0,
              fontSize: '0.78rem',
              color: 'rgba(255, 255, 255, 0.82)',
              lineHeight: 1.35,
              fontWeight: 450,
              maxWidth: '190px'
            }}>
              Get instant, accurate answers to your doubts.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {/* Robot mascot image */}
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <img 
                src="/assets/hero_virus.png" 
                alt="Ask Virus Mascot" 
                style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                onError={(e) => {
                  e.currentTarget.src = '/assets/navbar_logo.png';
                }}
              />
            </div>

            {/* Circular Arrow Button */}
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. PRIMARY 6-CARD GRID (3 x 2) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.65rem',
        marginBottom: '1.45rem'
      }}>
        {featureCards.map((card) => {
          const IconComp = card.icon;
          return (
            <div
              key={card.id}
              onClick={card.action}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') card.action(); }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #ECE7E0',
                padding: '0.85rem 0.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '13px',
                backgroundColor: card.iconBg,
                border: `1.5px solid ${card.iconBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.iconColor,
                marginBottom: '0.5rem'
              }}>
                <IconComp size={20} strokeWidth={2.2} />
              </div>
              <div style={{
                fontSize: '0.84rem',
                fontWeight: 800,
                color: '#1C1E21',
                lineHeight: 1.15,
                letterSpacing: '-0.01em'
              }}>
                {card.title}
              </div>
              <div style={{
                fontSize: '0.68rem',
                color: '#71717A',
                marginTop: '0.15rem',
                lineHeight: 1.2
              }}>
                {card.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. TRENDING TOPICS */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: 800,
            color: '#1C1E21',
            letterSpacing: '-0.01em'
          }}>
            Trending Topics
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('notes')}
            style={{
              background: 'none',
              border: 'none',
              color: '#7A1C28',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              padding: 0
            }}
          >
            View All
          </button>
        </div>

        {/* TOPICS PILL WRAPPER */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          {trendingTopics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => handleTrendingClick(topic)}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #EAE4DA',
                borderRadius: '999px',
                padding: '0.42rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#2D3139',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                transition: 'all 0.15s ease'
              }}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
