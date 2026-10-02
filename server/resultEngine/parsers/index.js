// ============================================================================
// PROFESSORVIRUS — PARSER ARCHITECTURE REGISTRY
// Central dispatcher that classifies and routes any uploaded AKTU result document
// ============================================================================

import { classifyDocument, DOCUMENT_TYPES } from './DocumentClassifier.js';
import { AktuOneViewParser } from './AktuOneViewParser.js';
import { AktuMarksheetParser } from './AktuMarksheetParser.js';
import { AktuConsolidatedParser } from './AktuConsolidatedParser.js';
import { OCRResultParser } from './OCRResultParser.js';

export { DOCUMENT_TYPES, classifyDocument };

export class UniversalResultEngine {
  constructor() {
    this.oneViewParser = new AktuOneViewParser();
    this.marksheetParser = new AktuMarksheetParser();
    this.consolidatedParser = new AktuConsolidatedParser();
    this.ocrParser = new OCRResultParser();
  }

  /**
   * Route and parse document automatically based on detected structure
   * @param {string} text - Raw extracted text
   * @param {object} metadata - File metadata { pageCount, fileSize, fileName }
   * @param {Buffer} fileBuffer - Original file buffer
   * @returns {Promise<{ parserUsed: string, classification: object, result: object }>}
   */
  async parseDocument(text = '', metadata = {}, fileBuffer = null) {
    // 1. Classify document
    const classification = classifyDocument(text, metadata);

    let parser = this.marksheetParser;
    let parserName = 'AktuMarksheetParser';

    if (classification.isScanned || classification.documentType === DOCUMENT_TYPES.SCANNED_IMAGE) {
      parser = this.ocrParser;
      parserName = 'OCRResultParser';
    } else if (classification.documentType === DOCUMENT_TYPES.AKTU_ONE_VIEW) {
      parser = this.oneViewParser;
      parserName = 'AktuOneViewParser';
    } else if (classification.documentType === DOCUMENT_TYPES.AKTU_CONSOLIDATED) {
      parser = this.consolidatedParser;
      parserName = 'AktuConsolidatedParser';
    } else if (classification.documentType === DOCUMENT_TYPES.AKTU_SEMESTER_MARKSHEET || classification.documentType === DOCUMENT_TYPES.GENERIC_MARKSHEET) {
      parser = this.marksheetParser;
      parserName = 'AktuMarksheetParser';
    }

    // 2. Parse using selected parser
    const result = await parser.parse(text, metadata, fileBuffer);

    return {
      parserUsed: parserName,
      classification,
      result
    };
  }
}

export const universalResultEngine = new UniversalResultEngine();
