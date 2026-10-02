// Result & CGPA API Routes
// Uses the modular resultEngine pipeline for PDF analysis

import express from 'express';
import multer from 'multer';
import { analyzeResultPdf, ERROR_CODES } from '../resultEngine/analysisPipeline.js';
import { generateAnalysisReport } from '../resultEngine/reportGenerator.js';

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
  // Main PDF analysis endpoint
  async function handleAnalyze(req, res) {
    try {
      // Extract uploaded file from multer
      const uploadedFile = req.file || (req.files && (
        req.files.find(f => f.fieldname === 'file') ||
        req.files.find(f => f.fieldname === 'resultPdf') ||
        req.files[0]
      ));

      if (!uploadedFile || !uploadedFile.buffer) {
        return res.status(400).json({
          success: false,
          code: ERROR_CODES.INVALID_FILE,
          error: 'Please select a valid PDF file to analyze.'
        });
      }

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

        return res.status(statusCode).json({
          success: false,
          code: result.code,
          error: result.error
        });
      }

      // Optional DB persistence (Section 40)
      if (deps.isDbConnected && deps.isDbConnected()) {
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

  // Register routes
  router.post('/analyze', upload.any(), handleAnalyze);
  router.post('/analyze-pdf', upload.any(), handleAnalyze);
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
