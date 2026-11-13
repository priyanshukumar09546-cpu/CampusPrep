// src/components/resume/ResumeLandingHub.jsx
import React from 'react';
import {
  FileText,
  Plus,
  RotateCcw,
  GraduationCap,
  UploadCloud,
  FolderOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sliders,
  Layers,
  Award,
  Zap,
  Building,
  ArrowLeft
} from 'lucide-react';

export default function ResumeLandingHub({
  onStartNewResume,
  onOpenMyResumes,
  onOpenCollegeFormat,
  onOpenImport,
  onOpenAtsChecker,
  onOpenJobOptimizer,
  savedResumesCount = 0,
  onNavigate
}) {
  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1F2421' }}>
      
      {/* 1. TOP BREADCRUMB */}
      <div style={{ borderBottom: '1px solid #E8E2D5', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#78716C' }}>
            <span 
              onClick={() => onNavigate && onNavigate('home')} 
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
              className="hover:underline"
            >
              Home
            </span>
            <span>/</span>
            <span 
              onClick={() => onNavigate && onNavigate('more')} 
              style={{ cursor: 'pointer' }}
              className="hover:underline"
            >
              More Tools
            </span>
            <span>/</span>
            <span style={{ color: '#781416', fontWeight: 800 }}>
              AI Resume Maker
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenMyResumes}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#FAF5ED',
              border: '1.5px solid #C88D2D',
              borderRadius: '9999px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#8A5D00',
              cursor: 'pointer'
            }}
          >
            <FolderOpen size={14} color="#C88D2D" />
            <span>My Resumes ({savedResumesCount})</span>
          </button>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section style={{
        position: 'relative',
        backgroundColor: '#FAF7F2',
        backgroundImage: `
          radial-gradient(circle at 15% 20%, rgba(200, 141, 45, 0.08), transparent 45%),
          radial-gradient(circle at 85% 80%, rgba(120, 20, 22, 0.05), transparent 50%),
          linear-gradient(180deg, #FDFBF8 0%, #FAF7F2 100%)
        `,
        padding: '3rem 1.25rem 2.5rem',
        borderBottom: '1px solid #E8E2D5',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: '#FDF6E8',
            border: '1px solid #E8CD97',
            padding: '0.3rem 0.95rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#8A5D00',
            marginBottom: '1rem',
            boxShadow: '0 2px 6px rgba(200,141,45,0.08)'
          }}>
            <Sparkles size={14} color="#C88D2D" />
            <span>AI Resume Management, ATS Scoring & College Format Replicator</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.1rem, 4.5vw, 3.2rem)',
            fontWeight: 900,
            color: '#1F2421',
            lineHeight: 1.18,
            margin: '0 0 1rem',
            letterSpacing: '-0.025em',
            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif"
          }}>
            Create Your Next <span style={{ color: '#781416' }}>Career-Winning Resume</span>
          </h1>

          <p style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            color: '#57534E',
            lineHeight: 1.6,
            margin: '0 auto 1.75rem',
            maxWidth: '680px'
          }}>
            Store your resumes permanently in the cloud, analyze ATS compatibility with explainable rubrics, replicate your official college template, and tailor your profile for specific job postings.
          </p>

          {/* Trust Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            {[
              '100% Real Database Storage',
              'Debounced Auto-Save',
              'Transparent ATS Scoring',
              'College Placement Templates',
              'Overleaf LaTeX & Word Export'
            ].map((pill, idx) => (
              <div key={idx} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E8E2D5',
                borderRadius: '9999px',
                padding: '0.35rem 0.85rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#44403C'
              }}>
                <CheckCircle2 size={13} color="#059669" />
                <span>{pill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FOUR PRIMARY ACTION CARDS */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.25rem 3.5rem' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          
          {/* Card 1: Create New Resume */}
          <div
            onClick={onStartNewResume}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '2px solid #E8E2D5',
              padding: '1.75rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              position: 'relative'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#781416';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(120,20,22,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E8E2D5';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
            }}
          >
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#FDF0F0',
                color: '#781416',
                borderRadius: '9999px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.72rem',
                fontWeight: 800,
                marginBottom: '1rem'
              }}>
                <Zap size={12} /> Recommended
              </div>

              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#FAF0F0',
                color: '#781416',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Plus size={28} />
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1F2421', margin: '0 0 0.5rem', lineHeight: 1.25 }}>
                Create New Resume
              </h2>

              <p style={{ fontSize: '0.86rem', color: '#66615B', lineHeight: 1.55, margin: '0 0 1.25rem' }}>
                Build an ATS-optimized single page resume from scratch. Live PDF preview, structured section navigation, and 0-latency LaTeX compiling.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid #F5F0E8',
              color: '#781416',
              fontWeight: 800,
              fontSize: '0.86rem'
            }}>
              <span>Launch Editor</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Card 2: Continue My Resume */}
          <div
            onClick={onOpenMyResumes}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '2px solid #E8E2D5',
              padding: '1.75rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              position: 'relative'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#C88D2D';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(200,141,45,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E8E2D5';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
            }}
          >
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#FEF9EE',
                color: '#8A5D00',
                borderRadius: '9999px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.72rem',
                fontWeight: 800,
                marginBottom: '1rem'
              }}>
                <ShieldCheck size={12} /> Permanent Cloud Storage
              </div>

              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#FEF9EE',
                color: '#C88D2D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <RotateCcw size={26} />
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1F2421', margin: '0 0 0.5rem', lineHeight: 1.25 }}>
                Continue My Resume
              </h2>

              <p style={{ fontSize: '0.86rem', color: '#66615B', lineHeight: 1.55, margin: '0 0 1.25rem' }}>
                Access all your previously saved resumes. Update details months or years later without re-entering data. Version history and multi-role drafts included.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid #F5F0E8',
              color: '#8A5D00',
              fontWeight: 800,
              fontSize: '0.86rem'
            }}>
              <span>Open My Resumes ({savedResumesCount})</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Card 3: Import My College Format */}
          <div
            onClick={onOpenCollegeFormat}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '2px solid #E8E2D5',
              padding: '1.75rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              position: 'relative'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#059669';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(5,150,105,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E8E2D5';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
            }}
          >
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                borderRadius: '9999px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.72rem',
                fontWeight: 800,
                marginBottom: '1rem'
              }}>
                <GraduationCap size={12} /> College Placement Special
              </div>

              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Building size={26} />
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1F2421', margin: '0 0 0.5rem', lineHeight: 1.25 }}>
                Import College Format
              </h2>

              <p style={{ fontSize: '0.86rem', color: '#66615B', lineHeight: 1.55, margin: '0 0 1.25rem' }}>
                Upload your college-mandated placement resume format (PDF, DOCX, or scan). We automatically detect headers, tabular education, and replicate the layout.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid #F5F0E8',
              color: '#059669',
              fontWeight: 800,
              fontSize: '0.86rem'
            }}>
              <span>Replicate College Format</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Card 4: Import Existing Resume */}
          <div
            onClick={onOpenImport}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '2px solid #E8E2D5',
              padding: '1.75rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              position: 'relative'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#2563EB';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(37,99,235,0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E8E2D5';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
            }}
          >
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                borderRadius: '9999px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.72rem',
                fontWeight: 800,
                marginBottom: '1rem'
              }}>
                <Sparkles size={12} /> Smart Text & OCR Parsing
              </div>

              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <UploadCloud size={26} />
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1F2421', margin: '0 0 0.5rem', lineHeight: 1.25 }}>
                Import Existing Resume
              </h2>

              <p style={{ fontSize: '0.86rem', color: '#66615B', lineHeight: 1.55, margin: '0 0 1.25rem' }}>
                Upload your old PDF, DOCX, or scanned resume. Our parser auto-extracts your contact info, education, skills, and projects directly into the editor.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid #F5F0E8',
              color: '#2563EB',
              fontWeight: 800,
              fontSize: '0.86rem'
            }}>
              <span>Upload & Parse</span>
              <ArrowRight size={16} />
            </div>
          </div>

        </div>

        {/* 4. DEDICATED TOOLS STRIP (ATS CHECKER & JOB OPTIMIZER) */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1.5px solid #E8E2D5',
          padding: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <div>
            <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#C88D2D', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Advanced Career Optimization Suite
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1F2421', margin: '0.25rem 0 0.35rem 0' }}>
              Evaluate ATS Compatibility & Optimize for Target Jobs
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#66615B', margin: 0, maxWidth: '640px' }}>
              Run comprehensive ATS rubric audits on any resume, or paste a job description to extract matching keywords and generate a customized copy.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onOpenAtsChecker}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#781416',
                backgroundImage: 'linear-gradient(135deg, #8C2232 0%, #681520 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '0.65rem 1.25rem',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(120, 20, 22, 0.25)'
              }}
            >
              <Award size={15} />
              <span>Analyze ATS Score</span>
            </button>

            <button
              type="button"
              onClick={onOpenJobOptimizer}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#FAF5ED',
                color: '#781416',
                border: '1.5px solid #781416',
                borderRadius: '12px',
                padding: '0.65rem 1.25rem',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              <Sliders size={15} />
              <span>AI Job Optimizer</span>
            </button>
          </div>
        </div>

      </section>
    </div>
  );
}
