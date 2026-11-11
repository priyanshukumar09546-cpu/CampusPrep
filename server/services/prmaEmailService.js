/**
 * PRMA Tech - Official Internship Email Automation Service
 * Handles transactional student notifications, shortlisting announcements,
 * task assignments, and attaches personalized PDF offer letters.
 */

import nodemailer from 'nodemailer';

/**
 * Send official Shortlist / Offer Letter email matching Requirement 8
 */
export async function sendPrmaShortlistEmail({
  toEmail,
  studentName,
  domainTitle,
  offerId,
  joiningDate,
  completionDate,
  pdfBuffer
}) {
  const subject = 'Congratulations! You Have Been Shortlisted — PRMA Tech Internship Program';
  const companyWebsite = 'www.prmatech.com';
  const companyEmail = 'support@prmatech.com';
  const linkedInUrl = 'https://www.linkedin.com/company/prmatech';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #0F172A; }
    .card { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    .header { background: #FFFFFF; padding: 28px 24px 20px; text-align: center; border-bottom: 2px solid #F1F5F9; }
    .logo-container { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; }
    .logo-p { color: #0866F5; }
    .logo-r { color: #EA4335; }
    .logo-m { color: #FBBC05; }
    .logo-a { color: #34A853; }
    .logo-tech { color: #1E293B; margin-left: 2px; }
    .logo-slogan { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #64748B; margin-top: 6px; font-weight: 700; }
    .body-content { padding: 32px 28px; line-height: 1.68; font-size: 15px; color: #1E293B; }
    .greeting { font-size: 18px; font-weight: 700; color: #0F172A; margin: 0 0 14px; }
    .congrats { font-size: 17px; font-weight: 800; color: #0866F5; margin: 0 0 14px; }
    .domain-badge { display: inline-block; background-color: #EFF6FF; border: 1.5px solid #BFDBFE; color: #1D4ED8; font-weight: 800; font-size: 16px; padding: 10px 18px; border-radius: 10px; margin: 12px 0 20px; }
    .details-box { background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #EEF2F6; font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748B; font-weight: 600; }
    .detail-value { color: #0F172A; font-weight: 700; }
    .highlight-card { background: #F0FDF4; border: 1.5px solid #BBF7D0; border-radius: 12px; padding: 18px; margin: 22px 0; color: #166534; font-size: 14px; line-height: 1.6; }
    .footer { background: #F8FAFC; padding: 24px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo-container">
        <span class="logo-p">P</span><span class="logo-r">R</span><span class="logo-m">M</span><span class="logo-a">A</span>
        <span class="logo-tech">Tech™</span>
      </div>
      <div class="logo-slogan">Build • Learn • Innovate • Grow</div>
    </div>
    <div class="body-content">
      <div class="greeting">Dear ${studentName},</div>
      <div class="congrats">Congratulations!</div>
      
      <p style="margin: 0 0 12px;">We are pleased to inform you that your application has been shortlisted for the <strong>PRMA Tech Internship Program</strong>.</p>
      
      <p style="margin: 0 0 4px; font-weight: 600; color: #475569;">You have been selected for the following domain:</p>
      <div class="domain-badge">${domainTitle}</div>

      <div class="details-box">
        <div style="font-weight: 800; color: #0F172A; margin-bottom: 12px; font-size: 15px; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px;">Internship Details:</div>
        <div class="detail-row"><span class="detail-label">Organization:</span><span class="detail-value">PRMA Tech</span></div>
        <div class="detail-row"><span class="detail-label">Internship Domain:</span><span class="detail-value">${domainTitle}</span></div>
        <div class="detail-row"><span class="detail-label">Duration:</span><span class="detail-value">1 Month</span></div>
        <div class="detail-row"><span class="detail-label">Mode:</span><span class="detail-value">Remote</span></div>
        <div class="detail-row"><span class="detail-label">Joining Date:</span><span class="detail-value">${joiningDate}</span></div>
        <div class="detail-row"><span class="detail-label">Completion Date:</span><span class="detail-value">${completionDate}</span></div>
        <div class="detail-row"><span class="detail-label">Offer ID:</span><span class="detail-value" style="font-family: monospace; color: #0866F5;">${offerId}</span></div>
      </div>

      <p>We are excited to welcome you to our learning community.</p>
      <p><strong>Your personalized Internship Joining Letter is attached to this email.</strong></p>

      <div class="highlight-card">
        <strong>IMPORTANT:</strong> Please share your official joining letter on LinkedIn and tag our official <a href="${linkedInUrl}" style="color: #059669; font-weight: 800; text-decoration: underline;">PRMA Tech LinkedIn page</a>.<br><br>
        We would love to see you share your learning journey with our community. Our team will respond to your post through our official LinkedIn page.
      </div>

      <p>During the internship, you will receive project assignments, learning tasks and further instructions through your registered email.</p>
      
      <p style="font-size: 15px; font-weight: 700; color: #0866F5; margin-top: 20px;">Stay curious, keep learning and give your best!</p>

      <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #E2E8F0; font-size: 14px; line-height: 1.6;">
        Warm Regards,<br>
        <strong>HR &amp; Internship Team</strong><br>
        <strong>PRMA Tech</strong><br>
        <span style="font-size: 12px; color: #64748B;">Build • Learn • Innovate • Grow</span><br><br>
        Website: <a href="https://${companyWebsite}" style="color: #0866F5; font-weight: 600;">${companyWebsite}</a><br>
        Email: <a href="mailto:${companyEmail}" style="color: #0866F5; font-weight: 600;">${companyEmail}</a>
      </div>
    </div>
    <div class="footer">
      PRMA Tech &bull; Emerging Technology &amp; Learning Platform<br>
      This is an automated transmission. Please check attachments for your official joining letter.
    </div>
  </div>
</body>
</html>
`;

  return await dispatchEmailWithNodemailer({
    to: toEmail,
    subject,
    html: htmlContent,
    attachments: pdfBuffer ? [
      {
        filename: `PRMA_Tech_Joining_Letter_${offerId.replace(/[\/\\]/g, '_')}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }
    ] : []
  });
}

/**
 * Send official Task / Assignment email to student (Requirement 9)
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
  const companyWebsite = 'www.prmatech.com';
  const companyEmail = 'support@prmatech.com';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #0F172A; }
    .card { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { background: #0F172A; padding: 24px; text-align: center; color: #FFFFFF; }
    .body { padding: 30px 24px; line-height: 1.65; font-size: 15px; }
    .task-box { background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 12px; padding: 20px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 style="margin: 0; font-size: 20px;">PRMA Tech™ &bull; Internship Task Instruction</h2>
      <div style="font-size: 12px; color: #94A3B8; margin-top: 4px;">Domain: ${domainTitle}</div>
    </div>
    <div class="body">
      <p>Dear <strong>${studentName}</strong>,</p>
      <p>Here is your scheduled technical assignment for your 1-Month Virtual Internship at PRMA Tech.</p>
      
      <div class="task-box">
        <h3 style="margin-top: 0; color: #1D4ED8;">${taskTitle}</h3>
        <p style="white-space: pre-line; color: #1E293B;">${taskDescription}</p>
        <div style="margin-top: 14px; font-weight: 700; color: #B91C1C;">
          Deadline: ${deadline}
        </div>
      </div>

      ${resources ? `
      <div style="margin: 18px 0;">
        <strong>Recommended Learning Resources:</strong>
        <p style="white-space: pre-line; color: #475569; font-size: 14px;">${resources}</p>
      </div>` : ''}

      ${submissionInstructions ? `
      <div style="margin: 18px 0; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 10px;">
        <strong>Submission Guidelines:</strong>
        <p style="white-space: pre-line; color: #334155; font-size: 14px; margin-bottom: 0;">${submissionInstructions}</p>
      </div>` : ''}

      <p style="margin-top: 24px;">Please review the task requirements carefully and complete the deliverables before the deadline. If you have any technical queries, reach out to <a href="mailto:${companyEmail}">${companyEmail}</a>.</p>
      
      <p>Warm Regards,<br><strong>Technical Mentorship Team</strong><br>PRMA Tech</p>
    </div>
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
 * Send Rejection Notification email
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
 * Internal helper: Dispatches email via SMTP or simulates safely with audit record
 */
async function dispatchEmailWithNodemailer({ to, subject, html, attachments = [] }) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = process.env.SMTP_PORT || 587;
  const fromEmail = process.env.SMTP_FROM || 'support@prmatech.com';

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: { user: smtpUser, pass: smtpPass }
      });

      const info = await transporter.sendMail({
        from: `"PRMA Tech" <${fromEmail}>`,
        to,
        subject,
        html,
        attachments
      });

      console.log(`[PRMA EMAIL] Successfully sent email to ${to}: ${info.messageId}`);
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
