import express from 'express';
import multer from 'multer';
import {
  mergeDocuments,
  mergePdfs,
  splitPdf,
  organizePdf,
  rotatePdf,
  addPageNumbers,
  addWatermark,
  compressPdf,
  cropPdf,
  imagesToPdf,
  pdfToWord,
  pdfToExcel,
  pdfToMarkdown,
  summarizePdf,
  extractTextFromPdf,
  textToPdf,
  signPdf,
  repairPdf,
  generateStudentNotes100Pages,
  isPdf,
  detectFileType,
  ensurePdfBuffer
} from '../pdfEngine.js';

// Multer memory storage configured for 100+ files and up to 100MB per file
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB per file
    files: 150                   // Allow up to 150 files for 100-page batch merges
  }
});

export function createPdfRouter(dependencies = {}) {
  const router = express.Router();
  const { getAuthenticatedDriveClient } = dependencies;

  // =========================================================================
  // 1. MERGE PDF (SUPPORTS PDF + JPG + PNG + WEBP + 100+ PAGES)
  // =========================================================================
  const handleMerge = async (req, res) => {
    try {
      const files = req.files || (req.file ? [req.file] : []);
      if (!files || files.length < 1) {
        return res.status(400).json({
          success: false,
          code: 'NO_FILES_PROVIDED',
          message: 'Please select at least 1 file to merge.'
        });
      }

      const result = await mergeDocuments(files);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="professorvirus_merged_document.pdf"');
      res.setHeader('Content-Length', result.buffer.length);
      res.setHeader('x-page-count', String(result.pageCount));
      res.setHeader('Access-Control-Expose-Headers', 'x-page-count');
      return res.send(result.buffer);
    } catch (err) {
      console.error('[PDF MERGE ERROR]', err);
      return res.status(500).json({
        success: false,
        code: 'MERGE_FAILED',
        message: err.message || 'Failed to merge documents.'
      });
    }
  };

  router.post('/merge', upload.any(), handleMerge);

  // =========================================================================
  // 2. SPLIT PDF (RANGES, INDIVIDUAL, CHUNKS)
  // =========================================================================
  router.post('/split', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          code: 'NO_FILE_UPLOADED',
          message: 'Please upload a PDF file to split.'
        });
      }

      const pdfBuffer = await ensurePdfBuffer(req.file.buffer);

      const { mode = 'range', pagesPerFile = 1 } = req.body;
      const ranges = req.body.ranges || req.body.pages || '1';
      const result = await splitPdf(pdfBuffer, { mode, ranges, pagesPerFile });

      if (result.isZip) {
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.setHeader('Content-Length', result.buffer.length);
        return res.send(result.buffer);
      } else {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.setHeader('Content-Length', result.buffer.length);
        return res.send(result.buffer);
      }
    } catch (err) {
      console.error('[PDF SPLIT ERROR]', err);
      return res.status(500).json({
        success: false,
        code: 'SPLIT_FAILED',
        message: err.message || 'Failed to split PDF.'
      });
    }
  });

  // =========================================================================
  // 3. ORGANIZE PDF (REORDER, DELETE, ROTATE)
  // =========================================================================
  router.post('/organize', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, code: 'NO_FILE_UPLOADED', message: 'Please upload a PDF file to organize.' });
      }

      const pdfBuffer = await ensurePdfBuffer(req.file.buffer);

      let pageOrder = null;
      let deletePages = [];
      let rotatePages = {};

      if (req.body.pageOrder) {
        try {
          pageOrder = typeof req.body.pageOrder === 'string' ? JSON.parse(req.body.pageOrder) : req.body.pageOrder;
        } catch {
          pageOrder = req.body.pageOrder.split(',').map(s => s.trim());
        }
      }

      if (req.body.deletePages) {
        try {
          deletePages = typeof req.body.deletePages === 'string' ? JSON.parse(req.body.deletePages) : req.body.deletePages;
        } catch {
          deletePages = req.body.deletePages.split(',').map(s => s.trim());
        }
      }

      if (req.body.rotatePages) {
        try {
          rotatePages = typeof req.body.rotatePages === 'string' ? JSON.parse(req.body.rotatePages) : req.body.rotatePages;
        } catch {}
      }

      const organizedPdf = await organizePdf(req.file.buffer, { pageOrder, deletePages, rotatePages });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="organized_document.pdf"');
      res.setHeader('Content-Length', organizedPdf.length);
      return res.send(organizedPdf);
    } catch (err) {
      console.error('[PDF ORGANIZE ERROR]', err);
      return res.status(500).json({ success: false, code: 'ORGANIZE_FAILED', message: err.message });
    }
  });

  // =========================================================================
  // 4. ROTATE PDF
  // =========================================================================
  router.post('/rotate', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, code: 'NO_FILE_UPLOADED', message: 'Please upload a PDF file to rotate.' });
      }
      if (!isPdf(req.file.buffer)) {
        return res.status(400).json({ success: false, code: 'INVALID_PDF', message: 'The uploaded file is not a valid PDF document.' });
      }

      const { angle = 90, pages = 'all' } = req.body;
      const rotatedPdf = await rotatePdf(req.file.buffer, { angle, pages });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="rotated_document.pdf"');
      res.setHeader('Content-Length', rotatedPdf.length);
      return res.send(rotatedPdf);
    } catch (err) {
      console.error('[PDF ROTATE ERROR]', err);
      return res.status(500).json({ success: false, code: 'ROTATE_FAILED', message: err.message });
    }
  });

  // =========================================================================
  // 5. ADD PAGE NUMBERS
  // =========================================================================
  router.post('/page-numbers', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, code: 'NO_FILE_UPLOADED', message: 'Please upload a PDF file.' });
      }
      if (!isPdf(req.file.buffer)) {
        return res.status(400).json({ success: false, code: 'INVALID_PDF', message: 'The uploaded file is not a valid PDF document.' });
      }

      const {
        position = 'bottom-center',
        format = 'Page {n} of {total}',
        startNumber = 1,
        fontSize = 10,
        fontColor = '#4b5563'
      } = req.body;

      const numberedPdf = await addPageNumbers(req.file.buffer, {
        position,
        format,
        startNumber,
        fontSize: parseInt(fontSize, 10) || 10,
        fontColor
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="numbered_document.pdf"');
      res.setHeader('Content-Length', numberedPdf.length);
      return res.send(numberedPdf);
    } catch (err) {
      console.error('[PDF PAGE NUMBERS ERROR]', err);
      return res.status(500).json({ success: false, code: 'PAGE_NUMBERS_FAILED', message: err.message });
    }
  });

  // =========================================================================
  // 6. ADD WATERMARK
  // =========================================================================
  router.post('/watermark', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, code: 'NO_FILE_UPLOADED', message: 'Please upload a PDF file.' });
      }
      if (!isPdf(req.file.buffer)) {
        return res.status(400).json({ success: false, code: 'INVALID_PDF', message: 'The uploaded file is not a valid PDF document.' });
      }

      const {
        text = 'ProfessorVirus',
        opacity = 0.22,
        fontSize = 44,
        angle = 45,
        fontColor = '#781416'
      } = req.body;

      const watermarkedPdf = await addWatermark(req.file.buffer, {
        text,
        opacity,
        fontSize: parseInt(fontSize, 10) || 44,
        angle: parseInt(angle, 10) || 45,
        fontColor
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="watermarked_document.pdf"');
      res.setHeader('Content-Length', watermarkedPdf.length);
      return res.send(watermarkedPdf);
    } catch (err) {
      console.error('[PDF WATERMARK ERROR]', err);
      return res.status(500).json({ success: false, code: 'WATERMARK_FAILED', message: err.message });
    }
  });

  // =========================================================================
  // 7. COMPRESS PDF
  // =========================================================================
  router.post('/compress', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, code: 'NO_FILE_UPLOADED', message: 'Please upload a PDF file to compress.' });
      }
      if (!isPdf(req.file.buffer)) {
        return res.status(400).json({ success: false, code: 'INVALID_PDF', message: 'The uploaded file is not a valid PDF document.' });
      }

      const result = await compressPdf(req.file.buffer);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="compressed_document.pdf"');
      res.setHeader('x-original-size', String(result.originalSize));
      res.setHeader('x-compressed-size', String(result.compressedSize));
      res.setHeader('x-savings-percent', String(result.savingsPercent));
      res.setHeader('Access-Control-Expose-Headers', 'x-original-size, x-compressed-size, x-savings-percent');
      res.setHeader('Content-Length', result.buffer.length);
      return res.send(result.buffer);
    } catch (err) {
      console.error('[PDF COMPRESS ERROR]', err);
      return res.status(500).json({ success: false, code: 'COMPRESS_FAILED', message: err.message });
    }
  });

  // =========================================================================
  // 8. CROP PDF
  // =========================================================================
  router.post('/crop', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, code: 'NO_FILE_UPLOADED', message: 'Please upload a PDF file to crop.' });
      }
      if (!isPdf(req.file.buffer)) {
        return res.status(400).json({ success: false, code: 'INVALID_PDF', message: 'The uploaded file is not a valid PDF document.' });
      }

      const croppedPdf = await cropPdf(req.file.buffer, req.body);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="cropped_document.pdf"');
      res.setHeader('Content-Length', croppedPdf.length);
      return res.send(croppedPdf);
    } catch (err) {
      console.error('[PDF CROP ERROR]', err);
      return res.status(500).json({ success: false, code: 'CROP_FAILED', message: err.message });
    }
  });

  // =========================================================================
  // 9. JPG / PNG TO PDF (BATCH CONVERSION)
  // =========================================================================
  const handleImagesToPdf = async (req, res) => {
    try {
      const files = req.files || (req.file ? [req.file] : []);
      if (!files || files.length < 1) {
        return res.status(400).json({ success: false, code: 'NO_IMAGES_UPLOADED', message: 'Please upload at least 1 image.' });
      }
      const pdfBytes = await imagesToPdf(files, req.body);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="converted_images.pdf"');
      res.setHeader('Content-Length', pdfBytes.length);
      return res.send(pdfBytes);
    } catch (err) {
      console.error('[IMAGES TO PDF ERROR]', err);
      return res.status(500).json({ success: false, code: 'CONVERT_FAILED', message: err.message });
    }
  };

  router.post('/jpg-to-pdf', upload.any(), handleImagesToPdf);
  router.post('/from-images', upload.any(), handleImagesToPdf);

  // =========================================================================
  // 10. PDF TO WORD (.DOCX)
  // =========================================================================
  const handlePdfToWord = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, code: 'NO_FILE_UPLOADED', message: 'Please upload a PDF file.' });
      }
      if (!isPdf(req.file.buffer)) {
        return res.status(400).json({ success: false, code: 'INVALID_PDF', message: 'The uploaded file is not a valid PDF document.' });
      }

      const result = await pdfToWord(req.file.buffer, { title: req.body.title });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.setHeader('Content-Length', result.buffer.length);
      return res.send(result.buffer);
    } catch (err) {
      console.error('[PDF TO WORD ERROR]', err);
      return res.status(500).json({ success: false, code: 'CONVERT_FAILED', message: err.message });
    }
  };

  router.post('/pdf-to-word', upload.single('file'), handlePdfToWord);
  router.post('/to-word', upload.single('file'), handlePdfToWord);

  // =========================================================================
  // 11. PDF TO EXCEL (.XLSX)
  // =========================================================================
  const handlePdfToExcel = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, code: 'NO_FILE_UPLOADED', message: 'Please upload a PDF file.' });
      }
      if (!isPdf(req.file.buffer)) {
        return res.status(400).json({ success: false, code: 'INVALID_PDF', message: 'The uploaded file is not a valid PDF document.' });
      }

      const result = await pdfToExcel(req.file.buffer);

      if (!result.hasTables) {
        return res.status(422).json({
          success: false,
          code: 'NO_TABLES_DETECTED',
          message: 'No structured tables were detected in this PDF.'
        });
      }

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.setHeader('Content-Length', result.buffer.length);
      return res.send(result.buffer);
    } catch (err) {
      console.error('[PDF TO EXCEL ERROR]', err);
      return res.status(500).json({ success: false, code: 'CONVERT_FAILED', message: err.message });
    }
  };

  router.post('/pdf-to-excel', upload.single('file'), handlePdfToExcel);
  router.post('/to-excel', upload.single('file'), handlePdfToExcel);

  // =========================================================================
  // 12. PDF TO MARKDOWN (.MD)
  // =========================================================================
  const handlePdfToMarkdown = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, code: 'NO_FILE_UPLOADED', message: 'Please upload a PDF file.' });
      }
      if (!isPdf(req.file.buffer)) {
        return res.status(400).json({ success: false, code: 'INVALID_PDF', message: 'The uploaded file is not a valid PDF document.' });
      }

      const result = await pdfToMarkdown(req.file.buffer);

      if (req.query.format === 'text') {
        return res.json({ success: true, markdown: result.markdownText });
      }

      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.setHeader('Content-Length', result.buffer.length);
      return res.send(result.buffer);
    } catch (err) {
      console.error('[PDF TO MARKDOWN ERROR]', err);
      return res.status(500).json({ success: false, code: 'CONVERT_FAILED', message: err.message });
    }
  };

  router.post('/pdf-to-markdown', upload.single('file'), handlePdfToMarkdown);
  router.post('/to-markdown', upload.single('file'), handlePdfToMarkdown);

  // =========================================================================
  // 13. PDF AI SUMMARIZER (GEMINI BACKEND)
  // =========================================================================
  router.post('/summarize', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, code: 'NO_FILE_UPLOADED', message: 'Please upload a PDF file to summarize.' });
      }
      if (!isPdf(req.file.buffer)) {
        return res.status(400).json({ success: false, code: 'INVALID_PDF', message: 'The uploaded file is not a valid PDF document.' });
      }

      const result = await summarizePdf(req.file.buffer);
      return res.json(result);
    } catch (err) {
      console.error('[PDF SUMMARIZE ERROR]', err);
      return res.status(500).json({ success: false, code: 'SUMMARIZE_FAILED', message: err.message });
    }
  });

  // =========================================================================
  // 14. PDF TO TEXT (OCR / EXTRACTION)
  // =========================================================================
  const handlePdfToText = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, code: 'NO_FILE_UPLOADED', message: 'Please upload a file.' });
      }

      const pdfBuffer = await ensurePdfBuffer(req.file.buffer);
      const result = await extractTextFromPdf(pdfBuffer);
      return res.json(result);
    } catch (err) {
      console.error('[PDF TEXT EXTRACTION ERROR]', err);
      return res.status(500).json({ success: false, code: 'EXTRACTION_FAILED', message: err.message });
    }
  };

  router.post('/pdf-to-text', upload.single('file'), handlePdfToText);
  router.post('/ocr', upload.single('file'), handlePdfToText);

  // =========================================================================
  // 15. TEXT / WORD TO PDF
  // =========================================================================
  router.post('/convert/from-text', express.json({ limit: '10mb' }), async (req, res) => {
    try {
      const { text, title = 'Student Notes', author = 'ProfessorVirus Student' } = req.body;
      if (!text || !text.trim()) {
        return res.status(400).json({ success: false, code: 'EMPTY_TEXT', message: 'Document text is required.' });
      }
      const pdfBytes = await textToPdf(text, { title, author });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="converted_document.pdf"');
      res.setHeader('Content-Length', pdfBytes.length);
      return res.send(pdfBytes);
    } catch (err) {
      console.error('[TEXT TO PDF ERROR]', err);
      return res.status(500).json({ success: false, code: 'CONVERT_FAILED', message: err.message });
    }
  });

  // =========================================================================
  // 16. SIGN PDF
  // =========================================================================
  router.post('/sign', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, code: 'NO_FILE_UPLOADED', message: 'Please upload a PDF file to sign.' });
      }
      if (!isPdf(req.file.buffer)) {
        return res.status(400).json({ success: false, code: 'INVALID_PDF', message: 'The uploaded file is not a valid PDF document.' });
      }

      const {
        signatureImageBase64,
        pageNumber = 1,
        xPercent = 70,
        yPercent = 15,
        width = 140,
        height = 50
      } = req.body;

      if (!signatureImageBase64) {
        return res.status(400).json({ success: false, code: 'NO_SIGNATURE', message: 'Signature drawing / image is required.' });
      }

      const signedPdf = await signPdf(req.file.buffer, {
        signatureImageBase64,
        pageNumber,
        xPercent,
        yPercent,
        width,
        height
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="signed_document.pdf"');
      res.setHeader('Content-Length', signedPdf.length);
      return res.send(signedPdf);
    } catch (err) {
      console.error('[PDF SIGN ERROR]', err);
      return res.status(500).json({ success: false, code: 'SIGN_FAILED', message: err.message });
    }
  });

  // =========================================================================
  // 17. REPAIR PDF
  // =========================================================================
  router.post('/repair', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, code: 'NO_FILE_UPLOADED', message: 'Please upload a PDF file to repair.' });
      }
      if (!isPdf(req.file.buffer)) {
        return res.status(400).json({ success: false, code: 'INVALID_PDF', message: 'The uploaded file is not a valid PDF document.' });
      }

      const repairedPdf = await repairPdf(req.file.buffer);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="repaired_document.pdf"');
      res.setHeader('Content-Length', repairedPdf.length);
      return res.send(repairedPdf);
    } catch (err) {
      console.error('[PDF REPAIR ERROR]', err);
      return res.status(500).json({ success: false, code: 'REPAIR_FAILED', message: err.message });
    }
  });

  // =========================================================================
  // 18. GENERATE 100-PAGE NOTES PDF
  // =========================================================================
  router.get('/generate-100-page', async (req, res) => {
    try {
      const pdfBytes = await generateStudentNotes100Pages();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="professorvirus_100_page_notes.pdf"');
      res.setHeader('Content-Length', pdfBytes.length);
      return res.send(pdfBytes);
    } catch (err) {
      console.error('[GENERATE 100-PAGE ERROR]', err);
      return res.status(500).json({ success: false, code: 'GENERATE_FAILED', message: err.message });
    }
  });

  // =========================================================================
  // 19. CLOUD CONNECTIVITY (GOOGLE DRIVE, DROPBOX, ONEDRIVE)
  // =========================================================================
  router.get('/cloud/status', async (req, res) => {
    try {
      let gdriveConnected = false;
      let gdriveEmail = null;

      if (typeof getAuthenticatedDriveClient === 'function') {
        const auth = await getAuthenticatedDriveClient();
        if (auth && auth.drive) {
          gdriveConnected = true;
          gdriveEmail = auth.tokenData?.accountEmail || 'Connected Google Account';
        }
      }

      return res.json({
        success: true,
        providers: {
          googleDrive: {
            available: true,
            connected: gdriveConnected,
            accountEmail: gdriveEmail,
            name: 'Google Drive'
          },
          dropbox: {
            available: true,
            connected: false,
            needsSetup: true,
            name: 'Dropbox'
          },
          oneDrive: {
            available: true,
            connected: false,
            needsSetup: true,
            name: 'Microsoft OneDrive'
          }
        }
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  router.get('/cloud/google-drive', async (req, res) => {
    try {
      if (typeof getAuthenticatedDriveClient !== 'function') {
        return res.json({ success: true, connected: false, files: [] });
      }

      const auth = await getAuthenticatedDriveClient();
      if (!auth || !auth.drive) {
        return res.json({
          success: true,
          connected: false,
          message: 'Google Drive is not connected yet.',
          files: []
        });
      }

      const driveRes = await auth.drive.files.list({
        q: "mimeType='application/pdf' and trashed=false",
        fields: 'files(id, name, size, modifiedTime, thumbnailLink, webViewLink)',
        orderBy: 'modifiedTime desc',
        pageSize: 30
      });

      const files = (driveRes.data.files || []).map(f => ({
        id: f.id,
        name: f.name,
        size: parseInt(f.size, 10) || 0,
        modifiedTime: f.modifiedTime,
        thumbnailLink: f.thumbnailLink,
        webViewLink: f.webViewLink
      }));

      return res.json({
        success: true,
        connected: true,
        accountEmail: auth.tokenData?.accountEmail,
        files
      });
    } catch (err) {
      console.error('[GOOGLE DRIVE PDF LIST ERROR]', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  router.post('/cloud/google-drive/fetch', express.json(), async (req, res) => {
    try {
      const { fileId } = req.body;
      if (!fileId) {
        return res.status(400).json({ success: false, message: 'fileId is required' });
      }

      if (typeof getAuthenticatedDriveClient !== 'function') {
        return res.status(500).json({ success: false, message: 'Drive client unavailable' });
      }

      const auth = await getAuthenticatedDriveClient();
      if (!auth || !auth.drive) {
        return res.status(400).json({ success: false, message: 'Google Drive not connected' });
      }

      const meta = await auth.drive.files.get({ fileId, fields: 'id, name, mimeType' });
      const filename = meta.data.name || 'document.pdf';

      const response = await auth.drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'arraybuffer' }
      );

      const buffer = Buffer.from(response.data);
      res.setHeader('Content-Type', meta.data.mimeType || 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
      res.setHeader('Content-Length', buffer.length);
      return res.send(buffer);
    } catch (err) {
      console.error('[GOOGLE DRIVE FETCH ERROR]', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  return router;
}
