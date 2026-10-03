import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  FileText,
  UploadCloud,
  Link as LinkIcon,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
  RotateCcw,
  Sparkles,
  Eye,
  Clock,
  BookOpen,
  Layers,
  ChevronRight,
  Info,
  X,
  File,
  FileCheck
} from 'lucide-react';
import { API_URL } from '../config/api';

// REAL ACADEMIC TEST SAMPLES FOR IMMEDIATE 1-CLICK VERIFICATION
const ACADEMIC_SAMPLES = {
  essay: `In computer science, a data structure is a data organization, management, and storage format that is usually chosen for efficient access to data. More precisely, a data structure is a collection of data values, the relationships among them, and the functions or operations that can be applied to the data. In modern software engineering, choosing the appropriate data representation is critical for algorithmic performance. For example, binary search trees provide an average search time complexity of O(log n), whereas arrays offer constant-time random access. Computer memory allocation and CPU cache utilization are heavily influenced by the chosen layout.`,
  abstract: `An operating system is system software that manages computer hardware, software resources, and provides common services for computer programs. Time-sharing operating systems schedule tasks for efficient use of the system and may also include accounting software for cost allocation of processor time, mass storage, printing, and other resources. Modern virtual memory management techniques utilize paging and segmentation to isolate process address spaces, ensuring system stability and fault containment.`,
  assignment: `A sorting algorithm is used to rearrange a given array or list of elements according to a comparison operator on the elements. The comparison operator is used to decide the new order of elements in the respective data structure. Quicksort is a divide and conquer algorithm that picks an element as a pivot and partitions the given array around the picked pivot. In this laboratory assignment, we evaluate the worst-case time complexity O(n^2) and average-case O(n log n) across various input distributions.`,
  report: `Artificial intelligence is the intelligence of machines or software, as opposed to the intelligence of living beings, primarily of humans. It is a field of study in computer science that develops and studies intelligent machines. In recent years, deep learning architectures such as convolutional neural networks and transformer models have significantly advanced natural language processing and computer vision applications.`
};

