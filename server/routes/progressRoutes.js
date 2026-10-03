// ============================================================================
// PROFESSORVIRUS — STUDENT PROGRESS & ANALYTICS API ROUTER
// Real activity tracking, study sessions, goals, achievements, streak system
// Zero fake data — every metric calculated from actual user records
// ============================================================================

import express from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';

// ============================================================================
// MONGOOSE SCHEMAS & MODELS
// ============================================================================

// STUDY SESSION — real timed study sessions with idle detection
const StudySessionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  startedAt: { type: Date, required: true },
  endedAt: { type: Date, default: null },
  durationMinutes: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'completed', 'paused', 'expired'], default: 'active' },
  subject: { type: String, default: '' },
  course: { type: String, default: '' },
  idleDetected: { type: Boolean, default: false }
}, { timestamps: true });
StudySessionSchema.index({ userId: 1, startedAt: -1 });
StudySessionSchema.index({ userId: 1, status: 1 });

// ACTIVITY EVENT — centralized event log for all trackable actions
const ActivityEventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  type: {
    type: String,
    required: true,
    enum: [
      'NOTE_VIEWED', 'NOTE_COMPLETED', 'NOTE_BOOKMARKED', 'NOTE_DOWNLOADED',
      'PYQ_OPENED', 'PYQ_ATTEMPTED', 'PYQ_SOLVED',
      'QUIZ_STARTED', 'QUIZ_COMPLETED',
      'STUDY_SESSION_COMPLETED',
      'TOPIC_COMPLETED', 'SYLLABUS_UNIT_COMPLETED',
      'INTERVIEW_ROUND_COMPLETED',
      'GOAL_CREATED', 'GOAL_COMPLETED',
      'SEARCH_PERFORMED'
    ]
  },
  entityId: { type: String, default: '' },     // noteId, pyqId, quizId, etc.
  entityName: { type: String, default: '' },   // "Data Structures Notes", "OS 2024 PYQ"
  entityType: { type: String, default: '' },   // 'note', 'pyq', 'quiz', 'topic', etc.
  course: { type: String, default: '' },
  branch: { type: String, default: '' },
  subject: { type: String, default: '' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  // For quiz: { score, totalMarks, correct, incorrect, skipped, durationSeconds }
  // For study session: { durationMinutes }
  // For topic: { unitName, chapterName }
  date: { type: String, required: true },       // YYYY-MM-DD for streak/daily calc
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });
ActivityEventSchema.index({ userId: 1, date: -1 });
ActivityEventSchema.index({ userId: 1, type: 1 });
ActivityEventSchema.index({ userId: 1, entityId: 1, type: 1 });

// GOAL — user-created study targets
const GoalSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, enum: ['daily', 'weekly', 'subject', 'pyq', 'quiz', 'study-time', 'custom'], default: 'custom' },
  targetValue: { type: Number, default: 1 },
  currentValue: { type: Number, default: 0 },
  unit: { type: String, default: '' },           // 'minutes', 'notes', 'pyqs', 'quizzes', 'topics'
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date, default: null },
  completedAt: { type: Date, default: null },
  status: { type: String, enum: ['active', 'completed', 'expired', 'deleted'], default: 'active' },
  course: { type: String, default: '' },
  subject: { type: String, default: '' }
}, { timestamps: true });
GoalSchema.index({ userId: 1, status: 1 });

// ACHIEVEMENT — unlocked achievements based on real rules
const AchievementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  odaId: { type: String, required: true },       // definition key e.g. 'FIRST_NOTE'
  userId: { type: String, required: true, index: true },
  unlockedAt: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });
AchievementSchema.index({ userId: 1, odaId: 1 }, { unique: true });

// NOTE ACTIVITY — per-user per-note read tracking (dedup)
const NoteActivitySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  noteId: { type: String, required: true },
  noteName: { type: String, default: '' },
  subject: { type: String, default: '' },
  course: { type: String, default: '' },
  firstViewedAt: { type: Date, default: Date.now },
  lastViewedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
  viewCount: { type: Number, default: 1 },
  readStatus: { type: String, enum: ['viewed', 'reading', 'completed'], default: 'viewed' }
}, { timestamps: true });
NoteActivitySchema.index({ userId: 1, noteId: 1 }, { unique: true });

// PYQ ACTIVITY — per-user per-pyq solve tracking
const PYQActivitySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  pyqId: { type: String, required: true },
  pyqName: { type: String, default: '' },
  subject: { type: String, default: '' },
  course: { type: String, default: '' },
  year: { type: String, default: '' },
  firstOpenedAt: { type: Date, default: Date.now },
  solvedAt: { type: Date, default: null },
  status: { type: String, enum: ['opened', 'attempted', 'solved'], default: 'opened' }
}, { timestamps: true });
PYQActivitySchema.index({ userId: 1, pyqId: 1 }, { unique: true });

// QUIZ ATTEMPT — individual quiz submissions
const QuizAttemptSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  quizId: { type: String, required: true },
  quizName: { type: String, default: '' },
  subject: { type: String, default: '' },
  course: { type: String, default: '' },
  startedAt: { type: Date, default: Date.now },
  submittedAt: { type: Date, default: null },
  score: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  correct: { type: Number, default: 0 },
  incorrect: { type: Number, default: 0 },
  skipped: { type: Number, default: 0 },
  durationSeconds: { type: Number, default: 0 },
  status: { type: String, enum: ['started', 'completed', 'abandoned'], default: 'started' }
}, { timestamps: true });
QuizAttemptSchema.index({ userId: 1, quizId: 1, startedAt: -1 });

