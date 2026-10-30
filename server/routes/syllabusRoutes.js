import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import SyllabusModel from '../models/Syllabus.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'syllabus.json');

// Cache Directories & Manifest
const PUBLIC_CACHE_DIR = path.join(process.cwd(), 'public', 'assets', 'syllabus_cache');
const DIST_CACHE_DIR = path.join(process.cwd(), 'dist', 'assets', 'syllabus_cache');
const REL_PUBLIC_CACHE_DIR = path.join(__dirname, '..', '..', 'public', 'assets', 'syllabus_cache');
const CACHE_MAP_FILE = path.join(__dirname, '..', 'data', 'syllabusCacheMap.json');

// In-memory fallback dataset loaded from JSON file
let fallbackDataset = [];
try {
  if (fs.existsSync(DATA_FILE)) {
    fallbackDataset = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
} catch (err) {
  console.warn('[SYLLABUS ROUTES] Warning: Failed to load fallback syllabus.json:', err.message);
}

// In-memory cache mapping
let syllabusCacheMap = {};
function loadCacheMap() {
  try {
    if (fs.existsSync(CACHE_MAP_FILE)) {
      syllabusCacheMap = JSON.parse(fs.readFileSync(CACHE_MAP_FILE, 'utf8'));
    }
  } catch (e) {
    console.warn('[SYLLABUS CACHE MAP LOAD WARNING]', e.message);
  }
}
loadCacheMap();

// SSRF Host Validator: Only allow trusted university & document domains
function isAllowedHost(hostname) {
  if (!hostname || typeof hostname !== 'string') return false;
  const host = hostname.toLowerCase();

  // Block private and loopback IP spaces
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '::1' ||
    host === '0.0.0.0' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.startsWith('10.') ||
    host.startsWith('192.168.') ||
    host.startsWith('169.254.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  ) {
    return false;
  }

  // Allowed official academic and resource hostnames
  const allowedExact = [
    'aktu.ac.in',
    'fms.aktu.ac.in',
    'erp.aktu.ac.in',
    'drive.google.com',
    'docs.google.com',
    'professorvirus.site'
  ];

  if (allowedExact.includes(host)) return true;
  if (host.endsWith('.aktu.ac.in')) return true;
  if (host.endsWith('.google.com')) return true;
  if (host.endsWith('.googleusercontent.com')) return true;

  return false;
}

// Find local cached file path for a given URL
function getCachedFilePath(targetUrl) {
  loadCacheMap();
  const candidateDirs = [
    PUBLIC_CACHE_DIR,
    DIST_CACHE_DIR,
    REL_PUBLIC_CACHE_DIR,
    path.join(process.cwd(), 'dist', 'assets', 'syllabus_cache'),
    path.join(process.cwd(), 'public', 'assets', 'syllabus_cache'),
    path.join(__dirname, '..', '..', 'public', 'assets', 'syllabus_cache')
  ];

  if (!targetUrl || typeof targetUrl !== 'string') return null;

  const cleanUrl = targetUrl.trim();
  const urlVariants = [
    cleanUrl,
    decodeURI(cleanUrl),
    encodeURI(cleanUrl),
    cleanUrl.replace(/ /g, '%20'),
    cleanUrl.replace(/%20/g, ' ')
  ];

  // 1. Direct match in manifest
  for (const v of urlVariants) {
    if (syllabusCacheMap[v]?.filename) {
      const fn = syllabusCacheMap[v].filename;
      for (const dir of candidateDirs) {
        const p = path.join(dir, fn);
        if (fs.existsSync(p) && fs.statSync(p).size > 1000) return p;
      }
    }
  }

  // 2. Hash prefix search in candidate cache directories
  const hashes = urlVariants.map(v => {
    try {
      return crypto.createHash('md5').update(v).digest('hex').slice(0, 12);
    } catch (_) {
      return null;
    }
  }).filter(Boolean);

  for (const dir of candidateDirs) {
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        for (const h of hashes) {
          const match = files.find(f => f.startsWith(h));
          if (match) {
            const fullPath = path.join(dir, match);
            if (fs.existsSync(fullPath) && fs.statSync(fullPath).size > 1000) {
              return fullPath;
            }
          }
        }
      } catch (_) {}
    }
  }

  // 3. Basename filename search in candidate directories
  try {
    const rawBase = path.basename(decodeURI(cleanUrl)).replace(/[^a-zA-Z0-9._-]/g, '_');
    if (rawBase && rawBase.length > 5) {
      for (const dir of candidateDirs) {
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          const match = files.find(f => f.endsWith(rawBase) || f.includes(rawBase));
          if (match) {
            const fullPath = path.join(dir, match);
            if (fs.existsSync(fullPath) && fs.statSync(fullPath).size > 1000) {
              return fullPath;
            }
          }
        }
      }
    }
  } catch (_) {}

  return null;
}

