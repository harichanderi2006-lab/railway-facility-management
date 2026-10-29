# ============================================================
# Railway Station Facility Navigation & Accessibility System
# One-Click Setup Script for Windows PowerShell
# ============================================================

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Railway Station Navigation & Accessibility System" -ForegroundColor Cyan
Write-Host "  Setup Script" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $scriptDir "backend"
$frontendDir = Join-Path $scriptDir "frontend"

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "  Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "  Please install Node.js from https://nodejs.org (v18 or higher)" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check MongoDB
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
Write-Host "  NOTE: Make sure MongoDB is running on localhost:27017" -ForegroundColor DarkYellow
Write-Host "  Download: https://www.mongodb.com/try/download/community" -ForegroundColor DarkYellow
Write-Host ""

# Install Backend Dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location $backendDir
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Backend npm install failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  Backend dependencies installed!" -ForegroundColor Green
Write-Host ""

# Install Frontend Dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location $frontendDir
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Frontend npm install failed!" -ForegroundColor Red
    exit 1
}
Write-Host "  Frontend dependencies installed!" -ForegroundColor Green
Write-Host ""

# Seed Database
Write-Host "Do you want to seed the database with sample data? (y/n)" -ForegroundColor Yellow
$seedChoice = Read-Host
if ($seedChoice -eq 'y' -or $seedChoice -eq 'Y') {
    Write-Host "Seeding database..." -ForegroundColor Yellow
    Set-Location $backendDir
    npm run seed
    Write-Host "  Database seeded!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "========================================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application, open TWO terminal windows:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "    cd backend" -ForegroundColor White
Write-Host "    npm run dev" -ForegroundColor White
Write-Host "    -> API runs at http://localhost:5000" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "    cd frontend" -ForegroundColor White
Write-Host "    npm run dev" -ForegroundColor White
Write-Host "    -> App runs at http://localhost:3000" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Admin Login: admin / admin123" -ForegroundColor Magenta
Write-Host "  Staff Login: staff@station.com / staff123" -ForegroundColor Magenta
Write-Host ""

Read-Host "Press Enter to exit"
