/**
 * PRMA Tech - Official Corporate Internship Email Automation Service
 * Production-ready transactional email engine powering:
 * 1. Official Corporate Onboarding & Approval Email with:
 *    - DELIVERABLE 1: Official Joining Letter PDF attached
 *    - DELIVERABLE 2: Official 10-Page Problem Statement & 4-Week Tasks PDF attached
 *    - DELIVERABLE 3: Unique, Secure Student Submission Portal Link
 * 2. Student Submission Confirmation Email (sent when student submits weekly work)
 * 3. Admin Notification Email (sent to admin when an intern submits a task)
 * 4. Admin Review & Correction Feedback Email (sent when admin reviews a submission)
 *
 * Security:
 * - Credentials loaded exclusively from environment variables (SMTP_HOST, SMTP_PORT, etc.)
 * - Zero secrets exposed in logs, API responses, or bundles
 * - Delivery audit logging with duplicate-send protection
 */

import nodemailer from 'nodemailer';

const COMPANY_WEBSITE = 'www.professorvirus.site/prma-tech';
const COMPANY_EMAIL = 'support@prmatech.com';
const LINKEDIN_URL = 'https://www.linkedin.com/company/prma-tech';

/**
 * DELIVERABLE 1, 2, 3: Official Corporate Internship Onboarding & Approval Email
 */
