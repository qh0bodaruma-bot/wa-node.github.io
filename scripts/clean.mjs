import { execSync } from 'child_process';
import fs from 'fs';

if (fs.existsSync('dist')) {
  try {
    if (process.platform === 'win32') {
      // Use PowerShell on Windows to avoid file locking issues that cause fs.rmSync to fail
      execSync('powershell -Command "if (Test-Path dist) { Remove-Item -Recurse -Force dist }"');
    } else {
      fs.rmSync('dist', { recursive: true, force: true });
    }
    console.log('Successfully cleaned dist directory.');
  } catch (err) {
    console.error('Failed to clean dist directory:', err);
    process.exit(1);
  }
}
