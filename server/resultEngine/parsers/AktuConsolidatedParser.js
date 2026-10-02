// ============================================================================
// PROFESSORVIRUS — AKTU CONSOLIDATED RESULT PARSER
// Specialized parser for multi-semester consolidated transcripts and grade reports
// Handles multi-page academic histories (2, 4, 6, 8 semesters) dynamically
// ============================================================================

import { BaseResultParser, SOURCE_TYPES, createField } from './BaseResultParser.js';
import { AktuMarksheetParser } from './AktuMarksheetParser.js';

export class AktuConsolidatedParser extends BaseResultParser {
  constructor() {
    super('AktuConsolidatedParser');
    this.marksheetParser = new AktuMarksheetParser();
  }

  canParse(text = '', metadata = {}) {
    return /Consolidated\s*(?:Grade|Marksheet|Transcript)|Academic\s*History/i.test(text) ||
      (metadata.pageCount >= 2 && /(?:Semester\s*I|Sem\s*1).*(?:Semester\s*II|Sem\s*2)/is.test(text));
  }

  async parse(rawText = '', metadata = {}) {
    // Utilize the robust multi-semester section chunker from marksheet parser
    const result = await this.marksheetParser.parse(rawText, metadata);
    result.document.documentType = 'aktu_consolidated';
    result.document.confidence = 0.96;
    return result;
  }
}
