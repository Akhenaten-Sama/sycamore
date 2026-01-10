#!/bin/bash

# PWA Icon Generator Script
# This script generates PWA icons from the logo SVG

echo "🎨 Generating PWA Icons for Sycamore Church App"
echo "================================================"
echo ""

# Create icons directory
mkdir -p public/icons

# Icon sizes needed for PWA
SIZES=(72 96 128 144 152 192 384 512)

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick not found!"
    echo ""
    echo "Please install ImageMagick to generate icons:"
    echo ""
    echo "Windows (with Chocolatey):"
    echo "  choco install imagemagick"
    echo ""
    echo "macOS (with Homebrew):"
    echo "  brew install imagemagick"
    echo ""
    echo "Linux (Ubuntu/Debian):"
    echo "  sudo apt-get install imagemagick"
    echo ""
    echo "Alternatively, you can:"
    echo "1. Use an online tool like https://realfavicongenerator.net/"
    echo "2. Upload public/images/sycamore-logo-hd.svg"
    echo "3. Download the generated icons to public/icons/"
    echo ""
    exit 1
fi

# Convert SVG to PNG icons
echo "Converting logo to PNG icons..."
for size in "${SIZES[@]}"; do
    echo "  ✓ Generating ${size}x${size}..."
    convert -background none -resize ${size}x${size} public/images/sycamore-logo-hd.svg public/icons/icon-${size}x${size}.png
done

echo ""
echo "✅ All icons generated successfully!"
echo ""
echo "Icons created in: public/icons/"
echo "  - icon-72x72.png"
echo "  - icon-96x96.png"
echo "  - icon-128x128.png"
echo "  - icon-144x144.png"
echo "  - icon-152x152.png"
echo "  - icon-192x192.png"
echo "  - icon-384x384.png"
echo "  - icon-512x512.png"
echo ""
echo "🚀 Your app is now ready to be installed as a PWA!"
