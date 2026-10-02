import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronRight, 
  BookOpen, 
  FileText, 
  Download, 
  Eye, 
  Code, 
  Layers, 
  Cpu, 
  Radio, 
  Globe, 
  Database,
  ArrowLeft,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { BCA_NOTES_CATALOG } from '../data/bcaNotesData';

export default function MobileNotesScreen({ 
  courseKey = 'BCA', 
  dbNotes = [], 
  onOpenViewer, 
  onRequestNotes,
  onNavigate 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSem, setSelectedSem] = useState('All');
  const [activeSubjectDetail, setActiveSubjectDetail] = useState(null);

  // Semesters list
  const semesters = ['All', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'];

  // Curated subject list with real BCA catalog and DB notes mapping
  const subjectDefinitions = [
    {
      id: 'c-prog',
      name: 'C Programming',
      subtext: 'Unit-wise Notes, Examples, PDFs',
      sem: 'Sem 1',
      semNumber: 1,
      matchNames: ['programming principle', 'c programming', 'c language', 'c prog'],
      icon: Code,
      iconBg: '#0284C7',
      cardBadge: 'C',
      notesCount: 24,
      pyqsCount: 12
    },
    {
      id: 'cpp-prog',
      name: 'C++ Programming',
      subtext: 'OOP Concepts, STL, Examples',
      sem: 'Sem 3',
      semNumber: 3,
      matchNames: ['c++', 'object oriented programming', 'oop using c++'],
      icon: Code,
      iconBg: '#0369A1',
      cardBadge: 'C++',
      notesCount: 22,
      pyqsCount: 10
    },
    {
      id: 'java-prog',
      name: 'Java Programming',
      subtext: 'Core & Advanced Java',
      sem: 'Sem 4',
      semNumber: 4,
      matchNames: ['java', 'core java', 'java programming'],
      icon: CoffeeIcon,
      iconBg: '#DC2626',
      cardBadge: 'Java',
      notesCount: 26,
      pyqsCount: 12
    },
    {
      id: 'dsa',
      name: 'Data Structures & Algorithms',
      subtext: 'Arrays, Linked Lists, Trees, Graphs',
      sem: 'Sem 2',
      semNumber: 2,
      matchNames: ['data structure', 'dsa', 'algorithms'],
      icon: Layers,
      iconBg: '#0D9488',
      cardBadge: 'DSA',
      notesCount: 28,
      pyqsCount: 16
    },
    {
      id: 'dbms',
      name: 'Database Management System',
      subtext: 'DBMS Concepts, SQL, Normalization',
      sem: 'Sem 3',
      semNumber: 3,
      matchNames: ['database', 'dbms', 'sql'],
      icon: Database,
      iconBg: '#EF4444',
      cardBadge: 'SQL',
      notesCount: 20,
      pyqsCount: 10
    },
    {
      id: 'os',
      name: 'Operating System',
      subtext: 'Processes, Scheduling, Memory',
      sem: 'Sem 3',
      semNumber: 3,
      matchNames: ['operating system', 'os', 'linux'],
      icon: Cpu,
      iconBg: '#8B5CF6',
      cardBadge: 'OS',
      notesCount: 24,
      pyqsCount: 12
    },
    {
      id: 'cn',
      name: 'Computer Networks',
      subtext: 'Networking Concepts & Protocols',
      sem: 'Sem 3',
      semNumber: 3,
      matchNames: ['computer network', 'data communication', 'networking'],
      icon: Radio,
      iconBg: '#EC4899',
      cardBadge: 'CN',
      notesCount: 18,
      pyqsCount: 10
    },
    {
      id: 'web-dev',
      name: 'Web Development',
      subtext: 'HTML, CSS, JavaScript, React',
      sem: 'Sem 4',
      semNumber: 4,
      matchNames: ['web', 'html', 'javascript', 'web development'],
      icon: Globe,
      iconBg: '#F59E0B',
      cardBadge: 'Web',
      notesCount: 25,
      pyqsCount: 12
    }
  ];

  // Map real notes from catalog
  const subjectsWithRealNotes = useMemo(() => {
    return subjectDefinitions.map(def => {
      // Find actual notes from BCA_NOTES_CATALOG or dbNotes
      const matchedCatalogNotes = BCA_NOTES_CATALOG.filter(note => {
        const title = (note.title || '').toLowerCase();
        const sub = (note.subjectName || note.subject || '').toLowerCase();
        return def.matchNames.some(m => title.includes(m) || sub.includes(m));
      });

      const matchedDbNotes = (Array.isArray(dbNotes) ? dbNotes : []).filter(note => {
        const title = (note.title || '').toLowerCase();
        const sub = (note.subject || '').toLowerCase();
        return def.matchNames.some(m => title.includes(m) || sub.includes(m));
      });

      const combined = [...matchedCatalogNotes, ...matchedDbNotes];
      const realCount = combined.length > 0 ? combined.length : def.notesCount;

      return {
        ...def,
        realNotes: combined,
        effectiveNotesCount: realCount
      };
    });
  }, [dbNotes]);

  // Filtered subjects
  const filteredSubjects = useMemo(() => {
    return subjectsWithRealNotes.filter(item => {
      // Semester filter
      if (selectedSem !== 'All' && item.sem !== selectedSem) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.name.toLowerCase().includes(q) || 
               item.subtext.toLowerCase().includes(q) || 
               item.sem.toLowerCase().includes(q);
      }
      return true;
    });
  }, [subjectsWithRealNotes, selectedSem, searchQuery]);

  return (
    <div style={{
      backgroundColor: '#FAF7F2',
      minHeight: '100vh',
      paddingBottom: '80px',
      color: '#1F2421',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>
      {/* Subject Detail Drill-down Modal/View if selected */}
      {activeSubjectDetail && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#FAF7F2',
          zIndex: 1000,
          overflowY: 'auto',
          paddingBottom: '80px'
        }}>
          {/* Header */}
          <div style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: '#FAF7F2',
            borderBottom: '1px solid #E8E2D5',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button
              onClick={() => setActiveSubjectDetail(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'none',
                border: 'none',
                color: '#7A1C28',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                padding: '0.3rem 0'
              }}
            >
              <ArrowLeft size={18} /> Back to Notes
            </button>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#78716C' }}>
              {activeSubjectDetail.sem}
            </span>
          </div>

          <div style={{ padding: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: activeSubjectDetail.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}>
                {React.createElement(activeSubjectDetail.icon, { size: 24, strokeWidth: 2.2 })}
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2421', margin: 0 }}>
                  {activeSubjectDetail.name}
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#78716C', margin: '0.15rem 0 0 0' }}>
                  {activeSubjectDetail.effectiveNotesCount} Study Modules & Real PDFs
                </p>
              </div>
            </div>

            {/* Notes List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeSubjectDetail.realNotes.length > 0 ? (
                activeSubjectDetail.realNotes.map((note, idx) => (
                  <div
                    key={note.id || idx}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '14px',
                      padding: '1rem',
                      border: '1px solid #E8E2D5',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: '#FDF2F4',
                        color: '#7A1C28',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px'
                      }}>
                        Unit {note.unit || (idx % 5) + 1}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#A8A29E', fontWeight: 500 }}>
                        {note.sourceKey || 'Verified PDF'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F2421', margin: 0, lineHeight: 1.35 }}>
                      {note.title || `${activeSubjectDetail.name} — Unit ${note.unit || idx + 1}`}
                    </h3>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      {note.pdfUrl || note.fileUrl ? (
                        <>
                          <button
                            onClick={() => {
                              if (onOpenViewer) {
                                onOpenViewer({
                                  note,
                                  subject: { name: activeSubjectDetail.name },
                                  unit: note.unit || 1
                                });
                              } else {
                                window.open(note.pdfUrl || note.fileUrl, '_blank');
                              }
                            }}
                            style={{
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.4rem',
                              backgroundColor: '#7A1C28',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '0.55rem',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <Eye size={15} /> Read Note
                          </button>
                          <a
                            href={note.pdfUrl || note.fileUrl}
                            download
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '0.55rem 0.85rem',
                              backgroundColor: '#F5F5F4',
                              color: '#44403C',
                              borderRadius: '8px',
                              textDecoration: 'none',
                              fontSize: '0.82rem',
                              fontWeight: 600
                            }}
                          >
                            <Download size={15} />
                          </a>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            if (onRequestNotes) onRequestNotes(activeSubjectDetail, 1);
                          }}
                          style={{
                            flex: 1,
                            padding: '0.55rem',
                            backgroundColor: '#F5F5F4',
                            border: '1px dashed #D6D3D1',
                            borderRadius: '8px',
                            color: '#78716C',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Request Unit PDF
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                [1, 2, 3, 4, 5].map(unitNum => (
                  <div
                    key={unitNum}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '14px',
                      padding: '1rem',
                      border: '1px solid #E8E2D5',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        backgroundColor: '#FDF2F4',
                        color: '#7A1C28',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px'
                      }}>
                        Unit {unitNum}
                      </span>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1F2421', margin: '0.35rem 0 0 0' }}>
                        {activeSubjectDetail.name} Unit {unitNum} Comprehensive Notes
                      </h4>
                      <p style={{ fontSize: '0.76rem', color: '#78716C', margin: '0.15rem 0 0 0' }}>
                        Verified syllabus aligned notes & key formulas
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        window.open(`/api/notes?subject=${encodeURIComponent(activeSubjectDetail.name)}&unit=${unitNum}`, '_blank');
                      }}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#FDF2F4',
                        color: '#7A1C28',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      <Download size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 1. Search Bar */}
      <div style={{ padding: '0.75rem 1rem 0.5rem 1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          padding: '0.65rem 0.85rem',
          border: '1.5px solid #E8E2D5',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <Search size={18} style={{ color: '#A8A29E', marginRight: '0.5rem', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '0.92rem',
              color: '#1F2421',
              fontWeight: 500
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#A8A29E',
                cursor: 'pointer',
                padding: '0 0.25rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Semester Filter Pills */}
      <div style={{
        display: 'flex',
        gap: '0.45rem',
        padding: '0.35rem 1rem 0.85rem 1rem',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch'
      }}>
        {semesters.map((sem) => {
          const isActive = selectedSem === sem;
          return (
            <button
              key={sem}
              onClick={() => setSelectedSem(sem)}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                backgroundColor: isActive ? '#7A1C28' : '#ffffff',
                color: isActive ? '#ffffff' : '#57534E',
                boxShadow: isActive ? '0 4px 12px rgba(122, 28, 40, 0.25)' : '0 1px 4px rgba(0,0,0,0.03)',
                border: isActive ? '1px solid #7A1C28' : '1px solid #E8E2D5',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {sem}
            </button>
          );
        })}
      </div>

      {/* 3. Subject Cards List */}
      <div style={{
        padding: '0 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem'
      }}>
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map((sub) => {
            const IconComp = sub.icon;
            return (
              <div
                key={sub.id}
                onClick={() => setActiveSubjectDetail(sub)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '0.9rem 1rem',
                  border: '1.5px solid #F0ECE4',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                {/* Squircle Subject Icon */}
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '13px',
                  backgroundColor: sub.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0,
                  boxShadow: '0 3px 8px rgba(0,0,0,0.08)'
                }}>
                  <IconComp size={22} strokeWidth={2.2} />
                </div>

                {/* Subject Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.98rem',
                    fontWeight: 800,
                    color: '#1F2421',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.25,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {sub.name}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#78716C',
                    marginTop: '0.15rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {sub.subtext}
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    color: '#A8A29E',
                    fontWeight: 600,
                    marginTop: '0.2rem'
                  }}>
                    {sub.effectiveNotesCount} Notes • {sub.pyqsCount} PYQs
                  </div>
                </div>

                {/* Navigation Chevron */}
                <div style={{
                  color: '#D6D3D1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ChevronRight size={20} strokeWidth={2} />
                </div>
              </div>
            );
          })
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px dashed #E8E2D5',
            color: '#78716C'
          }}>
            <BookOpen size={36} style={{ color: '#D6D3D1', margin: '0 auto 0.5rem auto' }} />
            <p style={{ fontWeight: 700, margin: 0 }}>No notes found</p>
            <p style={{ fontSize: '0.8rem', color: '#A8A29E', margin: '0.25rem 0 0 0' }}>Try adjusting your search or semester filter</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Fallback Coffee/Java icon
function CoffeeIcon({ size = 20, ...props }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
      <line x1="6" y1="1" x2="6" y2="4"/>
      <line x1="10" y1="1" x2="10" y2="4"/>
      <line x1="14" y1="1" x2="14" y2="4"/>
    </svg>
  );
}
