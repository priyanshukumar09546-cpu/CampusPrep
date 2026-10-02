import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  Check, 
  Home as HomeIcon, 
  Grid, 
  List, 
  ArrowRight,
  BookOpen,
  FileText,
  Lightbulb,
  Download,
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
  Cpu,
  Radio,
  Wrench,
  Building2,
  Code,
  Zap,
  ExternalLink,
  Calendar,
  Award,
  Globe,
  HelpCircle,
  X,
  Flame,
  TrendingUp,
  BarChart2,
  Sigma,
  Folder,
  MessageSquare,
  Calculator,
  FileSearch,
  Target,
  Send,
  Compass,
  Scale,
  Crown,
  History,
  Copy,
  RotateCcw,
  Paperclip,
  Brain
} from 'lucide-react';
import AllIzzWellBanner from '../components/AllIzzWellBanner';
import AcademicResourceBanner from '../components/AcademicResourceBanner';

export default function AIStudyPage({ onNavigate }) {
  // Navigation & Filter States
  const [selectedTool, setSelectedTool] = useState(null); // Active Tool modal / workspace
  const [filterBranches, setFilterBranches] = useState([]);
  const [filterYear, setFilterYear] = useState(null);
  const [filterSubjects, setFilterSubjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectSearchQuery, setSubjectSearchQuery] = useState('');

  // AI Chat & Query State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'virus',
      text: 'Arey B.Tech student! Main hoon Virus (AI Study Buddy). Koi doubt hai, concept clear nahi ho raha, ya PYQ solve karna hai? Kuch bhi puch lo — OS, Data Structures, DBMS, Maths, TAFL... Padhai me 100% help milegi!'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [recentQueries, setRecentQueries] = useState([
    'Explain Deadlock in OS',
    'Normalization in DBMS',
    'Difference between Stack and Queue',
    'What is CN in easy words?',
    'Time complexity of Merge Sort'
  ]);

  // AI Tool Cards Data (Matching Reference)
  const aiTools = [
    {
      id: 'doubt',
      title: 'Ask Doubt',
      desc: 'Get instant answers to your academic doubts.',
      icon: MessageSquare,
      bgColor: '#e0f2fe',
      iconColor: '#0284c7',
      promptPlaceholder: 'Explain DBMS Normalization with 1NF, 2NF, 3NF example...'
    },
    {
      id: 'explain',
      title: 'Explain Topic',
      desc: 'Understand any topic in simple words.',
      icon: BookOpen,
      bgColor: '#fffbeb',
      iconColor: '#d97706',
      promptPlaceholder: 'Explain Virtual Memory and Paging in Operating Systems...'
    },
    {
      id: 'solve',
      title: 'Solve Question',
      desc: 'Get step-by-step solutions with explanation.',
      icon: Calculator,
      bgColor: '#ffe4e6',
      iconColor: '#e11d48',
      promptPlaceholder: 'Solve binary search tree insertion example step by step...'
    },
    {
      id: 'summarize',
      title: 'Summarize Content',
      desc: 'Convert long notes into short, easy summaries.',
      icon: FileSearch,
      bgColor: '#f3e8ff',
      iconColor: '#9333ea',
      promptPlaceholder: 'Summarize Unit 1 Operating System concepts in bullet points...'
    },
    {
      id: 'quiz',
      title: 'Generate Quiz',
      desc: 'Create custom quizzes for any subject or topic.',
      icon: HelpCircle,
      bgColor: '#f3e8ff',
      iconColor: '#7c3aed',
      promptPlaceholder: 'Generate 5 MCQs on Data Structures Trees with answers...'
    },
    {
      id: 'plan',
      title: 'Study Plan',
      desc: 'Get a personalized study plan for your semester.',
      icon: Calendar,
      bgColor: '#e0f2fe',
      iconColor: '#0369a1',
      promptPlaceholder: 'Create a 15-day AKTU semester exam preparation plan for CSE...'
    },
    {
      id: 'compare',
      title: 'Compare Concepts',
      desc: 'Compare topics, formulas and important points.',
      icon: Scale,
      bgColor: '#e0f2fe',
      iconColor: '#0284c7',
      promptPlaceholder: 'Compare Process vs Thread in Operating System with key points...'
    },
    {
      id: 'career',
      title: 'Career Guidance',
      desc: 'Get guidance on skills, careers and more.',
      icon: Target,
      bgColor: '#ffe4e6',
      iconColor: '#be123c',
      promptPlaceholder: 'What skills should a 3rd year CSE student focus on for placements?'
    },
  ];

  // Helper function to send queries to server-side AI endpoint
  const handleSendQuery = async (queryText) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    // Append user message
    setChatMessages(prev => [...prev, { sender: 'user', text: q }]);
    setInputQuery('');
    setIsAiLoading(true);

    // Save to recent queries
    setRecentQueries(prev => [q, ...prev.filter(x => x !== q)].slice(0, 6));

    try {
      // Server-Side OpenAI API Call (Keeps OPENAI_API_KEY secure on server)
      const response = await fetch('/api/ai-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          branch: filterBranches.join(', ') || 'CSE',
          year: filterYear || 'All Years'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [...prev, { sender: 'virus', text: data.reply }]);
      } else {
        // Engineering student-level structured fallback response
        setTimeout(() => {
          let structuredReply = `📌 **Concept & Explanation for "${q}"**:\n\n1. **Core Concept**: Clear understanding of fundamental principles for AKTU exams.\n2. **Detailed Breakdown**: Step-by-step analysis with key diagrams/examples.\n3. **Exam Tip**: Highlight points worth 10/10 marks in semester papers! — Virus`;
          setChatMessages(prev => [...prev, { sender: 'virus', text: structuredReply }]);
          setIsAiLoading(false);
        }, 800);
      }
    } catch (err) {
      setTimeout(() => {
        let structuredReply = `📌 **AKTU Study Guide for "${q}"**:\n\n• **Definition**: Important 7-mark / 10-mark question for AKTU End Sem Exams.\n• **Key Components**: Focus on unit definitions, solved examples, and block diagrams.\n• **Preparation Advice**: Refer to ProfessorVirus PYQs for 5-year repeated questions! — Virus`;
        setChatMessages(prev => [...prev, { sender: 'virus', text: structuredReply }]);
        setIsAiLoading(false);
      }, 800);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilterBranches([]);
    setFilterYear(null);
    setFilterSubjects([]);
    setSearchQuery('');
    setSubjectSearchQuery('');
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1F2421' }}>
      
      {/* 1. LARGE ILLUSTRATED AI STUDY HERO BANNER */}
      <section style={{
        position: 'relative',
        backgroundColor: '#FAF7F2',
        backgroundImage: `
          radial-gradient(rgba(31, 36, 33, 0.04) 1.5px, transparent 1.5px),
          linear-gradient(180deg, #F6F2E9 0%, #FAF7F2 100%)
        `,
        backgroundSize: '24px 24px, 100% 100%',
        padding: '1.75rem 0 2rem 0',
        borderBottom: '2px solid #E8E2D5',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 50% 30%, rgba(200, 141, 45, 0.08), transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr 340px',
            gap: '1.25rem',
            alignItems: 'center'
          }} className="aistudy-hero-grid">

            {/* LEFT: Virus Teacher Mascot & Speech Bubble */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} className="aistudy-left-mascot">
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '0.6rem 0.85rem',
                marginBottom: '0.5rem',
                border: '2px solid #E8D3B0',
                boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#1F2421',
                fontFamily: "'Kalam', cursive",
                lineHeight: 1.3,
                textAlign: 'center',
                position: 'relative'
              }}>
                “Doubt ho? Confusion ho? <br />
                AI se puch! <br />
                Samajh ke Padho!” <br />
                <span style={{ color: '#C88D2D' }}>— Virus</span>

                <div style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0, height: 0,
                  borderLeft: '7px solid transparent',
                  borderRight: '7px solid transparent',
                  borderTop: '10px solid #E8D3B0'
                }} />
              </div>

              <div style={{
                width: '240px',
                height: '200px',
                position: 'relative',
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.08))'
              }}>
                <img
                  src="/assets/hero_board.png"
                  alt="AKTU Study Board"
                  loading="eager"
                  fetchpriority="high"
                  width={240}
                  height={200}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/aistudy_hero_students.png';
                  }}
                />
              </div>
            </div>

            {/* CENTER: Main Title, Subtitle, Search/Ask AI Bar */}
            <div style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '3.4rem',
                  fontWeight: 900,
                  color: '#1F2421',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  textShadow: 'none'
                }}>
                  AI Study
                </h1>
                <Brain size={42} style={{ color: '#C88D2D', filter: 'drop-shadow(0 2px 6px rgba(200,141,45,0.3))' }} />
              </div>

              <div style={{
                fontFamily: "'Kalam', cursive",
                color: '#C88D2D',
                fontSize: '1.35rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                textShadow: 'none'
              }}>
                “Your Personal AI Study Buddy.”
              </div>

              <p style={{ color: '#475569', fontSize: '0.95rem', fontWeight: 500 }}>
                Ask Doubts. Get Clear Concepts. Study Smarter. <br />
                <span style={{ fontSize: '0.8rem', color: '#C88D2D' }}>Powered by AI. Designed for AKTU Students.</span>
              </p>

              {/* Large Search / Ask AI Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuery(searchQuery);
                }}
                style={{
                  width: '100%',
                  maxWidth: '540px',
                  position: 'relative',
                  marginTop: '0.75rem'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  borderRadius: '9999px',
                  padding: '0.35rem 0.4rem 0.35rem 1.25rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06), 0 0 0 2px rgba(200,141,45,0.2)',
                  border: '1px solid #E8E2D5'
                }}>
                  <Search size={18} style={{ color: '#64748b', marginRight: '0.6rem', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Ask anything (e.g. Explain DBMS Normalization, OS Deadlock, DSA...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.92rem',
                      color: '#1F2421',
                      fontWeight: 500,
                      backgroundColor: 'transparent'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      padding: '0.6rem 1.5rem',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      backgroundColor: '#1F2421',
                      borderRadius: '9999px',
                      flexShrink: 0,
                      gap: '0.3rem'
                    }}
                  >
                    Ask AI <ArrowRight size={15} />
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT: Shared All Izz Well Banner */}
            <AllIzzWellBanner title={"Same Doubts,\nBetter Answers, Higher CGPA! :)"} className="aistudy-right-mascot" />

          </div>

        </div>

        <style>{`
          @media (max-width: 1100px) {
            .aistudy-hero-grid { grid-template-columns: 1fr !important; justify-items: center !important; }
            .aistudy-left-mascot, .aistudy-right-mascot { display: none !important; }
          }
        `}</style>
      </section>

      {/* 2. HORIZONTAL AI TOOL STRIP */}
      <section style={{ backgroundColor: '#ffffff', padding: '1.25rem 0', borderBottom: '1px solid #E8E2D5' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))',
            gap: '0.75rem'
          }}>
            {aiTools.map((tool, idx) => {
              const TIcon = tool.icon;
              const isActive = selectedTool?.id === tool.id || (idx === 0 && !selectedTool);
              return (
                <div
                  key={tool.id}
                  onClick={() => setSelectedTool(tool)}
                  style={{
                    backgroundColor: isActive ? '#1F2421' : tool.bgColor,
                    color: isActive ? '#ffffff' : '#1e293b',
                    borderRadius: '16px',
                    padding: '0.85rem 0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: isActive ? '0 6px 16px rgba(31,36,33,0.25)' : '0 2px 8px rgba(0,0,0,0.02)',
                    border: isActive ? '2px solid #1F2421' : '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.transform = 'translateY(0px)';
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : tool.iconColor,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.45rem'
                  }}>
                    <TIcon size={18} />
                  </div>

                  <div style={{ fontSize: '0.88rem', fontWeight: 800, lineHeight: 1.2 }}>
                    {tool.title}
                  </div>

                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    color: isActive ? '#FDF6E8' : '#64748b',
                    marginTop: '0.1rem'
                  }}>
                    {tool.desc.split('.')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. MAIN THREE-COLUMN CONTENT LAYOUT */}
      <div className="container" style={{ padding: '2rem 1.25rem 3rem 1.25rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr 280px',
          gap: '1.5rem',
          alignItems: 'start'
        }} className="aistudy-main-layout">

          {/* LEFT COLUMN: FILTERS SIDEBAR */}
          <aside style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #E8E2D5',
            padding: '1.25rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            position: 'sticky',
            top: '85px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #F6F2E9',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1rem', color: '#1F2421' }}>
                <Filter size={16} style={{ color: '#C88D2D' }} /> Filters
              </div>
              <button
                onClick={handleResetFilters}
                style={{ background: 'none', border: 'none', color: '#C88D2D', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Reset
              </button>
            </div>

            {/* SELECT BRANCH */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={filterTitleStyle}>SELECT BRANCH</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {['CSE', 'ECE', 'ME', 'CE', 'IT', 'EE'].map(b => (
                  <label key={b} style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      checked={filterBranches.includes(b)}
                      onChange={() => {
                        setFilterBranches(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
                      }}
                      style={checkboxInputStyle}
                    />
                    <span style={{ fontSize: '0.82rem', color: '#334155' }}>{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* SELECT YEAR */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={filterTitleStyle}>SELECT YEAR</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {[
                  { name: '1st Year', sem: 'Sem 1 & 2', color: '#FDF6E8', text: '#C88D2D' },
                  { name: '2nd Year', sem: 'Sem 3 & 4', color: '#fffbeb', text: '#d97706' },
                  { name: '3rd Year', sem: 'Sem 5 & 6', color: '#fef2f2', text: '#dc2626' },
                  { name: '4th Year', sem: 'Sem 7 & 8', color: '#f5f3ff', text: '#7c3aed' }
                ].map(y => (
                  <div
                    key={y.name}
                    onClick={() => setFilterYear(filterYear === y.name ? null : y.name)}
                    style={{
                      backgroundColor: filterYear === y.name ? '#1F2421' : y.color,
                      color: filterYear === y.name ? '#ffffff' : y.text,
                      borderRadius: '10px',
                      padding: '0.6rem 0.4rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: '1px solid #E8E2D5',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>{y.name}</div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 500, opacity: 0.8 }}>{y.sem}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SELECT SUBJECT */}
            <div>
              <div style={filterTitleStyle}>SELECT SUBJECT</div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.35rem 0.6rem',
                marginBottom: '0.6rem'
              }}>
                <Search size={13} style={{ color: '#94a3b8', marginRight: '0.4rem' }} />
                <input
                  type="text"
                  placeholder="Search subject..."
                  value={subjectSearchQuery}
                  onChange={(e) => setSubjectSearchQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '0.78rem', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
                {[
                  'Operating System',
                  'Data Structures',
                  'DBMS',
                  'Computer Networks',
                  'OOPs with Java',
                  'Digital Electronics',
                  'Engineering Maths',
                  'Discrete Structures'
                ].map(s => (
                  <label key={s} style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      checked={filterSubjects.includes(s)}
                      onChange={() => {
                        setFilterSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
                      }}
                      style={checkboxInputStyle}
                    />
                    <span style={{ fontSize: '0.82rem', color: '#334155' }}>{s}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* CENTER COLUMN: POPULAR AI STUDY TOOLS OR ACTIVE AI TOOL WORKSPACE */}
          <main>
            {!selectedTool ? (
              <>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                    Popular AI Study Tools
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.1rem' }}>
                    Use these AI tools to make your study journey easier and smarter.
                  </p>
                </div>

                {/* 8 POPULAR AI TOOL CARDS GRID */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem'
                }} className="popular-tools-grid">
                  {aiTools.map(tool => {
                    const TIcon = tool.icon;
                    return (
                      <div
                        key={tool.id}
                        onClick={() => setSelectedTool(tool)}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '18px',
                          border: '1.5px solid #e2e8f0',
                          padding: '1.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all 0.25s ease',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.borderColor = '#C88D2D';
                          e.currentTarget.style.boxShadow = '0 8px 22px rgba(200,141,45,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0px)';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.02)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            backgroundColor: tool.bgColor,
                            color: tool.iconColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <TIcon size={22} />
                          </div>

                          <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                              {tool.title}
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem', lineHeight: 1.3 }}>
                              {tool.desc}
                            </p>
                          </div>
                        </div>

                        <div style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#C88D2D',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          marginTop: '0.4rem'
                        }}>
                          Try Now <ArrowRight size={15} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* ACTIVE AI CHAT / TOOL WORKSPACE INTERFACE */
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                border: '1.5px solid #E8E2D5',
                padding: '1.5rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1.5px solid #E8D3B0',
                  paddingBottom: '0.85rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px',
                      backgroundColor: selectedTool.bgColor, color: selectedTool.iconColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <selectedTool.icon size={22} />
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1F2421' }}>
                        {selectedTool.title} Assistant
                      </h3>
                      <div style={{ fontSize: '0.76rem', color: '#C88D2D', fontWeight: 600 }}>
                        Powered by AI • AKTU Engineering Level
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedTool(null)}
                    className="btn-outline"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}
                  >
                    ← Back to All Tools
                  </button>
                </div>

                {/* Messages Box */}
                <div style={{
                  minHeight: '280px',
                  maxHeight: '380px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  padding: '1rem',
                  backgroundColor: '#FAF7F2',
                  borderRadius: '16px',
                  border: '1px solid #E8E2D5',
                  marginBottom: '1rem'
                }}>
                  {chatMessages.map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        backgroundColor: m.sender === 'user' ? '#1F2421' : '#ffffff',
                        color: m.sender === 'user' ? '#ffffff' : '#1F2421',
                        border: m.sender === 'user' ? 'none' : '1px solid #E8E2D5',
                        padding: '0.85rem 1.1rem',
                        borderRadius: m.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                        fontSize: '0.9rem',
                        lineHeight: 1.45,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                        whiteSpace: 'pre-line'
                      }}
                    >
                      {m.text}
                    </div>
                  ))}

                  {isAiLoading && (
                    <div style={{ color: '#C88D2D', fontSize: '0.85rem', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={16} className="animate-spin" /> Virus is generating structured solution...
                    </div>
                  )}
                </div>

                {/* Input Query Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendQuery(inputQuery);
                  }}
                  style={{ display: 'flex', gap: '0.6rem' }}
                >
                  <input
                    type="text"
                    placeholder={selectedTool.promptPlaceholder || 'Ask anything about AKTU syllabus...'}
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    style={{
                      flex: 1,
                      backgroundColor: '#ffffff',
                      border: '1px solid #E8E2D5',
                      borderRadius: '9999px',
                      padding: '0.65rem 1.1rem',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ backgroundColor: '#1F2421', borderRadius: '9999px', padding: '0.65rem 1.4rem' }}
                  >
                    Send <Send size={16} />
                  </button>
                </form>
              </div>
            )}

            {/* 4. LARGE BOTTOM ILLUSTRATED BANNER */}
            <div style={{
              marginTop: '2.5rem',
              borderRadius: '24px',
              backgroundColor: '#F6F2E9',
              backgroundImage: `linear-gradient(135deg, #FAF7F2 0%, #F0E9DA 100%)`,
              border: '2px solid #E8E2D5',
              boxShadow: '0 10px 28px rgba(0,0,0,0.05)',
              padding: '1.25rem 1.5rem',
              display: 'grid',
              gridTemplateColumns: '260px 1fr 200px',
              gap: '1.25rem',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden'
            }} className="aistudy-bottom-banner">

              {/* Left: Virus with sign AI + STUDY = SUCCESS */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '95px',
                  height: '95px',
                  position: 'relative',
                  filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))',
                  flexShrink: 0
                }}>
                  <img
                    src="/assets/aistudy_bottom_full.png"
                    alt="Virus Character holding AI + STUDY = SUCCESS sign"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/hero_virus.png';
                    }}
                  />
                </div>

                <div style={{
                  fontFamily: "'Kalam', cursive",
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#1F2421',
                  lineHeight: 1.2
                }}>
                  Same Effort <br />
                  Smarter Study <br />
                  <span style={{ color: '#C88D2D', fontSize: '1.2rem' }}>Higher CGPA!</span>
                </div>
              </div>

              {/* Center: Academic Feature Highlights (Replacing 3-boys image) */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid #E8E2D5',
                borderRadius: '16px',
                padding: '0.85rem 1.25rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#92400E'
                  }}>
                    🤖 24/7 AI Buddy
                  </span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#065F46'
                  }}>
                    ✓ Syllabus-Tuned
                  </span>
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#475569',
                  textAlign: 'center'
                }}>
                  Instant AKTU doubt solving, numerical breakdowns & revision notes
                </div>
              </div>

              {/* Right: Sticky Note */}
              <div className="sticky-note" style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontFamily: "'Kalam', cursive",
                fontWeight: 700,
                color: '#1F2421',
                backgroundColor: '#FEF9C3',
                border: '1px solid #FDE047',
                textAlign: 'center',
                boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
                transform: 'rotate(-2deg)'
              }}>
                Padho 📖<br />
                Samjho 💡<br />
                Grow karo 🚀<br />
                <span style={{ color: '#C88D2D', fontSize: '0.82rem' }}>— ProfessorVirus :)</span>
              </div>

            </div>

          </main>

          {/* RIGHT COLUMN: TODAY'S STUDY TIP + RECENT QUERIES + UPGRADE */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* CARD 1: TODAY'S STUDY TIP */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #E8E2D5',
              padding: '1.25rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#eab308', marginBottom: '0.75rem' }}>
                <Lightbulb size={18} />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1F2421' }}>
                  Today's Study Tip
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '65px',
                  height: '70px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1.5px solid #C88D2D',
                  flexShrink: 0
                }}>
                  <img
                    src="/assets/aistudy_tips_virus.png"
                    alt="Virus Avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/navbar_logo.png';
                    }}
                  />
                </div>

                <div className="sticky-note" style={{
                  padding: '0.55rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontFamily: "'Kalam', cursive",
                  fontWeight: 700,
                  color: '#1e293b',
                  lineHeight: 1.3
                }}>
                  “Smart Study is not about studying more, <br />
                  but studying right!” <br />
                  <span style={{ color: '#C88D2D' }}>— Virus :)</span>
                </div>
              </div>
            </div>

            {/* CARD 2: RECENT QUERIES */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #E8E2D5',
              padding: '1.35rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <History size={16} style={{ color: '#C88D2D' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1F2421' }}>
                    Recent Queries
                  </h3>
                </div>
                <button style={{ background: 'none', border: 'none', color: '#C88D2D', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer' }}>
                  View All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {recentQueries.map((rq, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSendQuery(rq)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      color: '#334155',
                      fontWeight: 600,
                      padding: '0.45rem 0.65rem',
                      borderRadius: '8px',
                      backgroundColor: '#FAF7F2',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FDF6E8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FAF7F2';
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rq}</span>
                    <ArrowRight size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* CARD 3: UPGRADE YOUR LEARNING */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #E8E2D5',
              padding: '1.35rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d97706', marginBottom: '0.4rem' }}>
                <Crown size={20} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1F2421' }}>
                  Upgrade Your Learning
                </h3>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, marginBottom: '1rem' }}>
                Get premium AI features, unlimited queries and advanced study tools.
              </p>

              <button
                onClick={() => alert('ProfessorVirus Premium Pro Upgrade!')}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  fontSize: '0.88rem',
                  backgroundColor: '#1F2421',
                  gap: '0.4rem'
                }}
              >
                Upgrade Now <ArrowRight size={16} />
              </button>
            </div>

          </aside>

        </div>
      </div>

      {/* BOTTOM ACADEMIC RESOURCE BANNER */}
      <AcademicResourceBanner onNavigate={onNavigate} />

      <style>{`
        @media (max-width: 1024px) {
          .aistudy-main-layout { grid-template-columns: 1fr !important; }
          .popular-tools-grid { grid-template-columns: 1fr !important; }
          .aistudy-bottom-banner { grid-template-columns: 1fr !important; text-align: center !important; }
        }
      `}</style>

    </div>
  );
}

// Styling Helper Constants
const filterTitleStyle = {
  fontSize: '0.75rem',
  fontWeight: 800,
  color: '#64748b',
  letterSpacing: '0.05em',
  marginBottom: '0.6rem'
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.45rem',
  cursor: 'pointer'
};

const checkboxInputStyle = {
  accentColor: '#1F2421',
  width: '15px',
  height: '15px',
  cursor: 'pointer'
};
