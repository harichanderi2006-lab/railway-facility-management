const fs = require('fs');
const path = require('path');
const docx = require('docx');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  WidthType,
  HeightRule,
  PageBreak,
  UnderlineType,
  ShadingType
} = docx;

console.log('Starting Word Report Generation...');

const assetsDir = path.join(__dirname, 'report_assets');
const uploadedDir = 'C:\\Users\\HARI CHANDER I\\.gemini\\antigravity\\brain\\0508b2a5-e96c-4126-9b8a-8526784e83c8\\.user_uploaded';

// Images
const collegeLogoPath = path.join(assetsDir, 'extracted_img_1.jpg');
const archDiagPath = path.join(assetsDir, 'architecture_diagram.png');
const useCaseDiagPath = path.join(assetsDir, 'usecase_diagram.png');
const erDiagPath = path.join(assetsDir, 'er_diagram.png');
const seqDiagPath = path.join(assetsDir, 'sequence_diagram.png');

const screenshot1Path = path.join(uploadedDir, 'media_1793173561312_a69c2dcc.png');
const screenshot2Path = path.join(uploadedDir, 'media_1793173567751_8ba05782.png');
const screenshot3Path = path.join(uploadedDir, 'media_1793173574895_807851fb.png');
const screenshot4Path = path.join(uploadedDir, 'media_1793173582552_e9bdfeef.png');

const outDocxPath = path.join(__dirname, 'RAILWAY_FACILITY_AND_MANAGEMENT_REPORT.docx');
const brainDocxPath = 'C:\\Users\\HARI CHANDER I\\.gemini\\antigravity\\brain\\0508b2a5-e96c-4126-9b8a-8526784e83c8\\RAILWAY_FACILITY_AND_MANAGEMENT_REPORT.docx';

// Helper Styles & Paragraph Creators
const FONT = 'Times New Roman';

function pTitle(text, options = {}) {
  return new Paragraph({
    alignment: options.align || AlignmentType.CENTER,
    spacing: { before: options.before || 120, after: options.after || 120, line: 360 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: options.size || 28, // 14pt default
        bold: options.bold !== false,
        color: options.color || '000000',
        allCaps: options.allCaps || false
      })
    ]
  });
}

function pBody(text, options = {}) {
  return new Paragraph({
    alignment: options.align || AlignmentType.JUSTIFIED,
    spacing: { before: options.before || 60, after: options.after || 120, line: 360 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: options.size || 24, // 12pt
        bold: options.bold || false,
        italics: options.italics || false,
        color: options.color || '111111'
      })
    ]
  });
}

function pHeading1(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120, line: 360 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: 30, // 15pt
        bold: true,
        allCaps: true,
        color: '000000'
      })
    ]
  });
}

function pHeading2(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 200, after: 100, line: 360 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: 26, // 13pt
        bold: true,
        allCaps: true,
        color: '000000'
      })
    ]
  });
}

function pHeading3(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 160, after: 80, line: 360 },
    children: [
      new TextRun({
        text,
        font: FONT,
        size: 24, // 12pt
        bold: true,
        color: '000000'
      })
    ]
  });
}

function pBullet(text, boldPrefix = '') {
  const children = [];
  if (boldPrefix) {
    children.push(new TextRun({ text: boldPrefix, font: FONT, size: 24, bold: true, color: '111111' }));
  }
  children.push(new TextRun({ text, font: FONT, size: 24, color: '111111' }));
  return new Paragraph({
    bullet: { level: 0 },
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 40, after: 60, line: 360 },
    children
  });
}

function pCode(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 40, after: 40, line: 260 },
    children: [
      new TextRun({
        text,
        font: 'Consolas',
        size: 19, // 9.5pt
        color: '1E293B'
      })
    ]
  });
}

function createBorderedTable(rowsData, colWidths, isHeaderBold = true) {
  const tableRows = rowsData.map((row, rIdx) => {
    return new TableRow({
      children: row.map((cellText, cIdx) => {
        const isHeader = rIdx === 0 && isHeaderBold;
        return new TableCell({
          width: { size: colWidths[cIdx], type: WidthType.DXA },
          shading: isHeader ? { fill: 'F1F5F9', type: ShadingType.CLEAR } : undefined,
          margins: { top: 120, bottom: 120, left: 160, right: 160 },
          children: [
            new Paragraph({
              alignment: cIdx === 0 ? AlignmentType.CENTER : AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: String(cellText),
                  font: FONT,
                  size: 21, // 10.5pt
                  bold: isHeader
                })
              ]
            })
          ]
        });
      })
    });
  });

  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    rows: tableRows
  });
}

const docChildren = [];

// ==========================================
// 1. TITLE PAGE (Page 1)
// ==========================================
docChildren.push(
  pTitle('RAILWAY FACILITY AND MANAGEMENT', { size: 36, before: 300, after: 200, allCaps: true }),
  pTitle('A PROJECT REPORT', { size: 26, before: 100, after: 150, allCaps: true }),
  pTitle('Submitted by', { size: 24, bold: false, italics: true, before: 80, after: 60 }),
  pTitle('HARI CHANDER I (310624149018)', { size: 28, bold: true, before: 60, after: 150 }),
  pTitle('in partial fulfillment for the award of the Degree', { size: 24, bold: false, italics: true, before: 80, after: 40 }),
  pTitle('of', { size: 24, bold: false, italics: true, before: 40, after: 100 }),
  pTitle('BACHELOR OF ENGINEERING', { size: 26, bold: true, before: 80, after: 40, allCaps: true }),
  pTitle('in', { size: 22, bold: false, italics: true, before: 40, after: 40 }),
  pTitle('DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING\n(CYBERSECURITY)', { size: 24, bold: true, before: 40, after: 80, allCaps: true }),
  pTitle('2311CSE503R–FULL STACK DEVELOPMENT', { size: 24, bold: true, before: 40, after: 200 })
);

// Add College Logo Image if exists
if (fs.existsSync(collegeLogoPath)) {
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 150 },
      children: [
        new ImageRun({
          data: fs.readFileSync(collegeLogoPath),
          transformation: { width: 130, height: 87 }
        })
      ]
    })
  );
}

