#!/bin/bash

# PWA Icon Generator using ImageMagick
MAGICK="/c/Program Files/ImageMagick-7.1.2-Q16-HDRI/magick.exe"

echo "🎨 Generating PWA Icons for Sycamore Church App"
echo "================================================"
echo ""

# Create icons directory
mkdir -p public/icons

# Icon sizes
sizes=(72 96 128 144 152 192 384 512)

echo "Converting logo to PNG icons..."
echo ""

for size in "${sizes[@]}"; do
    echo "  ✓ Generating ${size}x${size}..."
    "$MAGICK" public/images/sycamore-logo-hd.svg -background none -resize ${size}x${size} "public/icons/icon-${size}x${size}.png"
done

echo ""
echo "✅ All icons generated successfully!"
echo ""
echo "Icons created in: public/icons/"
ls -lh public/icons/*.png | awk '{print "  - " $9 " (" $5 ")"}'
echo ""
echo "🚀 Your app is now ready to be installed as a PWA!"
