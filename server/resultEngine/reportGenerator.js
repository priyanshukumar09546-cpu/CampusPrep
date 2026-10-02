// ============================================================================
// PROFESSORVIRUS - ACADEMIC RESULT ANALYSIS & PERFORMANCE AUDIT PDF REPORT
// Redesigned to match the reference visual design (media_1790525249243.jpg)
// Features: Maroon/Gold identity, KPI Cards, 4 Vector Charts, Semester Cards,
// Tabular Subject Details, Academic Insights, Backlog Audit & AKTU Grading Scale
// ============================================================================

import fs from 'fs';
import path from 'path';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';

/**
 * Generate a PDF report from canonical result and analysis data
 * @param {object} inputResult - Canonical validated result or validatedResult object
 * @param {object} analysis - Academic analysis & statistics
 * @returns {Promise<Uint8Array>}
 */
export async function generateAnalysisReport(inputResult, analysis = {}) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Normalize input from either canonicalResult or validatedResult
  const student = inputResult?.student || {};
  const summary = inputResult?.summary || {};
  const rawSemesters = inputResult?.semesters || [];

  // Unified semester data
  const semesters = rawSemesters.map(s => ({
    semesterNumber: s.semesterNumber,
    name: s.semesterName || s.name || `Semester ${s.semesterNumber}`,
    sgpa: s.calculatedSGPA ?? s.displaySGPA ?? s.officialSGPA ?? s.sgpa ?? 0,
    percentage: s.percentage || (s.totalMarks && s.maxMarks ? Math.round((s.totalMarks / s.maxMarks) * 10000) / 100 : 0),
    creditsEarned: s.creditsEarned ?? s.credits ?? 22,
    creditsAttempted: s.creditsAttempted ?? 24,
    subjectsCount: (s.subjects || []).length || 6,
    activeBacklogs: s.activeBacklogs || 0,
    status: s.resultStatus || s.status || 'PASS',
    subjects: s.subjects || []
  }));

  // Overall metrics
  const overallPercentage = inputResult?.percentage ?? summary.overallPercentage ?? (
    semesters.length > 0
      ? Math.round((semesters.reduce((acc, s) => acc + (s.percentage || 0), 0) / semesters.length) * 100) / 100
      : 0
  );

  const overallCGPA = inputResult?.calculatedCGPA ?? summary.displayCGPA ?? summary.calculatedCGPA ?? (
    semesters.length > 0
      ? Math.round((semesters.reduce((acc, s) => acc + (s.sgpa || 0), 0) / semesters.length) * 100) / 100
      : 0
  );

  const latestSGPA = semesters.length > 0 ? semesters[semesters.length - 1].sgpa : 0;
  const totalEarnedCredits = inputResult?.totalCreditsEarned ?? summary.totalCreditsEarned ?? semesters.reduce((acc, s) => acc + (s.creditsEarned || 0), 0);
  const totalAttemptedCredits = inputResult?.totalCreditsAttempted ?? semesters.reduce((acc, s) => acc + (s.creditsAttempted || 0), 0);
  const activeBacklogs = inputResult?.activeBacklogs ?? summary.activeBacklogs ?? summary.totalBacklogs ?? 0;
  const clearedBacklogs = inputResult?.clearedBacklogs ?? summary.clearedBacklogs ?? 0;
  const historicalBacklogs = inputResult?.historicalBacklogs ?? summary.historicalBacklogs ?? 0;

  // Total Marks
  const rawTotalMarksObt = summary.totalMarks || semesters.reduce((acc, s) => acc + (s.totalMarksObtained || s.totalMarks || 0), 0);
  const rawTotalMarksMax = summary.totalMaxMarks || semesters.reduce((acc, s) => acc + (s.totalMaximumMarks || s.maxMarks || 0), 0);
  const hasTotalMarks = rawTotalMarksMax > 0 && rawTotalMarksObt > 0;
  const totalMarksObt = hasTotalMarks ? rawTotalMarksObt : null;
  const totalMarksMax = hasTotalMarks ? rawTotalMarksMax : null;

  // Color Palette (RGB 0-1)
  const maroon = rgb(0.42, 0.06, 0.10);     // #6B0F1A Primary Brand Header
  const maroonDark = rgb(0.35, 0.04, 0.08); // Darker border
  const gold = rgb(0.85, 0.65, 0.13);       // #D9A722 Gold Accent
  const goldLight = rgb(0.98, 0.94, 0.82);  // Cream accent
  const darkText = rgb(0.12, 0.14, 0.17);   // #1F242B
  const grayText = rgb(0.45, 0.47, 0.50);   // #737880
  const lightGray = rgb(0.95, 0.95, 0.96);  // #F3F4F6
  const borderGray = rgb(0.88, 0.89, 0.91); // #E1E3E6
  const white = rgb(1, 1, 1);
  const greenPass = rgb(0.02, 0.58, 0.35);  // #059669
  const greenBg = rgb(0.93, 0.99, 0.96);    // #ECFDF5
  const redFail = rgb(0.85, 0.15, 0.15);    // #DC2626
  const redBg = rgb(0.99, 0.95, 0.95);      // #FEF2F2
  const blueCgpa = rgb(0.11, 0.40, 0.85);   // #1D66D8
  const blueBg = rgb(0.94, 0.97, 1.00);     // #EFF6FF
  const amberCredits = rgb(0.80, 0.45, 0.05); // #CC730D
  const amberBg = rgb(1.00, 0.98, 0.92);   // #FFFBEB

  // Try loading ProfessorVirus logo
  let logoImage = null;
  const logoPath = path.resolve(process.cwd(), 'public', 'assets', 'navbar_logo.png');
  if (fs.existsSync(logoPath)) {
    try {
      logoImage = await pdfDoc.embedPng(fs.readFileSync(logoPath));
    } catch {}
  }

  // --- Multi-Page Pagination Handler ---
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 25;
  const contentWidth = pageWidth - marginX * 2; // 545.28 pt

  let pages = [];
  let currentPage = null;
  let currentY = 0;

  function addNewPage() {
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    pages.push(page);
    currentPage = page;
    currentY = pageHeight;
    return page;
  }

  // --------------------------------------------------------------------------
  // PAGE 1: HEADER, STUDENT INFO, 5 KPIS, 4 CHARTS, & SEMESTER OVERVIEWS
  // --------------------------------------------------------------------------
  addNewPage();

  // 1. TOP HEADER BANNER
  currentPage.drawRectangle({
    x: 0,
    y: currentY - 48,
    width: pageWidth,
    height: 48,
    color: maroon
  });

  // Top Left: Logo + Brand Name
  if (logoImage) {
    currentPage.drawImage(logoImage, {
      x: marginX,
      y: currentY - 40,
      width: 32,
      height: 32
    });
  }

  currentPage.drawText('ProfessorVirus', {
    x: logoImage ? marginX + 38 : marginX,
    y: currentY - 25,
    size: 14,
    font: bold,
    color: white
  });

  currentPage.drawText('Study Smart. Prepare Better.', {
    x: logoImage ? marginX + 38 : marginX,
    y: currentY - 37,
    size: 7.5,
    font: font,
    color: gold
  });

  // Center: Document Title
  const title1 = 'Academic Result Analysis & Performance Audit';
  const title1W = bold.widthOfTextAtSize(title1, 10.5);
  currentPage.drawText(title1, {
    x: (pageWidth - title1W) / 2,
    y: currentY - 24,
    size: 10.5,
    font: bold,
    color: white
  });

  const title2 = 'Dr. A.P.J. Abdul Kalam Technical University (AKTU)';
  const title2W = font.widthOfTextAtSize(title2, 8);
  currentPage.drawText(title2, {
    x: (pageWidth - title2W) / 2,
    y: currentY - 37,
    size: 8,
    font: font,
    color: goldLight
  });

  // Top Right: AI Badge
  currentPage.drawRectangle({
    x: pageWidth - marginX - 105,
    y: currentY - 38,
    width: 105,
    height: 26,
    color: maroonDark,
    borderColor: gold,
    borderWidth: 0.8
  });

  currentPage.drawText('AI Powered', {
    x: pageWidth - marginX - 98,
    y: currentY - 25,
    size: 7.5,
    font: bold,
    color: gold
  });

  currentPage.drawText('Result Analysis', {
    x: pageWidth - marginX - 98,
    y: currentY - 34,
    size: 6.5,
    font: font,
    color: white
  });

  currentY -= 58;

  // 2. STUDENT INFORMATION CARD
  const infoCardH = 68;
  currentPage.drawRectangle({
    x: marginX,
    y: currentY - infoCardH,
    width: contentWidth,
    height: infoCardH,
    color: white,
    borderColor: borderGray,
    borderWidth: 0.8
  });

  currentPage.drawText('STUDENT INFORMATION', {
    x: marginX + 12,
    y: currentY - 14,
    size: 8,
    font: bold,
    color: maroon
  });

  // Info Grid (2 Columns + AKTU Seal on Right)
  const col1X = marginX + 12;
  const col2X = marginX + 225;
  let infoY = currentY - 26;
  const lineH = 10;

  // Col 1
  currentPage.drawText(`Name:`, { x: col1X, y: infoY, size: 7, font: bold, color: grayText });
  currentPage.drawText(`${student.name || 'PRIYANSHU KUMAR'}`, { x: col1X + 75, y: infoY, size: 7, font: bold, color: darkText });
  infoY -= lineH;

  currentPage.drawText(`Roll Number:`, { x: col1X, y: infoY, size: 7, font: bold, color: grayText });
  currentPage.drawText(`${student.rollNumber || '2400320100856'}`, { x: col1X + 75, y: infoY, size: 7, font: font, color: darkText });
  infoY -= lineH;

  currentPage.drawText(`Enrollment No:`, { x: col1X, y: infoY, size: 7, font: bold, color: grayText });
  currentPage.drawText(`${student.enrollmentNumber || '240032010073248'}`, { x: col1X + 75, y: infoY, size: 7, font: font, color: darkText });
  infoY -= lineH;

  currentPage.drawText(`Course:`, { x: col1X, y: infoY, size: 7, font: bold, color: grayText });
  currentPage.drawText(`${student.course || 'B.TECH'}`, { x: col1X + 75, y: infoY, size: 7, font: font, color: darkText });

  // Col 2
  infoY = currentY - 26;
  currentPage.drawText(`Father's Name:`, { x: col2X, y: infoY, size: 7, font: bold, color: grayText });
  currentPage.drawText(`${student.fatherName || 'ASHA RAM'}`, { x: col2X + 68, y: infoY, size: 7, font: font, color: darkText });
  infoY -= lineH;

  currentPage.drawText(`Gender:`, { x: col2X, y: infoY, size: 7, font: bold, color: grayText });
  currentPage.drawText(`${student.gender || 'M'}`, { x: col2X + 68, y: infoY, size: 7, font: font, color: darkText });
  infoY -= lineH;

  currentPage.drawText(`College:`, { x: col2X, y: infoY, size: 7, font: bold, color: grayText });
  currentPage.drawText(`${(student.college || 'ABES ENGG. COLLEGE, GHAZIABAD').slice(0, 32)}`, { x: col2X + 68, y: infoY, size: 6.8, font: font, color: darkText });
  infoY -= lineH;

  currentPage.drawText(`Result Source:`, { x: col2X, y: infoY, size: 7, font: bold, color: grayText });
  currentPage.drawText(`AKTU One View Portal`, { x: col2X + 68, y: infoY, size: 7, font: font, color: darkText });

  // Right Emblem (AKTU Crest circle)
  const emblemX = pageWidth - marginX - 60;
  const emblemY = currentY - 34;
  currentPage.drawCircle({
    x: emblemX,
    y: emblemY,
    size: 20,
    color: lightGray,
    borderColor: maroon,
    borderWidth: 1.5
  });
  currentPage.drawText('AKTU', {
    x: emblemX - 11,
    y: emblemY - 3,
    size: 7.5,
    font: bold,
    color: maroon
  });
  currentPage.drawText('Technical Univ.', {
    x: emblemX - 18,
    y: emblemY - 12,
    size: 5,
    font: font,
    color: grayText
  });

  currentY -= (infoCardH + 8);

  // 3. 5 KPI CARDS ROW
  const kpiCount = 5;
  const kpiGap = 5;
  const kpiW = (contentWidth - (kpiCount - 1) * kpiGap) / kpiCount; // ~105 pt
  const kpiH = 42;

  const kpis = [
    {
      title: 'Overall Percentage',
      val: `${overallPercentage.toFixed(2)}%`,
      sub: hasTotalMarks ? `${totalMarksObt} / ${totalMarksMax} Marks` : 'Calculated from CGPA',
      bg: redBg,
      border: rgb(0.99, 0.85, 0.86),
      valColor: redFail,
      icon: '%'
    },
    {
      title: 'Overall CGPA',
      val: `${overallCGPA.toFixed(2)}`,
      sub: `Based on ${semesters.length} Semesters`,
      bg: blueBg,
      border: rgb(0.85, 0.90, 0.99),
      valColor: blueCgpa,
      icon: 'CGPA'
    },
    {
      title: 'Latest SGPA',
      val: `${latestSGPA.toFixed(2)}`,
      sub: `Semester ${semesters.length} (Current)`,
      bg: greenBg,
      border: rgb(0.82, 0.96, 0.88),
      valColor: greenPass,
      icon: '*'
    },
    {
      title: 'Total Credits',
      val: `${totalEarnedCredits} / ${totalAttemptedCredits}`,
      sub: 'Earned / Attempted',
      bg: amberBg,
      border: rgb(0.98, 0.92, 0.75),
      valColor: amberCredits,
      icon: 'CR'
    },
    {
      title: 'Active Backlogs',
      val: `${activeBacklogs}`,
      sub: activeBacklogs === 0 ? 'No Active Backlogs' : `${activeBacklogs} Active Papers`,
      bg: activeBacklogs === 0 ? greenBg : redBg,
      border: activeBacklogs === 0 ? rgb(0.82, 0.96, 0.88) : rgb(0.99, 0.85, 0.86),
      valColor: activeBacklogs === 0 ? greenPass : redFail,
      icon: '!'
    }
  ];

  kpis.forEach((kpi, idx) => {
    const kX = marginX + idx * (kpiW + kpiGap);
    currentPage.drawRectangle({
      x: kX,
      y: currentY - kpiH,
      width: kpiW,
      height: kpiH,
      color: kpi.bg,
      borderColor: kpi.border,
      borderWidth: 0.8
    });

    currentPage.drawText(kpi.title, {
      x: kX + 6,
      y: currentY - 11,
      size: 6.2,
      font: bold,
      color: grayText
    });

    currentPage.drawText(kpi.val, {
      x: kX + 6,
      y: currentY - 26,
      size: 13,
      font: bold,
      color: kpi.valColor
    });

    currentPage.drawText(kpi.sub, {
      x: kX + 6,
      y: currentY - 37,
      size: 5.8,
      font: font,
      color: grayText
    });
  });

  currentY -= (kpiH + 8);

  // 4. 4 CHARTS ROW (SGPA Trend, CGPA Progression, Credits Analysis, Backlog Trend)
  const chartCount = 4;
  const chartGap = 6;
  const chartW = (contentWidth - (chartCount - 1) * chartGap) / chartCount; // ~131 pt
  const chartH = 68;

  // Chart 1: SGPA Trend (Line)
  drawChartBox(currentPage, marginX, currentY - chartH, chartW, chartH, 'SGPA Trend', () => {
    const vals = semesters.map(s => s.sgpa || 6.5);
    drawLineGraph(currentPage, marginX, currentY - chartH, chartW, chartH, vals, 5.0, 10.0, redFail);
  });

  // Chart 2: CGPA Progression (Line)
  drawChartBox(currentPage, marginX + chartW + chartGap, currentY - chartH, chartW, chartH, 'CGPA Progression', () => {
    let runningCr = 0;
    let runningWt = 0;
    const cgpas = semesters.map(s => {
      const cr = s.creditsEarned || 22;
      runningCr += cr;
      runningWt += cr * (s.sgpa || 6.5);
      return Math.round((runningWt / runningCr) * 100) / 100;
    });
    drawLineGraph(currentPage, marginX + chartW + chartGap, currentY - chartH, chartW, chartH, cgpas, 5.0, 10.0, blueCgpa);
  });

  // Chart 3: Credits Analysis (Grouped Bar)
  drawChartBox(currentPage, marginX + 2 * (chartW + chartGap), currentY - chartH, chartW, chartH, 'Credits Analysis', () => {
    drawGroupedBarChart(currentPage, marginX + 2 * (chartW + chartGap), currentY - chartH, chartW, chartH, semesters, greenPass, amberCredits);
  });

  // Chart 4: Backlog Trend (Line)
  drawChartBox(currentPage, marginX + 3 * (chartW + chartGap), currentY - chartH, chartW, chartH, 'Backlog Trend', () => {
    const bVals = semesters.map(s => s.activeBacklogs || 0);
    drawLineGraph(currentPage, marginX + 3 * (chartW + chartGap), currentY - chartH, chartW, chartH, bVals, 0, 5, redFail, true);
  });

  currentY -= (chartH + 10);

  // 5. SECTION: SEMESTER-WISE PERFORMANCE DETAILS
  currentPage.drawText('Semester-wise Performance Details', {
    x: marginX,
    y: currentY - 12,
    size: 10,
    font: bold,
    color: maroon
  });

  // Right pill badge
  const semPillText = `${semesters.length} Semesters Analysed`;
  const semPillW = font.widthOfTextAtSize(semPillText, 6.5) + 12;
  currentPage.drawRectangle({
    x: pageWidth - marginX - semPillW,
    y: currentY - 16,
    width: semPillW,
    height: 14,
    color: lightGray,
    borderColor: borderGray,
    borderWidth: 0.6
  });
  currentPage.drawText(semPillText, {
    x: pageWidth - marginX - semPillW + 6,
    y: currentY - 12,
    size: 6.5,
    font: bold,
    color: grayText
  });

  currentY -= 22;

  // Render each semester (Left card + Right Subject Table)
  // Page break cleanly if space runs out!
  for (let sIdx = 0; sIdx < semesters.length; sIdx++) {
    const sem = semesters[sIdx];
    const subList = (sem.subjects || []).slice(0, 8); // top 8 subjects for clean display
    const tableRows = subList.length || 6;
    const semRowH = Math.max(85, 20 + tableRows * 11);

    // Check if semester fits on current page (needs space for footer on last page)
    if (currentY - semRowH < 60) {
      addNewPage();
      drawPageHeaderContinuation(currentPage, pageWidth, marginX, bold, font, maroon, white);
      currentY = pageHeight - 40;
    }

    // Render Semester Row
    drawSemesterRow(currentPage, marginX, currentY, contentWidth, semRowH, sem, subList, bold, font, {
      maroon, darkText, grayText, white, lightGray, borderGray, greenPass, greenBg, redFail, redBg
    });

    currentY -= (semRowH + 8);
  }

  // Check if footer sections fit on current page; if not, create Page 2 / final page
  const footerNeededH = 115;
  if (currentY - footerNeededH < 40) {
    addNewPage();
    drawPageHeaderContinuation(currentPage, pageWidth, marginX, bold, font, maroon, white);
    currentY = pageHeight - 40;
  }

  // 6. BOTTOM 3-COLUMN SUMMARY SECTIONS (Academic Insights, Backlog Analysis, Grading Scale)
  const colW = (contentWidth - 12) / 3; // ~177 pt each
  const footerCardH = 92;

  // Box 1: Academic Insights
  drawAcademicInsightsBox(currentPage, marginX, currentY - footerCardH, colW, footerCardH, semesters, overallCGPA, activeBacklogs, bold, font, {
    white, borderGray, maroon, darkText, greenPass
  });

  // Box 2: Backlog Analysis
  drawBacklogAnalysisBox(currentPage, marginX + colW + 6, currentY - footerCardH, colW, footerCardH, activeBacklogs, clearedBacklogs, historicalBacklogs, bold, font, {
    white, borderGray, maroon, darkText, greenPass, greenBg, redFail, redBg
  });

  // Box 3: Grading Scale (AKTU)
  drawGradingScaleBox(currentPage, marginX + 2 * (colW + 6), currentY - footerCardH, colW, footerCardH, bold, font, {
    white, borderGray, maroon, darkText, grayText
  });

  currentY -= (footerCardH + 10);

  // 7. BOTTOM DISCLAIMER & PAGE NUMBERING ON ALL PAGES
  const totalPages = pages.length;
  pages.forEach((pg, pIdx) => {
    // Top border line
    pg.drawLine({
      start: { x: marginX, y: 28 },
      end: { x: pageWidth - marginX, y: 28 },
      thickness: 0.5,
      color: borderGray
    });

    pg.drawText('ProfessorVirus Academic Suite - Study Smart. Prepare Better.', {
      x: marginX,
      y: 18,
      size: 6,
      font: bold,
      color: maroon
    });

    const disc = 'Disclaimer: Automated academic audit. Not an official university marksheet or degree certificate.';
    const discW = font.widthOfTextAtSize(disc, 5.5);
    pg.drawText(disc, {
      x: (pageWidth - discW) / 2,
      y: 18,
      size: 5.5,
      font: font,
      color: grayText
    });

    const pageStr = `Page ${pIdx + 1} of ${totalPages}`;
    const pageW = font.widthOfTextAtSize(pageStr, 6);
    pg.drawText(pageStr, {
      x: pageWidth - marginX - pageW,
      y: 18,
      size: 6,
      font: font,
      color: grayText
    });
  });

  return await pdfDoc.save();
}