// TOPIC PROGRESS — per-user per-topic completion
const TopicProgressSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  topicId: { type: String, required: true },
  topicName: { type: String, default: '' },
  unitName: { type: String, default: '' },
  subject: { type: String, default: '' },
  course: { type: String, default: '' },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  completedAt: { type: Date, default: null }
}, { timestamps: true });
TopicProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });

// Register models
const StudySessionModel = mongoose.models.StudySession || mongoose.model('StudySession', StudySessionSchema);
const ActivityEventModel = mongoose.models.ActivityEvent || mongoose.model('ActivityEvent', ActivityEventSchema);
const GoalModel = mongoose.models.Goal || mongoose.model('Goal', GoalSchema);
const AchievementModel = mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);
const NoteActivityModel = mongoose.models.NoteActivity || mongoose.model('NoteActivity', NoteActivitySchema);
const PYQActivityModel = mongoose.models.PYQActivity || mongoose.model('PYQActivity', PYQActivitySchema);
const QuizAttemptModel = mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', QuizAttemptSchema);
const TopicProgressModel = mongoose.models.TopicProgress || mongoose.model('TopicProgress', TopicProgressSchema);

// ============================================================================
// ACHIEVEMENT DEFINITIONS — deterministic rules
// ============================================================================
const ACHIEVEMENT_DEFS = [
  { id: 'FIRST_NOTE', title: 'First Note Read', description: 'Read your first note', icon: '📖', condition: (s) => s.notesRead >= 1 },
  { id: 'FIRST_PYQ', title: 'First PYQ Solved', description: 'Solved your first PYQ', icon: '📝', condition: (s) => s.pyqsSolved >= 1 },
  { id: 'FIRST_QUIZ', title: 'First Quiz Completed', description: 'Completed your first quiz', icon: '✅', condition: (s) => s.quizAttempts >= 1 },
  { id: 'FIRST_SESSION', title: 'First Study Session', description: 'Completed your first study session', icon: '⏱️', condition: (s) => s.studySessions >= 1 },
  { id: 'STREAK_3', title: '3-Day Streak', description: 'Studied 3 consecutive days', icon: '🔥', condition: (s) => s.currentStreak >= 3 || s.longestStreak >= 3 },
  { id: 'STREAK_7', title: '7-Day Streak', description: 'Studied 7 consecutive days', icon: '🔥', condition: (s) => s.currentStreak >= 7 || s.longestStreak >= 7 },
  { id: 'STREAK_14', title: '14-Day Streak', description: 'Studied 14 consecutive days', icon: '🏆', condition: (s) => s.currentStreak >= 14 || s.longestStreak >= 14 },
  { id: 'STREAK_30', title: '30-Day Streak', description: 'Studied 30 consecutive days', icon: '👑', condition: (s) => s.currentStreak >= 30 || s.longestStreak >= 30 },
  { id: 'NOTES_10', title: '10 Notes Read', description: 'Read 10 different notes', icon: '📚', condition: (s) => s.notesRead >= 10 },
  { id: 'NOTES_50', title: '50 Notes Read', description: 'Read 50 different notes', icon: '📚', condition: (s) => s.notesRead >= 50 },
  { id: 'PYQ_10', title: '10 PYQs Solved', description: 'Solved 10 PYQs', icon: '📄', condition: (s) => s.pyqsSolved >= 10 },
  { id: 'PYQ_50', title: '50 PYQs Solved', description: 'Solved 50 PYQs', icon: '📄', condition: (s) => s.pyqsSolved >= 50 },
  { id: 'PYQ_100', title: '100 PYQs Solved', description: 'Solved 100 PYQs', icon: '🏅', condition: (s) => s.pyqsSolved >= 100 },
  { id: 'QUIZ_10', title: '10 Quizzes Completed', description: 'Completed 10 quizzes', icon: '🎯', condition: (s) => s.quizAttempts >= 10 },
  { id: 'STUDY_5H', title: '5 Hours Studied', description: 'Studied for 5 total hours', icon: '⏰', condition: (s) => s.totalStudyMinutes >= 300 },
  { id: 'STUDY_24H', title: '24 Hours Studied', description: 'Studied for 24 total hours', icon: '🌟', condition: (s) => s.totalStudyMinutes >= 1440 },
  { id: 'STUDY_100H', title: '100 Hours Studied', description: 'Studied for 100 total hours', icon: '💎', condition: (s) => s.totalStudyMinutes >= 6000 },
  { id: 'FIRST_GOAL', title: 'Goal Setter', description: 'Created your first study goal', icon: '🎯', condition: (s) => s.goalsCreated >= 1 },
  { id: 'GOAL_5', title: 'Goal Crusher', description: 'Completed 5 goals', icon: '🏆', condition: (s) => s.goalsCompleted >= 5 },
  { id: 'TOPIC_10', title: '10 Topics Mastered', description: 'Completed 10 syllabus topics', icon: '📋', condition: (s) => s.topicsCompleted >= 10 },
];

// ============================================================================
// HELPER: Get user's local date string (ISO YYYY-MM-DD)
// ============================================================================
function getDateString(date, tzOffset = 330) {
  // tzOffset in minutes from UTC (IST = +330)
  const d = new Date(date);
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const local = new Date(utc + tzOffset * 60000);
  return local.toISOString().split('T')[0];
}

function todayString(tzOffset = 330) {
  return getDateString(new Date(), tzOffset);
}

