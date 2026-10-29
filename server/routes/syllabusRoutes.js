import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import SyllabusModel from '../models/Syllabus.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'syllabus.json');

// In-memory fallback dataset loaded from JSON file
let fallbackDataset = [];
try {
  if (fs.existsSync(DATA_FILE)) {
    fallbackDataset = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
} catch (err) {
  console.warn('[SYLLABUS ROUTES] Warning: Failed to load fallback syllabus.json:', err.message);
}

export function createSyllabusRouter() {
  const router = express.Router();

  // Helper: Get all active syllabus records (from DB if connected, otherwise fallback JSON)
  const getRecords = async (query = {}) => {
    try {
      if (SyllabusModel && SyllabusModel.db && SyllabusModel.db.readyState === 1) {
        return await SyllabusModel.find(query).lean();
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
  // 3. GET /api/syllabus/pdf-proxy - Secure PDF Streaming Proxy
  // Avoids browser iframe / CORS blocks when viewing AKTU PDFs directly
  // -------------------------------------------------------------------------
  router.get('/pdf-proxy', (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl || typeof targetUrl !== 'string' || !targetUrl.startsWith('http')) {
      return res.status(400).json({ success: false, error: 'Valid URL parameter is required' });
    }

    try {
      const parsed = new URL(targetUrl);
      const isHttps = parsed.protocol === 'https:';
      const client = isHttps ? https : http;

      const proxyReq = client.get(encodeURI(targetUrl), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/pdf,*/*'
        },
        rejectUnauthorized: false,
        timeout: 25000
      }, (proxyRes) => {
        // Handle redirects
        if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
          let redir = proxyRes.headers.location;
          if (!redir.startsWith('http')) redir = new URL(redir, parsed.origin).href;
          return res.redirect(`/api/syllabus/pdf-proxy?url=${encodeURIComponent(redir)}`);
        }

        if (proxyRes.statusCode !== 200) {
          return res.status(proxyRes.statusCode).json({
            success: false,
            error: `Upstream returned status ${proxyRes.statusCode}`
          });
        }

        // Set streaming headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        if (proxyRes.headers['content-length']) {
          res.setHeader('Content-Length', proxyRes.headers['content-length']);
        }

        proxyRes.pipe(res);
      });

      proxyReq.on('timeout', () => {
        proxyReq.destroy();
        if (!res.headersSent) {
          res.status(504).json({ success: false, error: 'Gateway timeout fetching syllabus PDF' });
        }
      });

      proxyReq.on('error', (err) => {
        console.error('[SYLLABUS PDF PROXY ERROR]', err.message);
        if (!res.headersSent) {
          res.status(502).json({ success: false, error: `Proxy request failed: ${err.message}` });
        }
      });
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
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