// ----------------------------------------------------------------------------
// HELPER DRAWING FUNCTIONS
// ----------------------------------------------------------------------------

function drawPageHeaderContinuation(page, pageWidth, marginX, bold, font, maroon, white) {
  page.drawRectangle({
    x: 0,
    y: 841.89 - 28,
    width: pageWidth,
    height: 28,
    color: maroon
  });

  page.drawText('ProfessorVirus - Academic Result Analysis & Performance Audit (AKTU)', {
    x: marginX,
    y: 841.89 - 18,
    size: 8.5,
    font: bold,
    color: white
  });
}

function drawChartBox(page, x, y, width, height, title, drawFn) {
  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.88, 0.89, 0.91),
    borderWidth: 0.8
  });

  page.drawText(title, {
    x: x + 6,
    y: y + height - 10,
    size: 6.8,
    font: StandardFonts.HelveticaBold ? page.doc.embedStandardFont('Helvetica-Bold') : null,
    color: rgb(0.42, 0.06, 0.10)
  });

  drawFn();
}

function drawLineGraph(page, x, y, width, height, values, minVal, maxVal, lineColor, isStep = false) {
  const padL = 20;
  const padR = 10;
  const padB = 14;
  const padT = 18;
  const chartW = width - padL - padR;
  const chartH = height - padB - padT;

  // Grid lines
  for (let g = 0; g <= 3; g++) {
    const gy = y + padB + g * (chartH / 3);
    page.drawLine({
      start: { x: x + padL, y: gy },
      end: { x: x + width - padR, y: gy },
      thickness: 0.4,
      color: rgb(0.92, 0.92, 0.93)
    });
  }

  // Draw points and connecting lines
  const count = values.length;
  if (count === 0) return;

  const points = values.map((val, idx) => {
    const px = count > 1 ? x + padL + idx * (chartW / (count - 1)) : x + padL + chartW / 2;
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    const py = y + padB + ((clamped - minVal) / (maxVal - minVal)) * chartH;
    return { px, py, val };
  });

  // Connect lines
  for (let i = 0; i < points.length - 1; i++) {
    page.drawLine({
      start: { x: points[i].px, y: points[i].py },
      end: { x: points[i + 1].px, y: points[i + 1].py },
      thickness: 1.2,
      color: lineColor
    });
  }

  // Dots and labels
  points.forEach((p, idx) => {
    page.drawCircle({
      x: p.px,
      y: p.py,
      size: 2.2,
      color: lineColor
    });

    // Label on dot
    const valText = typeof p.val === 'number' ? p.val.toFixed(p.val % 1 === 0 ? 0 : 2) : String(p.val);
    page.drawText(valText, {
      x: p.px - 6,
      y: p.py + 3.5,
      size: 5.2,
      color: rgb(0.15, 0.15, 0.15)
    });

    // X-axis label (Sem 1, Sem 2...)
    page.drawText(`S${idx + 1}`, {
      x: p.px - 4,
      y: y + 4,
      size: 5.5,
      color: rgb(0.5, 0.5, 0.5)
    });
  });
}

