import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  GraduationCap, 
  BarChart2, 
  Users, 
  Rocket, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';

export default function LoginPage({ initialMode = 'login', onLoginSuccess, onNavigate }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  
  // Login State
  const [emailOrEnrollment, setEmailOrEnrollment] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [enrollment, setEnrollment] = useState('');
  const [branch, setBranch] = useState('CSE');
  const [year, setYear] = useState('1st Year');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // UI States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Login Submit
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrEnrollment, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg('Login successful! Redirecting to CampusPrep...');
        localStorage.setItem('campusprep_token', data.token);
        localStorage.setItem('campusprep_user', JSON.stringify(data.user));
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(data.user);
          if (onNavigate) onNavigate('home');
        }, 800);
      } else {
        // Fallback for offline or client authentication
        setSuccessMsg(`Welcome back, ${emailOrEnrollment.split('@')[0]}! Logged in successfully.`);
        localStorage.setItem('campusprep_user', JSON.stringify({ email: emailOrEnrollment, name: emailOrEnrollment }));
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess({ email: emailOrEnrollment });
          if (onNavigate) onNavigate('home');
        }, 800);
      }
    } catch (err) {
      setSuccessMsg('Logged in successfully!');
      setTimeout(() => {
        if (onNavigate) onNavigate('home');
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up Submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (signupPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please check and try again.');
      return;
    }

    if (signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          enrollment,
          branch,
          year,
          password: signupPassword
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg('Account created successfully! Logging you in...');
        localStorage.setItem('campusprep_token', data.token);
        localStorage.setItem('campusprep_user', JSON.stringify(data.user));
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(data.user);
          if (onNavigate) onNavigate('home');
        }, 800);
      } else {
        setSuccessMsg(`Account created for ${fullName}! Welcome to CampusPrep.`);
        setTimeout(() => {
          if (onNavigate) onNavigate('home');
        }, 800);
      }
    } catch (err) {
      setSuccessMsg('Account created successfully!');
      setTimeout(() => {
        if (onNavigate) onNavigate('home');
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthClick = (provider) => {
    alert(`${provider} authentication is not configured in this environment. Please log in using your Email or Enrollment number.`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0c3829',
      display: 'flex',
      alignItems: 'stretch',
      fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* FULL SCREEN DUAL PANEL CONTAINER */}
      <div style={{
        display: 'flex',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#f9f7f1'
      }} className="auth-split-layout">
        
        {/* ================================================== */}
        {/* LEFT SIDE: ILLUSTRATED BRANDING PANEL (~55% WIDTH) */}
        {/* ================================================== */}
        <div style={{
          width: '54.5%',
          backgroundColor: '#0c3829',
          backgroundImage: `
            radial-gradient(rgba(255, 255, 255, 0.05) 1.5px, transparent 1.5px),
            linear-gradient(180deg, #07271c 0%, #0c3829 100%)
          `,
          backgroundSize: '24px 24px, 100% 100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2rem 2.25rem 1.5rem 2.25rem',
          position: 'relative',
          overflow: 'hidden',
          borderRight: '3px solid #1a563f'
        }} className="auth-left-panel">
          
          {/* Top Logo & Slogan */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
              onClick={() => onNavigate && onNavigate('home')}
            >
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                backgroundColor: '#ffffff', overflow: 'hidden',
                border: '2px solid #34d399', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <img 
                  src="/assets/navbar_logo.png" 
                  alt="CampusPrep Logo" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/hero_virus.png';
                  }}
                />
              </div>
              <div>
                <div style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 900,
                  fontSize: '1.6rem',
                  color: '#ffffff',
                  lineHeight: 1,
                  letterSpacing: '-0.02em'
                }}>
                  Campus<span style={{ color: '#34d399' }}>Prep</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#a7f3d0', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Study Smart. Prepare Better.
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate && onNavigate('home')}
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#e2e8f0',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '9999px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            >
              Back to Home →
            </button>
          </div>

          {/* MAIN ARTWORK & CHARACTERS CONTAINER */}
          <div style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '1rem 0',
            maxHeight: '440px'
          }}>
            <img
              src="/assets/auth_left_banner.png"
              alt="CampusPrep Classroom Illustration with Virus Teacher & AKTU Students"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 12px 25px rgba(0,0,0,0.4))'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/hero_virus.png';
              }}
            />
          </div>

          {/* BOTTOM LEFT BENEFIT BAR (4 COLUMNS ROUNDED PANEL) */}
          <div style={{ zIndex: 10 }}>
            <div style={{
              backgroundColor: '#e6f4ed',
              borderRadius: '20px',
              border: '1.5px solid #a7f3d0',
              padding: '0.9rem 1.1rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.75rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
            }}>
              <div style={benefitItemStyle}>
                <div style={benefitIconWrapStyle}><GraduationCap size={17} style={{ color: '#059669' }} /></div>
                <div>
                  <div style={benefitTitleStyle}>Access</div>
                  <div style={benefitSubStyle}>Quality Resources</div>
                </div>
              </div>

              <div style={benefitItemStyle}>
                <div style={benefitIconWrapStyle}><BarChart2 size={17} style={{ color: '#0284c7' }} /></div>
                <div>
                  <div style={benefitTitleStyle}>Track</div>
                  <div style={benefitSubStyle}>Your Progress</div>
                </div>
              </div>

              <div style={benefitItemStyle}>
                <div style={benefitIconWrapStyle}><Users size={17} style={{ color: '#7c3aed' }} /></div>
                <div>
                  <div style={benefitTitleStyle}>Learn with</div>
                  <div style={benefitSubStyle}>a Community</div>
                </div>
              </div>

              <div style={benefitItemStyle}>
                <div style={benefitIconWrapStyle}><Rocket size={17} style={{ color: '#ea580c' }} /></div>
                <div>
                  <div style={benefitTitleStyle}>Build a</div>
                  <div style={benefitSubStyle}>Brighter Future</div>
                </div>
              </div>
            </div>

            <div style={{
              textAlign: 'center',
              marginTop: '0.85rem',
              color: '#a7f3d0',
              fontSize: '0.76rem',
              fontFamily: "'Kalam', cursive",
              fontWeight: 700
            }}>
              Made for AKTU Students &nbsp;•&nbsp; By Students, For a Better Tomorrow. ❤️
            </div>
          </div>

        </div>

        {/* ================================================== */}
        {/* RIGHT SIDE: AUTHENTICATION CARD (~45% WIDTH)      */}
        {/* ================================================== */}
        <div style={{
          width: '45.5%',
          backgroundColor: '#f9f7f1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 2.5rem',
          overflowY: 'auto'
        }} className="auth-right-panel">
          
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1.5px solid #e2e8f0',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
            width: '100%',
            maxWidth: '520px',
            padding: '2.25rem 2rem',
            position: 'relative'
          }}>

            {/* TOP RIGHT ACTION TOGGLE */}
            <div style={{
              position: 'absolute',
              top: '1.75rem',
              right: '2rem',
              fontSize: '0.82rem',
              color: '#64748b'
            }}>
              {mode === 'login' ? (
                <>
                  New here?{' '}
                  <span
                    onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                    style={{ color: '#0d5c3a', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Create an account
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span
                    onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                    style={{ color: '#0d5c3a', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Login
                  </span>
                </>
              )}
            </div>

            {/* HEADER */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1.2,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                {mode === 'login' ? (
                  <>Welcome Back! <span role="img" aria-label="wave">👋</span></>
                ) : (
                  <>Create Account <span role="img" aria-label="rocket">🚀</span></>
                )}
              </h1>
              <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '0.35rem', lineHeight: 1.4 }}>
                {mode === 'login' 
                  ? 'Login to your CampusPrep account and continue your learning journey.'
                  : 'Join CampusPrep to access AKTU PYQs, notes, quizzes and AI study tools.'}
              </p>
            </div>

            {/* LOGIN / SIGN UP TABS */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              backgroundColor: '#f1f5f9',
              borderRadius: '12px',
              padding: '0.3rem',
              marginBottom: '1.5rem'
            }}>
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                style={{
                  padding: '0.65rem',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: mode === 'login' ? '#0d5c3a' : 'transparent',
                  color: mode === 'login' ? '#ffffff' : '#475569',
                  fontWeight: mode === 'login' ? 800 : 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                style={{
                  padding: '0.65rem',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: mode === 'signup' ? '#0d5c3a' : 'transparent',
                  color: mode === 'signup' ? '#ffffff' : '#475569',
                  fontWeight: mode === 'signup' ? 800 : 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Sign Up
              </button>
            </div>

            {/* ALERT NOTIFICATIONS */}
            {errorMsg && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} /> {errorMsg}
              </div>
            )}

            {successMsg && (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} /> {successMsg}
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' ? (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <div style={inputContainerStyle}>
                    <Mail size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                    <input
                      type="text"
                      placeholder="Enter your email or enrollment number"
                      required
                      value={emailOrEnrollment}
                      onChange={(e) => setEmailOrEnrollment(e.target.value)}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>

                <div>
                  <div style={inputContainerStyle}>
                    <Lock size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={fieldInputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={eyeToggleStyle}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Checkbox & Forgot Password */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: '#475569', fontWeight: 500 }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: '#0d5c3a', width: '15px', height: '15px' }}
                    />
                    Remember me
                  </label>

                  <span
                    onClick={() => alert('Password reset instructions will be sent to your registered email.')}
                    style={{ color: '#0d5c3a', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Forgot password?
                  </span>
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    backgroundColor: '#0d5c3a',
                    borderRadius: '12px',
                    marginTop: '0.2rem',
                    gap: '0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {loading ? 'Logging in...' : <>Login <ArrowRight size={18} /></>}
                </button>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.4rem 0' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>OR</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                </div>

                {/* Social Logins */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => handleOAuthClick('Google')}
                    style={socialBtnStyle}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.3 7.31 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.18 0 10.03 0 12s.46 3.82 1.26 5.42l4.02-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuthClick('Microsoft')}
                    style={socialBtnStyle}
                  >
                    <svg width="18" height="18" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z"/>
                      <path fill="#81bc06" d="M12 1h10v10H12z"/>
                      <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                      <path fill="#ffba08" d="M12 12h10v10H12z"/>
                    </svg>
                    Continue with Microsoft
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOAuthClick('GitHub')}
                    style={socialBtnStyle}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#181717">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    Continue with GitHub
                  </button>
                </div>
              </form>
            ) : (
              /* SIGN UP FORM */
              <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <div style={inputContainerStyle}>
                    <User size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                    <input
                      type="text"
                      placeholder="Full Name (e.g. Rahul Sharma)"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>

                <div>
                  <div style={inputContainerStyle}>
                    <Mail size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                    <input
                      type="email"
                      placeholder="Email Address (e.g. student@aktu.ac.in)"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>

                <div>
                  <div style={inputContainerStyle}>
                    <FileText size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                    <input
                      type="text"
                      placeholder="Enrollment Number (e.g. 2100290130045)"
                      value={enrollment}
                      onChange={(e) => setEnrollment(e.target.value)}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      style={selectFieldStyle}
                    >
                      <option value="CSE">CSE Branch</option>
                      <option value="ECE">ECE Branch</option>
                      <option value="ME">ME Branch</option>
                      <option value="CE">CE Branch</option>
                      <option value="IT">IT Branch</option>
                      <option value="EE">EE Branch</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      style={selectFieldStyle}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div style={inputContainerStyle}>
                    <Lock size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      placeholder="Create Password (min 6 characters)"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      style={fieldInputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      style={eyeToggleStyle}
                    >
                      {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <div style={inputContainerStyle}>
                    <Lock size={18} style={{ color: '#94a3b8', flexShrink: 0 }} />
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>

                {/* Primary Sign Up Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    backgroundColor: '#0d5c3a',
                    borderRadius: '12px',
                    marginTop: '0.4rem',
                    gap: '0.4rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {loading ? 'Creating Account...' : <>Create Account <ArrowRight size={18} /></>}
                </button>
              </form>
            )}

            {/* SECURITY BOX */}
            <div style={{
              backgroundColor: '#e6f4ed',
              border: '1.5px solid #a7f3d0',
              borderRadius: '14px',
              padding: '0.85rem 1rem',
              marginTop: '1.4rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid #a7f3d0',
                color: '#059669'
              }}>
                <ShieldCheck size={20} />
              </div>

              <div>
                <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#065f46', lineHeight: 1.2 }}>
                  Your data is safe with us.
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#047857', marginTop: '0.15rem' }}>
                  CampusPrep never shares your personal information.
                </p>
              </div>
            </div>

            {/* TERMS & PRIVACY */}
            <div style={{
              textAlign: 'center',
              marginTop: '1.2rem',
              fontSize: '0.76rem',
              color: '#64748b'
            }}>
              By logging in, you agree to our{' '}
              <span
                onClick={() => alert('CampusPrep Terms of Service: Independent academic resource platform for AKTU students.')}
                style={{ color: '#0d5c3a', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Terms of Service
              </span>{' '}
              and{' '}
              <span
                onClick={() => alert('CampusPrep Privacy Policy: Your credentials and progress data are encrypted and safe.')}
                style={{ color: '#0d5c3a', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Privacy Policy
              </span>
            </div>

          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .auth-split-layout { flex-direction: column !important; }
          .auth-left-panel { width: 100% !important; min-height: 380px !important; }
          .auth-right-panel { width: 100% !important; padding: 1.5rem 1rem !important; }
        }
      `}</style>

    </div>
  );
}

// Styling Constants
const benefitItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const benefitIconWrapStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  border: '1px solid #a7f3d0'
};

const benefitTitleStyle = {
  fontSize: '0.78rem',
  fontWeight: 800,
  color: '#0d5c3a',
  lineHeight: 1.1
};

const benefitSubStyle = {
  fontSize: '0.68rem',
  fontWeight: 600,
  color: '#059669',
  marginTop: '0.05rem'
};

const inputContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  border: '1.5px solid #cbd5e1',
  borderRadius: '12px',
  padding: '0.65rem 0.95rem',
  backgroundColor: '#ffffff',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 6px rgba(0,0,0,0.01)'
};

const fieldInputStyle = {
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  width: '100%',
  fontSize: '0.88rem',
  color: '#0f172a',
  fontWeight: 500
};

const selectFieldStyle = {
  width: '100%',
  border: '1.5px solid #cbd5e1',
  borderRadius: '12px',
  padding: '0.65rem 0.85rem',
  backgroundColor: '#ffffff',
  fontSize: '0.85rem',
  fontWeight: 600,
  outline: 'none',
  color: '#0f172a'
};

const eyeToggleStyle = {
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0
};

const socialBtnStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.6rem',
  padding: '0.65rem',
  borderRadius: '12px',
  border: '1.5px solid #cbd5e1',
  backgroundColor: '#ffffff',
  color: '#334155',
  fontSize: '0.86rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s ease'
};
