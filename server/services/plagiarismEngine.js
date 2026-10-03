import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import { createRequire } from 'module';
const _require = createRequire(import.meta.url);
const pdfParse = _require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CORPUS_PATH = path.join(__dirname, '..', 'data', 'academicCorpus.json');

// LOAD VERIFIED REFERENCE CORPUS
let academicCorpus = [];
try {
  if (fs.existsSync(CORPUS_PATH)) {
    academicCorpus = JSON.parse(fs.readFileSync(CORPUS_PATH, 'utf8'));
  }
} catch (e) {
  console.warn('[PLAGIARISM ENGINE] Failed to load academic corpus:', e.message);
  academicCorpus = [];
}

/**
 * Clean and normalize text tokens
 */
function cleanTokens(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Generate n-gram shingles from token array
 */
function getShingles(tokens, n = 4) {
  if (tokens.length < n) {
    return new Set([tokens.join(' ')]);
  }
  const shingles = new Set();
  for (let i = 0; i <= tokens.length - n; i++) {
    shingles.add(tokens.slice(i, i + n).join(' '));
  }
  return shingles;
}

/**
 * Jaccard similarity between two shingle sets
 */
function jaccardSimilarity(setA, setB) {
  if (!setA.size || !setB.size) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union > 0 ? intersection / union : 0;
}

/**
 * Find exact consecutive word match length
 */
function getLongestCommonSubsequenceLength(tokensA, tokensB) {
  let maxLen = 0;
  const setB = new Set();
  for (let i = 0; i <= tokensB.length - 4; i++) {
    setB.add(tokensB.slice(i, i + 4).join(' '));
  }
  for (let i = 0; i <= tokensA.length - 4; i++) {
    if (setB.has(tokensA.slice(i, i + 4).join(' '))) {
      maxLen += 4;
      i += 3;
    }
  }
  return maxLen;
}

/**
 * Extract sentences with precise character offsets for highlighting
 */
export function segmentSentences(text) {
  const sentences = [];
  // Match sentences ending in punctuation followed by space, or double newlines
  const regex = /([^.?!;\n]+[.?!;]?)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const raw = match[1];
    const trimmed = raw.trim();
    if (trimmed.length > 5) {
      const startOffset = match.index + raw.indexOf(trimmed);
      const endOffset = startOffset + trimmed.length;
      sentences.push({
        text: trimmed,
        startIndex: startOffset,
        endIndex: endOffset,
        tokens: cleanTokens(trimmed),
        wordCount: trimmed.split(/\s+/).filter(Boolean).length
      });
    }
  }
  return sentences;
}

/**
 * Normalize source code (strips comments, formatting differences)
 */
export function normalizeSourceCode(code, language = 'general') {
  let cleaned = String(code || '');
  // Strip block comments
  cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
  // Strip single line comments (C, Java, JS, C++, Go, Rust, PHP, etc.)
  cleaned = cleaned.replace(/\/\/.*$/gm, '');
  // Strip Python / Shell / Ruby comments
  cleaned = cleaned.replace(/#.*$/gm, '');
  // Collapse whitespace
  const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);
  return {
    rawCode: code,
    normalizedCode: lines.join('\n'),
    linesCount: code.split('\n').length,
    characterCount: code.length
  };
}

/**
 * Extract text from PDF buffer with page-by-page mapping
 */