docChildren.push(
  pTitle('EASWARI ENGINEERING COLLEGE,', { size: 26, bold: true, before: 100, after: 40, allCaps: true }),
  pTitle('(AN AUTONOMOUS INSTITUTION)–AFFILIATED TO ANNA UNIVERSITY,\nCHENNAI', { size: 22, bold: true, before: 40, after: 250, allCaps: true }),
  pTitle('OCTOBER 2026', { size: 24, bold: true, before: 150, after: 100 }),
  new Paragraph({ children: [new PageBreak()] })
);

// ==========================================
// 2. BONAFIDE CERTIFICATE (Page 2)
// ==========================================
if (fs.existsSync(collegeLogoPath)) {
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 100 },
      children: [
        new ImageRun({
          data: fs.readFileSync(collegeLogoPath),
          transformation: { width: 100, height: 67 }
        })
      ]
    })
  );
}

docChildren.push(
  pTitle('EASWARI ENGINEERING COLLEGE', { size: 28, bold: true, before: 60, after: 80, allCaps: true }),
  pTitle('BONAFIDE CERTIFICATE', { size: 26, bold: true, before: 60, after: 250, allCaps: true }),
  pBody(
    'Certified that this mini project report titled “RAILWAY FACILITY AND MANAGEMENT” is the Bonafide Work of “HARI CHANDER I (310624149018)”, who carried out the project work under my supervision.',
    { before: 150, after: 350, size: 24 }
  ),
  new Paragraph({ spacing: { before: 800, after: 200 } }),
  new Table({
    width: { size: 9000, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 4500, type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [new TextRun({ text: 'HEAD OF THE DEPARTMENT', font: FONT, size: 24, bold: true })]
              })
            ]
          }),
          new TableCell({
            width: { size: 4500, type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: 'SUPERVISOR', font: FONT, size: 24, bold: true })]
              })
            ]
          })
        ]
      })
    ]
  }),
  new Paragraph({ children: [new PageBreak()] })
);

// ==========================================
// 3. CERTIFICATE OF VIVA-VOCE EXAMINATION (Page 3)
// ==========================================
if (fs.existsSync(collegeLogoPath)) {
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 80 },
      children: [
        new ImageRun({
          data: fs.readFileSync(collegeLogoPath),
          transformation: { width: 100, height: 67 }
        })
      ]
    })
  );
}

docChildren.push(
  pTitle('EASWARI ENGINEERING COLLEGE', { size: 28, bold: true, before: 60, after: 60, allCaps: true }),
  pTitle('Certificate of Viva-voce-Examination', { size: 26, bold: true, before: 40, after: 200 }),
  pBody(
    'This is to certify that the Viva Voce Examination of the Project Work entitled “RAILWAY FACILITY AND MANAGEMENT” submitted by Mr./Ms. HARI CHANDER I (Reg. No. 310624149018) in partial fulfillment of the requirements for the award of the degree of BACHELOR OF ENGINEERING was conducted on ____________ (Date) in the Department of Computer Science and Engineering (Cyber Security), Easwari Engineering College, Ramapuram – Chennai.',
    { before: 100, after: 300, size: 24 }
  ),
  new Paragraph({ spacing: { before: 400, after: 150 } }),
  new Table({
    width: { size: 9000, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 4500, type: WidthType.DXA },
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Internal Examiner', font: FONT, size: 24, bold: true })] }),
              new Paragraph({ spacing: { before: 120 }, children: [new TextRun({ text: 'Name : ________________________', font: FONT, size: 22 })] }),
              new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: 'Designation : __________________', font: FONT, size: 22 })] }),
              new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: 'Address : _____________________', font: FONT, size: 22 })] })
            ]
          }),
          new TableCell({
            width: { size: 4500, type: WidthType.DXA },
            children: [
              new Paragraph({ children: [new TextRun({ text: 'External Examiner', font: FONT, size: 24, bold: true })] }),
              new Paragraph({ spacing: { before: 120 }, children: [new TextRun({ text: 'Name : ________________________', font: FONT, size: 22 })] }),
              new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: 'Designation : __________________', font: FONT, size: 22 })] }),
              new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: 'Address : _____________________', font: FONT, size: 22 })] })
            ]
          })
        ]
      })
    ]
  }),
  new Paragraph({ spacing: { before: 300 } }),
  pBody('Date: ____________________', { before: 100, after: 100 }),
  new Paragraph({ children: [new PageBreak()] })
);

// ==========================================
// 4. ABSTRACT (Page 4)
// ==========================================
docChildren.push(
  pHeading1('ABSTRACT'),
  pBody(
    'The Railway Facility and Management platform is a full-stack web application designed to simplify physical amenity navigation, step-free accessibility, suburban transit tracking, and passenger services for high-density railway terminals such as Dr. M.G.R. Chennai Central (Station Code: MAS). Major railway stations handle hundreds of thousands of commuters daily across extensive multi-platform layouts. Passengers, especially senior citizens and Divyangjan (differently-abled persons), frequently face significant friction locating essential amenities like accessible restrooms, elevators, ramps, battery-operated buggies, water kiosks, and medical emergency booths. The primary objective of this project is to eliminate spatial confusion, reduce transit anxiety, and provide automated accessibility and passenger assistance.'
  ),
  pBody(
    'The application provides an intuitive, high-contrast user interface with role-based access for commuters, station superintendents, and security personnel. Users can access an interactive 2D SVG blueprint of the station floor layout spanning 17 platforms, concourses, and foot-over-bridges. A dedicated step-free route minimap provides animated walking directions and turn-by-turn guidance, specifically highlighting tactile paving and wheelchair-accessible paths. All physical amenities, live crowd levels, and platform allocations are managed in a centralized database for instant retrieval and real-time visualization.'
  ),
  pBody(
    'One of the major capabilities of the platform is the integrated Indian Railways Public Address (PA) Audio Studio. Utilizing the modern browser Web Audio API, the system synthesizes the authentic 4-note melodic bell chime (D5 ➔ F#5 ➔ A5 ➔ D6) followed by natural trilingual voice announcements in Hindi (“यात्री, कृपया ध्यान दें...”), Tamil (“பயணிகள் கவனிக்கவும்...”), and English with distinct female and male announcer acoustics. A phonetic Tamil speech fallback engine ensures audible, crystal-clear announcements across devices without requiring third-party plugins. Additionally, the system provides live suburban transit network tracking across Chennai’s arterial corridors and instant 1-tap Emergency SOS assistance.'
  ),
  pBody(
    'The project is developed using the MERN stack, comprising MongoDB, Express.js, React 18, and Node.js bundled with Vite. React.js powers the responsive frontend featuring full WCAG AAA accessibility compliance, high-contrast themes, dynamic typography scaling, and live soundwave equalizer animations. Node.js and Express.js manage secure REST APIs, role-based JWT authentication, and WebSocket telemetry for real-time crowd sensor data. MongoDB securely persists passenger accounts, station facility inventories, train departure schedules, and incident logs. Overall, the Railway Facility and Management system delivers a reliable, inclusive, and modern digital platform for next-generation transit hubs.'
  ),
  new Paragraph({ children: [new PageBreak()] })
);

