Add-Type -AssemblyName System.Drawing

$assetsDir = "C:\Users\HARI CHANDER I\.gemini\antigravity\scratch\railway-station-app\report_assets"
if (-not (Test-Path $assetsDir)) { New-Item -ItemType Directory -Path $assetsDir -Force }

function Draw-RoundedRectangle($graphics, $pen, $brush, [float]$x, [float]$y, [float]$w, [float]$h, [float]$radius) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = [float]($radius * 2)
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    if ($brush) { $graphics.FillPath($brush, $path) }
    if ($pen) { $graphics.DrawPath($pen, $path) }
    $path.Dispose()
}

# 1. System Architecture Diagram
$bmpArch = New-Object System.Drawing.Bitmap(1000, 700)
$g = [System.Drawing.Graphics]::FromImage($bmpArch)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.Clear([System.Drawing.Color]::White)

$fontTitle = New-Object System.Drawing.Font("Times New Roman", 15, [System.Drawing.FontStyle]::Bold)
$fontTier = New-Object System.Drawing.Font("Arial", 11.5, [System.Drawing.FontStyle]::Bold)
$fontCardT = New-Object System.Drawing.Font("Arial", 10, [System.Drawing.FontStyle]::Bold)
$fontCardD = New-Object System.Drawing.Font("Arial", 8.5, [System.Drawing.FontStyle]::Regular)
$fontArrow = New-Object System.Drawing.Font("Segoe UI", 9.5, [System.Drawing.FontStyle]::Bold)

$brushNavy = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 39, 68))
$brushDark = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 41, 59))
$brushMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100, 116, 139))
$penBorder = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(203, 213, 225), 1.5)

$title = "FIGURE 4.1: SYSTEM ARCHITECTURE - RAILWAY FACILITY AND MANAGEMENT"
$titleSize = $g.MeasureString($title, $fontTitle)
$g.DrawString($title, $fontTitle, $brushNavy, (1000 - $titleSize.Width)/2, 20)
$g.DrawLine((New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(15, 39, 68), 2)), 50, 52, 950, 52)

$tiers = @(
    @{
        Title = "1. CLIENT AND USER PRESENTATION LAYER"
        Bg = [System.Drawing.Color]::FromArgb(240, 247, 255)
        Border = [System.Drawing.Color]::FromArgb(59, 130, 246)
        Cards = @(
            @{ T = "General Commuters"; D = "Interactive terminal map, departures and directions" },
            @{ T = "Divyangjan Commuters"; D = "Wheelchair tactile paths and buggy dispatch" },
            @{ T = "Station Superintendent"; D = "Real-time crowd heatmaps and operations desk" },
            @{ T = "RPF Security Patrol"; D = "Emergency SOS telemetry and broadcast console" }
        )
    },
    @{
        Title = "2. FRONTEND PRESENTATION TIER (React 18 + Vite)"
        Bg = [System.Drawing.Color]::FromArgb(245, 243, 255)
        Border = [System.Drawing.Color]::FromArgb(139, 92, 246)
        Cards = @(
            @{ T = "Interactive SVG Blueprint"; D = "17 platforms, concourses, lifts and foot-bridges" },
            @{ T = "Station PA and Chime Studio"; D = "Web Audio API 4-note bell + Trilingual Voice" },
            @{ T = "Suburban Transit Tracker"; D = "4 arterial corridor tracking (92 km/h speeds)" },
            @{ T = "WCAG AAA Accessibility"; D = "Yellow-on-black mode, font scaling, voice guide" }
        )
    },
    @{
        Title = "3. APPLICATION AND BUSINESS LOGIC TIER (Node.js + Express.js)"
        Bg = [System.Drawing.Color]::FromArgb(236, 253, 245)
        Border = [System.Drawing.Color]::FromArgb(16, 185, 129)
        Cards = @(
            @{ T = "JWT and RBAC Security"; D = "Bcryptjs hashing, role-based endpoint guards" },
            @{ T = "Facility Router and Minimap"; D = "Turn-by-turn coordinate geometry calculation" },
            @{ T = "Socket.io Live Engine"; D = "Platform crowd sensor telemetry and SOS alerts" },
            @{ T = "Train Telemetry Service"; D = "Mainline and Suburban live delay and speed updates" }
        )
    },
    @{
        Title = "4. PERSISTENCE AND DATABASE TIER (MongoDB)"
        Bg = [System.Drawing.Color]::FromArgb(255, 251, 235)
        Border = [System.Drawing.Color]::FromArgb(245, 158, 11)
        Cards = @(
            @{ T = "Users Collection"; D = "Passenger and staff credentials, roles, profiles" },
            @{ T = "Facilities Collection"; D = "Restrooms, clinics, elevators, buggy kiosks" },
            @{ T = "Trains Collection"; D = "12804 Swarna Jayanti, schedules, platforms" },
            @{ T = "Alerts and SOS Collection"; D = "Incident logs, lost and found items, audit trails" }
        )
    }
)

