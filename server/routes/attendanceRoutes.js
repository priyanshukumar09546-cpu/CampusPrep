// ============================================================================
// PROFESSORVIRUS — ATTENDANCE CALCULATOR & TRACKER API ROUTER
// Production-ready backend with MongoDB Atlas persistence & disk fallback sync
// Strict user authorization — zero fake data
// ============================================================================

import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';
import {
  calculateAttendanceMetrics,
  calculateOverallAttendance,
  calculateTemporalAttendance
} from '../attendanceEngine.js';

// Setup file paths for persistent JSON disk storage in server/data
const IS_VERCEL = !!(process.env.VERCEL || process.env.VERCEL_ENV || process.env.VERCEL_URL);
const DATA_DIR = IS_VERCEL ? '/tmp/data' : path.resolve(process.cwd(), 'server', 'data');
const SUBJECTS_FILE = path.join(DATA_DIR, 'attendance_subjects.json');
const LECTURES_FILE = path.join(DATA_DIR, 'attendance_lectures.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {}

// ----------------------------------------------------------------------------
// MONGOOSE SCHEMAS & MODELS
// ----------------------------------------------------------------------------
const AttendanceSubjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  code: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  totalLectures: { type: Number, default: 0, min: 0 },
  attendedLectures: { type: Number, default: 0, min: 0 },
  targetPercentage: { type: Number, default: 75, min: 1, max: 100 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

AttendanceSubjectSchema.index({ userId: 1, code: 1 }, { unique: true });

const AttendanceLectureSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  subjectId: { type: String, required: true, index: true },
  subjectCode: { type: String, default: '' },
  subjectName: { type: String, default: '' },
  date: { type: String, required: true }, // ISO YYYY-MM-DD
  status: { type: String, enum: ['present', 'absent'], required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

AttendanceLectureSchema.index({ userId: 1, subjectId: 1, date: 1 });

const AttendanceSubjectModel = mongoose.models.AttendanceSubject || mongoose.model('AttendanceSubject', AttendanceSubjectSchema);
const AttendanceLectureModel = mongoose.models.AttendanceLecture || mongoose.model('AttendanceLecture', AttendanceLectureSchema);

// In-Memory Caches synced with disk
let dbSubjects = [];
let dbLectures = [];

function loadSubjectsFromDisk() {
  if (fs.existsSync(SUBJECTS_FILE)) {
    try {
      const data = fs.readFileSync(SUBJECTS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('[ATTENDANCE] Error reading subjects from disk:', e.message);
    }
  }
  return [];
}

function saveSubjectsToDisk(subjects) {
  try {
    fs.writeFileSync(SUBJECTS_FILE, JSON.stringify(subjects, null, 2), 'utf-8');
  } catch (e) {
    console.error('[ATTENDANCE] Error saving subjects to disk:', e.message);
  }
}

function loadLecturesFromDisk() {
  if (fs.existsSync(LECTURES_FILE)) {
    try {
      const data = fs.readFileSync(LECTURES_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('[ATTENDANCE] Error reading lectures from disk:', e.message);
    }
  }
  return [];
}

function saveLecturesToDisk(lectures) {
  try {
    fs.writeFileSync(LECTURES_FILE, JSON.stringify(lectures, null, 2), 'utf-8');
  } catch (e) {
    console.error('[ATTENDANCE] Error saving lectures to disk:', e.message);
  }
}

// Initial load
dbSubjects = loadSubjectsFromDisk();
dbLectures = loadLecturesFromDisk();

/**
 * Factory function to create the Attendance API Router
 */
export function createAttendanceRouter({ isDbConnected = false, verifyJwtToken = null } = {}) {
  const router = express.Router();

  // Helper to securely identify user from JWT or device token (NEVER from body)
  function getResolvedUserId(req) {
    // 1. Try Bearer JWT token
    const authHeader = req.headers['authorization'] || req.headers['x-user-token'];
    if (authHeader && verifyJwtToken) {
      const rawToken = authHeader.replace(/^Bearer\s+/i, '').trim();
      const payload = verifyJwtToken(rawToken);
      if (payload && payload.userId) {
        return payload.userId;
      }
    }

    // 2. Try device token header for persistent guest tracking
    const deviceId = req.headers['x-device-id'] || req.headers['x-guest-id'];
    if (deviceId && typeof deviceId === 'string' && deviceId.trim().length >= 4) {
      const sanitized = deviceId.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
      return `guest_${sanitized}`;
    }

    return null;
  }

  // Middleware ensuring user identity is resolved
  function requireUserId(req, res, next) {
    const userId = getResolvedUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication or persistent device session required to access attendance records.'
      });
    }
    req.attendanceUserId = userId;
    next();
  }

  // Sync with MongoDB if connected
  async function syncSubjectToDb(subject) {
    saveSubjectsToDisk(dbSubjects);
    if (isDbConnected) {
      try {
        await AttendanceSubjectModel.updateOne({ id: subject.id }, { $set: subject }, { upsert: true });
      } catch (err) {
        console.warn('[ATTENDANCE DB SYNC] Warning syncing subject:', err.message);
      }
    }
  }

  async function syncLectureToDb(lecture) {
    saveLecturesToDisk(dbLectures);
    if (isDbConnected) {
      try {
        await AttendanceLectureModel.updateOne({ id: lecture.id }, { $set: lecture }, { upsert: true });
      } catch (err) {
        console.warn('[ATTENDANCE DB SYNC] Warning syncing lecture:', err.message);
      }
    }
  }

  // --------------------------------------------------------------------------
  // 1. GET ATTENDANCE SUMMARY & DASHBOARD DATA
  // --------------------------------------------------------------------------
  router.get('/summary', requireUserId, async (req, res) => {
    try {
      const userId = req.attendanceUserId;
      const targetQuery = parseFloat(req.query.target) || 75;

      // Fetch user's subjects
      let userSubjects = dbSubjects.filter(s => s.userId === userId);
      if (userSubjects.length === 0 && isDbConnected) {
        try {
          userSubjects = await AttendanceSubjectModel.find({ userId }).lean();
          if (userSubjects.length > 0) {
            userSubjects.forEach(s => {
              if (!dbSubjects.some(d => d.id === s.id)) dbSubjects.push(s);
            });
            saveSubjectsToDisk(dbSubjects);
          }
        } catch (e) {}
      }

      // Fetch user's lectures
      let userLectures = dbLectures.filter(l => l.userId === userId);
      if (userLectures.length === 0 && isDbConnected) {
        try {
          userLectures = await AttendanceLectureModel.find({ userId }).sort({ date: -1, createdAt: -1 }).lean();
          if (userLectures.length > 0) {
            userLectures.forEach(l => {
              if (!dbLectures.some(d => d.id === l.id)) dbLectures.push(l);
            });
            saveLecturesToDisk(dbLectures);
          }
        } catch (e) {}
      }

      // Sort lectures descending by date
      userLectures.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Calculate subject-wise metrics
      const enrichedSubjects = userSubjects.map(sub => {
        const metrics = calculateAttendanceMetrics(sub.attendedLectures, sub.totalLectures, sub.targetPercentage || targetQuery);
        return {
          id: sub.id,
          code: sub.code,
          name: sub.name,
          totalLectures: sub.totalLectures,
          attendedLectures: sub.attendedLectures,
          absentLectures: Math.max(0, sub.totalLectures - sub.attendedLectures),
          targetPercentage: sub.targetPercentage || targetQuery,
          percentage: metrics.percentage,
          status: metrics.status,
          statusTone: metrics.statusTone,
          lecturesCanSkip: metrics.lecturesCanSkip,
          lecturesNeededToReachTarget: metrics.lecturesNeededToReachTarget,
          message: metrics.message,
          skipProjections: metrics.skipProjections,
          attendProjections: metrics.attendProjections
        };
      });

      // Calculate cumulative overall attendance
      const overall = calculateOverallAttendance(userSubjects, targetQuery);

      // Calculate temporal statistics
      const quickStats = calculateTemporalAttendance(userLectures);

      res.json({
        success: true,
        summary: overall,
        subjects: enrichedSubjects,
        recentLectures: userLectures.slice(0, 10),
        quickStats
      });
    } catch (err) {
      console.error('[ATTENDANCE ERROR] Summary fetch failed:', err);
      res.status(500).json({ success: false, message: 'Server error retrieving attendance summary.' });
    }
  });

  // --------------------------------------------------------------------------
  // 2. GET USER'S SUBJECTS
  // --------------------------------------------------------------------------
  router.get('/subjects', requireUserId, async (req, res) => {
    try {
      const userId = req.attendanceUserId;
      let userSubjects = dbSubjects.filter(s => s.userId === userId);

      if (userSubjects.length === 0 && isDbConnected) {
        try {
          userSubjects = await AttendanceSubjectModel.find({ userId }).lean();
        } catch (e) {}
      }

      const list = userSubjects.map(sub => {
        const metrics = calculateAttendanceMetrics(sub.attendedLectures, sub.totalLectures, sub.targetPercentage);
        return {
          id: sub.id,
          code: sub.code,
          name: sub.name,
          totalLectures: sub.totalLectures,
          attendedLectures: sub.attendedLectures,
          absentLectures: Math.max(0, sub.totalLectures - sub.attendedLectures),
          targetPercentage: sub.targetPercentage,
          percentage: metrics.percentage,
          status: metrics.status,
          statusTone: metrics.statusTone,
          lecturesCanSkip: metrics.lecturesCanSkip,
          lecturesNeededToReachTarget: metrics.lecturesNeededToReachTarget,
          message: metrics.message
        };
      });

      res.json({ success: true, subjects: list });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error retrieving subjects.' });
    }
  });

  // --------------------------------------------------------------------------
  // 3. ADD SUBJECT
  // --------------------------------------------------------------------------
  router.post('/subjects', requireUserId, async (req, res) => {
    try {
      const userId = req.attendanceUserId;
      const { code, name, targetPercentage = 75, totalLectures, attendedLectures, initialTotal, initialAttended } = req.body;

      if (!code || !name) {
        return res.status(400).json({ success: false, message: 'Subject Code and Subject Name are required.' });
      }

      const cleanCode = String(code).trim().toUpperCase();
      const cleanName = String(name).trim();

      // Check for duplicate subject code for this user
      const existing = dbSubjects.find(s => s.userId === userId && s.code.toUpperCase() === cleanCode);
      if (existing) {
        return res.status(400).json({ success: false, message: `Subject with code "${cleanCode}" already exists in your tracker.` });
      }

      const tot = Math.max(0, parseInt(totalLectures ?? initialTotal ?? 0, 10) || 0);
      const att = Math.max(0, parseInt(attendedLectures ?? initialAttended ?? 0, 10) || 0);

      if (att > tot) {
        return res.status(400).json({ success: false, message: 'Attended lectures cannot exceed total conducted lectures.' });
      }

      const target = Math.min(100, Math.max(1, parseFloat(targetPercentage) || 75));

      const newSubject = {
        id: `asub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId,
        code: cleanCode,
        name: cleanName,
        totalLectures: tot,
        attendedLectures: att,
        targetPercentage: target,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      dbSubjects.push(newSubject);
      await syncSubjectToDb(newSubject);

      const metrics = calculateAttendanceMetrics(att, tot, target);

      res.json({
        success: true,
        message: `Subject ${cleanCode} added successfully!`,
        subject: {
          ...newSubject,
          absentLectures: Math.max(0, tot - att),
          percentage: metrics.percentage,
          status: metrics.status,
          statusTone: metrics.statusTone,
          lecturesCanSkip: metrics.lecturesCanSkip,
          lecturesNeededToReachTarget: metrics.lecturesNeededToReachTarget,
          message: metrics.message
        }
      });
    } catch (err) {
      console.error('[ATTENDANCE ERROR] Failed to add subject:', err);
      res.status(500).json({ success: false, message: 'Error adding subject.' });
    }
  });

  // --------------------------------------------------------------------------
  // 4. UPDATE SUBJECT (Metadata or Bulk Totals)
  // --------------------------------------------------------------------------
  router.put('/subjects/:id', requireUserId, async (req, res) => {
    try {
      const userId = req.attendanceUserId;
      const { id } = req.params;
      const { code, name, targetPercentage, totalLectures, attendedLectures } = req.body;

      const sub = dbSubjects.find(s => s.id === id && s.userId === userId);
      if (!sub) {
        return res.status(404).json({ success: false, message: 'Subject not found or does not belong to your account.' });
      }

      if (code) {
        const cleanCode = String(code).trim().toUpperCase();
        // Check for duplicate code
        const dup = dbSubjects.find(s => s.userId === userId && s.id !== id && s.code.toUpperCase() === cleanCode);
        if (dup) {
          return res.status(400).json({ success: false, message: `Another subject already uses code "${cleanCode}".` });
        }
        sub.code = cleanCode;
      }

      if (name) sub.name = String(name).trim();
      if (targetPercentage !== undefined) {
        sub.targetPercentage = Math.min(100, Math.max(1, parseFloat(targetPercentage) || 75));
      }

      if (totalLectures !== undefined || attendedLectures !== undefined) {
        const tot = totalLectures !== undefined ? Math.max(0, parseInt(totalLectures, 10) || 0) : sub.totalLectures;
        const att = attendedLectures !== undefined ? Math.max(0, parseInt(attendedLectures, 10) || 0) : sub.attendedLectures;

        if (att > tot) {
          return res.status(400).json({ success: false, message: 'Attended lectures cannot exceed total conducted lectures.' });
        }

        sub.totalLectures = tot;
        sub.attendedLectures = att;
      }

      sub.updatedAt = new Date().toISOString();
      await syncSubjectToDb(sub);

      const metrics = calculateAttendanceMetrics(sub.attendedLectures, sub.totalLectures, sub.targetPercentage);

      res.json({
        success: true,
        message: 'Subject updated successfully!',
        subject: {
          ...sub,
          absentLectures: Math.max(0, sub.totalLectures - sub.attendedLectures),
          percentage: metrics.percentage,
          status: metrics.status,
          statusTone: metrics.statusTone,
          lecturesCanSkip: metrics.lecturesCanSkip,
          lecturesNeededToReachTarget: metrics.lecturesNeededToReachTarget,
          message: metrics.message
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error updating subject.' });
    }
  });

  // --------------------------------------------------------------------------
  // 5. DELETE SUBJECT
  // --------------------------------------------------------------------------
  router.delete('/subjects/:id', requireUserId, async (req, res) => {
    try {
      const userId = req.attendanceUserId;
      const { id } = req.params;

      const idx = dbSubjects.findIndex(s => s.id === id && s.userId === userId);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Subject not found.' });
      }

      const deletedSubject = dbSubjects.splice(idx, 1)[0];
      saveSubjectsToDisk(dbSubjects);

      // Also clean up associated lecture records
      const initialLecturesLen = dbLectures.length;
      dbLectures = dbLectures.filter(l => !(l.userId === userId && l.subjectId === id));
      if (dbLectures.length !== initialLecturesLen) {
        saveLecturesToDisk(dbLectures);
      }

      if (isDbConnected) {
        try {
          await Promise.all([
            AttendanceSubjectModel.deleteOne({ id, userId }),
            AttendanceLectureModel.deleteMany({ subjectId: id, userId })
          ]);
        } catch (e) {}
      }

      res.json({
        success: true,
        message: `Subject ${deletedSubject.code} and its lecture history have been deleted.`
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error deleting subject.' });
    }
  });

  // --------------------------------------------------------------------------
  // 6. RECORD LECTURE(S) — SINGLE OR MULTIPLE
  // --------------------------------------------------------------------------
  router.post('/lectures', requireUserId, async (req, res) => {
    try {
      const userId = req.attendanceUserId;
      const { subjectId, date, status, presentCount, absentCount } = req.body;

      if (!subjectId) {
        return res.status(400).json({ success: false, message: 'Subject selection is required.' });
      }

      const subject = dbSubjects.find(s => s.id === subjectId && s.userId === userId);
      if (!subject) {
        return res.status(404).json({ success: false, message: 'Selected subject not found in your tracker.' });
      }

      const targetDate = date ? String(date).slice(0, 10) : new Date().toISOString().slice(0, 10);

      // Mode A: Multiple lectures batch (e.g. 3 present, 1 absent)
      if (presentCount !== undefined || absentCount !== undefined) {
        const pCnt = Math.max(0, parseInt(presentCount, 10) || 0);
        const aCnt = Math.max(0, parseInt(absentCount, 10) || 0);

        if (pCnt === 0 && aCnt === 0) {
          return res.status(400).json({ success: false, message: 'Please specify at least 1 lecture to add.' });
        }

        subject.totalLectures += (pCnt + aCnt);
        subject.attendedLectures += pCnt;
        subject.updatedAt = new Date().toISOString();
        await syncSubjectToDb(subject);

        // Add records
        const newRecords = [];
        for (let i = 0; i < pCnt; i++) {
          newRecords.push({
            id: `alec_${Date.now()}_p_${Math.random().toString(36).substring(2, 6)}`,
            userId,
            subjectId: subject.id,
            subjectCode: subject.code,
            subjectName: subject.name,
            date: targetDate,
            status: 'present',
            createdAt: new Date().toISOString()
          });
        }
        for (let i = 0; i < aCnt; i++) {
          newRecords.push({
            id: `alec_${Date.now()}_a_${Math.random().toString(36).substring(2, 6)}`,
            userId,
            subjectId: subject.id,
            subjectCode: subject.code,
            subjectName: subject.name,
            date: targetDate,
            status: 'absent',
            createdAt: new Date().toISOString()
          });
        }

        dbLectures.push(...newRecords);
        saveLecturesToDisk(dbLectures);
        if (isDbConnected) {
          try { await AttendanceLectureModel.insertMany(newRecords); } catch (e) {}
        }

        const metrics = calculateAttendanceMetrics(subject.attendedLectures, subject.totalLectures, subject.targetPercentage);

        return res.json({
          success: true,
          message: `Added ${pCnt + aCnt} lectures to ${subject.code} (${pCnt} present, ${aCnt} absent).`,
          subject: {
            ...subject,
            absentLectures: Math.max(0, subject.totalLectures - subject.attendedLectures),
            percentage: metrics.percentage,
            status: metrics.status,
            lecturesCanSkip: metrics.lecturesCanSkip,
            lecturesNeededToReachTarget: metrics.lecturesNeededToReachTarget,
            message: metrics.message
          },
          addedCount: newRecords.length
        });
      }

      // Mode B: Single lecture
      const cleanStatus = String(status || 'present').toLowerCase().trim();
      if (cleanStatus !== 'present' && cleanStatus !== 'absent') {
        return res.status(400).json({ success: false, message: 'Status must be either "present" or "absent".' });
      }

      const newLecture = {
        id: `alec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId,
        subjectId: subject.id,
        subjectCode: subject.code,
        subjectName: subject.name,
        date: targetDate,
        status: cleanStatus,
        createdAt: new Date().toISOString()
      };

      // Increment subject totals
      subject.totalLectures += 1;
      if (cleanStatus === 'present') {
        subject.attendedLectures += 1;
      }
      subject.updatedAt = new Date().toISOString();

      dbLectures.push(newLecture);
      await Promise.all([
        syncSubjectToDb(subject),
        syncLectureToDb(newLecture)
      ]);

      const metrics = calculateAttendanceMetrics(subject.attendedLectures, subject.totalLectures, subject.targetPercentage);

      res.json({
        success: true,
        message: `Lecture marked as ${cleanStatus.toUpperCase()} for ${subject.code}!`,
        lecture: newLecture,
        subject: {
          ...subject,
          absentLectures: Math.max(0, subject.totalLectures - subject.attendedLectures),
          percentage: metrics.percentage,
          status: metrics.status,
          statusTone: metrics.statusTone,
          lecturesCanSkip: metrics.lecturesCanSkip,
          lecturesNeededToReachTarget: metrics.lecturesNeededToReachTarget,
          message: metrics.message
        }
      });
    } catch (err) {
      console.error('[ATTENDANCE ERROR] Failed to record lecture:', err);
      res.status(500).json({ success: false, message: 'Error recording lecture.' });
    }
  });

  // --------------------------------------------------------------------------
  // 7. GET LECTURE HISTORY
  // --------------------------------------------------------------------------
  router.get('/lectures', requireUserId, async (req, res) => {
    try {
      const userId = req.attendanceUserId;
      const { subjectId, limit = 50, page = 1 } = req.query;

      let userLectures = dbLectures.filter(l => l.userId === userId);
      if (subjectId) {
        userLectures = userLectures.filter(l => l.subjectId === subjectId);
      }

      userLectures.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const numLimit = Math.max(1, parseInt(limit, 10) || 50);
      const numPage = Math.max(1, parseInt(page, 10) || 1);
      const start = (numPage - 1) * numLimit;
      const paginated = userLectures.slice(start, start + numLimit);

      res.json({
        success: true,
        total: userLectures.length,
        page: numPage,
        limit: numLimit,
        lectures: paginated
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error retrieving lectures.' });
    }
  });

  // --------------------------------------------------------------------------
  // 8. EDIT LECTURE (e.g. Present <-> Absent)
  // --------------------------------------------------------------------------
  router.put('/lectures/:id', requireUserId, async (req, res) => {
    try {
      const userId = req.attendanceUserId;
      const { id } = req.params;
      const { status, date } = req.body;

      const lecture = dbLectures.find(l => l.id === id && l.userId === userId);
      if (!lecture) {
        return res.status(404).json({ success: false, message: 'Lecture record not found.' });
      }

      const subject = dbSubjects.find(s => s.id === lecture.subjectId && s.userId === userId);

      // If status changed, adjust subject counts
      if (status) {
        const cleanStatus = String(status).toLowerCase().trim();
        if (cleanStatus !== 'present' && cleanStatus !== 'absent') {
          return res.status(400).json({ success: false, message: 'Status must be "present" or "absent".' });
        }

        if (lecture.status !== cleanStatus && subject) {
          if (cleanStatus === 'present' && lecture.status === 'absent') {
            subject.attendedLectures = Math.min(subject.totalLectures, subject.attendedLectures + 1);
          } else if (cleanStatus === 'absent' && lecture.status === 'present') {
            subject.attendedLectures = Math.max(0, subject.attendedLectures - 1);
          }
          subject.updatedAt = new Date().toISOString();
          await syncSubjectToDb(subject);
        }
        lecture.status = cleanStatus;
      }

      if (date) {
        lecture.date = String(date).slice(0, 10);
      }

      await syncLectureToDb(lecture);

      res.json({
        success: true,
        message: 'Lecture record updated.',
        lecture,
        subject
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error updating lecture record.' });
    }
  });

  // --------------------------------------------------------------------------
  // 9. DELETE LECTURE
  // --------------------------------------------------------------------------
  router.delete('/lectures/:id', requireUserId, async (req, res) => {
    try {
      const userId = req.attendanceUserId;
      const { id } = req.params;

      const idx = dbLectures.findIndex(l => l.id === id && l.userId === userId);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Lecture record not found.' });
      }

      const deletedLecture = dbLectures.splice(idx, 1)[0];
      saveLecturesToDisk(dbLectures);

      const subject = dbSubjects.find(s => s.id === deletedLecture.subjectId && s.userId === userId);
      if (subject) {
        subject.totalLectures = Math.max(0, subject.totalLectures - 1);
        if (deletedLecture.status === 'present') {
          subject.attendedLectures = Math.max(0, subject.attendedLectures - 1);
        }
        subject.updatedAt = new Date().toISOString();
        await syncSubjectToDb(subject);
      }

      if (isDbConnected) {
        try {
          await AttendanceLectureModel.deleteOne({ id, userId });
        } catch (e) {}
      }

      res.json({
        success: true,
        message: 'Lecture record deleted.',
        subject
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error deleting lecture.' });
    }
  });

  // --------------------------------------------------------------------------
  // 10. IMPORT ATTENDANCE CSV (Section 5 & 18)
  // --------------------------------------------------------------------------
  router.post('/import', requireUserId, async (req, res) => {
    try {
      const userId = req.attendanceUserId;
      const { csvContent } = req.body;

      if (!csvContent || typeof csvContent !== 'string' || csvContent.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Please provide CSV content to import.' });
      }

      const lines = csvContent.replace(/\r/g, '').split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        return res.status(400).json({ success: false, message: 'CSV must contain a header row and at least one data row.' });
      }

      const header = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
      const dateIdx = header.findIndex(h => h.includes('date'));
      const codeIdx = header.findIndex(h => h.includes('subject') || h.includes('code'));
      const statusIdx = header.findIndex(h => h.includes('status'));

      if (dateIdx === -1 || codeIdx === -1 || statusIdx === -1) {
        return res.status(400).json({
          success: false,
          message: 'Invalid CSV format. Required headers: date,subject_code,status (e.g. 2026-09-27,BCS401,present)'
        });
      }

      const errors = [];
      const parsedRecords = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
        if (parts.length < 3) {
          errors.push(`Row ${i + 1}: Incomplete data (expected date, subject_code, status).`);
          continue;
        }

        const rawDate = parts[dateIdx];
        const rawCode = parts[codeIdx].toUpperCase();
        const rawStatus = parts[statusIdx].toLowerCase();

        // Validate date
        const parsedDate = new Date(rawDate);
        if (isNaN(parsedDate.getTime())) {
          errors.push(`Row ${i + 1}: Invalid date format "${rawDate}".`);
          continue;
        }
        const isoDate = rawDate.slice(0, 10);

        // Validate status
        if (rawStatus !== 'present' && rawStatus !== 'absent') {
          errors.push(`Row ${i + 1}: Status must be "present" or "absent" (found "${rawStatus}").`);
          continue;
        }

        parsedRecords.push({
          date: isoDate,
          code: rawCode,
          status: rawStatus,
          rowNumber: i + 1
        });
      }

      if (errors.length > 0 && parsedRecords.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'CSV validation failed with errors.',
          errors
        });
      }

      // Group records by subject code to auto-create or update subjects
      const codeToSubjectMap = new Map();
      dbSubjects.filter(s => s.userId === userId).forEach(s => {
        codeToSubjectMap.set(s.code.toUpperCase(), s);
      });

      const newSubjectsCreated = [];
      const newLecturesToInsert = [];

      for (const rec of parsedRecords) {
        let subject = codeToSubjectMap.get(rec.code);
        if (!subject) {
          // Auto-create subject if it doesn't exist
          subject = {
            id: `asub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            userId,
            code: rec.code,
            name: rec.code,
            totalLectures: 0,
            attendedLectures: 0,
            targetPercentage: 75,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          dbSubjects.push(subject);
          codeToSubjectMap.set(rec.code, subject);
          newSubjectsCreated.push(subject);
        }

        subject.totalLectures += 1;
        if (rec.status === 'present') {
          subject.attendedLectures += 1;
        }
        subject.updatedAt = new Date().toISOString();

        newLecturesToInsert.push({
          id: `alec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          userId,
          subjectId: subject.id,
          subjectCode: subject.code,
          subjectName: subject.name,
          date: rec.date,
          status: rec.status,
          createdAt: new Date().toISOString()
        });
      }

      dbLectures.push(...newLecturesToInsert);

      // Save to disk
      saveSubjectsToDisk(dbSubjects);
      saveLecturesToDisk(dbLectures);

      // Save to MongoDB if connected
      if (isDbConnected) {
        try {
          if (newSubjectsCreated.length > 0) {
            await AttendanceSubjectModel.insertMany(newSubjectsCreated);
          }
          for (const s of codeToSubjectMap.values()) {
            await AttendanceSubjectModel.updateOne({ id: s.id }, { $set: s }, { upsert: true });
          }
          if (newLecturesToInsert.length > 0) {
            await AttendanceLectureModel.insertMany(newLecturesToInsert);
          }
        } catch (e) {}
      }

      res.json({
        success: true,
        message: `Successfully imported ${newLecturesToInsert.length} attendance records across ${codeToSubjectMap.size} subjects!`,
        importedCount: newLecturesToInsert.length,
        subjectsCreated: newSubjectsCreated.length,
        warnings: errors.length > 0 ? errors : undefined
      });
    } catch (err) {
      console.error('[ATTENDANCE ERROR] CSV import failed:', err);
      res.status(500).json({ success: false, message: 'Error importing CSV data.' });
    }
  });

  // --------------------------------------------------------------------------
  // 11. EXPORT ATTENDANCE CSV (Section 18)
  // --------------------------------------------------------------------------
  router.get('/export', requireUserId, async (req, res) => {
    try {
      const userId = req.attendanceUserId;
      const userLectures = dbLectures.filter(l => l.userId === userId);

      userLectures.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      let csvText = 'date,subject_code,subject_name,status\n';
      userLectures.forEach(l => {
        csvText += `"${l.date}","${l.subjectCode || ''}","${(l.subjectName || '').replace(/"/g, '""')}","${l.status}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="attendance_export.csv"');
      res.send(csvText);
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error exporting attendance CSV.' });
    }
  });

  // --------------------------------------------------------------------------
  // 12. RESET ATTENDANCE (Section 17)
  // --------------------------------------------------------------------------
  router.post('/reset', requireUserId, async (req, res) => {
    try {
      const userId = req.attendanceUserId;
      const { subjectId, all } = req.body;

      if (subjectId) {
        // Reset single subject's lectures and reset totals to 0
        const sub = dbSubjects.find(s => s.id === subjectId && s.userId === userId);
        if (!sub) return res.status(404).json({ success: false, message: 'Subject not found.' });

        sub.totalLectures = 0;
        sub.attendedLectures = 0;
        sub.updatedAt = new Date().toISOString();
        dbLectures = dbLectures.filter(l => !(l.userId === userId && l.subjectId === subjectId));

        saveSubjectsToDisk(dbSubjects);
        saveLecturesToDisk(dbLectures);

        if (isDbConnected) {
          try {
            await Promise.all([
              AttendanceSubjectModel.updateOne({ id: subjectId }, { $set: sub }),
              AttendanceLectureModel.deleteMany({ subjectId, userId })
            ]);
          } catch (e) {}
        }

        return res.json({ success: true, message: `Reset attendance for ${sub.code} to 0.` });
      }

      if (all) {
        // Reset all attendance for this student
        dbSubjects = dbSubjects.filter(s => s.userId !== userId);
        dbLectures = dbLectures.filter(l => l.userId !== userId);

        saveSubjectsToDisk(dbSubjects);
        saveLecturesToDisk(dbLectures);

        if (isDbConnected) {
          try {
            await Promise.all([
              AttendanceSubjectModel.deleteMany({ userId }),
              AttendanceLectureModel.deleteMany({ userId })
            ]);
          } catch (e) {}
        }

        return res.json({ success: true, message: 'All attendance records and subjects have been reset.' });
      }

      res.status(400).json({ success: false, message: 'Please specify subjectId or all: true.' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error resetting attendance.' });
    }
  });

  return router;
}
