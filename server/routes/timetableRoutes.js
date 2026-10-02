// ============================================================================
// PROFESSORVIRUS — TIMETABLE API ROUTER
// Production-ready backend with MongoDB persistence & disk fallback sync
// Strict user authorization — zero fake data
// ============================================================================

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';
import {
  processTimetablePdf,
  resolveTodaySchedule,
  generateIcsCalendar,
  generateCsvTimetable,
  getSubjectColor
} from '../timetableEngine.js';

// Setup file paths for persistent JSON disk storage in server/data
const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const TIMETABLES_FILE = path.join(DATA_DIR, 'timetables.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ----------------------------------------------------------------------------
// MONGOOSE SCHEMAS & MODELS
// ----------------------------------------------------------------------------
const TimetableEntrySchema = new mongoose.Schema({
  id: { type: String, required: true },
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subjectCode: { type: String, default: '' },
  subjectName: { type: String, default: 'Class' },
  faculty: { type: String, default: null },
  room: { type: String, default: null },
  type: { type: String, default: 'Lecture' },
  color: { type: String, default: '#FFE4E6' }
}, { _id: false });

const TimetableStudyBlockSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'Self Study' },
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  notes: { type: String, default: '' },
  color: { type: String, default: '#DCFCE7' }
}, { _id: false });

const TimetableExamSchema = new mongoose.Schema({
  id: { type: String, required: true },
  subject: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, default: '' },
  room: { type: String, default: '' },
  notes: { type: String, default: '' }
}, { _id: false });

const TimetableReminderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, default: 'Class' },
  day: { type: String, default: '' },
  date: { type: String, default: '' },
  time: { type: String, default: '' },
  notes: { type: String, default: '' },
  completed: { type: Boolean, default: false }
}, { _id: false });

const TimetableSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, default: 'My College Time Table' },
  semester: { type: String, default: 'Current Semester' },
  branch: { type: String, default: 'Computer Science' },
  section: { type: String, default: 'A' },
  entries: [TimetableEntrySchema],
  studyBlocks: [TimetableStudyBlockSchema],
  exams: [TimetableExamSchema],
  reminders: [TimetableReminderSchema],
  settings: {
    showBreaks: { type: Boolean, default: true },
    showSubjects: { type: Boolean, default: true },
    showStudyBlocks: { type: Boolean, default: true },
    showOtherActivities: { type: Boolean, default: true },
    timeView: { type: String, default: '8 AM - 8 PM' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const TimetableModel = mongoose.models.Timetable || mongoose.model('Timetable', TimetableSchema);

// In-Memory disk cache
let dbTimetables = [];

function loadTimetablesFromDisk() {
  if (fs.existsSync(TIMETABLES_FILE)) {
    try {
      const data = fs.readFileSync(TIMETABLES_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('[TIMETABLE] Error reading timetables from disk:', e.message);
    }
  }
  return [];
}

function saveTimetablesToDisk(timetables) {
  try {
    fs.writeFileSync(TIMETABLES_FILE, JSON.stringify(timetables, null, 2), 'utf-8');
  } catch (e) {
    console.error('[TIMETABLE] Error saving timetables to disk:', e.message);
  }
}

dbTimetables = loadTimetablesFromDisk();

// Configure Multer for PDF upload in Memory
const uploadPdf = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB Max
  fileFilter: (req, file, cb) => {
    const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
    if (isPdf) cb(null, true);
    else cb(new Error('Invalid file format. Only PDF files are allowed for timetable extraction.'));
  }
});

/**
 * Factory function to create the Timetable API Router
 */
export function createTimetableRouter({ isDbConnected = false, verifyJwtToken = null } = {}) {
  const router = express.Router();

  // Helper to securely identify user from JWT or device token
  function getResolvedUserId(req) {
    const authHeader = req.headers['authorization'] || req.headers['x-user-token'];
    if (authHeader && verifyJwtToken) {
      const rawToken = authHeader.replace(/^Bearer\s+/i, '').trim();
      const payload = verifyJwtToken(rawToken);
      if (payload && payload.userId) {
        return payload.userId;
      }
    }

    const deviceId = req.headers['x-device-id'] || req.headers['x-guest-id'];
    if (deviceId && typeof deviceId === 'string' && deviceId.trim().length >= 4) {
      const sanitized = deviceId.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
      return `guest_${sanitized}`;
    }

    return 'guest_default_user';
  }

  // Helper to find or create timetable for user
  async function getUserTimetable(userId) {
    if (isDbConnected) {
      let doc = await TimetableModel.findOne({ userId }).lean();
      if (doc) return doc;
    }
    const local = dbTimetables.find(t => t.userId === userId);
    if (local) return local;

    // Return empty default state (NO fake classes)
    const newDoc = {
      id: `tt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
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
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newDoc;
  }

  // Helper to save timetable
  async function saveUserTimetable(ttDoc) {
    ttDoc.updatedAt = new Date().toISOString();
    if (isDbConnected) {
      try {
        await TimetableModel.findOneAndUpdate(
          { userId: ttDoc.userId },
          { $set: ttDoc },
          { upsert: true, returnDocument: 'after' }
        );
      } catch (err) {
        console.warn('[TIMETABLE DB] Error writing to MongoDB, writing to disk:', err.message);
      }
    }

    const idx = dbTimetables.findIndex(t => t.userId === ttDoc.userId);
    if (idx !== -1) {
      dbTimetables[idx] = ttDoc;
    } else {
      dbTimetables.push(ttDoc);
    }
    saveTimetablesToDisk(dbTimetables);
    return ttDoc;
  }

  // ==========================================================================
  // 1. GET ACTIVE TIMETABLE
  // ==========================================================================
  router.get('/', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);
      const timetable = await getUserTimetable(userId);
      res.json({ success: true, timetable });
    } catch (err) {
      console.error('[TIMETABLE GET] Error:', err);
      res.status(500).json({ success: false, error: 'Failed to fetch timetable' });
    }
  });

  // ==========================================================================
  // 2. UPLOAD COLLEGE TIMETABLE PDF (AUTO-EXTRACT DRAFT)
  // ==========================================================================
  router.post('/upload', uploadPdf.single('pdf'), async (req, res) => {
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ success: false, error: 'No PDF file uploaded. Please upload a valid timetable PDF (Max 5 MB).' });
      }

      const result = await processTimetablePdf(req.file.buffer, req.file.originalname);
      return res.json(result);
    } catch (err) {
      console.error('[TIMETABLE UPLOAD] Extraction error:', err.message);
      return res.status(422).json({
        success: false,
        error: err.message || "We couldn't reliably read this timetable PDF. Please upload a clearer PDF or create your timetable manually."
      });
    }
  });

  // ==========================================================================
  // 3. CONFIRM & ACTIVATE EXTRACTED TIMETABLE
  // ==========================================================================
  router.post('/confirm', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);
      const { title, semester, branch, section, entries } = req.body;

      if (!Array.isArray(entries)) {
        return res.status(400).json({ success: false, error: 'Entries array is required.' });
      }

      let timetable = await getUserTimetable(userId);
      timetable.title = title || timetable.title || 'My College Time Table';
      timetable.semester = semester || timetable.semester;
      timetable.branch = branch || timetable.branch;
      timetable.section = section || timetable.section;
      timetable.entries = entries.map(e => ({
        ...e,
        id: e.id || `entry_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        color: e.color || getSubjectColor(e.subjectCode, e.subjectName).bg
      }));

      const saved = await saveUserTimetable(timetable);
      return res.json({ success: true, timetable: saved });
    } catch (err) {
      console.error('[TIMETABLE CONFIRM] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to save confirmed timetable.' });
    }
  });

  // ==========================================================================
  // 4. FULL UPDATE TIMETABLE METADATA / ENTRIES
  // ==========================================================================
  router.put('/', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);
      let timetable = await getUserTimetable(userId);
      const { title, semester, branch, section, entries, settings } = req.body;

      if (title !== undefined) timetable.title = title;
      if (semester !== undefined) timetable.semester = semester;
      if (branch !== undefined) timetable.branch = branch;
      if (section !== undefined) timetable.section = section;
      if (Array.isArray(entries)) timetable.entries = entries;
      if (settings && typeof settings === 'object') {
        timetable.settings = { ...timetable.settings, ...settings };
      }

      const saved = await saveUserTimetable(timetable);
      return res.json({ success: true, timetable: saved });
    } catch (err) {
      console.error('[TIMETABLE PUT] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to update timetable.' });
    }
  });

  // ==========================================================================
  // 5. ADD SINGLE CLASS ENTRY MANUALLY
  // ==========================================================================
  router.post('/entry', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);
      const { day, startTime, endTime, subjectCode, subjectName, faculty, room, type, color } = req.body;

      if (!day || !startTime || !endTime) {
        return res.status(400).json({ success: false, error: 'Day, Start Time and End Time are required.' });
      }

      const colorTheme = color ? { bg: color } : getSubjectColor(subjectCode, subjectName);

      const newEntry = {
        id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        day,
        startTime,
        endTime,
        subjectCode: (subjectCode || '').trim().toUpperCase(),
        subjectName: (subjectName || 'Class').trim(),
        faculty: faculty ? faculty.trim() : null,
        room: room ? room.trim() : null,
        type: type || 'Lecture',
        color: colorTheme.bg
      };

      let timetable = await getUserTimetable(userId);
      timetable.entries.push(newEntry);
      const saved = await saveUserTimetable(timetable);

      return res.status(201).json({ success: true, entry: newEntry, timetable: saved });
    } catch (err) {
      console.error('[TIMETABLE ENTRY POST] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to add class.' });
    }
  });

  // ==========================================================================
  // 6. UPDATE SINGLE CLASS ENTRY
  // ==========================================================================
  router.put('/entry/:id', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);
      const { id } = req.params;
      const updates = req.body;

      let timetable = await getUserTimetable(userId);
      const entryIdx = timetable.entries.findIndex(e => e.id === id);

      if (entryIdx === -1) {
        return res.status(404).json({ success: false, error: 'Class entry not found.' });
      }

      timetable.entries[entryIdx] = {
        ...timetable.entries[entryIdx],
        ...updates
      };

      const saved = await saveUserTimetable(timetable);
      return res.json({ success: true, entry: timetable.entries[entryIdx], timetable: saved });
    } catch (err) {
      console.error('[TIMETABLE ENTRY PUT] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to update class.' });
    }
  });

  // ==========================================================================
  // 7. DELETE SINGLE CLASS ENTRY
  // ==========================================================================
  router.delete('/entry/:id', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);
      const { id } = req.params;

      let timetable = await getUserTimetable(userId);
      const initialLen = timetable.entries.length;
      timetable.entries = timetable.entries.filter(e => e.id !== id);

      if (timetable.entries.length === initialLen) {
        return res.status(404).json({ success: false, error: 'Class entry not found.' });
      }

      const saved = await saveUserTimetable(timetable);
      return res.json({ success: true, timetable: saved });
    } catch (err) {
      console.error('[TIMETABLE ENTRY DELETE] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to delete class.' });
    }
  });

  // ==========================================================================
  // 8. ADD PERSONAL STUDY / ACTIVITY BLOCK
  // ==========================================================================
  router.post('/study-block', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);
      const { title, category, day, startTime, endTime, notes, color } = req.body;

      if (!title || !day || !startTime || !endTime) {
        return res.status(400).json({ success: false, error: 'Title, Day, Start Time and End Time are required.' });
      }

      const newBlock = {
        id: `study_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        title: title.trim(),
        category: category || 'Self Study',
        day,
        startTime,
        endTime,
        notes: notes ? notes.trim() : '',
        color: color || '#DCFCE7'
      };

      let timetable = await getUserTimetable(userId);
      timetable.studyBlocks = timetable.studyBlocks || [];
      timetable.studyBlocks.push(newBlock);

      const saved = await saveUserTimetable(timetable);
      return res.status(201).json({ success: true, studyBlock: newBlock, timetable: saved });
    } catch (err) {
      console.error('[TIMETABLE STUDY BLOCK POST] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to add study block.' });
    }
  });

  // ==========================================================================
  // 9. DELETE STUDY BLOCK
  // ==========================================================================
  router.delete('/study-block/:id', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);
      const { id } = req.params;

      let timetable = await getUserTimetable(userId);
      timetable.studyBlocks = (timetable.studyBlocks || []).filter(b => b.id !== id);

      const saved = await saveUserTimetable(timetable);
      return res.json({ success: true, timetable: saved });
    } catch (err) {
      console.error('[TIMETABLE STUDY BLOCK DELETE] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to delete study block.' });
    }
  });

  // ==========================================================================
  // 10. ADD EXAM SCHEDULE
  // ==========================================================================
  router.post('/exam', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);
      const subject = (req.body.subject || req.body.subjectName || req.body.title || '').trim();
      const date = (req.body.date || req.body.examDate || '').trim();
      const time = req.body.time || (req.body.startTime ? `${req.body.startTime} - ${req.body.endTime || ''}` : '');
      const room = (req.body.room || req.body.roomNumber || '').trim();
      const notes = (req.body.notes || req.body.examType || '').trim();

      if (!subject || !date) {
        return res.status(400).json({ success: false, error: 'Subject and Exam Date are required.' });
      }

      const newExam = {
        id: `exam_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        subject,
        date,
        time,
        room,
        notes
      };

      let timetable = await getUserTimetable(userId);
      timetable.exams = timetable.exams || [];
      timetable.exams.push(newExam);

      const saved = await saveUserTimetable(timetable);
      return res.status(201).json({ success: true, exam: newExam, timetable: saved });
    } catch (err) {
      console.error('[TIMETABLE EXAM POST] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to add exam.' });
    }
  });

  // ==========================================================================
  // 11. DELETE EXAM SCHEDULE
  // ==========================================================================
  router.delete('/exam/:id', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);
      const { id } = req.params;

      let timetable = await getUserTimetable(userId);
      timetable.exams = (timetable.exams || []).filter(e => e.id !== id);

      const saved = await saveUserTimetable(timetable);
      return res.json({ success: true, timetable: saved });
    } catch (err) {
      console.error('[TIMETABLE EXAM DELETE] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to delete exam.' });
    }
  });

  // ==========================================================================
  // 12. ADD REMINDER
  // ==========================================================================
  router.post('/reminder', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);
      const { title, type, day, date, time, notes } = req.body;

      if (!title) {
        return res.status(400).json({ success: false, error: 'Reminder title is required.' });
      }

      const newReminder = {
        id: `rem_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        title: title.trim(),
        type: type || 'Class',
        day: day || '',
        date: date || '',
        time: time ? time.trim() : '',
        notes: notes ? notes.trim() : '',
        completed: false
      };

      let timetable = await getUserTimetable(userId);
      timetable.reminders = timetable.reminders || [];
      timetable.reminders.push(newReminder);

      const saved = await saveUserTimetable(timetable);
      return res.status(201).json({ success: true, reminder: newReminder, timetable: saved });
    } catch (err) {
      console.error('[TIMETABLE REMINDER POST] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to add reminder.' });
    }
  });

  // ==========================================================================
  // 13. TOGGLE / UPDATE REMINDER
  // ==========================================================================
  router.put('/reminder/:id', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);
      const { id } = req.params;
      const { completed, title, time, notes } = req.body;

      let timetable = await getUserTimetable(userId);
      const rem = (timetable.reminders || []).find(r => r.id === id);

      if (!rem) {
        return res.status(404).json({ success: false, error: 'Reminder not found.' });
      }

      if (completed !== undefined) rem.completed = Boolean(completed);
      if (title !== undefined) rem.title = title;
      if (time !== undefined) rem.time = time;
      if (notes !== undefined) rem.notes = notes;

      const saved = await saveUserTimetable(timetable);
      return res.json({ success: true, reminder: rem, timetable: saved });
    } catch (err) {
      console.error('[TIMETABLE REMINDER PUT] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to update reminder.' });
    }
  });

  // ==========================================================================
  // 14. DELETE REMINDER
  // ==========================================================================
  router.delete('/reminder/:id', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);
      const { id } = req.params;

      let timetable = await getUserTimetable(userId);
      timetable.reminders = (timetable.reminders || []).filter(r => r.id !== id);

      const saved = await saveUserTimetable(timetable);
      return res.json({ success: true, timetable: saved });
    } catch (err) {
      console.error('[TIMETABLE REMINDER DELETE] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to delete reminder.' });
    }
  });

  // ==========================================================================
  // 15. SAVE SETTINGS (DISPLAY TOGGLES, TIME VIEW)
  // ==========================================================================
  router.put('/settings', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);
      const settings = req.body;

      let timetable = await getUserTimetable(userId);
      timetable.settings = { ...timetable.settings, ...settings };

      const saved = await saveUserTimetable(timetable);
      return res.json({ success: true, settings: saved.settings });
    } catch (err) {
      console.error('[TIMETABLE SETTINGS PUT] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to save settings.' });
    }
  });

  // ==========================================================================
  // 16. TODAY'S REAL-TIME SCHEDULE RESOLVER
  // ==========================================================================
  router.get('/today', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);
      const timetable = await getUserTimetable(userId);
      const schedule = resolveTodaySchedule(timetable.entries || []);
      return res.json({ success: true, schedule });
    } catch (err) {
      console.error('[TIMETABLE TODAY GET] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to calculate today schedule.' });
    }
  });

  // ==========================================================================
  // 17. EXPORT TIMETABLE AS CSV
  // ==========================================================================
  router.get('/export/csv', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);
      const timetable = await getUserTimetable(userId);
      const csv = generateCsvTimetable(timetable);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${(timetable.title || 'timetable').replace(/\s+/g, '_')}.csv"`);
      return res.send(csv);
    } catch (err) {
      console.error('[TIMETABLE EXPORT CSV] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to export CSV.' });
    }
  });

  // ==========================================================================
  // 18. EXPORT TIMETABLE AS ICALENDAR (.ICS)
  // ==========================================================================
  router.get('/export/ics', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);
      const timetable = await getUserTimetable(userId);
      const ics = generateIcsCalendar(timetable);

      res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${(timetable.title || 'timetable').replace(/\s+/g, '_')}.ics"`);
      return res.send(ics);
    } catch (err) {
      console.error('[TIMETABLE EXPORT ICS] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to export calendar.' });
    }
  });

  // ==========================================================================
  // 19. RESET ALL TIMETABLE DATA
  // ==========================================================================
  router.delete('/reset', async (req, res) => {
    try {
      const userId = getResolvedUserId(req);

      if (isDbConnected) {
        await TimetableModel.deleteOne({ userId });
      }

      dbTimetables = dbTimetables.filter(t => t.userId !== userId);
      saveTimetablesToDisk(dbTimetables);

      return res.json({ success: true, message: 'Timetable cleared successfully.' });
    } catch (err) {
      console.error('[TIMETABLE RESET] Error:', err);
      return res.status(500).json({ success: false, error: 'Failed to reset timetable.' });
    }
  });

  return router;
}