$yPos = 70
for ($i = 0; $i -lt $tiers.Count; $i++) {
    $tier = $tiers[$i]
    $tierPen = New-Object System.Drawing.Pen($tier.Border, 2)
    $tierBrush = New-Object System.Drawing.SolidBrush($tier.Bg)
    Draw-RoundedRectangle $g $tierPen $tierBrush 50 $yPos 900 115 8
    
    $g.DrawString($tier.Title, $fontTier, (New-Object System.Drawing.SolidBrush($tier.Border)), 65, $yPos + 8)
    
    $cardW = 205
    $cardH = 65
    $cardY = $yPos + 38
    for ($j = 0; $j -lt 4; $j++) {
        $cardX = 65 + $j * ($cardW + 20)
        Draw-RoundedRectangle $g $penBorder (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)) $cardX $cardY $cardW $cardH 6
        $c = $tier.Cards[$j]
        $g.DrawString($c.T, $fontCardT, $brushDark, [float]($cardX + 8), [float]($cardY + 8))
        
        $rectDesc = New-Object System.Drawing.RectangleF([float]($cardX + 8), [float]($cardY + 28), [float]($cardW - 16), [float]($cardH - 32))
        $g.DrawString($c.D, $fontCardD, $brushMuted, $rectDesc)
    }
    
    if ($i -lt $tiers.Count - 1) {
        $arrowStr = "HTTP / HTTPS REST APIs  |  Full-Duplex Socket.io WebSocket Stream"
        if ($i -eq 2) { $arrowStr = "Mongoose ODM Schema Validation  |  TCP Connection Pool" }
        $arrowSize = $g.MeasureString($arrowStr, $fontArrow)
        $g.DrawString($arrowStr, $fontArrow, $brushMuted, (1000 - $arrowSize.Width)/2, $yPos + 120)
    }
    
    $yPos += 145
}

$bmpArch.Save("$assetsDir\architecture_diagram.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmpArch.Dispose()
Write-Host "Created architecture_diagram.png"

# 4. Sequence Diagram
$bmpSeq = New-Object System.Drawing.Bitmap(1000, 600)
$g = [System.Drawing.Graphics]::FromImage($bmpSeq)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.Clear([System.Drawing.Color]::White)

$titleSeq = "FIGURE 4.4: SEQUENCE DIAGRAM - AMENITY NAVIGATION AND PA BROADCAST"
$titleSize = $g.MeasureString($titleSeq, $fontTitle)
$g.DrawString($titleSeq, $fontTitle, $brushNavy, (1000 - $titleSize.Width)/2, 20)
$g.DrawLine((New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(15, 39, 68), 2)), 50, 52, 950, 52)

$lanes = @(
    @{ Name = "Commuter"; Color = [System.Drawing.Color]::FromArgb(15, 39, 68); X = 100 },
    @{ Name = "React Frontend"; Color = [System.Drawing.Color]::FromArgb(2, 132, 199); X = 300 },
    @{ Name = "Express Backend"; Color = [System.Drawing.Color]::FromArgb(5, 150, 105); X = 500 },
    @{ Name = "MongoDB DB"; Color = [System.Drawing.Color]::FromArgb(217, 119, 6); X = 700 },
    @{ Name = "Web Audio & TTS"; Color = [System.Drawing.Color]::FromArgb(124, 58, 237); X = 900 }
)

