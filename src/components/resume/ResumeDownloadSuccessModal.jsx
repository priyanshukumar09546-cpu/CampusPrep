import React from 'react';
import {
  X,
  Award,
  Eye,
  Edit3,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';

export default function ResumeDownloadSuccessModal({
  isOpen,
  onClose,
  isLoggedIn = false,
  resumeTitle = 'My Resume',
  resumeId = null,
  pdfUrl = '',
  onCheckAtsScore,
  onPreviewResume,
  onEditResume,
  onOpenMyResumes
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pv-resume-success-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10900,
        backgroundColor: 'rgba(15, 12, 14, 0.78)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        animation: 'pvModalFadeIn 0.22s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 25px 65px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(200, 141, 45, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          animation: 'pvModalSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Decorative Header Accent */}
        <div
          style={{
            background: 'linear-gradient(135deg, #781416 0%, #8C1C24 60%, #B82834 100%)',
            padding: '1.65rem 1.65rem 1.45rem',
            color: '#FFFFFF',
            position: 'relative',
            boxSizing: 'border-box'
          }}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: 'absolute',
              top: '1.1rem',
              right: '1.1rem',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.16)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)')}
          >
            <X size={18} />
          </button>

          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(255, 209, 102, 0.18)',
              border: '1px solid rgba(255, 209, 102, 0.45)',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#FFD166',
              marginBottom: '0.65rem',
              letterSpacing: '0.03em',
              textTransform: 'uppercase'
            }}
          >
            <Sparkles size={12} color="#FFD166" />
            <span>PDF Generated Successfully</span>
          </div>

          {/* Heading */}
          <h2
            id="pv-resume-success-title"
            style={{
              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(1.45rem, 3.2vw, 1.85rem)',
              fontWeight: 900,
              margin: '0 0 0.35rem 0',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: '#FFFFFF'
            }}
          >
            Your Resume Is Ready! 🎉
          </h2>

          <div style={{ fontSize: '0.84rem', color: '#FCE7E8', fontWeight: 600 }}>
            {resumeTitle}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.45rem 1.65rem', boxSizing: 'border-box' }}>
          {/* Cloud Save Status Indicator */}
          {isLoggedIn ? (
            <div
              style={{
                backgroundColor: '#F0FDF4',
                border: '1.5px solid #BBF7D0',
                borderRadius: '12px',
                padding: '0.8rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1.25rem'
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <ShieldCheck size={16} />
              </div>
              <div style={{ fontSize: '0.82rem', color: '#166534', lineHeight: 1.45, fontWeight: 600 }}>
                Your professional resume has been generated and <strong>automatically saved to your account</strong>.
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#FEF9EE',
                border: '1.5px solid #FCD34D',
                borderRadius: '12px',
                padding: '0.8rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1.25rem'
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#FEF3C7',
                  color: '#B45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <AlertCircle size={16} />
              </div>
              <div style={{ fontSize: '0.80rem', color: '#92400E', lineHeight: 1.45 }}>
                Your resume PDF has downloaded. <strong>Note:</strong> You are currently not signed in. Log in to ProfessorVirus for permanent cloud saving and multi-device access.
              </div>
            </div>
          )}

          {/* Motivational ATS Hook */}
          <div
            style={{
              backgroundColor: '#FAF5ED',
              border: '1px solid #E8DFCF',
              borderRadius: '14px',
              padding: '0.95rem 1.15rem',
              marginBottom: '1.35rem',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              <Award size={15} color="#C88D2D" />
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#8A5D00', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Recruiter Screening Insight
              </span>
            </div>
            <p
              style={{
                fontSize: '0.84rem',
                color: '#4A4036',
                lineHeight: 1.5,
                margin: 0,
                fontWeight: 600
              }}
            >
              "Want to know how recruiters and ATS systems evaluate your resume? Check your ATS compatibility score now."
            </p>
          </div>

          {/* Action Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {/* 1. Primary CTA: Check ATS Score */}
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onCheckAtsScore) onCheckAtsScore();
              }}
              style={{
                width: '100%',
                padding: '0.85rem 1.25rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #781416 0%, #9B1B26 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                fontSize: '0.94rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.55rem',
                boxShadow: '0 6px 20px rgba(120, 20, 22, 0.32)',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(120, 20, 22, 0.42)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(120, 20, 22, 0.32)';
              }}
            >
              <Award size={18} color="#FFD166" />
              <span>Check ATS Score</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>

            {/* Grid for secondary options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.55rem', marginTop: '0.25rem' }}>
              {/* 2. Preview Resume */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onPreviewResume) onPreviewResume();
                }}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  color: '#1E293B',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#781416';
                  e.currentTarget.style.backgroundColor = '#FAF5ED';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                <Eye size={16} color="#781416" />
                <span>Preview Resume</span>
              </button>

              {/* 3. Edit Resume */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onEditResume) onEditResume();
                }}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  color: '#1E293B',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#781416';
                  e.currentTarget.style.backgroundColor = '#FAF5ED';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                <Edit3 size={16} color="#059669" />
                <span>Edit Resume</span>
              </button>

              {/* 4. My Saved Resumes */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenMyResumes) onOpenMyResumes();
                }}
                style={{
                  padding: '0.65rem 0.5rem',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  color: '#1E293B',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C88D2D';
                  e.currentTarget.style.backgroundColor = '#FEF9EE';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                <FolderOpen size={16} color="#C88D2D" />
                <span>My Saved Resumes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pvModalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pvModalSlideUp {
          from { transform: translateY(24px) scale(0.97); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