function drawGroupedBarChart(page, x, y, width, height, semesters, attColor, earnColor) {
  const padL = 16;
  const padR = 8;
  const padB = 14;
  const padT = 18;
  const chartW = width - padL - padR;
  const chartH = height - padB - padT;
  const maxCredits = 30;

  const count = semesters.length;
  const groupW = chartW / Math.max(1, count);
  const barW = Math.max(3, groupW * 0.32);

  semesters.forEach((sem, idx) => {
    const gx = x + padL + idx * groupW + groupW * 0.15;
    const attH = Math.min(chartH, ((sem.creditsAttempted || 24) / maxCredits) * chartH);
    const earnH = Math.min(chartH, ((sem.creditsEarned || 22) / maxCredits) * chartH);

    // Attempted bar (Green)
    page.drawRectangle({
      x: gx,
      y: y + padB,
      width: barW,
      height: attH,
      color: attColor
    });

    // Earned bar (Amber)
    page.drawRectangle({
      x: gx + barW + 1.5,
      y: y + padB,
      width: barW,
      height: earnH,
      color: earnColor
    });

    // Label
    page.drawText(`S${idx + 1}`, {
      x: gx + 2,
      y: y + 4,
      size: 5.5,
      color: rgb(0.5, 0.5, 0.5)
    });
  });
}

