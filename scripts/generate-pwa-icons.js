const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'public', 'icons', 'icon-192x192.png');
const outputDir = path.join(__dirname, '..', 'public', 'icons');

const sizes = [192, 512];
const iconTypes = [
  { prefix: 'icon', maskable: false },
  { prefix: 'maskable', maskable: true }
];

async function generateIcons() {
  if (!fs.existsSync(inputPath)) {
    console.error('Input file not found:', inputPath);
    console.log('Please ensure you have an icon-192x192.png file in public/icons/');
    return;
  }

  console.log('Generating PWA icons...');

  for (const iconType of iconTypes) {
    for (const size of sizes) {
      const filename = `${iconType.prefix}-${size}x${size}.png`;
      const outputPath = path.join(outputDir, filename);

      try {
        let image = sharp(inputPath);

        if (iconType.maskable) {
          // For maskable icons, add padding and background
          const background = { r: 22, g: 163, b: 74 }; // #16a34a
          image = image
            .resize(Math.floor(size * 0.8), Math.floor(size * 0.8))
            .extend({
              top: Math.floor(size * 0.1),
              bottom: Math.floor(size * 0.1),
              left: Math.floor(size * 0.1),
              right: Math.floor(size * 0.1),
              background: background
            });
        } else {
          // For regular icons, just resize
          image = image.resize(size, size);
        }

        await image.png().toFile(outputPath);
        console.log(`✓ Generated ${filename}`);
      } catch (error) {
        console.error(`Error generating ${filename}:`, error);
      }
    }
  }

  console.log('PWA icon generation complete!');
  console.log('Files generated:');
  console.log('- icon-192x192.png');
  console.log('- icon-512x512.png');
  console.log('- maskable-192x192.png');
  console.log('- maskable-512x512.png');
}

// Run the script
if (require.main === module) {
  generateIcons().catch(console.error);
}

module.exports = { generateIcons };