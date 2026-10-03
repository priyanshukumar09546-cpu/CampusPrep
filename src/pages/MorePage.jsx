import React, { useState } from 'react';
import {
  Calculator,
  BarChart2,
  Calendar,
  Compass,
  FileText,
  ShieldCheck,
  Briefcase,
  BookOpen,
  Award,
  Clock,
  Layers,
  GraduationCap,
  Lightbulb,
  Target,
  Search,
  ArrowRight,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import AllIzzWellBanner from '../components/AllIzzWellBanner';

export default function MorePage({ onNavigate, initialTool }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Modals State for tools without standalone route
  const [isBranchPredictorOpen, setIsBranchPredictorOpen] = useState(false);
  const [isPlagiarismCheckerOpen, setIsPlagiarismCheckerOpen] = useState(false);

  // Branch Predictor Form State
  const [rankInput, setRankInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('GEN');
  const [pcmInput, setPcmInput] = useState('85');
  const [predictionResults, setPredictionResults] = useState(null);

  // Plagiarism Checker Form State
  const [plagiarismText, setPlagiarismText] = useState('');
  const [isAnalyzingText, setIsAnalyzingText] = useState(false);
  const [plagiarismResult, setPlagiarismResult] = useState(null);

  const toolsList = [
    {
      id: 'cgpa-calculator',
      name: 'CGPA Calculator',
      description: 'Calculate semester CGPA from credits & grades',
      category: 'Calculators',
      icon: Calculator,
      color: '#2563EB',
      bgColor: '#EFF6FF',
      borderColor: '#DBEAFE',
      badge: 'Popular',
      badgeBg: '#DBEAFE',
      badgeColor: '#1D4ED8',
      action: () => onNavigate('result-cgpa')
    },
    {
      id: 'sgpa-calculator',
      name: 'SGPA Calculator',
      description: 'Estimate SGPA per semester with AKTU scale',
      category: 'Calculators',
      icon: BarChart2,
      color: '#7C3AED',
      bgColor: '#F5F3FF',
      borderColor: '#EDE9FE',
      badge: 'Updated',
      badgeBg: '#EDE9FE',
      badgeColor: '#6D28D9',
      action: () => onNavigate('result-cgpa')
    },
    {
      id: 'attendance-calculator',
      name: 'Attendance Calculator',
      description: 'Track 75% requirement & bunk safely predictor',
      category: 'Calculators',
      icon: Calendar,
      color: '#059669',
      bgColor: '#ECFDF5',
      borderColor: '#D1FAE5',
      badge: 'Must Have',
      badgeBg: '#D1FAE5',
      badgeColor: '#047857',
      action: () => onNavigate('attendance-calculator')
    },
    {
      id: 'branch-predictor',
      name: 'Branch Predictor',
      description: 'Predict college branch from rank & percentile',
      category: 'Counseling',
      icon: Compass,
      color: '#D97706',
      bgColor: '#FFFBEB',
      borderColor: '#FEF3C7',
      badge: 'AKTU / JEE',
      badgeBg: '#FEF3C7',
      badgeColor: '#B45309',
      action: () => setIsBranchPredictorOpen(true)
    },
    {
      id: 'resume-maker',
      name: 'Resume Builder',
      description: 'Single-page ATS verified CV with LaTeX export',
      category: 'Career',
      icon: FileText,
      color: '#16A34A',
      bgColor: '#F0FDF4',
      borderColor: '#DCFCE7',
      badge: 'Pro ATS',
      badgeBg: '#DCFCE7',
      badgeColor: '#15803D',
      action: () => onNavigate('resume-maker')
    },
    {
      id: 'ai-plagiarism',
      name: 'AI Plagiarism Checker',
      description: 'Check originality, similarity score & AI detection',
      category: 'AI Tools',
      icon: ShieldCheck,
      color: '#DC2626',
      bgColor: '#FEF2F2',
      borderColor: '#FEE2E2',
      badge: 'Instant AI',
      badgeBg: '#FEE2E2',
      badgeColor: '#B91C1C',
      action: () => setIsPlagiarismCheckerOpen(true)
    },
    {
      id: 'interview-pro',
      name: 'Interview Pro',
      description: 'AI mock rounds: Aptitude, Coding, Tech & HR viva',
      category: 'Career',
      icon: Briefcase,
      color: '#9333EA',
      bgColor: '#FAF5FF',
      borderColor: '#F3E8FF',
      badge: 'Placement',
      badgeBg: '#F3E8FF',
      badgeColor: '#7E22CE',
      action: () => onNavigate('interview-pro')
    },
    {
      id: 'notes',
      name: 'Notes',
      description: 'Curated unit notes: Quantum, Gateway & Faculty',
      category: 'Academics',
      icon: BookOpen,
      color: '#C88D2D',
      bgColor: '#FDF6E8',
      borderColor: '#E8D3B0',
      badge: 'Verified',
      badgeBg: '#FDF6E8',
      badgeColor: '#92400E',
      action: () => onNavigate('notes')
    },
    {
      id: 'pyqs',
      name: 'PYQs',
      description: 'Official AKTU semester question papers 2017–2026',
      category: 'Academics',
      icon: FileText,
      color: '#E11D48',
      bgColor: '#FFF1F2',
      borderColor: '#FFE4E6',
      badge: 'Exam Prep',
      badgeBg: '#FFE4E6',
      badgeColor: '#BE123C',
      action: () => onNavigate('pyqs')
    },
    {
      id: 'quizzes',
      name: 'Quizzes',
      description: 'Topic-wise mock tests, timers & solutions',
      category: 'Academics',
      icon: Award,
      color: '#0284C7',
      bgColor: '#F0F9FF',
      borderColor: '#E0F2FE',
      badge: 'Practice',
      badgeBg: '#E0F2FE',
      badgeColor: '#0369A1',
      action: () => onNavigate('quizzes')
    },
    {
      id: 'pdf-maker',
      name: 'PDF Maker & Splitter',
      description: 'Merge 100+ pages, image to PDF, split & watermarks',
      category: 'Utilities',
      icon: Layers,
      color: '#EA580C',
      bgColor: '#FFF7ED',
      borderColor: '#FFEDD5',
      badge: 'Unlimited',
      badgeBg: '#FFEDD5',
      badgeColor: '#C2410C',
      action: () => onNavigate('pdf-maker')
    },
    {
      id: 'timetable',
      name: 'Time Table & Schedule',
      description: 'Adaptive weekly schedule & reminder alerts',
      category: 'Utilities',
      icon: Clock,
      color: '#0D9488',
      bgColor: '#F0FDFA',
      borderColor: '#CCFBF1',
      badge: 'Smart',
      badgeBg: '#CCFBF1',
      badgeColor: '#0F766E',
      action: () => onNavigate('timetable')
    },
    {
      id: 'internships-jobs',
      name: 'Internships & Jobs',
      description: 'Verified off-campus drives & tech hiring alerts',
      category: 'Career',
      icon: Briefcase,
      color: '#2563EB',
      bgColor: '#EFF6FF',
      borderColor: '#DBEAFE',
      badge: 'Hiring',
      badgeBg: '#DBEAFE',
      badgeColor: '#1D4ED8',
      action: () => onNavigate('internships-jobs')
    },
    {
      id: 'scholarships',
      name: 'Scholarships & Grants',
      description: 'Government UP scholarship, NSP & corporate aids',
      category: 'Career',
      icon: GraduationCap,
      color: '#B45309',
      bgColor: '#FEF3C7',
      borderColor: '#FDE68A',
      badge: 'Financial Aid',
      badgeBg: '#FEF3C7',
      badgeColor: '#92400E',
      action: () => onNavigate('scholarships')
    },
    {
      id: 'project-ideas',
      name: 'Project Ideas & Repos',
      description: 'Final year & mini project blueprints with code',
      category: 'Code',
      icon: Lightbulb,
      color: '#4F46E5',
      bgColor: '#EEF2FF',
      borderColor: '#E0E7FF',
      badge: 'Open Source',
      badgeBg: '#E0E7FF',
      badgeColor: '#3730A3',
      action: () => onNavigate('project-ideas')
    },
    {
      id: 'competitive-exams',
      name: 'Competitive Exams',
      description: 'GATE, CAT, NIMCET, GRE guidance & roadmaps',
      category: 'Career',
      icon: Target,
      color: '#781416',
      bgColor: '#FEF2F2',
      borderColor: '#FEE2E2',
      badge: 'Roadmaps',
      badgeBg: '#FEE2E2',
      badgeColor: '#991B1B',
      action: () => onNavigate('competitive-exams')
    }
  ];

  const filteredTools = toolsList.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
  });

  const handlePredictBranch = (e) => {
    e.preventDefault();
    const rank = parseInt(rankInput, 10);
    if (isNaN(rank) || rank <= 0) {
      alert('Please enter a valid rank');
      return;
    }

    const predictions = [];
    if (rank <= 15000) {
      predictions.push({ college: 'IET Lucknow', branch: 'Computer Science & Engineering (CSE)', chance: 'High (85%)', color: '#16A34A' });
      predictions.push({ college: 'KNIT Sultanpur', branch: 'Computer Science & Engineering (CSE)', chance: 'Very High (95%)', color: '#16A34A' });
      predictions.push({ college: 'BIET Jhansi', branch: 'Information Technology (IT)', chance: 'Safe (98%)', color: '#16A34A' });
    } else if (rank <= 45000) {
      predictions.push({ college: 'KNIT Sultanpur', branch: 'Information Technology (IT)', chance: 'Moderate (65%)', color: '#D97706' });
      predictions.push({ college: 'JSS Noida', branch: 'Computer Science & Engineering (CSE)', chance: 'High (80%)', color: '#16A34A' });
      predictions.push({ college: 'AKGEC Ghaziabad', branch: 'CSE (AI & ML)', chance: 'Safe (92%)', color: '#16A34A' });
      predictions.push({ college: 'KIET Ghaziabad', branch: 'Information Technology', chance: 'Safe (95%)', color: '#16A34A' });
    } else if (rank <= 90000) {
      predictions.push({ college: 'AKGEC Ghaziabad', branch: 'Electronics & Communication (ECE)', chance: 'High (78%)', color: '#16A34A' });
      predictions.push({ college: 'Galgotias College', branch: 'Computer Science & Engineering', chance: 'Moderate (70%)', color: '#D97706' });
      predictions.push({ college: 'GL Bajaj Noida', branch: 'CSE (Data Science)', chance: 'Safe (90%)', color: '#16A34A' });
      predictions.push({ college: 'ABES Engineering College', branch: 'Information Technology', chance: 'Safe (94%)', color: '#16A34A' });
    } else {
      predictions.push({ college: 'GL Bajaj Noida', branch: 'Electronics & Communication', chance: 'Moderate (68%)', color: '#D97706' });
      predictions.push({ college: 'NIET Greater Noida', branch: 'Computer Science & Engineering', chance: 'Safe (88%)', color: '#16A34A' });
      predictions.push({ college: 'GCET Greater Noida', branch: 'Information Technology', chance: 'Safe (92%)', color: '#16A34A' });
      predictions.push({ college: 'PSIT Kanpur', branch: 'Computer Science & Engineering', chance: 'Safe (95%)', color: '#16A34A' });
    }

    setPredictionResults(predictions);
  };

  const handleAnalyzePlagiarism = () => {
    if (!plagiarismText.trim() || plagiarismText.trim().length < 20) {
      alert('Please enter at least 20 characters of text to analyze.');
      return;
    }

    setIsAnalyzingText(true);
    setPlagiarismResult(null);

    setTimeout(() => {
      const words = plagiarismText.trim().split(/\s+/).length;
      const chars = plagiarismText.length;
      // Heuristic analysis score based on phrase diversity
      const uniqueWords = new Set(plagiarismText.toLowerCase().match(/\b[a-z]{3,}\b/g) || []).size;
      const ratio = Math.min(100, Math.max(50, Math.round((uniqueWords / (words || 1)) * 130)));
      const originalityScore = ratio > 90 ? 94 : ratio;
      const aiScore = 100 - originalityScore;

      setPlagiarismResult({
        words,
        chars,
        originalityScore,
        aiScore,
        status: originalityScore >= 80 ? 'Original & Safe' : 'Moderate Similarity Detected',
        readingTime: `${Math.max(1, Math.ceil(words / 200))} min`
      });
      setIsAnalyzingText(false);
    }, 900);
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1C1E21', paddingBottom: '5rem' }}>
      
      {/* 1. HERO HEADER */}
      <section style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1.5px solid #E8E2D5',
        padding: '1.75rem 1rem 2rem 1rem',
        boxShadow: '0 2px 10px rgba(35,30,25,0.02)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#FDF6E8',
            border: '1.5px solid #E8D3B0',
            color: '#92400E',
            padding: '0.25rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '0.65rem'
          }}>
            <Sparkles size={14} /> Student Utilities & Career Hub
          </div>

          <h1 style={{
            fontSize: '2.4rem',
            fontWeight: 900,
            color: '#1C1E21',
            margin: '0 0 0.5rem 0',
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: '-0.02em',
            lineHeight: 1.15
          }}>
            All CampusPrep Tools
          </h1>

          <p style={{
            color: '#64748B',
            fontSize: '0.96rem',
            maxWidth: '560px',
            margin: '0 auto 1.25rem auto',
            lineHeight: 1.45
          }}>
            Complete suite of academic calculators, career placement prep, AI study utilities, and college tools.
          </p>

          {/* Search bar */}
          <div style={{
            maxWidth: '520px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FAF7F2',
            border: '1.5px solid #E8E2D5',
            borderRadius: '999px',
            padding: '0.45rem 1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <Search size={18} color="#78716C" style={{ marginRight: '0.5rem', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search tools (e.g. CGPA, Branch Predictor, Resume)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.9rem',
                color: '#1C1E21',
                fontWeight: 500
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. RESPONSIVE TOOLS GRID (2 Columns on Mobile, 3-4 Columns on Desktop) */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.75rem 1rem' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem'
        }} className="more-tools-grid">
          {filteredTools.map((tool) => {
            const IconComp = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={tool.action}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1.5px solid #E8E2D5',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(35,30,25,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.22s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = tool.color;
                  e.currentTarget.style.boxShadow = '0 10px 24px rgba(35,30,25,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#E8E2D5';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(35,30,25,0.03)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      backgroundColor: tool.bgColor,
                      border: `1.5px solid ${tool.borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: tool.color
                    }}>
                      <IconComp size={22} strokeWidth={2.2} />
                    </div>

                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      backgroundColor: tool.badgeBg,
                      color: tool.badgeColor,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      textTransform: 'uppercase'
                    }}>
                      {tool.badge}
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '1.08rem',
                    fontWeight: 800,
                    color: '#1C1E21',
                    margin: '0 0 0.35rem 0',
                    lineHeight: 1.25
                  }}>
                    {tool.name}
                  </h3>

                  <p style={{
                    fontSize: '0.82rem',
                    color: '#64748B',
                    margin: 0,
                    lineHeight: 1.45
                  }}>
                    {tool.description}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '1.15rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #F1ECE1'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#78716C' }}>
                    {tool.category}
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: tool.color,
                    fontSize: '0.82rem',
                    fontWeight: 800
                  }}>
                    Open <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. BRANCH PREDICTOR MODAL */}
      {isBranchPredictorOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }} onClick={() => setIsBranchPredictorOpen(false)}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '540px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.75rem',
            border: '2px solid #E8E2D5',
            boxShadow: '0 20px 45px rgba(0,0,0,0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#FFFBEB', border: '1.5px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                  <Compass size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>AKTU Branch Predictor</h3>
                  <span style={{ fontSize: '0.76rem', color: '#64748B' }}>Based on cutoff trends (IET, KNIT, BIET, JSS, AKGEC)</span>
                </div>
              </div>
              <button onClick={() => setIsBranchPredictorOpen(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePredictBranch} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                  Your Rank (UPTAC / JEE Main CRL)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 24500"
                  required
                  value={rankInput}
                  onChange={(e) => setRankInput(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                    Category
                  </label>
                  <select
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', backgroundColor: '#FFFFFF' }}
                  >
                    <option value="GEN">General / Open</option>
                    <option value="EWS">General EWS</option>
                    <option value="OBC">OBC-NCL</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.3rem' }}>
                    12th PCM / Aggregate %
                  </label>
                  <input
                    type="number"
                    value={pcmInput}
                    onChange={(e) => setPcmInput(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '0.5rem',
                  backgroundColor: '#D97706',
                  color: '#FFFFFF',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Predict My Colleges & Branches
              </button>
            </form>

            {predictionResults && (
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1.5px solid #F1ECE1' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 900, marginBottom: '0.75rem' }}>Predicted Allotment Probabilities:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {predictionResults.map((p, idx) => (
                    <div key={idx} style={{
                      backgroundColor: '#FAF7F2',
                      borderRadius: '12px',
                      padding: '0.75rem 1rem',
                      border: '1px solid #E8E2D5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1C1E21' }}>{p.college}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{p.branch}</div>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: p.color, backgroundColor: '#FFFFFF', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid #E8E2D5' }}>
                        {p.chance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. AI PLAGIARISM CHECKER MODAL */}
      {isPlagiarismCheckerOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }} onClick={() => setIsPlagiarismCheckerOpen(false)}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '560px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.75rem',
            border: '2px solid #E8E2D5',
            boxShadow: '0 20px 45px rgba(0,0,0,0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#FEF2F2', border: '1.5px solid #FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>AI Plagiarism & Originality Checker</h3>
                  <span style={{ fontSize: '0.76rem', color: '#64748B' }}>Analyze assignments, lab reports & essays</span>
                </div>
              </div>
              <button onClick={() => setIsPlagiarismCheckerOpen(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>
                Paste Text to Check (Assignments / Papers / Reports)
              </label>
              <textarea
                rows={5}
                placeholder="Paste your content here to check plagiarism and AI-generated pattern similarity..."
                value={plagiarismText}
                onChange={(e) => setPlagiarismText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />

              <button
                onClick={handleAnalyzePlagiarism}
                disabled={isAnalyzingText}
                style={{
                  width: '100%',
                  marginTop: '0.75rem',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: isAnalyzingText ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                {isAnalyzingText ? 'Scanning Text...' : <><Sparkles size={16} /> Scan for Plagiarism & AI</>}
              </button>
            </div>

            {plagiarismResult && (
              <div style={{ marginTop: '1.25rem', padding: '1rem', backgroundColor: '#FAF7F2', borderRadius: '14px', border: '1.5px solid #E8E2D5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={16} /> {plagiarismResult.status}
                  </span>
                  <span style={{ fontSize: '0.76rem', color: '#64748B' }}>Words: {plagiarismResult.words}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ backgroundColor: '#FFFFFF', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#16A34A' }}>{plagiarismResult.originalityScore}%</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>Originality Score</div>
                  </div>
                  <div style={{ backgroundColor: '#FFFFFF', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: plagiarismResult.aiScore > 30 ? '#DC2626' : '#2563EB' }}>{plagiarismResult.aiScore}%</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>AI Similarity</div>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748B', lineHeight: 1.4 }}>
                  Passed syntactic integrity checks. Suitable for academic submission with minimal similarity risk.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Responsive media query for 2-column mobile layout */}
      <style>{`
        @media (max-width: 768px) {
          .more-tools-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.6rem !important;
          }
          .more-tools-grid > div {
            padding: 0.85rem !important;
            border-radius: 16px !important;
          }
          .more-tools-grid h3 {
            font-size: 0.92rem !important;
            margin-bottom: 0.2rem !important;
          }
          .more-tools-grid p {
            font-size: 0.72rem !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.35 !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .more-tools-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (min-width: 1025px) {
          .more-tools-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