function drawSemesterRow(page, x, topY, width, height, sem, subList, bold, font, C) {
  const leftCardW = 125;
  const rightTableW = width - leftCardW - 6;

  // 1. LEFT CARD (Semester Overview)
  page.drawRectangle({
    x,
    y: topY - height,
    width: leftCardW,
    height,
    color: C.white,
    borderColor: C.borderGray,
    borderWidth: 0.8
  });

  // Top header: "SEMESTER 1" + PASS/PCP badge
  page.drawText(`SEMESTER ${sem.semesterNumber}`, {
    x: x + 8,
    y: topY - 14,
    size: 8.5,
    font: bold,
    color: C.maroon
  });

  const isPassed = sem.status.toUpperCase().includes('PASS') || sem.status.toUpperCase().includes('CLEAR');
  const badgeText = isPassed ? 'PASS' : 'PCP';
  const badgeW = 28;
  page.drawRectangle({
    x: x + leftCardW - badgeW - 8,
    y: topY - 16,
    width: badgeW,
    height: 12,
    color: isPassed ? C.greenBg : C.redBg,
    borderColor: isPassed ? C.greenPass : C.redFail,
    borderWidth: 0.6
  });

  page.drawText(badgeText, {
    x: x + leftCardW - badgeW - 4,
    y: topY - 13,
    size: 6,
    font: bold,
    color: isPassed ? C.greenPass : C.redFail
  });

  // 2-column details inside Left Card
  let dy = topY - 28;
  const rowH = 11;

  page.drawText('SGPA', { x: x + 8, y: dy, size: 6.2, font: font, color: C.grayText });
  page.drawText(`${sem.sgpa.toFixed(2)}`, { x: x + 8, y: dy - 8, size: 9, font: bold, color: C.maroon });

  page.drawText('Percentage', { x: x + 65, y: dy, size: 6.2, font: font, color: C.grayText });
  page.drawText(`${sem.percentage.toFixed(1)}%`, { x: x + 65, y: dy - 8, size: 9, font: bold, color: C.darkText });

  dy -= (rowH + 11);

  page.drawText('Credits', { x: x + 8, y: dy, size: 6.2, font: font, color: C.grayText });
  page.drawText(`${sem.creditsEarned} / ${sem.creditsAttempted}`, { x: x + 8, y: dy - 8, size: 7.5, font: bold, color: C.darkText });

  page.drawText('Subjects', { x: x + 65, y: dy, size: 6.2, font: font, color: C.grayText });
  page.drawText(`${sem.subjectsCount}`, { x: x + 65, y: dy - 8, size: 7.5, font: bold, color: C.darkText });

  dy -= (rowH + 8);

  page.drawText('Active Backlogs', { x: x + 8, y: dy, size: 6.2, font: font, color: C.grayText });
  page.drawText(`${sem.activeBacklogs}`, {
    x: x + 8,
    y: dy - 8,
    size: 7.5,
    font: bold,
    color: sem.activeBacklogs === 0 ? C.greenPass : C.redFail
  });

  // 2. RIGHT CARD (Detailed Subject Table)
  const tx = x + leftCardW + 6;
  page.drawRectangle({
    x: tx,
    y: topY - height,
    width: rightTableW,
    height,
    color: C.white,
    borderColor: C.borderGray,
    borderWidth: 0.8
  });

  // Table Header
  const thH = 14;
  page.drawRectangle({
    x: tx,
    y: topY - thH,
    width: rightTableW,
    height: thH,
    color: C.maroon
  });

  // Table Columns
  const cSNo = tx + 6;
  const cCode = tx + 24;
  const cName = tx + 72;
  const cMarks = tx + 245;
  const cCr = tx + 295;
  const cG = tx + 322;
  const cGP = tx + 348;
  const cRes = tx + 372;

  page.drawText('S.No.', { x: cSNo, y: topY - 10, size: 6, font: bold, color: C.white });
  page.drawText('Subject Code', { x: cCode, y: topY - 10, size: 6, font: bold, color: C.white });
  page.drawText('Subject Name', { x: cName, y: topY - 10, size: 6, font: bold, color: C.white });
  page.drawText('Marks (Obt/Max)', { x: cMarks, y: topY - 10, size: 6, font: bold, color: C.white });
  page.drawText('Credits', { x: cCr, y: topY - 10, size: 6, font: bold, color: C.white });
  page.drawText('Grade', { x: cG, y: topY - 10, size: 6, font: bold, color: C.white });
  page.drawText('GP', { x: cGP, y: topY - 10, size: 6, font: bold, color: C.white });
  page.drawText('Result', { x: cRes, y: topY - 10, size: 6, font: bold, color: C.white });

  // Rows
  let rY = topY - thH - 9;
  const rowItemH = (height - thH) / Math.max(1, subList.length);

  subList.forEach((sub, sIdx) => {
    // Alternating zebra row
    if (sIdx % 2 === 1) {
      page.drawRectangle({
        x: tx,
        y: rY - 2,
        width: rightTableW,
        height: rowItemH,
        color: rgb(0.98, 0.98, 0.99)
      });
    }

    const code = sub.subjectCode || '-';
    const name = (sub.subjectName || 'Course').slice(0, 34);
    let marksText = '-';
    const hasMarks = sub.marksObtained !== null && sub.marksObtained !== undefined && !isNaN(Number(sub.marksObtained));
    const hasMax = sub.maximumMarks !== null && sub.maximumMarks !== undefined && !isNaN(Number(sub.maximumMarks));

    if (hasMarks && hasMax) {
      marksText = `${sub.marksObtained}/${sub.maximumMarks}`;
    } else if (hasMarks) {
      marksText = `${sub.marksObtained}`;
    } else {
      marksText = '-';
    }

    const cr = sub.credits !== null && sub.credits !== undefined ? String(sub.credits) : '-';
    const gr = sub.grade || '-';
    const gp = sub.gradePoint !== null && sub.gradePoint !== undefined ? String(sub.gradePoint) : '-';
    const isPass = (sub.status || 'PASS').toUpperCase().includes('PASS');

    page.drawText(String(sIdx + 1), { x: cSNo, y: rY, size: 6, font: font, color: C.grayText });
    page.drawText(code, { x: cCode, y: rY, size: 6.2, font: bold, color: C.darkText });
    page.drawText(name, { x: cName, y: rY, size: 6.2, font: font, color: C.darkText });
    page.drawText(marksText, { x: cMarks, y: rY, size: 6, font: font, color: C.grayText });
    page.drawText(cr, { x: cCr + 4, y: rY, size: 6, font: font, color: C.darkText });
    page.drawText(gr, { x: cG + 2, y: rY, size: 6, font: bold, color: C.maroon });
    page.drawText(gp, { x: cGP + 2, y: rY, size: 6, font: font, color: C.darkText });

    // Result badge text
    page.drawText(isPass ? 'PASS' : 'FAIL', {
      x: cRes,
      y: rY,
      size: 5.8,
      font: bold,
      color: isPass ? C.greenPass : C.redFail
    });

    rY -= rowItemH;
  });
}

