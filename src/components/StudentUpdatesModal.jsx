import React, { useState, useEffect } from 'react';
import { X, Bell, CheckCircle2, ArrowRight, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';

export default function StudentUpdatesModal({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check if dismissed recently or already subscribed
    try {
      const dismissedUntil = localStorage.getItem('pv_updates_modal_dismissed_until');
      const alreadySubscribed = localStorage.getItem('pv_updates_subscribed_email');
      const now = Date.now();

      if (alreadySubscribed) return;
      if (dismissedUntil && now < parseInt(dismissedUntil, 10)) return;
      if (sessionStorage.getItem('pv_modal_shown_session')) return;

      // Show after sensible delay (8 seconds) only if no other modal opened
      const timer = setTimeout(() => {
        if (!sessionStorage.getItem('pv_modal_shown_session')) {
          setIsOpen(true);
          try { sessionStorage.setItem('pv_modal_shown_session', 'true'); } catch {}
        }
      }, 8000);

      return () => clearTimeout(timer);
    } catch {
      // Ignore storage errors in private browsing
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      // 5-day sensible cooldown
      const nextDismiss = Date.now() + 5 * 24 * 60 * 60 * 1000;
      localStorage.setItem('pv_updates_modal_dismissed_until', String(nextDismiss));
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const trimmed = email.trim();

    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Attempt backend record if available
      try {
        await fetch('/api/updates/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmed, source: 'updates_modal' })
        });
      } catch (networkErr) {
        // Fallback gracefully without breaking user UX
      }

      localStorage.setItem('pv_updates_subscribed_email', trimmed);
      setIsSuccess(true);

      // Auto dismiss success screen after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 3500);
    } catch (err) {
      setErrorMsg('Unable to subscribe right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(31, 26, 20, 0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'pvModalFadeIn 0.25s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleDismiss();
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid #E8E2D5',
          boxShadow: '0 24px 60px rgba(35, 30, 25, 0.22)',
          width: '100%',
          maxWidth: '480px',
          overflow: 'hidden',
          position: 'relative',
          animation: 'pvModalScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* TOP DECORATIVE HEADER */}
        <div style={{
          backgroundColor: '#FAF7F2',
          borderBottom: '1px solid #E8E2D5',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bell size={18} style={{ color: '#781416' }} />
            </div>

            <div>
              <div style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '0.98rem',
                fontWeight: 800,
                color: '#1F2421'
              }}>
                Professor<span style={{ color: '#781416' }}>Virus</span> Updates
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                Semester & Placement Alerts
              </div>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            aria-label="Close updates popup"
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.color = '#1E293B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#94A3B8';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY CONTENT */}
        <div style={{ padding: '1.75rem 1.5rem 1.5rem 1.5rem' }}>
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                <CheckCircle2 size={30} />
              </div>

              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#1F2421',
                margin: '0 0 0.5rem 0'
              }}>
                You're All Set!
              </h3>

              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                Thank you for subscribing. We will send you critical semester schedules, new notes, and placement opportunities.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#FDF6E8',
                  color: '#8A5D00',
                  border: '1px solid #E8D3B0',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  marginBottom: '0.75rem',
                  letterSpacing: '0.03em'
                }}>
                  <Sparkles size={12} /> VERIFIED ACADEMIC UPDATES
                </div>

                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: '#1F2421',
                  margin: '0 0 0.5rem 0',
                  lineHeight: 1.3
                }}>
                  Stay Ahead in Your Semester
                </h3>

                <p style={{
                  fontSize: '0.88rem',
                  color: '#646E78',
                  lineHeight: 1.55,
                  margin: 0
                }}>
                  Get direct alerts when new faculty handwritten notes, solved university PYQs, syllabus changes, and off-campus placement assessments are published.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your college or personal email"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.85rem 1.1rem',
                      borderRadius: '12px',
                      border: errorMsg ? '1.5px solid #EF4444' : '1.5px solid #D8D2C5',
                      backgroundColor: '#FAF7F2',
                      fontSize: '0.92rem',
                      color: '#1F2421',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#781416'}
                    onBlur={(e) => {
                      if (!errorMsg) e.target.style.borderColor = '#D8D2C5';
                    }}
                  />
                  {errorMsg && (
                    <div style={{ fontSize: '0.76rem', color: '#DC2626', marginTop: '0.35rem', fontWeight: 600 }}>
                      {errorMsg}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.85rem 1.25rem',
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 6px 18px rgba(120, 20, 22, 0.25)',
                    transition: 'all 0.2s ease',
                    opacity: isSubmitting ? 0.8 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) e.currentTarget.style.backgroundColor = '#90181A';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) e.currentTarget.style.backgroundColor = '#781416';
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Get Semester Alerts'} <ArrowRight size={16} />
                </button>
              </form>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1.25rem',
                paddingTop: '1rem',
                borderTop: '1px solid #F1ECE1',
                fontSize: '0.74rem',
                color: '#64748B'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ShieldCheck size={14} style={{ color: '#16A34A' }} /> No spam. Unsubscribe anytime.
                </div>

                <button
                  onClick={handleDismiss}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Maybe later
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pvModalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pvModalScaleUp {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