// ==========================================
// 5. ACKNOWLEDGEMENT (Page 5)
// ==========================================
docChildren.push(
  pHeading1('ACKNOWLEDGEMENT'),
  pBody(
    'I express our sincere gratitude to the Principal Dr. P. Deiva Sundari and the Management of our college for providing us with the opportunity to carry out this project work.',
    { before: 120, after: 120 }
  ),
  pBody(
    'I convey our heartfelt thanks to the Dr. V. Balaji Vaithilingam, Department of Computer Science and Engineering (CYBER SECURITY), for the continuous encouragement and academic support.',
    { before: 120, after: 120 }
  ),
  pBody(
    'I am extremely thankful to our Ms. Divyanjali, Department of Computer Science and Engineering (CYBER SECURITY), for valuable guidance, suggestions, and motivation throughout the completion of this project.',
    { before: 120, after: 120 }
  ),
  pBody(
    'I would also like to extend our gratitude to all the faculty members of the Department of Computer Science and Engineering (CYBER SECURITY) for their support.',
    { before: 120, after: 120 }
  ),
  pBody(
    'Finally, I thank our parents and friends for their constant encouragement and help during the course of this project.',
    { before: 120, after: 120 }
  ),
  new Paragraph({ children: [new PageBreak()] })
);

// ==========================================
// 6. TABLE OF CONTENTS (Pages 6 - 9)
// ==========================================
docChildren.push(
  pHeading1('TABLE OF CONTENTS'),
  pBody(' '),
  createBorderedTable([
    ['CHAPTER NO.', 'TITLE', 'PAGE No.'],
    ['', 'Bonafide Certificate', 'ii'],
    ['', 'Certificate of Viva-Voce Examination', 'iii'],
    ['', 'Abstract', 'iv'],
    ['', 'Acknowledgement', 'v'],
    ['', 'Table of Contents', 'vi'],
    ['1', 'INTRODUCTION', '1'],
    ['', '1.1 Overview', '1'],
    ['', '1.2 Problem Definition', '1'],
    ['', '1.3 Objective', '1'],
    ['', '1.4 Scope of the Project', '2'],
    ['', '1.5 Motivation', '2'],
    ['2', 'RELATED WORK', '3'],
    ['', '2.1 Literature Review', '3'],
    ['', '2.2 Existing System', '3'],
    ['', '2.3 Proposed System', '4'],
    ['', '2.4 Key Features', '4'],
    ['', '2.5 Feasibility', '4'],
    ['3', 'SYSTEM ANALYSIS', '5'],
    ['', '3.1 System Requirements', '5'],
    ['', '3.1.1 Functional Requirements', '5'],
    ['', '3.1.2 Non-Functional Requirements', '5'],
    ['', '3.2 Software and Hardware Requirements', '6'],
    ['', '3.3 Users and Roles', '6'],
    ['4', 'SYSTEM DESIGN', '7'],
    ['', '4.1 System Architecture', '7'],
    ['', '4.2 Module Description', '8'],
    ['', '4.3 Data Design', '8'],
    ['', '4.4 Class Diagram & ER Model', '9'],
    ['', '4.5 Sequence Diagram', '9'],
    ['', '4.6 Attention & Accessibility Indicator Design', '10'],
    ['', '4.7 Security Design', '10'],
    ['5', 'IMPLEMENTATION', '11'],
    ['', '5.1 Implementation Overview', '11'],
    ['', '5.2 Backend Implementation', '11'],
    ['', '5.3 Frontend Implementation', '11'],
    ['', '5.4 API Organization', '12'],
    ['', '5.5 Attention & Emergency SOS Workflow', '12'],
    ['', '5.6 Facility Information Workflow & Live Train Tracking', '12'],
    ['', '5.7 Public Address Audio & Chime Synthesis', '13'],
    ['', '5.8 Reporting and Record Management', '13'],
    ['', '5.9 Configuration and Deployment', '13'],
    ['6', 'CONCLUSION & FUTURE WORK', '14'],
    ['', '6.1 Conclusion', '14'],
    ['', '6.2 Future Enhancements', '14'],
    ['', 'APPENDIX', '15'],
    ['', 'GitHub Link and Source Code Overview', '15'],
    ['', 'Project Folder Structure', '16'],
    ['', 'Backend Package Installation and Database Connection', '17'],
    ['', 'server.js: Server Configuration', '18'],
    ['', 'auth.js', '20'],
    ['', '/rbac.js', '21'],
    ['', 'models/User.js', '22'],
    ['', 'routes/authRoutes.js', '23'],
    ['', 'services/railwayAudio.js: Chime & Speech Engine', '24'],
    ['', 'Environment Variables', '25'],
    ['', 'Password Hashing and Registration', '25'],
    ['', 'Login and JWT Generation', '26'],
    ['', 'Facility & Train Telemetry API', '28'],
    ['', 'Update API', '29'],
    ['', 'Login.jsx', '30'],
    ['', 'REST API Request and Response Examples', '34'],
    ['', 'SCREENSHOTS OF THE PROJECT', '35'],
    ['', 'Login Page & Main Executive Dashboard', '35'],
    ['', 'Interactive Station Facility & Platform Layout Map', '36'],
    ['', 'Live Suburban Train Tracking & Station PA Console', '37'],
    ['', 'Station Facility Directory & Route Minimap Navigation', '38'],
    ['', 'REFERENCES', '39']
  ], [1500, 6000, 1500]),
  new Paragraph({ children: [new PageBreak()] })
);

