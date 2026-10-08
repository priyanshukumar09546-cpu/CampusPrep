// ============================================================================
// PROFESSORVIRUS — INTERVIEW PRO: ROUND 3 (AI TECHNICAL INTERVIEWER)
// Permanent Visual Reference: REFERENCE IMAGE 1 (AI Technical Interviewer)
//
// Key Features:
// 1. CHARACTER CONSISTENCY: High-fidelity room and portrait from Reference Image 1
// 2. RESUME & DOMAIN PERSONALIZATION: Dynamically personalizes questions
// 3. ADAPTIVE QUESTIONING: Follow-ups adapt based on candidate's previous depth
// 4. FULL VOICE INTERACTION: Speech synthesis (AI speaks) + Speech recognition (User speaks)
// 5. LIVE STATES: AI is speaking..., Listening..., Processing answer..., Your turn...
// 6. QUESTION-LEVEL SCORING: Evaluates correctness, technical depth, and relevance
// 7. TRANSCRIPT PERSISTENCE: Records dialogue to attempt state
// 8. UNLOCKS ROUND 4: Smoothly advances to AI HR / Behavioral Interview
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  Clock,
  Code,
  FileText,
  Bot,
  Users,
  LogOut,
  Maximize2,
  Minimize2,
  Settings,
  Check,
  CheckCircle2,
  Play,
  Send,
  AlertCircle,
  HelpCircle,
  Award,
  BookOpen,
  PenTool,
  BarChart2,
  ArrowRight,
  RotateCcw,
  ShieldAlert,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Volume2,
  VolumeX,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import {
  getActiveAttemptId,
  getCurrentUserId,
  getAttemptState,
  isRoundAccessible,
  completeRound,
  fetchNextTechnicalQuestion,
  submitTechnicalInterview
} from '../utils/interviewSessionManager';
import InterviewProctorMonitor from '../components/InterviewProctorMonitor';

