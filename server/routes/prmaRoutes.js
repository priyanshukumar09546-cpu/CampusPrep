/**
 * PRMA Tech Internship Portal & Corporate Backend Routes
 * Endpoints for domain configs, applications, auth, career applications,
 * offer letter PDF generation, verification, email dispatch, and admin operations.
 */

import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generatePrmaOfferLetterPdf } from '../services/prmaOfferLetterEngine.js';
import { sendPrmaShortlistEmail } from '../services/prmaEmailService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const APPS_FILE = path.join(DATA_DIR, 'prma_applications.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('[PRMA ROUTES] Notice: Unable to create data dir:', e.message);
}

// 9 Showcase Goodies (Zero pricing, Coming Soon mode matching Reference Image 3)
const SHOWCASE_GOODIES = [
  {
    id: 'tshirt',
    name: 'PRMA Tech T-Shirt',
    subtitle: 'Official Branded Apparel',
    description: 'Premium cotton T-shirt with official PRMA Tech branding.',
    image: '/assets/prma_goodies/prma_tshirt.png',
    largeImage: '/assets/prma_goodies/prma_tshirt.png',
    status: 'COMING SOON',
    badge: 'COMING SOON',
    features: ['100% Combed Bio-Washed Cotton', 'Official Multi-Color PRMA Tech Crest', 'Double-Stitched Seams', 'Breathable Matte Black Finish']
  },
  {
    id: 'bottle',
    name: 'PRMA Tech Water Bottle',
    subtitle: 'Thermal Insulated Flask',
    description: 'Durable and stylish bottle to keep you hydrated.',
    image: '/assets/prma_goodies/prma_bottle.png',
    largeImage: '/assets/prma_goodies/prma_bottle.png',
    status: 'COMING SOON',
    badge: 'COMING SOON',
    features: ['750 ml Stainless Steel', 'Double-Wall Vacuum Insulation', 'Laser-Engraved PRMA Tech Emblem', 'Leak-Proof Carabiner Cap']
  },
  {
    id: 'notebook',
    name: 'Executive Notebook',
    subtitle: 'Premium Work Journal',
    description: 'Premium notebook for your ideas, notes and learning journey.',
    image: '/assets/prma_goodies/prma_notebook.png',
    largeImage: '/assets/prma_goodies/prma_notebook.png',
    status: 'COMING SOON',
    badge: 'COMING SOON',
    features: ['A5 Ruled 192 Acid-Free Pages', 'Satin Bookmark Ribbon', 'Gold Foil PRMA Tech Seal', 'Elastic Closure Band']
  },
  {
    id: 'id-card',
    name: 'Intern ID Card + Lanyard',
    subtitle: 'Smart Verified Access Card',
    description: 'Official PRMA Tech intern ID card with branded lanyard.',
    image: '/assets/prma_goodies/prma_id_card.png',
    largeImage: '/assets/prma_goodies/prma_id_card.png',
    status: 'COMING SOON',
    badge: 'COMING SOON',
    features: ['Personalized Name & Intern ID', 'Embedded Quick-Verify QR Code', 'Heavy-Duty Acrylic Card Case', 'Silk-Finish Satin Lanyard']
  },
  {
    id: 'pen',
    name: 'PRMA Tech Pen',
    subtitle: 'Executive Metal Rollerball',
    description: 'Smooth and professional pen with PRMA Tech branding.',
    image: '/assets/prma_gen/prma_pen.jpg',
    largeImage: '/assets/prma_gen/prma_pen.jpg',
    status: 'COMING SOON',
    badge: 'COMING SOON',
    features: ['Matte Black Metallic Body', 'High-Precision 0.7mm Rollerball', 'Chrome Accents', 'Laser-Etched PRMA Tech Logo']
  },
  {
    id: 'mug',
    name: 'PRMA Tech Mug',
    subtitle: 'Classic Ceramic Mug',
    description: 'A classic ceramic mug for your daily inspiration.',
    image: '/assets/prma_goodies/prma_mug_real.jpg',
    largeImage: '/assets/prma_goodies/prma_mug_real.jpg',
    status: 'COMING SOON',
    badge: 'COMING SOON',
    features: ['350 ml High-Grade Ceramic', 'Official PRMA Tech Logo & Slogan', 'Microwave & Dishwasher Safe', 'Ergonomic Comfort Grip']
  },
  {
    id: 'stickers',
    name: 'Tech Sticker Pack',
    subtitle: 'Die-Cut Vinyl Workstation Decals',
    description: 'High-quality stickers to customize your laptop, notebook and more.',
    image: '/assets/prma_goodies/prma_stickers.png',
    largeImage: '/assets/prma_goodies/prma_stickers.png',
    status: 'COMING SOON',
    badge: 'COMING SOON',
    features: ['6-Piece High Gloss Vinyl', 'Waterproof & UV Resistant', 'Residue-Free Removal', 'Vibrant PRMA Tech & Tech Slogans']
  },
  {
    id: 'cap',
    name: 'PRMA Tech Cap',
    subtitle: 'Embroidered Structured Cap',
    description: 'Stylish and comfortable cap with embroidered PRMA Tech logo.',
    image: '/assets/prma_goodies/prma_cap.png',
    largeImage: '/assets/prma_goodies/prma_cap.png',
    status: 'COMING SOON',
    badge: 'COMING SOON',
    features: ['100% Breathable Cotton Twill', '3D Embroidered Multi-Color Crest', 'Adjustable Brass Buckle', 'Contoured Pre-Curved Visor']
  },
  {
    id: 'welcome-box',
    name: 'Welcome Box',
    subtitle: 'Official Internship Kit Hamper',
    description: 'A special welcome kit for selected interns (includes premium PRMA Tech goodies).',
    image: '/assets/prma_goodies/prma_welcome_box.png',
    largeImage: '/assets/prma_goodies/prma_welcome_box.png',
    status: 'COMING SOON',
    badge: 'COMING SOON',
    features: ['Rigid Magnetic Gift Box', 'Complete Merchandise Suite', 'Customized Name Tag', 'Certificate & Stamp Seal']
  }
];

