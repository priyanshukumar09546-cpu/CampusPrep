// src/pages/TimetablePage.jsx
// ============================================================================
// PROFESSORVIRUS — TIME TABLE SYSTEM
// Real working timetable with PDF upload & extraction, review screen,
// adaptive weekly grid, today's schedule, study blocks, exam schedule,
// reminders, Google Calendar .ics export, CSV export, and persistent storage.
// ============================================================================

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calendar, Clock, Upload, Plus, Download, Printer, Share2,
  CheckCircle2, AlertCircle, RefreshCw, Edit2, Trash2, Copy,
  ChevronLeft, ChevronRight, BookOpen, Layers, Award,
  Check, X, Sparkles, Filter, ExternalLink, ShieldCheck,
  Bell, FileText, Bookmark, BarChart2, Dumbbell, GraduationCap,
  List, Grid, Eye, Settings, Briefcase, ChevronDown
} from 'lucide-react';
import { DAYS_OF_WEEK, SUBJECT_PALETTE, getSubjectColor, timeStringToMinutes } from '../utils/timetableConstants.js';

async function safeParseJson(res) {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } catch (err) {
    return { success: false, error: 'Invalid response format from server (HTTP ' + (res ? res.status : 500) + ')' };
  }
}

export default function TimetablePage({ onNavigate }) {
  // Main Data States
  const [timetable, setTimetable] = useState({
    title: 'My College Time Table',
    semester: 'Current Semester',
    branch: 'Computer Science',
    section: 'A',
    entries: [],
    studyBlocks: [],
    exams: [],
    reminders: [],
    settings: {
      showBreaks: true,
      showSubjects: true,
      showStudyBlocks: true,
      showOtherActivities: true,
      timeView: '8 AM - 8 PM'
    }
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // View States
  const [activeTab, setActiveTab] = useState('weekly'); // 'weekly' | 'classes' | 'study' | 'assignments' | 'exams' | 'reminders' | 'export'
  const [viewMode, setViewMode] = useState('week'); // 'week' | 'list'
  const [selectedMobileDay, setSelectedMobileDay] = useState(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const idx = new Date().getDay();
    return idx === 0 ? 'Monday' : days[idx];
  });
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Upload & Extraction States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState(0); // 0: Idle, 1: Reading, 2: Extracting, 3: Detecting, 4: Ready
  const [extractedDraft, setExtractedDraft] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Modal States
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null); // null = new, object = edit
  const [studyBlockModalOpen, setStudyBlockModalOpen] = useState(false);
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [subjectManageModalOpen, setSubjectManageModalOpen] = useState(false);

  // Toast auto-clear
  useEffect(() => {
    if (successToast) {
      const t = setTimeout(() => setSuccessToast(''), 4000);
      return () => clearTimeout(t);
    }
  }, [successToast]);

  // Fetch User Timetable on mount
  const fetchTimetable = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/timetable');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await safeParseJson(res);
      if (data.success && data.timetable) {
        setTimetable(prev => ({
          ...prev,
          ...data.timetable,
          entries: data.timetable.entries || [],
          studyBlocks: data.timetable.studyBlocks || [],
          exams: data.timetable.exams || [],
          reminders: data.timetable.reminders || [],
          settings: { ...prev.settings, ...(data.timetable.settings || {}) }
        }));
      }
    } catch (err) {
      console.warn('Timetable fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  // Compute Today's Schedule Live
  const todaySchedule = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const todayName = days[now.getDay()];
    const currentMin = now.getHours() * 60 + now.getMinutes();

    const todayEntries = (timetable.entries || [])
      .filter(e => e.day.toLowerCase() === todayName.toLowerCase())
      .sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime));

    let current = null;
    let next = null;
    let remaining = 0;

    for (let i = 0; i < todayEntries.length; i++) {
      const e = todayEntries[i];
      const start = timeStringToMinutes(e.startTime);
      const end = timeStringToMinutes(e.endTime);

      if (currentMin >= start && currentMin <= end) {
        current = e;
        remaining = end - currentMin;
        next = todayEntries[i + 1] || null;
        break;
      } else if (currentMin < start) {
        if (!next) next = e;
      }
    }

    return {
      todayName,
      todayEntries,
      currentClass: current,
      nextClass: next,
      remainingMinutes: remaining
    };
  }, [timetable.entries]);

  // Unique Subjects List
  const uniqueSubjects = useMemo(() => {
    const map = new Map();
    (timetable.entries || []).forEach(e => {
      if (e.type === 'Break') return;
      const key = (e.subjectCode || e.subjectName || 'Unknown').trim();
      if (!map.has(key)) {
        map.set(key, {
          code: e.subjectCode || '',
          name: e.subjectName || 'Subject Class',
          faculty: e.faculty || '',
          color: e.color || '#FFE4E6'
        });
      }
    });
    return Array.from(map.values());
  }, [timetable.entries]);

  // Dynamic Time Rows (e.g. 8 AM to 8 PM or derived from entries)
  const timeSlots = useMemo(() => {
    const view = timetable.settings?.timeView || '8 AM - 8 PM';
    let startHour = 8;
    let endHour = 20;

    if (view === '7 AM - 9 PM') {
      startHour = 7;
      endHour = 21;
    } else if (view === 'Full Day') {
      startHour = 6;
      endHour = 23;
    }

    const slots = [];
    for (let h = startHour; h <= endHour; h++) {
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
      slots.push({
        label: `${displayH}:00 ${period}`,
        minutes: h * 60,
        hour: h
      });
    }
    return slots;
  }, [timetable.settings?.timeView]);

  // Date Range Display for Week
  const weekRangeString = useMemo(() => {
    const now = new Date();
    now.setDate(now.getDate() + currentWeekOffset * 7);
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(now.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const fmt = d => d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    return `Mon, ${fmt(monday)} – Sun, ${fmt(sunday)} ${sunday.getFullYear()}`;
  }, [currentWeekOffset]);

  // ==========================================================================
  // HANDLERS: PDF UPLOAD & EXTRACTION
  // ==========================================================================
  const handlePdfUpload = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Only valid PDF files are allowed for timetable extraction.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('PDF file exceeds maximum allowed size of 5 MB.');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');
    setUploadStage(1); // Reading PDF

    const formData = new FormData();
    formData.append('pdf', file);

    const stageTimer1 = setTimeout(() => setUploadStage(2), 700); // Extracting subjects
    const stageTimer2 = setTimeout(() => setUploadStage(3), 1400); // Detecting days & time slots

    try {
      const res = await fetch('/api/timetable/upload', {
        method: 'POST',
        body: formData
      });

      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);

      const data = await safeParseJson(res);
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to extract timetable from PDF');
      }

      setUploadStage(4); // Ready!
      setExtractedDraft(data.draftTimetable);
      setSuccessToast(`Found ${data.draftTimetable.entries?.length || 0} classes in ${file.name}!`);
    } catch (err) {
      setUploadStage(0);
      setErrorMsg(err.message || 'Error processing timetable PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmDraft = async (draft) => {
    setLoading(true);
    try {
      const res = await fetch('/api/timetable/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft || extractedDraft)
      });
      const data = await safeParseJson(res);
      if (data.success && data.timetable) {
        setTimetable(prev => ({
          ...prev,
          ...data.timetable
        }));
        setReviewModalOpen(false);
        setExtractedDraft(null);
        setUploadStage(0);
        setSuccessToast('Timetable confirmed and activated successfully!');
      } else {
        throw new Error(data.error || 'Failed to save timetable');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error confirming timetable');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================================
  // HANDLERS: ADD / EDIT / DELETE CLASS
  // ==========================================================================
  const handleSaveClassEntry = async (entryData) => {
    try {
      if (editingEntry && editingEntry.id) {
        // Edit
        const res = await fetch(`/api/timetable/entry/${editingEntry.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entryData)
        });
        const data = await safeParseJson(res);
        if (data.success && data.timetable) {
          setTimetable(prev => ({ ...prev, ...data.timetable }));
          setSuccessToast('Class updated successfully!');
        }
      } else {
        // Add
        const res = await fetch('/api/timetable/entry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entryData)
        });
        const data = await safeParseJson(res);
        if (data.success && data.timetable) {
          setTimetable(prev => ({ ...prev, ...data.timetable }));
          setSuccessToast('Class added to schedule!');
        }
      }
      setClassModalOpen(false);
      setEditingEntry(null);
    } catch (err) {
      setErrorMsg('Failed to save class entry.');
    }
  };

  const handleDeleteClassEntry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      const res = await fetch(`/api/timetable/entry/${id}`, { method: 'DELETE' });
      const data = await safeParseJson(res);
      if (data.success && data.timetable) {
        setTimetable(prev => ({ ...prev, ...data.timetable }));
        setSuccessToast('Class deleted.');
        setClassModalOpen(false);
        setEditingEntry(null);
      }
    } catch (err) {
      setErrorMsg('Failed to delete class.');
    }
  };

  const handleDuplicateClassEntry = async (entry) => {
    const copy = {
      ...entry,
      id: undefined,
      startTime: entry.startTime,
      endTime: entry.endTime
    };
    await handleSaveClassEntry(copy);
  };

  // ==========================================================================
  // HANDLERS: STUDY BLOCKS, EXAMS, REMINDERS
  // ==========================================================================
  const handleAddStudyBlock = async (blockData) => {
    try {
      const res = await fetch('/api/timetable/study-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blockData)
      });
      const data = await safeParseJson(res);
      if (data.success && data.timetable) {
        setTimetable(prev => ({ ...prev, ...data.timetable }));
        setStudyBlockModalOpen(false);
        setSuccessToast('Study block scheduled!');
      }
    } catch (err) {
      setErrorMsg('Failed to add study block.');
    }
  };

  const handleDeleteStudyBlock = async (id) => {
    try {
      const res = await fetch(`/api/timetable/study-block/${id}`, { method: 'DELETE' });
      const data = await safeParseJson(res);
      if (data.success && data.timetable) {
        setTimetable(prev => ({ ...prev, ...data.timetable }));
        setSuccessToast('Study block removed.');
      }
    } catch (err) {
      setErrorMsg('Failed to delete study block.');
    }
  };

  const handleAddExam = async (examData) => {
    try {
      const res = await fetch('/api/timetable/exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examData)
      });
      const data = await safeParseJson(res);
      if (data.success && data.timetable) {
        setTimetable(prev => ({ ...prev, ...data.timetable }));
        setExamModalOpen(false);
        setSuccessToast('Exam added to schedule!');
      }
    } catch (err) {
      setErrorMsg('Failed to add exam.');
    }
  };

  const handleDeleteExam = async (id) => {
    try {
      const res = await fetch(`/api/timetable/exam/${id}`, { method: 'DELETE' });
      const data = await safeParseJson(res);
      if (data.success && data.timetable) {
        setTimetable(prev => ({ ...prev, ...data.timetable }));
        setSuccessToast('Exam removed.');
      }
    } catch (err) {
      setErrorMsg('Failed to delete exam.');
    }
  };

  const handleAddReminder = async (remData) => {
    try {
      const res = await fetch('/api/timetable/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(remData)
      });
      const data = await safeParseJson(res);
      if (data.success && data.timetable) {
        setTimetable(prev => ({ ...prev, ...data.timetable }));
        setReminderModalOpen(false);
        setSuccessToast('Reminder created!');
      }
    } catch (err) {
      setErrorMsg('Failed to add reminder.');
    }
  };

  const handleToggleReminder = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/timetable/reminder/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
      });
      const data = await safeParseJson(res);
      if (data.success && data.timetable) {
        setTimetable(prev => ({ ...prev, ...data.timetable }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      const res = await fetch(`/api/timetable/reminder/${id}`, { method: 'DELETE' });
      const data = await safeParseJson(res);
      if (data.success && data.timetable) {
        setTimetable(prev => ({ ...prev, ...data.timetable }));
        setSuccessToast('Reminder removed.');
      }
    } catch (err) {
      setErrorMsg('Failed to delete reminder.');
    }
  };

  // Toggle display settings
  const handleToggleSetting = async (key) => {
    const newSettings = {
      ...timetable.settings,
      [key]: !timetable.settings[key]
    };
    setTimetable(prev => ({ ...prev, settings: newSettings }));
    try {
      await fetch('/api/timetable/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (e) {}
  };

  // Print timetable action
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', paddingBottom: '4rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* ============================================================ */}
      {/* 1. TOP HEADER BANNER (Title + Mascot / Quote) */}
      {/* ============================================================ */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1.5px solid #E8E2D5', padding: '1.5rem 0 1.25rem' }}>
        <div className="container" style={{ margin: '0 auto', maxWidth: '1360px', padding: '0 1rem' }}>
          
          {/* Toast Notification */}
          {successToast && (
            <div style={{
              backgroundColor: '#ECFDF5',
              border: '1.5px solid #10B981',
              color: '#065F46',
              borderRadius: '12px',
              padding: '0.65rem 1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.88rem',
              fontWeight: 700
            }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>{successToast}</span>
            </div>
          )}

          {errorMsg && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1.5px solid #EF4444',
              color: '#991B1B',
              borderRadius: '12px',
              padding: '0.65rem 1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              fontSize: '0.88rem',
              fontWeight: 700
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} color="#DC2626" />
                <span>{errorMsg}</span>
              </div>
              <button onClick={() => setErrorMsg('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B' }}>✕</button>
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
            
            {/* Title & Subtitle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#781416',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 6px 16px rgba(120, 20, 22, 0.25)',
                flexShrink: 0
              }}>
                <Calendar size={28} />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.85rem', fontWeight: 900, color: '#1C1E21', letterSpacing: '-0.5px' }}>
                  Time Table
                </h1>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', color: '#65676B', fontWeight: 500 }}>
                  Organize your classes, study time and activities. Upload your college time table or create your own.
                </p>
              </div>
            </div>

            {/* Motivational Quote Card */}
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '16px',
              padding: '0.75rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              maxWidth: '460px'
            }}>
              <div style={{ fontSize: '1.75rem', lineHeight: 1, color: '#781416', fontWeight: 900 }}>“</div>
              <div style={{ fontSize: '0.82rem', color: '#781416', fontWeight: 600, fontStyle: 'italic', lineHeight: 1.4 }}>
                A well-planned day brings a more successful tomorrow. <strong style={{ fontStyle: 'normal', color: '#991B1B' }}>— Keep going!</strong>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="container" style={{ margin: '1.5rem auto 0', maxWidth: '1360px', padding: '0 1rem' }}>
        
        {/* ============================================================ */}
        {/* 2. THREE-STEP PDF UPLOAD & AI PROCESSING BANNER */}
        {/* ============================================================ */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E8E2D5',
          borderRadius: '20px',
          padding: '1.25rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          marginBottom: '1.75rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem',
            alignItems: 'center'
          }}>
            
            {/* Step 1: Upload Card */}
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handlePdfUpload(e.dataTransfer.files[0]);
                }
              }}
              style={{
                border: '2px dashed #E2E8F0',
                borderRadius: '16px',
                padding: '1.25rem 1rem',
                textAlign: 'center',
                backgroundColor: '#F8FAFC',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#781416'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf"
                style={{ display: 'none' }}
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handlePdfUpload(e.target.files[0]);
                  }
                }}
              />
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#FEF2F2',
                color: '#781416',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.5rem'
              }}>
                <Upload size={22} />
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.2rem' }}>
                Upload Your College Time Table (PDF)
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '0.65rem' }}>
                Upload your university/college time table PDF and we will automatically extract your classes.
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#334155'
              }}>
                <FileText size={14} color="#781416" />
                <span>Drag & drop PDF here or click</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.35rem' }}>
                Supports PDF files (Max 5 MB)
              </div>
            </div>

            {/* Step 2: AI Processing Stages */}
            <div style={{
              backgroundColor: '#FBF9F5',
              border: '1.5px solid #F1E7D0',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.92rem', fontWeight: 800, color: '#781416' }}>
                <Sparkles size={16} color="#C88D2D" />
                <span>Automated Extraction Engine</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: uploadStage >= 1 ? '#065F46' : '#64748B', fontWeight: 700 }}>
                  <CheckCircle2 size={15} color={uploadStage >= 1 ? '#10B981' : '#CBD5E1'} />
                  <span>Reading PDF document...</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: uploadStage >= 2 ? '#065F46' : '#64748B', fontWeight: 700 }}>
                  <CheckCircle2 size={15} color={uploadStage >= 2 ? '#10B981' : '#CBD5E1'} />
                  <span>Extracting subjects &amp; faculties...</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: uploadStage >= 3 ? '#065F46' : '#64748B', fontWeight: 700 }}>
                  <CheckCircle2 size={15} color={uploadStage >= 3 ? '#10B981' : '#CBD5E1'} />
                  <span>Detecting days &amp; time slots...</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: uploadStage >= 4 ? '#065F46' : '#64748B', fontWeight: 700 }}>
                  <CheckCircle2 size={15} color={uploadStage >= 4 ? '#10B981' : '#CBD5E1'} />
                  <span>Organizing your weekly schedule...</span>
                </div>
              </div>
            </div>

            {/* Step 3: Ready / Action Card */}
            <div style={{
              backgroundColor: extractedDraft ? '#ECFDF5' : '#F8FAFC',
              border: extractedDraft ? '1.5px solid #10B981' : '1.5px solid #E2E8F0',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '140px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: extractedDraft ? '#10B981' : '#94A3B8',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Check size={14} />
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: '#1E293B' }}>
                    {extractedDraft ? 'Time Table Ready!' : 'Time Table Ready'}
                  </strong>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '0.65rem' }}>
                  {extractedDraft ? (
                    <span>We found <strong>{extractedDraft.totalClasses} classes</strong> in your uploaded PDF.</span>
                  ) : (
                    <span>Upload your college PDF to automatically parse subjects or create manually.</span>
                  )}
                </div>

                {/* Extracted preview tags */}
                {extractedDraft && extractedDraft.entries && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.85rem' }}>
                    {extractedDraft.entries.slice(0, 3).map((e, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.7rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        padding: '0.1rem 0.45rem',
                        fontWeight: 700,
                        color: '#334155'
                      }}>
                        {e.subjectCode ? `${e.subjectCode} · ` : ''}{e.subjectName}
                      </span>
                    ))}
                    {extractedDraft.entries.length > 3 && (
                      <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>
                        +{extractedDraft.entries.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  disabled={!extractedDraft}
                  onClick={() => handleConfirmDraft(extractedDraft)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: extractedDraft ? '#781416' : '#CBD5E1',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: extractedDraft ? 'pointer' : 'not-allowed'
                  }}
                >
                  Activate Timetable
                </button>
                <button
                  disabled={!extractedDraft}
                  onClick={() => setReviewModalOpen(true)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#334155',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: extractedDraft ? 'pointer' : 'not-allowed'
                  }}
                >
                  Edit if needed
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. MAIN DASHBOARD: 3-COLUMN LAYOUT */}
        {/* Left Sidebar (View & Manage + Display Options) */}
        {/* Center Grid (Weekly Schedule + Today View) */}
        {/* Right Sidebar (Subjects + Quick Actions + Export) */}
        {/* ============================================================ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr 260px',
          gap: '1.25rem',
          alignItems: 'flex-start'
        }} className="timetable-3col-grid">

          {/* -------------------------------------------------------- */}
          {/* COLUMN 1: LEFT SIDEBAR */}
          {/* -------------------------------------------------------- */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Navigation Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '18px',
              padding: '1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '0.75rem'
              }}>
                View &amp; Manage
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {[
                  { id: 'weekly', label: 'Weekly Time Table', icon: Calendar },
                  { id: 'classes', label: 'Class List', icon: BookOpen },
                  { id: 'study', label: 'Study Planner', icon: Dumbbell },
                  { id: 'exams', label: 'Exam Schedule', icon: GraduationCap },
                  { id: 'reminders', label: 'Reminders', icon: Bell },
                  { id: 'export', label: 'Export / Download', icon: Download }
                ].map(item => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: isActive ? '#FEF2F2' : 'transparent',
                        color: isActive ? '#781416' : '#475569',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Icon size={16} color={isActive ? '#781416' : '#94A3B8'} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Options Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '18px',
              padding: '1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '0.75rem'
              }}>
                Display Options
              </div>

              {/* Time View Dropdown */}
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>
                  Time View:
                </label>
                <select
                  value={timetable.settings?.timeView || '8 AM - 8 PM'}
                  onChange={e => {
                    const newSettings = { ...timetable.settings, timeView: e.target.value };
                    setTimetable(prev => ({ ...prev, settings: newSettings }));
                    fetch('/api/timetable/settings', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newSettings)
                    }).catch(() => {});
                  }}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#1E293B',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="8 AM - 8 PM">8 AM – 8 PM</option>
                  <option value="7 AM - 9 PM">7 AM – 9 PM</option>
                  <option value="Full Day">Full Day</option>
                </select>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { key: 'showBreaks', label: 'Show Breaks' },
                  { key: 'showSubjects', label: 'Show Subjects' },
                  { key: 'showStudyBlocks', label: 'Show Study Blocks' },
                  { key: 'showOtherActivities', label: 'Show Activities' }
                ].map(item => {
                  const val = timetable.settings?.[item.key] !== false;
                  return (
                    <div
                      key={item.key}
                      onClick={() => handleToggleSetting(item.key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                        {item.label}
                      </span>
                      {/* Pill Switch */}
                      <div style={{
                        width: '34px',
                        height: '18px',
                        borderRadius: '9999px',
                        backgroundColor: val ? '#781416' : '#CBD5E1',
                        position: 'relative',
                        transition: 'background-color 0.2s ease'
                      }}>
                        <div style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          position: 'absolute',
                          top: '2px',
                          left: val ? '18px' : '2px',
                          transition: 'left 0.2s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* -------------------------------------------------------- */}
          {/* COLUMN 2: CENTER TIMETABLE DISPLAY */}
          {/* -------------------------------------------------------- */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Today's Schedule Live Banner */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #F1E7D0',
              borderRadius: '18px',
              padding: '1rem 1.25rem',
              boxShadow: '0 4px 14px rgba(200, 141, 45, 0.05)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#8A5D00', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  TODAY'S SCHEDULE • {todaySchedule.todayName}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.2rem' }}>
                  {todaySchedule.currentClass ? (
                    <div>
                      <span style={{ fontSize: '0.75rem', backgroundColor: '#ECFDF5', color: '#065F46', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '6px', marginRight: '0.45rem' }}>
                        LIVE CLASS
                      </span>
                      <strong style={{ fontSize: '0.98rem', color: '#1E293B' }}>
                        {todaySchedule.currentClass.subjectCode ? `${todaySchedule.currentClass.subjectCode} · ` : ''}{todaySchedule.currentClass.subjectName}
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', marginLeft: '0.45rem' }}>
                        ({todaySchedule.currentClass.startTime} – {todaySchedule.currentClass.endTime})
                      </span>
                      {todaySchedule.currentClass.room && (
                        <span style={{ fontSize: '0.75rem', color: '#781416', fontWeight: 700, marginLeft: '0.45rem' }}>
                          📍 {todaySchedule.currentClass.room}
                        </span>
                      )}
                    </div>
                  ) : todaySchedule.nextClass ? (
                    <div>
                      <span style={{ fontSize: '0.75rem', backgroundColor: '#FEF9EE', color: '#8A5D00', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '6px', marginRight: '0.45rem' }}>
                        NEXT CLASS
                      </span>
                      <strong style={{ fontSize: '0.95rem', color: '#1E293B' }}>
                        {todaySchedule.nextClass.subjectCode ? `${todaySchedule.nextClass.subjectCode} · ` : ''}{todaySchedule.nextClass.subjectName}
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748B', marginLeft: '0.45rem' }}>
                        starts at {todaySchedule.nextClass.startTime}
                      </span>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>
                      No classes remaining today. Perfect time for revision or self-study!
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    const todayDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const day = todayDays[new Date().getDay()];
                    setEditingEntry({ day: day === 'Sunday' ? 'Monday' : day, startTime: '09:00 AM', endTime: '10:00 AM' });
                    setClassModalOpen(true);
                  }}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: '8px',
                    border: '1.5px solid #F1E7D0',
                    backgroundColor: '#FEF9EE',
                    color: '#8A5D00',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Plus size={14} />
                  <span>Add Class for Today</span>
                </button>
              </div>
            </div>

            {/* Weekly Timetable Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '20px',
              padding: '1.25rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
            }}>
              
              {/* Controls Bar: Title + Date Range + View Toggle */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                paddingBottom: '1rem',
                borderBottom: '1.5px solid #F1E7D0',
                marginBottom: '1rem'
              }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1C1E21' }}>
                    {timetable.title || 'My Weekly Time Table'}
                  </h2>
                  <div style={{ fontSize: '0.78rem', color: '#65676B' }}>
                    {timetable.branch} • {timetable.semester} {timetable.section ? `• Section ${timetable.section}` : ''}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {/* Today Button */}
                  <button
                    onClick={() => setCurrentWeekOffset(0)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    Today
                  </button>

                  {/* Navigation Arrows */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      onClick={() => setCurrentWeekOffset(o => o - 1)}
                      style={{ padding: '0.35rem 0.5rem', background: '#FFFFFF', border: 'none', cursor: 'pointer', borderRight: '1px solid #CBD5E1' }}
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      onClick={() => setCurrentWeekOffset(o => o + 1)}
                      style={{ padding: '0.35rem 0.5rem', background: '#FFFFFF', border: 'none', cursor: 'pointer' }}
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>

                  {/* Date Range String */}
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', minWidth: '170px', textAlign: 'center' }}>
                    {weekRangeString}
                  </span>

                  {/* Week / List Toggle */}
                  <div style={{ display: 'flex', border: '1.5px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
                    <button
                      onClick={() => setViewMode('week')}
                      style={{
                        padding: '0.35rem 0.75rem',
                        border: 'none',
                        backgroundColor: viewMode === 'week' ? '#781416' : '#FFFFFF',
                        color: viewMode === 'week' ? '#FFFFFF' : '#64748B',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Week
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      style={{
                        padding: '0.35rem 0.75rem',
                        border: 'none',
                        backgroundColor: viewMode === 'list' ? '#781416' : '#FFFFFF',
                        color: viewMode === 'list' ? '#FFFFFF' : '#64748B',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      List
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Day Selector (Visible on small screens) */}
              <div className="timetable-mobile-days" style={{ display: 'none', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
                  {DAYS_OF_WEEK.map(day => (
                    <button
                      key={day}
                      onClick={() => setSelectedMobileDay(day)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: selectedMobileDay === day ? '#781416' : '#F1F5F9',
                        color: selectedMobileDay === day ? '#FFFFFF' : '#475569',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                      }}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* TAB 1: WEEKLY GRID VIEW */}
              {activeTab === 'weekly' && viewMode === 'week' && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '780px', borderCollapse: 'separate', borderSpacing: '4px' }}>
                    <thead>
                      <tr>
                        <th style={{ width: '90px', padding: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                          Time
                        </th>
                        {DAYS_OF_WEEK.map(day => {
                          const isToday = day.toLowerCase() === todaySchedule.todayName.toLowerCase();
                          return (
                            <th key={day} style={{
                              padding: '0.65rem 0.5rem',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              color: isToday ? '#781416' : '#1E293B',
                              backgroundColor: isToday ? '#FEF2F2' : '#F8FAFC',
                              borderRadius: '8px',
                              textAlign: 'center',
                              borderBottom: isToday ? '2px solid #781416' : 'none'
                            }}>
                              {day}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map(slot => (
                        <tr key={slot.label}>
                          {/* Time Column */}
                          <td style={{
                            padding: '0.75rem 0.4rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#64748B',
                            textAlign: 'center',
                            verticalAlign: 'top',
                            backgroundColor: '#FAFAF9',
                            borderRadius: '8px'
                          }}>
                            {slot.label}
                          </td>

                          {/* Day Columns */}
                          {DAYS_OF_WEEK.map(day => {
                            // Find classes matching this day and time slot
                            const slotMinutes = slot.minutes;
                            const slotEndMinutes = slotMinutes + 60;

                            const matchedClasses = (timetable.entries || []).filter(e => {
                              if (e.day.toLowerCase() !== day.toLowerCase()) return false;
                              const classStart = timeStringToMinutes(e.startTime);
                              // Matches if starts in this hour slot
                              return classStart >= slotMinutes && classStart < slotEndMinutes;
                            });

                            // Find study blocks
                            const matchedStudy = (timetable.studyBlocks || []).filter(b => {
                              if (timetable.settings?.showStudyBlocks === false) return false;
                              if (b.day.toLowerCase() !== day.toLowerCase()) return false;
                              const bStart = timeStringToMinutes(b.startTime);
                              return bStart >= slotMinutes && bStart < slotEndMinutes;
                            });

                            return (
                              <td
                                key={day}
                                onClick={() => {
                                  if (matchedClasses.length === 0 && matchedStudy.length === 0) {
                                    setEditingEntry({
                                      day,
                                      startTime: slot.label,
                                      endTime: `${(slot.hour + 1) > 12 ? (slot.hour + 1) - 12 : (slot.hour + 1)}:00 ${slot.hour + 1 >= 12 ? 'PM' : 'AM'}`
                                    });
                                    setClassModalOpen(true);
                                  }
                                }}
                                style={{
                                  padding: '4px',
                                  verticalAlign: 'top',
                                  height: '84px',
                                  backgroundColor: '#FFFFFF',
                                  border: '1px solid #F1E7D0',
                                  borderRadius: '10px',
                                  position: 'relative'
                                }}
                              >
                                {/* Render Matched Classes */}
                                {matchedClasses.map(cls => {
                                  const isBreak = cls.type === 'Break' || /lunch|break/i.test(cls.subjectName);
                                  if (isBreak && timetable.settings?.showBreaks === false) return null;

                                  const theme = isBreak
                                    ? { bg: '#F1F5F9', border: '#E2E8F0', text: '#475569', badge: '#64748B' }
                                    : getSubjectColor(cls.subjectCode, cls.subjectName);

                                  return (
                                    <div
                                      key={cls.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingEntry(cls);
                                        setClassModalOpen(true);
                                      }}
                                      style={{
                                        backgroundColor: theme.bg,
                                        borderLeft: `3.5px solid ${theme.badge}`,
                                        borderRadius: '8px',
                                        padding: '0.4rem 0.5rem',
                                        marginBottom: '3px',
                                        cursor: 'pointer',
                                        transition: 'transform 0.15s ease'
                                      }}
                                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                      {/* Subject Code & Type */}
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.25rem' }}>
                                        <span style={{ fontSize: '0.72rem', fontWeight: 900, color: theme.text }}>
                                          {cls.subjectCode || cls.subjectName}
                                        </span>
                                        {cls.type && cls.type !== 'Lecture' && (
                                          <span style={{
                                            fontSize: '0.62rem',
                                            fontWeight: 800,
                                            padding: '0.05rem 0.35rem',
                                            borderRadius: '4px',
                                            backgroundColor: '#FFFFFF',
                                            color: theme.badge
                                          }}>
                                            {cls.type}
                                          </span>
                                        )}
                                      </div>

                                      {/* Subject Full Title if Code exists */}
                                      {cls.subjectCode && cls.subjectName && (
                                        <div style={{ fontSize: '0.7rem', color: '#1E293B', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                          {cls.subjectName}
                                        </div>
                                      )}

                                      {/* Time Range */}
                                      <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                                        {cls.startTime} – {cls.endTime}
                                      </div>

                                      {/* Room & Faculty */}
                                      {(cls.room || cls.faculty) && (
                                        <div style={{ fontSize: '0.65rem', color: '#475569', marginTop: '2px', display: 'flex', gap: '0.35rem' }}>
                                          {cls.room && <span>📍 {cls.room}</span>}
                                          {cls.faculty && <span>👤 {cls.faculty}</span>}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}

                                {/* Render Study Blocks */}
                                {matchedStudy.map(sb => (
                                  <div
                                    key={sb.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteStudyBlock(sb.id);
                                    }}
                                    title="Click to remove study block"
                                    style={{
                                      backgroundColor: sb.color || '#DCFCE7',
                                      borderLeft: '3px solid #16A34A',
                                      borderRadius: '6px',
                                      padding: '0.3rem 0.45rem',
                                      marginBottom: '3px',
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      color: '#15803D',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <div>{sb.title}</div>
                                    <div style={{ fontSize: '0.62rem', opacity: 0.85 }}>{sb.startTime} – {sb.endTime}</div>
                                  </div>
                                ))}

                                {matchedClasses.length === 0 && matchedStudy.length === 0 && (
                                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0 }}>
                                    +
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB 2 / LIST VIEW: TABULAR CLASS LIST */}
              {(activeTab === 'classes' || viewMode === 'list') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {DAYS_OF_WEEK.map(day => {
                    const dayEntries = (timetable.entries || [])
                      .filter(e => e.day.toLowerCase() === day.toLowerCase())
                      .sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime));

                    if (dayEntries.length === 0) return null;

                    return (
                      <div key={day} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{
                          backgroundColor: '#F8FAFC',
                          padding: '0.55rem 0.85rem',
                          fontWeight: 800,
                          fontSize: '0.88rem',
                          color: '#1E293B',
                          borderBottom: '1px solid #E2E8F0'
                        }}>
                          {day} ({dayEntries.length} classes)
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {dayEntries.map(e => (
                            <div
                              key={e.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.65rem 0.85rem',
                                borderBottom: '1px solid #F1F5F9'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', width: '120px' }}>
                                  {e.startTime} – {e.endTime}
                                </span>
                                <div>
                                  <strong style={{ fontSize: '0.9rem', color: '#1E293B' }}>
                                    {e.subjectCode ? `${e.subjectCode} · ` : ''}{e.subjectName}
                                  </strong>
                                  <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', gap: '0.5rem' }}>
                                    {e.faculty && <span>Faculty: {e.faculty}</span>}
                                    {e.room && <span>Room: {e.room}</span>}
                                    <span style={{ color: '#781416', fontWeight: 700 }}>Type: {e.type}</span>
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <button
                                  onClick={() => { setEditingEntry(e); setClassModalOpen(true); }}
                                  style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', cursor: 'pointer' }}
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteClassEntry(e.id)}
                                  style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer' }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: STUDY PLANNER */}
              {activeTab === 'study' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1E293B' }}>Personal Study Planner</h3>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Add self-study, revision, gym or project blocks.</p>
                    </div>
                    <button
                      onClick={() => setStudyBlockModalOpen(true)}
                      style={{
                        padding: '0.45rem 0.95rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#781416',
                        color: '#FFFFFF',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Plus size={14} /> Add Study Block
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
                    {(timetable.studyBlocks || []).map(b => (
                      <div key={b.id} style={{
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#16A34A', backgroundColor: '#DCFCE7', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                              {b.category}
                            </span>
                            <button onClick={() => handleDeleteStudyBlock(b.id)} style={{ border: 'none', background: 'none', color: '#DC2626', cursor: 'pointer' }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginTop: '0.35rem' }}>
                            {b.title}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                            {b.day} • {b.startTime} – {b.endTime}
                          </div>
                          {b.notes && <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.35rem' }}>{b.notes}</div>}
                        </div>
                      </div>
                    ))}
                    {(timetable.studyBlocks || []).length === 0 && (
                      <div style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1', color: '#64748B' }}>
                        No personal study blocks set yet. Click "+ Add Study Block" above.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: EXAM SCHEDULE */}
              {activeTab === 'exams' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1E293B' }}>Upcoming Exams</h3>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Keep track of sessional, mid-sem and university end-sem dates.</p>
                    </div>
                    <button
                      onClick={() => setExamModalOpen(true)}
                      style={{
                        padding: '0.45rem 0.95rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#781416',
                        color: '#FFFFFF',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Plus size={14} /> Add Exam
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {(timetable.exams || []).map(ex => (
                      <div key={ex.id} style={{
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #F1E7D0',
                        borderRadius: '12px',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <strong style={{ fontSize: '0.95rem', color: '#1E293B' }}>{ex.subject}</strong>
                          <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
                            <span>📅 Date: <strong>{ex.date}</strong></span>
                            {ex.time && <span>⏰ Time: {ex.time}</span>}
                            {ex.room && <span>📍 Room: {ex.room}</span>}
                          </div>
                          {ex.notes && <div style={{ fontSize: '0.75rem', color: '#781416', marginTop: '0.2rem' }}>📝 {ex.notes}</div>}
                        </div>
                        <button onClick={() => handleDeleteExam(ex.id)} style={{ border: 'none', background: 'none', color: '#DC2626', cursor: 'pointer' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                    {(timetable.exams || []).length === 0 && (
                      <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                        No exams scheduled. Click "+ Add Exam" to track upcoming tests.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: REMINDERS */}
              {activeTab === 'reminders' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1E293B' }}>Academic Reminders</h3>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Class records, homework, labs and assignment deadlines.</p>
                    </div>
                    <button
                      onClick={() => setReminderModalOpen(true)}
                      style={{
                        padding: '0.45rem 0.95rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#781416',
                        color: '#FFFFFF',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Plus size={14} /> Add Reminder
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    {(timetable.reminders || []).map(r => (
                      <div key={r.id} style={{
                        backgroundColor: r.completed ? '#F8FAFC' : '#FFFFFF',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <input
                            type="checkbox"
                            checked={Boolean(r.completed)}
                            onChange={() => handleToggleReminder(r.id, r.completed)}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          <div>
                            <div style={{
                              fontSize: '0.9rem',
                              fontWeight: 700,
                              color: r.completed ? '#94A3B8' : '#1E293B',
                              textDecoration: r.completed ? 'line-through' : 'none'
                            }}>
                              {r.title}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                              {r.type} {r.day ? `• ${r.day}` : ''} {r.time ? `• ${r.time}` : ''}
                            </div>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteReminder(r.id)} style={{ border: 'none', background: 'none', color: '#DC2626', cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {(timetable.reminders || []).length === 0 && (
                      <div style={{ textAlign: 'center', padding: '2rem', color: '#64748B' }}>
                        No reminders created yet.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: EXPORT CENTER */}
              {activeTab === 'export' && (
                <div>
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 800, color: '#1E293B' }}>
                    Export &amp; Calendar Synchronization
                  </h3>
                  <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: '#64748B' }}>
                    Sync your timetable to Google Calendar or download a printable PDF.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div style={{ border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
                      <Calendar size={28} color="#1D4ED8" style={{ margin: '0 auto 0.5rem' }} />
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1E293B' }}>Google Calendar (.ics)</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.35rem 0 1rem' }}>
                        Download iCalendar file to import into Google Calendar, Outlook or Apple Calendar.
                      </div>
                      <a
                        href="/api/timetable/export/ics"
                        download
                        style={{
                          display: 'inline-block',
                          padding: '0.5rem 1rem',
                          backgroundColor: '#EFF6FF',
                          border: '1px solid #BFDBFE',
                          borderRadius: '8px',
                          color: '#1D4ED8',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          textDecoration: 'none'
                        }}
                      >
                        Download .ics Calendar
                      </a>
                    </div>

                    <div style={{ border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
                      <FileText size={28} color="#059669" style={{ margin: '0 auto 0.5rem' }} />
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1E293B' }}>Spreadsheet (CSV)</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.35rem 0 1rem' }}>
                        Raw schedule data with days, times, subjects, rooms and teachers.
                      </div>
                      <a
                        href="/api/timetable/export/csv"
                        download
                        style={{
                          display: 'inline-block',
                          padding: '0.5rem 1rem',
                          backgroundColor: '#ECFDF5',
                          border: '1px solid #A7F3D0',
                          borderRadius: '8px',
                          color: '#065F46',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          textDecoration: 'none'
                        }}
                      >
                        Download CSV
                      </a>
                    </div>

                    <div style={{ border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
                      <Printer size={28} color="#781416" style={{ margin: '0 auto 0.5rem' }} />
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1E293B' }}>Print / PDF Document</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.35rem 0 1rem' }}>
                        Print directly or save clean formatted PDF with ProfessorVirus branding.
                      </div>
                      <button
                        onClick={handlePrint}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#781416',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        Print Timetable
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/* COLUMN 3: RIGHT SIDEBAR (Subjects + Quick Actions + Export) */}
          {/* -------------------------------------------------------- */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Subjects List Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '18px',
              padding: '1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Subjects ({uniqueSubjects.length})
                </span>
                <button
                  onClick={() => setSubjectManageModalOpen(true)}
                  style={{ background: 'none', border: 'none', color: '#781416', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Manage
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '280px', overflowY: 'auto' }}>
                {uniqueSubjects.map((sub, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.6rem',
                      borderRadius: '8px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: sub.color || '#E11D48',
                        flexShrink: 0
                      }} />
                      <div style={{ minWidth: 0 }}>
                        <strong style={{ color: '#1E293B', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sub.code || sub.name}
                        </strong>
                        {sub.code && (
                          <span style={{ fontSize: '0.68rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                            {sub.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {uniqueSubjects.length === 0 && (
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', textAlign: 'center', padding: '1rem 0' }}>
                    No subjects in timetable yet.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '18px',
              padding: '1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '0.75rem'
              }}>
                Quick Actions
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <button
                  onClick={() => {
                    setEditingEntry({ day: 'Monday', startTime: '09:00 AM', endTime: '10:00 AM' });
                    setClassModalOpen(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: '1.5px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#1E293B',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Plus size={15} color="#781416" />
                  <span>Add Class Manually</span>
                </button>

                <button
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: '1.5px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#1E293B',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Upload size={15} color="#0284C7" />
                  <span>Auto Extract from PDF</span>
                </button>

                <button
                  onClick={() => setStudyBlockModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: '1.5px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#1E293B',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Dumbbell size={15} color="#16A34A" />
                  <span>Set Study Time</span>
                </button>

                <button
                  onClick={() => setReminderModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: '1.5px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#1E293B',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Bell size={15} color="#D97706" />
                  <span>Add Reminder</span>
                </button>
              </div>
            </div>

            {/* Export Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E2D5',
              borderRadius: '18px',
              padding: '1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '0.75rem'
              }}>
                Export
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <button
                  onClick={handlePrint}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #F1E7D0',
                    backgroundColor: '#FEF9EE',
                    color: '#8A5D00',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Printer size={15} color="#8A5D00" />
                  <span>Download PDF / Print</span>
                </button>

                <a
                  href="/api/timetable/export/ics"
                  download
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #BFDBFE',
                    backgroundColor: '#EFF6FF',
                    color: '#1D4ED8',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <Calendar size={15} color="#1D4ED8" />
                  <span>Export to Google Calendar</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* MODAL 1: ADD / EDIT CLASS MODAL */}
      {/* ============================================================ */}
      {classModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            padding: '1.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <strong style={{ fontSize: '1.1rem', color: '#1E293B' }}>
                {editingEntry?.id ? 'Edit Class' : 'Add Class'}
              </strong>
              <button onClick={() => { setClassModalOpen(false); setEditingEntry(null); }} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
            </div>

            <form onSubmit={e => {
              e.preventDefault();
              const form = e.target;
              handleSaveClassEntry({
                day: form.day.value,
                startTime: form.startTime.value,
                endTime: form.endTime.value,
                subjectCode: form.subjectCode.value,
                subjectName: form.subjectName.value,
                faculty: form.faculty.value,
                room: form.room.value,
                type: form.type.value,
                color: form.color.value
              });
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Day</label>
                  <select name="day" defaultValue={editingEntry?.day || 'Monday'} style={inputStyle}>
                    {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Class Type</label>
                  <select name="type" defaultValue={editingEntry?.type || 'Lecture'} style={inputStyle}>
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Self Study">Self Study</option>
                    <option value="Break">Break / Lunch</option>
                    <option value="Exam">Exam</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Start Time</label>
                  <input name="startTime" defaultValue={editingEntry?.startTime || '09:00 AM'} placeholder="09:00 AM" required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>End Time</label>
                  <input name="endTime" defaultValue={editingEntry?.endTime || '10:00 AM'} placeholder="10:00 AM" required style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Subject Code</label>
                  <input name="subjectCode" defaultValue={editingEntry?.subjectCode || ''} placeholder="e.g. BCS401" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Subject Name</label>
                  <input name="subjectName" defaultValue={editingEntry?.subjectName || ''} placeholder="e.g. Operating System" required style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Faculty / Teacher</label>
                  <input name="faculty" defaultValue={editingEntry?.faculty || ''} placeholder="e.g. Dr. A. Sharma" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Room / Hall</label>
                  <input name="room" defaultValue={editingEntry?.room || ''} placeholder="e.g. Room 204 / LT-1" style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Card Color Theme</label>
                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  {SUBJECT_PALETTE.map((pal, idx) => (
                    <label key={idx} style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: pal.bg,
                      border: `2px solid ${pal.badge}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <input
                        type="radio"
                        name="color"
                        value={pal.bg}
                        defaultChecked={editingEntry?.color === pal.bg || idx === 0}
                        style={{ opacity: 0, position: 'absolute' }}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                {editingEntry?.id ? (
                  <div style={{ display: 'flex', gap: '0.45rem' }}>
                    <button
                      type="button"
                      onClick={() => handleDeleteClassEntry(editingEntry.id)}
                      style={{ padding: '0.55rem 0.85rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateClassEntry(editingEntry)}
                      style={{ padding: '0.55rem 0.85rem', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', color: '#334155', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      Duplicate
                    </button>
                  </div>
                ) : <div />}

                <div style={{ display: 'flex', gap: '0.45rem' }}>
                  <button
                    type="button"
                    onClick={() => { setClassModalOpen(false); setEditingEntry(null); }}
                    style={{ padding: '0.55rem 0.95rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '0.55rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#781416', color: '#FFFFFF', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    Save Class
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: REVIEW EXTRACTED TIMETABLE DRAFT */}
      {/* ============================================================ */}
      {reviewModalOpen && extractedDraft && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '960px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1.5px solid #E8E2D5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '1.2rem', color: '#1E293B' }}>Review Your Extracted Timetable</strong>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B' }}>
                  Verify and edit days, time slots, subjects, and rooms before confirming.
                </p>
              </div>
              <button onClick={() => setReviewModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            {/* Modal Body: Scrollable Table */}
            <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>Timetable Title</label>
                  <input
                    value={extractedDraft.title || ''}
                    onChange={e => setExtractedDraft({ ...extractedDraft, title: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>Branch</label>
                  <input
                    value={extractedDraft.branch || ''}
                    onChange={e => setExtractedDraft({ ...extractedDraft, branch: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>Semester</label>
                  <input
                    value={extractedDraft.semester || ''}
                    onChange={e => setExtractedDraft({ ...extractedDraft, semester: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>Section</label>
                  <input
                    value={extractedDraft.section || ''}
                    onChange={e => setExtractedDraft({ ...extractedDraft, section: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Editable rows list */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem' }}>Day</th>
                    <th style={{ padding: '0.5rem' }}>Time Slot</th>
                    <th style={{ padding: '0.5rem' }}>Code</th>
                    <th style={{ padding: '0.5rem' }}>Subject Name</th>
                    <th style={{ padding: '0.5rem' }}>Faculty</th>
                    <th style={{ padding: '0.5rem' }}>Room</th>
                    <th style={{ padding: '0.5rem' }}>Type</th>
                    <th style={{ padding: '0.5rem', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(extractedDraft.entries || []).map((row, rIdx) => (
                    <tr key={row.id || rIdx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '0.35rem' }}>
                        <select
                          value={row.day}
                          onChange={e => {
                            const newEntries = [...extractedDraft.entries];
                            newEntries[rIdx].day = e.target.value;
                            setExtractedDraft({ ...extractedDraft, entries: newEntries });
                          }}
                          style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.75rem' }}
                        >
                          {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '0.35rem' }}>
                        <div style={{ display: 'flex', gap: '0.2rem' }}>
                          <input
                            value={row.startTime}
                            onChange={e => {
                              const newEntries = [...extractedDraft.entries];
                              newEntries[rIdx].startTime = e.target.value;
                              setExtractedDraft({ ...extractedDraft, entries: newEntries });
                            }}
                            style={{ width: '65px', padding: '0.2rem', fontSize: '0.72rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                          />
                          <span>-</span>
                          <input
                            value={row.endTime}
                            onChange={e => {
                              const newEntries = [...extractedDraft.entries];
                              newEntries[rIdx].endTime = e.target.value;
                              setExtractedDraft({ ...extractedDraft, entries: newEntries });
                            }}
                            style={{ width: '65px', padding: '0.2rem', fontSize: '0.72rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                          />
                        </div>
                      </td>
                      <td style={{ padding: '0.35rem' }}>
                        <input
                          value={row.subjectCode || ''}
                          onChange={e => {
                            const newEntries = [...extractedDraft.entries];
                            newEntries[rIdx].subjectCode = e.target.value;
                            setExtractedDraft({ ...extractedDraft, entries: newEntries });
                          }}
                          style={{ width: '70px', padding: '0.2rem', fontSize: '0.72rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                        />
                      </td>
                      <td style={{ padding: '0.35rem' }}>
                        <input
                          value={row.subjectName || ''}
                          onChange={e => {
                            const newEntries = [...extractedDraft.entries];
                            newEntries[rIdx].subjectName = e.target.value;
                            setExtractedDraft({ ...extractedDraft, entries: newEntries });
                          }}
                          style={{ width: '100%', minWidth: '120px', padding: '0.2rem', fontSize: '0.72rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                        />
                      </td>
                      <td style={{ padding: '0.35rem' }}>
                        <input
                          value={row.faculty || ''}
                          onChange={e => {
                            const newEntries = [...extractedDraft.entries];
                            newEntries[rIdx].faculty = e.target.value;
                            setExtractedDraft({ ...extractedDraft, entries: newEntries });
                          }}
                          style={{ width: '80px', padding: '0.2rem', fontSize: '0.72rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                        />
                      </td>
                      <td style={{ padding: '0.35rem' }}>
                        <input
                          value={row.room || ''}
                          onChange={e => {
                            const newEntries = [...extractedDraft.entries];
                            newEntries[rIdx].room = e.target.value;
                            setExtractedDraft({ ...extractedDraft, entries: newEntries });
                          }}
                          style={{ width: '70px', padding: '0.2rem', fontSize: '0.72rem', border: '1px solid #CBD5E1', borderRadius: '4px' }}
                        />
                      </td>
                      <td style={{ padding: '0.35rem' }}>
                        <select
                          value={row.type || 'Lecture'}
                          onChange={e => {
                            const newEntries = [...extractedDraft.entries];
                            newEntries[rIdx].type = e.target.value;
                            setExtractedDraft({ ...extractedDraft, entries: newEntries });
                          }}
                          style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.72rem' }}
                        >
                          <option value="Lecture">Lecture</option>
                          <option value="Lab">Lab</option>
                          <option value="Break">Break</option>
                          <option value="Tutorial">Tutorial</option>
                          <option value="Other">Other</option>
                        </select>
                      </td>
                      <td style={{ padding: '0.35rem', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const newEntries = extractedDraft.entries.filter((_, idx) => idx !== rIdx);
                            setExtractedDraft({ ...extractedDraft, entries: newEntries });
                          }}
                          style={{ border: 'none', background: 'none', color: '#DC2626', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                type="button"
                onClick={() => {
                  const newEntry = {
                    id: `entry_${Date.now()}`,
                    day: 'Monday',
                    startTime: '09:00 AM',
                    endTime: '10:00 AM',
                    subjectCode: '',
                    subjectName: 'New Subject',
                    faculty: '',
                    room: '',
                    type: 'Lecture'
                  };
                  setExtractedDraft({
                    ...extractedDraft,
                    entries: [...(extractedDraft.entries || []), newEntry]
                  });
                }}
                style={{
                  marginTop: '0.85rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px dashed #CBD5E1',
                  background: '#F8FAFC',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                + Add Another Class
              </button>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1.5px solid #E8E2D5', display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDraft(extractedDraft)}
                style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#781416', color: '#FFFFFF', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Confirm &amp; Create Timetable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: ADD STUDY BLOCK MODAL */}
      {/* ============================================================ */}
      {studyBlockModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', maxWidth: '420px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#1E293B' }}>Set Study / Activity Time</h3>
            <form onSubmit={e => {
              e.preventDefault();
              const f = e.target;
              handleAddStudyBlock({
                title: f.title.value,
                category: f.category.value,
                day: f.day.value,
                startTime: f.startTime.value,
                endTime: f.endTime.value,
                notes: f.notes.value
              });
            }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Activity Name</label>
                <input name="title" placeholder="e.g. Gym Workout / DSA Revision" required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Category</label>
                  <select name="category" style={inputStyle}>
                    <option value="Self Study">Self Study</option>
                    <option value="Gym">Gym</option>
                    <option value="Tuition">Tuition</option>
                    <option value="Project Work">Project Work</option>
                    <option value="Revision">Revision</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Day</label>
                  <select name="day" style={inputStyle}>
                    {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Start Time</label>
                  <input name="startTime" defaultValue="05:00 PM" required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>End Time</label>
                  <input name="endTime" defaultValue="06:00 PM" required style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Notes (Optional)</label>
                <input name="notes" placeholder="Focus topics, goals..." style={inputStyle} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setStudyBlockModalOpen(false)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#781416', color: '#FFFFFF', fontWeight: 700 }}>Save Block</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: ADD EXAM MODAL */}
      {/* ============================================================ */}
      {examModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', maxWidth: '420px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#1E293B' }}>Add Exam to Schedule</h3>
            <form onSubmit={e => {
              e.preventDefault();
              const f = e.target;
              handleAddExam({
                subject: f.subject.value,
                date: f.date.value,
                time: f.time.value,
                room: f.room.value,
                notes: f.notes.value
              });
            }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Subject</label>
                <input name="subject" placeholder="e.g. BCS401 - Operating System" required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Date</label>
                  <input type="date" name="date" required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Time</label>
                  <input name="time" placeholder="10:00 AM - 01:00 PM" style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Examination Room / Hall</label>
                <input name="room" placeholder="e.g. Hall 3 / LT-2" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Notes / Syllabus Range</label>
                <input name="notes" placeholder="e.g. Mid-sem exam (Units 1 to 3)" style={inputStyle} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setExamModalOpen(false)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#781416', color: '#FFFFFF', fontWeight: 700 }}>Save Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: ADD REMINDER MODAL */}
      {/* ============================================================ */}
      {reminderModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', maxWidth: '420px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#1E293B' }}>Add Reminder</h3>
            <form onSubmit={e => {
              e.preventDefault();
              const f = e.target;
              handleAddReminder({
                title: f.title.value,
                type: f.type.value,
                day: f.day.value,
                time: f.time.value,
                notes: f.notes.value
              });
            }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Reminder Title</label>
                <input name="title" placeholder="e.g. Submit OS Lab Assignment" required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Type</label>
                  <select name="type" style={inputStyle}>
                    <option value="Class">Class</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Exam">Exam</option>
                    <option value="Study Session">Study Session</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Day</label>
                  <select name="day" style={inputStyle}>
                    <option value="">Any Day</option>
                    {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Time</label>
                <input name="time" placeholder="e.g. 11:00 AM" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Notes</label>
                <input name="notes" placeholder="Additional details..." style={inputStyle} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button type="button" onClick={() => setReminderModalOpen(false)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#781416', color: '#FFFFFF', fontWeight: 700 }}>Save Reminder</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 6: MANAGE SUBJECTS (CUSTOM COLORS) */}
      {/* ============================================================ */}
      {subjectManageModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', maxWidth: '500px', width: '100%', padding: '1.5rem', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1E293B' }}>Manage Subject Colors</h3>
              <button onClick={() => setSubjectManageModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 1rem' }}>
              Colors assigned here stay consistent across all days in your timetable.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {uniqueSubjects.map((sub, sIdx) => (
                <div key={sIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0.75rem', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#1E293B' }}>{sub.code || sub.name}</strong>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{sub.name}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {SUBJECT_PALETTE.slice(0, 5).map((pal, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={async () => {
                          // Update all entries with this subjectCode or name to this color
                          const updatedEntries = (timetable.entries || []).map(e => {
                            if ((e.subjectCode && e.subjectCode === sub.code) || e.subjectName === sub.name) {
                              return { ...e, color: pal.bg };
                            }
                            return e;
                          });
                          setTimetable(prev => ({ ...prev, entries: updatedEntries }));
                          await fetch('/api/timetable', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ entries: updatedEntries })
                          });
                        }}
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          backgroundColor: pal.bg,
                          border: sub.color === pal.bg ? `2px solid ${pal.badge}` : '1px solid #CBD5E1',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                onClick={() => setSubjectManageModalOpen(false)}
                style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#781416', color: '#FFFFFF', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Breakpoint CSS */}
      <style>{`
        @media (max-width: 1024px) {
          .timetable-3col-grid {
            grid-template-columns: 1fr !important;
          }
          .timetable-mobile-days {
            display: block !important;
          }
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .timetable-3col-grid, .timetable-3col-grid * {
            visibility: visible;
          }
          .timetable-3col-grid {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  borderRadius: '8px',
  border: '1.5px solid #CBD5E1',
  backgroundColor: '#F8FAFC',
  fontSize: '0.82rem',
  color: '#1E293B',
  outline: 'none',
  boxSizing: 'border-box'
};
