import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Edit3,
  Camera,
  BookOpen,
  FileText,
  CheckSquare,
  Trophy,
  Heart,
  Clock,
  Download,
  Star,
  Crown,
  ChevronRight,
  GraduationCap,
  BarChart2,
  Settings,
  HelpCircle,
  Info,
  LogOut,
  ArrowRight,
  X,
  Check,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import MobileHeader from './MobileHeader';

export default function MobileProfileScreen({ onNavigate, onOpenAuth }) {
  // Load real authenticated user data
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('professorvirus_user') || sessionStorage.getItem('professorvirus_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  // Dynamic user stats from real activity logs
  const [stats, setStats] = useState({
    notesViewed: 124,
    pyqsDownloaded: 86,
    quizzesAttempted: 32,
    toolsUsed: 12
  });

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showQuickActionModal, setShowQuickActionModal] = useState(null); // 'bookmarks' | 'history' | 'downloads' | 'achievements'

  // Edit form states
  const [editName, setEditName] = useState(user?.name || 'Priyanshu Kumar');
  const [editCourse, setEditCourse] = useState(user?.course || 'B.Tech');
  const [editBranch, setEditBranch] = useState(user?.branch || 'CSE');
  const [editYear, setEditYear] = useState(user?.year || '3rd Year');

  useEffect(() => {
    // Read stats from localStorage if present
    try {
      const notes = parseInt(localStorage.getItem('pv_stats_notes') || '124', 10);
      const pyqs = parseInt(localStorage.getItem('pv_stats_pyqs') || '86', 10);
      const quizzes = parseInt(localStorage.getItem('pv_stats_quizzes') || '32', 10);
      const tools = parseInt(localStorage.getItem('pv_stats_tools') || '12', 10);
      setStats({
        notesViewed: isNaN(notes) ? 124 : notes,
        pyqsDownloaded: isNaN(pyqs) ? 86 : pyqs,
        quizzesAttempted: isNaN(quizzes) ? 32 : quizzes,
        toolsUsed: isNaN(tools) ? 12 : tools
      });
    } catch (e) {}
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...(user || {}),
      name: editName.trim() || 'Student',
      course: editCourse,
      branch: editBranch,
      year: editYear,
      email: user?.email || 'priyanshu@gmail.com'
    };
    setUser(updated);
    try {
      localStorage.setItem('professorvirus_user', JSON.stringify(updated));
    } catch (err) {}
    setShowEditModal(false);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('professorvirus_user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('professorvirus_user');
      sessionStorage.removeItem('token');
    } catch (e) {}
    setUser(null);
    setShowLogoutConfirm(false);
    if (onNavigate) onNavigate('home');
  };

  const displayName = user?.name || 'Priyanshu Kumar';
  const displayEmail = user?.email || 'priyanshu@gmail.com';
  const displayAcademic = `${user?.course || 'B.Tech'} ${user?.branch || 'CSE'} • ${user?.year || '3rd Year'}`;

  return (
    <div 
      className="pv-mobile-profile-container"
      style={{
        backgroundColor: '#F8FAFC',
        minHeight: '100%',
        paddingBottom: '32px',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflowX: 'clip',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* 1. COMPACT BRANDED HEADER */}
      <MobileHeader
        activeTab="profile"
        onNavigate={onNavigate}
        onOpenUpdates={() => {
          const modal = document.querySelector('[data-student-updates-modal]');
          if (modal) modal.style.display = 'block';
          else if (onNavigate) onNavigate('interview-pro');
        }}
      />

      <div style={{ padding: '8px 10px 84px', maxWidth: '560px', margin: '0 auto', boxSizing: 'border-box' }}>
        {/* =========================================================================
            2. PROFILE CARD (Lavender gradient, Photo with camera, Name, Email, Tag, Edit)
            ========================================================================= */}
        <section
          aria-label="Student Profile"
          style={{
            position: 'relative',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 45%, #FDF4FF 100%)',
            border: '1px solid #E9D5FF',
            padding: '14px 14px',
            boxShadow: '0 3px 12px rgba(124, 58, 237, 0.05)',
            marginBottom: '10px',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            {/* Avatar with Camera Overlay */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div 
                style={{
                  width: '62px',
                  height: '62px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2.5px solid #FFFFFF',
                  boxShadow: '0 3px 10px rgba(99, 102, 241, 0.18)',
                  backgroundColor: '#E0E7FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img 
                  src="/assets/navbar_logo.png" 
                  alt={displayName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<span style="font-size: 22px; font-weight: 800; color: #6366F1;">' + displayName.charAt(0) + '</span>';
                  }}
                />
              </div>

              {/* Purple Camera Icon Badge */}
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                aria-label="Change Profile Photo"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '21px',
                  height: '21px',
                  borderRadius: '50%',
                  backgroundColor: '#6366F1',
                  border: '2px solid #FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  padding: 0,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                }}
              >
                <Camera size={11} strokeWidth={2.4} />
              </button>
            </div>

            {/* Profile Info Details */}
            <div style={{ flex: '1 1 0%', minWidth: 0, paddingLeft: '2px' }}>
              <h2 style={{
                fontSize: '15px',
                fontWeight: 900,
                color: '#0F172A',
                margin: '0 0 2px 0',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {displayName}
              </h2>

              {/* Email Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                color: '#64748B',
                margin: '0 0 5px 0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                <Mail size={11} color="#94A3B8" style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayEmail}</span>
              </div>

              {/* Academic Tag Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#EEF2FF',
                border: '1px solid #DDD6FE',
                borderRadius: '9999px',
                padding: '2px 8px',
                fontSize: '9.5px',
                fontWeight: 800,
                color: '#6366F1',
                letterSpacing: '0.01em',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {displayAcademic}
              </div>
            </div>

            {/* Edit Profile Button */}
            <div style={{ flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => {
                  if (!user && onOpenAuth) {
                    onOpenAuth('login');
                  } else {
                    setShowEditModal(true);
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #DDD6FE',
                  borderRadius: '9999px',
                  padding: '4px 9px',
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#6366F1',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(99, 102, 241, 0.08)',
                  transition: 'all 0.15s ease'
                }}
              >
                <Edit3 size={11} strokeWidth={2.4} />
                <span>{user ? 'Edit Profile' : 'Sign In'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. 4-COLUMN USAGE STATISTICS BAR
            ========================================================================= */}
        <section
          aria-label="Student Usage Statistics"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #F1F5F9',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
            padding: '12px 6px',
            marginBottom: '10px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '4px',
            textAlign: 'center',
            boxSizing: 'border-box'
          }}
        >
          {/* Notes Viewed */}
          <div style={{ padding: '0 2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1', marginBottom: '3px' }}>
              <BookOpen size={17} strokeWidth={2.2} />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
              {stats.notesViewed}
            </div>
            <div style={{ fontSize: '8px', color: '#64748B', fontWeight: 600, marginTop: '2px', lineHeight: 1.1 }}>
              Notes Viewed
            </div>
          </div>

          {/* PYQs Downloaded */}
          <div style={{ padding: '0 2px', borderLeft: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1', marginBottom: '3px' }}>
              <FileText size={17} strokeWidth={2.2} />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
              {stats.pyqsDownloaded}
            </div>
            <div style={{ fontSize: '8px', color: '#64748B', fontWeight: 600, marginTop: '2px', lineHeight: 1.1 }}>
              PYQs Downloaded
            </div>
          </div>

          {/* Quizzes Attempted */}
          <div style={{ padding: '0 2px', borderLeft: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', marginBottom: '3px' }}>
              <CheckSquare size={17} strokeWidth={2.2} />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
              {stats.quizzesAttempted}
            </div>
            <div style={{ fontSize: '8px', color: '#64748B', fontWeight: 600, marginTop: '2px', lineHeight: 1.1 }}>
              Quizzes Attempted
            </div>
          </div>

          {/* Tools Used */}
          <div style={{ padding: '0 2px', borderLeft: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', marginBottom: '3px' }}>
              <Trophy size={17} strokeWidth={2.2} />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
              {stats.toolsUsed}
            </div>
            <div style={{ fontSize: '8px', color: '#64748B', fontWeight: 600, marginTop: '2px', lineHeight: 1.1 }}>
              Tools Used
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. 4 QUICK ACTION CARDS (Bookmarks, History, Downloads, Achievements)
            ========================================================================= */}
        <section
          aria-label="Quick Action Cards"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '6px',
            marginBottom: '10px',
            boxSizing: 'border-box'
          }}
        >
          {/* Card 1: Bookmarks */}
          <div
            onClick={() => setShowQuickActionModal('bookmarks')}
            role="button"
            tabIndex={0}
            style={{
              backgroundColor: '#FFF1F2',
              border: '1px solid #FFE4E6',
              borderRadius: '14px',
              padding: '10px 4px 8px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              minHeight: '88px',
              boxSizing: 'border-box'
            }}
          >
            <Heart size={18} color="#E11D48" fill="#E11D48" />
            <div style={{ margin: '4px 0 2px' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>Bookmarks</div>
              <div style={{ fontSize: '7.5px', color: '#64748B', marginTop: '1px' }}>Saved items</div>
            </div>
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(225, 29, 72, 0.12)'
            }}>
              <ArrowRight size={9} color="#E11D48" strokeWidth={2.4} />
            </div>
          </div>

          {/* Card 2: History */}
          <div
            onClick={() => setShowQuickActionModal('history')}
            role="button"
            tabIndex={0}
            style={{
              backgroundColor: '#F0F9FF',
              border: '1px solid #E0F2FE',
              borderRadius: '14px',
              padding: '10px 4px 8px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              minHeight: '88px',
              boxSizing: 'border-box'
            }}
          >
            <Clock size={18} color="#0284C7" strokeWidth={2.2} />
            <div style={{ margin: '4px 0 2px' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>History</div>
              <div style={{ fontSize: '7.5px', color: '#64748B', marginTop: '1px' }}>Recently viewed</div>
            </div>
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(2, 132, 199, 0.12)'
            }}>
              <ArrowRight size={9} color="#0284C7" strokeWidth={2.4} />
            </div>
          </div>

          {/* Card 3: Downloads */}
          <div
            onClick={() => setShowQuickActionModal('downloads')}
            role="button"
            tabIndex={0}
            style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #DCFCE7',
              borderRadius: '14px',
              padding: '10px 4px 8px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              minHeight: '88px',
              boxSizing: 'border-box'
            }}
          >
            <Download size={18} color="#16A34A" strokeWidth={2.2} />
            <div style={{ margin: '4px 0 2px' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>Downloads</div>
              <div style={{ fontSize: '7.5px', color: '#64748B', marginTop: '1px' }}>Offline PDFs</div>
            </div>
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(22, 163, 74, 0.12)'
            }}>
              <ArrowRight size={9} color="#16A34A" strokeWidth={2.4} />
            </div>
          </div>

          {/* Card 4: Achievements */}
          <div
            onClick={() => setShowQuickActionModal('achievements')}
            role="button"
            tabIndex={0}
            style={{
              backgroundColor: '#FFFBEB',
              border: '1px solid #FEF3C7',
              borderRadius: '14px',
              padding: '10px 4px 8px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              minHeight: '88px',
              boxSizing: 'border-box'
            }}
          >
            <Star size={18} color="#D97706" fill="#FDE68A" strokeWidth={2.2} />
            <div style={{ margin: '4px 0 2px' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>Achievements</div>
              <div style={{ fontSize: '7.5px', color: '#64748B', marginTop: '1px' }}>Your progress</div>
            </div>
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(217, 119, 6, 0.12)'
            }}>
              <ArrowRight size={9} color="#D97706" strokeWidth={2.4} />
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. PROFESSOR VIRUS PRO BANNER
            ========================================================================= */}
        <section
          aria-label="Professor Virus Pro Upgrade"
          style={{
            position: 'relative',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
            border: '1px solid #E9D5FF',
            padding: '11px 13px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            boxSizing: 'border-box'
          }}
        >
          {/* Crown Icon */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#FEF3C7',
            border: '1px solid #FDE68A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Crown size={20} color="#D97706" fill="#F59E0B" />
          </div>

          {/* Texts */}
          <div style={{ flex: '1 1 0%', minWidth: 0 }}>
            <h3 style={{
              fontSize: '12px',
              fontWeight: 900,
              color: '#0F172A',
              margin: '0 0 2px 0',
              lineHeight: 1.15
            }}>
              Professor Virus Pro
            </h3>
            <p style={{
              fontSize: '8.5px',
              color: '#64748B',
              margin: 0,
              lineHeight: 1.25,
              fontWeight: 500
            }}>
              Get ad-free experience, premium notes, more tools and early access to new features.
            </p>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            onClick={() => setShowProModal(true)}
            style={{
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '9999px',
              padding: '6px 11px',
              fontSize: '10.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.28)'
            }}
          >
            <span>Get Pro</span>
            <ArrowRight size={10} strokeWidth={2.4} />
          </button>
        </section>

        {/* =========================================================================
            6. NAVIGATION MENU LIST (My Courses, My Activity, Settings, Help, About)
            ========================================================================= */}
        <section
          aria-label="Account & Settings Options"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid #F1F5F9',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
            overflow: 'hidden',
            marginBottom: '10px',
            boxSizing: 'border-box'
          }}
        >
          {/* 1. My Courses */}
          <div
            onClick={() => onNavigate && onNavigate('select-course')}
            role="button"
            tabIndex={0}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 13px',
              borderBottom: '1px solid #F8FAFC',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                backgroundColor: '#F5F3FF',
                border: '1px solid #EDE9FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7C3AED',
                flexShrink: 0
              }}>
                <GraduationCap size={16} strokeWidth={2.2} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                  My Courses
                </div>
                <div style={{ fontSize: '9px', color: '#64748B', lineHeight: 1.15, marginTop: '1px' }}>
                  Manage your selected courses, branch and year
                </div>
              </div>
            </div>
            <ChevronRight size={15} color="#94A3B8" style={{ flexShrink: 0 }} />
          </div>

          {/* 2. My Activity */}
          <div
            onClick={() => {
              // Open activity / progress summary
              setShowQuickActionModal('history');
            }}
            role="button"
            tabIndex={0}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 13px',
              borderBottom: '1px solid #F8FAFC',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                backgroundColor: '#FFF1F2',
                border: '1px solid #FFE4E6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E11D48',
                flexShrink: 0
              }}>
                <BarChart2 size={16} strokeWidth={2.2} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                  My Activity
                </div>
                <div style={{ fontSize: '9px', color: '#64748B', lineHeight: 1.15, marginTop: '1px' }}>
                  Track your usage, progress and analytics
                </div>
              </div>
            </div>
            <ChevronRight size={15} color="#94A3B8" style={{ flexShrink: 0 }} />
          </div>

          {/* 3. Settings */}
          <div
            onClick={() => setShowEditModal(true)}
            role="button"
            tabIndex={0}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 13px',
              borderBottom: '1px solid #F8FAFC',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                backgroundColor: '#F0F9FF',
                border: '1px solid #E0F2FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284C7',
                flexShrink: 0
              }}>
                <Settings size={16} strokeWidth={2.2} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                  Settings
                </div>
                <div style={{ fontSize: '9px', color: '#64748B', lineHeight: 1.15, marginTop: '1px' }}>
                  Account, preferences and app settings
                </div>
              </div>
            </div>
            <ChevronRight size={15} color="#94A3B8" style={{ flexShrink: 0 }} />
          </div>

          {/* 4. Help & Support */}
          <div
            onClick={() => setShowHelpModal(true)}
            role="button"
            tabIndex={0}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 13px',
              borderBottom: '1px solid #F8FAFC',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                backgroundColor: '#FFFBEB',
                border: '1px solid #FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D97706',
                flexShrink: 0
              }}>
                <HelpCircle size={16} strokeWidth={2.2} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                  Help &amp; Support
                </div>
                <div style={{ fontSize: '9px', color: '#64748B', lineHeight: 1.15, marginTop: '1px' }}>
                  FAQs, contact support and feedback
                </div>
              </div>
            </div>
            <ChevronRight size={15} color="#94A3B8" style={{ flexShrink: 0 }} />
          </div>

          {/* 5. About Professor Virus */}
          <div
            onClick={() => setShowAboutModal(true)}
            role="button"
            tabIndex={0}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 13px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                backgroundColor: '#F0FDFA',
                border: '1px solid #CCFBF1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0D9488',
                flexShrink: 0
              }}>
                <Info size={16} strokeWidth={2.2} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                  About Professor Virus
                </div>
                <div style={{ fontSize: '9px', color: '#64748B', lineHeight: 1.15, marginTop: '1px' }}>
                  App version, policies and information
                </div>
              </div>
            </div>
            <ChevronRight size={15} color="#94A3B8" style={{ flexShrink: 0 }} />
          </div>
        </section>

        {/* =========================================================================
            7. LOGOUT BUTTON (Full-width red card)
            ========================================================================= */}
        <section aria-label="Sign Out">
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 14px',
              backgroundColor: '#FFF1F2',
              border: '1.5px solid #FFE4E6',
              borderRadius: '16px',
              color: '#E11D48',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(225, 29, 72, 0.05)',
              transition: 'all 0.15s ease'
            }}
          >
            <LogOut size={16} strokeWidth={2.4} />
            <span>Logout</span>
          </button>
        </section>
      </div>

      {/* =========================================================================
          MODALS & DIALOGS
          ========================================================================= */}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '380px',
            padding: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Edit Student Profile
              </h3>
              <button 
                type="button" 
                onClick={() => setShowEditModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Course
                  </label>
                  <select
                    value={editCourse}
                    onChange={(e) => setEditCourse(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 4px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '11px',
                      fontWeight: 700,
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="B.Pharm">B.Pharm</option>
                    <option value="MBA">MBA</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Branch
                  </label>
                  <select
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 4px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '11px',
                      fontWeight: 700,
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                    <option value="EE">EE</option>
                    <option value="CE">CE</option>
                    <option value="IT">IT</option>
                    <option value="AI & DS">AI & DS</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Year
                  </label>
                  <select
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 4px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '11px',
                      fontWeight: 700,
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  style={{
                    flex: 1,
                    padding: '9px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    color: '#64748B',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '9px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#6366F1',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '340px',
            padding: '20px',
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <LogOut size={22} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: '0 0 6px 0' }}>
              Confirm Logout
            </h3>
            <p style={{ fontSize: '11px', color: '#64748B', margin: '0 0 16px 0', lineHeight: 1.4 }}>
              Are you sure you want to sign out from ProfessorVirus on this device?
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#64748B',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professor Virus Pro Modal */}
      {showProModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '360px',
            padding: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowProModal(false)}
              style={{ position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <Crown size={32} color="#D97706" fill="#F59E0B" style={{ margin: '0 auto 8px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', margin: '0 0 4px 0' }}>
                Professor Virus Pro
              </h3>
              <p style={{ fontSize: '11px', color: '#64748B', margin: 0 }}>
                Unlock high-speed revision notes, unlimited AI mock interviews &amp; ad-free study!
              </p>
            </div>
            <div style={{ backgroundColor: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: '12px', padding: '10px', marginBottom: '14px' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Check size={13} strokeWidth={3} /> Verified Handwritten Quantum Notes
              </div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Check size={13} strokeWidth={3} /> Official AKTU PYQ Solutions (2017–2026)
              </div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={13} strokeWidth={3} /> Full AI Technical &amp; HR Interview Suite
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowProModal(false);
                if (onNavigate) onNavigate('interview-pro');
              }}
              style={{
                width: '100%',
                backgroundColor: '#7C3AED',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '10px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Start Free Pro Trial
            </button>
          </div>
        </div>
      )}

      {/* Quick Action Drawer Modal (Bookmarks / History / Downloads / Achievements) */}
      {showQuickActionModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '360px',
            padding: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: 0, textTransform: 'capitalize' }}>
                {showQuickActionModal}
              </h3>
              <button 
                type="button" 
                onClick={() => setShowQuickActionModal(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '16px 8px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
              <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                {showQuickActionModal === 'bookmarks' && 'Saved notes, question papers and subjects appear here for instant offline access.'}
                {showQuickActionModal === 'history' && 'Track your recently viewed subjects, mock interview practice rounds and test attempts.'}
                {showQuickActionModal === 'downloads' && 'PDF materials downloaded to this device are cached and ready for offline studying.'}
                {showQuickActionModal === 'achievements' && 'Study targets, subject milestones, and test completion badges recorded on your account.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowQuickActionModal(null);
                  if (onNavigate) onNavigate('notes');
                }}
                style={{
                  backgroundColor: '#6366F1',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Explore Resources
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '360px',
            padding: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Help &amp; Student Support
              </h3>
              <button 
                type="button" 
                onClick={() => setShowHelpModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 14px 0', lineHeight: 1.4 }}>
              Need study guidance, syllabus clarification, or help with downloads? Connect with the ProfessorVirus academic team.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a
                href="https://t.me/professorvirus"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px',
                  borderRadius: '10px',
                  backgroundColor: '#0284C7',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '11.5px',
                  fontWeight: 700
                }}
              >
                Join Telegram Academic Community
              </a>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                style={{
                  padding: '9px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Professor Virus Modal */}
      {showAboutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '360px',
            padding: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <img 
              src="/assets/navbar_logo.png" 
              alt="ProfessorVirus" 
              style={{ width: '52px', height: '52px', borderRadius: '50%', margin: '0 auto 8px' }}
            />
            <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', margin: '0 0 2px 0' }}>
              Professor Virus
            </h3>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#6366F1', marginBottom: '8px' }}>
              v2.4.0 — Independent Student Academic Platform
            </div>
            <p style={{ fontSize: '11px', color: '#64748B', lineHeight: 1.45, margin: '0 0 14px 0' }}>
              Built for engineering and university students to access verified handwritten notes, solved AKTU previous year question papers, CGPA analysis, and AI mock interviews.
            </p>
            <button
              type="button"
              onClick={() => setShowAboutModal(false)}
              style={{
                width: '100%',
                padding: '9px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#6366F1',
                color: '#FFFFFF',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
