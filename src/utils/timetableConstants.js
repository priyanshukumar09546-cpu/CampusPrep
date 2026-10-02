// src/utils/timetableConstants.js
// Shared client-side constants and styling helpers for Timetable system

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export const SUBJECT_PALETTE = [
  { bg: '#FFE4E6', border: '#FDA4AF', text: '#9F1239', badge: '#E11D48' }, // Rose / Pink
  { bg: '#E0F2FE', border: '#BAE6FD', text: '#0369A1', badge: '#0284C7' }, // Sky / Cyan
  { bg: '#DCFCE7', border: '#BBF7D0', text: '#15803D', badge: '#16A34A' }, // Mint / Green
  { bg: '#F3E8FF', border: '#E9D5FF', text: '#7E22CE', badge: '#9333EA' }, // Lavender / Purple
  { bg: '#FEF3C7', border: '#FDE68A', text: '#B45309', badge: '#D97706' }, // Amber / Gold
  { bg: '#CFFAFE', border: '#A5F3FC', text: '#0E7490', badge: '#0891B2' }, // Cyan / Aqua
  { bg: '#E0E7FF', border: '#C7D2FE', text: '#4338CA', badge: '#4F46E5' }, // Indigo
  { bg: '#FFEDD5', border: '#FED7AA', text: '#C2410C', badge: '#EA580C' }, // Orange / Peach
  { bg: '#F1F5F9', border: '#E2E8F0', text: '#334155', badge: '#475569' }  // Slate / Gray
];

export function getSubjectColor(subjectCode, subjectName = '') {
  const seed = (subjectCode || subjectName || 'CLASS').trim().toUpperCase();
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % SUBJECT_PALETTE.length;
  return SUBJECT_PALETTE[index];
}

export function timeStringToMinutes(timeStr) {
  if (!timeStr) return 0;
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3] ? match[3].toUpperCase() : '';

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}
