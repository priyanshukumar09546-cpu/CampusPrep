// PDF Processing Pipeline
// Handles file validation, text extraction, OCR fallback, and page-aware processing

/**
 * Validate uploaded file before processing
 * @param {object} file - Multer file object { buffer, mimetype, originalname, size }
 * @returns {{ valid: boolean, error: string|null, info: object }}
 */
export function validatePdfFile(file) {
  if (!file || !file.buffer) {
    return { valid: false, error: 'No file provided', info: {} };
  }

  const info = {
    originalName: file.originalname || 'unknown.pdf',
    size: file.buffer.length,
    sizeReadable: `${(file.buffer.length / 1024 / 1024).toFixed(2)} MB`,
    mimetype: file.mimetype
  };

  // Size validation (max 25MB)
  const MAX_SIZE = 25 * 1024 * 1024;
  if (file.buffer.length > MAX_SIZE) {
    return { valid: false, error: `File too large (${info.sizeReadable}). Maximum allowed: 25 MB.`, info };
  }

  // Empty file
  if (file.buffer.length < 100) {
    return { valid: false, error: 'File appears to be empty or corrupted.', info };
  }

  // MIME type validation
  const validMimes = ['application/pdf', 'application/x-pdf'];
  const isPdfMime = validMimes.includes(file.mimetype);
  const isPdfExtension = file.originalname?.toLowerCase()?.endsWith('.pdf');

  if (!isPdfMime && !isPdfExtension) {
    return { valid: false, error: 'Invalid file format. Please upload a PDF file (.pdf).', info };
  }

  // PDF magic bytes check (%PDF-)
  const header = file.buffer.slice(0, 5).toString('ascii');
  if (!header.startsWith('%PDF')) {
    return { valid: false, error: 'File does not appear to be a valid PDF document.', info };
  }

  info.isValidPdf = true;
  return { valid: true, error: null, info };
}

/**
 * Extract text from PDF using pdf-parse
 * @param {Buffer} pdfBuffer
 * @returns {Promise<{ text: string, pageCount: number, metadata: object, error: string|null }>}
 */
export async function extractPdfText(pdfBuffer) {
  try {
    const { PDFParse } = await import('pdf-parse');
    const uint8Data = new Uint8Array(pdfBuffer);
    const parser = new PDFParse(uint8Data);
    const textResult = await parser.getText();

    const text = textResult?.text || '';
    const metadata = {};

    // Try to get page count
    let pageCount = 1;
    try {
      const metaResult = await parser.getMetadata();
      if (metaResult?.info) {
        metadata.title = metaResult.info.Title || null;
        metadata.author = metaResult.info.Author || null;
        metadata.creator = metaResult.info.Creator || null;
      }
      // Estimate page count from text structure
      // pdf-parse v2 doesn't always give page count directly
      const pageBreaks = text.split(/\f/).length;
      if (pageBreaks > 1) pageCount = pageBreaks;
    } catch (_) {}

    return { text, pageCount, metadata, error: null };
  } catch (err) {
    if (/password|encrypt/i.test(err.message)) {
      return { text: '', pageCount: 0, metadata: {}, error: 'PDF is password-protected. Please upload an unprotected copy.' };
    }
    return { text: '', pageCount: 0, metadata: {}, error: `PDF text extraction failed: ${err.message}` };
  }
}

/**
 * Determine if OCR is needed based on extracted text quality
 * @param {string} text - Extracted text
 * @param {number} pageCount
 * @returns {{ needsOcr: boolean, reason: string }}
 */
export function assessOcrNeed(text, pageCount) {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return { needsOcr: true, reason: 'No text could be extracted - document may be scanned/image-based' };
  }

  // Very little text relative to page count
  const charsPerPage = trimmed.length / Math.max(1, pageCount);
  if (charsPerPage < 50) {
    return { needsOcr: true, reason: `Very little text extracted (${Math.round(charsPerPage)} chars/page)` };
  }

  // Check for gibberish ratio (too many non-ASCII chars or special characters)
  const alphanumericRatio = (trimmed.match(/[a-zA-Z0-9]/g) || []).length / trimmed.length;
  if (alphanumericRatio < 0.3) {
    return { needsOcr: true, reason: 'Extracted text appears garbled - may need OCR' };
  }

  return { needsOcr: false, reason: 'Text extraction appears adequate' };
}

/**
 * Run OCR on PDF buffer using Tesseract.js
 * Processes up to maxPages pages
 * @param {Buffer} pdfBuffer
 * @param {number} maxPages - Maximum pages to OCR (default 10)
 * @returns {Promise<{ text: string, pagesProcessed: number, error: string|null }>}
 */
export async function runOcr(pdfBuffer, maxPages = 10) {
  try {
    // First try to extract images from the PDF
    const { PDFParse } = await import('pdf-parse');
    const uint8Data = new Uint8Array(pdfBuffer);
    const parser = new PDFParse(uint8Data);

    let images = [];
    try {
      const imgResult = await parser.getImage({ imageBuffer: true });
      if (imgResult?.pages) {
        for (const page of imgResult.pages) {
          if (page.images) {
            for (const img of page.images) {
              if (img.data && img.data.length > 1000) {
                images.push(img.data);
              }
            }
          }
        }
      }
    } catch (_) {}

    if (images.length === 0) {
      return { text: '', pagesProcessed: 0, error: 'No processable images found in PDF for OCR' };
    }

    // Run Tesseract OCR on extracted images
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker('eng');
    
    let fullText = '';
    let pagesProcessed = 0;

    for (const imgData of images.slice(0, maxPages)) {
      try {
        const ocrResult = await worker.recognize(imgData);
        if (ocrResult?.data?.text) {
          fullText += ocrResult.data.text + '\n\f\n';
          pagesProcessed++;
        }
      } catch (pageErr) {
        console.warn(`[OCR] Page ${pagesProcessed + 1} failed:`, pageErr.message);
      }
    }

    await worker.terminate();

    return { text: fullText, pagesProcessed, error: null };
  } catch (err) {
    return { text: '', pagesProcessed: 0, error: `OCR processing failed: ${err.message}` };
  }
}

/**
 * Sanitize filename for logging/display
 * @param {string} name
 * @returns {string}
 */
export function sanitizeFileName(name) {
  if (!name) return 'result.pdf';
  // Remove path separators, control characters
  return name.replace(/[/\\<>:"|?*\x00-\x1f]/g, '_').slice(0, 100);
}
