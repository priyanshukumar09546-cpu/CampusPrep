import React, { useState } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ChevronRight, 
  GraduationCap 
} from 'lucide-react';

export default function SignIn({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter your email and password');
      return;
    }
    // Set dummy auth token and redirect to home
    localStorage.setItem('campusprep_auth_user', JSON.stringify({ email, name: email.split('@')[0] }));
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] w-full max-w-[430px] mx-auto md:max-w-md lg:max-w-lg relative overflow-x-hidden flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] text-[#1C1814] shadow-2xl">
      
      {/* Corner Leaves Decoration */}
      <div 
        className="absolute top-0 left-0 w-24 h-24 pointer-events-none opacity-60 z-0 bg-contain bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/leaves-top.png")' }}
      />
      <div 
        className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-60 z-0 bg-contain bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/leaves-bottom.png")' }}
      />

      {/* HEADER ROW */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between z-10">
        <button 
          onClick={() => onNavigate('home')} 
          className="p-1.5 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Go Back"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Center Logo with ProfessorVirus */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <GraduationCap size={22} className="text-[#7A2327]" strokeWidth={2.4} />
            <span className="font-['Outfit',sans-serif] font-black text-xl text-[#7A2327] tracking-tight">
              ProfessorVirus
            </span>
          </div>
          <span className="text-[10px] font-semibold text-stone-500 tracking-wider">
            BTech • BCA • MTech • MCA • MBA • BPharm
          </span>
        </div>

        <button 
          onClick={() => alert('CampusPrep Support: Need assistance logging in? Contact support@campusprep.edu')} 
          className="p-1.5 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Help"
        >
          <HelpCircle size={20} />
        </button>
      </div>

      {/* MAIN SCROLLABLE CONTENT */}
      <div className="px-6 pb-6 pt-1 z-10 flex-1 flex flex-col justify-start">
        
        {/* TITLE & SUBTITLE */}
        <div className="text-center mb-3">
          <h1 className="font-['Outfit',sans-serif] font-extrabold text-2xl text-stone-900 tracking-tight flex items-center justify-center gap-1.5">
            Welcome Back <span className="inline-block animate-wiggle">👋</span>
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-[280px] mx-auto">
            Sign in to continue your learning journey with ProfessorVirus.
          </p>
        </div>

        {/* ILLUSTRATION BANNER */}
        <div className="relative w-full max-w-[280px] mx-auto h-44 mb-3 flex items-center justify-center">
          <img 
            src="/assets/auth-girl-signin.png" 
            alt="Student studying with laptop" 
            className="h-full w-auto object-contain drop-shadow-md"
            onError={(e) => {
              e.currentTarget.src = '/assets/hero_board.png';
            }}
          />
        </div>

        {/* PILL TOGGLE (Sign In / Sign Up) */}
        <div className="bg-stone-200/70 p-1 rounded-full flex max-w-[320px] mx-auto w-full mb-4 shadow-inner">
          <button 
            type="button"
            className="flex-1 py-1.5 text-center text-xs font-bold rounded-full bg-[#7A2327] text-white shadow-sm transition-all"
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => onNavigate('signup')}
            className="flex-1 py-1.5 text-center text-xs font-semibold rounded-full text-stone-600 hover:text-stone-900 transition-all cursor-pointer"
          >
            Sign Up
          </button>
        </div>

        {/* SIGN IN FORM */}
        <form onSubmit={handleSubmit} className="space-y-3 max-w-[340px] mx-auto w-full">
          
          {/* Email field */}
          <div className="relative flex items-center bg-white rounded-xl border border-stone-200 shadow-xs focus-within:border-[#7A2327] transition-all">
            <div className="pl-3 text-stone-400">
              <Mail size={16} />
            </div>
            <input 
              type="email" 
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2.5 pl-2.5 pr-3 text-xs bg-transparent outline-none text-stone-800 placeholder:text-stone-400 font-medium"
            />
          </div>

          {/* Password field */}
          <div className="relative flex items-center bg-white rounded-xl border border-stone-200 shadow-xs focus-within:border-[#7A2327] transition-all">
            <div className="pl-3 text-stone-400">
              <Lock size={16} />
            </div>
            <input 
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2.5 pl-2.5 pr-10 text-xs bg-transparent outline-none text-stone-800 placeholder:text-stone-400 font-medium"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <label className="flex items-center gap-1.5 cursor-pointer text-stone-700 font-medium">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#7A2327] rounded cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <button 
              type="button"
              onClick={() => alert('Password recovery link sent to your registered email.')}
              className="text-[#7A2327] hover:underline font-semibold cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In Button */}
          <button 
            type="submit"
            className="w-full py-2.5 rounded-full bg-[#7A2327] hover:bg-[#681c20] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
          >
            <span>Sign In</span>
            <span className="text-sm">→</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-stone-300 w-full"></div>
            <span className="bg-[#FFF7ED] px-2 text-[10px] font-bold text-stone-400 tracking-wider uppercase absolute">
              OR CONTINUE WITH
            </span>
          </div>

          {/* Google Continue Button */}
          <button 
            type="button"
            onClick={() => {
              localStorage.setItem('campusprep_auth_user', JSON.stringify({ name: 'Google Student', email: 'student@gmail.com' }));
              onNavigate('home');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {/* Google Logo SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        {/* Security / Safe Card */}
        <div className="mt-4 max-w-[340px] mx-auto w-full bg-[#FAF0E6]/80 rounded-xl p-2.5 border border-[#EEDDCF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#7A2327]/10 flex items-center justify-center text-[#7A2327]">
              <ShieldCheck size={16} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-stone-800">Your data is safe with us</div>
              <div className="text-[9.5px] text-stone-500 leading-tight">We use secure authentication to keep your account protected.</div>
            </div>
          </div>
          <ChevronRight size={14} className="text-stone-400" />
        </div>

      </div>
    </div>
  );
}
