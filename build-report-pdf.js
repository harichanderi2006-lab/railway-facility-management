const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const marked = require('marked');

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: false
});

const reportMdPath = path.join(__dirname, 'PROJECT_REPORT.md');
const reportHtmlPath = path.join(__dirname, 'report.html');
const reportPdfPath = path.join(__dirname, 'RAILWAY_STATION_PROJECT_REPORT.pdf');
const brainPdfPath = 'C:\\Users\\HARI CHANDER I\\.gemini\\antigravity\\brain\\0508b2a5-e96c-4126-9b8a-8526784e83c8\\RAILWAY_STATION_PROJECT_REPORT.pdf';
const frontendPublicPdf = path.join(__dirname, 'frontend', 'public', 'RAILWAY_STATION_PROJECT_REPORT.pdf');
const frontendPublicShortPdf = path.join(__dirname, 'frontend', 'public', 'report.pdf');
const backendPublicPdf = path.join(__dirname, 'backend', 'report.pdf');

let mdRaw = fs.readFileSync(reportMdPath, 'utf8');

// Strip the front markdown title since we have a dedicated cover page
mdRaw = mdRaw.replace(
  /^# RAILWAY STATION FACILITY NAVIGATION & ACCESSIBILITY WEB SYSTEM[\s\S]*?### A PROJECT REPORT[\s\S]*?\n---\n/im,
  ''
);

