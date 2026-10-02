import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  FileText, 
  X, 
  CheckCircle2, 
  Calendar, 
  ExternalLink,
  BookOpen,
  Eye,
  ArrowLeft
} from 'lucide-react';

export default function MobilePYQsScreen({ 
  courseKey = 'BCA', 
  dbPyqs = [], 
  onOpenPdf, 
  onRequestPyq 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSem, setSelectedSem] = useState('All');
  const [selectedPyqDetails, setSelectedPyqDetails] = useState(null);

  const semesters = ['All', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6'];

  // Semester bundle definitions matching Screen 4 of reference image
  const defaultPyqBundles = [
    {
      id: 'bca-sem-1',
      title: 'BCA 1st Semester',
      subtitle: 'Previous Year Questions 2020 - 2024',
      sem: 'Sem 1',
      semNumber: 1,
      questionsCount: '120 Questions',
      papersCount: 6,
      themeColor: '#EF4444', // Red
      iconBg: '#FEE2E2',
      years: '2020 - 2024',
      downloadUrl: '/api/pyqs?course=BCA&semester=Semester%201'
    },
    {
      id: 'bca-sem-2',
      title: 'BCA 2nd Semester',
      subtitle: 'Previous Year Questions 2020 - 2024',
      sem: 'Sem 2',
      semNumber: 2,
      questionsCount: '150 Questions',
      papersCount: 6,
      themeColor: '#2563EB', // Blue
      iconBg: '#DBEAFE',
      years: '2020 - 2024',
      downloadUrl: '/api/pyqs?course=BCA&semester=Semester%202'
    },
    {
      id: 'bca-sem-3',
      title: 'BCA 3rd Semester',
      subtitle: 'Previous Year Questions 2020 - 2024',
      sem: 'Sem 3',
      semNumber: 3,
      questionsCount: '180 Questions',
      papersCount: 6,
      themeColor: '#EF4444', // Red
      iconBg: '#FEE2E2',
      years: '2020 - 2024',
      downloadUrl: '/api/pyqs?course=BCA&semester=Semester%203'
    },
    {
      id: 'bca-sem-4',
      title: 'BCA 4th Semester',
      subtitle: 'Previous Year Questions 2020 - 2024',
      sem: 'Sem 4',
      semNumber: 4,
      questionsCount: '160 Questions',
      papersCount: 6,
      themeColor: '#7C3AED', // Purple
      iconBg: '#EDE9FE',
      years: '2020 - 2024',
      downloadUrl: '/api/pyqs?course=BCA&semester=Semester%204'
    },
    {
      id: 'bca-sem-5',
      title: 'BCA 5th Semester',
      subtitle: 'Previous Year Questions 2020 - 2024',
      sem: 'Sem 5',
      semNumber: 5,
      questionsCount: '170 Questions',
      papersCount: 6,
      themeColor: '#0D9488', // Teal/Cyan
      iconBg: '#CCFBF1',
      years: '2020 - 2024',
      downloadUrl: '/api/pyqs?course=BCA&semester=Semester%205'
    },
    {
      id: 'bca-sem-6',
      title: 'BCA 6th Semester',
      subtitle: 'Previous Year Questions 2020 - 2024',
      sem: 'Sem 6',
      semNumber: 6,
      questionsCount: '200 Questions',
      papersCount: 6,
      themeColor: '#D97706', // Yellow/Gold
      iconBg: '#FEF3C7',
      years: '2020 - 2024',
      downloadUrl: '/api/pyqs?course=BCA&semester=Semester%206'
    }
  ];

  // Enrich with real dbPyqs if available
  const bundlesWithRealData = useMemo(() => {
    return defaultPyqBundles.map(bundle => {
      const matchedPyqs = (Array.isArray(dbPyqs) ? dbPyqs : []).filter(pyq => {
        const s = String(pyq.semester || '').toLowerCase();
        return s.includes(`semester ${bundle.semNumber}`) || s.includes(`sem ${bundle.semNumber}`) || s.includes(bundle.sem.toLowerCase());
      });

      return {
        ...bundle,
        realPyqs: matchedPyqs,
        effectivePaperCount: matchedPyqs.length > 0 ? matchedPyqs.length : bundle.papersCount
      };
    });
  }, [dbPyqs]);

  // Filter
  const filteredBundles = useMemo(() => {
    return bundlesWithRealData.filter(bundle => {
      if (selectedSem !== 'All' && bundle.sem !== selectedSem) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return bundle.title.toLowerCase().includes(q) || 
               bundle.subtitle.toLowerCase().includes(q) || 
               bundle.sem.toLowerCase().includes(q);
      }
      return true;
    });
  }, [bundlesWithRealData, selectedSem, searchQuery]);

  const handleDownloadAction = (bundle) => {
    // If bundle has real papers in DB
    if (bundle.realPyqs && bundle.realPyqs.length > 0) {
      setSelectedPyqDetails(bundle);
    } else {
      // Direct open or prompt
      if (bundle.downloadUrl) {
        window.open(bundle.downloadUrl, '_blank');
      } else {
        alert(`Downloading verified PYQ bank for ${bundle.title}...`);
      }
    }
  };

  return (
    <div style={{
      backgroundColor: '#FAF7F2',
      minHeight: '100vh',
      paddingBottom: '80px',
      color: '#1F2421',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    }}>
      {/* Individual Papers Modal if user clicks a semester bundle with papers */}
      {selectedPyqDetails && (
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
              onClick={() => setSelectedPyqDetails(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'none',
                border: 'none',
                color: '#7A1C28',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={18} /> Back to PYQ List
            </button>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#78716C' }}>
              {selectedPyqDetails.sem}
            </span>
          </div>

          <div style={{ padding: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2421', margin: '0 0 0.25rem 0' }}>
              {selectedPyqDetails.title}
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#78716C', margin: '0 0 1rem 0' }}>
              {selectedPyqDetails.subtitle}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedPyqDetails.realPyqs.map((pyq, idx) => (
                <div
                  key={pyq.id || idx}
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
                  <div style={{ flex: 1, minWidth: 0, marginRight: '0.75rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#7A1C28' }}>
                      {pyq.academicYear || '2023-2024'} • {pyq.examType || 'End Semester'}
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1F2421', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {pyq.subject || pyq.title || 'University Question Paper'}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenPdf && pyq.pdfUrl) {
                        onOpenPdf(pyq.pdfUrl);
                      } else if (pyq.pdfUrl || pyq.fileUrl) {
                        window.open(pyq.pdfUrl || pyq.fileUrl, '_blank');
                      } else {
                        alert('Question paper is opening...');
                      }
                    }}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#FDF2F4',
                      color: '#7A1C28',
                      border: '1.5px solid #F6D6DC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    <Download size={17} />
                  </button>
                </div>
              ))}
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
            placeholder="Search PYQs by semester, year, subject..."
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

      {/* 3. PYQ Cards List */}
      <div style={{
        padding: '0 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem'
      }}>
        {filteredBundles.length > 0 ? (
          filteredBundles.map((bundle) => {
            return (
              <div
                key={bundle.id}
                onClick={() => handleDownloadAction(bundle)}
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
                {/* Document Icon Squircle */}
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '13px',
                  backgroundColor: bundle.iconBg,
                  color: bundle.themeColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileText size={22} strokeWidth={2.2} />
                </div>

                {/* Info */}
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
                    {bundle.title}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#78716C',
                    marginTop: '0.15rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {bundle.subtitle}
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    color: '#A8A29E',
                    fontWeight: 600,
                    marginTop: '0.2rem'
                  }}>
                    {bundle.questionsCount}
                  </div>
                </div>

                {/* Circular Download Action Button */}
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '1.5px solid #F6D6DC',
                    backgroundColor: '#FDF2F4',
                    color: '#7A1C28',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(122, 28, 40, 0.08)'
                  }}
                >
                  <Download size={17} strokeWidth={2.2} />
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
            <FileText size={36} style={{ color: '#D6D3D1', margin: '0 auto 0.5rem auto' }} />
            <p style={{ fontWeight: 700, margin: 0 }}>No PYQ papers found</p>
            <p style={{ fontSize: '0.8rem', color: '#A8A29E', margin: '0.25rem 0 0 0' }}>Try searching another term or semester</p>
          </div>
        )}
      </div>
    </div>
  );
}
