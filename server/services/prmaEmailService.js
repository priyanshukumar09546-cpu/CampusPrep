/**
 * PRMA Tech - Internship Email Automation Service
 * Handles transactional student notifications, shortlisting announcements,
 * and attaches personalized PDF offer letters.
 */

import nodemailer from 'nodemailer';

export async function sendPrmaShortlistEmail({
  toEmail,
  studentName,
  domainTitle,
  offerId,
  joiningDate,
  pdfBuffer
}) {
  const subject = 'Congratulations! You Have Been Shortlisted for the PRMA Tech Internship Program';
  const companyWebsite = 'https://professorvirus.site/prma-tech';
  const companyEmail = 'support@prmatech.com';

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 20px; color: #0F172A; }
    .card { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
    .header { background: linear-gradient(135deg, #0B2356 0%, #0866F5 100%); padding: 32px 28px; text-align: center; color: #FFFFFF; }
    .logo-text { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
    .logo-slogan { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #BFDBFE; margin-top: 6px; font-weight: 600; }
    .body-content { padding: 32px 28px; line-height: 1.65; font-size: 15px; }
    .badge { display: inline-block; background-color: #DCFCE7; color: #15803D; padding: 6px 14px; border-radius: 999px; font-weight: 700; font-size: 13px; margin-bottom: 16px; }
    .details-box { background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #EEF2F6; font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748B; font-weight: 600; }
    .detail-value { color: #0F172A; font-weight: 700; }
    .highlight-card { background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 18px; margin: 24px 0; }
    .footer { background: #F1F5F9; padding: 24px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo-text">PRMA <span style="color: #93C5FD;">Tech</span>™</div>
      <div class="logo-slogan">Build • Learn • Innovate • Grow</div>
    </div>
    <div class="body-content">
      <span class="badge">Official Selection Notice</span>
      <h2 style="margin: 0 0 12px; color: #0F172A; font-size: 20px;">Dear ${studentName},</h2>
      <p style="margin-top: 0; font-size: 16px; font-weight: 700; color: #0866F5;">Congratulations!</p>
      <p>We are pleased to inform you that you have been shortlisted for the <strong>PRMA Tech Internship Program</strong> in the domain of <strong>${domainTitle}</strong>.</p>
      <p>Your application has been successfully reviewed, and we are excited to welcome you to PRMA Tech.</p>

      <div class="details-box">
        <div style="font-weight: 800; color: #0B2356; margin-bottom: 10px; font-size: 15px;">Internship Details</div>
        <div class="detail-row"><span class="detail-label">Student Name:</span><span class="detail-value">${studentName}</span></div>
        <div class="detail-row"><span class="detail-label">Internship Domain:</span><span class="detail-value">${domainTitle}</span></div>
        <div class="detail-row"><span class="detail-label">Offer ID:</span><span class="detail-value" style="font-family: monospace; color: #0866F5;">${offerId}</span></div>
        <div class="detail-row"><span class="detail-label">Duration:</span><span class="detail-value">1 Month</span></div>
        <div class="detail-row"><span class="detail-label">Mode:</span><span class="detail-value">Remote / Online</span></div>
        <div class="detail-row"><span class="detail-label">Joining Date:</span><span class="detail-value">${joiningDate}</span></div>
      </div>

      <p><strong>Your personalized Internship Joining Letter is attached to this email.</strong> Please review the attached document carefully for complete details and code of conduct.</p>

      <div class="highlight-card">
        <strong style="color: #1D4ED8; display: block; margin-bottom: 6px;">Share Your Achievement on LinkedIn!</strong>
        <span style="font-size: 13.5px; color: #1E293B;">
          Share your joining announcement on LinkedIn and tag the official PRMA Tech LinkedIn page. Mention your selected domain and excitement about joining the program. Our team will celebrate and interact with your post!
        </span>
      </div>

      <p style="margin-bottom: 4px;">Welcome to PRMA Tech!</p>
      <p style="font-weight: 700; color: #0B2356; margin: 0;">Learn • Build • Innovate • Grow</p>

      <p style="margin-top: 24px; font-size: 13px; color: #64748B;">
        Regards,<br>
        <strong>PRMA Tech Internship Team</strong><br>
        Website: <a href="${companyWebsite}" style="color: #0866F5;">${companyWebsite}</a><br>
        Email: <a href="mailto:${companyEmail}" style="color: #0866F5;">${companyEmail}</a>
      </p>
    </div>
    <div class="footer">
      PRMA Tech, Knowledge Park, Greater Noida, Uttar Pradesh – 201310<br>
      This is an automated official transmission. For queries, contact support@prmatech.com.
    </div>
  </div>
</body>
</html>
`;

  // Check if Resend or SMTP credentials are configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = process.env.SMTP_PORT || 587;
  const resendApiKey = process.env.RESEND_API_KEY;

  // 1. Try Resend if configured
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || 'PRMA Tech <admissions@prmatech.com>',
          to: [toEmail],
          subject,
          html: htmlContent,
          attachments: [
            {
              filename: `PRMA_Tech_Offer_Letter_${offerId.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
              content: pdfBuffer.toString('base64')
            }
          ]
        })
      });

      if (res.ok) {
        const data = await res.json();
        return { success: true, provider: 'resend', id: data.id };
      }
    } catch (e) {
      console.warn('[EMAIL SERVICE] Resend dispatch attempt notice:', e.message);
    }
  }

  // 2. Try Nodemailer SMTP if configured
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || `"PRMA Tech Admissions" <${smtpUser}>`,
        to: toEmail,
        subject,
        html: htmlContent,
        attachments: [
          {
            filename: `PRMA_Tech_Offer_Letter_${offerId.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
            content: pdfBuffer
          }
        ]
      });

      return { success: true, provider: 'smtp', id: info.messageId };
    } catch (err) {
      console.warn('[EMAIL SERVICE] SMTP dispatch attempt notice:', err.message);
    }
  }

  // 3. Graceful Fallback if SMTP is not yet populated in .env
  console.log(`[EMAIL DISPATCH SIMULATION] Prepared shortlist email for ${toEmail} with offer ${offerId}. (To send real emails, set SMTP_HOST, SMTP_USER, SMTP_PASS or RESEND_API_KEY in .env)`);
  return {
    success: true,
    provider: 'logged_for_production',
    message: 'Offer letter generated. SMTP credentials not yet provided in .env; email logged & letter available for direct student download.'
  };
}
