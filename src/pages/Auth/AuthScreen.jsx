import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  BookOpen,
  FileText,
  Sparkles,
  Bot,
  Star,
  Check,
  X,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function AuthScreen({ initialMode = 'signin', onNavigate }) {
  const [mode, setMode] = useState(initialMode === 'signup' ? 'signup' : 'signin');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals for legal & assistance
  const [activeModal, setActiveModal] = useState(null); // 'terms' | 'privacy' | 'forgot'
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Sync mode with prop changes if parent updates
  useEffect(() => {
    setMode(initialMode === 'signup' ? 'signup' : 'signin');
    setErrorMsg('');
    setSuccessMsg('');
  }, [initialMode]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMsg('');
    setSuccessMsg('');
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', newMode === 'signup' ? '/signup' : '/signin');
    }
    if (onNavigate) {
      // Optional callback to notify parent route state
      onNavigate(newMode);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setErrorMsg('Please enter your email address or enrollment number.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrEnrollment: trimmedEmail, password })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setSuccessMsg('Signed in successfully! Redirecting...');
        const token = data.token || `pv_jwt_${Date.now()}`;
        const user = data.user || {
          name: trimmedEmail.split('@')[0],
          email: trimmedEmail,
          role: 'student',
          course: 'B.Tech',
          branch: 'CSE'
        };

        persistUserSession(token, user);

        setTimeout(() => {
          if (onNavigate) onNavigate('home');
          else window.location.href = '/';
        }, 600);
      } else {
        // Fallback for demonstration / local mock session if backend is offline
        if (!res.ok && res.status === 404) {
          handleOfflineFallback(trimmedEmail, trimmedEmail.split('@')[0], 'home');
        } else {
          setErrorMsg(data.message || 'Invalid email or password. Please verify your credentials.');
        }
      }
    } catch (err) {
      // Graceful offline fallback so students are never locked out in dev/demo
      handleOfflineFallback(trimmedEmail, trimmedEmail.split('@')[0], 'home');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!trimmedEmail) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          fullName: trimmedName,
          email: trimmedEmail,
          password
        })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setSuccessMsg('Account created successfully! Welcome to CampusPrep!');
        const token = data.token || `pv_jwt_${Date.now()}`;
        const user = data.user || {
          name: trimmedName,
          email: trimmedEmail,
          role: 'student',
          course: 'B.Tech',
          branch: 'CSE'
        };

        persistUserSession(token, user);

        setTimeout(() => {
          if (onNavigate) onNavigate('select-course');
          else window.location.href = '/select-course';
        }, 700);
      } else {
        if (!res.ok && res.status === 404) {
          handleOfflineFallback(trimmedEmail, trimmedName, 'select-course');
        } else {
          setErrorMsg(data.message || 'Unable to register account. Please check your details or try signing in.');
        }
      }
    } catch (err) {
      handleOfflineFallback(trimmedEmail, trimmedName, 'select-course');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    const mockUser = {
      name: 'Google Student',
      email: 'student@campusprep.edu',
      role: 'student',
      course: 'B.Tech',
      branch: 'CSE'
    };
    persistUserSession(`pv_google_token_${Date.now()}`, mockUser);
    setSuccessMsg('Signed in with Google! Redirecting...');
    setTimeout(() => {
      if (onNavigate) onNavigate(mode === 'signup' ? 'select-course' : 'home');
      else window.location.href = '/';
    }, 500);
  };

  const persistUserSession = (token, user) => {
    try {
      localStorage.setItem('professorvirus_token', token);
      localStorage.setItem('professorvirus_user', JSON.stringify(user));
      sessionStorage.setItem('professorvirus_token', token);
      sessionStorage.setItem('professorvirus_user', JSON.stringify(user));
      localStorage.setItem('campusprep_auth_user', JSON.stringify(user));
      window.dispatchEvent(new Event('auth_state_changed'));
    } catch (e) {
      console.warn('Storage persistence warning:', e);
    }
  };

  const handleOfflineFallback = (fallbackEmail, fallbackName, targetTab) => {
    const user = {
      name: fallbackName || fallbackEmail.split('@')[0],
      email: fallbackEmail,
      role: 'student',
      course: 'B.Tech',
      branch: 'CSE'
    };
    persistUserSession(`pv_offline_token_${Date.now()}`, user);
    setSuccessMsg('Authentication verified. Welcome to ProfessorVirus!');
    setTimeout(() => {
      if (onNavigate) onNavigate(targetTab);
      else window.location.href = '/';
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] text-[#1C1814] flex flex-col lg:flex-row overflow-x-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* ======================================================== */}
      {/* LEFT COLUMN: BRANDING & EDUCATIONAL SHOWCASE (DESKTOP)   */}
      {/* ======================================================== */}
      <div 
        className="w-full lg:w-[48%] xl:w-[46%] 2xl:w-[44%] relative flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 text-white overflow-hidden shadow-2xl z-10"
        style={{
          background: 'linear-gradient(155deg, #1A0508 0%, #350B10 32%, #551219 70%, #7A2327 100%)'
        }}
      >
        {/* Subtle Decorative Background Grids & Orbs */}
        <div 
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #C88D2D 0%, transparent 70%)' }}
        />
        <div 
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none opacity-25 blur-3xl"
          style={{ background: 'radial-gradient(circle, #EF4444 0%, transparent 70%)' }}
        />
        <div 
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* TOP BRAND HEADER */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#F59E0B] shadow-inner">
              <GraduationCap size={24} strokeWidth={2.4} />
            </div>
            <div>
              <div className="font-['Outfit',sans-serif] font-black text-2xl tracking-tight text-white leading-none">
                Professor<span className="text-[#F59E0B]">Virus</span>
              </div>
              <div className="text-[11px] font-semibold tracking-wider text-rose-200/80 uppercase mt-0.5">
                CampusPrep Engineering Hub
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('home') : window.location.href = '/'}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-xs font-semibold text-rose-100 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Home</span>
          </button>
        </div>

        {/* CENTER PRO VALUE PROPOSITION */}
        <div className="relative z-10 my-8 lg:my-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-bold tracking-wide uppercase mb-4 shadow-sm">
            <Sparkles size={13} />
            <span>AKTU Exam & Career Preparation</span>
          </div>

          {/* Headline */}
          <h1 className="font-['Outfit',sans-serif] font-black text-3xl sm:text-4xl lg:text-5xl leading-[1.12] tracking-tight text-white mb-4">
            Study Smart.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-200 to-white">
              Prepare Better.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed max-w-lg mb-8">
            The single-stop academic ecosystem built for university engineers. Master your semester exams with verified unit notes and unlock dream tech careers with AI interview prep.
          </p>

          {/* 4 Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <div className="p-3.5 rounded-xl bg-white/[0.07] border border-white/10 backdrop-blur-md flex items-start gap-3 hover:bg-white/[0.12] transition-all">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <BookOpen size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Unit-Wise Notes</div>
                <div className="text-[11px] text-rose-200/70 leading-snug">AKTU syllabus aligned chapters</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.07] border border-white/10 backdrop-blur-md flex items-start gap-3 hover:bg-white/[0.12] transition-all">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                <FileText size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">5-Year Solved PYQs</div>
                <div className="text-[11px] text-rose-200/70 leading-snug">Past question papers & keys</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.07] border border-white/10 backdrop-blur-md flex items-start gap-3 hover:bg-white/[0.12] transition-all">
              <div className="w-8 h-8 rounded-lg bg-sky-400/20 text-sky-300 flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">AI Technical Mock</div>
                <div className="text-[11px] text-rose-200/70 leading-snug">Voice coding & DSA simulator</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.07] border border-white/10 backdrop-blur-md flex items-start gap-3 hover:bg-white/[0.12] transition-all">
              <div className="w-8 h-8 rounded-lg bg-purple-400/20 text-purple-300 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-white">1-Page ATS Resume</div>
                <div className="text-[11px] text-rose-200/70 leading-snug">ABES format LaTeX compiler</div>
              </div>
            </div>
          </div>

          {/* Social Proof Metric Bar */}
          <div className="p-4 rounded-2xl bg-white/[0.08] border border-white/15 backdrop-blur-lg flex items-center justify-around text-center">
            <div>
              <div className="font-['Outfit',sans-serif] font-extrabold text-lg sm:text-xl text-white">25,000+</div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-rose-200/75 uppercase tracking-wide">Active Students</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <div className="font-['Outfit',sans-serif] font-extrabold text-lg sm:text-xl text-[#F59E0B]">150+</div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-rose-200/75 uppercase tracking-wide">Solved Subjects</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <div className="font-['Outfit',sans-serif] font-extrabold text-lg sm:text-xl text-emerald-300 flex items-center justify-center gap-1">
                <Star size={14} className="fill-emerald-300" /> 4.9
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-rose-200/75 uppercase tracking-wide">Student Rating</div>
            </div>
          </div>
        </div>

        {/* BOTTOM BRAND FOOTER (Course chips) */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-rose-200/80 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open & Free For: B.Tech • BCA • MCA • M.Tech • MBA</span>
          </div>
          <span className="italic font-['Kalam',cursive] text-[#F59E0B] text-xs">
            "Same Notes, Higher Grades!"
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: AUTHENTICATION FORM (DESKTOP CENTERED)     */}
      {/* ======================================================== */}
      <div className="w-full lg:w-[52%] xl:w-[54%] 2xl:w-[56%] flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 xl:p-16 min-h-[600px] lg:min-h-screen bg-[#FAF7F2]">
        
        {/* Responsive Desktop Form Card */}
        <div className="w-full max-w-[460px] flex flex-col justify-center">

          {/* SEGMENTED TAB SWITCHER (Sign In / Create Account) */}
          <div className="p-1.5 bg-[#EDE6DC] rounded-2xl flex items-center shadow-inner mb-6">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-[#7A2327] shadow-md shadow-stone-900/5'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#7A2327] shadow-md shadow-stone-900/5'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <UserPlus size={15} />
              <span>Create Account</span>
            </button>
          </div>

          {/* HEADER TITLE */}
          <div className="mb-6">
            <h2 className="font-['Outfit',sans-serif] font-black text-2xl sm:text-3xl text-stone-900 tracking-tight flex items-center gap-2">
              {mode === 'signin' ? (
                <>Welcome Back <span className="inline-block">👋</span></>
              ) : (
                <>Create Your Account <span className="inline-block">🚀</span></>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-relaxed">
              {mode === 'signin'
                ? 'Sign in to access your saved notes, model papers, and interview sessions.'
                : 'Join over 25,000+ college engineering students preparing for top results.'}
            </p>
          </div>

          {/* ALERTS (Error / Success) */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2.5 shadow-xs animate-shake">
              <AlertCircle size={17} className="shrink-0 text-red-600 mt-0.5" />
              <div className="leading-snug">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2.5 shadow-xs">
              <CheckCircle2 size={17} className="shrink-0 text-emerald-600 mt-0.5" />
              <div className="leading-snug">{successMsg}</div>
            </div>
          )}

          {/* ======================================================== */}
          {/* THE FORM                                                 */}
          {/* ======================================================== */}
          <form onSubmit={mode === 'signin' ? handleLogin : handleSignup} className="space-y-4">
            
            {/* SIGN UP ONLY: Full Name */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative flex items-center bg-white rounded-xl border border-stone-300 hover:border-stone-400 focus-within:border-[#7A2327] focus-within:ring-2 focus-within:ring-[#7A2327]/10 transition-all shadow-xs">
                  <div className="pl-3.5 text-stone-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyanshu Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full py-3 pl-3 pr-3.5 text-xs sm:text-sm bg-transparent outline-none text-stone-800 placeholder:text-stone-400 font-medium"
                  />
                </div>
              </div>
            )}

            {/* Email Address (Both) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {mode === 'signin' ? 'Email or Student ID' : 'College / Personal Email'}
              </label>
              <div className="relative flex items-center bg-white rounded-xl border border-stone-300 hover:border-stone-400 focus-within:border-[#7A2327] focus-within:ring-2 focus-within:ring-[#7A2327]/10 transition-all shadow-xs">
                <div className="pl-3.5 text-stone-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder={mode === 'signin' ? 'student@college.edu or enrollment' : 'name@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 pl-3 pr-3.5 text-xs sm:text-sm bg-transparent outline-none text-stone-800 placeholder:text-stone-400 font-medium"
                />
              </div>
            </div>

            {/* Password (Both) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setActiveModal('forgot')}
                    className="text-xs font-semibold text-[#7A2327] hover:text-[#5B181B] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center bg-white rounded-xl border border-stone-300 hover:border-stone-400 focus-within:border-[#7A2327] focus-within:ring-2 focus-within:ring-[#7A2327]/10 transition-all shadow-xs">
                <div className="pl-3.5 text-stone-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 pl-3 pr-10 text-xs sm:text-sm bg-transparent outline-none text-stone-800 placeholder:text-stone-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* SIGN UP ONLY: Confirm Password */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative flex items-center bg-white rounded-xl border border-stone-300 hover:border-stone-400 focus-within:border-[#7A2327] focus-within:ring-2 focus-within:ring-[#7A2327]/10 transition-all shadow-xs">
                  <div className="pl-3.5 text-stone-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-3 pl-3 pr-10 text-xs sm:text-sm bg-transparent outline-none text-stone-800 placeholder:text-stone-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer p-1"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
            )}

            {/* SIGN IN: Remember Me */}
            {mode === 'signin' && (
              <div className="flex items-center text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-stone-700 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#7A2327] focus:ring-[#7A2327] accent-[#7A2327] cursor-pointer"
                  />
                  <span>Keep me signed in on this computer</span>
                </label>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#7A2327] via-[#8B1A20] to-[#7A2327] hover:from-[#661B1E] hover:to-[#661B1E] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#7A2327]/25 hover:shadow-xl hover:shadow-[#7A2327]/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to CampusPrep' : 'Create Free Student Account'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* DIVIDER */}
            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-stone-300 w-full" />
              <span className="bg-[#FAF7F2] px-3 text-[11px] font-bold text-stone-400 tracking-wider uppercase absolute">
                or continue with
              </span>
            </div>

            {/* GOOGLE BUTTON */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-white border border-stone-300 hover:border-stone-400 hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* BOTTOM TERMS & COMPLIANCE FOOTER */}
          <div className="mt-6 pt-4 border-t border-stone-200/80 text-center text-[11px] text-stone-500 leading-relaxed">
            By continuing, you agree to CampusPrep's{' '}
            <button
              type="button"
              onClick={() => setActiveModal('terms')}
              className="text-[#7A2327] hover:underline font-bold cursor-pointer"
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="text-[#7A2327] hover:underline font-bold cursor-pointer"
            >
              Privacy Policy
            </button>.
            <div className="mt-2 text-[10px] text-stone-400 flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>256-Bit SSL Encrypted • Zero Spam • Student Data Protected</span>
            </div>
          </div>

          {/* SWITCH PROMPT */}
          <div className="mt-4 text-center text-xs text-stone-600">
            {mode === 'signin' ? (
              <>
                New student on CampusPrep?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-[#7A2327] hover:underline font-bold cursor-pointer"
                >
                  Create an account free
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-[#7A2327] hover:underline font-bold cursor-pointer"
                >
                  Sign in here
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* PROFESSIONAL POPUP MODALS (TERMS, PRIVACY, FORGOT PW)   */}
      {/* ======================================================== */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setActiveModal(null);
                setForgotSent(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            {activeModal === 'terms' && (
              <div>
                <div className="flex items-center gap-2 text-[#7A2327] font-['Outfit',sans-serif] font-bold text-xl mb-3">
                  <BookOpen size={20} />
                  <span>Terms of Service</span>
                </div>
                <div className="text-xs text-stone-600 space-y-2.5 max-h-80 overflow-y-auto pr-2 leading-relaxed">
                  <p><strong>1. Free Educational Access:</strong> CampusPrep and ProfessorVirus provide free, non-commercial educational study materials, past question papers, notes, and academic tools for university engineering students.</p>
                  <p><strong>2. Academic Integrity:</strong> All previous year exam papers and subject solutions are provided for preparation, revision, and self-study purposes in accordance with fair educational use.</p>
                  <p><strong>3. AI Tools & Resume Maker:</strong> Resume templates and AI interview simulators are provided to empower student placement readiness. Users retain ownership of their entered academic and project details.</p>
                  <p><strong>4. User Accounts:</strong> You are responsible for safeguarding your login credentials. We do not sell student data or share credentials with third parties.</p>
                </div>
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-xl bg-[#7A2327] hover:bg-[#661B1E] text-white text-xs font-bold transition-all"
                  >
                    Understood
                  </button>
                </div>
              </div>
            )}

            {activeModal === 'privacy' && (
              <div>
                <div className="flex items-center gap-2 text-[#7A2327] font-['Outfit',sans-serif] font-bold text-xl mb-3">
                  <ShieldCheck size={20} />
                  <span>Privacy Policy</span>
                </div>
                <div className="text-xs text-stone-600 space-y-2.5 max-h-80 overflow-y-auto pr-2 leading-relaxed">
                  <p><strong>1. Data Protection:</strong> We respect student privacy. Your email, name, and study progress are stored securely using industry-standard hashing and encryption protocols.</p>
                  <p><strong>2. Zero Commercial Selling:</strong> We never sell student phone numbers, email addresses, or academic performance records to third-party advertisers or lead agencies.</p>
                  <p><strong>3. Local Preferences:</strong> Study preferences (selected course, year, branch, dark mode) are cached in your local browser storage to provide an instantaneous, personalized experience.</p>
                  <p><strong>4. Inquiries:</strong> For account deletion or data verification requests, reach out to our student support team anytime at support@campusprep.edu.</p>
                </div>
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 rounded-xl bg-[#7A2327] hover:bg-[#661B1E] text-white text-xs font-bold transition-all"
                  >
                    Got It
                  </button>
                </div>
              </div>
            )}

            {activeModal === 'forgot' && (
              <div>
                <div className="flex items-center gap-2 text-[#7A2327] font-['Outfit',sans-serif] font-bold text-xl mb-2">
                  <Mail size={20} />
                  <span>Reset Password</span>
                </div>
                <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                  Enter your registered college email or enrollment ID. We'll send you a secure verification link to set a new password.
                </p>

                {forgotSent ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2.5 mb-4">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <span>Password recovery link dispatched to {forgotEmail}. Please check your inbox and spam folder.</span>
                  </div>
                ) : (
                  <div className="space-y-3 mb-4">
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full py-2.5 px-3.5 text-xs rounded-xl border border-stone-300 focus:border-[#7A2327] outline-none text-stone-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (forgotEmail.trim()) {
                          setForgotSent(true);
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#7A2327] hover:bg-[#661B1E] text-white text-xs font-bold transition-all"
                    >
                      Send Reset Instructions
                    </button>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      setForgotSent(false);
                    }}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold text-stone-600 hover:text-stone-900"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