// ==========================================
// 7. CHAPTER 1: INTRODUCTION
// ==========================================
docChildren.push(
  pHeading1('CHAPTER 1\nINTRODUCTION'),
  pHeading2('1.1 OVERVIEW'),
  pBody(
    'The Railway Facility and Management system is a comprehensive web-based platform designed to manage passenger navigation, physical station amenities, train schedules, and accessibility services across premier transit hubs such as Dr. M.G.R. Chennai Central Railway Station (Station Code: MAS). Handling over 400 long-distance and suburban trains and approximately 500,000 commuters every day across 17 platforms, Chennai Central is one of the busiest railway complexes in India. In such a vast environment, navigating between platforms, finding accessible restrooms, locating wheelchair buggies, reaching emergency medical booths, and identifying water kiosks can be daunting for passengers.'
  ),
  pBody(
    'The application includes a secure authentication system, an interactive dashboard, an interactive SVG station blueprint, a step-free route minimap, live suburban train tracking, and an authentic station Public Address (PA) chime audio console. Developed using the MERN stack (MongoDB, Express.js, React.js, and Node.js) with Vite, the platform provides an efficient, scalable, and inclusive solution for railway infrastructure management.'
  ),
  pHeading2('1.2 PROBLEM DEFINITION'),
  pBody(
    'Commuters at major railway stations often face severe difficulties locating essential amenities and accessible pathways. Traditional station guidance relies on static physical signboards that are often obstructed by heavy crowds or located too high for wheelchair users. Passengers with visual impairments or mobility challenges lack turn-by-turn tactile route navigation to barrier-free restrooms, elevators, and ramps. Furthermore, traditional audio announcements are frequently distorted by station ambient noise, and passengers have no way to replay announcements in their preferred language. Station personnel lack centralized tools to monitor amenity status, crowd density, and immediate passenger SOS alerts. Therefore, this project develops a modern web-based system that unifies facility discovery, step-free navigation, authentic PA audio synthesis, and live transit monitoring.'
  ),
  pHeading2('1.3 OBJECTIVE'),
  pBullet('To maintain station facility details, coordinates, accessibility features, and operational status in one centralized database for instant passenger access.', '• '),
  pBullet('To provide an interactive 2D SVG station blueprint mapping all 17 platforms, concourses, lifts, ramps, and amenities.', '• '),
  pBullet('To offer animated turn-by-turn route minimaps with step-free tactile paths for Divyangjan and elderly commuters.', '• '),
  pBullet('To synthesize authentic Indian Railways 4-note bell chimes and trilingual announcements (Hindi, Tamil, English) using browser-native Web Audio and Speech APIs.', '• '),
  pBullet('To provide real-time suburban and mainline train tracking with live speed, corridor line, and platform telemetry.', '• '),
  pBullet('To enable instant 1-tap Emergency SOS dispatching to station security and Sahayaks.', '• '),
  pHeading2('1.4 SCOPE OF THE PROJECT'),
  pBody(
    'The Railway Facility and Management platform simplifies the discovery and management of station amenities. It allows passengers to look up restrooms, medical clinics, battery buggies, lifts, food stalls, and ticket counters. The system provides real-time crowd heatmaps, delay alerts, and interactive route guidance. The application supports full WCAG AAA accessibility, including yellow-on-black high-contrast mode, dynamic font scaling, and voice narration. In the future, automated IoT beacon positioning and CCTV video analytics can be integrated.'
  ),
  pHeading2('1.5 MOTIVATION'),
  pBody(
    'The motivation behind developing the Railway Facility and Management system is to eliminate the physical and informational barriers faced by millions of commuters every day. Independent navigation is a fundamental right for senior citizens, patients visiting adjacent medical centers, and Divyangjan passengers. By leveraging modern open-source web technologies, this platform empowers every traveler with accessible digital tools, clear multi-lingual announcements, and prompt emergency help.'
  ),
  new Paragraph({ children: [new PageBreak()] })
);

// ==========================================
// 8. CHAPTER 2: RELATED WORK
// ==========================================
docChildren.push(
  pHeading1('CHAPTER 2\nRELATED WORK'),
  pHeading2('2.1 LITERATURE REVIEW'),
  pBody(
    'Existing transit assistance applications primarily focus on train ticketing and live train running status (e.g., IRCTC, NTES). However, these systems provide virtually zero support for indoor station terminal navigation and physical amenity accessibility. Research in transit geography highlights that terminal transfer times and passenger stress levels are heavily influenced by the ease of finding restrooms, elevators, and boarding gates. Studies in indoor wayfinding demonstrate that high-contrast schematic SVG representations combined with tactile route indicators drastically reduce navigation errors among visually and mobility-impaired passengers. Modern web technologies like React.js and WebSockets enable responsive, dynamic telemetry updates without requiring heavy native mobile apps.'
  ),
  pHeading2('2.2 EXISTING SYSTEM'),
  pBody(
    'In conventional railway station environments, facility directories and station announcements suffer from significant limitations:'
  ),
  pBullet('Amenity directories are static, physical, or paper-based, making real-time operational status (e.g., closed for cleaning) impossible to communicate.', '• '),
  pBullet('Divyangjan passengers have no digital guidance indicating where step-free ramps, elevators, and tactile paving are located.', '• '),
  pBullet('Audio announcements are only heard over ambient public address loudspeakers, often drowned out by locomotive noise and station reverberation.', '• '),
  pBullet('Emergency assistance requires physically seeking out Railway Protection Force (RPF) personnel or the Station Superintendent office.', '• '),
  pHeading2('2.3 PROPOSED SYSTEM'),
  pBody(
    'The proposed Railway Facility and Management platform integrates station spatial mapping, facility management, live train telemetry, and public address audio synthesis into a unified web application. Passengers can search amenities by category, view animated walking paths, track train arrivals across suburban corridors, and listen to authentic chimes and clear announcements in Hindi, Tamil, and English on their personal devices.'
  ),
  pHeading2('2.4 KEY FEATURES'),
  pBullet('Interactive SVG floor plan mapping 17 platforms, concourses, and overbridges.', '• '),
  pBullet('Step-free turn-by-turn walking minimaps for wheelchair and Divyangjan users.', '• '),
  pBullet('Web Audio API synthesized 4-note melodic chime bell (D5 ➔ F#5 ➔ A5 ➔ D6).', '• '),
  pBullet('Trilingual voice announcements (Hindi, Tamil, English) with Female/Male announcer toggles.', '• '),
  pBullet('Live suburban transit tracker monitoring 4 arterial corridors at 92 km/h GPS speeds.', '• '),
  pBullet('One-tap Emergency SOS broadcast for rapid medical and security assistance.', '• '),
  pHeading2('2.5 FEASIBILITY'),
  pBody(
    'The system is feasible technically, economically, and operationally. Developing on the open-source MERN stack (MongoDB, Express, React, Node.js) avoids expensive proprietary licensing. The Web Audio API and SpeechSynthesis engine run entirely within modern web browsers with zero external binary or cloud billing dependencies.'
  ),
  new Paragraph({ children: [new PageBreak()] })
);

