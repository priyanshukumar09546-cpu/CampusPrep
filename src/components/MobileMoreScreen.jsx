import React, { useState, useEffect } from 'react';
import { 
  Bookmark, 
  Download, 
  BarChart2, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Crown, 
  ChevronRight, 
  Calendar, 
  Calculator, 
  Award, 
  Briefcase, 
  ShieldCheck, 
  FileText,
  Sliders,
  User
} from 'lucide-react';

export default function MobileMoreScreen({ onNavigate, onOpenAuth }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('professorvirus_user') || sessionStorage.getItem('professorvirus_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const displayName = user?.name || 'Priyanshu Kumar';
  const displayCourse = user?.course || 'BCA Student';

  const menuSections = [
    {
      id: 'bookmarks',
      label: 'My Bookmarks',
      icon: Bookmark,
      action: () => onNavigate('notes')
    },
    {
      id: 'downloads',
      label: 'My Downloads',
      icon: Download,
      action: () => onNavigate('pyqs')
    },
    {
      id: 'progress',
      label: 'Study Progress',
      icon: BarChart2,
      action: () => onNavigate('quizzes')
    },
    {
      id: 'timetable',
      label: 'Timetable & Attendance',
      icon: Calendar,
      action: () => onNavigate('timetable')
    },
    {
      id: 'scholarships',
      label: 'Scholarships & Opportunities',
      icon: Award,
      action: () => onNavigate('scholarships')
    },
    {
      id: 'cookies',
      label: 'Cookie & Privacy Preferences',
      icon: Sliders,
      action: () => {
        if (window.openCookieSettings) window.openCookieSettings();
      }
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      action: () => onNavigate('important-links')
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('professorvirus_token');
    localStorage.removeItem('professorvirus_user');
    sessionStorage.removeItem('professorvirus_token');
    sessionStorage.removeItem('professorvirus_user');
    window.dispatchEvent(new Event('auth_state_changed'));
    onNavigate('home');
  };

  return (
    <div 
      className="pv-mobile-more"
      style={{
        padding: '1rem 1rem 5.5rem',
        backgroundColor: '#FAF7F2',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. STUDENT PROFILE CARD */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '1.15rem 1.25rem',
        border: '1px solid #ECE7E0',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#F5ECEE',
          border: '2px solid #7A1C28',
          flexShrink: 0
        }}>
          <img 
            src="/assets/user_avatar_priyanshu.png" 
            alt="Student Avatar" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.05rem',
            fontWeight: 800,
            color: '#1C1E21',
            lineHeight: 1.2
          }}>
            {displayName}
          </h2>
          <div style={{
            fontSize: '0.78rem',
            color: '#71717A',
            marginTop: '0.15rem'
          }}>
            {displayCourse}
          </div>
          <button
            type="button"
            onClick={() => onNavigate('result-cgpa')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: '#7A1C28',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              marginTop: '0.35rem',
              cursor: 'pointer'
            }}
          >
            Academic Performance <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* 2. STAT COUNTERS (3 TILES) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.55rem',
        marginBottom: '1.15rem'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '0.85rem 0.5rem',
          textAlign: 'center',
          border: '1px solid #ECE7E0'
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#7A1C28' }}>12</div>
          <div style={{ fontSize: '0.68rem', color: '#71717A', marginTop: '0.1rem', fontWeight: 600 }}>Notes Saved</div>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '0.85rem 0.5rem',
          textAlign: 'center',
          border: '1px solid #ECE7E0'
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#C88D2D' }}>8</div>
          <div style={{ fontSize: '0.68rem', color: '#71717A', marginTop: '0.1rem', fontWeight: 600 }}>Quizzes Taken</div>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '0.85rem 0.5rem',
          textAlign: 'center',
          border: '1px solid #ECE7E0'
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#2563EB' }}>4</div>
          <div style={{ fontSize: '0.68rem', color: '#71717A', marginTop: '0.1rem', fontWeight: 600 }}>Interviews</div>
        </div>
      </div>

      {/* 3. UPGRADE TO PREMIUM BANNER */}
      <div 
        onClick={() => onNavigate('interview-pro')}
        style={{
          background: 'linear-gradient(135deg, #FFF8EC 0%, #FDF1DB 100%)',
          borderRadius: '18px',
          border: '1.5px solid #F6DFB5',
          padding: '1rem 1.15rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.25rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(200, 141, 45, 0.08)'
        }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          backgroundColor: '#FEF3C7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#D97706',
          flexShrink: 0
        }}>
          <Crown size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#92400E' }}>
            Upgrade to Premium
          </div>
          <div style={{ fontSize: '0.72rem', color: '#B45309', marginTop: '0.15rem' }}>
            Unlock AI mock interviews, ATS resume reviews &amp; more
          </div>
        </div>
        <ChevronRight size={16} color="#D97706" />
      </div>

      {/* 4. MENU ITEMS LIST */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #ECE7E0',
        overflow: 'hidden',
        marginBottom: '1.25rem'
      }}>
        {menuSections.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.95rem 1.15rem',
                border: 'none',
                borderBottom: idx < menuSections.length - 1 ? '1px solid #F4EFEB' : 'none',
                backgroundColor: '#FFFFFF',
                color: '#1C1E21',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <IconComp size={18} color="#7A1C28" />
                <span style={{ fontSize: '0.86rem', fontWeight: 650, color: '#27272A' }}>
                  {item.label}
                </span>
              </div>
              <ChevronRight size={15} color="#A1A1AA" />
            </button>
          );
        })}
      </div>

      {/* 5. LOGOUT ACTION */}
      <button
        type="button"
        onClick={handleLogout}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.85rem',
          borderRadius: '16px',
          border: '1.5px solid #F6D6DC',
          backgroundColor: '#FFF8F9',
          color: '#E11D48',
          fontSize: '0.86rem',
          fontWeight: 800,
          cursor: 'pointer',
          transition: 'all 0.18s ease'
        }}
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}
