const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\x1b[36m%s\x1b[0m', 'Stopping any running Node.js processes...');
try {
  execSync('taskkill /f /im node.exe', { stdio: 'inherit' });
} catch (error) {
  console.log('\x1b[33m%s\x1b[0m', 'No Node.js processes found to stop.');
}

console.log('\x1b[36m%s\x1b[0m', 'Clearing cache...');
const cachePaths = [
  path.join(__dirname, 'node_modules', '.cache'),
  path.join(__dirname, 'board', 'node_modules', '.cache'),
  path.join(__dirname, 'widget', 'node_modules', '.cache')
];

cachePaths.forEach(cachePath => {
  if (fs.existsSync(cachePath)) {
    try {
      fs.rmSync(cachePath, { recursive: true, force: true });
      console.log(`Cleared cache: ${cachePath}`);
    } catch (error) {
      console.error(`Error clearing cache at ${cachePath}:`, error);
    }
  }
});

console.log('\x1b[32m%s\x1b[0m', 'Starting applications...');
try {
  execSync('npm start', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting applications:', error);
} 