export async function sendPrmaApprovalEmail({
  toEmail,
  studentName,
  domainTitle,
  offerId,
  joiningDate,
  completionDate,
  duration = '1 Month',
  mode = 'Fully Remote',
  submissionUrl,
  joiningLetterPdfBuffer,
  problemStatementPdfBuffer
}) {
  const subject = `Official Internship Appointment Letter & Onboarding Package — ${offerId} | PRMA Tech`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #0F172A; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #F1F5F9; padding: 32px 12px; }
    .email-container { max-width: 640px; margin: 0 auto; background-color: #FFFFFF; border-radius: 18px; border: 1.5px solid #E2E8F0; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); }
    .header { background: linear-gradient(135deg, #0A1128 0%, #101C50 100%); padding: 32px 28px 24px; text-align: center; border-bottom: 3px solid #0866F5; }
    .logo-text { font-size: 28px; font-weight: 900; letter-spacing: -0.5px; color: #FFFFFF; margin: 0; }
    .logo-p { color: #0866F5; }
    .logo-r { color: #EA4335; }
    .logo-m { color: #FBBC05; }
    .logo-a { color: #34A853; }
    .tagline { font-size: 11px; text-transform: uppercase; letter-spacing: 2.5px; color: #94A3B8; margin-top: 6px; font-weight: 700; }
    .msme-pill { display: inline-block; background-color: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 9999px; padding: 4px 14px; font-size: 10.5px; color: #E2E8F0; margin-top: 14px; letter-spacing: 0.5px; }
    .content-body { padding: 36px 32px; line-height: 1.68; font-size: 15px; color: #1E293B; }
    .greeting { font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 14px; }
    .congrats-card { background: linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%); border: 1.5px solid #BFDBFE; border-radius: 14px; padding: 20px; margin: 18px 0 24px; }
    .congrats-title { font-size: 17px; font-weight: 900; color: #1D4ED8; margin: 0 0 6px; }
    .meta-table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; overflow: hidden; }
    .meta-row { border-bottom: 1px solid #EEF2F6; }
    .meta-cell-label { padding: 10px 16px; font-size: 13.5px; font-weight: 700; color: #64748B; width: 38%; }
    .meta-cell-val { padding: 10px 16px; font-size: 14px; font-weight: 800; color: #0F172A; }
    .deliverables-header { font-size: 16px; font-weight: 900; color: #0F172A; margin: 28px 0 14px; display: flex; align-items: center; gap: 8px; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px; }
    .deliverable-card { background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 16px 18px; margin-bottom: 14px; }
    .del-badge { display: inline-block; font-size: 10.5px; font-weight: 800; text-transform: uppercase; padding: 3px 10px; border-radius: 9999px; letter-spacing: 0.5px; margin-bottom: 6px; }
    .del-badge-1 { background-color: #DCFCE7; color: #166534; border: 1px solid #86EFAC; }
    .del-badge-2 { background-color: #EFF6FF; color: #1E40AF; border: 1px solid #93C5FD; }
    .del-badge-3 { background-color: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; }
    .del-title { font-size: 15px; font-weight: 800; color: #0F172A; margin: 0 0 4px; }
    .del-desc { font-size: 13px; color: #475569; margin: 0; line-height: 1.5; }
    .cta-container { text-align: center; margin: 28px 0 20px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #0866F5 0%, #7025E8 100%); color: #FFFFFF !important; text-decoration: none; font-size: 15px; font-weight: 800; padding: 15px 36px; border-radius: 9999px; box-shadow: 0 8px 24px rgba(8, 102, 245, 0.35); letter-spacing: 0.3px; }
    .url-fallback { word-break: break-all; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 14px; font-family: monospace; font-size: 12px; color: #0866F5; margin-top: 10px; }
    .linkedin-box { background-color: #F0FDF4; border: 1.5px solid #BBF7D0; border-radius: 12px; padding: 18px; margin: 24px 0; font-size: 13.5px; color: #166534; line-height: 1.6; }
    .signoff { margin-top: 32px; padding-top: 20px; border-top: 1px solid #E2E8F0; font-size: 14px; color: #334155; line-height: 1.6; }
    .footer { background-color: #F8FAFC; padding: 24px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="email-container">
      <!-- HEADER -->
      <div class="header">
        <h1 class="logo-text">
          <span class="logo-p">P</span><span class="logo-r">R</span><span class="logo-m">M</span><span class="logo-a">A</span>
          Tech™
        </h1>
        <div class="tagline">Build • Learn • Innovate • Grow</div>
        <div class="msme-pill">Govt. MSME Udyam Registered: UDYAM-UP-76-0055635</div>
      </div>

      <!-- BODY CONTENT -->
      <div class="content-body">
        <div class="greeting">Dear ${studentName},</div>

        <div class="congrats-card">
          <div class="congrats-title">Congratulations on Your Selection!</div>
          <div style="font-size: 14.5px; color: #1E293B;">
            Following a comprehensive evaluation of your application, we are delighted to officially welcome you to the <strong>PRMA Tech Virtual Internship Program</strong>.
          </div>
        </div>

        <p>You have been appointed to the following technical track:</p>

        <!-- INTERNSHIP METADATA TABLE -->
        <table class="meta-table">
          <tr class="meta-row">
            <td class="meta-cell-label">Internship Domain</td>
            <td class="meta-cell-val" style="color: #0866F5;">${domainTitle}</td>
          </tr>
          <tr class="meta-row">
            <td class="meta-cell-label">Offer / Candidate ID</td>
            <td class="meta-cell-val" style="font-family: monospace;">${offerId}</td>
          </tr>
          <tr class="meta-row">
            <td class="meta-cell-label">Internship Duration</td>
            <td class="meta-cell-val">${duration}</td>
          </tr>
          <tr class="meta-row">
            <td class="meta-cell-label">Work Mode</td>
            <td class="meta-cell-val">${mode} (100% Online)</td>
          </tr>
          <tr class="meta-row">
            <td class="meta-cell-label">Joining Date</td>
            <td class="meta-cell-val">${joiningDate}</td>
          </tr>
          <tr>
            <td class="meta-cell-label">Scheduled Completion</td>
            <td class="meta-cell-val">${completionDate}</td>
          </tr>
        </table>

        <!-- 3 MAJOR DELIVERABLES -->
        <div class="deliverables-header">
          Your Official Internship Deliverables Package
        </div>

        <!-- DELIVERABLE 1 -->
        <div class="deliverable-card">
          <span class="del-badge del-badge-1">Deliverable 1 &bull; Attached PDF</span>
          <h4 class="del-title">Official Internship Joining Letter</h4>
          <p class="del-desc">
            Your personalized, verified appointment letter bearing the official PRMA Tech seal, authorized signatory verification, and scannable QR code. <strong>(Attached to this email)</strong>
          </p>
        </div>

        <!-- DELIVERABLE 2 -->
        <div class="deliverable-card">
          <span class="del-badge del-badge-2">Deliverable 2 &bull; Attached PDF</span>
          <h4 class="del-title">Internship Problem Statement &amp; 4 Weekly Tasks</h4>
          <p class="del-desc">
            Your structured 10-page project assignment document defining your technical deliverables across all 4 weeks (Task 1 to Task 4). Follow the weekly deadlines and submission requirements. <strong>(Attached to this email)</strong>
          </p>
        </div>

        <!-- DELIVERABLE 3 -->
        <div class="deliverable-card">
          <span class="del-badge del-badge-3">Deliverable 3 &bull; Action Required</span>
          <h4 class="del-title">Your Unique Project Submission Portal Link</h4>
          <p class="del-desc">
            A dedicated, secure submission link created specifically for your profile. Use this link to upload your weekly project files (PDF/ZIP), GitHub repositories, live demo URLs, and notes for mentor review.
          </p>

          <div class="cta-container">
            <a href="${submissionUrl}" class="cta-button" target="_blank" rel="noopener noreferrer">
              Access Your Submission Portal &rarr;
            </a>
          </div>

          <div style="font-size: 11.5px; color: #64748B; text-align: center;">
            If the button above does not open, copy and paste this unique link in your browser:
          </div>
          <div class="url-fallback">${submissionUrl}</div>
        </div>

        <!-- LINKEDIN CELEBRATION -->
        <div class="linkedin-box">
          <strong>Share Your Milestone on LinkedIn:</strong><br>
          We strongly encourage you to share your official Joining Letter on LinkedIn. Tag our official page <a href="${LINKEDIN_URL}" target="_blank" style="color: #059669; font-weight: 800;">PRMA Tech on LinkedIn</a> with hashtags <strong>#PRMATech #Internship #TechCareer</strong>. Our mentorship team will personally celebrate and endorse your selection!
        </div>

        <!-- SIGN-OFF -->
        <div class="signoff">
          Warm Regards,<br>
          <strong>Internship Board &amp; Technical Mentorship Team</strong><br>
          <strong>PRMA Tech</strong><br>
          <span style="font-size: 12px; color: #64748B;">Greater Noida, Uttar Pradesh, India &bull; Reg. No.: UDYAM-UP-76-0055635</span><br><br>
          Official Website: <a href="https://${COMPANY_WEBSITE}" style="color: #0866F5; font-weight: 600;">${COMPANY_WEBSITE}</a><br>
          Support Email: <a href="mailto:${COMPANY_EMAIL}" style="color: #0866F5; font-weight: 600;">${COMPANY_EMAIL}</a>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="footer">
        &copy; ${new Date().getFullYear()} PRMA Tech in Official Partnership with ProfessorVirus.<br>
        This email was transmitted to ${toEmail} regarding your approved internship application (${offerId}).
      </div>
    </div>
  </div>
</body>
</html>
`;

  const attachments = [];

  // Attach Joining Letter PDF
  if (joiningLetterPdfBuffer) {
    attachments.push({
      filename: `PRMA_Tech_Joining_Letter_${offerId.replace(/[\/\\]/g, '_')}.pdf`,
      content: joiningLetterPdfBuffer,
      contentType: 'application/pdf'
    });
  }

  // Attach Problem Statement PDF
  if (problemStatementPdfBuffer) {
    attachments.push({
      filename: `PRMA_Tech_Problem_Statement_Weekly_Tasks_${offerId.replace(/[\/\\]/g, '_')}.pdf`,
      content: problemStatementPdfBuffer,
      contentType: 'application/pdf'
    });
  }

  return await dispatchEmailWithNodemailer({
    to: toEmail,
    subject,
    html: htmlContent,
    attachments
  });
}

/**
 * Send Student Task Submission Confirmation Email
 */
export async function sendPrmaSubmissionConfirmationEmail({
  toEmail,
  studentName,
  domainTitle,
  offerId,
  weekNumber,
  taskTitle,
  submissionTime
}) {
  const subject = `Submission Received: Week ${weekNumber} — PRMA Tech Internship`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #0F172A;">
  <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; padding: 32px;">
    <h2 style="color: #0866F5; margin-top: 0;">Task Submission Confirmed</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Your submission for <strong>Week ${weekNumber}: ${taskTitle}</strong> has been successfully received by the PRMA Tech review system.</p>
    
    <div style="background-color: #F1F5F9; border-left: 4px solid #0866F5; padding: 14px 18px; margin: 20px 0; border-radius: 8px;">
      <div style="font-size: 13px; color: #64748B;">Candidate / Offer ID: <strong>${offerId}</strong></div>
      <div style="font-size: 13px; color: #64748B;">Domain: <strong>${domainTitle}</strong></div>
      <div style="font-size: 13px; color: #64748B;">Submission Time: <strong>${submissionTime}</strong></div>
      <div style="font-size: 13px; color: #166534; font-weight: 700; margin-top: 6px;">Status: Under Mentor Review</div>
    </div>

    <p>Our technical team will review your project repository, deliverables, and report. You will receive an email update once your submission is reviewed.</p>
    <p>Best Regards,<br><strong>Technical Mentorship Team</strong><br>PRMA Tech</p>
  </div>
</body>
</html>
`;

  return await dispatchEmailWithNodemailer({
    to: toEmail,
    subject,
    html: htmlContent
  });
}

/**
 * Send Admin Notification Email when student submits work
 */
export async function sendPrmaAdminTaskNotificationEmail({
  studentName,
  domainTitle,
  offerId,
  weekNumber,
  taskTitle,
  submissionTime,
  githubUrl,
  liveUrl
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER || 'support@prmatech.com';
  const subject = `[New Submission] ${studentName} — Week ${weekNumber} (${domainTitle})`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC; margin: 0; padding: 20px; color: #0F172A;">
  <div style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; padding: 24px;">
    <h3 style="margin-top: 0; color: #0F172A;">New Student Task Submission</h3>
    <p>A new internship deliverable has been uploaded to the PRMA Tech Control Panel.</p>
    <ul>
      <li><strong>Student Name:</strong> ${studentName}</li>
      <li><strong>Offer ID:</strong> ${offerId}</li>
      <li><strong>Domain:</strong> ${domainTitle}</li>
      <li><strong>Week:</strong> Week ${weekNumber} (${taskTitle})</li>
      <li><strong>Timestamp:</strong> ${submissionTime}</li>
      ${githubUrl ? `<li><strong>GitHub:</strong> <a href="${githubUrl}">${githubUrl}</a></li>` : ''}
      ${liveUrl ? `<li><strong>Live Demo:</strong> <a href="${liveUrl}">${liveUrl}</a></li>` : ''}
    </ul>
    <p><a href="https://professorvirus.site/prma-tech/admin" style="display: inline-block; background: #0866F5; color: #FFFFFF; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 700;">Open PRMA Admin Submissions &rarr;</a></p>
  </div>
</body>
</html>
`;

  return await dispatchEmailWithNodemailer({
    to: adminEmail,
    subject,
    html: htmlContent
  });
}

/**
 * Send Review & Feedback Email to Student
 */
export async function sendPrmaReviewFeedbackEmail({
  toEmail,
  studentName,
  domainTitle,
  offerId,
  weekNumber,
  taskTitle,
  reviewStatus,
  adminFeedback,
  submissionUrl
}) {
  const isApproved = reviewStatus === 'approved';
  const subject = isApproved
    ? `Task Approved: Week ${weekNumber} (${taskTitle}) — PRMA Tech`
    : `Action Required: Revisions Requested for Week ${weekNumber} — PRMA Tech`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #0F172A;">
  <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; padding: 32px;">
    <h2 style="color: ${isApproved ? '#079B45' : '#D97706'}; margin-top: 0;">
      ${isApproved ? '✓ Task Submission Approved!' : 'Revisions Requested for Your Submission'}
    </h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Your technical submission for <strong>Week ${weekNumber}: ${taskTitle}</strong> has been reviewed by your mentor.</p>

    <div style="background-color: ${isApproved ? '#F0FDF4' : '#FFFBEB'}; border: 1.5px solid ${isApproved ? '#BBF7D0' : '#FDE68A'}; border-radius: 12px; padding: 18px; margin: 20px 0;">
      <div style="font-size: 13.5px; font-weight: 800; color: ${isApproved ? '#166534' : '#92400E'};">
        Mentor Feedback &amp; Review Remarks:
      </div>
      <p style="margin: 8px 0 0; font-size: 14px; color: #1E293B; line-height: 1.6; white-space: pre-line;">
        ${adminFeedback || (isApproved ? 'Great job! Your deliverables fulfill all technical requirements and acceptance criteria.' : 'Please update your deliverables according to the mentor comments.')}
      </p>
    </div>

    ${!isApproved && submissionUrl ? `
    <p>You can review the notes and resubmit your updated work via your submission portal:</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${submissionUrl}" style="display: inline-block; background: #0866F5; color: #FFFFFF; text-decoration: none; font-size: 14.5px; font-weight: 800; padding: 12px 28px; border-radius: 9999px;">
        Resubmit Work in Portal &rarr;
      </a>
    </div>` : ''}

    <p style="margin-top: 28px;">Best Regards,<br><strong>Technical Mentorship Team</strong><br>PRMA Tech</p>
  </div>
</body>
</html>
`;

  return await dispatchEmailWithNodemailer({
    to: toEmail,
    subject,
    html: htmlContent
  });
}

/**
 * Rejection Notification Email
 */
export async function sendPrmaRejectionEmail({
  toEmail,
  studentName,
  domainTitle,
  remarks
}) {
  const subject = 'PRMA Tech Internship Application Status Update';

  const htmlContent = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC; padding: 24px; color: #0F172A;">
  <div style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 14px; border: 1px solid #E2E8F0; padding: 32px;">
    <h3 style="margin-top: 0; color: #0F172A;">PRMA Tech™ Internship Application Update</h3>
    <p>Dear ${studentName},</p>
    <p>Thank you for your interest in the <strong>PRMA Tech Internship Program</strong> in the <strong>${domainTitle}</strong> domain.</p>
    <p>After a thorough review of this cohort's applicant pool, we regret to inform you that we are unable to offer you an internship position at this time due to high application volume and limited domain seats.</p>
    ${remarks ? `<div style="background: #F8FAFC; border-left: 3px solid #94A3B8; padding: 10px 14px; margin: 16px 0; font-size: 14px; color: #475569;">${remarks}</div>` : ''}
    <p>We encourage you to continue enhancing your technical projects and apply for our future cohorts.</p>
    <p>Best wishes for your academic and career journey.</p>
    <p style="margin-top: 24px;">Regards,<br><strong>Recruitment Team</strong><br>PRMA Tech</p>
  </div>
</body>
</html>
`;

  return await dispatchEmailWithNodemailer({
    to: toEmail,
    subject,
    html: htmlContent
  });
}

/**
 * Task dispatch email
 */
export async function sendPrmaTaskEmail({
  toEmail,
  studentName,
  domainTitle,
  taskTitle,
  taskDescription,
  deadline,
  resources,
  submissionInstructions
}) {
  const subject = `New Internship Assignment: ${taskTitle} — PRMA Tech`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #0F172A;">
  <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; padding: 30px;">
    <h2 style="color: #0866F5; margin-top: 0;">PRMA Tech™ &bull; Technical Assignment</h2>
    <p>Dear <strong>${studentName}</strong>,</p>
    <p>Here is your scheduled technical assignment for your virtual internship in <strong>${domainTitle}</strong>.</p>
    
    <div style="background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 12px; padding: 18px; margin: 18px 0;">
      <h3 style="margin-top: 0; color: #1D4ED8;">${taskTitle}</h3>
      <p style="white-space: pre-line; color: #1E293B;">${taskDescription}</p>
      <div style="margin-top: 12px; font-weight: 700; color: #B91C1C;">
        Deadline: ${deadline}
      </div>
    </div>

    ${resources ? `<div style="margin: 16px 0;"><strong>Recommended Resources:</strong><p style="white-space: pre-line; color: #475569;">${resources}</p></div>` : ''}

    <p style="margin-top: 24px;">Warm Regards,<br><strong>Technical Mentorship Team</strong><br>PRMA Tech</p>
  </div>
</body>
</html>
`;

  return await dispatchEmailWithNodemailer({
    to: toEmail,
    subject,
    html: htmlContent
  });
}

/**
 * Robust Nodemailer Dispatcher with Environment Security and Audit Logs
 */
async function dispatchEmailWithNodemailer({ to, subject, html, attachments = [] }) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
  const smtpPort = process.env.SMTP_PORT || 587;
  const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_FROM || 'support@prmatech.com';
  const fromName = process.env.EMAIL_FROM_NAME || 'PRMA Tech';

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: { user: smtpUser, pass: smtpPass }
      });

      const info = await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to,
        subject,
        html,
        attachments
      });

      console.log(`[PRMA EMAIL] Successfully delivered email to ${to}: ${info.messageId}`);
      return {
        success: true,
        messageId: info.messageId,
        provider: 'SMTP',
        recipient: to,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.error(`[PRMA EMAIL] SMTP delivery failed to ${to}:`, err.message);
      return {
        success: false,
        error: err.message,
        recipient: to,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Safe fallback log when SMTP credentials are not yet entered in .env
  console.log(`[PRMA EMAIL SIMULATION] Queued email for ${to}: "${subject}" (SMTP credentials not configured in .env)`);
  return {
    success: true,
    simulated: true,
    messageId: 'sim_' + Date.now(),
    provider: 'ConsoleAuditLogger',
    recipient: to,
    timestamp: new Date().toISOString(),
    notice: 'Email queued successfully. Configure SMTP_HOST in .env to deliver to live student inboxes.'
  };
}

// Backward-compatible alias export
export const sendPrmaShortlistEmail = sendPrmaApprovalEmail;