export function createPrmaRouter({ isDbConnected } = {}) {
  const router = express.Router();

  // In-memory data structures
  const applicationsStore = new Map();
  const usersStore = new Map();
  const careerApplicationsStore = new Map();
  const contactInquiriesStore = new Map();
  const pdfCacheStore = new Map(); // offerId/appId -> Buffer

  // Helper: Persist applications to disk
  const persistApplications = () => {
    try {
      const arr = Array.from(applicationsStore.values());
      fs.writeFileSync(APPS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[PRMA ROUTER] Error persisting applications to file:', e.message);
    }
  };

  // Helper: Load applications from disk
  const loadPersistedApplications = () => {
    try {
      if (fs.existsSync(APPS_FILE)) {
        const raw = fs.readFileSync(APPS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((app) => {
            if (app.applicationId) {
              applicationsStore.set(app.applicationId, app);
            }
          });
          console.log(`[PRMA ROUTER] Loaded ${applicationsStore.size} persistent applications from disk.`);
        }
      }
    } catch (e) {
      console.warn('[PRMA ROUTER] Could not load persisted applications:', e.message);
    }
  };

  loadPersistedApplications();

  // Populate sample baseline applications if empty
  if (applicationsStore.size === 0) {
    const seed1 = 'PRMA94821034';
    applicationsStore.set(seed1, {
      applicationId: seed1,
      offerId: 'PRMA/INT/A1/93084',
      domain: { id: 'machine-learning', title: 'Machine Learning', badge: 'High Impact' },
      duration: '1 Month',
      mode: 'Remote',
      student: {
        fullName: 'Priyanshu Kumar',
        email: 'priyanshu@gmail.com',
        mobile: '+91 98765 43210',
        college: 'AKGEC Ghaziabad',
        course: 'B.Tech',
        branch: 'CSE (AI & ML)',
        year: '3rd Year',
        semester: '5th'
      },
      technical: {
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-Learn'],
        githubUrl: 'https://github.com/priyanshu',
        linkedinUrl: 'https://linkedin.com/in/priyanshu',
        resumeFileName: 'Priyanshu_Kumar_Resume.pdf'
      },
      joiningDate: '17-Nov-2026',
      completionDate: '17-Dec-2026',
      fee: '100% Free',
      status: 'shortlisted',
      paymentStatus: 'free',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      shortlistedAt: new Date(Date.now() - 86400000).toISOString()
    });

    const seed2 = 'PRMA94821035';
    applicationsStore.set(seed2, {
      applicationId: seed2,
      domain: { id: 'web-development', title: 'Full-Stack Web Development', badge: 'Popular' },
      duration: '1 Month',
      mode: 'Remote',
      student: {
        fullName: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        mobile: '+91 98111 22334',
        college: 'KIET Group of Institutions',
        course: 'B.Tech',
        branch: 'CSE',
        year: '3rd Year',
        semester: '6th'
      },
      technical: {
        skills: ['React', 'Node.js', 'Express', 'MongoDB'],
        githubUrl: 'https://github.com/aarav',
        resumeFileName: 'Aarav_Resume.pdf'
      },
      fee: '100% Free',
      status: 'submitted',
      paymentStatus: 'free',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    });

    persistApplications();
  }

  // Sample career app
  careerApplicationsStore.set('JOB_APP_1001', {
    id: 'JOB_APP_1001',
    roleId: 'sde-intern',
    roleTitle: 'Software Developer Intern',
    fullName: 'Priya Verma',
    email: 'priya.verma@example.com',
    phone: '+91 98112 34567',
    experience: 'Fresher / Final Year',
    portfolioUrl: 'https://github.com/priyaverma',
    resumeFileName: 'Priya_Verma_Resume_SDE.pdf',
    notes: 'Strong in React, Node.js, and MongoDB. Built 3 production projects.',
    status: 'interview_scheduled',
    appliedAt: new Date(Date.now() - 86400000).toISOString()
  });

  /**
   * Health / Ping
   */
  router.get('/health', (req, res) => {
    res.json({
      status: 'active',
      service: 'PRMA Tech Corporate & Internship API',
      timestamp: new Date().toISOString()
    });
  });

  /**
   * Goodies Showcase (9 Products, Zero Pricing, Coming Soon)
   */
  router.get('/goodies', (req, res) => {
    res.json({
      success: true,
      count: SHOWCASE_GOODIES.length,
      goodies: SHOWCASE_GOODIES
    });
  });

  /**
   * Auth: Student Register
   */
  router.post('/auth/register', (req, res) => {
    try {
      const { fullName, email, mobile, college, password } = req.body;
      if (!email || !fullName) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const user = {
        id: 'prma_usr_' + Date.now(),
        name: fullName,
        email: normalizedEmail,
        mobile: mobile || '',
        college: college || '',
        role: 'intern',
        createdAt: new Date().toISOString()
      };

      usersStore.set(normalizedEmail, { ...user, password });

      const token = 'prma_jwt_' + crypto.randomBytes(16).toString('hex');
      res.status(201).json({
        success: true,
        token,
        user
      });
    } catch (err) {
      res.status(500).json({ error: 'Registration failed', details: err.message });
    }
  });

  /**
   * Auth: Student Login
   */
  router.post('/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const existing = usersStore.get(normalizedEmail);

      const user = existing || {
        id: 'prma_usr_' + Date.now(),
        name: email.split('@')[0],
        email: normalizedEmail,
        role: 'intern'
      };

      const token = 'prma_jwt_' + crypto.randomBytes(16).toString('hex');
      res.json({
        success: true,
        token,
        user
      });
    } catch (err) {
      res.status(500).json({ error: 'Login failed', details: err.message });
    }
  });

  /**
   * Submit 100% Free Internship Application
   */
  router.post('/applications', (req, res) => {
    try {
      const {
        applicationId,
        student,
        domain,
        technical,
        statementOfPurpose,
        preferredStartDate,
        duration = '1 Month',
        mode = 'Remote / Online'
      } = req.body;

      if (!student?.fullName || !student?.email) {
        return res.status(400).json({ error: 'Student full name and email are mandatory' });
      }

      const appId = applicationId || 'PRMA' + Date.now().toString().slice(-8);
      const appRecord = {
        applicationId: appId,
        student: {
          fullName: (student.fullName || '').trim(),
          email: (student.email || '').trim().toLowerCase(),
          mobile: (student.mobile || '').trim(),
          college: (student.college || '').trim(),
          course: student.course || 'B.Tech',
          branch: (student.branch || '').trim(),
          year: student.year || '3rd Year',
          semester: student.semester || ''
        },
        domain: domain || { id: 'web-development', title: 'Full-Stack Web Development' },
        technical: technical || {},
        statementOfPurpose: statementOfPurpose || '',
        preferredStartDate: preferredStartDate || '',
        duration: '1 Month',
        mode: mode || 'Remote / Online',
        fee: '100% Free',
        totalAmount: 0,
        status: 'submitted',
        paymentStatus: 'free',
        createdAt: new Date().toISOString()
      };

      applicationsStore.set(appId, appRecord);
      persistApplications();

      res.status(201).json({
        success: true,
        applicationId: appId,
        record: appRecord
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to record application', details: err.message });
    }
  });

  /**
   * Status Search for Student Dashboard
   */
  router.get('/applications/status/:identifier', (req, res) => {
    const term = (req.params.identifier || '').trim().toLowerCase();
    if (!term) {
      return res.status(400).json({ error: 'Please enter Application ID or Email' });
    }

    let found = null;
    for (const app of applicationsStore.values()) {
      if (
        (app.applicationId && app.applicationId.toLowerCase() === term) ||
        (app.student?.email && app.student.email.toLowerCase() === term) ||
        (app.offerId && app.offerId.toLowerCase() === term)
      ) {
        found = app;
        break;
      }
    }

    if (!found) {
      return res.status(404).json({
        success: false,
        message: 'No application found with provided ID or Email.'
      });
    }

    res.json({
      success: true,
      application: found
    });
  });

  /**
   * Get Application by ID
   */
  router.get('/applications/:id', (req, res) => {
    const appId = req.params.id;
    const record = applicationsStore.get(appId);

    if (record) {
      return res.json({ success: true, application: record });
    }

    // Search by offerId or case-insensitive
    for (const app of applicationsStore.values()) {
      if (app.offerId === appId || app.applicationId.toLowerCase() === appId.toLowerCase()) {
        return res.json({ success: true, application: app });
      }
    }

    res.status(404).json({
      success: false,
      message: 'Application not found'
    });
  });

  /**
   * Admin: Shortlist Candidate & Auto-Generate Vector PDF & Dispatch Email
   */
  router.post('/admin/applications/:id/shortlist', async (req, res) => {
    try {
      const appId = req.params.id;
      let record = applicationsStore.get(appId);

      if (!record) {
        for (const app of applicationsStore.values()) {
          if (app.applicationId === appId || app.offerId === appId) {
            record = app;
            break;
          }
        }
      }

      if (!record) {
        return res.status(404).json({ error: 'Application not found' });
      }

      // Generate or reuse Offer ID
      const offerId = record.offerId || `PRMA/INT/A1/${Math.floor(10000 + Math.random() * 90000)}`;

      // Calculate joining date and 1-month completion date
      const joiningDateInput = req.body.joiningDate;
      let joinDateStr;
      if (joiningDateInput) {
        joinDateStr = joiningDateInput;
      } else {
        const nextWeek = new Date(Date.now() + 7 * 86400000);
        const day = String(nextWeek.getDate()).padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        joinDateStr = `${day}-${months[nextWeek.getMonth()]}-${nextWeek.getFullYear()}`;
      }

      // 1 Month completion
      const compDate = new Date(Date.now() + 37 * 86400000);
      const cDay = String(compDate.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const completionDateStr = `${cDay}-${months[compDate.getMonth()]}-${compDate.getFullYear()}`;

      const todayStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
      const studentName = record.student?.fullName || 'Candidate';
      const domainTitle = record.domain?.title || 'Technology Track';

      const verificationUrl = `https://professorvirus.site/prma-tech/verify-offer/${encodeURIComponent(offerId)}`;

      // 1. Generate Vector PDF
      let pdfBuffer;
      try {
        pdfBuffer = await generatePrmaOfferLetterPdf({
          studentName,
          domainTitle,
          offerId,
          issueDate: todayStr,
          joiningDate: joinDateStr,
          completionDate: completionDateStr,
          duration: '1 Month',
          mode: 'Remote',
          verificationUrl
        });
        pdfCacheStore.set(offerId, pdfBuffer);
        pdfCacheStore.set(record.applicationId, pdfBuffer);
      } catch (pdfErr) {
        console.error('[PRMA ROUTER] PDF Generation error:', pdfErr);
      }

      // 2. Dispatch Email
      let emailResult = { success: false, reason: 'PDF not available' };
      if (pdfBuffer && record.student?.email) {
        try {
          emailResult = await sendPrmaShortlistEmail({
            toEmail: record.student.email,
            studentName,
            domainTitle,
            offerId,
            joiningDate: joinDateStr,
            pdfBuffer
          });
        } catch (mailErr) {
          console.error('[PRMA ROUTER] Email send error:', mailErr);
          emailResult = { success: false, error: mailErr.message };
        }
      }

      // 3. Update application state
      record.status = 'shortlisted';
      record.offerId = offerId;
      record.joiningDate = joinDateStr;
      record.completionDate = completionDateStr;
      record.duration = '1 Month';
      record.shortlistedAt = new Date().toISOString();
      record.emailDispatched = emailResult.success;
      record.offerLetterUrl = `/api/prma/admin/applications/${encodeURIComponent(record.applicationId)}/offer-letter`;

      applicationsStore.set(record.applicationId, record);
      persistApplications();

      res.json({
        success: true,
        message: 'Applicant successfully shortlisted, offer letter issued, and notification triggered.',
        offerId,
        joiningDate: joinDateStr,
        emailSent: emailResult.success,
        emailDetails: emailResult,
        application: record
      });
    } catch (err) {
      console.error('[PRMA ROUTER] Shortlist handler failure:', err);
      res.status(500).json({ error: 'Failed to shortlist applicant', details: err.message });
    }
  });

  /**
   * Download / View Offer Letter PDF
   */
  const handleOfferLetterStream = async (req, res) => {
    try {
      const idParam = req.params.id || req.params.offerId;
      let record = applicationsStore.get(idParam);

      if (!record) {
        for (const app of applicationsStore.values()) {
          if (app.applicationId === idParam || app.offerId === idParam) {
            record = app;
            break;
          }
        }
      }

      let pdfBuffer = pdfCacheStore.get(idParam);
      if (!pdfBuffer && record && record.offerId) {
        pdfBuffer = pdfCacheStore.get(record.offerId);
      }

      // If not cached, generate dynamically
      if (!pdfBuffer) {
        const studentName = record?.student?.fullName || 'Priyanshu Kumar';
        const domainTitle = record?.domain?.title || 'Machine Learning';
        const offerId = record?.offerId || (idParam.includes('/') ? idParam : `PRMA/INT/A1/93084`);
        const joiningDate = record?.joiningDate || '17-Nov-2026';
        const completionDate = record?.completionDate || '17-Dec-2026';
        const verificationUrl = `https://professorvirus.site/prma-tech/verify-offer/${encodeURIComponent(offerId)}`;

        pdfBuffer = await generatePrmaOfferLetterPdf({
          studentName,
          domainTitle,
          offerId,
          issueDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
          joiningDate,
          completionDate,
          duration: '1 Month',
          mode: 'Remote',
          verificationUrl
        });

        pdfCacheStore.set(offerId, pdfBuffer);
        if (record) pdfCacheStore.set(record.applicationId, pdfBuffer);
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="PRMA_Tech_Offer_Letter_${record?.offerId ? record.offerId.replace(/[\/\\]/g, '_') : 'Verified'}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);
      res.end(pdfBuffer);
    } catch (err) {
      console.error('[PRMA ROUTER] PDF Stream error:', err);
      res.status(500).send('Error rendering offer letter PDF: ' + err.message);
    }
  };

  router.get('/admin/applications/:id/offer-letter', handleOfferLetterStream);
  router.get('/offer-letter/:offerId', handleOfferLetterStream);

  /**
   * Verify Offer Letter Endpoint
   */
  router.get('/verify-offer/:offerId', (req, res) => {
    try {
      const paramId = decodeURIComponent(req.params.offerId).trim();
      let match = null;

      for (const app of applicationsStore.values()) {
        if (
          (app.offerId && app.offerId.toLowerCase() === paramId.toLowerCase()) ||
          (app.applicationId && app.applicationId.toLowerCase() === paramId.toLowerCase())
        ) {
          match = app;
          break;
        }
      }

      // Allow reference verification for sample seed ID PRMA/INT/A1/93084
      if (!match && (paramId.toLowerCase().includes('93084') || paramId.toLowerCase() === 'prma/int/a1/93084')) {
        match = {
          applicationId: 'PRMA94821034',
          offerId: 'PRMA/INT/A1/93084',
          student: {
            fullName: 'Priyanshu Kumar',
            college: 'AKGEC Ghaziabad',
            branch: 'CSE (AI & ML)'
          },
          domain: { title: 'Machine Learning' },
          joiningDate: '17-Nov-2026',
          completionDate: '17-Dec-2026',
          duration: '1 Month',
          mode: 'Remote',
          status: 'shortlisted'
        };
      }

      if (!match) {
        return res.status(404).json({
          success: false,
          verified: false,
          message: `No active credential record exists for Offer ID "${paramId}".`
        });
      }

      res.json({
        success: true,
        verified: true,
        offer: {
          offerId: match.offerId || paramId,
          applicationId: match.applicationId,
          studentName: match.student?.fullName || 'Verified Intern',
          college: match.student?.college || 'Affiliated Institution',
          branch: match.student?.branch || 'Engineering / Technology',
          domain: match.domain?.title || 'Technical Internship Track',
          joiningDate: match.joiningDate || '17-Nov-2026',
          completionDate: match.completionDate || '17-Dec-2026',
          duration: match.duration || '1 Month',
          mode: match.mode || 'Remote',
          status: 'Official Verified Offer',
          issuedBy: 'Rahul Verma, Co-Founder & COO, PRMA Tech',
          corporateAddress: 'PRMA Tech, Knowledge Park, Greater Noida, Uttar Pradesh – 201310',
          accreditations: ['ISO 9001:2015 Certified', 'MSME Registered (Govt. of India)'],
          verifiedAt: new Date().toISOString()
        }
      });
    } catch (err) {
      res.status(500).json({ error: 'Verification failed', details: err.message });
    }
  });

  /**
   * Careers: Submit Application
   */
  router.post('/careers/apply', (req, res) => {
    try {
      const { roleId, roleTitle, fullName, email, phone, experience, portfolioUrl, resumeFileName, notes } = req.body;
      if (!fullName || !email) {
        return res.status(400).json({ error: 'Full name and email are required' });
      }

      const id = 'JOB_APP_' + Date.now().toString().slice(-6);
      const application = {
        id,
        roleId: roleId || 'general-application',
        roleTitle: roleTitle || 'General Application / Talent Pool',
        fullName,
        email: email.toLowerCase().trim(),
        phone: phone || '',
        experience: experience || '',
        portfolioUrl: portfolioUrl || '',
        resumeFileName: resumeFileName || 'Uploaded_Resume.pdf',
        notes: notes || '',
        status: 'received',
        appliedAt: new Date().toISOString()
      };

      careerApplicationsStore.set(id, application);

      res.status(201).json({
        success: true,
        applicationId: id,
        message: 'Application received successfully. Our hiring team will review your profile within 48 hours.'
      });
    } catch (err) {
      res.status(500).json({ error: 'Career application submission failed', details: err.message });
    }
  });

  /**
   * Contact / Services Project Inquiry Submission
   */
  router.post('/contact', (req, res) => {
    try {
      const { fullName, email, phone, company, service, budget, message } = req.body;
      if (!fullName || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
      }

      const inquiryId = 'INQ_' + Date.now().toString().slice(-6);
      const inquiry = {
        id: inquiryId,
        fullName,
        email: email.toLowerCase().trim(),
        phone: phone || '',
        company: company || '',
        service: service || 'General Consultation',
        budget: budget || 'Flexible',
        message,
        createdAt: new Date().toISOString()
      };

      contactInquiriesStore.set(inquiryId, inquiry);

      res.status(201).json({
        success: true,
        inquiryId,
        message: 'Thank you! Your project inquiry has been received. A PRMA Tech consultant will reach out within 24 hours.'
      });
    } catch (err) {
      res.status(500).json({ error: 'Inquiry submission failed', details: err.message });
    }
  });

  /**
   * Admin: Overview Stats
   */
  router.get('/admin/stats', (req, res) => {
    try {
      const applications = Array.from(applicationsStore.values());
      const careers = Array.from(careerApplicationsStore.values());
      const inquiries = Array.from(contactInquiriesStore.values());

      res.json({
        success: true,
        stats: {
          totalInternshipApplications: applications.length,
          shortlistedCandidates: applications.filter(a => a.status === 'shortlisted').length,
          activeInternships: applications.filter(a => a.status === 'shortlisted' || a.status === 'active').length,
          careerApplications: careers.length,
          inquiriesReceived: inquiries.length,
          totalRevenue: 0,
          pricingModel: '100% Free Internship Program',
          recentApplications: applications.slice(-10).reverse(),
          recentCareers: careers.slice(-5).reverse(),
          recentInquiries: inquiries.slice(-5).reverse()
        }
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch admin stats', details: err.message });
    }
  });

  /**
   * Admin: List All Internship Applications
   */
  router.get('/admin/applications', (req, res) => {
    const list = Array.from(applicationsStore.values()).reverse();
    res.json({ success: true, count: list.length, applications: list });
  });

  /**
   * Admin: Update Application Status
   */
  router.patch('/admin/applications/:id', (req, res) => {
    const appId = req.params.id;
    const { status } = req.body;
    let existing = applicationsStore.get(appId);

    if (!existing) {
      for (const app of applicationsStore.values()) {
        if (app.applicationId === appId || app.offerId === appId) {
          existing = app;
          break;
        }
      }
    }

    if (!existing) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (status) existing.status = status;
    applicationsStore.set(existing.applicationId, existing);
    persistApplications();

    res.json({ success: true, application: existing });
  });

  /**
   * Admin: List All Career Applications
   */
  router.get('/admin/careers', (req, res) => {
    const list = Array.from(careerApplicationsStore.values()).reverse();
    res.json({ success: true, count: list.length, applications: list });
  });

  /**
   * Admin: List All Inquiries
   */
  router.get('/admin/inquiries', (req, res) => {
    const list = Array.from(contactInquiriesStore.values()).reverse();
    res.json({ success: true, count: list.length, inquiries: list });
  });

  return router;
}
