// Result & CGPA API Routes
// Uses the modular resultEngine pipeline for PDF analysis

import express from 'express';
import multer from 'multer';
import { analyzeResultPdf, ERROR_CODES } from '../resultEngine/analysisPipeline.js';
import { generateAnalysisReport } from '../resultEngine/reportGenerator.js';
import { combineResultDocuments } from '../resultEngine/multiDocumentCombiner.js';
import { queryAcademicAdvisor } from '../resultEngine/aiAcademicAdvisor.js';
import { calculateTargetSGPA, simulateSemesterPerformance, simulateBacklogClearance } from '../resultEngine/scenarioSimulator.js';

// Multer memory storage with file size limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter: (_req, file, cb) => {
    const isPdf = file.mimetype === 'application/pdf' ||
                  file.originalname?.toLowerCase()?.endsWith('.pdf');
    if (!isPdf) {
      return cb(new Error('Only PDF files are accepted.'), false);
    }
    cb(null, true);
  }
});

/**
 * Create the Result & CGPA router
 * @param {object} deps - { isDbConnected }
 * @returns {express.Router}
 */
export function createResultRouter(deps = {}) {
  const router = express.Router();

  // ===== POST /api/result/analyze =====
  // ===== POST /api/result/analyze-pdf =====
  // Main PDF analysis endpoint (supports single & multi-document upload)
  async function handleAnalyze(req, res) {
    try {
      const allFiles = (req.files && req.files.length > 0)
        ? req.files
        : (req.file ? [req.file] : []);

      if (allFiles.length === 0 || !allFiles[0]?.buffer) {
        return res.status(400).json({
          success: false,
          code: ERROR_CODES.INVALID_FILE,
          error: 'Please select a valid PDF file to analyze.'
        });
      }

      // MULTI-DOCUMENT CONSOLIDATION FLOW
      if (allFiles.length > 1) {
        const docResults = [];
        const fileNames = [];

        for (const f of allFiles) {
          const docRes = await analyzeResultPdf(f);
          if (!docRes.success) {
            return res.status(422).json({
              success: false,
              code: docRes.code,
              error: `Analysis failed for file "${f.originalname}": ${docRes.error}`,
              failedFileName: f.originalname,
              stages: docRes.stages
            });
          }
          docResults.push(docRes);
          fileNames.push(f.originalname);
        }

        try {
          const consolidated = combineResultDocuments(docResults, fileNames);
          return res.json(consolidated);
        } catch (mergeErr) {
          if (mergeErr.code === 'STUDENT_IDENTITY_MISMATCH') {
            return res.status(422).json({
              success: false,
              code: 'STUDENT_IDENTITY_MISMATCH',
              error: mergeErr.message,
              details: mergeErr.details
            });
          }
          throw mergeErr;
        }
      }

      // SINGLE DOCUMENT FLOW
      const uploadedFile = allFiles[0];

      // Run the complete analysis pipeline
      const result = await analyzeResultPdf(uploadedFile);

      if (!result.success) {
        // Determine appropriate HTTP status code
        let statusCode = 422;
        switch (result.code) {
          case ERROR_CODES.INVALID_FILE:
            statusCode = 400;
            break;
          case ERROR_CODES.GEMINI_NOT_CONFIGURED:
            statusCode = 503;
            break;
          case ERROR_CODES.INVALID_RESULT_DOCUMENT:
          case ERROR_CODES.INVALID_RESULT_STRUCTURE:
          case ERROR_CODES.INSUFFICIENT_DATA:
            statusCode = 422;
            break;
          case ERROR_CODES.AI_EXTRACTION_FAILED:
          case ERROR_CODES.PDF_PARSE_FAILED:
          case ERROR_CODES.OCR_FAILED:
            statusCode = 500;
            break;
          default:
            statusCode = 500;
        }

        return res.status(statusCode).json(result);
      }

      // Optional DB persistence (Section 40)
      const isConnected = typeof deps.isDbConnected === 'function' ? deps.isDbConnected() : Boolean(deps.isDbConnected);
      if (isConnected) {
        try {
          const { StudentResult } = await import('../models/StudentResult.js');
          if (result.student?.rollNumber) {
            await StudentResult.findOneAndUpdate(
              { 'student.rollNumber': result.student.rollNumber },
              {
                student: result.student,
                document: result.validatedResult?.document || {},
                semesters: result.semesters || [],
                summary: result.summary || {},
                charts: result.charts || {},
                analysis: result.analysis || {},
                backlogDetails: result.analysis?.backlogAnalytics?.details || []
              },
              { upsert: true, new: true }
            );
          }
        } catch (dbErr) {
          console.warn('[RESULT DB PERSISTENCE WARNING]', dbErr.message);
        }
      }

      // Success response with unified payload
      return res.json({
        success: true,
        canonicalResult: result.canonicalResult,
        student: result.student,
        semesters: result.semesters,
        summary: result.summary,
        analysis: result.analysis,
        charts: result.charts,
        warnings: result.warnings || [],
        validatedResult: result.validatedResult,
        meta: result.meta
      });

    } catch (err) {
      console.error('[RESULT ROUTE ERROR]', err);
      return res.status(500).json({
        success: false,
        code: ERROR_CODES.INTERNAL_ERROR,
        error: 'An unexpected error occurred. Please try again.'
      });
    }
  }

  // ===== POST /api/result/download-report =====
  async function handleDownloadReport(req, res) {
    try {
      const inputData = req.body?.canonicalResult || req.body?.validatedResult || req.body || {};
      if (!inputData || (!inputData.student && !inputData.semesters)) {
        return res.status(400).json({
          success: false,
          error: 'Missing result data for report generation.'
        });
      }

      const pdfBytes = await generateAnalysisReport(inputData, req.body?.analysis || {});
      const studentName = (inputData.student?.name || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `ProfessorVirus_Academic_Report_${studentName}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(Buffer.from(pdfBytes));

    } catch (err) {
      console.error('[REPORT GENERATION ERROR]', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate academic analysis report.'
      });
    }
  }

  // ===== POST /api/result/advisor-query =====
  async function handleAdvisorQuery(req, res) {
    try {
      const { studentData, query } = req.body || {};
      if (!studentData || (!studentData.student && !studentData.semesters)) {
        return res.status(400).json({
          success: false,
          error: 'Please provide verified student academic data to consult the Academic Advisor.'
        });
      }

      const advisorResponse = await queryAcademicAdvisor(studentData, query);
      return res.json(advisorResponse);
    } catch (err) {
      console.error('[ADVISOR QUERY ERROR]', err);
      return res.status(500).json({
        success: false,
        error: 'Academic Advisor service encountered an issue. Please try again.'
      });
    }
  }

  // ===== POST /api/result/simulate-scenario =====
  async function handleSimulateScenario(req, res) {
    try {
      const {
        scenarioType,
        currentCGPA,
        currentCredits,
        targetCGPA,
        remainingCredits,
        hypotheticalSGPA,
        nextSemesterCredits,
        subjectCredits,
        projectedGrade
      } = req.body || {};

      if (scenarioType === 'TARGET_CGPA') {
        const result = calculateTargetSGPA(currentCGPA, currentCredits, targetCGPA, remainingCredits);
        return res.json(result);
      } else if (scenarioType === 'NEXT_SEMESTER') {
        const result = simulateSemesterPerformance(currentCGPA, currentCredits, hypotheticalSGPA, nextSemesterCredits);
        return res.json(result);
      } else if (scenarioType === 'BACKLOG_CLEARANCE') {
        const result = simulateBacklogClearance(currentCGPA, currentCredits, subjectCredits, projectedGrade);
        return res.json(result);
      } else {
        return res.status(400).json({
          success: false,
          error: 'Invalid scenario type. Supported types: TARGET_CGPA, NEXT_SEMESTER, BACKLOG_CLEARANCE'
        });
      }
    } catch (err) {
      console.error('[SIMULATE SCENARIO ERROR]', err);
      return res.status(500).json({
        success: false,
        error: 'Simulation failed. Please verify input parameters.'
      });
    }
  }

  // Register routes
  router.post('/analyze', upload.any(), handleAnalyze);
  router.post('/analyze-pdf', upload.any(), handleAnalyze);
  router.post('/advisor-query', express.json(), handleAdvisorQuery);
  router.post('/simulate-scenario', express.json(), handleSimulateScenario);
  router.post('/download-report', express.json(), handleDownloadReport);

  // Catch multer errors
  router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          code: ERROR_CODES.INVALID_FILE,
          error: 'File too large. Maximum allowed size is 25 MB.'
        });
      }
      return res.status(400).json({
        success: false,
        code: ERROR_CODES.INVALID_FILE,
        error: err.message
      });
    }
    if (err) {
      return res.status(400).json({
        success: false,
        code: ERROR_CODES.INVALID_FILE,
        error: err.message || 'File upload error.'
      });
    }
    next();
  });

  // Fallback 404 for unmatched result API routes
  router.use((req, res) => {
    res.status(404).json({
      success: false,
      error: `Result API route ${req.method} ${req.originalUrl} not found.`
    });
  });

  return router;
}