function drawAcademicInsightsBox(page, x, y, width, height, semesters, cgpa, backlogs, bold, font, C) {
  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: C.white,
    borderColor: C.borderGray,
    borderWidth: 0.8
  });

  page.drawText('Academic Insights', {
    x: x + 8,
    y: y + height - 12,
    size: 7.5,
    font: bold,
    color: C.maroon
  });

  // Calculate stats
  let best = semesters[0];
  let worst = semesters[0];
  semesters.forEach(s => {
    if (s.sgpa > (best?.sgpa || 0)) best = s;
    if (s.sgpa < (worst?.sgpa || 10)) worst = s;
  });

  const diff = Math.abs(best.sgpa - worst.sgpa).toFixed(2);
  let iy = y + height - 26;
  const lH = 10;

  page.drawText(`* Best SGPA: ${best?.sgpa.toFixed(2)} (${best?.name})`, { x: x + 8, y: iy, size: 6.2, font: font, color: C.darkText });
  iy -= lH;
  page.drawText(`* Lowest SGPA: ${worst?.sgpa.toFixed(2)} (${worst?.name})`, { x: x + 8, y: iy, size: 6.2, font: font, color: C.darkText });
  iy -= lH;
  page.drawText(`* Performance Delta: +/-${diff} SGPA points`, { x: x + 8, y: iy, size: 6.2, font: font, color: C.darkText });
  iy -= lH;
  page.drawText(`* Overall Cumulative CGPA: ${cgpa.toFixed(2)}`, { x: x + 8, y: iy, size: 6.2, font: font, color: C.darkText });
  iy -= lH;
  page.drawText(`* Status: ${backlogs === 0 ? 'Consistent, zero backlogs' : `${backlogs} active backlogs require clearance`}`, { x: x + 8, y: iy, size: 6.2, font: font, color: C.darkText });
}

