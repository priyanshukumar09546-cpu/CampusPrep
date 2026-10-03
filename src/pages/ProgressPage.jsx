// ============================================================================
// PROFESSORVIRUS — STUDENT PROGRESS & ANALYTICS DASHBOARD
// Complete Production Implementation matching reference design & color scheme
// Zero fake data — every metric calculated from actual authenticated user activity
// ============================================================================

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Clock, BookOpen, FileText, CheckCircle2, Award, Target,
  TrendingUp, BarChart3, PieChart, Activity, Flame, Trophy,
  ChevronRight, Plus, Play, Square, Pause, RefreshCw,
  Calendar as CalendarIcon, Star, Zap, ArrowUpRight, ArrowDownRight, Minus,
  X, Check, AlertCircle, Sparkles, Eye, ListChecks, Brain,
  ChevronLeft, ArrowRight, ShieldCheck, Lock, Unlock, HelpCircle
} from 'lucide-react';
import {
  fetchProgressSummary, fetchStudyTimeTrend, fetchQuizPerformance,
  fetchNotesActivity, fetchPYQsActivity, fetchTopicsProgress,
  toggleTopicProgress, fetchCalendarData, fetchInsights,
  startStudySession, stopStudySession, getActiveSession,
  createGoal, updateGoal
} from '../utils/progressTracker';
import { AKTU_SYLLABUS_DATA } from '../data/aktuSyllabusData';

// ============================================================================
// FORMATTERS & HELPERS
// ============================================================================
function fmtMinutes(m) {
  if (!m || m < 1) return '0 min';
  if (m < 60) return `${Math.round(m)} min`;
  const h = Math.floor(m / 60);
  const min = Math.round(m % 60);
  return min > 0 ? `${h}h ${min}m` : `${h}h`;
}

function fmtDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtDateShort(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

function fmtTimestamp(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

function activityLabel(type) {
  const map = {
    NOTE_VIEWED: 'Read Notes',
    NOTE_COMPLETED: 'Completed Notes',
    NOTE_BOOKMARKED: 'Bookmarked Notes',
    NOTE_DOWNLOADED: 'Downloaded Notes',
    PYQ_OPENED: 'Opened Question Paper',
    PYQ_ATTEMPTED: 'Attempted Question Paper',
    PYQ_SOLVED: 'Solved Question Paper',
    QUIZ_STARTED: 'Started Quiz',
    QUIZ_COMPLETED: 'Completed Quiz',
    STUDY_SESSION_COMPLETED: 'Completed Study Session',
    TOPIC_COMPLETED: 'Completed Syllabus Topic',
    SYLLABUS_UNIT_COMPLETED: 'Completed Syllabus Unit',
    INTERVIEW_ROUND_COMPLETED: 'Completed Interview Round',
    GOAL_CREATED: 'Created Target',
    GOAL_COMPLETED: 'Target Achieved'
  };
  return map[type] || type;
}

function activityIcon(type) {
  if (type.startsWith('NOTE')) return '📖';
  if (type.startsWith('PYQ')) return '📝';
  if (type.startsWith('QUIZ')) return '✅';
  if (type.startsWith('STUDY')) return '⏱️';
  if (type.startsWith('TOPIC') || type.startsWith('SYLLABUS')) return '📋';
  if (type.startsWith('INTERVIEW')) return '💼';
  if (type.startsWith('GOAL')) return '🎯';
  return '📌';
}

// ============================================================================
// NAVIGATION ITEMS (11 SECTIONS)
// ============================================================================
const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'study-time', label: 'Study Time', icon: Clock },
  { id: 'subject-progress', label: 'Subject Progress', icon: BookOpen },
  { id: 'topics-progress', label: 'Topics Progress', icon: ListChecks },
  { id: 'notes-activity', label: 'Notes Activity', icon: FileText },
  { id: 'pyqs-solved', label: 'PYQs Solved', icon: CheckCircle2 },
  { id: 'quizzes', label: 'Quizzes & Tests', icon: Brain },
  { id: 'goals', label: 'Goals & Targets', icon: Target },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
  { id: 'insights', label: 'Insights', icon: Zap },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ProgressPage({ onNavigate, onOpenAuth }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Core Data
  const [summary, setSummary] = useState(null);
  const [studyTrend, setStudyTrend] = useState(null);
  const [quizPerf, setQuizPerf] = useState(null);
  const [notesData, setNotesData] = useState([]);
  const [pyqsData, setPyqsData] = useState([]);
  const [topicsData, setTopicsData] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [insightsData, setInsightsData] = useState(null);

  // Study Session Tracking
  const [activeStudySession, setActiveStudySession] = useState(null);
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [sessionSubject, setSessionSubject] = useState('');
  const sessionTimerRef = useRef(null);

  // Filters & Sub-view states
  const [trendDays, setTrendDays] = useState(14);
  const [selectedTopicSubject, setSelectedTopicSubject] = useState('kas-103');
  const [notesFilter, setNotesFilter] = useState('all');
  const [pyqsFilter, setPyqsFilter] = useState('all');
  const [goalsFilter, setGoalsFilter] = useState('active');
  const [achievementsFilter, setAchievementsFilter] = useState('all');
  const [calCurrentDate, setCalCurrentDate] = useState(new Date());
  const [selectedCalDay, setSelectedCalDay] = useState(null);

  // Goal Form
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: '', category: 'custom', targetValue: 1, unit: 'hours', priority: 'medium', dueDate: ''
  });

  // Auth check
  const isLoggedIn = !!(localStorage.getItem('token') || sessionStorage.getItem('token'));

  // ========================================================================
  // DATA LOADER
  // ========================================================================
  const loadAllData = useCallback(async (isRefresh = false) => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [
        summaryRes, trendRes, quizRes, sessionRes,
        notesRes, pyqsRes, topicsRes, calRes, insightsRes
      ] = await Promise.all([
        fetchProgressSummary(),
        fetchStudyTimeTrend(trendDays),
        fetchQuizPerformance(30),
        getActiveSession(),
        fetchNotesActivity(),
        fetchPYQsActivity(),
        fetchTopicsProgress(),
        fetchCalendarData(90),
        fetchInsights()
      ]);

      if (summaryRes) setSummary(summaryRes);
      if (trendRes) setStudyTrend(trendRes);
      if (quizRes) setQuizPerf(quizRes);
      if (sessionRes) setActiveStudySession(sessionRes);
      if (notesRes?.notes) setNotesData(notesRes.notes);
      if (pyqsRes?.pyqs) setPyqsData(pyqsRes.pyqs);
      if (topicsRes?.topics) setTopicsData(topicsRes.topics);
      if (calRes?.days) setCalendarData(calRes.days);
      if (insightsRes?.insights) setInsightsData(insightsRes.insights);
    } catch (err) {
      console.error('[ProgressPage] Load error:', err);
      setError('Unable to refresh all progress data. Showing cached metrics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isLoggedIn, trendDays]);

  useEffect(() => { loadAllData(); }, [loadAllData]);

  // Live timer for active study session
  useEffect(() => {
    if (activeStudySession) {
      const startTime = new Date(activeStudySession.startedAt).getTime();
      const tick = () => {
        setSessionElapsed(Math.floor((Date.now() - startTime) / 1000));
      };
      tick();
      sessionTimerRef.current = setInterval(tick, 1000);
      return () => clearInterval(sessionTimerRef.current);
    } else {
      setSessionElapsed(0);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    }
  }, [activeStudySession]);

  // ========================================================================
  // STUDY SESSION ACTIONS
  // ========================================================================
  const handleStartSession = async () => {
    const res = await startStudySession({ subject: sessionSubject });
    if (res?.session) {
      setActiveStudySession(res.session);
    }
  };

  const handleStopSession = async () => {
    const res = await stopStudySession({ sessionId: activeStudySession?.id });
    if (res?.success) {
      setActiveStudySession(null);
      setSessionSubject('');
      setTimeout(() => loadAllData(true), 400);
    }
  };

  // ========================================================================
  // GOAL ACTIONS
  // ========================================================================
  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!goalForm.title.trim()) return;
    const res = await createGoal(goalForm);
    if (res?.success) {
      setShowGoalModal(false);
      setGoalForm({ title: '', category: 'custom', targetValue: 1, unit: 'hours', priority: 'medium', dueDate: '' });
      loadAllData(true);
    }
  };

  const handleCompleteGoal = async (goalId) => {
    const res = await updateGoal(goalId, { status: 'completed' });
    if (res?.success) loadAllData(true);
  };

  const handleDeleteGoal = async (goalId) => {
    const res = await updateGoal(goalId, { status: 'deleted' });
    if (res?.success) loadAllData(true);
  };

  // ========================================================================
  // TOPIC TOGGLE ACTION
  // ========================================================================
  const handleToggleTopic = async (topicId, topicName, unitName, subject) => {
    const res = await toggleTopicProgress({
      topicId, topicName, unitName, subject, course: 'B.Tech'
    });
    if (res?.success) {
      setTopicsData(prev => {
        const idx = prev.findIndex(t => t.topicId === topicId);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = res.topic;
          return updated;
        }
        return [...prev, res.topic];
      });
      loadAllData(true);
    }
  };

  // ========================================================================
  // DERIVED METRICS
  // ========================================================================
  const s = summary?.summary || {};
  const recentActivity = summary?.recentActivity || [];
  const goals = summary?.goals || [];
  const achievements = summary?.achievements || [];
  const subjectProgress = summary?.subjectProgress || {};
  const streak = summary?.streak || {};
  const trendData = studyTrend?.trend || [];
  const quizAttempts = quizPerf?.attempts || [];

  const completedTopicIds = useMemo(() => {
    return new Set(topicsData.filter(t => t.status === 'completed').map(t => t.topicId));
  }, [topicsData]);

  // Current Subject for topic progress
  const currentSyllabusSubject = useMemo(() => {
    return AKTU_SYLLABUS_DATA.find(s => s.id === selectedTopicSubject) || AKTU_SYLLABUS_DATA[0];
  }, [selectedTopicSubject]);

  const formatElapsed = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const ss = sec % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
    return `${m}:${String(ss).padStart(2, '0')}`;
  };

  // ========================================================================
  // NOT LOGGED IN STATE
  // ========================================================================
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF7F2', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '100px 24px', textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25)'
          }}>
            📊
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#7A2327', marginBottom: 14 }}>
            Student Progress & Analytics
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.65, marginBottom: 36 }}>
            Track your real study hours, completed topics, note reading history, solved question papers, and test scores with zero fake data.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenAuth?.({ mode: 'login' })}
              style={{
                padding: '14px 36px', background: '#7A2327', color: '#fff', border: 'none',
                borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(122, 35, 39, 0.25)', transition: 'all 0.2s'
              }}
            >
              Sign In to View Progress
            </button>
            <button
              onClick={() => onOpenAuth?.({ mode: 'signup' })}
              style={{
                padding: '14px 28px', background: '#fff', color: '#7A2327', border: '1.5px solid #7A2327',
                borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: 'pointer'
              }}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================================
  // LOADING STATE
  // ========================================================================
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 52, height: 52, border: '4px solid #E5D5C0', borderTopColor: '#7A2327',
            borderRadius: '50%', animation: 'pvSpin 0.8s linear infinite', margin: '0 auto 18px'
          }} />
          <h3 style={{ color: '#7A2327', fontWeight: 800, margin: '0 0 6px' }}>Loading Your Progress</h3>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: 0 }}>Aggregating study records & activity logs...</p>
          <style>{`@keyframes pvSpin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // ========================================================================
  // MAIN DASHBOARD RENDER
  // ========================================================================
  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2', fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif", color: '#1E293B' }}>
      {/* Top Breadcrumb */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '16px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#94A3B8' }}>
          <span style={{ cursor: 'pointer', color: '#64748B' }} onClick={() => onNavigate('home')}>🏠 Home</span>
          <ChevronRight size={14} />
          <span style={{ color: '#7A2327', fontWeight: 700 }}>Student Analytics</span>
        </div>
      </div>

      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '12px 24px 60px' }}>
        {/* Page Title & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span>📊</span> Student Progress & Analytics
            </h1>
            <p style={{ color: '#64748B', margin: '4px 0 0', fontSize: '0.92rem' }}>
              Track preparation, analyze exam readiness, and build daily consistency toward your goals.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              onClick={() => loadAllData(true)}
              disabled={refreshing}
              style={{
                padding: '9px 18px', background: '#fff', border: '1px solid #E2D5C3', borderRadius: 10,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.85rem',
                color: '#64748B', fontWeight: 600, transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              <RefreshCw size={14} className={refreshing ? 'pv-spin-fast' : ''} />
              {refreshing ? 'Syncing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Highlight Banner (Streak + Study Session Tracker) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>
          {/* Streak Card */}
          <div style={{
            background: 'linear-gradient(135deg, #7A2327 0%, #9B3A3E 100%)', borderRadius: 18, padding: '22px 26px',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(122, 35, 39, 0.22)'
          }}>
            <div>
              <div style={{ fontSize: '0.82rem', opacity: 0.85, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4 }}>
                Daily Study Streak
              </div>
              <div style={{ fontSize: '2.75rem', fontWeight: 900, lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: 8 }}>
                {streak.currentStreak || 0} <span style={{ fontSize: '1.1rem', fontWeight: 600, opacity: 0.9 }}>days</span>
              </div>
              <div style={{ fontSize: '0.82rem', opacity: 0.85, marginTop: 6, fontWeight: 500 }}>
                {streak.currentStreak > 0
                  ? `🔥 Active streak! Longest: ${streak.longestStreak || streak.currentStreak} days.`
                  : 'Start a study session or read a note to begin your streak!'}
              </div>
            </div>
            <div style={{ fontSize: '3.75rem', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}>
              {streak.currentStreak >= 14 ? '👑' : streak.currentStreak >= 7 ? '🏆' : streak.currentStreak >= 3 ? '🔥' : '💪'}
            </div>
          </div>

          {/* Study Session Card */}
          <div style={{
            background: '#fff', borderRadius: 18, padding: '22px 26px', border: '1px solid #E5D5C0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}>
            <div style={{ flex: 1, minWidth: 0, marginRight: 16 }}>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4 }}>
                Live Study Session
              </div>
              {activeStudySession ? (
                <>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#059669', fontFamily: 'monospace', letterSpacing: '1px' }}>
                    {formatElapsed(sessionElapsed)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', display: 'inline-block', animation: 'pvPulse 1.2s infinite' }} />
                    Tracking {activeStudySession.subject || 'general study'}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: 4 }}>
                    Ready to focus?
                  </div>
                  <input
                    type="text"
                    placeholder="Subject name (e.g. Mathematics, OS)"
                    value={sessionSubject}
                    onChange={e => setSessionSubject(e.target.value)}
                    style={{
                      width: '100%', maxWidth: 260, padding: '6px 10px', fontSize: '0.8rem',
                      border: '1px solid #E2D5C3', borderRadius: 8, background: '#FAF7F2'
                    }}
                  />
                </>
              )}
            </div>
            <button
              onClick={activeStudySession ? handleStopSession : handleStartSession}
              style={{
                width: 60, height: 60, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: activeStudySession ? '#DC2626' : '#059669', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 6px 20px ${activeStudySession ? 'rgba(220,38,38,0.35)' : 'rgba(5,150,105,0.35)'}`,
                transition: 'all 0.2s', flexShrink: 0
              }}
              title={activeStudySession ? 'End Session & Save Progress' : 'Start Focus Session'}
            >
              {activeStudySession ? <Square size={24} fill="#fff" /> : <Play size={24} fill="#fff" style={{ marginLeft: 3 }} />}
            </button>
          </div>
        </div>

        {/* 6 Top Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14, marginBottom: 28 }}>
          {[
            {
              label: 'Total Study Time', value: fmtMinutes(s.totalStudyMinutes || 0),
              icon: <Clock size={20} />, color: '#7A2327', bg: '#FEF2F2',
              sub: s.studyTimeChange !== null && s.studyTimeChange !== undefined
                ? `${s.studyTimeChange > 0 ? '+' : ''}${s.studyTimeChange}% vs last week`
                : `${s.thisWeekMinutes ? fmtMinutes(s.thisWeekMinutes) : '0 min'} this week`,
              subColor: s.studyTimeChange > 0 ? '#059669' : s.studyTimeChange < 0 ? '#DC2626' : '#94A3B8'
            },
            {
              label: 'Topics Completed', value: `${s.topicsCompleted || 0}`,
              icon: <ListChecks size={20} />, color: '#059669', bg: '#F0FDF4',
              sub: s.totalTopics > 0 ? `${Math.round((s.topicsCompleted / s.totalTopics) * 100)}% of tracked` : 'Track syllabus topics',
              progress: s.totalTopics > 0 ? Math.round((s.topicsCompleted / s.totalTopics) * 100) : 0,
              progressColor: '#059669'
            },
            {
              label: 'Notes Read', value: `${s.notesRead || 0}`,
              icon: <BookOpen size={20} />, color: '#2563EB', bg: '#EFF6FF',
              sub: s.totalNotes > 0 ? `${s.totalNotes} total notes viewed` : 'Explore verified notes'
            },
            {
              label: 'PYQs Solved', value: `${s.pyqsSolved || 0}`,
              icon: <FileText size={20} />, color: '#DC2626', bg: '#FEF2F2',
              sub: s.pyqsAttempted > s.pyqsSolved ? `${s.pyqsAttempted} attempted` : 'Official university papers'
            },
            {
              label: 'Quizzes Taken', value: `${s.quizAttempts || 0}`,
              icon: <Brain size={20} />, color: '#9333EA', bg: '#FAF5FF',
              sub: s.quizAttempts > 0 ? `Avg: ${s.avgQuizScore}%` : 'Attempt practice tests'
            },
            {
              label: 'Average Score', value: s.quizAttempts > 0 ? `${s.avgQuizScore}%` : '—',
              icon: <Award size={20} />, color: '#D97706', bg: '#FFFBEB',
              sub: s.bestQuizScore > 0 ? `Personal Best: ${s.bestQuizScore}%` : 'Score verified tests',
              subColor: '#D97706'
            }
          ].map((card, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 16, padding: '20px 18px', border: '1px solid #E5D5C0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)', position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: card.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color
                }}>
                  {card.icon}
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>{card.label}</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1E293B', lineHeight: 1.1 }}>
                {card.value}
              </div>
              {card.progress !== undefined && card.progress > 0 && (
                <div style={{ height: 4, background: '#E2E8F0', borderRadius: 2, marginTop: 10 }}>
                  <div style={{
                    height: '100%', width: `${Math.min(card.progress, 100)}%`,
                    background: card.progressColor, borderRadius: 2
                  }} />
                </div>
              )}
              <div style={{ fontSize: '0.72rem', color: card.subColor || '#94A3B8', marginTop: 8, fontWeight: 600 }}>
                {card.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid: Left Nav + Right Active View */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }} className="progress-layout">
          {/* Left Navigation Sidebar */}
          <div className="progress-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{
              background: '#fff', borderRadius: 16, padding: '10px', border: '1px solid #E5D5C0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                      border: 'none', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                      background: active ? '#7A2327' : 'transparent',
                      color: active ? '#fff' : '#64748B',
                      fontWeight: active ? 800 : 600, fontSize: '0.88rem',
                      transition: 'all 0.15s ease', marginBottom: 2
                    }}
                  >
                    <Icon size={18} style={{ flexShrink: 0, opacity: active ? 1 : 0.8 }} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {active && <ChevronRight size={14} style={{ opacity: 0.8 }} />}
                  </button>
                );
              })}
            </div>

            {/* Quick Summary Pill */}
            <div style={{
              background: '#FAF2E8', borderRadius: 14, padding: 14, border: '1px solid #E8D6BF',
              fontSize: '0.75rem', color: '#78350F'
            }}>
              <strong>💡 Zero Fake Data Policy:</strong>
              <div style={{ marginTop: 4, lineHeight: 1.4, opacity: 0.9 }}>
                All streaks, study time, quiz scores, and subject progress are computed from your authenticated activities.
              </div>
            </div>
          </div>

          {/* Right Active View Container */}
          <div style={{ minWidth: 0 }}>
            {/* 1. OVERVIEW VIEW */}
            {activeSection === 'overview' && (
              <div>
                {/* Study Time Trend */}
                <div style={{ background: '#fff', borderRadius: 18, padding: '24px', border: '1px solid #E5D5C0', marginBottom: 22, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>📈</span> Study Time Trend
                      </h3>
                      <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#94A3B8' }}>
                        Daily recorded study hours for the last {trendDays} days
                      </p>
                    </div>
                    <select
                      value={trendDays}
                      onChange={e => setTrendDays(Number(e.target.value))}
                      style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #E2D5C3', fontSize: '0.82rem', color: '#64748B', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
                    >
                      <option value={7}>Last 7 Days</option>
                      <option value={14}>Last 14 Days</option>
                      <option value={30}>Last 30 Days</option>
                      <option value={90}>Last 3 Months</option>
                    </select>
                  </div>

                  {trendData.length > 0 ? (
                    <div style={{ position: 'relative', height: 210 }}>
                      {(() => {
                        const maxMin = Math.max(...trendData.map(d => d.minutes), 1);
                        const steps = [0, Math.round(maxMin * 0.33), Math.round(maxMin * 0.66), maxMin];
                        return (
                          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 26, width: 44, display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-between' }}>
                            {steps.map((v, i) => (
                              <span key={i} style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 500 }}>{fmtMinutes(v)}</span>
                            ))}
                          </div>
                        );
                      })()}
                      <div style={{ marginLeft: 50, display: 'flex', alignItems: 'flex-end', gap: trendData.length > 14 ? 3 : 8, height: 180 }}>
                        {trendData.map((d, i) => {
                          const maxMin = Math.max(...trendData.map(x => x.minutes), 1);
                          const barH = Math.max(3, (d.minutes / maxMin) * 160);
                          const isToday = d.date === new Date().toISOString().split('T')[0];
                          return (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                              <div style={{ position: 'relative', width: '100%', maxWidth: 36 }}>
                                {d.minutes > 0 && (
                                  <div style={{
                                    position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)',
                                    fontSize: '0.62rem', color: '#7A2327', fontWeight: 800, whiteSpace: 'nowrap'
                                  }}>
                                    {fmtMinutes(d.minutes)}
                                  </div>
                                )}
                                <div style={{
                                  width: '100%', height: barH, borderRadius: '6px 6px 2px 2px',
                                  background: isToday
                                    ? 'linear-gradient(180deg, #7A2327 0%, #B84C50 100%)'
                                    : d.minutes > 0
                                      ? 'linear-gradient(180deg, #F59E0B 0%, #FCD34D 100%)'
                                      : '#E2E8F0',
                                  transition: 'height 0.4s ease'
                                }} />
                              </div>
                              <span style={{ fontSize: '0.6rem', color: isToday ? '#7A2327' : '#94A3B8', fontWeight: isToday ? 800 : 500, whiteSpace: 'nowrap' }}>
                                {fmtDateShort(d.date)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                      <Clock size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
                      <p style={{ margin: 0, fontWeight: 600 }}>No study sessions logged yet.</p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.8rem' }}>Start your first study session above to see your trend!</p>
                    </div>
                  )}
                </div>

                {/* Subject-wise Progress & Topic Donut */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 22 }}>
                  {/* Subject-wise Progress */}
                  <div style={{ background: '#fff', borderRadius: 18, padding: '22px', border: '1px solid #E5D5C0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>📘</span> Subject-wise Progress
                      </h3>
                      <button onClick={() => setActiveSection('subject-progress')} style={{ background: 'none', border: 'none', color: '#7A2327', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                        View All →
                      </button>
                    </div>
                    {Object.keys(subjectProgress).length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {Object.entries(subjectProgress).slice(0, 5).map(([name, data]) => {
                          const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
                          return (
                            <div key={name}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 5 }}>
                                <span style={{ color: '#1E293B', fontWeight: 700 }}>{name}</span>
                                <span style={{ color: '#64748B', fontWeight: 600 }}>{data.completed} / {data.total} ({pct}%)</span>
                              </div>
                              <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4 }}>
                                <div style={{
                                  height: '100%', borderRadius: 4, width: `${pct}%`, transition: 'width 0.5s',
                                  background: pct >= 75 ? '#059669' : pct >= 40 ? '#F59E0B' : '#7A2327'
                                }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '36px 0', color: '#94A3B8' }}>
                        <BookOpen size={28} style={{ opacity: 0.4, marginBottom: 8 }} />
                        <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600 }}>No subject progress yet.</p>
                        <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>Check off topics in Topics Progress to see coverage.</p>
                      </div>
                    )}
                  </div>

                  {/* Topic Completion Donut */}
                  <div style={{ background: '#fff', borderRadius: 18, padding: '22px', border: '1px solid #E5D5C0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>📋</span> Topic Completion
                      </h3>
                      <button onClick={() => setActiveSection('topics-progress')} style={{ background: 'none', border: 'none', color: '#7A2327', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                        Manage →
                      </button>
                    </div>
                    {s.totalTopics > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center', padding: '10px 0' }}>
                        <div style={{ position: 'relative', width: 120, height: 120 }}>
                          <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: 120, height: 120 }}>
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="3.2" />
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#059669" strokeWidth="3.2"
                              strokeDasharray={`${(s.topicsCompleted / s.totalTopics) * 100} ${100 - (s.topicsCompleted / s.totalTopics) * 100}`}
                              strokeLinecap="round" />
                          </svg>
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1E293B', lineHeight: 1 }}>
                              {Math.round((s.topicsCompleted / s.totalTopics) * 100)}%
                            </span>
                            <span style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: 3 }}>Completed</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#059669' }} />
                            <span>Completed: <strong>{s.topicsCompleted}</strong></span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
                            <span>In Progress: <strong>{s.topicsInProgress || 0}</strong></span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#E2E8F0' }} />
                            <span>Not Started: <strong>{s.topicsNotStarted || (s.totalTopics - s.topicsCompleted)}</strong></span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '36px 0', color: '#94A3B8' }}>
                        <ListChecks size={28} style={{ opacity: 0.4, marginBottom: 8 }} />
                        <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600 }}>No topics tracked yet.</p>
                        <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>Check off units in Topics Progress.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Recent Activity & Goals */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                  {/* Recent Activity */}
                  <div style={{ background: '#fff', borderRadius: 18, padding: '22px', border: '1px solid #E5D5C0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ margin: '0 0 14px', fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>📌</span> Recent Activity
                    </h3>
                    {recentActivity.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
                        {recentActivity.slice(0, 8).map((evt, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: i < recentActivity.length - 1 ? '1px solid #F8F4EF' : 'none' }}>
                            <span style={{ fontSize: '1.25rem' }}>{activityIcon(evt.type)}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1E293B' }}>
                                {activityLabel(evt.type)}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {evt.entityName || evt.subject || 'Academic Resource'}
                              </div>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                              {fmtTimestamp(evt.timestamp)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '36px 0', color: '#94A3B8' }}>
                        <Activity size={28} style={{ opacity: 0.4, marginBottom: 8 }} />
                        <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600 }}>No activity logged yet.</p>
                        <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>Read a note or solve a paper to start tracking.</p>
                      </div>
                    )}
                  </div>

                  {/* Upcoming Targets */}
                  <div style={{ background: '#fff', borderRadius: 18, padding: '22px', border: '1px solid #E5D5C0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>🎯</span> Upcoming Targets
                      </h3>
                      <button
                        onClick={() => setShowGoalModal(true)}
                        style={{
                          padding: '5px 12px', background: '#7A2327', color: '#fff', border: 'none',
                          borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 4
                        }}
                      >
                        <Plus size={12} /> Add Target
                      </button>
                    </div>

                    {goals.filter(g => g.status === 'active').length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
                        {goals.filter(g => g.status === 'active').slice(0, 6).map(goal => (
                          <div key={goal.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #F8F4EF' }}>
                            <button
                              onClick={() => handleCompleteGoal(goal.id)}
                              style={{
                                width: 22, height: 22, borderRadius: 6, border: '2px solid #D1C4B0',
                                background: '#fff', cursor: 'pointer', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}
                              title="Mark as completed"
                            >
                              <Check size={12} color="#D1C4B0" />
                            </button>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1E293B' }}>{goal.title}</div>
                              {goal.dueDate && (
                                <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                                  Target date: {fmtDate(goal.dueDate)}
                                </div>
                              )}
                            </div>
                            <span style={{
                              padding: '2px 8px', borderRadius: 6, fontSize: '0.65rem', fontWeight: 800,
                              background: goal.priority === 'high' ? '#FEE2E2' : goal.priority === 'medium' ? '#FEF3C7' : '#F0FDF4',
                              color: goal.priority === 'high' ? '#DC2626' : goal.priority === 'medium' ? '#D97706' : '#059669'
                            }}>
                              {goal.priority.toUpperCase()}
                            </span>
                            <button onClick={() => handleDeleteGoal(goal.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1', padding: 2 }}>
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '36px 0', color: '#94A3B8' }}>
                        <Target size={28} style={{ opacity: 0.4, marginBottom: 8 }} />
                        <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600 }}>No active targets.</p>
                        <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>Set a target to keep yourself accountable!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. STUDY TIME VIEW */}
            {activeSection === 'study-time' && (
              <div style={{ background: '#fff', borderRadius: 18, padding: '26px', border: '1px solid #E5D5C0' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1E293B', margin: '0 0 6px' }}>
                  ⏱️ Study Time Tracker & Session History
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: 24 }}>
                  Real timed sessions with automatic idle protection. No estimated or simulated minutes.
                </p>

                {/* Big Timer Console */}
                <div style={{
                  background: 'linear-gradient(135deg, #FAF7F2 0%, #F5EFEB 100%)', borderRadius: 16,
                  padding: 24, border: '1px solid #E5D5C0', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 28
                }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Focus Timer</div>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: activeStudySession ? '#059669' : '#1E293B', fontFamily: 'monospace' }}>
                      {formatElapsed(sessionElapsed)}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: 2 }}>
                      {activeStudySession ? `Active Session: ${activeStudySession.subject || 'General Study'}` : 'Click Start to record timed study'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {!activeStudySession && (
                      <input
                        placeholder="Subject (e.g. Mathematics)"
                        value={sessionSubject}
                        onChange={e => setSessionSubject(e.target.value)}
                        style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #E2D5C3', fontSize: '0.88rem' }}
                      />
                    )}
                    <button
                      onClick={activeStudySession ? handleStopSession : handleStartSession}
                      style={{
                        padding: '12px 28px', borderRadius: 10, border: 'none', cursor: 'pointer',
                        background: activeStudySession ? '#DC2626' : '#059669', color: '#fff',
                        fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8
                      }}
                    >
                      {activeStudySession ? <><Square size={16} fill="#fff" /> End & Save</> : <><Play size={16} fill="#fff" /> Start Session</>}
                    </button>
                  </div>
                </div>

                {/* Trend Summary */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 16 }}>📊 Daily Study Distribution ({trendDays} Days)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8, marginBottom: 28 }}>
                  {trendData.slice(-14).map((d, i) => (
                    <div key={i} style={{
                      padding: 12, borderRadius: 10, background: '#FAF7F2', border: '1px solid #E5D5C0', textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{fmtDateShort(d.date)}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: d.minutes > 0 ? '#7A2327' : '#94A3B8', marginTop: 4 }}>
                        {fmtMinutes(d.minutes)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SUBJECT PROGRESS VIEW */}
            {activeSection === 'subject-progress' && (
              <div style={{ background: '#fff', borderRadius: 18, padding: '26px', border: '1px solid #E5D5C0' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1E293B', margin: '0 0 6px' }}>
                  📘 Subject-wise Preparation Progress
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: 24 }}>
                  Aggregated progress across all syllabus topics, notes read, and PYQs solved for each AKTU subject.
                </p>

                {Object.keys(subjectProgress).length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                    {Object.entries(subjectProgress).map(([subjName, data]) => {
                      const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
                      return (
                        <div key={subjName} style={{
                          padding: 20, borderRadius: 14, border: '1px solid #E5D5C0', background: '#FAF7F2'
                        }}>
                          <h4 style={{ margin: '0 0 8px', fontSize: '1.05rem', fontWeight: 800, color: '#1E293B' }}>{subjName}</h4>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748B', marginBottom: 6 }}>
                            <span>Topic Coverage</span>
                            <strong>{pct}% ({data.completed}/{data.total})</strong>
                          </div>
                          <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, marginBottom: 12 }}>
                            <div style={{ height: '100%', borderRadius: 4, width: `${pct}%`, background: pct >= 75 ? '#059669' : pct >= 40 ? '#F59E0B' : '#7A2327' }} />
                          </div>
                          <div style={{ display: 'flex', gap: 14, fontSize: '0.78rem', color: '#64748B' }}>
                            <span>📖 Notes: <strong>{data.notesRead || 0}</strong></span>
                            <span>📝 PYQs: <strong>{data.pyqsSolved || 0}</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '50px 0', color: '#94A3B8' }}>
                    <BookOpen size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                    <p style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>No subject progress recorded yet.</p>
                    <p style={{ fontSize: '0.85rem', margin: '6px 0 0' }}>Go to Topics Progress to check off units you have prepared.</p>
                  </div>
                )}
              </div>
            )}

            {/* 4. TOPICS PROGRESS VIEW */}
            {activeSection === 'topics-progress' && (
              <div style={{ background: '#fff', borderRadius: 18, padding: '26px', border: '1px solid #E5D5C0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1E293B', margin: '0 0 6px' }}>
                      📋 Syllabus Topic Completion Checklist
                    </h2>
                    <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>
                      Mark topics and units as completed. Updates your real syllabus progress instantly.
                    </p>
                  </div>
                  {/* Subject Selector */}
                  <select
                    value={selectedTopicSubject}
                    onChange={e => setSelectedTopicSubject(e.target.value)}
                    style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid #E2D5C3', background: '#fff', fontSize: '0.88rem', fontWeight: 700, color: '#1E293B', cursor: 'pointer' }}
                  >
                    {AKTU_SYLLABUS_DATA.map(sub => (
                      <option key={sub.id} value={sub.id}>
                        {sub.code ? `${sub.code} - ` : ''}{sub.subject}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Units List */}
                {currentSyllabusSubject?.units && currentSyllabusSubject.units.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {currentSyllabusSubject.units.map(unit => {
                      const topicKey = `${currentSyllabusSubject.id}-unit-${unit.unitNo}`;
                      const isDone = completedTopicIds.has(topicKey);
                      return (
                        <div
                          key={unit.unitNo}
                          onClick={() => handleToggleTopic(
                            topicKey,
                            `Unit ${unit.unitNo}: ${unit.title}`,
                            `Unit ${unit.unitNo}`,
                            currentSyllabusSubject.subject
                          )}
                          style={{
                            padding: '16px 20px', borderRadius: 12, cursor: 'pointer',
                            border: `1.5px solid ${isDone ? '#86EFAC' : '#E2E8F0'}`,
                            background: isDone ? '#F0FDF4' : '#FAF7F2',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{
                              width: 26, height: 26, borderRadius: 8,
                              border: `2px solid ${isDone ? '#059669' : '#CBD5E1'}`,
                              background: isDone ? '#059669' : '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                            }}>
                              {isDone && <Check size={16} strokeWidth={3} />}
                            </div>
                            <div>
                              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: isDone ? '#14532D' : '#1E293B' }}>
                                Unit {unit.unitNo}: {unit.title}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: isDone ? '#15803D' : '#94A3B8', marginTop: 2 }}>
                                {currentSyllabusSubject.subject} ({currentSyllabusSubject.code || 'AKTU'})
                              </div>
                            </div>
                          </div>
                          <span style={{
                            padding: '3px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 800,
                            background: isDone ? '#DCFCE7' : '#E2E8F0',
                            color: isDone ? '#15803D' : '#64748B'
                          }}>
                            {isDone ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ color: '#94A3B8' }}>Select a subject above to view and track units.</p>
                )}
              </div>
            )}

            {/* 5. NOTES ACTIVITY VIEW */}
            {activeSection === 'notes-activity' && (
              <div style={{ background: '#fff', borderRadius: 18, padding: '26px', border: '1px solid #E5D5C0' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1E293B', margin: '0 0 6px' }}>
                  📖 Notes Activity & Reading Log
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: 20 }}>
                  Every note you view or complete is tracked here with real view counts and timestamps.
                </p>

                {notesData.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #E5D5C0', color: '#64748B' }}>
                          <th style={{ padding: '10px 12px' }}>Note Title</th>
                          <th style={{ padding: '10px 12px' }}>Subject</th>
                          <th style={{ padding: '10px 12px' }}>Views</th>
                          <th style={{ padding: '10px 12px' }}>Last Viewed</th>
                          <th style={{ padding: '10px 12px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {notesData.map(n => (
                          <tr key={n.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '12px', fontWeight: 700, color: '#1E293B' }}>{n.noteName || 'Lecture Notes'}</td>
                            <td style={{ padding: '12px', color: '#64748B' }}>{n.subject || '—'}</td>
                            <td style={{ padding: '12px', fontWeight: 600 }}>{n.viewCount || 1}</td>
                            <td style={{ padding: '12px', color: '#94A3B8' }}>{fmtDate(n.lastViewedAt)}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                padding: '3px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700,
                                background: n.readStatus === 'completed' ? '#DCFCE7' : '#EFF6FF',
                                color: n.readStatus === 'completed' ? '#15803D' : '#1D4ED8'
                              }}>
                                {n.readStatus ? n.readStatus.toUpperCase() : 'VIEWED'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '50px 0', color: '#94A3B8' }}>
                    <FileText size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                    <p style={{ margin: 0, fontWeight: 700 }}>No notes viewed yet.</p>
                    <button
                      onClick={() => onNavigate('notes')}
                      style={{
                        marginTop: 12, padding: '8px 20px', background: '#7A2327', color: '#fff',
                        border: 'none', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      Browse AKTU Notes →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 6. PYQS SOLVED VIEW */}
            {activeSection === 'pyqs-solved' && (
              <div style={{ background: '#fff', borderRadius: 18, padding: '26px', border: '1px solid #E5D5C0' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1E293B', margin: '0 0 6px' }}>
                  📝 Question Papers (PYQs) Practice Log
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: 20 }}>
                  Real university question papers opened and solved by you.
                </p>

                {pyqsData.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #E5D5C0', color: '#64748B' }}>
                          <th style={{ padding: '10px 12px' }}>Paper Name</th>
                          <th style={{ padding: '10px 12px' }}>Subject</th>
                          <th style={{ padding: '10px 12px' }}>Year</th>
                          <th style={{ padding: '10px 12px' }}>Status</th>
                          <th style={{ padding: '10px 12px' }}>First Opened</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pyqsData.map(p => (
                          <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '12px', fontWeight: 700, color: '#1E293B' }}>{p.pyqName || 'Question Paper'}</td>
                            <td style={{ padding: '12px', color: '#64748B' }}>{p.subject || '—'}</td>
                            <td style={{ padding: '12px', color: '#64748B' }}>{p.year || '—'}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                padding: '3px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700,
                                background: p.status === 'solved' ? '#DCFCE7' : '#FEF3C7',
                                color: p.status === 'solved' ? '#15803D' : '#D97706'
                              }}>
                                {p.status ? p.status.toUpperCase() : 'OPENED'}
                              </span>
                            </td>
                            <td style={{ padding: '12px', color: '#94A3B8' }}>{fmtDate(p.firstOpenedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '50px 0', color: '#94A3B8' }}>
                    <FileText size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                    <p style={{ margin: 0, fontWeight: 700 }}>No question papers attempted yet.</p>
                    <button
                      onClick={() => onNavigate('pyqs')}
                      style={{
                        marginTop: 12, padding: '8px 20px', background: '#7A2327', color: '#fff',
                        border: 'none', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      Solve PYQs →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 7. QUIZZES VIEW */}
            {activeSection === 'quizzes' && (
              <div style={{ background: '#fff', borderRadius: 18, padding: '26px', border: '1px solid #E5D5C0' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1E293B', margin: '0 0 6px' }}>
                  🎯 Quizzes & Practice Tests
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: 20 }}>
                  Real test scores and accuracy breakdown from your attempts.
                </p>

                {quizAttempts.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                      <div style={{ padding: 14, background: '#FAF7F2', borderRadius: 10, border: '1px solid #E5D5C0' }}>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Total Attempts</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1E293B', marginTop: 2 }}>{s.quizAttempts}</div>
                      </div>
                      <div style={{ padding: 14, background: '#FAF7F2', borderRadius: 10, border: '1px solid #E5D5C0' }}>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Average Score</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', marginTop: 2 }}>{s.avgQuizScore}%</div>
                      </div>
                      <div style={{ padding: 14, background: '#FAF7F2', borderRadius: 10, border: '1px solid #E5D5C0' }}>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Best Score</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#D97706', marginTop: 2 }}>{s.bestQuizScore}%</div>
                      </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #E5D5C0', color: '#64748B' }}>
                            <th style={{ padding: '10px 12px' }}>Quiz Title</th>
                            <th style={{ padding: '10px 12px' }}>Subject</th>
                            <th style={{ padding: '10px 12px' }}>Score</th>
                            <th style={{ padding: '10px 12px' }}>Accuracy</th>
                            <th style={{ padding: '10px 12px' }}>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quizAttempts.map(q => (
                            <tr key={q.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                              <td style={{ padding: '12px', fontWeight: 700, color: '#1E293B' }}>{q.quizName}</td>
                              <td style={{ padding: '12px', color: '#64748B' }}>{q.subject || '—'}</td>
                              <td style={{ padding: '12px', fontWeight: 600 }}>{q.score} / {q.totalMarks}</td>
                              <td style={{ padding: '12px' }}>
                                <span style={{
                                  padding: '3px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 800,
                                  background: q.percentage >= 75 ? '#DCFCE7' : q.percentage >= 50 ? '#FEF3C7' : '#FEE2E2',
                                  color: q.percentage >= 75 ? '#15803D' : q.percentage >= 50 ? '#D97706' : '#DC2626'
                                }}>
                                  {q.percentage}%
                                </span>
                              </td>
                              <td style={{ padding: '12px', color: '#94A3B8' }}>{fmtDate(q.submittedAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '50px 0', color: '#94A3B8' }}>
                    <Brain size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                    <p style={{ margin: 0, fontWeight: 700 }}>No quizzes taken yet.</p>
                    <button
                      onClick={() => onNavigate('quizzes')}
                      style={{
                        marginTop: 12, padding: '8px 20px', background: '#7A2327', color: '#fff',
                        border: 'none', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      Take a Practice Quiz →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 8. GOALS VIEW */}
            {activeSection === 'goals' && (
              <div style={{ background: '#fff', borderRadius: 18, padding: '26px', border: '1px solid #E5D5C0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1E293B', margin: '0 0 4px' }}>
                      🎯 Study Goals & Targets
                    </h2>
                    <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>
                      Set personal targets and check them off as you prepare.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowGoalModal(true)}
                    style={{
                      padding: '9px 18px', background: '#7A2327', color: '#fff', border: 'none',
                      borderRadius: 10, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6
                    }}
                  >
                    <Plus size={15} /> Add New Target
                  </button>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  {['active', 'completed', 'all'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setGoalsFilter(tab)}
                      style={{
                        padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: goalsFilter === tab ? '#7A2327' : '#F1F5F9',
                        color: goalsFilter === tab ? '#fff' : '#64748B',
                        fontSize: '0.8rem', fontWeight: 700, textTransform: 'capitalize'
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Goals List */}
                {goals.filter(g => goalsFilter === 'all' || g.status === goalsFilter).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {goals.filter(g => goalsFilter === 'all' || g.status === goalsFilter).map(goal => (
                      <div
                        key={goal.id}
                        style={{
                          padding: 16, borderRadius: 12, border: '1px solid #E5D5C0', background: '#FAF7F2',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {goal.status === 'active' ? (
                            <button
                              onClick={() => handleCompleteGoal(goal.id)}
                              style={{
                                width: 24, height: 24, borderRadius: 6, border: '2px solid #D1C4B0',
                                background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}
                              title="Mark complete"
                            >
                              <Check size={14} color="#D1C4B0" />
                            </button>
                          ) : (
                            <div style={{
                              width: 24, height: 24, borderRadius: 6, background: '#059669',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                            }}>
                              <Check size={14} strokeWidth={3} />
                            </div>
                          )}
                          <div>
                            <div style={{
                              fontSize: '0.92rem', fontWeight: 800,
                              color: goal.status === 'completed' ? '#94A3B8' : '#1E293B',
                              textDecoration: goal.status === 'completed' ? 'line-through' : 'none'
                            }}>
                              {goal.title}
                            </div>
                            {goal.dueDate && (
                              <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 2 }}>
                                Target Date: {fmtDate(goal.dueDate)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{
                            padding: '3px 8px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 800,
                            background: goal.priority === 'high' ? '#FEE2E2' : goal.priority === 'medium' ? '#FEF3C7' : '#F0FDF4',
                            color: goal.priority === 'high' ? '#DC2626' : goal.priority === 'medium' ? '#D97706' : '#059669'
                          }}>
                            {goal.priority.toUpperCase()}
                          </span>
                          <button onClick={() => handleDeleteGoal(goal.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                    <Target size={36} style={{ opacity: 0.3, marginBottom: 10 }} />
                    <p style={{ margin: 0, fontWeight: 700 }}>No goals found in this view.</p>
                  </div>
                )}
              </div>
            )}

            {/* 9. CALENDAR VIEW */}
            {activeSection === 'calendar' && (
              <div style={{ background: '#fff', borderRadius: 18, padding: '26px', border: '1px solid #E5D5C0' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1E293B', margin: '0 0 6px' }}>
                  📅 Study Activity Heatmap & Calendar
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: 20 }}>
                  Days with recorded study sessions or activity events are highlighted.
                </p>

                {/* Heatmap Grid */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))', gap: 6,
                  padding: 16, background: '#FAF7F2', borderRadius: 14, border: '1px solid #E5D5C0', marginBottom: 24
                }}>
                  {calendarData.slice(-60).map((d, i) => {
                    const hasActivity = (d.count || 0) > 0 || (d.minutes || 0) > 0;
                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedCalDay(d)}
                        style={{
                          height: 36, borderRadius: 6, cursor: 'pointer',
                          background: hasActivity
                            ? d.minutes > 60 ? '#7A2327' : d.minutes > 0 ? '#B84C50' : '#059669'
                            : '#E2E8F0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: hasActivity ? '#fff' : '#94A3B8', fontSize: '0.65rem', fontWeight: 700,
                          transition: 'transform 0.15s',
                          border: selectedCalDay?.date === d.date ? '2px solid #F59E0B' : 'none'
                        }}
                        title={`${d.date}: ${d.minutes || 0} min, ${d.count || 0} events`}
                      >
                        {d.date.split('-')[2]}
                      </div>
                    );
                  })}
                </div>

                {selectedCalDay && (
                  <div style={{ padding: 16, borderRadius: 12, background: '#FAF7F2', border: '1px solid #E5D5C0' }}>
                    <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem', fontWeight: 800 }}>
                      Activity on {fmtDate(selectedCalDay.date)}
                    </h4>
                    <p style={{ margin: '0 0 8px', fontSize: '0.82rem', color: '#64748B' }}>
                      Study Time: <strong>{fmtMinutes(selectedCalDay.minutes || 0)}</strong> • Total Actions: <strong>{selectedCalDay.count || 0}</strong>
                    </p>
                    {selectedCalDay.events?.map((ev, i) => (
                      <div key={i} style={{ fontSize: '0.78rem', color: '#475569', padding: '4px 0' }}>
                        • {activityLabel(ev.type)} {ev.name ? `(${ev.name})` : ''}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 10. INSIGHTS VIEW */}
            {activeSection === 'insights' && (
              <div style={{ background: '#fff', borderRadius: 18, padding: '26px', border: '1px solid #E5D5C0' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1E293B', margin: '0 0 6px' }}>
                  ⚡ Preparation Insights & Analytics
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: 24 }}>
                  Personalized performance metrics derived mathematically from your study logs.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  <div style={{ padding: 20, borderRadius: 14, background: '#FAF7F2', border: '1px solid #E5D5C0' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>MOST PRODUCTIVE DAY</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#7A2327', marginTop: 4 }}>
                      {insightsData?.mostActiveDay || 'Analyzing...'}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '6px 0 0' }}>
                      {insightsData?.mostActiveDayMinutes ? `${fmtMinutes(insightsData.mostActiveDayMinutes)} total logged` : 'Log more study sessions to discover'}
                    </p>
                  </div>

                  <div style={{ padding: 20, borderRadius: 14, background: '#FAF7F2', border: '1px solid #E5D5C0' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>DAILY AVERAGE STUDY</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', marginTop: 4 }}>
                      {fmtMinutes(insightsData?.avgMinutesPerActiveDay || 0)}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '6px 0 0' }}>
                      Across {insightsData?.activeDaysCount || 0} active study days
                    </p>
                  </div>

                  <div style={{ padding: 20, borderRadius: 14, background: '#FAF7F2', border: '1px solid #E5D5C0' }}>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>RECOMMENDED FOCUS AREA</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#D97706', marginTop: 4 }}>
                      {insightsData?.focusSubject || 'All tracked subjects up to date'}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '6px 0 0' }}>
                      Focus here to boost overall semester syllabus completion
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 11. ACHIEVEMENTS VIEW */}
            {activeSection === 'achievements' && (
              <div style={{ background: '#fff', borderRadius: 18, padding: '26px', border: '1px solid #E5D5C0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1E293B', margin: '0 0 4px' }}>
                      🏆 Milestones & Achievements
                    </h2>
                    <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>
                      Earn authentic badges for milestones reached across study time, streak, and notes.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['all', 'unlocked', 'locked'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setAchievementsFilter(tab)}
                        style={{
                          padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                          background: achievementsFilter === tab ? '#7A2327' : '#F1F5F9',
                          color: achievementsFilter === tab ? '#fff' : '#64748B',
                          fontSize: '0.8rem', fontWeight: 700, textTransform: 'capitalize'
                        }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                  {achievements
                    .filter(a => achievementsFilter === 'all' || (achievementsFilter === 'unlocked' ? a.unlocked : !a.unlocked))
                    .map(ach => (
                      <div
                        key={ach.id}
                        style={{
                          padding: 18, borderRadius: 14,
                          background: ach.unlocked ? '#FFFBEB' : '#FAF7F2',
                          border: `1.5px solid ${ach.unlocked ? '#FDE68A' : '#E2E8F0'}`,
                          opacity: ach.unlocked ? 1 : 0.6,
                          display: 'flex', alignItems: 'center', gap: 14,
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{
                          fontSize: '2.2rem', width: 48, height: 48, borderRadius: 12,
                          background: ach.unlocked ? '#FEF3C7' : '#E2E8F0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          {ach.icon}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: ach.unlocked ? '#92400E' : '#64748B' }}>
                            {ach.title}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: 2 }}>
                            {ach.description}
                          </div>
                          {ach.unlocked && ach.unlockedAt && (
                            <div style={{ fontSize: '0.65rem', color: '#D97706', fontWeight: 700, marginTop: 4 }}>
                              Unlocked {fmtDate(ach.unlockedAt)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE GOAL MODAL */}
      {showGoalModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: '#fff', borderRadius: 18, padding: 28, width: '100%', maxWidth: 440,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#1E293B' }}>Add Preparation Target</h3>
              <button onClick={() => setShowGoalModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateGoal} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Target Title</label>
                <input
                  required
                  placeholder="e.g. Master Engineering Mathematics Unit 2"
                  value={goalForm.title}
                  onChange={e => setGoalForm(f => ({ ...f, title: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Priority</label>
                  <select
                    value={goalForm.priority}
                    onChange={e => setGoalForm(f => ({ ...f, priority: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>Target Date</label>
                  <input
                    type="date"
                    value={goalForm.dueDate}
                    onChange={e => setGoalForm(f => ({ ...f, dueDate: e.target.value }))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  style={{ flex: 1, padding: 12, borderRadius: 10, border: '1px solid #E2D5C3', background: '#fff', color: '#64748B', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: 12, borderRadius: 10, border: 'none', background: '#7A2327', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Save Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Responsive Styles */}
      <style>{`
        @keyframes pvPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }
        .pv-spin-fast {
          animation: pvSpin 0.7s linear infinite;
        }
        @media (max-width: 960px) {
          .progress-layout {
            grid-template-columns: 1fr !important;
          }
          .progress-sidebar {
            flex-direction: row !important;
            overflow-x: auto;
            padding-bottom: 6px;
          }
          .progress-sidebar button {
            white-space: nowrap;
            flex-shrink: 0;
            width: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
