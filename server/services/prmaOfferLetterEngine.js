/**
 * PRMA Tech - Official Internship Offer Letter PDF Generation Engine
 * Generates high-resolution, vector A4 PDF Offer Letters matching Reference Image 1
 * Strictly authentic layout: PRMA Tech branding, verified contact info, ISO/MSME seals,
 * dynamic QR verification code, and Rahul Verma COO signatory.
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export async function generatePrmaOfferLetterPdf({
  studentName = 'Priyanshu Kumar',
  domainTitle = 'Machine Learning',
  offerId = 'PRMA/INT/A1/93084',
  issueDate = '10-11-2026',
  joiningDate = '17-Nov-2026',
  completionDate = '17-Dec-2026',
  duration = '1 Month',
  mode = 'Remote',
  verificationUrl = ''
}) {
  const pdfDoc = await PDFDocument.create();
  // Standard A4: 595.28 x 841.89 points
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  // Load Standard Helvetica fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fontBoldOblique = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);

  // Palette matching official reference
  const primaryBlue = rgb(0.03, 0.4, 0.96);     // #0866F5
  const darkNavy = rgb(0.04, 0.14, 0.34);       // #0B2356
  const textDark = rgb(0.06, 0.09, 0.16);       // #0F172A
  const textMuted = rgb(0.39, 0.45, 0.55);      // #64748B
  const goldStar = rgb(0.85, 0.65, 0.13);       // #D97706
  const borderLight = rgb(0.88, 0.91, 0.94);    // #E2E8F0

  // 1. Draw Top Corner Aesthetic Waves / Accents
  page.drawRectangle({
    x: 0,
    y: height - 14,
    width: width,
    height: 14,
    color: primaryBlue
  });
  page.drawRectangle({
    x: 0,
    y: height - 22,
    width: width * 0.45,
    height: 8,
    color: rgb(0.23, 0.51, 0.96)
  });

  // 2. Header: PRMA Tech Logo on Left
  const logoTop = height - 60;

  // Draw colorful "P" logo block
  page.drawRectangle({
    x: 42,
    y: logoTop - 2,
    width: 28,
    height: 28,
    color: primaryBlue
  });
  page.drawText('P', {
    x: 48,
    y: logoTop + 4,
    size: 20,
    font: fontBold,
    color: rgb(1, 1, 1)
  });

  // "PRMA Tech"
  page.drawText('PRMA', {
    x: 76,
    y: logoTop + 8,
    size: 20,
    font: fontBold,
    color: textDark
  });
  page.drawText('Tech', {
    x: 138,
    y: logoTop + 8,
    size: 20,
    font: fontBold,
    color: primaryBlue
  });
  page.drawText('TM', {
    x: 184,
    y: logoTop + 14,
    size: 8,
    font: fontBold,
    color: textMuted
  });

  // Slogan
  page.drawText('Build • Learn • Innovate • Grow', {
    x: 76,
    y: logoTop - 5,
    size: 8.5,
    font: fontBold,
    color: textMuted
  });

  // 3. Header: Contact Information on Right
  const rightX = 360;
  page.drawText('www.prmatech.com', {
    x: rightX + 16,
    y: logoTop + 12,
    size: 8.5,
    font: fontRegular,
    color: textDark
  });
  page.drawText('[W]', {
    x: rightX,
    y: logoTop + 12,
    size: 7.5,
    font: fontBold,
    color: primaryBlue
  });

  page.drawText('support@prmatech.com', {
    x: rightX + 16,
    y: logoTop - 1,
    size: 8.5,
    font: fontRegular,
    color: textDark
  });
  page.drawText('[M]', {
    x: rightX,
    y: logoTop - 1,
    size: 7.5,
    font: fontBold,
    color: rgb(0.92, 0.26, 0.21)
  });

  page.drawText('PRMA Tech, Knowledge Park,', {
    x: rightX + 16,
    y: logoTop - 14,
    size: 8,
    font: fontRegular,
    color: textDark
  });
  page.drawText('Greater Noida, Uttar Pradesh - 201310', {
    x: rightX + 16,
    y: logoTop - 25,
    size: 8,
    font: fontRegular,
    color: textDark
  });
  page.drawText('[L]', {
    x: rightX,
    y: logoTop - 14,
    size: 7.5,
    font: fontBold,
    color: primaryBlue
  });

  // Header Divider
  page.drawLine({
    start: { x: 40, y: height - 105 },
    end: { x: width - 40, y: height - 105 },
    thickness: 1,
    color: borderLight
  });

  // 4. Centered Title: INTERNSHIP OFFER LETTER with Laurel & Stars
  const titleY = height - 142;
  page.drawText('INTERNSHIP OFFER LETTER', {
    x: 155,
    y: titleY,
    size: 19,
    font: fontBold,
    color: darkNavy
  });

  // Decorative stars
  page.drawText('*   *   *', {
    x: 270,
    y: titleY - 14,
    size: 13,
    font: fontBold,
    color: goldStar
  });

  // 5. Metadata Row: Date & Offer ID
  const metaY = height - 180;
  page.drawText(`Date: ${issueDate}`, {
    x: 42,
    y: metaY,
    size: 10,
    font: fontBold,
    color: textDark
  });

  const offerIdText = `Offer ID: ${offerId}`;
  const offerIdWidth = fontBold.widthOfTextAtSize(offerIdText, 10);
  page.drawText(offerIdText, {
    x: width - 42 - offerIdWidth,
    y: metaY,
    size: 10,
    font: fontBold,
    color: textDark
  });

  // 6. Body Text
  let currentY = metaY - 32;

  page.drawText(`Dear ${studentName},`, {
    x: 42,
    y: currentY,
    size: 10.5,
    font: fontBold,
    color: textDark
  });

  currentY -= 22;

  // Paragraph helper for clean justified/wrapped text
  const printParagraph = (lines, spacing = 14) => {
    for (const line of lines) {
      page.drawText(line, {
        x: 42,
        y: currentY,
        size: 9.5,
        font: fontRegular,
        color: rgb(0.12, 0.16, 0.22)
      });
      currentY -= spacing;
    }
    currentY -= 6;
  };

  printParagraph([
    `We are pleased to extend to you an offer for the position of ${domainTitle} Intern`,
    `at PRMA Tech. Your exceptional qualifications, strong analytical skills, and enthusiasm`,
    `for ${domainTitle.toLowerCase()} have greatly impressed us, and we are excited to welcome you to our team.`
  ]);

  printParagraph([
    `As a ${domainTitle} Intern at PRMA Tech, you will have the opportunity to work on real-world`,
    `projects in the field of ${domainTitle.toLowerCase()}. Your role will involve practical assignments, system`,
    `development, experimentation, and optimization. Your contributions will be pivotal in`,
    `developing innovative solutions and supporting our ongoing technology initiatives.`
  ]);

  printParagraph([
    `The internship will be for a duration of ${duration} in ${mode.toLowerCase()} mode, starting from ${joiningDate}.`,
    `During this period, you will work under the guidance of our mentors and be expected to maintain`,
    `professionalism, meet project deadlines, and adhere to company policies.`
  ]);

  printParagraph([
    `Upon successful completion of the internship, you will be awarded an Internship Completion`,
    `Certificate and a Letter of Recommendation (LOR) based on your performance.`
  ]);

  printParagraph([
    `We would like to take this opportunity to congratulate you once again and warmly welcome you`,
    `to PRMA Tech. We are enthusiastic about the prospect of working with you and look forward to an`,
    `exciting journey together.`
  ]);

  // 7. Signatory
  currentY -= 10;
  page.drawText('Best regards,', {
    x: 42,
    y: currentY,
    size: 10,
    font: fontRegular,
    color: textDark
  });

  currentY -= 26;
  // Simulated signature
  page.drawText('Rahul Verma', {
    x: 44,
    y: currentY,
    size: 15,
    font: fontBoldOblique,
    color: primaryBlue
  });

  currentY -= 15;
  page.drawText('Rahul Verma', {
    x: 42,
    y: currentY,
    size: 10.5,
    font: fontBold,
    color: textDark
  });

  currentY -= 13;
  page.drawText('Co-Founder & Chief Operating Officer', {
    x: 42,
    y: currentY,
    size: 8.5,
    font: fontRegular,
    color: textMuted
  });

  currentY -= 12;
  page.drawText('PRMA Tech', {
    x: 42,
    y: currentY,
    size: 8.5,
    font: fontBold,
    color: primaryBlue
  });

  // 8. Bottom Badges: Round Seal, ISO Seal, MSME Seal, and Real QR Code
  const footerY = 65;

  // Circular Badge 1: PRMA Tech Round Seal
  page.drawCircle({
    x: 230,
    y: footerY + 28,
    size: 26,
    color: rgb(0.95, 0.97, 1),
    borderColor: primaryBlue,
    borderWidth: 1.5
  });
  page.drawText('PRMA Tech', {
    x: 211,
    y: footerY + 34,
    size: 6.5,
    font: fontBold,
    color: darkNavy
  });
  page.drawText('* * *', {
    x: 221,
    y: footerY + 23,
    size: 7,
    font: fontBold,
    color: goldStar
  });
  page.drawText('VERIFIED', {
    x: 213,
    y: footerY + 14,
    size: 6,
    font: fontBold,
    color: primaryBlue
  });

  // Circular Badge 2: ISO 9001:2015 Seal
  page.drawCircle({
    x: 305,
    y: footerY + 28,
    size: 26,
    color: rgb(0.95, 0.97, 1),
    borderColor: darkNavy,
    borderWidth: 1.5
  });
  page.drawText('ISO', {
    x: 297,
    y: footerY + 36,
    size: 8,
    font: fontBold,
    color: darkNavy
  });
  page.drawText('9001:2015', {
    x: 288,
    y: footerY + 26,
    size: 6.5,
    font: fontBold,
    color: primaryBlue
  });
  page.drawText('CERTIFIED', {
    x: 289,
    y: footerY + 15,
    size: 6,
    font: fontBold,
    color: textDark
  });

  // Badge 3: MSME Seal
  page.drawRectangle({
    x: 355,
    y: footerY + 5,
    width: 78,
    height: 46,
    color: rgb(0.98, 0.99, 1),
    borderColor: rgb(0.85, 0.88, 0.92),
    borderWidth: 1
  });
  page.drawText('MSME', {
    x: 376,
    y: footerY + 33,
    size: 10,
    font: fontBold,
    color: textDark
  });
  page.drawText('Govt. of India', {
    x: 368,
    y: footerY + 21,
    size: 6.5,
    font: fontBold,
    color: rgb(0.85, 0.45, 0.1)
  });
  page.drawText('Enterprise Registered', {
    x: 358,
    y: footerY + 10,
    size: 5.5,
    font: fontRegular,
    color: textMuted
  });

  // 9. Real Dynamic QR Code for Verification
  const verifyTarget = verificationUrl || `https://professorvirus.site/prma-tech/verify-offer/${encodeURIComponent(offerId)}`;
  try {
    const qrPngBuffer = await QRCode.toBuffer(verifyTarget, {
      width: 140,
      margin: 1,
      color: {
        dark: '#0B2356',
        light: '#FFFFFF'
      }
    });

    const qrImage = await pdfDoc.embedPng(qrPngBuffer);
    page.drawImage(qrImage, {
      x: 472,
      y: footerY + 6,
      width: 48,
      height: 48
    });

    page.drawText('Verify Offer Letter', {
      x: 462,
      y: footerY - 4,
      size: 7,
      font: fontBold,
      color: darkNavy
    });
  } catch (err) {
    console.warn('[PDF GENERATOR] QR Code embedding notice:', err.message);
  }

  // 10. Bottom Aesthetic Wave Accent
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: 12,
    color: primaryBlue
  });
  page.drawRectangle({
    x: width * 0.55,
    y: 12,
    width: width * 0.45,
    height: 6,
    color: rgb(0.23, 0.51, 0.96)
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
