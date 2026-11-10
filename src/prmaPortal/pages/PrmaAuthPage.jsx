import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Phone,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import PrmaNavbar from '../components/PrmaNavbar';
import PrmaFooter from '../components/PrmaFooter';
import { usePrmaApplication } from '../context/PrmaApplicationContext';

export default function PrmaAuthPage({ initialMode = 'login', navigateToTab }) {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const { loginUser } = usePrmaApplication();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    college: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.email || !form.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!form.password || form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (isRegister) {
      if (!form.fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!form.agreeTerms) {
        setError('Please agree to PRMA Tech Terms & Conditions.');
        return;
      }
    }

    setLoading(true);

    try {
      // Attempt backend auth if server is running
      const endpoint = isRegister ? '/api/prma/auth/register' : '/api/prma/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        const data = await res.json();
        loginUser(data.token, data.user);
        setSuccess(isRegister ? 'Account created successfully!' : 'Signed in successfully!');
        setTimeout(() => {
          if (navigateToTab) navigateToTab('prma-internships-dashboard');
        }, 800);
        return;
      }
    } catch (err) {
      // Fallback local auth simulation
      console.log('Using local PRMA auth session:', err);
    }

    // Local simulated auth session
    setTimeout(() => {
      setLoading(false);
      const user = {
        name: form.fullName || (form.email.split('@')[0]),
        email: form.email,
        mobile: form.mobile || '+91 9876543210',
        college: form.college || 'AKTU Affiliated Institute',
        role: 'intern'
      };
      loginUser('prma_local_jwt_' + Date.now(), user);
      setSuccess(isRegister ? 'Account created successfully! Redirecting...' : 'Welcome back! Redirecting...');
      setTimeout(() => {
        if (navigateToTab) navigateToTab('prma-internships-dashboard');
      }, 700);
    }, 900);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        color: '#0F172A'
      }}
    >
      <PrmaNavbar navigateToTab={navigateToTab} />

      <div
        style={{
          maxWidth: '520px',
          margin: '3rem auto 6rem',
          padding: '0 1.5rem'
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #E2E8F0',
            padding: '2.5rem 2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
          }}
        >
          {/* Logo & Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img
              src="/assets/prma_portal_ref/prma_tech_logo.jpg"
              alt="PRMA Tech"
              style={{ height: '44px', objectFit: 'contain', margin: '0 auto 1rem', display: 'block' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />

            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
              {isRegister ? 'Create Intern Account' : 'Sign In to Intern Portal'}
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748B' }}>
              {isRegister
                ? 'Join 5,000+ students building real-world projects with PRMA Tech'
                : 'Access your active internships, project files, and certificate'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.25rem',
              backgroundColor: '#F1F5F9',
              padding: '0.3rem',
              borderRadius: '12px',
              marginBottom: '1.75rem'
            }}
          >
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              style={{
                padding: '0.6rem',
                borderRadius: '9px',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: !isRegister ? '#FFFFFF' : 'transparent',
                color: !isRegister ? '#0866F5' : '#64748B',
                boxShadow: !isRegister ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              style={{
                padding: '0.6rem',
                borderRadius: '9px',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isRegister ? '#FFFFFF' : 'transparent',
                color: isRegister ? '#0866F5' : '#64748B',
                boxShadow: isRegister ? '0 2px 6px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              Register
            </button>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FEE2E2',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                fontSize: '0.82rem',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                fontSize: '0.82rem',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}
            >
              <CheckCircle2 size={16} />
              {success}
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {isRegister && (
              <>
                {/* Full Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="e.g. Priyanshu Kumar"
                      value={form.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                        fontSize: '0.88rem',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* College Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    College / University *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <GraduationCap size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="e.g. AKGEC Ghaziabad"
                      value={form.college}
                      onChange={(e) => handleChange('college', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                        fontSize: '0.88rem',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Mobile Number *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={form.mobile}
                      onChange={(e) => handleChange('mobile', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                        fontSize: '0.88rem',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                    fontSize: '0.88rem',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                    fontSize: '0.88rem',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Confirm Password (if register) */}
            {isRegister && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Confirm Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.85rem 0.7rem 2.4rem',
                      fontSize: '0.88rem',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Terms checkbox for register */}
            {isRegister && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={form.agreeTerms}
                  onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                  style={{ marginTop: '0.2rem', accentColor: '#0866F5' }}
                />
                <label htmlFor="agreeTerms" style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
                  I agree to PRMA Tech's Terms of Service and Privacy Policy.
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: 800,
                backgroundColor: loading ? '#94A3B8' : '#0866F5',
                color: '#FFFFFF',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(8, 102, 245, 0.35)',
                marginTop: '0.5rem'
              }}
            >
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In to Portal'}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          {/* Footer security badge */}
          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #F1F5F9',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              fontSize: '0.78rem',
              color: '#64748B'
            }}
          >
            <ShieldCheck size={16} color="#16A34A" />
            256-Bit SSL Encrypted Student Identity
          </div>
        </div>
      </div>

      <PrmaFooter navigateToTab={navigateToTab} />
    </div>
  );
}