foreach ($lane in $lanes) {
    $lX = [float]$lane.X
    Draw-RoundedRectangle $g (New-Object System.Drawing.Pen($lane.Color, 2)) (New-Object System.Drawing.SolidBrush($lane.Color)) ($lX - 65) 75 130 35 6
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString($lane.Name, $fontCardT, (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)), (New-Object System.Drawing.RectangleF($lX - 65, 75, 130, 35)), $sf)
    
    $pLine = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(203, 213, 225), 1.5)
    $pLine.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $g.DrawLine($pLine, [float]$lX, [float]110, [float]$lX, [float]560)
}

$steps = @(
    @{ From = 100; To = 300; Label = "1. Click 'Restroom 1' or 'Announce 12804'"; Y = 140; Ret = $false; Col = [System.Drawing.Color]::FromArgb(37, 99, 235) },
    @{ From = 300; To = 500; Label = "2. GET /api/facilities/restroom-1 (JWT Token)"; Y = 190; Ret = $false; Col = [System.Drawing.Color]::FromArgb(5, 150, 105) },
    @{ From = 500; To = 700; Label = "3. Facility.findOne({ code: 'RESTROOM-1' })"; Y = 240; Ret = $false; Col = [System.Drawing.Color]::FromArgb(217, 119, 6) },
    @{ From = 700; To = 500; Label = "4. Document returned: Coordinates and Crowd Level"; Y = 290; Ret = $true; Col = [System.Drawing.Color]::FromArgb(100, 116, 139) },
    @{ From = 500; To = 300; Label = "5. 200 OK: Turn-by-Turn SVG Waypoints and Telemetry"; Y = 340; Ret = $true; Col = [System.Drawing.Color]::FromArgb(100, 116, 139) },
    @{ From = 300; To = 900; Label = "6. playChime(): 4-Note Melodic Bell (D5 -> F#5 -> A5 -> D6)"; Y = 390; Ret = $false; Col = [System.Drawing.Color]::FromArgb(124, 58, 237) },
    @{ From = 300; To = 900; Label = "7. speak(): Trilingual Voice (Hindi, Tamil, English)"; Y = 440; Ret = $false; Col = [System.Drawing.Color]::FromArgb(124, 58, 237) },
    @{ From = 300; To = 100; Label = "8. Render animated walking minimap and LED ticker"; Y = 490; Ret = $true; Col = [System.Drawing.Color]::FromArgb(37, 99, 235) }
)

foreach ($s in $steps) {
    [float]$sY = $s.Y
    [float]$fX = $s.From
    [float]$tX = $s.To
    $p = New-Object System.Drawing.Pen($s.Col, 2)
    if ($s.Ret) { $p.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash }
    $g.DrawLine($p, $fX, $sY, $tX, $sY)
    
    $p1 = New-Object System.Drawing.PointF($tX, $sY)
    if ($tX -gt $fX) {
        $p2 = New-Object System.Drawing.PointF($tX - 8, $sY - 4)
        $p3 = New-Object System.Drawing.PointF($tX - 8, $sY + 4)
    } else {
        $p2 = New-Object System.Drawing.PointF($tX + 8, $sY - 4)
        $p3 = New-Object System.Drawing.PointF($tX + 8, $sY + 4)
    }
    $polyPoints = [System.Drawing.PointF[]]@($p1, $p2, $p3)
    $g.FillPolygon((New-Object System.Drawing.SolidBrush($s.Col)), $polyPoints)
    
    $lSize = $g.MeasureString($s.Label, $fontCardD)
    [float]$midX = ($fX + $tX) / 2
    [float]$rectX = $midX - ($lSize.Width / 2) - 4
    [float]$rectY = $sY - 18
    [float]$rectW = $lSize.Width + 8
    [float]$rectH = 16
    
    $g.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)), $rectX, $rectY, $rectW, $rectH)
    $g.DrawRectangle((New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(226, 232, 240), 1)), $rectX, $rectY, $rectW, $rectH)
    $g.DrawString($s.Label, $fontCardD, $brushDark, [float]($midX - ($lSize.Width/2)), [float]($sY - 17))
}

$bmpSeq.Save("$assetsDir\sequence_diagram.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmpSeq.Dispose()
Write-Host "Created sequence_diagram.png"
