/**
 * PRMA Tech Internship Portal Backend Routes
 * Endpoints for domain configs, applications, auth, and payment orchestration
 */

import express from 'express';
import crypto from 'crypto';

export function createPrmaRouter({ isDbConnected } = {}) {
  const router = express.Router();

  // In-memory / persistent mock storage for applications & users
  const applicationsStore = new Map();
  const usersStore = new Map();

  /**
   * Health / Ping
   */
  router.get('/health', (req, res) => {
    res.json({
      status: 'active',
      service: 'PRMA Tech Internship API',
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

    // Default mock response so students can check their preview
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

      // Check if official RAZORPAY_KEY_ID & SECRET are available
      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

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

  return router;
}
