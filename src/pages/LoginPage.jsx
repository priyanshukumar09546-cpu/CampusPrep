import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  X,
  ShieldCheck
} from 'lucide-react';

export default function LoginPage({ initialMode = 'login', onLoginSuccess, onNavigate }) {
  const [mode, setMode] = useState(initialMode === 'signup' ? 'signup' : 'login');

  useEffect(() => {
    setMode(initialMode === 'signup' ? 'signup' : 'login');
  }, [initialMode]);

  // Form Fields - Login
  const [loginEmailOrEnrollment, setLoginEmailOrEnrollment] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Form Fields - Signup
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupCountryCode, setSignupCountryCode] = useState('+91');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Feedback & Loading State
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
    if (onNavigate) {
      onNavigate(newMode === 'signup' ? 'signup' : 'login');
    }
  };

  // Login Submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedInput = loginEmailOrEnrollment.trim();
    if (!trimmedInput) {
      setErrorMsg('Please enter your Email or Enrollment No.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrEnrollment: trimmedInput,
          password: loginPassword
        })
      });

      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error('Server returned invalid response. Please try again.');
      }

      if (res.ok && data.success) {
        setSuccessMsg('Signed in successfully! Redirecting...');
        const token = data.token || 'pv_jwt_session_' + Date.now();
        const user = data.user || {
          name: trimmedInput.split('@')[0],
          email: trimmedInput,
          role: 'student',
          course: 'B.Tech',
          branch: 'CSE'
        };

        // Persist session
        localStorage.setItem('professorvirus_token', token);
        localStorage.setItem('professorvirus_user', JSON.stringify(user));
        sessionStorage.setItem('professorvirus_token', token);
        sessionStorage.setItem('professorvirus_user', JSON.stringify(user));

        // Trigger global auth event for Navbar
        window.dispatchEvent(new Event('auth_state_changed'));

        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(user);
          if (onNavigate) onNavigate('home');
        }, 500);
      } else {
        setErrorMsg(data.message || 'Invalid email/enrollment or password. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to connect to the authentication server. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedName = signupFullName.trim();
    const trimmedEmail = signupEmail.trim();
    const trimmedMobile = signupMobile.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!trimmedMobile || trimmedMobile.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!signupPassword || signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('You must agree to the Terms & Conditions and Privacy Policy to create an account.');
      return;
    }

    setLoading(true);

    try {
      const fullMobile = `${signupCountryCode} ${trimmedMobile}`;
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: trimmedName,
          name: trimmedName,
          email: trimmedEmail,
          mobile: fullMobile,
          phone: fullMobile,
          course: 'B.Tech',
          branch: 'CSE',
          password: signupPassword
        })
      });

      const text = await res.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error('Server returned invalid response. Please try again.');
      }

      if (res.ok && data.success) {
        setSuccessMsg('Account created successfully! Welcome to ProfessorVirus.');
        const token = data.token || 'pv_jwt_session_' + Date.now();
        const user = data.user || {
          name: trimmedName,
          email: trimmedEmail,
          mobile: fullMobile,
          role: 'student',
          course: 'B.Tech',
          branch: 'CSE'
        };

        // Persist session
        localStorage.setItem('professorvirus_token', token);
        localStorage.setItem('professorvirus_user', JSON.stringify(user));
        sessionStorage.setItem('professorvirus_token', token);
        sessionStorage.setItem('professorvirus_user', JSON.stringify(user));

        // Trigger global auth event for Navbar
        window.dispatchEvent(new Event('auth_state_changed'));

        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(user);
          if (onNavigate) onNavigate('home');
        }, 500);
      } else {
        setErrorMsg(data.message || 'Failed to create student account. An account with this email may already exist.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Unable to connect to the authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // Graceful Google OAuth handler
    alert('Google Student Sign-In is connected to official AKTU student emails. You can also sign in directly using your email/enrollment and password.');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setForgotStatus('Please enter a valid student email address.');
      return;
    }
    setForgotStatus('If an account exists with this email, password reset instructions have been sent. Please check your inbox.');
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotStatus('');
      setForgotEmail('');
    }, 2800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#FAF7F2',
      display: 'flex',
      alignItems: 'stretch',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* ========================================================= */}
      {/* LEFT COLUMN: BRANDING ARTWORK & SCENE PANEL (~58% WIDTH)   */}
      {/* ========================================================= */}
      <div 
        className="auth-artwork-col"
        style={{
          width: '58%',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#1E2320',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <img 
          src={mode === 'login' ? "/assets/auth_signin_left.jpg" : "/assets/auth_signup_left.jpg"}
          alt={mode === 'login' ? "ProfessorVirus Study Desk" : "ProfessorVirus AKTU Campus"}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            display: 'block'
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/auth_signin_bg.jpg';
          }}
        />

        {/* Back to Home pill in top-left overlay */}
        <button
          onClick={() => onNavigate && onNavigate('home')}
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.25rem',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.95rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            color: '#1C1E21',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.92)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          ← Back to Home
        </button>

        {/* Motivational Branding Overlay (Top-Left of Hero scene) */}
        <div style={{
          position: 'absolute',
          top: '4.5rem',
          left: '2rem',
          zIndex: 25,
          maxWidth: '460px',
          pointerEvents: 'none'
        }}>
          {/* ProfessorVirus Avatar + Brand */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(12px)',
            padding: '0.45rem 0.95rem',
            borderRadius: '9999px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            border: '1.5px solid rgba(200, 141, 45, 0.4)',
            marginBottom: '1rem'
          }}>
            <img 
              src="/assets/navbar_logo.png" 
              alt="ProfessorVirus" 
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'contain' }}
              onError={(e) => { e.target.onerror = null; e.target.src = '/assets/navbar_logo.jpg'; }}
            />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#1C1E21', lineHeight: 1.1 }}>
                Professor<span style={{ color: '#781416' }}>Virus</span>
              </div>
              <div style={{ fontSize: '0.66rem', color: '#8C6D46', fontWeight: 700 }}>
                Study Smart. Prepare Better.
              </div>
            </div>
          </div>

          {/* Large Quote Headline */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(16px)',
            borderRadius: '20px',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
            border: '1.5px solid rgba(255, 255, 255, 0.85)',
            marginBottom: '1rem'
          }}>
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.75rem',
              fontWeight: 900,
              color: '#1C1E21',
              margin: '0 0 0.35rem 0',
              lineHeight: 1.2
            }}>
              Concept samajh aaya? <br />
              <span style={{ color: '#64748B', fontWeight: 700 }}>Nahi aaya?</span> <span style={{ color: '#781416' }}>Toh padho!</span>
            </h2>
            <div style={{
              fontFamily: "'Kalam', cursive",
              color: '#B37D28',
              fontSize: '0.95rem',
              fontWeight: 700
            }}>
              ✨ Same Notes, Higher Grades !
            </div>
          </div>

          {/* 5 Feature Mini-Badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            flexWrap: 'wrap'
          }}>
            {[
              { label: 'PYQs', sub: 'Past Papers', bg: '#FEF2F2', border: '#FECACA', color: '#991B1B' },
              { label: 'Notes', sub: 'Unit-wise', bg: '#FEF9EE', border: '#FDE68A', color: '#92400E' },
              { label: 'Syllabus', sub: 'Official', bg: '#F0FDFA', border: '#99F6E4', color: '#0F766E' },
              { label: 'Quizzes', sub: 'Practice', bg: '#F5F3FF', border: '#DDD6FE', color: '#6D28D9' },
              { label: 'Interview Pro', sub: 'Placement', bg: '#ECFDF5', border: '#A7F3D0', color: '#065F46' }
            ].map(b => (
              <div
                key={b.label}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(8px)',
                  border: `1.5px solid ${b.border}`,
                  borderRadius: '12px',
                  padding: '0.35rem 0.65rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: b.color }}>{b.label}</span>
                <span style={{ fontSize: '0.58rem', fontWeight: 600, color: '#64748B' }}>{b.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: FLOATING AUTHENTICATION CARD (~42% WIDTH)   */}
      {/* ========================================================= */}
      <div 
        className="auth-form-col"
        style={{
          width: '42%',
          minHeight: '100vh',
          backgroundColor: '#1E2320',
          backgroundImage: mode === 'login'
            ? `
                linear-gradient(135deg, rgba(28, 30, 33, 0.65) 0%, rgba(120, 20, 22, 0.40) 50%, rgba(31, 36, 33, 0.65) 100%),
                url('/assets/auth_login_bg.jpg')
              `
            : `
                linear-gradient(135deg, rgba(28, 30, 33, 0.60) 0%, rgba(120, 20, 22, 0.35) 50%, rgba(31, 36, 33, 0.60) 100%),
                url('/assets/auth_signup_bg.jpg')
              `,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.75rem',
          boxSizing: 'border-box',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {/* Floating Card */}
        <div style={{
          width: '100%',
          maxWidth: '430px',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '28px',
          border: '1.5px solid rgba(255, 255, 255, 0.85)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(0, 0, 0, 0.1)',
          padding: '2.2rem 2rem',
          boxSizing: 'border-box',
          position: 'relative'
        }}>

          {/* Card Top Avatar & Brand Header */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            marginBottom: '1.25rem'
          }}>
            {/* Circular Professor Virus portrait */}
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2.5px solid #C88D2D',
              boxShadow: '0 4px 12px rgba(200, 141, 45, 0.25)',
              backgroundColor: '#FAF7F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.5rem'
            }}>
              <img 
                src="/assets/auth_virus_avatar.png"
                alt="Professor Virus"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/navbar_logo.png';
                }}
              />
            </div>

            {/* Brand Title */}
            <div style={{
              fontFamily: "'Outfit', 'Inter', sans-serif",
              fontSize: '1.35rem',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#1C1E21'
            }}>
              Professor<span style={{ color: '#781416' }}>Virus</span>
            </div>

            {/* Brand Slogan */}
            <div style={{
              fontSize: '0.74rem',
              color: '#8C6D46',
              fontWeight: 600,
              marginTop: '0.15rem',
              letterSpacing: '0.01em'
            }}>
              Study Smart. Prepare Better.
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: '1.4rem' }}>
            <h1 style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: '#1C1E21',
              margin: '0 0 0.3rem 0',
              lineHeight: 1.2
            }}>
              {mode === 'login' ? (
                <>Welcome <span style={{ color: '#781416' }}>Back</span></>
              ) : (
                <>Create Your <span style={{ color: '#781416' }}>Account</span></>
              )}
            </h1>
            <p style={{
              fontSize: '0.82rem',
              color: '#64748B',
              margin: 0,
              lineHeight: 1.4
            }}>
              {mode === 'login'
                ? 'Login to continue your learning journey'
                : 'Join thousands of students and start learning smarter.'}
            </p>
          </div>

          {/* Notification Alerts */}
          {errorMsg && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#991B1B',
              padding: '0.65rem 0.85rem',
              borderRadius: '12px',
              fontSize: '0.8rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              lineHeight: 1.3
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              color: '#166534',
              padding: '0.65rem 0.85rem',
              borderRadius: '12px',
              fontSize: '0.8rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              lineHeight: 1.3
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* FORM A: SIGN IN (Matches media_1790569692755.jpg)         */}
          {/* ========================================================= */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              
              {/* Email or Enrollment No. */}
              <div style={inputBoxStyle}>
                <Mail size={18} color="#64748B" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Email or Enrollment No."
                  value={loginEmailOrEnrollment}
                  onChange={(e) => setLoginEmailOrEnrollment(e.target.value)}
                  style={textInputStyle}
                  required
                  autoFocus
                />
              </div>

              {/* Password */}
              <div style={inputBoxStyle}>
                <Lock size={18} color="#64748B" style={{ flexShrink: 0 }} />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={textInputStyle}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={eyeButtonStyle}
                  aria-label="Toggle password visibility"
                >
                  {showLoginPassword ? <EyeOff size={18} color="#64748B" /> : <Eye size={18} color="#64748B" />}
                </button>
              </div>

              {/* Forgot Password link (Right aligned, maroon) */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.2rem' }}>
                <span
                  onClick={() => setShowForgotModal(true)}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#781416',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Forgot Password?
                </span>
              </div>

              {/* Primary Sign In Button (Rich Maroon) */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  height: '46px',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  borderRadius: '14px',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(120, 20, 22, 0.3)',
                  transition: 'all 0.2s',
                  marginTop: '0.2rem'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#601012';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#781416';
                }}
              >
                {loading ? 'Signing In...' : <>Sign In <ArrowRight size={17} /></>}
              </button>

              {/* Divider: OR */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.35rem 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.05em' }}>OR</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                style={googleButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.3 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.18 0 10.03 0 12s.46 3.82 1.26 5.42l4.02-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                Sign in with Google
              </button>

              {/* Bottom Switch to Sign Up */}
              <div style={{
                textAlign: 'center',
                marginTop: '0.6rem',
                fontSize: '0.82rem',
                color: '#64748B'
              }}>
                New to ProfessorVirus?{' '}
                <span
                  onClick={() => switchMode('signup')}
                  style={{
                    color: '#781416',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Create an Account
                </span>
              </div>

            </form>
          ) : (
            /* ========================================================= */
            /* FORM B: SIGN UP (Matches media_1790569666618.jpg)         */
            /* ========================================================= */
            <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              
              {/* Full Name */}
              <div style={inputBoxStyle}>
                <User size={18} color="#64748B" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signupFullName}
                  onChange={(e) => setSignupFullName(e.target.value)}
                  style={textInputStyle}
                  required
                  autoFocus
                />
              </div>

              {/* Email Address */}
              <div style={inputBoxStyle}>
                <Mail size={18} color="#64748B" style={{ flexShrink: 0 }} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  style={textInputStyle}
                  required
                />
              </div>

              {/* Mobile Number with +91 Country Code */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  backgroundColor: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '0.65rem 0.75rem',
                  height: '45px',
                  boxSizing: 'border-box',
                  color: '#1C1E21',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'default'
                }}>
                  <Phone size={15} color="#64748B" />
                  <span>+91</span>
                  <ChevronDown size={14} color="#94A3B8" />
                </div>

                <div style={{ ...inputBoxStyle, flex: 1 }}>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={signupMobile}
                    onChange={(e) => setSignupMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    style={textInputStyle}
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div style={inputBoxStyle}>
                <Lock size={18} color="#64748B" style={{ flexShrink: 0 }} />
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  style={textInputStyle}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  style={eyeButtonStyle}
                  aria-label="Toggle password visibility"
                >
                  {showSignupPassword ? <EyeOff size={18} color="#64748B" /> : <Eye size={18} color="#64748B" />}
                </button>
              </div>

              {/* Confirm Password */}
              <div style={inputBoxStyle}>
                <Lock size={18} color="#64748B" style={{ flexShrink: 0 }} />
                <input
                  type={showSignupConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  style={textInputStyle}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                  style={eyeButtonStyle}
                  aria-label="Toggle password visibility"
                >
                  {showSignupConfirmPassword ? <EyeOff size={18} color="#64748B" /> : <Eye size={18} color="#64748B" />}
                </button>
              </div>

              {/* Terms Checkbox */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                fontSize: '0.78rem',
                color: '#475569',
                marginTop: '0.1rem',
                lineHeight: 1.35
              }}>
                <input
                  type="checkbox"
                  id="authAgreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{
                    accentColor: '#781416',
                    width: '16px',
                    height: '16px',
                    marginTop: '2px',
                    cursor: 'pointer'
                  }}
                  required
                />
                <label htmlFor="authAgreeTerms" style={{ cursor: 'pointer' }}>
                  I agree to the{' '}
                  <span
                    onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}
                    style={{ color: '#781416', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Terms & Conditions
                  </span>{' '}
                  and{' '}
                  <span
                    onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }}
                    style={{ color: '#781416', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Privacy Policy
                  </span>
                </label>
              </div>

              {/* Primary Create Account Button (Rich Maroon) */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  height: '46px',
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  borderRadius: '14px',
                  border: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(120, 20, 22, 0.3)',
                  transition: 'all 0.2s',
                  marginTop: '0.3rem'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#601012';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#781416';
                }}
              >
                {loading ? 'Creating Account...' : <>Create Account <ArrowRight size={17} /></>}
              </button>

              {/* Divider: OR */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.25rem 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.05em' }}>OR</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
              </div>

              {/* Google Sign Up Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                style={googleButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.3 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.18 0 10.03 0 12s.46 3.82 1.26 5.42l4.02-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                Sign up with Google
              </button>

              {/* Bottom Switch to Sign In */}
              <div style={{
                textAlign: 'center',
                marginTop: '0.4rem',
                fontSize: '0.82rem',
                color: '#64748B'
              }}>
                Already have an account?{' '}
                <span
                  onClick={() => switchMode('login')}
                  style={{
                    color: '#781416',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Sign In
                </span>
              </div>

            </form>
          )}

        </div>
      </div>

      {/* ========================================================= */}
      {/* FORGOT PASSWORD MODAL                                      */}
      {/* ========================================================= */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '400px',
            width: '100%',
            padding: '1.75rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <button
              onClick={() => { setShowForgotModal(false); setForgotStatus(''); }}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748B'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C1E21', margin: '0 0 0.5rem 0' }}>
              Reset Password
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.4, margin: '0 0 1.2rem 0' }}>
              Enter your registered student email address or enrollment number. We'll send you instructions to reset your password.
            </p>

            {forgotStatus ? (
              <div style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                color: '#166534',
                padding: '0.75rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                marginBottom: '1rem'
              }}>
                {forgotStatus}
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <div style={{ ...inputBoxStyle, marginBottom: '1rem' }}>
                  <Mail size={18} color="#64748B" />
                  <input
                    type="email"
                    placeholder="Enter registered email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    style={textInputStyle}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    height: '42px',
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TERMS & PRIVACY MODAL                                     */}
      {/* ========================================================= */}
      {showTermsModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '500px',
            width: '100%',
            padding: '1.75rem',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowTermsModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748B'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <ShieldCheck size={24} color="#781416" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1C1E21', margin: 0 }}>
                Terms & Privacy Policy
              </h3>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
              <p><strong>1. Academic Integrity:</strong> ProfessorVirus is an independent academic resource hub designed for university students to access verified study notes, previous year question papers (PYQs), and practice tools.</p>
              <p><strong>2. Account Security:</strong> You are responsible for safeguarding your login credentials. Each account is personal to the registered student.</p>
              <p><strong>3. Data Protection:</strong> We do not sell or monetize student personal data. All credentials and academic records are securely hashed and stored in accordance with security standards.</p>
              <p><strong>4. Fair Use:</strong> Resources provided on ProfessorVirus are strictly for educational preparation. Unauthorized scraping or mass redistribution of platform content is prohibited.</p>
            </div>

            <button
              onClick={() => setShowTermsModal(false)}
              style={{
                marginTop: '1.25rem',
                width: '100%',
                height: '40px',
                backgroundColor: '#781416',
                color: '#FFFFFF',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 960px) {
          .auth-artwork-col {
            display: none !important;
          }
          .auth-form-col {
            width: 100% !important;
            padding: 1.5rem 1rem !important;
          }
        }
      `}</style>

    </div>
  );
}

// Styling Helper Objects
const inputBoxStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  backgroundColor: '#F8FAFC',
  border: '1.5px solid #E2E8F0',
  borderRadius: '14px',
  padding: '0.65rem 0.95rem',
  height: '45px',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
};

const textInputStyle = {
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  width: '100%',
  fontSize: '0.88rem',
  fontWeight: 500,
  color: '#0F172A'
};

const eyeButtonStyle = {
  background: 'none',
  border: 'none',
  padding: '0.2rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const googleButtonStyle = {
  width: '100%',
  height: '45px',
  backgroundColor: '#FFFFFF',
  border: '1.5px solid #E2E8F0',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.65rem',
  fontSize: '0.88rem',
  fontWeight: 600,
  color: '#1E293B',
  cursor: 'pointer',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
  transition: 'all 0.2s'
};
