// ============================================================================
// PROFESSORVIRUS — BASE RESULT PARSER
// Universal Abstract Interface for all Academic Result Parsers
// Implements Source-of-Truth Metadata Contract (Section 3 & 32)
// ============================================================================

export const SOURCE_TYPES = {
  OFFICIAL: 'OFFICIAL',         // Explicitly printed in source document
  CALCULATED: 'CALCULATED',     // Mathematically derived from validated official data
  INFERRED: 'INFERRED',         // Statistically or heuristically estimated (clearly labeled)
  UNAVAILABLE: 'UNAVAILABLE'    // Required info does not exist in the source
};

/**
 * Creates a metadata-wrapped academic field
 * @param {any} value
 * @param {string} sourceType - OFFICIAL | CALCULATED | INFERRED | UNAVAILABLE
 * @param {string} source - Description of origin
 * @param {number} confidence - 0.0 to 1.0
 * @param {number|null} sourcePage - Page number where found
 * @returns {object} Field descriptor
 */
export function createField(value = null, sourceType = SOURCE_TYPES.UNAVAILABLE, source = 'unspecified', confidence = 0.0, sourcePage = 1) {
  const isAvailable = value !== null && value !== undefined && value !== '';
  return {
    value: isAvailable ? value : null,
    sourceType: isAvailable ? sourceType : SOURCE_TYPES.UNAVAILABLE,
    source,
    confidence: isAvailable ? confidence : 0.0,
    sourcePage
  };
}

export class BaseResultParser {
  constructor(name = 'BaseResultParser') {
    this.name = name;
  }

  /**
   * Determine whether this parser can handle the provided text/metadata
   * @param {string} text - Raw extracted text
   * @param {object} metadata - Document metadata
   * @returns {boolean}
   */
  canParse(text = '', metadata = {}) {
    throw new Error(`${this.name}.canParse() must be implemented by subclass`);
  }

  /**
   * Parse document and return canonical extraction
   * @param {string} text - Raw extracted text
   * @param {object} metadata - Document metadata
   * @param {Buffer} fileBuffer - Original file buffer
   * @returns {Promise<object>} Standardized extraction matching Section 32 schema
   */
  async parse(text = '', metadata = {}, fileBuffer = null) {
    throw new Error(`${this.name}.parse() must be implemented by subclass`);
  }
}