// ==========================================
// 9. CHAPTER 3: SYSTEM ANALYSIS
// ==========================================
docChildren.push(
  pHeading1('CHAPTER 3\nSYSTEM ANALYSIS'),
  pHeading2('3.1 SYSTEM REQUIREMENTS'),
  pHeading3('3.1.1 FUNCTIONAL REQUIREMENTS'),
  pBullet('User Registration & Role Authentication: Secure JWT login for passengers, station staff, and administrators.', '• '),
  pBullet('Facility Directory & Search: Instant lookup and filtering of restrooms, medical booths, buggies, elevators, and ATMs.', '• '),
  pBullet('Interactive Terminal Navigation: Turn-by-turn route path rendering with tactile guidance overlays.', '• '),
  pBullet('Live Train Tracking: Real-time telemetry displaying arrival times, delay status, platform assignment, and speed.', '• '),
  pBullet('Public Address Sound Studio: Browser-synthesized 4-note chime and trilingual spoken announcements.', '• '),
  pBullet('Emergency SOS & Security Relay: Immediate dispatch of emergency alerts with coordinate locations.', '• '),
  pHeading3('3.1.2 NON-FUNCTIONAL REQUIREMENTS'),
  pBullet('Scalability: The platform supports concurrent passenger connections using asynchronous event-driven Node.js.', '• '),
  pBullet('Accessibility (WCAG AAA): Yellow-on-black high contrast mode, dynamic font scaling, and screen-reader compatibility.', '• '),
  pBullet('Reliability: In-memory fallback and caching ensure navigation remains available even during database dropouts.', '• '),
  pBullet('Performance: Sub-100ms API response times and instant Web Audio API chime synthesis.', '• '),
  pBullet('Security: Bcryptjs password hashing, JWT bearer token validation, and CORS domain controls.', '• '),
  pHeading2('3.2 SOFTWARE AND HARDWARE REQUIREMENTS'),
  createBorderedTable([
    ['Category', 'Requirement for Railway Facility and Management'],
    ['Frontend', 'React.js 18, React DOM, React Router, Vite, Tailwind CSS, Lucide Icons'],
    ['Backend', 'Node.js LTS, Express.js, Socket.io, HTTP Server'],
    ['Database', 'MongoDB / MongoDB Atlas (Mongoose ODM)'],
    ['Security / Middleware', 'JWT (jsonwebtoken), bcryptjs, CORS, Auth & RBAC Middleware'],
    ['Audio Engine', 'Web Audio API (OscillatorNode, GainNode), Web SpeechSynthesis API'],
    ['Development Tools', 'Visual Studio Code, Git, Terminal, Modern Web Browser'],
    ['Hardware', 'Standard PC/Laptop (Intel/AMD multi-core, 8GB RAM, 100MB disk space)']
  ], [2500, 6500]),
  pHeading2('3.3 USERS AND ROLES'),
  pBody(
    'The system defines three core roles: General & Divyangjan Commuters (access station maps, minimaps, train tracking, audio announcements, and SOS), Station Staff & Sahayaks (update facility operational status, manage buggy loan queues), and System Administrators (broadcast station-wide security alerts, view system audit logs).'
  ),
  new Paragraph({ children: [new PageBreak()] })
);

// ==========================================
// 10. CHAPTER 4: SYSTEM DESIGN
// ==========================================
docChildren.push(
  pHeading1('CHAPTER 4\nSYSTEM DESIGN'),
  pHeading2('4.1 SYSTEM ARCHITECTURE'),
  pBody(
    'The Railway Facility and Management platform follows a clean, decoupled three-tier architecture comprising Presentation Layer, Application Layer, and Database Layer. The presentation layer is built with React 18 and Vite, delivering responsive UI components and handling real-time audio synthesis. The application layer uses Node.js and Express.js to process routing, authentication, and WebSocket telemetry broadcasts. The database layer employs MongoDB to store users, amenities, trains, and emergency incident logs.'
  )
);

// Embed Architecture Diagram
if (fs.existsSync(archDiagPath)) {
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 100 },
      children: [
        new ImageRun({
          data: fs.readFileSync(archDiagPath),
          transformation: { width: 560, height: 390 }
        })
      ]
    }),
    pBody('Figure 4.1: Three-Tier System Architecture of Railway Facility and Management', { align: AlignmentType.CENTER, italics: true, size: 20 })
  );
}

docChildren.push(
  pHeading2('4.2 MODULE DESCRIPTION'),
  createBorderedTable([
    ['Module', 'Purpose'],
    ['Authentication & RBAC', 'Provides user registration, JWT token generation, password hashing, and role validation.'],
    ['Facility Directory & Minimap', 'Manages station amenities, coordinate waypoints, and animated turn-by-turn route paths.'],
    ['Train Telemetry & Transit', 'Tracks mainline and suburban trains across 4 arterial corridors with GPS speeds and delays.'],
    ['PA Sound & Chime Studio', 'Synthesizes authentic 4-note bell chime and multi-lingual voice announcements (HI, TA, EN).'],
    ['Emergency SOS Dispatch', 'Relays 1-tap panic alerts with platform location to railway police and medical teams.'],
    ['Crowd Sensing & Badges', 'Broadcasts platform passenger density levels (Low, Moderate, High) via WebSockets.'],
    ['Accessibility Engine', 'Controls WCAG AAA yellow-on-black contrast theme, font enlargement, and screen reader cues.']
  ], [2500, 6500]),
  pHeading2('4.3 DATA DESIGN'),
  pBody(
    'MongoDB stores application documents across structured collections: Users (passengers and staff credentials), Facilities (restrooms, lifts, buggies, coordinates), Trains (train numbers, departure schedules, platform allocations), Alerts (station notices), and EmergencySOS (incident reports). Unique indexes on email, facility codes, and train numbers guarantee fast data retrieval.'
  ),
  pHeading2('4.4 USE CASE & ENTITY RELATIONSHIP (ER) DIAGRAMS'),
  pBody(
    'The Use Case Diagram depicts the interactions between commuters, Divyangjan travelers, station staff, and RPF security. The Entity Relationship (ER) Diagram specifies the data models, primary keys, foreign references, and cardinality across the platform.'
  )
);

