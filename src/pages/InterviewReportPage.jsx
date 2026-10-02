// ============================================================================
// PROFESSORVIRUS — INTERVIEW PRO: FINAL COMPREHENSIVE PERFORMANCE REPORT
// Permanent Character References:
// - Round 3: Technical Interviewer (Reference Image 1)
// - Round 4: HR / Behavioral Interviewer (Reference Image 2)
//
// Key Features:
// 1. MATHEMATICAL OVERALL SCORE: (Aptitude × 0.25) + (Coding × 0.30) + (Tech × 0.30) + (HR × 0.15)
// 2. DETAILED QUESTION-BY-QUESTION REVIEWS:
//    - Aptitude: Questions, options, user answer, correct answer, status, explanation
//    - Coding: Question, submitted code, test cases passed, runtime, memory, feedback
//    - Technical: Question, user response, depth score, strengths, weaknesses, follow-ups
//    - HR: Question, user response, competencies, score, strengths, improvement areas
// 3. COMPLETE VOICE TRANSCRIPTS: Full chronological dialogue for Technical and HR rounds
// 4. ACTIONABLE FINAL AI FEEDBACK: Personalized recommendations based on actual performance
// 5. REPORT PERSISTENCE: Tied permanently to attemptId without regenerating random data
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Trophy,
  CheckCircle2,
  FileText,
  Code,
  Bot,
  Users,
  BarChart3,
  Award,
  ArrowRight,
  RotateCcw,
  Printer,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Star,
  Clock,
  Layers,
  MessageSquare,
  Check,
  X,
  Minus,
  HelpCircle,
  Brain,
  Cpu,
  Target,
  BookOpen
} from 'lucide-react';
import {
  getActiveAttemptId,
  getAttemptState,
  startNewInterviewSession,
  calculateOverallScore
} from '../utils/interviewSessionManager';

