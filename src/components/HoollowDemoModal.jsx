import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  Target,
  ArrowRight,
  ExternalLink,
  Award
} from 'lucide-react';

export default function HoollowDemoModal({ isOpen, onClose, onTryGenerator }) {
  if (!isOpen) return null;

  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef(null);

  // 4 Steps mapping to time ranges:
  // Step 1: 0-15s -> Select Learning Goal
  // Step 2: 15-30s -> Choose Skill Level & Study Time
  // Step 3: 30-45s -> Generate and Preview Sample Roadmap
  // Step 4: 45-60s -> Open Learning Task & Start Practicing
  const currentStep = seconds < 15 ? 1 : seconds < 30 ? 2 : seconds < 45 ? 3 : 4;

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 60) {
            setIsPlaying(false);
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handleStepJump = (stepNum) => {
    const times = { 1: 0, 2: 15, 3: 30, 4: 45 };
    setSeconds(times[stepNum]);
    setIsPlaying(true);
  };

  const handleRestart = () => {
    setSeconds(0);
    setIsPlaying(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(28, 30, 33, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#0B0B0B',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(104, 19, 27, 0.25)',
          border: '1px solid #F1E5D8',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.2rem 1.5rem',
            borderBottom: '1px solid #F0ECE3',
            background: 'linear-gradient(135deg, #FFF9F1 0%, #FFFFFF 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#8B101D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF'
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1F2421', fontFamily: "'Outfit', sans-serif" }}>
                  HOOLLOW 60-Second Interactive Tour
                </span>
                <span
                  style={{
                    backgroundColor: '#FFF0E8',
                    color: '#8B101D',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    border: '1px solid #FAD6C5'
                  }}
                >
                  SAMPLE DEMO
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#7A6F62' }}>
                Watch how HOOLLOW transforms career goals into real, structured milestones in under 1 minute
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#F6F2E9',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#646E78',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar & Countdown Timer */}
        <div style={{ padding: '0.8rem 1.5rem', backgroundColor: '#FFFDF9', borderBottom: '1px solid #F5EFE8' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  backgroundColor: '#8B101D',
                  color: '#FFF',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                <Clock size={12} />
                <span>{60 - seconds}s Remaining</span>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#68131B' }}>
                Step {currentStep} of 4: {currentStep === 1 ? 'Goal Selection (0–15s)' : currentStep === 2 ? 'Learning Preferences (15–30s)' : currentStep === 3 ? 'AI Roadmap Synthesis (30–45s)' : 'First Learning Task Tour (45–60s)'}
              </span>
            </div>

            {/* Play/Pause & Reset Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  background: '#FFF',
                  border: '1px solid #E8E2D5',
                  borderRadius: '8px',
                  padding: '0.3rem 0.6rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#1F2421'
                }}
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button
                onClick={handleRestart}
                title="Restart 60s Demo"
                style={{
                  background: '#FFF',
                  border: '1px solid #E8E2D5',
                  borderRadius: '8px',
                  padding: '0.3rem 0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#646E78'
                }}
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          {/* Stepper Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
            {[
              { num: 1, title: '1. Goal Selection', range: '0–15s' },
              { num: 2, title: '2. Preferences', range: '15–30s' },
              { num: 3, title: '3. AI Generation', range: '30–45s' },
              { num: 4, title: '4. First Task Tour', range: '45–60s' }
            ].map((step) => {
              const active = currentStep === step.num;
              const completed = currentStep > step.num;
              return (
                <div
                  key={step.num}
                  onClick={() => handleStepJump(step.num)}
                  style={{
                    padding: '0.35rem 0.5rem',
                    borderRadius: '8px',
                    backgroundColor: active ? '#8B101D' : completed ? '#EBE3D7' : '#F6F2E9',
                    color: active ? '#FFFFFF' : '#4A5568',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    border: active ? '1px solid #68131B' : '1px solid transparent'
                  }}
                >
                  {step.title}
                </div>
              );
            })}
          </div>

          {/* Continuous progress bar line */}
          <div style={{ width: '100%', height: '4px', backgroundColor: '#F0ECE3', borderRadius: '9999px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(seconds / 60) * 100}%`,
                height: '100%',
                backgroundColor: '#8B101D',
                transition: 'width 1s linear'
              }}
            />
          </div>
        </div>

        {/* Dynamic Demo Body based on Current Step */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', backgroundColor: 'transparent' }}>
          {currentStep === 1 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFF0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B101D' }}>
                  <Target size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1F2421' }}>
                    0–15 Seconds: Target Goal Selection
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#7A6F62' }}>
                    Students choose from 10 high-growth tracks or specify a custom domain like "Rust Web3" or "Quant Finance".
                  </p>
                </div>
              </div>

              {/* Mock interactive goal cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem' }}>
                <div
                  style={{
                    backgroundColor: '#FFF5F3',
                    border: '2px solid #8B101D',
                    borderRadius: '16px',
                    padding: '1rem',
                    position: 'relative',
                    boxShadow: '0 6px 16px rgba(139, 16, 29, 0.08)'
                  }}
                >
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#8B101D', color: '#FFF', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                    ✓
                  </div>
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>🐍</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1F2421' }}>Python Developer (Selected)</div>
                  <p style={{ fontSize: '0.75rem', color: '#68131B', margin: '0.3rem 0 0' }}>
                    Learn Python from syntax to advanced asynchronous frameworks and build production APIs.
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: '#0B0B0B',
                    border: '1px solid #E8E2D5',
                    borderRadius: '16px',
                    padding: '1rem',
                    opacity: 0.85
                  }}
                >
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>🌐</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1F2421' }}>Web Development</div>
                  <p style={{ fontSize: '0.75rem', color: '#646E78', margin: '0.3rem 0 0' }}>
                    Master HTML, CSS, JavaScript, React 18, and scalable Node.js microservices.
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: '#0B0B0B',
                    border: '1px solid #E8E2D5',
                    borderRadius: '16px',
                    padding: '1rem',
                    opacity: 0.85
                  }}
                >
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>🧠</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1F2421' }}>AI/ML Engineer</div>
                  <p style={{ fontSize: '0.75rem', color: '#646E78', margin: '0.3rem 0 0' }}>
                    Machine Learning, Deep Learning, PyTorch, and Generative AI LLM applications.
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '1.2rem', padding: '0.8rem 1rem', background: '#FFF9F1', borderRadius: '12px', border: '1px dashed #E8D3B0', fontSize: '0.8rem', color: '#68131B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} />
                <span><strong>Demo Note:</strong> For this sample tour, we selected <strong>Python Developer</strong> to illustrate how the roadmap engine customizes every detail.</span>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFF0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B101D' }}>
                  <Clock size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1F2421' }}>
                    15–30 Seconds: Learning Preferences & Pace Configuration
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#7A6F62' }}>
                    No two students have the same schedule. HOOLLOW recalculates durations based on your real availability.
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: '#0B0B0B', border: '1px solid #E8E2D5', borderRadius: '16px', padding: '1.2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '0.8rem', background: '#FFF9F1', borderRadius: '12px', border: '1px solid #F1E5D8' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#68131B', textTransform: 'uppercase' }}>Current Level</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1F2421', marginTop: '0.2rem' }}>Beginner 👶</div>
                  <div style={{ fontSize: '0.7rem', color: '#7A6F62' }}>Includes fundamentals & syntax drills</div>
                </div>

                <div style={{ padding: '0.8rem', background: '#FFF9F1', borderRadius: '12px', border: '1px solid #F1E5D8' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#68131B', textTransform: 'uppercase' }}>Daily Study Time</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1F2421', marginTop: '0.2rem' }}>1 hour / day ⏱️</div>
                  <div style={{ fontSize: '0.7rem', color: '#7A6F62' }}>Bite-sized, sustainable consistency</div>
                </div>

                <div style={{ padding: '0.8rem', background: '#FFF9F1', borderRadius: '12px', border: '1px solid #F1E5D8' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#68131B', textTransform: 'uppercase' }}>Goal Timeline</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1F2421', marginTop: '0.2rem' }}>6 months 📅</div>
                  <div style={{ fontSize: '0.7rem', color: '#7A6F62' }}>Targeted semester-length pace</div>
                </div>

                <div style={{ padding: '0.8rem', background: '#FFF9F1', borderRadius: '12px', border: '1px solid #F1E5D8' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#68131B', textTransform: 'uppercase' }}>Learning Style</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1F2421', marginTop: '0.2rem' }}>Video + Practice 💻</div>
                  <div style={{ fontSize: '0.7rem', color: '#7A6F62' }}>Curated YouTube + LeetCode links</div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFF0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B101D' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1F2421' }}>
                    30–45 Seconds: AI Engine Generates 5 Structured Phases
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#7A6F62' }}>
                    The AI organizes your path from foundation to projects, advanced patterns, and interview placement.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                  { phase: 'Phase 1: Foundation', desc: 'Python setup, primitive types, loops & functions', tasks: '4 Tasks · 12 Hours' },
                  { phase: 'Phase 2: Core Concepts', desc: 'Data structures, OOP, file I/O & exception safety', tasks: '4 Tasks · 18 Hours' },
                  { phase: 'Phase 3: Real Projects', desc: 'CLI automation tools & web scrapers', tasks: '2 Projects · 16 Hours' },
                  { phase: 'Phase 4: Advanced Topics', desc: 'asyncio, FastAPI microservices & unit testing', tasks: '3 Tasks · 19 Hours' },
                  { phase: 'Phase 5: Career Prep', desc: 'Docker packaging & technical placement coding drills', tasks: '2 Tasks · 15 Hours' }
                ].map((p, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: idx === 0 ? '#FFF5F3' : '#FFFFFF',
                      border: idx === 0 ? '1.5px solid #8B101D' : '1px solid #E8E2D5',
                      borderRadius: '12px',
                      padding: '0.8rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1F2421' }}>{p.phase}</div>
                      <div style={{ fontSize: '0.75rem', color: '#7A6F62' }}>{p.desc}</div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8B101D', backgroundColor: '#FFF0E8', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                      {p.tasks}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FFF0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B101D' }}>
                  <Award size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1F2421' }}>
                    45–60 Seconds: Start First Task & Earn Real Streaks & XP
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#7A6F62' }}>
                    Every task includes verified video links, official documentation, and interactive practice challenges.
                  </p>
                </div>
              </div>

              {/* Sample Task Card */}
              <div
                style={{
                  backgroundColor: '#0B0B0B',
                  borderRadius: '16px',
                  border: '1.5px solid #8B101D',
                  padding: '1.2rem',
                  boxShadow: '0 8px 24px rgba(104, 19, 27, 0.08)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#8B101D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Phase 1 · Task 1
                  </span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#276749', background: '#F0FFF4', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                    ⚡ +50 XP on completion
                  </span>
                </div>

                <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem', fontWeight: 800, color: '#1F2421' }}>
                  Python Setup, Virtual Environments & VS Code
                </h3>
                <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: '#4A5568', lineHeight: 1.5 }}>
                  Install Python 3.12+, configure VS Code with Ruff/Black linters, and master isolated venv & pip package management.
                </p>

                {/* Resource Links */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.2rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#FEF2F2', color: '#DC2626', padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                    🎥 Video: Python 3 Complete Guide
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#EFF6FF', color: '#2563EB', padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                    📝 Notes: Official Interpreter Tutorial
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#F0FDF4', color: '#16A34A', padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                    💻 Practice: HackerRank Exercises
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div
                    style={{
                      background: '#8B101D',
                      color: '#FFF',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    Start Learning
                  </div>
                  <div
                    style={{
                      border: '1.5px solid #276749',
                      color: '#276749',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <CheckCircle2 size={16} />
                    Mark Complete
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderTop: '1px solid #F0ECE3',
            background: '#FFFFFF'
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              disabled={currentStep === 1}
              onClick={() => handleStepJump(currentStep - 1)}
              style={{
                background: '#F6F2E9',
                border: 'none',
                borderRadius: '8px',
                padding: '0.45rem 0.9rem',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                opacity: currentStep === 1 ? 0.5 : 1,
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: '#1F2421'
              }}
            >
              <ChevronLeft size={16} /> Back
            </button>

            <button
              disabled={currentStep === 4}
              onClick={() => handleStepJump(currentStep + 1)}
              style={{
                background: '#F6F2E9',
                border: 'none',
                borderRadius: '8px',
                padding: '0.45rem 0.9rem',
                cursor: currentStep === 4 ? 'not-allowed' : 'pointer',
                opacity: currentStep === 4 ? 0.5 : 1,
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: '#1F2421'
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              if (onTryGenerator) onTryGenerator();
            }}
            style={{
              background: '#8B101D',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.55rem 1.4rem',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 14px rgba(139, 16, 29, 0.25)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Sparkles size={16} />
            Try HOOLLOW Generator Now →
          </button>
        </div>
      </div>
    </div>
  );
}