// Remove standalone HRs right before chapter headers to avoid blank overflow pages
mdRaw = mdRaw.replace(/\n---\s*\n\s*(#+ CHAPTER)/gi, '\n$1');
mdRaw = mdRaw.replace(/\n---\s*\n\s*(#+ APPENDIX)/gi, '\n$1');
mdRaw = mdRaw.replace(/\n---\s*\n\s*(## REFERENCES)/gi, '\n$1');

// Parse raw markdown
let htmlContent = marked.parse(mdRaw);

// 1. Group Chapter headers: <h1>CHAPTER X</h1>\s*<h1>TITLE</h1>
htmlContent = htmlContent.replace(/<h1>CHAPTER\s+(\d+)<\/h1>\s*<h1>(.*?)<\/h1>/gi, (match, chNum, chTitle) => {
  return `
    <div class="chapter-start">
      <div class="chapter-num">CHAPTER ${chNum}</div>
      <div class="chapter-title">${chTitle}</div>
    </div>
  `;
});

// 2. Group Appendix header: <h1>APPENDIX</h1>\s*<h1>(.*?)<\/h1>
htmlContent = htmlContent.replace(/<h1>APPENDIX<\/h1>\s*<h1>(.*?)<\/h1>/gi, (match, appTitle) => {
  return `
    <div class="chapter-start">
      <div class="chapter-num">APPENDIX</div>
      <div class="chapter-title">${appTitle}</div>
    </div>
  `;
});

// 3. Group Screenshots header
htmlContent = htmlContent.replace(/<h1>SCREENSHOTS OF THE PROJECT<\/h1>/gi, () => {
  return `
    <div class="chapter-start">
      <div class="chapter-num">SYSTEM ILLUSTRATIONS</div>
      <div class="chapter-title">SCREENSHOTS & SCHEMATICS OF THE PROJECT</div>
    </div>
  `;
});

// 4. Style Certificates & Front Matter (use single page-break-before per section, never double break)
htmlContent = htmlContent.replace(/<h2>BONAFIDE CERTIFICATE<\/h2>/gi, () => {
  return `<div class="cert-wrapper"><h2 class="cert-title">BONAFIDE CERTIFICATE</h2>`;
});

htmlContent = htmlContent.replace(/<h2>CERTIFICATE OF VIVA-VOCE EXAMINATION<\/h2>/gi, () => {
  return `</div><div class="cert-wrapper"><h2 class="cert-title">CERTIFICATE OF VIVA-VOCE EXAMINATION</h2>`;
});

htmlContent = htmlContent.replace(/<h2>ABSTRACT<\/h2>/gi, () => {
  return `</div><div class="front-section"><h2 class="section-title">ABSTRACT</h2>`;
});

htmlContent = htmlContent.replace(/<h2>ACKNOWLEDGEMENT<\/h2>/gi, () => {
  return `</div><div class="front-section"><h2 class="section-title">ACKNOWLEDGEMENT</h2>`;
});

htmlContent = htmlContent.replace(/<h2>TABLE OF CONTENTS<\/h2>/gi, () => {
  return `</div><div class="front-section"><h2 class="section-title">TABLE OF CONTENTS</h2>`;
});

htmlContent = htmlContent.replace(/<h2>REFERENCES<\/h2>/gi, () => {
  return `<div class="front-section"><h2 class="section-title">REFERENCES</h2>`;
});

// Close any open front-section before Chapter 1
htmlContent = htmlContent.replace(/(<div class="chapter-start">)/i, '</div>$1');

// Construct full HTML with academic styling
const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Railway Station Facility Navigation & Accessibility Web System - Project Report</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 22mm 20mm 20mm 25mm; /* 25mm left binding margin */
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Times New Roman', Times, 'Liberation Serif', serif;
      font-size: 11.5pt;
      line-height: 1.55;
      color: #111;
      text-align: justify;
      margin: 0;
      padding: 0;
      background: #fff;
    }

    /* Cover Page Styling */
    .cover-page {
      text-align: center;
      border: 3px double #0f2744;
      padding: 30px 20px;
      margin: 0 0 20px 0;
      page-break-after: always;
      page-break-inside: avoid;
    }
    .cover-title {
      font-size: 18pt;
      font-weight: bold;
      color: #0f2744;
      line-height: 1.35;
      text-transform: uppercase;
      margin-top: 15px;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .cover-subtitle {
      font-size: 12.5pt;
      font-weight: 600;
      color: #2b4c7e;
      margin-bottom: 22px;
      font-style: italic;
    }
    .cover-report-tag {
      font-size: 13.5pt;
      font-weight: bold;
      letter-spacing: 1px;
      margin: 14px 0 6px 0;
    }
    .cover-degree-text {
      font-size: 11pt;
      line-height: 1.5;
      margin-bottom: 8px;
    }
    .cover-degree {
      font-size: 12.5pt;
      font-weight: bold;
      color: #0f2744;
    }
    .cover-course {
      font-size: 10.5pt;
      font-weight: bold;
      color: #475569;
      margin-top: 4px;
    }
    .college-seal {
      width: 105px;
      height: 105px;
      margin: 22px auto;
      display: block;
    }
    .cover-dept {
      font-size: 12.5pt;
      font-weight: bold;
      color: #0f2744;
      margin-bottom: 4px;
    }
    .cover-college {
      font-size: 14.5pt;
      font-weight: bold;
      color: #0b1f36;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .cover-univ {
      font-size: 10.5pt;
      font-style: italic;
      color: #334155;
      margin-bottom: 15px;
    }
    .cover-date {
      font-size: 12pt;
      font-weight: bold;
      color: #0f2744;
      margin-bottom: 12px;
    }

    /* Certificates */
    .cert-wrapper {
      page-break-before: always;
      page-break-inside: avoid;
      border: 2px solid #0f2744;
      padding: 24px 28px;
      margin-top: 15px;
      margin-bottom: 20px;
    }
    .cert-title {
      text-align: center;
      font-size: 15pt;
      font-weight: bold;
      color: #0f2744;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 5px;
      margin-bottom: 22px;
      border-bottom: 1.5px solid #0f2744;
      padding-bottom: 8px;
    }

    /* Front Sections */
    .front-section {
      page-break-before: always;
      padding-top: 10px;
    }
    .section-title {
      text-align: center;
      font-size: 14.5pt;
      font-weight: bold;
      color: #0f2744;
      text-transform: uppercase;
      margin-top: 5px;
      margin-bottom: 18px;
      border-bottom: 1.5px solid #0f2744;
      padding-bottom: 6px;
    }

    /* Chapter Starts */
    .chapter-start {
      page-break-before: always;
      text-align: center;
      padding-top: 15px;
      margin-top: 10px;
      margin-bottom: 25px;
      padding-bottom: 12px;
      border-bottom: 2px solid #0f2744;
    }
    .chapter-num {
      font-size: 14.5pt;
      font-weight: bold;
      color: #1e3a8a;
      letter-spacing: 1.5px;
      margin-bottom: 6px;
    }
    .chapter-title {
      font-size: 16pt;
      font-weight: bold;
      color: #0f2744;
      letter-spacing: 0.5px;
    }

    /* Headings */
    h3 {
      font-size: 12.5pt;
      font-weight: bold;
      color: #0f2744;
      margin-top: 20px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }
    h4 {
      font-size: 11.5pt;
      font-weight: bold;
      color: #1e293b;
      margin-top: 15px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }
    p {
      margin-top: 0;
      margin-bottom: 11px;
      text-indent: 0;
    }
    ul, ol {
      margin-top: 4px;
      margin-bottom: 12px;
      padding-left: 24px;
    }
    li {
      margin-bottom: 5px;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0 18px 0;
      font-size: 9.5pt;
      page-break-inside: auto; /* Allow large tables like TOC to flow cleanly across pages */
    }
    tr {
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 9px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background-color: #f1f5f9;
      color: #0f2744;
      font-weight: bold;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    /* Code Blocks & Schematics */
    pre {
      background-color: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 3px solid #0f2744;
      border-radius: 4px;
      padding: 9px 11px;
      font-family: 'Consolas', 'Courier New', Courier, monospace;
      font-size: 7.8pt;
      line-height: 1.18;
      overflow-x: hidden;
      white-space: pre-wrap;
      word-break: break-all;
      margin: 12px 0;
      page-break-inside: avoid;
    }
    code {
      font-family: 'Consolas', 'Courier New', Courier, monospace;
      font-size: 8.5pt;
      background-color: #f1f5f9;
      padding: 1px 3px;
      border-radius: 3px;
    }
    pre code {
      background-color: transparent;
      padding: 0;
      font-size: 7.8pt;
    }

    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 20px 0;
    }
    
    em {
      font-size: 10pt;
      color: #334155;
    }
  </style>
</head>
<body>

  <!-- FRONT COVER PAGE -->
  <div class="cover-page">
    <div class="cover-title">RAILWAY STATION FACILITY NAVIGATION &amp; ACCESSIBILITY WEB SYSTEM</div>
    <div class="cover-subtitle">(A Full-Stack MERN Platform for Dr. M.G.R. Chennai Central Railway Station)</div>
    
    <div class="cover-report-tag">A PROJECT REPORT</div>
    <div class="cover-degree-text">
      In partial fulfillment for the award of the Degree of<br>
      <span class="cover-degree">BACHELOR OF ENGINEERING</span><br>
      in<br>
      <span class="cover-degree">COMPUTER SCIENCE AND ENGINEERING</span><br>
      <span class="cover-course">(2311CSE503R – FULL STACK DEVELOPMENT)</span>
    </div>

    <!-- Academic Emblem SVG -->
    <svg class="college-seal" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="none" stroke="#0f2744" stroke-width="3"/>
      <circle cx="50" cy="50" r="40" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="3,2"/>
      <path d="M30 65 L50 72 L70 65 L70 42 L50 48 L30 42 Z" fill="#e2e8f0" stroke="#0f2744" stroke-width="2"/>
      <path d="M50 48 L50 72" stroke="#0f2744" stroke-width="2"/>
      <path d="M44 38 Q50 30 56 38 Q50 44 44 38 Z" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>
      <circle cx="50" cy="33" r="3" fill="#ef4444"/>
      <line x1="50" y1="20" x2="50" y2="25" stroke="#f59e0b" stroke-width="1.5"/>
      <line x1="40" y1="23" x2="43" y2="27" stroke="#f59e0b" stroke-width="1.5"/>
      <line x1="60" y1="23" x2="57" y2="27" stroke="#f59e0b" stroke-width="1.5"/>
    </svg>

    <div class="cover-dept">DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING</div>
    <div class="cover-college">EASWARI ENGINEERING COLLEGE</div>
    <div class="cover-univ">(An Autonomous Institution – Affiliated to Anna University, Chennai)</div>
    <div class="cover-date">OCTOBER 2026</div>
  </div>

  <!-- MAIN BODY CONTENT -->
  ${htmlContent}

</body>
</html>
`;

fs.writeFileSync(reportHtmlPath, fullHtml, 'utf8');
console.log('Generated clean HTML report at:', reportHtmlPath);

// Execute Edge Headless Print to PDF directly using spawnSync
console.log('Invoking Edge Headless to compile PDF...');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const fileUrl = 'file:///' + reportHtmlPath.replace(/\\/g, '/').replace(/ /g, '%20');

try {
  const result = spawnSync(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--run-all-compositor-stages-before-draw',
    '--print-to-pdf=' + reportPdfPath,
    fileUrl
  ]);

  if (fs.existsSync(reportPdfPath)) {
    const stats = fs.statSync(reportPdfPath);
    console.log(`PDF successfully generated! Size: ${(stats.size / 1024).toFixed(1)} KB at ${reportPdfPath}`);
    
    // Copy to brain artifact directory
    fs.copyFileSync(reportPdfPath, brainPdfPath);
    console.log('Copied PDF to Brain Artifacts directory at:', brainPdfPath);

    // Copy to frontend/public for instant HTTP access
    const fePublicDir = path.join(__dirname, 'frontend', 'public');
    if (!fs.existsSync(fePublicDir)) fs.mkdirSync(fePublicDir, { recursive: true });
    fs.copyFileSync(reportPdfPath, frontendPublicPdf);
    fs.copyFileSync(reportPdfPath, frontendPublicShortPdf);
    console.log('Copied PDF to frontend/public for web serving at http://localhost:3000/report.pdf');

    // Copy to backend for direct express serving
    fs.copyFileSync(reportPdfPath, backendPublicPdf);
    console.log('Copied PDF to backend for web serving at http://localhost:5000/report.pdf');
  } else {
    console.error('PDF file was not found after execution. Exit status:', result.status);
  }
} catch (err) {
  console.error('Error compiling PDF with Edge:', err);
}