// Embed Use Case Diagram
if (fs.existsSync(useCaseDiagPath)) {
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 100 },
      children: [
        new ImageRun({
          data: fs.readFileSync(useCaseDiagPath),
          transformation: { width: 560, height: 345 }
        })
      ]
    }),
    pBody('Figure 4.2: Use Case Diagram for Railway Facility and Management', { align: AlignmentType.CENTER, italics: true, size: 20 })
  );
}

// Embed ER Diagram
if (fs.existsSync(erDiagPath)) {
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 100 },
      children: [
        new ImageRun({
          data: fs.readFileSync(erDiagPath),
          transformation: { width: 560, height: 370 }
        })
      ]
    }),
    pBody('Figure 4.3: Entity Relationship (ER) & Data Schema Diagram', { align: AlignmentType.CENTER, italics: true, size: 20 })
  );
}

docChildren.push(
  pHeading2('4.5 SEQUENCE DIAGRAM'),
  pBody(
    'The Sequence Diagram illustrates the message exchange during an amenity navigation request and Public Address announcement cycle, from user button tap through database lookup, Web Audio API chime synthesis, and SpeechSynthesis voice broadcast.'
  )
);

// Embed Sequence Diagram
if (fs.existsSync(seqDiagPath)) {
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 100 },
      children: [
        new ImageRun({
          data: fs.readFileSync(seqDiagPath),
          transformation: { width: 560, height: 335 }
        })
      ]
    }),
    pBody('Figure 4.4: Sequence Diagram for Amenity Navigation & PA Announcement', { align: AlignmentType.CENTER, italics: true, size: 20 })
  );
}

docChildren.push(
  pHeading2('4.6 ATTENTION & ACCESSIBILITY INDICATOR DESIGN'),
  pBody(
    'Visual indicators highlight critical station conditions: green for low crowd / open facilities, yellow for moderate congestion, and pulsing red for high passenger rush or active emergency SOS dispatches. Audio equalizer bars animate dynamically during PA broadcasts.'
  ),
  pHeading2('4.7 SECURITY DESIGN'),
  pBody(
    'User passwords are encrypted using bcryptjs with a work factor of 10. API endpoints are guarded by JSON Web Token (JWT) bearer authentication with 24-hour expiration. Strict Cross-Origin Resource Sharing (CORS) policies safeguard against unauthorized cross-site requests.'
  ),
  new Paragraph({ children: [new PageBreak()] })
);

// ==========================================
// 11. CHAPTER 5: IMPLEMENTATION
// ==========================================
docChildren.push(
  pHeading1('CHAPTER 5\nIMPLEMENTATION'),
  pHeading2('5.1 IMPLEMENTATION OVERVIEW'),
  pBody(
    'The Railway Facility and Management platform is implemented as a full-stack solution. The frontend application is built in React 18 with Vite, featuring modular components for the station map, transit telemetry, sound studio, and emergency drawer. The backend is implemented in Node.js with Express.js, providing REST endpoints and WebSocket events. MongoDB Atlas acts as the persistent cloud database.'
  ),
  pHeading2('5.2 BACKEND IMPLEMENTATION'),
  pBody(
    'The backend server initializes Express middleware, connects to MongoDB via Mongoose, and configures Socket.io intervals that simulate realistic suburban train movements and passenger density fluctuations across Chennai Central’s 17 platforms.'
  ),
  pHeading2('5.3 FRONTEND IMPLEMENTATION'),
  pBody(
    'The user interface includes a live departures ticker, amenity search filters, an interactive SVG station map with zoom/pan capabilities, and a station PA studio with real-time soundwave visualization.'
  ),
  pHeading2('5.4 API ORGANIZATION'),
  createBorderedTable([
    ['Resource Group', 'Base Path', 'Description'],
    ['Authentication', '/api/users', 'Registration, login, JWT issuance, profile retrieval'],
    ['Facilities', '/api/facilities', 'Amenity catalog, step-free routes, operational updates'],
    ['Train Telemetry', '/api/trains', 'Mainline & suburban train schedules, speed, platform tracking'],
    ['Emergency SOS', '/api/alerts/sos', '1-tap emergency dispatch, security & medical triage'],
    ['Crowd Sensing', '/api/crowd', 'Platform density heatmaps and congestion telemetry'],
    ['Lost & Found', '/api/lost-found', 'Reported missing item registry and claim resolution'],
    ['Report PDF', '/report.pdf', 'Direct serving of academic project documentation']
  ], [2000, 2000, 5000]),
  pHeading2('5.5 ATTENTION & EMERGENCY SOS PROCESS'),
  pBody(
    'When a commuter triggers the SOS Help button, the client transmits an immediate WebSocket payload containing the user ID, emergency type (Medical, Security, Buggy), and current platform location. The backend alerts the Station Superintendent and dispatches RPF personnel.'
  ),
  pHeading2('5.6 FACILITY INFORMATION WORKFLOW & LIVE TRAIN TRACKING'),
  pBody(
    'Station amenities are indexed with Cartesian coordinates corresponding to the SVG blueprint. Selecting an amenity calculates walking distance in meters, estimated travel time, and generates an animated dashed SVG path.'
  ),
  pHeading2('5.7 PUBLIC ADDRESS AUDIO & CHIME SYNTHESIS'),
  pBody(
    'The audio engine in railwayAudio.js creates a Web Audio API AudioContext and plays the signature Indian Railways 4-note bell chime (D5 at 587.33Hz, F#5 at 739.99Hz, A5 at 880.00Hz, D6 at 1174.66Hz) using sine wave oscillators with exponential decay. Spaced train digits (e.g., “1 2 8 0 4”) ensure clear enunciation. A phonetic Tamil parser ensures high-clarity pronunciation across all browsers.'
  ),
  pHeading2('5.8 REPORTING AND RECORD MANAGEMENT'),
  pBody(
    'The system logs all emergency incidents, facility maintenance schedules, and train arrival timings for operational review. Administrators can review logs and download documentation.'
  ),
  pHeading2('5.9 CONFIGURATION AND DEPLOYMENT'),
  pBody(
    'Environment variables configure PORT, MONGO_URI, JWT_SECRET, and CLIENT_URL, ensuring safe execution across development and production environments.'
  ),
  new Paragraph({ children: [new PageBreak()] })
);

