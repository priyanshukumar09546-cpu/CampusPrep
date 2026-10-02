// ============================================================================
// PROFESSORVIRUS — INTERVIEW PRO: ROUND 1 (APTITUDE TEST)
// Authentic placement environment matching exact ProfessorVirus styling
// Features:
// - Stepper: 1 Aptitude (ACTIVE) -> 2 Coding (Locked) -> 3 AI Tech (Locked) -> 4 AI HR (Locked)
// - 35-Minute reverse countdown timer (stored in localStorage for refresh safety)
// - Question palette with categories, answer status, and marked-for-review
// - Option selection, Clear Response, Save & Next, and confirmation modal
// - Evaluates answers securely, marks Aptitude completed, and transitions to Coding
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Code,
  Bot,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Check,
  Send,
  HelpCircle,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  LogOut,
  Maximize2,
  Minimize2
} from 'lucide-react';
import {
  getActiveAttemptId,
  getOrGenerateAptitudeAttempt,
  evaluateAptitudeAnswers,
  completeRound,
  isRoundAccessible
} from '../utils/interviewSessionManager';

export default function InterviewAptitudePage({ onNavigate, onOpenAuth }) {
  // Active Attempt & Session Configuration
  const [attemptId, setAttemptId] = useState(() => getActiveAttemptId());
  const [activeTestConfig, setActiveTestConfig] = useState(() => {
    try {
      const raw = sessionStorage.getItem('interview_pro_active_test');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Attempt Data & Questions (with Refresh Safety)
  const [attemptData, setAttemptData] = useState(() => {
    const curAttemptId = getActiveAttemptId();
    return getOrGenerateAptitudeAttempt(curAttemptId);
  });

  const questions = attemptData.questions || [];
  const totalCount = questions.length;

  // Active question index (0 to totalCount - 1)
  const [currentIdx, setCurrentIdx] = useState(0);

  // Category filter for left palette
  const [categoryFilter, setCategoryFilter] = useState('All');

  // User answers map: { [qId]: selectedOptionIndex (0-3) }
  const [userAnswers, setUserAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem(`interview_pro_aptitude_answers_${getActiveAttemptId()}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Marked for review map: { [qId]: boolean }
  const [markedReview, setMarkedReview] = useState(() => {
    try {
      const saved = localStorage.getItem(`interview_pro_aptitude_review_${getActiveAttemptId()}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Visited questions set
  const [visitedQuestions, setVisitedQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem(`interview_pro_aptitude_visited_${getActiveAttemptId()}`);
      const initial = saved ? JSON.parse(saved) : [];
      return new Set(initial.length > 0 ? initial : [questions[0]?.id]);
    } catch {
      return new Set([questions[0]?.id]);
    }
  });

  // Modals & UI States
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 35-Minute Persistent Reverse Countdown Timer
  const [timeLeft, setTimeLeft] = useState(() => {
    const curAttempt = getActiveAttemptId();
    const savedEnd = localStorage.getItem(`interview_pro_aptitude_timer_end_${curAttempt}`);
    const now = Date.now();
    if (savedEnd) {
      const end = parseInt(savedEnd, 10);
      if (end > now) {
        return Math.floor((end - now) / 1000);
      }
    }
    // Default 35 minutes (2100 seconds)
    const newEnd = now + 35 * 60 * 1000;
    localStorage.setItem(`interview_pro_aptitude_timer_end_${curAttempt}`, String(newEnd));
    return 35 * 60;
  });

  // Mark first question as visited
  useEffect(() => {
    if (questions[currentIdx]?.id) {
      setVisitedQuestions(prev => {
        const next = new Set(prev);
        next.add(questions[currentIdx].id);
        try {
          localStorage.setItem(
            `interview_pro_aptitude_visited_${attemptId}`,
            JSON.stringify(Array.from(next))
          );
        } catch {}
        return next;
      });
    }
  }, [currentIdx, questions, attemptId]);

  // Persist answers
  useEffect(() => {
    try {
      localStorage.setItem(
        `interview_pro_aptitude_answers_${attemptId}`,
        JSON.stringify(userAnswers)
      );
    } catch {}
  }, [userAnswers, attemptId]);

  // Persist review marks
  useEffect(() => {
    try {
      localStorage.setItem(
        `interview_pro_aptitude_review_${attemptId}`,
        JSON.stringify(markedReview)
      );
    } catch {}
  }, [markedReview, attemptId]);

  // Timer Tick & Auto-submit
  useEffect(() => {
    const interval = setInterval(() => {
      const savedEnd = localStorage.getItem(`interview_pro_aptitude_timer_end_${attemptId}`);
      const now = Date.now();
      if (savedEnd) {
        const remaining = Math.max(0, Math.floor((parseInt(savedEnd, 10) - now) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          handleAutoSubmitOnTimeout();
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [attemptId]);

  const handleAutoSubmitOnTimeout = () => {
    setToastMessage({
      type: 'warning',
      text: "Time's up! Your 35-minute Aptitude assessment has ended. Submitting and unlocking Coding Round..."
    });
    setTimeout(() => {
      executeSubmission();
    }, 2000);
  };

  const activeQuestion = questions[currentIdx] || questions[0];

  const handleSelectOption = (optIdx) => {
    if (!activeQuestion) return;
    setUserAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: optIdx
    }));
  };

  const handleClearResponse = () => {
    if (!activeQuestion) return;
    setUserAnswers(prev => {
      const next = { ...prev };
      delete next[activeQuestion.id];
      return next;
    });
    setToastMessage({ type: 'info', text: 'Response cleared for this question.' });
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleToggleMarkReview = () => {
    if (!activeQuestion) return;
    setMarkedReview(prev => {
      const isCurrentlyMarked = !!prev[activeQuestion.id];
      return {
        ...prev,
        [activeQuestion.id]: !isCurrentlyMarked
      };
    });
  };

  const handleNext = () => {
    if (currentIdx < totalCount - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const executeSubmission = () => {
    setIsSubmitting(true);
    setIsSubmitModalOpen(false);

    // Evaluate answers
    const evaluation = evaluateAptitudeAnswers(attemptId, userAnswers);

    // Call server API for background sync
    try {
      fetch('/api/interview/aptitude/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId,
          userAnswers
        })
      }).catch(err => console.warn('[APTITUDE SUBMIT SYNC]', err));
    } catch {}

    // Complete round state and advance to Coding
    completeRound('aptitude', evaluation, attemptId);

    setToastMessage({
      type: 'success',
      text: `✓ Aptitude Round Submitted! Score: ${evaluation.score}/${evaluation.maxScore} (${evaluation.percentage}%). Unlocking Coding Round...`
    });

    setTimeout(() => {
      setIsSubmitting(false);
      if (onNavigate) {
        onNavigate('interview-coding');
      }
    }, 1800);
  };

  // Format Time (MM:SS)
  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Summary counts
  const answeredCount = Object.keys(userAnswers).length;
  const reviewCount = Object.keys(markedReview).filter(k => markedReview[k]).length;
  const unattemptedCount = Math.max(0, totalCount - answeredCount);

  // Palette filtering
  const filteredPaletteQuestions = questions.filter(q => {
    if (categoryFilter === 'All') return true;
    return q.category === categoryFilter;
  });

  return (
    <div style={{
      backgroundColor: '#FAF7F2',
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#1C1814',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* =========================================================================
          TOP BANNER: PROFESSORVIRUS BRAND + 4-ROUND STEPPER + APTITUDE TIMER
          ========================================================================= */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1.5px solid #EDE5D6',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(35,30,25,0.04)'
      }}>
        {/* Brand bar */}
        <div style={{
          padding: '0.45rem 1.25rem',
          borderBottom: '1px solid #F5EFE3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFDF9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{
              backgroundColor: '#781416',
              color: '#FFFFFF',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.2rem 0.55rem',
              borderRadius: '6px',
              letterSpacing: '0.04em'
            }}>
              INTERVIEW PRO
            </span>
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#1C1814' }}>
              Full Placement Assessment
            </span>
            <span style={{ fontSize: '0.76rem', color: '#8A5A1B', fontWeight: 600 }}>
              • Attempt ID: <code style={{ backgroundColor: '#F5EBD9', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>{attemptId}</code>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={toggleFullscreen}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid #EDE5D6',
                backgroundColor: '#FFFFFF',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#554C42',
                cursor: 'pointer'
              }}
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
            </button>
          </div>
        </div>

        {/* Stepper Flow + Timer + Submit Bar */}
        <div style={{
          padding: '0.65rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem'
        }}>
          {/* 4-ROUND STEPPER: 1 Aptitude ACTIVE -> 2 Coding -> 3 Tech -> 4 HR */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            flexWrap: 'wrap'
          }}>
            {/* Step 1: Aptitude (ACTIVE) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#FAF0EE',
              padding: '0.3rem 0.65rem',
              borderRadius: '8px',
              border: '1.5px solid #E8D5D5'
            }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: '#781416',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.74rem',
                fontWeight: 900
              }}>
                1
              </div>
              <FileText size={16} color="#781416" />
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#781416', lineHeight: 1.1 }}>
                  Round 1: Aptitude
                </div>
                <div style={{ fontSize: '0.68rem', color: '#8A5A1B', fontWeight: 700 }}>
                  35 Minutes (Active)
                </div>
              </div>
            </div>

            {/* Arrow */}
            <span style={{ color: '#D4C8B8', fontSize: '0.9rem' }}>→</span>

            {/* Step 2: Coding (LOCKED) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.65 }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: '#9CA3AF',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.74rem',
                fontWeight: 900
              }}>
                2
              </div>
              <Code size={16} color="#4B5563" />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4B5563', lineHeight: 1.1 }}>
                  Coding
                </div>
                <div style={{ fontSize: '0.68rem', color: '#9CA3AF', fontWeight: 600 }}>
                  60 Mins (Locked)
                </div>
              </div>
            </div>

            {/* Arrow */}
            <span style={{ color: '#D4C8B8', fontSize: '0.9rem' }}>→</span>

            {/* Step 3: AI Technical Interview (LOCKED) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.65 }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: '#9CA3AF',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.74rem',
                fontWeight: 900
              }}>
                3
              </div>
              <Bot size={16} color="#4B5563" />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4B5563', lineHeight: 1.1 }}>
                  AI Technical
                </div>
                <div style={{ fontSize: '0.68rem', color: '#9CA3AF', fontWeight: 600 }}>
                  30 Mins (Locked)
                </div>
              </div>
            </div>

            {/* Arrow */}
            <span style={{ color: '#D4C8B8', fontSize: '0.9rem' }}>→</span>

            {/* Step 4: AI HR / Behavioral (LOCKED) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: 0.65 }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: '#9CA3AF',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.74rem',
                fontWeight: 900
              }}>
                4
              </div>
              <Users size={16} color="#4B5563" />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4B5563', lineHeight: 1.1 }}>
                  AI HR
                </div>
                <div style={{ fontSize: '0.68rem', color: '#9CA3AF', fontWeight: 600 }}>
                  15 Mins (Locked)
                </div>
              </div>
            </div>
          </div>

          {/* Right: Section Timer (35 min) + Submit Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Aptitude Timer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#FFFBF5',
              border: '1.5px solid #F5E4CA',
              borderRadius: '8px',
              padding: '0.25rem 0.65rem'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '2px solid #781416',
                color: '#781416',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={15} color="#781416" />
              </div>
              <div>
                <div style={{ fontSize: '0.66rem', color: '#8A5A1B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Aptitude Timer
                </div>
                <div style={{
                  fontSize: '1.12rem',
                  fontWeight: 900,
                  color: timeLeft < 300 ? '#DC2626' : '#781416',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1
                }}>
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {/* Submit Aptitude Section */}
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              style={{
                backgroundColor: '#781416',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1.15rem',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 12px rgba(120, 20, 22, 0.28)',
                transition: 'all 0.15s ease'
              }}
            >
              <span>Submit Aptitude</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN TEST WORKSPACE: LEFT QUESTION PALETTE + CENTER QUESTION WORKSPACE
          ========================================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px minmax(0, 1fr)',
        gap: '1rem',
        padding: '1.25rem',
        flex: 1,
        maxWidth: '1600px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>

        {/* -------------------------------------------------------------------
            LEFT COLUMN: QUESTION PALETTE & CATEGORY FILTER
            ------------------------------------------------------------------- */}
        <aside style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1.5px solid #EDE5D6',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          height: 'fit-content',
          boxShadow: '0 2px 8px rgba(35,30,25,0.03)'
        }}>
          {/* Progress Overview Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1C1814' }}>
                Question Palette
              </span>
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#781416' }}>
                {answeredCount}/{totalCount} Answered
              </span>
            </div>
            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#EDE5D6',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${totalCount > 0 ? (answeredCount / totalCount) * 100 : 0}%`,
                backgroundColor: '#059669',
                borderRadius: '9999px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Status Legend */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.45rem',
            padding: '0.65rem',
            backgroundColor: '#FAF7F2',
            borderRadius: '8px',
            fontSize: '0.72rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#059669' }} />
              <span style={{ color: '#065F46', fontWeight: 700 }}>Answered ({answeredCount})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#D97706' }} />
              <span style={{ color: '#92400E', fontWeight: 700 }}>Review ({reviewCount})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#EDE5D6', border: '1px solid #D4C8B8' }} />
              <span style={{ color: '#6A6054', fontWeight: 600 }}>Unanswered ({unattemptedCount})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', border: '2px solid #781416' }} />
              <span style={{ color: '#781416', fontWeight: 700 }}>Current</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#8A5A1B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Filter by Section
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {[
                { id: 'All', label: 'All Sections (20)' },
                { id: 'Quantitative Aptitude', label: 'Quant (7)' },
                { id: 'Logical Reasoning', label: 'Logical (6)' },
                { id: 'Verbal Ability', label: 'Verbal (4)' },
                { id: 'Data Interpretation', label: 'Data Interp (3)' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  style={{
                    textAlign: 'left',
                    padding: '0.35rem 0.6rem',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.76rem',
                    fontWeight: categoryFilter === cat.id ? 800 : 600,
                    backgroundColor: categoryFilter === cat.id ? '#781416' : 'transparent',
                    color: categoryFilter === cat.id ? '#FFFFFF' : '#554C42',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Question Numbers */}
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#8A5A1B', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
              Select Question
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '0.4rem'
            }}>
              {questions.map((q, idx) => {
                const isSelected = idx === currentIdx;
                const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== null;
                const isMarked = !!markedReview[q.id];

                let bg = '#FFFFFF';
                let color = '#2C2620';
                let border = '1px solid #EDE5D6';

                if (isAnswered) {
                  bg = '#059669';
                  color = '#FFFFFF';
                  border = '1px solid #047857';
                }
                if (isMarked) {
                  bg = '#D97706';
                  color = '#FFFFFF';
                  border = '1px solid #B45309';
                }
                if (isSelected) {
                  border = '2.5px solid #781416';
                  if (!isAnswered && !isMarked) {
                    bg = '#FAF0EE';
                    color = '#781416';
                  }
                }

                // If filter active and question doesn't match, fade slightly
                const matchesFilter = categoryFilter === 'All' || q.category === categoryFilter;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    style={{
                      height: '36px',
                      borderRadius: '6px',
                      backgroundColor: bg,
                      color: color,
                      border: border,
                      fontWeight: isSelected ? 900 : 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      opacity: matchesFilter ? 1 : 0.35,
                      transition: 'all 0.15s ease'
                    }}
                    title={`Q${idx + 1}: ${q.category} (${q.topic})`}
                  >
                    {idx + 1}
                    {isMarked && (
                      <span style={{
                        position: 'absolute',
                        top: -3,
                        right: -3,
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: '#781416',
                        border: '1px solid #FFFFFF'
                      }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* -------------------------------------------------------------------
            CENTER WORKSPACE: QUESTION CARD & OPTIONS SELECTION
            ------------------------------------------------------------------- */}
        <main style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1.5px solid #EDE5D6',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 2px 10px rgba(35,30,25,0.03)',
          overflow: 'hidden'
        }}>
          {activeQuestion ? (
            <>
              {/* Question Header: Category, Topic, Difficulty & Index */}
              <div style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #EDE5D6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.65rem',
                backgroundColor: '#FFFDF9'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: 900,
                    color: '#781416'
                  }}>
                    Question {currentIdx + 1} of {totalCount}
                  </span>

                  <span style={{
                    backgroundColor: '#FAF0DE',
                    border: '1px solid #E5CE9F',
                    color: '#B45309',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '6px'
                  }}>
                    {activeQuestion.category}
                  </span>

                  <span style={{
                    backgroundColor: '#F3E8FF',
                    border: '1px solid #D8B4FE',
                    color: '#6D28D9',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '6px'
                  }}>
                    {activeQuestion.topic}
                  </span>

                  <span style={{
                    backgroundColor: activeQuestion.difficulty === 'Easy' ? '#DCFCE7' : activeQuestion.difficulty === 'Medium' ? '#FEF3C7' : '#FEE2E2',
                    color: activeQuestion.difficulty === 'Easy' ? '#166534' : activeQuestion.difficulty === 'Medium' ? '#92400E' : '#991B1B',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '6px'
                  }}>
                    {activeQuestion.difficulty}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ fontSize: '0.76rem', color: '#6A6054', fontWeight: 600 }}>
                    Mark: +1.0 &nbsp;|&nbsp; Negative: 0.0
                  </span>
                </div>
              </div>

              {/* Question Statement */}
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #F5EFE3',
                fontSize: '1.02rem',
                lineHeight: 1.65,
                fontWeight: 600,
                color: '#1C1814',
                whiteSpace: 'pre-line'
              }}>
                {activeQuestion.question}
              </div>

              {/* Options List */}
              <div style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                flex: 1
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#8A5A1B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Select one correct option:
                </div>

                {activeQuestion.options.map((optText, optIdx) => {
                  const isSelected = userAnswers[activeQuestion.id] === optIdx;
                  const optionLetters = ['A', 'B', 'C', 'D'];

                  return (
                    <label
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        padding: '0.9rem 1.15rem',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #781416' : '1.5px solid #EDE5D6',
                        backgroundColor: isSelected ? '#FAF0EE' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 2px 8px rgba(120, 20, 22, 0.08)' : 'none'
                      }}
                    >
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#781416' : '#FAF7F2',
                        color: isSelected ? '#FFFFFF' : '#554C42',
                        border: isSelected ? 'none' : '1.5px solid #D4C8B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.82rem',
                        fontWeight: 900,
                        flexShrink: 0
                      }}>
                        {optionLetters[optIdx]}
                      </div>

                      <span style={{
                        fontSize: '0.92rem',
                        fontWeight: isSelected ? 700 : 500,
                        color: isSelected ? '#781416' : '#2C2620',
                        flex: 1
                      }}>
                        {optText}
                      </span>

                      {isSelected && (
                        <Check size={18} color="#781416" strokeWidth={3} />
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Bottom Action Bar */}
              <div style={{
                padding: '1rem 1.5rem',
                borderTop: '1.5px solid #EDE5D6',
                backgroundColor: '#FFFDF9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {/* Mark for Review */}
                  <button
                    onClick={handleToggleMarkReview}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.55rem 0.95rem',
                      borderRadius: '8px',
                      border: markedReview[activeQuestion.id] ? '1.5px solid #D97706' : '1.5px solid #EDE5D6',
                      backgroundColor: markedReview[activeQuestion.id] ? '#FEF3C7' : '#FFFFFF',
                      color: markedReview[activeQuestion.id] ? '#92400E' : '#554C42',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Bookmark size={15} fill={markedReview[activeQuestion.id] ? '#D97706' : 'none'} />
                    <span>{markedReview[activeQuestion.id] ? 'Marked for Review' : 'Mark for Review'}</span>
                  </button>

                  {/* Clear Response */}
                  {userAnswers[activeQuestion.id] !== undefined && (
                    <button
                      onClick={handleClearResponse}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.55rem 0.85rem',
                        borderRadius: '8px',
                        border: '1.5px solid #EDE5D6',
                        backgroundColor: '#FFFFFF',
                        color: '#6A6054',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <RotateCcw size={14} />
                      <span>Clear Response</span>
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {/* Previous */}
                  <button
                    onClick={handlePrevious}
                    disabled={currentIdx === 0}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.55rem 1.05rem',
                      borderRadius: '8px',
                      border: '1.5px solid #EDE5D6',
                      backgroundColor: '#FFFFFF',
                      color: currentIdx === 0 ? '#A8A29E' : '#2C2620',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: currentIdx === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>

                  {/* Save & Next */}
                  {currentIdx < totalCount - 1 ? (
                    <button
                      onClick={handleNext}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.55rem 1.35rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#781416',
                        color: '#FFFFFF',
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(120, 20, 22, 0.25)'
                      }}
                    >
                      <span>Save & Next</span>
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsSubmitModalOpen(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.55rem 1.35rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#059669',
                        color: '#FFFFFF',
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.28)'
                      }}
                    >
                      <span>Submit Aptitude Section ✓</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#6A6054' }}>
              Loading assessment questions...
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          SUBMISSION CONFIRMATION MODAL
          ========================================================================= */}
      {isSubmitModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(20, 16, 12, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1.5px solid #EDE5D6',
            width: '100%',
            maxWidth: '520px',
            padding: '1.75rem',
            boxShadow: '0 16px 36px rgba(0,0,0,0.22)',
            animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#FAF0EE',
                color: '#781416',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1C1814' }}>
                  Submit Aptitude Round?
                </h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#6A6054' }}>
                  Once submitted, your answers will be evaluated and Coding Round will unlock.
                </p>
              </div>
            </div>

            {/* Test Summary Box */}
            <div style={{
              backgroundColor: '#FAF7F2',
              borderRadius: '10px',
              border: '1px solid #EDE5D6',
              padding: '1rem',
              marginBottom: '1.25rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.65rem',
              textAlign: 'center'
            }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '0.65rem', borderRadius: '8px', border: '1px solid #EDE5D6' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669' }}>{answeredCount}</div>
                <div style={{ fontSize: '0.72rem', color: '#065F46', fontWeight: 700 }}>Answered</div>
              </div>
              <div style={{ backgroundColor: '#FFFFFF', padding: '0.65rem', borderRadius: '8px', border: '1px solid #EDE5D6' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#D97706' }}>{reviewCount}</div>
                <div style={{ fontSize: '0.72rem', color: '#92400E', fontWeight: 700 }}>Marked Review</div>
              </div>
              <div style={{ backgroundColor: '#FFFFFF', padding: '0.65rem', borderRadius: '8px', border: '1px solid #EDE5D6' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#DC2626' }}>{unattemptedCount}</div>
                <div style={{ fontSize: '0.72rem', color: '#991B1B', fontWeight: 700 }}>Unanswered</div>
              </div>
            </div>

            {unattemptedCount > 0 && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#991B1B',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
                fontSize: '0.8rem',
                marginBottom: '1.25rem'
              }}>
                ⚠️ You have <strong>{unattemptedCount} unanswered questions</strong>. You can still return to complete them before submitting.
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                style={{
                  padding: '0.6rem 1.15rem',
                  borderRadius: '8px',
                  border: '1.5px solid #EDE5D6',
                  backgroundColor: '#FFFFFF',
                  color: '#2C2620',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Return to Test
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={executeSubmission}
                style={{
                  padding: '0.6rem 1.35rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(120, 20, 22, 0.3)'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Yes, Submit & Unlock Coding →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: toastMessage.type === 'success' ? '#065F46' : toastMessage.type === 'warning' ? '#92400E' : '#1C1814',
          color: '#FFFFFF',
          padding: '0.8rem 1.25rem',
          borderRadius: '10px',
          fontSize: '0.88rem',
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {toastMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
