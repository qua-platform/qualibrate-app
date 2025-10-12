const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// This script converts SVG icon to PNG format for PWA compatibility
// Usage: node convert-icons.js <path-to-svg-file>
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'assets', 'icons');
const inputSvg = process.argv[2] || path.join(__dirname, '..', '..', '..', 'tmp', 'QM_white.svg');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function convertSvgToPng(size) {
  return new Promise((resolve, reject) => {
    const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);

    // Use ImageMagick convert to create PNG with specific size
    const convert = spawn('magick', ['convert', inputSvg, '-resize', `${size}x${size}`, '-background', 'none', pngPath]);

    convert.on('error', (err) => {
      reject(new Error(`ImageMagick not found. Please install ImageMagick or use create-png-icons.html`));
    });

    convert.on('close', (code) => {
      if (code === 0) {
        console.log(`Created PNG icon: icon-${size}x${size}.png`);
        resolve();
      }
    });
  });
}

(async () => {
  if (!fs.existsSync(inputSvg)) {
    console.error(`Error: SVG file not found at ${inputSvg}`);
    console.log('Usage: node convert-icons.js <path-to-svg-file>');
    process.exit(1);
  }

  console.log(`Converting ${inputSvg} to PNG icons...`);

  try {
    for (const size of sizes) {
      await convertSvgToPng(size);
    }
    console.log('\\nAll PNG icons created successfully!');
    console.log('Icons saved to:', iconsDir);
  } catch (error) {
    console.error('Error creating icons:', error.message);
    console.log('\\nAlternative: Open frontend/tools/create-png-icons.html in your browser');
  }
})();