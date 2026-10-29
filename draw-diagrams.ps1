Add-Type -AssemblyName System.Drawing

$assetsDir = "C:\Users\HARI CHANDER I\.gemini\antigravity\scratch\railway-station-app\report_assets"
if (-not (Test-Path $assetsDir)) { New-Item -ItemType Directory -Path $assetsDir -Force }

function Draw-RoundedRectangle($graphics, $pen, $brush, $x, $y, $w, $h, $radius) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $radius * 2
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

# Title
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
        $g.DrawString($c.T, $fontCardT, $brushDark, $cardX + 8, $cardY + 8)
        $rectDesc = New-Object System.Drawing.RectangleF($cardX + 8, $cardY + 28, $cardW - 16, $cardH - 32)
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

# 2. Use Case Diagram
$bmpUC = New-Object System.Drawing.Bitmap(1000, 620)
$g = [System.Drawing.Graphics]::FromImage($bmpUC)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.Clear([System.Drawing.Color]::White)

$titleUC = "FIGURE 4.2: USE CASE DIAGRAM - RAILWAY FACILITY AND MANAGEMENT"
$titleSize = $g.MeasureString($titleUC, $fontTitle)
$g.DrawString($titleUC, $fontTitle, $brushNavy, (1000 - $titleSize.Width)/2, 20)
$g.DrawLine((New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(15, 39, 68), 2)), 50, 52, 950, 52)

$penSys = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(37, 99, 235), 2)
$penSys.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
$brushSys = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 250, 252))
Draw-RoundedRectangle $g $penSys $brushSys 200 75 600 510 10
$g.DrawString("SYSTEM BOUNDARY: RAILWAY FACILITY AND ACCESSIBILITY MANAGEMENT", $fontTier, $brushNavy, 220, 88)

function Draw-StickActor($graphics, $x, $y, $name) {
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(15, 39, 68), 2.5)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(241, 245, 249))
    $graphics.FillEllipse($brush, $x - 14, $y, 28, 28)
    $graphics.DrawEllipse($pen, $x - 14, $y, 28, 28)
    $graphics.DrawLine($pen, $x, $y + 28, $x, $y + 65)
    $graphics.DrawLine($pen, $x - 22, $y + 40, $x + 22, $y + 40)
    $graphics.DrawLine($pen, $x, $y + 65, $x - 18, $y + 100)
    $graphics.DrawLine($pen, $x, $y + 65, $x + 18, $y + 100)
    $font = New-Object System.Drawing.Font("Arial", 9.5, [System.Drawing.FontStyle]::Bold)
    $size = $graphics.MeasureString($name, $font)
    $graphics.DrawString($name, $font, (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 39, 68))), $x - ($size.Width/2), $y + 106)
}

Draw-StickActor $g 100 120 "General Commuter"
Draw-StickActor $g 100 340 "Divyangjan Passenger"
Draw-StickActor $g 900 120 "Station Superintendent"
Draw-StickActor $g 900 340 "RPF / System Admin"

$useCases = @(
    "UC-1: Search Station Amenities and Restrooms",
    "UC-2: View Interactive Platform Blueprint",
    "UC-3: Navigate Step-Free Tactile Route Minimap",
    "UC-4: Track Live Suburban and Mainline Train GPS",
    "UC-5: Synthesize 4-Note Chime and Trilingual PA Voice",
    "UC-6: Select Female / Male Announcer Profile",
    "UC-7: Real-Time Platform Crowd Density Heatmap",
    "UC-8: Trigger Instant Emergency SOS Help",
    "UC-9: Report and Search Lost and Found Articles",
    "UC-10: Toggle WCAG AAA High-Contrast Mode",
    "UC-11: Update Facility Operational Status (Staff)",
    "UC-12: Broadcast Security and Platform Alerts (Admin)"
)

$penUC = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(37, 99, 235), 1.5)
$brushUC = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(239, 246, 255))
$fontUC = New-Object System.Drawing.Font("Arial", 9, [System.Drawing.FontStyle]::Bold)

for ($i = 0; $i -lt $useCases.Count; $i++) {
    $col = $i % 2
    $row = [Math]::Floor($i / 2)
    $ucX = 230 + $col * 280
    $ucY = 125 + $row * 72
    $ucW = 260
    $ucH = 46
    
    $uBrush = $brushUC
    $uPen = $penUC
    if ($i -eq 7) {
        $uBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(254, 242, 242))
        $uPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(220, 38, 38), 1.5)
    } elseif ($i -ge 10) {
        $uBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(236, 253, 245))
        $uPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(5, 150, 105), 1.5)
    }
    
    Draw-RoundedRectangle $g $uPen $uBrush $ucX $ucY $ucW $ucH 20
    
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect = New-Object System.Drawing.RectangleF($ucX, $ucY, $ucW, $ucH)
    $g.DrawString($useCases[$i], $fontUC, $brushNavy, $rect, $sf)
    
    $penConn = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(148, 163, 184), 1)
    if ($col -eq 0) {
        $actorY = if ($row -lt 3) { 170 } else { 390 }
        $g.DrawLine($penConn, 140, $actorY, $ucX, $ucY + 23)
    } else {
        $actorY = if ($row -lt 4) { 170 } else { 390 }
        $g.DrawLine($penConn, 860, $actorY, $ucX + $ucW, $ucY + 23)
    }
}

