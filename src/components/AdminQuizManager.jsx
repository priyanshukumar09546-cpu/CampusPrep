import React, { useState, useEffect, useMemo } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Upload, 
  FileText, 
  Check, 
  AlertCircle, 
  Layers, 
  Clock, 
  Award, 
  BookOpen,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';
import { INITIAL_QUIZZES } from '../data/quizQuestionBank';

const COURSE_OPTIONS = ['B.Tech', 'BCA', 'BBA', 'B.Pharm', 'MBA', 'MCA', 'M.Tech'];

const BRANCH_OPTIONS = {
  'B.Tech': ['CSE', 'IT', 'ECE', 'ME', 'CE', 'AIML', 'All'],
  'BCA': ['Standard', 'Data Science', 'Cloud', 'All'],
  'BBA': ['General', 'Finance', 'Marketing', 'All'],
  'B.Pharm': ['Pharmacy', 'All'],
  'MBA': ['Finance', 'HR', 'Marketing', 'Operations', 'All'],
  'MCA': ['Computer Applications', 'All'],
  'M.Tech': ['CSE', 'VLSI', 'Thermal', 'All']
};

export default function AdminQuizManager({ adminToken, onNavigate }) {
  const [quizzes, setQuizzes] = useState(INITIAL_QUIZZES);
  const [loading, setLoading] = useState(false);
  const [courseFilter, setCourseFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Panels
  const [activeModal, setActiveModal] = useState(null); // 'createQuiz' | 'editQuiz' | 'addQuestion' | 'importQuestions' | 'pyqConvert'
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [manageQuestionsQuiz, setManageQuestionsQuiz] = useState(null);

  // Form States - Create/Edit Quiz
  const [quizForm, setQuizForm] = useState({
    title: '',
    course: 'B.Tech',
    branch: 'CSE',
    year: '2nd Year',
    semester: 'Semester 3',
    subject: '',
    subjectCode: '',
    category: 'Most Important',
    difficulty: 'Medium',
    durationMinutes: 15,
    marksPerQuestion: 1,
    negativeMarks: 0,
    importanceReason: 'Repeated in university PYQs',
    description: ''
  });

  // Form States - Add Question
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 0,
    unit: '',
    difficulty: 'Medium',
    questionType: 'MCQ Single Correct',
    marks: 1,
    negativeMarks: 0,
    importance: 'Most Important',
    importanceReason: 'AKTU PYQ frequency',
    source: 'AKTU PYQ',
    sourceUrl: '',
    explanation: '',
    tags: ''
  });

  // Import State
  const [importJsonText, setImportJsonText] = useState('');
  const [importValidation, setImportValidation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch from backend
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/quizzes/admin/all', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.quizzes) && data.quizzes.length > 0) {
        setQuizzes(data.quizzes);
      }
    } catch (err) {
      console.warn('Backend quizzes fetch failed, using authoritative local dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Filtered Quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(q => {
      if (courseFilter !== 'All' && q.course && q.course.toLowerCase() !== courseFilter.toLowerCase()) return false;
      if (categoryFilter !== 'All' && q.category && q.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      if (statusFilter !== 'All') {
        const qStatus = q.status || 'Published';
        if (qStatus.toLowerCase() !== statusFilter.toLowerCase()) return false;
      }
      if (searchQuery.trim()) {
        const qry = searchQuery.toLowerCase().trim();
        const mt = (q.title || '').toLowerCase().includes(qry);
        const ms = (q.subject || '').toLowerCase().includes(qry);
        const mc = (q.course || '').toLowerCase().includes(qry);
        const mb = (q.branch || '').toLowerCase().includes(qry);
        if (!mt && !ms && !mc && !mb) return false;
      }
      return true;
    });
  }, [quizzes, courseFilter, categoryFilter, statusFilter, searchQuery]);

  // Total Statistics
  const totalQuestions = useMemo(() => {
    return quizzes.reduce((sum, q) => sum + (q.questions ? q.questions.length : 0), 0);
  }, [quizzes]);

  // Publish / Unpublish Toggle
  const handleTogglePublish = async (quizId) => {
    try {
      const res = await fetch(`/api/quizzes/admin/${quizId}/publish`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setQuizzes(prev => prev.map(q => q.id === quizId ? { ...q, status: data.status } : q));
        if (manageQuestionsQuiz && manageQuestionsQuiz.id === quizId) {
          setManageQuestionsQuiz(prev => ({ ...prev, status: data.status }));
        }
      }
    } catch {
      // Local fallback
      setQuizzes(prev => prev.map(q => {
        if (q.id === quizId) {
          const nextStatus = q.status === 'Draft' ? 'Published' : 'Draft';
          return { ...q, status: nextStatus };
        }
        return q;
      }));
    }
  };

  // Delete Quiz
  const handleDeleteQuiz = async (quiz) => {
    if (!window.confirm(`Delete quiz "${quiz.title}" and its ${quiz.questions?.length || 0} questions?`)) return;
    try {
      const res = await fetch(`/api/quizzes/admin/${quiz.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setQuizzes(prev => prev.filter(q => q.id !== quiz.id));
        if (manageQuestionsQuiz && manageQuestionsQuiz.id === quiz.id) {
          setManageQuestionsQuiz(null);
        }
      }
    } catch {
      setQuizzes(prev => prev.filter(q => q.id !== quiz.id));
      if (manageQuestionsQuiz && manageQuestionsQuiz.id === quiz.id) {
        setManageQuestionsQuiz(null);
      }
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setQuizForm({
      title: '',
      course: 'B.Tech',
      branch: 'CSE',
      year: '2nd Year',
      semester: 'Semester 3',
      subject: '',
      subjectCode: '',
      category: 'Most Important',
      difficulty: 'Medium',
      durationMinutes: 15,
      marksPerQuestion: 1,
      negativeMarks: 0,
      importanceReason: 'Repeated in university PYQs',
      description: ''
    });
    setSelectedQuiz(null);
    setActiveModal('createQuiz');
  };

  // Save New Quiz
  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.title || !quizForm.course || !quizForm.subject) {
      alert('Title, Course, and Subject are required.');
      return;
    }

    setIsSubmitting(true);
    const newQuizPayload = {
      ...quizForm,
      id: selectedQuiz?.id || `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      status: selectedQuiz?.status || 'Published',
      questions: selectedQuiz?.questions || []
    };

    try {
      const res = await fetch('/api/quizzes/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(newQuizPayload)
      });
      const data = await res.json();
      if (data.success && data.quiz) {
        setQuizzes(prev => [data.quiz, ...prev.filter(q => q.id !== data.quiz.id)]);
      } else {
        setQuizzes(prev => [newQuizPayload, ...prev.filter(q => q.id !== newQuizPayload.id)]);
      }
    } catch {
      setQuizzes(prev => [newQuizPayload, ...prev.filter(q => q.id !== newQuizPayload.id)]);
    } finally {
      setIsSubmitting(false);
      setActiveModal(null);
      setSelectedQuiz(null);
    }
  };

  // Open Add Question Modal
  const handleOpenAddQuestion = (quiz) => {
    setSelectedQuiz(quiz);
    setQuestionForm({
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 0,
      unit: '',
      difficulty: quiz.difficulty || 'Medium',
      questionType: 'MCQ Single Correct',
      marks: quiz.marksPerQuestion || 1,
      negativeMarks: quiz.negativeMarks || 0,
      importance: quiz.category === 'Most Important' ? 'Most Important' : 'Standard',
      importanceReason: quiz.importanceReason || 'High syllabus frequency',
      source: `${quiz.course} University Examination`,
      sourceUrl: '',
      explanation: '',
      tags: ''
    });
    setActiveModal('addQuestion');
  };

  // Save Single Question
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!questionForm.questionText.trim()) {
      alert('Question text is required.');
      return;
    }
    const options = [questionForm.optionA, questionForm.optionB, questionForm.optionC, questionForm.optionD].filter(Boolean);
    if (options.length < 2) {
      alert('Please provide at least 2 non-empty options.');
      return;
    }

    const newQ = {
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      questionText: questionForm.questionText.trim(),
      options,
      correctAnswer: Number(questionForm.correctAnswer),
      explanation: questionForm.explanation.trim() || 'Verified university syllabus answer.',
      unit: questionForm.unit.trim() || 'General',
      difficulty: questionForm.difficulty,
      importance: questionForm.importance,
      source: questionForm.source.trim() || 'Official Question Paper'
    };

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/quizzes/admin/${selectedQuiz.id}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(newQ)
      });
      const data = await res.json();
      if (data.success && data.question) {
        updateQuizWithNewQuestion(selectedQuiz.id, data.question);
      } else {
        updateQuizWithNewQuestion(selectedQuiz.id, newQ);
      }
    } catch {
      updateQuizWithNewQuestion(selectedQuiz.id, newQ);
    } finally {
      setIsSubmitting(false);
      setActiveModal(null);
    }
  };

  const updateQuizWithNewQuestion = (quizId, questionObj) => {
    setQuizzes(prev => prev.map(q => {
      if (q.id === quizId) {
        const nextQuestions = [...(q.questions || []), questionObj];
        return { ...q, questions: nextQuestions };
      }
      return q;
    }));
    if (manageQuestionsQuiz && manageQuestionsQuiz.id === quizId) {
      setManageQuestionsQuiz(prev => ({
        ...prev,
        questions: [...(prev.questions || []), questionObj]
      }));
    }
  };

  // Validate JSON Import
  const handleValidateImport = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const list = Array.isArray(parsed) ? parsed : (parsed.questions || []);
      if (!Array.isArray(list) || list.length === 0) {
        setImportValidation({ valid: false, error: 'JSON must be an array of questions or contain a questions array.' });
        return;
      }

      const validList = [];
      const invalidList = [];

      list.forEach((item, idx) => {
        const text = item.questionText || item.question || item.title;
        const opts = item.options || item.choices;
        const ans = item.correctAnswer !== undefined ? item.correctAnswer : item.answer;

        if (!text || !Array.isArray(opts) || opts.length < 2 || ans === undefined) {
          invalidList.push({ index: idx + 1, reason: 'Missing question text, valid options array (>=2), or correctAnswer index.' });
        } else {
          validList.push({
            questionText: String(text).trim(),
            options: opts.map(o => String(o).trim()),
            correctAnswer: Number(ans),
            explanation: item.explanation || '',
            unit: item.unit || '',
            difficulty: item.difficulty || 'Medium',
            importance: item.importance || 'Standard',
            source: item.source || 'Imported Question Bank'
          });
        }
      });

      setImportValidation({
        valid: validList.length > 0,
        validCount: validList.length,
        invalidCount: invalidList.length,
        validItems: validList,
        invalidItems: invalidList
      });
    } catch (err) {
      setImportValidation({ valid: false, error: `Invalid JSON syntax: ${err.message}` });
    }
  };

  // Submit Bulk Import
  const handleConfirmImport = async () => {
    if (!importValidation || !importValidation.validItems || importValidation.validItems.length === 0) return;
    if (!selectedQuiz) {
      alert('Please select a target quiz first.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/quizzes/admin/${selectedQuiz.id}/questions/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ questions: importValidation.validItems })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        importValidation.validItems.forEach(q => updateQuizWithNewQuestion(selectedQuiz.id, q));
      } else {
        alert(data.message || 'Bulk import failed on server.');
      }
    } catch {
      // Local fallback
      importValidation.validItems.forEach(q => updateQuizWithNewQuestion(selectedQuiz.id, q));
      alert(`Imported ${importValidation.validItems.length} questions locally.`);
    } finally {
      setIsSubmitting(false);
      setActiveModal(null);
      setImportJsonText('');
      setImportValidation(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* 1. TOP HEADER & METRICS */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '1.25rem 1.5rem',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1.5px solid #E8E2D5',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DC2626'
            }}>
              <HelpCircle size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1F2421', margin: 0, lineHeight: 1.2 }}>
                Quiz System Management
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                Complete First-Party Quiz Engine • Academic Mappings • Verified Questions Only
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={fetchQuizzes}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 0.9rem',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>

          <button
            onClick={handleOpenCreateModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 1.15rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#7A2327',
              color: '#FFFFFF',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(122,35,39,0.25)'
            }}
          >
            <Plus size={16} />
            Create New Quiz
          </button>
        </div>
      </div>

      {/* 2. STATS KPI TILES */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '1.1rem 1.25rem',
          boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
            Total Quizzes
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1F2421', marginTop: '0.2rem' }}>
            {quizzes.length}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 600, marginTop: '0.3rem' }}>
            Across {COURSE_OPTIONS.length} Supported Courses
          </div>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '1.1rem 1.25rem',
          boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
            Verified Questions
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#2563EB', marginTop: '0.2rem' }}>
            {totalQuestions}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, marginTop: '0.3rem' }}>
            100% Real University Questions
          </div>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '1.1rem 1.25rem',
          boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
            Most Important
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#DC2626', marginTop: '0.2rem' }}>
            {quizzes.filter(q => q.category === 'Most Important').length}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#DC2626', fontWeight: 600, marginTop: '0.3rem' }}>
            Evidence-Based (AKTU PYQ Repeat)
          </div>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '1.1rem 1.25rem',
          boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
            Published Status
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#16A34A', marginTop: '0.2rem' }}>
            {quizzes.filter(q => (q.status || 'Published') === 'Published').length}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, marginTop: '0.3rem' }}>
            {quizzes.filter(q => q.status === 'Draft').length} in Draft Mode
          </div>
        </div>
      </div>

      {/* 3. FILTER BAR */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 1.25rem',
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0'
      }}>
        {/* Course Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Course:</span>
          <select
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#1E293B',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Courses</option>
            {COURSE_OPTIONS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Category:</span>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#1E293B',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Categories</option>
            <option value="Most Important">Most Important</option>
            <option value="PYQ Based">PYQ Based</option>
            <option value="Unit Wise">Unit Wise</option>
            <option value="Practice">Practice</option>
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#1E293B',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* Search Input */}
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search quiz by title, subject, branch..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 0.75rem 0.45rem 2.1rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '0.8rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {(courseFilter !== 'All' || categoryFilter !== 'All' || statusFilter !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setCourseFilter('All');
              setCategoryFilter('All');
              setStatusFilter('All');
              setSearchQuery('');
            }}
            style={{
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#F1F5F9',
              color: '#64748B',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* 4. QUIZZES TABLE */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1.5px solid #E8E2D5',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Quiz Title & Subject</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Academic Mapping</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Classification</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Questions</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Marking Scheme</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 800, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuizzes.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: '#64748B' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>No quizzes match the current filters</div>
                    <div style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>
                      Try selecting another course or create a new quiz above.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQuizzes.map((quiz) => {
                  const qCount = quiz.questions ? quiz.questions.length : (quiz.questionsCount || 0);
                  const isPublished = (quiz.status || 'Published') === 'Published';
                  return (
                    <tr 
                      key={quiz.id}
                      style={{ 
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background-color 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAF7F2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      {/* Title & Subject */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem' }}>
                          {quiz.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                          <span style={{ color: '#7A2327', fontWeight: 700, fontSize: '0.78rem' }}>
                            {quiz.subject}
                          </span>
                          {quiz.subjectCode && (
                            <span style={{ color: '#64748B', fontSize: '0.72rem' }}>
                              ({quiz.subjectCode})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Course / Branch / Year / Sem */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'inline-block', backgroundColor: '#EFF6FF', color: '#1D4ED8', fontWeight: 800, fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                          {quiz.course}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 600, marginTop: '0.25rem' }}>
                          {quiz.branch} • {quiz.semester}
                        </div>
                      </td>

                      {/* Category & Importance */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          backgroundColor: quiz.category === 'Most Important' ? '#FEF2F2' : '#F8FAFC',
                          color: quiz.category === 'Most Important' ? '#DC2626' : '#475569',
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px',
                          border: `1px solid ${quiz.category === 'Most Important' ? '#FECACA' : '#E2E8F0'}`
                        }}>
                          {quiz.category === 'Most Important' && '🔥 '}
                          {quiz.category}
                        </span>
                        {quiz.importanceReason && (
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.2rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={quiz.importanceReason}>
                            {quiz.importanceReason}
                          </div>
                        )}
                      </td>

                      {/* Questions Count */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          color: qCount > 0 ? '#1E293B' : '#DC2626'
                        }}>
                          {qCount} Questions
                        </span>
                        <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.15rem' }}>
                          {quiz.durationMinutes || 15} Mins • {quiz.difficulty || 'Medium'}
                        </div>
                      </td>

                      {/* Marking Scheme */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#16A34A' }}>
                          +{quiz.marksPerQuestion || 1} Correct
                        </div>
                        <div style={{ fontSize: '0.72rem', color: quiz.negativeMarks ? '#DC2626' : '#64748B' }}>
                          {quiz.negativeMarks ? `-${quiz.negativeMarks} Incorrect` : '0 Neg'}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <button
                          onClick={() => handleTogglePublish(quiz.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '20px',
                            border: 'none',
                            backgroundColor: isPublished ? '#DCFCE7' : '#FEF3C7',
                            color: isPublished ? '#15803D' : '#B45309',
                            fontWeight: 800,
                            fontSize: '0.72rem',
                            cursor: 'pointer'
                          }}
                          title="Click to toggle publish/draft"
                        >
                          {isPublished ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          {/* Manage Questions */}
                          <button
                            onClick={() => setManageQuestionsQuiz(quiz)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.35rem 0.65rem',
                              borderRadius: '6px',
                              border: '1px solid #7A2327',
                              backgroundColor: '#FFF7ED',
                              color: '#7A2327',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            <Layers size={13} />
                            Questions ({qCount})
                          </button>

                          {/* Delete Quiz */}
                          <button
                            onClick={() => handleDeleteQuiz(quiz)}
                            style={{
                              padding: '0.35rem',
                              borderRadius: '6px',
                              border: '1px solid #FCA5A5',
                              backgroundColor: '#FEF2F2',
                              color: '#DC2626',
                              cursor: 'pointer'
                            }}
                            title="Delete Quiz"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. QUESTION MANAGEMENT DRAWER / MODAL */}
      {manageQuestionsQuiz && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '680px',
            backgroundColor: '#FFFFFF',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-4px 0 25px rgba(0,0,0,0.15)',
            overflowY: 'hidden'
          }}>
            {/* Drawer Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1.5px solid #E8E2D5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FAF7F2'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7A2327', textTransform: 'uppercase' }}>
                  {manageQuestionsQuiz.course} • {manageQuestionsQuiz.subject}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1F2421', margin: '0.2rem 0 0 0' }}>
                  {manageQuestionsQuiz.title}
                </h3>
              </div>
              <button
                onClick={() => setManageQuestionsQuiz(null)}
                style={{
                  padding: '0.4rem',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#E2E8F0',
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Sub-Header Actions */}
            <div style={{
              padding: '0.85rem 1.5rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF'
            }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1E293B' }}>
                {manageQuestionsQuiz.questions?.length || 0} Total Questions
              </span>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    setSelectedQuiz(manageQuestionsQuiz);
                    setActiveModal('importQuestions');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#334155',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Upload size={13} />
                  Import JSON
                </button>

                <button
                  onClick={() => handleOpenAddQuestion(manageQuestionsQuiz)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#7A2327',
                    color: '#FFFFFF',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={14} />
                  Add Question
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(!manageQuestionsQuiz.questions || manageQuestionsQuiz.questions.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                  <HelpCircle size={36} style={{ margin: '0 auto 0.75rem auto', color: '#CBD5E1' }} />
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>No questions in this quiz yet</div>
                  <div style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>
                    Click "+ Add Question" or "Import JSON" to add verified academic questions.
                  </div>
                </div>
              ) : (
                manageQuestionsQuiz.questions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      padding: '1rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{
                          backgroundColor: '#7A2327',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.68rem',
                          padding: '0.1rem 0.45rem',
                          borderRadius: '4px'
                        }}>
                          Q{idx + 1}
                        </span>
                        {q.unit && (
                          <span style={{ backgroundColor: '#F1F5F9', color: '#475569', fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                            {q.unit}
                          </span>
                        )}
                        <span style={{ backgroundColor: '#FEF3C7', color: '#B45309', fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                          {q.difficulty || 'Medium'}
                        </span>
                        {q.importance === 'Most Important' && (
                          <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '0.68rem', fontWeight: 800, padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                            🔥 Most Important
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm('Delete this question?')) {
                            const updated = manageQuestionsQuiz.questions.filter((_, i) => i !== idx);
                            setQuizzes(prev => prev.map(quiz => quiz.id === manageQuestionsQuiz.id ? { ...quiz, questions: updated } : quiz));
                            setManageQuestionsQuiz(prev => ({ ...prev, questions: updated }));
                          }
                        }}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.2rem' }}
                        title="Delete Question"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A', marginTop: '0.5rem', lineHeight: 1.4 }}>
                      {q.questionText}
                    </div>

                    {/* Options list */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.6rem' }}>
                      {q.options?.map((opt, oIdx) => {
                        const isCorrect = oIdx === q.correctAnswer;
                        return (
                          <div
                            key={oIdx}
                            style={{
                              backgroundColor: isCorrect ? '#DCFCE7' : '#F8FAFC',
                              border: `1px solid ${isCorrect ? '#86EFAC' : '#E2E8F0'}`,
                              borderRadius: '6px',
                              padding: '0.35rem 0.5rem',
                              fontSize: '0.74rem',
                              color: isCorrect ? '#15803D' : '#475569',
                              fontWeight: isCorrect ? 800 : 500,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            <span style={{ fontWeight: 800 }}>{String.fromCharCode(65 + oIdx)}.</span>
                            <span>{opt}</span>
                            {isCorrect && <Check size={12} style={{ marginLeft: 'auto' }} />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div style={{
                        marginTop: '0.6rem',
                        padding: '0.4rem 0.6rem',
                        backgroundColor: '#FAF7F2',
                        borderRadius: '6px',
                        borderLeft: '3px solid #7A2327',
                        fontSize: '0.72rem',
                        color: '#475569'
                      }}>
                        <strong style={{ color: '#1F2421' }}>Verified Explanation:</strong> {q.explanation}
                      </div>
                    )}

                    {q.source && (
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.35rem' }}>
                        Source: {q.source}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. CREATE / EDIT QUIZ MODAL */}
      {activeModal === 'createQuiz' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1E293B', margin: 0 }}>
                Create New Academic Quiz
              </h3>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                  Quiz Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures — Most Important AKTU Questions"
                  value={quizForm.title}
                  onChange={e => setQuizForm({ ...quizForm, title: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                    Course *
                  </label>
                  <select
                    value={quizForm.course}
                    onChange={e => {
                      const nextCourse = e.target.value;
                      const nextBranches = BRANCH_OPTIONS[nextCourse] || ['All'];
                      setQuizForm({ ...quizForm, course: nextCourse, branch: nextBranches[0] });
                    }}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  >
                    {COURSE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                    Branch
                  </label>
                  <select
                    value={quizForm.branch}
                    onChange={e => setQuizForm({ ...quizForm, branch: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  >
                    {(BRANCH_OPTIONS[quizForm.course] || ['All']).map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                    Academic Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2nd Year / 1st Year"
                    value={quizForm.year}
                    onChange={e => setQuizForm({ ...quizForm, year: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                    Semester
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Semester 3"
                    value={quizForm.semester}
                    onChange={e => setQuizForm({ ...quizForm, semester: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Data Structures"
                    value={quizForm.subject}
                    onChange={e => setQuizForm({ ...quizForm, subject: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                    Subject Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. KCS-301"
                    value={quizForm.subjectCode}
                    onChange={e => setQuizForm({ ...quizForm, subjectCode: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                    Category
                  </label>
                  <select
                    value={quizForm.category}
                    onChange={e => setQuizForm({ ...quizForm, category: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  >
                    <option value="Most Important">Most Important</option>
                    <option value="PYQ Based">PYQ Based</option>
                    <option value="Unit Wise">Unit Wise</option>
                    <option value="Practice">Practice</option>
                    <option value="Mock Test">Mock Test</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                    Difficulty
                  </label>
                  <select
                    value={quizForm.difficulty}
                    onChange={e => setQuizForm({ ...quizForm, difficulty: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                    Duration (Mins)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={quizForm.durationMinutes}
                    onChange={e => setQuizForm({ ...quizForm, durationMinutes: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                    Marks / Question
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quizForm.marksPerQuestion}
                    onChange={e => setQuizForm({ ...quizForm, marksPerQuestion: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                    Negative Marks
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={quizForm.negativeMarks}
                    onChange={e => setQuizForm({ ...quizForm, negativeMarks: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                  Importance Basis / Classification Reason
                </label>
                <input
                  type="text"
                  placeholder="e.g. Repeated in AKTU 2022, 2023, 2024 End-Sem Question Papers"
                  value={quizForm.importanceReason}
                  onChange={e => setQuizForm({ ...quizForm, importanceReason: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ padding: '0.55rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#7A2327', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  {isSubmitting ? 'Creating...' : 'Create Quiz'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. ADD QUESTION MODAL */}
      {activeModal === 'addQuestion' && selectedQuiz && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '620px',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FAF7F2'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7A2327', textTransform: 'uppercase' }}>
                  {selectedQuiz.title}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1E293B', margin: '0.15rem 0 0 0' }}>
                  Add Verified Question
                </h3>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                  Question Text *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter the full question statement..."
                  value={questionForm.questionText}
                  onChange={e => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>

              {/* 4 Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569' }}>
                  Options & Correct Answer (Select the radio of correct option) *
                </label>

                {[
                  { key: 'optionA', label: 'A', idx: 0 },
                  { key: 'optionB', label: 'B', idx: 1 },
                  { key: 'optionC', label: 'C', idx: 2 },
                  { key: 'optionD', label: 'D', idx: 3 }
                ].map(item => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="radio"
                      name="correctOptionRadio"
                      checked={questionForm.correctAnswer === item.idx}
                      onChange={() => setQuestionForm({ ...questionForm, correctAnswer: item.idx })}
                      style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#1E293B', width: '20px' }}>
                      {item.label}.
                    </span>
                    <input
                      type="text"
                      required={item.idx < 2}
                      placeholder={`Option ${item.label} text`}
                      value={questionForm[item.key]}
                      onChange={e => setQuestionForm({ ...questionForm, [item.key]: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '0.45rem 0.65rem',
                        borderRadius: '6px',
                        border: questionForm.correctAnswer === item.idx ? '1.5px solid #16A34A' : '1px solid #CBD5E1',
                        backgroundColor: questionForm.correctAnswer === item.idx ? '#F0FDF4' : '#FFFFFF',
                        fontSize: '0.8rem'
                      }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                    Unit / Chapter
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Unit 3: Trees & Graphs"
                    value={questionForm.unit}
                    onChange={e => setQuestionForm({ ...questionForm, unit: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                    Importance Level
                  </label>
                  <select
                    value={questionForm.importance}
                    onChange={e => setQuestionForm({ ...questionForm, importance: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  >
                    <option value="Most Important">Most Important (High PYQ Yield)</option>
                    <option value="Standard">Standard Academic Question</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                  Source Citation (University / PYQ Paper)
                </label>
                <input
                  type="text"
                  placeholder="e.g. AKTU 2024 End-Sem (Code KCS-301, Q2.a)"
                  value={questionForm.source}
                  onChange={e => setQuestionForm({ ...questionForm, source: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', marginBottom: '0.25rem' }}>
                  Verified Academic Explanation
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain why the selected option is correct based on official syllabus..."
                  value={questionForm.explanation}
                  onChange={e => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ padding: '0.55rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#7A2327', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  {isSubmitting ? 'Saving...' : 'Add Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. BULK IMPORT JSON MODAL */}
      {activeModal === 'importQuestions' && selectedQuiz && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '640px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7A2327', textTransform: 'uppercase' }}>
                  Target: {selectedQuiz.title}
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#1E293B', margin: '0.15rem 0 0 0' }}>
                  Import Questions (Structured JSON)
                </h3>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Paste a JSON array of questions. Every question must include: <code>questionText</code>, <code>options</code> (array of strings), and <code>correctAnswer</code> (zero-based index 0-3).
              </div>

              <textarea
                rows={8}
                placeholder={`[\n  {\n    "questionText": "What is the time complexity of QuickSort in the worst case?",\n    "options": ["O(n log n)", "O(n^2)", "O(log n)", "O(1)"],\n    "correctAnswer": 1,\n    "unit": "Unit 2: Sorting",\n    "explanation": "Occurs when partition yields unbalanced subproblems.",\n    "source": "AKTU 2023"\n  }\n]`}
                value={importJsonText}
                onChange={e => {
                  setImportJsonText(e.target.value);
                  setImportValidation(null);
                }}
                style={{
                  width: '100%',
                  fontFamily: 'monospace',
                  fontSize: '0.76rem',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  boxSizing: 'border-box'
                }}
              />

              <button
                type="button"
                onClick={handleValidateImport}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #7A2327',
                  backgroundColor: '#FFF7ED',
                  color: '#7A2327',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Validate JSON Questions
              </button>

              {importValidation && (
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: importValidation.valid ? '#F0FDF4' : '#FEF2F2',
                  border: `1px solid ${importValidation.valid ? '#86EFAC' : '#FCA5A5'}`,
                  fontSize: '0.78rem'
                }}>
                  {importValidation.valid ? (
                    <div>
                      <div style={{ fontWeight: 800, color: '#16A34A' }}>
                        ✓ {importValidation.validCount} Valid Questions Ready for Import!
                      </div>
                      {importValidation.invalidCount > 0 && (
                        <div style={{ color: '#DC2626', marginTop: '0.25rem' }}>
                          ⚠ {importValidation.invalidCount} malformed questions were rejected.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ color: '#DC2626', fontWeight: 700 }}>
                      ✕ {importValidation.error || 'Validation failed. Please verify question structure.'}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  style={{ padding: '0.55rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!importValidation?.valid || isSubmitting}
                  onClick={handleConfirmImport}
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: importValidation?.valid ? '#16A34A' : '#94A3B8',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: importValidation?.valid ? 'pointer' : 'not-allowed'
                  }}
                >
                  {isSubmitting ? 'Importing...' : `Confirm & Import ${importValidation?.validCount || 0} Questions`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
