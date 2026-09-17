import React, { useState } from 'react';
import { Search, Sun, Moon, Menu, X, ChevronDown, Sparkles, BookOpen, GraduationCap, Users, MessageSquare } from 'lucide-react';

export default function Navbar({ onSearch, onOpenAuth, activeTab, setActiveTab }) {
  const [theme, setTheme] = useState('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode');
  };

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'PYQs', id: 'pyqs' },
    { name: 'Notes', id: 'notes' },
    { name: 'Syllabus', id: 'syllabus' },
    { name: 'Quizzes', id: 'quizzes' },
    { name: 'AI Study', id: 'aistudy' },
    { name: 'Community', id: 'community' },
    { name: 'More', id: 'more' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: '#fbf9f3',
      borderBottom: '1px solid #eae5d9',
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* LEFT: Logo & Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #0e4d34',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
          }}>
            <img 
              src="/assets/navbar_logo.png" 
              alt="CampusPrep Mascot" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80';
              }}
            />
          </div>
          <div>
            <div style={{ 
              fontFamily: "'Outfit', sans-serif", 
              fontWeight: 800, 
              fontSize: '1.45rem', 
              color: '#0e4d34', 
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              Campus<span style={{ color: '#059669' }}>Prep</span>
            </div>
            <div style={{ 
              fontSize: '0.68rem', 
              fontWeight: 600, 
              color: '#64748b', 
              letterSpacing: '0.01em' 
            }}>
              Study Smart. Prepare Better.
            </div>
          </div>
        </div>

        {/* CENTER: Navigation Links (Desktop) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} className="desktop-nav">
          {navItems.map(item => {
            const isActive = activeTab === item.id;

            if (item.id === 'more') {
              return (
                <div key={item.id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      setActiveTab('more');
                      setMoreDropdownOpen(false);
                    }}
                    style={{
                      padding: '0.45rem 0.6rem 0.45rem 0.9rem',
                      borderRadius: '9999px 0 0 9999px',
                      border: 'none',
                      backgroundColor: isActive ? '#0e4d34' : 'transparent',
                      color: isActive ? '#ffffff' : '#334155',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = '#eae5d9';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    More
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMoreDropdownOpen(!moreDropdownOpen);
                    }}
                    title="More Tools Menu"
                    style={{
                      padding: '0.45rem 0.6rem 0.45rem 0.2rem',
                      borderRadius: '0 9999px 9999px 0',
                      border: 'none',
                      backgroundColor: isActive ? '#0e4d34' : 'transparent',
                      color: isActive ? '#ffffff' : '#334155',
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = '#eae5d9';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <ChevronDown size={14} />
                  </button>

                  {moreDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '110%',
                      right: 0,
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      minWidth: '180px',
                      padding: '0.5rem',
                      zIndex: 20
                    }}>
                      <button style={dropdownBtnStyle} onClick={() => { setActiveTab('more'); setMoreDropdownOpen(false); }}>
                        <BookOpen size={14} /> All Tools & Resources
                      </button>
                      <button style={dropdownBtnStyle} onClick={() => { setActiveTab('planner'); setMoreDropdownOpen(false); }}>
                        <BookOpen size={14} /> Study Planner
                      </button>
                      <button style={dropdownBtnStyle} onClick={() => { setActiveTab('progress'); setMoreDropdownOpen(false); }}>
                        <GraduationCap size={14} /> Progress Tracker
                      </button>
                      <button style={dropdownBtnStyle} onClick={() => { setActiveTab('contributors'); setMoreDropdownOpen(false); }}>
                        <Users size={14} /> Contributors
                      </button>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMoreDropdownOpen(false);
                }}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: isActive ? '#0e4d34' : 'transparent',
                  color: isActive ? '#ffffff' : '#334155',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = '#eae5d9';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Search, Theme, Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Quick Search Field */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', display: 'flex', alignItems: 'center' }} className="desktop-search">
            <Search size={15} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search subjects, topics, PYQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.45rem 0.8rem 0.45rem 2.2rem',
                borderRadius: '9999px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '0.82rem',
                width: '210px',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0e4d34';
                e.target.style.width = '240px';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.width = '210px';
              }}
            />
          </form>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {theme === 'light' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Login Button */}
          <button
            onClick={() => onOpenAuth('login')}
            className="btn-outline"
            style={{ fontSize: '0.84rem', padding: '0.45rem 1.1rem' }}
          >
            Login
          </button>

          {/* Sign Up Button */}
          <button
            onClick={() => onOpenAuth('signup')}
            className="btn-primary"
            style={{ fontSize: '0.84rem', padding: '0.45rem 1.15rem' }}
          >
            Sign Up
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              padding: '0.4rem',
              cursor: 'pointer',
              color: '#0e4d34'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
              style={{
                textAlign: 'left',
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === item.id ? '#0e4d34' : 'transparent',
                color: activeTab === item.id ? '#ffffff' : '#1e293b',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .desktop-search { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}

const dropdownBtnStyle = {
  width: '100%',
  textAlign: 'left',
  padding: '0.5rem 0.8rem',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: 'transparent',
  color: '#334155',
  fontSize: '0.85rem',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};