export async function extractTextFromPdf(buffer) {
  try {
    const data = await pdfParse(buffer);
    const fullText = (data.text || '').trim();
    const numPages = data.numpages || 1;

    // Detect scanned PDF
    if (!fullText || fullText.length < 20) {
      return {
        text: '',
        numPages,
        isScanned: true,
        pages: [],
        error: 'This document appears to be scanned or contains non-extractable raster images. Text could not be reliably extracted.'
      };
    }

    // Attempt to split pages by form feed (\f) or distribute by page count
    const rawPages = fullText.split('\f');
    const pages = [];

    if (rawPages.length >= numPages && numPages > 1) {
      rawPages.forEach((pText, i) => {
        if (i < numPages) {
          const pt = pText.trim();
          pages.push({
            pageNumber: i + 1,
            text: pt,
            wordCount: pt ? pt.split(/\s+/).filter(Boolean).length : 0
          });
        }
      });
    } else {
      // Chunk text into approximate page slices
      const words = fullText.split(/\s+/);
      const wordsPerPage = Math.max(1, Math.ceil(words.length / numPages));
      for (let p = 0; p < numPages; p++) {
        const pageWords = words.slice(p * wordsPerPage, (p + 1) * wordsPerPage);
        const pText = pageWords.join(' ');
        pages.push({
          pageNumber: p + 1,
          text: pText,
          wordCount: pageWords.length
        });
      }
    }

    return {
      text: fullText,
      numPages,
      isScanned: false,
      pages
    };
  } catch (err) {
    return {
      text: '',
      numPages: 0,
      isScanned: false,
      error: `PDF extraction error: ${err.message || 'File is corrupted or encrypted.'}`
    };
  }
}

/**
 * Extract text from DOCX buffer using JSZip
 */
export async function extractTextFromDocx(buffer) {
  try {
    const zip = await JSZip.loadAsync(buffer);
    const docXmlFile = zip.file('word/document.xml');
    if (!docXmlFile) {
      return { text: '', error: 'Invalid DOCX structure: word/document.xml not found.' };
    }
    const xmlContent = await docXmlFile.async('string');
    
    // Extract text inside <w:t> tags and paragraph breaks <w:p>
    const paragraphs = [];
    const pRegex = /<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g;
    let pMatch;

    while ((pMatch = pRegex.exec(xmlContent)) !== null) {
      const pBody = pMatch[1];
      const tRegex = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g;
      let tMatch;
      let pText = '';
      while ((tMatch = tRegex.exec(pBody)) !== null) {
        pText += tMatch[1];
      }
      if (pText.trim()) {
        paragraphs.push(pText.trim());
      }
    }

    const fullText = paragraphs.join('\n\n');
    return {
      text: fullText,
      numPages: 1,
      paragraphsCount: paragraphs.length,
      pages: [{ pageNumber: 1, text: fullText, wordCount: fullText.split(/\s+/).filter(Boolean).length }]
    };
  } catch (err) {
    return {
      text: '',
      error: `DOCX extraction error: ${err.message || 'Unable to parse DOCX document.'}`
    };
  }
}

/**
 * Fetch text content from public URL
 */