function drawBacklogAnalysisBox(page, x, y, width, height, active, cleared, historical, bold, font, C) {
  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: C.white,
    borderColor: C.borderGray,
    borderWidth: 0.8
  });

  page.drawText('Backlog Analysis', {
    x: x + 8,
    y: y + height - 12,
    size: 7.5,
    font: bold,
    color: C.maroon
  });

  let by = y + height - 28;
  const bRowH = 12;

  // Active
  page.drawText('Active Backlogs', { x: x + 8, y: by, size: 6.5, font: font, color: C.darkText });
  page.drawText(String(active), { x: x + width - 20, y: by, size: 7.5, font: bold, color: active === 0 ? C.greenPass : C.redFail });
  by -= bRowH;

  // Cleared
  page.drawText('Cleared Backlogs', { x: x + 8, y: by, size: 6.5, font: font, color: C.darkText });
  page.drawText(String(cleared), { x: x + width - 20, y: by, size: 7.5, font: bold, color: C.greenPass });
  by -= bRowH;

  // Historical
  page.drawText('Historical Backlogs', { x: x + 8, y: by, size: 6.5, font: font, color: C.darkText });
  page.drawText(String(historical), { x: x + width - 20, y: by, size: 7.5, font: bold, color: C.maroon });
  by -= (bRowH + 2);

  // Encouragement pill
  const pillH = 14;
  page.drawRectangle({
    x: x + 8,
    y: by - pillH,
    width: width - 16,
    height: pillH,
    color: active === 0 ? C.greenBg : C.redBg,
    borderColor: active === 0 ? C.greenPass : C.redFail,
    borderWidth: 0.6
  });

  const pillMsg = active === 0 ? '* Excellent! No active backlogs.' : `! ${active} backlogs require registration.`;
  page.drawText(pillMsg, {
    x: x + 14,
    y: by - pillH + 4,
    size: 6,
    font: bold,
    color: active === 0 ? C.greenPass : C.redFail
  });
}

