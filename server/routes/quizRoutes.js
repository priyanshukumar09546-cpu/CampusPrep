// ============================================================================
// PROFESSORVIRUS — FIRST-PARTY QUIZ SYSTEM API ROUTER
// Real, authoritative academic quiz engine with evidence-based scoring
// ============================================================================

import express from 'express';
import mongoose from 'mongoose';
import { INITIAL_QUIZZES } from '../../src/data/quizQuestionBank.js';

// Mongoose Schemas for Quiz Platform
const QuizSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  course: { type: String, required: true },
  branch: { type: String, default: 'All' },
  year: { type: String, default: 'All' },
  semester: { type: String, default: 'All' },
  subject: { type: String, required: true },
  subjectCode: { type: String, default: '' },
  category: { type: String, default: 'Most Important' },
  difficulty: { type: String, default: 'Medium' },
  durationMinutes: { type: Number, default: 15 },
  marksPerQuestion: { type: Number, default: 1 },
  negativeMarks: { type: Number, default: 0 },
  importanceReason: { type: String, default: '' },
  description: { type: String, default: '' },
  status: { type: String, default: 'Published' },
  questions: [{
    id: { type: String, required: true },
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    explanation: { type: String, default: '' },
    unit: { type: String, default: '' },
    difficulty: { type: String, default: 'Medium' },
    importance: { type: String, default: 'Standard' },
    importanceReason: { type: String, default: '' },
    source: { type: String, default: '' }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const QuizModel = mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);

// In-Memory Fallback Seed (Synchronized with authoritative real question bank)
let inMemoryQuizzes = JSON.parse(JSON.stringify(INITIAL_QUIZZES || []));

export function createQuizRouter(options = {}) {
  const router = express.Router();
  const verifyAdminToken = options.verifyAdminToken || ((req, res, next) => next());

  // --------------------------------------------------------------------------
  // 1. GET /api/quizzes — Filtered list of published quizzes
  // --------------------------------------------------------------------------
  router.get('/', async (req, res) => {
    try {
      const { course, branch, year, semester, subject, category, difficulty, search } = req.query;

      let quizzes = [];
      if (mongoose.connection.readyState === 1) {
        const query = { status: 'Published' };
        if (course && course !== 'All') {
          query.course = new RegExp(`^${course.replace(/[\.\s]/g, '')}$`, 'i');
        }
        if (branch && branch !== 'All') query.branch = branch;
        if (year && year !== 'All') query.year = year;
        if (semester && semester !== 'All') query.semester = semester;
        if (subject && subject !== 'All') query.subject = new RegExp(subject, 'i');
        if (category && category !== 'All') query.category = category;
        if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
        if (search && search.trim()) {
          const sRegex = new RegExp(search.trim(), 'i');
          query.$or = [{ title: sRegex }, { subject: sRegex }, { subjectCode: sRegex }];
        }

        quizzes = await QuizModel.find(query).lean();
      }

      // Fallback to in-memory seed if database has not been seeded
      if (!quizzes || quizzes.length === 0) {
        quizzes = inMemoryQuizzes.filter(q => {
          if (q.status && q.status !== 'Published') return false;
          if (course && course !== 'All') {
            const qc = (q.course || '').toLowerCase().replace(/[\.\s]/g, '');
            const rc = course.toLowerCase().replace(/[\.\s]/g, '');
            if (qc !== rc) return false;
          }
          if (branch && branch !== 'All' && q.branch && q.branch !== 'All' && q.branch.toLowerCase() !== branch.toLowerCase()) return false;
          if (year && year !== 'All' && q.year && q.year.toLowerCase() !== year.toLowerCase()) return false;
          if (semester && semester !== 'All' && q.semester && q.semester.toLowerCase() !== semester.toLowerCase()) return false;
          if (subject && subject !== 'All' && q.subject && !q.subject.toLowerCase().includes(subject.toLowerCase())) return false;
          if (category && category !== 'All' && q.category && q.category.toLowerCase() !== category.toLowerCase()) return false;
          if (difficulty && difficulty !== 'All' && q.difficulty && q.difficulty.toLowerCase() !== difficulty.toLowerCase()) return false;
          if (search && search.trim()) {
            const qry = search.toLowerCase().trim();
            const mt = (q.title || '').toLowerCase().includes(qry);
            const ms = (q.subject || '').toLowerCase().includes(qry);
            const mc = (q.subjectCode || '').toLowerCase().includes(qry);
            if (!mt && !ms && !mc) return false;
          }
          return true;
        });
      }

      // Map out question counts without leaking answer keys
      const sanitized = quizzes.map(q => ({
        id: q.id,
        title: q.title,
        course: q.course,
        branch: q.branch,
        year: q.year,
        semester: q.semester,
        subject: q.subject,
        subjectCode: q.subjectCode,
        category: q.category,
        difficulty: q.difficulty,
        durationMinutes: q.durationMinutes,
        marksPerQuestion: q.marksPerQuestion,
        negativeMarks: q.negativeMarks,
        importanceReason: q.importanceReason,
        description: q.description,
        questionsCount: (q.questions || []).length
      }));

      res.json({
        success: true,
        count: sanitized.length,
        quizzes: sanitized
      });
    } catch (err) {
      console.error('[QuizRoutes] GET / error:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch quizzes.' });
    }
  });

  // --------------------------------------------------------------------------
  // 2. GET /api/quizzes/:id — Full quiz with questions
  // --------------------------------------------------------------------------
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      let quiz = null;

      if (mongoose.connection.readyState === 1) {
        quiz = await QuizModel.findOne({ id }).lean();
      }

      if (!quiz) {
        quiz = inMemoryQuizzes.find(q => q.id === id);
      }

      if (!quiz) {
        return res.status(404).json({ success: false, message: 'Quiz not found.' });
      }

      res.json({
        success: true,
        quiz
      });
    } catch (err) {
      console.error('[QuizRoutes] GET /:id error:', err);
      res.status(500).json({ success: false, message: 'Failed to load quiz details.' });
    }
  });

  // --------------------------------------------------------------------------
  // 3. POST /api/quizzes/:id/submit — True score computation & review
  // --------------------------------------------------------------------------
  router.post('/:id/submit', async (req, res) => {
    try {
      const { id } = req.params;
      const { answers = {}, timeTakenSeconds = 0, user = null } = req.body;

      let quiz = null;
      if (mongoose.connection.readyState === 1) {
        quiz = await QuizModel.findOne({ id }).lean();
      }
      if (!quiz) {
        quiz = inMemoryQuizzes.find(q => q.id === id);
      }
      if (!quiz) {
        return res.status(404).json({ success: false, message: 'Quiz not found.' });
      }

      const questions = quiz.questions || [];
      const totalQuestions = questions.length;
      let correctCount = 0;
      let incorrectCount = 0;
      let skippedCount = 0;

      const marksPerQ = Number(quiz.marksPerQuestion) || 1;
      const negMarks = Number(quiz.negativeMarks) || 0;
      const unitStats = {};

      const reviewItems = questions.map((q, idx) => {
        const studentAns = answers[q.id];
        const isAnswered = studentAns !== undefined && studentAns !== null && studentAns !== '';
        const isCorrect = isAnswered && Number(studentAns) === Number(q.correctAnswer);

        let marksEarned = 0;
        if (isAnswered) {
          if (isCorrect) {
            correctCount++;
            marksEarned = marksPerQ;
          } else {
            incorrectCount++;
            marksEarned = -negMarks;
          }
        } else {
          skippedCount++;
          marksEarned = 0;
        }

        // Unit stats tracking
        const u = q.unit || 'General';
        if (!unitStats[u]) unitStats[u] = { total: 0, correct: 0 };
        unitStats[u].total++;
        if (isCorrect) unitStats[u].correct++;

        return {
          questionId: q.id,
          questionNumber: idx + 1,
          questionText: q.questionText,
          options: q.options,
          studentAnswer: isAnswered ? Number(studentAns) : null,
          correctAnswer: Number(q.correctAnswer),
          isCorrect,
          isSkipped: !isAnswered,
          marksEarned,
          explanation: q.explanation || 'Explanation not available.',
          source: q.source || '',
          importance: q.importance || 'Standard',
          unit: q.unit || ''
        };
      });

      const maxMarks = totalQuestions * marksPerQ;
      const rawScore = (correctCount * marksPerQ) - (incorrectCount * negMarks);
      const finalScore = Math.max(0, rawScore);
      const percentage = maxMarks > 0 ? Number(((finalScore / maxMarks) * 100).toFixed(2)) : 0;
      const attemptedCount = correctCount + incorrectCount;
      const accuracy = attemptedCount > 0 ? Number(((correctCount / attemptedCount) * 100).toFixed(2)) : 0;

      const unitPerformance = Object.keys(unitStats).map(unitName => {
        const u = unitStats[unitName];
        return {
          unit: unitName,
          total: u.total,
          correct: u.correct,
          accuracy: u.total > 0 ? Math.round((u.correct / u.total) * 100) : 0
        };
      });

      // Save attempt to MongoDB if QuizAttemptModel exists
      if (mongoose.connection.readyState === 1 && mongoose.models.QuizAttempt) {
        try {
          await mongoose.models.QuizAttempt.create({
            userId: user?.id || 'guest',
            quizId: quiz.id,
            quizName: quiz.title,
            course: quiz.course,
            subject: quiz.subject,
            score: finalScore,
            totalMarks: maxMarks,
            correct: correctCount,
            incorrect: incorrectCount,
            skipped: skippedCount,
            durationSeconds: timeTakenSeconds,
            status: 'completed',
            submittedAt: new Date()
          });
        } catch (dbErr) {
          console.warn('[QuizRoutes] Could not save attempt to MongoDB:', dbErr.message);
        }
      }

      res.json({
        success: true,
        result: {
          quizId: quiz.id,
          quizTitle: quiz.title,
          subject: quiz.subject,
          course: quiz.course,
          totalQuestions,
          score: finalScore,
          maxMarks,
          correct: correctCount,
          incorrect: incorrectCount,
          skipped: skippedCount,
          accuracy,
          percentage,
          timeTakenSeconds,
          unitPerformance,
          review: reviewItems
        }
      });
    } catch (err) {
      console.error('[QuizRoutes] POST /:id/submit error:', err);
      res.status(500).json({ success: false, message: 'Failed to process quiz submission.' });
    }
  });

  // --------------------------------------------------------------------------
  // 4. ADMIN QUIZ CMS ENDPOINTS
  // --------------------------------------------------------------------------
  router.get('/admin/all', verifyAdminToken, async (req, res) => {
    try {
      let quizzes = [];
      if (mongoose.connection.readyState === 1) {
        quizzes = await QuizModel.find().sort({ createdAt: -1 }).lean();
      }
      if (!quizzes || quizzes.length === 0) {
        quizzes = inMemoryQuizzes;
      }
      res.json({ success: true, quizzes });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to load admin quizzes.' });
    }
  });

  router.post('/admin/create', verifyAdminToken, async (req, res) => {
    try {
      const { title, course, branch, year, semester, subject, subjectCode, category, difficulty, durationMinutes, marksPerQuestion, negativeMarks, description, questions = [] } = req.body;
      if (!title || !course || !subject) {
        return res.status(400).json({ success: false, message: 'Title, course, and subject are mandatory.' });
      }

      const newQuiz = {
        id: `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        title,
        course,
        branch: branch || 'All',
        year: year || 'All',
        semester: semester || 'All',
        subject,
        subjectCode: subjectCode || '',
        category: category || 'Most Important',
        difficulty: difficulty || 'Medium',
        durationMinutes: Number(durationMinutes) || 15,
        marksPerQuestion: Number(marksPerQuestion) || 1,
        negativeMarks: Number(negativeMarks) || 0,
        description: description || '',
        status: 'Published',
        questions: questions || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (mongoose.connection.readyState === 1) {
        await QuizModel.create(newQuiz);
      }
      inMemoryQuizzes.unshift(newQuiz);

      res.json({ success: true, message: 'Quiz created successfully!', quiz: newQuiz });
    } catch (err) {
      console.error('[QuizRoutes] Create error:', err);
      res.status(500).json({ success: false, message: 'Failed to create quiz.' });
    }
  });

  router.put('/admin/:id/publish', verifyAdminToken, async (req, res) => {
    try {
      const { id } = req.params;
      let quiz = null;

      if (mongoose.connection.readyState === 1) {
        quiz = await QuizModel.findOne({ id });
        if (quiz) {
          quiz.status = quiz.status === 'Published' ? 'Draft' : 'Published';
          await quiz.save();
        }
      }

      const mem = inMemoryQuizzes.find(q => q.id === id);
      if (mem) {
        mem.status = mem.status === 'Published' ? 'Draft' : 'Published';
        quiz = mem;
      }

      if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found.' });

      res.json({ success: true, message: `Quiz status updated to ${quiz.status}.`, status: quiz.status });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to update quiz status.' });
    }
  });

  router.delete('/admin/:id', verifyAdminToken, async (req, res) => {
    try {
      const { id } = req.params;
      if (mongoose.connection.readyState === 1) {
        await QuizModel.deleteOne({ id });
      }
      inMemoryQuizzes = inMemoryQuizzes.filter(q => q.id !== id);
      res.json({ success: true, message: 'Quiz deleted successfully.' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to delete quiz.' });
    }
  });

  router.post('/admin/:id/questions', verifyAdminToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { questionText, options, correctAnswer, explanation, unit, difficulty, importance, source } = req.body;

      if (!questionText || !options || options.length < 2 || correctAnswer === undefined) {
        return res.status(400).json({ success: false, message: 'Question text, minimum 2 options, and correct answer are required.' });
      }

      const newQ = {
        id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        questionText,
        options,
        correctAnswer: Number(correctAnswer),
        explanation: explanation || '',
        unit: unit || '',
        difficulty: difficulty || 'Medium',
        importance: importance || 'Standard',
        source: source || ''
      };

      if (mongoose.connection.readyState === 1) {
        await QuizModel.updateOne({ id }, { $push: { questions: newQ }, $set: { updatedAt: new Date() } });
      }

      const mem = inMemoryQuizzes.find(q => q.id === id);
      if (mem) {
        if (!mem.questions) mem.questions = [];
        mem.questions.push(newQ);
      }

      res.json({ success: true, message: 'Question added successfully!', question: newQ });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to add question.' });
    }
  });

  router.post('/admin/:id/questions/bulk', verifyAdminToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { questions } = req.body;

      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ success: false, message: 'Questions array is required.' });
      }

      const validQuestions = [];
      for (const q of questions) {
        if (!q.questionText || !Array.isArray(q.options) || q.options.length < 2 || q.correctAnswer === undefined) {
          continue; // skip malformed questions
        }
        validQuestions.push({
          id: q.id || `q-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          questionText: q.questionText.trim(),
          options: q.options.map(opt => String(opt).trim()),
          correctAnswer: Number(q.correctAnswer),
          explanation: q.explanation || '',
          unit: q.unit || '',
          difficulty: q.difficulty || 'Medium',
          importance: q.importance || 'Standard',
          source: q.source || ''
        });
      }

      if (validQuestions.length === 0) {
        return res.status(400).json({ success: false, message: 'No valid questions found in import payload.' });
      }

      if (mongoose.connection.readyState === 1) {
        await QuizModel.updateOne({ id }, { $push: { questions: { $each: validQuestions } }, $set: { updatedAt: new Date() } });
      }

      const mem = inMemoryQuizzes.find(q => q.id === id);
      if (mem) {
        if (!mem.questions) mem.questions = [];
        mem.questions.push(...validQuestions);
      }

      res.json({
        success: true,
        message: `Successfully imported ${validQuestions.length} valid questions!`,
        importedCount: validQuestions.length,
        totalQuestions: validQuestions
      });
    } catch (err) {
      console.error('[QuizRoutes] Bulk import error:', err);
      res.status(500).json({ success: false, message: 'Failed to bulk import questions.' });
    }
  });


  return router;
}

export default createQuizRouter();
