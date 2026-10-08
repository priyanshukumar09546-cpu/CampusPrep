// ============================================================================
// PROFESSORVIRUS — INTERVIEW PRO: ROUND 4 (AI HR & BEHAVIORAL INTERVIEWER)
// Permanent Visual Reference: REFERENCE IMAGE 2 (AI HR / Behavioral Interviewer)
//
// Key Features:
// 1. CHARACTER CONSISTENCY: High-fidelity room and portrait from Reference Image 2
// 2. DYNAMIC BEHAVIORAL QUESTIONS: Teamwork, Conflict, Pressure, Adaptability, Leadership
// 3. ADAPTIVE QUESTIONING: Follow-ups adapt based on candidate's previous response
// 4. FULL VOICE INTERACTION: Speech synthesis (AI speaks) + Speech recognition (User speaks)
// 5. LIVE STATES: AI is speaking..., Listening..., Processing answer..., Your turn...
// 6. QUESTION-LEVEL SCORING: Evaluates communication, reasoning, ownership, competencies
// 7. TRANSCRIPT PERSISTENCE: Records dialogue to attempt state
// 8. FINAL ROUND COMPLETION: Transitions to Comprehensive Final Performance Report
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Bot,
  FileText,
  Code,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Volume2,
  Check,
  Award,
  HelpCircle,
  Star,
  Brain,
  Cpu,
  RefreshCw,
  LogOut,
  Settings,
  Send
} from 'lucide-react';
import {
  getActiveAttemptId,
  getCurrentUserId,
  getAttemptState,
  isRoundAccessible,
  completeRound,
  fetchNextHrQuestion,
  submitHrInterview
} from '../utils/interviewSessionManager';
import InterviewProctorMonitor from '../components/InterviewProctorMonitor';