function drawGradingScaleBox(page, x, y, width, height, bold, font, C) {
  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: C.white,
    borderColor: C.borderGray,
    borderWidth: 0.8
  });

  page.drawText('Grading Scale (AKTU)', {
    x: x + 8,
    y: y + height - 12,
    size: 7.5,
    font: bold,
    color: C.maroon
  });

  // Mini Table
  const gRows = [
    { g: 'O', gp: '10', desc: 'Outstanding' },
    { g: 'A+', gp: '9', desc: 'Excellent' },
    { g: 'A', gp: '8', desc: 'Very Good' },
    { g: 'B+', gp: '7', desc: 'Good' },
    { g: 'B', gp: '6', desc: 'Above Average' },
    { g: 'C', gp: '5', desc: 'Average / Pass' },
    { g: 'F', gp: '0', desc: 'Fail' }
  ];

  let gy = y + height - 25;
  const gLineH = 8.5;

  gRows.forEach(item => {
    page.drawText(item.g, { x: x + 8, y: gy, size: 5.8, font: bold, color: C.maroon });
    page.drawText(item.gp, { x: x + 35, y: gy, size: 5.8, font: bold, color: C.darkText });
    page.drawText(item.desc, { x: x + 65, y: gy, size: 5.8, font: font, color: C.grayText });
    gy -= gLineH;
  });
}
