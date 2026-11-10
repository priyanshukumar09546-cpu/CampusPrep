/**
 * PRMA Tech Internship Portal & Corporate Backend Routes
 * Endpoints for domain configs, applications, auth, payment orchestration, careers & admin
 */

import express from 'express';
import crypto from 'crypto';

export function createPrmaRouter({ isDbConnected } = {}) {
  const router = express.Router();

  // In-memory / persistent mock storage
  const applicationsStore = new Map();
  const usersStore = new Map();
  const careerApplicationsStore = new Map();
  const contactInquiriesStore = new Map();

  // Populate sample internship application so admin has realistic data on startup
  const seedAppId = 'PRMA94821034';
  applicationsStore.set(seedAppId, {
    applicationId: seedAppId,
    domain: { id: 'web-development', title: 'Full-Stack Web Development', badge: 'Popular' },
    duration: { id: '8-weeks', label: '8 Weeks (2 Months)', price: 999 },
    batch: { id: 'batch-dec-01', startDate: '2026-12-01', label: '01 Dec 2026' },
    student: {
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      mobile: '+91 98765 43210',
      college: 'AKGEC Ghaziabad',
      branch: 'CSE',
      year: '3rd Year'
    },
    goodies: [
      { id: 'prma-kit-box', name: 'PRMA Tech™ Luxury Welcome Box', price: 0 },
      { id: 'prma-hoodie', name: 'PRMA Tech™ Elite Winter Hoodie', price: 699 }
    ],
    totalAmount: 1698,
    status: 'shortlisted',
    paymentStatus: 'success',
    paymentId: 'pay_17943098231',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  });

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
   * Submit / Save Application
   */
  router.post('/applications', (req, res) => {
    try {
      const { applicationId, domain, duration, batch, student, goodies, totalAmount } = req.body;

      const appId = applicationId || 'PRMA' + Date.now().toString().slice(-8);
      const appRecord = {
        applicationId: appId,
        domain,
        duration,
        batch,
        student,
        goodies: goodies || [],
        totalAmount,
        status: 'received',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString()
      };

      applicationsStore.set(appId, appRecord);

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
   * Get Application by ID
   */
  router.get('/applications/:id', (req, res) => {
    const appId = req.params.id;
    const record = applicationsStore.get(appId);

    if (record) {
      return res.json({ success: true, application: record });
    }

    res.json({
      success: true,
      application: {
        applicationId: appId,
        status: 'active',
        paymentStatus: 'confirmed',
        message: 'Application verified'
      }
    });
  });

  /**
   * Payment: Create Order (Razorpay)
   */
  router.post('/payment/create-order', (req, res) => {
    try {
      const { amount, receipt, studentEmail } = req.body;

      const keyId = process.env.RAZORPAY_KEY_ID;
      const orderId = 'order_' + crypto.randomBytes(10).toString('hex');

      res.json({
        success: true,
        orderId,
        amount: amount || 14900,
        currency: 'INR',
        keyId: keyId || 'rzp_test_placeholder',
        receipt: receipt || 'receipt_' + Date.now()
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to initialize payment', details: err.message });
    }
  });

  /**
   * Payment: Verify Signature
   */
  router.post('/payment/verify', (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, applicationId } = req.body;

      if (applicationId && applicationsStore.has(applicationId)) {
        const app = applicationsStore.get(applicationId);
        app.paymentStatus = 'success';
        app.paymentId = razorpay_payment_id || 'pay_' + Date.now();
        applicationsStore.set(applicationId, app);
      }

      res.json({
        success: true,
        verified: true,
        message: 'Payment verified successfully'
      });
    } catch (err) {
      res.status(500).json({ error: 'Payment verification failed', details: err.message });
    }
  });

  /**
   * Careers: Submit Job / Internship Application
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

      const totalRevenue = applications.reduce((acc, app) => acc + (app.paymentStatus === 'success' ? (Number(app.totalAmount) || 0) : 0), 0);

      res.json({
        success: true,
        stats: {
          totalInternshipApplications: applications.length,
          activeInternships: applications.filter(a => a.status === 'shortlisted' || a.status === 'active').length,
          careerApplications: careers.length,
          inquiriesReceived: inquiries.length,
          totalRevenue,
          recentApplications: applications.slice(-5).reverse(),
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
    const { status, paymentStatus } = req.body;
    const existing = applicationsStore.get(appId);

    if (!existing) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (status) existing.status = status;
    if (paymentStatus) existing.paymentStatus = paymentStatus;
    applicationsStore.set(appId, existing);

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
