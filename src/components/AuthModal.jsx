import React, { useState } from 'react';
import { X, Mail, Lock, User, GraduationCap, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, mode, onClose, onSwitchMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [year, setYear] = useState('1st Year');
  const [branch, setBranch] = useState('CSE');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const bodyPayload = mode === 'login' ? { emailOrEnrollment: email, password } : { name, email, branch, year, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('professorvirus_token', data.token);
        localStorage.setItem('professorvirus_user', JSON.stringify(data.user));
        sessionStorage.setItem('professorvirus_token', data.token);
        sessionStorage.setItem('professorvirus_user', JSON.stringify(data.user));
        onClose();
        window.location.reload();
      } else {
        setErrorMsg(data.message || 'Authentication failed.');
      }
    } catch (err) {
      setErrorMsg('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '440px',
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '1.6rem',
            fontWeight: 800,
            color: '#1F2421',
            marginBottom: '0.2rem'
          }}>
            Professor<span style={{ color: '#C88D2D' }}>Virus</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            {mode === 'login' ? 'Welcome back! Log in to access your AKTU resources.' : 'Create your student account & start preparing.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'signup' && (
            <div>
              <label style={labelStyle}>Full Name</label>
              <div style={inputWrapStyle}>
                <User size={16} style={{ color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          <div>
            <label style={labelStyle}>Email Address</label>
            <div style={inputWrapStyle}>
              <Mail size={16} style={{ color: '#94a3b8' }} />
              <input
                type="email"
                placeholder="student@aktu.ac.in"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={inputWrapStyle}>
              <Lock size={16} style={{ color: '#94a3b8' }} />
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Year</label>
                <select value={year} onChange={(e) => setYear(e.target.value)} style={selectStyle}>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Branch</label>
                <select value={branch} onChange={(e) => setBranch(e.target.value)} style={selectStyle}>
                  <option>CSE</option>
                  <option>ECE</option>
                  <option>ME</option>
                  <option>CE</option>
                  <option>IT</option>
                  <option>EE</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '0.95rem',
              marginTop: '0.5rem',
              backgroundColor: '#1F2421'
            }}
          >
            {mode === 'login' ? 'Login to Account' : 'Create Free Account'} <ArrowRight size={18} />
          </button>
        </form>

        {/* Switch Mode Footer */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: '#64748b' }}>
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => onSwitchMode('signup')} style={linkBtnStyle}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => onSwitchMode('login')} style={linkBtnStyle}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#334155',
  marginBottom: '0.3rem',
  display: 'block'
};

const inputWrapStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  border: '1px solid #cbd5e1',
  borderRadius: '10px',
  padding: '0.55rem 0.85rem',
  backgroundColor: '#f8fafc'
};

const inputStyle = {
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  width: '100%',
  fontSize: '0.88rem',
  color: '#0f172a'
};

const selectStyle = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: '10px',
  padding: '0.55rem 0.7rem',
  backgroundColor: '#f8fafc',
  fontSize: '0.85rem',
  outline: 'none',
  color: '#0f172a'
};

const linkBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#C88D2D',
  fontWeight: 700,
  cursor: 'pointer'
};
