import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import {
  extractTextFromPdf,
  extractTextFromDocx,
  normalizeSourceCode,
  fetchTextFromUrl,
  analyzePlagiarism,
  generatePlagiarismPdfReport
} from '../services/plagiarismEngine.js';

// In-memory cache for recent analysis reports
const reportsCache = new Map();

// Configure Multer for in-memory buffer uploads (max 25MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB
  },
  fileFilter: (req, file, cb) => {
    const ext = (file.originalname.split('.').pop() || '').toLowerCase();
    const allowed = [
      'pdf', 'docx', 'txt', 'c', 'cpp', 'cc', 'h', 'hpp', 'java', 'py', 'js',
      'jsx', 'ts', 'tsx', 'html', 'css', 'sql', 'php', 'go', 'rs', 'kt', 'swift'
    ];
    if (ext === 'doc') {
      return cb(new Error('Legacy .doc binary format is not supported. Please convert or save your document as .docx or .pdf.'));
    }
    if (allowed.includes(ext) || file.mimetype.startsWith('text/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file extension (.${ext}). Supported formats: PDF, DOCX, TXT, and source code files.`));
    }
  }
});

export function createPlagiarismRouter() {
  const router = express.Router();

  /**
   * POST /api/plagiarism/analyze
   * Direct text submission analysis
   */
  router.post('/analyze', async (req, res) => {
    try {
      const { text, title, documentType, comparisonDocs, language } = req.body;

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Please provide text content to analyze.'
        });
      }

      const result = await analyzePlagiarism({
        text,
        documentType: documentType || 'Text Input',
        fileName: title || 'Pasted Content',
        comparisonDocs: Array.isArray(comparisonDocs) ? comparisonDocs : []
      });

      // Cache report for PDF download
      const jobId = crypto.randomUUID();
      result.jobId = jobId;
      reportsCache.set(jobId, result);

      // Clean cache older than 1 hour
      if (reportsCache.size > 200) {
        const oldestKey = reportsCache.keys().next().value;
        reportsCache.delete(oldestKey);
      }

      return res.json(result);
    } catch (err) {
      console.error('[PLAGIARISM ANALYZE ERROR]', err);
      return res.status(500).json({
        success: false,
        error: `Analysis failed: ${err.message || 'Internal processing error'}`
      });
    }
  });

  /**
   * POST /api/plagiarism/upload
   * File upload (PDF, DOCX, TXT, Source Code)
   */
  router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded. Please select a valid document.'
        });
      }

      const fileName = req.file.originalname;
      const ext = (fileName.split('.').pop() || '').toLowerCase();
      let extractedText = '';
      let pages = [];
      let docType = 'Document';

      // 1. PDF EXTRACTION
      if (ext === 'pdf' || req.file.mimetype === 'application/pdf') {
        docType = 'PDF Document';
        const pdfResult = await extractTextFromPdf(req.file.buffer);

        if (pdfResult.error && !pdfResult.text) {
          return res.status(422).json({
            success: false,
            error: pdfResult.error,
            isScanned: pdfResult.isScanned
          });
        }
        extractedText = pdfResult.text;
        pages = pdfResult.pages || [];
      } 
      // 2. DOCX EXTRACTION
      else if (ext === 'docx') {
        docType = 'Word Document (DOCX)';
        const docxResult = await extractTextFromDocx(req.file.buffer);

        if (docxResult.error && !docxResult.text) {
          return res.status(422).json({
            success: false,
            error: docxResult.error
          });
        }
        extractedText = docxResult.text;
        pages = docxResult.pages || [];
      } 
      // 3. SOURCE CODE OR PLAIN TEXT
      else {
        const codeLangs = {
          py: 'Python', java: 'Java', c: 'C', cpp: 'C++', cc: 'C++', h: 'C/C++ Header',
          js: 'JavaScript', jsx: 'React JSX', ts: 'TypeScript', tsx: 'React TSX',
          html: 'HTML', css: 'CSS', sql: 'SQL', php: 'PHP', go: 'Go', rs: 'Rust',
          kt: 'Kotlin', swift: 'Swift', txt: 'Plain Text'
        };
        const langName = codeLangs[ext] || 'Source Code';
        docType = `${langName} File`;

        const rawContent = req.file.buffer.toString('utf8');
        const codeMeta = normalizeSourceCode(rawContent, ext);
        extractedText = codeMeta.normalizedCode || rawContent;
      }

      // Check extracted content length
      if (!extractedText || extractedText.trim().length === 0) {
        return res.status(422).json({
          success: false,
          error: `No readable text content could be extracted from "${fileName}". Verify the file is not empty or password protected.`
        });
      }

      // Parse optional comparison documents passed in multipart form
      let comparisonDocs = [];
      if (req.body.comparisonDocs) {
        try {
          comparisonDocs = JSON.parse(req.body.comparisonDocs);
        } catch {}
      }

      // Execute plagiarism analysis
      const result = await analyzePlagiarism({
        text: extractedText,
        documentType: docType,
        fileName,
        comparisonDocs,
        pages
      });

      // Cache report for PDF download
      const jobId = crypto.randomUUID();
      result.jobId = jobId;
      reportsCache.set(jobId, result);

      return res.json(result);
    } catch (err) {
      console.error('[PLAGIARISM UPLOAD ERROR]', err);
      return res.status(500).json({
        success: false,
        error: `File processing error: ${err.message || 'Unable to extract and analyze document'}`
      });
    }
  });

  /**
   * POST /api/plagiarism/url
   * Webpage URL fetch and analyze
   */
  router.post('/url', async (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string' || !url.startsWith('http')) {
        return res.status(400).json({
          success: false,
          error: 'Please enter a valid HTTP or HTTPS website URL.'
        });
      }

      const fetched = await fetchTextFromUrl(url);

      if (!fetched.text || fetched.text.length < 50) {
        return res.status(422).json({
          success: false,
          error: `Unable to extract meaningful text from ${url}. The website may block automated scrapers or require JavaScript rendering.`
        });
      }

      const result = await analyzePlagiarism({
        text: fetched.text,
        documentType: 'Webpage URL',
        fileName: `${fetched.title} (${fetched.domain})`,
        comparisonDocs: []
      });

      const jobId = crypto.randomUUID();
      result.jobId = jobId;
      reportsCache.set(jobId, result);

      return res.json(result);
    } catch (err) {
      console.error('[PLAGIARISM URL ERROR]', err);
      return res.status(500).json({
        success: false,
        error: `Failed to fetch URL: ${err.message || 'Unable to access target page'}`
      });
    }
  });

  /**
   * GET /api/plagiarism/report/:jobId
   * Download generated PDF report by Job ID
   */
  router.get('/report/:jobId', async (req, res) => {
    try {
      const { jobId } = req.params;
      const cached = reportsCache.get(jobId);

      if (!cached) {
        return res.status(404).json({
          success: false,
          error: 'Report expired or not found. Please run a new analysis.'
        });
      }

      const pdfBytes = await generatePlagiarismPdfReport(cached);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="ProfessorVirus_Plagiarism_Report_${jobId.slice(0, 8)}.pdf"`);
      return res.send(Buffer.from(pdfBytes));
    } catch (err) {
      console.error('[PLAGIARISM REPORT DOWNLOAD ERROR]', err);
      return res.status(500).json({
        success: false,
        error: `Failed to generate PDF: ${err.message}`
      });
    }
  });

  /**
   * POST /api/plagiarism/report-pdf
   * Instant direct PDF generation from analysis object
   */
  router.post('/report-pdf', async (req, res) => {
    try {
      const resultData = req.body;
      if (!resultData || typeof resultData !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid analysis result payload.' });
      }

      const pdfBytes = await generatePlagiarismPdfReport(resultData);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="ProfessorVirus_Plagiarism_Report.pdf"');
      return res.send(Buffer.from(pdfBytes));
    } catch (err) {
      console.error('[PLAGIARISM DIRECT PDF ERROR]', err);
      return res.status(500).json({
        success: false,
        error: `Failed to generate PDF: ${err.message}`
      });
    }
  });

  return router;
}