$bmpUC.Save("$assetsDir\usecase_diagram.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmpUC.Dispose()
Write-Host "Created usecase_diagram.png"

# 3. ER and Class Diagram
$bmpER = New-Object System.Drawing.Bitmap(1000, 660)
$g = [System.Drawing.Graphics]::FromImage($bmpER)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.Clear([System.Drawing.Color]::White)

$titleER = "FIGURE 4.3: ENTITY RELATIONSHIP (ER) AND DATA SCHEMA DIAGRAM"
$titleSize = $g.MeasureString($titleER, $fontTitle)
$g.DrawString($titleER, $fontTitle, $brushNavy, (1000 - $titleSize.Width)/2, 20)
$g.DrawLine((New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(15, 39, 68), 2)), 50, 52, 950, 52)

$entities = @(
    @{
        Name = "USER (Passenger / Staff)"
        Color = [System.Drawing.Color]::FromArgb(15, 39, 68)
        Attrs = @(
            "PK _id : ObjectId",
            "name : String",
            "email : String [Unique]",
            "passwordHash : String [Bcrypt]",
            "phone : String",
            "role : Enum ['passenger','staff','admin']",
            "isDivyangjan : Boolean",
            "preferredLang : Enum ['hi','ta','en']",
            "createdAt : Date"
        )
    },
    @{
        Name = "FACILITY (Amenity / Kiosk)"
        Color = [System.Drawing.Color]::FromArgb(3, 105, 161)
        Attrs = @(
            "PK _id : ObjectId",
            "facilityCode : String ('RESTROOM-1')",
            "name : String",
            "category : Enum ['Restroom','Lift','Buggy']",
            "platformNo : Number [1..17]",
            "coordinates : Object {x, y, floor}",
            "isWheelchairAccessible : Boolean",
            "crowdDensity : Enum ['Low','Moderate','High']",
            "status : Enum ['Open','Maintenance']"
        )
    },
    @{
        Name = "TRAIN (Mainline and Suburban)"
        Color = [System.Drawing.Color]::FromArgb(180, 83, 9)
        Attrs = @(
            "PK _id : ObjectId",
            "trainNumber : String ('12804')",
            "trainName : String ('Swarna Jayanti')",
            "originStation : String ('NZM')",
            "destinationStation : String ('VSKP')",
            "platformAssigned : Number [3]",
            "scheduledDeparture : Date",
            "currentSpeed : Number [92 km/h]",
            "corridorLine : Enum ['West','North','South','MRTS']",
            "status : Enum ['On Time','Delayed']"
        )
    },
    @{
        Name = "EMERGENCY SOS ALERT"
        Color = [System.Drawing.Color]::FromArgb(124, 58, 237)
        Attrs = @(
            "PK _id : ObjectId",
            "FK reportedBy : ObjectId (Ref: User)",
            "emergencyType : Enum ['Medical','Security','Buggy']",
            "platformNo : Number",
            "locationDesc : String",
            "resolvedStatus : Enum ['Pending','Dispatched','Resolved']",
            "dispatchedUnit : String ('RPF Unit 3')",
            "timestamp : Date"
        )
    },
    @{
        Name = "STATION BROADCAST ALERT"
        Color = [System.Drawing.Color]::FromArgb(220, 38, 38)
        Attrs = @(
            "PK _id : ObjectId",
            "title : String",
            "message : String",
            "severity : Enum ['Info','Warning','Critical']",
            "applicablePlatform : Number / 'ALL'",
            "isActive : Boolean",
            "expiresAt : Date"
        )
    },
    @{
        Name = "PA ANNOUNCEMENT LOG"
        Color = [System.Drawing.Color]::FromArgb(5, 150, 105)
        Attrs = @(
            "PK _id : ObjectId",
            "FK trainId : ObjectId (Ref: Train)",
            "chimeChords : Array ['D5','F#5','A5','D6']",
            "hindiScript : String (Hindi text)",
            "tamilScript : String (Tamil text)",
            "englishScript : String ('Attention please...')",
            "announcerVoice : Enum ['Female (1.18x)','Male (0.7x)']",
            "broadcastTimestamp : Date"
        )
    }
)

