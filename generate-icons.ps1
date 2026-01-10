# PWA Icon Generator (PowerShell)
# Run this script to generate PWA icons from the logo

Write-Host "Generating PWA Icons for Sycamore Church App" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Create icons directory
New-Item -Path "public/icons" -ItemType Directory -Force | Out-Null

# Icon sizes needed for PWA
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

# Check if ImageMagick is installed
$magickPath = Get-Command magick -ErrorAction SilentlyContinue

if (-not $magickPath) {
    Write-Host "ImageMagick not found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please install ImageMagick to generate icons:" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 1: Install with Chocolatey (recommended)" -ForegroundColor Green
    Write-Host "  choco install imagemagick" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 2: Download from https://imagemagick.org/script/download.php" -ForegroundColor Green
    Write-Host ""
    Write-Host "Option 3: Use online tool (no installation needed)" -ForegroundColor Green
    Write-Host "  1. Visit https://realfavicongenerator.net/" -ForegroundColor Gray
    Write-Host "  2. Upload public/images/sycamore-logo-hd.svg" -ForegroundColor Gray
    Write-Host "  3. Download and extract to public/icons/" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

# Convert SVG to PNG icons
Write-Host "Converting logo to PNG icons..." -ForegroundColor White
foreach ($size in $sizes) {
    $output = "public/icons/icon-${size}x${size}.png"
    Write-Host "  Generating ${size}x${size}..." -ForegroundColor Green
    & magick convert -background none -resize "${size}x${size}" public/images/sycamore-logo-hd.svg $output
}

Write-Host ""
Write-Host "All icons generated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Icons created in: public/icons/" -ForegroundColor White
Write-Host "  - icon-72x72.png" -ForegroundColor Gray
Write-Host "  - icon-96x96.png" -ForegroundColor Gray
Write-Host "  - icon-128x128.png" -ForegroundColor Gray
Write-Host "  - icon-144x144.png" -ForegroundColor Gray
Write-Host "  - icon-152x152.png" -ForegroundColor Gray
Write-Host "  - icon-192x192.png" -ForegroundColor Gray
Write-Host "  - icon-384x384.png" -ForegroundColor Gray
Write-Host "  - icon-512x512.png" -ForegroundColor Gray
Write-Host ""
Write-Host "Your app is now ready to be installed as a PWA!" -ForegroundColor Cyan