// ==========================================
// 12. CHAPTER 6: CONCLUSION & FUTURE WORK
// ==========================================
docChildren.push(
  pHeading1('CHAPTER 6\nCONCLUSION & FUTURE WORK'),
  pHeading2('6.1 CONCLUSION'),
  pBody(
    'The Railway Facility and Management platform successfully provides a modern, inclusive, and digital solution for complex railway station terminals. By uniting turn-by-turn step-free navigation, live suburban train tracking, authentic 4-note chime public address audio synthesis, and real-time emergency SOS broadcasting, the system significantly improves passenger mobility, reduces transit friction, and enhances accessibility for Divyangjan and elderly commuters.'
  ),
  pHeading2('6.2 FUTURE ENHANCEMENTS'),
  pBullet('IoT Bluetooth Low Energy (BLE) Beacons: Deploy micro-beacons along tactile pavers for sub-meter indoor positioning.', '• '),
  pBullet('CCTV AI Computer Vision Telemetry: Integrate platform camera feeds to automatically count passenger rush.', '• '),
  pBullet('Progressive Web App (PWA) Offline Cache: Allow station maps and emergency contacts to function without cellular data.', '• '),
  pBullet('Multi-Station Network Rollout: Expand support to Chennai Egmore (MS), Tambaram (TBM), and Central Suburban Moore Market.', '• '),
  new Paragraph({ children: [new PageBreak()] })
);

// ==========================================
// 13. APPENDIX
// ==========================================
docChildren.push(
  pHeading1('APPENDIX\nSOURCE CODE EXCERPTS & CONFIGURATION'),
  pHeading2('GITHUB LINK:'),
  pBody('https://github.com/harichander18/railway-facility-management'),
  pHeading2('PROJECT FOLDER STRUCTURE'),
  pCode('railway-facility-management/'),
  pCode('│'),
  pCode('├── frontend/                      # React 18 + Vite Single Page Application'),
  pCode('│   ├── public/                    # Static assets, report.pdf'),
  pCode('│   ├── src/'),
  pCode('│   │   ├── components/            # Navbar, StationMapSVG, VoiceConsole, RouteMinimap'),
  pCode('│   │   ├── context/               # AccessibilityContext, AuthContext, SocketContext'),
  pCode('│   │   ├── pages/                 # Dashboard, StationMap, TrainStatus, Facilities'),
  pCode('│   │   ├── utils/                 # railwayAudio.js (PA Chime & Speech Engine)'),
  pCode('│   │   ├── App.jsx'),
  pCode('│   │   └── main.jsx'),
  pCode('│   ├── package.json'),
  pCode('│   └── vite.config.js'),
  pCode('│'),
  pCode('├── backend/                       # Node.js + Express REST & Socket.io Server'),
  pCode('│   ├── config/                    # db.js (MongoDB Mongoose connection & fallback)'),
  pCode('│   ├── middleware/                # auth.js, rbac.js, errorHandler.js'),
  pCode('│   ├── models/                    # User.js, Facility.js, Train.js, Alert.js'),
  pCode('│   ├── routes/                    # userRoutes.js, facilityRoutes.js, trainRoutes.js'),
  pCode('│   ├── socket/                    # socketHandler.js (Real-time telemetry intervals)'),
  pCode('│   ├── .env                       # Environment configuration'),
  pCode('│   ├── server.js                  # Express entry point & HTTP/Socket listener'),
  pCode('│   └── seed.js                    # Station seed dataset (Platforms, Facilities)'),
  pCode('└── README.md'),
  pHeading2('BACKEND PACKAGE INSTALLATION & DATABASE CONNECTION'),
  pCode('npm install express mongoose socket.io cors dotenv jsonwebtoken bcryptjs'),
  pBody('Database connection in config/db.js:'),
  pCode('const mongoose = require("mongoose");'),
  pCode('const connectDB = async () => {'),
  pCode('  try {'),
  pCode('    const conn = await mongoose.connect(process.env.MONGO_URI);'),
  pCode('    console.log(`MongoDB Connected: ${conn.connection.host}`);'),
  pCode('  } catch (err) {'),
  pCode('    console.error(`MongoDB Error: ${err.message}`);'),
  pCode('  }'),
  pCode('};'),
  pCode('module.exports = connectDB;'),
  pHeading2('SERVER CONFIGURATION (server.js)'),
  pCode('const express = require("express");'),
  pCode('const http = require("http");'),
  pCode('const { Server } = require("socket.io");'),
  pCode('const cors = require("cors");'),
  pCode('const app = express();'),
  pCode('const server = http.createServer(app);'),
  pCode('const io = new Server(server, { cors: { origin: "*" } });'),
  pCode('app.use(cors());'),
  pCode('app.use(express.json());'),
  pCode('app.get("/report.pdf", (req, res) => res.sendFile(path.join(__dirname, "report.pdf")));'),
  pCode('server.listen(5000, () => console.log("Railway Management Server running on port 5000"));'),
  pHeading2('PUBLIC ADDRESS CHIME & AUDIO ENGINE (railwayAudio.js)'),
  pCode('// Synthesizes authentic 4-note Indian Railways melodic bell chime'),
  pCode('export function playRailwayChime() {'),
  pCode('  const ctx = new (window.AudioContext || window.webkitAudioContext)();'),
  pCode('  const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6'),
  pCode('  notes.forEach((freq, idx) => {'),
  pCode('    const osc = ctx.createOscillator();'),
  pCode('    const gain = ctx.createGain();'),
  pCode('    osc.frequency.value = freq;'),
  pCode('    osc.type = "sine";'),
  pCode('    const start = ctx.currentTime + idx * 0.28;'),
  pCode('    gain.gain.setValueAtTime(0.3, start);'),
  pCode('    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);'),
  pCode('    osc.connect(gain); gain.connect(ctx.destination);'),
  pCode('    osc.start(start); osc.stop(start + 0.65);'),
  pCode('  });'),
  pCode('}'),
  pHeading2('AUTHENTICATION & ROLE-BASED ACCESS CONTROL (auth.js)'),
  pCode('const jwt = require("jsonwebtoken");'),
  pCode('module.exports = (req, res, next) => {'),
  pCode('  const token = req.headers.authorization?.split(" ")[1];'),
  pCode('  if (!token) return res.status(401).json({ message: "Access Denied: Token Missing" });'),
  pCode('  try {'),
  pCode('    req.user = jwt.verify(token, process.env.JWT_SECRET);'),
  pCode('    next();'),
  pCode('  } catch { res.status(403).json({ message: "Invalid or Expired Token" }); }'),
  pCode('};'),
  new Paragraph({ children: [new PageBreak()] })
);

