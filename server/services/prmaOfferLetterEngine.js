/**
 * PRMA Tech - Official Internship Joining Letter PDF Generation Engine
 * Generates official high-resolution vector/template A4 PDF Joining Letters
 * matching the user's authentic PRMA Tech Joining Letter template.
 *
 * Includes:
 * - PRMA Tech multi-color corporate branding & MSME Udyam Registration (UDYAM-UP-76-0055635)
 * - Official purple ribbon header: "INTERNSHIP JOINING LETTER"
 * - Document Metadata Box: Issue Date, Candidate ID, Document Reference, Category
 * - Candidate Profile Box: Name, Father's Name (if present), Designation, Domain, Duration & Work Mode
 * - Formal corporate appointment body text with personalized domain description
 * - Authorized Signatory (Priyanshu Kumar, Founder / Authorized Representative)
 * - Official Company Seal & MSME Registered Emblem
 * - Dynamic scannable QR Code linking to live credential verification
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export async function generatePrmaOfferLetterPdf({
  studentName = 'Candidate',
  fatherName = '',
  domainTitle = 'Artificial Intelligence & Machine Learning (AI/ML)',
  offerId = 'PRMA-AIML-2026-001',
  issueDate = '',
  joiningDate = '',
  completionDate = '',
  duration = '1 Month',
  mode = 'Fully Remote',
  verificationUrl = ''
}) {
  const pdfDoc = await PDFDocument.create();
  // Standard A4: 595.28 x 841.89 points
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  // Load standard fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Palette
  const white = rgb(1, 1, 1);
  const boxBg = rgb(0.957, 0.965, 0.976); // #F4F6F9 soft greyish tint
  const textDark = rgb(0.06, 0.09, 0.16);   // #0F172A
  const textMuted = rgb(0.39, 0.45, 0.55);  // #64748B
  const navy = rgb(0.06, 0.11, 0.31);       // #101C50

  // Format dates
  const now = new Date();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const formattedIssueDate = issueDate || `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  // Default joining date: 7 days ahead if not provided
  let formattedJoiningDate = joiningDate;
  if (!formattedJoiningDate) {
    const nextWeek = new Date(now.getTime() + 7 * 86400000);
    formattedJoiningDate = `${nextWeek.getDate()} ${months[nextWeek.getMonth()]} ${nextWeek.getFullYear()}`;
  }

  // Default completion date: 30 days after joining
  let formattedCompletionDate = completionDate;
  if (!formattedCompletionDate) {
    const nextMonth = new Date(now.getTime() + 37 * 86400000);
    formattedCompletionDate = `${nextMonth.getDate()} ${months[nextMonth.getMonth()]} ${nextMonth.getFullYear()}`;
  }

  // Generate Document Reference number
  const yearStr = now.getFullYear();
  const cleanId = offerId.replace(/[^a-zA-Z0-9]/g, '').slice(-3) || '001';
  const docReference = `PRMA/INT/${yearStr}/${cleanId.padStart(3, '0')}`;

  // 1. Template Image Background
  const templatePaths = [
    path.resolve(process.cwd(), 'server/data/templates/prma_joining_letter_template.jpg'),
    path.resolve(process.cwd(), 'public/assets/prma_templates/prma_joining_letter_template.jpg')
  ];

  let templateImg = null;
  for (const tPath of templatePaths) {
    if (fs.existsSync(tPath)) {
      try {
        const imgBytes = fs.readFileSync(tPath);
        templateImg = await pdfDoc.embedJpg(imgBytes);
        break;
      } catch (err) {
        console.warn('[PRMA PDF Engine] Error loading template image:', err.message);
      }
    }
  }

  if (templateImg) {
    // Draw base template
    page.drawImage(templateImg, {
      x: 0,
      y: 0,
      width,
      height
    });

    // 2. Overwrite Dynamic Fields on Template

    // --- Box 1: Document Metadata (Mask & Draw) ---
    // Background mask for Box 1
    page.drawRectangle({
      x: 92,
      y: 554,
      width: 440,
      height: 35,
      color: boxBg
    });

    // Left Column
    page.drawText('Issue Date:', { x: 98, y: 574, size: 8.5, font: fontBold, color: textDark });
    page.drawText(formattedIssueDate, { x: 155, y: 574, size: 8.5, font: fontRegular, color: textDark });

    page.drawText('Candidate ID:', { x: 98, y: 560, size: 8.5, font: fontBold, color: textDark });
    page.drawText(offerId, { x: 155, y: 560, size: 8.5, font: fontBold, color: textDark });

    // Right Column
    page.drawText('Document Reference:', { x: 308, y: 574, size: 8.5, font: fontBold, color: textDark });
    page.drawText(docReference, { x: 412, y: 574, size: 8.5, font: fontRegular, color: textDark });

    page.drawText('Internship Category:', { x: 308, y: 560, size: 8.5, font: fontBold, color: textDark });
    page.drawText('Technical Internship', { x: 412, y: 560, size: 8.5, font: fontRegular, color: textDark });

    // --- Box 2: Candidate Profile (Mask & Draw) ---
    // Background mask for Box 2
    page.drawRectangle({
      x: 92,
      y: 468,
      width: 440,
      height: 76,
      color: white
    });

    // Candidate Header: e.g. "CANDIDATE: MAHAK GARG" (or with Father's name if present)
    const displayName = fatherName
      ? `CANDIDATE: ${studentName.toUpperCase()} (S/D OF ${fatherName.toUpperCase()})`
      : `CANDIDATE: ${studentName.toUpperCase()}`;

    // Center header text
    const nameWidth = fontBold.widthOfTextAtSize(displayName, 11);
    const nameX = Math.max(98, (width - nameWidth) / 2);
    page.drawText(displayName, {
      x: nameX,
      y: 526,
      size: 11,
      font: fontBold,
      color: navy
    });

    // Details Line 1: Designation
    const desigText = `Designation: ${domainTitle} Intern`;
    const desigWidth = fontRegular.widthOfTextAtSize(desigText, 8.5);
    page.drawText(desigText, {
      x: Math.max(98, (width - desigWidth) / 2),
      y: 511,
      size: 8.5,
      font: fontRegular,
      color: textDark
    });

    // Details Line 2: Domain
    const domainLine = `Domain: ${domainTitle}`;
    const domainWidth = fontRegular.widthOfTextAtSize(domainLine, 8.5);
    page.drawText(domainLine, {
      x: Math.max(98, (width - domainWidth) / 2),
      y: 498,
      size: 8.5,
      font: fontRegular,
      color: textDark
    });

    // Details Line 3: Department
    const deptLine = 'Department: Technology & Engineering';
    const deptWidth = fontRegular.widthOfTextAtSize(deptLine, 8.5);
    page.drawText(deptLine, {
      x: Math.max(98, (width - deptWidth) / 2),
      y: 485,
      size: 8.5,
      font: fontRegular,
      color: textDark
    });

    // Details Line 4: Duration & Mode
    const durLine = `Duration: ${duration} (${formattedJoiningDate} – ${formattedCompletionDate}) | Work Mode: ${mode}`;
    const durWidth = fontRegular.widthOfTextAtSize(durLine, 8);
    page.drawText(durLine, {
      x: Math.max(98, (width - durWidth) / 2),
      y: 472,
      size: 8,
      font: fontRegular,
      color: textDark
    });

    // --- Letter Body (Mask & Draw) ---
    page.drawRectangle({
      x: 65,
      y: 198,
      width: 468,
      height: 258,
      color: white
    });

    let currentY = 442;
    const bodySize = 8.5;
    const lineHeight = 13.5;
    const marginX = 72;
    const maxTextWidth = 450;

    // Salutation
    page.drawText(`Dear ${studentName},`, {
      x: marginX,
      y: currentY,
      size: 9.5,
      font: fontBold,
      color: textDark
    });
    currentY -= 17;

    // Paragraph 1
    const p1 = `We are pleased to welcome you to PRMA Tech as an ${domainTitle} Intern.`;
    page.drawText(p1, {
      x: marginX,
      y: currentY,
      size: bodySize,
      font: fontBold,
      color: textDark
    });
    currentY -= 17;

    // Paragraph 2 (Wrapped)
    const p2 = `Your internship will provide an opportunity to explore practical applications of ${domainTitle}, develop technical skills, and gain exposure to structured technology assignments.`;
    currentY = drawWrappedText(page, p2, marginX, currentY, maxTextWidth, lineHeight, bodySize, fontRegular, textDark);
    currentY -= 6;

    // Paragraph 3 (Wrapped)
    const p3 = `During this internship, you will work on learning-oriented ${domainTitle} activities, explore production-grade workflows, understand software architecture and data pipelines, feature implementation and testing, and complete assigned projects under mentor guidance.`;
    currentY = drawWrappedText(page, p3, marginX, currentY, maxTextWidth, lineHeight, bodySize, fontRegular, textDark);
    currentY -= 6;

    // Paragraph 4
    const p4 = `Your internship is scheduled from ${formattedJoiningDate} to ${formattedCompletionDate} and will be conducted entirely in remote mode.`;
    currentY = drawWrappedText(page, p4, marginX, currentY, maxTextWidth, lineHeight, bodySize, fontBold, textDark);
    currentY -= 6;

    // Paragraph 5
    const p5 = `We expect you to demonstrate dedication, professional conduct, discipline, and active participation throughout your journey. We wish you a highly successful and productive learning experience with us. Welcome aboard!`;
    currentY = drawWrappedText(page, p5, marginX, currentY, maxTextWidth, lineHeight, bodySize, fontRegular, textDark);

    // --- QR Code ---
    try {
      const finalVerifyUrl =
        verificationUrl ||
        `https://professorvirus.site/prma-tech/verify-offer/${encodeURIComponent(offerId)}`;

      const qrPngBuffer = await QRCode.toBuffer(finalVerifyUrl, {
        margin: 1,
        width: 180,
        color: {
          dark: '#0F172A',
          light: '#FFFFFF'
        }
      });
      const qrImg = await pdfDoc.embedPng(qrPngBuffer);

      // Mask and overlay QR Code in designated box
      page.drawRectangle({
        x: 454,
        y: 91,
        width: 68,
        height: 70,
        color: white
      });
      page.drawImage(qrImg, {
        x: 456,
        y: 93,
        width: 64,
        height: 64
      });
    } catch (qrErr) {
      console.warn('[PRMA PDF Engine] QR code generation warning:', qrErr.message);
    }
  } else {
    // Pure vector fallback if template image is somehow unavailable
    console.warn('[PRMA PDF Engine] Rendering pure vector fallback joining letter');
    renderVectorJoiningLetter(page, {
      studentName,
      fatherName,
      domainTitle,
      offerId,
      formattedIssueDate,
      formattedJoiningDate,
      formattedCompletionDate,
      duration,
      mode,
      docReference,
      fontRegular,
      fontBold
    });
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

/**
 * Word wrap helper for PDF text blocks
 */