// Stream local PDF with Byte-Range (206 Partial Content) support
function streamLocalPdf(filePath, req, res) {
  try {
    const stat = fs.statSync(filePath);
    const totalSize = stat.size;
    const range = req.headers.range;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="syllabus.pdf"');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Accept');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges, X-PDF-Source, X-PDF-Proxy-Error');
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    res.setHeader('X-PDF-Source', 'local-cache');

    if (req.method === 'HEAD') {
      res.setHeader('Content-Length', totalSize);
      return res.status(200).end();
    }

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

      if (isNaN(start) || start >= totalSize || (end && end >= totalSize) || start > end) {
        res.setHeader('Content-Range', `bytes */${totalSize}`);
        return res.status(416).json({ success: false, error: 'Requested range not satisfiable' });
      }

      const chunkSize = (end - start) + 1;
      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${totalSize}`);
      res.setHeader('Content-Length', chunkSize);

      const stream = fs.createReadStream(filePath, { start, end });
      stream.pipe(res);
    } else {
      res.setHeader('Content-Length', totalSize);
      res.status(200);
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    }
  } catch (err) {
    console.error('[STREAM LOCAL PDF ERROR]', err.message);
    if (!res.headersSent) {
      res.setHeader('X-PDF-Proxy-Error', 'true');
      res.status(500).json({ success: false, error: 'Failed to read cached PDF file' });
    }
  }
}

export function createSyllabusRouter() {
  const router = express.Router();

  // Helper: Get all active syllabus records (from DB if connected, otherwise fallback JSON)
  const getRecords = async (query = {}) => {
    try {
      if (SyllabusModel && SyllabusModel.db && SyllabusModel.db.readyState === 1) {
        const dbDocs = await SyllabusModel.find(query).lean();
        if (dbDocs && dbDocs.length > 0) {
          return dbDocs;
        }
      }
    } catch (e) {
      console.warn('[SYLLABUS DB QUERY FAILED - FALLBACK TO JSON]', e.message);
    }

    // Filter fallback JSON
    return fallbackDataset.filter(item => {
      if (query.isActive !== undefined && item.isActive !== query.isActive) return false;
      if (query.course && item.course !== query.course) return false;
      if (query.branch && item.branch !== query.branch) return false;
      if (query.academicSession && item.academicSession !== query.academicSession) return false;
      if (query.year && item.year !== query.year) return false;
      if (query.semester) {
        const matchesSem = item.semester === query.semester || 
          (Array.isArray(item.applicableSemesters) && item.applicableSemesters.includes(query.semester));
        if (!matchesSem) return false;
      }
      return true;
    });
  };

  // -------------------------------------------------------------------------
  // 1. GET /api/syllabus - List & Filter Syllabus Records
  // -------------------------------------------------------------------------
  router.get('/', async (req, res) => {
    try {
      const { course, branch, academicSession, year, semester, search, includeInactive } = req.query;

      const query = {};
      if (!includeInactive || includeInactive === 'false') {
        query.isActive = true;
      }
      if (course && course !== 'All') query.course = course;
      if (branch && branch !== 'All') query.branch = branch;
      if (academicSession && academicSession !== 'All') query.academicSession = academicSession;
      if (year && year !== 'All') query.year = year;

      let records = await getRecords(query);

      // Filter by semester if specified
      if (semester && semester !== 'All') {
        const semNorm = semester.toLowerCase().replace('semester ', 'sem ');
        records = records.filter(r => {
          const rSem = (r.semester || '').toLowerCase().replace('semester ', 'sem ');
          if (rSem === semNorm) return true;
          if (Array.isArray(r.applicableSemesters)) {
            return r.applicableSemesters.some(s => s.toLowerCase().replace('semester ', 'sem ') === semNorm);
          }
          return false;
        });
      }

      // Filter by search query if provided
      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        records = records.filter(r => {
          return (r.subjectName && r.subjectName.toLowerCase().includes(q)) ||
                 (r.subjectCode && r.subjectCode.toLowerCase().includes(q)) ||
                 (r.branch && r.branch.toLowerCase().includes(q)) ||
                 (r.sourceTitle && r.sourceTitle.toLowerCase().includes(q)) ||
                 (Array.isArray(r.units) && r.units.some(u => 
                   (u.title && u.title.toLowerCase().includes(q)) ||
                   (u.topics && u.topics.toLowerCase().includes(q))
                 ));
        });
      }

      return res.status(200).json({
        success: true,
        count: records.length,
        data: records
      });
    } catch (err) {
      console.error('[SYLLABUS GET ERROR]', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------------------
  // 2. GET /api/syllabus/filters - Dynamic Filter Options
  // -------------------------------------------------------------------------
  router.get('/filters', async (req, res) => {
    try {
      const { course } = req.query;
      const allRecords = await getRecords({ isActive: true });

      const courses = Array.from(new Set(allRecords.map(r => r.course).filter(Boolean)));
      
      const filteredByCourse = course && course !== 'All' 
        ? allRecords.filter(r => r.course === course) 
        : allRecords;

      const branches = Array.from(new Set(filteredByCourse.map(r => r.branch).filter(Boolean)));
      const sessions = Array.from(new Set(filteredByCourse.map(r => r.academicSession).filter(Boolean))).sort().reverse();
      const years = Array.from(new Set(filteredByCourse.map(r => r.year).filter(Boolean)));

      return res.status(200).json({
        success: true,
        courses,
        branches,
        sessions,
        years
      });
    } catch (err) {
      console.error('[SYLLABUS FILTERS ERROR]', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------------------
  // 3. GET /api/syllabus/pdf-proxy - Secure PDF Streaming Proxy & Cache
  // High reliability: Serves from local pre-cache first, with SSRF protection,
  // byte-range streaming, magic-byte verification, and graceful error handling.
  // -------------------------------------------------------------------------
  router.all('/pdf-proxy', (req, res) => {
    // Handle CORS preflight options immediately
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Accept');
      res.setHeader('Access-Control-Max-Age', '86400');
      return res.status(204).end();
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.setHeader('X-PDF-Proxy-Error', 'true');
      res.setHeader('Content-Type', 'application/json');
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const targetUrl = req.query.url;
    if (!targetUrl || typeof targetUrl !== 'string' || !targetUrl.startsWith('http')) {
      res.setHeader('X-PDF-Proxy-Error', 'true');
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ success: false, error: 'Valid URL parameter is required' });
    }

    try {
      const parsed = new URL(targetUrl);

      // SSRF Validation: Check hostname against allowlist
      if (!isAllowedHost(parsed.hostname)) {
        res.setHeader('X-PDF-Proxy-Error', 'true');
        res.setHeader('Content-Type', 'application/json');
        return res.status(403).json({
          success: false,
          error: `Access to hostname "${parsed.hostname}" is not permitted for proxying`,
          code: 'SSRF_BLOCKED'
        });
      }

      // 1. TIER 1: Check Local Cache First (0ms latency, zero timeout risk)
      const cachedFile = getCachedFilePath(targetUrl);
      if (cachedFile) {
        return streamLocalPdf(cachedFile, req, res);
      }

      // 2. TIER 2: Safe Outbound Fetch with Redirects & Verification
      const fetchWithRetry = (currentUrl, redirectCount = 0) => {
        if (redirectCount > 3) {
          res.setHeader('X-PDF-Proxy-Error', 'true');
          res.setHeader('Content-Type', 'application/json');
          return res.status(502).json({ success: false, error: 'Too many redirects', code: 'TOO_MANY_REDIRECTS' });
        }

        const currentParsed = new URL(currentUrl);
        if (!isAllowedHost(currentParsed.hostname)) {
          res.setHeader('X-PDF-Proxy-Error', 'true');
          res.setHeader('Content-Type', 'application/json');
          return res.status(403).json({ success: false, error: 'Redirected host is not permitted', code: 'SSRF_BLOCKED' });
        }

        const client = currentParsed.protocol === 'https:' ? https : http;

        const requestHeaders = {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/pdf,*/*'
        };

        if (req.headers.range) {
          requestHeaders['Range'] = req.headers.range;
        }

        const proxyReq = client.get(encodeURI(currentUrl), {
          headers: requestHeaders,
          rejectUnauthorized: false,
          timeout: 15000
        }, (proxyRes) => {
          // Handle redirects safely
          if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
            let redir = proxyRes.headers.location;
            if (!redir.startsWith('http')) redir = new URL(redir, currentParsed.origin).href;
            return fetchWithRetry(redir, redirectCount + 1);
          }

          if (proxyRes.statusCode === 404) {
            res.setHeader('X-PDF-Proxy-Error', 'true');
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({
              success: false,
              error: 'The syllabus PDF was not found on the university portal (HTTP 404)',
              code: 'UPSTREAM_NOT_FOUND'
            });
          }

          if (proxyRes.statusCode !== 200 && proxyRes.statusCode !== 206) {
            res.setHeader('X-PDF-Proxy-Error', 'true');
            res.setHeader('Content-Type', 'application/json');
            return res.status(502).json({
              success: false,
              error: `University server returned status ${proxyRes.statusCode}`,
              code: `UPSTREAM_STATUS_${proxyRes.statusCode}`
            });
          }

          // If HEAD request, respond with upstream headers immediately
          if (req.method === 'HEAD') {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="syllabus.pdf"');
            res.setHeader('Accept-Ranges', 'bytes');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges, X-PDF-Source, X-PDF-Proxy-Error');
            if (proxyRes.headers['content-length']) res.setHeader('Content-Length', proxyRes.headers['content-length']);
            if (proxyRes.headers['content-range']) res.setHeader('Content-Range', proxyRes.headers['content-range']);
            return res.status(proxyRes.statusCode).end();
          }

          // Buffer first chunk to verify magic bytes (%PDF-)
          let firstChunkReceived = false;
          let tempChunks = [];
          let tempLength = 0;

          proxyRes.on('data', (chunk) => {
            if (!firstChunkReceived) {
              tempChunks.push(chunk);
              tempLength += chunk.length;

              if (tempLength >= 5) {
                firstChunkReceived = true;
                const headerBuffer = Buffer.concat(tempChunks);
                const magic = headerBuffer.slice(0, 5).toString('ascii');

                // If range request starting > 0, magic bytes might not be at offset 0
                const isNonZeroRange = req.headers.range && !req.headers.range.includes('bytes=0-');
                if (!isNonZeroRange && !magic.startsWith('%PDF-')) {
                  proxyRes.destroy();
                  res.setHeader('X-PDF-Proxy-Error', 'true');
                  res.setHeader('Content-Type', 'application/json');
                  return res.status(502).json({
                    success: false,
                    error: 'University server returned an invalid or HTML document instead of a PDF',
                    code: 'INVALID_PDF_FORMAT'
                  });
                }

                // Valid PDF! Set headers and stream
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'inline; filename="syllabus.pdf"');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Accept');
                res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges, X-PDF-Source, X-PDF-Proxy-Error');
                res.setHeader('Accept-Ranges', 'bytes');
                res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
                res.setHeader('X-PDF-Source', 'upstream-stream');

                if (proxyRes.headers['content-length']) {
                  res.setHeader('Content-Length', proxyRes.headers['content-length']);
                }
                if (proxyRes.headers['content-range']) {
                  res.setHeader('Content-Range', proxyRes.headers['content-range']);
                }

                res.status(proxyRes.statusCode || 200);
                res.write(headerBuffer);
              }
            } else {
              res.write(chunk);
            }
          });

          proxyRes.on('end', () => {
            if (!firstChunkReceived && !res.headersSent) {
              res.setHeader('X-PDF-Proxy-Error', 'true');
              res.setHeader('Content-Type', 'application/json');
              return res.status(502).json({ success: false, error: 'Empty response from university server', code: 'EMPTY_UPSTREAM' });
            }
            res.end();
          });
        });

        proxyReq.on('timeout', () => {
          proxyReq.destroy();
          if (!res.headersSent) {
            res.setHeader('X-PDF-Proxy-Error', 'true');
            res.setHeader('Content-Type', 'application/json');
            res.status(504).json({
              success: false,
              error: 'Official university server (aktu.ac.in) connection timed out',
              code: 'UPSTREAM_TIMEOUT'
            });
          }
        });

        proxyReq.on('error', (err) => {
          console.error('[SYLLABUS PDF PROXY ERROR]', err.message);
          if (!res.headersSent) {
            res.setHeader('X-PDF-Proxy-Error', 'true');
            res.setHeader('Content-Type', 'application/json');
            res.status(502).json({
              success: false,
              error: `Official university portal connection error: ${err.message}`,
              code: 'UPSTREAM_CONNECT_ERROR'
            });
          }
        });
      };

      fetchWithRetry(targetUrl);
    } catch (e) {
      console.error('[PDF PROXY UNHANDLED]', e);
      if (!res.headersSent) {
        res.setHeader('X-PDF-Proxy-Error', 'true');
        return res.status(500).json({ success: false, error: e.message });
      }
    }
  });

  // -------------------------------------------------------------------------
  // 4. POST /api/syllabus - Admin Create Syllabus Record
  // -------------------------------------------------------------------------
  router.post('/', async (req, res) => {
    try {
      const payload = req.body;
      if (!payload.course || !payload.subjectName) {
        return res.status(400).json({ success: false, error: 'course and subjectName are required' });
      }

      if (!payload.id) {
        payload.id = `syl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      }
      payload.lastVerifiedAt = new Date().toISOString();

      let created;
      if (SyllabusModel && SyllabusModel.db && SyllabusModel.db.readyState === 1) {
        created = await SyllabusModel.create(payload);
      }

      // Also persist to JSON fallback
      fallbackDataset.push(payload);
      try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(fallbackDataset, null, 2));
      } catch (fErr) {
        console.warn('[SYLLABUS JSON SAVE NOTICE]', fErr.message);
      }

      return res.status(201).json({ success: true, data: created || payload });
    } catch (err) {
      console.error('[SYLLABUS CREATE ERROR]', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------------------
  // 5. PUT /api/syllabus/:id - Admin Update Syllabus Record
  // -------------------------------------------------------------------------
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = { ...req.body, lastVerifiedAt: new Date().toISOString() };

      let updated;
      if (SyllabusModel && SyllabusModel.db && SyllabusModel.db.readyState === 1) {
        updated = await SyllabusModel.findOneAndUpdate(
          { $or: [{ id }, { _id: id }] },
          { $set: updates },
          { new: true }
        ).lean();
      }

      // Update in fallback dataset
      const fIdx = fallbackDataset.findIndex(r => r.id === id || r._id === id);
      if (fIdx !== -1) {
        fallbackDataset[fIdx] = { ...fallbackDataset[fIdx], ...updates };
        try {
          fs.writeFileSync(DATA_FILE, JSON.stringify(fallbackDataset, null, 2));
        } catch (fErr) {
          console.warn('[SYLLABUS JSON SAVE NOTICE]', fErr.message);
        }
      }

      return res.status(200).json({ success: true, data: updated || updates });
    } catch (err) {
      console.error('[SYLLABUS UPDATE ERROR]', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------------------
  // 6. PATCH /api/syllabus/:id/toggle - Admin Toggle Active/Inactive
  // -------------------------------------------------------------------------
  router.patch('/:id/toggle', async (req, res) => {
    try {
      const { id } = req.params;
      let newStatus = true;

      if (SyllabusModel && SyllabusModel.db && SyllabusModel.db.readyState === 1) {
        const found = await SyllabusModel.findOne({ $or: [{ id }, { _id: id }] });
        if (found) {
          found.isActive = !found.isActive;
          newStatus = found.isActive;
          await found.save();
        }
      }

      const fIdx = fallbackDataset.findIndex(r => r.id === id || r._id === id);
      if (fIdx !== -1) {
        fallbackDataset[fIdx].isActive = !fallbackDataset[fIdx].isActive;
        newStatus = fallbackDataset[fIdx].isActive;
        try {
          fs.writeFileSync(DATA_FILE, JSON.stringify(fallbackDataset, null, 2));
        } catch (fErr) {}
      }

      return res.status(200).json({ success: true, isActive: newStatus });
    } catch (err) {
      console.error('[SYLLABUS TOGGLE ERROR]', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------------------
  // 7. DELETE /api/syllabus/:id - Admin Delete Record
  // -------------------------------------------------------------------------
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      if (SyllabusModel && SyllabusModel.db && SyllabusModel.db.readyState === 1) {
        await SyllabusModel.deleteOne({ $or: [{ id }, { _id: id }] });
      }

      fallbackDataset = fallbackDataset.filter(r => r.id !== id && r._id !== id);
      try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(fallbackDataset, null, 2));
      } catch (fErr) {}

      return res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
      console.error('[SYLLABUS DELETE ERROR]', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
}

export default createSyllabusRouter;