// ============================================================================
// HELPER: Calculate streak from activity dates
// ============================================================================
function calculateStreak(activityDates, tzOffset = 330) {
  if (!activityDates || activityDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
  }
  // Get unique sorted dates descending
  const uniqueDates = [...new Set(activityDates)].sort().reverse();
  const today = todayString(tzOffset);
  const yesterday = getDateString(new Date(Date.now() - 86400000), tzOffset);

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  // Calculate current streak (from today or yesterday backwards)
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = new Date(uniqueDates[i - 1]);
      const curr = new Date(uniqueDates[i]);
      const diffDays = Math.round((prev - curr) / 86400000);
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  const sortedAsc = [...uniqueDates].sort();
  tempStreak = 1;
  longestStreak = 1;
  for (let i = 1; i < sortedAsc.length; i++) {
    const prev = new Date(sortedAsc[i - 1]);
    const curr = new Date(sortedAsc[i]);
    const diffDays = Math.round((curr - prev) / 86400000);
    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  if (uniqueDates.length === 1) longestStreak = 1;

  return {
    currentStreak,
    longestStreak,
    lastActiveDate: uniqueDates[0]
  };
}

// ============================================================================
// CREATE ROUTER
// ============================================================================
export function createProgressRouter({ verifyJwtToken }) {
  const router = express.Router();

  // Auth middleware
  const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['x-user-token'];
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    const rawToken = authHeader.replace('Bearer ', '').trim();
    const payload = verifyJwtToken(rawToken);
    if (!payload || !payload.userId) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
    req.user = payload;
    next();
  };

  // Optional auth — allows guest access with limited functionality
  const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['x-user-token'];
    if (authHeader) {
      const rawToken = authHeader.replace('Bearer ', '').trim();
      const payload = verifyJwtToken(rawToken);
      if (payload && payload.userId) {
        req.user = payload;
      }
    }
    next();
  };

  // ========================================================================
  // GET /api/progress/summary — Full dashboard summary
  // ========================================================================
  router.get('/summary', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const tzOffset = parseInt(req.query.tz) || 330;
      const today = todayString(tzOffset);

      // Parallel queries for all metrics
      const [
        studySessions,
        noteActivities,
        pyqActivities,
        quizAttempts,
        topicProgress,
        goals,
        achievements,
        recentEvents
      ] = await Promise.all([
        StudySessionModel.find({ userId, status: 'completed' }).sort({ endedAt: -1 }).lean(),
        NoteActivityModel.find({ userId }).lean(),
        PYQActivityModel.find({ userId }).lean(),
        QuizAttemptModel.find({ userId, status: 'completed' }).sort({ submittedAt: -1 }).lean(),
        TopicProgressModel.find({ userId }).lean(),
        GoalModel.find({ userId, status: { $ne: 'deleted' } }).sort({ createdAt: -1 }).lean(),
        AchievementModel.find({ userId }).lean(),
        ActivityEventModel.find({ userId }).sort({ timestamp: -1 }).limit(20).lean()
      ]);

      // Study time
      const totalStudyMinutes = studySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

      // Notes
      const notesRead = noteActivities.filter(n => n.readStatus === 'completed' || n.readStatus === 'reading').length;
      const notesCompleted = noteActivities.filter(n => n.readStatus === 'completed').length;

      // PYQs
      const pyqsSolved = pyqActivities.filter(p => p.status === 'solved').length;
      const pyqsAttempted = pyqActivities.filter(p => p.status === 'attempted' || p.status === 'solved').length;

      // Quizzes
      const quizAttemptsCount = quizAttempts.length;
      const quizScores = quizAttempts.filter(q => q.totalMarks > 0).map(q => (q.score / q.totalMarks) * 100);
      const avgQuizScore = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0;
      const bestQuizScore = quizScores.length > 0 ? Math.round(Math.max(...quizScores)) : 0;

      // Topics
      const topicsCompleted = topicProgress.filter(t => t.status === 'completed').length;
      const topicsInProgress = topicProgress.filter(t => t.status === 'in_progress').length;
      const topicsNotStarted = topicProgress.filter(t => t.status === 'not_started').length;
      const totalTopics = topicProgress.length;

      // Goals
      const goalsCreated = goals.length;
      const goalsCompleted = goals.filter(g => g.status === 'completed').length;
      const activeGoals = goals.filter(g => g.status === 'active');

      // Streak — qualifying events for streak
      const qualifyingTypes = [
        'NOTE_COMPLETED', 'NOTE_VIEWED',
        'PYQ_SOLVED', 'PYQ_ATTEMPTED',
        'QUIZ_COMPLETED',
        'STUDY_SESSION_COMPLETED',
        'TOPIC_COMPLETED',
        'GOAL_COMPLETED'
      ];
      const allQualifyingEvents = await ActivityEventModel.find({
        userId,
        type: { $in: qualifyingTypes }
      }).select('date').lean();
      const activityDates = allQualifyingEvents.map(e => e.date);
      const streak = calculateStreak(activityDates, tzOffset);

      // Comparison — this week vs last week
      const nowMs = Date.now();
      const weekAgoMs = nowMs - 7 * 86400000;
      const twoWeeksAgoMs = nowMs - 14 * 86400000;
      const thisWeekSessions = studySessions.filter(s => s.endedAt && new Date(s.endedAt).getTime() > weekAgoMs);
      const lastWeekSessions = studySessions.filter(s => s.endedAt && new Date(s.endedAt).getTime() > twoWeeksAgoMs && new Date(s.endedAt).getTime() <= weekAgoMs);
      const thisWeekMinutes = thisWeekSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
      const lastWeekMinutes = lastWeekSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
      const studyTimeChange = lastWeekMinutes > 0 ? Math.round(((thisWeekMinutes - lastWeekMinutes) / lastWeekMinutes) * 100) : null;

      // Subject-wise progress
      const subjectMap = {};
      topicProgress.forEach(t => {
        const subj = t.subject || 'Unknown';
        if (!subjectMap[subj]) subjectMap[subj] = { completed: 0, total: 0, inProgress: 0 };
        subjectMap[subj].total++;
        if (t.status === 'completed') subjectMap[subj].completed++;
        if (t.status === 'in_progress') subjectMap[subj].inProgress++;
      });

      // Achievement check and unlock
      const stats = {
        notesRead,
        pyqsSolved,
        quizAttempts: quizAttemptsCount,
        studySessions: studySessions.length,
        totalStudyMinutes,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        goalsCreated,
        goalsCompleted,
        topicsCompleted
      };

      const unlockedIds = new Set(achievements.map(a => a.odaId));
      const newlyUnlocked = [];
      for (const def of ACHIEVEMENT_DEFS) {
        if (!unlockedIds.has(def.id) && def.condition(stats)) {
          const ach = new AchievementModel({
            id: `ach-${userId}-${def.id}-${Date.now()}`,
            odaId: def.id,
            userId,
            unlockedAt: new Date()
          });
          try {
            await ach.save();
            newlyUnlocked.push(def.id);
            unlockedIds.add(def.id);
          } catch (e) {
            // Already exists (race condition)
          }
        }
      }

      const allAchievements = ACHIEVEMENT_DEFS.map(def => ({
        ...def,
        unlocked: unlockedIds.has(def.id),
        unlockedAt: achievements.find(a => a.odaId === def.id)?.unlockedAt || null
      }));

      res.json({
        success: true,
        summary: {
          totalStudyMinutes,
          totalStudyFormatted: formatMinutes(totalStudyMinutes),
          notesRead,
          notesCompleted,
          totalNotes: noteActivities.length,
          pyqsSolved,
          pyqsAttempted,
          quizAttempts: quizAttemptsCount,
          avgQuizScore,
          bestQuizScore,
          topicsCompleted,
          topicsInProgress,
          topicsNotStarted,
          totalTopics,
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          lastActiveDate: streak.lastActiveDate,
          goalsCreated,
          goalsCompleted,
          activeGoals: activeGoals.length,
          studyTimeChange,
          thisWeekMinutes,
          lastWeekMinutes
        },
        subjectProgress: subjectMap,
        recentActivity: recentEvents.map(e => ({
          id: e.id,
          type: e.type,
          entityName: e.entityName,
          subject: e.subject,
          metadata: e.metadata,
          date: e.date,
          timestamp: e.timestamp
        })),
        goals: goals.slice(0, 10).map(g => ({
          id: g.id,
          title: g.title,
          description: g.description,
          category: g.category,
          targetValue: g.targetValue,
          currentValue: g.currentValue,
          unit: g.unit,
          priority: g.priority,
          dueDate: g.dueDate,
          status: g.status,
          completedAt: g.completedAt,
          createdAt: g.createdAt
        })),
        achievements: allAchievements,
        newlyUnlocked,
        streak
      });
    } catch (err) {
      console.error('[PROGRESS SUMMARY ERROR]', err.message);
      res.status(500).json({ success: false, message: 'Failed to load progress data.' });
    }
  });

  // ========================================================================
  // GET /api/progress/study-time — Study time trend data
  // ========================================================================
  router.get('/study-time', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const days = parseInt(req.query.days) || 14;
      const tzOffset = parseInt(req.query.tz) || 330;

      const startDate = new Date(Date.now() - days * 86400000);
      const sessions = await StudySessionModel.find({
        userId,
        status: 'completed',
        endedAt: { $gte: startDate }
      }).lean();

      // Aggregate by date
      const dailyMap = {};
      for (let i = 0; i < days; i++) {
        const d = getDateString(new Date(Date.now() - i * 86400000), tzOffset);
        dailyMap[d] = 0;
      }
      sessions.forEach(s => {
        const d = getDateString(s.endedAt || s.startedAt, tzOffset);
        if (dailyMap[d] !== undefined) {
          dailyMap[d] += s.durationMinutes || 0;
        }
      });

      const trend = Object.entries(dailyMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, minutes]) => ({ date, minutes }));

      res.json({ success: true, trend, totalMinutes: sessions.reduce((s, ss) => s + (ss.durationMinutes || 0), 0) });
    } catch (err) {
      console.error('[STUDY TIME TREND ERROR]', err.message);
      res.status(500).json({ success: false, message: 'Failed to load study time data.' });
    }
  });

  // ========================================================================
  // POST /api/progress/study-session/start — Start a study session
  // ========================================================================
  router.post('/study-session/start', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const { subject, course } = req.body;

      // End any existing active session
      await StudySessionModel.updateMany(
        { userId, status: 'active' },
        { $set: { status: 'expired', endedAt: new Date() } }
      );

      const session = new StudySessionModel({
        id: `ss-${userId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
        userId,
        startedAt: new Date(),
        status: 'active',
        subject: subject || '',
        course: course || ''
      });
      await session.save();

      res.json({ success: true, session: { id: session.id, startedAt: session.startedAt, status: 'active' } });
    } catch (err) {
      console.error('[START SESSION ERROR]', err.message);
      res.status(500).json({ success: false, message: 'Failed to start study session.' });
    }
  });

  // ========================================================================
  // POST /api/progress/study-session/stop — Stop active study session
  // ========================================================================
  router.post('/study-session/stop', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const { sessionId, idleDetected } = req.body;
      const tzOffset = parseInt(req.body.tz) || 330;

      const query = sessionId
        ? { id: sessionId, userId, status: 'active' }
        : { userId, status: 'active' };

      const session = await StudySessionModel.findOne(query);
      if (!session) {
        return res.status(404).json({ success: false, message: 'No active study session found.' });
      }

      const endedAt = new Date();
      const durationMs = endedAt.getTime() - new Date(session.startedAt).getTime();
      let durationMinutes = Math.max(0, Math.round(durationMs / 60000));

      // Cap at 8 hours max per session to prevent runaway sessions
      if (durationMinutes > 480) durationMinutes = 480;

      session.endedAt = endedAt;
      session.durationMinutes = durationMinutes;
      session.status = 'completed';
      session.idleDetected = !!idleDetected;
      await session.save();

      // Log activity event
      if (durationMinutes >= 1) {
        const event = new ActivityEventModel({
          id: `evt-${userId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
          userId,
          type: 'STUDY_SESSION_COMPLETED',
          entityId: session.id,
          entityName: session.subject ? `${session.subject} Study Session` : 'Study Session',
          entityType: 'study_session',
          subject: session.subject,
          course: session.course,
          metadata: { durationMinutes },
          date: getDateString(endedAt, tzOffset),
          timestamp: endedAt
        });
        await event.save();
      }

      res.json({
        success: true,
        session: {
          id: session.id,
          startedAt: session.startedAt,
          endedAt,
          durationMinutes,
          status: 'completed'
        }
      });
    } catch (err) {
      console.error('[STOP SESSION ERROR]', err.message);
      res.status(500).json({ success: false, message: 'Failed to stop study session.' });
    }
  });

  // ========================================================================
  // GET /api/progress/study-session/active — Get current active session
  // ========================================================================
  router.get('/study-session/active', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const session = await StudySessionModel.findOne({ userId, status: 'active' }).lean();

      // Auto-expire sessions older than 8 hours
      if (session) {
        const age = Date.now() - new Date(session.startedAt).getTime();
        if (age > 8 * 3600000) {
          await StudySessionModel.updateOne({ id: session.id }, {
            $set: { status: 'expired', endedAt: new Date(new Date(session.startedAt).getTime() + 8 * 3600000), durationMinutes: 480 }
          });
          return res.json({ success: true, session: null });
        }
      }

      res.json({ success: true, session: session ? { id: session.id, startedAt: session.startedAt, status: session.status, subject: session.subject } : null });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to check active session.' });
    }
  });

  // ========================================================================
  // POST /api/progress/activity — Log an activity event
  // ========================================================================
  router.post('/activity', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const { type, entityId, entityName, entityType, course, branch, subject, metadata } = req.body;
      const tzOffset = parseInt(req.body.tz) || 330;

      if (!type) {
        return res.status(400).json({ success: false, message: 'Activity type is required.' });
      }

      const date = getDateString(new Date(), tzOffset);

      // Dedup protection: For note/pyq views, check if same event was logged in last 5 minutes
      if (['NOTE_VIEWED', 'PYQ_OPENED'].includes(type) && entityId) {
        const fiveMinAgo = new Date(Date.now() - 5 * 60000);
        const existing = await ActivityEventModel.findOne({
          userId, type, entityId, timestamp: { $gte: fiveMinAgo }
        });
        if (existing) {
          return res.json({ success: true, deduplicated: true, eventId: existing.id });
        }
      }

      const event = new ActivityEventModel({
        id: `evt-${userId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
        userId,
        type,
        entityId: entityId || '',
        entityName: entityName || '',
        entityType: entityType || '',
        course: course || '',
        branch: branch || '',
        subject: subject || '',
        metadata: metadata || {},
        date,
        timestamp: new Date()
      });
      await event.save();

      // Side-effects based on activity type
      if (type === 'NOTE_VIEWED' && entityId) {
        await NoteActivityModel.findOneAndUpdate(
          { userId, noteId: entityId },
          {
            $setOnInsert: {
              id: `na-${userId}-${entityId}-${Date.now()}`,
              firstViewedAt: new Date(),
              readStatus: 'viewed'
            },
            $set: { lastViewedAt: new Date(), noteName: entityName || '', subject: subject || '', course: course || '' },
            $inc: { viewCount: 1 }
          },
          { upsert: true, new: true }
        );
      }

      if (type === 'NOTE_COMPLETED' && entityId) {
        await NoteActivityModel.findOneAndUpdate(
          { userId, noteId: entityId },
          {
            $setOnInsert: {
              id: `na-${userId}-${entityId}-${Date.now()}`,
              firstViewedAt: new Date()
            },
            $set: {
              lastViewedAt: new Date(),
              completedAt: new Date(),
              readStatus: 'completed',
              noteName: entityName || '',
              subject: subject || '',
              course: course || ''
            }
          },
          { upsert: true, new: true }
        );
      }

      if (['PYQ_OPENED', 'PYQ_ATTEMPTED', 'PYQ_SOLVED'].includes(type) && entityId) {
        const statusMap = { PYQ_OPENED: 'opened', PYQ_ATTEMPTED: 'attempted', PYQ_SOLVED: 'solved' };
        const newStatus = statusMap[type];
        const existing = await PYQActivityModel.findOne({ userId, pyqId: entityId });
        const statusOrder = { opened: 0, attempted: 1, solved: 2 };
        if (!existing || statusOrder[newStatus] > statusOrder[existing.status]) {
          await PYQActivityModel.findOneAndUpdate(
            { userId, pyqId: entityId },
            {
              $setOnInsert: {
                id: `pa-${userId}-${entityId}-${Date.now()}`,
                firstOpenedAt: new Date()
              },
              $set: {
                status: newStatus,
                pyqName: entityName || existing?.pyqName || '',
                subject: subject || existing?.subject || '',
                course: course || existing?.course || '',
                ...(newStatus === 'solved' ? { solvedAt: new Date() } : {})
              }
            },
            { upsert: true, new: true }
          );
        }
      }

      if (type === 'QUIZ_COMPLETED' && metadata) {
        const attempt = new QuizAttemptModel({
          id: `qa-${userId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
          userId,
          quizId: entityId || `quiz-${Date.now()}`,
          quizName: entityName || '',
          subject: subject || '',
          course: course || '',
          startedAt: metadata.startedAt ? new Date(metadata.startedAt) : new Date(),
          submittedAt: new Date(),
          score: metadata.score || 0,
          totalMarks: metadata.totalMarks || 0,
          correct: metadata.correct || 0,
          incorrect: metadata.incorrect || 0,
          skipped: metadata.skipped || 0,
          durationSeconds: metadata.durationSeconds || 0,
          status: 'completed'
        });
        await attempt.save();
      }

      if (type === 'TOPIC_COMPLETED' && entityId) {
        await TopicProgressModel.findOneAndUpdate(
          { userId, topicId: entityId },
          {
            $setOnInsert: { id: `tp-${userId}-${entityId}-${Date.now()}` },
            $set: {
              status: 'completed',
              completedAt: new Date(),
              topicName: entityName || '',
              unitName: metadata?.unitName || '',
              subject: subject || '',
              course: course || ''
            }
          },
          { upsert: true, new: true }
        );
      }

      res.json({ success: true, eventId: event.id });
    } catch (err) {
      console.error('[ACTIVITY LOG ERROR]', err.message);
      res.status(500).json({ success: false, message: 'Failed to log activity.' });
    }
  });

  // ========================================================================
  // GET /api/progress/activity — Get recent activity feed
  // ========================================================================
  router.get('/activity', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const limit = Math.min(parseInt(req.query.limit) || 20, 100);
      const offset = parseInt(req.query.offset) || 0;

      const events = await ActivityEventModel.find({ userId })
        .sort({ timestamp: -1 })
        .skip(offset)
        .limit(limit)
        .lean();

      const total = await ActivityEventModel.countDocuments({ userId });

      res.json({ success: true, events, total, limit, offset });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to load activity.' });
    }
  });

  // ========================================================================
  // POST /api/progress/goals — Create a goal
  // ========================================================================
  router.post('/goals', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const { title, description, category, targetValue, unit, priority, dueDate, course, subject } = req.body;
      const tzOffset = parseInt(req.body.tz) || 330;

      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: 'Goal title is required.' });
      }

      const goal = new GoalModel({
        id: `goal-${userId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
        userId,
        title: title.trim(),
        description: (description || '').trim(),
        category: category || 'custom',
        targetValue: targetValue || 1,
        unit: unit || '',
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        course: course || '',
        subject: subject || ''
      });
      await goal.save();

      // Log event
      const event = new ActivityEventModel({
        id: `evt-${userId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
        userId,
        type: 'GOAL_CREATED',
        entityId: goal.id,
        entityName: title.trim(),
        entityType: 'goal',
        date: todayString(tzOffset),
        timestamp: new Date()
      });
      await event.save();

      res.json({ success: true, goal });
    } catch (err) {
      console.error('[CREATE GOAL ERROR]', err.message);
      res.status(500).json({ success: false, message: 'Failed to create goal.' });
    }
  });

  // ========================================================================
  // PATCH /api/progress/goals/:id — Update goal (progress / complete / delete)
  // ========================================================================
  router.patch('/goals/:id', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const goalId = req.params.id;
      const { currentValue, status, title, description, priority, dueDate } = req.body;
      const tzOffset = parseInt(req.body.tz) || 330;

      const goal = await GoalModel.findOne({ id: goalId, userId });
      if (!goal) {
        return res.status(404).json({ success: false, message: 'Goal not found.' });
      }

      if (currentValue !== undefined) goal.currentValue = currentValue;
      if (title) goal.title = title;
      if (description !== undefined) goal.description = description;
      if (priority) goal.priority = priority;
      if (dueDate !== undefined) goal.dueDate = dueDate ? new Date(dueDate) : null;

      if (status === 'completed' && goal.status !== 'completed') {
        goal.status = 'completed';
        goal.completedAt = new Date();
        goal.currentValue = goal.targetValue;

        // Log completion event
        const event = new ActivityEventModel({
          id: `evt-${userId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
          userId,
          type: 'GOAL_COMPLETED',
          entityId: goal.id,
          entityName: goal.title,
          entityType: 'goal',
          date: todayString(tzOffset),
          timestamp: new Date()
        });
        await event.save();
      } else if (status === 'deleted') {
        goal.status = 'deleted';
      } else if (status === 'active') {
        goal.status = 'active';
        goal.completedAt = null;
      }

      await goal.save();
      res.json({ success: true, goal });
    } catch (err) {
      console.error('[UPDATE GOAL ERROR]', err.message);
      res.status(500).json({ success: false, message: 'Failed to update goal.' });
    }
  });

  // ========================================================================
  // GET /api/progress/goals — List user goals
  // ========================================================================
  router.get('/goals', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const status = req.query.status; // 'active', 'completed', 'all'
      const query = { userId, status: { $ne: 'deleted' } };
      if (status && status !== 'all') query.status = status;

      const goals = await GoalModel.find(query).sort({ createdAt: -1 }).limit(50).lean();
      res.json({ success: true, goals });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to load goals.' });
    }
  });

  // ========================================================================
  // GET /api/progress/achievements — Get all achievements with unlock status
  // ========================================================================
  router.get('/achievements', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const unlocked = await AchievementModel.find({ userId }).lean();
      const unlockedIds = new Set(unlocked.map(a => a.odaId));

      const all = ACHIEVEMENT_DEFS.map(def => ({
        ...def,
        condition: undefined,
        unlocked: unlockedIds.has(def.id),
        unlockedAt: unlocked.find(a => a.odaId === def.id)?.unlockedAt || null
      }));

      res.json({ success: true, achievements: all });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to load achievements.' });
    }
  });

  // ========================================================================
  // GET /api/progress/quiz-performance — Quiz score trend
  // ========================================================================
  router.get('/quiz-performance', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const limit = Math.min(parseInt(req.query.limit) || 20, 100);

      const attempts = await QuizAttemptModel.find({ userId, status: 'completed' })
        .sort({ submittedAt: -1 })
        .limit(limit)
        .lean();

      res.json({
        success: true,
        attempts: attempts.reverse().map(a => ({
          id: a.id,
          quizName: a.quizName,
          subject: a.subject,
          score: a.score,
          totalMarks: a.totalMarks,
          percentage: a.totalMarks > 0 ? Math.round((a.score / a.totalMarks) * 100) : 0,
          correct: a.correct,
          incorrect: a.incorrect,
          skipped: a.skipped,
          durationSeconds: a.durationSeconds,
          submittedAt: a.submittedAt
        }))
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to load quiz performance.' });
    }
  });

  // ========================================================================
  // GET /api/progress/subjects — Subject-wise progress
  // ========================================================================
  router.get('/subjects', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const topics = await TopicProgressModel.find({ userId }).lean();
      const notes = await NoteActivityModel.find({ userId }).lean();
      const pyqs = await PYQActivityModel.find({ userId }).lean();

      const subjectMap = {};

      // From topics
      topics.forEach(t => {
        const s = t.subject || 'Unknown';
        if (!subjectMap[s]) subjectMap[s] = { completed: 0, inProgress: 0, notStarted: 0, total: 0, notesRead: 0, pyqsSolved: 0 };
        subjectMap[s].total++;
        if (t.status === 'completed') subjectMap[s].completed++;
        else if (t.status === 'in_progress') subjectMap[s].inProgress++;
        else subjectMap[s].notStarted++;
      });

      // From notes
      notes.forEach(n => {
        const s = n.subject || 'Unknown';
        if (!subjectMap[s]) subjectMap[s] = { completed: 0, inProgress: 0, notStarted: 0, total: 0, notesRead: 0, pyqsSolved: 0 };
        if (n.readStatus === 'completed' || n.readStatus === 'reading') subjectMap[s].notesRead++;
      });

      // From PYQs
      pyqs.forEach(p => {
        const s = p.subject || 'Unknown';
        if (!subjectMap[s]) subjectMap[s] = { completed: 0, inProgress: 0, notStarted: 0, total: 0, notesRead: 0, pyqsSolved: 0 };
        if (p.status === 'solved') subjectMap[s].pyqsSolved++;
      });

      res.json({ success: true, subjects: subjectMap });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to load subject progress.' });
    }
  });

  // ========================================================================
  // GET /api/progress/notes — List user note activity
  // ========================================================================
  router.get('/notes', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const notes = await NoteActivityModel.find({ userId }).sort({ lastViewedAt: -1 }).limit(100).lean();
      res.json({ success: true, notes });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to load notes activity.' });
    }
  });

  // ========================================================================
  // GET /api/progress/pyqs — List user PYQ activity
  // ========================================================================
  router.get('/pyqs', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const pyqs = await PYQActivityModel.find({ userId }).sort({ updatedAt: -1 }).limit(100).lean();
      res.json({ success: true, pyqs });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to load PYQs activity.' });
    }
  });

  // ========================================================================
  // GET /api/progress/topics — List user topic progress
  // ========================================================================
  router.get('/topics', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const topics = await TopicProgressModel.find({ userId }).sort({ updatedAt: -1 }).limit(200).lean();
      res.json({ success: true, topics });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to load topics.' });
    }
  });

  // ========================================================================
  // POST /api/progress/topics/toggle — Toggle topic complete / incomplete
  // ========================================================================
  router.post('/topics/toggle', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const { topicId, topicName, unitName, subject, course, status } = req.body;
      const tzOffset = parseInt(req.body.tz) || 330;
      if (!topicId) {
        return res.status(400).json({ success: false, message: 'Topic ID is required.' });
      }

      const existing = await TopicProgressModel.findOne({ userId, topicId });
      let nextStatus = status;
      if (!nextStatus) {
        nextStatus = (!existing || existing.status !== 'completed') ? 'completed' : 'not_started';
      }

      const record = await TopicProgressModel.findOneAndUpdate(
        { userId, topicId },
        {
          $setOnInsert: { id: `tp-${userId}-${topicId}-${Date.now()}` },
          $set: {
            topicName: topicName || existing?.topicName || '',
            unitName: unitName || existing?.unitName || '',
            subject: subject || existing?.subject || '',
            course: course || existing?.course || '',
            status: nextStatus,
            completedAt: nextStatus === 'completed' ? new Date() : null
          }
        },
        { upsert: true, new: true }
      );

      if (nextStatus === 'completed') {
        const event = new ActivityEventModel({
          id: `evt-${userId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
          userId,
          type: 'TOPIC_COMPLETED',
          entityId: topicId,
          entityName: topicName || existing?.topicName || 'Topic',
          entityType: 'topic',
          subject: subject || existing?.subject || '',
          course: course || existing?.course || '',
          metadata: { unitName },
          date: todayString(tzOffset),
          timestamp: new Date()
        });
        await event.save();
      }

      res.json({ success: true, topic: record });
    } catch (err) {
      console.error('[TOPIC TOGGLE ERROR]', err.message);
      res.status(500).json({ success: false, message: 'Failed to update topic status.' });
    }
  });

  // ========================================================================
  // GET /api/progress/calendar — Heatmap calendar data
  // ========================================================================
  router.get('/calendar', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const days = parseInt(req.query.days) || 90;
      const startDate = new Date(Date.now() - days * 86400000);

      const [events, sessions] = await Promise.all([
        ActivityEventModel.find({ userId, timestamp: { $gte: startDate } }).select('date type timestamp entityName').lean(),
        StudySessionModel.find({ userId, status: 'completed', endedAt: { $gte: startDate } }).select('startedAt endedAt durationMinutes subject').lean()
      ]);

      const calendarMap = {};
      events.forEach(e => {
        if (!calendarMap[e.date]) calendarMap[e.date] = { date: e.date, count: 0, minutes: 0, events: [] };
        calendarMap[e.date].count++;
        calendarMap[e.date].events.push({ type: e.type, name: e.entityName, time: e.timestamp });
      });

      const tzOffset = parseInt(req.query.tz) || 330;
      sessions.forEach(s => {
        const d = getDateString(s.endedAt || s.startedAt, tzOffset);
        if (!calendarMap[d]) calendarMap[d] = { date: d, count: 0, minutes: 0, events: [] };
        calendarMap[d].minutes += (s.durationMinutes || 0);
      });

      res.json({ success: true, days: Object.values(calendarMap) });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to load calendar data.' });
    }
  });

  // ========================================================================
  // GET /api/progress/insights — Real analytics insights
  // ========================================================================
  router.get('/insights', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const [sessions, events, topics, quizzes] = await Promise.all([
        StudySessionModel.find({ userId, status: 'completed' }).lean(),
        ActivityEventModel.find({ userId }).lean(),
        TopicProgressModel.find({ userId }).lean(),
        QuizAttemptModel.find({ userId, status: 'completed' }).lean()
      ]);

      const totalMinutes = sessions.reduce((s, x) => s + (x.durationMinutes || 0), 0);
      const uniqueDays = new Set(events.map(e => e.date)).size;
      const avgMinutesPerDay = uniqueDays > 0 ? Math.round(totalMinutes / uniqueDays) : 0;

      // Day of week analysis
      const dayCounts = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 };
      const daysArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      sessions.forEach(s => {
        if (s.startedAt) {
          const dName = daysArr[new Date(s.startedAt).getDay()];
          dayCounts[dName] += (s.durationMinutes || 0);
        }
      });
      let mostActiveDay = 'Not enough data';
      let maxDayMin = 0;
      Object.entries(dayCounts).forEach(([day, mins]) => {
        if (mins > maxDayMin) {
          maxDayMin = mins;
          mostActiveDay = day;
        }
      });

      // Subject focus recommendations
      const subjectTopicMap = {};
      topics.forEach(t => {
        const s = t.subject || 'General';
        if (!subjectTopicMap[s]) subjectTopicMap[s] = { total: 0, completed: 0 };
        subjectTopicMap[s].total++;
        if (t.status === 'completed') subjectTopicMap[s].completed++;
      });

      let focusSubject = null;
      let lowestCompletion = 100;
      Object.entries(subjectTopicMap).forEach(([subj, data]) => {
        const pct = (data.completed / data.total) * 100;
        if (pct < lowestCompletion && data.total > 0) {
          lowestCompletion = pct;
          focusSubject = subj;
        }
      });

      res.json({
        success: true,
        insights: {
          totalMinutes,
          totalHours: (totalMinutes / 60).toFixed(1),
          activeDaysCount: uniqueDays,
          avgMinutesPerActiveDay: avgMinutesPerDay,
          mostActiveDay: maxDayMin > 0 ? mostActiveDay : 'Not enough data',
          mostActiveDayMinutes: maxDayMin,
          focusSubject: focusSubject || (topics.length === 0 ? 'Start exploring subjects' : 'All tracked subjects up to date'),
          lowestCompletionPct: focusSubject ? Math.round(lowestCompletion) : 100,
          totalQuizzesTaken: quizzes.length,
          avgQuizScore: quizzes.length > 0 ? Math.round(quizzes.reduce((a, q) => a + (q.totalMarks > 0 ? (q.score / q.totalMarks) * 100 : 0), 0) / quizzes.length) : 0
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to load insights.' });
    }
  });

  // ========================================================================
  // DELETE /api/progress/reset — Reset all progress (with confirmation)
  // ========================================================================
  router.delete('/reset', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const { confirm } = req.body;
      if (confirm !== 'DELETE_ALL_PROGRESS') {
        return res.status(400).json({ success: false, message: 'Please confirm with "DELETE_ALL_PROGRESS".' });
      }

      await Promise.all([
        StudySessionModel.deleteMany({ userId }),
        ActivityEventModel.deleteMany({ userId }),
        GoalModel.deleteMany({ userId }),
        AchievementModel.deleteMany({ userId }),
        NoteActivityModel.deleteMany({ userId }),
        PYQActivityModel.deleteMany({ userId }),
        QuizAttemptModel.deleteMany({ userId }),
        TopicProgressModel.deleteMany({ userId })
      ]);

      res.json({ success: true, message: 'All progress data has been permanently deleted.' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to reset progress.' });
    }
  });

  return router;
}

// ============================================================================
// HELPER: Format minutes into human-readable string
// ============================================================================
function formatMinutes(minutes) {
  if (minutes < 1) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