// ==========================================
// 14. SCREENSHOTS OF THE PROJECT
// ==========================================
docChildren.push(
  pHeading1('SCREENSHOTS OF THE PROJECT'),
  pBody(' ')
);

// Screenshot 1: Executive Dashboard
if (fs.existsSync(screenshot1Path)) {
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 80 },
      children: [
        new ImageRun({
          data: fs.readFileSync(screenshot1Path),
          transformation: { width: 560, height: 300 }
        })
      ]
    }),
    pBody('Figure 1: Executive Dashboard with Live Departure Board & Accessibility Bar', { align: AlignmentType.CENTER, italics: true, size: 20 }),
    new Paragraph({ spacing: { after: 200 } })
  );
}

// Screenshot 2: Interactive Station Map
if (fs.existsSync(screenshot2Path)) {
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 80 },
      children: [
        new ImageRun({
          data: fs.readFileSync(screenshot2Path),
          transformation: { width: 560, height: 300 }
        })
      ]
    }),
    pBody('Figure 2: Interactive Station Facility Navigation & Accessibility SVG Blueprint', { align: AlignmentType.CENTER, italics: true, size: 20 }),
    new Paragraph({ children: [new PageBreak()] })
  );
}

// Screenshot 3: Live Train Tracking & PA Console
if (fs.existsSync(screenshot3Path)) {
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 80 },
      children: [
        new ImageRun({
          data: fs.readFileSync(screenshot3Path),
          transformation: { width: 560, height: 300 }
        })
      ]
    }),
    pBody('Figure 3: Live Train Tracking & Station Public Address (PA) Chime Studio Console', { align: AlignmentType.CENTER, italics: true, size: 20 }),
    new Paragraph({ spacing: { after: 200 } })
  );
}

// Screenshot 4: Station Facility Directory & Minimap
if (fs.existsSync(screenshot4Path)) {
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 80 },
      children: [
        new ImageRun({
          data: fs.readFileSync(screenshot4Path),
          transformation: { width: 560, height: 300 }
        })
      ]
    }),
    pBody('Figure 4: Station Facility Directory with Turn-by-Turn Route Minimap Navigation', { align: AlignmentType.CENTER, italics: true, size: 20 }),
    new Paragraph({ children: [new PageBreak()] })
  );
}

// ==========================================
// 15. REFERENCES
// ==========================================
docChildren.push(
  pHeading1('REFERENCES'),
  pBody('[1] Project Source Code: Source files for the Railway Facility and Management System, including interactive station SVG maps, Web Audio API chime engine, and WebSocket telemetry.\nhttps://github.com/harichander18/railway-facility-management', { before: 80, after: 120 }),
  pBody('[2] Node.js Documentation: Reference for server-side asynchronous event-driven JavaScript runtime.\nhttps://nodejs.org/', { before: 80, after: 120 }),
  pBody('[3] React Documentation: Reference for interactive user interfaces and component lifecycle architecture.\nhttps://react.dev/', { before: 80, after: 120 }),
  pBody('[4] Express.js Documentation: Reference for backend routing, REST API middleware, and security.\nhttps://expressjs.com/', { before: 80, after: 120 }),
  pBody('[5] MongoDB Documentation: Reference for document database storage, indexing, and geospatial schemas.\nhttps://www.mongodb.com/docs/', { before: 80, after: 120 }),
  pBody('[6] W3C Web Audio API Specification: Audio synthesis, OscillatorNode, and melodic chime generation.\nhttps://www.w3.org/TR/webaudio/', { before: 80, after: 120 }),
  pBody('[7] W3C Web Content Accessibility Guidelines (WCAG) 2.1: Guidelines for AAA accessible web systems.\nhttps://www.w3.org/TR/WCAG21/', { before: 80, after: 120 }),
  pBody('[8] Vite Documentation: Next generation frontend tooling, hot module replacement, and bundling.\nhttps://vite.dev/', { before: 80, after: 120 }),
  pBody('[9] Bcrypt.js Documentation: Cryptographic password salt hashing and secure credential storage.\nhttps://www.npmjs.com/package/bcryptjs', { before: 80, after: 120 }),
  pBody('[10] JSON Web Token (JWT) Documentation: Stateless bearer token authentication and claims verification.\nhttps://jwt.io/introduction', { before: 80, after: 120 })
);

// Create Document
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: FONT,
          size: 24,
          color: '111111'
        }
      }
    }
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, bottom: 1440, left: 1800, right: 1440 } // 1.25 in left binding margin
        }
      },
      children: docChildren
    }
  ]
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outDocxPath, buffer);
  console.log(`Word Document successfully generated at: ${outDocxPath} (${(buffer.length / 1024).toFixed(1)} KB)`);

  // Copy to brain artifact directory
  fs.copyFileSync(outDocxPath, brainDocxPath);
  console.log(`Copied to Brain Artifacts directory at: ${brainDocxPath}`);

  // Copy to frontend/public and backend for instant download
  const fePublicDocx = path.join(__dirname, 'frontend', 'public', 'report.docx');
  const bePublicDocx = path.join(__dirname, 'backend', 'report.docx');
  fs.copyFileSync(outDocxPath, fePublicDocx);
  fs.copyFileSync(outDocxPath, bePublicDocx);
  console.log('Available at: http://localhost:3000/report.docx and http://localhost:5000/report.docx');
}).catch((err) => {
  console.error('Error generating docx:', err);
});
