const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  try {
    if (!fs.existsSync(src)) {
      console.warn(`Source directory does not exist, skipping: ${src}`);
      return;
    }
    fs.mkdirSync(dest, { recursive: true });
    fs.cpSync(src, dest, { recursive: true, force: true });
    console.log(`Successfully copied ${src} to ${dest}`);
  } catch (err) {
    console.error(`Failed to copy ${src} to ${dest}:`, err.message);
    process.exit(1);
  }
}

const root = path.resolve(__dirname, '..');
copyDir(path.join(root, '.next/static'), path.join(root, '.next/standalone/.next/static'));
copyDir(path.join(root, 'public'), path.join(root, '.next/standalone/public'));
