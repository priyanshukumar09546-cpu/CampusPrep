import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  Check, 
  Home as HomeIcon, 
  Grid, 
  List, 
  SlidersHorizontal, 
  ArrowRight,
  BookOpen,
  FileText,
  CheckCircle2,
  BarChart2,
  Target,
  Download,
  Eye,
  Filter,
  TrendingUp,
  Cpu,
  Radio,
  Wrench,
  Building2,
  Code,
  Zap,
  Globe,
  Brain,
  Layers,
  Database,
  Terminal,
  Share2,
  Sparkles,
  X,
  PlusCircle,
  Clock,
  Star,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  BookMarked
} from 'lucide-react';
import { AKTU_SYLLABUS_DATA, searchAktuSyllabus } from '../data/aktuSyllabusData';
import { AKTU_PYQ_DATA, searchAktuPyqs } from '../data/aktuPyqData';
import { downloadUnitZip } from '../utils/zipDownloader';

export default function PYQsPage({ onNavigate, onOpenAuth }) {
  // Navigation Flow State: Branch -> Year -> Semester -> Subject -> Unit
  const [activeBranch, setActiveBranch] = useState(null);
  const [activeYear, setActiveYear] = useState(null);
  const [activeSemester, setActiveSemester] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);

  // Filter Checkbox & Select States
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedSemesters, setSelectedSemesters] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('All');
  const [selectedExamYearFilter, setSelectedExamYearFilter] = useState('All');
  
  // Search, View & Sort States
  const [subjectSearchQuery, setSubjectSearchQuery] = useState('');
  const [heroSearchQuery, setHeroSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('latest');
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);

  // Request PYQ Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestPyqInfo, setRequestPyqInfo] = useState(null);

  // Branch Category Cards List
  const branchesList = [
    { id: 'CSE', name: 'CSE', fullName: 'Computer Science & Engineering', icon: Code, color: '#0284c7', bg: '#e0f2fe' },
    { id: 'ECE', name: 'ECE', fullName: 'Electronics & Communication', icon: Cpu, color: '#db2777', bg: '#fce7f3' },
    { id: 'ME', name: 'ME', fullName: 'Mechanical Engineering', icon: Wrench, color: '#ea580c', bg: '#ffedd5' },
    { id: 'CE', name: 'CE', fullName: 'Civil Engineering', icon: Building2, color: '#0d9488', bg: '#ccfbf1' },
    { id: 'IT', name: 'IT', fullName: 'Information Technology', icon: Radio, color: '#9333ea', bg: '#f3e8ff' },
    { id: 'EE', name: 'EE', fullName: 'Electrical Engineering', icon: Zap, color: '#4f46e5', bg: '#e0e7ff' },
    { id: 'AI & DS', name: 'AI & DS', fullName: 'Artificial Intelligence & Data Science', icon: Sparkles, color: '#2563eb', bg: '#dbeafe' },
    { id: 'Maths', name: 'Maths', fullName: 'Applied Sciences & Mathematics', icon: BookOpen, color: '#e11d48', bg: '#ffe4e6' }
  ];

  // Dynamic Dependent Options for Subject Filter
  const availableSubjectOptions = useMemo(() => {
    let list = searchAktuSyllabus('', {
      branch: activeBranch || (selectedBranches.length === 1 ? selectedBranches[0] : null),
      year: activeYear || (selectedYears.length === 1 ? selectedYears[0] : null),
      semester: activeSemester || (selectedSemesters.length === 1 ? selectedSemesters[0] : null)
    });
    return list.map(s => s.subject);
  }, [activeBranch, activeYear, activeSemester, selectedBranches, selectedYears, selectedSemesters]);

  // Verified AKTU PYQs Filtered Search (Syllabus-driven source of truth)
  const filteredPyqSubjects = useMemo(() => {
    let result = searchAktuSyllabus(heroSearchQuery || subjectSearchQuery, {
      branch: activeBranch,
      year: activeYear,
      semester: activeSemester
    });

    if (selectedBranches.length > 0) {
      result = result.filter(s => 
        selectedBranches.includes(s.branch) || 
        (s.applicableBranches && (
          s.applicableBranches.includes('ALL') ||
          s.applicableBranches.some(b => selectedBranches.includes(b))
        )) ||
        s.year === '1st Year'
      );
    }
    if (selectedYears.length > 0) {
      result = result.filter(s => selectedYears.some(y => s.year.toLowerCase().includes(y.toLowerCase().slice(0, 3))));
    }
    if (selectedSemesters.length > 0) {
      result = result.filter(s => selectedSemesters.includes(s.semester));
    }
    if (selectedSubjects.length > 0) {
      result = result.filter(s => selectedSubjects.includes(s.subject));
    }

    // Attach PYQ records if present
    return result.map(sObj => {
      const matchPyqObj = AKTU_PYQ_DATA.find(p => p.code === sObj.code || p.subject === sObj.subject);
      const updatedUnits = sObj.units.map(uObj => {
        let unitPyqs = [];
        if (matchPyqObj) {
          const matchUnit = matchPyqObj.units.find(u => u.unitNo === uObj.unitNo);
          if (matchUnit && matchUnit.pyqs) {
            unitPyqs = matchUnit.pyqs;
          }
        }
        if (selectedExamYearFilter !== 'All') {
          unitPyqs = unitPyqs.filter(p => p.examYear && p.examYear.includes(selectedExamYearFilter));
        }
        return {
          ...uObj,
          pyqs: unitPyqs
        };
      });

      if (selectedUnitFilter !== 'All') {
        const uNum = parseInt(selectedUnitFilter.replace('Unit ', ''), 10);
        return {
          ...sObj,
          units: updatedUnits.filter(u => u.unitNo === uNum)
        };
      }

      return {
        ...sObj,
        units: updatedUnits
      };
    });
  }, [activeBranch, activeYear, activeSemester, selectedBranches, selectedYears, selectedSemesters, selectedSubjects, selectedUnitFilter, selectedExamYearFilter, heroSearchQuery, subjectSearchQuery]);

  // Handle Branch Click -> Open Year Selection
  const handleSelectBranchCard = (bId) => {
    setActiveBranch(bId);
    setActiveYear(null);
    setActiveSemester(null);
    setActiveSubject(null);
    setSelectedBranches([bId]);
  };

  // Handle Year Click -> Open All Subjects for Selected Year
  const handleSelectYearCard = (yStr) => {
    setActiveYear(yStr);
    setActiveSemester(null);
    setActiveSubject(null);
    setSelectedYears([yStr]);
  };

  // Handle Semester Filter Pill Click
  const handleSelectSemesterCard = (semStr) => {
    setActiveSemester(semStr);
    setActiveSubject(null);
    setSelectedSemesters(semStr ? [semStr] : []);
  };

  // Handle Subject Click -> Open Unit Breakdown Page
  const handleSelectSubjectCard = (subjectObj) => {
    setActiveSubject(subjectObj);
    setExpandedSubjectId(subjectObj.id);
  };

  // Clear All Navigation & Filters
  const handleClearAll = () => {
    setActiveBranch(null);
    setActiveYear(null);
    setActiveSemester(null);
    setActiveSubject(null);
    setSelectedBranches([]);
    setSelectedYears([]);
    setSelectedSemesters([]);
    setSelectedSubjects([]);
    setSelectedUnitFilter('All');
    setSelectedExamYearFilter('All');
    setSubjectSearchQuery('');
    setHeroSearchQuery('');
  };

  // Download ZIP Handler for PYQ Papers
  const handleDownloadUnitZip = async (subjectObj, unitObj) => {
    if (!unitObj.pyqs || unitObj.pyqs.length === 0) {
      alert(`No downloadable PYQ papers exist for Unit ${unitObj.unitNo} yet. Requesting PYQ paper from team...`);
      setRequestPyqInfo({ subject: subjectObj, unit: unitObj });
      setIsRequestModalOpen(true);
      return;
    }

    await downloadUnitZip({
      subjectCode: subjectObj.code,
      subjectName: `${subjectObj.subject} (PYQs)`,
      unitNo: unitObj.unitNo,
      unitTitle: unitObj.title,
      topics: unitObj.topics,
      notes: unitObj.pyqs.map(p => ({
        title: p.title,
        fileUrl: p.fileUrl,
        author: `AKTU Exam ${p.examYear}`,
        type: 'PYQ Paper'
      }))
    });
  };

  return (
    <div style={{ backgroundColor: '#f9f7f1', minHeight: '100vh', color: '#1e293b' }}>
      
      {/* 1. HERO CHALKBOARD BANNER */}
      <section style={{
        position: 'relative',
        backgroundColor: '#0c3829',
        backgroundImage: `
          radial-gradient(rgba(255, 255, 255, 0.05) 1.5px, transparent 1.5px),
          linear-gradient(180deg, #07271c 0%, #0c3829 100%)
        `,
        backgroundSize: '24px 24px, 100% 100%',
        padding: '1.75rem 0 2rem 0',
        borderBottom: '4px solid #1a563f',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(12, 56, 41, 0.35)'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '250px 1fr 320px',
            gap: '1.25rem',
            alignItems: 'center'
          }} className="pyqs-hero-grid">

            {/* LEFT: Virus Mascot Quote */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} className="pyqs-left-mascot">
              <div style={{
                backgroundColor: '#ffffff', borderRadius: '16px', padding: '0.6rem 0.85rem', marginBottom: '0.5rem',
                border: '2px solid #0e4d34', boxShadow: '0 8px 20px rgba(0,0,0,0.25)', fontSize: '0.85rem', fontWeight: 700,
                color: '#0f172a', fontFamily: "'Kalam', cursive", lineHeight: 1.3, textAlign: 'center', position: 'relative'
              }}>
                “AKTU PYQ solved hai! <br />
                Padhai shuru karo!” <br />
                <span style={{ color: '#059669' }}>— Virus</span>
                <div style={{
                  position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
                  width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '10px solid #0e4d34'
                }} />
              </div>

              <div style={{ width: '220px', height: '240px', position: 'relative', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))' }}>
                <img
                  src="/assets/pyqs_hero_virus.png"
                  alt="Virus Teacher Mascot"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/hero_virus.png';
                  }}
                />
              </div>
            </div>

            {/* CENTER: Main Title & Search Bar */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: '3.4rem', fontWeight: 900, color: '#ffffff',
                  lineHeight: 1.1, letterSpacing: '-0.02em', textShadow: '0 4px 14px rgba(0,0,0,0.4)'
                }}>
                  Previous Year Questions
                </h1>
                <FileText size={42} style={{ color: '#34d399', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }} />
              </div>

              <div style={{ fontFamily: "'Kalam', cursive", color: '#fde047', fontSize: '1.35rem', fontWeight: 700 }}>
                AKTU Solved Papers & Unit-wise Question Bank
              </div>

              <p style={{ color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 500, maxWidth: '500px' }}>
                Authentic AKTU B.Tech Question Papers (2014-2025) <br />
                Categorized by Branch, Year, Semester, and Syllabus Unit.
              </p>

              {/* Search Bar */}
              <form onSubmit={(e) => e.preventDefault()} style={{ width: '100%', maxWidth: '540px', position: 'relative', marginTop: '0.75rem' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: '9999px',
                  padding: '0.35rem 0.4rem 0.35rem 1.25rem', boxShadow: '0 8px 25px rgba(0,0,0,0.35)', border: '1px solid #cbd5e1'
                }}>
                  <Search size={18} style={{ color: '#64748b', marginRight: '0.6rem', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search PYQs by subject code (e.g. KCS-401), topic, or exam year..."
                    value={heroSearchQuery}
                    onChange={(e) => setHeroSearchQuery(e.target.value)}
                    style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.92rem', color: '#0f172a', fontWeight: 500, backgroundColor: 'transparent' }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem', fontWeight: 700, backgroundColor: '#0d5c3a', borderRadius: '9999px', flexShrink: 0 }}>
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT: Students Graphic */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} className="pyqs-right-mascot">
              <div style={{ fontFamily: "'Kalam', cursive", color: '#fef08a', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.3rem' }}>
                Exam Crack Karna Hai? <br /> PYQs Solve Karo! :)
              </div>

              <div style={{ width: '300px', height: '190px', position: 'relative', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))' }}>
                <img
                  src="/assets/pyqs_hero_students.png"
                  alt="Students Preparing for Exam"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/hero_students.png';
                  }}
                />
              </div>

              <div className="sticky-note" style={{
                position: 'absolute', top: '15px', left: '-10px', width: '145px', padding: '0.5rem 0.6rem',
                borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, color: '#1e293b', transform: 'rotate(-4deg)'
              }}>
                <div>✓ Verified Papers</div>
                <div>✓ Solved Solutions</div>
                <div>✓ Repeat Questions</div>
                <div style={{ color: '#047857', fontFamily: "'Kalam', cursive", textAlign: 'right', marginTop: '0.2rem' }}>— CampusPrep :)</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE BREADCRUMBS BAR */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #eae5d9', padding: '0.75rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, flexWrap: 'wrap' }}>
            <button
              onClick={handleClearAll}
              style={{ background: 'none', border: 'none', color: '#0d5c3a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 }}
            >
              <HomeIcon size={15} /> PYQs
            </button>

            {activeBranch && (
              <>
                <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                <button
                  onClick={() => { setActiveYear(null); setActiveSemester(null); setActiveSubject(null); }}
                  style={{ background: 'none', border: 'none', color: activeYear ? '#0d5c3a' : '#0f172a', cursor: 'pointer', fontWeight: activeYear ? 600 : 800 }}
                >
                  {activeBranch}
                </button>
              </>
            )}

            {activeYear && (
              <>
                <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                <button
                  onClick={() => { setActiveSemester(null); setActiveSubject(null); }}
                  style={{ background: 'none', border: 'none', color: activeSemester ? '#0d5c3a' : '#0f172a', cursor: 'pointer', fontWeight: activeSemester ? 600 : 800 }}
                >
                  {activeYear}
                </button>
              </>
            )}

            {activeSemester && (
              <>
                <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                <button
                  onClick={() => setActiveSubject(null)}
                  style={{ background: 'none', border: 'none', color: activeSubject ? '#0d5c3a' : '#0f172a', cursor: 'pointer', fontWeight: activeSubject ? 600 : 800 }}
                >
                  {activeSemester}
                </button>
              </>
            )}

            {activeSubject && (
              <>
                <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                <span style={{ color: '#0d5c3a', fontWeight: 800 }}>
                  {activeSubject.subject} ({activeSubject.code})
                </span>
              </>
            )}
          </div>

          {(activeBranch || activeYear || activeSemester || activeSubject) && (
            <button
              onClick={handleClearAll}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <X size={14} /> Reset Flow
            </button>
          )}
        </div>
      </section>

      {/* 3. MAIN THREE-COLUMN LAYOUT */}
      <div className="container" style={{ padding: '2rem 1.25rem 3rem 1.25rem' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '240px 1fr 280px', gap: '1.5rem', alignItems: 'start'
        }} className="pyqs-main-layout">

          {/* LEFT SIDEBAR: FILTERS */}
          <aside style={{
            backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.25rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)', position: 'sticky', top: '85px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                <Filter size={16} style={{ color: '#0d5c3a' }} /> Filters
              </div>
              <button onClick={handleClearAll} style={{ background: 'none', border: 'none', color: '#0d5c3a', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                Clear All
              </button>
            </div>

            {/* SELECT BRANCH */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={filterTitleStyle}>SELECT BRANCH</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {['CSE', 'ME', 'ECE', 'IT', 'CE', 'EE', 'AI & DS', 'Maths'].map(b => (
                  <label key={b} style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      checked={activeBranch === b || selectedBranches.includes(b)}
                      onChange={() => handleSelectBranchCard(b)}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => (
                  <label key={y} style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      checked={activeYear === y || selectedYears.includes(y)}
                      onChange={() => handleSelectYearCard(y)}
                      style={checkboxInputStyle}
                    />
                    <span style={{ fontSize: '0.82rem', color: '#334155' }}>{y}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* SELECT SEMESTER */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={filterTitleStyle}>SELECT SEMESTER</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'].map(s => (
                  <label key={s} style={checkboxLabelStyle}>
                    <input
                      type="checkbox"
                      checked={activeSemester === s || selectedSemesters.includes(s)}
                      onChange={() => handleSelectSemesterCard(s)}
                      style={checkboxInputStyle}
                    />
                    <span style={{ fontSize: '0.82rem', color: '#334155' }}>{s}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* DEPENDENT SUBJECT FILTER DROPDOWN */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={filterTitleStyle}>SUBJECT</div>
              <select
                value={selectedSubjects[0] || ''}
                onChange={(e) => setSelectedSubjects(e.target.value ? [e.target.value] : [])}
                style={{
                  width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.45rem 0.6rem',
                  fontSize: '0.82rem', backgroundColor: '#ffffff', outline: 'none', fontWeight: 600, color: '#334155'
                }}
              >
                <option value="">All Subjects</option>
                {availableSubjectOptions.map(subName => (
                  <option key={subName} value={subName}>{subName}</option>
                ))}
              </select>
            </div>

            {/* UNIT FILTER */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={filterTitleStyle}>UNIT</div>
              <select
                value={selectedUnitFilter}
                onChange={(e) => setSelectedUnitFilter(e.target.value)}
                style={{
                  width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.45rem 0.6rem',
                  fontSize: '0.82rem', backgroundColor: '#ffffff', outline: 'none', fontWeight: 600, color: '#334155'
                }}
              >
                <option value="All">All Units</option>
                <option value="Unit 1">Unit 1</option>
                <option value="Unit 2">Unit 2</option>
                <option value="Unit 3">Unit 3</option>
                <option value="Unit 4">Unit 4</option>
                <option value="Unit 5">Unit 5</option>
              </select>
            </div>

            {/* EXAM YEAR FILTER */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={filterTitleStyle}>EXAM YEAR</div>
              <select
                value={selectedExamYearFilter}
                onChange={(e) => setSelectedExamYearFilter(e.target.value)}
                style={{
                  width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.45rem 0.6rem',
                  fontSize: '0.82rem', backgroundColor: '#ffffff', outline: 'none', fontWeight: 600, color: '#334155'
                }}
              >
                <option value="All">All Exam Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2017">2017</option>
              </select>
            </div>

            {/* SORT BY */}
            <div>
              <div style={filterTitleStyle}>SORT BY</div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.45rem 0.6rem',
                  fontSize: '0.82rem', backgroundColor: '#ffffff', outline: 'none', fontWeight: 600, color: '#334155'
                }}
              >
                <option value="latest">Latest Exam Session</option>
                <option value="solved">Solved Papers First</option>
              </select>
            </div>
          </aside>

          {/* CENTER WORKSPACE: MULTI-STEP PYQ NAVIGATION FLOW */}
          <main style={{ minWidth: 0 }}>

            {/* STEP 1: TOP-LEVEL BRANCH SELECTION */}
            {!activeBranch && (
              <div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>
                    Select Your Branch for AKTU PYQs
                  </h2>
                  <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Access verified AKTU 10-year question papers categorized by year, semester, and syllabus unit.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  {branchesList.map(b => {
                    const BIcon = b.icon;
                    return (
                      <div
                        key={b.id}
                        onClick={() => handleSelectBranchCard(b.id)}
                        style={{
                          backgroundColor: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0',
                          padding: '1.25rem', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.borderColor = b.color;
                          e.currentTarget.style.boxShadow = `0 10px 25px ${b.color}20`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0px)';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.02)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: b.bg, color: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BIcon size={22} />
                          </div>
                          <ArrowRight size={18} style={{ color: '#94a3b8' }} />
                        </div>

                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>
                          {b.id}
                        </div>

                        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500, marginTop: '0.25rem' }}>
                          {b.fullName}
                        </div>

                        <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, marginTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          View Years & Semesters →
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: YEAR SELECTION FOR CHOSEN BRANCH */}
            {activeBranch && !activeYear && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <button onClick={() => setActiveBranch(null)} style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.4rem 0.6rem', cursor: 'pointer', color: '#334155' }}>
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>
                      {activeBranch} — Select Academic Year
                    </h2>
                    <p style={{ fontSize: '0.86rem', color: '#64748b', marginTop: '0.1rem' }}>
                      Select academic year to view verified AKTU sem question papers.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { year: '1st Year', sems: 'Semester 1 & 2', desc: 'Mathematics-I, Physics, and Programming PYQs.' },
                    { year: '2nd Year', sems: 'Semester 3 & 4', desc: 'Data Structures, OS, Digital Electronics PYQs.' },
                    { year: '3rd Year', sems: 'Semester 5 & 6', desc: 'DBMS, Computer Networks, Algorithms PYQs.' },
                    { year: '4th Year', sems: 'Semester 7 & 8', desc: 'Artificial Intelligence, Cloud Computing PYQs.' }
                  ].map((item) => (
                    <div
                      key={item.year}
                      onClick={() => handleSelectYearCard(item.year)}
                      style={{
                        backgroundColor: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0',
                        padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = '#0d5c3a';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0px)';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
                          {item.year}
                        </div>
                        <ArrowRight size={20} style={{ color: '#0d5c3a' }} />
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669', marginBottom: '0.4rem' }}>
                        {item.sems}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3 & 4: SUBJECTS & UNIT-WISE PYQs BREAKDOWN */}
            {activeBranch && activeYear && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      onClick={() => {
                        if (activeSubject) setActiveSubject(null);
                        else if (activeSemester) setActiveSemester(null);
                        else setActiveYear(null);
                      }}
                      style={{ background: 'none', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.4rem 0.6rem', cursor: 'pointer', color: '#334155' }}
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <div>
                      <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                        {activeSubject ? activeSubject.subject : `${activeBranch} • ${activeYear} Previous Year Questions`}
                      </h2>
                      <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.15rem', margin: 0 }}>
                        {activeSubject ? `Subject Code: ${activeSubject.code} • ${activeSubject.units.length} Syllabus Units` : `Official AKTU Syllabus Subjects & Question Papers (${filteredPyqSubjects.length})`}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {/* SEMESTER QUICK FILTER PILLS */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#ffffff', padding: '0.2rem', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                      <button
                        onClick={() => handleSelectSemesterCard(null)}
                        style={{
                          padding: '0.3rem 0.7rem', borderRadius: '7px', border: 'none',
                          backgroundColor: !activeSemester ? '#0d5c3a' : 'transparent',
                          color: !activeSemester ? '#ffffff' : '#475569',
                          fontWeight: 700, fontSize: '0.76rem', cursor: 'pointer'
                        }}
                      >
                        All Semesters
                      </button>
                      {(activeYear === '1st Year' ? ['Sem 1', 'Sem 2'] :
                        activeYear === '2nd Year' ? ['Sem 3', 'Sem 4'] :
                        activeYear === '3rd Year' ? ['Sem 5', 'Sem 6'] :
                        ['Sem 7', 'Sem 8']).map(sem => (
                          <button
                            key={sem}
                            onClick={() => handleSelectSemesterCard(sem)}
                            style={{
                              padding: '0.3rem 0.7rem', borderRadius: '7px', border: 'none',
                              backgroundColor: activeSemester === sem ? '#0d5c3a' : 'transparent',
                              color: activeSemester === sem ? '#ffffff' : '#475569',
                              fontWeight: 700, fontSize: '0.76rem', cursor: 'pointer'
                            }}
                          >
                            {sem}
                          </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.2rem' }}>
                      <button onClick={() => setViewMode('grid')} style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: 'none', backgroundColor: viewMode === 'grid' ? '#0d5c3a' : 'transparent', color: viewMode === 'grid' ? '#ffffff' : '#64748b', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                        <Grid size={13} />
                      </button>
                      <button onClick={() => setViewMode('list')} style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: 'none', backgroundColor: viewMode === 'list' ? '#0d5c3a' : 'transparent', color: viewMode === 'list' ? '#ffffff' : '#64748b', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                        <List size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* IF NO SUBJECTS MATCH FILTER */}
                {filteredPyqSubjects.length === 0 ? (
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1.5px solid #e2e8f0', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                    <BookMarked size={48} style={{ color: '#94a3b8', margin: '0 auto 1rem auto' }} />
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>No Verified PYQ Papers Found</h3>
                    <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '420px', margin: '0.4rem auto 1.25rem auto' }}>
                      No subjects found matching your active filter criteria.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                      <button onClick={handleClearAll} className="btn-primary" style={{ padding: '0.55rem 1.2rem', backgroundColor: '#0d5c3a', fontSize: '0.85rem' }}>
                        Clear Filters
                      </button>
                      <button onClick={() => setIsRequestModalOpen(true)} className="btn-outline" style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}>
                        Request PYQ
                      </button>
                    </div>
                  </div>
                ) : (
                  /* SUBJECT CARDS & EXPANDED UNIT PYQ BREAKDOWN */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {filteredPyqSubjects.map(sub => {
                      const isExpanded = activeSubject ? activeSubject.id === sub.id : expandedSubjectId === sub.id;
                      return (
                        <div
                          key={sub.id}
                          style={{
                            backgroundColor: '#ffffff', borderRadius: '20px', border: isExpanded ? '2px solid #0d5c3a' : '1px solid #e2e8f0',
                            padding: '1.35rem', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', transition: 'all 0.2s ease'
                          }}
                        >
                          {/* Subject Top Header */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                <span style={{ backgroundColor: '#e6f4ed', color: '#0d5c3a', fontWeight: 800, fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                                  {sub.code}
                                </span>
                                <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
                                  {sub.branch} • {sub.year} • {sub.semester}
                                </span>
                              </div>
                              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                                {sub.subject}
                              </h3>
                            </div>

                            <button
                              onClick={() => {
                                if (isExpanded) {
                                  setExpandedSubjectId(null);
                                  if (activeSubject) setActiveSubject(null);
                                } else {
                                  handleSelectSubjectCard(sub);
                                }
                              }}
                              className="btn-outline"
                              style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', fontWeight: 700, borderColor: '#0d5c3a', color: '#0d5c3a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                            >
                              <span>{isExpanded ? 'Hide PYQs' : `View ${sub.units.length} Units PYQs`}</span>
                              <ChevronDown size={16} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                            </button>
                          </div>

                          <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '0.5rem', lineHeight: 1.4 }}>
                            {sub.description}
                          </p>

                          {/* EXPANDABLE UNIT-BY-UNIT PYQs BREAKDOWN */}
                          {isExpanded && (
                            <div style={{ marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                Official AKTU Syllabus Units & Verified Question Papers
                              </div>

                              {sub.units.map(u => {
                                const hasPyqs = u.pyqs && u.pyqs.length > 0;
                                return (
                                  <div
                                    key={u.unitNo}
                                    style={{
                                      backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1rem',
                                      display: 'flex', flexDirection: 'column', gap: '0.65rem'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0f172a' }}>
                                        Unit {u.unitNo}: {u.title}
                                      </div>
                                      <span style={{
                                        fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.55rem', borderRadius: '4px',
                                        backgroundColor: hasPyqs ? '#e6f4ed' : '#fef2f2', color: hasPyqs ? '#059669' : '#dc2626'
                                      }}>
                                        {hasPyqs ? `${u.pyqs.length} Verified PYQ Papers` : 'PYQ not available yet'}
                                      </span>
                                    </div>

                                    {/* Topics list */}
                                    <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                                      <strong>Focus Topics:</strong> {u.topics.join(' • ')}
                                    </div>

                                    {/* PYQ Actions Row: [View PYQ] & [Download ZIP] */}
                                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.3rem' }}>
                                      {hasPyqs ? (
                                        <>
                                          {u.pyqs.map(p => (
                                            <button
                                              key={p.id}
                                              onClick={() => {
                                                const targetUrl = p.fileUrl || p.sourceUrl;
                                                if (targetUrl) {
                                                  window.open(targetUrl, '_blank', 'noopener,noreferrer');
                                                } else {
                                                  alert('PYQ paper is being updated.');
                                                }
                                              }}
                                              className="btn-primary"
                                              style={{
                                                backgroundColor: '#0d5c3a', padding: '0.45rem 0.9rem', fontSize: '0.78rem', borderRadius: '8px',
                                                display: 'flex', alignItems: 'center', gap: '0.35rem'
                                              }}
                                            >
                                              <Eye size={14} />
                                              <span>View PYQ ({p.examYear || '2024'})</span>
                                              <ExternalLink size={12} />
                                            </button>
                                          ))}

                                          <button
                                            onClick={() => handleDownloadUnitZip(sub, u)}
                                            className="btn-outline"
                                            style={{
                                              padding: '0.45rem 0.9rem', fontSize: '0.78rem', borderRadius: '8px', borderColor: '#0284c7', color: '#0284c7',
                                              display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700
                                            }}
                                          >
                                            <Download size={14} />
                                            <span>Download ZIP</span>
                                          </button>
                                        </>
                                      ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', width: '100%' }}>
                                          <span style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', fontWeight: 500 }}>
                                            PYQ not available yet.
                                          </span>
                                          <button
                                            onClick={() => {
                                              setRequestPyqInfo({ subject: sub, unit: u });
                                              setIsRequestModalOpen(true);
                                            }}
                                            className="btn-outline"
                                            style={{
                                              padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '6px', borderColor: '#0d5c3a', color: '#0d5c3a',
                                              display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700
                                            }}
                                          >
                                            <PlusCircle size={13} /> Request PYQ
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

          </main>

          {/* RIGHT COLUMN: QUICK STATS + STUDY TIPS BY VIRUS */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.35rem', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#e6f4ed', color: '#0d5c3a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={18} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Exam Preparation
                </h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4, marginBottom: '1rem' }}>
                Solving 5-year AKTU PYQs increases end-sem pass rates by 94%.
              </p>
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="btn-primary"
                style={{ width: '100%', padding: '0.65rem', fontSize: '0.88rem', backgroundColor: '#0d5c3a', gap: '0.4rem' }}
              >
                Request Missing Paper <ArrowRight size={16} />
              </button>
            </div>

            {/* STUDY TIPS BY VIRUS */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#eab308', marginBottom: '0.75rem' }}>
                <Sparkles size={18} />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  Exam Tips by Virus
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '65px', height: '75px', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #0d5c3a', flexShrink: 0 }}>
                  <img
                    src="/assets/pyqs_tips_virus.png"
                    alt="Virus Avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/navbar_logo.png';
                    }}
                  />
                </div>

                <div className="sticky-note" style={{ padding: '0.55rem 0.65rem', borderRadius: '6px', fontSize: '0.76rem', fontFamily: "'Kalam', cursive", fontWeight: 700, color: '#1e293b', lineHeight: 1.3 }}>
                  “PYQ me aaye hue 7-mark <br />
                  questions bilkul mat chorna!” <br />
                  <span style={{ color: '#047857' }}>— Virus :)</span>
                </div>
              </div>
            </div>

          </aside>

        </div>
      </div>

      {/* REQUEST PYQ MODAL */}
      {isRequestModalOpen && (
        <RequestPyqModal
          initialInfo={requestPyqInfo}
          onClose={() => {
            setIsRequestModalOpen(false);
            setRequestPyqInfo(null);
          }}
        />
      )}

    </div>
  );
}

// HELPER SEMESTER CARD COMPONENT
function SemesterPyqCard({ sem, onSelect }) {
  return (
    <div
      onClick={onSelect}
      style={{
        backgroundColor: '#ffffff', borderRadius: '18px', border: '1.5px solid #e2e8f0',
        padding: '1.35rem', cursor: 'pointer', transition: 'all 0.2s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = '#0d5c3a';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0px)';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      <div>
        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
          {sem}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: '0.2rem' }}>
          View Verified AKTU PYQs →
        </div>
      </div>
      <ArrowRight size={20} style={{ color: '#0d5c3a' }} />
    </div>
  );
}

// REQUEST PYQ FORM MODAL COMPONENT
function RequestPyqModal({ initialInfo, onClose }) {
  const [reqSubject, setReqSubject] = useState(initialInfo ? `${initialInfo.subject.subject} (Unit ${initialInfo.unit.unitNo})` : '');
  const [examYear, setExamYear] = useState('2024-25');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you! Your PYQ request for "${reqSubject}" (${examYear}) has been submitted to our team.`);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff', borderRadius: '24px', maxWidth: '440px', width: '100%',
        padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <PlusCircle size={24} style={{ color: '#0d5c3a' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
            Request AKTU Question Paper
          </h3>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <label style={modalLabelStyle}>Subject / Unit</label>
            <input
              type="text"
              placeholder="e.g. Operating System Unit 1"
              required
              value={reqSubject}
              onChange={(e) => setReqSubject(e.target.value)}
              style={modalInputStyle}
            />
          </div>

          <div>
            <label style={modalLabelStyle}>Exam Year / Session</label>
            <select value={examYear} onChange={(e) => setExamYear(e.target.value)} style={modalInputStyle}>
              <option>2024-25</option>
              <option>2023-24</option>
              <option>2022-23</option>
              <option>2021-22</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ backgroundColor: '#0d5c3a', marginTop: '0.5rem', padding: '0.7rem' }}>
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
}

// Styling Helper Constants
const filterTitleStyle = { fontSize: '0.75rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '0.6rem' };
const checkboxLabelStyle = { display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' };
const checkboxInputStyle = { accentColor: '#0d5c3a', width: '15px', height: '15px', cursor: 'pointer' };
const modalLabelStyle = { fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem', display: 'block' };
const modalInputStyle = { width: '100%', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.55rem 0.8rem', fontSize: '0.85rem', backgroundColor: '#f8fafc', outline: 'none', color: '#0f172a' };