$fontH = New-Object System.Drawing.Font("Arial", 10.5, [System.Drawing.FontStyle]::Bold)
$fontAttr = New-Object System.Drawing.Font("Consolas", 9, [System.Drawing.FontStyle]::Regular)
$fontPK = New-Object System.Drawing.Font("Consolas", 9, [System.Drawing.FontStyle]::Bold)

for ($i = 0; $i -lt $entities.Count; $i++) {
    $e = $entities[$i]
    $col = $i % 3
    $row = [Math]::Floor($i / 3)
    $eX = 50 + $col * 310
    $eY = 75 + $row * 270
    $eW = 280
    $eH = 245
    
    Draw-RoundedRectangle $g (New-Object System.Drawing.Pen($e.Color, 2)) (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)) $eX $eY $eW $eH 6
    
    $headerBrush = New-Object System.Drawing.SolidBrush($e.Color)
    $g.FillRectangle($headerBrush, $eX, $eY, $eW, 30)
    $g.DrawString($e.Name, $fontH, (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)), $eX + 8, $eY + 6)
    
    $aY = $eY + 36
    foreach ($attr in $e.Attrs) {
        $f = $fontAttr
        $b = $brushDark
        if ($attr.StartsWith("PK")) { $b = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 38, 38)); $f = $fontPK }
        if ($attr.StartsWith("FK")) { $b = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(37, 99, 235)); $f = $fontPK }
        $g.DrawString($attr, $f, $b, $eX + 10, $aY)
        $g.DrawLine((New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(241, 245, 249), 1)), $eX + 6, $aY + 20, $eX + $eW - 6, $aY + 20)
        $aY += 22
    }
}

$relPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(100, 116, 139), 2)
$relPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
$g.DrawLine($relPen, 190, 320, 190, 345)
$g.DrawLine($relPen, 810, 320, 810, 345)

$bannerText = "DATA RELATIONSHIPS: User (1:N) Dispatches EmergencyAlert  |  Train (1:N) Generates PA Announcements  |  Platform Associates Facilities"
$bSize = $g.MeasureString($bannerText, $fontCardT)
$g.DrawString($bannerText, $fontCardT, $brushNavy, (1000 - $bSize.Width)/2, 625)

$bmpER.Save("$assetsDir\er_diagram.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmpER.Dispose()
Write-Host "Created er_diagram.png"

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
    $lX = $lane.X
    Draw-RoundedRectangle $g (New-Object System.Drawing.Pen($lane.Color, 2)) (New-Object System.Drawing.SolidBrush($lane.Color)) ($lX - 65) 75 130 35 6
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString($lane.Name, $fontCardT, (New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)), (New-Object System.Drawing.RectangleF($lX - 65, 75, 130, 35)), $sf)
    
    $pLine = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(203, 213, 225), 1.5)
    $pLine.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $g.DrawLine($pLine, $lX, 110, $lX, 560)
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
    $sY = $s.Y
    $fX = $s.From
    $tX = $s.To
    $p = New-Object System.Drawing.Pen($s.Col, 2)
    if ($s.Ret) { $p.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash }
    $g.DrawLine($p, $fX, $sY, $tX, $sY)
    
    if ($tX -gt $fX) {
        $g.FillPolygon((New-Object System.Drawing.SolidBrush($s.Col)), @(
            (New-Object System.Drawing.PointF($tX, $sY)),
            (New-Object System.Drawing.PointF($tX - 8, $sY - 4)),
            (New-Object System.Drawing.PointF($tX - 8, $sY + 4))
        ))
    } else {
        $g.FillPolygon((New-Object System.Drawing.SolidBrush($s.Col)), @(
            (New-Object System.Drawing.PointF($tX, $sY)),
            (New-Object System.Drawing.PointF($tX + 8, $sY - 4)),
            (New-Object System.Drawing.PointF($tX + 8, $sY + 4))
        ))
    }
    
    $lSize = $g.MeasureString($s.Label, $fontCardD)
    $midX = ($fX + $tX) / 2
    $labelRect = New-Object System.Drawing.RectangleF($midX - ($lSize.Width/2) - 4, $sY - 18, $lSize.Width + 8, 16)
    $g.FillRectangle((New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)), $labelRect)
    $g.DrawRectangle((New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(226, 232, 240), 1)), $labelRect.X, $labelRect.Y, $labelRect.Width, $labelRect.Height)
    $g.DrawString($s.Label, $fontCardD, $brushDark, $midX - ($lSize.Width/2), $sY - 17)
}

$bmpSeq.Save("$assetsDir\sequence_diagram.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmpSeq.Dispose()
Write-Host "Created sequence_diagram.png"
