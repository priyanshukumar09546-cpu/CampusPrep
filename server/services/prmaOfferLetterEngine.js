/**
 * PRMA Tech - Official Internship Offer Letter PDF Generation Engine
 * Generates vector A4 PDF Offer Letters matching Reference Image 2 exactly.
 * Official PRMA Tech branding, contact info, graduation cap laurel wreath title,
 * dynamic candidate and domain details, Rahul Verma COO signature, authentic seals
 * (PRMA Tech, ISO 9001:2015, MSME Govt. of India), and scannable QR verification code.
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
  duration = '8 weeks',
  mode = 'remote',
  verificationUrl = ''
}) {
  const pdfDoc = await PDFDocument.create();
  // Standard A4: 595.28 x 841.89 points
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  // Load Standard Helvetica fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Palette
  const textDark = rgb(0.06, 0.09, 0.16);     // #0F172A

  // 1. Resolve Asset Paths
  const headerPath = path.resolve(process.cwd(), 'public/assets/prma_portal_ref/offer_header.png');
  const footerPath = path.resolve(process.cwd(), 'public/assets/prma_portal_ref/offer_footer.png');

  let headerImg = null;
  let footerImg = null;

  try {
    if (fs.existsSync(headerPath)) {
      const headerBytes = fs.readFileSync(headerPath);
      headerImg = await pdfDoc.embedPng(headerBytes);
    }
    if (fs.existsSync(footerPath)) {
      const footerBytes = fs.readFileSync(footerPath);
      footerImg = await pdfDoc.embedPng(footerBytes);
    }
  } catch (err) {
    console.warn('[PRMA PDF Engine] Asset load warning, using vector fallback:', err.message);
  }

  // Draw Header
  const headerH = width * (195 / 752); // ~154.3 pt
  if (headerImg) {
    page.drawImage(headerImg, {
      x: 0,
      y: height - headerH,
      width: width,
      height: headerH
    });
  } else {
    // Basic fallback top bar
    page.drawRectangle({
      x: 0,
      y: height - 12,
      width: width,
      height: 12,
      color: rgb(0.03, 0.4, 0.96)
    });
  }

  // Draw Footer
  const footerH = width * (284 / 752); // ~224.8 pt
  if (footerImg) {
    page.drawImage(footerImg, {
      x: 0,
      y: 0,
      width: width,
      height: footerH
    });
  }

  // 2. Draw Dynamic Real Scannable QR Code over QR Code Area
  try {
    const finalVerificationUrl =
      verificationUrl ||
      `https://professorvirus.site/prma-tech/verify-offer/${encodeURIComponent(offerId)}`;

    const qrPngBuffer = await QRCode.toBuffer(finalVerificationUrl, {
      margin: 1,
      width: 200,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF'
      }
    });

    const qrImg = await pdfDoc.embedPng(qrPngBuffer);
    page.drawImage(qrImg, {
      x: 504,
      y: 90,
      width: 54,
      height: 54
    });
  } catch (qrErr) {
    console.warn('[PRMA PDF Engine] QR code generation error:', qrErr);
  }

  // 3. Metadata Row: Date & Offer ID
  const metaY = height - headerH - 18;
  page.drawText(`Date: ${issueDate}`, {
    x: 42,
    y: metaY,
    size: 10.5,
    font: fontBold,
    color: textDark
  });

  page.drawText(`Offer ID: ${offerId}`, {
    x: 375,
    y: metaY,
    size: 10.5,
    font: fontBold,
    color: textDark
  });

  // 4. Salutation: Dear {studentName},
  const dearY = metaY - 30;
  page.drawText('Dear ', {
    x: 42,
    y: dearY,
    size: 11,
    font: fontBold,
    color: textDark
  });
  page.drawText(`${studentName},`, {
    x: 72,
    y: dearY,
    size: 11,
    font: fontBold,
    color: textDark
  });

  // 5. Rich Multi-segment Text Formatter
  function drawRichParagraph(segments, startX, startY, maxWidth, lineHeight, fontSize) {
    let currentX = startX;
    let currentY = startY;

    segments.forEach((seg) => {
      const words = seg.text.split(' ');
      const font = seg.bold ? fontBold : fontRegular;

      words.forEach((word, wIdx) => {
        if (!word) return;
        const textToMeasure = (wIdx < words.length - 1 ? word + ' ' : word);
        const w = font.widthOfTextAtSize(textToMeasure, fontSize);

        if (currentX + w > startX + maxWidth && currentX > startX) {
          currentX = startX;
          currentY -= lineHeight;
        }

        page.drawText(textToMeasure, {
          x: currentX,
          y: currentY,
          size: fontSize,
          font: font,
          color: textDark
        });

        currentX += w;
      });
    });

    return currentY - lineHeight;
  }

  // Exact Match Paragraphs from Reference Image 2
  const normalizedDuration = duration.toLowerCase().includes('week') ? duration : `${duration} in`;
  const normalizedMode = mode.toLowerCase().includes('mode') ? mode : `${mode} mode`;
  const cleanDomain = domainTitle.replace(/ Intern$/i, '');

  const p1 = [
    { text: 'We are pleased to extend to you an offer for the position of ' },
    { text: `${cleanDomain} Intern`, bold: true },
    { text: ' at ' },
    { text: 'PRMA Tech', bold: true },
    { text: `. Your exceptional qualifications, strong analytical skills, and enthusiasm for ${cleanDomain.toLowerCase()} have greatly impressed us, and we are excited to welcome you to our team.` }
  ];

  const p2 = [
    { text: 'As a ' },
    { text: `${cleanDomain} Intern`, bold: true },
    { text: ' at ' },
    { text: 'PRMA Tech', bold: true },
    { text: `, you will have the opportunity to work on real-world projects in the field of ${cleanDomain.toLowerCase()} and modern software systems. Your role will involve data analysis, model development, experimentation, and optimization. Your contributions will be pivotal in developing innovative solutions and supporting our ongoing technology initiatives.` }
  ];

  const p3 = [
    { text: 'The internship will be for a duration of ' },
    { text: normalizedDuration, bold: true },
    { text: ' ' },
    { text: normalizedMode, bold: true },
    { text: ', starting from ' },
    { text: joiningDate, bold: true },
    { text: '. During this period, you will work under the guidance of our mentors and be expected to maintain professionalism, meet project deadlines, and adhere to company policies.' }
  ];

  const p4 = [
    { text: 'Upon successful completion of the internship, you will be awarded an ' },
    { text: 'Internship Completion Certificate', bold: true },
    { text: ' and a ' },
    { text: 'Letter of Recommendation (LOR)', bold: true },
    { text: ' based on your performance.' }
  ];

  const p5 = [
    { text: 'We would like to take this opportunity to congratulate you once again and warmly welcome you to ' },
    { text: 'PRMA Tech', bold: true },
    { text: '. We are enthusiastic about the prospect of working with you and look forward to an exciting journey together.' }
  ];

  // Draw Body Paragraphs with balanced typography
  const usableWidth = 512;
  const paragraphFontSize = 10;
  const paragraphLineHeight = 15;
  const paragraphGap = 12;

  let y = dearY - 22;
  y = drawRichParagraph(p1, 42, y, usableWidth, paragraphLineHeight, paragraphFontSize) - paragraphGap;
  y = drawRichParagraph(p2, 42, y, usableWidth, paragraphLineHeight, paragraphFontSize) - paragraphGap;
  y = drawRichParagraph(p3, 42, y, usableWidth, paragraphLineHeight, paragraphFontSize) - paragraphGap;
  y = drawRichParagraph(p4, 42, y, usableWidth, paragraphLineHeight, paragraphFontSize) - paragraphGap;
  y = drawRichParagraph(p5, 42, y, usableWidth, paragraphLineHeight, paragraphFontSize);

  // Return generated vector PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