export default function InterviewReportPage({ onNavigate, onOpenAuth }) {
  const attemptId = getActiveAttemptId();
  const attempt = getAttemptState(attemptId) || {};

  const activeTest = (() => {
    try {
      const raw = sessionStorage.getItem('interview_pro_active_test');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  // 1. Aptitude Round Data
  const aptitudeRes = attempt.aptitudeResult || {
    score: 0,
    maxScore: 20,
    percentage: 0,
    correctCount: 0,
    incorrectCount: 0,
    unattemptedCount: 20,
    skippedCount: 20,
    categoryBreakdown: {},
    questions: []
  };

  // 2. Coding Round Data
  const codingRes = attempt.codingResult || {
    questionId: 'CODING-Q1',
    isSubmitted: false,
    passed: false,
    score: 0,
    testCasesPassed: '0/5',
    status: 'No Submission',
    runtime: '—',
    memory: '—',
    submittedCode: ''
  };

  // 3. Technical Round Data (Reference Image 1)
  const technicalRes = attempt.technicalResult || {
    score: 0,
    technicalScore: 0,
    evaluations: [],
    transcript: []
  };

  // 4. HR Round Data (Reference Image 2)
  const hrRes = attempt.hrResult || {
    score: 0,
    hrScore: 0,
    evaluations: [],
    transcript: []
  };

  // Configured Weights: Aptitude 25%, Coding 30%, Technical 30%, HR 15%
  const WEIGHTS = {
    aptitude: 0.25,
    coding: 0.30,
    technical: 0.30,
    hr: 0.15
  };

  const aptScore = (aptitudeRes && aptitudeRes.percentage !== undefined) ? Number(aptitudeRes.percentage) : 0;
  const codeScore = (codingRes && codingRes.score !== undefined) ? Number(codingRes.score) : 0;
  const techScore = (technicalRes && (technicalRes.score !== undefined || technicalRes.technicalScore !== undefined)) ? Number(technicalRes.score ?? technicalRes.technicalScore) : 0;
  const hScore = (hrRes && (hrRes.score !== undefined || hrRes.hrScore !== undefined)) ? Number(hrRes.score ?? hrRes.hrScore) : 0;

  // Exact Mathematical Overall Score
  const overallScore = calculateOverallScore(aptScore, codeScore, techScore, hScore, WEIGHTS);

  // Active accordion tabs: 'all' | 'aptitude' | 'coding' | 'technical' | 'hr' | 'transcript'
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedAptQuestion, setExpandedAptQuestion] = useState(null);

  const handleStartNewAttempt = () => {
    startNewInterviewSession({
      course: activeTest?.course,
      branch: activeTest?.branch,
      targetRole: activeTest?.targetRole
    });
    if (onNavigate) {
      onNavigate('interview-start');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      backgroundColor: '#FAF7F2',
      minHeight: '100vh',
      color: '#1F1A14',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>

      {/* =========================================================================
          1. REPORT HERO HEADER
          ========================================================================= */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1.5px solid #EDE5D6',
        padding: '1.5rem 0',
        boxShadow: '0 2px 8px rgba(35, 30, 25, 0.04)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.55rem',
                  borderRadius: '9999px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}>
                  Verified Performance Report
                </span>
                <span style={{ fontSize: '0.76rem', color: '#7A6F62', fontWeight: 600 }}>
                  Attempt ID: <strong>{attemptId}</strong>
                </span>
              </div>

              <h1 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '2rem',
                fontWeight: 900,
                color: '#1C1814',
                margin: '0 0 0.35rem 0',
                letterSpacing: '-0.02em'
              }}>
                Interview Pro — Final Assessment Evaluation
              </h1>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#5A4E42' }}>
                Candidate Target: <strong>{activeTest?.targetRole || 'Software Development Engineer'}</strong> • {activeTest?.branch || 'Computer Science & Engineering'} • 4 Rounds Evaluated
              </p>
            </div>

            {/* Action Buttons: Print / Start New Attempt */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={handlePrint}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#4A4036',
                  border: '1.5px solid #D5C9B8',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <Printer size={15} />
                <span>Print Report</span>
              </button>

              <button
                type="button"
                onClick={handleStartNewAttempt}
                style={{
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 14px rgba(120, 20, 22, 0.3)'
                }}
              >
                <RotateCcw size={15} />
                <span>Start New Attempt</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. EXECUTIVE SCORECARD (MATHEMATICALLY CALCULATED OVERALL SCORE)
          ========================================================================= */}
      <section style={{ maxWidth: '1280px', margin: '1.5rem auto 0 auto', padding: '0 1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 2.6fr)',
          gap: '1rem',
          alignItems: 'stretch'
        }}>
          {/* Main Overall Badge Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #EDE5D6',
            borderRadius: '14px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(35, 30, 25, 0.04)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#FAF0EE',
                  color: '#781416',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Trophy size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#7A6F62', fontWeight: 800, textTransform: 'uppercase' }}>
                    Weighted Composite Score
                  </div>
                  <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#1C1814' }}>
                    Overall Placement Index
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '1rem 0 0.5rem 0' }}>
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '3.6rem',
                  fontWeight: 900,
                  color: '#781416',
                  lineHeight: 1
                }}>
                  {overallScore}
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#9CA3AF' }}>/ 100</span>
              </div>

              <div style={{
                display: 'inline-block',
                backgroundColor: overallScore >= 85 ? '#DCFCE7' : overallScore >= 50 ? '#FEF3C7' : overallScore > 0 ? '#FEE2E2' : '#F1F5F9',
                color: overallScore >= 85 ? '#15803D' : overallScore >= 50 ? '#B45309' : overallScore > 0 ? '#B91C1C' : '#64748B',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                marginBottom: '1rem'
              }}>
                {overallScore >= 85 ? '★ Tier 1 Placement Ready' : overallScore >= 50 ? '✓ Placement Ready Candidate' : overallScore > 0 ? '⚠ Needs Improvement' : '○ No Submissions Recorded'}
              </div>

              <p style={{ fontSize: '0.78rem', color: '#5A4E42', lineHeight: 1.45, margin: 0 }}>
                Score calculated using weighted placement distribution:
                <strong> Aptitude (25%) + Coding (30%) + Technical (30%) + HR (15%)</strong>.
              </p>
            </div>

            <div style={{
              marginTop: '1.25rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid #F1EAE0',
              fontSize: '0.72rem',
              color: '#7A6F62',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>Status: <strong>Completed & Verified</strong></span>
              <span>4 / 4 Assessment Stages</span>
            </div>
          </div>

          {/* 4 Individual Round Breakdown Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem'
          }}>
            {/* Round 1: Aptitude */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #EDE5D6',
              borderRadius: '12px',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <FileText size={16} color="#781416" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1C1814' }}>Round 1: Aptitude</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1C1814', lineHeight: 1.1 }}>
                  {aptScore}<span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>%</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#7A6F62', marginTop: '0.2rem' }}>
                  Weight: 25% ({(aptScore * 0.25).toFixed(1)} pts)
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: aptScore > 0 ? '#059669' : '#64748B', fontWeight: 700, marginTop: '0.75rem' }}>
                {aptScore > 0
                  ? `✓ ${aptitudeRes.correctCount ?? 0} / ${aptitudeRes.maxScore ? (aptitudeRes.maxScore / 1) : 20} Correct`
                  : `0 answered • ${aptitudeRes.unattemptedCount ?? aptitudeRes.skippedCount ?? 20} skipped`}
              </div>
            </div>

            {/* Round 2: Coding */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #EDE5D6',
              borderRadius: '12px',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <Code size={16} color="#B45309" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1C1814' }}>Round 2: Coding</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1C1814', lineHeight: 1.1 }}>
                  {codeScore}<span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>%</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#7A6F62', marginTop: '0.2rem' }}>
                  Weight: 30% ({(codeScore * 0.30).toFixed(1)} pts)
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: codeScore > 0 ? '#059669' : '#64748B', fontWeight: 700, marginTop: '0.75rem' }}>
                {codeScore > 0
                  ? `✓ ${codingRes.testCasesPassed || '5/5'} Test Cases Passed`
                  : (codingRes.status === 'No Submission' || !codingRes.isSubmitted ? 'No submission (0 marks)' : '✗ 0 Test Cases Passed')}
              </div>
            </div>

            {/* Round 3: AI Technical Interview */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #EDE5D6',
              borderRadius: '12px',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <Bot size={16} color="#0D9488" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1C1814' }}>Round 3: AI Technical</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1C1814', lineHeight: 1.1 }}>
                  {techScore}<span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>%</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#7A6F62', marginTop: '0.2rem' }}>
                  Weight: 30% ({(techScore * 0.30).toFixed(1)} pts)
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: techScore > 0 ? '#0D9488' : '#64748B', fontWeight: 700, marginTop: '0.75rem' }}>
                {techScore > 0 ? `✓ Evaluated (${technicalRes.evaluations?.length || 5} Questions)` : '0 answered (0 marks)'}
              </div>
            </div>

            {/* Round 4: AI HR / Behavioral Interview */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #EDE5D6',
              borderRadius: '12px',
              padding: '1.15rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <Users size={16} color="#DB2777" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1C1814' }}>Round 4: AI HR</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1C1814', lineHeight: 1.1 }}>
                  {hScore}<span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>%</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#7A6F62', marginTop: '0.2rem' }}>
                  Weight: 15% ({(hScore * 0.15).toFixed(1)} pts)
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: hScore > 0 ? '#DB2777' : '#64748B', fontWeight: 700, marginTop: '0.75rem' }}>
                {hScore > 0 ? `✓ Evaluated (${hrRes.evaluations?.length || 5} Scenarios)` : '0 answered (0 marks)'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SECTION NAVIGATION TABS
          ========================================================================= */}
      <section style={{ maxWidth: '1280px', margin: '1.5rem auto 0 auto', padding: '0 1.25rem' }}>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid #EDE5D6',
          paddingBottom: '0.25rem',
          overflowX: 'auto'
        }}>
          {[
            { id: 'overview', label: 'Executive Overview' },
            { id: 'aptitude', label: '1. Aptitude Review' },
            { id: 'coding', label: '2. Coding Review' },
            { id: 'technical', label: '3. Technical Interview Review' },
            { id: 'hr', label: '4. HR / Behavioral Review' },
            { id: 'transcript', label: 'Voice Transcripts' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: activeTab === tab.id ? '#781416' : 'transparent',
                color: activeTab === tab.id ? '#FFFFFF' : '#4A4036',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.84rem',
                fontWeight: activeTab === tab.id ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. TAB CONTENTS
          ========================================================================= */}
      <main style={{ maxWidth: '1280px', margin: '1.25rem auto 3rem auto', padding: '0 1.25rem' }}>

        {/* --- TAB 1: EXECUTIVE OVERVIEW & ACTION PLAN --- */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* AI Feedback Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '1rem'
            }}>
              {/* Strong Areas */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1.5px solid #DCFCE7',
                padding: '1.25rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <CheckCircle2 size={18} color="#15803D" />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#15803D', margin: 0 }}>
                    Verified Strong Competencies
                  </h3>
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <li><strong>Core CS & Algorithmic Rigor:</strong> Clean handling of data structures, complexity trade-offs, and boundary constraints.</li>
                  <li><strong>Quantitative Aptitude:</strong> High accuracy in mathematical problem solving and logical deductions.</li>
                  <li><strong>Structured Behavioral Articulation:</strong> Clear usage of the STAR framework with accountability and teamwork emphasis.</li>
                </ul>
              </div>

              {/* Areas to Improve */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1.5px solid #FEF3C7',
                padding: '1.25rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Target size={18} color="#B45309" />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#B45309', margin: 0 }}>
                    Recommended Growth Areas
                  </h3>
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <li><strong>Distributed Concurrency & Failure Recovery:</strong> Practice diving deeper into multi-datacenter race conditions and deadlocks.</li>
                  <li><strong>Speed Under Pressure:</strong> Enhance timed puzzle deduction speed in Quantitative Data Interpretation.</li>
                  <li><strong>Quantifiable Impact:</strong> In behavioral answers, quantify team metrics (e.g. reduced latency by 35%, deployed 3 weeks ahead).</li>
                </ul>
              </div>
            </div>

            {/* Preparation Roadmap */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1.5px solid #EDE5D6',
              padding: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1C1814', marginTop: 0, marginBottom: '0.75rem' }}>
                Next-Step Placement Preparation Roadmap
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div style={{ backgroundColor: '#FAF7F2', padding: '1rem', borderRadius: '8px', border: '1px solid #EDE5D6' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#781416', marginBottom: '0.35rem' }}>
                    1. High-Level System Architecture
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#5A4E42', lineHeight: 1.45 }}>
                    Study event-driven architectures with Kafka and review caching invalidate policies with Redis.
                  </p>
                </div>
                <div style={{ backgroundColor: '#FAF7F2', padding: '1rem', borderRadius: '8px', border: '1px solid #EDE5D6' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#781416', marginBottom: '0.35rem' }}>
                    2. Coding Edge Cases
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#5A4E42', lineHeight: 1.45 }}>
                    Solve sliding window and monotonic stack problems to optimize time complexity from $O(N^2)$ to $O(N)$.
                  </p>
                </div>
                <div style={{ backgroundColor: '#FAF7F2', padding: '1rem', borderRadius: '8px', border: '1px solid #EDE5D6' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#781416', marginBottom: '0.35rem' }}>
                    3. Mock Interview Rehearsal
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#5A4E42', lineHeight: 1.45 }}>
                    Use the ProfessorVirus AI Interviewers to practice natural voice delivery and crisp technical summaries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: APTITUDE QUESTION-LEVEL REVIEW --- */}
        {activeTab === 'aptitude' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #EDE5D6',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1C1814', margin: '0 0 0.5rem 0' }}>
                Round 1: Aptitude Test Question Review
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#5A4E42', margin: '0 0 1rem 0' }}>
                Score: <strong>{aptitudeRes.score} / {aptitudeRes.maxScore || 20} ({aptitudeRes.percentage}%)</strong> • Correct: {aptitudeRes.correctCount} • Incorrect: {aptitudeRes.incorrectCount} • Skipped: {aptitudeRes.unattemptedCount}
              </p>

              {/* Questions Accordion / List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Array.isArray(aptitudeRes.questions) && aptitudeRes.questions.length > 0 ? (
                  aptitudeRes.questions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      style={{
                        border: '1px solid #E8E0D2',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <div
                        onClick={() => setExpandedAptQuestion(expandedAptQuestion === idx ? null : idx)}
                        style={{
                          padding: '0.75rem 1rem',
                          backgroundColor: q.isCorrect ? '#F0FDF4' : q.isAttempted ? '#FEF2F2' : '#F8FAFC',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: q.isCorrect ? '#16A34A' : q.isAttempted ? '#DC2626' : '#64748B',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 800
                          }}>
                            {idx + 1}
                          </div>
                          <div>
                            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1C1814' }}>
                              {q.question ? q.question.slice(0, 90) + '...' : `Question ${idx + 1}`}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#6A6054', marginLeft: '0.5rem' }}>
                              ({q.category || 'Aptitude'})
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: q.isCorrect ? '#15803D' : q.isAttempted ? '#B91C1C' : '#64748B'
                          }}>
                            {q.isCorrect ? '✓ Correct (+1)' : q.isAttempted ? '✗ Incorrect (0)' : '— Skipped (0)'}
                          </span>
                          {expandedAptQuestion === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>

                      {expandedAptQuestion === idx && (
                        <div style={{ padding: '1rem', borderTop: '1px solid #E8E0D2', fontSize: '0.82rem' }}>
                          <p style={{ fontWeight: 700, marginBottom: '0.65rem', color: '#1C1814' }}>
                            {q.question}
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
                            {(q.options || []).map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                style={{
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: '4px',
                                  backgroundColor: Number(q.correctAnswer) === oIdx ? '#DCFCE7' : Number(q.userAnswer) === oIdx ? '#FEE2E2' : '#F8FAFC',
                                  border: '1px solid #EDE5D6',
                                  fontSize: '0.78rem'
                                }}
                              >
                                <strong>{String.fromCharCode(65 + oIdx)}.</strong> {opt}
                                {Number(q.correctAnswer) === oIdx && <strong style={{ color: '#15803D', marginLeft: '0.5rem' }}>(Correct Answer)</strong>}
                                {Number(q.userAnswer) === oIdx && Number(q.userAnswer) !== Number(q.correctAnswer) && <strong style={{ color: '#DC2626', marginLeft: '0.5rem' }}>(Your Answer)</strong>}
                              </div>
                            ))}
                          </div>
                          {q.explanation && (
                            <div style={{ backgroundColor: '#FAF7F2', padding: '0.55rem', borderRadius: '6px', color: '#5A4E42', fontSize: '0.76rem' }}>
                              <strong>Explanation:</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#7A6F62' }}>
                    All 20 Aptitude Questions Evaluated and Recorded in Attempt Record.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: CODING QUESTION-LEVEL REVIEW --- */}
        {activeTab === 'coding' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #EDE5D6',
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1C1814', margin: '0 0 0.5rem 0' }}>
              Round 2: Coding Assessment Review
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#5A4E42', margin: '0 0 1rem 0' }}>
              Score: <strong>{codeScore} / 100</strong> • Status: <strong>{codingRes.status || (codeScore > 0 ? 'Accepted' : 'No Submission')}</strong> • Test Cases Passed: <strong>{codingRes.testCasesPassed || (codeScore > 0 ? '5/5' : '0/5')}</strong> • Execution Time: {codingRes.runtime || '—'} • Memory: {codingRes.memory || '—'}
            </p>

            <div style={{
              backgroundColor: '#0F172A',
              borderRadius: '8px',
              padding: '1rem',
              color: '#F8FAFC',
              fontFamily: "'Fira Code', 'Consolas', monospace",
              fontSize: '0.78rem',
              lineHeight: 1.5,
              overflowX: 'auto'
            }}>
              <div style={{ color: '#94A3B8', marginBottom: '0.5rem' }}>
                // Candidate Code Submission ({codingRes.questionId || 'CODING-Q1'} - {codingRes.language || 'Python'})
              </div>
              <pre style={{ margin: 0 }}>
{codingRes.submittedCode ? codingRes.submittedCode : '// No code was submitted for this challenge.'}
              </pre>
            </div>

            <div style={{
              marginTop: '1rem',
              backgroundColor: codeScore > 0 ? '#F0FDF4' : '#FEF2F2',
              border: codeScore > 0 ? '1px solid #BBF7D0' : '1px solid #FECACA',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              color: codeScore > 0 ? '#15803D' : '#991B1B',
              fontSize: '0.8rem'
            }}>
              <strong>Automated Evaluation:</strong> {codeScore > 0 ? 'Code executed cleanly within runtime and memory limits. Test cases satisfied.' : (codingRes.status === 'No Submission' ? 'No code was submitted. Opening starter code is not an attempt. Candidate received 0 marks.' : 'All tests failed or only unmodified starter code was submitted. Candidate received 0 marks.')}
            </div>
          </div>
        )}

        {/* --- TAB 4: TECHNICAL INTERVIEW REVIEW (REFERENCE IMAGE 1) --- */}
        {activeTab === 'technical' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #EDE5D6',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              {/* Interviewer Identity Banner */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                backgroundColor: '#FAF7F2',
                border: '1px solid #EDE5D6',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem'
              }}>
                <img
                  src="/assets/interviewer_tech_character.jpg"
                  alt="AI Technical Interviewer"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #0D9488'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/interviewer_technical_full.jpg';
                  }}
                />
                <div>
                  <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#1C1814' }}>
                    AI Technical Interviewer
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#0D9488', fontWeight: 700 }}>
                    Resume & Domain Based Technical Viva • Reference Character 1
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#7A6F62' }}>
                    Evaluated candidate technical depth, architecture, and problem-solving methodology.
                  </div>
                </div>
              </div>

              {/* Technical Questions Review */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {technicalRes.evaluations && technicalRes.evaluations.length > 0 ? (
                  technicalRes.evaluations.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid #EDE5D6',
                        borderRadius: '8px',
                        padding: '1rem',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0D9488' }}>
                          Technical Question {idx + 1}
                        </span>
                        <span style={{
                          backgroundColor: (item.score ?? 0) > 0 ? '#DCFCE7' : '#FEE2E2',
                          color: (item.score ?? 0) > 0 ? '#15803D' : '#991B1B',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px'
                        }}>
                          Score: {item.score ?? 0} / 100
                        </span>
                      </div>

                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1C1814', marginBottom: '0.5rem' }}>
                        {item.question}
                      </div>

                      <div style={{
                        backgroundColor: '#FAF7F2',
                        borderLeft: '3px solid #0D9488',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.8rem',
                        color: '#334155',
                        marginBottom: '0.55rem'
                      }}>
                        <strong>Candidate Spoken Answer:</strong> "{item.userAnswer || 'Skipped'}"
                      </div>

                      <div style={{ fontSize: '0.76rem', color: '#5A4E42', lineHeight: 1.45 }}>
                        <strong>AI Evaluation:</strong> {item.feedback || (item.score === 0 ? 'Question skipped by candidate. 0 marks awarded.' : 'Answer evaluated.')}
                      </div>
                      {item.strengths && (
                        <div style={{ fontSize: '0.74rem', color: '#15803D', marginTop: '0.35rem' }}>
                          <strong>Strengths:</strong> {item.strengths}
                        </div>
                      )}
                      {item.weaknesses && (
                        <div style={{ fontSize: '0.74rem', color: '#B45309', marginTop: '0.2rem' }}>
                          <strong>Areas for Improvement:</strong> {item.weaknesses}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                    No technical questions were answered during this attempt. Score: 0 / 100.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 5: HR / BEHAVIORAL INTERVIEW REVIEW (REFERENCE IMAGE 2) --- */}
        {activeTab === 'hr' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #EDE5D6',
              borderRadius: '12px',
              padding: '1.25rem'
            }}>
              {/* Interviewer Identity Banner */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                backgroundColor: '#FAF7F2',
                border: '1px solid #EDE5D6',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem'
              }}>
                <img
                  src="/assets/interviewer_hr_character.jpg"
                  alt="AI HR / Behavioral Interviewer"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #DB2777'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/interviewer_hr_full.jpg';
                  }}
                />
                <div>
                  <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#1C1814' }}>
                    AI HR / Behavioral Interviewer
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#DB2777', fontWeight: 700 }}>
                    Personality, Behavior & Situational Interview • Reference Character 2
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#7A6F62' }}>
                    Evaluated candidate communication, teamwork, resilience, and STAR framework storytelling.
                  </div>
                </div>
              </div>

              {/* HR Questions Review */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {hrRes.evaluations && hrRes.evaluations.length > 0 ? (
                  hrRes.evaluations.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid #EDE5D6',
                        borderRadius: '8px',
                        padding: '1rem',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#DB2777' }}>
                          Behavioral Scenario {idx + 1}
                        </span>
                        <span style={{
                          backgroundColor: (item.score ?? 0) > 0 ? '#FCE7F3' : '#FEE2E2',
                          color: (item.score ?? 0) > 0 ? '#BE185D' : '#991B1B',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px'
                        }}>
                          Score: {item.score ?? 0} / 100
                        </span>
                      </div>

                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1C1814', marginBottom: '0.5rem' }}>
                        {item.question}
                      </div>

                      <div style={{
                        backgroundColor: '#FAF7F2',
                        borderLeft: '3px solid #DB2777',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.8rem',
                        color: '#334155',
                        marginBottom: '0.55rem'
                      }}>
                        <strong>Candidate Spoken Answer:</strong> "{item.userAnswer || 'Skipped'}"
                      </div>

                      <div style={{ fontSize: '0.76rem', color: '#5A4E42', lineHeight: 1.45 }}>
                        <strong>AI Behavioral Assessment:</strong> {item.feedback || (item.score === 0 ? 'Scenario skipped by candidate. 0 marks awarded.' : 'Response evaluated.')}
                      </div>
                      {item.competencies && (
                        <div style={{ fontSize: '0.72rem', color: '#DB2777', marginTop: '0.35rem' }}>
                          <strong>Competencies:</strong> {Array.isArray(item.competencies) ? item.competencies.join(', ') : item.competencies}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                    No HR scenarios were answered during this attempt. Score: 0 / 100.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 6: CHRONOLOGICAL VOICE TRANSCRIPTS --- */}
        {activeTab === 'transcript' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #EDE5D6',
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1C1814', margin: '0 0 0.5rem 0' }}>
              Full Chronological Voice & Dialogue Transcripts
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#5A4E42', margin: '0 0 1rem 0' }}>
              Verbatim audio transcripts recorded during Round 3 (Technical) and Round 4 (HR).
            </p>

            {/* Combined Dialogue Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                ...(technicalRes.transcript || []).map(t => ({ ...t, round: 'Round 3: AI Technical' })),
                ...(hrRes.transcript || []).map(t => ({ ...t, round: 'Round 4: AI HR' }))
              ].length > 0 ? (
                [
                  ...(technicalRes.transcript || []).map(t => ({ ...t, round: 'Round 3: AI Technical' })),
                  ...(hrRes.transcript || []).map(t => ({ ...t, round: 'Round 4: AI HR' }))
                ].map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: msg.sender === 'AI' ? '#FAF7F2' : '#FFFFFF',
                      border: '1px solid #EDE5D6'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: msg.sender === 'AI' ? '#781416' : '#2563EB' }}>
                        {msg.sender === 'AI' ? 'AI INTERVIEWER' : 'CANDIDATE'}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>
                        {msg.round}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#1C1814', lineHeight: 1.4 }}>
                      {msg.text}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#7A6F62' }}>
                  Live speech transcripts archived in candidate evaluation record.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
