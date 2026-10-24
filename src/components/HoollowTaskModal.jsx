import React from 'react';
import {
  X,
  BookOpen,
  Play,
  Code2,
  CheckCircle2,
  ExternalLink,
  Clock,
  Sparkles,
  Zap,
  Award
} from 'lucide-react';

export default function HoollowTaskModal({
  isOpen,
  onClose,
  task,
  phaseName,
  isCompleted,
  onToggleComplete,
  onAskMentor
}) {
  if (!isOpen || !task) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(28, 30, 33, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(104, 19, 27, 0.25)',
          border: '1px solid #F1E5D8',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #F0ECE3',
            background: 'linear-gradient(135deg, #FFF9F1 0%, #FFFFFF 100%)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span
                style={{
                  backgroundColor: '#FFF0E8',
                  color: '#8B101D',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                {phaseName || 'Learning Phase'}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: '#646E78',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                <Clock size={13} /> {task.duration || '2 Hours'}
              </span>
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#1F2421',
                fontFamily: "'Outfit', sans-serif"
              }}
            >
              {task.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#F6F2E9',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#646E78'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem', backgroundColor: '#FAF7F2' }}>
          {/* Overview */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E8E2D5',
              padding: '1.25rem',
              marginBottom: '1.25rem'
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem', fontWeight: 800, color: '#1F2421' }}>
              Learning Objectives & Concepts
            </h3>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#4A5568', lineHeight: 1.6 }}>
              {task.description}
            </p>

            {task.skills && task.skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem' }}>
                {task.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    style={{
                      backgroundColor: '#F6F2E9',
                      color: '#1F2421',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #E8E2D5'
                    }}
                  >
                    #{skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Curated Resources Section */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', fontWeight: 800, color: '#68131B' }}>
              Curated Study & Practice Resources
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {/* Video Tutorial */}
              {task.resources?.video && (
                <a
                  href={task.resources.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #FEE2E2',
                    padding: '1rem',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.05)',
                    transition: 'transform 0.15s ease, border-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#DC2626';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#FEE2E2';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={14} fill="#DC2626" />
                      </span>
                      <ExternalLink size={14} color="#A0AEC0" />
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1F2421' }}>Video Tutorial</div>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#718096' }}>
                      Watch step-by-step masterclass walkthrough
                    </p>
                  </div>
                  <div style={{ marginTop: '0.8rem', fontSize: '0.75rem', fontWeight: 700, color: '#DC2626' }}>
                    Open Video Lesson →
                  </div>
                </a>
              )}

              {/* Notes & Documentation */}
              {task.resources?.notes && (
                <a
                  href={task.resources.notes}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #DBEAFE',
                    padding: '1rem',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.05)',
                    transition: 'transform 0.15s ease, border-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2563EB';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#DBEAFE';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#DBEAFE', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={14} />
                      </span>
                      <ExternalLink size={14} color="#A0AEC0" />
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1F2421' }}>Documentation & Notes</div>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#718096' }}>
                      Official guides, cheat-sheets & syntax
                    </p>
                  </div>
                  <div style={{ marginTop: '0.8rem', fontSize: '0.75rem', fontWeight: 700, color: '#2563EB' }}>
                    Read Documentation →
                  </div>
                </a>
              )}

              {/* Practice & Exercises */}
              {task.resources?.practice && (
                <a
                  href={task.resources.practice}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #DCFCE7',
                    padding: '1rem',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(22, 163, 74, 0.05)',
                    transition: 'transform 0.15s ease, border-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#16A34A';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#DCFCE7';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Code2 size={14} />
                      </span>
                      <ExternalLink size={14} color="#A0AEC0" />
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1F2421' }}>Hands-on Challenge</div>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#718096' }}>
                      Solve interactive practice challenges & drills
                    </p>
                  </div>
                  <div style={{ marginTop: '0.8rem', fontSize: '0.75rem', fontWeight: 700, color: '#16A34A' }}>
                    Start Practice Drills →
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* AI Mentor Callout */}
          <div
            style={{
              backgroundColor: '#FFF9F1',
              borderRadius: '16px',
              border: '1px solid #F1E5D8',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#8B101D',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1F2421' }}>
                  Stuck or need an explanation?
                </div>
                <div style={{ fontSize: '0.78rem', color: '#7A6F62' }}>
                  Ask our AI Mentor for instant code samples and intuitive explanations for this topic.
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                if (onAskMentor) onAskMentor(task.title);
              }}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #8B101D',
                color: '#8B101D',
                borderRadius: '8px',
                padding: '0.45rem 0.9rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Ask AI Mentor
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '1.1rem 1.75rem',
            borderTop: '1px solid #F0ECE3',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#68131B', fontSize: '0.82rem', fontWeight: 600 }}>
            <Zap size={15} color="#D97706" />
            <span>Completing this task earns <strong>+50 XP</strong> and builds your streak</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={onClose}
              style={{
                background: '#F6F2E9',
                border: 'none',
                borderRadius: '8px',
                padding: '0.55rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#4A5568',
                cursor: 'pointer'
              }}
            >
              Close
            </button>

            <button
              onClick={() => {
                onToggleComplete(task.id);
                onClose();
              }}
              style={{
                backgroundColor: isCompleted ? '#276749' : '#8B101D',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0.55rem 1.4rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: isCompleted ? '0 4px 12px rgba(39, 103, 73, 0.25)' : '0 4px 12px rgba(139, 16, 29, 0.25)'
              }}
            >
              <CheckCircle2 size={16} />
              {isCompleted ? 'Marked as Completed ✓' : 'Mark Task Complete (+50 XP)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
