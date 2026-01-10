// Simple PWA Icon Generator using Sharp (Node.js)
// Run: node generate-icons.js

const fs = require('fs');
const path = require('path');

console.log('📱 PWA Icon Generator');
console.log('====================\n');

// Check if sharp is installed
try {
  require.resolve('sharp');
} catch (e) {
  console.log('❌ Sharp package not found!');
  console.log('\nPlease install it first:');
  console.log('  npm install sharp\n');
  console.log('Or use the online tool:');
  console.log('  https://realfavicongenerator.net/\n');
  process.exit(1);
}

const sharp = require('sharp');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSVG = path.join(__dirname, 'public', 'images', 'sycamore-logo-hd.svg');
const outputDir = path.join(__dirname, 'public', 'icons');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate icons
async function generateIcons() {
  console.log('Converting SVG to PNG icons...\n');
  
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(inputSVG)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`  ✓ Generated icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`  ✗ Failed to generate ${size}x${size}:`, error.message);
    }
  }
  
  console.log('\n✅ All icons generated successfully!');
  console.log(`\nIcons saved to: ${outputDir}`);
  console.log('\n🚀 Your app is now ready to be installed as a PWA!');
}

// Check if input file exists
if (!fs.existsSync(inputSVG)) {
  console.error(`❌ Logo file not found: ${inputSVG}`);
  console.log('\nPlease ensure the logo exists at:');
  console.log('  public/images/sycamore-logo-hd.svg\n');
  process.exit(1);
}

generateIcons().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
