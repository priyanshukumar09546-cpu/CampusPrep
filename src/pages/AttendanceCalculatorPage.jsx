import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  BarChart2,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Download,
  RefreshCw,
  ArrowRight,
  Check,
  X,
  FileSpreadsheet,
  Info,
  ShieldAlert,
  ShieldCheck,
  Award,
  ChevronDown,
  Layers,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { calculateAttendanceMetrics, calculateOverallAttendance } from '../utils/attendanceCalculator';

export default function AttendanceCalculatorPage({ onNavigate, onOpenAuth }) {
  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);
  const [successBanner, setSuccessBanner] = useState(null);

  // Core Data
  const [subjects, setSubjects] = useState([]);
  const [recentLectures, setRecentLectures] = useState([]);
  const [summary, setSummary] = useState({
    totalLectures: 0,
    attendedLectures: 0,
    absentLectures: 0,
    percentage: 0,
    targetPercentage: 75,
    lecturesCanSkip: 0,
    lecturesNeededToReachTarget: 0,
    status: 'On Track',
    statusTone: 'neutral',
    message: 'No lectures conducted yet.',
    skipProjections: [],
    attendProjections: []
  });
  const [quickStats, setQuickStats] = useState({
    weekly: { attendance: null, change: null, label: 'No history yet' },
    monthly: { attendance: null, change: null, label: 'No history yet' }
  });

  // Global Target Percentage Selector
  const [globalTarget, setGlobalTarget] = useState(75);

  // Left Card: Tab ("single" | "bulk")
  const [leftTab, setLeftTab] = useState('single');

  // Single Entry Form
  const [singleSubjectId, setSingleSubjectId] = useState('');
  const [singleDate, setSingleDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [singleStatus, setSingleStatus] = useState('present'); // 'present' | 'absent'
  const [singleSubmitting, setSingleSubmitting] = useState(false);

  // Bulk Update Form
  const [bulkSubjectId, setBulkSubjectId] = useState('');
  const [bulkTotal, setBulkTotal] = useState('');
  const [bulkAttended, setBulkAttended] = useState('');
  const [bulkAbsent, setBulkAbsent] = useState('');
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  // Right Card: Projection Tab ("skip" | "attend")
  const [projectionTab, setProjectionTab] = useState('skip');
  const [projectionSubjectId, setProjectionSubjectId] = useState('overall');

  // Modals
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [isEditSubjectModalOpen, setIsEditSubjectModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState(null);

  const [isMultipleLecturesModalOpen, setIsMultipleLecturesModalOpen] = useState(false);
  const [multiSubjectId, setMultiSubjectId] = useState('');
  const [multiPresentCount, setMultiPresentCount] = useState(1);
  const [multiAbsentCount, setMultiAbsentCount] = useState(0);
  const [multiDate, setMultiDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [multiSubmitting, setMultiSubmitting] = useState(false);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importCsvText, setImportCsvText] = useState('');
  const [importing, setImporting] = useState(false);
  const [importWarnings, setImportWarnings] = useState([]);

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [resetTargetSubject, setResetTargetSubject] = useState(null); // null = all
  const [resetting, setResetting] = useState(false);

  const [deleteSubjectTarget, setDeleteSubjectTarget] = useState(null);
  const [deletingSubject, setDeletingSubject] = useState(false);

  // Add Subject Form
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubTarget, setNewSubTarget] = useState(75);
  const [newSubInitialTotal, setNewSubInitialTotal] = useState(0);
  const [newSubInitialAttended, setNewSubInitialAttended] = useState(0);
  const [addingSubject, setAddingSubject] = useState(false);

  // Edit Subject Form
  const [editSubCode, setEditSubCode] = useState('');
  const [editSubName, setEditSubName] = useState('');
  const [editSubTarget, setEditSubTarget] = useState(75);
  const [updatingSubject, setUpdatingSubject] = useState(false);

  const fileInputRef = useRef(null);

  // --------------------------------------------------------------------------
  // AUTH HEADERS / CLIENT IDENTITY (Survives Refresh, Restart, Works for Guest & User)
  // --------------------------------------------------------------------------
  const getAuthHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const token =
      localStorage.getItem('professorvirus_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    let deviceId = localStorage.getItem('professorvirus_device_id');
    if (!deviceId) {
      deviceId = 'dev_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem('professorvirus_device_id', deviceId);
    }
    headers['x-device-id'] = deviceId;
    return headers;
  };

  const showSuccess = (msg) => {
    setSuccessBanner(msg);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const showError = (msg) => {
    setErrorBanner(msg);
    setTimeout(() => setErrorBanner(null), 6000);
  };

  // --------------------------------------------------------------------------
  // FETCH LATEST SUMMARY & DATA FROM API
  // --------------------------------------------------------------------------
  const fetchSummary = async (showLoadingSpinner = false) => {
    if (showLoadingSpinner) setRefreshing(true);
    try {
      const res = await fetch(`/api/attendance/summary?target=${globalTarget}`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setSubjects(data.subjects || []);
        setRecentLectures(data.recentLectures || []);
        setSummary(data.summary || {});
        if (data.quickStats) setQuickStats(data.quickStats);

        // Auto-select subject for single / bulk if not set
        if (data.subjects && data.subjects.length > 0) {
          if (!singleSubjectId) setSingleSubjectId(data.subjects[0].id);
          if (!bulkSubjectId) {
            setBulkSubjectId(data.subjects[0].id);
            setBulkTotal(data.subjects[0].totalLectures);
            setBulkAttended(data.subjects[0].attendedLectures);
            setBulkAbsent(Math.max(0, data.subjects[0].totalLectures - data.subjects[0].attendedLectures));
          }
          if (!multiSubjectId) setMultiSubjectId(data.subjects[0].id);
        }
      } else {
        showError(data.message || 'Failed to load attendance data.');
      }
    } catch (err) {
      console.error('Failed to fetch attendance summary:', err);
      showError('Unable to connect to backend server. Please check connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSummary(true);
  }, [globalTarget]);

  // When bulkSubjectId changes, prefill bulk inputs
  useEffect(() => {
    if (bulkSubjectId) {
      const sub = subjects.find(s => s.id === bulkSubjectId);
      if (sub) {
        setBulkTotal(sub.totalLectures);
        setBulkAttended(sub.attendedLectures);
        setBulkAbsent(Math.max(0, sub.totalLectures - sub.attendedLectures));
      }
    }
  }, [bulkSubjectId, subjects]);

  // Handle Bulk Total / Attended change
  const handleBulkTotalChange = (val) => {
    setBulkTotal(val);
    const tot = parseInt(val, 10) || 0;
    const att = parseInt(bulkAttended, 10) || 0;
    setBulkAbsent(Math.max(0, tot - att));
  };

  const handleBulkAttendedChange = (val) => {
    setBulkAttended(val);
    const tot = parseInt(bulkTotal, 10) || 0;
    const att = parseInt(val, 10) || 0;
    setBulkAbsent(Math.max(0, tot - att));
  };

  const handleBulkAbsentChange = (val) => {
    setBulkAbsent(val);
    const ab = parseInt(val, 10) || 0;
    const att = parseInt(bulkAttended, 10) || 0;
    setBulkTotal(att + ab);
  };

  // --------------------------------------------------------------------------
  // ACTIONS: ADD LECTURE (SINGLE ENTRY)
  // --------------------------------------------------------------------------
  const handleAddSingleLecture = async (e) => {
    e?.preventDefault();
    if (!singleSubjectId) {
      showError('Please select a subject or add one first.');
      return;
    }
    setSingleSubmitting(true);
    try {
      const res = await fetch('/api/attendance/lectures', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          subjectId: singleSubjectId,
          date: singleDate,
          status: singleStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        showSuccess(data.message);
        await fetchSummary();
      } else {
        showError(data.message || 'Failed to add lecture.');
      }
    } catch (err) {
      showError('Network error while recording lecture.');
    } finally {
      setSingleSubmitting(false);
    }
  };

  // --------------------------------------------------------------------------
  // ACTIONS: SAVE BULK UPDATE
  // --------------------------------------------------------------------------
  const handleSaveBulkUpdate = async (e) => {
    e?.preventDefault();
    if (!bulkSubjectId) {
      showError('Please select a subject for bulk update.');
      return;
    }
    const tot = parseInt(bulkTotal, 10);
    const att = parseInt(bulkAttended, 10);
    const ab = parseInt(bulkAbsent, 10);

    if (isNaN(tot) || isNaN(att) || tot < 0 || att < 0) {
      showError('Please enter valid non-negative numbers for lectures.');
      return;
    }
    if (att > tot) {
      showError('Attended lectures cannot exceed total lectures.');
      return;
    }
    if (!isNaN(ab) && att + ab !== tot) {
      showError(`Total (${tot}) must equal Attended (${att}) + Absent (${ab}).`);
      return;
    }

    setBulkSubmitting(true);
    try {
      const res = await fetch(`/api/attendance/subjects/${bulkSubjectId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          totalLectures: tot,
          attendedLectures: att,
          isBulkUpdate: true
        })
      });
      const data = await res.json();
      if (data.success) {
        showSuccess(data.message);
        await fetchSummary();
      } else {
        showError(data.message || 'Failed to save bulk update.');
      }
    } catch (err) {
      showError('Network error while saving bulk update.');
    } finally {
      setBulkSubmitting(false);
    }
  };

  // --------------------------------------------------------------------------
  // ACTIONS: QUICK PRESENT / ABSENT ON SUBJECT ROW
  // --------------------------------------------------------------------------
  const handleQuickMark = async (subjectId, status) => {
    try {
      const res = await fetch('/api/attendance/lectures', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          subjectId,
          date: new Date().toISOString().slice(0, 10),
          status
        })
      });
      const data = await res.json();
      if (data.success) {
        showSuccess(data.message);
        await fetchSummary();
      } else {
        showError(data.message || 'Failed to mark lecture.');
      }
    } catch (err) {
      showError('Failed to record lecture.');
    }
  };

  // --------------------------------------------------------------------------
  // ACTIONS: DELETE RECENT LECTURE
  // --------------------------------------------------------------------------
  const handleDeleteLecture = async (lectureId) => {
    try {
      const res = await fetch(`/api/attendance/lectures/${lectureId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showSuccess('Lecture record deleted.');
        await fetchSummary();
      } else {
        showError(data.message || 'Failed to delete lecture record.');
      }
    } catch (err) {
      showError('Network error while deleting lecture record.');
    }
  };

  // --------------------------------------------------------------------------
  // ACTIONS: CREATE SUBJECT
  // --------------------------------------------------------------------------
  const handleCreateSubject = async (e) => {
    e?.preventDefault();
    if (!newSubCode.trim() || !newSubName.trim()) {
      showError('Subject code and subject name are required.');
      return;
    }
    setAddingSubject(true);
    try {
      const res = await fetch('/api/attendance/subjects', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          code: newSubCode.trim(),
          name: newSubName.trim(),
          targetPercentage: parseFloat(newSubTarget) || 75,
          initialTotal: parseInt(newSubInitialTotal, 10) || 0,
          initialAttended: parseInt(newSubInitialAttended, 10) || 0
        })
      });
      const data = await res.json();
      if (data.success) {
        showSuccess(data.message);
        setIsAddSubjectModalOpen(false);
        setNewSubCode('');
        setNewSubName('');
        setNewSubInitialTotal(0);
        setNewSubInitialAttended(0);
        await fetchSummary();
      } else {
        showError(data.message || 'Failed to create subject.');
      }
    } catch (err) {
      showError('Network error while creating subject.');
    } finally {
      setAddingSubject(false);
    }
  };

  // --------------------------------------------------------------------------
  // ACTIONS: EDIT SUBJECT
  // --------------------------------------------------------------------------
  const handleOpenEditSubject = (sub) => {
    setSubjectToEdit(sub);
    setEditSubCode(sub.code);
    setEditSubName(sub.name);
    setEditSubTarget(sub.targetPercentage || 75);
    setIsEditSubjectModalOpen(true);
  };

  const handleUpdateSubject = async (e) => {
    e?.preventDefault();
    if (!subjectToEdit) return;
    setUpdatingSubject(true);
    try {
      const res = await fetch(`/api/attendance/subjects/${subjectToEdit.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          code: editSubCode.trim(),
          name: editSubName.trim(),
          targetPercentage: parseFloat(editSubTarget) || 75
        })
      });
      const data = await res.json();
      if (data.success) {
        showSuccess('Subject updated successfully.');
        setIsEditSubjectModalOpen(false);
        setSubjectToEdit(null);
        await fetchSummary();
      } else {
        showError(data.message || 'Failed to update subject.');
      }
    } catch (err) {
      showError('Network error while updating subject.');
    } finally {
      setUpdatingSubject(false);
    }
  };

  // --------------------------------------------------------------------------
  // ACTIONS: DELETE SUBJECT
  // --------------------------------------------------------------------------
  const confirmDeleteSubject = async () => {
    if (!deleteSubjectTarget) return;
    setDeletingSubject(true);
    try {
      const res = await fetch(`/api/attendance/subjects/${deleteSubjectTarget.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showSuccess(data.message);
        setDeleteSubjectTarget(null);
        await fetchSummary();
      } else {
        showError(data.message || 'Failed to delete subject.');
      }
    } catch (err) {
      showError('Network error while deleting subject.');
    } finally {
      setDeletingSubject(false);
    }
  };

  // --------------------------------------------------------------------------
  // ACTIONS: ADD MULTIPLE LECTURES
  // --------------------------------------------------------------------------
  const handleAddMultipleLectures = async (e) => {
    e?.preventDefault();
    if (!multiSubjectId) {
      showError('Please select a subject.');
      return;
    }
    const pCount = parseInt(multiPresentCount, 10) || 0;
    const aCount = parseInt(multiAbsentCount, 10) || 0;
    if (pCount + aCount <= 0) {
      showError('Please specify at least 1 lecture to add.');
      return;
    }
    setMultiSubmitting(true);
    try {
      const res = await fetch('/api/attendance/lectures', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          subjectId: multiSubjectId,
          date: multiDate,
          presentCount: pCount,
          absentCount: aCount
        })
      });
      const data = await res.json();
      if (data.success) {
        showSuccess(data.message);
        setIsMultipleLecturesModalOpen(false);
        setMultiPresentCount(1);
        setMultiAbsentCount(0);
        await fetchSummary();
      } else {
        showError(data.message || 'Failed to add lectures.');
      }
    } catch (err) {
      showError('Network error while adding multiple lectures.');
    } finally {
      setMultiSubmitting(false);
    }
  };

  // --------------------------------------------------------------------------
  // ACTIONS: CSV IMPORT
  // --------------------------------------------------------------------------
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImportCsvText(event.target.result || '');
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = async () => {
    if (!importCsvText.trim()) {
      showError('Please paste or select a CSV file first.');
      return;
    }
    setImporting(true);
    setImportWarnings([]);
    try {
      const res = await fetch('/api/attendance/import', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ csvContent: importCsvText })
      });
      const data = await res.json();
      if (data.success) {
        showSuccess(data.message);
        if (data.warnings && data.warnings.length > 0) {
          setImportWarnings(data.warnings);
        } else {
          setIsImportModalOpen(false);
          setImportCsvText('');
        }
        await fetchSummary();
      } else {
        showError(data.message || 'Failed to import CSV.');
        if (data.errors) setImportWarnings(data.errors);
      }
    } catch (err) {
      showError('Network error during CSV import.');
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleCsv = () => {
    const sample = `date,subject_code,status\n2026-09-01,BCS301,present\n2026-09-02,BCS301,present\n2026-09-03,BCS301,absent\n2026-09-01,BAS301,present\n2026-09-02,BAS301,present`;
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_sample_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // --------------------------------------------------------------------------
  // ACTIONS: CSV EXPORT
  // --------------------------------------------------------------------------
  const handleExportCsv = async () => {
    try {
      const headers = getAuthHeaders();
      const res = await fetch('/api/attendance/export', { headers });
      if (!res.ok) {
        showError('No attendance records available to export.');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_export_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showSuccess('Attendance CSV exported successfully.');
    } catch (err) {
      showError('Failed to export attendance CSV.');
    }
  };

  // --------------------------------------------------------------------------
  // ACTIONS: RESET ATTENDANCE
  // --------------------------------------------------------------------------
  const handleConfirmReset = async () => {
    setResetting(true);
    try {
      const res = await fetch('/api/attendance/reset', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          subjectId: resetTargetSubject ? resetTargetSubject.id : undefined,
          all: !resetTargetSubject
        })
      });
      const data = await res.json();
      if (data.success) {
        showSuccess(data.message);
        setIsResetConfirmOpen(false);
        setResetTargetSubject(null);
        await fetchSummary();
      } else {
        showError(data.message || 'Failed to reset attendance.');
      }
    } catch (err) {
      showError('Network error while resetting attendance.');
    } finally {
      setResetting(false);
    }
  };

  // --------------------------------------------------------------------------
  // DYNAMIC PROJECTION CALCULATIONS
  // --------------------------------------------------------------------------
  const activeProjectionData = () => {
    let tot = summary.totalLectures;
    let att = summary.attendedLectures;
    let target = globalTarget;

    if (projectionSubjectId !== 'overall') {
      const sub = subjects.find(s => s.id === projectionSubjectId);
      if (sub) {
        tot = sub.totalLectures;
        att = sub.attendedLectures;
        target = sub.targetPercentage || globalTarget;
      }
    }

    if (projectionTab === 'skip') {
      return [1, 2, 3, 5, 6, 10, 15].map(sCount => {
        const newTot = tot + sCount;
        const newAtt = att;
        const projPct = newTot > 0 ? Math.round((newAtt / newTot) * 10000) / 100 : 0;
        return {
          count: sCount,
          projectedAttendance: projPct,
          meetsTarget: projPct >= target
        };
      });
    } else {
      return [1, 2, 3, 5, 10, 15, 20].map(aCount => {
        const newTot = tot + aCount;
        const newAtt = att + aCount;
        const projPct = newTot > 0 ? Math.round((newAtt / newTot) * 10000) / 100 : 0;
        return {
          count: aCount,
          projectedAttendance: projPct,
          meetsTarget: projPct >= target
        };
      });
    }
  };

  // --------------------------------------------------------------------------
  // CIRCULAR GAUGE CONSTANTS
  // --------------------------------------------------------------------------
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const currentPct = summary.percentage || 0;
  const strokeDashoffset = circumference - (currentPct / 100) * circumference;

  let gaugeColor = '#10B981'; // Green
  if (summary.totalLectures === 0) {
    gaugeColor = '#CBD5E1'; // Neutral Slate
  } else if (currentPct < globalTarget - 10) {
    gaugeColor = '#EF4444'; // Red
  } else if (currentPct < globalTarget) {
    gaugeColor = '#F59E0B'; // Amber
  }

  // --------------------------------------------------------------------------
  // RENDER COMPONENT
  // --------------------------------------------------------------------------
  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', paddingBottom: '5rem', color: '#1F2421' }}>
      {/* 1. TOP HEADER & BREADCRUMB */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E2D5', padding: '2rem 1.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#6B7280', marginBottom: '0.75rem' }}>
            <span style={{ cursor: 'pointer', hover: { color: '#781416' } }} onClick={() => onNavigate ? onNavigate('home') : (window.location.href = '/')}>Home</span>
            <span>/</span>
            <span style={{ cursor: 'pointer' }} onClick={() => onNavigate ? onNavigate('more') : (window.location.href = '/more')}>More Tools</span>
            <span>/</span>
            <span style={{ color: '#781416', fontWeight: 600 }}>Attendance Calculator</span>
          </div>

          {/* Title Row & Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart2 size={24} color="#781416" />
                </div>
                <div>
                  <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#1F2421', margin: 0 }}>
                    Attendance Calculator & Tracker
                  </h1>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#6B7280' }}>
                    Track subject-wise attendance, calculate bunk capacity, and maintain your {globalTarget}% AKTU threshold.
                  </p>
                </div>
              </div>
            </div>

            {/* Target Attendance Selector & Refresh Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F8F9FA', padding: '0.4rem 0.75rem', borderRadius: '10px', border: '1px solid #E8E2D5' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4B5563' }}>Target:</span>
                {[70, 75, 80, 85].map((tgt) => (
                  <button
                    key={tgt}
                    onClick={() => setGlobalTarget(tgt)}
                    style={{
                      padding: '0.25rem 0.55rem',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                      backgroundColor: globalTarget === tgt ? '#781416' : 'transparent',
                      color: globalTarget === tgt ? '#FFFFFF' : '#4B5563',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tgt}%
                  </button>
                ))}
              </div>

              <button
                onClick={() => fetchSummary(true)}
                disabled={refreshing}
                title="Refresh Attendance"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid #E8E2D5',
                  backgroundColor: '#FFFFFF',
                  color: '#4B5563',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                <span>Sync</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NOTIFICATIONS / BANNERS */}
      <div style={{ maxWidth: '1280px', margin: '1rem auto 0', padding: '0 1.5rem' }}>
        {successBanner && (
          <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '0.75rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} color="#059669" />
              <span>{successBanner}</span>
            </div>
            <button onClick={() => setSuccessBanner(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#065F46' }}>
              <X size={16} />
            </button>
          </div>
        )}

        {errorBanner && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} color="#DC2626" />
              <span>{errorBanner}</span>
            </div>
            <button onClick={() => setErrorBanner(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B' }}>
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* 2. TOP 4 KPI CARDS */}
      <section style={{ maxWidth: '1280px', margin: '1.25rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
          {/* Total Lectures */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E8E2D5', padding: '1.25rem', boxShadow: '0 2px 8px rgba(35,30,25,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Lectures</span>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#1F2421', marginTop: '0.25rem' }}>
                  {summary.totalLectures}
                </div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={20} color="#4B5563" />
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.5rem' }}>
              Across {subjects.length} registered subject{subjects.length === 1 ? '' : 's'}
            </div>
          </div>

          {/* Attended Lectures */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E8E2D5', padding: '1.25rem', boxShadow: '0 2px 8px rgba(35,30,25,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Attended Lectures</span>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>
                  {summary.attendedLectures}
                </div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={20} color="#059669" />
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#059669', marginTop: '0.5rem', fontWeight: 600 }}>
              {summary.totalLectures > 0 ? `${summary.percentage.toFixed(1)}% attendance rate` : 'No lectures yet'}
            </div>
          </div>

          {/* Absent Lectures */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E8E2D5', padding: '1.25rem', boxShadow: '0 2px 8px rgba(35,30,25,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Absent Lectures</span>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#DC2626', marginTop: '0.25rem' }}>
                  {summary.absentLectures}
                </div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertCircle size={20} color="#DC2626" />
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#DC2626', marginTop: '0.5rem' }}>
              Missed classes requiring makeup
            </div>
          </div>

          {/* Target Attendance */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E8E2D5', padding: '1.25rem', boxShadow: '0 2px 8px rgba(35,30,25,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#781416', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Target Attendance</span>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 800, color: '#781416', marginTop: '0.25rem' }}>
                  {globalTarget}%
                </div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={20} color="#781416" />
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: summary.percentage >= globalTarget ? '#059669' : '#DC2626', marginTop: '0.5rem', fontWeight: 600 }}>
              {summary.totalLectures === 0
                ? 'Ready to calculate'
                : summary.percentage >= globalTarget
                ? `Above Target by +${(summary.percentage - globalTarget).toFixed(1)}%`
                : `Below Target by -${(globalTarget - summary.percentage).toFixed(1)}%`}
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE COLUMN CORE WORKSPACE */}
      <section style={{ maxWidth: '1280px', margin: '1.5rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem' }}>

          {/* ================================================================== */}
          {/* COLUMN 1 (SPAN 4): ADD / UPDATE LECTURE */}
          {/* ================================================================== */}
          <div style={{ gridColumn: 'span 12', '@media (minWidth: 1024px)': { gridColumn: 'span 4' } }} className="lg:col-span-4 col-span-12">
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8E2D5', padding: '1.5rem', boxShadow: '0 2px 8px rgba(35,30,25,0.03)', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} color="#781416" />
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Add / Update Lecture</h2>
                </div>
              </div>

              {/* Toggle: Single Entry vs Bulk Update */}
              <div style={{ display: 'flex', backgroundColor: '#F3F4F6', padding: '3px', borderRadius: '10px', marginBottom: '1.25rem' }}>
                <button
                  onClick={() => setLeftTab('single')}
                  style={{
                    flex: 1,
                    padding: '0.45rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: leftTab === 'single' ? '#FFFFFF' : 'transparent',
                    color: leftTab === 'single' ? '#781416' : '#6B7280',
                    boxShadow: leftTab === 'single' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Single Entry
                </button>
                <button
                  onClick={() => setLeftTab('bulk')}
                  style={{
                    flex: 1,
                    padding: '0.45rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: leftTab === 'bulk' ? '#FFFFFF' : 'transparent',
                    color: leftTab === 'bulk' ? '#781416' : '#6B7280',
                    boxShadow: leftTab === 'bulk' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Bulk Update
                </button>
              </div>

              {/* If no subjects exist yet */}
              {subjects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', backgroundColor: '#FAF7F2', borderRadius: '12px', border: '1px dashed #D1D5DB' }}>
                  <Award size={32} color="#C88D2D" style={{ margin: '0 auto 0.75rem' }} />
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151', margin: '0 0 0.5rem' }}>
                    No subjects registered yet
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0 0 1rem' }}>
                    Add your first subject to start marking attendance.
                  </p>
                  <button
                    onClick={() => setIsAddSubjectModalOpen(true)}
                    style={{
                      backgroundColor: '#781416',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0.55rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Plus size={15} /> Add First Subject
                  </button>
                </div>
              ) : leftTab === 'single' ? (
                /* SINGLE ENTRY FORM */
                <form onSubmit={handleAddSingleLecture} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                  {/* Select Subject */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                      Select Subject
                    </label>
                    <select
                      value={singleSubjectId}
                      onChange={(e) => {
                        if (e.target.value === '__add_new__') {
                          setIsAddSubjectModalOpen(true);
                        } else {
                          setSingleSubjectId(e.target.value);
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #D1D5DB',
                        fontSize: '0.88rem',
                        backgroundColor: '#FFFFFF',
                        color: '#1F2421',
                        outline: 'none'
                      }}
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.code} — {s.name} ({s.attendedLectures}/{s.totalLectures})
                        </option>
                      ))}
                      <option value="__add_new__">+ Add New Subject...</option>
                    </select>
                  </div>

                  {/* Date Picker */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                      Date
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="date"
                        value={singleDate}
                        onChange={(e) => setSingleDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.75rem',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          fontSize: '0.88rem',
                          outline: 'none',
                          color: '#1F2421'
                        }}
                      />
                    </div>
                  </div>

                  {/* Status Toggle (Present vs Absent) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                      Status
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => setSingleStatus('present')}
                        style={{
                          padding: '0.65rem',
                          borderRadius: '8px',
                          border: singleStatus === 'present' ? '2px solid #059669' : '1px solid #D1D5DB',
                          backgroundColor: singleStatus === 'present' ? '#ECFDF5' : '#FFFFFF',
                          color: singleStatus === 'present' ? '#065F46' : '#6B7280',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Check size={16} color={singleStatus === 'present' ? '#059669' : '#9CA3AF'} />
                        Present
                      </button>

                      <button
                        type="button"
                        onClick={() => setSingleStatus('absent')}
                        style={{
                          padding: '0.65rem',
                          borderRadius: '8px',
                          border: singleStatus === 'absent' ? '2px solid #DC2626' : '1px solid #D1D5DB',
                          backgroundColor: singleStatus === 'absent' ? '#FEF2F2' : '#FFFFFF',
                          color: singleStatus === 'absent' ? '#991B1B' : '#6B7280',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <X size={16} color={singleStatus === 'absent' ? '#DC2626' : '#9CA3AF'} />
                        Absent
                      </button>
                    </div>
                  </div>

                  {/* Maroon Add Lecture Button */}
                  <button
                    type="submit"
                    disabled={singleSubmitting}
                    style={{
                      marginTop: '0.5rem',
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      backgroundColor: '#781416',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: singleSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 2px 6px rgba(120,20,22,0.25)',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <Plus size={18} />
                    {singleSubmitting ? 'Recording...' : '+ Add Lecture'}
                  </button>

                  {/* Add Multiple Lectures Link */}
                  <div style={{ textAlign: 'center', marginTop: '-0.25rem' }}>
                    <button
                      type="button"
                      onClick={() => setIsMultipleLecturesModalOpen(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#781416',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      + Add Multiple Lectures &gt;
                    </button>
                  </div>

                  {/* Tip Callout Box */}
                  <div style={{ marginTop: 'auto', backgroundColor: '#FEF9EE', border: '1px solid #FDE68A', borderRadius: '10px', padding: '0.75rem 0.85rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1rem' }}>💡</span>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#92400E', lineHeight: 1.4 }}>
                      <strong>Tip:</strong> Mark attendance daily after each class for accurate bunk predictions and exam eligibility warnings.
                    </p>
                  </div>
                </form>
              ) : (
                /* BULK UPDATE FORM */
                <form onSubmit={handleSaveBulkUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                      Select Subject
                    </label>
                    <select
                      value={bulkSubjectId}
                      onChange={(e) => setBulkSubjectId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #D1D5DB',
                        fontSize: '0.88rem',
                        backgroundColor: '#FFFFFF',
                        color: '#1F2421',
                        outline: 'none'
                      }}
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.code} — {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                        Total Lectures
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={bulkTotal}
                        onChange={(e) => handleBulkTotalChange(e.target.value)}
                        placeholder="e.g. 48"
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.75rem',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          fontSize: '0.88rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#059669', marginBottom: '0.35rem' }}>
                        Attended
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={bulkAttended}
                        onChange={(e) => handleBulkAttendedChange(e.target.value)}
                        placeholder="e.g. 40"
                        style={{
                          width: '100%',
                          padding: '0.6rem 0.75rem',
                          borderRadius: '8px',
                          border: '1px solid #D1D5DB',
                          fontSize: '0.88rem',
                          outline: 'none',
                          color: '#059669',
                          fontWeight: 600
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#DC2626', marginBottom: '0.35rem' }}>
                      Absent (Missed)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={bulkAbsent}
                      onChange={(e) => handleBulkAbsentChange(e.target.value)}
                      placeholder="e.g. 8"
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #D1D5DB',
                        fontSize: '0.88rem',
                        outline: 'none',
                        color: '#DC2626'
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#6B7280', display: 'block', marginTop: '0.2rem' }}>
                      Formula: Total = Attended + Absent
                    </span>
                  </div>

                  {/* Calculated percentage preview */}
                  {parseInt(bulkTotal, 10) > 0 && (
                    <div style={{ backgroundColor: '#F8F9FA', borderRadius: '8px', padding: '0.65rem 0.85rem', fontSize: '0.82rem' }}>
                      <span style={{ color: '#4B5563' }}>Calculated Percentage: </span>
                      <strong style={{ color: '#781416', fontSize: '0.95rem' }}>
                        {((parseInt(bulkAttended, 10) / parseInt(bulkTotal, 10)) * 100).toFixed(2)}%
                      </strong>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={bulkSubmitting}
                    style={{
                      marginTop: 'auto',
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      backgroundColor: '#781416',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: bulkSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 2px 6px rgba(120,20,22,0.25)'
                    }}
                  >
                    <Check size={18} />
                    {bulkSubmitting ? 'Saving...' : 'Save Bulk Update'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ================================================================== */}
          {/* COLUMN 2 (SPAN 4): ATTENDANCE GAUGE & BUNK PREDICTIONS */}
          {/* ================================================================== */}
          <div style={{ gridColumn: 'span 12', '@media (minWidth: 1024px)': { gridColumn: 'span 4' } }} className="lg:col-span-4 col-span-12">
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8E2D5', padding: '1.5rem', boxShadow: '0 2px 8px rgba(35,30,25,0.03)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} color="#781416" />
                  <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Attendance Gauge</h2>
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '9999px', backgroundColor: summary.percentage >= globalTarget ? '#ECFDF5' : '#FEF2F2', color: summary.percentage >= globalTarget ? '#065F46' : '#991B1B' }}>
                  Target: {globalTarget}%
                </span>
              </div>

              {/* Circular SVG Gauge */}
              <div style={{ position: 'relative', width: '170px', height: '170px', margin: '0.75rem 0' }}>
                <svg width="170" height="170" viewBox="0 0 170 170" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Track Circle */}
                  <circle
                    cx="85"
                    cy="85"
                    r={radius}
                    fill="transparent"
                    stroke="#F3F4F6"
                    strokeWidth="14"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="85"
                    cy="85"
                    r={radius}
                    fill="transparent"
                    stroke={gaugeColor}
                    strokeWidth="14"
                    strokeDasharray={circumference}
                    strokeDashoffset={summary.totalLectures === 0 ? circumference : strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
                  />
                </svg>

                {/* Inner Text */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.85rem', fontWeight: 800, color: '#1F2421', lineHeight: 1 }}>
                    {summary.totalLectures === 0 ? '0.0%' : `${summary.percentage.toFixed(1)}%`}
                  </span>
                  <span
                    style={{
                      marginTop: '0.35rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.55rem',
                      borderRadius: '9999px',
                      backgroundColor:
                        summary.totalLectures === 0
                          ? '#F3F4F6'
                          : summary.percentage >= globalTarget
                          ? '#ECFDF5'
                          : '#FEF2F2',
                      color:
                        summary.totalLectures === 0
                          ? '#6B7280'
                          : summary.percentage >= globalTarget
                          ? '#059669'
                          : '#DC2626'
                    }}
                  >
                    {summary.totalLectures === 0 ? 'No Data' : summary.percentage >= globalTarget ? 'On Track' : 'Below Target'}
                  </span>
                </div>
              </div>

              {/* Status Recommendation Banner */}
              <div
                style={{
                  width: '100%',
                  marginTop: '0.75rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  backgroundColor:
                    summary.totalLectures === 0
                      ? '#F9FAFB'
                      : summary.percentage >= globalTarget
                      ? '#ECFDF5'
                      : '#FEF2F2',
                  border: `1px solid ${
                    summary.totalLectures === 0
                      ? '#E5E7EB'
                      : summary.percentage >= globalTarget
                      ? '#A7F3D0'
                      : '#FECACA'
                  }`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  {summary.totalLectures === 0 ? (
                    <Info size={18} color="#6B7280" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : summary.percentage >= globalTarget ? (
                    <ShieldCheck size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : (
                    <ShieldAlert size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                  )}
                  <div>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color:
                          summary.totalLectures === 0
                            ? '#374151'
                            : summary.percentage >= globalTarget
                            ? '#065F46'
                            : '#991B1B'
                      }}
                    >
                      {summary.totalLectures === 0
                        ? 'No Attendance Recorded Yet'
                        : summary.percentage >= globalTarget
                        ? `Safe! You can bunk ${summary.lecturesCanSkip} lecture${summary.lecturesCanSkip === 1 ? '' : 's'}`
                        : `Shortage! Attend next ${summary.lecturesNeededToReachTarget} lecture${summary.lecturesNeededToReachTarget === 1 ? '' : 's'}`}
                    </div>
                    <p
                      style={{
                        margin: '0.2rem 0 0',
                        fontSize: '0.78rem',
                        color:
                          summary.totalLectures === 0
                            ? '#6B7280'
                            : summary.percentage >= globalTarget
                            ? '#047857'
                            : '#B91C1C',
                        lineHeight: 1.35
                      }}
                    >
                      {summary.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bunk Capacity & Needed Stats Grid */}
              <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                <div style={{ backgroundColor: '#F8F9FA', borderRadius: '10px', padding: '0.75rem', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Consecutive Bunk</span>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 800, color: '#059669', marginTop: '0.1rem' }}>
                    {summary.lecturesCanSkip}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>lectures safe to skip</span>
                </div>

                <div style={{ backgroundColor: '#F8F9FA', borderRadius: '10px', padding: '0.75rem', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>Required Lectures</span>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 800, color: summary.lecturesNeededToReachTarget > 0 ? '#DC2626' : '#6B7280', marginTop: '0.1rem' }}>
                    {summary.lecturesNeededToReachTarget}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>needed for {globalTarget}%</span>
                </div>
              </div>

              {/* AKTU Rule Note */}
              <div style={{ marginTop: 'auto', paddingTop: '1rem', width: '100%', fontSize: '0.75rem', color: '#9CA3AF', textAlign: 'center' }}>
                *AKTU Ordinance mandates a minimum of 75% attendance to be eligible for End-Semester examinations.
              </div>
            </div>
          </div>

          {/* ================================================================== */}
          {/* COLUMN 3 (SPAN 4): TARGET & PROJECTIONS + RECENT LECTURES + STATS */}
          {/* ================================================================== */}
          <div style={{ gridColumn: 'span 12', '@media (minWidth: 1024px)': { gridColumn: 'span 4' } }} className="lg:col-span-4 col-span-12">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>

              {/* CARD 1: TARGET & FUTURE PROJECTIONS */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8E2D5', padding: '1.25rem', boxShadow: '0 2px 8px rgba(35,30,25,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <BarChart2 size={16} color="#781416" />
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 700, margin: 0 }}>Target &amp; Projections</h3>
                  </div>

                  {/* Subject Filter for Projection */}
                  <select
                    value={projectionSubjectId}
                    onChange={(e) => setProjectionSubjectId(e.target.value)}
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.4rem', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                  >
                    <option value="overall">Overall Attendance</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.code}</option>
                    ))}
                  </select>
                </div>

                {/* Projection Mode Toggle: If you Skip vs If you Attend */}
                <div style={{ display: 'flex', backgroundColor: '#F3F4F6', padding: '2px', borderRadius: '8px', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => setProjectionTab('skip')}
                    style={{
                      flex: 1,
                      padding: '0.35rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: projectionTab === 'skip' ? '#FFFFFF' : 'transparent',
                      color: projectionTab === 'skip' ? '#DC2626' : '#6B7280',
                      boxShadow: projectionTab === 'skip' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    If you Skip
                  </button>
                  <button
                    onClick={() => setProjectionTab('attend')}
                    style={{
                      flex: 1,
                      padding: '0.35rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: projectionTab === 'attend' ? '#FFFFFF' : 'transparent',
                      color: projectionTab === 'attend' ? '#059669' : '#6B7280',
                      boxShadow: projectionTab === 'attend' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    If you Attend
                  </button>
                </div>

                {/* Compact Projection Table */}
                <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'left', color: '#6B7280', fontWeight: 600 }}>Next Lectures</th>
                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'center', color: '#6B7280', fontWeight: 600 }}>Projected %</th>
                        <th style={{ padding: '0.4rem 0.6rem', textAlign: 'right', color: '#6B7280', fontWeight: 600 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeProjectionData().slice(0, 5).map((row) => (
                        <tr key={row.count} style={{ borderBottom: '1px solid #F3F4F6' }}>
                          <td style={{ padding: '0.35rem 0.6rem', fontWeight: 600 }}>
                            {projectionTab === 'skip' ? `Skip next ${row.count}` : `Attend next ${row.count}`}
                          </td>
                          <td style={{ padding: '0.35rem 0.6rem', textAlign: 'center', fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: row.meetsTarget ? '#059669' : '#DC2626' }}>
                            {row.projectedAttendance.toFixed(1)}%
                          </td>
                          <td style={{ padding: '0.35rem 0.6rem', textAlign: 'right' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '9999px', backgroundColor: row.meetsTarget ? '#ECFDF5' : '#FEF2F2', color: row.meetsTarget ? '#065F46' : '#991B1B' }}>
                              {row.meetsTarget ? 'Safe' : 'Below'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CARD 2: RECENT LECTURES */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8E2D5', padding: '1.25rem', boxShadow: '0 2px 8px rgba(35,30,25,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={16} color="#781416" />
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 700, margin: 0 }}>Recent Lectures</h3>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280' }}>Last 5 entries</span>
                </div>

                {recentLectures.length === 0 ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.8rem', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                    No lecture history recorded yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {recentLectures.slice(0, 5).map((lec) => (
                      <div
                        key={lec.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.4rem 0.6rem',
                          borderRadius: '8px',
                          backgroundColor: '#F9FAFB',
                          fontSize: '0.8rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.72rem', color: '#6B7280', fontFamily: 'monospace' }}>
                            {lec.date}
                          </span>
                          <span style={{ fontWeight: 600, color: '#1F2421' }}>
                            {lec.subjectCode}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '0.1rem 0.45rem',
                              borderRadius: '9999px',
                              backgroundColor: lec.status === 'present' ? '#ECFDF5' : '#FEF2F2',
                              color: lec.status === 'present' ? '#059669' : '#DC2626'
                            }}
                          >
                            {lec.status === 'present' ? 'Present' : 'Absent'}
                          </span>
                          <button
                            onClick={() => handleDeleteLecture(lec.id)}
                            title="Delete entry"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '2px' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CARD 3: QUICK STATS */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8E2D5', padding: '1.25rem', boxShadow: '0 2px 8px rgba(35,30,25,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <Award size={16} color="#781416" />
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', fontWeight: 700, margin: 0 }}>Quick Stats</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ backgroundColor: '#F8F9FA', borderRadius: '8px', padding: '0.6rem', border: '1px solid #E5E7EB' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6B7280' }}>Weekly</span>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: '#1F2421', marginTop: '0.1rem' }}>
                      {quickStats.weekly.attendance !== null ? `${quickStats.weekly.attendance.toFixed(1)}%` : '—'}
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#6B7280', display: 'block', marginTop: '0.1rem' }}>
                      {quickStats.weekly.label}
                    </span>
                  </div>

                  <div style={{ backgroundColor: '#F8F9FA', borderRadius: '8px', padding: '0.6rem', border: '1px solid #E5E7EB' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#6B7280' }}>Monthly</span>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: '#1F2421', marginTop: '0.1rem' }}>
                      {quickStats.monthly.attendance !== null ? `${quickStats.monthly.attendance.toFixed(1)}%` : '—'}
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#6B7280', display: 'block', marginTop: '0.1rem' }}>
                      {quickStats.monthly.label}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. SUBJECT-WISE ATTENDANCE TABLE */}
      <section style={{ maxWidth: '1280px', margin: '2rem auto 0', padding: '0 1.5rem' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8E2D5', padding: '1.5rem', boxShadow: '0 2px 8px rgba(35,30,25,0.03)' }}>
          {/* Table Header & Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.3rem', fontWeight: 800, color: '#1F2421', margin: 0 }}>
                Subject-Wise Attendance
              </h2>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#6B7280' }}>
                Individual breakdown with real-time consecutive bunk capacity and makeup requirements.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setIsAddSubjectModalOpen(true)}
                style={{
                  backgroundColor: '#781416',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 2px 4px rgba(120,20,22,0.2)'
                }}
              >
                <Plus size={15} /> Add Subject
              </button>

              <button
                onClick={() => setIsImportModalOpen(true)}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#4B5563',
                  border: '1px solid #D1D5DB',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Upload size={14} /> Import CSV
              </button>

              <button
                onClick={handleExportCsv}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#4B5563',
                  border: '1px solid #D1D5DB',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Download size={14} /> Export CSV
              </button>

              <button
                onClick={() => {
                  setResetTargetSubject(null);
                  setIsResetConfirmOpen(true);
                }}
                style={{
                  backgroundColor: '#FEF2F2',
                  color: '#991B1B',
                  border: '1px solid #FECACA',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Trash2 size={14} /> Reset All
              </button>
            </div>
          </div>

          {/* Table Content */}
          {subjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', backgroundColor: '#FAF7F2', borderRadius: '12px', border: '1px dashed #D1D5DB' }}>
              <Award size={40} color="#C88D2D" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.15rem', fontWeight: 700, color: '#1F2421', margin: '0 0 0.5rem' }}>
                No attendance recorded yet
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#6B7280', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                Add your academic subjects or import a CSV schedule to start tracking your attendance and calculating bunkable lectures.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => setIsAddSubjectModalOpen(true)}
                  style={{
                    backgroundColor: '#781416',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Plus size={16} /> Add First Subject
                </button>
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#4B5563',
                    border: '1px solid #D1D5DB',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Upload size={16} /> Import CSV
                </button>
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Subject</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563', textAlign: 'center' }}>Attended / Total</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563' }}>Progress &amp; %</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563', textAlign: 'center' }}>Target</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563', textAlign: 'center' }}>Bunk Capacity</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563', textAlign: 'center' }}>Required</th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', fontWeight: 700, color: '#4B5563', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((sub) => {
                    const subTarget = sub.targetPercentage || globalTarget;
                    const pct = sub.percentage || 0;
                    const isSafe = pct >= subTarget;
                    let progressColor = '#10B981';
                    if (sub.totalLectures === 0) progressColor = '#E2E8F0';
                    else if (pct < subTarget - 10) progressColor = '#EF4444';
                    else if (pct < subTarget) progressColor = '#F59E0B';

                    return (
                      <tr key={sub.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background-color 0.15s ease' }}>
                        {/* Subject Code & Name */}
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ backgroundColor: '#FEF2F2', color: '#781416', fontWeight: 800, fontSize: '0.78rem', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                              {sub.code}
                            </span>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1F2421' }}>
                              {sub.name}
                            </span>
                          </div>
                        </td>

                        {/* Attended / Total */}
                        <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#1F2421' }}>
                            {sub.attendedLectures}
                          </span>
                          <span style={{ color: '#9CA3AF', margin: '0 0.2rem' }}>/</span>
                          <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                            {sub.totalLectures}
                          </span>
                        </td>

                        {/* Progress Bar & Percentage */}
                        <td style={{ padding: '0.9rem 1rem', minWidth: '160px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{ flex: 1, height: '8px', backgroundColor: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
                              <div
                                style={{
                                  width: `${Math.min(100, pct)}%`,
                                  height: '100%',
                                  backgroundColor: progressColor,
                                  borderRadius: '9999px',
                                  transition: 'width 0.4s ease'
                                }}
                              />
                            </div>
                            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.9rem', color: progressColor, minWidth: '45px', textAlign: 'right' }}>
                              {sub.totalLectures === 0 ? '0.0%' : `${pct.toFixed(1)}%`}
                            </span>
                          </div>
                        </td>

                        {/* Target */}
                        <td style={{ padding: '0.9rem 1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: '#4B5563' }}>
                          {subTarget}%
                        </td>

                        {/* Status Badge */}
                        <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '9999px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor:
                                sub.totalLectures === 0
                                  ? '#F3F4F6'
                                  : isSafe
                                  ? '#ECFDF5'
                                  : '#FEF2F2',
                              color:
                                sub.totalLectures === 0
                                  ? '#6B7280'
                                  : isSafe
                                  ? '#065F46'
                                  : '#991B1B'
                            }}
                          >
                            {sub.totalLectures === 0 ? 'No Data' : isSafe ? 'On Track' : 'Shortage'}
                          </span>
                        </td>

                        {/* Bunk Capacity */}
                        <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.95rem', color: sub.lecturesCanSkip > 0 ? '#059669' : '#6B7280' }}>
                            {sub.lecturesCanSkip}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#6B7280', display: 'block' }}>
                            can skip
                          </span>
                        </td>

                        {/* Required */}
                        <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '0.95rem', color: sub.lecturesNeededToReachTarget > 0 ? '#DC2626' : '#059669' }}>
                            {sub.lecturesNeededToReachTarget}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#6B7280', display: 'block' }}>
                            needed
                          </span>
                        </td>

                        {/* Action Buttons */}
                        <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            {/* Quick + Present */}
                            <button
                              onClick={() => handleQuickMark(sub.id, 'present')}
                              title="Mark 1 Present today"
                              style={{
                                padding: '0.3rem 0.5rem',
                                borderRadius: '6px',
                                border: '1px solid #A7F3D0',
                                backgroundColor: '#ECFDF5',
                                color: '#065F46',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              +P
                            </button>

                            {/* Quick + Absent */}
                            <button
                              onClick={() => handleQuickMark(sub.id, 'absent')}
                              title="Mark 1 Absent today"
                              style={{
                                padding: '0.3rem 0.5rem',
                                borderRadius: '6px',
                                border: '1px solid #FECACA',
                                backgroundColor: '#FEF2F2',
                                color: '#991B1B',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              +A
                            </button>

                            {/* Edit Subject */}
                            <button
                              onClick={() => handleOpenEditSubject(sub)}
                              title="Edit Subject"
                              style={{
                                padding: '0.3rem',
                                borderRadius: '6px',
                                border: '1px solid #E5E7EB',
                                backgroundColor: '#FFFFFF',
                                color: '#4B5563',
                                cursor: 'pointer'
                              }}
                            >
                              <Edit2 size={13} />
                            </button>

                            {/* Reset Subject */}
                            <button
                              onClick={() => {
                                setResetTargetSubject(sub);
                                setIsResetConfirmOpen(true);
                              }}
                              title="Reset this subject's attendance to 0"
                              style={{
                                padding: '0.3rem',
                                borderRadius: '6px',
                                border: '1px solid #E5E7EB',
                                backgroundColor: '#FFFFFF',
                                color: '#D97706',
                                cursor: 'pointer'
                              }}
                            >
                              <RefreshCw size={13} />
                            </button>

                            {/* Delete Subject */}
                            <button
                              onClick={() => setDeleteSubjectTarget(sub)}
                              title="Delete Subject"
                              style={{
                                padding: '0.3rem',
                                borderRadius: '6px',
                                border: '1px solid #FECACA',
                                backgroundColor: '#FEF2F2',
                                color: '#DC2626',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ==================================================================== */}
      {/* MODAL 1: ADD SUBJECT */}
      {/* ==================================================================== */}
      {isAddSubjectModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '460px', width: '100%', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={20} color="#781416" />
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Add New Subject</h3>
              </div>
              <button onClick={() => setIsAddSubjectModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Subject Code * (e.g. BCS301, BAS101)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BCS301"
                  value={newSubCode}
                  onChange={(e) => setNewSubCode(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Subject Name * (e.g. Data Structures)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Structures"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Target Attendance %
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={newSubTarget}
                  onChange={(e) => setNewSubTarget(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#6B7280', marginBottom: '0.35rem' }}>
                    Initial Total (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newSubInitialTotal}
                    onChange={(e) => setNewSubInitialTotal(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#059669', marginBottom: '0.35rem' }}>
                    Initial Attended
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newSubInitialAttended}
                    onChange={(e) => setNewSubInitialAttended(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddSubjectModalOpen(false)}
                  style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', color: '#4B5563', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingSubject}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#781416', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, cursor: addingSubject ? 'not-allowed' : 'pointer' }}
                >
                  {addingSubject ? 'Adding...' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: EDIT SUBJECT */}
      {/* ==================================================================== */}
      {isEditSubjectModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit2 size={18} color="#781416" />
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Edit Subject</h3>
              </div>
              <button onClick={() => setIsEditSubjectModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Subject Code</label>
                <input
                  type="text"
                  required
                  value={editSubCode}
                  onChange={(e) => setEditSubCode(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Subject Name</label>
                <input
                  type="text"
                  required
                  value={editSubName}
                  onChange={(e) => setEditSubName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Target Percentage (%)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={editSubTarget}
                  onChange={(e) => setEditSubTarget(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditSubjectModalOpen(false)}
                  style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', color: '#4B5563', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingSubject}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#781416', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, cursor: updatingSubject ? 'not-allowed' : 'pointer' }}
                >
                  {updatingSubject ? 'Saving...' : 'Update Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: ADD MULTIPLE LECTURES */}
      {/* ==================================================================== */}
      {isMultipleLecturesModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="#781416" />
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Add Multiple Lectures</h3>
              </div>
              <button onClick={() => setIsMultipleLecturesModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMultipleLectures} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Select Subject</label>
                <select
                  value={multiSubjectId}
                  onChange={(e) => setMultiSubjectId(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }}
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.code} — {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Date</label>
                <input
                  type="date"
                  value={multiDate}
                  onChange={(e) => setMultiDate(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#059669', marginBottom: '0.35rem' }}>Present Count</label>
                  <input
                    type="number"
                    min="0"
                    value={multiPresentCount}
                    onChange={(e) => setMultiPresentCount(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#DC2626', marginBottom: '0.35rem' }}>Absent Count</label>
                  <input
                    type="number"
                    min="0"
                    value={multiAbsentCount}
                    onChange={(e) => setMultiAbsentCount(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsMultipleLecturesModalOpen(false)}
                  style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', color: '#4B5563', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={multiSubmitting}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#781416', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, cursor: multiSubmitting ? 'not-allowed' : 'pointer' }}
                >
                  {multiSubmitting ? 'Adding...' : 'Add Lectures'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: CSV IMPORT */}
      {/* ==================================================================== */}
      {isImportModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileSpreadsheet size={20} color="#781416" />
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Import Attendance CSV</h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: '0 0 1rem', lineHeight: 1.4 }}>
              Required CSV headers: <code>date,subject_code,status</code>. Subjects will be created automatically if they don't already exist.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <button
                type="button"
                onClick={downloadSampleCsv}
                style={{ background: 'none', border: 'none', color: '#781416', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Download size={13} /> Download Sample Template
              </button>

              <label style={{ backgroundColor: '#F3F4F6', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                Choose File (.csv)
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <textarea
              rows="6"
              placeholder={`date,subject_code,status\n2026-09-01,BCS301,present\n2026-09-02,BCS301,absent`}
              value={importCsvText}
              onChange={(e) => setImportCsvText(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                marginBottom: '1rem',
                outline: 'none'
              }}
            />

            {importWarnings.length > 0 && (
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', maxHeight: '120px', overflowY: 'auto' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#991B1B', marginBottom: '0.25rem' }}>Import Warnings / Errors:</div>
                {importWarnings.map((w, i) => (
                  <div key={i} style={{ fontSize: '0.74rem', color: '#B91C1C' }}>• {w}</div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', color: '#4B5563', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                disabled={importing}
                style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#781416', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, cursor: importing ? 'not-allowed' : 'pointer' }}
              >
                {importing ? 'Importing...' : 'Execute Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 5: RESET CONFIRMATION */}
      {/* ==================================================================== */}
      {isResetConfirmOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '420px', width: '100%', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#DC2626', marginBottom: '0.75rem' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                {resetTargetSubject ? `Reset ${resetTargetSubject.code}?` : 'Reset All Attendance?'}
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: 1.4, margin: '0 0 1.25rem' }}>
              {resetTargetSubject
                ? `This will permanently clear all recorded lectures for ${resetTargetSubject.code} (${resetTargetSubject.name}) and reset its counts to 0. This cannot be undone.`
                : 'This will permanently erase ALL recorded subjects and lectures from your device and database. All attendance calculations will be reset to empty.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  setIsResetConfirmOpen(false);
                  setResetTargetSubject(null);
                }}
                style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', color: '#4B5563', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                disabled={resetting}
                style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, cursor: resetting ? 'not-allowed' : 'pointer' }}
              >
                {resetting ? 'Resetting...' : 'Yes, Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 6: DELETE SUBJECT CONFIRMATION */}
      {/* ==================================================================== */}
      {deleteSubjectTarget && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '420px', width: '100%', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#DC2626', marginBottom: '0.75rem' }}>
              <Trash2 size={22} />
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                Delete Subject {deleteSubjectTarget.code}?
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: 1.4, margin: '0 0 1.25rem' }}>
              Are you sure you want to delete <strong>{deleteSubjectTarget.code} — {deleteSubjectTarget.name}</strong>? All associated lecture logs will also be permanently deleted.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setDeleteSubjectTarget(null)}
                style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: '#FFFFFF', color: '#4B5563', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteSubject}
                disabled={deletingSubject}
                style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#DC2626', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700, cursor: deletingSubject ? 'not-allowed' : 'pointer' }}
              >
                {deletingSubject ? 'Deleting...' : 'Delete Subject'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
