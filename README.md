# 🚉 Railway Station Facility Navigation & Accessibility System

A full-stack **MERN** web application for real-time railway station navigation, facility tracking, and accessibility support — built for passengers, especially the elderly and differently-abled.

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Pages & Modules](#pages--modules)
- [Real-Time Events](#real-time-events)
- [API Endpoints](#api-endpoints)
- [Default Credentials](#default-credentials)
- [Accessibility Features](#accessibility-features)

---

## ✨ Features

### 🗺️ Navigation
- **Interactive SVG Station Map** — Clickable facility nodes on a realistic station floor plan
- **Wheelchair Route Highlighter** — Toggle to show accessible-only paths (elevators, ramps)
- **Floor Switcher** — Ground / Platform 1 / Platform 2 views
- **Facility Search** — Search and pulse-highlight any facility on the map

### ⚡ Real-Time Features (Socket.io)
| Feature | Update Interval |
|---|---|
| Live Train Arrivals/Departures | Every 15 seconds |
| Crowd Density Heatmap | Every 10 seconds |
| Facility Availability (toilet/lift/ATM) | On change |
| Emergency Alerts Broadcast | Instant |
| SOS Emergency Dispatch | Instant |
| Lost & Found Reports | Instant |

### ♿ Accessibility
- **High-Contrast Mode** — Toggle for visual impairment
- **Large Text Mode** — Font scaling with A+ button
- **Screen Reader / Voice** — Web Speech API reads facility info aloud
- **Audio Train Announcements** — Text-to-speech departure updates
- **Large Tap Targets** — Optimized for elderly/motor-impaired users
- **ARIA Labels** — Full screen-reader compatibility
- **Sugamya Bharat Compliant** — Indian accessibility standards

### 🔴 Emergency & Safety
- **Floating SOS Button** — Present on every page
- **SOS Categories**: Medical, Wheelchair Help, Lost Child, Security
- **Admin Emergency Broadcast** — Alert all passengers instantly
- **Helpline Integration** — 139 (Railway), 182 (Police), 112 (Emergency)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite + React Router v6 |
| **Styling** | Tailwind CSS + Custom Theme |
| **Real-time Client** | Socket.io-client |
| **HTTP Client** | Axios |
| **Backend** | Node.js + Express.js |
| **Real-time Server** | Socket.io |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT + bcryptjs |
| **Notifications** | React Hot Toast |

---

## 📁 Project Structure

```
railway-station-app/
├── backend/
│   ├── models/
│   │   ├── Train.js          # Train schedule & status
│   │   ├── Facility.js       # Station facilities
│   │   ├── Alert.js          # Emergency/info alerts
│   │   ├── LostFound.js      # Lost & Found items
│   │   ├── CrowdData.js      # Crowd density readings
│   │   └── User.js           # Users with accessibility prefs
│   ├── routes/
│   │   ├── trains.js         # Train CRUD + status updates
│   │   ├── facilities.js     # Facility CRUD + nearby finder
│   │   ├── alerts.js         # Alert management
│   │   ├── lostFound.js      # Lost & Found CRUD + search
│   │   ├── crowd.js          # Crowd data recording
│   │   └── users.js          # Auth (register/login/profile)
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── socket/
│   │   └── socketHandler.js  # All Socket.io event handlers
│   ├── .env                  # Environment config
│   ├── seed.js               # Database seeder
│   └── server.js             # Express + Socket.io app
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Top navigation bar
│   │   │   ├── Footer.jsx         # Footer with helplines
│   │   │   ├── StationMap.jsx     # Interactive SVG map
│   │   │   ├── LiveTrainTicker.jsx # Scrolling train ticker
│   │   │   ├── CrowdBadge.jsx     # Color-coded crowd badge
│   │   │   └── SOSButton.jsx      # Floating SOS button
│   │   ├── context/
│   │   │   ├── SocketContext.jsx  # Socket.io connection & events
│   │   │   └── AccessibilityContext.jsx # Accessibility toggles
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # Home with quick actions
│   │   │   ├── TrainStatus.jsx    # Live train board
│   │   │   ├── Facilities.jsx     # Facility directory
│   │   │   ├── LostFound.jsx      # Lost & Found portal
│   │   │   ├── Alerts.jsx         # Alert center
│   │   │   ├── SOSPage.jsx        # Emergency SOS page
│   │   │   └── AdminDashboard.jsx # Staff admin console
│   │   ├── utils/
│   │   │   ├── api.js             # Axios instance with JWT
│   │   │   └── mockData.js        # Offline sample data
│   │   ├── App.jsx                # Routes configuration
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Tailwind + accessibility CSS
│   ├── vite.config.js             # Vite dev server + proxy
│   └── package.json
│
├── setup.ps1             # ← Run this to install everything!
└── README.md
```

---

## 📦 Prerequisites

1. **Node.js** v18+ — https://nodejs.org
2. **MongoDB** — https://www.mongodb.com/try/download/community
   - Start MongoDB service before running the app
   - Default connection: `mongodb://localhost:27017/railway_station_db`

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```powershell
# Right-click setup.ps1 → "Run with PowerShell"
# OR in PowerShell terminal:
.\setup.ps1
```

### Option 2: Manual Setup

**Step 1 — Install backend dependencies:**
```bash
cd backend
npm install
```

**Step 2 — Seed database with sample data:**
```bash
npm run seed
```

**Step 3 — Start backend:**
```bash
npm run dev
# Backend runs at http://localhost:5000
```

**Step 4 — Install frontend dependencies (new terminal):**
```bash
cd frontend
npm install
```

**Step 5 — Start frontend:**
```bash
npm run dev
# Frontend runs at http://localhost:3000
```

---

## 📱 Pages & Modules

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | Quick actions, live stats, crowd heatmap |
| `/map` | Station Map | Interactive SVG floor plan |
| `/trains` | Train Status | Live arrivals/departures board |
| `/facilities` | Facilities | Directory with filters & nearest search |
| `/lost-found` | Lost & Found | Report/search lost items |
| `/alerts` | Alerts | Emergency & information alerts |
| `/sos` | SOS Help | Emergency assistance request |
| `/admin` | Admin | Staff console (login required) |

---

## 📡 Real-Time Events (Socket.io)

### Server → Client
| Event | Payload | Description |
|---|---|---|
| `trainUpdate` | train object | Train status/delay changed |
| `crowdUpdate` | `{area, level, count}[]` | Crowd density per area |
| `facilityUpdate` | facility object | Facility availability changed |
| `newAlert` | alert object | New station alert posted |
| `emergencyAlert` | alert object | Emergency broadcast |
| `sosAlert` | `{category, area, userId}` | SOS triggered |
| `lostFoundReported` | item object | New lost/found report |

### Client → Server
| Event | Payload | Description |
|---|---|---|
| `sosAlert` | `{category, area, message}` | Trigger SOS help request |
| `joinArea` | `area` (string) | Subscribe to area updates |
| `leaveArea` | `area` (string) | Unsubscribe from area |
| `emergencyAlert` | `{message, area}` | Admin emergency broadcast |

---

## 🔌 API Endpoints

### Trains
```
GET    /api/trains                    # All trains (filter: ?status=delayed&search=)
GET    /api/trains/platform/:platform # Trains at platform
GET    /api/trains/:id                # Single train
POST   /api/trains                    # Create train
PUT    /api/trains/:id/status         # Update status/delay
PUT    /api/trains/:id                # Full update
DELETE /api/trains/:id                # Delete
```

### Facilities
```
GET    /api/facilities                         # All (filter: ?type=toilet&floor=1&isAccessible=true)
GET    /api/facilities/type/:type              # By category
GET    /api/facilities/nearby?x=&y=&floor=    # Nearest to coordinates
GET    /api/facilities/:id                     # Single facility
POST   /api/facilities                         # Create
PUT    /api/facilities/:id/availability        # Update availability/crowd
PUT    /api/facilities/:id                     # Full update
DELETE /api/facilities/:id                     # Delete
```

### Alerts
```
GET    /api/alerts          # Active alerts (?all=true for history)
POST   /api/alerts          # Create & broadcast alert
PUT    /api/alerts/:id/deactivate  # Deactivate
DELETE /api/alerts/:id      # Delete
```

### Lost & Found
```
GET    /api/lost-found                  # All items (filter: ?status=lost&category=)
GET    /api/lost-found/search?q=       # Full-text search
GET    /api/lost-found/:id             # Single item
POST   /api/lost-found                 # Report item
PUT    /api/lost-found/:id/status      # Update status
DELETE /api/lost-found/:id             # Delete
```

### Crowd Data
```
GET    /api/crowd        # Latest crowd per all areas
GET    /api/crowd/:area  # Area detail + history
POST   /api/crowd        # Record crowd reading (broadcasts update)
```

### Users / Auth
```
POST   /api/users/register   # Register with accessibility preferences
POST   /api/users/login      # Login → returns JWT
GET    /api/users/profile    # Protected: view profile
PUT    /api/users/profile    # Protected: update profile
```

---

## 🔑 Default Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin` | `admin123` |
| **Staff** | `staff@station.com` | `staff123` |
| **Passenger** | `passenger@example.com` | `pass123` |

---

## ♿ Accessibility Features

- **High-Contrast Mode** — Toggle in navbar for visual impairment
- **Font Size Toggle (A+)** — Enlarges all text for readability
- **Voice Guidance** — Reads facility directions aloud
- **Audio Announcements** — Speaks train departures automatically
- **Large Touch Targets** — All buttons ≥ 44×44px (WCAG AA)
- **ARIA Labels** — Full screen-reader support
- **Keyboard Navigation** — Tab-accessible throughout
- **Offline Mode** — Works with mock data if backend is unavailable
- **Sugamya Bharat** — Aligned with India's accessibility guidelines

---

## 📞 Emergency Contacts
- 🚂 **Railway Emergency**: 139
- 👮 **Railway Police (RPF)**: 182
- 🚨 **National Emergency**: 112
- 🏥 **Medical**: 108
