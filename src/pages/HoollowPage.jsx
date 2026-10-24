import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Target,
  ListOrdered,
  Zap,
  Trophy,
  ChevronDown,
  ChevronRight,
  Clock,
  Calendar,
  BookOpen,
  User,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Play,
  Share2,
  RotateCcw,
  Bot,
  ExternalLink,
  Flame,
  Award,
  Layers,
  ArrowRight,
  Globe,
  Brain,
  BarChart2,
  Smartphone,
  Cloud,
  Loader2,
  Check,
  Edit3,
  BookmarkCheck,
  Download
} from 'lucide-react';
import { API_URL } from '../config/api';
import { HOOLLOW_GOALS, HOOLLOW_PRESETS, getRoadmapForGoal } from '../data/hoollowCurriculum';
import HoollowDemoModal from '../components/HoollowDemoModal';
import HoollowTaskModal from '../components/HoollowTaskModal';
import HoollowMentorDrawer from '../components/HoollowMentorDrawer';
import { updateSEOForRoute } from '../utils/seoManager';

export default function HoollowPage({ onNavigate, onOpenAuth }) {
  // Navigation / SEO
  useEffect(() => {
    updateSEOForRoute('hoollow');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Form State
  const [selectedGoal, setSelectedGoal] = useState('Python Developer');
  const [customGoalText, setCustomGoalText] = useState('');
  const [currentLevel, setCurrentLevel] = useState('Beginner');
  const [dailyStudyTime, setDailyStudyTime] = useState('1 hour');
  const [goalTimeline, setGoalTimeline] = useState('6 months');
  const [learningStyle, setLearningStyle] = useState('Video + Notes + Practice');

  // Interactive UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStepText, setGeneratingStepText] = useState('');
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'dashboard'
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null);
  const [selectedPhaseForModal, setSelectedPhaseForModal] = useState('');
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  // Roadmap & Gamification State (Loaded from localStorage with cloud sync)
  const [activeRoadmap, setActiveRoadmap] = useState(() => {
    try {
      const saved = localStorage.getItem('hoollow_active_roadmap');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [completedTaskIds, setCompletedTaskIds] = useState(() => {
    try {
      const saved = localStorage.getItem('hoollow_completed_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [xpPoints, setXpPoints] = useState(() => {
    try {
      const saved = localStorage.getItem('hoollow_xp_points');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [streakDays, setStreakDays] = useState(() => {
    try {
      const saved = localStorage.getItem('hoollow_streak_days');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Toast Notification Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Persist State to LocalStorage & Backend Sync
  useEffect(() => {
    if (activeRoadmap) {
      localStorage.setItem('hoollow_active_roadmap', JSON.stringify(activeRoadmap));
    }
    localStorage.setItem('hoollow_completed_tasks', JSON.stringify(completedTaskIds));
    localStorage.setItem('hoollow_xp_points', xpPoints.toString());
    localStorage.setItem('hoollow_streak_days', streakDays.toString());
  }, [activeRoadmap, completedTaskIds, xpPoints, streakDays]);

  // Sync to Backend
  const syncToBackend = async (roadmap, completedIds, xp, streak) => {
    try {
      const token = localStorage.getItem('professorvirus_token') || sessionStorage.getItem('professorvirus_token');
      await fetch(`${API_URL}/api/hoollow/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          roadmapId: roadmap?.id,
          roadmapData: roadmap,
          completedTaskIds: completedIds,
          xpEarned: xp,
          streakCount: streak,
          activityDate: new Date().toISOString().split('T')[0]
        })
      });
    } catch (e) {
      // Offline / guest mode handled via localStorage
    }
  };

  // Generate Roadmap Flow
  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);
    setGeneratingStepText('Analyzing your learning goal and requirements...');

    const goalToGenerate = selectedGoal === 'Custom Goal' && customGoalText.trim()
      ? customGoalText.trim()
      : selectedGoal;

    const steps = [
      'Analyzing your learning goal and requirements...',
      'Synthesizing optimal 5-phase curriculum...',
      'Curating verified video, documentation & practice tasks...',
      'Calibrating milestones and daily study pace...',
      'Finalizing your personalized HOOLLOW Roadmap!'
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setGeneratingStepText(steps[stepIdx]);
      }
    }, 600);

    try {
      const res = await fetch(`${API_URL}/api/hoollow/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: selectedGoal,
          customGoal: customGoalText,
          level: currentLevel,
          dailyStudyTime,
          timeline: goalTimeline,
          learningStyle
        })
      });

      const data = await res.json();
      clearInterval(interval);

      if (data?.success && data?.roadmap) {
        setActiveRoadmap(data.roadmap);
        setActiveTab('dashboard');
        setActivePhaseIndex(0);
        showToast('🎉 Your personalized roadmap has been generated!');
        syncToBackend(data.roadmap, completedTaskIds, xpPoints, streakDays);
      } else {
        // Fallback locally
        const fallback = getRoadmapForGoal(
          selectedGoal,
          customGoalText,
          currentLevel,
          dailyStudyTime,
          goalTimeline,
          learningStyle
        );
        setActiveRoadmap(fallback);
        setActiveTab('dashboard');
        setActivePhaseIndex(0);
        showToast('🎉 Your personalized roadmap is ready!');
        syncToBackend(fallback, completedTaskIds, xpPoints, streakDays);
      }
    } catch {
      clearInterval(interval);
      const fallback = getRoadmapForGoal(
        selectedGoal,
        customGoalText,
        currentLevel,
        dailyStudyTime,
        goalTimeline,
        learningStyle
      );
      setActiveRoadmap(fallback);
      setActiveTab('dashboard');
      setActivePhaseIndex(0);
      showToast('🎉 Your personalized roadmap is ready!');
      syncToBackend(fallback, completedTaskIds, xpPoints, streakDays);
    } finally {
      setIsGenerating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Toggle Task Completion with Gamification Reward
  const handleToggleTaskComplete = (taskId) => {
    const isAlreadyCompleted = completedTaskIds.includes(taskId);
    let nextCompleted;

    if (isAlreadyCompleted) {
      nextCompleted = completedTaskIds.filter((id) => id !== taskId);
      setCompletedTaskIds(nextCompleted);
      setXpPoints((prev) => Math.max(0, prev - 50));
      showToast('Task marked incomplete');
    } else {
      nextCompleted = [...completedTaskIds, taskId];
      setCompletedTaskIds(nextCompleted);
      setXpPoints((prev) => prev + 50);
      showToast('⭐ +50 XP Earned! Streak Updated 🔥');
    }

    syncToBackend(activeRoadmap, nextCompleted, xpPoints + (isAlreadyCompleted ? -50 : 50), streakDays);
  };

  // Calculate Progress Stats
  const allTasks = activeRoadmap?.phases?.flatMap((p) => p.tasks) || [];
  const totalTasksCount = allTasks.length;
  const completedCount = allTasks.filter((t) => completedTaskIds.includes(t.id)).length;
  const overallProgressPercent = totalTasksCount > 0 ? Math.round((completedCount / totalTasksCount) * 100) : 0;

  // Active Phase Data
  const currentPhase = activeRoadmap?.phases?.[activePhaseIndex] || activeRoadmap?.phases?.[0];

  return (
    <div
      style={{
        backgroundColor: '#FFF9F1',
        minHeight: '100vh',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#1F2421',
        paddingBottom: '4rem'
      }}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#8B101D',
            color: '#FFFFFF',
            padding: '0.85rem 1.4rem',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(104, 19, 27, 0.35)',
            zIndex: 10000,
            fontSize: '0.9rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <Sparkles size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Switcher (When a roadmap is active) */}
      {activeRoadmap && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #F1E5D8',
            padding: '0.65rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                backgroundColor: '#FFF0E8',
                color: '#8B101D',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.04em'
              }}
            >
              ACTIVE ROADMAP
            </span>
            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1F2421' }}>
              {activeRoadmap.targetGoal} ({overallProgressPercent}% Complete)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab(activeTab === 'dashboard' ? 'generator' : 'dashboard')}
              style={{
                backgroundColor: activeTab === 'dashboard' ? '#F6F2E9' : '#8B101D',
                color: activeTab === 'dashboard' ? '#1F2421' : '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              {activeTab === 'dashboard' ? (
                <>
                  <Edit3 size={13} /> Edit / Generate New Goal
                </>
              ) : (
                <>
                  <Layers size={13} /> View Current Dashboard →
                </>
              )}
            </button>

            <button
              onClick={() => setIsMentorOpen(true)}
              style={{
                backgroundColor: '#8B101D',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Bot size={14} /> AI Mentor
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {/* ==================================================================== */}
        {/* VIEW 1: HOOLLOW LANDING & GENERATOR (EXACT VISUAL RECREATION)        */}
        {/* ==================================================================== */}
        {activeTab === 'generator' && (
          <div>
            {/* HERO SECTION */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '2rem 1rem 1.5rem',
                gap: '2rem',
                flexWrap: 'wrap'
              }}
            >
              {/* Left Column: Branding, Tag, Headline, Feature Highlights */}
              <div style={{ flex: '1 1 540px', minWidth: '300px' }}>
                {/* Pill Tag */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: '#FFF0E8',
                    border: '1px solid #FAD6C5',
                    borderRadius: '9999px',
                    padding: '0.25rem 0.75rem',
                    marginBottom: '1rem'
                  }}
                >
                  <span
                    style={{
                      backgroundColor: '#8B101D',
                      color: '#FFF',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '0.12rem 0.45rem',
                      borderRadius: '9999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}
                  >
                    ✨ New
                  </span>
                  <span
                    style={{
                      color: '#8B101D',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      letterSpacing: '0.02em'
                    }}
                  >
                    AI-Powered Learning Roadmap
                  </span>
                </div>

                {/* Massive Headline */}
                <h1
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 900,
                    fontSize: 'clamp(2.8rem, 6vw, 4.4rem)',
                    lineHeight: 1.02,
                    margin: '0 0 0.35rem',
                    letterSpacing: '-0.02em',
                    background: 'linear-gradient(90deg, #8B101D 0%, #D9381E 45%, #F28A16 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                  }}
                >
                  HOOLLOW
                </h1>

                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(1.5rem, 3.2vw, 2.2rem)',
                    color: '#68131B',
                    lineHeight: 1.15,
                    marginBottom: '0.75rem'
                  }}
                >
                  AI Roadmap Generator
                </div>

                {/* Supporting Text */}
                <p
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#2D3238',
                    margin: '0 0 0.4rem',
                    lineHeight: 1.4
                  }}
                >
                  Turn your goals into a personalized learning roadmap.
                </p>

                <p
                  style={{
                    fontSize: '0.88rem',
                    color: '#646E78',
                    margin: '0 0 1.75rem',
                    lineHeight: 1.5,
                    maxWidth: '520px'
                  }}
                >
                  Get a step-by-step plan, curated resources, practice tasks and progress tracking — all in one place.
                </p>

                {/* Four Feature Highlights */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    flexWrap: 'wrap'
                  }}
                >
                  {/* Highlight 1 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '90px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#FFF0E8',
                        border: '1px solid #FAD6C5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#8B101D',
                        marginBottom: '0.4rem'
                      }}
                    >
                      <Target size={20} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#68131B', lineHeight: 1.25 }}>
                      Personalized Roadmap
                    </span>
                  </div>

                  {/* Highlight 2 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '90px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#FFF0E8',
                        border: '1px solid #FAD6C5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#8B101D',
                        marginBottom: '0.4rem'
                      }}
                    >
                      <ListOrdered size={20} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#68131B', lineHeight: 1.25 }}>
                      Step-by-Step Guidance
                    </span>
                  </div>

                  {/* Highlight 3: 60-Second Demo Trigger */}
                  <div
                    onClick={() => setIsDemoOpen(true)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      width: '90px',
                      cursor: 'pointer'
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#FFF0E8',
                        border: '1.5px solid #F28A16',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#F28A16',
                        marginBottom: '0.4rem',
                        boxShadow: '0 4px 12px rgba(242, 138, 22, 0.2)'
                      }}
                    >
                      <Zap size={20} fill="#F28A16" />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#68131B', lineHeight: 1.25 }}>
                      60-Second Demo
                    </span>
                  </div>

                  {/* Highlight 4 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '90px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: '#FFF0E8',
                        border: '1px solid #FAD6C5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#8B101D',
                        marginBottom: '0.4rem'
                      }}
                    >
                      <Trophy size={20} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#68131B', lineHeight: 1.25 }}>
                      Streaks & Rewards
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: HOOLLOW 3D Robot Mascot & Floating Badges */}
              <div
                style={{
                  flex: '1 1 380px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  minHeight: '340px'
                }}
              >
                {/* Floating Badge 1 (Top Left) */}
                <div
                  className="pv-float-card"
                  style={{
                    position: 'absolute',
                    top: '15px',
                    left: '5px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '0.45rem 0.85rem',
                    boxShadow: '0 8px 20px rgba(104, 19, 27, 0.08)',
                    border: '1px solid #F1E5D8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#1F2421',
                    zIndex: 2
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>💡</span>
                  <span>Learn Smarter</span>
                </div>

                {/* Floating Badge 2 (Mid Left) */}
                <div
                  className="pv-float-card"
                  style={{
                    position: 'absolute',
                    top: '125px',
                    left: '-10px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '0.45rem 0.85rem',
                    boxShadow: '0 8px 20px rgba(104, 19, 27, 0.08)',
                    border: '1px solid #F1E5D8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#8B101D',
                    zIndex: 2
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>🎯</span>
                  <span>AI-Powered Roadmap</span>
                </div>

                {/* Floating Badge 3 (Top Right) */}
                <div
                  className="pv-float-card"
                  style={{
                    position: 'absolute',
                    top: '25px',
                    right: '10px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '0.45rem 0.85rem',
                    boxShadow: '0 8px 20px rgba(104, 19, 27, 0.08)',
                    border: '1px solid #F1E5D8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#2563EB',
                    zIndex: 2
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>📈</span>
                  <span>Achieve Your Goals</span>
                </div>

                {/* Floating Badge 4 (Bottom Right) */}
                <div
                  className="pv-float-card"
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '5px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '0.45rem 0.85rem',
                    boxShadow: '0 8px 20px rgba(104, 19, 27, 0.08)',
                    border: '1px solid #F1E5D8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#16A34A',
                    zIndex: 2
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>🚀</span>
                  <span>Step-by-Step to Success</span>
                </div>

                {/* Robot Mascot Image */}
                <div
                  style={{
                    width: '320px',
                    height: '320px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  {/* Subtle warm glow behind mascot */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '240px',
                      height: '240px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(242, 138, 22, 0.22) 0%, rgba(255, 249, 241, 0) 70%)',
                      filter: 'blur(10px)',
                      zIndex: 0
                    }}
                  />
                  <img
                    src="/assets/hoollow_mascot.png"
                    alt="HOOLLOW AI Robot Mascot"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      position: 'relative',
                      zIndex: 1,
                      filter: 'drop-shadow(0 15px 25px rgba(104, 19, 27, 0.12))'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* GOAL SELECTION & PREFERENCES MASTER PANEL (WHITE CARD) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #F1E5D8',
                boxShadow: '0 10px 35px rgba(104, 19, 27, 0.04)',
                padding: 'clamp(1.2rem, 3vw, 2rem)',
                marginTop: '1rem'
              }}
            >
              {/* Panel Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: '#68131B',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(104, 19, 27, 0.2)'
                    }}
                  >
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: '1.35rem',
                        fontWeight: 800,
                        color: '#1F2421',
                        fontFamily: "'Outfit', sans-serif"
                      }}
                    >
                      What do you want to learn?
                    </h2>
                    <p style={{ margin: '0.15rem 0 0', fontSize: '0.85rem', color: '#7A6F62' }}>
                      Choose your goal and let Hoolow create a personalized roadmap for you.
                    </p>
                  </div>
                </div>

                {/* Custom Goal Button */}
                <button
                  onClick={() => setSelectedGoal('Custom Goal')}
                  style={{
                    backgroundColor: selectedGoal === 'Custom Goal' ? '#FFF5F3' : '#FFFFFF',
                    border: selectedGoal === 'Custom Goal' ? '1.5px solid #8B101D' : '1px solid #E8E2D5',
                    borderRadius: '9999px',
                    padding: '0.5rem 1.1rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: selectedGoal === 'Custom Goal' ? '#8B101D' : '#1F2421',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  <Edit3 size={14} /> Custom Goal
                </button>
              </div>

              {/* Goal Cards Grid (5 x 2 matching reference) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(215px, 1fr))',
                  gap: '0.9rem',
                  marginBottom: '1.75rem'
                }}
              >
                {HOOLLOW_GOALS.map((g) => {
                  const isSelected = selectedGoal === g.title;

                  // Render Appropriate Icon
                  const renderIcon = () => {
                    switch (g.iconType) {
                      case 'python':
                        return (
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#FEF3C7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.25rem'
                            }}
                          >
                            🐍
                          </div>
                        );
                      case 'globe':
                        return (
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#EBF5FF',
                              color: '#2563EB',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Globe size={18} />
                          </div>
                        );
                      case 'brain':
                        return (
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#F3E8FF',
                              color: '#9333EA',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Brain size={18} />
                          </div>
                        );
                      case 'barchart':
                        return (
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#FEF3C7',
                              color: '#D97706',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <BarChart2 size={18} />
                          </div>
                        );
                      case 'shield':
                        return (
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#FFF7ED',
                              color: '#EA580C',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <ShieldCheck size={18} />
                          </div>
                        );
                      case 'smartphone':
                        return (
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#E0F2FE',
                              color: '#0284C7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Smartphone size={18} />
                          </div>
                        );
                      case 'cloud':
                        return (
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#EEF2FF',
                              color: '#4F46E5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Cloud size={18} />
                          </div>
                        );
                      case 'code':
                        return (
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#FFE4E6',
                              color: '#E11D48',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Code2 size={18} />
                          </div>
                        );
                      case 'settings':
                        return (
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#EFF6FF',
                              color: '#1D4ED8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Settings size={18} />
                          </div>
                        );
                      case 'target':
                      default:
                        return (
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#FEE2E2',
                              color: '#DC2626',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Target size={18} />
                          </div>
                        );
                    }
                  };

                  return (
                    <div
                      key={g.id}
                      onClick={() => setSelectedGoal(g.title)}
                      style={{
                        backgroundColor: isSelected ? '#FFF5F3' : '#FFFFFF',
                        border: isSelected ? '2px solid #8B101D' : '1px solid #EFEAE2',
                        borderRadius: '16px',
                        padding: '1rem',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        boxShadow: isSelected
                          ? '0 6px 18px rgba(139, 16, 29, 0.12)'
                          : '0 2px 6px rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        minHeight: '115px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#CBB6A5';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#EFEAE2';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {/* Red Checkmark Badge when Selected (Matching Reference) */}
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#8B101D',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 900
                          }}
                        >
                          ✓
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        {renderIcon()}
                        <div style={{ paddingRight: isSelected ? '18px' : '0' }}>
                          <h3
                            style={{
                              margin: '0 0 0.25rem',
                              fontSize: '0.88rem',
                              fontWeight: 800,
                              color: '#1F2421',
                              lineHeight: 1.25
                            }}
                          >
                            {g.title}
                          </h3>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '0.72rem',
                              color: '#646E78',
                              lineHeight: 1.35
                            }}
                          >
                            {g.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Goal Input (Shown when Custom Goal is selected) */}
              {selectedGoal === 'Custom Goal' && (
                <div
                  style={{
                    backgroundColor: '#FFF9F1',
                    border: '1.5px solid #8B101D',
                    borderRadius: '16px',
                    padding: '1.2rem',
                    marginBottom: '1.75rem',
                    animation: 'fadeIn 0.2s ease-out'
                  }}
                >
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: '#68131B',
                      marginBottom: '0.4rem'
                    }}
                  >
                    Specify your custom learning goal or career target:
                  </label>
                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <input
                      type="text"
                      value={customGoalText}
                      onChange={(e) => setCustomGoalText(e.target.value)}
                      placeholder="e.g. Next.js Full Stack with GraphQL, Rust Systems Programming, Blockchain Web3..."
                      style={{
                        flex: 1,
                        padding: '0.7rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid #E8E2D5',
                        fontSize: '0.88rem',
                        outline: 'none',
                        backgroundColor: '#FFFFFF'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* LEARNING PREFERENCES PANEL (MATCHING REFERENCE) */}
              <div style={{ marginBottom: '2rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Settings size={16} color="#68131B" />
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#68131B' }}>
                    Your Learning Preferences
                  </span>
                </div>

                {/* 4 Form Controls Row with subtle separators */}
                <div
                  style={{
                    backgroundColor: '#FAF5EE',
                    borderRadius: '16px',
                    border: '1px solid #EDE5DA',
                    padding: '0.75rem 1rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: '1rem',
                    alignItems: 'center'
                  }}
                >
                  {/* Control 1: Current Level */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.25rem 0.5rem' }}>
                    <div style={{ color: '#8B101D', flexShrink: 0 }}>
                      <User size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#7A6F62' }}>
                        Your Current Level
                      </label>
                      <select
                        value={currentLevel}
                        onChange={(e) => setCurrentLevel(e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: '#1F2421',
                          outline: 'none',
                          cursor: 'pointer',
                          padding: '2px 0'
                        }}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  {/* Control 2: Daily Study Time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.25rem 0.5rem', borderLeft: '1px solid #E8DFD3' }}>
                    <div style={{ color: '#8B101D', flexShrink: 0 }}>
                      <Clock size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#7A6F62' }}>
                        Daily Study Time
                      </label>
                      <select
                        value={dailyStudyTime}
                        onChange={(e) => setDailyStudyTime(e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: '#1F2421',
                          outline: 'none',
                          cursor: 'pointer',
                          padding: '2px 0'
                        }}
                      >
                        <option value="30 minutes">30 minutes</option>
                        <option value="1 hour">1 hour</option>
                        <option value="2 hours">2 hours</option>
                        <option value="3+ hours">3+ hours</option>
                      </select>
                    </div>
                  </div>

                  {/* Control 3: Goal Timeline */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.25rem 0.5rem', borderLeft: '1px solid #E8DFD3' }}>
                    <div style={{ color: '#8B101D', flexShrink: 0 }}>
                      <Calendar size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#7A6F62' }}>
                        Goal Timeline
                      </label>
                      <select
                        value={goalTimeline}
                        onChange={(e) => setGoalTimeline(e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: '#1F2421',
                          outline: 'none',
                          cursor: 'pointer',
                          padding: '2px 0'
                        }}
                      >
                        <option value="3 months">3 months</option>
                        <option value="6 months">6 months</option>
                        <option value="1 year">1 year</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>
                  </div>

                  {/* Control 4: Learning Style */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.25rem 0.5rem', borderLeft: '1px solid #E8DFD3' }}>
                    <div style={{ color: '#8B101D', flexShrink: 0 }}>
                      <BookOpen size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#7A6F62' }}>
                        Learning Style
                      </label>
                      <select
                        value={learningStyle}
                        onChange={(e) => setLearningStyle(e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'transparent',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: '#1F2421',
                          outline: 'none',
                          cursor: 'pointer',
                          padding: '2px 0'
                        }}
                      >
                        <option value="Video + Notes + Practice">Video + Notes + Practice</option>
                        <option value="Video Only">Video Focused</option>
                        <option value="Reading & Docs">Reading & Documentation</option>
                        <option value="Hands-on Projects">Hands-on Projects Only</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRIMARY CTA (MATCHING REFERENCE EXACTLY) */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  marginTop: '1rem'
                }}
              >
                <button
                  onClick={handleGenerateRoadmap}
                  disabled={isGenerating}
                  style={{
                    backgroundColor: '#8B101D',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '0.9rem 2.8rem',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    fontFamily: "'Outfit', sans-serif",
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    boxShadow: '0 8px 24px rgba(139, 16, 29, 0.35)',
                    transition: 'all 0.2s ease',
                    transform: isGenerating ? 'none' : 'scale(1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isGenerating) {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.backgroundColor = '#68131B';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isGenerating) {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.backgroundColor = '#8B101D';
                    }
                  }}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={20} className="pv-spin" />
                      <span>{generatingStepText || 'Generating My Roadmap...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} color="#FFD700" />
                      <span>Generate My Roadmap →</span>
                    </>
                  )}
                </button>

                {/* Trust Subtitle */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    marginTop: '0.8rem',
                    fontSize: '0.82rem',
                    color: '#646E78',
                    fontWeight: 600
                  }}
                >
                  <ShieldCheck size={16} color="#8B101D" />
                  <span>100% Personalized · Based on your goal, level and available time</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 2: GUIDED LEARNING PATH DASHBOARD (AFTER GENERATION)            */}
        {/* ==================================================================== */}
        {activeTab === 'dashboard' && activeRoadmap && (
          <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
            {/* Top Dashboard Header */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #F1E5D8',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 8px 24px rgba(104, 19, 27, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.2rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span
                    style={{
                      backgroundColor: '#8B101D',
                      color: '#FFF',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.55rem',
                      borderRadius: '9999px'
                    }}
                  >
                    PERSONALIZED ROADMAP
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#7A6F62', fontWeight: 600 }}>
                    {activeRoadmap.level} · {activeRoadmap.dailyStudyTime}/day · {activeRoadmap.timeline}
                  </span>
                </div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    color: '#1F2421',
                    fontFamily: "'Outfit', sans-serif"
                  }}
                >
                  {activeRoadmap.title}
                </h1>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.88rem', color: '#4A5568', maxWidth: '700px', lineHeight: 1.5 }}>
                  {activeRoadmap.summary}
                </p>
              </div>

              {/* Progress Summary Card */}
              <div
                style={{
                  backgroundColor: '#FFF9F1',
                  borderRadius: '16px',
                  border: '1px solid #F1E5D8',
                  padding: '1rem 1.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.2rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7A6F62', textTransform: 'uppercase' }}>
                    Completion
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#8B101D', lineHeight: 1.1 }}>
                    {overallProgressPercent}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#68131B', fontWeight: 600 }}>
                    {completedCount} of {totalTasksCount} tasks done
                  </div>
                </div>

                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: `conic-gradient(#8B101D ${overallProgressPercent * 3.6}deg, #EBE3D7 0deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px'
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      color: '#1F2421'
                    }}
                  >
                    {overallProgressPercent}%
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Panel Layout: Left (Phases) | Center (Tasks) | Right (Progress & Gamification) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(240px, 280px) minmax(360px, 1fr) minmax(260px, 300px)',
                gap: '1.25rem',
                alignItems: 'start'
              }}
              className="pv-dashboard-grid"
            >
              {/* ============================================================== */}
              {/* LEFT PANEL: ROADMAP PHASES                                     */}
              {/* ============================================================== */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #F1E5D8',
                  padding: '1.2rem',
                  boxShadow: '0 4px 16px rgba(104, 19, 27, 0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Layers size={18} color="#8B101D" />
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#1F2421' }}>
                    Roadmap Phases
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(activeRoadmap.phases || []).map((phase, pIdx) => {
                    const isSelected = activePhaseIndex === pIdx;
                    const phaseTasks = phase.tasks || [];
                    const pCompleted = phaseTasks.filter((t) => completedTaskIds.includes(t.id)).length;
                    const isFullyDone = phaseTasks.length > 0 && pCompleted === phaseTasks.length;

                    return (
                      <div
                        key={phase.id || pIdx}
                        onClick={() => setActivePhaseIndex(pIdx)}
                        style={{
                          backgroundColor: isSelected ? '#FFF5F3' : '#FAF7F2',
                          border: isSelected ? '1.5px solid #8B101D' : '1px solid #EFEAE2',
                          borderRadius: '12px',
                          padding: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: isSelected ? '#8B101D' : '#7A6F62' }}>
                            Phase {pIdx + 1}
                          </span>
                          {isFullyDone ? (
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#16A34A', background: '#DCFCE7', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                              Completed ✓
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#7A6F62' }}>
                              {pCompleted}/{phaseTasks.length}
                            </span>
                          )}
                        </div>

                        <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1F2421', lineHeight: 1.25 }}>
                          {phase.name}
                        </div>

                        {/* Phase Mini Progress Bar */}
                        <div style={{ width: '100%', height: '4px', backgroundColor: '#E8E2D5', borderRadius: '9999px', marginTop: '0.5rem', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${phaseTasks.length > 0 ? (pCompleted / phaseTasks.length) * 100 : 0}%`,
                              height: '100%',
                              backgroundColor: '#8B101D'
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ============================================================== */}
              {/* CENTER PANEL: LEARNING TASKS FOR ACTIVE PHASE                  */}
              {/* ============================================================== */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Active Phase Info Card */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #F1E5D8',
                    padding: '1.25rem 1.5rem',
                    boxShadow: '0 4px 16px rgba(104, 19, 27, 0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8B101D', textTransform: 'uppercase' }}>
                      Phase {activePhaseIndex + 1} of {(activeRoadmap.phases || []).length}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#646E78', background: '#F6F2E9', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                      {currentPhase?.duration || '3 Weeks'}
                    </span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#1F2421' }}>
                    {currentPhase?.name}
                  </h2>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#646E78' }}>
                    {currentPhase?.description}
                  </p>
                </div>

                {/* Tasks List */}
                {(currentPhase?.tasks || []).map((task, tIdx) => {
                  const isCompleted = completedTaskIds.includes(task.id);

                  return (
                    <div
                      key={task.id || tIdx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: isCompleted ? '1.5px solid #276749' : '1px solid #EFEAE2',
                        padding: '1.2rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.8rem', marginBottom: '0.4rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#8B101D' }}>
                              Task {tIdx + 1}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#7A6F62', fontWeight: 600 }}>
                              · {task.duration || '2 Hours'}
                            </span>
                          </div>
                          <h3
                            style={{
                              margin: 0,
                              fontSize: '1.02rem',
                              fontWeight: 800,
                              color: isCompleted ? '#276749' : '#1F2421',
                              textDecoration: isCompleted ? 'line-through' : 'none'
                            }}
                          >
                            {task.title}
                          </h3>
                        </div>

                        {/* Complete Status Pill */}
                        <button
                          onClick={() => handleToggleTaskComplete(task.id)}
                          style={{
                            backgroundColor: isCompleted ? '#DCFCE7' : '#F6F2E9',
                            color: isCompleted ? '#16A34A' : '#4A5568',
                            border: 'none',
                            borderRadius: '9999px',
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            flexShrink: 0
                          }}
                        >
                          <CheckCircle2 size={14} />
                          {isCompleted ? 'Completed' : 'Mark Done'}
                        </button>
                      </div>

                      <p style={{ margin: '0 0 0.85rem', fontSize: '0.82rem', color: '#4A5568', lineHeight: 1.5 }}>
                        {task.description}
                      </p>

                      {/* Resource Buttons & Start Action */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                          borderTop: '1px solid #F5EFE8',
                          paddingTop: '0.8rem'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {task.resources?.video && (
                            <a
                              href={task.resources.video}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                backgroundColor: '#FEF2F2',
                                color: '#DC2626',
                                padding: '0.25rem 0.55rem',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                textDecoration: 'none'
                              }}
                            >
                              <Play size={11} fill="#DC2626" /> Video
                            </a>
                          )}

                          {task.resources?.notes && (
                            <a
                              href={task.resources.notes}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                backgroundColor: '#EFF6FF',
                                color: '#2563EB',
                                padding: '0.25rem 0.55rem',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                textDecoration: 'none'
                              }}
                            >
                              <BookOpen size={11} /> Notes
                            </a>
                          )}

                          {task.resources?.practice && (
                            <a
                              href={task.resources.practice}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                backgroundColor: '#F0FDF4',
                                color: '#16A34A',
                                padding: '0.25rem 0.55rem',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                textDecoration: 'none'
                              }}
                            >
                              <Code2 size={11} /> Practice
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setSelectedTaskForModal(task);
                            setSelectedPhaseForModal(currentPhase?.name || '');
                          }}
                          style={{
                            backgroundColor: '#8B101D',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.35rem 0.85rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          Start Learning →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ============================================================== */}
              {/* RIGHT PANEL: PROGRESS, STREAKS, XP & AI MENTOR                */}
              {/* ============================================================== */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Gamification Stats Card */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #F1E5D8',
                    padding: '1.25rem',
                    boxShadow: '0 4px 16px rgba(104, 19, 27, 0.03)'
                  }}
                >
                  <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 800, color: '#1F2421' }}>
                    Learning Streaks & Rewards
                  </h3>

                  {/* Daily Streak */}
                  <div
                    style={{
                      backgroundColor: '#FFF7ED',
                      borderRadius: '12px',
                      padding: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.75rem',
                      border: '1px solid #FED7AA'
                    }}
                  >
                    <div style={{ fontSize: '1.8rem' }}>🔥</div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#C2410C', lineHeight: 1.1 }}>
                        {streakDays} Day Streak
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#7A6F62' }}>
                        Calculated from real daily learning activity
                      </div>
                    </div>
                  </div>

                  {/* XP Points */}
                  <div
                    style={{
                      backgroundColor: '#FEF3C7',
                      borderRadius: '12px',
                      padding: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1rem',
                      border: '1px solid #FDE68A'
                    }}
                  >
                    <div style={{ fontSize: '1.8rem' }}>⚡</div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#B45309', lineHeight: 1.1 }}>
                        {xpPoints} XP Earned
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#7A6F62' }}>
                        +50 XP per completed task
                      </div>
                    </div>
                  </div>

                  {/* Unlocked Badges */}
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#68131B', marginBottom: '0.5rem' }}>
                      Earned Badges
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#FFF0E8', color: '#8B101D', padding: '0.2rem 0.55rem', borderRadius: '6px', border: '1px solid #FAD6C5' }}>
                        🏆 First Step
                      </span>
                      {completedCount >= 3 && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#FEF3C7', color: '#B45309', padding: '0.2rem 0.55rem', borderRadius: '6px', border: '1px solid #FDE68A' }}>
                          ⚡ Consistent Coder
                        </span>
                      )}
                      {completedCount >= 5 && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#DCFCE7', color: '#16A34A', padding: '0.2rem 0.55rem', borderRadius: '6px', border: '1px solid #BBF7D0' }}>
                          🌟 Phase Crusher
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Mentor Trigger Card */}
                <div
                  style={{
                    backgroundColor: '#FFF9F1',
                    borderRadius: '20px',
                    border: '1px solid #F1E5D8',
                    padding: '1.25rem',
                    boxShadow: '0 4px 16px rgba(104, 19, 27, 0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#8B101D',
                        color: '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Bot size={18} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#1F2421' }}>
                        HOOLLOW AI Mentor
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#7A6F62' }}>
                        Instant help & code explanations
                      </p>
                    </div>
                  </div>

                  <p style={{ margin: '0.5rem 0 0.9rem', fontSize: '0.78rem', color: '#4A5568', lineHeight: 1.45 }}>
                    Have doubts about this topic or need a step-by-step code snippet? Ask our AI mentor directly.
                  </p>

                  <button
                    onClick={() => setIsMentorOpen(true)}
                    style={{
                      width: '100%',
                      backgroundColor: '#8B101D',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.55rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Bot size={15} /> Chat with AI Mentor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 60-Second Demo Modal */}
      <HoollowDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onTryGenerator={() => {
          setIsDemoOpen(false);
          setActiveTab('generator');
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
      />

      {/* Start Learning Task Modal */}
      <HoollowTaskModal
        isOpen={!!selectedTaskForModal}
        onClose={() => setSelectedTaskForModal(null)}
        task={selectedTaskForModal}
        phaseName={selectedPhaseForModal}
        isCompleted={completedTaskIds.includes(selectedTaskForModal?.id)}
        onToggleComplete={handleToggleTaskComplete}
        onAskMentor={(taskTitle) => {
          setIsMentorOpen(true);
        }}
      />

      {/* AI Mentor Drawer */}
      <HoollowMentorDrawer
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
        currentGoal={activeRoadmap?.targetGoal || selectedGoal}
        initialTopic={selectedTaskForModal?.title || ''}
      />
    </div>
  );
}