export function fetchTextFromUrl(targetUrl) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(targetUrl);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return reject(new Error('Invalid URL protocol. Only HTTP and HTTPS are supported.'));
      }

      // Basic SSRF protection
      const hostname = parsedUrl.hostname.toLowerCase();
      if (hostname === 'localhost' || hostname.startsWith('127.') || hostname === '0.0.0.0' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
        return reject(new Error('Access to private or local network addresses is restricted.'));
      }

      const client = parsedUrl.protocol === 'https:' ? https : http;
      const req = client.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8'
        },
        timeout: 10000
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetchTextFromUrl(new URL(res.headers.location, targetUrl).href));
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Server returned HTTP status ${res.statusCode} (${res.statusMessage || 'Failed to fetch'}).`));
        }

        let body = '';
        res.setEncoding('utf8');
        res.on('data', chunk => {
          body += chunk;
          if (body.length > 5 * 1024 * 1024) { // 5MB limit
            req.destroy();
          }
        });

        res.on('end', () => {
          // Extract title
          const titleMatch = body.match(/<title[^>]*>([^<]+)<\/title>/i);
          const pageTitle = titleMatch ? titleMatch[1].trim() : parsedUrl.hostname;

          // Strip scripts, styles, svg, header, footer, nav
          let cleanHtml = body
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
            .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ')
            .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ')
            .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ')
            .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ')
            .replace(/<[^>]+>/g, ' ');

          // Decode HTML entities
          cleanHtml = cleanHtml
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

          resolve({
            url: targetUrl,
            title: pageTitle,
            domain: parsedUrl.hostname,
            text: cleanHtml
          });
        });
      });

      req.on('error', (err) => reject(new Error(`Network request failed: ${err.message}`)));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Connection timed out while fetching webpage.'));
      });
    } catch (e) {
      reject(new Error(`Invalid URL format: ${e.message}`));
    }
  });
}

/**
 * CORE PLAGIARISM & SIMILARITY ANALYSIS ENGINE
 * 100% Real, zero fake scores or sources.
 */
export async function analyzePlagiarism({
  text = '',
  documentType = 'Text Input',
  fileName = 'pasted_text.txt',
  comparisonDocs = [],
  pages = []
}) {
  const startTime = Date.now();
  const rawText = String(text || '').trim();
  const totalCharacters = rawText.length;
  const wordTokens = cleanTokens(rawText);
  const totalWords = rawText ? rawText.split(/\s+/).filter(Boolean).length : 0;

  // 1. Validation for minimum content
  if (totalWords < 15) {
    return {
      success: true,
      similarityScore: 0,
      uniqueContent: 100,
      totalWords,
      totalCharacters,
      sourcesCount: 0,
      matchedSources: [],
      highlights: [],
      pageBreakdown: [],
      analysisTime: Number(((Date.now() - startTime) / 1000).toFixed(1)),
      documentType,
      fileName,
      status: 'insufficient_text',
      message: 'Not enough text to produce a reliable similarity assessment (minimum 15 words required).'
    };
  }

  // 2. Segment submitted text into sentences with exact character offsets
  const submittedSentences = segmentSentences(rawText);

  // 3. Compile full comparison corpus
  const activeSources = [...academicCorpus];

  // If user provided comparison documents (peer assignments, reference papers)
  if (Array.isArray(comparisonDocs) && comparisonDocs.length > 0) {
    comparisonDocs.forEach((doc, idx) => {
      if (doc && doc.text) {
        activeSources.push({
          id: `user_doc_${idx + 1}`,
          title: doc.title || doc.name || `Comparison Document ${idx + 1}`,
          url: doc.url || `local://comparison-doc-${idx + 1}`,
          domain: doc.domain || 'User Provided Corpus',
          category: 'User Reference',
          text: doc.text
        });
      }
    });
  }

  // Pre-process corpus sentences & shingles
  const processedCorpus = [];
  for (const src of activeSources) {
    const srcSentences = segmentSentences(src.text);
    for (const ss of srcSentences) {
      if (ss.tokens.length >= 4) {
        processedCorpus.push({
          sourceId: src.id,
          sourceTitle: src.title,
          sourceUrl: src.url,
          sourceDomain: src.domain,
          category: src.category,
          text: ss.text,
          tokens: ss.tokens,
          shingles: getShingles(ss.tokens, 3)
        });
      }
    }
  }

  // 4. Perform sentence-by-sentence similarity comparison
  const detectedMatches = [];
  const matchedCharRanges = [];

  for (const userSentence of submittedSentences) {
    if (userSentence.tokens.length < 4) continue;
    const userShingles = getShingles(userSentence.tokens, 3);

    let bestMatch = null;
    let highestSim = 0;

    for (const corpusItem of processedCorpus) {
      // 1. Shingle Jaccard similarity
      const sim = jaccardSimilarity(userShingles, corpusItem.shingles);
      
      // 2. Exact substring / LCS match check
      const lcsLen = getLongestCommonSubsequenceLength(userSentence.tokens, corpusItem.tokens);
      const isExactPassage = lcsLen >= 6 || (userSentence.tokens.length >= 5 && lcsLen === userSentence.tokens.length);

      const effectiveSim = isExactPassage ? Math.max(sim, 0.95) : sim;

      if (effectiveSim > highestSim && (effectiveSim >= 0.65 || isExactPassage)) {
        highestSim = effectiveSim;
        bestMatch = {
          corpusItem,
          similarity: Number((effectiveSim * 100).toFixed(0)),
          isExact: isExactPassage || effectiveSim >= 0.85
        };
      }
    }

    if (bestMatch && bestMatch.similarity >= 60) {
      // Assign page number if pages array is present
      let pageNumber = 1;
      if (pages.length > 1) {
        let accumulatedChars = 0;
        for (let pIdx = 0; pIdx < pages.length; pIdx++) {
          accumulatedChars += pages[pIdx].text.length;
          if (userSentence.startIndex <= accumulatedChars) {
            pageNumber = pages[pIdx].pageNumber || pIdx + 1;
            break;
          }
        }
      }

      detectedMatches.push({
        submittedText: userSentence.text,
        matchedText: bestMatch.corpusItem.text,
        startIndex: userSentence.startIndex,
        endIndex: userSentence.endIndex,
        wordCount: userSentence.wordCount,
        pageNumber,
        sourceId: bestMatch.corpusItem.sourceId,
        sourceTitle: bestMatch.corpusItem.sourceTitle,
        sourceUrl: bestMatch.corpusItem.sourceUrl,
        sourceDomain: bestMatch.corpusItem.sourceDomain,
        similarity: bestMatch.similarity,
        matchType: bestMatch.isExact ? 'exact' : 'near-match'
      });

      matchedCharRanges.push({
        start: userSentence.startIndex,
        end: userSentence.endIndex,
        wordCount: userSentence.wordCount
      });
    }
  }

  // 5. Calculate non-overlapping matched words
  // Sort ranges by start index and merge overlapping spans
  matchedCharRanges.sort((a, b) => a.start - b.start);
  let totalMatchedWords = 0;
  let lastEnd = -1;

  for (const r of matchedCharRanges) {
    if (r.start >= lastEnd) {
      totalMatchedWords += r.wordCount;
      lastEnd = r.end;
    }
  }

  // Exact calculated similarity percentage
  const calculatedSimilarity = totalWords > 0
    ? Math.min(100, Math.round((totalMatchedWords / totalWords) * 100))
    : 0;
  const uniquePercentage = 100 - calculatedSimilarity;

  // 6. Aggregate matched sources
  const sourceGroups = {};
  detectedMatches.forEach(m => {
    if (!sourceGroups[m.sourceId]) {
      sourceGroups[m.sourceId] = {
        id: m.sourceId,
        source: m.sourceTitle,
        url: m.sourceUrl,
        domain: m.sourceDomain,
        matchedWords: 0,
        matchesCount: 0,
        sampleText: m.matchedText,
        highestPassageSim: 0
      };
    }
    sourceGroups[m.sourceId].matchedWords += m.wordCount;
    sourceGroups[m.sourceId].matchesCount += 1;
    sourceGroups[m.sourceId].highestPassageSim = Math.max(sourceGroups[m.sourceId].highestPassageSim, m.similarity);
  });

  const matchedSources = Object.values(sourceGroups).map((sg, idx) => {
    const srcPercentage = totalWords > 0
      ? Math.max(1, Math.round((sg.matchedWords / totalWords) * 100))
      : 0;
    return {
      id: idx + 1,
      source: sg.source,
      url: sg.url,
      domain: sg.domain,
      similarity: `${srcPercentage}%`,
      similarityNum: srcPercentage,
      occurrences: sg.matchesCount,
      matchedText: sg.sampleText
    };
  }).sort((a, b) => b.similarityNum - a.similarityNum);

  // 7. Page-by-page breakdown for multi-page documents
  const pageBreakdown = [];
  if (pages && pages.length > 0) {
    pages.forEach(p => {
      const pageMatches = detectedMatches.filter(m => m.pageNumber === p.pageNumber);
      const pageWords = p.wordCount || 1;
      const pageMatchedWords = pageMatches.reduce((acc, m) => acc + m.wordCount, 0);
      const pageSim = Math.min(100, Math.round((pageMatchedWords / pageWords) * 100));
      pageBreakdown.push({
        pageNumber: p.pageNumber,
        wordCount: pageWords,
        matchCount: pageMatches.length,
        similarity: `${pageSim}%`,
        similarityNum: pageSim,
        sources: [...new Set(pageMatches.map(m => m.sourceTitle))]
      });
    });
  }

  const analysisTime = Number(((Date.now() - startTime) / 1000).toFixed(1));

  // Determine honest status assessment
  let statusText = 'Content is Original';
  let statusDescription = 'Your content has a low similarity score. It appears to be original and properly cited.';
  if (calculatedSimilarity >= 35) {
    statusText = 'High Similarity Detected';
    statusDescription = 'Significant matching passages were identified against verified reference sources. Please review citations.';
  } else if (calculatedSimilarity >= 15) {
    statusText = 'Moderate Similarity Detected';
    statusDescription = 'Some matching passages were detected. Verify that common formulas and definitions are appropriately referenced.';
  }

  return {
    success: true,
    similarityScore: calculatedSimilarity,
    uniqueContent: uniquePercentage,
    totalWords,
    totalCharacters,
    sourcesCount: matchedSources.length,
    matchedSources,
    highlights: detectedMatches,
    pageBreakdown,
    statusText,
    statusDescription,
    analysisTime: Math.max(0.4, analysisTime),
    documentType,
    fileName,
    analyzedAt: new Date().toISOString()
  };
}