export default function InterviewHrPage({ onNavigate, onOpenAuth }) {
  const attemptId = getActiveAttemptId();
  const userId = getCurrentUserId();
  const isAccessible = isRoundAccessible('hr', attemptId);

  // Candidate Profile
  const [candidateProfile] = useState(() => {
    try {
      const raw = sessionStorage.getItem('interview_pro_active_test');
      if (raw) return JSON.parse(raw);
    } catch {}
    return { targetRole: 'Software Engineer', domain: 'Engineering' };
  });

  // Questions & Flow State
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

  // 15-Minute Persistent Countdown Timer
  const [timeLeft, setTimeLeft] = useState(() => {
    const timerKey = `interview_pro_hr_timer_end_${attemptId}`;
    const savedEnd = localStorage.getItem(timerKey);
    const now = Date.now();
    if (savedEnd) {
      const end = parseInt(savedEnd, 10);
      if (end > now) return Math.floor((end - now) / 1000);
    }
    const newEnd = now + 15 * 60 * 1000;
    localStorage.setItem(timerKey, String(newEnd));
    return 15 * 60;
  });

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
    silenceTimer1Ref.current = setTimeout(() => {
      setSilenceState('take_your_time');
      silenceTimer2Ref.current = setTimeout(() => {
        setSilenceState('repeat_prompt');
      }, 12000);
    }, 10000);
  };

  // Security Gate: Ensure round is accessible and devices are verified
  useEffect(() => {
    if (!isRoundAccessible('hr', attemptId)) {
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
        const data = await fetchNextHrQuestion(attemptId, 0, '', []);
        if (isMounted && data && data.nextQuestion) {
          setCurrentQuestion(data.nextQuestion);
          setPreviousQuestions([data.nextQuestion]);
          setTranscript([
            { sender: 'AI', text: data.nextQuestion.spokenText || data.nextQuestion.question, timestamp: new Date().toISOString() }
          ]);
        }
      } catch (err) {
        console.error('[HR PAGE] Load error:', err);
      }
    }
    loadFirstQuestion();
    return () => { isMounted = false; };
  }, [attemptId]);

  // 2. Text-to-Speech: AI speaks HR question aloud with friendly, professional female voice
  useEffect(() => {
    const textToSpeak = currentQuestion?.spokenText || currentQuestion?.question;
    if (!textToSpeak || !synthRef.current) return;

    // Stop recognition while AI is speaking so microphone doesn't capture AI audio
    stopSpeechRecognition();
    clearSilenceTimers();
    synthRef.current.cancel();
    setVoiceState('ai_speaking');

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.98;
    utterance.pitch = 1.05; // Friendly, warm female tone

    const voices = synthRef.current.getVoices ? synthRef.current.getVoices() : [];
    const femaleVoice = voices.find(v => (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Victoria')) && v.lang.startsWith('en')) || voices[0];
    if (femaleVoice) utterance.voice = femaleVoice;

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

      recognition.onerror = () => {
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
    const timerKey = `interview_pro_hr_timer_end_${attemptId}`;
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
    const utterance = new SpeechSynthesisUtterance("Let me repeat the scenario: " + text);
    synthRef.current.speak(utterance);
  };

  // 5. Submit Candidate Answer & Fetch Next Question
  const handleAnswerSubmit = async (forcedAnswer = null) => {
    if (speechEndTimerRef.current) clearTimeout(speechEndTimerRef.current);
    clearSilenceTimers();

    const candidateAnswer = (typeof forcedAnswer === 'string' ? forcedAnswer : (typedAnswer.trim() || liveSpokenText.trim()));
    if (!candidateAnswer) {
      setToastMessage({ type: 'warning', text: 'Please speak or type your behavioral response, or click Skip.' });
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    stopSpeechRecognition();
    if (synthRef.current) synthRef.current.cancel();
    setVoiceState('processing');

    const isSkipped = candidateAnswer.toLowerCase() === 'skip';

    const updatedTranscript = [
      ...transcript,
      { sender: 'USER', text: isSkipped ? 'Skipped question' : candidateAnswer, timestamp: new Date().toISOString() }
    ];
    setTranscript(updatedTranscript);

    try {
      const nextIdx = currentQIndex + 1;
      const data = await fetchNextHrQuestion(
        attemptId,
        nextIdx,
        candidateAnswer,
        previousQuestions
      );

      let nextEvaluations = [...evaluations];
      if (data.evaluation) {
        nextEvaluations = [...evaluations, data.evaluation];
        setEvaluations(nextEvaluations);
      }

      setTypedAnswer('');
      setLiveSpokenText('');

      if (data.isComplete || !data.nextQuestion || nextIdx >= 5) {
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
          text: isSkipped ? 'Question Skipped (0 marks). Loading Next Question...' : `✓ Response Evaluated (Score: ${evScore}/100). Next Question Loaded.`
        });
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.error('[HR ANSWER SUBMIT ERROR]:', err);
      setVoiceState('your_turn');
    }
  };

  // 6. Complete Round 4 & Transition to Final Report
  const handleFinishInterview = async (finalEvaluations = evaluations, finalTranscript = transcript) => {
    stopSpeechRecognition();
    clearSilenceTimers();
    if (synthRef.current) synthRef.current.cancel();

    setToastMessage({
      type: 'success',
      text: '✓ All 4 Rounds Completed! Compiling comprehensive performance report...'
    });

    try {
      await submitHrInterview(attemptId, finalEvaluations, finalTranscript);
    } catch {}

    setTimeout(() => {
      if (onNavigate) onNavigate('interview-report');
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
        backgroundColor: '#160E18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{
          maxWidth: '520px',
          backgroundColor: '#201524',
          borderRadius: '14px',
          border: '1.5px solid #3F2948',
          padding: '2rem',
          textAlign: 'center',
          color: '#FFFFFF'
        }}>
          <ShieldAlert size={48} color="#EF4444" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Round 4 (HR Interview) Locked
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            You must complete <strong>Round 3 (AI Technical Interview)</strong> before you can enter the HR / Behavioral Interview.
          </p>
          <button
            onClick={() => onNavigate && onNavigate('interview-technical')}
            style={{
              backgroundColor: '#DB2777',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '0.7rem 1.4rem',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            ← Return to Round 3 (Technical)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#120B15',
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
          backgroundColor: toastMessage.type === 'success' ? '#065F46' : toastMessage.type === 'warning' ? '#92400E' : '#831843',
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
          1. TOP APP BAR & 4-ROUND STEPPER
          ========================================================================= */}
      <header style={{
        backgroundColor: '#1B1020',
        borderBottom: '1px solid #2D1A35',
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
            backgroundColor: '#DB2777',
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
            <div style={{ fontSize: '0.68rem', color: '#F472B6', fontWeight: 600 }}>
              Study Smart. Prepare Better.
            </div>
          </div>
        </div>

        {/* Center: Stepper (Aptitude ✓ -> Coding ✓ -> Technical ✓ -> HR ACTIVE) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          backgroundColor: '#231529',
          padding: '0.3rem 0.8rem',
          borderRadius: '9999px',
          border: '1px solid #3B2345'
        }}>
          {/* Aptitude Completed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: 0.75 }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>
              <Check size={11} strokeWidth={3} color="#FFFFFF" />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E2E8F0' }}>Aptitude</span>
          </div>

          <span style={{ color: '#64748B', fontSize: '0.8rem' }}>→</span>

          {/* Coding Completed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: 0.75 }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>
              <Check size={11} strokeWidth={3} color="#FFFFFF" />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E2E8F0' }}>Coding</span>
          </div>

          <span style={{ color: '#64748B', fontSize: '0.8rem' }}>→</span>

          {/* Technical Completed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', opacity: 0.75 }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>
              <Check size={11} strokeWidth={3} color="#FFFFFF" />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E2E8F0' }}>AI Technical</span>
          </div>

          <span style={{ color: '#64748B', fontSize: '0.8rem' }}>→</span>

          {/* HR ACTIVE */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: '#BE185D',
            padding: '0.15rem 0.6rem',
            borderRadius: '9999px'
          }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#F43F5E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 900, color: '#FFFFFF' }}>
              4
            </div>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#FFFFFF' }}>AI HR (Active)</span>
          </div>
        </div>

        {/* Right: HR Round Badge + Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Round Indicator with Progress Dots (Exact Match to Reference Image 2) */}
          <div style={{
            backgroundColor: '#26162D',
            border: '1px solid #482955',
            borderRadius: '8px',
            padding: '0.25rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F472B6' }}>
              HR Round
            </span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {[0, 1, 2, 3, 4].map(idx => (
                <div
                  key={idx}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: idx <= currentQIndex ? '#F43F5E' : '#573366',
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
            backgroundColor: '#26162D',
            border: '1px solid #482955',
            borderRadius: '8px',
            padding: '0.25rem 0.65rem',
            color: timeLeft < 180 ? '#EF4444' : '#FDF2F8'
          }}>
            <Clock size={14} color="#F472B6" />
            <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.88rem' }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. MAIN AI INTERVIEW ROOM (REFERENCE IMAGE 2 AS PERMANENT VISUAL IDENTITY)
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
          backgroundColor: '#1E1224',
          border: '1.5px solid #3F234A',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          minHeight: '520px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundImage: `linear-gradient(180deg, rgba(22, 14, 24, 0.4) 0%, rgba(22, 14, 24, 0.8) 100%), url('/assets/interviewer_hr_full.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>

          {/* Top Overlay Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '1.25rem',
            zIndex: 10
          }}>
            {/* Top-Left Interviewer Card (Matches Reference Image 2) */}
            <div style={{
              backgroundColor: 'rgba(26, 16, 30, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              borderRadius: '12px',
              padding: '0.55rem 0.95rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(219, 39, 119, 0.15)',
                border: '1px solid #DB2777',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F472B6'
              }}>
                <Users size={20} strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ fontSize: '0.96rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                    AI HR / Behavioral Interviewer
                  </span>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 8px #10B981'
                  }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: '#F9A8D4', fontWeight: 600 }}>
                  Personality, Behavior & Situational Interview
                </div>
              </div>
            </div>

            {/* Top-Right Evaluation Focus Card (Matches Reference Image 2) */}
            <div style={{
              backgroundColor: 'rgba(26, 16, 30, 0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(244, 114, 182, 0.25)',
              borderRadius: '12px',
              padding: '0.7rem 1rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              width: '210px'
            }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#F472B6', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Evaluation Focus
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.72rem', color: '#FCE7F3', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <MessageSquare size={13} color="#F472B6" />
                  <span>Communication Skills</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Cpu size={13} color="#F472B6" />
                  <span>Problem Solving</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Users size={13} color="#F472B6" />
                  <span>Teamwork & Leadership</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Brain size={13} color="#F472B6" />
                  <span>Critical Thinking</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <RefreshCw size={13} color="#F472B6" />
                  <span>Adaptability</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Award size={13} color="#F472B6" />
                  <span>Professional Behavior</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Speech Bubble with Current Question (Matches Reference Image 2) */}
          <div style={{
            padding: '0 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            maxWidth: '680px',
            zIndex: 10
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              color: '#1E1224',
              borderRadius: '18px',
              padding: '1.15rem 1.4rem',
              boxShadow: '0 16px 36px rgba(0,0,0,0.4)',
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#FDF2F8',
                color: '#DB2777',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Volume2 size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#BE185D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
                  Question {currentQIndex + 1} of 5: {currentQuestion?.title || 'Behavioral Scenario'}
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  lineHeight: 1.45,
                  color: '#1E1224'
                }}>
                  {currentQuestion?.question || 'Preparing your tailored behavioral dilemma...'}
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
            {/* Live State Indicator Pill (Pink/Rose Glow & Equalizer) */}
            <div style={{
              backgroundColor: 'rgba(26, 16, 30, 0.88)',
              backdropFilter: 'blur(10px)',
              border: voiceState === 'ai_speaking' ? '1.5px solid #F43F5E' : voiceState === 'listening' ? '1.5px solid #F472B6' : '1.5px solid #573366',
              borderRadius: '9999px',
              padding: '0.45rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              boxShadow: voiceState === 'ai_speaking' ? '0 0 16px rgba(244, 63, 94, 0.4)' : '0 4px 16px rgba(0,0,0,0.3)',
              transition: 'all 0.25s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '16px' }}>
                <span className="equalizer-bar-hr" style={{ animationDelay: '0s' }} />
                <span className="equalizer-bar-hr" style={{ animationDelay: '0.15s' }} />
                <span className="equalizer-bar-hr" style={{ animationDelay: '0.3s' }} />
                <span className="equalizer-bar-hr" style={{ animationDelay: '0.45s' }} />
              </div>

              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF' }}>
                {voiceState === 'ai_speaking' && 'AI is speaking...'}
                {voiceState === 'listening' && 'Listening...'}
                {voiceState === 'processing' && 'Processing answer...'}
                {voiceState === 'your_turn' && 'Your turn...'}
              </span>
            </div>

            {/* Bottom Dock Control Bar (Matches Reference Image 2) */}
            <div style={{
              backgroundColor: 'rgba(26, 16, 30, 0.92)',
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
                  color: isMicMuted ? '#EF4444' : '#FCE7F3',
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
                  backgroundColor: isMicMuted ? '#831843' : '#331B39',
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
                  color: !isCameraActive ? '#EF4444' : '#FCE7F3',
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
                  backgroundColor: !isCameraActive ? '#831843' : '#331B39',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}>
                  {isCameraActive ? <Video size={16} /> : <VideoOff size={16} />}
                </div>
                <span>Camera</span>
              </button>

              {/* End Interview */}
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

              {/* Settings */}
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FCE7F3',
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
                  backgroundColor: '#331B39',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Settings size={16} />
                </div>
                <span>Settings</span>
              </button>

              {/* Chat / Transcript */}
              <button
                type="button"
                onClick={() => setIsChatDrawerOpen(prev => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isChatDrawerOpen ? '#F472B6' : '#FCE7F3',
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
                  backgroundColor: isChatDrawerOpen ? 'rgba(244, 114, 182, 0.2)' : '#331B39',
                  border: isChatDrawerOpen ? '1px solid #F472B6' : 'none',
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
            3. INTERACTIVE BEHAVIORAL RESPONSE WORKBENCH
            ========================================================================= */}
        <section style={{
          backgroundColor: '#1E1224',
          border: '1.5px solid #381E41',
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
            borderBottom: '1px solid #381E41',
            paddingBottom: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FDF2F8' }}>
                Your Behavioral Response
              </span>
              <span style={{
                backgroundColor: isMicMuted ? '#831843' : '#064E3B',
                color: isMicMuted ? '#FBCFE8' : '#6EE7B7',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '0.12rem 0.5rem',
                borderRadius: '9999px'
              }}>
                {isMicMuted ? 'Mic Muted (Type Response)' : 'Live Speech-to-Text Active'}
              </span>
            </div>

            <div style={{ fontSize: '0.74rem', color: '#F9A8D4' }}>
              Question {currentQIndex + 1} of 5 • STAR Framework Recommended
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <textarea
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              placeholder="Speak naturally into your microphone or structure your behavioral story here (Situation -> Task -> Action -> Result)..."
              style={{
                width: '100%',
                height: '95px',
                backgroundColor: '#160B1B',
                border: '1px solid #4A2855',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                color: '#FDF2F8',
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
                color: '#F472B6',
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
              backgroundColor: silenceState === 'repeat_prompt' ? 'rgba(217, 119, 6, 0.15)' : 'rgba(244, 114, 182, 0.12)',
              border: silenceState === 'repeat_prompt' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(244, 114, 182, 0.3)',
              borderRadius: '8px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.78rem',
              color: silenceState === 'repeat_prompt' ? '#FCD34D' : '#FBCFE8'
            }}>
              <span>
                {silenceState === 'take_your_time' && '⏳ Take your time. Reflect on your experience and share when ready.'}
                {silenceState === 'repeat_prompt' && '❓ Would you like me to repeat the question? Click Repeat or Skip.'}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleRepeatQuestion}
                  style={{
                    backgroundColor: '#2A1731',
                    color: '#F472B6',
                    border: '1px solid #F472B6',
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
              Tip: Emphasize personal ownership, team collaboration, and measurable outcomes.
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={handleRepeatQuestion}
                style={{
                  backgroundColor: '#2A1731',
                  color: '#CBD5E1',
                  border: '1px solid #4A2855',
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
                  backgroundColor: '#2A1731',
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
                  backgroundColor: '#DB2777',
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
                  boxShadow: '0 4px 14px rgba(219, 39, 119, 0.4)'
                }}
              >
                <Send size={14} />
                <span>{voiceState === 'processing' ? 'Evaluating...' : 'Done Answering →'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Live Transcript Drawer */}
        {isChatDrawerOpen && (
          <aside style={{
            backgroundColor: '#1E1224',
            border: '1.5px solid #381E41',
            borderRadius: '14px',
            padding: '1rem',
            maxHeight: '260px',
            overflowY: 'auto'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F472B6', marginBottom: '0.65rem' }}>
              Live Voice & Response Transcript
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {transcript.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: item.sender === 'AI' ? 'rgba(219, 39, 119, 0.15)' : 'rgba(51, 65, 85, 0.35)',
                    border: item.sender === 'AI' ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid #4A2855',
                    borderRadius: '8px',
                    padding: '0.55rem 0.85rem'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: item.sender === 'AI' ? '#F472B6' : '#CBD5E1', marginBottom: '0.15rem' }}>
                    {item.sender === 'AI' ? 'AI HR / Behavioral Interviewer' : 'Candidate'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#FDF2F8', lineHeight: 1.4 }}>
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </main>

      {/* End Interview Confirmation Modal */}
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
            backgroundColor: '#1E1224',
            border: '1.5px solid #3F234A',
            borderRadius: '16px',
            maxWidth: '460px',
            width: '100%',
            padding: '1.5rem',
            color: '#FFFFFF'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 0.5rem 0' }}>
              End HR / Behavioral Interview?
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#CBD5E1', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
              This concludes all 4 rounds of Interview Pro. Ending now will compile your complete evaluations into your <strong>Final Comprehensive Performance Report</strong>.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => setIsEndModalOpen(false)}
                style={{
                  backgroundColor: '#331B39',
                  color: '#FCE7F3',
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
                Yes, Finalize All Rounds →
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
            backgroundColor: '#1E1224',
            border: '1.5px solid #3F234A',
            borderRadius: '16px',
            maxWidth: '420px',
            width: '100%',
            padding: '1.5rem',
            color: '#FFFFFF'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '1rem' }}>
              HR Audio & Settings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.82rem', color: '#CBD5E1' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, color: '#FCE7F3', marginBottom: '0.35rem' }}>
                  AI Voice Speed
                </label>
                <select
                  defaultValue="1.0"
                  style={{
                    width: '100%',
                    backgroundColor: '#160B1B',
                    border: '1px solid #4A2855',
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
                <label style={{ display: 'block', fontWeight: 700, color: '#FCE7F3', marginBottom: '0.35rem' }}>
                  Microphone Input
                </label>
                <div style={{ backgroundColor: '#160B1B', border: '1px solid #4A2855', borderRadius: '6px', padding: '0.45rem', color: '#F472B6' }}>
                  Default Web Audio Microphone (Active)
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                style={{
                  backgroundColor: '#DB2777',
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
        @keyframes bounceEqualizerHr {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        .equalizer-bar-hr {
          display: inline-block;
          width: 3px;
          height: 12px;
          background-color: #F43F5E;
          border-radius: 9999px;
          animation: bounceEqualizerHr 0.8s ease-in-out infinite;
        }
      `}</style>

      {/* Universal Webcam Proctor Monitor with Mic Disconnect Monitoring */}
      <InterviewProctorMonitor
        attemptId={attemptId}
        roundName="AI HR"
        checkMic={true}
        position="bottom-right"
      />
    </div>
  );
}
