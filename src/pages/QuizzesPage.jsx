import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  ChevronDown, 
  Check, 
  ArrowRight,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Layers,
  Cpu,
  Radio,
  Wrench,
  Building2,
  Code,
  Zap,
  Award,
  HelpCircle,
  Clock,
  RotateCcw,
  BarChart2,
  TrendingUp,
  Bookmark,
  Share2,
  Filter,
  Eye,
  CheckCheck,
  ChevronRight,
  ExternalLink,
  Target
} from 'lucide-react';
import { INITIAL_QUIZZES, getFilteredQuizzes } from '../data/quizQuestionBank';
import { COURSES } from '../data/coursesCatalog';
import { trackQuizCompleted } from '../utils/progressTracker';
import { API_URL } from '../config/api';

export default function QuizzesPage({ onNavigate, onOpenAI }) {
  // Navigation & Filtering States
  const [selectedCourse, setSelectedCourse] = useState('B.Tech');
  const [selectedBranch, setSelectedBranch] = useState('CSE');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCatalogTab, setActiveCatalogTab] = useState('quizzes'); // 'quizzes' | 'history'

  // Quiz Engine Lifecycle States: 'catalog' | 'start-brief' | 'exam' | 'result'
  const [quizMode, setQuizMode] = useState('catalog');
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: optionIndex }
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all'); // 'all' | 'incorrect' | 'skipped'
  const [savedAttempts, setSavedAttempts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pv_quiz_attempts') || '[]');
    } catch {
      return [];
    }
  });

  // Dynamic available branches for current course
  const currentCourseObj = useMemo(() => {
    return COURSES.find(c => {
      const cName = (c.name || c.id || '').toLowerCase().replace(/[\.\s]/g, '');
      const sel = selectedCourse.toLowerCase().replace(/[\.\s]/g, '');
      return cName === sel;
    }) || COURSES[0];
  }, [selectedCourse]);

  const availableBranches = useMemo(() => {
    if (currentCourseObj && currentCourseObj.branches && currentCourseObj.branches.length > 0) {
      return [{ id: 'All', name: 'All Branches', short: 'All' }, ...currentCourseObj.branches];
    }
    return [{ id: 'All', name: 'All Branches', short: 'All' }];
  }, [currentCourseObj]);

  // Quizzes list derived from authoritative dataset & local state
  const displayedQuizzes = useMemo(() => {
    return getFilteredQuizzes({
      course: selectedCourse,
      branch: selectedBranch,
      year: selectedYear,
      semester: selectedSemester,
      category: selectedCategory,
      difficulty: selectedDifficulty,
      searchQuery
    });
  }, [selectedCourse, selectedBranch, selectedYear, selectedSemester, selectedCategory, selectedDifficulty, searchQuery]);

  // Exam Countdown Timer
  useEffect(() => {
    let interval = null;
    if (quizMode === 'exam' && timerRunning && timeRemainingSeconds > 0) {
      interval = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizMode, timerRunning, timeRemainingSeconds]);

  // Start Briefing Screen
  const handleOpenQuizBrief = (quiz) => {
    setActiveQuiz(quiz);
    setQuizMode('start-brief');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start the Exam
  const handleStartExam = () => {
    if (!activeQuiz) return;
    const durationSec = (activeQuiz.durationMinutes || 15) * 60;
    setTimeRemainingSeconds(durationSec);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setMarkedForReview(new Set());
    setQuizStartTime(Date.now());
    setTimerRunning(true);
    setQuizMode('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Option Selection
  const handleSelectOption = (questionId, optionIdx) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  // Clear Option
  const handleClearAnswer = (questionId) => {
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  // Toggle Mark for Review
  const handleToggleReview = (questionId) => {
    setMarkedForReview(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  // Calculate & Submit Quiz
  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setTimerRunning(false);
    setShowSubmitConfirm(false);

    const questions = activeQuiz.questions || [];
    const totalQuestions = questions.length;
    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    const marksPerQ = Number(activeQuiz.marksPerQuestion) || 1;
    const negMarks = Number(activeQuiz.negativeMarks) || 0;
    const unitStats = {};

    const reviewItems = questions.map((q, idx) => {
      const studentAns = userAnswers[q.id];
      const isAnswered = studentAns !== undefined && studentAns !== null && studentAns !== '';
      const isCorrect = isAnswered && Number(studentAns) === Number(q.correctAnswer);

      let marksEarned = 0;
      if (isAnswered) {
        if (isCorrect) {
          correctCount++;
          marksEarned = marksPerQ;
        } else {
          incorrectCount++;
          marksEarned = -negMarks;
        }
      } else {
        skippedCount++;
        marksEarned = 0;
      }

      const u = q.unit || 'General';
      if (!unitStats[u]) unitStats[u] = { total: 0, correct: 0 };
      unitStats[u].total++;
      if (isCorrect) unitStats[u].correct++;

      return {
        questionId: q.id,
        questionNumber: idx + 1,
        questionText: q.questionText,
        options: q.options,
        studentAnswer: isAnswered ? Number(studentAns) : null,
        correctAnswer: Number(q.correctAnswer),
        isCorrect,
        isSkipped: !isAnswered,
        marksEarned,
        explanation: q.explanation || 'Explanation not available.',
        source: q.source || '',
        importance: q.importance || 'Standard',
        unit: q.unit || ''
      };
    });

    const maxMarks = totalQuestions * marksPerQ;
    const rawScore = (correctCount * marksPerQ) - (incorrectCount * negMarks);
    const finalScore = Math.max(0, rawScore);
    const percentage = maxMarks > 0 ? Number(((finalScore / maxMarks) * 100).toFixed(2)) : 0;
    const attemptedCount = correctCount + incorrectCount;
    const accuracy = attemptedCount > 0 ? Number(((correctCount / attemptedCount) * 100).toFixed(2)) : 0;
    const elapsedSeconds = quizStartTime ? Math.round((Date.now() - quizStartTime) / 1000) : 0;

    const unitPerformance = Object.keys(unitStats).map(unitName => {
      const u = unitStats[unitName];
      return {
        unit: unitName,
        total: u.total,
        correct: u.correct,
        accuracy: u.total > 0 ? Math.round((u.correct / u.total) * 100) : 0
      };
    });

    const resultPayload = {
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      subject: activeQuiz.subject,
      course: activeQuiz.course,
      totalQuestions,
      score: finalScore,
      maxMarks,
      correct: correctCount,
      incorrect: incorrectCount,
      skipped: skippedCount,
      accuracy,
      percentage,
      timeTakenSeconds: elapsedSeconds,
      unitPerformance,
      review: reviewItems,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    setQuizResult(resultPayload);
    setQuizMode('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Save to local attempts list
    setSavedAttempts(prev => {
      const updated = [resultPayload, ...prev.slice(0, 49)];
      localStorage.setItem('pv_quiz_attempts', JSON.stringify(updated));
      return updated;
    });

    // Send to server backend & progress tracking
    try {
      trackQuizCompleted({
        quizId: activeQuiz.id,
        quizName: activeQuiz.title,
        subject: activeQuiz.subject,
        course: activeQuiz.course,
        score: finalScore,
        totalMarks: maxMarks,
        correct: correctCount,
        incorrect: incorrectCount,
        skipped: skippedCount,
        durationSeconds: elapsedSeconds,
        startedAt: quizStartTime
      });

      // Submit to backend API endpoint
      fetch(`${API_URL}/api/quizzes/${activeQuiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: userAnswers,
          timeTakenSeconds: elapsedSeconds
        })
      }).catch(() => {});
    } catch (e) {
      console.warn('Progress sync warning:', e);
    }
  };

  const handleAutoSubmit = () => {
    alert('Time has expired! Submitting your answers automatically.');
    handleSubmitQuiz();
  };

  // Format time MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --------------------------------------------------------------------------
  // VIEW: PRE-EXAM BRIEFING MODAL
  // --------------------------------------------------------------------------
  if (quizMode === 'start-brief' && activeQuiz) {
    return (
      <div style={{ backgroundColor: '#FAF7F2', minHeight: '90vh', padding: '3rem 1rem' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          
          <button
            onClick={() => setQuizMode('catalog')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E2D9C8',
              borderRadius: '9999px',
              padding: '0.45rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#1C1E21',
              cursor: 'pointer',
              marginBottom: '1.5rem'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Quiz Catalog</span>
          </button>

          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E8E2D5',
            borderRadius: '24px',
            padding: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            boxShadow: '0 12px 36px rgba(35,30,25,0.06)'
          }}>
            {/* Header Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{
                backgroundColor: '#FFFBEB',
                color: '#C88D2D',
                border: '1px solid #FDE68A',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.74rem',
                fontWeight: 800,
                textTransform: 'uppercase'
              }}>
                {activeQuiz.category}
              </span>
              <span style={{
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                border: '1px solid #BFDBFE',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.74rem',
                fontWeight: 700
              }}>
                {activeQuiz.course} • {activeQuiz.subjectCode || activeQuiz.subject}
              </span>
              <span style={{
                backgroundColor: activeQuiz.difficulty === 'Easy' ? '#ECFDF5' : activeQuiz.difficulty === 'Hard' ? '#FEF2F2' : '#FFF7ED',
                color: activeQuiz.difficulty === 'Easy' ? '#059669' : activeQuiz.difficulty === 'Hard' ? '#DC2626' : '#D97706',
                border: '1px solid',
                borderColor: activeQuiz.difficulty === 'Easy' ? '#A7F3D0' : activeQuiz.difficulty === 'Hard' ? '#FECACA' : '#FED7AA',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.74rem',
                fontWeight: 700
              }}>
                {activeQuiz.difficulty} Difficulty
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)',
              fontWeight: 900,
              color: '#1C1E21',
              fontFamily: "'Outfit', sans-serif",
              lineHeight: 1.25,
              margin: '0 0 0.85rem 0'
            }}>
              {activeQuiz.title}
            </h1>

            <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6, margin: '0 0 1.75rem 0' }}>
              {activeQuiz.description}
            </p>

            {/* Importance Citation */}
            {activeQuiz.importanceReason && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1.5px solid #FECACA',
                borderRadius: '16px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                marginBottom: '2rem'
              }}>
                <Sparkles size={20} style={{ color: '#DC2626', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#991B1B' }}>
                    Evidence-Based Importance:
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#B91C1C', marginTop: '0.15rem' }}>
                    {activeQuiz.importanceReason}
                  </div>
                </div>
              </div>
            )}

            {/* Key Quiz Parameters Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ marginBottom: '2rem' }}>
              <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '16px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Questions</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#1C1E21', marginTop: '0.2rem' }}>
                  {activeQuiz.questions?.length || 0}
                </div>
              </div>
              <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '16px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Duration</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#1C1E21', marginTop: '0.2rem' }}>
                  {activeQuiz.durationMinutes}m
                </div>
              </div>
              <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '16px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Total Marks</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#1C1E21', marginTop: '0.2rem' }}>
                  {(activeQuiz.questions?.length || 0) * (activeQuiz.marksPerQuestion || 1)}
                </div>
              </div>
              <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '16px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Negative Marking</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#1C1E21', marginTop: '0.2rem' }}>
                  {activeQuiz.negativeMarks ? `-${activeQuiz.negativeMarks}` : 'None'}
                </div>
              </div>
            </div>

            {/* Test Instructions */}
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#1C1E21', marginBottom: '0.75rem' }}>
                Standard Exam Instructions:
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.84rem', color: '#475569', lineHeight: 1.7 }}>
                <li>This is an official ProfessorVirus university academic quiz. All questions are authored from syllabus & university PYQ archives.</li>
                <li>The countdown timer starts as soon as you press <strong>Begin Quiz Now</strong>.</li>
                <li>You can jump between questions anytime using the interactive question palette.</li>
                <li>Use <strong>Mark for Review</strong> to flag challenging questions and return to them before final submission.</li>
                <li>When the timer reaches 00:00, your answers will be automatically submitted and scored.</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleStartExam}
                style={{
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.85rem 2.25rem',
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 6px 20px rgba(120, 20, 22, 0.25)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9F1239'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#781416'}
              >
                <span>Begin Quiz Now</span>
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={() => setQuizMode('catalog')}
                style={{
                  backgroundColor: '#FAF7F2',
                  color: '#475569',
                  border: '1.5px solid #E2D9C8',
                  borderRadius: '9999px',
                  padding: '0.85rem 1.6rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW: FULL INTERACTIVE EXAM ENGINE
  // --------------------------------------------------------------------------
  if (quizMode === 'exam' && activeQuiz) {
    const questions = activeQuiz.questions || [];
    const currentQ = questions[currentQuestionIndex];
    const totalQ = questions.length;
    const currentAnswer = userAnswers[currentQ?.id];
    const isMarked = markedForReview.has(currentQ?.id);

    const answeredCount = Object.keys(userAnswers).length;
    const reviewCount = markedForReview.size;
    const unansweredCount = totalQ - answeredCount;
    const isUrgentTimer = timeRemainingSeconds < 120; // less than 2 minutes

    return (
      <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* EXAM TOP BAR */}
        <header style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1.5px solid #E8E2D5',
          padding: '0.85rem clamp(1rem, 3vw, 2.5rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 2px 10px rgba(35,30,25,0.03)'
        }}>
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#781416', textTransform: 'uppercase' }}>
              {activeQuiz.course} • {activeQuiz.subject}
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: '#1C1E21',
              fontFamily: "'Outfit', sans-serif",
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '360px'
            }}>
              {activeQuiz.title}
            </div>
          </div>

          {/* Right Actions: Timer & Submit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            
            {/* Timer Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: isUrgentTimer ? '#FEF2F2' : '#FFFBEB',
              border: `1.5px solid ${isUrgentTimer ? '#FECACA' : '#FDE68A'}`,
              color: isUrgentTimer ? '#DC2626' : '#92400E',
              padding: '0.45rem 0.95rem',
              borderRadius: '9999px',
              fontSize: '0.94rem',
              fontWeight: 800,
              fontFamily: 'monospace',
              letterSpacing: '0.04em'
            }}>
              <Clock size={16} />
              <span>{formatTime(timeRemainingSeconds)}</span>
            </div>

            {/* Mobile Palette Toggle */}
            <button
              type="button"
              className="md:hidden"
              onClick={() => setMobilePaletteOpen(prev => !prev)}
              style={{
                backgroundColor: '#FAF7F2',
                border: '1.5px solid #E2D9C8',
                borderRadius: '9999px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#1C1E21'
              }}
            >
              Palette ({answeredCount}/{totalQ})
            </button>

            {/* Submit Button */}
            <button
              type="button"
              onClick={() => setShowSubmitConfirm(true)}
              style={{
                backgroundColor: '#781416',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.45rem 1.25rem',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(120, 20, 22, 0.2)'
              }}
            >
              Submit Quiz
            </button>
          </div>
        </header>

        {/* MAIN EXAM BODY */}
        <div style={{ flex: 1, display: 'flex', maxWidth: '1360px', width: '100%', margin: '0 auto', padding: '1.5rem clamp(1rem, 2.5vw, 2rem)', gap: '1.75rem' }}>
          
          {/* LEFT: CURRENT QUESTION CARD */}
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '24px',
              padding: 'clamp(1.5rem, 3vw, 2.25rem)',
              boxShadow: '0 4px 20px rgba(35,30,25,0.04)',
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              
              {/* Question Header Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                borderBottom: '1px solid #F1ECE1',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: '#1C1E21',
                    fontFamily: "'Outfit', sans-serif"
                  }}>
                    Question {currentQuestionIndex + 1} of {totalQ}
                  </span>
                  {currentQ?.unit && (
                    <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                      • {currentQ.unit}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  {currentQ?.importance === 'Most Important' && (
                    <span style={{
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      border: '1px solid #FECACA',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      <Sparkles size={12} />
                      <span>Most Important</span>
                    </span>
                  )}
                  <span style={{
                    backgroundColor: '#FAF7F2',
                    border: '1px solid #E2D9C8',
                    color: '#475569',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '9999px'
                  }}>
                    +1 Mark
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
                fontWeight: 700,
                color: '#1C1E21',
                lineHeight: 1.6,
                marginBottom: '2rem',
                whiteSpace: 'pre-line'
              }}>
                {currentQ?.questionText}
              </div>

              {/* 4 Multiple Choice Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem', flex: 1 }}>
                {(currentQ?.options || []).map((opt, optIdx) => {
                  const isSelected = currentAnswer === optIdx;
                  const optionLetters = ['A', 'B', 'C', 'D'];
                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.95rem',
                        backgroundColor: isSelected ? '#FFFBEB' : '#FFFFFF',
                        border: isSelected ? '2px solid #C88D2D' : '1.5px solid #E8E2D5',
                        borderRadius: '16px',
                        padding: '1rem 1.25rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 4px 14px rgba(200, 141, 45, 0.12)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#C88D2D';
                          e.currentTarget.style.backgroundColor = '#FAF7F2';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#E8E2D5';
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                        }
                      }}
                    >
                      {/* Option Letter Circle */}
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#C88D2D' : '#FAF7F2',
                        color: isSelected ? '#FFFFFF' : '#475569',
                        border: `1.5px solid ${isSelected ? '#C88D2D' : '#E2D9C8'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        flexShrink: 0
                      }}>
                        {optionLetters[optIdx] || optIdx + 1}
                      </div>

                      {/* Option Content Text */}
                      <div style={{
                        fontSize: '0.94rem',
                        fontWeight: isSelected ? 700 : 500,
                        color: '#1C1E21',
                        lineHeight: 1.45
                      }}>
                        {opt}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Question Navigation Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '1.25rem',
                borderTop: '1px solid #F1ECE1',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleReview(currentQ.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      backgroundColor: isMarked ? '#EDE9FE' : '#FFFFFF',
                      border: `1.5px solid ${isMarked ? '#8B5CF6' : '#E2D9C8'}`,
                      color: isMarked ? '#6D28D9' : '#475569',
                      borderRadius: '9999px',
                      padding: '0.55rem 1rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Bookmark size={15} />
                    <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
                  </button>

                  {currentAnswer !== undefined && (
                    <button
                      type="button"
                      onClick={() => handleClearAnswer(currentQ.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#64748B',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '0.55rem 0.5rem'
                      }}
                    >
                      Clear Response
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #E2D9C8',
                      color: currentQuestionIndex === 0 ? '#94A3B8' : '#1C1E21',
                      borderRadius: '9999px',
                      padding: '0.55rem 1.15rem',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <ArrowLeft size={15} />
                    <span>Previous</span>
                  </button>

                  {currentQuestionIndex < totalQ - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        backgroundColor: '#781416',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '0.55rem 1.35rem',
                        fontSize: '0.86rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(120, 20, 22, 0.2)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9F1239'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#781416'}
                    >
                      <span>Save & Next</span>
                      <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowSubmitConfirm(true)}
                      style={{
                        backgroundColor: '#059669',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '0.55rem 1.35rem',
                        fontSize: '0.86rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
                      }}
                    >
                      Submit Exam
                    </button>
                  )}
                </div>

              </div>

            </div>
          </main>

          {/* RIGHT: QUESTION PALETTE (Desktop + Mobile Drawer) */}
          <aside 
            className={`md:block ${mobilePaletteOpen ? 'fixed inset-0 z-50 p-4 bg-black/40 flex items-center justify-center' : 'hidden'}`}
            style={{ width: mobilePaletteOpen ? 'auto' : '320px', flexShrink: 0 }}
          >
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '24px',
              padding: '1.5rem',
              boxShadow: '0 4px 20px rgba(35,30,25,0.04)',
              width: mobilePaletteOpen ? '90vw' : '100%',
              maxWidth: '380px'
            }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#1C1E21', fontFamily: "'Outfit', sans-serif" }}>
                  Question Palette
                </div>
                {mobilePaletteOpen && (
                  <button onClick={() => setMobilePaletteOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 800 }}>
                    ✕ Close
                  </button>
                )}
              </div>

              {/* Status Legend */}
              <div className="grid grid-cols-2 gap-2 text-xs" style={{ marginBottom: '1.25rem', color: '#64748B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#059669' }} />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#E2D9C8' }} />
                  <span>Unanswered ({unansweredCount})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#8B5CF6' }} />
                  <span>Review ({reviewCount})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #C88D2D' }} />
                  <span>Current</span>
                </div>
              </div>

              {/* Number Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '0.5rem',
                maxHeight: '320px',
                overflowY: 'auto',
                padding: '0.25rem',
                marginBottom: '1.5rem'
              }}>
                {questions.map((q, qIndex) => {
                  const hasAnswer = userAnswers[q.id] !== undefined;
                  const isRev = markedForReview.has(q.id);
                  const isCurrent = currentQuestionIndex === qIndex;

                  let bg = '#FAF7F2';
                  let text = '#475569';
                  let border = '1px solid #E2D9C8';

                  if (hasAnswer) {
                    bg = '#ECFDF5';
                    text = '#059669';
                    border = '1.5px solid #059669';
                  }
                  if (isRev) {
                    bg = '#EDE9FE';
                    text = '#7C3AED';
                    border = '1.5px solid #8B5CF6';
                  }
                  if (isCurrent) {
                    border = '2px solid #C88D2D';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        setCurrentQuestionIndex(qIndex);
                        setMobilePaletteOpen(false);
                      }}
                      style={{
                        height: '40px',
                        borderRadius: '12px',
                        backgroundColor: bg,
                        color: text,
                        border,
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.1s ease'
                      }}
                    >
                      {qIndex + 1}
                    </button>
                  );
                })}
              </div>

              {/* Palette Submit CTA */}
              <button
                type="button"
                onClick={() => {
                  setMobilePaletteOpen(false);
                  setShowSubmitConfirm(true);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(120, 20, 22, 0.2)'
                }}
              >
                Submit Test
              </button>

            </div>
          </aside>

        </div>

        {/* SUBMIT CONFIRMATION MODAL */}
        {showSubmitConfirm && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '2rem',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 48px rgba(0,0,0,0.2)',
              border: '1.5px solid #E8E2D5',
              textAlign: 'center'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: '#FEF2F2',
                color: '#781416',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <AlertCircle size={28} />
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.5rem 0' }}>
                Submit Your Quiz?
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
                Please review your progress before final submission:
              </p>

              <div style={{
                backgroundColor: '#FAF7F2',
                borderRadius: '16px',
                padding: '1rem',
                border: '1px solid #E8E2D5',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                marginBottom: '1.75rem',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>Answered</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#059669' }}>{answeredCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#DC2626', fontWeight: 700 }}>Unanswered</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#DC2626' }}>{unansweredCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#7C3AED', fontWeight: 700 }}>Review</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#7C3AED' }}>{reviewCount}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirm(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '12px',
                    backgroundColor: '#FAF7F2',
                    border: '1.5px solid #E2D9C8',
                    color: '#475569',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Resume Quiz
                </button>
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '12px',
                    backgroundColor: '#781416',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(120, 20, 22, 0.25)'
                  }}
                >
                  Confirm Submit
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW: DETAILED RESULT & QUESTION-WISE REVIEW
  // --------------------------------------------------------------------------
  if (quizMode === 'result' && quizResult) {
    const isPassing = quizResult.percentage >= 40;

    const filteredReview = (quizResult.review || []).filter(item => {
      if (reviewFilter === 'incorrect') return !item.isCorrect && !item.isSkipped;
      if (reviewFilter === 'skipped') return item.isSkipped;
      return true;
    });

    return (
      <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '2.5rem 1rem 5rem 1rem' }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          
          {/* Top Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button
              onClick={() => {
                setQuizMode('catalog');
                setQuizResult(null);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E2D9C8',
                borderRadius: '9999px',
                padding: '0.5rem 1.15rem',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#1C1E21',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Quiz Catalog</span>
            </button>

            <button
              type="button"
              onClick={handleStartExam}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#781416',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.5rem 1.25rem',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(120, 20, 22, 0.2)'
              }}
            >
              <RotateCcw size={15} />
              <span>Retry Quiz</span>
            </button>
          </div>

          {/* SCORE CARD BANNER */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E8E2D5',
            borderRadius: '28px',
            padding: 'clamp(2rem, 4vw, 3rem)',
            boxShadow: '0 12px 36px rgba(35,30,25,0.06)',
            marginBottom: '2.5rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: isPassing ? '#ECFDF5' : '#FEF2F2',
              color: isPassing ? '#059669' : '#DC2626',
              border: `1px solid ${isPassing ? '#A7F3D0' : '#FECACA'}`,
              borderRadius: '9999px',
              padding: '0.35rem 1rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}>
              <Award size={14} />
              <span>{isPassing ? 'Quiz Successfully Completed' : 'Needs Practice'}</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.35rem)',
              fontWeight: 900,
              color: '#1C1E21',
              fontFamily: "'Outfit', sans-serif",
              margin: '0 0 0.5rem 0'
            }}>
              {quizResult.quizTitle}
            </h1>
            <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600, marginBottom: '2rem' }}>
              {quizResult.course} • {quizResult.subject} • Completed on {quizResult.date}
            </div>

            {/* Big Score Dial */}
            <div style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              backgroundColor: '#FAF7F2',
              border: `4px solid ${isPassing ? '#10B981' : '#F59E0B'}`,
              margin: '0 auto 2rem auto',
              boxShadow: '0 6px 20px rgba(35,30,25,0.06)'
            }}>
              <div style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                color: '#1C1E21',
                lineHeight: 1,
                fontFamily: "'Outfit', sans-serif"
              }}>
                {quizResult.score}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginTop: '0.25rem' }}>
                out of {quizResult.maxMarks} Marks
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4" style={{ marginBottom: '2rem' }}>
              <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '18px', padding: '1rem' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Percentage</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#1C1E21', marginTop: '0.15rem' }}>
                  {quizResult.percentage}%
                </div>
              </div>
              <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '18px', padding: '1rem' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Accuracy</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#059669', marginTop: '0.15rem' }}>
                  {quizResult.accuracy}%
                </div>
              </div>
              <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '18px', padding: '1rem' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Time Taken</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#2563EB', marginTop: '0.15rem' }}>
                  {formatTime(quizResult.timeTakenSeconds)}
                </div>
              </div>
              <div style={{ backgroundColor: '#FAF7F2', border: '1px solid #E8E2D5', borderRadius: '18px', padding: '1rem' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Avg / Question</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#7C3AED', marginTop: '0.15rem' }}>
                  {quizResult.totalQuestions > 0 ? Math.round(quizResult.timeTakenSeconds / quizResult.totalQuestions) : 0}s
                </div>
              </div>
            </div>

            {/* Answer Breakdown Strip */}
            <div style={{
              backgroundColor: '#FAF7F2',
              border: '1px solid #E8E2D5',
              borderRadius: '16px',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.86rem', fontWeight: 700, color: '#059669' }}>
                <CheckCircle2 size={16} />
                <span>Correct: {quizResult.correct}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.86rem', fontWeight: 700, color: '#DC2626' }}>
                <XCircle size={16} />
                <span>Incorrect: {quizResult.incorrect}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.86rem', fontWeight: 700, color: '#64748B' }}>
                <HelpCircle size={16} />
                <span>Skipped: {quizResult.skipped}</span>
              </div>
            </div>

          </div>

          {/* QUESTION-WISE REVIEW SECTION */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1C1E21', fontFamily: "'Outfit', sans-serif", margin: '0 0 0.25rem 0' }}>
                  Question-by-Question Review
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Verified solutions, official answer keys, and academic rationale
                </div>
              </div>

              {/* Review Filter Pills */}
              <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: '#FFFFFF', padding: '0.25rem', borderRadius: '9999px', border: '1px solid #E2D9C8' }}>
                <button
                  type="button"
                  onClick={() => setReviewFilter('all')}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: reviewFilter === 'all' ? '#781416' : 'transparent',
                    color: reviewFilter === 'all' ? '#FFFFFF' : '#475569'
                  }}
                >
                  All ({quizResult.review?.length})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter('incorrect')}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: reviewFilter === 'incorrect' ? '#DC2626' : 'transparent',
                    color: reviewFilter === 'incorrect' ? '#FFFFFF' : '#475569'
                  }}
                >
                  Incorrect ({quizResult.incorrect})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter('skipped')}
                  style={{
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: reviewFilter === 'skipped' ? '#64748B' : 'transparent',
                    color: reviewFilter === 'skipped' ? '#FFFFFF' : '#475569'
                  }}
                >
                  Skipped ({quizResult.skipped})
                </button>
              </div>
            </div>

            {/* List of Review Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {filteredReview.map((item, rIdx) => {
                const optLetters = ['A', 'B', 'C', 'D'];
                return (
                  <div
                    key={item.questionId}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #E8E2D5',
                      borderRadius: '20px',
                      padding: '1.5rem clamp(1.25rem, 3vw, 1.75rem)',
                      boxShadow: '0 4px 14px rgba(35,30,25,0.03)'
                    }}
                  >
                    {/* Item Top Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1C1E21', fontFamily: "'Outfit', sans-serif" }}>
                          Question {item.questionNumber}
                        </span>
                        {item.unit && (
                          <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                            • {item.unit}
                          </span>
                        )}
                      </div>

                      {/* Result Pill */}
                      {item.isCorrect ? (
                        <span style={{
                          backgroundColor: '#ECFDF5',
                          color: '#059669',
                          border: '1px solid #A7F3D0',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <CheckCircle2 size={13} />
                          <span>Correct (+1)</span>
                        </span>
                      ) : item.isSkipped ? (
                        <span style={{
                          backgroundColor: '#F1F5F9',
                          color: '#64748B',
                          border: '1px solid #CBD5E1',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.74rem',
                          fontWeight: 700
                        }}>
                          Skipped (0)
                        </span>
                      ) : (
                        <span style={{
                          backgroundColor: '#FEF2F2',
                          color: '#DC2626',
                          border: '1px solid #FECACA',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <XCircle size={13} />
                          <span>Incorrect ({item.marksEarned})</span>
                        </span>
                      )}
                    </div>

                    {/* Question Text */}
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1C1E21', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                      {item.questionText}
                    </div>

                    {/* Options Review */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                      {(item.options || []).map((opt, oIdx) => {
                        const isCorrectOption = oIdx === item.correctAnswer;
                        const isStudentChoice = oIdx === item.studentAnswer;

                        let optBg = '#FAF7F2';
                        let optBorder = '1px solid #E8E2D5';
                        let optText = '#475569';

                        if (isCorrectOption) {
                          optBg = '#ECFDF5';
                          optBorder = '1.5px solid #10B981';
                          optText = '#065F46';
                        } else if (isStudentChoice && !item.isCorrect) {
                          optBg = '#FEF2F2';
                          optBorder = '1.5px solid #EF4444';
                          optText = '#991B1B';
                        }

                        return (
                          <div
                            key={oIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              backgroundColor: optBg,
                              border: optBorder,
                              borderRadius: '12px',
                              padding: '0.65rem 0.95rem',
                              fontSize: '0.88rem'
                            }}
                          >
                            <span style={{ fontWeight: 800, minWidth: '22px' }}>
                              {optLetters[oIdx]}.
                            </span>
                            <span style={{ flex: 1, fontWeight: (isCorrectOption || isStudentChoice) ? 700 : 500, color: optText }}>
                              {opt}
                            </span>
                            {isCorrectOption && (
                              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', backgroundColor: '#D1FAE5', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                                Correct Answer
                              </span>
                            )}
                            {isStudentChoice && !isCorrectOption && (
                              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#DC2626', backgroundColor: '#FEE2E2', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                                Your Answer
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    <div style={{
                      backgroundColor: '#FAF7F2',
                      border: '1px solid #E8E2D5',
                      borderRadius: '12px',
                      padding: '0.85rem 1rem',
                      fontSize: '0.84rem',
                      color: '#475569',
                      lineHeight: 1.55
                    }}>
                      <div style={{ fontWeight: 800, color: '#1C1E21', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>💡</span>
                        <span>Verified Explanation:</span>
                      </div>
                      <div>{item.explanation}</div>
                      {item.source && (
                        <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '0.45rem', fontStyle: 'italic' }}>
                          Source: {item.source}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW: MAIN QUIZ CATALOG & SELECTION SCREEN
  // --------------------------------------------------------------------------
  const coursePills = [
    { id: 'B.Tech', label: 'B.Tech' },
    { id: 'BCA', label: 'BCA' },
    { id: 'BBA', label: 'BBA' },
    { id: 'BPharm', label: 'B.Pharm' },
    { id: 'MBA', label: 'MBA' },
    { id: 'MCA', label: 'MCA' },
    { id: 'MTech', label: 'M.Tech' }
  ];

  const categoriesList = [
    'All',
    'Most Important',
    'PYQ Based',
    'Unit Wise',
    'Practice',
    'Mock Test'
  ];

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', padding: '2.5rem 0 5rem 0', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="container" style={{ maxWidth: '1240px' }}>
        
        {/* HEADER SECTION */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '9999px',
            padding: '0.35rem 1rem',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#C88D2D',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={14} />
            <span>FIRST-PARTY ACADEMIC QUIZ ENGINE</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 900,
            color: '#1C1E21',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            margin: '0 0 0.85rem 0'
          }}>
            University Quizzes & Practice Tests
          </h1>

          <p style={{
            fontSize: '0.98rem',
            color: '#64748B',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Practice unit-wise questions, official PYQ repetitions, and high-yield examination mock tests directly inside ProfessorVirus. Zero external redirects.
          </p>
        </div>

        {/* TOP NAVIGATION TABS: [All Quizzes] | [My Attempt History] */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E2D9C8',
            borderRadius: '9999px',
            padding: '0.35rem',
            display: 'inline-flex',
            gap: '0.45rem',
            boxShadow: '0 2px 8px rgba(35,30,25,0.04)'
          }}>
            <button
              type="button"
              onClick={() => setActiveCatalogTab('quizzes')}
              style={{
                backgroundColor: activeCatalogTab === 'quizzes' ? '#781416' : 'transparent',
                color: activeCatalogTab === 'quizzes' ? '#FFFFFF' : '#475569',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.55rem 1.45rem',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Browse Quizzes
            </button>
            <button
              type="button"
              onClick={() => setActiveCatalogTab('history')}
              style={{
                backgroundColor: activeCatalogTab === 'history' ? '#781416' : 'transparent',
                color: activeCatalogTab === 'history' ? '#FFFFFF' : '#475569',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.55rem 1.45rem',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              My Quiz Attempts ({savedAttempts.length})
            </button>
          </div>
        </div>

        {activeCatalogTab === 'history' ? (
          /* ATTEMPTS HISTORY TAB */
          <div style={{ maxWidth: '880px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C1E21', fontFamily: "'Outfit', sans-serif", marginBottom: '1.25rem' }}>
              Your Completed Quiz Attempts
            </h2>

            {savedAttempts.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px solid #E8E2D5',
                padding: '3rem 2rem',
                textAlign: 'center'
              }}>
                <Award size={42} style={{ color: '#D97706', margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.5rem 0' }}>
                  No Quiz Attempts Recorded Yet
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '0 0 1.5rem 0' }}>
                  Take your first university quiz to record your scores, view analytics, and track your accuracy.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveCatalogTab('quizzes')}
                  style={{
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '0.65rem 1.5rem',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Browse Available Quizzes
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {savedAttempts.map((att, aidx) => (
                  <div
                    key={aidx}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #E8E2D5',
                      borderRadius: '20px',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      boxShadow: '0 4px 14px rgba(35,30,25,0.03)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.74rem', color: '#781416', fontWeight: 800, textTransform: 'uppercase' }}>
                        {att.course} • {att.subject}
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1C1E21', marginTop: '0.15rem' }}>
                        {att.quizTitle}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                        Attempted on {att.date} • Duration: {formatTime(att.timeTakenSeconds)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1C1E21' }}>
                          {att.score} / {att.maxMarks}
                        </div>
                        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#059669' }}>
                          {att.percentage}% Score ({att.accuracy}% Accuracy)
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setQuizResult(att);
                          setQuizMode('result');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          backgroundColor: '#FAF7F2',
                          border: '1.5px solid #E2D9C8',
                          color: '#1C1E21',
                          borderRadius: '9999px',
                          padding: '0.5rem 1rem',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        View Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* BROWSE QUIZZES TAB */
          <>
            {/* COURSE FILTER PILLS */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                1. Select Academic Program:
              </div>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {coursePills.map(cp => {
                  const isSel = selectedCourse === cp.id;
                  return (
                    <button
                      key={cp.id}
                      type="button"
                      onClick={() => {
                        setSelectedCourse(cp.id);
                        setSelectedBranch('All');
                        setSelectedSemester('All');
                      }}
                      style={{
                        padding: '0.45rem 1.15rem',
                        borderRadius: '9999px',
                        border: isSel ? '1.5px solid #781416' : '1.5px solid #E2D9C8',
                        backgroundColor: isSel ? '#781416' : '#FFFFFF',
                        color: isSel ? '#FFFFFF' : '#1C1E21',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {cp.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BRANCH PILLS (IF APPLICABLE) */}
            {availableBranches.length > 1 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                  2. Select Branch:
                </div>
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {availableBranches.map(br => {
                    const isSel = selectedBranch === br.id;
                    return (
                      <button
                        key={br.id}
                        type="button"
                        onClick={() => setSelectedBranch(br.id)}
                        style={{
                          padding: '0.35rem 0.95rem',
                          borderRadius: '9999px',
                          border: isSel ? '1.5px solid #C88D2D' : '1.5px solid #E8E2D5',
                          backgroundColor: isSel ? '#FFFBEB' : '#FFFFFF',
                          color: isSel ? '#B45309' : '#475569',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {br.short || br.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CATEGORY & SEARCH BAR STRIP */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '20px',
              padding: '1.25rem',
              boxShadow: '0 4px 18px rgba(35,30,25,0.04)',
              marginBottom: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {categoriesList.map(cat => {
                  const isSel = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: '9999px',
                        border: isSel ? '1.5px solid #781416' : '1px solid #E8E2D5',
                        backgroundColor: isSel ? '#781416' : '#FAF7F2',
                        color: isSel ? '#FFFFFF' : '#475569',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FAF7F2',
                border: '1.5px solid #E2D9C8',
                borderRadius: '9999px',
                padding: '0.35rem 0.85rem',
                minWidth: '260px'
              }}>
                <Search size={16} style={{ color: '#94A3B8', marginRight: '0.5rem' }} />
                <input
                  type="text"
                  placeholder="Search subject or quiz title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '0.84rem',
                    color: '#1C1E21',
                    width: '100%'
                  }}
                />
              </div>
            </div>

            {/* QUIZZES GRID OR EMPTY STATE */}
            {displayedQuizzes.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px solid #E8E2D5',
                padding: '4rem 2rem',
                textAlign: 'center',
                boxShadow: '0 4px 18px rgba(35,30,25,0.03)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFBEB',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto'
                }}>
                  <BookOpen size={30} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.5rem 0' }}>
                  No Verified Quizzes Available for This Filter
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', maxWidth: '520px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
                  ProfessorVirus follows strict academic guidelines and does NOT show fake questions. Our team is curating syllabus-aligned question banks for {selectedCourse}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCourse('B.Tech');
                    setSelectedBranch('All');
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  style={{
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '0.65rem 1.5rem',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  View All Available Quizzes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedQuizzes.map(quiz => (
                  <div
                    key={quiz.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #E8E2D5',
                      borderRadius: '24px',
                      padding: '1.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 4px 16px rgba(35,30,25,0.04)',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(35,30,25,0.08)';
                      e.currentTarget.style.borderColor = '#C88D2D';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(35,30,25,0.04)';
                      e.currentTarget.style.borderColor = '#E8E2D5';
                    }}
                  >
                    {/* Top Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                      <span style={{
                        backgroundColor: '#FFFBEB',
                        color: '#C88D2D',
                        border: '1px solid #FDE68A',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase'
                      }}>
                        {quiz.category}
                      </span>

                      <span style={{
                        backgroundColor: quiz.difficulty === 'Easy' ? '#ECFDF5' : quiz.difficulty === 'Hard' ? '#FEF2F2' : '#FFF7ED',
                        color: quiz.difficulty === 'Easy' ? '#059669' : quiz.difficulty === 'Hard' ? '#DC2626' : '#D97706',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '9999px'
                      }}>
                        {quiz.difficulty}
                      </span>
                    </div>

                    {/* Subject & Code */}
                    <div style={{ fontSize: '0.78rem', color: '#781416', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      {quiz.course} • {quiz.subject} {quiz.subjectCode ? `(${quiz.subjectCode})` : ''}
                    </div>

                    {/* Quiz Title */}
                    <h3 style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#1C1E21',
                      fontFamily: "'Outfit', sans-serif",
                      lineHeight: 1.35,
                      margin: '0 0 0.65rem 0'
                    }}>
                      {quiz.title}
                    </h3>

                    {/* Description */}
                    <p style={{
                      fontSize: '0.82rem',
                      color: '#64748B',
                      lineHeight: 1.5,
                      margin: '0 0 1.25rem 0',
                      flexGrow: 1
                    }}>
                      {quiz.description}
                    </p>

                    {/* Meta stats row */}
                    <div style={{
                      backgroundColor: '#FAF7F2',
                      borderRadius: '12px',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.76rem',
                      color: '#475569',
                      fontWeight: 600,
                      marginBottom: '1.25rem'
                    }}>
                      <span>📝 {quiz.questions?.length || 0} Questions</span>
                      <span>⏱️ {quiz.durationMinutes} Minutes</span>
                      <span>🎯 +1 / 0 Marks</span>
                    </div>

                    {/* Start Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenQuizBrief(quiz)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        backgroundColor: '#781416',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        boxShadow: '0 4px 14px rgba(120, 20, 22, 0.2)',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9F1239'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#781416'}
                    >
                      <span>Start Quiz</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
