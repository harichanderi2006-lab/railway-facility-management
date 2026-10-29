const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const diagDir = path.join(__dirname, 'report_assets');
if (!fs.existsSync(diagDir)) fs.mkdirSync(diagDir, { recursive: true });

function renderHtmlToPng(htmlContent, outPngName, width, height) {
  const tmpHtml = path.join(diagDir, `${outPngName}.html`);
  const outPng = path.join(diagDir, `${outPngName}.png`);
  fs.writeFileSync(tmpHtml, htmlContent, 'utf8');

  const fileUrl = 'file:///' + tmpHtml.replace(/\\/g, '/').replace(/ /g, '%20');
  spawnSync(edgePath, [
    '--headless=new',
    '--disable-gpu',
    `--screenshot=${outPng}`,
    `--window-size=${width},${height}`,
    fileUrl
  ]);

  if (fs.existsSync(outPng)) {
    console.log(`Successfully generated: ${outPngName}.png (${(fs.statSync(outPng).size / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`Failed to generate: ${outPngName}.png`);
  }
}

// 1. College Crest / Seal
const collegeLogoHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 10px; background: #ffffff; display: flex; justify-content: center; align-items: center; }
</style>
</head>
<body>
<svg width="220" height="220" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f2744;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e3a8a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Outer double ring -->
  <circle cx="100" cy="100" r="92" fill="#ffffff" stroke="#0f2744" stroke-width="4"/>
  <circle cx="100" cy="100" r="84" fill="#ffffff" stroke="#1e3a8a" stroke-width="2" stroke-dasharray="4,3"/>
  <circle cx="100" cy="100" r="66" fill="#f8fafc" stroke="#0f2744" stroke-width="2"/>
  
  <!-- College text curved/styled -->
  <path id="curveTop" d="M 28 100 A 72 72 0 0 1 172 100" fill="none" stroke="none" />
  <text font-family="'Times New Roman', serif" font-size="11.5" font-weight="bold" fill="#0f2744">
    <textPath href="#curveTop" startOffset="50%" text-anchor="middle">
      EASWARI ENGINEERING COLLEGE
    </textPath>
  </text>
  
  <path id="curveBottom" d="M 170 105 A 72 72 0 0 1 30 105" fill="none" stroke="none" />
  <text font-family="'Times New Roman', serif" font-size="10" font-weight="bold" fill="#1e3a8a">
    <textPath href="#curveBottom" startOffset="50%" text-anchor="middle">
      AUTONOMOUS • CHENNAI
    </textPath>
  </text>
  
  <!-- Center Shield -->
  <path d="M 70 65 L 130 65 L 130 105 Q 130 135 100 148 Q 70 135 70 105 Z" fill="#0f2744" stroke="#f59e0b" stroke-width="2.5"/>
  
  <!-- Temple Gopuram / Lamp of Knowledge -->
  <path d="M 90 120 L 110 120 L 100 95 Z" fill="#f59e0b" />
  <path d="M 93 95 L 107 95 L 100 78 Z" fill="#fcd34d" />
  <circle cx="100" cy="74" r="3.5" fill="#ef4444" />
  
  <!-- Gear / Wheel of Technology -->
  <circle cx="100" cy="105" r="16" fill="none" stroke="#60a5fa" stroke-width="2" stroke-dasharray="4,2"/>
  <circle cx="100" cy="105" r="7" fill="#ffffff" />
  <circle cx="100" cy="105" r="3" fill="#0f2744" />
  
  <text x="100" y="166" font-family="'Times New Roman', serif" font-size="8" font-weight="bold" fill="#475569" text-anchor="middle">ESTD 1996</text>
</svg>
</body>
</html>`;
renderHtmlToPng(collegeLogoHtml, 'college_logo', 260, 260);

// 2. System Architecture Diagram (Three-Tier MERN Architecture)
const archHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 25px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #ffffff; width: 950px; }
  .title { text-align: center; font-size: 20px; font-weight: bold; color: #0f2744; margin-bottom: 25px; border-bottom: 2px solid #0f2744; padding-bottom: 8px; }
  .tier-container { display: flex; flex-direction: column; gap: 18px; }
  .tier { border-radius: 8px; padding: 15px 20px; border: 2px solid; position: relative; }
  .tier-header { font-size: 16px; font-weight: bold; display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .badge { padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
  .components { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .card { background: #ffffff; border-radius: 6px; padding: 10px 12px; border: 1px solid rgba(0,0,0,0.1); box-shadow: 0 2px 4px rgba(0,0,0,0.04); font-size: 12px; }
  .card-title { font-weight: bold; margin-bottom: 4px; color: #1e293b; font-size: 13px; }
  .card-desc { color: #64748b; font-size: 11px; line-height: 1.3; }
  
  /* Tier 1: Client */
  .t1 { background: #f0f7ff; border-color: #3b82f6; }
  .t1 .tier-header { color: #1d4ed8; }
  .t1 .badge { background: #dbeafe; color: #1e40af; }
  
  /* Tier 2: Presentation */
  .t2 { background: #f5f3ff; border-color: #8b5cf6; }
  .t2 .tier-header { color: #6d28d9; }
  .t2 .badge { background: #ede9fe; color: #5b21b6; }
  
  /* Tier 3: Application & Logic */
  .t3 { background: #ecfdf5; border-color: #10b981; }
  .t3 .tier-header { color: #047857; }
  .t3 .badge { background: #d1fae5; color: #065f46; }
  
  /* Tier 4: Database & Storage */
  .t4 { background: #fffbeb; border-color: #f59e0b; }
  .t4 .tier-header { color: #b45309; }
  .t4 .badge { background: #fef3c7; color: #92400e; }
  
  .flow-arrow { text-align: center; color: #64748b; font-size: 18px; font-weight: bold; margin: -8px 0; }
</style>
</head>
<body>
  <div class="title">FIGURE 4.1: SYSTEM ARCHITECTURE - RAILWAY FACILITY AND MANAGEMENT</div>
  
  <div class="tier-container">
    <!-- Tier 1: User Personas -->
    <div class="tier t1">
      <div class="tier-header">
        <span>👤 User & Client Presentation Layer</span>
        <span class="badge">Client Endpoints</span>
      </div>
      <div class="components">
        <div class="card"><div class="card-title">General Passengers</div><div class="card-desc">Interactive terminal navigation & departure schedules</div></div>
        <div class="card"><div class="card-title">♿ Divyangjan Commuters</div><div class="card-desc">Step-free tactile minimaps & wheelchair buggy booking</div></div>
        <div class="card"><div class="card-title">🚉 Station Superintendent</div><div class="card-desc">Real-time crowd tracking & facility dispatch logs</div></div>
        <div class="card"><div class="card-title">👮 Railway Police (RPF)</div><div class="card-desc">Instant 1-tap SOS triage & security alert broadcast</div></div>
      </div>
    </div>
    
    <div class="flow-arrow">⬇ ⬆ (HTTP/HTTPS REST & WebSocket Bi-Directional Full-Duplex Stream)</div>
    
    <!-- Tier 2: Frontend Single Page Application -->
    <div class="tier t2">
      <div class="tier-header">
        <span>⚛️ Frontend Web Architecture (React 18 + Vite)</span>
        <span class="badge">Presentation Framework</span>
      </div>
      <div class="components">
        <div class="card"><div class="card-title">🗺️ Interactive SVG Map</div><div class="card-desc">17 platforms, concourses, lifts & tactile path overlays</div></div>
        <div class="card"><div class="card-title">🔔 Web Audio PA Studio</div><div class="card-desc">Synthesized 4-note chime (D5-F#5-A5-D6) & trilingual voice</div></div>
        <div class="card"><div class="card-title">🚆 Suburban Transit Tracker</div><div class="card-desc">GPS telemetry across 4 arterial corridors (92 km/h)</div></div>
        <div class="card"><div class="card-title">👁️ WCAG AAA Accessibility</div><div class="card-desc">Yellow-on-black high contrast, large typography, voice guide</div></div>
      </div>
    </div>
    
    <div class="flow-arrow">⬇ ⬆ (JSON Payload / JWT Bearer Tokens / Socket.io Events)</div>
    
    <!-- Tier 3: Application Server & Middleware -->
    <div class="tier t3">
      <div class="tier-header">
        <span>⚙️ Application & Business Logic Tier (Node.js + Express.js)</span>
        <span class="badge">Backend Services</span>
      </div>
      <div class="components">
        <div class="card"><div class="card-title">🔐 JWT & RBAC Auth</div><div class="card-desc">Bcryptjs password hashing & role-based route guard</div></div>
        <div class="card"><div class="card-title">📍 Facility Router</div><div class="card-desc">Turn-by-turn route coordinates & crowd status API</div></div>
        <div class="card"><div class="card-title">📡 Live Socket.io Engine</div><div class="card-desc">Passenger density broadcasts & emergency SOS relay</div></div>
        <div class="card"><div class="card-title">🚆 Telemetry Scheduler</div><div class="card-desc">Train arrival, delay, speed, and platform assigner</div></div>
      </div>
    </div>
    
    <div class="flow-arrow">⬇ ⬆ (Mongoose ODM / TCP Connection Pool)</div>
    
    <!-- Tier 4: Database Storage Tier -->
    <div class="tier t4">
      <div class="tier-header">
        <span>🍃 Database & Persistence Tier (MongoDB Atlas / Local DB)</span>
        <span class="badge">Document Store</span>
      </div>
      <div class="components">
        <div class="card"><div class="card-title">Users Collection</div><div class="card-desc">Passenger & staff credentials, profiles, roles</div></div>
        <div class="card"><div class="card-title">Facilities Collection</div><div class="card-desc">Restrooms, clinics, buggies, elevators, coordinates</div></div>
        <div class="card"><div class="card-title">Trains Collection</div><div class="card-desc">Train numbers, routes, live delays, platform IDs</div></div>
        <div class="card"><div class="card-title">Alerts & Logs</div><div class="card-desc">Emergency SOS events, lost & found, audit logs</div></div>
      </div>
    </div>
  </div>
</body>
</html>`;
renderHtmlToPng(archHtml, 'architecture_diagram', 1000, 720);

// 3. Use Case Diagram
const useCaseHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 25px; font-family: 'Segoe UI', Arial, sans-serif; background: #ffffff; width: 950px; }
  .title { text-align: center; font-size: 20px; font-weight: bold; color: #0f2744; margin-bottom: 20px; border-bottom: 2px solid #0f2744; padding-bottom: 8px; }
  .canvas { display: flex; justify-content: space-between; align-items: stretch; border: 2px solid #cbd5e1; border-radius: 10px; padding: 20px; background: #fdfefe; }
  .actor-column { width: 140px; display: flex; flex-direction: column; justify-content: space-around; align-items: center; }
  .actor { text-align: center; padding: 10px; background: #f8fafc; border: 1.5px solid #94a3b8; border-radius: 8px; width: 110px; }
  .actor-icon { font-size: 32px; margin-bottom: 4px; }
  .actor-name { font-size: 12px; font-weight: bold; color: #1e293b; }
  
  .system-box { flex: 1; margin: 0 20px; border: 2px dashed #3b82f6; border-radius: 8px; padding: 15px 25px; background: #ffffff; }
  .system-title { text-align: center; font-weight: bold; font-size: 14px; color: #1d4ed8; margin-bottom: 15px; letter-spacing: 0.5px; }
  .use-cases { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .uc { border: 1.5px solid #2563eb; background: #eff6ff; border-radius: 20px; padding: 9px 14px; text-align: center; font-size: 12px; font-weight: 600; color: #1e40af; box-shadow: 0 1px 3px rgba(37,99,235,0.1); }
  .uc.highlight { border-color: #dc2626; background: #fef2f2; color: #991b1b; }
  .uc.audio { border-color: #d97706; background: #fffbeb; color: #92400e; }
  .uc.admin { border-color: #059669; background: #ecfdf5; color: #065f46; }
</style>
</head>
<body>
  <div class="title">FIGURE 4.2: USE CASE DIAGRAM - RAILWAY FACILITY AND MANAGEMENT</div>
  
  <div class="canvas">
    <!-- Left Actors: Commuters -->
    <div class="actor-column">
      <div class="actor">
        <div class="actor-icon">🧑</div>
        <div class="actor-name">General Commuter</div>
      </div>
      <div class="actor">
        <div class="actor-icon">♿</div>
        <div class="actor-name">Divyangjan Passenger</div>
      </div>
    </div>
    
    <!-- System Boundary -->
    <div class="system-box">
      <div class="system-title">🏛️ SYSTEM BOUNDARY: RAILWAY FACILITY & MANAGEMENT PLATFORM</div>
      <div class="use-cases">
        <div class="uc">UC-1: Search Station Amenities & Facilities</div>
        <div class="uc">UC-2: View Interactive SVG Terminal Blueprint</div>
        <div class="uc">UC-3: Navigate Step-Free Tactile Route Minimap</div>
        <div class="uc">UC-4: Track Live Suburban & Mainline Train GPS</div>
        <div class="uc audio">UC-5: Synthesize 4-Note Chime & Audio Announcement</div>
        <div class="uc audio">UC-6: Select Female / Male Voice Profile (HI/TA/EN)</div>
        <div class="uc">UC-7: Check Real-Time Platform Crowd Heatmap</div>
        <div class="uc highlight">UC-8: Trigger Instant Emergency SOS Assistance</div>
        <div class="uc">UC-9: Report & Search Lost & Found Articles</div>
        <div class="uc">UC-10: Toggle WCAG AAA High-Contrast Display</div>
        <div class="uc admin">UC-11: Update Facility Operational Status & Lifts</div>
        <div class="uc admin">UC-12: Broadcast Station Security Alerts (RPF/Superintendent)</div>
      </div>
    </div>
    
    <!-- Right Actors: Staff & Admin -->
    <div class="actor-column">
      <div class="actor">
        <div class="actor-icon">👨‍✈️</div>
        <div class="actor-name">Station Staff / Sahayak</div>
      </div>
      <div class="actor">
        <div class="actor-icon">🛡️</div>
        <div class="actor-name">RPF & System Admin</div>
      </div>
    </div>
  </div>
</body>
</html>`;
renderHtmlToPng(useCaseHtml, 'usecase_diagram', 1000, 600);

// 4. Entity Relationship (ER) & Class Diagram
const erHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 25px; font-family: 'Consolas', 'Segoe UI', monospace; background: #ffffff; width: 950px; }
  .title { text-align: center; font-family: 'Segoe UI', sans-serif; font-size: 20px; font-weight: bold; color: #0f2744; margin-bottom: 20px; border-bottom: 2px solid #0f2744; padding-bottom: 8px; }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .entity { border: 2px solid #0f2744; border-radius: 6px; overflow: hidden; background: #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.06); font-size: 11px; }
  .entity-header { background: #0f2744; color: #ffffff; padding: 7px 10px; font-weight: bold; font-size: 13px; text-align: center; font-family: 'Segoe UI', sans-serif; }
  .entity-header.train { background: #b45309; }
  .entity-header.alert { background: #b91c1c; }
  .entity-header.sos { background: #4c1d95; }
  .entity-body { padding: 8px 10px; }
  .attr { padding: 3px 0; border-bottom: 1px dashed #e2e8f0; display: flex; justify-content: space-between; }
  .attr:last-child { border-bottom: none; }
  .pk { font-weight: bold; color: #dc2626; }
  .fk { font-weight: bold; color: #2563eb; }
  .type { color: #64748b; font-size: 10px; }
  .rel-banner { grid-column: span 3; text-align: center; font-family: 'Segoe UI', sans-serif; font-size: 12px; color: #475569; padding: 6px; background: #f1f5f9; border-radius: 4px; border: 1px solid #cbd5e1; }
</style>
</head>
<body>
  <div class="title">FIGURE 4.3: ENTITY RELATIONSHIP (ER) & DATA SCHEMA DIAGRAM</div>
  
  <div class="grid">
    <!-- User Entity -->
    <div class="entity">
      <div class="entity-header">USER (Passenger / Staff)</div>
      <div class="entity-body">
        <div class="attr"><span class="pk">PK _id</span> <span class="type">ObjectId</span></div>
        <div class="attr"><span>name</span> <span class="type">String</span></div>
        <div class="attr"><span>email</span> <span class="type">String (Unique)</span></div>
        <div class="attr"><span>passwordHash</span> <span class="type">String (Bcrypt)</span></div>
        <div class="attr"><span>phone</span> <span class="type">String</span></div>
        <div class="attr"><span>role</span> <span class="type">Enum [passenger, staff, admin]</span></div>
        <div class="attr"><span>isDivyangjan</span> <span class="type">Boolean</span></div>
        <div class="attr"><span>preferredLang</span> <span class="type">Enum [hi, ta, en]</span></div>
        <div class="attr"><span>createdAt</span> <span class="type">Date</span></div>
      </div>
    </div>
    
    <!-- Facility Entity -->
    <div class="entity">
      <div class="entity-header">FACILITY (Station Amenity)</div>
      <div class="entity-body">
        <div class="attr"><span class="pk">PK _id</span> <span class="type">ObjectId</span></div>
        <div class="attr"><span>facilityCode</span> <span class="type">String ("RESTROOM-1")</span></div>
        <div class="attr"><span>name</span> <span class="type">String</span></div>
        <div class="attr"><span>category</span> <span class="type">Enum [Restroom, Medical, Buggy, Lift]</span></div>
        <div class="attr"><span>platformNo</span> <span class="type">Number (1..17)</span></div>
        <div class="attr"><span>coordinates</span> <span class="type">Object {x, y, floor}</span></div>
        <div class="attr"><span>isWheelchairAccessible</span> <span class="type">Boolean</span></div>
        <div class="attr"><span>crowdDensity</span> <span class="type">Enum [Low, Moderate, High]</span></div>
        <div class="attr"><span>status</span> <span class="type">Enum [Operational, Closed]</span></div>
      </div>
    </div>
    
    <!-- Train Entity -->
    <div class="entity">
      <div class="entity-header train">TRAIN (Mainline & Suburban)</div>
      <div class="entity-body">
        <div class="attr"><span class="pk">PK _id</span> <span class="type">ObjectId</span></div>
        <div class="attr"><span>trainNumber</span> <span class="type">String ("12804")</span></div>
        <div class="attr"><span>trainName</span> <span class="type">String ("Swarna Jayanti")</span></div>
        <div class="attr"><span>originStation</span> <span class="type">String ("NZM")</span></div>
        <div class="attr"><span>destinationStation</span> <span class="type">String ("VSKP")</span></div>
        <div class="attr"><span>platformAssigned</span> <span class="type">Number (3)</span></div>
        <div class="attr"><span>scheduledDeparture</span> <span class="type">Date / Time</span></div>
        <div class="attr"><span>currentSpeed</span> <span class="type">Number (km/h)</span></div>
        <div class="attr"><span>liveTelemetry</span> <span class="type">Object {corridor, lat, lng}</span></div>
        <div class="attr"><span>status</span> <span class="type">Enum [On Time, Delayed]</span></div>
      </div>
    </div>
    
    <!-- Relationship summary -->
    <div class="rel-banner">
      🔗 Relationships: User 1:N Dispatches EmergencyAlert • Facility 1:N Associated With Platform • Train 1:N Broadcasts PA Announcements • Alert 1:N Consumed By Clients
    </div>
    
    <!-- Emergency SOS Alert Entity -->
    <div class="entity">
      <div class="entity-header sos">EMERGENCY SOS ALERT</div>
      <div class="entity-body">
        <div class="attr"><span class="pk">PK _id</span> <span class="type">ObjectId</span></div>
        <div class="attr"><span class="fk">FK reportedBy</span> <span class="type">ObjectId (Ref: User)</span></div>
        <div class="attr"><span>emergencyType</span> <span class="type">Enum [Medical, Security, Buggy]</span></div>
        <div class="attr"><span>platformNo</span> <span class="type">Number</span></div>
        <div class="attr"><span>locationDesc</span> <span class="type">String</span></div>
        <div class="attr"><span>resolvedStatus</span> <span class="type">Enum [Pending, Dispatched, Resolved]</span></div>
        <div class="attr"><span>dispatchedUnit</span> <span class="type">String ("RPF Patrol / Sahayak")</span></div>
        <div class="attr"><span>timestamp</span> <span class="type">Date</span></div>
      </div>
    </div>
    
    <!-- Station Alert Entity -->
    <div class="entity">
      <div class="entity-header alert">STATION BROADCAST ALERT</div>
      <div class="entity-body">
        <div class="attr"><span class="pk">PK _id</span> <span class="type">ObjectId</span></div>
        <div class="attr"><span>title</span> <span class="type">String</span></div>
        <div class="attr"><span>message</span> <span class="type">String</span></div>
        <div class="attr"><span>severity</span> <span class="type">Enum [Info, Warning, Critical]</span></div>
        <div class="attr"><span>applicablePlatform</span> <span class="type">Number / "ALL"</span></div>
        <div class="attr"><span>isActive</span> <span class="type">Boolean</span></div>
        <div class="attr"><span>expireAt</span> <span class="type">Date</span></div>
      </div>
    </div>
    
    <!-- PA Voice Announcement Entity -->
    <div class="entity">
      <div class="entity-header">PA ANNOUNCEMENT LOG</div>
      <div class="entity-body">
        <div class="attr"><span class="pk">PK _id</span> <span class="type">ObjectId</span></div>
        <div class="attr"><span class="fk">FK trainId</span> <span class="type">ObjectId (Ref: Train)</span></div>
        <div class="attr"><span>chimeChords</span> <span class="type">Array ["D5","F#5","A5","D6"]</span></div>
        <div class="attr"><span>hindiScript</span> <span class="type">String ("यात्री कृपया ध्यान दें...")</span></div>
        <div class="attr"><span>tamilScript</span> <span class="type">String ("பயணிகள் கவனிக்கவும்...")</span></div>
        <div class="attr"><span>englishScript</span> <span class="type">String ("May I have your attention...")</span></div>
        <div class="attr"><span>voiceGender</span> <span class="type">Enum [Female, Male]</span></div>
        <div class="attr"><span>broadcastTime</span> <span class="type">Date</span></div>
      </div>
    </div>
  </div>
</body>
</html>`;
renderHtmlToPng(erHtml, 'er_diagram', 1000, 680);

// 5. Sequence Diagram
const seqHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 25px; font-family: 'Segoe UI', Arial, sans-serif; background: #ffffff; width: 950px; }
  .title { text-align: center; font-size: 20px; font-weight: bold; color: #0f2744; margin-bottom: 20px; border-bottom: 2px solid #0f2744; padding-bottom: 8px; }
  .seq-wrap { border: 2px solid #cbd5e1; border-radius: 8px; padding: 20px; background: #fafafa; }
  .lifelines { display: flex; justify-content: space-between; margin-bottom: 10px; }
  .lane { width: 155px; text-align: center; }
  .lane-box { background: #0f2744; color: #ffffff; font-weight: bold; padding: 8px 10px; border-radius: 6px; font-size: 12px; }
  .lane-box.react { background: #0284c7; }
  .lane-box.express { background: #059669; }
  .lane-box.mongo { background: #d97706; }
  .lane-box.audio { background: #7c3aed; }
  
  .timeline { border-left: 2px dashed #94a3b8; width: 0; height: 380px; margin: 0 auto; position: relative; }
  .msg-container { position: relative; height: 400px; margin-top: 15px; }
  
  .msg { position: absolute; height: 26px; display: flex; align-items: center; font-size: 11px; font-weight: 600; }
  .msg-line { height: 2px; background: #3b82f6; position: absolute; top: 12px; }
  .msg-line::after { content: "►"; position: absolute; right: -4px; top: -6px; font-size: 10px; color: #3b82f6; }
  .msg-line.ret { background: #64748b; border-top: 1px dashed #64748b; height: 0; }
  .msg-line.ret::after { content: "◄"; right: auto; left: -4px; color: #64748b; }
  .msg-text { background: #ffffff; padding: 1px 6px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 10.5px; z-index: 2; color: #1e293b; }
</style>
</head>
<body>
  <div class="title">FIGURE 4.4: SEQUENCE DIAGRAM - AMENITY NAVIGATION & PA BROADCAST</div>
  
  <div class="seq-wrap">
    <div class="lifelines">
      <div class="lane"><div class="lane-box">👤 Commuter / User</div></div>
      <div class="lane"><div class="lane-box react">⚛️ React Frontend</div></div>
      <div class="lane"><div class="lane-box express">⚙️ Express Backend</div></div>
      <div class="lane"><div class="lane-box mongo">🍃 MongoDB Database</div></div>
      <div class="lane"><div class="lane-box audio">🔔 Web Audio API / TTS</div></div>
    </div>
    
    <div class="msg-container">
      <!-- 1. Click Restroom 1 Minimap -->
      <div class="msg" style="top: 15px; left: 80px; width: 195px;">
        <div class="msg-line" style="width: 195px;"></div>
        <div class="msg-text" style="margin-left: 10px;">1. Tap Restroom 1 (Platform 1)</div>
      </div>
      
      <!-- 2. GET API call -->
      <div class="msg" style="top: 55px; left: 275px; width: 195px;">
        <div class="msg-line" style="width: 195px;"></div>
        <div class="msg-text" style="margin-left: 15px;">2. GET /api/facilities/restroom-1</div>
      </div>
      
      <!-- 3. Query DB -->
      <div class="msg" style="top: 95px; left: 470px; width: 195px;">
        <div class="msg-line" style="width: 195px;"></div>
        <div class="msg-text" style="margin-left: 20px;">3. findOne({ code: 'RESTROOM-1' })</div>
      </div>
      
      <!-- 4. Return data -->
      <div class="msg" style="top: 135px; left: 470px; width: 195px;">
        <div class="msg-line ret" style="width: 195px;"></div>
        <div class="msg-text" style="margin-left: 30px;">4. JSON: coordinates & status</div>
      </div>
      
      <!-- 5. Return to frontend -->
      <div class="msg" style="top: 175px; left: 275px; width: 195px;">
        <div class="msg-line ret" style="width: 195px;"></div>
        <div class="msg-text" style="margin-left: 25px;">5. 200 OK: Step-free tactile path</div>
      </div>
      
      <!-- 6. Synthesize chime -->
      <div class="msg" style="top: 220px; left: 275px; width: 580px;">
        <div class="msg-line" style="width: 580px; background: #7c3aed;"></div>
        <div class="msg-text" style="margin-left: 170px;">6. playChime(): 4-Note Melodic Bell (D5-F#5-A5-D6)</div>
      </div>
      
      <!-- 7. Speech announcement -->
      <div class="msg" style="top: 265px; left: 275px; width: 580px;">
        <div class="msg-line" style="width: 580px; background: #7c3aed;"></div>
        <div class="msg-text" style="margin-left: 150px;">7. speak(): Trilingual Voice (यात्री कृपया ध्यान दें... / தமிழ்)</div>
      </div>
      
      <!-- 8. Display animated minimap -->
      <div class="msg" style="top: 310px; left: 80px; width: 195px;">
        <div class="msg-line ret" style="width: 195px;"></div>
        <div class="msg-text" style="margin-left: 5px;">8. Render animated walking minimap & LED ticker</div>
      </div>
    </div>
  </div>
</body>
</html>`;
renderHtmlToPng(seqHtml, 'sequence_diagram', 1000, 560);
