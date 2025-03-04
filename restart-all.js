const { execSync } = require('child_process');
const os = require('os');

console.log('Stopping any running Node.js processes...');
try {
  if (os.platform() === 'win32') {
    execSync('taskkill /f /im node.exe', { stdio: 'inherit' });
  } else {
    execSync('pkill -f node', { stdio: 'inherit' });
  }
} catch (error) {
  console.log('No Node.js processes found to stop or error stopping processes.');
}

console.log('Starting applications...');
try {
  execSync('npm start', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting applications:', error);
} 