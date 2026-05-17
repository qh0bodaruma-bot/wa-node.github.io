const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'public', 'images');
const destDir = path.join(srcDir, 'unused');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log('Created unused directory:', destDir);
}

const unusedFiles = [
  'QR_LINE.png',
  'QR_coconala.png',
  'QR_crowdworks.png',
  'QR_lancers.png',
  'cloudsign-guide.png',
  'hero.png',
  'panda-zen.png',
  'react.svg',
  'security_action.jpg',
  'vite.svg',
  'works-automation.png',
  'favicon.png',
  'favicon.svg',
  'icons.svg'
];

unusedFiles.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file);
  if (fs.existsSync(srcPath)) {
    fs.renameSync(srcPath, destPath);
    console.log(`Moved: \${file} -> unused/\${file}`);
  } else {
    console.log(`Skipped (not found): \${file}`);
  }
});
console.log('Unused images clean up completed!');