export default function PlagiarismCheckerPage({ onNavigate, onOpenAuth }) {
  // Navigation tabs: 'text' | 'file' | 'url'
  const [activeTab, setActiveTab] = useState('text');

  // Input states
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputUrl, setInputUrl] = useState('');
  const [comparisonText, setComparisonText] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  // Active highlighted match tooltip
  const [selectedHighlight, setSelectedHighlight] = useState(null);

  // Report references for smooth scroll
  const resultsRef = useRef(null);
  const detailedReportRef = useRef(null);

  // Word count helper
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).filter(Boolean).length : 0;

  // Handle Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    setErrorMessage('');
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const validExts = [
      'pdf', 'docx', 'txt', 'c', 'cpp', 'cc', 'h', 'hpp', 'java', 'py', 'js',
      'jsx', 'ts', 'tsx', 'html', 'css', 'sql', 'php', 'go', 'rs', 'kt', 'swift'
    ];
    if (ext === 'doc') {
      setErrorMessage('Legacy .doc binary format is not supported. Please convert or save your document as .docx or .pdf.');
      return;
    }
    if (!validExts.includes(ext) && !file.type.startsWith('text/')) {
      setErrorMessage(`Unsupported format (.${ext}). Supported formats: PDF, DOCX, TXT, and source code files.`);
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 25MB limit.');
      return;
    }
    setSelectedFile(file);
  };

  // Run Plagiarism Analysis
  const handleRunAnalysis = async () => {
    setErrorMessage('');
    setSelectedHighlight(null);

    // Validation
    if (activeTab === 'text') {
      if (!inputText.trim()) {
        setErrorMessage('Please enter or paste text content to analyze.');
        return;
      }
      if (wordCount < 15) {
        setErrorMessage('Please enter at least 15 words to produce a reliable similarity assessment.');
        return;
      }
    } else if (activeTab === 'file') {
      if (!selectedFile) {
        setErrorMessage('Please select or drop a valid document (PDF, DOCX, TXT, or Code).');
        return;
      }
    } else if (activeTab === 'url') {
      if (!inputUrl.trim() || !inputUrl.startsWith('http')) {
        setErrorMessage('Please enter a valid HTTP or HTTPS website URL.');
        return;
      }
    }

    setIsAnalyzing(true);
    setAnalysisStage('Uploading and validating content...');

    try {
      let response;

      // 1. TEXT INPUT ANALYSIS
      if (activeTab === 'text') {
        setAnalysisStage('Tokenizing and extracting n-gram shingles...');
        const comparisonDocs = comparisonText.trim() ? [{
          title: 'User Comparison Document',
          domain: 'Local Comparison',
          url: 'local://comparison-text',
          text: comparisonText.trim()
        }] : [];

        response = await fetch(`${API_URL}/api/plagiarism/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: inputText.trim(),
            title: 'Pasted Academic Text',
            documentType: 'Text Input',
            comparisonDocs
          })
        });
      }
      // 2. FILE UPLOAD ANALYSIS
      else if (activeTab === 'file') {
        setAnalysisStage('Extracting text and structure from file...');
        const formData = new FormData();
        formData.append('file', selectedFile);

        if (comparisonText.trim()) {
          formData.append('comparisonDocs', JSON.stringify([{
            title: 'User Comparison Document',
            domain: 'Local Comparison',
            url: 'local://comparison-text',
            text: comparisonText.trim()
          }]));
        }

        response = await fetch(`${API_URL}/api/plagiarism/upload`, {
          method: 'POST',
          body: formData
        });
      }
      // 3. URL WEBPAGE CHECK
      else if (activeTab === 'url') {
        setAnalysisStage('Fetching live webpage and stripping HTML...');
        response = await fetch(`${API_URL}/api/plagiarism/url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: inputUrl.trim() })
        });
      }

      setAnalysisStage('Comparing against verified academic corpus...');
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Plagiarism analysis failed.');
      }

      setAnalysisStage('Building originality report...');
      setTimeout(() => {
        setAnalysisResult(data);
        setIsAnalyzing(false);
        setAnalysisStage('');
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 400);

    } catch (err) {
      console.error('[PLAGIARISM CHECK ERROR]', err);
      setIsAnalyzing(false);
      setAnalysisStage('');
      setErrorMessage(err.message || 'An unexpected error occurred during analysis.');
    }
  };

  // Download PDF Report
  const handleDownloadPdf = async () => {
    if (!analysisResult) return;
    try {
      const response = await fetch(`${API_URL}/api/plagiarism/report-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisResult)
      });
      if (!response.ok) throw new Error('PDF report generation failed.');
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `ProfessorVirus_Plagiarism_Report_${(analysisResult.fileName || 'analysis').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert(`Could not download PDF report: ${err.message}`);
    }
  };

  // Reset to check another document
  const handleCheckAnother = () => {
    setInputText('');
    setSelectedFile(null);
    setInputUrl('');
    setComparisonText('');
    setAnalysisResult(null);
    setErrorMessage('');
    setSelectedHighlight(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', color: '#1C1E21', paddingBottom: '4rem' }}>
      
      {/* 1. TOP BREADCRUMB & HEADER SECTION */}
      <div className="container" style={{ padding: '1.5rem 1rem 1rem 1rem', maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#78716C', marginBottom: '1.25rem' }}>
          <button onClick={() => onNavigate && onNavigate('home')} style={{ background: 'none', border: 'none', color: '#78716C', cursor: 'pointer', padding: 0 }}>
            Home
          </button>
          <span>/</span>
          <button onClick={() => onNavigate && onNavigate('more')} style={{ background: 'none', border: 'none', color: '#78716C', cursor: 'pointer', padding: 0 }}>
            More
          </button>
          <span>/</span>
          <span style={{ fontWeight: 700, color: '#7A2327' }}>AI Plagiarism Checker</span>
        </div>

        {/* Header Hero Card with Badges */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid #E8E2D5',
          padding: '1.75rem',
          boxShadow: '0 4px 20px rgba(35,30,25,0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', maxWidth: '640px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#FEF2F2',
              border: '2px solid #FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DC2626',
              flexShrink: 0,
              boxShadow: '0 8px 16px rgba(220,38,38,0.08)'
            }}>
              <ShieldCheck size={36} strokeWidth={2.4} />
            </div>
            <div>
              <h1 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '2.1rem',
                fontWeight: 900,
                color: '#1F2421',
                margin: 0,
                lineHeight: 1.15
              }}>
                AI Plagiarism Checker
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.92rem', margin: '0.35rem 0 0 0', fontWeight: 500 }}>
                Check originality, similarity score and get detailed AI-powered plagiarism analysis for your academic content.
              </p>
            </div>
          </div>

          {/* 3 Reference Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: '#FAF7F2',
              border: '1px solid #E8E2D5', padding: '0.65rem 0.95rem', borderRadius: '16px'
            }}>
              <Sparkles size={20} style={{ color: '#DC2626' }} />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1F2421' }}>Advanced AI Detection</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Checks web &amp; academic corpus</div>
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: '#FAF7F2',
              border: '1px solid #E8E2D5', padding: '0.65rem 0.95rem', borderRadius: '16px'
            }}>
              <FileText size={20} style={{ color: '#2563EB' }} />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1F2421' }}>Detailed Report</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Match sources with highlights</div>
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem', backgroundColor: '#FAF7F2',
              border: '1px solid #E8E2D5', padding: '0.65rem 0.95rem', borderRadius: '16px'
            }}>
              <CheckCircle2 size={20} style={{ color: '#10B981' }} />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1F2421' }}>100% Secure</div>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Private &amp; temporary processing</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MAIN 3-COLUMN WORKSPACE (Responsive) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.25fr) minmax(320px, 1.35fr) minmax(240px, 0.75fr)',
          gap: '1.5rem',
          alignItems: 'stretch',
          marginBottom: '1.75rem'
        }} className="plagiarism-main-grid">

          {/* ================================================================= */}
          {/* COLUMN 1: INPUT & UPLOAD CARD */}
          {/* ================================================================= */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #E8E2D5',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(35,30,25,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              {/* Tab Selector */}
              <div style={{
                display: 'flex',
                backgroundColor: '#FAF7F2',
                borderRadius: '14px',
                padding: '0.3rem',
                border: '1px solid #E8E2D5',
                marginBottom: '1.25rem',
                gap: '0.25rem'
              }}>
                <button
                  onClick={() => { setActiveTab('text'); setErrorMessage(''); }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: activeTab === 'text' ? '#FFFFFF' : 'transparent',
                    color: activeTab === 'text' ? '#7A2327' : '#64748B',
                    fontWeight: activeTab === 'text' ? 800 : 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: activeTab === 'text' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <FileText size={15} /> Text Input
                </button>

                <button
                  onClick={() => { setActiveTab('file'); setErrorMessage(''); }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: activeTab === 'file' ? '#FFFFFF' : 'transparent',
                    color: activeTab === 'file' ? '#7A2327' : '#64748B',
                    fontWeight: activeTab === 'file' ? 800 : 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: activeTab === 'file' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <UploadCloud size={15} /> File Upload
                </button>

                <button
                  onClick={() => { setActiveTab('url'); setErrorMessage(''); }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: activeTab === 'url' ? '#FFFFFF' : 'transparent',
                    color: activeTab === 'url' ? '#7A2327' : '#64748B',
                    fontWeight: activeTab === 'url' ? 800 : 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: activeTab === 'url' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <LinkIcon size={15} /> URL Check
                </button>
              </div>

              {/* TAB 1: TEXT INPUT */}
              {activeTab === 'text' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1F2421' }}>
                      Enter your content
                    </label>
                    <span style={{ fontSize: '0.78rem', color: wordCount > 5000 ? '#DC2626' : '#78716C', fontWeight: 700 }}>
                      {wordCount.toLocaleString()} / 5,000 words
                    </span>
                  </div>

                  <textarea
                    rows={8}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your essay, assignment, research paper, code or any text here..."
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.9rem',
                      borderRadius: '16px',
                      border: '1.5px solid #E8E2D5',
                      backgroundColor: '#FAF7F2',
                      fontSize: '0.88rem',
                      lineHeight: 1.6,
                      color: '#1F2421',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />

                  {/* Sample Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', color: '#78716C', fontWeight: 600 }}>or try a sample:</span>
                    {Object.keys(ACADEMIC_SAMPLES).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setInputText(ACADEMIC_SAMPLES[key]);
                          setErrorMessage('');
                        }}
                        style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '999px',
                          border: '1px solid #E8E2D5',
                          backgroundColor: '#FFFFFF',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#57534E',
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                      >
                        {key === 'abstract' ? 'Research Abstract' : key}
                      </button>
                    ))}
                    {inputText && (
                      <button
                        type="button"
                        onClick={() => setInputText('')}
                        style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: '999px',
                          border: 'none',
                          backgroundColor: '#FEE2E2',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#DC2626',
                          cursor: 'pointer',
                          marginLeft: 'auto'
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: FILE UPLOAD */}
              {activeTab === 'file' && (
                <div>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    style={{
                      border: isDragging ? '2px dashed #7A2327' : '2px dashed #D6D3D1',
                      borderRadius: '18px',
                      padding: '2rem 1.5rem',
                      textAlign: 'center',
                      backgroundColor: isDragging ? '#FEF2F2' : '#FAF7F2',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      marginBottom: '1rem'
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      style={{ display: 'none' }}
                      accept=".pdf,.docx,.txt,.c,.cpp,.h,.java,.py,.js,.jsx,.ts,.tsx,.html,.css,.sql,.php,.go,.rs,.kt,.swift"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileSelected(e.target.files[0]);
                        }
                      }}
                    />
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem auto',
                      color: '#7A2327',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                      <UploadCloud size={26} />
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.25rem' }}>
                      Click to upload or drag &amp; drop
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#78716C' }}>
                      PDF, DOCX, TXT, or Code (.py, .java, .cpp, .c, .js, .ts, etc.)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#A8A29E', marginTop: '0.4rem' }}>
                      Single-page or multi-page documents up to 25MB
                    </div>
                  </div>

                  {/* Selected File Preview */}
                  {selectedFile && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#FAF7F2',
                      border: '1.5px solid #E8E2D5',
                      borderRadius: '14px',
                      padding: '0.75rem 1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                        <FileCheck size={22} style={{ color: '#10B981', flexShrink: 0 }} />
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1F2421', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {selectedFile.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#78716C' }}>
                            {(selectedFile.size / 1024).toFixed(1)} KB • Ready for extraction
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedFile(null)}
                        style={{ background: 'none', border: 'none', color: '#78716C', cursor: 'pointer', padding: '0.2rem' }}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: URL CHECK */}
              {activeTab === 'url' && (
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1F2421', display: 'block', marginBottom: '0.5rem' }}>
                    Enter Webpage URL to Analyze
                  </label>
                  <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://en.wikipedia.org/wiki/Data_structure"
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '0.75rem 1rem 0.75rem 2.4rem',
                        borderRadius: '14px',
                        border: '1.5px solid #E8E2D5',
                        backgroundColor: '#FAF7F2',
                        fontSize: '0.85rem',
                        color: '#1F2421',
                        outline: 'none'
                      }}
                    />
                    <LinkIcon size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#78716C' }} />
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#78716C', lineHeight: 1.5, margin: 0 }}>
                    Our backend will securely fetch the public webpage, extract its main body text, and measure originality against the academic corpus.
                  </p>
                </div>
              )}

              {/* Optional Peer Comparison Section */}
              <div style={{ marginTop: '1rem', borderTop: '1px solid #F0EBE0', paddingTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowComparison(!showComparison)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#7A2327',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <BookOpen size={14} />
                  <span>{showComparison ? 'Hide' : 'Add'} Comparison Documents (for peer/assignment checking)</span>
                </button>

                {showComparison && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <textarea
                      rows={3}
                      value={comparisonText}
                      onChange={(e) => setComparisonText(e.target.value)}
                      placeholder="Paste reference text or a classmate's assignment to compare directly..."
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '0.65rem',
                        borderRadius: '12px',
                        border: '1.5px solid #E8E2D5',
                        backgroundColor: '#FAF7F2',
                        fontSize: '0.82rem',
                        color: '#1F2421',
                        outline: 'none',
                        resize: 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Error Display */}
            {errorMessage && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FEE2E2',
                borderRadius: '12px',
                padding: '0.65rem 0.85rem',
                color: '#DC2626',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginTop: '1rem'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Primary Action Button */}
            <div style={{ marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '16px',
                  border: 'none',
                  backgroundColor: '#7A2327',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 6px 18px rgba(122,35,39,0.25)',
                  opacity: isAnalyzing ? 0.8 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles size={18} style={{ animation: 'spin 2s linear infinite' }} />
                    <span>{analysisStage || 'Analyzing...'}</span>
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    <span>Check for Plagiarism</span>
                  </>
                )}
              </button>

              <div style={{ fontSize: '0.7rem', color: '#A8A29E', textAlign: 'center', marginTop: '0.65rem' }}>
                Supports text, PDF, DOC, DOCX (Max 25MB) | AI + Web + Research Papers + Student Submissions
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* COLUMN 2: PLAGIARISM ANALYSIS RESULT */}
          {/* ================================================================= */}
          <div ref={resultsRef} style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #E8E2D5',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(35,30,25,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {/* Header with real completion badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#1F2421',
                margin: 0
              }}>
                Plagiarism Analysis Result
              </h2>

              {analysisResult && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#ECFDF5',
                  color: '#047857',
                  border: '1px solid #D1FAE5',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  <CheckCircle2 size={13} /> Completed in {analysisResult.analysisTime}s
                </span>
              )}
            </div>

            {/* Content Display: Empty State vs Active Result vs Analyzing */}
            {isAnalyzing ? (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '4px solid #FEE2E2',
                  borderTopColor: '#7A2327',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '1.25rem'
                }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1F2421', margin: '0 0 0.4rem 0' }}>
                  Analyzing Submitted Content
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#78716C', maxWidth: '320px', margin: 0 }}>
                  {analysisStage || 'Extracting passages and measuring Jaccard n-gram similarity against verified sources...'}
                </p>
              </div>
            ) : !analysisResult ? (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  backgroundColor: '#FAF7F2',
                  border: '1.5px solid #E8E2D5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#A8A29E',
                  marginBottom: '1rem'
                }}>
                  <ShieldCheck size={32} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1F2421', margin: '0 0 0.35rem 0' }}>
                  Ready to Analyze
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#78716C', maxWidth: '320px', lineHeight: 1.5, margin: 0 }}>
                  Paste text, upload a document, or enter a URL on the left. Zero demo data—every metric is calculated from real inputs.
                </p>
              </div>
            ) : (
              <div>
                {/* Score Gauge & Status Description */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#FAF7F2',
                  borderRadius: '20px',
                  border: '1.5px solid #E8E2D5',
                  marginBottom: '1.25rem'
                }} className="plagiarism-gauge-row">
                  {/* Circular SVG Gauge */}
                  <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0 }}>
                    <svg width="110" height="110" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#E8E2D5"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={
                          analysisResult.similarityScore < 15
                            ? '#10B981'
                            : analysisResult.similarityScore < 35
                            ? '#F59E0B'
                            : '#DC2626'
                        }
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * analysisResult.similarityScore) / 100}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        style={{ transition: 'stroke-dashoffset 1s ease' }}
                      />
                    </svg>
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        color: '#1F2421',
                        lineHeight: 1
                      }}>
                        {analysisResult.similarityScore}%
                      </span>
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#78716C', textTransform: 'uppercase', marginTop: '2px' }}>
                        Similarity
                      </span>
                    </div>
                  </div>

                  {/* Status Headline */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                      {analysisResult.similarityScore < 15 ? (
                        <CheckCircle2 size={20} style={{ color: '#10B981' }} />
                      ) : (
                        <AlertCircle size={20} style={{ color: analysisResult.similarityScore < 35 ? '#F59E0B' : '#DC2626' }} />
                      )}
                      <h3 style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '1.25rem',
                        fontWeight: 900,
                        color: '#1F2421',
                        margin: 0
                      }}>
                        {analysisResult.statusText}
                      </h3>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#57534E', lineHeight: 1.5, margin: 0 }}>
                      {analysisResult.statusDescription}
                    </p>
                  </div>
                </div>

                {/* 4 Stat Metric Cards (Matching reference screenshot) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.65rem'
                }} className="plagiarism-stats-grid">
                  
                  {/* Stat 1: Unique Content */}
                  <div style={{
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    borderRadius: '14px',
                    padding: '0.75rem 0.65rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#047857' }}>
                      {analysisResult.uniqueContent}%
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#065F46', textTransform: 'uppercase' }}>
                      Unique Content
                    </div>
                  </div>

                  {/* Stat 2: Similar Content */}
                  <div style={{
                    backgroundColor: '#FFF1F2',
                    border: '1px solid #FECDD3',
                    borderRadius: '14px',
                    padding: '0.75rem 0.65rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#BE123C' }}>
                      {analysisResult.similarityScore}%
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#9F1239', textTransform: 'uppercase' }}>
                      Similar Content
                    </div>
                  </div>

                  {/* Stat 3: Total Sources */}
                  <div style={{
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '14px',
                    padding: '0.75rem 0.65rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1D4ED8' }}>
                      {analysisResult.sourcesCount}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase' }}>
                      Total Sources
                    </div>
                  </div>

                  {/* Stat 4: Total Words */}
                  <div style={{
                    backgroundColor: '#FAF5FF',
                    border: '1px solid #E9D5FF',
                    borderRadius: '14px',
                    padding: '0.75rem 0.65rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#7E22CE' }}>
                      {analysisResult.totalWords.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#6B21A8', textTransform: 'uppercase' }}>
                      Total Words
                    </div>
                  </div>

                </div>
              </div>
            )}

            <div />
          </div>

          {/* ================================================================= */}
          {/* COLUMN 3: ACTIONS CARD */}
          {/* ================================================================= */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #E8E2D5',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(35,30,25,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#1F2421',
                margin: '0 0 1.25rem 0'
              }}>
                Actions
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                
                {/* Action 1: View Detailed Report */}
                <button
                  type="button"
                  onClick={() => {
                    if (detailedReportRef.current) {
                      detailedReportRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  disabled={!analysisResult}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '14px',
                    border: 'none',
                    backgroundColor: analysisResult ? '#7A2327' : '#FAF7F2',
                    color: analysisResult ? '#FFFFFF' : '#A8A29E',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    cursor: analysisResult ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <FileText size={16} />
                  <span>View Detailed Report</span>
                </button>

                {/* Action 2: Download PDF Report */}
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={!analysisResult}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '14px',
                    border: '1.5px solid #E8E2D5',
                    backgroundColor: '#FFFFFF',
                    color: analysisResult ? '#1F2421' : '#A8A29E',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: analysisResult ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Download size={16} />
                  <span>Download PDF Report</span>
                </button>

                {/* Action 3: Check Another Document */}
                <button
                  type="button"
                  onClick={handleCheckAnother}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '14px',
                    border: '1.5px solid #E8E2D5',
                    backgroundColor: '#FAF7F2',
                    color: '#44403C',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <RotateCcw size={16} />
                  <span>Check Another Document</span>
                </button>

              </div>
            </div>

            {/* Quick security notice */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#FAF7F2',
              padding: '0.75rem',
              borderRadius: '14px',
              border: '1px solid #E8E2D5',
              marginTop: '1.5rem'
            }}>
              <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} />
              <span style={{ fontSize: '0.74rem', color: '#57534E', lineHeight: 1.4 }}>
                Analysis is encrypted and not permanently stored.
              </span>
            </div>
          </div>

        </div>

        {/* ================================================================= */}
        {/* 3. BOTTOM ROW: MATCHED SOURCES, CONTENT HIGHLIGHT & ANALYSIS DETAILS */}
        {/* ================================================================= */}
        {analysisResult && (
          <div ref={detailedReportRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(320px, 1.45fr) minmax(260px, 0.9fr)',
              gap: '1.5rem',
              alignItems: 'start'
            }} className="plagiarism-bottom-grid">

              {/* CARD 1: MATCHED SOURCES */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px solid #E8E2D5',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(35,30,25,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem' }}>
                  <h3 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    color: '#1F2421',
                    margin: 0
                  }}>
                    Matched Sources
                  </h3>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    backgroundColor: '#EFF6FF',
                    color: '#1D4ED8',
                    border: '1px solid #DBEAFE',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '999px'
                  }}>
                    {analysisResult.sourcesCount} sources found
                  </span>
                </div>

                {analysisResult.matchedSources && analysisResult.matchedSources.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '420px', overflowY: 'auto' }}>
                    {analysisResult.matchedSources.map((src, idx) => (
                      <div
                        key={src.id || idx}
                        style={{
                          backgroundColor: '#FAF7F2',
                          borderRadius: '16px',
                          border: '1px solid #E8E2D5',
                          padding: '0.85rem 1rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#78716C' }}>
                              #{idx + 1}
                            </span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1F2421', lineHeight: 1.3 }}>
                              {src.source}
                            </span>
                          </div>
                          <span style={{
                            backgroundColor: '#FEE2E2',
                            color: '#DC2626',
                            fontWeight: 800,
                            fontSize: '0.72rem',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '6px',
                            flexShrink: 0
                          }}>
                            {src.similarity}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.45rem' }}>
                          <span style={{ fontSize: '0.72rem', color: '#78716C', fontFamily: 'monospace' }}>
                            {src.domain}
                          </span>
                          {src.url && src.url.startsWith('http') && (
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                color: '#2563EB',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                textDecoration: 'none'
                              }}
                            >
                              <span>View Source</span>
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#78716C', fontSize: '0.85rem' }}>
                    <CheckCircle2 size={32} style={{ color: '#10B981', margin: '0 auto 0.5rem' }} />
                    <div style={{ fontWeight: 800, color: '#1F2421' }}>No verified matching sources found</div>
                    <div>Your submitted content appears to be 100% original.</div>
                  </div>
                )}
              </div>

              {/* CARD 2: CONTENT HIGHLIGHT */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px solid #E8E2D5',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(35,30,25,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    color: '#1F2421',
                    margin: 0
                  }}>
                    Content Highlight
                  </h3>

                  {/* Legend */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
                      <span style={{ fontWeight: 700, color: '#57534E' }}>Matched text</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                      <span style={{ fontWeight: 700, color: '#57534E' }}>Original text</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Highlight Viewer */}
                <div style={{
                  maxHeight: '420px',
                  overflowY: 'auto',
                  backgroundColor: '#FAF7F2',
                  border: '1.5px solid #E8E2D5',
                  borderRadius: '16px',
                  padding: '1.15rem',
                  fontSize: '0.88rem',
                  lineHeight: 1.7,
                  color: '#1F2421'
                }}>
                  {analysisResult.highlights && analysisResult.highlights.length > 0 ? (
                    <div>
                      {renderHighlightedContent(
                        inputText || (analysisResult.highlights.map(h => h.submittedText).join(' ')),
                        analysisResult.highlights,
                        (h) => setSelectedHighlight(h)
                      )}
                    </div>
                  ) : (
                    <div>
                      {inputText || 'No similarities were detected in this document. All evaluated sentences appear to be unique.'}
                    </div>
                  )}
                </div>

                {/* Match Tooltip / Inspector Box */}
                {selectedHighlight && (
                  <div style={{
                    marginTop: '0.85rem',
                    backgroundColor: '#FEF2F2',
                    border: '1.5px solid #FECDD3',
                    borderRadius: '14px',
                    padding: '0.85rem 1rem',
                    fontSize: '0.8rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 800, color: '#DC2626' }}>
                        Matched in: {selectedHighlight.sourceTitle} ({selectedHighlight.similarity}%)
                      </span>
                      <button onClick={() => setSelectedHighlight(null)} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer' }}>
                        <X size={14} />
                      </button>
                    </div>
                    <div style={{ color: '#44403C', fontStyle: 'italic', marginBottom: '0.4rem' }}>
                      "{selectedHighlight.matchedText}"
                    </div>
                    {selectedHighlight.sourceUrl && (
                      <a href={selectedHighlight.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB', fontWeight: 700, fontSize: '0.74rem' }}>
                        Open original source →
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* CARD 3: ANALYSIS DETAILS */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px solid #E8E2D5',
                padding: '1.5rem',
                boxShadow: '0 4px 20px rgba(35,30,25,0.03)'
              }}>
                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: '#1F2421',
                  margin: '0 0 1.15rem 0'
                }}>
                  Analysis Details
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F5F0E8', paddingBottom: '0.45rem' }}>
                    <span style={{ color: '#78716C' }}>Document Type</span>
                    <span style={{ fontWeight: 800, color: '#1F2421' }}>{analysisResult.documentType || 'Text'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F5F0E8', paddingBottom: '0.45rem' }}>
                    <span style={{ color: '#78716C' }}>Total Words</span>
                    <span style={{ fontWeight: 800, color: '#1F2421' }}>{analysisResult.totalWords.toLocaleString()}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F5F0E8', paddingBottom: '0.45rem' }}>
                    <span style={{ color: '#78716C' }}>Total Characters</span>
                    <span style={{ fontWeight: 800, color: '#1F2421' }}>{analysisResult.totalCharacters.toLocaleString()}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F5F0E8', paddingBottom: '0.45rem' }}>
                    <span style={{ color: '#78716C' }}>Unique Content</span>
                    <span style={{ fontWeight: 800, color: '#10B981' }}>{analysisResult.uniqueContent}%</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F5F0E8', paddingBottom: '0.45rem' }}>
                    <span style={{ color: '#78716C' }}>Similar Content</span>
                    <span style={{ fontWeight: 800, color: '#DC2626' }}>{analysisResult.similarityScore}%</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F5F0E8', paddingBottom: '0.45rem' }}>
                    <span style={{ color: '#78716C' }}>Total Sources Found</span>
                    <span style={{ fontWeight: 800, color: '#2563EB' }}>{analysisResult.sourcesCount}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F5F0E8', paddingBottom: '0.45rem' }}>
                    <span style={{ color: '#78716C' }}>Analysis Time</span>
                    <span style={{ fontWeight: 800, color: '#1F2421' }}>{analysisResult.analysisTime} seconds</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F5F0E8', paddingBottom: '0.45rem' }}>
                    <span style={{ color: '#78716C' }}>Detection Mode</span>
                    <span style={{ fontWeight: 800, color: '#1F2421' }}>AI + Web + Academic</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.2rem' }}>
                    <span style={{ color: '#78716C' }}>Date &amp; Time</span>
                    <span style={{ fontWeight: 800, color: '#1F2421' }}>
                      {new Date(analysisResult.analyzedAt).toLocaleDateString()} {new Date(analysisResult.analyzedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                </div>

                {/* Page-by-Page breakdown if available */}
                {analysisResult.pageBreakdown && analysisResult.pageBreakdown.length > 1 && (
                  <div style={{ marginTop: '1.25rem', borderTop: '1.5px solid #F0EBE0', paddingTop: '0.85rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.5rem' }}>
                      Page-by-Page Breakdown
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '150px', overflowY: 'auto' }}>
                      {analysisResult.pageBreakdown.map((pb) => (
                        <div key={pb.pageNumber} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', backgroundColor: '#FAF7F2', padding: '0.35rem 0.6rem', borderRadius: '8px' }}>
                          <span style={{ fontWeight: 700 }}>Page {pb.pageNumber}</span>
                          <span style={{ color: '#78716C' }}>{pb.wordCount} words</span>
                          <span style={{ fontWeight: 800, color: pb.similarityNum > 20 ? '#DC2626' : '#10B981' }}>{pb.similarity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Academic Integrity & Methodology Disclosure */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E8E2D5',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem'
            }}>
              <Info size={20} style={{ color: '#7A2327', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1F2421', marginBottom: '0.2rem' }}>
                  Academic Integrity &amp; Methodology Disclosure
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.5 }}>
                  This tool calculates textual sequence similarity (n-gram shingling &amp; exact phrase mapping) against configured academic and reference sources. A similarity score indicates overlapping phrases and does not automatically establish plagiarism or academic misconduct. Common formulas, standardized definitions, and properly cited quotations may naturally generate similarity.
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Responsive Breakpoint CSS */}
      <style>{`
        @media (max-width: 1024px) {
          .plagiarism-main-grid {
            grid-template-columns: 1fr !important;
          }
          .plagiarism-bottom-grid {
            grid-template-columns: 1fr !important;
          }
          .plagiarism-gauge-row {
            flex-direction: column !important;
            text-align: center !important;
          }
          .plagiarism-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .plagiarism-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}

/**
 * Render highlighted content with interactive clickable matches
 */
function renderHighlightedContent(fullText, highlights, onSelectHighlight) {
  if (!highlights || highlights.length === 0) {
    return fullText;
  }

  // Sort highlights by startIndex
  const sorted = [...highlights].sort((a, b) => a.startIndex - b.startIndex);
  const elements = [];
  let currentIndex = 0;

  sorted.forEach((hl, i) => {
    // Text before match
    if (hl.startIndex > currentIndex) {
      elements.push(
        <span key={`text-${i}`}>
          {fullText.slice(currentIndex, hl.startIndex)}
        </span>
      );
    }

    // Matched span
    const matchedSnippet = fullText.slice(hl.startIndex, hl.endIndex) || hl.submittedText;
    elements.push(
      <mark
        key={`match-${i}`}
        onClick={() => onSelectHighlight && onSelectHighlight(hl)}
        title={`Matched in: ${hl.sourceTitle} (${hl.similarity}%)`}
        style={{
          backgroundColor: '#FFE4E6',
          color: '#9F1239',
          borderBottom: '2px solid #F43F5E',
          borderRadius: '4px',
          padding: '0 2px',
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        {matchedSnippet}
      </mark>
    );

    currentIndex = Math.max(currentIndex, hl.endIndex);
  });

  // Remaining tail text
  if (currentIndex < fullText.length) {
    elements.push(
      <span key="tail">
        {fullText.slice(currentIndex)}
      </span>
    );
  }

  return elements;
}
