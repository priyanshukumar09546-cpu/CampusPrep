// ============================================================================
// PROFESSORVIRUS — OCR RESULT PARSER
// Fallback engine for scanned / image-only university result PDFs
// Executes OCR -> Cleans noisy text -> Routes to structural parser -> Validates
// ============================================================================

import { BaseResultParser } from './BaseResultParser.js';
import { runOcr } from '../pdfProcessor.js';
import { classifyDocument, DOCUMENT_TYPES } from './DocumentClassifier.js';
import { AktuOneViewParser } from './AktuOneViewParser.js';
import { AktuMarksheetParser } from './AktuMarksheetParser.js';

export class OCRResultParser extends BaseResultParser {
  constructor() {
    super('OCRResultParser');
    this.oneViewParser = new AktuOneViewParser();
    this.marksheetParser = new AktuMarksheetParser();
  }

  canParse(text = '', metadata = {}) {
    return (text || '').trim().length < 60 || metadata.isScanned;
  }

  async parse(rawText = '', metadata = {}, fileBuffer = null) {
    if (!fileBuffer) {
      return {
        document: {
          isStudentResult: false,
          documentType: 'invalid_document',
          confidence: 0.20,
          error: 'Document appears scanned or textless but no fileBuffer was provided for OCR.'
        },
        student: {},
        semesters: []
      };
    }

    // 1. Run OCR on document pages
    const ocrResult = await runOcr(fileBuffer, { maxPages: metadata.pageCount || 4 });
    const ocrText = ocrResult?.text || '';

    if (!ocrText || ocrText.trim().length < 30) {
      throw new Error('OCR recognition was unable to extract legible text from this scanned document.');
    }

    // 2. Classify OCR text
    const classification = classifyDocument(ocrText, {
      ...metadata,
      pageCount: ocrResult.pagesProcessed || 1
    });

    let result;
    if (classification.documentType === DOCUMENT_TYPES.AKTU_ONE_VIEW) {
      result = await this.oneViewParser.parse(ocrText, metadata);
    } else {
      result = await this.marksheetParser.parse(ocrText, metadata);
    }

    // Flag document as OCR-derived
    result.document.isOcr = true;
    result.document.confidence = Math.round(result.document.confidence * 0.88 * 100) / 100;
    result.document.documentType += '_ocr';

    return result;
  }
}
