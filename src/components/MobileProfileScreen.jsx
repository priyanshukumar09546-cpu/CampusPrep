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
  ExternalLink,
  ShieldCheck,
  Target
} from 'lucide-react';
import MobileHeader from './MobileHeader';
import { fetchProgressSummary } from '../utils/progressTracker';
import { openInstallModal } from '../utils/pwaManager';

export default function MobileProfileScreen({ onNavigate, onOpenAuth }) {
  // Load real authenticated user data from multiple supported keys
  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem('professorvirus_user') || 
                     sessionStorage.getItem('professorvirus_user') ||
                     localStorage.getItem('campusprep_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {}
    return null;
  };

  const [user, setUser] = useState(getStoredUser);
  const [avatarError, setAvatarError] = useState(false);

  // Dynamic user stats from real activity logs (starts at 0, zero fake numbers)
  const [stats, setStats] = useState({
    notesViewed: 0,
    pyqsDownloaded: 0,
    quizzesAttempted: 0,
    toolsUsed: 0
  });

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showQuickActionModal, setShowQuickActionModal] = useState(null); // 'bookmarks' | 'history' | 'downloads' | 'achievements'

  // Edit form states initialized from actual user if present
  const [editName, setEditName] = useState(user?.name || '');
  const [editCourse, setEditCourse] = useState(user?.course || 'B.Tech');
  const [editBranch, setEditBranch] = useState(user?.branch || 'CSE');
  const [editYear, setEditYear] = useState(user?.year || '1st Year');

  // React to auth changes
  useEffect(() => {
    const syncUser = () => {
      const u = getStoredUser();
      setUser(u);
      if (u) {
        setEditName(u.name || '');
        setEditCourse(u.course || 'B.Tech');
        setEditBranch(u.branch || 'CSE');
        setEditYear(u.year || '1st Year');
      }
    };
    window.addEventListener('auth_state_changed', syncUser);
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener('auth_state_changed', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  // Fetch real statistics from progress tracker API for authenticated user
  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const res = await fetchProgressSummary();
        if (isMounted && res?.summary) {
          const s = res.summary;
          setStats({
            notesViewed: Number(s.notesRead) || 0,
            pyqsDownloaded: Number(s.pyqsSolved || s.pyqsAttempted) || 0,
            quizzesAttempted: Number(s.quizAttempts) || 0,
            toolsUsed: s.totalStudyMinutes ? Math.round(s.totalStudyMinutes / 60) : 0
          });
        }
      } catch (e) {
        console.warn('[MobileProfileScreen] Failed to load stats:', e);
      }
    }
    if (user) {
      loadStats();
    }
    return () => { isMounted = false; };
  }, [user]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...(user || {}),
      name: editName.trim() || user?.name || 'Student',
      course: editCourse,
      branch: editBranch,
      year: editYear,
      email: user?.email || ''
    };
    setUser(updated);
    try {
      localStorage.setItem('professorvirus_user', JSON.stringify(updated));
      sessionStorage.setItem('professorvirus_user', JSON.stringify(updated));
      window.dispatchEvent(new Event('auth_state_changed'));
    } catch (err) {}
    setShowEditModal(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {}
    try {
      localStorage.removeItem('professorvirus_user');
      localStorage.removeItem('professorvirus_token');
      localStorage.removeItem('campusprep_auth_user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('professorvirus_user');
      sessionStorage.removeItem('professorvirus_token');
      sessionStorage.removeItem('token');
      window.dispatchEvent(new Event('auth_state_changed'));
    } catch (e) {}
    setUser(null);
    setShowLogoutConfirm(false);
    if (onNavigate) onNavigate('home');
  };

  const displayName = user?.name || user?.email?.split('@')[0] || 'Student';
  const displayEmail = user?.email || '';
  const displayAcademic = `${user?.course || 'B.Tech'} ${user?.branch ? user.branch + ' • ' : ''}${user?.year || '1st Year'}`;

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
            2. GUEST STUDENT VIEW (When Unauthenticated) vs STUDENT PROFILE (Authenticated)
            ========================================================================= */}
        {!user ? (
          <>
            {/* Guest Welcome & Sign In Card */}
            <section
              aria-label="Student Guest Profile"
              style={{
                position: 'relative',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #FFFDFB 0%, #FDF8F3 45%, #FBF3EB 100%)',
                border: '1px solid #E9D9CC',
                padding: '18px 16px',
                boxShadow: '0 3px 12px rgba(134, 24, 32, 0.05)',
                marginBottom: '10px',
                boxSizing: 'border-box',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#FDF2F2',
                  border: '2.5px solid #FFFFFF',
                  boxShadow: '0 3px 10px rgba(134, 24, 32, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                  color: '#861820'
                }}
              >
                <User size={30} strokeWidth={2.2} />
              </div>

              <h2 style={{
                fontSize: '17px',
                fontWeight: 900,
                color: '#0F172A',
                margin: '0 0 4px 0',
                lineHeight: 1.2
              }}>
                Guest Student
              </h2>

              <p style={{
                fontSize: '11px',
                color: '#64748B',
                margin: '0 0 16px 0',
                lineHeight: 1.45,
                padding: '0 8px'
              }}>
                Sign in to track your real study hours, note reading history, solved question papers, and test scores with zero fake data.
              </p>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => onOpenAuth ? onOpenAuth('login') : (onNavigate ? onNavigate('signin') : null)}
                  style={{
                    flex: 1,
                    maxWidth: '150px',
                    backgroundColor: '#7A2327',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(122, 35, 39, 0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <span>Sign In</span>
                  <ArrowRight size={12} strokeWidth={2.4} />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAuth ? onOpenAuth('signup') : (onNavigate ? onNavigate('signup') : null)}
                  style={{
                    flex: 1,
                    maxWidth: '150px',
                    backgroundColor: '#FFFFFF',
                    color: '#7A2327',
                    border: '1.5px solid #7A2327',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  Create Account
                </button>
              </div>
            </section>

            {/* Account Benefits Card */}
            <section
              aria-label="Features with Account"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid #F1F5F9',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
                padding: '14px',
                marginBottom: '10px',
                boxSizing: 'border-box'
              }}
            >
              <h3 style={{ fontSize: '13px', fontWeight: 900, color: '#0F172A', margin: '0 0 10px 0' }}>
                Included with Your Account
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
                <div style={{ padding: '9px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <BarChart2 size={13} color="#861820" /> Real Analytics
                  </div>
                  <div style={{ fontSize: '9px', color: '#64748B', lineHeight: 1.3 }}>
                    Live study timer, streaks and exam readiness metrics.
                  </div>
                </div>

                <div style={{ padding: '9px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <BookOpen size={13} color="#059669" /> Notes History
                  </div>
                  <div style={{ fontSize: '9px', color: '#64748B', lineHeight: 1.3 }}>
                    Resume reading verified handwritten unit notes.
                  </div>
                </div>

                <div style={{ padding: '9px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileText size={13} color="#DC2626" /> PYQ Tracker
                  </div>
                  <div style={{ fontSize: '9px', color: '#64748B', lineHeight: 1.3 }}>
                    Save official AKTU papers and mark solved questions.
                  </div>
                </div>

                <div style={{ padding: '9px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={13} color="#D97706" /> AI Interviews
                  </div>
                  <div style={{ fontSize: '9px', color: '#64748B', lineHeight: 1.3 }}>
                    Aptitude, coding, technical & HR mock rounds.
                  </div>
                </div>
              </div>
            </section>

            {/* Menu List for Guest */}
            <section
              aria-label="Academic Navigation"
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
              {/* My Courses */}
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
                    width: '32px', height: '32px', borderRadius: '9px', backgroundColor: '#FDF2F2',
                    border: '1px solid #E9D9CC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#861820', flexShrink: 0
                  }}>
                    <GraduationCap size={16} strokeWidth={2.2} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                      Choose Course & Year
                    </div>
                    <div style={{ fontSize: '9px', color: '#64748B', lineHeight: 1.15, marginTop: '1px' }}>
                      B.Tech, BCA, MCA, MBA, B.Pharm and all 24 programmes
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" style={{ flexShrink: 0 }} />
              </div>

              {/* Help & Support */}
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
                    width: '32px', height: '32px', borderRadius: '9px', backgroundColor: '#FFFBEB',
                    border: '1px solid #FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', flexShrink: 0
                  }}>
                    <HelpCircle size={16} strokeWidth={2.2} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                      Help &amp; Student Support
                    </div>
                    <div style={{ fontSize: '9px', color: '#64748B', lineHeight: 1.15, marginTop: '1px' }}>
                      FAQs, contact support and telegram community
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" style={{ flexShrink: 0 }} />
              </div>

              {/* About Professor Virus */}
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
                    width: '32px', height: '32px', borderRadius: '9px', backgroundColor: '#F0FDFA',
                    border: '1px solid #CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0D9488', flexShrink: 0
                  }}>
                    <Info size={16} strokeWidth={2.2} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                      About Professor Virus
                    </div>
                    <div style={{ fontSize: '9px', color: '#64748B', lineHeight: 1.15, marginTop: '1px' }}>
                      App version, policies and academic mission
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" style={{ flexShrink: 0 }} />
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Authenticated Student Profile Card */}
            <section
              aria-label="Student Profile"
              style={{
                position: 'relative',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #FFFDFB 0%, #FDF8F3 45%, #FBF3EB 100%)',
                border: '1px solid #E9D9CC',
                padding: '14px 14px',
                boxShadow: '0 3px 12px rgba(134, 24, 32, 0.05)',
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
                      boxShadow: '0 3px 10px rgba(134, 24, 32, 0.18)',
                      backgroundColor: '#FDF2F2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {!avatarError ? (
                      <img 
                        src="/assets/navbar_logo.png" 
                        alt={displayName} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <span style={{ fontSize: '22px', fontWeight: 800, color: '#861820' }}>
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Burgundy Camera Icon Badge */}
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
                      backgroundColor: '#861820',
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
                  {displayEmail && (
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
                  )}

                  {/* Academic Tag Pill */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: '#FDF2F2',
                    border: '1px solid #E9D9CC',
                    borderRadius: '9999px',
                    padding: '2px 8px',
                    fontSize: '9.5px',
                    fontWeight: 800,
                    color: '#861820',
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
                    onClick={() => setShowEditModal(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E9D9CC',
                      borderRadius: '9999px',
                      padding: '4px 9px',
                      fontSize: '10px',
                      fontWeight: 800,
                      color: '#861820',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(134, 24, 32, 0.08)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Edit3 size={11} strokeWidth={2.4} />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            </section>

            {/* 3. 4-COLUMN USAGE STATISTICS BAR (Real metrics) */}
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#861820', marginBottom: '3px' }}>
                  <BookOpen size={17} strokeWidth={2.2} />
                </div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                  {stats.notesViewed}
                </div>
                <div style={{ fontSize: '8px', color: '#64748B', fontWeight: 600, marginTop: '2px', lineHeight: 1.1 }}>
                  Notes Read
                </div>
              </div>

              {/* PYQs Downloaded / Solved */}
              <div style={{ padding: '0 2px', borderLeft: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#861820', marginBottom: '3px' }}>
                  <FileText size={17} strokeWidth={2.2} />
                </div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                  {stats.pyqsDownloaded}
                </div>
                <div style={{ fontSize: '8px', color: '#64748B', fontWeight: 600, marginTop: '2px', lineHeight: 1.1 }}>
                  PYQs Solved
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
                  Quizzes Taken
                </div>
              </div>

              {/* Study Hours / Tools Used */}
              <div style={{ padding: '0 2px', borderLeft: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', marginBottom: '3px' }}>
                  <Trophy size={17} strokeWidth={2.2} />
                </div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A', lineHeight: 1.1 }}>
                  {stats.toolsUsed}
                </div>
                <div style={{ fontSize: '8px', color: '#64748B', fontWeight: 600, marginTop: '2px', lineHeight: 1.1 }}>
                  Study Hours
                </div>
              </div>
            </section>

            {/* 4. 4 QUICK ACTION CARDS */}
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
                  width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(225, 29, 72, 0.12)'
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
                  <div style={{ fontSize: '7.5px', color: '#64748B', marginTop: '1px' }}>Recent activity</div>
                </div>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(2, 132, 199, 0.12)'
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
                  width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(22, 163, 74, 0.12)'
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
                  <div style={{ fontSize: '7.5px', color: '#64748B', marginTop: '1px' }}>Streaks & goals</div>
                </div>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(217, 119, 6, 0.12)'
                }}>
                  <ArrowRight size={9} color="#D97706" strokeWidth={2.4} />
                </div>
              </div>
            </section>

            {/* 5. PROFESSOR VIRUS PRO BANNER */}
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
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FEF3C7',
                border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Crown size={20} color="#D97706" fill="#F59E0B" />
              </div>

              <div style={{ flex: '1 1 0%', minWidth: 0 }}>
                <h3 style={{ fontSize: '12px', fontWeight: 900, color: '#0F172A', margin: '0 0 2px 0', lineHeight: 1.15 }}>
                  Professor Virus Pro
                </h3>
                <p style={{ fontSize: '8.5px', color: '#64748B', margin: 0, lineHeight: 1.25, fontWeight: 500 }}>
                  Get ad-free experience, premium notes, more tools and early access to new features.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowProModal(true)}
                style={{
                  backgroundColor: '#861820',
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
                  boxShadow: '0 2px 8px rgba(134, 24, 32, 0.28)'
                }}
              >
                <span>Get Pro</span>
                <ArrowRight size={10} strokeWidth={2.4} />
              </button>
            </section>

            {/* 6. NAVIGATION MENU LIST */}
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
              {/* 0. Install App (Universal Android & iOS PWA) */}
              <div
                onClick={() => openInstallModal('mobile_profile_menu')}
                role="button"
                tabIndex={0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 13px',
                  borderBottom: '1px solid #F8FAFC',
                  backgroundColor: '#FFFDF9',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '9px', backgroundColor: '#FEF3C7',
                    border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B45309', flexShrink: 0
                  }}>
                    <Download size={16} strokeWidth={2.4} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                        Install App
                      </span>
                      <span style={{ fontSize: '8.5px', fontWeight: 800, backgroundColor: '#861820', color: '#FFFFFF', padding: '1px 5px', borderRadius: '4px' }}>
                        Fast PWA
                      </span>
                    </div>
                    <div style={{ fontSize: '9px', color: '#64748B', lineHeight: 1.15, marginTop: '1px' }}>
                      Add Professor Virus to your Android or iPhone home screen
                    </div>
                  </div>
                </div>
                <ChevronRight size={15} color="#94A3B8" style={{ flexShrink: 0 }} />
              </div>

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
                    width: '32px', height: '32px', borderRadius: '9px', backgroundColor: '#FDF2F2',
                    border: '1px solid #E9D9CC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#861820', flexShrink: 0
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
                onClick={() => setShowQuickActionModal('history')}
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
                    width: '32px', height: '32px', borderRadius: '9px', backgroundColor: '#FFF1F2',
                    border: '1px solid #FFE4E6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E11D48', flexShrink: 0
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
                    width: '32px', height: '32px', borderRadius: '9px', backgroundColor: '#F0F9FF',
                    border: '1px solid #E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7', flexShrink: 0
                  }}>
                    <Settings size={16} strokeWidth={2.2} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                      Settings
                    </div>
                    <div style={{ fontSize: '9px', color: '#64748B', lineHeight: 1.15, marginTop: '1px' }}>
                      Account, preferences and profile details
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
                    width: '32px', height: '32px', borderRadius: '9px', backgroundColor: '#FFFBEB',
                    border: '1px solid #FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', flexShrink: 0
                  }}>
                    <HelpCircle size={16} strokeWidth={2.2} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                      Help &amp; Student Support
                    </div>
                    <div style={{ fontSize: '9px', color: '#64748B', lineHeight: 1.15, marginTop: '1px' }}>
                      FAQs, contact support and telegram community
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
                    width: '32px', height: '32px', borderRadius: '9px', backgroundColor: '#F0FDFA',
                    border: '1px solid #CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0D9488', flexShrink: 0
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

            {/* 7. LOGOUT BUTTON (Only for Authenticated Students) */}
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
          </>
        )}
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
                    backgroundColor: '#861820',
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
            <div style={{ backgroundColor: '#FFFDF9', border: '1px solid #E9D9CC', borderRadius: '12px', padding: '10px', marginBottom: '14px' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#861820', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Check size={13} strokeWidth={3} /> Verified Handwritten Quantum Notes
              </div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#861820', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Check size={13} strokeWidth={3} /> Official AKTU PYQ Solutions (2017–2026)
              </div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#861820', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                backgroundColor: '#861820',
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
                  backgroundColor: '#861820',
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
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#861820', marginBottom: '8px' }}>
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
                backgroundColor: '#861820',
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
