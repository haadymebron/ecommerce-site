const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  // Run the build
  console.log('Building client...');
  execSync('cd client && npm install && npm run build', { stdio: 'inherit' });

  // Copy dist to root
  const src = path.join(__dirname, 'client', 'dist');
  const dst = path.join(__dirname, 'dist');
  
  if (fs.existsSync(src)) {
    if (fs.existsSync(dst)) {
      fs.rmSync(dst, { recursive: true });
    }
    fs.cpSync(src, dst, { recursive: true });
    console.log('✓ Copied client/dist to ./dist');
  } else {
    console.error('Error: client/dist not found after build');
    process.exit(1);
  }
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