function drawWrappedText(page, text, startX, startY, maxWidth, lineHeight, fontSize, font, color) {
  const words = text.split(' ');
  let currentLine = '';
  let y = startY;

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > maxWidth && currentLine) {
      page.drawText(currentLine, { x: startX, y, size: fontSize, font, color });
      y -= lineHeight;
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    page.drawText(currentLine, { x: startX, y, size: fontSize, font, color });
    y -= lineHeight;
  }

  return y;
}

/**
 * Pure Vector Fallback Renderer
 */
function renderVectorJoiningLetter(page, opts) {
  const {
    studentName,
    domainTitle,
    offerId,
    formattedIssueDate,
    formattedJoiningDate,
    formattedCompletionDate,
    duration,
    mode,
    docReference,
    fontRegular,
    fontBold
  } = opts;

  const { width, height } = page.getSize();
  const navy = rgb(0.06, 0.11, 0.31);
  const textDark = rgb(0.06, 0.09, 0.16);

  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: navy,
    borderWidth: 2
  });

  page.drawText('PRMA Tech™', {
    x: 40,
    y: height - 60,
    size: 22,
    font: fontBold,
    color: navy
  });

  page.drawText('INTERNSHIP JOINING LETTER', {
    x: 40,
    y: height - 90,
    size: 14,
    font: fontBold,
    color: rgb(0.44, 0.15, 0.91)
  });

  page.drawText(`Date: ${formattedIssueDate} | Ref: ${docReference} | Offer ID: ${offerId}`, {
    x: 40,
    y: height - 115,
    size: 9,
    font: fontRegular,
    color: textDark
  });

  page.drawText(`Candidate: ${studentName}`, {
    x: 40,
    y: height - 150,
    size: 12,
    font: fontBold,
    color: navy
  });

  page.drawText(`Domain: ${domainTitle} | Duration: ${duration} (${formattedJoiningDate} to ${formattedCompletionDate})`, {
    x: 40,
    y: height - 170,
    size: 9.5,
    font: fontRegular,
    color: textDark
  });

  const body = `We are pleased to welcome you to PRMA Tech as an ${domainTitle} Intern. This internship is conducted in remote mode from ${formattedJoiningDate} to ${formattedCompletionDate}.`;
  drawWrappedText(page, body, 40, height - 210, width - 80, 15, 10, fontRegular, textDark);

  page.drawText('Authorized Signatory: PRIYANSHU KUMAR (Founder, PRMA Tech)', {
    x: 40,
    y: 100,
    size: 9.5,
    font: fontBold,
    color: navy
  });
}
