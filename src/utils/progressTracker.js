// ============================================================================
// PROFESSORVIRUS — PROGRESS TRACKER UTILITY
// Centralized client-side activity tracking for Notes, PYQs, Quizzes, etc.
// Sends real events to /api/progress/activity
// ============================================================================

import { API_URL } from '../config/api';

function getAuthToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
}

function getUserTimezoneOffset() {
  // Returns offset in minutes from UTC (e.g. IST = +330)
  return -(new Date().getTimezoneOffset());
}

async function sendActivity(data) {
  const token = getAuthToken();
  if (!token) return null; // Not logged in, skip tracking

  try {
    const response = await fetch(`${API_URL}/api/progress/activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...data,
        tz: getUserTimezoneOffset()
      })
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.warn('[ProgressTracker] Failed to log activity:', err.message);
    return null;
  }
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Track a note being viewed
 */
export function trackNoteViewed({ noteId, noteName, subject, course }) {
  return sendActivity({
    type: 'NOTE_VIEWED',
    entityId: noteId,
    entityName: noteName,
    entityType: 'note',
    subject,
    course
  });
}

/**
 * Track a note being completed/fully read
 */
export function trackNoteCompleted({ noteId, noteName, subject, course }) {
  return sendActivity({
    type: 'NOTE_COMPLETED',
    entityId: noteId,
    entityName: noteName,
    entityType: 'note',
    subject,
    course
  });
}

/**
 * Track a PYQ being opened
 */
export function trackPYQOpened({ pyqId, pyqName, subject, course, year }) {
  return sendActivity({
    type: 'PYQ_OPENED',
    entityId: pyqId,
    entityName: pyqName,
    entityType: 'pyq',
    subject,
    course,
    metadata: { year }
  });
}

/**
 * Track a PYQ being solved
 */
export function trackPYQSolved({ pyqId, pyqName, subject, course, year }) {
  return sendActivity({
    type: 'PYQ_SOLVED',
    entityId: pyqId,
    entityName: pyqName,
    entityType: 'pyq',
    subject,
    course,
    metadata: { year }
  });
}

/**
 * Track a quiz being completed
 */
export function trackQuizCompleted({ quizId, quizName, subject, course, score, totalMarks, correct, incorrect, skipped, durationSeconds, startedAt }) {
  return sendActivity({
    type: 'QUIZ_COMPLETED',
    entityId: quizId,
    entityName: quizName,
    entityType: 'quiz',
    subject,
    course,
    metadata: { score, totalMarks, correct, incorrect, skipped, durationSeconds, startedAt }
  });
}

/**
 * Track a topic being completed
 */
export function trackTopicCompleted({ topicId, topicName, unitName, subject, course }) {
  return sendActivity({
    type: 'TOPIC_COMPLETED',
    entityId: topicId,
    entityName: topicName,
    entityType: 'topic',
    subject,
    course,
    metadata: { unitName }
  });
}

/**
 * Track an interview round being completed
 */
export function trackInterviewRoundCompleted({ roundType, roundName, score, subject }) {
  return sendActivity({
    type: 'INTERVIEW_ROUND_COMPLETED',
    entityId: `interview-${roundType}-${Date.now()}`,
    entityName: roundName || `Interview ${roundType}`,
    entityType: 'interview',
    subject,
    metadata: { roundType, score }
  });
}

// ============================================================================
// STUDY SESSION HELPERS
// ============================================================================

export async function startStudySession({ subject, course } = {}) {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/progress/study-session/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ subject, course })
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.warn('[ProgressTracker] Failed to start session:', err.message);
    return null;
  }
}

export async function stopStudySession({ sessionId, idleDetected } = {}) {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/progress/study-session/stop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ sessionId, idleDetected, tz: getUserTimezoneOffset() })
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.warn('[ProgressTracker] Failed to stop session:', err.message);
    return null;
  }
}

export async function getActiveSession() {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/progress/study-session/active`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.session;
  } catch (err) {
    return null;
  }
}

// ============================================================================
// PROGRESS DATA FETCHERS
// ============================================================================

export async function fetchProgressSummary() {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/progress/summary?tz=${getUserTimezoneOffset()}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.warn('[ProgressTracker] Failed to fetch summary:', err.message);
    return null;
  }
}

export async function fetchStudyTimeTrend(days = 14) {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/progress/study-time?days=${days}&tz=${getUserTimezoneOffset()}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}

export async function fetchQuizPerformance(limit = 20) {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/progress/quiz-performance?limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}

export async function fetchGoals(status = 'all') {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/progress/goals?status=${status}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}

export async function createGoal(goalData) {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/progress/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...goalData, tz: getUserTimezoneOffset() })
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}

export async function updateGoal(goalId, updates) {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/progress/goals/${goalId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...updates, tz: getUserTimezoneOffset() })
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}

export async function fetchNotesActivity() {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/progress/notes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}

export async function fetchPYQsActivity() {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/progress/pyqs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}

export async function fetchTopicsProgress() {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/progress/topics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}

export async function toggleTopicProgress({ topicId, topicName, unitName, subject, course, status }) {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/progress/topics/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ topicId, topicName, unitName, subject, course, status, tz: getUserTimezoneOffset() })
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}

export async function fetchCalendarData(days = 90) {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/progress/calendar?days=${days}&tz=${getUserTimezoneOffset()}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}

export async function fetchInsights() {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/progress/insights`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}

export async function resetAllProgress() {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/progress/reset`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ confirm: 'DELETE_ALL_PROGRESS' })
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}