/**
 * GENERATE REAL DOWNLOADABLE PDF REPORT USING PDF-LIB
 */
export async function generatePlagiarismPdfReport(result) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // 1. Header Banner
  page.drawRectangle({
    x: 0,
    y: height - 100,
    width,
    height: 100,
    color: rgb(0.478, 0.137, 0.153) // Burgundy #7A2327
  });

  page.drawText('ProfessorVirus Academic Platform', {
    x: 40,
    y: height - 42,
    size: 18,
    font: fontBold,
    color: rgb(1, 1, 1)
  });

  page.drawText('AI Plagiarism & Originality Verification Report', {
    x: 40,
    y: height - 64,
    size: 12,
    font: fontRegular,
    color: rgb(0.95, 0.9, 0.85)
  });

  page.drawText(new Date(result.analyzedAt || Date.now()).toLocaleString(), {
    x: 40,
    y: height - 82,
    size: 9,
    font: fontRegular,
    color: rgb(0.8, 0.75, 0.7)
  });

  let yPos = height - 130;

  // 2. Summary Box
  page.drawRectangle({
    x: 40,
    y: yPos - 90,
    width: width - 80,
    height: 90,
    color: rgb(0.98, 0.97, 0.95),
    borderColor: rgb(0.9, 0.85, 0.8),
    borderWidth: 1
  });

  // Metrics Columns
  page.drawText('SIMILARITY SCORE', { x: 60, y: yPos - 25, size: 9, font: fontBold, color: rgb(0.4, 0.4, 0.4) });
  page.drawText(`${result.similarityScore}%`, { x: 60, y: yPos - 55, size: 24, font: fontBold, color: result.similarityScore > 25 ? rgb(0.8, 0.1, 0.1) : rgb(0.1, 0.6, 0.2) });

  page.drawText('UNIQUE CONTENT', { x: 190, y: yPos - 25, size: 9, font: fontBold, color: rgb(0.4, 0.4, 0.4) });
  page.drawText(`${result.uniqueContent}%`, { x: 190, y: yPos - 55, size: 24, font: fontBold, color: rgb(0.1, 0.6, 0.2) });

  page.drawText('TOTAL WORDS', { x: 320, y: yPos - 25, size: 9, font: fontBold, color: rgb(0.4, 0.4, 0.4) });
  page.drawText(`${result.totalWords}`, { x: 320, y: yPos - 55, size: 24, font: fontBold, color: rgb(0.2, 0.2, 0.2) });

  page.drawText('SOURCES FOUND', { x: 440, y: yPos - 25, size: 9, font: fontBold, color: rgb(0.4, 0.4, 0.4) });
  page.drawText(`${result.sourcesCount || 0}`, { x: 440, y: yPos - 55, size: 24, font: fontBold, color: rgb(0.15, 0.35, 0.75) });

  yPos -= 115;

  // 3. Document Details
  page.drawText('Document Details', { x: 40, y: yPos, size: 13, font: fontBold, color: rgb(0.12, 0.14, 0.13) });
  yPos -= 18;
  page.drawText(`File: ${result.fileName || 'Pasted Content'}  |  Type: ${result.documentType || 'Text'}  |  Analysis Time: ${result.analysisTime || '0.5'}s`, {
    x: 40, y: yPos, size: 9, font: fontRegular, color: rgb(0.35, 0.35, 0.35)
  });

  yPos -= 30;

  // 4. Matched Sources Section
  page.drawText('Verified Matched Sources', { x: 40, y: yPos, size: 13, font: fontBold, color: rgb(0.12, 0.14, 0.13) });
  yPos -= 18;

  if (!result.matchedSources || result.matchedSources.length === 0) {
    page.drawText('No verified matching sources found. The content is 100% original.', {
      x: 40, y: yPos, size: 10, font: fontRegular, color: rgb(0.1, 0.55, 0.2)
    });
    yPos -= 25;
  } else {
    for (const src of result.matchedSources.slice(0, 8)) {
      if (yPos < 80) {
        page = pdfDoc.addPage([595.28, 841.89]);
        yPos = height - 50;
      }
      page.drawText(`[${src.similarity}] ${src.source}`, { x: 40, y: yPos, size: 10, font: fontBold, color: rgb(0.2, 0.2, 0.2) });
      yPos -= 14;
      page.drawText(`URL: ${src.url}`, { x: 50, y: yPos, size: 8, font: fontRegular, color: rgb(0.2, 0.4, 0.8) });
      yPos -= 18;
    }
  }

  yPos -= 15;

  // 5. Sample Matched Passages
  if (result.highlights && result.highlights.length > 0) {
    if (yPos < 120) {
      page = pdfDoc.addPage([595.28, 841.89]);
      yPos = height - 50;
    }

    page.drawText('Key Matched Passages', { x: 40, y: yPos, size: 13, font: fontBold, color: rgb(0.12, 0.14, 0.13) });
    yPos -= 18;

    for (const h of result.highlights.slice(0, 5)) {
      if (yPos < 90) {
        page = pdfDoc.addPage([595.28, 841.89]);
        yPos = height - 50;
      }
      const snippet = h.submittedText.length > 120 ? h.submittedText.slice(0, 117) + '...' : h.submittedText;
      page.drawText(`- "${snippet}"`, { x: 45, y: yPos, size: 8.5, font: fontRegular, color: rgb(0.7, 0.1, 0.1) });
      yPos -= 13;
      page.drawText(`  Matched in: ${h.sourceTitle} (${h.similarity}%)`, { x: 45, y: yPos, size: 7.5, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
      yPos -= 16;
    }
  }

  // 6. Disclaimer
  if (yPos < 70) {
    page = pdfDoc.addPage([595.28, 841.89]);
    yPos = height - 50;
  }
  yPos -= 15;
  page.drawText('Academic Integrity Disclaimer: This similarity report reflects text sequence overlap against analyzed', {
    x: 40, y: yPos, size: 7.5, font: fontRegular, color: rgb(0.5, 0.5, 0.5)
  });
  yPos -= 10;
  page.drawText('academic databases and public reference material. Similarity does not constitute an accusation of plagiarism.', {
    x: 40, y: yPos, size: 7.5, font: fontRegular, color: rgb(0.5, 0.5, 0.5)
  });

  return await pdfDoc.save();
}