export default function InterviewTechnicalPage({ onNavigate, onOpenAuth }) {
  const attemptId = getActiveAttemptId();
  const userId = getCurrentUserId();
  const isAccessible = isRoundAccessible('technical', attemptId);

  // Candidate Profile from assessment setup (grounded in uploaded resume)
  const [candidateProfile] = useState(() => {
    try {
      const raw = sessionStorage.getItem('interview_pro_active_test');
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...parsed,
          ...(parsed.structuredProfile || {})
        };
      }
    } catch {}
    return {
      name: 'Candidate',
      targetRole: 'Full Stack Software Engineer',
      domain: 'Computer Science & Engineering',
      skills: ['React', 'Node.js', 'MongoDB', 'JWT', 'System Architecture']
    };
  });

  // Interview Questions & Flow State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [previousQuestions, setPreviousQuestions] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [transcript, setTranscript] = useState([]);

  // Voice & Interaction States
  // 'ai_speaking' | 'listening' | 'processing' | 'your_turn'
  const [voiceState, setVoiceState] = useState('ai_speaking');
  const [liveSpokenText, setLiveSpokenText] = useState('');
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Speech Recognition & Synthesis references
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis || null);

  // 30-Minute Persistent Countdown Timer
  const [timeLeft, setTimeLeft] = useState(() => {
    const timerKey = `interview_pro_tech_timer_end_${attemptId}`;
    const savedEnd = localStorage.getItem(timerKey);
    const now = Date.now();
    if (savedEnd) {
      const end = parseInt(savedEnd, 10);
      if (end > now) return Math.floor((end - now) / 1000);
    }
    const newEnd = now + 30 * 60 * 1000;
    localStorage.setItem(timerKey, String(newEnd));
    return 30 * 60;
  });

  // Security Gate: Ensure round is accessible and devices are verified
  useEffect(() => {
    if (!isRoundAccessible('technical', attemptId)) {
      if (onNavigate) {
        onNavigate('interview-instructions');
      }
    }
  }, [attemptId, onNavigate]);

  // 1. Initial Question Fetch
  useEffect(() => {
    let isMounted = true;
    async function loadFirstQuestion() {
      try {
        const data = await fetchNextTechnicalQuestion(attemptId, 0, '', [], candidateProfile);
        if (isMounted && data && data.nextQuestion) {
          setCurrentQuestion(data.nextQuestion);
          setPreviousQuestions([data.nextQuestion]);
          setTranscript([
            { sender: 'AI', text: data.nextQuestion.question, timestamp: new Date().toISOString() }
          ]);
        }
      } catch (err) {
        console.error('[TECH PAGE] Load error:', err);
      }
    }
    loadFirstQuestion();
    return () => { isMounted = false; };
  }, [attemptId]);

  // 2. Text-to-Speech: AI speaks current question aloud
  // Silence & Turn-taking timers
  const [silenceState, setSilenceState] = useState('none'); // 'none' | 'take_your_time' | 'repeat_prompt'
  const silenceTimer1Ref = useRef(null);
  const silenceTimer2Ref = useRef(null);
  const speechEndTimerRef = useRef(null);

  const clearSilenceTimers = () => {
    if (silenceTimer1Ref.current) clearTimeout(silenceTimer1Ref.current);
    if (silenceTimer2Ref.current) clearTimeout(silenceTimer2Ref.current);
    silenceTimer1Ref.current = null;
    silenceTimer2Ref.current = null;
    setSilenceState('none');
  };

  const startSilenceTimers = () => {
    clearSilenceTimers();
    // 10s: Gentle "Take your time"
    silenceTimer1Ref.current = setTimeout(() => {
      setSilenceState('take_your_time');
      // 22s: "Would you like me to repeat the question?"
      silenceTimer2Ref.current = setTimeout(() => {
        setSilenceState('repeat_prompt');
      }, 12000);
    }, 10000);
  };

  // 1. Initial Question Fetch
  useEffect(() => {
    let isMounted = true;
    async function loadFirstQuestion() {
      try {
        const data = await fetchNextTechnicalQuestion(attemptId, 0, '', [], candidateProfile);
        if (isMounted && data && data.nextQuestion) {
          setCurrentQuestion(data.nextQuestion);
          setPreviousQuestions([data.nextQuestion]);
          setTranscript([
            { sender: 'AI', text: data.nextQuestion.spokenText || data.nextQuestion.question, timestamp: new Date().toISOString() }
          ]);
        }
      } catch (err) {
        console.error('[TECH PAGE] Load error:', err);
      }
    }
    loadFirstQuestion();
    return () => { isMounted = false; };
  }, [attemptId]);

  // 2. Text-to-Speech: AI speaks current question aloud with natural tone
  useEffect(() => {
    const textToSpeak = currentQuestion?.spokenText || currentQuestion?.question;
    if (!textToSpeak || !synthRef.current) return;

    // AI is speaking: stop speech recognition so AI audio is not recorded
    stopSpeechRecognition();
    clearSilenceTimers();
    synthRef.current.cancel();
    setVoiceState('ai_speaking');

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 0.95; // Confident, professional male pitch

    const voices = synthRef.current.getVoices ? synthRef.current.getVoices() : [];
    const maleVoice = voices.find(v => (v.name.includes('Male') || v.name.includes('David') || v.name.includes('George') || v.name.includes('Natural')) && v.lang.startsWith('en')) || voices[0];
    if (maleVoice) utterance.voice = maleVoice;

    utterance.onstart = () => {
      setVoiceState('ai_speaking');
    };

    utterance.onend = () => {
      setVoiceState('listening');
      if (!isMicMuted) {
        startSpeechRecognition();
      } else {
        setVoiceState('your_turn');
      }
      startSilenceTimers();
    };

    utterance.onerror = () => {
      setVoiceState('your_turn');
      startSilenceTimers();
    };

    synthRef.current.speak(utterance);

    return () => {
      if (synthRef.current) synthRef.current.cancel();
      clearSilenceTimers();
    };
  }, [currentQuestion, isMicMuted]);

  // 3. Speech Recognition Engine
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceState('your_turn');
      return;
    }

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setVoiceState('listening');
      };

      recognition.onresult = (event) => {
        // User spoke: cancel silence warning
        clearSilenceTimers();

        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        const combined = (final + interim).trim();
        if (combined) {
          setLiveSpokenText(combined);
          setTypedAnswer(combined);

          // Reset speech-end auto-submit debounce timer (3.5s pause)
          if (speechEndTimerRef.current) clearTimeout(speechEndTimerRef.current);
          speechEndTimerRef.current = setTimeout(() => {
            if (combined.split(/\s+/).length >= 5) {
              handleAnswerSubmit(combined);
            }
          }, 3500);
        }
      };

      recognition.onerror = (e) => {
        console.warn('[SPEECH RECOGNITION WARNING]:', e.error);
        if (voiceState !== 'ai_speaking') setVoiceState('your_turn');
      };

      recognition.onend = () => {
        if (voiceState === 'listening' && !isMicMuted) {
          try { recognition.start(); } catch {}
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition init failed:', err);
      setVoiceState('your_turn');
    }
  };

  const stopSpeechRecognition = () => {
    if (speechEndTimerRef.current) clearTimeout(speechEndTimerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
  };

  // Toggle Mic
  const toggleMic = () => {
    setIsMicMuted(prev => {
      const next = !prev;
      if (next) {
        stopSpeechRecognition();
        setVoiceState('your_turn');
      } else {
        if (voiceState !== 'ai_speaking') {
          startSpeechRecognition();
        }
      }
      return next;
    });
  };

  // 4. Timer Tick
  useEffect(() => {
    const timerKey = `interview_pro_tech_timer_end_${attemptId}`;
    const interval = setInterval(() => {
      const savedEnd = localStorage.getItem(timerKey);
      const now = Date.now();
      if (savedEnd) {
        const remaining = Math.max(0, Math.floor((parseInt(savedEnd, 10) - now) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          handleFinishInterview();
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [attemptId]);

  // Repeat Question Aloud
  const handleRepeatQuestion = () => {
    if (!currentQuestion || !synthRef.current) return;
    clearSilenceTimers();
    synthRef.current.cancel();
    const text = currentQuestion.spokenText || currentQuestion.question;
    const utterance = new SpeechSynthesisUtterance("Let me repeat the question: " + text);
    synthRef.current.speak(utterance);
  };

  // 5. Submit Candidate Answer & Fetch Next Question
  const handleAnswerSubmit = async (forcedAnswer = null) => {
    if (speechEndTimerRef.current) clearTimeout(speechEndTimerRef.current);
    clearSilenceTimers();

    const candidateAnswer = (typeof forcedAnswer === 'string' ? forcedAnswer : (typedAnswer.trim() || liveSpokenText.trim()));
    if (!candidateAnswer) {
      setToastMessage({ type: 'warning', text: 'Please speak or type your technical response, or click Skip.' });
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    stopSpeechRecognition();
    if (synthRef.current) synthRef.current.cancel();
    setVoiceState('processing');

    const isSkipped = candidateAnswer.toLowerCase() === 'skip';

    // Add candidate response to live transcript
    const updatedTranscript = [
      ...transcript,
      { sender: 'USER', text: isSkipped ? 'Skipped question' : candidateAnswer, timestamp: new Date().toISOString() }
    ];
    setTranscript(updatedTranscript);

    try {
      const nextIdx = currentQIndex + 1;
      const data = await fetchNextTechnicalQuestion(
        attemptId,
        nextIdx,
        candidateAnswer,
        previousQuestions,
        candidateProfile
      );

      // Save evaluation of answered question
      let nextEvaluations = [...evaluations];
      if (data.evaluation) {
        nextEvaluations = [...evaluations, data.evaluation];
        setEvaluations(nextEvaluations);
      }

      setTypedAnswer('');
      setLiveSpokenText('');

      if (data.isComplete || !data.nextQuestion || nextIdx >= 5) {
        // Interview complete!
        handleFinishInterview(nextEvaluations, updatedTranscript);
      } else {
        setCurrentQIndex(nextIdx);
        setCurrentQuestion(data.nextQuestion);
        setPreviousQuestions(prev => [...prev, data.nextQuestion]);
        setTranscript(prev => [
          ...prev,
          { sender: 'AI', text: data.nextQuestion.spokenText || data.nextQuestion.question, timestamp: new Date().toISOString() }
        ]);

        const evScore = data.evaluation?.score ?? 0;
        setToastMessage({
          type: evScore > 0 ? 'success' : 'info',
          text: isSkipped ? 'Question Skipped (0 marks). Loading Next Question...' : `✓ Response Analyzed (Score: ${evScore}/100). Next Question Loaded.`
        });
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.error('[ANSWER SUBMIT ERROR]:', err);
      setVoiceState('your_turn');
    }
  };

  // 6. Complete Round 3 & Transition to Round 4 (HR)
  const handleFinishInterview = async (finalEvaluations = evaluations, finalTranscript = transcript) => {
    stopSpeechRecognition();
    clearSilenceTimers();
    if (synthRef.current) synthRef.current.cancel();

    setToastMessage({
      type: 'success',
      text: '✓ Technical Round Completed! Advancing to Round 4: AI HR / Behavioral Interview...'
    });

    try {
      await submitTechnicalInterview(attemptId, finalEvaluations, finalTranscript);
    } catch {}

    setTimeout(() => {
      if (onNavigate) onNavigate('interview-hr');
    }, 1800);
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (!isAccessible) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#10141D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{
          maxWidth: '520px',
          backgroundColor: '#181F2C',
          borderRadius: '14px',
          border: '1.5px solid #2B384E',
          padding: '2rem',
          textAlign: 'center',
          color: '#FFFFFF'
        }}>
          <ShieldAlert size={48} color="#EF4444" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Round 3 (Technical Interview) Locked
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            You must complete and submit <strong>Round 1 (Aptitude)</strong> and <strong>Round 2 (Coding)</strong> before beginning the AI Technical Interview.
          </p>
          <button
            onClick={() => onNavigate && onNavigate('interview-coding')}
            style={{
              backgroundColor: '#0D9488',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '0.7rem 1.4rem',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            ← Return to Round 2 (Coding)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#0B0F17',
      minHeight: '100vh',
      color: '#FFFFFF',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 10000,
          backgroundColor: toastMessage.type === 'success' ? '#065F46' : toastMessage.type === 'warning' ? '#92400E' : '#1E293B',
          color: '#FFFFFF',
          padding: '0.65rem 1.2rem',
          borderRadius: '8px',
          fontSize: '0.84rem',
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {toastMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* =========================================================================
          1. TOP APP BAR & 4-ROUND STEPPER (Matches Aptitude & Reference Image)
          ========================================================================= */}
      <header style={{
        backgroundColor: '#111723',
        borderBottom: '1px solid #1E293B',
        padding: '0.55rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        {/* Left: Brand Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#0D9488',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 900
          }}>
            PV
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#FFFFFF', lineHeight: 1.1 }}>
              ProfessorVirus
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600 }}>
              Study Smart. Prepare Better.
            </div>
          </div>
        </div>

        {/* Center: Stepper (Aptitude ✓ -> Coding ✓ -> Technical ACTIVE -> HR Locked) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          backgroundColor: '#182234',
          padding: '0.3rem 0.8rem',
          borderRadius: '9999px',
          border: '1px solid #22324C'
        }}>
          {/* Aptitude Completed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: 0.75 }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>
              <Check size={11} strokeWidth={3} color="#FFFFFF" />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E2E8F0' }}>Aptitude</span>
          </div>

          <span style={{ color: '#475569', fontSize: '0.8rem' }}>→</span>

          {/* Coding Completed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: 0.75 }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>
              <Check size={11} strokeWidth={3} color="#FFFFFF" />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E2E8F0' }}>Coding</span>
          </div>

          <span style={{ color: '#475569', fontSize: '0.8rem' }}>→</span>

          {/* Technical ACTIVE */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: '#0F766E',
            padding: '0.15rem 0.6rem',
            borderRadius: '9999px'
          }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#14B8A6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 900, color: '#FFFFFF' }}>
              3
            </div>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#FFFFFF' }}>AI Technical (Active)</span>
          </div>

          <span style={{ color: '#475569', fontSize: '0.8rem' }}>→</span>

          {/* HR Locked */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: 0.45 }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 800 }}>
              4
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8' }}>AI HR</span>
          </div>
        </div>

        {/* Right: Technical Round Badge + Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Round Indicator with Progress Dots (Exact Match to Reference Image) */}
          <div style={{
            backgroundColor: '#1E293B',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '0.25rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38BDF8' }}>
              Technical Round
            </span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {[0, 1, 2, 3, 4].map(idx => (
                <div
                  key={idx}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: idx <= currentQIndex ? '#2DD4BF' : '#475569',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Timer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#182234',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '0.25rem 0.65rem',
            color: timeLeft < 300 ? '#EF4444' : '#F8FAFC'
          }}>
            <Clock size={14} color="#38BDF8" />
            <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.88rem' }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. MAIN AI INTERVIEW ROOM (REFERENCE IMAGE 1 AS PERMANENT VISUAL IDENTITY)
          ========================================================================= */}
      <main style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '0.85rem 1rem 1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}>
        {/* Virtual Room Stage Card */}
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#0F172A',
          border: '1.5px solid #283548',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          minHeight: '520px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%), url('/assets/interviewer_technical_full.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>

          {/* Top Overlay Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '1.25rem',
            zIndex: 10,
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            {/* Top-Left Interviewer Card with Character Avatar & Speaking Glow */}
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.90)',
              backdropFilter: 'blur(10px)',
              border: voiceState === 'ai_speaking' ? '1.5px solid #2DD4BF' : '1px solid rgba(45, 212, 191, 0.3)',
              borderRadius: '12px',
              padding: '0.55rem 0.95rem',
              boxShadow: voiceState === 'ai_speaking' ? '0 0 20px rgba(45, 212, 191, 0.35)' : '0 8px 24px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: voiceState === 'ai_speaking' ? '2.5px solid #2DD4BF' : '2px solid rgba(45, 212, 191, 0.4)',
                boxShadow: voiceState === 'ai_speaking' ? '0 0 12px #2DD4BF' : 'none',
                position: 'relative',
                flexShrink: 0
              }}>
                <img
                  src="/assets/interviewer_tech_character.jpg"
                  alt="AI Technical Interviewer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ fontSize: '0.96rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                    AI Technical Interviewer
                  </span>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: voiceState === 'ai_speaking' ? '#2DD4BF' : '#10B981',
                    boxShadow: voiceState === 'ai_speaking' ? '0 0 8px #2DD4BF' : '0 0 8px #10B981'
                  }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>
                  Resume &amp; Domain Based Technical Interview
                </div>
              </div>
            </div>

            {/* Top-Right Interview Focus Card (Grounded in Candidate Resume) */}
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.90)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '12px',
              padding: '0.65rem 0.95rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              maxWidth: '300px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  Resume Deep-Dive Focus
                </span>
                <span style={{ fontSize: '0.62rem', backgroundColor: 'rgba(45, 212, 191, 0.15)', color: '#2DD4BF', padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: 800 }}>
                  Active
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.72rem', color: '#CBD5E1', fontWeight: 600 }}>
                {candidateProfile.projects && candidateProfile.projects.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Briefcase size={13} color="#2DD4BF" style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Project: <strong style={{ color: '#F1F5F9' }}>{candidateProfile.projects[0].title || candidateProfile.projects[0]}</strong>
                    </span>
                  </div>
                )}
                {candidateProfile.skills && candidateProfile.skills.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Cpu size={13} color="#2DD4BF" style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Skills: <strong style={{ color: '#F1F5F9' }}>{candidateProfile.skills.slice(0, 3).join(', ')}</strong>
                    </span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <ShieldCheck size={13} color="#2DD4BF" style={{ flexShrink: 0 }} />
                  <span>Architecture, Trade-offs &amp; 100k Scaling</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <GitBranch size={13} color="#2DD4BF" style={{ flexShrink: 0 }} />
                  <span>Adaptive Dynamic Follow-ups</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Speech Bubble with Current Question & Conversational Follow-up */}
          <div style={{
            padding: '0 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            maxWidth: '720px',
            zIndex: 10
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              borderRadius: '18px',
              padding: '1.15rem 1.4rem',
              boxShadow: '0 16px 36px rgba(0,0,0,0.4)',
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
              animation: 'fadeIn 0.3s ease-out',
              border: '2px solid rgba(45, 212, 191, 0.4)'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#E6FFFA',
                color: '#0D9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Volume2 size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#0D9488', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
                  Question {currentQIndex + 1} of 5: {currentQuestion?.title || 'Technical Challenge'}
                </div>
                {currentQuestion?.conversationalAck && (
                  <div style={{
                    fontSize: '0.86rem',
                    fontStyle: 'italic',
                    color: '#0F766E',
                    marginBottom: '0.4rem',
                    fontWeight: 600,
                    lineHeight: 1.4,
                    borderLeft: '2.5px solid #14B8A6',
                    paddingLeft: '0.55rem'
                  }}>
                    "{currentQuestion.conversationalAck}"
                  </div>
                )}
                <p style={{
                  margin: 0,
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  lineHeight: 1.45,
                  color: '#0F172A'
                }}>
                  {currentQuestion?.question || 'Preparing your tailored technical challenge...'}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Overlay: State Indicator Pill + Control Dock */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '1.25rem',
            zIndex: 10,
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {/* Live State Indicator Pill (Cyan Glow & Equalizer) */}
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(10px)',
              border: voiceState === 'ai_speaking' ? '1.5px solid #2DD4BF' : voiceState === 'listening' ? '1.5px solid #38BDF8' : '1.5px solid #475569',
              borderRadius: '9999px',
              padding: '0.45rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              boxShadow: voiceState === 'ai_speaking' ? '0 0 16px rgba(45, 212, 191, 0.4)' : '0 4px 16px rgba(0,0,0,0.3)',
              transition: 'all 0.25s ease'
            }}>
              {/* Equalizer animation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '16px' }}>
                <span className="equalizer-bar" style={{ animationDelay: '0s' }} />
                <span className="equalizer-bar" style={{ animationDelay: '0.15s' }} />
                <span className="equalizer-bar" style={{ animationDelay: '0.3s' }} />
                <span className="equalizer-bar" style={{ animationDelay: '0.45s' }} />
              </div>

              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF' }}>
                {voiceState === 'ai_speaking' && 'AI is speaking...'}
                {voiceState === 'listening' && 'Listening to your answer...'}
                {voiceState === 'processing' && 'Processing & evaluating answer...'}
                {voiceState === 'your_turn' && 'Your turn to answer'}
              </span>
            </div>

            {/* Bottom Dock Control Bar (Matches Reference Image) */}
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              padding: '0.45rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              boxShadow: '0 12px 32px rgba(0,0,0,0.45)'
            }}>
              {/* Mute Toggle */}
              <button
                type="button"
                onClick={toggleMic}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isMicMuted ? '#EF4444' : '#E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: isMicMuted ? '#7F1D1D' : '#1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}>
                  {isMicMuted ? <MicOff size={16} /> : <Mic size={16} />}
                </div>
                <span>{isMicMuted ? 'Unmute' : 'Mute'}</span>
              </button>

              {/* Camera Toggle */}
              <button
                type="button"
                onClick={() => setIsCameraActive(prev => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: !isCameraActive ? '#EF4444' : '#E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: !isCameraActive ? '#7F1D1D' : '#1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}>
                  {isCameraActive ? <Video size={16} /> : <VideoOff size={16} />}
                </div>
                <span>Camera</span>
              </button>

              {/* End Interview (Prominent Red Button) */}
              <button
                type="button"
                onClick={() => setIsEndModalOpen(true)}
                style={{
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.45rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.45)',
                  transition: 'all 0.15s ease'
                }}
              >
                <LogOut size={15} />
                <span>End Interview</span>
              </button>

              {/* Settings Toggle */}
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Settings size={16} />
                </div>
                <span>Settings</span>
              </button>

              {/* Chat / Transcript Toggle */}
              <button
                type="button"
                onClick={() => setIsChatDrawerOpen(prev => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isChatDrawerOpen ? '#38BDF8' : '#E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: isChatDrawerOpen ? 'rgba(56, 189, 248, 0.2)' : '#1E293B',
                  border: isChatDrawerOpen ? '1px solid #38BDF8' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MessageSquare size={16} />
                </div>
                <span>Transcript</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. INTERACTIVE RESPONSE WORKBENCH (Voice Transcription + Manual Editor)
            ========================================================================= */}
        <section style={{
          backgroundColor: '#111723',
          border: '1.5px solid #1E293B',
          borderRadius: '14px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #1E293B',
            paddingBottom: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F8FAFC' }}>
                Your Technical Response
              </span>
              <span style={{
                backgroundColor: isMicMuted ? '#7F1D1D' : '#064E3B',
                color: isMicMuted ? '#FCA5A5' : '#6EE7B7',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '0.12rem 0.5rem',
                borderRadius: '9999px'
              }}>
                {isMicMuted ? 'Mic Muted (Type Response)' : 'Live Speech-to-Text Active'}
              </span>
            </div>

            <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
              Question {currentQIndex + 1} of 5 • Adaptive Technical Grilling
            </div>
          </div>

          {/* Candidate Response Textarea (Pre-filled with spoken audio transcription) */}
          <div style={{ position: 'relative' }}>
            <textarea
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              placeholder="Speak naturally into your microphone or type your technical solution here (e.g. explain token rotation, database indexing, caching strategies, or architectural trade-offs)..."
              style={{
                width: '100%',
                height: '95px',
                backgroundColor: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                color: '#F8FAFC',
                fontSize: '0.84rem',
                lineHeight: 1.5,
                outline: 'none',
                resize: 'none',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            />

            {liveSpokenText && (
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '12px',
                fontSize: '0.7rem',
                color: '#2DD4BF',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <Sparkles size={12} />
                <span>Audio transcribed live</span>
              </div>
            )}
          </div>

          {/* Silence Handling Badge */}
          {silenceState !== 'none' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: silenceState === 'repeat_prompt' ? 'rgba(217, 119, 6, 0.15)' : 'rgba(56, 189, 248, 0.12)',
              border: silenceState === 'repeat_prompt' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.78rem',
              color: silenceState === 'repeat_prompt' ? '#FCD34D' : '#7DD3FC'
            }}>
              <span>
                {silenceState === 'take_your_time' && '⏳ Take your time. Formulate your thoughts and speak when ready.'}
                {silenceState === 'repeat_prompt' && '❓ Would you like me to repeat the question? Click Repeat or Skip.'}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleRepeatQuestion}
                  style={{
                    backgroundColor: '#1E293B',
                    color: '#38BDF8',
                    border: '1px solid #38BDF8',
                    borderRadius: '6px',
                    padding: '0.2rem 0.6rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Repeat Question
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswerSubmit('skip')}
                  style={{
                    backgroundColor: '#7F1D1D',
                    color: '#FCA5A5',
                    border: '1px solid #EF4444',
                    borderRadius: '6px',
                    padding: '0.2rem 0.6rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Skip Question
                </button>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              Tip: Provide concrete technical examples, name specific algorithms, protocols, or trade-offs.
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={handleRepeatQuestion}
                style={{
                  backgroundColor: '#1E293B',
                  color: '#94A3B8',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '0.55rem 0.95rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Repeat
              </button>

              <button
                type="button"
                onClick={() => handleAnswerSubmit('skip')}
                style={{
                  backgroundColor: '#1E293B',
                  color: '#F87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '0.55rem 0.95rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Skip (0 marks)
              </button>

              <button
                type="button"
                onClick={() => handleAnswerSubmit()}
                disabled={voiceState === 'processing'}
                style={{
                  backgroundColor: '#0D9488',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.55rem 1.4rem',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: voiceState === 'processing' ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 14px rgba(13, 148, 136, 0.4)'
                }}
              >
                <Send size={14} />
                <span>{voiceState === 'processing' ? 'Analyzing...' : 'Done Answering →'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. TRANSCRIPT DRAWER / POPUP
            ========================================================================= */}
        {isChatDrawerOpen && (
          <aside style={{
            backgroundColor: '#111723',
            border: '1.5px solid #1E293B',
            borderRadius: '14px',
            padding: '1rem',
            maxHeight: '260px',
            overflowY: 'auto'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38BDF8', marginBottom: '0.65rem' }}>
              Live Voice & Response Transcript
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {transcript.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: item.sender === 'AI' ? 'rgba(15, 118, 110, 0.15)' : 'rgba(51, 65, 85, 0.35)',
                    border: item.sender === 'AI' ? '1px solid rgba(20, 184, 166, 0.3)' : '1px solid #334155',
                    borderRadius: '8px',
                    padding: '0.55rem 0.85rem'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: item.sender === 'AI' ? '#2DD4BF' : '#94A3B8', marginBottom: '0.15rem' }}>
                    {item.sender === 'AI' ? 'AI Technical Interviewer' : 'Candidate'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#F8FAFC', lineHeight: 1.4 }}>
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </main>

      {/* =========================================================================
          5. END INTERVIEW CONFIRMATION MODAL
          ========================================================================= */}
      {isEndModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#111723',
            border: '1.5px solid #2B384E',
            borderRadius: '16px',
            maxWidth: '460px',
            width: '100%',
            padding: '1.5rem',
            color: '#FFFFFF'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 0.5rem 0' }}>
              End Technical Interview?
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#94A3B8', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              Ending this round will finalize your technical evaluations and immediately advance you to <strong>Round 4: AI HR / Behavioral Interview</strong>.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => setIsEndModalOpen(false)}
                style={{
                  backgroundColor: '#1E293B',
                  color: '#CBD5E1',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.55rem 1.15rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Continue Interview
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEndModalOpen(false);
                  handleFinishInterview();
                }}
                style={{
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Yes, End & Proceed to HR →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#111723',
            border: '1.5px solid #2B384E',
            borderRadius: '16px',
            maxWidth: '420px',
            width: '100%',
            padding: '1.5rem',
            color: '#FFFFFF'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '1rem' }}>
              Interview Audio & AI Settings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.82rem', color: '#94A3B8' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#E2E8F0', marginBottom: '0.35rem' }}>
                  AI Voice Speed
                </label>
                <select
                  defaultValue="1.0"
                  onChange={(e) => {
                    const rate = parseFloat(e.target.value);
                    if (synthRef.current) {
                      // Adjust voice rate
                    }
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    padding: '0.45rem',
                    color: '#FFFFFF'
                  }}
                >
                  <option value="0.85">0.85x (Slower)</option>
                  <option value="1.0">1.0x (Normal)</option>
                  <option value="1.15">1.15x (Faster)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#E2E8F0', marginBottom: '0.35rem' }}>
                  Microphone Input
                </label>
                <div style={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '6px', padding: '0.45rem', color: '#2DD4BF' }}>
                  Default Web Audio Microphone (Active)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                style={{
                  backgroundColor: '#0D9488',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1.2rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Equalizer animation CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceEqualizer {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        .equalizer-bar {
          display: inline-block;
          width: 3px;
          height: 12px;
          background-color: #2DD4BF;
          border-radius: 9999px;
          animation: bounceEqualizer 0.8s ease-in-out infinite;
        }
      `}</style>

      {/* Universal Webcam Proctor Monitor with Mic Disconnect Monitoring */}
      <InterviewProctorMonitor
        attemptId={attemptId}
        roundName="AI Technical"
        checkMic={true}
        position="bottom-right"
      />
    </div>
  );
}
